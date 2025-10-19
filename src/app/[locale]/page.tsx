import ChatWidget from '@/components/ChatWidget'
import NavigationWithSuspense from '@/components/NavigationWithSuspense'
import { FontProvider } from '@/components/providers/FontProvider'
import {
  AboutSection,
  Footer,
  FullWidthBackgroundSection,
  GallerySection,
  HeroSection,
  SignatureCharmSection,
  TestimonialsSection,
} from '@/components/sections'
import { content } from '@/config/content.config'
import { getRecentPersonalizedDesigns } from '@/lib/api/gallery'
// Configure route segment caching for home page (dynamic content with testimonials)
// Revalidate every 5 minutes
export const revalidate = 300

export default async function Home() {
  // Fetch latest inspired gallery images from Laravel admin REST endpoint
  const galleryImages = (await getRecentPersonalizedDesigns(10)).filter((url): url is string => Boolean(url))

  return (
    <FontProvider fonts={{ th: 'font-prompt', en: 'font-playfair' }}>
      <NavigationWithSuspense />

      {/* Main content wrapper - no padding needed, hero section will handle spacing */}
      <main className="overflow-x-hidden w-full">
        {/* Hero Section - starts at top of page, content positioned to account for nav */}
        <HeroSection
          backgroundImage={content.hero.background.image}
          backgroundAlt={content.hero.background.alt}
          ctaButton={{ ...content.hero.cta, translationKey: 'orderDesign' }}
          className="pt-20 lg:pt-[230px]"
        />

        {/* About Section */}
        <AboutSection
          id="about"
          ctaButton={{ ...content.about.cta, translationKey: 'learnMore' }}
        />

        {/* Signature Charm Section */}
        <SignatureCharmSection
          id="charms"
          backgroundImage={content.signatureCharm.background.image}
          backgroundAlt={content.signatureCharm.background.alt}
          title={content.signatureCharm.title}
          subtitle={content.signatureCharm.subtitle}
          ctaButton={{ ...content.signatureCharm.cta, translationKey: 'viewMoreCharms' }}
        />

        {/* Testimonials Section */}
        <TestimonialsSection
          id="reviews"
          ctaButton={{ ...content.testimonials.cta, translationKey: 'readMore' }}
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
          backgroundAlt={content.gallery.background.alt}
          ctaButtons={[
            { ...content.gallery.ctaButtons[0], translationKey: 'designByYourself' },
            { ...content.gallery.ctaButtons[1], translationKey: 'designByRoihin' },
          ]}
          images={galleryImages}
        />

        {/* Vibrant Destiny Section */}
        {/* <VibrantDestinySection
        backgroundImage={content.vibrantDestiny.background.image}
        backgroundAlt={content.vibrantDestiny.background.alt}
        title={content.vibrantDestiny.title}
        subtitle={content.vibrantDestiny.subtitle}
        since={content.vibrantDestiny.since}
        overlayOpacity={0.2}
      /> */}

        {/* Footer */}
        <Footer />

        <ChatWidget />
      </main>
    </FontProvider>
  )
}
