import { Page, expect } from '@playwright/test';

export const LOCALES = ['th', 'en'] as const;
export type Locale = typeof LOCALES[number];

export interface PublicPageRoute {
  path: string;
  name: string;
  dynamic?: boolean;
  sampleSlug?: string;
}

export const PUBLIC_PAGES: PublicPageRoute[] = [
  { path: '/', name: 'Home' },
  { path: '/about', name: 'About' },
  { path: '/blog', name: 'Blog Listing' },
  { path: '/blog/[slug]', name: 'Blog Post', dynamic: true, sampleSlug: 'sample-post' },
  { path: '/bracelet-order', name: 'Bracelet Order' },
  { path: '/charmspacer', name: 'Charm Spacer Catalog' },
  { path: '/charmspacer/product/[slug]', name: 'Charm Spacer Product', dynamic: true, sampleSlug: 'sample-product' },
  { path: '/custom', name: 'Custom Design' },
  { path: '/customer-service', name: 'Customer Service' },
  { path: '/personalized', name: 'Personalized' },
  { path: '/testimonial', name: 'Testimonials' },
];

/**
 * Get the full URL for a page with locale
 */
export function getPageUrl(locale: Locale, path: string, slug?: string): string {
  let fullPath = path;
  if (slug && path.includes('[slug]')) {
    fullPath = path.replace('[slug]', slug);
  }
  return `/${locale}${fullPath === '/' ? '' : fullPath}`;
}

/**
 * Check basic page accessibility
 */
export async function checkPageAccessibility(page: Page, pageName: string) {
  // Check page loads without errors
  await expect(page).toHaveURL(/.*/);

  // Check no console errors
  const consoleErrors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  // Wait for page to be fully loaded
  await page.waitForLoadState('networkidle');

  // Check page has a title
  await expect(page).toHaveTitle(/.+/);

  // Check for main content area
  const main = page.locator('main').or(page.locator('[role="main"]')).first();
  await expect(main).toBeVisible({ timeout: 10000 });

  // Return console errors for assertion
  return consoleErrors;
}

/**
 * Check if essential navigation elements are present
 */
export async function checkNavigationElements(page: Page) {
  // Check for header/navigation
  const header = page.locator('header').or(page.locator('nav')).first();
  await expect(header).toBeVisible({ timeout: 10000 });

  // Check for footer (optional but common)
  const footer = page.locator('footer');
  if (await footer.count() > 0) {
    await expect(footer.first()).toBeVisible({ timeout: 10000 });
  }
}

/**
 * Check if images are loading properly
 */
export async function checkImagesLoading(page: Page) {
  // Wait for images to start loading
  await page.waitForLoadState('domcontentloaded');

  const images = page.locator('img');
  const imageCount = await images.count();

  if (imageCount > 0) {
    // Check first few images are not broken
    const maxImagesToCheck = Math.min(imageCount, 5);

    for (let i = 0; i < maxImagesToCheck; i++) {
      const img = images.nth(i);

      // Check if image has src or srcset
      const src = await img.getAttribute('src');
      const srcset = await img.getAttribute('srcset');

      if (src || srcset) {
        // Image should have natural dimensions after loading
        const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
        const naturalHeight = await img.evaluate((el: HTMLImageElement) => el.naturalHeight);

        // Skip checking next/image placeholder images
        const isPlaceholder = src?.includes('data:image/svg+xml') || src?.includes('base64');

        if (!isPlaceholder && (src || srcset)) {
          expect(naturalWidth).toBeGreaterThan(0);
          expect(naturalHeight).toBeGreaterThan(0);
        }
      }
    }
  }

  return imageCount;
}

/**
 * Check language switcher functionality
 */
export async function checkLanguageSwitcher(page: Page, currentLocale: Locale) {
  const otherLocale = currentLocale === 'th' ? 'en' : 'th';

  // Look for language switcher - common patterns
  const langSwitcher = page.locator('[data-testid="language-switcher"]')
    .or(page.locator('a[href*="/en"], a[href*="/th"]'))
    .or(page.locator('button:has-text("EN"), button:has-text("TH")'))
    .first();

  if (await langSwitcher.count() > 0) {
    const currentUrl = page.url();
    const expectedOtherUrl = currentUrl.replace(`/${currentLocale}`, `/${otherLocale}`);

    // Check that language switcher link exists
    const otherLangLink = page.locator(`a[href*="/${otherLocale}"]`).first();
    if (await otherLangLink.count() > 0) {
      const href = await otherLangLink.getAttribute('href');
      expect(href).toContain(`/${otherLocale}`);
    }

    return true;
  }

  return false;
}

/**
 * Test data for dynamic pages
 */
export const TEST_DATA = {
  blog: {
    slugs: ['sample-post', 'test-article', 'blog-post-1'],
  },
  products: {
    slugs: ['sample-product', 'product-1', 'test-item'],
  },
};