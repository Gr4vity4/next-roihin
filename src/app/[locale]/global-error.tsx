'use client'

import { useEffect } from 'react'
import { Container, Typography } from '@/components/ui'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const isThai =
    typeof window !== 'undefined' && document.documentElement.lang.startsWith('th')

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error:', error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Container>
            <div className="max-w-md mx-auto text-center">
              <div className="mb-8">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg 
                    className="w-10 h-10 text-red-600" 
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
                
                <Typography variant="h2" className="text-gray-900 mb-2">
                  {isThai ? 'เกิดข้อผิดพลาด' : 'Something went wrong'}
                </Typography>
                
                <Typography variant="h2" className="text-gray-900 mb-4 text-xl">
                  {isThai ? 'ระบบเกิดข้อผิดพลาด' : 'An unexpected error occurred'}
                </Typography>
                
                <Typography 
                  variant="body" 
                  className="text-gray-600 mb-6"
                >
                  {isThai
                    ? 'ขออภัยในความไม่สะดวก เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง'
                    : 'We apologize for the inconvenience. An unexpected error occurred. Please try again.'}
                </Typography>
              </div>

              <div className="space-y-4">
                <button
                  onClick={reset}
                  className="w-full bg-[#006039] text-white px-6 py-3 hover:bg-[#006039]/90 transition-colors font-medium"
                >
                  {isThai ? 'ลองใหม่อีกครั้ง' : 'Try Again'}
                </button>
                
                <button
                  onClick={() => window.location.href = "/"}
                  className="block w-full bg-gray-200 text-gray-700 px-6 py-3 hover:bg-gray-300 transition-colors font-medium"
                >
                  {isThai ? 'กลับหน้าแรก' : 'Back to Home'}
                </button>
              </div>

              {process.env.NODE_ENV === 'development' && (
                <div className="mt-8 p-4 bg-red-50 border border-red-200 text-left">
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
      </body>
    </html>
  )
}
