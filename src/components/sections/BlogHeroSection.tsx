import Image from 'next/image'
import { Container, Typography } from '../ui'

interface BlogHeroSectionProps {
  backgroundImage: string
  title: string
  subtitle: string
  className?: string
}

export default function BlogHeroSection({
  backgroundImage,
  title,
  subtitle,
  className = '',
}: BlogHeroSectionProps) {
  return (
    <section className={`relative w-full pt-20 min-[1408px]:pt-[230px] ${className}`}>
      {/* Background Image */}
      <div className="relative w-full h-[400px] lg:h-[500px]">
        <Image
          src={backgroundImage}
          alt={title}
          fill
          className="object-cover"
          priority
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Container className="text-center text-white">
            <Typography variant="h2" className="mb-2">
              {title}
            </Typography>
            <div className="mt-6 max-w-2xl mx-auto">
              <Typography variant="body" className="text-gray-200">
                {subtitle}
              </Typography>
            </div>
          </Container>
        </div>
      </div>
    </section>
  )
}
