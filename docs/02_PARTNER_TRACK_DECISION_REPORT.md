# Agentic Cinema: The Blockbuster Hackathon - Partner Track Decision Report

## Overview
This report analyzes the five partner tracks for the **Agentic Cinema: The Blockbuster Hackathon** and provides a definitive recommendation for the project architecture. Our findings are based on a thorough review of the official rules, Devpost resource pages, and Google Cloud documentation.

## Hackathon Goal
To code a functional, production-ready AI agent or multi-agent network—powered by Gemini and Google Cloud Agent Builder—that integrates a Partner Entity's product to solve critical bottlenecks across the entertainment and media value chain.

---

## 1. Partner Track Analysis

Based on the official resources, each track has strict runtime and technical requirements. Here is an evaluation of all five options:

### Final Ranking
1. **Parallel**
2. **ClickHouse**
3. **Grafana**
4. **IBM**
5. **Replit**

### 1. Parallel (Primary Recommendation)
- **Requirement:** Must actively use **Parallel's Search API** at runtime. Note: The rules require the *Search API* specifically (via the `parallel-web` SDK, a supported tool integration, or a qualifying grounding configuration), not merely an MCP server. Mentioning or configuring only an MCP server without confirming that it invokes the required Search API creates unnecessary compliance risk.
- **Focus:** Web infrastructure for AI agents, specifically crawling, indexing, and real-time open-web search.
- **Verdict:** **Highly versatile and lowest implementation friction.** Its Search API is generally available, SDK-friendly, inexpensive, and intended for agentic retrieval. By using a web-research agent in pre-production, Parallel becomes visible, necessary, and easy to demonstrate, allowing us to hit all four judging criteria (Implementation, Design, Impact, Idea quality) without building a contrived observability product.

### 2. ClickHouse (Backup Track)
- **Requirement:** Must actively use ClickHouse at runtime via the official **ClickHouse MCP server**, connecting to a real cluster.
- **Focus:** Real-time databases and high-volume data warehouse analytics.
- **Verdict:** Extremely powerful for ad-hoc historical analyses, but leans heavily into the operations and data analytics side rather than pre-production creative workflows.

### 3. Grafana
- **Requirement:** Must actively use the Grafana stack at runtime, primarily through the **Grafana Cloud MCP Server**.
- **Focus:** System observability, SRE, and incident response.
- **Verdict:** Exceptional for building an "Agentic Cinema Operations Platform", but does not fit our pre-production research use case. We shouldn't build an observability product merely to justify the partner integration.

### 4. IBM
- **Requirement:** Must demonstrate use of **IBM Bob** during the development process. 
- **Focus:** Enhancing workflows and driving measurable operational outcomes.
- **Verdict:** IBM offers the strongest downside prize value ($4,500 for 2nd and $3,000 for 3rd, vs. $3,000/$2,000 for other tracks). However, we should not select IBM merely for its secondary prizes when its product contribution would be less central to the demonstrated experience.

### 5. Replit
- **Requirement:** Must use **Replit Agent** during development AND deploy the final project on a `replit.app` or `replit.dev` domain.
- **Focus:** Rapid, zero-config prototyping.
- **Verdict:** The deployment constraint (must host on Replit) restricts our flexibility. We want to utilize Google Cloud ADK and Cloud Run; tying ourselves to Replit deployment limits our architectural options.

---

## 2. Refined Product Recommendation

### Working Concept: **SceneScout AI**
**An evidence-grounded pre-production research and planning agent for filmmakers.**

A filmmaker uploads an original screenplay or enters a scene brief. The system extracts the production requirements and coordinates specialized agents to create a cited, actionable pre-production package.

### Core Workflow
1. The user uploads an original script or enters a scene brief.
2. A **Script Breakdown Agent** identifies: setting, time period, characters, props, wardrobe, locations, vehicles, weather requirements, safety, or logistical needs.
3. A **Research Planner Agent** creates targeted questions based on the breakdown.
4. **Parallel Search** executes live web research.
5. An **Evidence and Conflict Agent** compares multiple sources and assigns confidence to the findings.
6. A **Production Brief Agent** converts the evidence into:
   - Historical and cultural accuracy notes
   - Location considerations
   - Production constraints
   - Prop and wardrobe guidance
   - Continuity risks
   - A scene breakdown and preliminary shot plan
7. Every research-derived claim includes a cited source and access date.
8. The user can approve, reject, or rerun individual findings.

*Note on Copyright & Intellectual Property:* The application may identify possible rights concerns and locate ownership information, but **it will not claim to determine legal clearance.** Additionally, to comply with hackathon rules, we will avoid using unverified third-party scripts or intellectual property in our public demo.

---

## 3. Recommended Architecture

The partner integration becomes indispensable here: *Without Parallel, the system can only analyze the script. With Parallel, it can transform that analysis into a current, evidence-backed production package.*

### Frontend
- Next.js, TypeScript, Tailwind CSS, shadcn/ui, React Hook Form, Zod, Lucide.
- Hosted on Vercel or Cloud Run.

### Agent Backend
- Python, Google ADK, Gemini through Vertex AI.
- Agent Platform / Agent Engine runtime where practical, with FastAPI gateway only when needed for frontend communication.
- Cloud Run as the safe deployment fallback.
- **Models:** *Latest stable, hackathon-eligible Gemini model available through Vertex AI, pinned to an explicit supported model ID after account provisioning.*

### Partner Integration
- **Official Parallel Python SDK** imported and called directly in a dedicated tool module (`agents/tools/parallel_search.py`).
- Each call will log: Query, Search mode, Timestamp, Returned sources, Excerpts, Request duration, Success/failure, and the requesting agent to provide visible proof of the integration.

### Storage & Telemetry
- **Firestore** for projects, scene analyses, research results, and approval state.
- **Cloud Storage** for uploaded scripts and generated exports.
- We will rely on Google Cloud's native tracing, logging, and monitoring rather than introducing unnecessary external dependencies like ClickHouse.

### Optional Media Feature
Generate **one storyboard frame or mood-board image** for the selected scene after the research brief is complete (using the latest stable Google image-generation model available on Vertex AI). This is visually useful but remains optional and outside the critical workflow. We will *not* include soundtrack (Lyria 3) or voiceover generation in the first release to limit scope and avoid preview-model risks.

---

## 4. Hackathon Submission & Compliance Risks

The final repository must meet strict criteria. To pass automated screening and human judging, we must ensure:
- The repository is **public** with an **OSI-approved license**.
- It contains all source code, assets, and setup instructions.
- It was newly created during the contest period.
- Visible imports, configuration, execution paths, and tests clearly demonstrate runtime calls to Google Cloud and Parallel.
- The hosted application functions exactly as shown.

### Three-Minute Demonstration Outline

1. **0:00–0:20 (Problem):** Show a filmmaker with an original scene set in a specific historical period or unfamiliar location. Explain that researching accuracy and translating findings into production decisions takes hours.
2. **0:20–0:40 (Input):** Upload the original script and select one scene.
3. **0:40–1:05 (Agent Plan):** Show the script agent extracting era, setting, props, costume requirements, location needs, and formulating research questions.
4. **1:05–1:35 (Parallel Execution):** Display live Parallel Search calls and returned evidence. This must visually highlight search queries, sources, excerpts, confidence scores, and conflicting information.
5. **1:35–2:15 (Multi-Agent Result):** Show the evidence agent resolving contradictions and the production agent creating accuracy recommendations, location guidance, prop/wardrobe notes, continuity warnings, and shot suggestions.
6. **2:15–2:40 (Human Control):** Approve one recommendation, reject another, and rerun one research question.
7. **2:40–3:00 (Technical Proof & Impact):** Briefly show Gemini/ADK orchestration, Parallel SDK runtime calls, Google Cloud deployment, and the exported cited production brief. Close with the time saved for small production teams.

---

## Final Decision Summary
- **Primary track:** Parallel
- **Backup track:** ClickHouse
- **Product:** SceneScout AI—an evidence-grounded pre-production research and planning agent
- **Confidence:** High
- **Primary risk:** Building too much instead of making the research-to-production workflow exceptional. 
