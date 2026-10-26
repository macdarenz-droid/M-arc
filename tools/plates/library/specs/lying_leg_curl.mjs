// Lying leg curl (lying leg curl machine), side view, figure facing screen right (head right, feet left), lying face
// down on the bench. LIB-18 (LB8, mode H, 'LIB-18 resume'; tier C; census closest leg_press, closeness N:
// D-LIB18-CLONE; composer `legCurlMachine`, pilot B's, imported from main, never copied, forked or edited:
// D-LIB18-LEGCURL; pose class prone, its first user on the LB8 sheet: D-LIB18-CLASSES).
// View: side (card plate.view = census view). The knee at the machine's axis (c1), the roller just above the heels
//  (c3), the front of the hips on the pad (c5, c8), the knee bend (c6, c7) and the fault, the lower back arching (c9,
//  c10), all read side-on.
// Sources: research card docs/research/howto/cards/lying_leg_curl.json (research head 596dbe07): callouts =
//  plate.checkpoints (c1 Knee at axis; c5/c8 Hips on pad; c9/c5 Low back still); Mistake = plate.mistake (c9, c10:
//  the lower back arching as the legs curl; drawable false; topFault 'axis', F7); tempo = the card's tempo (Curl 1,
//  Hold 1, Lower 3: c18, c20; lb8/tempo.json's row); Trace = the heel under the roller (c7 "curl your heels toward your
//  glutes"; D-LIB18-TRACE).
// Clone sources (copied, never imported; D-LIB9-CLONE): superman (main, LB9) for the prone body on a support: the trunk
//  rested on its drawn chest and pelvis, the legs on their drawn outline (superman.mjs:76-86, :105); seated_leg_curl
//  (main, pilot B) for the ankle pad on the drawn calf (seated_leg_curl.mjs:44, :55-62, ANKLE_T) and the pivot at the knee
//  joint (:54); leg_press (main, the 8) for the start knee's soft bend (leg_press.mjs:13) and the Trace trim (:132);
//  hanging_leg_raise (main, the 8) for the 12 deg lumbar arch (hanging_leg_raise.mjs:69). Every bisection here throws on
//  a bracket with no root.
// Equipment: the flat bench pad (vendor `bench`, equipment.mjs:157-158, top 0.43 m) under the chest, hips and thighs;
//  pilot B's legCurlMachine for the lever with its ankle roller, the pivot boss, the pivot post, the side handle and
//  the floor beam. The composer reads `seat` for its seat post (eq/legCurlMachine.mjs:39-41), so the spec passes the
//  bench pad's top as that point and keeps only the items it draws, by the composer's documented order (:31-32;
//  KEEP below): the lying machine has no seat, back pad or thigh pad (S7, #325).
// Pose map (lb8/DESIGN.md section 10): identity. Start = plate.start (face down, the front of the hips on the pad, c5;
//  knees close to the bench edge and in line with the axis, c1; knees nearly straight, c6; roller just above the
//  heels, c3; hands on the handles, c5). End = plate.end (knees bent more than 90 degrees, c7; hips still on the pad,
//  c7, c8; low back not arched, c9).
// Geometry decisions (confirmed by the engine report `angles`, `checks` and the drawn-item tests):
//  Trunk on the bench (superman.mjs:76-86): the pelvis tilt solved so the drawn torso's lowest points head-side and
//   foot-side of the navel touch the bench top together; trunk 0, neck 0 (head in line, face down).
//  Thighs on the bench: the hip angle solved so the drawn thigh's lowest point rests on the bench top at the start;
//   the thigh does not move (the knee stays at the axis, c1).
//  Knees at the bench edge (c1 "close to the edge of the bench"): the bench's foot end lies KNEE_OUT ahead of the knee
//   joint, so the kneecap clears the edge.
//  Pivot (c1): the start knee joint; the composer draws the boss there. The thigh is the same in every pose, so the knee
//   stays on the axis.
//  Roller (c3 "just above the heel", c4 "lowest comfortable position"): the ankle pad on the back of the lower leg at
//   ANKLE_T of the shank from the knee (seated_leg_curl.mjs ANKLE_T, pilot B's "just above the shoes"), on the drawn
//   calf (the engine's shank radius there).
//  Start knee START_KNEE (c6 "nearly straight, but do not force them into a painful locked position": leg_press's soft
//   bend); end knee END_KNEE (c7 "bent more than 90 degrees", one of its three "or" options). Ankles neutral (0): no
//   claim gives them.
//  Hands (c5 "Hold the handles"): the fists on the side handles ahead of and below the shoulders, elbows bent out to the
//   side.
//  Mistake (c9, c10; hanging_leg_raise.mjs:69): the end pose with the lumbar extended M_ARCH (trunk -M_ARCH); the pelvis
//   keeps its tilt and its place, so the hips stay on the pad (c8 is its own fault), and the chest lifts off the bench;
//   the hands keep the handles. The faulty back contour is a red dashed guide.
// Labels: "Knee at axis" meets the pivot boss's upper rim; "Hips on pad" meets the front of the hips on the pad (the
//  navel); "Low back still" meets the end pose's lower back (backMid). The Mistake's one tell (record in DESIGN.md
//  section 10) meets the red dashed lower back.
// Camera: fit (capped at the reference scale).
// Unsourced numbers (SIZES below; lb8/sizes.json holds each with its basis): BENCH_TOP, KNEE_OUT, BENCH_LEN,
//  START_KNEE, END_KNEE, ANKLE_T, M_ARCH, HANDLE, BEAM_BACK, UPRIGHT_T, TRACE_TRIM; the composer's sizes
//  (eq/legCurlMachine.mjs:19-21); TILT (the trunk tilt), HIP (the hip angle) and ROOT_Y (the root height) solved.
import { RADII, landmarksOf, normPose, resolve, fk, bodyShapes } from '../engine.mjs';
import { perItem, sideBar } from '../eq/parts.mjs';
import { legCurlMachine, LEG_CURL_ITEMS } from '../eq/legCurlMachine.mjs';

const H = 1.75;
export const SIZES = Object.freeze({ BENCH_TOP: 0.43, KNEE_OUT: 0.04, BENCH_LEN: 1.2, START_KNEE: 15, END_KNEE: 100, ANKLE_T: 0.85, M_ARCH: 12,
  HANDLE: [0.22, -0.12, 0.30], BEAM_BACK: 0.30, UPRIGHT_T: 0.04, TRACE_TRIM: [6, 8] });
const { BENCH_TOP, KNEE_OUT, BENCH_LEN, START_KNEE, END_KNEE, ANKLE_T, M_ARCH, HANDLE, BEAM_BACK, UPRIGHT_T, TRACE_TRIM } = SIZES;

// The drawn outlines in world metres: a side camera at 1 px/m, screen y down (superman.mjs:57-58).
const CAM = { view: 'side', near: 'r', pxm: 1, P: w => [w[2], -w[1]] };
const shapesOf = pose => { const b = { height: H }, r = resolve(normPose(pose, b), b); return bodyShapes(fk(r.q, b), CAM).filter(s => s.poly); };
// Bisection on one value for a residual g (monotone over [a, b]); throws without a sign change or without converging.
function root1(g, a, b, what) {
  let ga = g(a);
  const gb = g(b);
  if (!(ga * gb <= 0)) throw new Error(`lying_leg_curl: no bracket for ${what} (${ga}, ${gb})`);
  for (let i = 0; i < 80; i++) {
    const m = (a + b) / 2, gm = g(m);
    if (Math.abs(gm) < 1e-7) return m;
    if (ga * gm <= 0) b = m; else { a = m; ga = gm; }
  }
  throw new Error(`lying_leg_curl: ${what} did not converge`);
}

// ---- the trunk on the bench (superman.mjs:76-86): the drawn chest and pelvis at one height, the bench top ----
const torsoLows = pose => {
  const lm = landmarksOf(pose, H), nz = lm.navel[2], t = shapesOf(pose).find(s => s.key === 'torso').poly;
  let hd = Infinity, tl = Infinity; for (const v of t) { if (v[0] > nz) hd = Math.min(hd, -v[1]); else tl = Math.min(tl, -v[1]); }
  return [hd, tl];
};
export const TILT = root1(t => { const [hd, tl] = torsoLows({ root: { at: [0, 0.6, 0], tilt: t }, trunk: 0, neck: 0 }); return hd - tl; }, 80, 96, 'the trunk on the bench');
export const ROOT_Y = (() => { const [hd] = torsoLows({ root: { at: [0, 0.6, 0], tilt: TILT }, trunk: 0, neck: 0 }); return 0.6 - hd + BENCH_TOP; })();
const ROOT = [0, ROOT_Y, 0];
const trunkPose = (trunk = 0) => ({ root: { at: ROOT, tilt: TILT }, trunk, neck: 0, ankle: 0 });
const lowOf = (pose, re) => { let m = Infinity; for (const s of shapesOf(pose)) if (re.test(s.key)) for (const v of s.poly) m = Math.min(m, -v[1]); return m; };
// the thighs on the bench at the start (the hip angle solved; superman.mjs:105)
export const HIP = root1(h => lowOf({ ...trunkPose(), hip: h, knee: START_KNEE }, /^thigh\./) - BENCH_TOP, -30, 30, 'the thighs on the bench');
const L0 = landmarksOf({ ...trunkPose(), hip: HIP, knee: START_KNEE }, H);
// the hands on the side handles ahead of and below the shoulders (c5)
const GRIP = s => [s * HANDLE[0], BENCH_TOP + HANDLE[1], L0.shoulders[2] + HANDLE[2]];
const hands = { l: { at: GRIP(1), pole: [1, 0.3, 0] }, r: { at: GRIP(-1), pole: [-1, 0.3, 0] } };
const pose = (knee, trunk = 0) => ({ ...trunkPose(trunk), hip: HIP, knee, reach: hands });
export const start = pose(START_KNEE);
export const end = pose(END_KNEE);
export const mistakePose = { trunk: -M_ARCH };
export const LS = landmarksOf(start, H), LE = landmarksOf(end, H), LM = landmarksOf({ ...end, ...mistakePose }, H);

// ---- the bench and the machine ----
export const BENCH_END = LS['knee.r'][2] + KNEE_OUT;                   // the bench's foot end, KNEE_OUT ahead of the knee (c1)
export const PIVOT = [0, LS['knee.r'][1], LS['knee.r'][2]];            // the axis level with the knee joint (c1)
// shank radius (m) at fraction t from the knee: the engine's limb taper (geom.mjs limbR, body.mjs RADII.shank;
// seated_leg_curl.mjs:55)
const shankR = t => { const [rA, rM, rB, m] = RADII.shank, r = t < m ? rA + (rM - rA) * Math.sin((t / m) * Math.PI / 2) : rM + (rB - rM) * (1 - Math.cos(((t - m) / (1 - m)) * Math.PI / 2)); return r * H; };
/** The ankle pad's contact on the back of the near shank in a pose, and its outward normal (side view;
 *  seated_leg_curl.mjs:57-62). Prone, the back of the leg faces up. */
export function anklePadOf(lm) {
  const k = lm['knee.r'], a = lm['ankle.r'], u = [0, a[1] - k[1], a[2] - k[2]], L = Math.hypot(u[1], u[2]);
  const d = [0, u[1] / L, u[2] / L], n = [0, -d[2], d[1]];             // n: the back of the leg (calf side)
  const r = shankR(ANKLE_T);
  return { at: [0, k[1] + u[1] * ANKLE_T + n[1] * r, k[2] + u[2] * ANKLE_T + n[2] * r], normal: n };
}
// The composer's items, by its documented order (eq/legCurlMachine.mjs:29-30): 0 lever, 1 ankle pad, 2 pivot boss,
// 3 thigh pad, 4 seat, 5 seat post, 6 back pad, 7 pivot post, 8 handle, 9 floor beam. Kept: what the lying machine has.
export const KEEP = [0, 1, 2, 7, 8, 9];
const BASE = [BENCH_END - BEAM_BACK, Math.max(BENCH_END + BENCH_LEN, GRIP(-1)[2] + 0.05)];
export const rigOf = lm => { const ap = anklePadOf(lm);
  const all = legCurlMachine({ pivot: PIVOT, ankle: ap.at, ankleN: ap.normal, thigh: null, thighN: null, seat: [0, BENCH_TOP, BENCH_END + BENCH_LEN / 2],
    back: null, handle: [0, GRIP(-1)[1], GRIP(-1)[2]], base: BASE });
  if (all.length !== LEG_CURL_ITEMS) throw new Error(`lying_leg_curl: legCurlMachine returned ${all.length} items, not its documented ${LEG_CURL_ITEMS}`);
  return KEEP.map(k => all[k]); };
// The handle's upright: from the floor beam's top to the composer's handle bar (its lower end, eq/legCurlMachine.mjs:43),
// so the handle is carried by the frame (D-LIB18-FRAME).
const UPRIGHT = { ...sideBar([0, 0.05, GRIP(-1)[2] - 0.02], [0, GRIP(-1)[1] - 0.10, GRIP(-1)[2] - 0.02], UPRIGHT_T, { z: 'back' }), part: 'upright' };
const BENCH = { type: 'bench', at: [0, BENCH_TOP, BENCH_END + BENCH_LEN / 2], len: BENCH_LEN, z: 'back', part: 'bench' };
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
const TOP = { point: [0, BENCH_TOP, 0], normal: [0, 1, 0] };
export const info = () => ({ tilt: +TILT.toFixed(2), hip: +HIP.toFixed(2), benchEnd: +BENCH_END.toFixed(3), kneeZ: +LS['knee.r'][2].toFixed(3),
  navelY: +LS.navel[1].toFixed(4), chestY: [LS.chest[1], LM.chest[1]].map(v => +v.toFixed(3)), heelEnd: LE['heel.r'].map(v => +v.toFixed(3)) });

export default {
  id: 'lying_leg_curl', name: 'Lying Leg Curl', view: 'side', facing: 'right',
  camera: { fit: true },
  poses: { start, end },
  equipment: [
    { type: 'floor', from: Math.min(BASE[0], LS['toe.r'][2]) - 0.05, to: BENCH_END + BENCH_LEN + 0.05 },
    BENCH,
    ...perItem(lm => rigOf(lm), KEEP.length),
    UPRIGHT,
    (lm, ctx) => (ctx.pose === 'end' ? { type: 'line', cls: 'eq-line m-line', pts: START_PAD, z: 'front', part: 'startpad' } : null),
  ],
  checks: [
    ...['start', 'end'].map(p => ({ landmark: 'navel', plane: TOP, pose: p, tol: 0.5 })),          // c5: the front of the hips on the pad
    { landmark: 'chest', plane: TOP, pose: 'start', tol: 0.5 },                                       // c1: lying on the stomach on the machine
    ...factChecks('start', start, ['wrist.l', 'wrist.r']),                                            // c5: hold the handles
    ...rollerChecks(['ankle.l', 'ankle.r']),                                                          // c3: the roller against the lower calf
    { landmark: 'navel', plane: TOP, pose: 'mistake', tol: 0.5 },                                     // the Mistake keeps the hips down
    { landmark: 'knee.r', at: LS['knee.r'], pose: 'all', tol: 1 },                                          // c1: the knee at the axis
    ...['grip.l', 'grip.r'].map(landmark => ({ landmark, at: GRIP(landmark.endsWith('l') ? 1 : -1), pose: 'all', tol: 0.5 })),   // c5: hands on the handles
  ],
  startParts: ['leg.r', 'leg.l', 'lever'],
  ghosts: { count: 2, parts: ['leg.r', 'lever'] },
  trace: { point: 'heel.r', trim: TRACE_TRIM },
  tempo: [{ phase: 'Curl', s: 1, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Lower', s: 3, move: true }],
  callouts: [
    { key: 'axis', text: 'Knee at<br>axis', anchor: [0, PIVOT[1] - 0.03 * Math.sin(Math.PI / 9), PIVOT[2] - 0.03 * Math.cos(Math.PI / 9)], box: { left: 14, top: 284 }, cue: "Line your knees up with the machine's axis." },
    { key: 'hips', text: 'Hips on<br>pad', anchor: 'buttock', box: { left: 160, top: 186 }, cue: 'Keep the front of your hips pressed on the pad.' },
    { key: 'back', text: 'Low back<br>still', anchor: 'backMid', box: { left: 240, top: 194 }, cue: "Brace your abs so your low back doesn't arch." },
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
      { key: 'arch', text: 'Low back<br>arches', anchor: { at: 'backMid', pose: 'mistake' }, box: { left: 150, top: 180 }, cue: 'Your lower back arches as your legs curl.' },
    ],
  },
  alt: 'Lying leg curl, side view. Face down on the bench with the hips on the pad, the knees just past the bench edge and in line with the machine axis and the roller just above the heels, the lifter curls the heels toward the glutes.',
};
