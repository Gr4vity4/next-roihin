/**
 * Font configuration for locale-specific font overrides
 * Allows manual control of fonts on specific pages based on locale
 */

export type LocaleFonts = {
  th?: string
  en?: string
}

export type FontConfig = {
  default: LocaleFonts
  pages?: {
    [path: string]: LocaleFonts
  }
}

/**
 * Font configuration
 * - default: Default fonts for each locale
 * - pages: Page-specific font overrides (path without locale prefix)
 */
export const fontConfig: FontConfig = {
  // Default fonts for the entire app
  default: {
    th: 'font-mixed-lang', // Default Thai font (Prompt for Thai, Bodoni Moda for Latin)
    en: 'font-mixed-lang', // Default English font (Bodoni Moda for Latin, Prompt for Thai)
  },
  // Page-specific overrides
  pages: {
    '/personalized': {
      th: 'font-prompt', // Use Prompt font for Thai personalized page
      en: 'font-bodoni', // Use Bodoni Moda font for English personalized page
    },
    // Add more page-specific configurations as needed
    // '/products': {
    //   th: 'font-prompt',
    //   en: 'font-inter',
    // },
  },
}

/**
 * Get font class for a specific page and locale
 * @param pathname - Current pathname (without locale prefix)
 * @param locale - Current locale ('th' or 'en')
 * @returns Tailwind font class string
 */
export function getPageFont(pathname: string, locale: 'th' | 'en'): string {
  // Check if there's a page-specific configuration
  const pageConfig = fontConfig.pages?.[pathname]
  if (pageConfig && pageConfig[locale]) {
    return pageConfig[locale]
  }

  // Fall back to default configuration
  return fontConfig.default[locale] || 'font-mixed-lang'
}

/**
 * Font class names mapping for easy reference
 */
export const fontClasses = {
  inter: 'font-inter',
  bodoni: 'font-bodoni',
  prompt: 'font-prompt',
  mixed: 'font-mixed-lang',
} as const