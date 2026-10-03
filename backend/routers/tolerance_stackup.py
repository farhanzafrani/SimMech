"""Tolerance Stack-Up & ISO Fits API routes"""

from typing import List

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from simmec_engine.topics.tolerance_stackup import compute_iso_fit, compute_stackup

router = APIRouter(prefix="/api/tolerance-stackup", tags=["tolerance-stackup"])


class FitRequest(BaseModel):
    """Request model for an ISO 286 hole-basis fit"""
    nominal: float
    hole_grade: int
    shaft_letter: str
    shaft_grade: int


class FitResponse(BaseModel):
    nominal: float
    designation: str
    hole_tolerance_um: int
    shaft_tolerance_um: int
    hole_min: float
    hole_max: float
    shaft_min: float
    shaft_max: float
    shaft_es_um: int
    shaft_ei_um: int
    min_clearance: float
    max_clearance: float
    fit_type: str


class StackDimension(BaseModel):
    name: str
    nominal: float
    tolerance: float
    direction: int  # +1 increases the gap, -1 decreases it


class StackRequest(BaseModel):
    """Request model for a 1-D tolerance stack-up"""
    dimensions: List[StackDimension]
    required_min_gap: float = 0.0


class StackContribution(BaseModel):
    name: str
    tolerance: float
    rss_share: float


class StackResponse(BaseModel):
    nominal_gap: float
    worst_case: float
    worst_case_min: float
    worst_case_max: float
    rss: float
    rss_min: float
    rss_max: float
    required_min_gap: float
    worst_case_ok: bool
    rss_ok: bool
    probability_below_min: float
    contributions: List[StackContribution]


@router.post("/fit", response_model=FitResponse)
async def compute_fit_endpoint(request: FitRequest):
    """
    ISO 286 hole-basis fit limits: hole H<grade> against a shaft
    (f, g, h, k, m, n, p) at the given IT grade, with min/max clearance
    and fit classification (clearance / transition / interference).
    """
    try:
        result = compute_iso_fit(
            request.nominal, request.hole_grade, request.shaft_letter, request.shaft_grade
        )
        return FitResponse(**result)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")


@router.post("/stack", response_model=StackResponse)
async def compute_stack_endpoint(request: StackRequest):
    """
    1-D tolerance stack: worst-case (sum of tolerances) vs RSS
    (root-sum-square) bounds on the gap, with the chance of the gap
    falling below a required minimum assuming +/-3 sigma bands.
    """
    try:
        result = compute_stackup(
            [d.model_dump() for d in request.dimensions], request.required_min_gap
        )
        return StackResponse(**result)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")
