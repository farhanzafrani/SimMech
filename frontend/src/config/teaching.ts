/**
 * Teaching layer: the "senior engineer" content that sits on top of a topic's formulas —
 * intuition, derivation, pitfalls, rules of thumb, curated video, prerequisites and a self-check quiz.
 * Keyed by topic id so it can be rolled out topic by topic without touching curriculum.ts.
 */

export interface VideoRef {
  /** 11-character YouTube video id (verified against the channel, not guessed). */
  id: string
  title: string
  channel: string
  /** Shown as a badge, e.g. "17:37". Optional when not verified. */
  duration?: string
  /** Start playback at this second (e.g. to skip an intro). */
  startSeconds?: number
  /** One line telling the student what to watch for. */
  why: string
}

export interface DerivationStep {
  text: string
  /** KaTeX display equation for the step. */
  latex?: string
}

export interface PrerequisiteRef {
  courseId: string
  topicId: string
  why: string
}

interface QuizBase {
  prompt: string
  /** Shown after answering — explain *why*, not just what. */
  explanation: string
}

export interface ChoiceQuestion extends QuizBase {
  kind: 'choice'
  options: string[]
  /** Index into `options`. */
  correct: number
}

export interface NumericQuestion extends QuizBase {
  kind: 'numeric'
  answer: number
  unit?: string
  /** Relative tolerance, default 0.02 (2 %). */
  tolerance?: number
}

export type QuizQuestion = ChoiceQuestion | NumericQuestion

export interface TeachingContent {
  /** "Feel it first" — a physical picture before any equation. */
  intuition: string
  /** First-principles route to the headline equation. */
  derivation?: DerivationStep[]
  /** What students (and engineers) actually get wrong. */
  commonMistakes: string[]
  /** Practical heuristics and sanity checks. */
  rulesOfThumb: string[]
  /** The order a practising engineer works through this problem. */
  designChecklist?: string[]
  prerequisites?: PrerequisiteRef[]
  videos?: VideoRef[]
  quiz?: QuizQuestion[]
}

const EE = 'The Efficient Engineer'

export const TEACHING: Record<string, TeachingContent> = {
  'bending-stress-beams': {
    intuition:
      'Bend a wooden ruler between your hands. The outer face of the bend stretches, the inner face squashes, and somewhere in between there is a layer that does neither. Strain grows in direct proportion to how far a fibre sits from that layer — and because stress follows strain (Hooke), so does stress. Fibres near the middle are barely working; the fibres at the top and bottom do almost all the carrying. That single picture explains the flexure formula, why a plank is stiff on edge and floppy flat, and why structural beams are I-shaped.',
    derivation: [
      {
        text: 'Assume plane sections stay plane. A beam bent to a radius of curvature ρ stretches each fibre in proportion to its height y above the neutral axis:',
        latex: '\\varepsilon(y) = -\\frac{y}{\\rho}',
      },
      {
        text: 'Within the elastic range, Hooke’s law turns strain into stress, so stress also varies linearly with y:',
        latex: '\\sigma(y) = E\\,\\varepsilon(y) = -\\frac{E\\,y}{\\rho}',
      },
      {
        text: 'A pure bending moment carries no net axial force, so the stresses must integrate to zero. That forces ∫y dA = 0 — the neutral axis passes through the centroid of the cross-section:',
        latex: '\\int_A \\sigma\\, dA = -\\frac{E}{\\rho}\\int_A y\\, dA = 0',
      },
      {
        text: 'The internal moment is the sum of every fibre’s force times its lever arm. The integral ∫y² dA is purely geometric — call it the second moment of area I:',
        latex: 'M = -\\int_A y\\,\\sigma\\, dA = \\frac{E}{\\rho}\\int_A y^2\\, dA = \\frac{E I}{\\rho}',
      },
      {
        text: 'Solve that for curvature, 1/ρ = M/(EI) (the seed of the beam-deflection topic), and substitute back into σ(y) to get the flexure formula. The minus sign only records that a sagging moment compresses the top fibres; the playground quotes magnitudes.',
        latex: '\\sigma(y) = -\\frac{M\\,y}{I}',
      },
      {
        text: 'For a rectangle of width b and depth h the integral is easy, and it shows why depth is cubed:',
        latex: 'I = \\int_{-h/2}^{h/2} y^2\\, b\\, dy = \\frac{b\\,h^3}{12}',
      },
    ],
    commonMistakes: [
      'Cubing the wrong dimension. In I = bh³/12, h is the depth measured parallel to the load (perpendicular to the neutral axis). A 30 mm wide × 60 mm deep beam is 30·60³/12, not 60·30³/12 — a factor of 4 apart.',
      'Mixing units. Moment in N·mm, I in mm⁴ and c in mm gives stress in MPa. Mix m and mm and you are off by 10³ or 10⁶ without any warning.',
      'Assuming the neutral axis is at mid-height. It sits at the centroid, which is off-centre for T, L and channel sections — so the top and bottom fibres see different stresses, and that matters for brittle materials such as cast iron that are far weaker in tension than in compression.',
      'Checking only the section of maximum moment. With a stepped or tapered beam the critical section can be where M and I together give the largest M·c/I.',
      'Using σ = My/I past yield. The linear stress distribution only holds while every fibre is still elastic; beyond that you need the plastic (shape-factor) analysis.',
      'Forgetting the other failure modes. Bending stress is one check. Short deep beams can be governed by shear, and slender open sections can twist sideways (lateral-torsional buckling) well before σ_max reaches yield.',
    ],
    rulesOfThumb: [
      'Go deeper, not wider. At a fixed width, doubling the depth gives 8× the stiffness (I ∝ h³) and 4× the strength (section modulus S = I/c ∝ h²).',
      'Size with the section modulus: compute S_required = M_max / σ_allowable, then pick any section whose S is at least that. It is a one-line design check.',
      'Material near the neutral axis is nearly idle. An I-section moves its area out to the flanges, giving far more I per kilogram than a solid rectangle of the same area — which is why it is the default structural shape.',
      'Sanity check: stress is zero at the neutral axis and maximum at the outer fibre, and it must change sign across the axis. If your numbers do not show that, a sign or a distance is wrong.',
    ],
    designChecklist: [
      'Draw the shear-force and bending-moment diagrams and locate M_max.',
      'Choose the cross-section and find its centroid (that is the neutral axis).',
      'Compute I about the axis the beam actually bends about.',
      'Evaluate σ = Mc/I at the extreme fibres — top and bottom separately for an asymmetric section.',
      'Compare with the allowable stress (yield ÷ factor of safety; use tension and compression limits separately for brittle material).',
      'Then check deflection, shear and lateral-torsional buckling — passing bending stress alone is not passing the design.',
    ],
    prerequisites: [
      { courseId: 'mechanics-of-materials', topicId: 'shear-bending-diagrams', why: 'The moment M in σ = My/I comes from the bending-moment diagram.' },
      { courseId: 'mechanics-of-materials', topicId: 'stress-strain', why: 'The derivation leans on Hooke’s law, σ = Eε.' },
    ],
    videos: [
      {
        id: 'f08Y39UiC-o',
        title: 'Understanding Stresses in Beams',
        channel: EE,
        duration: '17:37',
        why: 'Derives the bending (and shear) stress distribution and shows why I-beams make better use of material. Watch it after the derivation above.',
      },
      {
        id: 'Bls5KnQOWkY',
        title: 'Understanding the Area Moment of Inertia',
        channel: EE,
        why: 'Builds the I = ∫y² dA idea visually — the quantity this whole topic hinges on.',
      },
      {
        id: 'C-FEVzI8oe8',
        title: 'Understanding Shear Force and Bending Moment Diagrams',
        channel: EE,
        why: 'Revision of where the M in the flexure formula comes from.',
      },
    ],
    quiz: [
      {
        kind: 'choice',
        prompt: 'A 50 mm × 100 mm rectangular beam is first loaded with the 100 mm side vertical, then turned on its side (50 mm vertical). By what factor is the tall orientation stiffer in bending?',
        options: ['2×', '4×', '8×', '16×'],
        correct: 1,
        explanation: 'I = bh³/12. Tall: 50·100³/12 ≈ 4.17×10⁶ mm⁴. Flat: 100·50³/12 ≈ 1.04×10⁶ mm⁴. The ratio is (100/50)² = 4 — the area is identical, only the arrangement changed.',
      },
      {
        kind: 'numeric',
        prompt: 'A solid rectangular beam, b = 50 mm wide and h = 100 mm deep, carries a bending moment M = 5 kN·m. What is the maximum bending stress?',
        answer: 60,
        unit: 'MPa',
        explanation: 'I = 50·100³/12 = 4.167×10⁶ mm⁴ and c = 50 mm. σ_max = Mc/I = (5×10⁶ N·mm)(50 mm)/(4.167×10⁶ mm⁴) = 60 MPa.',
      },
      {
        kind: 'choice',
        prompt: 'What is the bending stress exactly at the neutral axis?',
        options: ['The maximum value', 'Half the maximum value', 'Zero', 'It depends on the modulus E'],
        correct: 2,
        explanation: 'σ = My/I and y = 0 at the neutral axis, so the bending stress is zero there. (The transverse shear stress is usually at its largest on that same axis — a different stress, easily confused with this one.)',
      },
      {
        kind: 'choice',
        prompt: 'Why are structural beams I-shaped rather than solid rectangles?',
        options: [
          'The web fibres near the neutral axis carry little bending stress, so moving the material into the flanges gives much more I for the same weight',
          'An I-section has a lower peak stress at the neutral axis',
          'It is simply cheaper to roll than a rectangle',
          'The flanges stop the beam from ever yielding',
        ],
        correct: 0,
        explanation: 'Bending stress grows with distance from the neutral axis, so material close to it is under-used. Put the area where the stress is — the flanges — and I rises sharply for the same mass.',
      },
      {
        kind: 'choice',
        prompt: 'A student finds I for a beam 30 mm wide and 60 mm deep, bending about the horizontal axis, as I = 60·30³/12. What went wrong?',
        options: [
          'Nothing — that is the correct formula',
          'The 12 should be 36',
          'The dimensions are swapped: it should be 30·60³/12, with the depth cubed',
          'I should use the diagonal of the section',
        ],
        correct: 2,
        explanation: 'The cubed dimension is the one measured perpendicular to the neutral axis — the depth. The student’s answer is 4× too small, so the beam would look 4× weaker than it is.',
      },
      {
        kind: 'numeric',
        prompt: 'The moment stays the same but you double the depth of a rectangular beam (same width). The maximum bending stress becomes what multiple of the original?',
        answer: 0.25,
        explanation: 'σ_max = Mc/I = 6M/(bh²). Doubling h makes the denominator 4× larger, so the stress falls to one quarter (0.25×).',
      },
    ],
  },

  'combined-loading-mohrs-circle': {
    intuition:
      'The stress "at a point" is not a single number — it depends on which plane you imagine slicing through that point. Draw a tiny square on a stressed part and rotate it: the normal stress on its faces rises and falls, and shear appears and disappears. Mohr’s circle is the bookkeeping device that collects every one of those answers onto a single circle. Rotating the element by θ in the part moves you by 2θ around the circle, and the two places where the circle crosses the horizontal axis are the planes with no shear at all — the principal planes, where the normal stress is as large and as small as it will ever be.',
    derivation: [
      {
        text: 'Cut a small wedge from the stressed element so that its inclined face has a normal at angle θ from the x-axis. Force balance along and across that face gives the stresses on any plane:',
        latex: '\\sigma_\\theta = \\frac{\\sigma_x+\\sigma_y}{2} + \\frac{\\sigma_x-\\sigma_y}{2}\\cos 2\\theta + \\tau_{xy}\\sin 2\\theta',
      },
      {
        text: 'The matching shear stress on that plane:',
        latex: '\\tau_\\theta = -\\frac{\\sigma_x-\\sigma_y}{2}\\sin 2\\theta + \\tau_{xy}\\cos 2\\theta',
      },
      {
        text: 'Move the average stress to the left (σ_avg = (σ_x+σ_y)/2), then square both equations and add. The cross terms cancel because cos² + sin² = 1:',
        latex: '(\\sigma_\\theta-\\sigma_{avg})^2 + \\tau_\\theta^2 = \\left(\\frac{\\sigma_x-\\sigma_y}{2}\\right)^2 + \\tau_{xy}^2 = R^2',
      },
      {
        text: 'That is the equation of a circle: centre (σ_avg, 0), radius R, and the angle runs as 2θ — which is why the circle uses twice the physical angle.',
      },
      {
        text: 'Principal planes are where the shear vanishes. Set τ_θ = 0 and solve:',
        latex: '\\tan 2\\theta_p = \\frac{2\\tau_{xy}}{\\sigma_x-\\sigma_y}',
      },
      {
        text: 'At those planes the normal stresses are σ₁,₂ = σ_avg ± R. The largest in-plane shear is the circle’s radius, R, and it acts on planes 45° (90° on the circle) away from the principal planes — with a normal stress of σ_avg on them.',
        latex: '\\sigma_{1,2} = \\sigma_{avg} \\pm R, \\qquad \\tau_{max,\\,in\\text{-}plane} = R',
      },
    ],
    commonMistakes: [
      'Treating R as the largest shear stress in the part. R is only the maximum in-plane shear. In plane stress the third principal stress is zero, so the absolute maximum shear is max(|σ₁−σ₂|, |σ₁|, |σ₂|)/2. For the worked example (σ₁ = 88.3, σ₂ = 31.7 MPa) R = 28.3 MPa, but the absolute maximum is 88.3/2 = 44.2 MPa — and that is the number a Tresca check needs.',
      'Forgetting the angle doubles. The circle angle is 2θ; the plane in the part is θ. Quote the circle angle as the physical angle and you are off by a factor of two.',
      'Losing the sign convention. Pick one for shear (e.g. clockwise-positive plotted downward) and keep it. The centre, the radius and the principal stresses do not depend on it, but the direction you rotate to reach σ₁ does.',
      'Plotting the wrong points. The stress state on the x-face is (σ_x, τ_xy); the y-face is (σ_y, −τ_xy) in the usual convention. They are always at opposite ends of a diameter — if yours are not, the circle is wrong.',
      'Dropping signs on compressive stresses. Compression is negative. A circle that straddles the vertical axis means the part sees tension and compression at once.',
      'Stopping at the principal stresses. They tell you the stress state, not whether the part survives. You still need a failure criterion (Tresca, von Mises) to turn σ₁, σ₂ into a factor of safety.',
    ],
    rulesOfThumb: [
      'Pure shear τ gives principal stresses of +τ and −τ at 45°. That is why a brittle shaft such as a piece of chalk, twisted, cracks along a 45° spiral — it is failing in tension on the principal plane.',
      'Uniaxial tension σ gives a maximum shear of σ/2 at 45°. That is why ductile metals yield by slipping along planes near 45° to the load.',
      'Quick arithmetic check: σ_x + σ_y = σ₁ + σ₂ (the sum is invariant under rotation). For the worked example, 80 + 40 = 120 = 88.3 + 31.7. If it does not balance, you have made an error.',
      'A principal stress can exceed both applied normal stresses (88.3 MPa from 80 and 40 MPa in the example) — shear always pushes the extremes further apart.',
    ],
    designChecklist: [
      'Establish σ_x, σ_y and τ_xy at the critical point (superpose axial, bending, torsion and pressure contributions) and fix a sign convention.',
      'Plot X (σ_x, τ_xy) and Y (σ_y, −τ_xy); join them with a diameter.',
      'Compute the centre σ_avg and the radius R.',
      'Read σ₁ = σ_avg + R and σ₂ = σ_avg − R; remember σ₃ = 0 for plane stress.',
      'Find the absolute maximum shear using all three principal stresses.',
      'Note the principal-plane angle 2θ_p (needed for strain-gauge placement and crack direction).',
      'Pass σ₁, σ₂, σ₃ to the failure criterion to get a factor of safety.',
    ],
    prerequisites: [
      { courseId: 'mechanics-of-materials', topicId: 'stress-strain', why: 'Defines normal stress, shear stress and sign conventions.' },
      { courseId: 'mechanics-of-materials', topicId: 'bending-stress-beams', why: 'Gives the normal stress that feeds into σ_x at a point on a beam.' },
      { courseId: 'mechanics-of-materials', topicId: 'torsion', why: 'Gives the shear stress τ_xy at a point on a shaft.' },
    ],
    videos: [
      {
        id: '_DH3546mSCM',
        title: 'Understanding Stress Transformation and Mohr’s Circle',
        channel: EE,
        why: 'Shows how rotating the axes changes the stress components and builds the circle from that — watch it alongside the derivation.',
      },
      {
        id: '78K0pbvHzjM',
        title: 'Understanding Plane Stress',
        channel: EE,
        why: 'The plane-stress assumption behind the two-dimensional element used here.',
      },
      {
        id: 'xkbQnBAOFEg',
        title: 'Understanding Failure Theories (Tresca, von Mises etc...)',
        channel: EE,
        why: 'The natural next step: what to do with σ₁ and σ₂ once you have them.',
      },
    ],
    quiz: [
      {
        kind: 'numeric',
        prompt: 'A point has σ_x = 100 MPa, σ_y = 20 MPa and τ_xy = 30 MPa. What is the larger principal stress σ₁?',
        answer: 110,
        unit: 'MPa',
        explanation: 'σ_avg = (100+20)/2 = 60. R = √[((100−20)/2)² + 30²] = √(40²+30²) = 50. σ₁ = 60 + 50 = 110 MPa.',
      },
      {
        kind: 'numeric',
        prompt: 'For the same point (σ_x = 100, σ_y = 20, τ_xy = 30 MPa), what is the maximum in-plane shear stress?',
        answer: 50,
        unit: 'MPa',
        explanation: 'The maximum in-plane shear is the radius of the circle, R = √(40²+30²) = 50 MPa.',
      },
      {
        kind: 'choice',
        prompt: 'A shaft element is in pure shear, τ = 40 MPa, with no normal stress. What are its principal stresses?',
        options: ['40 and 0 MPa', '+40 and −40 MPa', '80 and 0 MPa', '40 and 40 MPa'],
        correct: 1,
        explanation: 'The circle is centred on the origin (σ_avg = 0) with radius R = 40, so it crosses the axis at +40 and −40 MPa, on planes at 45° to the shear faces.',
      },
      {
        kind: 'choice',
        prompt: 'A plane-stress analysis gives σ₁ = 88 MPa and σ₂ = 32 MPa. A student reports the maximum shear stress as (88−32)/2 = 28 MPa. What is missing?',
        options: [
          'Nothing — that is the maximum shear',
          'The third principal stress σ₃ = 0 also forms a Mohr’s circle with σ₁, giving (88−0)/2 = 44 MPa, which is larger',
          'The shear should be doubled to 56 MPa',
          'The shear should be taken from σ₂ alone, 16 MPa',
        ],
        correct: 1,
        explanation: 'Plane stress is a 3-D state with σ₃ = 0. The three circles are (σ₁,σ₂), (σ₂,σ₃) and (σ₁,σ₃); the biggest is the one spanning 88 and 0. Because σ₁ and σ₂ have the same sign, the absolute maximum shear (44 MPa) exceeds the in-plane one (28 MPa).',
      },
      {
        kind: 'numeric',
        prompt: 'At a point σ_x = 70 MPa and σ_y = 30 MPa, and you are told the larger principal stress is σ₁ = 90 MPa. Using the fact that σ_x + σ_y = σ₁ + σ₂, what is σ₂?',
        answer: 10,
        unit: 'MPa',
        explanation: 'The sum of the normal stresses is invariant under rotation: 70 + 30 = 100 = 90 + σ₂, so σ₂ = 10 MPa. (Consistent: R = 40, so τ_xy = √(40²−20²) ≈ 34.6 MPa.)',
      },
      {
        kind: 'choice',
        prompt: 'The element in the part is rotated by 30°. By how much do you move round Mohr’s circle?',
        options: ['15°', '30°', '60°', '90°'],
        correct: 2,
        explanation: 'Angles on the circle are twice the physical angles: 2 × 30° = 60°.',
      },
    ],
  },

  'fatigue-analysis': {
    intuition:
      'Bend a paper clip back and forth: no single bend is hard, yet after a few dozen it snaps. Metals do the same thing at a microscopic scale. Each load cycle pushes a tiny crack — usually starting at a scratch, a sharp corner or a pit on the surface — forward a minute amount. Nothing visible happens for most of the life, then the remaining section can no longer carry the load and the part breaks suddenly, often at a stress far below yield. Fatigue is the failure mode behind most broken shafts, springs and bolts, which is why it gets its own analysis.',
    derivation: [
      {
        text: 'Describe the load cycle by its swing and its offset: the stress amplitude is half the range and the mean is the midpoint.',
        latex: '\\sigma_a = \\frac{\\sigma_{max}-\\sigma_{min}}{2}, \\qquad \\sigma_m = \\frac{\\sigma_{max}+\\sigma_{min}}{2}',
      },
      {
        text: 'A fully reversed test (σ_m = 0) gives the S-N curve. Below the endurance limit S_e the part survives an effectively unlimited number of cycles — the point (σ_m, σ_a) = (0, S_e) on a plot of amplitude against mean stress.',
      },
      {
        text: 'With no alternating stress at all (σ_a = 0) the part simply fails statically when the mean reaches the ultimate strength — the point (S_ut, 0).',
      },
      {
        text: 'The modified Goodman line is the straight line joining those two points. Anything inside it is predicted to last indefinitely:',
        latex: '\\frac{\\sigma_a}{S_e} + \\frac{\\sigma_m}{S_{ut}} = 1',
      },
      {
        text: 'For a real load the stresses are σ_a and σ_m. Scaling both by the same factor n until the load point touches the line gives the factor of safety against fatigue:',
        latex: '\\frac{\\sigma_a}{S_e} + \\frac{\\sigma_m}{S_{ut}} = \\frac{1}{n}',
      },
      {
        text: 'Goodman only covers fatigue. Always add the first-cycle yield check as well (the Langer line):',
        latex: '\\sigma_a + \\sigma_m \\le \\frac{S_y}{n}',
      },
    ],
    commonMistakes: [
      'Using the lab endurance limit directly. S_e′ ≈ 0.5·S_ut is for a small, polished, bending specimen at room temperature. The real S_e = k_a·k_b·k_c·k_d·k_e·S_e′ (surface finish, size, load type, temperature, reliability) is often much lower — a machined or as-forged surface can cost a large fraction of the strength.',
      'Confusing amplitude with range. σ_a is half of σ_max − σ_min. Using the full range overestimates the damage by 2× and quietly wrecks the factor of safety.',
      'Using the geometric stress concentration K_t where the fatigue notch factor K_f belongs. K_f = 1 + q(K_t − 1) accounts for notch sensitivity; use it on the alternating stress and follow your design code for the mean stress.',
      'Extending the Goodman line to compressive mean stress. A compressive mean does not hurt the way the straight line would suggest — standard practice is to cap the check at σ_a ≤ S_e for σ_m < 0, not to read the line backwards.',
      'Assuming every metal has an endurance limit. Steels and titanium show a knee near 10⁶–10⁷ cycles; aluminium and most non-ferrous alloys do not, so their fatigue strength is quoted at a stated life (commonly 5×10⁸ cycles). Corrosion also removes the knee from steel.',
      'Trusting Goodman alone. It never checks yielding on the first cycle, so a part can pass fatigue and still deform permanently. Run the Langer (yield) check too.',
    ],
    rulesOfThumb: [
      'For steels with S_ut up to about 1400 MPa, S_e′ ≈ 0.5·S_ut, and the S-N curve flattens at roughly 10⁶ cycles.',
      'Life is extremely sensitive to stress. With a typical Basquin exponent b ≈ −0.09, a 10 % rise in stress amplitude cuts finite life by roughly two thirds.',
      'The surface is where fatigue is won or lost: polish it, avoid scratches and sharp corners, use generous fillet radii, and consider shot peening or cold-rolled fillets, which build in compressive residual stress.',
      'Never put a keyway, cross-hole or sharp shoulder where the alternating stress is highest. Move the feature, or soften it.',
      'Fatigue cracks leave beach marks on the fracture face. The crack origin is the point the marks radiate from — read it, and you usually learn what caused the failure.',
    ],
    designChecklist: [
      'Establish the load history and extract σ_max and σ_min at the critical location, then σ_a and σ_m.',
      'Estimate the corrected endurance limit: S_e′ from S_ut, then apply the Marin factors.',
      'Apply the fatigue notch factor K_f at every stress raiser.',
      'Compute the Goodman factor of safety n for infinite life.',
      'Check first-cycle yielding with the Langer line.',
      'If the amplitude varies, count cycles (rainflow) and sum damage with Miner’s rule for finite life.',
      'Decide inspection intervals or damage-tolerance limits where failure would be unsafe.',
    ],
    prerequisites: [
      { courseId: 'mechanics-of-materials', topicId: 'stress-strain', why: 'Defines S_ut, S_y and the stress levels the S-N curve is built on.' },
      { courseId: 'machine-design', topicId: 'failure-theories', why: 'Static failure criteria are what the Goodman line reduces to when σ_a = 0.' },
    ],
    videos: [
      {
        id: 'o-6V_JoRX1g',
        title: 'Understanding Fatigue Failure and S-N Curves',
        channel: EE,
        duration: '10:49',
        why: 'How fatigue cracks form and grow, how to read an S-N curve, the effect of tensile mean stress, and an introduction to rainflow counting and Miner’s rule.',
      },
      {
        id: 'xkbQnBAOFEg',
        title: 'Understanding Failure Theories (Tresca, von Mises etc...)',
        channel: EE,
        why: 'Static failure criteria — the other half of a complete strength check.',
      },
    ],
    quiz: [
      {
        kind: 'numeric',
        prompt: 'A load cycles between σ_max = 200 MPa and σ_min = −40 MPa. What is the stress amplitude σ_a?',
        answer: 120,
        unit: 'MPa',
        explanation: 'σ_a = (σ_max − σ_min)/2 = (200 − (−40))/2 = 120 MPa. Note that the sign of σ_min matters.',
      },
      {
        kind: 'numeric',
        prompt: 'For the same cycle (200 MPa to −40 MPa), what is the mean stress σ_m?',
        answer: 80,
        unit: 'MPa',
        explanation: 'σ_m = (σ_max + σ_min)/2 = (200 + (−40))/2 = 80 MPa.',
      },
      {
        kind: 'numeric',
        prompt: 'A part has S_ut = 800 MPa and a corrected endurance limit S_e = 300 MPa. It runs at σ_a = 100 MPa and σ_m = 200 MPa. What is the Goodman factor of safety n?',
        answer: 1.714,
        explanation: '1/n = σ_a/S_e + σ_m/S_ut = 100/300 + 200/800 = 0.3333 + 0.25 = 0.5833, so n = 1/0.5833 ≈ 1.71.',
      },
      {
        kind: 'choice',
        prompt: 'The stress amplitude stays the same but the mean tensile stress is increased. What happens to the predicted fatigue life?',
        options: ['It increases', 'It is unchanged', 'It decreases', 'It depends only on the material’s modulus'],
        correct: 2,
        explanation: 'A tensile mean stress holds cracks open and shortens life — on the Goodman diagram the load point moves toward the failure line. This is why a pre-loaded bolt needs a mean-stress check even though its swing is small.',
      },
      {
        kind: 'choice',
        prompt: 'Which statement about aluminium alloys is correct?',
        options: [
          'They have the same endurance limit as steel, about 0.5·S_ut',
          'They have no true endurance limit; fatigue strength is quoted at a stated number of cycles',
          'They never fail in fatigue',
          'Their S-N curve is horizontal beyond 10³ cycles',
        ],
        correct: 1,
        explanation: 'Most non-ferrous alloys keep losing strength as cycles accumulate, so a fatigue strength at a chosen life (often 5×10⁸ cycles) is used instead of an endurance limit.',
      },
      {
        kind: 'choice',
        prompt: 'A student calculates the amplitude of a 20 → 100 MPa cycle as 100 − 20 = 80 MPa. What went wrong?',
        options: [
          'They should have added the two stresses',
          'They used the range; the amplitude is half of it, 40 MPa',
          'They should have used σ_max alone, 100 MPa',
          'Nothing — amplitude and range are the same thing',
        ],
        correct: 1,
        explanation: 'The range is σ_max − σ_min = 80 MPa; the amplitude is half the range, 40 MPa (the mean is 60 MPa). Using the range doubles the amplitude and understates the factor of safety.',
      },
      {
        kind: 'choice',
        prompt: 'Why do most fatigue cracks start at the surface of a part?',
        options: [
          'Surfaces are always made of weaker material',
          'Bending and torsion stresses are highest at the surface, and scratches, machining marks and corrosion pits act as stress raisers there',
          'Cracks cannot form inside a metal',
          'The surface is the only region that sees any cyclic load',
        ],
        correct: 1,
        explanation: 'Two effects stack: the stress is greatest at the outer fibre in bending and torsion, and surface defects raise it further locally. That is also why surface finish, peening and fillet radii have such an outsized effect on life.',
      },
    ],
  },
}

export function getTeaching(topicId: string): TeachingContent | undefined {
  return TEACHING[topicId]
}
