// Dumbbell Fly (flat bench, palms facing), FRONT view from the feet: the census and card view (no F6). SUPINE class
// child. makeFly('front') is the plate; makeFly('side') is the former side plate, kept as the alternate
// (dumbbell_fly__alt.mjs, a sheet extra only, D-LIB8R-FLIES): it cannot show the arc width or the elbow bend.
// Front view (LIB-8R, D-SPIKE-pitch, D-SPIKE-hinge): the engine camera is raised on the feet's side and tilted down
// PITCH deg (`camera.pitch`, vendor/engine/plate.mjs makeCamera), and the trunk and head are the engine's volume trunk
// (`torso: 'volume'`), so the lying chest, the head, the arc and the knees show together. The hand-built torso dome and
// x-ray head of the unpitched view (pilot A #109) are gone.
// Sources: research card docs/research/howto/cards/dumbbell_fly.json (pilot-a/cards, verified), claims c1 (flat
// bench, feet flat), c2 (blades down and back, five-point contact), c3 (start: dumbbells pressed up to shoulder width,
// palms facing, slight elbow bend, neutral wrists), c4 (lower in a wide arc until the dumbbells are level with the
// shoulders or chest, dumbbells parallel), c5 (the same slight elbow bend down and up), c10 (tempo).
// Geometry decisions:
//  - Body, bench and blades: dumbbell_bench_press (the SUPINE anchor): `supine()` root/trunk/neck on a 43 cm flat bench,
//    feet flat FOOT_Z in front of the hip, scap back and down. Same checks (upper back and buttocks on the pad, soles on
//    the floor, head above the pad).
//  - Arc: each grip moves on a circle round its shoulder joint in the plane across the body at ARC_DZ toward the feet
//    from the shoulder joints (over the upper chest). The grip-to-shoulder distance is the one of an arm with the
//    elbow bent ELBOW deg, so the reach IK returns that elbow at every key pose (c5); 7 key poses (start, 5 via, end)
//    keep the interpolated chord within 0.6% of the arc. The measure arc draws the held bend (interior 160 deg, no
//    `expect`: the card gives no number; ELBOW is this plate's reading of "slight").
//  - Start (c3): arms up, grips SHOULDER_W apart centre to centre, leaning in only as the elbow bend needs.
//  - End (c4): lowered until the grip is level with the top of the chest (END_LEVEL, the chest surface at the nipple
//    line): the shallow end of "shoulders or chest", so the Mistake (deeper) reads. The datum is that stop line, grip
//    to grip across the chest top.
//  - Elbow pole: out and a little down, so the bend is in the arc plane with the elbows pointing out (c5).
//  - Dumbbells: `dumbbell` primitive, axis [0,0,1] (palms facing, handles along the body, c3/c4 "parallel"): end-on
//    hexes in front view. The start layer never draws equipment, so the start dumbbells are dashed side-on silhouettes
//    (PILOT-A3, F-FLY-START R2: the pitched view sees them side-on, so a hex ring was the wrong shape).
// Plate labels (verified card): callouts = plate.checkpoints c5 (Soft elbows, on the end elbow), c4 (Stop at chest,
//   on the end dumbbell), c4 (Dumbbells parallel, on the start dumbbell); measure = the held elbow bend (c5);
//   Mistake (front) = plate.mistake c13: at the end pose both wrists bend back M_WRIST out of neutral (arms, elbows and
//   shoulders unchanged; the dumbbells follow the hands; the faulty hands are also dashed guides, PILOT-A3 F-FLY-START
//   R5), one tell 'wrists' (the card's topFault), in a Mistake zoom
//   (D-LIBZOOM-EXTEND); the side alt keeps its former depth Mistake (c4). Tempo = plate.tempo c10 (2 s down, 2 s up,
//   no pause). Trace = the grip: the arc (a press would trace a vertical line).
// CARD: ELBOW (slight bend), SHOULDER_W (start width), END_LEVEL (stop height), ARC_DZ (arc plane over the chest).
import { landmarksOf, fk, resolve, normPose, bodyShapes, WINTER, REF, RADII } from '../engine.mjs';
import { supine } from './dumbbell_bench_press.mjs';

const H = 1.75, BODY = { height: H };
const R = Math.PI / 180;
const BENCH_TOP = 0.43, BENCH_LEN = 1.2, BENCH_Z = -0.40;   // as dumbbell_bench_press
const FOOT_Z = 0.51;
const SCAP = { elev: -1, pro: -3 };
const ELBOW = 20;                                     // slight elbow bend, fixed through the arc (deg) (c3, c5)
const SHOULDER_W = 0.44;                              // start: grip centres apart (m): shoulder width (c3)
const ARC_DZ = 0.08;                                  // arc plane this far toward the feet of the shoulder joints (m): over the upper-mid chest
const END_LEVEL = 'chest';                            // end: grip level with the chest surface at the nipple line (c4)

const LYING = supine(BENCH_TOP, 0);
const FOOT_X = 0.16;                                  // feet flat, 32 cm apart (centres), toes slightly out, knees over the toes (c1)
const feet = { l: { at: [FOOT_X, 0, FOOT_Z], toe: [0.15, 0, 1] }, r: { at: [-FOOT_X, 0, FOOT_Z], toe: [-0.15, 0, 1] } };
const base = { ...LYING, scap: SCAP, plant: feet };
const lm0 = landmarksOf(base, H), sk0 = fk(resolve(normPose(base, BODY), BODY).q, BODY);
const S = { l: lm0['shoulder.l'], r: lm0['shoulder.r'] };
const L1 = WINTER.upperArm * H, L2 = WINTER.forearm * H + REF.gripOff * H;
const D = Math.sqrt(L1 * L1 + L2 * L2 + 2 * L1 * L2 * Math.cos(ELBOW * R));   // shoulder-to-grip with the bend
const Dh = Math.sqrt(D * D - ARC_DZ * ARC_DZ);                                  // radius in the arc plane
const CHEST = sk0.thorax([0, 0.72, 0.072]);                                     // chest surface, nipple line
const endY = END_LEVEL === 'chest' ? CHEST[1] : S.r[1];
// angle phi from straight up (0) toward the side, per side
const PHI0 = Math.asin((Math.abs(S.r[0]) - SHOULDER_W / 2) / Dh) / R * -1;       // start: grips inside the shoulders
const PHI1 = Math.acos((endY - S.r[1]) / Dh) / R;                               // end: grip at endY
const gripAt = (side, phi) => { const s = side === 'l' ? 1 : -1, sh = S[side];
  return { at: [sh[0] + s * Dh * Math.sin(phi * R), sh[1] + Dh * Math.cos(phi * R), sh[2] + ARC_DZ], pole: [s, -0.35, 0.15] }; };
const poseAtPhi = phi => ({ ...base, reach: { l: gripAt('l', phi), r: gripAt('r', phi) } });
const start = poseAtPhi(PHI0), end = poseAtPhi(PHI1);
const via = [1, 2, 3, 4, 5].map(k => k / 6).map(t => poseAtPhi(PHI0 + (PHI1 - PHI0) * t));
export const flyInfo = { phiStartDeg: +PHI0.toFixed(1), phiEndDeg: +PHI1.toFixed(1), endGripAboveShoulderCm: +((endY - S.r[1]) * 100).toFixed(1) };

// Mistake (card plate.mistake, c4): the dumbbells go below shoulder and chest level at the bottom of the arc. Same
// arc and elbow bend, lowered until the grip is MIS_BELOW under the shoulder joint (30 cm under the correct stop, 5 cm under the pad top).
const MIS_BELOW = 0.14;                               // faulty grip height under the shoulder joint (m)
const PHI_M = Math.acos(-MIS_BELOW / Dh) / R;
const mistakePose = { reach: { l: gripAt('l', PHI_M), r: gripAt('r', PHI_M) } };
const lmEnd = landmarksOf(end, H);
const chestLine = [[0, lmEnd['grip.r'][1], lmEnd['grip.r'][2] - 0.16], [0, lmEnd['grip.r'][1], lmEnd['grip.r'][2] + 0.16]];

// start dumbbell phantoms (dashed), in metres, per view
const DB = { head: 0.119, headLen: 0.07, handle: 0.13 };
const sideDb = c => {   // side view, axis z: handle bar and two heads as outlines (primitive sizes)
  const hh = DB.head * 0.866 / 2, rect = (z0, z1, h) => [[0, c[1] - h, c[2] + z0], [0, c[1] - h, c[2] + z1], [0, c[1] + h, c[2] + z1], [0, c[1] + h, c[2] + z0], [0, c[1] - h, c[2] + z0]];
  return [rect(-DB.handle / 2 - DB.headLen, -DB.handle / 2, hh), rect(DB.handle / 2, DB.handle / 2 + DB.headLen, hh), [[0, c[1], c[2] - DB.handle / 2], [0, c[1], c[2] + DB.handle / 2]]];
};
const lmStart = landmarksOf(start, H);


// ---- front view (LIB-8R) ----
const PITCH = 45;                                     // camera pitch (deg), D-SPIKE-pitch
const PX_M = 256 / 1.75;                              // the engine's reference scale (px/m), REF_CAMERA (vendor/engine/plate.mjs:11)
// Mistake (card plate.mistake, c13): the end pose's own joint angles (the reach released), with both wrists bent back
// M_WRIST out of neutral; the arm does not move, only the hand and its dumbbell.
const M_WRIST = 30;                                   // wrist bend (deg): a stated reason, pilot-a2/sizes.json
const qEnd = resolve(normPose(end, BODY), BODY).q;
const wristPose = { reach: { l: null, r: null }, shoulder: qEnd.sh, elbow: qEnd.elbow, wrist: { l: -M_WRIST, r: -M_WRIST } };
// The bench in the pitched view (panel mx4 R2): the engine's `bench` primitive draws a front-view cross-section only
// (vendor/engine/equipment.mjs:158-177), two tabs beside the hips, so the pitched view draws the bench's own parts as
// world-space `poly` items, projected by the engine's pitched camera: the pad (top face and its foot-end face), and at
// each end an upright from the pad to the floor with a cross foot. Sizes are the primitive's defaults (width 0.29, pad
// 0.06, legInset 0.12, beam 0.025 under the pad, foot ±0.22), so it is the same bench as dumbbell_bench_press's.
const PAD_W = 0.29 / 2, PAD_T = 0.06, LEG_IN = 0.12, POST = 0.025, FOOT_HALF = 0.22, FOOT_T = 0.03;
const zH = BENCH_Z - BENCH_LEN / 2, zF = BENCH_Z + BENCH_LEN / 2, beamY = BENCH_TOP - PAD_T - 0.025;
const rect = (x0, x1, y0, y1, z) => [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]];
const PITCHED_BENCH = [
  ...[zH + LEG_IN, zF - LEG_IN].flatMap(z => [
    { type: 'poly', pts: rect(-POST, POST, FOOT_T, beamY, z), cls: 'eq', z: 'back', part: 'bench' },              // upright
    { type: 'poly', pts: rect(-FOOT_HALF, FOOT_HALF, 0, FOOT_T, z), cls: 'eq', z: 'back', part: 'bench' },         // its foot
  ]),
  { type: 'poly', pts: [[-PAD_W, BENCH_TOP, zH], [PAD_W, BENCH_TOP, zH], [PAD_W, BENCH_TOP, zF], [PAD_W, BENCH_TOP - PAD_T, zF],
    [-PAD_W, BENCH_TOP - PAD_T, zF], [-PAD_W, BENCH_TOP, zF]], cls: 'eq', z: 'back', part: 'bench' },              // the pad
];

// The hand as a short segment from the wrist to the handle (panel mx4 R5), so the wrist bend reads as an angle: a world
// `poly` HAND_W wide along wrist -> grip, in the body's own fill. In the Mistake it is redrawn bent M_WRIST about the wrist,
// with the dumbbell, at the card's true size.
const HAND_W = 0.02;                                  // half width (m): a stated reason, pilot-a2/sizes.json
const handPoly = (W, G, part) => {
  const d = [G[0] - W[0], G[1] - W[1]], L = Math.hypot(...d), n = [-d[1] / L * HAND_W, d[0] / L * HAND_W];
  return { type: 'poly', pts: [[W[0] + n[0], W[1] + n[1], W[2]], [G[0] + n[0], G[1] + n[1], G[2]], [G[0] - n[0], G[1] - n[1], G[2]], [W[0] - n[0], W[1] - n[1], W[2]]], cls: 'eq-solid', z: 'front', part };
};
const HANDS = lm => ['l', 'r'].map(s => handPoly(lm[`wrist.${s}`], lm[`grip.${s}`], `hand.${s}`));
// Start dumbbells (PILOT-A3, F-FLY-START R2): one dashed closed side-on silhouette per dumbbell in the x-z plane at the
// start grip, from the primitive's sizes (heads DB.head * 0.866 across, DB.headLen long; handle 1.6 cm thick), so the
// pitched view shows the same shape as the drawn end dumbbells, not a hex ring. 13 points, the last closing the outline.
const startDb = c => {
  const hx = DB.head * 0.866 / 2, bx = 0.008, zo = DB.handle / 2 + DB.headLen, zi = DB.handle / 2;
  return [[-hx, -zo], [hx, -zo], [hx, -zi], [bx, -zi], [bx, zi], [hx, zi], [hx, zo], [-hx, zo], [-hx, zi], [-bx, zi], [-bx, -zi], [-hx, -zi], [-hx, -zo]]
    .map(([x, z]) => [c[0] + x, c[1], c[2] + z]);
};
// The faulty hand (LIB-PLATEFIX-4; #395 6655186998 "one red hand-plus-hexagon piece at the hand's scale", #395 6653868933
// "the hand-plus-hexagon piece rotated ... about the wrist ... a short red angle arc with no number. Remove the extra red
// circle", #385 6638551153 "the bent hand is only a thin dashed axis"): per side ONE closed outline, the union of the
// drawn end hand poly, the engine's fist circle (RADII.fist) and the end dumbbell's side-on silhouette (the `dumbbell`
// primitive's own sizes at this camera), turned rigidly on screen about the wrist by the drawn bend (the screen angle
// from the end hand to the Mistake pose's hand, the engine's own M_WRIST bend). It is the Mistake pose's only changed
// item (`mistake.parts`), so the engine draws it as the masked Mistake outline: no red fist, no stacked dumbbell boxes.
// Built in a screen-aligned world frame (X = world x, U = screen up, depth D fixed) so the zoom projects it at its scale.
const merge = (a, b) => (b === undefined ? a : a && b && typeof a === 'object' && typeof b === 'object' && !Array.isArray(a) && !Array.isArray(b)
  ? Object.fromEntries([...new Set([...Object.keys(a), ...Object.keys(b)])].map(k => [k, merge(a[k], b[k])])) : b);
const lmMis = landmarksOf(merge(end, wristPose), H);
const PC = Math.cos(PITCH * R), PS = Math.sin(PITCH * R);
const toXU = w => [w[0], w[1] * PC - w[2] * PS], depth = w => w[1] * PS + w[2] * PC;
const toW = ([X, U], D) => [X, U * PC + D * PS, -U * PS + D * PC];
const DBP = { head: 0.119, headLen: 0.07, handle: 0.13, core: 0.016 };   // the `dumbbell` primitive's defaults (vendor/engine/equipment.mjs:30-41)
const FIST_R = RADII.fist * H;                                           // the engine's fist (vendor/engine/body.mjs:395)
const arcPts = (r, a0, a1, n) => Array.from({ length: n + 1 }, (_, k) => { const a = a0 + (a1 - a0) * k / n; return [r * Math.cos(a), r * Math.sin(a)]; });
const hit = (A, B, r) => {   // the point of segment A -> B (A outside, B inside) on the circle |p| = r
  const d = [B[0] - A[0], B[1] - A[1]], a = d[0] * d[0] + d[1] * d[1], b = 2 * (A[0] * d[0] + A[1] * d[1]), c = A[0] * A[0] + A[1] * A[1] - r * r;
  const t = (-b - Math.sqrt(b * b - 4 * a * c)) / (2 * a); return [A[0] + d[0] * t, A[1] + d[1] * t];
};
const ang = p => { let a = Math.atan2(p[1], p[0]); if (a < 0) a += 2 * Math.PI; return a; };
export const FLY_PIECE = {};
const PIECES = [], ARCS = [];
for (const s of ['l', 'r']) {
  const W = lmEnd[`wrist.${s}`], G = lmEnd[`grip.${s}`], D = depth(G), g = toXU(G);
  const proj = Math.hypot(...toXU([0, 0, 0.1])) / 0.1;                   // the axis's screen length per metre (the primitive's proj)
  const m = toXU(W)[0] < g[0] ? 1 : -1;                                  // mirror so the wrist is on the -X side
  const loc = w => { const q = toXU(w); return [(q[0] - g[0]) * m, q[1] - g[1]]; };
  const hand = handPoly(W, G).pts.map(loc);                              // [W+n, G+n, G-n, W-n]
  const h = DBP.head * 0.866 / 2, t = DBP.core, a1 = DBP.handle / 2 * proj, a2 = (DBP.handle / 2 + DBP.headLen) * proj, r = FIST_R;
  const e1 = [hit(hand[0], hand[1], r), hand[0]], e2 = [hit(hand[3], hand[2], r), hand[3]];
  const [top, bot] = e1[0][1] > e2[0][1] ? [e1, e2] : [e2, e1];
  const yc = Math.sqrt(r * r - t * t), b0 = Math.atan2(yc, t);
  const outline = [[-h, a2], [h, a2], [h, a1], [t, a1],
    ...arcPts(r, b0, -b0, 8),                                            // the fist's right side
    [t, -a1], [h, -a1], [h, -a2], [-h, -a2], [-h, -a1], [-t, -a1],
    ...arcPts(r, Math.PI + b0, ang(bot[0]), 4), bot[1], top[1],      // up the fist's left side to the hand, out to the wrist and back
    ...arcPts(r, ang(top[0]), Math.PI - b0, 4), [-t, a1], [-h, a1], [-h, a2]];
  // the drawn bend: the screen angle from the end hand (wrist -> grip) to the Mistake pose's hand, turned about the wrist
  const w0 = loc(W), dirE = loc(G), dirM = loc(lmMis[`grip.${s}`]);
  const th = Math.atan2(dirM[1] - w0[1], dirM[0] - w0[0]) - Math.atan2(dirE[1] - w0[1], dirE[0] - w0[0]);
  const turn = ([x, y]) => { const dx = x - w0[0], dy = y - w0[1]; return [w0[0] + dx * Math.cos(th) - dy * Math.sin(th), w0[1] + dx * Math.sin(th) + dy * Math.cos(th)]; };
  const world = ([x, y]) => toW([x * m + g[0], y + g[1]], D);
  PIECES.push({ type: 'poly', pts: outline.slice(0, -1).map(turn).map(world), cls: 'eq-solid', z: 'front', part: `piece.${s}` });
  // the angle arc (no number, no head): at the fist's edge (hand length - fist radius) from the end hand to the turned hand
  const L = Math.hypot(dirE[0] - w0[0], dirE[1] - w0[1]), ra = L - r, aE = Math.atan2(dirE[1] - w0[1], dirE[0] - w0[0]);
  ARCS.push({ kind: 'line', pts: arcPts(ra, aE, aE + th, 8).map(([x, y]) => world([w0[0] + x, w0[1] + y])) });
  FLY_PIECE[s] = { turnDeg: +(th / R * m).toFixed(1), handPx: +(L * PX_M).toFixed(2) };
}

/** The unsourced sizes (pilot-a2/sizes.json, D-LIB17-SIZE form; LIB-8R). */
export const SIZES = { BENCH_TOP, FOOT_Z, FOOT_X, ELBOW, SHOULDER_W, ARC_DZ, PITCH, M_WRIST, HAND_W, PAD_W, PAD_T, LEG_IN, POST, FOOT_HALF, FOOT_T };

/** The fly plate in `view` ('front' = the card, 'side' = the former view, kept as the alternate); `id` for the file. */
export function makeFly(view, id) {
  return view === 'front' ? frontFly(id) : sideFly(id);
}

const ALT = 'Dumbbell fly, front view from the feet. Lying on a flat bench, feet flat, the lifter lowers the dumbbells out to the sides in a wide arc, elbows slightly bent and fixed, until level with the chest, then raises them back. Mistake: dumbbells sinking below the bench.';

function frontFly(id) {
  const phantom = ['l', 'r'].map(s => ({ type: 'line', pts: startDb(lmStart[`grip.${s}`]), cls: 'eq-line m-line', z: 'front' }));
  return {
    id, name: 'Dumbbell Fly', view: 'front',
    // y0: the floor under the feet (world y 0, z FOOT_Z) at the approved floor y 339 once pitched (D-LIB8-floor)
    camera: { x0: 179, y0: +(339 - FOOT_Z * Math.sin(PITCH * R) * PX_M).toFixed(2), pitch: PITCH },
    torso: 'volume',
    poses: { start, end, via },
    equipment: [
      { type: 'floor', from: [-0.5, 0, FOOT_Z], to: [0.5, 0, FOOT_Z] },   // the floor line under the feet, clear of the zoom corners
      ...PITCHED_BENCH,
      (lm, ctx) => (ctx.pose === 'end' ? phantom : null),
      lm => HANDS(lm),
      lm => [{ type: 'dumbbell', at: lm['grip.l'], axis: [0, 0, 1], z: 'front', part: 'db.l' },
        { type: 'dumbbell', at: lm['grip.r'], axis: [0, 0, 1], z: 'front', part: 'db.r' }],
      (lm, ctx) => (ctx.pose === 'mistake' ? PIECES : null),   // the faulty hand-plus-dumbbell pieces, last so the other items keep their ids (LIB-PLATEFIX-4)
    ],
    checks: CHECKS,
    marks: ['elbow.l', 'elbow.r'],
    startParts: ['arm.l', 'arm.r'],
    ghosts: { count: 1, parts: ['arm.r', 'db.r'] },   // one: with the volume trunk, 2 ghosts make the card chunk 159.2 KB > H7's 150 KB (1: 152.4 KB)
    trace: { point: 'grip.l', trim: [12, 12] },
    measure: { vertex: 'elbow.r', from: 'shoulder.r', to: 'wrist.r', radius: 18, title: 'Elbow', value: 'slight bend, held' },
    datum: [{ y: 'grip.r', from: { at: 'grip.r', off: [-14, 0] }, to: { at: 'grip.l', off: [14, 0] }, mistake: false }],   // the stop line: dumbbells level with the chest top (c4)
    callouts: [
      { key: 'elbows', text: 'Soft<br>elbows', anchor: 'elbow.l', box: { left: 236, top: 276 }, cue: 'Keep a slight elbow bend that stays the same all the way.' },
      { key: 'stop', text: 'Stop at<br>chest', anchor: 'grip.l', box: { left: 282, top: 206 }, cue: 'Lower until the dumbbells are level with your chest, no deeper.' },
      { key: 'parallel', text: 'Dumbbells<br>parallel', anchor: 'start:grip.l', cue: 'Keep both dumbbells parallel, palms facing, through the whole arc.' },
    ],
    tempo: [{ phase: 'Lower', s: 2, move: true }, { phase: 'Raise', s: 2, move: true }],
    mistake: {
      pose: wristPose,
      parts: ['piece.l', 'piece.r'],   // the Mistake outline is the two pieces only: no red fist, hand or dumbbell boxes (LIB-PLATEFIX-4)
      guides: ARCS,   // the short plain red angle arcs at the wrists (#395 6653868933)
      tells: [
        { key: 'wrists', text: 'Wrists bend', anchor: { at: 'grip.r', pose: 'mistake' }, box: { left: 12, top: 70 }, cue: 'Your wrists bend back out of line with the forearms as the dumbbells arc.' },   // c13
      ],
    },
    zoom: { view: 'mistake', k: 2.5 },   // the smallest k on the ladder that reaches H3's bar at the pitched projection (F-ZOOM-PITCH; 2 gives 9.9 px)
    alt: ALT,
  };
}

const CHECKS = [
  { landmark: 'backUpper', plane: { point: [0, BENCH_TOP, 0], normal: [0, 1, 0] }, pose: 'all', tol: 1 },   // upper back ON the pad (c2)
  { landmark: 'buttock', plane: { point: [0, BENCH_TOP, 0], normal: [0, 1, 0] }, pose: 'all', tol: 1 },     // buttocks ON the pad
  { landmark: 'head', above: { point: [0, BENCH_TOP, 0], normal: [0, 1, 0] }, pose: 'all' },               // head never inside it
  { landmark: 'sole.r', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },            // feet ON the floor
  { landmark: 'sole.l', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
  // c3 'Grasp each dumbbell' (plate fact): the hands on the dumbbells at the start (as dumbbell_overhead_triceps_extension.mjs:69)
  ...['wrist.r', 'wrist.l'].map(landmark => ({ landmark, at: lmStart[landmark], pose: 'start', tol: 0.5 })),
];

function sideFly(id) {
  return {
    id, name: 'Dumbbell Fly', view: 'side', facing: 'right',
    camera: { x0: 205, y0: 339 },
    poses: { start, end, via },
    equipment: [
      { type: 'floor', from: -1.12, to: 0.80 },
      { type: 'bench', at: [0, BENCH_TOP, BENCH_Z], len: BENCH_LEN },
      (lm, ctx) => (ctx.pose === 'end' ? sideDb(lmStart['grip.r']).map(pts => ({ type: 'line', pts, cls: 'eq-line m-line', z: 'front' })) : null),
      lm => [{ type: 'dumbbell', at: lm['grip.l'], axis: [0, 0, 1], z: 'back', part: 'db.far' },
        { type: 'dumbbell', at: lm['grip.r'], axis: [0, 0, 1], z: 'front', part: 'db.r' }],
    ],
    checks: CHECKS,
    startParts: ['arm.r', 'arm.l'],
    ghosts: { count: 3, parts: ['arm.r', 'db.r'] },
    trace: { point: 'grip.r', trim: [12, 12] },
    datum: [{ y: 'grip.r', from: { at: 'grip.r', off: [-34, 0] }, to: { at: 'grip.r', off: [34, 0] }, mistake: false }],   // the stop line: chest level (c4)
    callouts: [
      { key: 'elbows', text: 'Soft<br>elbows', anchor: 'elbow.r', cue: 'Keep a slight elbow bend that stays the same all the way.' },
      { key: 'stop', text: 'Stop at<br>chest', anchor: 'grip.r', cue: 'Lower until the dumbbells are level with your chest, no deeper.' },
      { key: 'parallel', text: 'Dumbbells<br>parallel', anchor: 'start:grip.r', cue: 'Keep both dumbbells parallel, palms facing, through the whole arc.' },
    ],
    tempo: [{ phase: 'Lower', s: 2, move: true }, { phase: 'Raise', s: 2, move: true }],
    mistake: {
      pose: mistakePose,
      guides: [
        { kind: 'dashed', pts: chestLine },                                                   // where it should stop
        { kind: 'arrow', from: { at: 'grip.r', pose: 'end', off: [22, 0] }, to: { at: 'grip.r', pose: 'mistake', off: [22, 0] } },
      ],
      tells: [
        { key: 'deep', text: 'Below<br>the chest', anchor: { at: 'grip.r', pose: 'mistake', off: [14, 0] }, cue: 'Your dumbbells sink below chest and shoulder level at the bottom.' },
        { key: 'elbow', text: 'Elbows<br>too low', anchor: { at: 'elbow.r', pose: 'mistake' }, cue: 'Your elbows drop below the bench line and strain the shoulder front.' },
      ],
    },
    pilot: { note: 'Alternate (side view): cannot show the arc width or the elbow bend; the front view is the plate.' },
    alt: 'Dumbbell fly, side view. Lying on a flat bench, head, shoulders and hips on the pad, feet flat, the lifter lowers the dumbbells in a wide arc, elbows slightly bent and fixed, until level with the chest, then raises them back.',
  };
}

export default makeFly('front', 'dumbbell_fly');
