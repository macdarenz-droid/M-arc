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
//    hexes in front view. The start layer never draws equipment, so the start dumbbells are dashed phantom hexes.
// Plate labels (verified card): callouts = plate.checkpoints c5 (Soft elbows, on the end elbow), c4 (Stop at chest,
//   on the end dumbbell), c4 (Dumbbells parallel, on the start dumbbell); measure = the held elbow bend (c5);
//   Mistake (front) = plate.mistake c13: at the end pose both wrists bend back M_WRIST out of neutral (arms, elbows and
//   shoulders unchanged; the dumbbells follow the hands), one tell 'wrists' (the card's topFault), in a Mistake zoom
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
const hexRing = (c, r) => { const pts = []; for (let i = 0; i <= 6; i++) { const a = 60 * i * R; pts.push([c[0] + r * Math.cos(a), c[1] - r * Math.sin(a), c[2]]); } return pts; };
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
/** The unsourced sizes (pilot-a2/sizes.json, D-LIB17-SIZE form; LIB-8R). */
export const SIZES = { BENCH_TOP, FOOT_Z, FOOT_X, ELBOW, SHOULDER_W, ARC_DZ, PITCH, M_WRIST };

/** The fly plate in `view` ('front' = the card, 'side' = the former view, kept as the alternate); `id` for the file. */
export function makeFly(view, id) {
  return view === 'front' ? frontFly(id) : sideFly(id);
}

const ALT = 'Dumbbell fly, front view from the feet. Lying on a flat bench, feet flat, the lifter lowers the dumbbells out to the sides in a wide arc, elbows slightly bent and fixed, until level with the chest, then raises them back. Mistake: dumbbells sinking below the bench.';

function frontFly(id) {
  const phantom = ['l', 'r'].map(s => ({ type: 'line', pts: hexRing(lmStart[`grip.${s}`], DB.head / 2), cls: 'eq-line m-line', z: 'front' }));
  return {
    id, name: 'Dumbbell Fly', view: 'front',
    // y0: the floor under the feet (world y 0, z FOOT_Z) at the approved floor y 339 once pitched (D-LIB8-floor)
    camera: { x0: 179, y0: +(339 - FOOT_Z * Math.sin(PITCH * R) * PX_M).toFixed(2), pitch: PITCH },
    torso: 'volume',
    poses: { start, end, via },
    equipment: [
      { type: 'floor', from: [-0.5, 0, FOOT_Z], to: [0.5, 0, FOOT_Z] },   // the floor line under the feet, clear of the zoom corners
      { type: 'bench', at: [0, BENCH_TOP, BENCH_Z], len: BENCH_LEN },
      (lm, ctx) => (ctx.pose === 'end' ? phantom : null),
      lm => [{ type: 'dumbbell', at: lm['grip.l'], axis: [0, 0, 1], z: 'front', part: 'db.l' },
        { type: 'dumbbell', at: lm['grip.r'], axis: [0, 0, 1], z: 'front', part: 'db.r' }],
    ],
    checks: CHECKS,
    marks: ['elbow.l', 'elbow.r'],
    startParts: ['arm.l', 'arm.r'],
    ghosts: { count: 1, parts: ['arm.r', 'db.r'] },   // one: with the volume trunk, 2 ghosts make the card chunk 159.2 KB > H7's 150 KB (1: 152.4 KB)
    trace: { point: 'grip.l', trim: [12, 12] },
    measure: { vertex: 'elbow.r', from: 'shoulder.r', to: 'wrist.r', radius: 18, title: 'Elbow', value: 'slight bend, held' },
    datum: [{ y: 'grip.r', from: { at: 'grip.r', off: [-14, 0] }, to: { at: 'grip.l', off: [14, 0] }, mistake: false }],   // the stop line: dumbbells level with the chest top (c4)
    callouts: [
      { key: 'elbows', text: 'Soft<br>elbows', anchor: 'elbow.l', cue: 'Keep a slight elbow bend that stays the same all the way.' },
      { key: 'stop', text: 'Stop at<br>chest', anchor: 'grip.l', cue: 'Lower until the dumbbells are level with your chest, no deeper.' },
      { key: 'parallel', text: 'Dumbbells<br>parallel', anchor: 'start:grip.l', cue: 'Keep both dumbbells parallel, palms facing, through the whole arc.' },
    ],
    tempo: [{ phase: 'Lower', s: 2, move: true }, { phase: 'Raise', s: 2, move: true }],
    mistake: {
      pose: wristPose,
      guides: [],
      tells: [
        { key: 'wrists', text: 'Wrists bend', anchor: { at: 'grip.r', pose: 'mistake' }, box: { left: 12, top: 70 }, cue: 'Your wrists bend back out of line with the forearms as the dumbbells arc.' },   // c13
      ],
    },
    zoom: { view: 'mistake', k: 2 },   // the smallest k on the ladder that reaches H3's bar (1.5 gives 9.9 px)   // the smallest k on the ladder that reaches H3's bar (1.5 gives 9.9 px)
    alt: ALT,
  };
}

const CHECKS = [
  { landmark: 'backUpper', plane: { point: [0, BENCH_TOP, 0], normal: [0, 1, 0] }, pose: 'all', tol: 1 },   // upper back ON the pad (c2)
  { landmark: 'buttock', plane: { point: [0, BENCH_TOP, 0], normal: [0, 1, 0] }, pose: 'all', tol: 1 },     // buttocks ON the pad
  { landmark: 'head', above: { point: [0, BENCH_TOP, 0], normal: [0, 1, 0] }, pose: 'all' },               // head never inside it
  { landmark: 'sole.r', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },            // feet ON the floor
  { landmark: 'sole.l', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
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
