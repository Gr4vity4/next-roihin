import Link from 'next/link'
import { Container, Typography } from '@/components/ui'

// Simple SVG icon component
function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  )
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Container>
        <div className="text-center max-w-2xl mx-auto">
          {/* Decorative Element */}
          <div className="w-24 h-24 bg-[#D4AF37] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Typography variant="h1" className="text-[#D4AF37] text-4xl font-bold">
              404
            </Typography>
          </div>
          
          {/* Error Message */}
          <Typography
            variant="h2"
            className="text-[#006039] mb-4 text-2xl lg:text-3xl"
          >
            ไม่พบหน้าที่คุณค้นหา
          </Typography>
          
          <Typography
            variant="h3"
            className="text-gray-800 mb-6 text-xl"
          >
            Page Not Found
          </Typography>
          
          <Typography
            variant="body"
            className="text-gray-600 mb-8 max-w-xl mx-auto leading-relaxed"
          >
            ขออภัย หน้าที่คุณกำลังมองหาอาจถูกลบ ย้ายที่ หรือไม่เคยมีอยู่เลย 
            กรุณาตรวจสอบ URL หรือกลับไปที่หน้าแรกเพื่อค้นหาสิ่งที่คุณต้องการ
          </Typography>

          <Typography
            variant="body"
            className="text-gray-500 mb-8 max-w-xl mx-auto"
          >
            Sorry, the page you are looking for might have been removed, moved, or never existed. 
            Please check the URL or return to the homepage to find what you&apos;re looking for.
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
                กลับหน้าแรก / Go Home
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
                ดูบล็อก
              </Typography>
              <Typography variant="body">
                / View Blog
              </Typography>
            </Link>
          </div>

          {/* Helpful Links */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <Typography
              variant="caption"
              className="text-gray-500 mb-4 block"
            >
              หรือคุณอาจสนใจ / Or you might be interested in:
            </Typography>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link href="/about" className="text-[#006039] hover:text-[#004D2E] transition-colors">
                เกี่ยวกับเรา / About
              </Link>
              <span className="text-gray-300">•</span>
              <Link href="/personalized" className="text-[#006039] hover:text-[#004D2E] transition-colors">
                สร้างสร้อยส่วนตัว / Personalized
              </Link>
              <span className="text-gray-300">•</span>
              <Link href="/charmspacer" className="text-[#006039] hover:text-[#004D2E] transition-colors">
                จี้และแต่ง / Charms
              </Link>
              <span className="text-gray-300">•</span>
              <Link href="/customer-service" className="text-[#006039] hover:text-[#004D2E] transition-colors">
                ติดต่อ / Contact
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}