"""Forced convection and heat-exchanger rating API routes"""

from typing import Dict, List

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from simmec_engine.topics.convection_heat_exchangers import compute_convection_heat_exchanger

router = APIRouter(prefix="/api/convection-heat-exchangers", tags=["convection-heat-exchangers"])


class HeatExchangerRequest(BaseModel):
    """Request model for a tube heat exchanger"""
    arrangement: str  # 'counterflow' | 'parallel' | 'shell_tube'
    tube_diameter: float           # mm
    tube_length: float             # mm
    num_tubes: int
    m_cold: float                  # kg/s (tube side)
    t_cold_in: float
    rho: float
    mu: float
    k_fluid: float
    cp_cold: float
    h_outside: float
    m_hot: float
    cp_hot: float
    t_hot_in: float


class HeatExchangerResponse(BaseModel):
    """Response model for a tube heat exchanger"""
    arrangement: str
    velocity: float
    reynolds: float
    prandtl: float
    regime: str
    correlation: str
    nusselt: float
    h_inside: float
    u_overall: float
    area: float
    ua: float
    c_hot: float
    c_cold: float
    c_ratio: float
    ntu: float
    effectiveness: float
    q: float
    q_max: float
    t_cold_out: float
    t_hot_out: float
    lmtd: float
    f_correction: float
    q_lmtd: float
    profile: Dict[str, List[float]]
    eps_curve: Dict[str, List[float]]


@router.post("/compute", response_model=HeatExchangerResponse)
async def compute_heat_exchanger_endpoint(request: HeatExchangerRequest):
    """
    Rate a tube heat exchanger: tube-side convection coefficient from
    Re/Pr correlations (laminar, Gnielinski, Dittus-Boelter), overall U,
    effectiveness-NTU duty and outlet temperatures, and the LMTD method
    as an independent cross-check.
    """
    try:
        result = compute_convection_heat_exchanger(**request.model_dump())
        return HeatExchangerResponse(**result)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")
