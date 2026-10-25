// Incline machine press (selectorised, pivot-arm handles, neutral vertical handles), side view, facing right. LB1, mode H,
// tier C, recline pose class; a difference card of machine_chest_press (golden A, bc0f378), whose anchor code is copied
// here (never imported).
// View: side (card plate.view): the push line, the handle height at the chest and the shoulder blades on the pad (the
// fault, c5) all read from the side.
// Source: docs/research/howto/cards/incline_machine_press.json (claude/libht-research). Claims used: c1 (back on the
// backrest, feet flat, hands level with the upper chest or shoulders, wrists straight), c2 (press up and forward until
// the hands are about forehead height, blades kept on the backrest), c3 (straight but not locked; lower until the handles
// come close to the upper chest), c4 (shoulders back and down), c5 (the fault: the shoulder blades round forward off the
// pad), c8 (tempo, card `tempo`).
// Differences from machine_chest_press (card libraryDiff): the back pad is reclined and the handle path rises up and
// forward to forehead height (c2) instead of running level from mid-chest; the start handles sit at the upper chest
// (c1); the Mistake is the blades leaving the pad only (c5), with the elbows still soft (no lockout: the card names one
// fault).
// Geometry decisions (no card claim gives machine sizes; typical commercial selectorised incline press assumed):
//  - Seat pad top 46 cm (as the parent); back pad reclined 25 deg from vertical (pelvis and thorax tilt -25), tangent to
//    the upper back and the buttock of the start pose.
//  - Start: handle centres 5 cm below the shoulder joints, 6 cm in front of the upper chest (c1, c3 "close to the upper
//    chest"). End: hands at forehead height (c2), elbows about 15 deg short of straight (c3).
//  - Lever: one pivot above and behind the head on the perpendicular bisector of the start-to-end handle chord, lever
//    1.0 m, so the handle runs on an arc through both points; the pivot sits on a frame beam from the rear post.
//  - Mistake (c5): the upper spine flexes 20 deg and the blades protract 5 cm and ride up 1.5 cm, so the upper back leaves
//    the pad by about 8 cm (GAP_M, drawn as a dimension); the handle goes on 11 deg along the same arc so the elbows stay
//    as soft as at the end (about 14 deg): the card names one fault, so no lockout.
//  - Labels: 'Soft elbows' sits above the arm with a vertical leader (the elbow is closed in by the trace below and
//    right); the 'Blades on pad' and 'Blades off pad' leaders come from the open left side and cross the rear post and
//    the pad, because the back-on-pad contact has the pad behind it and the torso in front.
//  - Mistake tells (lib4-cards 13.4 must-fix 5, Q-R2-2): 'blades' (off the pad, topFault) and 'roll' (c5's "roll
//    forward"): the roll carries the red arm, handle and lever past the solid ones into the open top right, so 'roll'
//    points at the right edge of the red handle (8 px off the grip) from a box below it with a vertical leader.
// CARD: hands level with the upper chest at the start (c1), forehead height at the end (c2), tempo (card `tempo`).
//  Unsourced numbers: TILT -25 (pad 25 deg from vertical; the card gives no angle), SEAT_TOP 0.46 m, GX0/GX1 26/22 cm,
//  S0 (6 cm in front of the chest, 5 cm below the shoulder joint), E1 (59.5 cm in front of the shoulder, 4 cm below the
//  head landmark), L 1.0 m, the Mistake size (trunk +20 deg thoracic flexion, scap pro 5 cm / elev 1.5 cm, GAP_M about
//  8 cm, the handle 11.2 deg further along the arc), the post 12 cm behind the pivot, the 'roll' box (262, 160)
//  and its 8 px anchor offset. All illustrative: the card gives no machine sizes and no fault size.
import { rootOnSeat, landmarksOf, normPose, resolve, fk, bodyShapes } from '../engine.mjs';

const H = 1.75;
const SEAT_TOP = 0.46;
const SEAT = [0, SEAT_TOP, 0];                         // buttock contact on the seat pad
const TILT = -25;                                      // back pad reclined 25 deg
const feet = { l: { at: [0.10, 0, 0.45] }, r: { at: [-0.10, 0, 0.45] } };   // feet flat, hip width (c1)
const GX0 = 0.26, GX1 = 0.22;                          // handle centres: 52 cm apart at the start, converging to 44 cm
const R = Math.PI / 180;

const base = { root: { at: rootOnSeat(SEAT, TILT, H), tilt: TILT }, trunk: 0, neck: 0, scap: { elev: -0.5, pro: -2 }, plant: feet };
const lm0 = landmarksOf(base, H);
const SH = lm0['shoulder.r'];
// start and end handle centres, [z, y]
const S0 = [lm0.chest[2] + 0.06, SH[1] - 0.05];                      // upper chest, close to it (c1, c3)
const E1 = [SH[2] + 0.595, lm0.head[1] - 0.04];                        // forehead height (c2)
// Lever: pivot on the perpendicular bisector of the chord, above and behind, at L from both handle centres.
export const L = 1.0;
export const PIVOT = (() => {
  const mid = [(S0[0] + E1[0]) / 2, (S0[1] + E1[1]) / 2], d = [E1[0] - S0[0], E1[1] - S0[1]], c = Math.hypot(...d);
  const n = [-d[1] / c, d[0] / c], k = Math.sqrt(L * L - (c / 2) ** 2);   // n points up and back
  return [0, mid[1] + n[1] * k, mid[0] + n[0] * k];
})();
const PY = PIVOT[1], PZ = PIVOT[2];
const phiOf = ([z, y]) => Math.atan2(z - PZ, PY - y) / R;            // 0 = hanging straight down from the pivot
const onArc = phi => [PZ + L * Math.sin(phi * R), PY - L * Math.cos(phi * R)];   // [z, y]
const PHI0 = phiOf(S0), PHI1 = phiOf(E1);
const PHI_M = PHI1 + 11.2;                                                // mistake: the handle runs on as the blades roll forward

const grips = (phi, gx, pole) => { const [z, y] = onArc(phi); return {
  l: { at: [gx, y, z], pole: [-pole[0], pole[1], pole[2]] }, r: { at: [-gx, y, z], pole } }; };
const gxAt = phi => GX0 + (GX1 - GX0) * Math.min(1, (phi - PHI0) / (PHI1 - PHI0));
const POLE_START = [-0.75, -0.6, -0.25];               // elbows out about 45 deg, down and behind the torso
const POLE_END = [-0.8, -0.6, 0.0];

const start = { ...base, reach: grips(PHI0, GX0, POLE_START) };
const end = { ...base, reach: grips(PHI1, GX1, POLE_END) };
const via = [1 / 3, 2 / 3].map(t => { const p = PHI0 + (PHI1 - PHI0) * t;   // keeps the handle on the arc
  return { ...base, reach: grips(p, gxAt(p), [-0.75 - 0.05 * t, -0.6, -0.25 * (1 - t)]) }; });

// Back pad: tangent to the upper back and the buttock of the correct pose.
const lmS = landmarksOf(start, H);
const padU = [0, lmS.backUpper[1], lmS.backUpper[2]], padL = [0, lmS.buttock[1], lmS.buttock[2]];
const padDir = [0, padU[1] - padL[1], padU[2] - padL[2]];
const padN = (() => { const n = [0, -padDir[2], padDir[1]], k = Math.hypot(...n); return n.map(v => v / k); })();

// Mistake: the blades round forward off the pad (c5).
const mistakePose = { trunk: 20, scap: { elev: 1.5, pro: 5 }, reach: grips(PHI_M, GX1, POLE_END) };
// Gap dimension for the tell: from the pad face (foot of the normal) to the faulty upper back, with two 4 px ticks.
const lmM = landmarksOf({ ...end, ...mistakePose }, H);
const gapTo = lmM.backUpper, gapCm = (gapTo[1] - padU[1]) * padN[1] + (gapTo[2] - padU[2]) * padN[2];
const gapFrom = [0, gapTo[1] - padN[1] * gapCm, gapTo[2] - padN[2] * gapCm];
const padU1 = (() => { const k = Math.hypot(...padDir); return padDir.map(v => v / k); })(), TICK = 2 / 146.29;   // +-2 px
const tick = p => ({ kind: 'line', pts: [[0, p[1] - padU1[1] * TICK, p[2] - padU1[2] * TICK], [0, p[1] + padU1[1] * TICK, p[2] + padU1[2] * TICK]] });
export const GAP_M = gapCm;

// The start layer is drawn under the end layer, so the start near arm, which lies over the torso, is redrawn as a dashed
// phantom outline in the end layer (copied from machine_chest_press).
const insidePoly = (p, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
  const [xi, yi] = poly[i], [xj, yj] = poly[j];
  if ((yi > p[1]) !== (yj > p[1]) && p[0] < (xj - xi) * (p[1] - yi) / (yj - yi) + xi) c = !c; } return c; };
const startArmPhantom = (() => {
  const body = { height: H }, sk = fk(resolve(normPose(start, body), body).q, body);
  const cam = { view: 'side', facing: 'right', near: 'r', pxm: 1, P: w => [w[2], -w[1]] };
  const keys = ['shcap.r', 'upper.r', 'elbowcap.r', 'fore.r', 'fist.r'];
  const polys = bodyShapes(sk, cam).filter(sh => keys.includes(sh.key)).map(sh => sh.poly);
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
  return runs.map(r => ({ type: 'line', pts: r.map(p => [0, -p[1], p[0]]), cls: 'eq-line m-line', z: 'front' }));
})();

// Lever and handle as outlines (metres), matching the chestPress primitive: (a) the start handle as a dashed phantom in
// the end pose (the start layer drops moving equipment); (b) the in-between ghosts as open outlines.
const GRIP = 0.14, LEVER_R = 0.025, HANDLE_R = 0.016, BOSS_R = 0.04;
const W = ([z, y]) => [0, y, z];
const capsule = (a, b, r, n = 8) => {   // closed outline round segment a-b, [z, y]
  const au = Math.atan2(b[1] - a[1], b[0] - a[0]), pts = [];
  for (let i = 0; i <= n; i++) { const t = au + Math.PI / 2 - Math.PI * i / n; pts.push([b[0] + r * Math.cos(t), b[1] + r * Math.sin(t)]); }
  for (let i = 0; i <= n; i++) { const t = au - Math.PI / 2 - Math.PI * i / n; pts.push([a[0] + r * Math.cos(t), a[1] + r * Math.sin(t)]); }
  return [...pts, pts[0]].map(W);
};
const leverOutline = (grip, cls, z, part = null) => {
  const top = [grip[2], grip[1] + GRIP / 2], bot = [grip[2], grip[1] - GRIP / 2], pv = [PZ, PY];
  const d = [top[0] - pv[0], top[1] - pv[1]], k = Math.hypot(...d), u = [d[0] / k, d[1] / k], n = [-u[1], u[0]];
  const a = [pv[0] + u[0] * BOSS_R, pv[1] + u[1] * BOSS_R];
  const side = s => [[a[0] + n[0] * s, a[1] + n[1] * s], [top[0] + n[0] * s, top[1] + n[1] * s]].map(W);
  return [side(LEVER_R), side(-LEVER_R), capsule(bot, top, HANDLE_R)].map(pts => ({ type: 'line', pts, cls, z, part }));
};
const startGrip = lmS['grip.r'];

const POST = { z: PZ - 0.12, h: PY + 0.08 };

export default {
  id: 'incline_machine_press', name: 'Incline Machine Press', view: 'side', facing: 'right',
  camera: { fit: true },
  poses: { start, end, via },
  equipment: [
    { type: 'floor', from: -0.95, to: 0.85 },
    { type: 'rackUpright', at: [0, 0, POST.z], h: POST.h },
    { type: 'line', pts: [[0, PY, POST.z + 0.038], [0, PY, PZ]], cls: 'eq' },   // pivot beam from the post
    { type: 'seat', at: [0, SEAT_TOP, 0.10], len: 0.40 },
    { type: 'backPad', surface: [padU, padL], len: 0.66, below: 0.06, post: false },
    { type: 'line', pts: [[0, padL[1] + 0.20, padL[2] - 0.12], [0, padL[1] + 0.20, POST.z + 0.038]], cls: 'eq-line' },   // pad bracket
    // start phantom: the near arm and the handle only; the start lever line would cross the head in side view
    (lm, ctx) => (ctx.pose === 'end' ? [...startArmPhantom, ...leverOutline(startGrip, 'eq-line m-line', 'front').slice(2)]
      : ctx.pose.startsWith('ghost') ? leverOutline(lm['grip.r'], 'eq-line', 'mid', 'handle') : null),
    lm => ({ type: 'chestPress', pivot: PIVOT, handle: lm['grip.r'], grip: 0.14, gripAxis: [0, 1, 0], part: 'lever' }),
  ],
  checks: [
    { landmark: 'seat', plane: { point: SEAT, normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },          // pelvis on the seat
    { landmark: 'backUpper', plane: { point: padU, normal: padN }, pose: 'start', tol: 1 },         // blades on the pad (c2)
    { landmark: 'backUpper', plane: { point: padU, normal: padN }, pose: 'end', tol: 1 },
    { landmark: 'buttock', plane: { point: padL, normal: padN }, pose: 'all', tol: 1 },
    { landmark: 'sole.r', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },  // feet on the floor (c1)
  ],
  ghosts: { count: 3, parts: ['handle'] },
  trace: { point: 'grip.r', trim: [12, 12] },
  callouts: [
    { key: 'chest', text: 'Upper-chest<br>start', anchor: 'start:grip.r', box: { left: 212, top: 198 }, cue: 'At the start the hands sit level with the upper chest or shoulders.' },
    { key: 'pad', text: 'Blades<br>on pad', anchor: 'backUpper', box: { left: 32, top: 190 }, cue: 'Back and shoulder blades stay on the pad through the whole press.' },
    { key: 'soft', text: 'Soft<br>elbows', anchor: 'elbow.r', box: { left: 196, top: 70 }, cue: 'The press ends with the elbows straight but not locked, hands about forehead height.' },
  ],
  tempo: [{ phase: 'Press', s: 2, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Return', s: 2, move: true }],
  mistake: {
    pose: mistakePose,
    guides: [
      { kind: 'line', pts: [gapFrom, gapTo] }, tick(gapFrom), tick(gapTo),   // pad-to-back gap dimension
    ],
    tells: [
      { key: 'blades', text: 'Blades<br>off pad', anchor: { at: 'backUpper', pose: 'mistake' }, box: { left: 30, top: 186 }, cue: 'The shoulder blades round forward off the pad at the top of the press.' },
      { key: 'roll', text: 'Rolls<br>forward', anchor: { at: 'grip.r', pose: 'mistake', off: [8, 0] }, box: { left: 262, top: 160 }, cue: 'The shoulders roll forward, so the arms reach past the end of the press.' },
    ],
  },
  alt: 'Incline machine press, side view. Seated against a reclined back pad with the feet flat, the lifter presses vertical handles from the upper chest up and forward until the hands are about forehead height, elbows soft, shoulder blades kept on the pad.',
};
