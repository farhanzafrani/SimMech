import { useEffect, useState } from 'react'
import type { QuizQuestion } from '../../config/teaching'
import { theme } from '../../styles/theme'

const STORAGE_KEY = 'freebody.quiz.v1'

interface Result {
  correct: boolean
}

type Scores = Record<string, { correct: number; total: number }>

function readScores(): Scores {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as Scores
  } catch {
    return {}
  }
}

function writeScore(topicId: string, correct: number, total: number) {
  try {
    const scores = readScores()
    scores[topicId] = { correct, total }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores))
  } catch {
    // Storage can be unavailable (private mode); the quiz still works without it.
  }
}

function isCorrect(q: QuizQuestion, value: string): boolean {
  if (q.kind === 'choice') return Number(value) === q.correct
  const x = Number.parseFloat(value)
  if (!Number.isFinite(x)) return false
  const tol = q.tolerance ?? 0.02
  return q.answer === 0 ? Math.abs(x) <= tol : Math.abs(x - q.answer) / Math.abs(q.answer) <= tol
}

const GREEN = theme.colors.success
const RED = theme.colors.error

function QuestionCard({
  index,
  question,
  result,
  onSubmit,
}: {
  index: number
  question: QuizQuestion
  result?: Result
  onSubmit: (value: string) => void
}) {
  const [value, setValue] = useState('')
  const answered = result !== undefined
  const canCheck = !answered && value.trim() !== ''

  return (
    <div
      style={{
        padding: 22,
        borderRadius: 24,
        border: `2px solid ${answered ? (result.correct ? GREEN : RED) : theme.colors.text.primary}`,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', color: theme.colors.lightBlue[500] }}>
        QUESTION {index + 1} · {question.kind === 'choice' ? 'CONCEPT' : 'CALCULATE'}
      </div>
      <div style={{ fontSize: 17, lineHeight: 1.5, color: theme.colors.text.primary }}>{question.prompt}</div>

      {question.kind === 'choice' ? (
        <div role="radiogroup" aria-label={`Answers for question ${index + 1}`} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {question.options.map((opt, i) => {
            const selected = value === String(i)
            const showCorrect = answered && i === question.correct
            const showWrong = answered && selected && i !== question.correct
            return (
              <label
                key={opt}
                style={{
                  display: 'flex',
                  gap: 10,
                  alignItems: 'flex-start',
                  padding: '10px 14px',
                  borderRadius: 14,
                  cursor: answered ? 'default' : 'pointer',
                  fontSize: 15,
                  lineHeight: 1.5,
                  background: showCorrect ? 'rgba(46,155,84,0.12)' : showWrong ? 'rgba(226,72,61,0.12)' : selected ? theme.colors.lightBlue[50] : theme.colors.bg.secondary,
                  border: `1.5px solid ${showCorrect ? GREEN : showWrong ? RED : selected ? theme.colors.lightBlue[500] : 'transparent'}`,
                }}
              >
                <input
                  type="radio"
                  name={`q-${index}`}
                  value={i}
                  checked={selected}
                  disabled={answered}
                  onChange={() => setValue(String(i))}
                  style={{ marginTop: 4 }}
                />
                <span>{opt}</span>
              </label>
            )
          })}
        </div>
      ) : (
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15 }}>
          <input
            type="text"
            inputMode="decimal"
            aria-label={`Your answer to question ${index + 1}`}
            value={value}
            disabled={answered}
            placeholder="Your answer"
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && canCheck) onSubmit(value)
            }}
            style={{
              width: 160,
              padding: '10px 14px',
              borderRadius: 14,
              border: `1.5px solid ${theme.colors.gray[300]}`,
              fontFamily: theme.typography.fontFamily.mono,
              fontSize: 15,
            }}
          />
          {question.unit && <span style={{ color: theme.colors.text.secondary }}>{question.unit}</span>}
        </label>
      )}

      {!answered && (
        <button
          type="button"
          disabled={!canCheck}
          onClick={() => onSubmit(value)}
          style={{
            alignSelf: 'flex-start',
            height: 40,
            padding: '0 20px',
            border: 0,
            borderRadius: 20,
            fontWeight: 600,
            fontSize: 14,
            cursor: canCheck ? 'pointer' : 'not-allowed',
            background: canCheck ? theme.colors.gray[900] : theme.colors.gray[200],
            color: canCheck ? '#FFFFFF' : theme.colors.gray[500],
          }}
        >
          Check answer
        </button>
      )}

      {answered && (
        <div role="status" style={{ fontSize: 15, lineHeight: 1.6, color: theme.colors.text.primary }}>
          <strong style={{ color: result.correct ? GREEN : RED }}>{result.correct ? 'Correct. ' : 'Not quite. '}</strong>
          {question.kind === 'numeric' && !result.correct && (
            <span>
              The answer is {question.answer} {question.unit ?? ''}.{' '}
            </span>
          )}
          {question.explanation}
        </div>
      )}
    </div>
  )
}

/** Self-check quiz: instant feedback with an explanation, and the last score is remembered per topic in this browser. */
export default function Quiz({ topicId, questions }: { topicId: string; questions: QuizQuestion[] }) {
  const [results, setResults] = useState<Record<number, Result>>({})
  const [run, setRun] = useState(0)
  const [previous, setPrevious] = useState<{ correct: number; total: number } | undefined>(undefined)

  // Reset when the student moves to another topic (this component stays mounted across route changes).
  useEffect(() => {
    setResults({})
    setRun((r) => r + 1)
    setPrevious(readScores()[topicId])
  }, [topicId])

  const answeredCount = Object.keys(results).length
  const correctCount = Object.values(results).filter((r) => r.correct).length
  const done = answeredCount === questions.length

  const submit = (i: number, value: string) => {
    const next = { ...results, [i]: { correct: isCorrect(questions[i], value) } }
    setResults(next)
    if (Object.keys(next).length === questions.length) {
      const score = Object.values(next).filter((r) => r.correct).length
      writeScore(topicId, score, questions.length)
      setPrevious({ correct: score, total: questions.length })
    }
  }

  const retry = () => {
    setResults({})
    setRun((r) => r + 1)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[4] }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', fontSize: 14, color: theme.colors.text.secondary }}>
        <span style={{ fontFamily: theme.typography.fontFamily.mono }}>
          {answeredCount} / {questions.length} answered
        </span>
        {previous && (
          <span style={{ padding: '2px 10px', borderRadius: 12, background: theme.colors.bg.secondary }}>
            Last completed score: {previous.correct} / {previous.total}
          </span>
        )}
      </div>

      {questions.map((q, i) => (
        <QuestionCard key={`${topicId}-${run}-${i}`} index={i} question={q} result={results[i]} onSubmit={(v) => submit(i, v)} />
      ))}

      {done && (
        <div
          role="status"
          style={{ padding: '16px 20px', borderRadius: 20, background: theme.colors.accent.light, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}
        >
          <span style={{ fontWeight: 700, fontSize: 16, color: theme.colors.text.primary }}>
            You scored {correctCount} / {questions.length}
            {correctCount === questions.length ? ' — full marks.' : '. Re-read the explanations above, then try again.'}
          </span>
          <button
            type="button"
            onClick={retry}
            style={{ height: 40, padding: '0 20px', border: 0, borderRadius: 20, fontWeight: 600, fontSize: 14, cursor: 'pointer', background: theme.colors.gray[900], color: '#FFFFFF' }}
          >
            Try again
          </button>
        </div>
      )}
    </div>
  )
}
