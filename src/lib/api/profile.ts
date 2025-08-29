import { cookies } from 'next/headers'

const API_URL = process.env.WORDPRESS_API_URL || 'https://wp-roihin.precisiondevlab.com'

export interface ProfileData {
  id: number
  email: string
  first_name: string
  last_name: string
  phone: string
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
  phone?: string
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
    throw new Error(error.message || 'Failed to fetch profile')
  }

  return response.json()
}

export async function updateProfile(payload: UpdateProfileData): Promise<ProfileData> {
  const token = await getAuthToken()
  
  if (!token) {
    throw new Error('No authentication token found')
  }

  const response = await fetch(`${API_URL}/wp-json/roihin/v1/me`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.message || 'Update failed')
  }
  
  return data
}