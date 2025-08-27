import Link from 'next/link'
import Button from '@/components/Button'

export default function WishlistPage() {
  const wishlistItems = [
    {
      id: '1',
      name: 'Protection Bracelet',
      price: '฿2,500',
      image: '/images/products/protection-bracelet.jpg',
      inStock: true,
    },
    {
      id: '2',
      name: 'Love & Harmony Bracelet',
      price: '฿3,200',
      image: '/images/products/love-bracelet.jpg',
      inStock: true,
    },
    {
      id: '3',
      name: 'Success & Wealth Bracelet',
      price: '฿2,800',
      image: '/images/products/success-bracelet.jpg',
      inStock: false,
    },
  ]

  return (
    <div className="max-w-7xl mx-auto pt-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
        <p className="text-gray-600">Save your favorite items for later</p>
      </div>

      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="aspect-square bg-gray-100 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-4xl">💎</div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                <p className="text-xl font-bold text-[#005635] mb-3">{item.price}</p>
                <div className="space-y-2">
                  {item.inStock ? (
                    <Button fullWidth size="sm">
                      Add to Cart
                    </Button>
                  ) : (
                    <Button fullWidth size="sm" variant="outline" disabled>
                      Out of Stock
                    </Button>
                  )}
                  <Button fullWidth size="sm" variant="ghost" className="text-red-600">
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-500 mb-6">Save items you love to your wishlist.</p>
          <Link href="/custom">
            <Button>Browse Products</Button>
          </Link>
        </div>
      )}
    </div>
  )
}