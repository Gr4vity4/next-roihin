import { Metadata } from 'next'
import ChatWidget from '@/components/ChatWidget'
import Navigation from '@/components/Navigation'
import CharmspacerHero from '@/components/sections/CharmspacerHero'
import ProductSection from '@/components/sections/ProductSection'
import { Footer } from '@/components/sections'
import { content } from '@/config/content.config'
import { getCatalog } from '@/lib/api/products'

export const revalidate = 900

export const metadata: Metadata = {
  title: 'ชาร์ม/สเปเซอร์ | Roihin Thailand',
  description: 'ชาร์มและสเปเซอร์เฉพาะตัว จัดทำขึ้นด้วยตำนานและพิธีกรรมโบราณ เพื่อให้เกิดเทวคุณอันเป็นสิริมงคล',
  keywords: 'ชาร์ม, สเปเซอร์, ชาร์มจี้, หินมงคล, ร้อยหิน',
}

export default async function CharmspacerPage() {
  const { charmspacerPage } = content
  
  let catalogData
  try {
    catalogData = await getCatalog(12)
  } catch (error) {
    console.error('Failed to fetch catalog data:', error)
    catalogData = { sections: [] }
  }

  const sections = catalogData.sections || []

  return (
    <>
      <Navigation />

      <main className="min-h-screen">
        <CharmspacerHero
          title={charmspacerPage.hero.title}
          tabs={charmspacerPage.hero.tabs}
          backgroundImage={charmspacerPage.hero.backgroundImage}
        />
        
        <div className="bg-black">
          {sections.map((section, index) => {
            const products = section.products.map(product => ({
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
                images={products}
                className={index === 0 ? '' : index === sections.length - 1 ? 'pt-24 pb-24' : 'pt-24'}
              />
            )
          })}

          {sections.length === 0 && (
            <>
              <ProductSection
                id={charmspacerPage.sections.charm.id}
                title={charmspacerPage.sections.charm.title}
                description={charmspacerPage.sections.charm.description}
                images={charmspacerPage.sections.charm.images}
              />
              
              <ProductSection
                id={charmspacerPage.sections.spacer.id}
                title={charmspacerPage.sections.spacer.title}
                description={charmspacerPage.sections.spacer.description}
                images={charmspacerPage.sections.spacer.images}
                className="pt-24"
              />
              
              <ProductSection
                id={charmspacerPage.sections.pendant.id}
                title={charmspacerPage.sections.pendant.title}
                description={charmspacerPage.sections.pendant.description}
                images={charmspacerPage.sections.pendant.images}
                className="pt-24 pb-24"
              />
            </>
          )}
        </div>
      </main>

      <Footer />

      <ChatWidget />
    </>
  )
}