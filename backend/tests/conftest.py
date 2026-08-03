import os

# The suite must never reach live providers or the production Firestore. A
# developer's backend/.env now carries real credentials with mock mode off, and
# pydantic-settings reads that file, so without this the tests bill real Gemini
# and Parallel calls and write test projects into the production database.
#
# Environment variables outrank the dotenv file in pydantic-settings, and this
# runs before app.config builds its module-level settings singleton.
os.environ["SCENESCOUT_USE_MOCK_AI"] = "true"
os.environ["SCENESCOUT_USE_IN_MEMORY_STORE"] = "true"
os.environ.pop("FIRESTORE_EMULATOR_HOST", None)
