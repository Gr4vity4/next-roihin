import { cookies } from 'next/headers'

/**
 * Get the Laravel Sanctum authentication token from httpOnly cookie
 *
 * @returns The authentication token or null if not found
 */
export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get('authToken')?.value || null
}