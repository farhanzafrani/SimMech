/**
 * Icon glyph set — engineering motifs for category/step badges, drawn as solid
 * shaded shapes (varying fill-opacity layers on currentColor) rather than thin
 * outlines, so they read as chunky, dimensional badges at larger sizes.
 */
import type { SVGProps } from 'react'

const solidBase: SVGProps<SVGSVGElement> = {
  viewBox: '0 0 24 24',
  fill: 'currentColor',
  stroke: 'none',
}

const lineBase: SVGProps<SVGSVGElement> = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.4,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

/** Mechanics of solids — solid I-beam cross-section, flanges brighter than the web. */
export function BeamIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...solidBase} {...props}>
      <path d="M3.5 3.5h17v4h-17z" />
      <path d="M9.5 6.5h5v11h-5z" fillOpacity={0.7} />
      <path d="M3.5 16.5h17v4h-17z" />
    </svg>
  )
}

/** Machine elements & design — solid hex bolt head with a punched-out hole. */
export function BoltIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...solidBase} {...props}>
      <path
        fillRule="evenodd"
        d="M15.6 3.2 20.6 12 15.6 20.8H8.4L3.4 12 8.4 3.2Z M12 8.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4Z"
      />
    </svg>
  )
}

/** Dynamics & control — thick rotational arrow with a leading dot. */
export function OrbitIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...lineBase} strokeWidth={2.6} {...props}>
      <path d="M4 12a8 8 0 1 1 2.7 6" />
      <path d="M3.5 15.2 4 19l3.6-1.1" fill="currentColor" stroke="none" />
      <circle cx="17" cy="6.2" r="1.4" fill="currentColor" stroke="none" fillOpacity={0.55} />
    </svg>
  )
}

/** Thermal & fluids — solid droplet. */
export function DropletIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...solidBase} {...props}>
      <path d="M12 2.8S5.2 11 5.2 15.4a6.8 6.8 0 0 0 13.6 0C18.8 11 12 2.8 12 2.8z" />
    </svg>
  )
}

/** Design & manufacturing — shaded isometric build cube. */
export function CubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...solidBase} {...props}>
      <path d="M12 2.5 20 7 12 11.5 4 7Z" />
      <path d="M4 7v9.5l8 4.5v-9.5z" fillOpacity={0.55} />
      <path d="M20 7v9.5l-8 4.5v-9.5z" fillOpacity={0.78} />
    </svg>
  )
}

/** "How it's built" step 1 — the formula. */
export function SigmaIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...lineBase} {...props}>
      <path d="M17 4.5H7l6 7.5-6 7.5h10" />
    </svg>
  )
}

/** Step 2 — visualization. */
export function EyeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...lineBase} {...props}>
      <path d="M2 12S5.8 5.5 12 5.5 22 12 22 12s-3.8 6.5-10 6.5S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
    </svg>
  )
}

/** Step 3 — playground controls. */
export function SlidersIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...lineBase} {...props}>
      <path d="M6 20V13.5M6 9.5V4M12 20v-4.5M12 12V4M18 20v-7.5M18 9.5V4" />
      <circle cx="6" cy="11.5" r="2.1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="14.5" r="2.1" fill="currentColor" stroke="none" />
      <circle cx="18" cy="11.5" r="2.1" fill="currentColor" stroke="none" />
    </svg>
  )
}

/** Step 4 — practice / check. */
export function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...lineBase} strokeWidth={3} {...props}>
      <path d="M5 12.5 10 17.5 19 7" />
    </svg>
  )
}
