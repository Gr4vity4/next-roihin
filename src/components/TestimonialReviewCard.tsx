import { Typography } from '@/components/ui'
import type { Testimonial } from '@/lib/types/testimonials'
import Image from 'next/image'

interface TestimonialReviewCardProps {
  testimonial: Testimonial
}

export default function TestimonialReviewCard({ testimonial }: TestimonialReviewCardProps) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 sm:p-6">
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
  )
}
