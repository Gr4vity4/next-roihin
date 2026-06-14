import { Link } from '@/i18n/navigation'
import { Container, Typography } from '@/components/ui'
import { getLocale } from 'next-intl/server'

// Simple SVG icon component
function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  )
}

export default async function NotFound() {
  const locale = await getLocale()
  const isThai = locale === 'th'

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Container>
        <div className="text-center max-w-2xl mx-auto">
          {/* Decorative Element */}
          <div className="w-24 h-24 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Typography variant="h1" className="text-[#D4AF37] text-4xl font-bold">
              404
            </Typography>
          </div>

          {/* Error Message */}
          <Typography
            variant="h2"
            className="text-[#006039] mb-6 text-2xl lg:text-3xl"
          >
            {isThai ? 'ไม่พบหน้าที่คุณค้นหา' : 'Page Not Found'}
          </Typography>

          <Typography
            variant="body"
            className="text-gray-600 mb-8 max-w-xl mx-auto leading-relaxed"
          >
            {isThai
              ? 'ขออภัย หน้าที่คุณกำลังมองหาอาจถูกลบ ย้ายที่ หรือไม่เคยมีอยู่เลย กรุณาตรวจสอบ URL หรือกลับไปที่หน้าแรกเพื่อค้นหาสิ่งที่คุณต้องการ'
              : "Sorry, the page you are looking for might have been removed, moved, or never existed. Please check the URL or return to the homepage."}
          </Typography>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/"
              className="inline-flex items-center px-8 py-3 bg-[#006039] text-white hover:bg-[#004D2E] transition-colors duration-200 font-medium shadow-md hover:shadow-lg"
            >
              <HomeIcon className="h-5 w-5 mr-2" />
              <Typography
                variant="body"
              >
                {isThai ? 'กลับหน้าแรก' : 'Go Home'}
              </Typography>
            </Link>
            
            <Link
              href="/blog"
              className="inline-flex items-center px-8 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
            >
              <Typography
                variant="body"
                className="mr-1"
              >
                {isThai ? 'ดูบล็อก' : 'View Blog'}
              </Typography>
            </Link>
          </div>

          {/* Helpful Links */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <Typography
              variant="caption"
              className="text-gray-500 mb-4 block"
            >
              {isThai ? 'หรือคุณอาจสนใจ:' : 'You might also be interested in:'}
            </Typography>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link href="/about" className="text-[#006039] hover:text-[#004D2E] transition-colors">
                {isThai ? 'เกี่ยวกับเรา' : 'About'}
              </Link>
              <span className="text-gray-300">•</span>
              <Link href="/personalized" className="text-[#006039] hover:text-[#004D2E] transition-colors">
                {isThai ? 'สร้างสร้อยส่วนตัว' : 'Personalized'}
              </Link>
              <span className="text-gray-300">•</span>
              <Link href="/charmspacer" className="text-[#006039] hover:text-[#004D2E] transition-colors">
                {isThai ? 'จี้และแต่ง' : 'Charms'}
              </Link>
              <span className="text-gray-300">•</span>
              <Link href="/customer-service" className="text-[#006039] hover:text-[#004D2E] transition-colors">
                {isThai ? 'ติดต่อ' : 'Contact'}
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
