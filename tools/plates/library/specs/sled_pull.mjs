// Sled pull (backward drag with a rope), side view, figure facing screen right, the sled in front. LIB-22 (LB10, H;
// NOSECS lifted at 'LIB-22 resume': the strip word tempo).
// View: side (card plate.view = census): the quarter squat, the shoulders over the hips, the step back and the torso
//  pitching back are sagittal (plate.viewWhy).
// Sources: research card docs/research/howto/cards/sled_pull.json (research head 596dbe07): c1 facing the sled, the rope
//  gripped firmly in both hands, one stacked over the other, arms slightly bent, light tension; c2 feet shoulder-width,
//  quarter squat, knees soft, chest up, shoulders over the hips; c3 step back one foot at a time, short, quick,
//  controlled steps, driving through the midfoot, the rope close to the body; c4 feed the rope through the hands,
//  elbows tucked; c5 the rope piles up near the feet; c8 the torso pitched back, the lower back taking the load (the
//  Mistake). plate.frames: one step, "the rear foot stepped back with the sled a little closer; Trace follows the
//  stepping foot". Tempo: Walk "Quick" (D-STRIP-B; strip/rows.json, c3).
// Clone (D-LIB22-CLONE): seated_cable_row (the 8: the rope line to the hands; the rock-back Mistake), romanian_deadlift
//  and barbell_row (#109: the hinge, KNEE 15), mountain_climbers (#109: one step of the cycle, the via ghost,
//  FOOT_CLEAR), single_leg_romanian_deadlift (#109: the Winter centre of mass); copied, never imported.
// Geometry (confirmed by the report's contacts and checks, and by tests on the drawn items):
//  Feet: flat (ref 'mid'), FOOT_X out each side, toes forward: the widest stance whose rigid-foot plant keeps every
//   report contact within 0.5 cm (c2 "shoulder-width"; D-LIB22-STANCE as corrected). The hips keep one height HIP_Y in
//   start, via and end (solved: the stepped-back knee KNEE_SOFT short of straight in the end, the straightest knee of
//   the step), so the hands and the rope keep theirs; the start knees then bend about 29 deg (c2 "quarter-squat,
//   keeping your knees soft"). Trunk upright (tilt 0, spine and neck neutral: c2 "chest up", "shoulders over hips").
//   Each pose's root z puts the Winter centre of mass over the soles' midpoint (the feet are the base, c2; the rope's
//   light tension, c1, is not counted).
//  Hands (c1): both fists on the one rope at the midline (x 0), each arm ELBOW_BEND short of straight (c1 "arms
//   slightly bent"), so each fist lies on its shoulder's circle in the side plane: the near fist at the hips' height
//   (c3 "the rope close to your body"), the far fist GRIP_GAP (fists touching) below and behind it on the same circle
//   (c1 "one stacked over the other"). The rope (main's eq/rope.mjs strandOutline) runs from the sled's hitch ring into
//   the upper fist, down to the lower fist, and on to a short coil on the floor (plate.equipment, c5) centred under the
//   start's lower fist, so the start tail hangs plumb onto it.
//  End (plate.frames, c3): the near foot stepped STEP straight back (its toe at the far heel: the shortest step that
//   sets it wholly behind) and planted flat (c3 "driving through your midfoot"); arms and trunk unchanged (c2).
//  The drag (#305 6355155831 Q9): the sled's rear edge sits at SLED_Z plus the hips' z change on the drawn landmarks,
//   so the sled moves by the hips' displacement (DRAG) and the rope's run keeps its length (ROPE_RUN) and light
//   tension; the start sled and rope are redrawn dashed in the end pose (not in the Mistake view). A via ghost carries
//   the stepping foot flat, FOOT_CLEAR off the floor (mountain_climbers.mjs:49).
//  Mistake (c8): the pelvis tilts back M_TILT and the low back arches M_ARCH (hanging_leg_raise.mjs:69's approved lean
//   and arch). The sled stays where the end left it (c8 "When the pull becomes too heavy"), the taut rope keeps its run
//   and both arms keep their end direction in space, so the hips sag forward and down (c8 "don't let your hips sag":
//   M_Z, M_Y solved) until the upper fist is back on the rope's run, the stepped-back knee kept at KNEE_SOFT.
// Unsourced numbers (SIZES; lb10/sizes.json holds each with its basis): PX_PER_M, FOOT_X, KNEE_SOFT, ELBOW_BEND,
//  GRIP_GAP, SLED_Z, FOOT_CLEAR, COIL_D, COIL_TURNS, ROPE_T, ROPE_SAG, M_TILT, M_ARCH; solved: STEP, HIP_Y, DRAG,
//  ROPE_RUN, M_Z, M_Y.
import { landmarksOf, WINTER, REF } from '../engine.mjs';
import { perItem } from '../eq/parts.mjs';
import { sled, SLED, SLED_ITEMS } from '../eq/sled.mjs';
import { strandOutline } from '../eq/rope.mjs';

const H = 1.75, R = Math.PI / 180;
export const SIZES = Object.freeze({ PX_PER_M: 126, FOOT_X: 0.145, KNEE_SOFT: 15, ELBOW_BEND: 18, GRIP_GAP: 0.07, SLED_Z: 0.9, FOOT_CLEAR: 0.025,
  COIL_D: 0.266, COIL_TURNS: 3, ROPE_T: 0.028, ROPE_SAG: 0.006, M_TILT: -14, M_ARCH: -12, LOOP_H: 0.044, LOOP_DZ: 0.05, TAIL_SAG: 0.04 });
const { FOOT_X, KNEE_SOFT, ELBOW_BEND, GRIP_GAP, SLED_Z, FOOT_CLEAR, COIL_D, COIL_TURNS, ROPE_T, ROPE_SAG, M_TILT, M_ARCH, LOOP_H, LOOP_DZ, TAIL_SAG } = SIZES;

export const bisect = (f, a, b, what) => {
  let fa = f(a), fb = f(b), side = 0;
  if (!(fa * fb <= 0)) throw new Error(`sled_pull: no root for ${what} in [${a}, ${b}] (${fa}, ${fb})`);
  for (let i = 0; i < 80 && Math.abs(b - a) > 1e-8; i++) {
    const c = (a * fb - b * fa) / (fb - fa), fc = f(c);
    if (fc * fb > 0) { b = c; fb = fc; if (side === -1) fa /= 2; side = -1; } else if (fa * fc > 0) { a = c; fa = fc; if (side === 1) fb /= 2; side = 1; } else return c;
  }
  return (a + b) / 2;
};
const v3 = { sub: (a, b) => a.map((x, i) => x - b[i]), add: (a, b) => a.map((x, i) => x + b[i]), mul: (a, k) => a.map(x => x * k) };
const unit = a => { const L = Math.hypot(...a); return a.map(x => x / L); };
const mid = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
const kneeOf = (lm, s) => {
  const a = [0, 1, 2].map(i => lm[`hip.${s}`][i] - lm[`knee.${s}`][i]), b = [0, 1, 2].map(i => lm[`ankle.${s}`][i] - lm[`knee.${s}`][i]);
  return 180 - Math.acos((a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) / Math.hypot(...a) / Math.hypot(...b)) / R;
};
/** Winter (2009) whole-body centre of mass on the drawn landmarks (single_leg_romanian_deadlift.mjs:19-36 @ dcac4a38). */
export function com(lm) {
  let m = 0; const c = [0, 0, 0];
  const seg = (w, p) => { m += w; for (let i = 0; i < 3; i++) c[i] += w * p[i]; };
  seg(0.081, lm.ear); seg(0.497, mid(lm.shoulders, lm.hips, 0.5));
  for (const s of ['l', 'r']) {
    seg(0.028, mid(lm[`shoulder.${s}`], lm[`elbow.${s}`], 0.436)); seg(0.016, mid(lm[`elbow.${s}`], lm[`wrist.${s}`], 0.430)); seg(0.006, lm[`grip.${s}`]);
    seg(0.100, mid(lm[`hip.${s}`], lm[`knee.${s}`], 0.433)); seg(0.0465, mid(lm[`knee.${s}`], lm[`ankle.${s}`], 0.433)); seg(0.0145, mid(lm[`heel.${s}`], lm[`toe.${s}`], 0.5));
  }
  return c.map(v => v / m);
}

// c3 "short" step: the stepping foot's toe set at the stance heel, the shortest step that puts it wholly behind
// (heel landmark to toe landmark, body.mjs:25, :155-156).
export const STEP = (REF.toe - (REF.heel + 0.008)) * H;
const flat = (x, z, y = 0) => ({ at: [x, y, z], ref: 'mid' });
const FEET = { start: { l: flat(FOOT_X, 0), r: flat(-FOOT_X, 0) }, end: { l: flat(FOOT_X, 0), r: flat(-FOOT_X, -STEP) } };
// The near arm's shoulder-to-grip reach at ELBOW_BEND (wrist straight; the engine's two-bone lengths, body.mjs:206-209).
const L1 = WINTER.upperArm * H, L2 = (WINTER.forearm + REF.gripOff) * H;
const REACH = Math.sqrt(L1 * L1 + L2 * L2 + 2 * L1 * L2 * Math.cos(ELBOW_BEND * R));
// The sled's hitch ring (eq/sled.mjs pull form): centre on the rear edge, above the hitch bracket. The rope leaves the
// ring toward the upper fist.
const RING_Y = SLED.bodyY + SLED.bodyT / 2 + SLED.hitchH + SLED.ringR;
const ringAt = rearZ => [0, RING_Y, rearZ];
const hitchOf = (front, rearZ) => { const c = ringAt(rearZ); return v3.add(c, v3.mul(unit(v3.sub(front, c)), SLED.ringR)); };
const POLE = { l: [0, -1, -0.4], r: [0, -1, -0.4] };   // c4 "elbows tucked": the elbows down and back, the bend in the side plane
// The hands (c1): both fists on the one rope at the body's midline (x 0), each arm ELBOW_BEND short of straight, so
// each fist lies on its shoulder's circle of REACH in the side plane. The near fist at the hips' height (c3 "the rope
// close to your body"); the far fist GRIP_GAP below and behind it on the same circle ("one stacked over the other"):
// the rope runs from the hitch into the upper fist, down through the lower one, and on to the coil.
const gripsAt = lm => {
  const S = lm['shoulder.r'], r = Math.sqrt(REACH ** 2 - S[0] ** 2), phi = Math.acos((S[1] - lm.hips[1]) / r), dphi = 2 * Math.asin(GRIP_GAP / 2 / r);
  const at = a => [0, S[1] - r * Math.cos(a), S[2] + r * Math.sin(a)];
  return { r: { at: at(phi), pole: POLE.r }, l: { at: at(phi - dphi), pole: POLE.l } };
};

const bodyAt = (y, z, feet) => ({ root: { at: [0, y, z], tilt: 0 }, trunk: 0, neck: 0, plant: feet });
// The root's z in a pose: the centre of mass over the soles' midpoint (the feet are the base, c2; the rope's light
// tension, c1, is not counted).
const balanced = (y, feet, zc) => bisect(z => com(landmarksOf(bodyAt(y, z, feet), H))[2] - zc, -0.6, 0.4, 'balance');
// The hips keep one height through the step, so the hands and the rope keep theirs (Q9): the height at which the
// stepped-back leg, the straighter knee of the cycle, is KNEE_SOFT short of straight in the end (c2 "knees soft").
export const HIP_Y = bisect(y => kneeOf(landmarksOf(bodyAt(y, balanced(y, FEET.end, -STEP / 2), FEET.end), H), 'r') - KNEE_SOFT, 0.7, 0.93, 'hip height');
const START_Z = balanced(HIP_Y, FEET.start, 0), END_Z = balanced(HIP_Y, FEET.end, -STEP / 2);
const withHands = p => ({ ...p, reach: gripsAt(landmarksOf(p, H)) });
const start = withHands(bodyAt(HIP_Y, START_Z, FEET.start));
const end = withHands(bodyAt(HIP_Y, END_Z, FEET.end));
// The drag (Q9): the sled follows the hips' displacement.
export const DRAG = END_Z - START_Z;
// The Mistake is drawn against the end, with the sled where the end left it (static from the end on).
const sledZ = (lm, ctx) => SLED_Z + ((ctx.pose === 'mistake' ? END_Z : lm.hips[2]) - ctx.start.hips[2]);
// The rope's landmarks: the Mistake keeps the end's (its fists hold the end's grips; the rope does not move).
const ropeLm = (lm, ctx) => (ctx.pose === 'mistake' ? landmarksOf(end, H) : lm);
// Via (a ghost): halfway, the stepping foot flat and FOOT_CLEAR off the floor (mountain_climbers.mjs:49).
const via = [withHands(bodyAt(HIP_Y, (START_Z + END_Z) / 2, { l: FEET.start.l, r: flat(-FOOT_X, -STEP / 2, FOOT_CLEAR) }))];
// The rope's run, hitch to the upper fist (constant by the drag).
export const runOf = (lm, rearZ) => Math.hypot(...v3.sub(lm['grip.r'], hitchOf(lm['grip.r'], rearZ)));
export const ROPE_RUN = runOf(landmarksOf(start, H), SLED_Z);
// Mistake (c8; #331 panel mx2 item 1): only the body pitches back, pelvis M_TILT and lumbar M_ARCH. The sled, the rope,
// the coil and both fists stay exactly where the end has them (the heavy sled holds; c8 "When the pull becomes too
// heavy"), so the fists keep the end's grips by reach, each arm ELBOW_BEND short of straight as in the end (the near
// shoulder REACH from its fist). The hips go forward and down (c8 "don't let your hips sag": M_Z and M_Y, solved) and
// the shoulders back, the stepped-back knee kept at KNEE_SOFT.
const EZ = SLED_Z + DRAG;
const mBody = (y, z) => ({ root: { at: [0, y, z], tilt: M_TILT }, trunk: M_ARCH, neck: 0 });
const mLm = (y, z) => landmarksOf({ ...end, ...mBody(y, z) }, H);
const mY = z => bisect(y => kneeOf(mLm(y, z), 'r') - KNEE_SOFT, 0.5, HIP_Y + 0.05, 'the Mistake height');
const LE0 = landmarksOf(end, H);
export const M_Z = bisect(z => Math.hypot(...v3.sub(mLm(mY(z), z)['shoulder.r'], LE0['grip.r'])) - REACH, END_Z - 0.1, END_Z + 0.3, 'the Mistake root');
export const M_Y = mY(M_Z);
const mistake = { ...mBody(M_Y, M_Z), reach: end.reach };

// Rope items (main's eq/rope.mjs strandOutline, unedited): the run from the hitch into the upper fist, the short link
// down to the lower fist, and the slack tail from it, hanging in a soft curve (TAIL_SAG) onto the coil; the coil is
// COIL_TURNS flattened rope loops lying on the floor, overlapping (plate.equipment "a short coil of rope at the feet", c5
// "the rope piles up near your feet"; #331 panel mx2 item 3), centred under the start's lower fist, so the start tail
// hangs onto it; the pile lies still while the lifter steps back.
const COIL_Z = landmarksOf(start, H)['grip.l'][2], COIL_TOP = [0, LOOP_H, COIL_Z];
const strand = (from, to, sag = ROPE_SAG) => strandOutline({ from, grip: to, dir: unit(v3.sub(to, from)), below: 0, thick: ROPE_T, knob: ROPE_T, knobLen: 0.002, sag, view: 'side' });
const ropeItems = (lm, rearZ) => [[hitchOf(lm['grip.r'], rearZ), lm['grip.r']], [lm['grip.r'], lm['grip.l']], [lm['grip.l'], COIL_TOP, TAIL_SAG]]
  .map(([a, b, sag]) => ({ type: 'poly', curve: true, cls: 'eq-solid', z: 'mid', part: 'rope', pts: strand(a, b, sag) }));
// One loop: a flattened ring of rope (outer ellipse COIL_D by LOOP_H, the band ROPE_T wide at its ends and half that at
// its top and bottom, as a loop lying on the floor reads from a low side view), one closed outline: the outer ellipse,
// then the inner one back the other way, joined at the loop's far end.
const coil = () => Array.from({ length: COIL_TURNS }, (_, k) => {
  const zc = COIL_Z + (k - (COIL_TURNS - 1) / 2) * LOOP_DZ, a = COIL_D / 2, b = LOOP_H / 2, n = 32;
  const ell = (ea, eb, rev) => Array.from({ length: n + 1 }, (_, i) => { const t = (rev ? n - i : i) / n * 2 * Math.PI; return [0, b + eb * Math.sin(t), zc + ea * Math.cos(t)]; });
  return { type: 'poly', cls: 'eq-solid', z: 'mid', part: 'coil', pts: [...ell(a, b, false), ...ell(a - ROPE_T, b - ROPE_T / 2, true)] };
});
// The start sled and rope, redrawn dashed in the end pose (D-LIB22-DRAW): each part's closed outline. Not in the
// Mistake view, where a dashed red outline marks the fault.
const outline = it => (it.pts ? [...it.pts, it.pts[0]] : (() => {   // a sideBar (backPad surface [hi, lo], t): its rectangle
  const [hi, lo] = it.surface, u = unit(v3.sub(hi, lo)), n = unit([0, -u[2], u[1]]), o = v3.mul(n, it.t);
  return [lo, hi, v3.sub(hi, o), v3.sub(lo, o), lo];
})());
const LS = landmarksOf(start, H), LE = landmarksOf(end, H);
const START_SLED = sled({ rearZ: SLED_Z, form: 'pull' }).map(it => ({ type: 'line', cls: 'eq-line m-line', pts: outline(it), z: 'back', part: 'startsled' }));
const START_ROPE = ropeItems(LS, SLED_Z).map(it => ({ type: 'line', cls: 'eq-line m-line', pts: [...it.pts, it.pts[0]], z: 'back', part: 'startrope' }));

const FLOOR = { point: [0, 0, 0], normal: [0, 1, 0] };
export default {
  id: 'sled_pull', name: 'Sled Pull', view: 'side', facing: 'right',
  camera: { pxPerM: SIZES.PX_PER_M, x0: 145, y0: 339 },
  poses: { start, via, end },
  equipment: [{ type: 'floor', from: -1.0, to: SLED_Z + SLED.len + 0.1 },   // the floor runs on under the whole start sled
    ...perItem((lm, ctx) => sled({ rearZ: sledZ(lm, ctx), form: 'pull' }), SLED_ITEMS),
    ...perItem((lm, ctx) => ropeItems(ropeLm(lm, ctx), sledZ(lm, ctx)), 3),
    ...perItem(() => coil(), COIL_TURNS),
    ...perItem((lm, ctx) => (ctx.pose === 'end' && !ctx.mistake ? [...START_SLED, ...START_ROPE] : null), START_SLED.length + START_ROPE.length)],
  checks: [
    ...['wrist.l', 'wrist.r'].map(landmark => ({ landmark, at: LS[landmark], pose: 'start', tol: 0.5 })),   // c1 fact: both hands on the rope
    ...['wrist.l', 'wrist.r'].map(landmark => ({ landmark, at: LE[landmark], pose: 'end', tol: 0.5 })),     // c4 fact: the rope through both hands
    ...['sole.l', 'sole.r'].map(landmark => ({ landmark, plane: FLOOR, pose: 'start', tol: 1 })),         // c2 facts: feet planted shoulder-width
    { landmark: 'sole.r', plane: FLOOR, pose: 'end', tol: 1 },                                              // c3 fact: driving through the midfoot
    ...['heel.l', 'heel.r', 'ball.l', 'ball.r'].map(landmark => ({ landmark, plane: FLOOR, pose: 'all', tol: 0.5 })),   // flat feet
    ...[['start', LS], ['end', LE]].map(([pose, L]) => ({ landmark: 'shoulder.r', plane: { point: L.hips, normal: [0, 0, 1] }, pose, tol: 1 })),   // c2: shoulders over the hips
  ],
  ghosts: { count: 1, parts: ['leg.r'] },
  trace: { point: 'ball.r', trim: [10, 12] },
  callouts: [
    { key: 'squat', text: 'Quarter<br>squat', anchor: 'knee.r', box: { left: 24, top: 240 }, cue: 'Knees soft in a quarter squat, chest up, core braced.' },
    { key: 'stack', text: 'Shoulders<br>over hips', anchor: 'backUpper', box: { left: 24, top: 144 }, cue: 'Keep your shoulders over your hips, not leaning far back.' },
    { key: 'steps', text: 'Short<br>steps<br>back', anchor: 'heel.r', box: { left: 8, top: 288 }, cue: 'Short, quick steps back, driving through the midfoot.' },
  ],
  mistake: {
    pose: mistake,
    // no guide: a plumb line from the faulty hips lies inside the solid figure (hidden, #305 6356763967 item 8), and an
    // arrow between the two heads cannot clear the solid head by 6 px; the red outline carries the lean
    guides: [],
    tells: [
      { key: 'lean', text: 'Torso<br>pitched<br>back', anchor: { at: 'backUpper', pose: 'mistake', off: [-5, -12] }, box: { left: 8, top: 136 }, cue: 'The torso pitches back and the lower back takes the load.' },
      { key: 'stack', text: 'Shoulders<br>behind<br>hips', anchor: { at: 'backUpper', pose: 'mistake' }, box: { left: 8, top: 208 }, cue: 'The shoulders are no longer over the hips, leaning too far back.' },
    ],
  },
  tempo: [{ phase: 'Walk', move: true, word: 'Quick' }],   // D-STRIP-B untimed (lb10/tempo.json = strip/rows.json's row; tempoOf)
  zoom: { view: 'normal', k: 3 },   // D-LIBZOOM-EXTEND (lib4-cards §41; DESIGN.md §21): the stepping foot's path (ball.r), 26.3 px at k 1.5 (bar at the zoom's scale)
  alt: 'Sled pull, side view. Facing the sled in a quarter squat, shoulders over the hips, both hands one behind the other on the rope from the sled. One foot steps straight back and the sled follows by the same distance. A short coil of rope lies at the feet.',
};
export const info = { START_Z, END_Z, HIP_Y, DRAG, ROPE_RUN, STEP, M_Z, M_Y, REACH,
  pose: Object.fromEntries([['start', start], ['via', via[0]], ['end', end], ['mistake', { ...end, ...mistake }]].map(([k, p]) => { const l = landmarksOf(p, H);
    return [k, { com: +com(l)[2].toFixed(3), heelR: +l['heel.r'][2].toFixed(3), heelL: +l['heel.l'][2].toFixed(3), toeR: +l['toe.r'][2].toFixed(3), toeL: +l['toe.l'][2].toFixed(3),
      kneeL: +kneeOf(l, 'l').toFixed(1), kneeR: +kneeOf(l, 'r').toFixed(1), hips: l.hips.map(v => +v.toFixed(3)), gripR: l['grip.r'].map(v => +v.toFixed(3)), gripL: l['grip.l'].map(v => +v.toFixed(3)) }]; })) };
