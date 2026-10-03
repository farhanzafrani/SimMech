"""Ideal Rankine and Brayton power cycle API routes"""

from typing import Dict, List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from simmec_engine.topics.power_cycles import compute_brayton, compute_rankine

router = APIRouter(prefix="/api/power-cycles", tags=["power-cycles"])


class RankineRequest(BaseModel):
    """Request model for the Rankine steam cycle"""
    boiler_pressure: float          # MPa
    turbine_inlet_temp: float       # deg C
    condenser_pressure: float       # MPa
    turbine_efficiency: float = 1.0
    pump_efficiency: float = 1.0


class RankineResponse(BaseModel):
    """Response model for the Rankine steam cycle"""
    boiler_pressure: float
    turbine_inlet_temp: float
    condenser_pressure: float
    t_sat_boiler: float
    t_sat_condenser: float
    h1: float
    h2: float
    h3: float
    h4: float
    s3: float
    quality_exit: Optional[float] = None
    exit_superheated: bool
    w_pump: float
    w_turbine: float
    w_net: float
    q_in: float
    q_out: float
    thermal_efficiency: float
    back_work_ratio: float
    steam_rate: float
    carnot_efficiency: float
    ts_path: List[Dict[str, float]]
    dome: Dict[str, List[float]]


class BraytonRequest(BaseModel):
    """Request model for the Brayton gas-turbine cycle"""
    inlet_temp: float               # K
    pressure_ratio: float
    turbine_inlet_temp: float       # K
    cp: float = 1.005
    k: float = 1.4
    compressor_efficiency: float = 1.0
    turbine_efficiency: float = 1.0


class BraytonResponse(BaseModel):
    """Response model for the Brayton gas-turbine cycle"""
    inlet_temp: float
    pressure_ratio: float
    turbine_inlet_temp: float
    t2: float
    t4: float
    w_compressor: float
    w_turbine: float
    w_net: float
    q_in: float
    q_out: float
    thermal_efficiency: float
    ideal_efficiency: float
    back_work_ratio: float
    optimal_pressure_ratio: float
    ts_path: List[Dict[str, float]]
    sweep: Dict[str, List[float]]


@router.post("/rankine", response_model=RankineResponse)
async def compute_rankine_endpoint(request: RankineRequest):
    """
    Compute a simple Rankine cycle with real steam properties (IAPWS-IF97
    table): pump work, turbine work, heat input, thermal efficiency,
    back-work ratio, steam rate and the T-s path. Isentropic efficiencies
    default to 1.0 (the ideal cycle).
    """
    try:
        return RankineResponse(**compute_rankine(**request.model_dump()))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")


@router.post("/brayton", response_model=BraytonResponse)
async def compute_brayton_endpoint(request: BraytonRequest):
    """
    Compute a simple Brayton cycle with the cold-air-standard model:
    compressor and turbine work, heat input, thermal efficiency,
    back-work ratio, the ideal 1 - r_p^(-(k-1)/k) efficiency, and a
    pressure-ratio sweep. Isentropic efficiencies default to 1.0.
    """
    try:
        return BraytonResponse(**compute_brayton(**request.model_dump()))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")
