"""Flat-Plate Boundary Layer API routes"""

from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from simmec_engine.topics.boundary_layer import compute_boundary_layer

router = APIRouter(prefix="/api/boundary-layer", tags=["boundary-layer"])


class BoundaryLayerRequest(BaseModel):
    """Request model for flat-plate boundary-layer analysis"""
    free_stream_velocity: float
    plate_length: float
    kinematic_viscosity: float
    density: float
    plate_width: float = 1.0


class BoundaryLayerResponse(BaseModel):
    """Response model for flat-plate boundary-layer analysis"""
    free_stream_velocity: float
    plate_length: float
    reynolds_length: float
    transition_location: Optional[float] = None
    regime: str
    delta: float
    displacement_thickness: float
    momentum_thickness: float
    skin_friction_local: float
    wall_shear: float
    drag_coefficient: float
    drag_force: float
    dynamic_pressure: float
    blasius_eta99: float
    thickness_curve: dict
    velocity_profile: dict


@router.post("/compute", response_model=BoundaryLayerResponse)
async def compute_boundary_layer_endpoint(request: BoundaryLayerRequest):
    """
    Blasius laminar boundary layer (and 1/7-power turbulent correlations
    past Re = 5e5) on one side of a flat plate: thickness, wall shear,
    skin-friction coefficient and total friction drag.
    """
    try:
        result = compute_boundary_layer(
            free_stream_velocity=request.free_stream_velocity,
            plate_length=request.plate_length,
            kinematic_viscosity=request.kinematic_viscosity,
            density=request.density,
            plate_width=request.plate_width,
        )
        return BoundaryLayerResponse(**result)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")
