from typing import List, Optional

import firebase_admin
from firebase_admin import firestore

from app.models.project import ProjectResponse
from app.models.research import ResearchPlan, SearchExecution, Finding, ProductionBrief, ActivityEvent
from app.services.base import StorageProvider

class FirestoreStorage(StorageProvider):
    def __init__(self) -> None:
        if not firebase_admin._apps:
            import os
            import json
            from firebase_admin import credentials
            
            cred_json = os.environ.get("FIREBASE_SERVICE_ACCOUNT_JSON")
            if cred_json:
                cred = credentials.Certificate(json.loads(cred_json))
                firebase_admin.initialize_app(cred)
            else:
                firebase_admin.initialize_app()
        self.db = firestore.client()
        self.collection = self.db.collection('projects')

    async def create_project(self, project: ProjectResponse) -> ProjectResponse:
        doc_ref = self.collection.document(project.id)
        doc_ref.set(project.model_dump(mode="json"))
        return project

    async def get_project(self, project_id: str) -> Optional[ProjectResponse]:
        doc = self.collection.document(project_id).get()
        if doc.exists:
            return ProjectResponse(**doc.to_dict())
        return None

    async def list_projects(self) -> List[ProjectResponse]:
        docs = self.collection.order_by('created_at', direction=firestore.Query.DESCENDING).stream()
        return [ProjectResponse(**doc.to_dict()) for doc in docs]

    async def update_project(self, project: ProjectResponse) -> ProjectResponse:
        doc_ref = self.collection.document(project.id)
        doc_ref.set(project.model_dump(mode="json"))
        return project

    async def save_research_plan(self, project_id: str, plan: ResearchPlan) -> ResearchPlan:
        doc_ref = self.collection.document(project_id).collection('research_plans').document(plan.id)
        doc_ref.set(plan.model_dump(mode="json"))
        return plan

    async def get_research_plan(self, project_id: str) -> Optional[ResearchPlan]:
        docs = self.collection.document(project_id).collection('research_plans').order_by('generated_timestamp', direction=firestore.Query.DESCENDING).limit(1).stream()
        for doc in docs:
            return ResearchPlan(**doc.to_dict())
        return None

    async def save_search_execution(self, execution: SearchExecution) -> SearchExecution:
        doc_ref = self.collection.document(execution.project_id).collection('search_executions').document(execution.id)
        doc_ref.set(execution.model_dump(mode="json"))
        return execution

    async def get_search_executions(self, project_id: str) -> List[SearchExecution]:
        docs = self.collection.document(project_id).collection('search_executions').order_by('requested_timestamp', direction=firestore.Query.DESCENDING).stream()
        return [SearchExecution(**doc.to_dict()) for doc in docs]

    async def save_finding(self, finding: Finding) -> Finding:
        doc_ref = self.collection.document(finding.project_id).collection('findings').document(finding.id)
        doc_ref.set(finding.model_dump(mode="json"))
        return finding

    async def get_findings(self, project_id: str) -> List[Finding]:
        docs = self.collection.document(project_id).collection('findings').order_by('generated_timestamp', direction=firestore.Query.DESCENDING).stream()
        return [Finding(**doc.to_dict()) for doc in docs]

    async def save_production_brief(self, brief: ProductionBrief) -> ProductionBrief:
        doc_ref = self.collection.document(brief.project_id).collection('briefs').document(brief.id)
        doc_ref.set(brief.model_dump(mode="json"))
        return brief

    async def get_production_brief(self, project_id: str) -> Optional[ProductionBrief]:
        docs = self.collection.document(project_id).collection('briefs').order_by('generated_timestamp', direction=firestore.Query.DESCENDING).limit(1).stream()
        for doc in docs:
            return ProductionBrief(**doc.to_dict())
        return None

    async def log_activity_event(self, event: ActivityEvent) -> ActivityEvent:
        doc_ref = self.collection.document(event.project_id).collection('activity_events').document(event.id)
        doc_ref.set(event.model_dump(mode="json"))
        return event

    async def get_activity_events(self, project_id: str) -> List[ActivityEvent]:
        docs = self.collection.document(project_id).collection('activity_events').order_by('started_timestamp', direction=firestore.Query.ASCENDING).stream()
        return [ActivityEvent(**doc.to_dict()) for doc in docs]
