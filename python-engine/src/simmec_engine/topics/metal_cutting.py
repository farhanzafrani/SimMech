"""
Metal Cutting Mechanics Module
Used by MIT 2.008 Topic: Metal Cutting - Merchant Circle & Tool Life

Orthogonal cutting is idealised as a thin shear plane at angle phi that
separates the uncut layer from the chip. The Merchant force circle resolves
the single resultant tool force R into shear, friction, and cutting/thrust
components, and the Merchant shear-angle relation (minimum-energy
assumption) predicts phi from the rake and friction angles. Taylor's
equation V * T^n = C then ties cutting speed to tool life.
"""

from typing import Dict

import numpy as np


def compute_metal_cutting(
    uncut_thickness: float,
    width_of_cut: float,
    rake_angle: float,
    friction_angle: float,
    shear_strength: float,
    cutting_speed: float,
    taylor_n: float,
    taylor_c: float,
) -> Dict:
    """
    Orthogonal-cutting forces, power, chip geometry, and Taylor tool life.

    Args:
        uncut_thickness: Uncut chip thickness t0 in mm (the feed per rev in turning)
        width_of_cut: Width of cut w in mm
        rake_angle: Tool rake angle alpha in degrees (positive = sharper tool)
        friction_angle: Tool-chip friction angle beta in degrees (tan beta = mu)
        shear_strength: Shear flow stress of the work material tau_s in MPa
        cutting_speed: Cutting speed V in m/min
        taylor_n: Taylor exponent n (V T^n = C)
        taylor_c: Taylor constant C in m/min (the speed giving T = 1 min)

    Returns:
        Dictionary with the Merchant shear angle, chip ratio, chip
        thickness, the force-circle components, specific cutting energy,
        cutting power, material removal rate, and Taylor tool life.
    """

    if uncut_thickness <= 0:
        raise ValueError("Uncut chip thickness must be positive")
    if width_of_cut <= 0:
        raise ValueError("Width of cut must be positive")
    if not -20 <= rake_angle <= 45:
        raise ValueError("Rake angle must be between -20 and 45 degrees")
    if not 0 < friction_angle < 90:
        raise ValueError("Friction angle must be between 0 and 90 degrees")
    if shear_strength <= 0:
        raise ValueError("Shear strength must be positive")
    if cutting_speed <= 0:
        raise ValueError("Cutting speed must be positive")
    if taylor_n <= 0:
        raise ValueError("Taylor exponent n must be positive")
    if taylor_c <= 0:
        raise ValueError("Taylor constant C must be positive")

    alpha = np.radians(rake_angle)
    beta = np.radians(friction_angle)

    # Merchant shear-angle relation: phi = 45 deg + alpha/2 - beta/2
    phi = np.pi / 4 + alpha / 2 - beta / 2
    if phi <= 0 or phi + beta - alpha >= np.pi / 2:
        raise ValueError(
            "Friction angle too large for this rake angle: the shear plane "
            "collapses (phi + beta - alpha must stay below 90 degrees)"
        )

    # Chip ratio r = t0 / tc = sin(phi) / cos(phi - alpha)
    chip_ratio = np.sin(phi) / np.cos(phi - alpha)
    chip_thickness = uncut_thickness / chip_ratio

    # Shear-plane area and shear force: Fs = tau_s * t0 * w / sin(phi)
    shear_area = uncut_thickness * width_of_cut / np.sin(phi)
    shear_force = shear_strength * shear_area

    # Merchant circle: resultant R, then project onto the cutting direction
    resultant = shear_force / np.cos(phi + beta - alpha)
    cutting_force = resultant * np.cos(beta - alpha)   # Fc, along V
    thrust_force = resultant * np.sin(beta - alpha)    # Ft, normal to V

    # Friction and normal force on the rake face
    friction_force = resultant * np.sin(beta)
    normal_force = resultant * np.cos(beta)

    # Specific cutting energy u = Fc / (t0 w), N/mm^2 = MPa = J/mm^3 (x1e-3 -> J/mm^3)
    specific_energy = cutting_force / (uncut_thickness * width_of_cut)

    # Power: Pc = Fc * V, with V converted from m/min to m/s
    cutting_power = cutting_force * cutting_speed / 60.0          # W
    # Material removal rate in mm^3/min, then cm^3/min
    mrr = cutting_speed * 1000.0 * uncut_thickness * width_of_cut  # mm^3/min

    # Taylor: V T^n = C  ->  T = (C / V)^(1/n)
    tool_life = (taylor_c / cutting_speed) ** (1.0 / taylor_n)

    return {
        'shear_angle': float(np.degrees(phi)),
        'chip_ratio': float(chip_ratio),
        'chip_thickness': float(chip_thickness),
        'shear_force': float(shear_force),
        'resultant_force': float(resultant),
        'cutting_force': float(cutting_force),
        'thrust_force': float(thrust_force),
        'friction_force': float(friction_force),
        'normal_force': float(normal_force),
        'friction_coefficient': float(np.tan(beta)),
        'specific_energy': float(specific_energy),
        'cutting_power': float(cutting_power),
        'material_removal_rate': float(mrr / 1000.0),  # cm^3/min
        'tool_life': float(tool_life),
    }
