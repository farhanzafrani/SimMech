"""Newton's Second Law & Work-Energy Methods API routes"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from simmec_engine.topics.newton_work_energy import compute_newton_work_energy

router = APIRouter(prefix="/api/newton-work-energy", tags=["newton-work-energy"])


class NewtonWorkEnergyRequest(BaseModel):
    """Request model for the braking-distance analysis.

    Units: mass in kg, initial_speed in m/s, friction_coefficient is
    dimensionless.
    """
    mass: float
    initial_speed: float
    friction_coefficient: float


class SpeedDistancePoint(BaseModel):
    distance: float
    speed: float


class NewtonWorkEnergyResponse(BaseModel):
    """Response model for the braking-distance analysis"""
    mass: float
    initial_speed: float
    friction_coefficient: float
    friction_force: float
    deceleration: float
    stopping_distance: float
    stopping_time: float
    initial_kinetic_energy: float
    work_done_by_friction: float
    curve: list[SpeedDistancePoint]


@router.post("/compute", response_model=NewtonWorkEnergyResponse)
async def compute_newton_work_energy_endpoint(request: NewtonWorkEnergyRequest):
    """
    Compute the stopping distance of a braking mass two ways — via
    Newton's second law (F = ma, then constant-deceleration kinematics)
    and via the work-energy theorem (work done by friction removes the
    initial kinetic energy) — and confirm they agree.

    Given the mass m, initial speed v1, and kinetic friction coefficient
    mu:
    - The friction force and resulting deceleration
    - The stopping distance and stopping time from F = ma
    - The initial kinetic energy and the work done by friction over that
      same stopping distance (equal by construction)
    - A speed-vs-distance curve tracing the deceleration profile, for
      visualizing the vehicle slowing to a stop
    """
    try:
        result = compute_newton_work_energy(
            mass=request.mass,
            initial_speed=request.initial_speed,
            friction_coefficient=request.friction_coefficient,
        )
        return NewtonWorkEnergyResponse(**result)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")
