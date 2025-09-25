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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Bank, Stone } from '@/lib/types/api-types'
import { ArrowLeft, Check, GripVertical, RefreshCw, Upload } from 'lucide-react'
import { useLocale } from 'next-intl'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

const STONE_CATEGORIES = {
  Stone: 'Stone',
  Charm: 'Charm',
  Pendant: 'Pendant',
} as const

// Circle size mapping based on wrist length (px)
const CIRCLE_SIZE_MAP: Record<string, number> = {
  '14': 213,
  '15': 226,
  '16': 238,
  '17': 251,
  '18': 264,
  '19': 276,
  '20': 289,
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

interface CustomerInfo {
  name: string
  phone: string
  email: string
  address: string
}

export default function BraceletDesigner() {
  const locale = useLocale() as 'en' | 'th'
  const [beadSize, setBeadSize] = useState(6)
  const [wristLength, setWristLength] = useState('14')
  const [beads, setBeads] = useState<Bead[]>([])
  const [lastSelectedBead, setLastSelectedBead] = useState<Stone['acf'] | null>(null)
  const [stoneSettings, setStoneSettings] = useState<Stone[]>([])
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [banks, setBanks] = useState<Bank[]>([])
  const [basePrice, setBasePrice] = useState(0)
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    phone: '',
    email: '',
    address: '',
  })
  const [paymentSlip, setPaymentSlip] = useState<File | null>(null)
  const [paymentSlipPreview, setPaymentSlipPreview] = useState<string>('')
  const [draggedBead, setDraggedBead] = useState<string | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const beadsLayerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const draggedBeadRef = useRef<string | null>(null)

  // Geometry state - adjust radius based on wrist length
  const geometryRef = useRef({
    cx: 260,
    cy: 260,
    R: 190,
  })

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Check on mount
    checkMobile()

    // Check on resize
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Fetch stone settings from API
  useEffect(() => {
    const fetchStoneSettings = async () => {
      try {
        const response = await fetch(`/api/stones?lang=${locale}`)
        if (response.ok) {
          const data = await response.json()
          setStoneSettings(data)
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

  // Fetch banks when dialog opens
  useEffect(() => {
    if (showConfirmDialog && banks.length === 0) {
      const fetchBanks = async () => {
        try {
          const response = await fetch(`/api/banks?lang=${locale}`)
          if (response.ok) {
            const data = await response.json()
            setBanks(data)
          }
        } catch (error) {
          console.error('Error fetching banks:', error)
        }
      }
      fetchBanks()
    }
  }, [showConfirmDialog, banks.length, locale])

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

  const mmToPx = (mm: number) => mm * 4 // Updated to match gallery size from HTML
  const START = Math.PI / 2 // Start at bottom (6 o'clock)

  const computeGeometry = useCallback(() => {
    if (!stageRef.current) return

    const s = stageRef.current.getBoundingClientRect()
    geometryRef.current.cx = s.width / 2
    geometryRef.current.cy = s.height / 2
    // R will be set separately based on wrist length
  }, [])

  useEffect(() => {
    computeGeometry()
    window.addEventListener('resize', computeGeometry)
    return () => window.removeEventListener('resize', computeGeometry)
  }, [computeGeometry])

  // Render all beads using angle-based placement
  const renderBeads = () => {
    if (beads.length === 0) return

    const radius = geometryRef.current.R
    if (radius === 0) return

    let currentAngle = START // Start at bottom (6 o'clock)

    beads.forEach((bead, index) => {
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
  }, [wristLength, beads])

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

  const handleDragStart = (e: React.DragEvent, beadId: string) => {
    setDraggedBead(beadId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedBead(null)
    setDragOverIndex(null)
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()

    if (!draggedBead) return

    const draggedIndex = beads.findIndex((b) => b.id === draggedBead)
    if (draggedIndex === -1 || draggedIndex === dropIndex) {
      setDraggedBead(null)
      setDragOverIndex(null)
      return
    }

    // Reorder beads
    const newBeads = [...beads]
    const [removed] = newBeads.splice(draggedIndex, 1)
    newBeads.splice(dropIndex, 0, removed)

    // Update beads and trigger relayout
    setBeads(newBeads)
    setDraggedBead(null)
    setDragOverIndex(null)

    // Relayout all beads with new order
    setTimeout(() => {
      relayoutBeadsWithNewOrder(newBeads)
    }, 10)
  }

  const relayoutBeadsWithNewOrder = (newBeads: Bead[]) => {
    setBeads(newBeads)
    renderBeads()
  }

  // Update the ref whenever draggedBead changes
  useEffect(() => {
    draggedBeadRef.current = draggedBead
  }, [draggedBead])

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
    el.style.cursor = 'move'
    el.draggable = true
    el.dataset.beadId = beadId

    // Use image if available
    if (stone.stone_image) {
      el.style.backgroundImage = `url(${stone.stone_image})`
      el.style.backgroundSize = 'contain'
      el.style.backgroundPosition = 'center'
      el.style.backgroundRepeat = 'no-repeat'
    }

    // Add drag event listeners to the bead element
    el.addEventListener('dragstart', (e) => {
      e.dataTransfer!.effectAllowed = 'move'
      el.style.opacity = '0.5'
      setDraggedBead(beadId)
    })

    el.addEventListener('dragend', () => {
      el.style.opacity = '1'
      setDraggedBead(null)
      setDragOverIndex(null)
    })

    el.addEventListener('dragover', (e) => {
      e.preventDefault()
      e.dataTransfer!.dropEffect = 'move'
    })

    el.addEventListener('drop', (e) => {
      e.preventDefault()
      e.stopPropagation()

      const dropBeadId = el.dataset.beadId
      const currentDraggedBead = draggedBeadRef.current

      if (!currentDraggedBead || !dropBeadId || currentDraggedBead === dropBeadId) {
        return
      }

      // Get current beads state
      setBeads((currentBeads) => {
        const draggedIndex = currentBeads.findIndex((b) => b.id === currentDraggedBead)
        const dropIndex = currentBeads.findIndex((b) => b.id === dropBeadId)

        if (draggedIndex === -1 || dropIndex === -1) {
          return currentBeads
        }

        // Reorder beads
        const newBeads = [...currentBeads]
        const [removed] = newBeads.splice(draggedIndex, 1)
        newBeads.splice(dropIndex, 0, removed)

        // Relayout all beads with new order
        setTimeout(() => {
          relayoutBeadsWithNewOrder(newBeads)
        }, 10)

        return newBeads
      })

      setDraggedBead(null)
      setDragOverIndex(null)
    })

    // Initial position (will be adjusted by renderBeads)
    el.style.position = 'absolute'

    if (beadsLayerRef.current) {
      beadsLayerRef.current.appendChild(el)
      el.classList.add('show')
    }

    const price = getStonePrice(stone, beadSize)
    const newBead: Bead = {
      id: beadId,
      el,
      r: imageWidth / 2,
      theta: 0, // Will be calculated by renderBeads
      imageUrl: stone.stone_image,
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
    // No need to call renderBeads when array is empty
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPaymentSlip(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPaymentSlipPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCustomerInfoChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo((prev) => ({ ...prev, [field]: value }))
  }

  const handleConfirmOrder = () => {
    // Here you would handle the order submission
    console.log('Order confirmed:', {
      customerInfo,
      beads,
      wristLength,
      totalPrice: calculateTotalPrice(),
      paymentSlip,
    })
    // You can add API call to submit the order here
    setShowConfirmDialog(false)
  }

  const openConfirmDialog = () => {
    if (beads.length === 0) {
      alert('กรุณาเลือกหินอย่างน้อย 1 ชิ้น')
      return
    }
    setShowConfirmDialog(true)
  }

  return (
    <>
      <div className="container mx-auto min-h-24 grid grid-cols-12 gap-4 md:gap-0">
        <div className="col-span-6 md:col-span-4 flex justify-center flex-col">
          <span className="text-[#006039] text-lg">ความยาวรอบข้อมือ</span>
          <Select
            value={wristLength}
            onValueChange={(value) => {
              setWristLength(value)
            }}
          >
            <SelectTrigger className="w-[100px] font-prompt">
              <SelectValue placeholder="Select length" />
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
          <span className="text-[#006039] text-lg">ขนาดหิน</span>
          <Select
            value={String(beadSize)}
            onValueChange={(value) => {
              setBeadSize(Number(value))
            }}
          >
            <SelectTrigger className="w-[100px] font-prompt">
              <SelectValue placeholder="Select size" />
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
          <span className="text-[#006039] text-lg">ราคารวม</span>
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
        .bead-list-item {
          cursor: move;
          transition: opacity 0.2s, transform 0.2s;
        }
        .bead-list-item.dragging {
          opacity: 0.5;
        }
        .bead-list-item.drag-over {
          transform: translateY(2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
      `}</style>

      <div className="container mx-auto">
        <div className="flex items-center justify-center flex-col gap-4">
          {/* Stage */}
          <section
            ref={stageRef}
            className="relative w-[520px] h-[320px] md:h-[360px] max-w-[90vw] aspect-square overflow-hidden"
          >
            <div className="absolute inset-0 grid place-items-center">
              <div
                ref={ringRef}
                className="absolute w-[380px] h-[380px] rounded-full border-[4px] border-black left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-[350ms] ease-in-out"
              />
            </div>
            <div ref={beadsLayerRef} className="absolute inset-0 z-[3]" aria-hidden="true" />
          </section>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              onClick={undoBead}
            >
              ย้อนกลับ
            </Button>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Check className="w-4 h-4" />}
              onClick={openConfirmDialog}
            >
              ยืนยันแบบ
            </Button>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<RefreshCw className="w-4 h-4" />}
              onClick={clearBeads}
            >
              เริ่มใหม่
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-12 w-full mt-10 mb-20 gap-8">
          <div className="col-span-12 md:col-span-6">
            <Tabs defaultValue="Stone" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="Stone">หิน</TabsTrigger>
                <TabsTrigger value="Charm">ชาร์ม</TabsTrigger>
                <TabsTrigger value="Pendant">ตัวคั่น/จี้</TabsTrigger>
              </TabsList>

              {loading ? (
                <div className="mt-6 text-center">Loading stones...</div>
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

                          return (
                            <div key={stoneInfo.title} className="relative group">
                              <button
                                className="w-11 h-11 transition-transform overflow-hidden cursor-pointer active:scale-95"
                                style={{
                                  backgroundImage: `url(${stoneInfo.stone_image})`,
                                  backgroundSize: 'contain',
                                  backgroundPosition: 'center',
                                  backgroundRepeat: 'no-repeat',
                                }}
                                title={`${stoneInfo.title} - ฿${price}`}
                                onClick={() => addBead(stoneInfo)}
                                aria-label={`Add ${stoneInfo.title} - ฿${price}`}
                              />
                              {/* Price tooltip */}
                              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
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
                  <div className="relative w-24 h-24 bg-transparent">
                    {lastSelectedBead.preview_image ? (
                      <Image
                        src={lastSelectedBead.preview_image || '/images/logo.avif'}
                        alt={lastSelectedBead.title}
                        width={96}
                        height={96}
                      />
                    ) : (
                      <></>
                    )}
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-gray-200 flex items-center justify-center text-gray-400">
                    <span className="text-sm text-center">No bead selected</span>
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
                            <span className="font-semibold text-gray-600">ธาตุพลังงาน:</span>
                            <span className="text-gray-600">
                              {lastSelectedBead.story.energy_element}
                            </span>
                          </div>
                        )}
                        {lastSelectedBead.story.connected_chakras && (
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-600">จักระ:</span>
                            <span className="text-gray-600">
                              {lastSelectedBead.story.connected_chakras}
                            </span>
                          </div>
                        )}
                        {lastSelectedBead.story.ascendant && (
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-600">ลัคนา:</span>
                            <span className="text-gray-600">
                              {lastSelectedBead.story.ascendant}
                            </span>
                          </div>
                        )}
                        {lastSelectedBead.story.star_relations && (
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-600">ดาวประจำ:</span>
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
                    <span className="text-lg">เลือกหินมงคลเพื่อดูรายละเอียด</span>
                    <span className="text-sm mt-2">Select a bead to see details</span>
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
            <DialogTitle>ยืนยันการสั่งซื้อ</DialogTitle>
            <DialogDescription>กรุณาตรวจสอบรายละเอียดและกรอกข้อมูลการติดต่อ</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Order Summary */}
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">รายละเอียดสร้อยข้อมือ</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span>ความยาวรอบข้อมือ:</span>
                  <span className="font-medium">{wristLength} cm</span>
                </div>
                <div className="flex justify-between">
                  <span>ขนาดหิน:</span>
                  <span className="font-medium">{beadSize} mm</span>
                </div>
                <div className="flex justify-between">
                  <span>จำนวนหิน:</span>
                  <span className="font-medium">{beads.length} ชิ้น</span>
                </div>
                <div className="border-t pt-2">
                  <div className="font-semibold mb-2">หินที่เลือก: (ลากเพื่อจัดเรียงใหม่)</div>
                  <div className="space-y-2">
                    {beads.map((bead, index) => (
                      <div
                        key={bead.id}
                        className={`bead-list-item flex items-center gap-3 p-2 bg-white rounded-lg ${
                          draggedBead === bead.id ? 'dragging' : ''
                        } ${dragOverIndex === index ? 'drag-over' : ''}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, bead.id)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragEnd={handleDragEnd}
                        onDrop={(e) => handleDrop(e, index)}
                      >
                        <div className="flex items-center justify-center w-6 h-6 text-gray-400">
                          <GripVertical className="w-4 h-4" />
                        </div>
                        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                          {bead.imageUrl && (
                            <Image
                              src={bead.imageUrl}
                              alt={bead.stoneSetting?.title || 'Bead'}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 text-sm">
                          <div className="font-medium">{bead.stoneSetting?.title || 'Unknown'}</div>
                          <div className="text-xs text-gray-500">{bead.size} mm</div>
                        </div>
                        <div className="text-right text-sm">
                          <div className="text-xs text-gray-600 font-prompt">฿{bead.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <div className="text-sm text-gray-600 mb-2">สรุปจำนวนหิน:</div>
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
                        <div
                          key={key}
                          className="flex items-center justify-between text-xs text-gray-600 py-1"
                        >
                          <span>
                            {group.stoneSetting?.title || 'Unknown'} ({group.size}mm)
                          </span>
                          <span className="font-prompt">
                            x{group.count} = ฿{group.totalPrice}
                          </span>
                        </div>
                      ))
                    })()}
                  </div>
                </div>
                {basePrice > 0 && (
                  <div className="flex justify-between pt-2 text-sm">
                    <span>ค่าดีไซน์สร้อยข้อมือ:</span>
                    <span className="font-prompt">฿{basePrice}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>ราคาหิน:</span>
                  <span className="font-prompt">
                    ฿{beads.reduce((total, bead) => total + bead.price, 0)}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-semibold">ราคารวมทั้งหมด:</span>
                  <span className="font-prompt font-bold text-lg text-green-600">
                    ฿{calculateTotalPrice()}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Information Form */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">ข้อมูลการติดต่อ</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">ชื่อ-นามสกุล *</Label>
                  <Input
                    id="name"
                    value={customerInfo.name}
                    onChange={(e) => handleCustomerInfoChange('name', e.target.value)}
                    placeholder="กรอกชื่อ-นามสกุล"
                    required
                    autoFocus={false}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">เบอร์โทรศัพท์ *</Label>
                  <Input
                    id="phone"
                    value={customerInfo.phone}
                    onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
                    placeholder="กรอกเบอร์โทรศัพท์"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">อีเมล</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
                    placeholder="กรอกอีเมล"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">ที่อยู่จัดส่ง *</Label>
                  <Input
                    id="address"
                    value={customerInfo.address}
                    onChange={(e) => handleCustomerInfoChange('address', e.target.value)}
                    placeholder="กรอกที่อยู่จัดส่ง"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Bank Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">ข้อมูลการชำระเงิน</h3>
              {banks.length > 0 ? (
                <div className="space-y-3">
                  {banks.map((bank, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-start gap-4">
                        {bank.acf.bank_image && (
                          <div className="w-16 h-16 flex-shrink-0">
                            <Image
                              src={bank.acf.bank_image}
                              alt={bank.acf.bank_name}
                              width={64}
                              height={64}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        )}
                        <div className="flex-1 space-y-1">
                          <div className="font-medium">{bank.acf.bank_name}</div>
                          <div className="text-sm text-gray-600">
                            สาขา: {bank.acf.bank_branch_name}
                          </div>
                          <div className="text-sm text-gray-600">
                            ชื่อบัญชี: {bank.acf.bank_account_name}
                          </div>
                          <div className="text-sm font-medium">
                            เลขบัญชี: {bank.acf.bank_account_number}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500">กำลังโหลดข้อมูลธนาคาร...</div>
              )}
            </div>

            {/* Payment Slip Upload */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">แนบสลิปการโอนเงิน</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                {paymentSlipPreview ? (
                  <div className="space-y-4">
                    <div className="relative w-full max-w-xs mx-auto">
                      <Image
                        src={paymentSlipPreview}
                        alt="Payment slip"
                        width={300}
                        height={400}
                        className="w-full h-auto rounded-lg"
                      />
                    </div>
                    <div className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setPaymentSlip(null)
                          setPaymentSlipPreview('')
                          if (fileInputRef.current) {
                            fileInputRef.current.value = ''
                          }
                        }}
                      >
                        เปลี่ยนรูป
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-2">คลิกเพื่อเลือกไฟล์หรือลากไฟล์มาวางที่นี่</p>
                    <p className="text-xs text-gray-500">
                      รองรับไฟล์ JPG, PNG, PDF (ขนาดไม่เกิน 5MB)
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      id="payment-slip"
                    />
                    <Label
                      htmlFor="payment-slip"
                      className="inline-block mt-4 px-4 py-2 bg-gray-900 text-white rounded-md cursor-pointer hover:bg-gray-800"
                    >
                      เลือกไฟล์
                    </Label>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setShowConfirmDialog(false)}>
              ยกเลิก
            </Button>
            <Button
              onClick={handleConfirmOrder}
              disabled={!customerInfo.name || !customerInfo.phone || !customerInfo.address}
            >
              ยืนยันการสั่งซื้อ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
