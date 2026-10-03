"""
Root Locus & Routh-Hurwitz Stability Module
Used by the Control Systems Topic: Root Locus & Stability

Unity-feedback loop with open-loop transfer function

    L(s) = K / ( s (s + a) (s + b) )

so the closed-loop characteristic polynomial is

    s^3 + (a + b) s^2 + a b s + K = 0.
"""

from typing import Dict, List

import numpy as np


def _routh_first_column(a: float, b: float, K: float) -> List[Dict]:
    """Routh array for s^3 + (a+b) s^2 + ab s + K."""
    a2, a1 = a + b, a * b
    s1 = (a2 * a1 - K) / a2
    return [
        {'power': 3, 'row': [1.0, float(a1)]},
        {'power': 2, 'row': [float(a2), float(K)]},
        {'power': 1, 'row': [float(s1), 0.0]},
        {'power': 0, 'row': [float(K), 0.0]},
    ]


def compute_root_locus(
    pole_a: float,
    pole_b: float,
    gain: float,
    num_points: int = 200,
) -> Dict:
    """
    Compute closed-loop poles, Routh stability and the root locus.

    Args:
        pole_a: Open-loop pole location -a (a > 0)
        pole_b: Open-loop pole location -b (b > 0)
        gain: Loop gain K (>= 0)
        num_points: Gains sampled along the locus

    Returns:
        Dictionary with closed-loop poles at K, the Routh array and
        number of first-column sign changes, critical gain
        K_crit = ab(a+b), the imaginary-axis crossing sqrt(ab), the
        breakaway point, asymptote centroid/angles, stability flag, the
        dominant pole damping ratio, and locus branches.
    """

    if pole_a <= 0 or pole_b <= 0:
        raise ValueError("Pole locations a and b must be positive")
    if gain < 0:
        raise ValueError("Gain must be non-negative")
    if num_points < 10:
        raise ValueError("num_points must be at least 10")

    a, b, K = pole_a, pole_b, gain
    s_sum, s_prod = a + b, a * b

    k_crit = float(s_prod * s_sum)
    w_cross = float(np.sqrt(s_prod))

    # Breakaway: dK/ds = 0 for K(s) = -s(s+a)(s+b) -> 3s^2 + 2(a+b)s + ab = 0
    disc = s_sum**2 - 3 * s_prod
    candidates = [(-s_sum + sgn * np.sqrt(disc)) / 3 for sgn in (1, -1)]
    lo, hi = -min(a, b), 0.0
    breakaway = next((float(c) for c in candidates if lo <= c <= hi), None)
    breakaway_gain = (
        float(-breakaway * (breakaway + a) * (breakaway + b)) if breakaway is not None else None
    )

    poles = np.roots([1.0, s_sum, s_prod, K])
    routh = _routh_first_column(a, b, K)
    col = [routh[0]['row'][0], routh[1]['row'][0], routh[2]['row'][0], routh[3]['row'][0]]
    sign_changes = int(sum(1 for i in range(3) if col[i] * col[i + 1] < 0))

    if K == 0:
        status = 'marginal'  # a pole sits at the origin
    elif abs(K - k_crit) < 1e-9 * max(1.0, k_crit):
        status = 'marginal'
    elif K < k_crit:
        status = 'stable'
    else:
        status = 'unstable'

    # Dominant (slowest) closed-loop pole pair -> damping ratio and wn
    dominant = max(poles, key=lambda p: p.real)
    wn_dom = float(abs(dominant))
    zeta_dom = float(-dominant.real / wn_dom) if wn_dom > 1e-12 else None

    # Locus: sweep K from 0 to 3 K_crit (denser at low K)
    ks = np.concatenate([[0.0], np.linspace(0, 3 * k_crit, num_points)[1:]])
    branches = [[], [], []]
    prev = np.sort_complex(np.roots([1.0, s_sum, s_prod, 0.0]))
    for kv in ks:
        roots = np.roots([1.0, s_sum, s_prod, kv])
        # Match each root to the nearest previous root to keep branches continuous
        new = []
        pool = list(roots)
        for p in prev:
            j = int(np.argmin([abs(r - p) for r in pool]))
            new.append(pool.pop(j))
        prev = np.array(new)
        for i in range(3):
            branches[i].append({'re': float(prev[i].real), 'im': float(prev[i].imag)})

    return {
        'pole_a': a,
        'pole_b': b,
        'gain': K,
        'closed_loop_poles': [{'re': float(p.real), 'im': float(p.imag)} for p in poles],
        'routh_array': routh,
        'sign_changes': sign_changes,
        'rhp_poles': int(sum(1 for p in poles if p.real > 1e-9)),
        'critical_gain': k_crit,
        'crossing_frequency': w_cross,
        'breakaway_point': breakaway,
        'breakaway_gain': breakaway_gain,
        'asymptote_centroid': float(-s_sum / 3),
        'asymptote_angles_deg': [60.0, 180.0, 300.0],
        'status': status,
        'dominant_damping_ratio': zeta_dom,
        'dominant_wn': wn_dom,
        'locus_gains': [float(v) for v in ks],
        'locus_branches': branches,
    }
