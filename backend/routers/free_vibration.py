"""Free & Damped Vibration API routes"""

from typing import List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from simmec_engine.topics.free_vibration import compute_free_vibration

router = APIRouter(prefix="/api/free-vibration", tags=["free-vibration"])


class FreeVibrationRequest(BaseModel):
    """Request model for a single-DOF mass-spring-damper free response"""
    mass: float
    stiffness: float
    damping: float
    initial_displacement: float
    initial_velocity: float


class FreeVibrationResponse(BaseModel):
    """Response model for free vibration"""
    natural_frequency: float
    natural_frequency_hz: float
    critical_damping: float
    damping_ratio: float
    damped_frequency: Optional[float] = None
    period: Optional[float] = None
    log_decrement: Optional[float] = None
    amplitude_ratio_per_cycle: Optional[float] = None
    settling_time: Optional[float] = None
    regime: str
    time_series: List[float]
    displacement_series: List[float]
    envelope_series: Optional[List[float]] = None


@router.post("/compute", response_model=FreeVibrationResponse)
async def compute_free_vibration_endpoint(request: FreeVibrationRequest):
    """
    Solve m x'' + c x' + k x = 0 with given initial conditions.

    Returns wn = sqrt(k/m), zeta = c / (2 sqrt(k m)), wd = wn sqrt(1 - zeta^2),
    the damping regime, the logarithmic decrement, and x(t).
    """
    try:
        result = compute_free_vibration(
            mass=request.mass,
            stiffness=request.stiffness,
            damping=request.damping,
            initial_displacement=request.initial_displacement,
            initial_velocity=request.initial_velocity,
        )
        return FreeVibrationResponse(**result)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")
