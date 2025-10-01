import { WORDPRESS_API_URL } from '@/config/api.config'

interface RegisterData {
  first_name: string
  last_name: string
  email: string
  phone: string
  password: string
  accept_terms: boolean
}

interface LoginData {
  username: string
  password: string
}

interface ForgotPasswordData {
  email: string
}

interface ResetPasswordData {
  login: string
  key: string
  password: string
}

const API_URL = WORDPRESS_API_URL

export async function register(data: RegisterData) {
  const response = await fetch(`${API_URL}/wp-json/roihin/v1/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  const result = await response.json()
  
  if (!response.ok) {
    throw new Error(result.message || 'Registration failed')
  }
  
  return result
}

export async function login(data: LoginData) {
  const response = await fetch(`${API_URL}/wp-json/jwt-auth/v1/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  const result = await response.json()
  
  if (!response.ok) {
    throw new Error(result.message || 'Login failed')
  }
  
  return result
}

export async function validateToken(token: string) {
  const response = await fetch(`${API_URL}/wp-json/jwt-auth/v1/token/validate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Token validation failed')
  }
  
  return response.ok
}

export async function forgotPassword(data: ForgotPasswordData) {
  const response = await fetch(`${API_URL}/wp-json/roihin/v1/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  const result = await response.json()
  
  if (!response.ok) {
    throw new Error(result.message || 'Request failed')
  }
  
  return result
}

export async function resetPassword(data: ResetPasswordData) {
  const response = await fetch(`${API_URL}/wp-json/roihin/v1/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  const result = await response.json()
  
  if (!response.ok) {
    throw new Error(result.message || 'Reset password failed')
  }
  
  return result
}