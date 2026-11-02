// Pallof press (cable, single handle, standing side-on to the column), side view, figure faces screen LEFT (the
//  column on the figure's right, behind it). LIB-21 (LB9, H; bulk).
// View: side (card plate.view = census): the arms pressing straight out from the chest (c5, c6), the back tall without
//  an arch (c5, c8) and the soft knees (c2) are sagittal. The rotation fault (c7) cannot show from this view.
// Sides (D-LIB21-SIDES, S4): c1 (ACE) puts the pulley "directly to the right of the body". The engine's figure faces +z
//  and the side view's depth axis is x, so the column stands at world x negative and the cable runs along the depth
//  axis. `facing: 'left'` makes the near side the figure's LEFT, so the column on the right is the far side, behind the
//  figure, as a camera on the lifter's left sees it (facing right would put the column between the camera and the
//  body). The cable is seen end-on at the start and foreshortened under the arms at the end (S4: see the hand-off).
// Sources: research card docs/research/howto/cards/pallof_press.json: c1 a single handle at about chest height,
//  standing side-on, the cable directly to the right of the body; c2 feet hip-width, hips straight, knees slightly
//  bent, chest up; c3 one handle in both hands, fingers laced, elbows in by the sides, hands at the chest ("hold the
//  band right at your chest"); c4 walk out until the cable pulls; c5 back straight and tall, press the handle straight
//  out in front of the chest to full arm extension; c6 the hands in a straight line; c8 over-arching the lower back
//  (the Mistake), arms fully forward at chest height; c9 overarching the lower back loses the benefit; c10 chest up,
//  shoulders down, shoulder blades not tracking forward; c12, c13 the tempo (lb9/tempo.json: Press 1, Hold 2, Return 3).
// Clone (D-LIB21-CLONE; copied, never imported): seated_cable_row (the 8: cableColumn, the moving handle, the 1 mm start
//  twin, the trace trim); cable_crunch (this branch: the column with the twin, the Mistake cable as one dashed guide,
//  the Winter centre of mass, SIZES and info); upright_row (pilot A @ dcac4a38: the standing stance, the root height
//  from the soft knee, heel and ball on the floor); ab_wheel_rollout (this branch: the hidden start parts redrawn as
//  dashed phantoms, the short in-figure fault arrow).
// Geometry (checked by the report's contacts and checks, and by info):
//  Stance (c2): feet hip-width (each mid-sole under its hip joint, toes forward), hips straight (pelvis tilt 0, hip
//   flexion 0: each thigh plumb), knees KNEE short of straight (the soft knee), each shank leaning forward over a flat
//   foot; the root height closes the leg (no solve). The soles are `plant` targets on the floor in every pose, the root
//   never moves, so the knee is KNEE in every pose, ghost and the Mistake.
//  Start (c2, c3): spine and neck neutral (trunk 0, neck 0: chest up, tall), shoulders neutral (scap 0); the two fists
//   side by side at the midline (grip centres one fist radius each side of it: the hands laced on one handle), at the
//   chest landmark's height, each fist START_GAP in front of the chest surface (c3 "right at your chest"); elbows in by
//   the sides (IK pole down and back).
//  End (c5, c6, c8, c10): the handle pressed straight out at the same height (c8 "at chest height"): the grips at
//   full arm length less 0.1 mm (upright_row's ARM), the arms straight (c5 "full arm extension"); trunk, neck and scap
//   unchanged (c5 "back straight and tall", c10 "shoulders down"). The hands travel on a straight line (c6): the
//   engine blends the reach targets and re-solves the arms.
//  Mistake (c8, c9): the lower back over-arches while pressing: lumbar extension M_ARCH (trunk), the pelvis, legs and
//   feet unchanged; the arms stay straight at full length and the handle at chest height (c8 "at chest height"), so
//   the handle comes back with the shoulders.
//  Column (c1, c4): the vendor cableColumn and its stack, default 2.1 m frame and 34 cm width; its pulley at the start
//   chest landmark's height and depth (c1 "about chest height", "directly to the right of the body") and COL_X out to
//   the figure's right (c4 "walk out ... until you feel the pull"). Frame and stack static in every pose
//   (D-LIB21-IMPLEMENT: "The static column, stack and pad stay at one place in every pose"); only the cable moves.
//  Handle (c1, c3): one single handle, a `poly` (it moves: PQ-H9): a grip bar HANDLE_L long and HANDLE_D thick held
//   upright in the laced fists at the grips' midpoint, where the cable meets it.
//  Balance (D-LIB21-BALANCE, c2, c4): the Winter (2009) centre of mass over the feet (heel to toe tip) in every pose;
//   info gives the numbers. The cable's pull at the end has a backward part toward the pulley (info.cableBack).
//  Trace (D-LIB21-TRACE): the handle pressed straight out (c5, c6), the grips' midpoint; trim [10, 12]
//   (seated_cable_row.mjs:82, the clone source, D-LIB18-TRIM).
// Camera: hanging_leg_raise's fit margins (cable_crunch's): the 2.1 m column sets the height.
// Unsourced numbers (SIZES; lb9/sizes.json holds each with its basis): KNEE, M_ARCH, START_GAP, COL_X, HANDLE_L, HANDLE_D.
import { landmarksOf, RADII, WINTER, REF, bodyShapes, fk, resolve, normPose } from '../engine.mjs';

const H = 1.75, R = Math.PI / 180, BODY = { height: H };
export const SIZES = Object.freeze({ KNEE: 15, M_ARCH: -12, START_GAP: 0.01, COL_X: 0.9144, HANDLE_L: 0.12, HANDLE_D: 0.03 });
const { KNEE, M_ARCH, START_GAP, COL_X, HANDLE_L, HANDLE_D } = SIZES;
const COL_W = 0.34, PULLEY_R = 0.045;                    // cableColumn's own defaults (vendor/engine/equipment.mjs:85, :91)
const TWIN = [0, 0.001, 0];

const sub = (a, b) => a.map((v, i) => v - b[i]), add = (a, b) => a.map((v, i) => v + b[i]);
const len = a => Math.hypot(...a), mid = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);

/** Winter (2009) whole-body centre of mass on the drawn landmarks (bear_crawl.mjs @ a9c64e11, as cable_crunch). */
export function com(lm) {
  let m = 0; const c = [0, 0, 0];
  const seg = (w, p) => { m += w; for (let i = 0; i < 3; i++) c[i] += w * p[i]; };
  seg(0.081, lm.ear); seg(0.497, mid(lm.shoulders, lm.hips, 0.5));
  for (const s of ['l', 'r']) {
    seg(0.028, mid(lm[`shoulder.${s}`], lm[`elbow.${s}`], 0.436)); seg(0.016, mid(lm[`elbow.${s}`], lm[`wrist.${s}`], 0.430)); seg(0.006, lm[`grip.${s}`]);
    seg(0.100, mid(lm[`hip.${s}`], lm[`knee.${s}`], 0.433)); seg(0.0465, mid(lm[`knee.${s}`], lm[`ankle.${s}`], 0.433)); seg(0.0145, mid(lm[`heel.${s}`], lm[`toe.${s}`], 0.5));
  }
  return c.map(v => v / m);
}

// ---- stance (c2): thighs plumb, knees KNEE, shanks forward over flat feet; the root height closes the leg ----
const T_LEN = WINTER.thigh * H, S_LEN = WINTER.shank * H;
const ROOT_Y = T_LEN + S_LEN * Math.cos(KNEE * R) + WINTER.ankleH * H;
const legsAt = { root: { at: [0, ROOT_Y, 0], tilt: 0 }, trunk: 0, neck: 0, hip: 0, knee: KNEE, ankle: KNEE };
const L0 = landmarksOf(legsAt, H);
const sole = s => ({ at: [L0[`sole.${s}`][0], 0, L0[`sole.${s}`][2]], normal: [0, 1, 0], toe: [0, 0, 1], ref: 'mid' });
const feet = { l: sole('l'), r: sole('r') };
const base = { root: { at: [0, ROOT_Y, 0], tilt: 0 }, trunk: 0, neck: 0, plant: feet };

// ---- start (c3): the laced fists at the chest, elbows in by the sides ----
const GX = RADII.fist * H;                               // fists side by side: grip centres one fist radius off the midline
const CHEST = L0.chest;                                   // the start chest landmark (the trunk is the same in start and end)
const GY = CHEST[1];                                      // c1, c8: the handle at chest height
const Z0 = CHEST[2] + RADII.fist * H + START_GAP;         // each fist START_GAP in front of the chest surface
const grip = (z, pole) => ({ l: { at: [GX, GY, z], pole: [pole[0], pole[1], pole[2]] }, r: { at: [-GX, GY, z], pole: [-pole[0], pole[1], pole[2]] } });
const POLE_S = [0.25, -1, -0.35], POLE_E = [0.25, -1, 0];
const start = { ...base, reach: grip(Z0, POLE_S) };

// ---- end (c5, c6, c8): the handle straight out at chest height, arms at full length ----
const ARM = (WINTER.upperArm + WINTER.forearm + REF.gripOff) * H - 0.0001;   // upright_row's ARM
const SH = L0['shoulder.l'];
const Z1 = SH[2] + Math.sqrt(ARM * ARM - (SH[0] - GX) ** 2 - (SH[1] - GY) ** 2);
const end = { ...base, reach: grip(Z1, POLE_E) };

// ---- Mistake (c8, c9): lumbar extension M_ARCH while the handle stays pressed out at chest height ----
const SHM = landmarksOf({ ...base, trunk: M_ARCH }, H)['shoulder.l'];
const ZM = SHM[2] + Math.sqrt(ARM * ARM - (SHM[0] - GX) ** 2 - (SHM[1] - GY) ** 2);
const mistake = { ...base, trunk: M_ARCH, reach: grip(ZM, POLE_E) };

const LS = landmarksOf(start, H), LE = landmarksOf(end, H), LM = landmarksOf(mistake, H);

// ---- equipment: the column (c1, c4) and the single handle (c3) ----
const PULLEY = [-COL_X, CHEST[1], CHEST[2]];
const COL_BASE = [-COL_X - COL_W / 2, 0, CHEST[2]];
const ringOf = lm => lm.grips;                             // the cable meets the handle at its centre
const column = to => ({ type: 'cableColumn', base: COL_BASE, pulley: { at: PULLEY, r: PULLEY_R }, to, wrap: 1, part: 'column' });
// The grip bar upright through the laced fists (a box in the y-z plane at the grips' midpoint).
const handle = lm => { const g = lm.grips, hl = HANDLE_L / 2, hd = HANDLE_D / 2;
  return { type: 'poly', pts: [[g[0], g[1] - hl, g[2] - hd], [g[0], g[1] - hl, g[2] + hd], [g[0], g[1] + hl, g[2] + hd], [g[0], g[1] + hl, g[2] - hd]], cls: 'eq-solid', z: 'mid', part: 'handle' }; };
// The engine compares the start items with themselves (plate.mjs sE), so a moving handle or cable never draws at the
// start; a 1 mm twin with the same keys (drawn nowhere) makes them count as moving (seated_cable_row.mjs's pattern).
const shifted = lm => ({ ...lm, grips: add(lm.grips, TWIN) });
const withTwin = fn => (lm, ctx) => { const a = fn(lm, ctx); return ctx.pose === 'start' && a ? [a, fn(shifted(lm), ctx)] : a; };

// The Mistake's cable as one dashed mistake guide (cable_crunch's R7): the pulley's lifter-side edge to the ring.
const MIS_CABLE = [add(PULLEY, [PULLEY_R, 0, 0]), ringOf(LM)];

// ---- start phantoms (Q2 (c); D-LIB21-DRAW): the start near arm lies on the trunk, which the end layer draws over it ----
const probe = { view: 'side', near: 'l', pxm: 1000, P: w => [w[2] * 1000, -w[1] * 1000] };
const shapesOf = pose => bodyShapes(fk(resolve(normPose(pose, BODY), BODY).q, BODY), probe);
const insidePoly = (p, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
  const [xi, yi] = poly[i], [xj, yj] = poly[j];
  if ((yi > p[1]) !== (yj > p[1]) && p[0] < (xj - xi) * (p[1] - yi) / (yj - yi) + xi) c = !c; } return c; };
const dense = (P, step = 2) => P.flatMap((a, i) => { const b = P[(i + 1) % P.length], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / step)); return Array.from({ length: n }, (_, k) => [a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]); });
const hiddenRuns = (outlines, cover) => outlines.flatMap(P => {
  const pts = dense(P), vis = pts.map(p => !cover.some(c => insidePoly(p, c))), n = pts.length, i0 = vis.indexOf(true), runs = [];
  if (i0 < 0) return [pts];
  let run = [];
  for (let k = 1; k <= n; k++) { const i = (i0 + k) % n; if (!vis[i]) run.push(pts[i]); else { if (run.length > 2) runs.push(run); run = []; } }
  if (run.length > 2) runs.push(run);
  return runs;
});
export const START_HIDDEN = (() => {
  const arm = shapesOf(start).filter(s => /^(upper|elbowcap|fore|fist)\.l$/.test(s.key)).map(s => s.poly);
  const cover = shapesOf(end).filter(s => !/\.l$/.test(s.key) || !/^(upper|elbowcap|fore|fist|shcap)/.test(s.key)).map(s => s.poly);
  return hiddenRuns(arm, cover).map(r => r.map(([x, y]) => [GX, -y / 1000, x / 1000]));
})();

const FLOOR = { point: [0, 0, 0], normal: [0, 1, 0] };
export default {
  id: 'pallof_press', name: 'Pallof Press', view: 'side', facing: 'left',
  camera: { fit: { left: 14, right: 14, top: 22, bottom: 12 } },   // hanging_leg_raise's margins
  poses: { start, end },
  equipment: [
    { type: 'floor', from: L0['heel.r'][2] - 0.35, to: Z1 + 0.35 },
    withTwin(lm => column(ringOf(lm))),   // the frame and stack static (D-LIB21-IMPLEMENT); the cable moves
    withTwin(handle),
    ...START_HIDDEN.map(pts => ({ type: 'line', pts, cls: 'eq-line m-line', z: 'front', part: 'startPhantom' })),
  ],
  checks: [
    ...['wrist.l', 'wrist.r'].map(landmark => ({ landmark, at: LS[landmark], pose: 'start', tol: 0.5 })),   // c3 fact: the hands on the handle at the chest
    ...['sole.l', 'sole.r'].map(landmark => ({ landmark, at: LS[landmark], pose: 'start', tol: 0.5 })),     // c2 fact: feet hip-width on the floor
    ...['sole.l', 'sole.r'].map(landmark => ({ landmark, at: LS[landmark], pose: 'all', tol: 0.5 })),       // feet planted throughout
    ...['heel.l', 'heel.r', 'ball.l', 'ball.r'].map(landmark => ({ landmark, plane: FLOOR, pose: 'all', tol: 0.5 })),   // soles flat on the floor
    ...['toe.l', 'toe.r'].map(landmark => ({ landmark, above: FLOOR, pose: 'all', tol: 0 })),
  ],
  ghosts: { count: 2, parts: ['arm.l', 'handle'] },
  trace: { point: 'grips', trim: [10, 12] },
  // Boxes in the open space, outside the arms' swept band: the arm label above the near forearm (its top edge), the
  // back labels behind the figure, each leader meeting its part from the open side.
  callouts: [
    { key: 'press', text: 'Arms<br>straight out', anchor: { along: ['elbow.l', 'wrist.l'], t: 0.5, off: [0, -6] }, box: { left: 40, top: 92 }, cue: 'Press the handle straight out in front of your chest.' },
    { key: 'back', text: 'Back<br>neutral', anchor: { along: ['sacrum', 'backMid'], t: 0.5 }, box: { left: 252, top: 172 }, cue: 'Keep your back straight and tall, without arching your lower back.' },
    { key: 'shoulders', text: 'Shoulders<br>down', anchor: { at: 'trap.l', off: [12.5, -4] }, box: { left: 252, top: 104 }, cue: 'Keep your shoulders down and your chest up.' },
  ],
  tempo: [{ phase: 'Press', s: 1, move: true }, { phase: 'Hold', s: 2 }, { phase: 'Return', s: 3, move: true }],
  mistake: {
    pose: mistake,
    guides: [
      // the arch inside the figure (lib4-cards 32-33): its true contour (the engine's dashed outline) and a short red
      // arrow (12 px) onto the arched low back from behind
      { kind: 'arrow', from: { along: ['sacrum', 'backMid'], t: 0.6, pose: 'mistake', off: [12, 0] }, to: { along: ['sacrum', 'backMid'], t: 0.6, pose: 'mistake' } },
      { kind: 'dashed', pts: MIS_CABLE },                                       // the Mistake's cable, one stroke
    ],
    // One tell (D-LIB10-SKULL1; the one-tell record in the hand-off): c8 and c9 state one sign of this fault, the lower
    // back over-arching; the trunk leaning back and the handle coming back are its geometry, not signs a claim states.
    tells: [
      { key: 'arch', text: 'Low back<br>arches', anchor: { along: ['sacrum', 'backMid'], t: 0.3, pose: 'mistake', off: [-1, 0] }, box: { left: 252, top: 206 }, cue: 'The lower back over-arches as you press the handle out.' },
    ],
  },
  alt: 'Pallof press, side view. Standing side-on to a cable column with the knees slightly bent, the lifter holds one handle in both hands at the chest and presses it straight out in front of the chest, back tall.',
};

const r3 = v => +v.toFixed(3), r2 = v => +v.toFixed(2);
const legOff = lm => { const h = lm['hip.l'], k = lm['knee.l'], a = lm['ankle.l'], d = [a[2] - h[2], a[1] - h[1]], n = Math.hypot(...d);
  return Math.abs((k[2] - h[2]) * d[1] - (k[1] - h[1]) * d[0]) / n; };
export const info = {
  rootY: r3(ROOT_Y), grip: { start: [r3(GX), r3(GY), r3(Z0)], end: [r3(GX), r3(GY), r3(Z1)] }, pulley: PULLEY.map(r3),
  base: { heel: r3(L0['heel.l'][2]), toe: r3(L0['toe.l'][2]), x: [r3(L0['sole.r'][0]), r3(L0['sole.l'][0])] },
  cableBack: r3((ringOf(LE)[2] - PULLEY[2]) / len(sub(ringOf(LE), PULLEY))),
  pose: Object.fromEntries([['start', LS], ['end', LE], ['mistake', LM]].map(([k, lm]) => [k, { com: com(lm).map(r3), kneeOffCm: r2(legOff(lm) * 100), grips: lm.grips.map(r3), shoulder: lm['shoulder.l'].map(r3) }])),
};
