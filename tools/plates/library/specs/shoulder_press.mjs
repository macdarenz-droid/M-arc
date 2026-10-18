// Machine shoulder press (selectorised, pivot-arm handles, neutral vertical handles), side view, figure faces right.
// LB1, mode H, tier A. Clone source: machine_chest_press (golden A, bc0f378): the same seat, back pad and pivot-arm
// lever drawn the same way, here with an overhead arm path (census gap pivotArmOverhead: the lever pivot sits above and
// behind the shoulders, so the handles rise up and slightly back, in front of the shoulders).
// View: side (card plate.view): the handle height at the start, the press overhead and the fault (the low back arching
// off the pad) are all sagittal. The 4-and-8 o'clock elbow position (c3) is a top-view detail and stays in the text.
// Source: docs/research/howto/cards/shoulder_press.json (claude/libht-research). Claims used: c1 (back on the pad,
// handles level with or just above the shoulders), c2 (full grip, straight wrists), c3 (elbows slightly in front of the
// body), c4 (feet planted, natural low-back curve, no arch, shoulders down), c5 (press up without arching), c6 (elbows
// straight but not locked, brief pause, lower slowly), c12 (tempo 2 s up, 2 s down).
// Geometry decisions (assumed typical commercial selectorised machine; no card claim gives sizes):
//  - Seat top 46 cm and back pad as machine_chest_press, the pad near upright (pelvis and thorax 6 deg back), so the
//    back pad is tangent to the upper back and the buttock in the start and end poses.
//  - Handles 66 cm apart (grip centres +-33 cm, the hands about 10 cm outside the shoulder joints), neutral and
//    vertical (c2; the pivot-arm grip, card variantLine). Start: grip 10 cm above the shoulder joint and 24 cm in front
//    of it, so the hands sit level with or just above the shoulders and the elbows are bent about 130 deg, under the
//    hands and in front of the trunk (c1, c3). End: grip 65 cm above the shoulder joint and 12 cm in front of it,
//    elbows 16 deg short of straight (c6: straight but not locked).
//  - Lever 0.60 m from a pivot behind the back pad, on the perpendicular bisector of the start-end chord, so both
//    handles sit on its circle and the path rises up and slightly back (census gap pivotArmOverhead: pivot above and
//    behind the shoulders). The lever and handle are `poly` bars (eq/polybar.mjs); the start lever is an end-pose
//    dashed phantom, as on assisted_pull_up, because the start layer drops moving equipment.
//  - Mistake (card plate.mistake, c4, c5): at the top, the hips slide 5.5 cm forward on the seat, the pelvis tips 10 deg
//    forward and the thorax leans back until the torso touches the pad again (solved on the drawn torso outline: no
//    part of the back sinks into the pad), a 28 deg spine extension. The low back leaves the pad (mid back 9 cm, sacrum
//    12 cm) while the top of the back stays on it; the handles stay at the top, so the arch is the one change.
import { rootOnSeat, landmarksOf, normPose, resolve, fk, bodyShapes } from '../engine.mjs';
import { polyBar } from '../eq/polybar.mjs';
import { perItem } from '../eq/parts.mjs';

const H = 1.75;
const SEAT_TOP = 0.46;
const SEAT = [0, SEAT_TOP, 0];
const TILT = -6;
const feet = { l: { at: [0.10, 0, 0.47] }, r: { at: [-0.10, 0, 0.47] } };
const GX = 0.33;
const base = { root: { at: rootOnSeat(SEAT, TILT, H), tilt: TILT }, trunk: 0, neck: 0, plant: feet };
const lm0 = landmarksOf({ ...base, shoulder: { flex: 0 } }, H);
const SH = lm0['shoulder.r'];

const START_G = [0, SH[1] + 0.10, SH[2] + 0.24];
const END_G = [0, SH[1] + 0.652, SH[2] + 0.12];
// Lever: the pivot behind the back pad on the perpendicular bisector of the start-end chord, L from both handles.
const L = 0.60;
const PIVOT = (() => {
  const M = [0, (START_G[1] + END_G[1]) / 2, (START_G[2] + END_G[2]) / 2], c = [0, END_G[1] - START_G[1], END_G[2] - START_G[2]];
  const k = Math.hypot(...c), n = [0, c[2] / k, -c[1] / k], h = Math.sqrt(L * L - (k / 2) ** 2);   // n points back (-z)
  return [0, M[1] + n[1] * h, M[2] + n[2] * h];
})();
const onArc = t => {   // handle centre at fraction t of the press (0 start, 1 end), on the lever circle
  const a0 = Math.atan2(START_G[1] - PIVOT[1], START_G[2] - PIVOT[2]), a1 = Math.atan2(END_G[1] - PIVOT[1], END_G[2] - PIVOT[2]);
  const a = a0 + (a1 - a0) * t;
  return [0, PIVOT[1] + L * Math.sin(a), PIVOT[2] + L * Math.cos(a)];
};
const grips = (g, pole) => ({ l: { at: [GX, g[1], g[2]], pole: [-pole[0], pole[1], pole[2]] }, r: { at: [-GX, g[1], g[2]], pole } });

const start = { ...base, scap: { elev: 0, pro: 0 }, reach: grips(START_G, [-0.8, -1, 0.3]) };
const end = { ...base, scap: { elev: 1, pro: 0 }, reach: grips(END_G, [-1, 0, 0.3]) };
const via = [1 / 3, 2 / 3].map(t => ({ ...base, scap: { elev: t, pro: 0 }, reach: grips(onArc(t), [-0.9, -1 + t, 0.3]) }));

// Back pad: tangent to the upper back and the buttock of the correct pose.
const lmS = landmarksOf(start, H);
const padU = [0, lmS.backUpper[1], lmS.backUpper[2]], padL = [0, lmS.buttock[1], lmS.buttock[2]];
const padDir = (() => { const d = [0, padU[1] - padL[1], padU[2] - padL[2]], k = Math.hypot(...d); return d.map(v => v / k); })();
const padN = [0, -padDir[2], padDir[1]];

// Mistake: the arch. The hips slide SLIDE forward on the seat and the pelvis tips ARCH_P deg forward; the thorax leans
// back until the torso outline touches the pad again (ARCH_L, solved by bisection on the drawn torso shape, so no part of
// the back sinks into the pad): the top of the back stays on the pad, the low back and the buttock leave it.
const SLIDE = 0.055, ARCH_P = 10;
const lmE = landmarksOf(end, H);
const PAD_TOP = padL[1] + padDir[1] * 0.72;   // the pad's top end (backPad len 0.78, below 0.06)
const torsoGap = pose => {   // smallest distance (m) from the pad face to the drawn torso, over the pad's height
  const body = { height: H }, sk = fk(resolve(normPose(pose, body), body).q, body);
  const cam = { view: 'side', facing: 'right', near: 'r', pxm: 1, P: w => [w[2], -w[1]] };
  const torso = bodyShapes(sk, cam).find(sh => sh.key === 'torso').poly;
  return Math.min(...torso.filter(([, ny]) => -ny <= PAD_TOP).map(([z, ny]) => (-ny - padU[1]) * padN[1] + (z - padU[2]) * padN[2]));
};
const archAt = lean => {
  const tr = { root: { at: base.root.at, tilt: TILT + ARCH_P }, trunk: -(ARCH_P + lean) }, lt = landmarksOf({ ...end, ...tr }, H);
  const root = [0, base.root.at[1] + SEAT[1] - lt.seat[1], base.root.at[2] + lmE.seat[2] + SLIDE - lt.seat[2]];
  return { root, gap: torsoGap({ ...end, ...tr, root: { at: root, tilt: TILT + ARCH_P } }) };
};
const ARCH_L = (() => { let lo = 0, hi = 40; for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; if (archAt(m).gap > 0) lo = m; else hi = m; } return (lo + hi) / 2; })();
const misRoot = archAt(ARCH_L).root;
const misBody = { root: { at: misRoot, tilt: TILT + ARCH_P }, trunk: -(ARCH_P + ARCH_L), reach: grips(END_G, [-1, 0, 0.3]) };   // the handles stay at the top: the arch is the one change
// Gap dimension, as machine_chest_press draws its pad gap: from the pad face to the arched mid back, with two 4 px ticks
// laid along the pad (the tell's leader meets the sacrum below it, so the two marks stay apart).
const lmM = landmarksOf({ ...end, ...misBody }, H);
const gapTo = lmM.backMid, gapCm = (gapTo[1] - padU[1]) * padN[1] + (gapTo[2] - padU[2]) * padN[2];
const gapFrom = [0, gapTo[1] - padN[1] * gapCm, gapTo[2] - padN[2] * gapCm];
const TICK = 2 / 146.29;
const tick = p => ({ kind: 'line', pts: [[0, p[1] - padDir[1] * TICK, p[2] - padDir[2] * TICK], [0, p[1] + padDir[1] * TICK, p[2] + padDir[2] * TICK]] });

// Lever and handle (poly, so they move between poses): the lever from the pivot to the grip centre (length L in every
// pose), the 14 cm vertical handle across its end.
const HANDLE = 0.14;
const leverParts = g => [
  polyBar(PIVOT, g, 0.05, { z: 'center', part: 'lever' }),
  polyBar([0, g[1] - HANDLE / 2, g[2]], [0, g[1] + HANDLE / 2, g[2]], 0.032, { cls: 'eq-solid', z: 'center', part: 'lever' }),
];
const POST = { z: PIVOT[2], h: PIVOT[1] + 0.06 };

export default {
  id: 'shoulder_press', name: 'Shoulder Press', view: 'side', facing: 'right',
  camera: { fit: true },
  poses: { start, end, via },
  equipment: [
    { type: 'floor', from: POST.z - 0.2, to: 0.8 },
    { type: 'box', at: [0, POST.h / 2, POST.z], w: 0.07, h: POST.h, rc: 1 },                                              // main upright
    { type: 'box', at: [0, 0.022, (POST.z + 0.35) / 2], w: 0.35 - POST.z + 0.07, h: 0.044, rc: 1, z: 'center' },          // base rail
    { type: 'seat', at: [0, SEAT_TOP, 0.10], len: 0.40 },
    { type: 'backPad', surface: [padU, padL], len: 0.78, below: 0.06, post: false },
    { type: 'line', cls: 'eq-line', pts: [[0, padL[1] + 0.25, padL[2] - 0.08], [0, padL[1] + 0.25, POST.z + 0.035]] },   // pad bracket
    ...perItem(lm => leverParts([0, lm['grip.r'][1], lm['grip.r'][2]]), 2),
    { type: 'pulley', at: PIVOT, r: 0.04 },                                                                                // lever pivot
    // the start lever and handle as a dashed outline in the end pose (the start layer drops moving equipment)
    ...perItem((lm, ctx) => (ctx.pose === 'end' ? leverParts([0, ctx.start['grip.r'][1], ctx.start['grip.r'][2]]).map(it => ({ type: 'line', cls: 'eq-line m-line', z: 'back', part: 'phantom', pts: [...it.pts, it.pts[0]] })) : null), 2),
  ],
  checks: [
    { landmark: 'seat', plane: { point: SEAT, normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
    { landmark: 'backUpper', plane: { point: padU, normal: padN }, pose: 'start', tol: 1 },
    { landmark: 'backUpper', plane: { point: padU, normal: padN }, pose: 'end', tol: 1 },
    { landmark: 'buttock', plane: { point: padL, normal: padN }, pose: 'start', tol: 1 },
    { landmark: 'buttock', plane: { point: padL, normal: padN }, pose: 'end', tol: 1 },
    { landmark: 'sacrum', above: { point: padL, normal: padN }, pose: 'mistake' },
    { landmark: 'sole.r', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
  ],
  ghosts: { count: 3, parts: ['lever'] },
  trace: { point: 'grip.r', trim: [12, 12] },
  callouts: [
    { key: 'height', text: 'Handles at<br>shoulders', anchor: 'start:grip.r', box: { left: 204, top: 150 }, cue: 'Set the seat so the handles start level with or just above the shoulders.' },
    { key: 'back', text: 'No back<br>arch', anchor: 'backMid', box: { left: 30, top: 226 }, cue: 'Keep the natural low-back curve against the pad and do not arch as you press.' },
    { key: 'elbows', text: 'Soft elbows<br>overhead', anchor: 'elbow.r', box: { left: 14, top: 92 }, cue: 'Finish with the elbows straight but not locked.' },
  ],
  tempo: [{ phase: 'Press', s: 2, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Return', s: 2, move: true }],
  mistake: {
    pose: misBody,
    parts: ['torso', 'head'],
    guides: [
      // the faulty back contour: the upper back and the buttock stay on the pad, the low back leaves it
      { kind: 'line', smooth: true, pts: [{ at: 'backUpper', pose: 'mistake' }, { at: 'backMid', pose: 'mistake' }, { at: 'sacrum', pose: 'mistake' }, { at: 'buttock', pose: 'mistake' }] },
      { kind: 'line', pts: [gapFrom, gapTo] }, tick(gapFrom), tick(gapTo),   // pad-to-back gap dimension
    ],
    tells: [
      { key: 'arch', text: 'Back<br>arched', anchor: { at: 'sacrum', pose: 'mistake' }, box: { left: 38, top: 220 }, cue: 'The low back arches off the pad to push the handles up.' },
    ],
  },
  alt: 'Machine shoulder press, side view. Seated with the back on an upright pad and the feet planted, the lifter presses vertical handles from just above the shoulders straight up overhead until the elbows are straight but not locked, the low back keeping its natural curve against the pad.',
};
