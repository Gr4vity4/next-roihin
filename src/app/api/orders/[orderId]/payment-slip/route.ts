import { NextResponse } from 'next/server'
import { getAuthToken } from '@/lib/auth/get-token'
import { getLaravelApiEndpoint } from '@/config/api.config'

interface RouteParams {
  params: Promise<{ orderId: string }>
}

// Laravel accepts slips up to 5 MB; allow headroom for multipart overhead
const MAX_BODY_BYTES = 6 * 1024 * 1024

/**
 * Transparent proxy for the payment-slip upload. The multipart body is
 * forwarded byte-for-byte (preserving the boundary in Content-Type), and
 * Laravel's status codes (200 / 404 / 422) pass through so the checkout and
 * thank-you pages can surface validation errors.
 */
export async function POST(request: Request, { params }: RouteParams) {
  const { orderId } = await params
  try {
    const token = await getAuthToken()

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Node route handlers have no built-in body limit; without this a caller
    // could buffer arbitrarily large uploads into memory. Browser fetch always
    // sends Content-Length for FormData, so rejecting length-less (chunked)
    // bodies never affects the upload forms.
    const contentLength = Number(request.headers.get('content-length') ?? NaN)
    if (!Number.isFinite(contentLength) || contentLength > MAX_BODY_BYTES) {
      return NextResponse.json({ message: 'Payload too large' }, { status: 413 })
    }

    const body = await request.arrayBuffer()
    const contentType = request.headers.get('content-type')

    const response = await fetch(getLaravelApiEndpoint(`/orders/${orderId}/payment-slip`), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        ...(contentType ? { 'Content-Type': contentType } : {}),
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
    console.error(`Payment slip POST error (${orderId}):`, error)
    return NextResponse.json({ error: 'Failed to upload payment slip' }, { status: 502 })
  }
}

/**
 * Streams the uploaded slip image back to the owner (used for the preview
 * thumbnail on the thank-you page). Binary body and Content-Type pass through.
 */
export async function GET(_: Request, { params }: RouteParams) {
  const { orderId } = await params
  try {
    const token = await getAuthToken()

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const response = await fetch(getLaravelApiEndpoint(`/orders/${orderId}/payment-slip`), {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      const data = await response.json().catch(() => null)

      if (data !== null) {
        return NextResponse.json(data, { status: response.status })
      }

      return new NextResponse(null, { status: response.status })
    }

    const contentType = response.headers.get('content-type')

    return new NextResponse(response.body, {
      status: response.status,
      headers: {
        ...(contentType ? { 'Content-Type': contentType } : {}),
        'Cache-Control': 'private, no-store',
      },
    })
  } catch (error) {
    console.error(`Payment slip GET error (${orderId}):`, error)
    return NextResponse.json({ error: 'Failed to load payment slip' }, { status: 502 })
  }
}
