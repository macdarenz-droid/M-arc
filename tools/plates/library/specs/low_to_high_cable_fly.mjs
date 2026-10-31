// Low-to-High Cable Fly (standing between two cable columns, pulleys low), FRONT view. H (D-LIB16R2-MODES: the
// pulley height and the low-out to high-in arc are no PARAMS key; CFLY is not built).
// View: FRONT (card plate.view = census view): the arms sweep from low and out to high and in, and the fixed soft elbow
// (and the Mistake's bending elbow) are side-to-side and up-down positions that the front view shows (c4, c5, c6).
// Clone source (D-LIB9-CLONE): cable_fly (pilot B, main 6d34542c), copied, never imported: the fixed-elbow rule (each
// grip stays one distance from its shoulder joint), the elbow pole, the `via` keys every 1/12 of the sweep, the
// columns, D-handles and front cables, the press Mistake and its ghost arms; upright_row's standing base via cable_fly.
// Sources: research card docs/research/howto/cards/low_to_high_cable_fly.json (claude/libht-research @ a48b0594),
// claims c1 (pulleys between knee and hip height, single handles), c3 (staggered stance, trunk vertical), c4 (arms
// open down and out, slight elbow bend, hands not back past the armpit), c5 (hands meet in front at about face level),
// c6 (bend and trunk unchanged), c11 (the Mistake: bending the elbows turns the fly into a press), c12 and c15 (tempo).
// Geometry decisions:
//  - Stance (c3): mid-soles FOOT_X off the midline and STAGGER apart front to back (depth only in this view); the root
//    height is the highest at which both feet sit within 0.3 cm (scanned down in 2 mm steps; throws if none).
//  - Arms: each grip moves on the great circle (slerp) of its shoulder's sphere from the start direction (OPEN_DOWN
//    below level, OPEN_ANGLE ahead of the side line) to the end grip (CLOSE_GAP off the midline at chin height).
//  - Pulleys (c1): at the midpoint of knee and hip height of the start pose, at the columns' inner faces.
//  - Mistake (c11): at the end height the elbows bend to MIS_ELBOW; the grip depth is solved (throws if none).
//  - Scale: cable_fly's 124 px/m (the columns stand outside the open hands and fit the plate).
// Plate labels: callouts = plate.checkpoints c1 (Pulleys low), c6 (Soft elbows), c5 (Hands meet high); Mistake =
//   plate.mistake c11 (key `press`, drawable false: the top fault, leaning, needs a side view; F7 named,
//   D-LIB16R2-F7); tempo = plate.tempo (up 2, down 2, pause 1): Close 2, Hold 1, Open 2.
// Unsourced numbers: SIZES below, each with its basis in lb6/sizes.json (r2).
import { WINTER, REF, REF_CAMERA, landmarksOf, resolve, normPose } from '../engine.mjs';

export const SIZES = { FOOT_X: 0.12, STAGGER: 0.2, KNEE_SOFT: 5, ELBOW: 20, OPEN_ANGLE: 10, OPEN_DOWN: 40, CLOSE_GAP: 0.05,
  COL_X: 1.24, COL_W: 0.24, COL_H: 2.1, COL_Z: -0.35, MIS_ELBOW: 90, HANDLE: 0.12, CAM_PXM: 124 };
const H = 1.75, R = Math.PI / 180;
const { FOOT_X, STAGGER, KNEE_SOFT, ELBOW, OPEN_ANGLE, OPEN_DOWN, CLOSE_GAP, COL_X, COL_W, COL_H, COL_Z, MIS_ELBOW, HANDLE, CAM_PXM } = SIZES;
const MIS_POLE = [-1, -0.7, 0];                        // Mistake: the right elbow's aim (cable_fly's)
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
  throw new Error('low_to_high_cable_fly: no stance root'); })();
const base = { root: { at: [0, ROOT_Y, 0], tilt: 0 }, trunk: 0, neck: 0, plant: feet };

// ---- arm sphere (cable_fly's fixed-elbow rule): each grip stays D from its shoulder joint ----
const probe = landmarksOf({ ...base, shoulder: { abd: 80 }, elbow: 0 }, H);
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const L1 = dist(probe['shoulder.r'], probe['elbow.r']), L2 = dist(probe['elbow.r'], probe['grip.r']);
const S = probe['shoulder.r'];                         // right shoulder joint (x < 0; figure's right = viewer's left)
const END_Y = probe.chin[1];                           // end: hands meet at chin height (c5 "about face level"; checkpoint "chest to face height")
const D = Math.sqrt(L1 * L1 + L2 * L2 + 2 * L1 * L2 * Math.cos(ELBOW * R));
const norm = v => { const k = Math.hypot(...v); return v.map(x => x / k); };
const U0 = [-Math.cos(OPEN_DOWN * R) * Math.cos(OPEN_ANGLE * R), -Math.sin(OPEN_DOWN * R), Math.cos(OPEN_DOWN * R) * Math.sin(OPEN_ANGLE * R)];
const U1 = (() => { const dx = -CLOSE_GAP - S[0], dy = END_Y - S[1], h2 = D * D - dx * dx - dy * dy; if (!(h2 > 0)) throw new Error('low_to_high_cable_fly: no end grip'); return norm([dx, dy, Math.sqrt(h2)]); })();
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

// Mistake (c11): the press. The hands still meet at the end height, but the elbows bend to MIS_ELBOW: the grip is
// pulled back toward the face to the depth that bend allows (solved, never set), the elbows drop under the hands.
const DM = Math.sqrt(L1 * L1 + L2 * L2 + 2 * L1 * L2 * Math.cos(MIS_ELBOW * R)), DY = END_Y - S[1];
const MIS_Z = (() => { const dx = -CLOSE_GAP - S[0], h2 = DM * DM - DY * DY - dx * dx; if (!(h2 > 0)) throw new Error('low_to_high_cable_fly: no Mistake grip at MIS_ELBOW'); return S[2] + Math.sqrt(h2); })();
const misGrip = [-CLOSE_GAP, END_Y, MIS_Z];
const mistakePose = { reach: { r: { at: misGrip, pole: MIS_POLE }, l: { at: [-misGrip[0], misGrip[1], misGrip[2]], pole: [-MIS_POLE[0], MIS_POLE[1], MIS_POLE[2]] } } };
const lmMis = landmarksOf({ ...end, ...mistakePose }, H);
// Ghost arms for the Mistake (the front-view capsule copied from pec_fly @ 013f84e): upper arm and forearm with the
// engine's radii, as closed red dashed guides, since the engine masks the faulty outline inside the solid end arms.
const capsule = (a, b, r, n = 8) => {
  const au = Math.atan2(b[1] - a[1], b[0] - a[0]), pts = [];
  for (let i = 0; i <= n; i++) { const t = au + Math.PI / 2 - Math.PI * i / n; pts.push([b[0] + r * Math.cos(t), b[1] + r * Math.sin(t)]); }
  for (let i = 0; i <= n; i++) { const t = au - Math.PI / 2 - Math.PI * i / n; pts.push([a[0] + r * Math.cos(t), a[1] + r * Math.sin(t)]); }
  return [...pts, pts[0]].map(([x, y]) => [x, y, b[2]]);
};
const GHOSTS = ['l', 'r'].flatMap(sd => [capsule(lmMis[`shoulder.${sd}`], lmMis[`elbow.${sd}`], 0.046), capsule(lmMis[`elbow.${sd}`], lmMis[`grip.${sd}`], 0.036)]);

// ---- equipment ----
const lmBase = landmarksOf(start, H);
const PULLEY_Y = (lmBase['knee.r'][1] + lmBase['hip.r'][1]) / 2;   // between knee and hip height (c1): the midpoint
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
export const info = () => { const e = landmarksOf(end, H), m = landmarksOf({ ...end, ...mistakePose }, H), s = lmStart;
  return { shoulderY: +S[1].toFixed(3), pulleyY: +PULLEY_Y.toFixed(3), endY: +END_Y.toFixed(3), sweep: +(OMEGA / R).toFixed(1),
    startGrip: s['grip.r'].map(v => +v.toFixed(3)), endGrip: e['grip.r'].map(v => +v.toFixed(3)), misGrip: misGrip.map(v => +v.toFixed(3)),
    misElbow: m['elbow.r'].map(v => +v.toFixed(3)), endElbow: e['elbow.r'].map(v => +v.toFixed(3)), knee: s['knee.r'][1], hip: s['hip.r'][1] }; };

const LS = landmarksOf(start, H);
export const PULLEYS = PULLEY;
export default {
  id: 'low_to_high_cable_fly', name: 'Low-to-High Cable Fly', view: 'front',
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
    { key: 'pulleys', text: 'Pulleys<br>low', anchor: PULLEY.r, cue: 'Set the handles low, between knee and hip height.' },
    { key: 'elbows', text: 'Soft<br>elbows', anchor: { at: 'elbow.l', pose: 'start', off: [0, 5] }, box: { left: 210, top: 236 }, cue: 'Hold a slight elbow bend the whole rep.' },
    { key: 'meet', text: 'Hands<br>meet high', anchor: 'grips', box: { left: 220, top: 124 }, cue: 'Sweep your hands up to meet in front, chest to face height.' },
  ],
  tempo: [{ phase: 'Close', s: 2, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Open', s: 2, move: true }],
  mistake: {
    pose: mistakePose,
    guides: [
      ...GHOSTS.map(pts => ({ kind: 'dashed', pts })),                                               // the bent arms (ghosts)
      { kind: 'arrow', from: { at: 'elbow.l', pose: 'end', off: [8, 0] }, to: { at: 'elbow.l', pose: 'mistake', off: [8, 0] } },   // the elbow drops
      { kind: 'arrow', from: { at: 'elbow.r', pose: 'end', off: [-8, 0] }, to: { at: 'elbow.r', pose: 'mistake', off: [-8, 0] } },
    ],
    tells: [
      { key: 'press', text: 'Elbows<br>bend', anchor: { at: 'elbow.l', pose: 'mistake' }, cue: 'Your elbows bend deeply, turning the fly into a press.' },
      { key: 'drop', text: 'Elbows<br>drop', anchor: { at: 'elbow.r', pose: 'mistake' }, cue: 'Your elbows drop under your hands, as in a press.' },
    ],
  },
  alt: 'Low-to-high cable fly, front view. Standing staggered between two cable columns with the pulleys between knee and hip height, the lifter sweeps the arms from down and out up and in until the hands meet in front at chin height, elbows slightly bent.',
};
