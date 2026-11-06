// Jump squat, side view, figure facing screen right. LIB-SMALL (LB4 resume 2, mode H: D-SMALL-MODES; card parent
// box_jump, but no PARAMS key removes the box, lands on the floor or sets the take-off depth).
// View: side (card plate.view). The hips-back loading (j2), the triple extension (j3) and the landing knee and hip
//  bend (j4, j5) are sagittal.
// Airborne class (D-LIB8R-AIR, D-SMALL-JSAIR), re-posed by LIB-PLATEFIX-3 item 6 (#405 6682844211; #392 6649453813 L7:
//  "the trace is a closed loop over the torso; draw one open hip path, back then down"): the touchdown at full
//  extension on the balls (dashed start, j3), one ghost mid-absorb, the landing in place on the floor (solid end, j4;
//  j9 "maximal vertical jump"). No body is drawn off every support; the Trace follows the near hip from the touchdown
//  back, then down into the landing (j4 "push your hips backwards and drop them downwards to absorb").
// Sources: research card docs/research/howto/cards/jump_squat.json (research head a48b0594): callouts =
//  plate.checkpoints (j2 Hips back, j3 Full extension, j4 Soft landing); Mistake = plate.mistake (j5, drawable).
//  Tempo: tempoOf(strip/rows.json jump_squat): Lower Controlled (j9), Jump Explosive (j7).
// Clone source (D-SMALL-JSAIR; copied, never imported, D-LIB9-CLONE): box_jump (PILOT-A2, pinned): `grounded` (the
//  Winter 2009 centre of mass over mid-foot), the extension ghost on the balls, the rising hip curve and the flight
//  parabola, the straight-knee Mistake and its arrow. The box is removed; every frame stands on the floor at the same
//  feet.
// Geometry (confirmed by the report `checks` and the drawn-item tests):
//  The take-off crouch (TAKEOFF_HIP, TAKEOFF_TRUNK, j2) is no longer drawn; it only fixes the ball spot BALL0.
//  Start (j3, the touchdown): the same feet on the balls (heels up EXT_HEEL), knees EXT_KNEE, hips straight, the body
//   leaning EXT_LEAN (the centre of mass over the balls is not solved: the lean is box_jump's form, reduced for a
//   vertical jump).
//  Via (j4): ABSORB keys from the touchdown to the landing; the hip on a quadratic curve whose control point is at the
//   touchdown hip height and the landing hip's z (back, then down); the heels come down over the first half; tilt and
//   neck move linearly. The ghost (t 0.5) is the mid-absorb key.
//  End (j4, j8): landed in place, both feet flat, hips back and down (LAND_HIP), knees bent, thorax LAND_TRUNK forward.
//  Mistake (j5): the same feet, knees near locked (MISTAKE_HIP), thorax MISTAKE_TRUNK.
//  Arms (j10, panel mx15 R1, #358 6547988428): in every key the hands rest loosely at the chest, HAND_FWD in front of the
//   sternum along the thorax normal and HAND_X of the shoulder width apart, the elbows down by the sides (reach, pole
//   down), so each arm keeps its drawn length.
// Unsourced numbers (SIZES): FOOT_X, TAKEOFF_HIP, TAKEOFF_TRUNK, LAND_HIP, LAND_TRUNK, EXT_HEEL, EXT_KNEE, EXT_LEAN,
//  APEX, MISTAKE_HIP, MISTAKE_TRUNK, HAND_FWD, HAND_X.
import { landmarksOf } from '../engine.mjs';

const H = 1.75;
const FOOT_X = 0.10;                                       // mid-sole lateral offset: feet hip width (j1)
const TAKEOFF_HIP = 0.55, TAKEOFF_TRUNK = 48;
const LAND_HIP = 0.72, LAND_TRUNK = 32;
const HAND_FWD = 0.10, HAND_X = 0.75;

// Winter (2009) segment masses and centre-of-mass positions (copied from box_jump.mjs).
const mid = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
function comZ(lm) {
  let m = 0, z = 0;
  const seg = (w, p) => { m += w; z += w * p[2]; };
  seg(0.081, lm.ear); seg(0.497, mid(lm.shoulders, lm.hips, 0.5));
  for (const s of ['l', 'r']) {
    seg(0.028, mid(lm[`shoulder.${s}`], lm[`elbow.${s}`], 0.436)); seg(0.016, mid(lm[`elbow.${s}`], lm[`wrist.${s}`], 0.430)); seg(0.006, lm[`grip.${s}`]);
    seg(0.100, mid(lm[`hip.${s}`], lm[`knee.${s}`], 0.433)); seg(0.0465, mid(lm[`knee.${s}`], lm[`ankle.${s}`], 0.433)); seg(0.0145, mid(lm[`heel.${s}`], lm[`toe.${s}`], 0.5));
  }
  return z / m;
}
// A grounded frame (box_jump's): feet flat at (y, z), hip height hipY; the root z is solved so the centre of mass is over mid-foot.
function grounded(y, z, hipY, angles) {
  const plant = { l: { at: [FOOT_X, y, z] }, r: { at: [-FOOT_X, y, z] } };
  let rz = z - 0.2;
  for (let i = 0; i < 40; i++) {
    const pose = chestHands({ ...angles, root: { at: [0, hipY, rz], tilt: angles.tilt }, plant });
    rz += z - comZ(landmarksOf(pose, H));
  }
  const { tilt, ...rest } = angles;
  return chestHands({ ...rest, root: { at: [0, hipY, +rz.toFixed(4)], tilt }, plant });
}
// j10 "hold the hands loosely at the chest": the hands HAND_FWD in front of the sternum along the thorax normal (the
// back-to-sternum direction), HAND_X of the shoulder's lateral offset, elbows down (pole). The thorax does not depend on
// the arms, so the targets come from the pose without its reach.
const sub3 = (a, b) => a.map((v, i) => v - b[i]), unit3 = a => { const n = Math.hypot(...a); return a.map(v => v / n); };
const chestHands = p => {
  const { reach, ...q } = p, l = landmarksOf(q, H), n = unit3(sub3(l.sternum, l.backUpper));
  const at = sd => [l[`shoulder.${sd}`][0] * HAND_X, l.sternum[1] + n[1] * HAND_FWD, l.sternum[2] + n[2] * HAND_FWD];
  return { ...q, reach: { l: { at: at('l'), pole: [0.2, -1, 0] }, r: { at: at('r'), pole: [-0.2, -1, 0] } } };
};
const start = grounded(0, 0, TAKEOFF_HIP, { tilt: TAKEOFF_TRUNK - 6, trunk: 6, neck: -12, ankle: 0 });
const end = grounded(0, 0, LAND_HIP, { tilt: LAND_TRUNK - 6, trunk: 6, neck: -10 });

// Full extension (j3): box_jump's ghost, the same feet on the balls.
const EXT_HEEL = 35, EXT_KNEE = 4, EXT_LEAN = 8;
const kneeAngle = lm => { const a = [0, 1, 2].map(i => lm['hip.r'][i] - lm['knee.r'][i]), b = [0, 1, 2].map(i => lm['ankle.r'][i] - lm['knee.r'][i]);
  return 180 - Math.acos((a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) / Math.hypot(...a) / Math.hypot(...b)) * 180 / Math.PI; };
const BALL0 = landmarksOf(start, H)['ball.r'];
function extAnkleY(th) { return 0.039 * H * Math.cos(th) + 0.12 * Math.sin(th); }   // ankle height on the balls (approx: sets the lean line only; the IK places the leg)
const ext = (() => {
  const th = EXT_HEEL * Math.PI / 180, n = [0, Math.cos(th), Math.sin(th)], t = [0, -Math.sin(th), Math.cos(th)];
  const plant = { l: { at: [FOOT_X, 0, BALL0[2]], normal: n, toe: t, ref: 'ball' }, r: { at: [-FOOT_X, 0, BALL0[2]], normal: n, toe: t, ref: 'ball' } };
  const lean = EXT_LEAN * Math.PI / 180;
  const pose = y => { const A = [0, extAnkleY(th), BALL0[2] - 0.12 * Math.cos(th)];
    return chestHands({ root: { at: [0, y, A[2] + (y - A[1]) * Math.tan(lean)], tilt: -EXT_LEAN + 6 }, trunk: 6, neck: -6, plant }); };
  let lo = 0.8, hi = 1.15;                                      // root height: knee bend EXT_KNEE (bisection)
  for (let i = 0; i < 50; i++) { const m = (lo + hi) / 2; if (kneeAngle(landmarksOf(pose(m), H)) > EXT_KNEE) lo = m; else hi = m; }
  return pose((lo + hi) / 2);
})();
// Panel mx13 R4 and mx15 (#358 6547089227, 6547988428): the FULL EXTENSION leader ends on a line of the extension ghost
// clear of the landing figure: its head (the hands now rest at the chest, in front of the landing head).
const EXT_HEAD_PT = landmarksOf(ext, H).head;

// Flight (box_jump's parabola): the hip from the extension up APEX above it and down to the landing hip in place.
const APEX = 0.25;
const P0 = ext.root.at, P1 = end.root.at;
const arc = t => {
  const y0 = P0[1], y1 = P1[1], top = Math.max(y0, y1) + APEX;
  const k = Math.sqrt(top - y0), l = Math.sqrt(top - y1), tp = k / (k + l), a = (top - y0) / (tp * tp);
  return [0, top - a * (t - tp) ** 2, P0[2] + (P1[2] - P0[2]) * t];
};
const ARC_D = (() => { const a = arc(0), b = arc(0.01); return [0, (b[1] - a[1]) / 0.01, (b[2] - a[2]) / 0.01]; })();
const RISE_C = (() => { const L = Math.hypot(ext.root.at[1] - start.root.at[1], ext.root.at[2] - start.root.at[2]) * 0.5, n = Math.hypot(ARC_D[1], ARC_D[2]);
  return [0, ext.root.at[1] - ARC_D[1] / n * L, ext.root.at[2] - ARC_D[2] / n * L]; })();
const riseAt = k => start.root.at.map((v, i) => (1 - k) ** 2 * v + 2 * k * (1 - k) * RISE_C[i] + k * k * ext.root.at[i]);
const rise = k => chestHands({ root: { at: riseAt(k), tilt: start.root.tilt + (ext.root.tilt - start.root.tilt) * k },
  trunk: 6, neck: -8, plant: k < 0.5 ? start.plant : ext.plant });
const fly = t => chestHands({ root: { at: arc(t), tilt: 6 + 14 * t }, trunk: 6, neck: -8,
  hip: 10 + 30 * t, knee: 10 + 40 * t, ankle: -10 });
void rise; void fly;   // the take-off rise and the flight are not drawn since LIB-PLATEFIX-3 (kept for the sizes they fix)
// LIB-PLATEFIX-3 item 6: the absorb from the touchdown (ext) to the landing (end), back then down.
const ABSORB = 12;
const ABS_C = [0, ext.root.at[1], end.root.at[2]];   // control point: touchdown height, landing z
const absorbAt = k => ext.root.at.map((v, i) => (1 - k) ** 2 * v + 2 * k * (1 - k) * ABS_C[i] + k * k * end.root.at[i]);
const balls = a => { const th = a * Math.PI / 180, n = [0, Math.cos(th), Math.sin(th)], t = [0, -Math.sin(th), Math.cos(th)];
  return { l: { at: [FOOT_X, 0, BALL0[2]], normal: n, toe: t, ref: 'ball' }, r: { at: [-FOOT_X, 0, BALL0[2]], normal: n, toe: t, ref: 'ball' } }; };
const absorb = k => chestHands({ root: { at: absorbAt(k), tilt: ext.root.tilt + (end.root.tilt - ext.root.tilt) * k },
  trunk: 6, neck: -6 + (-10 + 6) * k, plant: balls(EXT_HEEL * Math.max(0, 1 - 2 * k)) });
const via = Array.from({ length: ABSORB - 1 }, (_, i) => absorb((i + 1) / ABSORB));
// Every key plants the feet by the ball (the same spot as the landing's flat feet): the engine interpolates a plant's
// fields, so a 'ball' key next to a 'mid' key would slide the foot.
const landing = { ...end, plant: balls(0) };

// Mistake (j5): landing with straight, locked knees; same feet, hips high, trunk nearly upright.
const MISTAKE_HIP = 0.925, MISTAKE_TRUNK = 12;
const MISTAKE = grounded(0, 0, MISTAKE_HIP, { tilt: MISTAKE_TRUNK - 6, trunk: 6, neck: -6 });

const FLOOR = { point: [0, 0, 0], normal: [0, 1, 0] };

/** The unsourced sizes (lb4/DESIGN.md Resume 2). */
export const SIZES = { FOOT_X, TAKEOFF_HIP, TAKEOFF_TRUNK, LAND_HIP, LAND_TRUNK, EXT_HEEL, EXT_KNEE, EXT_LEAN, APEX, MISTAKE_HIP, MISTAKE_TRUNK, HAND_FWD, HAND_X };
export const POSES = { start, ext, end, mistake: MISTAKE };

export default {
  id: 'jump_squat', name: 'Jump Squat', view: 'side', facing: 'right',
  camera: { x0: 180, y0: 339 },
  poses: { start: ext, via, end: landing },
  equipment: [{ type: 'floor', from: -0.75, to: 0.75 }],
  checks: [
    ...['heel', 'ball', 'sole'].flatMap(p => ['l', 'r'].flatMap(s => ['end', 'mistake'].map(pose => ({ landmark: `${p}.${s}`, plane: FLOOR, pose, tol: 0.5 })))),
    ...['l', 'r'].map(s => ({ landmark: `ball.${s}`, plane: FLOOR, pose: 'start', tol: 0.5 })),   // the touchdown on the balls (j3)
  ],
  ghosts: { count: 1 },                                   // t = 0.5: the mid-absorb key (via[5])
  trace: { point: 'hip.r', trim: [10, 12] },
  callouts: [
    { key: 'hips', text: 'Hips back', anchor: { at: 'hip.r', pose: 'end' }, cue: 'Send the hips back, then down, keeping the back flat.' },
    { key: 'extend', text: 'Full<br>extension', anchor: EXT_HEAD_PT, box: { left: 262, top: 84 }, cue: 'Jump by extending ankles, knees and hips together.' },
    { key: 'land', text: 'Soft landing', anchor: 'knee.r', box: { left: 250, top: 270 }, cue: 'Land quietly on the mid-foot, hips back and down, knees bent.' },
  ],
  mistake: {
    pose: { ...MISTAKE, plant: balls(0) },   // the landing's ball-ref plant (same spot as the mid-ref one)
    // box_jump's end→Mistake knee arrow is not copied: it starts inside the solid end figure, and LB4's A15 asks every
    // solid red part to clear the end figure by 6 px (lb4-plates.test.ts). The red Mistake legs and the tell carry it.
    guides: [],
    tells: [
      // LIB-PLATEFIX-3 item 6: one tell; "Hips high" is gone (its cue is j5-unsupported, #392 6650499991).
      { key: 'straight', text: 'Knees straight', anchor: { at: 'knee.r', pose: 'mistake' }, box: { left: 16, top: 306 }, cue: 'The knees stay straight and locked on the landing.' },
    ],
  },
  tempo: [{ phase: 'Lower', move: true, word: 'Controlled' }, { phase: 'Jump', move: true, word: 'Explosive' }],   // tempoOf(strip/rows.json jump_squat)
  alt: 'Jump squat, side view. Touchdown frame: full extension on the balls of the feet, hands loosely at the chest. On landing the hips go back, then down: in the same spot, feet flat, knees and hips bent, trunk slightly forward.',   // LIB-PLATEFIX-3 item 6 (j3, j4)
};
