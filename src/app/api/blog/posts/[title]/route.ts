import { getLaravelApiEndpoint } from '@/config/api.config'
import { getCacheHeaders, getFetchConfig } from '@/config/cache.config'
import { NextRequest, NextResponse } from 'next/server'

interface RouteParams {
  params: Promise<{
    title: string // This is actually a slug now, but keeping the name for backwards compatibility
  }>
}

/**
 * GET /api/blog/posts/[title]
 * Proxy endpoint to fetch a single post by slug from Laravel REST API
 * Path parameters:
 * - title: The URL-encoded slug of the post to fetch (kept as 'title' for backwards compatibility)
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { title } = await params
    const searchParams = request.nextUrl.searchParams
    const lang = searchParams.get('lang') || 'en'

    if (!title) {
      return NextResponse.json(
        {
          error: 'Missing title parameter',
          message: 'Title parameter is required to fetch post',
        },
        {
          status: 400,
          headers: getCacheHeaders('noCache'),
        },
      )
    }

    // Decode the URL-encoded slug
    const decodedSlug = decodeURIComponent(title)

    // Build Laravel API URL for single post
    const apiUrl = `${getLaravelApiEndpoint(`posts/${decodedSlug}`)}?locale=${lang}`

    // Fetch post from Laravel API
    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': lang,
      },
      ...getFetchConfig('blogPosts'),
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          {
            error: 'Post not found',
            message: 'No post found with the specified title',
          },
          {
            status: 404,
            headers: getCacheHeaders('shortTerm'),
          },
        )
      }

      throw new Error(`Laravel API responded with status: ${response.status}`)
    }

    const responseData = await response.json()
    const data = responseData.data || responseData

    // Return Laravel response directly
    const result = {
      post: data,
    }

    return NextResponse.json(result, {
      headers: getCacheHeaders('shortTerm'),
    })
  } catch (error) {
    console.error('Post by title API error:', error)

    // Handle Zod validation errors specifically
    if (error && typeof error === 'object' && 'issues' in error) {
      console.error('Zod validation error:', error)
      return NextResponse.json(
        {
          error: 'Invalid response format',
          message: 'The Laravel API response does not match expected format',
        },
        {
          status: 502,
          headers: getCacheHeaders('noCache'),
        },
      )
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch post',
        message:
          process.env.NODE_ENV === 'development'
            ? (error as Error).message
            : 'Unable to load post at this time',
      },
      {
        status: 500,
        headers: getCacheHeaders('noCache'),
      },
    )
  }
}

// Transformation function removed - using Laravel response directly
