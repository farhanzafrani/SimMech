import type { TeachingContent } from '../teachingTypes'
import { EE } from '../teachingTypes'

/** Heat Transfer (2.051) teaching content. */
export const CONTENT: Record<string, TeachingContent> = {
  'conduction-resistance-networks': {
    intuition:
      'Heat flowing through a wall behaves like current through a string of resistors. The temperature difference across the whole wall is the "voltage", the heat rate is the "current", and every layer, plus the thin stagnant film of air or water clinging to each surface, is a resistor that eats a share of the voltage in proportion to its resistance. The same heat rate must pass through every layer (nothing is stored in steady state), so the layer that resists most takes the biggest temperature drop. That is why a few centimetres of low-conductivity insulation dwarfs a thick slab of brick or a steel casing: the steel in a furnace wall might drop only a twentieth of a kelvin while the insulation drops hundreds. Round things add a twist: in a pipe the heat spreads over a larger and larger area as it moves outward, so a thin layer on a small wire can actually help the wire shed heat rather than trap it.',
    derivation: [
      {
        text: 'Start from Fourier’s law, an empirical statement that heat flux is proportional to the temperature gradient and points from hot to cold:',
        latex: 'q\'\' = -k\\,\\frac{dT}{dx}',
      },
      {
        text: 'In steady state with no heat generation, the energy balance on a slab says the heat rate q through the area A is the same at every x. For constant k the temperature profile is therefore a straight line:',
        latex: 'q = -kA\\,\\frac{dT}{dx} = \\text{const} \\;\\Rightarrow\\; T(x) = T_1 - \\frac{q}{kA}\\,x',
      },
      {
        text: 'Evaluate across the thickness L. The rearranged result has the same form as Ohm’s law, ΔV = IR, which defines the conduction resistance:',
        latex: 'q = \\frac{T_1 - T_2}{L/(kA)} \\;\\Rightarrow\\; R_{cond} = \\frac{L}{kA}',
      },
      {
        text: 'Convection at a surface follows Newton’s law of cooling, q = hA(T_s − T∞). Reading it as ΔT = qR gives a film resistance in the same units (K/W):',
        latex: 'R_{conv} = \\frac{1}{hA}',
      },
      {
        text: 'Elements in series carry the same q, so their ΔT’s add up to the total, which means their resistances add. Each individual drop is ΔT_i = qR_i:',
        latex: 'q = \\frac{T_{\\infty,1} - T_{\\infty,2}}{\\sum R_i}',
      },
      {
        text: 'For a cylindrical shell the area is 2πrL and grows with r, so the constant quantity is q = −k(2πrL) dT/dr. Separating variables and integrating from r₁ to r₂ gives a logarithmic profile and:',
        latex: 'R_{cond} = \\frac{\\ln(r_2/r_1)}{2\\pi k L}',
      },
      {
        text: 'Add insulation of outer radius r to a pipe: the conduction resistance grows like ln r but the outer film resistance 1/(2πrLh) shrinks like 1/r. Setting the derivative of the total resistance to zero gives the critical radius below which insulating makes things worse:',
        latex: 'r_{crit} = \\frac{k_{ins}}{h}',
      },
    ],
    commonMistakes: [
      'Forgetting the film resistances. If you only add up the solid layers, you overpredict the heat loss, sometimes badly: in the furnace example the two films carry 0.14 K/W of a 1.86 K/W total, but with thin or highly conductive walls they can be most of the resistance.',
      'Using the plane-wall formula L/(kA) for a pipe. The area changes with radius, so you need ln(r₂/r₁)/(2πkL). For thin shells (r₂/r₁ near 1) the two agree, but for thick insulation the plane-wall error is large.',
      'Mixing resistance per unit area (m²·K/W) with total resistance (K/W). If you add a layer of R″ = L/k to one that already includes 1/A, the sum is meaningless. Choose per-area or total and stick to it.',
      'Mistaking the temperature of the fluid for the temperature of the surface. The network drives q from T∞,1 to T∞,2; the wall surface temperatures come afterwards from ΔT = qR for each film, and differ from the fluid temperatures.',
      'Believing more insulation always reduces heat loss on a curved surface. Below r_crit = k/h (a few mm for typical insulation in air) adding insulation raises the loss. This matters for small wires and tubes, not for ordinary steam lines.',
      'Using one k for everything. Conductivity varies with temperature, with moisture (wet insulation can be several times worse) and, for composites, with direction. For large temperature differences evaluate k at the mean layer temperature.',
    ],
    rulesOfThumb: [
      'The biggest resistance wins. Find it first: it controls both the heat rate and where most of the temperature drop appears. Improving a layer that carries 1 % of the drop is wasted effort.',
      'Doubling insulation never halves the loss while films and other layers are present. In the furnace example, doubling the insulation cuts q from 417 to roughly 224 W/m², about 46 %, not 50 %, and each further doubling gains less.',
      'Typical k values, roughly: copper about 400, aluminium about 200, steel about 15 to 50, brick and concrete around 1, mineral wool and foam insulation around 0.03 to 0.05 W/m·K. A factor of 10 in k is a factor of 10 in resistance for the same thickness.',
      'Natural convection in air gives film coefficients of only about 5 to 25 W/m²·K, so for bare surfaces the outside film is often a major resistance, and wind or forced flow changes the answer substantially.',
    ],
    designChecklist: [
      'Sketch the path: fluid 1, film, each layer in order, film, fluid 2, and decide whether the geometry is plane or cylindrical.',
      'Collect conductivities (at the right temperature) and film coefficients, and be explicit about the area or per-metre-length basis.',
      'Compute each resistance in consistent units and add them.',
      'Compute q = ΔT_total / ΣR.',
      'Back out interface and surface temperatures with ΔT_i = qR_i, and compare with material limits (adhesive, jacket, burn hazard, condensation).',
      'For pipes and wires, check r_crit = k/h against the outer radius before assuming that insulation helps.',
      'Sensitivity check: which resistance dominates? Spend the money there.',
    ],
    prerequisites: [
      { courseId: 'thermal-fluids-engineering', topicId: 'first-law-thermodynamics', why: 'Steady conduction is an energy balance: heat in equals heat out through every layer.' },
    ],
    videos: [
      {
        id: '6jQsLAqrZGQ',
        title: 'Understanding Conduction and the Heat Equation',
        channel: EE,
        why: 'Matches this topic; a visual treatment of conduction and the heat equation behind Fourier’s law.',
      },
    ],
    quiz: [
      {
        kind: 'numeric',
        prompt: 'A 0.20 m thick concrete wall (k = 1.4 W/m·K) has area 10 m². The inner surface is at 20 °C and the outer surface at −10 °C. What is the steady heat loss through the wall?',
        answer: 2100,
        unit: 'W',
        explanation:
          'Conduction only, so q = kAΔT/L = 1.4 × 10 × 30 / 0.20 = 2100 W. The surface temperatures are given, so no film resistances are needed; the heat rate is just ΔT divided by L/(kA) = 0.0143 K/W.',
      },
      {
        kind: 'choice',
        prompt: 'In a series wall (brick, insulation, steel casing), which layer shows the largest temperature drop?',
        options: [
          'The thickest layer, regardless of conductivity',
          'The layer with the highest conductivity, because heat flows most readily through it',
          'The layer with the largest thermal resistance L/(kA)',
          'All layers drop equally, because the same heat rate passes through each',
        ],
        correct: 2,
        explanation:
          'The same q passes through every layer, so ΔT_i = qR_i, and the drop is proportional to resistance. A thin insulating layer can easily out-resist a thick metal one. The "same q" fact in the last option is true but does not mean equal ΔT.',
      },
      {
        kind: 'numeric',
        prompt: 'A pipe of 20 mm outer radius is wrapped with insulation (k = 0.04 W/m·K) out to a 50 mm outer radius. If the temperature difference across the insulation is 100 K, what is the heat loss per metre of pipe?',
        answer: 27.4,
        unit: 'W/m',
        explanation:
          'R = ln(r₂/r₁)/(2πkL) = ln(2.5)/(2π × 0.04 × 1) = 3.646 K/W per metre. Then q = ΔT/R = 100/3.646 = 27.4 W/m. Using a flat-wall formula with a single area would give a visibly different answer, because the area grows outward.',
      },
      {
        kind: 'choice',
        prompt: 'A student computes the heat loss through a furnace wall by adding the resistances L/(kA) of the brick and insulation and dividing the gas-to-room temperature difference by that sum. What is the error?',
        options: [
          'The resistances should be multiplied, not added',
          'Temperature difference should be in kelvin, never in °C',
          'The insulation should be left out, because its conductivity is too low to matter',
          'The inside and outside convective film resistances 1/(hA) have been left out, although the driving difference is between the fluids',
        ],
        correct: 3,
        explanation:
          'The driving difference is between the gas and the room air, so the path includes the two films. Leaving them out overstates q. The °C versus K point is a non-issue because only differences are used, and series resistances do add.',
      },
      {
        kind: 'numeric',
        prompt: 'In the worked furnace wall (ΣR = 1.8601 K/W for 1 m², ΔT = 775 K), the insulation thickness is doubled from 80 mm to 160 mm (k = 0.05 W/m·K). What is the new heat loss?',
        answer: 224,
        unit: 'W',
        explanation:
          'Insulation resistance goes from 1.6 to 3.2 K/W, so ΣR = 1.8601 + 1.6 = 3.4601 K/W and q = 775/3.4601 = 224 W. That is about 46 % less, not 50 %: the other resistances (0.26 K/W) do not go away, which is why the benefit of each doubling shrinks.',
      },
      {
        kind: 'choice',
        prompt: 'A bare electrical wire of outer radius 1 mm is coated with a thin plastic layer (k = 0.2 W/m·K) in still air with h = 10 W/m²·K. What happens?',
        options: [
          'The wire runs hotter, because any added layer adds resistance',
          'The wire can run cooler, because r_crit = k/h = 20 mm exceeds the wire radius, so the larger outer area helps more than the layer hurts',
          'Nothing changes, because plastic conductivity is too low to matter',
          'The wire runs cooler only if the coat is thicker than 20 mm',
        ],
        correct: 1,
        explanation:
          'r_crit = k/h = 0.2/10 = 0.02 m. While the outer radius is below that, the film resistance falls faster (1/r) than the conduction resistance rises (ln r), so total resistance drops and the wire sheds more heat. The improvement starts immediately and peaks at 20 mm; beyond that the coat starts to insulate.',
      },
    ],
  },

  'fins-extended-surfaces': {
    intuition:
      'A fin is a metal finger that carries heat out of a hot surface and hands it to the surrounding fluid along its whole length. Heat enters at the base and has to travel along the fin through the metal while leaking out sideways to the air. The leaking makes the fin cooler as you move out, so the outer portion sits closer to the air temperature and does less work. A short, stubby, highly conductive fin stays nearly at base temperature and works hard everywhere. A long, thin, poorly conducting fin cools off so quickly that its tip hardly contributes, and extending it adds more weight than cooling. The whole idea only pays off when convection from the surface is the bottleneck, as it is for gases; in water the fluid takes heat so readily that a fin is much less useful.',
    derivation: [
      {
        text: 'Take a thin straight fin of constant cross-section area A_c and perimeter P, with the base at T_b and fluid at T∞. Write the steady energy balance on a slice dx: heat conducted in minus conducted out equals heat convected from the side surface P dx.',
        latex: 'kA_c\\,\\frac{d^2T}{dx^2}\\,dx - hP\\,(T - T_\\infty)\\,dx = 0',
      },
      {
        text: 'Define the excess temperature θ = T − T∞ and the fin parameter m. The balance becomes a linear second-order ODE:',
        latex: '\\frac{d^2\\theta}{dx^2} - m^2\\theta = 0,\\qquad m = \\sqrt{\\frac{hP}{kA_c}}',
      },
      {
        text: 'The general solution is a combination of decaying and growing exponentials, or equivalently cosh and sinh. The length 1/m sets how quickly the excess temperature decays along the fin:',
        latex: '\\theta(x) = C_1 e^{mx} + C_2 e^{-mx}',
      },
      {
        text: 'Boundary conditions: θ(0) = θ_b at the base, and at the tip the conduction arriving equals convection leaving, −k dθ/dx = hθ at x = L. Applying them gives the temperature profile:',
        latex: '\\frac{\\theta}{\\theta_b} = \\frac{\\cosh m(L-x) + (h/mk)\\sinh m(L-x)}{\\cosh mL + (h/mk)\\sinh mL}',
      },
      {
        text: 'All heat leaving the fin must pass through the base, so the fin heat rate is Fourier conduction evaluated at x = 0. With M = √(hPkA_c) θ_b:',
        latex: 'q_f = -kA_c\\,\\left.\\frac{d\\theta}{dx}\\right|_{x=0} = M\\,\\frac{\\tanh mL + h/mk}{1 + (h/mk)\\tanh mL}',
      },
      {
        text: 'Compare with the ideal case in which the entire fin surface sat at T_b, and with the bare base without a fin. These ratios are the fin efficiency and effectiveness. For an adiabatic tip q_f = M tanh mL, which saturates to M (the infinite fin) once mL is roughly 3 or more:',
        latex: '\\eta_f = \\frac{q_f}{hA_f\\theta_b},\\qquad \\varepsilon_f = \\frac{q_f}{hA_c\\theta_b}',
      },
    ],
    commonMistakes: [
      'Mixing up the perimeter P and cross-section area A_c. For a round pin P = πD and A_c = πD²/4, so P/A_c = 4/D; for a thin rectangular strip P/A_c is about 2/t. Using the wrong ratio puts m off by large factors.',
      'Applying the adiabatic-tip formula to a short, stubby fin. When the tip area is a substantial fraction of the whole surface (small L/D), tip convection matters; use the convective-tip formula or the corrected-length trick L_c = L + A_c/P.',
      'Treating longer as always better. The added heat follows tanh mL, so beyond mL ≈ 2 to 3 you are adding mass and cost for almost nothing; the tip is by then nearly at the fluid temperature.',
      'Judging a fin by efficiency alone. A 95 %-efficient fin can still be a bad idea if its effectiveness is near 1. Fins are only justified when ε_f is well above 2.',
      'Putting fins on the side that already has high h. A fin helps when the surface-to-fluid conductance is the bottleneck, so add fins to the gas side of a gas-to-liquid heat exchanger, not the liquid side.',
      'Ignoring contact resistance at the fin base and the spacing between fins. Poorly bonded fins, and fins spaced so closely that their boundary layers merge, perform noticeably worse than the isolated-fin formula suggests.',
    ],
    rulesOfThumb: [
      'mL is the quick screening number. If mL is below roughly 1 the fin is nearly isothermal (adiabatic-tip efficiency tanh(mL)/mL is about 76 % at mL = 1 and higher below it); above about 3 the tip is nearly at fluid temperature and the extra length is wasted.',
      'Fin effectiveness above about 2 is the minimum for a fin to be worth adding; practical fins in air usually do far better (the worked pin fin has ε ≈ 35).',
      'Raising h reduces fin efficiency and effectiveness, because m grows. Fins pay off in air (h roughly 10 to 100 W/m²·K) and are much less useful in water or boiling.',
      'Aluminium and copper make effective fins; stainless steel (k ≈ 15 W/m·K) makes poor ones. Lower k raises m, so the fin cools off sooner along its length.',
    ],
    designChecklist: [
      'Establish the base excess temperature θ_b and the air-side h, and confirm that the convective side is the bottleneck.',
      'Choose a geometry and material; compute P, A_c and m = √(hP/kA_c).',
      'Pick the tip condition: adiabatic (with corrected length), convective, or infinite.',
      'Compute q_f, then η_f and ε_f, and check ε_f is well above 2.',
      'Check mL: if it is above about 3, shorten or thin the fin rather than lengthen it.',
      'For arrays, account for spacing, base temperature depression and the unfinned base area (q_total = q_fins + hA_unfinned θ_b).',
      'Check mass, cost, manufacturability and fouling before finalising.',
    ],
    prerequisites: [
      { courseId: 'heat-transfer', topicId: 'conduction-resistance-networks', why: 'A fin is conduction along the metal plus convection at its surface, so you need Fourier’s law and film conductance first.' },
    ],
    quiz: [
      {
        kind: 'numeric',
        prompt: 'A stainless-steel pin fin of diameter 4 mm (k = 15 W/m·K) sits in air with h = 25 W/m²·K. What is the fin parameter m?',
        answer: 40.8,
        unit: 'm⁻¹',
        explanation:
          'For a round pin P/A_c = 4/D, so m = √(4h/(kD)) = √(4 × 25/(15 × 0.004)) = √1666.7 = 40.8 m⁻¹. The decay length 1/m is about 24 mm, so a stainless fin much longer than that is mostly wasted.',
      },
      {
        kind: 'choice',
        prompt: 'A student says: "My fin has an efficiency of 90 % and an effectiveness of 1.1, so it is an excellent fin." What is wrong?',
        options: [
          'Efficiency cannot be above 80 % for a real fin',
          'Effectiveness near 1 means the fin adds almost nothing over the bare base, so it is not worth adding',
          'Effectiveness must always be below efficiency',
          'Efficiency and effectiveness are the same quantity expressed differently',
        ],
        correct: 1,
        explanation:
          'Effectiveness compares the fin against leaving the bare base alone. A value of 1.1 means the fin barely helps; high efficiency just says the fin is nearly isothermal. The two are different ratios, and a good fin typically has efficiency near 100 % and effectiveness in the tens.',
      },
      {
        kind: 'numeric',
        prompt: 'An aluminium pin fin (k = 200 W/m·K), D = 3 mm, L = 40 mm, in air with h = 30 W/m²·K, base 60 K above the air. Using the adiabatic-tip model, what is the heat rate q_f?',
        answer: 0.614,
        unit: 'W',
        tolerance: 0.03,
        explanation:
          'm = √(4h/(kD)) = √(4 × 30/(200 × 0.003)) = 14.14 m⁻¹, so mL = 0.566 and tanh(mL) = 0.512. M = √(hPkA_c) θ_b = 1.1996 W, so q_f = M tanh(mL) = 1.1996 × 0.512 = 0.614 W.',
      },
      {
        kind: 'numeric',
        prompt: 'For an adiabatic-tip fin, what percentage of the infinite-fin heat rate is delivered when mL = 3?',
        answer: 99.5,
        unit: '%',
        explanation:
          'q_f/M = tanh(mL) = tanh(3) = 0.9951. Almost nothing is gained by extending the fin further, which is why mL of about 2 to 3 is the practical limit.',
      },
      {
        kind: 'choice',
        prompt: 'A gas-to-water heat exchanger has h = 40 W/m²·K on the gas side and 3000 W/m²·K on the water side. Where should the fins go?',
        options: [
          'On the water side, because water carries more heat',
          'On both sides equally, to keep the design symmetric',
          'Nowhere, because fins only help when the base is hotter than 200 °C',
          'On the gas side, because that is where the convective resistance is large and extra area helps most',
        ],
        correct: 3,
        explanation:
          'The overall resistance is dominated by the gas side (1/40 versus 1/3000), so adding area there cuts the largest resistance. On the water side the film resistance is already tiny and fins would barely help, and their efficiency would be poor because h is high.',
      },
      {
        kind: 'choice',
        prompt: 'The same pin-fin geometry is built in stainless steel instead of aluminium. Which statement is correct?',
        options: [
          'm is higher for the stainless fin, so the temperature falls off faster along its length and efficiency drops',
          'm is lower for the stainless fin, so it stays hotter along its length',
          'm is unchanged, since m depends only on geometry',
          'm is higher, but efficiency rises because a hotter fin loses more heat',
        ],
        correct: 0,
        explanation:
          'm = √(hP/kA_c) rises as k falls. A larger m shortens the decay length 1/m, so the stainless fin cools off close to the base and a smaller fraction of its surface does useful work: lower efficiency.',
      },
    ],
  },

  'transient-lumped-capacitance': {
    intuition:
      'Plunge a hot metal ball into cool water and two things must happen in sequence: heat has to conduct from the middle of the ball to its surface, and then it has to be carried away by the water. If the metal conducts heat easily compared with how hard the water pulls it off, the ball has time to even out internally, and the whole ball cools together as if it were a single lump with one temperature. That single temperature obeys a one-line law: its rate of cooling is proportional to how far it still is from the fluid, which gives an exponential decay with one time constant, the thermal mass divided by the surface conductance. If instead the surface is pulled cold faster than the interior can respond, the skin chills while the centre stays hot, and a single temperature is a lie. The Biot number is the ratio of those two resistances, internal conduction over surface convection, and tells you which picture is true.',
    derivation: [
      {
        text: 'Assume the body is at one uniform temperature T(t) at every instant. The energy balance on the whole body says the stored energy changes only by convection from its surface:',
        latex: '\\rho V c\\,\\frac{dT}{dt} = -hA_s\\,(T - T_\\infty)',
      },
      {
        text: 'Introduce θ = T − T∞. Because T∞ is constant, dθ/dt = dT/dt, and the equation becomes a first-order linear ODE with a single rate constant, whose inverse is the time constant τ:',
        latex: '\\frac{d\\theta}{dt} = -\\frac{hA_s}{\\rho V c}\\,\\theta = -\\frac{\\theta}{\\tau},\\qquad \\tau = \\frac{\\rho c V}{hA_s} = \\frac{\\rho c L_c}{h}',
      },
      {
        text: 'Integrate from the initial excess θ_i. The body approaches the fluid temperature exponentially; after one τ it has closed 63.2 % of the gap:',
        latex: '\\frac{T - T_\\infty}{T_i - T_\\infty} = e^{-t/\\tau}',
      },
      {
        text: 'Now test the assumption. Compare the resistance to conduction inside the body, about L_c/k, with the resistance to convection at the surface, 1/h. Their ratio is the Biot number:',
        latex: '\\mathrm{Bi} = \\frac{L_c/k}{1/h} = \\frac{hL_c}{k},\\qquad L_c = \\frac{V}{A_s}',
      },
      {
        text: 'When Bi is small, internal temperature differences are small compared with the overall temperature change, and the lumped model holds; the common threshold is Bi < 0.1. Writing time in dimensionless form collapses geometry and material into two numbers (using α = k/ρc, so Bi·Fo = t/τ):',
        latex: '\\frac{\\theta}{\\theta_i} = \\exp(-\\mathrm{Bi}\\,\\mathrm{Fo}),\\qquad \\mathrm{Fo} = \\frac{\\alpha t}{L_c^2}',
      },
    ],
    commonMistakes: [
      'Using Biot with the wrong characteristic length. L_c = V/A_s: r/3 for a sphere, r/2 for a long cylinder, the half-thickness for a plate heated on both faces. Using the full radius overstates Bi and can wrongly throw out a valid lumped model.',
      'Using the fluid’s conductivity in Bi. Bi uses the solid’s k (internal resistance). Using the fluid’s k gives the Nusselt number instead.',
      'Applying the lumped model to a body with Bi well above 0.1, such as a thick steel billet being water-quenched, and then predicting the centre temperature. The surface will be much colder than the middle, and for quenching that gradient is exactly what matters for distortion, cracking and hardness.',
      'Treating h as constant when it is not. In natural convection, radiation or boiling, h changes with surface temperature, so τ changes during the transient and the pure exponential is only approximate.',
      'Mixing time units: a τ in seconds with t in minutes. The temperature ratio is safe in °C or K (only differences enter), but the time units must match.',
      'Misreading the exponential. At t = τ the body has covered 63.2 % of the way to the fluid temperature; after 3τ about 95 % and 5 % remains; you only get within 1 % at roughly 4.6τ.',
    ],
    rulesOfThumb: [
      'Bi < 0.1 is the usual validity test for lumped capacitance. It is a rule, not a cliff: near Bi = 0.1 the error is on the order of a few percent.',
      'Time to get within 5 % of the final temperature is roughly 3τ; within 1 % it is about 4.6τ (ln 100).',
      'Halving the characteristic size halves τ and halves Bi, so small things respond fast and obey the lumped model better, which is why thermocouple beads are tiny.',
      'Small, conductive metal objects in gas flow nearly always pass the Bi test; thick or poorly conductive solids (rock, food, ceramics) in liquids usually do not.',
    ],
    designChecklist: [
      'Identify the body, its volume and the surface area exposed to the fluid, and compute L_c = V/A_s.',
      'Estimate h from the flow situation (it is often the least certain input).',
      'Compute Bi = hL_c/k and check Bi < 0.1; if not, use the full transient solution (Heisler charts or the series solution with Fo).',
      'Compute τ = ρcL_c/h.',
      'Find T(t), or the time to a target temperature, from the exponential.',
      'Check sensitivity: how does the answer change if h is off by 30 %? (τ scales as 1/h.)',
    ],
    prerequisites: [
      { courseId: 'heat-transfer', topicId: 'conduction-resistance-networks', why: 'Bi is a ratio of an internal conduction resistance to a surface convection resistance, as built in the resistance network.' },
      { courseId: 'thermal-fluids-engineering', topicId: 'first-law-thermodynamics', why: 'The lumped model is a transient first-law balance on the body.' },
    ],
    quiz: [
      {
        kind: 'numeric',
        prompt: 'A steel sphere (k = 45 W/m·K) of radius 25 mm sits in a fluid with h = 200 W/m²·K. What is its Biot number, using the characteristic length V/A_s?',
        answer: 0.037,
        explanation:
          'L_c = r/3 = 0.025/3 = 8.33 mm. Bi = hL_c/k = 200 × 0.008333/45 = 0.037, comfortably below 0.1, so lumped capacitance is valid. (Using L_c = r would give 0.111 and the wrong conclusion.)',
      },
      {
        kind: 'numeric',
        prompt: 'A thermocouple bead is modelled as a sphere of radius 0.5 mm with ρ = 8500 kg/m³ and c = 400 J/kg·K, in a gas stream with h = 200 W/m²·K. What is its time constant?',
        answer: 2.83,
        unit: 's',
        explanation:
          'L_c = r/3 = 0.1667 mm, and τ = ρcL_c/h = 8500 × 400 × 1.667×10⁻⁴ / 200 = 2.83 s. The bead needs about 3τ ≈ 8.5 s to get within 5 %; to respond faster you must shrink the bead or raise h.',
      },
      {
        kind: 'choice',
        prompt: 'A student says: "After three time constants the body has reached its final temperature." What is the best correction?',
        options: [
          'Correct as stated, since exponentials finish at 3τ',
          'After 3τ the body has covered about 95 % of the gap; about 5 % remains (e⁻³ ≈ 0.05)',
          'After 3τ only 63 % of the gap is closed',
          'After 3τ about 37 % remains, because e⁻¹ = 0.37',
        ],
        correct: 1,
        explanation:
          'The remaining fraction is e^(−t/τ) = e⁻³ = 0.0498, so about 95 % of the change is done, but it is never fully 100 %. The 63 % and 37 % figures apply at t = τ, not at 3τ.',
      },
      {
        kind: 'numeric',
        prompt: 'A long cylinder of radius 10 mm (k = 15 W/m·K) is cooled in a stream with h = 500 W/m²·K. What is its Biot number?',
        answer: 0.167,
        explanation:
          'For a long cylinder L_c = r/2 = 5 mm, so Bi = 500 × 0.005/15 = 0.167. That is above 0.1, so the lumped model is not reliable here: the centre will lag the surface noticeably.',
      },
      {
        kind: 'numeric',
        prompt: 'A body at 300 °C is placed in 20 °C fluid and has a time constant of 40 s. What is its temperature after 60 s (lumped model)?',
        answer: 82.5,
        unit: '°C',
        explanation:
          'T = T∞ + (T_i − T∞) e^(−t/τ) = 20 + 280 × e^(−1.5) = 20 + 280 × 0.2231 = 82.5 °C.',
      },
      {
        kind: 'choice',
        prompt: 'The radius of a sphere is doubled with everything else fixed. What happens to τ and Bi?',
        options: [
          'Both double',
          'τ doubles and Bi halves',
          'τ is unchanged and Bi doubles',
          'τ quadruples and Bi doubles',
        ],
        correct: 0,
        explanation:
          'Both τ = ρcL_c/h and Bi = hL_c/k are proportional to L_c = r/3, so both double. Bigger bodies respond more slowly and are more likely to violate the lumped assumption.',
      },
    ],
  },

  'forced-convection-heat-exchangers': {
    intuition:
      'Heat leaves a wall into a fluid only through a thin sheared layer next to the surface, and how fast it leaves depends on how thin that layer is. Push the fluid faster and the layer thins; make the flow turbulent and eddies stir fresh fluid up to the wall, which can multiply the film coefficient severalfold. That is the forced-convection half of the story, packaged into correlations that give a Nusselt number from the Reynolds and Prandtl numbers. The exchanger half is bookkeeping. Heat has to cross three resistances in series, the hot film, the wall and the cold film, which combine into one overall coefficient U dominated by the worst film. Then you need the temperature difference that drives heat across the surface, which is not constant: it shrinks along the exchanger as the hot stream cools and the cold stream warms. The log-mean temperature difference averages that properly when you know all four temperatures; effectiveness and NTU let you predict outlets from inlets alone, by asking what fraction of the thermodynamic maximum you achieve.',
    derivation: [
      {
        text: 'Define the film coefficient from Newton’s law and make it dimensionless with the tube diameter. Dimensional analysis says the Nusselt number depends only on Reynolds and Prandtl numbers for developed internal flow. For turbulent flow the Dittus–Boelter correlation is an empirical fit:',
        latex: 'h = \\frac{\\mathrm{Nu}\\,k}{D},\\qquad \\mathrm{Nu} = 0.023\\,\\mathrm{Re}^{0.8}\\,\\mathrm{Pr}^{0.4}\\ (\\text{heating})',
      },
      {
        text: 'Heat crosses the hot film, the wall and the cold film in series, so the resistances add per unit area. Neglecting wall and fouling resistance leaves two films, and the overall coefficient is dominated by the smaller h:',
        latex: '\\frac{1}{U} = \\frac{1}{h_i} + \\frac{1}{h_o}',
      },
      {
        text: 'Apply the first law to each stream. With C = ṁc_p, the heat duty and the temperature changes are linked by:',
        latex: 'Q = C_h\\,(T_{h,in} - T_{h,out}) = C_c\\,(T_{c,out} - T_{c,in})',
      },
      {
        text: 'For a local element, dQ = U (T_h − T_c) dA. For counterflow or parallel flow, ΔT = T_h − T_c varies exponentially with area, so integrating over the whole area gives a log-mean average rather than an arithmetic one:',
        latex: 'Q = UA\\,\\Delta T_{lm},\\qquad \\Delta T_{lm} = \\frac{\\Delta T_1 - \\Delta T_2}{\\ln(\\Delta T_1/\\Delta T_2)}',
      },
      {
        text: 'When outlet temperatures are not known, define the maximum possible heat transfer (an infinitely long counterflow exchanger, where the stream with the smaller C changes by the full inlet-to-inlet difference) and the effectiveness as the fraction achieved:',
        latex: 'Q_{max} = C_{min}\\,(T_{h,in} - T_{c,in}),\\qquad \\varepsilon = \\frac{Q}{Q_{max}}',
      },
      {
        text: 'Solving the same two ODEs in terms of NTU = UA/C_min and C_r = C_min/C_max gives ε as a function of only these two numbers (and the flow arrangement). For counterflow:',
        latex: '\\varepsilon = \\frac{1 - e^{-\\mathrm{NTU}(1-C_r)}}{1 - C_r\\,e^{-\\mathrm{NTU}(1-C_r)}}',
      },
    ],
    commonMistakes: [
      'Using the wrong flow rate in Re. In Re = 4ṁ/(πDμ), ṁ is the flow per tube, not the total; with 8 tubes the Reynolds number is one eighth of what the total flow would suggest.',
      'Using Dittus–Boelter outside its range. It is meant for turbulent flow (Re above about 10 000), moderate Pr and L/D above about 10. For fully developed laminar tube flow Nu is a constant of order 4 (3.66 for constant wall temperature), independent of velocity.',
      'Averaging h’s the wrong way. U = 1/(1/h_i + 1/h_o), not their average. The smaller coefficient dominates, so doubling an already huge h does almost nothing.',
      'Taking the arithmetic mean of ΔT₁ and ΔT₂ instead of the log mean. It overestimates the driving difference, and the gap grows as the two end differences get further apart.',
      'Dropping fouling and wall resistance. In real exchangers, fouling can reduce U by tens of percent over time; a clean-U design may not meet its duty after a year of service.',
      'Taking C_min from the wrong stream. C = ṁc_p, so the "small" stream is the one with the smaller product, which is the one that changes temperature the most, not the one with the smaller flow rate or lower temperature.',
    ],
    rulesOfThumb: [
      'Counterflow is the most efficient arrangement for a given UA; parallel flow can never bring the cold outlet above the hot outlet, whereas counterflow can (a temperature cross).',
      'ε = NTU/(1 + NTU) for counterflow with C_r = 1, and ε → 1 as NTU grows. Returns diminish: NTU of 3 gives 0.75, and more area keeps buying less.',
      'When C_r → 0 (one stream condensing or boiling), ε = 1 − e^(−NTU) for every arrangement, so flow arrangement stops mattering.',
      'In turbulent tube flow h scales roughly as velocity^0.8. Doubling flow raises h by about 74 %, but pressure drop rises roughly as velocity squared, so there is a pumping-power trade-off.',
      'Gas-side film coefficients (roughly 10 to 100 W/m²·K) are typically an order of magnitude or more below liquid-side ones (roughly 500 to 10 000 W/m²·K), so the gas side controls U and is the side to fin.',
    ],
    designChecklist: [
      'Fix the known data: flow rates, inlet temperatures, and either a target duty or the area available.',
      'Get fluid properties at the mean temperature, and compute C = ṁc_p for both streams to find C_min and C_r.',
      'Compute Re and Pr per tube, choose the correlation, then h_i, h_o and the overall U (including fouling and wall).',
      'Rate the exchanger: ε-NTU if you only know inlets, LMTD if all four temperatures are known; apply F for shell-and-tube.',
      'Compute outlet temperatures and verify the energy balance on both streams.',
      'Check tube velocity and pressure drop (and erosion or fouling limits), and iterate on tube diameter and count.',
      'Add margin for fouling and uncertainty in h (often 10 to 30 % extra area, depending on service).',
    ],
    prerequisites: [
      { courseId: 'thermal-fluids-engineering', topicId: 'pipe-flow-heat-transfer', why: 'Reynolds number, laminar versus turbulent tube flow and the idea of a film coefficient are introduced there.' },
      { courseId: 'heat-transfer', topicId: 'conduction-resistance-networks', why: 'The overall coefficient U is a series resistance network.' },
    ],
    quiz: [
      {
        kind: 'numeric',
        prompt: 'Water flows at 0.05 kg/s through one tube of inner diameter 15 mm, with viscosity 1.0×10⁻³ Pa·s. What is the Reynolds number?',
        answer: 4244,
        explanation:
          'Re = 4ṁ/(πDμ) = 4 × 0.05/(π × 0.015 × 1.0×10⁻³) = 4244. That is above 2300 but well below 10 000, so the flow is in the transition range and Dittus–Boelter is not reliable here.',
      },
      {
        kind: 'numeric',
        prompt: 'Using Dittus–Boelter for a heated fluid with Re = 30 000 and Pr = 5, what is the Nusselt number?',
        answer: 167,
        explanation:
          'Nu = 0.023 Re^0.8 Pr^0.4 = 0.023 × 30 000^0.8 × 5^0.4 = 167. Then h = Nu k/D, so for a given tube a fluid with higher k gives a proportionally higher h.',
      },
      {
        kind: 'numeric',
        prompt: 'A counterflow exchanger has ΔT₁ = 60 K at one end and ΔT₂ = 20 K at the other. What is the log-mean temperature difference?',
        answer: 36.4,
        unit: 'K',
        explanation:
          'ΔT_lm = (60 − 20)/ln(60/20) = 40/1.0986 = 36.4 K, lower than the arithmetic mean of 40 K. The log mean is always below the arithmetic mean because the temperature difference falls exponentially along the surface.',
      },
      {
        kind: 'choice',
        prompt: 'A student estimates U for a tube with h_i = 3000 and h_o = 1500 W/m²·K by averaging them, getting 2250 W/m²·K. What is the error?',
        options: [
          'Nothing: the overall coefficient is the arithmetic mean of the film coefficients',
          'Averaging is correct only if the wall is metal',
          'U should be the sum, 4500 W/m²·K',
          'Resistances add, not coefficients: U = 1/(1/3000 + 1/1500) = 1000 W/m²·K, and the weaker film dominates',
        ],
        correct: 3,
        explanation:
          'The heat crosses both films in series, so it is the resistances 1/h that add. The result, 1000 W/m²·K, is below the smaller coefficient, as it must be for series resistances. The arithmetic mean is far too optimistic.',
      },
      {
        kind: 'numeric',
        prompt: 'An exchanger has effectiveness ε = 0.6, C_min = 3000 W/K, hot inlet 100 °C and cold inlet 20 °C. What is the heat duty?',
        answer: 144,
        unit: 'kW',
        explanation:
          'Q = ε C_min (T_h,in − T_c,in) = 0.6 × 3000 × 80 = 144 000 W = 144 kW. The effectiveness is the fraction of the maximum thermodynamically possible heat transfer, which is C_min × the inlet temperature difference.',
      },
      {
        kind: 'choice',
        prompt: 'For the same UA and flow rates, which statement about parallel-flow and counterflow exchangers is correct?',
        options: [
          'Parallel flow always gives a higher effectiveness, because the temperature difference is largest at the inlet',
          'Both give the same effectiveness when C_r = 0.5',
          'Counterflow gives higher effectiveness, and only counterflow can bring the cold outlet above the hot outlet',
          'Counterflow needs a correction factor F below 1, parallel flow does not',
        ],
        correct: 2,
        explanation:
          'In parallel flow both streams approach a common temperature, so the cold outlet can never exceed the hot outlet and ε is capped. In counterflow the cold stream meets the hottest hot fluid at its exit, allowing a temperature cross and a higher ε for the same UA. For example, C_r = 1 and NTU = 1 gives ε = 0.43 for parallel flow versus 0.50 for counterflow. F = 1 for both pure arrangements.',
      },
    ],
  },
}
