// Standing leg curl (standing leg curl machine), side view, figure facing screen right. LIB-18 (LB8, mode H,
// 'LIB-18 resume'; tier C; census closest leg_press, closeness N: D-LIB18-CLONE; composer `legCurlMachine`, pilot B's,
// imported from main, never copied, forked or edited: D-LIB18-LEGCURL; pose classes stand and single leg, anchor
// single_leg_romanian_deadlift: D-LIB18-CLASSES).
// View: side (card plate.view = census view). The pad just above the heel (c1), the thighs on the support pad (c2), the
//  standing foot planted (c3), the knee staying steady (c6), the foot rising above the knee (c4) and the fault, the
//  lower back arching (c13), all read side-on.
// Sources: research card docs/research/howto/cards/standing_leg_curl.json (research head 596dbe07): callouts =
//  plate.checkpoints (c6 Knee steady; c3/c2 Upper body still; c4 Foot above knee); Mistake = plate.mistake (c13: the
//  lower back arching as the leg curls; drawable false; topFault 'drop', F7); tempo = the card's tempo (Curl 1, Hold 1,
//  Lower 2: c15, c16; lb8/tempo.json's row); Trace = the heel (c3 "pulling your heel up toward your glutes"; c4;
//  D-LIB18-TRACE).
// Clone sources (copied, never imported; D-LIB9-CLONE): single_leg_romanian_deadlift (main, pilot A) for the one
//  planted foot and the free working leg (single_leg_romanian_deadlift.mjs:48, :55, `stance`); superman (main, LB9) for
//  contacts solved on the drawn outlines (superman.mjs:57-58, :70-73); seated_leg_curl (main, pilot B) for the ankle
//  pad on the drawn calf (seated_leg_curl.mjs:44, :55-62, ANKLE_T), the pivot at the knee joint (:64) and the floor beam's
//  front reach past the pivot (:68, +0.16 m); leg_press (main, the 8) for the Trace trim (:132); barbell_back_squat
//  (main, the 8) for the standing soft knee and the straight-quote knee (barbell_back_squat.mjs:30; #306 6355447835
//  Q10 1); hanging_leg_raise (main, the 8) for the 12 deg lumbar arch (hanging_leg_raise.mjs:69). Every bisection here
//  throws on a bracket with no root.
// Equipment: pilot B's legCurlMachine for the lever with its ankle roller, the pivot boss, the thigh pad on its
//  bracket, the pivot post, the handle and the floor beam. The composer reads `seat` for its seat post
//  (eq/legCurlMachine.mjs:39-41), so the spec passes the floor beam's top under the pivot as that point and keeps only
//  the items it draws, by the composer's documented order (:31-32; KEEP below): the standing machine has no seat and no
//  back pad (S7, #325).
// Pose map (lb8/DESIGN.md section 10): identity. Start = plate.start (standing, thighs against the support pad, hands on
//  the handles, c2; standing foot planted, c3; working leg straight with the pad just above its heel, c1, c4; upper
//  body still, c3). End = plate.end (working knee bent until the foot is higher than the knee, c4; knee in the same
//  place, c6; upper body and low back unchanged, c3, c13).
// Geometry decisions (confirmed by the engine report `angles`, `checks` and the drawn-item tests):
//  Lean (c2 Hevy "Lean forward on the machine"; #306 6355447835 Q10 5): the pelvis and trunk tilt LEAN forward and both
//   hips flex LEAN, so both thighs hang plumb against the pad; the same in every pose (c3 "keeping your upper body
//   still", c6 the knee steady).
//  Standing leg (left, c3 "plant your left foot firmly on the floor"): knee STANCE_KNEE (the standing soft knee, no lock
//   the card does not ask for); the ankle solved so the drawn foot lies flat, the root height so its lowest drawn point
//   is on the floor.
//  Working leg (right, c3 "Curl the weight up with your right leg"): start knee START_KNEE (c4 "extend your knee fully":
//   the straight-quote knee, Q10 1); end knee END_KNEE (c4 "until your foot becomes higher than your knee"); ankle
//   at the standing ankle's ANKLE_L (no claim gives it; at the start the foot rests flat, never through the floor).
//  Thigh pad (c2 "placing your thighs against the supportive pad"): a roller on thighTop (the front of the thigh just
//   above the knee), on its bracket to the pivot.
//  Pivot (c6 "keep your knee steady"): the working knee joint; the composer draws the boss there.
//  Ankle pad (c1 "the pad rests just above the heel of the working leg"): on the back of the lower leg at ANKLE_T of the
//   shank from the knee, on the drawn calf (seated_leg_curl.mjs ANKLE_T).
//  Hands (c2 "grab the handles"): the fists on the handles ahead of the hips, elbows bent.
//  Mistake (c13; hanging_leg_raise.mjs:69): the end pose with the lumbar extended M_ARCH (trunk -M_ARCH); the pelvis,
//   the thighs on the pad and the feet keep their places; the hands keep the handles. The faulty back contour is a red
//   dashed guide.
//  Balance (D-LIB18-BALANCE): the centre of mass between the standing foot and the thigh pad.
// Labels: "Knee steady" meets the pivot boss; "Upper body still" meets the upper back; "Foot above knee" meets the end
//  heel. The Mistake's one tell (record in DESIGN.md section 10) meets the red dashed lower back.
// Camera: fit (capped at the reference scale).
// Unsourced numbers (SIZES below; lb8/sizes.json holds each with its basis): LEAN, STANCE_X, STANCE_KNEE, START_KNEE,
//  END_KNEE, ANKLE_T, M_ARCH, HANDLE, BEAM_BACK, BEAM_FRONT, UPRIGHT_T, TRACE_TRIM; the composer's sizes
//  (eq/legCurlMachine.mjs:19-21); ANKLE_L (the standing ankle) and ROOT_Y (the root height) solved.
import { RADII, landmarksOf, normPose, resolve, fk, bodyShapes } from '../engine.mjs';
import { perItem, sideBar } from '../eq/parts.mjs';
import { legCurlMachine, LEG_CURL_ITEMS } from '../eq/legCurlMachine.mjs';

const H = 1.75;
export const SIZES = Object.freeze({ LEAN: 10, STANCE_KNEE: 5, START_KNEE: 5, END_KNEE: 110, ANKLE_T: 0.85, M_ARCH: 12, HANDLE: [0.22, 0.10, 0.30],
  BEAM_BACK: 0.10, BEAM_FRONT: 0.16, UPRIGHT_T: 0.04, TRACE_TRIM: [6, 8] });
const { LEAN, STANCE_KNEE, START_KNEE, END_KNEE, ANKLE_T, M_ARCH, HANDLE, BEAM_BACK, BEAM_FRONT, UPRIGHT_T, TRACE_TRIM } = SIZES;

// The drawn outlines in world metres: a side camera at 1 px/m, screen y down (superman.mjs:57-58).
const CAM = { view: 'side', near: 'r', pxm: 1, P: w => [w[2], -w[1]] };
const shapesOf = pose => { const b = { height: H }, r = resolve(normPose(pose, b), b); return bodyShapes(fk(r.q, b), CAM).filter(s => s.poly); };
const lowOf = (pose, re) => { let m = Infinity; for (const s of shapesOf(pose)) if (re.test(s.key)) for (const v of s.poly) m = Math.min(m, -v[1]); return m; };
// Bisection on one value for a residual g (monotone over [a, b]); throws without a sign change or without converging.
function root1(g, a, b, what) {
  let ga = g(a);
  const gb = g(b);
  if (!(ga * gb <= 0)) throw new Error(`standing_leg_curl: no bracket for ${what} (${ga}, ${gb})`);
  for (let i = 0; i < 80; i++) {
    const m = (a + b) / 2, gm = g(m);
    if (Math.abs(gm) < 1e-7) return m;
    if (ga * gm <= 0) b = m; else { a = m; ga = gm; }
  }
  throw new Error(`standing_leg_curl: ${what} did not converge`);
}

// ---- the body: both thighs plumb (LEAN), the standing foot flat on the floor ----
const legs = (knee, ankleL, y) => ({ root: { at: [0, y, 0], tilt: LEAN }, trunk: 0, neck: 0, hip: { l: LEAN, r: LEAN }, knee: { l: STANCE_KNEE, r: knee },
  ankle: { l: ankleL, r: ankleL } });
// the standing ankle: heel and ball level (the foot flat)
export const ANKLE_L = root1(a => { const lm = landmarksOf(legs(START_KNEE, a, 1), H); return lm['heel.l'][1] - lm['ball.l'][1]; }, -20, 20, 'the standing foot flat');
// the root height: the standing foot's lowest drawn point on the floor
export const ROOT_Y = (() => { const y = 1; return y - lowOf(legs(START_KNEE, ANKLE_L, y), /^foot\.l$/); })();
const L0 = landmarksOf(legs(START_KNEE, ANKLE_L, ROOT_Y), H);
// the hands on the handles ahead of the hips (c2)
const GRIP = s => [s * HANDLE[0], L0.hips[1] + HANDLE[1], L0.hips[2] + HANDLE[2]];
const hands = { l: { at: GRIP(1), pole: [1, -0.3, 0] }, r: { at: GRIP(-1), pole: [-1, -0.3, 0] } };
const pose = knee => ({ ...legs(knee, ANKLE_L, ROOT_Y), reach: hands });
export const start = pose(START_KNEE);
export const end = pose(END_KNEE);
export const mistakePose = { trunk: -M_ARCH };
export const LS = landmarksOf(start, H), LE = landmarksOf(end, H), LM = landmarksOf({ ...end, ...mistakePose }, H);

// ---- the machine ----
export const PIVOT = [0, LS['knee.r'][1], LS['knee.r'][2]];            // the axis at the working knee joint (c6)
// shank radius (m) at fraction t from the knee: the engine's limb taper (geom.mjs limbR, body.mjs RADII.shank;
// seated_leg_curl.mjs:55)
const shankR = t => { const [rA, rM, rB, m] = RADII.shank, r = t < m ? rA + (rM - rA) * Math.sin((t / m) * Math.PI / 2) : rM + (rB - rM) * (1 - Math.cos(((t - m) / (1 - m)) * Math.PI / 2)); return r * H; };
/** The ankle pad's contact on the back of the near shank in a pose, and its outward normal (side view;
 *  seated_leg_curl.mjs:57-62). */
export function anklePadOf(lm) {
  const k = lm['knee.r'], a = lm['ankle.r'], u = [0, a[1] - k[1], a[2] - k[2]], L = Math.hypot(u[1], u[2]);
  const d = [0, u[1] / L, u[2] / L], n = [0, -d[2], d[1]];             // n: the back of the leg (calf side)
  const r = shankR(ANKLE_T);
  return { at: [0, k[1] + u[1] * ANKLE_T + n[1] * r, k[2] + u[2] * ANKLE_T + n[2] * r], normal: n };
}
// the thigh pad's contact (the front of the thigh just above the knee) and its normal, the same in every pose
const THIGH = [0, LS['thighTop.r'][1], LS['thighTop.r'][2]];
const THIGH_N = (() => { const h = LS['hip.r'], k = LS['knee.r'], u = [k[1] - h[1], k[2] - h[2]], L = Math.hypot(...u); return [0, u[1] / L, -u[0] / L]; })();   // seated_leg_curl.mjs:65
// The composer's items, by its documented order (eq/legCurlMachine.mjs:29-30): 0 lever, 1 ankle pad, 2 pivot boss,
// 3 thigh pad, 4 seat, 5 seat post, 6 back pad, 7 pivot post, 8 handle, 9 floor beam. Kept: what the standing machine has.
export const KEEP = [0, 1, 2, 3, 7, 8, 9];
const BASE = [Math.min(LS['heel.l'][2], LS['heel.r'][2]) - BEAM_BACK, PIVOT[2] + BEAM_FRONT];
export const rigOf = lm => { const ap = anklePadOf(lm);
  const all = legCurlMachine({ pivot: PIVOT, ankle: ap.at, ankleN: ap.normal, thigh: THIGH, thighN: THIGH_N, seat: [0, 0.05, PIVOT[2]], back: null,
    handle: [0, GRIP(-1)[1], GRIP(-1)[2]], base: BASE });
  if (all.length !== LEG_CURL_ITEMS) throw new Error(`standing_leg_curl: legCurlMachine returned ${all.length} items, not its documented ${LEG_CURL_ITEMS}`);
  return KEEP.map(k => all[k]); };
// The handle's strut: from the top of the thigh pad's roller to the composer's handle bar (its lower end,
// eq/legCurlMachine.mjs:43), so the handle is carried by the frame through the thigh pad's bracket (D-LIB18-FRAME).
const PAD_C = [0, THIGH[1] + THIGH_N[1] * 0.055, THIGH[2] + THIGH_N[2] * 0.055];
const UPRIGHT = { ...sideBar([0, PAD_C[1] + 0.055, PAD_C[2]], [0, GRIP(-1)[1] - 0.10, GRIP(-1)[2] - 0.02], UPRIGHT_T, { z: 'back' }), part: 'upright' };
// The roller's contact with the lower leg (leg_extension.mjs:180-188), as two planes through the drawn ankle pad of a
// pose: across the shank at the pad's foot on the shank axis less (1 - ANKLE_T) of the shank (the ankle joint lies on
// it), and along the shank axis (the ankle joint, on the axis, lies on it while the pad rests on the calf).
export const rollerPlanes = lm => {
  const ap = anklePadOf(lm), k = lm['knee.r'], a = lm['ankle.r'], u = [0, a[1] - k[1], a[2] - k[2]], L = Math.hypot(u[1], u[2]), d = [0, u[1] / L, u[2] / L];
  const foot = [0, ap.at[1] - ap.normal[1] * shankR(ANKLE_T), ap.at[2] - ap.normal[2] * shankR(ANKLE_T)];
  return { across: { point: [0, foot[1] + d[1] * (1 - ANKLE_T) * L, foot[2] + d[2] * (1 - ANKLE_T) * L], normal: d }, along: { point: foot, normal: ap.normal } };
};
const RP0 = rollerPlanes(LS);
// The card's facts (lb8 DESIGN.md section 11; D-LIB18-FACTS): each contact bound by a check on its landmark and pose.
const factChecks = (pose, p, names) => names.map(landmark => ({ landmark, at: landmarksOf(p, H)[landmark], pose, tol: 0.5 }));
const rollerChecks = names => names.flatMap(landmark => [{ landmark, plane: RP0.across, pose: 'start', tol: 0.5 }, { landmark, plane: RP0.along, pose: 'start', tol: 0.5 }]);
// The start layer drops moving equipment (seated_leg_curl.mjs:69-72): the start roller is redrawn as a dashed phantom
// in the end layer (13 Q2 (c)).
const START_PAD = (() => { const ap = anklePadOf(LS), r = 0.055, c = [0, ap.at[1] + ap.normal[1] * r, ap.at[2] + ap.normal[2] * r];
  return Array.from({ length: 17 }, (_, k) => [0, c[1] + r * Math.sin(k * Math.PI / 8), c[2] + r * Math.cos(k * Math.PI / 8)]); })();
const FLOOR = { point: [0, 0, 0], normal: [0, 1, 0] };
export const info = () => ({ ankleL: +ANKLE_L.toFixed(2), rootY: +ROOT_Y.toFixed(4), kneeY: +PIVOT[1].toFixed(3), endAnkleAboveKneeCm: +((LE['ankle.r'][1] - LE['knee.r'][1]) * 100).toFixed(1),
  endHeelAboveKneeCm: +((LE['heel.r'][1] - LE['knee.r'][1]) * 100).toFixed(1) });

export default {
  id: 'standing_leg_curl', name: 'Standing Leg Curl', view: 'side', facing: 'right',
  camera: { fit: true },
  poses: { start, end },
  equipment: [
    { type: 'floor', from: BASE[0] - 0.05, to: BASE[1] + 0.05 },
    ...perItem(lm => rigOf(lm), KEEP.length),
    UPRIGHT,
    (lm, ctx) => (ctx.pose === 'end' ? { type: 'line', cls: 'eq-line m-line', pts: START_PAD, z: 'front', part: 'startpad' } : null),
  ],
  checks: [
    { landmark: 'knee.r', at: LS['knee.r'], pose: 'all', tol: 1 },                                   // c6: the knee steady at the axis
    ...['thighTop.l', 'thighTop.r'].map(landmark => ({ landmark, at: LS[landmark], pose: 'all', tol: 0.5 })),   // c2: thighs on the pad
    ...['grip.l', 'grip.r'].map(landmark => ({ landmark, at: GRIP(landmark.endsWith('l') ? 1 : -1), pose: 'all', tol: 0.5 })),   // c2: hands on the handles
    ...['heel.l', 'ball.l'].map(landmark => ({ landmark, at: LS[landmark], pose: 'all', tol: 0.5 })),   // c3: the standing foot planted
    ...factChecks('start', start, ['wrist.l', 'wrist.r']),                                            // c2: grab the handles
    ...rollerChecks(['ankle.r']),                                                                     // c2, c1: the back of the leg against the lower pad
    ...['heel.l', 'ball.l', 'toe.l', 'heel.r', 'toe.r'].map(landmark => ({ landmark, above: FLOOR, pose: 'all', tol: 0 })),
  ],
  startParts: ['leg.r', 'lever'],
  ghosts: { count: 2, parts: ['leg.r', 'lever'] },
  trace: { point: 'heel.r', trim: TRACE_TRIM },
  tempo: [{ phase: 'Curl', s: 1, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Lower', s: 2, move: true }],
  callouts: [
    { key: 'knee', text: 'Knee<br>steady', anchor: { at: 'knee.r', off: [7.5, 0] }, box: { left: 228, top: 292 }, cue: 'Keep your knee steady as it bends and straightens.' },
    { key: 'still', text: 'Upper body<br>still', anchor: 'backUpper', box: { left: 60, top: 110 }, cue: 'Thighs on the pad, upper body still.' },
    { key: 'foot', text: 'Foot above<br>knee', anchor: { at: 'heel.r', pose: 'end' }, box: { left: 30, top: 184 }, cue: 'Curl until your foot is higher than your knee.' },
  ],
  // LIB-ZOOM's inline zoom circle (D-LIBZOOM-EXTEND, #325 6405116791): the Mistake's fault drawn again at k 3.5, the smallest of
  // 1.5-4 whose tell-anchor move reaches deviationMin 11.39 px at the zoom's own scale (12.0 px); zoom/inline.mjs places it.
  zoom: { view: 'mistake', k: 3.5 },
  mistake: {
    pose: mistakePose,
    parts: ['torso', 'head'],
    guides: [
      { kind: 'dashed', smooth: true, pts: [{ at: 'backUpper', pose: 'mistake' }, { at: 'backMid', pose: 'mistake' }, { at: 'sacrum', pose: 'mistake' }, { at: 'buttock', pose: 'mistake' }] },
    ],
    tells: [
      { key: 'arch', text: 'Low back<br>arches', anchor: { at: 'backMid', pose: 'mistake' }, box: { left: 40, top: 120 }, cue: 'Your lower back arches as your leg curls.' },
    ],
  },
  alt: 'Standing leg curl, side view. Leaning on the machine with the thighs on the support pad, the hands on the handles and the left foot planted, the lifter curls the right heel toward the glutes until the foot is above the knee.',
};
