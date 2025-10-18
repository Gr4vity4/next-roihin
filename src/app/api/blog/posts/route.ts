import type { BlogPost, BlogPostsResponse } from '@/lib/types/wordpress'
import { LaravelPostsResponseSchema } from '@/lib/types/laravel'
import { buildLaravelApiUrl } from '@/config/api.config'
import { NextRequest, NextResponse } from 'next/server'
import { getFetchConfig, getCacheHeaders } from '@/config/cache.config'

const DEFAULT_IMAGE = '/images/357c3a_ac4bc1a787364c358512be32cc1ffc30~mv2.avif'

/**
 * GET /api/blog/posts
 * Proxy endpoint to fetch posts from Laravel REST API
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = searchParams.get('page') || '1'
    const perPage = searchParams.get('per_page') || '6'
    const lang = searchParams.get('lang') || 'en'

    // Build Laravel API URL with parameters
    const apiUrl = buildLaravelApiUrl('posts', {
      page: parseInt(page),
      per_page: parseInt(perPage),
      locale: lang,
    })

    // Fetch posts from Laravel API with environment-aware caching
    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': lang,
      },
      ...getFetchConfig('blogPosts'),
    })

    if (!response.ok) {
      throw new Error(`Laravel API responded with status: ${response.status}`)
    }

    const responseData = await response.json()

    // Validate response data with Zod
    const validatedData = LaravelPostsResponseSchema.parse(responseData)

    // Transform Laravel posts to our format
    const transformedPosts: BlogPost[] = validatedData.data.map((post) => {
      return {
        id: post.id.toString(),
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        image: post.featured_image || DEFAULT_IMAGE,
        date: post.published_at,
        categories: post.category ? [post.category.id] : [],
      }
    })

    // Get pagination info from Laravel meta
    const pagination = validatedData.meta.pagination
    const currentPage = parseInt(page)

    const result: BlogPostsResponse = {
      posts: transformedPosts,
      totalPages: pagination?.last_page,
      currentPage,
    }

    return NextResponse.json(result, {
      headers: getCacheHeaders('shortTerm'),
    })
  } catch (error) {
    console.error('Posts API error:', error)

    // Return error response with empty posts
    const fallbackResponse: BlogPostsResponse = {
      posts: [],
      currentPage: parseInt(request.nextUrl.searchParams.get('page') || '1'),
    }

    return NextResponse.json(
      {
        ...fallbackResponse,
        error: 'Failed to fetch posts',
        message:
          process.env.NODE_ENV === 'development'
            ? (error as Error).message
            : 'Unable to load posts at this time',
      },
      {
        status: 500,
        headers: getCacheHeaders('shortTerm'),
      },
    )
  }
}
