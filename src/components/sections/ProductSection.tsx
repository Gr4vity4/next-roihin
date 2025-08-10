import { cn } from '@/lib/utils'
import Container from '@/components/ui/Container'
import Typography from '@/components/ui/Typography'
import ProductGallery from '@/components/ui/ProductGallery'

interface ProductSectionProps {
  id: string
  title: string
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
            <Typography
              variant="h3"
             
              className="text-2xl md:text-3xl lg:text-4xl text-white"
            >
              {title}
            </Typography>
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