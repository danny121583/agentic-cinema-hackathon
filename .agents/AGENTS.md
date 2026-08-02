# Workspace Customizations

This file contains project-scoped rules and behavioral constraints for agents working in this repository.

## Rules

### 1. Technology Stack
- **Frontend**: Next.js 16+, Shadcn UI, TailwindCSS, TypeScript.
- **Backend**: FastAPI, Pydantic, Python 3.14+, Google Cloud GenAI SDK.
- **Storage**: Abstracted interface (Firestore for production, InMemory for testing/local).

### 2. Development Guidelines
- Always ensure `ruff`, `mypy`, and `eslint` pass before finalizing a task.
- Tests must be written for new features (Pytest for backend, Playwright for frontend UI).
- Do not expose API keys (e.g., `PARALLEL_API_KEY`) to the frontend.
- Rely on environment variables defined in `.env.example` files.

### 3. Workflow
- Maintain `CHANGELOG.md` with every iteration.
- Document iteration progress and results in the `docs/` folder.
