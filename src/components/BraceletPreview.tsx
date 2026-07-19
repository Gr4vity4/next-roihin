'use client'

import {
  BEAD_PX_PER_MM,
  CIRCLE_SIZE_MAP,
  DEFAULT_CIRCLE_SIZE,
  layoutBeads,
} from '@/lib/utils/braceletGeometry'

interface PreviewBead {
  stoneImage?: string
  size: number
}

interface BraceletPreviewProps {
  beads: PreviewBead[]
  wristLength: string
  className?: string
}

const RING_BORDER = 4
const STONE_FALLBACK_BG = '#d1d5db'

// Renders a designed bracelet from the cart's braceletDesign data with the
// same geometry as the designer stage, so cart/checkout always show the exact
// design without depending on the uploaded thumbnail snapshot.
export default function BraceletPreview({ beads, wristLength, className }: BraceletPreviewProps) {
  const ringDiameter = CIRCLE_SIZE_MAP[wristLength] ?? DEFAULT_CIRCLE_SIZE
  const maxBeadPx = beads.reduce((max, bead) => Math.max(max, bead.size * BEAD_PX_PER_MM), 0)
  const viewSize = ringDiameter + maxBeadPx + 8
  const center = viewSize / 2
  const layout = layoutBeads(
    beads.map((bead) => bead.size),
    ringDiameter,
    center,
    center,
  )

  return (
    <svg viewBox={`0 0 ${viewSize} ${viewSize}`} className={className} role="img">
      <circle
        cx={center}
        cy={center}
        r={ringDiameter / 2 - RING_BORDER / 2}
        fill="none"
        stroke="#000"
        strokeWidth={RING_BORDER}
      />
      {beads.map((bead, index) => {
        const { x, y, width, rotation } = layout[index]
        return (
          <g key={index} transform={`rotate(${rotation} ${x} ${y})`}>
            <circle cx={x} cy={y} r={width / 2} fill={STONE_FALLBACK_BG} />
            {bead.stoneImage && (
              <image
                href={bead.stoneImage}
                x={x - width / 2}
                y={y - width / 2}
                width={width}
                height={width}
              />
            )}
          </g>
        )
      })}
    </svg>
  )
}
