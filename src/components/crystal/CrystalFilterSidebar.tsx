'use client'

import { useTranslations } from 'next-intl'
import { Search } from 'lucide-react'

interface CrystalFilterSidebarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedColors: string[]
  onColorToggle: (color: string) => void
  selectedEnergyProperties: string[]
  onEnergyPropertyToggle: (property: string) => void
  selectedZodiacSigns: string[]
  onZodiacSignToggle: (sign: string) => void
  selectedElements: string[]
  onElementToggle: (element: string) => void
}

const COLORS = [
  { name: 'purple', bgClass: 'bg-purple-600' },
  { name: 'blue', bgClass: 'bg-blue-600' },
  { name: 'teal', bgClass: 'bg-teal-500' },
  { name: 'green', bgClass: 'bg-green-600' },
  { name: 'yellow', bgClass: 'bg-yellow-400' },
  { name: 'orange', bgClass: 'bg-orange-500' },
  { name: 'red', bgClass: 'bg-red-600' },
  { name: 'light-blue', bgClass: 'bg-sky-400' },
  { name: 'pink', bgClass: 'bg-pink-400' },
  { name: 'black', bgClass: 'bg-black border border-gray-600' },
  { name: 'white', bgClass: 'bg-white border border-gray-400' },
  { name: 'beige', bgClass: 'bg-amber-200' },
]

export default function CrystalFilterSidebar({
  searchQuery,
  onSearchChange,
  selectedColors,
  onColorToggle,
  selectedEnergyProperties,
  onEnergyPropertyToggle,
  selectedZodiacSigns,
  onZodiacSignToggle,
  selectedElements,
  onElementToggle,
}: CrystalFilterSidebarProps) {
  const t = useTranslations('crystal.filters')

  const energyProperties = t.raw('energyProperties') as string[]
  const zodiacSigns = t.raw('zodiacSigns') as string[]
  const elements = t.raw('elements') as string[]

  return (
    <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
      {/* Search */}
      <div>
        <h3 className="text-white text-sm font-medium mb-3">{t('search')}</h3>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full bg-white text-black px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Color Filters */}
      <div>
        <h3 className="text-white text-sm font-medium mb-3">{t('colorTitle')}</h3>
        <div className="grid grid-cols-6 gap-2">
          {COLORS.map((color) => (
            <button
              key={color.name}
              onClick={() => onColorToggle(color.name)}
              className={`w-8 h-8 rounded-full ${color.bgClass} transition-all ${
                selectedColors.includes(color.name)
                  ? 'ring-2 ring-gold-500 ring-offset-2 ring-offset-black scale-110'
                  : 'hover:scale-105'
              }`}
              aria-label={color.name}
            />
          ))}
        </div>
      </div>

      {/* Energy Properties */}
      <div>
        <h3 className="text-white text-sm font-medium mb-3">{t('energyTitle')}</h3>
        <div className="space-y-2">
          {energyProperties.map((property, index) => (
            <label key={index} className="flex items-start gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedEnergyProperties.includes(property)}
                onChange={() => onEnergyPropertyToggle(property)}
                className="mt-0.5 w-4 h-4 rounded border-gray-600 bg-transparent text-gold-500 focus:ring-gold-500 focus:ring-offset-black cursor-pointer"
              />
              <span className="text-white text-xs leading-tight group-hover:text-gold-500 transition-colors">
                {property}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Zodiac Signs */}
      <div>
        <h3 className="text-white text-sm font-medium mb-3">{t('zodiacTitle')}</h3>
        <div className="space-y-2">
          {zodiacSigns.map((sign, index) => (
            <label key={index} className="flex items-start gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedZodiacSigns.includes(sign)}
                onChange={() => onZodiacSignToggle(sign)}
                className="mt-0.5 w-4 h-4 rounded border-gray-600 bg-transparent text-gold-500 focus:ring-gold-500 focus:ring-offset-black cursor-pointer"
              />
              <span className="text-white text-xs leading-tight group-hover:text-gold-500 transition-colors">
                {sign}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Elements */}
      <div>
        <h3 className="text-white text-sm font-medium mb-3">{t('elementTitle')}</h3>
        <div className="space-y-2">
          {elements.map((element, index) => (
            <label key={index} className="flex items-start gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedElements.includes(element)}
                onChange={() => onElementToggle(element)}
                className="mt-0.5 w-4 h-4 rounded border-gray-600 bg-transparent text-gold-500 focus:ring-gold-500 focus:ring-offset-black cursor-pointer"
              />
              <span className="text-white text-xs leading-tight group-hover:text-gold-500 transition-colors">
                {element}
              </span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  )
}
