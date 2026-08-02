# Iteration 02: Research Workspace

## Overview
This iteration expands SceneScout AI beyond the initial script breakdown to include a full autonomous research workspace. It implements a multi-agent workflow that takes a parsed scene, generates a research plan, executes parallel web searches, evaluates conflicting evidence, and synthesizes a final production brief.

## Core Features Implemented

### 1. Multi-Agent Research System
- **ResearchPlannerAgent**: Analyzes the script breakdown and generates a prioritized list of research questions, categorizing them by production department (Locations, Wardrobe, Props, etc.).
- **ParallelSearchClient**: Integrates with the Google Cloud `parallel-web` SDK to execute live, concurrent web searches for the generated questions.
- **EvidenceConflictAgent**: Evaluates the returned search results against the original claim/question, assessing confidence levels, identifying conflicts, and noting freshness and geographic relevance.
- **ProductionBriefAgent**: Synthesizes the script breakdown and the approved evidentiary findings into a cohesive, actionable Production Brief for the crew.

### 2. Workspace UI Redesign
- **Application Shell**: Replaced the single-page layout with a persistent sidebar-driven workspace (`WorkspaceShell.tsx`).
- **Collapsible Sidebar**: Implemented a responsive, collapsible sidebar to maximize screen real estate when reviewing detailed research.
- **Scrollable Interfaces**: Ensured long script inputs and large findings lists scroll gracefully within their container boundaries.
- **Settings Modal**: Wired up a system health and settings diagnostic modal that queries the backend API.
- **Tabbed Interface**: Separated the workflow into distinct tabs: Script, Breakdown, Research, Production Brief, and Activity.
- **Interactive Research View**: Displays the generated research plan with checkboxes for question selection, and visualizes the evidentiary findings with confidence indicators and source citations.
- **Production Brief View**: Renders the synthesized brief with executive summaries, departmental recommendations, and a consolidated source index.
- **Activity Timeline**: Added a real-time event log tracking agent actions and workflow state transitions.

### 3. API & Persistence Layer
- **New Endpoints**: Added FastAPI routes for generating plans, running research, updating finding status, generating briefs, and retrieving activity logs.
- **Schema Expansion**: Extended `models.research.py` with comprehensive Pydantic models for `ResearchPlan`, `Finding`, `ProductionBrief`, and `ActivityEvent`.
- **Workflow State**: Introduced a `workflow_state` enum to track projects through `draft` -> `breakdown_complete` -> `research_plan_ready` -> `research_running` -> `findings_under_review` -> `brief_ready`.

## Testing the Flow
To test this vertical slice:
1. Create a new project and paste a sample script (e.g., a period piece scene).
2. Wait for the Breakdown to complete.
3. Navigate to the **Research** tab and click "Generate Research Plan".
4. Review the generated questions and click "Run Selected Questions".
5. Wait for the agents to execute searches and evaluate evidence. The findings will appear below the plan.
6. Review the findings and click "Approve Finding" on the ones you accept.
7. Navigate to the **Production Brief** tab and click "Generate Production Brief".

## Next Steps
- Implement robust background task processing (e.g., Celery/Redis) instead of FastAPI `BackgroundTasks`.
- Add a manual intervention UI for rejected findings to prompt the agents for deeper research.
- Implement streaming responses for real-time UI updates during long-running agent tasks.
