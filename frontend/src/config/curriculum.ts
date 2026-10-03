/**
 * Curriculum content model: courses contain topics, topics render as lessons.
 * Mirrors the course -> module -> topic hierarchy described in CLAUDE.md.
 */

export type TopicStatus = 'active' | 'coming-soon'

export interface FormulaEntry {
  label: string
  formula: string
  /** LaTeX source rendered via KaTeX. Optional so unmigrated entries fall back to `formula` as plain text. */
  latex?: string
  note: string
  emphasis?: boolean
}

export interface TopicMeta {
  id: string
  title: string
  duration: string
  summary: string
  description: string
  status: TopicStatus
  /** Path under /media served from frontend/public, e.g. animations/stress-strain.mp4 */
  manimSrc?: string
  formulas: FormulaEntry[]
  challenges: string[]
  /** Verified, real free course material specific to this topic — not guessed URLs. */
  references: ExternalReference[]
}

export interface ExternalReference {
  label: string
  url: string
}

export interface CourseMeta {
  id: string
  code: string
  title: string
  symbol: string
  category: string
  description: string
  prerequisites: string[]
  /** Verified, real free course material for further study — not guessed URLs. */
  references: ExternalReference[]
  topics: TopicMeta[]
}

export const CURRICULUM: CourseMeta[] = [
  {
    id: 'mechanics-of-materials',
    code: '2.001',
    title: 'Mechanics of Materials',
    symbol: 'σ = My/I',
    category: 'Mechanics of solids',
    description: 'How solid parts carry load: the stresses and deformations inside bars, shafts, beams and columns.',
    prerequisites: ['Calculus I–II', 'Engineering Statics'],
    references: [
      { label: 'MIT OCW — 2.001 Mechanics & Materials I (Fall 2006)', url: 'https://ocw.mit.edu/courses/2-001-mechanics-materials-i-fall-2006/' },
    ],
    topics: [
      {
        id: 'stress-strain',
        title: 'Stress-Strain Analysis',
        duration: '15m',
        summary: 'Explore how materials deform under stress and understand elastic vs. plastic behavior.',
        description:
          'A bar pulled in tension stretches. Below the yield point it springs back to its original length; push past yield and the stretch becomes permanent. The stress-strain curve is how engineers read a material’s whole personality — stiffness, strength, and ductility — off a single test.',
        status: 'active',
        manimSrc: 'animations/stress-strain.mp4',
        formulas: [
          { label: 'Normal stress', formula: 'σ = F / A', latex: '\\sigma = \\frac{F}{A}', note: 'Force distributed over the cross-sectional area.' },
          { label: 'Engineering strain', formula: 'ε = ΔL / L₀', latex: '\\varepsilon = \\frac{\\Delta L}{L_0}', note: 'Fractional change in length under load.' },
          { label: "Young's modulus", formula: 'E = σ / ε', latex: 'E = \\frac{\\sigma}{\\varepsilon}', note: 'Slope of the elastic (linear) region — stiffness.', emphasis: true },
          { label: "Poisson's ratio", formula: 'ν = −ε_lateral / ε_axial', latex: '\\nu = -\\frac{\\varepsilon_{lateral}}{\\varepsilon_{axial}}', note: 'How much a material thins as it stretches.' },
        ],
        challenges: [
          'At what applied stress does steel first leave the elastic region in this playground? Compare it to the yield stress you set.',
          'Switch to aluminum. For the same applied stress, how much more strain do you get than with steel — and why does that follow from E?',
          'Push a custom material well past its ultimate stress. What does "fracture" mean physically at that point?',
        ],
        references: [],
      },
      {
        id: 'torsion',
        title: 'Torsion in Circular Shafts',
        duration: '12m',
        summary: 'Shear stress distribution and angle of twist under torsional loading.',
        description:
          'Twist a shaft and every fiber inside it shears against its neighbor — most at the surface, not at all at the center. That radial pattern is what makes a solid shaft so efficient at carrying torque, and it is also why the angle of twist and the peak stress obey two different, equally important limits when you size a drive shaft.',
        status: 'active',
        manimSrc: 'animations/torsion.mp4',
        formulas: [
          { label: 'Polar moment of inertia', formula: 'J = π d⁴ / 32', latex: 'J = \\frac{\\pi d^4}{32}', note: 'For a solid circular shaft of diameter d.' },
          { label: 'Shear stress at radius r', formula: 'τ(r) = T r / J', latex: '\\tau(r) = \\frac{T r}{J}', note: 'Zero at the center, maximum at the outer surface.' },
          { label: 'Maximum shear stress', formula: 'τ_max = 16 T / (π d³)', latex: '\\tau_{max} = \\frac{16 T}{\\pi d^3}', note: 'At the shaft surface, r = d/2.', emphasis: true },
          { label: 'Angle of twist', formula: 'θ = T L / (G J)', latex: '\\theta = \\frac{T L}{G J}', note: 'G is the shear modulus; longer or softer shafts twist more.' },
          { label: 'Shear yield check (Tresca)', formula: 'τ_yield = σ_yield / 2', latex: '\\tau_{yield} = \\frac{\\sigma_{yield}}{2}', note: 'Maximum shear stress theory — compare τ_max against this.' },
        ],
        challenges: [
          'Double the shaft diameter with torque and length fixed. τ_max drops by what factor — and does that match 16T/(πd³)?',
          'Switch from steel to aluminum at the same torque and diameter. Which changes more: the stress or the angle of twist — and why does G matter for one but not the other?',
          'Find the diameter at which this shaft just reaches a safety factor of 1.5 against shear yield. Is stress or the angle-of-twist limit more likely to govern first in a real design?',
        ],
        references: [
          { label: 'MIT OCW — 2.001 Lecture Notes', url: 'https://ocw.mit.edu/courses/2-001-mechanics-materials-i-fall-2006/pages/lecture-notes/' },
          { label: 'MIT 3.11 — "Shear and Torsion" module notes (Roylance)', url: 'https://web.mit.edu/course/3/3.11/www/modules/torsion.pdf' },
        ],
      },
      {
        id: 'axial-loading',
        title: 'Axial Loading',
        duration: '14m',
        summary: 'Elongation of bars under load, statically indeterminate members, and thermal stress.',
        description:
          'A bar under axial load stretches by an amount that depends on its stiffness (AE) and its length — the same rule as a spring, just written in material terms. Constrain that same bar at both ends, or heat it up, and the bar can no longer stretch freely: it develops internal stress even with no external load at all, purely from being stopped from doing what it wants to do.',
        status: 'active',
        formulas: [
          { label: 'Axial elongation', formula: 'δ = FL / (AE)', latex: '\\delta = \\frac{FL}{AE}', note: 'Same form as a spring: stiffer (higher AE) or shorter bars stretch less.', emphasis: true },
          { label: 'Thermal expansion', formula: 'δ_T = α ΔT L', latex: '\\delta_T = \\alpha\\, \\Delta T\\, L', note: 'α is the coefficient of thermal expansion. Free expansion — no stress if unconstrained.' },
          { label: 'Thermal stress (fully constrained)', formula: 'σ_T = E α ΔT', latex: '\\sigma_T = E \\alpha\\, \\Delta T', note: 'If a bar is prevented from expanding at all, the blocked strain becomes stress instead.' },
          { label: 'Compatibility (indeterminate case)', formula: 'δ_1 = δ_2', latex: '\\delta_1 = \\delta_2', note: 'When statics alone can\u2019t find the forces, the two parts must deform together — that extra equation closes the system.' },
        ],
        challenges: [
          'A steel rod is heated but free to expand. Does it develop any stress? Now clamp both ends and heat it the same amount — what changes?',
          'Two rods of different stiffness share a load in parallel between two rigid plates. Why must the stiffer rod carry more force?',
        ],
        references: [],
      },
      {
        id: 'shear-bending-diagrams',
        title: 'Shear Force & Bending Moment Diagrams',
        duration: '16m',
        summary: 'Build V(x) and M(x) diagrams for a beam under point and distributed loads.',
        description:
          'Cut a beam anywhere and ask what the two halves must be doing to each other to stay in equilibrium: one answer is a shear force, the other is a bending moment. Walk that imaginary cut along the whole beam and you get two functions, V(x) and M(x) — and the shape of one is completely determined by the other.',
        status: 'active',
        formulas: [
          { label: 'Shear from distributed load', formula: 'dV/dx = −w(x)', latex: '\\frac{dV}{dx} = -w(x)', note: 'A downward distributed load w(x) makes shear decrease along the beam.' },
          { label: 'Moment from shear', formula: 'dM/dx = V(x)', latex: '\\frac{dM}{dx} = V(x)', note: 'Shear is the slope of the moment diagram — zero shear marks a peak or valley in M(x).', emphasis: true },
          { label: 'Point load jump', formula: 'ΔV = −P', latex: '\\Delta V = -P', note: 'A concentrated load causes a step discontinuity in the shear diagram.' },
        ],
        challenges: [
          'A simply supported beam carries one point load. Where on the beam is the bending moment at its largest — and how does that follow from dM/dx = V?',
          'Sketch what happens to the shear diagram at the exact location of a point load. Why is a "kink," not a jump, what you\u2019d see in the moment diagram there instead?',
        ],
        references: [],
      },
      {
        id: 'bending-stress-beams',
        title: 'Bending Stress in Beams',
        duration: '15m',
        summary: 'The flexure formula, the neutral axis, and the second moment of area.',
        description:
          'When a beam bends, one side of it is being stretched and the other compressed, with a single line down the middle — the neutral axis — feeling nothing at all. How much stress builds up at any height in the cross-section depends on how far that point sits from the neutral axis, and how the cross-section\u2019s shape resists bending in the first place.',
        status: 'active',
        formulas: [
          { label: 'Flexure formula', formula: 'σ = M y / I', latex: '\\sigma = \\frac{M y}{I}', note: 'Bending stress at height y from the neutral axis, under moment M.', emphasis: true },
          { label: 'Second moment of area (rectangle)', formula: 'I = b h³ / 12', latex: 'I = \\frac{b h^3}{12}', note: 'Depth is cubed — doubling h makes the section eight times stiffer in bending.' },
          { label: 'Maximum bending stress', formula: 'σ_max = M c / I', latex: '\\sigma_{max} = \\frac{M c}{I}', note: 'c is the distance from the neutral axis to the outer fiber, c = h/2 for a symmetric section.' },
        ],
        challenges: [
          'Flip a rectangular beam on its side so b and h swap. Why does I — and therefore the bending stress — change so much even though the cross-sectional area is identical?',
          'At the neutral axis itself, what is the bending stress? Does that match what "neutral" is claiming?',
        ],
        references: [],
      },
      {
        id: 'beam-deflection',
        title: 'Beam Deflection',
        duration: '17m',
        summary: 'The elastic curve, deflection limits, and the stiffness of a loaded beam.',
        description:
          'A beam that easily passes a strength check can still be useless if it sags too much — a floor that doesn\u2019t break but bounces underfoot has failed a different test. The elastic curve equation ties the beam\u2019s curvature directly to its bending moment, and integrating it twice gives the actual shape the beam settles into under load.',
        status: 'active',
        formulas: [
          { label: 'Governing equation', formula: 'E I y″ = M(x)', latex: 'E I\\, y^{\\prime\\prime} = M(x)', note: 'Curvature of the elastic curve is proportional to the local bending moment.', emphasis: true },
          { label: 'Support reactions (point load at a, b from supports)', formula: 'R_A = P b / L,  R_B = P a / L', latex: 'R_A = \\frac{P b}{L}, \\quad R_B = \\frac{P a}{L}', note: 'From ΣM = 0 about each support — the nearer support carries more.' },
          { label: 'Deflection under the load', formula: 'δ = P a² b² / (3 E I L)', latex: '\\delta = \\frac{P a^2 b^2}{3 E I L}', note: 'Stiffer material (E) or a deeper section (I) means less sag.' },
        ],
        challenges: [
          'Double the span of a beam with everything else fixed. By what factor does the deflection grow — and why is it not simply two?',
          'Find the beam depth at which deflection just meets a code limit of L/360. Does the strength check from bending stress pass at that same depth, or does one limit govern before the other?',
        ],
        references: [],
      },
      {
        id: 'combined-loading-mohrs-circle',
        title: 'Combined Loading & Mohr\u2019s Circle',
        duration: '18m',
        summary: 'Stress transformation, principal stresses, and reading them off a circle.',
        description:
          'A real part rarely feels pure tension or pure shear — it feels both at once, and the mix looks different depending on which direction you cut it. Mohr\u2019s circle turns that geometry problem into an actual circle: every point on it is the stress state on some cut plane, and the two special points where the circle crosses the horizontal axis are the principal stresses — the largest and smallest normal stress the material sees, with no shear at all.',
        status: 'active',
        formulas: [
          { label: 'Average (center) stress', formula: 'σ_avg = (σ_x + σ_y) / 2', latex: '\\sigma_{avg} = \\frac{\\sigma_x + \\sigma_y}{2}', note: 'The center of Mohr\u2019s circle on the normal-stress axis.' },
          { label: "Mohr's circle radius", formula: 'R = √[((σ_x − σ_y)/2)² + τ_xy²]', latex: 'R = \\sqrt{\\left(\\frac{\\sigma_x - \\sigma_y}{2}\\right)^2 + \\tau_{xy}^2}', note: 'The radius of the circle — also the maximum shear stress at any orientation.' },
          { label: 'Principal stresses', formula: 'σ_1,2 = σ_avg ± R', latex: '\\sigma_{1,2} = \\sigma_{avg} \\pm R', note: 'The two points where the circle crosses the axis where shear is zero.', emphasis: true },
        ],
        challenges: [
          'Set τ_xy = 0 with σ_x ≠ σ_y. Where do the principal stresses end up, and why does that make sense physically?',
          'Increase τ_xy while holding σ_x and σ_y fixed. What happens to the radius of the circle, and to the gap between the two principal stresses?',
        ],
        references: [],
      },
      {
        id: 'columns-buckling',
        title: 'Columns & Buckling',
        duration: '16m',
        summary: 'Euler buckling, end conditions, and why slender columns fail without ever yielding.',
        description:
          'A short, stubby column crushed under load fails by the material giving way — a strength problem. A long, slender column under the very same load can fail first by suddenly bowing sideways and never straightening back out, at a load far below what the material could otherwise take. That failure is about geometry and stiffness, not strength, and it is exactly what Euler\u2019s buckling formula predicts.',
        status: 'active',
        formulas: [
          { label: 'Euler critical load', formula: 'P_cr = π² E I / (K L)²', latex: 'P_{cr} = \\frac{\\pi^2 E I}{(K L)^2}', note: 'The axial load at which a slender column buckles. K depends on how the ends are held.', emphasis: true },
          { label: 'Effective length factor', formula: 'K: 1 (pinned-pinned), 0.5 (fixed-fixed), 2 (fixed-free)', latex: 'K = 1,\\ 0.5,\\ 2\\ \\ldots', note: 'Stiffer end conditions shorten the effective length the column "feels."' },
          { label: 'Slenderness ratio', formula: 'λ = K L / r,  r = √(I/A)', latex: '\\lambda = \\frac{K L}{r}, \\quad r = \\sqrt{I/A}', note: 'A single number that separates "slender, buckling governs" columns from "stubby, strength governs" ones.' },
        ],
        challenges: [
          'Double a column\u2019s length with everything else fixed. By what factor does its critical buckling load drop?',
          'The same column is pinned-pinned in one design and fixed-fixed in another. Which one can carry more load before buckling, and by what factor?',
        ],
        references: [],
      },
    ],
  },
  {
    id: 'machine-design',
    code: '2.72',
    title: 'Elements of Mechanical Design',
    symbol: 'n = σ_y / σ′',
    category: 'Machine elements & design',
    description: 'How to actually size the parts that make up a machine: shafts, springs, bolts, bearings — combining stress analysis with the reality that most machines fail from fatigue, not overload.',
    prerequisites: ['Mechanics of Materials', 'Engineering Statics'],
    references: [
      { label: 'MIT OCW — 2.72 Elements of Mechanical Design (Spring 2009)', url: 'https://ocw.mit.edu/courses/2-72-elements-of-mechanical-design-spring-2009/' },
      { label: 'MIT 2.72 — Lecture Notes', url: 'https://ocw.mit.edu/courses/2-72-elements-of-mechanical-design-spring-2009/pages/lecture-notes/' },
    ],
    topics: [
      {
        id: 'failure-theories',
        title: 'Failure Theories: Von Mises & Tresca',
        duration: '16m',
        summary: 'Distortion-energy and maximum-shear-stress theories for predicting yielding under combined stress.',
        description:
          'A single normal stress has an obvious yield point: compare it to σ_y and you’re done. A real part under combined bending, torsion, and pressure has no single stress to compare — it has a whole state of stress at a point, the same principal stresses read off Mohr’s circle. Von Mises and Tresca are two different, both widely used, rules for collapsing that multi-axis stress state back down to one number you can compare against a simple uniaxial yield test.',
        status: 'active',
        formulas: [
          { label: 'Von Mises effective stress (plane stress)', formula: "σ' = √(σ1² − σ1σ2 + σ2²)", latex: "\\sigma' = \\sqrt{\\sigma_1^2 - \\sigma_1\\sigma_2 + \\sigma_2^2}", note: 'Collapses the two principal stresses into one equivalent uniaxial stress.', emphasis: true },
          { label: 'Tresca (max shear stress) criterion', formula: 'σ1 − σ3 = σ_y / n', latex: '\\sigma_1 - \\sigma_3 = \\frac{\\sigma_y}{n}', note: 'Uses only the largest and smallest principal stress — always at least as conservative as von Mises.' },
          { label: 'Factor of safety (von Mises)', formula: "n = σ_y / σ'", latex: "n = \\frac{\\sigma_y}{\\sigma'}", note: 'Ratio of the material’s yield strength to the computed effective stress.' },
        ],
        challenges: [
          'Set up a pure-shear stress state (σ_x=0, σ_y=0, τ_xy≠0). Where do von Mises and Tresca disagree the most, and by roughly what percentage?',
          'Increase τ_xy until von Mises just predicts yield. Has Tresca already predicted yield at a lower τ_xy, or exactly the same one?',
        ],
        references: [],
      },
      {
        id: 'fatigue-analysis',
        title: 'Fatigue Analysis: S-N Curves & the Goodman Diagram',
        duration: '17m',
        summary: 'Predict fatigue life and the infinite-life safety factor for a part under fluctuating stress.',
        description:
          'A load well below the yield stress can still break a part — if it’s applied and removed enough times. The S-N curve captures how many cycles a material survives at a given fully-reversed stress amplitude, and the Goodman diagram extends that picture to loads that fluctuate around a nonzero mean, drawing the line between "survives forever" and "fails eventually" as a function of both the swing and the offset of the stress.',
        status: 'active',
        formulas: [
          { label: "Basquin's equation (finite life)", formula: "σ_a = σ_f' (2N)^b", latex: "\\sigma_a = \\sigma_f' (2N)^b", note: 'Amplitude-life relationship in the finite-life region; N is cycles to failure.' },
          { label: 'Endurance limit (unmodified, steel)', formula: 'S_e′ ≈ 0.5 S_ut', latex: "S_e' \\approx 0.5\\,S_{ut}", note: 'Roughly half the ultimate strength for many steels; corrected by surface/size/loading factors for a real S_e.' },
          { label: 'Modified Goodman line', formula: 'σ_a/S_e + σ_m/S_ut = 1/n', latex: '\\frac{\\sigma_a}{S_e} + \\frac{\\sigma_m}{S_{ut}} = \\frac{1}{n}', note: 'The safe region is everything inside this line; n is the factor of safety against fatigue failure at that load ratio.', emphasis: true },
        ],
        challenges: [
          'Hold the stress amplitude fixed and increase the mean stress. Does the Goodman line say the part is more or less likely to fail — and does that match your intuition about a bolt that’s always partly loaded?',
          'Set the mean stress to zero (fully reversed loading). What does the Goodman equation reduce to, and how does that connect back to the S-N curve alone?',
        ],
        references: [],
      },
      {
        id: 'shaft-design',
        title: 'Shaft Design Under Combined Bending and Torsion',
        duration: '18m',
        summary: 'Size a rotating shaft for combined bending-and-torsion fatigue loading, including stress concentration at a fillet.',
        description:
          'A power-transmission shaft rarely sees pure torsion — a gear or pulley hung off it adds bending, and the step or keyway needed to seat that gear concentrates the local stress well above the nominal value. The ASME shaft-design equation folds all three effects — combined loading, stress concentration, and fatigue-versus-steady stress — into a single formula for the minimum safe diameter.',
        status: 'active',
        formulas: [
          { label: 'ASME shaft diameter (DE-Goodman)', formula: 'd³ = (32n/π)·√[(K_f M_a/S_e)² + (3/4)(K_fs T_m/S_ut)²]', latex: 'd^3 = \\frac{32n}{\\pi}\\sqrt{\\left(\\frac{K_f M_a}{S_e}\\right)^2 + \\frac{3}{4}\\left(\\frac{K_{fs} T_m}{S_{ut}}\\right)^2}', note: 'The standard combined bending-fatigue / torsion-steady sizing equation; M_a is alternating bending moment, T_m is steady torque.', emphasis: true },
          { label: 'Fatigue stress-concentration factor', formula: 'K_f = 1 + q(K_t − 1)', latex: 'K_f = 1 + q(K_t - 1)', note: 'q is the notch sensitivity (0 to 1); a sharper fillet raises K_t but a more notch-sensitive material turns more of that into real fatigue damage.' },
          { label: 'Alternating von Mises stress at the fillet', formula: "σ_a' = K_f · 32 M_a / (π d³)", latex: "\\sigma_a' = K_f \\frac{32 M_a}{\\pi d^3}", note: 'The actual local stress the S-N curve / Goodman line needs to be checked against.' },
        ],
        challenges: [
          'Sharpen the fillet radius at the shoulder (increase K_t). What happens to the required shaft diameter, even though the nominal bending stress hasn’t changed at all?',
          'Remove the bending load entirely, leaving only steady torque. Does the ASME equation still need its fatigue term, or does it collapse into a static-strength check?',
        ],
        references: [
          { label: 'MIT 2.72 — Lecture 02: Shafts (Culpepper)', url: 'https://ocw.mit.edu/courses/2-72-elements-of-mechanical-design-spring-2009/130ca461b0fdb9b90a8818fe97d022f9_MIT2_72s09_lec02_shaft.pdf' },
        ],
      },
      {
        id: 'spring-design',
        title: 'Helical Compression Spring Design',
        duration: '16m',
        summary: 'Spring rate, coil shear stress, and the Wahl correction factor for a round-wire helical compression spring.',
        description:
          'A helical spring is really a torsion bar wound into a coil — every cross-section of the wire is being twisted, not bent, which is why the spring rate depends on the fourth power of wire diameter but only the inverse cube of coil diameter. The plain shear-stress formula for a straight torsion bar under-predicts the real peak stress in a coil, because the wire curves back on itself and the load line is offset from the wire’s centroid; the Wahl factor corrects for both effects at once.',
        status: 'active',
        formulas: [
          { label: 'Spring rate', formula: 'k = G d⁴ / (8 D³ N)', latex: 'k = \\frac{G d^4}{8 D^3 N}', note: 'd = wire diameter, D = mean coil diameter, N = active coils, G = shear modulus.', emphasis: true },
          { label: 'Spring index', formula: 'C = D / d', latex: 'C = \\frac{D}{d}', note: 'Practical springs run C between about 4 and 12 — too low and the wire is hard to coil, too high and the spring is floppy and prone to buckling.' },
          { label: 'Wahl correction factor', formula: 'K_w = (4C−1)/(4C−4) + 0.615/C', latex: 'K_w = \\frac{4C-1}{4C-4} + \\frac{0.615}{C}', note: 'Corrects for direct shear and coil curvature; approaches 1 as the spring index grows large.' },
          { label: 'Corrected shear stress', formula: 'τ = K_w · 8 F D / (π d³)', latex: '\\tau = K_w \\frac{8FD}{\\pi d^3}', note: 'The real peak shear stress in the wire under axial force F.' },
        ],
        challenges: [
          'Hold the wire diameter fixed and shrink the coil diameter to push the spring index down toward 4. What happens to the Wahl factor, and to the actual stress at a given load?',
          'Double the number of active coils with everything else fixed. What happens to the spring rate — and does the stress in the wire change at all for the same applied force?',
        ],
        references: [],
      },
      {
        id: 'bolted-joints',
        title: 'Bolted Joint Design & Preload',
        duration: '17m',
        summary: 'Joint stiffness, bolt preload, and how an external tensile load actually splits between the bolt and the clamped members.',
        description:
          'A properly preloaded bolt carries far less of an external load than intuition suggests, because tightening it has already stretched the bolt and compressed the clamped plates — both act like stiff springs in a system where most of any new external load goes toward unloading the plates rather than stretching the bolt further. The joint stiffness constant C captures exactly what fraction of the external load the bolt actually feels, and it is usually a surprisingly small number.',
        status: 'active',
        formulas: [
          { label: 'Joint stiffness constant', formula: 'C = k_b / (k_b + k_m)', latex: 'C = \\frac{k_b}{k_b + k_m}', note: 'k_b = bolt stiffness, k_m = clamped-member stiffness; C is typically 0.2–0.3 for standard steel joints — the members are much stiffer than the bolt.' },
          { label: 'Resultant bolt load', formula: 'F_b = F_i + C·P', latex: 'F_b = F_i + C P', note: 'F_i is the preload, P is the external tensile load applied to the joint.', emphasis: true },
          { label: 'Resultant clamp (member) load', formula: 'F_m = F_i − (1−C)·P', latex: 'F_m = F_i - (1-C)P', note: 'The joint separates once F_m reaches zero — that sets the maximum allowed external load.' },
          { label: 'Recommended preload (reused fastener)', formula: 'F_i = 0.75 F_p', latex: 'F_i = 0.75\\,F_p', note: 'F_p is the proof load of the bolt (proof strength × tensile stress area).' },
        ],
        challenges: [
          'Increase the external load P until F_m from the formula above reaches zero. What has physically happened to the joint at that point?',
          'Compare a joint with C=0.2 to one with C=0.8 under the same P and preload. Which bolt sees more load — and which joint would you trust more for a fatigue-critical application?',
        ],
        references: [],
      },
      {
        id: 'bearing-selection',
        title: 'Rolling-Element Bearing Selection: L10 Life',
        duration: '15m',
        summary: 'Predict the statistical fatigue life of a ball or roller bearing from its dynamic load rating and the actual applied load.',
        description:
          'No two identical bearings fail at exactly the same number of cycles — rolling-contact fatigue is inherently statistical. The L10 life is the number of revolutions 90% of a batch of identical bearings are expected to survive before the first sign of fatigue, and it is set entirely by the ratio of the manufacturer’s catalog dynamic load rating to the actual load the bearing carries, raised to a power that depends on whether the rolling elements are balls or rollers.',
        status: 'active',
        formulas: [
          { label: 'L10 life (millions of revolutions)', formula: 'L10 = (C / P)^k', latex: 'L_{10} = \\left(\\frac{C}{P}\\right)^{k}', note: 'C = dynamic load rating, P = equivalent applied load, k = 3 for ball bearings, 10/3 for roller bearings.', emphasis: true },
          { label: 'Life in operating hours', formula: 'L10h = L10 · 10⁶ / (60 n)', latex: 'L_{10h} = \\frac{L_{10}\\times10^6}{60\\,n}', note: 'n = shaft speed in rpm.' },
        ],
        challenges: [
          'Double the applied load P with everything else fixed. By what factor does the L10 life drop for a ball bearing — and is that factor different for a roller bearing?',
          'A bearing rated for a 5-year life at its expected load turns out to see a 20% higher load in service. Roughly how much life is actually lost?',
        ],
        references: [],
      },
      {
        id: 'gear-tooth-bending',
        title: 'Spur Gear Tooth Bending Stress (Lewis Equation)',
        duration: '18m',
        summary: 'How gear tooth geometry and tangential tooth load set the bending stress at the tooth root.',
        description:
          'A gear tooth is a stubby cantilever beam, loaded near its tip by the mating tooth — so the same flexure formula from beam bending applies, just packaged for gear geometry through the Lewis form factor. Add the fact that only one tooth (or briefly two) actually carries the full load at any instant, and gear design becomes a beam-bending problem wearing a different notation.',
        status: 'coming-soon',
        formulas: [
          { label: 'Lewis bending stress', formula: 'σ = W^t P_d / (F Y)', latex: '\\sigma = \\frac{W^t P_d}{F Y}', note: 'W^t = tangential tooth load, P_d = diametral pitch, F = face width, Y = Lewis form factor (depends on tooth count).', emphasis: true },
          { label: 'Tangential tooth load from transmitted power', formula: 'W^t = 2T / d_p', latex: 'W^t = \\frac{2T}{d_p}', note: 'T = transmitted torque, d_p = pitch diameter.' },
        ],
        challenges: [
          'Cut the number of teeth on a gear in half while keeping the pitch diameter fixed (coarsening the pitch). What happens to the Lewis form factor Y, and why does that make the teeth stronger?',
          'Double the transmitted torque at a fixed pitch diameter. By what factor does the tooth-root bending stress increase?',
        ],
        references: [],
      },
      {
        id: 'belt-chain-drives',
        title: 'Belt & Chain Drives',
        duration: '15m',
        summary: 'Speed ratio and the belt tension ratio that sets how much power a flat or V-belt can actually transmit before it slips.',
        description:
          'A belt drive transmits power entirely through friction between the belt and the pulley, which means there is a hard limit on how much tension difference the belt can sustain before it slips — set by the coefficient of friction and how far the belt wraps around the pulley. Push past that limit and adding more motor torque does nothing except make the belt slip faster.',
        status: 'coming-soon',
        formulas: [
          { label: 'Speed ratio', formula: 'N2 / N1 = d1 / d2', latex: '\\frac{N_2}{N_1} = \\frac{d_1}{d_2}', note: 'Output speed set purely by the ratio of pulley diameters, same as gears.' },
          { label: 'Belt tension ratio (capstan equation)', formula: 'T1 / T2 = e^(μθ)', latex: '\\frac{T_1}{T_2} = e^{\\mu\\theta}', note: 'μ = friction coefficient, θ = wrap angle in radians; the maximum tension ratio before slipping.', emphasis: true },
          { label: 'Power transmitted', formula: 'P = (T1 − T2)·v', latex: 'P = (T_1 - T_2)v', note: 'v = belt speed; only the difference in tension does useful work, the rest is just belt preload.' },
        ],
        challenges: [
          'Shrink the wrap angle by moving the pulleys further apart (or using a smaller pulley). Does the belt’s power capacity go up or down before it slips?',
          'Double the friction coefficient (switch to a higher-grip belt material). By what factor does the maximum tension ratio change?',
        ],
        references: [],
      },
    ],
  },
  {
    id: 'engineering-dynamics',
    code: '2.003',
    title: 'Engineering Dynamics',
    symbol: 'F = ma',
    category: 'Dynamics & control',
    description: 'How things move and why: the kinematics and kinetics of particles and rigid bodies under real forces.',
    prerequisites: ['Engineering Statics', 'Calculus I–II'],
    references: [
      { label: 'MIT OCW — 2.003SC Engineering Dynamics (Fall 2011)', url: 'https://ocw.mit.edu/courses/2-003sc-engineering-dynamics-fall-2011/' },
    ],
    topics: [
      {
        id: 'particle-kinematics',
        title: 'Kinematics of Particles',
        duration: '14m',
        summary: 'Describe how a particle moves — position, velocity, and acceleration — before asking why.',
        description:
          'Before any force enters the picture, motion itself has its own vocabulary. A position vector traced through time hides a velocity in its slope and an acceleration in its curvature; break that same motion into tangential and normal components and the acceleration splits cleanly into "speeding up" and "turning."',
        status: 'coming-soon',
        formulas: [
          { label: 'Velocity', formula: 'v = dr / dt', note: 'Rate of change of position — a vector, not just a speed.' },
          { label: 'Acceleration', formula: 'a = dv / dt', note: 'Rate of change of velocity.' },
          { label: 'Tangential & normal components', formula: 'a = (dv/dt) ê_t + (v² / ρ) ê_n', note: 'Splits acceleration into along-the-path and toward-the-center-of-curvature parts.', emphasis: true },
          { label: 'Constant acceleration', formula: 's = s₀ + v₀t + ½at²', note: 'Valid only when a is constant — check before using it.' },
        ],
        challenges: [
          'A car speeds up while going around a curve. Sketch its tangential and normal acceleration components — which one is zero on a straight road?',
          'If a particle moves at constant speed but along a curved path, is its acceleration zero? What does a_n = v²/ρ tell you?',
        ],
        references: [],
      },
      {
        id: 'newton-work-energy',
        title: "Newton's Second Law & Work-Energy Methods",
        duration: '16m',
        summary: 'Two ways to solve the same problem: force and acceleration, or work and energy.',
        description:
          'Newton’s second law connects force directly to acceleration at every instant — powerful, but it demands you track the whole motion. The work-energy theorem trades that detail for convenience: integrate force over distance once, and you get the change in kinetic energy directly, without ever solving for acceleration.',
        status: 'coming-soon',
        formulas: [
          { label: "Newton's second law", formula: 'ΣF = m a', note: 'The net force on a particle sets its acceleration.', emphasis: true },
          { label: 'Kinetic energy', formula: 'T = ½ m v²', note: 'Energy stored in motion.' },
          { label: 'Work-energy theorem', formula: 'T₁ + ΣU₁₋₂ = T₂', note: 'Work done by all forces equals the change in kinetic energy.' },
          { label: 'Power', formula: 'P = F · v', note: 'Rate of doing work.' },
        ],
        challenges: [
          'A block slides down a rough incline. Solve for its speed at the bottom using F = ma, then again using the work-energy theorem. Which needs fewer steps?',
          'Where does the energy go if you include friction in ΣU₁₋₂? Is it recoverable?',
        ],
        references: [],
      },
      {
        id: 'rigid-body-planar-kinematics',
        title: 'Rigid-Body Planar Kinematics',
        duration: '18m',
        summary: 'Every point on a spinning, translating rigid body moves differently — one equation ties them all together.',
        description:
          'A rigid body in planar motion can translate and rotate at once, so no two points on it generally share a velocity. The relative-motion equations fix that: once you know the motion of one point and the body’s angular velocity, every other point’s velocity and acceleration follow from its position relative to that point.',
        status: 'coming-soon',
        formulas: [
          { label: 'Relative velocity', formula: 'v_B = v_A + ω × r_(B/A)', note: 'Velocity of B in terms of a known point A and the body’s angular velocity ω.', emphasis: true },
          { label: 'Relative acceleration', formula: 'a_B = a_A + α × r_(B/A) − ω² r_(B/A)', note: 'Adds angular acceleration and the centripetal term.' },
          { label: 'Instant center of rotation', formula: 'v_P = ω × r_(P/IC)', note: 'The one point on the body (or its extension) that is momentarily at rest.' },
        ],
        challenges: [
          'A wheel rolls without slipping. Use the instant center to find the velocity of the point at the very top of the wheel.',
          'For a link rotating at constant ω, why is a_B ≠ a_A even though α = 0?',
        ],
        references: [],
      },
    ],
  },
  {
    id: 'thermal-fluids-engineering',
    code: '2.005',
    title: 'Thermal-Fluids Engineering',
    symbol: 'ΔU = Q − W',
    category: 'Thermal & fluids',
    description: 'Energy, heat, and flowing fluids: the conservation laws that size engines, pumps, and heat exchangers.',
    prerequisites: ['Calculus I–II', 'Physics: Mechanics'],
    references: [
      { label: 'MITx — Thermal-Fluids Engineering 1: Basics of Thermodynamics and Hydrostatics', url: 'https://mitxonline.mit.edu/courses/course-v1:MITxT+2.005.1x/' },
    ],
    topics: [
      {
        id: 'first-law-thermodynamics',
        title: 'First Law of Thermodynamics',
        duration: '15m',
        summary: 'Energy is never created or destroyed — only moved as heat or work.',
        description:
          'Every engine, refrigerator, and turbine obeys the same bookkeeping rule: whatever energy enters a system as heat or work has to show up somewhere, either stored inside the system or carried back out. The first law is that bookkeeping made precise, and it is the starting point for sizing any thermal system.',
        status: 'coming-soon',
        formulas: [
          { label: 'First law (closed system)', formula: 'ΔU = Q − W', note: 'Change in internal energy equals heat in minus work done by the system.', emphasis: true },
          { label: 'Specific heat (constant volume)', formula: 'Δu = cᵥ ΔT', note: 'For an ideal gas, internal energy depends only on temperature.' },
          { label: 'Enthalpy', formula: 'h = u + p v', note: 'Convenient energy measure for flow processes — accounts for flow work.' },
          { label: 'Steady-flow energy equation', formula: 'Q̇ − Ẇ = ṁ Δh', note: 'The first law written per unit time for a device with fluid flowing through it (turbine, pump, nozzle).' },
        ],
        challenges: [
          'A gas is compressed adiabatically (Q = 0). Where does the work you put in go?',
          'For a turbine, which term in the steady-flow energy equation represents the power it produces?',
        ],
        references: [],
      },
      {
        id: 'fluid-statics-bernoulli',
        title: "Fluid Statics, Continuity & Bernoulli's Equation",
        duration: '17m',
        summary: 'A fluid at rest just carries weight; a fluid in motion trades pressure, speed, and height for one another.',
        description:
          'Stand a column of water up and pressure builds with depth alone — no motion required. Let that water flow through a pipe that narrows and widens, and continuity forces it to speed up or slow down; Bernoulli’s equation is what tells you what the pressure does in response, as long as friction stays out of the picture.',
        status: 'coming-soon',
        formulas: [
          { label: 'Hydrostatic pressure', formula: 'p = p₀ + ρ g h', note: 'Pressure increases linearly with depth in a static fluid.' },
          { label: 'Continuity', formula: 'ρ₁ A₁ V₁ = ρ₂ A₂ V₂', note: 'Mass flow rate is conserved along a streamtube.' },
          { label: "Bernoulli's equation", formula: 'p + ½ ρ V² + ρ g z = const', note: 'Along a streamline, for steady, incompressible, frictionless flow.', emphasis: true },
        ],
        challenges: [
          'Water speeds up through a nozzle. According to Bernoulli, what must happen to the pressure — and where does that energy come from?',
          'Does Bernoulli’s equation apply across a pump? What term would you need to add?',
        ],
        references: [],
      },
      {
        id: 'pipe-flow-heat-transfer',
        title: 'Pipe Flow Losses & Convective Heat Transfer',
        duration: '17m',
        summary: 'Real pipes fight back with friction, and real surfaces shed heat to whatever fluid flows past them.',
        description:
          'Bernoulli’s equation describes an idealized fluid that never loses energy to friction — real pipes are not so generous. The Reynolds number tells you whether the flow is smooth (laminar) or churning (turbulent), which in turn sets how much pressure you lose to friction and how effectively the fluid carries heat away from a hot surface.',
        status: 'coming-soon',
        formulas: [
          { label: 'Reynolds number', formula: 'Re = ρ V D / μ', note: 'Ratio of inertial to viscous forces; Re ≲ 2300 is laminar in a pipe.' },
          { label: 'Darcy–Weisbach head loss', formula: 'h_f = f (L/D)(V² / 2g)', note: 'Friction loss along a pipe of length L, diameter D.' },
          { label: 'Laminar friction factor', formula: 'f = 64 / Re', note: 'Exact result for fully developed laminar pipe flow.' },
          { label: "Newton's law of cooling", formula: 'q″ = h (T_s − T_∞)', note: 'Convective heat flux from a surface, set by the convection coefficient h.', emphasis: true },
        ],
        challenges: [
          'Double the flow velocity in a pipe. By roughly what factor does the friction head loss grow if the flow stays turbulent?',
          'Why does blowing on hot soup cool it faster? Which variable in Newton’s law of cooling are you changing?',
        ],
        references: [],
      },
    ],
  },
  {
    id: 'design-and-manufacturing',
    code: '2.007',
    title: 'Design and Manufacturing',
    symbol: 'ω₄ / ω₂',
    category: 'Design & manufacturing',
    description: 'Mechanism design, kinematics, and building working machines.',
    prerequisites: ['Statics', 'Dynamics'],
    references: [
      { label: 'MIT OCW — 2.007 Design and Manufacturing I (Spring 2009)', url: 'https://ocw.mit.edu/courses/2-007-design-and-manufacturing-i-spring-2009/' },
    ],
    topics: [
      {
        id: '4bar-linkage',
        title: '4-Bar Linkage Kinematics',
        duration: '18m',
        summary: 'Simulate a four-bar mechanism and see how link lengths shape its motion.',
        description:
          'Four rigid links, four pin joints, one fixed to the ground — the four-bar linkage is the simplest mechanism that turns rotation into complex, useful motion. Change the link lengths and the whole character of the motion changes: cranks that spin fully, rockers that only oscillate, and points where the mechanism jams.',
        status: 'active',
        manimSrc: 'animations/4bar-linkage.mp4',
        formulas: [
          { label: 'Grashof condition', formula: 's + l ≤ p + q', latex: 's + l \\leq p + q', note: 's = shortest link, l = longest, p and q = the other two. If true, the shortest link can fully rotate relative to its neighbors.' },
          { label: 'Transmission angle', formula: 'μ = ∠(coupler, rocker)', latex: '\\mu = \\angle(\\text{coupler},\\ \\text{rocker})', note: 'Angle between the coupler and the rocker, measured at the joint connecting them. Force transmits best near μ = 90°.', emphasis: true },
          { label: 'Mechanical advantage', formula: 'MA = τ_out / τ_in = ω_in / ω_out', latex: 'MA = \\frac{\\tau_{out}}{\\tau_{in}} = \\frac{\\omega_{in}}{\\omega_{out}}', note: 'From power balance (T·ω = const, no friction). MA is largest near μ = 90° and collapses toward μ = 0° or 180°.' },
        ],
        challenges: [
          'Adjust the link lengths until the Grashof condition fails. What happens to the crank’s ability to fully rotate?',
          'Find the input angle where the transmission angle is worst. What does the mechanism’s motion look like there?',
          'Increase the coupler length only. How does the output rocker’s swing angle change?',
        ],
        references: [
          { label: 'MIT OCW — 2.007 Design and Manufacturing I: Mechanisms lecture', url: 'https://ocw.mit.edu/courses/2-007-design-and-manufacturing-i-spring-2009/pages/lecture-notes/' },
        ],
      },
    ],
  },
]

export function findTopic(courseId: string, topicId: string) {
  const course = CURRICULUM.find((c) => c.id === courseId)
  const topic = course?.topics.find((t) => t.id === topicId)
  return { course, topic }
}

export function findCourse(courseId: string) {
  return CURRICULUM.find((c) => c.id === courseId)
}

export function firstActiveTopicId(course: CourseMeta) {
  return (course.topics.find((t) => t.status === 'active') ?? course.topics[0])?.id
}

export function adjacentTopics(course: CourseMeta, topicId: string) {
  const idx = course.topics.findIndex((t) => t.id === topicId)
  return {
    previous: idx > 0 ? course.topics[idx - 1] : undefined,
    next: idx >= 0 && idx < course.topics.length - 1 ? course.topics[idx + 1] : undefined,
  }
}
