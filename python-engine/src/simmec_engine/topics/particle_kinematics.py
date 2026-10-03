"""Kinematics of Particles — tangential/normal acceleration decomposition.

Before any force enters the picture, motion itself has a vocabulary. Split
a particle's acceleration into a tangential component (speeding up or
slowing down along the path) and a normal/centripetal component (turning,
toward the center of curvature) — the two pieces add as vectors, not
scalars, since they point in perpendicular directions.

Units: speed in m/s, accelerations in m/s^2, radius of curvature in m.
"""

from typing import Dict, List

import numpy as np


def compute_particle_kinematics(
    speed: float,
    tangential_accel: float,
    radius_of_curvature: float,
    num_curve_points: int = 40,
) -> Dict:
    """
    Compute the normal and total acceleration of a particle moving along a
    curved path, given its instantaneous speed, tangential acceleration,
    and the path's radius of curvature at that point.

    Args:
        speed: Instantaneous speed v, in m/s. Must be >= 0.
        tangential_accel: Rate of change of speed along the path, dv/dt,
            in m/s^2. May be negative (slowing down).
        radius_of_curvature: Radius of curvature of the path at this
            point, rho, in m. Must be > 0 (a straight line has infinite
            radius, so this model only covers genuinely curved paths).
        num_curve_points: Number of points to sample for the a_n-vs-v
            visualization curve.

    Returns:
        Dictionary with the normal acceleration, total acceleration, the
        angle the total acceleration makes with the tangential direction,
        and a curve of (speed, normal_accel) pairs at the same radius of
        curvature for plotting.

    Formulas:
        a_n = v^2 / rho
        a = sqrt(a_t^2 + a_n^2)
        angle_from_tangent = atan2(a_n, a_t)
    """

    if speed < 0:
        raise ValueError("speed must be >= 0")
    if radius_of_curvature <= 0:
        raise ValueError("radius_of_curvature must be positive")

    normal_accel = speed**2 / radius_of_curvature
    total_accel = float(np.hypot(tangential_accel, normal_accel))
    angle_from_tangent_deg = float(np.degrees(np.arctan2(normal_accel, tangential_accel)))

    curve_max_speed = 2 * max(speed, 20.0)
    speeds = np.linspace(0.0, curve_max_speed, num_curve_points)
    curve: List[Dict] = [
        {"speed": float(v), "normal_accel": float(v**2 / radius_of_curvature)} for v in speeds
    ]

    return {
        "speed": float(speed),
        "tangential_accel": float(tangential_accel),
        "radius_of_curvature": float(radius_of_curvature),
        "normal_accel": float(normal_accel),
        "total_accel": total_accel,
        "angle_from_tangent_deg": angle_from_tangent_deg,
        "curve": curve,
    }
