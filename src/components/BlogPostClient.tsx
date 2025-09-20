'use client'

import ChatWidget from '@/components/ChatWidget'
import NavigationWithSuspense from '@/components/NavigationWithSuspense'
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
import { useLocale } from 'next-intl'
import type { BlogPostDetailsResponse } from '@/lib/types/wordpress'
import { formatThaiDate } from '@/lib/utils'
import Image from 'next/image'
import { notFound, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface BlogPostClientProps {
  slug: string
}

export default function BlogPostClient({ slug }: BlogPostClientProps) {
  const locale = useLocale() as 'en' | 'th'
  const router = useRouter()
  const [article, setArticle] = useState<BlogPostDetailsResponse['post'] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true)
      try {
        const decodedSlug = decodeURIComponent(slug)
        const baseUrl =
          process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : ''
        const apiUrl = `${baseUrl}/api/blog/posts/${encodeURIComponent(decodedSlug)}?lang=${locale}`

        const response = await fetch(apiUrl)

        if (!response.ok) {
          console.error(`API request failed with status ${response.status}`)
          // If post not found in the selected language, redirect to blog listing
          if (response.status === 404) {
            router.push('/blog')
            return
          }
          setArticle(null)
        } else {
          const data: BlogPostDetailsResponse = await response.json()
          setArticle(data.post)
        }
      } catch (error) {
        console.error('Error fetching article:', error)
        setArticle(null)
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [slug, locale, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <NavigationWithSuspense />
        <main className="pt-20 lg:pt-24">
          <Container>
            <div className="py-16 text-center">
              <Typography variant="h3" className="text-gray-600">
                Loading...
              </Typography>
            </div>
          </Container>
        </main>
        <Footer />
      </div>
    )
  }

  if (!article) {
    notFound()
  }

  const formattedDate = formatThaiDate(article.date)
  const currentUrl = `${siteConfig.url}/blog/${encodeURIComponent(article.slug)}`

  const breadcrumbItems = [
    {
      label: locale === 'th' ? 'หน้าแรก' : 'Home',
      href: '/',
    },
    {
      label: locale === 'th' ? 'บล็อก' : 'Blog',
      href: '/blog',
    },
    {
      label: article.title,
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <NavigationWithSuspense />

      <main className="pt-20 lg:pt-24">
        <section className="relative">
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

          <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
            <Container>
              <div className="text-white">
                <Typography
                  variant="h2"
                  className="text-3xl lg:text-5xl font-bold mb-4 drop-shadow-lg"
                >
                  {article.title}
                </Typography>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-200">
                  <Typography variant="caption" className="text-white">
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

        <section className="py-12 lg:py-16">
          <Container>
            <div className="max-w-4xl mx-auto">
              <Breadcrumb items={breadcrumbItems} className="mb-8" />

              <div className="mb-8 p-6 bg-gray-50 border-l-4 border-[#D4AF37]">
                <Typography
                  variant="body"
                  className="text-gray-700 text-lg leading-8"
                >
                  {article.title}
                </Typography>
              </div>

              <article className="prose prose-lg max-w-none">
                <SafeHtml
                  html={article.content}
                  className=" text-gray-800 leading-8 [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:text-[#006039] [&_h3]:mt-8 [&_h3]:mb-4 [&_h4]:text-xl [&_h4]:font-semibold [&_h4]:text-[#006039] [&_h4]:mt-6 [&_h4]:mb-3 [&_p]:mb-4 [&_p]:leading-8 [&_ul]:list-disc [&_ul]:list-inside [&_ul]:mb-4 [&_ul]:space-y-2 [&_li]:leading-7 [&_strong]:font-semibold [&_strong]:text-[#006039]"
                />
              </article>

              {article.terms && article.terms.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <Typography variant="h4" className="text-[#006039] mb-4">
                    {locale === 'th' ? 'หมวดหมู่' : 'Categories'}
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
                          className="text-gray-600"
                        >
                          {article.author.description}
                        </Typography>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <SocialShare
                url={currentUrl}
                title={article.title}
                description={article.excerpt}
                className="mt-8"
              />
            </div>
          </Container>
        </section>

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