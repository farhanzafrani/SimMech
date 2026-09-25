"""Rolling-Element Bearing Selection — L10 fatigue life computation.

Rolling-contact fatigue is statistical: no two identical bearings fail at
exactly the same number of revolutions. The L10 life is the number of
revolutions (in millions) that 90% of a batch of identical bearings are
expected to survive before the first sign of fatigue. It depends only on
the ratio of the manufacturer's catalog dynamic load rating to the actual
equivalent applied load, raised to a power that depends on the type of
rolling element.

Units: C (dynamic load rating) and P (equivalent applied radial load) are
both in kilonewtons (kN) — any consistent unit works since only the ratio
C/P matters, but kN matches the load units used elsewhere in this app
(see buckling.py). Shaft speed n is in rpm.
"""

from typing import Dict, List, Optional

import numpy as np

# Life exponent k: 3 for ball bearings (point contact), 10/3 for roller
# bearings (line contact) — the standard ANSI/AFBMA values.
BEARING_LIFE_EXPONENTS = {
    "ball": 3.0,
    "roller": 10.0 / 3.0,
}

# Illustrative duty cycle used to convert raw operating hours into a more
# intuitive "years of service" figure: 8 hours/day, 5 days/week.
TYPICAL_DUTY_HOURS_PER_YEAR = 8 * 5 * 52  # 2080 h/yr


def compute_bearing_selection(
    mode: str,
    bearing_type: str,
    applied_load: float,
    shaft_speed: float,
    dynamic_load_rating: Optional[float] = None,
    target_life_hours: Optional[float] = None,
    num_curve_points: int = 40,
) -> Dict:
    """
    Compute L10 fatigue life for a rolling-element bearing, or back-solve
    for the minimum catalog dynamic load rating needed to hit a target
    service life.

    Args:
        mode: "life" (compute L10 from a given dynamic_load_rating) or
            "required_rating" (solve for the dynamic_load_rating needed
            to reach target_life_hours).
        bearing_type: "ball" (k=3) or "roller" (k=10/3).
        applied_load: Equivalent applied radial load P, in kN.
        shaft_speed: Shaft speed n, in rpm.
        dynamic_load_rating: Catalog dynamic load rating C, in kN.
            Required when mode == "life".
        target_life_hours: Desired L10 life, in operating hours.
            Required when mode == "required_rating".
        num_curve_points: Number of points to generate for the
            load-ratio-vs-life visualization curve.

    Returns:
        Dictionary with the life exponent, the dynamic load rating used
        (given or solved-for), L10 (millions of revolutions), L10 in
        hours, an illustrative years-of-service figure, and a set of
        (load ratio C/P, L10) points tracing the power-law life curve.

    Formulas:
        L10 = (C / P)^k                          [millions of revolutions]
        L10h = L10 * 10^6 / (60 * n)              [hours]
    """

    if bearing_type not in BEARING_LIFE_EXPONENTS:
        raise ValueError(f"Unknown bearing_type: {bearing_type!r} (expected 'ball' or 'roller')")
    if mode not in ("life", "required_rating"):
        raise ValueError(f"Unknown mode: {mode!r} (expected 'life' or 'required_rating')")
    if applied_load <= 0:
        raise ValueError("Applied load must be positive")
    if shaft_speed <= 0:
        raise ValueError("Shaft speed must be positive")

    k = BEARING_LIFE_EXPONENTS[bearing_type]

    required_dynamic_load_rating: Optional[float] = None

    if mode == "required_rating":
        if target_life_hours is None or target_life_hours <= 0:
            raise ValueError("target_life_hours must be positive for mode 'required_rating'")

        # Invert L10h = L10 * 1e6 / (60 n)  ->  L10 (millions of rev) required
        l10_required = target_life_hours * 60.0 * shaft_speed / 1e6
        # Invert L10 = (C / P)^k  ->  C = P * L10^(1/k)
        dynamic_load_rating = applied_load * l10_required ** (1.0 / k)
        required_dynamic_load_rating = float(dynamic_load_rating)
        l10 = l10_required
    else:
        if dynamic_load_rating is None or dynamic_load_rating <= 0:
            raise ValueError("dynamic_load_rating must be positive for mode 'life'")
        l10 = (dynamic_load_rating / applied_load) ** k

    l10_hours = l10 * 1e6 / (60.0 * shaft_speed)
    l10_years_typical_duty = l10_hours / TYPICAL_DUTY_HOURS_PER_YEAR

    load_ratio = dynamic_load_rating / applied_load

    # A fixed log-spaced range of load ratios (C/P) covering the span of
    # realistic bearing operating points, independent of the current
    # inputs, so the curve shape is stable while the marked operating
    # point moves as the user changes C, P, or bearing type.
    ratios = np.logspace(np.log10(0.5), np.log10(20.0), num_curve_points)
    load_curve: List[Dict] = [
        {"load_ratio": float(r), "L10": float(r**k)} for r in ratios
    ]

    return {
        "mode": mode,
        "bearing_type": bearing_type,
        "life_exponent": float(k),
        "dynamic_load_rating": float(dynamic_load_rating),
        "applied_load": float(applied_load),
        "shaft_speed": float(shaft_speed),
        "load_ratio": float(load_ratio),
        "L10": float(l10),
        "L10_hours": float(l10_hours),
        "L10_years_typical_duty": float(l10_years_typical_duty),
        "required_dynamic_load_rating": required_dynamic_load_rating,
        "load_curve": load_curve,
    }
