"""Pipe Flow & Convective Heat Transfer API routes"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from simmec_engine.topics.pipe_flow_heat_transfer import compute_pipe_flow_heat_transfer

router = APIRouter(prefix="/api/pipe-flow-heat-transfer", tags=["pipe-flow-heat-transfer"])


class PipeFlowHeatTransferRequest(BaseModel):
    """Request model for the pipe friction / convective heat transfer analysis.

    Units: density in kg/m^3, kinematic_viscosity in m^2/s, velocity in
    m/s, diameter/length in m, convection_coefficient in W/(m^2*K),
    surface_temp/fluid_temp in deg C.
    """
    density: float
    kinematic_viscosity: float
    velocity: float
    diameter: float
    length: float
    convection_coefficient: float
    surface_temp: float
    fluid_temp: float


class HeadLossCurvePoint(BaseModel):
    velocity: float
    head_loss: float


class PipeFlowHeatTransferResponse(BaseModel):
    """Response model for the pipe friction / convective heat transfer analysis"""
    density: float
    kinematic_viscosity: float
    velocity: float
    diameter: float
    length: float
    convection_coefficient: float
    surface_temp: float
    fluid_temp: float
    reynolds: float
    flow_regime: str
    friction_factor: float
    head_loss: float
    pressure_drop: float
    heat_flux: float
    curve: list[HeadLossCurvePoint]


@router.post("/compute", response_model=PipeFlowHeatTransferResponse)
async def compute_pipe_flow_heat_transfer_endpoint(request: PipeFlowHeatTransferRequest):
    """
    Compute the Reynolds number, friction factor, Darcy-Weisbach head
    loss, and convective heat flux for steady flow through a straight
    pipe.

    - Re = V D / nu, deciding laminar (Re < 2300) vs turbulent flow
    - f = 64/Re (laminar) or 0.316 Re^-0.25 (turbulent, Blasius)
    - head_loss = f (L/D) (V^2 / 2g), pressure_drop = rho g head_loss
    - heat_flux = h (Ts - Tinf) (Newton's law of cooling)
    - curve: head_loss vs velocity at the same pipe geometry, showing the
      linear (laminar) vs. steeper (turbulent) growth in friction loss
    """
    try:
        result = compute_pipe_flow_heat_transfer(
            density=request.density,
            kinematic_viscosity=request.kinematic_viscosity,
            velocity=request.velocity,
            diameter=request.diameter,
            length=request.length,
            convection_coefficient=request.convection_coefficient,
            surface_temp=request.surface_temp,
            fluid_temp=request.fluid_temp,
        )
        return PipeFlowHeatTransferResponse(**result)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")
