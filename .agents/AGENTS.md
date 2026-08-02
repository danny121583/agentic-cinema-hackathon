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

### 4. Agent CLI Autonomy (DO IT YOURSELF)
When managing external services or project configurations, **do not ask the user to perform manual UI tasks if a CLI tool exists.** 
You are an autonomous agent and have full capability to run shell commands on the user's machine.

- **Vercel Environments:** Use `npx vercel env add <name> <environment> --value "<value>" --yes` to inject variables rather than asking the user to use the Vercel Dashboard. Use `npx vercel env ls` to verify.
- **MCP Integrations:** Use `gemini mcp add` to automatically provision and connect remote MCP servers (like Google Cloud Vertex AI) rather than asking the user to manually configure settings files. 
- **General Principle:** If a manual step can be replaced by an authenticated CLI command, **execute the command yourself** and report the success to the user.
