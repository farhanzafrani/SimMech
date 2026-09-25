"""Bolted Joint Design & Preload API routes"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from simmec_engine.topics.bolted_joints import compute_bolted_joint

router = APIRouter(prefix="/api/bolted-joints", tags=["bolted-joints"])


class BoltedJointRequest(BaseModel):
    """Request model for bolted joint preload analysis"""
    bolt_stiffness: float
    member_stiffness: float
    proof_load: float
    external_load: float


class BoltedJointLoadPoint(BaseModel):
    p: float
    bolt_load: float
    member_load: float


class BoltedJointResponse(BaseModel):
    """Response model for bolted joint preload analysis"""
    bolt_stiffness: float
    member_stiffness: float
    proof_load: float
    external_load: float
    joint_constant: float
    preload: float
    bolt_load: float
    member_load: float
    is_separated: bool
    safety_factor_yield: float
    separation_load: float
    safety_factor_separation: float
    points: list[BoltedJointLoadPoint]


@router.post("/compute", response_model=BoltedJointResponse)
async def compute_bolted_joint_endpoint(request: BoltedJointRequest):
    """
    Compute the joint stiffness constant, preload, and resultant bolt /
    member loads for a preloaded bolted joint under an external tensile
    load.

    Given bolt stiffness, clamped-member stiffness, bolt proof load, and
    the external tensile load applied to the joint:
    - Joint stiffness constant (C = k_b / (k_b + k_m))
    - Recommended preload for a reused fastener (F_i = 0.75 F_p)
    - Resultant bolt load (F_b = F_i + C P) and member/clamp load
      (F_m = F_i - (1-C) P)
    - Whether the joint has separated (F_m <= 0)
    - Safety factor against bolt yielding (F_p / F_b) and against joint
      separation (the P at which F_m reaches zero, vs. the actual P)
    - A set of points tracing F_b and F_m as P is swept from 0 upward,
      for the classic bolted-joint load diagram
    """
    try:
        result = compute_bolted_joint(
            bolt_stiffness=request.bolt_stiffness,
            member_stiffness=request.member_stiffness,
            proof_load=request.proof_load,
            external_load=request.external_load,
        )
        return BoltedJointResponse(**result)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")
