"""Extended surfaces — heat transfer from a straight fin of uniform section.

A fin adds surface area to a hot wall, but its temperature falls along its
length, so the tip is less effective than the base. The 1D fin equation
d2(theta)/dx2 = m^2 theta, with theta = T - T_inf, has closed-form solutions
for several tip conditions.

Units: dimensions in mm, k in W/(m*K), h in W/(m^2*K), temperatures in deg C,
heat rate in W.
"""

from typing import Dict

import numpy as np

TIPS = ('convective', 'adiabatic', 'infinite')
SHAPES = ('pin', 'rectangular')


def compute_fin(
    shape: str,
    dim_1: float,
    dim_2: float,
    length: float,
    conductivity: float,
    h: float,
    t_base: float,
    t_ambient: float,
    tip: str = 'convective',
    num_points: int = 41,
) -> Dict:
    """
    Heat rate, efficiency, effectiveness and temperature profile for a fin
    of constant cross-section.

    Args:
        shape: 'pin' (circular, dim_1 = diameter) or 'rectangular'
            (dim_1 = width w, dim_2 = thickness t), all in mm.
        dim_1: Pin diameter D or rectangular width w, in mm.
        dim_2: Rectangular thickness t, in mm (ignored for 'pin').
        length: Fin length L from base to tip, in mm.
        conductivity: Fin thermal conductivity k, in W/(m*K).
        h: Convection coefficient, in W/(m^2*K).
        t_base: Base temperature, deg C.
        t_ambient: Surrounding fluid temperature, deg C.
        tip: 'convective', 'adiabatic' or 'infinite' (very long fin).

    Formulas (theta_b = T_b - T_inf, P = perimeter, A_c = cross-section):
        m = sqrt(h P / (k A_c));   M = sqrt(h P k A_c) theta_b;  B = h/(m k)
        convective tip:  q = M (tanh mL + B) / (1 + B tanh mL)
        adiabatic tip:   q = M tanh mL
        infinite fin:    q = M
        eta_f = q / (h A_f theta_b);   epsilon_f = q / (h A_c theta_b)
    """

    if shape not in SHAPES:
        raise ValueError("shape must be 'pin' or 'rectangular'")
    if tip not in TIPS:
        raise ValueError("tip must be 'convective', 'adiabatic' or 'infinite'")
    if dim_1 <= 0 or length <= 0 or (shape == 'rectangular' and dim_2 <= 0):
        raise ValueError("fin dimensions must be positive")
    if conductivity <= 0:
        raise ValueError("conductivity must be positive")
    if h <= 0:
        raise ValueError("h must be positive")

    d1 = dim_1 / 1000.0
    d2 = dim_2 / 1000.0
    big_l = length / 1000.0
    if shape == 'pin':
        perimeter = np.pi * d1
        area_c = np.pi * d1 ** 2 / 4.0
    else:
        perimeter = 2.0 * (d1 + d2)
        area_c = d1 * d2

    theta_b = t_base - t_ambient
    m = np.sqrt(h * perimeter / (conductivity * area_c))
    big_m = np.sqrt(h * perimeter * conductivity * area_c) * theta_b
    ml = m * big_l
    b = h / (m * conductivity) if tip == 'convective' else 0.0

    if tip == 'infinite':
        q = big_m
    else:
        th = np.tanh(ml)
        q = big_m * (th + b) / (1.0 + b * th)

    # Fin surface area exposed to the fluid (tip included only when it convects)
    area_f = perimeter * big_l + (area_c if tip == 'convective' else 0.0)
    q_max = h * area_f * theta_b
    q_bare = h * area_c * theta_b

    # theta(x)/theta_b in an overflow-safe exponential form
    x = np.linspace(0.0, big_l, num_points)
    if tip == 'infinite':
        ratio = np.exp(-m * x)
        tip_ratio = float(np.exp(-ml))
    else:
        den = (1.0 + b) + (1.0 - b) * np.exp(-2.0 * ml)
        ratio = ((1.0 + b) * np.exp(-m * x) + (1.0 - b) * np.exp(-m * (2.0 * big_l - x))) / den
        tip_ratio = float(ratio[-1])

    return {
        'shape': shape,
        'tip': tip,
        'perimeter': float(perimeter * 1000.0),
        'area_c': float(area_c * 1e6),
        'm': float(m),
        'ml': float(ml),
        'heat_rate': float(q),
        'efficiency': float(q / q_max) if q_max != 0 else 0.0,
        'effectiveness': float(q / q_bare) if q_bare != 0 else 0.0,
        'tip_temperature': float(t_ambient + tip_ratio * theta_b),
        'biot': float(h * area_c / (perimeter * conductivity)),
        'infinite_fin_valid': bool(ml >= 2.65),
        'profile': {
            'x': (x * 1000.0).tolist(),
            'T': (t_ambient + ratio * theta_b).tolist(),
        },
    }
