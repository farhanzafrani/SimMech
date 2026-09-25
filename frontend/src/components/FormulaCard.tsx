import type { FormulaEntry } from '../config/curriculum'
import Formula from './Formula'
import { theme } from '../styles/theme'

export default function FormulaCard({ label, formula, latex, note, emphasis }: FormulaEntry) {
  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing[3],
        padding: theme.spacing[4],
        ...(emphasis
          ? { backgroundColor: theme.colors.gray[900], color: theme.colors.bg.primary, border: 'none' }
          : {}),
      }}
    >
      <div style={{ fontSize: '13px', fontWeight: 600, color: emphasis ? theme.colors.accent.light : theme.colors.text.light }}>
        {label}
      </div>
      <div style={{ fontSize: '22px', color: 'inherit' }}>
        {latex ? (
          <Formula latex={latex} />
        ) : (
          <span style={{ fontFamily: theme.typography.fontFamily.serif, fontStyle: 'italic' }}>{formula}</span>
        )}
      </div>
      <div style={{ fontSize: '13px', lineHeight: 1.5, color: emphasis ? theme.colors.gray[200] : theme.colors.text.light }}>
        {note}
      </div>
    </div>
  )
}
