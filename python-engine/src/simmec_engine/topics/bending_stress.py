"""Bending Stress in Beams - flexure formula for a solid rectangular section"""

from typing import Dict

import numpy as np


def compute_bending_stress(
    moment: float,
    width: float,
    height: float,
    num_points: int = 20,
) -> Dict:
    """
    Compute bending stress distribution for a solid rectangular beam
    cross-section under an applied bending moment.

    Args:
        moment: Applied bending moment M in N·m
        width: Section width b in mm
        height: Section height h in mm
        num_points: Number of points sampling the through-thickness stress

    Returns:
        Dictionary with second moment of area I (mm^4), distance to outer
        fiber c (mm), maximum bending stress (MPa), and the linear
        through-thickness stress distribution sigma(y) = M*y / I.
    """

    if width <= 0:
        raise ValueError("Width must be positive")
    if height <= 0:
        raise ValueError("Height must be positive")

    moment_n_mm = moment * 1000.0  # N·m -> N·mm

    # Second moment of area for a solid rectangle: I = b h^3 / 12 (mm^4)
    second_moment = width * height**3 / 12.0

    c = height / 2.0  # distance from neutral axis to outer fiber (mm)

    # sigma(y) = M y / I ; y in mm from the neutral axis, sigma in MPa (N/mm^2)
    max_bending_stress = moment_n_mm * c / second_moment

    ys = np.linspace(-c, c, num_points)
    stresses = moment_n_mm * ys / second_moment

    return {
        'moment': moment,
        'width': width,
        'height': height,
        'second_moment': float(second_moment),
        'c': float(c),
        'max_bending_stress': float(max_bending_stress),
        'distribution': [
            {'y_mm': float(y), 'stress': float(s)} for y, s in zip(ys, stresses)
        ],
    }
