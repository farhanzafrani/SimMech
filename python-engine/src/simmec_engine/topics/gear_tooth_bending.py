"""
Spur Gear Tooth Bending Stress Module (Lewis Equation)
Used by MIT 2.72 Topic: Spur Gear Tooth Bending Stress

A gear tooth is a short cantilever loaded near its tip by the mating tooth.
The Lewis equation packages the cantilever flexure formula into gear
notation: sigma = Wt * Pd / (F * Y), with Y the Lewis form factor.
"""

from typing import Dict, Optional

import numpy as np

# Lewis form factor Y for 20-degree full-depth involute teeth, as tabulated
# in standard machine-design references (e.g. Shigley's Table 14-2).
# Y rises with tooth count because a gear with more teeth has a wider,
# stubbier-looking root relative to its height at the same diametral pitch.
_LEWIS_TABLE_N = np.array([12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 24, 26, 28,
                           30, 34, 38, 43, 50, 60, 75, 100, 150, 300, 400], dtype=float)
_LEWIS_TABLE_Y = np.array([0.245, 0.261, 0.277, 0.290, 0.296, 0.303, 0.309, 0.314,
                           0.322, 0.328, 0.331, 0.337, 0.346, 0.353, 0.359, 0.371,
                           0.384, 0.397, 0.409, 0.422, 0.435, 0.447, 0.460, 0.472,
                           0.480])
_RACK_Y = 0.485  # infinite-tooth-count rack


def lewis_form_factor(teeth: float) -> float:
    """Lewis form factor Y for a 20-degree full-depth tooth, linearly interpolated."""
    if teeth < 12:
        raise ValueError("Tooth count must be at least 12 (undercutting below that for 20 deg teeth)")
    if teeth >= _LEWIS_TABLE_N[-1]:
        # Blend 400 teeth -> rack linearly in 1/N (Y -> 0.485 as N -> infinity)
        frac = (1.0 / teeth) / (1.0 / _LEWIS_TABLE_N[-1])
        return float(_RACK_Y + (_LEWIS_TABLE_Y[-1] - _RACK_Y) * frac)
    return float(np.interp(teeth, _LEWIS_TABLE_N, _LEWIS_TABLE_Y))


def compute_gear_tooth_bending(
    teeth: float,
    diametral_pitch: float,
    face_width: float,
    torque: float,
    speed_rpm: float = 0.0,
    allowable_stress: Optional[float] = None,
) -> Dict:
    """
    Lewis bending stress at the root of a spur gear tooth.

    Args:
        teeth: Number of teeth N (>= 12)
        diametral_pitch: Diametral pitch Pd in teeth/in
        face_width: Face width F in in
        torque: Transmitted torque T in lbf*in
        speed_rpm: Optional gear speed in rpm; if > 0 the pitch-line
            velocity and a velocity factor Kv = (1200 + V)/1200 (hobbed or
            shaped teeth) are applied for a dynamic estimate
        allowable_stress: Optional allowable bending stress in psi

    Returns:
        Pitch diameter, tangential load, Lewis form factor, static Lewis
        stress, velocity factor, dynamic-corrected stress, and safety factor.
    """
    if teeth < 12:
        raise ValueError("Tooth count must be at least 12")
    if diametral_pitch <= 0:
        raise ValueError("Diametral pitch must be positive")
    if face_width <= 0:
        raise ValueError("Face width must be positive")
    if torque < 0:
        raise ValueError("Torque must be non-negative")
    if speed_rpm < 0:
        raise ValueError("Speed must be non-negative")
    if allowable_stress is not None and allowable_stress <= 0:
        raise ValueError("Allowable stress must be positive")

    pitch_diameter = teeth / diametral_pitch                       # d = N / Pd  [in]
    tangential_load = 2 * torque / pitch_diameter                  # Wt = 2T / d [lbf]
    y = lewis_form_factor(teeth)
    stress = tangential_load * diametral_pitch / (face_width * y)  # psi

    pitch_line_velocity = np.pi * pitch_diameter * speed_rpm / 12  # ft/min
    kv = (1200 + pitch_line_velocity) / 1200
    dynamic_stress = kv * stress

    safety_factor = None
    if allowable_stress is not None:
        safety_factor = (
            float(allowable_stress / dynamic_stress) if dynamic_stress > 0 else float('inf')
        )

    return {
        'teeth': teeth,
        'diametral_pitch': diametral_pitch,
        'face_width': face_width,
        'torque': torque,
        'pitch_diameter': float(pitch_diameter),
        'tangential_load': float(tangential_load),
        'lewis_factor': y,
        'lewis_stress': float(stress),
        'pitch_line_velocity': float(pitch_line_velocity),
        'velocity_factor': float(kv),
        'dynamic_stress': float(dynamic_stress),
        'safety_factor': safety_factor,
    }
