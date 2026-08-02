# Iteration 01: Script Breakdown (Mock Vertical Slice)

## Objective
Deliver the first complete, testable vertical slice: Script input → script breakdown → saved project result → frontend display.

## Work Completed

### 1. Backend Restructuring
- Transitioned backend from a flat script to a full FastAPI modular structure (`app/api`, `app/models`, `app/services`, `app/agents`).
- Implemented `ProjectResponse` and `ScriptBreakdown` Pydantic models.
- Abstracted storage with `StorageProvider`, `InMemoryStorage` (default for testing), and `FirestoreStorage`.
- Created `ScriptBreakdownAgent` with deterministic MOCK mode and structured output for Vertex AI / Gemini.
- Created `ParallelSearchClient` integration boundary (currently mocked).
- Configured structured `app/config.py` using `pydantic-settings` to enforce environment variables and rules.
- Added comprehensive pytest suite (`tests/test_api.py`, `tests/test_parallel.py`).
- Enforced clean code with `ruff` and `mypy` typing checks.

### 2. Frontend Implementation
- Initialized Shadcn UI components (`card`, `input`, `textarea`, `label`, `button`).
- Created typed API client in `src/lib/api.ts` to connect to `localhost:8000`.
- Built `ScriptInputForm` to ingest script scene text and director notes.
- Built `ProjectDetails` component to render the structured breakdown (Characters, Props, Setting, Logistics, Safety, Research Questions).
- Integrated into `src/app/page.tsx` for seamless user flow.
- Added Playwright end-to-end tests mocking the backend to verify the UI flow without external dependencies.
- Verified TypeScript compilation and ESLint.

## Current State
- The backend is running on `localhost:8000` with mock AI and in-memory store.
- The frontend is running on `localhost:3000`.
- Users can submit a scene and view a structured breakdown detailing characters, props, logistics, and Parallel search queries.

## Next Steps (Iteration 02)
1. **Parallel Integration**: Implement the live Parallel Search API in `app/tools/parallel_search.py` and invoke it from the agent to ground the breakdown in real-world research (e.g. answering the generated `research_questions`).
2. **Gemini Live Integration**: Switch off mock AI and test live Gemini structured outputs with the agent.
3. **Firestore Integration**: Switch off in-memory store and persist project results in Firebase emulator or live Firestore.
4. **Agent State Machine**: Transition from a single-shot agent to a LangGraph/multi-step agent if we need iterative reasoning.
