"""
Failure Theories Module - Von Mises & Tresca Yield Criteria
Used by Topic: Failure Theories: Von Mises & Tresca
"""

import numpy as np
from typing import Dict


def compute_failure_theories(
    sigma_x: float,
    sigma_y: float,
    tau_xy: float,
    yield_stress: float,
    num_ellipse_points: int = 60,
) -> Dict:
    """
    Compute principal stresses from a 2D (plane-stress) state and evaluate
    both the von Mises (distortion-energy) and Tresca (maximum-shear-stress)
    failure theories against a given yield strength.

    Args:
        sigma_x: Normal stress on the x-face, MPa
        sigma_y: Normal stress on the y-face, MPa
        tau_xy: Shear stress on the x-face, MPa
        yield_stress: Uniaxial tensile yield stress σ_y, MPa

    Returns:
        Dictionary with the in-plane principal stresses, the von Mises and
        Tresca effective stresses, the factor of safety under each theory,
        and normalized (σ1/σy, σ2/σy) points describing the von Mises
        ellipse and Tresca hexagon failure envelopes plus the current
        design point's location relative to them.
    """

    if yield_stress <= 0:
        raise ValueError("Yield stress must be positive")

    # --- In-plane principal stresses (same construction as Mohr's circle) ---
    sigma_avg = (sigma_x + sigma_y) / 2
    radius = float(np.sqrt(((sigma_x - sigma_y) / 2) ** 2 + tau_xy**2))

    sigma_1 = float(sigma_avg + radius)
    sigma_2 = float(sigma_avg - radius)

    # --- Von Mises effective stress (plane stress) ---
    # σ' = √(σ1² − σ1σ2 + σ2²)
    von_mises_stress = float(np.sqrt(sigma_1**2 - sigma_1 * sigma_2 + sigma_2**2))

    # --- Tresca effective stress ---
    # Plane stress means the third principal stress (out of plane) is 0.
    # Tresca uses the largest and smallest of ALL THREE principal stresses,
    # not just the two in-plane ones — this matters whenever σ1 and σ2 are
    # both positive (or both negative), since 0 then becomes the extreme.
    principal_stresses = np.sort([sigma_1, sigma_2, 0.0])[::-1]  # descending
    sigma_1_full = float(principal_stresses[0])
    sigma_2_mid_full = float(principal_stresses[1])
    sigma_3_full = float(principal_stresses[2])

    tresca_stress = sigma_1_full - sigma_3_full  # σ1 − σ3
    max_shear_stress = tresca_stress / 2

    # --- Factors of safety ---
    safety_factor_von_mises = (
        yield_stress / von_mises_stress if von_mises_stress > 0 else float('inf')
    )
    safety_factor_tresca = (
        yield_stress / tresca_stress if tresca_stress > 0 else float('inf')
    )

    if safety_factor_von_mises < safety_factor_tresca:
        governing_theory = 'von_mises'
    elif safety_factor_tresca < safety_factor_von_mises:
        governing_theory = 'tresca'
    else:
        governing_theory = 'equal'

    # --- Normalized (σ1/σy, σ2/σy) space for the failure-envelope plot ---
    design_point = {
        'sigma_1': sigma_1 / yield_stress,
        'sigma_2': sigma_2 / yield_stress,
    }

    # Von Mises ellipse: x² − xy + y² = 1 in normalized space.
    # In polar form (x = r cosθ, y = r sinθ): r² (1 − cosθ sinθ) = 1
    # => r(θ) = 1 / √(1 − 0.5 sin 2θ)
    theta = np.linspace(0, 2 * np.pi, num_ellipse_points)
    r = 1.0 / np.sqrt(1 - 0.5 * np.sin(2 * theta))
    ellipse_x = r * np.cos(theta)
    ellipse_y = r * np.sin(theta)
    von_mises_ellipse = [
        {'sigma_1': float(x), 'sigma_2': float(y)} for x, y in zip(ellipse_x, ellipse_y)
    ]

    # Tresca hexagon: with σ3 = 0, yielding occurs when
    # max(|σ1 − σ2|, |σ1|, |σ2|) = σy. In normalized (x, y) space this traces
    # a hexagon with vertices at (1,0), (1,1), (0,1), (-1,0), (-1,-1), (0,-1) —
    # exactly the points where the von Mises ellipse is tangent to it.
    hexagon_vertices = [
        (1.0, 0.0),
        (1.0, 1.0),
        (0.0, 1.0),
        (-1.0, 0.0),
        (-1.0, -1.0),
        (0.0, -1.0),
        (1.0, 0.0),
    ]
    tresca_hexagon = [{'sigma_1': x, 'sigma_2': y} for x, y in hexagon_vertices]

    return {
        'sigma_x': sigma_x,
        'sigma_y': sigma_y,
        'tau_xy': tau_xy,
        'yield_stress': yield_stress,
        'sigma_1': sigma_1,
        'sigma_2': sigma_2,
        'sigma_3': sigma_3_full,
        'von_mises_stress': von_mises_stress,
        'tresca_stress': tresca_stress,
        'max_shear_stress': float(max_shear_stress),
        'safety_factor_von_mises': float(safety_factor_von_mises),
        'safety_factor_tresca': float(safety_factor_tresca),
        'governing_theory': governing_theory,
        'design_point': design_point,
        'von_mises_ellipse': von_mises_ellipse,
        'tresca_hexagon': tresca_hexagon,
    }


# Example usage and testing
if __name__ == '__main__':
    # Pure shear sanity check: σ1 = T, σ2 = -T, von Mises = √3 T, Tresca = 2T
    result = compute_failure_theories(sigma_x=0, sigma_y=0, tau_xy=100, yield_stress=250)
    print("Pure shear (τ=100 MPa):")
    print(f"  σ1 = {result['sigma_1']:.3f}, σ2 = {result['sigma_2']:.3f}")
    print(f"  Von Mises σ' = {result['von_mises_stress']:.3f} (expect {100*np.sqrt(3):.3f})")
    print(f"  Tresca σ1-σ3 = {result['tresca_stress']:.3f} (expect {200:.3f})")
    print(f"  n_vm = {result['safety_factor_von_mises']:.3f}, n_tresca = {result['safety_factor_tresca']:.3f}")
    print(
        f"  Ratio tresca_stress/von_mises_stress = "
        f"{result['tresca_stress']/result['von_mises_stress']:.4f} (expect {2/np.sqrt(3):.4f})"
    )
