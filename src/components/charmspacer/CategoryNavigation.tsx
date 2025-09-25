'use client'

import { useState } from 'react'

interface CategoryNavigationProps {
  categories: Array<{
    id: string
    name: string
  }>
}

export default function CategoryNavigation({ categories }: CategoryNavigationProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || '')

  // Removed scroll-based active state updates
  // Active state only changes when clicking on a category

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId)
    const element = document.getElementById(categoryId)
    if (element) {
      const offset = 120
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth',
      })
    }
  }

  return (
    <div className="sticky top-16 z-40 bg-black pt-10">
      <div className="container mx-auto px-4">
        <nav className="flex justify-center items-center h-16 space-x-8 md:space-x-16">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`
                relative py-4 text-sm md:text-xl font-medium transition-colors duration-200
                ${activeCategory === category.id ? 'text-gold-400' : 'text-white hover:text-white'}
              `}
            >
              {category.name}
              {activeCategory === category.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}
