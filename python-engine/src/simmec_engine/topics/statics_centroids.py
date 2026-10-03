"""
Centroids and Area Moments of Inertia Module (composite shapes)
Used by Statics Topic: Centroids & Area Moments of Inertia

A composite area is a sum of simple parts. Centroid: weighted average of
part centroids. Moment of inertia about the composite centroid: each part's
own I plus A d^2 (parallel-axis theorem). Holes enter with negative area.
"""

from typing import Dict, List

import numpy as np


def compute_composite_section(parts: List[Dict]) -> Dict:
    """
    Args:
        parts: list of dicts, y measured upward from a common base line:
            rect:   {'shape': 'rect', 'cx', 'cy', 'w', 'h', 'sign': +1/-1}
            circle: {'shape': 'circle', 'cx', 'cy', 'd', 'sign': +1/-1}
        Lengths in mm.
    Returns:
        Area, centroid (x, y), centroidal Ix and Iy (mm^4), radii of gyration,
        section moduli and the per-part contribution table.
    """
    if not parts:
        raise ValueError("At least one part is required")

    rows = []
    for p in parts:
        sign = 1.0 if p.get('sign', 1) >= 0 else -1.0
        if p['shape'] == 'rect':
            if p['w'] <= 0 or p['h'] <= 0:
                raise ValueError("Rectangle dimensions must be positive")
            area = p['w'] * p['h']
            ix0 = p['w'] * p['h'] ** 3 / 12
            iy0 = p['h'] * p['w'] ** 3 / 12
        elif p['shape'] == 'circle':
            if p['d'] <= 0:
                raise ValueError("Circle diameter must be positive")
            area = np.pi * p['d'] ** 2 / 4
            ix0 = iy0 = np.pi * p['d'] ** 4 / 64
        else:
            raise ValueError(f"Unknown shape: {p['shape']}")
        rows.append((sign, area, p['cx'], p['cy'], ix0, iy0, p))

    total_area = sum(s * a for s, a, *_ in rows)
    if total_area <= 0:
        raise ValueError("Net area must be positive (holes larger than material)")

    xbar = sum(s * a * cx for s, a, cx, *_ in rows) / total_area
    ybar = sum(s * a * cy for s, a, _, cy, *_ in rows) / total_area

    ix = iy = 0.0
    table = []
    for s, a, cx, cy, ix0, iy0, p in rows:
        dy, dx = cy - ybar, cx - xbar
        ix += s * (ix0 + a * dy**2)
        iy += s * (iy0 + a * dx**2)
        table.append({
            'shape': p['shape'], 'sign': int(s), 'area': float(a),
            'cx': float(cx), 'cy': float(cy), 'dy': float(dy),
            'own_ix': float(ix0), 'transfer_ix': float(a * dy**2),
        })

    # Extreme fibres for section modulus: y-extent of positive parts
    y_top = max(r[3] + (r[6]['h'] / 2 if r[6]['shape'] == 'rect' else r[6]['d'] / 2) for r in rows if r[0] > 0)
    y_bot = min(r[3] - (r[6]['h'] / 2 if r[6]['shape'] == 'rect' else r[6]['d'] / 2) for r in rows if r[0] > 0)
    c_top, c_bot = y_top - ybar, ybar - y_bot

    return {
        'area': float(total_area),
        'x_bar': float(xbar),
        'y_bar': float(ybar),
        'ix': float(ix),
        'iy': float(iy),
        'rx': float(np.sqrt(ix / total_area)),
        'ry': float(np.sqrt(iy / total_area)),
        'y_top': float(y_top),
        'y_bottom': float(y_bot),
        'section_modulus_top': float(ix / c_top) if c_top > 0 else float('inf'),
        'section_modulus_bottom': float(ix / c_bot) if c_bot > 0 else float('inf'),
        'parts': table,
    }
