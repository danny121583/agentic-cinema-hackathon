import { test, expect } from '@playwright/test';

test('live create project flow', async ({ page }) => {
  // Go to the frontend
  await page.goto('http://localhost:3000/');

  // Verify the page loaded
  await expect(page.locator('h1', { hasText: 'SceneScout AI' })).toBeVisible();

  // Fill the form
  const uniqueTitle = `Live Test Project ${Date.now()}`;
  await page.fill('input[id="title"]', uniqueTitle);
  await page.fill('textarea[id="sceneText"]', 'EXT. ALLEYWAY - NIGHT\n\nTwo characters meet in a rainy alleyway.');
  
  // Submit
  await page.click('button[type="submit"]');

  // Verify result is displayed (Backend returns Mock Data by default)
  await expect(page.locator('h2', { hasText: uniqueTitle })).toBeVisible({ timeout: 10000 });
  await expect(page.locator('p', { hasText: 'Status: completed' })).toBeVisible();
  await expect(page.locator('p', { hasText: 'Two characters meet in a rainy alleyway' })).toBeVisible();
  await expect(page.locator('h4', { hasText: 'Logistical Considerations' })).toBeVisible();
});
