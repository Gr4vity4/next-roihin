'use client'

import Link from 'next/link'
import Image from 'next/image'
import Button from '@/components/Button'
import { useWishlist } from '@/contexts/WishlistContext'
import { useCart } from '@/contexts/CartContext'
import { useState, useEffect } from 'react'
export default function WishlistPage() {
  const { items, loading, error, removeItem, clearWishlist, refreshWishlist } = useWishlist()
  const { addItem } = useCart()
  const [removingItem, setRemovingItem] = useState<string | null>(null)
  const [clearing, setClearing] = useState(false)
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  
  // Refresh wishlist data when page mounts to ensure we have latest data
  useEffect(() => {
    refreshWishlist()
  }, [refreshWishlist])

  const handleRemoveItem = async (itemId: string) => {
    setRemovingItem(itemId)
    try {
      await removeItem(itemId)
    } catch (err) {
      console.error('Failed to remove item:', err)
    } finally {
      setRemovingItem(null)
    }
  }

  const handleClearWishlist = async () => {
    if (!window.confirm('คุณแน่ใจหรือไม่ที่จะลบสินค้าทั้งหมดในรายการโปรด?')) {
      return
    }
    
    setClearing(true)
    try {
      await clearWishlist()
    } catch (err) {
      console.error('Failed to clear wishlist:', err)
    } finally {
      setClearing(false)
    }
  }

  const handleAddToCart = (item: {
    id: string
    product_id: number
    color?: string
    product?: {
      slug: string
      title: string
      featured_image_url?: string
      category?: string
    }
    display_price?: number
    price?: {
      min_price: number
    }
  }) => {
    setAddingToCart(item.id)
    
    // Prepare cart item data
    const cartItem = {
      id: item.color ? `${item.product_id}-${item.color}` : String(item.product_id),
      slug: item.product?.slug || `product-${item.product_id}`,
      title: item.product?.title || `Product ${item.product_id}`,
      price: item.display_price || item.price?.min_price || 0,
      image: item.product?.featured_image_url || '/images/placeholder.jpg',
      color: item.color,
      category: item.product?.category
    }
    
    // Add item to cart
    addItem(cartItem)
    
    // Show success feedback
    setTimeout(() => {
      setAddingToCart(null)
    }, 1000)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto pt-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">รายการโปรด</h1>
          <p className="text-gray-600">กำลังโหลด...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
              <div className="aspect-square bg-gray-200"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="space-y-2">
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto pt-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">รายการโปรด</h1>
          <p className="text-red-600">เกิดข้อผิดพลาด: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto pt-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">รายการโปรด</h1>
          <p className="text-gray-600">
            {items.length > 0 
              ? `คุณมี ${items.length} รายการในรายการโปรด`
              : 'บันทึกสินค้าที่คุณชื่นชอบไว้ที่นี่'
            }
          </p>
        </div>
        {items.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearWishlist}
            disabled={clearing}
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
            {clearing ? 'กำลังลบ...' : 'ลบทั้งหมด'}
          </Button>
        )}
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const isRemoving = removingItem === item.id
            const productImage = item.product?.featured_image_url || '/images/placeholder.jpg'
            const productName = item.product?.title || `Product ${item.product_id}`
            const productSlug = item.product?.slug || `product-${item.product_id}`
            const displayPrice = item.display_price || item.price?.min_price || 0
            const isAvailable = item.is_available !== false

            return (
              <div 
                key={item.id} 
                className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-opacity ${
                  isRemoving ? 'opacity-50' : ''
                }`}
              >
                <Link href={`/charmspacer/product/${productSlug}`}>
                  <div className="aspect-square bg-gray-100 relative overflow-hidden group">
                    {productImage ? (
                      <Image
                        src={productImage}
                        alt={productName}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-4xl">💎</div>
                      </div>
                    )}
                    {!isAvailable && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-semibold bg-black/70 px-4 py-2 rounded">
                          สินค้าหมด
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-4">
                  <Link href={`/charmspacer/product/${productSlug}`}>
                    <h3 className="font-semibold text-gray-900 mb-1 hover:text-[#005635] transition-colors">
                      {productName}
                    </h3>
                  </Link>
                  {item.color && (
                    <p className="text-sm text-gray-600 mb-2">สี: {item.color}</p>
                  )}
                  <p className="text-xl font-bold text-[#005635] mb-3">
                    {formatPrice(displayPrice)}
                  </p>
                  <div className="space-y-2">
                    {isAvailable ? (
                      <Button 
                        fullWidth 
                        size="sm"
                        onClick={() => handleAddToCart(item)}
                        disabled={addingToCart === item.id}
                        className={addingToCart === item.id ? 'bg-green-600 hover:bg-green-600' : ''}
                      >
                        {addingToCart === item.id ? 'เพิ่มลงตะกร้าแล้ว!' : 'เพิ่มลงตะกร้า'}
                      </Button>
                    ) : (
                      <Button 
                        fullWidth 
                        size="sm" 
                        variant="outline" 
                        disabled
                      >
                        สินค้าหมด
                      </Button>
                    )}
                    <Button 
                      fullWidth 
                      size="sm" 
                      variant="ghost" 
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={isRemoving}
                    >
                      {isRemoving ? 'กำลังลบ...' : 'ลบ'}
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">รายการโปรดของคุณว่างเปล่า</h3>
          <p className="text-gray-500 mb-6">บันทึกสินค้าที่คุณชื่นชอบเพื่อดูภายหลัง</p>
          <Link href="/charmspacer">
            <Button>เลือกดูสินค้า</Button>
          </Link>
        </div>
      )}
    </div>
  )
}