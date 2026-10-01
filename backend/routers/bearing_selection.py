"""Rolling-Element Bearing Selection: L10 Life API routes"""

from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from simmec_engine.topics.bearing_selection import compute_bearing_selection

router = APIRouter(prefix="/api/bearing-selection", tags=["bearing-selection"])


class BearingSelectionRequest(BaseModel):
    """Request model for bearing L10 life analysis.

    Units: dynamic_load_rating and applied_load are both in kN (only
    their ratio matters, so any consistent unit works). shaft_speed is
    in rpm.
    """
    mode: str = "life"  # "life" | "required_rating"
    bearing_type: str  # "ball" | "roller"
    applied_load: float
    shaft_speed: float
    dynamic_load_rating: Optional[float] = None  # required when mode == "life"
    target_life_hours: Optional[float] = None  # required when mode == "required_rating"


class LoadCurvePoint(BaseModel):
    load_ratio: float
    L10: float


class BearingSelectionResponse(BaseModel):
    """Response model for bearing L10 life analysis"""
    mode: str
    bearing_type: str
    life_exponent: float
    dynamic_load_rating: float
    applied_load: float
    shaft_speed: float
    load_ratio: float
    L10: float
    L10_hours: float
    L10_years_typical_duty: float
    required_dynamic_load_rating: Optional[float] = None
    load_curve: list[LoadCurvePoint]


@router.post("/compute", response_model=BearingSelectionResponse)
async def compute_bearing_selection_endpoint(request: BearingSelectionRequest):
    """
    Compute the L10 fatigue life of a rolling-element bearing, or
    back-solve for the minimum catalog dynamic load rating needed to
    reach a target service life.

    Given the catalog dynamic load rating C, the equivalent applied
    radial load P, the bearing type (ball -> k=3, roller -> k=10/3), and
    the shaft speed n:
    - L10 life in millions of revolutions (L10 = (C / P)^k)
    - L10 life in operating hours (L10h = L10 * 10^6 / (60 n))
    - An illustrative years-of-service figure at a typical 8h/day,
      5-day/week duty cycle
    - When mode == "required_rating", the minimum dynamic load rating C
      needed to reach a target_life_hours
    - A set of (load ratio C/P, L10) points tracing the power-law life
      curve, for visualizing how steeply life falls off as load
      approaches the rating
    """
    try:
        result = compute_bearing_selection(
            mode=request.mode,
            bearing_type=request.bearing_type,
            applied_load=request.applied_load,
            shaft_speed=request.shaft_speed,
            dynamic_load_rating=request.dynamic_load_rating,
            target_life_hours=request.target_life_hours,
        )
        return BearingSelectionResponse(**result)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")
