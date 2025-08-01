import { Container, Typography } from '../ui'

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

export default function AboutContentSection({ title, subtitle, content }: AboutContentSectionProps) {
  return (
    <section className="py-20 bg-white">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-16">
            <Typography
              variant="h2"
              fontFamily="playfair"
              align="center"
              className="mb-4"
            >
              <span className="text-gray-800">{title.english}</span>{' '}
              <span className="text-black font-bold">{title.thai}</span>
            </Typography>
            
            <Typography
              variant="h4"
              fontFamily="thai"
              align="center"
              color="text-gray-600"
              className="italic"
            >
              {subtitle.thai}
            </Typography>
          </div>

          {/* Content Section - Two Columns */}
          <div className="grid md:grid-cols-2 gap-12">
            {/* English Content */}
            <div className="space-y-6">
              {content.english.map((paragraph, index) => (
                <Typography
                  key={`english-${index}`}
                  variant="body"
                  className="text-gray-700 leading-relaxed"
                  align="justify"
                >
                  {paragraph}
                </Typography>
              ))}
            </div>

            {/* Thai Content */}
            <div className="space-y-6">
              {content.thai.map((paragraph, index) => (
                <Typography
                  key={`thai-${index}`}
                  variant="body"
                  fontFamily="thai"
                  className="text-gray-700 leading-relaxed"
                  align="justify"
                >
                  {paragraph}
                </Typography>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}