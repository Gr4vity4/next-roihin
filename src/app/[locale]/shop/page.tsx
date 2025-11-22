import NavigationWithSuspense from '@/components/NavigationWithSuspense'
import ChatWidget from '@/components/ChatWidget'
import { Footer } from '@/components/sections'
import { SHOP_COLLECTIONS } from '@/config/shop.config'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'

export const revalidate = 600

interface ShopPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: ShopPageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'shop' })

  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
  }
}

export default async function ShopPage({ params }: ShopPageProps) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'shop' })

  const cards = [
    {
      slug: 'new-arrivals',
      title: t('newArrivals.title'),
      description: t('newArrivals.description'),
      cta: t('newArrivals.cta'),
      accent: 'from-amber-500/20 via-amber-300/10 to-transparent border border-amber-400/40',
    },
    ...SHOP_COLLECTIONS.map((collection) => ({
      slug: collection.slug,
      title: t(`categories.${collection.slug}.title`),
      description: t(`categories.${collection.slug}.description`),
      cta: t(`categories.${collection.slug}.cta`),
      accent: 'from-white/10 via-transparent to-transparent border border-white/10',
    })),
  ]

  return (
    <>
      <NavigationWithSuspense />

      <main className="min-h-screen bg-black text-white">
        <section className="relative isolate overflow-hidden border-b border-white/10 bg-gradient-to-b from-black via-black/70 to-black">
          <div className="container mx-auto max-w-5xl px-6 py-24 text-center">
            <p className="text-sm uppercase tracking-[0.5em] text-white/50">{t('hero.label')}</p>
            <h1 className="mt-6 text-4xl font-light tracking-[0.15em] text-white md:text-5xl">
              {t('hero.title')}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base text-white/70">
              {t('hero.subtitle')}
            </p>
            <div className="mt-12 flex justify-center">
              <Link
                href="/shop/new-arrivals"
                className="rounded-full border border-white/40 px-8 py-3 text-xs uppercase tracking-[0.4em] text-white hover:border-gold hover:text-gold transition-colors"
              >
                {t('hero.cta')}
              </Link>
            </div>
          </div>
        </section>

        <section className="container mx-auto max-w-6xl px-6 py-16 md:py-24">
          <div className="mb-12 text-center">
            <p className="text-sm uppercase tracking-[0.4em] text-white/50">{t('landing.label')}</p>
            <h2 className="mt-4 text-3xl font-light text-white md:text-4xl">{t('landing.title')}</h2>
            <p className="mx-auto mt-4 max-w-3xl text-white/60">{t('landing.description')}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {cards.map((card) => (
              <Link
                key={card.slug}
                href={card.slug === 'new-arrivals' ? '/shop/new-arrivals' : `/shop/${card.slug}`}
                className={`group relative overflow-hidden rounded-3xl border bg-gradient-to-br ${card.accent} p-8 transition hover:border-gold/60`}
              >
                <div className="flex flex-col gap-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                    {card.slug === 'new-arrivals' ? t('landing.newFlag') : t('landing.collectionFlag')}
                  </p>
                  <h3 className="text-2xl font-light text-white group-hover:text-gold transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-white/70">{card.description}</p>
                  <span className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-white/60">
                    {card.cta}
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/30 text-sm transition-colors group-hover:border-gold group-hover:text-gold">
                      →
                    </span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
      <ChatWidget />
    </>
  )
}
