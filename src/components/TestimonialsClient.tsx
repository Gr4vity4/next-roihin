'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale } from 'next-intl'
import { Typography } from '@/components/ui'
import TestimonialReviewCard from '@/components/TestimonialReviewCard'
import type { Testimonial, TestimonialsPagination } from '@/lib/types/testimonials'

const PER_PAGE = 20

// Loading component
function TestimonialsLoading() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="bg-white/5 backdrop-blur-sm rounded-lg p-4 sm:p-6 animate-pulse">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            <div className="flex gap-4 lg:gap-6 items-start flex-1">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-gray-700"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="mb-2 lg:mb-3">
                  <div className="h-3 bg-gray-700 rounded w-24"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-700 rounded w-4/6"></div>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0 w-full lg:w-auto">
              <div className="w-full lg:w-48 h-48 sm:h-56 lg:h-32 rounded-lg bg-gray-700"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Error component
function TestimonialsError({ error }: { error: string }) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 sm:p-6">
        <Typography variant="h3" className="text-red-400 mb-2 text-lg sm:text-xl lg:text-2xl">
          เกิดข้อผิดพลาด
        </Typography>
        <Typography variant="body" className="text-red-300 text-sm sm:text-base">
          ไม่สามารถโหลดรีวิวได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง
        </Typography>
        <Typography variant="caption" className="text-red-400 mt-2 block text-xs sm:text-sm">
          {error}
        </Typography>
      </div>
    </div>
  )
}

// Build the list of page buttons, collapsing long runs into ellipses
// (e.g. 1 … 4 5 6 … 12)
function buildPageList(current: number, total: number): (number | '…')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages: (number | '…')[] = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  if (start > 2) pages.push('…')
  for (let p = start; p <= end; p++) pages.push(p)
  if (end < total - 1) pages.push('…')
  pages.push(total)

  return pages
}

function TestimonialsPaginationControls({
  pagination,
  onPageChange,
  isThai,
}: {
  pagination: TestimonialsPagination
  onPageChange: (page: number) => void
  isThai: boolean
}) {
  const { page, totalPages } = pagination

  if (totalPages <= 1) {
    return null
  }

  const buttonBase =
    'min-w-[2.5rem] h-10 px-3 rounded-md text-sm transition-colors duration-200'

  return (
    <nav
      aria-label={isThai ? 'การแบ่งหน้ารีวิว' : 'Testimonials pagination'}
      className="mt-10 flex flex-wrap items-center justify-center gap-2"
    >
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className={`${buttonBase} bg-white/10 text-gray-300 hover:bg-white/20 disabled:opacity-40 disabled:hover:bg-white/10`}
      >
        {isThai ? 'ก่อนหน้า' : 'Prev'}
      </button>

      {buildPageList(page, totalPages).map((item, index) =>
        item === '…' ? (
          <span key={`ellipsis-${index}`} className="px-1 text-gray-500">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onPageChange(item)}
            aria-current={item === page ? 'page' : undefined}
            className={`${buttonBase} ${
              item === page
                ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className={`${buttonBase} bg-white/10 text-gray-300 hover:bg-white/20 disabled:opacity-40 disabled:hover:bg-white/10`}
      >
        {isThai ? 'ถัดไป' : 'Next'}
      </button>
    </nav>
  )
}

export default function TestimonialsClient() {
  const locale = useLocale() as 'en' | 'th'
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [pagination, setPagination] = useState<TestimonialsPagination | null>(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const listTopRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setPage(1)
  }, [locale])

  useEffect(() => {
    async function fetchTestimonials() {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(
          `/api/testimonials?lang=${locale}&page=${page}&per_page=${PER_PAGE}`,
        )

        if (!response.ok) {
          throw new Error(`Failed to fetch testimonials: ${response.status}`)
        }

        const data = await response.json()
        setTestimonials(data.testimonials || [])
        setPagination(data.pagination || null)
      } catch (err) {
        console.error('Error fetching testimonials:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchTestimonials()
  }, [locale, page])

  const handlePageChange = (nextPage: number) => {
    if (nextPage === page || nextPage < 1 || (pagination && nextPage > pagination.totalPages)) {
      return
    }
    setPage(nextPage)
    listTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  if (loading) {
    return (
      <div ref={listTopRef} className="scroll-mt-28">
        <TestimonialsLoading />
      </div>
    )
  }

  if (error) {
    return <TestimonialsError error={error} />
  }

  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Typography variant="body" className="text-gray-400 text-sm sm:text-base">
          ยังไม่มีรีวิวในขณะนี้
        </Typography>
      </div>
    )
  }

  return (
    <div ref={listTopRef} className="scroll-mt-28 space-y-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {testimonials.map((testimonial) => (
        <TestimonialReviewCard key={testimonial.id} testimonial={testimonial} />
      ))}

      {pagination && (
        <TestimonialsPaginationControls
          pagination={pagination}
          onPageChange={handlePageChange}
          isThai={locale === 'th'}
        />
      )}
    </div>
  )
}
