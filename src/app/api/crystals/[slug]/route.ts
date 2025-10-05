import { NextRequest, NextResponse } from 'next/server'
import { getFetchConfig, getCacheHeaders } from '@/config/cache.config'
import { getWordPressApiUrl, getApiBasePath } from '@/config/api.config'
import {
  type CrystalPostType,
  type CrystalProduct,
  type CrystalAPIResponse,
  transformToCrystalProduct,
} from '@/lib/types/crystal'

/**
 * GET /api/crystals/[slug]
 * Fetch a single crystal by slug from WordPress REST API
 *
 * Query Parameters:
 * - lang: Language (en/th)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const searchParams = request.nextUrl.searchParams
    const lang = (searchParams.get('lang') || 'th') as 'en' | 'th'

    // Build WordPress API URL parameters
    const wpParams = new URLSearchParams({
      acf_format: 'standard',
      _fields: 'id,slug,acf',
    })

    // Query by crystal_slug ACF field
    wpParams.append('meta_key', 'crystal_slug')
    wpParams.append('meta_value', slug)

    // Build WordPress API URL
    const apiUrl = getWordPressApiUrl(lang)
    const basePath = getApiBasePath()
    const wpApiUrl = `${apiUrl}${basePath}/crystal?${wpParams.toString()}`

    // Fetch crystal from WordPress API
    const response = await fetch(wpApiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...getFetchConfig('api'),
    })

    if (!response.ok) {
      throw new Error(`WordPress API responded with status: ${response.status}`)
    }

    const data: CrystalPostType[] = await response.json()

    // Check if crystal was found
    if (!data || data.length === 0) {
      const notFoundResponse: CrystalAPIResponse = {
        crystal: null,
        error: 'Crystal not found',
      }

      return NextResponse.json(notFoundResponse, {
        status: 404,
        headers: getCacheHeaders('shortTerm'),
      })
    }

    // Transform WordPress data to frontend format
    const crystalPost = data[0]
    const crystal: CrystalProduct = transformToCrystalProduct(crystalPost)

    const responseData: CrystalAPIResponse = {
      crystal,
    }

    return NextResponse.json(responseData, {
      headers: getCacheHeaders('shortTerm'),
    })
  } catch (error) {
    console.error('Crystal API error:', error)

    // Return error response
    const errorResponse: CrystalAPIResponse = {
      crystal: null,
      error: 'Failed to fetch crystal',
    }

    return NextResponse.json(
      {
        ...errorResponse,
        message:
          process.env.NODE_ENV === 'development'
            ? (error as Error).message
            : 'Unable to load crystal at this time',
      },
      {
        status: 500,
        headers: getCacheHeaders('shortTerm'),
      }
    )
  }
}
