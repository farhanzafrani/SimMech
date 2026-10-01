"""Control-Volume Momentum (jet on a vane) API routes"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from simmec_engine.topics.control_volume_momentum import compute_control_volume_momentum

router = APIRouter(prefix="/api/control-volume-momentum", tags=["control-volume-momentum"])


class ControlVolumeMomentumRequest(BaseModel):
    """Request model for jet-on-vane momentum analysis"""
    jet_diameter: float
    jet_velocity: float
    density: float = 1000.0
    turning_angle: float
    vane_velocity: float = 0.0


class ControlVolumeMomentumResponse(BaseModel):
    """Response model for jet-on-vane momentum analysis"""
    jet_diameter: float
    jet_velocity: float
    turning_angle: float
    vane_velocity: float
    jet_area: float
    mass_flow: float
    relative_velocity: float
    fixed_force_x: float
    fixed_force_y: float
    single_force_x: float
    single_force_y: float
    wheel_force_x: float
    wheel_power: float
    jet_power: float
    wheel_efficiency: float
    efficiency_curve: dict
    properties: dict


@router.post("/compute", response_model=ControlVolumeMomentumResponse)
async def compute_control_volume_momentum_endpoint(request: ControlVolumeMomentumRequest):
    """
    Apply the steady linear-momentum equation to a control volume around a
    vane struck by a free jet.

    Returns the force on a fixed vane, on a single vane moving with the
    jet, and on a wheel of many vanes (with its power and efficiency).
    """
    try:
        result = compute_control_volume_momentum(
            jet_diameter=request.jet_diameter,
            jet_velocity=request.jet_velocity,
            density=request.density,
            turning_angle=request.turning_angle,
            vane_velocity=request.vane_velocity,
        )
        return ControlVolumeMomentumResponse(**result)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")
