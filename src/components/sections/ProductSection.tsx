import { cn } from '@/lib/utils'
import Container from '@/components/ui/Container'
import Typography from '@/components/ui/Typography'
import ProductGallery from '@/components/ui/ProductGallery'
import BilingualText from '@/components/ui/BilingualText'

interface ProductSectionProps {
  id: string
  title: {
    thai: string
    english: string
  }
  description: string
  images: {
    src: string
    alt: string
    href?: string
  }[]
  className?: string
}

export default function ProductSection({ id, title, description, images, className }: ProductSectionProps) {
  return (
    <section id={id} className={cn('py-16 md:py-20', className)}>
      <Container>
        <div className="space-y-8">
          {/* Title */}
          <div className="text-center">
            <BilingualText
              thai={title.thai}
              english={`( ${title.english} )`}
              variant="h3"
              thaiClassName="text-2xl md:text-3xl lg:text-4xl font-playfair text-white mb-2"
              englishClassName="text-xl md:text-2xl lg:text-3xl font-playfair text-gray-400"
            />
          </div>

          {/* Description */}
          <div className="max-w-4xl mx-auto text-center">
            <Typography variant="body" className="text-gray-300 leading-relaxed">
              {description}
            </Typography>
          </div>

          {/* Gallery */}
          <ProductGallery images={images} />
        </div>
      </Container>
    </section>
  )
}