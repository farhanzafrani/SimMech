"""First/Second-Order Step Response API routes"""

from typing import List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from simmec_engine.topics.step_response import compute_step_response

router = APIRouter(prefix="/api/step-response", tags=["step-response"])


class StepResponseRequest(BaseModel):
    """Request model for a first- or second-order unit-step response"""
    order: int
    gain: float
    time_constant: float = 1.0
    natural_frequency: float = 1.0
    damping_ratio: float = 0.5


class PolePoint(BaseModel):
    re: float
    im: float


class StepResponseResponse(BaseModel):
    """Response model for step response"""
    order: int
    gain: float
    final_value: float
    poles: List[PolePoint]
    time_series: List[float]
    response_series: List[float]
    rise_time: Optional[float] = None
    settling_time: Optional[float] = None
    settling_estimate: Optional[float] = None
    overshoot_percent: float
    peak_time: Optional[float] = None
    damped_frequency: Optional[float] = None
    regime: str


@router.post("/compute", response_model=StepResponseResponse)
async def compute_step_response_endpoint(request: StepResponseRequest):
    """
    Closed-form unit-step response of
    K/(tau s + 1) (order 1) or K wn^2/(s^2 + 2 zeta wn s + wn^2) (order 2),
    with rise time, 2% settling time, percent overshoot and peak time.
    """
    try:
        result = compute_step_response(
            order=request.order,
            gain=request.gain,
            time_constant=request.time_constant,
            natural_frequency=request.natural_frequency,
            damping_ratio=request.damping_ratio,
        )
        return StepResponseResponse(**result)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")
