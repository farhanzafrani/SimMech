"""
Sheet-Metal Bending Module
Used by MIT 2.008 Topic: Sheet-Metal Bending, Bend Allowance & Springback

Covers the flat-pattern geometry of a bend (bend allowance / deduction via
the K-factor), the V-die bending force, and elastic springback of an
elastic-perfectly-plastic sheet.
"""

from typing import Dict

import numpy as np


def compute_sheet_metal_bending(
    thickness: float,
    inner_radius: float,
    bend_angle: float,
    k_factor: float,
    flange_a: float,
    flange_b: float,
    yield_strength: float,
    youngs_modulus: float,
    ultimate_strength: float,
    die_opening: float,
    bend_length: float,
) -> Dict:
    """
    Flat-pattern length, bending force, and springback for a single bend.

    Args:
        thickness: Sheet thickness t in mm
        inner_radius: Final inside bend radius r in mm
        bend_angle: Desired final bend angle theta in degrees (deflection from flat; 90 = L-bend)
        k_factor: Neutral-axis location ratio K (0 < K < 0.5)
        flange_a: Outside flange dimension a in mm (to the virtual sharp)
        flange_b: Outside flange dimension b in mm (to the virtual sharp)
        yield_strength: Yield strength Y in MPa
        youngs_modulus: Young's modulus E in MPa
        ultimate_strength: Ultimate tensile strength in MPa (for bend force)
        die_opening: V-die opening W in mm
        bend_length: Length of bend line L (across the sheet) in mm

    Returns:
        Bend allowance, outside setback, bend deduction, flat length,
        bend force, springback factor, tool (overbend) angle, and
        springback angle.

    Springback model: for an elastic-perfectly-plastic rectangular section
    bent to neutral-axis radius R_i (tool), unloading gives
        R_i / R_f = 4 x^3 - 3 x + 1,   x = R_i Y / (E t)
    and, with neutral-axis arc length conserved, the angle ratio
    theta_f / theta_i = R_i / R_f. x >= 0.5 means the section never
    yielded through, so the part springs back fully flat.
    """

    if thickness <= 0:
        raise ValueError("Thickness must be positive")
    if inner_radius < 0:
        raise ValueError("Inner radius must be non-negative")
    if not 0 < bend_angle < 180:
        raise ValueError("Bend angle must be between 0 and 180 degrees")
    if not 0 < k_factor < 0.5:
        raise ValueError("K-factor must be between 0 and 0.5")
    if flange_a < 0 or flange_b < 0:
        raise ValueError("Flange lengths must be non-negative")
    if yield_strength <= 0 or youngs_modulus <= 0 or ultimate_strength <= 0:
        raise ValueError("Strength and modulus values must be positive")
    if die_opening <= 0:
        raise ValueError("Die opening must be positive")
    if bend_length <= 0:
        raise ValueError("Bend length must be positive")

    theta = np.radians(bend_angle)

    # Bend allowance: arc length of the neutral axis, BA = theta (r + K t)
    bend_allowance = theta * (inner_radius + k_factor * thickness)
    # Outside setback: distance from the virtual sharp to the tangent line
    outside_setback = (inner_radius + thickness) * np.tan(theta / 2)
    # Bend deduction: BD = 2 OSSB - BA ; flat length = a + b - BD
    bend_deduction = 2 * outside_setback - bend_allowance
    flat_length = flange_a + flange_b - bend_deduction
    if flat_length <= 0:
        raise ValueError("Flanges are too short for this bend radius (flat length is not positive)")

    # Maximum V-die bending force: F = 1.33 * UTS * L * t^2 / W
    bend_force = 1.33 * ultimate_strength * bend_length * thickness**2 / die_opening  # N

    # Springback (neutral-axis radius of the tool-formed bend)
    r_neutral = inner_radius + thickness / 2
    x = r_neutral * yield_strength / (youngs_modulus * thickness)
    fully_elastic = x >= 0.5
    if fully_elastic:
        # Never yielded through the thickness: springs back flat
        springback_factor = 0.0
        tool_angle = None
        springback_angle = None
        final_radius_neutral = None
    else:
        ratio = 4 * x**3 - 3 * x + 1          # R_i / R_f = theta_f / theta_i
        springback_factor = float(ratio)       # K_s = theta_f / theta_i
        final_radius_neutral = r_neutral / ratio
        tool_angle = bend_angle / ratio
        springback_angle = tool_angle - bend_angle

    return {
        'bend_allowance': float(bend_allowance),
        'outside_setback': float(outside_setback),
        'bend_deduction': float(bend_deduction),
        'flat_length': float(flat_length),
        'bend_force': float(bend_force / 1000.0),  # kN
        'neutral_radius': float(r_neutral),
        'springback_parameter': float(x),
        'fully_elastic': bool(fully_elastic),
        'springback_factor': springback_factor,
        'tool_angle': float(tool_angle) if tool_angle is not None else None,
        'springback_angle': float(springback_angle) if springback_angle is not None else None,
        'final_neutral_radius': float(final_radius_neutral) if final_radius_neutral is not None else None,
        'thickness': thickness,
        'inner_radius': inner_radius,
        'bend_angle': bend_angle,
        'radius_to_thickness': float(inner_radius / thickness),
    }
