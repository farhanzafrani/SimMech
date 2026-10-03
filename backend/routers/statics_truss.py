"""Truss Analysis API routes"""

from typing import List

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from simmec_engine.topics.statics_truss import compute_truss

router = APIRouter(prefix="/api/statics-truss", tags=["statics-truss"])


class TrussRequest(BaseModel):
    span: float
    height: float
    panels: int
    load: float
    load_joint: int


class TrussMember(BaseModel):
    start: int
    end: int
    kind: str
    length: float
    force: float
    state: str


class TrussResponse(BaseModel):
    nodes: List[List[float]]
    members: List[TrussMember]
    reaction_ax: float
    reaction_ay: float
    reaction_by: float
    max_tension: float
    max_compression: float
    midspan_moment: float
    midspan_chord_estimate: float
    is_determinate: bool


@router.post("/compute", response_model=TrussResponse)
async def compute_truss_endpoint(request: TrussRequest):
    """
    Solve a statically determinate Warren truss (pin + roller, one vertical
    joint load). All joint equations sum Fx = sum Fy = 0 are assembled into
    one linear system (method of joints in matrix form); signed member
    forces are returned (+ tension, - compression).
    """
    try:
        return TrussResponse(**compute_truss(**request.model_dump()))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")
