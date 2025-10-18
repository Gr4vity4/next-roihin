'use client'

import { createContext, useContext, useState } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { getErrorMessage } from '@/lib/utils/error-handler'
import type { SimpleUser } from '@/lib/types/auth'

interface AuthContextType {
  isLoggedIn: boolean
  user: SimpleUser | null
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  loading: boolean
  error: string | null
}

interface RegisterData {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  acceptTerms: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useLocalStorage<SimpleUser | null>('user', null)
  const [isLoggedIn, setIsLoggedIn] = useState(!!user)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Login failed')
      }

      const userData: SimpleUser = {
        id: data.user?.id || 0,
        name: data.user?.name || email.split('@')[0],
        email: data.user?.email || email,
        phone: data.user?.phone || null,
      }

      setUser(userData)
      setIsLoggedIn(true)
    } catch (err) {
      setError(getErrorMessage(err, 'Login failed'))
      throw err
    } finally {
      setLoading(false)
    }
  }

  const register = async (data: RegisterData) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone: data.phone,
          password: data.password,
          accept_terms: data.acceptTerms,
        }),
      })

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Registration failed')
      }

      await login(data.email, data.password)
    } catch (err) {
      setError(getErrorMessage(err, 'Registration failed'))
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setIsLoggedIn(false)
    setUser(null)
    setError(null)

    await fetch('/api/auth/logout', {
      method: 'POST',
    })
  }

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      user,
      login, 
      register,
      logout,
      loading,
      error 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}