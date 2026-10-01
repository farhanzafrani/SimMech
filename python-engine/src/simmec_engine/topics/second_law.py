"""Second Law of Thermodynamics — Carnot limits and entropy generation.

The first law only counts energy; the second law says which energy
conversions are actually possible. A cyclic device exchanging heat with a hot
reservoir (T_H) and a cold reservoir (T_L) can never beat the reversible
(Carnot) device operating between the same two temperatures, and the gap
between the real device and the Carnot limit is exactly the entropy it
generates (times a reference temperature).

Units: temperatures in K (absolute), heat and work in kJ. All heat and work
quantities are magnitudes; the direction of each flow is fixed by the mode:

    engine        heat Q_H in from hot reservoir, work W out, heat Q_L rejected
    refrigerator  heat Q_L in from cold space, work W in, heat Q_H rejected
    heat_pump     heat Q_H delivered to hot space, work W in, heat Q_L from cold
"""

from typing import Dict

import numpy as np

MODES = ('engine', 'refrigerator', 'heat_pump')


def compute_second_law(
    mode: str,
    t_hot: float,
    t_cold: float,
    q_ref: float,
    work: float,
    num_curve_points: int = 40,
) -> Dict:
    """
    Compare a real cyclic device against the Carnot limit and compute the
    entropy it generates.

    Args:
        mode: 'engine', 'refrigerator', or 'heat_pump'.
        t_hot: Hot reservoir temperature T_H, in K.
        t_cold: Cold reservoir temperature T_L, in K (must be below t_hot).
        q_ref: The heat the mode is "about": Q_H absorbed (engine), Q_L
            removed (refrigerator), Q_H delivered (heat pump), in kJ.
        work: Work magnitude W (output for an engine, input otherwise), in kJ.
        num_curve_points: Points on the Carnot-limit-vs-T_cold curve.

    Returns:
        Dictionary with q_hot, q_cold, performance (efficiency or COP),
        carnot_performance, second_law_efficiency, entropy_generation
        (kJ/K), reversible_work, lost_work (kJ), whether the device is
        physically feasible (S_gen >= 0), and a Carnot-limit curve.

    Formulas:
        eta_carnot     = 1 - T_L/T_H
        COP_R,carnot   = T_L / (T_H - T_L)
        COP_HP,carnot  = T_H / (T_H - T_L)
        S_gen (engine) = Q_L/T_L - Q_H/T_H
        S_gen (R / HP) = Q_H/T_H - Q_L/T_L
        lost work      = |W_actual - W_reversible| = T_0 * S_gen,
                         with T_0 = T_L for engine and heat pump, T_H for
                         refrigerator (the reservoir the extra heat leaks to)
    """

    if mode not in MODES:
        raise ValueError(f"mode must be one of {', '.join(MODES)}")
    if t_cold <= 0 or t_hot <= 0:
        raise ValueError("temperatures must be positive (use an absolute scale, e.g. kelvin)")
    if t_hot <= t_cold:
        raise ValueError("t_hot must be greater than t_cold")
    if q_ref <= 0:
        raise ValueError("q_ref must be positive")
    if work <= 0:
        raise ValueError("work must be positive")

    if mode == 'engine':
        q_hot = q_ref
        q_cold = q_hot - work
        if q_cold < 0:
            raise ValueError("work cannot exceed the heat input (first law: Q_L would be negative)")
        performance = work / q_hot
        carnot = 1.0 - t_cold / t_hot
        s_gen = q_cold / t_cold - q_hot / t_hot
        w_rev = q_hot * carnot
        lost = w_rev - work
        t0 = t_cold
    elif mode == 'refrigerator':
        q_cold = q_ref
        q_hot = q_cold + work
        performance = q_cold / work
        carnot = t_cold / (t_hot - t_cold)
        s_gen = q_hot / t_hot - q_cold / t_cold
        w_rev = q_cold / carnot
        lost = work - w_rev
        t0 = t_hot
    else:  # heat_pump
        q_hot = q_ref
        q_cold = q_hot - work
        if q_cold < 0:
            raise ValueError("work cannot exceed the heat delivered (first law: Q_L would be negative)")
        performance = q_hot / work
        carnot = t_hot / (t_hot - t_cold)
        s_gen = q_hot / t_hot - q_cold / t_cold
        w_rev = q_hot / carnot
        lost = work - w_rev
        t0 = t_cold

    feasible = s_gen >= -1e-9

    # Carnot limit as the cold temperature varies (hot held fixed)
    tc = np.linspace(0.3 * t_hot, 0.95 * t_hot, num_curve_points)
    if mode == 'engine':
        curve = 1.0 - tc / t_hot
    elif mode == 'refrigerator':
        curve = tc / (t_hot - tc)
    else:
        curve = t_hot / (t_hot - tc)

    return {
        'mode': mode,
        't_hot': t_hot,
        't_cold': t_cold,
        'q_hot': float(q_hot),
        'q_cold': float(q_cold),
        'work': work,
        'performance': float(performance),
        'carnot_performance': float(carnot),
        'second_law_efficiency': float(performance / carnot),
        'entropy_generation': float(s_gen),
        'reversible_work': float(w_rev),
        'lost_work': float(lost),
        'reference_temperature': float(t0),
        'feasible': bool(feasible),
        'carnot_curve': {
            't_cold': tc.tolist(),
            'performance': curve.tolist(),
        },
    }
