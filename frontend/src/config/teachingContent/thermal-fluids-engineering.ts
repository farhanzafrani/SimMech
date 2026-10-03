import type { TeachingContent } from '../teachingTypes'
import { EE } from '../teachingTypes'

/** Thermal-Fluids Engineering (2.005) teaching content. */
export const CONTENT: Record<string, TeachingContent> = {
  'first-law-thermodynamics': {
    intuition:
      'Think of a system as a bank account for energy. Heat and work are the only two kinds of transaction that cross the boundary; the stored balance is the internal energy U. Push a bicycle pump hard and the barrel gets warm: your work went into the air, the air had nowhere to send it, so the balance (and the temperature) went up. Nothing was created, nothing was lost — you can always find the energy if you draw the boundary carefully and count every crossing. For flowing systems (a turbine, a pump, a nozzle) the account has one extra line: every kilogram that enters or leaves drags its internal energy plus the work needed to push it in or out, and the sum of those two is the enthalpy h. That is why enthalpy, not internal energy, is the working currency of open devices.',
    derivation: [
      {
        text: 'Start from conservation of energy for a closed system (fixed mass). Energy crossing the boundary as heat Q (positive in) and work W (positive when the system does work on its surroundings) changes the stored energy. With no change in bulk kinetic or potential energy, the stored energy is internal energy U:',
        latex: '\\Delta U = Q - W',
      },
      {
        text: 'For a slowly moving piston the boundary work is force times distance: W = ∫ p dV. This is why expansion (dV > 0) is positive work done by the gas, and compression is negative. Always state which sign convention you are using before you plug numbers in.',
        latex: 'W = \\int_{1}^{2} p\\,dV',
      },
      {
        text: 'For an ideal gas the molecules do not interact, so internal energy depends on temperature only. Heating at constant volume does no boundary work, so all the heat goes into U, which defines the constant-volume specific heat:',
        latex: '\\Delta u = c_v\\,\\Delta T',
      },
      {
        text: 'Now open the system: fluid streams in and out. To push a unit mass into a control volume at pressure p and specific volume v, the surroundings must do flow work pv on it. Bundle that with the internal energy and give it a name:',
        latex: 'h = u + p\\,v',
      },
      {
        text: 'Write the energy balance for steady flow, where the stored energy of the control volume does not change with time. Per unit mass flow, heat in minus shaft work out equals the change in specific enthalpy plus the changes in kinetic and potential energy:',
        latex: '\\dot Q - \\dot W = \\dot m\\left[(h_2-h_1) + \\tfrac{1}{2}(V_2^2-V_1^2) + g(z_2-z_1)\\right]',
      },
      {
        text: 'For most turbines, compressors, pumps and heat exchangers the kinetic and potential terms are small compared with the enthalpy change, which collapses to the form in the topic. For an ideal gas h = u + RT, so c_p − c_v = R and Δh = c_p ΔT.',
        latex: '\\dot Q - \\dot W = \\dot m\\,\\Delta h',
      },
    ],
    commonMistakes: [
      'Mixing sign conventions. In ΔU = Q − W, W is work done BY the system. A compressor or a pump has negative W; a textbook that writes ΔU = Q + W is defining W as work done ON the system. Pick one convention and check the sign of every number against the physical story (does the gas get hotter?).',
      'Using internal energy where enthalpy belongs. For a steady-flow device the flow work pv is already carried by h; using Δu instead of Δh leaves out the work that pushes the fluid through the machine and under-estimates turbine or compressor power.',
      'Treating a "free expansion" as if it did work. A gas rushing into an evacuated tank pushes against nothing, so W = 0; if the tank is insulated, Q = 0 as well and ΔU = 0 — an ideal gas ends at the same temperature it started at, even though it expanded.',
      'Using Celsius in a formula where absolute temperature is needed. Differences (ΔT in cvΔT, cpΔT) are the same in °C and K, but any ratio of temperatures, or the ideal-gas law pv = RT, needs kelvin.',
      'Confusing heat with temperature. Adding heat does not always raise temperature (boiling, melting, isothermal expansion all take heat at constant T), and temperature can rise with no heat at all (adiabatic compression).',
      'Forgetting the units of the specific heats. cv = 0.718 kJ/(kg·K) multiplied by a mass in kg and ΔT in K gives kJ, not J. A factor of 1000 between kJ/kg and J/kg quietly ruins power estimates.',
    ],
    rulesOfThumb: [
      'The first law is bookkeeping: if your energy balance does not close, you have a missing term or a wrong sign, not a physics puzzle. Draw the boundary first, then list every arrow crossing it.',
      'For air near room temperature, c_p ≈ 1.005 kJ/(kg·K), c_v ≈ 0.718 kJ/(kg·K), R ≈ 0.287 kJ/(kg·K) — roughly good enough for hand estimates across ordinary temperature ranges.',
      'Compressors and pumps take work in, turbines and engines put work out; if a sign says the opposite, recheck before trusting the number.',
      'In steady flow through a turbine or compressor with no cooling, the shaft power is simply the mass flow times the enthalpy drop (or rise) — sanity-check that against the size of the machine and the mass flow.',
      'Kinetic and potential energy terms matter in nozzles, diffusers and tall pipelines; they are usually negligible across a turbine or heat exchanger.',
    ],
    designChecklist: [
      'Sketch the system and decide: closed (fixed mass) or open (control volume with flows)? Draw the boundary.',
      'List every energy crossing: heat in/out, work in/out, and for open systems each stream with its enthalpy.',
      'Fix your sign convention (work by the system positive) and write it on the page.',
      'Decide which terms are negligible (ΔKE, ΔPE, heat loss) and say so explicitly.',
      'Get property data: u, h or cv, cp for the fluid at the actual states; use kelvin for temperatures.',
      'Solve the balance for the unknown (work, heat, exit enthalpy or flow rate) and keep units consistent (kJ and kg, or kW and kg/s).',
      'Check the answer physically: does the gas heat up when compressed adiabatically? Is the turbine power sensible for the mass flow?',
    ],
    prerequisites: [
      { courseId: 'engineering-dynamics', topicId: 'newton-work-energy', why: 'Work as force times distance and the idea of energy conservation carry straight over to boundary work and the energy balance.' },
    ],
    quiz: [
      {
        kind: 'numeric',
        prompt: 'A closed system absorbs Q = 40 kJ of heat while it does W = 25 kJ of work on its surroundings. What is the change in internal energy?',
        answer: 15,
        unit: 'kJ',
        explanation: 'ΔU = Q − W = 40 − 25 = +15 kJ. Heat in is positive, work done by the system is positive and leaves, so only the difference is stored.',
      },
      {
        kind: 'numeric',
        prompt: 'Steam flows steadily through an adiabatic turbine at 2 kg/s. The inlet enthalpy is 3400 kJ/kg and the outlet enthalpy is 2500 kJ/kg. Neglecting kinetic and potential energy, what is the power output?',
        answer: 1800,
        unit: 'kW',
        explanation: 'Steady-flow energy equation with Q̇ = 0: Ẇ = ṁ(h₁ − h₂) = 2 × (3400 − 2500) = 1800 kJ/s = 1800 kW. The turbine converts the enthalpy drop of the steam into shaft power.',
      },
      {
        kind: 'numeric',
        prompt: 'Air (cv = 0.718 kJ/(kg·K)) of mass 2 kg is heated in a rigid, sealed tank so its temperature rises by 100 K. How much heat is added?',
        answer: 143.6,
        unit: 'kJ',
        explanation: 'A rigid tank has constant volume, so no boundary work: W = 0 and Q = ΔU = m cv ΔT = 2 × 0.718 × 100 = 143.6 kJ.',
      },
      {
        kind: 'numeric',
        prompt: 'Now 1 kg of air is heated by 100 K at constant pressure in a piston-cylinder, so it expands. Using cp = 1.005 and cv = 0.718 kJ/(kg·K), how much boundary work does the gas do?',
        answer: 28.7,
        unit: 'kJ',
        explanation: 'Q = m cp ΔT = 100.5 kJ and ΔU = m cv ΔT = 71.8 kJ. The first law gives W = Q − ΔU = 100.5 − 71.8 = 28.7 kJ (equal to R ΔT with R = 0.287). Constant-pressure heating needs more heat than constant-volume heating because some of it leaves as work.',
      },
      {
        kind: 'choice',
        prompt: 'A student says: "The gas expands adiabatically and does 10 kJ of work on the piston, so ΔU = +10 kJ." What is wrong?',
        options: [
          'Nothing — adiabatic processes always raise internal energy',
          'The sign of W: work done BY the gas is positive in ΔU = Q − W, so ΔU = 0 − 10 = −10 kJ and the gas cools',
          'They should have added the 10 kJ to Q instead',
          'Adiabatic means ΔU = 0, so the answer should be zero',
        ],
        correct: 1,
        explanation: 'The gas paid for the work out of its own internal energy because no heat was supplied: ΔU = Q − W = 0 − 10 = −10 kJ. An expanding adiabatic gas cools; a compressed one heats, which is the opposite sign to what the student wrote.',
      },
      {
        kind: 'choice',
        prompt: 'An ideal gas in an insulated rigid vessel is allowed to expand freely into a second, evacuated, rigid vessel. What happens to its temperature?',
        options: [
          'It falls, because the gas expands',
          'It rises, because the gas is compressed against the far wall',
          'It stays the same',
          'It cannot be determined without the volume ratio',
        ],
        correct: 2,
        explanation: 'Insulated means Q = 0, rigid walls and a vacuum mean W = 0, so ΔU = 0. For an ideal gas U depends on temperature only, so T is unchanged. (A real gas shows a small change because of intermolecular forces.)',
      },
      {
        kind: 'choice',
        prompt: 'Why does the steady-flow energy equation use enthalpy h = u + pv rather than internal energy u?',
        options: [
          'Because enthalpy is always larger, which adds a safety margin',
          'Because internal energy is undefined for moving fluids',
          'Because pv is the flow work needed to push each kilogram across the boundary, and h carries it automatically',
          'Because enthalpy only applies to ideal gases',
        ],
        correct: 2,
        explanation: 'Fluid entering a control volume must be pushed in against the pressure there, and fluid leaving pushes on the fluid downstream. That flow work is pv per unit mass, so combining it with u into h keeps the balance tidy and exact for any fluid, ideal or not.',
      },
    ],
  },

  'fluid-statics-bernoulli': {
    intuition:
      'Dive to the bottom of a swimming pool and your ears tell you about the water above you: pressure grows with depth simply because each layer has to hold up the layers over it. In still water there is nothing else going on. Now make the water move through a pipe that narrows. The same amount of water per second must squeeze through a smaller area, so it speeds up, and to speed up a parcel of water something has to push it harder from behind than it is pushed back from the front: the pressure in the narrow part is lower. Bernoulli’s equation is energy bookkeeping for that parcel — pressure, speed and height are three forms of mechanical energy that can be traded for each other as long as friction and pumps stay out of the picture. The common surprise is that the fast fluid is the low-pressure fluid, not the high-pressure one.',
    derivation: [
      {
        text: 'Hydrostatics: take a thin horizontal slab of fluid at rest, with area A and thickness dz. The pressure forces on its top and bottom faces must balance the slab’s weight ρ g A dz, so pressure changes with height at a rate set by the weight density:',
        latex: '\\frac{dp}{dz} = -\\rho g \\quad\\Rightarrow\\quad p = p_0 + \\rho g h',
      },
      {
        text: 'Here h is the depth below the surface and p₀ the pressure acting on the surface (atmospheric pressure for an open tank). Subtract p₀ and you have gauge pressure, ρ g h. Notice that it depends on depth only, not on the width or shape of the container.',
      },
      {
        text: 'Continuity: in steady flow, mass cannot pile up inside a streamtube. What passes the first cross-section per second equals what passes the second. For incompressible flow the density cancels:',
        latex: '\\rho_1 A_1 V_1 = \\rho_2 A_2 V_2 \\quad\\Rightarrow\\quad A_1 V_1 = A_2 V_2',
      },
      {
        text: 'Bernoulli: apply Newton’s second law to a small fluid parcel moving a distance ds along a streamline in steady, frictionless flow. The forces along the path are the net pressure force and the component of weight:',
        latex: '\\rho V\\frac{dV}{ds} = -\\frac{dp}{ds} - \\rho g\\frac{dz}{ds}',
      },
      {
        text: 'Multiply through by ds, and note that V dV = d(V²/2). For constant density every term is now an exact differential:',
        latex: 'd\\!\\left(\\tfrac{1}{2}\\rho V^2\\right) + dp + \\rho g\\, dz = 0',
      },
      {
        text: 'Integrate along the streamline. The sum is the same at every point on it — a statement that mechanical energy per unit volume is conserved when nothing adds energy (pump) or removes it (friction, turbulence):',
        latex: 'p + \\tfrac{1}{2}\\rho V^2 + \\rho g z = \\text{constant}',
      },
    ],
    commonMistakes: [
      'Believing that fast flow means high pressure. Along a streamline in the Bernoulli regime, the opposite holds: faster means lower static pressure. The narrow throat of a Venturi is the low-pressure point, which is exactly how carburettors and aspirators draw fluid in.',
      'Applying Bernoulli across a pump, turbine or fan without an extra term. Those machines add or remove energy; you need a head term (p + ½ρV² + ρgz changes by the pump head × ρg). It also fails across a significant loss such as a long pipe, a partly closed valve or a sudden expansion.',
      'Mixing gauge and absolute pressure. If one side of Bernoulli is gauge and the other absolute, the answer is off by about 101 kPa. Use gauge on both sides or absolute on both — never one of each — and remember that the free surface of an open tank is 0 gauge.',
      'Forgetting that hydrostatic pressure depends on vertical depth, not on the length of a sloped pipe or the volume above. A thin 10 m column and a huge lake that is 10 m deep both give about 98 kPa gauge at the bottom.',
      'Using Bernoulli for compressible flow without checking the Mach number. For air, treating density as constant is only reasonable well below roughly Mach 0.3; at high speed density changes with pressure and a compressible-flow treatment is needed.',
      'Applying Bernoulli between two points that are not on the same streamline, or in unsteady or strongly rotational flow, such as across a propeller or inside a vortex. The constant is only the same along one streamline unless the flow is also irrotational.',
    ],
    rulesOfThumb: [
      'Water pressure rises about 9.8 kPa per metre of depth (roughly 1 bar per 10 m); atmospheric pressure is about 101 kPa absolute.',
      'Continuity first: velocity scales inversely with area, so halving a pipe’s diameter quadruples the speed. Do this before touching Bernoulli.',
      'Always check Bernoulli’s assumptions as a short list: steady, incompressible, frictionless, along a streamline, no machines. If one of them fails, add the missing term or state the error you accept.',
      'Dynamic pressure ½ρV² for water is 0.5 kPa at 1 m/s and 50 kPa at 10 m/s; for air at room conditions it is roughly 0.6 Pa at 1 m/s and 60 Pa at 10 m/s. These give a feel for how much pressure speed is worth.',
      'For flow out of a tank through a small hole, the speed is about √(2gh), the same as a freely falling object from height h — a convenient upper bound before friction reduces it.',
    ],
    designChecklist: [
      'Decide whether the fluid is at rest (use hydrostatics) or moving (continuity plus Bernoulli).',
      'Pick two points on one streamline where you know most of the variables: a free surface, a pipe exit to atmosphere, or a point of known velocity.',
      'Use continuity to get the velocity at each cross-section from the flow rate and area.',
      'Choose gauge or absolute pressure and stick with it at both points.',
      'Write the Bernoulli equation and add head terms for any pump or turbine; add a loss term if friction is not negligible.',
      'Solve for the unknown pressure, velocity or height; keep SI units (Pa, m/s, kg/m³) throughout.',
      'Sanity-check: is the result physically possible (e.g. a calculated absolute pressure below zero means cavitation, not a real value)?',
    ],
    prerequisites: [
      { courseId: 'engineering-statics', topicId: 'statics-equilibrium', why: 'The hydrostatic derivation is a force balance on a fluid element at rest.' },
      { courseId: 'engineering-dynamics', topicId: 'newton-work-energy', why: 'Bernoulli is Newton’s second law, or equivalently work-energy, applied to a fluid parcel.' },
    ],
    videos: [
      {
        id: 'DW4rItB20h4',
        title: "Understanding Bernoulli's Equation",
        channel: EE,
        why: 'A visual walkthrough of Bernoulli’s equation to reinforce the pressure–speed–height trade-off.',
      },
    ],
    quiz: [
      {
        kind: 'numeric',
        prompt: 'What is the gauge pressure at the bottom of a 10 m deep tank of water (ρ = 1000 kg/m³, g = 9.81 m/s²)?',
        answer: 98.1,
        unit: 'kPa',
        explanation: 'p_gauge = ρ g h = 1000 × 9.81 × 10 = 98,100 Pa = 98.1 kPa. Adding atmospheric pressure (about 101 kPa) would give the absolute pressure.',
      },
      {
        kind: 'numeric',
        prompt: 'Water flows at 1.5 m/s in a 100 mm diameter pipe that contracts to 50 mm diameter. What is the velocity in the 50 mm section?',
        answer: 6,
        unit: 'm/s',
        explanation: 'Continuity: V₂ = V₁ (A₁/A₂) = V₁ (D₁/D₂)² = 1.5 × (100/50)² = 1.5 × 4 = 6 m/s. Area goes with diameter squared, so halving the diameter quadruples the speed.',
      },
      {
        kind: 'numeric',
        prompt: 'Water flows horizontally through a Venturi. The pipe velocity is 3 m/s and the throat velocity is 12 m/s. By how much does the pressure fall from the pipe to the throat? (ρ = 1000 kg/m³)',
        answer: 67.5,
        unit: 'kPa',
        explanation: 'Horizontal Bernoulli: p₁ − p₂ = ½ρ(V₂² − V₁²) = 0.5 × 1000 × (144 − 9) = 67,500 Pa = 67.5 kPa. The pressure drop pays for the kinetic energy gained.',
      },
      {
        kind: 'numeric',
        prompt: 'Water drains through a small hole 5 m below the free surface of a large open tank. Neglecting friction, what is the exit speed?',
        answer: 9.9,
        unit: 'm/s',
        explanation: 'Bernoulli between the free surface (p = 0 gauge, V ≈ 0, z = 5 m) and the jet (p = 0 gauge, z = 0): ρ g h = ½ρV², so V = √(2 g h) = √(2 × 9.81 × 5) = 9.90 m/s. Real jets are a bit slower because of friction and contraction.',
        tolerance: 0.02,
      },
      {
        kind: 'choice',
        prompt: 'A student uses Bernoulli’s equation to relate the pressure at a pump inlet to the pressure at its outlet and finds the pressure unchanged when the flow is the same size pipe at the same height. What did they get wrong?',
        options: [
          'Nothing; pumps do not change pressure',
          'They used absolute pressure instead of gauge pressure',
          'They forgot that the pump adds energy: a head term (pump head × ρg) belongs on the equation',
          'Bernoulli cannot be applied to water, only to air',
        ],
        correct: 2,
        explanation: 'The plain Bernoulli equation assumes no energy is added or removed. A pump does exactly that: it raises the pressure at the same velocity and elevation. The corrected balance adds the pump’s head (or Δp) on the downstream side.',
      },
      {
        kind: 'choice',
        prompt: 'Why is the pressure lower in the narrow throat of a Venturi than in the wide pipe upstream?',
        options: [
          'Because the throat is closer to the wall',
          'To accelerate the fluid into the throat there must be a net force forward, so the pressure upstream has to exceed the pressure in the throat',
          'Because friction is larger in narrow sections',
          'Because the fluid is cooler in the throat',
        ],
        correct: 1,
        explanation: 'Acceleration needs a net force by Newton’s second law. In frictionless flow the only forwards-acting force is the pressure difference, so the pressure must fall as the fluid speeds up. Energy-wise, pressure energy is converted to kinetic energy.',
      },
    ],
  },

  'pipe-flow-heat-transfer': {
    intuition:
      'Slow honey creeping out of a jar and a fire hose at full blast are both "flow through a tube", but they are different animals. At low speed (or high viscosity) the fluid moves in smooth parallel layers, the ones touching the wall hardly move, and the friction is simply viscosity dragging one layer over the next: this is laminar flow. Speed it up and the layers break into eddies that mix the stream and throw fluid against the wall; momentum is exchanged violently, friction jumps, and the flow is turbulent. The Reynolds number, which compares inertia to viscous drag, tells you which one you have. The same eddies that cost you pressure also carry heat: turbulent mixing keeps replacing the fluid next to a hot wall with cooler fluid from the core, so the surface sheds heat far better. Pumping power and heat removal are two sides of the same coin — and that coin is the quality of the mixing near the wall.',
    derivation: [
      {
        text: 'Quantify the competition between inertia and viscosity with a dimensionless group. The inertial force per unit area scales as ρV², the viscous shear as μV/D, and their ratio is the Reynolds number. In a smooth round pipe the flow is laminar below roughly 2300 and turbulent above about 4000, with a transitional range in between.',
        latex: '\\mathrm{Re} = \\frac{\\rho V D}{\\mu}',
      },
      {
        text: 'Force balance on a steady, fully developed flow in a pipe of length L: the pressure drop acts over the cross-section πD²/4 and is resisted by the wall shear τ_w acting over the surface πDL.',
        latex: '\\Delta p\\,\\frac{\\pi D^2}{4} = \\tau_w\\,\\pi D L \\quad\\Rightarrow\\quad \\Delta p = \\frac{4\\tau_w L}{D}',
      },
      {
        text: 'Wall shear is proportional to the dynamic pressure of the flow. Define the Darcy friction factor f by τ_w = (f/8)·ρV²; substituting turns the force balance into the Darcy–Weisbach equation. Dividing by ρg gives the head loss.',
        latex: '\\Delta p = f\\,\\frac{L}{D}\\,\\frac{\\rho V^2}{2}, \\qquad h_f = \\frac{\\Delta p}{\\rho g} = f\\,\\frac{L}{D}\\,\\frac{V^2}{2g}',
      },
      {
        text: 'For laminar flow the velocity profile can be solved exactly (Hagen–Poiseuille) and gives a pressure drop that is linear in V. Equating this to the Darcy–Weisbach form pins down f:',
        latex: '\\Delta p = \\frac{32\\mu L V}{D^2} \\quad\\Rightarrow\\quad f = \\frac{64}{\\mathrm{Re}}',
      },
      {
        text: 'For turbulent flow there is no closed-form solution; f depends on Re and the relative roughness ε/D and is read from the Moody chart or an empirical correlation (Colebrook, Haaland). Over a wide range of practical conditions f stays within a factor of about 2-3, so head loss goes roughly as V².',
      },
      {
        text: 'Heat transfer into or out of the fluid at a surface is described by Newton’s law of cooling. All the physics of the boundary layer is hidden inside the coefficient h, which is far larger in turbulent flow than laminar:',
        latex: "q'' = h\\,(T_s - T_\\infty), \\qquad \\dot Q = h\\,A\\,(T_s - T_\\infty)",
      },
    ],
    commonMistakes: [
      'Using f = 64/Re for turbulent flow. That formula is exact only for fully developed laminar flow; for Re above roughly 4000 you need the Moody chart or a turbulent correlation, and the answer can differ by a factor of 5 to 10.',
      'Mixing up the Darcy and Fanning friction factors. The Darcy factor f (used here) is four times the Fanning factor. Make sure the h_f = f(L/D)(V²/2g) you are using goes with a Darcy f from your chart.',
      'Forgetting minor losses. Bends, valves, tees, entrances and exits each add a loss K·V²/2g that can easily equal the friction in a short pipe. Ignoring them under-sizes the pump.',
      'Using the wrong viscosity or units. Dynamic viscosity μ (Pa·s) and kinematic viscosity ν = μ/ρ (m²/s) are not interchangeable: Re = ρVD/μ = VD/ν. Oil and water differ in viscosity by factors of 100 or more, and viscosity of oil falls steeply with temperature.',
      'Treating h as a material property. The convection coefficient depends on the fluid, the velocity, the geometry and whether the flow is laminar or turbulent; typical values span roughly 5-25 W/(m²·K) for natural convection in air up to several thousand for forced water flow.',
      'Applying the pipe equations to the wrong geometry, or ignoring temperature rise. A non-circular duct needs the hydraulic diameter, and as the fluid heats up or cools down its viscosity (and thus Re and f) can change substantially along the pipe.',
    ],
    rulesOfThumb: [
      'Water flow at 1-3 m/s in a typical building pipe has Re in the tens of thousands to hundreds of thousands, so it is almost always turbulent; thick oils or tiny capillaries are where laminar flow is the norm.',
      'In fully turbulent flow, head loss grows roughly with V², so doubling the velocity costs about 4× the pressure drop — and pumping power (Δp × flow) about 8×.',
      'For a fixed flow rate, shrinking a pipe is expensive: laminar pressure drop scales as 1/D⁴, and turbulent drop (with roughly constant f) as 1/D⁵. A small increase in diameter buys a large reduction in pumping cost.',
      'Typical design velocities for water in piping are around 1-3 m/s; much higher speeds raise noise, erosion and pumping power.',
      'Forced convection with water coefficients are often hundreds to thousands of W/(m²·K), forced air tens, and natural convection in air only a few — so a fan can raise cooling from a hot component by an order of magnitude.',
    ],
    designChecklist: [
      'State the fluid, temperature, flow rate and geometry; get density and viscosity at the operating temperature.',
      'Compute V = Q/A and Re = ρVD/μ; classify the flow as laminar, transitional or turbulent.',
      'Find the friction factor: 64/Re for laminar, Moody chart or correlation (with roughness) for turbulent.',
      'Compute friction head loss with Darcy–Weisbach and add minor losses for every fitting.',
      'Add static head and any other terms to size the pump, using the energy equation with the loss terms.',
      'For heat transfer, pick or compute h for the actual regime, then use q = hAΔT to find the heat rate or the required area.',
      'Check the trade-off: more velocity raises both heat transfer and pumping power; confirm the design is not paying for flow it does not need.',
    ],
    prerequisites: [
      { courseId: 'thermal-fluids-engineering', topicId: 'fluid-statics-bernoulli', why: 'Pipe-flow losses are added as an extra term to the Bernoulli energy equation.' },
      { courseId: 'fluid-mechanics', topicId: 'viscous-flow', why: 'The laminar friction factor and the Reynolds number come from viscous-flow theory.' },
    ],
    videos: [
      {
        id: '9A-uUG0WR0w',
        title: 'Understanding Laminar and Turbulent Flow',
        channel: EE,
        why: 'Background on the two flow regimes behind the Reynolds-number classification.',
      },
    ],
    quiz: [
      {
        kind: 'numeric',
        prompt: 'Water (ρ = 1000 kg/m³, μ = 1×10⁻³ Pa·s) flows at 2 m/s in a 50 mm pipe. What is the Reynolds number?',
        answer: 100000,
        explanation: 'Re = ρVD/μ = 1000 × 2 × 0.05 / 0.001 = 1×10⁵. That is far above 4000, so the flow is fully turbulent.',
      },
      {
        kind: 'numeric',
        prompt: 'A laminar pipe flow has Re = 800. What is the Darcy friction factor?',
        answer: 0.08,
        explanation: 'For fully developed laminar flow, f = 64/Re = 64/800 = 0.08. Re = 800 is well below 2300, so the laminar formula applies.',
      },
      {
        kind: 'numeric',
        prompt: 'Water in a 100 m long, 0.1 m diameter pipe flows at 2 m/s. With a friction factor f = 0.02, what is the frictional pressure drop? (ρ = 1000 kg/m³)',
        answer: 40,
        unit: 'kPa',
        explanation: 'Δp = f (L/D)(ρV²/2) = 0.02 × (100/0.1) × (1000 × 4/2) = 0.02 × 1000 × 2000 = 40,000 Pa = 40 kPa. This is equivalent to a head loss of about 4.08 m of water.',
      },
      {
        kind: 'numeric',
        prompt: 'A 10 m long, 50 mm diameter pipe has a wall at 60 °C in 20 °C surroundings with h = 25 W/(m²·K). What is the total convective heat loss from the pipe’s outer surface?',
        answer: 1571,
        unit: 'W',
        explanation: 'Area = πDL = π × 0.05 × 10 = 1.571 m². The heat flux is q″ = h(T_s − T_∞) = 25 × 40 = 1000 W/m², so Q = 1000 × 1.571 ≈ 1571 W.',
      },
      {
        kind: 'choice',
        prompt: 'A student calculates the friction loss in a water pipe with Re = 1×10⁵ using f = 64/Re. What is wrong?',
        options: [
          'Nothing; 64/Re is valid at any Re',
          'The formula is only valid for fully developed laminar flow; at Re = 1×10⁵ the flow is turbulent and f must come from the Moody chart or a correlation',
          'They should have used 64/Re² instead',
          'They should have used the Fanning factor, which is always 4 times larger',
        ],
        correct: 1,
        explanation: 'f = 64/Re comes from the exact laminar velocity profile. Turbulent friction is dominated by wall roughness and eddy mixing and falls much more slowly with Re. The laminar formula would give f ≈ 0.0006, about 30 times too small for a typical pipe (f of the order of 0.02).',
      },
      {
        kind: 'choice',
        prompt: 'The flow rate is held fixed and the pipe diameter is halved. For laminar flow, the frictional pressure drop over the same length changes by what factor?',
        options: ['×2', '×8', '×4', '×16'],
        correct: 3,
        explanation: 'Laminar: Δp = 32μLV/D². At fixed flow rate Q, V = 4Q/(πD²), so Δp ∝ 1/D⁴. Halving D gives 2⁴ = 16 times the pressure drop. Velocity rises by 4× and the D² in the denominator adds another 4×.',
      },
      {
        kind: 'choice',
        prompt: 'Blowing on hot soup cools it faster mainly because it changes which quantity in q″ = h(T_s − T_∞)?',
        options: [
          'It lowers T_∞ to below room temperature',
          'It raises the convection coefficient h by thinning the boundary layer and sweeping away warm air',
          'It lowers the soup’s surface area to zero',
          'It makes the soup’s surface temperature go up',
        ],
        correct: 1,
        explanation: 'Moving air strips away the warm layer next to the surface and replaces it with room-temperature air, thinning the boundary layer and increasing h (also helping evaporation, which adds further cooling). T_∞ and the area are essentially unchanged.',
      },
    ],
  },

  'second-law-entropy': {
    intuition:
      'The first law says energy is conserved, but a cup of hot coffee never spontaneously gets hotter by drawing heat from the cold room, even though that would not violate energy conservation. The second law is the arrow of time for energy: heat flows hot to cold on its own, and every real process spreads energy out a little more. Entropy is the measure of that spreading, and entropy generation is the bill you pay for every irreversibility: friction, heat transfer across a finite temperature difference, mixing, throttling. A heat engine works by letting heat fall from a hot reservoir to a cold one and skimming some work off on the way down; because the cold reservoir is never at absolute zero, some heat must always be dumped, which is why even a perfect engine cannot be 100 % efficient. The Carnot limit is the best you can do, and the entropy generated by a real machine tells you exactly how far below it you are.',
    derivation: [
      {
        text: 'The second law (Clausius form): for any cycle that exchanges heat with reservoirs, the sum of Q/T around the cycle is zero for a reversible cycle and negative for an irreversible one. Apply it to an engine that takes Q_H from a reservoir at T_H and rejects Q_L (a positive number) to one at T_L. Define the entropy generation of the combined engine and reservoirs, which can never be negative:',
        latex: 'S_{gen} = \\frac{Q_L}{T_L} - \\frac{Q_H}{T_H} \\;\\ge\\; 0',
      },
      {
        text: 'A reversible engine generates no entropy, so S_gen = 0 and the heats are in proportion to the absolute temperatures:',
        latex: '\\frac{Q_L}{Q_H} = \\frac{T_L}{T_H}',
      },
      {
        text: 'From the first law applied to the cycle, W = Q_H − Q_L, so the efficiency of the reversible engine is:',
        latex: '\\eta_C = \\frac{W}{Q_H} = 1 - \\frac{Q_L}{Q_H} = 1 - \\frac{T_L}{T_H}',
      },
      {
        text: 'Any real engine has S_gen > 0, so it rejects more heat than the reversible one for the same Q_H, and by the first law produces less work. Solve S_gen for Q_L and substitute into W = Q_H − Q_L:',
        latex: 'W = Q_H\\left(1 - \\frac{T_L}{T_H}\\right) - T_L\\,S_{gen}',
      },
      {
        text: 'The first term is the reversible (maximum) work. Hence the work you lose to irreversibility is exactly the cold-reservoir temperature times the entropy generated:',
        latex: 'W_{lost} = W_{rev} - W = T_L\\,S_{gen}',
      },
      {
        text: 'Run the cycle backwards for a refrigerator or heat pump. The same argument gives the Carnot coefficients of performance; both rise as the temperature lift T_H − T_L shrinks:',
        latex: '\\mathrm{COP}_R = \\frac{T_L}{T_H - T_L}, \\qquad \\mathrm{COP}_{HP} = \\frac{T_H}{T_H - T_L}',
      },
    ],
    commonMistakes: [
      'Using Celsius for Carnot. All temperatures in η_C = 1 − T_L/T_H and in COP formulas must be absolute (kelvin). A student who writes 1 − 25/500 gets 95 % when the true Carnot limit between 500 °C and 25 °C is about 61 %.',
      'Treating the Carnot efficiency as a target for real machines. It is an unreachable upper bound that requires reversible heat transfer across zero temperature difference (which would take infinite time or area). Real machines usually reach well under it.',
      'Assuming a heat pump or refrigerator has an efficiency below 100 %. Their COP can exceed 1, sometimes by a lot, because they move heat rather than create it; the Carnot COP just gets worse as the temperature lift grows.',
      'Mixing up which reservoir temperature goes with lost work. W_lost = T₀·S_gen uses the reference (environment) temperature: T_L for an engine or heat pump, T_H for a refrigerator. Using the wrong one gives a wrong loss.',
      'Believing entropy cannot decrease anywhere. It can fall in an individual component (cooling a block of metal), but then the entropy of the surroundings must rise by at least as much. The sign rule applies to the total: system plus surroundings.',
      'Treating a positive S_gen as proof the machine is "possible" without also checking the first law. A device must satisfy both laws: energy balance closes, and S_gen ≥ 0. Pass one and fail the other, and it is still impossible.',
    ],
    rulesOfThumb: [
      'First check any efficiency claim against Carnot: compare η = W/Q_H to 1 − T_L/T_H using kelvin. Anything above it is impossible, and anything very close to it for a real machine deserves suspicion.',
      'Real steam power plants typically reach about 35-45 % thermal efficiency and gas-turbine combined-cycle plants somewhat higher (roughly 55-60 % in the best modern examples) — far from 100 %, and also below their Carnot limits.',
      'Carnot COP shows why a heat pump works best in mild weather: for a 10-15 K temperature lift the ideal COP is of the order of 20-30; real machines reach perhaps a quarter to a half of that, and COP falls steeply as the lift grows.',
      'To spot the biggest source of waste in a plant, compute S_gen in each component: the one with the largest T₀·S_gen is where work is being destroyed (boilers and combustors are usually the worst offenders).',
      'Heat flow across a large temperature difference is the single most wasteful common process — a good reason to match heat sources and sinks as closely in temperature as you can.',
    ],
    designChecklist: [
      'Identify the reservoirs or boundary temperatures and convert all temperatures to kelvin.',
      'Write the first-law balance for the device (W = Q_H − Q_L for an engine) to close the energy accounts.',
      'Compute the Carnot limit (efficiency or COP) for the temperatures involved and see how far the stated performance is from it.',
      'Compute S_gen from the heat transfers and reservoir temperatures; confirm the sign is non-negative.',
      'Convert S_gen to lost work with W_lost = T₀·S_gen to see how much potential is being wasted and where.',
      'Rank components by entropy generation to decide where improvement will matter most.',
      'Re-check units: kJ and K give entropy in kJ/K; do not mix kW and kJ.',
    ],
    prerequisites: [
      { courseId: 'thermal-fluids-engineering', topicId: 'first-law-thermodynamics', why: 'The second law adds an inequality on top of the first-law energy balance; you need W = Q_H − Q_L before entropy generation makes sense.' },
    ],
    quiz: [
      {
        kind: 'numeric',
        prompt: 'What is the Carnot efficiency of an engine operating between 600 K and 300 K?',
        answer: 50,
        unit: '%',
        explanation: 'η_C = 1 − T_L/T_H = 1 − 300/600 = 0.5, or 50 %. No real engine between these reservoirs can exceed this.',
      },
      {
        kind: 'numeric',
        prompt: 'What is the Carnot efficiency of an engine between a 500 °C source and a 25 °C sink? (Convert to kelvin using 273.15.)',
        answer: 61.4,
        unit: '%',
        explanation: 'T_H = 773.15 K, T_L = 298.15 K, so η_C = 1 − 298.15/773.15 = 0.6144 ≈ 61.4 %. Using the Celsius numbers instead would give 95 %, which is badly wrong.',
      },
      {
        kind: 'numeric',
        prompt: 'A Carnot refrigerator holds a cold space at 260 K while rejecting heat to surroundings at 300 K. What is its coefficient of performance?',
        answer: 6.5,
        explanation: 'COP_R = T_L/(T_H − T_L) = 260/(300 − 260) = 260/40 = 6.5. A real refrigerator will do worse, but a smaller temperature lift always raises the COP.',
      },
      {
        kind: 'numeric',
        prompt: 'An engine takes Q_H = 1000 kJ from a source at 600 K, produces 400 kJ of work and rejects 600 kJ to a sink at 300 K. How much work is lost compared with a reversible engine?',
        answer: 100,
        unit: 'kJ',
        explanation: 'S_gen = Q_L/T_L − Q_H/T_H = 600/300 − 1000/600 = 2.000 − 1.667 = 0.333 kJ/K. W_lost = T_L S_gen = 300 × 0.333 = 100 kJ. Check: the reversible work is 1000 × 0.5 = 500 kJ, and 500 − 400 = 100 kJ.',
      },
      {
        kind: 'choice',
        prompt: 'An inventor claims an engine that takes 100 kJ from a 400 K source, rejects 40 kJ to a 300 K sink and delivers 60 kJ of work. What is the verdict?',
        options: [
          'Possible, because the energy balance closes',
          'Possible, because 60 % is less than 100 %',
          'Impossible: S_gen = 40/300 − 100/400 ≈ −0.117 kJ/K < 0, and its 60 % efficiency exceeds the 25 % Carnot limit',
          'Impossible only because the sink is too cold',
        ],
        correct: 2,
        explanation: 'The first law is satisfied (100 = 60 + 40), but the second is violated: entropy generation is negative, and the efficiency (60 %) is far above the Carnot limit 1 − 300/400 = 25 %. Both checks reject the claim.',
      },
      {
        kind: 'choice',
        prompt: 'A student computes the Carnot efficiency between 27 °C and 327 °C as 1 − 27/327 ≈ 92 %. What went wrong?',
        options: [
          'They should have used the temperature difference instead of the ratio',
          'The formula is only for refrigerators',
          'They used Celsius; with kelvin it is 1 − 300/600 = 50 %',
          'Nothing; the Carnot limit can be 92 %',
        ],
        correct: 2,
        explanation: 'Carnot efficiency is a ratio of absolute temperatures. 27 °C = 300 K and 327 °C = 600 K, so η_C = 1 − 300/600 = 50 %. Celsius has an arbitrary zero, so ratios of Celsius values have no thermodynamic meaning.',
      },
      {
        kind: 'choice',
        prompt: 'Why is a heat pump more efficient (higher COP) on a mild day than on a very cold one, other things equal?',
        options: [
          'Cold air has fewer molecules, so it holds less heat per kg',
          'The temperature lift T_H − T_L is smaller, and the Carnot COP T_H/(T_H − T_L) rises as the lift shrinks',
          'The compressor is more powerful when cold',
          'Heat pumps do not obey the second law',
        ],
        correct: 1,
        explanation: 'A heat pump has to push heat "uphill" across the temperature lift between outside and inside. A smaller lift needs less work per unit of heat delivered, so COP is larger. For example, a lift of 13 K from 280 K to 293 K gives a Carnot COP of about 22, but a lift of 40 K gives under 8.',
      },
    ],
  },

  'rankine-brayton-cycles': {
    intuition:
      'A power plant is a loop with a fluid that goes round and round: squeeze it, heat it, let it expand through a turbine to extract work, cool it, repeat. The net work you get is what the turbine produces minus what you spent squeezing the fluid, so the whole game is to make the squeezing cheap and the expansion rich. A steam plant (Rankine) squeezes liquid water, which is nearly incompressible, so a small pump does the job with only about 1 % of the turbine’s output; the price is a boiler and condenser, and the working fluid changes phase. A gas turbine (Brayton) compresses air as a gas, which takes a lot of work, 40 to 60 % of what the turbine produces, but it can run at far higher temperatures, needs no boiler and responds quickly. In both, the thermodynamic leverage is the same: add the heat as hot as possible and reject it as cold as possible, just as Carnot’s argument demands.',
    derivation: [
      {
        text: 'Rankine cycle, ideal: pump (1→2), boiler (2→3), turbine (3→4), condenser (4→1). Because the pump compresses saturated liquid, which is nearly incompressible, use dh = T ds + v dp with ds = 0 for an isentropic pump and v ≈ constant:',
        latex: 'w_p = h_2 - h_1 = v_1\\,(p_b - p_c)',
      },
      {
        text: 'Apply the steady-flow energy equation to each component (no heat in the turbine or pump, no work in the boiler or condenser). The turbine work is the enthalpy drop and the heat input is the enthalpy rise in the boiler:',
        latex: 'w_t = h_3 - h_4, \\qquad q_{in} = h_3 - h_2',
      },
      {
        text: 'Thermal efficiency is net work over heat input. For the ideal turbine, state 4 comes from s₄ = s₃, which fixes its quality x₄ = (s₃ − s_f)/s_fg and then h₄:',
        latex: '\\eta = \\frac{w_t - w_p}{q_{in}} = \\frac{(h_3-h_4)-(h_2-h_1)}{h_3-h_2}',
      },
      {
        text: 'Brayton cycle, ideal and cold-air-standard: compression 1→2 and expansion 3→4 are isentropic, and heat is added and rejected at constant pressure. For an ideal gas with constant specific heats, an isentropic process obeys the relation between temperature and pressure ratio:',
        latex: 'T_2 = T_1\\,r_p^{(k-1)/k}, \\qquad T_4 = \\frac{T_3}{r_p^{(k-1)/k}}',
      },
      {
        text: 'Heat in and heat out occur at constant pressure, so q_in = c_p(T₃ − T₂) and q_out = c_p(T₄ − T₁). The efficiency is 1 − q_out/q_in; because T₂/T₁ = T₃/T₄, the temperature differences are in the same ratio and this simplifies to a function of pressure ratio alone:',
        latex: '\\eta = 1 - \\frac{T_1}{T_2} = 1 - r_p^{-(k-1)/k}',
      },
      {
        text: 'The back-work ratio and the optimum for net work: the net work is c_p[(T₃ − T₄) − (T₂ − T₁)]. Setting its derivative with respect to the compression temperature ratio to zero gives T₂ = √(T₁T₃), i.e. the pressure ratio below. This is a different optimum from maximum efficiency, which keeps rising with r_p.',
        latex: 'r_p^{\\,w_{max}} = \\left(\\frac{T_3}{T_1}\\right)^{\\frac{k}{2(k-1)}}',
      },
    ],
    commonMistakes: [
      'Believing that raising the turbine inlet temperature improves the ideal Brayton efficiency at a given pressure ratio. It does not: the ideal efficiency depends only on r_p and k. Higher T₃ raises the net work per kg of air (so a smaller, lighter engine), and in real engines it allows higher optimum pressure ratios.',
      'Ignoring the back-work ratio. A gas turbine spends roughly 40-60 % of the turbine work driving the compressor, so small losses in either component hit the net output hard: a few percent loss in compressor efficiency can remove a large fraction of net work. A steam cycle spends only around 1 %.',
      'Using the ideal-cycle efficiency as if it were real. Real turbines and compressors are not isentropic. The ideal Brayton efficiency of about 45-50 % at typical pressure ratios falls to the order of 30-40 % for real simple-cycle engines once component efficiencies and losses are included.',
      'Using steam as an ideal gas. Rankine states must come from steam tables (or software like IAPWS-IF97), with a quality x for a wet mixture; the ideal-gas Brayton relations T₂ = T₁ r_p^((k−1)/k) do not apply to a boiling fluid.',
      'Forgetting that exhaust moisture limits steam turbines. Raising the boiler pressure at fixed turbine inlet temperature improves efficiency but lowers the exit quality; wet steam with a lot of liquid droplets erodes the last stages, which is why reheat is used.',
      'Using Celsius in the isentropic temperature relation or in T₃/T₁. The relation T₂/T₁ = r_p^((k−1)/k) needs absolute temperatures; using °C gives nonsense. Also remember k = 1.4 is for cold air only; hot combustion gases have a lower k.',
    ],
    rulesOfThumb: [
      'Pumping liquid is cheap, compressing gas is not: the Rankine back-work ratio is about 1 %, while the simple Brayton cycle is typically 40-60 %.',
      'The efficiency of the ideal Brayton cycle with k = 1.4 is about 0.43 at r_p = 7, 0.45 at r_p = 8, and 0.48 at r_p = 10; going higher gives diminishing returns.',
      'Efficiency rises with the average temperature at which heat is added and falls with the temperature at which it is rejected; the condenser pressure sets the lower temperature of the Rankine cycle, which is why plants run at low pressure (vacuum) in the condenser.',
      'Net-work optimum pressure ratio is (T₃/T₁)^(k/(2(k−1))); for T₃/T₁ = 4 and k = 1.4 that is about 11. Practical engines are designed near this value, or higher when efficiency matters more than size.',
      'Combined cycles use the hot Brayton exhaust to raise steam for a Rankine cycle, which is how the best plants exceed the efficiency either cycle can reach alone.',
    ],
    designChecklist: [
      'Fix the cycle type and the top and bottom conditions: boiler pressure and turbine inlet temperature, or pressure ratio and T₃, plus the condenser or inlet conditions.',
      'Get state properties: steam tables for Rankine, or ideal-gas relations (cp, k) for Brayton, with temperatures in kelvin.',
      'Find each state using isentropic relations for the ideal turbine, pump and compressor.',
      'Compute turbine work, pump or compressor work, and the heat input from enthalpy differences.',
      'Compute net work, thermal efficiency and back-work ratio; check against known magnitudes.',
      'Check exhaust quality (Rankine, typically want above roughly 0.85-0.9) or the exhaust temperature and its recovery potential (Brayton).',
      'Introduce real component efficiencies and compare to the ideal case; decide whether reheat, regeneration or a combined cycle is worth the complexity.',
    ],
    prerequisites: [
      { courseId: 'thermal-fluids-engineering', topicId: 'first-law-thermodynamics', why: 'Every component is analysed with the steady-flow energy equation using enthalpy differences.' },
      { courseId: 'thermal-fluids-engineering', topicId: 'second-law-entropy', why: 'The Carnot argument explains why efficiency depends on the average temperatures, and entropy defines the isentropic states.' },
    ],
    quiz: [
      {
        kind: 'numeric',
        prompt: 'What is the ideal Brayton cycle efficiency at a pressure ratio of 10 with k = 1.4?',
        answer: 48.2,
        unit: '%',
        explanation: 'η = 1 − r_p^(−(k−1)/k) = 1 − 10^(−0.2857) = 1 − 0.5179 = 0.482 = 48.2 %.',
      },
      {
        kind: 'numeric',
        prompt: 'An ideal Rankine pump raises saturated liquid (v = 0.00101 m³/kg) from 10 kPa to 10 MPa. How much work does it consume per kg?',
        answer: 10.09,
        unit: 'kJ/kg',
        explanation: 'w_p = v(p_b − p_c) = 0.00101 × (10,000 − 10) kPa = 10.09 kJ/kg. Small, because liquid water is nearly incompressible, and the volume of liquid is tiny compared with steam or air.',
      },
      {
        kind: 'numeric',
        prompt: 'For a simple Brayton cycle with T₁ = 300 K and T₃ = 1200 K (k = 1.4), what pressure ratio gives the maximum net work?',
        answer: 11.31,
        explanation: 'r_p = (T₃/T₁)^(k/(2(k−1))) = 4^(1.4/0.8) = 4^1.75 ≈ 11.31. At this ratio T₂ = √(T₁T₃) = 600 K.',
      },
      {
        kind: 'numeric',
        prompt: 'A gas turbine delivers 600 kJ/kg of turbine work while its compressor consumes 250 kJ/kg. What is the back-work ratio, as a percentage?',
        answer: 41.7,
        unit: '%',
        explanation: 'bwr = w_c/w_t = 250/600 = 0.4167 = 41.7 %. Net work is only 350 kJ/kg, which is why compressor efficiency matters so much.',
      },
      {
        kind: 'choice',
        prompt: 'Why is the back-work ratio of a Rankine cycle only about 1 % but that of a Brayton cycle 40-60 %?',
        options: [
          'Steam turbines are more efficient than gas turbines',
          'Gas turbines have no condenser',
          'The Brayton cycle runs at lower pressure',
          'The Rankine pump compresses a liquid, which has a very small specific volume and is nearly incompressible, so w = v Δp is tiny; the Brayton compressor must compress a gas',
        ],
        correct: 3,
        explanation: 'Compression work per kg is ∫v dp. A liquid has a tiny v, a gas has a large one at the same pressure, so the gas takes far more work. This is also why running pumps on a liquid and boiling it separately is so attractive for large power plants.',
      },
      {
        kind: 'choice',
        prompt: 'A student says: "I raised the turbine inlet temperature T₃ at a fixed pressure ratio, so the ideal Brayton efficiency 1 − r_p^−(k−1)/k went up." What is wrong?',
        options: [
          'The formula contains only r_p and k, so at fixed r_p it does not change; higher T₃ raises the net work per kg of air, not the ideal efficiency',
          'Nothing; efficiency always rises with T₃',
          'The formula is only valid below 1000 K',
          'They should have lowered the compressor inlet temperature, which cancels T₃',
        ],
        correct: 0,
        explanation: 'In the ideal cycle, T₃/T₄ = T₂/T₁, so the temperature ratio that sets efficiency is fixed by r_p. A hotter T₃ gives more net work per kg of air and permits higher efficient pressure ratios in real engines, but the ideal formula itself is unchanged at fixed r_p.',
      },
      {
        kind: 'choice',
        prompt: 'Raising the boiler pressure of a Rankine cycle at a fixed turbine inlet temperature typically does what to cycle efficiency and turbine exit quality?',
        options: [
          'Lowers efficiency and raises quality',
          'Raises efficiency and lowers quality, increasing blade erosion risk from moisture',
          'Leaves both unchanged',
          'Raises both',
        ],
        correct: 1,
        explanation: 'A higher boiler pressure raises the average temperature of heat addition, so efficiency rises. But the expansion line on the T-s diagram ends further to the left, so the steam leaves the turbine wetter (lower quality). Droplets erode the last stages, so engineers add reheat to bring the quality back up.',
      },
    ],
  },
}
