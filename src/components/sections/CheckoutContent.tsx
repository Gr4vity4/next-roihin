'use client'

import Container from '@/components/ui/Container'
import Typography from '@/components/ui/Typography'
import AuthModal from '@/components/AuthModal'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { MinusIcon, PlusIcon, ShoppingBagIcon, TrashIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { Link, useRouter } from '@/i18n/navigation'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

export default function CheckoutContent() {
  const router = useRouter()
  const t = useTranslations('checkout')
  const { items, itemCount, totalAmount, removeItem, updateQuantity, clearCart } = useCart()
  const { isLoggedIn } = useAuth()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'sign-in' | 'sign-up'>('sign-in')

  useEffect(() => {
    // Set loading to false after component mounts (client-side)
    setIsLoading(false)
  }, [])

  const handleCheckout = async () => {
    // Check if user is authenticated
    if (!isLoggedIn) {
      setAuthMode('sign-in')
      setShowAuthModal(true)
      return
    }

    setIsProcessing(true)

    // Navigate to confirmation page
    router.push('/checkout/confirm')
  }

  if (isLoading) {
    return (
      <section className="pt-24 pb-12 md:pt-32 md:pb-16 min-h-screen bg-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto text-center py-16">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-48 mx-auto"></div>
            </div>
          </div>
        </Container>
      </section>
    )
  }

  if (itemCount === 0) {
    return (
      <section className="pt-24 pb-12 md:pt-32 md:pb-16 min-h-screen bg-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-12">
              <ShoppingBagIcon className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <Typography variant="h2" className="text-gray-900 mb-4">
                {t('emptyCart.title')}
              </Typography>
              <p className="text-gray-600 mb-8 text-lg">
                {t('emptyCart.description')}
              </p>
              <Link
                href="/charmspacer"
                className="inline-flex items-center justify-center px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors shadow-lg"
              >
                {t('emptyCart.shopNow')}
              </Link>
            </div>
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section className="pt-24 pb-12 md:pt-32 md:pb-16 min-h-screen bg-gray-50">
      <Container>
        <div className="max-w-7xl mx-auto">
          <Typography variant="h3" className="text-gray-900 mb-8">
            {t('cartSummary.title')} ({itemCount} {itemCount === 1 ? t('cartSummary.items') : t('cartSummary.items_plural')})
          </Typography>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="relative w-28 h-28 md:w-36 md:h-36 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-4 mb-3">
                        <div>
                          <h3 className="text-gray-900 font-semibold text-lg md:text-xl">
                            {item.title}
                          </h3>
                          {item.color && (
                            <p className="text-gray-600 text-sm mt-1">{t('product.color')}: {item.color}</p>
                          )}
                          {item.category && (
                            <p className="text-gray-500 text-xs mt-1">{t('product.category')}: {item.category}</p>
                          )}
                          {item.isCustomBracelet && item.braceletDesign && (
                            <div className="mt-2 text-sm text-gray-600">
                              <p>• {item.braceletDesign.beads.length} stones</p>
                              <p>• Wrist: {item.braceletDesign.wristLength} cm</p>
                              <p>• Bead size: {item.braceletDesign.beadSize} mm</p>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-2 h-fit"
                          aria-label={t('product.removeItem')}
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors"
                            aria-label={t('product.decreaseQuantity')}
                          >
                            <MinusIcon className="w-4 h-4" />
                          </button>
                          <span className="text-gray-900 font-medium w-12 text-center text-lg">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors"
                            aria-label={t('product.increaseQuantity')}
                          >
                            <PlusIcon className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-900 font-semibold text-xl font-prompt">
                            ฿{(item.price * item.quantity).toLocaleString('th-TH')}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-gray-500 text-sm mt-1 font-prompt">
                              ฿{item.price.toLocaleString('th-TH')} {t('product.perItem')}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center pt-4">
                <Link
                  href="/charmspacer"
                  className="text-green-600 hover:text-green-700 font-medium transition-colors"
                >
                  ← {t('actions.continueShopping')}
                </Link>
                <button
                  onClick={clearCart}
                  className="text-red-500 hover:text-red-600 text-sm font-medium transition-colors"
                >
                  {t('actions.clearCart')}
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                <h2 className="text-xl text-gray-900 font-semibold mb-6">{t('orderSummary.title')}</h2>

                <div className="space-y-4 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-gray-600">
                    <span>{t('orderSummary.subtotal')} ({itemCount} {itemCount === 1 ? t('cartSummary.items') : t('cartSummary.items_plural')})</span>
                    <span className="font-medium text-gray-900 font-prompt">
                      ฿{totalAmount.toLocaleString('th-TH')}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>{t('orderSummary.shipping')}</span>
                    <span className="text-green-600 font-medium">{t('orderSummary.shippingFree')}</span>
                  </div>
                </div>

                <div className="pt-6 pb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-900 text-lg font-semibold">{t('orderSummary.total')}</span>
                    <span className="text-2xl font-bold text-gray-900 font-prompt">
                      ฿{totalAmount.toLocaleString('th-TH')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className={`w-full px-6 py-4 font-medium rounded-lg transition-all transform hover:scale-105 shadow-lg ${
                    isProcessing
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {isProcessing ? t('actions.processing') : t('actions.proceedToCheckout')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </section>
  )
}
