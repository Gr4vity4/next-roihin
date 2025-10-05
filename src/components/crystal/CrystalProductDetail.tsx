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
      <div className="container max-w-5xl mx-auto px-4">
        {/* Top Section - Image and Properties */}
        <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
          {/* Left - Crystal Image */}
          <div className="p-6 md:p-8 flex items-start justify-center col-span-1">
            <div className="relative w-[250px] h-[250px] bg-white">
              <Image
                src={product.image}
                alt={product.nameEn}
                fill
                className="object-cover"
                priority
                sizes="250px"
              />
            </div>
          </div>

          {/* Right - Name and Properties */}
          <div className="p-6 md:p-8 flex flex-col col-span-2">
            {/* Product Name Section */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <h1 className="text-2xl md:text-3xl lg:text-4xl text-gray-900 mb-2 font-bold">
                {product.nameEn}
              </h1>
              <h2 className="text-lg md:text-xl lg:text-2xl text-gray-900">{product.nameTh}</h2>
            </div>

            {/* Properties Table */}
            <div className="flex-1">
              {/* Price Complete */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                <div className="text-base md:text-lg lg:col-span-1 text-gray-900 font-medium">
                  ราคาพลังงาน
                </div>
                <div className="text-base md:text-lg lg:col-span-2 text-gray-900">
                  {product.properties.priceComplete}
                </div>
              </div>

              {/* Chakra */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                <div className="text-base md:text-lg lg:col-span-1 text-gray-900 font-medium">
                  จักระ
                </div>
                <div className="text-base md:text-lg lg:col-span-2 text-gray-900">
                  {product.properties.chakra.join(', ')}
                </div>
              </div>

              {/* Zodiac Compatibility */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                <div className="text-base md:text-lg lg:col-span-1 text-gray-900 font-medium">
                  สีคบา
                </div>
                <div className="text-base md:text-lg lg:col-span-2 text-gray-900">
                  {product.properties.zodiacCompatibility.join(', ')}
                </div>
              </div>

              {/* Ruling Planet */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                <div className="text-base md:text-lg lg:col-span-1 text-gray-900 font-medium">
                  ดาวประจำสี
                </div>
                <div className="text-base md:text-lg lg:col-span-2 text-gray-900">
                  {product.properties.rulingPlanet}
                </div>
              </div>

              {/* Color */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                <div className="text-base md:text-lg lg:col-span-1 text-gray-900 font-medium">
                  สี
                </div>
                <div className="text-base md:text-lg lg:col-span-2 text-gray-900">
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
