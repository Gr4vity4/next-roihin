'use client'

import { cn } from '@/lib/utils'
import Container from '@/components/ui/Container'
import Typography from '@/components/ui/Typography'
import { useState } from 'react'

interface CharmspacerHeroProps {
  title: {
    thai: string
    english: string
  }
  tabs: {
    id: string
    label: string
    href: string
  }[]
  backgroundImage?: string
}

export default function CharmspacerHero({ title, tabs, backgroundImage }: CharmspacerHeroProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '')

  const handleTabClick = (tabId: string, href: string) => {
    setActiveTab(tabId)
    // Scroll to section
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative min-h-[60vh] lg:min-h-[70vh] flex items-center justify-center bg-black">
      {/* Background Image */}
      {backgroundImage && (
        <div className="absolute inset-0">
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `url(${backgroundImage})`,
              filter: 'brightness(0.3)'
            }}
          />
        </div>
      )}

      {/* Content */}
      <Container className="relative z-10 text-center py-20">
        <div className="space-y-8">
          {/* Title */}
          <div className="space-y-4">
            <Typography variant="h1" fontFamily="fciconic" className="text-4xl md:text-5xl lg:text-6xl text-white">
              {title.thai}
            </Typography>
            <Typography variant="h2" fontFamily="mixed-lang" className="text-2xl md:text-3xl lg:text-4xl text-white">
              {title.english}
            </Typography>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-12">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id, tab.href)}
                className={cn(
                  'px-6 md:px-8 py-3 font-fciconic text-base md:text-lg transition-all duration-300',
                  'border-b-2',
                  activeTab === tab.id
                    ? 'text-green-500 border-green-500'
                    : 'text-white border-transparent hover:text-green-400 hover:border-green-400'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}