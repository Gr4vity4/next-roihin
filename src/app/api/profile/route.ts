import { getProfile, updateProfile } from '@/lib/api/profile'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const profile = await getProfile()
    
    // Log the response to debug phone_number field
    console.log('Profile data from WordPress:', JSON.stringify(profile, null, 2))
    
    // Ensure phone_number is included in response with proper fallback
    const responseData = {
      ...profile,
      phone_number: profile.phone_number || '',
      // Also include phone field for backward compatibility
      phone: profile.phone_number || ''
    }
    
    return NextResponse.json(responseData)
  } catch (error) {
    console.error('Failed to fetch profile:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch profile' },
      { status: 401 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    
    // Log the update request to debug
    console.log('Update request body:', JSON.stringify(body, null, 2))
    
    const profile = await updateProfile(body)
    
    // Log the response to debug
    console.log('Updated profile data from WordPress:', JSON.stringify(profile, null, 2))
    
    // Ensure phone_number is included in response with proper fallback
    const responseData = {
      ...profile,
      phone_number: profile.phone_number || body.phone_number || '',
      // Also include phone field for backward compatibility
      phone: profile.phone_number || body.phone_number || ''
    }
    
    return NextResponse.json(responseData)
  } catch (error) {
    console.error('Failed to update profile:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update profile' },
      { status: 400 }
    )
  }
}