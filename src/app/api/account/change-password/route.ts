import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getAuthToken } from '@/lib/auth/get-token'
import { getLaravelApiEndpoint } from '@/config/api.config'
import { getErrorMessage } from '@/lib/utils/error-handler'

export async function POST(req: Request) {
  try {
    const { current_password, new_password, confirm_password } = await req.json()

    const token = await getAuthToken()

    if (!token) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      )
    }

    const res = await fetch(getLaravelApiEndpoint('/auth/password'), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        current_password,
        new_password,
        new_password_confirmation: confirm_password
      })
    })

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status })
    }

    const cookieStore = await cookies()
    // The active session cookie is `authToken` (set at login/register). Deleting
    // it here enforces the `force_reauth` contract the response advertises.
    cookieStore.delete('authToken')

    return NextResponse.json({
      ok: true,
      message: data.message || 'Password updated successfully. Please sign in again.',
      force_reauth: true
    })
  } catch (error) {
    console.error('Password change error:', error)
    return NextResponse.json(
      { message: getErrorMessage(error, 'An error occurred while changing password') },
      { status: 500 }
    )
  }
}
