import { NextRequest, NextResponse } from 'next/server'
import { LaravelCategoriesResponseSchema } from '@/lib/types/laravel'
import type { BlogCategoriesResponse } from '@/lib/types/wordpress'
import { buildLaravelApiUrl } from '@/config/api.config'
import { getFetchConfig, getCacheHeaders } from '@/config/cache.config'

/**
 * GET /api/blog/categories
 * Proxy endpoint to fetch categories from Laravel REST API
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const lang = searchParams.get('lang') || 'en'

    // Build Laravel API URL
    const apiUrl = buildLaravelApiUrl('categories', {
      locale: lang,
    })

    // Fetch categories from Laravel API with environment-aware caching
    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': lang,
      },
      ...getFetchConfig('blogCategories'),
    })

    if (!response.ok) {
      throw new Error(`Laravel API responded with status: ${response.status}`)
    }

    const responseData = await response.json()

    // Validate response data with Zod
    const validatedData = LaravelCategoriesResponseSchema.parse(responseData)

    // Add default "All Posts" category and transform to our format
    const transformedCategories = [
      {
        id: 'all',
        name: {
          english: 'All Articles',
          thai: 'บทความทั้งหมด',
        },
      },
      ...validatedData.data.map(category => ({
        id: category.id.toString(),
        name: {
          english: category.name,
          thai: category.name, // Laravel already handles translation based on locale
        },
      }))
    ]

    const result: BlogCategoriesResponse = {
      categories: transformedCategories
    }

    return NextResponse.json(result, {
      headers: getCacheHeaders('mediumTerm'),
    })

  } catch (error) {
    console.error('Categories API error:', error)

    // Return error response with fallback categories
    const fallbackResponse: BlogCategoriesResponse = {
      categories: [
        {
          id: 'all',
          name: {
            english: 'All Articles',
            thai: 'บทความทั้งหมด',
          },
        },
      ]
    }

    return NextResponse.json(
      {
        ...fallbackResponse,
        error: 'Failed to fetch categories',
        message: process.env.NODE_ENV === 'development'
          ? (error as Error).message
          : 'Unable to load categories at this time'
      },
      {
        status: 500,
        headers: getCacheHeaders('mediumTerm'),
      }
    )
  }
}