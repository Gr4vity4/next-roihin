import { Metadata } from 'next'
import ChatWidget from '@/components/ChatWidget'
import Navigation from '@/components/Navigation'
import CharmspacerHero from '@/components/sections/CharmspacerHero'
import ProductSection from '@/components/sections/ProductSection'
import { Footer } from '@/components/sections'
import { content } from '@/config/content.config'
import { routeConfig } from '@/config/cache.config'

// Configure route segment caching for charmspacer page (semi-static content)
export const revalidate = routeConfig.semiStatic.revalidate

export const metadata: Metadata = {
  title: 'ชาร์ม/สเปเซอร์ | Roihin Thailand',
  description: 'ชาร์มและสเปเซอร์เฉพาะตัว จัดทำขึ้นด้วยตำนานและพิธีกรรมโบราณ เพื่อให้เกิดเทวคุณอันเป็นสิริมงคล',
  keywords: 'ชาร์ม, สเปเซอร์, ชาร์มจี้, หินมงคล, ร้อยหิน',
}

export default function CharmspacerPage() {
  const { charmspacerPage } = content

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
        </div>
      </main>

      <Footer />

      <ChatWidget />
    </>
  )
}