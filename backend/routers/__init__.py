"""API routers for SimMec backend"""

from . import stress_strain
from . import catalog
from . import four_bar_linkage
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
from . import particle_kinematics
from . import newton_work_energy
from . import rigid_body_planar_kinematics
from . import first_law_thermodynamics
from . import fluid_statics_bernoulli
from . import pipe_flow_heat_transfer
from . import gear_tooth_bending
from . import belt_chain_drives
from . import statics_equilibrium
from . import statics_truss
from . import statics_friction
from . import statics_centroids
from . import rigid_body_kinetics
from . import free_vibration
from . import forced_vibration
from . import step_response
from . import pid_tuning
from . import root_locus_stability
from . import frequency_response_bode
from . import control_volume_momentum
from . import viscous_flow
from . import boundary_layer
from . import drag_lift
from . import pump_system
from . import robotics_kinematics
from . import metal_cutting
from . import material_selection
from . import phase_diagram_lever_rule
from . import sheet_metal_bending
from . import tolerance_stackup
from . import second_law
from . import power_cycles
from . import conduction_networks
from . import fin_heat_transfer
from . import transient_lumped
from . import convection_heat_exchangers

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
    'particle_kinematics',
    'newton_work_energy',
    'rigid_body_planar_kinematics',
    'first_law_thermodynamics',
    'fluid_statics_bernoulli',
    'pipe_flow_heat_transfer',
    'gear_tooth_bending',
    'belt_chain_drives',
    'statics_equilibrium',
    'statics_truss',
    'statics_friction',
    'statics_centroids',
    'rigid_body_kinetics',
    'free_vibration',
    'forced_vibration',
    'step_response',
    'pid_tuning',
    'root_locus_stability',
    'frequency_response_bode',
    'control_volume_momentum',
    'viscous_flow',
    'boundary_layer',
    'drag_lift',
    'pump_system',
    'robotics_kinematics',
    'metal_cutting',
    'material_selection',
    'phase_diagram_lever_rule',
    'sheet_metal_bending',
    'tolerance_stackup',
    'second_law',
    'power_cycles',
    'conduction_networks',
    'fin_heat_transfer',
    'transient_lumped',
    'convection_heat_exchangers',
]
