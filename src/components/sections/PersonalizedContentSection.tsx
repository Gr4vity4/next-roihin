'use client'

import { FontProvider } from '@/components/providers/FontProvider'
import { useTranslations } from 'next-intl'
import { Container, Typography } from '../ui'

export default function PersonalizedContentSection() {
  const t = useTranslations('personalizedPage.content')

  return (
    <FontProvider fonts={{ th: 'font-prompt', en: 'font-playfair' }}>
      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <Container padding="lg">
          <div className="max-w-5xl mx-auto">
            {/* Title Section */}
            <div className="text-center mb-12 sm:mb-16 md:mb-20">
              <FontProvider fonts={{ th: 'font-playfair', en: 'font-playfair' }}>
                <Typography variant="h2" align="center" className="mb-6">
                  <span className="text-gray-800">{t('title')}</span>
                  <br />
                  <span className="text-black font-bold">{t('highlight')}</span>
                </Typography>
              </FontProvider>

              <Typography
                variant="h3"
                align="center"
                color="primary"
                className="italic font-medium"
              >
                &ldquo;{t('subtitle')}&rdquo;
              </Typography>
            </div>

            {/* Content Section */}
            <div
              className="space-y-6 sm:space-y-4 text-gray-700 leading-relaxed max-w-4xl mx-auto"
              dangerouslySetInnerHTML={{ __html: t.raw('text') }}
            />
          </div>
        </Container>
      </section>
    </FontProvider>
  )
}
