'use client'

import { getSiteTranslations } from '@/lib/api/translations'
import type { SiteTranslations } from '@/lib/types/translations'
import { useLocale } from 'next-intl'
import { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react'

interface TranslationContextType {
  translations: SiteTranslations | null
  isLoading: boolean
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

// Cache for translations to avoid refetching
const translationsCache = new Map<string, SiteTranslations>()

export function TranslationProvider({ children }: { children: ReactNode }) {
  const locale = useLocale() as 'en' | 'th'
  const [translations, setTranslations] = useState<SiteTranslations | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const isInitialMount = useRef(true)

  useEffect(() => {
    const fetchTranslations = async () => {
      // Check if we have cached translations for this language
      const cached = translationsCache.get(locale)
      if (cached) {
        setTranslations(cached)
        setIsLoading(false)
        return
      }

      // Only show loading on initial mount, not on language switches
      if (isInitialMount.current) {
        setIsLoading(true)
      }

      try {
        const data = await getSiteTranslations(locale)
        if (data) {
          translationsCache.set(locale, data)
          setTranslations(data)
        }
      } catch (error) {
        console.error('Failed to fetch translations:', error)
      } finally {
        setIsLoading(false)
        isInitialMount.current = false
      }
    }

    fetchTranslations()
  }, [locale])

  return (
    <TranslationContext.Provider value={{ translations, isLoading }}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslations() {
  const context = useContext(TranslationContext)
  if (!context) {
    throw new Error('useTranslations must be used within a TranslationProvider')
  }
  return context
}