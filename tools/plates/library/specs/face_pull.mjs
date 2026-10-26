// Face pull (standing, rope, cable pulley at eye height), SIDE view, figure facing the column (screen right). LIB-17
// (LB7, mode H; census closest seated_cable_row, the 8: D-LIB17-CLONE).
// View: side (card plate.view = census view). The pull runs front to back toward the face (c5, c6), and the drawn fault,
//  the elbows dropping below shoulder height (c9, c10), reads as the elbow's height against the shoulder.
// Sources: research card docs/research/howto/cards/face_pull.json (research head 8d750bfe): callouts = plate.checkpoints
//  (c5/c9 Elbows high, c5/c10 Rope to face, c4 Body still); Mistake = plate.mistake (c9, c10: the elbows dropping below
//  shoulder height, drawable); tempo = plate.tempo (c16, c17: up 2, down 3, pause 1, c17's WEAK convention).
// Clone source: seated_cable_row (vendor/exercises/seated_cable_row.mjs, the 8) for the cable column, the stack lift and
//  the rope-side cable, copied, never imported (D-LIB9-CLONE); dumbbell_biceps_curl (#109 @ ff7c5c4f) for the standing
//  side-view base (the root height solved from the soft-knee leg length).
// Equipment: the vendor cableColumn (column, pulley, cable, stack) in front of the figure, the pulley at eye height
//  (c1); main's eq/rope.mjs through perItem(rope, ROPE_ITEMS), unedited (DESIGN.md section 4), its cable leaving the
//  pulley's lifter-side tangent, so the rope's cable and the column's cable are one line; floor.
// Pose map (DESIGN.md section 9): identity. Start = plate.start: standing tall facing the pulley (c3, c4), the arms
//  extended toward the pulley with the cable taut (c3), neutral grip on the rope ends (c2). End = plate.end: the rope
//  at the face, the hands by the ears at eye level, the rope ends apart (c5-c7), the elbows high and out, above the
//  shoulder line (c5, c9), the shoulder blades squeezed (c6, c7), the body still (c4).
// Geometry decisions (confirmed by the engine report `angles` and `checks`):
//  Stance: feet hip-width (c3: the ankles under the hip joints), knees soft (KNEE_SOFT); trunk upright and still (c4).
//  Start: the grips on the line from the shoulders toward the pulley, START_ELBOW short of straight (c3 "arms
//   extended", never locked: D-LIB16-LOCK's basis), the rope ends GRIP_X0 apart under the ferrule. The cable from the
//   pulley to the ferrule is CABLE_START long (c3 "a couple of steps back", DESIGN.md section 11), which places the
//   column.
//  End: the grips END_X out from the midline at the ear (c7 "hands near ears", c5 "at eye level"); the elbows solved
//   by the arm IK with the pole out and up, so the elbow sits above the shoulder (c5, c9). Scapulae squeezed back
//   (c6, c7: SCAP_END, pull_up.mjs:36's 3 cm).
//  Mistake (c9, c10): only the arms change: the hands lower, toward the chin (c10 "pulling too low to chin"), and the
//   elbows M_DROP below the shoulder line (the pole angle SOLVED for it).
//  The start layer drops moving equipment (DRAWING-GUIDE.md 4): the start arms are in front of the body (no hidden
//   start limb), and the start rope is redrawn as dashed phantom strands in the end layer.
// Unsourced numbers (SIZES below; lb7/sizes.json holds each with its basis): KNEE_SOFT, START_ELBOW, GRIP_X0, END_X,
//  END_FWD, M_X, M_FWD, M_DROP, SCAP_START, SCAP_END, CABLE_START, COLUMN_BACK, FLOOR_B, FLOOR_F.
import { WINTER, REF, landmarksOf } from '../engine.mjs';
import { rope, ropeGeometry, strandOutline, ROPE_ITEMS } from '../eq/rope.mjs';
import { perItem } from '../eq/parts.mjs';

const H = 1.75, R = Math.PI / 180;
export const SIZES = Object.freeze({ KNEE_SOFT: 6, START_ELBOW: 10, GRIP_X0: 0.07, END_X: 0.15, END_FWD: 0.02, M_X: 0.10, M_FWD: 0.10, M_DROP: 0.15,
  SCAP_START: -1, SCAP_END: -3, CABLE_START: 0.532, COLUMN_BACK: 0.08, FLOOR_B: 0.45, FLOOR_F: 0.20 });
const { KNEE_SOFT, START_ELBOW, GRIP_X0, END_X, END_FWD, M_X, M_FWD, M_DROP, SCAP_START, SCAP_END, CABLE_START, COLUMN_BACK, FLOOR_B, FLOOR_F } = SIZES;

// Bracketed root finder (Illinois regula falsi, copied from cable_lateral_raise): throws when f(a) and f(b) have the
// same sign.
export const solve = (f, a, b) => {
  let fa = f(a), fb = f(b), side = 0;
  if (fa * fb > 0) throw new Error(`face_pull: no solution in [${a}, ${b}]`);
  for (let i = 0; i < 60 && Math.abs(b - a) > 1e-7; i++) {
    const c = (a * fb - b * fa) / (fb - fa), fc = f(c);
    if (fc * fb > 0) { b = c; fb = fc; if (side === -1) fa /= 2; side = -1; } else if (fa * fc > 0) { a = c; fa = fc; if (side === 1) fb /= 2; side = 1; } else return c;
  }
  return (a + b) / 2;
};

// Standing base (copied from dumbbell_biceps_curl.mjs:47-52, #109): feet hip-width (c3), so the ankle sits under the
// hip joint (FOOT_X = the hip-joint offset); the root height solved from the soft-knee leg length.
const FOOT_X = REF.hjcX * H, FOOT_Z = REF.mid * H;
const LEG = (() => { const a = WINTER.thigh * H, b = WINTER.shank * H, k = KNEE_SOFT * R; return Math.sqrt(a * a + b * b + 2 * a * b * Math.cos(k)); })();
const ROOT_Y = Math.sqrt(LEG * LEG - (FOOT_X - REF.hjcX * H) ** 2) + WINTER.ankleH * H;
const feet = { l: { at: [FOOT_X, 0, FOOT_Z] }, r: { at: [-FOOT_X, 0, FOOT_Z] } };
const base = scap => ({ root: { at: [0, ROOT_Y, 0], tilt: 0 }, trunk: 0, neck: 0, scap: { elev: 0, pro: scap }, wrist: 0, plant: feet });

const unit = v => { const k = Math.hypot(...v); return v.map(x => x / k); };
const dist = (a, b) => Math.hypot(...a.map((v, i) => v - b[i]));
// Segment lengths from the engine's own skeleton (shoulder -> elbow, elbow -> grip centre).
const probe = landmarksOf({ ...base(SCAP_START), shoulder: { flex: 0 }, elbow: 0 }, H);
const L1 = dist(probe['shoulder.r'], probe['elbow.r']), L2 = dist(probe['elbow.r'], probe['grip.r']);
const reachOf = bend => Math.sqrt(L1 * L1 + L2 * L2 + 2 * L1 * L2 * Math.cos(bend * R));   // shoulder -> grip at that bend
// Both grips from the right-hand target g (x < 0) and pole p, mirrored for the left.
const grips = (g, p) => ({ l: { at: [-g[0], g[1], g[2]], pole: [-p[0], p[1], p[2]] }, r: { at: g, pole: p } });

// The pulley (c1: at eye height): PULLEY_Y SOLVED as the drawn figure's ear height (the engine has no eye landmark;
// the eyes and the ears share a level). Then the cable's lifter-side tangent on it, in the side plane
// (the same construction as cableColumn's tangentPoint, equipment.mjs:96, on screen coordinates [z, -y]).
const LM0 = landmarksOf({ ...base(SCAP_END), shoulder: { flex: 0 }, elbow: 0 }, H);
export const PULLEY_Y = LM0.ear[1];
const PR = 0.045, WRAP = 1;
const tangentOf = (pulley, p) => {
  const c = [pulley[2], -pulley[1]], P = [p[2], -p[1]], dx = P[0] - c[0], dy = P[1] - c[1], D = Math.hypot(dx, dy);
  const a = Math.atan2(dy, dx), b = Math.acos(PR / D) * WRAP;
  return [0, -(c[1] + PR * Math.sin(a + b)), c[0] + PR * Math.cos(a + b)];
};
const gripsOf = lm => ({ l: lm['grip.l'], r: lm['grip.r'] });
// The ferrule and the cable's tangent, solved together (the rope's ferrule sits on the line from the tangent to the
// hands; the tangent depends on the ferrule): 4 rounds settle both under 1e-6 m.
const rigOf = (pulley, lm) => {
  let t = pulley, f = null;
  for (let i = 0; i < 4; i++) { f = ropeGeometry({ pulley: t, grips: gripsOf(lm) }).ferrule; t = tangentOf(pulley, f); }
  return { ferrule: f, tangent: t };
};

// Start: the arms extended toward the pulley (c3), from the shoulders; the pulley sits CABLE_START beyond the start
// ferrule on the same line (a fixed point: the arm aims at the pulley, the pulley sits behind the start rope).
const SH = probe['shoulder.r'], START_POLE = [-0.2, -1, 0];   // start: the elbows down and a little out (the arm IK's natural bend)
const startPose = pulley => {
  const u = unit([0, pulley[1] - SH[1], pulley[2] - SH[2]]), r = reachOf(START_ELBOW), g = [-GRIP_X0, SH[1] + u[1] * Math.sqrt(r * r - (GRIP_X0 + SH[0]) ** 2), SH[2] + u[2] * Math.sqrt(r * r - (GRIP_X0 + SH[0]) ** 2)];
  return { ...base(SCAP_START), reach: grips(g, START_POLE) };
};
export const PULLEY = (() => {
  let p = [0, PULLEY_Y, 1.2];
  for (let i = 0; i < 30; i++) {
    const lm = landmarksOf(startPose(p), H), { ferrule } = rigOf(p, lm);
    p = [0, PULLEY_Y, ferrule[2] + Math.sqrt(Math.max(0, CABLE_START ** 2 - (PULLEY_Y - ferrule[1]) ** 2))];
  }
  return p;
})();
const start = startPose(PULLEY);

// End: the grips by the ears at eye level (c5, c7), END_X out from the midline, END_FWD in front of the ear; the pole
// straight out to the side (c5 "out to the sides"), so the arm IK puts the elbows out and above the shoulder line (c5,
// c9: high, at least level with the shoulders; the engine report gives the height).
const END_G = [-END_X, LM0.ear[1], LM0.ear[2] + END_FWD];
const poleAt = a => [-Math.cos(a * R), Math.sin(a * R), 0];
const SH_END = landmarksOf({ ...base(SCAP_END), reach: grips(END_G, poleAt(0)) }, H)['shoulder.r'];
const end = { ...base(SCAP_END), reach: grips(END_G, poleAt(0)) };
// Mistake (c9, c10): the hands toward the chin (M_X out, M_FWD in front of it) and the elbows M_DROP below the shoulder
// line: the pole's angle below level SOLVED for it. Only the arms change.
const M_G = [-M_X, LM0.chin[1], LM0.chin[2] + M_FWD];
const mReach = a => grips(M_G, poleAt(a));
export const M_POLE = solve(a => landmarksOf({ ...end, reach: mReach(a) }, H)['elbow.r'][1] - (SH_END[1] - M_DROP), -89, 60);
const mistakePose = { reach: mReach(M_POLE) };
const via = [1 / 3, 2 / 3].map(t => {
  const a = landmarksOf(start, H)['grip.r'], g = a.map((v, i) => v + (END_G[i] - v) * t);
  const e = poleAt(0), pole = unit(START_POLE.map((v, i) => v + (e[i] - v) * t));
  return { ...base(SCAP_START + (SCAP_END - SCAP_START) * t), reach: grips(g, pole) };
});

const LS = landmarksOf(start, H), LE = landmarksOf(end, H), LM = landmarksOf({ ...end, ...mistakePose }, H);
// Column behind the pulley (seated_cable_row.mjs:25-26: the pulley 8 cm in front of the stack tower).
const COLUMN = [0, 0, PULLEY[2] + COLUMN_BACK];
const RIG_S = rigOf(PULLEY, LS), RIG_E = rigOf(PULLEY, LE), RIG_M = rigOf(PULLEY, LM);
// The stack in the Mistake stays where the end pose puts it (the ER method): the rest point moves along the start
// cable by the Mistake ferrule's extra length, so the column's lift equals the end pose's.
const restFor = (ferrule, ctx) => {
  if (ctx.pose !== 'mistake') return RIG_S.ferrule;
  const k = (dist(ferrule, PULLEY) - (dist(RIG_E.ferrule, PULLEY) - dist(RIG_S.ferrule, PULLEY))) / dist(RIG_S.ferrule, PULLEY);
  return PULLEY.map((v, i) => v + (RIG_S.ferrule[i] - v) * k);
};
// The Mistake cable (slice look #299 6348157337 item 1): a dashed Mistake guide from the pulley's rim to the Mistake
// ferrule (the column's and the rope's cable are lines, which the Mistake view never redraws).
export const M_CABLE = (() => { const u = unit(RIG_M.ferrule.map((v, i) => v - PULLEY[i])); return [PULLEY.map((v, i) => v + u[i] * PR), RIG_M.ferrule]; })();
// Start rope phantom (dashed, end layer, z front): the near strand's outline at the start (the start layer drops the
// moving rope; DRAWING-GUIDE.md 4), from the composer's own strandOutline at its defaults.
const START_ROPE = (() => {
  const g = ropeGeometry({ pulley: RIG_S.tangent, grips: gripsOf(LS), ferrule: RIG_S.ferrule });
  return g.strands.filter(s => s.side === 'r').map(s => {
    const pts = strandOutline({ ...s, below: 0.055, thick: 0.028, knob: 0.046, knobLen: 0.035, sag: 0.006, view: 'side' });
    return { type: 'line', pts: [...pts, pts[0]], cls: 'eq-line m-line', z: 'front', part: 'startRope' };
  });
})();
const FLOOR = { point: [0, 0, 0], normal: [0, 1, 0] };

export const FP = { pulley: PULLEY, rigOf, ferruleOf: lm => rigOf(PULLEY, lm).ferrule, shoulderEnd: SH_END };
export default {
  id: 'face_pull', name: 'Face Pull', view: 'side', facing: 'right',
  camera: { x0: 100, y0: 339 },                          // reference scale; figure shifted right for the left labels
  poses: { start, via, end },
  equipment: [
    { type: 'floor', from: -FLOOR_B, to: COLUMN[2] + FLOOR_F },
    (lm, ctx) => { const { ferrule } = rigOf(PULLEY, lm); return { type: 'cableColumn', base: COLUMN, pulley: { at: PULLEY, r: PR }, to: ferrule, rest: restFor(ferrule, ctx), wrap: WRAP, part: 'column' }; },
    ...perItem(lm => { const { ferrule, tangent } = rigOf(PULLEY, lm); return rope({ pulley: tangent, grips: gripsOf(lm), ferrule, part: 'rope' }); }, ROPE_ITEMS),
    (lm, ctx) => (ctx.pose === 'end' ? START_ROPE : null),
  ],
  checks: [
    ...['heel.l', 'ball.l', 'heel.r', 'ball.r'].map(landmark => ({ landmark, plane: FLOOR, pose: 'all', tol: 0.5 })),
    // c5, c7: the hands by the ears at eye level (end)
    { landmark: 'grip.r', at: END_G, pose: 'end', tol: 0.5 },
    { landmark: 'grip.l', at: [-END_G[0], END_G[1], END_G[2]], pose: 'end', tol: 0.5 },
    // c5, c9: the elbows above the shoulder line (end)
    { landmark: 'elbow.r', above: { point: SH_END, normal: [0, 1, 0] }, pose: 'end' },
    { landmark: 'elbow.l', above: { point: SH_END, normal: [0, 1, 0] }, pose: 'end' },
    // c2: the hands on the rope ends at the start
    { landmark: 'wrist.l', at: LS['wrist.l'], pose: 'start', tol: 0.5 },
    { landmark: 'wrist.r', at: LS['wrist.r'], pose: 'start', tol: 0.5 },
  ],
  ghosts: { count: 2, parts: ['arm.r', 'rope'] },
  trace: { point: 'grip.r', trim: [10, 12] },
  callouts: [
    { key: 'high', text: 'Elbows<br>high', anchor: { along: ['shoulder.r', 'elbow.r'], t: 0.5, off: [-7, 0] }, box: { left: 8, top: 108 }, cue: 'Keep the elbows high and wide for the whole rep.' },
    { key: 'face', text: 'Rope<br>to face', anchor: RIG_E.ferrule, box: { left: 146, top: 30 }, cue: 'Pull the rope toward your face at eye level, not the chin.' },
    { key: 'still', text: 'Body still', anchor: 'chest', box: { left: 164, top: 172 }, cue: 'Keep the chest up and the body still and stable.' },
  ],
  tempo: [{ phase: 'Pull', s: 2, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Return', s: 3, move: true }],
  mistake: {
    pose: mistakePose,
    guides: [
      { kind: 'dashed', pts: M_CABLE },   // the cable to the Mistake rope
    ],
    tells: [
      { key: 'drop', text: 'Elbows<br>drop', anchor: { at: 'elbow.r', pose: 'mistake' }, box: { left: 150, top: 204 }, cue: 'The elbows drop below shoulder height during the pull.' },
      { key: 'low', text: 'Pulled<br>to chin', anchor: { at: 'grip.r', pose: 'mistake' }, box: { left: 164, top: 156 }, cue: 'The rope is pulled too low, to the chin, not the face.' },
    ],
  },
  alt: 'Face pull, side view. Standing tall facing a cable column with the pulley at eye height, the lifter pulls a rope from extended arms to the face, the hands finishing by the ears with the elbows high and wide.',
};
