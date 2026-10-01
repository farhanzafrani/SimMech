"""Axial Loading: elongation under force, thermal expansion, and thermal stress
when a bar is fully constrained from expanding.
"""

from typing import Dict


def compute_axial_loading(
    force: float,
    length: float,
    area: float,
    youngs_modulus: float,
    alpha: float,
    delta_t: float,
    yield_stress: float,
    constrained: bool = False,
) -> Dict:
    """
    Compute elongation / stress for a bar under axial force and a temperature
    change, either free to expand or fully constrained at both ends.

    Args:
        force: Applied axial force F in N
        length: Bar length L in m
        area: Cross-sectional area A in mm² (so F/A lands directly in MPa)
        youngs_modulus: Young's modulus E in MPa
        alpha: Coefficient of thermal expansion α in 1/°C
        delta_t: Temperature change ΔT in °C
        yield_stress: Tensile yield stress σ_y in MPa, for the safety check
        constrained: If True, both ends are fixed — no net elongation is
            possible, so any thermal expansion is fully resisted and becomes
            stress instead of strain.

    Returns:
        Dictionary with mechanical stress, thermal stress (if constrained),
        total stress, elongation, and safety factor.
    """
    if length <= 0:
        raise ValueError("Length must be positive")
    if area <= 0:
        raise ValueError("Area must be positive")
    if youngs_modulus <= 0:
        raise ValueError("Young's modulus must be positive")

    # F(N) / A(mm^2) = MPa directly.
    mechanical_stress = force / area  # MPa
    mechanical_strain = mechanical_stress / youngs_modulus

    if constrained:
        # Elongation is blocked entirely: the thermal strain that would have
        # occurred is fully resisted, becoming stress instead (σ_T = E α ΔT).
        thermal_stress = youngs_modulus * alpha * delta_t  # MPa
        thermal_elongation = 0.0
        mechanical_elongation = 0.0
        total_elongation = 0.0
    else:
        thermal_stress = 0.0
        thermal_elongation = alpha * delta_t * length  # m
        mechanical_elongation = mechanical_strain * length  # m
        total_elongation = mechanical_elongation + thermal_elongation

    total_stress = mechanical_stress + thermal_stress
    safety_factor = yield_stress / total_stress if total_stress > 0 else float('inf')

    return {
        'force': force,
        'length': length,
        'area': area,
        'constrained': constrained,
        'mechanical_stress': float(mechanical_stress),
        'thermal_stress': float(thermal_stress),
        'total_stress': float(total_stress),
        'mechanical_elongation': float(mechanical_elongation),
        'thermal_elongation': float(thermal_elongation),
        'total_elongation': float(total_elongation),
        'safety_factor': float(safety_factor) if safety_factor != float('inf') else 1e9,
        'properties': {
            'youngs_modulus': youngs_modulus,
            'alpha': alpha,
            'yield_stress': yield_stress,
        },
    }


def compute_two_rod_axial_loading(
    force: float,
    length: float,
    area_1: float,
    area_2: float,
    youngs_modulus_1: float,
    youngs_modulus_2: float,
    yield_stress_1: float,
    yield_stress_2: float,
) -> Dict:
    """
    Statically indeterminate axial loading: two rods of (possibly)
    different stiffness, both spanning the same length, connected in
    parallel between two rigid plates and together carrying a combined
    external axial force F.

    Statics alone gives one equation (F1 + F2 = F) for two unknown rod
    forces, so the system is indeterminate. The extra equation comes from
    compatibility: since both rods are tied to the same rigid plates, they
    must stretch by the same amount, δ1 = δ2:

        F1 L / (A1 E1) = F2 L / (A2 E2)

    Solving the two equations together shows the stiffer rod (larger AE)
    carries proportionally more of the load:

        F1 = F (A1 E1) / (A1 E1 + A2 E2)
        F2 = F (A2 E2) / (A1 E1 + A2 E2)

    Args:
        force: Combined external axial force F in N, shared by both rods
        length: Common length L of both rods in m
        area_1: Cross-sectional area of rod 1 A1 in mm²
        area_2: Cross-sectional area of rod 2 A2 in mm²
        youngs_modulus_1: Young's modulus of rod 1 E1 in MPa
        youngs_modulus_2: Young's modulus of rod 2 E2 in MPa
        yield_stress_1: Tensile yield stress of rod 1 in MPa, for the safety check
        yield_stress_2: Tensile yield stress of rod 2 in MPa, for the safety check

    Returns:
        Dictionary with each rod's share of the force, its stress, the
        common elongation, and a safety factor per rod.
    """
    if length <= 0:
        raise ValueError("Length must be positive")
    if area_1 <= 0:
        raise ValueError("Area of rod 1 must be positive")
    if area_2 <= 0:
        raise ValueError("Area of rod 2 must be positive")
    if youngs_modulus_1 <= 0:
        raise ValueError("Young's modulus of rod 1 must be positive")
    if youngs_modulus_2 <= 0:
        raise ValueError("Young's modulus of rod 2 must be positive")

    # Axial stiffness proxy A*E (N) for each rod; the load splits in this ratio.
    stiffness_1 = area_1 * youngs_modulus_1
    stiffness_2 = area_2 * youngs_modulus_2
    total_stiffness = stiffness_1 + stiffness_2

    force_1 = force * stiffness_1 / total_stiffness
    force_2 = force * stiffness_2 / total_stiffness

    stress_1 = force_1 / area_1  # MPa
    stress_2 = force_2 / area_2  # MPa

    # Common strain shared by both rods (compatibility): ε = F / (A1E1 + A2E2)
    strain = force / total_stiffness
    elongation = strain * length  # m

    safety_factor_1 = yield_stress_1 / stress_1 if stress_1 > 0 else float('inf')
    safety_factor_2 = yield_stress_2 / stress_2 if stress_2 > 0 else float('inf')

    return {
        'force': force,
        'length': length,
        'area_1': area_1,
        'area_2': area_2,
        'force_1': float(force_1),
        'force_2': float(force_2),
        'stress_1': float(stress_1),
        'stress_2': float(stress_2),
        'elongation': float(elongation),
        'safety_factor_1': float(safety_factor_1) if safety_factor_1 != float('inf') else 1e9,
        'safety_factor_2': float(safety_factor_2) if safety_factor_2 != float('inf') else 1e9,
        'properties': {
            'youngs_modulus_1': youngs_modulus_1,
            'youngs_modulus_2': youngs_modulus_2,
            'yield_stress_1': yield_stress_1,
            'yield_stress_2': yield_stress_2,
        },
    }
