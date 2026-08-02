import sys
sys.path.append('.')
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

# get projects to find the ID
projects = client.get("/api/projects").json()
if not projects:
    print("No projects")
    sys.exit(0)

project_id = projects[0]['id']
print(f"Project ID: {project_id}")

# call brief
res = client.post(f"/api/projects/{project_id}/brief")
print(res.status_code)
print(res.text)
