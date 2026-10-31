// Jumping jacks, FRONT view. LIB-22 (LB10, H; cycle: two named poses; tempo c9; F7: the drawn fault is not the top
// fault, D-LIB22-F7).
// View: front (card plate.view = census): the feet apart and the arms overhead are frontal (c1, c2), and the toes
//  twisted outward (c12) show as the feet turned out. Sagittal signs (the knees' slight bend, c5, c6; the shoulders
//  stacked over the hips, c5) cannot show in this view (D-LIB22-FRONT, S4, accepted #305 6356763967): the knees are
//  drawn at KNEE_SOFT and the trunk upright, and no test or callout claims the bend shows.
// Sources: research card docs/research/howto/cards/jumping_jacks.json (research head 596dbe07): c1 feet together, arms
//  at the sides; c2 jump the legs apart, arms overhead, land with the feet hip-width apart; c4 a little wider than
//  shoulder width; c5 a slight bend in the knees, shoulders stacked over the hips; c9 30-60 s of work; c12 toes pointed
//  forward, arms fully extended at the sides; twisting the toes outward (the drawn Mistake; drawable false: the top
//  fault, jerky landings, c6, c14, has no still sign).
// Clone (D-LIB22-CLONE): upright_row (#109 @ dcac4a38: the engine front view, the widest rigid-foot stance), box_jump
//  (#109: the landing frame; "the airborne moment is not drawn", plate.frames); copied, never imported.
// Geometry (confirmed by the report's contacts and checks, and by tests on the drawn items):
//  Start (c1, c12): feet together (FOOT_X_IN), toes forward, knees KNEE_SOFT (c5), trunk upright; the arms straight at
//   the sides (c12 "arms fully extended").
//  End (c2, c4, c5): landed, the feet apart at FOOT_X_OUT (the widest whose flat rigid feet stay within the 0.5 cm
//   contact limit, between c2's hip width and c4's "a little wider than shoulder width"), toes forward, knees
//   KNEE_SOFT; the straight arms overhead, vertical over the shoulder joints (abduction 180).
//  Mistake (c12): the same landing with the toes twisted out M_ROT (the feet planted flat with the toes turned out; the
//   IK turns the hips, body.mjs hip.rot).
//  Both poses balance over the feet: the root's z is solved so the centre of mass sits over mid-foot.
// Unsourced numbers (SIZES; lb10/sizes.json holds each with its basis): FOOT_X_IN, FOOT_X_OUT, KNEE_SOFT, ARM_UP,
//  M_ROT; solved: START_Z, END_Z.
import { landmarksOf, REF } from '../engine.mjs';

const H = 1.75, R = Math.PI / 180;
export const SIZES = Object.freeze({ FOOT_X_IN: 0.055, FOOT_X_OUT: 0.15, KNEE_SOFT: 15, ARM_UP: 180, M_ROT: 30, GHOST_ABD: 0.25 });
const { FOOT_X_IN, FOOT_X_OUT, KNEE_SOFT, ARM_UP, M_ROT, GHOST_ABD } = SIZES;
export const bisect = (f, a, b, what) => {
  let fa = f(a), fb = f(b), side = 0;
  if (!(fa * fb <= 0)) throw new Error(`jumping_jacks: no root for ${what} in [${a}, ${b}] (${fa}, ${fb})`);
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
const MID_Z = REF.mid * H - REF.mid * H;   // the soles' mid-foot at world z 0
const feetAt = (x, rot = 0) => ({ l: { at: [x, 0, MID_Z], toe: [Math.sin(rot * R), 0, Math.cos(rot * R)], normal: [0, 1, 0], ref: 'mid' },
  r: { at: [-x, 0, MID_Z], toe: [-Math.sin(rot * R), 0, Math.cos(rot * R)], normal: [0, 1, 0], ref: 'mid' } });
const poseAt = (x, arms, y, z, rot = 0) => ({ root: { at: [0, y, z], tilt: 0 }, trunk: 0, neck: 0, ...arms, plant: feetAt(x, rot) });
// A standing pose: y from the soft knees (c5), z so the centre of mass sits over mid-foot.
function stand(x, arms, rot = 0) {
  let y = 0.9, z = -0.03;
  for (let i = 0; i < 4; i++) {
    y = bisect(yy => kneeOf(landmarksOf(poseAt(x, arms, yy, z, rot), H), 'l') - KNEE_SOFT, 0.75, 0.95, 'the soft knee');
    z = bisect(zz => com(landmarksOf(poseAt(x, arms, y, zz, rot), H))[2] - MID_Z, -0.2, 0.2, 'the balance');
  }
  return { y, z };
}
const DOWN = { shoulder: 0, elbow: 0 };                         // c12: arms fully extended, hands by the sides
const UP = { shoulder: { abd: ARM_UP }, elbow: 0 };             // c2: arms overhead, straight
const S0 = stand(FOOT_X_IN, DOWN), E0 = stand(FOOT_X_OUT, UP);
export const START_Z = S0.z, END_Z = E0.z;
const start = poseAt(FOOT_X_IN, DOWN, S0.y, S0.z);
const end = poseAt(FOOT_X_OUT, UP, E0.y, E0.z);
// The two in-between keys (panel mx13 R1, #358 6547089227): the straight arms at a third and two thirds of the
// abduction, in the frontal plane, and the feet a third and two thirds of the way out, so each ghost arm is drawn at its
// full length (interpolating the start's hanging arm to the end's abduction 180 turned it out of the frontal plane).
// The ghosts sit at t 1/3 and 2/3 (two keys); the arms there are at GHOST_ABD and 1 - GHOST_ABD of the abduction, not the even 1/3
// and 2/3, so the widest ghost hands stay inside F2's coverage range (0.191-0.549; even thirds give 0.587, 0.3 gives 0.561).
const VIA_T = [1 / 3, 2 / 3];
const via = VIA_T.map((t, i) => {
  const x = FOOT_X_IN + (FOOT_X_OUT - FOOT_X_IN) * t, arms = { shoulder: { abd: ARM_UP * (i ? 1 - GHOST_ABD : GHOST_ABD) }, elbow: 0 }, v = stand(x, arms);
  return poseAt(x, arms, v.y, v.z);
});
// Mistake (c12): the same landing, the feet planted flat with the toes turned out M_ROT (the hips rotate out with them).
// The turn stays about mid-foot (feetAt): about the heel, the rigid feet miss the floor by 1 cm (0.5 cm limit; panel mx13
// R5 asked for the heel only if the data allows, #358 6547089227).
const mistake = { plant: feetAt(FOOT_X_OUT, M_ROT) };
// The engine draws the front-view foot as its mid-foot cross-section (body.mjs:55, :314), so the turned foot hardly
// changes outline: a dashed Mistake guide draws each turned foot's axis, heel to toe, on top (the sign c12 names).
const LM = landmarksOf({ ...end, ...mistake }, H);
const TOE_GUIDES = ['l', 'r'].map(s => ({ kind: 'dashed', pts: [LM[`heel.${s}`], LM[`toe.${s}`]] }));
// Panel mx13 R5 (#358 6547089227): each faulty foot also as a closed dashed outline in its own turned sagittal plane
// (heel to toe along the turned axis, a side-view foot profile up from the sole), so in the front view its toe end
// projects sideways past the solid foot by the turn M_ROT gives. FOOT_PROFILE: (along the foot, fraction of the
// heel-to-toe length; up, m), a drawing shape only (no size claim).
const FOOT_PROFILE = [[0, 0], [0.72, 0], [1, 0.012], [1, 0.025], [0.72, 0.035], [0.45, 0.06], [0.2, 0.085], [0, 0.075], [-0.06, 0.04], [0, 0]];
const FOOT_OUTLINES = ['l', 'r'].map(s => {
  const h = LM[`heel.${s}`], t = LM[`toe.${s}`], L = Math.hypot(t[0] - h[0], t[2] - h[2]), d = [(t[0] - h[0]) / L, 0, (t[2] - h[2]) / L];
  return { kind: 'dashed', pts: FOOT_PROFILE.map(([u, v]) => [h[0] + d[0] * u * L, v, h[2] + d[2] * u * L]) };
});
const FLOOR = { point: [0, 0, 0], normal: [0, 1, 0] };
export default {
  id: 'jumping_jacks', name: 'Jumping Jacks', view: 'front',
  camera: { x0: 179, y0: 339 },
  poses: { start, via, end },
  equipment: [{ type: 'floor', from: -0.6, to: 0.6 }],
  checks: [
    ...['heel.l', 'heel.r', 'ball.l', 'ball.r'].flatMap(landmark => ['start', 'end'].map(pose => ({ landmark, plane: FLOOR, pose, tol: 0.5 }))),   // c1, c2: standing, landed
  ],
  ghosts: { count: 2, parts: ['arm.l', 'arm.r'] },
  tempo: [{ phase: 'Work', s: '30–60', move: true }],
  trace: { point: 'grip.r', trim: [10, 12] },
  zoom: { view: 'mistake', k: 2.5 },
  callouts: [
    { key: 'knees', text: 'Soft knees', anchor: 'knee.r', box: { left: 52, top: 240 }, cue: 'Land with a slight bend in the knees, never locked.' },
    { key: 'arms', text: 'Arms overhead', anchor: 'grip.l', box: { left: 232, top: 24 }, cue: 'Arms rise overhead as the feet jump apart.' },
    { key: 'stack', text: 'Shoulders<br>over hips', anchor: { at: 'shoulder.l', off: [8, 0] }, box: { left: 256, top: 104 }, cue: 'Stay upright the whole time.' },
  ],
  mistake: {
    pose: mistake,
    guides: [...FOOT_OUTLINES, ...TOE_GUIDES],
    tells: [{ key: 'toes', text: 'Toes out', anchor: { at: 'toe.r', pose: 'mistake' }, box: { left: 16, top: 280 }, cue: 'The toes twist outward instead of pointing forward.' }],
  },
  alt: 'Jumping jacks, front view. From standing with the feet together and the arms at the sides, the feet land apart with soft knees and the straight arms overhead. Toes point forward.',
};
export const info = { pose: Object.fromEntries([['start', start], ['end', end], ['mistake', { ...end, ...mistake }]].map(([k, p]) => { const lm = landmarksOf(p, H); return [k, { com: com(lm).map(v => +v.toFixed(3)), heel: +lm['heel.l'][2].toFixed(3), toe: +lm['toe.l'][2].toFixed(3), feetX: [+lm['sole.r'][0].toFixed(3), +lm['sole.l'][0].toFixed(3)] }]; })) };
