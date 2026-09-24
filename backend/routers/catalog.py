"""Topic catalog and materials API routes"""

from fastapi import APIRouter

from simmec_engine.topics.mechanics import MATERIALS

router = APIRouter(prefix="/api", tags=["catalog"])


@router.get("/topics")
async def get_topics():
    """Get list of available topics"""
    return {
        "topics": [
            {
                "id": "2.001-stress-strain",
                "title": "Stress-Strain Analysis",
                "course": "2.001",
                "description": "Interactive stress-strain visualization and analysis",
                "status": "active",
            }
        ]
    }


@router.get("/materials")
async def get_materials():
    """Get list of available materials"""
    materials_list = []
    for key, mat in MATERIALS.items():
        materials_list.append({
            "id": key,
            "name": mat.name,
            "youngs_modulus": mat.youngs_modulus,
            "yield_stress": mat.yield_stress,
            "poisson_ratio": mat.poisson_ratio,
            "density": mat.density,
            "ultimate_stress": mat.ultimate_stress,
        })
    return {"materials": materials_list}
