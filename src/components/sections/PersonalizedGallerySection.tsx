import Image from 'next/image'
import { Container, Typography } from '../ui'

export interface GalleryItem {
  id: string
  src: string
  alt: string
  title?: string
}

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
  galleryItems?: GalleryItem[]
}

// Sample gallery data for demonstration
const defaultGalleryItems: GalleryItem[] = [
  {
    id: 'bracelet-1',
    src: '/images/home-page/1.png',
    alt: 'Personalized stone bracelet design 1',
    title: 'เสริมดวงความรัก',
  },
  {
    id: 'bracelet-2',
    src: '/images/home-page/2.png',
    alt: 'Personalized stone bracelet design 2',
    title: 'เสริมดวงการงาน',
  },
  {
    id: 'bracelet-3',
    src: '/images/home-page/3.png',
    alt: 'Personalized stone bracelet design 3',
    title: 'เสริมดวงการเงิน',
  },
  {
    id: 'bracelet-4',
    src: '/images/home-page/4.png',
    alt: 'Personalized stone bracelet design 4',
    title: 'เสริมดวงสุขภาพ',
  },
  {
    id: 'bracelet-5',
    src: '/images/home-page/5.png',
    alt: 'Personalized stone bracelet design 5',
    title: 'เสริมพลังจิตวิญญาณ',
  },
  {
    id: 'bracelet-6',
    src: '/images/home-page/6.png',
    alt: 'Personalized stone bracelet design 6',
    title: 'เสริมดวงโชคลาภ',
  },
  {
    id: 'bracelet-7',
    src: '/images/home-page/7.png',
    alt: 'Personalized stone bracelet design 7',
    title: 'เสริมความมั่นใจ',
  },
  {
    id: 'bracelet-8',
    src: '/images/home-page/8.png',
    alt: 'Personalized stone bracelet design 8',
    title: 'เสริมดวงความสำเร็จ',
  },
  {
    id: 'bracelet-9',
    src: '/images/home-page/9.png',
    alt: 'Personalized stone bracelet design 9',
    title: 'เสริมดวงสัมพันธ์',
  },
  {
    id: 'bracelet-10',
    src: '/images/home-page/10.png',
    alt: 'Personalized stone bracelet design 10',
    title: 'เสริมพลังป้องกัน',
  },
]

export default function PersonalizedGallerySection({
  title,
  subtitle,
  cta,
  galleryItems = defaultGalleryItems,
}: PersonalizedGallerySectionProps) {
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-gray-50">
      <Container padding="lg">
        <div className="max-w-4xl mx-auto text-center">
          {/* Title Section */}
          <Typography variant="h2" fontFamily="mixed-lang" align="center" className="mb-6">
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
              ${
                cta.variant === 'primary'
                  ? 'bg-[#006039] text-white hover:bg-[#004d2e] border-2 border-[#006039] hover:border-[#004d2e]'
                  : cta.variant === 'gold'
                  ? 'bg-[#D4AF37] text-black hover:bg-[#c1a030] border-2 border-[#D4AF37] hover:border-[#c1a030]'
                  : 'bg-transparent text-[#006039] border-2 border-[#006039] hover:bg-[#006039] hover:text-white'
              }
            `}
          >
            {cta.text}
          </button>

        </div>
      </Container>
      
      {/* Full-width Gallery Section */}
      <div className="mt-12 sm:mt-16">
        <div className="w-full">
          {/* Desktop: 2x5 grid, Tablet: 3-column, Mobile: 2-column */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1 sm:gap-2 lg:gap-3">
            {galleryItems.map((item, index) => (
              <div
                key={item.id}
                className="group relative aspect-[4/3] overflow-hidden bg-gray-100 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  // Priority loading for first 6 images (visible above fold)
                  priority={index < 6}
                  // Lazy loading for remaining images
                  loading={index >= 6 ? 'lazy' : undefined}
                  // Add placeholder for smooth loading
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyEcVV5DIbTlleEfLDb8TvK1z/2Q=="
                />
                
                {/* Overlay with title on hover */}
                {item.title && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Typography
                      variant="body"
                      fontFamily="thai"
                      className="text-white text-center px-2 text-sm sm:text-base"
                    >
                      {item.title}
                    </Typography>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
