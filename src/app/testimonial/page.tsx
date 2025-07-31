import Navigation from '@/components/Navigation'
import { Typography } from '@/components/ui'
import Image from 'next/image'

// Testimonial data with avatars, dates, and Thai messages
const testimonialData = [
  {
    id: '1',
    avatar: '/images/home-page/1.png',
    date: '2024-01-15',
    message:
      'สายหินที่ได้รับทำให้รู้สึกถึงพลังงานที่ดีขึ้นอย่างชัดเจน รู้สึกมีความมั่นใจและสมดุลในชีวิตมากขึ้น ขอบคุณร้อยหินที่ใส่ใจในทุกรายละเอียด การออกแบบที่เฉพาะตัวทำให้รู้สึกพิเศษมาก',
    author: 'คุณสุภาพร',
  },
  {
    id: '2',
    avatar: '/images/home-page/2.png',
    date: '2024-01-20',
    message:
      'ประทับใจมากกับการให้คำปรึกษาที่ละเอียด ได้สายหินที่เหมาะกับตัวเองจริงๆ สวมใส่แล้วรู้สึกถึงการเปลี่ยนแปลงในทางที่ดี พลังงานบวกเพิ่มขึ้น และรู้สึกสงบใจมากขึ้น',
    author: 'คุณวิชัย',
  },
  {
    id: '3',
    avatar: '/images/home-page/3.png',
    date: '2024-02-05',
    message:
      'คุณภาพของหินและการทำงานเยี่ยมมาก สายหินสวยงามและรู้สึกถึงพลังของหินแต่ละเม็ด การบริการดีเยี่ยม ให้คำแนะนำที่เป็นประโยชน์มาก แนะนำให้เพื่อนๆ หลายคนแล้ว',
    author: 'คุณนิรันดร์',
  },
  {
    id: '4',
    avatar: '/images/home-page/4.png',
    date: '2024-02-12',
    message:
      'หลังจากสวมใส่สายหินไปสักพัก รู้สึกว่าชีวิตเริ่มมีทิศทางที่ชัดเจนขึ้น งานการเงินดีขึ้น และความสัมพันธ์กับคนรอบข้างก็ดีขึ้นด้วย ขอบคุณร้อยหินที่ช่วยให้ชีวิตดีขึ้น',
    author: 'คุณมาลี',
  },
  {
    id: '5',
    avatar: '/images/home-page/5.png',
    date: '2024-02-18',
    message:
      'เป็นครั้งแรกที่ใส่สายหิน ตอนแรกก็ไม่เชื่อเท่าไหร่ แต่หลังจากใส่ไปสักระยะ รู้สึกเปลี่ยนแปลงจริงๆ มีความสุขมากขึ้น นอนหลับดีขึ้น และรู้สึกมีพลังในการทำงาน',
    author: 'คุณสมชาย',
  },
  {
    id: '6',
    avatar: '/images/home-page/6.png',
    date: '2024-02-25',
    message:
      'การออกแบบสวยงามมาก หินแต่ละเม็ดถูกเลือกมาอย่างดี รู้สึกถึงความใส่ใจในทุกรายละเอียด สายหินไม่เพียงแต่สวยแต่ยังให้พลังงานที่ดี ทำให้รู้สึกมั่นใจในตัวเองมากขึ้น',
    author: 'คุณปราณี',
  },
  {
    id: '7',
    avatar: '/images/home-page/7.png',
    date: '2024-03-05',
    message:
      'บริการดีเยี่ยม ให้คำปรึกษาละเอียด และมีความรู้เรื่องหินมาก ได้สายหินที่เหมาะกับตัวเองและเป้าหมายในชีวิต หลังจากใส่แล้วรู้สึกว่าทุกอย่างเริ่มเข้าที่ เข้าทางมากขึ้น',
    author: 'คุณรัชนี',
  },
  {
    id: '8',
    avatar: '/images/home-page/8.png',
    date: '2024-03-12',
    message:
      'สายหินที่ได้มีความหมายพิเศษมาก ทำให้รู้สึกเชื่อมโยงกับตัวเองมากขึ้น การเลือกหินแต่ละเม็ดมีเหตุผลและความหมาย รู้สึกได้ถึงพลังของหินที่ช่วยเสริมจุดแข็งและปรับปรุงจุดอ่อน',
    author: 'คุณธนา',
  },
]

export default function TestimonialPage() {
  return (
    <>
      <Navigation />

      <main className="pt-20 lg:pt-[230px]">
        {/* Full-width image section */}
        <section className="w-full">
          <div className="relative w-full h-[290px]">
            <Image
              src="/images/357c3a_c78543e690504fdd80ac15754320656b~mv2.avif"
              alt="Testimonial page header image"
              fill
              className="object-cover"
              priority
            />
          </div>
        </section>

        {/* Testimonials section with black background */}
        <section className="bg-black py-16">
          <div className="container mx-auto px-4">
            {/* Section title */}
            <div className="text-center mb-12">
              <Typography variant="h2" fontFamily="playfair" className="text-white mb-4">
                TESTIMONIALS
              </Typography>
              <Typography variant="body" fontFamily="thai" className="text-gray-300">
                เสียงตอบรับจากลูกค้าที่ใช้บริการจริง
              </Typography>
            </div>

            {/* Testimonials grid */}
            <div className="space-y-8 max-w-4xl mx-auto">
              {testimonialData.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-white/5 backdrop-blur-sm rounded-lg p-6 flex gap-6 items-start"
                >
                  {/* Avatar section */}
                  <div className="flex-shrink-0">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden">
                      <Image
                        src={testimonial.avatar}
                        alt={`Avatar of ${testimonial.author}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="text-center mt-2">
                      <Typography variant="caption" className="text-gray-400 text-xs">
                        {new Date(testimonial.date).toLocaleDateString('th-TH', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </Typography>
                    </div>
                  </div>

                  {/* Message section */}
                  <div className="flex-1">
                    <Typography
                      variant="body"
                      fontFamily="thai"
                      className="text-gray-300 leading-relaxed mb-4"
                    >
                      &ldquo;{testimonial.message}&rdquo;
                    </Typography>

                    <Typography variant="body" className="text-white font-semibold">
                      - {testimonial.author}
                    </Typography>
                  </div>
                </div>
              ))}
            </div>

            {/* Call to action */}
            <div className="text-center mt-12">
              <Typography variant="body" fontFamily="thai" className="text-gray-400 mb-4">
                พร้อมที่จะเริ่มต้นการเปลี่ยนแปลงชีวิตของคุณแล้วหรือยัง?
              </Typography>
              <button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-8 py-3 rounded-full font-semibold hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300">
                สั่งออกแบบสายหินของคุณ
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
