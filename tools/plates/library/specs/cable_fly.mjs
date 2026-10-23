// Cable Fly (standing, two cable columns, pulleys at shoulder height), FRONT view. H (D-LIB10-PA's mode rule; the CFLY
// template is its batch card's, after the pin: D-LIB11-TEMPLATES).
// View: FRONT (card plate.view = census view): the arms open to the sides in line with the chest, the hands meeting in
// front of the chest and the fixed soft elbow (and the Mistake's bending elbow) are side-to-side positions that only
// the front view shows (c4, c5, c7). The step forward (c2) is depth, which the front view does not show.
// Clone source (D-LIB9-CLONE): pilot A, copied, never imported: pec_fly @ 013f84e (approved, D-LIB8M-CRIT2): the
// horizontal arm circle about each shoulder's vertical axis at a fixed 20 deg elbow, its open and closed angles, its
// elbow pole and the `via` keys every 1/12 of the sweep; upright_row @ 94c551f (approved, D-LIB8M-CRIT3; the
// engine-drawn front-view anchor): the standing base (feet, soft knees, root height solved from them).
// Sources: research card docs/research/howto/cards/cable_fly.json (claude/libht-research @ 38d5f9c6), claims c1
// (pulleys at or slightly above shoulder height, single handles), c2 (centred between the pulleys, a step forward),
// c3 (braced stance), c4 (elbows slightly bent, the same angle all rep), c5 (hands together in front, pause one
// second), c6 (the Mistake: bending the elbows more than slightly turns the fly into a press), c7 (open only until the
// hands are in line with the chest), c8 (palms face each other when the handles meet), c12 (tempo).
// Geometry decisions:
//  - Standing (copied from upright_row): pelvis, trunk and neck 0, mid-soles 36 cm apart, toes out, knees 5 deg soft;
//    a parallel stance (c3 allows either). The braced trunk does not move in any pose.
//  - Columns (c1, c2): one cable column each side, the pulley at the column's inner face, slightly above the shoulder
//    joint (PULLEY_UP). The lifter stands a step forward of the column line (COL_Z): depth, not drawn in this view.
//  - Elbow (c4): fixed ELBOW flexion; each grip stays at one distance from its shoulder joint, so the IK keeps the same
//    bend in every key pose (pec_fly's rule). Handles at chest height (the chest landmark).
//  - Open (start, c4, c7): hands OPEN_ANGLE ahead of the side line, so the arms are open to the sides with the hands
//    in line with the chest, never behind it. Closed (end, c5, c8): grip centres CLOSE_GAP apart in front of the chest.
//  - Cables: from each handle to its pulley (the cableColumn primitive, a line type), so they move with the hands.
//  - Mistake (plate.mistake, c6): the elbows bend to MIS_ELBOW and the hands come in close to the chest, a press; the
//    upper arms swing out to the sides, so the bent elbows stand out beyond the shoulders in the front view.
//  - Scale: CAM_PXM 124 px/m (inside F1, the 8 span 123.9-146.3): at the reference scale the open hands reach the
//    columns; at 124 the columns stand outside the open hands and the whole rig fits the plate.
// Plate labels (card @ 38d5f9c6): callouts = plate.checkpoints c4 (Soft elbows), c5 (Hands meet), c7 (Stop at chest);
//   Mistake = plate.mistake c6 (key `press`); tempo = plate.tempo c5, c12 (up 1, down 2, pause 1): Close 1, Hold 1,
//   Open 2.
// Unsourced numbers (no card claim gives them; 13.3 must-fix 14): COL_X and COL_W (column spacing and width), COL_H
//   (the cableColumn default 2.1 m), COL_Z (the step forward), PULLEY_UP (how far above the shoulder), ELBOW 20 (pec_fly's
//   "slightly bent"), OPEN_ANGLE 10 and CLOSE_GAP (pec_fly's), HANDLE (D-handle size), MIS_ELBOW and MIS_POLE (the
//   Mistake's bend and the elbow's aim), FOOT_X and KNEE_SOFT (upright_row's).
import { WINTER, REF, REF_CAMERA, landmarksOf } from '../engine.mjs';

const H = 1.75, R = Math.PI / 180;
const FOOT_X = 0.18, KNEE_SOFT = 5;                    // upright_row's stance (m, deg)
const ELBOW = 20;                                      // fixed soft elbow (deg) (c4)
const OPEN_ANGLE = 10;                                 // open: hands 10 deg ahead of the side line (c7)
const CLOSE_GAP = 0.05;                                // closed: grip centres +-5 cm (hands together, c5)
const COL_X = 1.24, COL_W = 0.24, COL_H = 2.1;         // column centres +-1.24 m, 24 cm frame, 2.1 m tall
const COL_Z = -0.35;                                   // the column line 35 cm behind the shoulders (a step forward, c2)
const PULLEY_UP = 0.05;                                // pulley 5 cm above the shoulder joint (c1: at or slightly above)
const MIS_ELBOW = 90;                                  // Mistake: elbow flexion of the press (deg) (c6)
const MIS_POLE = [-1, -0.7, 0];                        // Mistake: the right elbow's aim, down and a little out (x out on the right)
const SEG = 12;
const CAM_PXM = 124;                                   // px/m: the columns stand outside the open hands and fit the plate

// ---- standing base (copied from upright_row @ 94c551f) ----
const FOOT_Z = REF.mid * H;
const LEG = (() => { const a = WINTER.thigh * H, b = WINTER.shank * H, k = KNEE_SOFT * R; return Math.sqrt(a * a + b * b + 2 * a * b * Math.cos(k)); })();
const ROOT_Y = Math.sqrt(LEG * LEG - (FOOT_X - REF.hjcX * H) ** 2) + WINTER.ankleH * H;
const feet = { l: { at: [FOOT_X, 0, FOOT_Z], toe: [0.3, 0, 1] }, r: { at: [-FOOT_X, 0, FOOT_Z], toe: [-0.3, 0, 1] } };
const base = { root: { at: [0, ROOT_Y, 0], tilt: 0 }, trunk: 0, neck: 0, plant: feet };

// ---- arm circle (copied from pec_fly @ 013f84e) ----
const probe = landmarksOf({ ...base, shoulder: { abd: 80 }, elbow: 0 }, H);
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const L1 = dist(probe['shoulder.r'], probe['elbow.r']), L2 = dist(probe['elbow.r'], probe['grip.r']);
const S = probe['shoulder.r'];                         // right shoulder joint (x < 0; figure's right = viewer's left)
const HANDLE_Y = probe.chest[1];                       // handles at chest height
const D = Math.sqrt(L1 * L1 + L2 * L2 + 2 * L1 * L2 * Math.cos(ELBOW * R));   // shoulder-to-grip distance at ELBOW
const DY = HANDLE_Y - S[1], RH = Math.sqrt(D * D - DY * DY);                  // horizontal radius about the shoulder axis
const CLOSE_ANGLE = Math.acos((S[0] + CLOSE_GAP) / RH) / R;                   // closed: hands at the midline
const gripAt = th => [S[0] - RH * Math.cos(th * R), HANDLE_Y, S[2] + RH * Math.sin(th * R)];
const poleAt = th => {                                 // behind the direction of travel, and down
  const back = [-Math.sin(th * R), 0, -Math.cos(th * R)];
  const p = [back[0] * 0.25 - 0.55, -0.8, back[2] * 0.25], k = Math.hypot(...p);
  return p.map(v => v / k);
};
const armsAt = th => { const g = gripAt(th), pr = poleAt(th); return { r: { at: g, pole: pr }, l: { at: [-g[0], g[1], g[2]], pole: [-pr[0], pr[1], pr[2]] } }; };
const THS = Array.from({ length: SEG + 1 }, (_, i) => OPEN_ANGLE + (CLOSE_ANGLE - OPEN_ANGLE) * i / SEG);
const [start, ...rest] = THS.map(th => ({ ...base, reach: armsAt(th) }));
const end = rest.pop(), via = rest;

// Mistake (c6): the press. The hands still meet in front of the chest at handle height, but the elbows bend to
// MIS_ELBOW: the grip is pulled back toward the chest to the depth that bend allows (solved, never set), and the
// elbows drop down and a little out, under the hands, as in a press.
const DM = Math.sqrt(L1 * L1 + L2 * L2 + 2 * L1 * L2 * Math.cos(MIS_ELBOW * R));
const MIS_Z = (() => { const dx = -CLOSE_GAP - S[0], h2 = DM * DM - DY * DY - dx * dx; if (!(h2 > 0)) throw new Error('cable_fly: no Mistake grip at MIS_ELBOW'); return S[2] + Math.sqrt(h2); })();
const misGrip = [-CLOSE_GAP, HANDLE_Y, MIS_Z];
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
const PULLEY = { r: [-(COL_X - COL_W / 2 + 0.05), S[1] + PULLEY_UP, COL_Z], l: [COL_X - COL_W / 2 + 0.05, S[1] + PULLEY_UP, COL_Z] };
const lmStart = landmarksOf(start, H);
const HANDLE = 0.12;                                   // D-handle: grip bar 12 cm, ring 8 cm toward the cable
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
  return { shoulderY: +S[1].toFixed(3), pulleyY: +PULLEY.r[1].toFixed(3), handleY: +HANDLE_Y.toFixed(3), closeAngle: +CLOSE_ANGLE.toFixed(1),
    startGripX: +s['grip.r'][0].toFixed(3), endGripX: +e['grip.r'][0].toFixed(3), misGrip: misGrip.map(v => +v.toFixed(3)),
    misElbowX: +m['elbow.r'][0].toFixed(3), misElbowY: +m['elbow.r'][1].toFixed(3), misGripZ: +MIS_Z.toFixed(3), endGripZ: +e['grip.r'][2].toFixed(3), endElbowX: +e['elbow.r'][0].toFixed(3) }; };

export default {
  id: 'cable_fly', name: 'Cable Fly', view: 'front',
  camera: { pxPerM: CAM_PXM, x0: REF_CAMERA.x0, y0: REF_CAMERA.y0 },
  poses: { start, end, via },
  equipment: [
    { type: 'floor', from: -1.15, to: 1.15 },
    column('r'), column('l'), handle('r'), handle('l'), frontCable('r'), frontCable('l'),
  ],
  checks: [
    { landmark: 'heel.r', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
    { landmark: 'ball.r', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
    { landmark: 'grip.r', at: start.reach.r.at, pose: 'start', tol: 0.5 },          // hands on the handles (c3)
    { landmark: 'grip.l', at: start.reach.l.at, pose: 'start', tol: 0.5 },
    { landmark: 'grip.r', at: end.reach.r.at, pose: 'end', tol: 0.5 },              // the handles in front of the chest (c8)
    { landmark: 'grip.l', at: end.reach.l.at, pose: 'end', tol: 0.5 },
  ],
  ghosts: { count: 3, parts: ['arm.r', 'arm.l'] },
  trace: { point: 'grip.r', trim: [12, 12] },
  callouts: [
    { key: 'elbows', text: 'Soft<br>elbows', anchor: { at: 'elbow.l', pose: 'start', off: [0, 5] }, box: { left: 240, top: 214 }, cue: 'Keep your elbows slightly bent at the same angle all rep.' },
    { key: 'meet', text: 'Hands<br>meet', anchor: 'grips', box: { left: 230, top: 112 }, cue: 'Bring your hands together in front and pause one second.' },
    { key: 'chest', text: 'Stop at<br>chest', anchor: { at: 'grip.r', pose: 'start' }, box: { left: 40, top: 214 }, cue: 'Open only until your hands are in line with your chest.' },
  ],
  tempo: [{ phase: 'Close', s: 1, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Open', s: 2, move: true }],
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
  alt: 'Cable fly, front view. Standing braced between two cable columns with the pulleys just above shoulder height, the lifter sweeps the arms from open to the sides, in line with the chest, until the hands meet in front, elbows slightly bent the whole time.',
};
