// Dumbbell front raise (standing, both arms, pronated grip), SIDE view, figure facing screen right. LIB-17 (LB7, mode H;
// census closest dumbbell_lateral_raise, drawn by ref-src, so the clone source is dumbbell_biceps_curl, the engine
// dumbbell and standing side-view anchor: D-LIB17-CLONE).
// View: side (card plate.view = census view). The arms rise forward in the sagittal plane (c5, c8), and the drawn fault,
//  the swing with the hips pushed forward (c12), shows from the side.
// Sources: research card docs/research/howto/cards/dumbbell_front_raise.json (research head 8d750bfe): callouts =
//  plate.checkpoints (c4 Shoulders down, c5 Elbows lead, c8 Shoulder height); Mistake = plate.mistake (c12, c13: swinging
//  the dumbbells up with body momentum, the hips pushed forward, drawable); tempo = plate.tempo (c19, c20: up 1, down 3,
//  pause 1, c19's WEAK convention).
// Clone source: dumbbell_biceps_curl (#109 @ ff7c5c4f) for the standing side-view base, the end-on hex dumbbell and the
//  dashed hidden-line method, copied, never imported (D-LIB9-CLONE).
// Equipment: a vendor dumbbell in each hand, end-on (the pronated grip's handle runs across the body, c1), the far one
//  exactly behind the near one, so only the near one is drawn (dumbbell_biceps_curl's rule); the floor line.
// Pose map (DESIGN.md section 9): identity. Start = plate.start: standing tall, the dumbbells in front of the thighs
//  (c1), elbows slightly bent (c2), shoulders down and back (c4). End = plate.end: the upper arms level with the
//  shoulders (c8, shoulder elevation 90 against the upright trunk), the soft bend kept (c2), torso erect (c9), hips
//  still (c12).
// Geometry decisions (confirmed by the engine report `angles` and `checks`):
//  Stance: dumbbell_biceps_curl's feet and soft knees (FOOT_X, KNEE_SOFT); trunk upright (c4, c9).
//  Arms (both, the same): the elbow bent ELBOW_BEND in every pose (c2 "soft bend"; D-LIB16-LOCK's basis,
//   machine_chest_press.mjs:45); the bend drawn in the side-view plane (panel R1, #299): at the top the upper arm turned
//   ARM_ROT so the forearm drops below the level upper arm by the bend and the elbow leads the dumbbell (c5); at the
//   hanging start START_ROT, so the forearm bends forward of the upper arm's line. Start: the shoulder
//   flexed START_FLEX, SOLVED (bracket 0 to 40) so the dumbbell's back sits on the front thigh line (c1, c2; DESIGN.md
//   section 10). End: shoulder flexion 90 (c8).
//  Scapulae SCAP down and back (c4), as dumbbell_biceps_curl's set.
//  Mistake (c12, c13): only the body's swing changes: the hips pushed M_HIP forward over the planted feet (the root
//   height re-solved for the same knee bend) and the trunk leaning back M_LEAN for balance (unlabelled; ruled), the arms
//   as the end pose against the trunk, so the dumbbells swing above the shoulder line.
//  Hidden start parts: the hanging start forearm, fist and dumbbell lie over the thigh under the filled end body, so
//   their outline is redrawn as dashed hidden lines in the end layer (dumbbell_biceps_curl's method); the start upper
//   arm too, since the end upper arm is level.
// Unsourced numbers (SIZES below; lb7/sizes.json holds each with its basis): FOOT_X, KNEE_SOFT, ELBOW_BEND, ARM_ROT, START_ROT,
//  SCAP_ELEV, SCAP_PRO, M_HIP, M_LEAN, FLOOR_BACK, FLOOR_FRONT. START_FLEX is solved; the flexion 90 is c8's.
import { WINTER, REF, landmarksOf, normPose, resolve, fk, bodyShapes } from '../engine.mjs';

const H = 1.75, R = Math.PI / 180;
export const SIZES = Object.freeze({ FOOT_X: 0.14, KNEE_SOFT: 6, ELBOW_BEND: 18, ARM_ROT: 180, START_ROT: 0, SCAP_ELEV: -1, SCAP_PRO: -1, M_HIP: 0.08, M_LEAN: 12,
  FLOOR_BACK: 0.5, FLOOR_FRONT: 0.85 });
const { FOOT_X, KNEE_SOFT, ELBOW_BEND, ARM_ROT, START_ROT, SCAP_ELEV, SCAP_PRO, M_HIP, M_LEAN, FLOOR_BACK, FLOOR_FRONT } = SIZES;
const LEVEL = 90;   // c8 "arms level with the shoulders"
const HEX_R = 0.119 / 2;   // the vendor dumbbell's hex, 11.9 cm across the corners (equipment.mjs:30)

// Bracketed root finder (Illinois regula falsi, copied from one_arm_dumbbell_row, #274): throws when f(a) and f(b) have
// the same sign (D-LIB9-CLONE b).
export const solve = (f, a, b) => {
  let fa = f(a), fb = f(b), side = 0;
  if (fa * fb > 0) throw new Error(`dumbbell_front_raise: no solution in [${a}, ${b}]`);
  for (let i = 0; i < 60 && Math.abs(b - a) > 1e-7; i++) {
    const c = (a * fb - b * fa) / (fb - fa), fc = f(c);
    if (fc * fb > 0) { b = c; fb = fc; if (side === -1) fa /= 2; side = -1; } else if (fa * fc > 0) { a = c; fa = fc; if (side === 1) fb /= 2; side = 1; } else return c;
  }
  return (a + b) / 2;
};

// Standing base (copied from dumbbell_biceps_curl): the root height solved from the soft-knee leg length.
const FOOT_Z = REF.mid * H;
const LEG = (() => { const a = WINTER.thigh * H, b = WINTER.shank * H, k = KNEE_SOFT * R; return Math.sqrt(a * a + b * b + 2 * a * b * Math.cos(k)); })();
const rootY = dz => Math.sqrt(LEG * LEG - (FOOT_X - REF.hjcX * H) ** 2 - dz * dz) + WINTER.ankleH * H;
const feet = { l: { at: [FOOT_X, 0, FOOT_Z] }, r: { at: [-FOOT_X, 0, FOOT_Z] } };
const base = { root: { at: [0, rootY(0), 0], tilt: 0 }, trunk: 0, neck: 0, scap: { elev: SCAP_ELEV, pro: SCAP_PRO }, wrist: 0, plant: feet };
const armAt = (flex, rot) => ({ shoulder: { flex, rot }, elbow: ELBOW_BEND });

// The side-view probe (world metres, x = world z, y = -world y), as the engine draws the figure facing right.
const probe = { view: 'side', near: 'r', pxm: 1, P: w => [w[2], -w[1]] };
const shapesOf = pose => { const b = { height: H }; return bodyShapes(fk(resolve(normPose(pose, b), b).q, b), probe); };
// The front edge of the near thigh's outline at height y (world m): the largest z where the outline crosses y.
export const thighFrontAt = (pose, y) => {
  const poly = shapesOf(pose).find(s => s.key === 'thigh.r').poly;
  let z = -Infinity;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    if ((a[1] + y) * (b[1] + y) <= 0 && a[1] !== b[1]) z = Math.max(z, a[0] + (b[0] - a[0]) * (-y - a[1]) / (b[1] - a[1]));
  }
  return z;
};
// START_FLEX: the start dumbbell's back corner (the hex's corner at -z) on the front thigh line at the grip's height.
const gapAt = flex => { const p = { ...base, ...armAt(flex, START_ROT) }, g = landmarksOf(p, H)['grip.r']; return g[2] - HEX_R - thighFrontAt(p, g[1]); };
export const START_FLEX = solve(gapAt, 0, 40);
const start = { ...base, ...armAt(START_FLEX, START_ROT) };
const end = { ...base, ...armAt(LEVEL, ARM_ROT) };
const mistakePose = { root: { at: [0, rootY(M_HIP), M_HIP], tilt: -M_LEAN } };   // merged over the end pose
const LS = landmarksOf(start, H), LE = landmarksOf(end, H);

// The start dumbbell's hex face (the primitive's orientation: a corner points screen-right = +z), dashed.
const hexOf = g => Array.from({ length: 7 }, (_, k) => [g[0], g[1] - HEX_R * Math.sin(k * Math.PI / 3), g[2] + HEX_R * Math.cos(k * Math.PI / 3)]);
// The start arm (upper arm, elbow cap, forearm, fist) as hidden lines (dumbbell_biceps_curl's method): the outline of
// their union, kept where the end figure covers it and outside the start hex.
const insidePoly = (p, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
  const [xi, yi] = poly[i], [xj, yj] = poly[j];
  if ((yi > p[1]) !== (yj > p[1]) && p[0] < (xj - xi) * (p[1] - yi) / (yj - yi) + xi) c = !c; } return c; };
export const START_ARM = (() => {
  const keys = ['upper.r', 'elbowcap.r', 'fore.r', 'fist.r'], polys = shapesOf(start).filter(s => keys.includes(s.key)).map(s => s.poly);
  const cover = shapesOf(end).map(s => s.poly), hex = hexOf(LS['grip.r']).slice(0, 6).map(w => probe.P(w)), runs = [];
  polys.forEach((poly, k) => {
    let run = [];
    const flush = () => { if (run.length > 1) runs.push(run); run = []; };
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], b = poly[(i + 1) % poly.length], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.002));
      for (let j = 0; j < n; j++) {
        const p = [a[0] + (b[0] - a[0]) * j / n, a[1] + (b[1] - a[1]) * j / n];
        if (polys.some((q, m) => m !== k && insidePoly(p, q)) || insidePoly(p, hex) || !cover.some(c => insidePoly(p, c))) flush(); else run.push(p);
      }
    }
    flush();
  });
  return runs.map(r => ({ type: 'line', pts: r.map(p => [0, -p[1], p[0]]), cls: 'eq-cable m-line', z: 'front', part: 'startArm' }));
})();
const startDb = g => ({ type: 'line', cls: 'eq-cable m-line', pts: hexOf(g), z: 'front', part: 'startDb' });
const FLOOR = { point: [0, 0, 0], normal: [0, 1, 0] };
const SH_Y = LE['shoulder.r'][1];

export const DFR = { startFlex: START_FLEX, hexR: HEX_R, thighFrontAt, start, end, mistakePose };
export default {
  id: 'dumbbell_front_raise', name: 'Dumbbell Front Raise', view: 'side', facing: 'right',
  camera: { x0: 150, y0: 339 },                  // reference scale; the figure left of centre so the raised arms fit
  poses: { start, end },
  equipment: [
    { type: 'floor', from: -FLOOR_BACK, to: FLOOR_FRONT },
    // near dumbbell, end-on (hex face): moves with the near arm, so it ghosts and dashes with it
    lm => ({ type: 'dumbbell', at: lm['grip.r'], part: 'arm.r' }),
    (lm, ctx) => (ctx.pose === 'end' ? [...START_ARM, startDb(ctx.start['grip.r'])] : null),
  ],
  checks: [
    ...['heel.l', 'ball.l', 'heel.r', 'ball.r'].map(landmark => ({ landmark, plane: FLOOR, pose: 'all', tol: 0.5 })),
    // c8: the elbow level with the shoulder at the top (the upper arm horizontal), within 1 cm
    { landmark: 'elbow.r', plane: { point: [0, SH_Y, 0], normal: [0, 1, 0] }, pose: 'end', tol: 1 },
    // c5: the elbows lead: the hand never above the elbow at the top
    { landmark: 'elbow.r', above: { point: LE['grip.r'], normal: [0, 1, 0] }, pose: 'end' },
    // c12 Mistake: the dumbbells swing above the shoulder line
    { landmark: 'grip.r', above: { point: [0, SH_Y, 0], normal: [0, 1, 0] }, pose: 'mistake' },
    // c1 facts: a dumbbell in each hand at the start
    { landmark: 'wrist.l', at: LS['wrist.l'], pose: 'start', tol: 0.5 },
    { landmark: 'wrist.r', at: LS['wrist.r'], pose: 'start', tol: 0.5 },
  ],
  startParts: ['arm.r'],
  ghosts: { count: 3, parts: ['arm.r'] },
  trace: { point: 'grip.r', trim: [12, 14] },
  datum: [{ y: 'shoulder.r', from: 'shoulder.r', to: 346 }],
  callouts: [
    { key: 'shoulders', text: 'Shoulders<br>down', anchor: 'backUpper', box: { left: 40, top: 110 }, cue: 'Pull your shoulders down and back and hold them there.' },
    { key: 'elbows', text: 'Elbows<br>lead', anchor: 'elbow.r', box: { left: 190, top: 64 }, cue: 'Raise the dumbbells in front, elbows rising slightly ahead of the hands.' },
    { key: 'height', text: 'Shoulder<br>height', anchor: { at: 'shoulder.r', off: [150, 0] }, box: { left: 276, top: 64 }, cue: 'Stop when your arms are level with your shoulders.' },
  ],
  tempo: [{ phase: 'Raise', s: 1, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Lower', s: 3, move: true }],
  mistake: {
    pose: mistakePose,
    guides: [],
    tells: [
      { key: 'swing', text: 'Swinging<br>up', anchor: { at: 'grip.r', pose: 'mistake', off: [0, -8] }, box: { left: 262, top: 40 }, cue: 'The dumbbells swing up with body momentum.' },
      { key: 'hips', text: 'Hips<br>forward', anchor: { at: 'navel', pose: 'mistake' }, box: { left: 200, top: 220 }, cue: 'The hips push forward to swing the weights up.' },
    ],
  },
  alt: 'Dumbbell front raise, side view. Standing tall with a dumbbell in each hand in front of the thighs, the arms rise forward with a soft elbow bend until they are level with the shoulders.',
};
