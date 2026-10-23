// Jump rope (basic bounce), FRONT view. LIB-22 (LB10, H; held: D-LIB8-shrug, the card-true hop's Trace is under
// traceLenMin; route LIB-ZOOM).
// View: front (card plate.view = census): the hands by the hips, the elbows in and the rope over the head and under
//  the feet are frontal; the hop height shows as the gap under the soles. Sagittal signs (the knees' slight bend, c10)
//  cannot show in this view (D-LIB22-FRONT, S4): the knees are drawn at KNEE_SOFT, and no test pretends it shows.
// Sources: research card docs/research/howto/cards/jump_rope.json (research head 596dbe07): c1 rope sizing (the handle
//  ends at the armpits standing on its middle); c2 a relaxed grip toward the handle ends; c4 feet together, the rope
//  swung overhead; c5 elbows in by the ribs, the wrists turn the rope; c8 hands at about hip height, slightly away;
//  c9 the hop 1 to 2 inches, just clearing the rope; c10 knees slightly bent; c16 30 s of work, 1 minute of rest.
// Clone (D-LIB22-CLONE): upright_row (#109 @ dcac4a38: the engine front view and its stance), box_jump (#109: the
//  airborne frame with a free root); copied, never imported.
// Geometry (confirmed by the report's contacts and checks, and by tests on the drawn items):
//  Start: standing, feet together (FOOT_X), knees KNEE_SOFT; the hands at hip height HAND_OUT out and HAND_FWD in front
//   of the hip joints, the elbows in (IK pole back); the rope over the head (plate.frames).
//  End (c9, D-LIB22-AIRBORNE): the same body lifted HOP by root.at (the legs as joint angles, box_jump's method), the
//   rope under the soles, its lowest point just over the floor. A mid-air frame, as the card's plate.end states.
//  Mistake (c9): the same body lifted M_HOP; the rope stays under the feet, far below them.
//  The rope (eq/jumpRope.mjs) is one `poly` strand from handle tip to handle tip; its length is c1's (ROPE_LEN), and
//   the overhead arc's width is solved so the drawn arc is that long (a projection is never longer than the rope);
//   under the feet the arc is shorter (the rope's loop then turns out of the frontal plane).
// Unsourced numbers (SIZES; lb10/sizes.json holds each with its basis): FOOT_X, KNEE_SOFT, HOP, M_HOP, HAND_OUT,
//  HAND_FWD, OVER_CLEAR, UNDER_W, FLOOR_GAP; solved: ROPE_LEN, OVER_W.
import { landmarksOf, RADII, normPose, resolve } from '../engine.mjs';
import { perItem } from '../eq/parts.mjs';
import { jumpRope, ropeLine, lineLength, JUMP_ROPE, JUMP_ROPE_ITEMS } from '../eq/jumpRope.mjs';

const H = 1.75, R = Math.PI / 180;
export const SIZES = Object.freeze({ FOOT_X: 0.05, KNEE_SOFT: 15, HOP: 0.038, M_HOP: 0.15, HAND_OUT: 0.12, HAND_FWD: 0.05, OVER_CLEAR: 0.10, UNDER_W: 0.32, FLOOR_GAP: 0.004 });
const { FOOT_X, KNEE_SOFT, HOP, M_HOP, HAND_OUT, HAND_FWD, OVER_CLEAR, UNDER_W, FLOOR_GAP } = SIZES;
export const bisect = (f, a, b, what) => {
  let fa = f(a), fb = f(b), side = 0;
  if (!(fa * fb <= 0)) throw new Error(`jump_rope: no root for ${what} in [${a}, ${b}] (${fa}, ${fb})`);
  for (let i = 0; i < 80 && Math.abs(b - a) > 1e-8; i++) {
    const c = (a * fb - b * fa) / (fb - fa), fc = f(c);
    if (fc * fb > 0) { b = c; fb = fc; if (side === -1) fa /= 2; side = -1; } else if (fa * fc > 0) { a = c; fa = fc; if (side === 1) fb /= 2; side = 1; } else return c;
  }
  return (a + b) / 2;
};
const kneeOf = lm => {
  const a = [0, 1, 2].map(i => lm['hip.r'][i] - lm['knee.r'][i]), b = [0, 1, 2].map(i => lm['ankle.r'][i] - lm['knee.r'][i]);
  return 180 - Math.acos((a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) / Math.hypot(...a) / Math.hypot(...b)) / R;
};
// Standing, feet together (c4), the knees KNEE_SOFT (c10); the root's height gives the bend.
const feet = { l: { at: [FOOT_X, 0, 0] }, r: { at: [-FOOT_X, 0, 0] } };
const standAt = y => ({ root: { at: [0, y, -0.03], tilt: 0 }, trunk: 0, neck: 0, plant: feet });
const STAND = standAt(bisect(y => kneeOf(landmarksOf(standAt(y), H)) - KNEE_SOFT, 0.75, 0.93, 'knee bend'));
const L0 = landmarksOf(STAND, H);
// Hands (c5, c8): at hip height, HAND_OUT outside the hip joints and HAND_FWD in front of them, elbows in by the ribs.
const hip = L0['hip.l'], HY = hip[1];
const hands = { l: { at: [hip[0] + HAND_OUT, HY, hip[2] + HAND_FWD], pole: [0.2, -0.3, -1] }, r: { at: [-hip[0] - HAND_OUT, HY, hip[2] + HAND_FWD], pole: [-0.2, -0.3, -1] } };
// The legs as joint angles (the plant solved once), so the hop lifts the same body by root.at (box_jump's airborne method).
const q = resolve(normPose({ ...STAND, reach: hands }, { height: H }), { height: H }).q;
const asAngles = dy => ({ root: { at: [0, STAND.root.at[1] + dy, STAND.root.at[2]], tilt: 0 }, trunk: 0, neck: 0,
  hip: { l: { ...q.hip.l }, r: { ...q.hip.r } }, knee: { ...q.knee }, ankle: { ...q.ankle }, shoulder: { l: { ...q.sh.l }, r: { ...q.sh.r } }, elbow: { ...q.elbow } });
const start = asAngles(0), end = asAngles(HOP);
const mistake = { root: { at: [0, STAND.root.at[1] + M_HOP, STAND.root.at[2]], tilt: 0 } };
const HEAD_TOP = L0.head[1];
// c1: standing on its middle, the handle ends reach the armpits (the shoulder joint's height less the upper arm's
// proximal radius); the rope runs from the floor up each side to the handles' rope tips, and across under the feet.
const ARMPIT_Y = L0['shoulder.l'][1] - RADII.upper[0] * H;
export const ROPE_LEN = 2 * (ARMPIT_Y - JUMP_ROPE.handleLen) + 2 * FOOT_X;
const tips = lm => ['r', 'l'].map(s => [lm[`grip.${s}`][0], lm[`grip.${s}`][1] - JUMP_ROPE.handleLen / 2, lm[`grip.${s}`][2]]);
// Overhead (start): the apex OVER_CLEAR over the head; the arc's width is solved so the drawn arc is the rope's
// length (seen from the front the rope then lies in the frontal plane: the longest it can look).
export const OVER_Y = HEAD_TOP + OVER_CLEAR;
const LST = landmarksOf(start, H);
export const OVER_W = bisect(w => lineLength(ropeLine(...tips(LST), OVER_Y, w)) - ROPE_LEN, 0.05, 0.6, 'the overhead width');
const ropeAt = (lm, ctx) => jumpRope({ grips: { l: lm['grip.l'], r: lm['grip.r'] }, apexY: ctx.pose === 'start' ? OVER_Y : FLOOR_GAP, width: ctx.pose === 'start' ? OVER_W : UNDER_W });
const START_ROPE = jumpRope({ grips: { l: LST['grip.l'], r: LST['grip.r'] }, apexY: OVER_Y, width: OVER_W })[2];
const FLOOR = { point: [0, 0, 0], normal: [0, 1, 0] };
export default {
  id: 'jump_rope', name: 'Jump Rope', view: 'front',
  camera: { x0: 179, y0: 339 },
  poses: { start, end },
  armsFront: true,
  equipment: [{ type: 'floor', from: -0.6, to: 0.6 }, ...perItem((lm, ctx) => ropeAt(lm, ctx), JUMP_ROPE_ITEMS),
    (lm, ctx) => (ctx.pose === 'end' ? { type: 'line', cls: 'eq-line m-line', pts: [...START_ROPE.pts, START_ROPE.pts[0]], z: 'back', part: 'startrope' } : null)],
  checks: [
    ...['wrist.l', 'wrist.r'].map(landmark => ({ landmark, at: landmarksOf(start, H)[landmark], pose: 'start', tol: 0.5 })),   // c2 fact: the hands on the handles
    ...['heel.l', 'heel.r', 'ball.l', 'ball.r'].map(landmark => ({ landmark, plane: FLOOR, pose: 'start', tol: 0.5 })),   // standing on the floor; c10 fact: the balls of the feet
    ...['heel.l', 'heel.r', 'ball.l', 'ball.r', 'toe.l', 'toe.r'].map(landmark => ({ landmark, above: { point: [0, HOP - 0.005, 0], normal: [0, 1, 0] }, pose: 'end', tol: 0 })),   // c9: the hop
  ],
  ghosts: { count: 1, parts: [] },
  tempo: [{ phase: 'Work', s: 30, move: true }, { phase: 'Rest', s: 60 }],
  trace: { point: 'sole.r', trim: [0, 0] },
  callouts: [
    { key: 'elbows', text: 'Elbows in', anchor: 'elbow.r', box: { left: 24, top: 152 }, cue: 'Elbows stay close to your ribs.' },
    { key: 'hands', text: 'Hands by hips', anchor: 'grip.l', box: { left: 240, top: 184 }, cue: 'Hands at about hip height, slightly away from your body.' },
    { key: 'hop', text: 'Low hop', anchor: 'ankle.r', box: { left: 80, top: 304 }, cue: 'Feet just clear the rope, about 1 to 2 inches.' },
  ],
  mistake: {
    pose: mistake,
    // the raised feet lie over the solid legs (masked): an arrow from the right hop's sole to the faulty one, outside
    guides: [{ kind: 'arrow', from: { at: 'sole.l', pose: 'end', off: [24, 0] }, to: { at: 'sole.l', pose: 'mistake', off: [24, 0] } }],
    tells: [{ key: 'high', text: 'Too high', anchor: { at: 'sole.l', pose: 'mistake' }, box: { left: 208, top: 304 }, cue: 'Jumping far higher than the rope needs.' }],
  },
  alt: 'Jump rope, front view. Feet together, elbows in by the ribs, hands at hip height turning the rope; a low hop about an inch and a half off the floor, the rope passing just under the feet.',
};
export const info = { HY, HEAD_TOP, ROPE_LEN, OVER_Y, OVER_W };
