import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import ChatWidget from '@/components/ChatWidget'
import Navigation from '@/components/Navigation'
import { Footer } from '@/components/sections'
import { 
  BilingualText, 
  Container, 
  Typography, 
  Breadcrumb, 
  SocialShare,
  RelatedArticles 
} from '@/components/ui'
import { contentConfig } from '@/config/content.config'
import { siteConfig } from '@/config/site.config'

interface ArticlePageProps {
  params: Promise<{
    slug: string
  }>
}

// Helper function to get article by Thai title slug
function getArticleBySlug(slug: string) {
  const decodedSlug = decodeURIComponent(slug)
  
  // Check if it's a direct article ID match first
  if (contentConfig.blog.articles[decodedSlug as keyof typeof contentConfig.blog.articles]) {
    return contentConfig.blog.articles[decodedSlug as keyof typeof contentConfig.blog.articles]
  }
  
  // Search by Thai title match
  const articles = Object.values(contentConfig.blog.articles)
  const foundArticle = articles.find(article => 
    article.title.thai === decodedSlug || 
    encodeURIComponent(article.title.thai) === slug
  )
  
  return foundArticle || null
}

// Generate metadata for the article page
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  
  if (!article) {
    return {
      title: 'Article Not Found - ROIHIN STONE & BRACELET',
      description: 'The requested article could not be found.'
    }
  }

  const title = `${article.title.english} | ${siteConfig.name}`
  const description = article.excerpt.english
  const url = `${siteConfig.url}/blog/${encodeURIComponent(article.title.thai)}`
  
  return {
    title,
    description,
    keywords: [
      ...article.tags,
      'stone healing',
      'crystal therapy',
      'natural stones',
      'ROIHIN',
      'พลังหิน',
      'การรักษาด้วยหิน'
    ],
    authors: [{ name: article.author.name }],
    openGraph: {
      title: article.title.english,
      description,
      type: 'article',
      publishedTime: article.date,
      authors: [article.author.name],
      url,
      images: [
        {
          url: article.image,
          width: 1200,
          height: 630,
          alt: article.title.english,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title.english,
      description,
      images: [article.image],
    },
    alternates: {
      canonical: url,
    },
  }
}

// Generate static params for known articles (optional - for static generation)
export async function generateStaticParams() {
  const articles = Object.values(contentConfig.blog.articles)
  
  return articles.map((article) => ({
    slug: article.id, // Use article ID instead of Thai title for static generation
  }))
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  
  if (!article) {
    notFound()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const thaiOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    const englishOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }

    return {
      thai: date.toLocaleDateString('th-TH', thaiOptions),
      english: date.toLocaleDateString('en-US', englishOptions),
    }
  }

  const formattedDate = formatDate(article.date)
  const currentUrl = `${siteConfig.url}/blog/${article.id}`

  // Breadcrumb items
  const breadcrumbItems = [
    {
      label: {
        thai: 'หน้าแรก',
        english: 'Home'
      },
      href: '/'
    },
    {
      label: {
        thai: 'บล็อก',
        english: 'Blog'
      },
      href: '/blog'
    },
    {
      label: {
        thai: article.title.thai,
        english: article.title.english
      }
    }
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
              src={article.image}
              alt={article.title.english}
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
                <BilingualText
                  thai={article.title.thai}
                  english={article.title.english}
                  variant="h2"
                  thaiClassName="font-thai text-3xl lg:text-5xl font-bold mb-4 drop-shadow-lg"
                  englishClassName="font-playfair text-3xl lg:text-5xl font-bold mb-4 drop-shadow-lg tracking-wider"
                  gap="sm"
                />
                
                {/* Article Meta */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-200">
                  <BilingualText
                    thai={formattedDate.thai}
                    english={formattedDate.english}
                    variant="caption"
                    thaiClassName="font-thai"
                    englishClassName=""
                    layout="horizontal"
                    gap="sm"
                  />
                  <span className="text-gray-400">•</span>
                  <span>{article.readTime} min read</span>
                  <span className="text-gray-400">•</span>
                  <BilingualText
                    thai={article.category.thai}
                    english={article.category.english}
                    variant="caption"
                    thaiClassName="font-thai text-[#D4AF37]"
                    englishClassName="text-[#D4AF37]"
                    layout="horizontal"
                    gap="sm"
                  />
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

              {/* Article Excerpt */}
              <div className="mb-8 p-6 bg-gray-50 rounded-lg border-l-4 border-[#D4AF37]">
                <BilingualText
                  thai={article.excerpt.thai}
                  english={article.excerpt.english}
                  variant="body"
                  thaiClassName="font-thai text-gray-700 text-lg leading-8"
                  englishClassName="text-gray-700 text-lg leading-8"
                  gap="md"
                />
              </div>

              {/* Article Content */}
              <article className="prose prose-lg max-w-none">
                <div className="bilingual-content">
                  {/* Thai Content */}
                  <div 
                    className="thai-content font-thai text-gray-800 leading-8 mb-8 [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:text-[#006039] [&_h3]:mt-8 [&_h3]:mb-4 [&_h4]:text-xl [&_h4]:font-semibold [&_h4]:text-[#006039] [&_h4]:mt-6 [&_h4]:mb-3 [&_p]:mb-4 [&_p]:leading-8 [&_ul]:list-disc [&_ul]:list-inside [&_ul]:mb-4 [&_ul]:space-y-2 [&_li]:leading-7 [&_strong]:font-semibold [&_strong]:text-[#006039]"
                    dangerouslySetInnerHTML={{ __html: article.content.thai }}
                  />
                  
                  {/* English Content */}
                  <div 
                    className="english-content text-gray-800 leading-8 [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:text-[#006039] [&_h3]:mt-8 [&_h3]:mb-4 [&_h4]:text-xl [&_h4]:font-semibold [&_h4]:text-[#006039] [&_h4]:mt-6 [&_h4]:mb-3 [&_p]:mb-4 [&_p]:leading-8 [&_ul]:list-disc [&_ul]:list-inside [&_ul]:mb-4 [&_ul]:space-y-2 [&_li]:leading-7 [&_strong]:font-semibold [&_strong]:text-[#006039]"
                    dangerouslySetInnerHTML={{ __html: article.content.english }}
                  />
                </div>
              </article>

              {/* Article Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <Typography variant="h4" className="text-[#006039] mb-4">
                    Tags
                  </Typography>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Author Info */}
              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#006039] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {article.author.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <Typography variant="h4" className="text-gray-900 mb-1">
                      {article.author.name}
                    </Typography>
                    <BilingualText
                      thai={article.author.bio.thai}
                      english={article.author.bio.english}
                      variant="caption"
                      thaiClassName="font-thai text-gray-600"
                      englishClassName="text-gray-600"
                      gap="sm"
                    />
                  </div>
                </div>
              </div>

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

        {/* Related Articles */}
        <RelatedArticles
          articles={Object.values(contentConfig.blog.articles)}
          currentArticleId={article.id}
        />
      </main>

      <Footer />
      <ChatWidget />
    </div>
  )
}