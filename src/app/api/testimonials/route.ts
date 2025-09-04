import { NextRequest, NextResponse } from 'next/server'
import { getFetchConfig, getCacheHeaders } from '@/config/cache.config'
import { getWordPressApiUrl, getApiBasePath } from '@/lib/api/api-helper'
import {
  WordPressTestimonialsResponseSchema,
  type TestimonialsResponse,
  type Testimonial,
} from '@/lib/types/wordpress-settings'

const DEFAULT_AVATAR = '/images/default-avatar.jpg'

/**
 * GET /api/testimonials
 * Proxy endpoint to fetch testimonials from WordPress REST API
 * 
 * Uses acf_format=standard to get avatar URLs directly from WordPress API
 * instead of avatar IDs that need to be converted to URLs
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = searchParams.get('limit') || '15'
    const language = (searchParams.get('lang') || 'en') as 'en' | 'th'

    // Build WordPress API URL for testimonials
    const params = new URLSearchParams({
      per_page: limit,
      meta_key: 'sort_order',
      orderby: 'meta_value_num',
      order: 'asc',
      _fields: 'acf',
      acf_format: 'standard',
    })

    const apiUrl = getWordPressApiUrl(language)
    const basePath = getApiBasePath()
    const wpApiUrl = `${apiUrl}${basePath}/testimonial?${params.toString()}`

    // Fetch testimonials from WordPress API with environment-aware caching
    const response = await fetch(wpApiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...getFetchConfig('testimonials'),
    })

    if (!response.ok) {
      throw new Error(`WordPress API responded with status: ${response.status}`)
    }

    const data = await response.json()

    // Validate response data with Zod
    const validatedTestimonials = WordPressTestimonialsResponseSchema.parse(data)

    // Transform WordPress testimonials to our format
    const transformedTestimonials: Testimonial[] = validatedTestimonials
      .filter((item) => item.acf.is_active) // Only include active testimonials
      .map((item, index) => {
        const acf = item.acf

        // Use avatar URL directly from WordPress API with acf_format=standard
        const avatarUrl = acf.avatar || DEFAULT_AVATAR

        return {
          id: `testimonial-${index + 1}`,
          avatar: avatarUrl,
          message: acf.message,
          date: formatDate(acf.date),
          isActive: acf.is_active,
          sortOrder: acf.sort_order,
        }
      })
      .sort((a, b) => a.sortOrder - b.sortOrder) // Sort by sort_order

    const responseData: TestimonialsResponse = {
      testimonials: transformedTestimonials,
    }

    return NextResponse.json(responseData, {
      headers: getCacheHeaders('mediumTerm'),
    })
  } catch (error) {
    console.error('Testimonials API error:', error)

    // Return error response with empty testimonials
    const fallbackResponse: TestimonialsResponse = {
      testimonials: [],
    }

    return NextResponse.json(
      {
        ...fallbackResponse,
        error: 'Failed to fetch testimonials',
        message:
          process.env.NODE_ENV === 'development'
            ? (error as Error).message
            : 'Unable to load testimonials at this time',
      },
      {
        status: 500,
        headers: getCacheHeaders('shortTerm'),
      },
    )
  }
}

/**
 * Format date from YYYYMMDD to a readable format
 */
function formatDate(dateString: string): string {
  if (!dateString || dateString.length !== 8) {
    return dateString
  }

  const year = dateString.substring(0, 4)
  const month = dateString.substring(4, 6)
  const day = dateString.substring(6, 8)

  const date = new Date(`${year}-${month}-${day}`)
  
  // Format as Thai date or return original if invalid
  if (isNaN(date.getTime())) {
    return dateString
  }

  // Format date based on language from request context (defaulting to Thai for backward compatibility)
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}