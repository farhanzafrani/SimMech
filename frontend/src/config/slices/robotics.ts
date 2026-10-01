/**
 * Robotics Kinematics & Actuation - new course slice.
 * Styled after Stanford CS223A, Modern Robotics (Lynch & Park) and MIT 2.12.
 * All worked-example numbers were verified against simmec_engine.topics.robotics_kinematics.
 */

import type { CourseMeta, TopicMeta } from '../curriculum'

const ASADA = 'https://ocw.mit.edu/courses/2-12-introduction-to-robotics-fall-2005/resources'
const CS223A = 'https://see.stanford.edu/materials/aiircs223a/transcripts'
const MR_BOOK = 'https://hades.mech.northwestern.edu/images/7/7f/MR.pdf'

export const NEW_COURSES: CourseMeta[] = [
  {
    id: 'robotics-kinematics',
    code: 'CS223A / 2.12',
    title: 'Robotics: Kinematics & Actuation',
    symbol: 'v = J q̇',
    category: 'Robotics & mechatronics',
    description: 'How a robot arm moves and what drives it: joint angles to tip position and back, velocity and force mapping, frames and transforms, and sizing the motor behind each joint.',
    prerequisites: ['Linear algebra', 'Calculus I–II', 'Engineering Statics'],
    references: [
      { label: 'Stanford Engineering Everywhere — CS223A Introduction to Robotics (Khatib)', url: 'https://see.stanford.edu/Course/CS223A' },
      { label: 'MIT OCW — 2.12 Introduction to Robotics (Fall 2005, Asada)', url: 'https://ocw.mit.edu/courses/2-12-introduction-to-robotics-fall-2005/' },
      { label: 'Coursera — Modern Robotics: Mechanics, Planning, and Control (Lynch & Park)', url: 'https://www.coursera.org/specializations/modernrobotics' },
      { label: 'Modern Robotics book, preprint PDF (Northwestern)', url: MR_BOOK },
    ],
    topics: [
      {
        id: 'forward-kinematics-2r',
        title: 'Planar 2-Link Forward Kinematics & Workspace',
        duration: '14m',
        level: 'Beginner',
        summary: 'Turn two joint angles into a tip position, and see the ring-shaped region the arm can reach.',
        description:
          'Forward kinematics answers the simplest robot question: given the joint angles, where is the hand? For a two-link planar arm the answer is just two chained vectors, one per link, each rotated by the sum of the joint angles up to that point. Because the joints can swing freely, the set of points the tip can reach is not a disc but a ring: the arm can never reach closer to its base than |L₁ − L₂|, nor farther than L₁ + L₂.',
        status: 'active',
        learningObjectives: [
          'Compute the tip position and orientation of a planar 2R arm from its joint angles',
          'Explain why the second link’s direction depends on the sum θ₁ + θ₂, not on θ₂ alone',
          'Find the inner and outer radii of the reachable workspace from the link lengths',
        ],
        formulas: [
          { label: 'Tip position', formula: 'x = L₁cosθ₁ + L₂cos(θ₁+θ₂),  y = L₁sinθ₁ + L₂sin(θ₁+θ₂)', latex: 'x = L_1\\cos\\theta_1 + L_2\\cos(\\theta_1+\\theta_2),\\quad y = L_1\\sin\\theta_1 + L_2\\sin(\\theta_1+\\theta_2)', note: 'Each link is a vector of length L at an absolute angle equal to the sum of the joint angles so far.', emphasis: true },
          { label: 'Tip orientation', formula: 'φ = θ₁ + θ₂', latex: '\\varphi = \\theta_1 + \\theta_2', note: 'The direction the last link points, measured from the x-axis.' },
          { label: 'Workspace radii', formula: 'r_max = L₁ + L₂,  r_min = |L₁ − L₂|', latex: 'r_{max} = L_1 + L_2,\\quad r_{min} = |L_1 - L_2|', note: 'Fully stretched out and fully folded back. If L₁ = L₂ the inner hole shrinks to a point.' },
        ],
        workedExample: {
          given: 'A planar 2R arm with L₁ = 0.5 m and L₂ = 0.3 m, joint angles θ₁ = 30° and θ₂ = 45°.',
          find: 'The tip position, its orientation, and the workspace radii.',
          steps: [
            'Elbow: (L₁cos30°, L₁sin30°) = (0.4330, 0.2500) m',
            'Second link points at θ₁ + θ₂ = 75°: (L₂cos75°, L₂sin75°) = (0.0776, 0.2898) m',
            'Tip = elbow + second link = (0.4330 + 0.0776, 0.2500 + 0.2898) = (0.511, 0.540) m',
            'Orientation φ = 30° + 45° = 75°; distance from base = √(0.511² + 0.540²) ≈ 0.743 m',
            'Workspace: r_max = 0.5 + 0.3 = 0.8 m, r_min = |0.5 − 0.3| = 0.2 m, so 0.743 m is inside the ring',
          ],
          answer: 'The tip sits at about (0.511, 0.540) m, pointing at 75°, and can reach any point between 0.2 m and 0.8 m from the base.',
        },
        challenges: [
          'Set θ₂ = 0 and then θ₂ = 180°. Where is the tip relative to the workspace boundary in each case, and what do they have in common?',
          'Make L₁ = L₂. What happens to the inner radius, and what new capability does the arm gain at the base?',
          'Hold θ₁ + θ₂ constant while changing θ₁. What stays fixed about the tip, and what moves?',
        ],
        applications: [
          'Placing the gripper of a SCARA pick-and-place robot over a conveyor part',
          'Computing the position of a camera or crane boom tip from its joint encoders',
          'Checking whether a workstation layout fits inside a robot’s reachable ring',
        ],
        references: [
          { label: 'MIT 2.12 (Asada) — Chapter 4: Planar Kinematics', url: `${ASADA}/chapter4/` },
          { label: 'Stanford CS223A — Lecture 4 transcript (forward kinematics)', url: `${CS223A}/IntroductionToRobotics-Lecture04.html` },
          { label: 'Modern Robotics (Lynch & Park) — Ch. 4 Forward Kinematics, preprint', url: MR_BOOK },
        ],
      },
      {
        id: 'inverse-kinematics-2r',
        title: 'Inverse Kinematics: Analytic 2R & Singularities',
        duration: '16m',
        level: 'Intermediate',
        summary: 'Solve for the joint angles that put the tip at a chosen point, and learn why there are two answers, or none.',
        description:
          'Inverse kinematics runs the arm backward: the task says where the hand must go, and you need the joint angles. For a 2R arm the law of cosines on the triangle formed by the two links and the base-to-target line gives θ₂ in closed form. Because cosine does not tell the sign of an angle, there are generally two solutions, elbow-up and elbow-down. When the target is outside the workspace there is no solution, and when the arm is fully stretched or folded the two solutions merge into one, which is a singularity.',
        status: 'active',
        learningObjectives: [
          'Derive θ₂ from the law of cosines and then solve for θ₁',
          'Tell whether a target is reachable from the value of cosθ₂',
          'Recognize elbow-up and elbow-down branches and the singularity where they coincide',
        ],
        formulas: [
          { label: 'Elbow angle', formula: 'cosθ₂ = (x² + y² − L₁² − L₂²) / (2 L₁ L₂)', latex: '\\cos\\theta_2 = \\frac{x^2 + y^2 - L_1^2 - L_2^2}{2 L_1 L_2}', note: 'The target is reachable only if |cosθ₂| ≤ 1. The two signs of θ₂ are the two elbow branches.', emphasis: true },
          { label: 'Shoulder angle', formula: 'θ₁ = atan2(y, x) − atan2(L₂ sinθ₂, L₁ + L₂ cosθ₂)', latex: '\\theta_1 = \\operatorname{atan2}(y,x) - \\operatorname{atan2}(L_2\\sin\\theta_2,\; L_1 + L_2\\cos\\theta_2)', note: 'Aim at the target, then subtract the angle the second link adds.' },
          { label: 'Singularity test', formula: 'det J = L₁ L₂ sinθ₂ = 0', latex: '\\det J = L_1 L_2 \\sin\\theta_2 = 0', note: 'Happens at θ₂ = 0 (stretched) or 180° (folded), i.e. on the workspace boundary.' },
        ],
        workedExample: {
          given: 'L₁ = 0.5 m, L₂ = 0.3 m, target (x, y) = (0.4, 0.4) m.',
          find: 'Both joint-angle solutions.',
          steps: [
            'x² + y² = 0.32, so cosθ₂ = (0.32 − 0.25 − 0.09) / (2·0.5·0.3) = −0.0667',
            'θ₂ = ±acos(−0.0667) = ±93.82°',
            'Elbow-down (θ₂ = +93.82°): atan2(0.4, 0.4) = 45°; atan2(0.3·sin93.82°, 0.5 + 0.3·cos93.82°) = atan2(0.2993, 0.4800) = 31.95°; θ₁ = 45° − 31.95° = 13.05°',
            'Elbow-up (θ₂ = −93.82°): the second atan2 flips sign, so θ₁ = 45° + 31.95° = 76.95°',
            'Check with forward kinematics: both solutions return (0.400, 0.400) to rounding error',
          ],
          answer: 'Elbow-down (θ₁, θ₂) = (13.05°, 93.82°); elbow-up (θ₁, θ₂) = (76.95°, −93.82°).',
        },
        challenges: [
          'Drag the target toward the outer circle of the workspace. How do the two solutions change, and what happens to det J?',
          'Move the target just outside the workspace. What does cosθ₂ do, and what would a real controller have to do instead?',
          'Place the target at the base. For L₁ = L₂ how many solutions are there?',
        ],
        applications: [
          'Converting a Cartesian path from a CAD/CAM program into joint commands for a SCARA or delta robot',
          'Choosing an elbow configuration that avoids obstacles in a cluttered workcell',
          'Detecting unreachable pick points before sending a move to a collaborative robot',
        ],
        references: [
          { label: 'MIT 2.12 (Asada) — Chapter 4: Planar Kinematics', url: `${ASADA}/chapter4/` },
          { label: 'Modern Robotics (Lynch & Park) — Ch. 6 Inverse Kinematics, preprint', url: MR_BOOK },
        ],
      },
      {
        id: 'jacobian-manipulability',
        title: 'Jacobian, Velocity/Force Mapping & Manipulability',
        duration: '18m',
        level: 'Intermediate',
        summary: 'The same matrix maps joint speeds to tip speed and tip force to joint torques, and its shape tells you how close you are to a singularity.',
        description:
          'Differentiate the forward kinematics and you get the Jacobian J: the matrix that converts joint velocities into tip velocity. By the principle of virtual work, its transpose does the opposite job for forces, converting a force at the tip into the joint torques that hold it. Looking at J through its singular values gives the manipulability ellipse: where the ellipse is fat the arm can move in any direction, and where it collapses to a line the arm has lost a degree of freedom.',
        status: 'active',
        learningObjectives: [
          'Build the 2×2 Jacobian of a planar 2R arm and use it to find tip velocity',
          'Use τ = Jᵀ F to find the joint torques needed to push with a given tip force',
          'Interpret determinant, singular values, and the manipulability ellipse near a singularity',
        ],
        formulas: [
          { label: 'Jacobian', formula: 'J = [[−L₁s₁ − L₂s₁₂, −L₂s₁₂], [L₁c₁ + L₂c₁₂, L₂c₁₂]]', latex: 'J = \\begin{bmatrix} -L_1 s_1 - L_2 s_{12} & -L_2 s_{12} \\\\ L_1 c_1 + L_2 c_{12} & L_2 c_{12} \\end{bmatrix}', note: 's₁ = sinθ₁, s₁₂ = sin(θ₁+θ₂), and similarly for cosine.', emphasis: true },
          { label: 'Velocity mapping', formula: 'v = J q̇', latex: 'v = J\\,\\dot q', note: 'Tip velocity from joint rates.' },
          { label: 'Force mapping', formula: 'τ = Jᵀ F', latex: '\\tau = J^{T} F', note: 'Joint torques that statically balance a tip force F (from virtual work).' },
          { label: 'Manipulability', formula: 'w = |det J| = L₁ L₂ |sinθ₂|', latex: 'w = |\\det J| = L_1 L_2 |\\sin\\theta_2|', note: 'Equals the product of the singular values; zero at a singularity, largest at θ₂ = ±90°.' },
        ],
        workedExample: {
          given: 'L₁ = 0.5 m, L₂ = 0.3 m, θ₁ = 30°, θ₂ = 45°. Joint rates q̇ = (1.0, 0.5) rad/s. Tip force F = (10, 0) N.',
          find: 'Tip velocity, joint torques, and manipulability.',
          steps: [
            'With θ₁ + θ₂ = 75°: J = [[−0.5398, −0.2898], [0.5107, 0.0776]]',
            'v = J q̇ = (−0.5398·1.0 − 0.2898·0.5, 0.5107·1.0 + 0.0776·0.5) = (−0.685, 0.549) m/s',
            'τ = Jᵀ F = (−0.5398·10 + 0.5107·0, −0.2898·10 + 0.0776·0) = (−5.40, −2.90) N·m',
            'det J = L₁L₂ sin45° = 0.15 × 0.7071 = 0.1061, versus a maximum of L₁L₂ = 0.15',
            'Singular values of J are 0.790 and 0.134, so the condition number is about 5.9',
          ],
          answer: 'The tip moves at (−0.685, 0.549) m/s, holding a 10 N push in +x needs joint torques (−5.40, −2.90) N·m, and manipulability is 0.106, about 71% of its best value.',
        },
        challenges: [
          'Sweep θ₂ toward 0°. Watch the ellipse collapse: which direction of tip motion becomes impossible?',
          'With the arm nearly stretched, apply a force along the arm. How large are the joint torques, and why can a singular pose hold large loads?',
          'Find the θ₂ that maximizes manipulability. Is it the same for every L₁ and L₂?',
        ],
        applications: [
          'Resolved-rate control: moving the tip at a commanded Cartesian speed by solving q̇ = J⁻¹ v',
          'Sizing joint motors for the forces a robot must exert on a workpiece, as in polishing or insertion',
          'Planning paths that keep a robot away from singular poses where joint speeds blow up',
        ],
        references: [
          { label: 'MIT 2.12 (Asada) — Chapter 5: Differential Motion', url: `${ASADA}/chapter5/` },
          { label: 'MIT 2.12 (Asada) — Chapter 6: Statics', url: `${ASADA}/chapter6/` },
          { label: 'Stanford CS223A — Lecture 6 transcript (Jacobian)', url: `${CS223A}/IntroductionToRobotics-Lecture06.html` },
          { label: 'Modern Robotics (Lynch & Park) — Ch. 5 Velocity Kinematics and Statics, preprint', url: MR_BOOK },
        ],
      },
      {
        id: 'rotation-homogeneous-transforms',
        title: 'Rotation Matrices & Homogeneous Transforms',
        duration: '17m',
        level: 'Intermediate',
        summary: 'Describe where one coordinate frame sits relative to another, and move points between frames with a single 4×4 matrix.',
        description:
          'Every robot is a chain of coordinate frames. A rotation matrix holds the axes of one frame written in another, so its columns are orthonormal and its determinant is +1. Adding a translation turns it into a 4×4 homogeneous transform, which lets you map a point from frame {B} into frame {A} with a single matrix multiply, and chain frames by multiplying transforms. Rotations about different axes do not commute, and describing them with three Euler angles has a trap: at pitch ±90° two axes line up and a degree of freedom is lost (gimbal lock).',
        status: 'active',
        learningObjectives: [
          'Build a rotation matrix from yaw, pitch, and roll and verify RᵀR = I and det R = +1',
          'Assemble a 4×4 homogeneous transform and use it to map a point between frames',
          'Invert a rigid-body transform without a general matrix inverse, and extract axis and angle from R',
        ],
        formulas: [
          { label: 'Rotation about z', formula: 'Rz(α) = [[cosα, −sinα, 0], [sinα, cosα, 0], [0, 0, 1]]', latex: 'R_z(\\alpha) = \\begin{bmatrix} \\cos\\alpha & -\\sin\\alpha & 0 \\\\ \\sin\\alpha & \\cos\\alpha & 0 \\\\ 0 & 0 & 1 \\end{bmatrix}', note: 'Ry and Rx are the same pattern with the 1 in a different slot. Composite ZYX: R = Rz(yaw) Ry(pitch) Rx(roll).', emphasis: true },
          { label: 'Point transformation', formula: 'ᴬp = R ᴮp + t', latex: '{}^{A}p = R\\,{}^{B}p + t', note: 'Rotate the point into the orientation of {A}, then add the origin offset of {B}.' },
          { label: 'Homogeneous transform', formula: 'T = [[R, t], [0, 1]]', latex: 'T = \\begin{bmatrix} R & t \\\\ 0 & 1 \\end{bmatrix}', note: 'Then [ᴬp; 1] = T [ᴮp; 1], and chains of frames multiply: T_AC = T_AB T_BC.' },
          { label: 'Inverse transform', formula: 'T⁻¹ = [[Rᵀ, −Rᵀt], [0, 1]]', latex: 'T^{-1} = \\begin{bmatrix} R^{T} & -R^{T}t \\\\ 0 & 1 \\end{bmatrix}', note: 'The inverse of a rotation is its transpose, so no general matrix inversion is needed.' },
          { label: 'Rotation angle', formula: 'cosθ = (tr R − 1) / 2', latex: '\\cos\\theta = \\frac{\\operatorname{tr}R - 1}{2}', note: 'Euler’s theorem: every rotation is a single turn by θ about some axis.' },
        ],
        workedExample: {
          given: 'Frame {B} is rotated 90° about z relative to {A} and its origin is at t = (1, 2, 0) m in {A}. A point has coordinates ᴮp = (1, 0, 0) m in {B}.',
          find: 'ᴬp, the full transform T, and the rotation angle.',
          steps: [
            'Rz(90°) = [[0, −1, 0], [1, 0, 0], [0, 0, 1]] (cos90° = 0, sin90° = 1)',
            'R ᴮp = (0·1, 1·1, 0) = (0, 1, 0)',
            'ᴬp = R ᴮp + t = (0, 1, 0) + (1, 2, 0) = (1, 3, 0) m',
            'T = [[0, −1, 0, 1], [1, 0, 0, 2], [0, 0, 1, 0], [0, 0, 0, 1]]',
            'tr R = 0 + 0 + 1 = 1, so cosθ = 0 and θ = 90° about the z-axis',
          ],
          answer: 'The point is at (1, 3, 0) m in frame {A}, and R is a 90° rotation about z.',
        },
        challenges: [
          'Set yaw = 90° and roll = 90° in turn, then swap the order mentally. Do you get the same final orientation? What does that say about composing rotations?',
          'Push pitch to ±90°. Change roll and yaw and compare the resulting rotation matrices. What is lost?',
          'Set the point to ᴮp = (0, 0, 0). Where does it land in {A}, and why?',
        ],
        applications: [
          'Expressing a camera-detected part in the robot base frame (hand-eye calibration)',
          'Chaining link frames from base to tool in a robot’s kinematic model',
          'Fusing IMU orientation into a drone or mobile robot’s pose estimate',
        ],
        references: [
          { label: 'Stanford CS223A — Lecture 2 transcript (spatial descriptions, rotation matrices)', url: `${CS223A}/IntroductionToRobotics-Lecture02.html` },
          { label: 'Stanford CS223A — Lecture 3 transcript (homogeneous transformations)', url: `${CS223A}/IntroductionToRobotics-Lecture03.html` },
          { label: 'Modern Robotics (Lynch & Park) — Ch. 3 Rigid-Body Motions, preprint', url: MR_BOOK },
        ],
      },
      {
        id: 'dc-motor-gearhead-sizing',
        title: 'DC Motor + Gearhead Sizing',
        duration: '18m',
        level: 'Advanced',
        summary: 'Read a motor’s torque-speed line, put a gearhead in front of it, and check that the load point is reachable with enough inertia margin.',
        description:
          'A permanent-magnet DC motor has a straight torque-speed line: maximum torque at stall, zero torque at its no-load speed. A gearhead trades speed for torque, scaling the line to N times the torque at 1/N the speed, minus efficiency losses. It also changes how the load inertia feels: reflected to the motor shaft it shrinks by N², so a large ratio makes even a heavy arm look light. Sizing a joint means checking the required load point sits under the line and choosing N so the reflected load inertia is comparable to the rotor inertia.',
        status: 'active',
        learningObjectives: [
          'Derive stall torque and no-load speed from V, R, and the torque constant',
          'Refer a load torque and speed to the motor shaft through a gear ratio and efficiency',
          'Compute reflected inertia and explain the inertia-matching ratio N = √(J_L / Jₘ)',
        ],
        formulas: [
          { label: 'Motor extremes', formula: 'τ_stall = kₜV / R,  ω₀ = V / kₜ', latex: '\\tau_{stall} = \\frac{k_t V}{R},\\quad \\omega_0 = \\frac{V}{k_t}', note: 'In SI units the torque constant kₜ (N·m/A) equals the back-EMF constant (V·s/rad).', emphasis: true },
          { label: 'Torque-speed line', formula: 'τₘ(ω) = τ_stall (1 − ω / ω₀)', latex: '\\tau_m(\\omega) = \\tau_{stall}\\left(1 - \\frac{\\omega}{\\omega_0}\\right)', note: 'Any (speed, torque) point on or below the line is reachable at this voltage.' },
          { label: 'Load referred to motor', formula: 'τₘ,req = τ_L / (N η),  ωₘ = N ω_L', latex: '\\tau_{m,req} = \\frac{\\tau_L}{N\\eta},\\quad \\omega_m = N\\,\\omega_L', note: 'η is the gearhead efficiency; the motor must spin N times faster than the output.' },
          { label: 'Reflected inertia', formula: 'J_ref = Jₘ + J_L / N²', latex: 'J_{ref} = J_m + \\frac{J_L}{N^2}', note: 'Acceleration of the motor shaft is (τ_avail − τₘ,req) / J_ref.' },
          { label: 'Inertia matching', formula: 'N_opt = √(J_L / Jₘ)', latex: 'N_{opt} = \\sqrt{\\frac{J_L}{J_m}}', note: 'Maximizes load acceleration for a given motor torque, at which J_L / N² = Jₘ.' },
        ],
        workedExample: {
          given: 'Motor: V = 24 V, R = 1.2 Ω, kₜ = 0.05 N·m/A, Jₘ = 1.0×10⁻⁵ kg·m². Gearhead N = 50, η = 0.8. Load: J_L = 0.02 kg·m², τ_L = 2 N·m at ω_L = 5 rad/s.',
          find: 'Whether the motor can drive the load, and the best ratio for acceleration.',
          steps: [
            'τ_stall = kₜV / R = 0.05·24 / 1.2 = 1.00 N·m; ω₀ = 24 / 0.05 = 480 rad/s (4584 rpm)',
            'Output side: stall torque = Nητ_stall = 50·0.8·1.0 = 40 N·m; no-load speed = 480/50 = 9.6 rad/s',
            'Load at the motor shaft: ωₘ = 50·5 = 250 rad/s, τₘ,req = 2 / (50·0.8) = 0.050 N·m',
            'Available at 250 rad/s: τ_stall(1 − 250/480) = 0.479 N·m > 0.050 N·m, so the load point is feasible',
            'J_ref = 1.0×10⁻⁵ + 0.02 / 50² = 1.8×10⁻⁵ kg·m²',
            'Inertia-matched ratio N_opt = √(0.02 / 1.0×10⁻⁵) = 44.7',
          ],
          answer: 'Feasible, with a large torque margin (0.479 versus 0.050 N·m); N = 50 is close to the inertia-matched ratio of 44.7.',
        },
        challenges: [
          'Raise the load speed until the operating point leaves the shaded region. Which limit do you hit first, torque or speed?',
          'Halve the gear ratio. What happens to the reflected inertia, the output stall torque, and the maximum output speed?',
          'Set the ratio to N_opt. Compare the reflected load inertia J_L/N² with the rotor inertia Jₘ.',
        ],
        applications: [
          'Selecting a motor and gearhead for each joint of a robot arm from a vendor catalog',
          'Sizing the drive for an AGV wheel or a conveyor, where a known torque is needed at a known speed',
          'Choosing a gear ratio for a servo axis so that the motor and the load inertia are well matched',
        ],
        references: [
          { label: 'MIT 2.12 (Asada) — Chapter 2: Actuators and Drive Systems', url: `${ASADA}/chapter2/` },
        ],
      },
    ],
  },
]

export const EXTRA_TOPICS: { courseId: string; topics: TopicMeta[] }[] = []
