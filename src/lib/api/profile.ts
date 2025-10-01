import { WORDPRESS_API_URL } from '@/config/api.config'
import { getAuthToken } from '@/lib/auth/get-token'

const API_URL = WORDPRESS_API_URL

export interface ProfileData {
  id: number
  email: string
  first_name: string
  last_name: string
  phone_number: string
  birth_date: string
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say'
  member_since: {
    raw: string
    human: string
  }
}

export interface UpdateProfileData {
  first_name?: string
  last_name?: string
  email?: string
  phone_number?: string
  birth_date?: string
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say'
}

export async function getProfile(): Promise<ProfileData> {
  const token = await getAuthToken()
  
  if (!token) {
    throw new Error('No authentication token found')
  }

  const response = await fetch(`${API_URL}/wp-json/roihin/v1/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    const error = await response.json()
    console.error('WordPress API error:', error)
    throw new Error(error.message || 'Failed to fetch profile')
  }

  const data = await response.json()
  
  // Log the raw data from WordPress for debugging
  console.log('Raw WordPress profile data:', JSON.stringify(data, null, 2))
  
  // Check all possible phone field locations from WordPress
  // WordPress might store phone in user meta, ACF fields, or custom fields
  const phone_number = data.phone_number || 
                       data.phone || 
                       data.meta?.phone_number || 
                       data.meta?.phone || 
                       data.acf?.phone_number || 
                       data.acf?.phone ||
                       data.billing_phone || // WooCommerce field
                       ''
  console.log('Resolved phone number from multiple sources:', {
    'data.phone_number': data.phone_number,
    'data.phone': data.phone,
    'data.meta?.phone_number': data.meta?.phone_number,
    'data.meta?.phone': data.meta?.phone,
    'data.acf?.phone_number': data.acf?.phone_number,
    'data.acf?.phone': data.acf?.phone,
    'data.billing_phone': data.billing_phone,
    'final': phone_number
  })
  
  const profileData: ProfileData = {
    id: data.id,
    email: data.email || '',
    first_name: data.first_name || '',
    last_name: data.last_name || '',
    phone_number: phone_number, // Use resolved phone number
    birth_date: data.birth_date || '',
    gender: data.gender || 'prefer_not_to_say',
    member_since: data.member_since || {
      raw: new Date().toISOString(),
      human: 'Recently'
    }
  }
  
  return profileData
}

export async function updateProfile(payload: UpdateProfileData): Promise<ProfileData> {
  const token = await getAuthToken()
  
  if (!token) {
    throw new Error('No authentication token found')
  }

  // Ensure phone_number field is sent in all possible formats WordPress might expect
  const requestBody = {
    ...payload,
    // Send phone number in multiple fields to ensure WordPress receives it
    phone_number: payload.phone_number || undefined,
    phone: payload.phone_number || undefined, // Some WordPress setups use 'phone'
    billing_phone: payload.phone_number || undefined, // WooCommerce field
    // If phone_number exists, also try to update user meta
    meta: payload.phone_number ? {
      phone_number: payload.phone_number,
      phone: payload.phone_number
    } : undefined
  }

  console.log('Sending update to WordPress with multiple phone fields:', requestBody)

  const response = await fetch(`${API_URL}/wp-json/roihin/v1/me`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(requestBody),
  })

  const data = await response.json()
  
  if (!response.ok) {
    console.error('WordPress update error:', data)
    throw new Error(data.message || 'Update failed')
  }
  
  // Resolve phone number with proper fallback chain from multiple sources
  const updated_phone = data.phone_number || 
                       data.phone || 
                       data.meta?.phone_number || 
                       data.meta?.phone || 
                       data.acf?.phone_number || 
                       data.acf?.phone ||
                       data.billing_phone || // WooCommerce field
                       payload.phone_number || 
                       ''
  console.log('Updated phone number resolved from multiple sources:', {
    'data.phone_number': data.phone_number,
    'data.phone': data.phone,
    'data.meta?.phone_number': data.meta?.phone_number,
    'data.meta?.phone': data.meta?.phone,
    'data.acf?.phone_number': data.acf?.phone_number,
    'data.acf?.phone': data.acf?.phone,
    'data.billing_phone': data.billing_phone,
    'payload.phone_number': payload.phone_number,
    'final': updated_phone
  })
  
  // Ensure all fields are present in the response
  const profileData: ProfileData = {
    id: data.id,
    email: data.email || payload.email || '',
    first_name: data.first_name || payload.first_name || '',
    last_name: data.last_name || payload.last_name || '',
    phone_number: updated_phone, // Use resolved phone number
    birth_date: data.birth_date || payload.birth_date || '',
    gender: data.gender || payload.gender || 'prefer_not_to_say',
    member_since: data.member_since || {
      raw: new Date().toISOString(),
      human: 'Recently'
    }
  }
  
  return profileData
}