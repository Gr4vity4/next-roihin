import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { useLocale } from 'next-intl'
import { Typography } from '.'

interface RelatedArticle {
  id: string
  title: {
    english: string
    thai: string
  }
  excerpt: {
    english: string
    thai: string
  }
  image: string
  date: string
  readTime: number
  category: {
    english: string
    thai: string
  }
}

interface RelatedArticlesProps {
  articles: RelatedArticle[]
  currentArticleId: string
  className?: string
}

function RelatedArticleCard({ article, locale }: { article: RelatedArticle; locale: 'th' | 'en' }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }

    return date.toLocaleDateString(locale === 'th' ? 'th-TH' : 'en-US', options)
  }

  const formattedDate = formatDate(article.date)
  // Use article ID as slug
  const slug = article.id
  const title = locale === 'th' ? article.title.thai : article.title.english
  const excerpt = locale === 'th' ? article.excerpt.thai : article.excerpt.english

  return (
    <Link href={`/blog/${slug}`} className="group">
      <article className="bg-white shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]">
        {/* Article Image */}
        <div className="relative w-full h-48">
          <Image
            src={article.image}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Article Content */}
        <div className="p-6">
          {/* Article Title */}
          <Typography
            variant="h4"
           
            className="mb-2 text-gray-900 group-hover:text-[#006039] transition-colors line-clamp-2"
          >
            {title}
          </Typography>

          {/* Article Excerpt */}
          <Typography
            variant="body"
           
            className="text-gray-600 text-sm line-clamp-3 mb-4"
          >
            {excerpt}
          </Typography>

          {/* Article Meta */}
          <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
            <Typography variant="caption" className="text-gray-500">
              {formattedDate}
            </Typography>
          </div>
        </div>
      </article>
    </Link>
  )
}

export default function RelatedArticles({
  articles,
  currentArticleId,
  className = '',
}: RelatedArticlesProps) {
  const locale = useLocale() as 'th' | 'en'
  // Filter out current article and limit to 3 related articles
  const relatedArticles = articles.filter((article) => article.id !== currentArticleId).slice(0, 3)

  if (relatedArticles.length === 0) {
    return null
  }

  return (
    <section className={`py-12 bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8">
          <Typography variant="h3" className="text-[#006039] mb-2">
            {locale === 'th' ? 'บทความที่เกี่ยวข้อง' : 'Related Articles'}
          </Typography>
          <Typography variant="body" className="text-gray-600">
            {locale === 'th'
              ? 'เรียนรู้เพิ่มเติมเกี่ยวกับพลังงานหิน'
              : 'Learn more about crystal energy'}
          </Typography>
        </div>

        {/* Related Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {relatedArticles.map((article) => (
            <RelatedArticleCard key={article.id} article={article} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  )
}
