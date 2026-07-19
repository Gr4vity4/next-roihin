import {
  CIRCLE_SIZE_MAP,
  DEFAULT_CIRCLE_SIZE,
  layoutBeads,
} from '@/lib/utils/braceletGeometry'

// Renders the bracelet design straight from its data (same geometry as the
// designer stage and BraceletPreview) instead of screenshotting the DOM.
// The old html2canvas capture silently dropped the cross-origin stone images,
// so the uploaded thumbnail — the image Stripe checkout displays — was an
// empty ring. Stone images load through /api/image-proxy so the canvas stays
// clean and toDataURL never throws on tainting.

export interface ThumbnailBead {
  imageUrl?: string
  size: number
}

const THUMB_WIDTH = 520
const THUMB_HEIGHT = 360
const THUMB_SCALE = 2
const RING_BORDER = 4
const STONE_FALLBACK_BG = '#d1d5db'
const IMAGE_LOAD_TIMEOUT_MS = 8000
const BRACELET_PLACEHOLDER_IMAGE = '/images/bracelet-placeholder.png'

// Route remote stone images through the same-origin proxy; same-origin paths
// (e.g. /images/...) can be drawn directly.
function toCanvasSafeUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) {
    return `/api/image-proxy?url=${encodeURIComponent(url)}`
  }
  return url
}

function loadImage(url: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image()
    const timer = setTimeout(() => resolve(null), IMAGE_LOAD_TIMEOUT_MS)
    img.onload = () => {
      clearTimeout(timer)
      resolve(img.naturalWidth > 0 ? img : null)
    }
    img.onerror = () => {
      clearTimeout(timer)
      resolve(null)
    }
    img.src = url
  })
}

export async function renderBraceletThumbnail(
  beads: ThumbnailBead[],
  wristLength: string,
): Promise<string> {
  try {
    const canvas = document.createElement('canvas')
    canvas.width = THUMB_WIDTH * THUMB_SCALE
    canvas.height = THUMB_HEIGHT * THUMB_SCALE
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('Canvas 2D context unavailable')
    }
    ctx.scale(THUMB_SCALE, THUMB_SCALE)

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, THUMB_WIDTH, THUMB_HEIGHT)

    const ringDiameter = CIRCLE_SIZE_MAP[wristLength] ?? DEFAULT_CIRCLE_SIZE
    const cx = THUMB_WIDTH / 2
    const cy = THUMB_HEIGHT / 2

    ctx.beginPath()
    ctx.arc(cx, cy, ringDiameter / 2 - RING_BORDER / 2, 0, Math.PI * 2)
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = RING_BORDER
    ctx.stroke()

    const layout = layoutBeads(
      beads.map((bead) => bead.size),
      ringDiameter,
      cx,
      cy,
    )

    const images = await Promise.all(
      beads.map((bead) => (bead.imageUrl ? loadImage(toCanvasSafeUrl(bead.imageUrl)) : null)),
    )

    beads.forEach((bead, index) => {
      const { x, y, width, rotation } = layout[index]
      const image = images[index]

      ctx.save()
      ctx.translate(x, y)
      ctx.rotate((rotation * Math.PI) / 180)

      // Fallback disc underneath, like BraceletPreview, so a failed image
      // still reads as a bead instead of vanishing.
      ctx.beginPath()
      ctx.arc(0, 0, width / 2, 0, Math.PI * 2)
      ctx.fillStyle = STONE_FALLBACK_BG
      ctx.fill()

      if (image) {
        ctx.drawImage(image, -width / 2, -width / 2, width, width)
      }
      ctx.restore()
    })

    return canvas.toDataURL('image/png')
  } catch (error) {
    console.error('Error generating bracelet thumbnail:', error)
    return BRACELET_PLACEHOLDER_IMAGE
  }
}

export function generateBraceletTitle(beadCount: number, wristLength: string, locale: 'en' | 'th'): string {
  if (locale === 'th') {
    return `สร้อยข้อมือออกแบบเอง (${beadCount} หิน, ${wristLength} ซม.)`
  }
  return `Custom Bracelet (${beadCount} stones, ${wristLength} cm)`
}

export function generateBraceletId(): string {
  return `bracelet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
