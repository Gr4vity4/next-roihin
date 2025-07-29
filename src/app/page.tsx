import ChatWidget from '@/components/ChatWidget'
import Navigation from '@/components/Navigation'
import {
  HeroSection,
  AboutSection,
  SignatureCharmSection,
  TestimonialsSection,
  GallerySection,
  VibrantDestinySection,
  Footer,
} from '@/components/sections'
import { siteConfig } from '@/config/site.config'
import { contentConfig } from '@/config/content.config'

export default function Home() {
  return (
    <>
      <Navigation />

      {/* Hero Section */}
      <HeroSection
        backgroundImage={contentConfig.hero.background.image}
        backgroundAlt={contentConfig.hero.background.alt}
        title={contentConfig.hero.title}
        subtitle={contentConfig.hero.subtitle}
        ctaButton={contentConfig.hero.cta}
      />

      {/* About Section */}
      <AboutSection
        id="about"
        title={contentConfig.about.title}
        subtitle={contentConfig.about.subtitle}
        content={contentConfig.about.content}
        ctaButton={contentConfig.about.cta}
      />

      {/* Signature Charm Section */}
      <SignatureCharmSection
        id="charms"
        backgroundImage={contentConfig.signatureCharm.background.image}
        backgroundAlt={contentConfig.signatureCharm.background.alt}
        title={contentConfig.signatureCharm.title}
        subtitle={contentConfig.signatureCharm.subtitle}
        ctaButton={contentConfig.signatureCharm.cta}
      />

      {/* Testimonials Section */}
      <TestimonialsSection
        id="reviews"
        title={contentConfig.testimonials.title}
        subtitle={contentConfig.testimonials.subtitle}
        testimonials={contentConfig.testimonials.items}
        ctaButton={contentConfig.testimonials.cta}
      />

      {/* Gallery Section */}
      <GallerySection
        backgroundImage={contentConfig.gallery.background.image}
        backgroundAlt={contentConfig.gallery.background.alt}
        title={contentConfig.gallery.title}
        subtitle={contentConfig.gallery.subtitle}
        ctaButtons={contentConfig.gallery.ctaButtons}
      />

      {/* Vibrant Destiny Section */}
      <VibrantDestinySection
        backgroundImage={contentConfig.vibrantDestiny.background.image}
        backgroundAlt={contentConfig.vibrantDestiny.background.alt}
        title={contentConfig.vibrantDestiny.title}
        subtitle={contentConfig.vibrantDestiny.subtitle}
        since={contentConfig.vibrantDestiny.since}
      />

      {/* Footer */}
      <Footer
        columns={siteConfig.footer.columns}
        contactInfo={{
          address: siteConfig.contact.address,
          socialLinks: siteConfig.socialLinks,
        }}
        copyright={siteConfig.footer.copyright}
      />

      <ChatWidget />
    </>
  )
}
