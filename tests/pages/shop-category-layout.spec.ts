import { test, expect } from '@playwright/test';

const SHOP_CATEGORY_SLUGS = ['new-arrivals', 'bracelet'];
const LOCALES = ['th', 'en'];

test.describe('Shop category hero spacing', () => {
  for (const locale of LOCALES) {
    for (const slug of SHOP_CATEGORY_SLUGS) {
      test(`Hero content clears navigation on /${locale}/shop/${slug}`, async ({ page }) => {
        await page.goto(`/${locale}/shop/${slug}`, { waitUntil: 'domcontentloaded' });
        await page.waitForLoadState('networkidle');

        const nav = page.locator('nav').first();
        await expect(nav, 'navigation should be rendered').toBeVisible();
        const navHeight = await nav.evaluate((el) => el.getBoundingClientRect().height);

        const heroSection = page.locator('main section').first();
        await expect(heroSection, 'hero section should be visible').toBeVisible();
        const heroSectionTop = await heroSection.evaluate((el) => el.getBoundingClientRect().top);

        expect(
          heroSectionTop,
          `Expected hero section to start below the navigation height (${navHeight}px)`,
        ).toBeGreaterThan(navHeight + 16);
      });
    }
  }
});
