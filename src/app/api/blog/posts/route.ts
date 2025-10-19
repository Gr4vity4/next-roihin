import {
  BlogPostsResponseSchema,
  LaravelPostsResponseSchema,
  type BlogPost,
} from '@/lib/types/laravel'
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

    // Transform Laravel data into frontend-friendly blog posts
    const posts: BlogPost[] = validatedData.data.map((post) => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      image: post.featured_image ?? DEFAULT_IMAGE,
      date: post.published_at || post.created_at,
      category: post.category
        ? {
            id: post.category.id.toString(),
            slug: post.category.slug,
            name: {
              english: post.category.name,
              thai: post.category.name,
            },
          }
        : null,
    }))
    const pagination = validatedData.meta?.pagination
    const currentPage = parseInt(page)

    const result = BlogPostsResponseSchema.parse({
      posts,
      totalPages: pagination?.last_page && pagination.last_page > 0
        ? pagination.last_page
        : posts.length > 0
          ? 1
          : undefined,
      currentPage,
    })

    return NextResponse.json(result, {
      headers: getCacheHeaders('shortTerm'),
    })
  } catch (error) {
    console.error('Posts API error:', error)

    // Return error response with empty posts
    const fallbackResponse = BlogPostsResponseSchema.parse({
      posts: [],
      currentPage: parseInt(request.nextUrl.searchParams.get('page') || '1'),
    })

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
