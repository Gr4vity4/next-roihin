import type { 
  OrderCreateRequest, 
  OrderResponse, 
  BankAccountsResponse,
  SlipUploadResponse 
} from '@/lib/types/order'

const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL || 'https://wp-roihin.precisiondevlab.com'
const API_BASE = `${WORDPRESS_API_URL}/wp-json/roihin/v1`

export async function createOrder(orderData: OrderCreateRequest): Promise<OrderResponse> {
  const response = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
    cache: 'no-store',
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to create order: ${error}`)
  }

  return response.json()
}

export async function getOrder(orderId: string, orderKey: string): Promise<OrderResponse> {
  const response = await fetch(`${API_BASE}/orders/${orderId}?key=${orderKey}`, {
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch order: ${response.status}`)
  }

  return response.json()
}

export async function uploadSlipFile(
  orderId: string, 
  orderKey: string, 
  file: File
): Promise<SlipUploadResponse> {
  const formData = new FormData()
  formData.append('slip', file)

  const response = await fetch(`${API_BASE}/orders/${orderId}/upload-slip?key=${orderKey}`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`Failed to upload slip: ${response.status}`)
  }

  return response.json()
}

export async function uploadSlipBase64(
  orderId: string, 
  orderKey: string, 
  slipBase64: string
): Promise<SlipUploadResponse> {
  const response = await fetch(`${API_BASE}/orders/${orderId}/upload-slip?key=${orderKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ slip_base64: slipBase64 }),
  })

  if (!response.ok) {
    throw new Error(`Failed to upload slip: ${response.status}`)
  }

  return response.json()
}

export async function getBankAccounts(): Promise<BankAccountsResponse> {
  const response = await fetch(`${API_BASE}/payment/bacs-accounts`, {
    cache: 'force-cache',
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch bank accounts: ${response.status}`)
  }

  return response.json()
}