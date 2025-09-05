'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Typography } from '@/components/ui'
import Image from 'next/image'
import type { Testimonial } from '@/lib/types/wordpress-settings'

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

export default function TestimonialsClient() {
  const { language } = useLanguage()
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTestimonials() {
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`/api/testimonials?lang=${language}`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch testimonials: ${response.status}`)
        }
        
        const data = await response.json()
        setTestimonials(data.testimonials || [])
      } catch (err) {
        console.error('Error fetching testimonials:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchTestimonials()
  }, [language])

  if (loading) {
    return <TestimonialsLoading />
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
    <div className="space-y-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {testimonials.map((testimonial) => (
        <div key={testimonial.id} className="bg-white/5 backdrop-blur-sm rounded-lg p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            {/* Left side: Avatar and Message */}
            <div className="flex gap-4 lg:gap-6 items-start flex-1">
              {/* Avatar section */}
              <div className="flex-shrink-0">
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full overflow-hidden">
                  <Image
                    src={testimonial.avatar}
                    alt={`Customer review ${testimonial.id}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Message section */}
              <div className="flex-1 min-w-0">
                {/* Date */}
                <div className="mb-2 lg:mb-3">
                  <Typography variant="caption" className="text-gray-400 text-xs">
                    {testimonial.date}
                  </Typography>
                </div>

                <Typography
                  variant="body"
                  className="text-gray-300 leading-relaxed text-sm sm:text-base break-words"
                >
                  &ldquo;{testimonial.message}&rdquo;
                </Typography>
              </div>
            </div>

            {/* Bottom/Right side: Review Image */}
            {testimonial.reviewImage && (
              <div className="flex-shrink-0 w-full lg:w-auto">
                <div className="relative w-full lg:w-48 h-48 sm:h-56 lg:h-32 rounded-lg overflow-hidden bg-gray-800">
                  <Image
                    src={testimonial.reviewImage}
                    alt={`Review image for ${testimonial.id}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}