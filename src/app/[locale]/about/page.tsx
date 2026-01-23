import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import ChatWidget from '@/components/ChatWidget'
import NavigationWithSuspense from '@/components/NavigationWithSuspense'
import { Footer } from '@/components/sections'
import AboutHeroSection from '@/components/sections/AboutHeroSection'
import AboutContentSection from '@/components/sections/AboutContentSection'
import AboutFeaturesSection from '@/components/sections/AboutFeaturesSection'
import AboutTestimonialSection from '@/components/sections/AboutTestimonialSection'
import { REVALIDATE_SEMI_STATIC } from '@/config/cache.config'

// Configure route segment caching for about page (semi-static content)
// Revalidate every 15 minutes
export const revalidate = REVALIDATE_SEMI_STATIC

interface AboutPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'aboutPage.meta' })

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      images: [
        {
          url: '/images/357c3a_ac4bc1a787364c358512be32cc1ffc30~mv2.avif',
          width: 1200,
          height: 630,
          alt: 'About ROIHIN',
        },
      ],
    },
  }
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'aboutPage' })

  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <NavigationWithSuspense />

      {/* Hero Section */}
      <AboutHeroSection
        backgroundImage="/images/banner/about-banner.avif"
        title={{
          line1: t('hero.line1'),
          line2: t('hero.line2'),
          line3: '',
        }}
      />

      {/* About Content Section */}
      <AboutContentSection
        locale={locale}
      />

      {/* Features Section */}
      <AboutFeaturesSection
        locale={locale}
      />

      {/* Testimonial Section */}
      <AboutTestimonialSection
        locale={locale}
      />

      {/* Footer */}
      <Footer />

      {/* Chat Widget */}
      <ChatWidget />
    </main>
  )
}
