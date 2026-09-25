"""Combined Loading & Mohr's Circle API routes"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from simmec_engine.topics.mohrs_circle import compute_mohrs_circle

router = APIRouter(prefix="/api/mohrs-circle", tags=["mohrs-circle"])


class MohrsCircleRequest(BaseModel):
    """Request model for Mohr's circle analysis"""
    sigma_x: float
    sigma_y: float
    tau_xy: float


class CirclePoint(BaseModel):
    sigma: float
    tau: float


class MohrsCircleResponse(BaseModel):
    """Response model for Mohr's circle analysis"""
    sigma_x: float
    sigma_y: float
    tau_xy: float
    sigma_avg: float
    radius: float
    sigma_1: float
    sigma_2: float
    theta_p_deg: float
    max_shear: float
    circle_points: list[CirclePoint]
    point_x: CirclePoint
    point_y: CirclePoint


@router.post("/compute", response_model=MohrsCircleResponse)
async def compute_mohrs_circle_endpoint(request: MohrsCircleRequest):
    """
    Compute Mohr's circle for a 2D stress state (σ_x, σ_y, τ_xy):
    - Center σ_avg and radius R
    - Principal stresses σ_1, σ_2 = σ_avg ± R
    - Principal angle θ_p
    - Sample points around the circle for plotting
    """
    try:
        result = compute_mohrs_circle(
            sigma_x=request.sigma_x,
            sigma_y=request.sigma_y,
            tau_xy=request.tau_xy,
        )
        return MohrsCircleResponse(**result)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")
