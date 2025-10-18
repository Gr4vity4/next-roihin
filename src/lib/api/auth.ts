/**
 * Authentication API helpers
 *
 * These functions call the Next.js API routes which proxy to Laravel backend.
 * This file provides a clean abstraction layer for authentication operations.
 */

import type { RegisterData, LoginData, ForgotPasswordData, ResetPasswordData } from '@/lib/types/auth'

/**
 * Register a new user
 */
export async function register(data: RegisterData) {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.error || 'Registration failed')
  }

  return result
}

/**
 * Login with email and password
 */
export async function login(data: LoginData) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.error || 'Login failed')
  }

  return result
}

/**
 * Request password reset email
 */
export async function forgotPassword(data: ForgotPasswordData) {
  const response = await fetch('/api/auth/forgot-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.error || 'Request failed')
  }

  return result
}

/**
 * Reset password with token
 */
export async function resetPassword(data: ResetPasswordData) {
  const response = await fetch('/api/auth/reset-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (response.status === 204) {
    return { message: 'Password reset successfully' }
  }

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.error || 'Reset password failed')
  }

  return result
}

/**
 * Logout current user
 */
export async function logout() {
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.error || 'Logout failed')
  }

  return result
}
