"""
Drag and Lift Coefficient Module
Used by Fluid Mechanics Topic: Drag and Lift on Bodies

Bluff bodies (cylinder, sphere, flat disk) are dominated by pressure drag
from a separated wake, and their drag coefficient depends on shape and,
for the curved ones, on Reynolds number through the drag crisis.
A lifting wing is described by a lift-curve slope reduced by finite span
and a drag polar C_D = C_D0 + C_L^2 / (pi e AR).
"""

from typing import Dict

import numpy as np

# Representative drag coefficients (based on frontal projected area for
# bluff bodies), standard textbook values (e.g. White, Fluid Mechanics).
BLUFF_SHAPES = {
    # name: (subcritical C_D, supercritical C_D or None, label)
    'cylinder': (1.2, 0.5, 'Circular cylinder (long, cross-flow)'),
    'sphere': (0.47, 0.2, 'Sphere'),
    'disk': (1.17, None, 'Flat disk normal to flow'),
}
RE_CRISIS_LOW = 2e5
RE_CRISIS_HIGH = 5e5

A0_PER_RAD = 2 * np.pi    # thin-airfoil lift-curve slope


def compute_bluff_body(
    shape: str,
    diameter: float,
    length: float,
    velocity: float,
    density: float,
    viscosity: float,
) -> Dict:
    """
    Drag on a bluff body.

    Args:
        shape: 'cylinder', 'sphere' or 'disk'
        diameter: Characteristic diameter D in m
        length: Cylinder length in m (ignored for sphere/disk)
        velocity: Free-stream speed V in m/s
        density: rho in kg/m^3
        viscosity: Dynamic viscosity mu in Pa.s
    """
    if shape not in BLUFF_SHAPES:
        raise ValueError(f"Unknown shape '{shape}'. Choose from: {list(BLUFF_SHAPES)}")
    if diameter <= 0:
        raise ValueError("Diameter must be positive")
    if shape == 'cylinder' and length <= 0:
        raise ValueError("Cylinder length must be positive")
    if velocity < 0:
        raise ValueError("Velocity must be non-negative")
    if density <= 0:
        raise ValueError("Density must be positive")
    if viscosity <= 0:
        raise ValueError("Viscosity must be positive")

    sub, sup, label = BLUFF_SHAPES[shape]
    re = density * velocity * diameter / viscosity

    if sup is None or re <= RE_CRISIS_LOW:
        cd = sub
        flow_state = 'subcritical (laminar separation)'
    elif re >= RE_CRISIS_HIGH:
        cd = sup
        flow_state = 'supercritical (turbulent boundary layer, narrow wake)'
    else:
        # linear blend through the drag-crisis band
        frac = (re - RE_CRISIS_LOW) / (RE_CRISIS_HIGH - RE_CRISIS_LOW)
        cd = sub + frac * (sup - sub)
        flow_state = 'drag crisis (transition)'

    area = diameter * length if shape == 'cylinder' else np.pi * diameter**2 / 4
    q = 0.5 * density * velocity**2
    drag = cd * q * area

    # C_D versus Re band for the curve (log spaced)
    re_grid = np.logspace(3, 7, 60)
    if sup is None:
        cd_grid = np.full_like(re_grid, sub)
    else:
        frac = np.clip((re_grid - RE_CRISIS_LOW) / (RE_CRISIS_HIGH - RE_CRISIS_LOW), 0, 1)
        cd_grid = sub + frac * (sup - sub)

    return {
        'kind': 'bluff',
        'shape_label': label,
        'reynolds': float(re),
        'flow_state': flow_state,
        'drag_coefficient': float(cd),
        'lift_coefficient': 0.0,
        'reference_area': float(area),
        'dynamic_pressure': float(q),
        'drag_force': float(drag),
        'lift_force': 0.0,
        'lift_to_drag': None,
        'stalled': False,
        'curve': {'x': re_grid.tolist(), 'cd': cd_grid.tolist()},
    }


def compute_wing(
    angle_of_attack: float,
    aspect_ratio: float,
    wing_area: float,
    velocity: float,
    density: float,
    zero_lift_angle: float = 0.0,
    oswald_efficiency: float = 0.9,
    profile_drag: float = 0.01,
    stall_angle: float = 15.0,
) -> Dict:
    """
    Finite wing in linear (pre-stall) aerodynamics.

    a = a0 / (1 + a0 / (pi e AR)),   C_L = a (alpha - alpha_L0)
    C_Di = C_L^2 / (pi e AR),        C_D = C_D0 + C_Di

    Beyond the stall angle the linear model no longer applies: C_L is held
    at its stall-angle value and the result is flagged as stalled (real
    stalled wings lose lift and gain much more drag).
    """
    if aspect_ratio <= 0:
        raise ValueError("Aspect ratio must be positive")
    if wing_area <= 0:
        raise ValueError("Wing area must be positive")
    if velocity < 0:
        raise ValueError("Velocity must be non-negative")
    if density <= 0:
        raise ValueError("Density must be positive")
    if not 0 < oswald_efficiency <= 1:
        raise ValueError("Oswald efficiency must be in (0, 1]")
    if profile_drag < 0:
        raise ValueError("Profile drag coefficient must be non-negative")
    if stall_angle <= 0:
        raise ValueError("Stall angle must be positive")
    if abs(angle_of_attack) > 30:
        raise ValueError("Angle of attack must be within +/-30 degrees")

    k = np.pi * oswald_efficiency * aspect_ratio
    slope = A0_PER_RAD / (1 + A0_PER_RAD / k)         # per radian

    def cl_of(alpha_deg):
        a = np.minimum(np.asarray(alpha_deg, dtype=float), stall_angle)
        return slope * np.radians(a - zero_lift_angle)

    cl = float(cl_of(angle_of_attack))
    cdi = cl**2 / k
    cd = profile_drag + cdi
    stalled = angle_of_attack > stall_angle

    q = 0.5 * density * velocity**2
    lift = cl * q * wing_area
    drag = cd * q * wing_area

    alphas = np.linspace(-6, 20, 53)
    cl_curve = cl_of(alphas)
    cd_curve = profile_drag + cl_curve**2 / k

    return {
        'kind': 'wing',
        'shape_label': 'Finite wing',
        'reynolds': None,
        'flow_state': 'stalled (linear theory invalid)' if stalled else 'attached flow',
        'lift_curve_slope': float(slope),
        'lift_curve_slope_per_deg': float(slope * np.pi / 180),
        'drag_coefficient': float(cd),
        'induced_drag_coefficient': float(cdi),
        'lift_coefficient': cl,
        'reference_area': float(wing_area),
        'dynamic_pressure': float(q),
        'drag_force': float(drag),
        'lift_force': float(lift),
        'lift_to_drag': float(cl / cd) if cd > 0 else None,
        'stalled': bool(stalled),
        'curve': {'x': alphas.tolist(), 'cl': cl_curve.tolist(), 'cd': cd_curve.tolist()},
    }
