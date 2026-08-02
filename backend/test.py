import sys
sys.path.append('.')
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

response = client.post("/api/projects", json={
    "title": "Test",
    "scene_text": "Test scene",
    "notes": ""
})

print(response.status_code)
print(response.text)
