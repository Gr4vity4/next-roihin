import { NextRequest, NextResponse } from 'next/server'
import { uploadSlipFile, uploadSlipBase64 } from '@/lib/api/orders'
import { getErrorMessage } from '@/lib/utils/error-handler'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const searchParams = request.nextUrl.searchParams
    const orderKey = searchParams.get('key')
    
    if (!orderKey) {
      return NextResponse.json(
        { ok: false, error: 'Order key is required' },
        { status: 400 }
      )
    }
    
    const contentType = request.headers.get('content-type') || ''
    
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      const slip = formData.get('slip') as File
      
      if (!slip) {
        return NextResponse.json(
          { ok: false, error: 'Slip file is required' },
          { status: 400 }
        )
      }
      
      const result = await uploadSlipFile(id, orderKey, slip)
      return NextResponse.json(result)
    } else {
      const body = await request.json()
      
      if (!body.slip_base64) {
        return NextResponse.json(
          { ok: false, error: 'slip_base64 is required' },
          { status: 400 }
        )
      }
      
      const result = await uploadSlipBase64(id, orderKey, body.slip_base64)
      return NextResponse.json(result)
    }
  } catch (error) {
    console.error('Slip upload error:', error)
    return NextResponse.json(
      { ok: false, error: getErrorMessage(error, 'Failed to upload slip') },
      { status: 500 }
    )
  }
}