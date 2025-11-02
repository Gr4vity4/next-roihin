'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const initialRef = useRef(initialValue)

  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialRef.current
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialRef.current
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialRef.current
    }
  })

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      setStoredValue(prevValue => {
        const valueToStore = value instanceof Function ? value(prevValue) : value

        try {
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(key, JSON.stringify(valueToStore))
          }
        } catch (error) {
          console.error(`Error setting localStorage key "${key}":`, error)
        }

        return valueToStore
      })
    },
    [key]
  )

  const removeValue = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key)
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
    } finally {
      setStoredValue(initialRef.current)
    }
  }, [key])

  useEffect(() => {
    initialRef.current = initialValue
  }, [initialValue])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      const item = window.localStorage.getItem(key)
      setStoredValue(item ? (JSON.parse(item) as T) : initialRef.current)
    } catch (error) {
      console.error(`Error refreshing localStorage key "${key}":`, error)
      setStoredValue(initialRef.current)
    }
  }, [key])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key !== key) {
        return
      }

      if (event.newValue === null) {
        setStoredValue(initialRef.current)
        return
      }

      try {
        setStoredValue(JSON.parse(event.newValue) as T)
      } catch (error) {
        console.error(`Error syncing localStorage key "${key}":`, error)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key])

  return [storedValue, setValue, removeValue] as const
}
