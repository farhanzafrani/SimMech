/**
 * Teaching layer: the "senior engineer" content that sits on top of a topic's formulas —
 * intuition, derivation, pitfalls, rules of thumb, curated video, prerequisites and a self-check quiz.
 * Content lives in ./teachingContent/<course>.ts, keyed by topic id, so it can be authored course by course.
 */
import type { TeachingContent } from './teachingTypes'
import { CONTENT as C0 } from './teachingContent/mechanics-of-materials'
import { CONTENT as C1 } from './teachingContent/machine-design'
import { CONTENT as C2 } from './teachingContent/engineering-dynamics'
import { CONTENT as C3 } from './teachingContent/thermal-fluids-engineering'
import { CONTENT as C4 } from './teachingContent/fluid-mechanics'
import { CONTENT as C5 } from './teachingContent/heat-transfer'
import { CONTENT as C6 } from './teachingContent/engineering-statics'
import { CONTENT as C7 } from './teachingContent/control-systems'
import { CONTENT as C8 } from './teachingContent/robotics-kinematics'
import { CONTENT as C9 } from './teachingContent/materials-and-manufacturing'

export * from './teachingTypes'

export const TEACHING: Record<string, TeachingContent> = {
  ...C0,
  ...C1,
  ...C2,
  ...C3,
  ...C4,
  ...C5,
  ...C6,
  ...C7,
  ...C8,
  ...C9,
}

export function getTeaching(topicId: string): TeachingContent | undefined {
  return TEACHING[topicId]
}
