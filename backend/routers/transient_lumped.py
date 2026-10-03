"""Transient lumped-capacitance conduction API routes"""

from typing import Dict, List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from simmec_engine.topics.transient_lumped import compute_transient_lumped

router = APIRouter(prefix="/api/transient-lumped", tags=["transient-lumped"])


class TransientLumpedRequest(BaseModel):
    """Request model for lumped-capacitance cooling or heating"""
    shape: str  # 'plate' | 'cylinder' | 'sphere'
    dimension: float               # mm: half-thickness or radius
    density: float
    specific_heat: float
    conductivity: float
    h: float
    t_initial: float
    t_ambient: float
    time: float
    t_target: Optional[float] = None


class TransientLumpedResponse(BaseModel):
    """Response model for lumped-capacitance cooling or heating"""
    shape: str
    characteristic_length: float
    biot: float
    biot_exact: float
    lumped_valid: bool
    time_constant: float
    fourier: float
    temperature: float
    centre_temperature: Optional[float] = None
    time_to_target: Optional[float] = None
    curve: Dict[str, List[Optional[float]]]


@router.post("/compute", response_model=TransientLumpedResponse)
async def compute_transient_lumped_endpoint(request: TransientLumpedRequest):
    """
    Compute the Biot number, time constant, and lumped-capacitance
    temperature history for a plate, long cylinder, or sphere, alongside
    the exact one-term centre-temperature solution (Fo >= 0.2) for
    comparison.
    """
    try:
        result = compute_transient_lumped(**request.model_dump())
        return TransientLumpedResponse(**result)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")
