import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

const screenshotDir = '/Users/danny/Desktop/agentic-cinema-hackathon/playwright';
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

test('End-to-End Mock AI Workflow', async ({ page }) => {
  test.setTimeout(120000); // 120 seconds timeout

  // 1. Home / Create Project
  await page.goto('http://localhost:3000/');
  await page.screenshot({ path: path.join(screenshotDir, 'e2e_01_home.png') });
  
  await page.click('button[title="New Project"]');
  await page.waitForSelector('text=New Script Breakdown');
  await page.fill('input[id="title"]', 'E2E Mock Project');
  await page.fill('textarea[id="sceneText"]', 'This is a mock scene text for end-to-end testing.');
  await page.click('button:has-text("Analyze Scene")');
  
  // Wait for processing to finish and overview to load
  await expect(page.locator('text=BREAKDOWN COMPLETE').first()).toBeVisible({ timeout: 30000 });
  await page.screenshot({ path: path.join(screenshotDir, 'e2e_02_overview.png') });

  // 2. Generate Research Plan
  await page.click('button:has-text("Research")');
  
  // Empty state asking to generate plan
  await page.click('button:has-text("Generate Research Plan")');
  
  // Wait for plan to generate
  await expect(page.locator('button:has-text("Run Selected Questions")')).toBeVisible({ timeout: 30000 });
  await page.screenshot({ path: path.join(screenshotDir, 'e2e_03_research_plan.png') });

  // 3. Run Selected Questions
  await page.click('button:has-text("Run Selected Questions")');
  // Wait for findings to appear
  await expect(page.locator('text=Evidentiary Findings').first()).toBeVisible({ timeout: 30000 });
  await page.screenshot({ path: path.join(screenshotDir, 'e2e_04_findings.png') });

  // 4. Approve a finding
  const approveBtn = page.locator('button:has-text("Approve")').first();
  if (await approveBtn.isVisible()) {
    await approveBtn.click();
    await page.waitForTimeout(1000); // Wait for UI update
  }
  await page.screenshot({ path: path.join(screenshotDir, 'e2e_05_approved_finding.png') });

  // 5. Generate Production Brief
  await page.click('button:has-text("Production Brief")');
  
  const generateBriefBtn = page.locator('button:has-text("Generate Production Brief")');
  if (await generateBriefBtn.isVisible()) {
    await generateBriefBtn.click();
  }

  // Wait for brief to generate
  await expect(page.locator('text=Executive Summary')).toBeVisible({ timeout: 30000 });
  await page.screenshot({ path: path.join(screenshotDir, 'e2e_06_production_brief.png') });
});
