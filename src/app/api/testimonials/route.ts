import { NextRequest, NextResponse } from 'next/server'
import { getFetchConfig, getCacheHeaders } from '@/config/cache.config'
import {
  WordPressTestimonialsResponseSchema,
  type TestimonialsResponse,
  type Testimonial,
} from '@/lib/types/wordpress-settings'

const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL || 'https://wp-roihin.precisiondevlab.com'
const WORDPRESS_API_BASE_PATH = process.env.WORDPRESS_API_BASE_PATH || '/wp-json/wp/v2'
const DEFAULT_AVATAR = '/images/default-avatar.jpg'

/**
 * GET /api/testimonials
 * Proxy endpoint to fetch testimonials from WordPress REST API
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const language = searchParams.get('language') || 'th'
    const limit = searchParams.get('limit') || '15'

    // Build WordPress API URL for testimonials
    const params = new URLSearchParams({
      per_page: limit,
      meta_key: 'sort_order',
      orderby: 'meta_value_num',
      order: 'asc',
      _fields: 'acf',
    })

    const wpApiUrl = `${WORDPRESS_API_URL}${WORDPRESS_API_BASE_PATH}/testimonial?${params.toString()}`

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

        // Convert avatar ID to URL (you might need to fetch the media URL separately)
        // For now, we'll use a placeholder pattern
        const avatarUrl = acf.avatar
          ? `/images/testimonials/avatar-${acf.avatar}.jpg`
          : DEFAULT_AVATAR

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

  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}