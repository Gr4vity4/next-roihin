'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import ChatWidget from '@/components/ChatWidget'
import NavigationWithSuspense from '@/components/NavigationWithSuspense'
import { Footer } from '@/components/sections'
import PersonalizedHeroSection from '@/components/sections/PersonalizedHeroSection'
import CrystalFilterSidebar from '@/components/crystal/CrystalFilterSidebar'
import CrystalGrid from '@/components/crystal/CrystalGrid'
import Pagination from '@/components/crystal/Pagination'
import { getCrystals } from '@/lib/api/crystals'
import type { Crystal } from '@/lib/types/crystal'

const ITEMS_PER_PAGE = 20

/**
 * Filter value mapping from UI display to ACF field values
 * This maps the translated filter labels to the database field values
 */
const FILTER_VALUE_MAPPINGS = {
  // Energy properties mapping
  energyProperties: {
    'การเงิน โชคลาภ': 'finance_fortune',
    'Finance, Fortune': 'finance_fortune',
    'การงาน ธุรกิจ การลงทุน': 'work_business',
    'Work, Business, Investment': 'work_business',
    'ความรัก ความสุข โชคดี': 'love_happiness',
    'Love, Happiness, Luck': 'love_happiness',
    'สุขภาพ สมดุลชีวิต': 'health_balance',
    'Health, Balance': 'health_balance',
    'จิตวิญญาณ ความมั่นคง': 'spirituality_stability',
    'Spirituality, Stability': 'spirituality_stability',
  } as Record<string, string>,

  // Zodiac signs mapping
  zodiacSigns: {
    'เมษ - Aries': 'aries',
    'Aries': 'aries',
    'พฤษภ - Taurus': 'taurus',
    'Taurus': 'taurus',
    'เมถุน - Gemini': 'gemini',
    'Gemini': 'gemini',
    'กรกฎ - Cancer': 'cancer',
    'Cancer': 'cancer',
    'สิงห์ - Leo': 'leo',
    'Leo': 'leo',
    'กันย์ - Virgo': 'virgo',
    'Virgo': 'virgo',
    'ตุลย์ - Libra': 'libra',
    'Libra': 'libra',
    'พิจิก - Scorpio': 'scorpio',
    'Scorpio': 'scorpio',
    'ธนู - Sagittarius': 'sagittarius',
    'Sagittarius': 'sagittarius',
    'มังกร - Capricorn': 'capricorn',
    'Capricorn': 'capricorn',
    'กุมภ์ - Aquarius': 'aquarius',
    'Aquarius': 'aquarius',
    'มีน - Pisces': 'pisces',
    'Pisces': 'pisces',
  } as Record<string, string>,

  // Element types mapping
  elements: {
    'ราศีดิน': 'earth',
    'Earth Sign': 'earth',
    'ราศีน้ำ': 'water',
    'Water Sign': 'water',
    'ราศีลม': 'air',
    'Air Sign': 'air',
    'ราศีไฟ': 'fire',
    'Fire Sign': 'fire',
  } as Record<string, string>,
}

/**
 * Map UI filter values to ACF field values
 */
function mapFilterValues(values: string[], mapping: Record<string, string>): string {
  return values
    .map((value) => mapping[value] || value.toLowerCase().replace(/\s+/g, '_'))
    .join(',')
}

export default function CrystalPage() {
  const params = useParams()
  const locale = (params.locale as string) || 'th'
  const t = useTranslations('crystal')

  // State
  const [crystals, setCrystals] = useState<Crystal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)

  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedEnergyProperties, setSelectedEnergyProperties] = useState<string[]>([])
  const [selectedZodiacSigns, setSelectedZodiacSigns] = useState<string[]>([])
  const [selectedElements, setSelectedElements] = useState<string[]>([])

  // Fetch crystals when filters or page change
  useEffect(() => {
    async function fetchCrystals() {
      setIsLoading(true)
      setError(null)

      try {
        // Map filter values to ACF field values
        const colorFilter = selectedColors.join(',')
        const energyFilter = mapFilterValues(
          selectedEnergyProperties,
          FILTER_VALUE_MAPPINGS.energyProperties
        )
        const zodiacFilter = mapFilterValues(
          selectedZodiacSigns,
          FILTER_VALUE_MAPPINGS.zodiacSigns
        )
        const elementFilter = mapFilterValues(
          selectedElements,
          FILTER_VALUE_MAPPINGS.elements
        )

        const result = await getCrystals({
          lang: locale as 'en' | 'th',
          page: currentPage,
          per_page: ITEMS_PER_PAGE,
          search: searchQuery,
          color_filter: colorFilter || undefined,
          energy_properties: energyFilter || undefined,
          zodiac_signs: zodiacFilter || undefined,
          element_type: elementFilter || undefined,
        })

        setCrystals(result.crystals)
        setTotalPages(result.totalPages)
      } catch (err) {
        console.error('Error fetching crystals:', err)
        setError('Failed to load crystals')
        setCrystals([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchCrystals()
  }, [
    locale,
    currentPage,
    searchQuery,
    selectedColors,
    selectedEnergyProperties,
    selectedZodiacSigns,
    selectedElements,
  ])

  // Filter toggle handlers
  const handleColorToggle = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    )
    setCurrentPage(1)
  }

  const handleEnergyPropertyToggle = (property: string) => {
    setSelectedEnergyProperties((prev) =>
      prev.includes(property) ? prev.filter((p) => p !== property) : [...prev, property]
    )
    setCurrentPage(1)
  }

  const handleZodiacSignToggle = (sign: string) => {
    setSelectedZodiacSigns((prev) =>
      prev.includes(sign) ? prev.filter((s) => s !== sign) : [...prev, sign]
    )
    setCurrentPage(1)
  }

  const handleElementToggle = (element: string) => {
    setSelectedElements((prev) =>
      prev.includes(element) ? prev.filter((e) => e !== element) : [...prev, element]
    )
    setCurrentPage(1)
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  return (
    <>
      <NavigationWithSuspense />

      <main className="min-h-screen">
        <PersonalizedHeroSection
          backgroundImage="/images/banner/crystal-banner.avif"
          title={t('hero.title')}
          subtitle={t('hero.subtitle')}
        />

        <div className="bg-black">
          <div className="container max-w-7xl mx-auto px-4 py-12 md:py-16">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
              {/* Sidebar */}
              <CrystalFilterSidebar
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                selectedColors={selectedColors}
                onColorToggle={handleColorToggle}
                selectedEnergyProperties={selectedEnergyProperties}
                onEnergyPropertyToggle={handleEnergyPropertyToggle}
                selectedZodiacSigns={selectedZodiacSigns}
                onZodiacSignToggle={handleZodiacSignToggle}
                selectedElements={selectedElements}
                onElementToggle={handleElementToggle}
              />

              {/* Main Content */}
              <div className="flex-1 min-w-0">
                {/* Header with title and pagination */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                  <h1 className="text-2xl md:text-3xl font-medium text-white">{t('title')}</h1>
                  {totalPages > 1 && !isLoading && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  )}
                </div>

                {/* Loading State */}
                {isLoading && (
                  <div className="text-center py-12">
                    <div className="inline-block w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-400 text-lg mt-4">Loading crystals...</p>
                  </div>
                )}

                {/* Error State */}
                {error && !isLoading && (
                  <div className="text-center py-12">
                    <p className="text-red-400 text-lg">{error}</p>
                  </div>
                )}

                {/* Crystal Grid */}
                {!isLoading && !error && (
                  <>
                    {crystals.length > 0 ? (
                      <CrystalGrid crystals={crystals} currentLocale={locale} />
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-400 text-lg">{t('noProducts')}</p>
                      </div>
                    )}
                  </>
                )}

                {/* Bottom Pagination */}
                {totalPages > 1 && crystals.length > 0 && !isLoading && (
                  <div className="mt-12">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <ChatWidget />
    </>
  )
}
