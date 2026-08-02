import json
import uuid
from datetime import datetime, timezone

from google import genai
from google.genai import types

from app.config import settings
from app.models.research import ResearchPlan, ResearchQuestionDetail, AgentState, ResearchCategory, ResearchPriority
from app.models.breakdown import ScriptBreakdown

MOCK_RESEARCH_PLAN = ResearchPlan(
    id="mock-plan",
    project_id="mock-id",
    status=AgentState.COMPLETE,
    generated_timestamp=datetime.now(timezone.utc),
    model_metadata="MOCK_AI",
    questions=[
        ResearchQuestionDetail(
            id=str(uuid.uuid4()),
            category=ResearchCategory.SAFETY,
            priority=ResearchPriority.HIGH,
            question="What permits are required for rain machines in downtown alleyways?",
            search_objective="Find local film permit regulations regarding water usage and street closures.",
            why_it_matters="Safety and legal compliance for a night shoot.",
            production_decision_affected="Scheduling and location feasibility",
            requires_current_web=True
        )
    ]
)

class ResearchPlannerAgent:
    def __init__(self) -> None:
        self.client: genai.Client | None
        if not settings.scenescout_use_mock_ai:
            if settings.google_genai_use_vertexai:
                self.client = genai.Client(vertexai=True, project=settings.google_cloud_project, location=settings.google_cloud_location)
            else:
                self.client = genai.Client(api_key=settings.gemini_api_key)
        else:
            self.client = None

    def plan(self, project_id: str, breakdown: ScriptBreakdown) -> ResearchPlan:
        if settings.scenescout_use_mock_ai:
            mock_result = MOCK_RESEARCH_PLAN.model_copy()
            mock_result.project_id = project_id
            mock_result.id = f"plan_{project_id}"
            return mock_result

        prompt = f"""Generate a structured research plan for this script breakdown.
Convert the unresolved questions and research needs into structured Parallel search queries.

Breakdown Context:
Setting: {breakdown.setting}
Time Period: {breakdown.time_period}
Locations: {breakdown.locations}
Props: {breakdown.props}
Safety: {breakdown.safety_considerations}
Logistics: {breakdown.logistical_considerations}

Generate specific, actionable research questions that require web search.
For each question, specify the category, priority, exact search objective, why it matters, and what production decision it affects.
"""

        try:
            if not self.client:
                raise RuntimeError("Client not initialized for real mode.")
                
            response = self.client.models.generate_content(
                model=settings.gemini_model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=ResearchPlan,
                    temperature=0.2,
                ),
            )
            
            data = json.loads(response.text or "{}")
            data['project_id'] = project_id
            data['id'] = f"plan_{uuid.uuid4().hex[:8]}"
            data['status'] = AgentState.COMPLETE
            data['model_metadata'] = settings.gemini_model
            
            if 'generated_timestamp' not in data:
                data['generated_timestamp'] = datetime.now(timezone.utc).isoformat()
            
            # Ensure each question has a UUID
            for q in data.get('questions', []):
                if 'id' not in q:
                    q['id'] = str(uuid.uuid4())
                if 'status' not in q:
                    q['status'] = AgentState.PENDING
                if 'selected' not in q:
                    q['selected'] = True

            return ResearchPlan(**data)

        except Exception as e:
            raise RuntimeError(f"Agent failed to produce research plan: {e}") from e
