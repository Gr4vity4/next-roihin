import { cookies } from 'next/headers'

const API_URL = process.env.WORDPRESS_API_URL || 'https://wp-roihin.precisiondevlab.com'

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

async function getAuthToken() {
  const cookieStore = await cookies()
  return cookieStore.get('wpToken')?.value
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
  
  // Ensure all fields are present, providing defaults if missing
  const phone_number = data.phone_number || data.phone || data.acf?.phone_number || ''
  console.log('Resolved phone number:', phone_number)
  
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

  // Ensure phone_number field is sent correctly
  const requestBody = {
    ...payload,
    // Map phone field if present
    phone_number: payload.phone_number || undefined
  }

  console.log('Sending update to WordPress:', requestBody)

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
  
  // Resolve phone number with proper fallback chain
  const updated_phone = data.phone_number || data.phone || data.acf?.phone_number || payload.phone_number || ''
  console.log('Updated phone number resolved:', updated_phone)
  
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