"""
Robotics Kinematics Module
Used by the Robotics Kinematics & Actuation course (Stanford CS223A /
Modern Robotics / MIT 2.12 style).

Topics: planar 2R forward kinematics and workspace, analytic inverse
kinematics, Jacobian velocity/force mapping and manipulability, rotation
matrices and homogeneous transforms, and DC motor + gearhead sizing.

Angles are in degrees at the API boundary and radians internally.
"""

from typing import Dict, List

import numpy as np


def _wrap_deg(a: float) -> float:
    """Wrap an angle in degrees to (-180, 180]"""
    w = (a + 180.0) % 360.0 - 180.0
    return 180.0 if w == -180.0 else w


def _check_links(l1: float, l2: float) -> None:
    if l1 <= 0 or l2 <= 0:
        raise ValueError("Link lengths must be positive")


# ---------------------------------------------------------------------------
# 1. Planar 2R forward kinematics & workspace
# ---------------------------------------------------------------------------

def compute_forward_kinematics_2r(
    l1: float, l2: float, theta1_deg: float, theta2_deg: float
) -> Dict:
    """
    Forward kinematics of a planar 2R arm.

    x = L1 cos(t1) + L2 cos(t1 + t2),  y = L1 sin(t1) + L2 sin(t1 + t2)

    Also returns the reachable workspace (an annulus for unlimited joints):
    r_min = |L1 - L2|, r_max = L1 + L2, plus a sampled boundary for plotting.
    """
    _check_links(l1, l2)

    t1 = np.radians(theta1_deg)
    t2 = np.radians(theta2_deg)

    elbow = (l1 * np.cos(t1), l1 * np.sin(t1))
    tip = (elbow[0] + l2 * np.cos(t1 + t2), elbow[1] + l2 * np.sin(t1 + t2))

    reach = float(np.hypot(*tip))
    r_min = abs(l1 - l2)
    r_max = l1 + l2

    ang = np.linspace(0, 2 * np.pi, 73)
    outer = np.column_stack([r_max * np.cos(ang), r_max * np.sin(ang)])
    inner = np.column_stack([r_min * np.cos(ang), r_min * np.sin(ang)])

    return {
        'l1': l1,
        'l2': l2,
        'theta1': theta1_deg,
        'theta2': theta2_deg,
        'elbow': [float(elbow[0]), float(elbow[1])],
        'end_effector': [float(tip[0]), float(tip[1])],
        'orientation_deg': float(_wrap_deg(theta1_deg + theta2_deg)),
        'reach': reach,
        'r_min': float(r_min),
        'r_max': float(r_max),
        'workspace_outer': outer.tolist(),
        'workspace_inner': inner.tolist(),
        'workspace_area': float(np.pi * (r_max**2 - r_min**2)),
    }


# ---------------------------------------------------------------------------
# 2. Inverse kinematics (analytic 2R)
# ---------------------------------------------------------------------------

def compute_inverse_kinematics_2r(
    l1: float, l2: float, x: float, y: float, elbow_up: bool = True
) -> Dict:
    """
    Analytic inverse kinematics of a planar 2R arm (law of cosines).

    c2 = (x^2 + y^2 - L1^2 - L2^2) / (2 L1 L2)
    t2 = +/- acos(c2)   (elbow-down is +, elbow-up is -)
    t1 = atan2(y, x) - atan2(L2 sin t2, L1 + L2 cos t2)

    An unreachable target (|c2| > 1) is not an exception: it is reported via
    `reachable` so the playground can show the student where the arm stops.
    """
    _check_links(l1, l2)

    r2 = x * x + y * y
    r = float(np.sqrt(r2))
    r_min = abs(l1 - l2)
    r_max = l1 + l2

    c2 = (r2 - l1**2 - l2**2) / (2 * l1 * l2)
    reachable = bool(abs(c2) <= 1.0 + 1e-12)

    base = {
        'l1': l1, 'l2': l2, 'x': x, 'y': y,
        'target_distance': r,
        'r_min': float(r_min), 'r_max': float(r_max),
        'cos_theta2': float(c2),
        'reachable': reachable,
    }

    if not reachable:
        # Closest reachable point on the workspace boundary along the same ray
        r_clamp = r_max if r > r_max else r_min
        if r > 0:
            cx, cy = x * r_clamp / r, y * r_clamp / r
        else:
            cx, cy = r_clamp, 0.0
        base.update({
            'solutions': [],
            'selected': None,
            'closest_point': [float(cx), float(cy)],
            'singular': False,
            'jacobian_det': None,
            'verification_error': None,
        })
        return base

    c2 = float(np.clip(c2, -1.0, 1.0))
    t2_mag = float(np.arccos(c2))

    solutions: List[Dict] = []
    for label, t2 in (('elbow-down', t2_mag), ('elbow-up', -t2_mag)):
        t1 = np.arctan2(y, x) - np.arctan2(l2 * np.sin(t2), l1 + l2 * np.cos(t2))
        # Round-trip through forward kinematics as a check
        fx = l1 * np.cos(t1) + l2 * np.cos(t1 + t2)
        fy = l1 * np.sin(t1) + l2 * np.sin(t1 + t2)
        solutions.append({
            'label': label,
            'theta1': float(_wrap_deg(np.degrees(t1))),
            'theta2': float(_wrap_deg(np.degrees(t2))),
            'elbow': [float(l1 * np.cos(t1)), float(l1 * np.sin(t1))],
            'fk_error': float(np.hypot(fx - x, fy - y)),
        })

    # Elbow-up and elbow-down coincide when theta2 = 0 or pi (singular).
    selected = solutions[1] if elbow_up else solutions[0]
    sin_t2 = float(np.sqrt(max(0.0, 1.0 - c2 * c2)))
    jac_det = float(l1 * l2 * sin_t2)

    base.update({
        'solutions': solutions,
        'selected': selected,
        'closest_point': None,
        'singular': bool(sin_t2 < 0.05),
        'jacobian_det': jac_det,
        'verification_error': selected['fk_error'],
    })
    return base


# ---------------------------------------------------------------------------
# 3. Jacobian, velocity / force mapping, manipulability
# ---------------------------------------------------------------------------

def compute_jacobian_2r(
    l1: float, l2: float, theta1_deg: float, theta2_deg: float,
    qdot1: float, qdot2: float, fx: float, fy: float,
) -> Dict:
    """
    Jacobian of the planar 2R arm.

    v = J qdot,   tau = J^T F,   w = |det J| = L1 L2 |sin t2|

    Velocity ellipse: axes are the singular values of J, along the
    left singular vectors. Condition number sigma_max / sigma_min.
    """
    _check_links(l1, l2)

    t1 = np.radians(theta1_deg)
    t12 = np.radians(theta1_deg + theta2_deg)

    J = np.array([
        [-l1 * np.sin(t1) - l2 * np.sin(t12), -l2 * np.sin(t12)],
        [l1 * np.cos(t1) + l2 * np.cos(t12), l2 * np.cos(t12)],
    ])

    qdot = np.array([qdot1, qdot2], dtype=float)
    force = np.array([fx, fy], dtype=float)

    v = J @ qdot
    tau = J.T @ force

    U, S, _ = np.linalg.svd(J)
    det = float(np.linalg.det(J))
    sigma_max, sigma_min = float(S[0]), float(S[1])
    # Condition number is infinite at a singular configuration
    cond = float(sigma_max / sigma_min) if sigma_min > 1e-9 else None

    elbow = [l1 * np.cos(t1), l1 * np.sin(t1)]
    tip = [elbow[0] + l2 * np.cos(t12), elbow[1] + l2 * np.sin(t12)]

    return {
        'l1': l1, 'l2': l2, 'theta1': theta1_deg, 'theta2': theta2_deg,
        'jacobian': J.tolist(),
        'elbow': [float(e) for e in elbow],
        'end_effector': [float(t) for t in tip],
        'tip_velocity': [float(v[0]), float(v[1])],
        'tip_speed': float(np.hypot(*v)),
        'joint_torques': [float(tau[0]), float(tau[1])],
        'determinant': det,
        'manipulability': float(abs(det)),
        'max_manipulability': float(l1 * l2),
        'sigma_max': sigma_max,
        'sigma_min': sigma_min,
        'condition_number': cond,
        'ellipse_axis_dir_deg': float(np.degrees(np.arctan2(U[1, 0], U[0, 0]))),
        'is_near_singular': bool(abs(np.sin(np.radians(theta2_deg))) < 0.1),
    }


# ---------------------------------------------------------------------------
# 4. Rotation matrices & homogeneous transforms
# ---------------------------------------------------------------------------

def _rot_x(a: float) -> np.ndarray:
    c, s = np.cos(a), np.sin(a)
    return np.array([[1, 0, 0], [0, c, -s], [0, s, c]])


def _rot_y(a: float) -> np.ndarray:
    c, s = np.cos(a), np.sin(a)
    return np.array([[c, 0, s], [0, 1, 0], [-s, 0, c]])


def _rot_z(a: float) -> np.ndarray:
    c, s = np.cos(a), np.sin(a)
    return np.array([[c, -s, 0], [s, c, 0], [0, 0, 1]])


def compute_homogeneous_transform(
    roll_deg: float, pitch_deg: float, yaw_deg: float,
    tx: float, ty: float, tz: float,
    px: float, py: float, pz: float,
) -> Dict:
    """
    Pose of frame {B} in frame {A} as R = Rz(yaw) Ry(pitch) Rx(roll) and a
    translation p. A point p_B given in {B} maps to {A} by
    p_A = R p_B + p, i.e. the 4x4 homogeneous transform T = [[R, p], [0, 1]].

    Returns T, T^-1 = [[R^T, -R^T p], [0, 1]], the axis-angle form of R, and
    orthonormality checks (R^T R = I, det R = +1).
    """
    R = _rot_z(np.radians(yaw_deg)) @ _rot_y(np.radians(pitch_deg)) @ _rot_x(np.radians(roll_deg))
    p = np.array([tx, ty, tz], dtype=float)

    T = np.eye(4)
    T[:3, :3] = R
    T[:3, 3] = p
    T_inv = np.eye(4)
    T_inv[:3, :3] = R.T
    T_inv[:3, 3] = -R.T @ p

    pb = np.array([px, py, pz], dtype=float)
    pa = R @ pb + p
    back = R.T @ (pa - p)

    trace = float(np.trace(R))
    angle = float(np.arccos(np.clip((trace - 1.0) / 2.0, -1.0, 1.0)))
    if angle < 1e-9:
        axis = [0.0, 0.0, 1.0]  # identity rotation: axis is arbitrary
    elif abs(angle - np.pi) < 1e-6:
        # Axis from the symmetric part: R = 2 n n^T - I at 180 degrees
        n = np.sqrt(np.maximum((np.diag(R) + 1.0) / 2.0, 0.0))
        k = int(np.argmax(n))
        n = n.copy()
        for i in range(3):
            if i != k:
                n[i] = np.copysign(n[i], R[k, i] + R[i, k])
        axis = (n / np.linalg.norm(n)).tolist()
    else:
        w = np.array([R[2, 1] - R[1, 2], R[0, 2] - R[2, 0], R[1, 0] - R[0, 1]])
        axis = (w / (2.0 * np.sin(angle))).tolist()

    return {
        'rotation': R.tolist(),
        'translation': p.tolist(),
        'transform': T.tolist(),
        'transform_inverse': T_inv.tolist(),
        'point_in_b': pb.tolist(),
        'point_in_a': pa.tolist(),
        'point_round_trip_error': float(np.linalg.norm(back - pb)),
        'determinant': float(np.linalg.det(R)),
        'orthonormality_error': float(np.linalg.norm(R.T @ R - np.eye(3))),
        'trace': trace,
        'axis_angle_deg': float(np.degrees(angle)),
        'axis': [float(a) for a in axis],
        'x_axis_of_b': R[:, 0].tolist(),
        'y_axis_of_b': R[:, 1].tolist(),
        'z_axis_of_b': R[:, 2].tolist(),
        # Pitch of +/-90 deg locks two axes together (Euler-angle gimbal lock)
        'gimbal_lock': bool(abs(abs(pitch_deg) % 180.0 - 90.0) < 1.0),
    }


# ---------------------------------------------------------------------------
# 5. DC motor + gearhead sizing
# ---------------------------------------------------------------------------

def compute_motor_gearhead(
    voltage: float, resistance: float, torque_constant: float,
    rotor_inertia: float, gear_ratio: float, gear_efficiency: float,
    load_inertia: float, load_torque: float, load_speed: float,
) -> Dict:
    """
    Permanent-magnet DC motor behind a gearhead (SI units throughout).

    Motor:  tau_stall = kt V / R,  w_noload = V / kt (kt = ke in SI)
            tau_m(w) = tau_stall (1 - w / w_noload)   (linear torque-speed line)
    Gear N: output shaft sees N*eta*tau_m at speed w_m / N.
    Inertia reflected to the motor shaft: J_ref = J_m + J_L / N^2
    (best acceleration when N = sqrt(J_L / J_m), inertia matching).

    Operating point: the load wants `load_torque` (N*m) at `load_speed`
    (rad/s) on the output shaft. The motor must supply
    tau_req = load_torque / (N eta) at w_m = N * load_speed. The spare torque
    accelerates the reflected inertia: alpha_m = (tau_avail - tau_req)/J_ref.
    """
    if voltage <= 0:
        raise ValueError("Supply voltage must be positive")
    if resistance <= 0:
        raise ValueError("Winding resistance must be positive")
    if torque_constant <= 0:
        raise ValueError("Torque constant must be positive")
    if rotor_inertia <= 0:
        raise ValueError("Rotor inertia must be positive")
    if gear_ratio < 1:
        raise ValueError("Gear ratio must be at least 1")
    if not 0 < gear_efficiency <= 1:
        raise ValueError("Gear efficiency must be in (0, 1]")
    if load_inertia < 0:
        raise ValueError("Load inertia must be non-negative")
    if load_torque < 0 or load_speed < 0:
        raise ValueError("Load torque and speed must be non-negative")

    n, eta = gear_ratio, gear_efficiency

    tau_stall = torque_constant * voltage / resistance
    w_noload = voltage / torque_constant
    i_stall = voltage / resistance

    # Torque-speed lines referred to the output shaft
    out_stall = n * eta * tau_stall
    out_noload = w_noload / n

    w_motor = n * load_speed
    tau_avail = tau_stall * (1.0 - w_motor / w_noload)
    tau_req = load_torque / (n * eta)

    speed_feasible = w_motor < w_noload
    torque_feasible = speed_feasible and tau_req <= tau_avail

    j_ref = rotor_inertia + load_inertia / n**2
    alpha_motor = (tau_avail - tau_req) / j_ref if speed_feasible else None
    alpha_load = alpha_motor / n if alpha_motor is not None else None

    current = tau_req / torque_constant
    n_opt = float(np.sqrt(load_inertia / rotor_inertia)) if load_inertia > 0 else 1.0

    # Motor mechanical power peaks at half stall torque / half no-load speed;
    # the gearhead delivers eta of it to the output shaft
    peak_power = tau_stall * w_noload / 4.0

    s = np.linspace(0.0, 1.0, 41)
    curve = [{
        'speed': float(w_noload / n * f),
        'torque': float(out_stall * (1.0 - f)),
        'power': float(out_stall * (1.0 - f) * w_noload / n * f),
    } for f in s]

    return {
        'stall_torque': float(tau_stall),
        'no_load_speed': float(w_noload),
        'no_load_speed_rpm': float(w_noload * 60.0 / (2 * np.pi)),
        'stall_current': float(i_stall),
        'output_stall_torque': float(out_stall),
        'output_no_load_speed': float(out_noload),
        'output_no_load_speed_rpm': float(out_noload * 60.0 / (2 * np.pi)),
        'motor_speed_at_load': float(w_motor),
        'torque_required': float(tau_req),
        'torque_available': float(tau_avail),
        'current_required': float(current),
        'reflected_inertia': float(j_ref),
        'load_inertia_reflected': float(load_inertia / n**2),
        'optimal_gear_ratio': n_opt,
        'load_acceleration': None if alpha_load is None else float(alpha_load),
        'speed_feasible': bool(speed_feasible),
        'torque_feasible': bool(torque_feasible),
        'peak_output_power': float(peak_power * eta),
        'curve': curve,
        'operating_point': {'speed': float(load_speed), 'torque': float(load_torque)},
    }
