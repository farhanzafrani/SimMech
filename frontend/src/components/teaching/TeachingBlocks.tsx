import { Link } from 'react-router-dom'
import { findTopic } from '../../config/curriculum'
import type { DerivationStep, PrerequisiteRef } from '../../config/teaching'
import Formula from '../Formula'
import { theme } from '../../styles/theme'

const BLUE = theme.colors.lightBlue[500]

const kicker = {
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: '0.06em',
  color: BLUE,
} as const

/** "Feel it first" callout shown in the overview, before any equation. */
export function IntuitionCallout({ text }: { text: string }) {
  return (
    <div style={{ padding: '22px 24px', borderRadius: theme.radius.xl, background: theme.colors.accent.light, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ fontWeight: 700, color: theme.colors.text.primary }}>The intuition</div>
      <p style={{ margin: 0, fontSize: 16, lineHeight: 1.65, color: theme.colors.text.primary }}>{text}</p>
    </div>
  )
}

/** Links to the topics a student should have met first. Unknown topic ids are skipped. */
export function Prerequisites({ items }: { items: PrerequisiteRef[] }) {
  const resolved = items
    .map((p) => ({ ...p, topic: findTopic(p.courseId, p.topicId).topic }))
    .filter((p) => p.topic && p.topic.status === 'active')
  if (resolved.length === 0) return null

  return (
    <div style={{ padding: '18px 22px', borderRadius: theme.radius.xl, background: theme.colors.bg.secondary, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ fontWeight: 700, color: theme.colors.text.primary }}>Builds on</div>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {resolved.map((p) => (
          <li key={p.topicId} style={{ fontSize: 15, lineHeight: 1.55, color: theme.colors.text.secondary }}>
            <Link to={`/courses/${p.courseId}/topics/${p.topicId}`} style={{ color: BLUE, fontWeight: 600 }}>
              {p.topic?.title}
            </Link>{' '}
            — {p.why}
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Step-by-step first-principles route to the headline equation. */
export function Derivation({ steps }: { steps: DerivationStep[] }) {
  return (
    <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
      {steps.map((s, i) => (
        <li
          key={i}
          style={{ display: 'grid', gridTemplateColumns: '36px minmax(0, 1fr)', gap: 14, alignItems: 'start', padding: '16px 18px', borderRadius: 20, background: theme.colors.bg.secondary }}
        >
          <span
            aria-hidden
            style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12, background: theme.colors.lightBlue[50], color: BLUE, fontWeight: 700 }}
          >
            {i + 1}
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0 }}>
            <span style={{ fontSize: 15, lineHeight: 1.65, color: theme.colors.text.primary }}>{s.text}</span>
            {s.latex && (
              <div style={{ overflowX: 'auto', padding: '10px 14px', borderRadius: 14, background: '#FFFFFF' }}>
                <Formula latex={s.latex} displayMode />
              </div>
            )}
          </div>
        </li>
      ))}
    </ol>
  )
}

function Bullets({ items, tone }: { items: string[]; tone: 'warn' | 'tip' }) {
  const color = tone === 'warn' ? theme.colors.error : theme.colors.success
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
      {items.map((item) => (
        <li key={item} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 15, lineHeight: 1.6, color: theme.colors.text.primary }}>
          <span aria-hidden style={{ flexShrink: 0, marginTop: 8, width: 8, height: 8, borderRadius: 4, background: color }} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

/** Common mistakes + rules of thumb + the practising engineer's checklist. */
export function EngineerNotes({ mistakes, rulesOfThumb, checklist }: { mistakes: string[]; rulesOfThumb: string[]; checklist?: string[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[4] }}>
      <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing[4] }}>
        <div style={{ padding: 22, borderRadius: 24, border: `2px solid ${theme.colors.text.primary}`, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={kicker}>COMMON MISTAKES</div>
          <Bullets items={mistakes} tone="warn" />
        </div>
        <div style={{ padding: 22, borderRadius: 24, background: theme.colors.bg.secondary, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={kicker}>RULES OF THUMB</div>
          <Bullets items={rulesOfThumb} tone="tip" />
        </div>
      </div>
      {checklist && checklist.length > 0 && (
        <div style={{ padding: 22, borderRadius: 24, background: theme.colors.gray[900], color: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ ...kicker, color: theme.colors.accent.light }}>HOW AN ENGINEER WORKS THIS PROBLEM</div>
          <ol style={{ margin: 0, paddingLeft: 22, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 15, lineHeight: 1.6 }}>
            {checklist.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}
