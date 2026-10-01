"""Steady 1D conduction and thermal resistance networks.

Heat flow through a series of layers behaves like current through resistors:
each conduction layer and each convective film contributes a thermal
resistance, the same heat rate q passes through all of them, and the
temperature drop across each is q times its resistance.

Units: lengths in m, conductivity k in W/(m*K), convection coefficient h in
W/(m^2*K), temperatures in deg C (differences only matter), heat rate q in W.

Geometries:
    plane     layers stacked in x, cross-section area A (m^2)
    cylinder  concentric layers, inner radius r0 and axial length L (m)
"""

from typing import Dict, List

import numpy as np


def compute_conduction_network(
    geometry: str,
    thicknesses: List[float],
    conductivities: List[float],
    h_inside: float,
    h_outside: float,
    t_inside: float,
    t_outside: float,
    area: float = 1.0,
    inner_radius: float = 0.05,
    length: float = 1.0,
) -> Dict:
    """
    Solve a series thermal-resistance network of N conduction layers between
    an inside fluid (T_inside, h_inside) and an outside fluid
    (T_outside, h_outside).

    Args:
        geometry: 'plane' or 'cylinder'.
        thicknesses: Layer thicknesses, in m, from inside to outside.
        conductivities: Layer conductivities k, in W/(m*K), same order.
        h_inside / h_outside: Convection coefficients, W/(m^2*K).
        t_inside / t_outside: Fluid temperatures, deg C.
        area: Wall area A for 'plane', in m^2.
        inner_radius: Inner surface radius r0 for 'cylinder', in m.
        length: Pipe length for 'cylinder', in m.

    Returns:
        Heat rate (positive = inside to outside), each resistance, the
        node temperatures, an in-wall temperature profile, the overall
        U*A, and (cylinder) the critical insulation radius.

    Formulas:
        plane:     R_cond = L / (k A);       R_conv = 1 / (h A)
        cylinder:  R_cond = ln(r_o/r_i) / (2 pi k L);   R_conv = 1 / (h 2 pi r L)
        q = (T_in - T_out) / sum(R);   dT_i = q R_i
    """

    if geometry not in ('plane', 'cylinder'):
        raise ValueError("geometry must be 'plane' or 'cylinder'")
    n = len(thicknesses)
    if n < 1 or n > 4:
        raise ValueError("between 1 and 4 layers are supported")
    if len(conductivities) != n:
        raise ValueError("thicknesses and conductivities must have the same length")
    if any(t <= 0 for t in thicknesses):
        raise ValueError("layer thicknesses must be positive")
    if any(k <= 0 for k in conductivities):
        raise ValueError("conductivities must be positive")
    if h_inside <= 0 or h_outside <= 0:
        raise ValueError("convection coefficients must be positive")
    if geometry == 'plane':
        if area <= 0:
            raise ValueError("area must be positive")
    else:
        if inner_radius <= 0 or length <= 0:
            raise ValueError("inner_radius and length must be positive")

    labels: List[str] = ['Inside film']
    resistances: List[float] = []
    positions = [0.0]                      # x (plane) or r (cylinder) of layer interfaces
    if geometry == 'plane':
        resistances.append(1.0 / (h_inside * area))
        x = 0.0
        for t, k in zip(thicknesses, conductivities):
            resistances.append(t / (k * area))
            x += t
            positions.append(x)
        resistances.append(1.0 / (h_outside * area))
    else:
        r = inner_radius
        positions = [r]
        resistances.append(1.0 / (h_inside * 2 * np.pi * r * length))
        for t, k in zip(thicknesses, conductivities):
            r_next = r + t
            resistances.append(np.log(r_next / r) / (2 * np.pi * k * length))
            r = r_next
            positions.append(r)
        resistances.append(1.0 / (h_outside * 2 * np.pi * r * length))

    labels += [f'Layer {i + 1}' for i in range(n)] + ['Outside film']
    r_total = float(sum(resistances))
    q = (t_inside - t_outside) / r_total

    # Node temperatures: fluid_in, surface_in, interfaces..., surface_out, fluid_out
    temps = [t_inside]
    for rr in resistances:
        temps.append(temps[-1] - q * rr)
    # temps[-1] equals t_outside up to round-off

    # In-wall profile, from the inside surface to the outside surface
    profile: List[Dict[str, float]] = []
    for i in range(n):
        t_a, t_b = temps[i + 1], temps[i + 2]
        pa, pb = positions[i], positions[i + 1]
        for f in np.linspace(0.0, 1.0, 12):
            if geometry == 'plane':
                pos = pa + f * (pb - pa)
                temp = t_a + f * (t_b - t_a)
            else:
                pos = pa + f * (pb - pa)
                temp = t_a + (t_b - t_a) * np.log(pos / pa) / np.log(pb / pa)
            profile.append({'pos': float(pos), 'T': float(temp)})

    result = {
        'geometry': geometry,
        'heat_rate': float(q),
        'r_total': r_total,
        'ua_overall': 1.0 / r_total,
        'labels': labels,
        'resistances': [float(v) for v in resistances],
        'temp_drops': [float(q * v) for v in resistances],
        'node_temps': [float(v) for v in temps],
        'positions': [float(v) for v in positions],
        'profile': profile,
    }
    if geometry == 'plane':
        result['heat_flux'] = float(q / area)
    else:
        result['heat_rate_per_length'] = float(q / length)
        result['critical_radius'] = float(conductivities[-1] / h_outside)
        result['outer_radius'] = float(positions[-1])
    return result
