export interface OrderItem {
  product_id: number
  variation_id?: number
  quantity: number
  color?: string
  price?: number
  total?: number
}

export interface BillingAddress {
  first_name: string
  last_name: string
  email: string
  phone: string
  address_1: string
  address_2?: string
  city: string
  state: string
  postcode: string
  country: string
}

export interface OrderCreateRequest {
  items: OrderItem[]
  billing: BillingAddress
  shipping?: BillingAddress
  payment_method: 'bacs'
  shipping_total: number
  total?: number
  subtotal?: number
  note?: string
  slip_base64?: string
}

export interface OrderItemResponse {
  item_id: number
  product_id: number
  name: string
  quantity: number
  total: string
  meta?: {
    color?: string
  }
}

export interface OrderTracking {
  number: string
  carrier: string
  url: string
  shipped_at: string
}

export interface Order {
  order_id: number
  order_number: string
  order_key: string
  status: string
  status_label: string
  currency: string
  total: string
  subtotal: string
  shipping_total: string
  payment_method: string
  payment_title: string
  created_at: string
  items: OrderItemResponse[]
  billing: BillingAddress
  shipping: BillingAddress
  slip: string | null
  tracking: OrderTracking
}

export interface OrderResponse {
  ok: boolean
  order: Order
  next?: {
    upload_slip: string
    get: string
  }
}

export interface SlipUploadResponse {
  ok: boolean
  slip_url: string
  order: Order
}

export interface BankAccount {
  account_name: string
  account_number: string
  bank_name: string
  iban?: string
  sort_code?: string
  bic?: string
}

export interface BankAccountsResponse {
  ok: boolean
  accounts: BankAccount[]
}