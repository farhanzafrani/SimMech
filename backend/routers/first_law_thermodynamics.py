"""First Law of Thermodynamics API routes"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from simmec_engine.topics.first_law_thermodynamics import compute_first_law_thermodynamics

router = APIRouter(prefix="/api/first-law-thermodynamics", tags=["first-law-thermodynamics"])


class FirstLawThermodynamicsRequest(BaseModel):
    """Request model for the closed-system energy balance analysis.

    Units: mass in kg, specific_heat_cv in kJ/(kg*K), initial_temp in K,
    heat_added and work_done_by_system in kJ.
    """
    mass: float
    specific_heat_cv: float
    initial_temp: float
    heat_added: float
    work_done_by_system: float


class DeltaUCurvePoint(BaseModel):
    heat_added: float
    delta_u: float


class FirstLawThermodynamicsResponse(BaseModel):
    """Response model for the closed-system energy balance analysis"""
    mass: float
    specific_heat_cv: float
    initial_temp: float
    heat_added: float
    work_done_by_system: float
    delta_u: float
    delta_t: float
    final_temp: float
    curve: list[DeltaUCurvePoint]


@router.post("/compute", response_model=FirstLawThermodynamicsResponse)
async def compute_first_law_thermodynamics_endpoint(request: FirstLawThermodynamicsRequest):
    """
    Apply the first law of thermodynamics, dU = Q - W, to a closed system
    of an ideal gas: given the heat added and the work done BY the system,
    find the change in internal energy and the resulting temperature
    change.

    - delta_u = heat_added - work_done_by_system
    - delta_t = delta_u / (mass * specific_heat_cv)
    - final_temp = initial_temp + delta_t
    - curve: delta_u vs heat_added at the same work_done_by_system, showing
      the 1:1 slope of the energy balance
    """
    try:
        result = compute_first_law_thermodynamics(
            mass=request.mass,
            specific_heat_cv=request.specific_heat_cv,
            initial_temp=request.initial_temp,
            heat_added=request.heat_added,
            work_done_by_system=request.work_done_by_system,
        )
        return FirstLawThermodynamicsResponse(**result)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")
