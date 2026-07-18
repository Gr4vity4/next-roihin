'use client'

import ChatWidget from '@/components/ChatWidget'
import NavigationWithSuspense from '@/components/NavigationWithSuspense'
import Footer from '@/components/sections/Footer'
import { Container, Typography } from '@/components/ui'
import { useLocale } from 'next-intl'
import Image from 'next/image'

export default function CustomerServicePage() {
  const locale = useLocale()
  const isThai = locale === 'th'

  const content = isThai
    ? {
        heroAlt: 'บริการลูกค้า',
        contactTitle: 'ติดต่อสอบถาม',
        addressLabel: 'ที่อยู่:',
        address: `ร้อยหิน Stone & Bracelet
101/54 หมู่บ้าน ภัสสร 70 (เกาะแก้ว) หมู่ที่ 4 ตำบลเกาะแก้ว อำเภอเมืองภูเก็ต จังหวัดภูเก็ต 83000`,
        phoneLabel: 'โทรศัพท์:',
        phone: '+6683 826 5195',
        emailLabel: 'อีเมล์:',
        email: 'info.roihin@gmail.com',
        mapTitle: 'แผนที่ร้านร้อยหิน Stone & Bracelet',
        ctaTitle: 'ปรึกษาและออกแบบให้ฟรี',
        ctaDescription:
          'ปรึกษาทีมงานผู้เชี่ยวชาญเพื่อออกแบบกำไลหินหรือสอบถามหินมาใหม่เพิ่มเติมได้ที่ (LINE OA : @roihin4289) ติดต่อ Call Center โทร ',
        ctaPhone: '083-159-1926',
        ctaLineButton: 'LINE OA @roihin4289',
        ctaWhatsAppButton: 'WhatsApp',
      }
    : {
        heroAlt: 'Customer Service',
        contactTitle: 'Contact Us',
        addressLabel: 'Address:',
        address: `Roihin Stone & Bracelet
101/54 Passorn 70 Village (Ko Kaew), Village No. 4, Ko Kaew Subdistrict, Mueang Phuket District, Phuket 83000`,
        phoneLabel: 'Phone:',
        phone: '+6683 826 5195',
        emailLabel: 'Email:',
        email: 'info.roihin@gmail.com',
        mapTitle: 'Roihin Stone & Bracelet location map',
        ctaTitle: 'Free Consultation & Design',
        ctaDescription:
          'Consult our expert team to design your stone bracelet or ask about new arrivals via LINE OA : @roihin4289, or contact our Call Center at ',
        ctaPhone: '083-159-1926',
        ctaLineButton: 'LINE OA @roihin4289',
        ctaWhatsAppButton: 'WhatsApp',
      }

  return (
    <>
      <NavigationWithSuspense />

      {/* Main content wrapper with top padding to account for navigation */}
      <main className="pt-20 min-[1408px]:pt-[230px]">
        {/* Full Width Image Section */}
        <section className="relative w-full h-[420px] overflow-hidden">
          <Image
            src="/images/357c3a_ac4bc1a787364c358512be32cc1ffc30~mv2.avif"
            alt={content.heroAlt}
            fill
            className="object-cover"
            priority
          />
          {/* Dark backdrop matching the home hero overlay */}
          <div className="absolute inset-0 bg-black/40" />
        </section>

        {/* CTA Section */}
        <section className="bg-white py-20 lg:py-28">
          <Container>
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <Typography variant="h3" align="center" className="text-gray-900">
                {content.ctaTitle}
              </Typography>

              <Typography variant="body" align="center" className="text-gray-900">
                {content.ctaDescription}
                <strong>{content.ctaPhone}</strong>
              </Typography>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <a
                  href="https://lin.ee/r94Dnio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-black px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-[#244323]"
                >
                  {content.ctaLineButton}
                </a>
                <a
                  href="https://wa.me/66831591926"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-black px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-[#244323]"
                >
                  {content.ctaWhatsAppButton}
                </a>
              </div>
            </div>
          </Container>
        </section>

        {/* Content Section with Video Background */}
        <section className="relative overflow-hidden">
          {/* Video Background */}
          <div className="absolute inset-0 w-full h-full">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute top-0 left-0 w-full h-full object-cover"
              ref={(el) => {
                if (el) el.playbackRate = 0.5
              }}
            >
              <source src="/videos/main.mp4" type="video/mp4" />
            </video>
            {/* Dark overlay with blur for better text visibility */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          </div>

          {/* Content */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 lg:min-h-[560px]">
            {/* Left Column - Contact Information */}
            <div className="flex items-center px-4 py-16 sm:px-6 md:px-8 lg:px-12 lg:py-20">
              <div className="w-full max-w-xl mx-auto space-y-8 text-white">
                <Typography
                  variant="h2"
                  className="text-4xl lg:text-5xl font-bold text-white mb-8"
                  textShadow
                >
                  {content.contactTitle}
                </Typography>

                <div className="space-y-6">
                  <Typography
                    variant="body"
                    className="text-lg text-white leading-relaxed"
                    textShadow
                  >
                    <strong className="text-xl">{content.addressLabel}</strong>
                    <br />
                    {content.address.split('\n').map((line) => (
                      <span key={line}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </Typography>

                  <Typography
                    variant="body"
                    className="text-lg text-white leading-relaxed"
                    textShadow
                  >
                    <strong className="text-xl">{content.phoneLabel}</strong>
                    <br />
                    {content.phone}
                  </Typography>

                  <Typography
                    variant="body"
                    className="text-lg text-white leading-relaxed"
                    textShadow
                  >
                    <strong className="text-xl">{content.emailLabel}</strong>
                    <br />
                    {content.email}
                  </Typography>
                </div>
              </div>
            </div>

            {/* Right Column - Google Map (full bleed) */}
            <div className="h-[350px] sm:h-[420px] lg:h-auto">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3951.3748572961017!2d98.36954087681498!3d7.960157404799574!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3050319897c16891%3A0xa4645b8f928c3fec!2z4Lij4LmJ4Lit4Lii4Lir4Li04LiZIFN0b25lICYgQnJhY2VsZXQgOiBSb2loaW4gU3RvbmUgJiBCcmFjZWxldCA6INCa0YDQuNGB0YLQsNC70Lsg0Lgg0Y7QstC10LvQuNGA0L3Ri9C1INC40LfQtNC10LvQuNGP!5e0!3m2!1sen!2sth!4v1784364959271!5m2!1sen!2sth"
                title={content.mapTitle}
                className="block w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
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
