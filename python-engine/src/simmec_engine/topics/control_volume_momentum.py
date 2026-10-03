"""
Control-Volume Momentum Analysis Module
Used by Fluid Mechanics Topic: Control-Volume Momentum (Jet on a Vane)

A free jet of fluid strikes a vane that turns it through an angle theta.
Applying the steady linear-momentum equation to a control volume wrapped
around the vane gives the force the fluid exerts on it. Because the jet is
a free jet, pressure is atmospheric at the inlet and outlet, so only the
change in momentum flux produces a force.
"""

from typing import Dict

import numpy as np


def compute_control_volume_momentum(
    jet_diameter: float,
    jet_velocity: float,
    density: float,
    turning_angle: float,
    vane_velocity: float = 0.0,
) -> Dict:
    """
    Compute the force of a free jet on a fixed vane, a single moving vane,
    and a series of moving vanes (a wheel such as a Pelton runner).

    Args:
        jet_diameter: Jet diameter d in m
        jet_velocity: Absolute jet speed V in m/s
        density: Fluid density rho in kg/m^3
        turning_angle: Angle theta (deg) through which the vane turns the
            jet, measured from the incoming direction. 90 = flat plate
            normal to the jet, 180 = jet fully reversed (bucket).
        vane_velocity: Vane speed u in m/s in the direction of the jet
            (0 = fixed vane). Must be <= jet_velocity for the vane to be
            struck by the jet.

    Returns:
        Dictionary with the mass flow, fixed-vane force components, the
        single-moving-vane force, and the wheel (series of vanes) force,
        power and efficiency.

    Notes on the three cases (x is along the jet, force is on the vane):
        Fixed vane:        F_x = rho A V^2 (1 - cos theta)
        Single moving:     F_x = rho A (V-u)^2 (1 - cos theta)
                           (only the part of the jet that catches up with
                           the vane is deflected: relative mass flow
                           rho A (V-u))
        Wheel (many vanes): F_x = rho A V (V-u) (1 - cos theta)
                           (every kg of jet fluid is eventually turned,
                           so the full mass flow rho A V is deflected,
                           each kg changing its x velocity by (V-u)(1-cos))
    """

    if jet_diameter <= 0:
        raise ValueError("Jet diameter must be positive")
    if jet_velocity <= 0:
        raise ValueError("Jet velocity must be positive")
    if density <= 0:
        raise ValueError("Density must be positive")
    if not 0 <= turning_angle <= 180:
        raise ValueError("Turning angle must be between 0 and 180 degrees")
    if vane_velocity < 0:
        raise ValueError("Vane velocity must be non-negative")
    if vane_velocity > jet_velocity:
        raise ValueError("Vane velocity cannot exceed jet velocity (jet cannot catch the vane)")

    theta = np.radians(turning_angle)
    area = np.pi * jet_diameter**2 / 4
    mass_flow = density * area * jet_velocity

    one_minus_cos = 1 - np.cos(theta)
    sin_theta = np.sin(theta)

    # Fixed vane: momentum flux in = rho A V^2 along x; out has x-component
    # rho A V^2 cos(theta) and y-component rho A V^2 sin(theta).
    fixed_fx = density * area * jet_velocity**2 * one_minus_cos
    fixed_fy = density * area * jet_velocity**2 * sin_theta  # on vane, magnitude (acts -y)

    # Single moving vane
    v_rel = jet_velocity - vane_velocity
    single_fx = density * area * v_rel**2 * one_minus_cos
    single_fy = density * area * v_rel**2 * sin_theta

    # Series of vanes (wheel)
    wheel_fx = density * area * jet_velocity * v_rel * one_minus_cos
    wheel_power = wheel_fx * vane_velocity
    jet_power = 0.5 * mass_flow * jet_velocity**2
    wheel_efficiency = wheel_power / jet_power

    # Sweep of vane speed for the efficiency curve (0 .. V)
    ratio = np.linspace(0, 1, 41)
    efficiency_curve = 2 * ratio * (1 - ratio) * one_minus_cos

    return {
        'jet_diameter': jet_diameter,
        'jet_velocity': jet_velocity,
        'turning_angle': turning_angle,
        'vane_velocity': vane_velocity,
        'jet_area': float(area),
        'mass_flow': float(mass_flow),
        'relative_velocity': float(v_rel),
        'fixed_force_x': float(fixed_fx),
        'fixed_force_y': float(fixed_fy),
        'single_force_x': float(single_fx),
        'single_force_y': float(single_fy),
        'wheel_force_x': float(wheel_fx),
        'wheel_power': float(wheel_power),
        'jet_power': float(jet_power),
        'wheel_efficiency': float(wheel_efficiency),
        'efficiency_curve': {
            'speed_ratio': ratio.tolist(),
            'efficiency': efficiency_curve.tolist(),
        },
        'properties': {'density': density},
    }
