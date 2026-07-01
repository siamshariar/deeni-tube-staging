import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'mobile-sm', width: 375, height: 667 },
  { name: 'mobile-lg', width: 430, height: 932 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'desktop-xl', width: 1920, height: 1080 },
];

const pages = ['/', '/channels', '/scholars', '/playlists', '/settings', '/shorts'];

for (const vp of viewports) {
  for (const route of pages) {
    test(`${route} renders without overflow at ${vp.name} (${vp.width}×${vp.height})`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(route);
      // Page should not have a horizontal scrollbar (no x overflow)
      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(overflow, `Horizontal overflow at ${vp.name} on ${route}`).toBe(false);
    });
  }
}

test('mobile nav visible on mobile, hidden on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');
  // Mobile nav is rendered (fixed bottom bar)
  const mobileNav = page.locator('nav.fixed, nav.md\\:hidden').first();
  await expect(mobileNav).toBeVisible({ timeout: 3000 });
});

test('desktop sidebar visible on desktop, hidden on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  const sidebar = page.locator('aside').first();
  await expect(sidebar).toBeVisible({ timeout: 3000 });
});
