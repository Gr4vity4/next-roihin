import CategoryNavigation from '@/components/charmspacer/CategoryNavigation'
import ProductGrid from '@/components/charmspacer/ProductGrid'
import ChatWidget from '@/components/ChatWidget'
import NavigationWithSuspense from '@/components/NavigationWithSuspense'
import { Footer } from '@/components/sections'
import PersonalizedHeroSection from '@/components/sections/PersonalizedHeroSection'
import { REVALIDATE_SEMI_STATIC } from '@/config/cache.config'
import { getAllProducts } from '@/lib/api/products'
import { Product } from '@/lib/types/products'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export const revalidate = REVALIDATE_SEMI_STATIC

interface CharmspacerPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: CharmspacerPageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'charmspacer' })

  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
    keywords:
      locale === 'th'
        ? 'ชาร์ม, สเปเซอร์, ชาร์มจี้, หินมงคล, ร้อยหิน'
        : 'charm, spacer, pendant, lucky stone, roihin',
  }
}

export default async function CharmspacerPage({ params }: CharmspacerPageProps) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'charmspacer' })

  let products: Product[] = []

  try {
    products = await getAllProducts(locale as 'en' | 'th')
  } catch (error) {
    console.error('Failed to fetch products:', error)
    products = []
  }

  // Define category slug mappings (slug-based for locale independence)
  const categorySlugMappings = {
    'lucky-charm': 'charm' as const,
    'spacer': 'spacer' as const,
    'pendant': 'pendant' as const,
  }

  // Group products by their category
  const productsByCategory = {
    charm: [] as Product[],
    spacer: [] as Product[],
    pendant: [] as Product[],
  }

  products.forEach((product) => {
    const categorySlug = product.product_category?.slug || ''
    const categoryKey = categorySlugMappings[categorySlug as keyof typeof categorySlugMappings]

    if (categoryKey && categoryKey in productsByCategory) {
      productsByCategory[categoryKey as keyof typeof productsByCategory].push(product)
    }
  })

  // Prepare category navigation data
  const categories = [
    { id: 'charm', name: t('categories.charm.name') },
    { id: 'spacer', name: t('categories.spacer.name') },
    { id: 'pendant', name: t('categories.pendant.name') },
  ]

  // Prepare products with prices for ProductGrid
  const prepareProductsForGrid = (categoryProducts: Product[]) => {
    return categoryProducts.map((product) => ({
      id: product.id.toString(),
      slug: product.slug,
      title: product.title,
      featured_image_url: product.featured_image_url,
      price: product.acf.color_prices?.[0]?.price || 0,
    }))
  }

  return (
    <>
      <NavigationWithSuspense />

      <main className="min-h-screen">
        <PersonalizedHeroSection
          backgroundImage="/images/banner/charmspacer-banner.avif"
          title={t('hero.title')}
          subtitle={t('hero.subtitle')}
        />

        <CategoryNavigation categories={categories} />

        <div className="bg-black">
          {/* Charm Section */}
          <section id="charm" className="container max-w-5xl mx-auto px-4 py-16 md:py-24">
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-medium text-gold-500 mb-4">
                {t('categories.charm.title')}
              </h2>
              <p className="text-white text-sm md:text-base leading-relaxed">
                {t('categories.charm.description')}
              </p>
            </div>
            {productsByCategory.charm.length > 0 ? (
              <ProductGrid
                products={prepareProductsForGrid(productsByCategory.charm)}
                currentLocale={locale}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">{t('noProducts')}</p>
              </div>
            )}
          </section>

          {/* Spacer Section */}
          <section id="spacer" className="container max-w-5xl mx-auto px-4 py-16 md:py-24">
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-medium text-gold-500 mb-4">
                {t('categories.spacer.title')}
              </h2>
              <p className="text-white text-sm md:text-base leading-relaxed">
                {t('categories.spacer.description')}
              </p>
            </div>
            {productsByCategory.spacer.length > 0 ? (
              <ProductGrid
                products={prepareProductsForGrid(productsByCategory.spacer)}
                currentLocale={locale}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">{t('noProducts')}</p>
              </div>
            )}
          </section>

          {/* Pendant Section */}
          <section id="pendant" className="containe max-w-5xl mx-auto px-4 py-16 md:py-24 border-t">
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-medium text-gold-500 mb-4">
                {t('categories.pendant.title')}
              </h2>
              <p className="text-white text-sm md:text-base leading-relaxed">
                {t('categories.pendant.description')}
              </p>
            </div>
            {productsByCategory.pendant.length > 0 ? (
              <ProductGrid
                products={prepareProductsForGrid(productsByCategory.pendant)}
                currentLocale={locale}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">{t('noProducts')}</p>
              </div>
            )}
          </section>

          {/* Show message if no products at all */}
          {products.length === 0 && (
            <div className="flex items-center justify-center min-h-[400px] text-center px-4">
              <div className="max-w-md">
                <p className="text-gray-400 text-lg">{t('noProducts')}</p>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      <ChatWidget />
    </>
  )
}
