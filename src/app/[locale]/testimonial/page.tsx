import ChatWidget from '@/components/ChatWidget'
import NavigationWithSuspense from '@/components/NavigationWithSuspense'
import Footer from '@/components/sections/Footer'
import TestimonialsClient from '@/components/TestimonialsClient'
import { Typography } from '@/components/ui'
import { Link } from '@/i18n/navigation'
import { getLocale, getTranslations } from 'next-intl/server'
import { getImageProps } from 'next/image'

// Configure route segment caching for testimonials (dynamic content)
// Revalidate every 5 minutes
export const revalidate = 0

export default async function TestimonialPage() {
  const locale = await getLocale()
  const isThai = locale === 'th'
  const tCommon = await getTranslations('common')

  // Art-direct the header with <picture>: desktop source at >=768px, mobile <img>
  // as the default. Mirrors the approach in BaseHeroSection.
  const heroAlt = isThai ? 'ภาพส่วนหัวหน้ารีวิว' : 'Testimonial page header image'
  const shared = { alt: heroAlt, fill: true as const, sizes: '100vw', priority: true }
  const { props: desktopProps } = getImageProps({ ...shared, src: '/images/testimonial/desktop.avif' })
  const { props: mobileProps } = getImageProps({ ...shared, src: '/images/testimonial/mobile.avif' })
  // With images.unoptimized there is no srcSet, only a plain src
  const desktopSrcSet = desktopProps.srcSet ?? desktopProps.src
  const desktopSizes = desktopProps.srcSet ? desktopProps.sizes : undefined

  return (
    <>
      <NavigationWithSuspense />

      <main>
        {/* Full-width image section */}
        <section className="w-full pt-20 min-[1408px]:pt-[230px]">
          <div className="relative w-full h-[290px]">
            <picture>
              <source media="(min-width: 768px)" srcSet={desktopSrcSet} sizes={desktopSizes} />
              <img {...mobileProps} alt={heroAlt} className="object-cover" />
            </picture>
          </div>
        </section>

        {/* Testimonials section with black background */}
        <section className="bg-black py-16">
          <div className="container mx-auto px-4">
            {/* Section title */}
            <div className="text-center mb-12">
              <Typography variant="h2" className="text-white mb-4 font-normal">
                {isThai ? 'รีวิวจากลูกค้า' : 'TESTIMONIALS'}
              </Typography>
              <Typography variant="body" className="text-gray-300">
                {isThai
                  ? 'เสียงตอบรับจากลูกค้าที่ใช้บริการจริง'
                  : 'Feedback from real customers'}
              </Typography>
            </div>

            {/* Database-driven testimonials */}
            <TestimonialsClient />

            {/* Call to action */}
            <div className="text-center mt-12">
              <Typography variant="body" className="text-gray-400 mb-4">
                {isThai
                  ? 'พร้อมที่จะเริ่มต้นการเปลี่ยนแปลงชีวิตของคุณแล้วหรือยัง?'
                  : 'Ready to begin your life transformation?'}
              </Typography>
              <Link
                href="/custom"
                className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-8 py-3 rounded-md font-semibold hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 "
              >
                {tCommon('orderDesign')}
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Chat Widget */}
      <ChatWidget />
    </>
  )
}
