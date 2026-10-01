"""
Forced Vibration, Resonance & Transmissibility Module
Used by MIT 2.003 Topic: Forced Vibration & Resonance

Harmonic force F0 sin(w t) on a mass-spring-damper, with r = w / wn and
damping ratio zeta, gives steady-state amplitude

    X = (F0 / k) * M(r),   M = 1 / sqrt((1 - r^2)^2 + (2 zeta r)^2)

and the transmissibility (force through the mount, or motion of a
base-excited mass)

    TR = sqrt(1 + (2 zeta r)^2) / sqrt((1 - r^2)^2 + (2 zeta r)^2)
"""

from typing import Dict

import numpy as np


def _magnification(r, zeta):
    return 1.0 / np.sqrt((1 - r**2) ** 2 + (2 * zeta * r) ** 2)


def _transmissibility(r, zeta):
    return np.sqrt(1 + (2 * zeta * r) ** 2) / np.sqrt((1 - r**2) ** 2 + (2 * zeta * r) ** 2)


def compute_forced_vibration(
    mass: float,
    stiffness: float,
    damping: float,
    force_amplitude: float,
    forcing_frequency: float,
    num_points: int = 200,
) -> Dict:
    """
    Compute steady-state amplitude, phase and transmissibility.

    Args:
        mass: Mass m in kg
        stiffness: Spring stiffness k in N/m
        damping: Viscous damping c in N*s/m
        force_amplitude: Force amplitude F0 in N
        forcing_frequency: Forcing frequency w in rad/s
        num_points: Samples for the frequency-response curves

    Returns:
        Dictionary with wn, zeta, r, static deflection, magnification
        factor, amplitude, phase lag, transmissibility, force transmitted
        to the support, the resonant peak (when zeta < 1/sqrt(2)), whether
        the operating point is in the isolation region (r > sqrt(2)), and
        M(r), TR(r), phase(r) curves.
    """

    if mass <= 0:
        raise ValueError("Mass must be positive")
    if stiffness <= 0:
        raise ValueError("Stiffness must be positive")
    if damping < 0:
        raise ValueError("Damping must be non-negative")
    if force_amplitude < 0:
        raise ValueError("Force amplitude must be non-negative")
    if forcing_frequency < 0:
        raise ValueError("Forcing frequency must be non-negative")
    if num_points < 10:
        raise ValueError("num_points must be at least 10")

    wn = float(np.sqrt(stiffness / mass))
    zeta = float(damping / (2.0 * np.sqrt(stiffness * mass)))
    r = float(forcing_frequency / wn)

    static_deflection = force_amplitude / stiffness
    denom = (1 - r**2) ** 2 + (2 * zeta * r) ** 2
    if denom < 1e-12:
        raise ValueError(
            "Undamped system forced exactly at resonance: amplitude is unbounded (set damping > 0 or move off r = 1)"
        )

    mag = float(_magnification(r, zeta))
    amplitude = float(static_deflection * mag)
    # Phase lag of displacement behind the force, in [0, 180] degrees
    phase = float(np.degrees(np.arctan2(2 * zeta * r, 1 - r**2)))
    tr = float(_transmissibility(r, zeta))
    force_transmitted = float(tr * force_amplitude)

    # Peak of M(r) exists for zeta < 1/sqrt(2) at r = sqrt(1 - 2 zeta^2)
    if zeta < 1 / np.sqrt(2):
        r_peak = float(np.sqrt(1 - 2 * zeta**2))
        peak = float(1.0 / (2 * zeta * np.sqrt(1 - zeta**2))) if zeta > 1e-9 else None
    else:
        r_peak = None
        peak = None

    # Curves over r in [0, 3], skipping the singular point for zeta = 0
    r_axis = np.linspace(0.0, 3.0, num_points)
    with np.errstate(divide='ignore', invalid='ignore'):
        m_curve = _magnification(r_axis, zeta)
        tr_curve = _transmissibility(r_axis, zeta)
    phase_curve = np.degrees(np.arctan2(2 * zeta * r_axis, 1 - r_axis**2))
    cap = 20.0  # clip so an undamped spike does not wreck the plot scale
    m_curve = np.where(np.isfinite(m_curve), np.minimum(m_curve, cap), cap)
    tr_curve = np.where(np.isfinite(tr_curve), np.minimum(tr_curve, cap), cap)

    return {
        'natural_frequency': wn,
        'natural_frequency_hz': float(wn / (2 * np.pi)),
        'damping_ratio': zeta,
        'frequency_ratio': r,
        'static_deflection': float(static_deflection),
        'magnification': mag,
        'amplitude': amplitude,
        'phase_deg': phase,
        'transmissibility': tr,
        'force_transmitted': force_transmitted,
        'peak_ratio': r_peak,
        'peak_magnification': peak,
        'in_isolation_region': bool(r > np.sqrt(2)),
        'near_resonance': bool(abs(r - 1) < 0.15),
        'r_series': [float(v) for v in r_axis],
        'magnification_series': [float(v) for v in m_curve],
        'transmissibility_series': [float(v) for v in tr_curve],
        'phase_series': [float(v) for v in phase_curve],
    }
