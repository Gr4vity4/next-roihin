import { NextRequest, NextResponse } from 'next/server'
import { getFetchConfig, getCacheHeaders } from '@/config/cache.config'
import { buildLaravelApiUrl, LARAVEL_API_URL } from '@/config/api.config'
import { LaravelTestimonialsResponseSchema } from '@/lib/types/laravel'
import type { Testimonial, TestimonialsResponse } from '@/lib/types/testimonials'

const DEFAULT_AVATAR = '/images/default-avatar.svg'

const DEFAULT_PER_PAGE = 20
const MAX_PER_PAGE = 100

/**
 * GET /api/testimonials
 * Proxy endpoint to fetch testimonials from Laravel REST API.
 * The Laravel API returns the full list; pagination happens here
 * via `page` and `per_page` query params (20 per page by default).
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const language = (searchParams.get('lang') || 'en') as 'en' | 'th'
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1)
    const perPage = Math.min(
      MAX_PER_PAGE,
      Math.max(1, parseInt(searchParams.get('per_page') || String(DEFAULT_PER_PAGE), 10) || DEFAULT_PER_PAGE),
    )

    // Build Laravel API URL for testimonials (no limit — fetch the full list)
    const apiUrl = buildLaravelApiUrl('testimonials', {
      locale: language,
    })

    // Fetch testimonials from Laravel API with environment-aware caching
    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': language,
      },
      ...getFetchConfig('testimonials'),
    })

    if (!response.ok) {
      throw new Error(`Laravel API responded with status: ${response.status}`)
    }

    const responseData = await response.json()

    // Validate response data with Zod
    const validatedData = LaravelTestimonialsResponseSchema.parse(responseData)

    // Transform Laravel testimonials to our format
    const transformedTestimonials: Testimonial[] = validatedData.data.map((item) => {
      const avatar = resolveStorageAssetUrl(item.avatar) ?? DEFAULT_AVATAR

      return {
        id: `testimonial-${item.id}`,
        avatar,
        message: item.message,
        date: formatDate(item.date, language),
        isActive: item.is_active,
        sortOrder: item.sort_order,
        reviewImage: resolveStorageAssetUrl(item.review_image),
      }
    })

    const total = transformedTestimonials.length
    const totalPages = Math.max(1, Math.ceil(total / perPage))
    const currentPage = Math.min(page, totalPages)
    const start = (currentPage - 1) * perPage

    const result: TestimonialsResponse = {
      testimonials: transformedTestimonials.slice(start, start + perPage),
      pagination: {
        page: currentPage,
        perPage,
        total,
        totalPages,
      },
    }

    return NextResponse.json(result, {
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

function resolveStorageAssetUrl(value?: string | null): string | null {
  if (!value) {
    return null
  }

  const trimmed = value.trim()
  if (!trimmed) {
    return null
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed
  }

  const baseUrl = (LARAVEL_API_URL || '').replace(/\/$/, '')
  const normalizedPath = trimmed.replace(/^\/+/, '')

  if (!baseUrl) {
    return normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`
  }

  if (normalizedPath.startsWith('storage/')) {
    return `${baseUrl}/${normalizedPath}`
  }

  if (normalizedPath.startsWith('public/')) {
    const withoutPublic = normalizedPath.replace(/^public\//, '')
    return `${baseUrl}/storage/${withoutPublic}`
  }

  return `${baseUrl}/storage/${normalizedPath}`
}

/**
 * Format date from ISO format (YYYY-MM-DD) to a readable localized format
 */
function formatDate(dateString: string, language: 'en' | 'th'): string {
  if (!dateString) {
    return dateString
  }

  // Parse date - handles both ISO format (YYYY-MM-DD) and legacy YYYYMMDD
  const date = new Date(dateString)

  // Format date or return original if invalid
  if (isNaN(date.getTime())) {
    return dateString
  }

  // Format date based on language
  const locale = language === 'th' ? 'th-TH' : 'en-US'
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
