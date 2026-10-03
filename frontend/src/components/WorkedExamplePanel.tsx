import type { WorkedExample } from '../config/curriculum'
import { theme } from '../styles/theme'

interface WorkedExamplePanelProps {
  example: WorkedExample
}

const label = {
  fontSize: '12px',
  fontWeight: 700,
  letterSpacing: '0.06em',
  color: theme.colors.lightBlue[500],
  marginBottom: '4px',
} as const

/** A fully solved numeric problem — given/find/solution/answer — showing the formulas in actual use. */
export default function WorkedExamplePanel({ example }: WorkedExamplePanelProps) {
  return (
    <div style={{ padding: theme.spacing[6], display: 'flex', flexDirection: 'column', gap: theme.spacing[5], borderRadius: theme.radius.xl, backgroundColor: theme.colors.bg.secondary }}>
      <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing[5] }}>
        <div>
          <div style={label}>GIVEN</div>
          <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.6, color: theme.colors.text.primary }}>{example.given}</p>
        </div>
        <div>
          <div style={label}>FIND</div>
          <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.6, color: theme.colors.text.primary }}>{example.find}</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[2] }}>
        <div style={label}>SOLUTION</div>
        <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: theme.spacing[2] }}>
          {example.steps.map((step, i) => (
            <li
              key={i}
              style={{ display: 'grid', gridTemplateColumns: '36px minmax(0, 1fr)', gap: 14, alignItems: 'center', padding: '14px 16px', borderRadius: 18, backgroundColor: '#FFFFFF' }}
            >
              <span
                aria-hidden
                style={{
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 12,
                  backgroundColor: theme.colors.lightBlue[50],
                  color: theme.colors.lightBlue[500],
                  fontWeight: 700,
                }}
              >
                {i + 1}
              </span>
              <span style={{ fontSize: '15px', lineHeight: 1.6, color: theme.colors.text.primary }}>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '36px minmax(0, 1fr)',
          gap: 14,
          alignItems: 'center',
          padding: '14px 16px',
          backgroundColor: theme.colors.accent.light,
          color: theme.colors.text.primary,
          borderRadius: 18,
        }}
      >
        <span
          aria-hidden
          style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: theme.colors.gray[900], color: '#FFFFFF', fontWeight: 700 }}
        >
          ✓
        </span>
        <span style={{ fontSize: '15px', lineHeight: 1.55, fontWeight: 600 }}>
          <span style={{ fontWeight: 700 }}>Answer: </span>
          {example.answer}
        </span>
      </div>
    </div>
  )
}
