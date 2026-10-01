"""
Free & Damped Vibration Module (single degree of freedom)
Used by MIT 2.003 Topic: Free & Damped Vibration of a 1-DOF System

Equation of motion for a mass-spring-damper released with initial
conditions x(0) = x0, x'(0) = v0:

    m x'' + c x' + k x = 0
"""

from typing import Dict

import numpy as np


def compute_free_vibration(
    mass: float,
    stiffness: float,
    damping: float,
    initial_displacement: float,
    initial_velocity: float,
    num_points: int = 400,
) -> Dict:
    """
    Compute natural frequency, damping ratio and the free response x(t).

    Args:
        mass: Mass m in kg
        stiffness: Spring stiffness k in N/m
        damping: Viscous damping coefficient c in N*s/m
        initial_displacement: x(0) in m
        initial_velocity: x'(0) in m/s
        num_points: Number of samples of x(t)

    Returns:
        Dictionary with wn, zeta, wd, critical damping, regime, period,
        logarithmic decrement (underdamped only), 2% settling-time
        estimate 4/(zeta wn), and sampled x(t) (plus the exponential
        envelope when underdamped).
    """

    if mass <= 0:
        raise ValueError("Mass must be positive")
    if stiffness <= 0:
        raise ValueError("Stiffness must be positive")
    if damping < 0:
        raise ValueError("Damping must be non-negative")
    if num_points < 10:
        raise ValueError("num_points must be at least 10")

    wn = float(np.sqrt(stiffness / mass))
    c_crit = 2.0 * np.sqrt(stiffness * mass)
    zeta = float(damping / c_crit)
    x0, v0 = initial_displacement, initial_velocity

    # Choose a plotting window that shows the decay (or ~6 cycles if undamped)
    if zeta < 1e-9:
        t_end = 6 * 2 * np.pi / wn
    elif zeta < 1:
        t_end = min(max(5.0 / (zeta * wn), 2 * np.pi / (wn * np.sqrt(1 - zeta**2))), 60 * 2 * np.pi / wn)
    else:
        # slowest real pole controls the tail
        slow = wn * (zeta - np.sqrt(zeta**2 - 1)) if zeta > 1 else wn
        t_end = 5.0 / slow
    t = np.linspace(0, t_end, num_points)

    envelope = None
    wd = None
    log_dec = None
    period = None
    if zeta < 1 - 1e-9:
        regime = 'undamped' if zeta < 1e-9 else 'underdamped'
        wd = float(wn * np.sqrt(1 - zeta**2))
        period = float(2 * np.pi / wd)
        A = x0
        B = (v0 + zeta * wn * x0) / wd
        x = np.exp(-zeta * wn * t) * (A * np.cos(wd * t) + B * np.sin(wd * t))
        amp = float(np.hypot(A, B))
        envelope = amp * np.exp(-zeta * wn * t)
        if zeta > 1e-9:
            log_dec = float(2 * np.pi * zeta / np.sqrt(1 - zeta**2))
    elif abs(zeta - 1) <= 1e-9:
        regime = 'critically damped'
        x = np.exp(-wn * t) * (x0 + (v0 + wn * x0) * t)
    else:
        regime = 'overdamped'
        root = wn * np.sqrt(zeta**2 - 1)
        s1 = -zeta * wn + root
        s2 = -zeta * wn - root
        c1 = (v0 - s2 * x0) / (s1 - s2)
        c2 = x0 - c1
        x = c1 * np.exp(s1 * t) + c2 * np.exp(s2 * t)

    settling = float(4.0 / (zeta * wn)) if zeta > 1e-9 else None

    return {
        'natural_frequency': wn,
        'natural_frequency_hz': float(wn / (2 * np.pi)),
        'critical_damping': float(c_crit),
        'damping_ratio': zeta,
        'damped_frequency': wd,
        'period': period,
        'log_decrement': log_dec,
        'amplitude_ratio_per_cycle': float(np.exp(log_dec)) if log_dec is not None else None,
        'settling_time': settling,
        'regime': regime,
        'time_series': [float(v) for v in t],
        'displacement_series': [float(v) for v in x],
        'envelope_series': [float(v) for v in envelope] if envelope is not None else None,
    }
