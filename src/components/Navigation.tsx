'use client'

import { cn } from '@/lib/utils'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const navItems = [
  { name: 'หน้าแรก', href: '/' },
  { name: 'เกี่ยวกับร้อยหิน', href: '#about' },
  { name: 'งานออกแบบเฉพาะบุคคล', href: '#design' },
  { name: 'ชาร์ม/สเปเซอร์', href: '#charms' },
  { name: 'รีวิวจริง', href: '#reviews' },
  { name: 'บริการลูกค้า', href: '/customer-service' },
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
        isScrolled ? 'bg-black shadow-[0_8px_32px_rgba(0,0,0,0.5)]' : 'bg-transparent',
      )}
    >
      {/* Desktop Navigation with Video Background */}
      <div
        className={cn(
          'hidden lg:block relative overflow-hidden transition-all duration-300',
          isScrolled ? 'h-20' : 'h-[230px]',
        )}
      >
        {/* Video Background - always present but fades out when scrolled */}
        <div className={cn(
          "absolute inset-0 w-full h-full transition-opacity duration-300",
          isScrolled ? "opacity-0 pointer-events-none" : "opacity-100"
        )}>
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover object-top"
            ref={(el) => {
              if (el) el.playbackRate = 0.5
            }}
          >
            <source src="/videos/main.mp4" type="video/mp4" />
          </video>
          {/* Dark overlay with blur for better text visibility */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
        </div>

        {/* Navigation Content */}
        <div className="relative z-10 container mx-auto px-4 h-full">
          {isScrolled ? (
            // Scrolled state - horizontal layout
            <div className="flex items-center justify-between h-full">
              <Link href="/" className="flex items-center">
                <div className="relative w-16 h-16">
                  <Image
                    src="/images/logo.avif"
                    alt="Roihin Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </Link>
              <div className="flex items-center space-x-6">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="font-thai font-medium text-sm text-white transition-colors hover:text-gold"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            // Default state - vertical centered layout
            <div className="flex flex-col items-center justify-center h-full">
              {/* Logo */}
              <Link href="/">
                <div className="relative w-32 h-32">
                  <Image
                    src="/images/logo.avif"
                    alt="Roihin Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </Link>

              {/* Menu Items */}
              <div className="flex items-center space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="font-thai font-medium text-base text-white transition-colors hover:text-gold"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <div
          className={cn(
            'flex items-center justify-between h-20 px-4 transition-all duration-300',
            isScrolled ? 'bg-black' : 'bg-black/80',
          )}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative w-20 h-20">
              <Image
                src="/images/logo.avif"
                alt="Roihin Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              'p-2 transition-all cursor-pointer',
              'focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2',
              isScrolled ? 'text-white hover:bg-white/10' : 'text-white hover:bg-white/10',
            )}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="bg-black border-t border-gray-800 shadow-lg">
            <div className="px-4 py-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block py-3 font-thai text-white hover:text-gold transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
