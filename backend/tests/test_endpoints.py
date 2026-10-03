"""Endpoint tests for every POST /api/* route (catalog excluded).

Each valid case posts a physically sensible payload taken from the topic's
workedExample (frontend/src/config/curriculum.ts and frontend/src/config/slices/*.ts),
asserts HTTP 200 and checks 1-3 key outputs against the worked-example answer.
Where the worked example gives no number (or no matching endpoint input) the
expected value is derived by hand from the textbook formula and flagged "derived".

Invalid-input cases assert HTTP 400 (domain validation raised as ValueError and
mapped to 400 by the routers).  Enum fields typed as pydantic ``Literal`` are
rejected earlier with 422 and are asserted separately.

Run from backend/:
    PYTHONPATH=../python-engine/src:. ../.venv/bin/python -m pytest -q
"""

import math

import pytest
from fastapi.testclient import TestClient

from app import app

client = TestClient(app)

DEL = object()  # sentinel: drop this key from the payload


# --------------------------------------------------------------------------
# helpers
# --------------------------------------------------------------------------
def dig(obj, path):
    """Walk 'a.b.0.c' through dicts/lists; 'len:x' returns len(x);
    a 'key=value' token selects the list item whose dict has key == value."""
    if path.startswith("len:"):
        return len(dig(obj, path[4:]))
    for tok in path.split("."):
        if "=" in tok:
            k, v = tok.split("=", 1)
            obj = next(item for item in obj if item[k] == v)
        elif isinstance(obj, list):
            obj = obj[int(tok)]
        else:
            obj = obj[tok]
    return obj


def check(body, key, expected, rel=1e-3):
    actual = dig(body, key)
    if isinstance(expected, tuple):
        op, ref = expected
        assert {"lt": actual < ref, "gt": actual > ref}[op], f"{key}={actual!r} not {op} {ref}"
    elif isinstance(expected, bool) or isinstance(expected, str) or expected is None:
        assert actual == expected, f"{key}={actual!r} != {expected!r}"
    elif isinstance(expected, int) and key.startswith("len:"):
        assert actual == expected
    else:
        assert actual == pytest.approx(expected, rel=rel, abs=1e-9), f"{key}={actual!r} != {expected!r} (rel {rel})"


def N(path, payload, *checks):
    return (path, payload, checks)


# --------------------------------------------------------------------------
# valid cases: id -> (path, payload, [(key, expected[, rel]), ...])
# --------------------------------------------------------------------------
_euler_rect = math.pi ** 2 * 200000 * (50 * 50 ** 3 / 12) / 3000 ** 2 / 1000  # kN, derived
_shaft_kf = 1.6
_shaft_d = (16 * 2 / math.pi * (2 * _shaft_kf * 200000 / 300 + math.sqrt(3) * _shaft_kf * 150000 / 600)) ** (1 / 3)  # DE-Goodman, Kfs = Kf

CASES = {
    # ---- stress-strain (worked example: F=40 kN on 200 mm2 -> 200 MPa, dL ~0.48 mm over 500 mm)
    "stress-strain-compute": N("/api/stress-strain/compute",
        dict(applied_stress=200, youngs_modulus=210000, poisson_ratio=0.3, yield_stress=250),
        ("axial_strain", 200 / 210000), ("region", "elastic")),
    "stress-strain-curve": N("/api/stress-strain/curve",
        dict(youngs_modulus=210000, yield_stress=250, ultimate_stress=400),
        ("len:curve", 100), ("curve.99.stress", 400.0)),
    "stress-strain-3d": N("/api/stress-strain/3d-deformation",
        dict(applied_stress=200, youngs_modulus=210000, poisson_ratio=0.3,
             original_length=500, original_width=20, original_height=10),
        ("deformed.length", 500.4762, 1e-6), ("strains.axial", 200 / 210000)),
    "stress-strain-batch": N("/api/stress-strain/batch",
        [dict(applied_stress=200, youngs_modulus=210000, poisson_ratio=0.3, yield_stress=250)],
        ("results.0.axial_strain", 200 / 210000), ("results.0.region", "elastic")),
    # ---- torsion (T=500 N.m, d=40 mm, L=1 m, G=80 GPa -> E=208 GPa at nu=0.3)
    "torsion": N("/api/torsion/compute",
        dict(torque=500, diameter=40, length=1, youngs_modulus=208000, poisson_ratio=0.3, yield_stress=250),
        ("max_shear_stress", 39.8, 5e-3), ("angle_of_twist_deg", 1.4, 0.02)),
    # ---- axial loading (fixed-fixed rod, dT=50 C -> 120 MPa)
    "axial-constrained": N("/api/axial-loading/compute",
        dict(force=0, length=1, area=300, youngs_modulus=200000, alpha=12e-6, delta_t=50,
             yield_stress=250, constrained=True),
        ("thermal_stress", 120.0), ("total_elongation", 0.0)),
    "axial-two-rod": N("/api/axial-loading/two-rod",  # derived: F1 = F*A1E1/(A1E1+A2E2)
        dict(force=100000, length=1, area_1=300, area_2=300, youngs_modulus_1=200000,
             youngs_modulus_2=70000, yield_stress_1=250, yield_stress_2=275),
        ("force_1", 100000 * 200 / 270, 1e-4), ("force_2", 100000 * 70 / 270, 1e-4)),
    # ---- shear/bending (6 m, 12 kN midspan -> 18 kN.m)
    "shear-bending": N("/api/shear-bending/compute",
        dict(length=6, load_type="point", magnitude=12000, position_frac=0.5),
        ("m_max", 18000.0), ("m_max_location", 3.0), ("reaction_a", 6000.0)),
    # ---- bending stress (M=18 kN.m, 100x200 -> 27 MPa)
    "bending-stress": N("/api/bending-stress/compute",
        dict(moment=18000, width=100, height=200),
        ("max_bending_stress", 27.0)),
    # ---- beam deflection (~4 mm, limit ~16.7 mm)
    "beam-deflection": N("/api/beam-deflection/compute",
        dict(length=6, load_kn=12, position_pct=50, height_mm=200, youngs_modulus=200000,
             yield_stress=250, width_mm=100),
        ("max_deflection_mm", 4.0, 0.02), ("deflection_limit_mm", 16.7, 5e-3), ("strength_ok", True)),
    # ---- Mohr's circle (88.3 / 31.7 MPa)
    "mohrs-circle": N("/api/mohrs-circle/compute",
        dict(sigma_x=80, sigma_y=40, tau_xy=20),
        ("sigma_1", 88.3, 1e-3), ("sigma_2", 31.7, 1e-3)),
    # ---- buckling: endpoint is a solid RECTANGLE; Euler value derived for 50x50 mm.
    #      (the worked example's 67.3 kN is for a d=50 mm CIRCLE -> see xfail test below)
    "buckling": N("/api/buckling/compute",
        dict(length=3, end_condition="pinned-pinned", youngs_modulus=200000, width=50, height=50, applied_load=20),
        ("critical_load", _euler_rect, 1e-6), ("safety_factor", _euler_rect / 20, 1e-6)),
    # ---- failure theories (FOS 1.94 von Mises / 1.75 Tresca)
    "failure-theories": N("/api/failure-theories/compute",
        dict(sigma_x=150, sigma_y=-50, tau_xy=0, yield_stress=350),
        ("safety_factor_von_mises", 1.94, 3e-3), ("safety_factor_tresca", 1.75), ("governing_theory", "tresca")),
    # ---- fatigue (sigma 30..150 -> mean 90, alt 60; FOS 2.78, infinite life)
    "fatigue": N("/api/fatigue-analysis/compute",
        dict(mean_stress=90, alternating_stress=60, ultimate_strength=620, endurance_limit=280),
        ("safety_factor", 2.78, 3e-3), ("life_regime", "infinite")),
    # ---- shaft design: DE-Goodman, pinned with a single Kf for bending and torsion;
    #      the worked example (Kf=1.6, Kfs=1.3 -> 30.2 mm) is checked in its own test below
    "shaft-design": N("/api/shaft-design/compute",
        dict(alternating_moment=200, mean_torque=150, endurance_limit=300, ultimate_strength=600,
             stress_concentration_factor=1.6, notch_sensitivity=1.0, target_safety_factor=2),
        ("fatigue_stress_concentration_factor", 1.6), ("required_diameter", _shaft_d, 1e-6)),
    # ---- spring (d=3, D=24, N=10, G=79 GPa, F=150 N -> 26 mm, 402 MPa)
    "spring-design": N("/api/spring-design/compute",
        dict(wire_diameter=3, coil_diameter=24, active_coils=10, shear_modulus=79000,
             applied_force=150, allowable_shear_stress=620),
        ("deflection", 26.0, 5e-3), ("max_shear_stress", 402.0, 3e-3), ("spring_index", 8.0)),
    # ---- bolted joint (C=0.25, Fp=580*84.3, P=20 kN -> Fb 41.7 kN, Fm 21.7 kN)
    "bolted-joints": N("/api/bolted-joints/compute",
        dict(bolt_stiffness=250000, member_stiffness=750000, proof_load=48894, external_load=20000),
        ("bolt_load", 41670.0, 2e-3), ("member_load", 21670.0, 3e-3), ("is_separated", False)),
    # ---- bearing (C=25, P=5 kN, 1800 rpm -> 125 Mrev, 1157 h)
    "bearing-life": N("/api/bearing-selection/compute",
        dict(mode="life", bearing_type="ball", applied_load=5, shaft_speed=1800, dynamic_load_rating=25),
        ("L10", 125.0), ("L10_hours", 1157.0, 1e-3)),
    "bearing-required": N("/api/bearing-selection/compute",  # inverse of the example
        dict(mode="required_rating", bearing_type="ball", applied_load=5, shaft_speed=1800, target_life_hours=1157.4),
        ("required_dynamic_load_rating", 25.0)),
    # ---- gear tooth (slice example: Pd=8, N=20 -> d=2.5 in; 13,500 psi)
    "gear-tooth-bending": N("/api/gear-tooth-bending/compute",
        dict(teeth=20, diametral_pitch=8, face_width=1.25, torque=850),
        ("lewis_stress", 13500.0, 3e-3), ("pitch_diameter", 2.5), ("tangential_load", 680.0)),
    # ---- belt/chain (875 rpm, 3.9 kW)
    "belt": N("/api/belt-chain-drives/belt",
        dict(driver_diameter=150, driven_diameter=300, center_distance=432, driver_rpm=1750,
             friction_coefficient=0.3, tight_tension=500),
        ("driven_rpm", 875.0), ("power_kw", 3.9, 5e-3), ("wrap_angle_deg", 160.0)),
    "chain": N("/api/belt-chain-drives/chain",  # derived: v = z1*p*n/60000, P = F*v
        dict(chain_pitch=12.7, driver_teeth=19, driven_teeth=38, driver_rpm=1000, chain_pull=1000),
        ("driven_rpm", 500.0), ("chain_speed", 19 * 12.7 * 1000 / 60000), ("power_kw", 19 * 12.7 * 1000 / 60000)),
    # ---- particle kinematics (a_n = 8, |a| = 8.25)
    "particle-kinematics": N("/api/particle-kinematics/compute",
        dict(speed=20, tangential_accel=2, radius_of_curvature=50),
        ("normal_accel", 8.0), ("total_accel", 8.25, 1e-3)),
    # ---- Newton / work-energy (45.5 m)
    "newton-work-energy": N("/api/newton-work-energy/compute",
        dict(mass=1000, initial_speed=25, friction_coefficient=0.7),
        ("stopping_distance", 45.5, 2e-3)),
    # ---- planar kinematics (top of rolling wheel = 6 m/s)
    "planar-kinematics": N("/api/rigid-body-planar-kinematics/compute",
        dict(radius=0.3, angular_velocity=10, point_angle_deg=0),
        ("center_velocity", 3.0), ("point_velocity", 6.0)),
    # ---- first law (Q=0, W=-15 kJ -> dU = +15 kJ)
    "first-law": N("/api/first-law-thermodynamics/compute",
        dict(mass=1, specific_heat_cv=0.718, initial_temp=300, heat_added=0, work_done_by_system=-15),
        ("delta_u", 15.0), ("final_temp", 300 + 15 / 0.718)),
    # ---- Bernoulli venturi (8 m/s, 270 kPa)
    "fluid-statics-bernoulli": N("/api/fluid-statics-bernoulli/compute",
        dict(density=1000, area1=0.02, area2=0.005, velocity1=2, pressure1=300000),
        ("velocity2", 8.0), ("pressure2", 270000.0)),
    # ---- pipe flow (laminar oil, 20.4 m head loss, 3 kW/m2)
    "pipe-flow-heat-transfer": N("/api/pipe-flow-heat-transfer/compute",
        dict(density=900, kinematic_viscosity=1e-4, velocity=0.5, diameter=0.02, length=50,
             convection_coefficient=50, surface_temp=80, fluid_temp=20),
        ("reynolds", 100.0), ("head_loss", 20.4, 1e-3), ("heat_flux", 3000.0)),
    # ---- 4-bar (100/40/80/70 -> Grashof crank-rocker)
    "4bar-assembly": N("/api/4bar-linkage/assembly-check",
        dict(L1=100, L2=40, L3=80, L4=70),
        ("is_grashof", True), ("type", "CRANK-ROCKER")),
    "4bar-compute": N("/api/4bar-linkage/compute",  # derived: C = L2 at theta2
        dict(L1=100, L2=40, L3=80, L4=70, theta2_deg=60),
        ("status", "ok"), ("joints.C.x", 20.0), ("joints.C.y", 40 * math.sin(math.radians(60)))),
    "4bar-motion-curve": N("/api/4bar-linkage/motion-curve",
        dict(L1=100, L2=40, L3=80, L4=70, num_points=36),
        ("len:input_angles", 36), ("len:output_angles", 36)),
    # ---- rigid body kinetics (a = 3.27, f = 16.35 N, v = 4.43 m/s, t = 1.35 s)
    "rigid-body-kinetics": N("/api/rigid-body-kinetics/compute",
        dict(shape="solid_cylinder", mass=10, radius=0.2, incline_angle_deg=30,
             friction_coefficient=0.5, incline_length=3),
        ("acceleration", 3.27, 2e-3), ("friction_force", 16.35, 1e-3), ("mu_required", 0.19, 0.015),
        ("final_speed", 4.43, 1e-3), ("final_time", 1.35, 5e-3), ("slips", False)),
    # ---- free vibration (19.9 rad/s, 0.316 s, ratio 1.88, ~2 s settle)
    "free-vibration": N("/api/free-vibration/compute",
        dict(mass=2, stiffness=800, damping=8, initial_displacement=0.05, initial_velocity=0),
        ("damped_frequency", 19.9, 1e-3), ("period", 0.316, 1e-3),
        ("amplitude_ratio_per_cycle", 1.88, 1e-3), ("settling_time", 2.0, 1e-2)),
    # ---- forced vibration (r=3: 3.12 mm, 14.5 N)
    "forced-vibration": N("/api/forced-vibration/compute",
        dict(mass=10, stiffness=4000, damping=40, force_amplitude=100, forcing_frequency=60),
        ("amplitude", 3.12e-3, 5e-3), ("force_transmitted", 14.5, 5e-3)),
    "forced-vibration-resonance": N("/api/forced-vibration/compute",  # at resonance 125 mm, 510 N
        dict(mass=10, stiffness=4000, damping=40, force_amplitude=100, forcing_frequency=20),
        ("amplitude", 0.125, 5e-3), ("force_transmitted", 510.0, 5e-3)),
    # ---- step response (16.3 % overshoot, tp 0.363 s, ts ~0.8 s)
    "step-second-order": N("/api/step-response/compute",
        dict(order=2, gain=1, natural_frequency=10, damping_ratio=0.5),
        ("overshoot_percent", 16.3, 2e-3), ("peak_time", 0.363, 2e-3), ("settling_time", 0.8, 2e-2)),
    "step-first-order": N("/api/step-response/compute",  # derived: tr = 2.197 tau, ts(est) = 4 tau
        dict(order=1, gain=2, time_constant=3),
        ("final_value", 2.0), ("rise_time", 2.197 * 3, 1e-3), ("settling_estimate", 12.0)),
    # ---- PID (K=1, tau=10, theta=2)
    "pid-p-only": N("/api/pid-tuning/compute",
        dict(plant_gain=1, plant_tau=10, plant_delay=2, kp=1, t_end=60),
        ("steady_state_error", 0.5, 1e-2)),
    "pid-ziegler-nichols": N("/api/pid-tuning/compute",
        dict(plant_gain=1, plant_tau=10, plant_delay=2, kp=6, ti=4, td=1, t_end=60),
        ("overshoot_percent", 65.0, 5e-3)),
    "pid-detuned": N("/api/pid-tuning/compute",
        dict(plant_gain=1, plant_tau=10, plant_delay=2, kp=3, ti=8, td=1, t_end=60),
        ("overshoot_percent", 9.8, 5e-3)),
    # ---- root locus L = K/(s(s+1)(s+2))
    "root-locus-stable": N("/api/root-locus-stability/compute",
        dict(pole_a=1, pole_b=2, gain=2),
        ("status", "stable"), ("critical_gain", 6.0), ("crossing_frequency", 1.414, 1e-3),
        ("breakaway_point", -0.423, 2e-3)),
    "root-locus-unstable": N("/api/root-locus-stability/compute",
        dict(pole_a=1, pole_b=2, gain=10),
        ("status", "unstable"), ("rhp_poles", 2)),
    # ---- Bode (wgc 1.244, PM 31.7, wpc 3.162, GM 5.5 / 14.8 dB, Kcrit 11)
    "bode": N("/api/frequency-response-bode/compute",
        dict(gain=2, tau1=1, tau2=0.1),
        ("gain_crossover", 1.244, 1e-3), ("phase_margin_deg", 31.7, 1e-3), ("phase_crossover", 3.162, 1e-3),
        ("gain_margin", 5.5), ("gain_margin_db", 14.8, 1e-3), ("critical_gain", 11.0)),
    # ---- control-volume momentum (plate 785 N, bucket 1571 N, Pelton wheel 785 N / 7.85 kW)
    "cv-momentum-plate": N("/api/control-volume-momentum/compute",
        dict(jet_diameter=0.05, jet_velocity=20, turning_angle=90, vane_velocity=0),
        ("fixed_force_x", 785.0, 1e-3)),
    "cv-momentum-bucket": N("/api/control-volume-momentum/compute",
        dict(jet_diameter=0.05, jet_velocity=20, turning_angle=180, vane_velocity=0),
        ("fixed_force_x", 1571.0, 1e-3)),
    "cv-momentum-wheel": N("/api/control-volume-momentum/compute",
        dict(jet_diameter=0.05, jet_velocity=20, turning_angle=180, vane_velocity=10),
        ("wheel_force_x", 785.0, 1e-3), ("wheel_power", 7850.0, 1e-3), ("wheel_efficiency", 1.0)),
    # ---- viscous flow (Q 12.2 mL/s, V 0.156, umax 0.312, tau_w 0.125, Re 1560)
    "viscous-pipe": N("/api/viscous-flow/compute",
        dict(mode="pipe", viscosity=1.002e-3, density=1000, diameter=0.01, length=2, pressure_drop=100),
        ("flow_rate", 1.22e-5, 5e-3), ("mean_velocity", 0.156, 5e-3), ("max_velocity", 0.312, 5e-3),
        ("wall_shear", 0.125, 1e-3), ("reynolds", 1560.0, 5e-3), ("regime", "laminar")),
    "viscous-couette": N("/api/viscous-flow/compute",  # derived: tau = mu U / h
        dict(mode="couette", viscosity=0.1, density=900, gap=0.002, plate_velocity=1.0),
        ("tau_lower", 50.0), ("mean_velocity", 0.5)),
    # ---- boundary layer (delta 8.5 mm, tau_w 0.017 Pa, drag 0.035 N)
    "boundary-layer": N("/api/boundary-layer/compute",
        dict(free_stream_velocity=5, plate_length=1, kinematic_viscosity=1.5e-5, density=1.2, plate_width=1),
        ("regime", "laminar"), ("delta", 8.5e-3, 5e-3), ("wall_shear", 0.017, 0.02), ("drag_force", 0.035, 0.02)),
    # ---- drag/lift wing (9.2 kN, 0.40 kN, L/D 23, CL 0.60, CD 0.026)
    "drag-lift-wing": N("/api/drag-lift/compute",
        dict(kind="wing", velocity=50, density=1.225, angle_of_attack=5, aspect_ratio=8, wing_area=10,
             zero_lift_angle=-2, oswald_efficiency=0.9, profile_drag=0.01),
        ("lift_force", 9200.0, 5e-3), ("drag_force", 400.0, 1e-2), ("lift_to_drag", 23.0, 1e-2),
        ("lift_coefficient", 0.60, 2e-3), ("drag_coefficient", 0.026, 5e-3)),
    "drag-lift-bluff": N("/api/drag-lift/compute",  # derived: subcritical sphere Cd 0.47, F = Cd q A
        dict(kind="bluff", velocity=10, density=1.225, shape="sphere", diameter=0.1),
        ("drag_coefficient", 0.47), ("drag_force", 0.47 * 0.5 * 1.225 * 100 * math.pi * 0.05 ** 2, 1e-3)),
    # ---- pump (23.8 L/s, 25.8 m, 8.3 kW, 72 %, NPSHa 5.4 m)
    "pump-system": N("/api/pump-system/compute",
        dict(shutoff_head=40, rated_flow=0.02, rated_head=30, peak_efficiency=0.75, static_head=15,
             pipe_diameter=0.1, pipe_length=100, minor_loss_k=5, roughness=4.6e-5, density=1000,
             viscosity=1e-3, atmospheric_pressure=101300, vapor_pressure=2340, suction_head=-4,
             suction_loss_k=1.5, npsh_required=3),
        ("operating_flow", 0.0238, 5e-3), ("operating_head", 25.8, 3e-3), ("shaft_power", 8300.0, 1e-2),
        ("efficiency", 0.72, 1e-2), ("npsh_available", 5.4, 5e-3), ("npsh_margin", 2.4, 1e-2),
        ("cavitation_risk", False)),
    # ---- metal cutting (750 N, 1.5 kW, tool life 39 -> 19 min at +20 % speed)
    "metal-cutting": N("/api/metal-cutting/compute",
        dict(uncut_thickness=0.25, width_of_cut=3, rake_angle=10, friction_angle=30, shear_strength=350,
             cutting_speed=120, taylor_n=0.25, taylor_c=300),
        ("cutting_force", 750.0, 1e-3), ("cutting_power", 1500.0, 1e-3), ("tool_life", 39.0, 2e-3)),
    "metal-cutting-faster": N("/api/metal-cutting/compute",
        dict(uncut_thickness=0.25, width_of_cut=3, rake_angle=10, friction_angle=30, shear_strength=350,
             cutting_speed=144, taylor_n=0.25, taylor_c=300),
        ("tool_life", 19.0, 1e-2)),
    # ---- material selection (Al = 59 % of steel mass, CFRP = 34 %)
    "material-selection": N("/api/material-selection/compute",
        dict(index="stiff_beam", reference="steel_1020"),
        ("materials.id=al_6061.mass_ratio", 0.59, 1e-2), ("materials.id=cfrp.mass_ratio", 0.34, 2e-2),
        ("materials.id=steel_1020.mass_ratio", 1.0)),
    # ---- phase diagram (48.8 % pro-eutectoid ferrite / 51.2 % pearlite; 94.3 % ferrite, 5.7 % Fe3C)
    "phase-diagram": N("/api/phase-diagram-lever-rule/compute",
        dict(carbon=0.40),
        ("proeutectoid_fraction", 0.488, 1e-3), ("pearlite_fraction", 0.512, 1e-3),
        ("ferrite_fraction", 0.943, 1e-3), ("cementite_fraction", 0.057, 1e-2)),
    "phase-tie-line": N("/api/phase-diagram-lever-rule/tie-line",
        dict(overall=0.40, phase_a_composition=0.022, phase_b_composition=6.70),
        ("fraction_a", 0.943, 1e-3), ("fraction_b", 0.057, 1e-2)),
    # ---- sheet metal (blank 95.4 mm, tool angle 93.8 deg)
    "sheet-metal": N("/api/sheet-metal-bending/compute",
        dict(thickness=1.5, inner_radius=6, bend_angle=90, k_factor=0.4, flange_a=40, flange_b=60,
             yield_strength=600, youngs_modulus=200000, ultimate_strength=800, die_opening=12, bend_length=100),
        ("flat_length", 95.4, 1e-3), ("tool_angle", 93.8, 1e-3)),
    "sheet-metal-mild-steel": N("/api/sheet-metal-bending/compute",  # springback well under 2 deg
        dict(thickness=1.5, inner_radius=6, bend_angle=90, k_factor=0.4, flange_a=40, flange_b=60,
             yield_strength=250, youngs_modulus=200000, ultimate_strength=400, die_opening=12, bend_length=100),
        ("springback_angle", ("lt", 2.0))),
    # ---- tolerance (H7/g6 25 mm: 7-41 um; stack 0.50 +/-0.23 WC, +/-0.126 RSS, A = 63 %)
    "tolerance-fit": N("/api/tolerance-stackup/fit",
        dict(nominal=25, hole_grade=7, shaft_letter="g", shaft_grade=6),
        ("min_clearance", 0.007, 1e-3), ("max_clearance", 0.041, 1e-3), ("fit_type", "Clearance")),
    "tolerance-stack": N("/api/tolerance-stackup/stack",
        dict(dimensions=[dict(name="A", nominal=50, tolerance=0.10, direction=1),
                         dict(name="B", nominal=20, tolerance=0.05, direction=-1),
                         dict(name="C", nominal=25, tolerance=0.05, direction=-1),
                         dict(name="D", nominal=4.5, tolerance=0.03, direction=-1)],
             required_min_gap=0.3),
        ("nominal_gap", 0.5), ("worst_case", 0.23, 1e-3), ("rss", 0.126, 5e-3),
        ("contributions.0.rss_share", 0.63, 5e-3)),
    # ---- robotics (L1=0.5, L2=0.3)
    "robotics-fk": N("/api/robotics/forward-kinematics",
        dict(l1=0.5, l2=0.3, theta1=30, theta2=45),
        ("end_effector.0", 0.511, 2e-3), ("end_effector.1", 0.540, 2e-3), ("orientation_deg", 75.0),
        ("r_min", 0.2), ("r_max", 0.8)),
    "robotics-ik-down": N("/api/robotics/inverse-kinematics",
        dict(l1=0.5, l2=0.3, x=0.4, y=0.4, elbow_up=False),
        ("selected.theta1", 13.05, 1e-3), ("selected.theta2", 93.82, 1e-3)),
    "robotics-ik-up": N("/api/robotics/inverse-kinematics",
        dict(l1=0.5, l2=0.3, x=0.4, y=0.4, elbow_up=True),
        ("selected.theta1", 76.95, 1e-3), ("selected.theta2", -93.82, 1e-3)),
    "robotics-jacobian": N("/api/robotics/jacobian",
        dict(l1=0.5, l2=0.3, theta1=30, theta2=45, qdot1=1.0, qdot2=0.5, fx=10, fy=0),
        ("tip_velocity.0", -0.685, 1e-3), ("tip_velocity.1", 0.549, 2e-3),
        ("joint_torques.0", -5.40, 1e-3), ("joint_torques.1", -2.90, 2e-3), ("manipulability", 0.106, 5e-3)),
    "robotics-transform": N("/api/robotics/transform",
        dict(yaw=90, tx=1, ty=2, tz=0, px=1, py=0, pz=0),
        ("point_in_a.0", 1.0), ("point_in_a.1", 3.0), ("point_in_a.2", 0.0), ("axis_angle_deg", 90.0)),
    "robotics-motor-gearhead": N("/api/robotics/motor-gearhead",
        dict(voltage=24, resistance=1.2, torque_constant=0.05, rotor_inertia=1e-5, gear_ratio=50,
             gear_efficiency=0.8, load_inertia=0.02, load_torque=2, load_speed=5),
        ("torque_available", 0.479, 1e-3), ("torque_required", 0.050, 1e-3),
        ("optimal_gear_ratio", 44.7, 1e-3), ("torque_feasible", True)),
    # ---- statics
    "statics-beam-2d": N("/api/statics-equilibrium/beam-2d",
        dict(span=6, loads=[dict(magnitude=12, position=2, angle_deg=270)], distributed_load=3),
        ("ay", 17.0), ("by", 13.0), ("ax", 0.0)),
    "statics-plate-3d": N("/api/statics-equilibrium/plate-3d",  # derived: Rc = P y/b, Rb = P x/a
        dict(length_a=2, length_b=3, load=10, load_x=1, load_y=1.5),
        ("ra", 0.0), ("rb", 5.0), ("rc", 5.0)),
    "statics-truss": N("/api/statics-truss/compute",
        dict(span=8, height=3, panels=2, load=20, load_joint=1),
        ("reaction_ay", 10.0), ("reaction_by", 10.0), ("max_tension", 12.02, 1e-3),
        ("max_compression", 13.33, 1e-3), ("members.0.force", 6.67, 1e-3)),
    "statics-friction-incline": N("/api/statics-friction/incline",
        dict(weight=500, angle_deg=20, mu=0.35, applied_force=100),
        ("p_min", 6.6, 1e-2), ("p_max", 335.5, 1e-3), ("status", "static")),
    "statics-friction-wedge": N("/api/statics-friction/wedge",
        dict(weight=1000, wedge_angle_deg=10, mu=0.3),
        ("drive_force", 803.0, 1e-3), ("self_locking", True)),
    "statics-friction-capstan": N("/api/statics-friction/capstan",
        dict(load=2000, mu=0.25, wrap_turns=1.5),
        ("holding_force", 190.0, 5e-3)),
    "statics-centroids": N("/api/statics-centroids/compute",
        dict(parts=[dict(shape="rect", cx=0, cy=90, w=100, h=20, sign=1),
                    dict(shape="rect", cx=0, cy=40, w=20, h=80, sign=1)]),
        ("y_bar", 67.8, 1e-3), ("ix", 3.14e6, 5e-3), ("section_modulus_top", 97500.0, 5e-3),
        ("section_modulus_bottom", 46400.0, 5e-3)),
    # ---- thermodynamics
    "second-law": N("/api/second-law/compute",
        dict(mode="engine", t_hot=800, t_cold=300, q_ref=1000, work=400),
        ("performance", 0.40), ("carnot_performance", 0.625), ("entropy_generation", 0.75), ("lost_work", 225.0)),
    "rankine": N("/api/power-cycles/rankine",
        dict(boiler_pressure=8, turbine_inlet_temp=500, condenser_pressure=0.01),
        ("thermal_efficiency", 0.394, 2e-3), ("back_work_ratio", 0.0064, 1e-2)),
    "brayton": N("/api/power-cycles/brayton",
        dict(inlet_temp=300, pressure_ratio=8, turbine_inlet_temp=1300),
        ("thermal_efficiency", 0.448, 1e-3), ("back_work_ratio", 0.418, 1e-3)),
    # ---- heat transfer
    "conduction-networks": N("/api/conduction-networks/compute",
        dict(geometry="plane", thicknesses=[0.12, 0.08, 0.005], conductivities=[1.0, 0.05, 45],
             h_inside=25, h_outside=10, t_inside=800, t_outside=25, area=1),
        ("heat_flux", 417.0, 1e-3), ("temp_drops.2", 667.0, 1e-3)),
    "fin-convective-tip": N("/api/fin-heat-transfer/compute",
        dict(shape="pin", dim_1=5, length=50, conductivity=200, h=50, t_base=100, t_ambient=25, tip="convective"),
        ("heat_rate", 2.58, 2e-3), ("efficiency", 0.85, 1e-2), ("effectiveness", 35.0, 2e-2),
        ("tip_temperature", 84.0, 3e-3)),
    "fin-adiabatic-tip": N("/api/fin-heat-transfer/compute",
        dict(shape="pin", dim_1=5, length=50, conductivity=200, h=50, t_base=100, t_ambient=25, tip="adiabatic"),
        ("heat_rate", 2.54, 2e-3)),
    "transient-lumped": N("/api/transient-lumped/compute",
        dict(shape="sphere", dimension=10, density=8933, specific_heat=385, conductivity=401, h=100,
             t_initial=200, t_ambient=25, time=60, t_target=100),
        ("lumped_valid", True), ("time_constant", 115.0, 5e-3), ("temperature", 128.7, 1e-3),
        ("time_to_target", 97.0, 2e-3)),
    "convection-heat-exchangers": N("/api/convection-heat-exchangers/compute",
        dict(arrangement="counterflow", tube_diameter=20, tube_length=3000, num_tubes=8, m_cold=1.5,
             t_cold_in=20, rho=992.2, mu=6.527e-4, k_fluid=0.6285, cp_cold=4179, h_outside=2000,
             m_hot=1.0, cp_hot=4000, t_hot_in=90),
        ("h_inside", 3340.0, 1e-3), ("u_overall", 1250.0, 1e-3), ("q", 95100.0, 1e-3),
        ("effectiveness", 0.34, 1e-2), ("t_cold_out", 35.2, 1e-3), ("t_hot_out", 66.2, 1e-3)),
}


@pytest.mark.parametrize("case_id", list(CASES))
def test_valid_payload_matches_worked_example(case_id):
    path, payload, checks = CASES[case_id]
    r = client.post(path, json=payload)
    assert r.status_code == 200, r.text
    body = r.json()
    for chk in checks:
        check(body, *chk)


def test_every_post_endpoint_is_covered():
    """Guard: any new POST /api route must get a case above."""
    spec = app.openapi()["paths"]
    posted = {p for p, v in spec.items() if "post" in v and p.startswith("/api/") and "catalog" not in p}
    covered = {path for path, _, _ in CASES.values()}
    assert posted - covered == set(), f"endpoints without a test case: {sorted(posted - covered)}"


# --------------------------------------------------------------------------
# cross-case relations from worked examples
# --------------------------------------------------------------------------
def test_pid_detuned_has_lower_iae_than_ziegler_nichols():
    zn = client.post(CASES["pid-ziegler-nichols"][0], json=CASES["pid-ziegler-nichols"][1]).json()
    dt = client.post(CASES["pid-detuned"][0], json=CASES["pid-detuned"][1]).json()
    assert dt["iae"] < zn["iae"]


def test_tolerance_housing_dimension_dominates_rss():
    body = client.post(CASES["tolerance-stack"][0], json=CASES["tolerance-stack"][1]).json()
    shares = {c["name"]: c["rss_share"] for c in body["contributions"]}
    assert shares["A"] == max(shares.values())
    assert sum(shares.values()) == pytest.approx(1.0)


# --------------------------------------------------------------------------
# DISCREPANCIES between worked examples and endpoints (strict xfail: they flip to
# a failure the moment the example or the endpoint is reconciled)
# --------------------------------------------------------------------------
@pytest.mark.xfail(strict=True, reason=(
    "columns-buckling worked example is a d=50 mm CIRCULAR section (67.3 kN) but "
    "/api/buckling/compute only models a rectangle (50x50 mm gives 114.2 kN)"))
def test_buckling_worked_example_circular_section():
    path, payload, _ = CASES["buckling"]
    body = client.post(path, json=payload).json()
    assert body["critical_load"] == pytest.approx(67.3, rel=5e-3)


def test_shaft_design_worked_example_diameter():
    """Worked example: Ma=200 N*m, Tm=150 N*m, Se=300, Sut=600 MPa, Kf=1.6, Kfs=1.3, n=2 -> 30.2 mm."""
    path, payload, _ = CASES["shaft-design"]
    body = client.post(path, json={**payload, "torsion_fatigue_factor": 1.3}).json()
    assert body["required_diameter"] == pytest.approx(30.17, rel=2e-3)
    # The engine rounds up to the nearest mm (31 mm, n about 2.17); 30 mm stock would fall just short (n about 1.97).
    assert (body["rounded_diameter"] == 31.0) and body["rounded_safety_factor"] > 2.0


def test_4bar_follower_length_is_preserved():
    path, payload, _ = CASES["4bar-compute"]
    j = client.post(path, json=payload).json()["joints"]
    dist_bd = math.hypot(j["D"]["x"] - j["B"]["x"], j["D"]["y"] - j["B"]["y"])
    assert dist_bd == pytest.approx(payload["L4"], rel=1e-6)


def test_4bar_coupler_length_is_preserved():
    path, payload, _ = CASES["4bar-compute"]
    j = client.post(path, json=payload).json()["joints"]
    dist_cd = math.hypot(j["D"]["x"] - j["C"]["x"], j["D"]["y"] - j["C"]["y"])
    assert dist_cd == pytest.approx(payload["L3"], rel=1e-9)


# --------------------------------------------------------------------------
# invalid inputs -> HTTP 400
# --------------------------------------------------------------------------
INVALID = [
    # (case id to start from, overrides)
    ("stress-strain-compute", dict(youngs_modulus=0)),
    ("torsion", dict(diameter=0)),
    ("torsion", dict(length=-1)),
    ("axial-constrained", dict(area=0)),
    ("axial-constrained", dict(youngs_modulus=-5)),
    ("axial-two-rod", dict(area_1=0)),
    ("axial-two-rod", dict(youngs_modulus_2=-5)),
    ("shear-bending", dict(length=0)),
    ("shear-bending", dict(position_frac=1.5)),
    ("bending-stress", dict(width=0)),
    ("bending-stress", dict(height=-10)),
    ("beam-deflection", dict(length=0)),
    ("beam-deflection", dict(position_pct=150)),
    ("buckling", dict(end_condition="bogus")),
    ("buckling", dict(length=0)),
    ("buckling", dict(width=-5)),
    ("failure-theories", dict(yield_stress=0)),
    ("failure-theories", dict(yield_stress=-100)),
    ("fatigue", dict(ultimate_strength=0)),
    ("fatigue", dict(endurance_limit=-1)),
    ("fatigue", dict(alternating_stress=-5)),
    ("shaft-design", dict(target_safety_factor=0)),
    ("shaft-design", dict(notch_sensitivity=2)),
    ("shaft-design", dict(stress_concentration_factor=0.5)),
    ("spring-design", dict(wire_diameter=0)),
    ("spring-design", dict(active_coils=-1)),
    ("spring-design", dict(shear_modulus=0)),
    ("bolted-joints", dict(proof_load=0)),
    ("bolted-joints", dict(bolt_stiffness=-1)),
    ("bearing-life", dict(bearing_type="needle")),
    ("bearing-life", dict(applied_load=0)),
    ("bearing-life", dict(mode="bogus")),
    ("bearing-required", dict(target_life_hours=DEL)),
    ("gear-tooth-bending", dict(teeth=5)),
    ("gear-tooth-bending", dict(diametral_pitch=0)),
    ("gear-tooth-bending", dict(face_width=-1)),
    ("belt", dict(driver_diameter=0)),
    ("belt", dict(center_distance=50)),
    ("belt", dict(friction_coefficient=-0.1)),
    ("chain", dict(driver_teeth=5)),
    ("chain", dict(chain_pitch=0)),
    ("particle-kinematics", dict(radius_of_curvature=0)),
    ("particle-kinematics", dict(speed=-5)),
    ("newton-work-energy", dict(mass=0)),
    ("newton-work-energy", dict(friction_coefficient=0)),
    ("newton-work-energy", dict(initial_speed=-1)),
    ("planar-kinematics", dict(radius=0)),
    ("planar-kinematics", dict(radius=-1)),
    ("first-law", dict(mass=0)),
    ("first-law", dict(specific_heat_cv=-1)),
    ("fluid-statics-bernoulli", dict(area2=0)),
    ("fluid-statics-bernoulli", dict(density=0)),
    ("pipe-flow-heat-transfer", dict(diameter=0)),
    ("pipe-flow-heat-transfer", dict(kinematic_viscosity=0)),
    ("4bar-compute", dict(L2=300)),  # crank too long -> mechanism locked
    ("4bar-motion-curve", dict(L1=10, L2=10, L3=10, L4=10)),  # unassemblable -> NaN
    ("rigid-body-kinetics", dict(shape="cube")),
    ("rigid-body-kinetics", dict(incline_angle_deg=90)),
    ("rigid-body-kinetics", dict(radius=0)),
    ("free-vibration", dict(mass=0)),
    ("free-vibration", dict(stiffness=-1)),
    ("forced-vibration", dict(mass=0)),
    ("forced-vibration", dict(damping=-1)),
    ("step-second-order", dict(order=3)),
    ("step-second-order", dict(damping_ratio=-0.5)),
    ("step-first-order", dict(time_constant=0)),
    ("pid-ziegler-nichols", dict(plant_tau=0)),
    ("pid-ziegler-nichols", dict(plant_delay=-1)),
    ("pid-ziegler-nichols", dict(t_end=0)),
    ("root-locus-stable", dict(pole_a=0)),
    ("root-locus-stable", dict(gain=-1)),
    ("bode", dict(gain=0)),
    ("bode", dict(tau1=-1)),
    ("cv-momentum-plate", dict(jet_diameter=0)),
    ("cv-momentum-plate", dict(vane_velocity=30)),
    ("cv-momentum-plate", dict(density=-1)),
    ("viscous-pipe", dict(diameter=DEL)),
    ("viscous-pipe", dict(viscosity=0)),
    ("viscous-couette", dict(gap=DEL)),
    ("boundary-layer", dict(free_stream_velocity=0)),
    ("boundary-layer", dict(plate_length=-1)),
    ("drag-lift-bluff", dict(diameter=DEL)),
    ("drag-lift-bluff", dict(shape="cube")),
    ("drag-lift-wing", dict(wing_area=-1)),
    ("pump-system", dict(rated_head=45)),  # rated head above shutoff head
    ("pump-system", dict(pipe_diameter=0)),
    ("pump-system", dict(rated_flow=-1)),
    ("metal-cutting", dict(cutting_speed=0)),
    ("metal-cutting", dict(taylor_n=0)),
    ("metal-cutting", dict(rake_angle=95)),
    ("material-selection", dict(index="bogus")),
    ("material-selection", dict(reference="unobtainium")),
    ("phase-diagram", dict(carbon=3.0)),
    ("phase-diagram", dict(carbon=0)),
    ("phase-tie-line", dict(overall=9.0)),
    ("phase-tie-line", dict(phase_b_composition=0.022)),
    ("sheet-metal", dict(thickness=0)),
    ("sheet-metal", dict(k_factor=0.6)),
    ("sheet-metal", dict(bend_angle=0)),
    ("tolerance-fit", dict(shaft_letter="zz")),
    ("tolerance-fit", dict(hole_grade=99)),
    ("tolerance-fit", dict(nominal=-5)),
    ("tolerance-stack", dict(dimensions=[])),
    ("tolerance-stack", dict(dimensions=[dict(name="A", nominal=-1, tolerance=0.1, direction=1)])),
    ("tolerance-stack", dict(dimensions=[dict(name="A", nominal=5, tolerance=0.1, direction=0)])),
    ("robotics-fk", dict(l1=0)),
    ("robotics-ik-up", dict(l2=-1)),
    ("robotics-jacobian", dict(l2=-1)),
    ("robotics-motor-gearhead", dict(voltage=0)),
    ("robotics-motor-gearhead", dict(gear_ratio=0)),
    ("robotics-motor-gearhead", dict(gear_efficiency=1.5)),
    ("statics-beam-2d", dict(span=0)),
    ("statics-beam-2d", dict(loads=[dict(magnitude=12, position=9, angle_deg=270)])),
    ("statics-plate-3d", dict(length_a=0)),
    ("statics-plate-3d", dict(load_x=5)),
    ("statics-truss", dict(panels=1)),
    ("statics-truss", dict(load_joint=9)),
    ("statics-truss", dict(span=0)),
    ("statics-friction-incline", dict(weight=-1)),
    ("statics-friction-incline", dict(mu=-0.1)),
    ("statics-friction-wedge", dict(wedge_angle_deg=0)),
    ("statics-friction-wedge", dict(weight=0)),
    ("statics-friction-capstan", dict(mu=-1)),
    ("statics-friction-capstan", dict(load=0)),
    ("statics-centroids", dict(parts=[])),
    ("statics-centroids", dict(parts=[dict(shape="rect", cx=0, cy=0, w=10)])),  # rect without h
    ("statics-centroids", dict(parts=[dict(shape="circle", cx=0, cy=0)])),  # circle without d
    ("second-law", dict(mode="bogus")),
    ("second-law", dict(t_cold=900)),  # cold reservoir hotter than hot
    ("second-law", dict(work=-1)),
    ("rankine", dict(condenser_pressure=9)),
    ("rankine", dict(boiler_pressure=50)),
    ("brayton", dict(pressure_ratio=0.5)),
    ("brayton", dict(inlet_temp=-5)),
    ("conduction-networks", dict(geometry="sphere")),
    ("conduction-networks", dict(conductivities=[1.0, 0.05])),  # length mismatch
    ("conduction-networks", dict(thicknesses=[])),
    ("fin-convective-tip", dict(shape="bogus")),
    ("fin-convective-tip", dict(tip="bogus")),
    ("fin-convective-tip", dict(dim_1=0)),
    ("transient-lumped", dict(shape="cube")),
    ("transient-lumped", dict(dimension=0)),
    ("transient-lumped", dict(h=-1)),
    ("convection-heat-exchangers", dict(arrangement="bogus")),
    ("convection-heat-exchangers", dict(num_tubes=0)),
    ("convection-heat-exchangers", dict(m_cold=0)),
]


def _mutated(case_id, overrides):
    path, payload, _ = CASES[case_id]
    body = dict(payload)
    for k, v in overrides.items():
        if v is DEL:
            body.pop(k, None)
        else:
            body[k] = v
    return path, body


@pytest.mark.parametrize(
    "case_id,overrides",
    INVALID,
    ids=[f"{cid}-{'-'.join(f'{k}={v if v is not DEL else None}' for k, v in ov.items())}"[:70] for cid, ov in INVALID],
)
def test_invalid_input_returns_400(case_id, overrides):
    path, body = _mutated(case_id, overrides)
    r = client.post(path, json=body)
    assert r.status_code == 400, f"{r.status_code}: {r.text[:200]}"
    assert r.json().get("detail") or r.json().get("error")


def test_4bar_motion_curve_unassemblable_message_is_clear():
    r = client.post("/api/4bar-linkage/motion-curve", json=dict(L1=10, L2=10, L3=10, L4=10))
    assert r.status_code == 400
    assert "assembled" in r.json()["error"]  # app-level handler renders HTTPException as {"error": ...}


@pytest.mark.parametrize("path,payload", [
    ("/api/shear-bending/compute", dict(CASES["shear-bending"][1], load_type="bogus")),
    ("/api/viscous-flow/compute", dict(CASES["viscous-pipe"][1], mode="bogus")),
    ("/api/drag-lift/compute", dict(CASES["drag-lift-wing"][1], kind="bogus")),
])
def test_literal_enum_violation_is_rejected_with_422(path, payload):
    assert client.post(path, json=payload).status_code == 422
