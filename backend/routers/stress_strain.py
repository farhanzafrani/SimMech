"""Stress-Strain Analysis API routes"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

from simmec_engine.topics.mechanics import (
    compute_stress_strain,
    generate_stress_strain_curve,
    compute_material_deformation_3d,
)

router = APIRouter(prefix="/api/stress-strain", tags=["stress-strain"])


class StressStrainRequest(BaseModel):
    """Request model for stress-strain analysis"""
    applied_stress: float
    youngs_modulus: float
    poisson_ratio: float
    yield_stress: float


class StressStrainResponse(BaseModel):
    """Response model for stress-strain analysis"""
    applied_stress: float
    axial_strain: float
    lateral_strain: float
    volumetric_strain: float
    region: str
    properties: dict


class StressStrainCurveRequest(BaseModel):
    """Request for generating stress-strain curve"""
    youngs_modulus: float
    yield_stress: float
    ultimate_stress: float
    max_strain: Optional[float] = 0.05
    num_points: Optional[int] = 100


class Material3DDeformationRequest(BaseModel):
    """Request for 3D material deformation"""
    applied_stress: float
    youngs_modulus: float
    poisson_ratio: float
    original_length: Optional[float] = 1.0
    original_width: Optional[float] = 1.0
    original_height: Optional[float] = 1.0


@router.post("/compute", response_model=StressStrainResponse)
async def compute_stress_strain_endpoint(request: StressStrainRequest):
    """
    Compute stress-strain relationship

    Given applied stress and material properties, compute:
    - Axial strain (ε = σ/E)
    - Lateral strain (ε_lateral = -νε_axial)
    - Volumetric strain
    - Deformation region (elastic/plastic/fracture)
    """
    try:
        result = compute_stress_strain(
            applied_stress=request.applied_stress,
            youngs_modulus=request.youngs_modulus,
            poisson_ratio=request.poisson_ratio,
            yield_stress=request.yield_stress,
        )

        return StressStrainResponse(
            applied_stress=result['applied_stress'],
            axial_strain=result['axial_strain'],
            lateral_strain=result['lateral_strain'],
            volumetric_strain=result['volumetric_strain'],
            region=result['region'],
            properties=result['properties'],
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")


@router.post("/curve")
async def get_stress_strain_curve(request: StressStrainCurveRequest):
    """
    Generate complete stress-strain curve (elastic + plastic regions)
    """
    try:
        strains, stresses = generate_stress_strain_curve(
            youngs_modulus=request.youngs_modulus,
            yield_stress=request.yield_stress,
            ultimate_stress=request.ultimate_stress,
            max_strain=request.max_strain,
            num_points=request.num_points,
        )

        # Combine into list of points
        curve = [
            {"strain": strain, "stress": stress}
            for strain, stress in zip(strains, stresses)
        ]

        return {
            "curve": curve,
            "youngs_modulus": request.youngs_modulus,
            "yield_stress": request.yield_stress,
            "ultimate_stress": request.ultimate_stress,
            "max_strain": request.max_strain,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Curve generation error: {str(e)}")


@router.post("/3d-deformation")
async def get_3d_deformation(request: Material3DDeformationRequest):
    """
    Compute 3D material deformation under uniaxial stress
    Returns deformed cube vertices for 3D visualization
    """
    try:
        result = compute_material_deformation_3d(
            applied_stress=request.applied_stress,
            youngs_modulus=request.youngs_modulus,
            poisson_ratio=request.poisson_ratio,
            original_length=request.original_length,
            original_width=request.original_width,
            original_height=request.original_height,
        )

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"3D deformation error: {str(e)}")


@router.post("/batch")
async def batch_stress_strain(requests: list[StressStrainRequest]):
    """
    Batch compute stress-strain for multiple stress values
    Useful for generating curves or parameter studies
    """
    try:
        results = []
        for req in requests:
            result = compute_stress_strain(
                applied_stress=req.applied_stress,
                youngs_modulus=req.youngs_modulus,
                poisson_ratio=req.poisson_ratio,
                yield_stress=req.yield_stress,
            )
            results.append({
                "applied_stress": result['applied_stress'],
                "axial_strain": result['axial_strain'],
                "lateral_strain": result['lateral_strain'],
                "volumetric_strain": result['volumetric_strain'],
                "region": result['region'],
            })

        return {"results": results}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Batch error: {str(e)}")
