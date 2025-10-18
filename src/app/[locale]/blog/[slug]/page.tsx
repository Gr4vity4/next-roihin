import BlogPostClient from '@/components/BlogPostClient'
import { siteConfig } from '@/config/site.config'
import type { Metadata } from 'next'

interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image?: string
  author: {
    name: string
    avatar?: string
  }
  published_at: string
  reading_time: number
  categories: Array<{
    id: number
    name: string
    slug: string
  }>
}

interface BlogPostDetailsResponse {
  post: BlogPost | null
}

interface ArticlePageProps {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// Helper function to fetch article from WordPress API by slug
async function getArticleBySlug(
  slug: string,
  lang: string = 'en'
): Promise<BlogPostDetailsResponse['post'] | null> {
  try {
    const decodedSlug = decodeURIComponent(slug)

    // Build the API URL - use the current domain in production
    const baseUrl =
      process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : siteConfig.url

    const apiUrl = `${baseUrl}/api/blog/posts/${encodeURIComponent(decodedSlug)}?lang=${lang}`

    const response = await fetch(apiUrl, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`API request failed: ${response.status}`)
    }

    const data: BlogPostDetailsResponse = await response.json()
    return data.post
  } catch (error) {
    console.error('Error fetching article:', error)
    return null
  }
}

// Generate metadata for the article page
export async function generateMetadata({ params, searchParams }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const resolvedSearchParams = await searchParams
  const lang = typeof resolvedSearchParams?.lang === 'string' ? resolvedSearchParams.lang : 'en'
  const article = await getArticleBySlug(slug, lang)

  if (!article) {
    return {
      title: 'Article Not Found - ROIHIN STONE & BRACELET',
      description: 'The requested article could not be found.',
    }
  }

  const title = `${article.title} | ${siteConfig.name}`
  const description = article.excerpt
  const url = `${siteConfig.url}/blog/${encodeURIComponent(article.slug)}`

  return {
    title,
    description,
    keywords: [
      'stone healing',
      'crystal therapy',
      'natural stones',
      'ROIHIN',
      'พลังหิน',
      'การรักษาด้วยหิน',
    ],
    authors: article.author ? [{ name: article.author.name }] : [],
    openGraph: {
      title: article.title,
      description,
      type: 'article',
      publishedTime: article.published_at,
      authors: article.author ? [article.author.name] : [],
      url,
      images: article.featured_image ? [
        {
          url: article.featured_image,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description,
      images: article.featured_image ? [article.featured_image] : [],
    },
    alternates: {
      canonical: url,
    },
  }
}

// Generate static params is removed as we're fetching from WordPress API dynamically

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  
  return <BlogPostClient slug={slug} />
}
