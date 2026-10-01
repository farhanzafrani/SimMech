/**
 * Slice: dynamics-controls
 * - EXTRA_TOPICS appends three topics to the existing `engineering-dynamics` course.
 * - NEW_COURSES adds the `control-systems` course (MIT 2.004 style) with four topics.
 * Every worked example below was reproduced with the matching engine function.
 */

import type { CourseMeta, TopicMeta } from '../curriculum'

const OCW_2003SC = 'https://ocw.mit.edu/courses/2-003sc-engineering-dynamics-fall-2011'
const OCW_2004 = 'https://ocw.mit.edu/courses/2-004-systems-modeling-and-control-ii-fall-2007'
const LIBRETEXTS_WOOLF = 'https://eng.libretexts.org/Bookshelves/Industrial_and_Systems_Engineering/Chemical_Process_Dynamics_and_Controls_(Woolf)'

const rigidBodyKinetics: TopicMeta = {
  id: 'rigid-body-kinetics',
  title: 'Rigid-Body Planar Kinetics',
  duration: '18m',
  level: 'Advanced',
  summary: 'F = ma for the centre of mass, M = Iα for the spin, and the friction that decides whether a wheel rolls or slips.',
  description:
    'Kinematics told us how a rigid body can move; kinetics asks what forces make it move that way. In planar motion two equations about the mass centre govern everything: the net force sets the acceleration of G, and the net moment about G sets the angular acceleration. A rolling wheel adds one more link, a = αr, and that single constraint is why a hoop, a cylinder and a sphere released on the same ramp finish in a fixed order that does not depend on their mass or size.',
  status: 'active',
  learningObjectives: [
    'Draw a free-body diagram and write ΣF = m·a_G and ΣM_G = I_G·α for a body in planar motion',
    'Use the rolling constraint a_G = αr to solve for acceleration and the friction force on an incline',
    'Decide whether a body rolls or slips by comparing the friction needed with the friction available',
  ],
  formulas: [
    { label: 'Translation of the mass centre', formula: 'ΣF = m a_G', latex: '\\sum \\vec F = m\\,\\vec a_G', note: 'Net external force gives the acceleration of the centre of mass, no matter where the forces act.', emphasis: true },
    { label: 'Rotation about the mass centre', formula: 'ΣM_G = I_G α', latex: '\\sum M_G = I_G\\,\\alpha', note: 'Net moment about G equals the moment of inertia about G times the angular acceleration.', emphasis: true },
    { label: 'Rolling without slipping', formula: 'a_G = α r', latex: 'a_G = \\alpha\\, r', note: 'The contact point has zero velocity, so centre speed and spin are locked together.' },
    { label: 'Acceleration down an incline', formula: 'a = g sinθ / (1 + k²)', latex: 'a = \\frac{g\\sin\\theta}{1 + k^2},\\quad k^2 = \\frac{I_G}{m r^2}', note: 'k² is 1/2 for a solid cylinder, 2/5 for a solid sphere, 1 for a hoop; mass and radius drop out.' },
    { label: 'Friction needed to keep rolling', formula: 'μ ≥ tanθ · k² / (1 + k²)', latex: '\\mu \\ge \\tan\\theta\\,\\frac{k^2}{1+k^2}', note: 'If the available μ is smaller, the body slips and kinetic friction μN applies instead.' },
  ],
  workedExample: {
    given: 'A solid cylinder (m = 10 kg, r = 0.2 m, I_G = ½mr² = 0.2 kg·m²) is released from rest on a 30° incline with μ = 0.5 and travels s = 3 m along the slope. Take g = 9.81 m/s².',
    find: 'Whether it rolls without slipping, its acceleration, the friction force, and its speed and time after 3 m.',
    steps: [
      'Rolling assumption: ΣF∥ gives mg sinθ − f = m a, and ΣM_G gives f r = I_G α = ½ m r² (a/r), so f = ½ m a.',
      'Substitute: mg sinθ = (3/2) m a, so a = (2/3) g sinθ = (2/3)(9.81)(0.5) = 3.27 m/s².',
      'Friction needed: f = ½ m a = ½(10)(3.27) = 16.35 N, and N = mg cosθ = 84.96 N.',
      'Check: μ needed = f/N = 0.192, which is below the available 0.5, so the cylinder rolls without slipping.',
      'Speed after s = 3 m: v = √(2as) = √(2 × 3.27 × 3) = 4.43 m/s (energy check: v² = 2gh/(1+k²) = 2(9.81)(1.5)/1.5 = 19.62). Time t = v/a = 1.35 s.',
    ],
    answer: 'It rolls without slipping at a = 3.27 m/s², needs only 16.35 N of friction (μ ≥ 0.19), and reaches 4.43 m/s after 1.35 s.',
  },
  challenges: [
    'Double the mass and double the radius. Does the acceleration of a rolling cylinder change? Explain using k².',
    'Lower μ below the value needed to roll. What happens to the acceleration and to the spin rate, and why does the body now beat the rolling case to the bottom?',
    'Rank the hoop, solid cylinder, solid sphere and spherical shell by arrival time at the bottom of the same ramp.',
  ],
  applications: [
    'Predicting wheel spin versus grip when a vehicle accelerates or brakes on a slope',
    'Sizing the traction needed for a rolling robot or cart before it starts to slip',
    'Ball-bearing and roller dynamics in rolling-element machinery',
  ],
  references: [
    { label: 'MIT OCW 2.003SC — Free Body Diagrams and Fictitious Forces', url: `${OCW_2003SC}/pages/free-body-diagrams-and-fictitious-forces/` },
    { label: 'MIT OCW 2.003SC — Angular Momentum and Motion of Rotating Rigid Bodies', url: `${OCW_2003SC}/pages/angular-momentum-and-motion-of-rotating-rigid-bodies/` },
    { label: 'MIT OCW 2.003SC — Finding Equations of Motion for Rigid Body Rotation', url: `${OCW_2003SC}/pages/finding-equations-of-motion-for-rigid-body-rotation/` },
  ],
}

const freeVibration: TopicMeta = {
  id: 'free-vibration',
  title: 'Free & Damped Vibration',
  duration: '19m',
  level: 'Intermediate',
  summary: 'The one equation behind every spring-mass-damper: natural frequency, damping ratio, and how a disturbance dies away.',
  description:
    'Pluck a guitar string, bump a car over a curb, tap a building: strike a system with an initial disturbance and it rings down in a pattern fixed by only two numbers, the natural frequency and the damping ratio. Lightly damped systems oscillate inside an exponential envelope; heavily damped systems creep back without crossing zero. The critically damped case in between is the fastest return with no overshoot, and it is the design target for many suspensions and door closers.',
  status: 'active',
  learningObjectives: [
    'Write the equation of motion of a single-DOF mass-spring-damper and extract ωₙ and ζ',
    'Classify a response as underdamped, critically damped or overdamped from ζ',
    'Estimate damping from the logarithmic decrement and predict settling time',
  ],
  formulas: [
    { label: 'Equation of motion', formula: 'm ẍ + c ẋ + k x = 0', latex: 'm\\ddot x + c\\dot x + kx = 0', note: 'Free vibration of a single degree-of-freedom system with viscous damping.', emphasis: true },
    { label: 'Natural frequency & damping ratio', formula: 'ωₙ = √(k/m),  ζ = c / (2√(km))', latex: '\\omega_n = \\sqrt{\\tfrac{k}{m}},\\quad \\zeta = \\frac{c}{2\\sqrt{km}}', note: 'ζ = 1 is critical damping; c_c = 2√(km).' },
    { label: 'Underdamped response', formula: 'x(t) = e^(−ζωₙt)(A cos ω_d t + B sin ω_d t)', latex: 'x(t) = e^{-\\zeta\\omega_n t}\\left(A\\cos\\omega_d t + B\\sin\\omega_d t\\right)', note: 'With ω_d = ωₙ√(1−ζ²); A = x₀ and B = (v₀ + ζωₙx₀)/ω_d.' },
    { label: 'Logarithmic decrement', formula: 'δ = ln(x₁/x₂) = 2πζ / √(1−ζ²)', latex: '\\delta = \\ln\\frac{x_1}{x_2} = \\frac{2\\pi\\zeta}{\\sqrt{1-\\zeta^2}}', note: 'Measure two successive peaks to find ζ experimentally.' },
    { label: 'Settling time (2%)', formula: 't_s ≈ 4 / (ζωₙ)', latex: 't_s \\approx \\frac{4}{\\zeta\\omega_n}', note: 'Time for the envelope to fall to about 2% of its start.' },
  ],
  workedExample: {
    given: 'A mass m = 2 kg on a spring k = 800 N/m with a damper c = 8 N·s/m is pulled 50 mm and released from rest.',
    find: 'ωₙ, ζ, the damped period, how much each peak shrinks, and the settling time.',
    steps: [
      'ωₙ = √(k/m) = √(800/2) = 20 rad/s (3.18 Hz).',
      'Critical damping c_c = 2√(km) = 2√(1600) = 80 N·s/m, so ζ = 8/80 = 0.10: strongly underdamped.',
      'ω_d = ωₙ√(1−ζ²) = 20√0.99 = 19.90 rad/s, so the damped period is 2π/19.90 = 0.316 s.',
      'δ = 2πζ/√(1−ζ²) = 0.631, so each peak is e^0.631 = 1.88 times larger than the next (the second peak is about 26.6 mm).',
      't_s ≈ 4/(ζωₙ) = 4/(0.1 × 20) = 2.0 s.',
    ],
    answer: 'The mass rings at 19.9 rad/s (0.316 s per cycle), loses about 47% of its amplitude each cycle (peak ratio 1.88), and is within 2% of rest after about 2 s.',
  },
  challenges: [
    'Sweep ζ from 0 to 2 with k and m fixed. At what ζ does the response stop crossing zero, and what happens to the settling time beyond that point?',
    'Quadruple the mass with k fixed. How do ωₙ and the period change, and what must c become to keep ζ the same?',
    'Two successive peaks measure 10 mm and 6 mm. What is ζ?',
  ],
  applications: [
    'Tuning shock absorbers so a car settles after a bump without bouncing',
    'Damped door closers and hydraulic dampers that return without slamming',
    'Estimating structural damping of a bridge or tower from a decay test',
  ],
  references: [
    { label: 'MIT OCW 2.003SC — Mechanical Vibration', url: `${OCW_2003SC}/pages/mechanical-vibration/` },
    { label: 'MIT OCW 2.003J Dynamics and Control I (Fall 2007)', url: 'https://ocw.mit.edu/courses/2-003j-dynamics-and-control-i-fall-2007/' },
  ],
}

const forcedVibration: TopicMeta = {
  id: 'forced-vibration',
  title: 'Forced Vibration & Resonance',
  duration: '20m',
  level: 'Advanced',
  summary: 'Why shaking a system near its natural frequency is dangerous, and how to place a machine on mounts so the floor barely feels it.',
  description:
    'Drive a mass-spring-damper with a steady sinusoidal force and, after the transient dies, it settles into the frequency of the drive, not its own. How big the motion is depends on the frequency ratio r = ω/ωₙ: low-frequency forcing just moves the mass quasi-statically, forcing near r = 1 is amplified by roughly 1/(2ζ), and forcing well above resonance barely moves it at all. The same curve gives the transmissibility, which says how much of a machine’s shaking force reaches the floor, and why soft mounts only isolate once r exceeds √2.',
  status: 'active',
  learningObjectives: [
    'Compute the steady-state amplitude and phase of a harmonically forced damped system',
    'Locate resonance and estimate the peak amplification from the damping ratio',
    'Use the transmissibility curve to choose mounts that isolate a vibrating machine',
  ],
  formulas: [
    { label: 'Forced equation of motion', formula: 'm ẍ + c ẋ + k x = F₀ sin ωt', latex: 'm\\ddot x + c\\dot x + kx = F_0\\sin\\omega t', note: 'Steady state oscillates at the drive frequency ω.', emphasis: true },
    { label: 'Magnification factor', formula: 'M = 1 / √((1−r²)² + (2ζr)²)', latex: 'M = \\frac{1}{\\sqrt{(1-r^2)^2 + (2\\zeta r)^2}},\\quad r=\\frac{\\omega}{\\omega_n}', note: 'Amplitude is X = (F₀/k)·M; at r = 1, M = 1/(2ζ).' },
    { label: 'Phase lag', formula: 'φ = atan2(2ζr, 1−r²)', latex: '\\varphi = \\operatorname{atan2}\\!\\left(2\\zeta r,\\ 1-r^2\\right)', note: 'Goes from 0° (below resonance) through 90° at r = 1 to 180° (above).' },
    { label: 'Transmissibility', formula: 'TR = √(1+(2ζr)²) / √((1−r²)²+(2ζr)²)', latex: 'TR = \\frac{\\sqrt{1+(2\\zeta r)^2}}{\\sqrt{(1-r^2)^2+(2\\zeta r)^2}}', note: 'Force through the mount is TR·F₀; TR < 1 only for r > √2.' },
    { label: 'Resonant peak', formula: 'r_peak = √(1−2ζ²)', latex: 'r_{peak} = \\sqrt{1-2\\zeta^2}', note: 'Displacement peaks slightly below r = 1 and only exists for ζ < 1/√2.' },
  ],
  workedExample: {
    given: 'A machine of m = 10 kg sits on a mount with k = 4000 N/m and c = 40 N·s/m (ωₙ = 20 rad/s, ζ = 0.1). It applies a 100 N force at ω = 60 rad/s.',
    find: 'The steady-state amplitude, phase and the force reaching the support, then compare with running at resonance.',
    steps: [
      'r = ω/ωₙ = 60/20 = 3, static deflection F₀/k = 100/4000 = 25 mm.',
      'M = 1/√((1−9)² + (2 × 0.1 × 3)²) = 1/√(64 + 0.36) = 0.1246, so X = 25 × 0.1246 = 3.12 mm.',
      'Phase φ = atan2(0.6, −8) = 175.7°: the mass moves almost opposite to the force.',
      'TR = √(1 + 0.36)/√64.36 = 0.1454, so the support sees 0.1454 × 100 = 14.5 N.',
      'At resonance (r = 1) the same system gives M = 1/(2ζ) = 5, X = 125 mm, TR = 5.10 and 510 N through the mount.',
    ],
    answer: 'At r = 3 the amplitude is 3.12 mm and only 14.5 N reaches the floor; at resonance it would be 125 mm and 510 N, 35 times worse.',
  },
  challenges: [
    'Sweep r from 0 to 3 with ζ = 0.05. Where does the peak sit, and how does it compare with 1/(2ζ)?',
    'Increase damping to ζ = 0.7. The resonant peak almost vanishes; what happens to transmissibility at r = 3, and why do isolators not use too much damping?',
    'A fan runs at 1200 rpm. What mount stiffness for a 50 kg fan puts it at r = 3?',
  ],
  applications: [
    'Isolating engines, compressors and HVAC units from building floors',
    'Keeping rotating-machinery critical speeds away from the operating speed',
    'Avoiding resonance in bridges, towers and pipe supports under periodic loads',
  ],
  references: [
    { label: 'MIT OCW 2.003SC — Mechanical Vibration', url: `${OCW_2003SC}/pages/mechanical-vibration/` },
    { label: 'MIT OCW 2.003SC — Reducing the Problem of Vibration and Intro to Multi-DOF Vibration', url: `${OCW_2003SC}/pages/reducing-problem-vibration-and-intro-to-multi-dof-vibration/` },
  ],
}

export const EXTRA_TOPICS: { courseId: string; topics: TopicMeta[] }[] = [
  { courseId: 'engineering-dynamics', topics: [rigidBodyKinetics, freeVibration, forcedVibration] },
]

const stepResponse: TopicMeta = {
  id: 'step-response',
  title: 'Step Response of 1st & 2nd-Order Systems',
  duration: '17m',
  level: 'Beginner',
  summary: 'Read rise time, overshoot and settling time straight off the pole locations of a first- or second-order system.',
  description:
    'The step response is the standard test of a control system: switch the input from 0 to 1 and watch how the output follows. A first-order system rises smoothly along an exponential set by one time constant. A second-order system has two poles and can overshoot and ring, with the damping ratio setting how much and the natural frequency setting how fast. Because many real plants behave like one of these two models near their operating point, a handful of formulas let you predict the response before you simulate anything.',
  status: 'active',
  learningObjectives: [
    'Compute the step response of K/(τs+1) and read off rise time and settling time',
    'Relate ζ and ωₙ of a second-order system to percent overshoot, peak time and settling time',
    'Connect pole locations on the s-plane to the shape of the time response',
  ],
  formulas: [
    { label: 'First-order step response', formula: 'y(t) = K (1 − e^(−t/τ))', latex: 'y(t) = K\\left(1 - e^{-t/\\tau}\\right)', note: 'Reaches 63.2% of K at t = τ; pole at s = −1/τ.', emphasis: true },
    { label: 'First-order specs', formula: 't_r ≈ 2.2τ,  t_s(2%) ≈ 3.9τ', latex: 't_r = \\tau\\ln 9 \\approx 2.2\\tau,\\quad t_s = \\tau\\ln 50 \\approx 3.9\\tau', note: 'Common shorthand is t_s ≈ 4τ.' },
    { label: 'Second-order plant', formula: 'G(s) = K ωₙ² / (s² + 2ζωₙs + ωₙ²)', latex: 'G(s) = \\frac{K\\omega_n^2}{s^2 + 2\\zeta\\omega_n s + \\omega_n^2}', note: 'Poles at s = −ζωₙ ± jωₙ√(1−ζ²).' },
    { label: 'Percent overshoot', formula: '%OS = 100·exp(−πζ/√(1−ζ²))', latex: '\\%OS = 100\\,e^{-\\pi\\zeta/\\sqrt{1-\\zeta^2}}', note: 'Depends on ζ only; ζ = 0.5 gives about 16%.', emphasis: true },
    { label: 'Peak time & settling time', formula: 't_p = π/ω_d,  t_s ≈ 4/(ζωₙ)', latex: 't_p = \\frac{\\pi}{\\omega_d},\\quad t_s \\approx \\frac{4}{\\zeta\\omega_n}', note: 'ω_d = ωₙ√(1−ζ²); settling is set by the real part of the poles.' },
  ],
  workedExample: {
    given: 'A second-order system with K = 1, ωₙ = 10 rad/s and ζ = 0.5.',
    find: 'Pole locations, percent overshoot, peak time and settling time.',
    steps: [
      'Poles: s = −ζωₙ ± jωₙ√(1−ζ²) = −5 ± j8.66.',
      'ω_d = 10√(1 − 0.25) = 8.66 rad/s.',
      '%OS = 100·exp(−π(0.5)/√0.75) = 100·exp(−1.814) = 16.3%.',
      't_p = π/ω_d = 3.1416/8.66 = 0.363 s.',
      't_s ≈ 4/(ζωₙ) = 4/5 = 0.80 s (the exact 2% band crossing from the closed-form response is 0.81 s).',
    ],
    answer: 'The response overshoots by 16.3%, peaks at 0.363 s and settles to within 2% in about 0.8 s.',
  },
  challenges: [
    'Hold ωₙ = 10 and sweep ζ from 0.1 to 1. How do overshoot and settling time trade off, and where is settling time shortest?',
    'Hold ζ = 0.5 and double ωₙ. Which specs change and which stay the same?',
    'A first-order system reaches 63% of its final value in 2 s. What are τ, t_s and the pole location?',
  ],
  applications: [
    'Specifying the response of a motor speed loop or thermostat',
    'Choosing a sensor with fast enough dynamics for a measurement',
    'Reading step-test data from a plant to fit a first- or second-order model',
  ],
  references: [
    { label: 'MIT OCW 2.004 — Lecture notes (Systems, Modeling, and Control II)', url: `${OCW_2004}/pages/lecture-notes/` },
    { label: 'MIT OCW 2.003J Dynamics and Control I (Fall 2007)', url: 'https://ocw.mit.edu/courses/2-003j-dynamics-and-control-i-fall-2007/' },
  ],
}

const pidTuning: TopicMeta = {
  id: 'pid-tuning',
  title: 'PID Control & Tuning',
  duration: '21m',
  level: 'Intermediate',
  summary: 'Combine proportional, integral and derivative action to make a loop fast, accurate and stable, and tune it on a process with dead time.',
  description:
    'PID control looks at the error three ways: how big it is now (P), how long it has persisted (I), and how fast it is changing (D). Proportional action alone leaves a steady offset; integral action removes it but can overshoot and oscillate; derivative action adds damping but amplifies noise. Dead time in the process limits how aggressive you can be. Classical rules such as Ziegler–Nichols give a starting point, but they are tuned for a quick response and usually need detuning to cut overshoot.',
  status: 'active',
  learningObjectives: [
    'Explain what each of P, I and D contributes to the closed-loop step response',
    'Apply the Ziegler–Nichols open-loop rules to a first-order-plus-dead-time process',
    'Detune a loop to trade speed against overshoot and read the effect on IAE',
  ],
  formulas: [
    { label: 'PID control law (standard form)', formula: 'u = Kp [ e + (1/Ti)∫e dt + Td de/dt ]', latex: 'u(t) = K_p\\left[e + \\frac{1}{T_i}\\int e\\,dt + T_d\\frac{de}{dt}\\right]', note: 'Equivalent to Kp·e + Ki∫e + Kd·ė with Ki = Kp/Ti, Kd = Kp·Td.', emphasis: true },
    { label: 'FOPDT process model', formula: 'G(s) = K e^(−θs) / (τs + 1)', latex: 'G(s) = \\frac{K e^{-\\theta s}}{\\tau s + 1}', note: 'Gain K, time constant τ and dead time θ, fit from a step test.' },
    { label: 'Ziegler–Nichols PID (reaction curve)', formula: 'Kp = 1.2τ/(Kθ), Ti = 2θ, Td = 0.5θ', latex: 'K_p = \\frac{1.2\\,\\tau}{K\\theta},\\quad T_i = 2\\theta,\\quad T_d = 0.5\\,\\theta', note: 'Aims for a quarter-decay response; expect large overshoot.' },
    { label: 'Offset with P-only control', formula: 'e_ss = 1 / (1 + K·Kp)', latex: 'e_{ss} = \\frac{1}{1 + K K_p}', note: 'For a plant of DC gain K and unit-step setpoint; integral action drives it to zero.' },
    { label: 'Integrated absolute error', formula: 'IAE = ∫ |e(t)| dt', latex: 'IAE = \\int_0^{\\infty} |e(t)|\\,dt', note: 'Single number for comparing tunings; lower is better.' },
  ],
  workedExample: {
    given: 'A process with K = 1, τ = 10 s and dead time θ = 2 s under unit-step setpoint (simulated at 10 ms steps).',
    find: 'Offset with P-only Kp = 1; Ziegler–Nichols PID settings and their response; the effect of detuning.',
    steps: [
      'P-only with Kp = 1: e_ss = 1/(1 + K·Kp) = 1/2 = 0.50, so the output stalls at 0.5.',
      'Ziegler–Nichols: Kp = 1.2(10)/(1 × 2) = 6, Ti = 2θ = 4 s, Td = 0.5θ = 1 s.',
      'Simulating Kp = 6, Ti = 4, Td = 1: overshoot 64.9%, 10–90% rise 1.2 s, 2% settling 19.7 s, IAE 5.35.',
      'Detune by halving the gain and doubling the integral time: Kp = 3, Ti = 8, Td = 1.',
      'Result: overshoot 9.8%, rise 3.5 s, settling 25.7 s, IAE 5.09. Slower to rise, much gentler, and with a lower IAE.',
    ],
    answer: 'P-only leaves a 50% offset. Ziegler–Nichols (6, 4 s, 1 s) is fast but overshoots about 65%; detuned to (3, 8 s, 1 s) it overshoots only 9.8% and has a lower IAE.',
  },
  challenges: [
    'Raise Kp with integral action off until the loop starts to oscillate. Where does it become unstable, and how does dead time θ change that limit?',
    'Turn on integral action with a very short Ti. What does the output do, and why?',
    'Increase dead time to 8 s with the Ziegler–Nichols settings. What happens, and what does that say about aggressive tuning on long-delay processes?',
  ],
  applications: [
    'Temperature control of an oven, reactor or 3D-printer hotend',
    'Flow, pressure and level loops in process plants',
    'Motor speed and position control in drives and robots',
  ],
  references: [
    { label: 'Engineering LibreTexts — Chemical Process Dynamics and Controls: PID Control', url: `${LIBRETEXTS_WOOLF}/09%3A_Proportional-Integral-Derivative_(PID)_Control` },
    { label: 'MIT OCW 2.004 — Lecture notes (Systems, Modeling, and Control II)', url: `${OCW_2004}/pages/lecture-notes/` },
  ],
}

const rootLocusStability: TopicMeta = {
  id: 'root-locus-stability',
  title: 'Root Locus & Routh Stability',
  duration: '22m',
  level: 'Advanced',
  summary: 'Watch the closed-loop poles move as loop gain increases, and use the Routh array to find exactly when the system goes unstable.',
  description:
    'A feedback loop is stable only if every closed-loop pole lies in the left half of the s-plane. Those poles are the roots of the characteristic equation 1 + K·L(s) = 0, and they slide continuously as the gain K changes. The root locus plots that whole path at once, so you can see which gains give a fast, well-damped response and which push poles across the imaginary axis. The Routh–Hurwitz test finds the critical gain algebraically without solving for the roots.',
  status: 'active',
  learningObjectives: [
    'Sketch the root locus of K/(s(s+a)(s+b)) using the real-axis, asymptote and breakaway rules',
    'Build a Routh array and use its first column to count right-half-plane poles',
    'Find the critical gain and the frequency at which the locus crosses the imaginary axis',
  ],
  formulas: [
    { label: 'Characteristic equation', formula: '1 + K L(s) = 0', latex: '1 + K\\,L(s) = 0', note: 'Closed-loop poles are its roots; K from 0 to ∞ traces the locus.', emphasis: true },
    { label: 'Example loop', formula: 'L(s) = 1 / (s (s+a)(s+b))', latex: 'L(s) = \\frac{1}{s(s+a)(s+b)}\\ \\Rightarrow\\ s^3 + (a+b)s^2 + ab\\,s + K = 0', note: 'Three poles, no zeros: three branches.' },
    { label: 'Asymptote centroid & angles', formula: 'σ = −(a+b)/3,  θ = 60°, 180°, 300°', latex: '\\sigma_a = \\frac{\\sum p - \\sum z}{n-m} = -\\frac{a+b}{3},\\quad \\theta = \\frac{(2k+1)180^\\circ}{n-m}', note: 'Branches head to infinity along these lines.' },
    { label: 'Breakaway point', formula: '3s² + 2(a+b)s + ab = 0', latex: '\\frac{dK}{ds} = 0 \\Rightarrow 3s^2 + 2(a+b)s + ab = 0', note: 'Choose the root that lies on the real-axis segment of the locus.' },
    { label: 'Routh stability limit', formula: 'K_crit = ab(a+b),  ω = √(ab)', latex: 'K_{crit} = ab\\,(a+b),\\qquad \\omega_{cross} = \\sqrt{ab}', note: 'From the s¹ row (ab(a+b) − K)/(a+b) > 0; the crossing comes from the auxiliary equation.' },
  ],
  workedExample: {
    given: 'Unity feedback around L(s) = K / (s(s+1)(s+2)), so a = 1 and b = 2. Characteristic polynomial s³ + 3s² + 2s + K.',
    find: 'The breakaway point, the critical gain and crossing frequency, and the stability at K = 2 and K = 10.',
    steps: [
      'Asymptotes: centroid σ = −(0+1+2)/3 = −1 at angles ±60° and 180°.',
      'Breakaway: 3s² + 6s + 2 = 0 gives s = −0.423 (the root in [−1, 0]), reached at K = 0.385.',
      'Routh array: s³: 1, 2; s²: 3, K; s¹: (6 − K)/3; s⁰: K. The first column stays positive only for 0 < K < 6.',
      'Crossing: at K = 6 the auxiliary equation 3s² + 6 = 0 gives s = ±j√2, so ω = 1.414 rad/s.',
      'K = 2: all signs positive, stable, poles −2.52 and −0.24 ± j0.86. K = 10: s¹ = −1.33 gives two sign changes, so two RHP poles (0.15 ± j1.73), unstable.',
    ],
    answer: 'The locus breaks away at s = −0.423, crosses the imaginary axis at ±j1.414 when K = 6, and the loop is stable for 0 < K < 6 (stable at K = 2, unstable with two RHP poles at K = 10).',
  },
  challenges: [
    'Move pole b farther left. How does K_crit change, and what does it say about adding fast lag to a loop?',
    'At the K where the dominant complex pair has ζ ≈ 0.5, how much of the gain margin have you used?',
    'Set a = b. The breakaway point sits at a different place; derive it and check against the plot.',
  ],
  applications: [
    'Choosing the maximum safe gain for a servo or position loop',
    'Placing poles for a target damping ratio in compensator design',
    'Checking a flight or process controller for instability before commissioning',
  ],
  references: [
    { label: 'Engineering LibreTexts — Root locus plots: effect of tuning', url: `${LIBRETEXTS_WOOLF}/10%3A_Dynamical_Systems_Analysis/10.06%3A_Root_locus_plots-_effect_of_tuning` },
    { label: 'Engineering LibreTexts — Routh stability: ranges of stable parameter values', url: `${LIBRETEXTS_WOOLF}/10%3A_Dynamical_Systems_Analysis/10.07%3A_Routh_stability-_ranges_of_parameter_values_that_are_stable` },
    { label: 'MIT OCW 16.06 Principles of Automatic Control (Fall 2012)', url: 'https://ocw.mit.edu/courses/16-06-principles-of-automatic-control-fall-2012/' },
  ],
}

const frequencyResponseBode: TopicMeta = {
  id: 'frequency-response-bode',
  title: 'Frequency Response & Bode Margins',
  duration: '21m',
  level: 'Advanced',
  summary: 'Read gain margin and phase margin off a Bode plot to judge how close a feedback loop is to instability.',
  description:
    'Feed a sine wave of frequency ω into a stable linear system and the output is a sine at the same frequency with a different amplitude and phase. Plotted against log-frequency, those two curves form a Bode plot. For a feedback loop, the open-loop Bode plot tells you about the closed loop: the gain margin says how much more gain you can add before instability, and the phase margin says how much extra lag you can tolerate. Healthy designs usually keep 6 dB or more of gain margin and 30–60° of phase margin.',
  status: 'active',
  learningObjectives: [
    'Compute the magnitude and phase of an open-loop transfer function at s = jω',
    'Locate the gain and phase crossover frequencies on a Bode plot',
    'Determine gain and phase margin and judge relative stability and damping',
  ],
  formulas: [
    { label: 'Frequency response', formula: 'L(jω) = |L| ∠L,  dB = 20 log₁₀|L|', latex: 'L(j\\omega) = |L|\\angle L,\\quad |L|_{dB} = 20\\log_{10}|L|', note: 'Magnitude in decibels and phase in degrees, both versus log ω.', emphasis: true },
    { label: 'Example open loop', formula: 'L(s) = K / (s(τ₁s+1)(τ₂s+1))', latex: 'L(s) = \\frac{K}{s(\\tau_1 s+1)(\\tau_2 s+1)}', note: 'Phase = −90° − atan(ωτ₁) − atan(ωτ₂).' },
    { label: 'Phase margin', formula: 'PM = 180° + ∠L(jω_gc),  |L(jω_gc)| = 1', latex: 'PM = 180^\\circ + \\angle L(j\\omega_{gc}),\\quad |L(j\\omega_{gc})| = 1', note: 'Extra phase lag allowed at the gain crossover before reaching −180°.', emphasis: true },
    { label: 'Gain margin', formula: 'GM = 1 / |L(jω_pc)|,  ∠L(jω_pc) = −180°', latex: 'GM = \\frac{1}{|L(j\\omega_{pc})|},\\quad \\angle L(j\\omega_{pc}) = -180^\\circ', note: 'Factor (or dB) by which gain can rise before instability.' },
    { label: 'Damping rule of thumb', formula: 'ζ ≈ PM / 100  (PM < 60°)', latex: '\\zeta \\approx \\frac{PM}{100^\\circ}', note: 'A quick link between margin and closed-loop overshoot.' },
  ],
  workedExample: {
    given: 'An open loop L(s) = 2 / (s(s+1)(0.1s+1)), i.e. K = 2, τ₁ = 1 s, τ₂ = 0.1 s.',
    find: 'Gain crossover, phase margin, phase crossover, gain margin and the gain at which the loop goes unstable.',
    steps: [
      'Phase crossover: −90° − atan(ωτ₁) − atan(ωτ₂) = −180° at ω_pc = 1/√(τ₁τ₂) = 3.162 rad/s.',
      '|L(jω_pc)| = 2/(3.162 × √(1+10) × √(1+0.1)) = 2/(3.162 × 3.317 × 1.049) = 0.182, so GM = 1/0.182 = 5.5, or 14.8 dB.',
      'Gain crossover: solve |L(jω)| = 1 numerically, ω_gc = 1.244 rad/s (check: 2/(1.244 × 1.596 × 1.008) = 1.00).',
      'Phase there: −90° − atan(1.244) − atan(0.1244) = −90° − 51.2° − 7.1° = −148.3°, so PM = 180° − 148.3° = 31.7°.',
      'Instability would come at K = 2 × 5.5 = 11, and ζ ≈ PM/100 ≈ 0.32.',
    ],
    answer: 'ω_gc = 1.244 rad/s with PM = 31.7°, and ω_pc = 3.162 rad/s with GM = 5.5 (14.8 dB). The loop is stable but lightly damped (ζ ≈ 0.3), and goes unstable at K = 11.',
  },
  challenges: [
    'Lower K from 2 to 1 and note PM and GM. How does the closed-loop step response of a lower-gain loop change in speed and damping?',
    'Make τ₂ large (slow second lag). What happens to ω_pc, GM and PM, and why do extra lags hurt stability?',
    'Find K for a phase margin of 45° with τ₁ = 1 s and τ₂ = 0.1 s.',
  ],
  applications: [
    'Setting the loop gain of a servo, amplifier or power-supply regulator for safe margins',
    'Diagnosing ringing in a motor-control or active-suspension loop from measured frequency response',
    'Verifying robustness against sensor delay and actuator lag',
  ],
  references: [
    { label: 'MIT OCW 2.004 — Lecture notes (Systems, Modeling, and Control II)', url: `${OCW_2004}/pages/lecture-notes/` },
    { label: 'MIT OCW 2.14 Analysis and Design of Feedback Control Systems (Spring 2014)', url: 'https://ocw.mit.edu/courses/2-14-analysis-and-design-of-feedback-control-systems-spring-2014/' },
    { label: 'MIT OCW 16.06 Principles of Automatic Control (Fall 2012)', url: 'https://ocw.mit.edu/courses/16-06-principles-of-automatic-control-fall-2012/' },
  ],
}

export const NEW_COURSES: CourseMeta[] = [
  {
    id: 'control-systems',
    code: '2.004',
    title: 'Control Systems',
    symbol: 'G/(1+GH)',
    category: 'Dynamics & control',
    description: 'How to make a system do what you want: model it, close a feedback loop around it, and tune that loop to be fast, accurate and stable.',
    prerequisites: ['Differential Equations', 'Engineering Dynamics'],
    references: [
      { label: 'MIT OCW — 2.004 Systems, Modeling, and Control II (Fall 2007)', url: 'https://ocw.mit.edu/courses/2-004-systems-modeling-and-control-ii-fall-2007/' },
      { label: 'MIT OCW — 2.14 Analysis and Design of Feedback Control Systems (Spring 2014)', url: 'https://ocw.mit.edu/courses/2-14-analysis-and-design-of-feedback-control-systems-spring-2014/' },
      { label: 'MIT OCW — 16.06 Principles of Automatic Control (Fall 2012)', url: 'https://ocw.mit.edu/courses/16-06-principles-of-automatic-control-fall-2012/' },
      { label: 'Engineering LibreTexts — Chemical Process Dynamics and Controls (Woolf)', url: LIBRETEXTS_WOOLF },
    ],
    topics: [stepResponse, pidTuning, rootLocusStability, frequencyResponseBode],
  },
]
