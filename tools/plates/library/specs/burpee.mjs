// Burpee, side view, figure facing screen right. LIB-22 (LB10, H; NOSECS lifted at 'LIB-22 resume'; one tell).
// View: side (card plate.view = census): the straight plank from head to heels (c6), the neutral neck (c15) and the
//  knee bend at the landing (c11) are sagittal.
// Pose map (D-LIB22-POSEMAP; lb10/tempo.json poseMap): spec start = card plate.end (the straight-arm plank), spec end
//  = card plate.start (standing after the landing), so the Mistake, a hard landing (c11), is drawn against the end.
// Sources: research card docs/research/howto/cards/burpee.json (research head 596dbe07): c1 stand with the feet
//  shoulder-width apart, hands by your sides; c2 hands flat on the floor in front of the feet, shoulder-width apart;
//  c3 hands first, then the feet kicked back to a straight-arm plank; c5 jump the feet in and under the body, knees
//  close to the elbows; c6 body straight from head to heels; c11 land softly on slightly bent knees (the Mistake: a
//  hard landing); c13 feet flat in the squat; c14 hips below the knees as the hands go down; c15 neck neutral.
//  Tempo: the strip row (D-STRIP-B; strip/rows.json, c24): Squat down "Controlled", then three blank phases.
// Clone (D-LIB22-CLONE): barbell_back_squat (the 8: the standing side view), plank and mountain_climbers (#109 @
//  dcac4a38: the straight-arm plank solve, the flat palm, the via ghost), kettlebell_swing (KNEE / TOP_KNEE, the
//  Winter centre of mass); copied, never imported.
// Geometry (confirmed by the report's contacts and checks, and by tests on the drawn items):
//  Start (the plank, c2, c3, c6, c15): trunk, hips, knees and neck 0 (one line, head in line), arms straight and plumb
//   (shoulder flexion = pelvis tilt) with the flat palm (wrist 90, LIB-26) under each shoulder joint, so the hands are
//   the shoulder joints' width apart (c2 'shoulder-width apart', the arms plumb); feet at right angles to the shins,
//   toe tips on the floor; root and tilt solved so the wrist sits WRIST_Y up at the hand spot and the toes are down.
//   The plank's feet are then held as plant targets on the ball, so the blend toward the squat moves them along
//   the floor (c5 'Jump your feet in'), never through it.
//  Via (the one ghost, D-LIB22-CYCLE): the squat with the hands down (c2, c3, c13, c14, c5): feet flat on the
//   standing spot, hands on the plank's hand spots, the hip joints VIA_DROP below the knees, the elbows over the knees
//   and the arms straight (root and tilt solved). Never drawn solid; carries no fact, tell or anchor.
//  End (standing after the landing, c1, c11): feet flat FOOT_X out (c1 shoulder-width: the widest the rigid foot's plant
//   allows with every contact within 0.5 cm), the toe tips at the wrists' line (c2: the palms in front of the feet), knees KNEE_SOFT (c11), trunk upright, arms at the sides
//   (c1), root z solved so the centre of mass is over the mid-soles.
//  Mistake (c11; drawable false, F7): the knees straight (M_KNEE short of the engine's singular full extension); the
//   feet and the centre of mass stay. One tell (DESIGN.md one-tell record).
// Unsourced numbers (SIZES; lb10/sizes.json holds each with its basis): FOOT_X, KNEE_SOFT, M_KNEE, VIA_DROP;
//  solved: none exported.
import { landmarksOf, RADII, WINTER, REF } from '../engine.mjs';

const H = 1.75, R = Math.PI / 180;
export const SIZES = Object.freeze({ FOOT_X: 0.15, KNEE_SOFT: 15, M_KNEE: 1, VIA_DROP: 0.02 });
const { FOOT_X, KNEE_SOFT, M_KNEE, VIA_DROP } = SIZES;
const WRIST_Y = RADII.fore[2] * H;   // flat palm (LIB-26): the wrist sits the forearm's distal radius above the floor (mountain_climbers.mjs)
const WRIST = 90;                    // arms plumb, so the wrist extends 90 deg and the palm lies flat (mountain_climbers.mjs)
// shoulder to grip with the elbow straight and the wrist at WRIST (the grip REF.gripOff off the forearm line)
const ARM = Math.hypot((WINTER.upperArm + WINTER.forearm) * H, REF.gripOff * H * Math.sin(WRIST * R)) - 1e-4;

// Newton with finite differences (plank.mjs, mountain_climbers.mjs @ dcac4a38), damped; throws if it does not converge.
function solve(p0, make, res, what, iters = 60) {
  const keys = Object.keys(p0), p = { ...p0 };
  const f = q => res(landmarksOf(make(q), H));
  for (let it = 0; it < iters; it++) {
    const r = f(p); if (Math.hypot(...r) < 1e-8) return p;
    const J = keys.map(k => { const d = 1e-5, q = { ...p, [k]: p[k] + d }; return f(q).map((v, i) => (v - r[i]) / d); });
    const n = keys.length, A = Array.from({ length: n }, (_, i) => [...keys.map((_, j) => J[j][i]), -r[i]]);
    for (let c = 0; c < n; c++) {
      let m = c; for (let i = c + 1; i < n; i++) if (Math.abs(A[i][c]) > Math.abs(A[m][c])) m = i;
      [A[c], A[m]] = [A[m], A[c]];
      for (let i = 0; i < n; i++) if (i !== c) { const k = A[i][c] / A[c][c]; for (let j = c; j <= n; j++) A[i][j] -= k * A[c][j]; }
    }
    const step = keys.map((_, i) => A[i][n] / A[i][i]), r0 = Math.hypot(...r);
    for (let h = 1; h > 1e-4; h /= 2) {
      const q = { ...p }; keys.forEach((k, i) => { q[k] += h * step[i]; });
      if (Math.hypot(...f(q)) < r0) { Object.assign(p, q); break; }
    }
  }
  if (!(Math.hypot(...f(p)) <= 1e-6)) throw new Error(`burpee: no solution for ${what}`);
  return p;
}
const mid = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
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
export const kneeOf = (lm, s) => {
  const a = [0, 1, 2].map(i => lm[`hip.${s}`][i] - lm[`knee.${s}`][i]), b = [0, 1, 2].map(i => lm[`ankle.${s}`][i] - lm[`knee.${s}`][i]);
  return 180 - Math.acos(Math.max(-1, Math.min(1, (a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) / Math.hypot(...a) / Math.hypot(...b)))) / R;
};

// Start: the straight-arm plank, the wrists at z 0 (the hand spot).
const plankPose = q => ({ root: { at: [0, q.y, q.z], tilt: q.tilt }, trunk: 0, neck: 0, shoulder: { flex: q.tilt }, elbow: 0, wrist: WRIST, hip: 0, knee: 0, ankle: 0 });
const QP = solve({ y: 0.45, z: -0.9, tilt: 75 }, plankPose, lm => [lm['wrist.r'][1] - WRIST_Y, lm['wrist.r'][2], lm['toe.r'][1]], 'the plank');
const LS = landmarksOf(plankPose(QP), H);
// The plank's feet as plant targets on the ball (each foot where the angles put it), so the engine blends the feet's
// targets toward the squat (c5 'Jump your feet in and under your body') instead of swinging them through the floor.
const unit = v => { const L = Math.hypot(...v); return v.map(x => x / L); };
const footOf = s => {
  const t = unit([0, 1, 2].map(i => LS[`ball.${s}`][i] - LS[`heel.${s}`][i])), a = [0, 1, 2].map(i => LS[`ankle.${s}`][i] - LS[`ball.${s}`][i]);
  const k = a[0] * t[0] + a[1] * t[1] + a[2] * t[2];
  return { at: LS[`ball.${s}`], toe: t, normal: unit(a.map((v, i) => v - k * t[i])), ref: 'ball' };
};
const start = { ...plankPose(QP), plant: { l: footOf('l'), r: footOf('r') } };
const GRIPS = { l: LS['grip.l'], r: LS['grip.r'] };
// End: standing, feet flat FOOT_X out, the toe tips at the wrists' line (c2: the palms in front of the feet).
const FOOT_Z = LS['wrist.r'][2] - (REF.toe - REF.mid) * H;   // the mid-sole, so the toe tip lies under the wrist
const BALL_DZ = (REF.ball - REF.mid) * H;   // planted on the ball's spot (ref 'ball'), the same reference as the plank's feet
const feet = { l: { at: [FOOT_X, 0, FOOT_Z + BALL_DZ], normal: [0, 1, 0], toe: [0, 0, 1], ref: 'ball' }, r: { at: [-FOOT_X, 0, FOOT_Z + BALL_DZ], normal: [0, 1, 0], toe: [0, 0, 1], ref: 'ball' } };
const standing = (q, knee = KNEE_SOFT) => ({ root: { at: [0, q.y, q.z], tilt: 0 }, trunk: 0, neck: 0, shoulder: { flex: 0 }, elbow: 0, wrist: 0, plant: feet, _k: knee });
export const bisect = (f, a, b, what) => {   // kettlebell_swing.mjs's root finder (Illinois); throws on no bracket
  let fa = f(a), fb = f(b), side = 0;
  if (!(fa * fb <= 0)) throw new Error(`burpee: no root for ${what} in [${a}, ${b}] (${fa}, ${fb})`);
  for (let i = 0; i < 80 && Math.abs(b - a) > 1e-9; i++) {
    const c = (a * fb - b * fa) / (fb - fa), fc = f(c);
    if (fc * fb > 0) { b = c; fb = fc; if (side === -1) fa /= 2; side = -1; } else if (fa * fc > 0) { a = c; fa = fc; if (side === 1) fb /= 2; side = 1; } else return c;
  }
  return (a + b) / 2;
};
// A standing pose with the knees at `knee`: the hip height by bisection (the knee is singular near 0), the root's z so
// the centre of mass lies over the mid-soles.
const standAt = knee => {
  const make = z => { const y = bisect(y => kneeOf(landmarksOf(standing({ y, z }), H), 'r') - knee, 0.75, 0.94, `hip height at knee ${knee}`); const { _k, ...p } = standing({ y, z }); return p; };
  return make(bisect(z => com(landmarksOf(make(z), H))[2] - FOOT_Z, FOOT_Z - 0.2, FOOT_Z + 0.2, `balance at knee ${knee}`));
};
const end = standAt(KNEE_SOFT);
// Mistake (c11): the hard landing, the knees straight (M_KNEE short of full extension); feet and balance unchanged.
const mistakeFull = standAt(M_KNEE);
const mistake = { root: mistakeFull.root };
// Via (the squat with the hands down): feet flat on the standing spot (c13), the hands on the plank's hand spots (c2,
// c3), the hip joints VIA_DROP below the knees (c14), the elbows over the knees (c5), the arms straight (c3).
const squat = q => ({ root: { at: [0, q.y, q.z], tilt: q.tilt }, trunk: 0, neck: 0, wrist: WRIST, plant: feet,
  reach: { l: { at: GRIPS.l, pole: [0, 0, -1] }, r: { at: GRIPS.r, pole: [0, 0, -1] } } });
const QV = solve({ y: 0.40, z: FOOT_Z - 0.32, tilt: 65 }, squat, lm => [lm['knee.r'][1] - lm['hip.r'][1] - VIA_DROP, lm['elbow.r'][2] - lm['knee.r'][2],
  Math.hypot(...[0, 1, 2].map(i => lm['shoulder.r'][i] - lm['grip.r'][i])) - ARM], 'the squat');
const via = [squat(QV)];

const FLOOR = { point: [0, 0, 0], normal: [0, 1, 0] };
export default {
  hand: 'flat',
  id: 'burpee', name: 'Burpee', view: 'side', facing: 'right',
  camera: { x0: 250, y0: 339 },
  poses: { start, via, end },
  equipment: [{ type: 'floor', from: -1.45, to: 0.62 }],
  checks: [
    ...['wrist.l', 'wrist.r'].map(landmark => ({ landmark, at: LS[landmark], pose: 'start', tol: 0.5 })),            // c2 fact: palms on the floor
    ...['wrist.l', 'wrist.r'].map(landmark => ({ landmark, plane: { point: [0, WRIST_Y, 0], normal: [0, 1, 0] }, pose: 'start', tol: 0.5 })),
    ...['toe.l', 'toe.r'].map(landmark => ({ landmark, plane: FLOOR, pose: 'start', tol: 0.5 })),                     // c3: on the toes
    ...['heel.l', 'ball.l', 'heel.r', 'ball.r'].map(landmark => ({ landmark, plane: FLOOR, pose: 'end', tol: 0.5 })),   // standing, feet flat
    ...['heel.l', 'ball.l', 'heel.r', 'ball.r'].map(landmark => ({ landmark, plane: FLOOR, pose: 'mistake', tol: 0.5 })),
  ],
  ghosts: { count: 1, parts: ['leg.l', 'leg.r', 'trunk', 'arm.r'] },
  trace: { point: 'ball.r', trim: [10, 12] },
  callouts: [
    { key: 'plank', text: 'Straight plank', anchor: 'start:backMid', box: { left: 76, top: 168 }, cue: 'Body straight from head to heels, lower back not sagging.' },
    { key: 'neck', text: 'Neck neutral', anchor: 'start:head', box: { left: 248, top: 152 }, cue: 'Neck neutral, head not lowered toward the floor.' },
    { key: 'soft', text: 'Soft landing', anchor: { at: 'knee.r', off: [-6, 0] }, box: { left: 96, top: 216 }, cue: 'Land softly on slightly bent knees.' },
  ],
  mistake: {
    pose: mistake,
    // the locked leg's axis, hip joint -> knee -> ankle (panel mx2 item 5; D-LIB22-AXIS, #331): the capsule outline keeps
    // its knee taper and reads bent; one straight solid line shows the leg straight, in the plate and the Mistake zoom
    // (the D-LIB16-AXIS form of cable_chest_press)
    guides: [{ kind: 'line', pts: ['hip.r', 'knee.r', 'ankle.r'].map(at => ({ at, pose: 'mistake' })) }],
    tells: [
      { key: 'landing', text: 'Stiff landing', anchor: { at: 'knee.r', pose: 'mistake' }, box: { left: 64, top: 228 }, cue: 'A hard landing, without the knees slightly bent.' },
    ],
  },
  tempo: [{ phase: 'Squat down', move: true, word: 'Controlled' }, { phase: 'Kick back', move: true }, { phase: 'Jump in', move: true }, { phase: 'Jump up', move: true }],   // D-STRIP-B untimed (lb10/tempo.json = strip/rows.json's row; tempoOf)
  zoom: { view: 'mistake', k: 2 },   // D-LIBZOOM-EXTEND (lib4-cards §41; DESIGN.md §21): the landing tell (knee.r), 14.2 px at k 2 (bar at the zoom's scale)
  alt: 'Burpee, side view. From a straight-arm plank, hands flat under the shoulders and the body in one line, the feet jump in under the body and the lifter stands tall, landing softly on slightly bent knees.',
};
export const info = { QP, QV, FOOT_Z, pose: Object.fromEntries([['start', start], ['via', via[0]], ['end', end], ['mistake', mistakeFull]].map(([k, p]) => { const lm = landmarksOf(p, H);
  return [k, { com: com(lm).map(v => +v.toFixed(3)), kneeR: +kneeOf(lm, 'r').toFixed(1), hip: lm['hip.r'].map(v => +v.toFixed(3)), knee: lm['knee.r'].map(v => +v.toFixed(3)), heel: +lm['heel.r'][2].toFixed(3), toe: +lm['toe.r'][2].toFixed(3), wrist: lm['wrist.r'].map(v => +v.toFixed(3)) }]; })) };
