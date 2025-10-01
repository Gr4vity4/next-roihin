import type { SiteTranslations } from '@/lib/types/translations'
import { WORDPRESS_API_URL } from '@/config/api.config'

export async function getSiteTranslations(language: 'th' | 'en' = 'th'): Promise<SiteTranslations | null> {
  try {
    const url = `${WORDPRESS_API_URL}/wp-json/acf/v3/options/options${language ? `?lang=${language}` : ''}`
    
    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch translations: ${response.status}`)
    }

    const data = await response.json()
    return data as SiteTranslations
  } catch (error) {
    console.error('Error fetching site translations:', error)
    return null
  }
}