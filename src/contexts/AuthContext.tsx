'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'

import { useLocalStorage } from '@/hooks/useLocalStorage'
import { clearLastShipping } from '@/lib/checkout-storage'
import type { SimpleUser } from '@/lib/types/auth'
import { getErrorMessage } from '@/lib/utils/error-handler'

const SESSION_HEARTBEAT_INTERVAL_MS = 60_000

interface AuthContextType {
  isLoggedIn: boolean
  user: SimpleUser | null
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
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
  const [user, setUser, removeUser] = useLocalStorage<SimpleUser | null>('user', null)
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!user)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSessionExpired = useCallback(() => {
    removeUser()
    setIsLoggedIn(false)
  }, [removeUser])

  const checkSession = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/session', {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'Accept': 'application/json',
        },
      })

      if ([401, 403, 419].includes(response.status)) {
        handleSessionExpired()
        return
      }

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        console.error('Session heartbeat failed:', response.status, body?.error ?? response.statusText)
        return
      }

      const data = await response.json()
      const nextUser: SimpleUser | null =
        data?.simpleUser ??
        (data?.user && typeof data.user === 'object'
          ? {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              phone: data.user.phone ?? null,
            }
          : null)

      if (!nextUser) {
        handleSessionExpired()
        return
      }

      setUser(nextUser)
      setIsLoggedIn(true)
      setError(null)
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        return
      }
      console.error('Session heartbeat error:', err)
    }
  }, [handleSessionExpired, setUser])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    let isActive = true
    let intervalId: ReturnType<typeof setInterval> | null = null

    const runHeartbeat = () => {
      if (!isActive) return
      void checkSession()
    }

    runHeartbeat()
    intervalId = setInterval(runHeartbeat, SESSION_HEARTBEAT_INTERVAL_MS)

    const handleFocus = () => runHeartbeat()
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        runHeartbeat()
      }
    }

    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      isActive = false
      if (intervalId) {
        clearInterval(intervalId)
      }
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [checkSession])

  useEffect(() => {
    setIsLoggedIn(!!user)
  }, [user])

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

  const logout = useCallback(async () => {
    setIsLoggedIn(false)
    removeUser()
    // Explicit logout is the shared-browser signal: the remembered checkout
    // shipping details (full PII) must not outlive it, same as the user record.
    clearLastShipping()
    setError(null)

    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      })
    } catch (err) {
      console.error('Logout request failed:', err)
    }
  }, [removeUser])

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
