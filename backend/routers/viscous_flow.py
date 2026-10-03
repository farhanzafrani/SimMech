"""Viscous Flow (Couette / Poiseuille / Reynolds regime) API routes"""

from typing import Literal, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from simmec_engine.topics.viscous_flow import compute_couette_flow, compute_pipe_poiseuille

router = APIRouter(prefix="/api/viscous-flow", tags=["viscous-flow"])


class ViscousFlowRequest(BaseModel):
    """Request model: choose a geometry; only that geometry's fields are used"""
    mode: Literal['couette', 'pipe']
    viscosity: float
    density: float
    # Couette
    gap: Optional[float] = None
    plate_velocity: Optional[float] = None
    pressure_gradient: float = 0.0
    # Pipe
    diameter: Optional[float] = None
    length: Optional[float] = None
    pressure_drop: Optional[float] = None


class ViscousFlowResponse(BaseModel):
    """Response model for viscous flow analysis"""
    mode: str
    profile: dict
    tau_lower: float
    tau_upper: float
    flow_rate: float
    mean_velocity: float
    max_velocity: float
    reynolds: float
    regime: str
    laminar_valid: bool
    friction_factor: Optional[float] = None
    wall_shear: Optional[float] = None


@router.post("/compute", response_model=ViscousFlowResponse)
async def compute_viscous_flow_endpoint(request: ViscousFlowRequest):
    """
    Exact laminar solutions plus the Reynolds-number regime check.

    - mode 'couette': flow between a fixed and a moving plate, with optional
      pressure gradient dp/dx
    - mode 'pipe': Hagen-Poiseuille flow in a round pipe for a given
      pressure drop over a given length
    """
    try:
        if request.mode == 'couette':
            if request.gap is None or request.plate_velocity is None:
                raise ValueError("Couette flow needs gap and plate_velocity")
            result = compute_couette_flow(
                gap=request.gap,
                plate_velocity=request.plate_velocity,
                viscosity=request.viscosity,
                density=request.density,
                pressure_gradient=request.pressure_gradient,
            )
        else:
            if request.diameter is None or request.length is None or request.pressure_drop is None:
                raise ValueError("Pipe flow needs diameter, length and pressure_drop")
            result = compute_pipe_poiseuille(
                diameter=request.diameter,
                length=request.length,
                pressure_drop=request.pressure_drop,
                viscosity=request.viscosity,
                density=request.density,
            )
        return ViscousFlowResponse(**result)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")
