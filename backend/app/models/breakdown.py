from datetime import datetime
from typing import List

from pydantic import BaseModel, Field


class ResearchQuestion(BaseModel):
    question: str = Field(..., description="The specific question to research.")
    reason: str = Field(..., description="Why this question is important for the production.")

class ScriptBreakdown(BaseModel):
    project_id: str
    project_title: str
    short_scene_summary: str
    setting: str
    time_period: str
    time_of_day: str
    interior_or_exterior: str
    characters: List[str]
    locations: List[str]
    props: List[str]
    wardrobe_requirements: List[str]
    vehicles: List[str]
    weather_requirements: List[str]
    safety_considerations: List[str]
    logistical_considerations: List[str]
    continuity_risks: List[str]
    unresolved_questions: List[str] = Field(..., description="Details that are unclear or missing from the text.")
    research_questions: List[ResearchQuestion] = Field(..., description="Targeted questions for web research.")

    generated_timestamp: datetime
    model_metadata: str
    status: str
