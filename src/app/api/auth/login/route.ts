import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { WORDPRESS_API_URL } from '@/config/api.config'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    
    const response = await fetch(`${WORDPRESS_API_URL}/wp-json/jwt-auth/v1/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    const cookieStore = await cookies()
    cookieStore.set('wpToken', data.token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    return NextResponse.json({
      user: {
        email: data.user_email,
        name: data.user_display_name
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}