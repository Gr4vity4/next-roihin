import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/auth/get-token';
import { WORDPRESS_API_URL } from '@/config/api.config';

export async function POST(req: Request) {
  try {
    const { current_password, new_password, confirm_password } = await req.json();

    const token = await getAuthToken();

    if (!token) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    const res = await fetch(`${WORDPRESS_API_URL}/wp-json/roihin/v1/me/password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        current_password, 
        new_password, 
        confirm_password 
      })
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    const cookieStore = await cookies();
    cookieStore.delete('wpToken');
    
    return NextResponse.json({ 
      ok: true, 
      message: data.message || 'Password updated successfully. Please sign in again.',
      force_reauth: true
    });
  } catch (error) {
    console.error('Password change error:', error);
    return NextResponse.json(
      { message: 'An error occurred while changing password' },
      { status: 500 }
    );
  }
}