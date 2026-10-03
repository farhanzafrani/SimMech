"""Robotics Kinematics & Actuation API routes (all five topics)"""

from typing import Any, Dict, List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from simmec_engine.topics.robotics_kinematics import (
    compute_forward_kinematics_2r,
    compute_inverse_kinematics_2r,
    compute_jacobian_2r,
    compute_homogeneous_transform,
    compute_motor_gearhead,
)

router = APIRouter(prefix="/api/robotics", tags=["robotics-kinematics"])


class ForwardKinematicsRequest(BaseModel):
    """Planar 2R arm: link lengths (m) and joint angles (deg)"""
    l1: float
    l2: float
    theta1: float
    theta2: float


class InverseKinematicsRequest(BaseModel):
    """Planar 2R arm: link lengths (m), target (x, y) in m, elbow branch"""
    l1: float
    l2: float
    x: float
    y: float
    elbow_up: bool = True


class JacobianRequest(BaseModel):
    """Planar 2R arm: pose, joint rates (rad/s) and tip force (N)"""
    l1: float
    l2: float
    theta1: float
    theta2: float
    qdot1: float = 0.0
    qdot2: float = 0.0
    fx: float = 0.0
    fy: float = 0.0


class TransformRequest(BaseModel):
    """Frame {B} pose in {A}: ZYX Euler angles (deg), translation, and a point in {B}"""
    roll: float = 0.0
    pitch: float = 0.0
    yaw: float = 0.0
    tx: float = 0.0
    ty: float = 0.0
    tz: float = 0.0
    px: float = 0.0
    py: float = 0.0
    pz: float = 0.0


class MotorGearheadRequest(BaseModel):
    """DC motor + gearhead + load, SI units"""
    voltage: float
    resistance: float
    torque_constant: float
    rotor_inertia: float
    gear_ratio: float
    gear_efficiency: float
    load_inertia: float
    load_torque: float
    load_speed: float


def _run(fn, **kwargs) -> Dict[str, Any]:
    """Run an engine function, mapping bad input to 400 and anything else to 500"""
    try:
        return fn(**kwargs)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")


@router.post("/forward-kinematics")
async def forward_kinematics_endpoint(request: ForwardKinematicsRequest):
    """Tip position, elbow position, and workspace annulus of a planar 2R arm."""
    return _run(
        compute_forward_kinematics_2r,
        l1=request.l1, l2=request.l2,
        theta1_deg=request.theta1, theta2_deg=request.theta2,
    )


@router.post("/inverse-kinematics")
async def inverse_kinematics_endpoint(request: InverseKinematicsRequest):
    """Both analytic IK branches for a target; unreachable targets are reported, not rejected."""
    return _run(
        compute_inverse_kinematics_2r,
        l1=request.l1, l2=request.l2, x=request.x, y=request.y,
        elbow_up=request.elbow_up,
    )


@router.post("/jacobian")
async def jacobian_endpoint(request: JacobianRequest):
    """Jacobian, tip velocity v = J qdot, joint torques tau = J^T F, and manipulability."""
    return _run(
        compute_jacobian_2r,
        l1=request.l1, l2=request.l2,
        theta1_deg=request.theta1, theta2_deg=request.theta2,
        qdot1=request.qdot1, qdot2=request.qdot2, fx=request.fx, fy=request.fy,
    )


@router.post("/transform")
async def transform_endpoint(request: TransformRequest):
    """Rotation matrix, 4x4 homogeneous transform, its inverse, and point mapping."""
    return _run(
        compute_homogeneous_transform,
        roll_deg=request.roll, pitch_deg=request.pitch, yaw_deg=request.yaw,
        tx=request.tx, ty=request.ty, tz=request.tz,
        px=request.px, py=request.py, pz=request.pz,
    )


@router.post("/motor-gearhead")
async def motor_gearhead_endpoint(request: MotorGearheadRequest):
    """Torque-speed curve, reflected inertia, and feasibility of a motor + gearhead pairing."""
    return _run(compute_motor_gearhead, **request.model_dump())
