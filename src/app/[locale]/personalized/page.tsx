import ChatWidget from '@/components/ChatWidget'
import NavigationWithSuspense from '@/components/NavigationWithSuspense'
import { Footer } from '@/components/sections'
import PersonalizedContentSection from '@/components/sections/PersonalizedContentSection'
import PersonalizedCTASection from '@/components/sections/PersonalizedCTASection'
import PersonalizedExpertiseSection from '@/components/sections/PersonalizedExpertiseSection'
import PersonalizedGallerySection from '@/components/sections/PersonalizedGallerySection'
import PersonalizedHeroSection from '@/components/sections/PersonalizedHeroSection'
import { content } from '@/config/content.config'
import { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
// Configure route segment caching for personalized page (semi-static content)
// Revalidate every 15 minutes
export const revalidate = 900

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
  const t = await getTranslations('personalizedPage')
  const { personalizedPage } = content

  return (
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
      <PersonalizedGallerySection
        title={personalizedPage.gallerySection.title}
        subtitle={personalizedPage.gallerySection.subtitle}
        cta={personalizedPage.gallerySection.cta}
      />

      {/* Expertise Section */}
      <PersonalizedExpertiseSection content={personalizedPage.expertiseSection.content} />

      {/* CTA Section */}
      <PersonalizedCTASection buttons={personalizedPage.ctaSection.buttons} />

      {/* Footer */}
      <Footer />

      {/* Chat Widget */}
      <ChatWidget />
    </main>
  )
}
