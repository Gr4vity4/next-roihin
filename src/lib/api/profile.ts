import { getLaravelApiEndpoint } from '@/config/api.config'
import { getAuthToken } from '@/lib/auth/get-token'

export interface ProfileData {
  id: number
  name: string
  email: string
  phone: string | null
  shipping_phone: string | null
  shipping_address: string | null
  shipping_district: string | null
  shipping_amphoe: string | null
  shipping_province: string | null
  shipping_zipcode: string | null
  created_at: string
  updated_at: string
}

export interface UpdateProfileData {
  name?: string
  email?: string
  phone?: string
  shipping_phone?: string
  shipping_address?: string
  shipping_district?: string
  shipping_amphoe?: string
  shipping_province?: string
  shipping_zipcode?: string
}

export async function getProfile(): Promise<ProfileData> {
  const token = await getAuthToken()

  if (!token) {
    throw new Error('No authentication token found')
  }

  const response = await fetch(getLaravelApiEndpoint('/auth/me'), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    const error = await response.json()
    console.error('Laravel API error:', error)
    throw new Error(error.message || 'Failed to fetch profile')
  }

  const responseData = await response.json()
  const data = responseData.data || responseData

  return data
}

export async function updateProfile(payload: UpdateProfileData): Promise<ProfileData> {
  const token = await getAuthToken()

  if (!token) {
    throw new Error('No authentication token found')
  }

  const response = await fetch(getLaravelApiEndpoint('/auth/me'), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  const responseData = await response.json()

  if (!response.ok) {
    console.error('Laravel update error:', responseData)
    throw new Error(responseData.message || 'Update failed')
  }

  const data = responseData.data || responseData

  return data
}
