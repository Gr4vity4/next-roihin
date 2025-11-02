import { NextResponse } from 'next/server'
import { getAuthToken } from '@/lib/auth/get-token'
import { updateAddress, deleteAddress } from '@/lib/api/addresses'
import { getErrorMessage } from '@/lib/utils/error-handler'

type RouteContext = {
  params: Promise<{
    addressId: string
  }>
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const { addressId } = await params

  try {
    const token = await getAuthToken()

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await request.json()
    const data = await updateAddress(token, addressId, payload)
    return NextResponse.json(data)
  } catch (error) {
    console.error(`Addresses PATCH error (${addressId}):`, error)
    return NextResponse.json(
      { error: getErrorMessage(error, 'Failed to update address') },
      { status: 400 }
    )
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { addressId } = await params

  try {
    const token = await getAuthToken()

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await deleteAddress(token, addressId)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error(`Addresses DELETE error (${addressId}):`, error)
    return NextResponse.json(
      { error: getErrorMessage(error, 'Failed to delete address') },
      { status: 400 }
    )
  }
}
