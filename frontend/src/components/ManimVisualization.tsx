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
        borderRadius: theme.radius.lg,
        border: `1px solid ${theme.colors.border}`,
        overflow: 'hidden',
        backgroundColor: theme.colors.gray[900],
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
          <div style={{ fontSize: '32px' }}>🎬</div>
          <div style={{ fontWeight: 600 }}>Animation coming soon</div>
          <div style={{ fontSize: '13px', color: theme.colors.gray[500] }}>{title}</div>
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
