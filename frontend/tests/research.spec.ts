import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

const screenshotDir = '/Users/danny/Desktop/agentic-cinema-hackathon/playwright';
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

test('Research Plan checkbox functionality', async ({ page }) => {
  await page.route('**/api/projects', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([{
        id: "mock-id",
        title: "Whitechapel Fog",
        scene_text: "A foggy street in Whitechapel.",
        workflow_state: "research_plan_ready",
        status: "completed",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        breakdown: {
          project_title: "Whitechapel Fog",
          short_scene_summary: "Summary",
          setting: "Street",
          time_period: "Victorian",
          time_of_day: "Night",
          interior_or_exterior: "Exterior",
          characters: [], locations: [], props: [], wardrobe_requirements: [], vehicles: [], weather_requirements: [], safety_considerations: [], logistical_considerations: [], continuity_risks: [], unresolved_questions: [],
          research_questions: [],
          generated_timestamp: new Date().toISOString(), model_metadata: "MOCK", status: "completed"
        }
      }])
    });
  });

  await page.route('**/api/projects/mock-id/research/plan', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        project_id: "mock-id",
        questions: [
          { id: "q1", category: "historical_accuracy", question: "Question 1", search_objective: "Objective 1" },
          { id: "q2", category: "logistics", question: "Question 2", search_objective: "Objective 2" }
        ],
        generated_timestamp: new Date().toISOString(),
        model_metadata: "MOCK"
      })
    });
  });

  await page.route('**/api/projects/mock-id/findings', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([])
    });
  });

  await page.route('**/api/projects/mock-id/research/run', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ status: "started" })
    });
  });

  // 1. Navigate to home
  await page.goto('/');
  await page.screenshot({ path: path.join(screenshotDir, '01_home.png') });

  // 2. Click on the project
  await page.click('text="Whitechapel Fog"');
  // Wait for project view to load
  await page.waitForSelector('text="Scene Summary"');
  await page.screenshot({ path: path.join(screenshotDir, '02_project_overview.png') });

  // 3. Go to Research tab
  await page.click('text="Research"');
  // Wait for plan to load
  await page.waitForSelector('text="Research Plan"');
  // Wait for checkboxes to be visible
  await page.waitForSelector('input[type="checkbox"]');
  await page.screenshot({ path: path.join(screenshotDir, '03_research_tab.png') });

  // 4. Uncheck the first checkbox
  const checkboxes = await page.$$('input[type="checkbox"]');
  if (checkboxes.length > 0) {
    await checkboxes[0].uncheck();
  }
  await page.screenshot({ path: path.join(screenshotDir, '04_first_checkbox_unchecked.png') });

  // 5. Click "Run Selected Questions"
  await page.click('text="Run Selected Questions"');
  
  // Wait a moment for generation to start
  await page.waitForTimeout(2000);
  
  await page.screenshot({ path: path.join(screenshotDir, '05_after_run.png') });
});
