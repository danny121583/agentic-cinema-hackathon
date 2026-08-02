import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

const screenshotDir = '/Users/danny/Desktop/agentic-cinema-hackathon/playwright';
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

test('Research Plan checkbox functionality', async ({ page }) => {
  // 1. Navigate to home
  await page.goto('http://localhost:3000/');
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
