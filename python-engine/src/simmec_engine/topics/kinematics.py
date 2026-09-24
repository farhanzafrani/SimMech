"""
Kinematics Module - Mechanism and Motion Analysis
Used by MVP Topic #2: 4-Bar Linkage Kinematics
"""

import numpy as np
from typing import Dict, List, Tuple


def compute_4bar_linkage(
    L1: float,
    L2: float,
    L3: float,
    L4: float,
    theta2_deg: float,
) -> Dict:
    """
    Compute 4-bar linkage mechanism positions and angles.

    Args:
        L1: Ground link (fixed base) length
        L2: Crank length (input link)
        L3: Coupler link length
        L4: Follower link length
        theta2_deg: Input crank angle in degrees

    Returns:
        Dictionary with joint positions, angles, and transmission angle
    """

    theta2 = np.radians(theta2_deg)

    # Joint A is at origin (0, 0)
    # Joint B is at (L1, 0)

    # Position of joint C (end of crank L2)
    C_x = L2 * np.cos(theta2)
    C_y = L2 * np.sin(theta2)

    # Solve for joint D using law of cosines
    # Distance from B to C
    BC_dist = np.sqrt((C_x - L1)**2 + C_y**2)

    # Check if mechanism can reach (assembly condition)
    if BC_dist > L3 + L4 or BC_dist < abs(L3 - L4):
        # Mechanism is locked/can't reach - return last valid position
        return {
            'status': 'locked',
            'message': f'Mechanism cannot reach: BC distance {BC_dist:.3f} outside [{abs(L3-L4):.3f}, {L3+L4:.3f}]'
        }

    # Law of cosines: cos(angle at D in triangle BCD)
    cos_angle_D = (L3**2 + L4**2 - BC_dist**2) / (2 * L3 * L4)
    cos_angle_D = np.clip(cos_angle_D, -1, 1)  # Numerical stability

    # Angle at C between CB and CD
    angle_CB = np.arctan2(C_y - 0, C_x - L1)

    # Angle BCD (law of cosines)
    cos_angle_C = (BC_dist**2 + L3**2 - L4**2) / (2 * BC_dist * L3)
    cos_angle_C = np.clip(cos_angle_C, -1, 1)
    angle_BCD = np.arccos(cos_angle_C)

    # Position of D (follower joint)
    # Two solutions exist; use the one that gives continuous motion (lower solution)
    angle_CD = angle_CB - angle_BCD
    D_x = C_x + L3 * np.cos(angle_CD)
    D_y = C_y + L3 * np.sin(angle_CD)

    # Output angle (angle of L4 from horizontal)
    theta4 = np.arctan2(D_y - 0, D_x - L1)
    theta3 = angle_CD

    # Transmission angle (angle between follower and coupler)
    transmission_angle = abs(theta4 - theta3)
    if transmission_angle > np.pi:
        transmission_angle = 2 * np.pi - transmission_angle
    transmission_angle_deg = np.degrees(transmission_angle)

    # Mechanical advantage (roughly proportional to sin of transmission angle)
    # Perfect transmission at 90°, worst at 0° or 180°
    mechanical_advantage = np.sin(transmission_angle)

    return {
        'status': 'ok',
        'joints': {
            'A': {'x': 0.0, 'y': 0.0},                    # Ground pivot
            'B': {'x': float(L1), 'y': 0.0},              # Ground pivot
            'C': {'x': float(C_x), 'y': float(C_y)},      # Crank end
            'D': {'x': float(D_x), 'y': float(D_y)},      # Follower end
        },
        'angles': {
            'input_theta2': float(np.degrees(theta2)),
            'output_theta4': float(np.degrees(theta4)),
            'coupler_theta3': float(np.degrees(theta3)),
        },
        'performance': {
            'transmission_angle_deg': float(transmission_angle_deg),
            'mechanical_advantage': float(mechanical_advantage),
            'input_crank_speed': 1.0,  # Normalized
            'output_follower_speed': float(mechanical_advantage),
        },
        'links': {
            'L1': float(L1),
            'L2': float(L2),
            'L3': float(L3),
            'L4': float(L4),
        }
    }


def generate_4bar_motion_curve(
    L1: float,
    L2: float,
    L3: float,
    L4: float,
    num_points: int = 100,
) -> Dict:
    """
    Generate motion curve for a complete cycle of the 4-bar linkage.

    Args:
        L1-L4: Link lengths
        num_points: Number of points to sample

    Returns:
        Dictionary with output angle vs input angle curve
    """

    input_angles = np.linspace(0, 360, num_points)
    output_angles = []
    transmission_angles = []
    mechanical_advantages = []

    for angle in input_angles:
        result = compute_4bar_linkage(L1, L2, L3, L4, angle)

        if result['status'] == 'ok':
            output_angles.append(result['angles']['output_theta4'])
            transmission_angles.append(result['performance']['transmission_angle_deg'])
            mechanical_advantages.append(result['performance']['mechanical_advantage'])
        else:
            output_angles.append(None)
            transmission_angles.append(None)
            mechanical_advantages.append(None)

    return {
        'input_angles': input_angles.tolist(),
        'output_angles': output_angles,
        'transmission_angles': transmission_angles,
        'mechanical_advantages': mechanical_advantages,
        'links': {
            'L1': float(L1),
            'L2': float(L2),
            'L3': float(L3),
            'L4': float(L4),
        }
    }


def check_4bar_assembly_modes(L1: float, L2: float, L3: float, L4: float) -> Dict:
    """
    Check if 4-bar linkage can be assembled and what modes are possible.

    Grashof's Law conditions:
    - If s + l <= p + q (where s=shortest, l=longest, p,q=others), the mechanism is GRASHOF
    - Grashof: crank-rocker, double-crank, double-rocker possible
    - Non-Grashof: only double-rocker possible
    """

    links = sorted([L1, L2, L3, L4])
    s = links[0]  # shortest
    l = links[3]  # longest
    p = links[1]
    q = links[2]

    is_grashof = s + l <= p + q

    # Determine which link is ground (L1) and which is input (L2)
    modes = {
        'is_grashof': bool(is_grashof),
        'type': '',
        'description': '',
        'input_capable': False,
        'output_capable': False,
    }

    if is_grashof:
        modes['type'] = 'GRASHOF'
        modes['description'] = 'Shortest link can rotate continuously'

        # If L2 (input) is the shortest, we get a crank-rocker
        if L2 == min([L1, L2, L3, L4]):
            modes['type'] = 'CRANK-ROCKER'
            modes['description'] = 'Input is continuous rotor, output is rocker'
            modes['input_capable'] = True
            modes['output_capable'] = True
        else:
            modes['type'] = 'DOUBLE-CRANK'
            modes['description'] = 'Both input and output rotate continuously'
            modes['input_capable'] = True
            modes['output_capable'] = True
    else:
        modes['type'] = 'NON-GRASHOF (Double-Rocker)'
        modes['description'] = 'Both input and output oscillate only'
        modes['input_capable'] = False
        modes['output_capable'] = False

    return modes
