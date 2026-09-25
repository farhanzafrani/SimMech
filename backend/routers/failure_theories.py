"""Failure Theories: Von Mises & Tresca API routes"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from simmec_engine.topics.failure_theories import compute_failure_theories

router = APIRouter(prefix="/api/failure-theories", tags=["failure-theories"])


class FailureTheoriesRequest(BaseModel):
    """Request model for failure theories analysis"""
    sigma_x: float
    sigma_y: float
    tau_xy: float
    yield_stress: float


class EnvelopePoint(BaseModel):
    sigma_1: float
    sigma_2: float


class FailureTheoriesResponse(BaseModel):
    """Response model for failure theories analysis"""
    sigma_x: float
    sigma_y: float
    tau_xy: float
    yield_stress: float
    sigma_1: float
    sigma_2: float
    sigma_3: float
    von_mises_stress: float
    tresca_stress: float
    max_shear_stress: float
    safety_factor_von_mises: float
    safety_factor_tresca: float
    governing_theory: str
    design_point: EnvelopePoint
    von_mises_ellipse: list[EnvelopePoint]
    tresca_hexagon: list[EnvelopePoint]


@router.post("/compute", response_model=FailureTheoriesResponse)
async def compute_failure_theories_endpoint(request: FailureTheoriesRequest):
    """
    Compute von Mises and Tresca failure predictions for a 2D (plane-stress)
    stress state (σ_x, σ_y, τ_xy) against a given yield stress.

    Given the stress state and material yield strength, compute:
    - In-plane principal stresses σ_1, σ_2 (and the implicit out-of-plane σ_3 = 0)
    - Von Mises effective stress σ' = √(σ1² − σ1σ2 + σ2²)
    - Tresca effective stress σ1 − σ3 (using the true max/min of all three
      principal stresses, since the out-of-plane stress can be the extreme)
    - Factor of safety against yield under each theory
    - Normalized (σ1/σy, σ2/σy) points tracing the von Mises ellipse and the
      Tresca hexagon, plus the current design point, for the classic
      failure-envelope comparison plot
    """
    try:
        result = compute_failure_theories(
            sigma_x=request.sigma_x,
            sigma_y=request.sigma_y,
            tau_xy=request.tau_xy,
            yield_stress=request.yield_stress,
        )
        return FailureTheoriesResponse(**result)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")
