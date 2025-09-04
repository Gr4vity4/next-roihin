import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const LANGUAGE_KEY = 'site-language'
const DEFAULT_LANGUAGE = 'en'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  const languageHeader = request.headers.get('x-language')
  if (languageHeader && (languageHeader === 'en' || languageHeader === 'th')) {
    response.cookies.set(LANGUAGE_KEY, languageHeader, {
      httpOnly: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    })
  } else if (!request.cookies.has(LANGUAGE_KEY)) {
    response.cookies.set(LANGUAGE_KEY, DEFAULT_LANGUAGE, {
      httpOnly: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    })
  }
  
  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.webp$|.*\\.avif$|.*\\.svg$).*)',
  ],
}