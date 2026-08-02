import asyncio
from fastapi.testclient import TestClient
from app.main import app

def test():
    client = TestClient(app)
    
    payload = {
        "title": "Live API Test",
        "scene_text": "EXT. ALLEYWAY - NIGHT\n\nTwo mysterious figures meet in the pouring rain. They exchange a briefcase and walk away.",
        "notes": "Please highlight any safety or logistical concerns for the rain."
    }
    
    response = client.post("/api/projects", json=payload)
    if response.status_code != 200:
        print("Error:", response.text)
        return
        
    result = response.json()
    print("Project ID:", result["id"])
    print("Status:", result["status"])
    print("\n--- Breakdown Results ---")
    
    bd = result.get("breakdown")
    if bd:
        print("Characters:", bd["characters"])
        print("Props:", bd["props"])
        print("Logistics:", bd["logistical_considerations"])
        print("Safety:", bd["safety_considerations"])
        print("Research Questions:", [q["question"] for q in bd["research_questions"]])
        print("Model Metadata:", bd["model_metadata"])
    else:
        print("Breakdown was None")

if __name__ == "__main__":
    test()
