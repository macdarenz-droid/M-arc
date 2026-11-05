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
//    hexes in front view. The start layer never draws equipment, so the start dumbbells are dashed phantoms
//    (LIB-PLATEFIX-1: at pitch 0 every handle points at the viewer, so they are end-on dashed hexes again).
// Plate labels (verified card): callouts = plate.checkpoints c5 (Soft elbows, on the end elbow), c4 (Chest-level stop,
//   on the end dumbbell), c4 (Dumbbells parallel, on the start dumbbell); measure = the held elbow bend (c5);
//   Mistake (front) = plate.mistake c13: at the end pose both wrists bend back M_WRIST out of neutral (arms, elbows and
//   shoulders unchanged; the dumbbells turn with the hands; LIB-PLATEFIX-1: each faulty hand is a solid line off a dashed
//   neutral line that continues the forearm, with an arc-arrow for the turn), one tell 'wrists' (the card's topFault), in a Mistake zoom
//   (D-LIBZOOM-EXTEND); the side alt keeps its former depth Mistake (c4). Tempo = plate.tempo c10 (2 s down, 2 s up,
//   no pause). Trace = the grip: the arc (a press would trace a vertical line).
// CARD: ELBOW (slight bend), SHOULDER_W (start width), END_LEVEL (stop height), ARC_DZ (arc plane over the chest).
import { landmarksOf, fk, resolve, normPose, bodyShapes, WINTER, REF } from '../engine.mjs';
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
const PITCH = 0;                                     // camera pitch (deg), D-SPIKE-pitch. LIB-PLATEFIX-1: 45 read as a standing T-pose (W2 panel, #379 6633524031) and 25 as
// sitting on a stool with the bench floating (plates panel pf1, #385 6636073314 R1). At 0 (the level view from the feet) the
// bench stands on the floor, the shoulders sit just above the pad, the bent knees and vertical shins come to the front and
// the arms sweep at their true length, so the ghosts and the arm share one circle
const PX_M = 256 / 1.75;                              // the engine's reference scale (px/m), REF_CAMERA (vendor/engine/plate.mjs:11)
// Mistake (card plate.mistake, c13): the end pose's own joint angles (the reach released), with both wrists bent back
// M_WRIST out of neutral; the arm does not move, only the hand and its dumbbell.
const M_WRIST = 32;                                   // wrist bend (deg): a stated reason, pilot-a3/sizes.json (LIB-PLATEFIX-1 pf2 R5: 30-35 asked; 32 in 3D draws 32 on screen at pitch 0)
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
// Start dumbbells: PILOT-A3 (F-FLY-START R2) drew side-on silhouettes for the pitched view.
// LIB-PLATEFIX-1 (pf1 R2): in the level view every handle points at the viewer, so the start dumbbells are end-on, the
// primitive's own end-on face (vendor/engine/equipment.mjs dumbbell: hex head/2 across the corners, core 1.58 cm): a closed
// dashed hexagon and a dashed core ring in the x-y plane at the start grip.
const startDb = c => [
  [0, 60, 120, 180, 240, 300, 360].map(a => [c[0] + DB.head / 2 * Math.cos(a * R), c[1] - DB.head / 2 * Math.sin(a * R), c[2]]),
  Array.from({ length: 17 }, (_, k) => [c[0] + 0.0158 * Math.cos(k * Math.PI / 8), c[1] + 0.0158 * Math.sin(k * Math.PI / 8), c[2]]),
];
// The faulty hands (PILOT-A3, F-FLY-START R5): the Mistake pose's own hand polys (wrist -> grip, bent M_WRIST), closed,
// as Mistake `dashed` guides, drawn on top of the masked pose so the bend reads at its true size. The Mistake pose is
// the end pose merged with wristPose, as the engine merges it (vendor/engine/plate.mjs:20-26, :48).
const merge = (a, b) => (b === undefined ? a : a && b && typeof a === 'object' && typeof b === 'object' && !Array.isArray(a) && !Array.isArray(b)
  ? Object.fromEntries([...new Set([...Object.keys(a), ...Object.keys(b)])].map(k => [k, merge(a[k], b[k])])) : b);
const lmMis = landmarksOf(merge(end, wristPose), H);
// LIB-PLATEFIX-1 (W2 panel: the dashed boxes showed no bent wrist): the faulty hand is a SOLID Mistake line from the
// wrist to the bent grip, the neutral line continues the forearm past the wrist (dashed, one hand length), and an
// arc-arrow at the wrist turns from the neutral line to the bent hand. The faulty dumbbells turn with the hands (MIS_AXIS).
const PITCH_C = Math.cos(PITCH * R), PITCH_S = Math.sin(PITCH * R);
const scr = w => [w[0], -(w[1] * PITCH_C - w[2] * PITCH_S)];                    // screen direction of a world vector (makeCamera)
const sub = (a, b) => a.map((v, i) => v - b[i]), add = (a, b) => a.map((v, i) => v + b[i]), mul = (a, k) => a.map(v => v * k);
const unit = a => mul(a, 1 / Math.hypot(...a)), cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a, b) => a.reduce((t, v, i) => t + v * b[i], 0);
const rotate = (v, k, th) => add(add(mul(v, Math.cos(th)), mul(cross(k, v), Math.sin(th))), mul(k, dot(k, v) * (1 - Math.cos(th))));   // Rodrigues
const MIS_AXIS = {}, MISTAKE_HANDS = [], NEUTRAL_LINES = [], TURN = {};
const ARC_R = 0.6;                                    // pf5 R5: the red angle arc's radius, 0.6 hand lengths from the wrist (inside the hand, clear of the hexagon)
const AXIS_PAST = 2;                                  // pf4 R5: the grey forearm axis runs 2 hand lengths past the wrist, straight through the neutral hand and its hexagon (far corner at 1.69)
// The straight-arm line (LIB-PLATEFIX-1, W2 panel: the arm read as straight): from the end elbow along shoulder -> elbow,
// the forearm-plus-grip length, so the slight bend (ELBOW) reads as the forearm leaving it. A datum proving the Soft elbows checkpoint.
const ELBOW_LINE = (() => { const E = lmEnd['elbow.r'], u = unit(sub(E, lmEnd['shoulder.r'])); return [[...E], add(E, mul(u, L2))]; })();
for (const s of ['l', 'r']) {
  const W = lmMis[`wrist.${s}`], dc = unit(sub(lmEnd[`grip.${s}`], lmEnd[`wrist.${s}`])), db = unit(sub(lmMis[`grip.${s}`], W));
  const k = unit(cross(dc, db)), th = Math.acos(Math.min(1, dot(dc, db)));
  MIS_AXIS[s] = rotate([0, 0, 1], k, th);
  const hl = Math.hypot(...sub(lmMis[`grip.${s}`], W)), fore = unit(sub(W, lmMis[`elbow.${s}`]));
  const ang = v => { const q = scr(v); return Math.atan2(q[1], q[0]) / R; };
  let a0 = ang(fore), a1 = ang(db); while (a1 - a0 > 180) a1 -= 360; while (a1 - a0 < -180) a1 += 360;
  // pf1 R5: the forearm axis continued past the wrist in grey dashes (the correct plate's line style, drawn on the
  // Mistake plate only), the faulty hand outline in red dashes turned M_WRIST about the wrist joint with its dumbbell,
  // and a small red angle arc at the wrist from the axis to the bent hand
  // pf2 R5: the reference line runs along the forearm axis from mid-forearm through the wrist and AXIS_PAST hand lengths past it
  const E = lmMis[`elbow.${s}`], Wm = add(E, mul(sub(W, E), 0.5));
  NEUTRAL_LINES.push({ type: 'line', pts: [Wm, add(W, mul(fore, hl * AXIS_PAST))], cls: 'eq-line m-line', z: 'front', part: `axis.${s}` });
  // pf3 R5, pf4 R5 (LIB-PLATEFIX-2): the faulty hand as ONE rigid red dashed piece: the grey neutral hand block (the drawn
  // hand poly, wrist -> neutral grip, the same length) and its end-on hexagon, turned together about the wrist joint by
  // TURN (the screen angle of the bend, 32.2 deg toward the floor at pitch 0; a screen turn of tw is a world turn of -tw
  // about the view axis z). No core ring: the engine's faulty fist is the one red ring.
  const Ge = lmEnd[`grip.${s}`], tw = (a1 - a0) * R, c = Math.cos(-tw), sn = Math.sin(-tw);
  const turn = p => [W[0] + (p[0] - W[0]) * c - (p[1] - W[1]) * sn, W[1] + (p[0] - W[0]) * sn + (p[1] - W[1]) * c, p[2]];
  const block = handPoly(W, Ge).pts, hex = startDb(Ge)[0];
  const turnBy = (p, th) => [W[0] + (p[0] - W[0]) * Math.cos(th) - (p[1] - W[1]) * Math.sin(th), W[1] + (p[0] - W[0]) * Math.sin(th) + (p[1] - W[1]) * Math.cos(th), p[2]];
  TURN[s] = +(a1 - a0).toFixed(1);
  MISTAKE_HANDS.push(
    { kind: 'dashed', pts: [...block, block[0]].map(turn) },
    { kind: 'dashed', pts: hex.map(turn) },
    // pf5 R5: a short plain red angle arc at the wrist from the grey axis to the turned hand, no arrowhead and no number,
    // as world points (ARC_R of the hand length) so the zoom scales it with the hand
    { kind: 'line', pts: Array.from({ length: 9 }, (_, i) => turnBy(add(W, mul(dc, hl * ARC_R)), -tw * i / 8)) });
}

export const FLY_TURN = TURN;
/** The unsourced sizes (pilot-a2/sizes.json, D-LIB17-SIZE form; LIB-8R). */
export const SIZES = { BENCH_TOP, FOOT_Z, FOOT_X, ELBOW, SHOULDER_W, ARC_DZ, PITCH, M_WRIST, HAND_W, PAD_W, PAD_T, LEG_IN, POST, FOOT_HALF, FOOT_T, AXIS_PAST, ARC_R };

/** The fly plate in `view` ('front' = the card, 'side' = the former view, kept as the alternate); `id` for the file. */
export function makeFly(view, id) {
  return view === 'front' ? frontFly(id) : sideFly(id);
}

const ALT = 'Dumbbell fly, front view from the feet. Lying on a flat bench, feet flat, the lifter lowers the dumbbells out to the sides in a wide arc, elbows slightly bent and fixed, until level with the chest, then raises them back. Mistake: wrists bent back off the forearms.';

function frontFly(id) {
  const phantom = ['l', 'r'].flatMap(s => startDb(lmStart[`grip.${s}`]).map(pts => ({ type: 'line', pts, cls: 'eq-line m-line', z: 'front' })));
  return {
    id, name: 'Dumbbell Fly', view: 'front',
    // y0: the floor under the feet (world y 0, z FOOT_Z) at the approved floor y 339 once pitched (D-LIB8-floor)
    camera: { x0: 179, y0: +(339 - FOOT_Z * Math.sin(PITCH * R) * PX_M).toFixed(2), pitch: PITCH },
    torso: 'volume',
    poses: { start, end, via },
    equipment: [
      { type: 'floor', from: [-0.5, 0, FOOT_Z], to: [0.5, 0, FOOT_Z] },   // the floor line under the feet, clear of the zoom corners
      ...PITCHED_BENCH,
      (lm, ctx) => (ctx.pose === 'end' ? [...phantom, ...(ctx.mistake ? NEUTRAL_LINES : [])] : null),
      (lm, ctx) => (ctx.pose === 'mistake' ? null : HANDS(lm)),   // the Mistake hand is the red dashed block (MISTAKE_HANDS)
      // pf2 R5: on the Mistake plate the correct end dumbbells are left out, so the faulty dumbbell moves with the hand instead
      // of sitting as a red copy on top of a solid one
      // pf3 R7 (LIB-PLATEFIX-2): the correct end dumbbells stay solid and end-on at the neutral grip in the Mistake view too,
      // exactly as in the normal view; the faulty ones are the turned red dashed hexagons (MISTAKE_HANDS), so the Mistake pose draws none
      (lm, ctx) => (ctx.pose === 'mistake' ? null : ['l', 'r'].map(s => ({ type: 'dumbbell', at: lm[`grip.${s}`], axis: [0, 0, 1], z: 'front', part: `db.${s}` }))),
    ],
    checks: CHECKS,
    marks: ['elbow.l', 'elbow.r'],
    startParts: ['arm.l', 'arm.r'],
    ghosts: { count: 1, parts: ['arm.r', 'db.r'] },   // one: with the volume trunk, 2 ghosts make the card chunk 159.2 KB > H7's 150 KB (1: 152.4 KB)
    trace: { point: 'grip.l', trim: [12, 12] },
    measure: { vertex: 'elbow.r', from: 'shoulder.r', to: 'wrist.r', radius: 18, title: 'Elbow', value: 'slight bend, held' },
    datum: [{ y: 'grip.r', from: { at: 'grip.r', off: [-14, 0] }, to: { at: 'grip.l', off: [14, 0] }, mistake: false },   // the stop line: dumbbells level with the chest top (c4)
      { x: 0, from: 0, to: 0, line: ELBOW_LINE, mistake: false }],   // x/from/to: the engine's line-datum form (ab_wheel_rollout.mjs:181)   // the upper arm's line past the elbow: the forearm leaves it by the held bend (c5, LIB-PLATEFIX-1)
    callouts: [
      { key: 'elbows', text: 'Soft<br>elbows', anchor: 'elbow.l', cue: 'Keep a slight elbow bend that stays the same all the way.' },
      { key: 'stop', text: 'Chest-level<br>stop', anchor: 'grip.l', cue: 'Lower until the dumbbells are level with your shoulders or chest, no deeper.' },   // c4, the card's label
      { key: 'parallel', text: 'Dumbbells<br>parallel', anchor: 'start:grip.l', cue: 'Keep both dumbbells parallel, palms facing, through the whole arc.' },
    ],
    tempo: [{ phase: 'Lower', s: 2, move: true }, { phase: 'Raise', s: 2, move: true }],
    mistake: {
      pose: wristPose,
      guides: MISTAKE_HANDS,   // the neutral line, the solid faulty hand and the turn (LIB-PLATEFIX-1)
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
