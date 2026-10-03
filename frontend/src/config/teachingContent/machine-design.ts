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
}
