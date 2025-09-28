import { test, expect } from '@playwright/test';
import {
  LOCALES,
  PUBLIC_PAGES,
  getPageUrl,
  checkPageAccessibility,
  checkNavigationElements,
  checkImagesLoading,
  checkLanguageSwitcher,
  mobileClick,
  isMobileBrowser,
} from '../utils/test-helpers';

// Test all public pages for both locales
LOCALES.forEach((locale) => {
  test.describe(`Public Pages Accessibility - ${locale.toUpperCase()} Locale`, () => {
    test.describe.configure({ mode: 'parallel' });

    PUBLIC_PAGES.forEach((pageRoute) => {
      // Skip dynamic pages that need specific slugs for now
      if (!pageRoute.dynamic) {
        test(`${pageRoute.name} page loads successfully`, async ({ page }) => {
          const url = getPageUrl(locale, pageRoute.path);

          // Navigate to the page
          await page.goto(url);

          // Check basic accessibility
          const consoleErrors = await checkPageAccessibility(page, pageRoute.name);

          // Assert no console errors
          expect(consoleErrors, `Console errors found on ${pageRoute.name} page`).toHaveLength(0);

          // Check navigation elements
          await checkNavigationElements(page);

          // Check images are loading
          const imageCount = await checkImagesLoading(page);
          console.log(`${pageRoute.name} page has ${imageCount} images`);

          // Check language switcher exists
          const hasLangSwitcher = await checkLanguageSwitcher(page, locale);
          console.log(`${pageRoute.name} page has language switcher: ${hasLangSwitcher}`);
        });
      }
    });

    // Test dynamic pages with sample slugs
    test.skip('Blog post page loads with sample slug', async ({ page }) => {
      // Skip until we have reliable test data from WordPress
      test.skip();

      const blogRoute = PUBLIC_PAGES.find(p => p.path === '/blog/[slug]');
      if (blogRoute?.sampleSlug) {
        const url = getPageUrl(locale, blogRoute.path, blogRoute.sampleSlug);

        // Navigate to the page
        const response = await page.goto(url, { waitUntil: 'domcontentloaded' });

        // Check if page exists (might be 404 if sample slug doesn't exist)
        if (response && response.status() === 200) {
          const consoleErrors = await checkPageAccessibility(page, blogRoute.name);
          expect(consoleErrors, `Console errors found on ${blogRoute.name} page`).toHaveLength(0);
          await checkNavigationElements(page);
        } else {
          console.log(`Sample blog post not found at ${url}, skipping detailed checks`);
        }
      }
    });

    test.skip('Charm spacer product page loads with sample slug', async ({ page }) => {
      // Skip until we have reliable test data from WordPress
      test.skip();

      const productRoute = PUBLIC_PAGES.find(p => p.path === '/charmspacer/product/[slug]');
      if (productRoute?.sampleSlug) {
        const url = getPageUrl(locale, productRoute.path, productRoute.sampleSlug);

        // Navigate to the page
        const response = await page.goto(url, { waitUntil: 'domcontentloaded' });

        // Check if page exists (might be 404 if sample slug doesn't exist)
        if (response && response.status() === 200) {
          const consoleErrors = await checkPageAccessibility(page, productRoute.name);
          expect(consoleErrors, `Console errors found on ${productRoute.name} page`).toHaveLength(0);
          await checkNavigationElements(page);
        } else {
          console.log(`Sample product not found at ${url}, skipping detailed checks`);
        }
      }
    });
  });
});

// Test locale switching functionality
test.describe('Locale Switching', () => {
  test('Can switch between Thai and English locales', async ({ page, browserName }) => {
    // Start with Thai locale
    await page.goto('/th');

    // Check current locale
    expect(page.url()).toContain('/th');

    // Find and click language switcher to English
    const enLink = page.locator('a[href*="/en"]').first();
    if (await enLink.count() > 0) {
      if (isMobileBrowser(browserName)) {
        await mobileClick(page, enLink);
      } else {
        await enLink.click();
      }
      await page.waitForURL('**/en/**');
      expect(page.url()).toContain('/en');
    }

    // Switch back to Thai
    const thLink = page.locator('a[href*="/th"]').first();
    if (await thLink.count() > 0) {
      if (isMobileBrowser(browserName)) {
        await mobileClick(page, thLink);
      } else {
        await thLink.click();
      }
      await page.waitForURL('**/th/**');
      expect(page.url()).toContain('/th');
    }
  });
});

// Test page performance
test.describe('Page Performance', () => {
  test('Home page loads within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/th', { waitUntil: 'networkidle' });
    const loadTime = Date.now() - startTime;

    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
    console.log(`Home page load time: ${loadTime}ms`);
  });

  test('All navigation links are valid', async ({ page }) => {
    await page.goto('/th');

    // Get all internal links
    const links = page.locator('a[href^="/"], a[href^="http://localhost"], a[href^="https://localhost"]');
    const linkCount = await links.count();

    const brokenLinks: string[] = [];

    // Check first 10 links to avoid long test times
    const maxLinksToCheck = Math.min(linkCount, 10);

    for (let i = 0; i < maxLinksToCheck; i++) {
      const link = links.nth(i);
      const href = await link.getAttribute('href');

      if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
        try {
          // Use a HEAD request to check if link is valid
          const response = await page.request.head(href);
          if (!response.ok() && response.status() !== 304) {
            brokenLinks.push(`${href} - Status: ${response.status()}`);
          }
        } catch (error) {
          // External links might fail due to CORS
          console.log(`Could not check link: ${href}`);
        }
      }
    }

    expect(brokenLinks, `Found broken links: ${brokenLinks.join(', ')}`).toHaveLength(0);
  });
});

// Test responsive design
test.describe('Responsive Design', () => {
  const viewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1920, height: 1080 },
  ];

  viewports.forEach((viewport) => {
    test(`Home page renders correctly on ${viewport.name}`, async ({ page }) => {
      // Set viewport
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      // Navigate to home page
      await page.goto('/th');

      // Check that main content is visible
      const main = page.locator('main').or(page.locator('[role="main"]')).first();
      await expect(main).toBeVisible();

      // Check navigation is accessible (might be hamburger menu on mobile)
      const nav = page.locator('nav').or(page.locator('header')).first();
      await expect(nav).toBeVisible();

      // Take a screenshot for visual verification (stored in test-results)
      await page.screenshot({ path: `tests/screenshots/home-${viewport.name.toLowerCase()}.png` });
    });
  });
});

// Test critical user journeys
test.describe('Critical User Journeys', () => {
  test('Can navigate from home to blog', async ({ page, browserName }) => {
    // Start at home page
    await page.goto('/th');

    // Find and click blog link
    const blogLink = page.locator('a[href*="/blog"]').first();
    if (await blogLink.count() > 0) {
      if (isMobileBrowser(browserName)) {
        await mobileClick(page, blogLink);
      } else {
        await blogLink.click();
      }
      await page.waitForURL('**/blog', { timeout: 30000 });

      // Verify we're on the blog page
      expect(page.url()).toContain('/blog');

      // Check that blog content is visible
      const blogContent = page.locator('main').or(page.locator('[role="main"]')).first();
      await expect(blogContent).toBeVisible();
    }
  });

  test('Can navigate to about page', async ({ page, browserName }) => {
    // Start at home page
    await page.goto('/th');

    // Find and click about link
    const aboutLink = page.locator('a[href*="/about"]').first();
    if (await aboutLink.count() > 0) {
      if (isMobileBrowser(browserName)) {
        await mobileClick(page, aboutLink);
      } else {
        await aboutLink.click();
      }
      await page.waitForURL('**/about', { timeout: 30000 });

      // Verify we're on the about page
      expect(page.url()).toContain('/about');

      // Check that about content is visible
      const aboutContent = page.locator('main').or(page.locator('[role="main"]')).first();
      await expect(aboutContent).toBeVisible();
    }
  });
});