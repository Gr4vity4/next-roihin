import { NextResponse } from 'next/server'
import { getCacheHeaders } from '@/config/cache.config'

/**
 * GET /api/site-settings
 *
 * ⚠️ WARNING: This endpoint currently returns hardcoded fallback values
 * because the Laravel API does not yet have a /api/v1/site-settings endpoint.
 *
 * TODO: Implement Laravel site-settings endpoint and migrate this route
 * to use the Laravel API once available.
 */
export async function GET() {
  try {
    // TODO: Replace with Laravel API call once /api/v1/site-settings is implemented
    // For now, return fallback values directly
    console.warn('[Site Settings] Using hardcoded fallback values - Laravel API endpoint not yet implemented')

    const fallbackSettings = {
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

    return NextResponse.json(fallbackSettings, {
      headers: getCacheHeaders('longTerm'),
    })
  } catch (error) {
    console.error('Site settings API error:', error)

    // Return error response with fallback settings
    const fallbackResponse = {
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