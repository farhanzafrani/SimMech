"""Beam Deflection API routes"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from simmec_engine.topics.beam_deflection import compute_beam_deflection

router = APIRouter(prefix="/api/beam-deflection", tags=["beam-deflection"])


class BeamDeflectionRequest(BaseModel):
    """Request model for beam deflection analysis"""
    length: float
    load_kn: float
    position_pct: float
    height_mm: float
    youngs_modulus: float
    yield_stress: float
    width_mm: float = 100.0


class DeflectionCurvePoint(BaseModel):
    x: float
    y_mm: float


class BeamDeflectionResponse(BaseModel):
    """Response model for beam deflection analysis"""
    length: float
    load_kn: float
    position_pct: float
    height_mm: float
    width_mm: float
    reaction_a_kn: float
    reaction_b_kn: float
    max_moment_knm: float
    moment_of_inertia: float
    max_bending_stress: float
    deflection_under_load_mm: float
    max_deflection_mm: float
    max_deflection_location_m: float
    deflection_limit_mm: float
    safety_factor: float
    strength_ok: bool
    stiffness_ok: bool
    deflection_curve: list[DeflectionCurvePoint]
    properties: dict


@router.post("/compute", response_model=BeamDeflectionResponse)
async def compute_beam_deflection_endpoint(request: BeamDeflectionRequest):
    """
    Compute reactions, bending stress, and the deflected shape for a simply
    supported beam under a single point load.

    Given span, load, load position, section depth (width fixed by
    default), and material properties, compute:
    - Support reactions (RA = Pb/L, RB = Pa/L)
    - Maximum bending moment and stress (sigma_max = M c / I)
    - Deflection under the load and the true maximum deflection
    - Strength check (safety factor vs yield, need >= 1.5) and stiffness
      check (max deflection vs the L/360 code limit)
    - The full deflected shape as a point list for plotting
    """
    try:
        result = compute_beam_deflection(
            length=request.length,
            load_kn=request.load_kn,
            position_pct=request.position_pct,
            height_mm=request.height_mm,
            youngs_modulus=request.youngs_modulus,
            yield_stress=request.yield_stress,
            width_mm=request.width_mm,
        )
        return BeamDeflectionResponse(**result)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")
