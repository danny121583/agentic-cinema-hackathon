from fastapi import APIRouter

from app.config import settings

from typing import Any, Dict

import os

router = APIRouter()

@router.get("/health")
def health_check() -> Dict[str, Any]:
    version = os.environ.get("VERCEL_GIT_COMMIT_SHA", "0.1.0")
    if len(version) >= 7 and version != "0.1.0":
        version = version[:7]

    return {
        "status": "healthy",
        "version": version,
        "ai_mode": "mock" if settings.scenescout_use_mock_ai else "live",
        "storage_mode": "memory" if settings.scenescout_use_in_memory_store else "firestore",
        "gemini_config_available": bool(
            (settings.google_cloud_project if settings.google_genai_use_vertexai else settings.gemini_api_key)
            and not settings.scenescout_use_mock_ai
        ),
        "parallel_config_available": bool(settings.parallel_api_key),
        "firebase_config_available": bool(settings.firebase_service_account_json),
    }
