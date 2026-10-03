import type { TeachingContent } from '../teachingTypes'
import { EE } from '../teachingTypes'

/** Mechanics of Materials (2.001) teaching content. */
export const CONTENT: Record<string, TeachingContent> = {
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

  'stress-strain': {
    intuition:
      'Hang a weight from a steel wire and it stretches by a hair; take the weight off and it springs back exactly. That is elasticity: the atoms are being pulled slightly apart against their bonds, like millions of tiny springs, and they snap back when released. Pull harder and eventually planes of atoms start to slide over one another. That slip does not undo itself, so the wire is now permanently longer: yield. Keep going and the wire thins in one spot (necking) and finally breaks. Dividing force by area (stress) and stretch by original length (strain) removes the size of the specimen from the story, so one tensile test on a small bar tells you how every part made of that material will behave: how stiff it is (the slope), how strong it is (the peak), and how much warning it gives before failing (how far the curve runs).',
    derivation: [
      {
        text: 'Define the two size-independent measures. Normal stress is force spread over the cross-section; engineering strain is the stretch as a fraction of the original length:',
        latex: '\\sigma = \\frac{F}{A_0}, \\qquad \\varepsilon = \\frac{\\Delta L}{L_0}',
      },
      {
        text: 'Experiment shows that for small loads in most metals the plot of σ against ε is a straight line that passes through the origin and unloads along itself. Hooke’s law names its slope the Young’s modulus:',
        latex: '\\sigma = E\\,\\varepsilon',
      },
      {
        text: 'Substitute the definitions into Hooke’s law and solve for the stretch. This is the working formula for a bar, and it is a spring law, F = kδ, with stiffness k = AE/L:',
        latex: '\\frac{F}{A} = E\\,\\frac{\\delta}{L} \\;\\Rightarrow\\; \\delta = \\frac{F L}{A E}',
      },
      {
        text: 'A bar that gets longer also gets thinner. The ratio of lateral to axial strain is a material constant, Poisson’s ratio (about 0.3 for many metals), so the sideways strain is:',
        latex: '\\varepsilon_{lateral} = -\\nu\\,\\varepsilon_{axial}',
      },
      {
        text: 'Beyond yield, "engineering" stress uses the original area A₀, which is no longer the real area. If plastic flow conserves volume (A·L constant), the true stress and true strain follow from the engineering values:',
        latex: '\\sigma_{true} = \\sigma(1+\\varepsilon), \\qquad \\varepsilon_{true} = \\ln(1+\\varepsilon)',
      },
      {
        text: 'The first relation is valid only up to the onset of necking, after which the strain is no longer uniform along the gauge length. It is why the engineering curve falls after the peak while the true stress keeps rising.',
      },
    ],
    commonMistakes: [
      'Confusing stiffness with strength. E measures how much a part stretches per unit stress, whereas yield and ultimate strength measure how much stress it survives. Almost all steels share E ≈ 200 GPa whether their yield is 250 MPa or 1500 MPa, so switching to a stronger steel does nothing to reduce elastic stretch or sag.',
      'Unit slips between N, mm² and m². With F in N and A in mm², σ comes out directly in MPa. If A is in m² you get Pa, and a factor of 10⁶ error with no warning. Strain is dimensionless, so ε = 0.001 is 0.1 %, not 1 %.',
      'Applying σ = Eε after yield. Hooke’s law is only the straight part of the curve. Once yielded, a measured strain tells you nothing about stress through E; and unloading follows a line parallel to the original elastic line, so part of the strain stays as permanent set.',
      'Treating the 0.2 % offset yield as a sharp physical limit. Aluminium and most high-strength steels have no distinct yield point, so yield is defined by convention as the stress that leaves 0.002 permanent strain. It is a useful agreed number rather than a cliff in the material.',
      'Reading the falling right-hand end of an engineering curve as the material "getting weaker". The material is still hardening; the engineering stress is simply computed with the original area while the neck has made the real area smaller.',
      'Forgetting the data are for one condition. A mill-test curve is a particular temperature and loading rate, in tension. Hot parts, impact loads, and compression of materials like cast iron (much stronger in compression than tension) can behave differently.',
    ],
    rulesOfThumb: [
      'Typical elastic moduli: steel roughly 200 GPa, aluminium alloys roughly 70 GPa, titanium roughly 110 GPa. So at the same stress aluminium stretches about three times as much as steel.',
      'Elastic strains in structures are small. 200 MPa in steel is a strain of about 0.001, so a 1 m member lengthens about 1 mm. If your answer says several percent while the stress is below yield, a unit is wrong.',
      'Ductile materials usually announce failure (large permanent strain, necking); brittle ones such as cast iron, glass and ceramics do not, so they usually carry larger safety factors.',
      'Poisson’s ratio for metals is typically around 0.3 and cannot exceed 0.5 for an isotropic material (0.5 means no volume change, close to rubber).',
    ],
    designChecklist: [
      'State the load path and find the force F carried by the member (from free-body diagrams).',
      'Compute σ = F/A on the smallest cross-section, including holes, threads and fillets (and note stress concentrations).',
      'Pick the material property that matches the failure you care about: yield for permanent deformation, ultimate for fracture.',
      'Divide by a factor of safety to get the allowable stress and compare.',
      'Check the stiffness requirement separately: δ = FL/(AE) against the allowed stretch.',
      'Confirm the load type: static tension is the easy case; repeated loading needs fatigue, and impact needs toughness.',
    ],
    prerequisites: [
      { courseId: 'engineering-statics', topicId: 'statics-equilibrium', why: 'The force F in σ = F/A comes from a free-body diagram and equilibrium.' },
    ],
    videos: [
      { id: 'aQf6Q8t1FQE', title: 'An Introduction to Stress and Strain', channel: EE, why: 'A good starting point for the definitions of stress and strain used in this topic.' },
      { id: 'DLE-ieOVFjI', title: 'Understanding Young\'s Modulus', channel: EE, why: 'Companion to the slope-of-the-curve idea, E = σ/ε.' },
      { id: 'tuOlM3P7ygA', title: 'Understanding Poisson\'s Ratio', channel: EE, why: 'Covers the sideways-thinning effect that goes with axial stretch.' },
      { id: 'AkX6JqlWRqc', title: 'Understanding True Stress and True Strain', channel: EE, why: 'Relevant when you read the curve beyond the peak, where engineering values stop being the real stress.' },
    ],
    quiz: [
      {
        kind: 'numeric',
        prompt: 'An aluminium rod of diameter 10 mm carries a tensile force of 15 kN. What is the normal stress in the rod?',
        answer: 190.99,
        unit: 'MPa',
        explanation: 'A = π d²/4 = π(10)²/4 = 78.54 mm². σ = F/A = 15 000 N / 78.54 mm² = 191.0 MPa. With N and mm² the result is directly in MPa.',
      },
      {
        kind: 'numeric',
        prompt: 'A steel rod (E = 200 GPa) 2 m long carries a uniform tensile stress of 150 MPa, well below yield. How much does it lengthen?',
        answer: 1.5,
        unit: 'mm',
        explanation: 'ε = σ/E = 150/200 000 = 7.5×10⁻⁴. ΔL = ε·L₀ = 7.5×10⁻⁴ × 2000 mm = 1.5 mm. The area and force do not matter once you know σ.',
      },
      {
        kind: 'choice',
        prompt: 'A student says: "Steel B has a yield strength of 700 MPa and Steel A only 250 MPa, so a beam made from B will deflect less under the same load." What is wrong?',
        options: [
          'Nothing, because a stronger steel is also stiffer',
          'Deflection depends on E, which is about the same (≈ 200 GPa) for both steels; yield strength only says when permanent deformation begins',
          'Deflection depends only on the density of the steel',
          'Steel B will deflect more, because stronger steel is more brittle',
        ],
        correct: 1,
        explanation: 'Strength and stiffness are different properties. The slope of the elastic line (E) is set by atomic bonding and is nearly identical for all carbon and alloy steels, so elastic deflection is essentially the same. To reduce sag you need larger I or A, a shorter span, or a different material.',
      },
      {
        kind: 'numeric',
        prompt: 'A steel specimen (E = 200 GPa) is loaded to a stress of 300 MPa, past yield, where the total strain is 0.005. It is then unloaded completely along a line parallel to the elastic slope. What permanent strain remains?',
        answer: 0.0035,
        explanation: 'On unloading, only the elastic part recovers: ε_elastic = σ/E = 300/200 000 = 0.0015. Permanent strain = 0.005 − 0.0015 = 0.0035 (0.35 %).',
        tolerance: 0.02,
      },
      {
        kind: 'choice',
        prompt: 'An axial strain of +0.001 is measured in a steel bar with ν = 0.3. What is the lateral strain?',
        options: ['+0.0003', '−0.0003', '−0.003', '0'],
        correct: 1,
        explanation: 'ε_lateral = −ν ε_axial = −0.3 × 0.001 = −0.0003. The minus sign records that the bar gets thinner as it stretches.',
      },
      {
        kind: 'numeric',
        prompt: 'In a tensile test a ductile specimen shows an engineering stress of 400 MPa at an engineering strain of 0.10 (before necking). Assuming constant volume, what is the true stress?',
        answer: 440,
        unit: 'MPa',
        explanation: 'Constant volume means A = A₀/(1+ε), so σ_true = F/A = σ(1+ε) = 400 × 1.10 = 440 MPa. True stress is higher than engineering stress in tension because the area has shrunk.',
      },
    ],
  },

  torsion: {
    intuition:
      'Grip a long rubber eraser in a hand at each end and twist. The surface line you drew along it spirals, the centre stays on the axis, and the farther from the centre a bit of material is, the more it is dragged sideways relative to the section next to it. Shear strain grows with radius, so shear stress grows with radius too: zero at the centre, largest on the skin. That means the core of a solid shaft is lightly loaded and the outer layer does most of the work, which is why hollow tubes carry torque so efficiently for their weight. And because the twist builds up along the length, a shaft has two separate things to satisfy: it must not overstress its surface, and it must not twist more than the machine can tolerate.',
    derivation: [
      {
        text: 'Geometry. Twist a circular shaft of length L through an angle φ at the free end. A line on the surface at radius r moves sideways by rφ over a length L, and since plane sections stay plane (true for circular sections), the shear strain at radius r is:',
        latex: '\\gamma(r) = \\frac{r\\,\\phi}{L}',
      },
      {
        text: 'Material law. In the elastic range shear stress is proportional to shear strain, with the shear modulus G as the constant, so the stress also grows linearly with r:',
        latex: '\\tau(r) = G\\,\\gamma = \\frac{G\\,\\phi}{L}\\, r',
      },
      {
        text: 'Equilibrium. The internal torque is the sum of every small force τ dA times its lever arm r over the whole cross-section:',
        latex: 'T = \\int_A r\\,\\tau\\, dA = \\frac{G\\phi}{L}\\int_A r^2\\, dA = \\frac{G\\phi}{L}\\, J',
      },
      {
        text: 'The integral ∫r² dA is purely geometric, called the polar second moment of area J. For a solid circle of diameter d (integrate rings of area 2πr dr):',
        latex: 'J = \\int_0^{d/2} r^2\\,2\\pi r\\, dr = \\frac{\\pi d^4}{32}',
      },
      {
        text: 'Solve the torque equation for φ/L and substitute into the stress equation. This gives the angle of twist and the shear stress at any radius:',
        latex: '\\phi = \\frac{T L}{G J}, \\qquad \\tau(r) = \\frac{T\\, r}{J}',
      },
      {
        text: 'The maximum occurs on the surface, r = d/2, which gives the working formula for a solid shaft:',
        latex: '\\tau_{max} = \\frac{T\\,(d/2)}{\\pi d^4/32} = \\frac{16\\,T}{\\pi d^3}',
      },
    ],
    commonMistakes: [
      'Using J = πd⁴/64. That is I for bending of a circle. For torsion it is J = πd⁴/32, twice as large; mixing them gives a factor of 2 error in both stress and twist.',
      'Using the formulas for non-circular sections. Everything above assumes that plane sections stay plane, which is true only for circular (solid or hollow) shafts. A square or open thin-walled section warps and is much weaker and more flexible than the circular formula suggests.',
      'Mixing up shear modulus G with Young’s modulus E. Twist uses G (for steel roughly 80 GPa, about 0.4 E). Using E underestimates the twist by about 2.5×.',
      'Getting torque wrong from power. T = P/ω with ω in rad/s. A motor of 15 kW at 1500 rpm gives about 95 N·m, not 15 000/1500 = 10 N·m; the factor 2π/60 is easy to forget.',
      'Checking stress only. A long drive shaft can be nowhere near yield yet twist so much that timing, alignment or control accuracy is lost. Many designs are limited by an angle-of-twist budget (the acceptable twist depends entirely on the application and is far tighter for precision machinery).',
      'Forgetting stress concentrations. Keyways, shoulders and splines raise local stress several-fold, and rotating shafts then fail by fatigue long before static yield.',
    ],
    rulesOfThumb: [
      'Stress scales as 1/d³ and twist as 1/d⁴. Doubling the diameter cuts surface stress to 1/8 and the twist to 1/16.',
      'For the same outer diameter a hollow tube carries nearly as much torque as a solid shaft but with far less material, because the core is barely stressed. E.g. a tube with inner diameter 0.6 times outer carries about 87 % of the torque of the solid shaft for 64 % of the area.',
      'Steel’s G is about 80 GPa and aluminium’s about 26 GPa, so at the same size aluminium twists about three times as much for the same torque but carries the same stress.',
      'Pure shear on the surface is the same as tension at 45° with magnitude τ. Brittle materials in torsion crack along 45° helices; ductile ones usually shear off square to the axis.',
    ],
    designChecklist: [
      'Get the torque. Convert from power with T = P/ω if needed, and take the peak (not average) value including start-up and shock.',
      'Choose the material and decide whether the design is stress-limited or twist-limited.',
      'Size the diameter from τ_max = 16T/(πd³) ≤ τ_allow (for ductile steel often taken as σ_y/2 divided by a safety factor, Tresca).',
      'Check the angle of twist θ = TL/(GJ) against the stiffness requirement.',
      'Add stress-concentration factors for keyways, shoulders and holes.',
      'If the shaft also bends or rotates under load, combine the stresses (Mohr’s circle, failure theory) and check fatigue.',
    ],
    prerequisites: [
      { courseId: 'mechanics-of-materials', topicId: 'stress-strain', why: 'Shear stress, shear strain and the modulus G follow the same idea as σ, ε and E.' },
      { courseId: 'engineering-statics', topicId: 'statics-equilibrium', why: 'The internal torque comes from a moment balance on a cut section.' },
    ],
    videos: [
      { id: '1YTKedLQOa0', title: 'Understanding Torsion', channel: EE, why: 'Companion to the derivation above, covering torsion of shafts.' },
    ],
    quiz: [
      {
        kind: 'numeric',
        prompt: 'A solid steel shaft of diameter 30 mm carries a torque of 300 N·m. What is the maximum shear stress?',
        answer: 56.59,
        unit: 'MPa',
        explanation: 'τ_max = 16T/(πd³) = 16 × 300 000 N·mm / (π × 30³ mm³) = 4 800 000 / 84 823 = 56.6 MPa. It acts on the outer surface.',
      },
      {
        kind: 'numeric',
        prompt: 'A shaft’s diameter is doubled with torque and length unchanged. The maximum shear stress becomes what multiple of the original?',
        answer: 0.125,
        explanation: 'τ_max = 16T/(πd³) ∝ 1/d³. Doubling d gives 1/2³ = 1/8 = 0.125.',
      },
      {
        kind: 'numeric',
        prompt: 'A steel shaft (G = 80 GPa), d = 40 mm, L = 1.5 m, carries T = 400 N·m. What is the total angle of twist?',
        answer: 1.71,
        unit: 'degrees',
        explanation: 'J = πd⁴/32 = π(0.04)⁴/32 = 2.513×10⁻⁷ m⁴. θ = TL/(GJ) = 400×1.5/(80×10⁹ × 2.513×10⁻⁷) = 0.02984 rad = 1.71°.',
      },
      {
        kind: 'choice',
        prompt: 'A steel shaft is replaced by an aluminium shaft of the same diameter and length carrying the same torque. What happens?',
        options: [
          'Both the surface shear stress and the twist angle change in proportion to the ratio of moduli',
          'The shear stress is unchanged but the angle of twist increases',
          'The shear stress rises but the twist angle is unchanged',
          'Neither changes, since the geometry is the same',
        ],
        correct: 1,
        explanation: 'τ_max = 16T/(πd³) contains no material property, so stress is the same. θ = TL/(GJ) contains G, and aluminium’s G is roughly a third of steel’s, so it twists about three times as much.',
      },
      {
        kind: 'choice',
        prompt: 'A student uses J = πd⁴/64 (the bending value) in the torsion formulas TL/(GJ) and Tr/J for a solid circular shaft. What is the consequence?',
        options: [
          'The angle of twist is under-estimated by a factor of 2',
          'The shear stress is under-estimated by a factor of 2',
          'The angle of twist and surface stress are both over-estimated by a factor of 2',
          'None; J = πd⁴/64 is the correct torsion constant',
        ],
        correct: 2,
        explanation: 'The polar moment of a solid circle is J = πd⁴/32, double the bending I = πd⁴/64. Using the smaller value puts the smaller number in the denominator of both TL/(GJ) and Tr/J, so both come out 2× too large (conservative, but wrong).',
      },
      {
        kind: 'numeric',
        prompt: 'A motor delivers 15 kW at 1500 rpm. What torque does it put into the shaft?',
        answer: 95.49,
        unit: 'N·m',
        explanation: 'ω = 1500 × 2π/60 = 157.08 rad/s. T = P/ω = 15 000 W / 157.08 rad/s = 95.5 N·m.',
      },
    ],
  },

  'axial-loading': {
    intuition:
      'A bar is a stiff spring. Pull on it and it stretches in proportion to the force, and a long thin bar stretches more than a short fat one. Stiffness is AE/L. Now fix both ends and the situation changes: the bar cannot stretch, so a force appears that squeezes or pulls it exactly enough to cancel the unwanted stretch. Heat does the same thing without any applied load. A metal wants to grow when warm, and if the surroundings prevent it, the blocked growth becomes stress. The same logic handles parts that share a load: two bars between the same rigid plates must stretch by the same amount, so the stiffer one takes the larger share of the force. That extra "must deform together" condition is what solves statically indeterminate problems.',
    derivation: [
      {
        text: 'Consider a straight bar with a constant internal force F(x) along its length. A short slice of length dx has stress σ = F/A and therefore, by Hooke’s law, strain ε = F/(AE):',
        latex: '\\varepsilon(x) = \\frac{\\sigma}{E} = \\frac{F(x)}{A\\,E}',
      },
      {
        text: 'Total elongation is the sum of the slices’ stretches. For a uniform bar with constant F it integrates to the spring law, and the stiffness is k = AE/L:',
        latex: '\\delta = \\int_0^L \\frac{F}{AE}\\,dx = \\frac{F L}{A E}',
      },
      {
        text: 'Thermal strain is stress-free: a temperature change ΔT causes a strain α ΔT in every direction, and for a bar of length L the free elongation is:',
        latex: '\\delta_T = \\alpha\\,\\Delta T\\, L',
      },
      {
        text: 'Total strain is the sum of the mechanical (stress-producing) and thermal parts, ε = σ/E + αΔT. If both ends are rigidly fixed the total elongation must be zero, so σ/E = −αΔT:',
        latex: '\\sigma_T = -E\\,\\alpha\\,\\Delta T',
      },
      {
        text: 'Statically indeterminate case: if statics gives fewer equations than unknown forces, add a compatibility condition from the geometry. For a bar fixed at both ends with a load P at distance a from the left end and b from the right, the reactions R_A and R_B satisfy equilibrium and compatibility (the two segments’ elongations cancel):',
        latex: 'R_A + R_B = P, \\qquad \\frac{R_A\\,a}{AE} = \\frac{R_B\\,b}{AE} \\;\\Rightarrow\\; R_A = \\frac{P\\,b}{L},\\; R_B = \\frac{P\\,a}{L}',
      },
    ],
    commonMistakes: [
      'Thinking a free bar develops thermal stress. If the bar can expand freely, σ = 0 however large ΔT is. Stress arises only when expansion is restrained, fully or partly. A partly restrained bar gets less than EαΔT.',
      'Treating a fixed-fixed bar as if it could be solved by statics. With a load in the middle and two walls, equilibrium has two unknown reactions and one equation; you must add compatibility.',
      'Splitting a load between parallel members in proportion to area alone. Members sharing a deflection share force in proportion to AE (their stiffness), not A. A steel and an aluminium bar of equal area do not carry equal load.',
      'Forgetting that the stiff end condition may be not so stiff. Walls, supports and the structure around a heated member are themselves elastic, so real thermal stress is lower than the fully fixed EαΔT upper bound.',
      'Using the full area where it is reduced. Elongation of a stepped bar is the sum of F L/(AE) over each segment, with each segment’s own A, and stress is highest in the smallest section or at a hole, where it is concentrated further.',
      'Sign confusion: a heated, restrained bar is in compression (it would like to be longer); a cooled one is in tension. Quoting the magnitude without saying which matters, especially for long slender members that then buckle.',
    ],
    rulesOfThumb: [
      'Steel with α ≈ 12×10⁻⁶ /°C and E ≈ 200 GPa gives roughly 2.4 MPa of stress per °C if fully restrained. A 50 °C rise gives about 120 MPa, around half of a mild steel’s yield, which is why long pipes and rails need expansion loops or gaps.',
      'Free thermal growth is easy to feel: about 0.012 mm per metre per °C for steel, so about 0.6 mm per metre for 50 °C.',
      'Stiffness in parallel adds: k = Σ A_i E_i / L. Force splits in the ratio of stiffnesses; if a member is ten times as stiff it takes about ten times the load.',
      'Elastic stretch is usually small: for 200 MPa steel it is about 1 mm per metre. If it is anything like 10 mm per metre, the stress is past yield or a unit is wrong.',
    ],
    designChecklist: [
      'Draw free-body diagrams and find the internal force in each member, using method of sections or joints.',
      'Decide whether statics alone solves it. If unknowns exceed equations, the problem is indeterminate.',
      'For an indeterminate problem, write the compatibility equation (δ₁ = δ₂, or total elongation = 0 for a fixed-fixed bar) and solve together with equilibrium.',
      'Add thermal strain αΔT to every member that sees a temperature change and is restrained.',
      'Compute σ = F/A in each member at its smallest section and compare with allowable stress.',
      'Check elongation δ = FL/(AE) against clearances, and check slender compression members for buckling.',
    ],
    prerequisites: [
      { courseId: 'mechanics-of-materials', topicId: 'stress-strain', why: 'Introduces σ = F/A, ε = ΔL/L and Hooke’s law, from which δ = FL/AE follows.' },
      { courseId: 'engineering-statics', topicId: 'statics-equilibrium', why: 'The internal forces in each member come from equilibrium; compatibility handles the rest.' },
    ],
    quiz: [
      {
        kind: 'numeric',
        prompt: 'A steel bar (E = 200 GPa) of area 150 mm² and length 1.2 m carries a tensile force of 30 kN. How much does it elongate?',
        answer: 1.2,
        unit: 'mm',
        explanation: 'δ = FL/(AE) = 30 000 N × 1200 mm / (150 mm² × 200 000 N/mm²) = 1.2 mm.',
      },
      {
        kind: 'numeric',
        prompt: 'A steel rod (E = 200 GPa, α = 12×10⁻⁶ /°C) is held rigidly between two walls and heated by 40 °C. What is the magnitude of the compressive stress?',
        answer: 96,
        unit: 'MPa',
        explanation: 'The blocked strain is αΔT = 12×10⁻⁶ × 40 = 4.8×10⁻⁴. σ = E α ΔT = 200 000 MPa × 4.8×10⁻⁴ = 96 MPa.',
      },
      {
        kind: 'numeric',
        prompt: 'A uniform bar is fixed to rigid walls at both ends. A load P = 30 kN acts along the axis at a point 40 % of the way from the left wall (a = 0.4L, b = 0.6L). What is the reaction at the left wall?',
        answer: 18,
        unit: 'kN',
        explanation: 'Compatibility: the left segment stretches by R_A·a/(AE) and the right segment shortens by R_B·b/(AE); these must balance, so R_A a = R_B b. With R_A + R_B = 30 this gives R_A = P b/L = 30 × 0.6 = 18 kN (and R_B = 12 kN). The wall nearer the load (the left one) takes the larger share, 18 kN.',
      },
      {
        kind: 'choice',
        prompt: 'A steel rail is free to slide at one end and is heated by 50 °C. A student gives its thermal stress as E α ΔT ≈ 120 MPa. What is wrong?',
        options: [
          'The stress should be E α ΔT / 2',
          'Nothing; any temperature rise causes stress of that size',
          'Because the rail is free to expand, its stress is zero; EαΔT applies only when expansion is fully prevented',
          'The stress should be computed using the shear modulus G',
        ],
        correct: 2,
        explanation: 'Unrestrained thermal expansion produces strain but no stress, since stress comes only from elastic strain, ε − αΔT. The rail simply gets longer (about 0.6 mm per metre); the 120 MPa is the upper bound for a rigidly fixed bar.',
      },
      {
        kind: 'numeric',
        prompt: 'A 100 kN axial load is shared by a steel bar (E = 200 GPa) and an aluminium bar (E = 70 GPa) of equal area and length, between two rigid plates. How much force does the steel bar carry?',
        answer: 74.07,
        unit: 'kN',
        explanation: 'Both bars have the same elongation, so F/(AE/L) is equal, and the force splits in proportion to E: F_steel = 100 × 200/(200+70) = 74.07 kN (aluminium carries 25.93 kN).',
      },
      {
        kind: 'choice',
        prompt: 'Two parallel bars share a load between rigid plates. Why does the stiffer bar carry more force?',
        options: [
          'Stiffer materials are stronger and so are assigned more load by the designer',
          'The plates tilt toward the stiffer bar',
          'Both bars must stretch by the same δ, and for a given δ the force is F = kδ, which is larger for the larger stiffness k',
          'The weaker bar yields first, which passes the load to the stronger bar',
        ],
        correct: 2,
        explanation: 'Compatibility, not strength, decides it. With equal δ the force in each member is its stiffness times δ. (Whether the stiffer bar also yields first depends on the stress it reaches, which is a separate check.)',
      },
    ],
  },

  'shear-bending-diagrams': {
    intuition:
      'Cut a loaded beam with an imaginary saw at any point and keep only the left piece. For it to stay in equilibrium, the cut face must supply an upward-or-downward force (the shear force V, which balances the net load on that piece) and a turning moment (the bending moment M, which balances the moment of that load about the cut). Slide the saw along the beam and these two numbers change, and they change in a very particular way. Every bit of load w you pass shifts V, and V is the slope of M. So V is the running total of the load, M is the running total of V, and a diagram is just the bookkeeping that shows where the beam is working hardest. The most dangerous cross-section is where |M| peaks, which is where V crosses zero.',
    derivation: [
      {
        text: 'Take a small slice of beam of length dx carrying a distributed load w(x) (positive downward). The internal shear on the left face is V, and on the right face it is V + dV. Vertical force balance of the slice:',
        latex: 'V - (V + dV) - w\\,dx = 0 \\;\\Rightarrow\\; \\frac{dV}{dx} = -w(x)',
      },
      {
        text: 'Moment balance of the same slice about its right edge. The load’s moment is second order in dx (w dx · dx/2) and vanishes in the limit, leaving the relation between V and M:',
        latex: 'M + dM - M - V\\,dx = 0 \\;\\Rightarrow\\; \\frac{dM}{dx} = V(x)',
      },
      {
        text: 'Integrate from point 1 to point 2. The change in shear equals minus the area under the load curve, and the change in moment equals the area under the shear diagram:',
        latex: 'V_2 - V_1 = -\\int_{x_1}^{x_2} w\\,dx, \\qquad M_2 - M_1 = \\int_{x_1}^{x_2} V\\,dx',
      },
      {
        text: 'A concentrated load P is the limit of a very narrow, very tall w. The integral gives a sudden jump in V of −P (a step in the shear diagram) and a kink, not a jump, in M (a change of slope). Only an applied couple causes a jump in M.',
        latex: '\\Delta V = -P',
      },
      {
        text: 'Worked case: simply supported beam, span L, central point load P. Symmetry gives R = P/2 at each end. V = +P/2 until midspan, then −P/2; the area under V up to the middle gives the maximum moment where V crosses zero:',
        latex: 'M_{max} = \\frac{P}{2}\\cdot\\frac{L}{2} = \\frac{P L}{4}',
      },
      {
        text: 'For a uniform load w on the same span, V is a straight line from +wL/2 to −wL/2 (the slope is −w), so M is a parabola with its peak, again at the zero crossing in the middle:',
        latex: 'M_{max} = \\frac{w L}{2}\\cdot\\frac{L}{2} - \\frac{wL}{2}\\cdot\\frac{L}{4} = \\frac{w L^2}{8}',
      },
    ],
    commonMistakes: [
      'Skipping the support reactions. The diagrams start from the reactions; get them wrong (or forget a distributed load’s resultant at its centroid) and every value after is wrong. Check ΣF = 0 and ΣM = 0 first.',
      'Mixing sign conventions halfway through. Pick one (e.g. positive shear turns the element clockwise; positive moment makes the beam sag) and keep it. Flipping conventions at a load gives a diagram that does not close at zero at the free or pinned end.',
      'Thinking a point load makes a jump in the moment diagram. It makes a jump in V and a kink in M. A jump in M comes only from an applied couple (concentrated moment).',
      'Looking for the maximum moment only at midspan. It is wherever V = 0 (or changes sign), and for an off-centre or mixed load it is not in the middle. Also check the supports and overhangs where V may not cross zero but M is still largest.',
      'Using the wrong slope. dV/dx = −w means a downward load makes V decrease; it does not mean V is negative. Likewise dM/dx = V gives M its slope; where V is zero M is flat (peak or valley), not zero.',
      'Forgetting end conditions. Moment is zero at a pin or free end unless a couple is applied there; at a cantilever’s fixed wall the reaction moment is often the largest value. If your diagram does not close to the right values, an error exists.',
    ],
    rulesOfThumb: [
      'Each integration raises the polynomial degree: a uniform load gives linear V and parabolic M; a point load gives constant V and linear M. If the shape does not match, recheck.',
      'Standard results: simply supported, uniform load, M_max = wL²/8 (midspan). Simply supported, centre point load, M_max = PL/4. Cantilever, tip load, M_max = PL at the wall. Cantilever, uniform load, M_max = wL²/2 at the wall.',
      'The area under the shear diagram between two points equals the change in moment between them. This provides an arithmetic check: M at the end of a simply supported beam must come back to zero.',
      'A uniform load spread over the same span gives a peak moment of only half of the same total load concentrated at midspan (wL²/8 vs PL/4 with P = wL).',
    ],
    designChecklist: [
      'Sketch the beam, supports and loads; replace distributed loads with resultants only for finding reactions.',
      'Solve for the reactions with ΣF = 0 and ΣM = 0 (check with a second moment sum).',
      'Choose a sign convention and write it on the page.',
      'Build V(x) by moving left to right: jump at point loads and reactions, slope −w under distributed loads.',
      'Build M(x) by integrating V (or taking areas); check that M returns to the correct end values.',
      'Mark the locations of V = 0 and the values of M_max and V_max, then hand them to the bending-stress and shear checks.',
    ],
    prerequisites: [
      { courseId: 'engineering-statics', topicId: 'statics-equilibrium', why: 'Reactions come from force and moment equilibrium.' },
    ],
    videos: [
      { id: 'C-FEVzI8oe8', title: 'Understanding Shear Force and Bending Moment Diagrams', channel: EE, why: 'Companion to this topic for drawing V and M diagrams.' },
    ],
    quiz: [
      {
        kind: 'numeric',
        prompt: 'A cantilever beam 2 m long carries a uniformly distributed load of 5 kN/m over its full length. What is the maximum bending moment magnitude, at the fixed wall?',
        answer: 10,
        unit: 'kN·m',
        explanation: 'The load’s resultant is wL = 10 kN acting at the midpoint, 1 m from the wall. M = wL²/2 = 5 × 4/2 = 10 kN·m.',
      },
      {
        kind: 'numeric',
        prompt: 'A simply supported beam with a span of 6 m carries a uniform load of 10 kN/m over the whole span. What is the maximum bending moment?',
        answer: 45,
        unit: 'kN·m',
        explanation: 'M_max = wL²/8 = 10 × 36/8 = 45 kN·m at midspan, where the shear crosses zero. Each reaction is wL/2 = 30 kN.',
      },
      {
        kind: 'numeric',
        prompt: 'A simply supported beam of span 8 m carries a single 20 kN point load 2 m from the left support. What is the maximum bending moment?',
        answer: 30,
        unit: 'kN·m',
        explanation: 'R_A = P b/L = 20 × 6/8 = 15 kN. Shear is +15 kN until the load, then −5 kN, so it crosses zero at the load. M_max = R_A × 2 m = 30 kN·m (check from the right: 5 kN × 6 m = 30 kN·m).',
      },
      {
        kind: 'choice',
        prompt: 'For a simply supported beam with a uniformly distributed load, a student sketches the shear diagram as a horizontal line and the moment diagram as a straight inclined line. What is the error?',
        options: [
          'The shear should be a parabola and the moment a cubic',
          'Because dV/dx = −w ≠ 0, V is a sloping straight line, and because M is the integral of V it is a parabola',
          'The shear should be a horizontal line but the moment a parabola',
          'The diagrams are correct for a uniform load',
        ],
        correct: 1,
        explanation: 'A constant load w means the shear has constant slope −w, so V is linear, from +wL/2 to −wL/2. Integrating a linear function gives a parabola for M. Constant shear belongs to a beam with point loads only.',
      },
      {
        kind: 'numeric',
        prompt: 'Along a stretch of beam the shear force drops linearly from 20 kN to 0 over a 4 m length. By how much does the bending moment increase over that stretch?',
        answer: 40,
        unit: 'kN·m',
        explanation: 'ΔM = area under the shear diagram = ½ × 20 kN × 4 m = 40 kN·m. The slope of M is V, so M rises quickly then flattens to zero slope where V reaches zero, which is the peak.',
      },
      {
        kind: 'choice',
        prompt: 'Where is the bending moment largest on a beam in the absence of applied couples?',
        options: [
          'Where the load per metre is largest',
          'Where the shear force is largest',
          'Always at midspan',
          'Where the shear force crosses zero (or at a support, if it never does)',
        ],
        correct: 3,
        explanation: 'Because dM/dx = V, M has zero slope (a local maximum or minimum) where V = 0. Where shear is largest, M is changing fastest, not peaking. Midspan is just where this happens for symmetric loading.',
      },
    ],
  },

  'beam-deflection': {
    intuition:
      'A bent beam is a curved beam, and its curvature at each point is set by the moment there: where the moment is large the beam curls tightly, where it is zero it is locally straight. The stiffness EI is the resistance to that curling. Deflection is then what you get from adding up all that curvature along the beam, and because curvature turns into slope and slope turns into displacement, errors compound. Since slope is the integral of curvature, deflection is the integral of slope, and the span enters twice, so a beam twice as long sags by 8× (point load) or 16× (uniform load) rather than 2×. A floor can easily be strong enough and still unacceptable: it sags, bounces, cracks the plaster or lets a machine drift out of alignment. Deflection is a separate check, and it often governs.',
    derivation: [
      {
        text: 'From the bending derivation, a beam in pure bending takes a radius of curvature ρ given by 1/ρ = M/(EI). Stiffer sections or smaller moments mean less curvature.',
        latex: '\\frac{1}{\\rho} = \\frac{M}{E I}',
      },
      {
        text: 'For a curve v(x), the curvature is v″/(1+v′²)^{3/2}. Real beams have tiny slopes (v′ ≪ 1), so the denominator is essentially 1, which linearises the problem. With v measured downward when M sags the beam:',
        latex: 'E I\\, v^{\\prime\\prime}(x) = M(x)',
      },
      {
        text: 'Integrate once to get slope and again to get deflection; each integration adds a constant fixed by the supports. Example: a cantilever of length L, load P at the free tip, x from the wall. The moment at x is P(L − x), so:',
        latex: 'E I\\, v^{\\prime\\prime} = P\\,(L - x)',
      },
      {
        text: 'The first integration gives the slope, and the wall condition v′(0) = 0 sets the constant to zero:',
        latex: 'E I\\, v^{\\prime} = P\\left(L x - \\frac{x^2}{2}\\right)',
      },
      {
        text: 'The second integration with v(0) = 0 gives the deflected shape. At the tip, x = L, it is the headline result:',
        latex: 'E I\\, v = P\\left(\\frac{L x^2}{2} - \\frac{x^3}{6}\\right) \\;\\Rightarrow\\; \\delta_{tip} = \\frac{P L^3}{3 E I}',
      },
      {
        text: 'The same procedure with different M(x) and boundary conditions gives the other standard cases, such as simply supported, uniform load w, and centre point load P. Superposition (valid because the equation is linear) lets you add the effects of separate loads:',
        latex: '\\delta_{max} = \\frac{5 w L^4}{384\\, E I}, \\qquad \\delta_{mid} = \\frac{P L^3}{48\\, E I}',
      },
    ],
    commonMistakes: [
      'Mixing units in EI. With E in N/mm² (MPa) and I in mm⁴ keep the load in N and lengths in mm; deflection then comes out in mm. A single metre in the wrong place changes a result by 10³ or more; use consistent units throughout.',
      'Forgetting that deflection grows with the cube or fourth power of span. A "slightly longer" beam can sag much more; going from 5 m to 6 m is 1.7× for point load, 2.1× for uniform load.',
      'Believing a stronger material fixes sag. Deflection is proportional to 1/E, and E is almost the same for all steels. A high-strength steel allows higher stress but sags exactly as much as mild steel for the same section; to reduce sag use a deeper section.',
      'Applying handbook formulas to the wrong boundary conditions. A fixed end and a pinned end are different problems; "simply supported" formulas used on a beam with partially fixed supports overestimate deflection, and cantilever formulas on a beam that is only nominally fixed underestimate it.',
      'Using the small-slope equation for big deflections, such as long flexible members and springs. If the slope exceeds a few degrees, the linear EIv″ = M is no longer accurate.',
      'Ignoring shear deformation in short, deep beams. Bending-only formulas assume slender beams (span/depth ≳ 10, roughly); for stubby ones, shear adds noticeably.',
    ],
    rulesOfThumb: [
      'Scaling: deflection ∝ L³ (point load) or L⁴ (uniform load), and ∝ 1/I. For a rectangle, I ∝ h³, so doubling depth reduces deflection to 1/8.',
      'Typical serviceability limits are around L/360 for floors under live load and L/180 to L/240 for roofs, but the correct value is given by the governing code or the machine’s accuracy requirement. For precision machines it is far tighter.',
      'A cantilever with the same load and length deflects 16× more at its tip than the midspan of a simply supported beam (PL³/3EI vs PL³/48EI).',
      'In general, shallow beams are governed by deflection and deep short beams by strength. Whichever check gives the larger section wins; always do both.',
    ],
    designChecklist: [
      'Identify the structural model: supports (pinned, fixed, free), span and the load cases (point, distributed, moving).',
      'Look up or derive the deflection formula for that case; for combined loads add them by superposition.',
      'Use consistent units and confirm E and I are for the correct bending axis.',
      'Find the maximum deflection and its location (where slope is zero); compare with the limit (L/360 or the application-specific figure).',
      'If it fails, increase I first (depth is the most efficient lever); only then think about E or span reduction.',
      'Recheck strength (σ = Mc/I) and shear for the new section so that neither check is neglected.',
    ],
    prerequisites: [
      { courseId: 'mechanics-of-materials', topicId: 'bending-stress-beams', why: 'The curvature relation 1/ρ = M/(EI) and the second moment of area I come from the bending analysis.' },
      { courseId: 'mechanics-of-materials', topicId: 'shear-bending-diagrams', why: 'You need M(x) to integrate the elastic curve.' },
    ],
    videos: [
      { id: 'MvBqCeZllpQ', title: 'Understanding the Deflection of Beams', channel: EE, why: 'Companion for integrating the elastic curve and the standard deflection cases.' },
    ],
    quiz: [
      {
        kind: 'numeric',
        prompt: 'A steel cantilever (E = 200 GPa, I = 2×10⁶ mm⁴) is 1.5 m long with a 2 kN load at the free end. What is the tip deflection?',
        answer: 5.625,
        unit: 'mm',
        explanation: 'δ = PL³/(3EI) = 2000 N × (1500 mm)³ / (3 × 200 000 N/mm² × 2×10⁶ mm⁴) = 6.75×10¹² N·mm³ / 1.2×10¹² N·mm² = 5.625 mm.',
      },
      {
        kind: 'numeric',
        prompt: 'A simply supported steel beam (E = 200 GPa, I = 8×10⁷ mm⁴), span 5 m, carries a uniform load of 4 kN/m. What is the midspan deflection?',
        answer: 2.03,
        unit: 'mm',
        explanation: 'δ = 5wL⁴/(384EI) = 5 × 4 N/mm × (5000 mm)⁴ / (384 × 200 000 × 8×10⁷) = 1.25×10¹³ / 6.144×10¹² = 2.03 mm. (4 kN/m = 4 N/mm.)',
      },
      {
        kind: 'choice',
        prompt: 'A simply supported beam with a central point load is replaced by one twice as long with the same section and load. By what factor does the midspan deflection increase?',
        options: ['8×', '2×', '4×', '16×'],
        correct: 0,
        explanation: 'δ = PL³/(48EI) ∝ L³, so doubling L gives 2³ = 8×. (Under uniform load per metre it would be 16×, because δ ∝ wL⁴ and the total load also doubles.)',
      },
      {
        kind: 'choice',
        prompt: 'A floor beam sags too much. Which change reduces deflection the most for roughly the same cost?',
        options: [
          'Switch to a steel with three times the yield strength',
          'Make the section 20 % deeper, which raises I by about 73 %',
          'Make the section 20 % wider, which raises I by 20 %',
          'Paint it, which reduces corrosion',
        ],
        correct: 1,
        explanation: 'Deflection ∝ 1/(EI). Yield strength does not appear, and E barely changes between steels. Depth enters as h³: 1.2³ = 1.73. Width enters only linearly, so +20 % there gives just +20 %.',
      },
      {
        kind: 'choice',
        prompt: 'A student says: "My beam sags only 4 mm, well within the span/360 limit, so its bending stress check is automatically fine as well." What is wrong?',
        options: [
          'Nothing: deflection and stress are always governed by the same section property',
          'Deflection is always the more critical of the two',
          'Stress depends on I only, so a deflection check is meaningless',
          'Strength (σ = Mc/I) and serviceability (deflection ∝ 1/EI) are separate checks; a beam can pass one and fail the other, especially with high-strength material or short spans',
        ],
        correct: 3,
        explanation: 'Deflection depends on EI and the load shape, stress on M/S. Short, heavily loaded beams tend to fail on stress first; long, shallow ones fail on sag first. Passing deflection says nothing about yield.',
      },
      {
        kind: 'numeric',
        prompt: 'A floor beam spans 7.2 m. What is the maximum allowable deflection under an L/360 limit?',
        answer: 20,
        unit: 'mm',
        explanation: 'The limit is a fraction of the span: 7200 mm / 360 = 20 mm. Serviceability limits like L/360 exist because a floor that is strong enough can still feel bouncy or crack its finishes — deflection is a stiffness check, separate from the stress check. Remember to work in consistent units (7.2 m = 7200 mm).',
      },
    ],
  },

  'columns-buckling': {
    intuition:
      'Stand on a wooden ruler held upright and it does not get crushed; it suddenly bows out sideways and flops. The same thing happens to a drinking straw pushed end to end. A slender column is in an unstable balance. As long as it is perfectly straight, load only squeezes it; but any tiny sideways nudge is amplified because the load now acts with a lever arm equal to the sideways deflection, which creates a bending moment that bends it further. Below a critical load the beam’s bending stiffness wins and the nudge dies out. Above it the push wins and the column collapses sideways, often at a stress far below yield. Therefore the failure is a stiffness problem and not a strength problem: it depends on EI and length, not on how strong the steel is.',
    derivation: [
      {
        text: 'Imagine a pin-ended column of length L that has been given a small sideways deflection y(x). The axial load P acts at a lever arm y at that section, so the internal bending moment is M = P y (taking y as the deflection that curves the column the same way).',
      },
      {
        text: 'Use the elastic-curve relation EI y″ = −M (the sign is such that a positive deflection is curved back toward the axis), giving a homogeneous differential equation:',
        latex: 'E I\\, y^{\\prime\\prime} + P\\, y = 0 \\;\\Rightarrow\\; y^{\\prime\\prime} + k^2 y = 0, \\quad k^2 = \\frac{P}{E I}',
      },
      {
        text: 'The general solution is a sine plus a cosine. The pinned end at x = 0 requires y = 0, which kills the cosine term:',
        latex: 'y(x) = A \\sin(kx) + B\\cos(kx), \\qquad y(0)=0 \\Rightarrow B = 0',
      },
      {
        text: 'The pinned end at x = L requires y(L) = 0. Either A = 0 (the trivial straight column) or sin(kL) = 0, which allows a bowed shape only when kL is a multiple of π:',
        latex: 'k L = n\\pi, \\quad n = 1, 2, 3, \\ldots',
      },
      {
        text: 'The smallest load that permits a bowed shape corresponds to n = 1. Substituting k² = P/(EI) gives Euler’s critical load. Higher n are higher modes that the column would reach only if braced at midspan:',
        latex: 'P_{cr} = \\frac{\\pi^2 E I}{L^2}',
      },
      {
        text: 'Other end conditions have different mode shapes, but they are equivalent to a pin-ended column of effective length K L (K = 0.5 for fixed-fixed, 2 for fixed-free, about 0.7 for fixed-pinned). Dividing by A and using r = √(I/A) gives the critical stress in terms of the slenderness ratio λ = KL/r:',
        latex: 'P_{cr} = \\frac{\\pi^2 E I}{(K L)^2}, \\qquad \\sigma_{cr} = \\frac{P_{cr}}{A} = \\frac{\\pi^2 E}{\\lambda^2}',
      },
    ],
    commonMistakes: [
      'Using I about the wrong axis. A column buckles about the axis with the smallest I (weakest direction), unless it is braced. A 20 × 50 mm flat bar buckles about its thin direction: use I = 50·20³/12, not 20·50³/12 (which is 6.25× larger).',
      'Applying Euler’s formula to short columns. The derivation assumes elastic behaviour; if σ_cr = π²E/λ² comes out above the proportional limit or yield, the formula is invalid and inelastic buckling formulas (Johnson, tangent modulus, or codes) apply. A stubby column fails by crushing.',
      'Picking the wrong effective-length factor. K = 1 is for pinned-pinned; fixed-free is 2 (a flagpole). Using K = 0.5 for ends that are only partly fixed can overestimate capacity by up to 4×. Real supports are rarely perfectly fixed, so codes use conservative values.',
      'Forgetting length enters squared. Doubling length drops P_cr to a quarter; a "slightly longer" column is much weaker. Overlooking the unbraced length (e.g. using the total height when intermediate bracing exists, or vice-versa) causes big errors both ways.',
      'Assuming a perfectly straight, perfectly centred column. Real columns have initial crookedness and load eccentricity, so they begin bending from the start and fail below P_cr, and a design must apply a factor of safety (often large, e.g. roughly 2 or more) or a code reduction.',
      'Thinking a stronger steel helps. P_cr depends on E, not yield. A high-strength steel buckles at the same load as mild steel (for the same slender column), so the extra strength is wasted.',
    ],
    rulesOfThumb: [
      'Effective-length factors: pinned-pinned 1.0, fixed-fixed 0.5, fixed-pinned about 0.7, fixed-free 2.0. Capacity scales with 1/K², so fixed-fixed carries 4× the pinned load and fixed-free ¼.',
      'For a solid round bar r = d/4, so λ = 4KL/d. A pinned 3 m column of 50 mm diameter has λ = 240, very slender. As a rough guide, steel columns with λ above roughly 100 are elastic-buckling territory, and those below about 40 to 50 are governed mainly by crushing.',
      'Make the section hollow: a tube with the same area as a bar has a much larger r, which raises P_cr sharply (P_cr ∝ I ∝ A r²). This is why scaffolding, bicycle frames and pylons are tubes.',
      'Euler stress at λ = 100 for steel is about π² × 200 000 / 100² ≈ 197 MPa, close to yield for typical structural steel, which marks roughly where Euler stops being the whole story.',
    ],
    designChecklist: [
      'Determine the axial load and the unbraced length in each bending direction.',
      'Choose the effective-length factor K from the real end restraints, conservatively.',
      'Compute I and r about the weak axis, then λ = KL/r.',
      'Compare the λ with the elastic/inelastic transition for the material to decide whether Euler or an inelastic formula (or a design code) applies.',
      'Compute P_cr (or the allowable stress) and apply the factor of safety required for imperfections and eccentricity.',
      'Check the crushing limit σ_y A and take the smaller of the two; consider local buckling of thin walls and flanges too.',
      'If it fails, improve I with a larger or hollow section, add bracing to cut the unbraced length, or improve end fixity, before using a stronger material.',
    ],
    prerequisites: [
      { courseId: 'mechanics-of-materials', topicId: 'beam-deflection', why: 'The derivation reuses the elastic-curve equation EIy″ = M.' },
      { courseId: 'mechanics-of-materials', topicId: 'axial-loading', why: 'Provides the compressive load and the contrast between crushing (strength) and buckling (stability).' },
    ],
    videos: [
      { id: '21G7LA2DcGQ', title: 'Understanding Buckling', channel: EE, why: 'Companion to this topic for the idea of buckling and Euler’s load.' },
    ],
    quiz: [
      {
        kind: 'numeric',
        prompt: 'A pin-ended steel column (E = 200 GPa) of solid circular section, d = 20 mm and L = 1 m, carries an axial load. What is the Euler critical load?',
        answer: 15.5,
        unit: 'kN',
        explanation: 'I = πd⁴/64 = π(0.02)⁴/64 = 7.854×10⁻⁹ m⁴. P_cr = π²EI/L² = π² × 200×10⁹ × 7.854×10⁻⁹ / 1² = 15.5 kN. (The crushing load would be about 250 MPa × 314 mm² ≈ 78 kN, so buckling governs.)',
      },
      {
        kind: 'choice',
        prompt: 'The same column is fixed at both ends instead of pinned (K = 0.5). Compared with the pinned case, its critical load is:',
        options: ['2× larger', '4× larger', '½ as large', '¼ as large'],
        correct: 1,
        explanation: 'P_cr ∝ 1/(KL)². Replacing K = 1 with K = 0.5 divides the denominator by 4, so the load is 4× larger.',
      },
      {
        kind: 'numeric',
        prompt: 'A pin-ended solid round column has a diameter of 50 mm and a length of 3 m. What is its slenderness ratio λ = KL/r?',
        answer: 240,
        explanation: 'r = √(I/A) = d/4 = 12.5 mm for a solid circle. λ = 1 × 3000 / 12.5 = 240.',
      },
      {
        kind: 'numeric',
        prompt: 'For that column (λ = 240, E = 200 GPa), what is the Euler critical stress σ_cr = π²E/λ²?',
        answer: 34.27,
        unit: 'MPa',
        explanation: 'σ_cr = π² × 200 000 MPa / 240² = 1 973 921 / 57 600 = 34.27 MPa, far below yield (250 MPa), so the column fails elastically by buckling. This matches the curriculum example: 67.3 kN / 1963 mm² ≈ 34.3 MPa.',
      },
      {
        kind: 'choice',
        prompt: 'A slender pinned steel column buckles at 40 kN. An engineer proposes replacing it with a steel of three times the yield strength but the same size and E. What is the new buckling load?',
        options: [
          'About 120 kN, since strength is three times higher',
          'About 40 kN: unchanged, because P_cr depends on E, I and length, not on yield strength',
          'About 13 kN, because high-strength steels are more brittle',
          'About 80 kN',
        ],
        correct: 1,
        explanation: 'P_cr = π²EI/(KL)² has no strength term. The yield strength only matters for stocky columns that crush. Elastic buckling load is the same for all steels with E ≈ 200 GPa.',
      },
      {
        kind: 'choice',
        prompt: 'A student calculates the buckling load of a 20 mm × 50 mm rectangular bar (pinned ends) using I = 20 × 50³/12. What is wrong?',
        options: [
          'The bar buckles about its weak axis, so I should be 50 × 20³/12 — the student overestimates P_cr by 6.25×',
          'Nothing; buckling always occurs about the strong axis',
          'The student should have used the polar moment J',
          'The student under-estimates P_cr and is therefore conservative and safe',
        ],
        correct: 0,
        explanation: 'A column buckles about the axis with the lowest I. I_strong/I_weak = (50/20)² = 6.25. Using the strong-axis value overpredicts the buckling load by that factor, which is unsafe, not conservative.',
      },
    ],
  },
}
