// Bodyweight lunge, side view, figure facing screen right. LIB-SPLIT (LB4, mode H: D-SPLIT-MODES).
// View: side (card plate.view = census view). The forward step, the hip drop (c3), the thigh depth and shin lean (c4)
//  and the flat back (c5) are sagittal; the sideways tilt (c2) needs a front view and is not drawn.
// Clone source: the pinned reverse_lunge (specs/reverse_lunge.mjs, PILOT-A3 PIN GO @ 2edabdf0), copied, never imported
//  (D-LIB9-CLONE). Copied unchanged: the body sizes, FRONT_THIGH, REAR_KNEE_Y, REAR_HEEL, ELBOW, the rear-foot toe-pad
//  lift (REAR_LIFT, solved value 0.0360 m), the end pose built from the front foot outward, the arms (flexion = lean
//  keeps them plumb) and the camera. reverse_lunge has no root finder; nothing here is bracketed. No load (card
//  plate.equipment "Floor line only; no weights"), so no dumbbell entries.
// What differs from reverse_lunge (D-SPLIT-FWD): the step goes forward, as forward_lunge's (this lane): the start stands
//  on the rear foot's spot (START_Z), feet together (c1: the near foot beside the rear one, mid-soles FOOT_X apart, the root centred over them), the near (r) leg steps forward and lands heel first
//  (c2), via 1 = the near foot in the air halfway, via 2 = the near foot down, the rear heel up, hips halfway down. The
//  end: the front shin FRONT_SHIN forward of vertical ("leaning slightly forward", c4), the front thigh about parallel
//  (c4), the trunk bent forward TRUNK_LEAN at the hips with a flat back (c5: pelvis tilt, trunk flex 0).
// Form (research card bodyweight_lunge, claims): c1 start standing with the feet together, trunk braced; c2 step
//  forward landing heel first, weight onto it slowly; c3 drop the hips toward the floor rather than driving them
//  forward; c4 lower until the front thigh is parallel, the front shin leaning slightly forward; c5 bend forward at the
//  hips with a flat back; c6 push back up with the front leg.
// Plate text (card plate): callouts = plate.checkpoints (c3 Hips drop down, c4 Thigh parallel, c5 Flat back);
//  Mistake = plate.mistake (c3, drawable): the hips and front knee drive forward on landing and the front shin tips far
//  forward over the foot. Tells: the knee (first, the topFault key) and the hips.
// Mistake size: as forward_lunge's (this lane): the front shin at M_SHIN, the angle at which the front knee joint centre
//  passes over the front toe tip (c9's "the knee ahead of the toes" read onto "tips far forward over the foot"), the
//  front foot flat and the hips held at the end height; picked from the words before measuring, never enlarged
//  (Q-D5-3).
// Arms: the card gives none (unsourced); they hang plumb at the sides, as the parent's, with no load.
// Tempo: the strip without seconds, exactly tempoOf(strip/rows.json bodyweight_lunge) (D-STRIP-ROWS).
// Unsourced numbers: FOOT_X (the parent's hip width in the split; at the start the near foot stands beside the rear
//  one, which pivots in place), FRONT_SHIN 12 ("slightly forward"), TRUNK_LEAN 20 (the forward bend at the hips), as reverse_lunge's
//  (FRONT_THIGH, REAR_KNEE_Y, REAR_HEEL, ELBOW), the via poses (swing foot 8 cm up; hips), M_SHIN (solved).
import { landmarksOf } from '../engine.mjs';

const H = 1.75, R = Math.PI / 180;
const L_TH = 0.245 * H, L_SH = 0.246 * H, ANK = 0.039 * H, MID = 0.044 * H, BALL = 0.080 * H;
const FOOT_X = 0.10;              // mid-sole lateral offset in the split (the parent's)
const FRONT_SHIN = 12;            // front shin, deg forward of vertical (c4 "leaning slightly forward")
const FRONT_THIGH = 0;            // front thigh, deg above horizontal (0 = parallel, c4)
const REAR_KNEE_Y = 0.085;        // rear knee joint centre height (m), the parent's: the card gives no back-knee depth
const REAR_HEEL = 45;             // rear foot heel-up angle (deg)
const TRUNK_LEAN = 20;            // trunk bent forward at the hips at the bottom, flat back (c5; deg from vertical)
const STAND_LEAN = 0;
const ELBOW = 4;

const sT = Math.sin(REAR_HEEL * R), cT = Math.cos(REAR_HEEL * R);
const REAR_LIFT = -Math.min(...[[0.112, -0.036], [0.120, -0.028], [0.100, -0.038]].map(([z, y]) => ((z - 0.080) * -sT + (y + 0.039) * cT) * H));
const REAR_N = [0, cT, sT], REAR_T = [0, -sT, cT];

// End pose, built from the front foot outward (reverse_lunge's).
const ankF = [0, ANK, -MID];
const kneeAt = shin => [0, ankF[1] + L_SH * Math.cos(shin * R), ankF[2] + L_SH * Math.sin(shin * R)];
const kneeF = kneeAt(FRONT_SHIN);
const HIP = [0, kneeF[1] + L_TH * Math.sin(FRONT_THIGH * R), kneeF[2] - L_TH * Math.cos(FRONT_THIGH * R)];
const kneeB = [0, REAR_KNEE_Y, HIP[2] - Math.sqrt(L_TH ** 2 - (HIP[1] - REAR_KNEE_Y) ** 2)];
const ankBy = REAR_LIFT + ANK * cT + BALL * sT;
const ankB = [0, ankBy, kneeB[2] - Math.sqrt(L_SH ** 2 - (ankBy - REAR_KNEE_Y) ** 2)];
const REAR_BALL = [FOOT_X, REAR_LIFT, ankB[2] - ANK * sT + BALL * cT];
// Start on the rear foot's spot: a flat foot's ball is BALL - MID ahead of its mid-foot.
const START_Z = REAR_BALL[2] - (BALL - MID);

const front = { at: [-FOOT_X, 0, 0] };
const arms = lean => ({ shoulder: { flex: lean }, elbow: ELBOW });
const pose = (hip, lean, r, l) => ({ root: { at: [0, ...hip.slice(1)], tilt: lean }, trunk: { flex: 0 }, neck: 0, ...arms(lean), plant: { r, l } });
const REAR = { at: REAR_BALL, normal: REAR_N, toe: REAR_T, ref: 'ball' };

// Start: standing tall on the rear foot's spot, feet hip width, hip-joint centre 3 cm in front of the ankles.
const start = { ...pose([0, 0.925, START_Z - MID + 0.03], STAND_LEAN, { at: [0, 0, START_Z] }, { at: [FOOT_X, 0, START_Z] }), root: { at: [FOOT_X / 2, 0.925, START_Z - MID + 0.03], tilt: STAND_LEAN } };
// The step (c2: the stepping foot lands heel first, the weight moves onto it slowly): via 1 = the near foot 8 cm up and
// halfway forward, toes up for a heel landing, the body still over the flat rear foot; via 2 = the near foot down at
// its spot, the rear heel up on the ball, the hips halfway down.
const via = [
  pose([0, 0.89, START_Z + 0.06], 1, { at: [-FOOT_X / 2, 0.08, START_Z / 2], normal: [0, Math.cos(15 * R), -Math.sin(15 * R)] }, { at: [FOOT_X, 0, START_Z] }),
  pose([0, 0.70, (HIP[2] + START_Z) / 2 + 0.12], TRUNK_LEAN, front, REAR),
];
const end = pose(HIP, TRUNK_LEAN, front, REAR);
// Mistake size (header): the front shin angle that puts the knee joint centre over the front toe tip, solved from the
// drawn end pose (toe.r is the toe tip landmark; the foot does not move). Solved value 29.2 deg.
const M_SHIN = Math.asin((landmarksOf(end, H)['toe.r'][2] - ankF[2]) / L_SH) / R;
// Mistake (c3; as forward_lunge's): on landing the hips and the front knee drive forward instead of the hips dropping; the front shin tips
// to M_SHIN with the foot flat, the hips held at the end height (thigh length kept). Arms, trunk lean and the rear
// foot are the end pose's.
const kneeM = kneeAt(M_SHIN);
const HIP_M = [0, HIP[1], kneeM[2] - Math.sqrt(L_TH ** 2 - (kneeM[1] - HIP[1]) ** 2)];
const MISTAKE = pose(HIP_M, TRUNK_LEAN, front, REAR);
/** The unsourced sizes (pilot-a2/sizes.json form). */
export const SIZES = { FOOT_X, FRONT_SHIN, FRONT_THIGH, REAR_KNEE_Y, REAR_HEEL, TRUNK_LEAN, ELBOW, M_SHIN, START_Z };
export const bwlInfo = { REAR_BALL, START_Z, HIP, HIP_M, kneeF, kneeM };
// Hips drop (c3): a plumb from the hips to the floor under them. Thigh parallel (c4): a level line through the front
// knee joint centre, back to the hip.
const THIGH_LEVEL = [[0, kneeF[1], kneeF[2] + 0.08], [0, kneeF[1], HIP[2] - 0.08]];
const HIP_PLUMB = ['hips', [0, 0, HIP[2]]];
const FLOOR = { point: [0, 0, 0], normal: [0, 1, 0] };

export default {
  id: 'bodyweight_lunge', name: 'Bodyweight Lunge', view: 'side', facing: 'right',
  camera: { x0: 248, y0: 339 },
  poses: { start, via, end },
  equipment: [
    { type: 'floor', from: -1.3, to: 0.4 },
  ],
  checks: [
    { landmark: 'heel.r', plane: FLOOR, pose: 'all', tol: 0.5 },                        // front foot flat
    { landmark: 'ball.r', plane: FLOOR, pose: 'all', tol: 0.5 },
    { landmark: 'heel.l', plane: FLOOR, pose: 'start', tol: 0.5 },                      // feet together at the start
    { landmark: 'ball.l', plane: FLOOR, pose: 'start', tol: 0.5 },
    { landmark: 'toe.l', plane: FLOOR, pose: 'end', tol: 1 },                           // rear forefoot on the floor
    { landmark: 'knee.l', above: { point: [0, 0.049 + 0.02, 0], normal: [0, 1, 0] }, pose: 'end' },   // rear knee clear (cap + 2 cm)
  ],
  ghosts: { count: 2, parts: ['leg.r', 'leg.l', 'trunk', 'arm.r'] },
  trace: { point: 'hip.r', trim: [10, 12] },
  callouts: [
    { key: 'hips', text: 'Hips drop<br>down', anchor: 'buttock', guide: HIP_PLUMB, cue: 'Drop the hips toward the floor rather than driving them forward.' },
    { key: 'thigh', text: 'Thigh parallel', anchor: { along: ['hip.r', 'knee.r'], t: 0.6 }, guide: THIGH_LEVEL, cue: 'Lower until the front thigh is about parallel, or to a comfortable depth.' },
    { key: 'back', text: 'Flat back', anchor: 'backUpper', cue: 'Bend forward at the hips with a flat back.' },
  ],
  mistake: {
    pose: MISTAKE,
    tells: [
      { key: 'knee', text: 'Knee drives<br>forward', anchor: { at: 'knee.r', pose: 'mistake' }, cue: 'The front knee drives forward and the shin tips far over the foot.' },   // c3
      { key: 'hips', text: 'Hips push<br>forward', anchor: { at: 'buttock', pose: 'mistake' }, cue: 'The hips drive forward instead of dropping.' },   // c3
    ],
  },
  tempo: [{ phase: 'Step', move: true, word: 'Slow' }, { phase: 'Lower', move: true }, { phase: 'Rise', move: true }],
  alt: 'Bodyweight lunge, side view. From standing with the feet together, one leg steps forward and lands heel first; the body lowers until the front thigh is about parallel, front shin leaning slightly forward, trunk bent forward at the hips with a flat back.',
};
