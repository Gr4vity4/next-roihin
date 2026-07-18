/**
 * Thai provinces API helpers
 *
 * The Laravel backend exposes a public `GET /api/v1/provinces` endpoint that
 * returns the canonical list of 77 Thai provinces. The `value` is the canonical
 * English name that must be submitted back on address/order payloads (the
 * backend validates `province` against this list). `label` is localized via the
 * `?locale=` query — Thai names when `locale=th`, English otherwise.
 */

export interface Province {
  /** Canonical English name — submit this back to the API */
  value: string
  /** Localized display name (Thai when locale=th, English otherwise) */
  label: string
  name_en: string
  name_th: string
}

export interface ProvincesResponse {
  items: Province[]
}

/**
 * Fetch the province list through the Next.js proxy route.
 * Client-safe (uses a relative URL).
 */
export async function fetchProvinces(locale?: string): Promise<Province[]> {
  const query = locale ? `?locale=${encodeURIComponent(locale)}` : ''
  const response = await fetch(`/api/provinces${query}`)

  if (!response.ok) {
    throw new Error('Failed to load provinces')
  }

  const data = (await response.json()) as ProvincesResponse
  return Array.isArray(data.items) ? data.items : []
}
