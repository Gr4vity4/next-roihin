import Image from 'next/image'

import type { CrystalProduct, CrystalSizePricing } from '@/lib/types/crystal'

interface CrystalProductDetailProps {
  product: CrystalProduct
  locale: string
}

const SIZE_LABELS: Record<keyof CrystalSizePricing, string> = {
  size6mm: '6 mm',
  size8mm: '8 mm',
  size10mm: '10 mm',
  size12mm: '12 mm',
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
      <div className="text-base md:text-lg lg:col-span-1 text-gray-900 font-medium">{label}</div>
      <div className="text-base md:text-lg lg:col-span-2 text-gray-900">{value || '-'}</div>
    </div>
  )
}

function renderSizeEntries(sizePrices: CrystalSizePricing | undefined) {
  if (!sizePrices) {
    return []
  }

  return (Object.entries(sizePrices) as Array<[keyof CrystalSizePricing, string | undefined]>)
    .filter(([, value]) => Boolean(value))
    .map(([key, value]) => ({
      label: SIZE_LABELS[key],
      value: value as string,
    }))
}

export default function CrystalProductDetail({ product, locale }: CrystalProductDetailProps) {
  const isThai = locale === 'th'
  const sizeEntries = renderSizeEntries(product.sizePrices)
  const colorDisplay = product.color || product.toneColors?.join(', ')

  return (
    <section className="bg-white py-8 md:py-12">
      <div className="container max-w-5xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
          <div className="p-6 md:p-8 flex items-start justify-center col-span-1">
            <div className="relative w-[250px] h-[250px] bg-gray-500">
              <Image
                src={product.image || '/images/logo.avif'}
                alt={product.title}
                fill
                className="object-cover"
                priority
                sizes="250px"
              />
            </div>
          </div>

          <div className="p-6 md:p-8 flex flex-col col-span-2">
            <div className="border-b border-gray-200 pb-6 mb-6">
              <h1 className="text-2xl md:text-3xl lg:text-4xl text-gray-900 mb-2 font-bold">
                {product.title}
              </h1>
              {product.subtitle && (
                <h2 className="text-lg md:text-xl lg:text-2xl text-gray-900">{product.subtitle}</h2>
              )}
            </div>

            <div className="flex-1 space-y-3">
              <DetailRow
                label={isThai ? 'ธาตุพลังงาน' : 'Energy Element'}
                value={product.story.energyElement}
              />
              <DetailRow
                label={isThai ? 'จักระ' : 'Chakra'}
                value={product.story.connectedChakras?.join(', ')}
              />
              <DetailRow
                label={isThai ? 'ลัคนา' : 'Ascendant'}
                value={product.story.ascendant?.join(', ')}
              />
              <DetailRow
                label={isThai ? 'ดาวประจำ' : 'Ruling Planet'}
                value={product.story.starRelations?.join(', ')}
              />
              <DetailRow
                label={isThai ? 'สี' : 'Color'}
                value={colorDisplay}
              />
              {product.category && (
                <DetailRow
                  label={isThai ? 'หมวดหมู่' : 'Category'}
                  value={product.category}
                />
              )}
            </div>

            {sizeEntries.length > 0 && (
              <div className="mt-6">
                <h3 className="text-base md:text-lg text-gray-900 font-medium mb-2">
                  {isThai ? 'ราคาตามขนาด' : 'Price by size'}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {sizeEntries.map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between rounded-full border border-gray-200 px-4 py-2"
                    >
                      <span className="text-sm text-gray-600">{label}</span>
                      <span className="text-sm text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {product.description.length > 0 && (
          <div className="p-6 md:p-8">
            <div className="space-y-4">
              {product.description.map((paragraph, index) => (
                <p key={index} className="text-base md:text-lg text-gray-900 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
