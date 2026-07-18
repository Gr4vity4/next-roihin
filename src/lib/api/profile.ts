import { getLaravelApiEndpoint } from '@/config/api.config'
import { getAuthToken } from '@/lib/auth/get-token'

export interface ProfileData {
  id: number
  name: string
  email: string
  phone: string | null
  birth_date: string | null
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null
  shipping_phone: string | null
  shipping_first_name: string | null
  shipping_last_name: string | null
  shipping_address: string | null
  shipping_apartment: string | null
  shipping_city: string | null
  shipping_province: string | null
  shipping_postal_code: string | null
  created_at: string
  updated_at: string
}

export interface UpdateProfileData {
  name?: string
  email?: string
  phone?: string
  birth_date?: string | null
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null
  shipping_phone?: string
  shipping_first_name?: string
  shipping_last_name?: string
  shipping_address?: string
  shipping_apartment?: string
  shipping_city?: string
  shipping_province?: string
  shipping_postal_code?: string
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

  const responseData = await response.json()

  if (!response.ok) {
    console.error('Laravel API error:', responseData)
    throw new Error(responseData.message || 'Failed to fetch profile')
  }

  const data = responseData.user || responseData.data || responseData

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

  const data = responseData.user || responseData.data || responseData

  return data
}
