# SceneScout AI

An evidence-grounded pre-production research and planning agent for filmmakers.

## Architecture Summary
- **Frontend**: Next.js, React, Tailwind CSS, shadcn/ui.
- **Backend**: FastAPI, Python, Google Cloud Agent Development Kit (ADK).
- **Storage**: In-memory (mock) and Firestore (production).
- **AI Integration**: Google Gemini models via Vertex AI, and Parallel Web Search SDK.

## Local Setup

### Prerequisites
- Node.js (>= 20)
- Python (>= 3.10)
- Google Cloud CLI (`gcloud`)

### Quick Start (Mock Mode)
You can run the entire application locally without any cloud credentials by using Mock AI mode.

1. **Backend Setup**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate
   pip install -e ".[dev]"
   
   # Copy env config
   cp .env.example .env
   # Ensure SCENESCOUT_USE_MOCK_AI=true in .env
   
   uvicorn app.main:app --reload
   ```

2. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   
   # Copy env config
   cp .env.example .env.local
   
   npm run dev
   ```

### Real Gemini Configuration
To use real Google Gemini models:
1. Authenticate with Google Cloud: `gcloud auth application-default login`
2. Set `SCENESCOUT_USE_MOCK_AI=false` in `backend/.env`.
3. Set your project details: `GOOGLE_CLOUD_PROJECT`, `GOOGLE_CLOUD_LOCATION`, `GEMINI_MODEL`.

### Firestore Configuration
To use Firestore for persistence instead of memory:
1. Authenticate with Google Cloud.
2. Set `SCENESCOUT_USE_IN_MEMORY_STORE=false` in `backend/.env`.

### Parallel Web Search (Placeholder)
Parallel search integration is currently prepared but disabled for this iteration. 
You can add your key to `PARALLEL_API_KEY` in `backend/.env`.

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
- Parallel search is not actively queried yet.
- No user authentication.
- Storyboard/media generation is pending future iterations.
