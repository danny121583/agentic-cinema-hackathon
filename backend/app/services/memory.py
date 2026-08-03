from typing import Dict, List, Optional

from app.models.project import ProjectResponse
from app.models.research import ResearchPlan, SearchExecution, Finding, ProductionBrief, ActivityEvent
from app.services.base import StorageProvider

class InMemoryStorage(StorageProvider):
    def __init__(self) -> None:
        self._store: Dict[str, ProjectResponse] = {}
        self._plans: Dict[str, ResearchPlan] = {}
        self._executions: Dict[str, List[SearchExecution]] = {}
        self._findings: Dict[str, List[Finding]] = {}
        self._briefs: Dict[str, ProductionBrief] = {}
        self._events: Dict[str, List[ActivityEvent]] = {}

    async def create_project(self, project: ProjectResponse) -> ProjectResponse:
        self._store[project.id] = project
        return project

    async def get_project(self, project_id: str) -> Optional[ProjectResponse]:
        return self._store.get(project_id)

    async def list_projects(self) -> List[ProjectResponse]:
        return list(self._store.values())

    async def update_project(self, project: ProjectResponse) -> ProjectResponse:
        self._store[project.id] = project
        return project

    async def delete_project(self, project_id: str) -> bool:
        if project_id in self._store:
            del self._store[project_id]
            self._plans.pop(project_id, None)
            self._executions.pop(project_id, None)
            self._findings.pop(project_id, None)
            self._briefs.pop(project_id, None)
            self._events.pop(project_id, None)
            return True
        return False

    async def save_research_plan(self, project_id: str, plan: ResearchPlan) -> ResearchPlan:
        self._plans[project_id] = plan
        return plan

    async def get_research_plan(self, project_id: str) -> Optional[ResearchPlan]:
        return self._plans.get(project_id)

    async def save_search_execution(self, execution: SearchExecution) -> SearchExecution:
        if execution.project_id not in self._executions:
            self._executions[execution.project_id] = []
        self._executions[execution.project_id].append(execution)
        return execution

    async def get_search_executions(self, project_id: str) -> List[SearchExecution]:
        return self._executions.get(project_id, [])

    async def save_finding(self, finding: Finding) -> Finding:
        if finding.project_id not in self._findings:
            self._findings[finding.project_id] = []
        # Update if exists, otherwise append
        findings = self._findings[finding.project_id]
        for i, f in enumerate(findings):
            if f.id == finding.id:
                findings[i] = finding
                return finding
        findings.append(finding)
        return finding

    async def get_findings(self, project_id: str) -> List[Finding]:
        return self._findings.get(project_id, [])

    async def save_production_brief(self, brief: ProductionBrief) -> ProductionBrief:
        self._briefs[brief.project_id] = brief
        return brief

    async def get_production_brief(self, project_id: str) -> Optional[ProductionBrief]:
        return self._briefs.get(project_id)

    async def log_activity_event(self, event: ActivityEvent) -> ActivityEvent:
        if event.project_id not in self._events:
            self._events[event.project_id] = []
        self._events[event.project_id].append(event)
        return event

    async def get_activity_events(self, project_id: str) -> List[ActivityEvent]:
        return self._events.get(project_id, [])
