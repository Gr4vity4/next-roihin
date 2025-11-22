import NavigationWithSuspense from '@/components/NavigationWithSuspense'
import ChatWidget from '@/components/ChatWidget'
import { Footer } from '@/components/sections'
import ShopProductCard from '@/components/shop/ProductCard'
import PaginationControls from '@/components/shop/PaginationControls'
import { getShopCollection } from '@/config/shop.config'
import { fetchProducts } from '@/lib/api/products'
import type { Product } from '@/lib/types/products'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const revalidate = 300

const ITEMS_PER_PAGE = 20

interface ShopListingPageProps {
  params: Promise<{ locale: string; slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params }: ShopListingPageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const t = await getTranslations({ locale, namespace: 'shop' })

  const isNewArrivals = slug === 'new-arrivals'
  const collection = getShopCollection(slug)

  if (!isNewArrivals && !collection) {
    return {
      title: t('pageTitle'),
      description: t('pageDescription'),
    }
  }

  const sectionTitle = isNewArrivals
    ? t('newArrivals.title')
    : t(`categories.${slug}.title`)
  const sectionDescription = isNewArrivals
    ? t('newArrivals.description')
    : t(`categories.${slug}.description`)

  return {
    title: `${sectionTitle} | ${t('hero.title')}`,
    description: sectionDescription,
  }
}

export default async function ShopListingPage({ params, searchParams }: ShopListingPageProps) {
  const { locale, slug } = await params
  const t = await getTranslations({ locale, namespace: 'shop' })
  const resolvedSearchParams = await searchParams
  const rawPage = resolvedSearchParams?.page
  const page = typeof rawPage === 'string' ? Math.max(parseInt(rawPage, 10) || 1, 1) : 1

  const isNewArrivals = slug === 'new-arrivals'
  const collection = getShopCollection(slug)

  if (!isNewArrivals && !collection) {
    notFound()
  }

  let products: Product[] = []
  let totalPages = 1
  let totalItems = 0

  try {
    const { products: items, pagination } = await fetchProducts({
      language: locale as 'en' | 'th',
      perPage: ITEMS_PER_PAGE,
      page,
      ...(isNewArrivals
        ? { isArrival: true }
        : { category: slug }),
    })

    products = items
    totalPages = pagination?.last_page ?? 1
    totalItems = pagination?.total ?? items.length
  } catch (error) {
    console.error('Failed to load shop products', error)
    products = []
    totalPages = 1
    totalItems = 0
  }

  const sectionTitle = isNewArrivals ? t('newArrivals.title') : t(`categories.${slug}.title`)
  const sectionDescription = isNewArrivals
    ? t('newArrivals.description')
    : t(`categories.${slug}.description`)

  const startIndex = totalItems === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1
  const endIndex = totalItems === 0 ? 0 : startIndex + products.length - 1

  const buildHref = (pageNumber: number) => {
    if (pageNumber <= 1) {
      return `/shop/${slug}`
    }

    return `/shop/${slug}?page=${pageNumber}`
  }

  return (
    <>
      <NavigationWithSuspense />

      <main className="min-h-screen bg-black text-white">
        <section className="mt-24 border-b border-white/10 bg-black/80 md:mt-28 min-[1408px]:mt-[230px]">
          <div className="container mx-auto max-w-5xl px-6 py-20 md:py-24 min-[1408px]:py-[160px]">
            <Link
              href="/shop"
              className="text-xs uppercase tracking-[0.4em] text-white/40 hover:text-gold transition-colors"
            >
              {t('listing.breadcrumb')}
            </Link>
            <h1 className="mt-4 text-3xl font-light tracking-[0.2em] md:text-4xl">{sectionTitle}</h1>
            <p className="mt-4 max-w-3xl text-white/70">{sectionDescription}</p>
          </div>
        </section>

        <section className="container mx-auto max-w-6xl px-6 py-12 md:py-16">
          {products.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center">
              <p className="text-white/60">{t('listing.empty')}</p>
            </div>
          ) : (
            <div className="space-y-10">
              <div className="grid gap-6 md:grid-cols-2">
                {products.map((product) => (
                  <ShopProductCard
                    key={product.id}
                    product={product}
                    locale={locale}
                    newLabel={t('listing.newLabel')}
                  />
                ))}
              </div>

              <PaginationControls
                currentPage={page}
                totalPages={totalPages}
                buildHref={buildHref}
                previousLabel={t('listing.pagination.previous')}
                nextLabel={t('listing.pagination.next')}
                pageLabel={t('listing.pagination.page', { current: page, total: totalPages })}
                summaryLabel={t('listing.pagination.summary', {
                  start: startIndex,
                  end: endIndex,
                  total: totalItems,
                })}
                isFirstPage={page <= 1}
                isLastPage={page >= totalPages}
              />
            </div>
          )}
        </section>
      </main>

      <Footer />
      <ChatWidget />
    </>
  )
}
