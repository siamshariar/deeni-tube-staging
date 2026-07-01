import { test, expect } from '@playwright/test';

test.describe('Page navigation', () => {
  test('home page loads with video cards', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Deeni\.tube/);
    // Desktop logo is in the second header (hidden md:flex); use last() since mobile logo is md:hidden
    await expect(page.locator('img[alt="Deeni.tube"]').last()).toBeVisible({ timeout: 5000 });
    // At least one video card appears
    const cards = page.locator('a[href^="/videos/"]');
    await expect(cards.first()).toBeVisible({ timeout: 5000 });
  });

  test('desktop sidebar is visible on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    // Desktop sidebar (aside) is rendered in the DOM
    const sidebar = page.locator('aside').first();
    await expect(sidebar).toBeAttached({ timeout: 5000 });
    // Toggle button exists
    const hamburger = page.locator('button[aria-label="Toggle sidebar"]');
    await expect(hamburger).toBeVisible({ timeout: 3000 });
  });

  test('channels page loads', async ({ page }) => {
    await page.goto('/channels');
    await expect(page.locator('h1').filter({ hasText: 'Channels' }).first()).toBeVisible({ timeout: 8000 });
  });

  test('scholars page loads', async ({ page }) => {
    await page.goto('/scholars');
    await expect(page.locator('h1, h2').filter({ hasText: /scholar/i }).first()).toBeVisible({ timeout: 5000 });
  });

  test('categories page loads', async ({ page }) => {
    await page.goto('/categories');
    await expect(page).toHaveURL('/categories');
    await expect(page.locator('body')).toBeVisible();
  });

  test('playlists page loads', async ({ page }) => {
    await page.goto('/playlists');
    await expect(page).toHaveURL('/playlists');
    await expect(page.locator('body')).toBeVisible();
  });

  test('settings page loads', async ({ page }) => {
    await page.goto('/settings');
    await expect(page).toHaveURL('/settings');
    await expect(page.locator('body')).toBeVisible();
  });

  test('help page loads', async ({ page }) => {
    await page.goto('/help');
    await expect(page).toHaveURL('/help');
    await expect(page.locator('body')).toBeVisible();
  });

  test('sign-in page loads', async ({ page }) => {
    await page.goto('/signin');
    await expect(page).toHaveURL('/signin');
    await expect(page.locator('body')).toBeVisible();
  });

  test('search page loads and accepts query', async ({ page }) => {
    await page.goto('/search?q=quran');
    await expect(page).toHaveURL('/search?q=quran');
    await expect(page.locator('body')).toBeVisible();
  });

  test('watch-later page loads', async ({ page }) => {
    await page.goto('/watch-later');
    await expect(page).toHaveURL('/watch-later');
    await expect(page.locator('body')).toBeVisible();
  });

  test('history page loads', async ({ page }) => {
    await page.goto('/history');
    await expect(page).toHaveURL('/history');
    await expect(page.locator('body')).toBeVisible();
  });

  test('liked-videos page loads', async ({ page }) => {
    await page.goto('/liked-videos');
    await expect(page).toHaveURL('/liked-videos');
    await expect(page.locator('body')).toBeVisible();
  });

  test('you page loads', async ({ page }) => {
    await page.goto('/you');
    await expect(page).toHaveURL('/you');
    await expect(page.locator('body')).toBeVisible();
  });
});
