import { NextResponse } from 'next/server'
import { getAuthToken } from '@/lib/auth/get-token'
import { setDefaultAddress } from '@/lib/api/addresses'
import { getErrorMessage } from '@/lib/utils/error-handler'

type RouteContext = {
  params: {
    addressId: string
  }
}

export async function POST(_request: Request, context: RouteContext) {
  const { addressId } = context.params

  try {
    const token = await getAuthToken()

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await setDefaultAddress(token, addressId)
    return NextResponse.json(data)
  } catch (error) {
    console.error(`Addresses set default error (${context.params.addressId}):`, error)
    return NextResponse.json(
      { error: getErrorMessage(error, 'Failed to set default address') },
      { status: 400 }
    )
  }
}
