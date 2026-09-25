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
<<<<<<< Updated upstream
=======
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
>>>>>>> Stashed changes


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
<<<<<<< Updated upstream
=======
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
>>>>>>> Stashed changes
app.include_router(catalog.router)


# ============================================================================
# Development: Run with: uvicorn app:app --reload
# Production: Use gunicorn -w 4 -b 0.0.0.0:8000 app:app
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
