"""4-Bar Linkage Kinematics API routes"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

from simmec_engine.topics.kinematics import (
    compute_4bar_linkage,
    generate_4bar_motion_curve,
    check_4bar_assembly_modes,
)

router = APIRouter(prefix="/api/4bar-linkage", tags=["4bar-linkage"])


class FourBarComputeRequest(BaseModel):
    """Request for 4-bar linkage computation"""
    L1: float  # Ground link
    L2: float  # Crank
    L3: float  # Coupler
    L4: float  # Follower
    theta2_deg: float  # Input angle in degrees


class MotionCurveRequest(BaseModel):
    """Request for motion curve generation"""
    L1: float
    L2: float
    L3: float
    L4: float
    num_points: Optional[int] = 100


class AssemblyCheckRequest(BaseModel):
    """Request for assembly mode check"""
    L1: float
    L2: float
    L3: float
    L4: float


@router.post("/compute")
async def compute_linkage(request: FourBarComputeRequest):
    """
    Compute 4-bar linkage mechanism positions and angles.

    Given link lengths and input crank angle, computes:
    - Joint positions (A, B, C, D)
    - Output angles (theta3, theta4)
    - Transmission angle and mechanical advantage
    """
    try:
        result = compute_4bar_linkage(
            L1=request.L1,
            L2=request.L2,
            L3=request.L3,
            L4=request.L4,
            theta2_deg=request.theta2_deg,
        )

        if result['status'] != 'ok':
            raise HTTPException(status_code=400, detail=result.get('message', 'Mechanism locked'))

        return result

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")


@router.post("/motion-curve")
async def get_motion_curve(request: MotionCurveRequest):
    """
    Generate complete motion curve for a 4-bar linkage mechanism.

    Shows how output angle varies over a complete input cycle.
    """
    try:
        result = generate_4bar_motion_curve(
            L1=request.L1,
            L2=request.L2,
            L3=request.L3,
            L4=request.L4,
            num_points=request.num_points,
        )

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Curve generation error: {str(e)}")


@router.post("/assembly-check")
async def check_assembly(request: AssemblyCheckRequest):
    """
    Check if 4-bar linkage can be assembled and determine mechanism type.

    Uses Grashof's Law to classify:
    - GRASHOF: shortest link can rotate continuously
    - NON-GRASHOF: all links can only oscillate
    """
    try:
        result = check_4bar_assembly_modes(
            L1=request.L1,
            L2=request.L2,
            L3=request.L3,
            L4=request.L4,
        )

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Assembly check error: {str(e)}")
