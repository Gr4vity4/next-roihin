import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getLaravelApiEndpoint } from '@/config/api.config'
import { AuthResponseSchema } from '@/lib/types/auth'
import { getErrorMessage } from '@/lib/utils/error-handler'

export async function POST(request: Request) {
  try {
    const { first_name, last_name, email, phone, password } = await request.json()

    // Prepare request body for Laravel backend
    const requestBody = {
      first_name,
      last_name,
      email,
      phone: phone || null,
      password,
      password_confirmation: password, // Laravel requires confirmation
      device_name: request.headers.get('user-agent') || 'web-browser',
    }

    const response = await fetch(getLaravelApiEndpoint('/auth/register'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    const data = await response.json()

    if (!response.ok) {
      // Handle Laravel validation errors
      if (response.status === 422 && data.errors) {
        const firstError = Object.values(data.errors)[0]
        const errorMessage = Array.isArray(firstError) ? firstError[0] : 'Validation failed'
        return NextResponse.json(
          { error: errorMessage },
          { status: 422 }
        )
      }

      return NextResponse.json(
        { error: data.message || 'Registration failed' },
        { status: response.status }
      )
    }

    // Validate response with Zod schema
    const validatedData = AuthResponseSchema.parse(data)

    // Set httpOnly cookie with auth token
    const cookieStore = await cookies()
    cookieStore.set('authToken', validatedData.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    // Return user data (token is in cookie, don't expose in response)
    return NextResponse.json({
      user: {
        id: validatedData.user.id,
        name: validatedData.user.name,
        email: validatedData.user.email,
        phone: validatedData.user.phone,
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: getErrorMessage(error, 'Internal server error') },
      { status: 500 }
    )
  }
}
