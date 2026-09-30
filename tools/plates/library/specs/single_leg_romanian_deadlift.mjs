// Single-leg Romanian deadlift (one dumbbell, contralateral), side view, figure facing screen right.
// View: side (card plate.view). The hinge, the free leg in line with the back and the dumbbell in front of the
// standing leg are front-to-back positions (c3, c8). The card's top fault, the hip of the lifted leg rotating up
// (c5), is a rotation the engine cannot draw (no pelvis yaw/roll), so the Mistake draws the card's drawable fault
// (c7) and `pilot.drawableFault` raises flag F7.
// Sources: research card docs/research/howto/cards/single_leg_romanian_deadlift.json (card v2): claims c1-c3,
//  c7-c10, c16 (ace-sl-rdl, sl-sl-rdl, gentilcore-slrdl, acsm2009). Callouts = the card's 3 plate.checkpoints
//  (c8 Straight line, c10 Soft knee, c9 Mid-shin); Mistake = plate.mistake (c7); tempo = plate.tempo (c16: 2 s
//  down, 1 s up, 1 s balanced pause at the top).
// Geometry decisions (confirmed by the engine report `angles` and `checks`):
//  Stance leg = the figure's LEFT (far side, drawn lighter), so the free leg (near, right) sweeping back and the
//   dumbbell in the near right hand (opposite the stance leg, c1) are drawn bold. Stance mid-sole at world z = 0,
//   x = 9 cm (under the left hip joint), toes forward.
//  Stance knee (CARD c10, 15-20 deg): 17.5 deg (the middle of the range) in every key pose, proved by
//   measure.expect 17.5 (arc from the extended stance shin to the thigh, as the squat) and the report angles.
//  Hinge method (as barbell_back_squat key()): thorax inclination = pelvis tilt + lumbar flexion (spine near
//   neutral). Straight line (CARD c8): the free leg is IN LINE with the thorax: free hip flexion = -lumbar flexion
//   (report angles: hip.r -5 = -trunk 5), free knee 0 (c2: straighten the free leg), neck 0 (neutral, c8); ankle
//   left neutral (toes toward the floor): c2 "point the toes" gives no angle.
//  Both arms hang straight down under the shoulders (IK target straight below each shoulder at 99.8% of the arm,
//   c3: arm straight).
//  Balance (the key physical constraint): for every key pose the root is SOLVED so the whole-body centre of mass
//   (Winter 2009 Table 4.1 segment masses and COM positions: head-neck .081 at the ear, trunk .497 at mid
//   shoulder-hip, upper arm .028/.436, forearm .016/.430, hand .006, thigh .100/.433, shank .0465/.433, foot .0145)
//   plus the dumbbell (DB_MASS x body mass, at the grip) sits exactly over the stance mid-foot (z = 0), and the
//   root height gives the stance knee angle exactly. Verified in a scratch script (COM with dumbbell 0.0 cm).
//  Start (card plate.start): standing on the stance leg, trunk 2 deg forward; free foot just off the floor behind
//   (hip 5 deg extension, knee 45 deg; toe 2.7 cm up, `checks`).
//  End (CARD c9, dumbbell at about mid-shin): the trunk angle is SOLVED so the grip centre is at the height of the
//   mid-point of the stance shank (knee to ankle joint centres), proved by a `checks` plane at MID_SHIN (0.0 cm).
//   Result: thorax 86 deg from vertical (about horizontal) = pelvis 81 + lumbar 5. The dumbbell hangs 33 cm in
//   front of the stance knee (c3, `checks`). The trunk angle is not a card number; it follows from c9, c10.
//  One via pose (half the bottom trunk angle) solved the same way, so the traced dumbbell path stays balanced.
//  Mistake (c7 "rounding the back and shoulders ... lowering the DB too low"; handlingMistakes "reaching the
//   dumbbell to the floor and rounding"): stance leg, pelvis and free leg as in the correct bottom; shoulder blades
//   protract M_PRO (4 cm, illustrative: the card gives no number) and the lumbar spine flexes until the straight
//   arm puts the hex head on the floor 2 cm in front of the standing toes (solved: 45 deg). Guides: an arc-arrow
//   over the back (the upper body curling down) and an arrow from the correct dumbbell to the faulty one.
// CARD: KNEE (c10), dumbbell height (c9), free leg in line (c8, c2), dumbbell side and position (c1, c3); tempo (c16).
// Unsourced (not on the card, geometry choices above): DB_MASS 0.15 (only moves the balance solve), the start free
//  leg (hip -5, knee 45), the 5 deg lumbar flexion, the neutral free ankle.
import { landmarksOf } from '../engine.mjs';

const H = 1.75, R = Math.PI / 180;
const STANCE_X = 0.09;                                    // stance mid-sole lateral offset (under the left hip)
const REACH = (0.186 + 0.146 + 0.46 * 0.108) * H * 0.998; // shoulder to grip centre, arm straight (Winter)
const DB_MASS = 0.15;                                     // dumbbell mass as a fraction of body mass (~11 kg at 75 kg)
const KNEE = 17.5;                                        // CARD c10: standing knee about 15-20 deg, all rep
const START = { incl: 2, spine: 0, knee: KNEE, freeHip: -5, freeKnee: 45 };
const VIA = { spine: 3, knee: KNEE, freeHip: -3, freeKnee: 12 };
const END = { spine: 5, knee: KNEE, freeHip: -5, freeKnee: 0 };  // c8: freeHip = -spine (one line); c2: free leg straight
const stance = { l: { at: [STANCE_X, 0, 0], toe: [0, 0, 1] } };

// Whole-body centre of mass (Winter 2009 Table 4.1) plus extra point masses [[m, p], ...].
const L3 = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
function com(lm, extra = []) {
  const parts = [[0.081, lm.ear], [0.497, L3(lm.shoulders, lm.hips, 0.5)], ...extra];
  for (const s of ['l', 'r']) parts.push(
    [0.028, L3(lm[`shoulder.${s}`], lm[`elbow.${s}`], 0.436)], [0.016, L3(lm[`elbow.${s}`], lm[`wrist.${s}`], 0.430)], [0.006, lm[`grip.${s}`]],
    [0.100, L3(lm[`hip.${s}`], lm[`knee.${s}`], 0.433)], [0.0465, L3(lm[`knee.${s}`], lm[`ankle.${s}`], 0.433)], [0.0145, L3(lm[`heel.${s}`], lm[`toe.${s}`], 0.5)]);
  const M = parts.reduce((a, p) => a + p[0], 0);
  return [0, 1, 2].map(i => parts.reduce((a, p) => a + p[0] * p[1][i], 0) / M);
}
const kneeOf = lm => {
  const a = [0, 1, 2].map(i => lm['hip.l'][i] - lm['knee.l'][i]), b = [0, 1, 2].map(i => lm['ankle.l'][i] - lm['knee.l'][i]);
  return 180 - Math.acos((a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) / Math.hypot(...a) / Math.hypot(...b)) / R;
};
// Bracketed root finder (Illinois regula falsi): f(a) and f(b) must differ in sign.
const solve = (f, a, b) => {
  let fa = f(a), fb = f(b), side = 0;
  if (fa * fb > 0) throw new Error(`single_leg_romanian_deadlift: no solution in [${a}, ${b}]`);
  for (let i = 0; i < 60 && Math.abs(b - a) > 1e-7; i++) {
    const c = (a * fb - b * fa) / (fb - fa), fc = f(c);
    if (fc * fb > 0) { b = c; fb = fc; if (side === -1) fa /= 2; side = -1; } else if (fa * fc > 0) { a = c; fa = fc; if (side === 1) fb /= 2; side = 1; } else return c;
  }
  return (a + b) / 2;
};
// Arms hanging straight down: the shoulder landmarks do not depend on the arm angles, so solve them first.
const hang = lm => ({
  l: { at: [lm['shoulder.l'][0], lm['shoulder.l'][1] - REACH, lm['shoulder.l'][2]], pole: [0.2, 0, -1] },
  r: { at: [lm['shoulder.r'][0], lm['shoulder.r'][1] - REACH, lm['shoulder.r'][2]], pole: [-0.2, 0, -1] },
});
function key({ incl, spine, knee, freeHip, freeKnee }) {
  const body = (y, z) => ({ root: { at: [0, y, z], tilt: incl - spine }, trunk: spine, neck: 0,
    hip: { l: 0, r: freeHip }, knee: { l: 0, r: freeKnee }, ankle: { l: 0, r: 0 }, plant: stance });
  const hipY = z => solve(y => kneeOf(landmarksOf(body(y, z), H)) - knee, 0.6, 0.935);
  const full = (y, z) => { const b = body(y, z); return { ...b, reach: hang(landmarksOf(b, H)) }; };
  const comZ = z => { const lm = landmarksOf(full(hipY(z), z), H); return com(lm, [[DB_MASS, lm['grip.r']]])[2]; };
  const z = solve(comZ, -0.5, 0.3);
  return full(hipY(z), z);
}

// Mid-shin (CARD c9): the bottom trunk angle is SOLVED so the dumbbell (grip centre) sits at the height of the
// mid-point of the standing shank (knee to ankle joint centres).
const midShin = lm => (lm['knee.l'][1] + lm['ankle.l'][1]) / 2;
const END_INCL = solve(incl => { const lm = landmarksOf(key({ ...END, incl }), H); return lm['grip.r'][1] - midShin(lm); }, 50, 110);
const start = key(START), via = [key({ ...VIA, incl: END_INCL / 2 })], end = key({ ...END, incl: END_INCL });
const LE = landmarksOf(end, H), MID_SHIN = midShin(LE);

// Mistake (card plate.mistake, c7; drawable fault, see pilot): back and shoulders round as the dumbbell is reached
// toward the floor. Stance leg, pelvis and free leg stay as in the correct bottom; the shoulder blades protract
// M_PRO (illustrative: the card gives no number) and the lumbar spine flexes until the straight arm puts the
// dumbbell's hex head on the floor just in front of the standing toes (handlingMistakes: "reaching the dumbbell to
// the floor and rounding"). The 2 cm toe clearance only keeps the dumbbell off the foot.
const M_PRO = 4, M_FLOOR_GAP = 0.004, M_TOE_GAP = 0.02, HEX_R = 0.119 / 2;
const M_DB = [-landmarksOf(end, H)['shoulder.l'][0], HEX_R + M_FLOOR_GAP, landmarksOf(end, H)['toe.l'][2] + HEX_R + M_TOE_GAP];
const mistBody = spine => { const b = { ...end, trunk: spine, scap: { pro: M_PRO } }; delete b.reach; return b; };
const M_SPINE = solve(sp => { const S = landmarksOf(mistBody(sp), H)['shoulder.r']; return Math.hypot(S[0] - M_DB[0], S[1] - M_DB[1], S[2] - M_DB[2]) - REACH; }, END.spine, 80);
const ML = landmarksOf(mistBody(M_SPINE), H);
const mistakePose = { trunk: M_SPINE, scap: { pro: M_PRO }, reach: { ...hang(ML), r: { at: M_DB, pole: [-0.2, 0, -1] } } };

// Stance knee flexion arc (as the squat): from the shin extended past the knee to the thigh.
const SHANK_EXT = [LE['knee.l'][2] - LE['ankle.l'][2], LE['knee.l'][1] - LE['ankle.l'][1]];
const SHANK_LEN = Math.hypot(...SHANK_EXT);
const EXT = [LE['knee.l'][0], LE['knee.l'][1] + 0.25 * SHANK_EXT[1] / SHANK_LEN, LE['knee.l'][2] + 0.25 * SHANK_EXT[0] / SHANK_LEN];

// Dumbbell in the near right hand, handle across the body (pronated, x axis): the side view shows the hex end-on.
// Start dumbbell dashed (engine workaround as in the squat: the start layer never draws moving equipment).
const S0 = landmarksOf(start, H)['grip.r'];
const START_HEX = Array.from({ length: 7 }, (_, k) => [S0[0], S0[1] + HEX_R * Math.sin((k * 60 + 30) * R), S0[2] + HEX_R * Math.cos((k * 60 + 30) * R)]);
const floor = { point: [0, 0, 0], normal: [0, 1, 0] };

export default {
  id: 'single_leg_romanian_deadlift', name: 'Single-Leg Romanian Deadlift', view: 'side', facing: 'right',
  camera: { x0: 205, y0: 339 },                          // reference scale; the long hinge line (free foot to head) centred
  poses: { start, via, end },
  equipment: [
    { type: 'floor', from: -0.75, to: 0.75 },
    lm => ({ type: 'dumbbell', at: lm['grip.r'], axis: [1, 0, 0], part: 'db', z: 'front' }),
    (lm, ctx) => (ctx.pose === 'end' ? { type: 'line', cls: 'eq-cable m-line', pts: START_HEX, z: 'front', part: 'startdb' } : null),
  ],
  checks: [
    { landmark: 'heel.l', plane: floor, pose: 'all', tol: 0.5 },               // stance foot flat
    { landmark: 'ball.l', plane: floor, pose: 'all', tol: 0.5 },
    { landmark: 'toe.r', above: floor, pose: 'all' },                          // free foot off the floor
    { landmark: 'heel.r', above: floor, pose: 'all' },
    { landmark: 'grip.r', plane: { point: [0, MID_SHIN, 0], normal: [0, 1, 0] }, pose: 'end', tol: 0.5 }, // c9 mid-shin
    { landmark: 'grip.r', above: { point: LE['knee.l'], normal: [0, 0, 1] }, pose: 'end' },            // c3 in front of the leg
    { landmark: 'grip.r', above: { point: [0, HEX_R, 0], normal: [0, 1, 0] }, pose: 'mistake' },         // hex on, not in, the floor
  ],
  startParts: ['trunk', 'leg.r', 'arm.r'],
  ghosts: { count: 2, parts: ['trunk', 'leg.r', 'arm.r', 'db'] },
  trace: { point: 'grip.r', trim: [10, 12] },
  datum: [{ x: [0, 0, 0], from: 349, to: 60 }, { x: 0, from: 0, to: 0, line: ['knee.l', EXT], mistake: false }],
  measure: { vertex: 'knee.l', from: { dir: SHANK_EXT }, to: 'hip.l', radius: 38, title: 'Knee', value: 'about 15-20° bend', expect: KNEE, box: { left: 50, top: 150 } },
  callouts: [
    // c8
    { key: 'line', text: 'Straight<br>line', anchor: 'buttock', cue: 'Keep your head, back and free leg in one line, neck neutral.' },
    // c10
    { key: 'knee', text: 'Soft knee', anchor: { at: 'knee.l', off: [8, 0] }, cue: 'Keep your standing knee bent about 15-20 degrees, not locked.' },
    // c9
    { key: 'shin', text: 'Mid-shin', anchor: 'grip.r', cue: 'Stop the dumbbell at about mid-shin, in front of your standing leg.' },
  ],
  tempo: [{ phase: 'Lower', s: 2, move: true }, { phase: 'Stand', s: 1, move: true }, { phase: 'Balance', s: 1 }],   // c16
  mistake: {
    pose: mistakePose,
    guides: [
      { kind: 'arc-arrow', center: { at: 'lumbar', pose: 'mistake' }, r: 52, a0: -105, a1: -25 },
      { kind: 'arrow', from: { at: 'grip.r', pose: 'end' }, to: { at: 'grip.r', pose: 'mistake' } },
    ],
    tells: [
      // c7 (plate.mistake)
      { key: 'round', text: 'Back<br>rounds', anchor: 'backUpper', cue: 'The back and shoulders round as you reach down.' },
      // c7, c9 (handlingMistakes: reaching the dumbbell to the floor)
      { key: 'low', text: 'Dumbbell<br>too low', anchor: 'grip.r', cue: 'The dumbbell is reached to the floor, well past mid-shin.' },
    ],
  },
  pilot: { drawableFault: 'Top fault (hip of the lifted leg rotating up, c5) is a rotation the engine cannot draw; drawn: rounding while reaching too low (c7).' },
  alt: 'Single-leg Romanian deadlift, side view. Standing on the left leg with the knee bent about 15 to 20 degrees and a dumbbell in the right hand, the lifter pushes the hips back until the dumbbell is about mid-shin, head, back and right leg in one straight line.',
};
