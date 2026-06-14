'use client'

import { MessageCircle } from 'lucide-react'
import { useLocale } from 'next-intl'
import Button from './Button'

// Same Line link used in the footer social links (Footer.tsx)
const LINE_URL = 'https://lin.ee/palYKiG'

export default function ChatWidget() {
  const locale = useLocale()

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <a
        href={LINE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={locale === 'th' ? 'เปิดแชต' : 'Open chat'}
      >
        <Button
          variant="primary"
          size="md"
          leftIcon={<MessageCircle size={20} />}
          className="shadow-xl hover:shadow-2xl animate-fade-in p-4"
          tabIndex={-1}
        />
      </a>
    </div>
  )
}
