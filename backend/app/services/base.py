from abc import ABC, abstractmethod
from typing import List, Optional

from app.models.project import ProjectResponse
from app.models.research import ResearchPlan, SearchExecution, Finding, ProductionBrief, ActivityEvent

class StorageProvider(ABC):
    @abstractmethod
    async def create_project(self, project: ProjectResponse) -> ProjectResponse:
        pass

    @abstractmethod
    async def get_project(self, project_id: str) -> Optional[ProjectResponse]:
        pass

    @abstractmethod
    async def list_projects(self) -> List[ProjectResponse]:
        pass

    @abstractmethod
    async def update_project(self, project: ProjectResponse) -> ProjectResponse:
        pass

    @abstractmethod
    async def save_research_plan(self, project_id: str, plan: ResearchPlan) -> ResearchPlan:
        pass

    @abstractmethod
    async def get_research_plan(self, project_id: str) -> Optional[ResearchPlan]:
        pass

    @abstractmethod
    async def save_search_execution(self, execution: SearchExecution) -> SearchExecution:
        pass

    @abstractmethod
    async def get_search_executions(self, project_id: str) -> List[SearchExecution]:
        pass

    @abstractmethod
    async def save_finding(self, finding: Finding) -> Finding:
        pass

    @abstractmethod
    async def get_findings(self, project_id: str) -> List[Finding]:
        pass

    @abstractmethod
    async def save_production_brief(self, brief: ProductionBrief) -> ProductionBrief:
        pass

    @abstractmethod
    async def get_production_brief(self, project_id: str) -> Optional[ProductionBrief]:
        pass

    @abstractmethod
    async def log_activity_event(self, event: ActivityEvent) -> ActivityEvent:
        pass

    @abstractmethod
    async def get_activity_events(self, project_id: str) -> List[ActivityEvent]:
        pass
