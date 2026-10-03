/**
 * Materials & Manufacturing slice - a new course (MIT 2.008 / 3.022 style)
 * with five complete topics. Wired into the main curriculum by the lead.
 * All worked-example numbers were reproduced with the engine modules in
 * python-engine/src/simmec_engine/topics/.
 */
import type { CourseMeta, TopicMeta } from '../curriculum'

export const NEW_COURSES: CourseMeta[] = [
  {
    id: 'materials-and-manufacturing',
    code: '2.008',
    title: 'Materials & Manufacturing',
    symbol: 'V Tⁿ = C',
    category: 'Materials & manufacturing',
    description:
      'How material choice and manufacturing process meet: the mechanics of cutting, picking the right material, reading phase diagrams, forming sheet metal, and controlling dimensional variation.',
    prerequisites: ['Mechanics of Materials', 'Engineering Statics'],
    references: [
      { label: 'MIT OCW — 2.008 Design and Manufacturing II (Spring 2025)', url: 'https://ocw.mit.edu/courses/2-008-design-and-manufacturing-ii-spring-2025/' },
      { label: 'MIT OCW — 3.012 Fundamentals of Materials Science (Fall 2005)', url: 'https://ocw.mit.edu/courses/3-012-fundamentals-of-materials-science-fall-2005/' },
      { label: 'MIT OCW — 3.22 Mechanical Behavior of Materials (Spring 2008)', url: 'https://ocw.mit.edu/courses/3-22-mechanical-behavior-of-materials-spring-2008/' },
      { label: 'NPTEL — Machining Science', url: 'https://onlinecourses.nptel.ac.in/noc22_me64/preview' },
    ],
    topics: [
      {
        id: 'metal-cutting',
        title: 'Metal Cutting: Merchant Circle & Tool Life',
        duration: '18m',
        level: 'Intermediate',
        summary: 'Shear angle, cutting forces, power, and Taylor tool life for orthogonal cutting.',
        description:
          'Cutting a chip is controlled shearing: a thin layer of metal is pushed past the tool tip, shears along a plane at angle φ, and slides up the rake face. Merchant’s force circle resolves the single resultant force on the tool into shear, friction, cutting and thrust components, so a handful of angles and one material strength predict the forces and power. How fast you can cut is then limited by wear, which Taylor’s empirical equation relates to cutting speed.',
        status: 'active',
        learningObjectives: [
          'Predict the shear angle and chip ratio from rake and friction angles using the Merchant relation',
          'Resolve the resultant tool force into cutting, thrust, friction and normal components with the force circle',
          'Compute cutting power and specific cutting energy, and estimate tool life with the Taylor equation',
        ],
        formulas: [
          { label: 'Merchant shear angle', formula: 'φ = 45° + α/2 − β/2', latex: '\\phi = 45^\\circ + \\frac{\\alpha}{2} - \\frac{\\beta}{2}', note: 'α = rake angle, β = friction angle (tan β = μ). Higher rake or lower friction gives a larger shear angle, a thinner chip and lower force.', emphasis: true },
          { label: 'Chip ratio', formula: 'r = t₀/t_c = sin φ / cos(φ − α)', latex: 'r = \\frac{t_0}{t_c} = \\frac{\\sin\\phi}{\\cos(\\phi-\\alpha)}', note: 'The chip is always thicker than the uncut layer, so r < 1.' },
          { label: 'Shear and resultant force', formula: 'Fs = τₛ t₀ w / sin φ,  R = Fs / cos(φ + β − α)', latex: 'F_s = \\frac{\\tau_s t_0 w}{\\sin\\phi},\\quad R = \\frac{F_s}{\\cos(\\phi+\\beta-\\alpha)}', note: 'Shear stress times shear-plane area, then projected onto the resultant.' },
          { label: 'Cutting and thrust force', formula: 'Fc = R cos(β − α),  Ft = R sin(β − α)', latex: 'F_c = R\\cos(\\beta-\\alpha),\\quad F_t = R\\sin(\\beta-\\alpha)', note: 'Fc acts along the cutting velocity and does all the work; Ft pushes the tool away from the workpiece.' },
          { label: 'Cutting power', formula: 'Pc = Fc · V', latex: 'P_c = F_c V', note: 'Dividing by the material removal rate gives the specific cutting energy u = Fc/(t₀ w).' },
          { label: 'Taylor tool life', formula: 'V Tⁿ = C', latex: 'V T^{n} = C', note: 'T in minutes; C is the speed that gives T = 1 min. Small n (HSS ≈ 0.1–0.2, carbide ≈ 0.2–0.5) means life is very speed-sensitive.' },
        ],
        workedExample: {
          given: 'Orthogonal turning: uncut thickness t₀ = 0.25 mm, width w = 3 mm, rake α = 10°, friction angle β = 30°, work shear strength τₛ = 350 MPa, speed V = 120 m/min. Tool: Taylor n = 0.25, C = 300 m/min.',
          find: 'Shear angle, chip thickness, cutting and thrust forces, power, and tool life (also after a 20% speed increase).',
          steps: [
            'φ = 45° + 10°/2 − 30°/2 = 35°',
            'r = sin 35° / cos 25° = 0.633, so t_c = 0.25/0.633 ≈ 0.395 mm',
            'Fs = 350 × 0.25 × 3 / sin 35° ≈ 457.7 N',
            'R = Fs / cos(35° + 30° − 10°) = 457.7 / cos 55° ≈ 797.9 N',
            'Fc = R cos 20° ≈ 749.8 N,  Ft = R sin 20° ≈ 272.9 N',
            'Pc = Fc V = 749.8 N × (120/60) m/s ≈ 1500 W = 1.5 kW',
            'T = (C/V)^(1/n) = (300/120)⁴ ≈ 39.1 min; at V = 144 m/min, T = (300/144)⁴ ≈ 18.8 min',
          ],
          answer: 'The cut needs about 750 N and 1.5 kW. A 20% speed increase cuts tool life by more than half (39 → 19 min) because of the 1/n = 4 exponent.',
        },
        challenges: [
          'Increase the rake angle from 10° to 25° at fixed friction angle. How do the shear angle, cutting force and power respond, and why do sharper tools cut with less force?',
          'Double the cutting speed. By what factor does the power change, and by what factor does the tool life change for n = 0.25? Which is the bigger penalty?',
        ],
        applications: [
          'Sizing the spindle motor for a turning or milling operation from required material removal rate',
          'Choosing cutting speed to balance throughput against insert cost (economic tool life)',
          'Selecting tool rake angle and coolant to reduce friction on gummy materials such as aluminium',
        ],
        references: [
          { label: 'NPTEL — Machining Science (Merchant circle, orthogonal cutting)', url: 'https://onlinecourses.nptel.ac.in/noc22_me64/preview' },
          { label: 'NPTEL — Metal Cutting and Machine Tools', url: 'https://onlinecourses.nptel.ac.in/noc21_me04/preview' },
        ],
      },
      {
        id: 'material-selection',
        title: 'Material Selection: Ashby Performance Indices',
        duration: '15m',
        level: 'Beginner',
        summary: 'Turn a design requirement into a performance index and rank materials for minimum mass.',
        description:
          'Choosing a material by “highest strength” or “lowest density” alone is rarely right, because the shape and load of the part decide which combination of properties matters. Ashby’s method writes the objective (minimise mass) and the constraint (be stiff enough, or strong enough), eliminates the free geometry variable, and leaves one performance index built only from material properties. Plotting materials on log-log property charts makes the winner visible: it is the one farthest along the index guideline.',
        status: 'active',
        learningObjectives: [
          'Derive a performance index by combining an objective, a constraint and a free geometry variable',
          'Use the right index for a light, stiff beam, panel or tie, and for strength-limited and spring designs',
          'Rank materials with an index and translate the result into a mass saving against a reference',
        ],
        formulas: [
          { label: 'Light, stiff beam', formula: 'M = E^½ / ρ', latex: 'M = \\frac{E^{1/2}}{\\rho}', note: 'Fixed length and section shape, free size. Stiffness S ∝ E A²/L³ gives A ∝ (S L³/E)^½, so mass ∝ ρ/E^½.', emphasis: true },
          { label: 'Light, stiff panel', formula: 'M = E^⅓ / ρ', latex: 'M = \\frac{E^{1/3}}{\\rho}', note: 'Free thickness only: bending stiffness ∝ E t³.' },
          { label: 'Light, stiff tie', formula: 'M = E / ρ', latex: 'M = \\frac{E}{\\rho}', note: 'Axial stiffness ∝ E A / L.' },
          { label: 'Light, strong beam and tie', formula: 'M = σᵧ^⅔/ρ (beam),  M = σᵧ/ρ (tie)', latex: 'M = \\frac{\\sigma_y^{2/3}}{\\rho}\\ \\text{(beam)},\\quad M = \\frac{\\sigma_y}{\\rho}\\ \\text{(tie)}', note: 'Strength-limited versions: the allowable load sets the section size.' },
          { label: 'Mass ratio from the index', formula: 'm / m_ref = M_ref / M', latex: '\\frac{m}{m_{ref}} = \\frac{M_{ref}}{M}', note: 'For the light-weight indices, mass scales as 1/M, so the ratio of indices is the mass saving.' },
        ],
        workedExample: {
          given: 'A light, stiff beam of fixed length and square section is to match the stiffness of a mild-steel one. Representative data (E in GPa, ρ in Mg/m³): steel 205, 7.85; aluminium 6061 69, 2.70; CFRP 70, 1.55.',
          find: 'The index M = E^½/ρ for each and the mass of the aluminium and CFRP beams relative to steel.',
          steps: [
            'Steel: M = √205 / 7.85 = 14.32 / 7.85 ≈ 1.82',
            'Aluminium: M = √69 / 2.70 = 8.31 / 2.70 ≈ 3.08',
            'CFRP: M = √70 / 1.55 = 8.37 / 1.55 ≈ 5.40',
            'Mass ratio = M_steel / M: aluminium 1.82/3.08 ≈ 0.59, CFRP 1.82/5.40 ≈ 0.34',
          ],
          answer: 'For equal bending stiffness the aluminium beam is about 59% of the steel mass and the CFRP beam about 34%, even though steel has by far the highest modulus. The index rewards stiffness per mass, not stiffness alone.',
        },
        challenges: [
          'Switch from the stiff beam to the stiff tie index. Does the ranking of aluminium against steel change, and why does the exponent on E matter so much?',
          'Add a minimum yield strength of 300 MPa as a screening limit. Which stiff-beam winners drop out, and what does that say about using an index without constraints?',
        ],
        applications: [
          'Choosing aluminium or composites for aircraft and bicycle frames where stiffness per mass governs',
          'Selecting spring materials by stored elastic energy per volume (σᵧ²/E)',
          'Early-stage screening of candidate materials before detailed analysis or supplier quotes',
        ],
        references: [
          { label: 'MIT OCW Unified Engineering — Lecture M21: Materials Selection', url: 'https://ocw.mit.edu/courses/16-01-unified-engineering-i-ii-iii-iv-fall-2005-spring-2006/21ecc9f12132147ce6c0fb33020972c4_zm21.pdf' },
        ],
      },
      {
        id: 'phase-diagram-lever-rule',
        title: 'Phase Diagrams & the Lever Rule (Fe–C)',
        duration: '16m',
        level: 'Intermediate',
        summary: 'Read a binary phase diagram and compute phase and microconstituent fractions with the lever rule.',
        description:
          'A phase diagram is a map of which phases are stable at each temperature and composition. Inside a two-phase region a horizontal tie line links the compositions of the two coexisting phases, and the lever rule says the fraction of each is the opposite arm of the tie line divided by its whole length. Applied to slow-cooled steel, the same rule predicts how much ferrite and cementite there is, and how much of the structure is lamellar pearlite versus proeutectoid ferrite or cementite.',
        status: 'active',
        learningObjectives: [
          'Draw a tie line and read the compositions of the two phases at a given temperature',
          'Apply the lever rule to find phase mass fractions in any two-phase region',
          'Predict the microconstituents (proeutectoid phase and pearlite) of a slow-cooled plain-carbon steel',
        ],
        formulas: [
          { label: 'Lever rule', formula: 'W_A = (C_B − C₀)/(C_B − C_A)', latex: 'W_A = \\frac{C_B - C_0}{C_B - C_A},\\quad W_B = \\frac{C_0 - C_A}{C_B - C_A}', note: 'C₀ is the alloy composition; C_A, C_B are the phase compositions at the tie-line ends. Each fraction is the opposite arm over the whole tie line.', emphasis: true },
          { label: 'Hypoeutectoid steel (C₀ < 0.76)', formula: 'W_α′ = (0.76 − C₀)/(0.76 − 0.022)', latex: "W_{\\alpha'} = \\frac{0.76 - C_0}{0.76 - 0.022},\\quad W_{pearlite} = 1 - W_{\\alpha'}", note: 'Proeutectoid ferrite forms above 727 °C; the remaining austenite becomes pearlite.' },
          { label: 'Hypereutectoid steel (C₀ > 0.76)', formula: 'W_Fe₃C′ = (C₀ − 0.76)/(6.70 − 0.76)', latex: "W_{Fe_3C'} = \\frac{C_0 - 0.76}{6.70 - 0.76},\\quad W_{pearlite} = 1 - W_{Fe_3C'}", note: 'Proeutectoid cementite instead of ferrite.' },
          { label: 'Total phases below 727 °C', formula: 'W_α = (6.70 − C₀)/(6.70 − 0.022)', latex: 'W_{\\alpha} = \\frac{6.70 - C_0}{6.70 - 0.022},\\quad W_{Fe_3C} = 1 - W_\\alpha', note: 'Tie line across ferrite (0.022 wt% C) to cementite (6.70 wt% C): counts the ferrite inside pearlite too.' },
        ],
        workedExample: {
          given: 'A plain-carbon steel with C₀ = 0.40 wt% C is cooled slowly to just below the eutectoid temperature (727 °C). Fe–C values: ferrite 0.022, eutectoid 0.76, cementite 6.70 wt% C.',
          find: 'The fraction of proeutectoid ferrite and pearlite, and the total ferrite and cementite.',
          steps: [
            'Hypoeutectoid, so just above 727 °C the tie line runs from ferrite (0.022) to austenite (0.76)',
            'Proeutectoid ferrite: W = (0.76 − 0.40)/(0.76 − 0.022) = 0.36/0.738 ≈ 0.488',
            'Pearlite: 1 − 0.488 ≈ 0.512',
            'Below 727 °C use the ferrite–cementite tie line: W_α = (6.70 − 0.40)/(6.70 − 0.022) = 6.30/6.678 ≈ 0.943',
            'Cementite: 1 − 0.943 ≈ 0.057',
          ],
          answer: 'The steel is about 48.8% proeutectoid ferrite and 51.2% pearlite. In terms of phases it is 94.3% ferrite and only 5.7% cementite, nearly all of that cementite sitting in the pearlite lamellae.',
        },
        challenges: [
          'Move C₀ to exactly 0.76 wt%. What happens to the proeutectoid fraction, and why is the structure fully pearlitic?',
          'Compare 0.20 wt% and 1.20 wt% C. Which has more pearlite, and which proeutectoid phase is present in each?',
        ],
        applications: [
          'Selecting a steel grade by carbon content for the strength/ductility balance of a part',
          'Predicting hardenability and heat-treatment response from how much pearlite or ferrite is present',
          'Reading casting and solidification behaviour from binary eutectic and isomorphous diagrams',
        ],
        references: [
          { label: 'LibreTexts — Chapter 4: Phase Diagrams (Mechanics and Science of Materials)', url: 'https://eng.libretexts.org/Courses/California_State_Polytechnic_University_Humboldt/Mechanics_and_Science_of_Materials/Chapter_4:_Phase_Diagrams' },
          { label: 'LibreTexts — Phase Equilibria and Phase Diagrams (MIT 3.091 lectures)', url: 'https://chem.libretexts.org/Bookshelves/Inorganic_Chemistry/Introduction_to_Solid_State_Chemistry/01:_Lectures/1.10:_Phase_Equilibria_and_Phase_Diagrams' },
        ],
      },
      {
        id: 'sheet-metal-bending',
        title: 'Sheet-Metal Bending & Springback',
        duration: '17m',
        level: 'Intermediate',
        summary: 'Bend allowance, flat-pattern length, V-die force, and how much to overbend to cancel springback.',
        description:
          'When a flat blank is bent, the outside stretches and the inside shortens, but a neutral axis near the middle keeps its length. That arc length, the bend allowance, lets you cut the right flat blank. Once the punch lifts, the elastic part of the strain recovers and the angle opens up: springback, which grows with yield strength and bend radius and shrinks with modulus and thickness. Compensating means forming past the target angle by the amount the model predicts.',
        status: 'active',
        learningObjectives: [
          'Compute bend allowance, bend deduction and the flat blank length using the K-factor',
          'Estimate the V-die bending force from strength, thickness and die opening',
          'Predict springback for an elastic–perfectly-plastic sheet and choose the overbend angle',
        ],
        formulas: [
          { label: 'Bend allowance', formula: 'BA = θ (r + K t)', latex: 'BA = \\theta\\,(r + K t)', note: 'θ in radians, r = inside radius, K = neutral-axis ratio (about 0.33 for tight bends, rising toward 0.5 for large radii).', emphasis: true },
          { label: 'Bend deduction and flat length', formula: 'BD = 2(r + t) tan(θ/2) − BA,  L = a + b − BD', latex: 'BD = 2(r+t)\\tan\\frac{\\theta}{2} - BA,\\quad L_{flat} = a + b - BD', note: 'a and b are outside flange lengths measured to the virtual sharp.' },
          { label: 'V-die bending force', formula: 'F = 1.33 · UTS · L t² / W', latex: 'F = \\frac{1.33\\,\\mathrm{UTS}\\,L\\,t^2}{W}', note: 'L = bend length, t = thickness, W = die opening; a common handbook estimate.' },
          { label: 'Springback radius ratio', formula: 'R_i/R_f = 4x³ − 3x + 1,  x = R_i Y/(E t)', latex: '\\frac{R_i}{R_f} = 4x^3 - 3x + 1,\\quad x = \\frac{R_i Y}{E t}', note: 'R is the neutral-axis radius. Derived for an elastic–perfectly-plastic rectangular section; x ≥ 0.5 means no permanent bend at all.' },
          { label: 'Angle ratio', formula: 'θ_f / θ_i = R_i / R_f', latex: '\\frac{\\theta_f}{\\theta_i} = \\frac{R_i}{R_f}', note: 'Neutral-axis arc length is unchanged by unloading, so the tool must form θ_i = θ_f / (R_i/R_f).' },
        ],
        workedExample: {
          given: 'A 90° bend in high-strength steel: t = 1.5 mm, inside radius r = 6 mm, K = 0.4, outside flanges a = 40 mm and b = 60 mm, Y = 600 MPa, E = 200 GPa.',
          find: 'The flat blank length, and the tool angle needed to end at exactly 90°.',
          steps: [
            'BA = (π/2)(6 + 0.4 × 1.5) = 1.5708 × 6.6 ≈ 10.37 mm',
            'Outside setback = (r + t) tan 45° = 7.5 mm, so BD = 2(7.5) − 10.37 ≈ 4.63 mm',
            'Flat length = 40 + 60 − 4.63 ≈ 95.37 mm',
            'Neutral radius R_i = 6 + 0.75 = 6.75 mm; x = 6.75 × 600 / (200,000 × 1.5) = 0.0135',
            'R_i/R_f = 4x³ − 3x + 1 = 1 − 0.0405 + 0.00001 ≈ 0.9595',
            'Tool angle θ_i = 90° / 0.9595 ≈ 93.8°, so springback ≈ 3.8°',
          ],
          answer: 'Cut a blank 95.4 mm long and form it to about 93.8° so the part relaxes to 90°. The same part in mild steel (Y = 250 MPa) springs back well under 2°.',
        },
        challenges: [
          'Increase the inside radius from 6 mm to 20 mm for the same sheet. What happens to springback, and why do large-radius bends spring back more?',
          'Switch from high-strength steel to Al 5052. Y/E is lower but so is E; which effect dominates?',
        ],
        applications: [
          'Laying out flat patterns for brackets, enclosures and chassis cut on a laser or turret punch',
          'Setting press-brake overbend and bottoming to hit angle on high-strength automotive parts',
          'Estimating press-brake tonnage when selecting a machine for a given sheet and bend length',
        ],
        references: [
          { label: 'NPTEL — Sheet metal operations: Bending and related processes', url: 'https://archive.nptel.ac.in/content/storage2/courses/112106153/Module%207/Lecture%202/Module_7_Sheet_Metal-Forming-Lecture_2_Quiz_Key.pdf' },
          { label: 'NPTEL — Mechanics of Sheet Metal Forming', url: 'https://onlinecourses.nptel.ac.in/noc24_me51/preview' },
        ],
      },
      {
        id: 'tolerance-stackup',
        title: 'Tolerance Stack-Up & ISO Fits',
        duration: '16m',
        level: 'Intermediate',
        summary: 'ISO 286 limits and fits, plus worst-case versus statistical (RSS) stack-up of a gap.',
        description:
          'No part is made to its exact nominal size, so every dimension carries a tolerance band. For mating parts, ISO 286 standardises those bands as a letter (where the zone sits relative to the basic size) and an IT grade (how wide it is), giving clearance, transition or interference fits. For a chain of parts, the tolerances add up in the gap between them: worst-case assumes every part is at its limit simultaneously, while the root-sum-square (RSS) method uses the fact that extremes rarely coincide.',
        status: 'active',
        learningObjectives: [
          'Decode an ISO fit designation such as H7/g6 into hole and shaft limits and classify the fit',
          'Compute the gap and its variation for a one-dimensional tolerance chain',
          'Compare worst-case and RSS stack-ups and explain when each is appropriate',
        ],
        formulas: [
          { label: 'Fit clearance', formula: 'C_max = ES − ei,  C_min = EI − es', latex: 'C_{max} = ES - ei,\\quad C_{min} = EI - es', note: 'ES/EI are hole upper/lower deviations, es/ei are shaft deviations. C_min ≥ 0 is a clearance fit, C_max ≤ 0 is interference, otherwise transition.', emphasis: true },
          { label: 'Standard tolerance (IT grade)', formula: 'i = 0.45 ∛D + 0.001 D;  IT7 = 16 i', latex: 'i = 0.45\\sqrt[3]{D} + 0.001\\,D\\ (\\mu m),\\quad IT7 = 16\\,i', note: 'D is the geometric mean of the size range in mm. ISO tabulates rounded values for each grade; IT6 = 10 i, IT8 = 25 i, IT9 = 40 i.' },
          { label: 'Worst-case stack', formula: 'T_wc = Σ t_i', latex: 'T_{wc} = \\sum_i t_i', note: 'Guarantees the assembly in every case; usually expensive.' },
          { label: 'RSS stack', formula: 'T_rss = √(Σ t_i²)', latex: 'T_{rss} = \\sqrt{\\sum_i t_i^2}', note: 'Assumes independent, centred, roughly normal variation (band ≈ ±3σ); accepts a small fraction of out-of-limit assemblies.' },
        ],
        workedExample: {
          given: 'Part 1: a 25 mm shaft–hole pair, H7/g6. Part 2: a bearing stack in a housing, gap = A − B − C − D with A = 50 ± 0.10, B = 20 ± 0.05, C = 25 ± 0.05, D = 4.5 ± 0.03 mm.',
          find: 'The H7/g6 limits and clearance, and the gap with worst-case and RSS tolerances.',
          steps: [
            'For 18–30 mm: IT7 = 21 µm (hole), IT6 = 13 µm (shaft), g fundamental deviation es = −7 µm',
            'Hole H7: 25.000 to 25.021 mm. Shaft g6: es = −7 µm, ei = −20 µm, so 24.980 to 24.993 mm',
            'C_min = 0 − (−7) = 7 µm, C_max = 21 − (−20) = 41 µm: a clearance (sliding) fit',
            'Nominal gap = 50 − 20 − 25 − 4.5 = 0.5 mm',
            'Worst case: 0.10 + 0.05 + 0.05 + 0.03 = ±0.23 mm, so gap 0.27 to 0.73 mm',
            'RSS: √(0.10² + 0.05² + 0.05² + 0.03²) = √0.0159 ≈ ±0.126 mm, so gap 0.374 to 0.626 mm',
          ],
          answer: 'H7/g6 on 25 mm gives 7–41 µm of clearance. The stack-up gap is 0.50 mm, ±0.23 mm worst case but only ±0.126 mm by RSS, nearly half as wide. The 0.10 mm housing tolerance alone contributes 63% of the RSS variance, so tightening it pays off most.',
        },
        challenges: [
          'Change the shaft from g6 to p6 for the same 25 mm hole. What kind of fit results, and what are the minimum and maximum interference?',
          'Halve only the largest tolerance in the stack. How much does the RSS band shrink compared with halving the smallest one?',
        ],
        applications: [
          'Specifying bearing seats, locating pins and sliding bushings with standard ISO fits',
          'Making sure a snap ring, spacer and bearing stack always leaves clearance in a gearbox housing',
          'Allocating tolerances to cost: tighten only the dimensions that dominate the gap variation',
        ],
        references: [
          { label: 'MIT OCW — 2.008 Design and Manufacturing II (quality and variation)', url: 'https://ocw.mit.edu/courses/2-008-design-and-manufacturing-ii-spring-2025/' },
        ],
      },
    ],
  },
]

export const EXTRA_TOPICS: { courseId: string; topics: TopicMeta[] }[] = []
