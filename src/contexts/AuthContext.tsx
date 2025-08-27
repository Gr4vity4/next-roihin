'use client'

import { createContext, useContext, useState, useEffect } from 'react'

interface AuthContextType {
  isLoggedIn: boolean
  user: {
    name: string
    email: string
  } | null
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)

  useEffect(() => {
    // Check localStorage for mock auth state
    const authState = localStorage.getItem('mockAuth')
    if (authState === 'true') {
      setIsLoggedIn(true)
      setUser({
        name: 'John Doe',
        email: 'demo@roihin.com'
      })
    }
  }, [])

  const login = () => {
    setIsLoggedIn(true)
    setUser({
      name: 'John Doe', 
      email: 'demo@roihin.com'
    })
    localStorage.setItem('mockAuth', 'true')
  }

  const logout = () => {
    setIsLoggedIn(false)
    setUser(null)
    localStorage.removeItem('mockAuth')
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
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