import os
import sys
sys.path.insert(0, os.path.abspath('backend'))

# Simulate Vercel empty env vars
os.environ["FIREBASE_SERVICE_ACCOUNT_JSON"] = ""
os.environ["GEMINI_API_KEY"] = ""
os.environ["GEMINI_MODEL"] = ""
os.environ["GOOGLE_CLOUD_LOCATION"] = ""
os.environ["GOOGLE_CLOUD_PROJECT"] = ""
os.environ["GOOGLE_GENAI_USE_VERTEXAI"] = ""
os.environ["PARALLEL_API_KEY"] = ""
os.environ["SCENESCOUT_USE_IN_MEMORY_STORE"] = ""
os.environ["SCENESCOUT_USE_MOCK_AI"] = ""

try:
    from app.main import app
    print("Import successful!")
except Exception as e:
    import traceback
    traceback.print_exc()
