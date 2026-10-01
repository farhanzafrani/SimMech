"""Shear Force & Bending Moment Diagrams API routes"""

from typing import Literal

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from simmec_engine.topics.shear_bending import compute_shear_moment

router = APIRouter(prefix="/api/shear-bending", tags=["shear-bending"])


class ShearBendingRequest(BaseModel):
    """Request model for shear/moment diagram analysis"""
    length: float
    load_type: Literal['point', 'udl']
    magnitude: float
    position_frac: float = 0.5


class DiagramPoint(BaseModel):
    x: float
    shear: float
    moment: float


class ShearBendingResponse(BaseModel):
    """Response model for shear/moment diagram analysis"""
    length: float
    load_type: str
    magnitude: float
    position_frac: float
    reaction_a: float
    reaction_b: float
    v_max: float
    v_max_location: float
    m_max: float
    m_max_location: float
    distribution: list[DiagramPoint]


@router.post("/compute", response_model=ShearBendingResponse)
async def compute_shear_bending_endpoint(request: ShearBendingRequest):
    """
    Compute support reactions and the V(x)/M(x) diagrams for a simply
    supported beam under a point load or a uniformly distributed load.
    """
    try:
        result = compute_shear_moment(
            length=request.length,
            load_type=request.load_type,
            magnitude=request.magnitude,
            position_frac=request.position_frac,
        )
        return ShearBendingResponse(**result)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")
