import { Metadata } from 'next'
import ChatWidget from '@/components/ChatWidget'
import NavigationWithSuspense from '@/components/NavigationWithSuspense'
import { Footer } from '@/components/sections'
import AboutHeroSection from '@/components/sections/AboutHeroSection'
import AboutContentSection from '@/components/sections/AboutContentSection'
import AboutFeaturesSection from '@/components/sections/AboutFeaturesSection'
import { content } from '@/config/content.config'
// Configure route segment caching for about page (semi-static content)
// Revalidate every 15 minutes
export const revalidate = 900

export const metadata: Metadata = {
  title: 'เกี่ยวกับร้อยหิน - ROIHIN STONE & BRACELET',
  description: 'เรื่องราวที่เกิดขึ้น ณ ร้อยหิน - ศาสตร์แห่งการเชื่อมโยงพลังงานธาตุธรรมชาติ จิตวิญญาณและความปรารถนาเข้าด้วยกัน',
  openGraph: {
    title: 'เกี่ยวกับร้อยหิน - ROIHIN STONE & BRACELET',
    description: 'เรื่องราวที่เกิดขึ้น ณ ร้อยหิน - ศาสตร์แห่งการเชื่อมโยงพลังงานธาตุธรรมชาติ จิตวิญญาณและความปรารถนาเข้าด้วยกัน',
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

export default function AboutPage() {
  const { aboutPage } = content

  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <NavigationWithSuspense />

      {/* Hero Section */}
      <AboutHeroSection
        backgroundImage={aboutPage.hero.backgroundImage}
        title={aboutPage.hero.title}
      />

      {/* About Content Section */}
      <AboutContentSection
        title={aboutPage.aboutSection.title}
        subtitle={aboutPage.aboutSection.subtitle}
        content={aboutPage.aboutSection.content}
      />

      {/* Features Section */}
      <AboutFeaturesSection features={aboutPage.features} />

      {/* Footer */}
      <Footer />

      {/* Chat Widget */}
      <ChatWidget />
    </main>
  )
}