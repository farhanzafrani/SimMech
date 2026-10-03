"""Pumps and System Curves API routes"""

from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from simmec_engine.topics.pump_system import compute_pump_system

router = APIRouter(prefix="/api/pump-system", tags=["pump-system"])


class PumpSystemRequest(BaseModel):
    """Request model for pump operating-point and NPSH analysis"""
    shutoff_head: float
    rated_flow: float
    rated_head: float
    peak_efficiency: float = 0.75
    static_head: float
    pipe_diameter: float
    pipe_length: float
    minor_loss_k: float = 0.0
    roughness: float = 4.6e-5
    density: float = 1000.0
    viscosity: float = 1.0e-3
    atmospheric_pressure: float = 101325.0
    vapor_pressure: float = 2339.0
    suction_head: float = 0.0
    suction_loss_k: float = 0.0
    npsh_required: float = 3.0


class PumpSystemResponse(BaseModel):
    """Response model for pump operating-point and NPSH analysis"""
    operating_flow: float
    operating_head: float
    velocity: float
    reynolds: float
    friction_factor: float
    efficiency: float
    hydraulic_power: float
    shaft_power: Optional[float] = None
    flow_vs_bep: float
    npsh_available: float
    npsh_required: float
    npsh_margin: float
    cavitation_risk: bool
    curves: dict


@router.post("/compute", response_model=PumpSystemResponse)
async def compute_pump_system_endpoint(request: PumpSystemRequest):
    """
    Intersect a parabolic pump head curve with the piping system curve
    (static head + friction and minor losses), then report efficiency,
    power and whether NPSH available exceeds NPSH required.
    """
    try:
        result = compute_pump_system(**request.model_dump())
        return PumpSystemResponse(**result)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")
