"""Kinematics of Particles API routes"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from simmec_engine.topics.particle_kinematics import compute_particle_kinematics

router = APIRouter(prefix="/api/particle-kinematics", tags=["particle-kinematics"])


class ParticleKinematicsRequest(BaseModel):
    """Request model for particle tangential/normal acceleration analysis.

    Units: speed in m/s, accelerations in m/s^2, radius_of_curvature in m.
    """
    speed: float
    tangential_accel: float
    radius_of_curvature: float


class CurvePoint(BaseModel):
    speed: float
    normal_accel: float


class ParticleKinematicsResponse(BaseModel):
    """Response model for particle tangential/normal acceleration analysis"""
    speed: float
    tangential_accel: float
    radius_of_curvature: float
    normal_accel: float
    total_accel: float
    angle_from_tangent_deg: float
    curve: list[CurvePoint]


@router.post("/compute", response_model=ParticleKinematicsResponse)
async def compute_particle_kinematics_endpoint(request: ParticleKinematicsRequest):
    """
    Split a particle's acceleration into tangential (speeding up/slowing
    down) and normal (turning) components, given its instantaneous speed,
    tangential acceleration, and the path's radius of curvature.

    - a_n = v^2 / rho (normal/centripetal acceleration)
    - a = sqrt(a_t^2 + a_n^2) (total acceleration magnitude)
    - angle_from_tangent_deg: the angle the total acceleration vector
      makes with the tangential direction
    - curve: a_n vs v at the same radius of curvature, for visualizing
      how steeply the normal component grows with speed
    """
    try:
        result = compute_particle_kinematics(
            speed=request.speed,
            tangential_accel=request.tangential_accel,
            radius_of_curvature=request.radius_of_curvature,
        )
        return ParticleKinematicsResponse(**result)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")
