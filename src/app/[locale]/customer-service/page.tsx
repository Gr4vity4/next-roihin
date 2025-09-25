'use client'

import ChatWidget from '@/components/ChatWidget'
import NavigationWithSuspense from '@/components/NavigationWithSuspense'
import Footer from '@/components/sections/Footer'
import { Container, Typography } from '@/components/ui'
import Image from 'next/image'

export default function CustomerServicePage() {
  return (
    <>
      <NavigationWithSuspense />

      {/* Main content wrapper with top padding to account for navigation */}
      <main className="pt-20 min-[1408px]:pt-[230px]">
        {/* Full Width Image Section */}
        <section className="relative w-full h-[420px] overflow-hidden">
          <Image
            src="/images/357c3a_ac4bc1a787364c358512be32cc1ffc30~mv2.avif"
            alt="Customer Service"
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
                    ติดต่อสอบถาม
                  </Typography>

                  <div className="space-y-6">
                    <Typography
                      variant="body"
                      className="text-lg text-white leading-relaxed"
                      textShadow
                    >
                      <strong className="text-xl">ที่อยู่:</strong>
                      <br />
                      ร้อยหิน Stone & Bracelet
                      <br />
                      101/54 หมู่บ้าน ภัสสร 70 (เกาะแก้ว) หมู่ที่ 4 ตำบลเกาะแก้ว อำเภอเมืองภูเก็ต
                      จังหวัดภูเก็ต 83000
                    </Typography>

                    <Typography
                      variant="body"
                      className="text-lg text-white leading-relaxed"
                      textShadow
                    >
                      <strong className="text-xl">โทรศัพท์:</strong>
                      <br />
                      +6683 826 5195
                    </Typography>

                    <Typography
                      variant="body"
                      className="text-lg text-white leading-relaxed"
                      textShadow
                    >
                      <strong className="text-xl">อีเมล์:</strong>
                      <br />
                      info.roihin@gmail.com
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
                    บริการหลังการขาย
                  </Typography>

                  <div className="space-y-6">
                    <Typography
                      variant="body"
                      className="text-lg text-white leading-relaxed"
                      textShadow
                    >
                      <strong className="text-xl">รับประกันภายใน 7 วัน</strong>
                      <br />
                      (นับตั้งแต่ลูกค้าได้รับสินค้า)
                    </Typography>

                    <Typography
                      variant="body"
                      className="text-lg text-white leading-relaxed"
                      textShadow
                    >
                      กำไลหินมงคลได้รับการออกแบบอย่างปราณีตและตรวจสอบสินค้าก่อนนำส่งลูกค้าทุกครั้ง
                      อนึ่งหากสินค้าเกิดข้อผิดพลาดทั้งที่ตัวของหินที่อาจบิ่น ชำรุดหรือเสียหาย
                      หรือไหมยืดเกิดการขาด ย้วยหรือเสียหายซึ่งเหตุอันมิได้เกิดจากลูกค้า
                      ทางร้านยินดีรับเปลี่ยนหิน ดูแล ดดยไม่เรียกร้องค่าเสียหายใด ๆ
                      จากลูกค้าหรือยินดีคืนเงินเต็มจำนวนในกรณีสเหตุสุดวิสัย
                      (ทั้งนี้ทางร้อยหินขอสงวนสิทธิ์ในการตรวจสอบเหตุอันพิสูจน์แล้วว่ามิใดเป็นการกระทำใด
                      ๆ อันไม่เหมาะสมต่อสินค้าจากลูกค้า จึงดำเนินการคืนเงินภายใน 15
                      วันหลังได้ทำการตกลงกับลูกค้า)
                    </Typography>

                    <Typography
                      variant="body"
                      className="text-lg text-white leading-relaxed"
                      textShadow
                    >
                      <strong className="text-xl">ยินดีดูแลสินค้า ตลอดอายุการใช้งาน</strong>
                    </Typography>

                    <Typography
                      variant="body"
                      className="text-lg text-white leading-relaxed"
                      textShadow
                    >
                      เมื่อไหมยืดร้อยหินหมดอายุการใช้งาน ทางร้อยหินยินดีให้บริการดูแล ทำความสะอาดหิน
                      เปลี่ยนไหมร้อยให้โดยไม่มีค่าใช้จ่ายใด ๆ เว้นแต่ค่าบริการส่งสินค้าคืนลูกค้า
                      (ค่าบริการจัดส่งในประเทศ 60 บาท หรือ 120 บาทสำหรับพื้นที่ห่างไกล)
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
