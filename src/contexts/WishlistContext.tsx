'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'

interface WishlistItem {
  id: string
  product_id: number
  color?: string
  added_at: number
  product?: {
    id: number
    slug: string
    title: string
    featured_image_url?: string
    [key: string]: unknown
  }
  price?: {
    min_price: number
    available_any: boolean
    selected?: {
      color: string
      price: number
      available: boolean
    }
  }
  is_available?: boolean
  display_price?: number
}

interface WishlistContextType {
  items: WishlistItem[]
  loading: boolean
  error: string | null
  addItem: (productId: number, color?: string) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  removeByProductId: (productId: number, color?: string) => Promise<void>
  isInWishlist: (productId: number, color?: string) => boolean
  getItemId: (productId: number, color?: string) => string | null
  clearWishlist: () => Promise<void>
  refreshWishlist: () => Promise<void>
  itemCount: number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshWishlist = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/wishlist', {
        credentials: 'include',
      })
      
      if (response.status === 401) {
        setItems([])
        return
      }

      if (!response.ok) {
        throw new Error('Failed to fetch wishlist')
      }

      const data = await response.json()
      setItems(data.items || [])
    } catch (err) {
      console.error('Failed to fetch wishlist:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch wishlist')
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshWishlist()
  }, [refreshWishlist])

  const addItem = async (productId: number, color?: string) => {
    try {
      setError(null)
      const response = await fetch('/api/wishlist/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: productId,
          color: color || null,
          op: 'add',
        }),
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to add to wishlist')
      }

      const result = await response.json()
      
      if (result.action === 'added' || result.action === 'kept') {
        await refreshWishlist()
      }
    } catch (err) {
      console.error('Failed to add to wishlist:', err)
      setError(err instanceof Error ? err.message : 'Failed to add to wishlist')
      throw err
    }
  }

  const removeItem = async (itemId: string) => {
    try {
      setError(null)
      const response = await fetch(`/api/wishlist/${itemId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to remove from wishlist')
      }

      setItems(prevItems => prevItems.filter(item => item.id !== itemId))
    } catch (err) {
      console.error('Failed to remove from wishlist:', err)
      setError(err instanceof Error ? err.message : 'Failed to remove from wishlist')
      throw err
    }
  }

  const removeByProductId = async (productId: number, color?: string) => {
    try {
      setError(null)
      const response = await fetch('/api/wishlist/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: productId,
          color: color || null,
          op: 'remove',
        }),
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to remove from wishlist')
      }

      const result = await response.json()
      
      if (result.action === 'removed') {
        setItems(prevItems => 
          prevItems.filter(item => 
            !(item.product_id === productId && item.color === (color || undefined))
          )
        )
      }
    } catch (err) {
      console.error('Failed to remove from wishlist:', err)
      setError(err instanceof Error ? err.message : 'Failed to remove from wishlist')
      throw err
    }
  }

  const isInWishlist = (productId: number, color?: string) => {
    return items.some(item => 
      item.product_id === productId && 
      item.color === (color || undefined)
    )
  }

  const getItemId = (productId: number, color?: string) => {
    const item = items.find(item => 
      item.product_id === productId && 
      item.color === (color || undefined)
    )
    return item?.id || null
  }

  const clearWishlist = async () => {
    try {
      setError(null)
      const response = await fetch('/api/wishlist', {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to clear wishlist')
      }

      setItems([])
    } catch (err) {
      console.error('Failed to clear wishlist:', err)
      setError(err instanceof Error ? err.message : 'Failed to clear wishlist')
      throw err
    }
  }

  const value: WishlistContextType = {
    items,
    loading,
    error,
    addItem,
    removeItem,
    removeByProductId,
    isInWishlist,
    getItemId,
    clearWishlist,
    refreshWishlist,
    itemCount: items.length,
  }

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}