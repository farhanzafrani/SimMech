"""
Beam Deflection Module - Simply Supported Beam with a Point Load
Used by topic: Beam Deflection (course: Mechanics of Materials)

Unit convention (matches sibling topics stress_strain/torsion in this
package): Young's modulus and stress in MPa, section height in mm, length
and position in meters. Internally converted to SI (Pa, m) for the physics,
then converted back to engineering units for the response.
"""

from typing import Dict
import numpy as np

# Materials specific to this topic (kept local rather than editing the
# shared MATERIALS dict in mechanics.py, per fork file-ownership rules).
BEAM_MATERIALS = {
    'steel': {'name': 'Steel', 'youngs_modulus': 200000.0, 'yield_stress': 250.0},
    'aluminum': {'name': 'Aluminum', 'youngs_modulus': 69000.0, 'yield_stress': 240.0},
    'timber': {'name': 'Timber', 'youngs_modulus': 11000.0, 'yield_stress': 24.0},
}


def compute_beam_deflection(
    length: float,
    load_kn: float,
    position_pct: float,
    height_mm: float,
    youngs_modulus: float,
    yield_stress: float,
    width_mm: float = 100.0,
    num_points: int = 50,
) -> Dict:
    """
    Compute reactions, bending stress, and the deflected shape of a simply
    supported beam under a single point load.

    Args:
        length: Span L in meters
        load_kn: Point load P in kN
        position_pct: Load position as a percentage of the span (0-100),
            measured from support A
        height_mm: Section depth h in mm (rectangular section)
        youngs_modulus: Young's modulus E in MPa
        yield_stress: Tensile yield stress in MPa
        width_mm: Section width in mm (fixed at 100mm by default, matching
            the reference playground design)
        num_points: Number of points along the deflection curve

    Returns:
        Dictionary with reactions, max moment, section properties, max
        bending stress, deflection under the load, the true maximum
        deflection (and where it occurs), the L/360 code limit, safety
        factor, pass/fail flags, and a deflection_curve point list.
    """

    if length <= 0:
        raise ValueError("Length must be positive")
    if not (0 < position_pct < 100):
        raise ValueError("Load position must be strictly between 0 and 100 percent")
    if height_mm <= 0 or width_mm <= 0:
        raise ValueError("Section dimensions must be positive")
    if youngs_modulus <= 0:
        raise ValueError("Young's modulus must be positive")

    L = length
    a = L * position_pct / 100.0
    b = L - a

    P_kn = load_kn
    P_n = P_kn * 1000.0  # kN -> N

    w_m = width_mm / 1000.0
    h_m = height_mm / 1000.0
    I_m4 = w_m * h_m**3 / 12.0

    E_pa = youngs_modulus * 1e6  # MPa -> Pa

    reaction_a_kn = P_kn * b / L
    reaction_b_kn = P_kn * a / L

    max_moment_knm = P_kn * a * b / L  # occurs at the load, x = a

    # Bending stress at the outer fiber (c = h/2) under the max moment.
    max_moment_nm = max_moment_knm * 1000.0
    sigma_max_pa = max_moment_nm * (h_m / 2) / I_m4
    max_bending_stress_mpa = sigma_max_pa / 1e6

    deflection_under_load_m = P_n * a**2 * b**2 / (3 * E_pa * I_m4 * L)

    def deflection_at(x: float) -> float:
        if x <= a:
            return P_n * b * x * (L * L - b * b - x * x) / (6 * E_pa * I_m4 * L)
        return P_n * a * (L - x) * (L * L - a * a - (L - x) * (L - x)) / (6 * E_pa * I_m4 * L)

    xs = np.linspace(0, L, num_points)
    ys_m = np.array([deflection_at(float(x)) for x in xs])

    max_idx = int(np.argmax(ys_m))
    max_deflection_m = float(ys_m[max_idx])
    max_deflection_location_m = float(xs[max_idx])

    deflection_limit_m = L / 360.0

    safety_factor = (
        yield_stress / max_bending_stress_mpa if max_bending_stress_mpa > 0 else float('inf')
    )
    strength_ok = safety_factor >= 1.5
    stiffness_ok = max_deflection_m <= deflection_limit_m

    return {
        'length': length,
        'load_kn': load_kn,
        'position_pct': position_pct,
        'height_mm': height_mm,
        'width_mm': width_mm,
        'reaction_a_kn': float(reaction_a_kn),
        'reaction_b_kn': float(reaction_b_kn),
        'max_moment_knm': float(max_moment_knm),
        'moment_of_inertia': float(I_m4),
        'max_bending_stress': float(max_bending_stress_mpa),
        'deflection_under_load_mm': float(deflection_under_load_m * 1000),
        'max_deflection_mm': float(max_deflection_m * 1000),
        'max_deflection_location_m': max_deflection_location_m,
        'deflection_limit_mm': float(deflection_limit_m * 1000),
        'safety_factor': float(safety_factor),
        'strength_ok': bool(strength_ok),
        'stiffness_ok': bool(stiffness_ok),
        'deflection_curve': [
            {'x': float(x), 'y_mm': float(y * 1000)}
            for x, y in zip(xs, ys_m)
        ],
        'properties': {
            'youngs_modulus': youngs_modulus,
            'yield_stress': yield_stress,
        },
    }
