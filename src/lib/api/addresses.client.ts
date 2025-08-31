// Client-side address functions
export interface Address {
  id: string
  full_name: string
  phone: string
  address: string
  subdistrict: string
  district: string
  province: string
  postal_code: string
  country: string
  created_at: number
  updated_at: number
  is_default: boolean
}

export interface AddressesResponse {
  default_id: string | null
  items: Address[]
}

// Client-side helper function for fetching addresses
export async function getDefaultAddress(): Promise<{
  hasDefault: boolean
  id: string | null
  item: Address | null
}> {
  const response = await fetch('/api/addresses', {
    credentials: 'include',
  })

  if (!response.ok) {
    // If user is not authenticated or no addresses, return empty state
    if (response.status === 401 || response.status === 404) {
      return { hasDefault: false, id: null, item: null }
    }
    throw new Error('Failed to load addresses')
  }

  const data: AddressesResponse = await response.json()
  const item = data.items?.find((it) => it.is_default) ?? null
  
  return {
    hasDefault: Boolean(data.default_id),
    id: data.default_id || null,
    item,
  }
}