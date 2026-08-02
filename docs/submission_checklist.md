# Hackathon Submission Checklist

Before submitting to Devpost, ensure all of the following requirements are met:

## 1. Code Repository
- [x] **Open-Source License:** An OSI-approved license (e.g. MIT) is included at the top level of the repository.
- [x] **Public Repository:** Ensure the GitHub (or other host) repository visibility is set to Public.
- [x] **Complete Source Code:** Ensure all frontend and backend code, assets, and documentation are committed and pushed.
- [x] **Setup Instructions:** The `README.md` clearly explains how a judge can run the code locally.

## 2. Technical Integration
- [x] **Real Gemini AI:** Switch from `Mock AI` mode to real API calls. (`SCENESCOUT_USE_MOCK_AI=false`)
- [x] **Parallel API Integration:** Ensure the application makes live calls to the Parallel API and uses the returned data in the agent's workflow.
- [x] **Google Cloud Usage:** Demonstrate the agent using Google Cloud Agent Builder or the Gemini API SDK in runtime. (demonstrated by logs/output).

## 3. Hosting & Deployment
- [x] **Live URL:** Deploy the application so it is accessible via a public URL. 
  - *Recommendation:* Vercel for the frontend, Google Cloud Run for the FastAPI backend.
- [x] **End-to-End Testing on Live:** Perform a full run-through of the application on the hosted URL to ensure CORS, API keys, and database connections (e.g., Firestore) are working perfectly in production.

## 4. Media & Assets
- [ ] **Demo Video (3 Minutes):** Record a demo video showcasing the project functioning as built. Do not make a cinematic trailer; show the UI and the agent doing its job.
- [ ] **Video Hosting:** Upload the video to YouTube or Vimeo and ensure the privacy is set to Public or Unlisted (not Private).
- [ ] **English Language/Subtitles:** The video must be in English or have English subtitles.

## 5. Devpost Submission
- [ ] **Select Partner Track:** Explicitly select the **Parallel** track on the Devpost submission form.
- [ ] **Fill out Devpost Form:** Complete all required text fields on the Devpost submission page.
- [ ] **Submit Before Deadline:** Submit before September 07, 2026 @ 5:00pm EDT.
