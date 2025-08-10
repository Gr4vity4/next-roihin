import { Suspense } from 'react'
import { Typography } from '@/components/ui'
import Image from 'next/image'
import { getTestimonials } from '@/lib/api/testimonials'

// Loading component
function TestimonialsLoading() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="bg-white/5 backdrop-blur-sm rounded-lg p-6 animate-pulse">
          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-gray-700"></div>
            </div>
            <div className="flex-1">
              <div className="mb-3">
                <div className="h-3 bg-gray-700 rounded w-24"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                <div className="h-4 bg-gray-700 rounded w-4/6"></div>
              </div>
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
    <div className="max-w-4xl mx-auto text-center">
      <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
        <Typography variant="h3" className="text-red-400 mb-2">
          เกิดข้อผิดพลาด
        </Typography>
        <Typography variant="body" className="text-red-300">
          ไม่สามารถโหลดรีวิวได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง
        </Typography>
        <Typography variant="caption" className="text-red-400 mt-2 block">
          {error}
        </Typography>
      </div>
    </div>
  )
}

// Main testimonials component
async function TestimonialsContent() {
  try {
    const testimonials = await getTestimonials('th')
    
    if (!testimonials || testimonials.length === 0) {
      return (
        <div className="max-w-4xl mx-auto text-center">
          <Typography variant="body" className="text-gray-400">
            ยังไม่มีรีวิวในขณะนี้
          </Typography>
        </div>
      )
    }

    return (
      <div className="space-y-8 max-w-4xl mx-auto">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
            <div className="flex gap-6 items-start">
              {/* Avatar section */}
              <div className="flex-shrink-0">
                <div className="relative w-16 h-16 rounded-full overflow-hidden">
                  <Image
                    src={testimonial.avatar}
                    alt={`Customer review ${testimonial.id}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Message section */}
              <div className="flex-1">
                {/* Date */}
                <div className="mb-3">
                  <Typography variant="caption" className="text-gray-400 text-xs">
                    {testimonial.date}
                  </Typography>
                </div>

                <Typography
                  variant="body"
                  fontFamily="mixed-lang"
                  className="text-gray-300 leading-relaxed"
                >
                  &ldquo;{testimonial.message}&rdquo;
                </Typography>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  } catch (error) {
    console.error('Error loading testimonials:', error)
    return <TestimonialsError error={error instanceof Error ? error.message : 'Unknown error'} />
  }
}

// Main container component with suspense
export default function TestimonialsContainer() {
  return (
    <Suspense fallback={<TestimonialsLoading />}>
      <TestimonialsContent />
    </Suspense>
  )
}