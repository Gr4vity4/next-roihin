// generated order types
export type OrderStatus =
  | 'pending'
  | 'waiting_verification'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export interface PaymentResource {
  id: number
  provider: string
  status: string
  amount_minor: number
  currency: string
  provider_payment_intent_id?: string | null
  provider_checkout_session_id?: string | null
  provider_charge_id?: string | null
  captured_at?: string | null
  refunded_at?: string | null
  payment_method_details?: Record<string, unknown> | null
  metadata?: Record<string, unknown> | null
  has_payment_slip?: boolean
  slip_uploaded_at?: string | null
  created_at?: string | null
  updated_at?: string | null
}

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
  first_name: string
  last_name: string
  phone: string
  address: string
  apartment?: string | null
  city: string
  province: string
  postal_code: string
  email?: string | null
  // Legacy fields — present only on order snapshots created before the address
  // restructure. Kept optional so historical orders still render.
  full_name?: string | null
  subdistrict?: string | null
  district?: string | null
  country?: string | null
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
  payments?: PaymentResource[]
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

export interface OrderCreateItem {
  product_id: number
  quantity: number
  price: number
  total: number
}

export interface OrderCreateBilling {
  first_name: string
  last_name: string
  email: string
  phone: string
  address_1: string
  address_2?: string | null
  city: string
  state: string
  postcode: string
  country: string
}

export interface OrderCreateRequest {
  items: OrderCreateItem[]
  billing: OrderCreateBilling
  payment_method: string
  shipping_total: number
  total: number
  subtotal: number
  note?: string
}
