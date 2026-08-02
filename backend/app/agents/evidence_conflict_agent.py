import json
import uuid
from datetime import datetime, timezone

from google import genai
from google.genai import types

from app.config import settings
from app.models.research import Finding, SearchExecution, ResearchQuestionDetail, FindingConfidence, FindingStatus
from app.models.breakdown import ScriptBreakdown

class EvidenceConflictAgent:
    def __init__(self) -> None:
        self.client: genai.Client | None
        if not settings.scenescout_use_mock_ai:
            if settings.google_genai_use_vertexai:
                self.client = genai.Client(vertexai=True, project=settings.google_cloud_project, location=settings.google_cloud_location)
            else:
                self.client = genai.Client(api_key=settings.gemini_api_key)
        else:
            self.client = None

    def evaluate(self, project_id: str, question: ResearchQuestionDetail, execution: SearchExecution) -> Finding:
        if settings.scenescout_use_mock_ai:
            return Finding(
                id=str(uuid.uuid4()),
                project_id=project_id,
                question_id=question.id,
                claim="A special water use permit is required for rain machines.",
                evidence_summary="According to the mock film commission, rain machines on public streets require 48 hours notice and a specific water runoff plan.",
                supporting_sources=execution.returned_sources,
                conflicting_sources=[],
                confidence_level=FindingConfidence.HIGH,
                confidence_explanation="The single mock source clearly states the requirement.",
                freshness_assessment="Current as of 2026",
                geographic_relevance="Applies to the mock city",
                production_relevance="High, directly affects logistics",
                limitations="None",
                human_review_recommendation="Approve finding to inform location manager.",
                status=FindingStatus.DRAFT,
                generated_timestamp=datetime.now(timezone.utc),
                model_metadata="MOCK_AI"
            )

        prompt = f"""Evaluate the web search results for the following research question and synthesize a production finding.

Question: {question.question}
Objective: {question.search_objective}

Search Results:
{json.dumps([s.model_dump(mode="json") for s in execution.returned_sources], indent=2)}

Task:
1. Synthesize a core claim answering the question based on evidence.
2. Group sources into supporting and conflicting.
3. Assess confidence level (HIGH/MEDIUM/LOW/INSUFFICIENT) based on source consensus and quality.
4. Note geographic relevance and limitations.
"""

        try:
            if not self.client:
                raise RuntimeError("Client not initialized for real mode.")
                
            response = self.client.models.generate_content(
                model=settings.gemini_model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=Finding,
                    temperature=0.2,
                ),
            )
            
            data = json.loads(response.text or "{}")
            data['id'] = str(uuid.uuid4())
            data['project_id'] = project_id
            data['question_id'] = question.id
            data['status'] = FindingStatus.DRAFT
            data['model_metadata'] = settings.gemini_model
            
            if 'generated_timestamp' not in data:
                data['generated_timestamp'] = datetime.now(timezone.utc).isoformat()
            
            return Finding(**data)

        except Exception as e:
            raise RuntimeError(f"Agent failed to evaluate evidence: {e}") from e
