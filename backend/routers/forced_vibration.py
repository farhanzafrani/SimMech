"""Forced Vibration, Resonance & Transmissibility API routes"""

from typing import List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from simmec_engine.topics.forced_vibration import compute_forced_vibration

router = APIRouter(prefix="/api/forced-vibration", tags=["forced-vibration"])


class ForcedVibrationRequest(BaseModel):
    """Request model for harmonically forced mass-spring-damper"""
    mass: float
    stiffness: float
    damping: float
    force_amplitude: float
    forcing_frequency: float


class ForcedVibrationResponse(BaseModel):
    """Response model for forced vibration"""
    natural_frequency: float
    natural_frequency_hz: float
    damping_ratio: float
    frequency_ratio: float
    static_deflection: float
    magnification: float
    amplitude: float
    phase_deg: float
    transmissibility: float
    force_transmitted: float
    peak_ratio: Optional[float] = None
    peak_magnification: Optional[float] = None
    in_isolation_region: bool
    near_resonance: bool
    r_series: List[float]
    magnification_series: List[float]
    transmissibility_series: List[float]
    phase_series: List[float]


@router.post("/compute", response_model=ForcedVibrationResponse)
async def compute_forced_vibration_endpoint(request: ForcedVibrationRequest):
    """
    Steady-state response of m x'' + c x' + k x = F0 sin(w t).

    Returns the magnification factor, amplitude, phase lag, and the
    transmissibility TR = sqrt(1 + (2 zeta r)^2) / sqrt((1 - r^2)^2 + (2 zeta r)^2).
    An undamped system forced exactly at r = 1 is rejected (unbounded).
    """
    try:
        result = compute_forced_vibration(
            mass=request.mass,
            stiffness=request.stiffness,
            damping=request.damping,
            force_amplitude=request.force_amplitude,
            forcing_frequency=request.forcing_frequency,
        )
        return ForcedVibrationResponse(**result)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")
