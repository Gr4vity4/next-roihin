import Image from 'next/image'
import { Container, Typography, BilingualText } from '../ui'

interface BlogHeroSectionProps {
  backgroundImage: string
  title: {
    english: string
    thai: string
  }
  subtitle: {
    thai: string
    english: string
  }
  className?: string
}

export default function BlogHeroSection({
  backgroundImage,
  title,
  subtitle,
  className = '',
}: BlogHeroSectionProps) {
  return (
    <section className={`relative w-full pt-20 lg:pt-[230px] ${className}`}>
      {/* Background Image */}
      <div className="relative w-full h-[400px] lg:h-[500px]">
        <Image
          src={backgroundImage}
          alt="Blog page header"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30" />
        
        {/* Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Container className="text-center text-white">
            <BilingualText
              thai={title.thai}
              english={title.english}
              variant="h2"
              thaiClassName="font-playfair mb-2"
              englishClassName="font-playfair tracking-wider"
              gap="sm"
            />
            <div className="mt-6 max-w-2xl mx-auto">
              <BilingualText
                thai={subtitle.thai}
                english={subtitle.english}
                variant="body"
                thaiClassName="font-thai text-gray-200"
                englishClassName="text-gray-200"
                gap="sm"
              />
            </div>
          </Container>
        </div>
      </div>
    </section>
  )
}