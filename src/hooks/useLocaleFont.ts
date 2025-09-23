'use client'

import { useLocale } from 'next-intl'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import { getPageFont, type LocaleFonts } from '@/config/font.config'

/**
 * Hook to get locale-specific font class for current page
 * @param customFonts - Optional custom font configuration
 * @returns Tailwind font class string
 */
export function useLocaleFont(customFonts?: LocaleFonts) {
  const locale = useLocale() as 'th' | 'en'
  const pathname = usePathname()

  const fontClass = useMemo(() => {
    // If custom fonts are provided, use them
    if (customFonts && customFonts[locale]) {
      return customFonts[locale]
    }

    // Remove locale prefix from pathname (e.g., /th/personalized -> /personalized)
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/'

    // Get font for current page and locale
    return getPageFont(pathWithoutLocale, locale)
  }, [locale, pathname, customFonts])

  return fontClass
}

/**
 * Hook to get font classes for both locales (useful for comparison or debugging)
 * @param customFonts - Optional custom font configuration
 * @returns Object with font classes for each locale
 */
export function useLocaleFonts(customFonts?: LocaleFonts) {
  const pathname = usePathname()
  const currentLocale = useLocale() as 'th' | 'en'

  const fonts = useMemo(() => {
    // Remove locale prefix from pathname
    const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '') || '/'

    return {
      th: customFonts?.th || getPageFont(pathWithoutLocale, 'th'),
      en: customFonts?.en || getPageFont(pathWithoutLocale, 'en'),
      current: customFonts?.[currentLocale] || getPageFont(pathWithoutLocale, currentLocale),
    }
  }, [pathname, currentLocale, customFonts])

  return fonts
}