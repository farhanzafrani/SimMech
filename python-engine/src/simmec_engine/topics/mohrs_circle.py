"""
Mohr's Circle Module - Stress Transformation and Principal Stresses
Used by Topic: Combined Loading & Mohr's Circle
"""

import numpy as np
from typing import Dict


def compute_mohrs_circle(
    sigma_x: float,
    sigma_y: float,
    tau_xy: float,
    num_points: int = 40,
) -> Dict:
    """
    Compute Mohr's circle for a 2D stress state.

    Args:
        sigma_x: Normal stress on the x-face, MPa
        sigma_y: Normal stress on the y-face, MPa
        tau_xy: Shear stress on the x-face, MPa

    Returns:
        Dictionary with center, radius, principal stresses, principal angle,
        max shear, circle sample points, and the two physical points the
        circle is constructed from.
    """
    sigma_avg = (sigma_x + sigma_y) / 2
    radius = float(np.sqrt(((sigma_x - sigma_y) / 2) ** 2 + tau_xy**2))

    sigma_1 = sigma_avg + radius
    sigma_2 = sigma_avg - radius
    max_shear = radius

    # Principal angle (degrees) — 0.5 * atan2(2*tau_xy, sigma_x - sigma_y)
    theta_p_rad = 0.5 * np.arctan2(2 * tau_xy, sigma_x - sigma_y)
    theta_p_deg = float(np.degrees(theta_p_rad))

    angles = np.linspace(0, 2 * np.pi, num_points)
    circle_points = [
        {'sigma': float(sigma_avg + radius * np.cos(a)), 'tau': float(radius * np.sin(a))}
        for a in angles
    ]

    return {
        'sigma_x': sigma_x,
        'sigma_y': sigma_y,
        'tau_xy': tau_xy,
        'sigma_avg': float(sigma_avg),
        'radius': radius,
        'sigma_1': float(sigma_1),
        'sigma_2': float(sigma_2),
        'theta_p_deg': theta_p_deg,
        'max_shear': float(max_shear),
        'circle_points': circle_points,
        'point_x': {'sigma': sigma_x, 'tau': tau_xy},
        'point_y': {'sigma': sigma_y, 'tau': -tau_xy},
    }
