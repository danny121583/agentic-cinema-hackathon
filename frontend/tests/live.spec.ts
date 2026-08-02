import { test, expect } from '@playwright/test';

test('live create project flow', async ({ page }) => {
  test.setTimeout(120000);
  // Go to the frontend
  await page.goto('http://localhost:3000/');

  // Verify the page loaded
  await expect(page.locator('text=SceneScout')).toBeVisible();

  // If there are existing projects, the New Project form won't be visible by default.
  // Click the "New Project" button to ensure the form is open.
  await page.click('button[title="New Project"]');

  // Fill the form
  const uniqueTitle = `Live Test Project ${Date.now()}`;
  await page.fill('input[id="title"]', uniqueTitle);
  await page.fill('textarea[id="sceneText"]', 'EXT. ALLEYWAY - NIGHT\n\nTwo characters meet in a rainy alleyway.');
  
  // Submit
  await page.click('button[type="submit"]');

  // Verify result is displayed (Backend returns Real Data from Gemini)
  // Wait for the project to be created and displayed in the WorkspaceShell header
  await expect(page.locator('h1', { hasText: uniqueTitle })).toBeVisible({ timeout: 120000 });
  
  // The status chip should show BREAKDOWN COMPLETE
  await expect(page.locator('text=BREAKDOWN COMPLETE').first()).toBeVisible();
  
  // Switch to the Breakdown tab
  await page.click('button:has-text("Breakdown")');
  
  // We can't assert exact text because the AI generates novel responses, 
  // but we can assert that the structured sections are rendered.
  await expect(page.locator('h2', { hasText: uniqueTitle })).toBeVisible();
  await expect(page.locator('text=Cast & Characters')).toBeVisible();
  await expect(page.locator('text=Props & Wardrobe')).toBeVisible();
  await expect(page.locator('h4', { hasText: 'Logistical Considerations' })).toBeVisible();
});
