import type { ComponentType } from 'react'
import ControlVolumeMomentumConcept from '../../components/concepts/ControlVolumeMomentumConcept'
import ViscousFlowConcept from '../../components/concepts/ViscousFlowConcept'
import BoundaryLayerConcept from '../../components/concepts/BoundaryLayerConcept'
import DragLiftConcept from '../../components/concepts/DragLiftConcept'
import PumpSystemConcept from '../../components/concepts/PumpSystemConcept'
import ControlVolumeMomentumAnalysis from '../../components/ControlVolumeMomentumAnalysis'
import ViscousFlowAnalysis from '../../components/ViscousFlowAnalysis'
import BoundaryLayerAnalysis from '../../components/BoundaryLayerAnalysis'
import DragLiftAnalysis from '../../components/DragLiftAnalysis'
import PumpSystemAnalysis from '../../components/PumpSystemAnalysis'

export const SLICE_REGISTRY: Record<string, { Concept: ComponentType; Playground: ComponentType }> = {
  'control-volume-momentum': { Concept: ControlVolumeMomentumConcept, Playground: ControlVolumeMomentumAnalysis },
  'viscous-flow': { Concept: ViscousFlowConcept, Playground: ViscousFlowAnalysis },
  'boundary-layers': { Concept: BoundaryLayerConcept, Playground: BoundaryLayerAnalysis },
  'drag-lift': { Concept: DragLiftConcept, Playground: DragLiftAnalysis },
  'pump-system-curves': { Concept: PumpSystemConcept, Playground: PumpSystemAnalysis },
}
