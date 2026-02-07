'use client'

import { MessageCircle } from 'lucide-react'
import { useLocale } from 'next-intl'
import Button from './Button'

export default function ChatWidget() {
  const locale = useLocale()

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        variant="primary"
        size="md"
        leftIcon={<MessageCircle size={20} />}
        className="shadow-xl hover:shadow-2xl animate-fade-in p-4"
        aria-label={locale === 'th' ? 'เปิดแชต' : 'Open chat'}
      />
    </div>
  )
}
