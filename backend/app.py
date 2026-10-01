"""
SimMec FastAPI Backend
Serves interactive mechanical engineering topics
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from config import settings
from routers import stress_strain, catalog
from routers import four_bar_linkage
from routers import torsion
from routers import axial_loading
from routers import shear_bending
from routers import bending_stress
from routers import beam_deflection
from routers import mohrs_circle
from routers import buckling
from routers import failure_theories
from routers import fatigue_analysis
from routers import shaft_design
from routers import spring_design
from routers import bolted_joints
from routers import bearing_selection
from routers import particle_kinematics
from routers import newton_work_energy
from routers import rigid_body_planar_kinematics
from routers import first_law_thermodynamics
from routers import fluid_statics_bernoulli
from routers import pipe_flow_heat_transfer
from routers import gear_tooth_bending
from routers import belt_chain_drives
from routers import statics_equilibrium
from routers import statics_truss
from routers import statics_friction
from routers import statics_centroids
from routers import rigid_body_kinetics
from routers import free_vibration
from routers import forced_vibration
from routers import step_response
from routers import pid_tuning
from routers import root_locus_stability
from routers import frequency_response_bode
from routers import control_volume_momentum
from routers import viscous_flow
from routers import boundary_layer
from routers import drag_lift
from routers import pump_system
from routers import robotics_kinematics
from routers import metal_cutting
from routers import material_selection
from routers import phase_diagram_lever_rule
from routers import sheet_metal_bending
from routers import tolerance_stackup
from routers import second_law
from routers import power_cycles
from routers import conduction_networks
from routers import fin_heat_transfer
from routers import transient_lumped
from routers import convection_heat_exchangers


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan: startup and shutdown events"""
    print("✓ SimMec API Starting...")
    print("✓ API Documentation: http://localhost:8000/docs")
    yield
    print("✓ SimMec API Shutting down...")


# Initialize FastAPI app
app = FastAPI(
    title="SimMec API",
    description="Interactive Mechanical Engineering Learning Platform",
    version="0.1.0",
    lifespan=lifespan,
)

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================================
# Custom Exception Handler
# ============================================================================

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Custom HTTP exception handler returning JSON"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.detail,
            "status_code": exc.status_code,
        }
    )


# ============================================================================
# Routes: Health & Info
# ============================================================================

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "SimMec - Interactive Mechanical Engineering Platform",
        "version": "0.1.0",
        "status": "running",
    }


@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "healthy"}


# ============================================================================
# Include Feature Routers
# ============================================================================

app.include_router(stress_strain.router)
app.include_router(four_bar_linkage.router)
app.include_router(torsion.router)
app.include_router(axial_loading.router)
app.include_router(shear_bending.router)
app.include_router(bending_stress.router)
app.include_router(beam_deflection.router)
app.include_router(mohrs_circle.router)
app.include_router(buckling.router)
app.include_router(failure_theories.router)
app.include_router(fatigue_analysis.router)
app.include_router(shaft_design.router)
app.include_router(spring_design.router)
app.include_router(bolted_joints.router)
app.include_router(bearing_selection.router)
app.include_router(particle_kinematics.router)
app.include_router(newton_work_energy.router)
app.include_router(rigid_body_planar_kinematics.router)
app.include_router(first_law_thermodynamics.router)
app.include_router(fluid_statics_bernoulli.router)
app.include_router(pipe_flow_heat_transfer.router)
app.include_router(gear_tooth_bending.router)
app.include_router(belt_chain_drives.router)
app.include_router(statics_equilibrium.router)
app.include_router(statics_truss.router)
app.include_router(statics_friction.router)
app.include_router(statics_centroids.router)
app.include_router(rigid_body_kinetics.router)
app.include_router(free_vibration.router)
app.include_router(forced_vibration.router)
app.include_router(step_response.router)
app.include_router(pid_tuning.router)
app.include_router(root_locus_stability.router)
app.include_router(frequency_response_bode.router)
app.include_router(control_volume_momentum.router)
app.include_router(viscous_flow.router)
app.include_router(boundary_layer.router)
app.include_router(drag_lift.router)
app.include_router(pump_system.router)
app.include_router(robotics_kinematics.router)
app.include_router(metal_cutting.router)
app.include_router(material_selection.router)
app.include_router(phase_diagram_lever_rule.router)
app.include_router(sheet_metal_bending.router)
app.include_router(tolerance_stackup.router)
app.include_router(second_law.router)
app.include_router(power_cycles.router)
app.include_router(conduction_networks.router)
app.include_router(fin_heat_transfer.router)
app.include_router(transient_lumped.router)
app.include_router(convection_heat_exchangers.router)
app.include_router(catalog.router)


# ============================================================================
# Development: Run with: uvicorn app:app --reload
# Production: Use gunicorn -w 4 -b 0.0.0.0:8000 app:app
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
