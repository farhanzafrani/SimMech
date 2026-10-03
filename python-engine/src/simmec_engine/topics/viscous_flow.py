"""
Viscous Flow Module
Used by Fluid Mechanics Topic: Viscous Flow (Couette, Poiseuille, Reynolds Number)

Two exact solutions of the Navier-Stokes equations for steady, fully
developed laminar flow, plus the Reynolds number that tells you whether
the laminar assumption is still believable:

    Couette (plane) flow  - fluid between two parallel plates, the top one
                            sliding at U, with an optional pressure gradient
    Poiseuille flow       - pressure-driven laminar flow in a round pipe
                            (Hagen-Poiseuille)
"""

from typing import Dict

import numpy as np

# Pipe-flow regime boundaries (widely used engineering values)
RE_LAMINAR_MAX = 2300.0
RE_TURBULENT_MIN = 4000.0


def classify_regime(reynolds: float) -> str:
    if reynolds < RE_LAMINAR_MAX:
        return 'laminar'
    if reynolds < RE_TURBULENT_MIN:
        return 'transitional'
    return 'turbulent'


def compute_couette_flow(
    gap: float,
    plate_velocity: float,
    viscosity: float,
    density: float,
    pressure_gradient: float = 0.0,
) -> Dict:
    """
    Plane Couette flow with optional pressure gradient dp/dx.

    u(y) = U y/h - (1/(2 mu)) (dp/dx) y (h - y)

    Args:
        gap: Plate separation h in m
        plate_velocity: Upper plate speed U in m/s (lower plate fixed)
        viscosity: Dynamic viscosity mu in Pa.s
        density: Density rho in kg/m^3
        pressure_gradient: dp/dx in Pa/m (negative drives flow in +x)
    """
    if gap <= 0:
        raise ValueError("Gap must be positive")
    if viscosity <= 0:
        raise ValueError("Viscosity must be positive")
    if density <= 0:
        raise ValueError("Density must be positive")

    y = np.linspace(0, gap, 41)
    u = plate_velocity * y / gap - pressure_gradient / (2 * viscosity) * y * (gap - y)

    # Wall shear stresses tau = mu du/dy
    dudy_lower = plate_velocity / gap - pressure_gradient * gap / (2 * viscosity)
    dudy_upper = plate_velocity / gap + pressure_gradient * gap / (2 * viscosity)
    tau_lower = viscosity * dudy_lower
    tau_upper = viscosity * dudy_upper

    # Flow rate per unit width and mean velocity
    q_per_width = plate_velocity * gap / 2 - pressure_gradient * gap**3 / (12 * viscosity)
    mean_velocity = q_per_width / gap

    reynolds = density * abs(plate_velocity) * gap / viscosity

    return {
        'mode': 'couette',
        'profile': {'y': y.tolist(), 'u': u.tolist()},
        'tau_lower': float(tau_lower),
        'tau_upper': float(tau_upper),
        'flow_rate': float(q_per_width),       # m^2/s (per unit width)
        'mean_velocity': float(mean_velocity),
        'max_velocity': float(np.max(u)),
        'reynolds': float(reynolds),
        'regime': classify_regime(reynolds),
        'laminar_valid': bool(reynolds < RE_LAMINAR_MAX),
        'friction_factor': None,
    }


def compute_pipe_poiseuille(
    diameter: float,
    length: float,
    pressure_drop: float,
    viscosity: float,
    density: float,
) -> Dict:
    """
    Hagen-Poiseuille flow in a round pipe driven by a pressure drop.

    Q = pi D^4 dp / (128 mu L),  u(r) = u_max (1 - (r/R)^2),  u_max = 2 V.
    The result is physically valid only while Re < ~2300; above that the
    values returned are what laminar theory *would* give and are flagged.
    """
    if diameter <= 0:
        raise ValueError("Diameter must be positive")
    if length <= 0:
        raise ValueError("Pipe length must be positive")
    if pressure_drop < 0:
        raise ValueError("Pressure drop must be non-negative")
    if viscosity <= 0:
        raise ValueError("Viscosity must be positive")
    if density <= 0:
        raise ValueError("Density must be positive")

    radius = diameter / 2
    area = np.pi * radius**2
    q = np.pi * diameter**4 * pressure_drop / (128 * viscosity * length)
    mean_velocity = q / area
    max_velocity = 2 * mean_velocity
    wall_shear = pressure_drop * diameter / (4 * length)
    reynolds = density * mean_velocity * diameter / viscosity
    friction_factor = 64 / reynolds if reynolds > 0 else None

    r = np.linspace(-radius, radius, 41)
    u = max_velocity * (1 - (r / radius) ** 2)

    return {
        'mode': 'pipe',
        'profile': {'y': (r + radius).tolist(), 'u': u.tolist()},
        'flow_rate': float(q),                 # m^3/s
        'mean_velocity': float(mean_velocity),
        'max_velocity': float(max_velocity),
        'wall_shear': float(wall_shear),
        'tau_lower': float(wall_shear),
        'tau_upper': float(wall_shear),
        'reynolds': float(reynolds),
        'regime': classify_regime(reynolds),
        'laminar_valid': bool(reynolds < RE_LAMINAR_MAX),
        'friction_factor': None if friction_factor is None else float(friction_factor),
    }
