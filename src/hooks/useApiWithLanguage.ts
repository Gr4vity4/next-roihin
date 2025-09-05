'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import type { Testimonial } from '@/lib/types/wordpress-settings'
import type { BankData } from '@/lib/types/bank'
import type { Product } from '@/lib/types/products'

interface UseApiOptions {
  dependencies?: unknown[]
}

interface StoneSettings {
  id: number
  acf: {
    category: string
    stone_name_en: string
    stone_name_th: string
    [key: string]: unknown
  }
}

interface PageSettings {
  id: number
  [key: string]: unknown
}

export function useApiWithLanguage<T>(
  endpoint: string,
  options: UseApiOptions = {}
) {
  const { language } = useLanguage()
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
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

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, language, ...(options.dependencies || [])])

  return { data, loading, error, refetch: fetchData }
}

// Specific hooks for different APIs
export function useTestimonials() {
  const { data, loading, error } = useApiWithLanguage<{
    testimonials: Testimonial[]
  }>('/api/testimonials')
  
  return {
    testimonials: data?.testimonials || [],
    loading,
    error
  }
}

export function useBanks() {
  const { data, loading, error } = useApiWithLanguage<BankData[]>('/api/banks')
  
  return {
    banks: data || [],
    loading,
    error
  }
}

export function useProducts() {
  const { data, loading, error } = useApiWithLanguage<Product[]>('/api/products')
  
  return {
    products: data || [],
    loading,
    error
  }
}

export function useStones() {
  const { data, loading, error } = useApiWithLanguage<StoneSettings[]>('/api/stone-settings')
  
  return {
    stones: data || [],
    loading,
    error
  }
}

export function usePageSettings() {
  const { data, loading, error } = useApiWithLanguage<PageSettings[]>('/api/page-settings')
  
  return {
    pageSettings: data?.[0] || null,
    loading,
    error
  }
}