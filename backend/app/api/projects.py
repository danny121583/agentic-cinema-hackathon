import uuid
from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from pydantic import BaseModel

from app.agents.script_breakdown_agent import ScriptBreakdownAgent
from app.agents.research_planner_agent import ResearchPlannerAgent
from app.agents.evidence_conflict_agent import EvidenceConflictAgent
from app.agents.production_brief_agent import ProductionBriefAgent
from app.tools.parallel_search import ParallelSearchClient
from app.config import settings
from app.models.project import ProjectCreate, ProjectResponse
from app.models.research import (
    WorkflowState, ResearchPlan, SearchExecution, Finding, ProductionBrief, ActivityEvent, AgentState, FindingStatus
)
from app.services.base import StorageProvider
from app.services.firestore import FirestoreStorage
from app.services.memory import InMemoryStorage

router = APIRouter()

storage: StorageProvider
if settings.scenescout_use_in_memory_store:
    storage = InMemoryStorage()
else:
    storage = FirestoreStorage()

breakdown_agent = ScriptBreakdownAgent()
planner_agent = ResearchPlannerAgent()
conflict_agent = EvidenceConflictAgent()
brief_agent = ProductionBriefAgent()
search_client = ParallelSearchClient()

def get_storage() -> StorageProvider:
    return storage

@router.post("/projects", response_model=ProjectResponse)
async def create_project(
    project_in: ProjectCreate,
    store: StorageProvider = Depends(get_storage)
) -> ProjectResponse:
    project_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc)

    project = ProjectResponse(
        id=project_id,
        title=project_in.title,
        scene_text=project_in.scene_text,
        notes=project_in.notes,
        status="processing",
        workflow_state=WorkflowState.DRAFT,
        created_at=now,
        updated_at=now,
        breakdown=None
    )

    try:
        breakdown = breakdown_agent.analyze(
            project_id=project.id,
            title=project.title,
            scene_text=project.scene_text,
            notes=project.notes
        )
        project.breakdown = breakdown
        project.status = "completed"
        project.workflow_state = WorkflowState.BREAKDOWN_COMPLETE
    except Exception as e:
        project.status = f"error: {str(e)}"

    project.updated_at = datetime.now(timezone.utc)
    await store.create_project(project)
    
    await store.log_activity_event(ActivityEvent(
        id=str(uuid.uuid4()),
        project_id=project.id,
        agent_name="ScriptBreakdownAgent",
        action="Created breakdown",
        status=AgentState.COMPLETE,
        started_timestamp=now,
        completed_timestamp=datetime.now(timezone.utc)
    ))
    
    return project

@router.get("/projects", response_model=List[ProjectResponse])
async def list_projects(store: StorageProvider = Depends(get_storage)) -> List[ProjectResponse]:
    return await store.list_projects()

@router.get("/projects/{project_id}", response_model=ProjectResponse)
async def get_project(project_id: str, store: StorageProvider = Depends(get_storage)) -> ProjectResponse:
    project = await store.get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.post("/projects/{project_id}/research/plan", response_model=ResearchPlan)
async def generate_research_plan(project_id: str, store: StorageProvider = Depends(get_storage)) -> ResearchPlan:
    project = await store.get_project(project_id)
    if not project or not project.breakdown:
        raise HTTPException(status_code=404, detail="Project or breakdown not found")

    now = datetime.now(timezone.utc)
    try:
        plan = planner_agent.plan(project_id, project.breakdown)
        await store.save_research_plan(project_id, plan)
        
        project.workflow_state = WorkflowState.RESEARCH_PLAN_READY
        project.updated_at = datetime.now(timezone.utc)
        await store.update_project(project)
        
        await store.log_activity_event(ActivityEvent(
            id=str(uuid.uuid4()),
            project_id=project.id,
            agent_name="ResearchPlannerAgent",
            action="Generated research plan",
            status=AgentState.COMPLETE,
            started_timestamp=now,
            completed_timestamp=datetime.now(timezone.utc)
        ))
        
        return plan
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/projects/{project_id}/research/plan", response_model=ResearchPlan)
async def get_research_plan(project_id: str, store: StorageProvider = Depends(get_storage)) -> ResearchPlan:
    plan = await store.get_research_plan(project_id)
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    return plan

class RunResearchRequest(BaseModel):
    question_ids: List[str]

@router.post("/projects/{project_id}/research/run")
async def run_research(project_id: str, req: RunResearchRequest, background_tasks: BackgroundTasks, store: StorageProvider = Depends(get_storage)):
    project = await store.get_project(project_id)
    plan = await store.get_research_plan(project_id)
    if not project or not plan:
        raise HTTPException(status_code=404, detail="Project or plan not found")

    project.workflow_state = WorkflowState.RESEARCH_RUNNING
    await store.update_project(project)

    # We use FastAPI's BackgroundTasks for asynchronous execution
    background_tasks.add_task(execute_research_workflow, project_id, req.question_ids, plan, store)
    return {"status": "started"}

async def execute_research_workflow(project_id: str, question_ids: List[str], plan: ResearchPlan, store: StorageProvider):
    # Execute the research workflow asynchronously
    for q in plan.questions:
        if q.id in question_ids:
            now = datetime.now(timezone.utc)
            try:
                # 1. Search
                res = await search_client.search(q.question, q.search_objective)
                
                # Format to our Source schema
                sources = []
                for s in res.results:
                    from app.models.research import Source
                    sources.append(Source(
                        title=s.get("title", ""),
                        url=s.get("url", ""),
                        publisher=s.get("publisher", ""),
                        publication_date=s.get("publish_date", ""),
                        access_date=now.isoformat(),
                        excerpt=str(s.get("excerpts", []))
                    ))
                
                exec_record = SearchExecution(
                    id=str(uuid.uuid4()),
                    project_id=project_id,
                    question_id=q.id,
                    exact_query=res.query,
                    search_objective=q.search_objective,
                    search_mode="advanced",
                    requested_timestamp=now,
                    completed_timestamp=datetime.now(timezone.utc),
                    duration_ms=1000,
                    status=AgentState.COMPLETE,
                    returned_sources=sources,
                    error_details=None,
                    agent_requested="ParallelSearchClient"
                )
                await store.save_search_execution(exec_record)

                # 2. Evaluate
                finding = conflict_agent.evaluate(project_id, q, exec_record)
                await store.save_finding(finding)
                
                await store.log_activity_event(ActivityEvent(
                    id=str(uuid.uuid4()),
                    project_id=project_id,
                    agent_name="EvidenceConflictAgent",
                    action=f"Evaluated evidence for {q.category.value}",
                    status=AgentState.COMPLETE,
                    started_timestamp=now,
                    completed_timestamp=datetime.now(timezone.utc),
                    related_question_id=q.id
                ))
            except Exception as e:
                await store.log_activity_event(ActivityEvent(
                    id=str(uuid.uuid4()),
                    project_id=project_id,
                    agent_name="EvidenceConflictAgent",
                    action=f"Failed to evaluate {q.category.value}",
                    status=AgentState.FAILED,
                    started_timestamp=now,
                    completed_timestamp=datetime.now(timezone.utc),
                    related_question_id=q.id,
                    error_message=str(e)
                ))
    
    project = await store.get_project(project_id)
    if project:
        project.workflow_state = WorkflowState.FINDINGS_UNDER_REVIEW
        await store.update_project(project)

@router.get("/projects/{project_id}/findings", response_model=List[Finding])
async def get_findings(project_id: str, store: StorageProvider = Depends(get_storage)) -> List[Finding]:
    return await store.get_findings(project_id)

class UpdateFindingStatusRequest(BaseModel):
    status: FindingStatus
    note: str | None = None

@router.post("/projects/{project_id}/findings/{finding_id}/status", response_model=Finding)
async def update_finding_status(project_id: str, finding_id: str, req: UpdateFindingStatusRequest, store: StorageProvider = Depends(get_storage)) -> Finding:
    findings = await store.get_findings(project_id)
    finding = next((f for f in findings if f.id == finding_id), None)
    if not finding:
        raise HTTPException(status_code=404, detail="Finding not found")
    
    finding.status = req.status
    if req.note:
        finding.user_note = req.note
    
    await store.save_finding(finding)
    return finding

@router.post("/projects/{project_id}/brief", response_model=ProductionBrief)
async def generate_brief(project_id: str, store: StorageProvider = Depends(get_storage)) -> ProductionBrief:
    project = await store.get_project(project_id)
    findings = await store.get_findings(project_id)
    
    if not project or not project.breakdown:
        raise HTTPException(status_code=404, detail="Project not found")

    now = datetime.now(timezone.utc)
    try:
        brief = brief_agent.generate(project_id, project.breakdown, findings)
        await store.save_production_brief(brief)
        
        project.workflow_state = WorkflowState.BRIEF_READY
        project.updated_at = datetime.now(timezone.utc)
        await store.update_project(project)
        
        await store.log_activity_event(ActivityEvent(
            id=str(uuid.uuid4()),
            project_id=project.id,
            agent_name="ProductionBriefAgent",
            action="Generated production brief",
            status=AgentState.COMPLETE,
            started_timestamp=now,
            completed_timestamp=datetime.now(timezone.utc)
        ))
        
        return brief
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/projects/{project_id}/brief", response_model=ProductionBrief)
async def get_brief(project_id: str, store: StorageProvider = Depends(get_storage)) -> ProductionBrief:
    brief = await store.get_production_brief(project_id)
    if not brief:
        raise HTTPException(status_code=404, detail="Brief not found")
    return brief

@router.get("/projects/{project_id}/activity", response_model=List[ActivityEvent])
async def get_activity(project_id: str, store: StorageProvider = Depends(get_storage)) -> List[ActivityEvent]:
    return await store.get_activity_events(project_id)
