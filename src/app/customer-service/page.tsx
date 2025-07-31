'use client'

import Navigation from '@/components/Navigation'
import { Container, Typography } from '@/components/ui'
import Image from 'next/image'

export default function CustomerServicePage() {
  return (
    <>
      <Navigation />

      {/* Main content wrapper with top padding to account for navigation */}
      <main className="pt-20 lg:pt-[230px]">
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
                {/* Left Column */}
                <div className="space-y-8">
                  <Typography
                    variant="h2"
                    fontFamily="thai"
                    className="text-4xl lg:text-5xl font-bold text-white mb-8"
                    textShadow
                  >
                    บริการหลังการขาย
                  </Typography>

                  <div className="space-y-6">
                    <Typography
                      variant="body"
                      fontFamily="thai"
                      className="text-lg text-white leading-relaxed"
                      textShadow
                    >
                      <strong className="text-xl">รับประกันภายใน 7 วัน</strong>
                      <br />
                      (นับตั้งแต่ลูกค้าได้รับสินค้า)
                    </Typography>

                    <Typography
                      variant="body"
                      fontFamily="thai"
                      className="text-lg text-white leading-relaxed"
                      textShadow
                    >
                      • กรณีสินค้าชำรุดเสียหายจากการขนส่ง หรือมีข้อบกพร่องจากการผลิต
                      <br />
                      • สามารถแลกเปลี่ยนได้หากไม่ถูกใจหรือไม่เหมาะสม
                      <br />• ลูกค้าต้องแจ้งภายใน 7 วันหลังได้รับสินค้า
                    </Typography>

                    <Typography
                      variant="body"
                      fontFamily="thai"
                      className="text-lg text-white leading-relaxed"
                      textShadow
                    >
                      <strong>เงื่อนไขการรับประกัน:</strong>
                      <br />
                      • สินค้าต้องอยู่ในสภาพเดิม ไม่ผ่านการใช้งาน
                      <br />
                      • มีบรรจุภัณฑ์และอุปกรณ์ครบถ้วน
                      <br />• ค่าจัดส่งในการแลกเปลี่ยนลูกค้าเป็นผู้รับผิดชอบ
                    </Typography>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                  <Typography
                    variant="h3"
                    fontFamily="thai"
                    className="text-3xl lg:text-4xl font-bold text-white mb-8"
                    textShadow
                  >
                    เวลาทำการบริการ
                  </Typography>

                  <div className="space-y-6">
                    <Typography
                      variant="body"
                      fontFamily="thai"
                      className="text-lg text-white leading-relaxed"
                      textShadow
                    >
                      <strong className="text-xl">งานร้อยใส่หิน และซ่อมแซม</strong>
                      <br />
                      วันจันทร์ - วันศุกร์: 09:00 - 18:00 น.
                      <br />
                      วันเสาร์ - วันอาทิตย์: 10:00 - 17:00 น.
                    </Typography>

                    <Typography
                      variant="body"
                      fontFamily="thai"
                      className="text-lg text-white leading-relaxed"
                      textShadow
                    >
                      <strong className="text-xl">บริการลูกค้าออนไลน์</strong>
                      <br />
                      ตอบข้อความและปรึกษา: 24 ชั่วโมง
                      <br />
                      (ตอบกลับภายใน 2-4 ชั่วโมง ในเวลาทำการ)
                    </Typography>

                    <Typography
                      variant="body"
                      fontFamily="thai"
                      className="text-lg text-white leading-relaxed"
                      textShadow
                    >
                      <strong>หมายเหตุ:</strong>
                      <br />
                      • งานฉุกเฉินสามารถติดต่อได้นอกเวลาทำการ
                      <br />
                      • ระยะเวลาซ่อมแซมขึ้นอยู่กับความเสียหายของชิ้นงาน
                      <br />• การรับประกันครอบคลุมเฉพาะข้อบกพร่องจากการผลิตเท่านั้น
                    </Typography>

                    <div className="mt-8 p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                      <Typography
                        variant="body"
                        fontFamily="thai"
                        className="text-lg text-white leading-relaxed"
                        textShadow
                      >
                        <strong>ติดต่อเรา:</strong>
                        <br />
                        📞 โทรศัพท์: 02-XXX-XXXX
                        <br />
                        📧 อีเมล: service@roihin.com
                        <br />
                        💬 Line: @roihin-official
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          </div>
        </section>
      </main>
    </>
  )
}
