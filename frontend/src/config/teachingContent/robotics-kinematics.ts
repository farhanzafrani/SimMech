import type { TeachingContent } from '../teachingTypes'
import { EE } from '../teachingTypes'

/** Robotics: Kinematics & Actuation teaching content. */
export const CONTENT: Record<string, TeachingContent> = {
  'forward-kinematics-2r': {
    intuition:
      'Stretch your arm out and then bend only your elbow: your hand swings on a circle around the elbow, but the elbow itself is also riding on the shoulder. Forward kinematics is just that bookkeeping. Each link is a rigid stick; the tip is the shoulder-to-elbow stick plus the elbow-to-hand stick, and the second stick points in a direction set by BOTH joints, because turning the shoulder carries the whole forearm with it. Since each joint can swing freely, the hand can sit anywhere in a ring: no farther than the two links laid end to end, no closer than the shorter link folded back along the longer one. Forward kinematics is always easy and always has exactly one answer, which is exactly why the reverse problem is the interesting one.',
    derivation: [
      {
        text: 'Put the base at the origin. Link 1 has length L₁ and is rotated by θ₁ from the x-axis, so the elbow is at:',
        latex: 'x_e = L_1\\cos\\theta_1, \\qquad y_e = L_1\\sin\\theta_1',
      },
      {
        text: 'Joint 2 rotates link 2 by θ₂ relative to link 1. Link 1 already points at θ₁, so link 2 points at the absolute angle θ₁ + θ₂. This is the single most important idea in the topic: joint angles accumulate down the chain.',
        latex: '\\varphi = \\theta_1 + \\theta_2',
      },
      {
        text: 'The vector from elbow to tip is therefore L₂ at the absolute angle φ.',
        latex: '\\Delta x = L_2\\cos(\\theta_1+\\theta_2), \\qquad \\Delta y = L_2\\sin(\\theta_1+\\theta_2)',
      },
      {
        text: 'Add the two vectors to get the tip position (the headline equation):',
        latex: 'x = L_1\\cos\\theta_1 + L_2\\cos(\\theta_1+\\theta_2), \\quad y = L_1\\sin\\theta_1 + L_2\\sin(\\theta_1+\\theta_2)',
      },
      {
        text: 'Distance from the base follows from the law of cosines on the triangle of the two links. The interior angle at the elbow is 180° − θ₂, so:',
        latex: 'r^2 = x^2 + y^2 = L_1^2 + L_2^2 + 2L_1L_2\\cos\\theta_2',
      },
      {
        text: 'cos θ₂ only ranges from −1 to +1, so r runs between the two extremes, which are the workspace radii: fully stretched (θ₂ = 0) and fully folded (θ₂ = 180°).',
        latex: 'r_{max} = L_1 + L_2, \\qquad r_{min} = |L_1 - L_2|',
      },
    ],
    commonMistakes: [
      'Using θ₂ alone for the second link\'s direction. Link 2 points at θ₁ + θ₂ (relative joint angles accumulate). Writing L₂cosθ₂ is the classic error and gives the right answer only when θ₁ = 0.',
      'Mixing degrees and radians. Calculators and code (math.cos, NumPy) want radians; mixing a 30 in "degrees" with a π in "radians" gives plausible-looking nonsense.',
      'Forgetting that the joint angle is relative to the previous link while the tip orientation is absolute. Encoders report relative angles; the hand\'s direction is the sum.',
      'Treating the workspace as a full disc. With L₁ ≠ L₂ there is an unreachable hole of radius |L₁ − L₂| around the base, and in practice joint limits and self-collision shrink the usable ring further.',
      'Ignoring sign conventions. Positive θ is counter-clockwise about +z in the standard right-handed frame; a robot vendor may define zero position or direction differently, so check the datasheet before comparing to a hand calculation.',
      'Assuming forward kinematics gives you the arm shape too. It gives the tip pose only; where the elbow sits comes from the same formulas with only link 1 (x_e, y_e) and is needed separately for collision checks.',
    ],
    rulesOfThumb: [
      'Sanity check every answer against the workspace: the tip distance must satisfy |L₁ − L₂| ≤ r ≤ L₁ + L₂. If it does not, you have a bug.',
      'Spot-check with easy angles first: θ₁ = θ₂ = 0 must give (L₁ + L₂, 0), and θ₂ = 180° must fold the arm back along link 1.',
      'Equal link lengths give the largest "dexterous" region, since the inner hole shrinks to a point, but the arm can then reach the base only with link 2 folded exactly on link 1.',
      'Small joint errors become tip errors multiplied by the lever arm: roughly, a 0.1° encoder error on a 1 m reach moves the tip about 1.7 mm. Stiffness, backlash and link flexibility usually matter more than the arithmetic.',
    ],
    designChecklist: [
      'Fix the base frame, the zero position of each joint and the positive rotation direction.',
      'Write each link as a vector at its absolute angle (sum of joint angles so far).',
      'Add the vectors to get the tip position; report orientation as the sum of the joint angles.',
      'Check the result against the workspace limits r_min and r_max.',
      'Plug in two or three easy poses (stretched, folded, 90° elbow) and confirm by sketching.',
      'Compare with the robot\'s own kinematic model or encoder readout, accounting for offsets and joint limits.',
    ],
    prerequisites: [
      { courseId: 'engineering-dynamics', topicId: 'particle-kinematics', why: 'Position vectors and their components are the same tools used to add link vectors.' },
    ],
    quiz: [
      {
        kind: 'numeric',
        prompt: 'A planar 2R arm has L₁ = 0.40 m and L₂ = 0.25 m. At θ₁ = 60° and θ₂ = −30°, what is the tip x-coordinate?',
        answer: 0.4165,
        unit: 'm',
        explanation: 'Link 2 points at θ₁ + θ₂ = 30°. x = 0.40·cos60° + 0.25·cos30° = 0.2000 + 0.2165 = 0.4165 m. A negative θ₂ simply bends the elbow the other way.',
      },
      {
        kind: 'numeric',
        prompt: 'For L₁ = 0.60 m and L₂ = 0.35 m, what is the inner radius of the reachable workspace?',
        answer: 0.25,
        unit: 'm',
        explanation: 'The arm is most folded when θ₂ = 180°, so the links point in opposite directions: r_min = |L₁ − L₂| = |0.60 − 0.35| = 0.25 m. The tip cannot get closer to the base than this.',
      },
      {
        kind: 'choice',
        prompt: 'A student computes the tip of a 2R arm as x = L₁cosθ₁ + L₂cosθ₂, y = L₁sinθ₁ + L₂sinθ₂. What is wrong?',
        options: [
          'Nothing; this is correct because joint 2 is measured from link 1.',
          'The second link\'s absolute direction is θ₁ + θ₂, not θ₂, because turning joint 1 carries link 2 with it.',
          'The sine and cosine should be swapped for the y-coordinate.',
          'The link lengths should be added first, as L₁ + L₂, before multiplying by the trigonometric terms.',
        ],
        correct: 1,
        explanation: 'θ₂ is a relative angle. Link 2 inherits the rotation of link 1, so its absolute angle is θ₁ + θ₂. The student\'s formula is right only when θ₁ = 0.',
      },
      {
        kind: 'numeric',
        prompt: 'With L₁ = 0.5 m, L₂ = 0.3 m and θ₂ = 120°, how far is the tip from the base?',
        answer: 0.4359,
        unit: 'm',
        tolerance: 0.01,
        explanation: 'r² = L₁² + L₂² + 2L₁L₂cosθ₂ = 0.25 + 0.09 + 0.30·cos120° = 0.34 − 0.15 = 0.19, so r = 0.4359 m. It is independent of θ₁, because turning the shoulder only rotates the whole arm about the base.',
      },
      {
        kind: 'choice',
        prompt: 'For L₁ = 0.5 m and L₂ = 0.3 m, which statement about the workspace is true?',
        options: [
          'The tip can reach any point within 0.8 m of the base, including the base itself.',
          'The tip can reach points between 0.2 m and 0.8 m from the base, so the point (0.1, 0) is out of reach.',
          'The tip can only reach points exactly 0.8 m from the base.',
          'The tip can reach points between 0.3 m and 0.5 m from the base.',
        ],
        correct: 1,
        explanation: 'The workspace is a ring with r_max = L₁ + L₂ = 0.8 m and r_min = |L₁ − L₂| = 0.2 m. The point (0.1, 0) lies at 0.1 m, inside the hole.',
      },
      {
        kind: 'numeric',
        prompt: 'A 2R arm has θ₁ = 110° and θ₂ = −40°. What is the absolute orientation of the last link, in degrees from the x-axis?',
        answer: 70,
        unit: 'deg',
        explanation: 'φ = θ₁ + θ₂ = 110° + (−40°) = 70°. Signs matter: the negative elbow angle bends the forearm back toward the x-axis.',
      },
    ],
  },

  'inverse-kinematics-2r': {
    intuition:
      'Forward kinematics asks "where does my hand end up?"; inverse kinematics asks "how must I fold my arm to touch that cup?" Picture the shoulder, the elbow and the target as three points: the two links and the line from shoulder to target form a triangle whose three sides you know. A triangle with known sides is fixed — except that you can flip it over the shoulder-to-target line. That flip is the elbow-up versus elbow-down choice, and it is why there are normally two answers. If the target is farther than the two links stretched out, or closer than the folded-back inner limit, the triangle cannot close and there is no answer. At the boundary the triangle collapses to a straight line, the two answers become one, and the arm sits in a singularity.',
    derivation: [
      {
        text: 'The target (x, y) is at distance r from the base, with r² = x² + y². The links L₁, L₂ and the base-to-target line form a triangle, and the interior angle opposite the base-to-target side is 180° − θ₂.',
      },
      {
        text: 'Apply the law of cosines to that triangle. Since cos(180° − θ₂) = −cosθ₂, this gives:',
        latex: 'x^2 + y^2 = L_1^2 + L_2^2 + 2L_1L_2\\cos\\theta_2',
      },
      {
        text: 'Solve for cosθ₂. This is the reachability test: if |cosθ₂| > 1 the target is outside the workspace.',
        latex: '\\cos\\theta_2 = \\frac{x^2 + y^2 - L_1^2 - L_2^2}{2L_1L_2}',
      },
      {
        text: 'Cosine is even, so θ₂ = ±arccos(·). The positive and negative signs are the two elbow configurations. Pick one, then compute sinθ₂ from it.',
      },
      {
        text: 'The base-to-target line has direction atan2(y, x). The second link tilts the tip away from link 1 by an extra angle β, and with the right-triangle components of link 2 (L₂ sinθ₂ sideways, L₁ + L₂ cosθ₂ along link 1):',
        latex: '\\beta = \\operatorname{atan2}(L_2\\sin\\theta_2,\\; L_1 + L_2\\cos\\theta_2)',
      },
      {
        text: 'Aim at the target, then subtract that tilt to get the shoulder angle (headline equation):',
        latex: '\\theta_1 = \\operatorname{atan2}(y, x) - \\operatorname{atan2}(L_2\\sin\\theta_2,\\; L_1 + L_2\\cos\\theta_2)',
      },
      {
        text: 'Where sinθ₂ = 0 the two branches coincide and det J = L₁L₂ sinθ₂ = 0, so small tip motions need very large joint motions: that is the singularity at the workspace boundary.',
      },
    ],
    commonMistakes: [
      'Using atan(y/x) instead of atan2(y, x). The plain arctangent loses the quadrant and fails when x = 0; atan2 handles both.',
      'Forgetting the "minus" term in θ₁. Writing θ₁ = atan2(y, x) aims link 1 straight at the target and ignores that link 2 must also reach it.',
      'Not checking |cosθ₂| ≤ 1 before taking arccos. Targets just outside the workspace make arccos fail (NaN) in code; clamp or reject them deliberately, rather than silently clipping.',
      'Reporting only one solution. A path planner may need the other elbow to avoid an obstacle or a joint limit, and swapping branches mid-motion is only possible by passing through a singularity or reconfiguring.',
      'Picking the wrong sign on the second atan2 when switching branches. With θ₂ negated, sinθ₂ flips sign, so the correction is added to the target direction rather than subtracted.',
      'Assuming the closed-form works for any robot. Analytic IK is the exception, available for planar arms and wrists with a spherical or other special geometry; general 6-axis arms often need numerical (Jacobian-based) solvers and may have up to 8 solutions.',
    ],
    rulesOfThumb: [
      'Always verify by running the answer back through forward kinematics: it should reproduce the target to rounding error. Both branches should pass.',
      'Targets in the middle of the workspace are far from a singularity. Within roughly 10 % of r_max (or near r_min) expect joint speeds to grow quickly and avoid designing tasks there.',
      'Pick the solution that is closest to the current joint angles unless a joint limit or an obstacle forces the other branch, to avoid large jumps.',
      'A 2R arm has two solutions in the interior, one on the boundary and none outside. Counting solutions is a quick plausibility check.',
    ],
    designChecklist: [
      'Compute r² = x² + y² and compare with (L₁ − L₂)² and (L₁ + L₂)² to test reachability.',
      'Calculate cosθ₂ from the law of cosines and take θ₂ = ±arccos.',
      'Compute θ₁ for each branch using atan2 and the correction term.',
      'Discard solutions that violate joint limits or collide with the workcell.',
      'Choose between remaining branches (closest to the current pose, or the one with the larger |sinθ₂| for better manipulability).',
      'Verify with forward kinematics and plan the path so it avoids the singular configuration.',
    ],
    prerequisites: [
      { courseId: 'robotics-kinematics', topicId: 'forward-kinematics-2r', why: 'Inverse kinematics inverts those equations, and you use them to verify the answer.' },
    ],
    quiz: [
      {
        kind: 'numeric',
        prompt: 'A 2R arm has L₁ = 0.5 m and L₂ = 0.3 m. The target is (0.6, 0.3) m. What is the magnitude of the elbow angle |θ₂|?',
        answer: 68.49,
        unit: 'deg',
        explanation: 'x² + y² = 0.36 + 0.09 = 0.45. cosθ₂ = (0.45 − 0.25 − 0.09)/(2·0.5·0.3) = 0.11/0.30 = 0.3667, so |θ₂| = arccos(0.3667) = 68.49°. The sign picks elbow-down (+) or elbow-up (−).',
      },
      {
        kind: 'choice',
        prompt: 'For L₁ = 0.5 m and L₂ = 0.3 m, how many inverse-kinematics solutions does the target (0.9, 0.1) m have?',
        options: [
          'Two: elbow-up and elbow-down.',
          'One, since the arm is stretched.',
          'None, since the target is at 0.906 m, beyond the maximum reach of 0.8 m.',
          'Infinitely many.',
        ],
        correct: 2,
        explanation: 'r = √(0.9² + 0.1²) = 0.906 m > L₁ + L₂ = 0.8 m. Then cosθ₂ = (0.82 − 0.34)/0.30 = 1.6, which is greater than 1, so arccos is undefined: the triangle cannot close.',
      },
      {
        kind: 'numeric',
        prompt: 'A 2R arm has L₁ = L₂ = 0.4 m and the target is (0.4, 0.4) m. For the solution with θ₂ = −90° (elbow-up), what is θ₁?',
        answer: 90,
        unit: 'deg',
        explanation: 'cosθ₂ = (0.32 − 0.32)/0.32 = 0, so θ₂ = ±90°. For θ₂ = −90°: atan2(0.4,0.4) = 45°, and the correction atan2(0.4·sin(−90°), 0.4 + 0) = atan2(−0.4, 0.4) = −45°. So θ₁ = 45° − (−45°) = 90° (the other branch gives θ₁ = 0° with θ₂ = +90°). Link 1 points straight up, link 2 sweeps right.',
      },
      {
        kind: 'choice',
        prompt: 'A student sets θ₁ = atan2(y, x) and θ₂ = arccos[(x² + y² − L₁² − L₂²)/(2L₁L₂)], and finds the tip misses the target. What was left out?',
        options: [
          'The correction −atan2(L₂ sinθ₂, L₁ + L₂ cosθ₂): link 1 should not point straight at the target.',
          'A factor of two in the denominator of cosθ₂.',
          'A conversion of radians to degrees inside arccos.',
          'Nothing; the tip miss is caused by joint backlash.',
        ],
        correct: 0,
        explanation: 'Aiming link 1 at the target ignores that link 2 bends away at θ₂. Unless θ₂ = 0, link 1 must point to one side of the target line by the angle that link 2 adds, so that correction is subtracted from atan2(y, x).',
      },
      {
        kind: 'numeric',
        prompt: 'L₁ = 0.5 m and L₂ = 0.3 m. What is det J (in m²) when θ₂ = 30°?',
        answer: 0.075,
        unit: 'm²',
        explanation: 'det J = L₁L₂ sinθ₂ = 0.5·0.3·sin30° = 0.15·0.5 = 0.075 m². That is half the maximum 0.15 m² (reached at θ₂ = ±90°), so the arm is moderately close to its stretched singularity.',
      },
      {
        kind: 'choice',
        prompt: 'The target lies exactly on the outer boundary of the workspace of a 2R arm. How many solutions are there, and why?',
        options: [
          'Two, like any other interior point.',
          'Zero, because the target is unreachable.',
          'Four: two elbow branches for each of two shoulder directions.',
          'One, because cosθ₂ = 1 forces θ₂ = 0 and the two elbow branches merge (a singularity).',
        ],
        correct: 3,
        explanation: 'At r = L₁ + L₂, cosθ₂ = 1, so +arccos and −arccos are both 0. The arm is fully stretched, sinθ₂ = 0, det J = 0, and the two solutions coincide.',
      },
    ],
  },

  'jacobian-manipulability': {
    intuition:
      'Imagine nudging each joint by a tiny amount and watching how the hand moves. The shoulder nudge moves the hand sideways in proportion to how far the hand is from the shoulder; the elbow nudge moves it in proportion to the forearm length. Collect those hand motions per unit joint motion and you have the Jacobian. It is a local, pose-dependent gear ratio between joint space and the task space. The same matrix, transposed, runs the other way: a force at the hand turns into torques at the joints, because the arm does no net work if it holds still. Near a stretched-out arm the hand cannot move along the arm direction no matter how fast the joints turn (the manipulability ellipse collapses to a line), and in exactly that direction the arm can resist enormous loads with almost no joint torque.',
    derivation: [
      {
        text: 'Start from the forward kinematics and differentiate with respect to time using the chain rule. The tip velocity is linear in the joint rates:',
        latex: 'v = \\begin{bmatrix}\\dot x \\\\ \\dot y\\end{bmatrix} = \\frac{\\partial p}{\\partial q}\\,\\dot q = J\\,\\dot q',
      },
      {
        text: 'Differentiating x = L₁c₁ + L₂c₁₂ and y = L₁s₁ + L₂s₁₂ with respect to θ₁ and θ₂ (with s₁₂ = sin(θ₁+θ₂), etc.) gives the entries:',
        latex: 'J = \\begin{bmatrix} -L_1 s_1 - L_2 s_{12} & -L_2 s_{12} \\\\ L_1 c_1 + L_2 c_{12} & L_2 c_{12} \\end{bmatrix}',
      },
      {
        text: 'Statics from virtual work. A tip force F acting through a virtual tip displacement δp does work Fᵀδp. The joint torques acting through the matching joint displacements δq do work τᵀδq. For equilibrium these must be equal for any δq.',
        latex: '\\tau^{T}\\delta q = F^{T}\\delta p',
      },
      {
        text: 'Substitute δp = J δq. Since δq is arbitrary, the factor multiplying it must vanish, giving the force mapping:',
        latex: '\\tau^{T} = F^{T}J \\;\\;\\Rightarrow\\;\\; \\tau = J^{T}F',
      },
      {
        text: 'Manipulability. A unit sphere of joint rates maps through J to an ellipse of tip velocities whose semi-axes are the singular values σ₁, σ₂ of J. Its area is proportional to their product, which for a square J equals |det J|:',
        latex: 'w = \\sigma_1\\sigma_2 = |\\det J| = L_1L_2\\,|\\sin\\theta_2|',
      },
      {
        text: 'At θ₂ = 0 or 180° the determinant is zero, one singular value vanishes, and the ellipse collapses to a line. Resolved-rate control needs J⁻¹, which blows up there, while the force ellipse (axes 1/σ) stretches to infinity along that line.',
      },
    ],
    commonMistakes: [
      'Using J⁻¹ for forces. The force map is τ = Jᵀ F (transpose), not the inverse; the inverse maps velocities in the other direction, v → q̇.',
      'Inverting J near a singularity. q̇ = J⁻¹v gives enormous joint speeds when det J → 0; real controllers use damped least squares or slow the motion down.',
      'Mixing frames. J as written maps to tip velocity in the base frame. If a force is given in the tool frame, rotate it into the base frame first (using the transform from the previous topic) before applying Jᵀ.',
      'Treating the Jacobian as constant. It changes with every pose, so a motor that is fine at one configuration may be overloaded at another; check the worst pose.',
      'Assuming a singular pose is a weak pose. A fully stretched arm can support a large force along its axis with almost zero joint torque, but it cannot generate any tip velocity in that direction, and a small perpendicular push demands very large torques.',
      'Treating |det J| as a universal manipulability measure. It is one scalar summary; condition number (σ_max/σ_min) says how directional the arm is, and with mixed units (position and rotation) the matrix needs scaling before singular values mean anything.',
    ],
    rulesOfThumb: [
      'Torque at a joint is at most force times the maximum lever arm to the tip. For a 2R arm, τ₁ ≤ F(L₁ + L₂); that is the quickest way to size the shoulder motor.',
      'For this arm manipulability peaks at θ₂ = ±90° (value L₁L₂), and a condition number below roughly 3–5 is usually comfortable; above about 10 the arm is behaving nearly singular.',
      'The shoulder carries the heaviest load: it supports the whole arm and the payload at the longest lever arm. Design joint 1 first.',
      'Place the task so the tip works in the middle of the workspace with an elbow bend of 60°–120° rather than near a stretched or folded pose.',
    ],
    designChecklist: [
      'Write the forward kinematics and differentiate to get J(q).',
      'Evaluate J at the poses the task visits, including the extremes of the workspace.',
      'Map required tip velocities to joint speeds with q̇ = J⁻¹ v and check against motor speed limits.',
      'Map required tip forces to joint torques with τ = Jᵀ F and check against motor torque limits (add gravity and inertia loads separately).',
      'Compute det J, condition number or manipulability along the path and flag poses near singularity.',
      'Re-plan the path, change the elbow configuration, or reposition the workpiece to keep clear of singularities.',
    ],
    prerequisites: [
      { courseId: 'robotics-kinematics', topicId: 'forward-kinematics-2r', why: 'The Jacobian is the derivative of the forward-kinematics equations.' },
      { courseId: 'engineering-statics', topicId: 'statics-equilibrium', why: 'The force mapping τ = Jᵀ F is a statics (virtual work) result.' },
    ],
    quiz: [
      {
        kind: 'numeric',
        prompt: 'A 2R arm with L₁ = 0.5 m and L₂ = 0.3 m is at θ₁ = 0° and θ₂ = 90°, with joint rates q̇ = (1, 1) rad/s. What is the tip speed?',
        answer: 0.781,
        unit: 'm/s',
        explanation: 'At this pose J = [[−0.3, −0.3], [0.5, 0]] (s₁ = 0, c₁ = 1, s₁₂ = 1, c₁₂ = 0). v = J q̇ = (−0.6, 0.5) m/s, and |v| = √(0.36 + 0.25) = 0.781 m/s.',
      },
      {
        kind: 'numeric',
        prompt: 'For the same arm and pose (θ₁ = 0°, θ₂ = 90°, so the tip is at (0.5, 0.3) m), what shoulder torque is needed to hold a tip force of F = (0, 20) N?',
        answer: 10,
        unit: 'N·m',
        explanation: 'τ = Jᵀ F. The first row of Jᵀ is the first column of J, (−0.3, 0.5), so τ₁ = −0.3·0 + 0.5·20 = 10 N·m. This is just F_y times the tip x-distance (0.5 m) about the base. τ₂ = −0.3·0 + 0·20 = 0, because the force passes through the elbow axis.',
      },
      {
        kind: 'choice',
        prompt: 'A student writes the joint torques needed to hold a tip force as τ = J⁻¹ F. What is the correct relationship and why?',
        options: [
          'τ = J⁻¹ F is correct for square J.',
          'τ = Jᵀ F, derived from virtual work: τᵀδq = Fᵀ J δq for all δq.',
          'τ = J F, because J maps joint quantities to tip quantities.',
          'τ = (JᵀJ) F, to make the matrix symmetric.',
        ],
        correct: 1,
        explanation: 'Power conservation gives τᵀ q̇ = Fᵀ v = Fᵀ J q̇ for all q̇, hence τ = Jᵀ F. The inverse maps tip velocity to joint velocity; it is not the force map, and it does not exist at singularities, whereas Jᵀ always does.',
      },
      {
        kind: 'numeric',
        prompt: 'For L₁ = 0.5 m and L₂ = 0.3 m, an arm fully stretched along x (θ₁ = θ₂ = 0) must hold a 50 N tip force in the +y direction. What shoulder torque is needed?',
        answer: 40,
        unit: 'N·m',
        explanation: 'The lever arm is L₁ + L₂ = 0.8 m, so τ₁ = F·(L₁ + L₂) = 50·0.8 = 40 N·m. Equivalently τ₁ = (L₁ + L₂)·F_y from the first column of J. The elbow needs 0.3·50 = 15 N·m. Pushing sideways on a stretched arm is the worst case for the torque.',
      },
      {
        kind: 'choice',
        prompt: 'A 2R arm is nearly fully stretched (θ₂ close to 0). Which statement is correct?',
        options: [
          'The tip can move equally fast in every direction because the arm is long.',
          'The joint torques needed for a force along the arm direction become very large.',
          'The Jacobian determinant is at its maximum.',
          'The tip velocity along the arm direction is nearly zero for any joint speeds, while joint rates needed to move along that direction grow without bound.',
        ],
        correct: 3,
        explanation: 'det J = L₁L₂ sinθ₂ → 0, so the ellipse is nearly a line perpendicular to the arm: motion along the arm needs enormous joint rates (J⁻¹ blows up). The same pose can hold large axial force with almost no torque, so the torque statement is the opposite of the truth, and the determinant is at its minimum.',
      },
      {
        kind: 'numeric',
        prompt: 'For L₁ = 0.5 m and L₂ = 0.3 m, the manipulability w = |det J| is 0.075 m² at θ₂ = 30°. What fraction of its maximum possible value is that, as a percentage?',
        answer: 50,
        unit: '%',
        explanation: 'w_max = L₁L₂ = 0.15 m² at θ₂ = ±90°. The fraction is 0.075/0.15 = 0.5, i.e. 50 %, which also equals sin30°.',
      },
    ],
  },

  'rotation-homogeneous-transforms': {
    intuition:
      'Every object in a robot cell carries its own little coordinate system: the base, each link, the camera, the gripper and the part on the table. A rotation matrix is simply the three axes of one frame written down in the coordinates of another, so the matrix is as much a map as a number table. Because those axes are perpendicular unit vectors, the matrix never stretches or shears anything; undoing a rotation is just flipping the matrix on its diagonal (the transpose). Adding the position of the frame\'s origin turns the rotation into a full rigid-body move, and packing both into a 4×4 homogeneous matrix lets a whole chain of frames collapse into one matrix product. Two things to hold in your head: the order of rotations matters (turn a book 90° about two different axes in the opposite order and see), and describing orientation with three angles has an unavoidable trap, gimbal lock.',
    derivation: [
      {
        text: 'Write the axes of frame {B} as columns, expressed in frame {A}: R = [x̂_B ŷ_B ẑ_B]. A point with coordinates ᴮp in {B} is the vector ᴮp_x x̂_B + ᴮp_y ŷ_B + ᴮp_z ẑ_B, which is R ᴮp when written in {A}.',
        latex: '{}^{A}p = R\\,{}^{B}p',
      },
      {
        text: 'Because the columns of R are orthonormal (unit length, mutually perpendicular), RᵀR = I. So R preserves lengths and angles, and its inverse is its transpose. Proper rotations also have det R = +1 (det = −1 would be a mirror reflection).',
        latex: 'R^{T}R = I, \\qquad R^{-1} = R^{T}, \\qquad \\det R = +1',
      },
      {
        text: 'For a rotation by α about z, the new x-axis is (cosα, sinα, 0) and the new y-axis is (−sinα, cosα, 0), which are the columns of:',
        latex: 'R_z(\\alpha) = \\begin{bmatrix} \\cos\\alpha & -\\sin\\alpha & 0 \\\\ \\sin\\alpha & \\cos\\alpha & 0 \\\\ 0 & 0 & 1 \\end{bmatrix}',
      },
      {
        text: 'Add the position t of the origin of {B} measured in {A}. A point is first rotated into the orientation of {A} and then shifted:',
        latex: '{}^{A}p = R\\,{}^{B}p + t',
      },
      {
        text: 'The "+ t" breaks the pure matrix-multiply form. Append a 1 to each point (homogeneous coordinates) and embed R and t in a 4×4 matrix so everything becomes one product; chains of frames multiply in order.',
        latex: '\\begin{bmatrix}{}^{A}p \\\\ 1\\end{bmatrix} = T\\begin{bmatrix}{}^{B}p \\\\ 1\\end{bmatrix}, \\quad T = \\begin{bmatrix} R & t \\\\ 0 & 1 \\end{bmatrix}, \\quad T_{AC} = T_{AB}T_{BC}',
      },
      {
        text: 'Invert the transform by solving ᴬp = R ᴮp + t for ᴮp. Using R⁻¹ = Rᵀ gives:',
        latex: '{}^{B}p = R^{T}({}^{A}p - t) \\;\\Rightarrow\\; T^{-1} = \\begin{bmatrix} R^{T} & -R^{T}t \\\\ 0 & 1 \\end{bmatrix}',
      },
      {
        text: 'By Euler\'s theorem every rotation is a single turn by θ about some axis. The trace of R is 1 + 2cosθ, so the angle follows without finding the axis:',
        latex: '\\cos\\theta = \\frac{\\operatorname{tr}R - 1}{2}',
      },
    ],
    commonMistakes: [
      'Multiplying rotations in the wrong order. R₁R₂ is not R₂R₁ in 3D: composing about the current (moving) axes versus the fixed axes reverses the order, and getting the convention wrong silently rotates the part the wrong way.',
      'Inverting T as [Rᵀ, −t]. The translation part of the inverse is −Rᵀt, because the translation must also be rotated into the new frame.',
      'Confusing the transform direction. T_AB takes coordinates from {B} to {A}; using it the other way round (without inverting) gives a plausible but wrong location.',
      'Mixing up active and passive rotations. Rotating a point and re-expressing a fixed point in a rotated frame use R and Rᵀ respectively, and sign conventions for the angle change with it.',
      'Using Euler angles near gimbal lock. In the ZYX convention at pitch = ±90° yaw and roll turn about the same axis, so one degree of freedom is lost and the angles are no longer unique. Use rotation matrices, quaternions or axis-angle to compose, and Euler angles only to display.',
      'Letting numerical drift break orthonormality. After many multiplications RᵀR drifts from I; re-orthonormalize (for example with SVD or Gram-Schmidt) rather than inverting with a general routine.',
    ],
    rulesOfThumb: [
      'Quick check on any rotation matrix: each row and column has length 1, RᵀR = I and det R = +1. Errors in a hand-built R almost always violate one of these.',
      'Read frame subscripts like chain links: T_AC = T_AB T_BC, where the inner subscripts match and cancel.',
      'Never invert a rigid transform with a general matrix inverse: the Rᵀ and −Rᵀt shortcut is faster and numerically exact.',
      'Euler angles are for humans, matrices or quaternions are for computers. Quaternions need four numbers but avoid gimbal lock and interpolate smoothly.',
    ],
    designChecklist: [
      'Name every frame and decide, once, what each subscript means (T_AB maps B coordinates into A).',
      'Build each rotation from the axes of one frame written in the other (columns of R), and check RᵀR = I and det R = +1.',
      'Assemble the 4×4 transform for each link or sensor: R in the upper left, origin position t in the right column.',
      'Chain transforms in the correct order, matching inner subscripts.',
      'Use the Rᵀ, −Rᵀt formula when you need the reverse direction.',
      'Verify with a point whose location you know (the origin of a frame, or a point on an axis).',
      'Store orientation as a matrix or quaternion, and convert to Euler angles only for display.',
    ],
    prerequisites: [
      { courseId: 'engineering-dynamics', topicId: 'rigid-body-planar-kinematics', why: 'Rotating frames and rigid-body motion are the planar special case of what is generalised here.' },
    ],
    quiz: [
      {
        kind: 'numeric',
        prompt: 'Frame {B} is rotated 30° about z relative to {A}, with no translation. A point has coordinates ᴮp = (2, 0, 0) in {B}. What is its x-coordinate in {A}?',
        answer: 1.732,
        unit: 'm',
        explanation: 'R_z(30°) applied to (2, 0, 0) gives (2cos30°, 2sin30°, 0) = (1.732, 1.000, 0). The x-coordinate is 1.732 m.',
      },
      {
        kind: 'numeric',
        prompt: 'Frame {B} is rotated 90° about z relative to {A}, with its origin at t = (0.5, 0, 0.2) m in {A}. A point has ᴮp = (0.2, 0.1, 0) m. What is its x-coordinate in {A}?',
        answer: 0.4,
        unit: 'm',
        explanation: 'R_z(90°) = [[0, −1, 0], [1, 0, 0], [0, 0, 1]], so R ᴮp = (−0.1, 0.2, 0). Adding t gives ᴬp = (0.4, 0.2, 0.2) m. The x-coordinate is −0.1 + 0.5 = 0.4 m.',
      },
      {
        kind: 'numeric',
        prompt: 'A rotation matrix has trace tr R = 2. By how many degrees does it rotate about its axis?',
        answer: 60,
        unit: 'deg',
        explanation: 'cosθ = (tr R − 1)/2 = (2 − 1)/2 = 0.5, so θ = 60°. The trace depends only on the angle, not the axis.',
      },
      {
        kind: 'choice',
        prompt: 'A student inverts T = [[R, t], [0, 1]] as T⁻¹ = [[Rᵀ, −t], [0, 1]]. What is wrong?',
        options: [
          'The rotation block should be R, not Rᵀ.',
          'The bottom row should be [1, 0].',
          'The translation block should be −Rᵀt, because the offset must be re-expressed in the rotated frame.',
          'Nothing; for rigid transforms the inverse translation is simply −t.',
        ],
        correct: 2,
        explanation: 'From ᴬp = R ᴮp + t, ᴮp = Rᵀ(ᴬp − t) = Rᵀᴬp − Rᵀt. The translation part is −Rᵀt. For R = Rz(90°) and t = (1, 2, 0) it is (−2, 1, 0), not (−1, −2, 0). The two agree only when R = I.',
      },
      {
        kind: 'choice',
        prompt: 'Using ZYX Euler angles (yaw-pitch-roll), when does the representation lose a degree of freedom?',
        options: [
          'When roll = 90°.',
          'When pitch = ±90°, because yaw and roll then rotate about the same axis (gimbal lock).',
          'When yaw = 180°.',
          'Never; Euler angles are unique for every orientation.',
        ],
        correct: 1,
        explanation: 'At pitch = ±90° the first and third rotation axes align, so only the combination of yaw and roll (their sum or difference) matters. Infinitely many angle triples give the same R, and small orientation changes need large changes in the angles.',
      },
      {
        kind: 'choice',
        prompt: 'Which statement about a proper 3D rotation matrix R is NOT correct?',
        options: [
          'R₁R₂ = R₂R₁ for any two rotations.',
          'RᵀR = I.',
          'det R = +1.',
          'R⁻¹ = Rᵀ.',
        ],
        correct: 0,
        explanation: 'Rotations in 3D do not commute in general (a quarter turn about x then y is not the same as y then x). Only rotations about the same axis commute. The other three properties follow from the orthonormal columns and right-handedness.',
      },
    ],
  },

  'dc-motor-gearhead-sizing': {
    intuition:
      'A DC motor is fast but weak, and the gearhead is the lever that fixes that. At standstill the motor produces its stall torque, but as it spins its own back-EMF eats into the supply voltage, torque falls in a straight line, and at the no-load speed the motor produces no torque at all. A gearhead of ratio N is like a long wrench: the output turns N times slower with roughly N times the torque (a little less, since gears waste some). Gearing also changes how heavy the load feels: reflected to the motor shaft, load inertia shrinks by N², so a high ratio lets a small motor "see" a large arm as light and accelerate it quickly. But more ratio is not free: the motor must spin N times faster, which runs it closer to its no-load speed and leaves less torque to spare.',
    derivation: [
      {
        text: 'Electrical side of a permanent-magnet DC motor (steady state): the supply voltage V drives current I through the winding resistance R, against the back-EMF k_e ω, which is proportional to speed.',
        latex: 'V = IR + k_e\\,\\omega',
      },
      {
        text: 'Torque is proportional to current, τ = k_t I. In SI units k_t (N·m/A) and k_e (V·s/rad) are numerically equal, so we can write k_t for both.',
        latex: '\\tau_m = k_t I',
      },
      {
        text: 'Eliminate I. At stall (ω = 0) the current is V/R, giving the stall torque; at zero torque (I = 0) the speed is V/k_t, the no-load speed.',
        latex: '\\tau_{stall} = \\frac{k_t V}{R}, \\qquad \\omega_0 = \\frac{V}{k_t}',
      },
      {
        text: 'In between, substitute back and the torque-speed relation is a straight line from (0, τ_stall) to (ω₀, 0):',
        latex: '\\tau_m(\\omega) = \\tau_{stall}\\left(1 - \\frac{\\omega}{\\omega_0}\\right)',
      },
      {
        text: 'A gearhead of ratio N and efficiency η makes the output speed ω_L = ω_m/N. Power balance (η·τ_m·ω_m = τ_L·ω_L) gives the output torque and, referred the other way, the motor torque the load demands:',
        latex: '\\tau_{m,req} = \\frac{\\tau_L}{N\\eta}, \\qquad \\omega_m = N\\omega_L',
      },
      {
        text: 'Kinetic energy is conserved when referring inertia to the motor shaft. A load inertia J_L spinning at ω_L = ω_m/N has kinetic energy ½J_L(ω_m/N)², so it adds J_L/N² to the rotor inertia:',
        latex: 'J_{ref} = J_m + \\frac{J_L}{N^2}',
      },
      {
        text: 'To accelerate the load as hard as possible from a fixed motor torque, maximise α_L = N τ_m/(J_m N² + J_L). Setting the derivative with respect to N to zero makes the rotor and reflected load inertia equal:',
        latex: 'J_m = \\frac{J_L}{N^2} \\;\\Rightarrow\\; N_{opt} = \\sqrt{\\frac{J_L}{J_m}}',
      },
    ],
    commonMistakes: [
      'Ignoring gearhead efficiency. Output torque is Nητ_m, not Nτ_m; planetary stages typically lose a few percent each, and worm or high-ratio cycloidal stages can be far worse. Efficiency also drops when the gearbox is cold or lightly loaded.',
      'Mixing rpm and rad/s. 1 rad/s = 9.549 rpm. Motor datasheets quote rpm, but τ·ω in watts needs rad/s.',
      'Reflecting inertia with N instead of N². Load inertia scales as 1/N², not 1/N, because both the torque and the speed factor in.',
      'Sizing on stall torque. The rated (continuous) torque is set by heating, not by the stall line; stall torque can only be used briefly. A load point under the line is necessary, not sufficient.',
      'Forgetting the speed side. A high ratio multiplies the required motor speed by N, and the point may fall beyond ω₀ even when the torque is easily available. Check that the load point stays comfortably below the line.',
      'Ignoring the acceleration torque. The motor torque required is the steady load torque plus J_ref·α; a joint that "holds" the load fine can still fail to accelerate it within the required cycle time.',
    ],
    rulesOfThumb: [
      'Inertia matching, J_L/N² ≈ J_m, is the optimum for acceleration; in practice servo systems are often run with the reflected load inertia within a few times the rotor inertia. Heavier loads need more ratio.',
      'Choose the ratio so the load point sits at or below about half the no-load speed and torque line, leaving margin for acceleration, friction and voltage sag.',
      'Gearhead efficiency is typically somewhere around 0.7–0.95 for single spur or planetary stages, lower for worm gears; use the catalogue value and be conservative.',
      'Gearheads also add backlash and compliance. For precision positioning on a robot joint, low-backlash types (harmonic or precision planetary) are specified even when a cheaper box has the right ratio.',
    ],
    designChecklist: [
      'Determine the load requirements: torque (including gravity and friction), speed, and the acceleration profile for each joint.',
      'Estimate the load inertia J_L about the joint axis, including the payload.',
      'Choose a trial gear ratio near N = √(J_L/J_m), then adjust for speed range and available catalogue ratios.',
      'Refer the load to the motor: ω_m = Nω_L, τ_m,req = τ_L/(Nη), plus J_ref·α for acceleration.',
      'Check the (ω_m, τ_m,req) point lies below the torque-speed line at the available voltage, with margin.',
      'Check the continuous torque against the rated value and the peak against the stall/peak rating, and compute the heating for the duty cycle.',
      'Verify gearhead rated torque, backlash, and life; iterate on N if needed.',
    ],
    prerequisites: [
      { courseId: 'engineering-dynamics', topicId: 'rigid-body-kinetics', why: 'Moment of inertia and τ = Jα are the basis of reflected inertia and acceleration torque.' },
    ],
    videos: [
      {
        id: 'JnYVz1TSmBQ',
        title: 'How Levers, Pulleys and Gears Work',
        channel: EE,
        why: 'Background on how gears trade speed for torque, which is the principle behind the gearhead.',
      },
    ],
    quiz: [
      {
        kind: 'numeric',
        prompt: 'A DC motor has V = 12 V, R = 0.5 Ω and k_t = 0.04 N·m/A. What is its stall torque?',
        answer: 0.96,
        unit: 'N·m',
        explanation: 'τ_stall = k_t V / R = 0.04·12/0.5 = 0.96 N·m. At stall there is no back-EMF, so the full V/R = 24 A flows.',
      },
      {
        kind: 'numeric',
        prompt: 'For the same motor (12 V, k_t = 0.04), what is the no-load speed in rpm?',
        answer: 2864.8,
        unit: 'rpm',
        explanation: 'ω₀ = V/k_t = 12/0.04 = 300 rad/s. Multiplying by 60/(2π) gives 2864.8 rpm. Note that the resistance does not enter: at no load the current is about zero and the back-EMF equals the supply voltage.',
      },
      {
        kind: 'numeric',
        prompt: 'A load needs τ_L = 6 N·m at the output of a gearhead with N = 30 and η = 0.75. What motor torque is required?',
        answer: 0.2667,
        unit: 'N·m',
        explanation: 'τ_m,req = τ_L/(Nη) = 6/(30·0.75) = 6/22.5 = 0.2667 N·m. Without the efficiency term you would get 0.2 N·m and undersize the motor by 25 %.',
      },
      {
        kind: 'numeric',
        prompt: 'The load in the previous question turns at ω_L = 3 rad/s. Using the 12 V motor above (τ_stall = 0.96 N·m, ω₀ = 300 rad/s) with N = 30, what torque can the motor deliver at the required motor speed?',
        answer: 0.672,
        unit: 'N·m',
        explanation: 'ω_m = Nω_L = 90 rad/s. τ_m = 0.96·(1 − 90/300) = 0.96·0.7 = 0.672 N·m, comfortably above the 0.2667 N·m required, so the load point is feasible with a margin of roughly 2.5 on torque.',
      },
      {
        kind: 'choice',
        prompt: 'A student reflects a load inertia to the motor shaft as J_ref = J_m + J_L/N and gets a very large value. What is wrong?',
        options: [
          'Nothing; reflected inertia scales as 1/N.',
          'It should be J_L·N², since the motor spins N times faster.',
          'The efficiency η must also divide J_L.',
          'It should be J_L/N², because kinetic energy ½J_L(ω_m/N)² has the speed reduced by N and squared.',
        ],
        correct: 3,
        explanation: 'Equating kinetic energies, ½J_ref ω_m² = ½J_L ω_L² with ω_L = ω_m/N, gives J_L/N². Because it is squared, a 10:1 ratio makes the load look 100 times lighter, which is why even modest gearing helps so much with heavy joints.',
      },
      {
        kind: 'numeric',
        prompt: 'A motor has rotor inertia J_m = 2.0×10⁻⁵ kg·m² and drives a load of J_L = 0.045 kg·m². What gear ratio gives inertia matching?',
        answer: 47.43,
        unit: '',
        explanation: 'N_opt = √(J_L/J_m) = √(0.045/2.0×10⁻⁵) = √2250 = 47.43. At that ratio J_L/N² = 2.0×10⁻⁵ = J_m, so J_ref = 4.0×10⁻⁵ kg·m². Ratios near, but not exactly at, this value (e.g. 50:1) cost very little acceleration.',
      },
    ],
  },
}
