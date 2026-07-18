import { NextResponse } from 'next/server'
import { getLaravelApiEndpoint } from '@/config/api.config'
import { getCacheHeaders } from '@/config/cache.config'
import { getErrorMessage } from '@/lib/utils/error-handler'

/**
 * GET /api/provinces
 *
 * Public proxy to the Laravel `GET /api/v1/provinces` endpoint used to populate
 * the shipping-address Province dropdown. Forwards the `locale` query so the
 * backend can localize the `label` field (Thai vs English).
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale')
    const endpoint = locale
      ? `/provinces?locale=${encodeURIComponent(locale)}`
      : '/provinces'

    const response = await fetch(getLaravelApiEndpoint(endpoint), {
      headers: { Accept: 'application/json' },
      next: { revalidate: 86400 },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to load provinces' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data, { headers: getCacheHeaders('longTerm') })
  } catch (error) {
    console.error('Provinces GET error:', error)
    return NextResponse.json(
      { error: getErrorMessage(error, 'Failed to load provinces') },
      { status: 500 }
    )
  }
}
