import { useState } from 'react'
import { theme } from '../styles/theme'

interface ManimVisualizationProps {
  src?: string
  title: string
}

/**
 * Slot for a manim-rendered concept animation (see python-engine's `manim` extra).
 * Falls back to a placeholder until the corresponding mp4 is rendered into /public.
 */
export default function ManimVisualization({ src, title }: ManimVisualizationProps) {
  const [videoFailed, setVideoFailed] = useState(false)
  const showPlaceholder = !src || videoFailed

  return (
    <div
      style={{
        borderRadius: theme.radius.xl,
        overflow: 'hidden',
        backgroundColor: '#0A1230',
      }}
    >
      {showPlaceholder ? (
        <div
          style={{
            minHeight: '320px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: theme.spacing[2],
            color: theme.colors.gray[400],
          }}
        >
          <span
            aria-hidden
            style={{ width: 64, height: 64, borderRadius: 32, background: theme.colors.accent.light, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <svg width="22" height="22" viewBox="0 0 30 30">
              <path d="M9 5 L25 15 L9 25 Z" fill="#111113" />
            </svg>
          </span>
          <div style={{ fontWeight: 600, color: '#FFFFFF' }}>Animation coming soon</div>
          <div style={{ fontSize: '13px', color: theme.colors.lightBlue[300] }}>{title}</div>
        </div>
      ) : (
        <video
          key={src}
          controls
          preload="metadata"
          style={{ width: '100%', display: 'block' }}
          onError={() => setVideoFailed(true)}
        >
          <source src={`/media/${src}`} type="video/mp4" />
        </video>
      )}
    </div>
  )
}
