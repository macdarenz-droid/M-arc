// Skull Crusher (lying triceps extension, EZ bar), side view, facing right. H (own parent; lib-10-card LB2 ids).
// View: SIDE (card plate.view = census view): the vertical upper arms, the bar's end point at the forehead and the
// Mistake (upper arms drifting back) all read in the sagittal plane (c4, c5, c7). Elbow width (c6) stays a cue.
// Clone source (D-LIB9-CLONE): the supine class of dumbbell_bench_press (pilot A, #109 @ e6f39ff; D-LIB8FIX-CARRY),
// copied, never imported: `supine()` with its bisect made to throw when its bracket holds no root (rule b), the flat
// bench at 43 cm, the feet, the scapular set. New: the elbow-only arm (upper arm vertical, elbow over the shoulder
// joint), the EZ bar.
// Sources: research card docs/research/howto/cards/skull_crusher.json (claude/libht-research 0393aac; Do 6 copies the
// head the supervisor names), claims c1 (flat bench, feet firmly on the floor, closed grip), c2 (bar pressed to straight
// elbows), c3 (wrists neutral), c4 (lower slowly to the forehead or slightly behind the head), c5 (upper arms stay
// vertical; stop just above the forehead), c10 (head close to the end of the bench; close grip on the EZ bar),
// c13 (tempo, ACSM 1-2 s each way).
// Geometry decisions:
//  - Supine class (copied): pelvis tilt -90, the trunk that puts backUpper and buttock on the pad plane, the neck that
//    puts the back of the skull (OCCIPUT) on it. Checks prove backUpper, buttock (plane, tol 1 cm), head clearance and
//    soles on the floor (c1).
//  - Bench: flat, pad top 43 cm (the anchor's), 1.2 m; its head end HEAD_END past the top of the skull (c10: the head
//    close to the end).
//  - Feet flat, mid-sole FOOT_Z in front of the hip joint (the anchor's), shins about vertical (c1).
//  - Arms: the elbow sits straight over the shoulder joint, one upper arm length up (upper arms vertical, c5), in
//    every pose; only the elbow bends. Grips GRIP_X off the midline (c10: a close grip on the EZ bar).
//  - Start (top, c2): elbows straight (TOP_ELBOW), so the bar is over the shoulder joints.
//  - End (bottom, c4, c5): the elbow bends until the grip centre is FOREHEAD_GAP above the forehead point
//    (head-frame FOREHEAD, the side head outline's brow top): "just above the forehead".
//  - EZ bar: the vendored barbell seen end-on (its camber is frontal and does not show from the side), with
//    EZ_PLATE_D plates (smaller than the 8's 45 cm plates, which ringed the head); the plate outline behind the body and the sleeve dot in front, as barbell_back_squat draws
//    its bar. The start sleeve is a dashed dot in the end layer (the start layer never draws moving equipment).
//  - Scale: reference 146.29 px/m.
// Plate labels (card, 0393aac): callouts = plate.checkpoints c5 (Upper arms vertical), c4 (Bar to forehead),
//   c3 (Wrists neutral); tempo = plate.tempo c13 (up 1, down 2, no pause; the plate starts at the top: Lower, then
//   Extend), as the tempo map in lb2/DESIGN.md proposes. The Mistake (plate.mistake c7) waits for LR-31 (LIB-TOPRANK)
//   on a research head the supervisor names (LIB-10 card).
// Unsourced numbers (no card claim gives them; 13.3 must-fix 14): BENCH_TOP and FOOT_Z (the anchor's), HEAD_END,
//   GRIP_X (a "close grip" made a number), TOP_ELBOW (the anchor's straight arm), FOREHEAD_GAP ("just above" made a
//   number), EZ_PLATE_D.
import { landmarksOf, fk, resolve, normPose, WINTER, REF } from '../engine.mjs';

const H = 1.75, BODY = { height: H };
const R = Math.PI / 180;
const BENCH_TOP = 0.43;                               // pad top (m), the anchor's
const BENCH_LEN = 1.2;                                // pad length (m)
const HEAD_END = 0.02;                                // pad head end past the top of the skull (m) (c10)
const FOOT_Z = 0.51;                                  // mid-sole, in front of the hip joint (m) (c1)
const SCAP = { elev: -1, pro: -3 };                   // blades back and down (cm), the anchor's
const GRIP_X = 0.16;                                  // grip centre off the midline (m): the EZ bar's inner grip (c10)
const TOP_ELBOW = 4;                                  // top: elbow flexion (deg), straight (c2)
const FOREHEAD_GAP = 0.05;                            // end: grip centre above the forehead point (m) (c5)
const EZ_PLATE_D = 0.30;                              // plate diameter (m): small plates, the usual EZ-bar load
const OCCIPUT = [0, 0.955, -0.056];                   // back of the skull on the side head outline (head frame, H)
const FOREHEAD = [0, 0.95, 0.06];                     // brow top on the side head outline (head frame, H)
const CROWN = [0, 1.0, 0];                            // top of the skull (head frame, H)

// ---- supine class (copied from the anchor; the bisect throws on a bracket with no root, D-LIB9-CLONE b) ----
export const bisect = (f, lo, hi) => { if (!(f(lo) <= 0 && f(hi) >= 0)) throw new Error(`skull_crusher: no solution in [${lo}, ${hi}]`); for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (f(m) > 0) hi = m; else lo = m; } return (lo + hi) / 2; };
export function supine(top, z = 0, { tilt = -90, height = H } = {}) {
  const body = { height }, at0 = { root: { at: [0, 0, z], tilt } };
  const lm = p => landmarksOf(p, height);
  const occ = p => fk(resolve(normPose(p, body), body).q, body).head(OCCIPUT);
  const pad = lm(at0).buttock[1];
  const trunk = bisect(t => lm({ ...at0, trunk: t }).backUpper[1] - pad, -40, 30);
  const neck = bisect(n => occ({ ...at0, trunk, neck: n })[1] - pad, -40, 60);
  return { root: { at: [0, top - pad, z], tilt }, trunk, neck };
}

const LYING = supine(BENCH_TOP, 0);
const feet = { l: { at: [0.10, 0, FOOT_Z] }, r: { at: [-0.10, 0, FOOT_Z] } };
const base = { ...LYING, scap: SCAP, plant: feet };
const lm0 = landmarksOf(base, H);
const S = { l: lm0['shoulder.l'], r: lm0['shoulder.r'] };
const sk0 = fk(resolve(normPose(base, BODY), BODY).q, BODY);
const L1 = WINTER.upperArm * H, L2 = WINTER.forearm * H + REF.gripOff * H;
const HEAD_TOP = sk0.head(CROWN), BROW = sk0.head(FOREHEAD);
const BENCH_Z = HEAD_TOP[2] - HEAD_END + BENCH_LEN / 2;   // pad centre

// Arm: elbow straight over the shoulder joint (upper arm vertical, c5); the forearm at `flex` deg from straight, in the
// sagittal plane, toward the head; the grip GRIP_X off the midline (the forearm leans in a little in the front plane).
const elbowOf = side => [S[side][0], S[side][1] + L1, S[side][2]];
const gripAt = (side, flex) => { const s = side === 'l' ? 1 : -1, E = elbowOf(side), dx = s * GRIP_X - E[0], l = Math.sqrt(L2 * L2 - dx * dx);
  return [s * GRIP_X, E[1] + l * Math.cos(flex * R), E[2] - l * Math.sin(flex * R)]; };
const reachAt = (side, flex) => ({ at: gripAt(side, flex), pole: [0, 1, 0] });
// End: the elbow bends until the grip centre is FOREHEAD_GAP above the forehead point (c5: just above the forehead).
const END_FLEX = bisect(f => (BROW[1] + FOREHEAD_GAP) - gripAt('r', f)[1], 60, 170);
export const info = () => { const g = gripAt('r', END_FLEX), t = gripAt('r', TOP_ELBOW), chin = lm0.chin;
  return { endElbowFlexDeg: +END_FLEX.toFixed(1), endGripVsBrowCm: { up: +((g[1] - BROW[1]) * 100).toFixed(1), headward: +((BROW[2] - g[2]) * 100).toFixed(1) },
    topGripFootwardOfChinCm: +((t[2] - chin[2]) * 100).toFixed(1), benchHeadEndZ: +(BENCH_Z - BENCH_LEN / 2).toFixed(3), headTopZ: +HEAD_TOP[2].toFixed(3) }; };

const start = { ...base, reach: { l: reachAt('l', TOP_ELBOW), r: reachAt('r', TOP_ELBOW) } };
const end = { ...base, reach: { l: reachAt('l', END_FLEX), r: reachAt('r', END_FLEX) } };
// The bar travels on a circle round the elbow: via keys at even steps of elbow bend, so the trace and the ghosts follow
// that arc and the upper arm never leaves the vertical between poses (13.3 must-fix 1 and 3).
const VIA_FLEX = [1, 2, 3, 4, 5, 6].map(k => TOP_ELBOW + (END_FLEX - TOP_ELBOW) * k / 7);
const via = VIA_FLEX.map(f => ({ ...base, reach: { l: reachAt('l', f), r: reachAt('r', f) } }));

const barOf = lm => [0, lm.grips[1], lm.grips[2]];
const BAR0 = barOf(landmarksOf(start, H));
const START_DOT = Array.from({ length: 17 }, (_, k) => [0, BAR0[1] + 0.025 * Math.sin(k * Math.PI / 8), BAR0[2] + 0.025 * Math.cos(k * Math.PI / 8)]);

export default {
  id: 'skull_crusher', name: 'Skull Crusher', view: 'side', facing: 'right',
  camera: { x0: 215, y0: 339 },
  poses: { start, via, end },
  equipment: [
    { type: 'floor', from: -1.05, to: 0.80 },
    { type: 'bench', at: [0, BENCH_TOP, BENCH_Z], len: BENCH_LEN },
    lm => [{ type: 'barbell', at: barOf(lm), plateD: EZ_PLATE_D, plates: [0.045], part: 'plate', z: 'back' },
      { type: 'pulley', at: barOf(lm), r: 0.025, part: 'bar', z: 'front' }],
    (lm, ctx) => (ctx.pose === 'end' ? { type: 'line', cls: 'eq-cable m-line', pts: START_DOT, z: 'front', part: 'startbar' } : null),
  ],
  checks: [
    { landmark: 'backUpper', plane: { point: [0, BENCH_TOP, 0], normal: [0, 1, 0] }, pose: 'all', tol: 1 },   // upper back ON the pad
    { landmark: 'buttock', plane: { point: [0, BENCH_TOP, 0], normal: [0, 1, 0] }, pose: 'all', tol: 1 },     // buttocks ON the pad
    { landmark: 'head', above: { point: [0, BENCH_TOP, 0], normal: [0, 1, 0] }, pose: 'all' },               // head never inside it
    { landmark: 'sole.r', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },            // feet ON the floor (c1)
    { landmark: 'sole.l', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
  ],
  startParts: ['arm.r', 'arm.l'],
  ghosts: { count: 3, parts: ['arm.r', 'bar'] },
  trace: { point: 'grip.r', trim: [12, 12] },
  callouts: [
    { key: 'upper', text: 'Upper arms<br>vertical', anchor: 'elbow.r', cue: 'Keep your upper arms upright and move only your forearms.' },
    { key: 'forehead', text: 'Bar to<br>forehead', anchor: 'grip.r', cue: 'Lower the bar slowly to just above your forehead.' },
    { key: 'wrists', text: 'Wrists<br>neutral', anchor: 'wrist.r', cue: 'Keep your wrists straight, neither bent back nor curled.' },
  ],
  tempo: [{ phase: 'Lower', s: 2, move: true }, { phase: 'Extend', s: 1, move: true }],
  alt: 'Skull crusher, side view. Lying on a flat bench, head near its end, feet flat, the lifter holds an EZ bar on straight arms over the shoulders and bends only the elbows, upper arms upright, to lower the bar to just above the forehead, then straightens the arms.',
};
