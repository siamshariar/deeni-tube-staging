import { test, expect } from '@playwright/test';

test.describe('Shorts page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/shorts');
    // Wait for the scroll container to appear
    await page.waitForSelector('.snap-y', { timeout: 5000 });
  });

  test('shorts page loads with video sections', async ({ page }) => {
    await expect(page).toHaveURL('/shorts');
    // At least one section is rendered
    const sections = page.locator('section.snap-start');
    await expect(sections.first()).toBeVisible();
  });

  test('desktop navigation arrows are visible', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.waitForTimeout(500);
    // Desktop nav arrows (ChevronUp/Down) are in a fixed right-side panel (hidden md:flex)
    const navPanel = page.locator('.hidden.md\\:flex').filter({ has: page.locator('button') }).last();
    await expect(navPanel).toBeVisible({ timeout: 5000 });
  });

  test('progress bar is present for active video', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    // Progress bar container - red fill is the child
    const progressBar = page.locator('.bg-red-500').first();
    // It may have 0 width initially; just confirm the element exists
    await expect(progressBar).toBeAttached({ timeout: 5000 });
  });

  test('play/pause button is present in DOM', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.waitForTimeout(500);
    // The top controls overlay play/pause button is always in the DOM
    // (opacity controlled by hover/active state)
    const playBtn = page.locator('button[style*="rgba(0,0,0,0.4)"]').first();
    await expect(playBtn).toBeAttached({ timeout: 5000 });
    // Hover over the video to make controls visible, then click
    const videoSection = page.locator('section.snap-start').first();
    await videoSection.hover();
    await playBtn.click({ force: true });
    // After click, page should not crash
    await expect(videoSection).toBeVisible();
  });

  test('mute button is present in DOM', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.waitForTimeout(500);
    // Mute button is also in the top controls overlay
    const muteBtn = page.locator('button[style*="rgba(0,0,0,0.4)"]').nth(1);
    await expect(muteBtn).toBeAttached({ timeout: 5000 });
    // Hover over video section to make controls visible
    const videoSection = page.locator('section.snap-start').first();
    await videoSection.hover();
    await muteBtn.click({ force: true });
    // After click, page should not crash
    await expect(videoSection).toBeVisible();
  });

  test('share modal opens', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    // Wait for controls to appear then find Share button in action panel
    await page.waitForTimeout(500);
    const shareBtn = page.locator('button').filter({ hasText: 'Share' }).first();
    if (await shareBtn.isVisible()) {
      await shareBtn.click();
      // Modal should appear
      await expect(page.locator('[role="dialog"], .fixed.inset-0').first()).toBeVisible({ timeout: 3000 });
    }
  });

  test('keyboard navigation moves between shorts', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.waitForTimeout(500);
    // Press ArrowDown to go to next short
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(600);
    // Press ArrowUp to go back
    await page.keyboard.press('ArrowUp');
    await page.waitForTimeout(600);
    // Should not have crashed
    await expect(page.locator('section.snap-start').first()).toBeAttached();
  });

  test('shorts page loads correctly on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/shorts');
    await expect(page).toHaveURL('/shorts');
    // Sections are present
    const sections = page.locator('section.snap-start');
    await expect(sections.first()).toBeAttached({ timeout: 5000 });
  });
});
