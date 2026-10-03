import type { TeachingContent } from '../teachingTypes'
import { EE } from '../teachingTypes'

/** Elements of Mechanical Design (2.72) teaching content. */
export const CONTENT: Record<string, TeachingContent> = {
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
  'failure-theories': {
    intuition:
      'A tensile test gives you one number, the yield strength, for one very simple stress state: pull along a single axis. Real parts are never that polite — a shaft is bent and twisted at once, a pressure vessel is stretched in two directions. Yet the metal does not care how you describe the loading; it only cares whether the atomic planes are being made to slide over each other. That sliding is driven by shear, and shear is large when the principal stresses are very different from each other. Squeeze a rubber ball in water (equal pressure everywhere) and nothing distorts; squeeze it between two fingers and it flows. Tresca and von Mises are two ways of turning "how different are the principal stresses" into one equivalent number you can hold up against the uniaxial yield strength.',
    derivation: [
      {
        text: 'Start from the stress state at the critical point, reduced to principal stresses (σ1 ≥ σ2 ≥ σ3). For plane stress at a free surface one of them is zero, but it still has to be counted as σ3 = 0 when you sort them.',
      },
      {
        text: 'Tresca (maximum shear): yielding is governed by the largest shear stress, which is half the spread between the extreme principal stresses. In a tensile test σ1 = S_y and σ3 = 0, so the shear at yield is S_y/2. Setting the general state equal to that gives the criterion:',
        latex: '\\tau_{max} = \\frac{\\sigma_1 - \\sigma_3}{2} = \\frac{S_y}{2n} \\;\\Rightarrow\\; \\sigma_1 - \\sigma_3 = \\frac{S_y}{n}',
      },
      {
        text: 'Von Mises (distortion energy): split the strain energy into a part that changes volume and a part that changes shape. A uniform hydrostatic stress only changes volume and is harmless to ductile metals, so only the distortion energy matters:',
        latex: 'u_d = \\frac{1+\\nu}{6E}\\left[(\\sigma_1-\\sigma_2)^2 + (\\sigma_2-\\sigma_3)^2 + (\\sigma_3-\\sigma_1)^2\\right]',
      },
      {
        text: 'Equate u_d for the general state to u_d in the tensile test at yield (σ1 = S_y, others zero). The common factor cancels and leaves the equivalent (von Mises) stress:',
        latex: "\\sigma' = \\sqrt{\\tfrac{1}{2}\\left[(\\sigma_1-\\sigma_2)^2 + (\\sigma_2-\\sigma_3)^2 + (\\sigma_3-\\sigma_1)^2\\right]}",
      },
      {
        text: 'Set σ3 = 0 (plane stress) and expand to get the form used on the topic page:',
        latex: "\\sigma' = \\sqrt{\\sigma_1^2 - \\sigma_1\\sigma_2 + \\sigma_2^2}",
      },
      {
        text: 'Yield is predicted when σ′ = S_y, so the factor of safety is the ratio below. For pure shear τ the principal stresses are ±τ, giving σ′ = √3·τ (yield at 0.577·S_y) from von Mises but 2τ (yield at 0.5·S_y) from Tresca — the largest disagreement between the two, about 15 %.',
        latex: "n = \\frac{S_y}{\\sigma'}",
      },
    ],
    commonMistakes: [
      'Dropping σ3 = 0 when using Tresca. For plane stress with σ1 = 80 and σ2 = 40 MPa, the extreme principal stresses are 80 and 0, so σ1 − σ3 = 80, not σ1 − σ2 = 40. Sort all three principal stresses first.',
      'Feeding normal and shear components directly into the plane-stress formula. √(σ1² − σ1σ2 + σ2²) takes principal stresses. With σx, σy and τxy use σ′ = √(σx² − σxσy + σy² + 3τxy²) instead.',
      'Applying these criteria to brittle materials. Von Mises and Tresca are yield criteria for ductile metals. Cast iron and ceramics fracture, and are far weaker in tension than in compression, so use maximum-normal-stress, Coulomb–Mohr or modified-Mohr criteria.',
      'Comparing σ′ with the ultimate strength, or a static criterion with an endurance limit. These checks answer "will it yield on the first load?" For cyclic loads add a fatigue check on top.',
      'Quoting a von Mises "stress" from FE software as if it were a signed stress. It is always positive and says nothing about tension versus compression, so a high σ′ in a compressive region can still be a buckling or contact problem rather than a yield problem.',
      'Ignoring stress concentrations because the von Mises peak "looks local". A sharp notch in a ductile part may yield locally and be fine under static load, but the same peak governs fatigue — decide which one you are checking before you average it away.',
    ],
    rulesOfThumb: [
      'Von Mises is the better fit to test data for ductile metals; Tresca is simpler and never less conservative. When you are not sure, Tresca costs you at most about 15 % extra material.',
      'For pure shear, yield in shear is about 0.577·S_y (von Mises) or 0.5·S_y (Tresca) — a handy figure for pins, keys and shafts in torsion.',
      'If all three principal stresses are roughly equal (a hydrostatic state), neither criterion predicts yield however large they get; very high triaxial tension can instead cause brittle-type fracture.',
      'A factor of safety of 1.5–2 against yield is typical for well-characterised static loads in ductile steel; more when loads, material properties or the analysis are uncertain.',
    ],
    designChecklist: [
      'Find the critical point and compute the full stress state there (axial, bending, torsion, pressure, including stress concentrations at notches and fillets).',
      'Resolve it into principal stresses (Mohr’s circle) and include σ3, even if it is zero.',
      'Decide whether the material is ductile (use von Mises or Tresca) or brittle (use a Mohr-type fracture criterion).',
      'Compute σ′ (and Tresca’s σ1 − σ3 if you want the conservative bound).',
      'Form n = S_y/σ′ and compare with the required factor of safety.',
      'If the load is cyclic, repeat the check with a fatigue criterion — static yield does not protect against fatigue.',
    ],
    prerequisites: [
      { courseId: 'mechanics-of-materials', topicId: 'combined-loading-mohrs-circle', why: 'Principal stresses from Mohr’s circle are the inputs to both criteria.' },
      { courseId: 'mechanics-of-materials', topicId: 'stress-strain', why: 'Defines yield strength S_y from the tensile test the criteria are calibrated against.' },
    ],
    videos: [
      {
        id: 'xkbQnBAOFEg',
        title: 'Understanding Failure Theories (Tresca, von Mises etc...)',
        channel: EE,
        why: 'Matches this topic directly: the Tresca and von Mises yield criteria.',
      },
    ],
    quiz: [
      {
        kind: 'numeric',
        prompt: 'Principal stresses are σ1 = 120 MPa and σ2 = −60 MPa (plane stress, σ3 = 0). What is the von Mises equivalent stress?',
        answer: 158.7,
        unit: 'MPa',
        explanation: 'σ′ = √(σ1² − σ1σ2 + σ2²) = √(14400 + 7200 + 3600) = √25200 ≈ 158.7 MPa. The opposite signs make the cross term add, so σ′ is larger than the 120 MPa you might guess from the biggest stress alone.',
      },
      {
        kind: 'numeric',
        prompt: 'The same state (120 MPa and −60 MPa, σ3 = 0) acts on a steel with S_y = 300 MPa. What is the factor of safety by von Mises?',
        answer: 1.89,
        explanation: 'n = S_y/σ′ = 300/158.7 ≈ 1.89. Tresca would use σ1 − σ3 = 120 − (−60) = 180 MPa and give 300/180 = 1.67, slightly lower.',
      },
      {
        kind: 'numeric',
        prompt: 'A thin-walled cylinder has hoop stress 100 MPa and axial stress 50 MPa on its outer surface (radial stress ≈ 0). With S_y = 250 MPa, what is the Tresca factor of safety?',
        answer: 2.5,
        explanation: 'The principal stresses are 100, 50 and 0 MPa. Tresca uses the extreme pair, σ1 − σ3 = 100 − 0 = 100 MPa, so n = 250/100 = 2.5. Von Mises gives σ′ = √(100² − 100·50 + 50²) = 86.6 MPa and n = 2.89, so Tresca is the more conservative of the two.',
      },
      {
        kind: 'numeric',
        prompt: 'Using the von Mises criterion, at what shear stress does a material with S_y = 350 MPa yield in pure shear?',
        answer: 202.1,
        unit: 'MPa',
        explanation: 'Pure shear has principal stresses +τ and −τ, so σ′ = √(τ² + τ² + τ²) = √3·τ. Setting σ′ = 350 gives τ = 350/√3 ≈ 202 MPa, i.e. 0.577·S_y. Tresca would predict yield at 0.5·S_y = 175 MPa.',
      },
      {
        kind: 'choice',
        prompt: 'A student has σ1 = 80 MPa, σ2 = 40 MPa and σ3 = 0 (plane stress) and applies Tresca as σ1 − σ2 = 40 MPa. What went wrong?',
        options: [
          'Nothing — Tresca always uses the two largest principal stresses',
          'They should have used von Mises only, because Tresca cannot handle plane stress',
          'Tresca should use the sum of the principal stresses, 120 MPa',
          'Tresca needs the extreme principal stresses, including σ3 = 0, so the value is 80 − 0 = 80 MPa',
        ],
        correct: 3,
        explanation: 'Maximum shear is half the difference between the largest and smallest of all three principal stresses. In plane stress the third one is zero and must be included; here it is the smallest, so σ1 − σ3 = 80 MPa. Using 40 MPa halves the stress and doubles the apparent factor of safety.',
      },
      {
        kind: 'choice',
        prompt: 'A ductile steel part sits in a state of equal tension σ1 = σ2 = σ3 = 500 MPa, with S_y = 250 MPa. What does the von Mises criterion predict?',
        options: [
          'No yielding: every difference between principal stresses is zero, so σ′ = 0',
          'Yielding at half that stress',
          'Immediate yielding, because 500 MPa exceeds S_y',
          'Fracture, because von Mises only applies to compression',
        ],
        correct: 0,
        explanation: 'Von Mises depends only on differences between principal stresses, so a purely hydrostatic state gives σ′ = 0. Hydrostatic stress changes volume, not shape, and does not drive slip in metals. (Real parts under heavy triaxial tension can still fracture, which is outside these criteria.)',
      },
      {
        kind: 'choice',
        prompt: 'Which statement about Tresca and von Mises is correct?',
        options: [
          'Von Mises is always the more conservative',
          'They give identical answers for any plane-stress state',
          'Tresca is never less conservative than von Mises; the two coincide for equal biaxial tension and differ most in pure shear',
          'Both apply equally well to brittle cast iron',
        ],
        correct: 2,
        explanation: 'The Tresca hexagon lies inside (or touches) the von Mises ellipse on the plane-stress yield diagram, so Tresca predicts yield no later. They touch where σ1 = σ2 and are furthest apart in pure shear, by a factor of 2/√3 ≈ 1.155. Both are for ductile yielding, not brittle fracture.',
      },
    ],
  },
  'shaft-design': {
    intuition:
      'A shaft is a rotating beam that is also a torsion bar. Hang a gear on it and the tooth force bends it; deliver power through it and it twists. Now spin it. A transverse load that stays fixed in space is, from the point of view of a single fibre on the surface, a stress that swings from tension to compression once every revolution — a fully reversed fatigue cycle, billions of times over a service life. The torque, meanwhile, usually just sits there, steady. So the shaft carries a swinging bending stress and a steady shear stress together, and the places it breaks are the places where that stress is amplified: a shoulder fillet, a keyway, a snap-ring groove, a press fit. Sizing a shaft is therefore mostly a game of choosing the right diameter at the right section and not wrecking it with a sharp corner.',
    derivation: [
      {
        text: 'At the surface of a solid round shaft of diameter d, bending and torsion stresses are (nominal, before stress concentration):',
        latex: '\\sigma = \\frac{32\\,M}{\\pi d^3}, \\qquad \\tau = \\frac{16\\,T}{\\pi d^3}',
      },
      {
        text: 'In a rotating shaft the bending moment M_a produces a fully reversed stress (a purely alternating component), while a steady torque T_m produces a steady shear (a purely mean component). Apply the fatigue stress-concentration factors K_f (bending) and K_fs (torsion) to each:',
        latex: '\\sigma_a = K_f\\frac{32 M_a}{\\pi d^3}, \\qquad \\tau_m = K_{fs}\\frac{16 T_m}{\\pi d^3}',
      },
      {
        text: 'Combine each component into an equivalent von Mises stress. The alternating part is pure bending (σ′ = σ_a) and the mean part is pure shear (σ′ = √3·τ_m):',
        latex: "\\sigma_a' = K_f\\frac{32 M_a}{\\pi d^3}, \\qquad \\sigma_m' = \\sqrt{3}\\,K_{fs}\\frac{16 T_m}{\\pi d^3}",
      },
      {
        text: 'Feed those into the modified Goodman line from the fatigue topic, σ_a′/S_e + σ_m′/S_ut = 1/n:',
        latex: "\\frac{1}{n} = \\frac{16}{\\pi d^3}\\left[\\frac{2K_f M_a}{S_e} + \\frac{\\sqrt{3}\\,K_{fs}T_m}{S_{ut}}\\right]",
      },
      {
        text: 'Solve for the diameter. This is the conservative linear-sum (DE-Goodman) form:',
        latex: "d^3 = \\frac{16\\,n}{\\pi}\\left[\\frac{2K_f M_a}{S_e} + \\frac{\\sqrt{3}\\,K_{fs}T_m}{S_{ut}}\\right]",
      },
      {
        text: 'Two terms are added, not combined in quadrature: the linear sum is the conservative DE-Goodman form. Some texts combine the terms as a square root of the sum of squares (the DE-Elliptic form, which also puts the yield strength S_y in the torsion term). Combining the same two terms in quadrature gives a smaller number than adding them, so the two forms are not interchangeable — check which one your design code or course expects. For the worked example on this page the linear sum gives about 30.2 mm — a 30 mm bar is about 2 % short of n = 2, so you round up to the next standard size.',
      },
    ],
    commonMistakes: [
      'Evaluating the stress on the large diameter of a shoulder. The fillet sits on the smaller shaft; use the small diameter d in σ = 32M/(πd³) and apply K_t to that nominal stress.',
      'Treating a steady transverse load as a steady bending stress. On a rotating shaft it is fully reversed, so the bending moment goes into the alternating term, not the mean.',
      'Using K_t instead of K_f in a fatigue calculation (or the reverse in a brittle static check). K_f = 1 + q(K_t − 1) accounts for notch sensitivity; mixing them up over-designs or under-designs.',
      'Taking the moment at the bearing or at the gear centre only. Draw the full bending-moment diagram in two planes, combine them vectorially, and check every shoulder, keyway and groove along the shaft — the critical section is not always the highest-moment one.',
      'Unit slips. Torque from power: T = P/ω with ω in rad/s (rpm × 2π/60). Forgetting 2π/60 is off by 9.55×. Keep N·mm with MPa, or N·m with Pa.',
      'Stopping at strength. A shaft that passes the fatigue check can still be too flexible: bearing and gear alignment need small slopes at the bearings, and the first critical (whirling) speed should sit well above the operating speed, so check deflection and natural frequency as well.',
    ],
    rulesOfThumb: [
      'Shaft diameter scales with the cube root of load: doubling both M and T raises d by only 2^(1/3) ≈ 1.26 (26 %). Diameter is cheap relative to a fatigue failure, so a modest increase buys a large margin.',
      'Generous fillets pay off: a fillet radius of about r/d ≈ 0.1 or more at a shoulder typically keeps K_t for bending down in the neighbourhood of 1.5–2, whereas a sharp corner can be far worse. Look up the exact value for your geometry in a chart rather than trusting a rule of thumb.',
      'Keep keyways and grooves out of high-moment regions, and place a stress-relief groove or generous radius where you must step.',
      'Round the computed diameter up to a standard size, then recheck deflection and bearing fit — the stock size, not the calculated one, is what gets built.',
    ],
    designChecklist: [
      'Fix the power and speed, compute torque T = P/ω, and find all gear, pulley and bearing forces on the shaft.',
      'Draw load, shear and moment diagrams in both planes; combine to the resultant moment at each section.',
      'Sketch a trial geometry with shoulders, keyways and retaining-ring grooves, and choose a material (S_ut, S_e after Marin factors).',
      'Identify the critical sections (high moment plus a stress raiser) and estimate K_t, then K_f and K_fs there.',
      'Size the diameter from the fatigue-plus-torsion equation with the required n; check the first-cycle yield (Langer-type) criterion too.',
      'Round to a standard size, then check deflections and slopes at bearings and gears, and the first critical speed.',
      'Iterate: the diameters you chose change the geometry, the stress concentrations and the weight, so loop until stable.',
    ],
    prerequisites: [
      { courseId: 'machine-design', topicId: 'fatigue-analysis', why: 'The shaft equation is the Goodman line with bending and torsion folded in.' },
      { courseId: 'mechanics-of-materials', topicId: 'torsion', why: 'Source of τ = 16T/(πd³) for a solid shaft.' },
      { courseId: 'mechanics-of-materials', topicId: 'bending-stress-beams', why: 'Source of σ = 32M/(πd³) and the moment diagrams you need first.' },
    ],
    quiz: [
      {
        kind: 'numeric',
        prompt: 'A motor delivers 15 kW at 1500 rpm through a shaft. What torque does the shaft carry?',
        answer: 95.49,
        unit: 'N·m',
        explanation: 'ω = 1500 × 2π/60 = 157.08 rad/s, so T = P/ω = 15000/157.08 ≈ 95.5 N·m. A common error is using rpm directly instead of converting to rad/s.',
      },
      {
        kind: 'numeric',
        prompt: 'That 95.49 N·m acts on a solid 25 mm shaft. What is the nominal maximum shear stress at the surface?',
        answer: 31.13,
        unit: 'MPa',
        explanation: 'τ = 16T/(πd³) = 16 × 95.49 / (π × 0.025³) ≈ 3.11 × 10⁷ Pa = 31.1 MPa. Torsional stress falls with d³, so a slightly larger diameter reduces it a lot.',
      },
      {
        kind: 'numeric',
        prompt: 'A 30 mm shaft carries an alternating bending moment of 200 N·m at a shoulder fillet with K_f = 1.6. What is the local alternating bending stress at the fillet?',
        answer: 120.7,
        unit: 'MPa',
        explanation: 'Nominal σ = 32M/(πd³) = 32 × 200/(π × 0.03³) = 75.45 MPa. The fillet raises it by K_f: 1.6 × 75.45 ≈ 120.7 MPa. That local value is what must be compared with the endurance limit.',
      },
      {
        kind: 'numeric',
        prompt: 'A material has notch sensitivity q = 0.85 and a fillet with theoretical K_t = 2.2. What is the fatigue notch factor K_f?',
        answer: 2.02,
        explanation: 'K_f = 1 + q(K_t − 1) = 1 + 0.85 × 1.2 = 2.02. Because q < 1, K_f is smaller than K_t; the material is not fully sensitive to the notch.',
      },
      {
        kind: 'numeric',
        prompt: 'With K_f, K_fs, n and the material fixed, the loads M_a and T_m are both doubled. By what factor must the required shaft diameter increase?',
        answer: 1.26,
        explanation: 'The required d³ is proportional to the loads, so doubling both multiplies d³ by 2 and d by 2^(1/3) ≈ 1.26.',
      },
      {
        kind: 'choice',
        prompt: 'A student calculates the bending stress at a shoulder fillet using the larger diameter of the two sections, because "the shaft is that big there". What is wrong?',
        options: [
          'Nothing; the larger diameter is always the correct one',
          'They should have used the average of the two diameters',
          'The fillet lies on the smaller section, which has the higher stress, so d must be the smaller diameter (with K_t applied)',
          'They should have used the bearing bore instead of either diameter',
        ],
        correct: 2,
        explanation: 'The stress concentration is at the root of the fillet, on the small-diameter side. The larger section is stiffer and less highly stressed, so using its d in 32M/(πd³) understates the nominal stress by (d_large/d_small)³ before K_t is even applied.',
      },
      {
        kind: 'choice',
        prompt: 'A rotating shaft carries a gear force that is constant in size and direction. Why is the bending stress treated as alternating?',
        options: [
          'Because gear forces always fluctuate',
          'It is not; the bending stress is always steady for a constant load',
          'Because the torque and bending moment cancel',
          'Because a given point on the surface rotates through the tension side and the compression side once per revolution, so its stress reverses',
        ],
        correct: 3,
        explanation: 'The load is fixed in space but the shaft turns. A surface fibre at the bottom is in tension, half a turn later it is on top in compression. The stress at that point is fully reversed (mean zero), which is exactly the S-N test condition and the reason bending governs fatigue.',
      },
    ],
  },
  'spring-design': {
    intuition:
      'Look closely at what happens to the wire when you push a coil spring down. The wire is not really bending as you might think; each bit of it is being twisted about its own centreline, like a torsion bar that has been wound into a helix. Compress the spring and the whole coil rotates a little at every cross-section, and the sum of all that tiny twist along many metres of wire turns into a large axial deflection. That picture explains almost everything: a thicker wire is dramatically stiffer (twist resistance goes with the fourth power of diameter), a bigger coil gives the wire a longer lever arm and a floppier spring, and more coils means more wire to twist, so softer. The peak stress is on the inside of the coil, where the wire is curved most tightly, and this is where springs crack.',
    derivation: [
      {
        text: 'A force F along the axis acts at distance D/2 (the mean coil radius) from the wire, so it twists the wire with torque T = F·D/2.',
      },
      {
        text: 'Twisting a round wire gives a shear stress τ = 16T/(πd³) at the surface. Substituting T:',
        latex: '\\tau = \\frac{16 (F D/2)}{\\pi d^3} = \\frac{8 F D}{\\pi d^3}',
      },
      {
        text: 'The twist of a wire of length L is φ = T L/(G J) with J = πd⁴/32. With N active coils the wire length is L = πD N, so:',
        latex: '\\phi = \\frac{(F D/2)(\\pi D N)}{G\\,\\pi d^4/32} = \\frac{16\\,F D^2 N}{G d^4}',
      },
      {
        text: 'Each element of twist rotates the load point about the coil axis; turning the angle into axial deflection multiplies by the lever arm D/2:',
        latex: '\\delta = \\phi\\,\\frac{D}{2} = \\frac{8 F D^3 N}{G d^4}',
      },
      {
        text: 'Stiffness is force over deflection, which gives the spring rate on the topic page:',
        latex: 'k = \\frac{F}{\\delta} = \\frac{G d^4}{8 D^3 N}',
      },
      {
        text: 'The simple torsion stress ignores two real effects: the direct shear F/A of the load carried by the wire cross-section, and the extra stress on the inner coil caused by the curvature. The Wahl factor bundles both; in terms of the spring index C = D/d it multiplies the nominal stress:',
        latex: '\\tau = K_w\\,\\frac{8 F D}{\\pi d^3}, \\qquad K_w = \\frac{4C-1}{4C-4} + \\frac{0.615}{C}',
      },
    ],
    commonMistakes: [
      'Mixing D and d. D is the mean coil diameter (centre of wire to centre of wire), not the outside diameter; using the outside diameter overstates both stiffness and stress.',
      'Counting total coils instead of active coils N. Closed, ground ends are dead coils that do not deflect; N is often total coils minus about 2 (it depends on the end type).',
      'Thinking more coils raises the stress for the same load. Stress depends on F, D and d, not N; coils only change the spring rate and the deflection at a given force.',
      'Using the Wahl or Bergsträsser factor on a static check of ductile wire without thinking. Stress concentration at the inner coil can usually be ignored for a ductile, statically loaded spring, but it matters for fatigue — apply it for any cyclic duty such as valve springs.',
      'Compressing the spring to solid height. At solid the active length vanishes and the load rises very rapidly; also check that the working deflection leaves a clash allowance (typically 10 % or more of the working deflection) before solid.',
      'Ignoring buckling and surge. A slender spring (free length much larger than D) can buckle sideways unless guided, and a spring excited near its natural frequency can surge and fail even at low average stress.',
    ],
    rulesOfThumb: [
      'Spring index C = D/d usually sits between about 4 and 12; below roughly 4 the wire is hard to wind and the Wahl factor climbs sharply, above about 12 the spring tangles and buckles easily.',
      'k ∝ d⁴: a 20 % thicker wire makes the spring roughly twice as stiff (1.2⁴ ≈ 2.07).',
      'Springs in parallel add their rates (k = k₁ + k₂); springs in series add their compliances (1/k = 1/k₁ + 1/k₂), so the combination is softer than the softest spring.',
      'Shot-peening and presetting (compressing the new spring to solid to induce favourable residual stresses) can substantially extend fatigue life — standard practice for high-cycle valve and suspension springs.',
    ],
    designChecklist: [
      'State the force-deflection requirement: working loads, working stroke, envelope (outside diameter, free length).',
      'Choose wire material and an allowable shear stress (a fraction of tensile strength, lower for cyclic duty).',
      'Pick a spring index (aim for roughly 6–10) and a trial wire diameter.',
      'Compute the number of active coils from the required rate, k = Gd⁴/(8D³N), and add dead coils for the end type.',
      'Check the shear stress with the Wahl factor at the maximum working load and at solid height.',
      'Check clash allowance, free length versus buckling, and, for cyclic loading, a fatigue check on the load swing.',
      'Specify end type, finish (peening, presetting) and tolerances; confirm the surge frequency is well above the operating frequency.',
    ],
    prerequisites: [
      { courseId: 'mechanics-of-materials', topicId: 'torsion', why: 'A coil spring is a twisted wire — the whole derivation is torsion.' },
      { courseId: 'mechanics-of-materials', topicId: 'stress-strain', why: 'The shear modulus G links shear stress to shear strain in the rate formula.' },
    ],
    quiz: [
      {
        kind: 'numeric',
        prompt: 'A compression spring has d = 2 mm, D = 16 mm, N = 8 active coils and G = 79 GPa (79 000 N/mm²). What is its spring rate?',
        answer: 4.82,
        unit: 'N/mm',
        explanation: 'k = Gd⁴/(8D³N) = 79000 × 16 / (8 × 4096 × 8) = 1 264 000 / 262 144 ≈ 4.82 N/mm.',
      },
      {
        kind: 'numeric',
        prompt: 'Keeping d, N and G the same, the mean coil diameter D is halved. By what factor does the spring rate increase?',
        answer: 8,
        explanation: 'k ∝ 1/D³, so halving D multiplies k by 2³ = 8. Coil diameter is the strongest geometric lever on stiffness after wire diameter.',
      },
      {
        kind: 'numeric',
        prompt: 'What is the Wahl factor K_w for a spring index C = 6?',
        answer: 1.2525,
        explanation: 'K_w = (4C − 1)/(4C − 4) + 0.615/C = 23/20 + 0.615/6 = 1.15 + 0.1025 = 1.2525.',
      },
      {
        kind: 'numeric',
        prompt: 'A spring has d = 2.5 mm, D = 20 mm (so C = 8, K_w = 1.184) and carries F = 100 N. What is the corrected peak shear stress?',
        answer: 386,
        unit: 'MPa',
        explanation: 'τ = K_w · 8FD/(πd³) = 1.184 × 8 × 100 × 20 / (π × 2.5³) = 1.184 × 16 000 / 49.09 ≈ 386 MPa (in N and mm the result is in MPa).',
        tolerance: 0.02,
      },
      {
        kind: 'numeric',
        prompt: 'Two springs of 4 N/mm and 6 N/mm are placed in series. What is the combined rate?',
        answer: 2.4,
        unit: 'N/mm',
        explanation: 'In series the same force goes through both and the deflections add, so 1/k = 1/4 + 1/6 = 5/12 and k = 2.4 N/mm. A series pair is always softer than the softer spring.',
      },
      {
        kind: 'choice',
        prompt: 'A student argues: "Doubling the number of active coils doubles the wire length, so for the same load the shear stress in the wire doubles." What is wrong?',
        options: [
          'Nothing — more wire means more stress',
          'The stress stays the same only if the coils are ground',
          'The stress halves because the load is shared between more coils',
          'The stress depends on F, D and d only; extra coils soften the spring (halve k) and increase deflection, but the torque in each section of wire is unchanged',
        ],
        correct: 3,
        explanation: 'Every cross-section of wire carries the same torque F·D/2 regardless of how many coils there are, so τ = 8FD/(πd³) has no N in it. Added coils add twist (and so deflection), not stress.',
      },
    ],
  },
  'bolted-joints': {
    intuition:
      'A bolt in a joint behaves like a stiff spring clamped across a very stiff stack of plates. Tightening the nut stretches the bolt a little and squeezes the plates a little, and the two forces are equal and opposite — that is the preload, and it is a force your hand put in, not one the outside world applied. Now someone pulls on the joint with an external force. The plates only need to relax by a tiny amount to stop being squeezed so hard, and the bolt only needs to stretch by that same tiny amount; because the plates are much stiffer than the bolt, most of the external pull is absorbed by the plates relaxing rather than by the bolt stretching. A well-preloaded bolt therefore sees only a small fraction of the external load, which is also why it survives fatigue when a loose one would not. The joint "opens" only when the external load is large enough to take the clamp force all the way to zero.',
    derivation: [
      {
        text: 'Model the bolt and the clamped members as two linear springs with stiffnesses k_b and k_m (axial stiffness is AE/L for each). Tightening to preload F_i stretches the bolt by F_i/k_b and compresses the members by F_i/k_m.',
      },
      {
        text: 'Apply an external tensile load P to the joint. The bolt and the members both change length by the same extra amount Δ (the bolt gets longer, the members get less compressed). The bolt load goes up and the member load goes down:',
        latex: '\\Delta F_b = k_b\\,\\Delta, \\qquad \\Delta F_m = -k_m\\,\\Delta',
      },
      {
        text: 'Equilibrium of the joint: the external load must equal the net change in force carried by bolt and members, P = ΔF_b − ΔF_m = (k_b + k_m)Δ, so Δ = P/(k_b + k_m).',
        latex: '\\Delta = \\frac{P}{k_b + k_m}',
      },
      {
        text: 'Substitute back to find the share carried by the bolt, which defines the joint constant C:',
        latex: '\\Delta F_b = \\frac{k_b}{k_b + k_m}P = C\\,P, \\qquad C = \\frac{k_b}{k_b+k_m}',
      },
      {
        text: 'Add the preload to get the actual bolt and clamp forces on the topic page:',
        latex: 'F_b = F_i + C\\,P, \\qquad F_m = F_i - (1-C)\\,P',
      },
      {
        text: 'Separation occurs when F_m = 0, which gives the load that opens the joint. Torque-preload is related empirically by T = K F_i d, with K the nut factor (roughly 0.2 for typical dry or lightly lubricated threads, but with large scatter):',
        latex: 'P_{sep} = \\frac{F_i}{1 - C}, \\qquad T \\approx K\\,F_i\\,d',
      },
    ],
    commonMistakes: [
      'Adding the external load to the preload: F_b = F_i + P. Only the fraction C of P goes to the bolt (here, 0.25·20 = 5 kN of the 20 kN), so this overestimates bolt load and misses the real benefit of preloading.',
      'Treating torque as an accurate way to set preload. T = K F_i d has a large scatter (lubrication, thread condition, surface finish, re-use) so achieved preload can be off by ±25 % or worse; critical joints use torque-plus-angle, tension indication or direct stretch measurement.',
      'Forgetting that an under-preloaded joint shares load differently. If preload is lost (embedment, relaxation, gasket creep, thermal growth), the bolt can see a larger fatigue swing and the joint can separate at a lower load.',
      'Applying the standard C formula to a joint with a soft gasket. Compressible gaskets make k_m low, so C rises, the bolt takes a larger share of the external load, and the clamp force falls off fast; use the gasket-specific stiffness.',
      'Checking only static strength. Preloaded bolts fail by fatigue at the first thread root or head-to-shank fillet, so the alternating stress (C·P/2A_t for a 0 to P load) and mean stress (near the preload stress) must go through a Goodman check.',
      'Ignoring shear and prying. These formulas are for axial external loads through the bolt line; a load applied off-axis produces prying, extra bending in the bolt and a larger effective load. Shear loads should be carried by friction or by dowels, not by the bolt threads.',
    ],
    rulesOfThumb: [
      'For a typical steel joint, C is roughly 0.2–0.3 (stiff members, compliant bolt). Longer and thinner bolts, and stiffer plates, push C lower — good for fatigue.',
      'Preload for permanent joints is often specified at about 75 %–90 % of the proof load; use the lower end for reusable joints (the topic page uses 0.75 F_p for reused).',
      'A pre-tensioned bolt is "stiff" to the outside world as long as the clamp force stays positive: the external load changes bolt force by only C·P.',
      'For good fatigue behaviour, make the joint long and the preload high; shortening grip length or using a stiffer bolt increases C and the alternating stress.',
    ],
    designChecklist: [
      'Establish external loads (axial, shear, moment) on the joint and how they cycle; locate the bolt pattern.',
      'Choose bolt size and property class, and compute the tensile stress area A_t and proof load F_p.',
      'Decide preload F_i (about 0.75 F_p reused, higher for permanent joints) and the tightening method.',
      'Compute k_b and k_m (or use a published C) and the joint constant C.',
      'Compute F_b = F_i + C·P and F_m = F_i − (1 − C)·P; check the factor of safety against joint separation.',
      'Check static strength against proof load and run a Goodman fatigue check on the bolt using the alternating load C·P/2.',
      'Check shear, bearing, prying and thread-stripping where relevant; set a tightening procedure and a re-torque or inspection plan.',
    ],
    prerequisites: [
      { courseId: 'machine-design', topicId: 'fatigue-analysis', why: 'Bolt failures are mostly fatigue; the preload sets the mean stress and C·P the swing.' },
      { courseId: 'mechanics-of-materials', topicId: 'stress-strain', why: 'Axial stiffness AE/L of the bolt and members, and proof strength, start here.' },
    ],
    videos: [
      {
        id: 'XLzTB4KLCxU',
        title: 'The Incredible Strength of Bolted Joints',
        channel: EE,
        why: 'Matches this topic directly: how bolted joints carry load.',
      },
    ],
    quiz: [
      {
        kind: 'numeric',
        prompt: 'A bolt has axial stiffness k_b = 400 MN/m and the clamped members have k_m = 1200 MN/m. What is the joint constant C?',
        answer: 0.25,
        explanation: 'C = k_b/(k_b + k_m) = 400/(400 + 1200) = 0.25. The stiff members absorb 75 % of any external load.',
      },
      {
        kind: 'numeric',
        prompt: 'With preload F_i = 30 kN and C = 0.25, an external tensile load P = 20 kN is applied. What is the bolt load?',
        answer: 35,
        unit: 'kN',
        explanation: 'F_b = F_i + C·P = 30 + 0.25 × 20 = 35 kN. Only 5 kN of the 20 kN is added to the bolt; the rest relieves the clamp force.',
      },
      {
        kind: 'numeric',
        prompt: 'For the same joint (F_i = 30 kN, C = 0.25), what external load P makes the clamp force reach zero (joint separation)?',
        answer: 40,
        unit: 'kN',
        explanation: 'F_m = F_i − (1 − C)P = 0 gives P = F_i/(1 − C) = 30/0.75 = 40 kN. Beyond this the plates lift apart and the bolt carries the entire external load.',
      },
      {
        kind: 'numeric',
        prompt: 'A bolt with an M12 thread (d = 12 mm) is tightened to F_i = 30 kN with nut factor K = 0.2. What tightening torque does T = K·F_i·d call for?',
        answer: 72,
        unit: 'N·m',
        explanation: 'T = K F_i d = 0.2 × 30 000 N × 0.012 m = 72 N·m. K = 0.2 is a typical value, and the real preload from this torque could easily vary by ±25 % or more.',
      },
      {
        kind: 'numeric',
        prompt: 'The external load cycles between 0 and P = 20 kN (C = 0.25, A_t = 84.3 mm²). What is the alternating stress amplitude in the bolt?',
        answer: 29.66,
        unit: 'MPa',
        explanation: 'The bolt force swings between F_i and F_i + C·P, a range of C·P = 5 kN. The amplitude is half that, 2.5 kN, so σ_a = 2500/84.3 ≈ 29.7 MPa. The preload only shifts the mean stress.',
      },
      {
        kind: 'choice',
        prompt: 'A student finds the bolt load as F_i + P = 30 + 20 = 50 kN for a preloaded joint with C = 0.25. What is wrong?',
        options: [
          'Nothing; the bolt carries the full external load',
          'The bolt carries less than the preload',
          'Only the fraction C of the external load goes to the bolt: F_b = F_i + C·P = 35 kN',
          'The external load should be subtracted: 30 − 20 = 10 kN',
        ],
        correct: 2,
        explanation: 'Preload means the plates are already squeezed. External load mostly relieves that squeeze, and the bolt only stretches by the same small amount as the plates relax. The result is F_b = F_i + C·P = 35 kN. The "full load" assumption is the classic reason students think preloading cannot help fatigue.',
      },
    ],
  },
  'bearing-selection': {
    intuition:
      'Inside a rolling bearing every ball or roller presses against the race over a tiny contact patch, and the stress there is enormous even at modest loads. Each time a rolling element passes over a point on the race, that point sees one stress cycle; after millions of passes, microscopic cracks form just below the surface and eventually flake off a piece of metal (spalling). This is a fatigue failure, and like all fatigue it is statistical: bearings that look identical, run side by side, will fail at wildly different times. So instead of promising a single life, we quote the L10 life — the number of revolutions that 90 % of a batch will survive. And because contact stress and fatigue life are so steeply related to load, the life drops very fast as the load goes up: the cube of the load for balls.',
    derivation: [
      {
        text: 'Define the catalogue dynamic load rating C as the constant radial load a bearing can carry for exactly one million revolutions with 90 % reliability. This is the reference point everything else is scaled from.',
      },
      {
        text: 'For point contact (balls) the Hertz contact stress grows roughly as the cube root of the load, σ_c ∝ P^(1/3). Rolling-contact fatigue life falls very steeply with stress — empirically on the order of σ_c⁻⁹ — so life scales as',
        latex: 'L \\propto \\sigma_c^{-9} \\propto \\left(P^{1/3}\\right)^{-9} = P^{-3}',
      },
      {
        text: 'Scaling from the reference point (load C, one million revolutions) to an actual load P gives the L10 life in millions of revolutions. For ball bearings k = 3; line contact in roller bearings gives a slightly smaller stress-sensitivity and k = 10/3:',
        latex: 'L_{10} = \\left(\\frac{C}{P}\\right)^{k}',
      },
      {
        text: 'Convert revolutions to hours. At n rpm the shaft makes 60n revolutions per hour:',
        latex: 'L_{10h} = \\frac{L_{10}\\times 10^6}{60\\,n}',
      },
      {
        text: 'The load P in these formulas must be a single equivalent radial load that has the same fatigue effect as the actual combined radial and axial loading. It comes from the bearing manufacturer’s factors X and Y (which depend on the axial-to-radial ratio and the bearing type):',
        latex: 'P = X\\,V\\,F_r + Y\\,F_a',
      },
      {
        text: 'The scatter is described by a Weibull distribution of lives. L10 is the 10 % failure point; for other reliabilities multiply by a life-adjustment factor a₁ < 1 (published in catalogues). The median life is typically several times the L10, which is why an individual bearing may well outlast its L10 — and why nothing about L10 is a guarantee.',
      },
    ],
    commonMistakes: [
      'Reading L10 as a guaranteed life. It is the life that 90 % survive; 10 % fail earlier. For safety-critical applications use a higher-reliability life (adjusted with a₁) or design with a much larger C.',
      'Using the exponent for the wrong bearing. k = 3 for ball bearings and k = 10/3 for roller bearings. Using 3 for rollers understates the sensitivity to load.',
      'Using the radial load alone when thrust exists. Ignoring the axial component (P = XVF_r + YF_a) badly overstates life for angular-contact and tapered bearings.',
      'Forgetting that life in hours depends on speed: L10h = L10·10⁶/(60n). If you double the speed at a fixed load, the revolutions are unchanged but the hours are halved.',
      'Assuming the rated life applies in poor conditions. L10 presumes clean, adequate lubrication, correct fit and alignment, and moderate temperature. Contamination, misalignment, brinelling from shock loads or overheating shorten life far more than the formula suggests; many real bearing failures are not fatigue at all.',
      'Averaging a fluctuating load arithmetically. Because life goes as the load cubed, peaks matter far more than the mean; use the cubic-mean (or sum the damage over each load level) for the equivalent load.',
    ],
    rulesOfThumb: [
      'Ball bearings: life ∝ P⁻³, so +26 % in load roughly halves the life, and +10 % costs about a quarter of it (1.1³ ≈ 1.33).',
      'Doubling the load for a ball bearing cuts life by 8×; for a roller bearing by about 10×.',
      'The typical (median) bearing outlives L10 by a large factor — a commonly quoted figure is about five times — but design to L10 or better for the reliability you need, not to the median.',
      'Bearing manufacturers publish a recommended L10h range by application (for example, a few thousand hours for intermittent use and tens of thousands for continuous industrial machinery); take the range from the catalogue for your machine class.',
    ],
    designChecklist: [
      'Establish radial and axial loads on each bearing from the shaft free-body diagram (see shaft design).',
      'Choose the bearing type (deep-groove, angular-contact, cylindrical or tapered roller) from the load direction, speed and stiffness needs.',
      'Compute the equivalent load P = XVF_r + YF_a, and use a load-spectrum average if the load varies.',
      'Fix a life target (hours and reliability) from the application and convert to millions of revolutions.',
      'Calculate the required C = P·(L10)^(1/k) and pick a catalogue bearing with at least that rating.',
      'Check static load rating, limiting speed, lubrication method and operating temperature.',
      'Design the shaft and housing fits, preload and sealing, and plan for lubrication and maintenance.',
    ],
    prerequisites: [
      { courseId: 'machine-design', topicId: 'fatigue-analysis', why: 'Rolling-contact fatigue is fatigue; the statistical idea behind L10 comes from here.' },
      { courseId: 'machine-design', topicId: 'shaft-design', why: 'The shaft free-body diagram is what gives you the bearing loads.' },
    ],
    quiz: [
      {
        kind: 'numeric',
        prompt: 'A cylindrical roller bearing has C = 30 kN and carries an equivalent load P = 6 kN. What is its L10 life in millions of revolutions?',
        answer: 213.7,
        unit: 'million rev',
        explanation: 'For rollers k = 10/3: L10 = (30/6)^(10/3) = 5^(3.333) ≈ 213.7 million revolutions. Using the ball exponent 3 would give 125 and understate the life.',
        tolerance: 0.02,
      },
      {
        kind: 'numeric',
        prompt: 'A ball bearing has C = 40 kN and P = 10 kN, running at 1500 rpm. What is the L10 life in hours?',
        answer: 711,
        unit: 'h',
        explanation: 'L10 = (40/10)³ = 64 million revolutions. L10h = 64×10⁶/(60 × 1500) = 64×10⁶/90 000 ≈ 711 hours.',
      },
      {
        kind: 'numeric',
        prompt: 'A ball bearing is designed for a certain life, but the real load turns out 20 % higher. What fraction of the design life remains?',
        answer: 0.579,
        explanation: 'Life scales as P⁻³, so the ratio is 1/1.2³ = 1/1.728 ≈ 0.579. A 20 % overload costs about 42 % of the life.',
      },
      {
        kind: 'numeric',
        prompt: 'A ball bearing must carry P = 4 kN for 500 million revolutions (L10). What minimum dynamic rating C is required?',
        answer: 31.75,
        unit: 'kN',
        explanation: 'From L10 = (C/P)³, C = P·L10^(1/3) = 4 × 500^(1/3) = 4 × 7.937 ≈ 31.7 kN. In practice you would pick the next standard catalogue size above this.',
      },
      {
        kind: 'choice',
        prompt: 'A catalogue says a bearing has an L10 life of 10 000 hours. A student concludes that it will "definitely last 10 000 hours". What is wrong?',
        options: [
          'L10 is the life that 90 % of identical bearings reach; about 10 % fail earlier, so it is not a guarantee for a single bearing',
          'Nothing; L10 is the guaranteed minimum life',
          'L10 means 10 % of the bearing will have worn away by that time',
          'L10 applies only to the first 10 hours of running',
        ],
        correct: 0,
        explanation: 'Bearing life is a statistical distribution because rolling-contact fatigue starts from random microscopic flaws. L10 is the 10th percentile: 90 % survive at least that long. A reliability-adjusted life or a larger rating is needed if a single failure is unacceptable.',
      },
      {
        kind: 'choice',
        prompt: 'The shaft speed is doubled with the load unchanged. What happens to the L10 life?',
        options: [
          'The life in millions of revolutions halves, hours unchanged',
          'Neither changes; speed is not in the formula',
          'The life in hours quadruples',
          'The life in revolutions is unchanged, but the life in hours halves',
        ],
        correct: 3,
        explanation: 'L10 = (C/P)^k depends only on the load ratio, so the number of revolutions is the same. In hours, L10h = L10·10⁶/(60n); doubling n halves it. (Real bearings also have speed limits and lubrication effects the formula ignores.)',
      },
    ],
  },
  'gear-tooth-bending': {
    intuition:
      'Think of a gear tooth as a short, stubby diving board bolted to the rim of the gear, with the mating tooth pushing down near the tip. The base of that diving board is where the bending stress is highest, and that is where fatigue cracks start — tooth breakage is nearly always a root failure, on the tension side of the tooth. Make the tooth thicker at the root (a coarser pitch) or wider along the shaft (a bigger face width) and it carries more; push harder (more torque) or give the same force a longer lever arm and it breaks sooner. Lewis in 1892 captured exactly this with a beam model: stress is the tangential force divided by the root area, adjusted by a shape factor that depends on how many teeth the gear has.',
    derivation: [
      {
        text: 'The tangential force that the mating tooth exerts on the pitch circle follows from torque and pitch radius (d/2). Only the tangential component transmits power; the radial component compresses the tooth and is neglected in the basic Lewis form:',
        latex: 'W^t = \\frac{T}{d/2} = \\frac{2T}{d}, \\qquad d = \\frac{N}{P_d}',
      },
      {
        text: 'Model the tooth as a cantilever with a rectangular section of width F (face width) and thickness t at the critical section, loaded at distance l from that section. The bending stress at the root is M c / I:',
        latex: '\\sigma = \\frac{(W^t l)(t/2)}{F t^3/12} = \\frac{6\\,W^t\\,l}{F\\,t^2}',
      },
      {
        text: 'Lewis noticed the critical section is where an inscribed parabola of uniform strength touches the tooth profile; its dimensions satisfy t² = 4 l x, where x is a tooth dimension. Eliminate l:',
        latex: '\\sigma = \\frac{6\\,W^t l}{F\\,(4 l x)} = \\frac{3\\,W^t}{2\\,F\\,x}',
      },
      {
        text: 'Introduce the dimensionless Lewis form factor y = 2x/(3p) with circular pitch p = π/P_d. The stress becomes:',
        latex: '\\sigma = \\frac{W^t}{F\\,y\\,p} = \\frac{W^t P_d}{F\\,\\pi y}',
      },
      {
        text: 'Define Y = πy (this is the tabulated form factor, e.g. Y = 0.322 for 20 teeth at 20° pressure angle). The Lewis equation on the topic page follows:',
        latex: '\\sigma = \\frac{W^t P_d}{F\\,Y}',
      },
      {
        text: 'Real gears see additional dynamic loading as teeth come into contact. The velocity factor K_v multiplies the stress; with V the pitch-line velocity in ft/min, V = π d n/12, and the topic page uses K_v = (1200 + V)/1200, the form for cut or milled teeth (hobbed or shaped teeth use (78 + √V)/78). Modern design (AGMA/ISO) replaces this with further factors for overload, size, load distribution and geometry.',
        latex: '\\sigma = K_v\\,\\frac{W^t P_d}{F\\,Y}',
      },
    ],
    commonMistakes: [
      'Mixing unit systems. The form W^t P_d/(F Y) is for US units (lbf, in, teeth/in). In SI, use the module m (mm) instead: σ = W^t/(F m Y) with W^t in N and F, m in mm. Mixing P_d with SI loads is a common error.',
      'Assuming stronger teeth just because Y is larger. At a fixed pitch diameter, more teeth means a larger diametral pitch (smaller teeth), and the tooth gets thinner far faster than Y increases — stress rises. Compare σ ∝ P_d/Y, not Y alone.',
      'Using the tabulated Y for the wrong pressure angle or tooth count. Y depends on both; a 25° pressure angle, for example, gives a stronger tooth shape than 14.5° at the same tooth count.',
      'Believing Lewis covers all failure. It is the bending check only. Gears also fail by surface pitting (contact fatigue), scoring and wear, and these often govern the design. The AGMA procedure checks both bending and contact stress.',
      'Treating the full load as always on one tooth tip. Lewis assumes the full load at the tooth tip, which is conservative for contact ratios above 1; but dynamic overloads, misalignment and uneven load across the face width can make the real peak worse than the simple equation says.',
      'Using the nominal torque rather than the peak. Starting torques and shock loads can be several times the rated torque; apply an overload or application factor.',
    ],
    rulesOfThumb: [
      'Tooth-root stress is proportional to transmitted torque (at fixed geometry) and inversely proportional to face width: double F, halve σ.',
      'A common sizing rule for first estimates is a face width of roughly 3–5 times the circular pitch (about 9–16/P_d); too wide and misalignment concentrates the load on one end.',
      'Tooth counts below about 17–18 on a 20° pressure-angle spur gear lead to undercut at the root; this weakens the tooth, so avoid it or use profile shift.',
      'For first-pass checks, remember that bending strength is not the only constraint: for hardened gears, surface contact stress frequently governs the size.',
    ],
    designChecklist: [
      'Fix power, speed and ratio; compute the transmitted torque and apply an application (overload) factor.',
      'Choose tooth count and diametral pitch (or module) so that d = N/P_d meets the size envelope; avoid undercutting.',
      'Compute W^t = 2T/d and the pitch-line velocity V.',
      'Read the Lewis form factor Y for the tooth count and pressure angle, then compute the root stress with the velocity (dynamic) factor.',
      'Compare with an allowable bending strength derived from the gear material and heat treatment, with a fatigue factor of safety.',
      'Check surface (contact) stress as well — it often governs.',
      'Refine with the full AGMA/ISO factors, and check the shaft, bearing and mounting for alignment.',
    ],
    prerequisites: [
      { courseId: 'mechanics-of-materials', topicId: 'bending-stress-beams', why: 'The Lewis equation is the flexure formula applied to a cantilever tooth.' },
      { courseId: 'machine-design', topicId: 'fatigue-analysis', why: 'Tooth-root breakage is a fatigue failure; the stress you compute is the fatigue input.' },
    ],
    videos: [
      {
        id: 'JnYVz1TSmBQ',
        title: 'How Levers, Pulleys and Gears Work',
        channel: EE,
        why: 'General background on how gears work; not specific to tooth bending.',
      },
    ],
    quiz: [
      {
        kind: 'numeric',
        prompt: 'A spur gear has N = 24 teeth and diametral pitch P_d = 6 teeth/in. What is its pitch diameter?',
        answer: 4,
        unit: 'in',
        explanation: 'Diametral pitch is teeth per inch of pitch diameter, so the pitch diameter is d = N/P_d = 24/6 = 4 in. Two gears can only mesh if they share the same P_d (the same tooth size), which is why P_d, not diameter, is the number you match when choosing a mating gear.',
      },
      {
        kind: 'numeric',
        prompt: 'That gear transmits a torque of 1200 lbf·in. What is the tangential tooth load?',
        answer: 600,
        unit: 'lbf',
        explanation: 'W^t = 2T/d = 2 × 1200/4 = 600 lbf. The force acts at the pitch radius d/2 = 2 in, and 600 × 2 = 1200 lbf·in.',
      },
      {
        kind: 'numeric',
        prompt: 'Use W^t = 600 lbf, P_d = 6 teeth/in, face width F = 1.5 in and Lewis form factor Y = 0.337. What is the root bending stress (no velocity factor)?',
        answer: 7122,
        unit: 'psi',
        explanation: 'σ = W^t P_d/(F Y) = 600 × 6/(1.5 × 0.337) = 3600/0.5055 ≈ 7122 psi.',
      },
      {
        kind: 'numeric',
        prompt: 'The same 4 in pitch-diameter gear runs at 600 rpm. Using K_v = (1200 + V)/1200 with V = πdn/12 in ft/min, what is K_v?',
        answer: 1.524,
        explanation: 'V = π × 4 × 600/12 ≈ 628.3 ft/min, so K_v = (1200 + 628.3)/1200 ≈ 1.524. The dynamic factor adds about 52 % to the stress at this speed.',
      },
      {
        kind: 'numeric',
        prompt: 'Two gears of the same 2.5 in pitch diameter carry the same torque, one with 20 teeth (P_d = 8, Y = 0.322) and one with 40 teeth (P_d = 16, Y = 0.389). By what factor is the root stress higher on the 40-tooth gear?',
        answer: 1.656,
        explanation: 'With the same d, torque and face width, W^t and F are the same, so σ ∝ P_d/Y. The ratio is (16/0.389)/(8/0.322) = 41.13/24.84 ≈ 1.66. A finer pitch means smaller, weaker teeth; the improved Y does not compensate.',
      },
      {
        kind: 'choice',
        prompt: 'A student reasons: "My gear is overstressed, so I will keep the same pitch diameter but use more teeth, because Y gets larger and larger Y means lower stress." What is wrong?',
        options: [
          'At fixed pitch diameter, more teeth means a larger P_d and thinner teeth; the rise in P_d outweighs the gain in Y, so stress goes up',
          'Nothing; more teeth always lowers the stress',
          'Y does not depend on tooth count',
          'More teeth reduces the face width automatically',
        ],
        correct: 0,
        explanation: 'In σ = W^t P_d/(F Y) the diametral pitch appears in the numerator. Going from 20 to 40 teeth at the same d doubles P_d while Y rises by only about 21 %, so stress rises by roughly 66 %. To lower stress, use a coarser pitch (fewer, bigger teeth), a wider face or a stronger material.',
      },
      {
        kind: 'choice',
        prompt: 'Which failure mode does the Lewis bending equation not address?',
        options: [
          'Fatigue crack at the tooth root',
          'Single-overload tooth breakage',
          'Surface pitting from contact stress between mating teeth',
          'Bending of the tooth as a cantilever',
        ],
        correct: 2,
        explanation: 'Lewis models the tooth as a cantilever and gives the root bending stress. Pitting is a contact-fatigue failure driven by Hertzian stress on the flank, calculated separately (for example in the AGMA procedure) and often the governing limit for hardened gears.',
      },
    ],
  },
  'belt-chain-drives': {
    intuition:
      'Wrap a rope around a post and let a small child hold the free end. You can hold back a heavy load with almost no effort, because the friction between rope and post builds up around the wrap: each little bit of rope grips the post and relieves the one behind it. A belt on a pulley is exactly this capstan. A belt transmits power because the tight side is pulled harder than the slack side, and the difference (T1 − T2) is what actually turns the pulley. The friction can only support a tension ratio of e^(μθ); wrap the belt around more of the pulley, or use a grippier belt, and the allowable ratio climbs exponentially. Ask for more than that and the belt just slips — it does not slow down gracefully. A chain has no such limit: its links physically mesh with the sprocket teeth, so it transmits power positively, and the limits become link strength, wear and fatigue.',
    derivation: [
      {
        text: 'Take a small element of belt spanning an angle dθ on the pulley, with tension T on one side and T + dT on the other. The pulley pushes back with a normal force N; neglect belt mass (centrifugal effects) for now.',
      },
      {
        text: 'Balance forces perpendicular to the belt element. The two tensions each have a small inward component of about T·dθ/2, so:',
        latex: 'N = T\\,d\\theta',
      },
      {
        text: 'Balance forces along the belt. The tension increment is carried by friction at the point of slipping, dT = μN:',
        latex: 'dT = \\mu\\,N = \\mu\\,T\\,d\\theta \\;\\Rightarrow\\; \\frac{dT}{T} = \\mu\\,d\\theta',
      },
      {
        text: 'Integrate over the whole wrap angle θ, from the slack side T2 to the tight side T1. This is the capstan equation on the topic page:',
        latex: '\\ln\\frac{T_1}{T_2} = \\mu\\theta \\;\\Rightarrow\\; \\frac{T_1}{T_2} = e^{\\mu\\theta}',
      },
      {
        text: 'The net force turning the pulley is the tension difference acting at belt speed v, so the transmitted power is below. For an open belt, v = ω₁r₁ = ω₂r₂ (no slip), which gives the speed ratio N₂/N₁ = d₁/d₂:',
        latex: 'P = (T_1 - T_2)\\,v',
      },
      {
        text: 'For a V-belt the wedge action raises the effective friction. With groove angle β the normal force on each flank is larger by 1/sin(β/2), so μ is replaced by μ/sin(β/2). At high belt speed a centrifugal tension T_c = m′v² reduces the grip: the capstan ratio then applies to the tensions minus T_c.',
        latex: '\\frac{T_1 - T_c}{T_2 - T_c} = e^{\\mu\\theta/\\sin(\\beta/2)}',
      },
    ],
    commonMistakes: [
      'Computing power as T1·v. Only the difference T1 − T2 does useful work; the slack-side tension and the preload are not delivering power.',
      'Using degrees in e^(μθ). θ must be in radians (180° = π, not 180). With degrees the exponent is absurdly large.',
      'Using the wrong pulley for the wrap angle. The belt slips first on the pulley with the smaller wrap angle — usually the small one for an open drive — so use that angle.',
      'Forgetting that a V-belt needs the wedge factor: μ_eff = μ/sin(β/2), not μ. And forgetting the belt can bottom in the groove and lose the wedge effect once the sides wear.',
      'Ignoring centrifugal tension. At high belt speeds (very roughly above 20 m/s for flat belts) the belt’s own weight pulls it away from the pulley, reducing the power it can carry and eventually reducing it to zero at a limiting speed.',
      'Assuming a chain drive has a constant speed ratio at the shaft. Chain wraps polygon-wise around the sprocket, so the chain speed varies a little each link (chordal action); at high speed and with small sprockets this causes vibration and noise. Also, a chain needs lubrication and tensioning; a slack chain can jump a tooth.',
    ],
    rulesOfThumb: [
      'The tension ratio depends exponentially on μθ: with μ = 0.3 and a 180° wrap, T1/T2 ≈ 2.6; with μ = 0.35, about 3.0.',
      'Doubling μ squares the tension ratio (e^(2μθ) = (e^(μθ))²), a far bigger effect than the "factor of two" intuition suggests.',
      'Small wrap angles on the small pulley (below roughly 120°–150°) are a red flag for slipping; use an idler or increase the centre distance.',
      'Chains tolerate high load at low speed; belts are quieter, cheaper and forgiving of misalignment but need higher speed to carry power. Chains are preferred when a fixed speed ratio matters (timing belts also meet this need).',
    ],
    designChecklist: [
      'Fix power, speed and speed ratio; choose a drive type (flat, V, synchronous belt or chain) for the duty, environment and ratio accuracy.',
      'Select pulley or sprocket sizes, respecting minimum pulley diameters, and compute the centre distance and belt length.',
      'Compute the wrap angle on the small pulley and the effective friction coefficient (with the V-belt wedge factor if applicable).',
      'Compute the belt speed, effective tension T1 − T2 = P/v, and the tension ratio e^(μθ); solve for T1 and T2.',
      'Include centrifugal tension and a service factor for shock or start-up loads.',
      'Check belt rating, fatigue life, pulley bending stress and the bearing load, which is roughly T1 + T2 on the shaft.',
      'Specify initial tension and a tensioning method; check that the belt can run without slipping at the maximum load.',
    ],
    prerequisites: [
      { courseId: 'engineering-statics', topicId: 'statics-friction', why: 'The capstan equation is friction on a curved surface, built from the Coulomb friction law.' },
      { courseId: 'engineering-statics', topicId: 'statics-equilibrium', why: 'The derivation is a force balance on a belt element.' },
    ],
    videos: [
      {
        id: 'JnYVz1TSmBQ',
        title: 'How Levers, Pulleys and Gears Work',
        channel: EE,
        why: 'General background on pulleys and speed ratios; not specific to belt friction.',
      },
    ],
    quiz: [
      {
        kind: 'numeric',
        prompt: 'A belt wraps 180° around a pulley with μ = 0.35. What is the maximum tension ratio T1/T2 before slipping?',
        answer: 3.003,
        explanation: 'θ = π rad, so e^(μθ) = e^(0.35π) = e^1.0996 ≈ 3.00. Using 180 instead of π is a classic slip.',
      },
      {
        kind: 'numeric',
        prompt: 'Open belt, d1 = 100 mm, d2 = 300 mm, centre distance C = 500 mm. What is the wrap angle on the small pulley, in degrees?',
        answer: 156.9,
        unit: 'deg',
        explanation: 'θ = π − 2·asin((d2 − d1)/(2C)) = π − 2·asin(200/1000) = π − 2(0.2014) = 2.739 rad = 156.9°. The small pulley has the smaller wrap and so limits the drive.',
      },
      {
        kind: 'numeric',
        prompt: 'A drive has T1 = 600 N and T2 = 200 N at a belt speed of 10 m/s. What power does it transmit?',
        answer: 4000,
        unit: 'W',
        explanation: 'P = (T1 − T2)·v = 400 N × 10 m/s = 4000 W. Using T1·v would give 6000 W, over-counting by the 200 N slack-side tension.',
      },
      {
        kind: 'numeric',
        prompt: 'A flat belt has a tension ratio of 2.5 at μ = 0.25. If the friction coefficient doubles to 0.5 (same wrap), what is the new maximum tension ratio?',
        answer: 6.25,
        explanation: 'e^(μθ) = 2.5 at μ = 0.25, so e^(2μθ) = 2.5² = 6.25. Doubling μ squares the ratio, it does not just double it.',
      },
      {
        kind: 'numeric',
        prompt: 'A V-belt with groove angle β = 40° runs on a material with μ = 0.3. What is the effective friction coefficient μ/sin(β/2)?',
        answer: 0.877,
        explanation: 'sin(20°) = 0.342, so μ_eff = 0.3/0.342 ≈ 0.877. The wedge action nearly triples the effective friction, which is why V-belts carry more power than flat belts of the same size.',
      },
      {
        kind: 'choice',
        prompt: 'A student says: "The belt carries a tight-side tension T1 = 500 N at 13.7 m/s, so it transmits P = T1·v = 6.85 kW." What is wrong?',
        options: [
          'The useful force is the tension difference, so P = (T1 − T2)v; the slack-side tension must be subtracted',
          'Nothing; the tight side delivers all the power',
          'The speed should be in rpm, not m/s',
          'They should have used the sum T1 + T2 instead',
        ],
        correct: 0,
        explanation: 'Both sides pull on the pulley, but in opposite senses around the axis; the net torque comes only from T1 − T2. With T2 = 216 N the power is (500 − 216) × 13.7 ≈ 3.9 kW, much less than 6.85 kW.',
      },
      {
        kind: 'choice',
        prompt: 'Why can a chain drive transmit power without a capstan-type slip limit?',
        options: [
          'Chains have a higher coefficient of friction than belts',
          'Chains stretch so they do not slip',
          'Chains are always preloaded to more than the tight-side tension',
          'Chain links mesh positively with the sprocket teeth, so power is carried by tooth engagement, not by friction',
        ],
        correct: 3,
        explanation: 'A belt relies on friction, which is limited by e^(μθ). A chain locks into the sprocket tooth space, so there is no slipping; its capacity is limited instead by link and pin strength, wear, fatigue and lubrication.',
      },
    ],
  },
}
