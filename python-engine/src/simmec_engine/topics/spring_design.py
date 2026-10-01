"""
Helical Compression Spring Design Module
Used by MIT 2.72 Topic: Helical Compression Spring Design

A helical compression spring is a torsion bar wound into a coil: every
cross-section of the wire is twisted (not bent) by the offset axial load,
so the governing stress formula is the round-bar torsion formula corrected
for coil curvature and direct shear (the Wahl factor).
"""

from typing import Dict, Optional

import numpy as np
from dataclasses import dataclass


@dataclass
class SpringMaterial:
    """Representative spring wire material properties"""
    name: str
    shear_modulus: float          # G, MPa
    allowable_shear_stress: float  # MPa, representative design allowable


# Pre-defined spring wire materials (representative values for common
# compression-spring wire; actual allowables depend heavily on wire
# diameter per ASTM A228/A313/A229 strength curves).
MATERIALS = {
    'music_wire': SpringMaterial(
        name='Music Wire (ASTM A228)',
        shear_modulus=79300,
        allowable_shear_stress=660,
    ),
    'stainless_302': SpringMaterial(
        name='Stainless Steel 302',
        shear_modulus=69000,
        allowable_shear_stress=500,
    ),
    'phosphor_bronze': SpringMaterial(
        name='Phosphor Bronze',
        shear_modulus=41000,
        allowable_shear_stress=350,
    ),
}


def compute_spring_design(
    wire_diameter: float,
    coil_diameter: float,
    active_coils: float,
    shear_modulus: float,
    applied_force: float,
    allowable_shear_stress: Optional[float] = None,
) -> Dict:
    """
    Compute spring rate, spring index, Wahl factor, and corrected shear
    stress for a round-wire helical compression spring.

    Args:
        wire_diameter: Wire diameter d in mm
        coil_diameter: Mean coil diameter D in mm
        active_coils: Number of active coils N
        shear_modulus: Shear modulus G of the wire material in MPa
        applied_force: Applied axial force F in N
        allowable_shear_stress: Optional material allowable shear stress
            in MPa, used to report a safety factor against the corrected
            shear stress.

    Returns:
        Dictionary with the spring index, Wahl factor, spring rate,
        deflection, maximum (corrected) shear stress, whether the spring
        index falls in the practical 4-12 range, and (if an allowable
        shear stress was supplied) the resulting safety factor.

    Design note on the spring-index validation: a spring index C = D/d
    outside roughly 4-12 is not a physically invalid input (the formulas
    remain well-defined), it is just a poor design choice — C < 4 is hard
    to coil and stress-concentrates badly, C > 12 tends to buckle/tangle.
    So this function does not raise an error for an out-of-range index;
    it computes normally and reports `is_practical_range` so the caller
    (frontend) can flag it to the student instead of blocking the
    calculation outright. The only hard error is C <= 1 (coil diameter
    not exceeding wire diameter), which is not a physically buildable
    coil and also makes the Wahl factor's denominator vanish or go
    negative.
    """

    if wire_diameter <= 0:
        raise ValueError("Wire diameter must be positive")
    if coil_diameter <= 0:
        raise ValueError("Coil diameter must be positive")
    if active_coils <= 0:
        raise ValueError("Number of active coils must be positive")
    if shear_modulus <= 0:
        raise ValueError("Shear modulus must be positive")
    if applied_force < 0:
        raise ValueError("Applied force must be non-negative")
    if coil_diameter <= wire_diameter:
        raise ValueError(
            "Coil diameter must exceed wire diameter (spring index C = D/d must be > 1)"
        )
    if allowable_shear_stress is not None and allowable_shear_stress <= 0:
        raise ValueError("Allowable shear stress must be positive")

    # Spring index: C = D / d
    spring_index = coil_diameter / wire_diameter

    # Wahl correction factor: corrects the plain torsion-bar shear stress
    # for direct transverse shear and coil curvature.
    wahl_factor = (4 * spring_index - 1) / (4 * spring_index - 4) + 0.615 / spring_index

    # Spring rate: k = G d^4 / (8 D^3 N)
    spring_rate = (
        shear_modulus * wire_diameter**4 / (8 * coil_diameter**3 * active_coils)
    )

    # Deflection under the applied load: delta = F / k
    deflection = applied_force / spring_rate

    # Corrected (Wahl) shear stress: tau = K_w * 8 F D / (pi d^3)
    max_shear_stress = (
        wahl_factor * 8 * applied_force * coil_diameter / (np.pi * wire_diameter**3)
    )

    is_practical_range = 4.0 <= spring_index <= 12.0

    safety_factor = None
    if allowable_shear_stress is not None:
        safety_factor = (
            float(allowable_shear_stress / max_shear_stress)
            if max_shear_stress > 0
            else float('inf')
        )

    return {
        'wire_diameter': wire_diameter,
        'coil_diameter': coil_diameter,
        'active_coils': active_coils,
        'applied_force': applied_force,
        'spring_index': float(spring_index),
        'wahl_factor': float(wahl_factor),
        'spring_rate': float(spring_rate),
        'deflection': float(deflection),
        'max_shear_stress': float(max_shear_stress),
        'is_practical_range': bool(is_practical_range),
        'safety_factor': safety_factor,
        'properties': {
            'shear_modulus': shear_modulus,
            'allowable_shear_stress': allowable_shear_stress,
        },
    }
