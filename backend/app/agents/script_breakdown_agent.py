import json
from datetime import datetime, timezone

from google import genai
from google.genai import types

from app.config import settings
from app.models.breakdown import ResearchQuestion, ScriptBreakdown

MOCK_BREAKDOWN = ScriptBreakdown(
    project_id="mock-id",
    project_title="Mock Title",
    short_scene_summary="Two characters meet in a rainy alleyway to exchange a mysterious package.",
    setting="Alleyway",
    time_period="Present Day",
    time_of_day="Night",
    interior_or_exterior="Exterior",
    characters=["John", "Mysterious Stranger"],
    locations=["City Alleyway"],
    props=["Mysterious Package", "Umbrella"],
    wardrobe_requirements=["Trench coat", "Dark clothing"],
    vehicles=[],
    weather_requirements=["Heavy Rain"],
    safety_considerations=["Wet surfaces", "Night shooting logistics"],
    logistical_considerations=["Rain machines", "Lighting the alleyway"],
    continuity_risks=["Rain levels on clothing"],
    unresolved_questions=["What is inside the package?"],
    research_questions=[
        ResearchQuestion(
            question="What permits are required for rain machines in downtown alleyways?",
            reason="Necessary for planning the logistics of the shot."
        )
    ],
    generated_timestamp=datetime.now(timezone.utc),
    model_metadata="MOCK_AI",
    status="completed"
)

class ScriptBreakdownAgent:
    def __init__(self) -> None:
        self.client: genai.Client | None
        if not settings.scenescout_use_mock_ai:
            if settings.google_genai_use_vertexai:
                self.client = genai.Client(vertexai=True, project=settings.google_cloud_project, location=settings.google_cloud_location)
            else:
                self.client = genai.Client(api_key=settings.gemini_api_key)
        else:
            self.client = None

    def analyze(self, project_id: str, title: str, scene_text: str, notes: str | None = None) -> ScriptBreakdown:
        if settings.scenescout_use_mock_ai:
            mock_result = MOCK_BREAKDOWN.model_copy()
            mock_result.project_id = project_id
            mock_result.project_title = title
            return mock_result

        # Real Gemini Mode using Google GenAI SDK (Vertex AI)
        prompt = f"""Analyze the following scene for pre-production breakdown.

Title: {title}
Scene Text:
{scene_text}

Notes from user: {notes or "None"}

Generate a detailed breakdown answering the schema requirements.
Avoid fabricating details. Explicitly mark uncertainty.
"""

        try:
            
            if not self.client:
                raise RuntimeError("Client not initialized for real mode.")
                
            response = self.client.models.generate_content(
                model=settings.gemini_model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=ScriptBreakdown,
                    temperature=0.2,
                ),
            )
            
            data = json.loads(response.text or "{}")
            data['project_id'] = project_id
            data['project_title'] = title
            data['model_metadata'] = settings.gemini_model
            data['status'] = "completed"

            # generated_timestamp should be a valid datetime string for Pydantic to parse if not already
            if 'generated_timestamp' not in data:
                data['generated_timestamp'] = datetime.now(timezone.utc).isoformat()

            return ScriptBreakdown(**data)

        except Exception as e:
            raise RuntimeError(f"Agent failed to produce breakdown: {e}") from e
