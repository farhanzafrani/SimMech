import type { TeachingContent } from '../teachingTypes'
import { EE } from '../teachingTypes'

/** Engineering Dynamics (2.003) teaching content, plus the 4-bar linkage from Design & Manufacturing. */
export const CONTENT: Record<string, TeachingContent> = {
  'particle-kinematics': {
    intuition:
      'Sit in a car going round a bend and you feel two separate things. Press the throttle and you are pushed back into the seat: that is the acceleration along the path, the part that changes your speed. Hold the speed perfectly constant and you are still thrown sideways toward the outside of the bend: that is the acceleration across the path, the part that changes your direction. Velocity is a vector, so changing either its length or its heading counts as accelerating. Kinematics is simply the bookkeeping for those two effects, done before anyone asks which forces cause them. A tight bend at modest speed can demand far more acceleration than hard braking in a straight line, which is why the sideways part so often dominates.',
    derivation: [
      {
        text: 'Describe the particle by its position vector r(t). Velocity is the rate of change of position and acceleration is the rate of change of velocity. Both are vectors.',
        latex: '\\vec v = \\frac{d\\vec r}{dt}, \\qquad \\vec a = \\frac{d\\vec v}{dt}',
      },
      {
        text: 'Velocity is always tangent to the path, so write it as speed times a unit tangent vector: v = v e_t, where v = ds/dt is the speed along the path.',
        latex: '\\vec v = v\\,\\hat e_t',
      },
      {
        text: 'Differentiate with the product rule. Acceleration has one term from the speed changing and one from the direction of e_t changing:',
        latex: '\\vec a = \\dot v\\,\\hat e_t + v\\,\\frac{d\\hat e_t}{dt}',
      },
      {
        text: 'Over a short arc ds the tangent turns through dφ = ds/ρ, where ρ is the radius of curvature. The turning is perpendicular to e_t, so the rate of change of e_t is (dφ/dt) times the inward normal e_n, and dφ/dt = v/ρ.',
        latex: '\\frac{d\\hat e_t}{dt} = \\frac{d\\phi}{dt}\\,\\hat e_n = \\frac{v}{\\rho}\\,\\hat e_n',
      },
      {
        text: 'Substituting gives the tangential-normal components. The normal part always points toward the centre of curvature.',
        latex: '\\vec a = \\frac{dv}{dt}\\,\\hat e_t + \\frac{v^2}{\\rho}\\,\\hat e_n',
      },
      {
        text: 'For straight-line motion with constant acceleration, integrate a = dv/dt once to get v = v₀ + at, then again to get position. Eliminating t gives a speed-distance relation that avoids time entirely.',
        latex: 's = s_0 + v_0 t + \\tfrac{1}{2}a t^2, \\qquad v^2 = v_0^2 + 2a\\,(s - s_0)',
      },
    ],
    commonMistakes: [
      'Believing constant speed means zero acceleration. On a curved path a_n = v²/ρ is not zero, and ignoring it is the classic way to under-size a cornering or centrifugal load.',
      'Using s = s₀ + v₀t + ½at² when the acceleration is not constant. Braking with ABS, a motor ramping up, or drag that grows with speed all break the assumption. Check that a really is constant before reaching for the formula.',
      'Mixing speed and velocity. Speed is a scalar |v|; velocity carries direction and sign. A ball thrown up has velocity that goes from positive through zero to negative, while its acceleration stays at −g throughout, including at the top.',
      'Putting the normal component on the wrong side. a_n points toward the centre of curvature, never outward. The outward push you feel is your own inertia, not an acceleration of the particle.',
      'Unit slips. v²/ρ needs v in m/s: 90 km/h is 25 m/s, not 90. Squaring the wrong number gives an error of more than an order of magnitude.',
      'Treating ρ as the radius of a circle you can see. For a general curve ρ is the local radius of curvature and changes along the path; at a straight section ρ is infinite and a_n is zero.',
    ],
    rulesOfThumb: [
      'Cornering acceleration v²/ρ near 0.7–0.9 g (about 7–9 m/s²) is roughly the limit of ordinary tyres on dry asphalt, so use it as a sanity check on any vehicle result.',
      'Doubling speed on the same bend quadruples a_n, because it goes with v². Speed is far more expensive than radius.',
      'Passengers typically find sustained accelerations above roughly 0.3 g uncomfortable, and elevator or ride profiles are usually kept well below that. Smooth motion profiles limit jerk (rate of change of acceleration) for the same reason.',
      'If a motion problem hands you distance and speeds but no time, use v² = v₀² + 2a·Δs and skip the time entirely.',
    ],
    designChecklist: [
      'Sketch the path and choose a coordinate description: Cartesian for projectiles, tangential-normal for a known curved path, polar for rotation about a point.',
      'Write down what is known and what is unknown: positions, velocities, accelerations and times.',
      'Decide whether the acceleration is constant. If so use the constant-acceleration set, otherwise integrate or differentiate the functions you have.',
      'Resolve the acceleration into components in the chosen frame, and check each sign against a quick sketch.',
      'Keep units in SI throughout, converting km/h and rpm before squaring.',
      'Sanity-check the magnitude against g: if you get 50 g for a car on a road, an input is wrong.',
    ],
    quiz: [
      {
        kind: 'numeric',
        prompt: 'A car travels a curve of radius 30 m at a constant 15 m/s. What is the magnitude of its acceleration?',
        answer: 7.5,
        unit: 'm/s²',
        explanation: 'Speed is constant so a_t = 0 and all the acceleration is normal: a_n = v²/ρ = 15²/30 = 7.5 m/s², directed toward the centre of the curve. Constant speed does not mean zero acceleration.',
      },
      {
        kind: 'numeric',
        prompt: 'A particle moves along a line with position x(t) = t³ − 6t² + 9t (metres, seconds). What is its acceleration at t = 1.5 s?',
        answer: -3,
        unit: 'm/s²',
        explanation: 'Differentiate twice: v = 3t² − 12t + 9 and a = 6t − 12. At t = 1.5 s, a = 9 − 12 = −3 m/s². The negative sign means the acceleration points in the −x direction.',
      },
      {
        kind: 'choice',
        prompt: 'A particle travels around a circular arc at constant speed. Which statement is correct?',
        options: [
          'Its acceleration is zero because its speed does not change.',
          'Its acceleration is tangent to the path, in the direction of motion.',
          'Its acceleration has magnitude v²/ρ and points toward the centre of curvature.',
          'Its acceleration has magnitude v²/ρ and points away from the centre of curvature.',
        ],
        correct: 2,
        explanation: 'With constant speed dv/dt = 0, so only the normal term v²/ρ remains. The velocity is turning toward the inside of the curve, so the acceleration points inward. The outward sensation is inertia, not an acceleration of the particle.',
      },
      {
        kind: 'numeric',
        prompt: 'A cart moving at 25 m/s brakes with a constant deceleration of 5 m/s². How far does it travel before stopping?',
        answer: 62.5,
        unit: 'm',
        explanation: 'Time is not asked for, so use v² = v₀² + 2aΔs with v = 0: Δs = v₀²/(2a) = 25²/(2 × 5) = 62.5 m. The stopping time would be 5 s, and ½·25·5 = 62.5 m agrees.',
      },
      {
        kind: 'choice',
        prompt: 'A student says: "A car drives round a bend of radius 50 m at a steady 20 m/s. The speed is constant, so dv/dt = 0, so the acceleration is zero and no horizontal force is needed." What is wrong with this?',
        options: [
          'Nothing: constant speed really does mean zero acceleration.',
          'The normal component v²/ρ = 8 m/s² was ignored; the direction of the velocity is changing, so a ≠ 0.',
          'The tangential component should have been 20 m/s² rather than zero.',
          'The radius must be doubled before it can be used in the formula.',
        ],
        correct: 1,
        explanation: 'dv/dt only captures changes in speed. Velocity also changes when its direction changes, which gives a_n = v²/ρ = 400/50 = 8 m/s² toward the centre. Newton’s second law then says a real inward force (tyre friction) is needed.',
      },
      {
        kind: 'numeric',
        prompt: 'A vehicle’s normal acceleration must not exceed 4 m/s² on a curve of radius 100 m. What is the maximum speed it can hold round the curve?',
        answer: 20,
        unit: 'm/s',
        explanation: 'Set a_n = v²/ρ = 4, so v = √(4 × 100) = 20 m/s (72 km/h). Because a_n grows with v², doubling the allowed acceleration would raise the speed limit only by a factor of √2.',
      },
      {
        kind: 'choice',
        prompt: 'For which situation is s = s₀ + v₀t + ½at² valid?',
        options: [
          'A car braking with an ABS system that pulses the brake force on and off.',
          'A parachutist whose drag force grows as speed builds up.',
          'A motor whose torque ramps up smoothly over several seconds.',
          'A ball in free fall over a short drop where air drag is negligible.',
        ],
        correct: 3,
        explanation: 'The formula comes from integrating a constant a twice. Only the free-falling ball (a ≈ g) has constant acceleration. In the other three the acceleration changes with time or speed, so the equations must be integrated from the actual a(t) or a(v).',
      },
    ],
  },

  'newton-work-energy': {
    intuition:
      'Pushing a shopping trolley, you can ask two different questions. The Newton question: how hard is it accelerating at this instant? The energy question: if I push over this distance, how fast will it be going at the end? The second does not care about the details in between. Every newton of net force pushed through a metre adds a joule to the trolley’s kinetic energy, and that is the whole story. Because you only need the beginning and the end, forces that are awkward to follow in time, such as springs, variable slopes and friction, become simple book-keeping. The price is that energy methods give you speed, not direction or time, and they cannot tell you the internal forces that do no work, so each method has a job it does best.',
    derivation: [
      {
        text: 'Start with Newton’s second law along the path of the particle: the net tangential force produces the tangential acceleration.',
        latex: '\\Sigma F_t = m\\,\\frac{dv}{dt}',
      },
      {
        text: 'Eliminate time using the chain rule: dv/dt = (dv/ds)(ds/dt) = v dv/ds.',
        latex: '\\Sigma F_t = m\\,v\\,\\frac{dv}{ds}',
      },
      {
        text: 'Multiply by ds and integrate from position 1 to position 2. The left side is, by definition, the work done by the net force.',
        latex: '\\int_{1}^{2}\\Sigma F_t\\,ds = \\int_{v_1}^{v_2} m\\,v\\,dv',
      },
      {
        text: 'Evaluate the right-hand integral. The result is the work-energy theorem: the net work done on the particle equals its change in kinetic energy T = ½mv².',
        latex: 'T_1 + \\sum U_{1\\to2} = T_2, \\qquad T = \\tfrac{1}{2}mv^2',
      },
      {
        text: 'Work is a dot product, so only the force component along the displacement counts. A force perpendicular to the motion, such as the normal force on a sliding block, does zero work.',
        latex: 'U_{1\\to2} = \\int \\vec F\\cdot d\\vec r',
      },
      {
        text: 'Differentiating work with respect to time gives power: the rate at which a force transfers energy.',
        latex: 'P = \\frac{dU}{dt} = \\vec F\\cdot\\vec v',
      },
    ],
    commonMistakes: [
      'Counting forces that do no work. Normal forces on a surface the body slides along, and the tension in a string perpendicular to the motion, contribute zero because F·dr = 0.',
      'Dropping the sign of friction work. Kinetic friction opposes the motion, so its work is negative, −μN·d. Putting it on the wrong side of T₁ + ΣU = T₂ makes the body gain energy from rubbing.',
      'Assuming doubling the speed doubles the stopping distance. Distance is ½mv²/F, so it scales with v²: doubling speed quadruples braking distance for the same brake force.',
      'Forgetting that the friction force changes on a slope. The normal force is mg cos θ, not mg, and the weight component along the slope is mg sin θ.',
      'Using energy when you need time, direction or a reaction force. Energy methods give speed at a position. If a question asks for how long, or for the tension at an instant, you still need F = ma.',
      'Mixing J, kJ and kW·h or using km/h inside ½mv². Convert to m/s and kg first. A 1000 kg car at 90 km/h carries about 312 kJ, not 4 million.',
    ],
    rulesOfThumb: [
      'If the problem gives positions and asks for speed (no time, no acceleration), reach for work-energy first. If it asks for a force or acceleration at one instant, use ΣF = ma.',
      'Typical dry-road tyre friction on asphalt is roughly μ ≈ 0.7–0.8, so the quick estimate d ≈ v²/(2μg) puts a car at 100 km/h at around 55 m, before reaction time. Wet roads can be half that friction or worse.',
      'Gravity and spring forces are conservative: only the start and end heights or extensions matter, not the route taken. Friction is not, and its work grows with path length.',
      'Power is the check on equipment: P = F·v. A drive that pulls 500 N at 12 m/s needs 6 kW at the output before losses, and a real drivetrain needs noticeably more input power.',
    ],
    designChecklist: [
      'Draw a free-body diagram at an intermediate position and list every force acting.',
      'Identify which forces do work along the path and which are perpendicular and do none.',
      'Choose the two end states (1 and 2) and write T₁ and T₂ with correct masses, speeds and units.',
      'Evaluate each work term with its sign: weight by height change, springs by ½k(x₁² − x₂²), friction by −μN × path length.',
      'Solve T₁ + ΣU = T₂ for the unknown and check it is physically sensible (positive speed, sensible distance).',
      'If a force or time is also needed, return to ΣF = ma with the speed you found.',
    ],
    prerequisites: [
      { courseId: 'engineering-dynamics', topicId: 'particle-kinematics', why: 'Work-energy comes from integrating a = v dv/ds, and you need speed and position language first.' },
    ],
    quiz: [
      {
        kind: 'numeric',
        prompt: 'A car travelling at 20 m/s locks its brakes on dry pavement with μ = 0.6. Taking g = 9.81 m/s², how far does it skid to a stop?',
        answer: 33.98,
        unit: 'm',
        explanation: 'Work-energy with F = μmg: ½mv² = μmg·d, so d = v²/(2μg) = 400/(2 × 0.6 × 9.81) = 33.98 m. The mass cancels, which is why heavy and light cars skid the same distance on the same surface.',
      },
      {
        kind: 'numeric',
        prompt: 'A winch pulls a load with a steady force of 500 N at a constant speed of 12 m/s. What power does it deliver to the load?',
        answer: 6000,
        unit: 'W',
        explanation: 'P = F·v = 500 × 12 = 6000 W (6 kW). This is output power at the load; the input to the winch is larger by the efficiency losses.',
      },
      {
        kind: 'choice',
        prompt: 'A student says: "A car doing 40 km/h needs 10 m to stop. At 80 km/h the speed is doubled, so it will stop in 20 m." What is wrong?',
        options: [
          'Nothing: stopping distance is proportional to speed.',
          'Stopping distance goes with v², so 80 km/h needs 4 × 10 = 40 m.',
          'Stopping distance goes with v³, so it needs 80 m.',
          'The distance halves because the kinetic energy is shared between two axles.',
        ],
        correct: 1,
        explanation: 'With a constant brake force, F·d = ½mv², so d ∝ v². Doubling the speed quadruples the kinetic energy to be removed, hence four times the distance (40 m), not twice.',
      },
      {
        kind: 'numeric',
        prompt: 'A smooth (frictionless) slide drops 3 m in height. A child starts from rest at the top. Taking g = 9.81 m/s², what is the speed at the bottom?',
        answer: 7.672,
        unit: 'm/s',
        explanation: 'Only gravity does work: mgh = ½mv², so v = √(2gh) = √(2 × 9.81 × 3) = 7.67 m/s. The shape of the slide does not matter, and the child’s mass cancels. Newton’s law would have needed the slope at every point.',
      },
      {
        kind: 'numeric',
        prompt: 'A spring (k = 2000 N/m) is compressed by 0.10 m and launches a 0.5 kg block along a frictionless surface. What speed does the block leave the spring with?',
        answer: 6.325,
        unit: 'm/s',
        explanation: 'The spring stores ½kx² = ½ × 2000 × 0.1² = 10 J, which all becomes kinetic energy: ½(0.5)v² = 10, so v = √40 = 6.32 m/s. The spring force varies with compression, which is awkward with F = ma but trivial with energy.',
      },
      {
        kind: 'choice',
        prompt: 'A pendulum bob is released from rest at 60° from the vertical and you want its speed at the bottom. Why is work-energy a good choice?',
        options: [
          'The tension is always perpendicular to the motion, so it does no work; only gravity contributes, and its work depends only on the height drop.',
          'The tension does work that must be found by integrating along the arc.',
          'Energy methods give the tension directly at the bottom.',
          'Work-energy is only valid for straight-line motion, so the pendulum must be treated as a series of straight segments.',
        ],
        correct: 0,
        explanation: 'The string pulls along the radius while the bob moves tangentially, so T·dr = 0 and tension does no work. The unknown tension never appears, which is exactly why energy beats F = ma here. (The tension at the bottom would need ΣF = ma in the normal direction.)',
      },
      {
        kind: 'choice',
        prompt: 'A block slides down a rough incline. Which of the following forces does NO work on the block?',
        options: [
          'Gravity',
          'Kinetic friction',
          'The component of weight along the slope',
          'The normal force from the incline',
        ],
        correct: 3,
        explanation: 'The normal force is perpendicular to the surface and so perpendicular to the displacement: its dot product with dr is zero. Gravity does positive work, friction does negative work, and the along-slope weight component is how gravity does its work.',
      },
    ],
  },

  'rigid-body-planar-kinematics': {
    intuition:
      'Spin a bicycle wheel as you wheel it along the ground. The hub moves at the speed of the bike, yet the top of the tyre moves almost twice as fast and the point touching the road is, for an instant, not moving at all. Every point of a rigid body shares one angular velocity, but each has its own linear velocity because each sits at a different distance from the axis. The trick is to see the motion as a translation of one convenient point plus a spin about it. At any instant, there is also a single point, the instantaneous centre, about which the whole body is simply rotating, and the speed of any point is just its distance from that centre times ω. That picture turns a messy compound motion into one short multiplication.',
    derivation: [
      {
        text: 'Take two points A and B on a rigid body. The vector between them has fixed length, and it can only change by rotating with the body. Its position relative to A is r_B/A.',
        latex: '\\vec r_B = \\vec r_A + \\vec r_{B/A}, \\qquad |\\vec r_{B/A}| = \\text{const}',
      },
      {
        text: 'A vector of constant length that rotates with angular velocity ω changes at the rate ω × r. Differentiating the position equation therefore gives the relative-velocity equation.',
        latex: '\\vec v_B = \\vec v_A + \\vec\\omega\\times\\vec r_{B/A}',
      },
      {
        text: 'Differentiate again. The derivative of ω × r contains an α × r term and an ω × (ω × r) term. Taking a planar body, where ω is perpendicular to r, the double cross product reduces to −ω² r.',
        latex: '\\vec a_B = \\vec a_A + \\vec\\alpha\\times\\vec r_{B/A} - \\omega^2\\,\\vec r_{B/A}',
      },
      {
        text: 'The second and third terms have physical meaning: α × r is tangential (a speeding-up of the spin), and −ω² r points from B back toward A (centripetal). A body spinning at constant ω still has acceleration at every point away from the pivot.',
      },
      {
        text: 'Choose point P to be the one with v_P = 0. Setting v_P = 0 in the velocity equation gives the speed of any point directly from its distance to P. This P is the instantaneous centre of rotation.',
        latex: '\\vec v_A = \\vec\\omega\\times\\vec r_{A/P}, \\qquad |v_A| = \\omega\\,|r_{A/P}|',
      },
      {
        text: 'For a wheel rolling without slipping, the contact point has zero velocity, so it is the instantaneous centre. The centre of the wheel is a distance r from it and the top is 2r.',
        latex: 'v_{center} = \\omega r, \\qquad v_{top} = \\omega(2r) = 2v_{center}',
      },
    ],
    commonMistakes: [
      'Using v = ωr when the pivot is not the point the radius is measured from. ω × r_(B/A) gives the velocity of B relative to A, not relative to the ground, unless A is fixed.',
      'Thinking the instantaneous centre has zero acceleration. For a rolling wheel the contact point has zero velocity but accelerates at ω²r toward the hub. If it did not, the wheel would not be turning.',
      'Dropping the centripetal term. A link spinning at constant ω (α = 0) still has acceleration −ω² r_(B/A) at its far end. Forgetting that gives zero acceleration for a rotating arm.',
      'Mixing up the order in the cross product. r_(B/A) points from A to B. Flipping it reverses the sign of the relative velocity and puts the wrong direction on B.',
      'Applying rolling constraints to a slipping wheel. v = ωr is true only if the contact point does not slide. A spinning-out or locked wheel has v ≠ ωr and the instantaneous centre is elsewhere.',
      'Assuming the instantaneous centre stays at the same point on the body. It moves from instant to instant. It is valid for velocities only: its acceleration is not zero, so do not use it to compute accelerations.',
    ],
    rulesOfThumb: [
      'On a rolling wheel: contact point 0, hub v, top 2v, and a point level with the hub √2·v, moving at 45° to the road. Use it as a check on every wheel velocity you compute.',
      'To find the instantaneous centre, draw the perpendicular to the velocity of each of two known points; the lines meet at the IC. If the velocities are parallel and equal the body is in pure translation and the IC is at infinity.',
      'Velocity is a rotation problem; acceleration is a rotation problem plus a centripetal correction. Do velocities first and acceleration second, because ω is needed for both.',
      'Two points on the same rigid link must have equal velocity components along the line joining them. That quick projection check catches many sign mistakes.',
    ],
    designChecklist: [
      'Sketch the mechanism and mark the point whose motion is known and the point you need.',
      'Draw the position vector r_(B/A) and choose a sign convention for positive ω (counter-clockwise is usual).',
      'Write the relative-velocity equation, split into x and y components, and solve for the unknown ω or velocity.',
      'Use the instantaneous centre as an independent check on every velocity magnitude.',
      'Move on to the relative-acceleration equation including α × r and −ω² r, using the ω found already.',
      'Check the result with the projection rule or a limiting case such as ω = 0.',
    ],
    prerequisites: [
      { courseId: 'engineering-dynamics', topicId: 'particle-kinematics', why: 'Each point of the body is a particle, and the tangential-normal split of acceleration is the same idea applied to rotation.' },
    ],
    quiz: [
      {
        kind: 'numeric',
        prompt: 'A wheel of radius 0.35 m rolls without slipping with its centre moving at 14 m/s. How fast is the top of the tyre moving relative to the ground?',
        answer: 28,
        unit: 'm/s',
        explanation: 'The contact point is the instantaneous centre. The top is 2r from it and the hub is r from it, so v_top = 2 × v_center = 28 m/s. Check: ω = 14/0.35 = 40 rad/s and 40 × 0.70 = 28 m/s.',
      },
      {
        kind: 'numeric',
        prompt: 'Point A on a rigid body moves at 3 m/s in the +x direction. The body rotates counter-clockwise at ω = 2 rad/s, and point B is 0.5 m directly above A (r_(B/A) = 0.5 ĵ m). What is the speed of B?',
        answer: 2,
        unit: 'm/s',
        explanation: 'ω × r = (2 k̂) × (0.5 ĵ) = −1 î m/s (counter-clockwise spin moves a point above the pivot to the left). v_B = 3î − 1î = 2î, so the speed is 2 m/s. A point above the pivot would be moving faster if the spin were clockwise.',
      },
      {
        kind: 'numeric',
        prompt: 'A link rotates at a constant 10 rad/s about a fixed pin. What is the magnitude of the acceleration of a point 0.2 m from the pin?',
        answer: 20,
        unit: 'm/s²',
        explanation: 'Constant ω means α = 0, so only the centripetal term remains: a = ω²r = 100 × 0.2 = 20 m/s², directed toward the pin. Zero angular acceleration does not mean zero linear acceleration.',
      },
      {
        kind: 'choice',
        prompt: 'A wheel rolls without slipping on a flat road. What is the instantaneous velocity of the point of the tyre touching the road, relative to the road?',
        options: [
          'v, in the direction of travel.',
          'Zero.',
          'v, opposite to the direction of travel.',
          '2v, in the direction of travel.',
        ],
        correct: 1,
        explanation: 'The hub moves forward at v while the contact point is carried backward by the spin at ωr = v. The two cancel, so the contact point is momentarily at rest. That is exactly what no slip means.',
      },
      {
        kind: 'choice',
        prompt: 'A student says: "A wheel rolls without slipping at a steady speed. The contact point is the instantaneous centre, which has zero velocity, so its acceleration is also zero." What is wrong?',
        options: [
          'Nothing: a point at rest has no acceleration.',
          'The contact point accelerates at ω²r directed toward the hub; the IC has zero velocity but not zero acceleration.',
          'The contact point accelerates at ωr directed backward along the road.',
          'The contact point accelerates at g downward, because it is touching the ground.',
        ],
        correct: 1,
        explanation: 'Zero velocity at an instant does not imply zero acceleration. From a_P = a_hub + α × r − ω²r with a_hub = 0 and α = 0, the contact point has a = ω²r pointing up toward the hub. Its velocity reverses direction as the tyre rolls through it.',
      },
      {
        kind: 'numeric',
        prompt: 'A wheel rolls without slipping with its centre moving at 3 m/s. What is the speed (relative to the ground) of a point on the rim level with the hub?',
        answer: 4.243,
        unit: 'm/s',
        explanation: 'The point is √(r² + r²) = √2·r from the instantaneous centre, and ω = v/r. So v = ω√2 r = √2 × 3 = 4.24 m/s. Its direction is perpendicular to the line to the contact point, i.e. at 45° to the road.',
      },
      {
        kind: 'choice',
        prompt: 'Two points on a rigid link have known velocity directions that are not parallel. How do you locate the instantaneous centre of the link?',
        options: [
          'Draw a perpendicular to each velocity at its point; the IC is where the lines intersect.',
          'Draw a line parallel to each velocity; the IC is where they cross.',
          'Take the midpoint between the two points.',
          'Take the point on the link with the largest speed.',
        ],
        correct: 0,
        explanation: 'Since v = ω × r_(/IC), each velocity is perpendicular to the line from the IC to that point. So the IC lies on both perpendiculars. The point of maximum speed is the one farthest from the IC, not the IC itself.',
      },
    ],
  },

  'rigid-body-kinetics': {
    intuition:
      'Kick a ball through its centre and it slides; kick it off-centre and it spins as it moves. The same net force produces the same acceleration of the centre of mass in both cases, but the spin depends on where the force is applied and on how the mass is spread out. Two equations capture it: the net force sets how the centre of mass accelerates, and the net moment about the centre of mass sets how fast the body spins up, with the moment of inertia playing the role of rotational mass. A wheel rolling down a slope ties the two together, because friction at the ground both pushes the wheel and spins it. The mass that sits far from the centre, as in a hoop, costs more spin energy, so it accelerates down a ramp more slowly than a solid ball of the same mass.',
    derivation: [
      {
        text: 'Sum Newton’s law over all the particles in the body. Internal forces cancel in pairs, and the definition of the centre of mass turns the sum of m a_i into total mass times the acceleration of G.',
        latex: '\\Sigma\\vec F = m\\,\\vec a_G',
      },
      {
        text: 'For rotation, take the angular momentum about the centre of mass. For planar motion H_G = I_G ω, and the rate of change of angular momentum equals the net moment about G.',
        latex: '\\Sigma M_G = \\frac{dH_G}{dt} = I_G\\,\\alpha',
      },
      {
        text: 'Consider a round body (radius r, I_G = m k² r²) rolling without slipping down an incline at angle θ. The contact point has zero velocity, which locks the centre acceleration to the spin.',
        latex: 'a_G = \\alpha\\,r',
      },
      {
        text: 'Along the slope: gravity pulls down the slope and friction f acts up the slope.',
        latex: 'mg\\sin\\theta - f = m\\,a_G',
      },
      {
        text: 'About G, only friction has a moment arm r. Using I_G = m k² r² and α = a_G / r:',
        latex: 'f\\,r = I_G\\,\\alpha = m k^2 r^2\\,\\frac{a_G}{r} \\;\\Rightarrow\\; f = m k^2 a_G',
      },
      {
        text: 'Substituting f into the slope equation gives the acceleration. Mass and radius cancel, leaving only the shape factor k².',
        latex: 'a_G = \\frac{g\\sin\\theta}{1 + k^2}, \\qquad f = mg\\sin\\theta\\,\\frac{k^2}{1+k^2}',
      },
      {
        text: 'Rolling is possible only if the friction required does not exceed what the surface can provide, f ≤ μN with N = mg cos θ. Otherwise the body slips and kinetic friction μN applies instead.',
        latex: '\\mu \\ge \\tan\\theta\\,\\frac{k^2}{1+k^2}',
      },
    ],
    commonMistakes: [
      'Writing f = μN for a body that rolls without slipping. Friction is only as large as it needs to be, f = ½ma for a solid cylinder; μN is merely the upper limit. Using μN gives the wrong acceleration.',
      'Taking moments about the wrong point with the wrong I. ΣM_G = I_G α is valid about the mass centre. About any other point you need extra terms. Even for a rolling wheel, moments about the contact point work only if G is at the geometric centre, and then you must use I_C = I_G + mr².',
      'Forgetting the rolling constraint, or applying it to a slipping body. a_G = αr holds only when the contact point has zero velocity. Once the body slips there are two independent unknowns.',
      'Using the moment of inertia of the wrong shape. Solid cylinder ½mr², solid sphere ⅖mr², hoop or thin ring mr², and the hollow sphere is ⅔mr². Mixing them swaps the order of the race.',
      'Missing the sign of friction. On a driven wheel the ground friction points forward (it is what propels the car); on a braked wheel it points backward. On a ramp it points up the slope. Sketch the free-body diagram before assuming a direction.',
      'Treating rotation as separate from translation. Forces that do not pass through G both accelerate it and spin the body. Both ΣF = ma_G and ΣM_G = I_G α must hold.',
    ],
    rulesOfThumb: [
      'On the same incline, a solid sphere beats a solid cylinder, which beats a hoop, irrespective of mass and radius: a = g sin θ/(1 + k²) with k² = 0.4, 0.5 and 1.',
      'A rolling solid cylinder gets only two thirds of the sliding acceleration g sin θ, and the hoop gets half. The rest of the energy goes into spin.',
      'The friction a rolling cylinder needs on a 30° slope is only about 0.19; a typical rubber or steel contact has far more, so rolling is the default unless the surface is icy or oily.',
      'For a rough check that I_G is plausible, I_G = m k² r² and k² lies between 0 (all mass at the centre) and 1 (all at the rim) for a round body of radius r.',
    ],
    designChecklist: [
      'Draw the free-body diagram of the body including weight at G, the normal force and the friction force with an assumed direction.',
      'Choose axes along and across the motion and note the positive sense of rotation.',
      'Write ΣF = m a_G in each axis and ΣM_G = I_G α about the centre of mass.',
      'Decide whether the body rolls or slips. If rolling, add a_G = αr; if slipping, use f = μN.',
      'Solve for a_G, α and the friction force, then check the no-slip condition f ≤ μN with the assumed state.',
      'If the check fails, redo the problem assuming slip. Verify with an energy balance (the speed at the bottom) as an independent check.',
    ],
    prerequisites: [
      { courseId: 'engineering-dynamics', topicId: 'rigid-body-planar-kinematics', why: 'Kinetics needs the rolling constraint and the relation between a_G and α from the kinematics.' },
      { courseId: 'engineering-dynamics', topicId: 'newton-work-energy', why: 'Newton’s second law for the mass centre, and the energy method used to cross-check the speed.' },
    ],
    quiz: [
      {
        kind: 'numeric',
        prompt: 'A solid sphere (k² = 2/5) rolls without slipping down a 30° incline. Taking g = 9.81 m/s², what is its acceleration along the slope?',
        answer: 3.504,
        unit: 'm/s²',
        explanation: 'a = g sin θ/(1 + k²) = 9.81 × 0.5/1.4 = 3.50 m/s². This is 71 % of the frictionless-slide value 4.905 m/s², because part of the energy goes into spin.',
      },
      {
        kind: 'numeric',
        prompt: 'What is the minimum coefficient of friction needed for a solid cylinder to roll without slipping on a 30° incline?',
        answer: 0.1925,
        unit: '',
        explanation: 'μ ≥ tan θ · k²/(1 + k²) with k² = ½: tan 30° × 0.5/1.5 = 0.5774/3 = 0.192. If the surface offers less than this, the cylinder slips.',
      },
      {
        kind: 'numeric',
        prompt: 'A solid disc of mass 4 kg and radius 0.25 m (I = ½mr²) is spun by a net moment of 5 N·m about its axis through G. What is its angular acceleration?',
        answer: 40,
        unit: 'rad/s²',
        explanation: 'I_G = ½ × 4 × 0.25² = 0.125 kg·m². From ΣM_G = I_G α: α = 5/0.125 = 40 rad/s².',
      },
      {
        kind: 'choice',
        prompt: 'A solid sphere, a solid cylinder and a hoop of the same mass and radius are released together from rest on the same incline and roll without slipping. Which arrives first?',
        options: [
          'The hoop, because it has the most rotational inertia.',
          'The solid cylinder.',
          'All arrive together, since mass and radius are equal.',
          'The solid sphere, because it has the smallest k².',
        ],
        correct: 3,
        explanation: 'a = g sin θ/(1 + k²). The sphere has k² = 0.4, the cylinder 0.5, the hoop 1, so the sphere accelerates fastest. The mass and the radius cancel, so equal values do not make them tie: the mass distribution does.',
      },
      {
        kind: 'choice',
        prompt: 'A student solving a cylinder that rolls without slipping down a ramp writes "friction = μN" and uses it in ΣF = ma. What is the error?',
        options: [
          'Nothing: friction is always μN.',
          'Friction should be μmg regardless of the angle of the slope.',
          'Rolling friction is not μN: it equals only the value needed to enforce a = αr (here ½ma), and μN is just an upper limit to check against.',
          'Friction does no work, so it should be left out of ΣF.',
        ],
        correct: 2,
        explanation: 'For static (rolling) contact the friction is whatever the two equations of motion and the constraint demand, f = ½ma for a solid cylinder. Only for slipping is f = μN. After solving, check f ≤ μN to confirm the no-slip assumption. Friction at the contact point does no work in pure rolling, but it does appear in ΣF and ΣM_G.',
      },
      {
        kind: 'numeric',
        prompt: 'A solid cylinder on a 30° incline with only μ = 0.1 slips as it descends. Taking g = 9.81 m/s², what is its acceleration of the centre of mass?',
        answer: 4.055,
        unit: 'm/s²',
        explanation: 'Needed μ is 0.1925 > 0.1, so it slips and friction is kinetic: f = μN = 0.1 mg cos θ. Then a = g(sin θ − μ cos θ) = 9.81(0.5 − 0.1 × 0.866) = 4.06 m/s². This exceeds the rolling value of 3.27 m/s², and the cylinder spins up more slowly than rolling would require.',
      },
    ],
  },

  'free-vibration': {
    intuition:
      'Pull a mass on a spring and let go. It overshoots, comes back, overshoots again, each swing a little smaller, until it settles. Two things decide that behaviour. The natural frequency says how quickly the system would swing with no losses: stiff spring and small mass means fast; soft spring and big mass means slow. The damping ratio says how much of the energy each cycle is lost: a tiny ratio gives many ringing cycles, a ratio of 1 gives the quickest return with no overshoot, and a larger ratio creeps back slowly like a mass in treacle. A tuning fork, a car after a pothole and a skyscraper after a gust are all this same equation with different numbers, which is why a single model explains so many different machines.',
    derivation: [
      {
        text: 'Draw a free-body diagram of the mass displaced by x. The spring force kx and the viscous damping force cẋ both oppose the motion. Newton’s second law gives the equation of motion.',
        latex: 'm\\ddot x + c\\dot x + kx = 0',
      },
      {
        text: 'Linear equations with constant coefficients have exponential solutions. Try x = e^{st} and the equation reduces to a quadratic in s.',
        latex: 'm s^2 + c s + k = 0',
      },
      {
        text: 'Define the natural frequency and the damping ratio, where c_c = 2√(km) is the damping that makes the two roots equal (critical damping). The roots become s = −ζωₙ ± ωₙ√(ζ² − 1).',
        latex: '\\omega_n = \\sqrt{\\frac{k}{m}}, \\qquad \\zeta = \\frac{c}{2\\sqrt{km}}',
      },
      {
        text: 'For ζ < 1 the roots are complex and the solution oscillates inside a decaying exponential envelope at the damped frequency. The constants A and B come from the initial displacement and velocity.',
        latex: 'x(t) = e^{-\\zeta\\omega_n t}\\left(A\\cos\\omega_d t + B\\sin\\omega_d t\\right), \\quad \\omega_d = \\omega_n\\sqrt{1-\\zeta^2}',
      },
      {
        text: 'For ζ = 1 the roots are equal and real, giving the fastest non-oscillating return. For ζ > 1 the roots are both real and negative; the slower root dominates, so a heavily damped system creeps back more slowly than a critically damped one.',
      },
      {
        text: 'Two successive peaks are one damped period apart, T_d = 2π/ω_d, so the envelope shrinks by a factor e^{ζωₙT_d}. Taking the natural log gives the logarithmic decrement, the standard way to measure damping from a decay test.',
        latex: '\\delta = \\ln\\frac{x_1}{x_2} = \\frac{2\\pi\\zeta}{\\sqrt{1-\\zeta^2}}',
      },
    ],
    commonMistakes: [
      'Using the damper coefficient c as the damping ratio. ζ = c/(2√(km)) is dimensionless; c is in N·s/m. A damper that is "heavy" for a 1 kg mass is negligible for a 1000 kg one.',
      'Applying the damped-frequency formula when ζ ≥ 1. ω_d = ωₙ√(1−ζ²) is real only for underdamped systems; for ζ ≥ 1 there is no oscillation at all.',
      'Mixing rad/s and Hz. ωₙ = √(k/m) is in rad/s, and the frequency in hertz is ωₙ/2π. A 20 rad/s system rings at 3.18 Hz, not 20 Hz.',
      'Assuming more damping always settles faster. Beyond ζ = 1 the response gets slower. For fastest return with no overshoot, aim at ζ near 1; many practical designs pick around 0.7 as a compromise with a small overshoot.',
      'Treating the damped and natural frequencies as the same. For light damping the difference is tiny (ζ = 0.1 gives 0.5 %), but at ζ = 0.6 the damped frequency is only 80 % of ωₙ.',
      'Getting the log decrement wrong by using the percentage drop instead of the ratio of peaks. δ = ln(x₁/x₂); with peaks of 10 mm and 6 mm that is ln(10/6) = 0.51, not ln(0.4).',
    ],
    rulesOfThumb: [
      'Settling to 2 % takes about 4/(ζωₙ) seconds: it depends on the product ζωₙ, the decay rate of the envelope, not on either alone.',
      'For small damping, ζ ≈ δ/(2π). A system whose peaks drop by about 10 % per cycle has ζ of roughly 0.017.',
      'Structures such as steel frames and bridges often have damping ratios of only a few percent or less, which is why resonance is dangerous for them. Passenger-car suspensions are usually tuned in the region of 0.2 to 0.4.',
      'Quadrupling the mass halves ωₙ, and keeping the same ζ requires doubling c. The frequency goes with the square root of k/m.',
    ],
    designChecklist: [
      'Isolate one degree of freedom and draw the free-body diagram with spring and damper forces opposing motion.',
      'Write the equation of motion and read off m, c and k (find an equivalent k and m if springs or masses are in series or parallel).',
      'Compute ωₙ = √(k/m) and ζ = c/(2√(km)).',
      'Classify the response from ζ (under, critical, over) and compute ω_d for the underdamped case.',
      'Apply the initial conditions to get A and B, and estimate settling time with 4/(ζωₙ).',
      'Check that the design meets the specification (frequency out of the exciting range, overshoot tolerable) and adjust k, m or c accordingly.',
    ],
    prerequisites: [
      { courseId: 'engineering-dynamics', topicId: 'newton-work-energy', why: 'The equation of motion comes from ΣF = ma, and the energy view explains why the oscillation decays.' },
    ],
    videos: [
      {
        id: 'vLaFAKnaRJU',
        title: 'Understanding Vibration and Resonance',
        channel: EE,
        why: 'A visual introduction to vibration and resonance that complements the spring-mass-damper model used here.',
      },
    ],
    quiz: [
      {
        kind: 'numeric',
        prompt: 'A 5 kg mass sits on a spring of stiffness 2000 N/m. What is its undamped natural frequency?',
        answer: 20,
        unit: 'rad/s',
        explanation: 'ωₙ = √(k/m) = √(2000/5) = √400 = 20 rad/s, which is 3.18 Hz. Divide by 2π for hertz.',
      },
      {
        kind: 'numeric',
        prompt: 'The same system (m = 5 kg, k = 2000 N/m) is fitted with a damper of c = 40 N·s/m. What is its damping ratio?',
        answer: 0.2,
        unit: '',
        explanation: 'c_c = 2√(km) = 2√(5 × 2000) = 200 N·s/m, so ζ = 40/200 = 0.2. That is underdamped: the mass will oscillate with a decaying amplitude.',
      },
      {
        kind: 'numeric',
        prompt: 'In a decay test two successive positive peaks measure 10 mm and 6 mm. What is the damping ratio?',
        answer: 0.081,
        unit: '',
        tolerance: 0.03,
        explanation: 'δ = ln(10/6) = 0.511. Inverting δ = 2πζ/√(1−ζ²) gives ζ = δ/√(4π² + δ²) = 0.511/√(39.48 + 0.261) = 0.0810. Using the small-damping shortcut δ/(2π) gives 0.0813, nearly identical here.',
      },
      {
        kind: 'choice',
        prompt: 'The mass of a spring-mass-damper system is quadrupled while k stays the same. What happens to the natural frequency?',
        options: [
          'It quadruples.',
          'It is reduced to a quarter.',
          'It is halved.',
          'It does not change, because the spring is unchanged.',
        ],
        correct: 2,
        explanation: 'ωₙ = √(k/m), so multiplying m by 4 divides ωₙ by √4 = 2. A heavier mass is harder to accelerate, but the frequency does not scale linearly with it.',
      },
      {
        kind: 'choice',
        prompt: 'A student computes the response of a system with ζ = 1.5 and writes ω_d = ωₙ√(1 − ζ²) as the oscillation frequency. What is wrong?',
        options: [
          'Nothing: damped systems always oscillate at ω_d.',
          'For ζ > 1, √(1 − ζ²) is imaginary: the system is overdamped and does not oscillate; the roots are real and the response is a sum of two decaying exponentials.',
          'The formula should use ζ² − 1 and gives a real oscillation frequency of 1.118 ωₙ.',
          'The system is critically damped, so ω_d equals ωₙ.',
        ],
        correct: 1,
        explanation: 'ω_d = ωₙ√(1 − ζ²) exists only for ζ < 1. For ζ = 1.5 the characteristic roots are s = −ζωₙ ± ωₙ√(ζ² − 1), both real and negative, so there is no oscillation, just a slow creep back to zero.',
      },
      {
        kind: 'numeric',
        prompt: 'A system has ωₙ = 20 rad/s and ζ = 0.6. What is its damped natural frequency ω_d?',
        answer: 16,
        unit: 'rad/s',
        explanation: 'ω_d = ωₙ√(1 − ζ²) = 20√(1 − 0.36) = 20 × 0.8 = 16 rad/s. At this damping the ringing frequency is already 20 % below the undamped value.',
      },
      {
        kind: 'numeric',
        prompt: 'A lightly damped system has ωₙ = 10 rad/s and ζ = 0.05. Using the 2 % criterion, roughly how long does it take to settle?',
        answer: 8,
        unit: 's',
        explanation: 't_s ≈ 4/(ζωₙ) = 4/(0.05 × 10) = 8 s. The envelope e^(−ζωₙt) falls to e^(−4) ≈ 1.8 %. Settling is slow because ζωₙ, the decay rate, is small.',
      },
    ],
  },

  'forced-vibration': {
    intuition:
      'Push a child on a swing. If you shove at random times, nothing much happens. Time your pushes with the swing’s own natural rhythm and tiny shoves build up into a big arc, limited only by friction. That is resonance: the energy you put in each cycle adds to the motion already there. A steadily shaken mass-spring-damper always ends up moving at the frequency of the shaking, not its own, but how big the motion is depends on how close that shaking frequency is to the natural frequency. Far below it the mass just follows the push, far above it the mass barely has time to move, and near it the motion is amplified by roughly 1/(2ζ). The same curve explains why an engine on soft mounts hardly shakes the floor, provided it is run well above the mount’s natural frequency.',
    derivation: [
      {
        text: 'Add a harmonic force to the free-vibration equation. After the transient dies out, the system responds at the drive frequency ω with some amplitude X and a phase lag φ.',
        latex: 'm\\ddot x + c\\dot x + kx = F_0\\sin\\omega t',
      },
      {
        text: 'Use complex notation: write the force as F₀e^{iωt} and the response as X e^{i(ωt−φ)}. Each time derivative multiplies by iω, so the equation becomes algebraic.',
        latex: '\\left(k - m\\omega^2 + i\\,c\\omega\\right)X e^{-i\\varphi} = F_0',
      },
      {
        text: 'Take the magnitude and divide by k. Using r = ω/ωₙ, c ω/k = 2ζr and mω²/k = r², the amplitude is the static deflection F₀/k times a magnification factor M.',
        latex: 'X = \\frac{F_0}{k}\\,M, \\qquad M = \\frac{1}{\\sqrt{(1-r^2)^2 + (2\\zeta r)^2}}',
      },
      {
        text: 'The phase comes from the angle of the complex stiffness. It is near 0° well below resonance, exactly 90° at r = 1 regardless of damping, and approaches 180° above resonance.',
        latex: '\\varphi = \\operatorname{atan2}\\!\\left(2\\zeta r,\\ 1 - r^2\\right)',
      },
      {
        text: 'At r = 1 the first term in the denominator vanishes, so the amplification is limited only by damping. The true peak of M sits slightly below r = 1 and exists only for ζ below 1/√2.',
        latex: 'M(r{=}1) = \\frac{1}{2\\zeta}, \\qquad r_{peak} = \\sqrt{1 - 2\\zeta^2}',
      },
      {
        text: 'For isolation, the force reaching the foundation is the sum of the spring force and the damper force, which are 90° out of phase, so the amplitudes combine as the square root of the sum of squares. Dividing by F₀ gives the transmissibility.',
        latex: 'F_T = X\\sqrt{k^2 + (c\\omega)^2} \\;\\Rightarrow\\; TR = \\frac{F_T}{F_0} = M\\sqrt{1 + (2\\zeta r)^2}',
      },
      {
        text: 'Setting TR = 1 with ζ = 0 gives (1 − r²) = ±1, hence r = √2. Above r = √2 the foundation sees less force than the machine applies; below it, the mount makes things worse.',
      },
    ],
    commonMistakes: [
      'Assuming the response occurs at the natural frequency. In steady state the system vibrates at the forcing frequency; the natural frequency only sets the amplitude, and its transient decays away.',
      'Placing a soft mount and running the machine below √2 times its natural frequency. In that region transmissibility is above 1, so the mount amplifies the force reaching the floor.',
      'Thinking more damping is always better. Damping tames the resonant peak, but above r = √2 it raises transmissibility because the damper passes force straight to the foundation. For fast run-ups through resonance you accept this trade-off, otherwise keep ζ small.',
      'Stating resonance is exactly at r = 1 for displacement. The peak of M is at r = √(1−2ζ²), slightly below 1. For ζ ≤ 0.1 the difference is under 1 %, so r = 1 is fine for estimates, but not for heavily damped systems.',
      'Ignoring the unit conversion between rpm and rad/s. 1200 rpm is 125.7 rad/s (20 Hz), not 1200 rad/s. A tenfold error in frequency puts the machine on the wrong side of resonance.',
      'Forgetting that a rotating machine starting or stopping must sweep through resonance. Even a well-isolated machine passes r = 1 on run-up and run-down, so the peak (limited by damping, and by how quickly you pass through) still matters.',
    ],
    rulesOfThumb: [
      'The amplification at resonance is roughly Q = 1/(2ζ): ζ = 0.05 means about 10 times the static deflection, and ζ = 0.01 means 50 times.',
      'Common isolation practice is to design for r of roughly 3 or more, which for light damping gives transmissibility of about 10 to 15 %. Pushing to r = 5 helps only slowly, since TR ≈ 1/(r² − 1).',
      'For a mount on a stiff floor the natural frequency follows from the static deflection: f_n ≈ 15.8/√δ_st (Hz, δ_st in mm). A 4 mm static deflection gives about 7.9 Hz.',
      'Steer clear of the band r from about 0.7 to 1.4 for continuous operation, where amplification is large. Move the natural frequency (change k or m) rather than relying on damping.',
    ],
    designChecklist: [
      'Find the excitation frequency from the machine speed (rpm ÷ 60 for hertz, × 2π for rad/s) and the force amplitude F₀.',
      'Estimate the mass on the mounts and pick a target frequency ratio r of about 3 or more.',
      'Compute the mount stiffness from ωₙ = ω/r and k = mωₙ².',
      'Choose a damping ratio: low for isolation at high r, enough for a reasonable resonant peak during run-up.',
      'Evaluate X = (F₀/k)M and the transmitted force TR·F₀, and compare against the allowable motion and the allowable force on the floor.',
      'Check static deflection of the mounts under weight, and the transient amplitude when the machine speeds through resonance.',
      'Look at other exciters (other frequencies, harmonics) so that you do not solve one frequency and create a resonance at another.',
    ],
    prerequisites: [
      { courseId: 'engineering-dynamics', topicId: 'free-vibration', why: 'The forced response is built on the same ωₙ, ζ and damped dynamics, plus a forcing term.' },
    ],
    videos: [
      {
        id: 'vLaFAKnaRJU',
        title: 'Understanding Vibration and Resonance',
        channel: EE,
        why: 'A visual treatment of resonance, to go with the frequency-ratio curves in this topic.',
      },
    ],
    quiz: [
      {
        kind: 'numeric',
        prompt: 'A 50 kg fan runs at 1200 rpm. What mount stiffness (total, in N/m) puts the system at a frequency ratio r = ω/ωₙ = 3?',
        answer: 87730,
        unit: 'N/m',
        tolerance: 0.02,
        explanation: 'ω = 1200 × 2π/60 = 125.66 rad/s. For r = 3, ωₙ = 125.66/3 = 41.89 rad/s, and k = mωₙ² = 50 × 41.89² = 87,730 N/m. Note that the answer depends on the square of the frequency, so a 10 % error in rpm gives a 21 % error in k.',
      },
      {
        kind: 'numeric',
        prompt: 'A system with ζ = 0.05 is driven exactly at its natural frequency (r = 1). By what factor is the static deflection magnified?',
        answer: 10,
        unit: '',
        explanation: 'M(r = 1) = 1/(2ζ) = 1/(2 × 0.05) = 10. With only 5 % damping, a force that would deflect the system 1 mm statically produces 10 mm at resonance.',
      },
      {
        kind: 'numeric',
        prompt: 'An undamped system (ζ = 0) is driven at half its natural frequency (r = 0.5). What is the magnification factor M?',
        answer: 1.3333,
        unit: '',
        explanation: 'With ζ = 0, M = 1/|1 − r²| = 1/(1 − 0.25) = 1.333. Below resonance the response is in phase with the force and slightly larger than the static deflection.',
      },
      {
        kind: 'numeric',
        prompt: 'A machine on a mount with ζ = 0.05 runs at r = 3. What fraction of the exciting force is transmitted to the floor (transmissibility)?',
        answer: 0.1304,
        unit: '',
        tolerance: 0.02,
        explanation: 'TR = √(1 + (2ζr)²)/√((1 − r²)² + (2ζr)²) = √(1 + 0.09)/√(64 + 0.09) = 1.0440/8.0056 = 0.130. So the floor sees about 13 % of the force. Compare with the no-damping approximation 1/(r² − 1) = 0.125.',
      },
      {
        kind: 'choice',
        prompt: 'Above what frequency ratio r does a mount start to reduce the transmitted force below the applied force (TR < 1), for any damping?',
        options: [
          'r > 0.5',
          'r > 1',
          'r > √2 ≈ 1.41',
          'r > 2',
        ],
        correct: 2,
        explanation: 'All transmissibility curves cross TR = 1 at r = √2 irrespective of ζ. Below that, the mount amplifies the force; above it, it isolates. That is why isolation requires soft mounts relative to the machine speed, not stiff ones.',
      },
      {
        kind: 'choice',
        prompt: 'A student says: "My machine runs at r = 3 on soft mounts and transmits 13 % of the force. To isolate even better I will increase the damping ratio from 0.05 to 0.5." What is wrong?',
        options: [
          'Nothing: more damping always means less transmitted force.',
          'Above r = √2 more damping raises transmissibility (here to about 0.37) because the damper transmits force directly; damping helps only near resonance.',
          'Damping has no effect on transmissibility at any frequency ratio.',
          'Damping reduces the transmissibility but also increases the static deflection of the mount.',
        ],
        correct: 1,
        explanation: 'At r = 3, ζ = 0.5 gives TR = √(1 + 9)/√(64 + 9) = 3.162/8.544 = 0.370, nearly three times worse than the 0.130 at ζ = 0.05. Damping trades off a lower resonant peak (good for run-up) against a higher transmission at high frequency.',
      },
      {
        kind: 'numeric',
        prompt: 'Rubber mounts deflect 4 mm statically under the machine’s weight. Taking g = 9.81 m/s², what is the natural frequency of the machine on these mounts?',
        answer: 7.88,
        unit: 'Hz',
        explanation: 'Static deflection δ_st = mg/k = g/ωₙ², so ωₙ = √(g/δ_st) = √(9.81/0.004) = 49.5 rad/s, and f_n = ωₙ/2π = 7.88 Hz. A machine running above about 3 × 7.88 ≈ 24 Hz (1400 rpm) would be well isolated.',
      },
    ],
  },

  '4bar-linkage': {
    intuition:
      'A four-bar linkage is a closed loop of four rigid bars pinned at their ends, with one bar bolted to the ground. Turn one pin and the geometry forces the others to move: the loop must stay closed, so a single input angle fixes everything. Which bars can swing all the way round, and which merely rock back and forth, depends only on the four lengths. The same loop can also be good or bad at pushing. When the coupler and the output rocker line up, the coupler pushes straight along the rocker instead of across it, so almost none of the force turns the output: the mechanism jams. The wiper blades on a car, the folding arms of a tailgate and the jaws of a grabber are all four-bar linkages whose lengths were chosen to avoid those jammed positions.',
    derivation: [
      {
        text: 'Label the links: ground a, input crank r, coupler b and output rocker c. With the crank at angle θ from the ground link, the loop-closure condition says that the four vectors sum to zero. That fixes the output position for every θ.',
        latex: '\\vec r_{crank} + \\vec r_{coupler} = \\vec r_{ground} + \\vec r_{rocker}',
      },
      {
        text: 'The diagonal from the crank tip to the rocker’s ground pin is common to two triangles. In the triangle formed by the ground, the crank and this diagonal, the law of cosines gives its length.',
        latex: 'D^2 = a^2 + r^2 - 2ar\\cos\\theta',
      },
      {
        text: 'The same diagonal closes the triangle of coupler, rocker and itself. The angle μ between coupler and rocker is the transmission angle, and the law of cosines gives it directly.',
        latex: 'D^2 = b^2 + c^2 - 2bc\\cos\\mu \\;\\Rightarrow\\; \\cos\\mu = \\frac{b^2 + c^2 - a^2 - r^2 + 2ar\\cos\\theta}{2bc}',
      },
      {
        text: 'For the crank to make a full turn it must pass through θ = 0 and θ = 180°, where the diagonal is the shortest (a − r) and longest (a + r) possible. Each of these must still form a valid triangle with b and c, which requires the triangle inequality.',
        latex: '|b - c| \\le D \\le b + c',
      },
      {
        text: 'Applying the inequality at the two extremes and combining the cases, with r the shortest link and a the longest, gives the Grashof condition: the sum of the shortest and longest links must not exceed the sum of the other two.',
        latex: 's + l \\le p + q',
      },
      {
        text: 'Power balance (no friction) links the output torque to the input torque through the velocity ratio: τ_in ω_in = τ_out ω_out. So the mechanical advantage equals the inverse velocity ratio.',
        latex: 'MA = \\frac{\\tau_{out}}{\\tau_{in}} = \\frac{\\omega_{in}}{\\omega_{out}}',
      },
      {
        text: 'The component of the coupler force that turns the rocker is F sin μ. At μ = 90° all of it is useful; as μ approaches 0° or 180° the useful component tends to zero, which is why the transmission angle is the quality measure of a linkage.',
        latex: 'F_{useful} = F_{coupler}\\sin\\mu',
      },
    ],
    commonMistakes: [
      'Reading the Grashof condition backwards. The test is s + l ≤ p + q, and a mechanism that passes can have a fully rotating link; failing means that no link makes a full turn.',
      'Assuming that a Grashof linkage is automatically a crank-rocker. Which link rotates depends on which link is grounded: shortest link adjacent to the ground is a crank-rocker, shortest link as ground is a double-crank, and shortest link opposite the ground (or coupler) is a double-rocker.',
      'Judging a design by the Grashof test alone. It says whether a link can rotate, not whether the mechanism transmits force well. A design can pass Grashof and still have transmission angles near 0° in part of the cycle.',
      'Driving from the rocker. At the limit positions the crank and coupler are collinear, and a force on the rocker has no moment arm about the crank pin, so the linkage can lock in a dead centre. Drive from the crank.',
      'Measuring the transmission angle at the wrong joint, or reporting it as larger than 90° as if it were bad. It is the angle between coupler and rocker; what matters is how far it is from 90°, so an angle of 140° is as poor as 40°.',
      'Ignoring friction and clearance at the joints. The ideal power balance gives MA, but real pins add friction and backlash, which matters most when the transmission angle is poor.',
    ],
    rulesOfThumb: [
      'Keep the transmission angle between roughly 40° and 140° throughout the working range. Below about 40° or above about 140° friction and joint clearance start to dominate.',
      'A crank-rocker is the standard way to turn continuous rotation into oscillation: motor on the crank, wiper arm on the rocker. The rocker swing is set by the link ratios.',
      'Lengthening only the coupler changes the output swing and the transmission angle at the same time; you cannot fix one without checking the other.',
      'If the Grashof sum is nearly equal on both sides, the linkage is close to a change-point and tends to flip or jam, so leave margin in the dimensions.',
      'Build a quick cardboard or CAD model: motion is much easier to judge from a sweep than from the equations.',
    ],
    designChecklist: [
      'List the motion requirement: input type (rotating or rocking), output swing angle and any limits on the force.',
      'Pick link lengths to satisfy the Grashof condition with the shortest link in the role you want (crank, ground or coupler).',
      'Sweep the crank through its range and compute the transmission angle from the law-of-cosines formula at each angle.',
      'Reject or adjust the lengths if μ leaves roughly 40° to 140° during the working stroke.',
      'Check the output swing and the extreme positions against the packaging space, and make sure no link collides with another.',
      'Compute the output torque from the power balance, then add allowances for pin friction, bearing losses and the weight of the links.',
    ],
    prerequisites: [
      { courseId: 'engineering-dynamics', topicId: 'rigid-body-planar-kinematics', why: 'Each link is a rigid body in planar motion, and the velocity ratios come from the relative-velocity method.' },
    ],
    quiz: [
      {
        kind: 'numeric',
        prompt: 'A four-bar linkage has ground 100 mm, crank 40 mm, coupler 80 mm and rocker 70 mm. With the crank at θ = 0 (lying along the ground link), what is the transmission angle between coupler and rocker?',
        answer: 46.57,
        unit: '°',
        explanation: 'cos μ = (b² + c² − a² − r² + 2ar cos θ)/(2bc) = (6400 + 4900 − 10000 − 1600 + 8000)/11200 = 7700/11200 = 0.6875, so μ = 46.57°. Equivalently the diagonal is 100 − 40 = 60 mm and 60² = 80² + 70² − 2·80·70 cos μ. At θ = 180° the angle is 137.8°, which is further from the ideal 90° (47.8° away, against 43.4° here), so that is the worse end of the stroke.',
      },
      {
        kind: 'choice',
        prompt: 'A linkage has links of 30, 60, 70 and 90 mm. It passes the Grashof test (30 + 90 = 120 ≤ 60 + 70 = 130). Which type of mechanism results if the 30 mm link is the fixed (ground) link?',
        options: [
          'Crank-rocker',
          'Double-rocker',
          'Triple-rocker (non-Grashof)',
          'Double-crank',
        ],
        correct: 3,
        explanation: 'When the shortest link of a Grashof linkage is grounded, both links hinged to it can rotate fully, so both are cranks: a double-crank (drag-link). If the shortest were adjacent to the ground it would be a crank-rocker, and if it were the coupler a double-rocker.',
      },
      {
        kind: 'choice',
        prompt: 'A student tests the 100, 40, 80, 70 mm linkage: "s + l = 140 and p + q = 150, so 140 < 150 means the Grashof condition fails and no link can rotate." What is wrong?',
        options: [
          'The condition is s + l ≤ p + q, so 140 ≤ 150 satisfies it and the shortest link can rotate fully.',
          'The condition should compare s + q with l + p.',
          'The student should have used the sum of all four links.',
          'Nothing is wrong: the test needs equality to pass.',
        ],
        correct: 0,
        explanation: 'The Grashof criterion is that the shortest plus longest does not exceed the sum of the other two. Here 140 ≤ 150 so it passes: the crank (40 mm) next to the ground can rotate fully and the mechanism is a crank-rocker, which is what the worked example concludes.',
      },
      {
        kind: 'numeric',
        prompt: 'An ideal frictionless four-bar linkage runs with ω_in = 10 rad/s and ω_out = 4 rad/s in a given position. An input torque of 6 N·m is applied. What output torque can it deliver in that position?',
        answer: 15,
        unit: 'N·m',
        explanation: 'Power balance: τ_in ω_in = τ_out ω_out, so τ_out = 6 × 10/4 = 15 N·m, a mechanical advantage of 2.5. In a real linkage friction in the pins reduces this, and the value changes as the transmission angle changes through the cycle.',
      },
      {
        kind: 'choice',
        prompt: 'What does it mean when a four-bar linkage does not satisfy the Grashof condition?',
        options: [
          'The linkage cannot be assembled.',
          'The crank can rotate but the rocker cannot move.',
          'No link can make a full revolution: every link only oscillates (a triple-rocker).',
          'The linkage will always lock at the transmission angle of 90°.',
        ],
        correct: 2,
        explanation: 'If s + l > p + q, the shortest link cannot pass through the extreme collinear positions, so no link can rotate relative to the others. The linkage still works (it can be assembled and moves), but all links merely swing, so it is no use as a continuously driven mechanism.',
      },
      {
        kind: 'numeric',
        prompt: 'A linkage has ground 100 mm, crank 40 mm and coupler 80 mm. The rocker length lies between 40 mm and 100 mm. What is the shortest rocker length for which the Grashof condition is met?',
        answer: 60,
        unit: 'mm',
        explanation: 'With the crank shortest (s = 40) and ground longest (l = 100), the condition is 40 + 100 ≤ 80 + c, so c ≥ 60 mm. At exactly 60 mm the linkage is a change-point mechanism, so in practice you would choose slightly more, as for the 70 mm rocker in the worked example.',
      },
    ],
  },
}
