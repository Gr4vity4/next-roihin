import Image from 'next/image'

export interface CrystalProduct {
  id: string
  slug: string
  nameEn: string
  nameTh: string
  image: string
  properties: {
    priceComplete: string
    chakra: string[]
    zodiacCompatibility: string[]
    rulingPlanet: string
    color: string[]
  }
  description: string[]
  attributes: string
}

interface CrystalProductDetailProps {
  product: CrystalProduct
  locale: string
}

export default function CrystalProductDetail({ product }: CrystalProductDetailProps) {
  return (
    <section className="bg-white py-8 md:py-12">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Top Section - Image and Properties */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
          {/* Left - Crystal Image */}
          <div className="p-6 md:p-8">
            <div className="relative aspect-square bg-white">
              <Image
                src={product.image}
                alt={product.nameEn}
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Right - Name and Properties */}
          <div className="p-6 md:p-8 flex flex-col">
            {/* Product Name Section */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 mb-2">
                {product.nameEn}
              </h1>
              <h2 className="text-2xl md:text-3xl lg:text-4xl text-gray-900">
                {product.nameTh}
              </h2>
            </div>

            {/* Properties Table */}
            <div className="flex-1">
              {/* Price Complete */}
              <div className="grid grid-cols-2 gap-4 py-3 border-b border-gray-200">
                <div className="text-base md:text-lg text-gray-900 font-medium">
                  ราคาพลังงาน
                </div>
                <div className="text-base md:text-lg text-gray-900">
                  {product.properties.priceComplete}
                </div>
              </div>

              {/* Chakra */}
              <div className="grid grid-cols-2 gap-4 py-3 border-b border-gray-200">
                <div className="text-base md:text-lg text-gray-900 font-medium">
                  จักระ
                </div>
                <div className="text-base md:text-lg text-gray-900">
                  {product.properties.chakra.join(', ')}
                </div>
              </div>

              {/* Zodiac Compatibility */}
              <div className="grid grid-cols-2 gap-4 py-3 border-b border-gray-200">
                <div className="text-base md:text-lg text-gray-900 font-medium">
                  สีคบา
                </div>
                <div className="text-base md:text-lg text-gray-900">
                  {product.properties.zodiacCompatibility.join(', ')}
                </div>
              </div>

              {/* Ruling Planet */}
              <div className="grid grid-cols-2 gap-4 py-3 border-b border-gray-200">
                <div className="text-base md:text-lg text-gray-900 font-medium">
                  ดาวประจำสี
                </div>
                <div className="text-base md:text-lg text-gray-900">
                  {product.properties.rulingPlanet}
                </div>
              </div>

              {/* Color */}
              <div className="grid grid-cols-2 gap-4 py-3">
                <div className="text-base md:text-lg text-gray-900 font-medium">
                  สี
                </div>
                <div className="text-base md:text-lg text-gray-900">
                  {product.properties.color.join(', ')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Full Width Description */}
        <div className="p-6 md:p-8">
          <div className="space-y-4">
            {product.description.map((paragraph, index) => (
              <p key={index} className="text-base md:text-lg text-gray-900 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
