// Battle ropes (alternating waves), side view, figure facing screen right, the anchor ahead off the plate. LIB-22
// (LB10, H; cycle: one half-cycle; tempo c9).
// View: side (card plate.view = census): the hands' shoulder-to-waist travel (c5), the soft knees and slight forward
//  lean (c2, c4) and the shoulder blades lifting or hunching forward (c6) are sagittal.
// Sources: research card docs/research/howto/cards/battle_ropes.json (research head 596dbe07): c1 feet hip-width, one
//  rope in each hand, some slack; c2 knees slightly bent, shoulders back; c3 right hand up first, the ropes opposite
//  one another; c4 (ACE) knees slightly bent, back straight, a slight forward lean, elbows extended; c5 (ACE) the
//  handles from about shoulder height to the waist, arms in front, opposite; c6 shoulder blades elevating or hunching
//  forward (the Mistake), down and back (right); c8 the rope 3.8 cm thick; c9 30 s on, 30 s off; c13 feet planted.
// Clone (D-LIB22-CLONE): romanian_deadlift (#109 @ dcac4a38: the hinge class: a straight back on a tilted pelvis, the
//  soft knee solve); lat_pulldown (the 8: the slight lean, :146); pull_up (the 8: the scapula offsets, :36); copied,
//  never imported.
// Sides (D-LIB22-SIDES): c3 names the right hand first and c5 puts the near hand at shoulder height at the start: the
//  near (right) hand starts up.
// Geometry (confirmed by the report's contacts and checks, and by tests on the drawn items):
//  Body (start = end, c13 "torso and legs unchanged"): feet flat, hip-width (FOOT_X), knees KNEE_SOFT (c2, c4); the
//   pelvis LEAN forward with a straight back (trunk 0, c4); the scapulae down and back (SCAP_DOWN, c6); the root's z
//   solved so the centre of mass sits over mid-foot (c1, c13 the feet).
//  Arms (c4 "elbows extended", c5): straight, in front; start: the near grip at the shoulder's height, the far grip at
//   the waist's (the navel's) height; end: swapped. Each shoulder angle is solved to its height; the engine blends the
//   angles, so the hands swing on arcs.
//  Ropes (eq/battleRope.mjs): from each fist to the plate edge (the anchor off the plate), the wave sized by WAVE_LEN,
//   the rest line at the hands' mid-height.
//  Mistake (c6): the scapulae elevate M_ELEV and protract M_PRO (pull_up.mjs:36's depressed and retracted 3 cm,
//   reversed); everything else as the end; the ropes follow the hands.
// Unsourced numbers (SIZES; lb10/sizes.json holds each with its basis): FOOT_X, KNEE_SOFT, LEAN, SCAP_DOWN, M_ELEV,
//  M_PRO, WAVE_LEN; solved: ROOT_Z, PHI_UP, PHI_DOWN, EDGE_Z (the plate edge in world z, from the camera).
import { landmarksOf, SIZE } from '../engine.mjs';
import { perItem } from '../eq/parts.mjs';
import { battleRope, BATTLE_ROPE_ITEMS } from '../eq/battleRope.mjs';

const H = 1.75, R = Math.PI / 180;
export const SIZES = Object.freeze({ FOOT_X: 0.10, KNEE_SOFT: 15, LEAN: 15, SCAP_DOWN: -3, M_ELEV: 3, M_PRO: 3, WAVE_LEN: 1.0 });
const { FOOT_X, KNEE_SOFT, LEAN, SCAP_DOWN, M_ELEV, M_PRO, WAVE_LEN } = SIZES;
export const bisect = (f, a, b, what) => {
  let fa = f(a), fb = f(b), side = 0;
  if (!(fa * fb <= 0)) throw new Error(`battle_ropes: no root for ${what} in [${a}, ${b}] (${fa}, ${fb})`);
  for (let i = 0; i < 80 && Math.abs(b - a) > 1e-8; i++) {
    const c = (a * fb - b * fa) / (fb - fa), fc = f(c);
    if (fc * fb > 0) { b = c; fb = fc; if (side === -1) fa /= 2; side = -1; } else if (fa * fc > 0) { a = c; fa = fc; if (side === 1) fb /= 2; side = 1; } else return c;
  }
  return (a + b) / 2;
};
const mid = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
/** Winter (2009) whole-body centre of mass (single_leg_romanian_deadlift.mjs:19-36 @ dcac4a38). */
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
const kneeOf = (lm, s) => {
  const a = [0, 1, 2].map(i => lm[`hip.${s}`][i] - lm[`knee.${s}`][i]), b = [0, 1, 2].map(i => lm[`ankle.${s}`][i] - lm[`knee.${s}`][i]);
  return 180 - Math.acos((a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) / Math.hypot(...a) / Math.hypot(...b)) / R;
};
const feet = { l: { at: [FOOT_X, 0, 0], normal: [0, 1, 0], toe: [0, 0, 1] }, r: { at: [-FOOT_X, 0, 0], normal: [0, 1, 0], toe: [0, 0, 1] } };
const arms = (near, far) => ({ shoulder: { r: { flex: near }, l: { flex: far } }, elbow: 0 });
const bodyAt = (y, z, a, scap = { elev: SCAP_DOWN, pro: SCAP_DOWN }) => ({ root: { at: [0, y, z], tilt: LEAN }, trunk: 0, neck: 0, scap, ...a, plant: feet });
// The arm angle (flexion on the thorax) that puts the straight arm's grip at height y.
const phiFor = (lm0, side, y, at) => bisect(p => landmarksOf(at(p), H)[`grip.${side}`][1] - y, 0, 120, `the ${side} arm`);
let Y = 0.9, Z = 0, PU = 70, PD = 30;
for (let i = 0; i < 5; i++) {
  Y = bisect(y => kneeOf(landmarksOf(bodyAt(y, Z, arms(PU, PD)), H), 'r') - KNEE_SOFT, 0.75, 0.95, 'the soft knee');
  const L0 = landmarksOf(bodyAt(Y, Z, arms(PU, PD)), H);
  PU = phiFor(L0, 'r', L0['shoulder.r'][1], p => bodyAt(Y, Z, arms(p, PD)));      // c5: the near handle at shoulder height
  PD = phiFor(L0, 'l', L0.navel[1], p => bodyAt(Y, Z, arms(PU, p)));             // c5: the far handle even with the waist
  Z = bisect(z => com(landmarksOf(bodyAt(Y, z, arms(PU, PD)), H))[2] - 0, -0.3, 0.3, 'the balance')   // over mid-foot (the soles at z 0);
}
export const ROOT_Z = Z, PHI_UP = PU, PHI_DOWN = PD;
const start = bodyAt(Y, Z, arms(PHI_UP, PHI_DOWN));
const end = bodyAt(Y, Z, arms(PHI_DOWN, PHI_UP));
// Mistake (c6): the shoulder blades elevate and hunch forward.
const mistake = { scap: { elev: M_ELEV, pro: M_PRO } };
const CAM = { x0: 110, y0: 339, pxPerM: 146.29 };
// The plate's right edge in world z (the rope runs on toward the anchor, off the plate).
export const EDGE_Z = (SIZE - CAM.x0) / CAM.pxPerM;
const ropes = lm => battleRope({ grips: { l: lm['grip.l'], r: lm['grip.r'] }, restY: (lm['grip.l'][1] + lm['grip.r'][1]) / 2, edgeZ: EDGE_Z, waveLen: WAVE_LEN });
// The hunch (c6 "hunch forward") is labelled on the Mistake's rounded upper back; the far upper arm (the first
// anchor tried) left no label place clear of "Shoulders lift" (PQ-H4).
const FLOOR = { point: [0, 0, 0], normal: [0, 1, 0] };
const LS = landmarksOf(start, H);
const START_ROPES = ropes(LS).map(it => ({ type: 'line', cls: 'eq-line m-line', pts: [...it.pts, it.pts[0]], z: 'back', part: 'startrope' }));
export default {
  id: 'battle_ropes', name: 'Battle Ropes', view: 'side', facing: 'right',
  camera: { x0: CAM.x0, y0: CAM.y0, pxPerM: CAM.pxPerM },
  poses: { start, end },
  // the start ropes redrawn dashed in the end pose (D-LIB22-DRAW); they lie along the end's far arm's rope
  equipment: [{ type: 'floor', from: -0.6, to: EDGE_Z + 0.2 }, ...perItem(lm => ropes(lm), BATTLE_ROPE_ITEMS),
    ...perItem((lm, ctx) => (ctx.pose === 'end' ? START_ROPES : null), BATTLE_ROPE_ITEMS)],
  checks: [
    ...['wrist.l', 'wrist.r'].map(landmark => ({ landmark, at: LS[landmark], pose: 'start', tol: 0.5 })),           // c1 fact: one rope in each hand
    ...['sole.l', 'sole.r'].flatMap(landmark => ['start', 'end'].map(pose => ({ landmark, plane: FLOOR, pose, tol: 0.5 }))),   // c13 fact (end): feet planted
    ...['heel.l', 'heel.r', 'ball.l', 'ball.r'].map(landmark => ({ landmark, plane: FLOOR, pose: 'all', tol: 0.5 })),   // c13: flat on the floor
  ],
  ghosts: { count: 2, parts: ['arm.r'] },
  tempo: [{ phase: 'Work', s: 30, move: true }, { phase: 'Rest', s: 30 }],
  trace: { point: 'grip.r', trim: [10, 12] },
  callouts: [
    { key: 'knees', text: 'Soft knees', anchor: 'knee.r', cue: 'Knees slightly bent, back straight, a slight forward lean.' },
    { key: 'down', text: 'Shoulders<br>down', anchor: 'backUpper', box: { left: 16, top: 84 }, cue: 'Shoulder blades down and back, not lifting or hunching.' },
    { key: 'travel', text: 'Shoulder<br>to waist', anchor: { at: 'grip.r', off: [-4, 0] }, box: { left: 208, top: 96 }, cue: 'Each hand travels between shoulder and waist height, opposite the other.' },
  ],
  mistake: {
    pose: mistake,
    tells: [
      { key: 'shrug', text: 'Shoulders lift', anchor: { at: 'shoulderTop.r', pose: 'mistake', off: [3, 0] }, box: { left: 176, top: 80 }, cue: 'The shoulder blades lift toward the ears.' },
      { key: 'hunch', text: 'Shoulders<br>hunch', anchor: { at: 'backUpper', pose: 'mistake' }, box: { left: 16, top: 56 }, cue: 'The shoulders round forward, straining the neck.' },
    ],
  },
  alt: 'Battle ropes, side view. Knees slightly bent, back straight with a slight forward lean, one rope end in each hand. The straight arms swing the ropes in opposite waves between shoulder and waist height.',
};
export const info = { Y, ROOT_Z, PHI_UP, PHI_DOWN, EDGE_Z, pose: Object.fromEntries([['start', start], ['end', end], ['mistake', { ...end, ...mistake }]].map(([k, p]) => { const lm = landmarksOf(p, H); return [k, { com: +com(lm)[2].toFixed(3), heel: +lm['heel.r'][2].toFixed(3), toe: +lm['toe.r'][2].toFixed(3) }]; })) };
