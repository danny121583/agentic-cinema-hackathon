from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import traceback

from app.api import health, projects
from app.config import settings

app = FastAPI(title="SceneScout AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.allowed_origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    from app.api import health, projects

    app.include_router(health.router, tags=["health"])
    app.include_router(projects.router, prefix="/api", tags=["projects"])

except Exception as e:
    print(f"FAILED TO INITIALIZE APP: {e}")
    traceback.print_exc()
    raise e
