"""Bending Stress in Beams API routes"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from simmec_engine.topics.bending_stress import compute_bending_stress

router = APIRouter(prefix="/api/bending-stress", tags=["bending-stress"])


class BendingStressRequest(BaseModel):
    """Request model for bending stress analysis"""
    moment: float
    width: float
    height: float


class BendingStressDistributionPoint(BaseModel):
    y_mm: float
    stress: float


class BendingStressResponse(BaseModel):
    """Response model for bending stress analysis"""
    moment: float
    width: float
    height: float
    second_moment: float
    c: float
    max_bending_stress: float
    distribution: list[BendingStressDistributionPoint]


@router.post("/compute", response_model=BendingStressResponse)
async def compute_bending_stress_endpoint(request: BendingStressRequest):
    """
    Compute bending stress distribution for a solid rectangular beam
    cross-section under an applied bending moment.

    Given moment and section width/height, compute:
    - Second moment of area (I = b h³ / 12)
    - Maximum bending stress at the outer fibers (σ_max = M c / I)
    - The linear through-thickness stress distribution σ(y) = M y / I
    """
    try:
        result = compute_bending_stress(
            moment=request.moment,
            width=request.width,
            height=request.height,
        )
        return BendingStressResponse(**result)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")
