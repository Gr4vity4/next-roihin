import { NextResponse } from 'next/server'

import { getLaravelApiEndpoint } from '@/config/api.config'
import { getAuthToken } from '@/lib/auth/get-token'
import { UserSchema, toSimpleUser } from '@/lib/types/auth'

export async function GET() {
  try {
    const token = await getAuthToken()

    if (!token) {
      return NextResponse.json(
        { error: 'No authentication token found' },
        { status: 401 }
      )
    }

    const response = await fetch(getLaravelApiEndpoint('/auth/me'), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      cache: 'no-store',
    })

    const rawBody = await response
      .json()
      .catch(() => ({ }))

    if (!response.ok) {
      const message =
        (rawBody && typeof rawBody === 'object' && 'message' in rawBody)
          ? (rawBody.message as string)
          : 'Failed to validate session'

      return NextResponse.json(
        { error: message },
        { status: response.status === 401 ? 401 : 500 }
      )
    }

    const userPayload =
      (rawBody && typeof rawBody === 'object' && 'user' in rawBody)
        ? rawBody.user
        : (rawBody && typeof rawBody === 'object' && 'data' in rawBody)
          ? rawBody.data
          : rawBody

    const parsedUser = UserSchema.safeParse(userPayload)

    if (!parsedUser.success) {
      console.error('Session heartbeat validation failed', parsedUser.error)
      return NextResponse.json(
        { error: 'Invalid user payload received from backend' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      user: parsedUser.data,
      simpleUser: toSimpleUser(parsedUser.data),
    })
  } catch (error) {
    console.error('Session heartbeat error:', error)
    return NextResponse.json(
      { error: 'Unable to validate session' },
      { status: 500 }
    )
  }
}
