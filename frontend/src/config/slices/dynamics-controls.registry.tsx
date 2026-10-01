import type { ComponentType } from 'react'
import RigidBodyKineticsConcept from '../../components/concepts/RigidBodyKineticsConcept'
import FreeVibrationConcept from '../../components/concepts/FreeVibrationConcept'
import ForcedVibrationConcept from '../../components/concepts/ForcedVibrationConcept'
import StepResponseConcept from '../../components/concepts/StepResponseConcept'
import PidTuningConcept from '../../components/concepts/PidTuningConcept'
import RootLocusConcept from '../../components/concepts/RootLocusConcept'
import BodeConcept from '../../components/concepts/BodeConcept'
import RigidBodyKineticsAnalysis from '../../components/RigidBodyKineticsAnalysis'
import FreeVibrationAnalysis from '../../components/FreeVibrationAnalysis'
import ForcedVibrationAnalysis from '../../components/ForcedVibrationAnalysis'
import StepResponseAnalysis from '../../components/StepResponseAnalysis'
import PidTuningAnalysis from '../../components/PidTuningAnalysis'
import RootLocusAnalysis from '../../components/RootLocusAnalysis'
import BodeAnalysis from '../../components/BodeAnalysis'

export const SLICE_REGISTRY: Record<string, { Concept: ComponentType; Playground: ComponentType }> = {
  'rigid-body-kinetics': { Concept: RigidBodyKineticsConcept, Playground: RigidBodyKineticsAnalysis },
  'free-vibration': { Concept: FreeVibrationConcept, Playground: FreeVibrationAnalysis },
  'forced-vibration': { Concept: ForcedVibrationConcept, Playground: ForcedVibrationAnalysis },
  'step-response': { Concept: StepResponseConcept, Playground: StepResponseAnalysis },
  'pid-tuning': { Concept: PidTuningConcept, Playground: PidTuningAnalysis },
  'root-locus-stability': { Concept: RootLocusConcept, Playground: RootLocusAnalysis },
  'frequency-response-bode': { Concept: BodeConcept, Playground: BodeAnalysis },
}
