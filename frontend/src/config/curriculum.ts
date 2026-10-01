/**
 * Curriculum content model: courses contain topics, topics render as lessons.
 * Mirrors the course -> module -> topic hierarchy described in CLAUDE.md.
 */

import { NEW_COURSES as NEW_5, EXTRA_TOPICS as EXTRA_5 } from './slices/thermal'
import { NEW_COURSES as NEW_0, EXTRA_TOPICS as EXTRA_0 } from './slices/statics-machine'
import { NEW_COURSES as NEW_1, EXTRA_TOPICS as EXTRA_1 } from './slices/dynamics-controls'
import { NEW_COURSES as NEW_2, EXTRA_TOPICS as EXTRA_2 } from './slices/fluids'
import { NEW_COURSES as NEW_3, EXTRA_TOPICS as EXTRA_3 } from './slices/robotics'
import { NEW_COURSES as NEW_4, EXTRA_TOPICS as EXTRA_4 } from './slices/materials-mfg'

export type TopicStatus = 'active' | 'coming-soon'

export type TopicLevel = 'Beginner' | 'Intermediate' | 'Advanced'

export interface FormulaEntry {
  label: string
  formula: string
  /** LaTeX source rendered via KaTeX. Optional so unmigrated entries fall back to `formula` as plain text. */
  latex?: string
  note: string
  emphasis?: boolean
}

/** A single numeric worked problem — given data, the target quantity, the solution steps, and the final answer. */
export interface WorkedExample {
  given: string
  find: string
  steps: string[]
  answer: string
}

/** A real photograph of the actual part this topic models, with attribution for its (permissive) license. */
export interface RealImage {
  /** Path under /media/photos served from frontend/public, e.g. photos/bearing-selection.jpg */
  src: string
  alt: string
  credit: string
  creditUrl: string
  license: string
}

export interface TopicMeta {
  id: string
  title: string
  duration: string
  /** Where this sits in a self-study path — shown as a badge next to duration. */
  level: TopicLevel
  summary: string
  description: string
  status: TopicStatus
  /** Path under /media served from frontend/public, e.g. animations/stress-strain.mp4 */
  manimSrc?: string
  /** A real photo of the physical part, shown alongside the annotated diagram. Optional while rollout is in progress. */
  realImage?: RealImage
  formulas: FormulaEntry[]
  /** "By the end of this topic you'll be able to..." — outcomes shown before the formulas. Optional while rollout is in progress. */
  learningObjectives?: string[]
  /** A fully worked numeric example with a concrete given/find/solution/answer. Optional while rollout is in progress. */
  workedExample?: WorkedExample
  challenges: string[]
  /** Where this formula actually shows up in industry — grounds the math in real parts and failures. */
  applications: string[]
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

const BASE_CURRICULUM: CourseMeta[] = [
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
        level: 'Beginner',
        summary: 'Explore how materials deform under stress and understand elastic vs. plastic behavior.',
        description:
          'A bar pulled in tension stretches. Below the yield point it springs back to its original length; push past yield and the stretch becomes permanent. The stress-strain curve is how engineers read a material’s whole personality — stiffness, strength, and ductility — off a single test.',
        status: 'active',
        manimSrc: 'animations/stress-strain.mp4',
        learningObjectives: [
          'Compute normal stress and engineering strain from a measured load and deformation',
          "Read a material's stiffness (E), yield strength, and ductility directly off its stress-strain curve",
          'Tell whether a loaded part is still in its elastic region or has yielded permanently',
        ],
        formulas: [
          { label: 'Normal stress', formula: 'σ = F / A', latex: '\\sigma = \\frac{F}{A}', note: 'Force distributed over the cross-sectional area.' },
          { label: 'Engineering strain', formula: 'ε = ΔL / L₀', latex: '\\varepsilon = \\frac{\\Delta L}{L_0}', note: 'Fractional change in length under load.' },
          { label: "Young's modulus", formula: 'E = σ / ε', latex: 'E = \\frac{\\sigma}{\\varepsilon}', note: 'Slope of the elastic (linear) region — stiffness.', emphasis: true },
          { label: "Poisson's ratio", formula: 'ν = −ε_lateral / ε_axial', latex: '\\nu = -\\frac{\\varepsilon_{lateral}}{\\varepsilon_{axial}}', note: 'How much a material thins as it stretches.' },
        ],
        workedExample: {
          given: 'A steel bar with cross-sectional area A = 200 mm², original length L₀ = 500 mm, and E = 210 GPa is pulled with a tensile force F = 40 kN. The steel yields at 250 MPa.',
          find: 'The stress, whether the bar stays elastic, and how much it stretches.',
          steps: [
            'σ = F / A = 40,000 N / (200×10⁻⁶ m²) = 200 MPa',
            'Compare to yield: 200 MPa < 250 MPa, so the bar stays in the elastic region.',
            'ε = σ / E = 200 MPa / 210,000 MPa ≈ 0.000952 (0.095%)',
            'ΔL = ε · L₀ = 0.000952 × 500 mm ≈ 0.48 mm',
          ],
          answer: 'The bar stretches about 0.48 mm and remains fully elastic — well short of yielding.',
        },
        challenges: [
          'At what applied stress does steel first leave the elastic region in this playground? Compare it to the yield stress you set.',
          'Switch to aluminum. For the same applied stress, how much more strain do you get than with steel — and why does that follow from E?',
          'Push a custom material well past its ultimate stress. What does "fracture" mean physically at that point?',
        ],
        applications: [
          'Choosing steel vs. aluminum for a load-bearing bracket by comparing E and yield stress',
          'Certifying a raw material batch against its mill test tensile curve before it ships',
          'Setting the elastic design margin on a pressure vessel wall',
        ],
        references: [
          { label: 'OpenStax University Physics Vol. 1 — 12.3 Stress, Strain, and Elastic Modulus', url: 'https://openstax.org/books/university-physics-volume-1/pages/12-3-stress-strain-and-elastic-modulus' },
          { label: 'Engineering LibreTexts — Mechanics of Materials (Roylance), Ch. 1: Tensile Response of Materials', url: 'https://eng.libretexts.org/Bookshelves/Mechanical_Engineering/Mechanics_of_Materials_(Roylance)/01%3A_Tensile_Response_of_Materials' },
        ],
      },
      {
        id: 'torsion',
        title: 'Torsion in Circular Shafts',
        duration: '12m',
        level: 'Intermediate',
        summary: 'Shear stress distribution and angle of twist under torsional loading.',
        description:
          'Twist a shaft and every fiber inside it shears against its neighbor — most at the surface, not at all at the center. That radial pattern is what makes a solid shaft so efficient at carrying torque, and it is also why the angle of twist and the peak stress obey two different, equally important limits when you size a drive shaft.',
        status: 'active',
        manimSrc: 'animations/torsion.mp4',
        learningObjectives: [
          "Compute the shear stress distribution across a circular shaft's cross-section",
          'Size a shaft diameter against both a stress limit and an angle-of-twist limit',
          "Explain why shear stress is zero at a shaft's center and maximum at its surface",
        ],
        formulas: [
          { label: 'Polar moment of inertia', formula: 'J = π d⁴ / 32', latex: 'J = \\frac{\\pi d^4}{32}', note: 'For a solid circular shaft of diameter d.' },
          { label: 'Shear stress at radius r', formula: 'τ(r) = T r / J', latex: '\\tau(r) = \\frac{T r}{J}', note: 'Zero at the center, maximum at the outer surface.' },
          { label: 'Maximum shear stress', formula: 'τ_max = 16 T / (π d³)', latex: '\\tau_{max} = \\frac{16 T}{\\pi d^3}', note: 'At the shaft surface, r = d/2.', emphasis: true },
          { label: 'Angle of twist', formula: 'θ = T L / (G J)', latex: '\\theta = \\frac{T L}{G J}', note: 'G is the shear modulus; longer or softer shafts twist more.' },
          { label: 'Shear yield check (Tresca)', formula: 'τ_yield = σ_yield / 2', latex: '\\tau_{yield} = \\frac{\\sigma_{yield}}{2}', note: 'Maximum shear stress theory — compare τ_max against this.' },
        ],
        workedExample: {
          given: 'A solid steel shaft, diameter d = 40 mm, length L = 1 m, shear modulus G = 80 GPa, carries a torque T = 500 N·m.',
          find: 'The maximum shear stress and the angle of twist over the shaft length.',
          steps: [
            'J = π d⁴ / 32 = π (0.04)⁴ / 32 ≈ 2.51×10⁻⁷ m⁴',
            'τ_max = 16T / (π d³) = 16(500) / (π · 0.04³) ≈ 39.8 MPa',
            'θ = TL / (GJ) = 500(1) / (80×10⁹ × 2.51×10⁻⁷) ≈ 0.0249 rad ≈ 1.4°',
          ],
          answer: 'Peak shear stress is about 39.8 MPa at the shaft surface, and it twists roughly 1.4° over its 1 m length.',
        },
        challenges: [
          'Double the shaft diameter with torque and length fixed. τ_max drops by what factor — and does that match 16T/(πd³)?',
          'Switch from steel to aluminum at the same torque and diameter. Which changes more: the stress or the angle of twist — and why does G matter for one but not the other?',
          'Find the diameter at which this shaft just reaches a safety factor of 1.5 against shear yield. Is stress or the angle-of-twist limit more likely to govern first in a real design?',
        ],
        applications: [
          'Sizing a vehicle propeller shaft or rear axle for peak engine torque',
          'Picking a screwdriver shank or drill bit diameter that won\u2019t twist off',
          'Rating a wind turbine main shaft for the torque swing between gusts',
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
        level: 'Beginner',
        summary: 'Elongation of bars under load, statically indeterminate members, and thermal stress.',
        description:
          'A bar under axial load stretches by an amount that depends on its stiffness (AE) and its length — the same rule as a spring, just written in material terms. Constrain that same bar at both ends, or heat it up, and the bar can no longer stretch freely: it develops internal stress even with no external load at all, purely from being stopped from doing what it wants to do.',
        status: 'active',
        manimSrc: 'animations/axial-loading.mp4',
        learningObjectives: [
          'Compute elongation of an axially loaded bar from its stiffness (AE) and length',
          'Distinguish free thermal expansion from the stress caused by constrained expansion',
          'Set up the compatibility equation needed to solve a statically indeterminate bar problem',
        ],
        formulas: [
          { label: 'Axial elongation', formula: 'δ = FL / (AE)', latex: '\\delta = \\frac{FL}{AE}', note: 'Same form as a spring: stiffer (higher AE) or shorter bars stretch less.', emphasis: true },
          { label: 'Thermal expansion', formula: 'δ_T = α ΔT L', latex: '\\delta_T = \\alpha\\, \\Delta T\\, L', note: 'α is the coefficient of thermal expansion. Free expansion — no stress if unconstrained.' },
          { label: 'Thermal stress (fully constrained)', formula: 'σ_T = E α ΔT', latex: '\\sigma_T = E \\alpha\\, \\Delta T', note: 'If a bar is prevented from expanding at all, the blocked strain becomes stress instead.' },
          { label: 'Compatibility (indeterminate case)', formula: 'δ_1 = δ_2', latex: '\\delta_1 = \\delta_2', note: 'When statics alone can\u2019t find the forces, the two parts must deform together — that extra equation closes the system.' },
        ],
        workedExample: {
          given: 'A steel rod fixed rigidly at both ends (A = 300 mm², E = 200 GPa, α = 12×10⁻⁶/°C) is heated by ΔT = 50°C.',
          find: 'The stress that develops in the constrained rod.',
          steps: [
            'Free thermal strain would be ε_T = αΔT = 12×10⁻⁶ × 50 = 6×10⁻⁴ (0.06%)',
            "Both ends are fixed, so that strain is entirely blocked — it shows up as stress instead of stretch: σ_T = EαΔT = 200,000 MPa × 12×10⁻⁶ × 50 = 120 MPa",
            'Compare: the same rod free to expand develops σ = 0 for the same ΔT — nothing stops the strain from happening.',
          ],
          answer: '120 MPa of compressive stress, purely from being blocked from expanding — no external load needed.',
        },
        challenges: [
          'A steel rod is heated but free to expand. Does it develop any stress? Now clamp both ends and heat it the same amount — what changes?',
          'Two rods of different stiffness share a load in parallel between two rigid plates. Why must the stiffer rod carry more force?',
        ],
        applications: [
          'Sizing truss members in a bridge or tower crane jib',
          'Checking pipeline stress where a run heats up and can\u2019t freely expand',
          'Calculating bolt or turnbuckle stretch when tensioning a rod',
        ],
        references: [
          { label: 'MIT OCW 2.001 — Lecture Notes: Uniaxial Loading, Trusses and Static Indeterminacy', url: 'https://ocw.mit.edu/courses/2-001-mechanics-materials-i-fall-2006/pages/lecture-notes/' },
          { label: 'Engineering LibreTexts — Mechanics of Materials (Roylance), Ch. 2: Simple Tensile and Shear Structures', url: 'https://eng.libretexts.org/Bookshelves/Mechanical_Engineering/Mechanics_of_Materials_(Roylance)/02%3A_Simple_Tensile_and_Shear_Structures' },
        ],
      },
      {
        id: 'shear-bending-diagrams',
        title: 'Shear Force & Bending Moment Diagrams',
        duration: '16m',
        level: 'Intermediate',
        summary: 'Build V(x) and M(x) diagrams for a beam under point and distributed loads.',
        description:
          'Cut a beam anywhere and ask what the two halves must be doing to each other to stay in equilibrium: one answer is a shear force, the other is a bending moment. Walk that imaginary cut along the whole beam and you get two functions, V(x) and M(x) — and the shape of one is completely determined by the other.',
        status: 'active',
        manimSrc: 'animations/shear-bending-diagrams.mp4',
        learningObjectives: [
          'Compute support reactions and draw V(x) and M(x) for a beam under point and distributed loads',
          "Use dV/dx = −w and dM/dx = V to sketch a diagram's shape without re-deriving it from scratch",
          'Identify the location on a beam where a bending failure is most likely to start',
        ],
        formulas: [
          { label: 'Shear from distributed load', formula: 'dV/dx = −w(x)', latex: '\\frac{dV}{dx} = -w(x)', note: 'A downward distributed load w(x) makes shear decrease along the beam.' },
          { label: 'Moment from shear', formula: 'dM/dx = V(x)', latex: '\\frac{dM}{dx} = V(x)', note: 'Shear is the slope of the moment diagram — zero shear marks a peak or valley in M(x).', emphasis: true },
          { label: 'Point load jump', formula: 'ΔV = −P', latex: '\\Delta V = -P', note: 'A concentrated load causes a step discontinuity in the shear diagram.' },
        ],
        workedExample: {
          given: 'A simply supported beam, span L = 6 m, carries a point load P = 12 kN at midspan.',
          find: 'The support reactions and the maximum bending moment.',
          steps: [
            'By symmetry, R_A = R_B = P / 2 = 6 kN',
            'V(x) = +6 kN just right of A, constant until midspan, then jumps by −P to −6 kN (ΔV = −P at the point load)',
            'M(x) climbs linearly from 0, peaking exactly where V crosses zero (at midspan), then falls back to 0 at B',
            'M_max = R_A × 3 m = 6 kN × 3 m = 18 kN·m',
          ],
          answer: 'Maximum bending moment is 18 kN·m at the center of the beam — right where the shear diagram crosses zero.',
        },
        challenges: [
          'A simply supported beam carries one point load. Where on the beam is the bending moment at its largest — and how does that follow from dM/dx = V?',
          'Sketch what happens to the shear diagram at the exact location of a point load. Why is a "kink," not a jump, what you\u2019d see in the moment diagram there instead?',
        ],
        applications: [
          'Finding the critical section on a loaded beam before sizing its cross-section',
          'Checking a crane boom or forklift mast against its worst-case load position',
          'Analyzing a cantilevered shelf bracket or diving board under a tip load',
        ],
        references: [
          { label: 'MIT OCW 2.001 — Readings: Shear Force and Bending Moment Diagrams (Hibbeler Ch. 6)', url: 'https://ocw.mit.edu/courses/2-001-mechanics-materials-i-fall-2006/pages/readings/' },
          { label: 'MIT OCW 2.001 — Lecture Notes (Part 2: Forces and Moments in Slender Members)', url: 'https://ocw.mit.edu/courses/2-001-mechanics-materials-i-fall-2006/pages/lecture-notes/' },
        ],
      },
      {
        id: 'bending-stress-beams',
        title: 'Bending Stress in Beams',
        duration: '15m',
        level: 'Intermediate',
        summary: 'The flexure formula, the neutral axis, and the second moment of area.',
        description:
          'When a beam bends, one side of it is being stretched and the other compressed, with a single line down the middle — the neutral axis — feeling nothing at all. How much stress builds up at any height in the cross-section depends on how far that point sits from the neutral axis, and how the cross-section\u2019s shape resists bending in the first place.',
        status: 'active',
        manimSrc: 'animations/bending-stress-beams.mp4',
        learningObjectives: [
          'Apply the flexure formula σ = My/I to find bending stress at any height in a cross-section',
          'Compute the second moment of area I for rectangular and simple built-up sections',
          "Explain why a beam's orientation (b vs. h) changes its bending strength even at equal cross-sectional area",
        ],
        formulas: [
          { label: 'Flexure formula', formula: 'σ = M y / I', latex: '\\sigma = \\frac{M y}{I}', note: 'Bending stress at height y from the neutral axis, under moment M.', emphasis: true },
          { label: 'Second moment of area (rectangle)', formula: 'I = b h³ / 12', latex: 'I = \\frac{b h^3}{12}', note: 'Depth is cubed — doubling h makes the section eight times stiffer in bending.' },
          { label: 'Maximum bending stress', formula: 'σ_max = M c / I', latex: '\\sigma_{max} = \\frac{M c}{I}', note: 'c is the distance from the neutral axis to the outer fiber, c = h/2 for a symmetric section.' },
        ],
        workedExample: {
          given: 'A rectangular beam, b = 100 mm, h = 200 mm, carries the M = 18 kN·m moment found for the beam in the previous topic.',
          find: 'The maximum bending stress.',
          steps: [
            'I = b h³ / 12 = (100)(200)³ / 12 = 6.667×10⁷ mm⁴',
            'c = h / 2 = 100 mm (distance to the outer fiber)',
            'σ_max = M c / I = (18×10⁶ N·mm)(100 mm) / (6.667×10⁷ mm⁴) = 27 MPa',
          ],
          answer: '27 MPa at the top and bottom fibers — well under a typical structural steel’s 250 MPa yield, so this beam has plenty of strength margin at this load.',
        },
        challenges: [
          'Flip a rectangular beam on its side so b and h swap. Why does I — and therefore the bending stress — change so much even though the cross-sectional area is identical?',
          'At the neutral axis itself, what is the bending stress? Does that match what "neutral" is claiming?',
        ],
        applications: [
          'Selecting an I-beam section for a floor joist or roof purlin',
          'Sizing an aircraft wing spar cross-section for its bending load',
          'Setting leaf-spring thickness in a vehicle suspension',
        ],
        references: [
          { label: 'MIT OCW 2.001 — Lecture Notes: Pure Bending, Bending Stress and Beam Deflection', url: 'https://ocw.mit.edu/courses/2-001-mechanics-materials-i-fall-2006/pages/lecture-notes/' },
          { label: 'Engineering LibreTexts — Mechanics of Materials (Roylance), Ch. 4: Bending', url: 'https://eng.libretexts.org/Bookshelves/Mechanical_Engineering/Mechanics_of_Materials_(Roylance)/04%3A_Bending' },
        ],
      },
      {
        id: 'beam-deflection',
        title: 'Beam Deflection',
        duration: '17m',
        level: 'Intermediate',
        summary: 'The elastic curve, deflection limits, and the stiffness of a loaded beam.',
        description:
          'A beam that easily passes a strength check can still be useless if it sags too much — a floor that doesn\u2019t break but bounces underfoot has failed a different test. The elastic curve equation ties the beam\u2019s curvature directly to its bending moment, and integrating it twice gives the actual shape the beam settles into under load.',
        status: 'active',
        manimSrc: 'animations/beam-deflection.mp4',
        learningObjectives: [
          "Set up and use the elastic curve equation EIy'' = M(x) to predict beam sag",
          'Check a beam design against a serviceability deflection limit such as L/360',
          "Explain why deflection and bending-stress failure are separate checks that don't always agree on which beam governs",
        ],
        formulas: [
          { label: 'Governing equation', formula: 'E I y″ = M(x)', latex: 'E I\\, y^{\\prime\\prime} = M(x)', note: 'Curvature of the elastic curve is proportional to the local bending moment.', emphasis: true },
          { label: 'Support reactions (point load at a, b from supports)', formula: 'R_A = P b / L,  R_B = P a / L', latex: 'R_A = \\frac{P b}{L}, \\quad R_B = \\frac{P a}{L}', note: 'From ΣM = 0 about each support — the nearer support carries more.' },
          { label: 'Deflection under the load', formula: 'δ = P a² b² / (3 E I L)', latex: '\\delta = \\frac{P a^2 b^2}{3 E I L}', note: 'Stiffer material (E) or a deeper section (I) means less sag.' },
        ],
        workedExample: {
          given: 'The same 6 m simply supported beam and midspan P = 12 kN load, rectangular section (I = 6.667×10⁷ mm⁴), E = 200 GPa steel.',
          find: 'The deflection under the load, checked against an L/360 limit.',
          steps: [
            'a = b = L/2 = 3 m (load at midspan)',
            'δ = P a² b² / (3 E I L) = 12,000 × 3² × 3² / (3 × 200×10⁹ × 6.667×10⁻⁵ × 6) ≈ 0.00405 m = 4.05 mm',
            'Deflection limit: L/360 = 6000 mm / 360 ≈ 16.7 mm',
          ],
          answer: 'The beam sags about 4 mm under this load — comfortably inside the ~16.7 mm serviceability limit.',
        },
        challenges: [
          'Double the span of a beam with everything else fixed. By what factor does the deflection grow — and why is it not simply two?',
          'Find the beam depth at which deflection just meets a code limit of L/360. Does the strength check from bending stress pass at that same depth, or does one limit govern before the other?',
        ],
        applications: [
          'Checking a floor joist against a building-code deflection limit like L/360',
          'Setting the rail stiffness of a 3D-printer or CNC gantry so prints stay accurate',
          'Tuning the flex of a diving board or a ski underfoot',
        ],
        references: [
          { label: 'MIT OCW 2.001 — Lecture Notes: Beam Deflection, Superposition and Indeterminate Beams', url: 'https://ocw.mit.edu/courses/2-001-mechanics-materials-i-fall-2006/pages/lecture-notes/' },
          { label: 'MIT OCW 2.002 — Lecture Notes: Beam Bending, Buckling and Vibration', url: 'https://ocw.mit.edu/courses/2-002-mechanics-and-materials-ii-spring-2004/pages/lecture-notes/' },
        ],
      },
      {
        id: 'combined-loading-mohrs-circle',
        title: 'Combined Loading & Mohr\u2019s Circle',
        duration: '18m',
        level: 'Advanced',
        summary: 'Stress transformation, principal stresses, and reading them off a circle.',
        description:
          'A real part rarely feels pure tension or pure shear — it feels both at once, and the mix looks different depending on which direction you cut it. Mohr\u2019s circle turns that geometry problem into an actual circle: every point on it is the stress state on some cut plane, and the two special points where the circle crosses the horizontal axis are the principal stresses — the largest and smallest normal stress the material sees, with no shear at all.',
        status: 'active',
        manimSrc: 'animations/combined-loading-mohrs-circle.mp4',
        learningObjectives: [
          'Construct Mohr’s circle from σ_x, σ_y, and τ_xy and read off the principal stresses',
          'Explain why principal stresses can exceed either individual applied normal stress',
          'Choose the cut orientation that eliminates shear stress at a point',
        ],
        formulas: [
          { label: 'Average (center) stress', formula: 'σ_avg = (σ_x + σ_y) / 2', latex: '\\sigma_{avg} = \\frac{\\sigma_x + \\sigma_y}{2}', note: 'The center of Mohr\u2019s circle on the normal-stress axis.' },
          { label: "Mohr's circle radius", formula: 'R = √[((σ_x − σ_y)/2)² + τ_xy²]', latex: 'R = \\sqrt{\\left(\\frac{\\sigma_x - \\sigma_y}{2}\\right)^2 + \\tau_{xy}^2}', note: 'The radius of the circle — also the maximum shear stress at any orientation.' },
          { label: 'Principal stresses', formula: 'σ_1,2 = σ_avg ± R', latex: '\\sigma_{1,2} = \\sigma_{avg} \\pm R', note: 'The two points where the circle crosses the axis where shear is zero.', emphasis: true },
        ],
        workedExample: {
          given: 'A pressurized-pipe wall element has σ_x = 80 MPa (hoop stress), σ_y = 40 MPa (axial stress), τ_xy = 20 MPa (shear from a weld offset).',
          find: 'The principal stresses.',
          steps: [
            'σ_avg = (80 + 40) / 2 = 60 MPa (center of the circle)',
            'R = √[((80 − 40)/2)² + 20²] = √(20² + 20²) = √800 ≈ 28.3 MPa',
            'σ_1,2 = 60 ± 28.3 → σ_1 ≈ 88.3 MPa, σ_2 ≈ 31.7 MPa',
          ],
          answer: 'Principal stresses of about 88.3 MPa and 31.7 MPa — noticeably higher than either σ_x or σ_y alone, which is exactly why combined loading can’t be eyeballed.',
        },
        challenges: [
          'Set τ_xy = 0 with σ_x ≠ σ_y. Where do the principal stresses end up, and why does that make sense physically?',
          'Increase τ_xy while holding σ_x and σ_y fixed. What happens to the radius of the circle, and to the gap between the two principal stresses?',
        ],
        applications: [
          'Checking a pressure-vessel weld under combined hoop stress and torsion',
          'Analyzing a pipe elbow that sees bending plus internal pressure at once',
          'Choosing the orientation of a strain gauge rosette on a rotating shaft',
        ],
        references: [
          { label: 'MIT OCW 2.001 — Lecture Notes: Multiaxial Stress, Stress Transformations and Principal Stress', url: 'https://ocw.mit.edu/courses/2-001-mechanics-materials-i-fall-2006/pages/lecture-notes/' },
          { label: 'Engineering LibreTexts — Mechanics of Materials (Roylance), Ch. 3: General Concepts of Stress and Strain', url: 'https://eng.libretexts.org/Bookshelves/Mechanical_Engineering/Mechanics_of_Materials_(Roylance)/03%3A_General_Concepts_of_Stress_and_Strain' },
        ],
      },
      {
        id: 'columns-buckling',
        title: 'Columns & Buckling',
        duration: '16m',
        level: 'Advanced',
        summary: 'Euler buckling, end conditions, and why slender columns fail without ever yielding.',
        description:
          'A short, stubby column crushed under load fails by the material giving way — a strength problem. A long, slender column under the very same load can fail first by suddenly bowing sideways and never straightening back out, at a load far below what the material could otherwise take. That failure is about geometry and stiffness, not strength, and it is exactly what Euler\u2019s buckling formula predicts.',
        status: 'active',
        manimSrc: 'animations/columns-buckling.mp4',
        learningObjectives: [
          "Compute a column's Euler critical buckling load for different end conditions",
          'Use the slenderness ratio to tell whether a column will fail by buckling or by crushing',
          "Explain why a slender column can fail well below its material's crushing strength",
        ],
        formulas: [
          { label: 'Euler critical load', formula: 'P_cr = π² E I / (K L)²', latex: 'P_{cr} = \\frac{\\pi^2 E I}{(K L)^2}', note: 'The axial load at which a slender column buckles. K depends on how the ends are held.', emphasis: true },
          { label: 'Effective length factor', formula: 'K: 1 (pinned-pinned), 0.5 (fixed-fixed), 2 (fixed-free)', latex: 'K = 1,\\ 0.5,\\ 2\\ \\ldots', note: 'Stiffer end conditions shorten the effective length the column "feels."' },
          { label: 'Slenderness ratio', formula: 'λ = K L / r,  r = √(I/A)', latex: '\\lambda = \\frac{K L}{r}, \\quad r = \\sqrt{I/A}', note: 'A single number that separates "slender, buckling governs" columns from "stubby, strength governs" ones.' },
        ],
        workedExample: {
          given: 'A pin-pinned steel column (K = 1), L = 3 m, E = 200 GPa, solid circular cross-section d = 50 mm. Yield strength \u03c3_y = 250 MPa.',
          find: 'The Euler critical buckling load, compared against the load that would crush the material outright.',
          steps: [
            'I = \u03c0 d\u2074 / 64 = \u03c0 (0.05)\u2074 / 64 \u2248 3.07\u00d710\u207b\u2077 m\u2074',
            'P_cr = \u03c0\u00b2 E I / (K L)\u00b2 = \u03c0\u00b2 (200\u00d710\u2079)(3.07\u00d710\u207b\u2077) / (1 \u00d7 3)\u00b2 \u2248 67.3 kN',
            'Crushing load for comparison: \u03c3_y A = 250\u00d710\u2076 \u00d7 \u03c0(0.025)\u00b2 \u2248 490.9 kN',
          ],
          answer: 'This column buckles sideways at ~67.3 kN \u2014 about 7\u00d7 lower than the ~491 kN it could take if pure material crushing were the only concern. Geometry, not strength, governs.',
        },
        challenges: [
          'Double a column\u2019s length with everything else fixed. By what factor does its critical buckling load drop?',
          'The same column is pinned-pinned in one design and fixed-fixed in another. Which one can carry more load before buckling, and by what factor?',
        ],
        applications: [
          'Sizing a scaffolding prop or formwork shore against sideways buckling, not crushing',
          'Setting the strut diameter on an aircraft landing-gear leg',
          'Choosing bicycle-frame tube diameter for stiffness under pedaling and impact loads',
        ],
        references: [
          { label: 'MIT OCW 2.002 — Lecture Notes: Applications of Beam Bending, Buckling and Vibration', url: 'https://ocw.mit.edu/courses/2-002-mechanics-and-materials-ii-spring-2004/pages/lecture-notes/' },
        ],
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
        level: 'Advanced',
        summary: 'Distortion-energy and maximum-shear-stress theories for predicting yielding under combined stress.',
        description:
          'A single normal stress has an obvious yield point: compare it to σ_y and you’re done. A real part under combined bending, torsion, and pressure has no single stress to compare — it has a whole state of stress at a point, the same principal stresses read off Mohr’s circle. Von Mises and Tresca are two different, both widely used, rules for collapsing that multi-axis stress state back down to one number you can compare against a simple uniaxial yield test.',
        status: 'active',
        manimSrc: 'animations/failure-theories.mp4',
        realImage: {
          src: 'photos/failure-theories.jpg',
          alt: 'A cup-and-cone ductile fracture in an aluminum tensile-test specimen',
          credit: 'HB TUW',
          creditUrl: 'https://commons.wikimedia.org/wiki/File:Aluminiumzugprobe_01.jpg',
          license: 'CC BY-SA 4.0',
        },
        learningObjectives: [
          'Apply the von Mises and Tresca criteria to predict yielding under combined stress',
          'Compute a factor of safety against yielding from principal stresses and material yield strength',
          'Explain why Tresca is always at least as conservative as von Mises',
        ],
        formulas: [
          { label: 'Von Mises effective stress (plane stress)', formula: "σ' = √(σ1² − σ1σ2 + σ2²)", latex: "\\sigma' = \\sqrt{\\sigma_1^2 - \\sigma_1\\sigma_2 + \\sigma_2^2}", note: 'Collapses the two principal stresses into one equivalent uniaxial stress.', emphasis: true },
          { label: 'Tresca (max shear stress) criterion', formula: 'σ1 − σ3 = σ_y / n', latex: '\\sigma_1 - \\sigma_3 = \\frac{\\sigma_y}{n}', note: 'Uses only the largest and smallest principal stress — always at least as conservative as von Mises.' },
          { label: 'Factor of safety (von Mises)', formula: "n = σ_y / σ'", latex: "n = \\frac{\\sigma_y}{\\sigma'}", note: 'Ratio of the material’s yield strength to the computed effective stress.' },
        ],
        workedExample: {
          given: 'A stress element has principal stresses σ1 = 150 MPa, σ2 = −50 MPa (σ3 = 0, plane stress) from a combined bending-and-torsion analysis. Material yield strength σ_y = 350 MPa.',
          find: 'The factor of safety against yielding by both theories.',
          steps: [
            'Von Mises: σ\' = √(σ1² − σ1σ2 + σ2²) = √(150² − 150(−50) + (−50)²) = √32,500 ≈ 180.3 MPa',
            'n (von Mises) = σ_y / σ\' = 350 / 180.3 ≈ 1.94',
            'Tresca: with σ3 = 0, the extreme principal stresses are σ1 = 150 and σ3 = −50, so σ1 − σ3 = 200 MPa',
            'n (Tresca) = σ_y / 200 ≈ 1.75',
          ],
          answer: 'Both theories predict a safe design, but Tresca is more conservative (FOS 1.75 vs. 1.94) — using it as the design check leaves less margin for error.',
        },
        challenges: [
          'Set up a pure-shear stress state (σ_x=0, σ_y=0, τ_xy≠0). Where do von Mises and Tresca disagree the most, and by roughly what percentage?',
          'Increase τ_xy until von Mises just predicts yield. Has Tresca already predicted yield at a lower τ_xy, or exactly the same one?',
        ],
        applications: [
          'Checking a pressure-vessel nozzle under combined bending, torsion, and internal pressure',
          'Deciding between a ductile-material theory (von Mises) and a brittle-material theory (Mohr\u2019s failure) for a cast housing',
          'Setting the factor of safety on a gearbox casing under multi-axis stress',
        ],
        references: [
          { label: 'MIT OCW 2.001 — Lecture Notes: Failure of Materials and Examples', url: 'https://ocw.mit.edu/courses/2-001-mechanics-materials-i-fall-2006/pages/lecture-notes/' },
          { label: 'Engineering LibreTexts — Mechanics of Materials (Roylance), Ch. 6: Yield and Fracture', url: 'https://eng.libretexts.org/Bookshelves/Mechanical_Engineering/Mechanics_of_Materials_(Roylance)/06%3A_Yield_and_Fracture' },
        ],
      },
      {
        id: 'fatigue-analysis',
        title: 'Fatigue Analysis: S-N Curves & the Goodman Diagram',
        duration: '17m',
        level: 'Advanced',
        summary: 'Predict fatigue life and the infinite-life safety factor for a part under fluctuating stress.',
        description:
          'A load well below the yield stress can still break a part — if it’s applied and removed enough times. The S-N curve captures how many cycles a material survives at a given fully-reversed stress amplitude, and the Goodman diagram extends that picture to loads that fluctuate around a nonzero mean, drawing the line between "survives forever" and "fails eventually" as a function of both the swing and the offset of the stress.',
        status: 'active',
        manimSrc: 'animations/fatigue-analysis.mp4',
        realImage: {
          src: 'photos/fatigue-analysis.jpg',
          alt: 'A crankshaft fractured by fatigue, showing classic beach-mark crack growth striations',
          credit: 'Peterlewis',
          creditUrl: 'https://commons.wikimedia.org/wiki/File:Crankshaft_fatigue.jpg',
          license: 'CC BY-SA 3.0',
        },
        learningObjectives: [
          'Compute stress amplitude and mean stress from a fluctuating load cycle',
          'Use the modified Goodman diagram to find the factor of safety against fatigue failure',
          'Explain why mean stress, not just stress amplitude, matters for fatigue life',
        ],
        formulas: [
          { label: "Basquin's equation (finite life)", formula: "σ_a = σ_f' (2N)^b", latex: "\\sigma_a = \\sigma_f' (2N)^b", note: 'Amplitude-life relationship in the finite-life region; N is cycles to failure.' },
          { label: 'Endurance limit (unmodified, steel)', formula: 'S_e′ ≈ 0.5 S_ut', latex: "S_e' \\approx 0.5\\,S_{ut}", note: 'Roughly half the ultimate strength for many steels; corrected by surface/size/loading factors for a real S_e.' },
          { label: 'Modified Goodman line', formula: 'σ_a/S_e + σ_m/S_ut = 1/n', latex: '\\frac{\\sigma_a}{S_e} + \\frac{\\sigma_m}{S_{ut}} = \\frac{1}{n}', note: 'The safe region is everything inside this line; n is the factor of safety against fatigue failure at that load ratio.', emphasis: true },
        ],
        workedExample: {
          given: 'A steel part (S_ut = 620 MPa, corrected endurance limit S_e = 280 MPa) sees a fluctuating stress cycling between σ_max = 150 MPa and σ_min = 30 MPa.',
          find: 'The factor of safety against fatigue failure using the modified Goodman line.',
          steps: [
            'σ_a = (σ_max − σ_min) / 2 = (150 − 30)/2 = 60 MPa',
            'σ_m = (σ_max + σ_min) / 2 = (150 + 30)/2 = 90 MPa',
            'Goodman: σ_a/S_e + σ_m/S_ut = 1/n → 60/280 + 90/620 = 0.214 + 0.145 = 0.359',
            'n = 1 / 0.359 ≈ 2.78',
          ],
          answer: 'Factor of safety ≈ 2.78 against fatigue failure — this part should survive indefinitely (infinite life) at this load.',
        },
        challenges: [
          'Hold the stress amplitude fixed and increase the mean stress. Does the Goodman line say the part is more or less likely to fail — and does that match your intuition about a bolt that’s always partly loaded?',
          'Set the mean stress to zero (fully reversed loading). What does the Goodman equation reduce to, and how does that connect back to the S-N curve alone?',
        ],
        applications: [
          'Predicting crankshaft life in a reciprocating engine',
          'Rating a bridge expansion joint for decades of traffic-load cycles',
          'Estimating aircraft fuselage skin fatigue life under repeated cabin pressurization',
        ],
        references: [
          { label: 'MIT OCW 2.72 — Lecture Notes (Session 4: Fatigue, Fundamentals and Modeling Methods)', url: 'https://ocw.mit.edu/courses/2-72-elements-of-mechanical-design-spring-2009/pages/lecture-notes/' },
          { label: 'MIT OCW 2.002 — Lecture Notes: Fatigue (Sessions 27-30)', url: 'https://ocw.mit.edu/courses/2-002-mechanics-and-materials-ii-spring-2004/pages/lecture-notes/' },
        ],
      },
      {
        id: 'shaft-design',
        title: 'Shaft Design Under Combined Bending and Torsion',
        duration: '18m',
        level: 'Advanced',
        summary: 'Size a rotating shaft for combined bending-and-torsion fatigue loading, including stress concentration at a fillet.',
        description:
          'A power-transmission shaft rarely sees pure torsion — a gear or pulley hung off it adds bending, and the step or keyway needed to seat that gear concentrates the local stress well above the nominal value. The ASME shaft-design equation folds all three effects — combined loading, stress concentration, and fatigue-versus-steady stress — into a single formula for the minimum safe diameter.',
        status: 'active',
        manimSrc: 'animations/shaft-design.mp4',
        realImage: {
          src: 'photos/shaft-design.jpg',
          alt: 'A real propeller shaft and its support bearing',
          credit: 'U.S. National Archives (NARA)',
          creditUrl: 'https://commons.wikimedia.org/wiki/File:LCT-6-_Propeller_Shaft_and_Bearing_-_NARA_-_76033397.jpg',
          license: 'Public domain',
        },
        learningObjectives: [
          'Apply the ASME DE-Goodman equation to size a shaft under combined bending fatigue and steady torsion',
          'Account for stress concentration at a fillet or keyway using K_f and K_fs',
          "Explain why a shaft's required diameter can jump even when the nominal bending stress hasn't changed",
        ],
        formulas: [
          { label: 'ASME shaft diameter (DE-Goodman)', formula: 'd³ = (32n/π)·√[(K_f M_a/S_e)² + (3/4)(K_fs T_m/S_ut)²]', latex: 'd^3 = \\frac{32n}{\\pi}\\sqrt{\\left(\\frac{K_f M_a}{S_e}\\right)^2 + \\frac{3}{4}\\left(\\frac{K_{fs} T_m}{S_{ut}}\\right)^2}', note: 'The standard combined bending-fatigue / torsion-steady sizing equation; M_a is alternating bending moment, T_m is steady torque.', emphasis: true },
          { label: 'Fatigue stress-concentration factor', formula: 'K_f = 1 + q(K_t − 1)', latex: 'K_f = 1 + q(K_t - 1)', note: 'q is the notch sensitivity (0 to 1); a sharper fillet raises K_t but a more notch-sensitive material turns more of that into real fatigue damage.' },
          { label: 'Alternating von Mises stress at the fillet', formula: "σ_a' = K_f · 32 M_a / (π d³)", latex: "\\sigma_a' = K_f \\frac{32 M_a}{\\pi d^3}", note: 'The actual local stress the S-N curve / Goodman line needs to be checked against.' },
        ],
        workedExample: {
          given: 'A shaft shoulder fillet sees an alternating bending moment M_a = 200 N·m and a steady torque T_m = 150 N·m. Material: S_e = 300 MPa, S_ut = 600 MPa. Fatigue stress-concentration factors K_f = 1.6 (bending), K_fs = 1.3 (torsion). Target factor of safety n = 2.',
          find: 'The minimum shaft diameter.',
          steps: [
            'Convert to consistent units (N·mm, MPa): M_a = 200,000 N·mm, T_m = 150,000 N·mm',
            'Bending term: K_f M_a / S_e = 1.6(200,000)/300 ≈ 1067 mm³',
            'Torsion term: K_fs T_m / S_ut = 1.3(150,000)/600 = 325 mm³',
            'd³ = (32n/π)√[(1067)² + (3/4)(325)²] = (64/π)√(1,138,000 + 79,200) ≈ 20.37 × 1103 ≈ 22,480 mm³',
            'd = ∛22,480 ≈ 28.2 mm → specify the next standard stock size, 30 mm',
          ],
          answer: 'A 30 mm shaft gives the required factor of safety of 2 against combined fatigue bending and steady torsion at the fillet.',
        },
        challenges: [
          'Sharpen the fillet radius at the shoulder (increase K_t). What happens to the required shaft diameter, even though the nominal bending stress hasn’t changed at all?',
          'Remove the bending load entirely, leaving only steady torque. Does the ASME equation still need its fatigue term, or does it collapse into a static-strength check?',
        ],
        applications: [
          'Sizing a gearbox output shaft that carries both a keyway stress riser and gear bending',
          'Designing a pump or motor shaft coupling for a fluctuating load',
          'Setting a conveyor drive shaft diameter under combined belt-pull bending and drive torque',
        ],
        references: [
          { label: 'MIT 2.72 — Lecture 02: Shafts (Culpepper)', url: 'https://ocw.mit.edu/courses/2-72-elements-of-mechanical-design-spring-2009/130ca461b0fdb9b90a8818fe97d022f9_MIT2_72s09_lec02_shaft.pdf' },
        ],
      },
      {
        id: 'spring-design',
        title: 'Helical Compression Spring Design',
        duration: '16m',
        level: 'Intermediate',
        summary: 'Spring rate, coil shear stress, and the Wahl correction factor for a round-wire helical compression spring.',
        description:
          'A helical spring is really a torsion bar wound into a coil — every cross-section of the wire is being twisted, not bent, which is why the spring rate depends on the fourth power of wire diameter but only the inverse cube of coil diameter. The plain shear-stress formula for a straight torsion bar under-predicts the real peak stress in a coil, because the wire curves back on itself and the load line is offset from the wire’s centroid; the Wahl factor corrects for both effects at once.',
        status: 'active',
        manimSrc: 'animations/spring-design.mp4',
        realImage: {
          src: 'photos/spring-design.jpg',
          alt: 'Real helical compression springs of various wire and coil diameters',
          credit: 'Renard~enwiki',
          creditUrl: 'https://commons.wikimedia.org/wiki/File:Compression_Springs.JPG',
          license: 'CC BY-SA 3.0',
        },
        learningObjectives: [
          'Compute spring rate, deflection, and coil shear stress for a helical compression spring',
          'Apply the Wahl factor to correct for direct shear and coil curvature',
          'Choose a spring index that balances coilability against stress concentration',
        ],
        formulas: [
          { label: 'Spring rate', formula: 'k = G d⁴ / (8 D³ N)', latex: 'k = \\frac{G d^4}{8 D^3 N}', note: 'd = wire diameter, D = mean coil diameter, N = active coils, G = shear modulus.', emphasis: true },
          { label: 'Spring index', formula: 'C = D / d', latex: 'C = \\frac{D}{d}', note: 'Practical springs run C between about 4 and 12 — too low and the wire is hard to coil, too high and the spring is floppy and prone to buckling.' },
          { label: 'Wahl correction factor', formula: 'K_w = (4C−1)/(4C−4) + 0.615/C', latex: 'K_w = \\frac{4C-1}{4C-4} + \\frac{0.615}{C}', note: 'Corrects for direct shear and coil curvature; approaches 1 as the spring index grows large.' },
          { label: 'Corrected shear stress', formula: 'τ = K_w · 8 F D / (π d³)', latex: '\\tau = K_w \\frac{8FD}{\\pi d^3}', note: 'The real peak shear stress in the wire under axial force F.' },
        ],
        workedExample: {
          given: 'A helical compression spring: wire diameter d = 3 mm, mean coil diameter D = 24 mm (spring index C = 8), N = 10 active coils, G = 79 GPa. Compressed under F = 150 N.',
          find: 'The spring rate, deflection, and peak shear stress.',
          steps: [
            'k = G d⁴ / (8 D³ N) = 79,000 × 3⁴ / (8 × 24³ × 10) ≈ 5.79 N/mm',
            'δ = F / k = 150 / 5.79 ≈ 25.9 mm',
            'Wahl factor: K_w = (4C−1)/(4C−4) + 0.615/C = 31/28 + 0.615/8 ≈ 1.184',
            'τ = K_w · 8FD / (π d³) = 1.184 × 8(150)(24) / (π · 27) ≈ 402 MPa',
          ],
          answer: 'The spring compresses about 26 mm under 150 N and sees a peak shear stress of ~402 MPa — well under a typical 620 MPa design allowable for this wire.',
        },
        challenges: [
          'Hold the wire diameter fixed and shrink the coil diameter to push the spring index down toward 4. What happens to the Wahl factor, and to the actual stress at a given load?',
          'Double the number of active coils with everything else fixed. What happens to the spring rate — and does the stress in the wire change at all for the same applied force?',
        ],
        applications: [
          'Sizing a valve return spring in an internal combustion engine',
          'Matching a suspension coil-spring rate to a target ride frequency',
          'Designing the return spring in a retractable pen or a door-latch mechanism',
        ],
        references: [],
      },
      {
        id: 'bolted-joints',
        title: 'Bolted Joint Design & Preload',
        duration: '17m',
        level: 'Intermediate',
        summary: 'Joint stiffness, bolt preload, and how an external tensile load actually splits between the bolt and the clamped members.',
        description:
          'A properly preloaded bolt carries far less of an external load than intuition suggests, because tightening it has already stretched the bolt and compressed the clamped plates — both act like stiff springs in a system where most of any new external load goes toward unloading the plates rather than stretching the bolt further. The joint stiffness constant C captures exactly what fraction of the external load the bolt actually feels, and it is usually a surprisingly small number.',
        status: 'active',
        manimSrc: 'animations/bolted-joints.mp4',
        realImage: {
          src: 'photos/bolted-joints.jpg',
          alt: 'Real bolts clamping a pipe flange joint',
          credit: 'לקמוס',
          creditUrl: 'https://commons.wikimedia.org/wiki/File:Rusty_Bolts_on_Pipe_Flange.jpg',
          license: 'CC BY-SA 4.0',
        },
        learningObjectives: [
          'Compute the joint stiffness constant and use it to split an external load between bolt and members',
          'Specify bolt preload from proof load for both new and reused fasteners',
          'Explain why a well-preloaded bolt carries only a fraction of an external tensile load',
        ],
        formulas: [
          { label: 'Joint stiffness constant', formula: 'C = k_b / (k_b + k_m)', latex: 'C = \\frac{k_b}{k_b + k_m}', note: 'k_b = bolt stiffness, k_m = clamped-member stiffness; C is typically 0.2–0.3 for standard steel joints — the members are much stiffer than the bolt.' },
          { label: 'Resultant bolt load', formula: 'F_b = F_i + C·P', latex: 'F_b = F_i + C P', note: 'F_i is the preload, P is the external tensile load applied to the joint.', emphasis: true },
          { label: 'Resultant clamp (member) load', formula: 'F_m = F_i − (1−C)·P', latex: 'F_m = F_i - (1-C)P', note: 'The joint separates once F_m reaches zero — that sets the maximum allowed external load.' },
          { label: 'Recommended preload (reused fastener)', formula: 'F_i = 0.75 F_p', latex: 'F_i = 0.75\\,F_p', note: 'F_p is the proof load of the bolt (proof strength × tensile stress area).' },
        ],
        workedExample: {
          given: 'An M12, property-class-8.8 bolt (tensile stress area A_t = 84.3 mm², proof strength S_p = 660 MPa) clamps a joint with stiffness constant C = 0.25. The reused bolt later sees an external tensile load P = 20 kN.',
          find: 'The preload, and the resulting bolt and member loads under P.',
          steps: [
            'Proof load: F_p = S_p A_t = 660 × 84.3 ≈ 55.6 kN',
            'Recommended preload (reused fastener): F_i = 0.75 F_p ≈ 41.7 kN',
            'Bolt load under P: F_b = F_i + C·P = 41.7 + 0.25(20) = 46.7 kN',
            'Member (clamp) load: F_m = F_i − (1−C)P = 41.7 − 0.75(20) = 26.7 kN',
          ],
          answer: 'The bolt sees only 46.7 kN — not 41.7+20=61.7 kN — because most of the external load unloads the clamped members instead of stretching the bolt further. Since F_m stays positive at 26.7 kN, the joint never separates.',
        },
        challenges: [
          'Increase the external load P until F_m from the formula above reaches zero. What has physically happened to the joint at that point?',
          'Compare a joint with C=0.2 to one with C=0.8 under the same P and preload. Which bolt sees more load — and which joint would you trust more for a fatigue-critical application?',
        ],
        applications: [
          'Specifying preload torque on a pressure-vessel flange bolt circle',
          'Setting engine cylinder-head bolt torque so the head gasket stays sealed',
          'Designing a structural steel bolted connection to resist joint separation',
        ],
        references: [
          { label: 'MIT OCW 2.72 — Lecture Notes (Session 10: Connections II, Bolted Joints)', url: 'https://ocw.mit.edu/courses/2-72-elements-of-mechanical-design-spring-2009/pages/lecture-notes/' },
        ],
      },
      {
        id: 'bearing-selection',
        title: 'Rolling-Element Bearing Selection: L10 Life',
        duration: '15m',
        level: 'Advanced',
        summary: 'Predict the statistical fatigue life of a ball or roller bearing from its dynamic load rating and the actual applied load.',
        description:
          'No two identical bearings fail at exactly the same number of cycles — rolling-contact fatigue is inherently statistical. The L10 life is the number of revolutions 90% of a batch of identical bearings are expected to survive before the first sign of fatigue, and it is set entirely by the ratio of the manufacturer’s catalog dynamic load rating to the actual load the bearing carries, raised to a power that depends on whether the rolling elements are balls or rollers.',
        status: 'active',
        manimSrc: 'animations/bearing-selection.mp4',
        realImage: {
          src: 'photos/bearing-selection.jpg',
          alt: 'A real deep-groove ball bearing showing the balls between the inner and outer races',
          credit: 'R. Henrik Nilsson',
          creditUrl: 'https://commons.wikimedia.org/wiki/File:1984_deep_groove_ball_bearing_UR_6304_made_in_Czechoslovakia_by_ZKL.jpg',
          license: 'CC BY 4.0',
        },
        learningObjectives: [
          "Compute L10 life in revolutions and operating hours from a bearing's catalog rating",
          'Explain why bearing life is treated statistically rather than as a single guaranteed number',
          'Predict how a change in applied load shifts expected bearing life',
        ],
        formulas: [
          { label: 'L10 life (millions of revolutions)', formula: 'L10 = (C / P)^k', latex: 'L_{10} = \\left(\\frac{C}{P}\\right)^{k}', note: 'C = dynamic load rating, P = equivalent applied load, k = 3 for ball bearings, 10/3 for roller bearings.', emphasis: true },
          { label: 'Life in operating hours', formula: 'L10h = L10 · 10⁶ / (60 n)', latex: 'L_{10h} = \\frac{L_{10}\\times10^6}{60\\,n}', note: 'n = shaft speed in rpm.' },
        ],
        workedExample: {
          given: 'A ball bearing has a catalog dynamic load rating C = 25 kN, carries an equivalent applied load P = 5 kN, and rotates at n = 1800 rpm.',
          find: 'The L10 life in both revolutions and operating hours.',
          steps: [
            'L10 = (C/P)^k = (25/5)³ = 5³ = 125 million revolutions (k = 3 for ball bearings)',
            'L10h = L10 × 10⁶ / (60n) = 125×10⁶ / (60×1800) ≈ 1157 hours',
          ],
          answer: 'This bearing is expected to survive about 125 million revolutions — roughly 1,157 hours (~48 days) of continuous running at 1800 rpm before 10% of an identical batch would show fatigue.',
        },
        challenges: [
          'Double the applied load P with everything else fixed. By what factor does the L10 life drop for a ball bearing — and is that factor different for a roller bearing?',
          'A bearing rated for a 5-year life at its expected load turns out to see a 20% higher load in service. Roughly how much life is actually lost?',
        ],
        applications: [
          'Choosing a bearing catalog number for a conveyor idler pulley',
          'Predicting electric-motor bearing life to schedule preventive maintenance',
          'Sizing a wind-turbine main-shaft bearing against decades of variable wind load',
        ],
        references: [
          { label: 'MIT OCW 2.72 — Lecture Notes (Session 7: Rolling and Sliding Element Bearings)', url: 'https://ocw.mit.edu/courses/2-72-elements-of-mechanical-design-spring-2009/pages/lecture-notes/' },
        ],
      },
      {
        id: 'gear-tooth-bending',
        title: 'Spur Gear Tooth Bending Stress (Lewis Equation)',
        duration: '18m',
        level: 'Advanced',
        summary: 'How gear tooth geometry and tangential tooth load set the bending stress at the tooth root.',
        description:
          'A gear tooth is a stubby cantilever beam, loaded near its tip by the mating tooth — so the same flexure formula from beam bending applies, just packaged for gear geometry through the Lewis form factor. Add the fact that only one tooth (or briefly two) actually carries the full load at any instant, and gear design becomes a beam-bending problem wearing a different notation.',
        status: 'coming-soon',
        learningObjectives: [
          'Apply the Lewis equation to estimate bending stress at a gear tooth root',
          'Relate transmitted torque and pitch diameter to tangential tooth load',
          'Explain why tooth count changes the Lewis form factor and therefore tooth strength',
        ],
        formulas: [
          { label: 'Lewis bending stress', formula: 'σ = W^t P_d / (F Y)', latex: '\\sigma = \\frac{W^t P_d}{F Y}', note: 'W^t = tangential tooth load, P_d = diametral pitch, F = face width, Y = Lewis form factor (depends on tooth count).', emphasis: true },
          { label: 'Tangential tooth load from transmitted power', formula: 'W^t = 2T / d_p', latex: 'W^t = \\frac{2T}{d_p}', note: 'T = transmitted torque, d_p = pitch diameter.' },
        ],
        workedExample: {
          given: 'A 20-tooth spur gear (Lewis form factor Y = 0.322), diametral pitch P_d = 8 teeth/in, face width F = 1.25 in, pitch diameter d_p = 4 in, transmits a torque T = 850 lbf·in.',
          find: 'The tooth-root bending stress.',
          steps: [
            'W^t = 2T / d_p = 2(850)/4 = 425 lbf',
            'σ = W^t P_d / (F Y) = 425(8) / (1.25 × 0.322) ≈ 8,450 psi',
          ],
          answer: 'About 8,450 psi (≈58 MPa) at the tooth root — the number every gear-tooth fatigue check starts from.',
        },
        challenges: [
          'Cut the number of teeth on a gear in half while keeping the pitch diameter fixed (coarsening the pitch). What happens to the Lewis form factor Y, and why does that make the teeth stronger?',
          'Double the transmitted torque at a fixed pitch diameter. By what factor does the tooth-root bending stress increase?',
        ],
        applications: [
          'Sizing gearbox teeth for a wind-turbine planetary stage',
          'Checking an automotive transmission gear against tooth-root fatigue',
          'Selecting a robotics gearhead rated for the motor\u2019s peak torque',
        ],
        references: [],
      },
      {
        id: 'belt-chain-drives',
        title: 'Belt & Chain Drives',
        duration: '15m',
        level: 'Beginner',
        summary: 'Speed ratio and the belt tension ratio that sets how much power a flat or V-belt can actually transmit before it slips.',
        description:
          'A belt drive transmits power entirely through friction between the belt and the pulley, which means there is a hard limit on how much tension difference the belt can sustain before it slips — set by the coefficient of friction and how far the belt wraps around the pulley. Push past that limit and adding more motor torque does nothing except make the belt slip faster.',
        status: 'coming-soon',
        learningObjectives: [
          'Compute the speed ratio and belt tension ratio for a flat or V-belt drive',
          'Use the capstan equation to find the maximum power a belt can transmit before slipping',
          "Explain why wrap angle and friction coefficient — not motor torque alone — set a belt drive's capacity",
        ],
        formulas: [
          { label: 'Speed ratio', formula: 'N2 / N1 = d1 / d2', latex: '\\frac{N_2}{N_1} = \\frac{d_1}{d_2}', note: 'Output speed set purely by the ratio of pulley diameters, same as gears.' },
          { label: 'Belt tension ratio (capstan equation)', formula: 'T1 / T2 = e^(μθ)', latex: '\\frac{T_1}{T_2} = e^{\\mu\\theta}', note: 'μ = friction coefficient, θ = wrap angle in radians; the maximum tension ratio before slipping.', emphasis: true },
          { label: 'Power transmitted', formula: 'P = (T1 − T2)·v', latex: 'P = (T_1 - T_2)v', note: 'v = belt speed; only the difference in tension does useful work, the rest is just belt preload.' },
        ],
        workedExample: {
          given: 'A flat-belt drive: driving pulley d1 = 150 mm at N1 = 1750 rpm, driven pulley d2 = 300 mm, belt wrap angle θ = 160° (2.79 rad), friction coefficient μ = 0.3, tight-side tension T1 = 500 N.',
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
          'Shrink the wrap angle by moving the pulleys further apart (or using a smaller pulley). Does the belt’s power capacity go up or down before it slips?',
          'Double the friction coefficient (switch to a higher-grip belt material). By what factor does the maximum tension ratio change?',
        ],
        applications: [
          'Sizing a timing belt for an engine\u2019s camshaft drive',
          'Selecting a conveyor drive chain and sprocket ratio',
          'Choosing bicycle chainring and sprocket sizes for a target gear ratio',
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
        level: 'Beginner',
        summary: 'Describe how a particle moves — position, velocity, and acceleration — before asking why.',
        description:
          'Before any force enters the picture, motion itself has its own vocabulary. A position vector traced through time hides a velocity in its slope and an acceleration in its curvature; break that same motion into tangential and normal components and the acceleration splits cleanly into "speeding up" and "turning."',
        status: 'active',
        manimSrc: 'animations/particle-kinematics.mp4',
        realImage: {
          src: 'photos/particle-kinematics.jpg',
          alt: 'A rally car oversteering through a hard right turn during a rally race',
          credit: 'NiC00L147',
          creditUrl: 'https://commons.wikimedia.org/wiki/File:Rallye_car_drifting.jpg',
          license: 'CC BY-SA 4.0',
        },
        learningObjectives: [
          "Compute velocity and acceleration from a particle's position as a function of time",
          'Split acceleration into tangential (speeding up) and normal (turning) components',
          'Recognize when constant-acceleration equations are valid to use',
        ],
        formulas: [
          { label: 'Velocity', formula: 'v = dr / dt', note: 'Rate of change of position — a vector, not just a speed.' },
          { label: 'Acceleration', formula: 'a = dv / dt', note: 'Rate of change of velocity.' },
          { label: 'Tangential & normal components', formula: 'a = (dv/dt) ê_t + (v² / ρ) ê_n', note: 'Splits acceleration into along-the-path and toward-the-center-of-curvature parts.', emphasis: true },
          { label: 'Constant acceleration', formula: 's = s₀ + v₀t + ½at²', note: 'Valid only when a is constant — check before using it.' },
        ],
        workedExample: {
          given: "A car rounds a curve of radius ρ = 50 m at speed v = 20 m/s, accelerating tangentially at dv/dt = 2 m/s².",
          find: 'The tangential, normal, and total acceleration.',
          steps: [
            'a_t = dv/dt = 2 m/s² (along the path, from speeding up)',
            'a_n = v² / ρ = 20² / 50 = 8 m/s² (toward the curve\'s center, from turning)',
            'a = √(a_t² + a_n²) = √(4 + 64) = √68 ≈ 8.25 m/s²',
          ],
          answer: 'Total acceleration is about 8.25 m/s², dominated by the normal (turning) component — cornering demands far more acceleration here than the gentle speed-up along the path.',
        },
        challenges: [
          'A car speeds up while going around a curve. Sketch its tangential and normal acceleration components — which one is zero on a straight road?',
          'If a particle moves at constant speed but along a curved path, is its acceleration zero? What does a_n = v²/ρ tell you?',
        ],
        applications: [
          'Predicting the landing point of a part launched off an assembly line',
          'Planning elevator and crane-hook motion profiles for a smooth stop',
          'Programming a robotic end-effector trajectory between two points',
        ],
        references: [
          { label: 'OpenStax University Physics Vol. 1 — 4.1 Displacement and Velocity Vectors', url: 'https://openstax.org/books/university-physics-volume-1/pages/4-1-displacement-and-velocity-vectors' },
          { label: 'Engineering LibreTexts — Introductory Dynamics (Steeneken), Ch. 5: Kinematics of Point Masses', url: 'https://eng.libretexts.org/Bookshelves/Mechanical_Engineering/Introductory_Dynamics%3A_2D_Kinematics_and_Kinetics_of_Point_Masses_and_Rigid_Bodies_(Steeneken)/02%3A_Dynamics_of_Point_Masses/05%3A_Kinematics_of_Point_Masses' },
        ],
      },
      {
        id: 'newton-work-energy',
        title: "Newton's Second Law & Work-Energy Methods",
        duration: '16m',
        level: 'Intermediate',
        summary: 'Two ways to solve the same problem: force and acceleration, or work and energy.',
        description:
          'Newton’s second law connects force directly to acceleration at every instant — powerful, but it demands you track the whole motion. The work-energy theorem trades that detail for convenience: integrate force over distance once, and you get the change in kinetic energy directly, without ever solving for acceleration.',
        status: 'active',
        manimSrc: 'animations/newton-work-energy.mp4',
        realImage: {
          src: 'photos/newton-work-energy.jpg',
          alt: 'Tire skid (brake) marks on an asphalt road from hard braking',
          credit: 'Robert Kropf',
          creditUrl: 'https://commons.wikimedia.org/wiki/File:Bremsspur.jpg',
          license: 'CC BY-SA 3.0',
        },
        learningObjectives: [
          'Apply ΣF = ma to relate net force directly to acceleration',
          'Apply the work-energy theorem to solve for speed without solving for acceleration first',
          'Choose whichever method requires fewer steps for a given problem',
        ],
        formulas: [
          { label: "Newton's second law", formula: 'ΣF = m a', note: 'The net force on a particle sets its acceleration.', emphasis: true },
          { label: 'Kinetic energy', formula: 'T = ½ m v²', note: 'Energy stored in motion.' },
          { label: 'Work-energy theorem', formula: 'T₁ + ΣU₁₋₂ = T₂', note: 'Work done by all forces equals the change in kinetic energy.' },
          { label: 'Power', formula: 'P = F · v', note: 'Rate of doing work.' },
        ],
        workedExample: {
          given: 'A 1000 kg car traveling at v = 25 m/s (90 km/h) brakes hard on dry pavement (μ = 0.7).',
          find: 'The stopping distance, using the work-energy theorem.',
          steps: [
            'Friction (braking) force: F = μmg = 0.7(1000)(9.81) ≈ 6867 N',
            'Work-energy theorem: T1 + ΣU1-2 = T2 → ½mv1² − F·d = 0 (car comes to rest, T2 = 0)',
            'd = ½mv1² / F = 0.5(1000)(25²) / 6867 = 312,500 / 6867 ≈ 45.5 m',
          ],
          answer: 'The car needs about 45.5 m to stop — found without ever solving for the (constant) deceleration itself.',
        },
        challenges: [
          'A block slides down a rough incline. Solve for its speed at the bottom using F = ma, then again using the work-energy theorem. Which needs fewer steps?',
          'Where does the energy go if you include friction in ΣU₁₋₂? Is it recoverable?',
        ],
        applications: [
          'Estimating vehicle braking distance from kinetic energy and friction force',
          'Sizing a roller-coaster loop so cars keep enough energy to clear it',
          'Calculating pile-driver impact energy needed to seat a foundation pile',
        ],
        references: [
          { label: 'OpenStax University Physics Vol. 1 — 7.3 Work-Energy Theorem', url: 'https://openstax.org/books/university-physics-volume-1/pages/7-3-work-energy-theorem' },
          { label: 'Engineering LibreTexts — Introductory Dynamics (Steeneken), Ch. 7: Work and Energy', url: 'https://eng.libretexts.org/Bookshelves/Mechanical_Engineering/Introductory_Dynamics%3A_2D_Kinematics_and_Kinetics_of_Point_Masses_and_Rigid_Bodies_(Steeneken)/02%3A_Dynamics_of_Point_Masses/07%3A_Work_and_Energy' },
        ],
      },
      {
        id: 'rigid-body-planar-kinematics',
        title: 'Rigid-Body Planar Kinematics',
        duration: '18m',
        level: 'Advanced',
        summary: 'Every point on a spinning, translating rigid body moves differently — one equation ties them all together.',
        description:
          'A rigid body in planar motion can translate and rotate at once, so no two points on it generally share a velocity. The relative-motion equations fix that: once you know the motion of one point and the body’s angular velocity, every other point’s velocity and acceleration follow from its position relative to that point.',
        status: 'active',
        manimSrc: 'animations/rigid-body-planar-kinematics.mp4',
        realImage: {
          src: 'photos/rigid-body-planar-kinematics.jpg',
          alt: 'Close-up side view of a car tire, showing the rim and tread that contacts the road',
          credit: 'GT1976',
          creditUrl: 'https://commons.wikimedia.org/wiki/File:2017-11-16_(253)_Continental_ContiWinterContact_TS_850_195-65_R_15_91_T_tire_at_Bahnhof_Korneuburg.jpg',
          license: 'CC BY-SA 4.0',
        },
        learningObjectives: [
          'Use the relative-velocity equation to relate the motion of any two points on a rigid body',
          "Locate a body's instantaneous center of rotation and use it to find point velocities directly",
          'Explain why every point on a rotating-and-translating body can have a different velocity and acceleration',
        ],
        formulas: [
          { label: 'Relative velocity', formula: 'v_B = v_A + ω × r_(B/A)', note: 'Velocity of B in terms of a known point A and the body’s angular velocity ω.', emphasis: true },
          { label: 'Relative acceleration', formula: 'a_B = a_A + α × r_(B/A) − ω² r_(B/A)', note: 'Adds angular acceleration and the centripetal term.' },
          { label: 'Instant center of rotation', formula: 'v_P = ω × r_(P/IC)', note: 'The one point on the body (or its extension) that is momentarily at rest.' },
        ],
        workedExample: {
          given: 'A wheel of radius r = 0.3 m rolls without slipping, its center moving at v = 3 m/s (angular velocity ω = v/r = 10 rad/s).',
          find: 'The velocity of the point at the very top of the wheel.',
          steps: [
            'Rolling without slipping means the contact point at the bottom is the instantaneous center (IC) — momentarily at rest.',
            'The top point sits a distance 2r from the IC.',
            'v_top = ω × r_(top/IC) = 10 × (2 × 0.3) = 6 m/s, in the direction of travel.',
          ],
          answer: "The top of the wheel moves at 6 m/s — exactly twice the center's speed — which is why a rolling wheel blurs more at the top than at the hub.",
        },
        challenges: [
          'A wheel rolls without slipping. Use the instant center to find the velocity of the point at the very top of the wheel.',
          'For a link rotating at constant ω, why is a_B ≠ a_A even though α = 0?',
        ],
        applications: [
          'Analyzing windshield-wiper linkage velocity through its sweep',
          'Finding piston velocity from crank angle in an engine',
          'Mapping robotic-arm joint rates to end-effector velocity',
        ],
        references: [
          { label: 'Engineering LibreTexts — Introductory Dynamics (Steeneken), Ch. 9: Kinematics of Rigid Bodies', url: 'https://eng.libretexts.org/Bookshelves/Mechanical_Engineering/Introductory_Dynamics%3A_2D_Kinematics_and_Kinetics_of_Point_Masses_and_Rigid_Bodies_(Steeneken)/03%3A_Rigid_Body_Dynamics/09%3A_Kinematics_of_Rigid_Bodies' },
          { label: 'MIT OCW 2.003SC — Velocity, Acceleration and Rotational Motion', url: 'https://ocw.mit.edu/courses/2-003sc-engineering-dynamics-fall-2011/pages/velocity-acceleration-and-rotational-motion/' },
        ],
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
        level: 'Beginner',
        summary: 'Energy is never created or destroyed — only moved as heat or work.',
        description:
          'Every engine, refrigerator, and turbine obeys the same bookkeeping rule: whatever energy enters a system as heat or work has to show up somewhere, either stored inside the system or carried back out. The first law is that bookkeeping made precise, and it is the starting point for sizing any thermal system.',
        status: 'active',
        manimSrc: 'animations/first-law-thermodynamics.mp4',
        realImage: {
          src: 'photos/first-law-thermodynamics.jpg',
          alt: 'Cutaway of a horizontally-opposed 4-cylinder aircraft engine, showing pistons and cylinders',
          credit: 'Hustvedt',
          creditUrl: 'https://commons.wikimedia.org/wiki/File:Boxer_engine_cutaway.jpg',
          license: 'CC BY-SA 3.0',
        },
        learningObjectives: [
          'Apply the first law (ΔU = Q − W) to track energy through a closed system',
          'Distinguish work done by a system from work done on it',
          'Apply the steady-flow energy equation to a device with fluid flowing through it',
        ],
        formulas: [
          { label: 'First law (closed system)', formula: 'ΔU = Q − W', note: 'Change in internal energy equals heat in minus work done by the system.', emphasis: true },
          { label: 'Specific heat (constant volume)', formula: 'Δu = cᵥ ΔT', note: 'For an ideal gas, internal energy depends only on temperature.' },
          { label: 'Enthalpy', formula: 'h = u + p v', note: 'Convenient energy measure for flow processes — accounts for flow work.' },
          { label: 'Steady-flow energy equation', formula: 'Q̇ − Ẇ = ṁ Δh', note: 'The first law written per unit time for a device with fluid flowing through it (turbine, pump, nozzle).' },
        ],
        workedExample: {
          given: 'A gas in a piston-cylinder is compressed adiabatically (Q = 0). The surroundings do 15 kJ of work on the gas.',
          find: "The change in the gas's internal energy.",
          steps: [
            'First law: ΔU = Q − W, where W is work done BY the system.',
            'Work done ON the gas means W (by the system) = −15 kJ.',
            'ΔU = 0 − (−15) = +15 kJ',
          ],
          answer: "The gas's internal energy rises by 15 kJ — with nowhere for the compression work to go (Q=0), it all shows up as higher internal energy, which is why adiabatic compression heats a gas.",
        },
        challenges: [
          'A gas is compressed adiabatically (Q = 0). Where does the work you put in go?',
          'For a turbine, which term in the steady-flow energy equation represents the power it produces?',
        ],
        applications: [
          'Estimating engine thermal efficiency and fuel consumption',
          'Balancing an HVAC system\u2019s heating and cooling loads',
          'Sizing turbine or compressor power from mass flow and enthalpy change',
        ],
        references: [
          { label: 'OpenStax University Physics Vol. 2 — 3.3 First Law of Thermodynamics', url: 'https://openstax.org/books/university-physics-volume-2/pages/3-3-first-law-of-thermodynamics' },
          { label: 'OpenStax University Physics Vol. 2 — 3.2 Work, Heat, and Internal Energy', url: 'https://openstax.org/books/university-physics-volume-2/pages/3-2-work-heat-and-internal-energy' },
        ],
      },
      {
        id: 'fluid-statics-bernoulli',
        title: "Fluid Statics, Continuity & Bernoulli's Equation",
        duration: '17m',
        level: 'Beginner',
        summary: 'A fluid at rest just carries weight; a fluid in motion trades pressure, speed, and height for one another.',
        description:
          'Stand a column of water up and pressure builds with depth alone — no motion required. Let that water flow through a pipe that narrows and widens, and continuity forces it to speed up or slow down; Bernoulli’s equation is what tells you what the pressure does in response, as long as friction stays out of the picture.',
        status: 'active',
        manimSrc: 'animations/fluid-statics-bernoulli.mp4',
        realImage: {
          src: 'photos/fluid-statics-bernoulli.jpg',
          alt: 'Cutaway model of a Porsche triple carburetor, showing the venturi throats inside each barrel',
          credit: 'BerndB',
          creditUrl: 'https://commons.wikimedia.org/wiki/File:Porsche-carburetor-cutaway.jpg',
          license: 'CC BY-SA 3.0',
        },
        learningObjectives: [
          'Compute hydrostatic pressure at depth in a static fluid',
          'Apply continuity to find velocity change through a varying cross-section',
          "Apply Bernoulli's equation to relate pressure, velocity, and elevation along a streamline",
        ],
        formulas: [
          { label: 'Hydrostatic pressure', formula: 'p = p₀ + ρ g h', note: 'Pressure increases linearly with depth in a static fluid.' },
          { label: 'Continuity', formula: 'ρ₁ A₁ V₁ = ρ₂ A₂ V₂', note: 'Mass flow rate is conserved along a streamtube.' },
          { label: "Bernoulli's equation", formula: 'p + ½ ρ V² + ρ g z = const', note: 'Along a streamline, for steady, incompressible, frictionless flow.', emphasis: true },
        ],
        workedExample: {
          given: 'Water (ρ = 1000 kg/m³) flows through a horizontal pipe that narrows from A1 = 0.02 m² to A2 = 0.005 m². Upstream velocity V1 = 2 m/s, upstream pressure p1 = 300 kPa (gauge).',
          find: 'The velocity and pressure at the narrow section.',
          steps: [
            'Continuity: V2 = V1 A1/A2 = 2 × (0.02/0.005) = 8 m/s',
            'Bernoulli (horizontal, z1 = z2): p1 + ½ρV1² = p2 + ½ρV2²',
            'p2 = p1 + ½ρ(V1² − V2²) = 300,000 + 0.5(1000)(4 − 64) = 300,000 − 30,000 = 270,000 Pa',
          ],
          answer: 'The water speeds up to 8 m/s through the throat, and its pressure drops from 300 kPa to 270 kPa — the classic Venturi trade-off.',
        },
        challenges: [
          'Water speeds up through a nozzle. According to Bernoulli, what must happen to the pressure — and where does that energy come from?',
          'Does Bernoulli’s equation apply across a pump? What term would you need to add?',
        ],
        applications: [
          'Designing a Venturi flow meter from the pressure-speed trade-off',
          'Explaining aircraft-wing lift from the pressure difference over the airfoil',
          'Sizing dam and tank walls for hydrostatic pressure loading',
        ],
        references: [
          { label: 'OpenStax University Physics Vol. 1 — 14.6 Bernoulli’s Equation', url: 'https://openstax.org/books/university-physics-volume-1/pages/14-6-bernoullis-equation' },
          { label: 'OpenStax University Physics Vol. 1 — 14.1 Fluids, Density, and Pressure', url: 'https://openstax.org/books/university-physics-volume-1/pages/14-1-fluids-density-and-pressure' },
          { label: 'MIT OCW 2.25 — Inviscid Flow and Bernoulli', url: 'https://ocw.mit.edu/courses/2-25-advanced-fluid-mechanics-fall-2013/pages/inviscid-flow-and-bernoulli/' },
        ],
      },
      {
        id: 'pipe-flow-heat-transfer',
        title: 'Pipe Flow Losses & Convective Heat Transfer',
        duration: '17m',
        level: 'Intermediate',
        summary: 'Real pipes fight back with friction, and real surfaces shed heat to whatever fluid flows past them.',
        description:
          'Bernoulli’s equation describes an idealized fluid that never loses energy to friction — real pipes are not so generous. The Reynolds number tells you whether the flow is smooth (laminar) or churning (turbulent), which in turn sets how much pressure you lose to friction and how effectively the fluid carries heat away from a hot surface.',
        status: 'active',
        manimSrc: 'animations/pipe-flow-heat-transfer.mp4',
        realImage: {
          src: 'photos/pipe-flow-heat-transfer.jpg',
          alt: 'Piping and a shell-and-tube heat exchanger circulating chilled water between a heat pump system and a cooling tower',
          credit: 'Ivangiesen',
          creditUrl: 'https://commons.wikimedia.org/wiki/File:Shell_and_Tube_Heat_Exchanger_Piping_1.jpg',
          license: 'CC0',
        },
        learningObjectives: [
          'Compute the Reynolds number and classify a flow as laminar or turbulent',
          'Compute friction head loss along a pipe using the Darcy–Weisbach equation',
          "Apply Newton's law of cooling to find convective heat flux from a surface",
        ],
        formulas: [
          { label: 'Reynolds number', formula: 'Re = ρ V D / μ', note: 'Ratio of inertial to viscous forces; Re ≲ 2300 is laminar in a pipe.' },
          { label: 'Darcy–Weisbach head loss', formula: 'h_f = f (L/D)(V² / 2g)', note: 'Friction loss along a pipe of length L, diameter D.' },
          { label: 'Laminar friction factor', formula: 'f = 64 / Re', note: 'Exact result for fully developed laminar pipe flow.' },
          { label: "Newton's law of cooling", formula: 'q″ = h (T_s − T_∞)', note: 'Convective heat flux from a surface, set by the convection coefficient h.', emphasis: true },
        ],
        workedExample: {
          given: 'Oil (ρ = 900 kg/m³, kinematic viscosity ν = 1×10⁻⁴ m²/s) flows through a pipe D = 0.02 m, length L = 50 m, at V = 0.5 m/s. The pipe surface runs at T_s = 80°C in air at T_∞ = 20°C, with convection coefficient h = 50 W/(m²·K).',
          find: 'Whether the flow is laminar, the friction head loss, and the convective heat flux from the pipe surface.',
          steps: [
            'Re = VD/ν = 0.5(0.02) / 1×10⁻⁴ = 100 — well below 2300, so the flow is laminar.',
            'f = 64/Re = 64/100 = 0.64',
            'h_f = f(L/D)(V²/2g) = 0.64(50/0.02)(0.5²/19.62) ≈ 20.4 m of head',
            'q″ = h(T_s − T_∞) = 50(80 − 20) = 3000 W/m² (3 kW/m²)',
          ],
          answer: 'This laminar oil flow loses about 20.4 m of head over the pipe\'s length, and the hot pipe sheds 3 kW per square meter of surface to the surrounding air.',
        },
        challenges: [
          'Double the flow velocity in a pipe. By roughly what factor does the friction head loss grow if the flow stays turbulent?',
          'Why does blowing on hot soup cool it faster? Which variable in Newton’s law of cooling are you changing?',
        ],
        applications: [
          'Sizing pump head to overcome friction losses in a piping system',
          'Sizing heat-exchanger surface area for a target duty',
          'Designing electronics cooling fins for effective convective heat transfer',
        ],
        references: [
          { label: 'OpenStax University Physics Vol. 1 — 14.7 Viscosity and Turbulence', url: 'https://openstax.org/books/university-physics-volume-1/pages/14-7-viscosity-and-turbulence' },
          { label: 'OpenStax University Physics Vol. 2 — 1.6 Mechanisms of Heat Transfer', url: 'https://openstax.org/books/university-physics-volume-2/pages/1-6-mechanisms-of-heat-transfer' },
        ],
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
        level: 'Beginner',
        summary: 'Simulate a four-bar mechanism and see how link lengths shape its motion.',
        description:
          'Four rigid links, four pin joints, one fixed to the ground — the four-bar linkage is the simplest mechanism that turns rotation into complex, useful motion. Change the link lengths and the whole character of the motion changes: cranks that spin fully, rockers that only oscillate, and points where the mechanism jams.',
        status: 'active',
        manimSrc: 'animations/4bar-linkage.mp4',
        learningObjectives: [
          'Apply the Grashof condition to predict whether a link can fully rotate',
          'Identify crank-rocker, double-crank, and double-rocker mechanisms from link-length ratios',
          'Relate the transmission angle to how efficiently a mechanism transmits force',
        ],
        formulas: [
          { label: 'Grashof condition', formula: 's + l ≤ p + q', latex: 's + l \\leq p + q', note: 's = shortest link, l = longest, p and q = the other two. If true, the shortest link can fully rotate relative to its neighbors.' },
          { label: 'Transmission angle', formula: 'μ = ∠(coupler, rocker)', latex: '\\mu = \\angle(\\text{coupler},\\ \\text{rocker})', note: 'Angle between the coupler and the rocker, measured at the joint connecting them. Force transmits best near μ = 90°.', emphasis: true },
          { label: 'Mechanical advantage', formula: 'MA = τ_out / τ_in = ω_in / ω_out', latex: 'MA = \\frac{\\tau_{out}}{\\tau_{in}} = \\frac{\\omega_{in}}{\\omega_{out}}', note: 'From power balance (T·ω = const, no friction). MA is largest near μ = 90° and collapses toward μ = 0° or 180°.' },
        ],
        workedExample: {
          given: 'A four-bar linkage has link lengths: ground (fixed) = 100 mm, crank (input) = 40 mm, coupler = 80 mm, rocker (output) = 70 mm.',
          find: 'Whether this is a Grashof mechanism, and what type of motion each link performs.',
          steps: [
            'Identify s (shortest) = 40 mm (crank), l (longest) = 100 mm (ground). The other two are p = 80, q = 70.',
            'Grashof condition: s + l ≤ p + q → 40 + 100 = 140 ≤ 80 + 70 = 150 ✓ (Grashof mechanism)',
            'Because the shortest link (the crank) is adjacent to the ground link, this is specifically a crank-rocker: the crank can fully rotate while the rocker only oscillates.',
          ],
          answer: 'This is a Grashof crank-rocker — turn the crank continuously and the rocker sweeps back and forth between two limit positions, never completing a full turn.',
        },
        challenges: [
          'Adjust the link lengths until the Grashof condition fails. What happens to the crank’s ability to fully rotate?',
          'Find the input angle where the transmission angle is worst. What does the mechanism’s motion look like there?',
          'Increase the coupler length only. How does the output rocker’s swing angle change?',
        ],
        applications: [
          'Designing a windshield-wiper mechanism\u2019s sweep',
          'Building a robotic gripper\u2019s jaw linkage',
          'Sizing a folding mechanism for furniture or a vehicle tailgate',
        ],
        references: [
          { label: 'MIT OCW — 2.007 Design and Manufacturing I: Mechanisms lecture', url: 'https://ocw.mit.edu/courses/2-007-design-and-manufacturing-i-spring-2009/pages/lecture-notes/' },
        ],
      },
    ],
  },
]

const SLICE_NEW_COURSES: CourseMeta[] = [...NEW_0, ...NEW_1, ...NEW_2, ...NEW_3, ...NEW_4, ...NEW_5]
const SLICE_EXTRA_TOPICS: { courseId: string; topics: TopicMeta[] }[] = [...EXTRA_0, ...EXTRA_1, ...EXTRA_2, ...EXTRA_3, ...EXTRA_4, ...EXTRA_5]

/** Base courses, with slice topics appended (replacing same-id stubs) and slice courses added. */
export const CURRICULUM: CourseMeta[] = [
  ...BASE_CURRICULUM.map((course) => {
    const extra = SLICE_EXTRA_TOPICS.filter((e) => e.courseId === course.id).flatMap((e) => e.topics)
    if (extra.length === 0) return course
    const base = course.topics.map((t) => extra.find((x) => x.id === t.id) ?? t)
    return { ...course, topics: [...base, ...extra.filter((t) => !course.topics.some((b) => b.id === t.id))] }
  }),
  ...SLICE_NEW_COURSES,
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

const LEVEL_NAMES: TopicLevel[] = ['Beginner', 'Intermediate', 'Advanced']
const LEVEL_ORDER: Record<TopicLevel, number> = { Beginner: 0, Intermediate: 1, Advanced: 2 }

/** Parses a duration string like "15m" into minutes. */
export function durationMinutes(duration: string) {
  const value = Number.parseInt(duration, 10)
  return Number.isNaN(value) ? 0 : value
}

export function courseDurationMinutes(course: CourseMeta) {
  return course.topics.reduce((sum, t) => sum + durationMinutes(t.duration), 0)
}

/** "Beginner" if every topic sits at the same level, otherwise the observed span, e.g. "Beginner–Advanced". */
export function courseLevelSpan(course: CourseMeta): string {
  const levels = course.topics.map((t) => LEVEL_ORDER[t.level])
  const min = Math.min(...levels)
  const max = Math.max(...levels)
  return min === max ? LEVEL_NAMES[min] : `${LEVEL_NAMES[min]}\u2013${LEVEL_NAMES[max]}`
}
