"""Columns & Buckling API routes"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from simmec_engine.topics.buckling import compute_buckling

router = APIRouter(prefix="/api/buckling", tags=["buckling"])


class BucklingRequest(BaseModel):
    """Request model for column buckling analysis"""
    length: float
    end_condition: str
    youngs_modulus: float
    width: float
    height: float
    applied_load: float


class ModeShapePoint(BaseModel):
    x: float
    y: float


class BucklingResponse(BaseModel):
    """Response model for column buckling analysis"""
    length: float
    end_condition: str
    width: float
    height: float
    applied_load: float
    moment_of_inertia: float
    area: float
    radius_of_gyration: float
    slenderness_ratio: float
    critical_load: float
    safety_factor: float
    mode_shape: list[ModeShapePoint]


@router.post("/compute", response_model=BucklingResponse)
async def compute_buckling_endpoint(request: BucklingRequest):
    """
    Compute the Euler critical buckling load for a slender rectangular
    column.

    Given column length, end condition, cross-section, and applied load:
    - Weak-axis second moment of area and radius of gyration
    - Slenderness ratio (K L / r)
    - Euler critical load (P_cr = pi^2 E I / (K L)^2)
    - Safety factor against buckling
    - A schematic buckled mode-shape curve for visualization
    """
    try:
        result = compute_buckling(
            length=request.length,
            end_condition=request.end_condition,
            youngs_modulus=request.youngs_modulus,
            width=request.width,
            height=request.height,
            applied_load=request.applied_load,
        )
        return BucklingResponse(**result)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")
