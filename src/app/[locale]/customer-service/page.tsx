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
        afterSalesTitle: 'บริการหลังการขาย',
        warrantyTitle: 'รับประกันภายใน 7 วัน',
        warrantySubtitle: '(นับตั้งแต่ลูกค้าได้รับสินค้า)',
        warrantyDescription:
          'กำไลหินมงคลได้รับการออกแบบอย่างปราณีตและตรวจสอบสินค้าก่อนนำส่งลูกค้าทุกครั้ง หากสินค้าเกิดข้อผิดพลาดจากตัวสินค้าเอง เช่น หินบิ่น ชำรุด หรือไหมยืดเกิดการขาด ย้วย หรือเสียหายโดยมิได้เกิดจากการใช้งานของลูกค้า ทางร้านยินดีดูแล เปลี่ยนสินค้า หรือคืนเงินเต็มจำนวนตามเงื่อนไขที่กำหนด',
        lifetimeTitle: 'ยินดีดูแลสินค้า ตลอดอายุการใช้งาน',
        lifetimeDescription:
          'เมื่อไหมยืดร้อยหินหมดอายุการใช้งาน ทางร้อยหินยินดีให้บริการดูแล ทำความสะอาดหิน และเปลี่ยนไหมร้อยให้โดยไม่มีค่าใช้จ่าย (ยกเว้นค่าจัดส่งคืนสินค้า)',
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
        afterSalesTitle: 'After-Sales Service',
        warrantyTitle: '7-Day Warranty',
        warrantySubtitle: '(from the date customer receives the product)',
        warrantyDescription:
          'Every bracelet is carefully crafted and inspected before delivery. If a defect occurs due to product issues, such as chipped stones or damaged elastic not caused by misuse, we are happy to assist with replacement or refund based on our service policy.',
        lifetimeTitle: 'Lifetime Care Service',
        lifetimeDescription:
          'When the bracelet string reaches end-of-life, we provide cleaning and restringing services at no additional charge (excluding return shipping fees).',
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
        </section>

        {/* Content Section with Video Background */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
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
          <div className="relative z-10 w-full">
            <Container className="py-16 lg:py-24">
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 text-white">
                {/* Left Column - Contact Information */}
                <div className="space-y-8">
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

                {/* Right Column - After-Sales Service */}
                <div className="space-y-8">
                  <Typography
                    variant="h3"
                    className="text-3xl lg:text-4xl font-bold text-white mb-8"
                    textShadow
                  >
                    {content.afterSalesTitle}
                  </Typography>

                  <div className="space-y-6">
                    <Typography
                      variant="body"
                      className="text-lg text-white leading-relaxed"
                      textShadow
                    >
                      <strong className="text-xl">{content.warrantyTitle}</strong>
                      <br />
                      {content.warrantySubtitle}
                    </Typography>

                    <Typography
                      variant="body"
                      className="text-lg text-white leading-relaxed"
                      textShadow
                    >
                      {content.warrantyDescription}
                    </Typography>

                    <Typography
                      variant="body"
                      className="text-lg text-white leading-relaxed"
                      textShadow
                    >
                      <strong className="text-xl">{content.lifetimeTitle}</strong>
                    </Typography>

                    <Typography
                      variant="body"
                      className="text-lg text-white leading-relaxed"
                      textShadow
                    >
                      {content.lifetimeDescription}
                    </Typography>
                  </div>
                </div>
              </div>
            </Container>
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
