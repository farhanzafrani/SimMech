"""
Mechanics Module - Stress-Strain and Material Behavior Calculations
Used by MVP Topic #1: Stress-Strain Analysis
"""

import numpy as np
from typing import Dict, List, Tuple
from dataclasses import dataclass


@dataclass
class MaterialProperties:
    """Material properties definition"""
    name: str
    youngs_modulus: float  # MPa
    yield_stress: float    # MPa
    poisson_ratio: float
    density: float         # kg/m³
    ultimate_stress: float # MPa


# Pre-defined materials
MATERIALS = {
    'steel': MaterialProperties(
        name='Steel',
        youngs_modulus=210000,
        yield_stress=250,
        poisson_ratio=0.3,
        density=7850,
        ultimate_stress=400,
    ),
    'aluminum': MaterialProperties(
        name='Aluminum',
        youngs_modulus=70000,
        yield_stress=270,
        poisson_ratio=0.33,
        density=2700,
        ultimate_stress=310,
    ),
    'copper': MaterialProperties(
        name='Copper',
        youngs_modulus=130000,
        yield_stress=200,
        poisson_ratio=0.34,
        density=8960,
        ultimate_stress=220,
    ),
}


def compute_stress_strain(
    applied_stress: float,
    youngs_modulus: float,
    poisson_ratio: float,
    yield_stress: float,
) -> Dict:
    """
    Compute stress-strain relationship and material deformation

    Args:
        applied_stress: Applied stress in MPa
        youngs_modulus: Young's modulus E in MPa
        poisson_ratio: Poisson's ratio ν (0 to 0.5)
        yield_stress: Yield stress σ_y in MPa

    Returns:
        Dictionary with stress-strain data and deformation info
    """

    # Compute axial strain using Hooke's Law (σ = Eε)
    if youngs_modulus <= 0:
        raise ValueError("Young's modulus must be positive")

    axial_strain = applied_stress / youngs_modulus

    # Compute lateral strain using Poisson's ratio (ν = -ε_lateral/ε_axial)
    lateral_strain = -poisson_ratio * axial_strain

    # Volumetric strain: ΔV/V = ε_axial + 2*ε_lateral
    volumetric_strain = axial_strain + 2 * lateral_strain

    # Determine deformation region
    if applied_stress <= 0:
        region = 'none'
    elif applied_stress <= yield_stress * 0.9:
        region = 'elastic'
    elif applied_stress <= yield_stress * 1.5:
        region = 'plastic'
    else:
        region = 'fracture'

    return {
        'applied_stress': applied_stress,
        'axial_strain': axial_strain,
        'lateral_strain': lateral_strain,
        'volumetric_strain': volumetric_strain,
        'region': region,
        'properties': {
            'youngs_modulus': youngs_modulus,
            'poisson_ratio': poisson_ratio,
            'yield_stress': yield_stress,
        }
    }


def generate_stress_strain_curve(
    youngs_modulus: float,
    yield_stress: float,
    ultimate_stress: float,
    max_strain: float = 0.05,
    num_points: int = 100,
) -> Tuple[List[float], List[float]]:
    """
    Generate complete stress-strain curve (elastic + plastic regions)

    Args:
        youngs_modulus: Young's modulus E
        yield_stress: Yield point stress
        ultimate_stress: Ultimate tensile strength
        max_strain: Maximum strain to plot
        num_points: Number of points along curve

    Returns:
        Tuple of (strain_values, stress_values)
    """

    strains = np.linspace(0, max_strain, num_points)
    stresses = []

    # Yield strain
    yield_strain = yield_stress / youngs_modulus

    for strain in strains:
        if strain <= yield_strain:
            # Linear elastic region: σ = Eε
            stress = youngs_modulus * strain
        else:
            # Plastic region (simplified bilinear)
            # After yield: gradual hardening
            plastic_strain = strain - yield_strain
            # Hardening modulus (simplified: 5% of Young's modulus)
            hardening_modulus = youngs_modulus * 0.05
            stress = yield_stress + hardening_modulus * plastic_strain
            # Cap at ultimate stress
            stress = min(stress, ultimate_stress)

        stresses.append(stress)

    return strains.tolist(), stresses


def compute_material_deformation_3d(
    applied_stress: float,
    youngs_modulus: float,
    poisson_ratio: float,
    original_length: float = 1.0,
    original_width: float = 1.0,
    original_height: float = 1.0,
) -> Dict:
    """
    Compute 3D deformation of a material cube under uniaxial stress

    Args:
        applied_stress: Applied stress in MPa
        youngs_modulus: Young's modulus
        poisson_ratio: Poisson's ratio
        original_length: Original length (axial direction)
        original_width: Original width (lateral)
        original_height: Original height (lateral)

    Returns:
        Dictionary with deformed dimensions and cube vertices
    """

    # Compute strains
    axial_strain = applied_stress / youngs_modulus
    lateral_strain = -poisson_ratio * axial_strain

    # New dimensions
    new_length = original_length * (1 + axial_strain)
    new_width = original_width * (1 + lateral_strain)
    new_height = original_height * (1 + lateral_strain)

    # Original cube vertices (centered at origin)
    # 8 vertices of cube from (-1,-1,-1) to (1,1,1)
    original_vertices = np.array([
        [-1, -1, -1],
        [1, -1, -1],
        [1, 1, -1],
        [-1, 1, -1],
        [-1, -1, 1],
        [1, -1, 1],
        [1, 1, 1],
        [-1, 1, 1],
    ], dtype=float)

    # Scale vertices
    scale_factors = np.array([
        new_width / original_width,
        new_height / original_height,
        new_length / original_length,
    ])

    deformed_vertices = original_vertices * scale_factors

    return {
        'original': {
            'length': original_length,
            'width': original_width,
            'height': original_height,
        },
        'deformed': {
            'length': new_length,
            'width': new_width,
            'height': new_height,
            'volume': new_length * new_width * new_height,
        },
        'vertices': deformed_vertices.tolist(),
        'strains': {
            'axial': axial_strain,
            'lateral': lateral_strain,
            'volumetric': axial_strain + 2 * lateral_strain,
        }
    }


def compute_stress_tensor_principal_stresses(
    sigma_x: float,
    sigma_y: float,
    sigma_z: float,
    tau_xy: float = 0,
    tau_yz: float = 0,
    tau_xz: float = 0,
) -> Dict:
    """
    Compute principal stresses from stress tensor components
    Uses eigenvalue decomposition of stress matrix

    Args:
        sigma_x, sigma_y, sigma_z: Normal stresses
        tau_xy, tau_yz, tau_xz: Shear stresses

    Returns:
        Dictionary with principal stresses and directions
    """

    # Construct stress tensor
    stress_tensor = np.array([
        [sigma_x, tau_xy, tau_xz],
        [tau_xy, sigma_y, tau_yz],
        [tau_xz, tau_yz, sigma_z],
    ])

    # Compute eigenvalues (principal stresses) and eigenvectors (principal directions)
    eigenvalues, eigenvectors = np.linalg.eig(stress_tensor)

    # Sort by magnitude
    idx = np.argsort(-np.abs(eigenvalues))
    principal_stresses = eigenvalues[idx]
    principal_directions = eigenvectors[:, idx]

    return {
        'principal_stresses': principal_stresses.tolist(),
        'principal_directions': principal_directions.tolist(),
        'stress_tensor': stress_tensor.tolist(),
        'max_shear_stress': (principal_stresses[0] - principal_stresses[2]) / 2,
    }


def compute_hookes_law_components(
    sigma_x: float,
    sigma_y: float,
    sigma_z: float,
    youngs_modulus: float,
    poisson_ratio: float,
) -> Dict:
    """
    Compute strain components from stress using Hooke's Law
    ε_x = (σ_x - ν(σ_y + σ_z)) / E
    ε_y = (σ_y - ν(σ_x + σ_z)) / E
    ε_z = (σ_z - ν(σ_x + σ_y)) / E

    Args:
        sigma_x, sigma_y, sigma_z: Normal stresses
        youngs_modulus: Young's modulus E
        poisson_ratio: Poisson's ratio ν

    Returns:
        Dictionary with strain components
    """

    E = youngs_modulus
    nu = poisson_ratio

    epsilon_x = (sigma_x - nu * (sigma_y + sigma_z)) / E
    epsilon_y = (sigma_y - nu * (sigma_x + sigma_z)) / E
    epsilon_z = (sigma_z - nu * (sigma_x + sigma_y)) / E

    return {
        'strain_x': epsilon_x,
        'strain_y': epsilon_y,
        'strain_z': epsilon_z,
        'volumetric_strain': epsilon_x + epsilon_y + epsilon_z,
    }


def compute_von_mises_stress(
    sigma_x: float,
    sigma_y: float,
    sigma_z: float,
    tau_xy: float = 0,
    tau_yz: float = 0,
    tau_xz: float = 0,
) -> float:
    """
    Compute Von Mises equivalent stress (effective stress)
    Used for failure prediction in ductile materials

    σ_vm = sqrt(0.5 * ((σ_x - σ_y)² + (σ_y - σ_z)² + (σ_z - σ_x)²) + 3(τ_xy² + τ_yz² + τ_xz²))

    Args:
        Stress tensor components

    Returns:
        Von Mises equivalent stress
    """

    sigma_vm = np.sqrt(
        0.5 * (
            (sigma_x - sigma_y)**2 +
            (sigma_y - sigma_z)**2 +
            (sigma_z - sigma_x)**2
        ) + 3 * (tau_xy**2 + tau_yz**2 + tau_xz**2)
    )

    return float(sigma_vm)


def compute_torsion(
    torque: float,
    diameter: float,
    length: float,
    youngs_modulus: float,
    poisson_ratio: float,
    yield_stress: float,
    num_points: int = 50,
) -> Dict:
    """
    Compute shear stress distribution and angle of twist for a solid
    circular shaft in torsion.

    Args:
        torque: Applied torque T in N·m
        diameter: Shaft diameter d in mm
        length: Shaft length L in m
        youngs_modulus: Young's modulus E in MPa (used to derive shear modulus)
        poisson_ratio: Poisson's ratio ν (used to derive shear modulus)
        yield_stress: Tensile yield stress σ_y in MPa (Tresca: τ_yield = σ_y / 2)
        num_points: Number of points along the radial stress distribution

    Returns:
        Dictionary with max shear stress, angle of twist, safety factor,
        and the radial shear-stress distribution τ(r) = T r / J.
    """

    if diameter <= 0:
        raise ValueError("Diameter must be positive")
    if length <= 0:
        raise ValueError("Length must be positive")
    if youngs_modulus <= 0:
        raise ValueError("Young's modulus must be positive")

    # Shear modulus from the isotropic elasticity relation G = E / (2(1+ν))
    shear_modulus = youngs_modulus / (2 * (1 + poisson_ratio))  # MPa

    d_m = diameter / 1000.0  # mm -> m
    radius_m = d_m / 2

    # Polar moment of inertia for a solid circular shaft: J = π d⁴ / 32
    polar_moment = np.pi * d_m**4 / 32  # m^4

    # τ(r) = T r / J, in Pa -> convert to MPa
    max_shear_stress = (torque * radius_m / polar_moment) / 1e6  # MPa

    # θ = T L / (G J); G must be in Pa (N/m²) to match T [N·m] and J [m^4]
    shear_modulus_pa = shear_modulus * 1e6
    angle_of_twist_rad = torque * length / (shear_modulus_pa * polar_moment)
    angle_of_twist_deg = np.degrees(angle_of_twist_rad)

    # Maximum shear stress (Tresca) failure theory
    shear_yield_stress = yield_stress / 2  # MPa
    safety_factor = (
        shear_yield_stress / max_shear_stress if max_shear_stress > 0 else float('inf')
    )

    radii_m = np.linspace(0, radius_m, num_points)
    shear_stress_distribution = (torque * radii_m / polar_moment) / 1e6  # MPa

    return {
        'torque': torque,
        'diameter': diameter,
        'length': length,
        'max_shear_stress': float(max_shear_stress),
        'shear_modulus': float(shear_modulus),
        'polar_moment': float(polar_moment),
        'angle_of_twist_deg': float(angle_of_twist_deg),
        'angle_of_twist_rad': float(angle_of_twist_rad),
        'shear_yield_stress': float(shear_yield_stress),
        'safety_factor': float(safety_factor),
        'distribution': [
            {'radius_mm': float(r * 1000), 'shear_stress': float(tau)}
            for r, tau in zip(radii_m, shear_stress_distribution)
        ],
        'properties': {
            'youngs_modulus': youngs_modulus,
            'poisson_ratio': poisson_ratio,
            'yield_stress': yield_stress,
        },
    }


# Example usage and testing
if __name__ == '__main__':
    # Test stress-strain calculation
    print("=" * 50)
    print("Stress-Strain Analysis - Steel")
    print("=" * 50)

    steel = MATERIALS['steel']

    # Test at different stress levels
    stress_levels = [50, 100, 200, 250, 300, 400]

    for stress in stress_levels:
        result = compute_stress_strain(
            applied_stress=stress,
            youngs_modulus=steel.youngs_modulus,
            poisson_ratio=steel.poisson_ratio,
            yield_stress=steel.yield_stress,
        )

        print(f"\nStress: {stress} MPa")
        print(f"  Strain: {result['axial_strain']*100:.4f}%")
        print(f"  Region: {result['region'].upper()}")

    # Test stress-strain curve generation
    print("\n" + "=" * 50)
    print("Stress-Strain Curve Generation")
    print("=" * 50)

    strains, stresses = generate_stress_strain_curve(
        youngs_modulus=steel.youngs_modulus,
        yield_stress=steel.yield_stress,
        ultimate_stress=steel.ultimate_stress,
        num_points=10,
    )

    for strain, stress in zip(strains[:5], stresses[:5]):
        print(f"Strain: {strain:.4f} -> Stress: {stress:.2f} MPa")

    # Test 3D deformation
    print("\n" + "=" * 50)
    print("3D Material Deformation")
    print("=" * 50)

    deform = compute_material_deformation_3d(
        applied_stress=150,
        youngs_modulus=steel.youngs_modulus,
        poisson_ratio=steel.poisson_ratio,
    )

    print(f"Original volume: {1.0 * 1.0 * 1.0:.4f}")
    print(f"Deformed volume: {deform['deformed']['volume']:.4f}")
    print(f"Volume change: {deform['strains']['volumetric']*100:.4f}%")
