"""Phase Diagram & Lever Rule API routes (Fe-C steels + generic tie line)"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from simmec_engine.topics.phase_diagram_lever_rule import (
    compute_phase_diagram,
    compute_tie_line,
)

router = APIRouter(prefix="/api/phase-diagram-lever-rule", tags=["phase-diagram-lever-rule"])


class PhaseDiagramRequest(BaseModel):
    """Request model for slow-cooled plain-carbon steel"""
    carbon: float


class PhaseDiagramResponse(BaseModel):
    carbon: float
    steel_class: str
    ferrite_fraction: float
    cementite_fraction: float
    proeutectoid_name: str
    proeutectoid_fraction: float
    pearlite_fraction: float
    ferrite_in_pearlite: float
    eutectoid_temperature: float


class TieLineRequest(BaseModel):
    """Request model for a generic binary tie line (phase A low, phase B high)"""
    overall: float
    phase_a_composition: float
    phase_b_composition: float


class TieLineResponse(BaseModel):
    overall: float
    phase_a_composition: float
    phase_b_composition: float
    fraction_a: float
    fraction_b: float


@router.post("/compute", response_model=PhaseDiagramResponse)
async def compute_phase_diagram_endpoint(request: PhaseDiagramRequest):
    """
    Lever-rule analysis of a slow-cooled Fe-C steel (0 < C0 <= 2.14 wt% C):
    total ferrite/cementite just below 727 C, and the proeutectoid
    phase / pearlite microconstituent split.
    """
    try:
        return PhaseDiagramResponse(**compute_phase_diagram(request.carbon))

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")


@router.post("/tie-line", response_model=TieLineResponse)
async def compute_tie_line_endpoint(request: TieLineRequest):
    """Generic lever rule: phase fractions from alloy and tie-line end compositions."""
    try:
        return TieLineResponse(
            **compute_tie_line(
                request.overall,
                request.phase_a_composition,
                request.phase_b_composition,
            )
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")
