import type { ComponentType } from 'react'
import SecondLawConcept from '../../components/concepts/SecondLawConcept'
import SecondLawAnalysis from '../../components/SecondLawAnalysis'
import PowerCyclesConcept from '../../components/concepts/PowerCyclesConcept'
import PowerCyclesAnalysis from '../../components/PowerCyclesAnalysis'
import ConductionNetworksConcept from '../../components/concepts/ConductionNetworksConcept'
import ConductionNetworksAnalysis from '../../components/ConductionNetworksAnalysis'
import FinHeatTransferConcept from '../../components/concepts/FinHeatTransferConcept'
import FinHeatTransferAnalysis from '../../components/FinHeatTransferAnalysis'
import TransientLumpedConcept from '../../components/concepts/TransientLumpedConcept'
import TransientLumpedAnalysis from '../../components/TransientLumpedAnalysis'
import ConvectionHeatExchangersConcept from '../../components/concepts/ConvectionHeatExchangersConcept'
import ConvectionHeatExchangersAnalysis from '../../components/ConvectionHeatExchangersAnalysis'

export const SLICE_REGISTRY: Record<string, { Concept: ComponentType; Playground: ComponentType }> = {
  'second-law-entropy': { Concept: SecondLawConcept, Playground: SecondLawAnalysis },
  'rankine-brayton-cycles': { Concept: PowerCyclesConcept, Playground: PowerCyclesAnalysis },
  'conduction-resistance-networks': { Concept: ConductionNetworksConcept, Playground: ConductionNetworksAnalysis },
  'fins-extended-surfaces': { Concept: FinHeatTransferConcept, Playground: FinHeatTransferAnalysis },
  'transient-lumped-capacitance': { Concept: TransientLumpedConcept, Playground: TransientLumpedAnalysis },
  'forced-convection-heat-exchangers': { Concept: ConvectionHeatExchangersConcept, Playground: ConvectionHeatExchangersAnalysis },
}
