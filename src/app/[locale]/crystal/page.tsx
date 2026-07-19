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
import { content } from '@/config/content.config'
import { getCrystals } from '@/lib/api/crystals'
import type { Crystal } from '@/lib/types/crystal'

const ITEMS_PER_PAGE = 20

/**
 * Filter value mapping from UI display labels to CMS field values.
 * The CMS matches these exactly (case-sensitive; unknown values make the
 * whole request fail with a redirect rather than an empty result).
 */
const FILTER_VALUE_MAPPINGS = {
  // Energy properties mapping
  energyProperties: {
    'การเงิน โชคลาภ': 'Finance & Prosperity',
    'Finance, Fortune': 'Finance & Prosperity',
    'การงาน ธุรกิจ การลงทุน': 'Career, Business & Investment',
    'Work, Business, Investment': 'Career, Business & Investment',
    'ความรัก ความสุข โชคดี': 'Love, Happiness & Luck',
    'Love, Happiness, Luck': 'Love, Happiness & Luck',
    'สุขภาพ สมดุลชีวิต': 'Health & Balance',
    'Health, Balance': 'Health & Balance',
    'จิตวิญญาณ ความมั่นคง': 'Spirituality & Stability',
    'Spirituality, Stability': 'Spirituality & Stability',
  } as Record<string, string>,

  // Zodiac signs mapping
  zodiacSigns: {
    'เมษ - Aries': 'Aries',
    'พฤษภ - Taurus': 'Taurus',
    'เมถุน - Gemini': 'Gemini',
    'กรกฎ - Cancer': 'Cancer',
    'สิงห์ - Leo': 'Leo',
    'กันย์ - Virgo': 'Virgo',
    'ตุลย์ - Libra': 'Libra',
    'พิจิก - Scorpio': 'Scorpio',
    'ธนู - Sagittarius': 'Sagittarius',
    'มังกร - Capricorn': 'Capricorn',
    'กุมภ์ - Aquarius': 'Aquarius',
    'มีน - Pisces': 'Pisces',
  } as Record<string, string>,

  // Element types mapping
  elements: {
    'ราศีดิน': 'Earth',
    'Earth Sign': 'Earth',
    'ราศีน้ำ': 'Water',
    'Water Sign': 'Water',
    'ราศีลม': 'Air',
    'Air Sign': 'Air',
    'ราศีไฟ': 'Fire',
    'Fire Sign': 'Fire',
  } as Record<string, string>,
}

/**
 * Map UI filter labels to CMS field values. Unmapped labels pass through
 * unchanged (the English zodiac labels already match the CMS values).
 */
function mapFilterValues(values: string[], mapping: Record<string, string>): string[] {
  return values.map((value) => mapping[value] || value)
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
        // Map UI labels to the exact CMS field values
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
          color_filter: selectedColors.length > 0 ? selectedColors : undefined,
          energy_properties: energyFilter.length > 0 ? energyFilter : undefined,
          zodiac_signs: zodiacFilter.length > 0 ? zodiacFilter : undefined,
          element_type: elementFilter.length > 0 ? elementFilter : undefined,
        })

        setCrystals(result.crystals)
        setTotalPages(result.totalPages)
        setCurrentPage((prev) => (prev === result.currentPage ? prev : result.currentPage))
      } catch (err) {
        console.error('Error fetching crystals:', err)
        setError(
          locale === 'th' ? 'ไม่สามารถโหลดรายการหินได้' : 'Failed to load crystals',
        )
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
          backgroundImage={content.crystalPage.hero.backgroundImage}
          backgroundImageMobile={content.crystalPage.hero.backgroundImageMobile}
          title={t('hero.title')}
          subtitle={t('hero.subtitle')}
          centered
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
                    <p className="text-gray-400 text-lg mt-4">
                      {locale === 'th' ? 'กำลังโหลดรายการหิน...' : 'Loading crystals...'}
                    </p>
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
