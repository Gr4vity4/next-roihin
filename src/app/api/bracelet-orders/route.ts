import { NextResponse } from 'next/server'
import { getLaravelApiEndpoint } from '@/config/api.config'

/**
 * Transparent proxy for the public bracelet-order endpoint. The body is
 * forwarded byte-for-byte (JSON or multipart with the photo), and Laravel's
 * status codes (201 / 422 / 429) pass through so the form can map
 * validation errors back onto its fields.
 */
// photo cap is 2 MB; allow headroom for the other fields + multipart overhead
const MAX_BODY_BYTES = 3 * 1024 * 1024

export async function POST(request: Request) {
  try {
    // Node route handlers have no built-in body limit; without this an
    // unauthenticated caller could buffer arbitrarily large uploads into
    // memory. Browser fetch always sends Content-Length for JSON/FormData,
    // so rejecting length-less (chunked) bodies never affects the form.
    const contentLength = Number(request.headers.get('content-length') ?? NaN)
    if (!Number.isFinite(contentLength) || contentLength > MAX_BODY_BYTES) {
      return NextResponse.json({ message: 'Payload too large' }, { status: 413 })
    }

    const body = await request.arrayBuffer()
    const contentType = request.headers.get('content-type')
    const acceptLanguage = request.headers.get('accept-language')
    const forwardedFor = request.headers.get('x-forwarded-for')

    const response = await fetch(getLaravelApiEndpoint('/bracelet-orders'), {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        ...(contentType ? { 'Content-Type': contentType } : {}),
        ...(acceptLanguage ? { 'Accept-Language': acceptLanguage } : {}),
        // Laravel rate-limits per IP; without this every visitor would share
        // the Next server's address.
        ...(forwardedFor ? { 'X-Forwarded-For': forwardedFor } : {}),
      },
      body,
      cache: 'no-store',
    })

    const data = await response.json().catch(() => null)

    if (data !== null) {
      return NextResponse.json(data, { status: response.status })
    }

    return new NextResponse(null, { status: response.status })
  } catch (error) {
    console.error('Bracelet order POST error:', error)
    return NextResponse.json(
      { message: 'Failed to submit bracelet order' },
      { status: 502 }
    )
  }
}
