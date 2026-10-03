"""Pipe Flow & Convective Heat Transfer — friction loss and cooling along a
pipe.

Fluid pushed through a pipe loses pressure to friction (the Darcy-Weisbach
equation), and if the pipe wall is hotter or colder than the surroundings,
the fluid exchanges heat with it (Newton's law of cooling). Both effects
depend on the same flow: the Reynolds number decides whether the flow is
laminar or turbulent, which sets the friction factor, while the
convection coefficient sets the heat flux.

Units: density in kg/m^3, kinematic_viscosity in m^2/s, velocity in m/s,
diameter and length in m, convection_coefficient in W/(m^2*K),
temperatures in deg C (a temperature DIFFERENCE, so C and K agree).
"""

from typing import Dict, List

import numpy as np

G = 9.81  # m/s^2, standard gravity


def _friction_factor(reynolds: float) -> float:
    """Laminar (Re < 2300): f = 64/Re. Turbulent: Blasius f = 0.316 Re^-0.25
    (valid roughly 4000 < Re < 1e5, used here as a smooth-pipe approximation
    across the whole turbulent range for teaching purposes)."""
    if reynolds < 2300:
        return 64.0 / reynolds
    return 0.316 * reynolds ** (-0.25)


def compute_pipe_flow_heat_transfer(
    density: float,
    kinematic_viscosity: float,
    velocity: float,
    diameter: float,
    length: float,
    convection_coefficient: float,
    surface_temp: float,
    fluid_temp: float,
    num_curve_points: int = 40,
) -> Dict:
    """
    Compute the Reynolds number, friction factor, Darcy-Weisbach head
    loss, and convective heat flux for flow through a straight pipe.

    Args:
        density: Fluid density rho, in kg/m^3.
        kinematic_viscosity: Kinematic viscosity nu, in m^2/s.
        velocity: Mean flow velocity V, in m/s.
        diameter: Pipe inner diameter D, in m.
        length: Pipe length L, in m.
        convection_coefficient: Convective heat transfer coefficient h,
            in W/(m^2*K).
        surface_temp: Pipe wall surface temperature Ts, in deg C.
        fluid_temp: Bulk fluid (or surrounding) temperature Tinf, in deg C.
        num_curve_points: Number of points along the velocity sweep for
            the head-loss visualization curve.

    Returns:
        Dictionary with Reynolds number, flow regime, friction factor,
        head loss, pressure drop, heat flux, and a head-loss-vs-velocity
        curve at the same pipe geometry and fluid properties.

    Formulas:
        Re = V D / nu
        f  = 64/Re (laminar, Re<2300) or 0.316 Re^-0.25 (turbulent, Blasius)
        h_loss = f (L/D) (V^2 / 2g)               [Darcy-Weisbach, meters of fluid]
        delta_p = rho g h_loss
        q'' = h (Ts - Tinf)                        [Newton's law of cooling]
    """

    if density <= 0:
        raise ValueError("density must be positive")
    if kinematic_viscosity <= 0:
        raise ValueError("kinematic_viscosity must be positive")
    if velocity <= 0:
        raise ValueError("velocity must be positive")
    if diameter <= 0:
        raise ValueError("diameter must be positive")
    if length <= 0:
        raise ValueError("length must be positive")
    if convection_coefficient < 0:
        raise ValueError("convection_coefficient must be non-negative")

    reynolds = velocity * diameter / kinematic_viscosity
    flow_regime = "laminar" if reynolds < 2300 else "turbulent"
    friction_factor = _friction_factor(reynolds)

    head_loss = friction_factor * (length / diameter) * (velocity**2 / (2 * G))
    pressure_drop = density * G * head_loss

    heat_flux = convection_coefficient * (surface_temp - fluid_temp)

    velocities = np.linspace(max(velocity * 0.1, 0.01), velocity * 3, num_curve_points)
    curve: List[Dict] = []
    for v in velocities:
        re_v = v * diameter / kinematic_viscosity
        f_v = _friction_factor(re_v)
        hl_v = f_v * (length / diameter) * (v**2 / (2 * G))
        curve.append({"velocity": float(v), "head_loss": float(hl_v)})

    return {
        "density": float(density),
        "kinematic_viscosity": float(kinematic_viscosity),
        "velocity": float(velocity),
        "diameter": float(diameter),
        "length": float(length),
        "convection_coefficient": float(convection_coefficient),
        "surface_temp": float(surface_temp),
        "fluid_temp": float(fluid_temp),
        "reynolds": float(reynolds),
        "flow_regime": flow_regime,
        "friction_factor": float(friction_factor),
        "head_loss": float(head_loss),
        "pressure_drop": float(pressure_drop),
        "heat_flux": float(heat_flux),
        "curve": curve,
    }
