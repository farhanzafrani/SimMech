"""PID Control & Tuning API routes"""

from typing import List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from simmec_engine.topics.pid_tuning import compute_pid_tuning

router = APIRouter(prefix="/api/pid-tuning", tags=["pid-tuning"])


class PidTuningRequest(BaseModel):
    """Request model for a PID loop around a FOPDT process"""
    plant_gain: float
    plant_tau: float
    plant_delay: float
    kp: float
    ti: Optional[float] = None
    td: float = 0.0
    t_end: float = 60.0


class ZnTuning(BaseModel):
    Kp: float
    Ti: Optional[float] = None
    Td: float


class PidTuningResponse(BaseModel):
    """Response model for PID tuning"""
    time_series: List[float]
    output_series: List[float]
    control_series: List[float]
    overshoot_percent: Optional[float] = None
    rise_time: Optional[float] = None
    settling_time: Optional[float] = None
    steady_state_error: Optional[float] = None
    iae: Optional[float] = None
    is_stable: bool
    ki: float
    kd: float
    zn_pid: Optional[ZnTuning] = None


@router.post("/compute", response_model=PidTuningResponse)
async def compute_pid_tuning_endpoint(request: PidTuningRequest):
    """
    Simulate the unit-step setpoint response of a PID controller around
    G(s) = K e^(-theta s)/(tau s + 1), and return overshoot, rise time,
    settling time, IAE, plus the Ziegler-Nichols open-loop PID suggestion.
    """
    try:
        result = compute_pid_tuning(
            plant_gain=request.plant_gain,
            plant_tau=request.plant_tau,
            plant_delay=request.plant_delay,
            kp=request.kp,
            ti=request.ti,
            td=request.td,
            t_end=request.t_end,
        )
        return PidTuningResponse(**result)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")
