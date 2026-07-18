import { NextResponse } from 'next/server'
import { getLaravelApiEndpoint } from '@/config/api.config'
import { getCacheHeaders } from '@/config/cache.config'
import { getErrorMessage } from '@/lib/utils/error-handler'

/**
 * GET /api/shipping-zones/match?country=XX
 *
 * Public proxy to the Laravel `GET /api/v1/shipping-zones/match` endpoint used
 * to price shipping at checkout. `country` is an ISO 3166-1 alpha-2 code;
 * countries outside every configured zone fall back to the backend's `row`
 * (rest-of-world) zone, so a valid code always resolves to a fee.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const country = searchParams.get('country')

    if (!country || !/^[a-zA-Z]{2}$/.test(country)) {
      return NextResponse.json(
        { error: 'A two-letter ISO country code is required' },
        { status: 422 }
      )
    }

    const endpoint = `/shipping-zones/match?country=${encodeURIComponent(country.toUpperCase())}`
    const response = await fetch(getLaravelApiEndpoint(endpoint), {
      headers: { Accept: 'application/json' },
      next: { revalidate: 900 },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to match shipping zone' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data, { headers: getCacheHeaders('mediumTerm') })
  } catch (error) {
    console.error('Shipping zone match GET error:', error)
    return NextResponse.json(
      { error: getErrorMessage(error, 'Failed to match shipping zone') },
      { status: 500 }
    )
  }
}
