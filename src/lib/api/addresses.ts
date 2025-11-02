import { getLaravelApiEndpoint } from '@/config/api.config'

export interface ShippingAddressPayload {
  full_name: string
  phone: string
  address: string
  subdistrict: string
  district: string
  province: string
  postal_code: string
  country?: string | null
}

export interface ShippingAddressResponseItem {
  id: string
  full_name: string
  phone: string
  address: string
  subdistrict: string
  district: string
  province: string
  postal_code: string
  country: string
  is_default: boolean
  created_at: number | null
  updated_at: number | null
}

export interface ShippingAddressesResponse {
  default_id: string | null
  items: ShippingAddressResponseItem[]
}

function buildAuthHeaders(token: string, extra?: HeadersInit): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
    ...extra,
  }
}

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const text = await response.text()
  try {
    return text ? (JSON.parse(text) as T) : ({} as T)
  } catch {
    console.error('Failed to parse response JSON:', text)
    throw new Error('Unexpected server response')
  }
}

function extractErrorMessage(body: unknown, fallback: string): string {
  if (!body || typeof body !== 'object') {
    return fallback
  }

  const maybeMessage = 'message' in body ? body.message : undefined
  if (typeof maybeMessage === 'string' && maybeMessage.trim().length > 0) {
    return maybeMessage
  }

  const maybeError = 'error' in body ? body.error : undefined
  if (typeof maybeError === 'string' && maybeError.trim().length > 0) {
    return maybeError
  }

  if ('errors' in body && body.errors && typeof body.errors === 'object') {
    const firstErrorGroup = Object.values(body.errors as Record<string, unknown>)[0]
    if (Array.isArray(firstErrorGroup) && firstErrorGroup.length > 0) {
      const first = firstErrorGroup[0]
      if (typeof first === 'string') {
        return first
      }
    }
  }

  return fallback
}

export async function fetchAddresses(token: string): Promise<ShippingAddressesResponse> {
  const response = await fetch(getLaravelApiEndpoint('/addresses'), {
    headers: buildAuthHeaders(token),
    cache: 'no-store',
  })

  if (response.status === 401) {
    throw new Error('UNAUTHORIZED')
  }

  if (!response.ok) {
    const body = await parseJsonResponse<unknown>(response)
    throw new Error(extractErrorMessage(body, 'Failed to load addresses'))
  }

  const body = await parseJsonResponse<ShippingAddressesResponse>(response)
  return body
}

export async function createAddress(
  token: string,
  payload: ShippingAddressPayload & { set_default?: boolean }
): Promise<{ item: ShippingAddressResponseItem }>
export async function createAddress(
  token: string,
  payload: Record<string, unknown>
): Promise<{ item: ShippingAddressResponseItem }>
export async function createAddress(
  token: string,
  payload: (ShippingAddressPayload & { set_default?: boolean }) | Record<string, unknown>
): Promise<{ item: ShippingAddressResponseItem }> {
  const response = await fetch(getLaravelApiEndpoint('/addresses'), {
    method: 'POST',
    headers: buildAuthHeaders(token, { 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  })

  const body = await parseJsonResponse<{ item?: ShippingAddressResponseItem } & Record<string, unknown>>(response)

  if (!response.ok) {
    throw new Error(extractErrorMessage(body, 'Failed to create address'))
  }

  if (!body?.item) {
    throw new Error('Malformed response from server')
  }

  return { item: body.item }
}

export async function updateAddress(
  token: string,
  addressId: string,
  payload: Partial<ShippingAddressPayload>
): Promise<{ item: ShippingAddressResponseItem }> {
  const response = await fetch(getLaravelApiEndpoint(`/addresses/${addressId}`), {
    method: 'PATCH',
    headers: buildAuthHeaders(token, { 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  })

  const body = await parseJsonResponse<{ item?: ShippingAddressResponseItem } & Record<string, unknown>>(response)

  if (!response.ok) {
    throw new Error(extractErrorMessage(body, 'Failed to update address'))
  }

  if (!body?.item) {
    throw new Error('Malformed response from server')
  }

  return { item: body.item }
}

export async function deleteAddress(token: string, addressId: string): Promise<void> {
  const response = await fetch(getLaravelApiEndpoint(`/addresses/${addressId}`), {
    method: 'DELETE',
    headers: buildAuthHeaders(token),
  })

  if (response.status === 204) {
    return
  }

  const body = await parseJsonResponse<Record<string, unknown>>(response)

  if (!response.ok) {
    throw new Error(extractErrorMessage(body, 'Failed to delete address'))
  }
}

export async function setDefaultAddress(
  token: string,
  addressId: string
): Promise<{ default_id: string; item: ShippingAddressResponseItem }> {
  const response = await fetch(getLaravelApiEndpoint(`/addresses/${addressId}/default`), {
    method: 'POST',
    headers: buildAuthHeaders(token),
  })

  const body = await parseJsonResponse<{ default_id?: string; item?: ShippingAddressResponseItem } & Record<string, unknown>>(response)

  if (!response.ok) {
    throw new Error(extractErrorMessage(body, 'Failed to set default address'))
  }

  if (!body?.item || typeof body.default_id !== 'string') {
    throw new Error('Malformed response from server')
  }

  return { default_id: body.default_id, item: body.item }
}
