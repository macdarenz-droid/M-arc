// Cable lateral raise (standing, one arm, low pulley, single handle), FRONT view, figure facing the viewer. LIB-17 (LB7,
// mode H; census closest dumbbell_lateral_raise, drawn by ref-src, so the clone source is upright_row, the engine
// front-view anchor: D-LIB17-CLONE).
// View: front (card plate.view = census view). The arm rising out to the side to the shoulder line (c6, c7) and the
//  drawn fault, the arm past it (c19), move in the image plane; the cable runs across the front of the body (c5).
// Sources: research card docs/research/howto/cards/cable_lateral_raise.json (research head 8d750bfe): callouts =
//  plate.checkpoints (c3 Cable tight, c6/c13 Elbow leads, c7 Shoulder height); Mistake = plate.mistake (c19, c7: the arm
//  raised above shoulder height, beyond 90 degrees, drawable); tempo = plate.tempo (c22, c23: up 2, down 2, pause 1,
//  c22's WEAK convention).
// Clone source: upright_row (#109 @ ff7c5c4f) for the standing front-view base and the shoulder datum, copied, never
//  imported (D-LIB9-CLONE). No angle arc: in the armpit it sat on the Trace's path; the datum and the shoulder-height
//  check carry c7. The approved
//  dumbbell_lateral_raise (golden A, ref-src) gives the elbow's lead (ref-src/plate.mjs:3, "lead 8").
// Equipment: the vendor cableColumn (column, low pulley, cable, stack) on the figure's right, the side nearer the
//  machine (c2), the pulley at its lowest point (c1); floor. The single handle drawn here from `poly` (D-LIB17-HANDLE).
//  The cable runs from the low pulley across the front of the body to the outside hand (c5; the card's notes: "drawn in
//  front"; D-LIB17-CABLE), drawn above the body layer.
// Pose map (DESIGN.md section 9): identity. Start = plate.start: the outside (left) arm hanging with a slight elbow bend
//  (c4), the handle in front of the body (c5), the cable taut (c3). End = plate.end: the upper arm horizontal, out to the
//  side (c7), the elbow slightly bent and leading the hand (c9, c6, c13), shoulder not shrugged (c10), torso upright (c12).
// Geometry decisions (confirmed by the engine report `angles` and `checks`):
//  Stance: upright_row's feet and soft knees (FOOT_X, KNEE_SOFT; the card gives no stance); trunk upright (c12).
//  Working arm: the elbow bent ELBOW_BEND in every pose ("slight elbow bend throughout", c9; D-LIB16-LOCK's basis,
//   machine_chest_press.mjs:45). Start: the hanging arm swung START_ELEV across the front (plane START_PLANE), so the
//   fist hangs in front of the near thigh (c5). End: shoulder elevation 90 in the frontal plane (the upper arm level,
//   c7); the shoulder rotation END_ROT is SOLVED (bracket -60 to 0) so the drawn forearm trails the upper arm by LEAD
//   (the elbow leads the hand, c6, c13; ref-src's lead 8).
//  Free (right) arm: hanging, as upright_row's start arms (elbow 2 deg).
//  Mistake (c19, c7): only the working shoulder changes: elevation 90 + M_OVER, past the shoulder line.
//  Hidden start parts: the start layer drops moving equipment (DRAWING-GUIDE.md 4), so the start handle is redrawn as a
//   dashed phantom in the end layer.
// Unsourced numbers (SIZES below; lb7/sizes.json holds each with its basis): FOOT_X, KNEE_SOFT, ELBOW_BEND, START_ELEV,
//  START_PLANE, LEAD, M_OVER, FREE_ELBOW, COLUMN_X, PULLEY_Y, PULLEY_Z, HANDLE_GRIP, HANDLE_STRAP, FLOOR_L, FLOOR_R.
//  The elevation 90 is c7's.
import { WINTER, REF, landmarksOf } from '../engine.mjs';

const H = 1.75, R = Math.PI / 180;
export const SIZES = Object.freeze({ FOOT_X: 0.18, KNEE_SOFT: 5, ELBOW_BEND: 18, START_ELEV: 12, START_PLANE: 135, LEAD: 8, M_OVER: 20, FREE_ELBOW: 2,
  COLUMN_X: 0.70, PULLEY_Y: 0.12, PULLEY_Z: 0.20, HANDLE_GRIP: 0.13, HANDLE_STRAP: 0.10, FLOOR_L: 1.05, FLOOR_R: 1.05 });
const { FOOT_X, KNEE_SOFT, ELBOW_BEND, START_ELEV, START_PLANE, LEAD, M_OVER, FREE_ELBOW, COLUMN_X, PULLEY_Y, PULLEY_Z, HANDLE_GRIP, HANDLE_STRAP, FLOOR_L, FLOOR_R } = SIZES;
const LEVEL = 90;   // c7 "upper arm horizontal"

// Bracketed root finder (Illinois regula falsi, copied from one_arm_dumbbell_row, #274): throws when f(a) and f(b) have
// the same sign (D-LIB9-CLONE b).
export const solve = (f, a, b) => {
  let fa = f(a), fb = f(b), side = 0;
  if (fa * fb > 0) throw new Error(`cable_lateral_raise: no solution in [${a}, ${b}]`);
  for (let i = 0; i < 60 && Math.abs(b - a) > 1e-7; i++) {
    const c = (a * fb - b * fa) / (fb - fa), fc = f(c);
    if (fc * fb > 0) { b = c; fb = fc; if (side === -1) fa /= 2; side = -1; } else if (fa * fc > 0) { a = c; fa = fc; if (side === 1) fb /= 2; side = 1; } else return c;
  }
  return (a + b) / 2;
};

// Standing base (copied from upright_row.mjs:53-57): the root height solved from the soft-knee leg length.
const FOOT_Z = REF.mid * H;
const LEG = (() => { const a = WINTER.thigh * H, b = WINTER.shank * H, k = KNEE_SOFT * R; return Math.sqrt(a * a + b * b + 2 * a * b * Math.cos(k)); })();
const ROOT_Y = Math.sqrt(LEG * LEG - (FOOT_X - REF.hjcX * H) ** 2) + WINTER.ankleH * H;
const feet = { l: { at: [FOOT_X, 0, FOOT_Z], toe: [0.3, 0, 1] }, r: { at: [-FOOT_X, 0, FOOT_Z], toe: [-0.3, 0, 1] } };
const base = { root: { at: [0, ROOT_Y, 0], tilt: 0 }, trunk: 0, neck: 0, plant: feet };
const armAt = sh => ({ shoulder: { l: sh, r: { elev: 0, plane: 0, rot: 0 } }, elbow: { l: ELBOW_BEND, r: FREE_ELBOW } });
// The drawn lead: the screen angle by which the forearm trails the upper arm below it (front view: x right, y up).
const trailAt = rot => {
  const L = landmarksOf({ ...base, ...armAt({ elev: LEVEL, plane: 0, rot }) }, H), S = L['shoulder.l'], E = L['elbow.l'], G = L['grip.l'];
  return (Math.atan2(E[1] - S[1], E[0] - S[0]) - Math.atan2(G[1] - E[1], G[0] - E[0])) / R;
};
export const END_ROT = solve(r => trailAt(r) - LEAD, -60, 0);
const START_SH = { elev: START_ELEV, plane: START_PLANE, rot: 0 }, END_SH = { elev: LEVEL, plane: 0, rot: END_ROT };
const start = { ...base, ...armAt(START_SH) };
const end = { ...base, ...armAt(END_SH) };
const mistakePose = armAt({ elev: LEVEL + M_OVER, plane: 0, rot: END_ROT });

const LS = landmarksOf(start, H), LE = landmarksOf(end, H);
// Column on the figure's right (x-), the low pulley on its inner face (c1).
const PULLEY = [-COLUMN_X + 0.17, PULLEY_Y, PULLEY_Z];
// The single handle (D-LIB17-HANDLE): the grip bar runs front to back through the fist (the natural neutral grip of a
// single D-handle, card notes, LR-4), so the front view sees it end-on inside the fist; the strap runs from both grip
// ends to the cable ring HANDLE_STRAP from the grip, toward the pulley. It is a `poly`, so the handle is drawn in the
// Mistake view when it moves (PQ-H9).
const unit = v => { const k = Math.hypot(...v); return v.map(x => x / k); };
export const handleOf = g => {
  const toward = unit(PULLEY.map((v, i) => v - g[i])), ring = g.map((v, i) => v + toward[i] * HANDLE_STRAP);
  const front = [g[0], g[1], g[2] + HANDLE_GRIP / 2], back = [g[0], g[1], g[2] - HANDLE_GRIP / 2];
  return { ring, item: { type: 'poly', pts: [front, ring, back], cls: 'eq', z: 'center', part: 'handle' } };
};
const START_RING = handleOf(LS['grip.l']).ring;
// The stack in the Mistake stays where the end pose puts it (the primitive lifts it by the cable's extra length from
// the start, equipment.mjs:92): only the fault, the arm and the handle, changes there.
const dist = a => Math.hypot(...a.map((v, i) => v - PULLEY[i]));
const END_LIFT = dist(handleOf(LE['grip.l']).ring) - dist(START_RING);
const restFor = (ring, ctx) => {
  if (ctx.pose !== 'mistake') return START_RING;
  const k = (dist(ring) - END_LIFT) / dist(START_RING);
  return PULLEY.map((v, i) => v + (START_RING[i] - v) * k);
};
// The start handle as a dashed phantom (end layer): the outline the start layer cannot draw.
const START_HANDLE = (() => { const it = handleOf(LS['grip.l']).item; return { type: 'line', pts: [...it.pts, it.pts[0]], cls: 'eq-line m-line', z: 'front', part: 'startHandle' }; })();
// The cable's mid point at the end (the "Cable tight" anchor sits on the drawn cable).
const END_RING = handleOf(LE['grip.l']).ring;
export const CABLE_MID = END_RING.map((v, i) => v + (PULLEY[i] - v) * 0.42);

// The cable's Mistake twin (DRAWING-GUIDE.md 4; eq/rope.mjs's pattern): the column's cable is a line, which the
// engine never redraws in the Mistake view, so in the Mistake pose a thin `poly` runs from the pulley's rim to the
// ring, drawn there with the moved handle.
const CABLE_W = 0.004;
const cableTwin = ring => {
  const u = unit(ring.map((v, i) => v - PULLEY[i])), a = PULLEY.map((v, i) => v + u[i] * 0.045), n = unit([-u[1], u[0], 0]).map(v => v * CABLE_W / 2);
  return { type: 'poly', pts: [a.map((v, i) => v + n[i]), ring.map((v, i) => v + n[i]), ring.map((v, i) => v - n[i]), a.map((v, i) => v - n[i])], cls: 'eq-solid', z: 'center', part: 'cable' };
};
const FLOOR = { point: [0, 0, 0], normal: [0, 1, 0] };
const SH_Y = LE['shoulder.l'][1];

export const CLR = { pulley: PULLEY, startRing: START_RING, handleOf, endRot: END_ROT };
export default {
  id: 'cable_lateral_raise', name: 'Cable Lateral Raise', view: 'front',
  poses: { start, end },
  equipment: [
    { type: 'floor', from: -FLOOR_L, to: FLOOR_R },
    (lm, ctx) => { const ring = handleOf(lm['grip.l']).ring; return { type: 'cableColumn', base: [-COLUMN_X, 0, PULLEY_Z], pulley: { at: PULLEY }, to: ring, rest: restFor(ring, ctx) }; },
    lm => handleOf(lm['grip.l']).item,
    (lm, ctx) => (ctx.pose === 'mistake' ? cableTwin(handleOf(lm['grip.l']).ring) : null),
    (lm, ctx) => (ctx.pose === 'end' ? START_HANDLE : null),
  ],
  checks: [
    ...['heel.l', 'ball.l', 'heel.r', 'ball.r'].map(landmark => ({ landmark, plane: FLOOR, pose: 'all', tol: 0.5 })),
    // c7: the elbow level with the shoulder at the top (the upper arm horizontal), within 1 cm
    { landmark: 'elbow.l', plane: { point: [0, SH_Y, 0], normal: [0, 1, 0] }, pose: 'end', tol: 1 },
    // c6, c13: the elbow leads: above the hand at the top
    { landmark: 'elbow.l', above: { point: LE['grip.l'], normal: [0, 1, 0] }, pose: 'end' },
    // c19: the Mistake's elbow above the shoulder line
    { landmark: 'elbow.l', above: { point: [0, SH_Y, 0], normal: [0, 1, 0] }, pose: 'mistake' },
    // c2: the handle in the outside hand
    { landmark: 'grip.l', at: LS['grip.l'], pose: 'start', tol: 0.5 },
  ],
  startParts: ['arm.l', 'handle'],
  ghosts: { count: 3, parts: ['arm.l', 'handle'] },
  trace: { point: 'grip.l', trim: [10, 12] },
  datum: [{ y: 'shoulder.l', from: 'shoulder.l', to: 346 }],
  callouts: [
    { key: 'tight', text: 'Cable<br>tight', anchor: CABLE_MID, box: { left: 250, top: 226 }, cue: 'Step away from the machine so the cable is tight.' },
    { key: 'elbow', text: 'Elbow<br>leads', anchor: 'elbow.l', box: { left: 190, top: 60 }, cue: 'Raise your arm out to the side, elbow leading the hand.' },
    { key: 'height', text: 'Shoulder<br>height', anchor: { at: 'shoulder.l', off: [118, 0] }, box: { left: 272, top: 94 }, cue: 'Stop when your arm is parallel with the floor.' },
  ],
  tempo: [{ phase: 'Raise', s: 2, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Lower', s: 2, move: true }],
  mistake: {
    pose: mistakePose,
    guides: [],
    tells: [
      { key: 'above', text: 'Above<br>shoulder', anchor: { at: 'elbow.l', pose: 'mistake' }, box: { left: 200, top: 64 }, cue: 'The arm rises above shoulder height.' },
      { key: 'past', text: 'Beyond<br>90°', anchor: { at: 'grip.l', pose: 'mistake' }, box: { left: 284, top: 40 }, cue: 'The upper arm goes past level, beyond 90 degrees.' },
    ],
  },
  alt: 'Cable lateral raise, front view. Standing side-on to a cable column, a single handle from the low pulley in the outside hand, the cable across the front of the body, the arm rises out to the side, elbow slightly bent and leading, until the upper arm is level with the shoulder.',
};
