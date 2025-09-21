import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Typography } from '../ui'

interface AboutFeaturesSectionProps {
  locale: string
}

export default async function AboutFeaturesSection({ locale }: AboutFeaturesSectionProps) {
  const t = await getTranslations({ locale, namespace: 'aboutPage.features' })

  const features = [
    {
      id: 'unique-design',
      image: '/images/about/1.avif',
      title: t('uniqueDesign.title'),
      subtitle: t('uniqueDesign.subtitle'),
    },
    {
      id: 'natural-purifying',
      image: '/images/about/2.avif',
      title: t('naturalPurifying.title'),
      subtitle: t('naturalPurifying.subtitle'),
    },
    {
      id: 'premium-care',
      image: '/images/about/3.avif',
      title: t('premiumCare.title'),
      subtitle: t('premiumCare.subtitle'),
    },
    {
      id: 'empowering-ritual',
      image: '/images/about/4.avif',
      title: t('empoweringRitual.title'),
      subtitle: t('empoweringRitual.subtitle'),
    },
  ]

  return (
    <section className="w-full bg-gray-50 py-8 sm:py-12 md:py-0">
      <div className="px-4 sm:px-6 md:px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-0">
          {features.map((feature) => (
            <div key={feature.id} className="group">
              {/* Feature Image with Text Overlay */}
              <div className="relative aspect-[3/4] overflow-hidden bg-white group-hover:shadow-xl transition-shadow duration-300">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Text Overlay at Bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-6 text-white">
                  <Typography
                    variant="h4"
                    align="center"
                    className="text-white font-semibold tracking-wide mb-2 text-lg md:text-xl"
                  >
                    {feature.title}
                  </Typography>

                  <Typography
                    variant="body"
                    align="center"
                    className="text-white/90 text-sm md:text-base leading-relaxed"
                  >
                    {feature.subtitle}
                  </Typography>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}