'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
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
  const [reloadCount, setReloadCount] = useState(0)

  // Drop any cached/failed entry for this locale and re-trigger the effect so a
  // transient fetch failure can be retried without remounting.
  const reload = useCallback(() => {
    cache.delete(locale)
    inflight.delete(locale)
    setReloadCount((count) => count + 1)
  }, [locale])

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
  }, [locale, reloadCount])

  return { provinces, isLoading, error, reload }
}

/**
 * Returns a resolver that maps a stored canonical province value to its
 * localized label, falling back to the raw value for unknown/legacy entries.
 * Used by read-only surfaces so a saved "Bangkok" renders as "กรุงเทพมหานคร"
 * in the Thai UI, matching what the edit dropdown shows.
 */
export function useProvinceLabel(locale: string): (value: string) => string {
  const { provinces } = useProvinces(locale)

  return useMemo(() => {
    const labels = new Map(provinces.map((province) => [province.value, province.label]))
    return (value: string) => labels.get(value) ?? value
  }, [provinces])
}
