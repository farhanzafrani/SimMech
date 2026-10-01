"""Rigid-Body Planar Kinematics — instantaneous-center velocity analysis.

A wheel of radius r rolls without slipping at angular velocity omega. The
contact point with the ground is the instantaneous center of rotation (IC)
— momentarily at rest. Every other point's speed equals omega times its
distance from the IC, so different points on the same rigid body move at
very different speeds at any instant, even though the body has one angular
velocity.

Units: radius in meters, angular_velocity in rad/s, point_angle_deg in
degrees measured from the TOP of the wheel down toward the contact point
(0 deg = top, 180 deg = bottom / IC).
"""

from typing import Dict, List

import numpy as np


def _point_velocity(radius: float, angular_velocity: float, point_angle_deg: float) -> float:
    """v = omega * distance_from_IC, where distance_from_IC = 2r cos(phi/2)."""
    distance_from_ic = 2.0 * radius * np.cos(np.radians(point_angle_deg) / 2.0)
    return float(angular_velocity * distance_from_ic)


def compute_rigid_body_planar_kinematics(
    radius: float,
    angular_velocity: float,
    point_angle_deg: float,
    num_curve_points: int = 40,
) -> Dict:
    """
    Compute the velocity of a point on a rolling wheel's rim from the
    instantaneous-center method, plus a curve of velocity vs. point angle
    for visualization.

    Formulas:
        center_velocity = omega * r
        distance_from_IC = 2 r cos(phi / 2)
        point_velocity = omega * distance_from_IC = 2 * center_velocity * cos(phi / 2)

    Checkpoints: phi=0 (top) -> point_velocity = 2 * center_velocity.
                 phi=180 (bottom/IC) -> point_velocity = 0.
                 phi=90 (side) -> point_velocity = center_velocity * sqrt(2).
    """
    if radius <= 0:
        raise ValueError("radius must be positive")
    if angular_velocity < 0:
        raise ValueError("angular_velocity must be non-negative")
    if not (0 <= point_angle_deg <= 180):
        raise ValueError("point_angle_deg must be between 0 and 180")

    center_velocity = float(angular_velocity * radius)
    point_velocity = _point_velocity(radius, angular_velocity, point_angle_deg)

    angles = np.linspace(0, 180, num_curve_points)
    curve: List[Dict] = [
        {"angle_deg": float(a), "velocity": _point_velocity(radius, angular_velocity, a)}
        for a in angles
    ]

    return {
        "radius": float(radius),
        "angular_velocity": float(angular_velocity),
        "point_angle_deg": float(point_angle_deg),
        "center_velocity": center_velocity,
        "point_velocity": point_velocity,
        "curve": curve,
    }
