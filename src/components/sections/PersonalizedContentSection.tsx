import { Container, Typography } from '../ui'

interface PersonalizedContentSectionProps {
  title: {
    english: string
    highlight: string
  }
  subtitle: {
    thai: string
  }
  content: {
    thai: string[]
  }
}

export default function PersonalizedContentSection({
  title,
  subtitle,
  content,
}: PersonalizedContentSectionProps) {
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-white">
      <Container padding="lg">
        <div className="max-w-5xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <Typography 
              variant="h2" 
              
              align="center" 
              className="mb-6"
            >
              <span className="text-gray-800">{title.english}</span>
              <br />
              <span className="text-black font-bold">{title.highlight}</span>
            </Typography>

            <Typography
              variant="h3"
             
              align="center"
              color="primary"
              className="italic font-medium"
            >
              &ldquo;{subtitle.thai}&rdquo;
            </Typography>
          </div>

          {/* Content Section */}
          <div className="space-y-6 sm:space-y-8 md:space-y-10">
            {content.thai.map((paragraph, index) => {
              // Handle empty paragraphs as spacing
              if (paragraph.trim() === '') {
                return <div key={`spacing-${index}`} className="h-4" />
              }

              return (
                <Typography
                  key={`content-${index}`}
                  variant="body"
                 
                  className="text-gray-700 leading-relaxed text-justify max-w-4xl mx-auto"
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