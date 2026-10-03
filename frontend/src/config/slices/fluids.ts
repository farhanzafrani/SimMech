/**
 * Fluid Mechanics course slice: five complete topics, wired into the main
 * curriculum by the lead (see fluids.registry.tsx for the visual components).
 */

import type { CourseMeta, TopicMeta } from '../curriculum'

const controlVolumeMomentum: TopicMeta = {
  id: 'control-volume-momentum',
  title: 'Control-Volume Momentum: Jet Force on a Vane',
  duration: '16m',
  level: 'Intermediate',
  summary: 'Use a control volume and the momentum equation to find the force a jet exerts on a fixed or moving vane.',
  description:
    'Tracking every fluid particle through a nozzle, a bend, or a splash is hopeless; drawing a box around the device and counting the momentum that crosses its walls is easy. Newton’s second law for that box says the net force on the fluid inside equals the rate at which momentum leaves minus the rate at which it enters. For a free jet the pressure is atmospheric everywhere on the box, so the whole force on the vane comes from how much the jet’s direction and speed change — a vane that reverses the jet pushes twice as hard as one that merely stops it.',
  status: 'active',
  learningObjectives: [
    'Choose a control volume and write the steady x- and y-momentum balances for a jet striking a vane',
    'Explain why a vane moving with the jet sees a reduced relative velocity and a reduced mass flow',
    'Distinguish a single moving vane from a wheel of vanes, and compute the wheel’s power and efficiency',
  ],
  formulas: [
    { label: 'Steady momentum balance', formula: 'ΣF = ṁ (V_out − V_in)', latex: '\\sum \\vec F = \\dot m\\,(\\vec V_{out} - \\vec V_{in})', note: 'Net force on the fluid in the control volume equals the change in momentum flux across its surface (one inlet, one outlet).', emphasis: true },
    { label: 'Force of a jet on a fixed vane', formula: 'F_x = ρ A V² (1 − cos θ)', latex: 'F_x = \\rho A V^2 (1 - \\cos\\theta)', note: 'θ is the angle the vane turns the jet through: 90° for a flat plate, 180° for a full reversal (bucket).' },
    { label: 'Force on a single moving vane', formula: 'F_x = ρ A (V − u)² (1 − cos θ)', latex: 'F_x = \\rho A (V-u)^2 (1 - \\cos\\theta)', note: 'Only the relative velocity V − u matters, and only the fluid that catches up with the vane is deflected.' },
    { label: 'Force on a wheel of many vanes', formula: 'F_x = ρ A V (V − u)(1 − cos θ)', latex: 'F_x = \\rho A V (V-u)(1-\\cos\\theta)', note: 'Successive vanes intercept the entire jet, so the full mass flow ρAV is turned.' },
    { label: 'Wheel efficiency', formula: 'η = 2 (u/V)(1 − u/V)(1 − cos θ)', latex: '\\eta = 2\\,\\frac{u}{V}\\left(1-\\frac{u}{V}\\right)(1-\\cos\\theta)', note: 'Power F·u divided by jet kinetic power ½ṁV²; for θ = 180° it peaks at 100% when u = V/2.' },
  ],
  workedExample: {
    given: 'A water jet (ρ = 1000 kg/m³) of diameter d = 50 mm leaves a nozzle at V = 20 m/s and strikes a vane.',
    find: 'The force on a fixed flat plate (θ = 90°), on a fixed bucket (θ = 180°), and the force, power and efficiency of a wheel of 180° buckets moving at u = 10 m/s.',
    steps: [
      'Jet area: A = π d²/4 = π(0.05)²/4 = 1.963×10⁻³ m²; mass flow ṁ = ρAV = 1000 × 1.963×10⁻³ × 20 = 39.27 kg/s',
      'Flat plate, θ = 90°: F = ρAV²(1 − cos 90°) = 1000 × 1.963×10⁻³ × 400 × 1 = 785 N',
      'Fixed bucket, θ = 180°: F = ρAV²(1 − cos 180°) = 785 × 2 = 1571 N — twice the plate, because the jet’s x-momentum is reversed rather than just removed',
      'Wheel at u = 10 m/s: F = ρAV(V − u)(1 − cos 180°) = 1000 × 1.963×10⁻³ × 20 × 10 × 2 = 785 N',
      'Power: P = F·u = 785.4 × 10 = 7854 W; jet power ½ṁV² = 0.5 × 39.27 × 400 = 7854 W, so η = 100% (the best speed ratio u/V = 0.5 for a perfect reversal)',
    ],
    answer: 'Flat plate: 785 N. Fixed bucket: 1571 N. Wheel at u = V/2: 785 N and 7.85 kW, converting all of the jet’s kinetic power in the ideal (frictionless) case.',
  },
  challenges: [
    'Set θ = 180° and sweep the vane speed u from 0 to V. Where does the wheel efficiency peak, and why is the force zero when u = V?',
    'For a single moving vane at u = V/2, compare its force to that of a wheel at the same speed. Why is the wheel force larger by a factor of two?',
    'Reduce θ to 90° and repeat the sweep. What is the peak efficiency now, and why can’t a flat plate ever reach 100%?',
  ],
  applications: [
    'Sizing the buckets and jet speed of a Pelton hydro turbine, whose runner is exactly the wheel-of-vanes case',
    'Finding the thrust reaction on a fire-hose nozzle or the anchoring force on a pipe bend',
    'Estimating the load of a water jet cutter or a sprinkler on its mount',
  ],
  references: [
    { label: 'MIT OCW 2.25 — Advanced Fluid Mechanics: lecture notes', url: 'https://ocw.mit.edu/courses/2-25-advanced-fluid-mechanics-fall-2013/pages/lecture-notes/' },
  ],
}

const viscousFlow: TopicMeta = {
  id: 'viscous-flow',
  title: 'Viscous Flow: Couette, Poiseuille and Reynolds Number',
  duration: '17m',
  level: 'Intermediate',
  summary: 'Exact laminar velocity profiles between plates and in pipes, and the Reynolds number that says when they stop being valid.',
  description:
    'A viscous fluid sticks to the walls, so its velocity must change from zero at a fixed wall to something else in the middle — and viscosity turns that velocity gradient into shear stress. For steady, fully developed laminar flow the Navier–Stokes equations collapse into a single ordinary differential equation with exact answers: a straight-line profile between a fixed and a sliding plate (Couette), and a parabola when a pressure drop pushes fluid down a pipe (Poiseuille). The Reynolds number, the ratio of inertial to viscous effects, tells you whether those answers can be trusted or whether the flow has become turbulent.',
  status: 'active',
  learningObjectives: [
    'Apply Newton’s law of viscosity to find shear stress from a velocity profile',
    'Compute the flow rate, mean velocity and wall shear for laminar pipe flow from a pressure drop',
    'Use the Reynolds number to classify a flow as laminar, transitional or turbulent and decide whether the exact solutions apply',
  ],
  formulas: [
    { label: 'Newton’s law of viscosity', formula: 'τ = μ du/dy', latex: '\\tau = \\mu \\frac{du}{dy}', note: 'Shear stress is proportional to the velocity gradient; μ is the dynamic viscosity (Pa·s).' },
    { label: 'Couette flow with pressure gradient', formula: 'u(y) = U y/h − (dp/dx) y(h − y)/(2μ)', latex: 'u(y) = \\frac{U y}{h} - \\frac{1}{2\\mu}\\frac{dp}{dx}\\,y\\,(h-y)', note: 'Plain Couette flow (dp/dx = 0) is a straight line from 0 to U.' },
    { label: 'Hagen–Poiseuille flow rate', formula: 'Q = π D⁴ Δp / (128 μ L)', latex: 'Q = \\frac{\\pi D^4\\,\\Delta p}{128\\,\\mu L}', note: 'Flow rate depends on the fourth power of the diameter: halve D and Q falls sixteen-fold.', emphasis: true },
    { label: 'Pipe wall shear and profile', formula: 'τ_w = Δp D/(4L),  u = 2V(1 − r²/R²)', latex: '\\tau_w = \\frac{\\Delta p\\,D}{4L},\\quad u(r) = 2V\\left(1-\\frac{r^2}{R^2}\\right)', note: 'The centerline velocity is exactly twice the mean velocity V = Q/A.' },
    { label: 'Reynolds number', formula: 'Re = ρ V D / μ', latex: '\\mathrm{Re} = \\frac{\\rho V D}{\\mu}', note: 'In a pipe, flow is laminar below roughly 2300 and fully turbulent above roughly 4000; laminar friction factor f = 64/Re.' },
  ],
  workedExample: {
    given: 'Water (ρ = 1000 kg/m³, μ = 1.002×10⁻³ Pa·s) flows in a smooth pipe of diameter D = 10 mm and length L = 2 m under a pressure drop Δp = 100 Pa.',
    find: 'The flow rate, mean and maximum velocity, wall shear stress, and whether the flow is laminar.',
    steps: [
      'Q = π D⁴ Δp / (128 μ L) = π(0.01)⁴(100) / (128 × 1.002×10⁻³ × 2) = 1.225×10⁻⁵ m³/s (12.2 mL/s)',
      'V = Q / A = 1.225×10⁻⁵ / (7.854×10⁻⁵ m²) = 0.156 m/s; u_max = 2V = 0.312 m/s',
      'τ_w = Δp D / (4L) = 100 × 0.01 / (4 × 2) = 0.125 Pa (check: 8μV/D = 8 × 1.002×10⁻³ × 0.156 / 0.01 = 0.125 Pa)',
      'Re = ρ V D / μ = 1000 × 0.156 × 0.01 / 1.002×10⁻³ = 1556 < 2300, so the flow is laminar and the Poiseuille solution is valid; f = 64/Re = 0.041',
    ],
    answer: 'Q = 12.2 mL/s with V = 0.156 m/s, u_max = 0.312 m/s and τ_w = 0.125 Pa. Re ≈ 1560, so the flow is laminar and the result stands.',
  },
  challenges: [
    'In the pipe mode, raise the pressure drop until the banner turns from laminar to transitional. At what Re does it flip, and why can’t you trust the displayed profile beyond that point?',
    'Switch the fluid to glycerin with the same pipe and pressure drop. How do the flow rate and Reynolds number change, and which one tells you glycerin is far easier to keep laminar?',
    'In Couette mode, apply a pressure gradient that opposes the plate motion until the lower-plate shear changes sign. What does the velocity profile look like at that point?',
  ],
  applications: [
    'Sizing capillary tubes and viscometers, which infer viscosity from a measured flow rate and pressure drop',
    'Estimating lubricant film shear and friction torque in a journal bearing, which is Couette flow wrapped around a shaft',
    'Predicting blood flow resistance in small vessels and the pressure drop in microfluidic channels',
  ],
  references: [
    { label: 'OpenStax University Physics Vol. 1 — Viscosity and Turbulence', url: 'https://openstax.org/books/university-physics-volume-1/pages/14-7-viscosity-and-turbulence' },
    { label: 'MIT OCW 2.25 — Advanced Fluid Mechanics: lecture notes', url: 'https://ocw.mit.edu/courses/2-25-advanced-fluid-mechanics-fall-2013/pages/lecture-notes/' },
  ],
}

const boundaryLayers: TopicMeta = {
  id: 'boundary-layers',
  title: 'Boundary Layers: Blasius Solution and Skin-Friction Drag',
  duration: '18m',
  level: 'Advanced',
  summary: 'How a thin viscous layer grows along a flat plate, and how it sets friction drag and the laminar-to-turbulent transition.',
  description:
    'At high Reynolds number, viscosity only matters in a thin sheet of fluid hugging the surface, called the boundary layer; outside it the flow behaves as if it were frictionless. On a flat plate the layer starts at zero thickness at the leading edge and thickens as √x because the shear at the wall keeps slowing more fluid. Blasius showed the laminar velocity profile is similar at every station once y is scaled by √(νx/U), reducing the PDEs to one ODE that has to be integrated numerically. Further downstream the layer turns turbulent, thickening faster and dragging harder.',
  status: 'active',
  learningObjectives: [
    'Compute boundary-layer thickness, displacement thickness and local skin friction from the local Reynolds number',
    'Find the friction drag on a flat plate and know when to switch from the laminar to the turbulent correlation',
    'Explain why the laminar boundary layer thickens as √x while the turbulent one grows faster',
  ],
  formulas: [
    { label: 'Local Reynolds number', formula: 'Re_x = U x / ν', latex: '\\mathrm{Re}_x = \\frac{U x}{\\nu}', note: 'Transition on a smooth flat plate typically begins near Re_x ≈ 5×10⁵ (it depends on free-stream turbulence and roughness).' },
    { label: 'Blasius thickness (laminar)', formula: 'δ ≈ 4.91 x / √Re_x', latex: '\\delta_{99} \\approx \\frac{4.91\\,x}{\\sqrt{\\mathrm{Re}_x}}', note: 'δ is where u reaches 99% of U; displacement thickness δ* = 1.721 x/√Re_x and momentum thickness θ = 0.664 x/√Re_x.', emphasis: true },
    { label: 'Local skin friction (laminar)', formula: 'c_f = 0.664 / √Re_x', latex: 'c_f = \\frac{\\tau_w}{\\tfrac12\\rho U^2} = \\frac{0.664}{\\sqrt{\\mathrm{Re}_x}}', note: 'Skin friction falls with distance as the layer thickens and the wall gradient weakens.' },
    { label: 'Plate drag coefficient (laminar)', formula: 'C_D = 1.328 / √Re_L', latex: 'C_D = \\frac{1.328}{\\sqrt{\\mathrm{Re}_L}}', note: 'Total friction drag on one side is D = C_D · ½ρU² · bL; it is exactly twice the local c_f at the trailing edge.' },
    { label: 'Turbulent / mixed correlations', formula: 'C_D = 0.074/Re_L^(1/5) − 1742/Re_L', latex: 'C_D = \\frac{0.074}{\\mathrm{Re}_L^{1/5}} - \\frac{1742}{\\mathrm{Re}_L}', note: 'For a plate that is laminar up to Re = 5×10⁵ and turbulent beyond; fully turbulent from the leading edge drops the second term (δ = 0.37x/Re_x^(1/5)).' },
  ],
  workedExample: {
    given: 'Air (ρ = 1.2 kg/m³, ν = 1.5×10⁻⁵ m²/s) flows at U = 5 m/s over a flat plate with length L = 1 m and width b = 1 m.',
    find: 'The Reynolds number, boundary-layer thickness at the trailing edge, wall shear there, and friction drag on one side.',
    steps: [
      'Re_L = U L / ν = 5 × 1 / 1.5×10⁻⁵ = 3.33×10⁵ < 5×10⁵, so the layer is laminar over the whole plate; √Re_L = 577.4',
      'δ = 4.91 L / √Re_L = 4.91 / 577.4 = 8.50 mm; δ* = 1.721 / 577.4 = 2.98 mm',
      'c_f = 0.664 / 577.4 = 1.150×10⁻³; dynamic pressure ½ρU² = 0.5 × 1.2 × 25 = 15 Pa, so τ_w = c_f × 15 = 0.0173 Pa',
      'C_D = 1.328 / 577.4 = 2.30×10⁻³; D = C_D × 15 Pa × (1 m × 1 m) = 0.0345 N',
    ],
    answer: 'The layer is laminar with δ ≈ 8.5 mm at the trailing edge, τ_w ≈ 0.017 Pa there, and the friction drag on one face is only ≈ 0.035 N.',
  },
  challenges: [
    'Increase the free-stream speed until the transition marker appears on the plate. How does the drag coefficient change as the turbulent region takes over?',
    'Switch from air to water at the same speed. How does Re_L change, and what does that do to the boundary-layer thickness relative to the plate length?',
    'Double the plate length at fixed speed in the laminar regime. By what factor does the total friction drag change, and why is it not simply doubled?',
  ],
  applications: [
    'Estimating skin-friction drag on a ship hull, aircraft fuselage or wing surface — the dominant drag source on slender bodies',
    'Predicting where separation or transition occurs, which controls the stall and heat-transfer behaviour of turbine blades',
    'Sizing thermal and concentration boundary layers in heat exchangers, which grow in the same √x way',
  ],
  references: [
    { label: 'MIT OCW 16.100 — Aerodynamics: lecture notes', url: 'https://ocw.mit.edu/courses/16-100-aerodynamics-fall-2005/pages/lecture-notes/' },
    { label: 'MIT OCW 2.25 — Advanced Fluid Mechanics: lecture notes', url: 'https://ocw.mit.edu/courses/2-25-advanced-fluid-mechanics-fall-2013/pages/lecture-notes/' },
  ],
}

const dragLift: TopicMeta = {
  id: 'drag-lift',
  title: 'Drag and Lift on Bodies: Cylinder and Airfoil Coefficients',
  duration: '17m',
  level: 'Intermediate',
  summary: 'Turn dimensionless drag and lift coefficients into forces, and see how Reynolds number and angle of attack change them.',
  description:
    'Nobody solves the full flow around a car, a chimney or a wing just to find the force on it: engineers measure or look up a dimensionless coefficient and multiply by dynamic pressure times a reference area. For a blunt body such as a cylinder the flow separates and leaves a low-pressure wake, so drag is mostly pressure drag and the coefficient jumps downward when the boundary layer goes turbulent (the drag crisis). For a wing, thin-airfoil theory gives a lift coefficient growing linearly with angle of attack, and generating that lift on a finite span costs induced drag.',
  status: 'active',
  learningObjectives: [
    'Convert a drag or lift coefficient into a force using dynamic pressure and the correct reference area',
    'Explain the Reynolds-number dependence of cylinder and sphere drag, including the drag crisis',
    'Compute the lift and drag of a finite wing using the lift-curve slope and the drag polar, and recognise stall',
  ],
  formulas: [
    { label: 'Drag and lift forces', formula: 'D = C_D · ½ρV² A,   L = C_L · ½ρV² S', latex: 'D = C_D\\,\\tfrac12\\rho V^2 A,\\qquad L = C_L\\,\\tfrac12\\rho V^2 S', note: 'A is the projected frontal area for bluff bodies; S is the planform area for a wing.', emphasis: true },
    { label: 'Finite-wing lift-curve slope', formula: 'a = a₀ / (1 + a₀/(π e AR)),  a₀ = 2π', latex: 'a = \\frac{a_0}{1 + \\dfrac{a_0}{\\pi e\\,AR}},\\quad a_0 = 2\\pi\\ \\text{per rad}', note: 'Thin-airfoil theory gives 2π per radian for an infinite wing; finite aspect ratio AR lowers it.' },
    { label: 'Lift coefficient', formula: 'C_L = a (α − α_L0)', latex: 'C_L = a\\,(\\alpha - \\alpha_{L0})', note: 'α_L0 is the zero-lift angle: 0° for a symmetric section, negative for a cambered one. Valid only before stall.' },
    { label: 'Drag polar', formula: 'C_D = C_D0 + C_L² / (π e AR)', latex: 'C_D = C_{D0} + \\frac{C_L^2}{\\pi e\\,AR}', note: 'Profile drag plus induced drag; e is the span-efficiency (Oswald) factor, near 0.9 for a clean wing.' },
    { label: 'Reynolds number for bodies', formula: 'Re = ρ V D / μ', latex: '\\mathrm{Re} = \\frac{\\rho V D}{\\mu}', note: 'For a smooth cylinder, C_D ≈ 1.2 across 10³–2×10⁵, then falls sharply around Re ≈ 3×10⁵ as the boundary layer turns turbulent.' },
  ],
  workedExample: {
    given: 'A finite wing of area S = 10 m², aspect ratio AR = 8, e = 0.9, C_D0 = 0.01, a cambered section with α_L0 = −2°, flies at V = 50 m/s in air (ρ = 1.225 kg/m³) at angle of attack α = 5°.',
    find: 'The lift coefficient, drag coefficient, lift, drag and lift-to-drag ratio.',
    steps: [
      'Lift-curve slope: a = 2π / (1 + 2π/(π · 0.9 · 8)) = 6.283 / (1 + 0.2778) = 4.917 per rad',
      'C_L = a (α − α_L0) = 4.917 × (7° × π/180) = 4.917 × 0.1222 = 0.601',
      'Induced drag: C_Di = C_L² / (π e AR) = 0.361 / 22.62 = 0.0160; total C_D = 0.01 + 0.0160 = 0.0260',
      'Dynamic pressure: ½ρV² = 0.5 × 1.225 × 50² = 1531 Pa; L = 0.601 × 1531 × 10 = 9199 N; D = 0.0260 × 1531 × 10 = 397 N',
      'L/D = 0.601 / 0.0260 = 23.1',
    ],
    answer: 'The wing makes ≈ 9.2 kN of lift for ≈ 0.40 kN of drag, an L/D of about 23, with C_L = 0.60 and C_D = 0.026.',
  },
  challenges: [
    'In the wing mode, sweep the angle of attack and find the α that gives the best L/D. Why does it fall at high α even before stall?',
    'Cut the aspect ratio from 12 to 4 at fixed α. What happens to the lift-curve slope and the induced drag, and why do gliders have long thin wings?',
    'In the bluff-body mode, increase the speed of a cylinder in air until the drag crisis appears. Does drag force (not just C_D) go down when the speed goes up through the crisis?',
  ],
  applications: [
    'Computing wind loading on chimneys, light poles and cables, where vortex shedding and cylinder drag set the design load',
    'Sizing wing area and aspect ratio for aircraft and gliders from a required lift at takeoff or cruise',
    'Estimating the drag on cyclists, vehicles and sports balls, whose behaviour near the drag crisis explains why golf balls have dimples',
  ],
  references: [
    { label: 'MIT OCW 16.100 — Aerodynamics: lecture notes', url: 'https://ocw.mit.edu/courses/16-100-aerodynamics-fall-2005/pages/lecture-notes/' },
  ],
}

const pumpsSystemCurves: TopicMeta = {
  id: 'pump-system-curves',
  title: 'Pumps and System Curves: Operating Point and NPSH',
  duration: '18m',
  level: 'Intermediate',
  summary: 'Find where a centrifugal pump actually operates on a piping system, and check that it will not cavitate.',
  description:
    'A centrifugal pump does not deliver one fixed flow: it delivers whatever flow makes the head it can produce equal to the head the piping demands. The pump curve falls with flow, the system curve (elevation lift plus friction and fitting losses that grow with the square of velocity) rises with flow, and their intersection is the operating point. Throttling a valve, lengthening the pipe or shrinking its diameter moves the system curve and slides the operating point along the pump curve. On the suction side, the liquid pressure at the impeller eye must stay above the vapor pressure, which is what comparing the available and required net positive suction head checks.',
  status: 'active',
  learningObjectives: [
    'Build a system curve from static head plus friction and minor losses, and intersect it with a pump curve',
    'Compute hydraulic power, shaft power and see how efficiency varies with the distance from the best-efficiency point',
    'Calculate NPSH available and decide whether the pump will cavitate against the NPSH required on its datasheet',
  ],
  formulas: [
    { label: 'System curve', formula: 'H_sys = H_static + (f L/D + ΣK) V² / 2g', latex: 'H_{sys} = H_{static} + \\left(f\\frac{L}{D} + \\sum K\\right)\\frac{V^2}{2g}', note: 'Darcy–Weisbach friction plus minor losses; since V = Q/A the loss term grows as Q².', emphasis: true },
    { label: 'Operating point', formula: 'H_pump(Q) = H_sys(Q)', latex: 'H_{pump}(Q_{op}) = H_{sys}(Q_{op})', note: 'The single flow where the head the pump supplies equals the head the system requires.' },
    { label: 'Pump power', formula: 'P_shaft = ρ g Q H / η', latex: 'P_{shaft} = \\frac{\\rho g Q H}{\\eta}', note: 'ρgQH is the hydraulic power added to the fluid; η is the pump efficiency at that flow.' },
    { label: 'NPSH available', formula: 'NPSHa = (p_atm − p_v)/(ρg) + z_s − h_loss,suction', latex: '\\mathrm{NPSH}_a = \\frac{p_{atm} - p_v}{\\rho g} + z_s - h_{L,suction}', note: 'z_s is the liquid level above the pump centerline (negative for a suction lift); p_v is the vapor pressure at the fluid temperature.' },
    { label: 'Cavitation criterion', formula: 'NPSHa > NPSHr', latex: '\\mathrm{NPSH}_a > \\mathrm{NPSH}_r', note: 'NPSHr comes from the manufacturer’s test curve; practice adds a margin above it, since NPSHr rises with flow.' },
  ],
  workedExample: {
    given: 'A pump has a head curve H = 40 − 25,000 Q² (H in m, Q in m³/s; 30 m at 20 L/s, its best-efficiency point, peak efficiency 75%). It pumps water through D = 100 mm commercial steel pipe (roughness 0.046 mm), L = 100 m, ΣK = 5, against a static head of 15 m. The pump sits 4 m above the water surface (z_s = −4 m), suction ΣK_s = 1.5, p_atm = 101.3 kPa, p_v = 2.34 kPa (20 °C), NPSHr = 3 m.',
    find: 'The operating flow and head, the shaft power, and whether the pump cavitates.',
    steps: [
      'Pipe area A = π(0.1)²/4 = 7.854×10⁻³ m². Guess Re ≈ 3×10⁵ and ε/D = 4.6×10⁻⁴: Swamee–Jain gives f ≈ 0.0181, so fL/D + ΣK = 18.1 + 5 = 23.1',
      'H_sys = 15 + 23.1 Q²/(2g A²) ≈ 15 + 19,100 Q². Setting 40 − 25,000 Q² = 15 + 19,100 Q² gives Q² = 25/44,100, so Q = 0.0238 m³/s (23.8 L/s) and H = 40 − 25,000 × (0.0238)² = 25.8 m',
      'Check: V = Q/A = 3.03 m/s, Re = 3.0×10⁵ — consistent with the f assumed. Q/Q_BEP = 1.19, so η = 0.75(2 × 1.19 − 1.19²) = 0.723',
      'P_hyd = ρ g Q H = 1000 × 9.81 × 0.0238 × 25.8 = 6.03 kW; P_shaft = 6.03/0.723 = 8.34 kW',
      'NPSHa = (101,325 − 2,339)/(1000 × 9.81) − 4 − 1.5 × 3.03²/(2 × 9.81) = 10.09 − 4 − 0.70 = 5.39 m > NPSHr = 3 m',
    ],
    answer: 'The pump runs at ≈ 23.8 L/s and 25.8 m, drawing ≈ 8.3 kW of shaft power at 72% efficiency. NPSHa ≈ 5.4 m exceeds NPSHr = 3 m by 2.4 m, so cavitation is not expected.',
  },
  challenges: [
    'Raise the minor-loss coefficient ΣK as if throttling a valve. How does the operating flow move, and does the shaft power rise or fall?',
    'Increase the suction lift (make z_s more negative) until the cavitation banner appears. Which single change fixes it most cheaply: a shorter suction line, a lower fluid temperature, or a lower pump?',
    'Raise the vapor pressure slider toward the value for hot water. Why do boiler-feed and hot-water pumps need their liquid supplied from above?',
  ],
  applications: [
    'Selecting a pump for a building water supply, cooling loop or irrigation system by matching its curve to the system curve',
    'Troubleshooting a pump that runs noisy or loses performance because of suction-side cavitation',
    'Controlling flow with a throttle valve versus a variable-speed drive, which moves the system curve versus the pump curve',
  ],
  references: [
    { label: 'MIT OCW 2.25 — Inviscid Flow and Bernoulli (mechanical energy, head loss)', url: 'https://ocw.mit.edu/courses/2-25-advanced-fluid-mechanics-fall-2013/pages/inviscid-flow-and-bernoulli/' },
  ],
}

export const NEW_COURSES: CourseMeta[] = [
  {
    id: 'fluid-mechanics',
    code: '2.25',
    title: 'Fluid Mechanics',
    symbol: 'Re = ρVL/μ',
    category: 'Thermal & fluids',
    description: 'How fluids push back: the momentum, viscous, and boundary-layer effects behind jet forces, pipe flow, drag, lift and pumps.',
    prerequisites: ['Calculus I–II', 'Engineering Dynamics', 'Fluid statics and Bernoulli'],
    references: [
      { label: 'MIT OCW — 2.25 Advanced Fluid Mechanics (Fall 2013)', url: 'https://ocw.mit.edu/courses/2-25-advanced-fluid-mechanics-fall-2013/' },
      { label: 'MITx Online — Thermal-Fluids Engineering 1: Basics of Thermodynamics and Hydrostatics', url: 'https://mitxonline.mit.edu/courses/course-v1:MITxT+2.005.1x/' },
      { label: 'MIT OCW — 16.100 Aerodynamics (Fall 2005)', url: 'https://ocw.mit.edu/courses/16-100-aerodynamics-fall-2005/' },
      { label: 'edX — Fluid Mechanics courses', url: 'https://www.edx.org/learn/fluid-mechanics' },
    ],
    topics: [controlVolumeMomentum, viscousFlow, boundaryLayers, dragLift, pumpsSystemCurves],
  },
]

export const EXTRA_TOPICS: { courseId: string; topics: TopicMeta[] }[] = []
