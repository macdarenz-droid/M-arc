// Bent-over dumbbell rear delt fly. The plate is the FRONT view, the card's plate.view (LIB-PLATEFIX-1: the default
// export at the end of this file, pitch 40). The SIDE drawing below (SIDE, figure facing screen right) was the plate from
// LIB-8R (D-LIB8R-FLIES fallback, F6) until the W2 layers panel read it as a row; it is now the sheet extra
// bent_over_dumbbell_rear_delt_fly__alt.mjs. The history below is LIB-8R's (pitch 15 front view, S3 shrug).
// View decision (go/no-go): the census asks for the front view, because the exercise is an arm sweep across the
// body (horizontal abduction). Rendered both ways:
//  - Front view, trunk 80 deg (the textbook pose): the engine draws a flexed trunk as a foreshortened FRONTAL
//    outline (SPEC 8), so the torso collapses to a thin band at shoulder height, the head all but disappears and
//    the legs are drawn over it: a pair of legs with arms growing from the shoulders. Not readable.
//  - Front view with the trunk raised to 45 deg (tried in scratch only): the figure reads as a person standing
//    upright doing a lateral raise, which teaches the wrong exercise. Not acceptable either.
//  - Side view (this file): the hinge a coach checks (thorax 80 deg, soft knees, hips back, flat back, balance
//    over mid-foot) is true and clear, and the dumbbells visibly rise from under the shoulders to shoulder height.
//    Limit: the sweep out to the sides points at the camera, so the raised near arm is foreshortened to a short
//    stub beside the shoulder. The callouts/card text must carry "out to the sides".
// Form sources (standard technique descriptions; numbers below are named constants for the research card):
//  ACE Exercise Library, bent-over reverse fly: hinge at the hips with a flat back until the torso is nearly
//   parallel to the floor, knees slightly bent; arms hang under the chest, elbows slightly bent and fixed; raise
//   the arms out to the sides until they are level with the shoulders, squeezing the shoulder blades; lower slowly.
//  NSCA, Essentials of Strength Training and Conditioning, 4th ed. (Haff & Triplett 2016): bent-over lateral raise
//   / reverse fly, torso flexed near parallel, neutral spine, elbows slightly flexed. (Book, not re-read online.)
// Geometry decisions (confirmed by the engine report `angles`):
//  Held hinge (as barbell_row): thorax inclination = pelvis tilt + lumbar flexion; the same root and legs at start
//   and end; only the arms, shoulder blades and dumbbells move (startParts and ghosts: arms and dumbbells).
//  Balance: the root is SOLVED so the whole-body centre of mass (Winter 2009 Table 4.1 segment masses, as
//   single_leg_romanian_deadlift) plus both dumbbells sits over mid-foot (z = 0) in the start pose, and the root
//   height gives the knee angle. With the arms raised the COM moves 0.3 cm (arms move sideways, not fore-aft).
//  Trunk (CARD): thorax 80 deg from vertical (10 deg short of parallel) = pelvis 75 + lumbar 5; knees 20 deg
//   (CARD); feet hip width (mid-soles 22 cm apart), toes forward; neck in line with the thorax.
//  Arms: elbows held ~20 deg bent (grip 1.5% closer to the shoulder than a straight arm), elbows bowing out
//   (IK pole lateral at the start, up at the top). Start: hands hanging under the shoulders, 4 cm inside them.
//   End: side view stops the drawn sweep at TOP 75 deg (see TOP); the front alt draws the full 90 deg (hands level
//   with the shoulders straight out to the sides),
//   shoulder blades squeezed 3 cm. Two via poses on the arc (30 and 60 deg) so the ghosts and trace follow the
//   circular sweep instead of a chord.
//  Dumbbells: neutral grip (palms facing), handle pointing along the trunk toward the head (world +z): the side
//   view shows the dumbbell in profile, the front view (alt) the hex heads end-on.
// Research card (docs/research/howto/cards/bent_over_dumbbell_rear_delt_fly.json, card v2, verified at
//  claude/libht-research e2a70bc): callouts = plate.checkpoints (Flat back c2, Soft elbows c2, Level arms c3); tempo = plate.tempo
//  (up 1 s, down 2 s, no pause, c10). The card's plate.view is FRONT (flag F6 for this side view). Re-checked with
//  the card's layers: the front view still draws the hinged trunk as a band with no head, and its drawable Mistake
//  (shrug, c3) moves the shoulders about 2 px there (render of __alt): no-go stands.
//  Its "out to the sides" is carried by the Level arms cue.
// CARD numbers: the card gives none for the trunk angle, the knee bend, the elbow bend or the top arm height
//  ("about level with the body", c3). INCL 80, KNEE 20, ELBOW 20 and the 75/90 deg top stay unsourced (flagged).
// Front view (history): before LIB-20 the engine drew a flexed trunk in front view as a foreshortened frontal outline
//  (SPEC 8). LIB-20's pitch and volume trunk fix that (D-SPIKE-hinge, __alt), not the size of the front-view shrug.
import { landmarksOf } from '../engine.mjs';

const H = 1.75, R = Math.PI / 180;
const FOOT_X = 0.11;                                     // mid-sole lateral offset (hip width)
const INCL = 80, SPINE = 5, KNEE = 20;                   // CARD
const ELBOW = 20;                                        // CARD: held elbow bend (deg)
const L1 = 0.186 * H, L2 = (0.146 + 0.46 * 0.108) * H;   // upper arm; forearm + grip offset (Winter)
const REACH = Math.sqrt(L1 * L1 + L2 * L2 + 2 * L1 * L2 * Math.cos(ELBOW * R));   // shoulder to grip at that bend
const IN = 0.04;                                         // start: hands 4 cm inside the shoulders
const PRO_START = 1, PRO_END = -3;                       // shoulder blades (cm)
const DB_MASS = 0.05;                                    // each dumbbell, fraction of body mass (~4 kg at 75 kg)

const feet = { l: { at: [FOOT_X, 0, 0], toe: [0, 0, 1] }, r: { at: [-FOOT_X, 0, 0], toe: [0, 0, 1] } };
const L3 = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
function com(lm, extra = []) {                           // Winter (2009) Table 4.1
  const parts = [[0.081, lm.ear], [0.497, L3(lm.shoulders, lm.hips, 0.5)], ...extra];
  for (const s of ['l', 'r']) parts.push(
    [0.028, L3(lm[`shoulder.${s}`], lm[`elbow.${s}`], 0.436)], [0.016, L3(lm[`elbow.${s}`], lm[`wrist.${s}`], 0.430)], [0.006, lm[`grip.${s}`]],
    [0.100, L3(lm[`hip.${s}`], lm[`knee.${s}`], 0.433)], [0.0465, L3(lm[`knee.${s}`], lm[`ankle.${s}`], 0.433)], [0.0145, L3(lm[`heel.${s}`], lm[`toe.${s}`], 0.5)]);
  const M = parts.reduce((a, p) => a + p[0], 0);
  return [0, 1, 2].map(i => parts.reduce((a, p) => a + p[0] * p[1][i], 0) / M);
}
const kneeOf = lm => {
  const a = [0, 1, 2].map(i => lm['hip.r'][i] - lm['knee.r'][i]), b = [0, 1, 2].map(i => lm['ankle.r'][i] - lm['knee.r'][i]);
  return 180 - Math.acos((a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) / Math.hypot(...a) / Math.hypot(...b)) / R;
};
const solve = (f, a, b) => {                             // bracketed root finder (Illinois regula falsi)
  let fa = f(a), fb = f(b), side = 0;
  if (fa * fb > 0) throw new Error(`bent_over_dumbbell_rear_delt_fly: no solution in [${a}, ${b}]`);
  for (let i = 0; i < 60 && Math.abs(b - a) > 1e-7; i++) {
    const c = (a * fb - b * fa) / (fb - fa), fc = f(c);
    if (fc * fb > 0) { b = c; fb = fc; if (side === -1) fa /= 2; side = -1; } else if (fa * fc > 0) { a = c; fa = fc; if (side === 1) fb /= 2; side = 1; } else return c;
  }
  return (a + b) / 2;
};

const body = (y, z, pro) => ({ root: { at: [0, y, z], tilt: INCL - SPINE }, trunk: SPINE, neck: 0, scap: { pro }, plant: feet });
// Hand on the sweep arc at angle a (0 = hanging, 90 = straight out), in the vertical plane through the shoulder.
const hands = (lm, a) => {
  const out = {};
  for (const [s, sg] of [['l', 1], ['r', -1]]) {
    const S = lm[`shoulder.${s}`], u = Math.sin(a * R), d = Math.cos(a * R);
    out[s] = { at: [S[0] + sg * (REACH * u - IN * d), S[1] - REACH * d, S[2]], pole: [sg * d, u, 0] };
  }
  return out;
};
const pose = (y, z, a) => { const pro = PRO_START + (PRO_END - PRO_START) * a / 90, b = body(y, z, pro); return { ...b, reach: hands(landmarksOf(b, H), a) }; };
const hipY = z => solve(y => kneeOf(landmarksOf(body(y, z, PRO_START), H)) - KNEE, 0.5, 0.935);
const dbs = lm => [[DB_MASS, lm['grip.l']], [DB_MASS, lm['grip.r']]];
const ROOT_Z = solve(z => { const lm = landmarksOf(pose(hipY(z), z, 0), H); return com(lm, dbs(lm))[2]; }, -0.5, 0.2);
const ROOT_Y = hipY(ROOT_Z);

const start = pose(ROOT_Y, ROOT_Z, 0);
// Top of the sweep (critic run 2, R1/R3): at 90 deg the near arm points straight at the camera and the dumbbell lies
// on the back with no arm or hand visible. The side view stops the drawn sweep at TOP = 75 deg from hanging, where
// the forearm, fist and dumbbell show below the back line; "about level with the body" (c3) is carried by the Level
// arms cue. The front view (__alt) keeps the full 90 deg via posesAt(90).
const TOP = 75;
export const posesAt = top => ({ start: pose(ROOT_Y, ROOT_Z, 0), via: [pose(ROOT_Y, ROOT_Z, top / 3), pose(ROOT_Y, ROOT_Z, 2 * top / 3)], end: pose(ROOT_Y, ROOT_Z, top) });
const { via, end } = posesAt(TOP);

// Mistake (card plate.mistake, c3; LIB-8R, D-LIB8R-FLIES): the shoulders shrug up toward the ears as the dumbbells rise.
// The end pose with the shoulder blades raised M_SHRUG (golden A's lateral-raise shrug, ref-src/plate.mjs:147) and
// still squeezed. The card's top fault, the torso swing (c5, c4), is not drawable on the card (drawable false), so F7 is
// named (decision 9). The census front view was drawn first (pitch 15, volume trunk): its shrug moves along the trunk
// axis, which points almost at the camera, 1.3 px at plate scale and 5.1 px at k 4, below H3's 11.39 px at every k on
// the ladder (S3), so this side view carries the card's own Mistake unchanged, F6 named; the front view is the alt.
const M_SHRUG = 10;                                      // cm, scap elevation. LIB-PLATEFIX-2 D-PF2-SHRUG10: sized to read with the drawn 13 px displacement (pf3 R5/R11; the plank SAG precedent: no number in copy). Was 8 (LIB-PLATEFIX-1), 5 (golden A's lateral-raise shrug)
const mistakePose = { scap: { elev: M_SHRUG, pro: PRO_END } };
/** The unsourced sizes (pilot-a2/sizes.json, D-LIB17-SIZE form; LIB-8R). */
const PITCH = 26;                                        // front plate camera pitch (deg), LIB-PLATEFIX-1 (see the plate below)
const DB_HEAD_R = 0.119 / 2, DB_CORE_R = 0.0158;        // the dumbbell primitive's end-on hex (head/2 across the corners) and core ring (vendor/engine/equipment.mjs), for the start ghost
const POSTURE_R = 68;                                    // drawing value (pf4 R11): the side-profile zoom's circle radius (plate px; 148 card px), so the whole bent-over body from the head to the knees reads at k 1
const SHRUG_K = 2;                                       // drawing value (pf4 R5): the Mistake side-profile zoom's k; the shoulder, the neck gap and the ear fill the circle
export const SIZES = { FOOT_X, INCL, SPINE, KNEE, ELBOW, IN, PRO_START, PRO_END, TOP, M_SHRUG, PITCH, BACK_OUT: 0.02, BACK_EXT: 0.15, POSTURE_R, SHRUG_K };

const G0 = landmarksOf(start, H)['grip.r'], HZ = 0.135, HY = 0.119 * 0.866 / 2;
const HH = 0.065, HR = 0.008;                          // handle half-length, half-thickness (m)
const START_DB = [[-HZ, -HY], [-HH, -HY], [-HH, -HR], [HH, -HR], [HH, -HY], [HZ, -HY], [HZ, HY], [HH, HY], [HH, HR], [-HH, HR], [-HH, HY], [-HZ, HY], [-HZ, -HY]].map(([dz, dy]) => [G0[0], G0[1] + dy, G0[2] + dz]);
const floor = { point: [0, 0, 0], normal: [0, 1, 0] };

/** The side drawing (the plate until LIB-PLATEFIX-1; now the sheet extra, bent_over_dumbbell_rear_delt_fly__alt.mjs). */
export const SIDE = {
  id: 'bent_over_dumbbell_rear_delt_fly', name: 'Bent-Over Dumbbell Rear Delt Fly', view: 'side', facing: 'right',
  camera: { x0: 172, y0: 339 },                          // reference scale; the hinged figure centred
  poses: { start, via, end },
  equipment: [
    { type: 'floor', from: -0.75, to: 0.75 },
    lm => [
      { type: 'dumbbell', at: lm['grip.l'], axis: [0, 0, 1], part: 'db', z: 'front' },
      { type: 'dumbbell', at: lm['grip.r'], axis: [0, 0, 1], part: 'db', z: 'front' },
    ],
    // start dumbbell, dashed side profile (engine workaround as in the squat: the start layer never draws moving
    // equipment): heads 27 cm end to end, 10.3 cm across the hex flats
    (lm, ctx) => (ctx.pose === 'end' ? { type: 'line', cls: 'eq-cable m-line', pts: START_DB, z: 'front', part: 'startdb' } : null),
  ],
  checks: [
    { landmark: 'heel.r', plane: floor, pose: 'all', tol: 0.5 },
    { landmark: 'ball.r', plane: floor, pose: 'all', tol: 0.5 },
    { landmark: 'heel.l', plane: floor, pose: 'all', tol: 0.5 },
    { landmark: 'ball.l', plane: floor, pose: 'all', tol: 0.5 },
    // c1 'Hold a pair of dumbbells' (plate fact): the hands on the dumbbells at the start (as dumbbell_overhead_triceps_extension.mjs:69)
    ...['wrist.r', 'wrist.l'].map(landmark => ({ landmark, at: landmarksOf(start, H)[landmark], pose: 'start', tol: 0.5 })),
  ],
  startParts: ['arm.r'],
  ghosts: { count: 2, parts: ['arm.r', 'db'] },
  trace: { point: 'grip.r', trim: [10, 12] },
  datum: [{ x: [0, 0, 0], from: 349, to: 60 }],           // mid-foot plumb line: the body balances over it
  // The elbow bend points at the camera in this view (drawn arc 0 deg), so the one arc is the hip hinge the card
  // describes (c2: tilt at the hips, spine straight). No card number: a worded value, as machine_chest_press.
  measure: { vertex: 'hip.r', from: 'knee.r', to: 'shoulder.r', radius: 24, title: 'Hip', value: 'hinged, spine straight', box: { left: 8, top: 250 } },
  callouts: [
    // Soft elbows: the elbow points at the camera and projects onto the shoulder, so the leader ends a third of the way
    // down the forearm, where the bend shows (panel mx4 R4).
    { key: 'back', text: 'Flat back', anchor: 'backUpper', cue: 'Hinge at the hips with a straight spine and a braced core.' },              // c2
    { key: 'elbows', text: 'Soft elbows', anchor: { along: ['elbow.r', 'wrist.r'], t: 0.33 }, prefer: 'above', cue: 'Keep the same slight elbow bend from bottom to top.' },                    // c2
    { key: 'level', text: 'Level arms', anchor: 'grip.r', prefer: 'below', cue: 'Raise the arms out to the sides to about body level, no higher.' },          // c3
  ],
  tempo: [{ phase: 'Raise', s: 1, move: true }, { phase: 'Lower', s: 2, move: true }],                                                        // c10
  mistake: {
    pose: mistakePose,
    guides: [
      { kind: 'arrow', from: { at: 'shoulderTop.r', pose: 'end' }, to: { at: 'shoulderTop.r', pose: 'mistake' } },
    ],
    tells: [
      { key: 'shrug', text: 'Shoulders<br>shrug', anchor: { at: 'shoulderTop.r', pose: 'mistake' }, box: { left: 70, top: 96 }, cue: 'The shoulders hike up toward the ears as the dumbbells rise.' },   // c3
    ],
  },
  zoom: { view: 'mistake', k: 2 },   // the smallest k on the ladder that reaches H3's bar (1.5 gives 11.1 px)
  // Drawable fault (decision 9): the card's top fault, the torso swing (c4, c5; topFault 'swing'), is drawable false on
  // the card, so the plate draws its drawable fault, the shrug (c3), and F7 is named on the sheet.
  alt: 'Bent-over dumbbell rear delt fly, side view. Hinged forward at the hips with a straight spine, the lifter raises two dumbbells from hanging under the chest out to the sides until the arms are about level with the body, elbows slightly bent.',
};

// ---- the plate: FRONT view (LIB-PLATEFIX-1, PLATEFIX PLAN RULED #385 6633777095) ----
// The W2 layers panel (#379 6633524031) read the side plate as a row: side-on, the arms sweep at the camera. The card's
// plate.view is front (F6 dropped). The camera is raised on the viewer's side and tilted down PITCH (D-SPIKE-hinge).
// Plates panel pf1 (#385 6636073314): at 40 the trunk read as pitched down at the viewer and the hanging arm short, so
// PITCH is 26: the back reads as a flat oval above the head, the shoulder joints sit higher and the hanging arm shows at
// 0.91 of its length (rendered at 0, 12, 24 and 26: at 0 and 12 the figure reads as standing upright with the head on top; 26, not 24, so the 8 cm shrug clears H3 at k 4).
// The full sweep to level, c3, with 5 via poses so the Trace is one smooth arc about the shoulder (pf1 R6).
// Mistake (c3): the shoulder blades raised M_SHRUG, as the side drawing. From the front the shrug moves the shoulder caps
// toward the head, so it is drawn as a change of shape (pf2 R5): on each side a red dashed shoulder-cap and upper-trapezius
// contour bunches from the faulty cap's top over a hump to the side of the head oval, closing the gap between shoulder and
// head. No arrows: arrows joined by a line read as 'squeeze the blades', the correct cue (pf2 R5). The faulty caps and arms
// are the engine's own outline. The zoom's source ring sits on the shoulder-head gap (pf2 R11).
const PC = Math.cos(PITCH * R), PS = Math.sin(PITCH * R), PXM = 256 / 1.75;   // the engine's reference scale (vendor/engine/plate.mjs REF_CAMERA; QA reads pxPerM 146.3)
const FRONT_POSES = { start: pose(ROOT_Y, ROOT_Z, 0), via: [15, 30, 45, 60, 75].map(a => pose(ROOT_Y, ROOT_Z, a)), end: pose(ROOT_Y, ROOT_Z, 90) };
const lmE = landmarksOf(FRONT_POSES.end, H);
const W = (w, dx, dy) => [w[0] + dx / PXM, w[1] - dy / (PXM * PC), w[2]];   // world point at plate offset (dx right, dy down) on the pitched camera
// pf3 R7 note: the start dumbbell as a dashed end-on hexagon (the primitive's own end-on face) with its core ring, at the start grip
const lmS = landmarksOf(FRONT_POSES.start, H);
const startDb = G => [Array.from({ length: 7 }, (_, i) => W(G, DB_HEAD_R * PXM * Math.cos(i * Math.PI / 3), DB_HEAD_R * PXM * Math.sin(i * Math.PI / 3))),
  Array.from({ length: 17 }, (_, i) => W(G, DB_CORE_R * PXM * Math.cos(i * Math.PI / 8), DB_CORE_R * PXM * Math.sin(i * Math.PI / 8)))];
// pf3 R1, pf4 R11 (D-PF2-POSTZOOM): the hinge and flat back in a side-projection posture zoom of the end pose (the main
// view's moment), the whole bent-over body from the head to the knees, against a straight grey dashed line along the back
// (sacrum -> upper back, BACK_OUT out of the back, BACK_EXT past each end)
const BACK_REF = (() => { const a = lmE.sacrum, b = lmE.backUpper, d = [0, b[1] - a[1], b[2] - a[2]], L = Math.hypot(...d), n = [0, -d[2] / L, d[1] / L];
  const o = n[1] < 0 ? -1 : 1, off = i => o * n[i] * SIZES.BACK_OUT, ext = SIZES.BACK_EXT;
  return [[a[0], a[1] - d[1] * ext + off(1), a[2] - d[2] * ext + off(2)], [b[0], b[1] + d[1] * ext + off(1), b[2] + d[2] * ext + off(2)]]; })();
// pf4 R5: the faulty shoulder in the side-profile Mistake zoom (the start pose with the Mistake shoulder blades): a red
// dashed shoulder cap (the engine's cap radius, CAP_R plate px) and upper-trapezius line from the cap top over the trap to
// the neck, in the side plane through the near shoulder, so the zoom draws them in its own projection
const CAP_R = 7.68 / PXM;                                // the engine's shoulder-cap radius (the svg's shcap circle r 7.68 at the reference scale), in metres
// The front Mistake is the elevation alone: merged into the end pose (scap pro PRO_END) it is the same pose as the side
// drawing's mistakePose, and merged into the start pose (the side-profile Mistake zoom) it adds no blade squeeze
const FRONT_MISTAKE = { scap: { elev: M_SHRUG } };
const lmSM = landmarksOf({ ...FRONT_POSES.start, scap: { ...FRONT_POSES.start.scap, ...FRONT_MISTAKE.scap } }, H);
const SHRUG_SIDE = (() => { const c = lmSM['shoulder.r'], x = c[0];
  return [{ kind: 'dashed', pts: Array.from({ length: 25 }, (_, i) => [x, c[1] + CAP_R * Math.sin(i * Math.PI / 12), c[2] + CAP_R * Math.cos(i * Math.PI / 12)]) },
    { kind: 'dashed', smooth: true, pts: [lmSM['shoulderTop.r'], [x, lmSM['trap.r'][1], lmSM['trap.r'][2]], [x, (lmSM['trap.r'][1] + lmSM.ear[1]) / 2, (lmSM['trap.r'][2] + lmSM.ear[2]) / 2]] },
    { kind: 'arrow', from: { at: 'shoulderTop.r', pose: 'end' }, to: { at: 'shoulderTop.r', pose: 'mistake' } }]; })();
export default {
  ...SIDE,
  view: 'front', facing: undefined,
  camera: { x0: 195, y0: 339, pitch: PITCH },
  torso: 'volume',
  poses: FRONT_POSES,
  // no dashed side-profile start dumbbell; one part per dumbbell. pf1 R2: drawn end-on, the axis on the view line (the
  // neutral-grip handle runs along the trunk, 16 deg off that line at INCL 80 and PITCH 26), so they match the start's end-on hex
  equipment: [{ type: 'floor', from: -0.55, to: 0.55 },
    lm => ['l', 'r'].map(s => ({ type: 'dumbbell', at: lm[`grip.${s}`], axis: [0, PS, PC], part: `db.${s}`, z: 'front' })),
    (lm, ctx) => (ctx.pose === 'end' ? ['l', 'r'].flatMap(s => startDb(lmS[`grip.${s}`]).map(pts => ({ type: 'line', pts, cls: 'eq-line m-line', z: 'front', part: `startdb.${s}` }))) : null)],
  startParts: ['arm.r', 'db.r'],
  ghosts: { count: 0 },   // H7: 1 ghost (arm and dumbbell) made the chunk 161.6 KB; the Trace carries the sweep
  datum: [{ y: 'shoulder.r', from: 'grip.r', to: 'grip.l' }],   // shoulder level: the hands finish on it (c3)
  measure: { vertex: 'elbow.r', from: 'shoulder.r', to: 'wrist.r', radius: 18, title: 'Elbow', value: 'slight bend, held' },   // c2
  callouts: SIDE.callouts.map(c => ({ ...c, prefer: undefined })),
  // pf4 R5: from the front the shrug runs along the trunk, nearly at the camera, so the front Mistake draws no extra rings
  // (the engine's faulty caps only); the shrug is drawn in the side-profile Mistake zoom, where elevation reads: the grey
  // neck gap between shoulder and ear, the red dashed faulty shoulder moved toward the head, and a red arrow
  mistake: {
    pose: FRONT_MISTAKE,
    parts: ['shcap.l', 'shcap.r'],   // the faulty shoulder caps only (H7: the faulty trunk outline too made 154.6 KB)
    guides: [],
    tells: [
      { key: 'shrug', text: 'Shoulders<br>shrug', anchor: { at: 'shoulderTop.r', pose: 'mistake' }, cue: 'The shoulders hike up toward the ears as the dumbbells rise.' },   // c3
    ],
  },
  zoom: [
    { view: 'normal', k: 1, r: POSTURE_R, focus: { region: ['head', 'backUpper', 'sacrum', 'buttock', 'hip.r', 'shoulder.r'], pose: 'end' }, project: 'side', ref: BACK_REF },
    // pf4 R5 (D-PF2-SHRUG10, D-PF2-PLACE): the shrug side-on, off the body axis, with the arms hanging (start): at the
    // end pose the arms point at the camera and cover the shoulder and neck
    { view: 'mistake', k: SHRUG_K, r: POSTURE_R, focus: { region: ['shoulder.r', 'trap.r', 'ear', 'backUpper'], pose: 'start' }, project: 'side', place: 'outer', guides: SHRUG_SIDE }],
  alt: 'Bent-over dumbbell rear delt fly, front view. Hinged forward at the hips with a straight spine, the lifter raises two dumbbells from hanging under the chest out to the sides until the arms are about level with the body, elbows slightly bent.',
};
