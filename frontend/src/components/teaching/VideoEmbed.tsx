import { useState } from 'react'
import type { VideoRef } from '../../config/teaching'
import { theme } from '../../styles/theme'

function VideoCard({ video }: { video: VideoRef }) {
  const [playing, setPlaying] = useState(false)
  const start = video.startSeconds ? `&start=${video.startSeconds}` : ''
  const watchUrl = `https://www.youtube.com/watch?v=${video.id}${video.startSeconds ? `&t=${video.startSeconds}s` : ''}`

  return (
    <figure style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
      <div style={{ position: 'relative', aspectRatio: '16 / 9', borderRadius: theme.radius.xl, overflow: 'hidden', backgroundColor: '#0A1230' }}>
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0${start}`}
            title={video.title}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
          />
        ) : (
          // The player loads only on click, so the page makes no request to YouTube until the student asks for the video.
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play video: ${video.title}`}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', padding: 0, border: 0, cursor: 'pointer', background: 'transparent' }}
          >
            <img
              src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
              alt=""
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: 0.85 }}
            />
            <span
              aria-hidden
              style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: 64, height: 64, borderRadius: 32, background: theme.colors.accent.light, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <svg width="22" height="22" viewBox="0 0 30 30">
                <path d="M9 5 L25 15 L9 25 Z" fill="#111113" />
              </svg>
            </span>
            {video.duration && (
              <span style={{ position: 'absolute', right: 10, bottom: 10, padding: '2px 8px', borderRadius: 8, background: 'rgba(0,0,0,0.75)', color: '#FFFFFF', fontSize: 12, fontFamily: theme.typography.fontFamily.mono }}>
                {video.duration}
              </span>
            )}
          </button>
        )}
      </div>
      <figcaption style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontWeight: 700, fontSize: 16, color: theme.colors.text.primary }}>{video.title}</span>
        <span style={{ fontSize: 14, lineHeight: 1.55, color: theme.colors.text.secondary }}>{video.why}</span>
        <span style={{ fontSize: 13, color: theme.colors.text.light }}>
          {video.channel} ·{' '}
          <a href={watchUrl} target="_blank" rel="noopener noreferrer" style={{ color: theme.colors.lightBlue[500], fontWeight: 600 }}>
            Watch on YouTube ↗
          </a>
        </span>
      </figcaption>
    </figure>
  )
}

/** Curated third-party video. The first entry is featured; extras sit beside it as companions. */
export default function VideoEmbed({ videos }: { videos: VideoRef[] }) {
  if (videos.length === 0) return null
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: theme.spacing[5] }}>
      {videos.map((v) => (
        <VideoCard key={v.id} video={v} />
      ))}
    </div>
  )
}
