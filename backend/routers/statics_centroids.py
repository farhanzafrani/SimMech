"""Centroids & Area Moments of Inertia API routes"""

from typing import List, Literal, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from simmec_engine.topics.statics_centroids import compute_composite_section

router = APIRouter(prefix="/api/statics-centroids", tags=["statics-centroids"])


class SectionPart(BaseModel):
    shape: Literal['rect', 'circle']
    cx: float
    cy: float
    w: Optional[float] = None
    h: Optional[float] = None
    d: Optional[float] = None
    sign: int = 1


class CompositeRequest(BaseModel):
    parts: List[SectionPart]


class PartRow(BaseModel):
    shape: str
    sign: int
    area: float
    cx: float
    cy: float
    dy: float
    own_ix: float
    transfer_ix: float


class CompositeResponse(BaseModel):
    area: float
    x_bar: float
    y_bar: float
    ix: float
    iy: float
    rx: float
    ry: float
    y_top: float
    y_bottom: float
    section_modulus_top: float
    section_modulus_bottom: float
    parts: List[PartRow]


@router.post("/compute", response_model=CompositeResponse)
async def compute_composite_endpoint(request: CompositeRequest):
    """
    Centroid and centroidal second moments of area of a composite section
    built from rectangles and circles (holes carry sign = -1), using the
    parallel-axis theorem I = sum(I_own + A d^2).
    """
    try:
        parts = [p.model_dump() for p in request.parts]
        for p in parts:
            if p['shape'] == 'rect' and (p['w'] is None or p['h'] is None):
                raise ValueError("Rectangles need w and h")
            if p['shape'] == 'circle' and p['d'] is None:
                raise ValueError("Circles need d")
        return CompositeResponse(**compute_composite_section(parts))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")
