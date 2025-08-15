'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCallback, useEffect, useRef, useState } from 'react'

interface Bead {
  id: string
  el: HTMLDivElement | null
  r: number
  theta: number
  backgroundImage: string
}

interface BeadStyle {
  name: string
  className: string
  gradient: string
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

export default function BraceletDesigner() {
  const [beadSize, setBeadSize] = useState(10)
  const [wristLength, setWristLength] = useState('17')
  const [beads, setBeads] = useState<Bead[]>([])
  const stageRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const beadsLayerRef = useRef<HTMLDivElement>(null)

  // Geometry state
  const geometryRef = useRef({
    cx: 260,
    cy: 260,
    R: 190,
  })

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

  const addBead = (backgroundImage: string) => {
    const d = mmToPx(beadSize)
    const r = d / 2

    if (!canPlaceWithRadius(r)) {
      nudgeFull()
      return
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
    }

    setBeads((prev) => [...prev, newBead])
  }

  // Undo and clear functions - uncomment when UI buttons are needed
  // const undoBead = () => {
  //   if (beads.length === 0) return
  //
  //   const lastBead = beads[beads.length - 1]
  //   if (lastBead.el) {
  //     lastBead.el.remove()
  //   }
  //
  //   setBeads((prev) => prev.slice(0, -1))
  // }
  //
  // const clearBeads = () => {
  //   beads.forEach((bead) => {
  //     if (bead.el) bead.el.remove()
  //   })
  //   setBeads([])
  // }

  return (
    <>
      <div className="container mx-auto border-2 border-red-300 min-h-32 grid grid-cols-12">
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
          <span className="text-[#006039] text-lg">ราคา</span>
          <span>x</span>
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
        <div className="flex items-center justify-center">
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
              {/* <div className="absolute top-[calc(50%-190px)] bottom-[calc(50%-190px)] left-1/2 w-[3px] -translate-x-1/2 bg-red-500 rounded-sm z-[4] pointer-events-none" /> */}
            </div>
            <div
              ref={beadsLayerRef}
              className="absolute inset-0 z-[3] pointer-events-none"
              aria-hidden="true"
            />
          </section>
        </div>

        <div className="grid grid-cols-12 border w-full">
          {/* Controls */}
          <div className="col-span-12 md:col-span-6 border">
            {/* <div className="flex items-center gap-3 flex-wrap mb-4">
            <label htmlFor="size" className="font-medium">
              Bead size (mm):
            </label>
            <Select value={String(beadSize)} onValueChange={(value) => setBeadSize(Number(value))}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6mm</SelectItem>
                <SelectItem value="8">8mm</SelectItem>
                <SelectItem value="10">10mm</SelectItem>
                <SelectItem value="12">12mm</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between mb-4">
            <button
              onClick={undoBead}
              className="border border-gray-300 bg-white px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Undo
            </button>
            <button
              onClick={clearBeads}
              className="border border-gray-300 bg-white px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
          </div> */}

            <p className="mb-3 font-semibold">Bead tray</p>
            <div className="grid grid-cols-8 gap-2.5">
              {beadStyles.map((style) => (
                <button
                  key={style.name}
                  className="w-11 h-11 rounded-full cursor-pointer border border-gray-300 shadow-[inset_0_10px_16px_rgba(255,255,255,0.5),inset_0_-10px_18px_rgba(0,0,0,0.22)] active:scale-95 transition-transform"
                  style={{ background: style.gradient }}
                  title={style.name}
                  onClick={() => addBead(style.gradient)}
                  aria-label={`Add ${style.name} bead`}
                />
              ))}
            </div>
          </div>
          <div className="col-span-12 md:col-span-6 border">
            <div className="grid grid-cols-12">
              {/* preview single bead image */}
              <div className="col-span-full md:col-span-2">x</div>
              {/* preview bead detail */}
              <div className="col-span-full md:col-span-10 flex flex-col gap-6">
                {/* bead header */}
                <div className="flex flex-col gap-2">
                  <span>AMethyst</span>
                  <span>ความสงบ - ปัญญา - การปกป้อง</span>
                </div>
                {/* bead description */}
                <div>
                  อะเมทิสต์ (Amethyst) คือหินแห่งความวงบและปัญญาที่ช่วยปรับสมดุลจิตใจให้มั่นคง
                  ลดความฟุ้งซ่าน ความโกรธ และความเครียด พร้อมทั้งเสริมสมาธิให้จิตนั่งลึก
                  เชื่อมต่อกับพนังานสูงและสัญชาตญาณภายในอย่างชัดเจน
                  เป็นเกราะป้องกันพลังงานด้านลบและสิ่งที่รบกวนจิตวิญญาณ
                  อีกทั้งยังช่วยเปิดประตูสู่การตื่นรู้ทางจิตวิญญาณ
                  ทำให้ผู้ครอบครองมองเห็นความจริงของเหตุการณ์ด้วยใจที่สงบและตัดสินใจได้อย่างชาญฉลาด
                </div>
                {/* bead footer */}
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <span className="font-bold text-[#006039]">ธาตุพลังงาน</span>
                    <span>ลม / วิญญาณ</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold text-[#006039]">จักระที่เชื่อมโยง</span>
                    <span>จักระตาที่สาม (Third Eye) และจักระมงกุฏ (Crown)</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold text-[#006039]">ลัคนาราศี</span>
                    <span>กุมภ์ (Aquarius), มีน (Pisces), ธนู (Sagittarius), กันย์ (Virgo)</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold text-[#006039]">ดวงดาวสัมพันธ์</span>
                    <span>ดาวพฤหัสบดี (Jupiter) และดาวเนปจูน (Neptune)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
