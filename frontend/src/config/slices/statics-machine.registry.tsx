import type { ComponentType } from 'react'
import GearToothBendingConcept from '../../components/concepts/GearToothBendingConcept'
import BeltChainDrivesConcept from '../../components/concepts/BeltChainDrivesConcept'
import StaticsEquilibriumConcept from '../../components/concepts/StaticsEquilibriumConcept'
import StaticsTrussConcept from '../../components/concepts/StaticsTrussConcept'
import StaticsFrictionConcept from '../../components/concepts/StaticsFrictionConcept'
import StaticsCentroidsConcept from '../../components/concepts/StaticsCentroidsConcept'
import GearToothBendingAnalysis from '../../components/GearToothBendingAnalysis'
import BeltChainDrivesAnalysis from '../../components/BeltChainDrivesAnalysis'
import StaticsEquilibriumAnalysis from '../../components/StaticsEquilibriumAnalysis'
import StaticsTrussAnalysis from '../../components/StaticsTrussAnalysis'
import StaticsFrictionAnalysis from '../../components/StaticsFrictionAnalysis'
import StaticsCentroidsAnalysis from '../../components/StaticsCentroidsAnalysis'

export const SLICE_REGISTRY: Record<string, { Concept: ComponentType; Playground: ComponentType }> = {
  'gear-tooth-bending': { Concept: GearToothBendingConcept, Playground: GearToothBendingAnalysis },
  'belt-chain-drives': { Concept: BeltChainDrivesConcept, Playground: BeltChainDrivesAnalysis },
  'statics-equilibrium': { Concept: StaticsEquilibriumConcept, Playground: StaticsEquilibriumAnalysis },
  'statics-truss': { Concept: StaticsTrussConcept, Playground: StaticsTrussAnalysis },
  'statics-friction': { Concept: StaticsFrictionConcept, Playground: StaticsFrictionAnalysis },
  'statics-centroids': { Concept: StaticsCentroidsConcept, Playground: StaticsCentroidsAnalysis },
}
