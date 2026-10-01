"""Steady 1D conduction and thermal resistance network API routes"""

from typing import Dict, List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from simmec_engine.topics.conduction_networks import compute_conduction_network

router = APIRouter(prefix="/api/conduction-networks", tags=["conduction-networks"])


class ConductionNetworkRequest(BaseModel):
    """Request model for a layered wall / pipe resistance network"""
    geometry: str  # 'plane' | 'cylinder'
    thicknesses: List[float]       # m, inside to outside
    conductivities: List[float]    # W/(m K)
    h_inside: float
    h_outside: float
    t_inside: float
    t_outside: float
    area: float = 1.0              # m^2 (plane)
    inner_radius: float = 0.05     # m (cylinder)
    length: float = 1.0            # m (cylinder)


class ConductionNetworkResponse(BaseModel):
    """Response model for a layered wall / pipe resistance network"""
    geometry: str
    heat_rate: float
    r_total: float
    ua_overall: float
    labels: List[str]
    resistances: List[float]
    temp_drops: List[float]
    node_temps: List[float]
    positions: List[float]
    profile: List[Dict[str, float]]
    heat_flux: Optional[float] = None
    heat_rate_per_length: Optional[float] = None
    critical_radius: Optional[float] = None
    outer_radius: Optional[float] = None


@router.post("/compute", response_model=ConductionNetworkResponse)
async def compute_conduction_network_endpoint(request: ConductionNetworkRequest):
    """
    Solve a series thermal-resistance network of conduction layers between
    two convecting fluids, for a plane wall or a concentric cylindrical
    wall: heat rate, resistance of each layer, node temperatures, an
    in-wall temperature profile, and (cylinder) the critical radius k/h.
    """
    try:
        result = compute_conduction_network(**request.model_dump())
        return ConductionNetworkResponse(**result)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")
