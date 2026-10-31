// Sled push, side view, figure facing screen right, the sled in front. LIB-22 (LB10, H; NOSECS lifted at 'LIB-22 resume': D-STRIP-AFALL).
// View: side (card plate.view = census): the lean, the straight head-to-hip line, the straight arms to the posts and
//  the heels off the floor are sagittal.
// Sources: research card docs/research/howto/cards/sled_push.json (research head 596dbe07): c1 both hands on the
//  handles, about halfway down; c3 the lean in a straight line from the head through the hips, the shoulders straight
//  behind the hands, BarBend "your spine is parallel to the ground"; c4 arms straight (BarBend, Fitness Volt "locked");
//  c6 spine neutral, eyes just ahead; c7 a rounded back (the Mistake); c8 only the balls of the feet touch, the heel
//  never; c9, c11 the same body angle and arms throughout; c10 short, powerful steps; c12 feet under or just behind
//  the hips, one foot driving. Tempo: Walk, blank (D-LIB22-AFALL; strip/rows.json fallbackA, c10).
// Clone (D-LIB22-CLONE): leg_press (the 8: M_ROLL, the rounding), mountain_climbers (#109 @ dcac4a38: one stride of
//  the cycle, the via ghost), reverse_lunge (#109: the rigid foot on its ball); copied, never imported.
// Geometry (confirmed by the report's contacts and checks, and by tests on the drawn items):
//  The trunk TRUNK_INCL 90 (parallel to the floor), spine and neck neutral, hips at HIP_Y; the straight arms level, so
//   the posts stand where the arms reach and the hands sit at their middle (c1): the posts' height follows (POST_TOP).
//  Feet: the rigid foot on its ball, heel-up HEEL_UP (the largest heel-up whose ball stays within the 1 cm contact
//   tolerance: c8's balls down and heels up both hold). The far foot (stance) stays FAR_DZ behind the hips in every
//   pose (no foot slides); the near foot drives back with the knee REAR_KNEE short of straight (start) and comes through
//   to FRONT_DZ in front of the hips (end); a via ghost lifts it VIA_LIFT through the swing.
//  The sled (eq/sled.mjs, push form) is static: hands and posts at one place in every pose.
//  Mistake (c7): lumbar flexion M_ROLL with the pelvis at its tilt, the root slid forward (M_Z, solved) so the straight
//   arms still reach the posts; the head drops off the line (tell `line`, c3). A dashed arc (HUMP) draws the rounded back.
// Unsourced numbers (SIZES; lb10/sizes.json holds each with its basis): PX_PER_M, TRUNK_INCL, HIP_Y, HEEL_UP, FAR_DZ, REAR_KNEE,
//  FRONT_DZ, POST_X, M_ROLL, FOOT_X, HUMP, VIA_LIFT; solved: M_Z.
import { landmarksOf, WINTER, REF } from '../engine.mjs';
import { perItem } from '../eq/parts.mjs';
import { sled, postPoint, SLED, SLED_ITEMS } from '../eq/sled.mjs';

const H = 1.75, R = Math.PI / 180;
export const SIZES = Object.freeze({ PX_PER_M: 126, TRUNK_INCL: 90, HIP_Y: 0.80, HEEL_UP: 15, FAR_DZ: -0.12, REAR_KNEE: 10, FRONT_DZ: 0.10, POST_X: 0.25, M_ROLL: 25, FOOT_X: 0.10, HUMP: 0.06, VIA_LIFT: 0.12 });
const { TRUNK_INCL, HIP_Y, HEEL_UP, FAR_DZ, REAR_KNEE, FRONT_DZ, POST_X, M_ROLL, FOOT_X, HUMP, VIA_LIFT } = SIZES;
const ARM = (WINTER.upperArm + WINTER.forearm + REF.gripOff) * H;
export const bisect = (f, a, b, what) => {
  let fa = f(a), fb = f(b), side = 0;
  if (!(fa * fb <= 0)) throw new Error(`sled_push: no root for ${what} in [${a}, ${b}] (${fa}, ${fb})`);
  for (let i = 0; i < 80 && Math.abs(b - a) > 1e-8; i++) {
    const c = (a * fb - b * fa) / (fb - fa), fc = f(c);
    if (fc * fb > 0) { b = c; fb = fc; if (side === -1) fa /= 2; side = -1; } else if (fa * fc > 0) { a = c; fa = fc; if (side === 1) fb /= 2; side = 1; } else return c;
  }
  return (a + b) / 2;
};
// The rigid foot on its ball, heel-up (reverse_lunge.mjs:59-61): lifted so the toe pad just touches the floor.
const sT = Math.sin(HEEL_UP * R), cT = Math.cos(HEEL_UP * R);
const LIFT = -Math.min(...[[0.112, -0.036], [0.120, -0.028], [0.100, -0.038]].map(([z, y]) => ((z - 0.080) * -sT + (y + 0.039) * cT) * H));
const onBall = (x, z, pole = [0, 0, 1]) => ({ at: [x, LIFT, z], normal: [0, cT, sT], toe: [0, -sT, cT], ref: 'ball', pole });
const kneeOf = (lm, s) => {
  const a = [0, 1, 2].map(i => lm[`hip.${s}`][i] - lm[`knee.${s}`][i]), b = [0, 1, 2].map(i => lm[`ankle.${s}`][i] - lm[`knee.${s}`][i]);
  return 180 - Math.acos((a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) / Math.hypot(...a) / Math.hypot(...b)) / R;
};
const base = { root: { at: [0, HIP_Y, 0], tilt: TRUNK_INCL }, trunk: 0, neck: 0 };
const L0 = landmarksOf(base, H), SH = L0['shoulder.r'];
// Arms straight and level (c3 "shoulders straight behind your hands"): the posts where the straight arm reaches.
const REACH = Math.sqrt(ARM ** 2 - (POST_X - Math.abs(SH[0])) ** 2) - 0.001;
const GRIP_Y = SH[1], REAR_Z = SH[2] + REACH - SLED.postT / 2;
const TOP = SLED.bodyY + SLED.bodyT / 2, POST_TOP = 2 * GRIP_Y - TOP;   // c1: the hands about halfway down the posts
const SP = { rearZ: REAR_Z, postX: POST_X, postTop: POST_TOP };
const hands = { l: { at: postPoint(SP, GRIP_Y, 'l'), pole: [0.3, -1, 0] }, r: { at: postPoint(SP, GRIP_Y, 'r'), pole: [-0.3, -1, 0] } };
const HIP_Z = L0['hip.r'][2];
// The far (stance) foot just behind the hips (c12) in every pose; the near foot driving back with the leg REAR_KNEE
// short of straight (start), then driven through to FRONT_DZ in front of the hips (end).
const far = onBall(FOOT_X, HIP_Z + FAR_DZ);
const rearZ = bisect(z => kneeOf(landmarksOf({ ...base, plant: { l: far, r: onBall(-FOOT_X, z) } }, H), 'r') - REAR_KNEE, HIP_Z - 0.9, HIP_Z - 0.3, 'rear foot');
const start = { ...base, plant: { l: far, r: onBall(-FOOT_X, rearZ) }, reach: hands };
const end = { ...base, plant: { l: far, r: onBall(-FOOT_X, HIP_Z + FRONT_DZ, [0, 0.2, 1]) }, reach: hands };
// Mistake (c7): the back rounds: lumbar flexion M_ROLL (leg_press.mjs:87), the pelvis tilting back as much, so the
// thorax keeps the end's line to the hands.
// The back rounds (c7): the lumbar spine flexes M_ROLL (leg_press.mjs:87's approved rounding) with the pelvis at
// its tilt, so the upper back humps and the head drops; the root slides forward (z, solved) just enough that the
// straight arms still reach the hands on the posts; hands and feet do not move.
const mistakeAt = z => ({ root: { at: [0, HIP_Y, z], tilt: TRUNK_INCL }, trunk: M_ROLL, neck: 0 });
const reachGap = z => { const S = landmarksOf({ ...end, ...mistakeAt(z), reach: undefined }, H)['shoulder.r'], G = hands.r.at; return Math.hypot(S[0] - G[0], S[1] - G[1], S[2] - G[2]) - ARM + 0.001; };
export const M_Z = bisect(reachGap, -0.2, 0.4, 'the Mistake root');
const FLOOR = { point: [0, 0, 0], normal: [0, 1, 0] };
const mistake = mistakeAt(M_Z);
// The engine bends the spine at one lumbar point, so the drawn hump is small; a dashed Mistake guide draws the rounded
// back as one arc from the faulty sacrum to the faulty neck, bowing HUMP above their chord (romanian_deadlift.mjs's
// HUMP guide, #109 @ dcac4a38), drawn on top.
const LMM = landmarksOf({ ...end, ...mistake }, H);
const HUMP_PTS = (() => {
  const A = LMM.sacrum, B = LMM.neck, d = [0, B[1] - A[1], B[2] - A[2]], L = Math.hypot(...d);
  let n = [0, -d[2] / L, d[1] / L]; if (n[1] < 0) n = n.map(v => -v);
  const M = A.map((v, i) => (v + B[i]) / 2), C = M.map((v, i) => v + n[i] * 2 * HUMP);
  return Array.from({ length: 13 }, (_, k) => { const t = k / 12; return A.map((v, i) => (1 - t) ** 2 * v + 2 * t * (1 - t) * C[i] + t * t * B[i]); });
})();
// One via (a ghost): the driving foot swung through under the hips, its ball VIA_LIFT off the floor (the knee drives).
const via = [{ ...base, plant: { l: far, r: { ...onBall(-FOOT_X, (rearZ + HIP_Z + FRONT_DZ) / 2, [0, 0.2, 1]), at: [-FOOT_X, LIFT + VIA_LIFT, (rearZ + HIP_Z + FRONT_DZ) / 2] } }, reach: hands }];
export default {
  id: 'sled_push', name: 'Sled Push', view: 'side', facing: 'right',
  camera: { pxPerM: SIZES.PX_PER_M, x0: 100, y0: 339 },
  poses: { start, via, end },
  equipment: [{ type: 'floor', from: -1.0, to: SP.rearZ + SLED.len + 0.1 },   // the floor runs on under the whole sled
    ...perItem(() => sled(SP), SLED_ITEMS)],
  checks: [
    ...['wrist.l', 'wrist.r'].map(landmark => ({ landmark, at: landmarksOf(start, H)[landmark], pose: 'start', tol: 0.5 })),   // c1 fact: hands on the posts
    ...['wrist.l', 'wrist.r'].map(landmark => ({ landmark, at: landmarksOf(start, H)[landmark], pose: 'end', tol: 0.5 })),     // c9 fact: the hands keep their place on the handles through the push
    ...['ball.l', 'ball.r'].flatMap(landmark => ['start', 'end'].map(pose => ({ landmark, plane: FLOOR, pose, tol: 1 }))),          // c8 facts: the balls of the feet down
    ...['heel.l', 'heel.r'].map(landmark => ({ landmark, above: { point: [0, 0.03, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0 })), // c8: the heels never touch
    ...['start', 'end'].map(pose => ({ landmark: 'shoulder.r', plane: { point: [0, GRIP_Y, 0], normal: [0, 1, 0] }, pose, tol: 1 })),                           // c3: shoulders straight behind the hands
  ],
  ghosts: { count: 1, parts: ['leg.r'] },
  trace: { point: 'ball.r', trim: [10, 12] },
  callouts: [
    { key: 'line', text: 'Straight line', anchor: 'backUpper', box: { left: 120, top: 140 }, cue: 'Body leans forward in a straight line from head to hips.' },
    { key: 'flat', text: 'Flat back', anchor: 'backMid', box: { left: 16, top: 170 }, cue: 'Spine neutral, abs tight.' },
    { key: 'balls', text: 'Balls of feet', anchor: 'ball.r', box: { left: 140, top: 280 }, cue: 'Heels up, push through the balls of your feet.' },
  ],
    // c3: the straight line from the head through the hips, run past both ends
  datum: [{ x: 0, from: 0, to: 0, line: [{ along: ['head', 'sacrum'], t: 1.6 }, { along: ['sacrum', 'head'], t: 1.4 }] }],
  mistake: {
    pose: mistake,
    guides: [{ kind: 'dashed', smooth: true, pts: HUMP_PTS }],
    tells: [
      { key: 'round', text: 'Back rounds', anchor: { at: 'backMid', pose: 'mistake' }, box: { left: 88, top: 168 }, cue: 'The back rounds instead of staying flat.' },
      { key: 'line', text: 'Line breaks', anchor: { at: 'head', pose: 'mistake' }, cue: 'Head to hips is no longer one straight line.' },
    ],
  },
  tempo: [{ phase: 'Walk', move: true }],   // D-STRIP-AFALL (D-LIB22-AFALL): blank, strip/rows.json fallbackA (lb10/tempo.json)
  alt: 'Sled push, side view. Leaning forward in one straight line from head to hips, arms straight, hands halfway down the sled posts. On the balls of the feet, the rear foot drives through to the front.',
};
export const info = { GRIP_Y, POST_TOP, REAR_Z, rearZ, HIP_Z };
