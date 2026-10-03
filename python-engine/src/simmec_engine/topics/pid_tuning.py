"""
PID Tuning Module
Used by the Control Systems Topic: PID Control & Tuning

Unity-feedback loop around a first-order-plus-dead-time (FOPDT) process

    G(s) = K e^{-theta s} / (tau s + 1)

controlled by a PID in parallel/standard form

    u = Kp [ e + (1/Ti) integral(e) dt - Td dy/dt ]

(derivative acts on the measurement, so a setpoint step causes no
derivative kick). The plant is discretised exactly (zero-order hold) and
the controller with backward-Euler integration, at a fixed small step.
"""

from typing import Dict, Optional

import numpy as np

DT = 0.01          # simulation step, s
FILTER_N = 10.0    # derivative filter: Tf = Td / N
DIVERGE_LIMIT = 50.0


def ziegler_nichols_open_loop(gain: float, tau: float, theta: float, mode: str = 'PID') -> Optional[Dict]:
    """Ziegler-Nichols reaction-curve rules for a FOPDT process (needs theta > 0)."""
    if theta <= 0:
        return None
    a = gain * theta / tau  # K theta / tau
    if mode == 'P':
        return {'Kp': 1.0 / a, 'Ti': None, 'Td': 0.0}
    if mode == 'PI':
        return {'Kp': 0.9 / a, 'Ti': 3.33 * theta, 'Td': 0.0}
    return {'Kp': 1.2 / a, 'Ti': 2.0 * theta, 'Td': 0.5 * theta}


def compute_pid_tuning(
    plant_gain: float,
    plant_tau: float,
    plant_delay: float,
    kp: float,
    ti: Optional[float],
    td: float,
    t_end: float,
) -> Dict:
    """
    Simulate the closed-loop unit-step setpoint response with a PID.

    Args:
        plant_gain: Process gain K
        plant_tau: Process time constant tau in s
        plant_delay: Dead time theta in s (>= 0)
        kp: Proportional gain
        ti: Integral time Ti in s (None or 0 disables integral action)
        td: Derivative time Td in s (>= 0)
        t_end: Simulation length in s

    Returns:
        Dictionary with y(t), u(t), setpoint, metrics (overshoot %, 10-90%
        rise time, 2% settling time, steady-state error, IAE), a stability
        flag, and the Ziegler-Nichols open-loop PID suggestion.
    """

    if plant_gain <= 0:
        raise ValueError("Plant gain must be positive")
    if plant_tau <= 0:
        raise ValueError("Plant time constant must be positive")
    if plant_delay < 0:
        raise ValueError("Plant delay must be non-negative")
    if kp < 0:
        raise ValueError("Proportional gain must be non-negative")
    if ti is not None and ti < 0:
        raise ValueError("Integral time must be non-negative")
    if td < 0:
        raise ValueError("Derivative time must be non-negative")
    if t_end <= 0 or t_end > 1000:
        raise ValueError("Simulation length must be in (0, 1000] s")

    n = int(round(t_end / DT))
    delay_steps = int(round(plant_delay / DT))
    a = np.exp(-DT / plant_tau)

    use_i = ti is not None and ti > 0
    tf = td / FILTER_N if td > 0 else 0.0

    y = np.zeros(n + 1)
    u = np.zeros(n + 1)
    u_buf = np.zeros(n + 1 + delay_steps)  # u delayed by delay_steps
    integ = 0.0
    d_state = 0.0       # filtered derivative of the measurement
    y_prev = 0.0
    r = 1.0
    diverged = False

    for k in range(n):
        e = r - y[k]
        integ += e * DT
        # Filtered derivative of the measurement (backward-Euler low-pass)
        if td > 0:
            raw = (y[k] - y_prev) / DT
            d_state = (tf * d_state + DT * raw) / (tf + DT)
        else:
            d_state = 0.0
        y_prev = y[k]

        uk = kp * (e + (integ / ti if use_i else 0.0) - td * d_state)
        u[k] = uk
        u_buf[k + delay_steps] = uk
        y[k + 1] = a * y[k] + plant_gain * (1 - a) * u_buf[k]

        if abs(y[k + 1]) > DIVERGE_LIMIT:
            diverged = True
            y[k + 1:] = np.sign(y[k + 1]) * DIVERGE_LIMIT
            u[k + 1:] = u[k]
            break
    else:
        u[n] = u[n - 1]

    t = np.arange(n + 1) * DT

    # --- metrics ---
    y_final = float(y[-1])
    peak = float(np.max(y))
    overshoot = max(0.0, (peak - 1.0) * 100.0)
    if diverged:
        overshoot = None

    rise_time = None
    if not diverged:
        i10 = np.argmax(y >= 0.1) if np.any(y >= 0.1) else None
        i90 = np.argmax(y >= 0.9) if np.any(y >= 0.9) else None
        if i10 is not None and i90 is not None:
            rise_time = float(t[i90] - t[i10])

    settling_time = None
    if not diverged:
        outside = np.where(np.abs(y - 1.0) > 0.02)[0]
        if len(outside) == 0:
            settling_time = 0.0
        elif outside[-1] < n:
            settling_time = float(t[outside[-1] + 1])

    iae = float(np.sum(np.abs(1.0 - y)) * DT) if not diverged else None
    ss_error = None if diverged else float(1.0 - y_final)

    zn = ziegler_nichols_open_loop(plant_gain, plant_tau, plant_delay, 'PID')

    # Decimate for transport (keep ~500 points)
    step = max(1, len(t) // 500)
    sel = slice(0, None, step)

    return {
        'time_series': [float(v) for v in t[sel]],
        'output_series': [float(v) for v in y[sel]],
        'control_series': [float(v) for v in np.clip(u[sel], -DIVERGE_LIMIT, DIVERGE_LIMIT)],
        'overshoot_percent': overshoot,
        'rise_time': rise_time,
        'settling_time': settling_time,
        'steady_state_error': ss_error,
        'iae': iae,
        'is_stable': not diverged,
        'ki': float(kp / ti) if use_i else 0.0,
        'kd': float(kp * td),
        'zn_pid': zn,
    }
