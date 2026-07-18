'use client'

import { useEffect } from 'react'
import { Link } from '@/i18n/navigation'
import { Container, Typography } from '@/components/ui'
import { useLocale } from 'next-intl'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
      />
    </svg>
  )
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  )
}

export default function Error({ error, reset }: ErrorProps) {
  const locale = useLocale()
  const isThai = locale === 'th'

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Container>
        <div className="text-center max-w-2xl mx-auto">
          {/* Error Icon */}
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg 
              className="w-12 h-12 text-red-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
          </div>
          
          {/* Error Message */}
          <Typography
            variant="h2"
            className="text-[#244323] mb-4 text-2xl lg:text-3xl"
          >
            {isThai ? 'เกิดข้อผิดพลาด' : 'Something went wrong'}
          </Typography>
          
          <Typography
            variant="h3"
            className="text-gray-800 mb-6 text-xl"
          >
            {isThai ? 'ระบบเกิดข้อผิดพลาด' : 'An unexpected error occurred'}
          </Typography>
          
          <Typography
            variant="body"
            className="text-gray-600 mb-6 max-w-xl mx-auto leading-relaxed"
          >
            {isThai
              ? 'ขออภัยในความไม่สะดวก เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองรีเฟรชหน้าเว็บหรือติดต่อเราหากปัญหายังคงอยู่'
              : 'We apologize for the inconvenience. Please refresh the page or contact us if the problem persists.'}
          </Typography>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button
              onClick={reset}
              className="inline-flex items-center px-8 py-3 bg-[#244323] text-white rounded-md hover:bg-[#004D2E] transition-colors duration-200 font-medium shadow-md hover:shadow-lg"
            >
              <RefreshIcon className="h-5 w-5 mr-2" />
              <Typography
                variant="body"
              >
                {isThai ? 'ลองใหม่อีกครั้ง' : 'Try Again'}
              </Typography>
            </button>
            
            <Link
              href="/"
              className="inline-flex items-center px-8 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200 font-medium"
            >
              <HomeIcon className="h-5 w-5 mr-2" />
              <Typography
                variant="body"
              >
                {isThai ? 'กลับหน้าแรก' : 'Go Home'}
              </Typography>
            </Link>
          </div>

          {/* Support Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <Typography
              variant="h4"
              className="text-gray-800 mb-3"
            >
              {isThai ? 'ต้องการความช่วยเหลือ?' : 'Need Help?'}
            </Typography>
            
            <Typography
              variant="body"
              className="text-gray-600 mb-2"
            >
              {isThai
                ? 'หากปัญหายังคงอยู่ กรุณาติดต่อเราได้ที่:'
                : 'If the problem persists, please contact us at:'}
            </Typography>

            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
              <Link 
                href="/customer-service" 
                className="text-[#244323] hover:text-[#004D2E] transition-colors"
              >
                {isThai ? 'ศูนย์ช่วยเหลือ' : 'Customer Service'}
              </Link>
            </div>
          </div>

          {/* Development Error Details */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 p-4 bg-red-50 border border-red-200 text-left rounded-lg">
              <Typography variant="caption" className="text-red-700 font-mono text-sm">
                <strong>Development Error:</strong>
                <br />
                {error.message}
                {error.digest && (
                  <>
                    <br />
                    <strong>Error ID:</strong> {error.digest}
                  </>
                )}
              </Typography>
            </div>
          )}
        </div>
      </Container>
    </div>
  )
}
