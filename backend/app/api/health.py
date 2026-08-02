from fastapi import APIRouter

from app.config import settings

from typing import Any, Dict

router = APIRouter()

@router.get("/health")
def health_check() -> Dict[str, Any]:
    return {
        "status": "healthy",
        "version": "0.1.0",
        "ai_mode": "mock" if settings.scenescout_use_mock_ai else "real",
        "storage_mode": "memory" if settings.scenescout_use_in_memory_store else "firestore",
        "gemini_config_available": bool(settings.google_cloud_project and not settings.scenescout_use_mock_ai),
        "parallel_config_available": bool(settings.parallel_api_key)
    }
