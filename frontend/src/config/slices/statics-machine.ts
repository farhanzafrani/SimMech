/**
 * Slice: statics-machine
 * - EXTRA_TOPICS: completes the two `coming-soon` machine-design topics
 *   (same ids as the stubs in curriculum.ts, which the lead replaces).
 * - NEW_COURSES: adds the Engineering Statics prerequisite course.
 */

import type { CourseMeta, TopicMeta } from '../curriculum'

const MIT_272_LEC12 = 'https://ocw.mit.edu/courses/2-72-elements-of-mechanical-design-spring-2009/resources/mit2_72s09_lec12/'
const MIT_272_LEC13 = 'https://ocw.mit.edu/courses/2-72-elements-of-mechanical-design-spring-2009/resources/mit2_72s09_lec13/'

const gearToothBending: TopicMeta = {
  id: 'gear-tooth-bending',
  title: 'Spur Gear Tooth Bending Stress (Lewis Equation)',
  duration: '18m',
  level: 'Advanced',
  summary: 'How gear tooth geometry and tangential tooth load set the bending stress at the tooth root.',
  description:
    'A gear tooth is a stubby cantilever beam, loaded near its tip by the mating tooth — so the same flexure formula from beam bending applies, just packaged for gear geometry through the Lewis form factor. Add the fact that only one tooth (or briefly two) actually carries the full load at any instant, and gear design becomes a beam-bending problem wearing a different notation.',
  status: 'active',
  learningObjectives: [
    'Apply the Lewis equation to estimate bending stress at a gear tooth root',
    'Relate transmitted torque and pitch diameter to tangential tooth load',
    'Explain why tooth count changes the Lewis form factor and therefore tooth strength',
  ],
  formulas: [
    { label: 'Pitch diameter', formula: 'd = N / P_d', latex: 'd = \\frac{N}{P_d}', note: 'N = number of teeth, P_d = diametral pitch in teeth per inch.' },
    { label: 'Tangential tooth load from transmitted torque', formula: 'W^t = 2T / d', latex: 'W^t = \\frac{2T}{d}', note: 'T = transmitted torque, d = pitch diameter.' },
    { label: 'Lewis bending stress', formula: 'σ = W^t P_d / (F Y)', latex: '\\sigma = \\frac{W^t P_d}{F Y}', note: 'F = face width, Y = Lewis form factor (depends on tooth count; 0.322 for 20 teeth at 20° pressure angle).', emphasis: true },
    { label: 'Velocity factor (hobbed or shaped teeth)', formula: 'K_v = (1200 + V) / 1200', latex: 'K_v = \\frac{1200 + V}{1200}', note: 'V = pitch-line velocity in ft/min; stress is multiplied by K_v to allow for dynamic loading.' },
  ],
  workedExample: {
    given: 'A 20-tooth spur gear (20° pressure angle, Lewis form factor Y = 0.322), diametral pitch P_d = 8 teeth/in, face width F = 1.25 in, transmits a torque T = 850 lbf·in.',
    find: 'The tooth-root bending stress.',
    steps: [
      'Pitch diameter: d = N / P_d = 20 / 8 = 2.5 in',
      'W^t = 2T / d = 2(850) / 2.5 = 680 lbf',
      'σ = W^t P_d / (F Y) = 680(8) / (1.25 × 0.322) ≈ 13,516 psi',
    ],
    answer: 'About 13,500 psi (≈93 MPa) at the tooth root — the number every gear-tooth fatigue check starts from. (Note: with 20 teeth at P_d = 8 the pitch diameter is fixed at 2.5 in; it cannot be chosen independently.)',
  },
  challenges: [
    'Keep the pitch diameter fixed at 2.5 in but cut the tooth count from 40 to 20 (so P_d drops from 16 to 8). Y falls from about 0.389 to 0.322 — yet the root stress falls by roughly 40%. Why does the coarser pitch more than compensate?',
    'Double the transmitted torque at a fixed gear size. By what factor does the tooth-root bending stress increase?',
    'Turn on a shaft speed of 1750 rpm in the playground. How much does the velocity factor add to the stress, and why does it grow with pitch diameter?',
  ],
  applications: [
    'Sizing gearbox teeth for a wind-turbine planetary stage',
    'Checking an automotive transmission gear against tooth-root fatigue',
    'Selecting a robotics gearhead rated for the motor’s peak torque',
  ],
  references: [
    { label: 'MIT 2.72 — Lecture 13: Gears II, mechanics and selection', url: MIT_272_LEC13 },
  ],
}

const beltChainDrives: TopicMeta = {
  id: 'belt-chain-drives',
  title: 'Belt & Chain Drives',
  duration: '15m',
  level: 'Beginner',
  summary: 'Speed ratio and the belt tension ratio that sets how much power a flat or V-belt can actually transmit before it slips.',
  description:
    'A belt drive transmits power entirely through friction between the belt and the pulley, which means there is a hard limit on how much tension difference the belt can sustain before it slips — set by the coefficient of friction and how far the belt wraps around the pulley. Push past that limit and adding more motor torque does nothing except make the belt slip faster.',
  status: 'active',
  learningObjectives: [
    'Compute the speed ratio and belt tension ratio for a flat or V-belt drive',
    'Use the capstan equation to find the maximum power a belt can transmit before slipping',
    "Explain why wrap angle and friction coefficient — not motor torque alone — set a belt drive's capacity",
  ],
  formulas: [
    { label: 'Speed ratio', formula: 'N2 / N1 = d1 / d2', latex: '\\frac{N_2}{N_1} = \\frac{d_1}{d_2}', note: 'Output speed set purely by the ratio of pulley diameters, same as gears. For a chain, use sprocket tooth counts: N₂/N₁ = z₁/z₂.' },
    { label: 'Wrap angle on the smaller pulley (open belt)', formula: 'θ = π − 2 asin((d₂ − d₁) / 2C)', latex: '\\theta = \\pi - 2\\arcsin\\frac{d_2 - d_1}{2C}', note: 'C = center distance; moving pulleys apart lengthens the belt run but shrinks the difference in wrap on the two pulleys.' },
    { label: 'Belt tension ratio (capstan equation)', formula: 'T1 / T2 = e^(μθ)', latex: '\\frac{T_1}{T_2} = e^{\\mu\\theta}', note: 'μ = friction coefficient, θ = wrap angle in radians; the maximum tension ratio before slipping. For a V-belt use μ / sin(β/2) in place of μ.', emphasis: true },
    { label: 'Power transmitted', formula: 'P = (T1 − T2)·v', latex: 'P = (T_1 - T_2)v', note: 'v = belt speed; only the difference in tension does useful work, the rest is just belt preload.' },
  ],
  workedExample: {
    given: 'A flat-belt drive: driving pulley d1 = 150 mm at N1 = 1750 rpm, driven pulley d2 = 300 mm, center distance C = 432 mm (which gives a wrap angle on the small pulley of θ = 160° = 2.79 rad), friction coefficient μ = 0.3, tight-side tension T1 = 500 N.',
    find: 'The output speed, the slack-side tension, and the power transmitted.',
    steps: [
      'Speed ratio: N2 = N1 d1/d2 = 1750(150)/300 = 875 rpm',
      'Capstan equation: T1/T2 = e^(μθ) = e^(0.3×2.79) ≈ 2.31 → T2 = 500/2.31 ≈ 216 N',
      'Belt speed: v = π d1 N1 / 60 = π(0.15)(1750)/60 ≈ 13.7 m/s',
      'P = (T1 − T2) v = (500 − 216)(13.7) ≈ 3.9 kW',
    ],
    answer: 'This belt drives the output pulley at 875 rpm and transmits about 3.9 kW before it is at the edge of slipping.',
  },
  challenges: [
    'Shrink the wrap angle by moving the pulleys closer together (or using a smaller pulley). Does the belt’s power capacity go up or down before it slips?',
    'Double the friction coefficient (switch to a higher-grip belt material). By what factor does the maximum tension ratio change — is it a factor of 2?',
    'Switch the playground to chain mode. Why does a chain drive have no capstan limit, and what limits its power instead?',
  ],
  applications: [
    'Sizing a timing belt for an engine’s camshaft drive',
    'Selecting a conveyor drive chain and sprocket ratio',
    'Choosing bicycle chainring and sprocket sizes for a target gear ratio',
  ],
  references: [
    { label: 'MIT 2.72 — Lecture 12: Drives II, belt and friction drives', url: MIT_272_LEC12 },
  ],
}

export const EXTRA_TOPICS: { courseId: string; topics: TopicMeta[] }[] = [
  { courseId: 'machine-design', topics: [gearToothBending, beltChainDrives] },
]

const ES = 'https://engineeringstatics.org'

export const NEW_COURSES: CourseMeta[] = [
  {
    id: 'engineering-statics',
    code: 'Statics',
    title: 'Engineering Statics',
    symbol: 'ΣF = 0',
    category: 'Mechanics of solids',
    description: 'How bodies and structures stay at rest: free-body diagrams, support reactions, trusses, friction, and the section properties that feed every later strength calculation.',
    prerequisites: ['Calculus I', 'Vectors & trigonometry'],
    references: [
      { label: 'MIT OCW — 1.050 Engineering Mechanics I (Fall 2007)', url: 'https://ocw.mit.edu/courses/1-050-engineering-mechanics-i-fall-2007/' },
      { label: 'Engineering Statics: Open and Interactive (Baker & Haynes)', url: `${ES}/` },
      { label: 'Penn State — Mechanics Map', url: 'https://mechanicsmap.psu.edu/' },
    ],
    topics: [
      {
        id: 'statics-equilibrium',
        title: 'Force Equilibrium & Free-Body Diagrams',
        duration: '16m',
        level: 'Beginner',
        summary: 'Isolate a body, draw every force and moment on it, and solve ΣF = 0 and ΣM = 0 for the support reactions in 2D and 3D.',
        description:
          'Every statics problem starts with the free-body diagram: cut the body free of its surroundings and replace each support with the forces and moments it can actually supply — a pin gives two force components, a roller gives one, a fixed wall gives two forces and a moment. A body at rest must then satisfy three scalar equations in 2D (ΣFx, ΣFy, ΣM) and six in 3D, so the number of unknown reactions tells you immediately whether the problem is solvable by statics alone.',
        status: 'active',
        learningObjectives: [
          'Draw a free-body diagram that replaces supports with the reactions they can supply',
          'Write and solve the planar equilibrium equations ΣFx = 0, ΣFy = 0, ΣM = 0',
          'Replace a uniform load by its resultant, and solve a 3D plate on three supports with six-equation equilibrium',
        ],
        formulas: [
          { label: 'Planar force equilibrium', formula: 'ΣFx = 0,  ΣFy = 0', latex: '\\sum F_x = 0,\\quad \\sum F_y = 0', note: 'Include every applied load and every support reaction acting on the isolated body.' },
          { label: 'Moment equilibrium', formula: 'ΣM_A = 0', latex: '\\sum M_A = 0', note: 'Pick the moment point where most unknowns act (usually a pin) so they drop out of the equation.', emphasis: true },
          { label: 'Uniform load resultant', formula: 'R = wL at L/2', latex: 'R = wL \\ \\text{at}\\ x = L/2', note: 'A distributed load acts like a single force equal to its area, placed at the load centroid.' },
          { label: '3D equilibrium', formula: 'ΣF = 0, ΣM = 0 (6 scalar equations)', latex: '\\sum \\vec F = \\vec 0,\\quad \\sum \\vec M = \\vec 0', note: 'Three force and three moment components. A plate on three vertical supports uses ΣFz, ΣMx, ΣMy.' },
        ],
        workedExample: {
          given: 'A simply supported beam of span L = 6 m has a pin at A and a roller at B. It carries a 12 kN downward point load 2 m from A and a uniform load w = 3 kN/m over the whole span.',
          find: 'The support reactions A_x, A_y and B_y.',
          steps: [
            'UDL resultant: R = wL = 3(6) = 18 kN, acting at x = 3 m',
            'ΣM_A = 0: B_y(6) − 12(2) − 18(3) = 0 → B_y = (24 + 54)/6 = 13 kN',
            'ΣFy = 0: A_y + 13 − 12 − 18 = 0 → A_y = 17 kN',
            'ΣFx = 0: no horizontal load → A_x = 0',
          ],
          answer: 'A_y = 17 kN, B_y = 13 kN, A_x = 0. The reactions add to the total 30 kN load, and taking moments about B instead (A_y·6 = 12·4 + 18·3 = 102) gives the same A_y = 17 kN.',
        },
        challenges: [
          'Slide the 12 kN load toward the roller at B. What happens to B_y and A_y, and what is the limit as the load reaches B?',
          'Tilt the load to 225° (down and to the left) in the playground. Which reaction components change, and which stay the same?',
          'In the 3D plate mode, move the load outside the triangle ABC. What does a negative reaction at A mean physically?',
        ],
        applications: [
          'Finding the reactions on bridge bearings before sizing the abutments',
          'Sizing a shelf bracket or crane jib support from the tipping moment',
          'Checking the stability of a three-legged stand or tripod under an off-center load',
        ],
        references: [
          { label: 'Engineering Statics (Baker & Haynes) — Rigid Body Equilibrium', url: `${ES}/Chapter_05.html` },
          { label: 'Engineering Statics (Baker & Haynes) — Moments and Static Equivalence', url: `${ES}/Chapter_04.html` },
        ],
      },
      {
        id: 'statics-truss',
        title: 'Truss Analysis: Joints & Sections',
        duration: '20m',
        level: 'Intermediate',
        summary: 'Find the axial force in every member of a truss with the method of joints, and check key members with the method of sections.',
        description:
          'A truss is a set of straight two-force members joined at pins and loaded only at the joints, so every member carries pure tension or compression along its axis. Because each pin must itself be in equilibrium, writing ΣFx = ΣFy = 0 at every joint gives a linear system whose unknowns are the member forces and support reactions — and when members plus reactions equal twice the number of joints, that system has exactly one solution. The method of sections cuts the truss in two and uses a single moment equation to get one member force directly, a powerful check on the joint-by-joint answer.',
        status: 'active',
        learningObjectives: [
          'Test whether a planar truss is statically determinate using m + r = 2j',
          'Solve joint equilibrium to find tension and compression in each member',
          'Use a section cut and a moment equation to verify a chord force as M / h',
        ],
        formulas: [
          { label: 'Determinacy count', formula: 'm + r = 2j', latex: 'm + r = 2j', note: 'm = members, r = support reactions, j = joints. Fewer unknowns than equations means a mechanism; more means indeterminate.' },
          { label: 'Method of joints', formula: 'ΣFx = 0,  ΣFy = 0 at each pin', latex: '\\sum F_x = 0,\\quad \\sum F_y = 0\\ \\text{at each joint}', note: 'Assume every member is in tension; a negative result means compression.', emphasis: true },
          { label: 'Method of sections', formula: 'ΣM_joint = 0 on the cut piece', latex: '\\sum M_{\\text{joint}} = 0\\ \\text{on one side of a cut}', note: 'Cut at most three members with unknowns, and take moments about the joint where two of them meet.' },
          { label: 'Chord force from the bending moment', formula: 'F_chord ≈ M / h', latex: 'F_{\\text{chord}} \\approx \\frac{M}{h}', note: 'The truss carries bending moment as a couple of chord forces separated by the depth h: top chord in compression, bottom chord in tension under downward load.' },
        ],
        workedExample: {
          given: 'A Warren truss with two panels: span L = 8 m, depth h = 3 m, bottom joints A (0,0), M (4,0), B (8,0) and top joints T1 (2,3), T2 (6,3). Pin at A, roller at B, vertical load P = 20 kN at M.',
          find: 'The reactions and the forces in members AM, AT1 and T1T2.',
          steps: [
            'Symmetry (or ΣM_A = 0): A_y = B_y = 10 kN, A_x = 0',
            'Diagonal AT1 has length √(2² + 3²) = 3.606 m, so its vertical share is 3/3.606. Joint A, ΣFy: 10 + F_AT1(3/3.606) = 0 → F_AT1 = −12.02 kN (compression)',
            'Joint A, ΣFx: F_AM + F_AT1(2/3.606) = 0 → F_AM = +6.67 kN (tension)',
            'Section check on the top chord: M at midspan = 10(4) = 40 kN·m, so F_T1T2 = −M/h = −40/3 = −13.33 kN (compression); joint T1 gives the same result',
          ],
          answer: 'A_y = B_y = 10 kN; AM = 6.67 kN (T), AT1 = 12.02 kN (C), top chord T1T2 = 13.33 kN (C). The loaded diagonals MT1 and MT2 are in tension at 12.02 kN.',
        },
        challenges: [
          'Increase the number of panels while keeping span and load fixed. How does the largest chord force change, and why does the diagonal force change much less?',
          'Move the load from the middle joint to joint 1 (near the pin). Which members change from tension to compression?',
          'Double the truss depth h. By what factor do the chord forces change?',
        ],
        applications: [
          'Sizing the chords and diagonals of a roof truss or footbridge',
          'Checking a crane boom or transmission-tower lattice for the worst-loaded member',
          'Identifying zero-force members that can be removed or used only for bracing',
        ],
        references: [
          { label: 'Engineering Statics (Baker & Haynes) — Equilibrium of Structures (trusses)', url: `${ES}/Chapter_06.html` },
          { label: 'MIT OCW 1.050 — Lecture Notes (Engineering Mechanics I)', url: 'https://ocw.mit.edu/courses/1-050-engineering-mechanics-i-fall-2007/pages/lecture-notes/' },
        ],
      },
      {
        id: 'statics-friction',
        title: 'Dry Friction: Wedges, Inclines & Belt Friction',
        duration: '17m',
        level: 'Intermediate',
        summary: 'Use Coulomb friction at the point of impending slip to analyze blocks on inclines, wedges, and ropes wrapped around posts.',
        description:
          'Dry friction can only supply as much force as the situation demands, up to a limit F = μsN; the moment that limit is reached the body is on the verge of slipping, and the contact force leans from the surface normal by the friction angle φ = atan μs. Setting friction to this limit turns a vague inequality into an equation, and the same idea explains why a gently sloped wedge stays put when you stop pushing it, and why a few turns of rope around a post let a child hold back a boat.',
        status: 'active',
        learningObjectives: [
          'State Coulomb’s friction law and identify when a body is at impending slip',
          'Find the range of applied force that keeps a block at rest on an incline',
          'Determine the force to drive a wedge and whether it is self-locking (θ ≤ 2φ)',
          'Apply the capstan relation T1/T2 = e^(μβ) to a rope wrapped around a fixed post',
        ],
        formulas: [
          { label: 'Coulomb friction limit', formula: 'F ≤ μs N', latex: 'F \\le \\mu_s N', note: 'Friction can be anything from zero up to μs N; at impending slip F = μs N exactly.', emphasis: true },
          { label: 'Friction angle', formula: 'φ = atan μs', latex: '\\varphi = \\tan^{-1}\\mu_s', note: 'A block on an incline starts to slide when the slope angle exceeds φ (the angle of repose).' },
          { label: 'Push range on an incline', formula: 'W(sin α − μ cos α) ≤ P ≤ W(sin α + μ cos α)', latex: 'W(\\sin\\alpha - \\mu\\cos\\alpha) \\le P \\le W(\\sin\\alpha + \\mu\\cos\\alpha)', note: 'P pushes up the slope; below the lower bound the block slides down, above the upper bound it slides up.' },
          { label: 'Wedge driving force', formula: 'P = W[tan(θ + φ) + tan φ]', latex: 'P = W\\left[\\tan(\\theta+\\varphi) + \\tan\\varphi\\right]', note: 'For a wedge lifting a vertically guided block with friction μ on both faces. Self-locking when θ ≤ 2φ.' },
          { label: 'Belt (capstan) friction', formula: 'T1 / T2 = e^(μβ)', latex: '\\frac{T_1}{T_2} = e^{\\mu\\beta}', note: 'β = total wrap angle in radians (2π per full turn); independent of the post radius.' },
        ],
        workedExample: {
          given: 'A 500 N block rests on a 20° incline with μs = 0.35. A wedge (θ = 10°, μs = 0.3 on both faces) lifts a 1000 N guided block, and a rope with μs = 0.25 wraps 1.5 turns around a post.',
          find: 'The range of up-slope push that holds the block, the wedge driving force, and the rope holding force against a 2000 N load.',
          steps: [
            'Incline: N = 500 cos 20° = 469.8 N, so F_max = 0.35(469.8) = 164.4 N and the down-slope pull is 500 sin 20° = 171.0 N',
            'P_min = 171.0 − 164.4 ≈ 6.6 N; P_max = 171.0 + 164.4 ≈ 335.5 N',
            'Wedge: φ = atan 0.3 = 16.70°; P = 1000[tan(26.70°) + 0.3] = 1000(0.5029 + 0.3) ≈ 803 N. Since θ = 10° ≤ 2φ = 33.4°, the wedge is self-locking',
            'Rope: β = 2π(1.5) = 9.425 rad, e^(0.25 × 9.425) = 10.55, so T2 = 2000 / 10.55 ≈ 190 N',
          ],
          answer: 'The block stays put for 6.6 N ≤ P ≤ 335.5 N (it would slide down with no push). The wedge needs about 803 N to drive and stays in when released, and 190 N of hand pull holds a 2000 N load.',
        },
        challenges: [
          'Raise the incline angle past φ = atan μs in the playground. What does the minimum holding force P_min do, and what does that tell you about self-locking?',
          'Add one more turn of rope in capstan mode. By what factor does the holding force change — and does it depend on the post diameter?',
          'In wedge mode, find the wedge angle at which the wedge just stops being self-locking for μ = 0.3.',
        ],
        applications: [
          'Designing a door stop, shim or wedge anchor that must stay put once driven',
          'Choosing the number of rope turns on a boat cleat or winch capstan',
          'Setting the slope of a conveyor or chute so material neither slides early nor sticks',
        ],
        references: [
          { label: 'Engineering Statics (Baker & Haynes) — Friction', url: `${ES}/Chapter_09.html` },
        ],
      },
      {
        id: 'statics-centroids',
        title: 'Centroids & Area Moments of Inertia',
        duration: '18m',
        level: 'Intermediate',
        summary: 'Find the centroid and the second moment of area of composite cross-sections using the parallel-axis theorem.',
        description:
          'A cross-section’s centroid is its geometric balance point, and its second moment of area measures how far its material sits from a chosen axis — squared. Real beams are rarely a single rectangle, so engineers split them into simple parts, locate the composite centroid from an area-weighted average, then shift each part’s own moment of inertia to that centroid with the parallel-axis theorem. Holes are handled as negative parts. The result I is exactly what the bending formula σ = Mc/I needs.',
        status: 'active',
        learningObjectives: [
          'Compute the centroid of a composite area from the area-weighted average of its parts',
          'Apply the parallel-axis theorem to get the moment of inertia about the composite centroid',
          'Treat holes as negative areas, and compute section modulus S = I / c',
        ],
        formulas: [
          { label: 'Composite centroid', formula: 'ȳ = ΣAᵢyᵢ / ΣAᵢ', latex: '\\bar y = \\frac{\\sum A_i y_i}{\\sum A_i}', note: 'Measure every yᵢ from the same reference line; holes carry negative area.', emphasis: true },
          { label: 'Parallel-axis theorem', formula: 'I = Σ(Īᵢ + Aᵢ dᵢ²)', latex: 'I = \\sum \\left(\\bar I_i + A_i d_i^2\\right)', note: 'Īᵢ = part’s moment of inertia about its own centroid; dᵢ = distance from the part centroid to the composite centroid.' },
          { label: 'Rectangle and circle', formula: 'I_rect = b h³ / 12,  I_circ = π d⁴ / 64', latex: 'I_{\\text{rect}} = \\frac{b h^3}{12},\\quad I_{\\text{circ}} = \\frac{\\pi d^4}{64}', note: 'About the centroidal axis; h is the dimension perpendicular to that axis.' },
          { label: 'Section modulus', formula: 'S = I / c', latex: 'S = \\frac{I}{c}', note: 'c = distance from the centroid to the extreme fiber; then σ_max = M / S.' },
        ],
        workedExample: {
          given: 'A T-section: flange 100 mm × 20 mm on top of a web 20 mm wide × 80 mm tall (total height 100 mm). Measure y upward from the bottom of the web.',
          find: 'The centroid height ȳ and the centroidal moment of inertia I_x.',
          steps: [
            'Areas: A_flange = 100(20) = 2000 mm² at y = 90 mm; A_web = 20(80) = 1600 mm² at y = 40 mm',
            'ȳ = (2000·90 + 1600·40) / 3600 = 244,000 / 3600 ≈ 67.78 mm',
            'Web: Ī = 20·80³/12 = 853,333 mm⁴, d = 27.78 mm, A d² = 1600(27.78)² = 1,234,568 mm⁴',
            'Flange: Ī = 100·20³/12 = 66,667 mm⁴, d = 22.22 mm, A d² = 2000(22.22)² = 987,654 mm⁴',
            'I_x = 853,333 + 1,234,568 + 66,667 + 987,654 ≈ 3.142 × 10⁶ mm⁴',
          ],
          answer: 'The centroid is 67.8 mm above the base and I_x ≈ 3.14 × 10⁶ mm⁴. The section modulus is S = I/c ≈ 97,500 mm³ at the top fiber (c = 32.2 mm) and 46,400 mm³ at the bottom (c = 67.8 mm).',
        },
        challenges: [
          'Make the T-section flange thicker and wider. How does the centroid move, and why does Ix grow much faster than the area?',
          'Switch to the I-section and compare its Ix with the T-section of the same material area. Why is a symmetric I a better beam?',
          'In the plate-with-hole mode, enlarge the hole toward the plate edge. What happens to area, Ix and the section modulus?',
        ],
        applications: [
          'Selecting a steel beam section for a floor or gantry from its Ix and S',
          'Finding the neutral axis of a composite beam before computing bending stress',
          'Estimating stiffness of an extruded aluminum profile or machine frame member',
        ],
        references: [
          { label: 'Engineering Statics (Baker & Haynes) — Centroids and Centers of Gravity', url: `${ES}/Chapter_07.html` },
          { label: 'Engineering Statics (Baker & Haynes) — Moments of Inertia', url: `${ES}/Chapter_10.html` },
        ],
      },
    ],
  },
]
