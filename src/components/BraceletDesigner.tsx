'use client'

import Button from '@/components/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCart } from '@/contexts/CartContext'
import type { Stone } from '@/lib/types/api-types'
import {
  generateBraceletId,
  generateBraceletThumbnail,
  generateBraceletTitle,
} from '@/lib/utils/braceletImageGenerator'
import { getLaravelApiEndpoint } from '@/config/api.config'
import { BEAD_PX_PER_MM, CIRCLE_SIZE_MAP, START_ANGLE } from '@/lib/utils/braceletGeometry'
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  ShoppingCart,
  Trash2,
} from 'lucide-react'
import { useLocale } from 'next-intl'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

const STONE_CATEGORIES = {
  Stone: 'Stone',
  Charm: 'Charm',
  Pendant: 'Pendant',
} as const

// Bead action popover dimensions (px) — 3 x 44px buttons + gaps + padding + border
const BEAD_POPOVER_WIDTH = 154
const BEAD_POPOVER_HEIGHT = 58
const BEAD_POPOVER_GAP = 10

const BRACELET_PLACEHOLDER_IMAGE = '/images/bracelet-placeholder.png'
const STONE_FALLBACK_IMAGE = '/images/logo.avif'
const STONE_FALLBACK_BG = '#d1d5db'

const dataUrlToFile = (dataUrl: string, filename: string): File | null => {
  try {
    const [metadata, base64Data] = dataUrl.split(',')
    if (!metadata || !base64Data) {
      return null
    }

    const mimeMatch = metadata.match(/data:(.*?);/)
    if (!mimeMatch) {
      return null
    }

    const mime = mimeMatch[1]
    const binary = atob(base64Data)
    const byteLength = binary.length
    const bytes = new Uint8Array(byteLength)

    for (let i = 0; i < byteLength; i += 1) {
      bytes[i] = binary.charCodeAt(i)
    }

    return new File([bytes], filename, { type: mime })
  } catch (error) {
    console.error('Failed to transform data URL into file', error)
    return null
  }
}

const uploadBraceletDesignImage = async (
  designId: string,
  dataUrl: string,
): Promise<string | null> => {
  if (!dataUrl.startsWith('data:')) {
    return null
  }

  const extensionMatch = dataUrl.match(/^data:image\/([a-zA-Z0-9+]+);/)
  const rawExtension = extensionMatch?.[1]?.toLowerCase() ?? 'png'
  const extension = rawExtension === 'jpeg' ? 'jpg' : rawExtension

  const file = dataUrlToFile(dataUrl, `${designId}.${extension}`)
  if (!file) {
    return null
  }

  const formData = new FormData()
  formData.append('image', file)
  formData.append('design_id', designId)

  try {
    const response = await fetch(getLaravelApiEndpoint('bracelet-designs/upload-image'), {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error')
      console.error('Failed to upload bracelet design image:', response.status, errorText)
      return null
    }

    const payload = await response.json().catch(() => null)
    if (payload && typeof payload.url === 'string') {
      return payload.url
    }

    return null
  } catch (error) {
    console.error('Error uploading bracelet design image:', error)
    return null
  }
}

type BeadShape = 'circle' | 'square' | 'triangle'

interface Bead {
  id: string
  el: HTMLDivElement | null
  r: number
  theta: number
  backgroundImage?: string
  imageUrl?: string
  imageWidth: number
  imageHeight: number
  shape: BeadShape
  stoneSetting?: Stone['acf']
  price: number
  size: number // Size in mm when the bead was added
}

export default function BraceletDesigner() {
  const locale = useLocale() as 'en' | 'th'
  const { addItem } = useCart()
  const [beadSize, setBeadSize] = useState(6)
  const [wristLength, setWristLength] = useState('14')
  const [beads, setBeads] = useState<Bead[]>([])
  const [lastSelectedBead, setLastSelectedBead] = useState<Stone['acf'] | null>(null)
  const [stoneSettings, setStoneSettings] = useState<Stone[]>([])
  const [loading, setLoading] = useState(true)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [basePrice, setBasePrice] = useState(0)
  const [selectedBeadId, setSelectedBeadId] = useState<string | null>(null)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const beadsLayerRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  // Helper function to validate if a string is a valid URL
  const isValidImageUrl = (url: string | undefined | null): boolean => {
    if (!url) return false
    // Check if it's a valid URL or a relative path
    try {
      // Check if it starts with http/https
      if (url.startsWith('http://') || url.startsWith('https://')) {
        new URL(url)
        return true
      }
      // Check if it's a relative path (starts with /)
      if (url.startsWith('/')) {
        return true
      }
      // Check if it's a data URL
      if (url.startsWith('data:')) {
        return true
      }
      // If it's just a CSS class name or invalid string, return false
      if (url.startsWith('jss-') || url.includes('{') || url.includes('}')) {
        return false
      }
      return false
    } catch {
      return false
    }
  }

  // Get valid image URL from stone data
  const getValidStoneImageUrl = (
    stone: Stone['acf'],
    key?: 'stone_image' | 'preview_image',
  ): string | null => {
    if (!key) {
      if (isValidImageUrl(stone.preview_image)) {
        return stone.preview_image
      }
      if (isValidImageUrl(stone.stone_image)) {
        return stone.stone_image
      }
    } else {
      if (key === 'stone_image') {
        if (isValidImageUrl(stone.stone_image)) {
          return stone.stone_image
        }
      } else if (key === 'preview_image') {
        if (isValidImageUrl(stone.preview_image)) {
          return stone.preview_image
        }
      }
    }

    // Log warning for debugging
    console.warn('No valid image URL found for stone:', stone.title, {
      stone_image: stone.stone_image,
      preview_image: stone.preview_image,
    })
    return null
  }

  // Geometry state - adjust radius based on wrist length
  const geometryRef = useRef({
    cx: 260,
    cy: 260,
    R: 190,
  })

  // Fetch stone settings from API
  useEffect(() => {
    const fetchStoneSettings = async () => {
      try {
        const response = await fetch(`/api/stones?lang=${locale}`)
        if (response.ok) {
          const data = await response.json()
          const stones = Array.isArray(data)
            ? data.filter((stone: Stone | null | undefined): stone is Stone =>
                Boolean(stone && typeof stone === 'object' && 'acf' in stone && stone.acf),
              )
            : []

          if (!Array.isArray(data)) {
            console.warn('Unexpected stones payload received from API', data)
          }

          // Log first stone data for debugging
          if (stones.length > 0) {
            console.log('Sample stone data:', {
              title: stones[0].acf?.title,
              stone_image: stones[0].acf?.stone_image,
              preview_image: stones[0].acf?.preview_image,
            })
          }

          setStoneSettings(stones)
        }
      } catch (error) {
        console.error('Error fetching stones:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStoneSettings()
  }, [locale])

  // Fetch base price from API
  useEffect(() => {
    const fetchBasePrice = async () => {
      try {
        const response = await fetch(`/api/bracelet-base-price?lang=${locale}`)
        if (response.ok) {
          const data = await response.json()
          const price = parseInt(data.bracelet_design_base_price || '0', 10)
          setBasePrice(price)
        }
      } catch (error) {
        console.error('Error fetching base price:', error)
        setBasePrice(0) // Fallback to 0 if fetch fails
      }
    }
    fetchBasePrice()
  }, [locale])

  // Get stones by category
  const getStonesByCategory = (category: string) => {
    return stoneSettings.filter((stone) => stone.acf.category === category)
  }

  // Check if stone is available for specific size
  const isStoneAvailableForSize = (stone: Stone['acf'], size: number): boolean => {
    const sizePricing = stone.size
    if (!sizePricing) return false

    const sizeKey = `size_${size}_mm_base_price` as keyof typeof sizePricing
    const price = sizePricing[sizeKey]
    return Boolean(price && price !== '-1')
  }

  // Get price for stone based on size
  const getStonePrice = (stone: Stone['acf'], size: number): number => {
    const sizePricing = stone.size
    if (!sizePricing) return 0

    const sizeKey = `size_${size}_mm_base_price` as keyof typeof sizePricing
    const price = sizePricing[sizeKey]
    return price && price !== '-1' ? parseInt(price, 10) : 0
  }

  // Calculate total angle span for all beads
  const calculateTotalAngleSpan = (items: Bead[]) => {
    const radius = geometryRef.current.R
    if (radius === 0 || !items || items.length === 0) return 0

    return items.reduce((totalAngle, item) => {
      const itemVisualWidth = item.imageWidth
      const chordToRadiusRatio = Math.min(itemVisualWidth / (2 * radius), 1)
      const itemAngleSpan = 2 * Math.asin(chordToRadiusRatio)
      return totalAngle + itemAngleSpan
    }, 0)
  }

  // Calculate total price
  const calculateTotalPrice = () => {
    return basePrice + beads.reduce((total, bead) => total + bead.price, 0)
  }

  const mmToPx = (mm: number) => mm * BEAD_PX_PER_MM
  const START = START_ANGLE // Start at bottom (6 o'clock)

  const computeGeometry = useCallback(() => {
    if (!stageRef.current) return

    const s = stageRef.current.getBoundingClientRect()
    geometryRef.current.cx = s.width / 2
    geometryRef.current.cy = s.height / 2
    // R will be set separately based on wrist length
  }, [])

  useEffect(() => {
    computeGeometry()
  }, [computeGeometry])

  // Render all beads using angle-based placement
  const renderBeads = () => {
    if (beads.length === 0) return

    const radius = geometryRef.current.R
    if (radius === 0) return

    let currentAngle = START // Start at bottom (6 o'clock)

    beads.forEach((bead) => {
      // Calculate angle span based on item's fixed visual width
      const itemVisualWidth = bead.imageWidth
      const chordToRadiusRatio = Math.min(itemVisualWidth / (2 * radius), 1)
      const itemAngleSpan = 2 * Math.asin(chordToRadiusRatio)

      const angle = currentAngle + itemAngleSpan / 2
      bead.theta = angle

      if (bead.el) {
        const x = geometryRef.current.cx + radius * Math.cos(angle)
        const y = geometryRef.current.cy + radius * Math.sin(angle)

        bead.el.style.left = `${x - bead.imageWidth / 2}px`
        bead.el.style.top = `${y - bead.imageHeight / 2}px`

        const rotationAngle = (angle * 180) / Math.PI - 90
        bead.el.style.transform = `rotate(${rotationAngle}deg)`
        bead.el.dataset.beadId = bead.id
      }

      currentAngle += itemAngleSpan
    })
  }

  // Update ring size based on wrist length
  useEffect(() => {
    if (!ringRef.current || !stageRef.current) return

    const size = CIRCLE_SIZE_MAP[wristLength] || 238 // Default to 16cm size

    ringRef.current.style.width = `${size}px`
    ringRef.current.style.height = `${size}px`

    // Update geometry with new radius
    geometryRef.current.R = size / 2

    // Re-render beads with new radius
    renderBeads()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wristLength, beads])

  // Recompute the stage centre and re-lay beads out when the window resizes,
  // so bead positions (and the popover geometry) stay in sync with the stage
  useEffect(() => {
    const handleResize = () => {
      computeGeometry()
      renderBeads()
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [computeGeometry, beads])

  const nudgeFull = () => {
    if (!stageRef.current) return
    stageRef.current.animate(
      [
        { transform: 'translateX(0)' },
        { transform: 'translateX(-6px)' },
        { transform: 'translateX(6px)' },
        { transform: 'translateX(0)' },
      ],
      { duration: 240, easing: 'ease-out' },
    )
  }

  // Reflect selection state on the imperative bead elements
  useEffect(() => {
    beads.forEach((bead) => {
      bead.el?.classList.toggle('selected', bead.id === selectedBeadId)
    })
  }, [selectedBeadId, beads])

  // Dismiss the bead popover on outside tap, Escape, or viewport width change.
  // pointerdown instead of click: iOS Safari doesn't synthesize click events for
  // taps on non-interactive elements. Taps on beads or the popover are exempted
  // by containment checks so their own handlers decide what happens.
  useEffect(() => {
    if (!selectedBeadId) return

    const close = () => setSelectedBeadId(null)
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target instanceof Element ? e.target : null
      if (target && (popoverRef.current?.contains(target) || target.closest('.bead'))) return
      close()
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    // Only close on width changes: mobile browsers fire resize on URL-bar collapse
    let lastWidth = window.innerWidth
    const onResize = () => {
      if (window.innerWidth !== lastWidth) {
        lastWidth = window.innerWidth
        close()
      }
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    window.addEventListener('resize', onResize)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('resize', onResize)
    }
  }, [selectedBeadId])

  // Swap the selected bead with its neighbour; +1 = clockwise along the strand
  const moveSelectedBead = (direction: 1 | -1) => {
    if (!selectedBeadId) return
    setBeads((prev) => {
      const index = prev.findIndex((b) => b.id === selectedBeadId)
      const target = index + direction
      if (index === -1 || target < 0 || target >= prev.length) return prev
      const next = [...prev]
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  const removeSelectedBead = () => {
    if (!selectedBeadId) return
    const bead = beads.find((b) => b.id === selectedBeadId)
    bead?.el?.remove()
    setBeads((prev) => prev.filter((b) => b.id !== selectedBeadId))
    setSelectedBeadId(null)
  }

  // Compute the popover position: radially outside the ring at the bead's angle,
  // clamped horizontally so it stays on screen for small viewports
  const getSelectedBeadPopover = () => {
    if (!selectedBeadId) return null
    const index = beads.findIndex((b) => b.id === selectedBeadId)
    if (index === -1) return null

    const radius = (CIRCLE_SIZE_MAP[wristLength] || 238) / 2
    let currentAngle = START
    let theta = START
    for (const bead of beads) {
      const chordToRadiusRatio = Math.min(bead.imageWidth / (2 * radius), 1)
      const span = 2 * Math.asin(chordToRadiusRatio)
      if (bead.id === selectedBeadId) {
        theta = currentAngle + span / 2
        break
      }
      currentAngle += span
    }

    const { cx, cy } = geometryRef.current
    const ux = Math.cos(theta)
    const uy = Math.sin(theta)
    const stageWidth = cx * 2
    const stageHeight = cy * 2
    // Let the popover spill into the page margins where the viewport allows it,
    // so side beads keep their popover outside the ring on wide screens
    const stageRect = stageRef.current?.getBoundingClientRect()
    const spillLeft = stageRect ? Math.max(8, stageRect.left - 8) : 8
    const spillRight = stageRect ? Math.max(8, window.innerWidth - stageRect.right - 8) : 8
    const clampLeft = (value: number) =>
      Math.min(Math.max(value, -spillLeft), stageWidth - BEAD_POPOVER_WIDTH + spillRight)
    // Allow a 12px overhang past the stage — less than the 16px gap to the
    // Undo/Confirm button row below it, so the popover never covers controls
    const clampTop = (value: number) =>
      Math.min(Math.max(value, -12), stageHeight - BEAD_POPOVER_HEIGHT + 12)

    // Offset that makes the popover's box clear the bead at any angle
    const extent =
      Math.abs(ux) * (BEAD_POPOVER_WIDTH / 2) + Math.abs(uy) * (BEAD_POPOVER_HEIGHT / 2)
    const beadHalf = beads[index].imageWidth / 2
    const outward = radius + beadHalf + BEAD_POPOVER_GAP + extent

    let left = clampLeft(cx + ux * outward - BEAD_POPOVER_WIDTH / 2)
    let top = clampTop(cy + uy * outward - BEAD_POPOVER_HEIGHT / 2)

    // If clamping pushed the popover back onto the bead (large ring on a small
    // stage), move it inside the ring instead: as close to the bead as its box
    // can get with every corner clear of the bead ring, or centred when the
    // ring is too tight for that
    const beadCenterX = cx + radius * ux
    const beadCenterY = cy + radius * uy
    const overlapsBead =
      left < beadCenterX + beadHalf &&
      left + BEAD_POPOVER_WIDTH > beadCenterX - beadHalf &&
      top < beadCenterY + beadHalf &&
      top + BEAD_POPOVER_HEIGHT > beadCenterY - beadHalf
    if (overlapsBead) {
      const innerRadius = radius - beadHalf - BEAD_POPOVER_GAP
      const fit =
        extent * extent +
        innerRadius * innerRadius -
        (BEAD_POPOVER_WIDTH / 2) ** 2 -
        (BEAD_POPOVER_HEIGHT / 2) ** 2
      const inward = fit > 0 ? Math.max(0, Math.sqrt(fit) - extent) : 0
      left = clampLeft(cx + ux * inward - BEAD_POPOVER_WIDTH / 2)
      top = cy + uy * inward - BEAD_POPOVER_HEIGHT / 2
    }

    return { index, left, top }
  }

  const addBead = (stone: Stone['acf']) => {
    // Calculate image dimensions based on bead size (like HTML: size * 4)
    const imageWidth = mmToPx(beadSize)
    const imageHeight = mmToPx(beadSize)

    // Check if adding this bead would exceed the circle
    const currentAngleSpan = calculateTotalAngleSpan(beads)
    const newItemAngleSpan = calculateTotalAngleSpan([
      {
        id: '',
        el: null,
        r: imageWidth / 2,
        theta: 0,
        imageWidth,
        imageHeight,
        shape: 'circle',
        stoneSetting: stone,
        price: 0,
        size: beadSize,
      },
    ])

    if (currentAngleSpan + newItemAngleSpan > 2 * Math.PI) {
      nudgeFull() // Bracelet is full
      return
    }

    // Track the last selected bead
    setLastSelectedBead(stone)

    // Always use circle shape for all categories
    const shape: BeadShape = 'circle'

    const beadId = Date.now().toString()
    const el = document.createElement('div')
    el.className = 'bead'
    el.style.width = imageWidth + 'px'
    el.style.height = imageHeight + 'px'
    el.style.cursor = 'pointer'
    el.style.position = 'relative'
    el.style.overflow = 'hidden'
    el.dataset.beadId = beadId
    el.setAttribute('role', 'button')
    el.tabIndex = 0
    el.setAttribute(
      'aria-label',
      locale === 'th' ? `จัดการหิน ${stone.title}` : `Edit bead ${stone.title}`,
    )

    // Use image element instead of background for better html2canvas compatibility
    const validImageUrl = getValidStoneImageUrl(stone)
    if (validImageUrl) {
      const img = document.createElement('img')
      // Try Next.js image proxy first (same-origin for html2canvas), then fall back to direct URL.
      const encodedUrl = encodeURIComponent(validImageUrl)
      const proxiedUrl = `/_next/image?url=${encodedUrl}&w=${imageWidth * 2}&q=75`
      img.style.width = '100%'
      img.style.height = '100%'
      img.style.objectFit = 'contain'
      img.style.pointerEvents = 'none'
      img.draggable = false
      img.crossOrigin = 'anonymous' // Enable CORS for html2canvas via proxy

      // Add error handler for failed image loads
      let triedDirect = false
      img.onerror = () => {
        if (!triedDirect) {
          triedDirect = true
          img.removeAttribute('crossorigin')
          img.src = validImageUrl
          return
        }
        console.error('Failed to load stone image:', validImageUrl, 'for stone:', stone.title)
        // Create a placeholder div with the logo
        const placeholder = document.createElement('div')
        placeholder.style.width = '100%'
        placeholder.style.height = '100%'
        placeholder.style.display = 'flex'
        placeholder.style.alignItems = 'center'
        placeholder.style.justifyContent = 'center'
        placeholder.style.backgroundColor = STONE_FALLBACK_BG
        placeholder.style.borderRadius = '50%'
        const logo = document.createElement('img')
        logo.src = STONE_FALLBACK_IMAGE
        logo.alt = 'ROIHIN'
        logo.style.width = '70%'
        logo.style.height = '70%'
        logo.style.objectFit = 'contain'
        logo.style.pointerEvents = 'none'
        logo.draggable = false
        placeholder.appendChild(logo)
        el.innerHTML = ''
        el.appendChild(placeholder)
      }

      img.src = proxiedUrl
      el.appendChild(img)
    } else {
      // Create a placeholder if no valid image URL
      const placeholder = document.createElement('div')
      placeholder.style.width = '100%'
      placeholder.style.height = '100%'
      placeholder.style.display = 'flex'
      placeholder.style.alignItems = 'center'
      placeholder.style.justifyContent = 'center'
      placeholder.style.backgroundColor = STONE_FALLBACK_BG
      placeholder.style.borderRadius = '50%'
      const logo = document.createElement('img')
      logo.src = STONE_FALLBACK_IMAGE
      logo.alt = 'ROIHIN'
      logo.style.width = '70%'
      logo.style.height = '70%'
      logo.style.objectFit = 'contain'
      logo.style.pointerEvents = 'none'
      logo.draggable = false
      placeholder.appendChild(logo)
      el.appendChild(placeholder)
    }

    // Tap or click a bead to open its action popover; tap again to dismiss.
    // The outside-tap dismiss listener exempts .bead targets, so this toggle
    // alone decides selection on bead taps.
    const toggleSelection = () => {
      setSelectedBeadId((prev) => (prev === beadId ? null : beadId))
    }

    el.addEventListener('click', toggleSelection)

    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        toggleSelection()
      }
    })

    // Initial position (will be adjusted by renderBeads)
    el.style.position = 'absolute'

    if (beadsLayerRef.current) {
      beadsLayerRef.current.appendChild(el)
      el.classList.add('show')
    }

    const price = getStonePrice(stone, beadSize)
    const imageUrl = getValidStoneImageUrl(stone) ?? ''

    const newBead: Bead = {
      id: beadId,
      el,
      r: imageWidth / 2,
      theta: 0, // Will be calculated by renderBeads
      imageUrl,
      imageWidth,
      imageHeight,
      shape,
      stoneSetting: stone,
      price,
      size: beadSize,
    }

    setBeads((prev) => {
      const updatedBeads = [...prev, newBead]
      // Render all beads with new positions
      setTimeout(() => renderBeads(), 10)
      return updatedBeads
    })
  }

  const undoBead = () => {
    if (beads.length === 0) return

    const lastBead = beads[beads.length - 1]
    if (lastBead.el) {
      lastBead.el.remove()
    }
    if (lastBead.id === selectedBeadId) {
      setSelectedBeadId(null)
    }

    setBeads((prev) => {
      const newBeads = prev.slice(0, -1)
      setTimeout(() => renderBeads(), 10)
      return newBeads
    })
  }

  const clearBeads = () => {
    beads.forEach((bead) => {
      if (bead.el) bead.el.remove()
    })
    setBeads([])
    setLastSelectedBead(null)
    setSelectedBeadId(null)
    // No need to call renderBeads when array is empty
  }

  const handleConfirmOrder = async () => {
    setIsAddingToCart(true)

    try {
      // Ensure all beads are rendered before capturing
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Force a reflow to ensure all styles are applied
      if (stageRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        stageRef.current.offsetHeight
      }

      // Generate unique ID for this bracelet design
      const designId = generateBraceletId()

      // Generate thumbnail image of the bracelet design
      const rawThumbnail = stageRef.current
        ? await generateBraceletThumbnail(stageRef.current)
        : BRACELET_PLACEHOLDER_IMAGE

      let designImageUrl = BRACELET_PLACEHOLDER_IMAGE

      if (typeof rawThumbnail === 'string') {
        if (rawThumbnail.startsWith('data:')) {
          const uploadedUrl = await uploadBraceletDesignImage(designId, rawThumbnail)
          if (uploadedUrl) {
            designImageUrl = uploadedUrl
          } else {
            console.warn('Falling back to placeholder image for bracelet design thumbnail')
          }
        } else if (rawThumbnail.startsWith('http') || rawThumbnail.startsWith('/')) {
          designImageUrl = rawThumbnail
        }
      }

      // Create bracelet design data
      const braceletBeads = beads.map((bead) => ({
        id: bead.id,
        stoneName: bead.stoneSetting?.title || 'Unknown',
        // The validated URL actually shown on the stage, so cart previews
        // reproduce the design exactly
        stoneImage: bead.imageUrl || bead.stoneSetting?.stone_image,
        size: bead.size,
        price: bead.price,
      }))

      // Add to cart
      addItem({
        id: designId,
        slug: 'custom-bracelet',
        title: generateBraceletTitle(beads.length, wristLength, locale),
        price: calculateTotalPrice(),
        image: designImageUrl,
        category: locale === 'th' ? 'สร้อยข้อมือออกแบบเอง' : 'Custom Bracelet',
        isCustomBracelet: true,
        braceletDesign: {
          beads: braceletBeads,
          wristLength,
          beadSize,
          totalPrice: calculateTotalPrice(),
          designId,
          designImageUrl,
        },
      })

      // Close dialog and reset
      setShowConfirmDialog(false)
      clearBeads()

      // Show success message (optional)
      alert(locale === 'th' ? 'เพิ่มลงตะกร้าแล้ว!' : 'Added to cart!')
    } catch (error) {
      console.error('Error adding bracelet to cart:', error)
      alert(
        locale === 'th' ? 'เกิดข้อผิดพลาด กรุณาลองใหม่' : 'An error occurred. Please try again.',
      )
    } finally {
      setIsAddingToCart(false)
    }
  }

  const openConfirmDialog = () => {
    if (beads.length === 0) {
      alert(locale === 'th' ? 'กรุณาเลือกหินอย่างน้อย 1 ชิ้น' : 'Please select at least one stone')
      return
    }
    // Clear selection so the highlight ring is not captured in the design thumbnail
    setSelectedBeadId(null)
    setShowConfirmDialog(true)
  }

  return (
    <>
      <div className="container mx-auto min-h-24 grid grid-cols-12 gap-4 md:gap-0">
        <div className="col-span-6 md:col-span-4 flex justify-center flex-col">
          <span className="text-[#006039] text-lg">
            {locale === 'th' ? 'ความยาวรอบข้อมือ' : 'Wrist Length'}
          </span>
          <Select
            value={wristLength}
            onValueChange={(value) => {
              setWristLength(value)
            }}
          >
            <SelectTrigger className="w-[100px] font-prompt">
              <SelectValue placeholder={locale === 'th' ? 'เลือกรอบข้อมือ' : 'Select length'} />
            </SelectTrigger>
            <SelectContent className="font-prompt">
              <SelectItem value="14">14 cm</SelectItem>
              <SelectItem value="15">15 cm</SelectItem>
              <SelectItem value="16">16 cm</SelectItem>
              <SelectItem value="17">17 cm</SelectItem>
              <SelectItem value="18">18 cm</SelectItem>
              <SelectItem value="19">19 cm</SelectItem>
              <SelectItem value="20">20 cm</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* Bead Size */}
        <div className="col-span-6 md:col-span-4 flex justify-center flex-col">
          <span className="text-[#006039] text-lg">
            {locale === 'th' ? 'ขนาดหิน' : 'Bead Size'}
          </span>
          <Select
            value={String(beadSize)}
            onValueChange={(value) => {
              setBeadSize(Number(value))
            }}
          >
            <SelectTrigger className="w-[100px] font-prompt">
              <SelectValue placeholder={locale === 'th' ? 'เลือกขนาด' : 'Select size'} />
            </SelectTrigger>
            <SelectContent className="font-prompt">
              <SelectItem value="6">6 mm</SelectItem>
              <SelectItem value="8">8 mm</SelectItem>
              <SelectItem value="10">10 mm</SelectItem>
              <SelectItem value="12">12 mm</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* Summary Price and Bead Count */}
        <div className="col-span-12 md:col-span-4 flex justify-center flex-col">
          <span className="text-[#006039] text-lg">
            {locale === 'th' ? 'ราคารวม' : 'Total Price'}
          </span>
          <span className="font-prompt text-2xl font-bold">฿{calculateTotalPrice()}</span>
          {/* {basePrice > 0 && (
            <span className="text-xs text-gray-600">รวมค่าดีไซน์ ฿{basePrice}</span>
          )} */}
        </div>
      </div>

      <style jsx global>{`
        .bead {
          position: absolute;
          transition: top 0.35s ease, left 0.35s ease;
          pointer-events: auto !important;
          transform-origin: center;
        }
        .bead.show {
          /* Transform is now set via JavaScript to include rotation */
        }
        .bead:hover {
          filter: brightness(1.2);
          // box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
          z-index: 10;
        }
        .bead.selected {
          border-radius: 50%;
          box-shadow: 0 0 0 3px #fff, 0 0 0 5px #006039;
          z-index: 15;
        }
        .bead-popover {
          animation: beadPopoverIn 0.15s ease-out;
          transition: top 0.35s ease, left 0.35s ease;
        }
        @keyframes beadPopoverIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>

      <div className="container mx-auto">
        <div className="flex items-center justify-center flex-col gap-4">
          {/* Stage */}
          <div className="relative">
            <section
              ref={stageRef}
              data-stage="true"
              className="relative w-[520px] h-[320px] md:h-[360px] max-w-[90vw] aspect-square overflow-hidden"
            >
              <div className="absolute inset-0 grid place-items-center">
                <div
                  ref={ringRef}
                  className="absolute w-[380px] h-[380px] rounded-full border-[4px] border-black left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-[350ms] ease-in-out"
                />
              </div>
              <div ref={beadsLayerRef} className="absolute inset-0 z-[3]" />
            </section>
            {/* Bead action popover — rendered outside the clipped stage so it can sit outside the ring */}
            {(() => {
              const popover = getSelectedBeadPopover()
              if (!popover) return null
              return (
                <div
                  ref={popoverRef}
                  className="bead-popover absolute z-30 flex items-center gap-1 rounded-full border border-white/40 bg-white/60 backdrop-blur-md p-1.5 shadow-lg"
                  style={{ left: popover.left, top: popover.top }}
                  role="toolbar"
                  aria-label={locale === 'th' ? 'จัดการหิน' : 'Bead actions'}
                >
                  <button
                    type="button"
                    className="flex h-11 w-11 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-100 active:scale-95 disabled:opacity-30 disabled:pointer-events-none touch-manipulation cursor-pointer"
                    onClick={() => moveSelectedBead(1)}
                    disabled={popover.index === beads.length - 1}
                    aria-label={locale === 'th' ? 'ย้ายหินไปทางซ้าย' : 'Move bead left'}
                    title={locale === 'th' ? 'ย้ายไปทางซ้าย' : 'Move left'}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    className="flex h-11 w-11 items-center justify-center rounded-full text-red-500 transition-colors hover:bg-red-50 active:scale-95 touch-manipulation cursor-pointer"
                    onClick={removeSelectedBead}
                    aria-label={locale === 'th' ? 'ลบหิน' : 'Remove bead'}
                    title={locale === 'th' ? 'ลบหิน' : 'Remove bead'}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    className="flex h-11 w-11 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-100 active:scale-95 disabled:opacity-30 disabled:pointer-events-none touch-manipulation cursor-pointer"
                    onClick={() => moveSelectedBead(-1)}
                    disabled={popover.index === 0}
                    aria-label={locale === 'th' ? 'ย้ายหินไปทางขวา' : 'Move bead right'}
                    title={locale === 'th' ? 'ย้ายไปทางขวา' : 'Move right'}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )
            })()}
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              onClick={undoBead}
            >
              {locale === 'th' ? 'ย้อนกลับ' : 'Undo'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Check className="w-4 h-4" />}
              onClick={openConfirmDialog}
            >
              {locale === 'th' ? 'ยืนยันแบบ' : 'Confirm Design'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<RefreshCw className="w-4 h-4" />}
              onClick={clearBeads}
            >
              {locale === 'th' ? 'เริ่มใหม่' : 'Start Over'}
            </Button>
          </div>
          {beads.length > 0 && (
            <p className="text-xs text-gray-500">
              {locale === 'th'
                ? 'แตะหินบนสร้อยเพื่อย้ายหรือลบ'
                : 'Tap a bead on the bracelet to move or remove it'}
            </p>
          )}
        </div>

        <div className="grid grid-cols-12 w-full mt-10 mb-20 gap-8">
          <div className="col-span-12 md:col-span-6">
            <Tabs defaultValue="Stone" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="Stone">{locale === 'th' ? 'หิน' : 'Stone'}</TabsTrigger>
                <TabsTrigger value="Charm">{locale === 'th' ? 'ชาร์ม' : 'Charm'}</TabsTrigger>
                <TabsTrigger value="Pendant">
                  {locale === 'th' ? 'ตัวคั่น/จี้' : 'Spacer/Pendant'}
                </TabsTrigger>
              </TabsList>

              {loading ? (
                <div className="mt-6 text-center">
                  {locale === 'th' ? 'กำลังโหลดข้อมูลหิน...' : 'Loading stones...'}
                </div>
              ) : (
                <>
                  {Object.keys(STONE_CATEGORIES).map((category) => (
                    <TabsContent key={category} value={category} className="mt-6">
                      <div className="grid grid-cols-8 md:grid-cols-6 lg:grid-cols-12 md:gap-2.5 lg:gap-2">
                        {getStonesByCategory(category).map((stone) => {
                          const stoneInfo = stone.acf
                          const isAvailable = isStoneAvailableForSize(stoneInfo, beadSize)
                          const price = getStonePrice(stoneInfo, beadSize)

                          // Hide stone if not available for selected size
                          if (!isAvailable) return null

                          const validImageUrl = getValidStoneImageUrl(stoneInfo)
                          return (
                            <div key={stoneInfo.title} className="relative group">
                              <button
                                className="w-11 h-11 transition-transform overflow-hidden cursor-pointer active:scale-95 rounded-lg relative"
                                title={`${stoneInfo.title} - ฿${price}`}
                                onClick={() => addBead(stoneInfo)}
                                aria-label={
                                  locale === 'th'
                                    ? `เพิ่ม ${stoneInfo.title} - ฿${price}`
                                    : `Add ${stoneInfo.title} - ฿${price}`
                                }
                              >
                                {validImageUrl ? (
                                  <Image
                                    src={validImageUrl}
                                    alt={stoneInfo.title}
                                    width={44}
                                    height={44}
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                      const target = e.currentTarget
                                      target.style.display = 'none'
                                      // Show fallback
                                      const fallback = target.nextElementSibling as HTMLElement
                                      if (fallback) fallback.style.display = 'flex'
                                    }}
                                  />
                                ) : null}
                                <div
                                  className="absolute inset-0 flex items-center justify-center bg-gray-300 rounded-full"
                                  style={{ display: validImageUrl ? 'none' : 'flex' }}
                                >
                                  <Image
                                    src={STONE_FALLBACK_IMAGE}
                                    alt="ROIHIN"
                                    width={28}
                                    height={28}
                                    className="object-contain"
                                  />
                                </div>
                              </button>
                              {/* Price tooltip */}
                              <div className="pointer-events-none absolute -bottom-6 left-1/2 z-20 transform -translate-x-1/2 bg-black text-white text-xs px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                ฿{price}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </TabsContent>
                  ))}
                </>
              )}
            </Tabs>
          </div>
          <div className="col-span-12 md:col-span-6 border-t-1 border-gray-200 pt-10 md:border-t-0 md:pt-0">
            <div className="grid grid-cols-12 gap-4">
              {/* preview single bead image */}
              <div className="col-span-full md:col-span-3 flex justify-center">
                {lastSelectedBead ? (
                  <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center">
                    {(() => {
                      const validImageUrl = getValidStoneImageUrl(lastSelectedBead, 'preview_image')
                      return (
                        <>
                          {validImageUrl ? (
                            <Image
                              src={validImageUrl}
                              alt={lastSelectedBead.title}
                              width={96}
                              height={96}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                const target = e.currentTarget
                                target.style.display = 'none'
                                const fallback = target.nextElementSibling as HTMLElement
                                if (fallback) fallback.style.display = 'flex'
                              }}
                            />
                          ) : null}
                          <div
                            className="absolute inset-0 flex items-center justify-center bg-gray-300 rounded-full"
                            style={{ display: validImageUrl ? 'none' : 'flex' }}
                          >
                            <Image
                              src={STONE_FALLBACK_IMAGE}
                              alt="ROIHIN"
                              width={48}
                              height={48}
                              className="object-contain"
                            />
                          </div>
                        </>
                      )
                    })()}
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-gray-200 flex items-center justify-center text-gray-400">
                    <span className="text-sm text-center">
                      {locale === 'th' ? 'ยังไม่ได้เลือกหิน' : 'No bead selected'}
                    </span>
                  </div>
                )}
              </div>
              {/* preview bead detail */}
              <div className="col-span-full md:col-span-9 flex flex-col gap-4">
                {lastSelectedBead ? (
                  <>
                    {/* bead header */}
                    <div className="flex flex-col gap-1">
                      <span className="text-xl font-semibold">{lastSelectedBead.title}</span>
                      <span className="text-gray-600 text-sm">{lastSelectedBead.sub_title}</span>
                      {/* <span className="text-gray-500 text-xs">
                        {
                          STONE_CATEGORIES[
                            lastSelectedBead.category as keyof typeof STONE_CATEGORIES
                          ]
                        }
                        {' • '}
                        ราคา: ฿{getStonePrice(lastSelectedBead, beadSize)}
                      </span> */}
                    </div>
                    {/* bead description */}
                    <div className="text-gray-700 text-md">{lastSelectedBead.description}</div>
                    {/* stone story */}
                    {lastSelectedBead.story && (
                      <div className="grid grid-cols-2 gap-2 text-md">
                        {lastSelectedBead.story.energy_element && (
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-600">
                              {locale === 'th' ? 'ธาตุพลังงาน:' : 'Energy Element:'}
                            </span>
                            <span className="text-gray-600">
                              {lastSelectedBead.story.energy_element}
                            </span>
                          </div>
                        )}
                        {lastSelectedBead.story.connected_chakras && (
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-600">
                              {locale === 'th' ? 'จักระ:' : 'Chakras:'}
                            </span>
                            <span className="text-gray-600">
                              {lastSelectedBead.story.connected_chakras}
                            </span>
                          </div>
                        )}
                        {lastSelectedBead.story.ascendant && (
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-600">
                              {locale === 'th' ? 'ลัคนา:' : 'Ascendant:'}
                            </span>
                            <span className="text-gray-600">
                              {lastSelectedBead.story.ascendant}
                            </span>
                          </div>
                        )}
                        {lastSelectedBead.story.star_relations && (
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-600">
                              {locale === 'th' ? 'ดาวประจำ:' : 'Ruling Star:'}
                            </span>
                            <span className="text-gray-600">
                              {lastSelectedBead.story.star_relations}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <span className="text-lg">
                      {locale === 'th'
                        ? 'เลือกหินมงคลเพื่อดูรายละเอียด'
                        : 'Select a stone to see its details'}
                    </span>
                    <span className="text-sm mt-2">
                      {locale === 'th' ? 'เลือกหินเพื่อดูรายละเอียด' : 'Select a bead to see details'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {locale === 'th' ? 'ยืนยันการเพิ่มลงตะกร้า' : 'Confirm Add to Cart'}
            </DialogTitle>
            <DialogDescription>
              {locale === 'th'
                ? 'กรุณาตรวจสอบรายละเอียดสร้อยข้อมือของคุณ'
                : 'Please review your bracelet design details'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Order Summary */}
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">
                {locale === 'th' ? 'รายละเอียดสร้อยข้อมือ' : 'Bracelet Details'}
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span>{locale === 'th' ? 'ความยาวรอบข้อมือ:' : 'Wrist Length:'}</span>
                  <span className="font-medium">{wristLength} cm</span>
                </div>
                <div className="flex justify-between">
                  <span>{locale === 'th' ? 'ขนาดหิน:' : 'Bead Size:'}</span>
                  <span className="font-medium">{beadSize} mm</span>
                </div>
                <div className="flex justify-between">
                  <span>{locale === 'th' ? 'จำนวนหิน:' : 'Number of Beads:'}</span>
                  <span className="font-medium">
                    {beads.length} {locale === 'th' ? 'ชิ้น' : 'pcs'}
                  </span>
                </div>
                <div className="border-t pt-2">
                  <div className="text-sm text-gray-600 mb-2">
                    {locale === 'th' ? 'สรุปจำนวนหิน:' : 'Bead Summary:'}
                  </div>
                  {(() => {
                    // Group beads by stone title and size
                    const groupedBeads = beads.reduce((acc, bead) => {
                      const key = `${bead.stoneSetting?.title || 'Unknown'}_${bead.size}mm`
                      if (!acc[key]) {
                        acc[key] = {
                          stoneSetting: bead.stoneSetting,
                          imageUrl: bead.imageUrl,
                          count: 0,
                          price: bead.price,
                          totalPrice: 0,
                          size: bead.size,
                        }
                      }
                      acc[key].count++
                      acc[key].totalPrice += bead.price
                      return acc
                    }, {} as Record<string, { stoneSetting: Stone['acf'] | undefined; imageUrl?: string; count: number; price: number; totalPrice: number; size: number }>)

                    return Object.entries(groupedBeads).map(([key, group]) => (
                      <div key={key} className="flex items-center gap-2 text-xs text-gray-600 py-1">
                        <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 bg-gray-300">
                          {(() => {
                            const stoneImageUrl = group.stoneSetting
                              ? getValidStoneImageUrl(group.stoneSetting)
                              : null
                            if (stoneImageUrl) {
                              return (
                                <Image
                                  src={stoneImageUrl}
                                  alt={group.stoneSetting?.title || 'Stone'}
                                  width={24}
                                  height={24}
                                  className="w-full h-full object-contain"
                                  onError={(e) => {
                                    const target = e.currentTarget
                                    target.style.display = 'none'
                                    const parent = target.parentElement
                                    if (parent) {
                                      const fallback = document.createElement('div')
                                      fallback.className =
                                        'w-full h-full flex items-center justify-center bg-gray-300 rounded-full'
                                      const logo = document.createElement('img')
                                      logo.src = STONE_FALLBACK_IMAGE
                                      logo.alt = 'ROIHIN'
                                      logo.style.width = '70%'
                                      logo.style.height = '70%'
                                      logo.style.objectFit = 'contain'
                                      logo.style.pointerEvents = 'none'
                                      logo.draggable = false
                                      fallback.appendChild(logo)
                                      parent.appendChild(fallback)
                                    }
                                  }}
                                />
                              )
                            }
                            return (
                              <div className="w-full h-full flex items-center justify-center bg-gray-300 rounded-full">
                                <Image
                                  src={STONE_FALLBACK_IMAGE}
                                  alt="ROIHIN"
                                  width={16}
                                  height={16}
                                  className="object-contain"
                                />
                              </div>
                            )
                          })()}
                        </div>
                        <span className="flex-1">
                          {group.stoneSetting?.title || 'Unknown'} ({group.size}mm)
                        </span>
                        <span className="font-prompt">
                          x{group.count} = ฿{group.totalPrice}
                        </span>
                      </div>
                    ))
                  })()}
                </div>
                {basePrice > 0 && (
                  <div className="flex justify-between pt-2 text-sm">
                    <span>
                      {locale === 'th' ? 'ค่าดีไซน์สร้อยข้อมือ:' : 'Bracelet Design Fee:'}
                    </span>
                    <span className="font-prompt">฿{basePrice}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>{locale === 'th' ? 'ราคาหิน:' : 'Beads Price:'}</span>
                  <span className="font-prompt">
                    ฿{beads.reduce((total, bead) => total + bead.price, 0)}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-semibold">
                    {locale === 'th' ? 'ราคารวมทั้งหมด:' : 'Grand Total:'}
                  </span>
                  <span className="font-prompt font-bold text-lg text-green-600">
                    ฿{calculateTotalPrice()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setShowConfirmDialog(false)}>
              {locale === 'th' ? 'ยกเลิก' : 'Cancel'}
            </Button>
            <Button onClick={handleConfirmOrder} disabled={isAddingToCart || beads.length === 0}>
              {isAddingToCart ? (
                <>{locale === 'th' ? 'กำลังเพิ่ม...' : 'Adding...'}</>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {locale === 'th' ? 'เพิ่มลงตะกร้า' : 'Add to Cart'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
