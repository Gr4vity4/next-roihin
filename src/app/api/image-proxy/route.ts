import { NextRequest, NextResponse } from 'next/server'
import { LARAVEL_API_URL } from '@/config/api.config'

// Same-origin proxy for remote images that need to be drawn onto a canvas
// (bracelet design thumbnails). Canvas work requires clean (non-tainting)
// image loads, and the upstream hosts don't send CORS headers, so the browser
// loads them through this route instead. Only hosts we already trust for
// next/image may be proxied, so this cannot be used as an open proxy.

const STATIC_ALLOWED_HOSTNAMES = new Set([
  'images.unsplash.com',
  'static.wixstatic.com',
  'flagcdn.com',
])

const MAX_IMAGE_BYTES = 10 * 1024 * 1024

function envOrigins(): Set<string> {
  const origins = new Set<string>()
  const candidates = [
    LARAVEL_API_URL,
    process.env.NEXT_PUBLIC_WORDPRESS_API_URL,
    process.env.WORDPRESS_API_URL,
  ]
  for (const candidate of candidates) {
    if (!candidate) continue
    try {
      origins.add(new URL(candidate).origin)
    } catch {
      // Ignore malformed env values; they simply aren't allowed origins.
    }
  }
  return origins
}

function isAllowed(url: URL): boolean {
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return false
  }
  return envOrigins().has(url.origin) || STATIC_ALLOWED_HOSTNAMES.has(url.hostname)
}

export async function GET(request: NextRequest) {
  const target = request.nextUrl.searchParams.get('url')
  if (!target) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 })
  }

  let parsed: URL
  try {
    parsed = new URL(target)
  } catch {
    return NextResponse.json({ error: 'Invalid url parameter' }, { status: 400 })
  }

  if (!isAllowed(parsed)) {
    return NextResponse.json({ error: 'Origin not allowed' }, { status: 400 })
  }

  let upstream: Response
  try {
    upstream = await fetch(parsed.toString(), {
      headers: { Accept: 'image/*' },
      cache: 'no-store',
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch image' }, { status: 502 })
  }

  // Re-check after redirects so an open redirect on a trusted host can't
  // turn this into a proxy for arbitrary origins.
  try {
    if (upstream.url && !isAllowed(new URL(upstream.url))) {
      return NextResponse.json({ error: 'Origin not allowed' }, { status: 400 })
    }
  } catch {
    return NextResponse.json({ error: 'Origin not allowed' }, { status: 400 })
  }

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ error: 'Upstream image unavailable' }, { status: 502 })
  }

  const contentType = upstream.headers.get('content-type') ?? ''
  if (!contentType.toLowerCase().startsWith('image/')) {
    return NextResponse.json({ error: 'Upstream response is not an image' }, { status: 502 })
  }

  const contentLength = Number(upstream.headers.get('content-length') ?? 0)
  if (contentLength > MAX_IMAGE_BYTES) {
    return NextResponse.json({ error: 'Image too large' }, { status: 502 })
  }

  return new NextResponse(upstream.body, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=3600',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
