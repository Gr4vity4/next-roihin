import { Metadata } from 'next'
import ChatWidget from '@/components/ChatWidget'
import NavigationWithSuspense from '@/components/NavigationWithSuspense'
import CharmspacerHero from '@/components/sections/CharmspacerHero'
import ProductSection from '@/components/sections/ProductSection'
import { Footer } from '@/components/sections'
import { content } from '@/config/content.config'
import { getAllProducts } from '@/lib/api/products'
import { Product } from '@/lib/types/products'

export const revalidate = 900

export const metadata: Metadata = {
  title: 'ชาร์ม/สเปเซอร์ | Roihin Thailand',
  description: 'ชาร์มและสเปเซอร์เฉพาะตัว จัดทำขึ้นด้วยตำนานและพิธีกรรมโบราณ เพื่อให้เกิดเทวคุณอันเป็นสิริมงคล',
  keywords: 'ชาร์ม, สเปเซอร์, ชาร์มจี้, หินมงคล, ร้อยหิน',
}

export default async function CharmspacerPage() {
  const { charmspacerPage } = content
  
  let products: Product[] = []
  
  try {
    products = await getAllProducts()
  } catch (error) {
    console.error('Failed to fetch products:', error)
    products = []
  }

  // Group products by their category from ACF
  const categoryMap = new Map<string, Product[]>()
  
  products.forEach(product => {
    const categoryName = product.product_category?.name || 'Uncategorized'
    if (!categoryMap.has(categoryName)) {
      categoryMap.set(categoryName, [])
    }
    categoryMap.get(categoryName)?.push(product)
  })

  const productsByCategory = Array.from(categoryMap.entries()).map(([categoryName, categoryProducts]) => ({
    category: {
      slug: categoryName.toLowerCase().replace(/\s+/g, '-'),
      name_en: categoryName,
      name_th: categoryName === 'Lucky Charm' ? 'ชาร์ม' : 
              categoryName === 'Spacer' ? 'ตัวคั่น' : 
              categoryName === 'Pendant' ? 'จี้' : categoryName,
      intro_th: '',
      intro_en: ''
    },
    products: categoryProducts
  }))

  return (
    <>
      <NavigationWithSuspense />

      <main className="min-h-screen">
        <CharmspacerHero
          title={charmspacerPage.hero.title}
          tabs={charmspacerPage.hero.tabs}
          backgroundImage={charmspacerPage.hero.backgroundImage}
        />
        
        <div className="bg-black">
          {productsByCategory.map((section, index) => {
            const productImages = section.products.map(product => ({
              src: product.featured_image_url,
              alt: product.title,
              href: `/charmspacer/product/${product.slug}`,
              title: product.title,
              price: product.acf.color_prices?.[0]?.price
            }))

            return (
              <ProductSection
                key={section.category.slug}
                id={section.category.slug}
                title={section.category.name_th || section.category.name_en}
                description={section.category.intro_th || section.category.intro_en || ''}
                images={productImages}
                className={index === 0 ? '' : index === productsByCategory.length - 1 ? 'pt-24 pb-24' : 'pt-24'}
              />
            )
          })}

          {productsByCategory.length === 0 && (
            <div className="flex items-center justify-center min-h-[400px] text-center px-4">
              <div className="max-w-md">
                <p className="text-gray-400 text-lg">
                  กำลังอัพเดตข้อมูลสินค้า กรุณากลับมาใหม่อีกครั้ง
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Products are being updated. Please check back later.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      <ChatWidget />
    </>
  )
}