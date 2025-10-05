'use client'

import AuthModal from '@/components/AuthModal'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'
import { ChevronDown, Menu, X } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

interface NavigationProps {
  position?: 'fixed' | 'static'
}

export default function Navigation({ position = 'fixed' }: NavigationProps = {}) {
  const pathname = usePathname()
  const isCustomPage = pathname === '/custom'
  const [isScrolled, setIsScrolled] = useState(isCustomPage)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false)
  const [scrollThreshold, setScrollThreshold] = useState(10)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState<'sign-in' | 'sign-up'>('sign-in')
  const userMenuRef = useRef<HTMLDivElement>(null)
  const languageMenuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const locale = useLocale()
  const { isLoggedIn, user, logout } = useAuth()
  const { itemCount } = useCart()
  const t = useTranslations('navigation')
  const tUser = useTranslations('userMenu')
  const tCommon = useTranslations('common')

  const navItems = useMemo(() => {
    return [
      { name: t('home'), href: '/' },
      { name: t('about'), href: '/about' },
      { name: t('personalized'), href: '/personalized' },
      { name: t('charmspacer'), href: '/charmspacer' },
      { name: t('crystal'), href: '/crystal' },
      { name: t('diy'), href: '/custom' },
      { name: t('testimonial'), href: '/testimonial' },
      { name: t('customerService'), href: '/customer-service' },
      { name: t('blog'), href: '/blog' },
    ]
  }, [t])

  const userMenuItems = useMemo(() => {
    return [
      { name: tUser('dashboard'), href: '/member' },
      { name: tUser('profile'), href: '/member/profile' },
      { name: tUser('orders'), href: '/member/orders' },
      { name: tUser('addresses'), href: '/member/addresses' },
      { name: tUser('wishlist'), href: '/member/wishlist' },
      { name: tUser('settings'), href: '/member/settings' },
    ]
  }, [tUser])

  // Calculate the height of the first section (hero section)
  const calculateScrollThreshold = useCallback(() => {
    const heroSection =
      document.querySelector('main > section:first-of-type') ||
      document.querySelector('[class*="min-h-screen"]') ||
      document.querySelector('main > div:first-child')

    if (heroSection) {
      const rect = heroSection.getBoundingClientRect()
      const heroHeight = rect.height
      const threshold = Math.max(heroHeight - 230, 100)
      setScrollThreshold(threshold)
    }
  }, [])

  useEffect(() => {
    // Skip scroll handling for custom page
    if (isCustomPage) {
      setIsScrolled(true)
      return
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > scrollThreshold)
    }

    const handleResize = () => {
      calculateScrollThreshold()
    }

    calculateScrollThreshold()

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize)

    const handleLoad = () => {
      setTimeout(calculateScrollThreshold, 100)
    }
    window.addEventListener('load', handleLoad)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('load', handleLoad)
    }
  }, [scrollThreshold, calculateScrollThreshold, isCustomPage])

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node)) {
        setIsLanguageMenuOpen(false)
      }
    }

    if (isUserMenuOpen || isLanguageMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isUserMenuOpen, isLanguageMenuOpen])

  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
    router.push('/')
  }

  const openAuthModal = (mode: 'sign-in' | 'sign-up') => {
    setAuthModalMode(mode)
    setAuthModalOpen(true)
    setIsMobileMenuOpen(false)
  }

  const handleLanguageSwitch = (newLocale: 'th' | 'en') => {
    setIsLanguageMenuOpen(false)
    // Use next-intl's router to switch locale
    router.replace(pathname, { locale: newLocale })
  }

  return (
    <nav
      className={cn(
        position === 'fixed' ? 'fixed top-0 left-0 right-0 z-50' : 'static bg-black',
        'transition-all duration-300',
        position === 'fixed' &&
          (isScrolled
            ? 'bg-black shadow-[0_8px_32px_rgba(0,0,0,0.5)] border-b border-white/10'
            : 'bg-transparent'),
      )}
    >
      {/* Desktop Navigation with Video Background */}
      <div
        className={cn(
          'hidden min-[1408px]:block relative transition-all duration-300',
          isScrolled ? 'h-20' : 'h-[230px]',
        )}
      >
        {/* Video Background - always present but fades out when scrolled */}
        <div
          className={cn(
            'absolute inset-0 w-full h-full transition-opacity duration-300',
            isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100',
          )}
        >
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
        <div className="relative z-10 container-fluid mx-auto px-10 h-full">
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
                    className=" font-medium text-sm text-white transition-colors hover:text-gold tracking-widest"
                  >
                    {item.name}
                  </Link>
                ))}

                {/* Cart Icon */}
                <Link
                  href="/checkout"
                  className="relative p-2 text-white hover:text-gold transition-colors"
                >
                  <ShoppingCartIcon className="w-6 h-6" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-white font-prompt text-black text-xs font-bold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center">
                      {itemCount > 99 ? '99+' : itemCount}
                    </span>
                  )}
                </Link>

                {/* Language Switcher */}
                <div className="relative" ref={languageMenuRef}>
                  <button
                    onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                    className="flex items-center space-x-1 px-3 py-1.5 text-white hover:text-gold transition-colors"
                  >
                    <span className="text-sm font-medium tracking-widest">
                      {locale.toUpperCase()}
                    </span>
                    <ChevronDown
                      className={cn(
                        'w-3 h-3 transition-transform',
                        isLanguageMenuOpen && 'rotate-180',
                      )}
                    />
                  </button>

                  {isLanguageMenuOpen && (
                    <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-2xl border border-gray-100 py-1 z-[10000]">
                      <button
                        onClick={() => handleLanguageSwitch('th')}
                        className={cn(
                          'w-full px-4 py-2 text-sm text-left hover:bg-gray-100 flex items-center justify-between',
                          locale === 'th' && 'bg-gray-50 font-semibold',
                        )}
                      >
                        ไทย
                        {locale === 'th' && <span className="text-gold">✓</span>}
                      </button>
                      <button
                        onClick={() => handleLanguageSwitch('en')}
                        className={cn(
                          'w-full px-4 py-2 text-sm text-left hover:bg-gray-100 flex items-center justify-between',
                          locale === 'en' && 'bg-gray-50 font-semibold',
                        )}
                      >
                        English
                        {locale === 'en' && <span className="text-gold">✓</span>}
                      </button>
                    </div>
                  )}
                </div>

                {/* Auth Section */}
                <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-white/20 relative">
                  {isLoggedIn ? (
                    <div className="relative z-[9999]" ref={userMenuRef}>
                      <button
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="flex items-center space-x-2 font-medium text-sm text-white transition-colors hover:text-gold"
                      >
                        <div className="w-8 h-8 bg-[#005635] rounded-full flex items-center justify-center text-white text-xs font-semibold">
                          {user?.name
                            ?.split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()
                            .slice(0, 2) || 'U'}
                        </div>
                        <span className="tracking-widest">{user?.name}</span>
                        <ChevronDown
                          className={cn(
                            'w-4 h-4 transition-transform',
                            isUserMenuOpen && 'rotate-180',
                          )}
                        />
                      </button>

                      {/* Dropdown Menu */}
                      {isUserMenuOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-2xl border border-gray-100 py-2 z-[10000]">
                          <div className="px-4 py-3 border-b border-gray-200">
                            <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                            <p className="text-xs text-gray-500">{user?.email}</p>
                          </div>
                          {userMenuItems.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setIsUserMenuOpen(false)}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              {item.name}
                            </Link>
                          ))}
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-gray-200"
                          >
                            {tUser('signOut')}
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => openAuthModal('sign-in')}
                        className="font-medium text-sm text-white transition-colors hover:text-gold tracking-widest"
                      >
                        {tCommon('signIn')}
                      </button>
                      <span className="text-white/40">|</span>
                      <button
                        onClick={() => openAuthModal('sign-up')}
                        className="font-medium text-sm text-white transition-colors hover:text-gold tracking-widest"
                      >
                        {tCommon('signUp')}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            // Default state - header layout with top actions
            <div className="relative h-full">
              {/* Top Row - Actions (Cart, Language, Auth) */}
              <div className="absolute top-4 right-4 flex items-center space-x-6">
                {/* Cart Icon */}
                <Link
                  href="/checkout"
                  className="relative p-2 text-white hover:text-gold transition-colors"
                >
                  <ShoppingCartIcon className="w-6 h-6" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-white font-prompt text-black text-xs font-bold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center">
                      {itemCount > 99 ? '99+' : itemCount}
                    </span>
                  )}
                </Link>

                {/* Language Switcher */}
                <div className="relative" ref={languageMenuRef}>
                  <button
                    onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                    className="flex items-center space-x-1 px-3 py-1.5 text-white hover:text-gold transition-colors"
                  >
                    <span className="text-sm font-medium tracking-widest">
                      {locale.toUpperCase()}
                    </span>
                    <ChevronDown
                      className={cn(
                        'w-3 h-3 transition-transform',
                        isLanguageMenuOpen && 'rotate-180',
                      )}
                    />
                  </button>

                  {isLanguageMenuOpen && (
                    <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-2xl border border-gray-100 py-1 z-[10000]">
                      <button
                        onClick={() => handleLanguageSwitch('th')}
                        className={cn(
                          'w-full px-4 py-2 text-sm text-left hover:bg-gray-100 flex items-center justify-between',
                          locale === 'th' && 'bg-gray-50 font-semibold',
                        )}
                      >
                        ไทย
                        {locale === 'th' && <span className="text-gold">✓</span>}
                      </button>
                      <button
                        onClick={() => handleLanguageSwitch('en')}
                        className={cn(
                          'w-full px-4 py-2 text-sm text-left hover:bg-gray-100 flex items-center justify-between',
                          locale === 'en' && 'bg-gray-50 font-semibold',
                        )}
                      >
                        English
                        {locale === 'en' && <span className="text-gold">✓</span>}
                      </button>
                    </div>
                  )}
                </div>

                {/* Auth Section */}
                <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-white/20 relative">
                  {isLoggedIn ? (
                    <div className="relative z-[9999]" ref={userMenuRef}>
                      <button
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="flex items-center space-x-2 font-medium text-sm text-white transition-colors hover:text-gold"
                      >
                        <div className="w-8 h-8 bg-[#005635] rounded-full flex items-center justify-center text-white text-xs font-semibold">
                          {user?.name
                            ?.split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()
                            .slice(0, 2) || 'U'}
                        </div>
                        <span className="tracking-widest">{user?.name}</span>
                        <ChevronDown
                          className={cn(
                            'w-4 h-4 transition-transform',
                            isUserMenuOpen && 'rotate-180',
                          )}
                        />
                      </button>

                      {/* Dropdown Menu */}
                      {isUserMenuOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-2xl border border-gray-100 py-2 z-[10000]">
                          <div className="px-4 py-3 border-b border-gray-200">
                            <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                            <p className="text-xs text-gray-500">{user?.email}</p>
                          </div>
                          {userMenuItems.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setIsUserMenuOpen(false)}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              {item.name}
                            </Link>
                          ))}
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-gray-200"
                          >
                            {tUser('signOut')}
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => openAuthModal('sign-in')}
                        className="font-medium text-sm text-white transition-colors hover:text-gold tracking-widest"
                      >
                        {tCommon('signIn')}
                      </button>
                      <span className="text-white/40">|</span>
                      <button
                        onClick={() => openAuthModal('sign-up')}
                        className="font-medium text-sm text-white transition-colors hover:text-gold tracking-widest"
                      >
                        {tCommon('signUp')}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Center Content - Logo and Navigation */}
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
                <div className="flex items-center space-x-8 mt-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="font-medium text-base text-white transition-colors hover:text-gold tracking-wider"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="min-[1408px]:hidden relative bg-black">
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

          {/* Mobile Actions */}
          <div className="flex items-center gap-2">
            {/* Cart Icon */}
            <Link
              href="/checkout"
              className="relative p-2 text-white hover:text-gold transition-colors"
            >
              <ShoppingCartIcon className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white font-prompt text-black text-xs font-bold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
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
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-black border-t border-gray-800 shadow-lg w-full">
            <div className="px-4 py-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block py-3  text-white hover:text-gold transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Language Switcher for Mobile */}
              <div className="border-t border-gray-800 mt-3 pt-3">
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-white">ภาษา / Language</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleLanguageSwitch('th')}
                      className={cn(
                        'px-3 py-1 rounded text-sm',
                        locale === 'th'
                          ? 'bg-gold text-black font-semibold'
                          : 'bg-gray-800 text-white',
                      )}
                    >
                      ไทย
                    </button>
                    <button
                      onClick={() => handleLanguageSwitch('en')}
                      className={cn(
                        'px-3 py-1 rounded text-sm',
                        locale === 'en'
                          ? 'bg-gold text-black font-semibold'
                          : 'bg-gray-800 text-white',
                      )}
                    >
                      EN
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-800 mt-3 pt-3">
                {isLoggedIn ? (
                  <>
                    <div className="flex items-center space-x-3 py-3 mb-2">
                      <div className="w-10 h-10 bg-[#005635] rounded-full flex items-center justify-center text-white font-semibold">
                        {user?.name
                          ?.split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()
                          .slice(0, 2) || 'U'}
                      </div>
                      <div>
                        <p className="text-white font-semibold">{user?.name}</p>
                        <p className="text-gray-400 text-sm">{user?.email}</p>
                      </div>
                    </div>
                    {userMenuItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block py-3 text-white hover:text-gold transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsMobileMenuOpen(false)
                      }}
                      className="block w-full text-left py-3 text-red-500 hover:text-red-400 transition-colors border-t border-gray-800 mt-3"
                    >
                      {tUser('signOut')}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => openAuthModal('sign-in')}
                      className="block w-full text-left py-3 text-white hover:text-gold transition-colors"
                    >
                      {tCommon('signIn')}
                    </button>
                    <button
                      onClick={() => openAuthModal('sign-up')}
                      className="block w-full text-left py-3 text-white hover:text-gold transition-colors"
                    >
                      {tCommon('signUp')}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authModalMode}
        onModeChange={setAuthModalMode}
      />
    </nav>
  )
}
