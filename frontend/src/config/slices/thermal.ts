/**
 * Thermal slice: two extra topics for Thermal-Fluids Engineering and a new
 * Heat Transfer course. Merged into the curriculum by the lead.
 */

import type { CourseMeta, TopicMeta } from '../curriculum'

const MIT_16050 = { label: 'MIT OCW — 16.050 Thermal Energy (Spakovszky): second law, power cycles, heat transfer', url: 'https://ocw.mit.edu/courses/16-050-thermal-energy-fall-2002/' }
const MIT_2051 = { label: 'MIT OCW — 2.051 Introduction to Heat Transfer (Fall 2015)', url: 'https://ocw.mit.edu/courses/2-051-introduction-to-heat-transfer-fall-2015/' }
const MIT_251 = { label: 'MIT OCW — 2.51 Intermediate Heat and Mass Transfer (Fall 2008)', url: 'https://ocw.mit.edu/courses/2-51-intermediate-heat-and-mass-transfer-fall-2008/' }
const NPTEL_HMT = { label: 'NPTEL — Heat and Mass Transfer (IIT Bombay, Sukhatme & Gaitonde)', url: 'https://nptel.ac.in/courses/112101097' }
const MITX_2005 = { label: 'MITx — Thermal-Fluids Engineering 1 (2.005.1x)', url: 'https://mitxonline.mit.edu/courses/course-v1:MITxT+2.005.1x/' }
const KHAN_THERMO = { label: 'Khan Academy — Second law of thermodynamics', url: 'https://www.khanacademy.org/science/physics/thermodynamics/laws-of-thermodynamics/a/what-is-the-second-law-of-thermodynamics' }
const IAPWS_IF97 = { label: 'IAPWS R7-97(2012) — Industrial Formulation 1997 for the thermodynamic properties of water and steam (source of the steam table used here)', url: 'https://www.iapws.org/relguide/IF97-Rev.pdf' }

const secondLaw: TopicMeta = {
  id: 'second-law-entropy',
  title: 'Second Law: Carnot Limit & Entropy Generation',
  duration: '16m',
  level: 'Intermediate',
  summary: 'The first law counts energy; the second law says which conversions are possible, and entropy generation measures how much of the ideal you waste.',
  description:
    'Heat flows from hot to cold on its own, never the other way, and no engine can turn all of its heat input into work. The Carnot efficiency, 1 − T_L/T_H, is the ceiling for any engine running between two temperatures; it is reached only by a reversible device. Every real device generates entropy, and that generated entropy, multiplied by a reference temperature, is exactly the work you lost compared with the ideal. A negative entropy generation is the quickest test for a perpetual-motion claim.',
  status: 'active',
  learningObjectives: [
    'Compute the Carnot efficiency or COP for an engine, refrigerator or heat pump between two reservoirs',
    'Compute entropy generation for a cyclic device and use its sign to decide whether it is physically possible',
    'Convert entropy generation into lost work and a second-law efficiency',
  ],
  formulas: [
    { label: 'Carnot engine efficiency', formula: 'η_C = 1 − T_L / T_H', latex: '\\eta_C = 1 - \\frac{T_L}{T_H}', note: 'Temperatures in kelvin. The upper bound on any engine between these reservoirs.', emphasis: true },
    { label: 'Carnot refrigerator / heat-pump COP', formula: 'COP_R = T_L/(T_H−T_L), COP_HP = T_H/(T_H−T_L)', latex: '\\mathrm{COP}_R = \\frac{T_L}{T_H-T_L},\\quad \\mathrm{COP}_{HP} = \\frac{T_H}{T_H-T_L}', note: 'A smaller temperature lift means a larger COP.' },
    { label: 'Entropy generation (engine)', formula: 'S_gen = Q_L/T_L − Q_H/T_H ≥ 0', latex: 'S_{gen} = \\frac{Q_L}{T_L} - \\frac{Q_H}{T_H} \\ge 0', note: 'Zero for a reversible device, positive for a real one, negative is impossible. For a refrigerator or heat pump: S_gen = Q_H/T_H − Q_L/T_L.' },
    { label: 'Lost work', formula: 'W_lost = T₀ · S_gen', latex: 'W_{lost} = T_0\\, S_{gen}', note: 'T₀ is T_L for an engine or heat pump and T_H for a refrigerator; equals the gap to the reversible work.' },
    { label: 'Ideal-gas entropy change', formula: 'Δs = cₚ ln(T₂/T₁) − R ln(p₂/p₁)', latex: '\\Delta s = c_p \\ln\\frac{T_2}{T_1} - R \\ln\\frac{p_2}{p_1}', note: 'For constant specific heat; used later to draw T-s diagrams.' },
  ],
  workedExample: {
    given: 'A heat engine takes Q_H = 1000 kJ from a hot reservoir at T_H = 800 K, produces W = 400 kJ of work, and rejects the rest to a cold reservoir at T_L = 300 K.',
    find: 'Its efficiency against the Carnot limit, the entropy it generates, and the work it wastes.',
    steps: [
      'Heat rejected: Q_L = Q_H − W = 1000 − 400 = 600 kJ',
      'Actual efficiency: η = W / Q_H = 400 / 1000 = 40 %',
      'Carnot limit: η_C = 1 − 300/800 = 62.5 %, so the second-law efficiency is 40 / 62.5 = 64 %',
      'Entropy generation: S_gen = 600/300 − 1000/800 = 2.00 − 1.25 = 0.75 kJ/K (positive, so the engine is allowed)',
      'Lost work: T_L · S_gen = 300 × 0.75 = 225 kJ, which matches W_rev − W = 625 − 400 = 225 kJ',
    ],
    answer: 'The engine reaches 40 % of a possible 62.5 %, generates 0.75 kJ/K of entropy, and throws away 225 kJ of work that a reversible engine would have delivered.',
  },
  challenges: [
    'Set the engine work to 700 kJ with Q_H = 1000 kJ, T_H = 800 K and T_L = 300 K. What happens to the entropy generation, and what does it tell you about the claim?',
    'Switch to a refrigerator and narrow the gap between T_H and T_L. How does the Carnot COP change, and why does that explain why a heat pump works best in mild weather?',
  ],
  applications: [
    'Rejecting a perpetual-motion or over-unity efficiency claim by checking the sign of S_gen',
    'Setting the best-possible performance target when specifying a refrigeration plant or heat pump',
    'Finding which component of a power plant wastes the most work by comparing entropy generation across components',
  ],
  references: [KHAN_THERMO, MIT_16050, MITX_2005],
}

const powerCycles: TopicMeta = {
  id: 'rankine-brayton-cycles',
  title: 'Ideal Rankine & Brayton Power Cycles',
  duration: '20m',
  level: 'Intermediate',
  summary: 'How a steam plant and a gas turbine turn heat into work, and which knobs raise their efficiency.',
  description:
    'Both cycles pump or compress a working fluid, add heat at high pressure, expand it through a turbine, and reject heat to start over. The Rankine cycle uses water that boils and condenses, so the compression step is cheap (pumping a liquid) and steam properties come from tables. The Brayton cycle keeps a gas as a gas, so the compressor eats a large share of the turbine output. In both, efficiency rises when heat is added at a higher average temperature or rejected at a lower one, and real machines lose ground to turbine and compressor irreversibility.',
  status: 'active',
  learningObjectives: [
    'Trace the four states of a simple Rankine cycle and compute pump work, turbine work, heat input and efficiency from steam enthalpies',
    'Compute the efficiency, back-work ratio and net work of a cold-air-standard Brayton cycle',
    'Predict how boiler pressure, turbine inlet temperature, condenser pressure, and pressure ratio shift cycle efficiency',
  ],
  formulas: [
    { label: 'Pump work', formula: 'w_p = v₁ (p_b − p_c)', latex: 'w_p = v_1\\,(p_b - p_c)', note: 'Saturated liquid is nearly incompressible, so the pump work is tiny.' },
    { label: 'Rankine efficiency', formula: 'η = (w_t − w_p) / q_in = ((h₃−h₄) − (h₂−h₁)) / (h₃−h₂)', latex: '\\eta = \\frac{w_t - w_p}{q_{in}} = \\frac{(h_3-h_4)-(h_2-h_1)}{h_3-h_2}', note: 'For the ideal cycle the turbine is isentropic: s₄ = s₃, so x₄ = (s₃ − s_f)/(s_fg).', emphasis: true },
    { label: 'Brayton temperatures', formula: 'T₂ = T₁ r_p^((k−1)/k), T₄ = T₃ / r_p^((k−1)/k)', latex: 'T_2 = T_1 r_p^{(k-1)/k},\\quad T_4 = \\frac{T_3}{r_p^{(k-1)/k}}', note: 'Isentropic compression and expansion of an ideal gas with constant specific heats.' },
    { label: 'Brayton efficiency', formula: 'η = 1 − r_p^−(k−1)/k', latex: '\\eta = 1 - r_p^{-(k-1)/k}', note: 'Ideal cycle: depends only on pressure ratio and k, not on turbine inlet temperature.', emphasis: true },
    { label: 'Back-work ratio', formula: 'bwr = w_compressor / w_turbine', latex: '\\mathrm{bwr} = \\frac{w_c}{w_t}', note: 'About 1 % for Rankine, 40–60 % for Brayton.' },
    { label: 'Pressure ratio for maximum net work', formula: 'r_p = (T₃/T₁)^(k / 2(k−1))', latex: 'r_p = \\left(\\frac{T_3}{T_1}\\right)^{\\frac{k}{2(k-1)}}', note: 'Ideal Brayton cycle with fixed T₁ and T₃.' },
  ],
  workedExample: {
    given: 'Ideal Rankine cycle: boiler 8 MPa, turbine inlet 500 °C, condenser 10 kPa. Steam data (IAPWS-IF97): at 10 kPa h_f = 191.81 kJ/kg, v_f = 0.001010 m³/kg, s_f = 0.6492, s_fg = 7.4997 kJ/kg·K, h_fg = 2392.1 kJ/kg; at 8 MPa and 500 °C h₃ = 3399.4 kJ/kg and s₃ = 6.7264 kJ/kg·K.',
    find: 'Net work, heat input and thermal efficiency.',
    steps: [
      'Pump: w_p = v₁(p_b − p_c) = 0.001010 × (8000 − 10) = 8.07 kJ/kg, so h₂ = 191.81 + 8.07 = 199.88 kJ/kg',
      'Turbine exit (isentropic): x₄ = (6.7264 − 0.6492)/7.4997 = 0.8103, so h₄ = 191.81 + 0.8103 × 2392.1 = 2130.2 kJ/kg',
      'Turbine work: w_t = h₃ − h₄ = 3399.4 − 2130.2 = 1269.2 kJ/kg',
      'Heat input: q_in = h₃ − h₂ = 3399.4 − 199.9 = 3199.5 kJ/kg; net work w_net = 1269.2 − 8.07 = 1261.1 kJ/kg',
      'Efficiency: η = 1261.1 / 3199.5 = 39.4 %, back-work ratio 8.07/1269.2 = 0.64 %',
      'Brayton check: T₁ = 300 K, r_p = 8, T₃ = 1300 K, air cₚ = 1.005, k = 1.4 gives T₂ = 543.4 K, T₄ = 717.7 K, w_c = 244.7, w_t = 585.3, q_in = 760.3 kJ/kg, so η = 340.6/760.3 = 44.8 % = 1 − 8^(−0.2857) and the back-work ratio is 41.8 %',
    ],
    answer: 'The steam cycle converts 39.4 % of the heat into work with a 0.64 % back-work ratio; the gas-turbine cycle reaches 44.8 % in the ideal case but spends 41.8 % of its turbine work driving the compressor.',
  },
  challenges: [
    'Raise the boiler pressure from 8 to 16 MPa at fixed turbine inlet temperature. What happens to efficiency and to exhaust quality, and why is that a problem for the turbine blades?',
    'Lower the Brayton turbine isentropic efficiency to 0.85 and the compressor to 0.80 while holding r_p = 8. How far does the real efficiency fall below the ideal formula, and what happens to the net work?',
    'For the Brayton cycle, find the pressure ratio that gives maximum net work, and compare it with the pressure ratio that gives maximum efficiency.',
  ],
  applications: [
    'Sizing the steam cycle of a coal, nuclear, biomass or concentrated-solar power plant',
    'Choosing pressure ratio and turbine inlet temperature for a jet engine or industrial gas turbine',
    'Estimating combined-cycle plant performance, where the Brayton exhaust heats the Rankine boiler',
  ],
  references: [MIT_16050, IAPWS_IF97, { label: 'MIT OCW — 2.60J Fundamentals of Advanced Energy Conversion (Spring 2020)', url: 'https://ocw.mit.edu/courses/2-60j-fundamentals-of-advanced-energy-conversion-spring-2020/' }],
}

const conduction: TopicMeta = {
  id: 'conduction-resistance-networks',
  title: 'Steady 1D Conduction & Thermal Resistance Networks',
  duration: '16m',
  level: 'Beginner',
  summary: 'Treat layers of wall and surface films as resistors in series to find the heat rate and every temperature drop.',
  description:
    'Fourier’s law says conduction heat flow is proportional to the temperature gradient. For steady one-dimensional flow, that makes a layer behave exactly like an electrical resistor: temperature difference plays the role of voltage and heat rate plays the role of current. Add the convective films at each surface as two more resistors, and a whole composite wall or insulated pipe reduces to a series circuit. The largest resistance takes the largest temperature drop, which is why a thin layer of good insulation can dominate everything else.',
  status: 'active',
  learningObjectives: [
    'Apply Fourier’s law to a plane wall and a cylindrical shell',
    'Build a series thermal-resistance network that includes convective films, and solve it for the heat rate',
    'Find interface and surface temperatures from the heat rate and each resistance',
    'Explain the critical insulation radius of a cylinder',
  ],
  formulas: [
    { label: "Fourier's law", formula: 'q″ = −k dT/dx', latex: "q'' = -k\\,\\frac{dT}{dx}", note: 'Heat flux flows from hot to cold, proportional to conductivity and gradient.' },
    { label: 'Plane-wall resistances', formula: 'R_cond = L/(kA),  R_conv = 1/(hA)', latex: 'R_{cond} = \\frac{L}{kA},\\quad R_{conv} = \\frac{1}{hA}', note: 'Series layers add: R_tot = ΣR.' },
    { label: 'Cylindrical-shell resistance', formula: 'R_cond = ln(r₂/r₁) / (2πkL)', latex: 'R_{cond} = \\frac{\\ln(r_2/r_1)}{2\\pi k L}', note: 'The area grows with radius, so the temperature profile is logarithmic.' },
    { label: 'Heat rate through the network', formula: 'q = (T∞,1 − T∞,2) / ΣR', latex: 'q = \\frac{T_{\\infty,1}-T_{\\infty,2}}{\\sum R}', note: 'Same q through every element; ΔT_i = q R_i.', emphasis: true },
    { label: 'Critical insulation radius (cylinder)', formula: 'r_crit = k_ins / h', latex: 'r_{crit} = \\frac{k_{ins}}{h}', note: 'Below this outer radius, adding insulation increases heat loss.' },
  ],
  workedExample: {
    given: 'A furnace wall, 1 m², made of 120 mm firebrick (k = 1.0 W/m·K), 80 mm insulation (k = 0.05) and a 5 mm steel casing (k = 45). Hot gas at 800 °C with h = 25 W/m²·K on the inside; room air at 25 °C with h = 10 W/m²·K on the outside.',
    find: 'The heat loss and the temperature at each interface.',
    steps: [
      'Resistances (K/W): film 1/(25) = 0.0400; brick 0.12/1.0 = 0.1200; insulation 0.08/0.05 = 1.6000; steel 0.005/45 = 0.00011; outside film 1/10 = 0.1000',
      'Total: ΣR = 1.8601 K/W',
      'Heat rate: q = (800 − 25)/1.8601 = 416.6 W (416.6 W/m²)',
      'Inside surface: 800 − 416.6 × 0.04 = 783.3 °C; brick/insulation interface: 783.3 − 416.6 × 0.12 = 733.3 °C',
      'Insulation/steel interface: 733.3 − 416.6 × 1.6 = 66.7 °C; steel outer surface ≈ 66.7 °C (the steel drops only 0.05 K)',
    ],
    answer: 'The wall loses 417 W/m². The insulation alone carries 667 K of the 775 K drop; without it, the same wall would lose about 2980 W/m², over seven times more.',
  },
  challenges: [
    'Double the insulation thickness in the plane-wall example. What fraction of the heat loss do you save, and why does the saving fall off as you keep adding insulation?',
    'In the cylinder geometry, choose a low-conductivity layer with k/h larger than the outer radius. Does adding a little more of it raise or lower the heat loss?',
    'Increase the outside h from 10 to 200. How much does the total heat rate change, and which resistance now controls it?',
  ],
  applications: [
    'Sizing furnace, oven, and cold-room wall insulation',
    'Choosing insulation thickness for steam and chilled-water pipes',
    'Estimating heat loss through double-glazed windows and building envelopes',
    'Insulating small electrical wires, where the critical radius makes thin coatings help cooling',
  ],
  references: [MIT_2051, NPTEL_HMT, MIT_251],
}

const fins: TopicMeta = {
  id: 'fins-extended-surfaces',
  title: 'Fins & Extended Surfaces',
  duration: '16m',
  level: 'Intermediate',
  summary: 'Why adding metal fingers to a hot surface helps, and why a longer fin eventually stops helping.',
  description:
    'When convection from a surface is weak (air, for example), adding area is the cheapest way to increase heat transfer. A fin conducts heat away from the base while losing it to the fluid along its sides, so its temperature falls from base to tip. Balancing conduction along the fin with convection from its surface gives an exponential-type solution with one key parameter, m. Fin efficiency measures how much of the ideal (whole fin at base temperature) heat transfer is achieved, and effectiveness compares the fin against leaving the bare base alone.',
  status: 'active',
  learningObjectives: [
    'Derive and use the fin parameter m = √(hP/kA_c)',
    'Compute heat rate for convective-tip, adiabatic-tip and infinite fins',
    'Compute fin efficiency and effectiveness, and judge whether a fin is worth adding',
  ],
  formulas: [
    { label: 'Fin parameter', formula: 'm = √(h P / (k A_c))', latex: 'm = \\sqrt{\\frac{hP}{kA_c}}', note: 'P = perimeter, A_c = cross-section area. 1/m is the length scale of the temperature decay.', emphasis: true },
    { label: 'Temperature distribution', formula: 'θ(x)/θ_b = [cosh m(L−x) + (h/mk) sinh m(L−x)] / [cosh mL + (h/mk) sinh mL]', latex: '\\frac{\\theta(x)}{\\theta_b} = \\frac{\\cosh m(L-x) + \\frac{h}{mk}\\sinh m(L-x)}{\\cosh mL + \\frac{h}{mk}\\sinh mL}', note: 'θ = T − T∞. Convective tip; set h/mk = 0 for an adiabatic tip.' },
    { label: 'Fin heat rate', formula: 'q_f = M (tanh mL + h/mk) / (1 + (h/mk) tanh mL)', latex: 'q_f = M\\,\\frac{\\tanh mL + \\frac{h}{mk}}{1 + \\frac{h}{mk}\\tanh mL},\\quad M = \\sqrt{hPkA_c}\\,\\theta_b', note: 'Adiabatic tip: q_f = M tanh mL. Infinite fin: q_f = M.' },
    { label: 'Fin efficiency', formula: 'η_f = q_f / (h A_f θ_b)', latex: '\\eta_f = \\frac{q_f}{h A_f \\theta_b}', note: 'Actual heat rate over the ideal where the whole fin sits at base temperature.' },
    { label: 'Fin effectiveness', formula: 'ε_f = q_f / (h A_c θ_b)', latex: '\\varepsilon_f = \\frac{q_f}{h A_c \\theta_b}', note: 'Heat rate with the fin divided by that of the bare base. A fin is only worthwhile if ε_f is well above 2.' },
  ],
  workedExample: {
    given: 'An aluminium pin fin (k = 200 W/m·K), diameter 5 mm, length 50 mm, on a 100 °C base in 25 °C air with h = 50 W/m²·K. The tip also convects.',
    find: 'The heat rate, fin efficiency, effectiveness and tip temperature.',
    steps: [
      'P = πD = 15.71 mm, A_c = πD²/4 = 19.63 mm²; m = √(4h/(kD)) = √(4×50/(200×0.005)) = 14.14 m⁻¹, so mL = 0.7071',
      'M = √(hPkA_c) θ_b = √(50 × 0.015708 × 200 × 1.9635×10⁻⁵) × 75 = 0.05554 × 75 = 4.165 W',
      'h/(mk) = 50/(14.14 × 200) = 0.01768; tanh(0.7071) = 0.6089',
      'q_f = 4.165 × (0.6089 + 0.01768)/(1 + 0.01768 × 0.6089) = 4.165 × 0.6199 = 2.58 W',
      'Efficiency: A_f = PL + A_c = 805.0 mm², so η_f = 2.58/(50 × 805.0×10⁻⁶ × 75) = 85.5 %; effectiveness ε_f = 2.58/(50 × 1.9635×10⁻⁵ × 75) = 35.1',
      'Tip temperature: θ_L/θ_b = 1/(cosh mL + (h/mk) sinh mL) = 1/(1.2605 + 0.01768 × 0.7675) = 0.7848, so T_tip = 25 + 0.7848 × 75 = 83.9 °C',
    ],
    answer: 'The fin dissipates about 2.58 W (an adiabatic-tip approximation gives 2.54 W), operates at 85 % efficiency, and is 35 times more effective than the bare base; the tip is still 84 °C.',
  },
  challenges: [
    'Keep increasing the fin length. Beyond roughly mL = 3, what happens to the added heat rate, and why?',
    'Raise h from 50 to 500 W/m²·K (as for water). What happens to fin efficiency and effectiveness, and what does it say about using fins in liquids?',
    'Compare aluminium and stainless steel for the same geometry. Which property in m controls the difference?',
  ],
  applications: [
    'Heat sinks for CPUs, power electronics and LEDs',
    'Air-cooled engine cylinders, motorcycle engines and transformers',
    'Finned-tube radiators, condensers and economizers',
    'Fin-style thermowell and probe errors in temperature measurement',
  ],
  references: [MIT_2051, NPTEL_HMT, MIT_251],
}

const lumped: TopicMeta = {
  id: 'transient-lumped-capacitance',
  title: 'Transient Conduction: Lumped Capacitance & the Biot Number',
  duration: '15m',
  level: 'Intermediate',
  summary: 'When a body is small or conductive enough, it cools like a single thermal mass with one time constant.',
  description:
    'Drop a hot steel ball into cool water. Heat has to travel through the metal to reach the surface, and then leave through the boundary layer. If the metal conducts much better than the surface convects, the ball stays almost uniform in temperature as it cools, and a one-line energy balance gives an exponential. The Biot number, the ratio of internal conduction resistance to surface convection resistance, is the test for when that shortcut is allowed. Above Bi = 0.1 the surface cools faster than the centre and you need the full transient solution.',
  status: 'active',
  learningObjectives: [
    'Compute the characteristic length and Biot number for a plate, cylinder or sphere',
    'Decide whether lumped capacitance applies, using Bi < 0.1',
    'Use the time constant to predict temperature versus time and the time to reach a target temperature',
  ],
  formulas: [
    { label: 'Characteristic length', formula: 'L_c = V / A_s', latex: 'L_c = \\frac{V}{A_s}', note: 'Plate (half-thickness L): L; long cylinder: r/2; sphere: r/3.' },
    { label: 'Biot number', formula: 'Bi = h L_c / k', latex: '\\mathrm{Bi} = \\frac{h L_c}{k}', note: 'Lumped capacitance is accurate to a few percent when Bi < 0.1.', emphasis: true },
    { label: 'Time constant', formula: 'τ = ρ c L_c / h', latex: '\\tau = \\frac{\\rho c L_c}{h}', note: 'Thermal mass divided by surface conductance.' },
    { label: 'Temperature history', formula: '(T − T∞)/(Tᵢ − T∞) = exp(−t/τ)', latex: '\\frac{T-T_\\infty}{T_i-T_\\infty} = e^{-t/\\tau}', note: 'After one τ the body has covered 63.2 % of the way to the fluid temperature.', emphasis: true },
    { label: 'Fourier number', formula: 'Fo = α t / r₀²', latex: '\\mathrm{Fo} = \\frac{\\alpha t}{r_0^2},\\quad \\alpha = \\frac{k}{\\rho c}', note: 'Dimensionless time. The one-term series for the centre is accurate once Fo > 0.2.' },
  ],
  workedExample: {
    given: 'A copper sphere (ρ = 8933 kg/m³, c = 385 J/kg·K, k = 401 W/m·K), radius 10 mm, at 200 °C is dropped into a 25 °C air stream with h = 100 W/m²·K.',
    find: 'Whether lumped capacitance applies, the time constant, the temperature after 60 s, and the time to reach 100 °C.',
    steps: [
      'L_c = V/A_s = r/3 = 3.333 mm; Bi = hL_c/k = 100 × 0.003333/401 = 8.3×10⁻⁴, which is far below 0.1',
      'τ = ρ c L_c / h = 8933 × 385 × 0.003333 / 100 = 114.6 s',
      'T(60 s) = 25 + (200 − 25) × exp(−60/114.6) = 25 + 175 × 0.5925 = 128.7 °C',
      'Time to 100 °C: t = −τ ln[(100 − 25)/(200 − 25)] = −114.6 × ln(0.4286) = 97.1 s',
    ],
    answer: 'Bi is tiny, so the lumped model is valid. The sphere has a 115 s time constant, reaches 128.7 °C after one minute, and falls to 100 °C after about 97 s.',
  },
  challenges: [
    'Replace copper with stainless steel 304 (k ≈ 15 W/m·K) and raise h to 2000 W/m²·K. What is the Biot number now, and how far does the lumped answer drift from the exact centre temperature?',
    'Double the sphere radius. How does the time constant change, and what happens to Bi?',
    'Why is a thermocouple junction made as small as possible?',
  ],
  applications: [
    'Quenching and heat treating small metal parts',
    'Choosing the response time of thermocouples and temperature probes',
    'Estimating how quickly electronic components or batteries heat up',
    'Cooling times of food items, such as sausages or eggs, when the Biot number is small',
  ],
  references: [MIT_2051, MIT_251, NPTEL_HMT],
}

const convectionHx: TopicMeta = {
  id: 'forced-convection-heat-exchangers',
  title: 'Forced Convection & Heat Exchangers (LMTD and ε-NTU)',
  duration: '22m',
  level: 'Advanced',
  summary: 'From the Reynolds number to the film coefficient to the overall U, then rate the whole exchanger two ways.',
  description:
    'Forcing a fluid through a tube thins the boundary layer and raises the convection coefficient, and turbulence raises it a lot. Dimensionless correlations (Nusselt as a function of Reynolds and Prandtl numbers) let you compute h without solving the flow. Combine inside and outside coefficients into an overall coefficient U, multiply by area, and you have the exchanger’s thermal conductance UA. Two equivalent methods then predict performance: the log-mean temperature difference when all four temperatures are known, and effectiveness-NTU when only the inlets are known.',
  status: 'active',
  learningObjectives: [
    'Classify tube flow as laminar or turbulent and pick a Nusselt correlation',
    'Compute the tube-side coefficient h and the overall coefficient U',
    'Rate a heat exchanger with the effectiveness-NTU method and verify it with the LMTD method',
    'Compare parallel-flow, counterflow and shell-and-tube arrangements',
  ],
  formulas: [
    { label: 'Reynolds and Prandtl numbers', formula: 'Re = 4ṁ/(πDμ),  Pr = cₚμ/k', latex: '\\mathrm{Re} = \\frac{4\\dot m}{\\pi D \\mu},\\quad \\mathrm{Pr} = \\frac{c_p \\mu}{k}', note: 'Re below about 2300 is laminar in a tube; above about 10 000 it is fully turbulent.' },
    { label: 'Dittus–Boelter', formula: 'Nu = 0.023 Re^0.8 Pr^0.4', latex: '\\mathrm{Nu} = 0.023\\,\\mathrm{Re}^{0.8}\\,\\mathrm{Pr}^{0.4}', note: 'Turbulent flow, fluid being heated (use 0.3 for cooling). Valid roughly for Re > 10 000, 0.6 < Pr < 160, L/D > 10. Laminar fully developed flow at constant wall temperature has Nu = 3.66.', emphasis: true },
    { label: 'Film coefficient and overall U', formula: 'h = Nu k / D,  U = 1/(1/h_i + 1/h_o)', latex: 'h = \\frac{\\mathrm{Nu}\\,k}{D},\\quad U = \\frac{1}{1/h_i + 1/h_o}', note: 'Wall conduction and fouling neglected here; add their resistances if they matter.' },
    { label: 'LMTD method', formula: 'Q = U A F ΔT_lm,  ΔT_lm = (ΔT₁ − ΔT₂)/ln(ΔT₁/ΔT₂)', latex: 'Q = U A F\\,\\Delta T_{lm},\\quad \\Delta T_{lm} = \\frac{\\Delta T_1 - \\Delta T_2}{\\ln(\\Delta T_1/\\Delta T_2)}', note: 'F = 1 for pure counterflow or parallel flow; F < 1 for shell-and-tube.' },
    { label: 'Effectiveness-NTU', formula: 'Q = ε C_min (T_h,in − T_c,in),  NTU = UA/C_min', latex: 'Q = \\varepsilon\\, C_{min}\\,(T_{h,in}-T_{c,in}),\\quad \\mathrm{NTU} = \\frac{UA}{C_{min}}', note: 'C = ṁ cₚ; C_r = C_min/C_max.', emphasis: true },
    { label: 'Counterflow effectiveness', formula: 'ε = (1 − e^{−NTU(1−C_r)}) / (1 − C_r e^{−NTU(1−C_r)})', latex: '\\varepsilon = \\frac{1 - e^{-\\mathrm{NTU}(1-C_r)}}{1 - C_r\\, e^{-\\mathrm{NTU}(1-C_r)}}', note: 'For C_r = 1: ε = NTU/(1+NTU). Parallel flow: ε = (1 − e^{−NTU(1+C_r)})/(1 + C_r).' },
  ],
  workedExample: {
    given: 'Cold water at 20 °C flows at 1.5 kg/s through 8 tubes, each 20 mm inside diameter and 3 m long (water properties at 40 °C: ρ = 992.2, μ = 6.527×10⁻⁴ Pa·s, k = 0.6285 W/m·K, cₚ = 4179 J/kg·K, Pr = 4.34). A hot stream (1.0 kg/s, cₚ = 4000 J/kg·K) enters the shell at 90 °C with h_o = 2000 W/m²·K, in counterflow.',
    find: 'The tube-side h, U, heat duty, outlet temperatures, and an LMTD check.',
    steps: [
      'Per tube: ṁ = 1.5/8 = 0.1875 kg/s; Re = 4(0.1875)/(π × 0.02 × 6.527×10⁻⁴) = 18 288, turbulent',
      'Nu = 0.023 Re^0.8 Pr^0.4 = 106.3; h_i = Nu k/D = 106.3 × 0.6285/0.02 = 3340 W/m²·K',
      'U = 1/(1/3340 + 1/2000) = 1251 W/m²·K; A = 8π(0.02)(3) = 1.508 m²; UA = 1886 W/K',
      'C_c = 1.5 × 4179 = 6268.5 W/K, C_h = 4000 W/K, so C_min = C_h, C_r = 0.638 and NTU = 1886/4000 = 0.4716',
      'Counterflow ε = (1 − e^{−0.4716×0.3619})/(1 − 0.638 e^{−0.4716×0.3619}) = 0.1569/0.4621 = 0.3396',
      'Q = ε C_min (90 − 20) = 0.3396 × 4000 × 70 = 95.1 kW; T_h,out = 90 − 95 086/4000 = 66.2 °C; T_c,out = 20 + 95 086/6268.5 = 35.2 °C',
      'LMTD check: ΔT₁ = 90 − 35.17 = 54.83 K, ΔT₂ = 66.23 − 20 = 46.23 K, ΔT_lm = 50.41 K, and U A ΔT_lm = 1886 × 50.41 = 95.1 kW, which agrees',
    ],
    answer: 'The tubes see h ≈ 3340 W/m²·K and the exchanger has U ≈ 1250 W/m²·K. It transfers 95.1 kW at ε ≈ 0.34, heating the water to 35.2 °C and cooling the hot stream to 66.2 °C; the LMTD method gives the same duty.',
  },
  challenges: [
    'Reduce the cold-water flow until Re drops below 2300. How does h_i change, and what happens to the duty even though the cold stream now has more time to heat up?',
    'Switch from counterflow to parallel flow with the same UA. How do ε and the outlet temperatures change, and can the cold outlet exceed the hot outlet in each arrangement?',
    'Make C_r = 1 (equal heat-capacity rates) and sweep NTU. What is the maximum effectiveness at NTU = 5 in counterflow?',
  ],
  applications: [
    'Sizing shell-and-tube condensers, oil coolers and chillers',
    'Rating an existing exchanger when flow rates change or the unit is fouled',
    'Selecting tube diameter and tube count to hit a target Reynolds number and pressure drop',
    'Designing radiators and intercoolers where only inlet temperatures are known',
  ],
  references: [MIT_2051, NPTEL_HMT, MIT_251],
}

export const EXTRA_TOPICS: { courseId: string; topics: TopicMeta[] }[] = [
  { courseId: 'thermal-fluids-engineering', topics: [secondLaw, powerCycles] },
]

export const NEW_COURSES: CourseMeta[] = [
  {
    id: 'heat-transfer',
    code: '2.051',
    title: 'Heat Transfer',
    symbol: 'q″ = −k dT/dx',
    category: 'Thermal & fluids',
    description: 'How heat moves by conduction and convection: thermal resistance networks, fins, transient heating and cooling, and heat exchangers.',
    prerequisites: ['Calculus I–II', 'Thermodynamics (first law)', 'Fluid mechanics basics'],
    references: [MIT_2051, MIT_251, NPTEL_HMT],
    topics: [conduction, fins, lumped, convectionHx],
  },
]
