"""API routers for SimMec backend"""

from . import stress_strain
from . import catalog
from . import four_bar_linkage
<<<<<<< Updated upstream

__all__ = ['stress_strain', 'catalog', 'four_bar_linkage']
=======
from . import torsion
from . import axial_loading
from . import shear_bending
from . import bending_stress
from . import beam_deflection
from . import mohrs_circle
from . import buckling
from . import failure_theories
from . import fatigue_analysis
from . import shaft_design
from . import spring_design
from . import bolted_joints
from . import bearing_selection

__all__ = [
    'stress_strain',
    'catalog',
    'four_bar_linkage',
    'torsion',
    'axial_loading',
    'shear_bending',
    'bending_stress',
    'beam_deflection',
    'mohrs_circle',
    'buckling',
    'failure_theories',
    'fatigue_analysis',
    'shaft_design',
    'spring_design',
    'bolted_joints',
    'bearing_selection',
]
>>>>>>> Stashed changes
