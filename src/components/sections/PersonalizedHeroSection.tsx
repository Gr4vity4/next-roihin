import Image from 'next/image'
import { Typography } from '../ui'

interface PersonalizedHeroSectionProps {
  backgroundImage: string
  title: {
    line1: string
    line2: string
  }
  subtitle: {
    thai: string
    description: string
  }
}

export default function PersonalizedHeroSection({
  backgroundImage,
  title,
  subtitle,
}: PersonalizedHeroSectionProps) {
  return (
    <section className="relative h-screen w-full overflow-hidden pt-20 lg:pt-[230px]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt="Personalized Stone Bracelet Hero Background"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="text-center px-6 sm:px-8 md:px-12 lg:px-4 max-w-4xl">
          {/* Main Title */}
          <Typography
            variant="h1"
            fontFamily="playfair"
            textShadow
            color="text-white"
            align="center"
            className="mb-6 tracking-[0.2em] leading-tight"
          >
            {title.line1}
          </Typography>

          <Typography
            variant="h4"
            fontFamily="playfair"
            textShadow
            color="text-white"
            align="center"
            className="mb-8 tracking-[0.2em] leading-tight"
          >
            {title.line2}
          </Typography>

          {/* Thai Subtitle */}
          <Typography
            variant="h2"
            fontFamily="thai"
            textShadow
            color="highlight"
            align="center"
            className="mb-6 tracking-wider"
          >
            &ldquo;{subtitle.thai}&rdquo;
          </Typography>

          {/* Description */}
          <Typography
            variant="h4"
            fontFamily="thai"
            textShadow
            color="text-white"
            align="center"
            className="max-w-3xl mx-auto leading-relaxed"
          >
            {subtitle.description}
          </Typography>
        </div>
      </div>
    </section>
  )
}
