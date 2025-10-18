import { NextResponse } from 'next/server'
import { getLaravelApiEndpoint } from '@/config/api.config'
import { getErrorMessage } from '@/lib/utils/error-handler'

export async function POST(request: Request) {
  try {
    const { email, token, password } = await request.json()

    const response = await fetch(getLaravelApiEndpoint('/auth/reset-password'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email,
        token,
        password,
        password_confirmation: password,
      }),
    })

    // Laravel returns 204 No Content on success
    if (response.status === 204) {
      return new Response(null, { status: 204 })
    }

    const data = await response.json()

    if (!response.ok) {
      // Handle Laravel validation errors
      if (response.status === 422 && data.errors) {
        const firstError = Object.values(data.errors)[0]
        const errorMessage = Array.isArray(firstError) ? firstError[0] : 'Reset password failed'
        return NextResponse.json(
          { error: errorMessage },
          { status: 422 }
        )
      }

      return NextResponse.json(
        { error: data.message || 'Reset password failed' },
        { status: response.status }
      )
    }

    return NextResponse.json({ message: 'Password reset successfully' })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: getErrorMessage(error, 'Internal server error') },
      { status: 500 }
    )
  }
}
