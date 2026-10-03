"""Fluid Statics & Bernoulli's Equation API routes"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from simmec_engine.topics.fluid_statics_bernoulli import compute_fluid_statics_bernoulli

router = APIRouter(prefix="/api/fluid-statics-bernoulli", tags=["fluid-statics-bernoulli"])


class FluidStaticsBernoulliRequest(BaseModel):
    """Request model for the Venturi-effect analysis.

    Units: density in kg/m^3, area1/area2 in m^2, velocity1 in m/s,
    pressure1 in Pa.
    """
    density: float
    area1: float
    area2: float
    velocity1: float
    pressure1: float


class PressureCurvePoint(BaseModel):
    area_ratio: float
    pressure2: float


class FluidStaticsBernoulliResponse(BaseModel):
    """Response model for the Venturi-effect analysis"""
    density: float
    area1: float
    area2: float
    velocity1: float
    pressure1: float
    velocity2: float
    pressure2: float
    dynamic_pressure_change: float
    curve: list[PressureCurvePoint]


@router.post("/compute", response_model=FluidStaticsBernoulliResponse)
async def compute_fluid_statics_bernoulli_endpoint(request: FluidStaticsBernoulliRequest):
    """
    Compute the downstream velocity and pressure at a pipe constriction
    using continuity (mass conservation) and Bernoulli's equation for a
    horizontal, incompressible, inviscid flow.

    - v2 = v1 * A1 / A2 (continuity)
    - p2 = p1 + 0.5 rho (v1^2 - v2^2) (Bernoulli)
    - curve: p2 vs. area ratio A2/A1 at the same upstream conditions,
      showing how sharply pressure drops as the constriction narrows
    """
    try:
        result = compute_fluid_statics_bernoulli(
            density=request.density,
            area1=request.area1,
            area2=request.area2,
            velocity1=request.velocity1,
            pressure1=request.pressure1,
        )
        return FluidStaticsBernoulliResponse(**result)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")
