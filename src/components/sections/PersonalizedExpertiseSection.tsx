import { Container, Typography } from '../ui'

interface PersonalizedExpertiseSectionProps {
  content: {
    thai: string[]
  }
}

export default function PersonalizedExpertiseSection({
  content,
}: PersonalizedExpertiseSectionProps) {
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-white">
      <Container padding="lg">
        <div className="max-w-4xl mx-auto">
          {/* Content Section */}
          <div className="space-y-6 sm:space-y-8 md:space-y-10">
            {content.thai.map((paragraph, index) => {
              // Handle empty paragraphs as spacing
              if (paragraph.trim() === '') {
                return <div key={`spacing-${index}`} className="h-4" />
              }

              return (
                <Typography
                  key={`expertise-${index}`}
                  variant="body"
                  fontFamily="mixed-lang"
                  className="text-gray-700 leading-relaxed text-justify"
                >
                  {paragraph}
                </Typography>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  )
}