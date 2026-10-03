"""
Flat-Plate Boundary Layer Module
Used by Fluid Mechanics Topic: Boundary Layers (Blasius solution, skin-friction drag)

Flow of speed U along a thin flat plate at zero incidence. Viscosity acts
only inside a thin layer next to the wall; the Blasius similarity solution
gives that layer exactly while it stays laminar, and the 1/7-power-law
correlations describe it once it turns turbulent.
"""

from typing import Dict

import numpy as np

RE_TRANSITION = 5e5   # common critical Reynolds number for a smooth flat plate

# Blasius wall curvature f''(0) from the numerical solution of f''' + f f''/2 = 0
BLASIUS_FPP0 = 0.33206


def blasius_profile(eta_max: float = 8.0, n: int = 161):
    """
    Integrate the Blasius equation f''' + (1/2) f f'' = 0 with
    f(0) = f'(0) = 0, f''(0) = 0.33206 using classical RK4.
    Returns eta, f'(eta) = u/U.
    """
    h = eta_max / (n - 1)
    state = np.array([0.0, 0.0, BLASIUS_FPP0])  # f, f', f''

    def rhs(s):
        return np.array([s[1], s[2], -0.5 * s[0] * s[2]])

    eta = np.linspace(0, eta_max, n)
    fp = np.zeros(n)
    for i in range(n):
        fp[i] = state[1]
        k1 = rhs(state)
        k2 = rhs(state + 0.5 * h * k1)
        k3 = rhs(state + 0.5 * h * k2)
        k4 = rhs(state + h * k3)
        state = state + h * (k1 + 2 * k2 + 2 * k3 + k4) / 6
    return eta, fp


def compute_boundary_layer(
    free_stream_velocity: float,
    plate_length: float,
    kinematic_viscosity: float,
    density: float,
    plate_width: float = 1.0,
) -> Dict:
    """
    Boundary-layer thickness, skin friction and drag on one side of a
    flat plate.

    Args:
        free_stream_velocity: U in m/s
        plate_length: L in m (flow direction)
        kinematic_viscosity: nu in m^2/s
        density: rho in kg/m^3
        plate_width: b in m (span)

    Laminar (Re_x < 5e5, Blasius):
        delta_99 = 4.91 x / sqrt(Re_x),  delta* = 1.721 x / sqrt(Re_x)
        theta = 0.664 x / sqrt(Re_x),    c_f = 0.664 / sqrt(Re_x)
        C_D = 1.328 / sqrt(Re_L)
    Turbulent (1/7 power law, smooth plate):
        delta = 0.37 x / Re_x^(1/5),     c_f = 0.0576 / Re_x^(1/5)
        C_D = 0.074 / Re_L^(1/5)
    Mixed (laminar front, turbulent rear, transition at Re = 5e5):
        C_D = 0.074 / Re_L^(1/5) - 1742 / Re_L
    """
    if free_stream_velocity <= 0:
        raise ValueError("Free-stream velocity must be positive")
    if plate_length <= 0:
        raise ValueError("Plate length must be positive")
    if kinematic_viscosity <= 0:
        raise ValueError("Kinematic viscosity must be positive")
    if density <= 0:
        raise ValueError("Density must be positive")
    if plate_width <= 0:
        raise ValueError("Plate width must be positive")

    U, L, nu = free_stream_velocity, plate_length, kinematic_viscosity
    re_l = U * L / nu
    x_transition = RE_TRANSITION * nu / U      # laminar -> turbulent location
    transitions = re_l > RE_TRANSITION

    def local_quantities(x):
        """Local delta, delta*, theta, c_f at position(s) x (array)."""
        x = np.asarray(x, dtype=float)
        re_x = U * np.maximum(x, 1e-12) / nu
        lam = re_x <= RE_TRANSITION
        sqrt_re = np.sqrt(re_x)
        delta = np.where(lam, 4.91 * x / sqrt_re, 0.37 * x / re_x**0.2)
        delta_star = np.where(lam, 1.721 * x / sqrt_re, delta / 8)   # 1/7 law: delta*/delta = 1/8
        theta = np.where(lam, 0.664 * x / sqrt_re, delta * 7 / 72)  # 1/7 law: theta/delta = 7/72
        cf = np.where(lam, 0.664 / sqrt_re, 0.0576 / re_x**0.2)
        return delta, delta_star, theta, cf

    d, ds, th, cf = local_quantities(L)

    if re_l <= RE_TRANSITION:
        cd = 1.328 / np.sqrt(re_l)
        regime = 'laminar'
    else:
        cd = 0.074 / re_l**0.2 - 1742 / re_l
        regime = 'mixed (laminar then turbulent)'

    q = 0.5 * density * U**2
    wall_shear = cf * q
    drag = cd * q * L * plate_width

    xs = np.linspace(0, L, 41)
    xs_eval = np.maximum(xs, L * 1e-6)
    dx, _, _, _ = local_quantities(xs_eval)
    dx[0] = 0.0
    eta, fp = blasius_profile()

    # Blasius delta_99: eta where f' first reaches 0.99
    idx = int(np.argmax(fp >= 0.99))
    eta99 = float(np.interp(0.99, fp[idx - 1:idx + 1], eta[idx - 1:idx + 1]))

    return {
        'free_stream_velocity': U,
        'plate_length': L,
        'reynolds_length': float(re_l),
        'transition_location': float(x_transition) if transitions else None,
        'regime': regime,
        'delta': float(d),
        'displacement_thickness': float(ds),
        'momentum_thickness': float(th),
        'skin_friction_local': float(cf),
        'wall_shear': float(wall_shear),
        'drag_coefficient': float(cd),
        'drag_force': float(drag),
        'dynamic_pressure': float(q),
        'blasius_eta99': eta99,
        'thickness_curve': {'x': xs.tolist(), 'delta': dx.tolist()},
        'velocity_profile': {
            'eta': eta[::4].tolist(),
            'u_over_U': fp[::4].tolist(),
        },
    }
