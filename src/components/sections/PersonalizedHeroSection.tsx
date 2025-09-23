import Image from 'next/image'
import { Typography } from '../ui'

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
    <section className="relative h-[40vh] md:h-[70vh] w-full overflow-hidden pt-24 lg:pt-[280px]">
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
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full container max-w-5xl mx-auto">
        <div className="px-6 sm:px-8 md:px-12 lg:px-4 max-w-4xl">
          {/* Title */}
          <Typography
            variant="h1"
            textShadow
            color="text-white"
            // align="center"
            className="tracking-wider leading-tight font-normal"
          >
            {title}
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="h3"
            textShadow
            color="text-white"
            // align="center"
            className="max-w-3xl mx-auto leading-relaxed tracking-wide font-normal text-lg md:text-2xl"
          >
            {subtitle}
          </Typography>
        </div>
      </div>
    </section>
  )
}
