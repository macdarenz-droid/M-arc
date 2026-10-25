// Arnold Press (upright adjustable bench, dumbbells), side view, facing right. H (D-LIB10-NOTE Q6, #265).
// View: SIDE (card plate.view = census view): the back on the upright pad, the dumbbells in front of the chest at the
// start and the arms straight overhead at the end read in the sagittal plane (c1, c3). The palm turn is a forearm roll
// the engine cannot draw; the callout and its cue carry it (card viewWhy).
// Clone source (D-LIB9-CLONE): dumbbell_shoulder_press (pilot A, main 1edb3c6), copied, never imported: its upright
// bench setting, feet, scapular set, straight-arm top over the shoulder joints, the start-arm phantom (machine_chest_
// press's workaround) and the start dumbbell phantom; `reclined()` copied from incline_dumbbell_press (its bisect throws
// on a bracket with no root, rule b). The bench is pilot A's `inclineBench` composer (imported; composers may be
// imported).
// Sources: research card docs/research/howto/cards/arnold_press.json (claude/libht-research 7d7c52e1, LB2 CARD FIELDS
// VERIFIED @ ccbe6f5), claims c1 (start: dumbbells in front of the chest, palms toward you; turn the palms out as you
// press; arms extended overhead, palms forward), c2 (bench at its most upright setting, vertical or just short of it),
// c3 (the Mistake: the back raised away from the bench), c4 (upper arms parallel to the floor at the lowest point),
// c12 (tempo).
// Geometry decisions:
//  - Bench: `inclineBench` on its upright setting, BACK = 10 deg from vertical ("just short of" vertical, c2), with
//    dumbbell_shoulder_press's seat tilt, seat height and pad length.
//  - Reclined class (copied): checks prove seat on the seat face, buttock on the back pad in every pose and backUpper
//    on it at the start and the end (tol 1 cm, c3), head clearance and soles on the floor.
//  - Start (bottom, c1, c4): the upper arm forward and START_DROP below level ("about level with the floor", c4), the
//    elbow straight in front of the shoulder; the forearm vertical in the side view, so the dumbbell stands in front
//    of the chest and chin, clear of the face (c1). With a forearm this long, an upper arm exactly level puts the
//    dumbbell at eye height (info() reports the height).
//  - End (top, c1): elbows straight (END_ELBOW 0), the grip straight over the shoulder joint in the side view, END_X
//    off the midline (as the clone source).
//  - Engine limits (as the clone source): the start layer never draws equipment, so the start dumbbell is a dashed
//    phantom in the end layer; the start near arm is redrawn as a dashed phantom outline where the end figure hides it.
//  - Scale: reference 146.29 px/m.
// Plate labels (card): callouts = plate.checkpoints c3 (Back on pad), c1 (Palms in, at the start), c1 (Arms straight
//   up); Mistake = plate.mistake c3 (key `arch`): the back raised off the pad as the dumbbells go up, drawn at the top
//   as the pelvis tipping forward and the low back arching until the upper back stands MIS_GAP off the pad, with
//   golden B's pad-to-back gap dimension at the mid back (machine_chest_press); tempo = plate.tempo c12 (up 1, down 2, no pause):
//   Press 1, Lower 2.
// Unsourced numbers (no card claim gives them; 13.3 must-fix 14): BACK 10 (c2 gives "vertical or just short of it",
//   no number), SEAT_TILT, SEAT_TOP, BACK_LEN, BEAM_Z, FOOT_Z, SCAP, END_X (dumbbell_shoulder_press's), START_DROP,
//   START_X, MIS_TILT and MIS_GAP (how far the faulty back is drawn off the pad).
import { landmarksOf, fk, resolve, normPose, rootOnSeat, bodyShapes, WINTER, REF } from '../engine.mjs';
import { inclineBench, inclineFaces } from '../eq/inclineBench.mjs';

const H = 1.75;
const R = Math.PI / 180;
const BACK = 10;                                      // back pad from vertical (deg): just short of vertical (c2)
const SEAT_TILT = 10;                                 // seat front edge up (deg)
const SEAT_TOP = 0.45;                                // seat face height at the lifter's seat contact (m)
const BACK_LEN = 0.86;                                // back pad length (m): reaches past the back of the head
const BEAM_Z = [-0.50, 0.40];                         // floor beam rear / front ends (m)
const TRUNK = 0;                                      // spine neutral against the pad (c3)
const FOOT_Z = 0.50;                                  // mid-sole in front of the hip joint (m)
const SCAP = { elev: -1, pro: -2 };                   // blades down and back (cm)
const START_DROP = 15;                                // start: upper arm below level (deg): "about level with the floor" (c4)
const START_X = 0.20;                                 // start: grip off the midline (m): dumbbells in front of the chest (c1)
const END_ELBOW = 0;                                  // top: elbow flexion (deg): arms straight (c1)
const END_X = 0.20;                                   // top: grip off the midline (m): over the shoulders
const MIS_TILT = 22;                                  // Mistake: pelvis tips forward (deg)
const MIS_GAP = 0.10;                                 // Mistake: upper back off the pad (m)
const GAP_MIN = 0.04;                                 // the Mistake's upper back clears the pad by at least this (m)
const OCCIPUT = [0, 0.955, -0.056];                   // back of the skull, side head outline (head frame, H)

// ---- reclined class (copied from incline_dumbbell_press; the bisect throws on a bracket with no root) ----
export const bisect = (f, lo, hi) => { if (!(f(lo) <= 0 && f(hi) >= 0)) throw new Error(`arnold_press: no solution in [${lo}, ${hi}]`); for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (f(m) > 0) hi = m; else lo = m; } return (lo + hi) / 2; };
const skOf = (p, height = H) => { const b = { height }; return fk(resolve(normPose(p, b), b).q, b); };

/** Reclined on a seat + back pad: returns { pose: { root, trunk, neck }, hinge, faces, seatPt }. */
export function reclined({ back, seatTilt = 0, seatTop, trunk = 0, height = H }) {
  const seatPt = [0, seatTop, 0];
  const at = tilt => ({ root: { at: rootOnSeat(seatPt, tilt, height), tilt }, trunk });
  const ang = tilt => { const lm = landmarksOf(at(tilt), height), d = [lm.backUpper[1] - lm.buttock[1], lm.backUpper[2] - lm.buttock[2]];
    return Math.atan2(-d[1], d[0]) / R; };   // recline of the buttock->backUpper line from vertical
  const tilt = bisect(t => back - ang(t), -100, 20);   // the recline falls as the pelvis tilts forward
  const p0 = at(tilt), lm = landmarksOf(p0, height);
  const u = [0, lm.backUpper[1] - lm.buttock[1], lm.backUpper[2] - lm.buttock[2]];
  const sn = [0, Math.cos(seatTilt * R), -Math.sin(seatTilt * R)];
  const k = ((seatPt[1] - lm.buttock[1]) * sn[1] + (seatPt[2] - lm.buttock[2]) * sn[2]) / (u[1] * sn[1] + u[2] * sn[2]);
  const hinge = [0, lm.buttock[1] + u[1] * k, lm.buttock[2] + u[2] * k];
  const faces = inclineFaces({ hinge, back, seatTilt });
  const n = faces.back.normal;
  const neck = bisect(nk => { const o = skOf({ ...p0, neck: nk }, height).head(OCCIPUT);
    return (o[1] - hinge[1]) * n[1] + (o[2] - hinge[2]) * n[2]; }, -40, 40);
  return { pose: { ...p0, neck }, hinge, faces, seatPt };
}

const REC = reclined({ back: BACK, seatTilt: SEAT_TILT, seatTop: SEAT_TOP, trunk: TRUNK });
const { hinge: HINGE, faces: F } = REC;
const feet = { l: { at: [0.10, 0, FOOT_Z] }, r: { at: [-0.10, 0, FOOT_Z] } };
const base = { ...REC.pose, scap: SCAP, plant: feet };
const lm0 = landmarksOf(base, H);
const S = { l: lm0['shoulder.l'], r: lm0['shoulder.r'] };
const L1 = WINTER.upperArm * H, L2 = WINTER.forearm * H + REF.gripOff * H;

// Start (c1, c4): the elbow in front of the shoulder, the upper arm START_DROP below level; the grip straight above the
// elbow in the side view (forearm vertical), START_X off the midline.
const startElbow = side => { const sh = S[side], d = START_DROP * R; return [sh[0], sh[1] - L1 * Math.sin(d), sh[2] + L1 * Math.cos(d)]; };
const startReach = side => { const s = side === 'l' ? 1 : -1, E = startElbow(side), off = s * START_X - E[0];
  return { at: [s * START_X, E[1] + Math.sqrt(L2 * L2 - off * off), E[2]], pole: E.map((v, i) => v - S[side][i]) }; };
const endReach = side => { const s = side === 'l' ? 1 : -1, sh = S[side];
  const d = Math.sqrt(L1 * L1 + L2 * L2 + 2 * L1 * L2 * Math.cos(END_ELBOW * R)), dx = s * END_X - sh[0];
  return { at: [s * END_X, sh[1] + Math.sqrt(d * d - dx * dx), sh[2]], pole: [s, 0, 0.2] }; };
const start = { ...base, reach: { l: startReach('l'), r: startReach('r') } };
const end = { ...base, reach: { l: endReach('l'), r: endReach('r') } };
const lmS = landmarksOf(start, H), lmEnd = landmarksOf(end, H);

const ring = (c, r, n) => { const pts = []; for (let i = 0; i <= n; i++) { const a = 360 * i / n * R; pts.push([0, c[1] - r * Math.sin(a), c[2] + r * Math.cos(a)]); } return pts; };
const startDbPhantom = [{ type: 'line', pts: ring(lmS['grip.r'], 0.119 / 2, 6), cls: 'eq-line m-line', z: 'front' }];
// Engine workaround (copied from the clone source): the start near arm is redrawn as a dashed phantom outline (union
// boundary of the engine's own arm shapes, in metres) in the end layer.
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

// Mistake (card plate.mistake, c3; key `arch`): the back rises away from the pad as the dumbbells go up. At the top,
// the pelvis tips forward MIS_TILT; the root slides along the seat face until the buttocks are back on the pad (the
// hips stay on the bench); the lumbar spine is solved so the upper back stands MIS_GAP off the pad; the head keeps the
// end pose's neck. The grips move with the shoulders, so the arms keep the top shape.
const padDist = p => (p[1] - F.back.point[1]) * F.back.normal[1] + (p[2] - F.back.point[2]) * F.back.normal[2];
const SEAT_T = [0, Math.sin(SEAT_TILT * R), Math.cos(SEAT_TILT * R)];          // along the seat face, toward the front
const tiltM = REC.pose.root.tilt + MIS_TILT;
const rootAt = sl => ({ at: rootOnSeat(REC.seatPt.map((v, i) => v + SEAT_T[i] * sl), tiltM, H), tilt: tiltM });
const slideM = (() => { const f = sl => padDist(landmarksOf({ ...end, root: rootAt(sl) }, H).buttock);
  return f(-0.2) > f(0.2) ? bisect(sl => -f(sl), -0.2, 0.2) : bisect(f, -0.2, 0.2); })();
const rootM = rootAt(slideM);
const gapOf = t => padDist(landmarksOf({ ...end, root: rootM, trunk: t }, H).backUpper) - MIS_GAP;
export const trunkM = gapOf(-60) < gapOf(30) ? bisect(gapOf, -60, 30) : bisect(t => -gapOf(t), -60, 30);
const misReach = (() => { const M = landmarksOf({ ...end, root: rootM, trunk: trunkM }, H), out = {};
  for (const sd of ['l', 'r']) { const d = [0, 1, 2].map(i => M[`shoulder.${sd}`][i] - lmEnd[`shoulder.${sd}`][i]);
    out[sd] = { ...end.reach[sd], at: end.reach[sd].at.map((v, i) => v + d[i]) }; }
  return out; })();
const mistakePose = { root: rootM, trunk: trunkM, reach: misReach };
const lmM = landmarksOf({ ...end, ...mistakePose }, H);
// Gap dimension (golden B's, machine_chest_press): from the pad face (foot of the normal) to the faulty mid back, where
// the gap is widest, with two 2 px ticks laid along the pad.
const NB = F.back.normal, UP = F.back.up, TICK = 2 / 146.29;
const gapTo = lmM.backMid, gapFrom = gapTo.map((v, i) => v - NB[i] * padDist(gapTo));
const tick = p => ({ kind: 'dashed', pts: [[0, p[1] - UP[1] * TICK, p[2] - UP[2] * TICK], [0, p[1] + UP[1] * TICK, p[2] + UP[2] * TICK]] });
// The gap itself (incline_dumbbell_press's GAP_FILL): the region between the pad face and the faulty back (backUpper,
// backMid, buttock) is cleared to the card colour ('eq', end layer, Mistake only), so the solid end figure does not
// hide it.
const onPad = p => p.map((v, i) => v - NB[i] * padDist(p));
const GAP_FILL = { type: 'poly', pts: [onPad(lmM.buttock), onPad(lmM.backUpper), lmM.backUpper, lmM.backMid, lmM.buttock], cls: 'eq', z: 'front', part: 'archgap' };
export const info = () => ({ startGripAboveShoulderCm: +((lmS['grip.r'][1] - S.r[1]) * 100).toFixed(1), startGripForwardOfShoulderCm: +((lmS['grip.r'][2] - S.r[2]) * 100).toFixed(1),
  startGripAboveChinCm: +((lmS['grip.r'][1] - lmS.chin[1]) * 100).toFixed(1), startGripForwardOfChinCm: +((lmS['grip.r'][2] - lmS.chin[2]) * 100).toFixed(1),
  misPelvisTiltDeg: MIS_TILT, misSlideCm: +(slideM * 100).toFixed(1), misTrunkDeg: +trunkM.toFixed(1),
  misBackUpperGapCm: +(padDist(lmM.backUpper) * 100).toFixed(1), misBackMidGapCm: +(padDist(lmM.backMid) * 100).toFixed(1), misButtockGapCm: +(padDist(lmM.buttock) * 100).toFixed(1) });

export default {
  id: 'arnold_press', name: 'Arnold Press', view: 'side', facing: 'right',
  camera: { x0: 170, y0: 339 },
  poses: { start, end },
  equipment: [
    { type: 'floor', from: -0.75, to: 0.95 },
    ...inclineBench({ hinge: HINGE, back: BACK, seatTilt: SEAT_TILT, backLen: BACK_LEN, beamZ: BEAM_Z }),
    (lm, ctx) => (ctx.pose === 'end' ? [...startArmPhantom, ...startDbPhantom, ...(ctx.mistake ? [GAP_FILL] : [])] : null),
    lm => [{ type: 'dumbbell', at: lm['grip.l'], axis: [1, 0, 0], z: 'back', part: 'db.l' },
      { type: 'dumbbell', at: lm['grip.r'], axis: [1, 0, 0], z: 'front', part: 'db' }],
  ],
  checks: [
    { landmark: 'seat', plane: { point: F.seat.point, normal: F.seat.normal }, pose: 'all', tol: 1 },       // hips on the seat
    { landmark: 'backUpper', plane: { point: F.back.point, normal: F.back.normal }, pose: 'start', tol: 1 },  // back on the pad (c3)
    { landmark: 'backUpper', plane: { point: F.back.point, normal: F.back.normal }, pose: 'end', tol: 1 },
    { landmark: 'buttock', plane: { point: F.back.point, normal: F.back.normal }, pose: 'all', tol: 1 },    // buttocks on the pad
    { landmark: 'backUpper', above: { point: F.back.point.map((v, i) => v + NB[i] * GAP_MIN), normal: NB }, pose: 'mistake' },   // fault: back off the pad (c3)
    { landmark: 'head', above: { point: F.back.point, normal: F.back.normal }, pose: 'all' },
    { landmark: 'sole.r', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
    { landmark: 'sole.l', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
  ],
  startParts: ['arm.r', 'arm.l'],
  ghosts: { count: 3, parts: ['arm.r', 'db'] },
  trace: { point: 'grip.r', trim: [12, 12] },
  callouts: [
    { key: 'back', text: 'Back<br>on pad', anchor: 'backUpper', box: { left: 40, top: 200 }, cue: 'Keep your back against the bench for the whole press.' },
    { key: 'palms', text: 'Palms<br>in', anchor: 'start:grip.r', box: { left: 228, top: 96 }, cue: 'Start with the dumbbells in front of your chest, palms toward you.' },
    { key: 'arms', text: 'Arms<br>straight up', anchor: 'wrist.r', cue: 'Turn your palms forward as you press, and finish with straight arms overhead.' },
  ],
  tempo: [{ phase: 'Press', s: 1, move: true }, { phase: 'Lower', s: 2, move: true }],
  mistake: {
    pose: mistakePose,
    guides: [
      { kind: 'dashed', pts: [gapFrom, gapTo] }, tick(gapFrom), tick(gapTo),                // pad-to-back gap dimension (dashed: it lies over the solid figure, 13.1)
      { kind: 'arrow', from: { at: 'navel', pose: 'mistake', off: [2, -2] }, to: { at: 'navel', pose: 'mistake', off: [14, -10] } },   // the belly pushes forward
    ],
    tells: [
      { key: 'arch', text: 'Back<br>off pad', anchor: { at: 'backUpper', pose: 'mistake' }, box: { left: 30, top: 186 }, cue: 'Your back lifts away from the bench as you press.' },
      { key: 'belly', text: 'Belly<br>pushes out', anchor: { at: 'navel', pose: 'mistake' }, box: { left: 230, top: 212 }, cue: 'Your low back arches and your belly pushes forward.' },
    ],
  },
  alt: 'Arnold press, side view. Seated on an upright bench, back on the pad and feet flat, the lifter presses the dumbbells from in front of the chest, palms facing in, to straight arms overhead, turning the palms forward on the way up.',
};
