import type { RealImage } from '../config/curriculum'
import { theme } from '../styles/theme'

interface RealPhotoProps {
  image: RealImage
}

/** A real photograph of the physical part this topic models, with license credit. */
export default function RealPhoto({ image }: RealPhotoProps) {
  return (
    <figure
      className="card"
      style={{ margin: 0, padding: theme.spacing[3], borderRadius: theme.radius.xl, display: 'flex', flexDirection: 'column', gap: theme.spacing[2] }}
    >
      <img
        src={`/media/${image.src}`}
        alt={image.alt}
        style={{
          width: '100%',
          height: '260px',
          objectFit: 'cover',
          borderRadius: theme.radius.lg,
          display: 'block',
        }}
      />
      <figcaption style={{ fontSize: '13px', lineHeight: 1.5, color: theme.colors.text.secondary }}>
        {image.alt}
        <br />
        <a
          href={image.creditUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: theme.colors.text.light, fontFamily: theme.typography.fontFamily.mono, fontSize: '11px' }}
        >
          Photo: {image.credit} · {image.license} ↗
        </a>
      </figcaption>
    </figure>
  )
}
