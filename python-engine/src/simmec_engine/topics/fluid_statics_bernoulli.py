"""Fluid Statics & Bernoulli's Equation — incompressible flow through a
constriction.

An incompressible, inviscid fluid flows steadily through a pipe that
narrows from area A1 to area A2. Continuity (mass conservation) forces the
fluid to speed up where the pipe is narrower; Bernoulli's equation then
says that speeding up costs pressure — the classic Venturi effect used in
carburetors, flow meters, and aircraft wings.

Units: density in kg/m^3, areas in m^2, velocity in m/s, pressure in Pa.
Elevation change is assumed zero (horizontal pipe).
"""

from typing import Dict, List

import numpy as np


def compute_fluid_statics_bernoulli(
    density: float,
    area1: float,
    area2: float,
    velocity1: float,
    pressure1: float,
    num_curve_points: int = 40,
) -> Dict:
    """
    Compute the downstream velocity and pressure at a pipe constriction
    using continuity and Bernoulli's equation (horizontal pipe, no
    elevation change).

    Args:
        density: Fluid density rho, in kg/m^3.
        area1: Upstream cross-sectional area A1, in m^2.
        area2: Downstream (constriction) cross-sectional area A2, in m^2.
        pressure1: Upstream pressure p1, in Pa.
        velocity1: Upstream velocity v1, in m/s.
        num_curve_points: Number of points along the area-ratio sweep for
            the pressure-drop visualization curve.

    Returns:
        Dictionary with the downstream velocity and pressure, the dynamic
        pressure change, and a curve of pressure2 vs. area ratio (A2/A1)
        at the same upstream conditions.

    Formulas:
        continuity:  v2 = v1 * A1 / A2
        Bernoulli:   p1 + 0.5 rho v1^2 = p2 + 0.5 rho v2^2
                     p2 = p1 + 0.5 rho (v1^2 - v2^2)
    """

    if density <= 0:
        raise ValueError("density must be positive")
    if area1 <= 0 or area2 <= 0:
        raise ValueError("areas must be positive")
    if velocity1 < 0:
        raise ValueError("velocity1 must be non-negative")

    velocity2 = velocity1 * area1 / area2
    dynamic_pressure_change = 0.5 * density * (velocity1**2 - velocity2**2)
    pressure2 = pressure1 + dynamic_pressure_change

    area_ratios = np.linspace(0.1, 1.0, num_curve_points)
    curve: List[Dict] = []
    for ratio in area_ratios:
        v2 = velocity1 / ratio
        p2 = pressure1 + 0.5 * density * (velocity1**2 - v2**2)
        curve.append({"area_ratio": float(ratio), "pressure2": float(p2)})

    return {
        "density": float(density),
        "area1": float(area1),
        "area2": float(area2),
        "velocity1": float(velocity1),
        "pressure1": float(pressure1),
        "velocity2": float(velocity2),
        "pressure2": float(pressure2),
        "dynamic_pressure_change": float(dynamic_pressure_change),
        "curve": curve,
    }
