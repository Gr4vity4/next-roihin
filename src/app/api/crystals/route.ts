import { NextRequest, NextResponse } from 'next/server'
import { getFetchConfig, getCacheHeaders } from '@/config/cache.config'
import { getWordPressApiUrl, getApiBasePath } from '@/config/api.config'
import {
  type CrystalPostType,
  type Crystal,
  type CrystalsAPIResponse,
  transformToCrystal,
} from '@/lib/types/crystal'

/**
 * GET /api/crystals
 * Proxy endpoint to fetch crystals from WordPress REST API with filter support
 *
 * Query Parameters:
 * - lang: Language (en/th)
 * - page: Page number (default: 1)
 * - per_page: Items per page (default: 20)
 * - search: Search by crystal name
 * - color_filter: Comma-separated color values (e.g., "blue,green")
 * - energy_properties: Comma-separated energy values
 * - zodiac_signs: Comma-separated zodiac values
 * - element_type: Comma-separated element values
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    // Extract query parameters
    const lang = (searchParams.get('lang') || 'th') as 'en' | 'th'
    const page = searchParams.get('page') || '1'
    const perPage = searchParams.get('per_page') || '20'
    const search = searchParams.get('search') || ''

    // Filter parameters
    const colorFilter = searchParams.get('color_filter') || ''
    const energyProperties = searchParams.get('energy_properties') || ''
    const zodiacSigns = searchParams.get('zodiac_signs') || ''
    const elementType = searchParams.get('element_type') || ''

    // Build WordPress API URL parameters
    const wpParams = new URLSearchParams({
      page,
      per_page: perPage,
      _fields: 'id,slug,acf',
      acf_format: 'standard',
    })

    // Add search parameter if provided
    if (search) {
      wpParams.append('search', search)
    }

    // Add filter parameters if provided
    if (colorFilter) {
      wpParams.append('color_filter', colorFilter)
    }
    if (energyProperties) {
      wpParams.append('energy_properties', energyProperties)
    }
    if (zodiacSigns) {
      wpParams.append('zodiac_signs', zodiacSigns)
    }
    if (elementType) {
      wpParams.append('element_type', elementType)
    }

    // Build WordPress API URL
    const apiUrl = getWordPressApiUrl(lang)
    const basePath = getApiBasePath()
    const wpApiUrl = `${apiUrl}${basePath}/crystal?${wpParams.toString()}`

    // Fetch crystals from WordPress API
    const response = await fetch(wpApiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...getFetchConfig('api'),
    })

    if (!response.ok) {
      throw new Error(`WordPress API responded with status: ${response.status}`)
    }

    // Get pagination headers from WordPress
    const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1')
    const totalItems = parseInt(response.headers.get('X-WP-Total') || '0')

    const data: CrystalPostType[] = await response.json()

    // Transform WordPress data to frontend format
    const crystals: Crystal[] = data.map(transformToCrystal)

    const responseData: CrystalsAPIResponse = {
      crystals,
      totalPages,
      currentPage: parseInt(page),
      totalItems,
    }

    return NextResponse.json(responseData, {
      headers: getCacheHeaders('shortTerm'),
    })
  } catch (error) {
    console.error('Crystals API error:', error)

    // Return error response with empty crystals
    const fallbackResponse: CrystalsAPIResponse = {
      crystals: [],
      totalPages: 1,
      currentPage: 1,
      totalItems: 0,
    }

    return NextResponse.json(
      {
        ...fallbackResponse,
        error: 'Failed to fetch crystals',
        message:
          process.env.NODE_ENV === 'development'
            ? (error as Error).message
            : 'Unable to load crystals at this time',
      },
      {
        status: 500,
        headers: getCacheHeaders('shortTerm'),
      }
    )
  }
}
