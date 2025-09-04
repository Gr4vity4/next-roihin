'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

interface UseApiOptions {
  dependencies?: any[]
}

export function useApiWithLanguage<T>(
  endpoint: string,
  options: UseApiOptions = {}
) {
  const { language } = useLanguage()
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)

      try {
        // Add language parameter to endpoint
        const separator = endpoint.includes('?') ? '&' : '?'
        const url = `${endpoint}${separator}lang=${language}`
        
        const response = await fetch(url)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`)
        }
        
        const responseData = await response.json()
        setData(responseData)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [endpoint, language, ...(options.dependencies || [])])

  return { data, loading, error, refetch: () => fetchData() }
}

// Specific hooks for different APIs
export function useTestimonials() {
  const { data, loading, error } = useApiWithLanguage<{
    testimonials: any[]
  }>('/api/testimonials')
  
  return {
    testimonials: data?.testimonials || [],
    loading,
    error
  }
}

export function useBanks() {
  const { data, loading, error } = useApiWithLanguage<any[]>('/api/banks')
  
  return {
    banks: data || [],
    loading,
    error
  }
}

export function useProducts() {
  const { data, loading, error } = useApiWithLanguage<any[]>('/api/products')
  
  return {
    products: data || [],
    loading,
    error
  }
}

export function useStones() {
  const { data, loading, error } = useApiWithLanguage<any[]>('/api/stone-settings')
  
  return {
    stones: data || [],
    loading,
    error
  }
}

export function usePageSettings() {
  const { data, loading, error } = useApiWithLanguage<any[]>('/api/page-settings')
  
  return {
    pageSettings: data?.[0] || null,
    loading,
    error
  }
}