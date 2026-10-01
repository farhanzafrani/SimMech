"""Helical Compression Spring Design API routes"""

from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from simmec_engine.topics.spring_design import compute_spring_design

router = APIRouter(prefix="/api/spring-design", tags=["spring-design"])


class SpringDesignRequest(BaseModel):
    """Request model for helical compression spring analysis"""
    wire_diameter: float
    coil_diameter: float
    active_coils: float
    shear_modulus: float
    applied_force: float
    allowable_shear_stress: Optional[float] = None


class SpringDesignResponse(BaseModel):
    """Response model for helical compression spring analysis"""
    wire_diameter: float
    coil_diameter: float
    active_coils: float
    applied_force: float
    spring_index: float
    wahl_factor: float
    spring_rate: float
    deflection: float
    max_shear_stress: float
    is_practical_range: bool
    safety_factor: Optional[float] = None
    properties: dict


@router.post("/compute", response_model=SpringDesignResponse)
async def compute_spring_design_endpoint(request: SpringDesignRequest):
    """
    Compute the spring rate, spring index, Wahl factor, and corrected
    shear stress for a round-wire helical compression spring.

    Given wire diameter, mean coil diameter, active coil count, wire
    shear modulus, and applied axial force, compute:
    - Spring index (C = D / d)
    - Wahl correction factor (K_w), which corrects the plain torsion-bar
      shear-stress formula for direct shear and coil curvature
    - Spring rate (k = G d^4 / (8 D^3 N))
    - Deflection under load (delta = F / k)
    - Corrected maximum shear stress (tau = K_w * 8 F D / (pi d^3))
    - Safety factor against an optional allowable shear stress

    A spring index outside the practical 4-12 range is not rejected —
    the physics remains well-defined — but is flagged via
    `is_practical_range` so the frontend can warn the student instead of
    blocking the calculation. The only rejected input is a coil diameter
    that does not exceed the wire diameter (C <= 1), which cannot be
    physically coiled.
    """
    try:
        result = compute_spring_design(
            wire_diameter=request.wire_diameter,
            coil_diameter=request.coil_diameter,
            active_coils=request.active_coils,
            shear_modulus=request.shear_modulus,
            applied_force=request.applied_force,
            allowable_shear_stress=request.allowable_shear_stress,
        )
        return SpringDesignResponse(**result)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")
