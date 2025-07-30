import ChatWidget from '@/components/ChatWidget'
import Navigation from '@/components/Navigation'
import {
  AboutSection,
  Footer,
  FullWidthBackgroundSection,
  GallerySection,
  HeroSection,
  SignatureCharmSection,
  TestimonialsSection,
  VibrantDestinySection,
} from '@/components/sections'
import { contentConfig } from '@/config/content.config'
import { siteConfig } from '@/config/site.config'

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

      {/* Full Width Background Section */}
      <FullWidthBackgroundSection
        backgroundImage="/images/357c3a_449b1b790747456cb742616cdedb4af0~mv2.avif"
        backgroundAlt="Beautiful handcrafted jewelry showcasing natural stone bracelets"
        overlayOpacity={0}
        parallaxSpeed={0}
      />

      {/* Gallery Section */}
      <GallerySection
        backgroundImage=""
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
        overlayOpacity={0.2}
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
