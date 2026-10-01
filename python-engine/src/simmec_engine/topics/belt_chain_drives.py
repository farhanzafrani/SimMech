"""
Belt and Chain Drives Module
Used by MIT 2.72 Topic: Belt & Chain Drives

Belts transmit power through friction: the limiting tension ratio on the
pulley is the capstan (Euler) equation T1/T2 = exp(mu * theta). Chains
transmit by positive engagement, so only speed ratio, chain speed and
chain pull matter.
"""

from typing import Dict, Optional

import numpy as np


def compute_belt_drive(
    driver_diameter: float,
    driven_diameter: float,
    center_distance: float,
    driver_rpm: float,
    friction_coefficient: float,
    tight_tension: float,
    belt_mass_per_length: float = 0.0,
    groove_angle_deg: Optional[float] = None,
) -> Dict:
    """
    Open belt drive at the limit of slipping.

    Args:
        driver_diameter: d1 in mm
        driven_diameter: d2 in mm
        center_distance: C in mm
        driver_rpm: N1 in rpm
        friction_coefficient: mu (flat belt, or belt/groove-wall for a V-belt)
        tight_tension: T1, allowable tight-side tension in N
        belt_mass_per_length: optional m in kg/m, for centrifugal tension m v^2
        groove_angle_deg: optional V-groove included angle beta; when given
            the wedging action raises the effective friction to mu / sin(beta/2)

    Returns:
        Speed ratio, output speed, belt speed, wrap angle on the smaller
        pulley, belt length, tension ratio, slack tension, and power.
    """
    if driver_diameter <= 0 or driven_diameter <= 0:
        raise ValueError("Pulley diameters must be positive")
    if driver_rpm <= 0:
        raise ValueError("Driver speed must be positive")
    if friction_coefficient < 0:
        raise ValueError("Friction coefficient must be non-negative")
    if tight_tension <= 0:
        raise ValueError("Tight-side tension must be positive")
    if belt_mass_per_length < 0:
        raise ValueError("Belt mass per length must be non-negative")
    if center_distance <= (driver_diameter + driven_diameter) / 2:
        raise ValueError("Center distance must exceed the sum of the pulley radii")
    if groove_angle_deg is not None and not (0 < groove_angle_deg <= 180):
        raise ValueError("Groove angle must be in (0, 180] degrees")

    d1, d2, c = driver_diameter, driven_diameter, center_distance

    # Open-belt geometry: half-angle alpha between belt and center line
    alpha = np.arcsin(abs(d2 - d1) / (2 * c))
    wrap_small = np.pi - 2 * alpha     # wrap on the smaller pulley (limits slipping)
    wrap_large = np.pi + 2 * alpha
    wrap_1 = wrap_small if d1 <= d2 else wrap_large
    wrap_2 = wrap_large if d1 <= d2 else wrap_small
    belt_length = np.sqrt(4 * c**2 - (d2 - d1) ** 2) + (d1 * wrap_1 + d2 * wrap_2) / 2

    speed_ratio = d1 / d2                       # N2/N1
    driven_rpm = driver_rpm * speed_ratio
    belt_speed = np.pi * (d1 / 1000) * driver_rpm / 60   # m/s

    mu_eff = friction_coefficient
    if groove_angle_deg is not None:
        mu_eff = friction_coefficient / np.sin(np.radians(groove_angle_deg) / 2)

    # Capstan limit on the smaller pulley; centrifugal tension Tc = m v^2
    tension_ratio = float(np.exp(mu_eff * wrap_small))
    t_c = belt_mass_per_length * belt_speed**2
    if tight_tension <= t_c:
        raise ValueError("Centrifugal tension exceeds the tight-side tension: no power can be transmitted")
    slack_tension = t_c + (tight_tension - t_c) / tension_ratio
    power = (tight_tension - slack_tension) * belt_speed   # W

    return {
        'speed_ratio': float(speed_ratio),
        'driven_rpm': float(driven_rpm),
        'belt_speed': float(belt_speed),
        'wrap_angle_deg': float(np.degrees(wrap_small)),
        'wrap_angle_rad': float(wrap_small),
        'belt_length': float(belt_length),
        'effective_friction': float(mu_eff),
        'tension_ratio': tension_ratio,
        'centrifugal_tension': float(t_c),
        'tight_tension': tight_tension,
        'slack_tension': float(slack_tension),
        'power_w': float(power),
        'power_kw': float(power / 1000),
        'torque_driver': float((tight_tension - slack_tension) * d1 / 2000),  # N*m
    }


def compute_chain_drive(
    chain_pitch: float,
    driver_teeth: float,
    driven_teeth: float,
    driver_rpm: float,
    chain_pull: float,
) -> Dict:
    """
    Roller-chain drive: speed ratio, chain speed, power for a given chain pull.

    Args:
        chain_pitch: Chain pitch p in mm
        driver_teeth: Sprocket tooth count z1 (>= 9)
        driven_teeth: Sprocket tooth count z2 (>= 9)
        driver_rpm: N1 in rpm
        chain_pull: Working tension F in the chain in N
    """
    if chain_pitch <= 0:
        raise ValueError("Chain pitch must be positive")
    if driver_teeth < 9 or driven_teeth < 9:
        raise ValueError("Sprockets need at least 9 teeth")
    if driver_rpm <= 0:
        raise ValueError("Driver speed must be positive")
    if chain_pull < 0:
        raise ValueError("Chain pull must be non-negative")

    z1, z2, p = driver_teeth, driven_teeth, chain_pitch
    d1 = p / np.sin(np.pi / z1)       # pitch diameters [mm]
    d2 = p / np.sin(np.pi / z2)
    driven_rpm = driver_rpm * z1 / z2
    chain_speed = z1 * p * driver_rpm / 60000    # m/s, v = z p N / 60
    power = chain_pull * chain_speed             # W

    return {
        'speed_ratio': float(z1 / z2),
        'driven_rpm': float(driven_rpm),
        'driver_pitch_diameter': float(d1),
        'driven_pitch_diameter': float(d2),
        'chain_speed': float(chain_speed),
        'chain_pull': chain_pull,
        'power_w': float(power),
        'power_kw': float(power / 1000),
        'torque_driver': float(chain_pull * d1 / 2000),  # N*m
    }
