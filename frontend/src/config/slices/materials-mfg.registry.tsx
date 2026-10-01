import type { ComponentType } from 'react'
import MetalCuttingConcept from '../../components/concepts/MetalCuttingConcept'
import MaterialSelectionConcept from '../../components/concepts/MaterialSelectionConcept'
import PhaseDiagramLeverRuleConcept from '../../components/concepts/PhaseDiagramLeverRuleConcept'
import SheetMetalBendingConcept from '../../components/concepts/SheetMetalBendingConcept'
import ToleranceStackupConcept from '../../components/concepts/ToleranceStackupConcept'
import MetalCuttingAnalysis from '../../components/MetalCuttingAnalysis'
import MaterialSelectionAnalysis from '../../components/MaterialSelectionAnalysis'
import PhaseDiagramLeverRuleAnalysis from '../../components/PhaseDiagramLeverRuleAnalysis'
import SheetMetalBendingAnalysis from '../../components/SheetMetalBendingAnalysis'
import ToleranceStackupAnalysis from '../../components/ToleranceStackupAnalysis'

export const SLICE_REGISTRY: Record<string, { Concept: ComponentType; Playground: ComponentType }> = {
  'metal-cutting': { Concept: MetalCuttingConcept, Playground: MetalCuttingAnalysis },
  'material-selection': { Concept: MaterialSelectionConcept, Playground: MaterialSelectionAnalysis },
  'phase-diagram-lever-rule': { Concept: PhaseDiagramLeverRuleConcept, Playground: PhaseDiagramLeverRuleAnalysis },
  'sheet-metal-bending': { Concept: SheetMetalBendingConcept, Playground: SheetMetalBendingAnalysis },
  'tolerance-stackup': { Concept: ToleranceStackupConcept, Playground: ToleranceStackupAnalysis },
}
