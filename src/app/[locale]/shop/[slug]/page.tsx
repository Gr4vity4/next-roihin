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

export const revalidate = 0

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
        <section className="relative isolate border-b border-white/10 bg-gradient-to-b from-black via-black/95 to-black/80 pt-28 md:pt-36 lg:pt-40 min-[1408px]:pt-[320px]">
          <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-70">
            <div className="absolute -top-40 right-[-10%] h-96 w-96 rounded-full bg-gold/20 blur-[160px]" />
            <div className="absolute -bottom-24 left-[-10%] h-72 w-72 rounded-full bg-emerald-500/20 blur-[140px]" />
          </div>
          <div className="container relative z-10 mx-auto max-w-5xl px-6 py-20 md:py-24 min-[1408px]:py-[160px]">
            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.15em] text-white/50">
              <Link href="/shop" className="transition-colors hover:text-gold">
                {t('listing.breadcrumb')}
              </Link>
              <span className="text-white/30">/</span>
              <span className="text-white">{sectionTitle}</span>
            </div>
            <div className="mt-6 max-w-3xl space-y-4">
              <h1 className="text-3xl font-light tracking-[0.05em] md:text-4xl">{sectionTitle}</h1>
              <p className="text-white/70">{sectionDescription}</p>
            </div>
          </div>
        </section>

        <section className="container mx-auto max-w-6xl px-6 py-12 md:py-16">
          {products.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-white/0 p-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/10 text-2xl text-gold">
                ✨
              </div>
              <h2 className="mt-6 text-2xl font-light text-white">
                {t('listing.emptyState.title')}
              </h2>
              <p className="mt-3 text-white/70">
                {t('listing.emptyState.description')}
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/shop"
                  className="rounded-full border border-white/40 px-6 py-2 text-xs uppercase tracking-[0.18em] text-white hover:border-gold hover:text-gold transition-colors"
                >
                  {t('listing.emptyState.primaryCta')}
                </Link>
                <Link
                  href="/personalized"
                  className="rounded-full border border-transparent bg-white text-xs uppercase tracking-[0.18em] text-black px-6 py-2 hover:bg-gold transition-colors"
                >
                  {t('listing.emptyState.secondaryCta')}
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-10">
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ShopProductCard
                    key={product.id}
                    product={product}
                    locale={locale}
                    newLabel={t('listing.newLabel')}
                    collectionSlug={slug}
                  />
                ))}
              </div>

              <PaginationControls
                currentPage={page}
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
