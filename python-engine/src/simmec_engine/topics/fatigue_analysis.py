"""
Fatigue Analysis Module - S-N Curves & the Modified Goodman Diagram
Used by Elements of Mechanical Design (MIT 2.72) Topic: Fatigue Analysis
"""

from dataclasses import dataclass
from typing import Dict, Optional

import numpy as np


@dataclass
class FatigueMaterialProperties:
    """Illustrative fatigue-property preset for a material family.

    These numbers are representative magnitudes for a generic member of
    the family (e.g. a medium-carbon steel, a 6xxx-series wrought
    aluminum), drawn from typical published ranges (Shigley's Mechanical
    Engineering Design's approximate sigma_f' ~= S_ut + 50 kpsi rule and
    b in [-0.05, -0.12] for steels; MatWeb-style aluminum fatigue data
    for the S_e stand-in). They are NOT the certified properties of any
    specific alloy/temper/heat-treatment and must never be used for real
    design work — this is an educational approximation only.
    """

    name: str
    ultimate_strength: float             # S_ut, MPa
    endurance_limit: float               # S_e, MPa
    fatigue_strength_coefficient: float  # sigma_f' in Basquin's equation, MPa
    fatigue_strength_exponent: float     # b in Basquin's equation (negative, dimensionless)


# Illustrative presets, mirrored by the material-preset buttons in
# FatigueAnalysis.tsx (kept in sync manually, same pattern as the local
# MATERIALS constant in BucklingAnalysis.tsx).
#
#   - steel: S_e' ~= 0.5 S_ut is the classic unmodified endurance-limit
#     rule of thumb for wrought steels with S_ut below ~1400 MPa.
#   - aluminum: aluminum alloys do not exhibit a true endurance limit.
#     The value below is a stand-in "fatigue strength" at a large but
#     finite cycle count (~5x10^8), used only so the same Goodman /
#     Basquin machinery can be demonstrated for a non-ferrous material;
#     it is explicitly NOT an infinite-life guarantee.
FATIGUE_MATERIALS: Dict[str, FatigueMaterialProperties] = {
    "steel": FatigueMaterialProperties(
        name="Steel (generic medium-carbon)",
        ultimate_strength=600.0,
        endurance_limit=300.0,
        fatigue_strength_coefficient=900.0,
        fatigue_strength_exponent=-0.085,
    ),
    "aluminum": FatigueMaterialProperties(
        name="Aluminum (generic 6xxx wrought, illustrative)",
        ultimate_strength=310.0,
        endurance_limit=96.0,
        fatigue_strength_coefficient=470.0,
        fatigue_strength_exponent=-0.11,
    ),
}


def compute_fatigue_analysis(
    mean_stress: float,
    alternating_stress: float,
    ultimate_strength: float,
    endurance_limit: float,
    fatigue_strength_coefficient: Optional[float] = None,
    fatigue_strength_exponent: Optional[float] = None,
    num_points: int = 50,
) -> Dict:
    """
    Compute the modified-Goodman fatigue safety factor for a part under
    fluctuating stress, plus (when possible) an illustrative estimate of
    cycles to failure.

    Args:
        mean_stress: Mean stress sigma_m, MPa (>= 0; the modified
            Goodman line as formulated here assumes a tensile mean
            stress).
        alternating_stress: Stress amplitude sigma_a, MPa (>= 0).
        ultimate_strength: Ultimate tensile strength S_ut, MPa.
        endurance_limit: Corrected endurance limit S_e (or S_e'), MPa.
        fatigue_strength_coefficient: sigma_f' in Basquin's equation,
            MPa. Optional; without it, no finite-life cycle count can be
            computed — only the Goodman safety factor / safe-unsafe call.
        fatigue_strength_exponent: b in Basquin's equation (negative).
            Optional, see above.
        num_points: Number of points used to draw the Goodman line for
            plotting.

    Returns:
        Dictionary with the safety factor, safe/unsafe verdict, the
        Goodman line and load line as point lists for plotting, the
        load-line / Goodman-line intersection ("failure point" at the
        current stress ratio), and the life-regime / cycles-to-failure
        estimate.

    Method / simplifying assumptions (this is an educational tool, not a
    certified design reference):

    - Modified Goodman: sigma_a/S_e + sigma_m/S_ut = 1/n. Because this
      relation is homogeneous of degree 1 in stress, scaling the
      *current* stress point (sigma_m, sigma_a) by n lands exactly on
      the Goodman line — that scaled point is returned as
      `intersection_point`: the stress state at which the part would
      first reach the Goodman boundary if both components were scaled up
      together, holding the load ratio sigma_a/sigma_m fixed.
    - The finite-life estimate uses the standard mean-stress-corrected
      equivalent fully-reversed amplitude
          sigma_ar = sigma_a / (1 - sigma_m / S_ut)
      (equivalent to projecting the actual point out to the sigma_m = 0
      axis along the Goodman line), then inverts Basquin's equation
      sigma_ar = sigma_f' (2N)^b for N. This is the same simplifying
      technique used in Shigley's Mechanical Engineering Design to turn
      a Goodman check into an approximate finite-life count.
    - If sigma_m alone is >= S_ut, the part has already exceeded its
      ultimate strength under the mean load, independent of the
      alternating component; this is reported as a static failure.
    """

    if ultimate_strength <= 0:
        raise ValueError("Ultimate strength must be positive")
    if endurance_limit <= 0:
        raise ValueError("Endurance limit must be positive")
    if endurance_limit > ultimate_strength:
        raise ValueError("Endurance limit cannot exceed ultimate strength")
    if mean_stress < 0:
        raise ValueError(
            "Mean stress must be non-negative; the modified Goodman line "
            "as formulated here applies to tensile mean stress"
        )
    if alternating_stress < 0:
        raise ValueError("Alternating stress amplitude must be non-negative")

    # --- Modified Goodman safety factor ----------------------------------
    # n = 1 / (sigma_a/S_e + sigma_m/S_ut)
    goodman_fraction = alternating_stress / endurance_limit + mean_stress / ultimate_strength
    safety_factor = 1.0 / goodman_fraction if goodman_fraction > 0 else float("inf")
    is_safe = bool(safety_factor >= 1.0)

    # The load line from the origin through (sigma_m, sigma_a), scaled by
    # n, lands exactly on the Goodman line (the Goodman equation is
    # homogeneous of degree 1 in stress), giving a closed-form
    # intersection with no root-finding needed.
    if np.isfinite(safety_factor):
        intersection_mean = safety_factor * mean_stress
        intersection_alt = safety_factor * alternating_stress
    else:
        # No load applied at all (0, 0): the ray has no direction, so
        # just report the endurance-limit point on the sigma_a axis.
        intersection_mean = 0.0
        intersection_alt = endurance_limit

    # --- Goodman line for plotting: (0, S_e) -> (S_ut, 0) -----------------
    sm = np.linspace(0.0, ultimate_strength, num_points)
    sa = endurance_limit * (1.0 - sm / ultimate_strength)
    goodman_line = [
        {"mean_stress": float(m), "alternating_stress": float(a)}
        for m, a in zip(sm, sa)
    ]

    # --- Load line for plotting: origin -> a bit past the intersection ---
    load_line_scale = max(safety_factor, 1.0) * 1.15 if np.isfinite(safety_factor) else 1.0
    load_line = [
        {"mean_stress": 0.0, "alternating_stress": 0.0},
        {
            "mean_stress": float(mean_stress * load_line_scale),
            "alternating_stress": float(alternating_stress * load_line_scale),
        },
    ]

    # --- Life estimate ------------------------------------------------------
    life_regime = "unknown"
    cycles_to_failure: Optional[float] = None
    equivalent_reversed_stress: Optional[float] = None

    if mean_stress >= ultimate_strength:
        life_regime = "static_failure"
    elif alternating_stress == 0:
        # Purely static load below S_ut: no cyclic damage at all.
        life_regime = "infinite"
    else:
        equivalent_reversed_stress = alternating_stress / (1.0 - mean_stress / ultimate_strength)
        if equivalent_reversed_stress <= endurance_limit:
            life_regime = "infinite"
        elif fatigue_strength_coefficient is not None and fatigue_strength_exponent is not None:
            if fatigue_strength_coefficient <= 0:
                raise ValueError("Fatigue strength coefficient (sigma_f') must be positive")
            if fatigue_strength_exponent >= 0:
                raise ValueError("Fatigue strength exponent b must be negative")
            ratio = equivalent_reversed_stress / fatigue_strength_coefficient
            cycles_to_failure = 0.5 * ratio ** (1.0 / fatigue_strength_exponent)
            life_regime = "finite"
        else:
            # Outside the Goodman envelope but no Basquin parameters were
            # supplied, so we can say life is finite without saying how
            # finite.
            life_regime = "finite_unquantified"

    return {
        "mean_stress": mean_stress,
        "alternating_stress": alternating_stress,
        "ultimate_strength": ultimate_strength,
        "endurance_limit": endurance_limit,
        "safety_factor": float(safety_factor),
        "is_safe": is_safe,
        "life_regime": life_regime,
        "cycles_to_failure": float(cycles_to_failure) if cycles_to_failure is not None else None,
        "equivalent_reversed_stress": (
            float(equivalent_reversed_stress) if equivalent_reversed_stress is not None else None
        ),
        "intersection_point": {
            "mean_stress": float(intersection_mean),
            "alternating_stress": float(intersection_alt),
        },
        "goodman_line": goodman_line,
        "load_line": load_line,
    }
