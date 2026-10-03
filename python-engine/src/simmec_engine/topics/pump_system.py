"""
Pump and System Curve Module
Used by Fluid Mechanics Topic: Pumps and System Curves (Operating Point, NPSH)

A centrifugal pump delivers whatever flow makes its head curve cross the
head the piping system demands. Net positive suction head available vs.
required (NPSHa vs NPSHr) tells you whether the liquid will flash to vapor
at the impeller eye (cavitation) at that operating point.
"""

from typing import Dict

import numpy as np

G = 9.80665  # m/s^2


def friction_factor(reynolds: float, relative_roughness: float) -> float:
    """Darcy friction factor: 64/Re (laminar) or Swamee-Jain (turbulent)."""
    if reynolds <= 0:
        return 0.0
    if reynolds < 2300:
        return 64 / reynolds
    return 0.25 / np.log10(relative_roughness / 3.7 + 5.74 / reynolds**0.9) ** 2


def system_head(q, static_head, diameter, length, minor_k, roughness, density, viscosity):
    """Head required by the piping system at flow q (m^3/s)."""
    area = np.pi * diameter**2 / 4
    v = abs(q) / area
    re = density * v * diameter / viscosity
    f = friction_factor(re, roughness / diameter)
    return static_head + (f * length / diameter + minor_k) * v**2 / (2 * G)


def compute_pump_system(
    shutoff_head: float,
    rated_flow: float,
    rated_head: float,
    peak_efficiency: float,
    static_head: float,
    pipe_diameter: float,
    pipe_length: float,
    minor_loss_k: float,
    roughness: float,
    density: float,
    viscosity: float,
    atmospheric_pressure: float,
    vapor_pressure: float,
    suction_head: float,
    suction_loss_k: float,
    npsh_required: float,
) -> Dict:
    """
    Find the operating point of a pump on a piping system and check NPSH.

    Pump head curve:   H_p(Q) = H0 - a Q^2,  a = (H0 - H_rated) / Q_rated^2
    System curve:      H_s(Q) = H_static + (f L/D + sum K) V^2 / (2 g)
    Efficiency model:  eta(Q) = eta_peak * (2 Q/Q_bep - (Q/Q_bep)^2),
                       with the best-efficiency point at the rated flow
    NPSHa = (p_atm - p_vap)/(rho g) + z_s - K_s V^2/(2 g)

    Args:
        shutoff_head: H0, pump head at zero flow in m
        rated_flow: Q_rated in m^3/s (also taken as best-efficiency flow)
        rated_head: pump head at the rated flow in m (must be < H0)
        peak_efficiency: eta at the best-efficiency point (0-1)
        static_head: Elevation difference + pressure head to overcome in m
        pipe_diameter, pipe_length: m
        minor_loss_k: Sum of minor-loss coefficients (fittings, valves)
        roughness: Absolute pipe roughness in m
        density, viscosity: kg/m^3 and Pa.s
        atmospheric_pressure, vapor_pressure: Pa (absolute)
        suction_head: z_s, height of the free surface above the pump
            centerline in m (negative if the pump sits above the liquid)
        suction_loss_k: Sum of suction-side loss coefficients (incl. friction)
        npsh_required: NPSHr from the pump datasheet in m
    """
    if shutoff_head <= 0:
        raise ValueError("Shutoff head must be positive")
    if rated_flow <= 0:
        raise ValueError("Rated flow must be positive")
    if rated_head <= 0 or rated_head >= shutoff_head:
        raise ValueError("Rated head must be positive and less than shutoff head")
    if not 0 < peak_efficiency <= 1:
        raise ValueError("Peak efficiency must be in (0, 1]")
    if static_head < 0:
        raise ValueError("Static head must be non-negative")
    if pipe_diameter <= 0 or pipe_length <= 0:
        raise ValueError("Pipe diameter and length must be positive")
    if minor_loss_k < 0 or suction_loss_k < 0:
        raise ValueError("Loss coefficients must be non-negative")
    if roughness < 0 or roughness >= pipe_diameter:
        raise ValueError("Roughness must be non-negative and smaller than the diameter")
    if density <= 0 or viscosity <= 0:
        raise ValueError("Density and viscosity must be positive")
    if atmospheric_pressure <= 0 or vapor_pressure < 0:
        raise ValueError("Pressures must be positive (absolute)")
    if npsh_required < 0:
        raise ValueError("NPSH required must be non-negative")

    a = (shutoff_head - rated_head) / rated_flow**2

    def pump_head(q):
        return shutoff_head - a * np.asarray(q) ** 2

    def sys_head(q):
        return system_head(q, static_head, pipe_diameter, pipe_length, minor_loss_k,
                           roughness, density, viscosity)

    def gap(q):
        return float(pump_head(q) - sys_head(q))

    # Pump head is decreasing, system head is increasing in Q, so gap(Q)
    # crosses zero once. If even at zero flow the pump cannot reach the
    # static head, there is no operating point.
    if gap(1e-9) <= 0:
        raise ValueError(
            "Pump shutoff head does not exceed the static head: no flow is possible"
        )
    q_hi = rated_flow * 5
    while gap(q_hi) > 0:
        q_hi *= 2
    q_lo = 1e-9
    for _ in range(100):
        q_mid = 0.5 * (q_lo + q_hi)
        if gap(q_mid) > 0:
            q_lo = q_mid
        else:
            q_hi = q_mid
    q_op = 0.5 * (q_lo + q_hi)

    h_op = float(pump_head(q_op))
    ratio = q_op / rated_flow
    eta = peak_efficiency * (2 * ratio - ratio**2)
    eta = max(float(eta), 0.0)
    hydraulic_power = density * G * q_op * h_op
    shaft_power = hydraulic_power / eta if eta > 0 else None

    area = np.pi * pipe_diameter**2 / 4
    v = q_op / area
    re = density * v * pipe_diameter / viscosity

    npsh_a = ((atmospheric_pressure - vapor_pressure) / (density * G)
              + suction_head - suction_loss_k * v**2 / (2 * G))
    margin = npsh_a - npsh_required

    q_grid = np.linspace(0, max(1.8 * rated_flow, 1.3 * q_op), 60)
    h_pump = pump_head(q_grid)
    h_sys = np.array([sys_head(q) for q in q_grid])
    r = q_grid / rated_flow
    eta_curve = np.maximum(peak_efficiency * (2 * r - r**2), 0)

    return {
        'operating_flow': float(q_op),
        'operating_head': h_op,
        'velocity': float(v),
        'reynolds': float(re),
        'friction_factor': float(friction_factor(re, roughness / pipe_diameter)),
        'efficiency': eta,
        'hydraulic_power': float(hydraulic_power),
        'shaft_power': None if shaft_power is None else float(shaft_power),
        'flow_vs_bep': float(ratio),
        'npsh_available': float(npsh_a),
        'npsh_required': npsh_required,
        'npsh_margin': float(margin),
        'cavitation_risk': bool(npsh_a < npsh_required),
        'curves': {
            'flow': q_grid.tolist(),
            'pump_head': h_pump.tolist(),
            'system_head': h_sys.tolist(),
            'efficiency': eta_curve.tolist(),
        },
    }
