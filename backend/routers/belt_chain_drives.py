"""Belt and Chain Drives API routes"""

from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from simmec_engine.topics.belt_chain_drives import compute_belt_drive, compute_chain_drive

router = APIRouter(prefix="/api/belt-chain-drives", tags=["belt-chain-drives"])


class BeltDriveRequest(BaseModel):
    """Request model for an open belt drive at the limit of slipping"""
    driver_diameter: float
    driven_diameter: float
    center_distance: float
    driver_rpm: float
    friction_coefficient: float
    tight_tension: float
    belt_mass_per_length: float = 0.0
    groove_angle_deg: Optional[float] = None


class BeltDriveResponse(BaseModel):
    speed_ratio: float
    driven_rpm: float
    belt_speed: float
    wrap_angle_deg: float
    wrap_angle_rad: float
    belt_length: float
    effective_friction: float
    tension_ratio: float
    centrifugal_tension: float
    tight_tension: float
    slack_tension: float
    power_w: float
    power_kw: float
    torque_driver: float


class ChainDriveRequest(BaseModel):
    """Request model for a roller-chain drive"""
    chain_pitch: float
    driver_teeth: float
    driven_teeth: float
    driver_rpm: float
    chain_pull: float


class ChainDriveResponse(BaseModel):
    speed_ratio: float
    driven_rpm: float
    driver_pitch_diameter: float
    driven_pitch_diameter: float
    chain_speed: float
    chain_pull: float
    power_w: float
    power_kw: float
    torque_driver: float


@router.post("/belt", response_model=BeltDriveResponse)
async def compute_belt_endpoint(request: BeltDriveRequest):
    """
    Speed ratio, wrap angle, capstan tension ratio, slack tension and power
    of an open belt drive, assuming the belt is on the verge of slipping on
    the smaller pulley. Optional V-groove angle and centrifugal tension.
    """
    try:
        return BeltDriveResponse(**compute_belt_drive(**request.model_dump()))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")


@router.post("/chain", response_model=ChainDriveResponse)
async def compute_chain_endpoint(request: ChainDriveRequest):
    """Speed ratio, pitch diameters, chain speed and power of a roller-chain drive."""
    try:
        return ChainDriveResponse(**compute_chain_drive(**request.model_dump()))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")
