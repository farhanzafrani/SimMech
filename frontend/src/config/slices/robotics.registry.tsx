import type { ComponentType } from 'react'
import RoboticsForwardKinematicsConcept from '../../components/concepts/RoboticsForwardKinematicsConcept'
import RoboticsInverseKinematicsConcept from '../../components/concepts/RoboticsInverseKinematicsConcept'
import RoboticsJacobianConcept from '../../components/concepts/RoboticsJacobianConcept'
import RoboticsTransformsConcept from '../../components/concepts/RoboticsTransformsConcept'
import RoboticsMotorGearheadConcept from '../../components/concepts/RoboticsMotorGearheadConcept'
import ForwardKinematics2R from '../../components/robotics/ForwardKinematics2R'
import InverseKinematics2R from '../../components/robotics/InverseKinematics2R'
import JacobianManipulability from '../../components/robotics/JacobianManipulability'
import RotationHomogeneous from '../../components/robotics/RotationHomogeneous'
import MotorGearheadSizing from '../../components/robotics/MotorGearheadSizing'

export const SLICE_REGISTRY: Record<string, { Concept: ComponentType; Playground: ComponentType }> = {
  'forward-kinematics-2r': { Concept: RoboticsForwardKinematicsConcept, Playground: ForwardKinematics2R },
  'inverse-kinematics-2r': { Concept: RoboticsInverseKinematicsConcept, Playground: InverseKinematics2R },
  'jacobian-manipulability': { Concept: RoboticsJacobianConcept, Playground: JacobianManipulability },
  'rotation-homogeneous-transforms': { Concept: RoboticsTransformsConcept, Playground: RotationHomogeneous },
  'dc-motor-gearhead-sizing': { Concept: RoboticsMotorGearheadConcept, Playground: MotorGearheadSizing },
}
