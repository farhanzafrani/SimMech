"""Friction & Impending Slip API routes"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from simmec_engine.topics.statics_friction import (
    compute_incline_friction,
    compute_wedge_friction,
    compute_capstan_friction,
)

router = APIRouter(prefix="/api/statics-friction", tags=["statics-friction"])


class InclineRequest(BaseModel):
    weight: float
    angle_deg: float
    mu: float
    applied_force: float


class InclineResponse(BaseModel):
    normal_force: float
    max_friction: float
    required_friction: float
    p_min: float
    p_max: float
    friction_angle_deg: float
    self_locking: bool
    status: str
    utilization: float


class WedgeRequest(BaseModel):
    weight: float
    wedge_angle_deg: float
    mu: float


class WedgeResponse(BaseModel):
    friction_angle_deg: float
    drive_force: float
    release_force: float
    self_locking: bool
    mechanical_advantage: float


class CapstanRequest(BaseModel):
    load: float
    mu: float
    wrap_turns: float


class CapstanResponse(BaseModel):
    wrap_angle_rad: float
    tension_ratio: float
    holding_force: float


def _run(fn, request, response_cls):
    try:
        return response_cls(**fn(**request.model_dump()))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")


@router.post("/incline", response_model=InclineResponse)
async def incline_endpoint(request: InclineRequest):
    """Block on an incline: range of up-slope push P that keeps it at rest, and slip status."""
    return _run(compute_incline_friction, request, InclineResponse)


@router.post("/wedge", response_model=WedgeResponse)
async def wedge_endpoint(request: WedgeRequest):
    """Wedge lifting a guided block: drive force, release force, self-locking test (theta <= 2 phi)."""
    return _run(compute_wedge_friction, request, WedgeResponse)


@router.post("/capstan", response_model=CapstanResponse)
async def capstan_endpoint(request: CapstanRequest):
    """Rope around a fixed post: T1/T2 = exp(mu * beta) at impending slip."""
    return _run(compute_capstan_friction, request, CapstanResponse)
