'use client'

import Image from 'next/image'
import { useState } from 'react'
import Button from '../Button'
import { BilingualText, Container, Typography } from '../ui'

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
    english: string
    thai: string
  }
  subtitle: {
    thai: string
    english: string
  }
  posts: BlogPost[]
  categories: Category[]
  loadMoreButton: {
    text: {
      english: string
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

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Post Image */}
      <div className="relative w-full h-48">
        <Image src={post.image} alt={post.title.english} fill className="object-cover" />
      </div>

      {/* Post Content */}
      <div className="p-6">
        {/* Category and Read Time */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <BilingualText
            thai={post.category.thai}
            english={post.category.english}
            variant="caption"
            thaiClassName="text-[#D4AF37] font-medium"
            englishClassName="text-[#D4AF37] font-medium"
            gap="sm"
          />
          <span className="text-gray-400">{post.readTime} min read</span>
        </div>

        {/* Post Title */}
        <BilingualText
          thai={post.title.thai}
          english={post.title.english}
          variant="h4"
          thaiClassName="font-thai mb-2 text-gray-900 hover:text-[#006039] transition-colors cursor-pointer"
          englishClassName="font-semibold mb-2 text-gray-900 hover:text-[#006039] transition-colors cursor-pointer"
          gap="sm"
        />

        {/* Post Excerpt */}
        <BilingualText
          thai={post.excerpt.thai}
          english={post.excerpt.english}
          variant="body"
          thaiClassName="text-gray-600 font-thai text-sm line-clamp-3"
          englishClassName="text-gray-600 text-sm line-clamp-3"
          gap="sm"
        />

        {/* Post Date */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <BilingualText
            thai={formattedDate.thai}
            english={formattedDate.english}
            variant="caption"
            thaiClassName="text-gray-500 font-thai"
            englishClassName="text-gray-500"
            gap="sm"
          />
        </div>
      </div>
    </article>
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
          <BilingualText
            thai={title.thai}
            english={title.english}
            variant="h2"
            thaiClassName="font-playfair text-[#006039] mb-4"
            englishClassName="font-playfair text-[#006039] mb-4 tracking-wider"
            gap="sm"
          />
          <BilingualText
            thai={subtitle.thai}
            english={subtitle.english}
            variant="body"
            thaiClassName="text-gray-600 font-thai max-w-2xl mx-auto"
            englishClassName="text-gray-600 max-w-2xl mx-auto"
            gap="sm"
          />
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
              <BilingualText
                thai={category.name.thai}
                english={category.name.english}
                variant="caption"
                thaiClassName={`font-thai ${
                  selectedCategory === category.id ? 'text-white' : 'text-gray-600'
                }`}
                englishClassName={selectedCategory === category.id ? 'text-white' : 'text-gray-600'}
                layout="horizontal"
                gap="sm"
              />
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
              <BilingualText
                thai={loadMoreButton.text.thai}
                english={loadMoreButton.text.english}
                variant="body"
                thaiClassName="font-thai"
                layout="horizontal"
                gap="sm"
              />
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
