"""Root Locus & Routh-Hurwitz Stability API routes"""

from typing import List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from simmec_engine.topics.root_locus_routh import compute_root_locus

router = APIRouter(prefix="/api/root-locus-stability", tags=["root-locus-stability"])


class RootLocusRequest(BaseModel):
    """Request model for L(s) = K / (s (s+a)(s+b))"""
    pole_a: float
    pole_b: float
    gain: float


class ComplexPoint(BaseModel):
    re: float
    im: float


class RouthRow(BaseModel):
    power: int
    row: List[float]


class RootLocusResponse(BaseModel):
    """Response model for root locus / Routh analysis"""
    pole_a: float
    pole_b: float
    gain: float
    closed_loop_poles: List[ComplexPoint]
    routh_array: List[RouthRow]
    sign_changes: int
    rhp_poles: int
    critical_gain: float
    crossing_frequency: float
    breakaway_point: Optional[float] = None
    breakaway_gain: Optional[float] = None
    asymptote_centroid: float
    asymptote_angles_deg: List[float]
    status: str
    dominant_damping_ratio: Optional[float] = None
    dominant_wn: float
    locus_gains: List[float]
    locus_branches: List[List[ComplexPoint]]


@router.post("/compute", response_model=RootLocusResponse)
async def compute_root_locus_endpoint(request: RootLocusRequest):
    """
    Closed-loop poles, Routh array and root locus of
    s^3 + (a+b) s^2 + ab s + K = 0 (unity feedback around K/(s(s+a)(s+b))).
    """
    try:
        result = compute_root_locus(
            pole_a=request.pole_a,
            pole_b=request.pole_b,
            gain=request.gain,
        )
        return RootLocusResponse(**result)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")
