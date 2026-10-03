"""
Frequency Response & Bode Plot Module
Used by the Control Systems Topic: Frequency Response & Bode Plots

Open-loop transfer function (type-1 plant with two real lags)

    L(s) = K / ( s (tau1 s + 1)(tau2 s + 1) )

evaluated on s = j w. Gain and phase margins are measured on L(jw):
    PM = 180 deg + angle L(j w_gc)   where |L(j w_gc)| = 1
    GM = 1 / |L(j w_pc)|             where angle L(j w_pc) = -180 deg
"""

from typing import Dict, Optional

import numpy as np


def _L(w, K, t1, t2):
    s = 1j * w
    return K / (s * (t1 * s + 1) * (t2 * s + 1))


def compute_frequency_response(
    gain: float,
    tau1: float,
    tau2: float,
    num_points: int = 300,
) -> Dict:
    """
    Compute Bode magnitude/phase and the stability margins.

    Args:
        gain: Loop gain K (> 0)
        tau1, tau2: Lag time constants in s (> 0)
        num_points: Frequency samples (log-spaced)

    Returns:
        Dictionary with magnitude (dB) and phase (deg) curves, gain
        crossover w_gc, phase margin, phase crossover w_pc, gain margin
        (dB and ratio), closed-loop stability, and the PM-based damping
        estimate zeta ~ PM/100.
    """

    if gain <= 0:
        raise ValueError("Gain must be positive")
    if tau1 <= 0 or tau2 <= 0:
        raise ValueError("Time constants must be positive")
    if num_points < 10:
        raise ValueError("num_points must be at least 10")

    # Window: four decades centred around the corner frequencies
    corner = min(1 / tau1, 1 / tau2)
    w_lo = 10 ** np.floor(np.log10(min(corner, gain) / 100))
    w_hi = 10 ** np.ceil(np.log10(max(1 / tau1, 1 / tau2) * 100))
    w = np.logspace(np.log10(w_lo), np.log10(w_hi), num_points)

    resp = _L(w, gain, tau1, tau2)
    mag_db = 20 * np.log10(np.abs(resp))
    # Unwrapped phase; type-1 starts at -90 deg
    phase = np.degrees(np.unwrap(np.angle(resp)))

    # Gain crossover: |L| = 1. |L| is monotonically decreasing for this plant.
    from_log = np.log10(w)
    w_gc = None
    above = np.where(mag_db >= 0)[0]
    if len(above) > 0 and above[-1] < len(w) - 1:
        i = above[-1]
        f = mag_db[i] / (mag_db[i] - mag_db[i + 1])
        w_gc = float(10 ** (from_log[i] + f * (from_log[i + 1] - from_log[i])))
    # refine w_gc by bisection on the exact |L|
    if w_gc is not None:
        lo, hi = w_gc / 1.2, w_gc * 1.2
        for _ in range(60):
            mid = np.sqrt(lo * hi)
            if abs(_L(mid, gain, tau1, tau2)) > 1:
                lo = mid
            else:
                hi = mid
        w_gc = float(np.sqrt(lo * hi))

    phase_margin = None
    if w_gc is not None:
        ph = float(np.degrees(-np.pi / 2 - np.arctan(w_gc * tau1) - np.arctan(w_gc * tau2)))
        phase_margin = 180.0 + ph

    # Phase crossover: -90 - atan(w t1) - atan(w t2) = -180  ->  w = 1/sqrt(t1 t2)
    w_pc = float(1.0 / np.sqrt(tau1 * tau2))
    mag_pc = float(np.abs(_L(w_pc, gain, tau1, tau2)))
    gain_margin = float(1.0 / mag_pc)
    gain_margin_db = float(20 * np.log10(gain_margin))

    stable = bool(
        (phase_margin is None or phase_margin > 0) and gain_margin > 1
    )
    # K at which the gain margin reaches 1: K_crit = K * GM = 1/|L(j w_pc)|_(K=1)
    k_crit = float(gain * gain_margin)

    return {
        'gain': gain,
        'tau1': tau1,
        'tau2': tau2,
        'frequency_series': [float(v) for v in w],
        'magnitude_db_series': [float(v) for v in mag_db],
        'phase_deg_series': [float(v) for v in phase],
        'gain_crossover': w_gc,
        'phase_margin_deg': phase_margin,
        'phase_crossover': w_pc,
        'gain_margin': gain_margin,
        'gain_margin_db': gain_margin_db,
        'critical_gain': k_crit,
        'is_stable': stable,
        'damping_estimate': float(phase_margin / 100.0) if phase_margin is not None and phase_margin > 0 else None,
    }
