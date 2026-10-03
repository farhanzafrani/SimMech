"""Second Law (Carnot limit and entropy generation) API routes"""

from typing import Dict, List

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from simmec_engine.topics.second_law import compute_second_law

router = APIRouter(prefix="/api/second-law", tags=["second-law"])


class SecondLawRequest(BaseModel):
    """Request model for the second-law device analysis"""
    mode: str  # 'engine' | 'refrigerator' | 'heat_pump'
    t_hot: float
    t_cold: float
    q_ref: float
    work: float


class SecondLawResponse(BaseModel):
    """Response model for the second-law device analysis"""
    mode: str
    t_hot: float
    t_cold: float
    q_hot: float
    q_cold: float
    work: float
    performance: float
    carnot_performance: float
    second_law_efficiency: float
    entropy_generation: float
    reversible_work: float
    lost_work: float
    reference_temperature: float
    feasible: bool
    carnot_curve: Dict[str, List[float]]


@router.post("/compute", response_model=SecondLawResponse)
async def compute_second_law_endpoint(request: SecondLawRequest):
    """
    Compare a heat engine, refrigerator, or heat pump against its Carnot
    limit and compute the entropy it generates.

    - Engine: eta = W/Q_H, limit 1 - T_L/T_H
    - Refrigerator: COP = Q_L/W, limit T_L/(T_H - T_L)
    - Heat pump: COP = Q_H/W, limit T_H/(T_H - T_L)
    - Entropy generation S_gen; a negative value means the device
      violates the second law (reported via `feasible`, not rejected)
    """
    try:
        result = compute_second_law(
            mode=request.mode,
            t_hot=request.t_hot,
            t_cold=request.t_cold,
            q_ref=request.q_ref,
            work=request.work,
        )
        return SecondLawResponse(**result)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")
