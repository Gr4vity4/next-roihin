import Link from 'next/link'
import Image from 'next/image'
import Container from '@/components/ui/Container'
import Typography from '@/components/ui/Typography'
import { Product } from '@/lib/types/products'

interface RelatedProductsProps {
  products: Product[]
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  return (
    <section className="py-12 md:py-16 border-t border-gray-800">
      <Container>
        <Typography variant="h2" className="text-2xl md:text-3xl text-white text-center mb-8">
          สินค้าที่เกี่ยวข้อง
        </Typography>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/charmspacer/product/${product.slug}`}
              className="group"
            >
              <div className="space-y-2">
                <div className="relative aspect-square bg-gray-900 overflow-hidden">
                  <Image
                    src={product.featured_image_url}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <div className="text-center space-y-1">
                  <h3 className="text-sm text-white/90 font-medium line-clamp-1 group-hover:text-white transition-colors">
                    {product.title}
                  </h3>
                  {product.acf.color_prices?.[0]?.price && (
                    <p className="text-xs text-gray-400">
                      ฿{product.acf.color_prices[0].price.toLocaleString('th-TH')}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  )
}