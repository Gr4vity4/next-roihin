'use client'

import Button from '@/components/Button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { STONE_CATEGORIES, type StoneSetting } from '@/lib/types/stone-settings'
import { ArrowLeft, Check, RefreshCw } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

type BeadShape = 'circle' | 'square' | 'triangle'

interface Bead {
  id: string
  el: HTMLDivElement | null
  r: number
  theta: number
  backgroundImage?: string
  imageUrl?: string
  shape: BeadShape
  stoneSetting?: StoneSetting['acf']['stone_information']
  price: number
}

export default function BraceletDesigner() {
  const [beadSize, setBeadSize] = useState(6)
  const [wristLength, setWristLength] = useState('15')
  const [beads, setBeads] = useState<Bead[]>([])
  const [lastSelectedBead, setLastSelectedBead] = useState<
    StoneSetting['acf']['stone_information'] | null
  >(null)
  const [stoneSettings, setStoneSettings] = useState<StoneSetting[]>([])
  const [loading, setLoading] = useState(true)
  const stageRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const beadsLayerRef = useRef<HTMLDivElement>(null)

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
        const response = await fetch('/api/stone-settings')
        if (response.ok) {
          const data = await response.json()
          setStoneSettings(data)
        }
      } catch (error) {
        console.error('Error fetching stone settings:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStoneSettings()
  }, [])

  // Get stones by category
  const getStonesByCategory = (category: string) => {
    return stoneSettings.filter((stone) => stone.acf.stone_information.category === category)
  }

  // Get price for stone based on size
  const getStonePrice = (stone: StoneSetting['acf']['stone_information'], size: number): number => {
    const sizePricing = stone[''] // The API returns an empty string as key for size pricing
    if (!sizePricing) return 0

    const sizeKey = `size_${size}_mm` as keyof typeof sizePricing
    const sizeData = sizePricing[sizeKey]
    return sizeData ? parseInt(sizeData.base_price) : 0
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
    if (!stageRef.current || !ringRef.current) return

    const s = stageRef.current.getBoundingClientRect()
    const rr = ringRef.current.getBoundingClientRect()

    // Adjust radius based on wrist length
    let radiusMultiplier = 1.0
    const wristLengthNum = parseInt(wristLength)
    if (wristLengthNum === 15) {
      radiusMultiplier = 0.67 // Decreased by 1.5 times (1/1.5 = 0.67)
    } else if (wristLengthNum === 16) {
      radiusMultiplier = 0.74 // Progressive increase
    } else if (wristLengthNum === 17) {
      radiusMultiplier = 0.81
    } else if (wristLengthNum === 18) {
      radiusMultiplier = 0.88
    } else if (wristLengthNum === 19) {
      radiusMultiplier = 0.95
    } else if (wristLengthNum === 20) {
      radiusMultiplier = 1.02
    }

    geometryRef.current = {
      cx: s.width / 2,
      cy: s.height / 2,
      R: (rr.width / 2) * radiusMultiplier,
    }
  }, [wristLength])

  useEffect(() => {
    computeGeometry()
    window.addEventListener('resize', computeGeometry)
    return () => window.removeEventListener('resize', computeGeometry)
  }, [computeGeometry])

  // Update ring size when wrist length changes
  useEffect(() => {
    if (!ringRef.current) return

    const wristLengthNum = parseInt(wristLength)
    let scale = 1.0

    if (wristLengthNum === 15) {
      scale = 0.67 // Decreased by 1.5 times (1/1.5 = 0.67)
    } else if (wristLengthNum === 16) {
      scale = 0.74 // Progressive increase
    } else if (wristLengthNum === 17) {
      scale = 0.81
    } else if (wristLengthNum === 18) {
      scale = 0.88
    } else if (wristLengthNum === 19) {
      scale = 0.95
    } else if (wristLengthNum === 20) {
      scale = 1.02
    }

    const baseSize = 380
    const newSize = baseSize * scale
    ringRef.current.style.width = `${newSize}px`
    ringRef.current.style.height = `${newSize}px`

    computeGeometry()
  }, [wristLength, computeGeometry])

  const clamp01m = (x: number) => Math.min(0.999999, Math.max(0, x))

  const deltaTheta = (rA: number, rB: number) => {
    const ratio = clamp01m((rA + rB + GAP_PX) / (2 * geometryRef.current.R))
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

  const addBead = (stone: StoneSetting['acf']['stone_information']) => {
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

    const el = document.createElement('div')
    el.className = 'bead'
    el.style.width = d + 'px'
    el.style.height = d + 'px'

    // Use image if available
    if (stone.stone_image) {
      el.style.backgroundImage = `url(${stone.stone_image})`
      el.style.backgroundSize = 'cover'
      el.style.backgroundPosition = 'center'
    }

    el.style.left = geometryRef.current.cx + geometryRef.current.R * Math.cos(theta) - r + 'px'
    el.style.top = geometryRef.current.cy + geometryRef.current.R * Math.sin(theta) - r + 'px'

    // Display image without border radius to show original shape

    if (beadsLayerRef.current) {
      beadsLayerRef.current.appendChild(el)
      requestAnimationFrame(() => el.classList.add('show'))
    }

    const price = getStonePrice(stone, beadSize)
    const newBead: Bead = {
      id: Date.now().toString(),
      el,
      r,
      theta,
      imageUrl: stone.stone_image,
      shape,
      stoneSetting: stone,
      price,
    }

    setBeads((prev) => [...prev, newBead])
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

  return (
    <>
      <div className="container mx-auto min-h-32 grid grid-cols-12">
        <div className="col-span-12 md:col-span-4 flex justify-center flex-col">
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
        <div className="col-span-12 md:col-span-4 flex justify-center flex-col">
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
          <span className="text-2xl font-bold">฿{calculateTotalPrice()}</span>
        </div>
      </div>

      <style jsx global>{`
        .bead {
          position: absolute;
          box-shadow: inset 0 10px 18px rgba(255, 255, 255, 0.45),
            inset 0 -10px 22px rgba(0, 0, 0, 0.25), 0 2px 6px rgba(0, 0, 0, 0.2);
          transition: top 0.35s ease, left 0.35s ease,
            transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
          transform: scale(0.6);
        }
        .bead.show {
          transform: scale(1);
        }
      `}</style>

      <div className="container mx-auto">
        <div className="flex items-center justify-center flex-col">
          {/* Stage */}
          <section
            ref={stageRef}
            className="relative w-[520px] h-[520px] max-w-[90vw] aspect-square overflow-hidden"
          >
            <div className="absolute inset-0 grid place-items-center">
              <div
                ref={ringRef}
                className="absolute w-[380px] h-[380px] rounded-full border-[4px] border-black left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300"
              />
            </div>
            <div
              ref={beadsLayerRef}
              className="absolute inset-0 z-[3] pointer-events-none"
              aria-hidden="true"
            />
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
            <Button variant="ghost" size="sm" leftIcon={<Check className="w-4 h-4" />}>
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
            <Tabs defaultValue="1" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="1">หิน</TabsTrigger>
                <TabsTrigger value="2">ชาร์ม</TabsTrigger>
                <TabsTrigger value="3">ตัวคั่น/จี้</TabsTrigger>
              </TabsList>

              {loading ? (
                <div className="mt-6 text-center">Loading stones...</div>
              ) : (
                <>
                  {Object.keys(STONE_CATEGORIES).map((category) => (
                    <TabsContent key={category} value={category} className="mt-6">
                      <div className="grid grid-cols-8 gap-2.5">
                        {getStonesByCategory(category).map((stone) => {
                          const stoneInfo = stone.acf.stone_information
                          const price = getStonePrice(stoneInfo, beadSize)

                          return (
                            <div key={stoneInfo.stone_title} className="relative group">
                              <button
                                className="w-11 h-11 cursor-pointer border border-gray-300 shadow-[inset_0_10px_16px_rgba(255,255,255,0.5),inset_0_-10px_18px_rgba(0,0,0,0.22)] active:scale-95 transition-transform overflow-hidden"
                                style={{
                                  backgroundImage: `url(${stoneInfo.stone_image})`,
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center',
                                }}
                                title={`${stoneInfo.stone_title} - ฿${price}`}
                                onClick={() => addBead(stoneInfo)}
                                aria-label={`Add ${stoneInfo.stone_title} - ฿${price}`}
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
          <div className="col-span-12 md:col-span-6">
            <div className="grid grid-cols-12 gap-4">
              {/* preview single bead image */}
              <div className="col-span-full md:col-span-3 flex items-center justify-center">
                {lastSelectedBead ? (
                  <div className="relative w-24 h-24">
                    <Image
                      src={lastSelectedBead.stone_image}
                      alt={lastSelectedBead.stone_title}
                      width={96}
                      height={96}
                      className="object-cover shadow-lg"
                    />
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
                      <span className="text-xl font-semibold">{lastSelectedBead.stone_title}</span>
                      <span className="text-gray-600 text-sm">
                        {lastSelectedBead.stone_sub_title}
                      </span>
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
                    <div className="text-gray-700 text-sm">
                      {lastSelectedBead.stone_description}
                    </div>
                    {/* stone story */}
                    {lastSelectedBead.stone_story && (
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {lastSelectedBead.stone_story.energy_element && (
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-600">ธาตุพลังงาน:</span>
                            <span className="text-gray-600">
                              {lastSelectedBead.stone_story.energy_element}
                            </span>
                          </div>
                        )}
                        {lastSelectedBead.stone_story.connected_chakras && (
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-600">จักระ:</span>
                            <span className="text-gray-600">
                              {lastSelectedBead.stone_story.connected_chakras}
                            </span>
                          </div>
                        )}
                        {lastSelectedBead.stone_story.ascendant && (
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-600">ลัคนา:</span>
                            <span className="text-gray-600">
                              {lastSelectedBead.stone_story.ascendant}
                            </span>
                          </div>
                        )}
                        {lastSelectedBead.stone_story.star_relations && (
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-600">ดาวประจำ:</span>
                            <span className="text-gray-600">
                              {lastSelectedBead.stone_story.star_relations}
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
    </>
  )
}
