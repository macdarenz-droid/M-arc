// Preacher curl (EZ bar, seated at a preacher bench), side view, figure faces screen right.
// View: SIDE (card plate.view = census view). The upper arms resting on the sloped pad, the elbow sweep from nearly
// straight to the shoulders, and the fault, the upper arms lifting off the pad as the body heaves the bar up (c5), are
// all sagittal.
// Form: research card docs/research/howto/cards/preacher_curl.json (research head 3812989f, LR-29 VALID), plate
//  section: start "Seated, feet flat (c2); chest and upper arms on the pad, pad top under the armpits (c1, c2); elbows
//  straight or nearly so, bar in an underhand grip (c1, c7); wrists straight (c8); chin tucked (c8)"; end "Elbows bent,
//  bar near the shoulders (c1 grip kept); backs of the upper arms still pressed into the pad (c4); torso still, not
//  hunched (c3, c9); wrists straight (c8)".
// Clone sources (D-LIB15-CLONE, copied never imported): machine_chest_press (main: the seat, the seated figure on
//  rootOnSeat, feet flat) and dumbbell_biceps_curl (pilot A #109 @ ff7c5c4f: the curl arm, the faulty-arm guides).
// Rig: the new `preacherPad` composer (eq/preacherPad.mjs; this plate is its anchor, D-LIB15-PREACHER) and the vendor
//  `seat`. The pad is built FROM the body: its arm face is the line along the back of the upper arm (the shoulder-to-
//  elbow line moved out by the arm's radius), its chest face the line along the front of the chest, and its top edge
//  where the two meet, under the armpit (c2). The upper arm never moves between start and end (same thorax, same
//  shoulder angle), so it lies on the face in both (c1, c4).
// EZ bar (D-LIB10-NOTE Q3): the vendor barbell seen end-on (its camber is frontal), PLATE_D its own drawn plate size
//  (not skull_crusher's EZ_PLATE_D), one plate per side.
// Geometry decisions:
//  - Seat SEAT_TOP high enough that, with the feet flat and the shins near vertical, the pad top sits under the
//    armpits (c2); trunk leaning TILT forward over the pad from the hips with a straight back (c9: not hanging), neck
//    NECK (chin tucked, c8).
//  - Upper arm SH_FLEX of shoulder flexion relative to the thorax: down the pad's slope. Elbow ELBOW_START at the bottom
//    (c7 "nearly straight"), ELBOW_END at the top (bar near the shoulders). Wrist 0 (c8).
// Unsourced numbers (13.3 must-fix 14): SEAT_TOP, FOOT_Z, TILT, NECK, SH_FLEX (the pad slope follows it), ELBOW_START,
//  ELBOW_END, the composer's sizes (eq/preacherPad.mjs header), PLATE_D 0.23 m (a drawn value), the bar (1.2 m,
//  drawn end-on), the Mistake's magnitudes (MIS_*; c5 gives none).
// Callouts, Mistake, tempo: the 3 checkpoints are the callouts (c2, c4, c8); the Mistake is the card's plate.mistake
//  (c5, drawable true), drawn against the end pose: the torso rocks back off the pad and the upper arms lift off its
//  face as the bar heaves up. Tempo: Curl 1 s, Lower 2 s (c14; pause 0, so no Hold; lb5/tempo.json); no Rest.
import { landmarksOf, rootOnSeat, RADII, bodyShapes, fk, resolve, normPose } from '../engine.mjs';
import { preacherPad, PREACHER_PAD_ITEMS } from '../eq/preacherPad.mjs';
import { perItem, sub, add, mul, norm } from '../eq/parts.mjs';

const H = 1.75;
const SEAT_TOP = 0.60;
const SEAT = [0, SEAT_TOP, 0];                         // buttock contact on the seat pad
const FOOT_Z = 0.36, FOOT_X = 0.11;                    // feet flat, hip width (c2)
const TILT = 14, NECK = 6;                             // trunk over the pad from the hips; chin tucked (c8)
const SH_FLEX = 58;                                    // upper arm down the pad's slope, relative to the thorax
const ELBOW_START = 12, ELBOW_END = 128;               // nearly straight (c7); bar near the shoulders (c1, c4)
const PLATE_D = 0.23;

const feet = { l: { at: [FOOT_X, 0, FOOT_Z] }, r: { at: [-FOOT_X, 0, FOOT_Z] } };
const base = { root: { at: rootOnSeat(SEAT, TILT, H), tilt: TILT }, trunk: 0, neck: NECK, scap: { elev: 0, pro: 1 }, wrist: 0, plant: feet, shoulder: { flex: SH_FLEX, rot: 0 } };
const start = { ...base, elbow: ELBOW_START };
const end = { ...base, elbow: ELBOW_END };

// The pad from the body (start pose: the upper arm and the thorax are the same in the end pose).
const lmS = landmarksOf(start, H);
const ARM_R = RADII.elbowCap * H;                      // the back of the upper arm at the elbow: joint centre + cap radius
const side = v => [0, v[1], v[2]];
const S = side(lmS['shoulder.r']), E = side(lmS['elbow.r']);
const FACE = norm(sub(E, S));                          // down the arm face
const FACE_N = norm([0, -FACE[2], FACE[1]]);           // from the arm toward the pad (below the upper arm)
const onFace = p => add(p, mul(FACE_N, ARM_R));        // a point on the arm's back surface
const CH = side(lmS.chest), ST = side(lmS.sternum);
const CHEST = norm(sub(CH, ST));                       // down the chest front
// top edge: where the arm face line meets the chest line (2D line intersection in the side plane)
const meet = (p, u, q, v) => { const d = u[1] * v[2] - u[2] * v[1], t = ((q[1] - p[1]) * v[2] - (q[2] - p[2]) * v[1]) / d; return add(p, mul(u, t)); };
const TOP = meet(onFace(S), FACE, ST, CHEST);
const BACK = norm(sub(CH, TOP));                       // the chest face: from the top edge through the chest (c1, c2)
const PAD = { top: TOP, face: FACE, back: BACK };

// Mistake (card plate.mistake, c5): "Upper arms lifting off the pad as the body heaves the bar up." c5 gives no size,
// so each part cites a basis (#290 6343211054 items 6, 7): the torso rocks back MIS_ROCK, the 8's lat_pulldown "lean and
// heave" (vendor lat_pulldown.mjs:46 end tilt -10 -> :71 Mistake tilt -28, an 18 deg swing back); the upper arm swings up
// until the elbow joint is MIS_GAP off the face, DESIGN.md section 11's planned 8-10 cm (its middle); the elbow keeps the
// end pose's angle. The shoulder flexion is solved for MIS_GAP (bisection; throws with no root).
const MIS_ROCK = 18, MIS_GAP = 0.09;
const misBody = { root: { at: rootOnSeat(SEAT, TILT - MIS_ROCK, H), tilt: TILT - MIS_ROCK } };
const faceGap = p => -((p[1] - onFace(S)[1]) * FACE_N[1] + (p[2] - onFace(S)[2]) * FACE_N[2]) - ARM_R;   // elbow joint off the face, less the arm radius
export const bisect = (f, lo, hi) => {
  if (!(f(lo) * f(hi) < 0)) throw new Error('preacher_curl: no solution in the bracket');
  for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if ((f(m) < 0) === (f(lo) < 0)) lo = m; else hi = m; }
  return (lo + hi) / 2;
};
const misLm = flex => landmarksOf({ ...end, ...misBody, shoulder: { flex, rot: 0 } }, H);
export const MIS_FLEX = bisect(flex => faceGap(misLm(flex)['elbow.r']) - MIS_GAP, SH_FLEX - MIS_ROCK, SH_FLEX + 90);
const mistakePose = { ...misBody, shoulder: { flex: MIS_FLEX, rot: 0 } };
// The faulty arm on top (#290 6343211054 item 5): dumbbell_biceps_curl's misArm (pilot A), dashed outlines, not masked.
const cr = (ps, k = 8) => {
  const n = ps.length, g = i => ps[(i + n) % n], out = [];
  for (let i = 0; i < n; i++) {
    const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2);
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    for (let j = 0; j < k; j++) { const t = j / k, u = 1 - t;
      out.push([0, 1].map(d => u * u * u * p1[d] + 3 * u * u * t * c1[d] + 3 * u * t * t * c2[d] + t * t * t * p2[d])); }
  }
  return out;
};
const MIS_ARM = (() => {
  const bd = { height: H }, probe = { view: 'side', near: 'r', pxm: 1000, P: w => [w[2] * 1000, -w[1] * 1000] };
  const keys = ['upper.r', 'elbowcap.r', 'fore.r', 'fist.r'];
  return bodyShapes(fk(resolve(normPose({ ...end, ...mistakePose }, bd), bd).q, bd), probe).filter(sh => keys.includes(sh.key))
    .map(sh => (sh.key.includes('cap') ? sh.poly : cr(sh.poly, sh.key.startsWith('fist') ? 4 : 8)).map(([x, y]) => [0, -y / 1000, x / 1000]));
})();
// The pad gap (machine_chest_press's pad-to-back gap mark): from the face under the faulty elbow to the arm's underside.
const E_M = side(misLm(MIS_FLEX)['elbow.r']);
const GAP_TO = add(E_M, mul(FACE_N, ARM_R)), GAP_FROM = add(GAP_TO, mul(FACE_N, MIS_GAP));
const TICK = 0.012, tick = p => [add(p, mul(FACE, -TICK)), add(p, mul(FACE, TICK))];
// Callout anchors (#290 6343211054 item 4): the visible armpit on the pad top, and the arm-pad contact by the elbow.
const ARMPIT = TOP, CONTACT = onFace(E);

export default {
  id: 'preacher_curl', name: 'Preacher Curl', view: 'side', facing: 'right',
  camera: { fit: true },
  poses: { start, end },
  equipment: [
    { type: 'floor', from: -0.45, to: 0.85 },
    { type: 'seat', at: [0, SEAT_TOP, -0.02], len: 0.40 },
    ...perItem(() => preacherPad(PAD), PREACHER_PAD_ITEMS),
    lm => ({ type: 'barbell', at: lm['grip.r'], plateD: PLATE_D, plates: [0.03], part: 'bar' }),
  ],
  checks: [
    { landmark: 'seat', plane: { point: SEAT, normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
    { landmark: 'heel.r', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
    { landmark: 'ball.r', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
    // the backs of the upper arms on the pad face (c1, c4): the elbow joint one cap radius off the face
    ...['start', 'end'].map(pose => ({ landmark: 'elbow.r', plane: { point: S, normal: FACE_N }, pose, tol: 0.5 })),
    { landmark: 'chest', plane: { point: TOP, normal: [0, -BACK[2], BACK[1]] }, pose: 'start', tol: 0.5 },   // the chest on the pad (c1, c2)
    // the fault (c5): the elbow lifted at least 6 cm off the face
    { landmark: 'elbow.r', above: { point: add(S, mul(FACE_N, -0.06)), normal: mul(FACE_N, -1) }, pose: 'mistake' },
  ],
  ghosts: { count: 3, parts: ['arm.r', 'bar'] },
  trace: { point: 'grip.r', trim: [10, 12] },
  measure: { vertex: 'elbow.r', from: 'shoulder.r', to: 'wrist.r', radius: 30, title: 'Elbow', value: 'bar to shoulders', box: { left: 58, top: 120 } },
  callouts: [
    { key: 'armpits', text: 'Armpits<br>over pad', anchor: ARMPIT, box: { left: 72, top: 172 }, cue: 'Sit with the pad top under your armpits and your chest on it.' },
    { key: 'arms', text: 'Arms on<br>pad', anchor: { at: CONTACT, off: [10, 0] }, box: { left: 266, top: 236 }, cue: 'Press the backs of your upper arms into the pad all the way up.' },
    { key: 'wrists', text: 'Straight<br>wrists', anchor: 'wrist.r', box: { left: 150, top: 70 }, cue: 'Keep the hands in line with the forearms.' },
  ],
  tempo: [{ phase: 'Curl', s: 1, move: true }, { phase: 'Lower', s: 2, move: true }],
  mistake: {
    pose: mistakePose,
    parts: ['torso', 'head', 'bar'],
    guides: [
      ...MIS_ARM.map(pts => ({ kind: 'dashed', pts: [...pts, pts[0]] })),   // the faulty arm, on top
      { kind: 'dashed', pts: [GAP_FROM, GAP_TO] }, { kind: 'dashed', pts: tick(GAP_FROM) }, { kind: 'dashed', pts: tick(GAP_TO) },   // the gap off the pad
    ],
    tells: [
      { key: 'lift', text: 'Arms off<br>pad', anchor: { at: 'elbow.r', pose: 'mistake' }, box: { left: 232, top: 102 }, cue: 'Your upper arms lift off the pad as you heave the bar.' },
      { key: 'heave', text: 'Torso<br>heaves back', anchor: { at: 'backUpper', pose: 'mistake' }, box: { left: 28, top: 142 }, cue: 'Your torso rocks back off the pad to swing the bar up.' },
    ],
  },
  alt: 'Preacher curl, side view. Seated at a preacher bench with the chest against the pad and the backs of the upper arms on its sloped face, the lifter curls an EZ bar from nearly straight arms up toward the shoulders while the upper arms stay on the pad.',
};
