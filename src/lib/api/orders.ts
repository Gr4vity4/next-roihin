import { getLaravelApiEndpoint } from '@/config/api.config'
import type {
  CancelOrderPayload,
  OrderDetailResponse,
  OrdersListResponse,
  OrderStatus,
} from '@/lib/types/order'

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

  const message = (body as Record<string, unknown>).message
  if (typeof message === 'string' && message.trim().length > 0) {
    return message
  }

  const error = (body as Record<string, unknown>).error
  if (typeof error === 'string' && error.trim().length > 0) {
    return error
  }

  const errors = (body as Record<string, unknown>).errors
  if (errors && typeof errors === 'object') {
    const first = Object.values(errors as Record<string, unknown>)[0]
    if (Array.isArray(first) && first.length > 0) {
      const messageCandidate = first[0]
      if (typeof messageCandidate === 'string') {
        return messageCandidate
      }
    }
  }

  return fallback
}

export async function fetchOrders(token: string): Promise<OrdersListResponse> {
  const response = await fetch(getLaravelApiEndpoint('/orders'), {
    headers: buildAuthHeaders(token),
    cache: 'no-store',
  })

  if (response.status === 401) {
    throw new Error('UNAUTHORIZED')
  }

  if (!response.ok) {
    const body = await parseJsonResponse<unknown>(response)
    throw new Error(extractErrorMessage(body, 'Failed to load orders'))
  }

  return parseJsonResponse<OrdersListResponse>(response)
}

export async function fetchOrder(token: string, orderId: string | number): Promise<OrderDetailResponse> {
  const response = await fetch(getLaravelApiEndpoint(`/orders/${orderId}`), {
    headers: buildAuthHeaders(token),
    cache: 'no-store',
  })

  if (response.status === 401) {
    throw new Error('UNAUTHORIZED')
  }

  if (response.status === 404) {
    throw new Error('NOT_FOUND')
  }

  if (!response.ok) {
    const body = await parseJsonResponse<unknown>(response)
    throw new Error(extractErrorMessage(body, 'Failed to load order'))
  }

  return parseJsonResponse<OrderDetailResponse>(response)
}

export interface CreateOrderItemPayload {
  product_id?: number | null
  product_name?: string | null
  sku?: string | null
  unit_price_minor: number
  quantity: number
  options?: Record<string, unknown> | null
}

export interface CreateOrderPayload {
  items: CreateOrderItemPayload[]
  shipping_address_id?: number | null
  shipping_address?: Record<string, unknown>
  currency?: string
  shipping_amount_minor?: number
  discount_amount_minor?: number
  shipping_carrier?: string | null
  shipping_method?: string | null
  notes?: string | null
  metadata?: Record<string, unknown>
  locale?: string
}

export async function createOrder(
  token: string,
  payload: CreateOrderPayload,
): Promise<OrderDetailResponse & { stripe?: { checkout_session_id?: string | null; checkout_url?: string | null } }> {
  const response = await fetch(getLaravelApiEndpoint('/orders'), {
    method: 'POST',
    headers: buildAuthHeaders(token, { 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  })

  const body = await parseJsonResponse<
    (OrderDetailResponse & { stripe?: { checkout_session_id?: string | null; checkout_url?: string | null } }) &
      Record<string, unknown>
  >(response)

  if (!response.ok) {
    throw new Error(extractErrorMessage(body, 'Failed to create order'))
  }

  return body
}

export async function cancelOrder(
  token: string,
  orderId: string | number,
  payload: CancelOrderPayload = {}
): Promise<OrderDetailResponse> {
  const response = await fetch(getLaravelApiEndpoint(`/orders/${orderId}/cancel`), {
    method: 'POST',
    headers: buildAuthHeaders(token, { 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  })

  if (response.status === 401) {
    throw new Error('UNAUTHORIZED')
  }

  const body = await parseJsonResponse<OrderDetailResponse & Record<string, unknown>>(response)

  if (!response.ok) {
    throw new Error(extractErrorMessage(body, 'Failed to cancel order'))
  }

  return body
}

export function mapStatusToFilter(status?: string | null): OrderStatus | 'all' {
  if (!status) return 'all'
  const normalized = status.toLowerCase() as OrderStatus
  const allowed: Array<OrderStatus | 'all'> = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
  return allowed.includes(normalized) ? normalized : 'all'
}
