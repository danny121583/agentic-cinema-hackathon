# Mock Testing and UI Audit Report

## 1. Typography and Font Unification
During the UI audit, it was discovered that the application was rendering a mix of serif and sans-serif fonts ("lots of different fonts everywhere") due to a CSS circular reference bug in `globals.css`:
```css
--font-sans: var(--font-sans);
```
This caused the browser to fail parsing the sans-serif font variable and fall back to the default serif font (usually Times New Roman) across many components, including Card Titles and headers.

**Fix Applied:**
- Corrected the variable to map to the loaded Google font: `--font-sans: var(--font-geist-sans);`
- This single fix unified the typography across all cards in all tabs (`Overview`, `Script`, `Breakdown`, `Research`, `Brief`, `Activity`), ensuring a cohesive, modern sans-serif look for the entire application.

## 2. Redundant Menu Icons
When the sidebar was collapsed, two hamburger menu icons were appearing side-by-side on desktop views: one inside the collapsed sidebar (`w-16`), and another one in the main content header.

**Fix Applied:**
- Removed the redundant `<Menu />` button from the main header in `WorkspaceShell.tsx`. The sidebar handles its own expansion state, providing a much cleaner top navigation bar.

## 3. End-to-End Mock AI Testing
To allow for end-to-end testing without consuming live API credits, the application was configured to use Mock AI.

**Fixes Applied to Mock Workflow:**
- Updated `backend/.env` to set `SCENESCOUT_USE_MOCK_AI=true`.
- Fixed a bug in `backend/app/tools/parallel_search.py` where the code was checking an undefined variable `settings.use_mock_ai` instead of the correct `settings.scenescout_use_mock_ai`. This bug would have caused the Research step to crash in mock mode.

**E2E Test Execution:**
A Playwright end-to-end test script (`tests/e2e_mock_workflow.spec.ts`) was executed, walking through the entire pipeline:
1. Creating a new project with a mock script.
2. Generating a mock Script Breakdown.
3. Generating a mock Research Plan.
4. Running the selected questions (which now correctly returns mocked parallel search results).
5. Approving a finding.
6. Generating the final Production Brief.

The entire Mock AI pipeline executed successfully, and screenshots of every step have been saved to the `/playwright/` folder in the project root.

## 4. UI State & Polling Fixes (Research Tab)
During automated E2E testing, two critical UI bugs were identified and fixed in `ResearchView.tsx` which caused the UI to get "stuck" and seemingly do nothing after user actions:

**Bug 1: Plan Generation State Staleness**
- **Issue:** Clicking "Generate Research Plan" successfully called the backend, but `loadData()` was relying on an outdated `project.workflow_state` passed from the parent component, causing it to incorrectly skip fetching the newly generated plan.
- **Fix Applied:** Modified `handleGeneratePlan` to capture the plan directly from the API response and set it in state (`setPlan(p)`). Also updated the `useEffect` dependency array to include `project.workflow_state` so the component correctly re-fetches when the parent state updates.

**Bug 2: Missing Polling for Background Research**
- **Issue:** After selecting questions and clicking "Run Selected Questions", the backend correctly started a background task (`research_running`), but the frontend had no polling mechanism to periodically check for incoming `Evidentiary Findings`. The user had to manually refresh the page.
- **Fix Applied:** Implemented a new `setInterval` polling mechanism inside `ResearchView.tsx` that polls the backend every 2 seconds **only** while `project.workflow_state === 'research_running'`. This allows the UI to automatically populate the findings as the agents complete their research in the background, matching the intended autonomous experience.
