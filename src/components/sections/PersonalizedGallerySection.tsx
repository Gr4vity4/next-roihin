import { Container, Typography } from '../ui'

interface PersonalizedGallerySectionProps {
  title: {
    english: string
    highlight: string
  }
  subtitle: {
    thai: string
  }
  cta: {
    text: string
    variant: 'primary' | 'secondary' | 'gold'
  }
}

export default function PersonalizedGallerySection({
  title,
  subtitle,
  cta,
}: PersonalizedGallerySectionProps) {
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-gray-50">
      <Container padding="lg">
        <div className="max-w-4xl mx-auto text-center">
          {/* Title Section */}
          <Typography 
            variant="h2" 
            fontFamily="playfair" 
            align="center" 
            className="mb-6"
          >
            <span className="text-gray-800">{title.english}</span>
            <br />
            <span className="text-black font-bold">{title.highlight}</span>
          </Typography>

          <Typography
            variant="h3"
            fontFamily="thai"
            align="center"
            color="primary"
            className="mb-8 sm:mb-12"
          >
            {subtitle.thai}
          </Typography>

          {/* CTA Button */}
          <button 
            className={`
              px-8 py-3 font-thai font-medium text-lg transition-all duration-300 rounded-sm
              ${cta.variant === 'primary' 
                ? 'bg-[#006039] text-white hover:bg-[#004d2e] border-2 border-[#006039] hover:border-[#004d2e]' 
                : cta.variant === 'gold'
                ? 'bg-[#D4AF37] text-black hover:bg-[#c1a030] border-2 border-[#D4AF37] hover:border-[#c1a030]'
                : 'bg-transparent text-[#006039] border-2 border-[#006039] hover:bg-[#006039] hover:text-white'
              }
            `}
          >
            {cta.text}
          </button>

          {/* Gallery Placeholder - Based on the original site, this would have a dynamic gallery */}
          <div className="mt-12 sm:mt-16">
            <div className="h-64 sm:h-80 md:h-96 bg-gray-200 rounded-lg flex items-center justify-center">
              <Typography
                variant="body"
                color="text-gray-500"
                className="font-thai"
              >
                ผลงานออกแบบกำไลหินเฉพาะบุคคล
              </Typography>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}