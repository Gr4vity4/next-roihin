import { updateAddress, deleteAddress } from '@/lib/api/addresses'
import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const address = await updateAddress(id, body)
    return NextResponse.json(address)
  } catch (error) {
    console.error('Failed to update address:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update address' },
      { status: 400 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const result = await deleteAddress(id)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Failed to delete address:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete address' },
      { status: 400 }
    )
  }
}