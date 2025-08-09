import { NextRequest, NextResponse } from 'next/server'
import { WordPressCategoriesResponseSchema } from '@/lib/types/wordpress'
import type { BlogCategoriesResponse } from '@/lib/types/wordpress'

const WORDPRESS_API_URL = 'https://wp-roihin.precisiondevlab.com/wp-json/wp/v2/categories'

/**
 * GET /api/blog/categories
 * Proxy endpoint to fetch categories from WordPress REST API
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const exclude = searchParams.get('exclude') || '1' // Exclude "Uncategorized" by default
    
    // Fetch categories from WordPress API
    const response = await fetch(`${WORDPRESS_API_URL}?exclude=${exclude}&per_page=100`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { 
        revalidate: 300 // Cache for 5 minutes
      }
    })

    if (!response.ok) {
      throw new Error(`WordPress API responded with status: ${response.status}`)
    }

    const data = await response.json()
    
    // Validate response data with Zod
    const validatedCategories = WordPressCategoriesResponseSchema.parse(data)
    
    // Add default "All Posts" category and transform to our format
    const transformedCategories = [
      {
        id: 'all',
        name: {
          english: 'All Articles',
          thai: 'บทความทั้งหมด',
        },
      },
      ...validatedCategories.map(category => ({
        id: category.id.toString(),
        name: {
          english: category.name,
          thai: category.name, // For now, using same name for Thai. This could be enhanced with translations
        },
      }))
    ]

    const responseData: BlogCategoriesResponse = {
      categories: transformedCategories
    }

    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
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
        headers: {
          'Cache-Control': 'no-cache',
        },
      }
    )
  }
}