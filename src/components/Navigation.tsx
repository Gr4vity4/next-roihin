'use client'

import { cn } from '@/lib/utils'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const navItems = [
  { name: 'หน้าแรก', href: '/' },
  { name: 'เกี่ยวกับร้อยหิน', href: '#about' },
  { name: 'งานออกแบบเฉพาะบุคคล', href: '#design' },
  { name: 'ชาร์ม/สเปเซอร์', href: '#charms' },
  { name: 'รีวิวจริง', href: '#reviews' },
  { name: 'บริการลูกค้า', href: '#service' },
  { name: 'บทความ', href: '#articles' },
]

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-white shadow-lg' : 'bg-transparent',
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative w-24 h-24">
              <Image
                src="https://static.wixstatic.com/media/357c3a_24a0cf97ecf347f7a7382d3fc0b33314~mv2.png/v1/fill/w_157,h_143,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Logo.png"
                alt="Roihin Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-3">
            {navItems.map((item, index) => (
              <React.Fragment key={item.name}>
                {index > 0 && (
                  <span className={cn('text-sm', isScrolled ? 'text-gray-400' : 'text-white/60')}>
                    |
                  </span>
                )}
                <Link
                  href={item.href}
                  className={cn(
                    'font-thai font-medium text-sm transition-colors hover:text-gold',
                    isScrolled ? 'text-gray-700' : 'text-white',
                  )}
                >
                  {item.name}
                </Link>
              </React.Fragment>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              'lg:hidden p-2 transition-all',
              'focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2',
              isScrolled ? 'text-black hover:bg-gray-100' : 'text-white hover:bg-white/10'
            )}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t shadow-lg">
          <div className="container mx-auto px-4 py-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block py-3 font-thai text-black hover:text-gold transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
