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
import { useLanguage } from '@/contexts/LanguageContext'
import type { Bank, Stone } from '@/lib/types/api-types'
import { ArrowLeft, Check, GripVertical, RefreshCw, Upload } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

const STONE_CATEGORIES = {
  Stone: 'Stone',
  Charm: 'Charm',
  Pendant: 'Pendant',
} as const

type BeadShape = 'circle' | 'square' | 'triangle'

interface Bead {
  id: string
  el: HTMLDivElement | null
  r: number
  theta: number
  backgroundImage?: string
  imageUrl?: string
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
  const { language } = useLanguage()
  const [beadSize, setBeadSize] = useState(6)
  const [wristLength, setWristLength] = useState('15')
  const [beads, setBeads] = useState<Bead[]>([])
  const [lastSelectedBead, setLastSelectedBead] = useState<Stone['acf'] | null>(null)
  const [stoneSettings, setStoneSettings] = useState<Stone[]>([])
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [banks, setBanks] = useState<Bank[]>([])
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
        const response = await fetch(`/api/stones?lang=${language}`)
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
  }, [language])

  // Fetch banks when dialog opens
  useEffect(() => {
    if (showConfirmDialog && banks.length === 0) {
      const fetchBanks = async () => {
        try {
          const response = await fetch(`/api/banks?lang=${language}`)
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
  }, [showConfirmDialog, banks.length, language])

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

  // Calculate total price
  const calculateTotalPrice = () => {
    return beads.reduce((total, bead) => total + bead.price, 0)
  }

  const mmToPx = (mm: number) => mm * 3.4
  const GAP_PX = 1.0
  const EPS = 0.002
  const START = Math.PI / 2

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

  // Calculate total angles including closing gap
  const totalAnglesWithClosing = (Rloc: number) => {
    if (beads.length <= 1) return 0
    let s = 0
    for (let i = 1; i < beads.length; i++) {
      s += deltaTheta(beads[i - 1].r, beads[i].r, Rloc)
    }
    s += deltaTheta(beads[beads.length - 1].r, beads[0].r, Rloc) // closing gap
    return s
  }

  // Calculate minimum radius that can fit all beads
  const minRadiusForCurrentBeads = () => {
    if (beads.length === 0) return 0
    if (beads.length === 1) {
      return beads[0].r + GAP_PX
    }

    // Hard lower bound so asin() is defined for every adjacent pair
    let lower = 0
    for (let i = 1; i < beads.length; i++) {
      lower = Math.max(lower, (beads[i - 1].r + beads[i].r + GAP_PX) / 2)
    }
    lower = Math.max(lower, (beads[beads.length - 1].r + beads[0].r + GAP_PX) / 2)

    let upper = 10000 // big number for binary search
    // if already fits at lower, that's the minimum
    if (totalAnglesWithClosing(lower + 1e-6) <= 2 * Math.PI) return lower + 1e-6

    // Binary search for minimum radius
    for (let iter = 0; iter < 40; iter++) {
      const mid = (lower + upper) / 2
      const used = totalAnglesWithClosing(mid)
      if (used > 2 * Math.PI) {
        lower = mid // too tight -> need larger radius
      } else {
        upper = mid // fits -> try smaller
      }
    }
    return upper
  }

  // Relayout all beads for new radius
  const relayoutForRadius = (Rnew: number) => {
    setBeads((prevBeads) => {
      if (prevBeads.length === 0) return prevBeads

      // Place first bead at START
      let theta = START
      const updatedBeads = [...prevBeads]
      updatedBeads[0].theta = theta

      // Position first bead
      if (updatedBeads[0].el) {
        const element = updatedBeads[0].el!
        element.style.left =
          geometryRef.current.cx + Rnew * Math.cos(theta) - updatedBeads[0].r + 'px'
        element.style.top =
          geometryRef.current.cy + Rnew * Math.sin(theta) - updatedBeads[0].r + 'px'
        // Apply rotation to align tangentially with circle
        const rotationAngle = (theta * 180 / Math.PI) - 90
        element.style.transform = `rotate(${rotationAngle}deg) scale(1)`
        // Ensure dataset is set for drag and drop
        element.dataset.beadId = updatedBeads[0].id
      }

      // Place the rest CCW (left)
      for (let i = 1; i < updatedBeads.length; i++) {
        theta += deltaTheta(updatedBeads[i - 1].r, updatedBeads[i].r, Rnew)
        updatedBeads[i].theta = theta

        if (updatedBeads[i].el) {
          const element = updatedBeads[i].el!
          element.style.left =
            geometryRef.current.cx + Rnew * Math.cos(theta) - updatedBeads[i].r + 'px'
          element.style.top =
            geometryRef.current.cy + Rnew * Math.sin(theta) - updatedBeads[i].r + 'px'
          // Apply rotation to align tangentially with circle
          const rotationAngle = (theta * 180 / Math.PI) - 90
          element.style.transform = `rotate(${rotationAngle}deg) scale(1)`
          // Ensure dataset is set for drag and drop
          element.dataset.beadId = updatedBeads[i].id
        }
      }

      return updatedBeads
    })
  }

  // Update ring size when wrist length or mobile state changes
  useEffect(() => {
    if (!ringRef.current || !stageRef.current) return

    const wristLengthNum = parseInt(wristLength)
    let scale = 1.0

    if (wristLengthNum === 16) {
      // Base scale for 16cm
      scale = 1.0
    } else if (wristLengthNum === 17) {
      // Progressive increase: 0.5% from 16cm base
      scale = 1.0 * 1.005
    } else if (wristLengthNum === 18) {
      // Progressive increase: 1% from 16cm base (2 * 0.5%)
      scale = 1.0 * 1.01
    } else if (wristLengthNum === 19) {
      // Progressive increase: 1.5% from 16cm base (3 * 0.5%)
      scale = 1.0 * 1.015
    } else if (wristLengthNum === 20) {
      // Progressive increase: 2% from 16cm base (4 * 0.5%)
      scale = 1.0 * 1.02
    } else if (wristLengthNum === 15) {
      // Smaller size for 15cm
      scale = 0.95
    }

    // Apply mobile scaling (1.5 times smaller)
    if (isMobile) {
      scale = scale / 1.5
    }

    // Desktop: decrease default radius by 20% (0.8 times)
    const baseSize = isMobile ? 380 : 380 * 0.8
    const newSize = baseSize * scale

    // Check minimum radius needed for current beads
    const minR = minRadiusForCurrentBeads()
    const targetRadius = Math.max(newSize / 2, minR)
    const actualSize = targetRadius * 2

    // If requested size is too small for beads, use minimum size and nudge
    if (newSize / 2 < minR) {
      nudgeFull()
    }

    ringRef.current.style.width = `${actualSize}px`
    ringRef.current.style.height = `${actualSize}px`

    // Update geometry with new radius
    geometryRef.current.R = targetRadius

    // Relayout beads with smooth transition
    relayoutForRadius(targetRadius)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wristLength, isMobile])

  const clamp01m = (x: number) => Math.min(0.999999, Math.max(0, x))

  const deltaTheta = (rA: number, rB: number, Rloc = geometryRef.current.R) => {
    const ratio = clamp01m((rA + rB + GAP_PX) / (2 * Rloc))
    return 2 * Math.asin(ratio)
  }

  const getThetaNext = () => {
    if (beads.length === 0) return START
    return beads[beads.length - 1].theta
  }

  const getLastRadius = () => {
    if (beads.length === 0) return 0
    return beads[beads.length - 1].r
  }

  const remainingArc = () => {
    const thetaNext = getThetaNext()
    return START + 2 * Math.PI - thetaNext
  }

  const canPlaceWithRadius = (rNext: number) => {
    if (beads.length === 0) return true
    const lastRadius = getLastRadius()
    const needBetweenPrevAndNext = deltaTheta(lastRadius, rNext)
    const rFirst = beads[0].r
    const needNextToFirst = deltaTheta(rNext, rFirst)
    return remainingArc() >= needBetweenPrevAndNext + needNextToFirst - EPS
  }

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
    if (newBeads.length === 0) return

    const R = geometryRef.current.R
    let theta = START

    // Update first bead position
    const firstBeadEl = newBeads[0].el
    if (firstBeadEl) {
      newBeads[0].theta = theta
      firstBeadEl.style.left = geometryRef.current.cx + R * Math.cos(theta) - newBeads[0].r + 'px'
      firstBeadEl.style.top = geometryRef.current.cy + R * Math.sin(theta) - newBeads[0].r + 'px'
      // Apply rotation to align tangentially with circle
      const rotationAngle = (theta * 180 / Math.PI) - 90
      firstBeadEl.style.transform = `rotate(${rotationAngle}deg) scale(1)`

      // Update dataset for drag and drop
      firstBeadEl.dataset.beadId = newBeads[0].id
    }

    // Update remaining beads
    for (let i = 1; i < newBeads.length; i++) {
      theta += deltaTheta(newBeads[i - 1].r, newBeads[i].r, R)
      const beadEl = newBeads[i].el
      if (beadEl) {
        newBeads[i].theta = theta
        beadEl.style.left = geometryRef.current.cx + R * Math.cos(theta) - newBeads[i].r + 'px'
        beadEl.style.top = geometryRef.current.cy + R * Math.sin(theta) - newBeads[i].r + 'px'
        // Apply rotation to align tangentially with circle
        const rotationAngle = (theta * 180 / Math.PI) - 90
        beadEl.style.transform = `rotate(${rotationAngle}deg) scale(1)`

        // Update dataset for drag and drop
        beadEl.dataset.beadId = newBeads[i].id
      }
    }
  }

  // Update the ref whenever draggedBead changes
  useEffect(() => {
    draggedBeadRef.current = draggedBead
  }, [draggedBead])

  const addBead = (stone: Stone['acf']) => {
    const d = mmToPx(beadSize)
    const r = d / 2

    if (!canPlaceWithRadius(r)) {
      nudgeFull()
      return
    }

    // Track the last selected bead
    setLastSelectedBead(stone)

    const lastRadius = getLastRadius()
    const thetaNext = getThetaNext()
    const dTheta = beads.length === 0 ? 0 : deltaTheta(lastRadius, r)
    const theta = beads.length === 0 ? START : thetaNext + dTheta

    // Always use circle shape for all categories
    const shape: BeadShape = 'circle'

    const beadId = Date.now().toString()
    const el = document.createElement('div')
    el.className = 'bead'
    el.style.width = d + 'px'
    el.style.height = d + 'px'
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

    // Check if radius needs to be increased after adding this bead
    const tempBeads = [
      ...beads,
      {
        id: Date.now().toString(),
        el: null,
        r,
        theta,
        shape,
        stoneSetting: stone,
        price: getStonePrice(stone, beadSize),
        imageUrl: stone.stone_image,
        size: beadSize, // Store the actual size when bead was added
      },
    ]
    const minRAfterAdd = (() => {
      if (tempBeads.length <= 1) return 0
      let lower = 0
      for (let i = 1; i < tempBeads.length; i++) {
        lower = Math.max(lower, (tempBeads[i - 1].r + tempBeads[i].r + GAP_PX) / 2)
      }
      lower = Math.max(lower, (tempBeads[tempBeads.length - 1].r + tempBeads[0].r + GAP_PX) / 2)

      const calcAngles = (Rloc: number) => {
        let s = 0
        for (let i = 1; i < tempBeads.length; i++) {
          s += deltaTheta(tempBeads[i - 1].r, tempBeads[i].r, Rloc)
        }
        s += deltaTheta(tempBeads[tempBeads.length - 1].r, tempBeads[0].r, Rloc)
        return s
      }

      if (calcAngles(lower + 1e-6) <= 2 * Math.PI) return lower + 1e-6

      let upper = 10000
      for (let iter = 0; iter < 40; iter++) {
        const mid = (lower + upper) / 2
        if (calcAngles(mid) > 2 * Math.PI) {
          lower = mid
        } else {
          upper = mid
        }
      }
      return upper
    })()

    // If radius needs to be increased, update ring and geometry
    if (minRAfterAdd > geometryRef.current.R) {
      geometryRef.current.R = minRAfterAdd
      if (ringRef.current) {
        const newDiameter = minRAfterAdd * 2
        ringRef.current.style.width = `${newDiameter}px`
        ringRef.current.style.height = `${newDiameter}px`
      }
    }

    el.style.left = geometryRef.current.cx + geometryRef.current.R * Math.cos(theta) - r + 'px'
    el.style.top = geometryRef.current.cy + geometryRef.current.R * Math.sin(theta) - r + 'px'
    // Apply rotation to align tangentially with circle
    const rotationAngle = (theta * 180 / Math.PI) - 90
    el.style.transform = `rotate(${rotationAngle}deg) scale(0.6)`

    // Display image without border radius to show original shape

    if (beadsLayerRef.current) {
      beadsLayerRef.current.appendChild(el)
      requestAnimationFrame(() => {
        el.classList.add('show')
        // Update transform to include rotation and scale
        el.style.transform = `rotate(${rotationAngle}deg) scale(1)`
      })
    }

    const price = getStonePrice(stone, beadSize)
    const newBead: Bead = {
      id: beadId,
      el,
      r,
      theta,
      imageUrl: stone.stone_image,
      shape,
      stoneSetting: stone,
      price,
      size: beadSize, // Store the actual size when bead was added
    }

    setBeads((prev) => {
      const updatedBeads = [...prev, newBead]
      // If radius was increased, reflow all beads
      if (minRAfterAdd > geometryRef.current.R - 1) {
        // Relayout immediately after adding
        setTimeout(() => relayoutForRadius(geometryRef.current.R), 10)
      }
      return updatedBeads
    })
  }

  const undoBead = () => {
    if (beads.length === 0) return

    const lastBead = beads[beads.length - 1]
    if (lastBead.el) {
      lastBead.el.remove()
    }

    setBeads((prev) => prev.slice(0, -1))
  }

  const clearBeads = () => {
    beads.forEach((bead) => {
      if (bead.el) bead.el.remove()
    })
    setBeads([])
    setLastSelectedBead(null)
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
          <Select value={wristLength} onValueChange={setWristLength}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Select length" />
            </SelectTrigger>
            <SelectContent>
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
          <Select value={String(beadSize)} onValueChange={(value) => setBeadSize(Number(value))}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6">6 mm</SelectItem>
              <SelectItem value="8">8 mm</SelectItem>
              <SelectItem value="10">10 mm</SelectItem>
              <SelectItem value="12">12 mm</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* Summary Price */}
        <div className="col-span-12 md:col-span-4 flex justify-center flex-col">
          <span className="text-[#006039] text-lg">ราคารวม</span>
          <span className="font-prompt text-2xl font-bold">฿{calculateTotalPrice()}</span>
        </div>
      </div>

      <style jsx global>{`
        .bead {
          position: absolute;
          transition: top 0.35s ease, left 0.35s ease,
            transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
          transform: scale(0.6);
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
        <div className="flex items-center justify-center flex-col gap-2">
          {/* Stage */}
          <section
            ref={stageRef}
            className="relative w-[520px] h-[320px] max-w-[90vw] aspect-square overflow-hidden"
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
                                className="w-11 h-11 cursor-pointer active:scale-95 transition-transform overflow-hidden"
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
              <div className="col-span-full md:col-span-3 flex items-center justify-center">
                {lastSelectedBead ? (
                  <div className="relative w-24 h-24">
                    <Image
                      src={lastSelectedBead.stone_image}
                      alt={lastSelectedBead.title}
                      width={96}
                      height={96}
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-gray-200 flex items-center justify-center text-gray-400">
                    <span className="text-sm text-center">No bead selected</span>
                  </div>
                )}
              </div>
              {/* preview bead detail */}
              <div className="col-span-full md:col-span-9 flex flex-col gap-2">
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
                    <div className="text-gray-700 text-sm">{lastSelectedBead.description}</div>
                    {/* stone story */}
                    {lastSelectedBead.story && (
                      <div className="grid grid-cols-2 gap-2 text-xs">
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
                <div className="flex justify-between border-t pt-2">
                  <span className="font-semibold">ราคารวม:</span>
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
