"""Transient conduction — lumped capacitance and the Biot number.

If conduction inside a solid is fast compared with convection at its
surface, the whole body stays at one temperature while it heats or cools,
and an energy balance gives a simple exponential. The Biot number
Bi = h L_c / k decides when this is allowed (Bi < 0.1 is the usual rule).

For plates, long cylinders and spheres this module also evaluates the
exact one-term series solution for the CENTRE temperature, so the student
can see the lumped model drift away from the truth as Bi grows.

Units: dimension in mm, rho in kg/m^3, c in J/(kg*K), k in W/(m*K),
h in W/(m^2*K), temperatures in deg C, time in s.
"""

from typing import Dict, Optional

import numpy as np
from scipy.optimize import brentq
from scipy.special import j0, j1

SHAPES = ('plate', 'cylinder', 'sphere')


def _first_root(shape: str, bi: float) -> float:
    """First positive eigenvalue zeta_1 for the given Bi (based on half-thickness or radius)."""
    if shape == 'plate':
        f = lambda z: z * np.tan(z) - bi            # noqa: E731
        hi = np.pi / 2 - 1e-9
    elif shape == 'cylinder':
        f = lambda z: z * j1(z) / j0(z) - bi        # noqa: E731
        hi = 2.404825557695773 - 1e-9
    else:
        f = lambda z: 1.0 - z / np.tan(z) - bi      # noqa: E731
        hi = np.pi - 1e-9
    return float(brentq(f, 1e-9, hi))


def _center_theta(shape: str, bi: float, fo: float) -> float:
    """One-term centre dimensionless temperature (T0 - T_inf)/(Ti - T_inf)."""
    z = _first_root(shape, bi)
    if shape == 'plate':
        c1 = 4.0 * np.sin(z) / (2.0 * z + np.sin(2.0 * z))
    elif shape == 'cylinder':
        c1 = 2.0 * j1(z) / (z * (j0(z) ** 2 + j1(z) ** 2))
    else:
        c1 = 4.0 * (np.sin(z) - z * np.cos(z)) / (2.0 * z - np.sin(2.0 * z))
    return float(c1 * np.exp(-z * z * fo))


def compute_transient_lumped(
    shape: str,
    dimension: float,
    density: float,
    specific_heat: float,
    conductivity: float,
    h: float,
    t_initial: float,
    t_ambient: float,
    time: float,
    t_target: Optional[float] = None,
    num_curve_points: int = 60,
) -> Dict:
    """
    Lumped-capacitance temperature history and the Biot-number check.

    Args:
        shape: 'plate' (dimension = half-thickness, both faces convect),
            'cylinder' (long, dimension = radius) or 'sphere' (radius), mm.
        dimension: Half-thickness or radius, in mm.
        density, specific_heat, conductivity: rho, c, k.
        h: Convection coefficient, W/(m^2*K).
        t_initial, t_ambient: Initial body and surrounding fluid temperatures.
        time: Time at which to evaluate the body temperature, s.
        t_target: Optional temperature whose arrival time is wanted.

    Formulas:
        L_c = V / A_s  (plate: half-thickness; cylinder: r/2; sphere: r/3)
        Bi = h L_c / k;   tau = rho c L_c / h
        (T - T_inf)/(T_i - T_inf) = exp(-t / tau)
        t_target = -tau ln[(T_target - T_inf)/(T_i - T_inf)]
        Fo = alpha t / r0^2,  alpha = k/(rho c)
    """

    if shape not in SHAPES:
        raise ValueError("shape must be 'plate', 'cylinder' or 'sphere'")
    if dimension <= 0:
        raise ValueError("dimension must be positive")
    if density <= 0 or specific_heat <= 0 or conductivity <= 0:
        raise ValueError("density, specific_heat and conductivity must be positive")
    if h <= 0:
        raise ValueError("h must be positive")
    if time < 0:
        raise ValueError("time must not be negative")
    if t_initial == t_ambient:
        raise ValueError("t_initial and t_ambient must differ")

    r0 = dimension / 1000.0
    lc = r0 / {'plate': 1.0, 'cylinder': 2.0, 'sphere': 3.0}[shape]
    bi_lumped = h * lc / conductivity
    bi_exact = h * r0 / conductivity          # Biot based on half-thickness / radius
    tau = density * specific_heat * lc / h
    alpha = conductivity / (density * specific_heat)
    d_theta = t_initial - t_ambient

    def lumped(t):
        return t_ambient + d_theta * np.exp(-t / tau)

    t_now = float(lumped(time))
    fo_now = alpha * time / r0 ** 2

    time_to_target = None
    if t_target is not None:
        ratio = (t_target - t_ambient) / d_theta
        if 0 < ratio < 1:
            time_to_target = float(-tau * np.log(ratio))
        else:
            raise ValueError("t_target must lie strictly between t_ambient and t_initial")

    # Curves up to the larger of 4 tau and 1.2 x the evaluation time
    t_max = max(4.0 * tau, 1.2 * time)
    ts = np.linspace(0.0, t_max, num_curve_points)
    lump_curve = lumped(ts)
    centre_curve = []
    centre_now = None
    for t in ts:
        fo = alpha * t / r0 ** 2
        # one-term series is only trustworthy for Fo > ~0.2
        centre_curve.append(
            float(t_ambient + d_theta * _center_theta(shape, bi_exact, fo)) if fo >= 0.2 else None
        )
    if fo_now >= 0.2:
        centre_now = float(t_ambient + d_theta * _center_theta(shape, bi_exact, fo_now))

    return {
        'shape': shape,
        'characteristic_length': float(lc * 1000.0),
        'biot': float(bi_lumped),
        'biot_exact': float(bi_exact),
        'lumped_valid': bool(bi_lumped < 0.1),
        'time_constant': float(tau),
        'fourier': float(fo_now),
        'temperature': t_now,
        'centre_temperature': centre_now,
        'time_to_target': time_to_target,
        'curve': {
            't': ts.tolist(),
            'lumped': lump_curve.tolist(),
            'centre': centre_curve,
        },
    }
