// generated order types
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export interface OrderItem {
  id: number
  product_id?: number | null
  product_name: string
  sku?: string | null
  unit_price_minor: number
  quantity: number
  subtotal_amount_minor: number
  options?: Record<string, unknown> | null
}

export interface ShippingAddress {
  id?: number
  full_name: string
  phone: string
  address: string
  subdistrict?: string | null
  district: string
  province: string
  postal_code: string
  country: string
}

export interface OrderResource {
  id: number
  order_number: string
  status: OrderStatus
  status_label?: string | null
  user_id: number
  items: OrderItem[]
  currency: string
  subtotal_amount_minor: number
  shipping_amount_minor: number
  discount_amount_minor: number
  total_amount_minor: number
  shipping_address?: ShippingAddress | null
  shipping_carrier?: string | null
  shipping_method?: string | null
  tracking_number?: string | null
  notes?: string | null
  metadata?: Record<string, unknown> | null
  placed_at: string | null
  paid_at?: string | null
  shipped_at?: string | null
  delivered_at?: string | null
  cancelled_at?: string | null
  created_at: string
  updated_at: string
}

export interface OrdersListResponse {
  data: OrderResource[]
}

export interface OrderDetailResponse {
  data: OrderResource
}

export interface CancelOrderPayload {
  reason?: string
  notes?: string
}
