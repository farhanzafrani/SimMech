"""Frequency Response & Bode Plot API routes"""

from typing import List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from simmec_engine.topics.frequency_response_bode import compute_frequency_response

router = APIRouter(prefix="/api/frequency-response-bode", tags=["frequency-response-bode"])


class FrequencyResponseRequest(BaseModel):
    """Request model for L(s) = K / (s (tau1 s + 1)(tau2 s + 1))"""
    gain: float
    tau1: float
    tau2: float


class FrequencyResponseResponse(BaseModel):
    """Response model for Bode analysis"""
    gain: float
    tau1: float
    tau2: float
    frequency_series: List[float]
    magnitude_db_series: List[float]
    phase_deg_series: List[float]
    gain_crossover: Optional[float] = None
    phase_margin_deg: Optional[float] = None
    phase_crossover: float
    gain_margin: float
    gain_margin_db: float
    critical_gain: float
    is_stable: bool
    damping_estimate: Optional[float] = None


@router.post("/compute", response_model=FrequencyResponseResponse)
async def compute_frequency_response_endpoint(request: FrequencyResponseRequest):
    """
    Bode magnitude/phase of the open loop and its stability margins:
    PM = 180 + angle L(j w_gc), GM = 1 / |L(j w_pc)|.
    """
    try:
        result = compute_frequency_response(
            gain=request.gain,
            tau1=request.tau1,
            tau2=request.tau2,
        )
        return FrequencyResponseResponse(**result)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")
