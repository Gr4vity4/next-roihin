import Image from 'next/image'

interface AboutTestimonialSectionProps {
  testimonial: {
    quote: string
    author: string
    role: string
    additionalText?: string
  }
  profileImage: string
}

export default function AboutTestimonialSection({
  testimonial,
  profileImage,
}: AboutTestimonialSectionProps) {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-5xl mx-auto px-6 md:px-8">
        <div className="text-center">
          {/* Quote marks */}
          {/* <div className="text-[#2A5F3E] text-6xl md:text-8xl font-serif mb-8">"</div> */}

          {/* Profile Image */}
          <div className="relative w-48 h-48 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-[#D4AF37]/20" />
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
            <p className="text-lg md:text-xl lg:text-2xl text-gray-700 leading-relaxed italic">
              {testimonial.quote}
            </p>
          </div>

          {/* Additional Text */}
          {testimonial.additionalText && (
            <div className="max-w-3xl mx-auto mb-8">
              <p className="text-base md:text-lg text-gray-600 leading-relaxed">
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
