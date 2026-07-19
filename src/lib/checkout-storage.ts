// Shipping details from the shopper's most recent successful checkout, saved
// so repeat customers get a prefilled form even without a saved default
// address. Scoped to the user id so another account on a shared browser never
// sees them, and purged on explicit logout like the persisted `user` record.
// Passive session expiry deliberately keeps the record: purging on every
// cookie expiry would blank the prefill for exactly the repeat customers it
// serves, and the userId guard already blocks reads by anyone else.

export interface StoredShippingFields {
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  apartment: string
  postal_code: string
  city: string
  province: string
}

export interface StoredLastShipping {
  userId: number
  phoneCountry: string
  shipping: StoredShippingFields
}

const LAST_SHIPPING_STORAGE_KEY = 'checkout_last_shipping'

export function readLastShipping(userId: number): StoredLastShipping | null {
  try {
    const raw = window.localStorage.getItem(LAST_SHIPPING_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredLastShipping | null
    if (!parsed || parsed.userId !== userId || !parsed.shipping) return null
    return parsed
  } catch (error) {
    console.error(`Error reading localStorage key "${LAST_SHIPPING_STORAGE_KEY}":`, error)
    return null
  }
}

export function saveLastShipping(entry: StoredLastShipping): void {
  try {
    window.localStorage.setItem(LAST_SHIPPING_STORAGE_KEY, JSON.stringify(entry))
  } catch (error) {
    console.error(`Error setting localStorage key "${LAST_SHIPPING_STORAGE_KEY}":`, error)
  }
}

export function clearLastShipping(): void {
  try {
    window.localStorage.removeItem(LAST_SHIPPING_STORAGE_KEY)
  } catch (error) {
    console.error(`Error removing localStorage key "${LAST_SHIPPING_STORAGE_KEY}":`, error)
  }
}
