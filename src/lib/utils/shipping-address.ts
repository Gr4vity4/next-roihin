import type { ShippingAddress } from '@/lib/types/order'

/**
 * Display helpers for order shipping addresses.
 *
 * Orders store a snapshot of the address at purchase time. New snapshots use
 * the restructured contract (first_name/last_name/apartment/city); snapshots
 * created before the migration may still carry the legacy shape
 * (full_name/subdistrict/district/country). These helpers render either.
 */

export function formatRecipientName(address: ShippingAddress): string {
  const composed = [address.first_name, address.last_name]
    .filter((part) => part && part.trim())
    .join(' ')
    .trim()

  return composed || address.full_name?.trim() || ''
}

/**
 * The address body lines, in display order, skipping any that are empty.
 * Falls back to legacy fields (subdistrict → apartment slot, district → city,
 * and the legacy country line) for pre-migration order snapshots.
 *
 * `resolveProvince` maps the stored canonical province value to a localized
 * label (Thai/English). It falls back to the raw value for unknown/legacy
 * free-text provinces; the default is the identity function.
 */
export function getShippingAddressLines(
  address: ShippingAddress,
  resolveProvince: (value: string) => string = (value) => value
): string[] {
  const lines: string[] = []

  if (address.address) {
    lines.push(address.address)
  }

  const secondary = address.apartment || address.subdistrict
  if (secondary) {
    lines.push(secondary)
  }

  const city = address.city || address.district || ''
  // '-' is the placeholder for international addresses with no Thai province.
  const province =
    address.province && address.province !== '-' ? resolveProvince(address.province) : ''
  const cityProvince = [city, province].filter(Boolean).join(', ')
  const regionLine = [cityProvince, address.postal_code].filter(Boolean).join(' ').trim()
  if (regionLine) {
    lines.push(regionLine)
  }

  // Legacy-only: newer snapshots omit country entirely.
  if (address.country) {
    lines.push(address.country)
  }

  return lines
}
