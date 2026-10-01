"""
Rigid-Body Planar Kinetics Module
Used by MIT 2.003 Topic: Rigid-Body Planar Kinetics (F = ma, M = I alpha, rolling)

A round body (cylinder, sphere, hoop) released on an incline obeys the two
planar kinetics equations about its mass centre, plus a kinematic link when
it rolls without slipping:

    sum F  = m a_G
    sum M_G = I_G alpha
    a_G = alpha r        (rolling without slipping only)
"""

from typing import Dict

import numpy as np

G_ACCEL = 9.81  # m/s^2

# Radius-of-gyration-squared ratio k^2 = I_G / (m r^2) for common round bodies
SHAPES = {
    'solid_cylinder': {'name': 'Solid cylinder / disk', 'k2': 0.5},
    'hollow_cylinder': {'name': 'Thin hoop / ring', 'k2': 1.0},
    'solid_sphere': {'name': 'Solid sphere', 'k2': 2.0 / 5.0},
    'spherical_shell': {'name': 'Thin spherical shell', 'k2': 2.0 / 3.0},
}


def compute_rigid_body_kinetics(
    shape: str,
    mass: float,
    radius: float,
    incline_angle_deg: float,
    friction_coefficient: float,
    incline_length: float,
) -> Dict:
    """
    Compute the motion of a round rigid body released from rest on an incline.

    Args:
        shape: Key into SHAPES (sets I_G = k^2 m r^2)
        mass: Mass m in kg
        radius: Radius r in m
        incline_angle_deg: Incline angle theta in degrees (0 <= theta < 90)
        friction_coefficient: Contact friction coefficient mu (static limit
            while rolling; the same value is used as the kinetic coefficient
            if the body slips)
        incline_length: Distance s travelled along the incline in m

    Returns:
        Dictionary with the acceleration, angular acceleration, friction
        force, the friction demanded for pure rolling, whether the body
        slips, the speed/time after travelling the incline length, and
        sampled s(t), v(t) series.

    Slip test: pure rolling needs friction f = m g sin(theta) k^2/(1+k^2)
    and the normal force N = m g cos(theta), so it needs
    mu >= tan(theta) k^2/(1+k^2). Below that the body slides while it
    spins up, with f = mu N (kinetic).
    """

    if shape not in SHAPES:
        raise ValueError(f"Unknown shape '{shape}'")
    if mass <= 0:
        raise ValueError("Mass must be positive")
    if radius <= 0:
        raise ValueError("Radius must be positive")
    if not (0 <= incline_angle_deg < 90):
        raise ValueError("Incline angle must be in [0, 90) degrees")
    if friction_coefficient < 0:
        raise ValueError("Friction coefficient must be non-negative")
    if incline_length <= 0:
        raise ValueError("Incline length must be positive")

    k2 = SHAPES[shape]['k2']
    theta = np.radians(incline_angle_deg)
    inertia = k2 * mass * radius**2          # I_G
    normal = mass * G_ACCEL * np.cos(theta)  # N

    # Friction demanded by pure rolling (a = g sin(theta)/(1 + k^2))
    friction_required = mass * G_ACCEL * np.sin(theta) * k2 / (1 + k2)
    mu_required = np.tan(theta) * k2 / (1 + k2)

    slips = bool(friction_coefficient < mu_required - 1e-12)

    if not slips:
        accel = G_ACCEL * np.sin(theta) / (1 + k2)
        friction = friction_required
        alpha = accel / radius
    else:
        # Sliding: kinetic friction mu N acts up the slope
        friction = friction_coefficient * normal
        accel = G_ACCEL * (np.sin(theta) - friction_coefficient * np.cos(theta))
        alpha = friction * radius / inertia

    # Energy cross-check for pure rolling: v^2 = 2 g h / (1 + k^2)
    if accel > 0:
        final_time = float(np.sqrt(2 * incline_length / accel))
        final_speed = float(accel * final_time)
    else:
        final_time = 0.0
        final_speed = 0.0

    # Sampled motion (stops at final_time; empty if body does not move)
    if final_time > 0:
        t = np.linspace(0, final_time, 60)
        s = 0.5 * accel * t**2
        v = accel * t
        omega = alpha * t
        # Contact-point slip speed v - omega r (zero when rolling)
        slip_speed = v - omega * radius
    else:
        t = np.array([0.0])
        s = np.array([0.0])
        v = np.array([0.0])
        omega = np.array([0.0])
        slip_speed = np.array([0.0])

    return {
        'shape': shape,
        'shape_name': SHAPES[shape]['name'],
        'k_squared': float(k2),
        'inertia': float(inertia),
        'normal_force': float(normal),
        'acceleration': float(accel),
        'angular_acceleration': float(alpha),
        'friction_force': float(friction),
        'friction_required': float(friction_required),
        'mu_required': float(mu_required),
        'slips': slips,
        'final_time': final_time,
        'final_speed': final_speed,
        'final_angular_speed': float(alpha * final_time),
        'time_series': [float(x) for x in t],
        'position_series': [float(x) for x in s],
        'speed_series': [float(x) for x in v],
        'angular_speed_series': [float(x) for x in omega],
        'slip_speed_series': [float(x) for x in slip_speed],
    }
