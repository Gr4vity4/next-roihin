import { Typography } from '../ui'
import BaseHeroSection from './BaseHeroSection'

interface PersonalizedHeroSectionProps {
  backgroundImage: string
  title: string
  subtitle: string
}

export default function PersonalizedHeroSection({
  backgroundImage,
  title,
  subtitle,
}: PersonalizedHeroSectionProps) {
  return (
    <BaseHeroSection
      backgroundImage={backgroundImage}
      backgroundAlt="Personalized Stone Bracelet Hero Background"
      overlayOpacity={0.1}
    >
      <div className="container flex justify-center items-center md:items-start mx-auto">
        <div className="px-6 sm:px-8 md:px-12 lg:px-4 max-w-4xl">
          {/* Title */}
          <Typography
            variant="h1"
            textShadow
            color="text-white"
            className="tracking-wider leading-tight font-normal"
          >
            {title}
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="h3"
            textShadow
            color="text-white"
            className="max-w-3xl mx-auto leading-relaxed tracking-wide font-normal text-lg md:text-2xl"
          >
            {subtitle}
          </Typography>
        </div>
      </div>
    </BaseHeroSection>
  )
}
