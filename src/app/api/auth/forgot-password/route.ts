import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // In a real application, you would:
    // 1. Check if the user exists in the database
    // 2. Generate a unique reset token
    // 3. Store the token with an expiration time
    // 4. Send an email with the reset link

    // For demo purposes, we'll simulate success
    // In production, you'd integrate with your email service (SendGrid, AWS SES, etc.)
    
    const resetToken = generateResetToken()
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`
    
    // Log for demo purposes (in production, send actual email)
    console.log('Password reset requested for:', email)
    console.log('Reset link:', resetLink)

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      message: 'Password reset email sent successfully'
    })
  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json(
      { error: 'Failed to process password reset request' },
      { status: 500 }
    )
  }
}

function generateResetToken(): string {
  // Generate a random token
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let token = ''
  for (let i = 0; i < 32; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return token
}