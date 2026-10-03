"""First Law of Thermodynamics — closed-system energy balance.

Every engine, refrigerator, and turbine obeys the same bookkeeping rule:
whatever energy enters a closed system as heat or work has to show up
somewhere, either stored inside the system (as internal energy) or carried
back out. For an ideal gas, internal energy depends only on temperature, so
a change in internal energy shows up directly as a change in temperature.

Units: mass in kg, specific_heat_cv in kJ/(kg*K), temperatures in K, heat
and work in kJ (sign convention: heat_added > 0 means heat flows INTO the
system; work_done_by_system > 0 means the system does work ON its
surroundings, e.g. expansion — a negative value means the surroundings do
work ON the system, e.g. compression).
"""

from typing import Dict, List

import numpy as np


def compute_first_law_thermodynamics(
    mass: float,
    specific_heat_cv: float,
    initial_temp: float,
    heat_added: float,
    work_done_by_system: float,
    num_curve_points: int = 40,
) -> Dict:
    """
    Compute the change in internal energy and resulting temperature change
    of a closed system from the first law: dU = Q - W.

    Args:
        mass: System mass, in kg.
        specific_heat_cv: Specific heat at constant volume, in kJ/(kg*K).
        initial_temp: Starting temperature, in K.
        heat_added: Heat added to the system, in kJ (negative = heat removed).
        work_done_by_system: Work done BY the system on its surroundings,
            in kJ (negative = work done ON the system, e.g. compression).
        num_curve_points: Number of points to generate for the
            delta_u-vs-heat_added visualization line.

    Returns:
        Dictionary with delta_u, delta_t, final_temp, and a curve tracing
        delta_u = Q - W as Q varies (work_done_by_system held fixed).

    Formulas:
        delta_u = Q - W
        delta_t = delta_u / (m * cv)          [ideal gas: dU = m cv dT]
        final_temp = initial_temp + delta_t
    """

    if mass <= 0:
        raise ValueError("mass must be positive")
    if specific_heat_cv <= 0:
        raise ValueError("specific_heat_cv must be positive")
    if initial_temp <= 0:
        raise ValueError("initial_temp must be positive (use an absolute scale, e.g. kelvin)")

    delta_u = heat_added - work_done_by_system
    delta_t = delta_u / (mass * specific_heat_cv)
    final_temp = initial_temp + delta_t

    q_samples = np.linspace(-200.0, 200.0, num_curve_points)
    curve: List[Dict] = [
        {"heat_added": float(q), "delta_u": float(q - work_done_by_system)} for q in q_samples
    ]

    return {
        "mass": float(mass),
        "specific_heat_cv": float(specific_heat_cv),
        "initial_temp": float(initial_temp),
        "heat_added": float(heat_added),
        "work_done_by_system": float(work_done_by_system),
        "delta_u": float(delta_u),
        "delta_t": float(delta_t),
        "final_temp": float(final_temp),
        "curve": curve,
    }
