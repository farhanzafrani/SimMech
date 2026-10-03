"""Force Equilibrium & Free-Body Diagram API routes"""

from typing import List

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from simmec_engine.topics.statics_equilibrium import compute_equilibrium_2d, compute_equilibrium_3d

router = APIRouter(prefix="/api/statics-equilibrium", tags=["statics-equilibrium"])


class PointLoad(BaseModel):
    magnitude: float
    position: float
    angle_deg: float = 270.0


class Equilibrium2DRequest(BaseModel):
    span: float
    loads: List[PointLoad]
    distributed_load: float = 0.0
    applied_moment: float = 0.0


class Equilibrium2DResponse(BaseModel):
    span: float
    ax: float
    ay: float
    by: float
    total_distributed: float
    residual_fx: float
    residual_fy: float
    residual_m: float
    resultant_a: float


class Equilibrium3DRequest(BaseModel):
    length_a: float
    length_b: float
    load: float
    load_x: float
    load_y: float


class Equilibrium3DResponse(BaseModel):
    ra: float
    rb: float
    rc: float
    residual_fz: float
    tips: bool


@router.post("/beam-2d", response_model=Equilibrium2DResponse)
async def beam_2d_endpoint(request: Equilibrium2DRequest):
    """
    Reactions of a pin-and-roller beam from the three planar equilibrium
    equations (sum Fx, sum Fy, sum M_A) written on its free-body diagram.
    """
    try:
        result = compute_equilibrium_2d(
            span=request.span,
            loads=[ld.model_dump() for ld in request.loads],
            distributed_load=request.distributed_load,
            applied_moment=request.applied_moment,
        )
        return Equilibrium2DResponse(**result)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")


@router.post("/plate-3d", response_model=Equilibrium3DResponse)
async def plate_3d_endpoint(request: Equilibrium3DRequest):
    """Three-support horizontal plate: sum Fz, sum Mx, sum My give the three vertical reactions."""
    try:
        return Equilibrium3DResponse(**compute_equilibrium_3d(**request.model_dump()))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")
