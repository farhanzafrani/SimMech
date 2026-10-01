"""Newton's Second Law & Work-Energy Methods — braking distance via two routes.

A vehicle (or any mass) decelerates to a stop under kinetic friction. The
stopping distance can be found either by integrating F = ma directly (find
the deceleration, then use constant-acceleration kinematics), or by the
work-energy theorem (the work friction does over the stopping distance
must remove all of the initial kinetic energy). Both routes must agree —
that agreement is the point of the topic.

Units: mass in kg, speed in m/s, friction_coefficient is dimensionless.
Force in N, distance in m, time in s, energy/work in J.
"""

from typing import Dict, List

G = 9.81  # m/s^2, standard gravity


def compute_newton_work_energy(
    mass: float,
    initial_speed: float,
    friction_coefficient: float,
    num_curve_points: int = 40,
) -> Dict:
    """
    Compute the stopping distance of a mass sliding to a halt under kinetic
    friction, via both Newton's second law and the work-energy theorem.

    Args:
        mass: Mass of the object, in kg.
        initial_speed: Speed at the start of braking, in m/s.
        friction_coefficient: Kinetic friction coefficient (dimensionless).
        num_curve_points: Number of points to generate for the
            speed-vs-distance visualization curve.

    Returns:
        Dictionary with the friction force, deceleration, stopping
        distance and time (from F = ma), the initial kinetic energy and
        the work done by friction (from the work-energy theorem — equal
        to the kinetic energy by construction), and a speed-vs-distance
        curve tracing the deceleration profile.

    Formulas:
        friction_force = mu * m * g
        deceleration = mu * g
        stopping_distance = v1^2 / (2 * deceleration)
        stopping_time = v1 / deceleration
        initial_kinetic_energy = 0.5 * m * v1^2
        work_done_by_friction = friction_force * stopping_distance
    """

    if mass <= 0:
        raise ValueError("Mass must be positive")
    if initial_speed < 0:
        raise ValueError("Initial speed must be non-negative")
    if not (0 < friction_coefficient < 2):
        raise ValueError("Friction coefficient must be between 0 and 2")

    friction_force = friction_coefficient * mass * G
    deceleration = friction_coefficient * G
    stopping_distance = initial_speed**2 / (2 * deceleration)
    stopping_time = initial_speed / deceleration
    initial_kinetic_energy = 0.5 * mass * initial_speed**2
    work_done_by_friction = friction_force * stopping_distance

    curve: List[Dict] = []
    if stopping_distance > 0:
        for i in range(num_curve_points):
            d = stopping_distance * i / (num_curve_points - 1)
            speed_sq = max(initial_speed**2 - 2 * deceleration * d, 0.0)
            curve.append({"distance": float(d), "speed": float(speed_sq**0.5)})
    else:
        curve.append({"distance": 0.0, "speed": 0.0})

    return {
        "mass": float(mass),
        "initial_speed": float(initial_speed),
        "friction_coefficient": float(friction_coefficient),
        "friction_force": float(friction_force),
        "deceleration": float(deceleration),
        "stopping_distance": float(stopping_distance),
        "stopping_time": float(stopping_time),
        "initial_kinetic_energy": float(initial_kinetic_energy),
        "work_done_by_friction": float(work_done_by_friction),
        "curve": curve,
    }
