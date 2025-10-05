'use client'

import { useState, useMemo } from 'react'
import ChatWidget from '@/components/ChatWidget'
import NavigationWithSuspense from '@/components/NavigationWithSuspense'
import { Footer } from '@/components/sections'
import PersonalizedHeroSection from '@/components/sections/PersonalizedHeroSection'
import CrystalFilterSidebar from '@/components/crystal/CrystalFilterSidebar'
import CrystalGrid, { Crystal } from '@/components/crystal/CrystalGrid'
import Pagination from '@/components/crystal/Pagination'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'

// Mockup crystal data
const MOCKUP_CRYSTALS: Crystal[] = [
  { id: '1', slug: 'apatite-1', nameEn: 'Apatite', nameTh: 'อะพาไทต์', image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=400&h=400&fit=crop' },
  { id: '2', slug: 'labradorite-1', nameEn: 'Labradorite', nameTh: 'ลาบราดอไรต์', image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=400&h=400&fit=crop' },
  { id: '3', slug: 'apatite-2', nameEn: 'Apatite', nameTh: 'อะพาไทต์', image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=400&h=400&fit=crop' },
  { id: '4', slug: 'labradorite-2', nameEn: 'Labradorite', nameTh: 'ลาบราดอไรต์', image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=400&h=400&fit=crop' },
  { id: '5', slug: 'apatite-3', nameEn: 'Apatite', nameTh: 'อะพาไทต์', image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=400&h=400&fit=crop' },
  { id: '6', slug: 'apatite-4', nameEn: 'Apatite', nameTh: 'อะพาไทต์', image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=400&h=400&fit=crop' },
  { id: '7', slug: 'labradorite-3', nameEn: 'Labradorite', nameTh: 'ลาบราดอไรต์', image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=400&h=400&fit=crop' },
  { id: '8', slug: 'apatite-5', nameEn: 'Apatite', nameTh: 'อะพาไทต์', image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=400&h=400&fit=crop' },
  { id: '9', slug: 'labradorite-4', nameEn: 'Labradorite', nameTh: 'ลาบราดอไรต์', image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=400&h=400&fit=crop' },
  { id: '10', slug: 'apatite-6', nameEn: 'Apatite', nameTh: 'อะพาไทต์', image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=400&h=400&fit=crop' },
  { id: '11', slug: 'apatite-7', nameEn: 'Apatite', nameTh: 'อะพาไทต์', image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=400&h=400&fit=crop' },
  { id: '12', slug: 'labradorite-5', nameEn: 'Labradorite', nameTh: 'ลาบราดอไรต์', image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=400&h=400&fit=crop' },
  { id: '13', slug: 'apatite-8', nameEn: 'Apatite', nameTh: 'อะพาไทต์', image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=400&h=400&fit=crop' },
  { id: '14', slug: 'labradorite-6', nameEn: 'Labradorite', nameTh: 'ลาบราดอไรต์', image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=400&h=400&fit=crop' },
  { id: '15', slug: 'apatite-9', nameEn: 'Apatite', nameTh: 'อะพาไทต์', image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=400&h=400&fit=crop' },
  { id: '16', slug: 'apatite-10', nameEn: 'Apatite', nameTh: 'อะพาไทต์', image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=400&h=400&fit=crop' },
  { id: '17', slug: 'labradorite-7', nameEn: 'Labradorite', nameTh: 'ลาบราดอไรต์', image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=400&h=400&fit=crop' },
  { id: '18', slug: 'apatite-11', nameEn: 'Apatite', nameTh: 'อะพาไทต์', image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=400&h=400&fit=crop' },
  { id: '19', slug: 'labradorite-8', nameEn: 'Labradorite', nameTh: 'ลาบราดอไรต์', image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=400&h=400&fit=crop' },
  { id: '20', slug: 'apatite-12', nameEn: 'Apatite', nameTh: 'อะพาไทต์', image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=400&h=400&fit=crop' },
  { id: '21', slug: 'apatite-13', nameEn: 'Apatite', nameTh: 'อะพาไทต์', image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=400&h=400&fit=crop' },
  { id: '22', slug: 'labradorite-9', nameEn: 'Labradorite', nameTh: 'ลาบราดอไรต์', image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=400&h=400&fit=crop' },
  { id: '23', slug: 'apatite-14', nameEn: 'Apatite', nameTh: 'อะพาไทต์', image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=400&h=400&fit=crop' },
  { id: '24', slug: 'labradorite-10', nameEn: 'Labradorite', nameTh: 'ลาบราดอไรต์', image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=400&h=400&fit=crop' },
]

const ITEMS_PER_PAGE = 20

export default function CrystalPage() {
  const params = useParams()
  const locale = params.locale as string
  const t = useTranslations('crystal')

  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedEnergyProperties, setSelectedEnergyProperties] = useState<string[]>([])
  const [selectedZodiacSigns, setSelectedZodiacSigns] = useState<string[]>([])
  const [selectedElements, setSelectedElements] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  // Filter toggle handlers
  const handleColorToggle = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    )
    setCurrentPage(1) // Reset to first page when filter changes
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

  // Apply filters (in a real implementation, this would filter based on actual data)
  const filteredCrystals = useMemo(() => {
    let filtered = [...MOCKUP_CRYSTALS]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (crystal) =>
          crystal.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
          crystal.nameTh.includes(searchQuery)
      )
    }

    // In a real implementation, you would apply color, energy, zodiac, and element filters here

    return filtered
  }, [searchQuery])

  // Pagination
  const totalPages = Math.ceil(filteredCrystals.length / ITEMS_PER_PAGE)
  const paginatedCrystals = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredCrystals.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredCrystals, currentPage])

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
                onSearchChange={setSearchQuery}
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
                  {totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  )}
                </div>

                {/* Crystal Grid */}
                {paginatedCrystals.length > 0 ? (
                  <CrystalGrid crystals={paginatedCrystals} currentLocale={locale} />
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-400 text-lg">{t('noProducts')}</p>
                  </div>
                )}

                {/* Bottom Pagination */}
                {totalPages > 1 && paginatedCrystals.length > 0 && (
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
