"""Spur Gear Tooth Bending (Lewis) API routes"""

from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from simmec_engine.topics.gear_tooth_bending import compute_gear_tooth_bending

router = APIRouter(prefix="/api/gear-tooth-bending", tags=["gear-tooth-bending"])


class GearToothBendingRequest(BaseModel):
    """Request model for Lewis tooth-root bending stress"""
    teeth: float
    diametral_pitch: float
    face_width: float
    torque: float
    speed_rpm: float = 0.0
    allowable_stress: Optional[float] = None


class GearToothBendingResponse(BaseModel):
    """Response model for Lewis tooth-root bending stress"""
    teeth: float
    diametral_pitch: float
    face_width: float
    torque: float
    pitch_diameter: float
    tangential_load: float
    lewis_factor: float
    lewis_stress: float
    pitch_line_velocity: float
    velocity_factor: float
    dynamic_stress: float
    safety_factor: Optional[float] = None


@router.post("/compute", response_model=GearToothBendingResponse)
async def compute_gear_tooth_bending_endpoint(request: GearToothBendingRequest):
    """
    Compute the Lewis bending stress at the root of a spur gear tooth.

    Pitch diameter d = N / Pd, tangential load Wt = 2T / d, then
    sigma = Wt Pd / (F Y) with Y interpolated from the standard 20-degree
    full-depth Lewis table. If a speed is given, a velocity factor
    Kv = (1200 + V) / 1200 gives a dynamic-corrected stress. Fewer than 12
    teeth is rejected (undercutting).
    """
    try:
        result = compute_gear_tooth_bending(**request.model_dump())
        return GearToothBendingResponse(**result)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")
