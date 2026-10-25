// Cable rear delt fly (standing, two high pulleys, crossed cables, a single handle in each hand), FRONT view, figure
// facing the viewer. LIB-17 (LB7, mode H; census closest dumbbell_lateral_raise (N), drawn by ref-src, so the clone
// source is upright_row, the engine front-view anchor: D-LIB17-CLONE). Held: D-LIB17-SECS (the card has no tempo
// seconds), so it is in no rows file and carries no `tempo`.
// View: front (card plate.view = census view). The arms opening from crossed in front to about parallel with the body
//  (c4, c6, c7) and the drawn fault, the shoulders not kept down and back (c5), read from the front; the cables run
//  crossed in front of the body (c2, c4; D-LIB17-CABLE).
// Sources: research card docs/research/howto/cards/cable_rear_delt_fly.json (research head 8d750bfe): callouts =
//  plate.checkpoints (c5 Shoulders down, c6 Soft elbows, c7 Arms to body); Mistake = plate.mistake (c5: the shoulders
//  not kept rolled back and down as the arms open, drawable false: the top fault, the swing with the lower back
//  overextending, c9, shows only from the side, so F7 stays raised); tempo null (c9: slow and controlled, no seconds).
// Clone source: upright_row (#109 @ ff7c5c4f) for the standing front-view base, copied, never imported (D-LIB9-CLONE),
//  as cable_lateral_raise's; the cable parts copy cable_lateral_raise's (the 8's cable code, D-LIB17-CLONE).
// Equipment: two vendor cableColumns (column, high pulley, cable, stack), one either side (c1, c3); each high pulley on
//  its column's inner face; the single handles drawn here from `poly` (D-LIB17-HANDLE), as cable_lateral_raise's. The
//  left cable's handle is in the right hand and the right cable's in the left (c2), so the cables cross in front.
// Pose map (DESIGN.md section 9): identity. Start = plate.start: arms straight ahead, handles close together, the cables
//  crossing at about eye level (c4), elbows slightly bent (c4), shoulders down and back (c5). End = plate.end: arms
//  opened back and slightly down to about parallel with the body (c6, c7), the same slight bend (c6).
// Geometry decisions (confirmed by the engine report `angles` and `checks`):
//  Stance: upright_row's feet and soft knees (FOOT_X, KNEE_SOFT; the card gives no stance); trunk upright (c3).
//  Arms: both elbows bent ELBOW_BEND in every pose (c4 "not locked", c6 "slight bend"; D-LIB16-LOCK's basis,
//   machine_chest_press.mjs:45), the bend in the plane the arms open in (c6: "a fixed bend ... while the arms open"):
//   START_ROT turns it level, toward the midline, with the arms ahead; END_ROT keeps it level, forward, with the arms
//   out. Start: shoulder flexion straight ahead (plane 90); the elevation START_ELEV is SOLVED (bracket 80-130) so the
//   two cables cross at the ear's height (c4 "about eye level"; the engine has no eye landmark, the ear is level with
//   it). End: elevation END_ELEV in the frontal plane (c6 "slightly downward", c7 "about parallel to the body").
//  Mistake (c5): only the shoulder girdles change: both scapulae M_ELEV cm up and M_PRO cm forward (pull_up.mjs:36's
//   +-3 cm, reversed).
//  Hidden start parts: the start arms and handles lie in front of the chest, under the end torso fill, and the start
//   layer drops moving equipment (DRAWING-GUIDE.md 4), so both are redrawn as dashed phantoms in the end layer.
// Unsourced numbers (SIZES below; lb7/sizes.json holds each with its basis): FOOT_X, KNEE_SOFT, ELBOW_BEND, START_ROT,
//  END_ROT, END_ELEV, M_ELEV, M_PRO, COLUMN_X, COLUMN_H, PULLEY_Y, HANDLE_GRIP, HANDLE_STRAP, FLOOR_L, FLOOR_R.
import { WINTER, REF, landmarksOf, normPose, resolve, fk, bodyShapes } from '../engine.mjs';

const H = 1.75, R = Math.PI / 180;
export const SIZES = Object.freeze({ FOOT_X: 0.18, KNEE_SOFT: 5, ELBOW_BEND: 18, START_ROT: -90, END_ROT: 0, END_ELEV: 80, M_ELEV: 3, M_PRO: 3,
  COLUMN_X: 1.0, COLUMN_H: 2.1, PULLEY_Y: 1.95, HANDLE_GRIP: 0.13, HANDLE_STRAP: 0.10, FLOOR_L: 1.25, FLOOR_R: 1.25 });
const { FOOT_X, KNEE_SOFT, ELBOW_BEND, START_ROT, END_ROT, END_ELEV, M_ELEV, M_PRO, COLUMN_X, COLUMN_H, PULLEY_Y, HANDLE_GRIP, HANDLE_STRAP, FLOOR_L, FLOOR_R } = SIZES;

// Bracketed root finder (Illinois regula falsi, copied from one_arm_dumbbell_row, #274): throws when f(a) and f(b) have
// the same sign (D-LIB9-CLONE b).
export const solve = (f, a, b) => {
  let fa = f(a), fb = f(b), side = 0;
  if (fa * fb > 0) throw new Error(`cable_rear_delt_fly: no solution in [${a}, ${b}]`);
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
const armsAt = sh => ({ shoulder: { l: sh, r: sh }, elbow: { l: ELBOW_BEND, r: ELBOW_BEND } });

// The columns (c1): one either side, each high pulley on its inner face. c2: the right column's cable (x-) goes to the
// left hand (x+) and the left column's to the right hand.
const PULLEY = { l: [-(COLUMN_X - 0.17), PULLEY_Y, 0], r: [COLUMN_X - 0.17, PULLEY_Y, 0] };
const COLUMN = { l: [-COLUMN_X, 0, 0], r: [COLUMN_X, 0, 0] };
// The single handle (D-LIB17-HANDLE, cable_lateral_raise's): the grip bar runs front to back through the fist, the strap
// from both grip ends to the cable ring HANDLE_STRAP from the grip, toward its pulley. A `poly` (PQ-H9).
const unit = v => { const k = Math.hypot(...v); return v.map(x => x / k); };
export const handleOf = (g, side) => {
  const toward = unit(PULLEY[side].map((v, i) => v - g[i])), ring = g.map((v, i) => v + toward[i] * HANDLE_STRAP);
  const front = [g[0], g[1], g[2] + HANDLE_GRIP / 2], back = [g[0], g[1], g[2] - HANDLE_GRIP / 2];
  return { ring, item: { type: 'poly', pts: [front, ring, back], cls: 'eq', z: 'center', part: 'handle' } };
};
// The front-view height at x = 0 of the line from a pulley to a ring (where the two cables cross, by symmetry).
const crossY = (ring, side) => { const p = PULLEY[side], t = (0 - p[0]) / (ring[0] - p[0]); return p[1] + (ring[1] - p[1]) * t; };
const startAt = elev => ({ ...base, ...armsAt({ elev, plane: 90, rot: START_ROT }) });
const EAR_Y = landmarksOf(startAt(90), H).ear[1];
export const START_ELEV = solve(e => crossY(handleOf(landmarksOf(startAt(e), H)['grip.l'], 'l').ring, 'l') - EAR_Y, 80, 130);
const start = startAt(START_ELEV);
const end = { ...base, ...armsAt({ elev: END_ELEV, plane: 0, rot: END_ROT }) };
const mistakePose = { scap: { elev: M_ELEV, pro: M_PRO } };

const LS = landmarksOf(start, H), LE = landmarksOf(end, H), LM = landmarksOf({ ...end, ...mistakePose }, H);
const START_RING = { l: handleOf(LS['grip.l'], 'l').ring, r: handleOf(LS['grip.r'], 'r').ring };
// The stack in the Mistake stays where the end pose puts it (cable_lateral_raise's restFor): only the fault changes.
const dist = (a, side) => Math.hypot(...a.map((v, i) => v - PULLEY[side][i]));
const END_LIFT = { l: dist(handleOf(LE['grip.l'], 'l').ring, 'l') - dist(START_RING.l, 'l'), r: dist(handleOf(LE['grip.r'], 'r').ring, 'r') - dist(START_RING.r, 'r') };
const restFor = (ring, side, ctx) => {
  if (ctx.pose !== 'mistake') return START_RING[side];
  const k = (dist(ring, side) - END_LIFT[side]) / dist(START_RING[side], side);
  return PULLEY[side].map((v, i) => v + (START_RING[side][i] - v) * k);
};
const columnFor = side => (lm, ctx) => {
  const ring = handleOf(lm[`grip.${side}`], side).ring;
  return { type: 'cableColumn', base: COLUMN[side], height: COLUMN_H, pulley: { at: PULLEY[side] }, to: ring, rest: restFor(ring, side, ctx) };
};
// The start arms and handles as dashed phantoms (Q2 (c); BULK GO carry list): the outline of each start arm's union
// (upper arm, elbow cap, forearm, fist), cable_lateral_raise's START_ARM method, and the start handles.
const insidePoly = (p, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
  const [xi, yi] = poly[i], [xj, yj] = poly[j];
  if ((yi > p[1]) !== (yj > p[1]) && p[0] < (xj - xi) * (p[1] - yi) / (yj - yi) + xi) c = !c; } return c; };
export const START_ARMS = (() => {
  const body = { height: H }, sk = fk(resolve(normPose(start, body), body).q, body), cam = { view: 'front', pxm: 1, P: w => [w[0], -w[1]] }, runs = [];
  for (const side of ['l', 'r']) {
    const polys = bodyShapes(sk, cam).filter(sh => [`upper.${side}`, `elbowcap.${side}`, `fore.${side}`, `fist.${side}`].includes(sh.key)).map(sh => sh.poly);
    polys.forEach((poly, k) => {
      let run = [];
      const flush = () => { if (run.length > 1) runs.push([side, run]); run = []; };
      for (let i = 0; i < poly.length; i++) {
        const a = poly[i], b = poly[(i + 1) % poly.length], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.002));
        for (let j = 0; j < n; j++) { const p = [a[0] + (b[0] - a[0]) * j / n, a[1] + (b[1] - a[1]) * j / n]; if (polys.some((q, m) => m !== k && insidePoly(p, q))) flush(); else run.push(p); }
      }
      flush();
    });
  }
  return runs.map(([side, r]) => ({ type: 'line', pts: r.map(p => [p[0], -p[1], LS[`grip.${side}`][2]]), cls: 'eq-line m-line', z: 'front', part: 'startArm' }));
})();
const START_HANDLES = ['l', 'r'].map(side => { const it = handleOf(LS[`grip.${side}`], side).item; return { type: 'line', pts: [...it.pts, it.pts[0]], cls: 'eq-line m-line', z: 'front', part: 'startHandle' }; });
// The cables in the Mistake (slice look #299 6348157337 item 1): dashed Mistake guides, unbroken from each pulley's rim to
// its Mistake handle's ring.
export const M_CABLES = ['l', 'r'].map(side => { const ring = handleOf(LM[`grip.${side}`], side).ring, u = unit(ring.map((v, i) => v - PULLEY[side][i])); return [PULLEY[side].map((v, i) => v + u[i] * 0.045), ring]; });
const FLOOR = { point: [0, 0, 0], normal: [0, 1, 0] };

export const CRDF = { pulley: PULLEY, handleOf, crossY, earY: EAR_Y, startElev: START_ELEV };
export default {
  id: 'cable_rear_delt_fly', name: 'Cable Rear Delt Fly', view: 'front',
  poses: { start, end },
  equipment: [
    { type: 'floor', from: -FLOOR_L, to: FLOOR_R },
    columnFor('l'), columnFor('r'),
    lm => handleOf(lm['grip.l'], 'l').item,
    lm => handleOf(lm['grip.r'], 'r').item,
    (lm, ctx) => (ctx.pose === 'end' ? [...START_ARMS, ...START_HANDLES] : null),
  ],
  checks: [
    ...['heel.l', 'ball.l', 'heel.r', 'ball.r'].map(landmark => ({ landmark, plane: FLOOR, pose: 'all', tol: 0.5 })),
    // c2: each hand on its handle at the start (the plate facts: contact wrist.l, wrist.r)
    { landmark: 'grip.l', at: LS['grip.l'], pose: 'start', tol: 0.5 },
    { landmark: 'wrist.l', at: LS['wrist.l'], pose: 'start', tol: 0.5 },
    { landmark: 'grip.r', at: LS['grip.r'], pose: 'start', tol: 0.5 },
    { landmark: 'wrist.r', at: LS['wrist.r'], pose: 'start', tol: 0.5 },
    // c6: the arms end slightly below the shoulder line
    { landmark: 'elbow.l', above: { point: LE['shoulder.l'], normal: [0, -1, 0] }, pose: 'end' },
  ],
  startParts: ['arm.l', 'arm.r', 'handle'],
  ghosts: { count: 3, parts: ['arm.l', 'arm.r', 'handle'] },
  trace: { point: 'grip.l', trim: [10, 12] },
  callouts: [
    { key: 'down', text: 'Shoulders<br>down', anchor: { along: ['shoulder.l', 'elbow.l'], t: 0.25, off: [0, 8] }, box: { left: 218, top: 240 }, cue: 'Keep your shoulders rolled back and down for every rep.' },
    { key: 'soft', text: 'Soft<br>elbows', anchor: { at: 'elbow.l', off: [0, 6] }, box: { left: 240, top: 170 }, cue: 'Keep the same slight elbow bend from start to finish.' },
    { key: 'body', text: 'Arms<br>to body', anchor: { along: ['shoulder.r', 'elbow.r'], t: 0.7, off: [0, 7] }, box: { left: 70, top: 200 }, cue: 'Pull back until your arms are about parallel to your body.' },
  ],
  mistake: {
    pose: mistakePose,
    guides: M_CABLES.map(pts => ({ kind: 'dashed', pts })),
    tells: [
      { key: 'roll', text: 'Not rolled<br>back', anchor: { along: ['mistake:shoulder.l', 'mistake:elbow.l'], t: 0.25, off: [0, 8], pose: 'mistake' }, box: { left: 214, top: 168 }, cue: 'The shoulders are not kept rolled back as the arms open.' },
      { key: 'up', text: 'Shoulders<br>not down', anchor: { along: ['mistake:shoulder.r', 'mistake:elbow.r'], t: 0.25, off: [0, 8], pose: 'mistake' }, box: { left: 62, top: 230 }, cue: 'The shoulders rise instead of staying down.' },
    ],
  },
  pilot: { drawableFault: 'Top fault: swinging with the lower back overextending (c9), seen only from the side; the plate draws the next fault on the same list, the shoulders not kept rolled back and down (c5).' },
  alt: 'Cable rear delt fly, front view. Standing between two high pulleys, the cables crossed in front, each hand holding the opposite cable, the arms open from straight ahead out and slightly down until about parallel with the body, elbows slightly bent, shoulders down.',
};
