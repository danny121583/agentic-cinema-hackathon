from datetime import datetime
from typing import List, Optional
from enum import Enum
from pydantic import BaseModel, Field

class WorkflowState(str, Enum):
    DRAFT = "draft"
    BREAKDOWN_COMPLETE = "breakdown_complete"
    RESEARCH_PLAN_READY = "research_plan_ready"
    RESEARCH_RUNNING = "research_running"
    RESEARCH_PARTIALLY_COMPLETE = "research_partially_complete"
    RESEARCH_COMPLETE = "research_complete"
    FINDINGS_UNDER_REVIEW = "findings_under_review"
    BRIEF_READY = "brief_ready"
    FAILED = "failed"

class AgentState(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETE = "complete"
    FAILED = "failed"
    SKIPPED = "skipped"

class ResearchPriority(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"

class ResearchCategory(str, Enum):
    HISTORICAL = "historical"
    CULTURAL = "cultural"
    LOCATIONS = "locations"
    WEATHER = "weather"
    PROPS = "props"
    WARDROBE = "wardrobe"
    VEHICLES = "vehicles"
    REGULATIONS = "regulations"
    SAFETY = "safety"
    LOGISTICS = "logistics"
    VENDORS = "vendors"
    RIGHTS = "rights"
    OTHER = "other"

class FindingConfidence(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    INSUFFICIENT = "insufficient evidence"

class FindingStatus(str, Enum):
    DRAFT = "draft"
    APPROVED = "approved"
    REJECTED = "rejected"

class ResearchQuestionDetail(BaseModel):
    id: str
    category: ResearchCategory
    priority: ResearchPriority
    question: str
    search_objective: str
    why_it_matters: str
    production_decision_affected: str
    requires_current_web: bool
    status: AgentState = AgentState.PENDING
    selected: bool = True

class ResearchPlan(BaseModel):
    id: str
    project_id: str
    questions: List[ResearchQuestionDetail]
    status: AgentState = AgentState.PENDING
    generated_timestamp: datetime
    model_metadata: str

class Source(BaseModel):
    title: str
    url: str
    publisher: Optional[str]
    publication_date: Optional[str]
    access_date: str
    excerpt: Optional[str]

class Finding(BaseModel):
    id: str
    project_id: str
    question_id: str
    claim: str
    evidence_summary: str
    supporting_sources: List[Source]
    conflicting_sources: List[Source]
    confidence_level: FindingConfidence
    confidence_explanation: str
    freshness_assessment: str
    geographic_relevance: str
    production_relevance: str
    limitations: str
    human_review_recommendation: str
    status: FindingStatus = FindingStatus.DRAFT
    user_note: Optional[str] = None
    generated_timestamp: datetime
    model_metadata: str

class SearchExecution(BaseModel):
    id: str
    project_id: str
    question_id: str
    exact_query: str
    search_objective: str
    search_mode: str
    requested_timestamp: datetime
    completed_timestamp: Optional[datetime]
    duration_ms: Optional[int]
    status: AgentState
    returned_sources: List[Source]
    error_details: Optional[str]
    agent_requested: str

class ProductionBrief(BaseModel):
    id: str
    project_id: str
    executive_summary: str
    production_recommendations: List[str]
    historical_cultural_guidance: List[str]
    location_guidance: List[str]
    prop_guidance: List[str]
    wardrobe_guidance: List[str]
    vehicle_guidance: List[str]
    weather_guidance: List[str]
    safety_guidance: List[str]
    logistics_guidance: List[str]
    continuity_guidance: List[str]
    open_questions: List[str]
    human_review_items: List[str]
    source_index: List[Source]
    generated_timestamp: datetime
    model_metadata: str
    status: AgentState

class ActivityEvent(BaseModel):
    id: str
    project_id: str
    agent_name: str
    action: str
    status: AgentState
    started_timestamp: datetime
    completed_timestamp: Optional[datetime] = None
    duration_ms: Optional[int] = None
    related_question_id: Optional[str] = None
    error_message: Optional[str] = None
