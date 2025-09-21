interface AboutContentSectionProps {
  title: {
    english: string
    thai: string
  }
  subtitle: {
    thai: string
  }
  content: {
    english: string[]
    thai: string[]
  }
}

export default function AboutContentSection({
  title,
  subtitle,
  content,
}: AboutContentSectionProps) {
  return (
    <section className="py-16 md:py-24 bg-[#FCFCFC]">
      <div className="max-w-5xl mx-auto px-6 md:px-8">
        {/* Title Section */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4">
            <span className="font-light">{title.english}</span>{' '}
            <span className="text-[#2A5F3E] font-medium">{title.thai}</span>
          </h2>

          <p className="text-lg md:text-xl text-gray-600 mt-4">
            {subtitle.thai}
          </p>
        </div>

        {/* Content Section - Single Column */}
        <div className="space-y-8 md:space-y-10">
          {/* Combined Content */}
          <div className="space-y-6">
            {content.thai.map((paragraph, index) => (
              <p
                key={`content-${index}`}
                className="text-gray-700 leading-relaxed text-base md:text-lg text-center"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
