"""
Dry Friction Module (inclines, wedges, belt/capstan friction)
Used by Statics Topic: Friction & Impending Slip

Coulomb friction: F <= mu_s N. At impending slip F = mu_s N and the
resultant contact force leans from the normal by the friction angle
phi = atan(mu_s).
"""

from typing import Dict

import numpy as np


def compute_incline_friction(weight: float, angle_deg: float, mu: float, applied_force: float) -> Dict:
    """
    Block of weight W on an incline, pushed up-slope by P parallel to it.

    Returns the range of P that keeps the block at rest, the friction
    actually required at the current P, and whether it slips.
    """
    if weight <= 0:
        raise ValueError("Weight must be positive")
    if not (0 <= angle_deg < 90):
        raise ValueError("Incline angle must be in [0, 90) degrees")
    if mu < 0:
        raise ValueError("Friction coefficient must be non-negative")
    if applied_force < 0:
        raise ValueError("Applied force must be non-negative")

    a = np.radians(angle_deg)
    normal = weight * np.cos(a)
    driving = weight * np.sin(a)             # component pulling the block down-slope
    f_max = mu * normal
    p_min = max(0.0, driving - f_max)         # below this the block slides down
    p_max = driving + f_max                   # above this it slides up
    f_required = driving - applied_force      # + : friction acts up-slope
    status = 'static'
    if applied_force < p_min - 1e-12:
        status = 'slides down'
    elif applied_force > p_max + 1e-12:
        status = 'slides up'

    return {
        'normal_force': float(normal),
        'max_friction': float(f_max),
        'required_friction': float(f_required),
        'p_min': float(p_min),
        'p_max': float(p_max),
        'friction_angle_deg': float(np.degrees(np.arctan(mu))),
        'self_locking': bool(angle_deg <= np.degrees(np.arctan(mu)) + 1e-12),
        'status': status,
        'utilization': float(abs(f_required) / f_max) if f_max > 0 else float('inf'),
    }


def compute_wedge_friction(weight: float, wedge_angle_deg: float, mu: float) -> Dict:
    """
    Wedge driven horizontally under a block of weight W that is guided
    vertically by frictionless guides. Friction mu on both wedge faces.

        P_drive   = W [ tan(theta + phi) + tan(phi) ]
        P_release = W [ tan(phi) - tan(theta - phi) ]   (negative: wedge pops out)
        self-locking when theta <= 2 phi
    """
    if weight <= 0:
        raise ValueError("Weight must be positive")
    if not (0 < wedge_angle_deg < 45):
        raise ValueError("Wedge angle must be in (0, 45) degrees")
    if mu < 0:
        raise ValueError("Friction coefficient must be non-negative")

    th = np.radians(wedge_angle_deg)
    phi = np.arctan(mu)
    p_drive = weight * (np.tan(th + phi) + np.tan(phi))
    p_release = weight * (np.tan(phi) - np.tan(th - phi))
    return {
        'friction_angle_deg': float(np.degrees(phi)),
        'drive_force': float(p_drive),
        'release_force': float(p_release),   # > 0 : must pull the wedge out
        'self_locking': bool(wedge_angle_deg <= 2 * np.degrees(phi) + 1e-12),
        'mechanical_advantage': float(weight / p_drive),
    }


def compute_capstan_friction(load: float, mu: float, wrap_turns: float) -> Dict:
    """
    Rope around a fixed post (capstan). Load T1 on one side, holding force
    T2 on the other at impending slip: T1 / T2 = exp(mu * beta).
    """
    if load <= 0:
        raise ValueError("Load must be positive")
    if mu < 0:
        raise ValueError("Friction coefficient must be non-negative")
    if wrap_turns < 0:
        raise ValueError("Wrap must be non-negative")

    beta = 2 * np.pi * wrap_turns
    ratio = float(np.exp(mu * beta))
    return {
        'wrap_angle_rad': float(beta),
        'tension_ratio': ratio,
        'holding_force': float(load / ratio),
    }
