export type Language = 'en' | 'th'

const LANGUAGE_KEY = 'site-language'
const DEFAULT_LANGUAGE: Language = 'en'

export function getStoredLanguage(): Language {
  if (typeof window === 'undefined') {
    return DEFAULT_LANGUAGE
  }
  
  const storedLang = localStorage.getItem(LANGUAGE_KEY) as Language | null
  if (storedLang && (storedLang === 'en' || storedLang === 'th')) {
    return storedLang
  }
  
  return DEFAULT_LANGUAGE
}

export function setStoredLanguage(lang: Language): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LANGUAGE_KEY, lang)
  }
}

export function getLanguageFromCookieHeader(cookieHeader: string | null): Language {
  if (!cookieHeader) return DEFAULT_LANGUAGE
  
  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=')
    acc[key] = value
    return acc
  }, {} as Record<string, string>)
  
  const lang = cookies[LANGUAGE_KEY] as Language | undefined
  return lang && (lang === 'en' || lang === 'th') ? lang : DEFAULT_LANGUAGE
}