// Inverted row (bar in a rack at about waist height, overhand grip, heels on the floor), side view, facing right. LB1,
// mode H (own parent), supine pose class.
// View: side (card plate.view): the straight body line, the chest-to-bar height and the sagging-hip fault are all
// sagittal (c3).
// Source: docs/research/howto/cards/inverted_row.json (claude/libht-research). Claims used: c1 (bar in a rack at about
// waist height, hang under it with straight arms, heels on the floor), c2 (overhand grip a little wider than the
// shoulders), c3 (body rigid and straight from head to heels; blades back and down), c4 (pull until the chest touches
// the bar), c5/c6 (lower with control; tempo convention 1-1-2), c3 again for the Mistake (hips sag: the straight line
// breaks).
// Clone sources (D-LIB9-CLONE): census closest seated_cable_row (golden A) for the row arm and grip IK; supine anchor
// dumbbell_bench_press (pilot A, e6f39ff): its bisect is COPIED here (never imported) and throws when its bracket holds
// no root (D-LIB9-CLONE b). The anchor's supine() puts a lying body on a pad; here the body is a rigid plank pivoting on
// its heels, so the same bisect solves the plank angle instead (D-LIB9-CLONE c: every bracket below is re-derived).
// Geometry decisions:
//  - Bar 1.00 m up (32 mm, end-on, in a J-hook on a rack upright behind it): about waist height for a 1.75 m body (c1).
//  - Body straight from shoulders to heels (pelvis tilt sets the plank angle; trunk 0, hip 0, knee 0), heels on the
//    floor, ankles neutral so the toes point up. Neck tucked 6 deg so the head stays in line (c3).
//  - End (card end, c4), solved first: TILT_END is the plank angle whose chest landmark sits one bar radius under the
//    bar's centre with the heels placed so the chest is straight under the bar: tilt -48.9 (body 41 deg above the
//    floor), heels 0.87 m in front of the bar. Blades back and down (scap pro -4, elev -1, c3); elbow 123 deg.
//  - Start (card start, c1): the plank rotates about the same heels until the arm is straight (TILT_START: shoulder
//    joint one straight-arm length, elbow 5 deg, from the grip): tilt -69.8 (body 20 deg above the floor), elbow 8 deg.
//  - Mistake (card plate.mistake, c3): hips sag at the top. The hips flex 30 deg (the body folds, hips toward the
//    floor); the heels stay put and the plank angle is re-solved (SAG_TILT -28.3) so the shoulder joint keeps the end
//    pose's height; the grips stay on the bar.
//  - Rack upright 1.18 m, 10 cm behind the bar, drawn behind the body, with a J-hook (back plate 10 cm above the bar,
//    cup and lip) whose back plate shows above the end fist (13.3 fix 5).
//  - Labels: 'Blades back' and 'Hips sagging' point at the back and the buttock, which face the floor. Their open
//    side is closed in by the start pose and the ghosts below the body, so those leaders cross the lighter ghost lines
//    (never the trace).
//  - Grips +-26 cm: 52 cm apart, a little wider than the 45 cm shoulder-joint width (c2).
// CARD: GX (c2, a little wider than the shoulders), BAR height (c1, "about waist height"), chest to the bar at the end
//  (c4), heels on the floor (c1, c3), tempo (c5/c6). Unsourced numbers: BAR 1.00 m (card: "about waist height"),
//  GX 0.26 m (card: "a little wider"), SAG 30 deg (illustrative fault size; card gives none), start arms straight but
//  not exactly vertical (the heels are placed for the chest-at-bar end), elbow 5 deg for "straight" (STRAIGHT), NECK
//  -6, scap pro -3/-4 and elev -1 (card: "back and down", no size), RACK_Z 10 cm behind the bar, upright 1.18 m, the
//  J-hook sizes (HOOK), ghost count 2, tell text 'Hips sagging' (the 44 px hit box; card: "hips sagging").
import { landmarksOf, WINTER, REF } from '../engine.mjs';

const H = 1.75;
const BAR = [0, 1.00, 0];
const BAR_R = 0.016;
const GX = 0.26;
const SCAP = { elev: -1, pro: -3 };
const NECK = -6;
const ANKLE = 0;
const SAG = 30;                                     // Mistake hip flexion (deg)

// Bisect copied from the supine anchor (dumbbell_bench_press @ e6f39ff), with the bracket check D-LIB9-CLONE (b) asks
// for: f must change sign between lo and hi, or there is no root and the plate must not be drawn.
export const bisect = (f, lo, hi) => {
  const flo = f(lo), fhi = f(hi);
  if (!(flo <= 0 && fhi >= 0) && !(flo >= 0 && fhi <= 0)) throw new Error(`inverted_row: no root in [${lo}, ${hi}] (f ${flo.toFixed(4)}, ${fhi.toFixed(4)})`);
  const up = fhi > flo;
  for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if ((f(m) > 0) === up) hi = m; else lo = m; }
  return (lo + hi) / 2;
};

// A straight plank at pelvis tilt `tilt` (-90 = lying flat, head toward -z), hips flexed `hip`, heel.r on `heel`.
const HEEL = [0, 0, 0];   // a reference heel; heelFor() places the real one
const plank = (tilt, heel, hip = 0) => {
  const p = { root: { at: [0, 0, 0], tilt }, trunk: 0, neck: NECK, hip, knee: 0, ankle: ANKLE, scap: SCAP };
  const h0 = landmarksOf(p, H)['heel.r'];
  return { ...p, root: { at: [0, heel[1] - h0[1], heel[2] - h0[2]], tilt } };
};
const lmOf = p => landmarksOf(p, H);

// End first (card end, c4): the chest touches the bar. For a plank angle t, the heel z that puts the chest landmark
// under the bar's centre line; then the angle whose chest sits one bar radius under the bar. Bracket (re-derived, f in
// m): tilt -85 (nearly flat, chest 0.70 m under the bar, f -0.70) to -20 (steep, chest 0.30 m over it, f +0.30).
const chestAt = (t, heel) => lmOf(plank(t, heel)).chest;
const heelFor = t => [0, 0, BAR[2] - chestAt(t, HEEL)[2]];
export const TILT_END = bisect(t => chestAt(t, heelFor(t))[1] - (BAR[1] - BAR_R), -85, -20);
const HEEL_S = heelFor(TILT_END);
// Start (card start, c1): rotate about the same heels until the arm is straight (shoulder joint one straight-arm
// length, elbow 5 deg, from the grip). Bracket (re-derived): from the end angle (shoulder 0.48 m short of a straight
// arm, f -0.48) to -89 (nearly flat, 0.43 m beyond it, f +0.43).
const STRAIGHT = Math.sqrt(WINTER.upperArm ** 2 + (WINTER.forearm + REF.gripOff) ** 2 + 2 * WINTER.upperArm * (WINTER.forearm + REF.gripOff) * Math.cos(5 * Math.PI / 180)) * H;
const shToGrip = t => { const s = lmOf(plank(t, HEEL_S))['shoulder.r']; return Math.hypot(s[1] - BAR[1], s[2] - BAR[2], s[0] + GX); };
export const TILT_START = bisect(t => shToGrip(t) - STRAIGHT, TILT_END, -89);

const grip = pole => ({ l: { at: [GX, BAR[1], BAR[2]], pole: [pole[0], pole[1], pole[2]] },
  r: { at: [-GX, BAR[1], BAR[2]], pole: [-pole[0], pole[1], pole[2]] } });
const start = { ...plank(TILT_START, HEEL_S), reach: grip([0.3, -0.2, -1]) };
const end = { ...plank(TILT_END, HEEL_S), scap: { elev: -1, pro: -4 }, reach: grip([0.35, -1, -0.6]) };

// Mistake: hips flexed SAG with the heels fixed; the tilt is re-solved so the shoulder joint stays at the end pose's
// height (the arms still reach the bar; reach IK re-solves the elbow). Bracket (re-derived): from the end tilt (hips
// flexed, shoulder 0.41 m lower than the end's, f -0.41) to the end tilt plus 40 (shoulder 0.29 m higher, f +0.29).
const shY0 = p => lmOf(p)['shoulder.r'][1];
const SH_END = shY0(end);
export const SAG_TILT = bisect(t => shY0(plank(t, HEEL_S, SAG)) - SH_END, TILT_END, TILT_END + 40);
const misBody = { ...plank(SAG_TILT, HEEL_S, SAG), scap: { elev: -1, pro: -4 }, reach: grip([0.35, -1, -0.6]) };
export const GEOM = { HEEL_S, BAR, BAR_R, STRAIGHT };

const RACK_Z = BAR[2] - 0.10;
// J-hook on the upright's near face (13.3 fix 5): a back plate that slides on the upright and stands 10 cm above the
// bar, and a cup under the bar (its front lip is left off: hidden by the fist, it only crowded the 'Chest to bar'
// leader). The end fist covers the cup, so the back plate's top shows above
// the bar and the bar reads as held by the hook, not floating. World [y, z] outline, exported for the test.
const FACE = RACK_Z + 0.038;
export const HOOK = [[0.95, FACE], [1.10, FACE], [1.10, FACE + 0.025], [0.975, FACE + 0.025], [0.975, BAR[2]],
  [0.95, BAR[2]]].map(([y, z]) => [0, y, z]);
export default {
  id: 'inverted_row', name: 'Inverted Row', view: 'side', facing: 'right',
  camera: { fit: true },
  poses: { start, end },
  equipment: [
    { type: 'floor', from: -0.45, to: HEEL_S[2] + 0.25 },
    { type: 'rackUpright', at: [0, 0, RACK_Z], h: 1.18 },
    { type: 'poly', cls: 'eq', z: 'back', pts: HOOK },
    { type: 'pullupBar', at: BAR, mount: 'ceiling', stub: 0.0001 },
  ],
  checks: [
    { landmark: 'heel.r', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },          // heels ON the floor (c3)
    { landmark: 'chest', above: { point: [0, BAR[1] - BAR_R + 0.005, 0], normal: [0, -1, 0] }, pose: 'end' },   // chest at, not through, the bar
  ],
  ghosts: { count: 2, parts: ['trunk', 'arm.r'] },
  trace: { point: 'chest', trim: [10, 10] },
  callouts: [
    { key: 'line', text: 'Body<br>straight', anchor: 'thighTop.r', box: { left: 250, top: 196 }, cue: 'Keep a rigid straight line from head to heels, top and bottom.' },
    { key: 'chest', text: 'Chest<br>to bar', anchor: 'chest', box: { left: 175, top: 172 }, cue: 'Pull until the chest touches the bar.' },
    { key: 'blades', text: 'Blades<br>back', anchor: 'backUpper', box: { left: 6, top: 172 }, cue: 'Squeeze the shoulder blades back together and down at the top.' },
  ],
  tempo: [{ phase: 'Pull', s: 1, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Lower', s: 2, move: true }],
  mistake: {
    pose: misBody,
    parts: ['torso', 'leg.r'],
    guides: [
      // the hips drop toward the floor
      { kind: 'arrow', from: { at: 'buttock', pose: 'end', off: [14, 0] }, to: { at: 'buttock', pose: 'mistake', off: [14, 0] } },
    ],
    tells: [
      { key: 'sag', text: 'Hips<br>sagging', anchor: { at: 'buttock', pose: 'mistake' }, box: { left: 50, top: 284 }, cue: 'The hips drop toward the floor and the body folds.' },
    ],
  },
  alt: 'Inverted row, side view. Hanging face up under a bar set at about waist height, heels on the floor and the body straight from head to heels, the lifter pulls the chest to the bar, then lowers to straight arms.',
};
