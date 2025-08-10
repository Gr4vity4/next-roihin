import { NextResponse } from 'next/server'
import { getFetchConfig, getCacheHeaders } from '@/config/cache.config'
import {
  WordPressPageSettingsResponseSchema,
  type SiteSettingsResponse,
} from '@/lib/types/wordpress-settings'

const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL || 'https://wp-roihin.precisiondevlab.com'
const WORDPRESS_API_BASE_PATH = process.env.WORDPRESS_API_BASE_PATH || '/wp-json/wp/v2'

/**
 * GET /api/site-settings
 * Proxy endpoint to fetch site settings from WordPress REST API
 */
export async function GET() {
  try {
    // Build WordPress API URL for page settings
    const wpApiUrl = `${WORDPRESS_API_URL}${WORDPRESS_API_BASE_PATH}/pagesetting?_fields=acf`

    // Fetch settings from WordPress API with environment-aware caching
    const response = await fetch(wpApiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...getFetchConfig('siteSettings'),
    })

    if (!response.ok) {
      throw new Error(`WordPress API responded with status: ${response.status}`)
    }

    const data = await response.json()

    // Validate response data with Zod
    const validatedSettings = WordPressPageSettingsResponseSchema.parse(data)

    // Check if we have settings data
    if (!validatedSettings.length || !validatedSettings[0]) {
      throw new Error('No settings data found')
    }

    const settings = validatedSettings[0].acf

    // Transform WordPress settings to our format
    const transformedSettings: SiteSettingsResponse = {
      settings: {
        contact: {
          address: settings.contact.address,
          phone: settings.contact.phone,
          email: settings.contact.email,
          hours: settings.contact.hours,
        },
        socialLinks: {
          facebook: settings.social_network.facebook,
          instagram: settings.social_network.instagram,
          youtube: settings.social_network.youtube,
          tiktok: settings.social_network.tiktok,
          pinterest: settings.social_network.pinterest,
          line: settings.social_network.line,
        },
      },
    }

    return NextResponse.json(transformedSettings, {
      headers: getCacheHeaders('longTerm'),
    })
  } catch (error) {
    console.error('Site settings API error:', error)

    // Return error response with fallback settings
    const fallbackResponse: SiteSettingsResponse = {
      settings: {
        contact: {
          address: '101/54 หมู่บ้าน ภัสสร 70 (เกาะแก้ว) หมู่ที่ 4 ตำบลเกาะแก้ว อ.เมืองภูเก็ต จ.ภูเก็ต 83000',
          phone: '083 826 5195',
          email: 'info.roihin@gmail.com',
          hours: 'Monday - Saturday | 09:00 - 19:00',
        },
        socialLinks: {
          facebook: 'https://www.facebook.com/roihin42896395',
          instagram: 'http://instagram.com/roihinstone2489_6395',
          youtube: 'https://www.youtube.com/@roihinth',
          tiktok: 'https://vt.tiktok.com/ZSegokjLL/',
          pinterest: 'https://www.pinterest.com/roihinth/',
          line: 'https://lin.ee/palYKiG',
        },
      },
    }

    return NextResponse.json(
      {
        ...fallbackResponse,
        error: 'Failed to fetch site settings',
        message:
          process.env.NODE_ENV === 'development'
            ? (error as Error).message
            : 'Unable to load settings at this time',
      },
      {
        status: 500,
        headers: getCacheHeaders('shortTerm'),
      },
    )
  }
}