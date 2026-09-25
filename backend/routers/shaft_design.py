"""Shaft Design Under Combined Bending and Torsion API routes"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from simmec_engine.topics.shaft_design import compute_shaft_design

router = APIRouter(prefix="/api/shaft-design", tags=["shaft-design"])


class ShaftDesignRequest(BaseModel):
    """Request model for combined bending-and-torsion shaft sizing"""
    alternating_moment: float
    mean_torque: float
    endurance_limit: float
    ultimate_strength: float
    stress_concentration_factor: float
    notch_sensitivity: float
    target_safety_factor: float


class ShaftDesignDistributionPoint(BaseModel):
    diameter_mm: float
    safety_factor: float


class ShaftDesignResponse(BaseModel):
    """Response model for combined bending-and-torsion shaft sizing"""
    alternating_moment: float
    mean_torque: float
    endurance_limit: float
    ultimate_strength: float
    stress_concentration_factor: float
    notch_sensitivity: float
    target_safety_factor: float
    fatigue_stress_concentration_factor: float
    required_diameter: float
    alternating_stress: float
    rounded_diameter: float
    rounded_safety_factor: float
    distribution: list[ShaftDesignDistributionPoint]


@router.post("/compute", response_model=ShaftDesignResponse)
async def compute_shaft_design_endpoint(request: ShaftDesignRequest):
    """
    Compute the minimum shaft diameter for a rotating shaft under combined
    alternating bending and steady torsion at a stress-concentration
    feature (e.g. a shoulder fillet), using the ASME DE-Goodman equation.

    Given the alternating bending moment, steady torque, material fatigue
    properties, geometric stress-concentration factor, notch sensitivity,
    and a target factor of safety, compute:
    - The fatigue stress-concentration factor K_f = 1 + q(K_t - 1)
    - The required minimum shaft diameter d (mm)
    - The resulting alternating von Mises stress at the fillet
    - A rounded-up practical diameter and its actual resulting safety factor
    - A diameter-vs-safety-factor curve for visualization
    """
    try:
        result = compute_shaft_design(
            alternating_moment=request.alternating_moment,
            mean_torque=request.mean_torque,
            endurance_limit=request.endurance_limit,
            ultimate_strength=request.ultimate_strength,
            stress_concentration_factor=request.stress_concentration_factor,
            notch_sensitivity=request.notch_sensitivity,
            target_safety_factor=request.target_safety_factor,
        )
        return ShaftDesignResponse(**result)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")
