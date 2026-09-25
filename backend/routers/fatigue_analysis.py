"""Fatigue Analysis (S-N Curves & the Modified Goodman Diagram) API routes"""

from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from simmec_engine.topics.fatigue_analysis import compute_fatigue_analysis

router = APIRouter(prefix="/api/fatigue-analysis", tags=["fatigue-analysis"])


class FatigueAnalysisRequest(BaseModel):
    """Request model for fatigue (modified Goodman diagram) analysis"""
    mean_stress: float
    alternating_stress: float
    ultimate_strength: float
    endurance_limit: float
    fatigue_strength_coefficient: Optional[float] = None
    fatigue_strength_exponent: Optional[float] = None


class GoodmanPoint(BaseModel):
    mean_stress: float
    alternating_stress: float


class FatigueAnalysisResponse(BaseModel):
    """Response model for fatigue (modified Goodman diagram) analysis"""
    mean_stress: float
    alternating_stress: float
    ultimate_strength: float
    endurance_limit: float
    safety_factor: float
    is_safe: bool
    life_regime: str
    cycles_to_failure: Optional[float]
    equivalent_reversed_stress: Optional[float]
    intersection_point: GoodmanPoint
    goodman_line: list[GoodmanPoint]
    load_line: list[GoodmanPoint]


@router.post("/compute", response_model=FatigueAnalysisResponse)
async def compute_fatigue_analysis_endpoint(request: FatigueAnalysisRequest):
    """
    Compute the modified-Goodman fatigue safety factor for a part under
    fluctuating stress.

    Given a mean stress sigma_m, an alternating stress sigma_a, and a
    material's ultimate strength S_ut and endurance limit S_e, compute:
    - The Goodman safety factor n = 1 / (sigma_a/S_e + sigma_m/S_ut)
    - Whether the stress state falls inside (safe) or outside (unsafe)
      the Goodman line
    - The point where the load line (origin through the current stress
      state) crosses the Goodman line, for plotting
    - If sigma_f' and b are supplied and the point lies outside the
      Goodman line, an illustrative Basquin-equation estimate of cycles
      to failure; otherwise "infinite life" (or a static-failure flag if
      sigma_m alone already exceeds S_ut)
    """
    try:
        result = compute_fatigue_analysis(
            mean_stress=request.mean_stress,
            alternating_stress=request.alternating_stress,
            ultimate_strength=request.ultimate_strength,
            endurance_limit=request.endurance_limit,
            fatigue_strength_coefficient=request.fatigue_strength_coefficient,
            fatigue_strength_exponent=request.fatigue_strength_exponent,
        )
        return FatigueAnalysisResponse(**result)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")
