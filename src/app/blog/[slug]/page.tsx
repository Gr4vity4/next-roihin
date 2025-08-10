import ChatWidget from '@/components/ChatWidget'
import Navigation from '@/components/Navigation'
import { Footer } from '@/components/sections'
import {
  Breadcrumb,
  Container,
  RelatedArticles,
  SafeHtml,
  SocialShare,
  Typography,
} from '@/components/ui'
import { content } from '@/config/content.config'
import { siteConfig } from '@/config/site.config'
import type { BlogPostDetailsResponse } from '@/lib/types/wordpress'
import { formatThaiDate } from '@/lib/utils'
import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'

interface ArticlePageProps {
  params: Promise<{
    slug: string
  }>
}

// Helper function to fetch article from WordPress API by title
async function getArticleBySlug(slug: string): Promise<BlogPostDetailsResponse['post'] | null> {
  try {
    const decodedSlug = decodeURIComponent(slug)

    // Build the API URL - use the current domain in production
    const baseUrl =
      process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : siteConfig.url

    const apiUrl = `${baseUrl}/api/blog/posts/${encodeURIComponent(decodedSlug)}`

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
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article) {
    return {
      title: 'Article Not Found - ROIHIN STONE & BRACELET',
      description: 'The requested article could not be found.',
    }
  }

  const title = `${article.title} | ${siteConfig.name}`
  const description = article.excerpt
  const url = `${siteConfig.url}/blog/${encodeURIComponent(article.title)}`

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
      publishedTime: article.date,
      authors: article.author ? [article.author.name] : [],
      url,
      images: [
        {
          url: article.heroImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description,
      images: [article.heroImage],
    },
    alternates: {
      canonical: url,
    },
  }
}

// Generate static params is removed as we're fetching from WordPress API dynamically

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  const formattedDate = formatThaiDate(article.date)
  const currentUrl = `${siteConfig.url}/blog/${encodeURIComponent(article.title)}`

  // Breadcrumb items
  const breadcrumbItems = [
    {
      label: 'หน้าแรก',
      href: '/',
    },
    {
      label: 'บล็อก',
      href: '/blog',
    },
    {
      label: article.title,
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="pt-20 lg:pt-24">
        {/* Article Header */}
        <section className="relative">
          {/* Hero Image */}
          <div className="relative w-full h-[400px] lg:h-[500px]">
            <Image
              src={article.heroImage}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>

          {/* Article Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
            <Container>
              <div className="text-white">
                <Typography
                  variant="h2"
                  fontFamily="mixed-lang"
                  className="text-3xl lg:text-5xl font-bold mb-4 drop-shadow-lg"
                >
                  {article.title}
                </Typography>

                {/* Article Meta */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-200">
                  <Typography variant="caption" fontFamily="mixed-lang" className="text-white">
                    {formattedDate}
                  </Typography>
                  {article.author && (
                    <>
                      <span className="text-gray-400">•</span>
                      <span>By {article.author.name}</span>
                    </>
                  )}
                </div>
              </div>
            </Container>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-12 lg:py-16">
          <Container>
            <div className="max-w-4xl mx-auto">
              {/* Breadcrumb */}
              <Breadcrumb items={breadcrumbItems} className="mb-8" />

              {/* Article title */}
              <div className="mb-8 p-6 bg-gray-50 border-l-4 border-[#D4AF37]">
                <Typography
                  variant="body"
                  fontFamily="mixed-lang"
                  className="text-gray-700 text-lg leading-8"
                >
                  {article.title}
                </Typography>
              </div>

              {/* Article Content */}
              <article className="prose prose-lg max-w-none">
                <SafeHtml
                  html={article.content}
                  className=" text-gray-800 leading-8 [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:text-[#006039] [&_h3]:mt-8 [&_h3]:mb-4 [&_h4]:text-xl [&_h4]:font-semibold [&_h4]:text-[#006039] [&_h4]:mt-6 [&_h4]:mb-3 [&_p]:mb-4 [&_p]:leading-8 [&_ul]:list-disc [&_ul]:list-inside [&_ul]:mb-4 [&_ul]:space-y-2 [&_li]:leading-7 [&_strong]:font-semibold [&_strong]:text-[#006039]"
                />
              </article>

              {/* Article Terms/Categories */}
              {article.terms && article.terms.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <Typography variant="h4" className="text-[#006039] mb-4">
                    Categories
                  </Typography>
                  <div className="flex flex-wrap gap-2">
                    {article.terms
                      .filter((term) => term.taxonomy === 'category')
                      .map((term) => (
                        <span
                          key={term.id}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-sm hover:bg-gray-200 transition-colors"
                        >
                          {term.name}
                        </span>
                      ))}
                  </div>
                </div>
              )}

              {/* Author Info */}
              {article.author && (
                <div className="mt-8 p-6 bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-[#006039] flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {article.author.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <Typography variant="h4" className="text-gray-900 mb-1">
                        {article.author.name}
                      </Typography>
                      {article.author.description && (
                        <Typography
                          variant="caption"
                          fontFamily="mixed-lang"
                          className="text-gray-600"
                        >
                          {article.author.description}
                        </Typography>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Social Share */}
              <SocialShare
                url={currentUrl}
                title={article.title}
                description={article.excerpt}
                className="mt-8"
              />
            </div>
          </Container>
        </section>

        {/* Related Articles - keeping static content for now */}
        <RelatedArticles
          articles={Object.values(content.blog.articles)}
          currentArticleId={article.id}
        />
      </main>

      <Footer />
      <ChatWidget />
    </div>
  )
}
