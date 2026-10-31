// High-to-Low Cable Fly (standing between two cable columns, pulleys high), FRONT view. H (D-LIB16R2-MODES: the
// pulley height and the high-out to low-in arc are no PARAMS key; CFLY is not built).
// View: FRONT (card plate.view = census view): the arms sweep from high and out to low and in, and the fixed soft elbow
// and the Mistake's crossing hands are side-to-side and up-down positions that the front view shows (c3, c4, c5, c8).
// Clone source (D-LIB9-CLONE): cable_fly (pilot B, main 6d34542c), copied, never imported: the fixed-elbow rule (each
// grip stays one distance from its shoulder joint), the elbow pole, the `via` keys every 1/12 of the sweep, the
// columns, D-handles and front cables and the ghost-arm capsules; upright_row's standing base via cable_fly.
// Sources: research card docs/research/howto/cards/high_to_low_cable_fly.json (claude/libht-research @ a48b0594),
// claims c1 (handles at about the top of the head, staggered stance, trunk upright), c3 (slight elbow bend, trunk
// vertical), c4 (arms up and out, hands not back past the armpits), c5 (hands meet below chest level), c7 (trunk
// upright), c8 (the Mistake: crossing the handles past the midline), c12 (tempo).
// Geometry decisions:
//  - Stance (c3): mid-soles FOOT_X off the midline and STAGGER apart front to back (depth only in this view); the root
//    height is the highest at which both feet sit within 0.3 cm (scanned down in 2 mm steps; throws if none).
//  - Arms: each grip moves on the great circle (slerp) of its shoulder's sphere from the start direction (OPEN_UP
//    above level, OPEN_ANGLE ahead of the side line; the hands under the pulleys) to the end grip (CLOSE_GAP off the
//    midline, END_DROP below the chest landmark).
//  - Pulleys (c1): at the crown's height (the `head` landmark) of the start pose, at the columns' inner faces.
//  - Mistake (c8): each grip goes on along its sphere to MIS_CROSS past the midline, the right hand MIS_DY above the
//    left, so the forearms cross as an X (solved on the sphere, throws if none); a dashed ring at each faulty hand.
//  - Scale: cable_fly's 124 px/m (the columns stand outside the open hands and fit the plate).
// Plate labels: callouts = plate.checkpoints c7 (Trunk upright), c3 (Soft elbows), c5 (Below chest); Mistake =
//   plate.mistake c8 (key `cross`, drawable false: the card's top fault is not drawable in this view; F7 named,
//   D-LIB16R2-F7); tempo = plate.tempo (up 2, down 2, pause 1): Close 2, Hold 1, Open 2.
// Unsourced numbers: SIZES below, each with its basis in lb6/sizes.json (r2).
import { WINTER, REF, REF_CAMERA, landmarksOf, resolve, normPose } from '../engine.mjs';

export const SIZES = { FOOT_X: 0.12, STAGGER: 0.2, KNEE_SOFT: 5, ELBOW: 20, OPEN_ANGLE: 10, OPEN_UP: 30, CLOSE_GAP: 0.05, END_DROP: 0.1,
  COL_X: 1.24, COL_W: 0.24, COL_H: 2.1, COL_Z: -0.35, MIS_CROSS: 0.11, MIS_DY: 0.06, FIST_R: 0.035, HANDLE: 0.12, CAM_PXM: 124 };
const H = 1.75, R = Math.PI / 180;
const { FOOT_X, STAGGER, KNEE_SOFT, ELBOW, OPEN_ANGLE, OPEN_UP, CLOSE_GAP, END_DROP, COL_X, COL_W, COL_H, COL_Z, MIS_CROSS, MIS_DY, FIST_R, HANDLE, CAM_PXM } = SIZES;
const SEG = 12;

// ---- standing base (copied from upright_row @ 94c551f via cable_fly), feet staggered (c3) ----
const FOOT_Z = REF.mid * H;
const LEG = (() => { const a = WINTER.thigh * H, b = WINTER.shank * H, k = KNEE_SOFT * R; return Math.sqrt(a * a + b * b + 2 * a * b * Math.cos(k)); })();
const feet = { l: { at: [FOOT_X, 0, FOOT_Z + STAGGER / 2], toe: [0.3, 0, 1] }, r: { at: [-FOOT_X, 0, FOOT_Z - STAGGER / 2], toe: [-0.3, 0, 1] } };
// root height: the highest at which both feet sit on their marks within 0.3 cm (the engine's contact check allows
// 0.5); upright_row's closed form assumes the ankle under the hip, which the stagger breaks, so it is solved here
const footErr = y => Math.max(...resolve(normPose({ root: { at: [0, y, 0], tilt: 0 }, trunk: 0, neck: 0, plant: feet }, { height: H }), { height: H }).contacts.map(c => c.errCm));
const ROOT_Y = (() => { const top = Math.sqrt(LEG * LEG - (FOOT_X - REF.hjcX * H) ** 2) + WINTER.ankleH * H;
  for (let y = top; y > top - 0.1; y -= 0.002) if (footErr(y) <= 0.3) return y;   // first 2 mm step down from the straight-leg height
  throw new Error('high_to_low_cable_fly: no stance root'); })();
const base = { root: { at: [0, ROOT_Y, 0], tilt: 0 }, trunk: 0, neck: 0, plant: feet };

// ---- arm sphere (cable_fly's fixed-elbow rule): each grip stays D from its shoulder joint ----
const probe = landmarksOf({ ...base, shoulder: { abd: 80 }, elbow: 0 }, H);
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const L1 = dist(probe['shoulder.r'], probe['elbow.r']), L2 = dist(probe['elbow.r'], probe['grip.r']);
const S = probe['shoulder.r'];                         // right shoulder joint (x < 0; figure's right = viewer's left)
const END_Y = probe.chest[1] - END_DROP;              // end: hands meet below chest level (c5)
const D = Math.sqrt(L1 * L1 + L2 * L2 + 2 * L1 * L2 * Math.cos(ELBOW * R));
const norm = v => { const k = Math.hypot(...v); return v.map(x => x / k); };
const U0 = [-Math.cos(OPEN_UP * R) * Math.cos(OPEN_ANGLE * R), Math.sin(OPEN_UP * R), Math.cos(OPEN_UP * R) * Math.sin(OPEN_ANGLE * R)];
const U1 = (() => { const dx = -CLOSE_GAP - S[0], dy = END_Y - S[1], h2 = D * D - dx * dx - dy * dy; if (!(h2 > 0)) throw new Error('high_to_low_cable_fly: no end grip'); return norm([dx, dy, Math.sqrt(h2)]); })();
const OMEGA = Math.acos(U0.reduce((s, v, i) => s + v * U1[i], 0));
const dirAt = t => U0.map((v, i) => (Math.sin((1 - t) * OMEGA) * v + Math.sin(t * OMEGA) * U1[i]) / Math.sin(OMEGA));   // great circle (slerp)
const gripAt = t => dirAt(t).map((v, i) => S[i] + D * v);
const poleAt = t => {                                  // behind the direction of travel, out and down (cable_fly's form)
  const a = dirAt(Math.max(0, t - 0.01)), b = dirAt(Math.min(1, t + 0.01)), tan = norm(b.map((v, i) => v - a[i]));
  return norm([-tan[0] * 0.25 - 0.55, -tan[1] * 0.25 - 0.8, -tan[2] * 0.25]);
};
const armsAt = t => { const g = gripAt(t), pr = poleAt(t); return { r: { at: g, pole: pr }, l: { at: [-g[0], g[1], g[2]], pole: [-pr[0], pr[1], pr[2]] } }; };
const TS = Array.from({ length: SEG + 1 }, (_, i) => i / SEG);
const [start, ...rest] = TS.map(t => ({ ...base, reach: armsAt(t) }));
const end = rest.pop(), via = rest;

// Mistake (c8): the hands cross past each other at the front. Each grip stays on its own sphere (the elbow keeps its
// fixed bend) and goes on past the midline to MIS_CROSS on the other side; the right hand MIS_DY above the left, so
// the two forearms cross as an X (panel mx12 R5, #354 6544652523).
const crossAt = (x, y) => { const dx = x - S[0], dy = y - S[1], h2 = D * D - dx * dx - dy * dy; if (!(h2 > 0)) throw new Error('high_to_low_cable_fly: no crossed grip'); return [x, y, S[2] + Math.sqrt(h2)]; };
const misR = crossAt(MIS_CROSS, END_Y + MIS_DY / 2), misL = (g => [-g[0], g[1], g[2]])(crossAt(MIS_CROSS, END_Y - MIS_DY / 2));
const POLE1 = poleAt(1);
const mistakePose = { reach: { r: { at: misR, pole: POLE1 }, l: { at: misL, pole: [-POLE1[0], POLE1[1], POLE1[2]] } } };
const lmMis = landmarksOf({ ...end, ...mistakePose }, H);
// Ghost arms for the Mistake (the front-view capsule copied from pec_fly @ 013f84e): upper arm and forearm with the
// engine's radii, as closed red dashed guides, since the engine masks the faulty outline inside the solid end arms.
const capsule = (a, b, r, n = 8) => {
  const au = Math.atan2(b[1] - a[1], b[0] - a[0]), pts = [];
  for (let i = 0; i <= n; i++) { const t = au + Math.PI / 2 - Math.PI * i / n; pts.push([b[0] + r * Math.cos(t), b[1] + r * Math.sin(t)]); }
  for (let i = 0; i <= n; i++) { const t = au - Math.PI / 2 - Math.PI * i / n; pts.push([a[0] + r * Math.cos(t), a[1] + r * Math.sin(t)]); }
  return [...pts, pts[0]].map(([x, y]) => [x, y, b[2]]);
};
const ring = (c, r, n = 16) => Array.from({ length: n + 1 }, (_, k) => [c[0] + r * Math.cos(2 * Math.PI * k / n), c[1] + r * Math.sin(2 * Math.PI * k / n), c[2]]);
const GHOSTS = ['l', 'r'].flatMap(sd => [capsule(lmMis[`shoulder.${sd}`], lmMis[`elbow.${sd}`], 0.046), capsule(lmMis[`elbow.${sd}`], lmMis[`grip.${sd}`], 0.036)]);

// ---- equipment ----
const lmBase = landmarksOf(start, H);
const PULLEY_Y = lmBase.head[1];                       // at about the top of the head (c1)
const PULLEY = { r: [-(COL_X - COL_W / 2 + 0.05), PULLEY_Y, COL_Z], l: [COL_X - COL_W / 2 + 0.05, PULLEY_Y, COL_Z] };
const lmStart = landmarksOf(start, H);
const ringOf = (g, p) => { const d = [p[0] - g[0], p[1] - g[1]], k = Math.hypot(...d); return [g[0] + d[0] / k * 0.08, g[1] + d[1] / k * 0.08, g[2]]; };
const lmEnd = landmarksOf(end, H);
const len = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const column = sd => (lm, ctx) => {
  const p = PULLEY[sd], g = lm[`grip.${sd}`], to = ringOf(g, p);
  let rest0 = ringOf(lmStart[`grip.${sd}`], p);
  // Mistake: the stack is held at the end pose's lift, so only the arms (the fault) change in the Mistake view; the
  // stack's few-cm difference is not a sign of the fault (a red stack would read as one).
  if (ctx.pose === 'mistake') { const want = len(to, p) - (len(ringOf(lmEnd[`grip.${sd}`], p), p) - len(rest0, p)), u = rest0.map((v, i) => (v - p[i]) / len(rest0, p)); rest0 = p.map((v, i) => v + u[i] * want); }
  return { type: 'cableColumn', base: [sd === 'r' ? -COL_X : COL_X, 0, COL_Z], height: COL_H, width: COL_W, pulley: { at: PULLEY[sd], r: 0.045 }, to, rest: rest0, ratio: 2, wrap: sd === 'r' ? 1 : -1, part: 'column' };
};
const handle = sd => lm => {
  const g = lm[`grip.${sd}`], ring = ringOf(g, PULLEY[sd]), a = [g[0], g[1] + HANDLE / 2, g[2]], b = [g[0], g[1] - HANDLE / 2, g[2]];
  return { type: 'line', cls: 'eq-line', pts: [a, ring, b], z: 'mid', part: 'handle' };
};
// The cable from the pulley to the handle, redrawn in front of the arms (D-LIB11-PANEL1, R3): the column's own cable
// runs behind the arm fill, so it read as tied to the elbow. Same line: from the pulley's tangent point (the vendored
// cableColumn's tangentPoint, solved here in screen orientation, y down) straight to the handle ring.
const tangentW = (c, r, P, side) => { const dx = P[0] - c[0], dy = -(P[1] - c[1]), D = Math.hypot(dx, dy), a = Math.atan2(dy, dx), b = Math.acos(r / D) * side;
  return [c[0] + r * Math.cos(a + b), c[1] - r * Math.sin(a + b), c[2]]; };
const frontCable = sd => lm => { const p = PULLEY[sd], to = ringOf(lm[`grip.${sd}`], p);
  return { type: 'cable', from: tangentW(p, 0.045, to, sd === 'r' ? 1 : -1), to, z: 'front', part: 'cable' }; };
export const info = () => ({ shoulderY: +S[1].toFixed(3), pulleyY: +PULLEY_Y.toFixed(3), endY: +END_Y.toFixed(3), sweep: +(OMEGA / R).toFixed(1),
  startGrip: lmStart['grip.r'].map(v => +v.toFixed(3)), endGrip: landmarksOf(end, H)['grip.r'].map(v => +v.toFixed(3)), misR: misR.map(v => +v.toFixed(3)) });
const LS = landmarksOf(start, H);
export const PULLEYS = PULLEY;
export default {
  id: 'high_to_low_cable_fly', name: 'High-to-Low Cable Fly', view: 'front',
  camera: { pxPerM: CAM_PXM, x0: REF_CAMERA.x0, y0: REF_CAMERA.y0 },
  poses: { start, end, via },
  equipment: [
    { type: 'floor', from: -1.15, to: 1.15 },
    column('r'), column('l'), handle('r'), handle('l'), frontCable('r'), frontCable('l'),
  ],
  checks: [
    ...['heel.r', 'ball.r', 'heel.l', 'ball.l'].map(landmark => ({ landmark, plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 })),   // feet on the floor (c3)
    { landmark: 'wrist.r', at: LS['wrist.r'], pose: 'start', tol: 0.5 },          // c1 a handle in each hand
    { landmark: 'wrist.l', at: LS['wrist.l'], pose: 'start', tol: 0.5 },
    { landmark: 'grip.r', at: start.reach.r.at, pose: 'start', tol: 0.5 },
    { landmark: 'grip.l', at: start.reach.l.at, pose: 'start', tol: 0.5 },
    { landmark: 'grip.r', at: end.reach.r.at, pose: 'end', tol: 0.5 },
    { landmark: 'grip.l', at: end.reach.l.at, pose: 'end', tol: 0.5 },
  ],
  ghosts: { count: 3, parts: ['arm.r', 'arm.l'] },
  trace: { point: 'grip.r', trim: [12, 12] },
  callouts: [
    { key: 'upright', text: 'Trunk<br>upright', anchor: 'sternum', box: { left: 232, top: 80 }, cue: 'Keep your trunk vertical, with no lean toward the hands.' },
    { key: 'elbows', text: 'Soft<br>elbows', anchor: { at: 'elbow.l', pose: 'start', off: [0, 5] }, box: { left: 252, top: 168 }, cue: 'Hold a slight, fixed bend in the elbows the whole time.' },
    { key: 'below', text: 'Below<br>chest', anchor: 'grips', cue: 'Bring your hands together below chest level.' },
  ],
  tempo: [{ phase: 'Close', s: 2, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Open', s: 2, move: true }],
  mistake: {
    pose: mistakePose,
    guides: [
      ...GHOSTS.map(pts => ({ kind: 'dashed', pts })),                                               // the crossed arms (ghosts)
      ...['l', 'r'].map(sd => ({ kind: 'dashed', pts: ring(lmMis[`grip.${sd}`], FIST_R) })),                       // each faulty hand's ring
      { kind: 'arrow', from: { at: 'grip.r', pose: 'end', off: [0, -10] }, to: { at: 'grip.r', pose: 'mistake', off: [0, -10] } },   // each hand crosses over
      { kind: 'arrow', from: { at: 'grip.l', pose: 'end', off: [0, 10] }, to: { at: 'grip.l', pose: 'mistake', off: [0, 10] } },
    ],
    tells: [
      { key: 'cross', text: 'Hands<br>cross', anchor: { at: 'grip.r', pose: 'mistake' }, cue: 'Your hands cross past each other at the front.' },
    ],
  },
  alt: 'High-to-low cable fly, front view. Standing staggered between two cable columns with the pulleys at head height, the lifter sweeps the arms from up and out down and in until the hands meet in front below the chest, elbows slightly bent, trunk upright.',
};
