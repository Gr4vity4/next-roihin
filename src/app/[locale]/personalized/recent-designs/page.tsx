import ChatWidget from '@/components/ChatWidget'
import NavigationWithSuspense from '@/components/NavigationWithSuspense'
import { FontProvider } from '@/components/providers/FontProvider'
import { Footer } from '@/components/sections'
import RecentPersonalizedDesignsSection from '@/components/sections/RecentPersonalizedDesignsSection'
import { getAllRecentPersonalizedDesigns } from '@/lib/api/gallery'
import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

export const revalidate = 0

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'personalizedPage.recentDesigns' })

  return {
    title: `${t('title')} - ROIHIN STONE & BRACELET`,
    description: t('subtitle'),
    openGraph: {
      title: `${t('title')} - ROIHIN STONE & BRACELET`,
      description: t('subtitle'),
    },
  }
}

export default async function RecentPersonalizedDesignsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const designs = await getAllRecentPersonalizedDesigns()
  const recentDesigns = designs.filter(design => Boolean(design.image_url))

  return (
    <FontProvider fonts={{ th: 'font-prompt', en: 'font-bodoni' }}>
      <div className="min-h-screen flex flex-col">
        <NavigationWithSuspense position="static" />

        <main className="flex-1">
          <RecentPersonalizedDesignsSection
            initialImages={recentDesigns}
            maxDisplay={null}
            showViewMoreButton={false}
            showDivider={false}
          />
        </main>

        <Footer />
        <ChatWidget />
      </div>
    </FontProvider>
  )
}
