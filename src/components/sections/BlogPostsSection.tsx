'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import Button from '../Button'
import { Container, Typography } from '../ui'

interface BlogPost {
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

interface Category {
  id: string
  name: {
    english: string
    thai: string
  }
}

interface BlogPostsSectionProps {
  title: {
    thai: string
  }
  subtitle: {
    thai: string
  }
  posts: BlogPost[]
  categories: Category[]
  loadMoreButton: {
    text: {
      thai: string
    }
    variant: 'primary' | 'gold' | 'green' | 'outline' | 'ghost'
  }
  className?: string
}

function BlogPostCard({ post }: { post: BlogPost }) {
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

  const formattedDate = formatDate(post.date)
  // Use article ID as slug for consistency with static generation
  const slug = post.id

  return (
    <Link href={`/blog/${slug}`} className="group">
      <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]">
        {/* Post Image */}
        <div className="relative w-full h-48">
          <Image
            src={post.image}
            alt={post.title.english}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Post Content */}
        <div className="p-6">
          {/* Post Title */}
          <Typography
            variant="h4"
            fontFamily="thai"
            className="mb-2 text-gray-900 group-hover:text-[#006039] transition-colors line-clamp-2"
          >
            {post.title.thai}
          </Typography>

          {/* Post Excerpt */}
          <Typography
            variant="body"
            fontFamily="thai"
            className="text-gray-600 text-sm line-clamp-3 mb-4"
          >
            {post.excerpt.thai}
          </Typography>

          {/* Post Date */}
          <div className="pt-4 border-t border-gray-100">
            <Typography variant="caption" fontFamily="thai" className="text-gray-500">
              {formattedDate.thai}
            </Typography>
          </div>
        </div>
      </article>
    </Link>
  )
}

export default function BlogPostsSection({
  title,
  subtitle,
  posts,
  categories,
  loadMoreButton,
  className = '',
}: BlogPostsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [visiblePosts, setVisiblePosts] = useState(6)

  const filteredPosts =
    selectedCategory === 'all'
      ? posts
      : posts.filter((post) => {
          const categoryId = post.category.english
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace('&', '')
            .trim()
          return categoryId === selectedCategory
        })

  const displayedPosts = filteredPosts.slice(0, visiblePosts)
  const hasMorePosts = filteredPosts.length > visiblePosts

  const handleLoadMore = () => {
    setVisiblePosts((prev) => prev + 6)
  }

  return (
    <section className={`py-16 bg-gray-50 ${className}`}>
      <Container>
        {/* Section Header */}
        <div className="text-center mb-12">
          <Typography variant="h2" fontFamily="thai" className="text-[#006039] mb-4">
            {title.thai}
          </Typography>
          <Typography variant="body" fontFamily="thai" className="text-gray-600 max-w-2xl mx-auto">
            {subtitle.thai}
          </Typography>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.id)
                setVisiblePosts(6)
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 shadow-sm border ${
                selectedCategory === category.id
                  ? 'bg-[#006039] text-white border-[#006039] shadow-md hover:bg-[#004D2E]'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              <Typography
                variant="caption"
                fontFamily="thai"
                className={selectedCategory === category.id ? 'text-white' : 'text-gray-600'}
              >
                {category.name.thai}
              </Typography>
            </button>
          ))}
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {displayedPosts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>

        {/* Load More Button */}
        {hasMorePosts && (
          <div className="text-center">
            <Button variant={loadMoreButton.variant} size="lg" onClick={handleLoadMore}>
              <Typography variant="body" fontFamily="thai">
                {loadMoreButton.text.thai}
              </Typography>
            </Button>
          </div>
        )}

        {/* No Posts Message */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <Typography variant="body" className="text-gray-500">
              No articles found in this category.
            </Typography>
          </div>
        )}
      </Container>
    </section>
  )
}
