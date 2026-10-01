"""
First- and Second-Order Step Response Module
Used by the Control Systems Topic: Step Response of 1st/2nd-Order Systems

    First order:   G(s) = K / (tau s + 1)
    Second order:  G(s) = K wn^2 / (s^2 + 2 zeta wn s + wn^2)

The unit-step response y(t) is evaluated in closed form (no numerical
integration), and the standard time-domain specs are reported.
"""

from typing import Dict, Optional

import numpy as np


def _first_crossing(t: np.ndarray, y: np.ndarray, level: float) -> Optional[float]:
    """First time y rises through `level` (linear interpolation)."""
    above = np.where(y >= level)[0]
    if len(above) == 0:
        return None
    i = above[0]
    if i == 0:
        return float(t[0])
    return float(t[i - 1] + (level - y[i - 1]) * (t[i] - t[i - 1]) / (y[i] - y[i - 1]))


def compute_step_response(
    order: int,
    gain: float,
    time_constant: float,
    natural_frequency: float,
    damping_ratio: float,
    num_points: int = 500,
) -> Dict:
    """
    Compute the unit-step response and its time-domain specifications.

    Args:
        order: 1 or 2
        gain: DC gain K (final value of the unit-step response)
        time_constant: tau in s (first-order only)
        natural_frequency: wn in rad/s (second-order only)
        damping_ratio: zeta (second-order only), >= 0
        num_points: Number of time samples

    Returns:
        Dictionary with y(t), the poles, rise time (10-90%), 2% settling
        time, and (second-order) percent overshoot, peak time and the
        analytic settling estimate 4/(zeta wn).
    """

    if order not in (1, 2):
        raise ValueError("Order must be 1 or 2")
    if num_points < 10:
        raise ValueError("num_points must be at least 10")

    if order == 1:
        if time_constant <= 0:
            raise ValueError("Time constant must be positive")
        tau = time_constant
        t = np.linspace(0, 6 * tau, num_points)
        y = gain * (1 - np.exp(-t / tau))
        poles = [{'re': -1.0 / tau, 'im': 0.0}]
        # Analytic: tr(10-90%) = tau ln 9 ~ 2.197 tau, ts(2%) = tau ln 50 ~ 3.912 tau
        rise_time = float(tau * np.log(9))
        settling_time = float(tau * np.log(50))
        return {
            'order': 1,
            'gain': gain,
            'final_value': float(gain),
            'poles': poles,
            'time_series': [float(v) for v in t],
            'response_series': [float(v) for v in y],
            'rise_time': rise_time,
            'settling_time': settling_time,
            'settling_estimate': float(4 * tau),
            'overshoot_percent': 0.0,
            'peak_time': None,
            'damped_frequency': None,
            'regime': 'first order',
        }

    # --- second order ---
    if natural_frequency <= 0:
        raise ValueError("Natural frequency must be positive")
    if damping_ratio < 0:
        raise ValueError("Damping ratio must be non-negative")
    wn, z = natural_frequency, damping_ratio

    # Time window: ~6 time constants of the dominant pole, or 4 cycles if undamped
    if z < 1e-9:
        t_end = 4 * 2 * np.pi / wn
    elif z < 1:
        t_end = max(7.0 / (z * wn), 2 * np.pi / (wn * np.sqrt(1 - z**2)))
    elif z > 1:
        t_end = 7.0 / (wn * (z - np.sqrt(z**2 - 1)))
    else:
        t_end = 9.0 / wn
    t = np.linspace(0, t_end, num_points)

    if z < 1 - 1e-9:
        wd = wn * np.sqrt(1 - z**2)
        phi = np.arccos(z)
        y = 1 - np.exp(-z * wn * t) / np.sqrt(1 - z**2) * np.sin(wd * t + phi)
        poles = [{'re': -z * wn, 'im': wd}, {'re': -z * wn, 'im': -wd}]
        regime = 'undamped' if z < 1e-9 else 'underdamped'
        overshoot = float(100 * np.exp(-np.pi * z / np.sqrt(1 - z**2))) if z > 1e-9 else 100.0
        peak_time = float(np.pi / wd)
        damped = float(wd)
    elif abs(z - 1) <= 1e-9:
        y = 1 - np.exp(-wn * t) * (1 + wn * t)
        poles = [{'re': -wn, 'im': 0.0}, {'re': -wn, 'im': 0.0}]
        regime = 'critically damped'
        overshoot, peak_time, damped = 0.0, None, None
    else:
        root = wn * np.sqrt(z**2 - 1)
        s1, s2 = -z * wn + root, -z * wn - root
        y = 1 + (s2 * np.exp(s1 * t) - s1 * np.exp(s2 * t)) / (s1 - s2)
        poles = [{'re': float(s1), 'im': 0.0}, {'re': float(s2), 'im': 0.0}]
        regime = 'overdamped'
        overshoot, peak_time, damped = 0.0, None, None

    rise_time = None
    t10 = _first_crossing(t, y, 0.1)
    t90 = _first_crossing(t, y, 0.9)
    if t10 is not None and t90 is not None:
        rise_time = t90 - t10

    # 2% settling time: last instant |y - 1| > 0.02
    outside = np.where(np.abs(y - 1) > 0.02)[0]
    if len(outside) == 0:
        settling_time = 0.0
    elif outside[-1] >= len(t) - 1:
        settling_time = None  # does not settle in the window (undamped)
    else:
        settling_time = float(t[outside[-1] + 1])

    return {
        'order': 2,
        'gain': gain,
        'final_value': float(gain),
        'poles': poles,
        'time_series': [float(v) for v in t],
        # scale the unit-step shape by the DC gain
        'response_series': [float(gain * v) for v in y],
        'rise_time': rise_time,
        'settling_time': settling_time,
        'settling_estimate': float(4 / (z * wn)) if z > 1e-9 else None,
        'overshoot_percent': overshoot,
        'peak_time': peak_time,
        'damped_frequency': damped,
        'regime': regime,
    }
