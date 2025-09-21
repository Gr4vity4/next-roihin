import { getTranslations } from 'next-intl/server'

interface AboutContentSectionProps {
  locale: string
}

export default async function AboutContentSection({ locale }: AboutContentSectionProps) {
  const t = await getTranslations({ locale, namespace: 'aboutPage.content' })

  const paragraphs = [
    t('paragraph1'),
    t('paragraph2'),
    t('paragraph3'),
    t('paragraph4'),
  ]

  return (
    <section className="py-16 md:py-24 bg-[#FCFCFC]">
      <div className="max-w-5xl mx-auto px-6 md:px-8">
        {/* Title Section */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4">
            <span className="font-light">{t('titlePrefix')}</span>{' '}
            <span className="text-[#2A5F3E] font-medium">{t('title')}</span>
          </h2>

          <p className="text-lg md:text-xl text-gray-600 mt-4">
            {t('subtitle')}
          </p>
        </div>

        {/* Content Section - Single Column */}
        <div className="space-y-8 md:space-y-10">
          {/* Combined Content */}
          <div className="space-y-6">
            {paragraphs.map((paragraph, index) => (
              <p
                key={`content-${index}`}
                className="text-gray-700 leading-relaxed text-base md:text-lg text-center"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}