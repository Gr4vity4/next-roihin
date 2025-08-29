'use client'

import { createContext, useContext, useState, useEffect } from 'react'

interface User {
  name: string
  email: string
}

interface AuthContextType {
  isLoggedIn: boolean
  user: User | null
  token: string | null
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
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken')
    const storedUser = localStorage.getItem('user')
    
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
      setIsLoggedIn(true)
    }
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }
      
      const userData: User = {
        name: data.user_display_name || data.user_nicename || email.split('@')[0],
        email: data.user_email || email,
      }
      
      setToken(data.token)
      setUser(userData)
      setIsLoggedIn(true)
      
      localStorage.setItem('authToken', data.token)
      localStorage.setItem('user', JSON.stringify(userData))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
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
      setError(err instanceof Error ? err.message : 'Registration failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setIsLoggedIn(false)
    setUser(null)
    setToken(null)
    setError(null)
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      user, 
      token,
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