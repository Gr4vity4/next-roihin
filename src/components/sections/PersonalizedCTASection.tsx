import Link from 'next/link'
import { Container } from '../ui'

interface PersonalizedCTASectionProps {
  buttons: Array<{
    text: string
    href: string
    variant: 'primary' | 'secondary' | 'gold'
    highlight?: boolean
  }>
}

export default function PersonalizedCTASection({ buttons }: PersonalizedCTASectionProps) {
  const getButtonStyles = (variant: string, highlight?: boolean) => {
    const baseStyles =
      'px-8 py-4  font-medium text-lg transition-all duration-300 rounded-sm border-2 min-w-[200px]'

    switch (variant) {
      case 'gold':
        return `${baseStyles} ${
          highlight
            ? 'bg-[#D4AF37] text-black hover:bg-[#c1a030] border-[#D4AF37] hover:border-[#c1a030] shadow-lg transform hover:scale-105'
            : 'bg-[#D4AF37] text-black hover:bg-[#c1a030] border-[#D4AF37] hover:border-[#c1a030]'
        }`
      case 'primary':
        return `${baseStyles} bg-[#006039] text-white hover:bg-[#004d2e] border-[#006039] hover:border-[#004d2e]`
      case 'secondary':
        return `${baseStyles} bg-transparent text-[#006039] border-[#006039] hover:bg-[#006039] hover:text-white`
      default:
        return `${baseStyles} bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200`
    }
  }

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-gray-50">
      <Container padding="lg">
        <div className="max-w-4xl mx-auto text-center">
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            {buttons.map((button, index) => (
              <Link
                key={`cta-${index}`}
                href={button.href}
                className={getButtonStyles(button.variant, button.highlight)}
              >
                {button.text}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
