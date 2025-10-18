import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getLaravelApiEndpoint } from '@/config/api.config'
import { getAuthToken } from '@/lib/auth/get-token'

export async function POST() {
  try {
    const token = await getAuthToken()

    // Call Laravel logout endpoint to revoke token
    if (token) {
      await fetch(getLaravelApiEndpoint('/auth/logout'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      })
    }

    // Delete auth cookie
    const cookieStore = await cookies()
    cookieStore.delete('authToken')

    return NextResponse.json({ message: 'Logged out successfully' })
  } catch {
    // Even if Laravel logout fails, clear the cookie
    const cookieStore = await cookies()
    cookieStore.delete('authToken')

    return NextResponse.json({ message: 'Logged out successfully' })
  }
}
