import { getFetchConfig } from '@/config/cache.config'
import type { BankData } from '@/lib/types/bank'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

export async function getBanks(): Promise<BankData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/banks`, {
      ...getFetchConfig('api'),
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch banks: ${response.status}`)
    }

    const data = await response.json()
    return data || []
  } catch (error) {
    console.error('Error fetching banks:', error)
    return []
  }
}