import { test, expect } from '@playwright/test';

test('create project flow', async ({ page }) => {
  // Mock the API response to avoid hitting the real backend
  await page.route('/api/projects', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: "test-id",
        title: "Test Project",
        scene_text: "A dark alleyway.",
        status: "completed",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        breakdown: {
          project_id: "test-id",
          project_title: "Test Project",
          short_scene_summary: "Two characters meet in a rainy alleyway to exchange a mysterious package.",
          setting: "Alleyway",
          time_period: "Present Day",
          time_of_day: "Night",
          interior_or_exterior: "Exterior",
          characters: ["John", "Mysterious Stranger"],
          locations: ["City Alleyway"],
          props: ["Mysterious Package", "Umbrella"],
          wardrobe_requirements: ["Trench coat", "Dark clothing"],
          vehicles: [],
          weather_requirements: ["Heavy Rain"],
          safety_considerations: ["Wet surfaces", "Night shooting logistics"],
          logistical_considerations: ["Rain machines", "Lighting the alleyway"],
          continuity_risks: ["Rain levels on clothing"],
          unresolved_questions: ["What is inside the package?"],
          research_questions: [
            {
              question: "What permits are required for rain machines in downtown alleyways?",
              reason: "Necessary for planning the logistics of the shot."
            }
          ],
          generated_timestamp: new Date().toISOString(),
          model_metadata: "MOCK_AI",
          status: "completed"
        }
      })
    });
  });

  await page.goto('/');

  // Fill the form
  await page.fill('input[id="title"]', 'Test Project');
  await page.fill('textarea[id="sceneText"]', 'A dark alleyway.');
  
  // Submit
  await page.click('button[type="submit"]');

  // Verify result is displayed
  await expect(page.locator('h2', { hasText: 'Test Project' })).toBeVisible();
  await expect(page.locator('p', { hasText: 'Status: completed' })).toBeVisible();
  await expect(page.locator('p', { hasText: 'Two characters meet in a rainy alleyway' })).toBeVisible();
  await expect(page.locator('p', { hasText: 'What permits are required for rain machines in downtown alleyways?' })).toBeVisible();
});
