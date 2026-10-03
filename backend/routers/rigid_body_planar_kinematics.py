"""Rigid-Body Planar Kinematics API routes"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from simmec_engine.topics.rigid_body_planar_kinematics import compute_rigid_body_planar_kinematics

router = APIRouter(prefix="/api/rigid-body-planar-kinematics", tags=["rigid-body-planar-kinematics"])


class RigidBodyPlanarKinematicsRequest(BaseModel):
    """Request model for rolling-wheel instantaneous-center velocity analysis.

    Units: radius in meters, angular_velocity in rad/s, point_angle_deg in
    degrees measured from the top of the wheel (0) down to the ground
    contact point (180).
    """
    radius: float
    angular_velocity: float
    point_angle_deg: float


class VelocityCurvePoint(BaseModel):
    angle_deg: float
    velocity: float


class RigidBodyPlanarKinematicsResponse(BaseModel):
    """Response model for rolling-wheel instantaneous-center velocity analysis"""
    radius: float
    angular_velocity: float
    point_angle_deg: float
    center_velocity: float
    point_velocity: float
    curve: list[VelocityCurvePoint]


@router.post("/compute", response_model=RigidBodyPlanarKinematicsResponse)
async def compute_rigid_body_planar_kinematics_endpoint(request: RigidBodyPlanarKinematicsRequest):
    """
    Compute the velocity of a chosen point on a rolling wheel's rim using
    the instantaneous-center method: the ground contact point is
    momentarily at rest, and every other point's speed is omega times its
    distance from that point.

    - center_velocity = omega * r
    - point_velocity = 2 * center_velocity * cos(point_angle_deg / 2)
    - A curve of point_velocity vs point_angle_deg over [0, 180] degrees,
      for visualizing the cosine-shaped falloff from 2x center speed at the
      top down to zero at the contact point.
    """
    try:
        result = compute_rigid_body_planar_kinematics(
            radius=request.radius,
            angular_velocity=request.angular_velocity,
            point_angle_deg=request.point_angle_deg,
        )
        return RigidBodyPlanarKinematicsResponse(**result)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")
