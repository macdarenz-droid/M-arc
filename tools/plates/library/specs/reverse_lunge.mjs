// Reverse lunge with dumbbells, side view, figure facing screen right.
// View: side. The step back, the depth, the front shin angle and the upright trunk are all sagittal.
// Form (research card reverse_lunge, claims): c1 stand with the feet about hip to shoulder width, then step one foot
//  back; c2 at the bottom the front shin is roughly vertical; c3 trunk upright, weight shared about evenly between the
//  feet; c4 once the back foot lands, the back knee is lowered slowly toward the floor, chest up; c7 a full-length
//  step; c11 dumbbells held at the sides (exercises.json lists Dumbbells / Barbell: the plate draws dumbbells).
// Geometry decisions (confirmed by the report `angles` and `checks`):
//  Near leg (r) = the FRONT, working leg: it stays planted where both feet start, so its solid outline carries the
//   shin and flat-foot cues; the far leg (l, lighter stroke) is the one that steps back. The step follows c4: via 1 =
//   rear foot lifted ~8 cm and travelling back, hips barely lower (whole-body centre of mass still over the front
//   foot); via 2 = rear foot landed on the ball at its final spot, hips halfway down; end = the back knee lowered.
//   Ghosts (2, at the via poses) show the stepping leg, trunk, near arm and dumbbells; the trace follows the near hip
//   (back, then down).
//  Front mid-foot at world z 0 (plant ref 'mid', flat). The end pose is BUILT from the front leg outward:
//   front shin FRONT_SHIN deg forward of vertical (knee just in front of the ankle, over the rear of the mid-foot),
//   front thigh FRONT_THIGH deg above horizontal (parallel), which fixes the hip-joint centre; the rear knee centre is
//   set REAR_KNEE_Y above the floor (kneecap radius 4.9 cm, so a ~3.6 cm gap: proved by an `above` check), which fixes
//   the rear thigh; the rear shank then reaches back to the rear foot.
//  Rear foot on the ball: the engine foot is rigid (no toe joint), so the foot is planted on a plane tilted
//   REAR_HEEL deg heel-up with ref 'ball', and the ball is lifted REAR_LIFT so the toe pad (the lowest outline point)
//   just touches the floor instead of sinking through it (the real MTP joint would let the toes lie flat). A check
//   puts toe.l on the floor.
//  Weight even (c3): with this geometry the Winter (2009) whole-body centre of mass sits 44 cm behind the front
//   mid-foot and 51 cm in front of the rear ball (about 54 / 46 front / rear), checked in a scratch script.
//  Trunk: pelvis tilt TRUNK_LEAN deg (upright, c3); arms hang
//   plumb (shoulder extension = trunk lean), elbows 4 deg soft; dumbbells in a neutral grip, handle front-to-back
//   (side view shows the handle and both hex heads).
// CARD: FRONT_SHIN (c2), FRONT_THIGH (depth), REAR_KNEE_Y (c4: how close the knee gets; the card gives no number),
//  TRUNK_LEAN (c3), stride length (follows from these; c7 full-length step), REAR_HEEL (rear heel lift), FOOT_X (c1).
const H = 1.75, R = Math.PI / 180;
const L_TH = 0.245 * H, L_SH = 0.246 * H, ANK = 0.039 * H, MID = 0.044 * H, BALL = 0.080 * H;
const FOOT_X = 0.10;              // mid-sole lateral offset: feet hip width (c1), HJCs 17.5 cm apart
const FRONT_SHIN = 6;             // front shin, deg forward of vertical (knee over the ankle / rear mid-foot)
const FRONT_THIGH = 0;            // front thigh, deg above horizontal (0 = parallel)
const REAR_KNEE_Y = 0.085;        // rear knee joint centre height (m): kneecap ~3.6 cm clear of the floor
const REAR_HEEL = 45;             // rear foot heel-up angle (deg)
const TRUNK_LEAN = 3;             // pelvis/trunk forward lean at the bottom (deg from vertical)
const STAND_LEAN = 0;
const ELBOW = 4;

// Rear foot: rigid foot tilted heel-up; lift the ball so the lowest forefoot outline point (toe pad, foot frame
// [z .112, y -.036] H, from the engine's FOOT_SIDE outline) sits on the floor.
const sT = Math.sin(REAR_HEEL * R), cT = Math.cos(REAR_HEEL * R);
const REAR_LIFT = -Math.min(...[[0.112, -0.036], [0.120, -0.028], [0.100, -0.038]].map(([z, y]) => ((z - 0.080) * -sT + (y + 0.039) * cT) * H));
const REAR_N = [0, cT, sT], REAR_T = [0, -sT, cT];

// End pose, built from the front foot outward (see header).
const ankF = [0, ANK, -MID];
const kneeF = [0, ankF[1] + L_SH * Math.cos(FRONT_SHIN * R), ankF[2] + L_SH * Math.sin(FRONT_SHIN * R)];
const HIP = [0, kneeF[1] + L_TH * Math.sin(FRONT_THIGH * R), kneeF[2] - L_TH * Math.cos(FRONT_THIGH * R)];
const kneeB = [0, REAR_KNEE_Y, HIP[2] - Math.sqrt(L_TH ** 2 - (HIP[1] - REAR_KNEE_Y) ** 2)];
const ankBy = REAR_LIFT + ANK * cT + BALL * sT;
const ankB = [0, ankBy, kneeB[2] - Math.sqrt(L_SH ** 2 - (ankBy - REAR_KNEE_Y) ** 2)];
const REAR_BALL = [FOOT_X, REAR_LIFT, ankB[2] - ANK * sT + BALL * cT];

const front = { at: [-FOOT_X, 0, 0] };
const arms = lean => ({ shoulder: { ext: lean }, elbow: ELBOW });
const pose = (hip, lean, rear) => ({ root: { at: [0, ...hip.slice(1)], tilt: lean }, trunk: 0, neck: 0, ...arms(lean), plant: { r: front, l: rear } });

// Start: standing tall, feet together hip-width, hip-joint centre 3 cm in front of the ankles (plumb line), knees soft.
const start = pose([0, 0.925, -MID + 0.03], STAND_LEAN, { at: [FOOT_X, 0, 0] });
// Step back (card c4: the back foot lands first, then the back knee lowers): via 1 = rear foot off the floor and
// travelling back ~8 cm high, hips only slightly lower (centre of mass still over the front foot); via 2 = rear foot
// landed on the ball at its final spot, hips halfway down; end = the back knee lowered straight toward the floor.
const REAR = { at: REAR_BALL, normal: REAR_N, toe: REAR_T, ref: 'ball' };
const via = [
  pose([0, 0.86, -0.08], 1, { at: [FOOT_X, 0.08, -0.40], normal: [0, Math.cos(15 * R), Math.sin(15 * R)] }),
  pose([0, 0.68, -0.40], TRUNK_LEAN, REAR),
];
const end = pose(HIP, TRUNK_LEAN, REAR);

// Dumbbells in both hands, neutral grip (handle front-to-back). Far one behind the body, near one in front.
const bells = lm => [
  { type: 'dumbbell', at: lm['grip.l'], axis: [0, 0, 1], z: 'back', part: 'db' },
  { type: 'dumbbell', at: lm['grip.r'], axis: [0, 0, 1], z: 'front', part: 'db' },
];
const FLOOR = { point: [0, 0, 0], normal: [0, 1, 0] };

export default {
  id: 'reverse_lunge', name: 'Reverse Lunge', view: 'side', facing: 'right',
  camera: { x0: 248, y0: 339 },
  poses: { start, via, end },
  equipment: [
    { type: 'floor', from: -1.3, to: 0.4 },
    lm => bells(lm),
  ],
  checks: [
    { landmark: 'heel.r', plane: FLOOR, pose: 'all', tol: 0.5 },                        // front foot flat
    { landmark: 'ball.r', plane: FLOOR, pose: 'all', tol: 0.5 },
    { landmark: 'heel.l', plane: FLOOR, pose: 'start', tol: 0.5 },                      // feet together at the start
    { landmark: 'toe.l', plane: FLOOR, pose: 'end', tol: 1 },                           // rear forefoot on the floor
    { landmark: 'knee.l', above: { point: [0, 0.049 + 0.02, 0], normal: [0, 1, 0] }, pose: 'end' },   // rear knee clear (cap + 2 cm)
  ],
  ghosts: { count: 2, parts: ['leg.l', 'trunk', 'arm.r', 'db'] },
  trace: { point: 'hip.r', trim: [10, 12] },
  callouts: [],
  alt: 'Reverse lunge with dumbbells, side view. From standing tall, one leg steps back and the body lowers until the front thigh is parallel and the rear knee hovers just above the floor, front shin near vertical, front foot flat, rear foot on the ball, trunk upright, dumbbells hanging at the sides.',
};
