import ChatWidget from '@/components/ChatWidget'
import Navigation from '@/components/Navigation'
import { Footer } from '@/components/sections'
import PersonalizedContentSection from '@/components/sections/PersonalizedContentSection'
import PersonalizedCTASection from '@/components/sections/PersonalizedCTASection'
import PersonalizedExpertiseSection from '@/components/sections/PersonalizedExpertiseSection'
import PersonalizedGallerySection from '@/components/sections/PersonalizedGallerySection'
import PersonalizedHeroSection from '@/components/sections/PersonalizedHeroSection'
import { content } from '@/config/content.config'
import { Metadata } from 'next'
// Configure route segment caching for personalized page (semi-static content)
// Revalidate every 15 minutes
export const revalidate = 900

export const metadata: Metadata = {
  title: 'งานออกแบบเฉพาะบุคคล - ROIHIN STONE & BRACELET',
  description:
    'กำไลหินเฉพาะบุคคล เริ่มต้นด้วยการเปิดใจเพื่อให้ตัวเองได้รู้จักพลังที่มิอาจเคยได้สัมผัส มากกว่าคุณค่าทางใจคือคุณค่าทางจิตวิญญาณ',
  openGraph: {
    title: 'งานออกแบบเฉพาะบุคคล - ROIHIN STONE & BRACELET',
    description:
      'กำไลหินเฉพาะบุคคล เริ่มต้นด้วยการเปิดใจเพื่อให้ตัวเองได้รู้จักพลังที่มิอาจเคยได้สัมผัส มากกว่าคุณค่าทางใจคือคุณค่าทางจิตวิญญาณ',
    images: [
      {
        url: '/images/357c3a_d5bbbe07a2cb43579ad4d33c6279ff5a~mv2.jpg',
        width: 1200,
        height: 630,
        alt: 'Personalized Stone Bracelet',
      },
    ],
  },
}

export default function PersonalizedPage() {
  const { personalizedPage } = content

  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <PersonalizedHeroSection
        backgroundImage={personalizedPage.hero.backgroundImage}
        title={personalizedPage.hero.title}
        subtitle={personalizedPage.hero.subtitle}
      />

      {/* About Section */}
      <PersonalizedContentSection
        title={personalizedPage.aboutSection.title}
        subtitle={personalizedPage.aboutSection.subtitle}
        content={personalizedPage.aboutSection.content}
      />

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
