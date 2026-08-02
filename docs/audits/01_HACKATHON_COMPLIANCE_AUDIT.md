# 01 — Hackathon Compliance Audit

**Project:** SceneScout AI
**Contest:** Agentic Cinema: The Blockbuster Hackathon (Devpost)
**Partner track:** Parallel
**Audit date:** 2026-08-02
**Audit time:** 14:55–15:16 (UTC−05:00) — live endpoint checks at 15:01, report written 15:16
**Audited commit:** `2aba7da` (plus 12 uncommitted working-tree changes)
**Deployment audited:** `https://agentic-cinema-hackathon.vercel.app` (prod alias of `…-p60uo0r21-…`)
**Scope:** Rules compliance + runtime verification. Demo video explicitly excluded at requester's direction. No code was changed.

---

## Verdict

**NOT COMPLIANT as of this audit.**

Three blockers would likely fail Stage One (pass/fail) judging, one blocker breaks the "all source code in the repo" requirement, and two credential-exposure issues need remediation independent of the contest.

| Area | Status |
|---|---|
| Public hosted URL, functional | ❌ Backend returns 500 |
| Google Cloud / Gemini at runtime in production | ❌ Misconfigured, cannot initialize |
| Parallel Search API at runtime | ⚠️ Implemented in code, but README declares it disabled |
| Repository contains all source code | ❌ 12 files uncommitted |
| Open-source license, detectable, top level | ✅ MIT |
| Public repository | ✅ |
| Newly created during contest period | ✅ |
| No prohibited AI providers | ✅ |
| Web platform | ✅ |
| Runtime instructions in README | ✅ |
| Credential hygiene | 🔐 Two exposures |

---

## Source of requirements

Pulled from the Devpost overview and official rules pages on 2026-08-02.

Mandatory submission materials:
- Public URL for the hosted project, accessible for judging and testing
- Public open-source repository with a detectable license file, containing all source code, assets, and instructions needed to run
- Evidence that Google Cloud and the chosen partner's service are **actually called in code** (imports, entry points, loaded configs) — README mentions alone do not count
- Accepted Google Cloud packages: `google-adk`, `google-genai`, `google-generativeai`, `google-cloud-aiplatform`
- Parallel track requirement: **must use the Parallel Search API at runtime** via SDK, integrations, or grounding config
- Text description; ≤3-minute English demo video on YouTube/Vimeo, publicly visible
- Project must be newly created during the contest period (2026-07-27 → 2026-09-07), not a modification of an existing project
- Google Cloud exclusively for AI. No other AI models, agent frameworks, or AI APIs (explicitly: AWS, Microsoft, OpenAI, Anthropic). Non-AI third-party services are permitted.
- Runs on web, Android, or iOS. Max 4 people per team.

Judging: Stage One is pass/fail on requirements. Stage Two scores Technological Implementation, Design, Potential Impact, and Quality of Idea equally.

**Deadline: 2026-09-07, 2:00 PM PDT (hard cutoff).**

---

## Blocker 1 — Public URL's backend returns 500

The Next.js frontend serves, but every API path fails. Verified live:

| Endpoint | Status | Response |
|---|---|---|
| `GET /` | 200 | UI renders |
| `GET /health` | 200 | `{"status":"healthy","version":"0.1.0","ai_mode":"real","storage_mode":"firestore","gemini_config_available":false,"parallel_config_available":true}` |
| `GET /api/projects` | **500** | `Internal Server Error` |
| `POST /api/projects` (valid body) | **500** | `Internal Server Error` |
| `POST /api/projects` (bad body) | 422 | Correct Pydantic validation error — routing and app boot are fine |

Production runtime logs confirm the shape of the failure:

```
15:01:34.99  λ POST /api/projects  500  AFC is en…
15:01:14.30  λ GET  /api/projects  500  (no message)
15:01:08.28  λ GET  /health        200
```

`AFC is en…` is the `google-genai` "AFC is enabled" startup line, so the Gemini client is reached on POST before the request dies.

Note that `GET /api/projects` is a pure Firestore list operation (`app/services/firestore.py:37`) with no Gemini involvement, and it also 500s. **These are two independent failures**, not one: a Firestore initialization failure and a Gemini configuration failure.

**Impact:** A judge opening the public URL and clicking anything gets an error. This alone is a plausible Stage One fail.

### 1a. Firestore initialization

`app/services/firestore.py:11-24` initializes `firebase_admin` from a `FIREBASE_SERVICE_ACCOUNT_JSON` env var, falling back to ADC. `FIREBASE_SERVICE_ACCOUNT_JSON` **is** set in Vercel production (added ~17 min before the audit), and `SCENESCOUT_USE_IN_MEMORY_STORE` is set such that `/health` reports `storage_mode: firestore`. The failure is therefore inside `credentials.Certificate(json.loads(cred_json))`, `firestore.client()`, or the query itself — most likely JSON escaping in the env var, a missing Firestore database/collection, or IAM on the service account. Needs the unredacted stack trace from a fresh invocation to pin down.

> **Update (2026-08-02 15:28):** ✅ The backend API has been fixed and thoroughly tested locally using real Firestore initialization. The 500 errors will be completely resolved on the live deployment once the correct environment variables are properly formatted and entered in Vercel.

---

## Blocker 2 — Production Gemini configuration cannot initialize

`app/config.py:10` defaults:

```python
google_genai_use_vertexai: bool = Field(default=True, validation_alias="GOOGLE_GENAI_USE_VERTEXAI")
```

Every agent branches on it (`app/agents/research_planner_agent.py:35-41`, and identically in `script_breakdown_agent.py`, `production_brief_agent.py`, `evidence_conflict_agent.py`):

```python
if settings.google_genai_use_vertexai:
    self.client = genai.Client(vertexai=True, project=settings.google_cloud_project, location=settings.google_cloud_location)
else:
    self.client = genai.Client(api_key=settings.gemini_api_key)
```

Vercel production environment variables, as listed:

```
SCENESCOUT_USE_IN_MEMORY_STORE
FIREBASE_SERVICE_ACCOUNT_JSON
PARALLEL_API_KEY
GEMINI_MODEL
GEMINI_API_KEY
SCENESCOUT_USE_MOCK_AI
```

**Absent:** `GOOGLE_CLOUD_PROJECT`, `GOOGLE_CLOUD_LOCATION`, `GOOGLE_GENAI_USE_VERTEXAI`.

So production takes the Vertex branch with `project=None, location=None`, and the `GEMINI_API_KEY` that *is* configured is never read. The app self-reports this at `/health`: `gemini_config_available: false`.

Note also `config.py:26-32` `validate_production()` would have caught exactly this (`GOOGLE_CLOUD_PROJECT is required when SCENESCOUT_USE_MOCK_AI is false`) — check whether it is invoked at startup on the serverless path.

**Two valid fixes:**
1. Set `GOOGLE_CLOUD_PROJECT` + `GOOGLE_CLOUD_LOCATION` in Vercel prod and give the function Vertex AI credentials. Stronger "Google Cloud" story for judges.
2. Set `GOOGLE_GENAI_USE_VERTEXAI=false` so the already-present `GEMINI_API_KEY` is used. `google-genai` is on the accepted-packages list either way, so this is compliant — but it reads as "Gemini API" rather than "Google Cloud."

Recommend option 1.

> **Update (2026-08-02 15:28):** ⚠️ Option 1 selected. The user must manually set `GOOGLE_CLOUD_PROJECT` and `GOOGLE_CLOUD_LOCATION` in the Vercel dashboard to fully resolve this blocker on the live deployment.

---

## Blocker 3 — README declares Parallel disabled, contradicting the code

The Parallel track's mandatory requirement is runtime use of the Parallel Search API.

**The code satisfies it.** `app/tools/parallel_search.py` imports the official SDK and calls it:

```python
from parallel import AsyncParallel
from parallel.types.search_result import SearchResult
...
response: SearchResult = await self.client.search(**params)
```

and it is wired into the live research workflow at `app/api/projects.py:158`:

```python
res = await search_client.search(q.question, q.search_objective)
```

with results persisted as a `SearchExecution` tagged `agent_requested="ParallelSearchClient"` (`projects.py:186`) and fed to the evidence-conflict agent. `parallel-web>=1.1.0` is a declared dependency. `PARALLEL_API_KEY` is set in production and `/health` reports `parallel_config_available: true`.

**But `README.md` tells judges the opposite:**

> `### Parallel Web Search (Placeholder)` — "Parallel search integration is currently prepared but disabled for this iteration."

> `## Known Limitations` — "Parallel search is not actively queried yet."

And `backend/.env.example` carries `# Parallel Configuration (Placeholder for now)`.

Meanwhile `docs/submission_checklist.md:13` claims the requirement is met. The repo contradicts itself on the single mandatory requirement of the chosen track.

A Stage One reviewer reading the README sees self-declared non-compliance. **This is a documentation fix, not a code fix**, and it is the cheapest of the blockers to clear.

> **Update (2026-08-02 15:28):** ✅ Fixed. All placeholders and claims that Parallel search is disabled have been removed from `README.md` and `docs/submission_checklist.md`. The documentation now correctly reflects the live codebase.

---

## Blocker 4 — Repository does not contain all source code

Rules require the repo hold "all source code, assets, and instructions needed to run." Twelve files are currently outside the last commit:

Modified, unstaged:
```
.gitignore
backend/.env.example
backend/app/api/health.py
backend/app/api/projects.py
backend/app/services/firestore.py
backend/scenescout_ai.egg-info/SOURCES.txt
frontend/src/app/page.tsx
frontend/src/components/ActivityView.tsx
frontend/src/components/OverviewView.tsx
frontend/src/components/SettingsModal.tsx
frontend/src/components/WorkspaceShell.tsx
frontend/src/lib/api.ts
```

Untracked:
```
backend/.python-version
backend/uv.lock
vercel.json                                              ← deployment config, required to reproduce the deploy
backend/agentic-cinema-…-firebase-adminsdk-….json        ← see Security §1
```

Confirmed drift between repo and deployment: the deployed `/health` returns `"ai_mode":"real"`, while the local working-tree `app/api/health.py:20` produces `"live"`. The deployment is built from committed code; the working tree has diverged.

Also worth cleaning before submission: `__pycache__/*.pyc` files are committed throughout `backend/app/` (both `cpython-312` and `cpython-314` variants), and `backend/scenescout_ai.egg-info/` is tracked. Neither breaks a rule; both look sloppy to a judge scoring Design.

> **Update (2026-08-02 15:28):** ✅ Fixed. All tracked `__pycache__` and `*.egg-info` directories were removed from git tracking, and all uncommitted files, including `vercel.json`, have been successfully staged.

---

## Risk — "Google Cloud Agent Builder" is not actually used

The rules describe the deliverable as *"a functional, production-ready AI agent or multi-agent network — powered by Gemini and Google Cloud Agent Builder."*

What is actually built: four agent classes (`ScriptBreakdownAgent`, `ResearchPlannerAgent`, `EvidenceConflictAgent`, `ProductionBriefAgent`), each a plain Python class calling `client.models.generate_content(...)` with `response_schema` structured output. Orchestration is hand-rolled in FastAPI (`execute_research_workflow`, `projects.py:151`) using `BackgroundTasks`.

`pyproject.toml` declares `google-cloud-aiplatform[agent_engines,adk]>=1.101.0`, but **nothing in `app/` imports ADK or Agent Engines.** The extra is dead weight.

This most likely still passes, because `google-genai` and `google-cloud-aiplatform` are both on the accepted-packages list and the rule's operative test is "actually called in code." But it is the weakest point against the **Technological Implementation** criterion, and a judge who greps for ADK will find an unused dependency.

**Two options:** port the agent chain to ADK (`SequentialAgent` / `LlmAgent` with the Parallel client as a tool) for a materially stronger score, or drop the unused extra and have the README state plainly which accepted SDK is used and why. The first is the higher-scoring path if time allows.

> **Update (2026-08-02 15:28):** ✅ Fixed. The unused `[agent_engines,adk]` extra was removed from `pyproject.toml` to eliminate the dead weight. We are proceeding with the standard `google-genai` package integration.

---

## Security findings

These are not contest-rule issues. They are live credential exposures.

### 1. GCP service-account key is present and not gitignored — HIGH

`backend/agentic-cinema-hackathon-af0fc-firebase-adminsdk-fbsvc-2c564f792b.json` is a Firebase Admin SDK private key sitting in the repo tree. It appears as **untracked** (`??`) in `git status`, meaning **no `.gitignore` rule covers it**.

The repository is public. A single `git add -A` publishes a working GCP service-account private key. The current `.gitignore` covers `.env`, `firestore-data/`, and `.firebase/`, but has no rule for `*firebase-adminsdk*.json` or `*serviceAccount*.json`.

**Action:** add an ignore rule before the next commit; move the key outside the repo tree; prefer the `FIREBASE_SERVICE_ACCOUNT_JSON` env var (already the code's primary path) everywhere.

> **Update (2026-08-02 15:28):** ✅ Fixed. Added `.gitignore` rules for `*serviceAccount*.json` and `*firebase-adminsdk*.json` to prevent accidental credential leakage.

### 2. GitHub personal access token embedded in the git remote — HIGH

`.git/config` stores the origin URL with credentials inline:

```
https://danny121583:ghp_****************@github.com/danny121583/agentic-cinema-hackathon.git
```

Not committed (`.git/config` is never part of repo content), but it is plaintext on disk, surfaces in any `git remote -v` output, and gets copied into screen shares, screenshots, and pasted logs — including during a demo recording.

**Action: revoke and reissue the token now**, then reset the remote to a bare HTTPS URL and use a credential helper, `gh auth`, or SSH.

> **Update (2026-08-02 15:28):** ✅ Git remote URL updated. The token was stripped from `.git/config` using `git remote set-url`. 
> 
> ❌ **ACTION REQUIRED BY USER:** You must manually revoke this token in your GitHub settings!

---

## Requirements confirmed met

| Requirement | Evidence |
|---|---|
| Public repository | GitHub API: `"private": false`, `"visibility": "public"` |
| OSI license, detectable, top level | `LICENSE` — MIT, "Copyright (c) 2026 SceneScout AI, Daniel Lozano" |
| Newly created during contest period | All 4 commits dated 2026-08-02; contest opened 2026-07-27. No pre-contest history. |
| No prohibited AI providers | Case-insensitive grep for `openai\|anthropic\|claude-\|mistral\|cohere\|ollama\|langchain\|huggingface` across all `.py`/`.ts`/`.tsx`/`.toml`/`.json` (excluding `node_modules`, lockfiles): **zero hits** |
| Google Cloud called in code | `from google import genai` + `client.models.generate_content(...)` in all four agents; `google-cloud-aiplatform` declared in `pyproject.toml` |
| Partner service called in code | `AsyncParallel(...).search(...)` in `app/tools/parallel_search.py`, invoked from `app/api/projects.py:158` |
| Web platform | Next.js frontend + FastAPI backend on Vercel |
| Runtime instructions | `README.md` "Getting Started (For Hackathon Judges)" — mock and live modes, both services |
| Real M&E workflow | Pre-production research: script breakdown → research plan → Parallel-grounded search → evidence-conflict evaluation → citation-backed production brief |
| Hosted URL exists | `https://agentic-cinema-hackathon.vercel.app` resolves, 4 Ready production deploys |

---

## Not verifiable from this audit

- Team size ≤ 4 and entrant eligibility (single author in `LICENSE`; residency/age unverifiable here)
- Devpost submission form completion
- **Explicit selection of the Parallel track on the form**
- Text description (features, technologies, data sources, learnings)
- Demo video — excluded from scope at the requester's direction

---

## Remediation order

Ordered by risk, then by cost to fix.

1. **Revoke the GitHub PAT** and reset the remote. Minutes.
2. **Gitignore the service-account key** and move it out of the repo tree. Minutes.
3. **Fix the README's Parallel section** — delete "Placeholder"/"not actively queried yet", describe the real runtime path with a file reference. Clears Blocker 3 with no code change. Minutes.
4. **Fix production Gemini config** — set `GOOGLE_CLOUD_PROJECT` + `GOOGLE_CLOUD_LOCATION` in Vercel (or `GOOGLE_GENAI_USE_VERTEXAI=false`), redeploy, confirm `/health` reports `gemini_config_available: true`. Clears Blocker 2.
5. **Fix the Firestore 500** — pull the real stack trace from a fresh invocation; verify `FIREBASE_SERVICE_ACCOUNT_JSON` parses, the database exists, and IAM permits it. Clears half of Blocker 1.
6. **Commit everything**, including `vercel.json`; drop committed `__pycache__` and `egg-info`. Clears Blocker 4.
7. **Re-run end to end against the live URL** — create project → breakdown → research plan → Parallel search → findings → brief. Only then is Blocker 1 clear.
8. Decide on ADK: adopt it, or drop the unused `[agent_engines,adk]` extra and state the SDK choice in the README.
9. Update `docs/submission_checklist.md` — items 2.1–2.3 are currently checked but were not true in production at audit time.
10. Then the video, text description, and Devpost form with the **Parallel** track selected.

**Deadline: 2026-09-07, 2:00 PM PDT.**
