'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'en' | 'th'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  getApiUrl: (path: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const LANGUAGE_KEY = 'site-language'
const DEFAULT_LANGUAGE: Language = 'en'

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Load language from localStorage when client-side
    const savedLanguage = localStorage.getItem(LANGUAGE_KEY) as Language | null
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'th')) {
      setLanguageState(savedLanguage)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANGUAGE_KEY, lang)
    }
  }

  const getApiUrl = (path: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://wp-roihin.precisiondevlab.com'
    const langPrefix = language === 'th' ? '/th' : ''
    return `${baseUrl}${langPrefix}${path}`
  }

  if (!isClient) {
    // During SSR, return default values
    return (
      <LanguageContext.Provider
        value={{
          language: DEFAULT_LANGUAGE,
          setLanguage: () => {},
          getApiUrl: (path) => {
            const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://wp-roihin.precisiondevlab.com'
            return `${baseUrl}${path}`
          },
        }}
      >
        {children}
      </LanguageContext.Provider>
    )
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, getApiUrl }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}