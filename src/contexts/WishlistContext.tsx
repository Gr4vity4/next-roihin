'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getErrorMessage } from '@/lib/utils/error-handler'
import type { WishlistItem } from '@/lib/types/wishlist'

interface WishlistContextType {
  items: WishlistItem[]
  loading: boolean
  error: string | null
  addItem: (productId: number, color?: string) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  removeByProductId: (productId: number, color?: string) => Promise<void>
  toggleItem: (productId: number, color?: string) => Promise<boolean>
  isInWishlist: (productId: number, color?: string) => boolean
  getItemId: (productId: number, color?: string) => string | null
  clearWishlist: () => Promise<void>
  refreshWishlist: () => Promise<void>
  checkFavorite: (productId: number, color?: string) => Promise<boolean>
  itemCount: number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAuth()
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
      setError(getErrorMessage(err, 'Failed to fetch wishlist'))
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isLoggedIn) {
      refreshWishlist()
    } else {
      // Clear items when logged out
      setItems([])
      setLoading(false)
    }
  }, [isLoggedIn, refreshWishlist])

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
          color: color ?? null,
          op: 'add',
        }),
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to add to wishlist')
      }

      // Consume the response to prevent memory leak
      await response.json()
      
      // Always refresh to get the full product details
      await refreshWishlist()
    } catch (err) {
      console.error('Failed to add to wishlist:', err)
      setError(getErrorMessage(err, 'Failed to add to wishlist'))
      throw err
    }
  }

  const removeItem = async (itemId: string) => {
    try {
      setError(null)
      const targetItem = items.find(item => item.id === itemId)

      if (!targetItem) {
        await refreshWishlist()
        throw new Error('Wishlist item not found')
      }

      const response = await fetch(`/api/wishlist/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: targetItem.product_id,
          color: targetItem.color ?? null,
          product_color_option_id: targetItem.product_color_option_id ?? null,
        }),
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to remove from wishlist')
      }

      setItems(prevItems => prevItems.filter(item => item.id !== itemId))
    } catch (err) {
      console.error('Failed to remove from wishlist:', err)
      setError(getErrorMessage(err, 'Failed to remove from wishlist'))
      throw err
    }
  }

  const removeByProductId = async (productId: number, color?: string) => {
    try {
      setError(null)
      const targetColor = color ?? null
      const targetItem = items.find(item =>
        item.product_id === productId && (item.color ?? null) === targetColor
      )

      const response = await fetch('/api/wishlist/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: productId,
          color: targetColor,
          color_option_id: targetItem?.product_color_option_id ?? null,
          op: 'remove',
        }),
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to remove from wishlist')
      }

      const result = await response.json()
      
      const action = result.action ?? result.meta?.action

      if (action === 'removed') {
        setItems(prevItems => 
          prevItems.filter(item => 
            !(item.product_id === productId && (item.color ?? null) === targetColor)
          )
        )
      }
    } catch (err) {
      console.error('Failed to remove from wishlist:', err)
      setError(getErrorMessage(err, 'Failed to remove from wishlist'))
      throw err
    }
  }

  const isInWishlist = (productId: number, color?: string) => {
    const targetColor = color ?? null
    return items.some(item => 
      item.product_id === productId && 
      (item.color ?? null) === targetColor
    )
  }

  const getItemId = (productId: number, color?: string) => {
    const targetColor = color ?? null
    const item = items.find(item => 
      item.product_id === productId && 
      (item.color ?? null) === targetColor
    )
    return item?.id || null
  }

  const toggleItem = async (productId: number, color?: string): Promise<boolean> => {
    try {
      setError(null)
      const response = await fetch('/api/wishlist/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: productId,
          color: color ?? null,
        }),
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to toggle wishlist')
      }

      const result = await response.json()
      const action = result.action ?? result.meta?.action
      const removedItemId = result.item?.id ?? result.meta?.wishlist_item_id ?? null

      if (action === 'added') {
        // Refresh the wishlist to get full product details
        await refreshWishlist()
        return true
      } else if (action === 'removed') {
        // Remove the item from local state
        setItems(prevItems => 
          prevItems.filter(item => 
            removedItemId
              ? item.id !== removedItemId
              : !(item.product_id === productId && (item.color ?? null) === (color ?? null))
          )
        )
        return false
      }

      return isInWishlist(productId, color)
    } catch (err) {
      console.error('Failed to toggle wishlist:', err)
      setError(getErrorMessage(err, 'Failed to toggle wishlist'))
      throw err
    }
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
      setError(getErrorMessage(err, 'Failed to clear wishlist'))
      throw err
    }
  }

  const checkFavorite = async (productId: number, color?: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/wishlist/check-favorite?product=${productId}${color ? `&color=${color}` : ''}`, {
        credentials: 'include',
      })

      if (response.status === 401) {
        return false
      }

      if (!response.ok) {
        console.error('Failed to check favorite status')
        return false
      }

      const data = await response.json()
      return data.favorite || false
    } catch (err) {
      console.error('Failed to check favorite:', err)
      return false
    }
  }

  const value: WishlistContextType = {
    items,
    loading,
    error,
    addItem,
    removeItem,
    removeByProductId,
    toggleItem,
    isInWishlist,
    getItemId,
    clearWishlist,
    refreshWishlist,
    checkFavorite,
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
