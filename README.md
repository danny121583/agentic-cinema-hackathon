# SceneScout AI

An evidence-grounded pre-production research and planning agent for filmmakers.

## Architecture Summary
- **Frontend**: Next.js, React, Tailwind CSS, shadcn/ui.
- **Backend**: FastAPI, Python, Google Cloud Agent Development Kit (ADK).
- **Storage**: In-memory (mock) and Firestore (production).
- **AI Integration**: Google Gemini models via Vertex AI, and Parallel Web Search SDK.

## Getting Started (For Hackathon Judges)

You can run the entire application locally in either **Mock Mode** (no API keys required) or **Live Mode** (using real Gemini and Parallel APIs). 

### Prerequisites
- Node.js (>= 20)
- Python (>= 3.10)

### 1. Backend Setup
Open a terminal and run the following:
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -e ".[dev]"

# Copy the environment configuration
cp .env.example .env
```
*(Optional)* To test **Live Mode**, edit `backend/.env` and set `SCENESCOUT_USE_MOCK_AI=false`, then add your `GEMINI_API_KEY` and `PARALLEL_API_KEY`.

Start the backend server:
```bash
uvicorn app.main:app --reload
```
*The backend API will run at `http://localhost:8000`*

### 2. Frontend Setup
Open a **new** terminal and run the following:
```bash
cd frontend
npm install

# Copy the environment configuration
cp .env.example .env.local

# Start the frontend
npm run dev
```
*The frontend UI will run at `http://localhost:3000`*

### 3. Usage
Navigate to `http://localhost:3000` in your browser. You can create a new project, write a scene breakdown, and generate a production brief. If you left `SCENESCOUT_USE_MOCK_AI=true`, all generation will use deterministic local mocks to simulate the AI workflow.
### Real Gemini Configuration
To use real Google Gemini models:
1. Authenticate with Google Cloud: `gcloud auth application-default login`
2. Set `SCENESCOUT_USE_MOCK_AI=false` in `backend/.env`.
3. Set your project details: `GOOGLE_CLOUD_PROJECT`, `GOOGLE_CLOUD_LOCATION`, `GEMINI_MODEL`.

### Firestore Configuration
To use Firestore for persistence instead of memory:
1. Authenticate with Google Cloud.
2. Set `SCENESCOUT_USE_IN_MEMORY_STORE=false` in `backend/.env`.

### Parallel Web Search
Parallel search integration is fully implemented and used to ground the research planner's output.
You must add your key to `PARALLEL_API_KEY` in `backend/.env`.

## Backend Commands
- **Run dev server**: `uvicorn app.main:app --reload`
- **Format**: `ruff format app tests`
- **Lint**: `ruff check app tests`
- **Type Check**: `mypy app`
- **Test**: `pytest`

## Frontend Commands
- **Run dev server**: `npm run dev`
- **Format/Lint**: `npm run lint`
- **Type Check**: `tsc --noEmit`
- **Build**: `npm run build`
- **E2E Test**: `npx playwright test`

## Current Implementation Status
- **Iteration 01**: Script Breakdown Agent and Persistence completed. Includes full structured output schema, Mock and Real AI execution modes, Firestore/In-Memory storage abstractions, and Playwright E2E tests.

## Known Limitations
- No user authentication.
- Storyboard/media generation is pending future iterations.
