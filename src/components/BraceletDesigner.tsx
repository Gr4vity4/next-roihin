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
        updatedBeads[0].el.style.left =
          geometryRef.current.cx + Rnew * Math.cos(theta) - updatedBeads[0].r + 'px'
        updatedBeads[0].el.style.top =
          geometryRef.current.cy + Rnew * Math.sin(theta) - updatedBeads[0].r + 'px'
      }

      // Place the rest CCW (left)
      for (let i = 1; i < updatedBeads.length; i++) {
        theta += deltaTheta(updatedBeads[i - 1].r, updatedBeads[i].r, Rnew)
        updatedBeads[i].theta = theta

        if (updatedBeads[i].el) {
          updatedBeads[i].el.style.left =
            geometryRef.current.cx + Rnew * Math.cos(theta) - updatedBeads[i].r + 'px'
          updatedBeads[i].el.style.top =
            geometryRef.current.cy + Rnew * Math.sin(theta) - updatedBeads[i].r + 'px'
        }
      }

      return updatedBeads
    })
  }

  // Update ring size when wrist length changes
  useEffect(() => {
    if (!ringRef.current || !stageRef.current) return

    const wristLengthNum = parseInt(wristLength)
    let scale = 1.0

    if (wristLengthNum === 15) {
      scale = 0.67
    } else if (wristLengthNum === 16) {
      scale = 0.74
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
  }, [wristLength])

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
                className="absolute w-[380px] h-[380px] rounded-full border-[4px] border-black left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-[350ms] ease-in-out"
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
                                className="w-11 h-11 cursor-pointer active:scale-95 transition-transform overflow-hidden"
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
