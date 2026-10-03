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
import FailureTheoriesConcept from '../components/concepts/FailureTheoriesConcept'
import FatigueAnalysisConcept from '../components/concepts/FatigueAnalysisConcept'
import ShaftDesignConcept from '../components/concepts/ShaftDesignConcept'
import SpringDesignConcept from '../components/concepts/SpringDesignConcept'
import BoltedJointsConcept from '../components/concepts/BoltedJointsConcept'
import BearingSelectionConcept from '../components/concepts/BearingSelectionConcept'
import ParticleKinematicsConcept from '../components/concepts/ParticleKinematicsConcept'
import NewtonWorkEnergyConcept from '../components/concepts/NewtonWorkEnergyConcept'
import RigidBodyPlanarKinematicsConcept from '../components/concepts/RigidBodyPlanarKinematicsConcept'
import FirstLawThermodynamicsConcept from '../components/concepts/FirstLawThermodynamicsConcept'
import FluidStaticsBernoulliConcept from '../components/concepts/FluidStaticsBernoulliConcept'
import PipeFlowHeatTransferConcept from '../components/concepts/PipeFlowHeatTransferConcept'
import StressStrainAnalysis from '../components/StressStrainAnalysis'
import FourBarLinkage from '../components/FourBarLinkage'
import TorsionAnalysis from '../components/TorsionAnalysis'
import AxialLoadingAnalysis from '../components/AxialLoadingAnalysis'
import ShearBendingAnalysis from '../components/ShearBendingAnalysis'
import BendingStressAnalysis from '../components/BendingStressAnalysis'
import BeamDeflectionAnalysis from '../components/BeamDeflectionAnalysis'
import MohrsCircleAnalysis from '../components/MohrsCircleAnalysis'
import BucklingAnalysis from '../components/BucklingAnalysis'
import FailureTheoriesAnalysis from '../components/FailureTheoriesAnalysis'
import FatigueAnalysis from '../components/FatigueAnalysis'
import ShaftDesignAnalysis from '../components/ShaftDesignAnalysis'
import SpringDesignAnalysis from '../components/SpringDesignAnalysis'
import BoltedJointsAnalysis from '../components/BoltedJointsAnalysis'
import BearingSelectionAnalysis from '../components/BearingSelectionAnalysis'
import ParticleKinematicsAnalysis from '../components/ParticleKinematicsAnalysis'
import NewtonWorkEnergyAnalysis from '../components/NewtonWorkEnergyAnalysis'
import RigidBodyPlanarKinematicsAnalysis from '../components/RigidBodyPlanarKinematicsAnalysis'
import FirstLawThermodynamicsAnalysis from '../components/FirstLawThermodynamicsAnalysis'
import FluidStaticsBernoulliAnalysis from '../components/FluidStaticsBernoulliAnalysis'
import PipeFlowHeatTransferAnalysis from '../components/PipeFlowHeatTransferAnalysis'
import { SLICE_REGISTRY as REG_0 } from './slices/statics-machine.registry'
import { SLICE_REGISTRY as REG_1 } from './slices/dynamics-controls.registry'
import { SLICE_REGISTRY as REG_2 } from './slices/fluids.registry'
import { SLICE_REGISTRY as REG_3 } from './slices/robotics.registry'
import { SLICE_REGISTRY as REG_4 } from './slices/materials-mfg.registry'
import { SLICE_REGISTRY as REG_5 } from './slices/thermal.registry'

const WAVE2_REGISTRIES = import.meta.glob<{ SLICE_REGISTRY: Record<string, { Concept: ComponentType; Playground: ComponentType }> }>(
  './slices/wave2/*.registry.tsx',
  { eager: true },
)

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
  'failure-theories': {
    Concept: FailureTheoriesConcept,
    Playground: FailureTheoriesAnalysis,
  },
  'fatigue-analysis': {
    Concept: FatigueAnalysisConcept,
    Playground: FatigueAnalysis,
  },
  'shaft-design': {
    Concept: ShaftDesignConcept,
    Playground: ShaftDesignAnalysis,
  },
  'spring-design': {
    Concept: SpringDesignConcept,
    Playground: SpringDesignAnalysis,
  },
  'bolted-joints': {
    Concept: BoltedJointsConcept,
    Playground: BoltedJointsAnalysis,
  },
  'bearing-selection': {
    Concept: BearingSelectionConcept,
    Playground: BearingSelectionAnalysis,
  },
  'particle-kinematics': {
    Concept: ParticleKinematicsConcept,
    Playground: ParticleKinematicsAnalysis,
  },
  'newton-work-energy': {
    Concept: NewtonWorkEnergyConcept,
    Playground: NewtonWorkEnergyAnalysis,
  },
  'rigid-body-planar-kinematics': {
    Concept: RigidBodyPlanarKinematicsConcept,
    Playground: RigidBodyPlanarKinematicsAnalysis,
  },
  'first-law-thermodynamics': {
    Concept: FirstLawThermodynamicsConcept,
    Playground: FirstLawThermodynamicsAnalysis,
  },
  'fluid-statics-bernoulli': {
    Concept: FluidStaticsBernoulliConcept,
    Playground: FluidStaticsBernoulliAnalysis,
  },
  'pipe-flow-heat-transfer': {
    Concept: PipeFlowHeatTransferConcept,
    Playground: PipeFlowHeatTransferAnalysis,
  },
  ...REG_0,
  ...REG_1,
  ...REG_2,
  ...REG_3,
  ...REG_4,
  ...REG_5,
  // Wave-2: any slices/wave2/*.registry.tsx exporting SLICE_REGISTRY is merged in.
  ...Object.assign({}, ...Object.values(WAVE2_REGISTRIES).map((m) => m.SLICE_REGISTRY)),
}
