import Link from 'next/link'
import { BilingualText, Container, Typography } from '@/components/ui'

// Simple SVG icon component
function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  )
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Container>
        <div className="text-center max-w-2xl mx-auto">
          {/* 404 Title */}
          <Typography variant="h1" className="text-[#D4AF37] mb-4">
            404
          </Typography>
          
          {/* Error Message */}
          <BilingualText
            thai="ไม่พบบทความที่คุณค้นหา"
            english="Article Not Found"
            variant="h2"
            thaiClassName="font-thai text-[#006039] mb-4"
            englishClassName="font-playfair text-[#006039] mb-4 tracking-wider"
            gap="sm"
          />
          
          <BilingualText
            thai="ขออภัย บทความที่คุณกำลังมองหาอาจถูกลบ หรือย้ายไปแล้ว กรุณาตรวจสอบ URL หรือกลับไปที่หน้าบล็อกเพื่อค้นหาบทความอื่นๆ"
            english="Sorry, the article you're looking for might have been removed or moved. Please check the URL or return to the blog page to find other articles."
            variant="body"
            thaiClassName="font-thai text-gray-600 mb-8 max-w-xl mx-auto"
            englishClassName="text-gray-600 mb-8 max-w-xl mx-auto"
            gap="md"
          />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/blog"
              className="inline-flex items-center px-6 py-3 bg-[#006039] text-white rounded-lg hover:bg-[#004D2E] transition-colors duration-200 font-medium"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              <BilingualText
                thai="กลับไปบล็อก"
                english="Back to Blog"
                variant="body"
                thaiClassName="font-thai"
                englishClassName=""
                layout="horizontal"
                gap="sm"
              />
            </Link>
            
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
            >
              <BilingualText
                thai="กลับหน้าแรก"
                english="Go Home"
                variant="body"
                thaiClassName="font-thai"
                englishClassName=""
                layout="horizontal"
                gap="sm"
              />
            </Link>
          </div>
        </div>
      </Container>
    </div>
  )
}