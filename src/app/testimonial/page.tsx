import Navigation from '@/components/Navigation'
import Footer from '@/components/sections/Footer'
import ChatWidget from '@/components/ChatWidget'
import { Typography } from '@/components/ui'
import Image from 'next/image'
import TestimonialsContainer from '@/components/TestimonialsContainer'
import { routeConfig } from '@/config/cache.config'

// Configure route segment caching for testimonials (dynamic content)
export const revalidate = routeConfig.dynamic.revalidate

export default function TestimonialPage() {
  return (
    <>
      <Navigation />

      <main>
        {/* Full-width image section */}
        <section className="w-full pt-20 lg:pt-[230px]">
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

            {/* Database-driven testimonials */}
            <TestimonialsContainer />

            {/* Call to action */}
            <div className="text-center mt-12">
              <Typography variant="body" fontFamily="thai" className="text-gray-400 mb-4">
                พร้อมที่จะเริ่มต้นการเปลี่ยนแปลงชีวิตของคุณแล้วหรือยัง?
              </Typography>
              <button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-8 py-3 rounded-full font-semibold hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 font-fciconic">
                สั่งออกแบบสายหินของคุณ
              </button>
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
