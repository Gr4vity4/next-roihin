// Shared bracelet layout geometry used by both the designer stage
// (BraceletDesigner) and the cart preview (BraceletPreview) so the preview
// reproduces the exact designed layout.

// Circle size mapping based on wrist length (px)
export const CIRCLE_SIZE_MAP: Record<string, number> = {
  '14': 213,
  '15': 226,
  '16': 238,
  '17': 251,
  '18': 264,
  '19': 276,
  '20': 289,
}

export const DEFAULT_CIRCLE_SIZE = 238 // 16 cm

export const BEAD_PX_PER_MM = 4

// Beads start at the bottom of the ring (6 o'clock)
export const START_ANGLE = Math.PI / 2

export interface BeadLayout {
  x: number
  y: number
  width: number
  rotation: number // degrees
}

// Place beads of the given sizes (mm) around a ring, in order, packed edge to
// edge from START_ANGLE — the same math renderBeads uses on the designer stage.
export function layoutBeads(
  beadSizesMm: number[],
  ringDiameter: number,
  cx: number,
  cy: number,
): BeadLayout[] {
  const radius = ringDiameter / 2
  let currentAngle = START_ANGLE

  return beadSizesMm.map((sizeMm) => {
    const width = sizeMm * BEAD_PX_PER_MM
    const chordToRadiusRatio = Math.min(width / (2 * radius), 1)
    const angleSpan = 2 * Math.asin(chordToRadiusRatio)
    const angle = currentAngle + angleSpan / 2
    currentAngle += angleSpan

    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
      width,
      rotation: (angle * 180) / Math.PI - 90,
    }
  })
}
