"""Axial Loading API routes"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from simmec_engine.topics.axial_loading import (
    compute_axial_loading,
    compute_two_rod_axial_loading,
)

router = APIRouter(prefix="/api/axial-loading", tags=["axial-loading"])


class AxialLoadingRequest(BaseModel):
    """Request model for axial loading analysis"""
    force: float
    length: float
    area: float
    youngs_modulus: float
    alpha: float
    delta_t: float
    yield_stress: float
    constrained: bool = False


class AxialLoadingResponse(BaseModel):
    """Response model for axial loading analysis"""
    force: float
    length: float
    area: float
    constrained: bool
    mechanical_stress: float
    thermal_stress: float
    total_stress: float
    mechanical_elongation: float
    thermal_elongation: float
    total_elongation: float
    safety_factor: float
    properties: dict


@router.post("/compute", response_model=AxialLoadingResponse)
async def compute_axial_loading_endpoint(request: AxialLoadingRequest):
    """
    Compute elongation and stress for a bar under axial force and a
    temperature change, either free to expand or fully constrained.

    - Free: δ = FL/(AE) + αΔTL (mechanical + thermal elongation superpose)
    - Constrained: elongation is zero; blocked thermal strain becomes
      stress instead (σ_T = EαΔT), superposed with any mechanical stress F/A
    """
    try:
        result = compute_axial_loading(
            force=request.force,
            length=request.length,
            area=request.area,
            youngs_modulus=request.youngs_modulus,
            alpha=request.alpha,
            delta_t=request.delta_t,
            yield_stress=request.yield_stress,
            constrained=request.constrained,
        )
        return AxialLoadingResponse(**result)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")


class TwoRodAxialLoadingRequest(BaseModel):
    """Request model for the statically-indeterminate two-rod analysis"""
    force: float
    length: float
    area_1: float
    area_2: float
    youngs_modulus_1: float
    youngs_modulus_2: float
    yield_stress_1: float
    yield_stress_2: float


class TwoRodAxialLoadingResponse(BaseModel):
    """Response model for the statically-indeterminate two-rod analysis"""
    force: float
    length: float
    area_1: float
    area_2: float
    force_1: float
    force_2: float
    stress_1: float
    stress_2: float
    elongation: float
    safety_factor_1: float
    safety_factor_2: float
    properties: dict


@router.post("/two-rod", response_model=TwoRodAxialLoadingResponse)
async def compute_two_rod_axial_loading_endpoint(request: TwoRodAxialLoadingRequest):
    """
    Compute the force split, stress, and common elongation for two rods of
    possibly different stiffness connected in parallel between two rigid
    plates and carrying a combined external axial force.

    This is the classic statically-indeterminate axial member: statics only
    gives F1 + F2 = F, so the extra compatibility equation δ1 = δ2 is used
    to find how the stiffer rod (larger AE) picks up more of the load.
    """
    try:
        result = compute_two_rod_axial_loading(
            force=request.force,
            length=request.length,
            area_1=request.area_1,
            area_2=request.area_2,
            youngs_modulus_1=request.youngs_modulus_1,
            youngs_modulus_2=request.youngs_modulus_2,
            yield_stress_1=request.yield_stress_1,
            yield_stress_2=request.yield_stress_2,
        )
        return TwoRodAxialLoadingResponse(**result)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")
