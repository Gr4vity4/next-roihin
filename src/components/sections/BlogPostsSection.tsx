'use client'

import type {
  BlogCategoriesResponse,
  BlogCategory,
  BlogPost,
  BlogPostsResponse,
} from '@/lib/types/wordpress'
import { formatThaiDate } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Button from '../Button'
import { Container, Typography } from '../ui'

interface BlogPostsSectionProps {
  title: {
    thai: string
  }
  subtitle: {
    thai: string
  }
  loadMoreButton: {
    text: {
      thai: string
    }
    variant: 'primary' | 'gold' | 'green' | 'outline' | 'ghost'
  }
  className?: string
}

function BlogPostCard({ post }: { post: BlogPost }) {
  const formattedDate = formatThaiDate(post.date)

  return (
    <Link href={`/blog/${post.title.thai}`} className="group">
      <article className="bg-white shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]">
        {/* Post Image */}
        <div className="relative w-full h-48">
          <Image
            src={post.image}
            alt={post.title.thai}
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
              {formattedDate}
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
  loadMoreButton,
  className = '',
}: BlogPostsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState<number | undefined>(undefined)

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/blog/categories')
        if (!response.ok) throw new Error('Failed to fetch categories')

        const data: BlogCategoriesResponse = await response.json()
        setCategories(data.categories)
      } catch (err) {
        console.error('Error fetching categories:', err)
        // Set fallback categories
        setCategories([
          {
            id: 'all',
            name: {
              english: 'All Articles',
              thai: 'บทความทั้งหมด',
            },
          },
        ])
      }
    }

    fetchCategories()
  }, [])

  // Fetch posts when category or page changes
  useEffect(() => {
    const fetchPosts = async (reset = false) => {
      try {
        if (reset) {
          setLoading(true)
          setPosts([])
          setCurrentPage(1)
        } else {
          setLoadingMore(true)
        }

        const params = new URLSearchParams({
          page: reset ? '1' : currentPage.toString(),
          per_page: '6',
        })

        if (selectedCategory !== 'all') {
          params.append('categories', selectedCategory)
        }

        const response = await fetch(`/api/blog/posts?${params.toString()}`)
        if (!response.ok) throw new Error('Failed to fetch posts')

        const data: BlogPostsResponse = await response.json()

        if (reset) {
          setPosts(data.posts)
        } else {
          setPosts((prev) => [...prev, ...data.posts])
        }

        setTotalPages(data.totalPages)
        setError(null)
      } catch (err) {
        console.error('Error fetching posts:', err)
        setError('Unable to load posts. Please try again later.')
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    }

    fetchPosts(currentPage === 1)
  }, [selectedCategory, currentPage])

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setCurrentPage(1)
  }

  const handleLoadMore = () => {
    setCurrentPage((prev) => prev + 1)
  }

  const hasMorePosts = totalPages ? currentPage < totalPages : false

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
              onClick={() => handleCategoryChange(category.id)}
              disabled={loading}
              className={`px-4 py-2 text-sm font-medium transition-all duration-300 shadow-sm border ${
                selectedCategory === category.id
                  ? 'bg-[#006039] text-white border-[#006039] shadow-md hover:bg-[#004D2E]'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
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

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <Typography variant="body" className="text-red-600 mb-4">
              {error}
            </Typography>
            <Button variant="outline" onClick={() => window.location.reload()}>
              <Typography variant="body" fontFamily="thai">
                ลองอีกครั้ง
              </Typography>
            </Button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white shadow-md overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-gray-300" />
                <div className="p-6">
                  <div className="h-6 bg-gray-300 rounded mb-2" />
                  <div className="h-4 bg-gray-300 rounded mb-1" />
                  <div className="h-4 bg-gray-300 rounded mb-4" />
                  <div className="h-3 bg-gray-300 rounded w-20" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Blog Posts Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {posts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {!loading && !error && hasMorePosts && (
          <div className="text-center">
            <Button
              variant={loadMoreButton.variant}
              size="lg"
              onClick={handleLoadMore}
              disabled={loadingMore}
            >
              <Typography variant="body" fontFamily="thai">
                {loadingMore ? 'กำลังโหลด...' : loadMoreButton.text.thai}
              </Typography>
            </Button>
          </div>
        )}

        {/* No Posts Message */}
        {!loading && !error && posts.length === 0 && (
          <div className="text-center py-12">
            <Typography variant="body" fontFamily="thai" className="text-gray-500">
              ไม่พบบทความในหมวดหมู่นี้
            </Typography>
          </div>
        )}
      </Container>
    </section>
  )
}
