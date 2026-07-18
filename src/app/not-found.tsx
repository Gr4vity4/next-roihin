import Link from 'next/link'
import { routing } from '@/i18n/routing'
import './globals.css'

// Global fallback for requests that don't match the `[locale]` segment
// (e.g. `/some-file.txt`). Locale can't be resolved here, so we fall back to
// the default locale. Localized routes (`/th/...`, `/en/...`) are handled by
// `[locale]/not-found.tsx` via the catch-all route instead.
export default function GlobalNotFound() {
  const isThai = routing.defaultLocale === 'th'

  return (
    <html lang={routing.defaultLocale}>
      <body className="antialiased">
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
          <div className="text-center max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-[#D4AF37] text-4xl font-bold">404</span>
            </div>

            <h1 className="text-[#006039] mb-4 text-2xl lg:text-3xl font-semibold">
              {isThai ? 'ไม่พบหน้าที่คุณค้นหา' : 'Page Not Found'}
            </h1>

            <p className="text-gray-600 mb-8 max-w-xl mx-auto leading-relaxed">
              {isThai
                ? 'ขออภัย หน้าที่คุณกำลังมองหาอาจถูกลบ ย้ายที่ หรือไม่เคยมีอยู่เลย กรุณาตรวจสอบ URL หรือกลับไปที่หน้าแรกเพื่อค้นหาสิ่งที่คุณต้องการ'
                : 'Sorry, the page you are looking for might have been removed, moved, or never existed. Please check the URL or return to the homepage.'}
            </p>

            <Link
              href={`/${routing.defaultLocale}`}
              className="inline-flex items-center px-8 py-3 bg-[#006039] text-white rounded-md hover:bg-[#004D2E] transition-colors duration-200 font-medium shadow-md hover:shadow-lg"
            >
              {isThai ? 'กลับหน้าแรก' : 'Go Home'}
            </Link>
          </div>
        </div>
      </body>
    </html>
  )
}
