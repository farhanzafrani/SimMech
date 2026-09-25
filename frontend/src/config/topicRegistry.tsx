import type { ComponentType } from 'react'
import StressStrainConcept from '../components/concepts/StressStrainConcept'
import FourBarLinkageConcept from '../components/concepts/FourBarLinkageConcept'
import TorsionConcept from '../components/concepts/TorsionConcept'
import AxialLoadingConcept from '../components/concepts/AxialLoadingConcept'
import ShearBendingConcept from '../components/concepts/ShearBendingConcept'
import BendingStressConcept from '../components/concepts/BendingStressConcept'
import BeamDeflectionConcept from '../components/concepts/BeamDeflectionConcept'
import MohrsCircleConcept from '../components/concepts/MohrsCircleConcept'
import BucklingConcept from '../components/concepts/BucklingConcept'
import StressStrainAnalysis from '../components/StressStrainAnalysis'
import FourBarLinkage from '../components/FourBarLinkage'
import TorsionAnalysis from '../components/TorsionAnalysis'
import AxialLoadingAnalysis from '../components/AxialLoadingAnalysis'
import ShearBendingAnalysis from '../components/ShearBendingAnalysis'
import BendingStressAnalysis from '../components/BendingStressAnalysis'
import BeamDeflectionAnalysis from '../components/BeamDeflectionAnalysis'
import MohrsCircleAnalysis from '../components/MohrsCircleAnalysis'
import BucklingAnalysis from '../components/BucklingAnalysis'

interface TopicImplementation {
  Concept: ComponentType
  Playground: ComponentType
}

export const TOPIC_REGISTRY: Record<string, TopicImplementation> = {
  'stress-strain': {
    Concept: StressStrainConcept,
    Playground: StressStrainAnalysis,
  },
  '4bar-linkage': {
    Concept: FourBarLinkageConcept,
    Playground: FourBarLinkage,
  },
  torsion: {
    Concept: TorsionConcept,
    Playground: TorsionAnalysis,
  },
  'axial-loading': {
    Concept: AxialLoadingConcept,
    Playground: AxialLoadingAnalysis,
  },
  'shear-bending-diagrams': {
    Concept: ShearBendingConcept,
    Playground: ShearBendingAnalysis,
  },
  'bending-stress-beams': {
    Concept: BendingStressConcept,
    Playground: BendingStressAnalysis,
  },
  'beam-deflection': {
    Concept: BeamDeflectionConcept,
    Playground: BeamDeflectionAnalysis,
  },
  'combined-loading-mohrs-circle': {
    Concept: MohrsCircleConcept,
    Playground: MohrsCircleAnalysis,
  },
  'columns-buckling': {
    Concept: BucklingConcept,
    Playground: BucklingAnalysis,
  },
}
