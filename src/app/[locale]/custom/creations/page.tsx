import ChatWidget from '@/components/ChatWidget'
import DIYCreationsGallery from '@/components/DIYCreationsGallery'
import NavigationWithSuspense from '@/components/NavigationWithSuspense'
import { Footer } from '@/components/sections'
import { REVALIDATE_DYNAMIC } from '@/config/cache.config'
import { fetchRecentlyDiyDesigns } from '@/lib/api/recently-diy'
import { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

const ALL_DIY_LIMIT = Number.MAX_SAFE_INTEGER

export const revalidate = REVALIDATE_DYNAMIC

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'diyCreations.allPage' })

  const title = t('metaTitle')
  const description = t('metaDescription')

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  }
}

export default async function AllDIYCreationsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('diyCreations.allPage')
  const creations = await fetchRecentlyDiyDesigns(ALL_DIY_LIMIT, (locale as 'th' | 'en') ?? 'th')

  return (
    <>
      <NavigationWithSuspense position="static" />
      <main className="min-h-screen bg-white pt-12 md:pt-16">
        <section className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">{t('title')}</h1>
            <p className="mt-4 text-lg text-gray-600 md:text-xl md:leading-relaxed">
              {t('description')}
            </p>
          </div>

          <div className="mt-12 md:mt-16">
            <DIYCreationsGallery
              creations={creations}
              emptyTitle={t('emptyTitle')}
              emptyDescription={t('emptyDescription')}
            />
          </div>
        </section>
      </main>
      <Footer />
      <ChatWidget />
    </>
  )
}
