'use client'

import { getSiteTranslations } from '@/lib/api/translations'
import type { SiteTranslations } from '@/lib/types/translations'
import { useLanguage } from '@/contexts/LanguageContext'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface TranslationContextType {
  translations: SiteTranslations | null
  isLoading: boolean
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

export function TranslationProvider({ children }: { children: ReactNode }) {
  const { language } = useLanguage()
  const [translations, setTranslations] = useState<SiteTranslations | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTranslations = async () => {
      setIsLoading(true)
      const data = await getSiteTranslations(language)
      setTranslations(data)
      setIsLoading(false)
    }

    fetchTranslations()
  }, [language])

  return (
    <TranslationContext.Provider value={{ translations, isLoading }}>
      {isLoading ? (
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="animate-pulse">
            <div className="w-32 h-32 bg-gray-800 rounded-full" />
          </div>
        </div>
      ) : (
        children
      )}
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