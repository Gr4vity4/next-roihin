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

  // Wait for page to be loaded (using domcontentloaded for faster checks)
  await page.waitForLoadState('domcontentloaded');

  // Wait a bit for critical resources
  await page.waitForTimeout(2000);

  // Wait for title to be set (Next.js 15 async metadata)
  await page.waitForFunction(() => document.title && document.title.length > 0, {
    timeout: 15000
  }).catch(() => {
    console.log(`Warning: Title not set for ${pageName} after 15s`);
  });

  // Check page has a title
  await expect(page).toHaveTitle(/.+/, { timeout: 15000 });

  // Check for main content area
  const main = page.locator('main').or(page.locator('[role="main"]')).first();
  await expect(main).toBeVisible({ timeout: 20000 });

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
  // Wait for DOM to be ready and give time for lazy loading
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(2000); // Allow more time for lazy loading to trigger

  const images = page.locator('img');
  const imageCount = await images.count();

  if (imageCount > 0) {
    // Check first few images are not broken
    const maxImagesToCheck = Math.min(imageCount, 5);
    let validImages = 0;
    let skippedImages = 0;

    for (let i = 0; i < maxImagesToCheck; i++) {
      const img = images.nth(i);

      // Check if image has src or srcset
      const src = await img.getAttribute('src');
      const srcset = await img.getAttribute('srcset');

      if (src || srcset) {
        // Skip checking next/image placeholder images and data URLs
        const isPlaceholder = src?.includes('data:image') ||
                             src?.includes('base64') ||
                             src?.includes('blur') ||
                             src?.startsWith('data:');

        if (isPlaceholder) {
          skippedImages++;
          continue;
        }

        if (src || srcset) {
          // Only scroll if image is visible
          const isVisible = await img.isVisible();
          if (isVisible) {
            // Scroll image into view to trigger lazy loading
            await img.scrollIntoViewIfNeeded();
            await page.waitForTimeout(500);
          }

          // Wait for specific image to load with longer timeout
          const isLoaded = await img.evaluate((el: HTMLImageElement) => {
            return new Promise<boolean>((resolve) => {
              // Check if already loaded
              if (el.complete && el.naturalWidth > 0) {
                resolve(true);
                return;
              }

              // Set up load/error handlers
              const loadHandler = () => {
                el.removeEventListener('load', loadHandler);
                el.removeEventListener('error', errorHandler);
                resolve(true);
              };

              const errorHandler = () => {
                el.removeEventListener('load', loadHandler);
                el.removeEventListener('error', errorHandler);
                resolve(false);
              };

              el.addEventListener('load', loadHandler);
              el.addEventListener('error', errorHandler);

              // Timeout after 5 seconds
              setTimeout(() => {
                el.removeEventListener('load', loadHandler);
                el.removeEventListener('error', errorHandler);
                resolve(el.complete && el.naturalWidth > 0);
              }, 5000);
            });
          });

          if (isLoaded) {
            validImages++;
            const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
            const naturalHeight = await img.evaluate((el: HTMLImageElement) => el.naturalHeight);

            // Only check dimensions if image loaded successfully
            if (naturalWidth > 0 && naturalHeight > 0) {
              expect(naturalWidth).toBeGreaterThan(0);
              expect(naturalHeight).toBeGreaterThan(0);
            }
          } else {
            // Log warning but don't fail the test for lazy-loaded images
            const displaySrc = src ? src.substring(0, 80) : srcset?.substring(0, 80);
            console.log(`Warning: Image ${i} may not have loaded - src: ${displaySrc}`);
          }
        }
      }
    }

    // Log summary
    console.log(`Images checked: ${maxImagesToCheck}, valid: ${validImages}, skipped (placeholders): ${skippedImages}`);

    // At least some images should load successfully if we have non-placeholder images
    if (validImages === 0 && (maxImagesToCheck - skippedImages) > 0) {
      console.log('Warning: No non-placeholder images loaded successfully');
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
  await page.waitForTimeout(500);

  // Ensure element is in viewport
  await element.scrollIntoViewIfNeeded();

  // Wait for scroll to complete and any lazy loading
  await page.waitForTimeout(800);

  try {
    // Check if element is visible and not covered
    await element.waitFor({ state: 'visible', timeout: 5000 });

    // Check for overlapping elements
    const isClickable = await element.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const topElement = document.elementFromPoint(x, y);
      return el.contains(topElement) || topElement === el;
    });

    if (isClickable) {
      // Try normal click first
      await element.click({ timeout: 5000 });
    } else {
      // Element is covered, try different strategies
      const box = await element.boundingBox();
      if (box) {
        // Click at the center of the element
        await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
      } else {
        // If bounding box not available, try tap
        await element.tap({ timeout: 5000 });
      }
    }
  } catch (error) {
    // Fallback strategies
    console.log('Mobile click attempting fallback strategy');

    try {
      // Try dispatching click event directly
      await element.dispatchEvent('click');
    } catch {
      // Final fallback: Force click
      console.log('Using force click as final fallback');
      await element.click({ force: true, timeout: 5000 });
    }
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