import { theme } from '../styles/theme'

interface ApplicationsPanelProps {
  applications: string[]
}

const TILES = [
  { bg: theme.colors.lightBlue[500], fg: '#FFFFFF' },
  { bg: theme.colors.gray[900], fg: '#FFFFFF' },
  { bg: theme.colors.accent.light, fg: theme.colors.text.primary },
  { bg: theme.colors.bg.secondary, fg: theme.colors.text.primary },
]

/** Grounds a formula in the real parts and failures it's actually used to size. */
export default function ApplicationsPanel({ applications }: ApplicationsPanelProps) {
  if (applications.length === 0) return null

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: theme.spacing[3] }}>
      {applications.map((item, i) => {
        const tile = TILES[i % TILES.length]
        return (
          <div
            key={item}
            style={{
              display: 'flex',
              padding: 20,
              borderRadius: 20,
              backgroundColor: tile.bg,
              color: tile.fg,
              fontSize: 15,
              lineHeight: 1.5,
            }}
          >
            {item}
          </div>
        )
      })}
    </div>
  )
}
