/**
 * Teaching layer: the "senior engineer" content that sits on top of a topic's formulas —
 * intuition, derivation, pitfalls, rules of thumb, curated video, prerequisites and a self-check quiz.
 * Content lives in ./teachingContent/<course>.ts, keyed by topic id, so it can be authored course by course.
 */
import type { TeachingContent } from './teachingTypes'
const CONTENT_MODULES = import.meta.glob<{ CONTENT: Record<string, TeachingContent> }>('./teachingContent/*.ts', { eager: true })

export * from './teachingTypes'

export const TEACHING: Record<string, TeachingContent> = Object.assign(
  {},
  ...Object.values(CONTENT_MODULES).map((m) => m.CONTENT),
)

export function getTeaching(topicId: string): TeachingContent | undefined {
  return TEACHING[topicId]
}
