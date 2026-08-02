from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["ai_mode"] == "mock"  # Assuming we test in mock mode
    assert data["storage_mode"] == "memory"
    assert "secret" not in str(data).lower()

def test_create_and_get_project():
    payload = {
        "title": "Test Project",
        "scene_text": "A dark alleyway."
    }

    # Create
    response = client.post("/api/projects", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test Project"
    assert data["status"] == "completed"
    assert "breakdown" in data
    assert data["breakdown"]["project_id"] == data["id"]

    project_id = data["id"]

    # Get
    get_resp = client.get(f"/api/projects/{project_id}")
    assert get_resp.status_code == 200
    assert get_resp.json()["id"] == project_id

    # List
    list_resp = client.get("/api/projects")
    assert list_resp.status_code == 200
    assert len(list_resp.json()) > 0

def test_reanalyze_project():
    # First create
    response = client.post("/api/projects", json={"title": "Test", "scene_text": "Text"})
    project_id = response.json()["id"]

    # Then reanalyze
    re_resp = client.post(f"/api/projects/{project_id}/reanalyze")
    assert re_resp.status_code == 200
    assert re_resp.json()["status"] == "completed"

def test_missing_project():
    get_resp = client.get("/api/projects/does-not-exist")
    assert get_resp.status_code == 404
