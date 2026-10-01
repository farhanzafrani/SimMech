"""
Truss Analysis Module (Method of Joints / Sections)
Used by Statics Topic: Truss Analysis

A statically determinate planar truss satisfies m + r = 2j (members +
reactions = 2 x joints). Writing sum Fx = sum Fy = 0 at every joint gives a
square linear system for all member forces and support reactions at once —
the matrix form of the method of joints.
"""

from typing import Dict

import numpy as np


def build_warren_truss(span: float, height: float, panels: int):
    """
    Warren truss: bottom joints 0..n at x = i L / n, top joints at the
    panel midpoints; chords plus alternating diagonals.
    Returns (nodes[j,2], members[(i,k,kind)], pin_index, roller_index).
    """
    n = panels
    nodes = [(i * span / n, 0.0) for i in range(n + 1)]
    nodes += [((i + 0.5) * span / n, height) for i in range(n)]   # top joint i -> index n+1+i
    members = []
    for i in range(n):
        members.append((i, i + 1, 'bottom chord'))
    for i in range(n - 1):
        members.append((n + 1 + i, n + 2 + i, 'top chord'))
    for i in range(n):
        members.append((i, n + 1 + i, 'diagonal'))
        members.append((n + 1 + i, i + 1, 'diagonal'))
    return np.array(nodes, dtype=float), members, 0, n


def compute_truss(span: float, height: float, panels: int, load: float, load_joint: int) -> Dict:
    """
    Solve a Warren truss with one downward load on a bottom joint.

    Args:
        span: Total span L in m
        height: Truss depth h in m
        panels: Number of panels n (2-10)
        load: Downward load P in kN
        load_joint: Bottom joint index (0..n) carrying P
    Returns:
        Joint coordinates, members with signed axial force (+ tension,
        - compression), reactions, and a midspan-section check.
    """
    if span <= 0 or height <= 0:
        raise ValueError("Span and height must be positive")
    if not (2 <= panels <= 10) or int(panels) != panels:
        raise ValueError("Panels must be an integer between 2 and 10")
    panels = int(panels)
    if load < 0:
        raise ValueError("Load must be non-negative")
    if not (0 <= load_joint <= panels) or int(load_joint) != load_joint:
        raise ValueError("Load joint must be a bottom joint index in 0..panels")

    nodes, members, pin, roller = build_warren_truss(span, height, panels)
    j, m = len(nodes), len(members)
    assert 2 * j == m + 3          # determinate: m + r = 2j with r = 3

    # Unknown vector: [F_member_0 .. F_member_{m-1}, Ax, Ay, By]
    a = np.zeros((2 * j, m + 3))
    for k, (p, q, _) in enumerate(members):
        d = nodes[q] - nodes[p]
        u = d / np.linalg.norm(d)
        # A tension force pulls each end joint toward the member's other end
        a[2 * p, k] += u[0]
        a[2 * p + 1, k] += u[1]
        a[2 * q, k] -= u[0]
        a[2 * q + 1, k] -= u[1]
    a[2 * pin, m] = 1.0            # Ax
    a[2 * pin + 1, m + 1] = 1.0    # Ay
    a[2 * roller + 1, m + 2] = 1.0  # By (roller on horizontal surface)

    b = np.zeros(2 * j)
    b[2 * load_joint + 1] = load   # external load -P in y: move to RHS as +P

    if np.linalg.cond(a) > 1e10:
        raise ValueError("Truss is unstable or indeterminate for these inputs")
    sol = np.linalg.solve(a, b)

    forces = sol[:m]
    out_members = []
    for k, (p, q, kind) in enumerate(members):
        f = float(forces[k])
        state = 'zero' if abs(f) < 1e-9 else ('tension' if f > 0 else 'compression')
        out_members.append({
            'start': int(p), 'end': int(q), 'kind': kind,
            'length': float(np.linalg.norm(nodes[q] - nodes[p])),
            'force': f, 'state': state,
        })

    # Method of sections check: cut the middle panel; the chord force is M / h
    x_cut = span / 2
    ay = float(sol[m + 1])
    x_load = load_joint * span / panels
    moment_at_cut = ay * x_cut - (load * (x_cut - x_load) if x_load < x_cut else 0.0)

    return {
        'nodes': [[float(x), float(y)] for x, y in nodes],
        'members': out_members,
        'reaction_ax': float(sol[m]),
        'reaction_ay': ay,
        'reaction_by': float(sol[m + 2]),
        'max_tension': float(max(0.0, forces.max())),
        'max_compression': float(max(0.0, -forces.min())),
        'midspan_moment': float(moment_at_cut),
        'midspan_chord_estimate': float(moment_at_cut / height),
        'is_determinate': True,
    }
