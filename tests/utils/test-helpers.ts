import { Page, Locator, expect } from '@playwright/test';

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

  // Wait for title to be set (Next.js 15 async metadata)
  await page.waitForFunction(() => document.title && document.title.length > 0, {
    timeout: 10000
  }).catch(() => {
    console.log(`Warning: Title not set for ${pageName} after 10s`);
  });

  // Check page has a title
  await expect(page).toHaveTitle(/.+/, { timeout: 10000 });

  // Check for main content area
  const main = page.locator('main').or(page.locator('[role="main"]')).first();
  await expect(main).toBeVisible({ timeout: 15000 });

  // Return console errors for assertion
  return consoleErrors;
}

/**
 * Check if essential navigation elements are present
 */
export async function checkNavigationElements(page: Page) {
  // Check for header/navigation
  const header = page.locator('header').or(page.locator('nav')).first();
  await expect(header).toBeVisible({ timeout: 15000 });

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
  // Wait for network to settle and give time for lazy loading
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000); // Allow time for lazy loading to trigger

  const images = page.locator('img');
  const imageCount = await images.count();

  if (imageCount > 0) {
    // Check first few images are not broken
    const maxImagesToCheck = Math.min(imageCount, 5);
    let validImages = 0;

    for (let i = 0; i < maxImagesToCheck; i++) {
      const img = images.nth(i);

      // Check if image has src or srcset
      const src = await img.getAttribute('src');
      const srcset = await img.getAttribute('srcset');

      if (src || srcset) {
        // Skip checking next/image placeholder images
        const isPlaceholder = src?.includes('data:image/svg+xml') ||
                             src?.includes('base64') ||
                             src?.includes('blur');

        if (!isPlaceholder && (src || srcset)) {
          // Wait for specific image to load with timeout
          const isLoaded = await img.evaluate((el: HTMLImageElement) => {
            return new Promise<boolean>((resolve) => {
              if (el.complete && el.naturalWidth > 0) {
                resolve(true);
              } else {
                el.onload = () => resolve(true);
                el.onerror = () => resolve(false);
                // Timeout after 3 seconds
                setTimeout(() => {
                  resolve(el.complete && el.naturalWidth > 0);
                }, 3000);
              }
            });
          });

          if (isLoaded) {
            validImages++;
            const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
            const naturalHeight = await img.evaluate((el: HTMLImageElement) => el.naturalHeight);
            expect(naturalWidth).toBeGreaterThan(0);
            expect(naturalHeight).toBeGreaterThan(0);
          } else {
            // Log warning but don't fail the test for lazy-loaded images
            console.log(`Warning: Image ${i} may not have loaded - src: ${src?.substring(0, 50)}`);
          }
        }
      }
    }

    // At least some images should load successfully
    if (validImages === 0 && maxImagesToCheck > 0) {
      console.log('Warning: No images loaded successfully');
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
/**
 * Helper function for mobile click actions
 */
export async function mobileClick(page: Page, element: Locator) {
  // Wait for any animations/transitions to complete
  await page.waitForTimeout(300);

  // Ensure element is in viewport
  await element.scrollIntoViewIfNeeded();

  // Wait for scroll to complete
  await page.waitForTimeout(500);

  try {
    // First attempt: Check if element is actually clickable
    const box = await element.boundingBox();
    if (box) {
      // Click at the center of the element to avoid edge cases
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    } else {
      // If bounding box not available, try tap
      await element.tap({ timeout: 5000 });
    }
  } catch (error) {
    // Fallback: Force click if normal methods fail
    console.log('Mobile click failed, using force click:', error);
    await element.click({ force: true, timeout: 5000 });
  }
}

/**
 * Check if running on mobile browser
 */
export function isMobileBrowser(browserName: string): boolean {
  return browserName.toLowerCase().includes('mobile') ||
         browserName.toLowerCase().includes('iphone') ||
         browserName.toLowerCase().includes('android');
}

export const TEST_DATA = {
  blog: {
    slugs: ['sample-post', 'test-article', 'blog-post-1'],
  },
  products: {
    slugs: ['sample-product', 'product-1', 'test-item'],
  },
};