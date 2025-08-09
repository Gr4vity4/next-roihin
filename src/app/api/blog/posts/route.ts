import type { BlogPost, BlogPostsResponse } from '@/lib/types/wordpress'
import { WordPressPostsResponseSchema } from '@/lib/types/wordpress'
import { extractTextFromHtml } from '@/lib/utils'
import { NextRequest, NextResponse } from 'next/server'

const WORDPRESS_API_URL = 'https://wp-roihin.precisiondevlab.com/wp-json/wp/v2/posts'
const DEFAULT_IMAGE = '/images/357c3a_ac4bc1a787364c358512be32cc1ffc30~mv2.avif'

/**
 * GET /api/blog/posts
 * Proxy endpoint to fetch posts from WordPress REST API
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = searchParams.get('page') || '1'
    const perPage = searchParams.get('per_page') || '6'
    const categories = searchParams.get('categories') || ''

    // Build WordPress API URL with parameters
    const params = new URLSearchParams({
      page,
      per_page: perPage,
      _embed: 'wp:featuredmedia',
      _fields: 'id,slug,title,content,_links,_embedded,date,categories,excerpt',
    })

    // Add categories filter if specified
    if (categories && categories !== 'all') {
      params.append('categories', categories)
    }

    const wpApiUrl = `${WORDPRESS_API_URL}?${params.toString()}`

    // Fetch posts from WordPress API
    const response = await fetch(wpApiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 180, // Cache for 3 minutes (posts change more frequently than categories)
      },
    })

    if (!response.ok) {
      throw new Error(`WordPress API responded with status: ${response.status}`)
    }

    const data = await response.json()

    // Validate response data with Zod
    const validatedPosts = WordPressPostsResponseSchema.parse(data)

    // Transform WordPress posts to our format
    const transformedPosts: BlogPost[] = validatedPosts.map((post) => {
      // Extract featured image
      const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || DEFAULT_IMAGE

      // Extract text content from WordPress excerpt field and limit length
      const excerpt = extractTextFromHtml(post.excerpt.rendered, 128)

      return {
        id: post.id.toString(),
        slug: post.slug,
        title: {
          english: post.title.rendered,
          thai: post.title.rendered, // For now, using same title. This could be enhanced with translations
        },
        excerpt: {
          english: excerpt,
          thai: excerpt, // For now, using same excerpt. This could be enhanced with translations
        },
        image: featuredImage,
        date: post.date,
        categories: post.categories,
      }
    })

    // Get pagination info from headers
    const totalPages = response.headers.get('X-WP-TotalPages')
    const currentPage = parseInt(page)

    const responseData: BlogPostsResponse = {
      posts: transformedPosts,
      totalPages: totalPages ? parseInt(totalPages) : undefined,
      currentPage,
    }

    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': 'public, s-maxage=180, stale-while-revalidate=360',
      },
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
        headers: {
          'Cache-Control': 'no-cache',
        },
      },
    )
  }
}
