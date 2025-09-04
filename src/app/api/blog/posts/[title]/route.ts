import type { BlogPostDetailsResponse, WordPressSinglePost } from '@/lib/types/wordpress'
import { WordPressSinglePostSchema } from '@/lib/types/wordpress'
import { extractTextFromHtml } from '@/lib/utils'
import { NextRequest, NextResponse } from 'next/server'

const WORDPRESS_BASE_URL = 'https://wp-roihin.precisiondevlab.com'
const DEFAULT_IMAGE = '/images/357c3a_ac4bc1a787364c358512be32cc1ffc30~mv2.avif'

interface RouteParams {
  params: Promise<{
    title: string // This is actually a slug now, but keeping the name for backwards compatibility
  }>
}

/**
 * GET /api/blog/posts/[title]
 * Proxy endpoint to fetch a single post by slug from WordPress REST API
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
          headers: {
            'Cache-Control': 'no-cache',
          },
        },
      )
    }

    // Decode the URL-encoded slug
    const decodedSlug = decodeURIComponent(title)

    // Build WordPress API URL with language prefix
    const langPrefix = lang === 'th' ? '/th' : ''
    const apiUrl = `${WORDPRESS_BASE_URL}${langPrefix}/wp-json/wp/v2/posts`

    // Build WordPress API URL with slug parameter
    const apiParams = new URLSearchParams({
      slug: decodedSlug,
      _embed: 'author,wp:featuredmedia,wp:term',
      _fields: 'id,slug,title,content,excerpt,date,categories,acf,_links,_embedded',
    })

    const wpApiUrl = `${apiUrl}?${apiParams.toString()}`

    // Fetch post from WordPress API
    const response = await fetch(wpApiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 300, // Cache for 5 minutes (single posts change less frequently)
      },
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
            headers: {
              'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
            },
          },
        )
      }

      throw new Error(`WordPress API responded with status: ${response.status}`)
    }

    const data = await response.json()

    // When fetching by slug, WordPress returns an array
    const postData = Array.isArray(data) ? data[0] : data
    
    if (!postData) {
      return NextResponse.json(
        {
          error: 'Post not found',
          message: 'No post found with the specified slug',
        },
        {
          status: 404,
          headers: {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          },
        },
      )
    }

    // Validate response data with Zod
    let validatedPost
    try {
      validatedPost = WordPressSinglePostSchema.parse(postData)
    } catch (validationError) {
      console.error('Validation error for post data:', {
        slug: decodedSlug,
        lang,
        postDataKeys: Object.keys(postData || {}),
        error: validationError
      })
      throw validationError
    }

    // Transform WordPress post to our frontend format
    const transformedPost = transformWordPressPost(validatedPost)

    const responseData: BlogPostDetailsResponse = {
      post: transformedPost,
    }

    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('Post by title API error:', error)

    // Handle Zod validation errors specifically
    if (error && typeof error === 'object' && 'issues' in error) {
      console.error('Zod validation error:', error)
      return NextResponse.json(
        {
          error: 'Invalid response format',
          message: 'The WordPress API response does not match expected format',
        },
        {
          status: 502,
          headers: {
            'Cache-Control': 'no-cache',
          },
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
        headers: {
          'Cache-Control': 'no-cache',
        },
      },
    )
  }
}

/**
 * Transform WordPress post data to frontend BlogPostDetails format
 */
function transformWordPressPost(post: WordPressSinglePost) {
  // Extract hero image from ACF, fallback to featured media, then default
  const heroImage =
    (post.acf?.hero_image && typeof post.acf.hero_image === 'string' ? post.acf.hero_image : null) ||
    post._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
    DEFAULT_IMAGE

  // Extract featured image (different from hero image)
  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url

  // Extract text content from WordPress excerpt field
  const excerpt = extractTextFromHtml(post.excerpt.rendered, 200)

  // Extract author information
  const author = post._embedded?.author?.[0]
    ? {
        id: post._embedded.author[0].id,
        name: post._embedded.author[0].name,
        description: post._embedded.author[0].description,
      }
    : undefined

  // Extract terms (categories, tags, etc.)
  const terms =
    post._embedded?.['wp:term']?.flat().map((term) => ({
      id: term.id,
      name: term.name,
      slug: term.slug,
      taxonomy: term.taxonomy,
    })) || []

  return {
    id: post.id.toString(),
    slug: post.slug,
    title: post.title.rendered,
    content: post.content.rendered,
    excerpt: excerpt,
    heroImage: heroImage,
    featuredImage: featuredImage,
    date: post.date,
    categories: post.categories,
    author: author,
    terms: terms,
  }
}
