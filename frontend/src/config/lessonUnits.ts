import type { TopicMeta } from './curriculum'
import type { TeachingContent } from './teaching'

export interface LessonUnit {
  id: string
  label: string
  /** 24×24 stroke icon path */
  icon: string
}

const ICON = {
  read: 'M4 5 H11 A2 2 0 0 1 13 7 V20 A2 2 0 0 0 11 18 H4 Z M20 5 H15 A2 2 0 0 0 13 7 V20 A2 2 0 0 1 15 18 H20 Z',
  formula: 'M14 4 H11 A2 2 0 0 0 9 6 V18 A2 2 0 0 1 7 20 H5 M6 11 H14 M15 13 L20 19 M20 13 L15 19',
  worked: 'M5 4 H19 V20 H5 Z M8 9 H16 M8 13 H16 M8 17 H12',
  viz: 'M2 12 C 6 4, 10 4, 12 12 S 18 20, 22 12',
  play: 'M4 7 H20 M4 17 H20 M15 4.5 V9.5 M8 14.5 V19.5',
  quiz: 'M9 9 A3 3 0 1 1 12 12 V14 M12 18 V18.5',
  video: 'M3 6 H17 V18 H3 Z M17 10 L21 7 V17 L17 14',
  notes: 'M12 3 L22 20 H2 Z M12 10 V14 M12 17 V17.5',
  derive: 'M5 19 L10 5 L14 15 L19 5 M4 12 H12',
  apps: 'M12 3 L21 8 V16 L12 21 L3 16 V8 Z M3 8 L12 13 L21 8 M12 13 V21',
}

/** The sections a lesson page actually renders, in render order — drives the header icons, sidebar and "on this page" rail. */
export function lessonUnits(topic: TopicMeta, hasVisualization: boolean, teaching?: TeachingContent): LessonUnit[] {
  const units: LessonUnit[] = [{ id: 'concept', label: 'Overview', icon: ICON.read }]
  if (topic.formulas.length > 0) units.push({ id: 'formulas', label: 'Formulas', icon: ICON.formula })
  if (teaching?.derivation?.length) units.push({ id: 'derivation', label: 'Derivation', icon: ICON.derive })
  if (topic.workedExample) units.push({ id: 'worked-example', label: 'Worked example', icon: ICON.worked })
  if (hasVisualization) units.push({ id: 'visualize', label: 'Visualization', icon: ICON.viz })
  if (teaching?.videos?.length) units.push({ id: 'videos', label: 'Watch', icon: ICON.video })
  units.push({ id: 'playground', label: 'Playground', icon: ICON.play })
  if (topic.challenges.length > 0) units.push({ id: 'practice', label: 'Practice', icon: ICON.quiz })
  if (teaching?.quiz?.length) units.push({ id: 'quiz', label: 'Quiz', icon: ICON.quiz })
  if (teaching) units.push({ id: 'engineer-notes', label: 'Pitfalls', icon: ICON.notes })
  if (topic.applications.length > 0) units.push({ id: 'applications', label: 'Where this shows up', icon: ICON.apps })
  return units
}
