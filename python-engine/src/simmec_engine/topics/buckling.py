"""Columns & Buckling — Euler critical load computation."""

from typing import Dict

import numpy as np

END_CONDITIONS = {
    "pinned-pinned": 1.0,
    "fixed-free": 2.0,
    "fixed-pinned": 0.7,
    "fixed-fixed": 0.5,
}


def compute_buckling(
    length: float,
    end_condition: str,
    youngs_modulus: float,
    width: float,
    height: float,
    applied_load: float,
    num_points: int = 50,
) -> Dict:
    """
    Compute the Euler critical buckling load for a slender column with a
    solid rectangular cross-section, pinned/fixed per `end_condition`.

    Args:
        length: Column length L in meters
        end_condition: One of "pinned-pinned", "fixed-free", "fixed-pinned", "fixed-fixed"
        youngs_modulus: Young's modulus E in MPa
        width: Cross-section width in mm
        height: Cross-section height in mm
        applied_load: Applied axial load P in kN
        num_points: Number of points along the buckled mode-shape curve

    Returns:
        Dictionary with section properties, slenderness ratio, critical
        load, safety factor, and a normalized mode-shape point list.

    A column buckles about its weak axis: the second moment of area uses
    the SMALLER cross-section dimension as the bending depth.
    """

    if length <= 0:
        raise ValueError("Length must be positive")
    if width <= 0 or height <= 0:
        raise ValueError("Width and height must be positive")
    if youngs_modulus <= 0:
        raise ValueError("Young's modulus must be positive")
    if end_condition not in END_CONDITIONS:
        raise ValueError(f"Unknown end_condition: {end_condition}")

    k = END_CONDITIONS[end_condition]

    b = max(width, height)  # mm, the dimension NOT governing bending
    h = min(width, height)  # mm, the weak-axis depth

    area = width * height  # mm^2
    moment_of_inertia = b * h**3 / 12  # mm^4 (weak-axis I)

    radius_of_gyration = np.sqrt(moment_of_inertia / area)  # mm
    slenderness_ratio = (k * length * 1000.0) / radius_of_gyration  # L in mm / r in mm

    # P_cr = pi^2 * E * I / (K*L)^2, working in Pa/m^4/m to get Newtons.
    e_pa = youngs_modulus * 1e6  # MPa -> Pa
    i_m4 = moment_of_inertia * 1e-12  # mm^4 -> m^4
    kl_m = k * length  # m

    critical_load_n = (np.pi**2) * e_pa * i_m4 / (kl_m**2)
    critical_load_kn = critical_load_n / 1000.0

    safety_factor = critical_load_kn / applied_load if applied_load > 0 else float("inf")

    # Schematic mode shape: the classic pinned-pinned half-sine, reused
    # for all end conditions here since this is a visualization aid, not
    # an exact mode shape for the fixed/free cases.
    xs = np.linspace(0, length, num_points)
    mode_shape = [
        {"x": float(x), "y": float(np.sin(np.pi * x / length))}
        for x in xs
    ]

    return {
        "length": length,
        "end_condition": end_condition,
        "width": width,
        "height": height,
        "applied_load": applied_load,
        "moment_of_inertia": float(moment_of_inertia),
        "area": float(area),
        "radius_of_gyration": float(radius_of_gyration),
        "slenderness_ratio": float(slenderness_ratio),
        "critical_load": float(critical_load_kn),
        "safety_factor": float(safety_factor),
        "mode_shape": mode_shape,
    }
