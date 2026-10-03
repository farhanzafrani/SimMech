"""
Material Selection Module (Ashby Performance Indices)
Used by MIT 3.022 / 2.008 Topic: Material Selection by Performance Index

Ashby's method collapses a design requirement (function + objective +
constraint) into a single performance index M that depends only on material
properties. Maximising M minimises the objective (here, mass).
"""

from typing import Dict, List, Optional

# Representative handbook values (room temperature, order-of-magnitude
# typical; real grades and processing vary widely - especially composites,
# woods, and cast irons - so treat these as teaching values).
#   E: Young's modulus (GPa), rho: density (Mg/m^3 = g/cm^3),
#   sigma_y: yield / design strength (MPa)
MATERIALS: Dict[str, Dict] = {
    'steel_1020': {'name': 'Mild steel (AISI 1020)', 'E': 205.0, 'rho': 7.85, 'sigma_y': 350.0},
    'cast_iron': {'name': 'Gray cast iron', 'E': 100.0, 'rho': 7.20, 'sigma_y': 200.0},
    'al_6061': {'name': 'Aluminium 6061-T6', 'E': 69.0, 'rho': 2.70, 'sigma_y': 275.0},
    'mg_az31': {'name': 'Magnesium AZ31', 'E': 45.0, 'rho': 1.77, 'sigma_y': 200.0},
    'ti_6al4v': {'name': 'Titanium Ti-6Al-4V', 'E': 114.0, 'rho': 4.43, 'sigma_y': 880.0},
    'cfrp': {'name': 'CFRP (quasi-isotropic)', 'E': 70.0, 'rho': 1.55, 'sigma_y': 600.0},
    'wood_spruce': {'name': 'Spruce (along grain)', 'E': 10.0, 'rho': 0.45, 'sigma_y': 40.0},
    'nylon_66': {'name': 'Nylon 6,6', 'E': 2.8, 'rho': 1.14, 'sigma_y': 70.0},
}

# Performance indices. 'exp_*' define M = E^a/rho or sigma^a/rho, or sigma^2/E.
# Each is derived by eliminating the free geometry variable via the constraint.
INDICES: Dict[str, Dict] = {
    'stiff_beam': {'label': 'Light, stiff beam (fixed length, free section size)', 'latex': 'M = E^{1/2}/\\rho', 'kind': 'E', 'power': 0.5},
    'stiff_panel': {'label': 'Light, stiff panel (fixed length and width, free thickness)', 'latex': 'M = E^{1/3}/\\rho', 'kind': 'E', 'power': 1.0 / 3.0},
    'stiff_tie': {'label': 'Light, stiff tie (tension member)', 'latex': 'M = E/\\rho', 'kind': 'E', 'power': 1.0},
    'strong_beam': {'label': 'Light, strong beam', 'latex': 'M = \\sigma_y^{2/3}/\\rho', 'kind': 'S', 'power': 2.0 / 3.0},
    'strong_tie': {'label': 'Light, strong tie (tension member)', 'latex': 'M = \\sigma_y/\\rho', 'kind': 'S', 'power': 1.0},
    'spring': {'label': 'Elastic energy storage per volume (spring)', 'latex': 'M = \\sigma_y^2/E', 'kind': 'SPRING', 'power': 2.0},
}


def performance_index(index: str, E: float, rho: float, sigma_y: float) -> float:
    """Evaluate the Ashby index M (E in GPa, rho in Mg/m^3, sigma_y in MPa)."""
    spec = INDICES[index]
    if spec['kind'] == 'E':
        return E ** spec['power'] / rho
    if spec['kind'] == 'S':
        return sigma_y ** spec['power'] / rho
    return sigma_y ** 2 / E  # spring: sigma^2 / E


def compute_material_selection(
    index: str,
    reference: str = 'steel_1020',
    min_yield: Optional[float] = None,
    max_density: Optional[float] = None,
) -> Dict:
    """
    Rank the built-in materials by an Ashby performance index.

    Args:
        index: One of INDICES (e.g. 'stiff_beam')
        reference: Material id used as the mass/benefit baseline
        min_yield: Optional screening limit - minimum yield strength (MPa)
        max_density: Optional screening limit - maximum density (Mg/m^3)

    Returns:
        Ranked list of materials (best first) with index value, value
        relative to the reference, the implied mass relative to the
        reference (for the three light-weight stiffness/strength objectives),
        and whether each passes the screening limits.

    Mass ratio: for the beam/panel/tie indices the mass of a part sized to
    meet the constraint scales as 1/M, so m/m_ref = M_ref / M.
    """

    if index not in INDICES:
        raise ValueError(f"Unknown performance index '{index}'")
    if reference not in MATERIALS:
        raise ValueError(f"Unknown reference material '{reference}'")
    if min_yield is not None and min_yield < 0:
        raise ValueError("Minimum yield strength must be non-negative")
    if max_density is not None and max_density <= 0:
        raise ValueError("Maximum density must be positive")

    ref = MATERIALS[reference]
    m_ref = performance_index(index, ref['E'], ref['rho'], ref['sigma_y'])

    rows: List[Dict] = []
    for mid, mat in MATERIALS.items():
        m = performance_index(index, mat['E'], mat['rho'], mat['sigma_y'])
        passes = True
        if min_yield is not None and mat['sigma_y'] < min_yield:
            passes = False
        if max_density is not None and mat['rho'] > max_density:
            passes = False
        rows.append({
            'id': mid,
            'name': mat['name'],
            'E': mat['E'],
            'rho': mat['rho'],
            'sigma_y': mat['sigma_y'],
            'index_value': float(m),
            'relative_index': float(m / m_ref),
            # For the spring index mass is not the objective; ratio is energy/volume
            'mass_ratio': float(m_ref / m) if index != 'spring' else None,
            'passes_screening': passes,
        })

    rows.sort(key=lambda r: (not r['passes_screening'], -r['index_value']))
    best = next((r for r in rows if r['passes_screening']), None)

    return {
        'index': index,
        'index_label': INDICES[index]['label'],
        'index_latex': INDICES[index]['latex'],
        'reference': reference,
        'reference_index': float(m_ref),
        'materials': rows,
        'best_id': best['id'] if best else None,
    }
