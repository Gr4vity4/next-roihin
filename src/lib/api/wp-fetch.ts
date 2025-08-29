import { cookies } from 'next/headers'

const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL || 'https://wp-roihin.precisiondevlab.com'

export async function wpFetch(path: string, init: RequestInit = {}) {
  const cookieStore = await cookies()
  const token = cookieStore.get('wpToken')?.value
  
  return fetch(`${WORDPRESS_API_URL}${path}`, {
    ...init,
    headers: {
      ...(init.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })
}