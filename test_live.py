import asyncio
from app.models.project import ProjectCreate
from app.api.projects import create_project

async def test():
    project = ProjectCreate(
        title="Live API Test",
        scene_text="EXT. ALLEYWAY - NIGHT\n\nTwo mysterious figures meet in the pouring rain. They exchange a briefcase and walk away.",
        notes="Please highlight any safety or logistical concerns for the rain."
    )
    result = await create_project(project)
    print("Project ID:", result.id)
    print("Status:", result.status)
    print("\n--- Breakdown Results ---")
    if result.breakdown:
        print("Characters:", result.breakdown.characters)
        print("Logistics:", result.breakdown.logistical_considerations)
        print("Research Questions:", [q.question for q in result.breakdown.research_questions])
    else:
        print("Breakdown was None")

if __name__ == "__main__":
    asyncio.run(test())
