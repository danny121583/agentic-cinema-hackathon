import json
import uuid
from datetime import datetime, timezone
from typing import List

from google import genai
from google.genai import types

from app.config import settings
from app.models.research import ProductionBrief, Finding, AgentState, Source
from app.models.breakdown import ScriptBreakdown

class ProductionBriefAgent:
    def __init__(self) -> None:
        self.client: genai.Client | None
        if not settings.scenescout_use_mock_ai:
            if settings.google_genai_use_vertexai:
                self.client = genai.Client(vertexai=True, project=settings.google_cloud_project, location=settings.google_cloud_location)
            else:
                self.client = genai.Client(api_key=settings.gemini_api_key)
        else:
            self.client = None

    def generate(self, project_id: str, breakdown: ScriptBreakdown, findings: List[Finding]) -> ProductionBrief:
        # Filter to only approved findings
        approved_findings = [f for f in findings if f.status == "approved"]
        
        if settings.scenescout_use_mock_ai:
            return ProductionBrief(
                id=str(uuid.uuid4()),
                project_id=project_id,
                executive_summary="Mock brief incorporating breakdown and approved research.",
                production_recommendations=["Proceed with rain machine permit."],
                historical_cultural_guidance=[],
                location_guidance=["Secure downtown alleyway with drainage."],
                prop_guidance=["Waterproof briefcases needed."],
                wardrobe_guidance=["Water-resistant coats."],
                vehicle_guidance=[],
                weather_guidance=["Heavy rain setup."],
                safety_guidance=["Slip hazards on wet pavement."],
                logistics_guidance=["Rain machines need 48h permit."],
                continuity_guidance=["Monitor wetness levels between takes."],
                open_questions=["Confirm actor availability for night shoot."],
                human_review_items=[],
                source_index=[s for f in approved_findings for s in f.supporting_sources],
                generated_timestamp=datetime.now(timezone.utc),
                model_metadata="MOCK_AI",
                status=AgentState.COMPLETE
            )

        prompt = f"""Synthesize a final Production Brief for this script.

Original Breakdown:
Setting: {breakdown.setting}
Time Period: {breakdown.time_period}
Locations: {breakdown.locations}

Approved Research Findings:
{json.dumps([{"claim": f.claim, "evidence": f.evidence_summary} for f in approved_findings], indent=2)}

Create a comprehensive briefing document organizing these insights into actionable categories.
Incorporate the findings to ground the recommendations.
"""

        try:
            if not self.client:
                raise RuntimeError("Client not initialized for real mode.")
                
            response = self.client.models.generate_content(
                model=settings.gemini_model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=ProductionBrief,
                    temperature=0.2,
                ),
            )
            
            data = json.loads(response.text or "{}")
            data['id'] = str(uuid.uuid4())
            data['project_id'] = project_id
            data['status'] = AgentState.COMPLETE
            data['model_metadata'] = settings.gemini_model
            
            if 'generated_timestamp' not in data:
                data['generated_timestamp'] = datetime.now(timezone.utc).isoformat()
                
            # Aggregate all sources from approved findings
            all_sources = []
            for f in approved_findings:
                for s in f.supporting_sources:
                    all_sources.append(s.model_dump())
            data['source_index'] = all_sources
            
            return ProductionBrief(**data)

        except Exception as e:
            raise RuntimeError(f"Agent failed to generate brief: {e}") from e
