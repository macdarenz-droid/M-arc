// Resistance band pull-apart (standing, a band between the fists), FRONT view, figure facing the viewer. LIB-17 (LB7,
// mode H; census closest dumbbell_lateral_raise (N), drawn by ref-src, so the clone source is upright_row, the engine
// front-view anchor: D-LIB17-CLONE).
// View: front (card plate.view = census view). The arms opening from straight ahead out to the sides at shoulder height
//  (c4, c5) and the drawn fault, the shoulders shrugging upward (c8), move in the image plane.
// Sources: research card docs/research/howto/cards/resistance_band_pull_apart.json (research head 8d750bfe): callouts =
//  plate.checkpoints (c3/c8 Shoulders down, c7 Arms level, c5/c9 Soft elbows); Mistake = plate.mistake (c8: the
//  shoulders shrugging upward, drawable); tempo = plate.tempo (c15, c16: pull 2, return 2, hold 1, c16's WEAK convention).
// Clone source: upright_row (#109 @ ff7c5c4f) for the standing front-view base and the shoulder datum, copied, never
//  imported (D-LIB9-CLONE).
// Equipment: the band drawn here from `poly` (D-LIB17-BAND; the census note "composed from line"): a straight strip
//  BAND_T thick from fist to fist, in the material of LB1's band (class `eq-solid`, 1.2 cm at the hands: band.mjs:8-9,
//  :33 @ 9e5d9666, cited as a convention, never imported). It moves between the end pose and the Mistake, so it is a
//  `poly` (PQ-H9). Floor.
// Pose map (DESIGN.md section 9): identity. Start = plate.start: standing tall, feet hip-width, knees slightly bent (c1);
//  arms forward at shoulder height (c5: shoulder elevation 90 in the sagittal plane), elbows slightly bent, hands wider
//  than the shoulders, the band slightly tense (c1, c5); shoulders down (c3). End = plate.end: the arms out to the sides,
//  level (c4: elevation 90), the band near the chest (c5's "or": D-LIB17-ORCHOICE, not a contact), elbows still slightly
//  bent (c5), shoulders down (c3).
// Geometry decisions (confirmed by the engine report `angles` and `checks`):
//  Stance: upright_row's feet and soft knees (FOOT_X, KNEE_SOFT; c1 "knees slightly bent"); trunk upright (c7).
//  Arms: both elbows bent ELBOW_BEND in every pose (c1, c5 "slightly bent"; D-LIB16-LOCK's basis,
//   machine_chest_press.mjs:45). Start: elevation 90 in the plane START_PLANE (hands wider than the shoulders, c1).
//   End: elevation 90 in the plane END_PLANE, out to the sides with the band in front of the chest. In both poses the
//   shoulder rotation (START_ROT, END_ROT) is SOLVED so the fists sit at shoulder height (c1, c7).
//  Mistake (c8): only the scapulae change: both raised M_SHRUG cm (the approved lateral raise's shrug, ref-src/plate.mjs:147,
//   "shrug_cm 5").
//  Hidden start parts: the start arms point at the viewer in front of the chest, under the end torso, and the start
//   layer drops moving equipment (DRAWING-GUIDE.md 4), so the start arms and the start band are redrawn as dashed
//   phantoms in the end layer (Q2 (c)).
// Unsourced numbers (SIZES below; lb7/sizes.json holds each with its basis): FOOT_X, KNEE_SOFT, ELBOW_BEND, START_PLANE,
//  END_PLANE, BAND_T, M_SHRUG, FLOOR_L, FLOOR_R. The elevations 90 are c5's and c4's.
import { WINTER, REF, landmarksOf, normPose, resolve, fk, bodyShapes } from '../engine.mjs';

const H = 1.75, R = Math.PI / 180;
export const SIZES = Object.freeze({ FOOT_X: 0.18, KNEE_SOFT: 5, ELBOW_BEND: 18, START_PLANE: 75, END_PLANE: 10, BAND_T: 0.012, M_SHRUG: 5,
  FLOOR_L: 1.05, FLOOR_R: 1.05 });
const { FOOT_X, KNEE_SOFT, ELBOW_BEND, START_PLANE, END_PLANE, BAND_T, M_SHRUG, FLOOR_L, FLOOR_R } = SIZES;
const LEVEL = 90;   // c5 "arms extended forward at shoulder height"; c4 "until arms align with shoulders"

// Standing base (copied from upright_row.mjs:53-57): the root height solved from the soft-knee leg length.
const FOOT_Z = REF.mid * H;
const LEG = (() => { const a = WINTER.thigh * H, b = WINTER.shank * H, k = KNEE_SOFT * R; return Math.sqrt(a * a + b * b + 2 * a * b * Math.cos(k)); })();
const ROOT_Y = Math.sqrt(LEG * LEG - (FOOT_X - REF.hjcX * H) ** 2) + WINTER.ankleH * H;
const feet = { l: { at: [FOOT_X, 0, FOOT_Z], toe: [0.3, 0, 1] }, r: { at: [-FOOT_X, 0, FOOT_Z], toe: [-0.3, 0, 1] } };
const base = { root: { at: [0, ROOT_Y, 0], tilt: 0 }, trunk: 0, neck: 0, plant: feet };
const armsAt = (plane, rot) => { const sh = { elev: LEVEL, plane, rot }; return { shoulder: { l: sh, r: sh }, elbow: { l: ELBOW_BEND, r: ELBOW_BEND } }; };

// Bracketed root finder (Illinois regula falsi, copied from one_arm_dumbbell_row, #274): throws when f(a) and f(b) have
// the same sign (D-LIB9-CLONE b).
export const solve = (f, a, b) => {
  let fa = f(a), fb = f(b), side = 0;
  if (fa * fb > 0) throw new Error(`resistance_band_pull_apart: no solution in [${a}, ${b}]`);
  for (let i = 0; i < 60 && Math.abs(b - a) > 1e-7; i++) {
    const c = (a * fb - b * fa) / (fb - fa), fc = f(c);
    if (fc * fb > 0) { b = c; fb = fc; if (side === -1) fa /= 2; side = -1; } else if (fa * fc > 0) { a = c; fa = fc; if (side === 1) fb /= 2; side = 1; } else return c;
  }
  return (a + b) / 2;
};
// The shoulder rotation turns the soft elbow's bend into the horizontal plane, so the fists (and the band) sit at
// shoulder height (c1 "hold the band out in front at shoulder height"; c7 "keep arms at shoulder height"): SOLVED per pose
// (brackets: start -100 to -50, end -60 to 0; at rot 0 the start bend lifts the fists about 10 cm above the shoulder).
const gripRise = (plane, rot) => { const L = landmarksOf({ ...base, ...armsAt(plane, rot) }, H); return L['grip.l'][1] - L['shoulder.l'][1]; };
export const START_ROT = solve(r => gripRise(START_PLANE, r), -100, -50);
export const END_ROT = solve(r => gripRise(END_PLANE, r), -60, 0);
const start = { ...base, ...armsAt(START_PLANE, START_ROT) };
const end = { ...base, ...armsAt(END_PLANE, END_ROT) };
const mistakePose = { scap: { elev: M_SHRUG, pro: 0 } };

const LS = landmarksOf(start, H), LE = landmarksOf(end, H);
// The band (D-LIB17-BAND): a straight strip from fist to fist (grip.r to grip.l), BAND_T thick across its run, in the
// image plane at the fists' mean depth. A `poly`, so it is redrawn in the Mistake view (PQ-H9).
export const bandOf = lm => {
  const a = lm['grip.r'], b = lm['grip.l'], dx = b[0] - a[0], dy = b[1] - a[1], k = Math.hypot(dx, dy), n = [-dy / k * BAND_T / 2, dx / k * BAND_T / 2];
  const z = (a[2] + b[2]) / 2;
  return { type: 'poly', pts: [[a[0] - n[0], a[1] - n[1], z], [b[0] - n[0], b[1] - n[1], z], [b[0] + n[0], b[1] + n[1], z], [a[0] + n[0], a[1] + n[1], z]], cls: 'eq-solid', z: 'front', part: 'band' };
};
// The start band as a dashed phantom (end layer).
const START_BAND = (() => { const it = bandOf(LS); return { type: 'line', pts: [...it.pts, it.pts[0]], cls: 'eq-line m-line', z: 'front', part: 'startBand' }; })();
// The start arms as dashed phantoms (Q2 (c)): the start arms and fists lie under the end torso fill, so the outline of
// each start arm's union (upper arm, elbow cap, forearm, fist) is redrawn in the end layer (z front), as
// cable_lateral_raise's START_ARM (machine_chest_press.mjs:80-107's method in the front view).
const insidePoly = (p, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
  const [xi, yi] = poly[i], [xj, yj] = poly[j];
  if ((yi > p[1]) !== (yj > p[1]) && p[0] < (xj - xi) * (p[1] - yi) / (yj - yi) + xi) c = !c; } return c; };
export const START_ARMS = (() => {
  const body = { height: H }, sk = fk(resolve(normPose(start, body), body).q, body), cam = { view: 'front', pxm: 1, P: w => [w[0], -w[1]] }, runs = [];
  for (const sd of ['l', 'r']) {
    const polys = bodyShapes(sk, cam).filter(sh => [`upper.${sd}`, `elbowcap.${sd}`, `fore.${sd}`, `fist.${sd}`].includes(sh.key)).map(sh => sh.poly);
    polys.forEach((poly, k) => {
      let run = [];
      const flush = () => { if (run.length > 1) runs.push({ sd, run }); run = []; };
      for (let i = 0; i < poly.length; i++) {
        const a = poly[i], b = poly[(i + 1) % poly.length], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.002));
        for (let j = 0; j < n; j++) { const p = [a[0] + (b[0] - a[0]) * j / n, a[1] + (b[1] - a[1]) * j / n]; if (polys.some((q, m) => m !== k && insidePoly(p, q))) flush(); else run.push(p); }
      }
      flush();
    });
  }
  return runs.map(({ sd, run }) => ({ type: 'line', pts: run.map(p => [p[0], -p[1], LS[`grip.${sd}`][2]]), cls: 'eq-line m-line', z: 'front', part: 'startArm' }));
})();
const FLOOR = { point: [0, 0, 0], normal: [0, 1, 0] };
const SH_Y = LE['shoulder.l'][1];

export const RBPA = { bandOf, start, end, mistakePose };
export default {
  id: 'resistance_band_pull_apart', name: 'Resistance Band Pull-Apart', view: 'front',
  poses: { start, end },
  equipment: [
    { type: 'floor', from: -FLOOR_L, to: FLOOR_R },
    lm => bandOf(lm),
    (lm, ctx) => (ctx.pose === 'end' ? [...START_ARMS, START_BAND] : null),
  ],
  checks: [
    ...['heel.l', 'ball.l', 'heel.r', 'ball.r'].map(landmark => ({ landmark, plane: FLOOR, pose: 'all', tol: 0.5 })),
    // c4, c7: the elbows level with the shoulders at the end (the arms at shoulder height), within 2 cm
    ...['elbow.l', 'elbow.r'].map(landmark => ({ landmark, plane: { point: [0, SH_Y, 0], normal: [0, 1, 0] }, pose: 'end', tol: 2 })),
    // c1: the band in both hands
    { landmark: 'wrist.l', at: LS['wrist.l'], pose: 'start', tol: 0.5 },
    { landmark: 'wrist.r', at: LS['wrist.r'], pose: 'start', tol: 0.5 },
  ],
  startParts: ['arm.l', 'arm.r', 'band'],
  ghosts: { count: 3, parts: ['arm.l', 'arm.r', 'band'] },
  trace: { point: 'grip.l', trim: [10, 12] },
  datum: [{ y: 'shoulder.l', from: 'shoulder.r', to: 'shoulder.l' }],
  callouts: [
    { key: 'down', text: 'Shoulders<br>down', anchor: { at: 'shoulder.r', off: [0, -8] }, box: { left: 40, top: 40 }, cue: 'Keep your shoulders down as the band pulls apart.' },
    { key: 'level', text: 'Arms<br>level', anchor: { at: 'elbow.l', off: [0, 6] }, box: { left: 270, top: 170 }, cue: 'Keep your arms at shoulder height.' },
    { key: 'soft', text: 'Soft<br>elbows', anchor: { at: 'elbow.r', off: [0, 6] }, box: { left: 30, top: 170 }, cue: 'Keep your elbows only slightly bent.' },
  ],
  tempo: [{ phase: 'Pull apart', s: 2, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Return', s: 2, move: true }],
  mistake: {
    pose: mistakePose,
    guides: [
      { kind: 'arrow', from: { at: 'shoulder.l', pose: 'end', off: [0, -14] }, to: { at: 'shoulder.l', pose: 'mistake', off: [0, -14] } },
    ],
    tells: [
      { key: 'shrug', text: 'Shoulders<br>shrug up', anchor: { at: 'shoulder.l', pose: 'mistake', off: [0, -8] }, box: { left: 250, top: 24 }, cue: 'The shoulders shrug upward as the band pulls apart.' },
    ],
  },
  alt: 'Resistance band pull-apart, front view. Standing tall with soft knees, a band held in both hands at shoulder height, the arms open from straight ahead out to the sides, elbows slightly bent, until the band is near the chest and the shoulders stay down.',
};
