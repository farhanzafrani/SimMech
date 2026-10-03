import type { TeachingContent } from '../teachingTypes'
import { EE } from '../teachingTypes'

/** Fluid Mechanics (2.25) teaching content. */
export const CONTENT: Record<string, TeachingContent> = {
  'control-volume-momentum': {
    intuition:
      'Hold a garden hose and aim it at a wall: you feel the hose push back at you, and the wall feels the water push on it. Now cup your hand so the water turns back on itself and the push roughly doubles. Nothing mysterious is happening — water arrives with forward momentum and leaves with less (or backwards), and Newton says the missing momentum had to be taken by a force. The control-volume trick is to stop following individual water molecules and instead draw an imaginary box around the vane. You only count momentum per second crossing the box walls. Because the jet is in open air, the pressure on that box is atmospheric almost everywhere, so the only thing that can change the water’s momentum is the vane pushing on it — and by Newton’s third law the water pushes back on the vane just as hard. A moving vane is the same story with one twist: the jet only "catches up" with a vane that is running away at speed u, so both the speed it meets the water at and the water it can catch shrink.',
    derivation: [
      {
        text: 'Start from Newton’s second law for a fixed chunk of fluid (a system): the net force equals the rate of change of its momentum. That is true but awkward, because the chunk moves and deforms.',
        latex: '\\sum \\vec F = \\frac{d\\vec P_{sys}}{dt}',
      },
      {
        text: 'The Reynolds transport theorem re-expresses this for a fixed control volume. The force equals the storage of momentum inside plus the net momentum flux leaving through the control surface.',
        latex: '\\sum \\vec F = \\frac{d}{dt}\\int_{CV}\\rho \\vec V\\, dV + \\int_{CS}\\rho \\vec V\\,(\\vec V\\cdot\\hat n)\\, dA',
      },
      {
        text: 'For steady flow with one inlet and one outlet the storage term vanishes and each flux integral collapses to mass flow rate times velocity, giving the working form of the momentum equation. It is a vector equation, so write one scalar equation per direction.',
        latex: '\\sum \\vec F = \\dot m\\,(\\vec V_{out} - \\vec V_{in}),\\qquad \\dot m = \\rho A V',
      },
      {
        text: 'Apply it to a jet hitting a fixed vane. In gauge pressure the jet is at zero pressure at inlet and outlet, gravity and friction are neglected, and Bernoulli along the streamline then says the jet leaves with the same speed V. If the vane turns the jet through an angle θ, the outlet x-velocity is V cos θ. The force on the fluid is the vane’s push, F_vane on fluid:',
        latex: 'F_{vane\\to fluid,x} = \\dot m\\,(V\\cos\\theta - V)',
      },
      {
        text: 'The jet pushes back on the vane with the equal and opposite force, so with ṁ = ρAV:',
        latex: 'F_x = \\rho A V^2\\,(1-\\cos\\theta)',
      },
      {
        text: 'For a vane moving away at speed u, change to the vane’s frame, where the water arrives at the relative speed V − u and leaves at that same relative speed. Only the stream that actually catches the vane has mass flow ρA(V − u), so:',
        latex: 'F_x = \\rho A\\,(V-u)^2\\,(1-\\cos\\theta)',
      },
      {
        text: 'A wheel of many vanes always has some vane in the way, so the entire jet flow ρAV is deflected, but each blade still sees the relative speed V − u. That gives the wheel force, and power P = F·u divided by the jet kinetic power ½ṁV² gives the efficiency, which for θ = 180° peaks at 100% when u = V/2.',
        latex: 'F_x = \\rho A V (V-u)(1-\\cos\\theta),\\qquad \\eta = 2\\frac{u}{V}\\left(1-\\frac{u}{V}\\right)(1-\\cos\\theta)',
      },
    ],
    commonMistakes: [
      'Using absolute pressure on the control surface. Atmospheric pressure acts on every face of a free-jet control volume and cancels, so work in gauge pressure (zero on the jet). Putting 101 kPa on only the inlet face gives an absurd force.',
      'Getting the sign of the force wrong. The momentum equation gives the force on the fluid. The force on the vane (or on the pipe bend, or on the anchor bolts) is the opposite. Always say which body your free-body diagram is about.',
      'Using the full jet flow ρAV for a single moving vane. A lone vane running away at u only intercepts ρA(V − u); the factor is (V − u)², not V(V − u). The wheel gets V(V − u) because the next vane is always there to catch the water the previous one missed.',
      'Treating θ as the angle between the jet and the vane surface instead of the angle the jet is turned through. A flat plate hit square-on turns the jet 90° (the sideways splash carries no x-momentum), a full bucket turns it 180°. The factor (1 − cos θ) is 1 and 2 respectively.',
      'Forgetting that velocities in the momentum equation are vectors. For a bend that is not aligned with an axis you must write both the x and y components; adding magnitudes of V_in and V_out is wrong unless the flow reverses along a line.',
      'Assuming the ideal 100% efficiency is real. It requires a perfect 180° reversal (physically the jet must leave slightly sideways so it does not hit the next bucket), no splash, no friction and exactly u = V/2. Real Pelton buckets reach high efficiency, but the ideal formula is an upper bound.',
    ],
    rulesOfThumb: [
      'Turning the jet through 180° gives twice the force of stopping it (90°) at the same V and A; the force scales with V², so doubling jet speed quadruples the load on the vane.',
      'The best vane speed for a wheel with full reversal is about half the jet speed (u/V ≈ 0.5). That is why Pelton buckets are designed around a runner speed near half the jet velocity.',
      'Sanity check the answer against jet momentum flux ṁV: a fixed vane can never exert more than 2ṁV (the full-reversal limit) on a jet, however you shape it.',
      'Whenever you need a force on a fixed bend, nozzle or reducer, draw the box first and list the pressure forces on its faces; momentum problems are 80% bookkeeping and only 20% algebra.',
    ],
    designChecklist: [
      'Sketch the device and draw a control volume that cuts through the fluid streams at inlets and outlets, where velocity and pressure are known.',
      'Choose axes and write down which forces act on the CV: pressure on the cut faces (gauge), the force from the solid on the fluid, and weight if it matters.',
      'Establish steady flow and mass conservation: ṁ in = ṁ out, with ṁ = ρAV (use relative velocity for a moving vane).',
      'Find the outlet velocity vector, using Bernoulli or a no-friction assumption to say the speed relative to the vane is unchanged.',
      'Write the x and y momentum equations as ΣF = ṁ(V_out − V_in) and solve for the force on the fluid.',
      'Flip the sign to get the force on the vane or anchor, then compare with the 2ṁV bound as a sanity check.',
      'For turbines, compute power F·u and efficiency, and choose the vane speed near V/2.',
    ],
    prerequisites: [
      { courseId: 'thermal-fluids-engineering', topicId: 'fluid-statics-bernoulli', why: 'You need continuity (ṁ = ρAV) and Bernoulli to say the jet leaves the vane at the same speed.' },
      { courseId: 'engineering-dynamics', topicId: 'newton-work-energy', why: 'The momentum equation is Newton’s second law applied to a control volume.' },
    ],
    quiz: [
      {
        kind: 'numeric',
        prompt: 'A water jet (ρ = 1000 kg/m³) of diameter 30 mm moves at V = 15 m/s and hits a fixed bucket that turns it through 180°. What force does the jet exert on the bucket?',
        answer: 318.1,
        unit: 'N',
        explanation: 'A = π(0.03)²/4 = 7.069×10⁻⁴ m². F = ρAV²(1 − cos 180°) = 1000 × 7.069×10⁻⁴ × 225 × 2 = 318.1 N. The factor 2 appears because the x-momentum is not just removed but reversed.',
      },
      {
        kind: 'numeric',
        prompt: 'The same 30 mm, 15 m/s water jet drives a wheel of 180° buckets moving at u = 5 m/s. What is the force on the wheel? Assume the whole jet is intercepted.',
        answer: 212.1,
        unit: 'N',
        explanation: 'For a wheel, F = ρAV(V − u)(1 − cos θ) = 1000 × 7.069×10⁻⁴ × 15 × 10 × 2 = 212.1 N. The mass flow is the full jet ρAV, but each blade sees the relative speed V − u = 10 m/s.',
      },
      {
        kind: 'numeric',
        prompt: 'The same fixed-vane jet (30 mm, 15 m/s) strikes a vane that turns it through only 60°. What is the force in the jet direction?',
        answer: 79.5,
        unit: 'N',
        explanation: 'F = ρAV²(1 − cos 60°) = 1000 × 7.069×10⁻⁴ × 225 × 0.5 = 79.5 N. Turning the jet less takes out less x-momentum, so the force is a quarter of the 180° case.',
      },
      {
        kind: 'choice',
        prompt: 'A student computes the force on a SINGLE moving vane (speed u, 180° turn) as ρAV(V − u) × 2. What is wrong?',
        options: [
          'Nothing, that is the correct single-vane formula.',
          'The mass flow should be ρA(V − u), not ρAV; the correct force is ρA(V − u)² × 2. The formula used is the one for a wheel of vanes.',
          'The factor 2 should be 1, since a moving vane cannot reverse the jet.',
          'The speed should be V + u because the vane moves with the jet.',
        ],
        correct: 1,
        explanation: 'A single vane running away only catches the water that is faster than it, a flow of ρA(V − u). The wheel formula ρAV(V − u) works only because the following vanes intercept the water the first one missed. At u = V/2 the single vane therefore gets half the wheel force.',
      },
      {
        kind: 'choice',
        prompt: 'A wheel with flat-plate vanes (each turns the jet through 90°) runs at its best speed. What is its maximum ideal efficiency?',
        options: ['25%', '100%', '75%', '50%'],
        correct: 3,
        explanation: 'η = 2(u/V)(1 − u/V)(1 − cos θ). At u = V/2 the first part is 0.5; with θ = 90° the last factor is 1, so η = 0.5. Half the jet’s kinetic energy leaves with the water, which still has its sideways speed after the splash.',
      },
      {
        kind: 'choice',
        prompt: 'Why does a wheel of 180° buckets deliver zero force when the bucket speed equals the jet speed (u = V)?',
        options: [
          'The bucket moves with the jet, so there is no relative velocity and the water no longer has to be turned or caught.',
          'At u = V the water turns to vapor and stops pushing.',
          'Friction exactly cancels the jet force at that speed.',
          'The control volume contains no mass at that speed.',
        ],
        correct: 0,
        explanation: 'F ∝ (V − u). When u = V the bucket is travelling at the water’s speed, so the relative speed is zero: the water simply tags along, no momentum changes and no force is exerted (and zero force means zero power, which is why efficiency also drops to zero at u = V).',
      },
    ],
  },

  'viscous-flow': {
    intuition:
      'Picture honey in a jar. The layer touching the glass is stuck to it, the layer next to that is dragged along by internal friction, and so on, so the speed changes smoothly from zero at the wall to something else further in. Viscosity is the fluid’s resistance to that layers-sliding-over-layers motion, and the shear stress is simply viscosity times how steeply the speed changes with distance. Push honey through a tube with a pressure difference and it moves fastest on the axis and not at all at the wall, a bullet-shaped parabola. Push it between a fixed plate and a moving one with no pressure and you get a straight ramp. The Reynolds number asks a different question: is viscosity strong enough to keep those smooth layers in order, or has the fluid’s own inertia grown so large that the layers break into swirls (turbulence)? Thick, slow, narrow means laminar; thin, fast, wide means turbulent, and the tidy parabola stops being true.',
    derivation: [
      {
        text: 'Newton’s law of viscosity is the constitutive rule for the shear stress in a simple (Newtonian) fluid. Here u is the velocity along the flow and y (or r) is the distance across it, and μ is the dynamic viscosity in Pa·s.',
        latex: '\\tau = \\mu\\,\\frac{du}{dy}',
      },
      {
        text: 'Take steady, fully developed flow in a pipe of radius R. Draw a cylinder of fluid of radius r and length L along the axis. Pressure pushes it forward on its end faces, shear resists it on its curved wall. No acceleration means these balance:',
        latex: '\\Delta p\\,\\pi r^2 = \\tau(r)\\,2\\pi r L \\;\\Rightarrow\\; \\tau(r) = \\frac{\\Delta p\\, r}{2L}',
      },
      {
        text: 'Velocity decreases outward, so τ = −μ du/dr. Substitute and integrate, using the no-slip condition u(R) = 0 to fix the constant:',
        latex: 'u(r) = \\frac{\\Delta p}{4\\mu L}\\left(R^2 - r^2\\right)',
      },
      {
        text: 'Integrate the profile over the cross-section to get the flow rate. Writing R = D/2 gives the Hagen–Poiseuille law, with the fourth power of diameter coming from one factor of R² in the profile and one from the area element.',
        latex: 'Q = \\int_0^R u\\,2\\pi r\\,dr = \\frac{\\pi R^4\\,\\Delta p}{8\\mu L} = \\frac{\\pi D^4\\,\\Delta p}{128\\,\\mu L}',
      },
      {
        text: 'Divide by the area for the mean velocity, then compare with the centerline value from the profile. The peak is exactly twice the mean, and the wall shear follows from setting r = R in the force balance:',
        latex: 'V = \\frac{\\Delta p R^2}{8\\mu L},\\quad u_{max} = 2V,\\quad \\tau_w = \\frac{\\Delta p\\,D}{4L} = \\frac{8\\mu V}{D}',
      },
      {
        text: 'Define the Darcy friction factor from the wall shear, f = 8τ_w/(ρV²). Substituting τ_w = 8μV/D turns the laminar result into a function of one dimensionless group, the Reynolds number: the ratio of inertial to viscous effects. Experiment says this holds only up to Re ≈ 2300.',
        latex: 'f = \\frac{64}{\\mathrm{Re}},\\qquad \\mathrm{Re} = \\frac{\\rho V D}{\\mu}',
      },
    ],
    commonMistakes: [
      'Confusing dynamic viscosity μ (Pa·s) with kinematic viscosity ν = μ/ρ (m²/s). Use μ in Poiseuille and in τ = μ du/dy; use ν only in forms like Re = VD/ν. Mixing them is an error of a factor of ρ, i.e. about 1000 for water.',
      'Using Hagen–Poiseuille for turbulent flow. Q ∝ Δp holds only while laminar; in turbulent flow Δp goes roughly as the square of velocity, so the "∝ D⁴" and "∝ Δp" statements no longer apply and the formula over-predicts the flow badly.',
      'Reading the Reynolds number in the wrong length. For a pipe use the diameter (not the radius or the length of the pipe); using the radius halves Re. For a non-circular duct use the hydraulic diameter, 4A/P.',
      'Ignoring entrance length. Poiseuille’s parabola needs fully developed flow, which takes roughly 0.05·Re·D of pipe in laminar flow. A short pipe or a capillary connected to a reservoir has extra pressure loss at the entrance that the textbook formula leaves out.',
      'Treating viscosity as a constant. Oils can change viscosity by a factor of 10 or more over a modest temperature range, so a Q or τ computed at room temperature may be badly wrong in a hot or cold system. Gases go the other way, with viscosity rising slightly with temperature.',
      'Plugging in mean velocity where the maximum belongs (or vice versa). The centerline speed is 2V, so the peak speed, and the dynamic effects based on it, are twice what the flow rate alone suggests.',
    ],
    rulesOfThumb: [
      'In a pipe, Re below roughly 2300 is laminar, above about 4000 is turbulent, and in between is unpredictable, so treat 2300–4000 as "don’t design on it".',
      'Halving the diameter at fixed pressure drop cuts the laminar flow rate to 1/16; to keep the same flow through a pipe of half the diameter you need about 16× the pressure drop.',
      'Water at room temperature has μ ≈ 1×10⁻³ Pa·s (ν ≈ 1×10⁻⁶ m²/s) and air about 1.8×10⁻⁵ Pa·s (ν ≈ 1.5×10⁻⁵ m²/s). Water in a 25 mm pipe at 0.1 m/s is already near Re ≈ 2500, so most real plumbing is turbulent.',
      'Laminar friction is f = 64/Re: it falls with Re, and it does not depend on wall roughness. Roughness matters only once the flow is turbulent.',
    ],
    designChecklist: [
      'Compute Re = ρVD/μ first. It decides which solution you are allowed to use.',
      'If laminar and fully developed, check the geometry (pipe or parallel plates) and choose the matching profile and Q formula.',
      'Get μ at the actual operating temperature, not the handbook value at 20 °C.',
      'Solve for the unknown (Q, Δp, or D) using Q = πD⁴Δp/(128μL), keeping all units in SI.',
      'Recompute Re from the result; if it is above about 2300, abandon the laminar answer and use a friction-factor method.',
      'Check the entrance length against the pipe length, and the wall shear if a fragile fluid (blood, a suspension) is involved.',
    ],
    prerequisites: [
      { courseId: 'thermal-fluids-engineering', topicId: 'fluid-statics-bernoulli', why: 'Pressure, continuity and the idea of mean velocity are assumed throughout.' },
      { courseId: 'fluid-mechanics', topicId: 'control-volume-momentum', why: 'The pipe force balance is a control-volume momentum balance with zero acceleration.' },
    ],
    videos: [
      {
        id: 'VvDJyhYSJv8',
        title: 'Understanding Viscosity',
        channel: EE,
        why: 'Introduces viscosity, the property behind τ = μ du/dy.',
      },
      {
        id: '9A-uUG0WR0w',
        title: 'Understanding Laminar and Turbulent Flow',
        channel: EE,
        why: 'Covers the laminar versus turbulent distinction behind the Reynolds-number criterion.',
      },
    ],
    quiz: [
      {
        kind: 'numeric',
        prompt: 'Oil (μ = 0.100 Pa·s, ρ = 900 kg/m³) flows in a pipe with D = 20 mm and L = 3 m under a pressure drop of 5000 Pa. Assuming laminar flow, what is the flow rate in mL/s?',
        answer: 65.45,
        unit: 'mL/s',
        explanation: 'Q = πD⁴Δp/(128μL) = π(0.02)⁴(5000)/(128 × 0.1 × 3) = 6.545×10⁻⁵ m³/s = 65.45 mL/s. Check: V = 0.208 m/s so Re = 900 × 0.208 × 0.02/0.1 = 37.5, far below 2300, so the laminar assumption is valid.',
      },
      {
        kind: 'numeric',
        prompt: 'For the same oil pipe (D = 20 mm, L = 3 m, Δp = 5000 Pa), what is the shear stress at the pipe wall?',
        answer: 8.333,
        unit: 'Pa',
        explanation: 'τ_w = ΔpD/(4L) = 5000 × 0.02/(4 × 3) = 8.33 Pa. It follows from the force balance on the fluid: the pressure force on the cross-section (Δp πD²/4) equals the wall shear on the area πDL.',
      },
      {
        kind: 'numeric',
        prompt: 'Water (ρ = 1000 kg/m³, μ = 1.002×10⁻³ Pa·s) flows at a mean speed of 0.5 m/s in a 50 mm pipe. What is the Reynolds number?',
        answer: 24950,
        explanation: 'Re = ρVD/μ = 1000 × 0.5 × 0.05/1.002×10⁻³ ≈ 24,950. That is well above 4000, so the flow is turbulent and Hagen–Poiseuille does not apply.',
      },
      {
        kind: 'numeric',
        prompt: 'In Couette flow between a fixed plate and a plate moving at U = 2 m/s a gap h = 1 mm apart, with no pressure gradient, the fluid has μ = 0.05 Pa·s. What is the shear stress?',
        answer: 100,
        unit: 'Pa',
        explanation: 'With dp/dx = 0 the profile is a straight line, du/dy = U/h = 2/0.001 = 2000 s⁻¹, so τ = μ du/dy = 0.05 × 2000 = 100 Pa. The shear is the same at every level in the gap, which is why the profile is a straight line.',
      },
      {
        kind: 'choice',
        prompt: 'A pipe’s diameter is halved while the pressure drop, length and fluid stay the same, and the flow stays laminar. What happens to the flow rate?',
        options: ['It falls by a factor of 2.', 'It falls by a factor of 4.', 'It falls by a factor of 8.', 'It falls by a factor of 16.'],
        correct: 3,
        explanation: 'Q ∝ D⁴, so halving D gives (1/2)⁴ = 1/16. One factor of D² comes from the smaller area; the other D² comes from the weaker velocity profile, because the wall is closer to the fluid and the shear is stronger.',
      },
      {
        kind: 'choice',
        prompt: 'Spot the error: "For laminar pipe flow the mean velocity is V = 1.5 u_max because the profile is parabolic." Which statement is correct?',
        options: [
          'The statement is correct for a pipe.',
          'u_max = V/2 for a pipe.',
          'u_max = 2V for a circular pipe; the factor 1.5 is for flow between parallel plates.',
          'V = u_max because the viscosity is constant.',
        ],
        correct: 2,
        explanation: 'Integrating the pipe parabola u = u_max(1 − r²/R²) over the circular area gives V = u_max/2, so u_max = 2V. The factor 1.5 (u_max = 1.5V) is the result for a pressure-driven flow between two parallel plates, where the area element is different.',
      },
    ],
  },

  'boundary-layers': {
    intuition:
      'Run your hand through still water, or imagine air blowing along a flat board. Right at the surface the air must be stationary (no slip), but a short distance above it moves at full speed. All of the slowing-down happens inside a thin skin of fluid, the boundary layer, and outside that skin the flow acts as if viscosity did not exist. The skin starts at zero thickness at the leading edge and thickens as it travels, because wall friction keeps slowing more and more fluid. The thickness grows only as the square root of distance: viscosity spreads the slowdown outward by diffusion, which is a slow process, while the stream carries the fluid downstream at speed U. Near the leading edge the velocity changes over a very thin gap, so wall shear is highest there, and it weakens as the layer thickens. Further along, small disturbances grow, the layer turns turbulent and thickens faster, and it grips the wall harder, so friction drag climbs.',
    derivation: [
      {
        text: 'Start with a scaling argument. A fluid parcel is carried along the plate for a time t ≈ x/U. In that time viscosity can diffuse the "I am slowed by the wall" message a distance of about √(νt), where ν = μ/ρ is the kinematic viscosity. So:',
        latex: '\\delta \\sim \\sqrt{\\nu\\,\\frac{x}{U}} \\;\\Rightarrow\\; \\frac{\\delta}{x} \\sim \\frac{1}{\\sqrt{\\mathrm{Re}_x}},\\quad \\mathrm{Re}_x = \\frac{Ux}{\\nu}',
      },
      {
        text: 'The boundary layer is thin when Re_x is large, which is the justification for treating the outer flow as inviscid. Within the layer the Navier–Stokes equations simplify to Prandtl’s boundary-layer equations, with u and v continuous and ∂p/∂x = 0 along a flat plate.',
        latex: 'u\\frac{\\partial u}{\\partial x} + v\\frac{\\partial u}{\\partial y} = \\nu\\frac{\\partial^2 u}{\\partial y^2},\\qquad \\frac{\\partial u}{\\partial x} + \\frac{\\partial v}{\\partial y} = 0',
      },
      {
        text: 'Blasius noticed the velocity profile has the same shape at every x if you scale the height as η = y √(U/(νx)). Writing the streamfunction as ψ = √(νUx) f(η) collapses the PDEs to a single ODE, which has no closed-form solution and is integrated numerically:',
        latex: "2 f''' + f f'' = 0,\\quad f(0)=f'(0)=0,\\; f'(\\infty)=1",
      },
      {
        text: 'The numerical solution says u reaches 99% of U at η = 4.91, which defines the boundary layer thickness, and that the wall velocity gradient is f″(0) = 0.332 (in scaled form). So:',
        latex: '\\delta_{99} = \\frac{4.91\\,x}{\\sqrt{\\mathrm{Re}_x}},\\qquad \\tau_w = \\mu\\left.\\frac{\\partial u}{\\partial y}\\right|_0 = 0.332\\,\\rho U^2/\\sqrt{\\mathrm{Re}_x}',
      },
      {
        text: 'Dividing by the dynamic pressure gives the local skin-friction coefficient:',
        latex: 'c_f = \\frac{\\tau_w}{\\tfrac12\\rho U^2} = \\frac{0.664}{\\sqrt{\\mathrm{Re}_x}}',
      },
      {
        text: 'Integrate the wall shear along a plate of length L (and width b) to get the friction drag, and write it as a coefficient. Because c_f ∝ x^(−1/2), the integral is twice the end value; the average is twice the local value at the trailing edge. The drag goes as L^(1/2), not L, because the front of the plate carries most of the drag.',
        latex: 'D = b\\int_0^L \\tau_w\\,dx,\\qquad C_D = \\frac{D}{\\tfrac12\\rho U^2 bL} = \\frac{1.328}{\\sqrt{\\mathrm{Re}_L}}',
      },
    ],
    commonMistakes: [
      'Using the laminar formulas past transition. Blasius δ = 4.91x/√Re_x and C_D = 1.328/√Re_L only hold while Re_x is below roughly 5×10⁵ (and that value moves with free-stream turbulence and surface roughness). Beyond it you need the turbulent or mixed correlations.',
      'Mixing up the local and average coefficients. c_f = 0.664/√Re_x is the value at a point; C_D = 1.328/√Re_L is the average over the whole plate and is twice the trailing-edge c_f. Use the one that matches the quantity you want.',
      'Computing the drag on one side of a plate and calling it the total. A thin plate in the stream has two wetted faces, so the total friction drag is twice the one-sided value.',
      'Using the wrong length in Re. Re_x is measured from the leading edge, not from some downstream point. Re_L uses the full plate length in the flow direction.',
      'Treating "the boundary layer thickness δ" as a sharp edge. δ_99 is a convention (99% of U); the displacement thickness δ* (about 1.721x/√Re_x) is the one that tells you how much the outer flow is pushed outwards, and the momentum thickness θ (0.664x/√Re_x) is the one that gives drag.',
      'Applying the flat-plate result to curved or pressure-gradient flow. With an adverse pressure gradient (decelerating flow on the rear of a wing or in a diffuser) the boundary layer can separate, and the flat-plate drag and thickness formulas do not apply at all.',
    ],
    rulesOfThumb: [
      'Transition on a smooth flat plate in a quiet stream typically begins near Re_x ≈ 5×10⁵; rough surfaces or a turbulent free stream bring it forward, so treat 5×10⁵ as a typical value rather than a law.',
      'A laminar boundary layer is thin: δ/x ≈ 5/√Re_x. At Re_x = 10⁶ it is only about 0.5% of the distance from the leading edge.',
      'Friction drag is large on streamlined bodies (long hulls, fuselages, wings), where pressure drag is small, and small on blunt bodies, where pressure drag dominates.',
      'Doubling the length of a laminar plate raises its total friction drag by only about √2 ≈ 1.41, not 2.',
    ],
    designChecklist: [
      'Compute Re_L = UL/ν, using ν at the fluid temperature, and compare with the transition value near 5×10⁵.',
      'If laminar throughout, use δ, c_f and C_D from the Blasius solution and read off the local Re_x where you need local values.',
      'If transition is expected, use the mixed correlation C_D = 0.074/Re_L^(1/5) − 1742/Re_L (valid roughly for 5×10⁵ < Re_L < 10⁷) or a fully turbulent one if the layer is tripped at the leading edge.',
      'Convert the coefficient to force with ½ρU² × (wetted area), counting both sides for a thin plate.',
      'Check roughness: a rough surface in turbulent flow has higher drag than the smooth-plate formulas predict.',
      'Check for pressure gradients and separation if the surface is curved; if so, flat-plate results are only a starting estimate.',
    ],
    prerequisites: [
      { courseId: 'fluid-mechanics', topicId: 'viscous-flow', why: 'Newton’s law of viscosity, no-slip and Reynolds number are the building blocks.' },
      { courseId: 'thermal-fluids-engineering', topicId: 'pipe-flow-heat-transfer', why: 'Introduces the laminar/turbulent distinction and friction coefficients that the plate results parallel.' },
    ],
    videos: [
      {
        id: '9A-uUG0WR0w',
        title: 'Understanding Laminar and Turbulent Flow',
        channel: EE,
        why: 'Background on the laminar versus turbulent distinction that governs boundary-layer transition.',
      },
    ],
    quiz: [
      {
        kind: 'numeric',
        prompt: 'Air (ν = 1.5×10⁻⁵ m²/s) flows at U = 10 m/s along a flat plate. What is the laminar boundary-layer thickness δ (99%) at x = 0.5 m, in mm?',
        answer: 4.252,
        unit: 'mm',
        explanation: 'Re_x = 10 × 0.5/1.5×10⁻⁵ = 3.333×10⁵ (below 5×10⁵, so laminar). δ = 4.91x/√Re_x = 4.91 × 0.5/577.4 = 4.25 mm.',
      },
      {
        kind: 'numeric',
        prompt: 'For the same flow (U = 10 m/s, ν = 1.5×10⁻⁵ m²/s) on a smooth plate, at what distance from the leading edge does transition begin if it occurs at Re_x = 5×10⁵?',
        answer: 0.75,
        unit: 'm',
        explanation: 'x_tr = Re_tr ν/U = 5×10⁵ × 1.5×10⁻⁵/10 = 0.75 m. Beyond this distance the laminar formulas no longer apply.',
      },
      {
        kind: 'numeric',
        prompt: 'The same air flow (U = 10 m/s, ρ = 1.2 kg/m³, ν = 1.5×10⁻⁵ m²/s) passes over a plate 0.4 m long and 1 m wide. What is the friction drag on one side, in newtons (laminar)?',
        answer: 0.0617,
        unit: 'N',
        explanation: 'Re_L = 10 × 0.4/1.5×10⁻⁵ = 2.667×10⁵ (laminar). C_D = 1.328/√Re_L = 1.328/516.4 = 2.572×10⁻³. Dynamic pressure ½ρU² = 60 Pa and area = 0.4 m², so D = 2.572×10⁻³ × 60 × 0.4 = 0.0617 N.',
      },
      {
        kind: 'numeric',
        prompt: 'A smooth plate has Re_L = 10⁷ and is laminar up to Re = 5×10⁵, turbulent after. Using C_D = 0.074/Re_L^(1/5) − 1742/Re_L, what is the drag coefficient?',
        answer: 0.002772,
        explanation: '0.074/(10⁷)^0.2 = 0.074/25.12 = 2.946×10⁻³, and 1742/10⁷ = 1.742×10⁻⁴. The difference is 2.772×10⁻³. The subtracted term corrects for the early laminar stretch, which has less friction than a fully turbulent layer would.',
      },
      {
        kind: 'choice',
        prompt: 'A laminar flat plate is made twice as long at the same speed and fluid (still laminar). By what factor does its total friction drag change?',
        options: ['About 1.41 (√2)', '2', '4', 'It stays the same'],
        correct: 0,
        explanation: 'D = C_D · ½ρU² · bL with C_D ∝ L^(−1/2), so D ∝ L^(1/2). The first part of the plate has a thin layer and high wall shear and the rear part has weak shear, so extending the plate adds less than the first piece contributed.',
      },
      {
        kind: 'choice',
        prompt: 'Spot the error: a student writes the total laminar drag coefficient of a plate as C_D = 0.664/√Re_L. What is wrong?',
        options: [
          'It should be 0.664/Re_L, with no square root.',
          'The coefficient 0.664 is the local c_f; the plate-average is twice as large, 1.328/√Re_L.',
          'The Re should be Re_x at the middle of the plate.',
          'Nothing; 0.664 is the correct constant for C_D.',
        ],
        correct: 1,
        explanation: 'Wall shear is largest near the leading edge and falls like x^(−1/2). Integrating c_f = 0.664/√Re_x from 0 to L and dividing by L gives twice the trailing-edge value: C_D = 1.328/√Re_L.',
      },
    ],
  },

  'drag-lift': {
    intuition:
      'Stick your hand out of a moving car window. Palm forward, it is shoved back hard; knifed edge-on, much less. Tilt the hand slightly up and it is also pushed upward. Those two forces, drag along the flow and lift across it, come from two sources: pressure acting on the surface (high in front, low behind or on top) and friction in the thin boundary layer. A blunt body such as a cylinder leaves a wide low-pressure wake, so almost all its drag is pressure drag. A streamlined body keeps the flow attached and has mostly friction drag. A wing turns the flow downward and the air pushes back up, the lift; but the finite wing also drags a spiral of air along with it, and that is induced drag, the price of making lift. The trick that makes all this manageable is that the force always scales as the dynamic pressure ½ρV² times an area, and the messy fluid physics is hidden in one dimensionless number: the coefficient.',
    derivation: [
      {
        text: 'Dimensional analysis. The drag force on a body of size L in a stream depends on ρ, V, μ and L (and shape). Dimensional analysis (the Buckingham Pi theorem) then says the force coefficient can depend only on the Reynolds number (and on shape and orientation).',
        latex: '\\frac{D}{\\tfrac12\\rho V^2 L^2} = f(\\mathrm{Re}),\\qquad \\mathrm{Re} = \\frac{\\rho V L}{\\mu}',
      },
      {
        text: 'Replace L² with a chosen reference area, the projected frontal area A for bluff bodies and the planform area S for wings, and lump the function into a measured coefficient:',
        latex: 'D = C_D\\,\\tfrac12\\rho V^2 A,\\qquad L = C_L\\,\\tfrac12\\rho V^2 S',
      },
      {
        text: 'For a thin airfoil in attached, inviscid flow, thin-airfoil theory (a result we state rather than derive here) gives a lift coefficient proportional to the angle of attack measured from the zero-lift line, with slope 2π per radian:',
        latex: 'C_l = 2\\pi\\,(\\alpha - \\alpha_{L0})',
      },
      {
        text: 'A finite wing sheds tip vortices that induce a downwash, reducing the effective angle of attack. Lifting-line theory for an elliptic loading gives the reduced slope, where AR = b²/S is the aspect ratio and e a span-efficiency factor close to 1:',
        latex: 'a = \\frac{a_0}{1 + \\dfrac{a_0}{\\pi e\\,AR}},\\qquad C_L = a\\,(\\alpha-\\alpha_{L0})',
      },
      {
        text: 'The same downwash tilts the lift vector backward, adding a drag called induced drag. Adding the profile drag C_D0 gives the drag polar:',
        latex: 'C_D = C_{D0} + \\frac{C_L^2}{\\pi e\\,AR}',
      },
      {
        text: 'In steady level flight lift equals weight, L = W, so the speed needed is found by solving L = C_L ½ρV²S. Setting C_L = C_Lmax gives the stall speed:',
        latex: 'V_{stall} = \\sqrt{\\frac{2W}{\\rho\\,S\\,C_{L,max}}}',
      },
    ],
    commonMistakes: [
      'Using the wrong reference area. Bluff-body C_D is usually based on frontal (projected) area; wing C_L and C_D are based on planform area; some coefficients (for a streamlined body or a sphere in a table) use other areas. Always check what area the quoted coefficient assumes.',
      'Forgetting that force scales with V². Doubling the speed quadruples the drag at constant C_D, and the power needed (D·V) grows by a factor of eight.',
      'Using the wrong Reynolds number regime. A cylinder’s C_D ≈ 1.2 is a plateau over a wide range, but near Re ≈ 3×10⁵ the boundary layer turns turbulent, separation moves back and C_D drops sharply (the drag crisis). A golf ball’s dimples trigger this at flight speed; a smooth sphere of the same size would be in the high-drag regime.',
      'Extrapolating the lift curve past stall. C_L = a(α − α_L0) is linear only up to the stall angle (typically in the range of 12–18° for conventional sections, depending on Re and shape). Beyond it the flow separates, C_L drops, and drag rises steeply.',
      'Ignoring induced drag when sizing a wing. At low speed and high C_L, induced drag can be the major part of total drag, and it falls with aspect ratio: ignoring it underestimates takeoff and climb power.',
      'Using sea-level density at altitude, or the wrong units for angles. The coefficient equations require α in radians when multiplying by a per radian (a₀ = 2π); plugging in degrees gives answers that are off by a factor of about 57.',
    ],
    rulesOfThumb: [
      'A smooth cylinder in the 10³–2×10⁵ range has C_D ≈ 1.0–1.2; a sphere about 0.4–0.5 over a wide range; a flat plate normal to the flow about 1.1–2 (depending on aspect ratio); a streamlined body 0.04 or lower. Use tables as a first estimate, not a design basis.',
      'For a typical clean wing, e ≈ 0.8–0.9, and C_D0 of well-designed light aircraft is around 0.02–0.03.',
      'Best L/D occurs when induced drag equals profile drag, C_Di = C_D0. That is where C_L = √(C_D0 π e AR) and L/D is at its maximum.',
      'Long thin wings (high AR) have lower induced drag and a steeper lift curve; that is why gliders look the way they do. Short wings have more induced drag but are stronger and more agile.',
      'Dynamic pressure at 50 m/s in sea-level air is about 1.5 kPa; at 100 m/s about 6.1 kPa. A useful scale when estimating loads.',
    ],
    designChecklist: [
      'Decide whether the body is bluff or streamlined and which coefficient set applies (cylinder, sphere, plate, airfoil, wing).',
      'Compute the Reynolds number and check for regime changes such as the drag crisis for round bodies.',
      'Identify the correct reference area for the coefficient you are using.',
      'Compute dynamic pressure ½ρV² with density at the actual altitude and temperature.',
      'Get force = coefficient × dynamic pressure × area, and repeat at the worst-case speed or gust.',
      'For a wing, find a from AR, compute C_L at α, add induced drag via the polar, and check C_L stays below C_Lmax with margin.',
      'Check structural and dynamic effects: wind-induced vibration (vortex shedding) of cylinders and poles can matter more than the mean drag.',
    ],
    prerequisites: [
      { courseId: 'fluid-mechanics', topicId: 'boundary-layers', why: 'Skin friction, separation and transition explain the origin of drag and the drag crisis.' },
      { courseId: 'thermal-fluids-engineering', topicId: 'fluid-statics-bernoulli', why: 'Dynamic pressure ½ρV² comes straight out of Bernoulli.' },
    ],
    videos: [
      {
        id: 'GMmNKUlXXDs',
        title: 'Understanding Aerodynamic Drag',
        channel: EE,
        why: 'Overview of aerodynamic drag, the quantity this topic puts into a coefficient.',
      },
      {
        id: 'E3i_XHlVCeU',
        title: 'Understanding Aerodynamic Lift',
        channel: EE,
        why: 'Overview of how lift arises, to complement the coefficient-based treatment here.',
      },
    ],
    quiz: [
      {
        kind: 'numeric',
        prompt: 'A cylindrical chimney section 0.2 m in diameter and 3 m long sits in a 20 m/s crosswind (air ρ = 1.2 kg/m³). With C_D = 1.2 based on frontal area (D × L), what is the drag force?',
        answer: 172.8,
        unit: 'N',
        explanation: 'Dynamic pressure ½ρV² = 0.5 × 1.2 × 400 = 240 Pa. Frontal area A = 0.2 × 3 = 0.6 m². D = C_D × 240 × 0.6 = 172.8 N.',
      },
      {
        kind: 'numeric',
        prompt: 'A wing of area 16 m² flies at 60 m/s in air with ρ = 1.225 kg/m³ at C_L = 0.5. What is the lift?',
        answer: 17640,
        unit: 'N',
        explanation: 'q = ½ρV² = 0.5 × 1.225 × 3600 = 2205 Pa. L = C_L q S = 0.5 × 2205 × 16 = 17,640 N.',
      },
      {
        kind: 'numeric',
        prompt: 'An aircraft weighing 10,000 N has a wing of area 10 m² and a maximum lift coefficient of 1.4. At sea level (ρ = 1.225 kg/m³), what is the level-flight stall speed?',
        answer: 34.15,
        unit: 'm/s',
        explanation: 'At stall, L = W = C_Lmax ½ρV²S, so V = √(2W/(ρ S C_Lmax)) = √(20,000/(1.225 × 10 × 1.4)) = √(1166.1) = 34.15 m/s.',
      },
      {
        kind: 'numeric',
        prompt: 'A wing with AR = 10 and e = 0.85 operates at C_L = 0.8. What is its induced drag coefficient?',
        answer: 0.02397,
        explanation: 'C_Di = C_L²/(π e AR) = 0.64/(π × 0.85 × 10) = 0.64/26.70 = 0.02397. Notice it grows with the square of C_L, so it matters most in slow flight.',
      },
      {
        kind: 'choice',
        prompt: 'A wing has C_D0 = 0.02, AR = 10 and e = 0.85. At what lift coefficient is L/D a maximum?',
        options: ['About 0.37', 'About 0.55', 'About 0.73', 'About 1.46'],
        correct: 2,
        explanation: 'L/D = C_L/(C_D0 + kC_L²) with k = 1/(π e AR) is maximized where C_D0 = kC_L², i.e. C_L = √(C_D0 π e AR) = √(0.02 × 26.70) = 0.731. At that point induced drag equals profile drag (0.02 each, total 0.04), giving L/D ≈ 18.3.',
      },
      {
        kind: 'choice',
        prompt: 'Spot the error: "I calculated the lift of a wing as C_L ½ρV² times the frontal area of the wing, since drag uses frontal area." What is wrong?',
        options: [
          'Nothing, lift always uses the frontal area.',
          'Wing coefficients are defined on planform area S, so using frontal area would give an answer many times too small.',
          'Lift should use the wetted area of the whole aircraft.',
          'Lift does not depend on area, only on dynamic pressure.',
        ],
        correct: 1,
        explanation: 'By convention wing C_L and C_D use the planform area S (the area seen from above). The frontal area of a thin wing is tiny compared with S, so using it would underestimate lift by a large factor. Always use the reference area the coefficient was defined with.',
      },
    ],
  },

  'pump-system-curves': {
    intuition:
      'Think of a pump and a pipe as two people in a tug-of-war on a pressure see-saw. The pipe system demands a certain head to move a given flow: first you have to lift the water to its destination (the static head, which does not care about flow), and then you have to push it through the pipes against friction, which gets much worse the faster it flows (roughly with the square of flow). The pump supplies head, but a centrifugal pump supplies less of it the more flow you ask for. At low flow the pump has head to spare and the water accelerates; at high flow the pipe wants more than the pump can give and the flow slows. The flow settles where the two curves cross, the operating point, and nowhere else. On the suction side there is a separate hazard: the pump inlet is the lowest-pressure place in the system, and if the pressure there falls toward the vapour pressure of the liquid the water boils into bubbles that then collapse violently on the impeller. That is cavitation, and NPSH is simply the margin above boiling.',
    derivation: [
      {
        text: 'Apply the energy equation (Bernoulli with losses and a pump) between the free surfaces of the supply and delivery tanks. Surface pressures and velocities are small or equal, so the pump head h_p must supply the elevation difference plus all the losses in between:',
        latex: 'h_p = \\Delta z + h_L = H_{static} + h_L',
      },
      {
        text: 'Pipe friction follows the Darcy–Weisbach equation and each fitting adds a minor loss K·V²/2g. Together they form the loss term of the system curve:',
        latex: 'h_L = \\left(f\\frac{L}{D} + \\sum K\\right)\\frac{V^2}{2g}',
      },
      {
        text: 'Replace the velocity by the flow rate using V = Q/A. The required head is then a function of Q alone: a constant static head plus a term in Q², and the friction factor f(Re) varies only weakly, so the system curve is close to a parabola that starts at the static head:',
        latex: 'H_{sys}(Q) = H_{static} + \\left(f\\frac{L}{D} + \\sum K\\right)\\frac{Q^2}{2gA^2}',
      },
      {
        text: 'The pump has its own head curve H_pump(Q), measured on a test stand and falling with Q. The pump can only run at a flow where it supplies exactly what the system asks for, so the operating point is the intersection:',
        latex: 'H_{pump}(Q_{op}) = H_{sys}(Q_{op})',
      },
      {
        text: 'The hydraulic power the liquid receives is the weight flow times the head. Dividing by the pump efficiency η at that flow gives the shaft power that the motor must supply:',
        latex: 'P_{hyd} = \\rho g Q H,\\qquad P_{shaft} = \\frac{\\rho g Q H}{\\eta}',
      },
      {
        text: 'For the suction side, write the total absolute head at the pump inlet, referred to the free surface of the supply tank (at pressure p_atm and elevation z_s above the pump). The head at the inlet is that minus the suction losses; NPSH available is what remains above the vapour-pressure head, and cavitation is avoided if it exceeds NPSH required (from the manufacturer):',
        latex: '\\mathrm{NPSH}_a = \\frac{p_{atm}-p_v}{\\rho g} + z_s - h_{L,s} > \\mathrm{NPSH}_r',
      },
    ],
    commonMistakes: [
      'Using the static head alone as "the head the pump must supply". Friction and minor losses can be as large as the static head, and they grow as Q². A pump chosen for the static head only will deliver much less flow than intended.',
      'Mixing absolute and gauge pressure in NPSH. NPSH uses absolute pressures (p_atm and p_v), since cavitation is about the true pressure approaching the vapour pressure. Using gauge pressure gives an answer that is about 10 m too low.',
      'Taking the sign of z_s wrong. If the pump is above the water level (a suction lift) the term is negative and reduces NPSHa; if the liquid is above the pump (flooded suction) it is positive.',
      'Forgetting that vapour pressure rises sharply with temperature. A pump that is fine on 20 °C water (p_v ≈ 2.3 kPa) can cavitate on hot water (about 20 kPa at 60 °C), because the available margin shrinks by about 1.8 m.',
      'Forgetting that NPSHr is not constant. It rises with flow, so a throttled pump might be safe while the same pump at runout (high flow) cavitates. Check NPSHa against NPSHr at the actual operating flow, with a margin.',
      'Throttling a valve and expecting power to drop by much. Closing a valve moves the system curve up and left; flow falls and head rises, but the pump is then running away from its best efficiency point, so energy is wasted as head across the valve.',
    ],
    rulesOfThumb: [
      'Try to run a centrifugal pump near its best-efficiency point (BEP); roughly 70–120% of BEP flow is a commonly used window, and operation far from it brings vibration, recirculation and bearing wear.',
      'Water at 20 °C and sea level gives about 10 m of absolute head (p_atm/ρg); subtract about 0.24 m for vapour pressure, then every metre of suction lift and every metre of suction loss comes off the rest. Practical suction lifts are well below 10 m.',
      'Keep NPSHa above NPSHr by a margin; a common rule is at least about 0.5–1 m or a factor of 1.1–1.3 (project specifications vary and some require more), because NPSHr rises with flow.',
      'In a system dominated by friction, the system curve is a parabola; to double the flow you need roughly four times the friction head, which means roughly eight times the hydraulic power.',
      'A variable-speed drive moves the pump curve, a throttle valve moves the system curve; the first saves energy and the second wastes it.',
    ],
    designChecklist: [
      'Establish the duty: required flow, static lift, pipe length, diameter, fittings and liquid properties (density, viscosity, vapour pressure at the highest temperature).',
      'Compute the Reynolds number and friction factor (Colebrook or Swamee–Jain), add the minor losses, and build the system curve H_sys(Q).',
      'Overlay the candidate pump curve and find the intersection; iterate if f changes appreciably with Re.',
      'Check that the operating point lies near the best-efficiency point and that the pump still delivers the required flow at the worst-case (fouled, throttled) system curve.',
      'Compute hydraulic and shaft power from the efficiency at the operating point, and size the motor with a margin.',
      'Compute NPSHa at the operating flow and the worst-case temperature, and compare with the manufacturer’s NPSHr; fix it by lowering the pump, enlarging the suction pipe or cooling the liquid.',
      'Think about control: a throttle valve is cheap but wasteful, a variable-speed drive costs more and uses less energy if the demand varies.',
    ],
    prerequisites: [
      { courseId: 'thermal-fluids-engineering', topicId: 'pipe-flow-heat-transfer', why: 'The friction factor and minor-loss formulas build the system curve.' },
      { courseId: 'thermal-fluids-engineering', topicId: 'fluid-statics-bernoulli', why: 'The energy equation and head are the foundation of the pump and NPSH analysis.' },
    ],
    quiz: [
      {
        kind: 'numeric',
        prompt: 'A pump head curve is H = 30 − 12,000 Q² and the system curve is H = 10 + 8,000 Q² (H in m, Q in m³/s). What is the operating flow in L/s?',
        answer: 31.62,
        unit: 'L/s',
        explanation: 'Set the heads equal: 30 − 12,000 Q² = 10 + 8,000 Q², so 20 = 20,000 Q² and Q² = 0.001, Q = 0.03162 m³/s = 31.62 L/s. The head there is 30 − 12,000 × 0.001 = 18 m.',
      },
      {
        kind: 'numeric',
        prompt: 'At that operating point (Q = 31.62 L/s, H = 18 m) the pump efficiency is 70%. What is the shaft power in kW? Use ρ = 1000 kg/m³, g = 9.81 m/s².',
        answer: 7.977,
        unit: 'kW',
        explanation: 'Hydraulic power = ρgQH = 1000 × 9.81 × 0.03162 × 18 = 5584 W. Divide by the efficiency: 5584/0.70 = 7977 W ≈ 7.98 kW. The motor must supply the extra 2.4 kW that the pump loses to internal friction and leakage.',
      },
      {
        kind: 'numeric',
        prompt: 'A valve is partly closed so that the system curve becomes H = 10 + 14,000 Q² while the same pump curve (H = 30 − 12,000 Q²) is used. What is the new operating flow in L/s?',
        answer: 27.74,
        unit: 'L/s',
        explanation: '30 − 12,000 Q² = 10 + 14,000 Q² gives 20 = 26,000 Q², so Q² = 7.692×10⁻⁴ and Q = 0.02774 m³/s = 27.74 L/s. The flow falls from 31.6 to 27.7 L/s, and the head rises from 18 m to 20.8 m; the extra head is simply burned across the valve.',
      },
      {
        kind: 'numeric',
        prompt: 'Cold water (20 °C, ρ = 998 kg/m³, p_v = 2.339 kPa) is drawn from an open tank at p_atm = 101.325 kPa by a pump 3 m above the water surface. Suction-line losses are 0.8 m. What is NPSHa?',
        answer: 6.311,
        unit: 'm',
        explanation: 'NPSHa = (p_atm − p_v)/(ρg) + z_s − h_L = (101,325 − 2,339)/(998 × 9.81) − 3 − 0.8 = 10.110 − 3.8 = 6.31 m. If the pump’s NPSHr at this flow is below about 5 m it should be safe; if it is near 6 m, it will cavitate.',
      },
      {
        kind: 'choice',
        prompt: 'Spot the error: "The operating point of a pump is where the pump curve meets the static-head line, because that is the lift the pump has to produce." What is wrong?',
        options: [
          'Nothing; the static head sets the operating point.',
          'The operating point is on the system curve, which is the static head plus friction and minor losses that grow with Q², not the static head alone.',
          'The pump curve should be compared with the NPSH curve, not the system curve.',
          'The operating point is at the pump’s maximum flow, where head is zero.',
        ],
        correct: 1,
        explanation: 'The pump only runs where the head it supplies equals the head the system demands at that flow. The system demand includes friction and fitting losses, which rise as Q². Crossing the static-head line instead would predict a flow where the losses would be zero, which overestimates the real flow.',
      },
      {
        kind: 'choice',
        prompt: 'A pump handles 20 °C water without trouble, but the same installation cavitates when the liquid is changed to 60 °C water. What is the main reason?',
        options: [
          'The viscosity falls, so friction in the suction line rises.',
          'Hot water has a higher density, so NPSHa falls.',
          'Hot water has a higher atmospheric pressure at the tank surface.',
          'The vapour pressure at 60 °C is roughly eight times higher, which cuts the NPSHa by about 1.8 m.',
        ],
        correct: 3,
        explanation: 'NPSHa contains (p_atm − p_v)/ρg. Vapour pressure goes from about 2.3 kPa at 20 °C to about 20 kPa at 60 °C, which removes roughly 18 kPa/(983 × 9.81) ≈ 1.8 m of margin. Density barely changes and atmospheric pressure is unaffected by water temperature.',
      },
    ],
  },
}
