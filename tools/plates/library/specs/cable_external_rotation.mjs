// Cable external rotation (standing, one arm, single handle), FRONT view, figure facing the viewer. LIB-17 (LB7, mode H;
// census closest dumbbell_lateral_raise, closeness N, drawn by ref-src, so the clone source is upright_row, the engine
// front-view anchor: D-LIB17-CLONE; plan 1's named small-motion check: D-LIB17-ER).
// View: front (card plate.view = census view). The forearm sweeps out about the upper arm (c5, c6) and the drawn fault,
//  the elbow leaving the side (c9), moves in the image plane.
// Sources: research card docs/research/howto/cards/cable_external_rotation.json (research head 8d750bfe): callouts =
//  plate.checkpoints (c3/c9 Elbow at side, c10 Forearm level, c8 Turn only); Mistake = plate.mistake (c9, drawable false:
//  the top fault, swinging with momentum (c12), shows only as speed, so the plate draws the next fault on the same
//  list, the elbow flaring out); tempo = plate.tempo (c18, c19: up 2, down 2, pause 1, ACE's sourced second).
// Clone source: upright_row (#109 @ ff7c5c4f) for the standing front-view base (feet, soft knees, root solved from the
//  leg length), copied, never imported (D-LIB9-CLONE).
// Equipment: the vendor cableColumn (column, pulley, cable, stack) on the figure's right (the side nearer the machine,
//  c2), the pulley at the working elbow's height (c1); floor. The single handle drawn here from `poly` (D-LIB17-HANDLE:
//  the vendor vHandle is a two-grip handle). The cable runs from the pulley across the front of the stomach to the
//  handle (c6; D-LIB17-CABLE), drawn above the body layer and under the arm.
// Pose map (DESIGN.md section 9): identity. Start = plate.start: the far (left) upper arm hanging against the side,
//  elbow bent 90 (c3), forearm across the body (c4) and level (c10). End = plate.end: the forearm turned out until the
//  hand is outside the body line (c6), still level, the elbow still at the side (c3, c9). Only the left shoulder's
//  rotation changes between them (body.mjs:60, "rot + = external").
// Geometry decisions (confirmed by the engine report `angles` and `checks`):
//  Stance: upright_row's feet and soft knees (FOOT_X, KNEE_SOFT; the card gives no stance); trunk upright, still (c8).
//  Working arm: shoulder elevation 0 (the upper arm hangs against the side, c3), elbow 90 (c3), so the forearm is level
//   (c10). START_ROT: the internal turn that keeps the forearm's inner edge in front of the navel (the torso front)
//   with the fist past the midline (across the body, c4). END_ROT: the fist centre just outside the upper arm's outline
//   (ACE's end, c6; the notes).
//  Free (right) arm: hanging, as upright_row's start arms (elbow 2 deg).
//  Mistake (c9): only the working shoulder changes: abducted M_ABD, the elbow leaving the side as the handle turns.
//  Hidden start parts: the engine draws the start layer under the end torso, so the start forearm across the stomach
//   and the start handle are redrawn as dashed phantoms in the end layer (DRAWING-GUIDE.md 4; machine_chest_press.mjs:80-107).
// Unsourced numbers (SIZES below; lb7/sizes.json holds each with its basis): FOOT_X, KNEE_SOFT, START_ROT, END_ROT,
//  M_ABD, FREE_ELBOW, COLUMN_X, PULLEY_Z, HANDLE_GRIP, HANDLE_R, HANDLE_STRAP, FLOOR_L, FLOOR_R. The elbow 90 is c3's.
import { WINTER, REF, landmarksOf, normPose, resolve, fk, bodyShapes } from '../engine.mjs';

const H = 1.75, R = Math.PI / 180;
export const SIZES = Object.freeze({ FOOT_X: 0.18, KNEE_SOFT: 5, START_ROT: -55, END_ROT: 20, M_ABD: 20, FREE_ELBOW: 2, COLUMN_X: 0.70, PULLEY_Z: 0.25,
  HANDLE_GRIP: 0.13, HANDLE_R: 0.008, HANDLE_STRAP: 0.10, FLOOR_L: 1.05, FLOOR_R: 0.62 });
const { FOOT_X, KNEE_SOFT, START_ROT, END_ROT, M_ABD, FREE_ELBOW, COLUMN_X, PULLEY_Z, HANDLE_GRIP, HANDLE_R, HANDLE_STRAP, FLOOR_L, FLOOR_R } = SIZES;
const ELBOW = 90;   // c3 "bend your elbow to 90 degrees"

// Standing base (copied from upright_row.mjs:53-57): the root height solved from the soft-knee leg length.
const FOOT_Z = REF.mid * H;
const LEG = (() => { const a = WINTER.thigh * H, b = WINTER.shank * H, k = KNEE_SOFT * R; return Math.sqrt(a * a + b * b + 2 * a * b * Math.cos(k)); })();
const ROOT_Y = Math.sqrt(LEG * LEG - (FOOT_X - REF.hjcX * H) ** 2) + WINTER.ankleH * H;
const feet = { l: { at: [FOOT_X, 0, FOOT_Z], toe: [0.3, 0, 1] }, r: { at: [-FOOT_X, 0, FOOT_Z], toe: [-0.3, 0, 1] } };
const base = { root: { at: [0, ROOT_Y, 0], tilt: 0 }, trunk: 0, neck: 0, plant: feet };
const armAt = (rot, abd = 0) => ({ shoulder: { l: { elev: abd, plane: 0, rot }, r: { elev: 0, plane: 0, rot: 0 } }, elbow: { l: ELBOW, r: FREE_ELBOW } });
const start = { ...base, ...armAt(START_ROT) };
const end = { ...base, ...armAt(END_ROT) };
const via = [1 / 3, 2 / 3].map(t => ({ ...base, ...armAt(START_ROT + (END_ROT - START_ROT) * t) }));
const mistakePose = { shoulder: { l: { elev: M_ABD, plane: 0, rot: END_ROT }, r: { elev: 0, plane: 0, rot: 0 } } };

const LS = landmarksOf(start, H), LE = landmarksOf(end, H);
// Column on the figure's right (x-), the pulley on its inner face at the start elbow's height (c1).
const PULLEY = [-COLUMN_X + 0.17, LS['elbow.l'][1], PULLEY_Z];
// The single handle (D-LIB17-HANDLE): a vertical neutral grip HANDLE_GRIP long through the grip centre (the grip is not
// sourced, so the single handle's natural grip is drawn, card notes, LR-4), and a strap from both grip ends to the cable
// ring HANDLE_STRAP from the grip, toward the pulley. Both are `poly`, so the handle is drawn in the Mistake view when it
// moves (PQ-H9).
const unit = v => { const k = Math.hypot(...v); return v.map(x => x / k); };
export const handleOf = g => {
  const toward = unit(PULLEY.map((v, i) => v - g[i])), ring = g.map((v, i) => v + toward[i] * HANDLE_STRAP);
  const top = [g[0], g[1] + HANDLE_GRIP / 2, g[2]], bot = [g[0], g[1] - HANDLE_GRIP / 2, g[2]], w = HANDLE_R;
  return { ring, top, bot, items: [
    { type: 'poly', pts: [[top[0] - w, top[1], top[2]], [top[0] + w, top[1], top[2]], [bot[0] + w, bot[1], bot[2]], [bot[0] - w, bot[1], bot[2]]], cls: 'eq-solid', z: 'mid', part: 'handle' },
    { type: 'poly', pts: [top, ring, bot], cls: 'eq', z: 'center', part: 'handle' },
  ] };
};
const START_RING = handleOf(LS['grip.l']).ring;
// The stack in the Mistake stays where the end pose puts it: the cableColumn primitive lifts the stack by the cable
// length from the pulley to the ring less its start length (equipment.mjs:92), so in the Mistake the rest point is
// moved along the same line by the ring's extra length. Only the fault (the arm and the handle) changes there.
const dist = a => Math.hypot(...a.map((v, i) => v - PULLEY[i]));
const END_LIFT = dist(handleOf(LE['grip.l']).ring) - dist(START_RING);
const restFor = (ring, ctx) => {
  if (ctx.pose !== 'mistake') return START_RING;
  const k = (dist(ring) - END_LIFT) / dist(START_RING);
  return PULLEY.map((v, i) => v + (START_RING[i] - v) * k);
};

// Start phantoms (dashed, end layer, z front): the outline of the start working arm's union (shoulder cap, upper arm,
// elbow cap, forearm, fist), as machine_chest_press.mjs:88-107 does in side view, here in the front view; and the
// start handle's outline.
const insidePoly = (p, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
  const [xi, yi] = poly[i], [xj, yj] = poly[j];
  if ((yi > p[1]) !== (yj > p[1]) && p[0] < (xj - xi) * (p[1] - yi) / (yj - yi) + xi) c = !c; } return c; };
const ARM_KEYS = ['upper.l', 'elbowcap.l', 'fore.l', 'fist.l'];
export const START_ARM = (() => {
  const body = { height: H }, sk = fk(resolve(normPose(start, body), body).q, body);
  const cam = { view: 'front', pxm: 1, P: w => [w[0], -w[1]] };
  const polys = bodyShapes(sk, cam).filter(sh => ARM_KEYS.includes(sh.key)).map(sh => sh.poly);
  const runs = [];
  polys.forEach((poly, k) => {
    let run = [];
    const flush = () => { if (run.length > 1) runs.push(run); run = []; };
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], b = poly[(i + 1) % poly.length], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.002));
      for (let j = 0; j < n; j++) {
        const p = [a[0] + (b[0] - a[0]) * j / n, a[1] + (b[1] - a[1]) * j / n];
        if (polys.some((q, m) => m !== k && insidePoly(p, q))) flush(); else run.push(p);
      }
    }
    flush();
  });
  return runs.map(r => ({ type: 'line', pts: r.map(p => [p[0], -p[1], LS['grip.l'][2]]), cls: 'eq-line m-line', z: 'front', part: 'startArm' }));
})();
const START_HANDLE = handleOf(LS['grip.l']).items.map(it => ({ type: 'line', pts: [...it.pts, it.pts[0]], cls: 'eq-line m-line', z: 'front', part: 'startHandle' }));

// The cable's Mistake twin (DRAWING-GUIDE.md 4; eq/rope.mjs's pattern): the column's cable is a line, which the
// engine never redraws in the Mistake view, so in the Mistake pose a thin `poly` runs from the pulley's rim to the
// ring, drawn there with the moved handle.
const CABLE_W = 0.004;
const cableTwin = ring => {
  const u = unit(ring.map((v, i) => v - PULLEY[i])), a = PULLEY.map((v, i) => v + u[i] * 0.045), n = unit([-u[1], u[0], 0]).map(v => v * CABLE_W / 2);
  return { type: 'poly', pts: [a.map((v, i) => v + n[i]), ring.map((v, i) => v + n[i]), ring.map((v, i) => v - n[i]), a.map((v, i) => v - n[i])], cls: 'eq-solid', z: 'center', part: 'cable' };
};
const FLOOR = { point: [0, 0, 0], normal: [0, 1, 0] };
const SIDE_X = LS['elbow.l'][0];

export const CER = { pulley: PULLEY, startRing: START_RING, handleOf };
export default {
  id: 'cable_external_rotation', name: 'Cable External Rotation', view: 'front',
  poses: { start, via, end },
  equipment: [
    { type: 'floor', from: -FLOOR_L, to: FLOOR_R },
    (lm, ctx) => { const ring = handleOf(lm['grip.l']).ring; return { type: 'cableColumn', base: [-COLUMN_X, 0, PULLEY_Z], pulley: { at: PULLEY }, to: ring, rest: restFor(ring, ctx) }; },
    lm => handleOf(lm['grip.l']).items[0],
    lm => handleOf(lm['grip.l']).items[1],
    (lm, ctx) => (ctx.pose === 'mistake' ? cableTwin(handleOf(lm['grip.l']).ring) : null),
    (lm, ctx) => (ctx.pose === 'end' ? [...START_ARM, ...START_HANDLE] : null),
  ],
  checks: [
    ...['heel.l', 'ball.l', 'heel.r', 'ball.r'].map(landmark => ({ landmark, plane: FLOOR, pose: 'all', tol: 0.5 })),
    // c3, c9: the elbow at the side, straight under the shoulder (start and end)
    { landmark: 'elbow.l', plane: { point: [SIDE_X, 0, 0], normal: [1, 0, 0] }, pose: 'start', tol: 0.5 },
    { landmark: 'elbow.l', plane: { point: [SIDE_X, 0, 0], normal: [1, 0, 0] }, pose: 'end', tol: 0.5 },
    // c10: the forearm level: the grip at the elbow's height (start and end)
    { landmark: 'grip.l', plane: { point: LS['elbow.l'], normal: [0, 1, 0] }, pose: 'start', tol: 0.5 },
    { landmark: 'grip.l', plane: { point: LS['elbow.l'], normal: [0, 1, 0] }, pose: 'end', tol: 0.5 },
    // c1, c2: the handle in the far hand
    { landmark: 'grip.l', at: LS['grip.l'], pose: 'start', tol: 0.5 },
    { landmark: 'wrist.l', at: LS['wrist.l'], pose: 'start', tol: 0.5 },                         // c2 fact: the hand on the handle
  ],
  startParts: ['arm.l', 'handle'],
  ghosts: { count: 2, parts: ['arm.l', 'handle'] },
  trace: { point: 'grip.l', trim: [10, 12] },
  callouts: [
    { key: 'elbow', text: 'Elbow<br>at side', anchor: 'elbow.l', box: { left: 236, top: 222 }, cue: 'Keep your upper arm against your side, elbow bent 90 degrees.' },
    { key: 'level', text: 'Forearm<br>level', anchor: { along: ['elbow.l', 'wrist.l'], t: 0.6, off: [0, -6] }, box: { left: 252, top: 148 }, cue: 'Keep your forearm parallel to the ground as it turns.' },
    { key: 'turn', text: 'Turn only', anchor: 'shoulderTop.l', box: { left: 240, top: 88 }, cue: 'Turn from the shoulder only and keep your torso still.' },
  ],
  tempo: [{ phase: 'Turn out', s: 2, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Return', s: 2, move: true }],
  mistake: {
    pose: mistakePose,
    guides: [],
    tells: [
      { key: 'flare', text: 'Elbow<br>flares out', anchor: { at: 'elbow.l', pose: 'mistake' }, cue: 'The elbow flares out, away from your side, as the handle turns.' },
      { key: 'side', text: 'Off<br>the side', anchor: { along: ['mistake:shoulder.l', 'mistake:elbow.l'], t: 0.6, pose: 'mistake' }, cue: 'The upper arm leaves your side.' },
    ],
  },
  pilot: { drawableFault: 'Top fault: swinging with momentum (c12), seen only as speed; the plate draws the next fault on the same list, the elbow flaring out (c9).' },
  alt: 'Cable external rotation, front view. Standing side-on to a cable column, the upper arm against the side and the elbow bent 90 degrees, the forearm turns the handle out from across the body until the hand is outside the body line.',
};
