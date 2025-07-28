import Button from '@/components/Button'
import ChatWidget from '@/components/ChatWidget'
import Navigation from '@/components/Navigation'
import ParallaxSection from '@/components/ParallaxSection'
import { MapPin, Star } from 'lucide-react'

export default function Home() {
  return (
    <>
      <Navigation />

      {/* Hero Section */}
      <ParallaxSection
        imageUrl="https://static.wixstatic.com/media/357c3a_d5bbbe07a2cb43579ad4d33c6279ff5a~mv2.jpg/v1/fill/w_1265,h_1328,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/357c3a_d5bbbe07a2cb43579ad4d33c6279ff5a~mv2.jpg"
        imageAlt="Stone bracelets background"
        overlayOpacity={0.4}
        parallaxSpeed={0.5}
        className="min-h-screen flex items-center justify-center"
      >
        {/* Hero Content */}
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-6xl md:text-8xl font-bold mb-2 tracking-wider text-shadow !font-playfair">
            PERSONALIZED
          </h1>
          <h2 className="text-5xl md:text-7xl font-bold mb-6 tracking-wider text-shadow !font-playfair">
            STONE BRACELET
          </h2>
          <p className="text-3xl md:text-4xl mb-4 font-thai font-light text-shadow">
            กำไลหินเฉพาะบุคคล
          </p>
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto font-thai text-shadow">
            เปลี่ยนแปลงชีวิตในระดับจิตวิญญาณด้วยศาสตร์ร้อยหินเฉพาะตัว
          </p>
          <Button variant="gold" size="lg">
            สั่งออกแบบ
          </Button>
        </div>
      </ParallaxSection>

      {/* About Section */}
      <section id="about" className="py-24 bg-light-gray">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 !font-playfair">
              More Than Value, it&apos;s Spiritual Worth
            </h2>
            <p className="text-xl md:text-2xl mb-10 font-thai font-light text-gray-700">
              &ldquo;มากกว่าคุณค่าทางใจคือคุณค่าทางจิตวิญญาณ&rdquo;
            </p>
            <div className="space-y-8 text-lg text-gray-600">
              <p className="font-thai leading-relaxed">
                ร้อยหิน คือสถานที่สร้างศิลปะแห่งสายหินที่ให้ความหมายเฉพาะตัวคุณ
                ด้วยการผสมผสานศาสตร์โบราณและความเข้าใจสมัยใหม่
                เรานำหินธรรมชาติที่มีพลังแห่งการบำบัดมาร้อยเรียงอย่างพิถีพิถัน
                เพื่อสร้างเครื่องประดับที่ไม่เพียงสวยงาม
                แต่ยังช่วยเสริมสร้างพลังชีวิตให้กับผู้สวมใส่
              </p>
              <p className="leading-relaxed">
                ROIHIN is a place where stone artistry is created with personal meaning for you. By
                combining ancient wisdom with modern understanding, we carefully string natural
                stones with healing powers to create jewelry that is not only beautiful but also
                enhances the life force of the wearer.
              </p>
            </div>
            <Button variant="green" size="lg" className="mt-10">
              เรียนรู้เพิ่มเติม
            </Button>
          </div>
        </div>
      </section>

      {/* Signature Charm Section with Parallax */}
      <ParallaxSection
        imageUrl="/images/357c3a_2013cc64ddf74b35b6a0d668ae5effb8~mv2.avif"
        imageAlt="Signature charm background"
        overlayOpacity={0.7}
        parallaxSpeed={0.4}
        className="py-24"
      >
        <div id="charms" className="flex items-center justify-center px-4">
          <div className="grid md:grid-cols-1 gap-12 text-center items-center min-h-[750px] max-h-[750px]">
            <div className="space-y-6 text-white max-w-3xl">
              <h2 className="text-5xl md:text-6xl font-bold tracking-wide !font-playfair">
                SIGNATURE CHARM
              </h2>
              <p className="text-lg text-gray-300 font-thai leading-relaxed">
                ชาร์มเอกลักษณ์ของร้อยหิน ออกแบบด้วยความประณีตและใส่ใจในทุกรายละเอียด
                แต่ละชิ้นถูกสร้างขึ้นเพื่อเสริมพลังให้กับสายหินของคุณ
                ด้วยสัญลักษณ์ที่มีความหมายลึกซึ้งและพลังงานเฉพาะตัว
              </p>
              <Button variant="green" size="lg">
                ดูชาร์มเพิ่มเติม
              </Button>
            </div>
          </div>
        </div>
      </ParallaxSection>

      {/* Testimonials Section */}
      <section id="reviews" className="py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-4 !font-playfair">
            TESTIMONIALS
          </h2>
          <p className="text-2xl md:text-3xl font-thai text-center mb-16 text-gray-300">
            เสียงตอบรับจากผู้ใช้จริง
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-8 space-y-4">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-5 h-5 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-gray-300 font-thai leading-relaxed">
                &ldquo;สายหินที่ได้รับทำให้รู้สึกถึงพลังงานที่ดีขึ้นอย่างชัดเจน
                รู้สึกมีความมั่นใจและสมดุลในชีวิตมากขึ้น ขอบคุณร้อยหินที่ใส่ใจในทุกรายละเอียด&rdquo;
              </p>
              <div className="pt-4 border-t border-white/20">
                <p className="font-semibold">คุณสุภาพร</p>
                <p className="text-sm text-gray-400 font-thai">ลูกค้าจากกรุงเทพฯ</p>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-8 space-y-4">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-5 h-5 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-gray-300 font-thai leading-relaxed">
                &ldquo;ประทับใจมากกับการให้คำปรึกษาที่ละเอียด ได้สายหินที่เหมาะกับตัวเองจริงๆ
                สวมใส่แล้วรู้สึกถึงการเปลี่ยนแปลงในทางที่ดี&rdquo;
              </p>
              <div className="pt-4 border-t border-white/20">
                <p className="font-semibold">คุณวิชัย</p>
                <p className="text-sm text-gray-400 font-thai">ลูกค้าจากภูเก็ต</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button variant="green" size="lg">
              อ่านเพิ่มเติม
            </Button>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <ParallaxSection
        imageUrl="https://static.wixstatic.com/media/357c3a_449b1b790747456cb742616cdedb4af0~mv2.png/v1/fill/w_1265,h_834,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/357c3a_449b1b790747456cb742616cdedb4af0~mv2.png"
        imageAlt="Gallery background"
        overlayOpacity={0.6}
        parallaxSpeed={0.3}
        className="py-24"
      >
        <div className="container mx-auto px-4 text-white text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-4 !font-playfair">INSPIRED ROIHIN</h2>
          <p className="text-2xl md:text-3xl font-thai mb-16">
            แรงบันดาลใจ ขับเคลื่อนพลังงานนอกกฎเกณฑ์
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button variant="gold" size="lg">
              ออกแบบด้วยตัวเอง
            </Button>
            <Button variant="green" size="lg">
              ออกแบบโดยร้อยหิน
            </Button>
          </div>
        </div>
      </ParallaxSection>

      {/* Last Section - Vibrant Your Destiny */}
      <ParallaxSection
        imageUrl="https://static.wixstatic.com/media/357c3a_d5bbbe07a2cb43579ad4d33c6279ff5a~mv2.jpg/v1/fill/w_1265,h_1328,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/357c3a_d5bbbe07a2cb43579ad4d33c6279ff5a~mv2.jpg"
        imageAlt="Vibrant your destiny background"
        overlayOpacity={0.5}
        parallaxSpeed={0.4}
        className="py-32"
      >
        <div className="flex flex-col items-center justify-center px-4 text-center text-white min-h-[520px]">
          <h2 className="text-6xl md:text-8xl font-bold mb-8 tracking-wider text-shadow !font-playfair">
            VIBRANT YOUR DESTINY
          </h2>
          <p className="text-2xl md:text-3xl mb-4 tracking-wide">
            ROIHIN STONE AND BRACELET, THAILAND
          </p>
          <p className="text-xl md:text-2xl font-light tracking-widest">SINCE 2021</p>
        </div>
      </ParallaxSection>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <h4 className="font-semibold font-thai">ข้อมูลร้าน</h4>
              <ul className="space-y-2 text-gray-400 font-thai text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    เกี่ยวกับร้อยหิน
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    ประวัติร้าน
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    วิธีการสั่งซื้อ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    นโยบายความเป็นส่วนตัว
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold font-thai">บริการลูกค้า</h4>
              <ul className="space-y-2 text-gray-400 font-thai text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    ติดต่อสอบถาม
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    การจัดส่ง
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    การคืนสินค้า
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    การดูแลรักษา
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold font-thai">คอร์สเรียน</h4>
              <ul className="space-y-2 text-gray-400 font-thai text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    คอร์สร้อยหิน
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    คอร์สออนไลน์
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    วิเคราะห์ดวงชะตา
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    บทความ
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold font-thai">ติดต่อเรา</h4>
              <div className="space-y-2 text-gray-400 text-sm">
                <div className="flex items-start space-x-2">
                  <MapPin size={16} className="mt-1 flex-shrink-0" />
                  <span className="font-thai">
                    101/54 หมู่บ้าน ภัสสร 70 (เกาะแก้ว) หมู่ที่ 4 ตำบลเกาะแก้ว อ.เมืองภูเก็ต
                    จ.ภูเก็ต 83000
                  </span>
                </div>
                <div className="flex items-center space-x-2 pt-4">
                  <a href="#" className="hover:text-white">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                  <a href="#" className="hover:text-white">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z" />
                    </svg>
                  </a>
                  <a href="#" className="hover:text-white">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2021 All rights is reserved by Roihin Stone and Bracelet</p>
          </div>
        </div>
      </footer>

      <ChatWidget />
    </>
  )
}
