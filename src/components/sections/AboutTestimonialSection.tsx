import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

interface AboutTestimonialSectionProps {
  locale: string
}

export default async function AboutTestimonialSection({ locale }: AboutTestimonialSectionProps) {
  const t = await getTranslations({ locale, namespace: 'aboutPage.testimonial' })

  const testimonial = {
    quote: t('quote'),
    author: t('author'),
    role: t('role'),
    additionalText: t('additionalText'),
  }

  const profileImage = '/images/about/profile.avif'

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-5xl mx-auto px-6 md:px-8">
        <div className="text-center">
          {/* Profile Image */}
          <div className="relative w-48 h-48 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-[#cb9e51]/20" />
            <Image
              src={profileImage}
              alt={testimonial.author}
              fill
              className="object-cover rounded-full"
              sizes="192px"
            />
          </div>

          {/* Quote */}
          <div className="max-w-3xl mx-auto mb-8">
            <p className="text-lg md:text-xl lg:text-xl text-gray-700 leading-relaxed italic">
              {testimonial.quote}
            </p>
          </div>

          {/* Additional Text */}
          {testimonial.additionalText && (
            <div className="max-w-3xl mx-auto mb-8">
              <p className="text-base md:text-xl italic text-gray-600 leading-relaxed">
                {testimonial.additionalText}
              </p>
            </div>
          )}

          {/* Author */}
          <div className="mt-8">
            <p className="text-xl md:text-2xl font-medium text-gray-800">
              - {testimonial.author} -
            </p>
            {testimonial.role && <p className="text-lg text-gray-600 mt-2">{testimonial.role}</p>}
          </div>
        </div>
      </div>
    </section>
  )
}