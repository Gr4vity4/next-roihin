'use client'

import { useEffect, useState } from 'react'
import { fetchProvinces, type Province } from '@/lib/api/provinces'

// Module-level cache keyed by locale so the province list is fetched at most
// once per locale across every form that mounts a ProvinceSelect.
const cache = new Map<string, Province[]>()
const inflight = new Map<string, Promise<Province[]>>()

function loadProvinces(locale: string): Promise<Province[]> {
  const cached = cache.get(locale)
  if (cached) {
    return Promise.resolve(cached)
  }

  const existing = inflight.get(locale)
  if (existing) {
    return existing
  }

  const request = fetchProvinces(locale)
    .then((items) => {
      cache.set(locale, items)
      inflight.delete(locale)
      return items
    })
    .catch((error) => {
      inflight.delete(locale)
      throw error
    })

  inflight.set(locale, request)
  return request
}

export function useProvinces(locale: string) {
  const [provinces, setProvinces] = useState<Province[]>(() => cache.get(locale) ?? [])
  const [isLoading, setIsLoading] = useState(() => !cache.has(locale))
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const cached = cache.get(locale)
    if (cached) {
      setProvinces(cached)
      setIsLoading(false)
      setError(null)
      return
    }

    setIsLoading(true)
    setError(null)

    loadProvinces(locale)
      .then((items) => {
        if (!isMounted) return
        setProvinces(items)
        setIsLoading(false)
      })
      .catch((err) => {
        if (!isMounted) return
        console.error('Failed to load provinces:', err)
        setError(err instanceof Error ? err.message : 'Failed to load provinces')
        setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [locale])

  return { provinces, isLoading, error }
}
