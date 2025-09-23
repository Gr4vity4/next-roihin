'use client'

import { ReactNode, createContext, useContext } from 'react'
import { useLocaleFont } from '@/hooks/useLocaleFont'
import { type LocaleFonts } from '@/config/font.config'
import { cn } from '@/lib/utils'

interface FontContextValue {
  fontClass: string
}

const FontContext = createContext<FontContextValue | null>(null)

interface FontProviderProps {
  children: ReactNode
  fonts?: LocaleFonts
  className?: string
  asDiv?: boolean
}

/**
 * Provider component that applies locale-specific fonts to its children
 * Can be used at page or component level
 *
 * @example
 * ```tsx
 * // Apply specific fonts for Thai and English
 * <FontProvider fonts={{ th: 'font-prompt', en: 'font-playfair' }}>
 *   <YourComponent />
 * </FontProvider>
 *
 * // Use configuration from font.config.ts
 * <FontProvider>
 *   <YourComponent />
 * </FontProvider>
 * ```
 */
export function FontProvider({
  children,
  fonts,
  className,
  asDiv = false
}: FontProviderProps) {
  const fontClass = useLocaleFont(fonts)

  const contextValue = {
    fontClass,
  }

  // If asDiv is true, wrap children in a div with font class
  if (asDiv) {
    return (
      <FontContext.Provider value={contextValue}>
        <div className={cn(fontClass, className)}>
          {children}
        </div>
      </FontContext.Provider>
    )
  }

  // Otherwise, just provide context (children need to apply font class themselves)
  return (
    <FontContext.Provider value={contextValue}>
      {children}
    </FontContext.Provider>
  )
}

/**
 * Hook to access the current font class from FontProvider context
 * @returns Current font class or null if not within FontProvider
 */
export function useFontContext() {
  return useContext(FontContext)
}

/**
 * Higher-order component that wraps a component with FontProvider
 * Useful for applying fonts to entire page components
 *
 * @example
 * ```tsx
 * const PersonalizedPageWithFont = withFontProvider(PersonalizedPage, {
 *   fonts: { th: 'font-prompt', en: 'font-playfair' }
 * })
 * ```
 */
export function withFontProvider<P extends object>(
  Component: React.ComponentType<P>,
  options?: { fonts?: LocaleFonts; className?: string; asDiv?: boolean }
) {
  return function WrappedComponent(props: P) {
    return (
      <FontProvider {...options}>
        <Component {...props} />
      </FontProvider>
    )
  }
}