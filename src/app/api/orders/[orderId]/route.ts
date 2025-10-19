import { NextResponse } from 'next/server'
import { getAuthToken } from '@/lib/auth/get-token'
import { fetchOrder } from '@/lib/api/orders'
import { getErrorMessage } from '@/lib/utils/error-handler'

interface RouteParams {
  params: { orderId: string }
}

export async function GET(_: Request, { params }: RouteParams) {
  try {
    const token = await getAuthToken()

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await fetchOrder(token, params.orderId)
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'UNAUTHORIZED') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      if (error.message === 'NOT_FOUND') {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
      }
    }

    console.error('Order detail GET error:', error)
    return NextResponse.json(
      { error: getErrorMessage(error, 'Failed to load order') },
      { status: 500 }
    )
  }
}
