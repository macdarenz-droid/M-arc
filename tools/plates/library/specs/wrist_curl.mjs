// Wrist curl (seated, one dumbbell per hand, forearms on the thighs, palms up), side view, figure faces screen right.
// View: SIDE (card plate.view = census view). The forearm resting on the thigh, the hand past the knee and the wrist
// curling the dumbbell up are sagittal, and so is the drawn fault, the arms extending or the body leaning (c3).
// Form: research card docs/research/howto/cards/wrist_curl.json (research head 3812989f, LR-29 VALID), plate section:
//  start "Seated, forearm resting on the thigh (c1) with the hand hanging freely past the knee (c2); palm up, closed
//  grip, wrist neutral (c1, c2, c5)"; end "Wrist curled up toward the forearm, grip still closed (c4, c5); forearm still
//  on the thigh, arms not extending, torso not leaning (c1, c3)".
// Clone source (D-LIB15-CLONE, copied never imported): dumbbell_biceps_curl (pilot A #109 @ ff7c5c4f: the dumbbell end-on
//  in the side view, the dashed faulty-arm guides); the seated figure on rootOnSeat as machine_chest_press (main).
// Scale (D-LIB15-WRIST): drawn at the reference scale first (`fit` capped at 146.29 px/m, no maxScale). The wrist is the
//  only moving joint, so PQ-H3's Trace is measured on this card-true pose; a zoom is the supervisor's ruling only.
// Geometry decisions:
//  - Seated on a flat bench (bench top SEAT_TOP), feet flat, hip width, shins near vertical; the trunk hinged forward
//    TILT from the hips with a straight back so the forearms reach the thighs.
//  - Forearm on the thigh (c1): the forearm axis runs parallel to the near thigh's top line, one distal forearm radius
//    above it, the wrist WRIST_PAST beyond the knee so the hand hangs free past it (c2). The elbow sits on the same
//    line one forearm length back; the shoulder angles follow from the IK on that elbow (solved once, then used as
//    fixed angles in both poses, so the forearm never moves, c3).
//  - Palm up (c1): the engine's supinated hand (dumbbell_biceps_curl's), so the handle runs across the body and the
//    dumbbell shows end-on. Wrist WRIST_START = 0 (neutral, c2) and WRIST_END flexed (curled up toward the forearm, c4).
// Unsourced numbers (13.3 must-fix 14): SEAT_TOP (45 cm, a flat bench), FOOT_Z, TILT, WRIST_PAST, WRIST_END (the card
//  gives no wrist angle), the dumbbell (vendor default), the bench length and its place, the Mistake's magnitudes (MIS_*).
// Callouts, Mistake, tempo: the 3 checkpoints are the callouts (c1, c1/c2, c5); the Mistake is the card's plate.mistake
//  (c3, drawable false: the top fault, the weight rolling to the fingertips (c5), needs open fingers, which the engine's
//  fist does not draw): the trunk leans further forward and the arm straightens, lifting the forearm off the thigh, drawn
//  against the end pose. Tempo: Curl 2 s, Lower 2 s (c10; pause 0, so no Hold; lb5/tempo.json); no Rest.
import { WINTER, REF, RADII, landmarksOf, resolve, normPose, rootOnSeat } from '../engine.mjs';
import { add, mul, norm, sub } from '../eq/parts.mjs';

const H = 1.75;
const SEAT_TOP = 0.45;
const SEAT = [0, SEAT_TOP, -0.02];                     // buttock contact on the bench
const FOOT_X = 0.11, FOOT_Z = 0.44;
const TILT = 32;                                       // trunk hinged forward from the hips, back straight
const WRIST_START = 0, WRIST_END = 70;                 // neutral (c2); curled up toward the forearm (c4)

const feet = { l: { at: [FOOT_X, 0, FOOT_Z] }, r: { at: [-FOOT_X, 0, FOOT_Z] } };
const body = { root: { at: rootOnSeat(SEAT, TILT, H), tilt: TILT }, trunk: 0, neck: -18, scap: { elev: 0, pro: 2 }, plant: feet };
const lmB = landmarksOf({ ...body, shoulder: { flex: 0 } }, H);
const side = v => [0, v[1], v[2]];
// the near thigh's top line (side plane): through thighTop.r, along the thigh (hip -> knee)
const THIGH_U = norm(sub(side(lmB['knee.r']), side(lmB['hip.r'])));
const THIGH_N = norm([0, THIGH_U[2], -THIGH_U[1]]);    // up, away from the thigh
const TOP_PT = side(lmB['thighTop.r']);
const FORE_R = RADII.fore[2] * H, LF = WINTER.forearm * H, GRIP = REF.gripOff * H;
// the forearm axis: parallel to the thigh top, FORE_R above it; the wrist WRIST_PAST past the knee's front
const kneeFront = add(side(lmB['knee.r']), mul(THIGH_U, RADII.kneeCap * H));
const along = p => (p[1] - TOP_PT[1]) * THIGH_U[1] + (p[2] - TOP_PT[2]) * THIGH_U[2];
const axisAt = s => add(add(TOP_PT, mul(THIGH_U, s)), mul(THIGH_N, FORE_R));
// the elbow on the axis one upper-arm length from the shoulder joint, forward of the shoulder's foot on the axis
// (bisection between that foot, inside the reach, and one arm length on, outside it; throws on no root)
const S0 = side(lmB['shoulder.r']), L1 = WINTER.upperArm * H, gap = s => Math.hypot(...sub(axisAt(s), S0)) - L1;
const S_EL = (() => {
  let lo = along(S0), hi = along(S0) + L1;
  if (!(gap(lo) < 0 && gap(hi) > 0)) throw new Error('wrist_curl: the shoulder cannot reach the thigh line');
  for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (gap(m) < 0) lo = m; else hi = m; }
  return (lo + hi) / 2;
})();
export const WRIST_PAST = S_EL + LF - along(kneeFront);   // solved: the wrist past the knee's front (the hand hangs free, c2)
const W = axisAt(S_EL + LF);
const G0 = add(W, mul(THIGH_U, GRIP));                 // grip with the wrist neutral
const X_R = lmB['shoulder.r'][0];                      // the arm in the shoulder's sagittal plane
const reach = { r: { at: [X_R, G0[1], G0[2]], pole: [0, -0.3, -1] }, l: { at: [-X_R, G0[1], G0[2]], pole: [0, -0.3, -1] } };
const solved = resolve(normPose({ ...body, wrist: 0, reach }, { height: H }), { height: H }).q;
const arm = { shoulder: { l: solved.sh.l, r: solved.sh.r }, elbow: { l: solved.elbow.l, r: solved.elbow.r } };
const start = { ...body, ...arm, wrist: WRIST_START };
const end = { ...body, ...arm, wrist: WRIST_END };

// Mistake (card plate.mistake, c3): "Arms extending or body leaning forward to move the weight." The trunk leans MIS_LEAN
// further forward from the hips, the upper arm swings MIS_SWING forward and the elbow opens MIS_EXT, so the arm
// straightens and heaves the forearm and the dumbbell up off the thigh (the wrist kept curled). The card gives no angle:
// drawn large enough to read at 390 px.
const MIS_LEAN = 8, MIS_SWING = 50, MIS_EXT = 30;
const swung = s => ({ ...solved.sh[s], elev: solved.sh[s].elev + MIS_SWING });
const mistakePose = { root: { at: rootOnSeat(SEAT, TILT + MIS_LEAN, H), tilt: TILT + MIS_LEAN },
  shoulder: { l: swung('l'), r: swung('r') }, elbow: { l: solved.elbow.l - MIS_EXT, r: solved.elbow.r - MIS_EXT } };

export default {
  id: 'wrist_curl', name: 'Wrist Curl', view: 'side', facing: 'right',
  camera: { fit: true },
  poses: { start, end },
  equipment: [
    { type: 'floor', from: -0.75, to: 0.75 },
    { type: 'bench', at: [0, SEAT_TOP, -0.40], len: 1.0 },
    lm => ({ type: 'dumbbell', at: lm['grip.r'], part: 'hand.r' }),
  ],
  checks: [
    { landmark: 'seat', plane: { point: SEAT, normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
    { landmark: 'heel.r', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
    { landmark: 'ball.r', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
    // the forearm on the thigh (c1): wrist and elbow on the forearm axis, FORE_R above the thigh's top line
    ...['start', 'end'].flatMap(pose => [
      { landmark: 'wrist.r', plane: { point: axisAt(0), normal: THIGH_N }, pose, tol: 0.5 },
      { landmark: 'elbow.r', plane: { point: axisAt(0), normal: THIGH_N }, pose, tol: 0.5 },
    ]),
    // the fault (c3): the wrist lifted at least 5 cm off the thigh
    { landmark: 'wrist.r', above: { point: add(axisAt(0), mul(THIGH_N, 0.05)), normal: THIGH_N }, pose: 'mistake' },
  ],
  ghosts: { count: 3, parts: ['hand.r'] },
  trace: { point: 'grip.r', trim: [4, 6], samples: 20 },
  zoom: { view: 'normal', k: 3 },   // D-LIB15R2-ZOOM, -WRISTBOX (lib4-cards §48): the grip's path, 34.97 px at k 3 (bar 22.11), the smallest k that passes every check
  measure: { vertex: 'wrist.r', from: { at: 'grip.r', pose: 'start' }, to: 'grip.r', radius: 16, title: 'Wrist', value: 'curl up' },
  callouts: [
    { key: 'forearm', text: 'Forearm<br>supported', anchor: { at: 'elbow.r', off: [6, 0] }, box: { left: 112, top: 200 }, cue: 'Rest the forearm on your thigh. Only the hand moves.' },
    { key: 'palms', text: 'Palms up', anchor: 'wrist.r', box: { left: 262, top: 150 }, cue: 'Hold the dumbbell underhand with the hand past the knee.' },
    { key: 'grip', text: 'Grip stays<br>closed', anchor: 'grip.r', box: { left: 272, top: 280 }, cue: 'Squeeze the handle both ways. Never let it roll to the fingers.' },
  ],
  tempo: [{ phase: 'Curl', s: 2, move: true }, { phase: 'Lower', s: 2, move: true }],
  mistake: {
    pose: mistakePose,
    parts: ['torso', 'head', 'arm.r', 'hand.r'],
    guides: [
      { kind: 'arrow', from: { at: 'wrist.r', pose: 'end', off: [14, 6] }, to: { at: 'wrist.r', pose: 'mistake', off: [14, 6] } },   // the forearm lifts off the thigh
    ],
    tells: [
      { key: 'lean', text: 'Body<br>leans in', anchor: { at: 'backUpper', pose: 'mistake' }, cue: 'Your body leans forward to help move the weight.' },
      { key: 'arm', text: 'Arm<br>straightens', anchor: { at: 'elbow.r', pose: 'mistake' }, cue: 'Your arm straightens and the forearm lifts off the thigh.' },
    ],
  },
  pilot: { drawableFault: 'top fault: the weight rolling to the fingertips (c5) needs open fingers; drawn: the next fault, leaning or straightening the arms (c3)' },
  alt: 'Wrist curl, side view. Seated on a bench and leaning forward, the forearm rests on the thigh with the hand past the knee, palm up. Only the wrist moves, curling the dumbbell up toward the forearm.',
};
