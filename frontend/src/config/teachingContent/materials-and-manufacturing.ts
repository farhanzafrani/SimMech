import type { TeachingContent } from '../teachingTypes'
import { EE } from '../teachingTypes'

/** Materials & Manufacturing (2.008) teaching content. */
export const CONTENT: Record<string, TeachingContent> = {
  'metal-cutting': {
    intuition:
      'Push a spatula into a block of cold butter and watch the butter curl up in front of it. A cutting tool does the same thing to steel, only much faster and with far more force: a thin layer of metal is not "sliced" but sheared along a narrow plane running from the tool tip up to the surface, and the sheared material then slides up the tool face as a chip. Two things fight you. The metal must be sheared (that cost depends on the material strength and the area of the shear plane), and the chip must slide against the tool (that cost is friction). A sharp, positive-rake tool and good lubrication tip the geometry so the shear plane is shorter, the chip is thinner, and the force falls. Separately from the forces, the tool itself is being worn away by heat and rubbing, and wear is brutally sensitive to speed: a modest increase in cutting speed can halve the life of an insert. That is why machining is always a trade between cutting fast and changing tools often.',
    derivation: [
      {
        text: 'Orthogonal cutting geometry. The tool removes a layer of uncut thickness t₀ and the chip leaves with thickness t_c. With shear angle φ and rake angle α, the shear-plane length gives the chip ratio, which is below 1 because the chip is always thicker than the layer it came from:',
        latex: 'r = \\frac{t_0}{t_c} = \\frac{\\sin\\phi}{\\cos(\\phi-\\alpha)}',
      },
      {
        text: 'The shear force acts along a plane of area (t₀ w)/sin φ, where w is the width of cut. It is simply the work-material shear strength times that area:',
        latex: 'F_s = \\frac{\\tau_s\\, t_0\\, w}{\\sin\\phi}',
      },
      {
        text: 'Merchant’s force circle treats the tool force as one resultant R. R can be resolved along the shear plane (Fs), along the rake face (friction) or along and across the cutting direction. Using the friction angle β (tan β = μ), the shear component of R is R cos(φ + β − α), so:',
        latex: 'R = \\frac{F_s}{\\cos(\\phi+\\beta-\\alpha)}',
      },
      {
        text: 'Projecting R onto the cutting direction gives the cutting force Fc (the one that does the work) and onto the perpendicular gives the thrust Ft:',
        latex: 'F_c = R\\cos(\\beta-\\alpha),\\qquad F_t = R\\sin(\\beta-\\alpha)',
      },
      {
        text: 'Nature picks the shear angle that makes the cut easiest. Write Fc in terms of φ and ask where it is smallest; setting the derivative to zero gives cos(2φ + β − α) = 0, i.e. 2φ + β − α = 90°. This is the Merchant relation:',
        latex: 'F_c = \\frac{\\tau_s t_0 w\\cos(\\beta-\\alpha)}{\\sin\\phi\\,\\cos(\\phi+\\beta-\\alpha)} \\;\\Rightarrow\\; \\phi = 45^\\circ + \\frac{\\alpha}{2} - \\frac{\\beta}{2}',
      },
      {
        text: 'Only the cutting force acts along the velocity, so power is P = Fc V. Dividing by the volume removal rate t₀ w V gives specific cutting energy u = Fc/(t₀ w), a handy material property for sizing motors.',
        latex: 'P_c = F_c V,\\qquad u = \\frac{F_c}{t_0 w}',
      },
      {
        text: 'Tool wear has no first-principles equation at this level. Taylor found empirically that over a useful range, life T falls as a power law of speed. The exponent n is a property of the tool–work pair:',
        latex: 'V\\,T^{n} = C \\;\\Rightarrow\\; T = \\left(\\frac{C}{V}\\right)^{1/n}',
      },
    ],
    commonMistakes: [
      'Mixing units in power. Fc in newtons and V in m/min gives N·m/min, not watts. Convert V to m/s (divide by 60) before multiplying, or divide the result by 60 000 to get kW.',
      'Using the thrust force in the power calculation. Ft is perpendicular to the cutting velocity (to first order, the tool does not move in that direction), so it does no work. Only Fc contributes to Pc.',
      'Confusing the rake angle α, the friction angle β and the shear angle φ. The Merchant relation uses α and β to find φ, and the angle combination in the force equations is (β − α), not (α − β). A negative-rake tool has a negative α.',
      'Using the Merchant relation as an exact law. It comes from a minimum-energy argument and fits some materials well and others poorly; treat φ as an estimate and the force as a first-pass prediction, not a guarantee.',
      'Treating the Taylor constants as universal. C and n are only valid for the specific tool, work material, feed, depth of cut and coolant they were measured with, and the equation breaks down far outside the tested speed range.',
      'Ignoring the practical limits. Real cutting has built-up edge, chatter, chip control and a limit set by machine power and rigidity. A speed from the Taylor equation is a starting point for economics, not a guarantee the cut will be stable.',
    ],
    rulesOfThumb: [
      'Raising rake angle or lowering friction (sharper tool, good coolant) increases φ, thins the chip and reduces force. Each degree of rake helps, but too much rake weakens the edge.',
      'Cutting power scales linearly with speed, but tool life scales as V^(−1/n). With n ≈ 0.25 a 20% speed increase costs more than half the tool life.',
      'Taylor n is typically 0.1–0.2 for HSS and roughly 0.2–0.5 for carbide, with ceramics higher still. A small n means life is extremely speed-sensitive, so small speed errors matter most for HSS.',
      'Sanity check: the chip ratio r must be less than 1, the shear angle is typically in the range of 20°–45° (not 5° and not 80°), and Fc should be larger than Ft for ordinary positive-rake cutting.',
    ],
    designChecklist: [
      'Fix the cut: work material, feed (t₀), depth of cut (w), and the operation (turning, milling, drilling).',
      'Estimate or look up the work shear strength τₛ (or the specific cutting energy u for that material).',
      'Choose the rake angle and estimate the friction angle from material and lubrication; compute φ from Merchant.',
      'Compute Fs, R, then Fc and Ft with the force circle.',
      'Compute power Pc = Fc V, add machine efficiency, and check it fits within the spindle and the machine’s rigidity.',
      'Pick the cutting speed from tool-life economics (Taylor), then check the tool, surface finish and chatter in practice.',
    ],
    prerequisites: [
      { courseId: 'mechanics-of-materials', topicId: 'stress-strain', why: 'Cutting is controlled shear, so shear strength and plastic flow are the starting point.' },
      { courseId: 'engineering-dynamics', topicId: 'newton-work-energy', why: 'Power as force times velocity (Pc = Fc V) is a work-energy idea.' },
    ],
    videos: [
      {
        id: 'Um_g8sQ_p3Y',
        title: 'How Things Are Made — Intro to Manufacturing Processes',
        channel: EE,
        why: 'Broad context for where machining sits among manufacturing processes; it is a general overview, not a cutting-mechanics derivation.',
      },
    ],
    quiz: [
      {
        kind: 'numeric',
        prompt: 'In orthogonal cutting the rake angle is α = 15° and the friction angle is β = 25°. What shear angle does the Merchant relation predict?',
        answer: 40,
        unit: '°',
        explanation: 'φ = 45° + α/2 − β/2 = 45 + 7.5 − 12.5 = 40°. Notice that friction (β) works against you: a higher friction angle lowers φ, which makes a thicker chip and larger force.',
      },
      {
        kind: 'numeric',
        prompt: 'With α = 0° and a shear angle φ = 30°, the uncut chip thickness is t₀ = 0.20 mm. How thick is the chip?',
        answer: 0.346,
        unit: 'mm',
        explanation: 'r = sin φ / cos(φ − α) = sin 30° / cos 30° = 0.577, so t_c = t₀ / r = 0.20 / 0.577 = 0.346 mm. The chip is thicker than the layer cut because the material is compressed and squeezed up the tool face; r is always below 1.',
      },
      {
        kind: 'numeric',
        prompt: 'A turning cut has a cutting force Fc = 900 N at a cutting speed V = 90 m/min. What cutting power does the tool consume?',
        answer: 1.35,
        unit: 'kW',
        explanation: 'V = 90/60 = 1.5 m/s, so Pc = Fc V = 900 × 1.5 = 1350 W = 1.35 kW. The most common slip is forgetting that V is in m/min and getting an answer 60× too large.',
      },
      {
        kind: 'choice',
        prompt: 'A tool follows V·T^n = C with n = 0.25. If the cutting speed is doubled, what happens to tool life?',
        options: ['It halves', 'It falls to one quarter', 'It falls to one sixteenth', 'It is unchanged'],
        correct: 2,
        explanation: 'T = (C/V)^(1/n) = (C/V)⁴. Doubling V multiplies T by 2⁻⁴ = 1/16 (for example 16 min at V = 150 m/min with C = 300 becomes 1 min at 300 m/min). Power only doubles; tool life collapses far faster, and that is why speed limits are set by wear, not by the motor.',
      },
      {
        kind: 'choice',
        prompt: 'A student computes cutting power as P = (R) × V using the full resultant tool force R, reasoning that "R is the force on the tool". What is wrong?',
        options: [
          'Nothing; R is the total force so it gives the total power',
          'Only the component of the force along the cutting velocity does work, so the power is Fc·V, which is smaller than R·V',
          'The student should have used the thrust force Ft, which is the largest component',
          'The student should have used the shear force Fs times the chip velocity, which is always larger',
        ],
        correct: 1,
        explanation: 'Power is the force component along the velocity times the speed. R points partly across the cutting direction (that part is the thrust force Ft), and Ft does no work because the tool does not move that way. Using R overestimates power by 1/cos(β − α). (Strictly, there is also a tiny contribution from the feed motion, which is negligible in turning.)',
      },
      {
        kind: 'choice',
        prompt: 'Which change to an orthogonal cut gives a larger shear angle and a lower cutting force, all else equal?',
        options: [
          'Decreasing the rake angle to a negative value',
          'Dry cutting, so there is no coolant film',
          'Increasing the friction angle at the tool–chip interface',
          'Increasing the rake angle, or lowering the friction with lubrication',
        ],
        correct: 3,
        explanation: 'φ = 45° + α/2 − β/2: it rises with rake angle and falls with friction angle. A larger φ means a shorter shear plane, a thinner chip and a lower Fs, so the force is lower. The price of a very large rake is a weaker tool edge.',
      },
    ],
  },

  'material-selection': {
    intuition:
      'Ask "what is the best material for a bicycle frame?" and the honest answer is "best at what, in what shape?". Steel is the stiffest of the common metals, yet a steel and an aluminium tube of the same stiffness are a very different weight. That is because you do not have to keep the same cross-section: with a lighter, less stiff metal you simply make the tube bigger in diameter and the wall still thin, and stiffness rises quickly with size. So the material property that matters is not stiffness or density alone, but a particular combination that depends on the job and on which dimensions you are free to change. A performance index is that combination. Once you know the index, ranking materials stops being a matter of opinion: you read the list in order, and the mass saving is just a ratio of indices.',
    derivation: [
      {
        text: 'State the objective and the constraint. Objective: minimise mass of a beam of fixed length L with a free cross-section area A. Constraint: it must have bending stiffness at least S. The geometry is not fixed; A is the free variable we want to eliminate.',
        latex: 'm = \\rho\\,A\\,L',
      },
      {
        text: 'Write the constraint. For a given section shape, bending stiffness is S = C E I / L³, where C depends on the loading and supports. For a solid square section I = A²/12 (any shape with fixed proportions has I ∝ A²):',
        latex: 'S = \\frac{C\\,E\\,I}{L^{3}},\\qquad I = \\frac{A^{2}}{12}',
      },
      {
        text: 'Solve the constraint for the free variable A. This says: the stiffer and longer the beam, the bigger the section needed, and a larger E lets the section shrink — but only with a square root:',
        latex: 'A = \\left(\\frac{12\\,S\\,L^{3}}{C\\,E}\\right)^{1/2}',
      },
      {
        text: 'Substitute A into the objective. Everything in the bracket is fixed by the design requirement (S, L, C); the only material properties left are ρ and E:',
        latex: 'm = \\left(12\\,S/C\\right)^{1/2} L^{2}\\;\\cdot\\;\\frac{\\rho}{E^{1/2}}',
      },
      {
        text: 'Minimising the mass means maximising the group of material properties that is left over. That group is the performance index for a light, stiff beam:',
        latex: 'M_{beam} = \\frac{E^{1/2}}{\\rho}',
      },
      {
        text: 'Repeat the recipe with a different constraint and the exponent changes. A panel (free thickness, stiffness ∝ E t³) gives E^{1/3}/ρ, a tie (stiffness ∝ E A/L) gives E/ρ, and strength-limited designs swap E for yield strength (σᵧ^{2/3}/ρ for a beam, σᵧ/ρ for a tie). Since mass scales as 1/M, the ratio of the masses of two materials is the inverse ratio of their indices:',
        latex: '\\frac{m_{1}}{m_{2}} = \\frac{M_{2}}{M_{1}}',
      },
    ],
    commonMistakes: [
      'Picking by a single property. "Strongest" or "lightest" or "stiffest" ignores that the job almost always involves a combination. The performance index is how you build that combination without guessing.',
      'Using the wrong index for the loading. A tie in pure tension (E/ρ), a beam in bending (E^½/ρ) and a panel (E^⅓/ρ) have different indices, and the ranking of materials can change between them. Always identify the load path first.',
      'Forgetting that an index assumes the geometry is free. If the cross-section is fixed (a hole that must fit a given size, a minimum wall for manufacturing, a standard pipe), the result does not apply and you should use the plain property.',
      'Using an index alone to choose. Indices rank materials on one aspect. You still have to screen with hard limits (maximum temperature, corrosion, toughness, minimum gauge, cost, availability) and then check processing and joining.',
      'Mixing units or using inconsistent property data. Index values are only meaningful in comparison; E in GPa and ρ in Mg/m³ for all candidates is fine, but mixing GPa and Pa across two candidates makes a ratio meaningless. Also note that real alloys and composites vary widely, so the numbers used are representative.',
      'Taking the mass ratio as the final answer. The ratio from the index is the best case for a free section shape. Real designs hit buckling, wall-thickness limits, joint mass and manufacturing limits well before the full saving is achieved.',
    ],
    rulesOfThumb: [
      'For a light, stiff part in bending, the ranking is E^½/ρ for a beam and E^⅓/ρ for a panel. Materials with a low density win these indices even when their modulus is low, because the square root or cube root flattens the benefit of E.',
      'In a pure tie, steel, aluminium and titanium come out roughly equal for stiffness (E/ρ ≈ 25–26 GPa·m³/Mg for steel and aluminium, ≈ 24 for titanium) because E scales almost in proportion to ρ across these metals. The big stiffness-per-mass gains come from composites or from changing the shape.',
      'Mass ratio from the index: a candidate with an index 2× higher gives about half the mass for the same stiffness (or strength), in the idealised case.',
      'Sanity check: an index of a candidate alloy should land in a believable band. If the ratio says a metal is 5× lighter than steel for the same stiffness you probably mis-typed a modulus or a density.',
    ],
    designChecklist: [
      'Write the function (what does the part do?), the objective (minimise mass, cost, or maximise energy stored), and the constraints (stiffness, strength, size, temperature).',
      'Identify the free variables (usually a cross-section dimension) and the fixed ones (length, loading).',
      'Eliminate the free variable between the constraint and objective to get a performance index in terms of material properties only.',
      'Screen the candidates with hard limits first (maximum service temperature, corrosion, minimum toughness, availability).',
      'Rank the survivors with the index and compute the expected mass or cost saving against a reference.',
      'Check manufacturability, joining, supply and cost for the top few, then validate with a real analysis of the chosen section.',
    ],
    prerequisites: [
      { courseId: 'mechanics-of-materials', topicId: 'stress-strain', why: 'Modulus E and yield strength are the properties the indices are built from.' },
      { courseId: 'mechanics-of-materials', topicId: 'bending-stress-beams', why: 'The beam index comes from I ∝ A² and the bending relations.' },
      { courseId: 'mechanics-of-materials', topicId: 'beam-deflection', why: 'The stiffness constraint S = C E I / L³ is a beam-deflection result.' },
    ],
    videos: [
      {
        id: 'PaGJwOPg2kU',
        title: 'Understanding Metals',
        channel: EE,
        why: 'Background on the metals that appear on the property charts; useful context for what these candidates are.',
      },
      {
        id: '04K0bLwCDdM',
        title: 'The Incredible Properties of Composite Materials',
        channel: EE,
        why: 'Composites are the usual winner on these indices; this gives background on that material family.',
      },
    ],
    quiz: [
      {
        kind: 'numeric',
        prompt: 'For a light, stiff beam, use the index M = √E / ρ with E in GPa and ρ in Mg/m³. A titanium alloy (E = 110 GPa, ρ = 4.5) and steel (E = 205 GPa, ρ = 7.85) are compared. For equal bending stiffness, what is the titanium beam mass as a fraction of the steel one?',
        answer: 0.78,
        explanation: 'M_steel = √205/7.85 = 1.824 and M_Ti = √110/4.5 = 2.331. Mass scales as 1/M, so m_Ti/m_steel = 1.824/2.331 = 0.78. The titanium beam is bigger in section and about 22% lighter, even though its modulus is roughly half of steel.',
        tolerance: 0.02,
      },
      {
        kind: 'numeric',
        prompt: 'For a light, stiff panel the index is E^(1/3)/ρ. Using E = 69 GPa, ρ = 2.70 for aluminium and E = 205 GPa, ρ = 7.85 for steel, what is the aluminium panel mass as a fraction of the steel panel mass at equal bending stiffness?',
        answer: 0.494,
        explanation: 'M_Al = 69^(1/3)/2.70 = 4.101/2.70 = 1.526 and M_steel = 205^(1/3)/7.85 = 5.896/7.85 = 0.751. The mass ratio is M_steel/M_Al = 0.751/1.526 = 0.494. The panel index rewards low density more than the beam index does, so the aluminium panel is about half the mass of steel.',
        tolerance: 0.03,
      },
      {
        kind: 'choice',
        prompt: 'For a tie loaded in pure tension at fixed stiffness, the index is E/ρ. Using steel (E = 205, ρ = 7.85) and aluminium (E = 69, ρ = 2.70), how do the masses compare?',
        options: [
          'The aluminium tie is about 3× lighter',
          'The aluminium tie is about 3× heavier',
          'The aluminium tie is about 60% of the steel mass',
          'They are about the same (within a few percent)',
        ],
        correct: 3,
        explanation: 'E/ρ for steel is 205/7.85 = 26.1 and for aluminium is 69/2.70 = 25.6, so the masses differ by about 2%. For a tie the area is fixed by EA/L, so a lighter metal cannot "grow" its section for free. The big mass saving of aluminium beams comes from the beam index letting the section grow, not from the metal being intrinsically more efficient in tension.',
      },
      {
        kind: 'choice',
        prompt: 'A student argues: "Steel has the highest modulus of the common metals, so a steel beam will always be the lightest for a required bending stiffness." What is the flaw?',
        options: [
          'Steel has no flaw; modulus is the only property that matters for stiffness',
          'Mass depends on density too, and when the section is free to change the relevant index is E^½/ρ, in which a low-density metal can win',
          'The beam index uses yield strength, not modulus',
          'Steel should be compared at equal cost, not at equal mass',
        ],
        correct: 1,
        explanation: 'For fixed length and free section the mass is m ∝ ρ/E^½ at equal stiffness. The square root weakens the benefit of modulus while density counts in full, so aluminium (M ≈ 3.1) beats steel (M ≈ 1.8) even though its E is about a third as large.',
      },
      {
        kind: 'choice',
        prompt: 'What is the purpose of eliminating the free variable (for example the section area A) between the objective and the constraint?',
        options: [
          'To end up with a ratio of material properties that ranks candidates independently of the part size',
          'To make the geometry equal for every material',
          'To compute the actual mass of the part',
          'To avoid needing a stiffness requirement',
        ],
        correct: 0,
        explanation: 'After substitution the mass becomes (fixed requirements) × (material-property group), so the property group alone decides the ranking. That is the performance index: it lets you compare materials without first designing the part for each of them.',
      },
    ],
  },

  'phase-diagram-lever-rule': {
    intuition:
      'Think of a phase diagram as a map of what a mixture "wants" to be at each temperature and overall composition. In a single-phase region the metal is one uniform crystal structure. In a two-phase region the alloy must split into two phases whose compositions are fixed by the diagram at that temperature, no matter what the overall composition is. The overall composition then only decides how much of each. That is the lever rule: picture a seesaw whose pivot is your alloy composition and whose two ends are the two phase compositions. The closer your alloy sits to one end, the more of that phase you have, and the weights balance exactly like a mass balance. Applied to slow-cooled steel, the same idea explains why a 0.4% carbon steel is about half soft ferrite and half pearlite (alternating layers of ferrite and hard cementite), while a 0.76% steel is entirely pearlite.',
    derivation: [
      {
        text: 'Pick a temperature inside a two-phase region. The diagram fixes the compositions of the two phases: C_A for phase A (the left end of the tie line) and C_B for phase B (the right end). Whatever the alloy composition C₀ is, these two compositions do not change in this region.',
      },
      {
        text: 'Mass fractions of the two phases must add to one, since between them they are all of the alloy:',
        latex: 'W_A + W_B = 1',
      },
      {
        text: 'Conserve the solute (say carbon). The total amount of carbon in the alloy equals the amount in phase A plus the amount in phase B. Per unit mass of alloy:',
        latex: 'C_0 = W_A\\,C_A + W_B\\,C_B',
      },
      {
        text: 'Eliminate W_B = 1 − W_A and solve for W_A. This is the lever rule: each phase fraction is the length of the tie line on the opposite side of the alloy composition, divided by the whole tie line:',
        latex: 'W_A = \\frac{C_B - C_0}{C_B - C_A},\\qquad W_B = \\frac{C_0 - C_A}{C_B - C_A}',
      },
      {
        text: 'Apply it to Fe–C below 727 °C. The tie line runs from ferrite (0.022 wt% C) to cementite (6.70 wt% C), so the total phase fractions of a steel of composition C₀ are:',
        latex: 'W_\\alpha = \\frac{6.70 - C_0}{6.70 - 0.022},\\qquad W_{Fe_3C} = 1 - W_\\alpha',
      },
      {
        text: 'Microconstituents need a second tie line, drawn just above 727 °C. For a hypoeutectoid steel (C₀ < 0.76), the ferrite that already formed above the eutectoid temperature is the proeutectoid ferrite, and the remaining austenite (0.76 wt% C) all becomes pearlite on cooling:',
        latex: 'W_{\\alpha^\\prime} = \\frac{0.76 - C_0}{0.76 - 0.022},\\qquad W_{pearlite} = 1 - W_{\\alpha^\\prime}',
      },
    ],
    commonMistakes: [
      'Using the near arm instead of the far arm. The fraction of a phase is the length of the arm on the opposite side of the alloy point, not the side nearest to that phase. If your alloy sits near the ferrite end, there is mostly ferrite, and the arm that gives you the ferrite fraction is the long one.',
      'Confusing phases with microconstituents. Phases are ferrite and cementite (what the crystal structure is). Microconstituents are proeutectoid ferrite and pearlite (what you see under the microscope). A 0.76 wt% steel is 100% pearlite but is roughly 89% ferrite and 11% cementite as phases, because pearlite is itself a mixture of the two.',
      'Applying the lever rule in a single-phase region. A tie line only exists in a two-phase region; in a single-phase region the phase composition is simply the alloy composition and the fraction is 100%.',
      'Mixing weight percent and atomic percent. The Fe–C diagram and the lever rule used here are in weight percent carbon. Convert before using atomic-percent data from another diagram.',
      'Forgetting the equilibrium assumption. The lever rule describes slow cooling to equilibrium. Quenching, welding and most real heat treatments are not in equilibrium, and the real microstructure (martensite, bainite, finer pearlite) can differ a lot from what the diagram suggests.',
      'Using the wrong tie line temperature. Just above 727 °C and just below give different tie lines (ferrite–austenite versus ferrite–cementite), and these give different fractions with different meanings. Say which one you mean.',
    ],
    rulesOfThumb: [
      'The key Fe–C values: ferrite at about 0.022 wt% C (maximum solubility), eutectoid at 0.76 wt% C and 727 °C, cementite at 6.70 wt% C. The fractions in these notes use exactly those numbers, and textbook rounding may shift answers by a fraction of a percent.',
      'A steel below 0.76 wt% C is hypoeutectoid (soft proeutectoid ferrite plus pearlite); above 0.76 wt% C it is hypereutectoid (brittle proeutectoid cementite plus pearlite). Strength and hardness rise, and ductility falls, with more pearlite and cementite.',
      'Sanity check: the two fractions must add to 1 and lie between 0 and 1. If the alloy sits exactly at one end of the tie line, that phase must be 100%.',
      'Cementite is a small fraction by mass at low carbon: even a 0.8 wt% steel is only roughly 11% cementite by mass. Do not expect large cementite fractions until you are well above 1 wt% C.',
    ],
    designChecklist: [
      'Fix the alloy composition C₀ (wt%) and the temperature you care about.',
      'Locate the point on the diagram and see which region it is in: one phase or two.',
      'In a two-phase region, draw the horizontal tie line and read the end compositions C_A and C_B from the diagram.',
      'Apply the lever rule: fraction of a phase is the opposite arm over the whole tie line, and check the two fractions add to one.',
      'For slow-cooled steel, repeat just above 727 °C for the proeutectoid phase, then count the rest as pearlite.',
      'Then interpret: more pearlite and cementite means harder and stronger but less ductile; remember the diagram only gives the equilibrium answer, not what a quench or weld will actually produce.',
    ],
    prerequisites: [
      { courseId: 'mechanics-of-materials', topicId: 'stress-strain', why: 'Ferrite/pearlite fractions are used to predict strength and ductility, which are read off the stress–strain curve.' },
    ],
    quiz: [
      {
        kind: 'numeric',
        prompt: 'A slow-cooled plain-carbon steel contains 0.20 wt% C. Using ferrite 0.022 wt% C and the eutectoid composition 0.76 wt% C, what mass fraction of the steel is pearlite?',
        answer: 0.241,
        explanation: 'Pearlite is what the austenite at 0.76 wt% C becomes, and its fraction is the arm on the ferrite side of the tie line: (C₀ − 0.022)/(0.76 − 0.022) = 0.178/0.738 = 0.241. The rest, 0.759, is proeutectoid ferrite.',
      },
      {
        kind: 'numeric',
        prompt: 'A slow-cooled steel contains 1.00 wt% C. Using eutectoid 0.76 and cementite 6.70 wt% C, what mass fraction of the steel is proeutectoid cementite?',
        answer: 0.0404,
        explanation: 'Just above 727 °C the tie line runs from austenite (0.76) to cementite (6.70). The cementite fraction is the arm on the austenite side: (1.00 − 0.76)/(6.70 − 0.76) = 0.24/5.94 = 0.0404, about 4%. The other 96% is austenite that turns into pearlite.',
        tolerance: 0.03,
      },
      {
        kind: 'numeric',
        prompt: 'A eutectoid steel (0.76 wt% C) is entirely pearlite. Using the ferrite–cementite tie line (0.022 to 6.70 wt% C), what mass percentage of this steel is cementite (as a phase) just below 727 °C?',
        answer: 11.05,
        unit: '%',
        explanation: 'W_Fe₃C = (0.76 − 0.022)/(6.70 − 0.022) = 0.738/6.678 = 0.1105, so about 11%. The pearlite is 89% ferrite plus 11% cementite by mass, as thin alternating layers.',
      },
      {
        kind: 'choice',
        prompt: 'A student finds the proeutectoid ferrite in a 0.40 wt% C steel as (0.40 − 0.022)/(0.76 − 0.022) = 0.512. What is wrong?',
        options: [
          'Nothing; this is the correct way to find proeutectoid ferrite',
          'They should have used the cementite end of 6.70 wt% C instead of 0.76',
          'That is the pearlite fraction, since the lever rule gives each phase the opposite arm; proeutectoid ferrite is (0.76 − 0.40)/(0.76 − 0.022) = 0.488',
          'The lever rule cannot be used above 727 °C',
        ],
        correct: 2,
        explanation: 'The arm measured from the ferrite end (C₀ − 0.022) belongs to the other phase: it is the austenite (which becomes pearlite). The ferrite fraction uses the far arm, (0.76 − C₀). The two fractions must add to 1: 0.488 + 0.512 = 1.',
      },
      {
        kind: 'choice',
        prompt: 'Which statement about a slow-cooled 0.76 wt% C steel below 727 °C is correct?',
        options: [
          'It is 100% pearlite as a microconstituent, but it is about 89% ferrite and 11% cementite as phases',
          'It is 100% cementite as a phase',
          'It is 50% ferrite and 50% cementite as phases',
          'It contains about 11% proeutectoid cementite',
        ],
        correct: 0,
        explanation: 'At the eutectoid composition all the austenite transforms to pearlite, so there is no proeutectoid phase. Pearlite itself is made of ferrite and cementite layers in the ratio 0.89 : 0.11 from the lever rule, so phases and microconstituents give different breakdowns of the same steel.',
      },
      {
        kind: 'numeric',
        prompt: 'In a two-phase region the tie line spans 10 wt% B (phase α) to 50 wt% B (phase β). An alloy of overall composition 20 wt% B is in equilibrium here. What mass fraction of the alloy is phase β?',
        answer: 0.25,
        explanation: 'W_β = (C₀ − C_α)/(C_β − C_α) = (20 − 10)/(50 − 10) = 10/40 = 0.25. The alloy is closer to the α end, so there is much more α (0.75) than β, which is exactly what the seesaw picture predicts.',
      },
    ],
  },

  'sheet-metal-bending': {
    intuition:
      'Bend a piece of sheet metal and look at its edge: the outside of the bend is stretched, the inside is squashed, and somewhere between the two is a layer that keeps its original length. That layer, the neutral axis, sets how long a flat blank must be so that it ends up the right size after bending. In a tight bend it slides toward the inside; in a gentle bend it stays near the middle. Then you let go and the part does not stay put: the outer layers carry high stress and want to unwind, and the small elastic part of the deformation recovers, opening the angle slightly. That springback is bigger in a stiff-to-yield material (high yield strength relative to modulus), in a gentle bend with a large radius, and in thin sheet. So you overbend on purpose so the part relaxes to the angle you want.',
    derivation: [
      {
        text: 'The neutral axis keeps its length. It sits at a distance K·t from the inside surface, where K is the K-factor and t the thickness. Its arc over a bend of angle θ (in radians) with inside radius r is the bend allowance:',
        latex: 'BA = \\theta\\,(r + K\\,t)',
      },
      {
        text: 'Measure flange lengths a and b to the "virtual sharp" (where the outside faces would meet). For a bend of angle θ, the outside setback is (r + t) tan(θ/2) on each side, so the straight-line flange lengths overshoot the actual material length by the bend deduction. The flat blank is the sum of the flanges minus that deduction:',
        latex: 'BD = 2(r+t)\\tan\\frac{\\theta}{2} - BA,\\qquad L_{flat} = a + b - BD',
      },
      {
        text: 'Springback model: an elastic–perfectly-plastic rectangular section bent to neutral-axis radius R. The strain at height y is y/R, so the outer part has yielded where y > y_e = R Y / E, and the middle part of half-thickness y_e is still elastic.',
        latex: 'y_e = \\frac{R\\,Y}{E}',
      },
      {
        text: 'The bending moment per unit width of this partly yielded section is the full plastic contribution less the missing elastic core (the elastic core carries a linear stress instead of Y):',
        latex: 'M = Y\\left(\\frac{t^{2}}{4} - \\frac{y_e^{2}}{3}\\right)',
      },
      {
        text: 'Unloading is elastic. Removing M reduces the curvature by M/(E I) with I = t³/12 per unit width. So 1/R_f = 1/R_i − M/(E I):',
        latex: '\\frac{1}{R_i} - \\frac{1}{R_f} = \\frac{12\\,M}{E\\,t^{3}} = \\frac{3Y}{E t} - \\frac{4Y y_e^{2}}{E t^{3}}',
      },
      {
        text: 'Substitute y_e = R_i Y/E and multiply through by R_i. With x = R_i Y/(E t) the springback ratio drops out as a cubic:',
        latex: '\\frac{R_i}{R_f} = 4x^{3} - 3x + 1,\\qquad x = \\frac{R_i\\,Y}{E\\,t}',
      },
      {
        text: 'The neutral-axis arc length is unchanged by unloading (it is the part that did not stretch), so R_i θ_i = R_f θ_f. The tool angle you need to leave a final angle θ_f is therefore:',
        latex: '\\theta_i = \\theta_f\\,\\frac{R_f}{R_i} = \\frac{\\theta_f}{4x^{3} - 3x + 1}',
      },
    ],
    commonMistakes: [
      'Using degrees where radians are needed. BA = θ(r + K t) requires θ in radians; 90° is π/2 = 1.5708, not 90. This produces absurdly large flat lengths.',
      'Using the wrong radius or the wrong side. Bend allowance uses the inside radius r (plus K t to reach the neutral axis). Springback uses the neutral-axis radius R = r + t/2 (when K = 0.5). Mixing these shifts the answer.',
      'Measuring flanges inconsistently. The formula L = a + b − BD needs the outside flange lengths to the virtual sharp. If a drawing gives inside dimensions or tangent-point lengths, you must convert before applying BD.',
      'Treating K as a constant. K is about 0.33 for tight bends and nearer 0.5 for large radii; it also depends on material and process. Use a value from your shop or calibrate with a test bend rather than assuming one number.',
      'Assuming that the same overbend works for every material. Springback depends on Y/E, not on E alone: HSLA or stainless steel with a much higher yield strength springs back far more than mild steel with the same modulus, so you cannot reuse a tool angle from one material for the other.',
      'Forgetting that the formulas are simplified. Real bending has strain hardening, anisotropy, an inward-shifting neutral axis and a die-dependent springback; the cubic is for an elastic–perfectly-plastic section, so use it for a first estimate and then correct with a trial bend.',
    ],
    rulesOfThumb: [
      'Springback grows with yield strength, with bend radius and with 1/thickness, and shrinks with modulus. A sharp bend in thick, soft sheet barely springs back; a large-radius bend in thin, high-strength sheet springs back a lot.',
      'A typical V-die opening is roughly 6–12 times the sheet thickness (about 8t is common), but this varies with material and shop. A wider die lowers tonnage and increases the minimum radius.',
      'Required bending force scales with t², so doubling the sheet thickness roughly quadruples the press-brake force for the same die opening, bend length and material.',
      'As a minimum bend radius, many ductile sheet materials tolerate an inside radius around 1× the thickness, but harder or thicker material needs more; take it from the supplier data, not from this rule.',
    ],
    designChecklist: [
      'Fix the geometry: bend angle, inside radius, thickness, and the outside flange lengths to the virtual sharp.',
      'Choose a K-factor from the shop’s data (or a typical value for the radius-to-thickness ratio).',
      'Compute BA, BD and the flat blank length; add up the BD for every bend in a multi-bend part.',
      'Estimate the V-die force from the UTS, bend length, t and die opening, and compare with the press capacity.',
      'Compute x = R_i Y/(E t) and the springback ratio, then set the tool angle θ_i = θ_f / ratio.',
      'Check the radius is not below the material’s minimum bend radius (cracking), then run a trial bend and adjust the overbend and K.',
    ],
    prerequisites: [
      { courseId: 'mechanics-of-materials', topicId: 'stress-strain', why: 'Springback is the elastic part of the strain; yield strength and modulus govern it.' },
      { courseId: 'mechanics-of-materials', topicId: 'bending-stress-beams', why: 'The strain-proportional-to-distance picture and I = bt³/12 underpin the springback derivation.' },
    ],
    quiz: [
      {
        kind: 'numeric',
        prompt: 'A 90° bend has inside radius r = 3 mm, thickness t = 2 mm and K-factor 0.33. What is the bend allowance?',
        answer: 5.75,
        unit: 'mm',
        explanation: 'θ = π/2 = 1.5708 rad. BA = θ (r + K t) = 1.5708 × (3 + 0.33 × 2) = 1.5708 × 3.66 = 5.75 mm. This is the length of the neutral axis inside the bend.',
      },
      {
        kind: 'numeric',
        prompt: 'Using the same 90° bend (r = 3 mm, t = 2 mm, K = 0.33, BA = 5.75 mm) and outside flange lengths a = 30 mm and b = 50 mm, what is the flat blank length?',
        answer: 75.75,
        unit: 'mm',
        explanation: 'The outside setback is (r + t) tan 45° = 5 mm, so BD = 2 × 5 − 5.749 = 4.251 mm. L = a + b − BD = 80 − 4.251 = 75.75 mm. The flat blank is shorter than the sum of the flanges because the corner takes less material than two sharp-cornered flanges would.',
        tolerance: 0.005,
      },
      {
        kind: 'numeric',
        prompt: 'Estimate the V-die bending force with F = 1.33 · UTS · L · t² / W for UTS = 400 MPa, bend length L = 1000 mm, thickness t = 2 mm and die opening W = 16 mm.',
        answer: 133,
        unit: 'kN',
        explanation: 'With UTS in MPa (N/mm²) and all lengths in mm the result is in newtons: F = 1.33 × 400 × 1000 × 4 / 16 = 133 000 N = 133 kN. The t² term is why thick plate needs so much more tonnage.',
      },
      {
        kind: 'choice',
        prompt: 'Which sheet will spring back the most for a bend with the same inside radius and thickness?',
        options: [
          'Mild steel with Y = 250 MPa and E = 200 GPa',
          'A high-strength steel with Y = 600 MPa and E = 200 GPa',
          'Both are identical because E is the same',
          'Mild steel, because it is softer and so it deforms more',
        ],
        correct: 1,
        explanation: 'The springback ratio depends on x = R_i Y/(E t). With E, R_i and t equal, a higher Y gives a larger x and a larger springback. Moving the tool angle for mild steel to high-strength steel without an extra overbend gives an under-formed part.',
      },
      {
        kind: 'choice',
        prompt: 'A shop reuses the overbend angle for a new HSLA sheet that has the same modulus (200 GPa) and thickness as the mild steel they were bending, reasoning "same E, so same springback". What is wrong?',
        options: [
          'Nothing; the elastic recovery depends only on the modulus',
          'Elastic recovery depends on the ratio of yield strength to modulus, so the HSLA sheet with a much higher Y springs back more',
          'Springback depends only on the die opening',
          'The reasoning would only fail if the thickness changed',
        ],
        correct: 1,
        explanation: 'The recovered strain is about Y/E, because that is how far the sheet was stretched elastically before it yielded. A higher yield strength means more stored elastic strain to release, hence more springback, even at the same E.',
      },
      {
        kind: 'numeric',
        prompt: 'A 90° bend in 1.0 mm sheet has inside radius 3.0 mm, so the neutral-axis radius is R_i = 3.5 mm. The sheet has Y = 500 MPa and E = 200 GPa. Using R_i/R_f = 4x³ − 3x + 1 with x = R_i Y/(E t), what tool angle is needed to end at 90°?',
        answer: 92.43,
        unit: '°',
        explanation: 'x = 3.5 × 500/(200 000 × 1.0) = 0.00875. R_i/R_f = 1 − 3(0.00875) + 4(0.00875)³ = 0.97375, so θ_i = 90/0.97375 = 92.43°. The springback is about 2.4°, so you form to 92.4° and the part relaxes to 90°.',
        tolerance: 0.005,
      },
      {
        kind: 'choice',
        prompt: 'Sheet thickness is doubled while material, bend length, die opening and bend angle stay the same. By roughly what factor does the V-die force estimate change?',
        options: ['2×', '3×', '8×', '4×'],
        correct: 3,
        explanation: 'F ∝ UTS · L · t² / W, so the force scales with t². Doubling t multiplies F by 2² = 4. (The die opening would usually be widened for thicker sheet, which would reduce this somewhat.)',
      },
    ],
  },

  'tolerance-stackup': {
    intuition:
      'No machine can make a part exactly to size, so every dimension is really a band, and anything built from several parts inherits the bands of all of them. Picture four people each trying to stand exactly on a line: the line-up of all four will drift further from the target than any one of them, but not by the full sum, since one leans left while another leans right. That is the whole story of tolerance stack-up. Worst case adds every band as if all parts were at their limits in the same direction, which guarantees assembly but costs a lot. Root-sum-square (RSS) accepts that the extremes rarely coincide and gives a much narrower, cheaper band, at the price of a small fraction of assemblies out of limits. For mating parts, the ISO fit system is a vocabulary for the band: a letter says where the band sits relative to the nominal size and a number (the IT grade) says how wide it is.',
    derivation: [
      {
        text: 'Write the quantity of interest (a gap) as a linear chain of dimensions, with a sign for each: positive when the dimension opens the gap and negative when it closes it. For a stack A − B − C − D:',
        latex: 'G = A - B - C - D',
      },
      {
        text: 'Worst case: let every dimension take whichever limit makes the gap largest, then smallest. Because the gap is a sum of ± terms, the tolerance on the gap is the sum of all the tolerances regardless of sign. Subtracted dimensions add to the tolerance, not subtract from it:',
        latex: 'T_{wc} = \\sum_i t_i',
      },
      {
        text: 'Statistical model: treat each dimension as an independent, centred, roughly normal variable, with band t_i ≈ ±3σ_i. For independent variables the variances add, whatever the signs in the chain:',
        latex: '\\sigma_G^{2} = \\sum_i \\sigma_i^{2}',
      },
      {
        text: 'Convert back to a ±3σ band by multiplying through by 3. That gives the RSS tolerance. It is always less than or equal to the worst-case sum, and for n equal tolerances t it is t√n rather than n t:',
        latex: 'T_{rss} = \\sqrt{\\sum_i t_i^{2}}',
      },
      {
        text: 'For a hole and a shaft of the same basic size, ISO 286 gives each a deviation range from the basic size (hole: ES upper, EI lower; shaft: es upper, ei lower). The loosest and tightest clearances come from the extreme combinations:',
        latex: 'C_{max} = ES - ei,\\qquad C_{min} = EI - es',
      },
      {
        text: 'The width of the band is the IT grade, the standard tolerance. It grows with size, roughly as the cube root of the diameter, and each grade is a fixed multiple of the unit i. IT7 is 16 i, so the sequence IT6, IT7, IT8… steps up by about 60% each time:',
        latex: 'i = 0.45\\sqrt[3]{D} + 0.001\\,D\\ (\\mu\\text{m}),\\qquad IT7 = 16\\,i',
      },
    ],
    commonMistakes: [
      'Subtracting tolerances for subtracted dimensions. A dimension that closes the gap still adds its tolerance to the total variation, because it can be big or small. Tolerances always add (worst case) or add in quadrature (RSS), whatever the sign on the dimension itself.',
      'Mixing up the hole and shaft deviations in the clearance formulae. The maximum clearance is the largest hole minus the smallest shaft (ES − ei); the minimum is the smallest hole minus the largest shaft (EI − es). Swapping them reverses the sign of the fit class.',
      'Applying RSS without the assumptions. RSS needs independent, centred, roughly normal variation and enough parts in the chain. For a small count, a biased process (mean off nominal), or sorted/selected parts it understates the real variation.',
      'Treating the RSS band as a guarantee. RSS with ±3σ inputs still lets a small fraction of assemblies (on the order of a few tenths of a percent, depending on assumptions) land outside the band. For safety-critical or low-volume work use worst case, or add a statistical margin.',
      'Reading an ISO fit as symmetric. H7 is a one-sided band starting at the basic size and going up; g6 is a band below the basic size. A tolerance of ±0.02 in a drawing is not the same thing as an H7 hole.',
      'Using the IT grade without the size range. The same IT7 is a different number of micrometres at 10 mm and at 100 mm; ISO tabulates by size range, and the formula uses the geometric mean of the range.',
    ],
    rulesOfThumb: [
      'For n similar tolerances, RSS is about 1/√n of the worst-case sum: four equal tolerances give an RSS band of half the worst-case band; nine give one third.',
      'The largest tolerances dominate RSS because of the squares. The best way to cut the variation is to tighten the one or two biggest contributors, not to tighten everything.',
      'Each IT grade step is roughly a 1.6× change in tolerance width, and tighter grades cost disproportionately more to hold in manufacturing.',
      'Sanity check: the RSS band should be between the largest single tolerance and the worst-case sum. If it is outside this range you made an arithmetic error.',
    ],
    designChecklist: [
      'Define the functional requirement as a gap, clearance or fit with its limits (what happens if it is too small or too large?).',
      'Draw the dimension chain and mark each dimension with a sign (opens or closes the gap), from one face of the gap to the other.',
      'Compute the nominal gap and check it is positive and sensible.',
      'Choose the method: worst case if every assembly must work or the volume is small, RSS (with a stated risk) for high-volume, well-controlled processes.',
      'Compute the gap limits and compare with the requirement; identify the biggest contributors.',
      'Re-allocate tolerances to cost: tighten the dominant ones, loosen the rest, and for mating features select a standard ISO fit rather than inventing limits.',
    ],
    prerequisites: [
      { courseId: 'machine-design', topicId: 'bearing-selection', why: 'Bearing seats and shafts are the classic place where ISO fits and stack-ups of a housing are applied.' },
    ],
    quiz: [
      {
        kind: 'numeric',
        prompt: 'A gap is formed from three independent dimensions with tolerances ±0.06 mm, ±0.08 mm and ±0.10 mm. What is the RSS tolerance on the gap?',
        answer: 0.1414,
        unit: 'mm',
        explanation: 'T_rss = √(0.06² + 0.08² + 0.10²) = √(0.0036 + 0.0064 + 0.0100) = √0.02 = 0.141 mm. Worst case would be 0.06 + 0.08 + 0.10 = 0.24 mm, so RSS is about 41% smaller.',
        tolerance: 0.02,
      },
      {
        kind: 'numeric',
        prompt: 'Four independent parts each have a tolerance of ±0.10 mm in a stack. What is the RSS tolerance of the assembly?',
        answer: 0.2,
        unit: 'mm',
        explanation: 'T_rss = √(4 × 0.10²) = 0.10 × √4 = 0.20 mm, half of the worst-case sum of 0.40 mm. For n equal tolerances t, RSS is t√n and worst case is n t.',
      },
      {
        kind: 'choice',
        prompt: 'A hole is 25.000 to 25.021 mm and the shaft is 25.022 to 25.035 mm. What kind of fit is this?',
        options: [
          'Clearance fit, with 1 to 35 µm of clearance',
          'Transition fit, sometimes clearance and sometimes interference',
          'Interference fit, with 1 to 35 µm of interference',
          'Cannot tell without the IT grades',
        ],
        correct: 2,
        explanation: 'Largest hole minus smallest shaft: C_max = 25.021 − 25.022 = −0.001 mm = −1 µm. Smallest hole minus largest shaft: C_min = 25.000 − 25.035 = −0.035 mm = −35 µm. Both are negative, so every assembly is an interference fit, from 1 µm to 35 µm.',
      },
      {
        kind: 'choice',
        prompt: 'A student states that for a gap G = A − B, the tolerance is t_A − t_B because B "removes" some of the variation of A. What is wrong?',
        options: [
          'Nothing; subtracted dimensions reduce the tolerance',
          'The tolerance should be the larger of t_A and t_B',
          'The tolerances of subtracted dimensions also add, since B may be big or small independently of A; the worst-case tolerance is t_A + t_B',
          'The tolerance should be zero because the two cancel on average',
        ],
        correct: 2,
        explanation: 'Variation does not cancel just because the dimension subtracts. If A is at its maximum and B at its minimum, the gap is as large as it can be, and the opposite combination gives the smallest, so the band is ±(t_A + t_B) in worst case (or √(t_A² + t_B²) in RSS).',
      },
      {
        kind: 'choice',
        prompt: 'For which situation is a worst-case stack-up (not RSS) the more appropriate choice?',
        options: [
          'A high-volume consumer product where a 0.3% fallout can be reworked cheaply',
          'A safety-critical assembly built in small batches, where any out-of-limit assembly is unacceptable',
          'A process whose output is known to be centred and normal, with many parts in the stack',
          'Any stack, since worst case is always wasteful',
        ],
        correct: 1,
        explanation: 'RSS accepts a small fraction of assemblies outside the limits and relies on statistical assumptions that need many parts and a stable process. When failure is serious or the batch is too small for statistics to apply, use worst case and accept the cost of tighter tolerances.',
      },
      {
        kind: 'choice',
        prompt: 'In the bearing stack A − B − C − D from the worked example (A = ±0.10, B = ±0.05, C = ±0.05, D = ±0.03 mm), which action gives the greatest reduction in the RSS band?',
        options: [
          'Halving the smallest tolerance, D',
          'Halving the largest tolerance, A',
          'Halving the middle tolerance, B',
          'All single changes give the same reduction',
        ],
        correct: 1,
        explanation: 'RSS² = 0.0159. Halving A (0.10 to 0.05) reduces it by 0.0075 to √0.0084 = 0.092 mm. Halving D (0.03 to 0.015) removes only 0.000675, giving √0.0152 = 0.123 mm. Squares make the biggest tolerance dominant, so tighten that one first.',
      },
    ],
  },
}
