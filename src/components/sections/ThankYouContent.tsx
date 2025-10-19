'use client'

import Container from '@/components/ui/Container'
import Typography from '@/components/ui/Typography'
import { CircleCheck } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

export default function ThankYouContent() {
  const t = useTranslations('thankYou')

  return (
    <section className="pt-24 pb-12 md:pt-32 md:pb-16 min-h-screen bg-gray-50">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CircleCheck className="w-8 h-8 text-green-600" fill="currentColor" />
            </div>
            <Typography variant="h3" className="text-gray-900 mb-2">
              {t('success.title')}
            </Typography>
            <p className="text-gray-600 mt-4">
              Order management functionality will be available soon.
            </p>
          </div>

          {/* Actions */}
          <div className="text-center">
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              {t('actions.backToHome')}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}
