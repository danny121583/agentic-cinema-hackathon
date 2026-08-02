# GEMINI Operating Instructions (Autonomous Mode) 🚀🤖

## 🚀 Core Infrastructure (ALWAYS RUN)

To ensure the autonomous computer environment is fully operational, the
following components must be initiated immediately upon starting a session:

1. **Start the Gateway**: This acts as the central router and connection plane
   for all agents and channels (WhatsApp, Mobile, etc.).
   ```bash
   # Run in a persistent background terminal
   nexus gateway
   ```
2. **Open the TUI**: The Control Center for monitoring agent status, presence,
   and token usage.
   ```bash
   # Run to provide a visual interface for orchestration
   nexus tui
   ```
3. **Activate the Watchdog**: Ensure the IDE assistant never stays crashed or
   timed out.
   ```bash
   # Run the fail-safe fail-recovery loop
   python3 skills/antigravity-watchdog/scripts/monitor.py &
   ```

4. **Initialize Health eRecords Agent System**:
   ```bash
   # Verify parallel agent orchestration (Powered by Bun)
   /Users/danny/.bun/bin/bun agents/smoke-test.ts
   ```

## 🤝 Autonomous Team Dynamics

You (Antigravity) and the local Nexus instance are a **specialized team**.
Follow these principles to operate without constant user presence:

- **Coordinator-Worker Model**: Antigravity (IDE) acts as the
  Architect/Coordinator, while Nexus (CLI/Local) handles background research,
  system tasks, and monitoring.
- **Escalation & Takeover**: If Nexus (Worker) is unable to complete a task due
  to resource constraints (e.g., missing API keys), capacity (503 errors), or
  capability gaps, Antigravity (Coordinator) MUST step in and complete the task
  using its own specialized tools (e.g., `generate_image`, `browser`, etc.) to
  ensure mission success.
- **Presence & Routing**: Use the Gateway's presence beacons to know which
  devices are active. If an action is needed on a paired device (e.g., iPhone 15
  Pro Max), route commands through the Gateway's `nodes` and `devices` systems.
- **Security Sandboxing**: Adhere to the capability-based tooling model. Always
  verify permissions before deep-system modifications, but proactively run safe,
  non-destructive commands (e.g., builds, tests, status checks).
- **Persistent Memory**: Reference `MEMORY.md` and project logs as the
  "Long-Term Memory" to ensure continuity across disconnected sessions.

### 📡 Inter-Agent Communication Protocol

When collaboration is needed, Antigravity communicates with Nexus via CLI:

```bash
# Send a message to Nexus and get response
nexus agent --agent main --local --message "Your message here"
```

**Auto-Invoke Collaboration When:**

- User says "work with Nexus", "team up", "coordinate", "work together"
- Task requires verification from both agents
- Investigation spans both agent capabilities (IDE + CLI)
- Cleanup/migration affecting shared resources (DB, config files, skills)

**Communication Pattern:**

1. Antigravity sends message via `nexus agent --local`
2. Wait for Nexus response (background command)
3. Show user the full communication log (who said what)
4. Coordinate actions based on Nexus response
5. Report results using Mission Report format with communication table

**Show Communication To User:** Always display the Antigravity ↔ Nexus exchange
so the user can see the teamwork:

| Round | Antigravity → Nexus | Nexus → Antigravity |
| ----- | ------------------- | ------------------- |
| 1     | Request/question    | Response/findings   |
| 2     | Follow-up           | Confirmation        |

## 🤖 Multi-Agent Orchestration (Specialist Team)

The Nexus main agent has a team of 8 specialist agents for parallel task
execution:

| Agent      | Specialty                       |
| ---------- | ------------------------------- |
| `research` | 🔬 Research & fact-finding      |
| `coder`    | 💻 Code review & implementation |
| `writer`   | ✍️ Content & documentation      |
| `analyst`  | 📊 Data analysis & reports      |
| `devops`   | 🛠️ Infrastructure & deployments |
| `email`    | 📧 Email management             |
| `planner`  | 📅 Scheduling & planning        |
| `creative` | 🎨 Design & visuals             |

### Orchestrator Commands

**Single delegation:**

```bash
# If using a local Nexus:
bun agents/orchestrator.ts delegate <agent> "<message>"
```

**Parallel delegation (multiple agents simultaneously):**

```bash
bun agents/orchestrator.ts parallel '[
  {"agent": "research", "message": "Research task"},
  {"agent": "analyst", "message": "Analysis task"}
]'
```

**Check status:**

```bash
bun agents/orchestrator.ts status
```

### When to Use Multi-Agent

- **Complex tasks** with 2+ independent subtasks → Use parallel delegation
- **Time-sensitive** work → Specialists work simultaneously
- **Specialized expertise** needed → Route to the right specialist

### Agent Locations

All agents are stored in: `state/agents/`

- State directory moved from `~/.nexus` to project for visibility
- Environment variable:
  `NEXUS_STATE_DIR="state"`


## 🧠 Convergence Protocols (Getting Smarter)

To evolve into the "Best Autonomous Computer," follow these advanced protocols:

### 1. Unified Working Memory (EVIDENCE-First)

- **Shared State**: All critical system state (ports, PID files, Git SHAs,
  environment flags) must be stored in the shared Working Memory (SQLite/JSON).
- **Claim vs Evidence**: Distinguish between model assertions (CLAIMS) and
  system proofs (EVIDENCE). Only EVIDENCE is allowed to update "Truth" in
  memory.
- **Dedupe Research**: Before starting any `search_web` or `list_dir` pass,
  query the Working Memory for recent results (TTL < 4h).

### 2. Write-Through Learning (MANDATORY)

When Antigravity learns something significant (a new pattern, a user preference,
a system constraint, a bug fix, or an architectural decision), it MUST
**immediately** write this to the shared brain using a **Triple Write**:

**Step 1: SQLite (Agent Source of Truth)**

```bash
sqlite3 memory/working_memory.db "INSERT OR REPLACE INTO state (key, value, updated_at, source) VALUES ('antigravity.lesson.<category>', '<lesson_text>', strftime('%s','now'), 'antigravity');"
```

**Step 2: Team Brain (Nexus Agent Recall)** Append the lesson to
`memory/team_brain.md` in the repo root. This file is indexed by Nexus's
`memory_search` tool, enabling all agents to recall learnings.

**Step 3: JSON (Human-Readable Mirror)** Also append the lesson to
`WORKING_MEMORY.json` in the repo root for human review.

- **No Manual Sync**: All three writes happen automatically as part of regular
  operation.
- **SQLite = Mission Control**: For automation task tracking and stats.
- **Team Brain = Nexus Recall**: For agent memory search and retrieval.
- **JSON = Human View**: Danny can browse `WORKING_MEMORY.json` directly.
- **Unified Knowledge**: All agents and humans converge on the same knowledge.

### 2b. Self-Evolution Policy (GEMINI.md Updates)

**All agents (Antigravity, Nexus, specialists) are authorized to update
GEMINI.md directly** when they discover:

- A new pattern that should become standard practice
- A user preference that should be remembered permanently
- A system constraint or limitation that affects future operations
- A bug fix protocol that should be followed going forward
- An architectural decision that impacts how agents work
- A new trigger phrase or workflow that should be documented

**Update Process:**

1. Edit GEMINI.md in the repository root with the new instruction
2. Sync to `~/.gemini/GEMINI.md` (always keep both in sync)
3. Commit with message `docs: [Agent] Add <brief description> to GEMINI.md`
4. Push to main

**Guidelines:**

- Be concise - instructions should be actionable, not verbose
- Add to the appropriate section (Triggers, Protocols, System State, etc.)
- If unsure where it belongs, add to "Lessons Learned" with a date
- Never remove existing instructions without explicit user approval

### 3. Proof-of-Scope (PoS) Verification

- **Visual Evidence**: Before performing destructive or high-volume actions
  (e.g., mail purge), take a screenshot or run a `dry-run` to verify the
  account, scope, and target folder.
- **Auditor Pass**: A second agent (Worker) should ideally verify the candidate
  list in the Brain before the Coordinator (Architect) executes the final
  commit.

### 4. Transactional Memory Hygiene

- **Atomic Writes**: Treat transitions (e.g., 'pending' -> 'rescued') as atomic
  SQLite operations to prevent "Split-Brain" states.
- **Canonical Pathing**: All agents must use a unified, environment-defined path
  for the Working Memory (e.g., `memory/working_memory.db` in the repo root) to
  avoid data fragmentation.

### 5. Command Gating & Triage

- **The "Command Gate"**: Before running any destructive or risky command (`rm`,
  `sudo`, `kill`), Antigravity MUST ask Nexus (TUI) for a pre-run verification
  using real-world telemetry.
- **Refusal Policy**: If a proposed command relies on Linux syntax on macOS, or
  refers to non-existent files, the team MUST abort and re-validate assumptions.

## 🛠️ Performance & Environment Rules

## 🛠️ Performance & Environment Rules

- **Do NOT build for simulator**: Always target the physical **iPhone 15 Pro
  Max** in release configurations.
- **No Metro/EAS/Dev**: When performing release builds, use the raw binary
  production paths.
- **Proactive Validation**: Never leave a build broken. If the Watchdog clicks
  "Retry," resume immediately from the last known good state.

## ⚡ Convergence Triggers (Team Commands)

When the USER uses these specific phrases, you MUST execute the corresponding
team workflow:

1. **"get smarter"**: Trigger `/get-smarter` workflow.
   - **Action**: Run TUI, sync with Nexus, update `GEMINI.md`, and log results
     in the Brain/Report.
2. **"i have an idea..."**: Trigger `/new-idea` workflow.
   - **Action**: Transform a user idea into a collaborative team implementation.

3. **"cleanup my desktop"**: Trigger `task_desktop_neat.py` via Automation
   Agent.
   - **Action**: Rearrange all desktop icons into a clean grid using
     AppleScript. No deletions or modifications to files.

4. **"update everything"**: Full documentation and memory sync after features.
   - **Action**: Execute this checklist:
     1. Update `CHANGELOG.md` with new features/fixes
     2. Update `README.md` if capabilities changed
     3. Update `GEMINI.md` with new paths, settings, servers
     4. Sync `GEMINI.md` to `~/.gemini/GEMINI.md`
     5. Update `memory/team_brain.md` with feature status
     6. Triple-write lesson to SQLite, WORKING_MEMORY.json, team_brain.md
     7. Notify Nexus agents via `nexus agent --agent main --local --message`
     8. Commit and push all changes to main

---

_Status: Autonomous Team Mode Enabled. The goal is to evolve into the world's
most stable autonomous computer running multi-agent swarms._

---

## 🚀 Agent CLI Autonomy (DO IT YOURSELF)
When managing external services or project configurations, **do not ask the user to perform manual UI tasks if a CLI tool exists.** 
You are an autonomous agent and have full capability to run shell commands on the user's machine.

1. **Vercel Environments:** Use `npx vercel env add <name> <environment> --value "<value>" --yes` to inject variables rather than asking the user to use the Vercel Dashboard. Use `npx vercel env ls` to verify.
2. **MCP Integrations:** Use `gemini mcp add` to automatically provision and connect remote MCP servers (like Google Cloud Vertex AI) rather than asking the user to manually configure settings files. 
3. **General Principle:** If a manual step can be replaced by an authenticated CLI command, **execute the command yourself** and report the success to the user.

## 🧠 Lessons Learned (2026-02-04)

### TUI Stability & Process Hygiene (2026-02-10)

**Incident**: TUI window crashes (closes) after an agent completes a task or
during certain background operations.

**Root Causes**:

1. **Broad pkill patterns**: `pkill -f "nexus"` in `helpers.ts` was matching and
   killing `nexus-tui` and `nexus-gateway` because they started with the same
   prefix.
2. **Invalid Watchdog command**: `monitor.py` was calling the non-existent
   `nexus gateway wake` command, causing CLI errors and instability.
3. **Aggressive port clearing**: `gateway:watch` was using `--force` which sends
   `SIGTERM` to listeners on port 18789 on every file change (including
   memories/reports).

**Fixes Applied**:

1. **Word Boundaries**: Use `\b` in `pkill` regex to ensure exact matches only.
2. **Session Guard**: Added `sessionId` requirement to agent process cleanup.
3. **Command Correction**: Updated Watchdog to use
   `gateway call system-presence`.
4. **Dev Safety**: Removed `--force` from `gateway:watch` to allow graceful
   reloads.

---

### Test → Verify → Confirm (TVC) - MANDATORY

**Every critical operation MUST follow TVC:**

1. **TEST** - After making changes, run tests or checks to validate
2. **VERIFY** - Confirm the output matches expectations (don't assume success)
3. **CONFIRM** - Report verified results with evidence (not just "done")

**Examples:**

| Operation        | Test                 | Verify              | Confirm         |
| ---------------- | -------------------- | ------------------- | --------------- |
| File write       | Read file back       | Content matches     | Show snippet    |
| Config change    | Reload/query config  | Value is set        | Print new value |
| Agent delegation | Check agent response | Task completed      | Include output  |
| Email send       | Check API response   | Message ID returned | Report ID       |

**Anti-Patterns (DO NOT DO):**

- ❌ "I updated the file" (without reading it back)
- ❌ "Task delegated successfully" (without checking result)
- ❌ "Coder completed the task" (without verifying the actual change)

**Correct Pattern:**

```
✅ Updated team_brain.md
   Verified: grep shows "Phase 4" present (line 142)
   Confirmed: Commit b3f2b4ff5
```

### Always Verify Delegated Work

When delegating to Nexus agents:

1. **Check the actual output** - Don't just trust "completed" status
2. **Verify the artifact** - Read the file, check the config, test the endpoint
3. **Escalate if needed** - If delegation fails silently, complete the task
   yourself

### Phase 3/4 Incident (2026-02-04)

**What happened:** Delegated team_brain updates to writer agent. Reports showed
commit hashes indicating success. But Phase 3/4 content wasn't actually in the
file.

**Root cause:** Trusted delegation reports without verification.

**Fix:** Always verify critical writes by reading back the content.

### Validator Agent Test File Incident (2026-02-05)

**What happened:** Delegated test creation to validator agent. Agent reported
"5/5 tests passing" and claimed to create deployment.test.ts. But the file was
never actually committed - `find_by_name` returned 0 results.

**Root cause:** Agent hallucinated successful execution. Output looked correct
but no file was created.

**Fix:** After any file creation delegation:

1. Run `find_by_name` or `list_dir` to confirm file exists
2. If file doesn't exist, create it yourself (escalation)
3. Never report success to user based only on agent output

### UI Design Preferences

- **No left-border accents on cards** - Cards should have uniform borders, no
  colored left-border indicators
- **Rocket Orange theme** - Primary accent color is `#ff6b35`
- **Dark mode friendly** - Use CSS variables for all colors
- **Reusable Component Standard** - From now on, design and use reusable components (buttons, modals, icons, etc.) when building or modifying features, rather than defining inline elements. Do not proactively replace existing legacy inline components yet; transition them incrementally as the app evolves.

---

## 🤖 Health eRecords Agent Operating System (HER-AOS)

Standardized parallel agent orchestration for Health eRecords (v2026-02-20).

### Core Components

- **Config**: `health-state/config.json` (Model defaults + fallbacks)
- **Registry**: `agents/registry.ts` (Agent definitions from MD files)
- **Engine**: `agents/engine.ts` (Parallel spawn + concurrency limiting)
- **Storage**: `agents/storage.ts` (SQLite per-session bookkeeping)
- **Runner**: `agents/orchestrator.ts` (CLI entry point)

### Model Configuration (Locked)

- **Primary**: `openai-codex/gpt-5.5`
- **Fallback**: `google/gemini-2.5-flash`

### Runtime Commands

- `bun agents/orchestrator.ts status` - Check system readiness
- `bun agents/orchestrator.ts parallel '<json>'` - Execute parallel tasks
- `bun agents/smoke-test.ts` - Verify orchestration stability

### Scaling Rules

- Max 19 concurrent agents for main tasks.
- Max 10 concurrent subagents per coordinator.
- Use Bun native SQLite for session persistence to bypass Node16 blocking.

---

### Convergence Protocol 6: Multi-Agent Meetings (2026-02-08)

When solving complex optimization problems, convene a **5-agent meeting**:

1. **architect** — System design improvements
2. **analyst** — Data analysis of actual inputs
3. **critic** — Code review with severity ratings (CRITICAL/HIGH/MEDIUM)
4. **coder** — Concrete replacement code
5. **research** — Background data gathering

**Protocol:**

- Run all 5 in parallel via `orchestrator.js parallel`
- If agents get killed, it's a concurrency issue — check `agent-limits.ts`
- Synthesize findings into a unified plan BEFORE implementing
- Implement, test, iterate until target met

**Lesson (2026-02-08):** Agent concurrency default was 4, not the configured 19.
Always verify runtime defaults match config values.

### Convergence Protocol 7: Instinct-Driven Learning (2026-02-08)

The Continuous Learning system creates instincts from agent patterns:

- **Observer**: `node scripts/instinct-observer.cjs` (run daily via cron)
- **Instinct Store**: `memory/instincts/personal/*.md`
- **Confidence**: 0.3 (tentative) → 0.99 (near-certain), +0.05 per
  re-observation
- **Evolution**: When 3+ instincts cluster in same domain → suggest
  skill/workflow
- **Re-run convergence**: Each observer run bumps existing instincts toward cap

### Convergence Protocol 8: Model Migration Safety (2026-02-08)

When switching AI models (e.g., `gpt-5.5` → `gpt-5.6-codex`):

1. **Test TUI output** — Send a simple message via TUI before deploying broadly
2. **Check reply tag behavior** — Some models output only `[[reply_to_current]]`
   on webchat
3. **Verify system prompt conditionals** — Channel-specific sections (Reply
   Tags) may confuse models
4. **Clear contaminated history** — If old sessions contain protocol tags, strip
   them or start fresh
5. **Full checklist**: `docs/troubleshooting/TUI_REPLY_TAG_FIX.md`

**Key Files:**

- `src/agents/core/system-prompt.ts` — Conditional Reply Tags by channel
- `src/agents/core/pi-embedded-runner/google.ts` — `stripReplyTagsFromHistory`
  in sanitization pipeline
- `src/interfaces/gateway/server-chat.ts` — `stripReplyTagsFromBroadcast`
  defense-in-depth

### Convergence Protocol 9: Live Agent Invocation (2026-02-08)

**All 20 agents are now LIVE via Codex OAuth.** Key lessons:

1. **Default provider must match available auth** — `DEFAULT_PROVIDER` was
   `anthropic` but only `openai-codex` OAuth existed. Changed to `openai-codex`.
2. **Default model must be available** — `DEFAULT_MODEL` was `claude-opus-4-6`
   (no auth). Changed to `gpt-5.3-codex`.
3. **Agent registration is separate from agent directories** — Directories in
   `nexus-state/agents/` don't auto-register. Must explicitly `nexus agents add`
   or add to `nexus.json` agents.list.
4. **Model ref must include provider prefix** — `gpt-5.3-codex` alone resolves
   to `anthropic/gpt-5.3-codex`. Use `openai-codex/gpt-5.3-codex`.
5. **Stress test baseline**: 20 agents parallel = 21.5s wall-clock, 17.6x
   speedup vs sequential.

**Key Files:**

- `src/agents/core/defaults.ts` — `DEFAULT_PROVIDER` and `DEFAULT_MODEL`
- `nexus-state/nexus.json` — agents.list with model refs
- `nexus-state/agents/*/agent/auth-profiles.json` — OAuth tokens per agent

### Convergence Protocol 10: Backlog Hygiene (2026-02-08)

**Incident**: 37 stale `SKIPPED`/`FAILED` cron tasks piled up in Mission
Control's BACKLOG column because the front-end only recognizes
`COMPLETED`/`SUCCESS`/`RUNNING`/`STARTED` as non-backlog statuses.

**Root Cause**: Cron scheduler wrote `SKIPPED` for fast-exit runs and `FAILED`
for errors, but never transitioned them to a terminal state the UI recognized.

**Fix Applied**:
`UPDATE automation_tasks SET status = 'COMPLETED' WHERE status IN ('SKIPPED', 'FAILED');`

**Preventive Measures**:

1. **Cron executor** should write `COMPLETED` (not `SKIPPED`) for runs that
   finish without errors, even if skipped due to conditions
2. **Automated cleanup**: When items are completed, remove them from the backlog
   — don't let stale items accumulate
3. **Future**: Add Task Outcome State Machine with proper terminal states and
   auto-compaction
4. **Dashboard rule**: Only items with status NOT IN (`COMPLETED`, `SUCCESS`,
   `RUNNING`, `STARTED`) appear in BACKLOG

**Key Table**: `memory/working_memory.db` → `automation_tasks`

### Convergence Protocol 11: Artifact Detection & File Serving (2026-02-08)

Mission Control's ArtifactsPanel detects file paths in agent messages using 5
regex strategies. When adding new detection patterns, test against all message
formats (bullet points, backticks, action words, standalone lines).

**Detection Strategies** (`ArtifactsPanel.jsx`):

1. Paths after action words (created/generated/saved/wrote)
2. Standalone absolute paths on their own line
3. Paths in backticks
4. Paths after "here:" or "at:" on next line
5. Paths after bullet points (•, -, \*, numbered lists)

**File Serving**: `/api/file-read` endpoint in `server.js` streams local files
with proper MIME types. Safety bounds: nexus project root + home directory only.

**Key Files**:

- `projects/mission-control/src/ArtifactsPanel.jsx` — Detection + viewer
- `projects/mission-control/server.js` — `/api/file-read` endpoint

### Convergence Protocol 12: Git Safety Rule (2026-02-08)

**Incident**: Nexus auto-committed a file without being asked.

**Fix**: Added Section 8 to `/Users/danny/nexus/PRINCIPLES.md`:

- NEVER run `git commit`, `git push`, `git add`, or any git write operation
  unless user explicitly asks
- Read-only git commands (`git status`, `git log`, `git diff`) are always
  allowed
- If uncertain whether a git command writes state, ask first

### Convergence Protocol 13: Secure Canonicalization (2026-02-09)

**Incident**: Inconsistent role/scope casing led to brittle access control
logic.

**Fix**:

- Always lowercase and trim roles, scopes, and tokens before comparison.
- Use `crypto.timingSafeEqual` for sensitive token verification.
- Enforce mandatory TTLs for device tokens to limit the blast radius of leaked
  credentials.

### Convergence Protocol 14: Single-Writer Transport Ownership (2026-02-09)

**Incident**: Concurrent state mutation attempts in WhatsApp transport caused
session churn.

**Fix**:

- Only one active process should "own" a specific WhatsApp session at a time.
- Route all transport I/O through a single owner to prevent device identity
  mismatches.
- Implement outbound queueing with idempotency keys to handle transport
  instability gracefully.

### Convergence Protocol 15: Event-Sourced Accounting (2026-02-09)

To ensure token usage and financial records are never lost during crashes:

1. **WAL-First Persistence**: Always append events to a local JSONL log (WAL)
   BEFORE enqueuing for DB batching.
2. **Batch-to-Disk**: Use 200-event batches or 250ms timeouts for SQLite writes
   to minimize fsync overhead and protect response latency.
3. **TUI Rehydration**: Every interface startup MUST query the `token_ledger` to
   restore user counters to the current truth.
4. **Hourly Rollups**: Maintain a `ledger_hourly` table for fast O(1) dashboard
   queries, updated within the same transaction as the raw events.

### Convergence Protocol 17: Autonomous Live Sync (2026-02-09)

To ensure Mission Control reflects live system state without manual refreshes:

1. **5-Minute Heartbeat**: A background daemon (`scripts/nexus-live-sync.ts`)
   runs every 5 minutes.
2. **File Watching**: Monitors `CHANGELOG.md`, `team_brain.md`, `GEMINI.md`, and
   `WORKING_MEMORY.json`. Any change triggers an automatic "System Updated"
   entry in the activity feed.
3. **Backlog Auto-Reconciliation**: The daemon scans the database for `BACKLOG`
   items that have actually been implemented and moves them to `SUCCESS` based
   on system heuristics.
4. **Persistence**: The daemon is integrated into `scripts/nexus-boot.sh` for
   auto-start.
5. **State Tracking**: Current sync state is stored in
   `nexus-state/live-sync-state.json`.

### Convergence Protocol 19: Orchestrator Delivery Contracts (2026-02-10)

To guarantee inter-agent communication reliability:

1. **Mandatory ACK**: Every message sent via the Message Bus (`agent_messages`)
   requires an acknowledgment (status transition to `ACKNOWLEDGED`) within the
   defined `required_ack_by` timestamp (default 60s).
2. **Auto-Retry**: The Live Sync daemon automatically retries unacknowledged or
   scheduled-retry messages using exponential backoff (30s, 60s, 120s).
3. **DLQ Escalation**: After 3 failed delivery attempts, messages are moved to
   the Dead Letter Queue (status `FAILED`) and trigger a critical alert in
   Mission Control.
4. **Health Telemetry**: The system heartbeat emits real-time stats for pending
   and failed messages, ensuring visibility into swarm communication health.

---

### Convergence Protocol 20: Owner Impersonation Mode (2026-02-12)

For local testing of SaaS plan enforcement, admins can impersonate owner
privileges for any tenant.

**Activation**:

1. Set `OWNER_IMPERSONATION_MODE=true` in `.env`.
2. Ensure `NEXUS_MODE` is `dev_local` or `local_saas`.
3. Include headers in request:
   - `X-Owner-Impersonate: true`
   - `X-Admin-Token: <ADMIN_DEV_TOKEN>`

**Behavior**:

- Tenant is elevated to `isOwner: true` and `plan: owner`.
- All agents unlocked, limits bypassed.
- No DB mutation occurs; the override is request-scoped.
- UI shows `OWNER TEST MODE ACTIVE` badge.

---
### Convergence Protocol 18: Safe File Pipeline (2026-02-10)

To prevent file corruption and ensure atomic updates during agentic edits:

1. **Stage-First**: NEVER write directly to critical project files. Use the
  Staging API `POST /api/staging/stage` to write content to a temporary buffer
  first.
2. **Validation**: Use `POST /api/staging/validate` (if the type supports it) or
  manually verify the staged `.tmp` file before promotion.
3. **Atomic Promotion**: Use `POST /api/staging/promote` to move the staged file
  to its final destination. This uses `fs.rename` for an atomic
  "all-or-nothing" write.
4. **Automatic Cleanup**: The Live Sync daemon automatically purges any
  abandoned staged files older than 1 hour.
5. **Paths**: Staging directory is located at
  `projects/mission-control/uploads/staging`.

### Convergence Protocol 20: Preflight Validation Gateway (2026-02-10)

To ensure operational readiness and prevent wasted resources:

1.  **Mandatory Preflight**: Before setting a task to `RUNNING`, agents or runners should invoke `scripts/nexus-preflight.ts <taskId>`.
2.  **Prerequisite Scoping**: Tasks should define required assets (files, ENV vars, API access) in their `metadata.prerequisites` JSON field.
3.  **Fail-Fast Policy**: If preflight fails, the task execution MUST be blocked, and the `remediation` field from the validation result should be presented to the user/coordinator.
4.  **Metric Visibility**: Prevented failures are tracked in the `state` table (`metrics.preflight.prevented_failures`) and reported in system health checks.

### Convergence Protocol 21: Reliability Hub Core (2026-02-10)

Reliability Hub V1 is the canonical surface for failure management in Mission Control.

1. **Failure Signature Grouping**: Normalize failures by `name + error` signature so repeated incidents collapse into one actionable cluster.
2. **Integrated Reliability UI**: Reliability Hub is embedded in Mission Control for direct triage without context switching.
3. **Convergence Target**: Every remediation flow must drive the task lifecycle back to `SUCCESS` or escalate with explicit operator context.

### Convergence Protocol 22: Policy-Driven Remediation Engine (2026-02-10)

Hard-coded remediation branches are deprecated in favor of declarative policies.

1. **Source of Truth**: Define remediation behavior in `config/remediation_policies.json`.
2. **Signature Matching**: Policies match on failure signature fields (`name`, `error`) to select deterministic actions.
3. **Supported Actions**: `re-queue_message`, `reset_task`, `notify_agent`.
4. **Mandatory Dry-Run Flag**: Policy execution requires `dry_run` support for safe validation before live execution.

### Convergence Protocol 23: Remediation SLOs & Windowed Stats (2026-02-10)

Reliability must be measured continuously, not inferred ad hoc.

1. **SLO Tracking**: Define remediation success and latency objectives for reliability operations.
2. **Windowed Telemetry**: Compute rolling-window stats for failure volume, remediation attempts, and recovery outcomes.
3. **Operator Signal**: Surface breach risk early so operators can intervene before systemic degradation.

### Convergence Protocol 24: Loopback Scoped Auth V2 (2026-02-10)

Local trust is scoped, not blanket.

1. **Role-Aware Loopback Access**: Loopback traffic is mapped to constrained local roles (least privilege) instead of unrestricted bypass.
2. **Dashboard Stability**: Prevent token-missing reload loops while preserving strict auth for non-loopback clients.
3. **Auditability**: Local role assignment and access path must remain observable for incident forensics.

### Convergence Protocol 25: Incident Replay & Convergence Verification (2026-02-10)

Replayable incidents are required to prove reliability improvements.

1. **Replay Pipeline**: Persist incidents under `nexus-state/incidents` with enough context to deterministically reproduce failure paths.
2. **Regression Defense**: Run incident replay after remediation or auth/control-plane changes.
3. **Convergence Gate**: A replay run is only considered passing when the system re-converges to `SUCCESS` within the defined timeout window.

### Convergence Protocol 27: AI SDK V3 Evolution & Semantic Caching (2026-02-10)

To ensure high-performance, safe, and cost-effective agent operations:

1.  **Semantic First**: Use `@nexus/ai-sdk`'s `NexusAiSdkBridge` with `SupabaseAiCache` to recall redundant task solutions instantly via vector search.
2.  **Approval Gates**: High-risk tools (`write`, `exec`, `delete`) MUST be marked with `isDestructive: true` and gated by a human-in-the-loop approval hook.
3.  **Model-Agnostic Personas**: All agent system prompts MUST be sourced from the centralized `@nexus/prompts` library to ensure consistency across model migrations.
4.  **V3 Multi-Step Loop**: Use the AI SDK's `maxSteps` loop for tool-calling instead of manual recursion to ensure robust state management and error recovery.

### Convergence Protocol 28: Multi-Agent Handoff Contracts (2026-02-10)

To prevent "Handoff Drift" in autonomous swarms:

1.  **Typed Envelopes**: Every inter-agent message must wrap its payload in a versioned schema (e.g., `handoff.v1.json`).
2.  **Validation Gate**: Receiving agents MUST validate the incoming handoff against the expected Zod schema before processing.

### Convergence Protocol 29: Micro-Cent Accounting & Cost Transparency (2026-02-11)

To ensure sustainable autonomous operation and prevent budget overruns:

1.  **Mandatory Accounting**: Every AI SDK invocation MUST be wrapped in a cost-tracking block that updates the `token_ledger`.
2.  **Micro-Cent Precision**: All cost displays MUST support 6-decimal precision ($0.000000) to accurately reflect fractional cents.
3.  **Revenue/Spend Balancing**: Mission Control should surface "Spend" as a primary header metric alongside "Completion Rate".
4.  **Reasoning Persistence**: The model's `reasoning` or `thought` path must be persisted in the `result` field of `automation_tasks` for transparency.

### Convergence Protocol 30: Integrated Presence & Doc Visualization (2026-02-11)

To maintain context and reduce cognitive load during analysis:

1.  **Navigation Sovereignty**: Folder drill-down in Mission Control MUST happen via internal state/prop updates, not full page reloads or new tabs.
2.  **Integrated Viewer**: Content types (Markdown, PDF, Images) SHOULD be rendered in a premium, modal-based in-app viewer (`DocViewerModal`).
3.  **Aesthetics of Analysis**: The viewer must support rich formatting (GFM), syntax highlighting, and smooth entrance animations (blur/fade/scale).
4.  **Drift-Free breadcrumbs**: Users must be able to navigate back to the root Docs level without losing the dashboard's synchronized state.
### Convergence Protocol 31: Swarm Stability & Direct Invocation (2026-02-11)

To prevent signal propagation issues and `ELIFECYCLE` errors in parallel agent swarms:

1.  **Direct Entry**: Prefer direct script execution (`node scripts/run-node.mjs`) over package manager aliases (`pnpm nexus`) for background or parallel tasks.
2.  **Signal Isolation**: Explicitly ignore or handle `SIGINT` (Ctrl+C) in parent runners to allow child processes to finalize their own cleanup/sessions.
3.  **Exit Code Propagation**: Always propagate the actual child exit code to ensures accurate task status tracking in Mission Control.

### Convergence Protocol 32: Recursive RAG Protection (2026-02-11)

To ensure agents can always reach their memory even during swarm congestion:

1.  **Lazy Initialization**: Initialize the `UnifiedMemoryRouter` and its database connections only on the first `memory_search` tool call to reduce overhead.
2.  **UUID Normalization**: Always use `normalizeToUuid` for user and project IDs across all memory tiers to prevent retrieval misses due to varying ID formats (UUID vs name).
3.  **Zero-Shot Directives**: Include the `## Memory Recall` section at the top of every agent's system prompt to trigger autonomous tool selection.

### Convergence Protocol 33: Multi-Layer UI Synchronization (2026-02-11)

To ensure that real-time UI features (like Drag-and-Drop) remain synchronized with the system state:

1.  **Process Reconciliation**: When modifying a backend service (`server.js`) that supports a running frontend (`Vite`), the backend process MUST be explicitly restarted. Frontend HMR (Hot Module Replacement) does not propagate to the Node.js API layer.
2.  **DND Safety Guards**: Always implement a global `onDrop` handler at the grid/container level with `e.preventDefault()`. This prevents the browser's default behavior (e.g., trying to navigate to or download dropped data strings) if a drop misses a specific target.
3.  **Visual Feedback Sovereignty**: Use `effectAllowed` and `dropEffect` properties on the `DataTransfer` object to force the browser to display appropriate cursors (e.g., 'move' vs 'none') and prevent "snap-back" hallucinations in the UI.
### Convergence Protocol 34: Robust Reconnection & Boot (2026-02-11)

To ensure reliable connections and fast recovery during system transitions:

1.  **Precise Process Termination**: Always use word-bounded `pkill` patterns (`pkill -f "\bnexus gateway\b"`) in startup scripts to ensure clean teardowns without collateral damage to other nexus processes.
2.  **Explicit Recovery Links**: Startup and restart scripts MUST print a clickable, tokenized dashboard URL (e.g., `http://localhost:18789/?token=...`) to provide an immediate "one-click" recovery path.
3.  **Automatic Auth Clearing**: Browser-side authentication handlers MUST detect token mismatches (e.g., "Invalid Credentials") and automatically clear the stale token from settings, triggering a fresh connection attempt with the current truth.
4.  **Visual Consistency**: Use iconography that differentiates functionally distinct sections (e.g., Calendar for Schedule, Clock for Cron) to guide the user's mental model and reduce cognitive load.

### Convergence Protocol 35: Official Platform Contracts & Specialist Guard (2026-02-11)

To ensure a world-class developer experience and platform stability:

1.  **Spec-First Development**: All changes to the REST API or MCP layer MUST be preceded by updates to `/docs/API_SPEC.md`, `/docs/MCP_SPEC.md`, and `docs/CONFIG_SCHEMA.json`.
2.  **Deterministic Handshake**: Every MCP client MUST perform a handshake. The server's response (plan-based limits + features) is the final authority.
3.  **Specialist Consultation**: For any task involving API integration, SDK generation, or MCP client configuration, the `mcp` specialist agent MUST be consulted or delegated to.
4.  **Structural Validation**: Incoming client configurations MUST be validated against the platform schema definition in `config/validator.ts` before processing.
5.  **Plan Authority**: Server-enforced limits (concurrency, timeouts) ALWAYS override client-requested preferences.
---

### RAG Autonomy & Build Persistence (2026-02-11)

**Incident**: Agents were failing to find memory despite correct data presence.

**Root Cause**:

1. `better-sqlite3` was compiled against an incompatible Node version in the
   local environment.
2. User IDs were inconsistent between "danny" (local) and UUIDs (Supabase).

**Fix Applied**:

1. Added `normalizeToUuid` to the `UnifiedMemoryRouter`.
2. Integrated `UnifiedMemoryRouter` directly into the `memory_search` tool.
3. Added a `pnpm rebuild better-sqlite3` step to the evolution roadmap.

---

## 2026.2.10 (Evolution Session #5 — AI SDK V3 & Orchestration)

### 🚀 Nexus Core V3 Evolution

- **Integrated V3 Runner**: Fully implemented `runEmbeddedAttemptV3` using
  Vercel AI SDK and Nexus AI Bridge.
- **Semantic Caching Layer**: Activated Tier 3 memory (Supabase pgvector) for
  agent run results, reducing latency for repetitive tasks.
- **Handoff Utilities**: Created `buildNexusToVercelMessages` and `v3-utils` for
  seamless historical context mapping.
- **Tool Normalization**: Standardized tool parameter normalization for Claude
  Code compatibility across all coding tools.
- **Workflow Convergence**: Completed "Get Smarter" session, generating a 30-day
  roadmap for autonomous multi-agent orchestration.

## 2026.2.10 (Evolution Session #4 — Data Integrity & Kit)

### 🚀 AI SDK V3 Evolution Roadmap (30-Day Focus)

Created on 2026-02-10 during Evolution Session #5.

1. **Coordinator Control Plane**: Formal run state machine (queued → planning →
   delegated → executing → validating → completed).
2. **Agent Capability Contracts**: Tool ACL + budget (tokens/cost) + SLA
   enforcement per agent.
3. **Hierarchical Planning**: Planner → Specialists → Verifier loop with
   dependency graph (DAG) execution.
4. **Typed Schema Handoffs**: Standardize all inter-agent outputs on typed
   schemas + versioning.
5. **Closed-loop Autonomy**: Policy-driven remediation tiers with confidence
   scores and blast-radius estimates.

### Convergence Protocol 26: Reliability Observability Stack (2026-02-10)

Reliability tools must form a complete observe-diagnose-remediate loop.

1. **Boot Profiling**: Run `scripts/startup-profiler.cjs --benchmark` to measure
   cold-start latency. Track p50/p95/p99 in `memory/perf-baseline.json`.
2. **Chaos Validation**: Run `scripts/chaos-test.cjs` to validate all
   Convergence Protocols as executable assertions. Target: 22/22 pass.
3. **Incident Replay**: Use `scripts/incident-replay.cjs --timeline` to
   reconstruct failure sequences from `agent_messages` + `automation_tasks`.
4. **Policy-Driven Remediation**: Define remediation actions as declarative JSON
   policies in `remediation-policies.json`, not hardcoded switch/case.
5. **SLO Windowing**: Classify failures by severity (CRITICAL/HIGH/MEDIUM/LOW)
   with time-based SLO targets. Sort by severity first, count second.
6. **Key Scripts**:
   - `scripts/startup-profiler.cjs` — Boot performance baseline
   - `scripts/chaos-test.cjs` — Protocol validation suite
   - `scripts/incident-replay.cjs` — Failure reconstruction
   - `projects/mission-control/remediation-policies.json` — Policy engine config

## 🧠 Lessons Learned (2026-02-09)

### Mission Control UI Desync (Backlog Count)

**What happened:** Completed two tasks but the UI still showed "Backlog 10".

**Root Cause:**

1. The server's `better-sqlite3` instance was stale because the DB was updated
   via direct CLI `sqlite3` calls while the server was running.
2. The UI grouping logic included `FAIL_TERMINAL` and `FAIL_RETRY` in the
   Backlog count, leading to persistent non-zero counts.

**Fix Applied:**

1. Added `PATCH /api/tasks/:id` endpoint to `server.js` for process-safe
   updates.
2. Updated `App.jsx` to move failed/skipped tasks out of the Backlog column.
3. Created `scripts/nexus-task.ts` for agents to use when completing tasks.

---

### 📦 @nexus/* Library Architecture (NEW — 2026-02-08)

Forked `@mariozechner/pi-*` → `@nexus/*` workspace packages for full ownership:

| Package               | Source                   | Purpose                                 |
| --------------------- | ------------------------ | --------------------------------------- |
| `@nexus/ai`           | `packages/ai/`           | LLM providers, model catalog, streaming |
| `@nexus/agent-core`   | `packages/agent-core/`   | Agent framework, hooks, loops           |
| `@nexus/coding-agent` | `packages/coding-agent/` | Coding assistant, tools, TUI            |
| `@nexus/tui`          | `packages/tui/`          | Terminal UI components                  |

- **Default Provider**: `openai-codex` (via OAuth)
- **Default Model**: `gpt-5.3-codex` (400K context, 128K output)
- **Model Catalog**: `claude-opus-4-6` added across 5 providers ($8/$40 per
  MTok)
- **Workspace**: Registered in `pnpm-workspace.yaml` as `packages/*`
- **No upstream dependency**: Zero `@mariozechner/pi-*` imports remain

### 🧠 Unified Memory Layer

Three-tier memory architecture for persistent, semantic recall across all
agents:

| Tier       | Store                      | Purpose                  | Access              |
| ---------- | -------------------------- | ------------------------ | ------------------- |
| **Tier 1** | `memory/team_brain.md`     | Team knowledge, SOPs     | All agents (local)  |
| **Tier 2** | `memory/working_memory.db` | Session state, ephemeral | All agents (SQLite) |
| **Tier 3** | Supabase pgvector          | Semantic user memories   | Cloud + embeddings  |

**Key Services** (`src/services/memory/`):

- Document retrieval - Gemini `gemini-embedding-001` at 3072 dimensions with
  full-precision storage and indexed `halfvec(3072)` search
- `SupabaseMemoryService.ts` - pgvector CRUD + search
- `UnifiedMemoryRouter.ts` - Triple-write coordinator
- `index.ts` - Initialization helper

**Usage:**

```typescript
import { initializeNexusMemory } from "./src/services/memory/index.js";
const { router } = await initializeNexusMemory({
   supabaseUrl: process.env.SUPABASE_URL!,
   supabaseKey: process.env.SUPABASE_ANON_KEY!,
   geminiApiKey: process.env.GEMINI_API_KEY,
});
// Query all 3 tiers
const results = await router.query(userId, "search term");
// Learn (triple-write)
await router.learn({ key, value, markdown, source, userId });
```

**Skill**: `skills/nexus-memory/SKILL.md` **Docs**:
`docs/danny/UNIFIED_MEMORY_LAYER.md`

### 🤖 Full Agent Roster (20 Agents)

| Agent         | Specialty                                  | Phase    |
| ------------- | ------------------------------------------ | -------- |
| `main`        | Orchestrator & coordinator                 | Baseline |
| `research`    | 🔬 Research & fact-finding                 | Baseline |
| `coder`       | 💻 Code & implementation                   | Baseline |
| `writer`      | ✍️ Documentation & content                 | Baseline |
| `analyst`     | 📊 Data analysis & reports                 | Baseline |
| `devops`      | 🛠️ Infrastructure & deployments            | Baseline |
| `email`       | 📧 Email management                        | Baseline |
| `planner`     | 📅 Scheduling & planning                   | Baseline |
| `creative`    | 🎨 Design & visuals                        | Baseline |
| `validator`   | ✅ Quality assurance                       | Baseline |
| `critic`      | 🔍 Review & critique                       | Baseline |
| `architect`   | 🏗️ System design                           | Baseline |
| `vercel`      | ▲ Vercel deployments & serverless          | Baseline |
| `rag`         | 📚 Source-grounded answers with provenance | Phase 2  |
| `crawler`     | 🕸️ Web crawling & URL manifests            | Phase 2  |
| `scraper`     | 📋 Data extraction to JSON/CSV             | Phase 2  |
| `longmemory`  | 🧠 Durable memory archivist                | Phase 2  |
| `webresearch` | 🌐 Web research with attribution           | Phase 2  |
| `social`      | 📱 Social media content                    | Phase 2  |
| `youtube`     | 🎬 Video/transcript analysis               | Phase 2  |

### 🔌 MCP Servers

**Always use the OpenAI developer documentation MCP server if you need to work
with the OpenAI API, ChatGPT Apps SDK, Codex, or any OpenAI-related development
without me having to explicitly ask.**

| Server                | Status     | Purpose                                                           |
| --------------------- | ---------- | ----------------------------------------------------------------- |
| `openaiDeveloperDocs` | ✅ Enabled | OpenAI developer documentation - search API docs, Apps SDK, Codex |
| `vercel`              | ✅ Enabled | Vercel deployments, projects, domains, docs search                |
| `apify`               | ✅ Enabled | Web scraping, RAG browser, Actors                                 |
| `shadcn`              | ✅ Enabled | React component browsing & install                                |
| `context7`            | ✅ Enabled | Semantic documentation search                                     |
| `playwright`          | ✅ Enabled | Browser automation (testing, scraping)                            |
| `sequentialthinking`  | ✅ Enabled | Stepwise problem decomposition                                    |
| `markitdown`          | ✅ Enabled | Convert PDFs/Office/HTML → Markdown                               |
| `chrome-devtools`     | ✅ Enabled | Debug web pages via CDP                                           |
| `filesystem`          | Available  | File operations                                                   |
| `sqlite`              | Available  | Working memory queries                                            |
| `memory`              | Available  | Knowledge graph                                                   |

**MCP Server Catalog**: `/docs/MCP_SERVERS.md` **Apify Docs**:
https://github.com/apify/apify-mcp-server

### 📱 MCP Apps (Portable Widgets)

Nexus exposes portable UI widgets for AI hosts:

| Widget        | URI                         | Purpose                    |
| ------------- | --------------------------- | -------------------------- |
| Agent Status  | `ui://nexus/agent-status/`  | Real-time agent monitoring |
| Task Runner   | `ui://nexus/task-runner/`   | Quick task delegation      |
| Memory Search | `ui://nexus/memory-search/` | Query knowledge graph      |

**Key Files**:

- `src/mcp-apps/index.ts` - Server integration
- `widgets/*/index.html` - Widget implementations
- `skills/nexus-mcp-apps/` - Skill documentation

### 📅 Scheduled Cron Jobs

| Job                    | Schedule  | Purpose                         |
| ---------------------- | --------- | ------------------------------- |
| Autonomous Team Review | Daily 7pm | Team sync & review              |
| Agent Self-Test        | Daily 6am | Test all agents, email failures |

### 📧 Email Configuration

- **Transport**: gog CLI with custom "Nexus" OAuth credentials
- **Target**: apd1034@gmail.com
- **Behavior**: Email on failures only

### 🛠️ Key Paths

| Path                                                       | Purpose                     |
| ---------------------------------------------------------- | --------------------------- |
| `packages/`                                                | Vendored libraries / packages |
| `src/ai/`                                                  | Local AI models & catalog   |
| `packages/opencode/`                                       | CLI and TUI launcher        |
| `memory/team_brain.md`                                     | Tier 1: Team knowledge      |
| `memory/working_memory.db`                                 | Tier 2: SQLite state        |
| `src/services/`                                            | Tier 3: Memory services     |
| `state/config.json`                                        | Main config                 |
| `skills/`                                                  | Local agent skills catalog  |
| `state/agents/`                                            | Agent state directories     |
| `agents/`                                                  | Agent specifications        |


### ⚙️ Key Settings

- **maxConcurrent**: 19 (agents + subagents)
- **Gateway Port**: 18789
- **Gateway Dashboard**: http://localhost:18789
- **Dev UI**: http://localhost:5173
- **Widget Test Server**: http://localhost:3011
- **Supabase**: ckrifzmyjhbzqyyjhqna.supabase.co

## 🆕 2026-02-10 Convergence Update (Reliability Zero)

### Convergence Protocol 27: Lifecycle Data Contracts

To ensure long-term reliability and data integrity for multi-agent
observability:

1. **Enforce Invariants**: All status records must pass temporal checks
   (`finished_at >= started_at`) and metadata presence (non-null signatures).
2. **Health Scorecard**: Use `/api/reliability/audit` to baseline system noise.
   Aim for Score > 95.
3. **Repair First**: Before building analytics or read models, repair or purge
   records that violate contracts.
4. **Developer Kit**: Use `reliability:kit` locally to verify the entire
   observation-remediation loop before pushing protocol changes.

### Convergence Protocol 26: Reliability Observability Stack

Reliability tools must form a complete observe-diagnose-remediate loop.

1. **Boot Profiling**: Run `scripts/startup-profiler.cjs --benchmark` to measure
   cold-start latency.
2. **Chaos Validation**: Run `scripts/chaos-test.cjs` to validate all
   Convergence Protocols as executable assertions (22/22 pass).
3. **Policy Engine**: Define remediation actions as declarative JSON policies in
   `remediation-policies.json`.
4. **SLO Windowing**: Classify failures by severity (CRITICAL/HIGH/MEDIUM/LOW)
   with time-based targets.

---

## 🆕 2026-02-08 Convergence Update (System-Wide)

### Added Skills

- `skills/continuous-learning/` — Extract session patterns into reusable
  instincts
- `skills/strategic-compact/` — Compact context at logical boundaries
- `.agent/workflows/verify.md` — Verification Loop quality workflow

### Agent Rule Upgrades

- `nexus-state/agents/AGENT_RULES.md` now includes:
  - `@nexus/*` architecture map
  - key operational paths
  - convergence trigger workflows
  - self-evolution policy
  - lessons learned + TVC verification guardrails
- Validator upgraded with CRITICAL/HIGH/MEDIUM review gates and explicit
  approval criteria
- Critic upgraded with a structured review framework

### Known Bug Fix Protocol

- Reply directive regex must match bare `[[reply_to` (not only `_current` and
  `:id` forms)
- Affected files: `directive-tags.ts`, `errors.ts`, `chat-sanitize.ts`

### Operational Command

- `scripts/nexus-restart.sh` added for clean gateway+session reset/restart
- Use via shell alias: `nexus-restart`
- npm wrapper: `npm run restart`

### 🧠 Continuous Learning System (2026-02-08)

Instinct-based learning adapted from ECC's continuous-learning-v2:

| Component      | Path                                  | Purpose                                                  |
| -------------- | ------------------------------------- | -------------------------------------------------------- |
| Observer       | `scripts/instinct-observer.cjs`       | Parses session logs, detects patterns, creates instincts |
| Instinct Store | `memory/instincts/`                   | YAML frontmatter markdown files with confidence scoring  |
| Config         | `memory/instincts/config.json`        | Observer settings, confidence thresholds                 |
| Skill          | `skills/continuous-learning/SKILL.md` | Skill documentation                                      |
| Setup          | `scripts/setup-instincts.sh`          | Directory + config initialization                        |

**Commands:**

```bash
node scripts/instinct-observer.cjs              # Analyze sessions, create instincts
node scripts/instinct-observer.cjs --status      # Show instinct dashboard
node scripts/instinct-observer.cjs --dry-run     # Preview without writing
node scripts/instinct-observer.cjs --evolve      # Cluster instincts into skills
```

### 🔗 /orchestrate Workflow (2026-02-08)

Predefined agent chains with structured handoff documents:

| Workflow   | Chain                                |
| ---------- | ------------------------------------ |
| `feature`  | planner → coder → validator → critic |
| `bugfix`   | research → coder → validator         |
| `refactor` | architect → coder → critic           |
| `security` | validator → critic → architect       |
| `custom`   | any agent combination                |

### 🧪 Test Suite (2026-02-08)

Zero-dependency Node.js test framework:

```bash
node tests/run-all.cjs    # Run all 32 tests
```

| Test File                                   | Tests | Coverage                                         |
| ------------------------------------------- | ----- | ------------------------------------------------ |
| `tests/skills/continuous-learning.test.cjs` | 9     | Skill structure, directories, memory integration |
| `tests/scripts/instinct-observer.test.cjs`  | 12    | Observer script, CLI flags, confidence, patterns |
| `tests/workflows/orchestrate.test.cjs`      | 11    | Workflow types, handoff format, agent refs       |

---

## 2026-02-12 (Evolution Session #6 — Declarative Pricing & Build Resilience)

### Convergence Protocol 36: Declarative Pricing & Build Resilience (2026-02-12)

To ensure commercial resilience and modular stability:

1. **Source of Truth**: Always manage model rates in
   `packages/ai-sdk/src/pricing-manifest.json`. Direct code edits to rates are
   forbidden.
2. **Build Dependency Order**: When modifying shared packages (like `ai-sdk`),
   ensure they are built (`pnpm --dir packages/ai-sdk build`) before the root
   build. This prevents `TS6305` (missing declaration) errors.
3. **Strict Type Alignment**: Avoid `implicit any` in cross-package callbacks
   (e.g., `onUsage`). Use explicit typing or `any` to bridge the build gap.
4. **JSON Module Inclusion**: TSConfigs must explicitly include JSON patterns
   (`"include": ["src/**/*.json"]`) when using ESModule import attributes
   (`with { type: "json" }`).
5. **Active Drift Detection**: Run `npm run pricing:validate` in CI to detect
   discrepancies between the manifest and official Google pricing.

### �� Core V3 Evolution (Session #6)

- **Declarative Pricing Engine**: Refactored `pricing.ts` to use a structured
  JSON manifest.
- **Build Resilience**: Optimized `ai-sdk` build pipeline and entry points for
  clean consumer imports.
- **Pricing Validator**: Implemented sanity bounds and freshness checks for
  model rates.
- **CI Synchronization**: Created script to fetch official Gemini pricing and
  detect drift.
- **Startup Transparency**: Added micro-cent precise model pricing to gateway
  startup logs.

### Convergence Protocol 37: CI Security Gate Auto-Triage (2026-02-28)

When the CI security gate (`security-gate.yml`) fails, Antigravity MUST
automatically invoke the appropriate specialist agent to diagnose and fix:

**Trigger:** Any security gate failure in CI (detected via `gh run view` or user
report).

**Procedure (TVC — Test, Verify, Confirm):**

1. **TEST** — Pull the failed run logs:
   ```bash
   gh run view <run-id> --repo aigraphix/health-erecords-app --log-failed
   ```
2. **VERIFY** — Identify the failing agent and route to specialist:

   | Failing Agent      | Route To         | Action                                     |
   | ------------------ | ---------------- | ------------------------------------------ |
   | `rls_policy_probe` | `security` agent | Query `pg_policies`, check seed.ts logic   |
   | `secrets_scan`     | `security` agent | Review gitleaks findings, update allowlist |
   | `deps_audit`       | `devops` agent   | Check npm audit, update or allowlist CVEs  |
   | `sast_scan`        | `coder` agent    | Review semgrep findings, fix code          |
   | `config_audit`     | `security` agent | Check for leaked keys or debug flags       |
   | `jwt_abuse_tests`  | `security` agent | Review auth boundary violations            |

3. **CONFIRM** — After fix:
   - Verify the fix compiles (`npx tsc --outDir dist`)
   - Commit and push
   - Monitor the CI re-run to confirm pass
   - Report evidence to user (not just "done")

**Known RLS Gotcha — Silent PostgREST Blocking:**

Supabase PostgREST returns **0 affected rows** (not an error) when RLS blocks an
UPDATE or DELETE. This causes test seed setup to silently fail. Always:

- Match the Supabase client to the table's RLS policy (`auth.uid()` must satisfy
  the policy condition)
- Check affected row counts after every seed UPDATE
- See `docs/security/security-gate.md` → Troubleshooting for the full
  `cross_tenant_read_health_logs` fix pattern
- Key file: `packages/security-agents/src/lib/supabase/seed.ts`

### Aligned i18n Translation Structure (2026-06-03)

**Lesson:** The translation files for all locales must strictly adhere to the same schema layout to prevent runtime translation fallback issues or blank UI labels. For example, a missing `"items"` key wrapper in `locales/es/common.json` under `orchestratorCard` caused issues for the Spanish UI when looking up `t('admin.orchestratorCard.items.orchestrator.plan')`. Explicitly wrapping sections under `"items": { ... }` in all locale files ensures visual alignment across all 9 supported languages.

### Security Hardening of GitHub Actions and Supabase Edge Functions (2026-07-15)

**Lesson:**
1. **GitHub Actions Pinning**: To prevent security gate failures from mutable action tags, always pin all third-party GitHub Actions runner steps to precise, verified commit SHAs rather than mutable branch or version tags.
2. **Edge Function Token Verification**: For all user-scoped Edge Functions, verify bearer JWT token signatures via the Authorization header to derive the caller's identity. Do not rely on or trust body-supplied IDs alone to make security or permission decisions.
3. **Internal Agent Call Hardening**: For Edge Functions supporting internal agent-to-agent delegation (e.g. `x-agent-call` headers), always check and validate that the `Authorization` header carries the exact service role key (`SUPABASE_SERVICE_ROLE_KEY`) to prevent unauthorized spoofing by external attackers.

### Geolocation CORS Resolution and Platform Safety (2026-07-16)

**Lesson:**
1. **Platform Imports in React Native**: When implementing platform-conditional code (e.g. `Platform.OS === 'web'`) for handling web-specific fallback logic like window alerts or confirms, always ensure that `Platform` is explicitly imported from `react-native`.
2. **CORS and Rate Limits Proxying**: Direct browser-side geolocation fetch requests to external providers (e.g. `ipapi.co`) are subject to CORS blocking on localhost and aggressive rate limiting (429 errors). Securely proxy these lookups through a Supabase Edge Function to execute on the server-side, and cache mapped values in a database table to minimize external API dependencies.

### React Native Modal Hierarchy, Scrollbar Edge Alignment, and Badge Prefetching (2026-07-29)

**Lesson:**
1. **Nested Native Modal Hierarchy**: On iOS and Android, React Native native `<Modal>` components cannot be nested inside or alongside another presented `<Modal>` (`SettingsModal`). Sub-wizards or dialogs must use an inline `absoluteFill` overlay container inside `AppModal` so they present smoothly over active modal viewports without native UIKit/Android presentation suppression.
2. **Modal Scrollbar & Card Padding**: Moving `padding: 20` from the outer modal card `View` to `<ScrollView contentContainerStyle={{ padding: 20 }}>` and setting `scrollIndicatorInsets={{ right: 2 }}` allows the scrollbar to align cleanly along the outer card edge instead of sitting inside form inputs.
3. **Badge Mount Pre-Fetching**: Unread alert count calculation (`ensureAlerts()`) must run on initial component mount when `profileId` is ready, not only when `visible === true` (modal opens), ensuring badges are visible on page load.
4. **Prerequisite Toggle Switch UX**: When a switch toggle (e.g. Local Offline AI) requires a prerequisite (e.g. model download wizard), turn the switch **ON** immediately to acknowledge user interaction, launch the wizard, and cleanly revert the switch to **OFF** if the user cancels without completing installation.


