import type { TeachingContent } from '../teachingTypes'
import { EE } from '../teachingTypes'

/** Engineering Statics teaching content. */
export const CONTENT: Record<string, TeachingContent> = {
  'statics-equilibrium': {
    intuition:
      'Picture a plank resting on two trestles with a person standing on it. Nothing moves, so every push has an equal and opposite push somewhere else, and every tendency to twist is cancelled by an opposite twist. The free-body diagram is the discipline of drawing a loop around the thing you care about and asking, honestly, what is pushing on it across that loop: the weights, the applied loads, and — easy to forget — the forces the supports must supply to keep it still. Supports are not magic; each one can only resist the motions it physically blocks. A roller blocks one direction, so it gives one force; a pin blocks translation in two, so it gives two; a fixed wall also blocks rotation, so it adds a moment. Once the diagram is right, the algebra is almost mechanical, and most statics errors are really diagram errors.',
    derivation: [
      {
        text: 'Start from Newton’s second law for a body that is not accelerating. Its centre of mass has zero acceleration, so the vector sum of all external forces is zero:',
        latex: '\\sum \\vec F = m\\vec a_G = \\vec 0',
      },
      {
        text: 'The body must also not start to spin. The rate of change of angular momentum about the centre of mass equals the net moment, so for a body at rest the net moment is zero:',
        latex: '\\sum \\vec M_G = \\dot{\\vec H}_G = \\vec 0',
      },
      {
        text: 'Once the force sum is zero, the net moment is the same about every point, because shifting the reference point changes the moment by (r × ΣF) = 0. So you may take moments about whichever point is most convenient — typically a pin, where two unknown reactions have zero moment arm and vanish from the equation.',
        latex: '\\sum \\vec M_A = \\sum \\vec M_B \\quad \\text{whenever} \\quad \\sum \\vec F = \\vec 0',
      },
      {
        text: 'In 2D, the vector equations reduce to three independent scalars. A body with three unknown reactions is solvable by statics alone; more unknowns than equations means the problem is statically indeterminate and needs deformation (stiffness) information.',
        latex: '\\sum F_x = 0, \\qquad \\sum F_y = 0, \\qquad \\sum M_A = 0',
      },
      {
        text: 'A distributed load w(x) acts over a length. Its moment about A is an integral, and it equals the moment of a single force R placed at the load’s centroid, so we replace the load by its area and the position of that area’s centroid:',
        latex: 'R = \\int_0^L w(x)\\,dx, \\qquad \\bar x = \\frac{\\int_0^L x\\,w(x)\\,dx}{R}',
      },
      {
        text: 'Worked example: a uniform load w over the whole span L gives R = wL at x = L/2, and taking moments about the pin A gives the roller reaction directly with one equation:',
        latex: 'B_y L - \\sum P_i a_i - wL\\,\\frac{L}{2} = 0 \\;\\Rightarrow\\; B_y = \\frac{\\sum P_i a_i + wL^2/2}{L}',
      },
    ],
    commonMistakes: [
      'Skipping or sketching the free-body diagram. Forces that act on the body but are not drawn (weight of the member itself, a support moment, a friction force) simply never enter the equations. Draw the diagram first, every time.',
      'Giving a support the wrong reactions. A roller or smooth surface provides only a force normal to the surface; a pin gives two components; a fixed support gives two components and a moment. Putting a horizontal reaction on a roller is the classic error, and it manufactures an “indeterminate” problem that does not exist.',
      'Placing a uniform load at the wrong point or with the wrong size. R = wL (the area), at the centroid. For a triangular load the resultant is half base times height, acting one third of the base from the tall end — not at the midpoint.',
      'Using the intensity of a distributed load as a force. w is in N/m or kN/m; multiply by length before it can sit in ΣF = 0. Mixing kN with N, or m with mm, in one moment equation is the most common numerical slip.',
      'Sign inconsistency in moments. Choose counter-clockwise (or clockwise) positive once and apply it to every force in the same equation. A reaction that comes out negative is not wrong — it means it acts opposite to the way you drew it.',
      'Choosing a moment point that keeps all the unknowns in the equation. Taking moments about the point where two unknowns meet turns a simultaneous system into one-equation-one-unknown steps; ignoring that makes the algebra longer and error-prone.',
    ],
    rulesOfThumb: [
      'Always do a second check with a different moment point or with ΣF. If the reactions do not sum to the total applied load (for vertical loads), something is wrong.',
      'Reactions should be physically sensible: a load placed close to a support puts most of its weight on that support, and the far support carries the remainder. If your result contradicts that, recheck signs.',
      'Count unknowns before computing: in 2D you can solve for at most 3 reactions on a single rigid body, and in 3D at most 6. A negative reaction at a support that can only push (like the foot of a tripod) means the body is about to tip or lift off.',
      'A body acted on by exactly two forces has them equal, opposite and collinear; a body acted on by exactly three non-parallel forces has them concurrent. These shortcuts give geometry for free and save a lot of algebra on ladders and bracket problems.',
    ],
    designChecklist: [
      'Decide exactly which body (or system of bodies) to isolate, and sketch it free of its surroundings.',
      'Add every external load, including self-weight where it matters, in the correct position and direction.',
      'Replace each support or connection with the reactions it can actually supply (roller, pin, fixed, cable).',
      'Replace distributed loads with their resultants at their centroids, keeping the original load for later shear/moment work.',
      'Check determinacy by counting unknowns against the available equations.',
      'Write moment equilibrium about the point where most unknowns act first, then ΣFx and ΣFy.',
      'Verify with an independent equation (a second moment point) and check that reactions are physically reasonable.',
    ],
    prerequisites: [
      { courseId: 'mechanics-of-materials', topicId: 'stress-strain', why: 'Statics gives you the forces; stress and strain are what those forces do to the material, so statics is the first step of every strength check.' },
    ],
    quiz: [
      {
        kind: 'numeric',
        prompt: 'A simply supported beam of span 5 m has a pin at A and a roller at B. It carries a 10 kN downward point load 2 m from A and a uniform load of 2 kN/m over the whole span. What is the roller reaction B_y?',
        answer: 9,
        unit: 'kN',
        explanation: 'The uniform load has resultant 2 × 5 = 10 kN at the midspan, 2.5 m from A. Moments about A (so the unknown pin forces drop out): B_y(5) = 10(2) + 10(2.5) = 45, so B_y = 9 kN. Then ΣFy gives A_y = 20 − 9 = 11 kN, and 9 + 11 equals the total 20 kN applied load, which confirms the result.',
      },
      {
        kind: 'choice',
        prompt: 'A student replaces a triangular load (zero at the left end, w₀ at the right end of a beam of length L) by a single force. Which is correct?',
        options: [
          'R = w₀L acting at L/2',
          'R = w₀L/2 acting at L/2',
          'R = w₀L/2 acting at 2L/3 from the zero end',
          'R = w₀L/2 acting at L/3 from the zero end',
        ],
        correct: 2,
        explanation: 'The resultant equals the area of the load diagram, a triangle: ½·L·w₀. It acts at the triangle’s centroid, which lies one third of the base from the tall end, i.e. 2L/3 from the zero end. The first option treats it as a uniform load of the peak intensity; the second and fourth have the right size but the wrong place.',
      },
      {
        kind: 'numeric',
        prompt: 'A 4 m horizontal boom is pinned to a wall at one end. A cable attached to the tip runs up to the wall at 30° above the horizontal, and a 600 N weight hangs from the tip. What is the cable tension?',
        answer: 1200,
        unit: 'N',
        explanation: 'Take moments about the pin so the pin reactions vanish. The weight’s moment is 600 × 4 = 2400 N·m. The cable’s vertical component T sin 30° acts at the tip with the same 4 m arm: T(sin 30°)(4) = 2400, so T = 2400 / (4 × 0.5) = 1200 N — twice the weight, because the cable is at a shallow angle. Its horizontal component T cos 30° ≈ 1039 N is carried by the pin.',
      },
      {
        kind: 'choice',
        prompt: 'A horizontal beam is held by a pin at A and rollers at B and C (all on the same level). How many support reactions are there, and what does that mean for a statics-only solution?',
        options: [
          '3 reactions, so it is determinate',
          '4 reactions against 3 equations, so it is statically indeterminate',
          '5 reactions, so it is a mechanism',
          '4 reactions against 3 equations, so it is a mechanism',
        ],
        correct: 1,
        explanation: 'A pin supplies 2 reactions and each roller 1, so there are 2 + 1 + 1 = 4 unknowns. A planar rigid body gives only 3 independent equilibrium equations, so statics alone cannot find them all — the beam is statically indeterminate (one redundant) and its stiffness must be considered. A mechanism would have too few restraints, not too many.',
      },
      {
        kind: 'choice',
        prompt: 'Spot the error: “For the cantilever, I took moments about the free end, got M_wall = 0 and concluded that the wall exerts no moment.” What went wrong?',
        options: [
          'Nothing — moments about any point give the wall moment',
          'Moments about the free end include the wall’s vertical force times its lever arm; the wall moment is not zero, it is the reaction that balances that couple, so the equation must keep every term',
          'Moments cannot be taken about a free end',
          'The wall provides no moment, only forces',
        ],
        correct: 1,
        explanation: 'A fixed wall supplies a moment reaction in addition to the two forces. Taking moments about the tip is allowed, but the vertical wall reaction now has a lever arm equal to the cantilever length, so the equation is M_wall − R_y·L = 0 (for a tip load P, R_y = P), not M_wall = 0. Dropping a term is the error; the wall moment for a tip load P over length L is PL in magnitude.',
      },
      {
        kind: 'numeric',
        prompt: 'A cantilever of length 0.6 m is built into a wall and carries a 200 N weight at its free end. What is the magnitude of the moment reaction at the wall?',
        answer: 120,
        unit: 'N·m',
        explanation: 'Moment equilibrium about the wall: M_wall = P × L = 200 × 0.6 = 120 N·m, opposing the tendency of the weight to rotate the beam downward. The vertical reaction is 200 N. This is also the maximum bending moment in the beam, which is why wall connections get the heaviest sections.',
      },
    ],
  },

  'statics-truss': {
    intuition:
      'A truss is a skeleton of straight sticks pinned together so that no stick is ever asked to bend — each one only gets pulled or pushed along its length. That is why trusses are so light for the loads they carry: a slender rod is wonderful in tension and acceptable in short compression, but poor at resisting bending. Think of a bridge or crane jib as a deep beam in which the top and bottom flanges are replaced by chords and the web by diagonals; the chords form a force couple that resists the bending moment (one in tension, one in compression), and the diagonals carry the shear. Analysing a truss is just making sure every pin is in balance, one joint at a time, like checking every knot in a net.',
    derivation: [
      {
        text: 'Idealise: members are straight, joined by frictionless pins, and loads act only at joints. Then each member is a two-force member, so the force in it is purely axial, equal and opposite at its two ends. One unknown per member.',
      },
      {
        text: 'Each joint (a pin, treated as a particle) must satisfy force equilibrium. That gives 2 equations per joint in 2D:',
        latex: '\\sum F_x = 0, \\qquad \\sum F_y = 0 \\quad \\text{at every joint}',
      },
      {
        text: 'Count: with j joints there are 2j equations. With m member forces and r support reactions as unknowns, the problem has a unique solution when the counts match; fewer unknowns means a mechanism, more means redundant (indeterminate):',
        latex: 'm + r = 2j',
      },
      {
        text: 'Method of joints: assume every member is in tension, i.e. its force pulls the joint toward the member. Resolve along x and y with direction cosines (member run over length, rise over length). Start at a joint with at most two unknowns, solve, and carry the results to the next joint. A negative answer means compression.',
        latex: 'F_x = F\\,\\frac{\\Delta x}{L}, \\qquad F_y = F\\,\\frac{\\Delta y}{L}',
      },
      {
        text: 'Method of sections: cut the truss through at most three members whose forces are unknown, and apply the three equilibrium equations to one side. Taking moments about the point where two cut members meet isolates the third, with no need to work through the joints in between.',
        latex: '\\sum M_{\\text{joint}} = 0 \\text{ on the cut piece}',
      },
      {
        text: 'For a chord member in a truss of depth h, the other cut members have no moment about the opposite chord’s joint, so the chord force times h balances the external bending moment M at that section. Hence the bending moment is carried as a couple of chord forces, and the top chord in compression and bottom chord in tension for downward loads:',
        latex: 'F_{\\text{chord}} \\, h = M \\;\\Rightarrow\\; F_{\\text{chord}} \\approx \\frac{M}{h}',
      },
    ],
    commonMistakes: [
      'Applying a load or a support at a mid-member point. The pin-jointed idealisation breaks: the member would bend and no longer be a two-force member. Load joints only, or the member analysis is invalid.',
      'Mixing up the sign convention. Assume every member force is tension; then a negative result means compression. Flipping signs midway through a joint-by-joint solve leads to wrong answers downstream.',
      'Using the wrong geometry ratio. For a diagonal, the vertical component is F × (rise/length), not F × (rise/run). Using the run instead of the length is a classic error that gives a force that is far too big or small for steep or shallow members.',
      'Forgetting to find the support reactions first. Method of joints from a support needs the reactions, so solve the whole truss as a rigid body before cutting it up.',
      'Cutting through more than three unknown members in the method of sections. With four unknowns and only three equations you cannot isolate any of them; pick the cut again, or combine with joint equilibrium.',
      'Ignoring buckling. A truss member in compression can fail by buckling long before it yields, because the critical load scales with 1/L² (Euler). A slender compression diagonal is sized by buckling, not strength.',
    ],
    rulesOfThumb: [
      'Check determinacy before any algebra: m + r = 2j, e.g. a triangulated truss with 9 members, 3 reactions and 6 joints gives 12 = 12. A truss made only of rectangles is a mechanism and will collapse.',
      'The chord force scales as M/h, so doubling the depth roughly halves the chord forces; deeper trusses use less chord material but have longer diagonals and more joints.',
      'Zero-force members are useful for bracing. At an unloaded joint with only two non-collinear members, both members carry zero force; at an unloaded joint with three members, two of them collinear, the third carries zero force.',
      'Symmetric trusses under symmetric loads have symmetric member forces and equal reactions — use it as a free check on the arithmetic.',
      'Tension members can be slender; compression members are governed by buckling, so in practice the compression members in a truss are usually thicker or shorter.',
    ],
    designChecklist: [
      'Confirm the idealisation: straight members, pinned joints, loads and supports at joints only.',
      'Check determinacy with m + r = 2j and that the geometry is a stable (triangulated) arrangement.',
      'Solve for the support reactions by treating the whole truss as one rigid body.',
      'Identify any zero-force members to simplify the problem.',
      'Work through the joints starting from one with at most two unknowns, assuming tension and carrying signs forward.',
      'Verify the worst chord and diagonal with a section cut (F ≈ M/h) as an independent check.',
      'Size tension members for yield and net section, and compression members for buckling, then check the connection details.',
    ],
    prerequisites: [
      { courseId: 'engineering-statics', topicId: 'statics-equilibrium', why: 'Every joint and every cut is an equilibrium problem, and the reactions come from a whole-truss free-body diagram.' },
    ],
    videos: [
      {
        id: 'Hn_iozUo9m4',
        title: 'Understanding and Analysing Trusses',
        channel: EE,
        why: 'Covers truss analysis, which is exactly this topic: use it to compare the method of joints with the method of sections.',
      },
    ],
    quiz: [
      {
        kind: 'numeric',
        prompt: 'A simply supported planar truss with 3 support reactions has 9 joints. How many members does it need to be exactly statically determinate (m + r = 2j)?',
        answer: 15,
        explanation: 'm + r = 2j gives m = 2(9) − 3 = 15. With 15 members and 3 reactions there are 18 unknowns and 18 equations (two per joint). With fewer members it is a mechanism; with more it has redundants and cannot be solved by statics alone.',
      },
      {
        kind: 'numeric',
        prompt: 'A truss of span 12 m and depth 2 m carries a single 30 kN load at midspan (simply supported). Using the chord-force approximation F = M/h, what is the force in the top chord at midspan?',
        answer: 45,
        unit: 'kN',
        explanation: 'The midspan bending moment for a central point load is M = PL/4 = 30 × 12 / 4 = 90 kN·m. The two chords form a couple of arm h = 2 m, so F = M/h = 90 / 2 = 45 kN, compression in the top chord and tension in the bottom chord.',
      },
      {
        kind: 'numeric',
        prompt: 'A 50 kN weight hangs from a pin joint that is held by two identical members, one rising to the left and one to the right, each at 45° above the horizontal. What is the tension in each member?',
        answer: 35.36,
        unit: 'kN',
        explanation: 'By symmetry the horizontal components cancel and the two vertical components must balance the weight: 2T sin 45° = 50, so T = 50 / (2 × 0.7071) = 35.36 kN, tension. The members each carry more than half the weight because only part of their force is vertical; if they were flatter the force would grow rapidly, which is why shallow cables sag and fail so easily.',
      },
      {
        kind: 'choice',
        prompt: 'Spot the error: “In my method-of-joints calculation I assumed tension in every member and got F_BC = −18 kN, so I flipped it to +18 kN tension.” What is wrong?',
        options: [
          'Nothing — the sign of the result is arbitrary',
          'The magnitude is wrong; the force must be larger',
          'A negative result under the assume-tension convention means the member is in compression, so it should be reported as 18 kN compression',
          'The member must be a zero-force member',
        ],
        correct: 2,
        explanation: 'With every member assumed to pull on the joint, a negative result means the real force is opposite: the member pushes on the joint, i.e. it is in compression. Flipping the sign and calling it tension reverses the physical conclusion — and matters, because compression members must be checked for buckling.',
      },
      {
        kind: 'choice',
        prompt: 'At an unloaded joint, exactly two members meet and they are not collinear. What are their forces?',
        options: [
          'Equal and opposite',
          'Both zero',
          'Both equal to the support reaction',
          'One is zero, the other equals the load',
        ],
        correct: 1,
        explanation: 'With no external load or support at the joint, the forces from the two members must sum to zero. Two forces along different lines can only cancel if both are zero. The members can be removed or kept for bracing; they do not carry load for that loading case.',
      },
      {
        kind: 'numeric',
        prompt: 'A section cut gives an external bending moment of 120 kN·m at a truss of depth 2.5 m. What is the approximate chord force?',
        answer: 48,
        unit: 'kN',
        explanation: 'The chords carry the moment as a couple: F = M/h = 120 / 2.5 = 48 kN. Doubling the depth to 5 m would halve it to 24 kN, which is exactly why deep trusses suit long spans.',
      },
    ],
  },

  'statics-friction': {
    intuition:
      'Put a book on a tilted board and slowly raise it. For a while nothing happens: friction is not a fixed force but whatever is needed to stop the book moving, growing as the slope grows. At some angle it runs out of capacity and the book starts to slide. Dry friction is that limit — it can supply anything from zero up to μ times the normal force, and no more. Two surprises follow. First, friction depends on how hard the surfaces are pressed together, not on how big the contact area is. Second, the contact force on a body at the point of slipping tilts away from the surface normal by a fixed angle, the friction angle, which is what makes wedges stay in once driven. Wrap a rope around a post and the story compounds: every bit of wrap adds a bit of normal pressure, so the holding force multiplies exponentially with the angle turned.',
    derivation: [
      {
        text: 'Coulomb’s law: the tangential friction force F between two dry surfaces cannot exceed a fraction of the normal force N. At rest it is whatever equilibrium demands; at the point of slipping it saturates:',
        latex: 'F \\le \\mu_s N, \\qquad F = \\mu_s N \\text{ at impending slip}',
      },
      {
        text: 'At impending slip, the normal and friction forces combine into one resultant leaning from the normal by the friction angle:',
        latex: '\\tan\\varphi = \\frac{F}{N} = \\mu_s \\;\\Rightarrow\\; \\varphi = \\tan^{-1}\\mu_s',
      },
      {
        text: 'Block of weight W on an incline of angle α: resolve along and perpendicular to the slope. The normal force is N = W cos α and the down-slope pull is W sin α, so the block can sit with no push as long as the pull can be matched by friction at its limit:',
        latex: 'W\\sin\\alpha \\le \\mu_s W\\cos\\alpha \\;\\Rightarrow\\; \\tan\\alpha \\le \\mu_s',
      },
      {
        text: 'With a push P up the slope, the range of P that holds the block is bounded by friction acting down-slope (sliding up) or up-slope (sliding down):',
        latex: 'W(\\sin\\alpha - \\mu\\cos\\alpha) \\le P \\le W(\\sin\\alpha + \\mu\\cos\\alpha)',
      },
      {
        text: 'Wedges: treat the block and wedge as two bodies, put the resultant of friction and normal at angle φ from the normal on each face, and use force triangles. A wedge of angle θ lifting a guided load W needs a drive force P = W[tan(θ + φ) + tan φ] and stays in place when released if θ ≤ 2φ.',
        latex: 'P = W\\left[\\tan(\\theta+\\varphi) + \\tan\\varphi\\right]',
      },
      {
        text: 'Belt or rope friction: take a small element of rope subtending dβ with tension T on one side and T + dT on the other. The normal force on it is T dβ (for small angles), and friction at the limit is μ T dβ, so dT = μ T dβ. Integrating around the contact angle β gives the capstan equation:',
        latex: '\\frac{dT}{T} = \\mu\\,d\\beta \\;\\Rightarrow\\; \\frac{T_1}{T_2} = e^{\\mu\\beta}',
      },
    ],
    commonMistakes: [
      'Always writing F = μN. That is true only at impending slip. A block at rest has F equal to whatever equilibrium requires (e.g. W sin α on an incline), and it is generally less than μs N. Using the limit value when the block is not about to slip overstates friction.',
      'Using N = W on an incline or when the load is angled. N must come from the force balance perpendicular to the surface: N = W cos α on a slope, and for a pull at angle it changes with the vertical component of the pull.',
      'Mixing up static and kinetic friction. μs applies up to the instant of slip, μk (usually a bit smaller) once sliding; a problem that asks “what force starts motion” wants μs, and one that asks about steady sliding wants μk.',
      'Drawing friction in the wrong direction. Friction opposes the motion that would occur (or is impending) relative to the surface, not the applied force in general. For a block that might slide down, friction acts up the slope.',
      'Using degrees in the capstan equation. β must be in radians: 2π per full turn. With μ = 0.25 and 1.5 turns the exponent is 0.25 × 9.42, not 0.25 × 540.',
      'Believing contact area or post radius matters. Coulomb friction depends only on the normal force and μ; the capstan ratio does not depend on the post diameter, only on the angle of wrap, which is why a thin rope on a thin post holds as well as a wide one.',
    ],
    rulesOfThumb: [
      'Typical dry static friction coefficients: roughly 0.2–0.5 for steel on steel (dry), 0.5–0.7 for rubber on dry concrete, but values scatter widely with surface condition and contamination — always treat μ as an estimate and design with margin.',
      'A block on a slope slides when tan α > μs, so the angle of repose is atan μs: μ = 0.6 gives roughly 31°.',
      'Each full turn of rope multiplies holding force by e^{2πμ}; for μ ≈ 0.2 that is about 3.5 per turn, so three or four turns turn a hand pull into a very large holding force.',
      'A wedge is self-locking when its angle is no more than twice the friction angle (θ ≤ 2φ); a gentle taper stays put, a steep one pops out when the drive force is released.',
      'Friction can only resist, never drive. If your equilibrium requires friction greater than μN, the body slips — report that as slipping, not as a result.',
    ],
    designChecklist: [
      'Draw the free-body diagram with the normal force and a friction force whose direction you can justify.',
      'Decide whether the body is at rest, at impending slip, or sliding, and choose μs or μk accordingly.',
      'Find the normal force from equilibrium perpendicular to the surface.',
      'Write the friction force: unknown F ≤ μs N at rest, or F = μs N at impending slip.',
      'Solve for the unknown (force, angle, number of turns), and examine both extremes of motion (slip up and slip down) when the direction is uncertain.',
      'Check that the equilibrium requirement F ≤ μs N is satisfied — if not, the body is moving.',
      'Apply a design margin to μ, because contamination and wear can lower it substantially.',
    ],
    prerequisites: [
      { courseId: 'engineering-statics', topicId: 'statics-equilibrium', why: 'Friction problems are equilibrium problems with one extra, inequality-limited reaction.' },
    ],
    videos: [
      {
        id: 'mx7NYrUXDB0',
        title: 'Understanding Friction',
        channel: EE,
        why: 'A general introduction to friction, which fits the Coulomb model used on this page.',
      },
    ],
    quiz: [
      {
        kind: 'numeric',
        prompt: 'A block rests on an adjustable board. If μs = 0.6, at what incline angle does the block begin to slide?',
        answer: 30.96,
        unit: '°',
        explanation: 'Sliding begins when W sin α = μs W cos α, i.e. tan α = μs, so α = atan 0.6 = 30.96°. The weight cancels, so a heavier block starts to slip at exactly the same angle.',
      },
      {
        kind: 'numeric',
        prompt: 'A rope with μs = 0.2 is wrapped 2 full turns around a fixed post. What ratio T₁/T₂ of load tension to holding tension can be sustained at the verge of slipping?',
        answer: 12.35,
        explanation: 'The wrap angle is β = 2 × 2π = 12.566 rad. The capstan equation gives T₁/T₂ = e^(μβ) = e^(0.2 × 12.566) = e^2.513 = 12.35. A hand pulling 100 N could therefore hold about 1235 N; note the radians — using 720 for β would give an absurd result.',
      },
      {
        kind: 'choice',
        prompt: 'Spot the error: “A 100 N block sits at rest on a 15° incline with μs = 0.4. The friction force is μs N = 0.4 × 96.6 = 38.6 N up the slope.” What is wrong?',
        options: [
          'The normal force should be 100 N',
          'The block is at rest, so friction equals what equilibrium needs, W sin 15° = 25.9 N, which is below the 38.6 N limit',
          'Friction should act down the slope',
          'Nothing; friction always equals μs N',
        ],
        correct: 1,
        explanation: 'F = μs N is the maximum friction available, reached only at impending slip. The block is in equilibrium and tan 15° = 0.268 < 0.4, so friction only needs to equal the down-slope component W sin 15° = 25.9 N. Using 38.6 N would imply an unbalanced force pushing the block up the slope.',
      },
      {
        kind: 'numeric',
        prompt: 'A 50 kg crate sits on a level floor with μs = 0.4 and g = 9.81 m/s². It is pulled by a rope 20° above the horizontal. What pull force starts the crate sliding?',
        answer: 182.3,
        unit: 'N',
        explanation: 'Vertical balance: N = W − P sin 20°. Horizontal at impending slip: P cos 20° = μs N = μs(W − P sin 20°). Solving, P = μs W / (cos 20° + μs sin 20°) = 0.4 × 490.5 / (0.9397 + 0.1368) = 182.3 N. A horizontal pull would need 196.2 N; the angled pull helps because it reduces the normal force.',
      },
      {
        kind: 'choice',
        prompt: 'With μs = 0.2 (friction angle about 11.3°), which is the largest wedge angle from the list that is self-locking (θ ≤ 2φ)?',
        options: ['25°', '30°', '10°', '20°'],
        correct: 3,
        explanation: 'The self-locking limit is θ ≤ 2φ = 22.6°. Of the listed angles, 10° and 20° satisfy this, and the largest of those is 20°; 25° and 30° exceed the limit and would slide back out once the driving force is released.',
      },
      {
        kind: 'choice',
        prompt: 'A rope is wrapped around a fixed post. Which change does NOT change the holding force that can be developed (at the verge of slipping)?',
        options: [
          'Adding another half turn of rope',
          'Switching to a rougher rope (larger μ)',
          'Using a post with twice the diameter',
          'Reducing the wrap angle to half a turn',
        ],
        correct: 2,
        explanation: 'The capstan equation T₁/T₂ = e^(μβ) contains only μ and the wrap angle β. A larger post spreads the same contact over a longer arc but at lower pressure per length; the two effects cancel exactly, so post diameter does not appear. (Practical limits like rope bending stiffness are outside the model.)',
      },
    ],
  },

  'statics-centroids': {
    intuition:
      'Cut a shape from cardboard and balance it on a pencil tip: the balance point is its centroid. The second moment of area is a different, much more demanding idea: it measures how far the material is spread from a chosen axis, with distance counted twice. A ruler is easy to bend about its thin direction and very hard to bend about its wide one, though the amount of material is identical — the material farther from the bending axis does disproportionate work. That is why I-beams look the way they do: put the material in the flanges, far from the neutral axis, and keep the web thin. For composite shapes the recipe is always the same: split into simple pieces, locate the overall centroid by an area-weighted average, then shift each piece’s own stiffness to that centroid with the parallel-axis theorem, treating holes as negative material.',
    derivation: [
      {
        text: 'The centroid of an area is the average position weighted by area. For a composite of simple parts with areas A_i and centroid heights y_i measured from a common reference line, the integrals become sums:',
        latex: '\\bar y = \\frac{\\int y\\,dA}{\\int dA} = \\frac{\\sum A_i y_i}{\\sum A_i}',
      },
      {
        text: 'Holes and cut-outs are handled by assigning them a negative area (and negative moment of inertia), so the same formulas apply without special cases.',
      },
      {
        text: 'The second moment of area about an axis (here the x axis) weights each element of area by the square of its distance from that axis:',
        latex: 'I_x = \\int y^2\\,dA',
      },
      {
        text: 'For a rectangle of width b and height h about its own centroidal axis, integrate from −h/2 to h/2:',
        latex: '\\bar I = \\int_{-h/2}^{h/2} y^2\\, b\\,dy = \\frac{b h^3}{12}',
      },
      {
        text: 'Parallel-axis theorem: to move the axis a distance d from the centroid, write y = y_c + d. The cross-term ∫ y_c dA vanishes because y_c is measured from the centroid, leaving:',
        latex: 'I = \\int (y_c + d)^2 dA = \\bar I + A d^2',
      },
      {
        text: 'For a composite, shift each part from its own centroid to the composite centroid and add. The section modulus then converts I to the bending stress at the extreme fibre a distance c from the neutral axis:',
        latex: 'I = \\sum\\left(\\bar I_i + A_i d_i^2\\right), \\qquad S = \\frac{I}{c}, \\qquad \\sigma_{max} = \\frac{M}{S}',
      },
    ],
    commonMistakes: [
      'Forgetting the parallel-axis term. Adding up only each part’s own Ī_i ignores the dominant contribution from material far from the centroid; the A d² terms often make up most of I for flanged sections.',
      'Measuring d from the wrong place. d is the distance from each part’s own centroid to the composite centroid (the axis you want), not from the base line or from the part’s edge.',
      'Using the wrong dimension in bh³/12. h is the dimension perpendicular to the bending axis. Swapping b and h overstates or understates I by a factor of (h/b)², which can be very large for thin shapes.',
      'Adding I about different axes. All parts must be taken about one common parallel axis; I about a horizontal axis and I about a vertical axis are different quantities, and they cannot be mixed.',
      'Not subtracting holes (or subtracting the wrong thing). A hole contributes negative area at its own centroid and a negative Ī plus A d² — if the hole is not centred, its A d² term matters too.',
      'Mismatched units. I is length⁴: a result in mm⁴ must be converted by 10⁻¹² when you need m⁴, and for S the factor is 10⁻⁹ to m³. Mixing mm and m is the commonest source of stress errors a factor of 1000 off.',
    ],
    rulesOfThumb: [
      'Stiffness scales with depth cubed. Doubling the depth of a rectangular beam multiplies I by 8 and the section modulus S by 4, while the area only doubles.',
      'Orient it the right way: a 20 × 60 mm bar bent about the strong axis (60 mm depth) has I nine times greater than the same bar on its side, so a ruler on edge is far stiffer than flat.',
      'The centroid of a symmetrical shape lies on its axis of symmetry — use this to skip the calculation in one direction.',
      'For a quick I check on a flanged section, estimate I ≈ A_f × (h/2)² for two flanges of area A_f each separated by depth h and compare it against the full calculation.',
      'Hollow circular tubes put material where it is most effective in bending and torsion: a tube is far more efficient per kilogram than a solid bar of the same outer diameter.',
    ],
    designChecklist: [
      'Sketch the section and split it into simple shapes (rectangles, circles, triangles), treating holes as negative parts.',
      'Pick one reference line and tabulate each part’s area and centroid position from it.',
      'Compute the composite centroid with ȳ = ΣA_i y_i / ΣA_i (and x̄ if needed).',
      'Compute each part’s own Ī_i about its centroidal axis, with the dimension perpendicular to the bending axis cubed.',
      'Add the parallel-axis terms A_i d_i², with d_i measured to the composite centroid.',
      'Compute S = I/c for the top and bottom fibres separately if the section is not symmetric.',
      'Sanity-check against a bounding rectangle, and pass I and S on to the bending, deflection and buckling calculations.',
    ],
    prerequisites: [
      { courseId: 'engineering-statics', topicId: 'statics-equilibrium', why: 'The area-weighted centroid is the same idea as a resultant position: replace a distribution by one equivalent force or area.' },
      { courseId: 'mechanics-of-materials', topicId: 'bending-stress-beams', why: 'The I and S computed here feed directly into σ = Mc/I.' },
    ],
    quiz: [
      {
        kind: 'numeric',
        prompt: 'What is the second moment of area of a 60 mm wide × 120 mm deep rectangle about its horizontal centroidal axis (bending about the strong axis)?',
        answer: 8640000,
        unit: 'mm⁴',
        explanation: 'I = bh³/12 with h the depth perpendicular to the axis: 60 × 120³ / 12 = 60 × 1,728,000 / 12 = 8.64 × 10⁶ mm⁴. If you swapped b and h you would get 2.16 × 10⁶ mm⁴, four times smaller.',
      },
      {
        kind: 'numeric',
        prompt: 'A 100 mm wide × 20 mm thick flange has its centroid 50 mm from the neutral axis of a composite section. What is its contribution to I about that axis (own Ī plus parallel-axis term)?',
        answer: 5066667,
        unit: 'mm⁴',
        explanation: 'Own term: 100 × 20³ / 12 = 66,667 mm⁴. Shift: A d² = (100 × 20)(50)² = 2000 × 2500 = 5,000,000 mm⁴. The total is 5,066,667 mm⁴, about 98.7 % of it from the parallel-axis term, showing why material far from the axis dominates.',
      },
      {
        kind: 'numeric',
        prompt: 'An L-shaped section is a vertical leg 20 mm × 100 mm (area 2000 mm², centroid 50 mm above the base) and a horizontal base leg of area 1600 mm² whose centroid is 10 mm above the base. How high is the composite centroid above the base?',
        answer: 32.22,
        unit: 'mm',
        explanation: 'ȳ = ΣA_i y_i / ΣA_i = (2000 × 50 + 1600 × 10) / (2000 + 1600) = 116,000 / 3600 = 32.22 mm. The result sits between the two part centroids and nearer the one with more area, as an area-weighted average should.',
      },
      {
        kind: 'numeric',
        prompt: 'A square plate 100 mm × 100 mm has a centred 40 mm diameter hole. What is I about the central axis?',
        answer: 8207670,
        unit: 'mm⁴',
        explanation: 'Treat the hole as negative: I = 100⁴/12 − π × 40⁴/64 = 8,333,333 − 125,664 = 8.208 × 10⁶ mm⁴. The hole removes about 12.6 % of the area but only about 1.5 % of I, because it sits close to the axis where material contributes little. No parallel-axis term is needed because the hole is centred on the axis.',
      },
      {
        kind: 'choice',
        prompt: 'Spot the error: “For my T-section I computed the centroid, then added the Ī of the flange and the Ī of the web to get I.” What is missing?',
        options: [
          'Nothing; the Ī terms are sufficient',
          'The A d² parallel-axis term for each part, with d measured from the part centroid to the composite centroid',
          'The section modulus must be added',
          'The area of the section must be subtracted',
        ],
        correct: 1,
        explanation: 'Each Ī_i is about that part’s own centroid, but I is required about the composite centroid. The shift costs A_i d_i² for every part; in the T-section example the web and flange together contribute over 2.2 × 10⁶ mm⁴ from these terms alone, out of a total of 3.14 × 10⁶ mm⁴.',
      },
      {
        kind: 'choice',
        prompt: 'A rectangular beam’s depth is doubled while its width and the load stay the same. By what factor does the maximum bending stress σ = M/S change?',
        options: ['It halves', 'It falls to one eighth', 'It falls to one quarter', 'It is unchanged'],
        correct: 2,
        explanation: 'S = bh²/6, so doubling h multiplies S by 4 and cuts the stress to a quarter. (I rises by 8, but the extreme fibre moves out by 2, giving S × 4.) The deflection, which depends on 1/I, falls by a factor of 8.',
      },
    ],
  },
}
