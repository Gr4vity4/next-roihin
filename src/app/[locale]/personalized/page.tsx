import ChatWidget from '@/components/ChatWidget'
import NavigationWithSuspense from '@/components/NavigationWithSuspense'
import { FontProvider } from '@/components/providers/FontProvider'
import { Footer } from '@/components/sections'
import PersonalizedContentSection from '@/components/sections/PersonalizedContentSection'
// import PersonalizedCTASection from '@/components/sections/PersonalizedCTASection'
import PersonalizedExpertiseSection from '@/components/sections/PersonalizedExpertiseSection'
import PersonalizedGallerySection from '@/components/sections/PersonalizedGallerySection'
import PersonalizedHeroSection from '@/components/sections/PersonalizedHeroSection'
import RecentPersonalizedDesignsSection from '@/components/sections/RecentPersonalizedDesignsSection'
import { getRecentPersonalizedDesigns } from '@/lib/api/gallery'
import { content } from '@/config/content.config'
import { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
// Configure route segment caching for personalized page (semi-static content)
// Revalidate every 15 minutes
export const revalidate = 0

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'personalizedPage' })

  return {
    title: `${t('hero.title')} - ROIHIN STONE & BRACELET`,
    description: t('hero.subtitle'),
    openGraph: {
      title: `${t('hero.title')} - ROIHIN STONE & BRACELET`,
      description: t('hero.subtitle'),
      images: [
        {
          url: '/images/banner/personalized-banner.avif',
          width: 1200,
          height: 630,
          alt: 'Personalized Stone Bracelet',
        },
      ],
    },
  }
}

export default async function PersonalizedPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const translationsPromise = getTranslations('personalizedPage')
  const recentDesignsPromise = getRecentPersonalizedDesigns(8)
  const [t, recentDesigns] = await Promise.all([translationsPromise, recentDesignsPromise])
  const recentDesignsWithImages = recentDesigns.filter(design => Boolean(design.image_url))
  const { personalizedPage } = content

  return (
    <FontProvider fonts={{ th: 'font-prompt', en: 'font-bodoni' }}>
      <main className="min-h-screen">
        {/* Navigation */}
        <NavigationWithSuspense />

        {/* Hero Section */}
        <PersonalizedHeroSection
          backgroundImage={personalizedPage.hero.backgroundImage}
          title={t('hero.title')}
          subtitle={t('hero.subtitle')}
        />

        {/* About Section */}
        <PersonalizedContentSection />

        {/* Gallery Section */}
        <PersonalizedGallerySection />

        {/* Expertise Section */}
        <PersonalizedExpertiseSection />

        {/* Recent Personalized Designs Section */}
        <RecentPersonalizedDesignsSection initialImages={recentDesignsWithImages} />

        {/* CTA Section */}
        {/* <PersonalizedCTASection buttons={personalizedPage.ctaSection.buttons} /> */}

        {/* Footer */}
        <Footer />

        {/* Chat Widget */}
        <ChatWidget />
      </main>
    </FontProvider>
  )
}
