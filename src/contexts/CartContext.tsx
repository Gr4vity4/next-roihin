'use client'

import { createContext, useCallback, useContext, useMemo, ReactNode } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'

interface BraceletBead {
  id: string
  stoneName: string
  stoneImage?: string
  size: number
  price: number
}

interface BraceletDesign {
  beads: BraceletBead[]
  wristLength: string
  beadSize: number
  totalPrice: number
  designId: string
  designImageUrl?: string
}

interface CartItem {
  id: string
  slug: string
  title: string
  price: number
  quantity: number
  image: string
  color?: string
  category?: string
  isCustomBracelet?: boolean
  braceletDesign?: BraceletDesign
}

interface CartContextType {
  items: CartItem[]
  itemCount: number
  totalAmount: number
  isHydrated: boolean
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems, , isHydrated] = useLocalStorage<CartItem[]>('cart', [])

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const addItem = useCallback((newItem: Omit<CartItem, 'quantity'>) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(
        item => item.id === newItem.id && item.color === newItem.color
      )

      if (existingItem) {
        return currentItems.map(item =>
          item.id === newItem.id && item.color === newItem.color
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [...currentItems, { ...newItem, quantity: 1 }]
    })
  }, [setItems])

  const removeItem = useCallback((id: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== id))
  }, [setItems])

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems(currentItems => currentItems.filter(item => item.id !== id))
      return
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    )
  }, [setItems])

  const clearCart = useCallback(() => {
    setItems([])
  }, [setItems])

  const value = useMemo(
    () => ({
      items,
      itemCount,
      totalAmount,
      isHydrated,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [items, itemCount, totalAmount, isHydrated, addItem, removeItem, updateQuantity, clearCart]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
