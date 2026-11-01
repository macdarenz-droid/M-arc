// Walking lunge with dumbbells, side view, figure facing screen right. LIB-SPLIT (LB4, mode H: D-SPLIT-MODES).
// View: side (card plate.view = census view). One forward step (card plate.viewWhy: "the plate shows one step"); the
//  shin angle (c2), the hip drop (c3) and the upright trunk (c7, c9) are sagittal.
// Clone source: the pinned reverse_lunge (specs/reverse_lunge.mjs, PILOT-A3 PIN GO @ 2edabdf0), copied, never imported
//  (D-LIB9-CLONE). Copied unchanged: the body sizes, FOOT_X, FRONT_SHIN, REAR_HEEL, TRUNK_LEAN, ELBOW, the rear-foot
//  toe-pad lift (REAR_LIFT, solved value 0.0360 m), the end pose built from the front foot outward, the arms (flexion
//  = lean keeps them plumb), the two dumbbell entries, the shin plumb guide and the camera. The root finder is step_up's
//  bracketed Illinois solve (LB4, copied), which throws on a bracket with no root; its bracket and solved value are
//  recorded at the call.
// What differs from reverse_lunge (D-SPLIT-FWD): the step goes forward, as forward_lunge's (this lane): the start stands
//  on the rear foot's spot (START_Z), the near (r) leg steps forward and lands heel first (c5), via 1 = the near foot in
//  the air halfway, via 2 = the near foot down, the rear heel up, hips halfway down. The end differs from the parent's:
//  the back kneecap very lightly touches the floor (c2), so the rear knee joint centre sits KNEECAP above the floor and
//  the front thigh is FRONT_THIGH below parallel (the rear thigh cannot reach the floor from a parallel front thigh).
//  c1's "the back foot steps forward to meet the front foot" is the next step; it is in the alt, not drawn
//  (D-SPLIT-FWD).
// Form (research card walking_lunge, claims): c2 step forward and bend both knees until the back knee very lightly
//  touches the floor, the front shin about vertical; c3 lower the hips rather than driving them forward; c5 the
//  stepping foot lands heel first; c6 feet about hip width at the start; c7 upright trunk; c12 dumbbells at the sides.
// Plate text (card plate): callouts = plate.checkpoints (c2 Front shin vertical, c3 Hips drop down, c7 Chest up);
//  Mistake = plate.mistake (c7, drawable): the trunk pitches forward over the front thigh at the bottom. Tells: the
//  chest (first, the topFault key) and the head.
// Mistake size: the pelvis and trunk pitch forward (arms kept plumb, legs unmoved) until the near shoulder joint
//  centre is over the middle of the front thigh (hip to knee joint centres): "pitches forward over the front thigh"
//  read as the shoulders over the thigh; picked from the words before measuring, never enlarged (Q-D5-3).
// Tempo: the strip without seconds, exactly tempoOf(strip/rows.json walking_lunge) (D-STRIP-ROWS).
// Unsourced numbers: as reverse_lunge's (FOOT_X, REAR_HEEL, TRUNK_LEAN, ELBOW), FRONT_THIGH (5 deg below parallel),
//  the via poses (swing foot 8 cm up; hips), the Mistake size (M_LEAN, solved).
import { landmarksOf } from '../engine.mjs';

const H = 1.75, R = Math.PI / 180;
const L_TH = 0.245 * H, L_SH = 0.246 * H, ANK = 0.039 * H, MID = 0.044 * H, BALL = 0.080 * H;
const FOOT_X = 0.10;              // mid-sole lateral offset: feet hip width (c6)
const FRONT_SHIN = 6;             // front shin, deg forward of vertical (c2 "about vertical")
const FRONT_THIGH = -5;           // front thigh, deg above horizontal (5 below parallel: the rear knee reaches the floor)
const KNEECAP = 0.028 * H;        // kneecap radius (body.mjs RADII.kneeCap)
const REAR_KNEE_Y = KNEECAP;      // rear knee joint centre height (m): the kneecap on the floor (c2 "very lightly touches")
const REAR_HEEL = 45;             // rear foot heel-up angle (deg)
const TRUNK_LEAN = 3;             // pelvis/trunk forward lean at the bottom (deg from vertical)
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
const start = pose([0, 0.925, START_Z - MID + 0.03], STAND_LEAN, { at: [-FOOT_X, 0, START_Z] }, { at: [FOOT_X, 0, START_Z] });
// The step (c5: the stepping foot lands heel first, the weight moves onto it slowly): via 1 = the near foot 8 cm up and
// halfway forward, toes up for a heel landing, the body still over the flat rear foot; via 2 = the near foot down at
// its spot, the rear heel up on the ball, the hips halfway down.
const via = [
  pose([0, 0.89, START_Z + 0.06], 1, { at: [-FOOT_X, 0.08, START_Z / 2], normal: [0, Math.cos(15 * R), -Math.sin(15 * R)] }, { at: [FOOT_X, 0, START_Z] }),
  pose([0, 0.70, (HIP[2] + START_Z) / 2 + 0.12], TRUNK_LEAN, front, REAR),
];
const end = pose(HIP, TRUNK_LEAN, front, REAR);
// Bracketed root finder (Illinois regula falsi, copied from step_up.mjs): throws when f(a) and f(b) have the same sign.
const solve = (f, a, b) => {
  let fa = f(a), fb = f(b), side = 0;
  if (fa * fb > 0) throw new Error(`walking_lunge: no solution in [${a}, ${b}]`);
  for (let i = 0; i < 80 && Math.abs(b - a) > 1e-10; i++) {
    const c = (a * fb - b * fa) / (fb - fa), fc = f(c);
    if (fc * fb > 0) { b = c; fb = fc; if (side === -1) fa /= 2; side = -1; } else if (fa * fc > 0) { a = c; fa = fc; if (side === 1) fb /= 2; side = 1; } else return c;
  }
  return (a + b) / 2;
};
// Mistake (c7): the trunk pitches forward over the front thigh; the pelvis tilt (with the arms kept plumb) is SOLVED,
// bracket [TRUNK_LEAN, 60] deg, so the near shoulder joint centre is over the middle of the front thigh (header).
const LE = landmarksOf(end, H), THIGH_MID = (LE['hip.r'][2] + LE['knee.r'][2]) / 2;
const M_LEAN = solve(t => landmarksOf(pose(HIP, t, front, REAR), H)['shoulder.r'][2] - THIGH_MID, TRUNK_LEAN, 60);
const MISTAKE = pose(HIP, M_LEAN, front, REAR);
/** The unsourced sizes (pilot-a2/sizes.json form). */
export const SIZES = { FOOT_X, FRONT_SHIN, FRONT_THIGH, REAR_KNEE_Y, REAR_HEEL, TRUNK_LEAN, ELBOW, M_LEAN, START_Z };
export const walkInfo = { REAR_BALL, START_Z, HIP, kneeF, M_LEAN };
const SHIN_TOP = 0.12;
const SHIN_PLUMB = [[0, 0, ankF[2]], [0, kneeF[1] + SHIN_TOP, ankF[2]]];
// Hips drop (c3): a plumb from the hips to the floor under them.
const HIP_PLUMB = ['hips', [0, 0, HIP[2]]];
const bells = lm => [
  { type: 'dumbbell', at: lm['grip.l'], axis: [0, 0, 1], z: 'back', part: 'db' },
  { type: 'dumbbell', at: lm['grip.r'], axis: [0, 0, 1], z: 'front', part: 'db' },
];
const FLOOR = { point: [0, 0, 0], normal: [0, 1, 0] };
// The dumbbell in each hand at the start (the setup quote's contact fact), checked at the wrist: the plane square to
// the hand (wrist to grip) through the drawn wrist (step_up's inHand form).
const LS0 = landmarksOf(start, H);
const inHand = s => {
  const d = [0, 1, 2].map(i => LS0[`grip.${s}`][i] - LS0[`wrist.${s}`][i]), L = Math.hypot(...d);
  return { landmark: `wrist.${s}`, plane: { point: LS0[`wrist.${s}`], normal: d.map(v => v / L) }, pose: 'start', tol: 0.5 };
};

export default {
  id: 'walking_lunge', name: 'Walking Lunge', view: 'side', facing: 'right',
  camera: { x0: 248, y0: 339 },
  poses: { start, via, end },
  equipment: [
    { type: 'floor', from: -1.3, to: 0.4 },
    lm => bells(lm)[0],
    lm => bells(lm)[1],
  ],
  checks: [
    { landmark: 'heel.r', plane: FLOOR, pose: 'all', tol: 0.5 },                        // front foot flat
    { landmark: 'ball.r', plane: FLOOR, pose: 'all', tol: 0.5 },
    { landmark: 'heel.l', plane: FLOOR, pose: 'start', tol: 0.5 },                      // feet together at the start
    { landmark: 'ball.l', plane: FLOOR, pose: 'start', tol: 0.5 },
    { landmark: 'toe.l', plane: FLOOR, pose: 'end', tol: 1 },                           // rear forefoot on the floor
    { landmark: 'knee.l', plane: { point: [0, KNEECAP, 0], normal: [0, 1, 0] }, pose: 'end', tol: 0.5 },   // c2: the back kneecap on the floor
    inHand('l'), inHand('r'),                                                           // the hands on the dumbbells at the start
  ],
  ghosts: { count: 2, parts: ['leg.r', 'leg.l', 'trunk', 'arm.r', 'db'] },
  trace: { point: 'hip.r', trim: [10, 12] },
  callouts: [
    { key: 'shin', text: 'Front shin<br>vertical', anchor: { along: ['knee.r', 'ankle.r'], t: 0.45, off: [7, 0] }, guide: SHIN_PLUMB, cue: 'At the bottom, keep the front shin about vertical.' },
    { key: 'hips', text: 'Hips drop<br>down', anchor: 'buttock', guide: HIP_PLUMB, box: { left: 198, top: 218 }, cue: 'Lower the hips toward the floor instead of driving them forward.' },
    { key: 'chest', text: 'Chest up', anchor: 'sternum', box: { left: 212, top: 160 }, cue: 'Keep the trunk upright through the step.' },
  ],
  mistake: {
    pose: MISTAKE,
    tells: [
      { key: 'chest', text: 'Trunk pitches<br>forward', anchor: { at: 'sternum', pose: 'mistake' }, cue: 'The trunk pitches forward over the front thigh at the bottom.' },   // c7
      { key: 'head', text: 'Head drops', anchor: { at: 'ear', pose: 'mistake' }, cue: 'The head and chest drop toward the front knee.' },   // c7
    ],
  },
  tempo: [{ phase: 'Lower', move: true, word: 'Controlled' }, { phase: 'Rise', move: true }],
  alt: 'Walking lunge with dumbbells, side view, one step. One leg steps forward and lands heel first, and the body lowers until the back knee lightly touches the floor, front shin near vertical, trunk upright. The back foot then steps forward for the next step.',
};
