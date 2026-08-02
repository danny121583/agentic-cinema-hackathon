from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

from app.models.breakdown import ScriptBreakdown


from app.models.research import WorkflowState

class ProjectCreate(BaseModel):
    title: str = Field(..., min_length=1)
    scene_text: str = Field(..., min_length=1)
    notes: Optional[str] = None

class ProjectResponse(BaseModel):
    id: str
    title: str
    scene_text: str
    notes: Optional[str]
    status: str
    workflow_state: WorkflowState = WorkflowState.DRAFT
    created_at: datetime
    updated_at: datetime
    breakdown: Optional[ScriptBreakdown] = None
