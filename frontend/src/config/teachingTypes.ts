/**
 * Teaching layer: the "senior engineer" content that sits on top of a topic's formulas —
 * intuition, derivation, pitfalls, rules of thumb, curated video, prerequisites and a self-check quiz.
 * Keyed by topic id so it can be rolled out topic by topic without touching curriculum.ts.
 */

export interface VideoRef {
  /** 11-character YouTube video id (verified against the channel, not guessed). */
  id: string
  title: string
  channel: string
  /** Shown as a badge, e.g. "17:37". Optional when not verified. */
  duration?: string
  /** Start playback at this second (e.g. to skip an intro). */
  startSeconds?: number
  /** One line telling the student what to watch for. */
  why: string
}

export interface DerivationStep {
  text: string
  /** KaTeX display equation for the step. */
  latex?: string
}

export interface PrerequisiteRef {
  courseId: string
  topicId: string
  why: string
}

interface QuizBase {
  prompt: string
  /** Shown after answering — explain *why*, not just what. */
  explanation: string
}

export interface ChoiceQuestion extends QuizBase {
  kind: 'choice'
  options: string[]
  /** Index into `options`. */
  correct: number
}

export interface NumericQuestion extends QuizBase {
  kind: 'numeric'
  answer: number
  unit?: string
  /** Relative tolerance, default 0.02 (2 %). */
  tolerance?: number
}

export type QuizQuestion = ChoiceQuestion | NumericQuestion

export interface TeachingContent {
  /** "Feel it first" — a physical picture before any equation. */
  intuition: string
  /** First-principles route to the headline equation. */
  derivation?: DerivationStep[]
  /** What students (and engineers) actually get wrong. */
  commonMistakes: string[]
  /** Practical heuristics and sanity checks. */
  rulesOfThumb: string[]
  /** The order a practising engineer works through this problem. */
  designChecklist?: string[]
  prerequisites?: PrerequisiteRef[]
  videos?: VideoRef[]
  quiz?: QuizQuestion[]
}

export const EE = 'The Efficient Engineer'
