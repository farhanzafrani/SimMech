"""
Tolerance Stack-Up & ISO Fits Module
Used by MIT 2.008 / 2.75 Topic: Tolerance Stack-Up & Limits and Fits

ISO 286 limits for hole-basis fits (H hole with a shaft letter/grade) and
1-D tolerance stack-ups by worst-case and root-sum-square (RSS) methods.
"""

from math import erf, sqrt
from typing import Dict, List

import numpy as np

# ISO 286 nominal size ranges (mm, over..up to and including), 3-500 mm.
SIZE_RANGES = [
    (3, 6), (6, 10), (10, 18), (18, 30), (30, 50), (50, 80),
    (80, 120), (120, 180), (180, 250), (250, 315), (315, 400), (400, 500),
]

# International tolerance grades IT5..IT9 in micrometres, one value per
# size range above (ISO 286-1 standard table values).
IT_TABLE = {
    5: [5, 6, 8, 9, 11, 13, 15, 18, 20, 23, 25, 27],
    6: [8, 9, 11, 13, 16, 19, 22, 25, 29, 32, 36, 40],
    7: [12, 15, 18, 21, 25, 30, 35, 40, 46, 52, 57, 63],
    8: [18, 22, 27, 33, 39, 46, 54, 63, 72, 81, 89, 97],
    9: [30, 36, 43, 52, 62, 74, 87, 100, 115, 130, 140, 155],
}

# Shaft fundamental deviations (um), one value per size range, ISO 286-1.
# f, g: upper deviation es (negative); k, m, n, p: lower deviation ei
# (positive). (They follow formulas such as g: -2.5 D^0.34, k: 0.6 D^(1/3),
# n: 5 D^0.34 with ISO's own rounding, so the tabulated values are used.)
F_ES = [-10, -13, -16, -20, -25, -30, -36, -43, -50, -56, -62, -68]
G_ES = [-4, -5, -6, -7, -9, -10, -12, -14, -15, -17, -18, -20]
K_EI = [1, 1, 1, 2, 2, 2, 3, 3, 4, 4, 4, 5]
N_EI = [8, 10, 12, 15, 17, 20, 23, 27, 31, 34, 37, 40]
P_EI = [12, 15, 18, 22, 26, 32, 37, 43, 50, 56, 62, 68]
# m: ei = IT7 - IT6 (computed from the IT table)

SHAFT_LETTERS = ['f', 'g', 'h', 'k', 'm', 'n', 'p']


def _range_index(size: float) -> int:
    if size < 3 or size > 500:
        raise ValueError("Nominal size must be between 3 and 500 mm")
    for i, (lo, hi) in enumerate(SIZE_RANGES):
        if lo < size <= hi or (i == 0 and size == 3):
            return i
    raise ValueError("Nominal size out of range")


def _it(grade: int, idx: int) -> int:
    if grade not in IT_TABLE:
        raise ValueError("Tolerance grade must be between 5 and 9")
    return IT_TABLE[grade][idx]


def shaft_deviations(letter: str, grade: int, idx: int) -> Dict:
    """Upper (es) and lower (ei) shaft deviations in micrometres."""
    it = _it(grade, idx)
    if letter == 'f':
        es = F_ES[idx]
        return {'es': es, 'ei': es - it}
    if letter == 'g':
        es = G_ES[idx]
        return {'es': es, 'ei': es - it}
    if letter == 'h':
        return {'es': 0, 'ei': -it}
    if letter == 'k':
        if grade > 7:
            raise ValueError("Shaft k is defined for grades 4-7 only")
        ei = K_EI[idx]
        return {'es': ei + it, 'ei': ei}
    if letter == 'm':
        ei = _it(7, idx) - _it(6, idx)
        return {'es': ei + it, 'ei': ei}
    if letter == 'n':
        ei = N_EI[idx]
        return {'es': ei + it, 'ei': ei}
    if letter == 'p':
        ei = P_EI[idx]
        return {'es': ei + it, 'ei': ei}
    raise ValueError(f"Unsupported shaft letter '{letter}'")


def compute_iso_fit(nominal: float, hole_grade: int, shaft_letter: str, shaft_grade: int) -> Dict:
    """
    Hole-basis ISO 286 fit: hole H<hole_grade> with shaft <letter><grade>.

    Returns hole/shaft limits (mm), min/max clearance (negative = interference),
    and fit type (clearance / transition / interference).
    """
    idx = _range_index(nominal)
    letter = shaft_letter.lower()
    if letter not in SHAFT_LETTERS:
        raise ValueError(f"Shaft letter must be one of {', '.join(SHAFT_LETTERS)}")

    hole_it = _it(hole_grade, idx)
    sh = shaft_deviations(letter, shaft_grade, idx)

    # Hole H: lower deviation EI = 0, upper ES = +IT
    ei_hole, es_hole = 0, hole_it
    hole_min, hole_max = nominal + ei_hole / 1000, nominal + es_hole / 1000
    shaft_min, shaft_max = nominal + sh['ei'] / 1000, nominal + sh['es'] / 1000

    max_clearance = (es_hole - sh['ei']) / 1000      # largest hole - smallest shaft
    min_clearance = (ei_hole - sh['es']) / 1000      # smallest hole - largest shaft

    if min_clearance >= 0:
        fit_type = 'Clearance'
    elif max_clearance <= 0:
        fit_type = 'Interference'
    else:
        fit_type = 'Transition'

    return {
        'nominal': nominal,
        'designation': f"H{hole_grade}/{letter}{shaft_grade}",
        'hole_tolerance_um': hole_it,
        'shaft_tolerance_um': _it(shaft_grade, idx),
        'hole_min': float(hole_min),
        'hole_max': float(hole_max),
        'shaft_min': float(shaft_min),
        'shaft_max': float(shaft_max),
        'shaft_es_um': sh['es'],
        'shaft_ei_um': sh['ei'],
        'min_clearance': float(min_clearance),
        'max_clearance': float(max_clearance),
        'fit_type': fit_type,
    }


def compute_stackup(dimensions: List[Dict], required_min_gap: float = 0.0) -> Dict:
    """
    1-D tolerance stack-up of a gap.

    Each dimension: {'name', 'nominal' (mm, > 0), 'tolerance' (mm, symmetric +/-), 'direction' (+1 or -1)}.
    A +1 dimension increases the gap, -1 decreases it.

    Worst case: sum of |tolerances|. RSS (statistical): sqrt(sum t_i^2).
    Probability of the gap falling below `required_min_gap` assumes each
    tolerance band is +/-3 sigma of a centred normal distribution, so the
    gap has sigma = RSS/3.
    """
    if not dimensions:
        raise ValueError("At least one dimension is required")

    nominal_gap = 0.0
    tols = []
    for d in dimensions:
        if d['nominal'] <= 0:
            raise ValueError(f"Dimension '{d['name']}' must have a positive nominal")
        if d['tolerance'] < 0:
            raise ValueError(f"Dimension '{d['name']}' tolerance must be non-negative")
        if d['direction'] not in (1, -1):
            raise ValueError("Direction must be +1 or -1")
        nominal_gap += d['direction'] * d['nominal']
        tols.append(d['tolerance'])

    tols_arr = np.array(tols, dtype=float)
    worst_case = float(tols_arr.sum())
    rss = float(np.sqrt((tols_arr**2).sum()))

    sigma = rss / 3.0
    if sigma > 0:
        z = (required_min_gap - nominal_gap) / sigma
        p_below = 0.5 * (1 + erf(z / sqrt(2)))
    else:
        p_below = 1.0 if nominal_gap < required_min_gap else 0.0

    contributions = [
        {
            'name': d['name'],
            'tolerance': d['tolerance'],
            'rss_share': float(d['tolerance'] ** 2 / (rss**2)) if rss > 0 else 0.0,
        }
        for d in dimensions
    ]

    return {
        'nominal_gap': float(nominal_gap),
        'worst_case': worst_case,
        'worst_case_min': float(nominal_gap - worst_case),
        'worst_case_max': float(nominal_gap + worst_case),
        'rss': rss,
        'rss_min': float(nominal_gap - rss),
        'rss_max': float(nominal_gap + rss),
        'required_min_gap': required_min_gap,
        'worst_case_ok': bool(nominal_gap - worst_case >= required_min_gap),
        'rss_ok': bool(nominal_gap - rss >= required_min_gap),
        'probability_below_min': float(p_below),
        'contributions': contributions,
    }
