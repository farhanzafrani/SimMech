"""Torsion in Circular Shafts API routes"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from simmec_engine.topics.mechanics import compute_torsion

router = APIRouter(prefix="/api/torsion", tags=["torsion"])


class TorsionRequest(BaseModel):
    """Request model for torsion analysis"""
    torque: float
    diameter: float
    length: float
    youngs_modulus: float
    poisson_ratio: float
    yield_stress: float


class TorsionDistributionPoint(BaseModel):
    radius_mm: float
    shear_stress: float


class TorsionResponse(BaseModel):
    """Response model for torsion analysis"""
    torque: float
    diameter: float
    length: float
    max_shear_stress: float
    shear_modulus: float
    polar_moment: float
    angle_of_twist_deg: float
    angle_of_twist_rad: float
    shear_yield_stress: float
    safety_factor: float
    distribution: list[TorsionDistributionPoint]
    properties: dict


@router.post("/compute", response_model=TorsionResponse)
async def compute_torsion_endpoint(request: TorsionRequest):
    """
    Compute shear stress distribution and angle of twist for a solid
    circular shaft in torsion.

    Given applied torque and shaft/material properties, compute:
    - Maximum shear stress at the outer surface (τ_max = 16T / πd³)
    - Angle of twist (θ = TL / GJ)
    - Safety factor against shear yield (Tresca: τ_yield = σ_y / 2)
    - The radial shear-stress distribution τ(r) = Tr / J
    """
    try:
        result = compute_torsion(
            torque=request.torque,
            diameter=request.diameter,
            length=request.length,
            youngs_modulus=request.youngs_modulus,
            poisson_ratio=request.poisson_ratio,
            yield_stress=request.yield_stress,
        )
        return TorsionResponse(**result)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")
