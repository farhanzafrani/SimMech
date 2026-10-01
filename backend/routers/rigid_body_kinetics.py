"""Rigid-Body Planar Kinetics API routes"""

from typing import List

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from simmec_engine.topics.rigid_body_kinetics import compute_rigid_body_kinetics

router = APIRouter(prefix="/api/rigid-body-kinetics", tags=["rigid-body-kinetics"])


class RigidBodyKineticsRequest(BaseModel):
    """Request model for a round body released on an incline"""
    shape: str
    mass: float
    radius: float
    incline_angle_deg: float
    friction_coefficient: float
    incline_length: float


class RigidBodyKineticsResponse(BaseModel):
    """Response model for rigid-body planar kinetics"""
    shape: str
    shape_name: str
    k_squared: float
    inertia: float
    normal_force: float
    acceleration: float
    angular_acceleration: float
    friction_force: float
    friction_required: float
    mu_required: float
    slips: bool
    final_time: float
    final_speed: float
    final_angular_speed: float
    time_series: List[float]
    position_series: List[float]
    speed_series: List[float]
    angular_speed_series: List[float]
    slip_speed_series: List[float]


@router.post("/compute", response_model=RigidBodyKineticsResponse)
async def compute_rigid_body_kinetics_endpoint(request: RigidBodyKineticsRequest):
    """
    Release a round rigid body from rest on an incline and apply
    sum F = m a_G and sum M_G = I alpha.

    - Pure rolling: a = g sin(theta) / (1 + k^2), friction f = m a k^2
    - Friction needed to roll: mu >= tan(theta) k^2 / (1 + k^2)
    - Otherwise the body slips with kinetic friction mu N
    """
    try:
        result = compute_rigid_body_kinetics(
            shape=request.shape,
            mass=request.mass,
            radius=request.radius,
            incline_angle_deg=request.incline_angle_deg,
            friction_coefficient=request.friction_coefficient,
            incline_length=request.incline_length,
        )
        return RigidBodyKineticsResponse(**result)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")
