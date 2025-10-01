import { test, expect } from '@playwright/test';

test.describe('Smoke Tests - Core Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Set a reasonable timeout for each test
    test.setTimeout(30000);
  });

  test('Home page loads successfully in Thai', async ({ page }) => {
    const response = await page.goto('/th', { waitUntil: 'domcontentloaded' });

    // Check response status
    expect(response?.status()).toBe(200);

    // Check page has title
    await expect(page).toHaveTitle(/.+/);

    // Check main content exists
    const hasMain = await page.locator('main').or(page.locator('[role="main"]')).count();
    expect(hasMain).toBeGreaterThan(0);
  });

  test('Home page loads successfully in English', async ({ page }) => {
    const response = await page.goto('/en', { waitUntil: 'domcontentloaded' });

    // Check response status
    expect(response?.status()).toBe(200);

    // Check page has title
    await expect(page).toHaveTitle(/.+/);

    // Check main content exists
    const hasMain = await page.locator('main').or(page.locator('[role="main"]')).count();
    expect(hasMain).toBeGreaterThan(0);
  });

  test('Can navigate between Thai and English', async ({ page }) => {
    // Start with Thai
    await page.goto('/th', { waitUntil: 'domcontentloaded' });
    expect(page.url()).toContain('/th');

    // Try to find English link
    const enLinks = page.locator('a[href*="/en"]');
    const enLinkCount = await enLinks.count();

    if (enLinkCount > 0) {
      // Click first English link
      await enLinks.first().click();
      await page.waitForLoadState('domcontentloaded');

      // Should now be on English version
      expect(page.url()).toContain('/en');
    }
  });

  test('Critical pages are accessible', async ({ page }) => {
    const criticalPages = [
      { path: '/th', name: 'Home (TH)' },
      { path: '/en', name: 'Home (EN)' },
      { path: '/th/about', name: 'About (TH)' },
      { path: '/th/blog', name: 'Blog (TH)' },
      { path: '/th/customer-service', name: 'Customer Service (TH)' },
    ];

    for (const pageInfo of criticalPages) {
      const response = await page.goto(pageInfo.path, {
        waitUntil: 'domcontentloaded',
        timeout: 15000
      });

      expect(response?.status(), `${pageInfo.name} should return 200`).toBe(200);
      console.log(`✓ ${pageInfo.name} - Status: ${response?.status()}`);
    }
  });

  test('No critical JavaScript errors on home page', async ({ page }) => {
    const errors: string[] = [];

    // Listen for console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/th', { waitUntil: 'networkidle' });

    // Wait a bit for any delayed errors
    await page.waitForTimeout(2000);

    // Filter out common non-critical errors
    const criticalErrors = errors.filter(error => {
      const nonCritical = [
        'favicon',
        'manifest',
        'Failed to load resource',
        'net::ERR_',
      ];
      return !nonCritical.some(pattern => error.includes(pattern));
    });

    expect(criticalErrors, `Found critical JS errors: ${criticalErrors.join(', ')}`).toHaveLength(0);
  });

  test('Navigation menu exists and is visible', async ({ page }) => {
    await page.goto('/th', { waitUntil: 'domcontentloaded' });

    // Check for navigation element
    const nav = page.locator('nav, header').first();
    await expect(nav).toBeVisible({ timeout: 10000 });

    // Check for some navigation links
    const navLinks = nav.locator('a');
    const linkCount = await navLinks.count();

    expect(linkCount, 'Navigation should have links').toBeGreaterThan(0);
    console.log(`Found ${linkCount} navigation links`);
  });

  test('Page renders on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/th', { waitUntil: 'domcontentloaded' });

    // Check main content is still visible
    const main = page.locator('main').or(page.locator('[role="main"]')).first();
    await expect(main).toBeVisible({ timeout: 10000 });

    // Check navigation (might be hamburger menu)
    const nav = page.locator('nav, header').first();
    await expect(nav).toBeVisible({ timeout: 10000 });
  });

  test('Footer exists and contains links', async ({ page }) => {
    await page.goto('/th', { waitUntil: 'networkidle' });

    // Scroll to bottom to ensure footer loads
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Check for footer
    const footer = page.locator('footer');
    const footerCount = await footer.count();

    if (footerCount > 0) {
      await expect(footer.first()).toBeVisible({ timeout: 10000 });

      // Check footer has links
      const footerLinks = footer.locator('a');
      const linkCount = await footerLinks.count();

      console.log(`Footer contains ${linkCount} links`);
      expect(linkCount).toBeGreaterThan(0);
    } else {
      console.log('No footer found on page');
    }
  });
});