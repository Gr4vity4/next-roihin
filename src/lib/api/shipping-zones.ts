/**
 * Shipping zones API helpers
 *
 * The Laravel backend groups countries into shipping zones, each with a flat
 * fee. `GET /api/v1/shipping-zones/match?country=XX` resolves an ISO 3166-1
 * alpha-2 code to its zone; countries outside every configured zone fall back
 * to the `row` (rest-of-world) zone, so a valid code always yields a price.
 */

export interface ShippingZone {
  id: number
  code: string
  name: string
  /** Flat shipping fee in minor units (satang — divide by 100 for THB) */
  fee_minor: number
  currency: string
  sort_order: number
  /** ISO 3166-1 alpha-2 codes in the zone; empty on `row` (everything else) */
  countries: string[]
  created_at: string
  updated_at: string
}

interface ShippingZoneMatchResponse {
  data: ShippingZone
  meta?: { locale?: string; country?: string }
}

/**
 * Resolve the shipping zone (and fee) for a country through the Next.js proxy
 * route. Client-safe (uses a relative URL). `country` is an ISO 3166-1 alpha-2
 * code, case-insensitive.
 */
export async function fetchShippingZoneMatch(country: string): Promise<ShippingZone> {
  const response = await fetch(
    `/api/shipping-zones/match?country=${encodeURIComponent(country)}`
  )

  if (!response.ok) {
    throw new Error('Failed to match shipping zone')
  }

  const payload = (await response.json()) as ShippingZoneMatchResponse

  if (!payload?.data || typeof payload.data.fee_minor !== 'number') {
    throw new Error('Malformed shipping zone response')
  }

  return payload.data
}
