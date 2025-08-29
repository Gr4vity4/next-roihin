import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { current_password, new_password, confirm_password } = await req.json();
    
    const cookieStore = await cookies();
    const token = cookieStore.get('wpToken')?.value;
    
    if (!token) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    const wpUrl = process.env.WORDPRESS_API_URL;
    if (!wpUrl) {
      console.error('WORDPRESS_API_URL not configured');
      return NextResponse.json(
        { message: 'Server configuration error' },
        { status: 500 }
      );
    }

    const res = await fetch(`${wpUrl}/wp-json/roihin/v1/me/password`, {
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