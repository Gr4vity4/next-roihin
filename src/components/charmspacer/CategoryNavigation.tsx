'use client'

import { useEffect, useState } from 'react'

interface CategoryNavigationProps {
  categories: Array<{
    id: string
    name: string
  }>
}

export default function CategoryNavigation({ categories }: CategoryNavigationProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || '')

  useEffect(() => {
    const handleScroll = () => {
      const sections = categories.map((cat) => document.getElementById(cat.id))
      const scrollPosition = window.scrollY + 150

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section && section.offsetTop <= scrollPosition) {
          setActiveCategory(categories[i].id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [categories])

  const handleCategoryClick = (categoryId: string) => {
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
    <div className="sticky top-16 z-40 bg-black border-gray-800 pt-10">
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
