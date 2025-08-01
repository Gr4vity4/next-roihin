import Image from 'next/image'
import Link from 'next/link'
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

function RelatedArticleCard({ article }: { article: RelatedArticle }) {
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
  // Use article ID as slug
  const slug = article.id

  return (
    <Link href={`/blog/${slug}`} className="group">
      <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]">
        {/* Article Image */}
        <div className="relative w-full h-48">
          <Image
            src={article.image}
            alt={article.title.thai}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Article Content */}
        <div className="p-6">
          {/* Article Title */}
          <Typography
            variant="h4"
            fontFamily="thai"
            className="mb-2 text-gray-900 group-hover:text-[#006039] transition-colors line-clamp-2"
          >
            {article.title.thai}
          </Typography>

          {/* Article Excerpt */}
          <Typography
            variant="body"
            fontFamily="thai"
            className="text-gray-600 text-sm line-clamp-3 mb-4"
          >
            {article.excerpt.thai}
          </Typography>

          {/* Article Meta */}
          <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
            <Typography variant="caption" fontFamily="thai" className="text-gray-500">
              {formattedDate.thai}
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
          <Typography variant="h3" fontFamily="thai" className="text-[#006039] mb-2">
            บทความที่เกี่ยวข้อง
          </Typography>
          <Typography variant="body" fontFamily="thai" className="text-gray-600">
            เรียนรู้เพิ่มเติมเกี่ยวกับพลังงานหิน
          </Typography>
        </div>

        {/* Related Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {relatedArticles.map((article) => (
            <RelatedArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  )
}
