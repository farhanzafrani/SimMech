"""Fin (extended surface) heat transfer API routes"""

from typing import Dict, List

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from simmec_engine.topics.fin_heat_transfer import compute_fin

router = APIRouter(prefix="/api/fin-heat-transfer", tags=["fin-heat-transfer"])


class FinRequest(BaseModel):
    """Request model for a straight fin of uniform cross-section"""
    shape: str  # 'pin' | 'rectangular'
    dim_1: float                   # mm: pin diameter or rectangular width
    dim_2: float = 0.0             # mm: rectangular thickness
    length: float                  # mm
    conductivity: float            # W/(m K)
    h: float                       # W/(m^2 K)
    t_base: float
    t_ambient: float
    tip: str = 'convective'        # 'convective' | 'adiabatic' | 'infinite'


class FinResponse(BaseModel):
    """Response model for a straight fin of uniform cross-section"""
    shape: str
    tip: str
    perimeter: float
    area_c: float
    m: float
    ml: float
    heat_rate: float
    efficiency: float
    effectiveness: float
    tip_temperature: float
    biot: float
    infinite_fin_valid: bool
    profile: Dict[str, List[float]]


@router.post("/compute", response_model=FinResponse)
async def compute_fin_endpoint(request: FinRequest):
    """
    Compute fin heat rate, efficiency, effectiveness and the temperature
    profile for a pin or rectangular fin with a convective, adiabatic, or
    infinitely-long tip condition.
    """
    try:
        result = compute_fin(**request.model_dump())
        return FinResponse(**result)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")
