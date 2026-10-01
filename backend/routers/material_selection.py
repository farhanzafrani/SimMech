"""Material Selection API routes (Ashby performance indices)"""

from typing import List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from simmec_engine.topics.material_selection import compute_material_selection

router = APIRouter(prefix="/api/material-selection", tags=["material-selection"])


class MaterialSelectionRequest(BaseModel):
    """Request model for an Ashby index ranking"""
    index: str
    reference: str = 'steel_1020'
    min_yield: Optional[float] = None
    max_density: Optional[float] = None


class MaterialRow(BaseModel):
    id: str
    name: str
    E: float
    rho: float
    sigma_y: float
    index_value: float
    relative_index: float
    mass_ratio: Optional[float] = None
    passes_screening: bool


class MaterialSelectionResponse(BaseModel):
    """Response model: materials ranked best-first by the chosen index"""
    index: str
    index_label: str
    index_latex: str
    reference: str
    reference_index: float
    materials: List[MaterialRow]
    best_id: Optional[str] = None


@router.post("/compute", response_model=MaterialSelectionResponse)
async def compute_material_selection_endpoint(request: MaterialSelectionRequest):
    """
    Rank the built-in materials by an Ashby performance index (stiff beam,
    stiff panel, stiff tie, strong beam, strong tie, or spring), with
    optional minimum-yield and maximum-density screening limits and the
    implied mass relative to a reference material.
    """
    try:
        result = compute_material_selection(**request.model_dump())
        return MaterialSelectionResponse(**result)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")
