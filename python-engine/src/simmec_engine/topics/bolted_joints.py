"""Bolted Joint Design & Preload.

A preloaded bolt and the plates it clamps behave like two springs sharing
an externally applied tensile load: tightening the bolt has already
stretched it and compressed the plates, so any *additional* external load
P mostly acts to relieve the plates' compression rather than stretch the
bolt further. The joint stiffness constant C sets exactly how that new
load splits between the two.
"""

from typing import Dict

import numpy as np


def compute_bolted_joint(
    bolt_stiffness: float,
    member_stiffness: float,
    proof_load: float,
    external_load: float,
    num_points: int = 50,
) -> Dict:
    """
    Compute the joint stiffness constant, preload, and resultant bolt /
    member loads for a preloaded bolted joint carrying an external
    tensile load.

    Args:
        bolt_stiffness: Bolt stiffness k_b in N/mm
        member_stiffness: Clamped-member (plate) stiffness k_m in N/mm
        proof_load: Bolt proof load F_p in N (proof strength x tensile
            stress area)
        external_load: External tensile load P applied to the joint, in N
        num_points: Number of points to sample along the F_b(P) / F_m(P)
            plot

    Returns:
        Dictionary with the joint constant C, recommended preload F_i,
        resultant bolt load F_b, resultant member (clamp) load F_m,
        whether the joint has separated, safety factors against bolt
        yielding and joint separation, and a set of points tracing F_b
        and F_m as P is swept from 0 up to a reasonable maximum, for the
        classic bolted-joint load-vs-external-load diagram.

    Formulas (per Shigley's "Elements of Mechanical Design"):
        C   = k_b / (k_b + k_m)
        F_i = 0.75 F_p                    (recommended preload, reused fastener)
        F_b = F_i + C P
        F_m = F_i - (1 - C) P
        The joint separates once F_m <= 0, i.e. at P_sep = F_i / (1 - C).
    """

    if bolt_stiffness <= 0:
        raise ValueError("Bolt stiffness must be positive")
    if member_stiffness <= 0:
        raise ValueError("Member stiffness must be positive")
    if proof_load <= 0:
        raise ValueError("Proof load must be positive")
    if external_load < 0:
        raise ValueError("External load cannot be negative")

    # Joint stiffness constant: the fraction of any new external load that
    # actually reaches the bolt. Since k_m >> k_b for standard steel
    # joints, C typically works out to 0.2-0.3.
    joint_constant = bolt_stiffness / (bolt_stiffness + member_stiffness)

    # Recommended preload for a reused (non-permanent) fastener.
    preload = 0.75 * proof_load

    bolt_load = preload + joint_constant * external_load
    member_load = preload - (1 - joint_constant) * external_load

    is_separated = member_load <= 0

    safety_factor_yield = (
        proof_load / bolt_load if bolt_load > 0 else 1e9
    )

    # P at which the member load reaches zero and the plates lose contact.
    separation_load = (
        preload / (1 - joint_constant) if joint_constant < 1 else float("inf")
    )
    if not np.isfinite(separation_load):
        separation_load = 1e9

    safety_factor_separation = (
        separation_load / external_load if external_load > 0 else 1e9
    )

    # Sweep P from 0 out to a bit past whichever is more informative: the
    # separation point, or 1.5x the current operating load.
    plot_max = max(separation_load * 1.2, external_load * 1.5, preload)
    p_values = np.linspace(0, plot_max, num_points)
    points = [
        {
            "p": float(p),
            "bolt_load": float(preload + joint_constant * p),
            "member_load": float(preload - (1 - joint_constant) * p),
        }
        for p in p_values
    ]

    return {
        "bolt_stiffness": bolt_stiffness,
        "member_stiffness": member_stiffness,
        "proof_load": proof_load,
        "external_load": external_load,
        "joint_constant": float(joint_constant),
        "preload": float(preload),
        "bolt_load": float(bolt_load),
        "member_load": float(member_load),
        "is_separated": bool(is_separated),
        "safety_factor_yield": float(safety_factor_yield),
        "separation_load": float(separation_load),
        "safety_factor_separation": float(safety_factor_separation),
        "points": points,
    }


# Example usage and sanity check
if __name__ == "__main__":
    # Soft bolt / stiff plates: k_b = 500 N/mm, k_m = 2000 N/mm -> C should be 0.2,
    # matching the curriculum's "C is typically 0.2-0.3" note.
    result = compute_bolted_joint(
        bolt_stiffness=500,
        member_stiffness=2000,
        proof_load=20000,
        external_load=5000,
    )
    print(f"C = {result['joint_constant']:.4f} (expected 0.2000)")
    print(f"F_i = {result['preload']:.1f} N")
    print(f"F_b = {result['bolt_load']:.1f} N")
    print(f"F_m = {result['member_load']:.1f} N")
    print(f"Separation load = {result['separation_load']:.1f} N")
