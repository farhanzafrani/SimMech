"""Metal Cutting Mechanics API routes (Merchant circle, power, Taylor tool life)"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from simmec_engine.topics.metal_cutting import compute_metal_cutting

router = APIRouter(prefix="/api/metal-cutting", tags=["metal-cutting"])


class MetalCuttingRequest(BaseModel):
    """Request model for orthogonal metal cutting analysis"""
    uncut_thickness: float
    width_of_cut: float
    rake_angle: float
    friction_angle: float
    shear_strength: float
    cutting_speed: float
    taylor_n: float
    taylor_c: float


class MetalCuttingResponse(BaseModel):
    """Response model for orthogonal metal cutting analysis"""
    shear_angle: float
    chip_ratio: float
    chip_thickness: float
    shear_force: float
    resultant_force: float
    cutting_force: float
    thrust_force: float
    friction_force: float
    normal_force: float
    friction_coefficient: float
    specific_energy: float
    cutting_power: float
    material_removal_rate: float
    tool_life: float


@router.post("/compute", response_model=MetalCuttingResponse)
async def compute_metal_cutting_endpoint(request: MetalCuttingRequest):
    """
    Compute Merchant-circle forces, chip geometry, cutting power, and
    Taylor tool life for orthogonal cutting.

    - Shear angle (Merchant): phi = 45 + alpha/2 - beta/2
    - Chip ratio: r = sin(phi) / cos(phi - alpha)
    - Shear force: Fs = tau_s t0 w / sin(phi); resultant R = Fs / cos(phi + beta - alpha)
    - Cutting force Fc = R cos(beta - alpha); thrust Ft = R sin(beta - alpha)
    - Power Pc = Fc V; tool life T = (C / V)^(1/n)
    """
    try:
        result = compute_metal_cutting(**request.model_dump())
        return MetalCuttingResponse(**result)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")
