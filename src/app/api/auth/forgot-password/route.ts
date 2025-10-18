import { NextResponse } from 'next/server'
import { getLaravelApiEndpoint } from '@/config/api.config'
import { ForgotPasswordResponseSchema } from '@/lib/types/auth'
import { getErrorMessage } from '@/lib/utils/error-handler'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    const response = await fetch(getLaravelApiEndpoint('/auth/forgot-password'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email }),
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
        { error: data.message || 'Request failed' },
        { status: response.status }
      )
    }

    // Validate response with Zod schema
    const validatedData = ForgotPasswordResponseSchema.parse(data)

    return NextResponse.json({
      message: validatedData.message,
    }, { status: 202 })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: getErrorMessage(error, 'Internal server error') },
      { status: 500 }
    )
  }
}
