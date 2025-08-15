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
import { ArrowLeft, Check, RefreshCw } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

type BeadShape = 'circle' | 'square' | 'triangle'

interface Bead {
  id: string
  el: HTMLDivElement | null
  r: number
  theta: number
  backgroundImage: string
  shape: BeadShape
}

interface BeadStyle {
  name: string
  className: string
  gradient: string
  shape?: BeadShape
}

const beadStyles: BeadStyle[] = [
  {
    name: 'Purple',
    className: 'gem-purple',
    gradient: 'radial-gradient(circle at 30% 25%, #c7b1db, #6f4aa0 55%, #402c67)',
  },
  {
    name: 'Amethyst',
    className: 'gem-amethyst',
    gradient: 'radial-gradient(circle at 35% 30%, #e4d8ff, #9e7ed6 55%, #5e3f9d)',
  },
  {
    name: 'Rose',
    className: 'gem-rose',
    gradient: 'radial-gradient(circle at 40% 35%, #ffe8f1, #f6b8c7 60%, #d37892)',
  },
  {
    name: 'Lapis',
    className: 'gem-lapis',
    gradient: 'radial-gradient(circle at 50% 35%, #b0c8ff, #4571c0 58%, #1f3e7a)',
  },
  {
    name: 'Sky',
    className: 'gem-sky',
    gradient: 'radial-gradient(circle at 45% 35%, #e8f7ff, #88c8f0 60%, #3d87c2)',
  },
  {
    name: 'Emerald',
    className: 'gem-emerald',
    gradient: 'radial-gradient(circle at 40% 35%, #c1f1d5, #2e9a6b 58%, #0f6a43)',
  },
  {
    name: 'Citrine',
    className: 'gem-citrine',
    gradient: 'radial-gradient(circle at 45% 35%, #fff0a4, #f9cf54 60%, #c4971d)',
  },
  {
    name: 'Amber',
    className: 'gem-amber',
    gradient: 'radial-gradient(circle at 40% 35%, #fff2b8, #f3b037 60%, #b56b07)',
  },
  {
    name: 'Onyx',
    className: 'gem-onyx',
    gradient: 'radial-gradient(circle at 35% 28%, #808080, #343434 60%, #141414)',
  },
  {
    name: 'Quartz',
    className: 'gem-quartz',
    gradient: 'radial-gradient(circle at 42% 35%, #ffffff, #e6eef2 60%, #b7c3cc)',
  },
]

// Charm styles (square beads) - ชาร์ม
const charmStyles: BeadStyle[] = [
  {
    name: 'Gold Charm',
    className: 'charm-gold',
    gradient: 'linear-gradient(135deg, #ffd700, #ffed4e, #c5a200)',
    shape: 'square' as BeadShape,
  },
  {
    name: 'Silver Charm',
    className: 'charm-silver',
    gradient: 'linear-gradient(135deg, #e8e8e8, #ffffff, #a8a8a8)',
    shape: 'square' as BeadShape,
  },
  {
    name: 'Rose Gold Charm',
    className: 'charm-rose-gold',
    gradient: 'linear-gradient(135deg, #e8b4b8, #ffc0cb, #b76e79)',
    shape: 'square' as BeadShape,
  },
  {
    name: 'Crystal Charm',
    className: 'charm-crystal',
    gradient: 'linear-gradient(135deg, #ffffff, #e6f3ff, #b3d9ff)',
    shape: 'square' as BeadShape,
  },
  {
    name: 'Black Charm',
    className: 'charm-black',
    gradient: 'linear-gradient(135deg, #2c2c2c, #4a4a4a, #1a1a1a)',
    shape: 'square' as BeadShape,
  },
]

// Spacer/Pendant styles (triangle beads) - ตัวคั่น/จี้
const spacerStyles: BeadStyle[] = [
  {
    name: 'Gold Spacer',
    className: 'spacer-gold',
    gradient: 'conic-gradient(from 45deg, #ffd700, #ffed4e, #c5a200, #ffd700)',
    shape: 'triangle' as BeadShape,
  },
  {
    name: 'Silver Spacer',
    className: 'spacer-silver',
    gradient: 'conic-gradient(from 45deg, #e8e8e8, #ffffff, #a8a8a8, #e8e8e8)',
    shape: 'triangle' as BeadShape,
  },
  {
    name: 'Diamond Spacer',
    className: 'spacer-diamond',
    gradient: 'conic-gradient(from 45deg, #ffffff, #f0f8ff, #e6f2ff, #ffffff)',
    shape: 'triangle' as BeadShape,
  },
  {
    name: 'Ruby Spacer',
    className: 'spacer-ruby',
    gradient: 'conic-gradient(from 45deg, #e0115f, #ff69b4, #8b0020, #e0115f)',
    shape: 'triangle' as BeadShape,
  },
  {
    name: 'Sapphire Spacer',
    className: 'spacer-sapphire',
    gradient: 'conic-gradient(from 45deg, #0f52ba, #6495ed, #002366, #0f52ba)',
    shape: 'triangle' as BeadShape,
  },
]

export default function BraceletDesigner() {
  const [beadSize, setBeadSize] = useState(10)
  const [wristLength, setWristLength] = useState('17')
  const [beads, setBeads] = useState<Bead[]>([])
  const [lastSelectedBead, setLastSelectedBead] = useState<BeadStyle | null>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const beadsLayerRef = useRef<HTMLDivElement>(null)

  // Geometry state
  const geometryRef = useRef({
    cx: 260,
    cy: 260,
    R: 190,
  })

  // Pricing configuration
  const SHAPE_PRICES = {
    circle: 20,    // Circle shape: 20 baht per bead
    square: 30,    // Square shape: 30 baht per bead
    triangle: 40,  // Triangle shape: 40 baht per bead
  }

  const SIZE_PRICES = {
    6: 5,    // 6mm: 5 baht
    8: 10,   // 8mm: 10 baht
    10: 15,  // 10mm: 15 baht
    12: 20,  // 12mm: 20 baht
  }

  const BASE_PRICE = 100 // Base price for wrist length 17-20 cm

  // Calculate total price
  const calculateTotalPrice = () => {
    let totalPrice = BASE_PRICE
    
    // Add size base price
    totalPrice += SIZE_PRICES[beadSize as keyof typeof SIZE_PRICES] || 0
    
    // Add price for each bead based on shape
    beads.forEach(bead => {
      totalPrice += SHAPE_PRICES[bead.shape] || 0
    })
    
    return totalPrice
  }

  const mmToPx = (mm: number) => mm * 3.4
  const GAP_PX = 1.0
  const EPS = 0.002
  const START = Math.PI / 2

  const computeGeometry = useCallback(() => {
    if (!stageRef.current || !ringRef.current) return

    const s = stageRef.current.getBoundingClientRect()
    const rr = ringRef.current.getBoundingClientRect()

    geometryRef.current = {
      cx: s.width / 2,
      cy: s.height / 2,
      R: rr.width / 2,
    }
  }, [])

  useEffect(() => {
    computeGeometry()
    window.addEventListener('resize', computeGeometry)
    return () => window.removeEventListener('resize', computeGeometry)
  }, [computeGeometry])

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

  const addBead = (backgroundImage: string, shape: BeadShape = 'circle', beadStyle?: BeadStyle) => {
    const d = mmToPx(beadSize)
    const r = d / 2

    if (!canPlaceWithRadius(r)) {
      nudgeFull()
      return
    }

    // Track the last selected bead
    if (beadStyle) {
      setLastSelectedBead(beadStyle)
    }

    const lastRadius = getLastRadius()
    const thetaNext = getThetaNext()
    const dTheta = beads.length === 0 ? 0 : deltaTheta(lastRadius, r)
    const theta = beads.length === 0 ? START : thetaNext + dTheta

    const el = document.createElement('div')
    el.className = 'bead'
    el.style.width = d + 'px'
    el.style.height = d + 'px'
    el.style.backgroundImage = backgroundImage
    el.style.left = geometryRef.current.cx + geometryRef.current.R * Math.cos(theta) - r + 'px'
    el.style.top = geometryRef.current.cy + geometryRef.current.R * Math.sin(theta) - r + 'px'

    // Apply shape-specific styles
    if (shape === 'square') {
      el.style.borderRadius = '15%'
    } else if (shape === 'triangle') {
      el.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)'
    } else {
      el.style.borderRadius = '50%'
    }

    if (beadsLayerRef.current) {
      beadsLayerRef.current.appendChild(el)
      requestAnimationFrame(() => el.classList.add('show'))
    }

    const newBead: Bead = {
      id: Date.now().toString(),
      el,
      r,
      theta,
      backgroundImage,
      shape,
    }

    setBeads((prev) => [...prev, newBead])
  }

  // Undo and clear functions - uncomment when UI buttons are needed
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
          border-radius: 50%;
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
                className="absolute w-[380px] h-[380px] rounded-full border-[4px] border-black left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
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
            <Tabs defaultValue="beads" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="beads">หิน</TabsTrigger>
                <TabsTrigger value="charms">ชาร์ม</TabsTrigger>
                <TabsTrigger value="spacers">ตัวคั่น/จี้</TabsTrigger>
              </TabsList>

              <TabsContent value="beads" className="mt-6">
                <div className="grid grid-cols-8 gap-2.5">
                  {beadStyles.map((style) => (
                    <button
                      key={style.name}
                      className="w-11 h-11 rounded-full cursor-pointer border border-gray-300 shadow-[inset_0_10px_16px_rgba(255,255,255,0.5),inset_0_-10px_18px_rgba(0,0,0,0.22)] active:scale-95 transition-transform"
                      style={{ background: style.gradient }}
                      title={style.name}
                      onClick={() => addBead(style.gradient, 'circle', style)}
                      aria-label={`Add ${style.name} bead`}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="charms" className="mt-6">
                <div className="grid grid-cols-8 gap-2.5">
                  {charmStyles.map((style) => (
                    <button
                      key={style.name}
                      className="w-11 h-11 rounded-[15%] cursor-pointer border border-gray-300 shadow-[inset_0_10px_16px_rgba(255,255,255,0.5),inset_0_-10px_18px_rgba(0,0,0,0.22)] active:scale-95 transition-transform"
                      style={{ background: style.gradient }}
                      title={style.name}
                      onClick={() => addBead(style.gradient, style.shape || 'square', style)}
                      aria-label={`Add ${style.name} charm`}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="spacers" className="mt-6">
                <div className="grid grid-cols-8 gap-2.5">
                  {spacerStyles.map((style) => (
                    <button
                      key={style.name}
                      className="w-11 h-11 cursor-pointer border border-gray-300 shadow-[inset_0_10px_16px_rgba(255,255,255,0.5),inset_0_-10px_18px_rgba(0,0,0,0.22)] active:scale-95 transition-transform"
                      style={{
                        background: style.gradient,
                        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                      }}
                      title={style.name}
                      onClick={() => addBead(style.gradient, style.shape || 'triangle', style)}
                      aria-label={`Add ${style.name} spacer`}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <div className="col-span-12 md:col-span-6">
            <div className="grid grid-cols-12">
              {/* preview single bead image */}
              <div className="col-span-full md:col-span-2 flex items-center justify-center">
                {lastSelectedBead ? (
                  <div
                    className={`w-24 h-24 ${
                      lastSelectedBead.shape === 'square'
                        ? 'rounded-lg'
                        : lastSelectedBead.shape === 'triangle'
                        ? 'clip-triangle'
                        : 'rounded-full'
                    } shadow-lg`}
                    style={{
                      backgroundImage: lastSelectedBead.gradient,
                    }}
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                    <span className="text-sm">No bead selected</span>
                  </div>
                )}
              </div>
              {/* preview bead detail */}
              <div className="col-span-full md:col-span-10 flex flex-col gap-6">
                {lastSelectedBead ? (
                  <>
                    {/* bead header */}
                    <div className="flex flex-col gap-2">
                      <span className="text-xl font-semibold">{lastSelectedBead.name}</span>
                      <span className="text-gray-600">
                        {lastSelectedBead.shape === 'triangle'
                          ? 'ตัวคั่น / Spacer'
                          : lastSelectedBead.shape === 'square'
                          ? 'ชาร์ม / Charm'
                          : 'หินมงคล / Gemstone'}
                      </span>
                    </div>
                    {/* bead description */}
                    <div className="text-gray-700">
                      {lastSelectedBead.name.includes('Amethyst') && (
                        <>
                          อะเมทิสต์ (Amethyst) คือหินแห่งความสงบและปัญญาที่ช่วยปรับสมดุลจิตใจให้มั่นคง
                          ลดความฟุ้งซ่าน ความโกรธ และความเครียด พร้อมทั้งเสริมสมาธิให้จิตนิ่งลึก
                          เชื่อมต่อกับพลังงานสูงและสัญชาตญาณภายในอย่างชัดเจน
                        </>
                      )}
                      {lastSelectedBead.name.includes('Turquoise') && (
                        <>
                          เทอร์ควอยส์ (Turquoise) หินแห่งการปกป้องและการสื่อสาร 
                          ช่วยเสริมความมั่นใจในการแสดงออก พูดจาด้วยความจริงใจ
                          และสร้างความสมดุลระหว่างจิตใจและอารมณ์
                        </>
                      )}
                      {lastSelectedBead.name.includes('Rose Quartz') && (
                        <>
                          โรสควอตซ์ (Rose Quartz) หินแห่งความรักและความเมตตา
                          ช่วยเปิดหัวใจให้พร้อมรับและให้ความรัก ทั้งต่อตนเองและผู้อื่น
                          สร้างความสงบและความอ่อนโยนในจิตใจ
                        </>
                      )}
                      {lastSelectedBead.name.includes('Onyx') && (
                        <>
                          โอนิกซ์ (Onyx) หินแห่งความแข็งแกร่งและการปกป้อง
                          ช่วยเสริมสร้างความมั่นคงทางจิตใจ ความอดทน และความมุ่งมั่น
                          ป้องกันพลังงานลบและสร้างความสมดุลในชีวิต
                        </>
                      )}
                      {lastSelectedBead.name.includes('Lapis') && (
                        <>
                          ลาพิส ลาซูลี (Lapis Lazuli) หินแห่งปัญญาและความจริง
                          ช่วยเปิดจักระคอหอย เสริมการสื่อสารด้วยความจริงใจ
                          และกระตุ้นการตื่นรู้ทางจิตวิญญาณ
                        </>
                      )}
                      {lastSelectedBead.name.includes('Jade') && (
                        <>
                          หยก (Jade) หินแห่งโชคลาภและความสมบูรณ์
                          ช่วยดึงดูดความมั่งคั่ง ความสำเร็จ และโอกาสดีๆ เข้ามาในชีวิต
                          พร้อมทั้งสร้างความสงบและความสมดุลในจิตใจ
                        </>
                      )}
                      {lastSelectedBead.name.includes('Tiger') && (
                        <>
                          ตาเสือ (Tiger Eye) หินแห่งความกล้าหาญและการปกป้อง
                          ช่วยเสริมความมั่นใจ ความกล้าตัดสินใจ และสัญชาตญาณที่แม่นยำ
                          ป้องกันภัยอันตรายและดึงดูดโชคลาภ
                        </>
                      )}
                      {lastSelectedBead.name.includes('Quartz') && !lastSelectedBead.name.includes('Rose') && (
                        <>
                          ควอตซ์ใส (Clear Quartz) หินแห่งการขยายพลังงาน
                          ช่วยเพิ่มพลังของหินอื่นๆ ทำให้จิตใจใสสะอาด
                          และเสริมสร้างการรับรู้ในระดับที่สูงขึ้น
                        </>
                      )}
                      {(lastSelectedBead.name.includes('Gold') || 
                        lastSelectedBead.name.includes('Silver') || 
                        lastSelectedBead.name.includes('Crystal') ||
                        lastSelectedBead.name.includes('Black') ||
                        lastSelectedBead.name.includes('Diamond') ||
                        lastSelectedBead.name.includes('Ruby') ||
                        lastSelectedBead.name.includes('Sapphire')) && (
                        <>
                          {lastSelectedBead.shape === 'square' 
                            ? 'ชาร์มตกแต่งที่เพิ่มความหรูหราและเอกลักษณ์ให้กับสร้อยข้อมือของคุณ' 
                            : 'ตัวคั่นที่ช่วยเพิ่มความสวยงามและแบ่งจังหวะให้กับการจัดเรียงหินมงคล'}
                        </>
                      )}
                    </div>
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
