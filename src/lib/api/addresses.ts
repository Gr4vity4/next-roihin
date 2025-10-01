import { WORDPRESS_API_URL } from '@/config/api.config'
import { getAuthToken } from '@/lib/auth/get-token'

const API_URL = WORDPRESS_API_URL

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

export interface CreateAddressData {
  full_name: string
  phone: string
  address: string
  subdistrict: string
  district: string
  province: string
  postal_code: string
  country?: string
  set_default?: boolean
}

export interface UpdateAddressData {
  full_name?: string
  phone?: string
  address?: string
  subdistrict?: string
  district?: string
  province?: string
  postal_code?: string
  country?: string
}

export async function listAddresses(): Promise<AddressesResponse> {
  const token = await getAuthToken()
  
  if (!token) {
    throw new Error('No authentication token found')
  }

  const response = await fetch(`${API_URL}/wp-json/roihin/v1/addresses`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch addresses')
  }

  return response.json()
}

export async function createAddress(data: CreateAddressData): Promise<Address> {
  const token = await getAuthToken()
  
  if (!token) {
    throw new Error('No authentication token found')
  }

  const response = await fetch(`${API_URL}/wp-json/roihin/v1/addresses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  const result = await response.json()
  
  if (!response.ok) {
    throw new Error(result.message || 'Failed to create address')
  }
  
  return result
}

export async function updateAddress(id: string, data: UpdateAddressData): Promise<Address> {
  const token = await getAuthToken()
  
  if (!token) {
    throw new Error('No authentication token found')
  }

  const response = await fetch(`${API_URL}/wp-json/roihin/v1/addresses/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  const result = await response.json()
  
  if (!response.ok) {
    throw new Error(result.message || 'Failed to update address')
  }
  
  return result
}

export async function deleteAddress(id: string): Promise<{ message: string }> {
  const token = await getAuthToken()
  
  if (!token) {
    throw new Error('No authentication token found')
  }

  const response = await fetch(`${API_URL}/wp-json/roihin/v1/addresses/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const result = await response.json()
  
  if (!response.ok) {
    throw new Error(result.message || 'Failed to delete address')
  }
  
  return result
}

export async function setDefaultAddress(id: string): Promise<{ default_id: string }> {
  const token = await getAuthToken()
  
  if (!token) {
    throw new Error('No authentication token found')
  }

  const response = await fetch(`${API_URL}/wp-json/roihin/v1/addresses/${id}/default`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const result = await response.json()
  
  if (!response.ok) {
    throw new Error(result.message || 'Failed to set default address')
  }
  
  return result
}