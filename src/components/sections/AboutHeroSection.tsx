import Image from 'next/image'
import { Typography } from '../ui'

interface AboutHeroSectionProps {
  backgroundImage: string
  title: {
    line1: string
    line2: string
    line3: string
  }
}

export default function AboutHeroSection({ backgroundImage, title }: AboutHeroSectionProps) {
  return (
    <section className="relative h-screen w-full overflow-hidden pt-20 lg:pt-[230px]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt="About ROIHIN Hero Background"
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
        <div className="text-center px-6 sm:px-8 md:px-12 lg:px-4 md:flex md:items-center">
          <Typography
            variant="h3"
           
            textShadow
            color="text-white"
            align="center"
            className="mb-4 tracking-[0.3em] leading-tight"
          >
            {title.line1}
          </Typography>

          <div className="max-w-sm">
            <Typography
              variant="h2"
             
              textShadow
              color="highlight"
              align="center"
              className="mb-4 tracking-[0.2em] leading-tight"
            >
              {title.line2}
            </Typography>
          </div>

          <Typography
            variant="h3"
           
            textShadow
            color="text-white"
            align="center"
            className="tracking-[0.3em] leading-tight"
          >
            {title.line3}
          </Typography>
        </div>
      </div>
    </section>
  )
}
