"""
Shaft Design Module - ASME Combined Bending-and-Torsion Fatigue Sizing
Used by Topic: Shaft Design Under Combined Bending and Torsion (MIT 2.72)

Implements the ASME "DE-Goodman" shaft-diameter equation for a rotating
shaft that sees an alternating bending moment (from a hung gear/pulley,
fully reversed as the shaft rotates) combined with a steady torque, at a
geometric discontinuity (shoulder fillet, keyway, etc.) described by a
stress-concentration factor K_t and a material notch sensitivity q.

    d^3 = (32 n / pi) * sqrt[ (Kf * Ma / Se)^2 + (3/4)(Kfs * Tm / Sut)^2 ]
    Kf  = 1 + q (Kt - 1)
    sigma_a' = Kf * 32 * Ma / (pi * d^3)

Unit convention (documented carefully because this equation is unit-sensitive):
    - Moments (M_a, T_m) are taken in N*m, the natural unit for a torque/
      moment slider.
    - Stresses (S_e, S_ut) are taken in MPa (N/mm^2), the natural unit for
      a material property.
    - The equation itself is dimensionally consistent only when moment and
      stress share a *length* unit (moment/stress = length^3). MPa uses mm,
      so moments are converted from N*m to N*mm (multiply by 1000) before
      dividing by a stress in MPa. The resulting d^3 is then in mm^3, and
      d comes out directly in millimeters - no further conversion needed.

Simplification: only one stress-concentration factor/notch-sensitivity pair
is provided (as is typical when a single shoulder fillet governs both the
bending and torsional stress risers at that section), so Kfs is taken equal
to Kf. This is the standard simplification used when separate K_t charts for
bending vs. torsion aren't being looked up separately.

Hand-verification (used while developing this module):
    Ma = 100 N*m, Tm = 50 N*m, Se = 200 MPa, Sut = 600 MPa, Kt = 1.5,
    q = 0.8, n = 2  ->  Kf = 1.4, d ~= 24.33 mm, sigma_a' ~= 98.97 MPa.
    Back-substituting d = 24.33 mm recovers a safety factor of ~2.00,
    confirming the forward/inverse formulas are consistent. This falls
    within the 20-40 mm range typical of Shigley-style worked examples
    for moderate moments on 200-700 MPa steels.
"""

import numpy as np
from typing import Dict


def compute_shaft_design(
    alternating_moment: float,
    mean_torque: float,
    endurance_limit: float,
    ultimate_strength: float,
    stress_concentration_factor: float,
    notch_sensitivity: float,
    target_safety_factor: float,
    num_points: int = 40,
) -> Dict:
    """
    Compute the ASME DE-Goodman shaft diameter for combined alternating
    bending and steady torsion at a stress-concentration feature (fillet).

    Args:
        alternating_moment: Alternating bending moment M_a, N*m
        mean_torque: Steady (mean) torque T_m, N*m
        endurance_limit: Corrected endurance limit S_e, MPa
        ultimate_strength: Ultimate tensile strength S_ut, MPa
        stress_concentration_factor: Geometric stress-concentration factor K_t
            (e.g. from a shoulder-fillet chart), dimensionless, >= 1
        notch_sensitivity: Notch sensitivity q, 0 (no notch effect) to 1
            (full theoretical effect)
        target_safety_factor: Desired design factor of safety n, > 0
        num_points: Number of points to sample for the diameter-vs-safety-
            factor curve

    Returns:
        Dictionary with the fatigue stress-concentration factor K_f, the
        required minimum shaft diameter (mm), the resulting alternating
        von Mises stress at the fillet at that diameter (MPa), a
        diameter rounded up to the nearest millimeter with its actual
        resulting safety factor, and a (diameter_mm, safety_factor)
        distribution suitable for a small curve plot.
    """

    if endurance_limit <= 0:
        raise ValueError("Endurance limit must be positive")
    if ultimate_strength <= 0:
        raise ValueError("Ultimate strength must be positive")
    if target_safety_factor <= 0:
        raise ValueError("Target safety factor must be positive")
    if stress_concentration_factor < 1:
        raise ValueError("Stress-concentration factor K_t must be >= 1")
    if not (0 <= notch_sensitivity <= 1):
        raise ValueError("Notch sensitivity q must be between 0 and 1")
    if alternating_moment < 0 or mean_torque < 0:
        raise ValueError("Moments must be non-negative")
    if alternating_moment == 0 and mean_torque == 0:
        raise ValueError("At least one of alternating moment or mean torque must be nonzero")

    # Fatigue stress-concentration factor: Kf = 1 + q(Kt - 1)
    fatigue_stress_concentration_factor = 1 + notch_sensitivity * (
        stress_concentration_factor - 1
    )
    kf = fatigue_stress_concentration_factor
    kfs = kf  # same fillet assumed to govern both bending and torsional risers

    # Convert moments from N*m to N*mm so they pair correctly with MPa (N/mm^2)
    ma_nmm = alternating_moment * 1000.0
    tm_nmm = mean_torque * 1000.0

    # Bending-fatigue term and torsion-steady term, both in mm^3
    bending_term = kf * ma_nmm / endurance_limit
    torsion_term = kfs * tm_nmm / ultimate_strength
    combined = float(np.sqrt(bending_term**2 + 0.75 * torsion_term**2))

    # d^3 = (32n/pi) * combined  ->  d in mm
    diameter_cubed = (32.0 * target_safety_factor / np.pi) * combined
    required_diameter = float(diameter_cubed ** (1.0 / 3.0))

    # Actual alternating von Mises stress at the fillet, at the required diameter
    alternating_stress = float(
        kf * 32.0 * ma_nmm / (np.pi * required_diameter**3)
    ) if required_diameter > 0 else 0.0

    # A practical shaft is machined to a rounded-up size; report its actual
    # resulting safety factor too ("check n given d" mode).
    rounded_diameter = float(np.ceil(required_diameter))
    rounded_safety_factor = (
        float((np.pi * rounded_diameter**3 / 32.0) / combined)
        if combined > 0
        else float("inf")
    )

    # Diameter-vs-safety-factor curve, sampled around the required diameter
    d_min = max(required_diameter * 0.4, 1.0)
    d_max = max(required_diameter * 2.0, d_min + 1.0)
    diameters = np.linspace(d_min, d_max, num_points)
    if combined > 0:
        safety_factors = (np.pi * diameters**3 / 32.0) / combined
    else:
        safety_factors = np.full_like(diameters, np.inf)

    distribution = [
        {"diameter_mm": float(d), "safety_factor": float(sf)}
        for d, sf in zip(diameters, safety_factors)
    ]

    return {
        "alternating_moment": alternating_moment,
        "mean_torque": mean_torque,
        "endurance_limit": endurance_limit,
        "ultimate_strength": ultimate_strength,
        "stress_concentration_factor": stress_concentration_factor,
        "notch_sensitivity": notch_sensitivity,
        "target_safety_factor": target_safety_factor,
        "fatigue_stress_concentration_factor": float(kf),
        "required_diameter": required_diameter,
        "alternating_stress": alternating_stress,
        "rounded_diameter": rounded_diameter,
        "rounded_safety_factor": rounded_safety_factor,
        "distribution": distribution,
    }


# Example usage / manual verification
if __name__ == "__main__":
    result = compute_shaft_design(
        alternating_moment=100.0,
        mean_torque=50.0,
        endurance_limit=200.0,
        ultimate_strength=600.0,
        stress_concentration_factor=1.5,
        notch_sensitivity=0.8,
        target_safety_factor=2.0,
    )
    print(f"Kf = {result['fatigue_stress_concentration_factor']:.4f}")
    print(f"Required diameter = {result['required_diameter']:.3f} mm")
    print(f"Alternating stress at fillet = {result['alternating_stress']:.3f} MPa")
    print(
        f"Rounded diameter = {result['rounded_diameter']:.1f} mm, "
        f"n = {result['rounded_safety_factor']:.3f}"
    )
