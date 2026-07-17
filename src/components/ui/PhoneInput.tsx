'use client'

import { ChevronDown, Search } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { countries, getCountryByCode, type Country } from '@/lib/data/countries'

interface PhoneInputProps {
  /** ISO 3166-1 alpha-2 code of the selected country, e.g. 'th' */
  country: string
  phone: string
  onCountryChange: (code: string) => void
  onPhoneChange: (phone: string) => void
  /** id for the tel input so an external <label htmlFor> can target it */
  id?: string
  /** 'th' lists countries by their Thai names */
  lang?: string
  hasError?: boolean
  required?: boolean
  disabled?: boolean
  placeholder?: string
  searchPlaceholder?: string
  noResultsText?: string
}

// Diacritic-insensitive: lets "cote"/"sao tome"/"turkiye" match the accented names.
const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/’/g, "'")

function Flag({ country }: { country: Country }) {
  return (
    <Image
      src={`https://flagcdn.com/w40/${country.code}.png`}
      alt=""
      width={20}
      height={15}
      className="h-[15px] w-5 shrink-0 object-contain"
      unoptimized
    />
  )
}

export default function PhoneInput({
  country,
  phone,
  onCountryChange,
  onPhoneChange,
  id,
  lang,
  hasError = false,
  required = false,
  disabled = false,
  placeholder,
  searchPlaceholder,
  noResultsText,
}: PhoneInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const phoneInputRef = useRef<HTMLInputElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const justOpenedRef = useRef(false)
  const baseId = useId()
  const listboxId = `${baseId}-listbox`

  const isThai = lang === 'th'
  const searchText = searchPlaceholder ?? (isThai ? 'ค้นหาประเทศหรือรหัส' : 'Search country or code')
  const noResults = noResultsText ?? (isThai ? 'ไม่พบประเทศ' : 'No country found')
  const selected = getCountryByCode(country) ?? countries[0]
  const displayName = (c: Country) => (isThai ? c.nameTh : c.name)

  const sorted = useMemo(
    () =>
      isThai ? [...countries].sort((a, b) => a.nameTh.localeCompare(b.nameTh, 'th')) : countries,
    [isThai],
  )

  const filtered = useMemo(() => {
    const query = search.trim()
    if (!query) return sorted
    const nq = normalize(query)
    const digits = nq.replace(/^\+/, '')
    return sorted.filter(
      (c) =>
        normalize(c.name).includes(nq) ||
        c.nameTh.includes(query) ||
        (/^\d+$/.test(digits) && c.dialCode.slice(1).startsWith(digits)),
    )
  }, [search, sorted])

  const openDropdown = () => {
    // search is always cleared on close, so the first render lists everything
    const idx = sorted.findIndex((c) => c.code === selected.code)
    setActiveIndex(idx >= 0 ? idx : 0)
    justOpenedRef.current = true
    setIsOpen(true)
  }

  const closeDropdown = (refocus?: 'trigger' | 'phone') => {
    setIsOpen(false)
    setSearch('')
    if (refocus === 'trigger') triggerRef.current?.focus()
    if (refocus === 'phone') phoneInputRef.current?.focus()
  }

  const selectCountry = (code: string) => {
    onCountryChange(code)
    closeDropdown('phone')
  }

  // Synthetic events can't reliably block document-level listeners in the App
  // Router, so outside-dismiss uses a native pointerdown + containment check.
  useEffect(() => {
    if (!isOpen) return
    const handlePointerDown = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [isOpen])

  useEffect(() => {
    if (isOpen) searchInputRef.current?.focus({ preventScroll: true })
  }, [isOpen])

  // Escape must be intercepted at window capture so it beats Radix Dialog's
  // document-level capture listener — otherwise it dismisses the whole dialog
  // (e.g. the address modal) instead of just this dropdown.
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        setIsOpen(false)
        setSearch('')
        triggerRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown, { capture: true })
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true })
  }, [isOpen])

  useEffect(() => {
    if (disabled && isOpen) {
      setIsOpen(false)
      setSearch('')
    }
  }, [disabled, isOpen])

  // Scroll only the list container — scrollIntoView would also scroll the page.
  useEffect(() => {
    if (!isOpen) return
    const list = listRef.current
    const el = list?.querySelector<HTMLElement>('[data-active="true"]')
    if (!list || !el) return
    if (justOpenedRef.current) {
      justOpenedRef.current = false
      list.scrollTop = el.offsetTop - list.clientHeight / 2 + el.offsetHeight / 2
    } else if (el.offsetTop < list.scrollTop) {
      list.scrollTop = el.offsetTop
    } else if (el.offsetTop + el.offsetHeight > list.scrollTop + list.clientHeight) {
      list.scrollTop = el.offsetTop + el.offsetHeight - list.clientHeight
    }
  }, [isOpen, activeIndex])

  return (
    <div
      ref={containerRef}
      className="relative"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setIsOpen(false)
          setSearch('')
        }
      }}
    >
      <div
        className={`flex w-full items-center rounded-md border bg-white focus-within:ring-2 focus-within:ring-[#006039] focus-within:border-transparent ${
          hasError ? 'border-red-500' : 'border-gray-300'
        } ${disabled ? 'opacity-50' : ''}`}
      >
        <button
          ref={triggerRef}
          type="button"
          onClick={() => (isOpen ? closeDropdown() : openDropdown())}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={`${displayName(selected)} ${selected.dialCode}`}
          className="flex shrink-0 items-center gap-1.5 rounded-l-md py-2 pl-4 pr-2 enabled:hover:bg-gray-50 disabled:cursor-not-allowed"
        >
          <Flag country={selected} />
          <ChevronDown
            className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
          <span className="font-medium text-gray-800">{selected.dialCode}</span>
        </button>
        <input
          ref={phoneInputRef}
          id={id}
          type="tel"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          required={required}
          disabled={disabled}
          aria-invalid={hasError || undefined}
          className="w-full rounded-r-md px-2 py-2 focus:outline-none disabled:cursor-not-allowed"
          placeholder={placeholder}
        />
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-20 mt-1 rounded-md border border-gray-200 bg-white shadow-lg">
          <div className="flex items-center gap-2 border-b border-gray-100 px-3 py-2">
            <Search className="h-4 w-4 shrink-0 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              role="combobox"
              aria-expanded={true}
              aria-controls={listboxId}
              aria-autocomplete="list"
              aria-activedescendant={
                filtered[activeIndex] ? `${baseId}-${filtered[activeIndex].code}` : undefined
              }
              aria-label={searchText}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setActiveIndex(0)
              }}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') {
                  e.preventDefault()
                  setActiveIndex((i) => Math.min(i + 1, filtered.length - 1))
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault()
                  setActiveIndex((i) => Math.max(i - 1, 0))
                } else if (e.key === 'Enter') {
                  // preventDefault also stops the surrounding form's implicit submission
                  e.preventDefault()
                  const c = filtered[activeIndex] ?? filtered[0]
                  if (c) selectCountry(c.code)
                }
              }}
              className="w-full text-sm focus:outline-none"
              placeholder={searchText}
            />
          </div>
          {filtered.length > 0 ? (
            <ul
              ref={listRef}
              id={listboxId}
              role="listbox"
              className="relative max-h-64 overflow-y-auto py-1"
            >
              {filtered.map((c, index) => {
                const isSelected = c.code === selected.code
                const isActive = index === activeIndex
                return (
                  <li
                    key={c.code}
                    id={`${baseId}-${c.code}`}
                    role="option"
                    aria-selected={isSelected}
                    data-active={isActive || undefined}
                    data-selected={isSelected || undefined}
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => selectCountry(c.code)}
                    className={`flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-sm ${
                      isActive ? 'bg-gray-100' : isSelected ? 'bg-[#006039]/10' : ''
                    }`}
                  >
                    <Flag country={c} />
                    <span className="w-14 shrink-0 text-gray-500">{c.dialCode}</span>
                    <span className={`truncate text-gray-800 ${isSelected ? 'font-medium' : ''}`}>
                      {displayName(c)}
                    </span>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="px-4 py-3 text-sm text-gray-500">{noResults}</p>
          )}
        </div>
      )}
    </div>
  )
}
