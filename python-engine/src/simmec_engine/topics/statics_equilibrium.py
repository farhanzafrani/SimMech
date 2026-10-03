"""
Force Equilibrium and Free-Body Diagrams Module
Used by Statics Topic: Force Equilibrium & Free-Body Diagrams

A rigid body in static equilibrium has zero net force and zero net moment.
2D: three scalar equations (sum Fx, sum Fy, sum M). 3D: six. Each unknown
support reaction is found by writing those equations on the free-body diagram.
"""

from typing import Dict, List

import numpy as np


def compute_equilibrium_2d(
    span: float,
    loads: List[Dict],
    distributed_load: float = 0.0,
    applied_moment: float = 0.0,
) -> Dict:
    """
    Reactions of a simply supported beam: pin at A (x = 0), roller at B (x = L).

    Args:
        span: Beam length L in m
        loads: Point loads, each {'magnitude': kN, 'position': m from A,
            'angle_deg': direction of the force measured counter-clockwise
            from +x, so 270 is straight down}
        distributed_load: Uniform load w in kN/m acting downward over the span
        applied_moment: Applied couple in kN*m, positive counter-clockwise

    Returns:
        Reactions Ax, Ay, By (kN) and equilibrium residuals (should be ~0).
    """
    if span <= 0:
        raise ValueError("Span must be positive")
    for ld in loads:
        if ld['magnitude'] < 0:
            raise ValueError("Load magnitudes must be non-negative")
        if not (0 <= ld['position'] <= span):
            raise ValueError("Load positions must lie on the beam (0 <= x <= L)")
    if distributed_load < 0:
        raise ValueError("Distributed load must be non-negative (acts downward)")

    fx = [ld['magnitude'] * np.cos(np.radians(ld['angle_deg'])) for ld in loads]
    fy = [ld['magnitude'] * np.sin(np.radians(ld['angle_deg'])) for ld in loads]
    xs = [ld['position'] for ld in loads]

    w_total = distributed_load * span          # resultant of the UDL, acts at L/2
    sum_fx = float(np.sum(fx))
    sum_fy = float(np.sum(fy)) - w_total
    # Moments about A (counter-clockwise positive): x * Fy for each force
    moment_loads = float(np.sum(np.array(xs) * np.array(fy))) - w_total * span / 2 + applied_moment

    # Sum M_A = 0:  By * L + moment_loads = 0
    by = -moment_loads / span
    # Sum Fy = 0:   Ay + By + sum_fy = 0
    ay = -sum_fy - by
    # Sum Fx = 0:   Ax + sum_fx = 0
    ax = -sum_fx

    # Residual check of the three equilibrium equations
    res_fx = ax + sum_fx
    res_fy = ay + by + sum_fy
    res_m = by * span + moment_loads

    return {
        'span': span,
        'ax': float(ax),
        'ay': float(ay),
        'by': float(by),
        'total_distributed': float(w_total),
        'residual_fx': float(res_fx),
        'residual_fy': float(res_fy),
        'residual_m': float(res_m),
        'resultant_a': float(np.hypot(ax, ay)),
    }


def compute_equilibrium_3d(
    length_a: float,
    length_b: float,
    load: float,
    load_x: float,
    load_y: float,
) -> Dict:
    """
    Horizontal rectangular plate (a x b) on three vertical supports at
    corners A(0,0), B(a,0), C(0,b); a downward load P acts at (x, y).

    Three unknown reactions, three equations (sum Fz, sum Mx, sum My):
        Ra + Rb + Rc = P
        Mx about the x-axis:  Rc * b = P * y
        My about the y-axis:  Rb * a = P * x

    Args:
        length_a: Plate side along x in m
        length_b: Plate side along y in m
        load: Downward load P in kN
        load_x, load_y: Load position in m
    """
    if length_a <= 0 or length_b <= 0:
        raise ValueError("Plate dimensions must be positive")
    if load < 0:
        raise ValueError("Load must be non-negative")
    if not (0 <= load_x <= length_a and 0 <= load_y <= length_b):
        raise ValueError("Load must act on the plate")

    rb = load * load_x / length_a
    rc = load * load_y / length_b
    ra = load - rb - rc

    return {
        'ra': float(ra),
        'rb': float(rb),
        'rc': float(rc),
        'residual_fz': float(ra + rb + rc - load),
        # Negative Ra means support A would have to pull the plate down:
        # the load lies outside the triangle ABC and the plate tips.
        'tips': bool(ra < -1e-9),
    }
