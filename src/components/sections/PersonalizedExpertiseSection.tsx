'use client'

import { useTranslations } from 'next-intl'
import { Container, Typography } from '../ui'

export default function PersonalizedExpertiseSection() {
  const t = useTranslations('personalizedPage.expertise')

  return (
    <section className="bg-white">
      <Container padding="lg">
        <div className="max-w-4xl mx-auto">
          {/* Content Section */}
          <div className="space-y-6 sm:space-y-8 md:space-y-10">
            <Typography variant="body" className="text-gray-700 leading-relaxed">
              {t('paragraph1')}
            </Typography>

            <Typography variant="body" className="text-gray-700 leading-relaxed">
              {t('paragraph2')}
            </Typography>

            <Typography variant="body" className="text-gray-700 leading-relaxed">
              {t('paragraph3')}
            </Typography>
          </div>
        </div>
      </Container>
    </section>
  )
}
