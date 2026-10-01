"""Drag and Lift on Bodies API routes"""

from typing import Literal, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from simmec_engine.topics.drag_lift import compute_bluff_body, compute_wing

router = APIRouter(prefix="/api/drag-lift", tags=["drag-lift"])


class DragLiftRequest(BaseModel):
    """Request model: 'bluff' uses the body fields, 'wing' the wing fields"""
    kind: Literal['bluff', 'wing']
    velocity: float
    density: float
    # Bluff body
    shape: str = 'cylinder'
    diameter: Optional[float] = None
    length: float = 1.0
    viscosity: float = 1.8e-5
    # Wing
    angle_of_attack: float = 0.0
    aspect_ratio: float = 8.0
    wing_area: float = 10.0
    zero_lift_angle: float = 0.0
    oswald_efficiency: float = 0.9
    profile_drag: float = 0.01
    stall_angle: float = 15.0


class DragLiftResponse(BaseModel):
    """Response model for drag/lift analysis"""
    kind: str
    shape_label: str
    reynolds: Optional[float] = None
    flow_state: str
    drag_coefficient: float
    lift_coefficient: float
    induced_drag_coefficient: Optional[float] = None
    lift_curve_slope: Optional[float] = None
    lift_curve_slope_per_deg: Optional[float] = None
    reference_area: float
    dynamic_pressure: float
    drag_force: float
    lift_force: float
    lift_to_drag: Optional[float] = None
    stalled: bool
    curve: dict


@router.post("/compute", response_model=DragLiftResponse)
async def compute_drag_lift_endpoint(request: DragLiftRequest):
    """
    Drag on a bluff body (cylinder, sphere, disk) with Reynolds-number
    dependence, or lift and drag on a finite wing from the linear lift
    curve and the drag polar.
    """
    try:
        if request.kind == 'bluff':
            if request.diameter is None:
                raise ValueError("Bluff-body analysis needs a diameter")
            result = compute_bluff_body(
                shape=request.shape,
                diameter=request.diameter,
                length=request.length,
                velocity=request.velocity,
                density=request.density,
                viscosity=request.viscosity,
            )
        else:
            result = compute_wing(
                angle_of_attack=request.angle_of_attack,
                aspect_ratio=request.aspect_ratio,
                wing_area=request.wing_area,
                velocity=request.velocity,
                density=request.density,
                zero_lift_angle=request.zero_lift_angle,
                oswald_efficiency=request.oswald_efficiency,
                profile_drag=request.profile_drag,
                stall_angle=request.stall_angle,
            )
        return DragLiftResponse(**result)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")
