import { Link } from '@/i18n/navigation'
import { Container, Typography } from '@/components/ui'
import { ArrowLeft } from 'lucide-react'
import { getLocale } from 'next-intl/server'

export default async function NotFound() {
  const locale = await getLocale()
  const isThai = locale === 'th'

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Container>
        <div className="text-center max-w-2xl mx-auto">
          {/* 404 Title */}
          <Typography variant="h1" className="text-[#D4AF37] mb-4">
            404
          </Typography>
          
          {/* Error Message */}
          <Typography
            variant="h2"
                        className="text-[#006039] mb-4"
          >
            {isThai ? 'ไม่พบบทความที่คุณค้นหา' : 'Article not found'}
          </Typography>
          
          <Typography
            variant="body"
                        className="text-gray-600 mb-8 max-w-xl mx-auto"
          >
            {isThai
              ? 'ขออภัย บทความที่คุณกำลังมองหาอาจถูกลบ หรือย้ายไปแล้ว กรุณากลับไปหน้าบล็อกเพื่อค้นหาบทความอื่น'
              : 'Sorry, the article you are looking for may have been removed or moved. Please return to the blog to browse other articles.'}
          </Typography>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/blog"
              className="inline-flex items-center px-6 py-3 bg-[#006039] text-white hover:bg-[#004D2E] transition-colors duration-200 font-medium"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <Typography
                variant="body"
                              >
                {isThai ? 'กลับไปบล็อก' : 'Back to blog'}
              </Typography>
            </Link>
            
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
            >
              <Typography
                variant="body"
                              >
                {isThai ? 'กลับหน้าแรก' : 'Back to home'}
              </Typography>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  )
}
