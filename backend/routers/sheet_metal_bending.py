"""Sheet-Metal Bending API routes (bend allowance, bend force, springback)"""

from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from simmec_engine.topics.sheet_metal_bending import compute_sheet_metal_bending

router = APIRouter(prefix="/api/sheet-metal-bending", tags=["sheet-metal-bending"])


class SheetMetalBendingRequest(BaseModel):
    """Request model for a single sheet-metal bend"""
    thickness: float
    inner_radius: float
    bend_angle: float
    k_factor: float
    flange_a: float
    flange_b: float
    yield_strength: float
    youngs_modulus: float
    ultimate_strength: float
    die_opening: float
    bend_length: float


class SheetMetalBendingResponse(BaseModel):
    bend_allowance: float
    outside_setback: float
    bend_deduction: float
    flat_length: float
    bend_force: float
    neutral_radius: float
    springback_parameter: float
    fully_elastic: bool
    springback_factor: float
    tool_angle: Optional[float] = None
    springback_angle: Optional[float] = None
    final_neutral_radius: Optional[float] = None
    thickness: float
    inner_radius: float
    bend_angle: float
    radius_to_thickness: float


@router.post("/compute", response_model=SheetMetalBendingResponse)
async def compute_sheet_metal_bending_endpoint(request: SheetMetalBendingRequest):
    """
    Compute bend allowance, bend deduction, flat-pattern length, V-die
    bending force, and elastic springback (with the overbend tool angle
    needed to hit the target angle).

    - BA = theta (r + K t); BD = 2 (r + t) tan(theta/2) - BA
    - F = 1.33 UTS L t^2 / W
    - R_i / R_f = 4x^3 - 3x + 1, x = R_i Y / (E t)
    """
    try:
        result = compute_sheet_metal_bending(**request.model_dump())
        return SheetMetalBendingResponse(**result)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")
