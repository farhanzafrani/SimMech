import type { TeachingContent } from '../teachingTypes'

/** Control Systems (2.004) teaching content. */
export const CONTENT: Record<string, TeachingContent> = {
  'step-response': {
    intuition:
      'Flip a light switch on a kettle and watch the temperature, or push the throttle of a motor from zero to a set point and watch the speed. A first-order system, such as the kettle, simply creeps up toward its final value, quickly at first and then ever more slowly, like a bath running into a drain; one number, the time constant, tells you how fast. A second-order system, such as a car suspension or a position servo, has inertia as well as a restoring force, so it can overshoot its target and ring before settling, the way a door with a spring closer swings past and back. Two numbers describe that behaviour: the damping ratio says how much it rings, and the natural frequency says how fast. Everything on the step-response page is about reading these two numbers off the locations of the poles.',
    derivation: [
      {
        text: 'A first-order system obeys τ ẏ + y = K u. For a unit step input the Laplace transform gives:',
        latex: 'Y(s) = \\frac{K}{s(\\tau s + 1)} = K\\left(\\frac{1}{s} - \\frac{1}{s + 1/\\tau}\\right)',
      },
      {
        text: 'Inverting, the response is an exponential approach to K. At t = τ it has covered 63.2 % of the way, and the pole sits at s = −1/τ:',
        latex: 'y(t) = K\\left(1 - e^{-t/\\tau}\\right)',
      },
      {
        text: 'Specs follow by solving for time. The 10–90 % rise time is τ(ln 0.9 − ln 0.1) = τ ln 9 ≈ 2.2τ, and the 2 % settling time is τ ln 50 ≈ 3.9τ, which is usually rounded to 4τ.',
        latex: 't_r = \\tau\\ln 9 \\approx 2.2\\,\\tau, \\qquad t_s = \\tau\\ln 50 \\approx 3.9\\,\\tau',
      },
      {
        text: 'A second-order system in standard form has two poles, which are complex for ζ < 1. Writing them out ties the damping ratio and natural frequency to the pole position:',
        latex: 's = -\\zeta\\omega_n \\pm j\\omega_n\\sqrt{1-\\zeta^2}, \\qquad \\omega_d = \\omega_n\\sqrt{1-\\zeta^2}',
      },
      {
        text: 'For an underdamped system the unit-step response is a decaying sinusoid about the final value. The envelope decays as e^(−ζωₙ t), so the settling time depends on the real part of the poles, while the peak occurs when the sine reaches its first half-period, at t_p = π/ω_d.',
        latex: 'y(t) = 1 - \\frac{e^{-\\zeta\\omega_n t}}{\\sqrt{1-\\zeta^2}}\\sin\\left(\\omega_d t + \\cos^{-1}\\zeta\\right), \\quad t_p = \\frac{\\pi}{\\omega_d}',
      },
      {
        text: 'Substituting t_p into the response gives the peak value, and hence the percent overshoot, which depends on ζ alone. The 2 % settling time follows from the envelope falling to 2 %, i.e. e^(−ζωₙ t_s) ≈ 0.02, giving the 4/(ζωₙ) rule:',
        latex: '\\%OS = 100\\,e^{-\\pi\\zeta/\\sqrt{1-\\zeta^2}}, \\qquad t_s \\approx \\frac{4}{\\zeta\\omega_n}',
      },
    ],
    commonMistakes: [
      'Reading ωₙ as the imaginary part of the pole. The imaginary part is the damped frequency ω_d = ωₙ√(1−ζ²); the natural frequency is the distance of the pole from the origin, ωₙ = √(σ² + ω_d²).',
      'Thinking that ωₙ sets the overshoot. Percent overshoot depends only on ζ (the angle of the pole from the negative real axis). Doubling ωₙ at fixed ζ makes the response faster but leaves overshoot unchanged.',
      'Using 4/(ζωₙ) for any system. It is a 2 % estimate for an underdamped pair, accurate for ζ not too close to zero or one, and it ignores extra poles and zeros. A zero near the poles can add large overshoot, and a third pole can slow the response.',
      'Mixing rise-time definitions. The 10–90 % rise time for a first-order system is 2.2τ, but 0 → 100 % rise time is infinite for an exponential, and for second-order systems textbooks differ; state which you use.',
      'Applying second-order formulas to high-order or delay-dominated plants. The formulas describe a dominant pole pair with everything else far away; with dead time or an RHP zero the real response can be very different.',
      'Treating a stable response as an acceptable response. Poles in the left half-plane guarantee convergence, not good behaviour: a pole pair with ζ = 0.05 is stable yet rings for dozens of cycles.',
    ],
    rulesOfThumb: [
      'A first-order system reaches 63 % at one time constant, about 95 % at 3τ and about 98 % at 4τ.',
      'ζ = 0.7 gives roughly 5 % overshoot, ζ = 0.5 about 16 %, and ζ = 0.3 about 37 %; ζ ≈ 0.7 is a common design target for a quick but well-behaved response.',
      'Pole angle from the negative real axis is cos⁻¹ ζ, so a 60° ray corresponds to ζ = 0.5; poles on a 45° ray give ζ ≈ 0.71.',
      'Moving poles left (larger ζωₙ) always speeds the decay, while moving them toward the imaginary axis slows it and makes the response ring.',
      'A rise time of a few time constants needs a sensor or actuator at least several times faster than the loop you want, or it becomes the dominant lag.',
    ],
    designChecklist: [
      'Decide the specs: overshoot limit, settling time, steady-state error and allowable actuator effort.',
      'Translate overshoot into a minimum damping ratio ζ.',
      'Translate settling time into a minimum real part σ = ζωₙ (e.g. σ ≥ 4/t_s).',
      'Mark the allowed region on the s-plane: a wedge for ζ and a left half-plane bounded by σ.',
      'Check whether the plant is well approximated by a dominant first- or second-order model, and identify the neglected poles and zeros.',
      'Place the closed-loop poles in the allowed region using gain or compensator design.',
      'Simulate the full model (not just the approximation) and confirm the specs, including saturation and noise.',
    ],
    prerequisites: [
      { courseId: 'engineering-dynamics', topicId: 'free-vibration', why: 'A second-order system is a mass–spring–damper: the same ζ and ωₙ describe both.' },
    ],
    quiz: [
      {
        kind: 'numeric',
        prompt: 'A first-order system has time constant τ = 2 s. How long does its step response take to reach 95 % of its final value?',
        answer: 5.99,
        unit: 's',
        explanation: 'The response is 1 − e^(−t/τ). Setting it to 0.95 gives e^(−t/τ) = 0.05, so t = τ ln 20 = 2 × 2.996 = 5.99 s, roughly 3τ. That is why 3τ is a handy rule for “about done” and 4τ for 98 %.',
      },
      {
        kind: 'numeric',
        prompt: 'A second-order system has ζ = 0.3. What is the percent overshoot of its step response?',
        answer: 37.2,
        unit: '%',
        explanation: '%OS = 100 exp(−πζ/√(1−ζ²)) = 100 exp(−π × 0.3 / 0.9539) = 100 exp(−0.988) = 37.2 %. So a lightly damped loop overshoots by more than a third, which is typically unacceptable for a position servo.',
      },
      {
        kind: 'choice',
        prompt: 'Spot the error: “The closed-loop poles are at −3 ± j4, so the natural frequency is ωₙ = 4 rad/s.” What is wrong?',
        options: [
          'Nothing; the imaginary part is ωₙ',
          'ωₙ = 3 rad/s, the real part',
          'The imaginary part is the damped frequency; ωₙ = √(3² + 4²) = 5 rad/s and ζ = 3/5 = 0.6',
          'ωₙ = 7 rad/s, the sum of the two parts',
        ],
        correct: 2,
        explanation: 'The poles are at σ ± jω_d with σ = ζωₙ and ω_d = ωₙ√(1−ζ²). Then ωₙ² = σ² + ω_d² = 9 + 16, so ωₙ = 5 rad/s and ζ = σ/ωₙ = 0.6. The imaginary part (4) is the frequency at which the response actually rings, which is lower than ωₙ.',
      },
      {
        kind: 'numeric',
        prompt: 'A second-order system has ζ = 0.6 and ωₙ = 8 rad/s. Estimate the 2 % settling time using t_s ≈ 4/(ζωₙ).',
        answer: 0.833,
        unit: 's',
        explanation: 'ζωₙ = 0.6 × 8 = 4.8 s⁻¹, so t_s ≈ 4 / 4.8 = 0.833 s. The settling time is set by the real part of the poles, which is the decay rate of the oscillation envelope.',
      },
      {
        kind: 'choice',
        prompt: 'Two second-order systems have the same damping ratio ζ = 0.5, but the second has twice the natural frequency. How do their step responses compare?',
        options: [
          'The second overshoots about twice as much',
          'The second has the same overshoot and settles in about half the time',
          'The second has the same overshoot and settles in the same time',
          'The second overshoots less and settles in the same time',
        ],
        correct: 1,
        explanation: 'Percent overshoot depends only on ζ, so both overshoot by about 16 %. The settling time 4/(ζωₙ) is inversely proportional to ωₙ, so doubling ωₙ halves it. Geometrically the poles keep the same angle from the axis but move twice as far from the origin.',
      },
      {
        kind: 'numeric',
        prompt: 'A system has closed-loop poles at −3 ± j4. At what time does the step response reach its first peak?',
        answer: 0.785,
        unit: 's',
        explanation: 'The peak time is t_p = π/ω_d, where ω_d is the imaginary part of the pole, 4 rad/s. So t_p = π/4 = 0.785 s. Here one must use ω_d, not ωₙ = 5 rad/s, because the response rings at the damped frequency.',
      },
    ],
  },

  'pid-tuning': {
    intuition:
      'Imagine steering a boat toward a buoy. Proportional action is turning the wheel in proportion to how far you are off course: simple, but as you approach the buoy the correction fades and a steady current can leave you permanently off line. Integral action is the patient helmsman who notices that you have been left of the line for a long time and keeps adding correction until you are on it, which removes the steady offset but can overshoot, like turning too long after a long drift. Derivative action is the helmsman watching your rate of approach and easing off before you arrive, which damps the overshoot, but it also reacts to every wave and every bit of sensor noise. Add delay, because the boat takes time to respond to the wheel, and aggressive tuning turns into oscillation. Tuning PID is the art of balancing these three habits against the delay.',
    derivation: [
      {
        text: 'The ideal PID law applies a control signal made of three terms of the error e = r − y: its present value, its accumulated history and its rate of change:',
        latex: 'u(t) = K_p\\left[e + \\frac{1}{T_i}\\int e\\,dt + T_d\\frac{de}{dt}\\right]',
      },
      {
        text: 'Equivalent parallel form: K_i = K_p/T_i and K_d = K_p T_d. In the Laplace domain the controller transfer function is C(s) = K_p(1 + 1/(T_i s) + T_d s).',
        latex: 'C(s) = K_p + \\frac{K_i}{s} + K_d s',
      },
      {
        text: 'Why P alone leaves an offset: take a plant with DC gain K under proportional control K_p. At steady state, the output is y = K K_p e with e = r − y. Solving for the error:',
        latex: 'e_{ss} = \\frac{r}{1 + K K_p}',
      },
      {
        text: 'Why integral action removes it: with an integrator in the controller, a constant nonzero error would make u ramp forever. Steady state can therefore only occur when e = 0, so e_ss = 0 for a step set-point (for a stable closed loop).',
      },
      {
        text: 'Processes are often approximated as first-order plus dead time (FOPDT) from a step test: gain K, time constant τ, dead time θ. The reaction-curve (open-loop) rule of Ziegler–Nichols was fitted empirically to such processes for roughly quarter-decay damping:',
        latex: 'K_p = \\frac{1.2\\,\\tau}{K\\theta}, \\qquad T_i = 2\\theta, \\qquad T_d = 0.5\\,\\theta',
      },
      {
        text: 'Because the rule aims at fast disturbance rejection with a decaying oscillation, it typically gives large overshoot on set-point steps. Detuning (lower K_p, longer T_i) trades some speed for much less overshoot, which can be compared with the integrated absolute error.',
        latex: 'IAE = \\int_0^{\\infty} |e(t)|\\,dt',
      },
    ],
    commonMistakes: [
      'Using Ziegler–Nichols settings as final. They are a starting point that produces an aggressive, often 40–60 % or larger overshoot response; detune before commissioning unless a quarter-decay response is truly acceptable.',
      'Ignoring integral windup. When the actuator saturates, the integral term keeps accumulating, then takes a long time to unwind, giving huge overshoot. Use anti-windup (clamping or back-calculation).',
      'Applying derivative action to a noisy measurement directly. D amplifies high-frequency noise and chatters the actuator; use a filtered derivative (a first-order roll-off) and, usually, derivative on measurement rather than on error to avoid a “kick” when the set-point jumps.',
      'Mixing parallel and standard forms. K_i = K_p/T_i in the standard form; copying a K_p and an integral time into a controller that expects K_i (or the reverse) silently changes the tuning by a large factor.',
      'Increasing gain to fix a slow response when dead time dominates. When θ is comparable to τ, extra gain just pushes the loop toward instability; a larger dead-time to time-constant ratio demands lower gain and slower integral action.',
      'Tuning against one operating point. Real processes are nonlinear (valves, heat transfer), so gain and dead time change with load; a loop tuned at one operating point can oscillate at another.',
    ],
    rulesOfThumb: [
      'Dead time sets the ceiling on speed: a closed-loop time constant much shorter than roughly the dead time is unrealistic, however clever the tuning.',
      'For a plant with a pure first-order lag, integral action with T_i about equal to the plant time constant cancels it and gives a clean first-order closed loop.',
      'Keep D small or off on noisy or slow loops (temperature, level); it is most valuable on lightly damped, fast processes such as motion control.',
      'When tuning by trial, change one term at a time: raise K_p until the loop just begins to oscillate, back off to roughly half, then add I, then a little D.',
      'The ratio θ/τ is a quick guide: roughly below 0.1 the process is lag-dominated and easy; above 1 it is delay-dominated and conventional PID performs poorly.',
    ],
    designChecklist: [
      'Define the objective: set-point tracking or disturbance rejection, and acceptable overshoot and settling time.',
      'Identify the process with a step test and fit K, τ, θ (or collect frequency-response data).',
      'Pick the controller structure: P, PI or PID, based on noise level, dead time and the need for zero offset.',
      'Compute a starting tuning (Ziegler–Nichols, or a more conservative rule) from the model.',
      'Add anti-windup, a derivative filter and set-point weighting before closing the loop.',
      'Simulate or test, then detune to meet the overshoot and robustness limits, comparing IAE or settling time.',
      'Verify across the operating range, including the worst-case gain and delay, and check actuator saturation and wear.',
    ],
    prerequisites: [
      { courseId: 'control-systems', topicId: 'step-response', why: 'Overshoot, rise time and settling time are the language used to judge a tuning.' },
    ],
    quiz: [
      {
        kind: 'numeric',
        prompt: 'A process has gain K = 2, time constant τ = 15 s and dead time θ = 3 s. What proportional gain do the Ziegler–Nichols open-loop PID rules give (K_p = 1.2τ/(Kθ))?',
        answer: 3,
        explanation: 'K_p = 1.2 × 15 / (2 × 3) = 18 / 6 = 3.0. The rule scales with τ/(Kθ): a longer dead time or a higher process gain both reduce the controller gain, so that the loop is not pushed toward instability.',
      },
      {
        kind: 'numeric',
        prompt: 'A plant with DC gain K = 4 is controlled by a proportional controller K_p = 3 and a unit-step set-point. What is the steady-state error as a percentage of the set-point?',
        answer: 7.69,
        unit: '%',
        explanation: 'e_ss = 1/(1 + K K_p) = 1/(1 + 12) = 0.0769, i.e. 7.69 %. Raising the gain shrinks the offset but never removes it, and a higher gain also reduces stability margin; only an integrator drives it to zero.',
      },
      {
        kind: 'choice',
        prompt: 'The actuator on a PI loop saturates during a large set-point change. What happens if there is no anti-windup protection?',
        options: [
          'The integral term stops growing automatically',
          'The error goes to zero faster',
          'The integral keeps accumulating while the output is saturated, causing a large overshoot as it has to unwind',
          'The derivative term compensates for the saturation',
        ],
        correct: 2,
        explanation: 'While the actuator is saturated, the error stays large, so the integrator keeps growing even though the output cannot respond. When the output finally crosses the set-point, the stored integral still pushes the actuator at its limit, so the process overshoots until the error has been integrated back down. Clamping or back-calculation prevents this.',
      },
      {
        kind: 'choice',
        prompt: 'Spot the error: “My temperature loop is jittery because of sensor noise, so I will raise the derivative gain to damp it.” What is wrong?',
        options: [
          'Nothing; derivative action smooths noise',
          'Derivative action amplifies high-frequency noise, so more D makes the jitter worse; reduce or filter D instead',
          'Derivative action only affects steady-state error',
          'It would work only if the integral term were removed',
        ],
        correct: 1,
        explanation: 'The derivative term responds to the slope of the error, and noise has very steep slopes at high frequency, so the control signal chatters. Lowering D, adding a derivative filter, or switching it off on a slow loop is the cure. Derivative helps damp real oscillation of the process, not noise.',
      },
      {
        kind: 'numeric',
        prompt: 'A standard-form PID controller has K_p = 3 and integral time T_i = 8 s. What is the equivalent integral gain K_i = K_p/T_i?',
        answer: 0.375,
        unit: 's⁻¹',
        explanation: 'K_i = K_p / T_i = 3 / 8 = 0.375 per second. Entering 3 and 8 into a parallel-form controller that expects K_i directly would give an integral action 21 times too strong, which is the classic standard-versus-parallel form mix-up.',
      },
      {
        kind: 'choice',
        prompt: 'A process has dead time θ comparable to its time constant τ. What is the most reasonable tuning direction?',
        options: [
          'Use a very high proportional gain to overcome the delay',
          'Use a low proportional gain and slow integral action, accepting a slower response',
          'Remove the integral term and use derivative alone',
          'Use the largest possible derivative gain',
        ],
        correct: 1,
        explanation: 'Dead time adds phase lag that grows with frequency but does not change magnitude, so high gain quickly pushes the loop to instability. With θ ≈ τ the loop must be detuned: modest K_p and a long T_i. Derivative cannot predict through dead time, because the process does not respond at all yet.',
      },
    ],
  },

  'root-locus-stability': {
    intuition:
      'Every feedback loop has a gain knob. Turn it from zero upward and the closed-loop poles, which govern the whole behaviour of the system, glide around the s-plane along fixed paths. At low gain they sit near the open-loop poles, where the system is slow. As the gain rises, poles move toward each other, collide, then fly off as complex pairs: the response speeds up but begins to ring. If the paths carry them across the imaginary axis into the right half-plane, the oscillation grows without bound and the loop is unstable, like a microphone that squeals once the volume is turned too high. The root locus draws all those paths at once so that you can see where each design lives, and Routh’s test tells you the exact gain at which a pole pair crosses the axis without finding any roots.',
    derivation: [
      {
        text: 'With unity feedback around K L(s), the closed-loop transfer function is K L/(1 + K L). The poles are the values of s for which the denominator vanishes, which is the characteristic equation:',
        latex: '1 + K\\,L(s) = 0 \\;\\Longleftrightarrow\\; K\\,L(s) = -1',
      },
      {
        text: 'Since −1 has magnitude 1 and angle 180°, a point s lies on the locus if and only if it satisfies both an angle condition (independent of K) and a magnitude condition (which gives K there):',
        latex: '\\angle L(s) = \\pm 180^\\circ(2k+1), \\qquad K = \\frac{1}{|L(s)|}',
      },
      {
        text: 'For L = 1/(s(s+a)(s+b)) the characteristic polynomial is a cubic with one parameter K:',
        latex: 's^3 + (a+b)s^2 + ab\\,s + K = 0',
      },
      {
        text: 'Far from the origin the three branches look like straight lines radiating from the centroid of the open-loop poles at angles (2k+1)180°/(n−m) = 60°, 180°, 300°:',
        latex: '\\sigma_a = \\frac{0 - a - b}{3} = -\\frac{a+b}{3}',
      },
      {
        text: 'Routh array for the cubic: the first column is 1, (a+b), [ab(a+b) − K]/(a+b), K. All first-column entries must be positive for every root to lie in the left half-plane, so 0 < K < K_crit with the critical gain from the s¹ row:',
        latex: 'K_{crit} = ab\\,(a+b)',
      },
      {
        text: 'At K = K_crit the s¹ row vanishes and the s² row gives the auxiliary equation (a+b)s² + K_crit = 0, whose roots are the imaginary-axis crossing:',
        latex: 's = \\pm j\\sqrt{ab}, \\qquad \\omega_{cross} = \\sqrt{ab}',
      },
    ],
    commonMistakes: [
      'Assuming that “all coefficients positive” means stable. This is necessary but not sufficient for a third-order or higher polynomial: s³ + 3s² + 2s + 10 has every coefficient positive and still has two roots in the right half-plane.',
      'Mis-applying the real-axis rule. A real-axis point lies on the locus if the number of open-loop poles and zeros to its right is odd, counting poles and zeros together, not just poles.',
      'Treating the root locus as exact for all gains from a hand sketch. A sketch gives shape and trends; the exact crossing, breakaway and angles come from solving the equations, not from reading a rough drawing.',
      'Dropping the sign when reading Routh. A sign change in the first column counts one right-half-plane pole. A zero in the first column or a row of zeros needs special handling (epsilon trick or auxiliary polynomial) rather than ignoring it.',
      'Forgetting that the locus is for the gain K as parametrised. If the parameter you vary is not a multiplicative gain (such as a pole or zero location), you must first rearrange the characteristic equation into 1 + K L(s) form.',
      'Concluding good performance from stability. Poles that are near the imaginary axis give a stable but extremely oscillatory response, so stability must be paired with damping and speed targets.',
    ],
    rulesOfThumb: [
      'The locus starts at open-loop poles (K = 0) and ends at open-loop zeros or at infinity (K → ∞); with more poles than zeros by 3 or more, branches inevitably bend into the right half-plane at high enough gain.',
      'Adding a pole to the loop pushes the locus to the right (less stable); adding a zero pulls it to the left (more stable). That is the reason lead compensation helps.',
      'The sum of the closed-loop poles equals the sum of open-loop poles when n − m ≥ 2, so if some poles move right, others must move left.',
      'For K L(s) with an integrator and two lags, the stable gain range is finite: a 20–30 % margin below K_crit is far too little in practice, and engineers typically design for at least a factor of 2 (6 dB) below it.',
      'Use the root locus for intuition and Routh for a hard number, and always confirm with a simulation of the actual closed loop.',
    ],
    designChecklist: [
      'Write the loop transfer function and rearrange the characteristic equation into the form 1 + K L(s) = 0.',
      'Mark the open-loop poles and zeros and apply the real-axis rule.',
      'Compute the asymptote centroid and angles from n − m.',
      'Find breakaway points from dK/ds = 0 and keep only the roots that lie on the locus.',
      'Use the Routh array on the characteristic polynomial to get the critical gain and imaginary-axis crossing.',
      'Choose K to put the dominant poles at the desired damping and speed, and read the other poles to check they are fast enough to ignore.',
      'Check the margin below K_crit and verify with a time-domain simulation.',
    ],
    prerequisites: [
      { courseId: 'control-systems', topicId: 'step-response', why: 'Pole location is translated to damping and speed through the step-response formulas.' },
    ],
    quiz: [
      {
        kind: 'numeric',
        prompt: 'A unity-feedback loop has L(s) = 1/(s(s+2)(s+3)) with gain K. What is the critical gain K_crit = ab(a+b) at which the loop reaches instability?',
        answer: 30,
        explanation: 'The characteristic polynomial is s³ + 5s² + 6s + K. The Routh s¹ entry is (5 × 6 − K)/5, which reaches zero at K = 30. So the loop is stable only for 0 < K < 30, i.e. ab(a+b) = 2 × 3 × 5.',
      },
      {
        kind: 'numeric',
        prompt: 'For L(s) = 1/(s(s+2)(s+8)), at what frequency does the root locus cross the imaginary axis (ω = √(ab))?',
        answer: 4,
        unit: 'rad/s',
        explanation: 'At K_crit the auxiliary equation is (a+b)s² + K_crit = 0 with K_crit = ab(a+b), giving s² = −ab and so ω = √(2 × 8) = 4 rad/s. The critical gain is 2 × 8 × 10 = 160.',
      },
      {
        kind: 'numeric',
        prompt: 'For L(s) = 1/(s(s+3)(s+6)), what is the real-axis asymptote centroid σ_a?',
        answer: -3,
        explanation: 'σ_a = (Σ poles − Σ zeros)/(n − m) = (0 − 3 − 6)/3 = −3. The three asymptotes leave this point at 60°, 180° and 300°, so two branches eventually head into the right half-plane at high gain.',
      },
      {
        kind: 'choice',
        prompt: 'Spot the error: “For L = K/(s(s+1)(s+2)) with K = 10, the characteristic polynomial s³ + 3s² + 2s + 10 has all positive coefficients, so the loop is stable.” What is wrong?',
        options: [
          'Nothing; positive coefficients guarantee stability',
          'Positive coefficients are necessary, not sufficient; the Routh s¹ entry is (6 − 10)/3 < 0, giving two sign changes and two right-half-plane poles',
          'The loop is stable only if K < 1',
          'The loop is stable because there are no zeros',
        ],
        correct: 1,
        explanation: 'For order three or more, positivity of the coefficients is not enough. The Routh first column is 1, 3, (6 − K)/3, K: for K = 10 the third entry is −1.33, so there are two sign changes, i.e. two roots in the right half-plane. The loop is stable only for 0 < K < 6.',
      },
      {
        kind: 'numeric',
        prompt: 'For L(s) = 1/(s(s+1)(s+3)), the breakaway point satisfies 3s² + 2(a+b)s + ab = 0, i.e. 3s² + 8s + 3 = 0. Which root lies on the locus (between the poles at 0 and −1)?',
        answer: -0.4514,
        explanation: 'The roots of 3s² + 8s + 3 = 0 are s = (−8 ± √28)/6 = −0.451 and −2.215. Only −0.451 lies on the real-axis segment between the poles at 0 and −1 (an odd number of poles to its right); −2.215 is on a section with no locus. The gain there is K = −s(s+1)(s+3) = 0.631.',
      },
      {
        kind: 'choice',
        prompt: 'The first column of a Routh array has two sign changes. What does that tell you?',
        options: [
          'The system has two poles on the imaginary axis',
          'The system has two roots in the right half-plane, so it is unstable',
          'The system has two roots in the left half-plane',
          'The system is marginally stable',
        ],
        correct: 1,
        explanation: 'The number of sign changes in the first column equals the number of roots with positive real part. Two sign changes mean two RHP roots, so the closed loop is unstable and its response grows exponentially. Imaginary-axis roots show up as a row of zeros, not as sign changes.',
      },
    ],
  },

  'frequency-response-bode': {
    intuition:
      'Push a child on a swing at different rhythms. At a slow rhythm the swing follows you easily; near its natural rhythm it swings far more than your push would suggest; at a fast rhythm it barely responds and lags behind. A system’s frequency response records exactly this: for each frequency, how much the output amplitude is scaled and how far its phase lags. In a feedback loop, instability happens when a signal that goes around the loop comes back as strong as it left and with a full half-turn of extra delay, so that negative feedback becomes positive feedback and feeds itself. The Bode plot lets you see how close the loop is to that situation. The gain margin asks how much more gain you could add at the frequency where the delay reaches 180°; the phase margin asks how much more delay you could add at the frequency where the gain is exactly one. Both are measures of safety distance.',
    derivation: [
      {
        text: 'Feed a stable linear system with a sinusoid e^{jωt}. The steady-state output is the same sinusoid scaled and shifted, and the scale and shift are the transfer function evaluated at s = jω:',
        latex: 'y_{ss}(t) = |G(j\\omega)|\\,\\sin\\!\\big(\\omega t + \\angle G(j\\omega)\\big)',
      },
      {
        text: 'Bode plots show 20 log₁₀|G| (in dB) and the phase in degrees against log ω. Because logs turn products into sums, the plot of a product of factors is the sum of the plots of each factor, which makes sketching practical:',
        latex: '|L|_{dB} = \\sum_i 20\\log_{10}|L_i(j\\omega)|, \\qquad \\angle L = \\sum_i \\angle L_i(j\\omega)',
      },
      {
        text: 'The Nyquist stability criterion for a stable open loop says that the closed loop is stable if the Nyquist plot of L(jω) does not encircle the critical point −1. At the critical point, |L| = 1 and ∠L = −180°, so the margins measure the distance of the plot from this point.',
      },
      {
        text: 'Gain crossover frequency ω_gc is where |L| = 1 (0 dB). The phase margin is how much additional phase lag could be tolerated there before reaching −180°:',
        latex: 'PM = 180^\\circ + \\angle L(j\\omega_{gc}), \\qquad |L(j\\omega_{gc})| = 1',
      },
      {
        text: 'Phase crossover frequency ω_pc is where ∠L = −180°. The gain margin is the factor by which the gain can increase there before |L| reaches 1:',
        latex: 'GM = \\frac{1}{|L(j\\omega_{pc})|}, \\qquad GM_{dB} = -20\\log_{10}|L(j\\omega_{pc})|',
      },
      {
        text: 'For a dominant second-order closed loop, a phase margin PM (below about 60°) corresponds approximately to a damping ratio ζ ≈ PM/100, so margins translate into overshoot. A pure time delay T adds phase lag ωT with no magnitude change, which is why delay erodes phase margin directly:',
        latex: '\\angle e^{-j\\omega T} = -\\omega T \\ \\text{(rad)}, \\qquad \\zeta \\approx \\frac{PM^\\circ}{100}',
      },
    ],
    commonMistakes: [
      'Quoting the margins for the closed loop. Gain and phase margin are properties of the open-loop L(jω); the closed-loop frequency response is a separate quantity.',
      'Mixing dB and ratios. A gain of 2 is 6.02 dB, and gain margins multiply while their dB values add; GM = 5.5 is 14.8 dB, not 5.5 dB.',
      'Computing phase margin at the wrong frequency. PM is evaluated at the gain crossover |L| = 1, not at the peak or at the phase crossover; plugging a different frequency gives meaningless results.',
      'Ignoring delay. A dead time T costs ωT radians of phase at frequency ω — at 10 rad/s, a 50 ms delay costs 28.6° — so unmodelled sensor, actuator or computation delays can wipe out a phase margin that looks comfortable on paper.',
      'Relying on a single margin. A loop can have a large gain margin but a small phase margin (or the reverse); conditionally stable systems can even go unstable when the gain is lowered. Always check both, and the peak of the sensitivity function if possible.',
      'Using ζ ≈ PM/100 as exact. It is a rule of thumb for a dominant second-order closed loop and PM below about 60°. For high-order loops or loops with zeros, simulate the step response.',
    ],
    rulesOfThumb: [
      'A phase margin of 30–60° and a gain margin of at least 6 dB (a factor of 2) are typical; 45° or more is a common target for well-damped responses, and 60° gives only a few percent overshoot.',
      'Higher crossover frequency means a faster closed loop, so the closed-loop bandwidth is roughly the gain crossover frequency, but extra lags near it will eat the phase margin.',
      'Each 20 dB per decade of slope of the gain curve corresponds to about −90° of phase, and a slope of −20 dB/dec through the crossover usually gives a good margin; −40 dB/dec there is a warning sign.',
      'Raising gain by a factor k moves the magnitude curve up by 20 log₁₀ k dB: doubling adds about 6 dB, tripling about 9.5 dB, and ten times adds 20 dB.',
      'Always use measured or well-modelled delay: rough budgets for the sampling, filter and actuator delays set the achievable crossover.',
    ],
    designChecklist: [
      'Write the open-loop transfer function L(s) = C(s)G(s) with all known lags, filters and sampling delays.',
      'Sketch or compute the Bode magnitude and phase over the frequency range of interest.',
      'Find the gain crossover ω_gc and read the phase margin there.',
      'Find the phase crossover ω_pc and read the gain margin there.',
      'Compare the margins to targets (for example PM ≥ 45°, GM ≥ 6 dB) and relate PM to expected overshoot.',
      'Adjust the gain or add compensation (lead for phase, lag for low-frequency gain) and re-check both margins.',
      'Validate against measured frequency response or a time-domain simulation including delay and saturation.',
    ],
    prerequisites: [
      { courseId: 'control-systems', topicId: 'step-response', why: 'Phase margin is interpreted through the damping ratio and overshoot of the closed loop.' },
      { courseId: 'control-systems', topicId: 'root-locus-stability', why: 'Both topics answer the stability question: the locus tracks the poles, Bode tracks the margins.' },
    ],
    quiz: [
      {
        kind: 'numeric',
        prompt: 'At the phase crossover frequency, an open loop has |L(jω_pc)| = 0.25. What is the gain margin in decibels?',
        answer: 12.04,
        unit: 'dB',
        explanation: 'GM = 1/|L(jω_pc)| = 1/0.25 = 4, and in dB that is 20 log₁₀ 4 = 12.04 dB. The gain can rise by a factor 4 before |L| reaches 1 at the −180° frequency and the loop goes unstable.',
      },
      {
        kind: 'numeric',
        prompt: 'An open loop L(s) = 10/(s(0.5s + 1)) has gain crossover at ω_gc = 4.254 rad/s. What is the phase margin?',
        answer: 25.2,
        unit: '°',
        explanation: 'The phase is −90° − atan(0.5 × 4.254) = −90° − atan(2.127) = −90° − 64.8° = −154.8°. The phase margin is 180° − 154.8° = 25.2°. Check the crossover itself: |L| = 10/(4.254 × √(1 + 4.527)) = 10/(4.254 × 2.351) = 1.00. A margin of 25° means a lightly damped loop with ζ ≈ 0.25.',
      },
      {
        kind: 'numeric',
        prompt: 'A loop has a pure time delay of 50 ms. How much phase lag does the delay add at the crossover frequency ω = 10 rad/s?',
        answer: 28.65,
        unit: '°',
        explanation: 'A delay T contributes −ωT radians of phase: 10 × 0.05 = 0.5 rad = 28.65°. Its magnitude is exactly 1, so it does not change the gain curve and leaves the crossover frequency where it was; the whole 28.65° comes straight out of the phase margin.',
      },
      {
        kind: 'choice',
        prompt: 'Spot the error: “My loop has only 20° of phase margin, so I will increase the gain to improve the margins.” What is wrong?',
        options: [
          'Nothing; higher gain always improves stability',
          'Raising gain lifts the magnitude curve, moving the crossover to a higher frequency where the phase is more negative, which typically reduces phase margin',
          'Raising gain increases the phase of the system at all frequencies',
          'Phase margin is independent of gain',
        ],
        correct: 1,
        explanation: 'For a typical loop the phase falls with frequency. A higher gain moves the gain crossover to a higher frequency, where the phase lag is greater, so the phase margin shrinks and the gain margin falls (it is divided by the gain increase). To improve margin, lower the gain or add phase lead.',
      },
      {
        kind: 'numeric',
        prompt: 'By how many decibels does the magnitude curve rise if the loop gain is tripled?',
        answer: 9.54,
        unit: 'dB',
        explanation: '20 log₁₀ 3 = 20 × 0.4771 = 9.54 dB. Because dB are logarithmic, successive gain changes simply add in dB: doubling is 6.02 dB, tripling 9.54 dB and ten times 20 dB.',
      },
      {
        kind: 'choice',
        prompt: 'Using the rule of thumb ζ ≈ PM/100 for a dominant second-order loop, which approximate damping ratio corresponds to a 45° phase margin?',
        options: ['0.20', '0.35', '0.45', '0.90'],
        correct: 2,
        explanation: 'ζ ≈ PM/100 with PM in degrees gives 45/100 = 0.45, which corresponds to roughly 20 % overshoot from the second-order formula. This is only a rule for PM below about 60° and a dominant second-order closed loop, so simulate to be sure.',
      },
    ],
  },
}
