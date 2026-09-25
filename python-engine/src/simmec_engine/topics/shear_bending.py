"""
Shear Force & Bending Moment Diagrams

Simply supported beam (pin at x=0, roller at x=L) under either a single
point load or a uniformly distributed load (UDL).
"""

from typing import Dict, Literal

import numpy as np


def compute_shear_moment(
    length: float,
    load_type: Literal['point', 'udl'],
    magnitude: float,
    position_frac: float = 0.5,
    num_points: int = 50,
) -> Dict:
    """
    Compute support reactions and the V(x)/M(x) diagrams for a simply
    supported beam.

    Args:
        length: Span L in m
        load_type: 'point' (a point load) or 'udl' (uniformly distributed load)
        magnitude: Point load P in N, or UDL intensity w in N/m
        position_frac: Fraction of the span (0-1) where the point load acts.
                        Ignored for 'udl'.
        num_points: Number of samples along the beam for the V(x)/M(x) diagrams

    Returns:
        Dictionary with reactions, V_max/M_max (with locations), and the
        sampled V(x)/M(x) distribution.
    """

    if length <= 0:
        raise ValueError("Length must be positive")
    if load_type not in ('point', 'udl'):
        raise ValueError("load_type must be 'point' or 'udl'")
    if load_type == 'point' and not (0 <= position_frac <= 1):
        raise ValueError("position_frac must be between 0 and 1")

    xs = np.linspace(0, length, num_points)

    if load_type == 'point':
        a = position_frac * length
        b = length - a
        P = magnitude

        reaction_a = P * b / length if length > 0 else 0.0
        reaction_b = P * a / length if length > 0 else 0.0

        shear = np.where(xs < a, reaction_a, reaction_a - P)
        moment = np.where(
            xs < a,
            reaction_a * xs,
            reaction_a * xs - P * (xs - a),
        )
        m_max = reaction_a * a  # = P a b / L, occurs at the load
        m_max_location = a
    else:
        w = magnitude
        reaction_a = w * length / 2
        reaction_b = w * length / 2

        shear = reaction_a - w * xs
        moment = reaction_a * xs - w * xs**2 / 2
        m_max = w * length**2 / 8
        m_max_location = length / 2

    v_max = float(np.max(np.abs(shear)))
    v_max_location = float(xs[np.argmax(np.abs(shear))])

    return {
        'length': length,
        'load_type': load_type,
        'magnitude': magnitude,
        'position_frac': position_frac,
        'reaction_a': float(reaction_a),
        'reaction_b': float(reaction_b),
        'v_max': v_max,
        'v_max_location': v_max_location,
        'm_max': float(m_max),
        'm_max_location': float(m_max_location),
        'distribution': [
            {'x': float(x), 'shear': float(v), 'moment': float(m)}
            for x, v, m in zip(xs, shear, moment)
        ],
    }
