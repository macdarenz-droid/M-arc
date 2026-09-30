// Seated Dumbbell Shoulder Press (upright adjustable bench, pronated grip), side view, facing right. SEATPRESS parent.
// View: SIDE (card): back contact with the pad, the low-back arch and the elbows slightly forward all read in the
// sagittal plane, and so does the one thing the overhead finish must show: the arm vertical over the shoulder.
// Sources: research card docs/research/howto/cards/dumbbell_shoulder_press.json (branch claude/libht-research e2a70bc,
// verified), claims c1 (back against the backrest; head, shoulders, buttocks touch it; feet
// flat), c2 (start: dumbbells at shoulder level, shoulder-width or slightly wider, wrists neutral), c3 (blades down and
// back), c4 (press to straight elbows overhead, no low-back arch), c5 (elbows pointed in front of the body), c10 (in
// front of the head, never behind the neck).
// Geometry decisions:
//  - Bench: library composer `inclineBench` on its upright setting. The card's sources give no angle: BACK = 10 deg
//    from vertical (the usual 80-85 deg "upright" notch of an adjustable bench; enough recline to hold the back without
//    sliding), seat raised SEAT_TILT = 10 deg at the front, seat top 45 cm at the lifter's seat contact, back pad
//    BACK_LEN long so the head rests on it (c1). Pads 7 cm; floor beam BEAM_Z.
//  - Reclined class (`reclined()` from incline_dumbbell_press): pelvis tilt that lays the buttock-to-upper-back line
//    at the pad angle with a neutral spine (TRUNK 0, c4), seat landmark on the seat, pad face through buttock and
//    backUpper, neck solved so the back of the skull is on the pad. Checks: seat on the seat face, backUpper and
//    buttock on the back face (tol 1 cm), head clearance, soles on the floor.
//  - Feet flat, mid-sole FOOT_Z in front of the hip joint: knees ~90 deg, shins about vertical (c1).
//  - Blades down and back (SCAP) (c3).
//  - Start (bottom, c2, c5): grips START_DY above the shoulder joint (handle at jaw level, so the dumbbell heads sit
//    at shoulder-top level: "dumbbells at shoulder level"), START_X off the midline (just outside the shoulders:
//    "shoulder-width or slightly wider"), START_DZ in front of the shoulder joint; the IK pole puts the elbow down, out
//    and forward, so the elbow sits in front of the torso (c5).
//  - End (top, c4): elbows straight (END_ELBOW), grip vertically over the shoulder joint in the side view (dz = 0 by
//    construction; the report angle `sh.r` elev and the upper-arm/forearm points confirm a vertical arm), END_X off the
//    midline (dumbbells over the shoulders, in front of the head, c10).
//  - Engine limits: the start layer never draws equipment, and the end torso fill hides the start near arm (it lies
//    over the chest). Both are redrawn as dashed phantom outlines in the end layer (machine_chest_press's workaround).
//  - Scale: reference 146.29 px/m.
// Plate labels (verified card): callouts = plate.checkpoints c1 (Back on pad), c5 (Elbows
//   forward), c4 (Full lockout); measure = elbow at the top, expect 180 ("fully straight", c4); Mistake = plate.mistake
//   c4 (low back arches off the pad: pelvis tips forward 10 deg, lumbar extends, 4.6 cm gap at backMid); tempo =
//   plate.tempo c12 (up 1, down 2, no pause: Press then Lower). The card still gives no bench angle (BACK stays 10).
// CARD: bench angle (BACK: not in the card's sources), seat tilt/height, start height/width/forwardness (START_DY,
//   START_X, START_DZ), top elbow (END_ELBOW), top width (END_X), feet (FOOT_Z), scapular set (SCAP).
import { landmarksOf, WINTER, REF, fk, resolve, normPose, bodyShapes, rootOnSeat } from '../engine.mjs';
import { inclineBench } from '../eq/inclineBench.mjs';
import { reclined } from './incline_dumbbell_press.mjs';

const H = 1.75;
const R = Math.PI / 180;
const BACK = 10;                                      // back pad from vertical (deg): upright notch (not in the card)
const SEAT_TILT = 10;                                 // seat front edge up (deg)
const SEAT_TOP = 0.45;                                // seat face height at the lifter's seat contact (m)
const BACK_LEN = 0.86;                                // back pad length (m): reaches past the back of the head
const BEAM_Z = [-0.50, 0.40];                         // floor beam rear / front ends (m)
const TRUNK = 0;                                      // spine neutral, no arch (c4)
const FOOT_Z = 0.50;                                  // mid-sole in front of the hip joint (m)
const SCAP = { elev: -1, pro: -2 };                   // blades down and back (cm) (c3)
const START_DY = 0.15;                                // start: grip above the shoulder joint (m): handle at jaw-ear level
const START_DZ = 0.10;                                // start: grip in front of the shoulder joint (m): elbows forward (c5)
const START_X = 0.40;                                 // start: grip off the midline (m): inner heads just outside the shoulders (c2)
const END_ELBOW = 0;                                  // top: elbow flexion (deg): fully straight (c4)
const END_X = 0.20;                                   // top: grip off the midline (m): over the shoulders

const REC = reclined({ back: BACK, seatTilt: SEAT_TILT, seatTop: SEAT_TOP, trunk: TRUNK });
const { hinge: HINGE, faces: F } = REC;
const feet = { l: { at: [0.10, 0, FOOT_Z] }, r: { at: [-0.10, 0, FOOT_Z] } };
const base = { ...REC.pose, scap: SCAP, plant: feet };
const lm0 = landmarksOf(base, H);
const S = { l: lm0['shoulder.l'], r: lm0['shoulder.r'] };
const L1 = WINTER.upperArm * H, L2 = WINTER.forearm * H + REF.gripOff * H;

const startReach = side => { const s = side === 'l' ? 1 : -1, sh = S[side];
  return { at: [s * START_X, sh[1] + START_DY, sh[2] + START_DZ], pole: [s * 0.8, -1, 0.6] }; };
const endReach = side => { const s = side === 'l' ? 1 : -1, sh = S[side];
  const d = Math.sqrt(L1 * L1 + L2 * L2 + 2 * L1 * L2 * Math.cos(END_ELBOW * R)), dx = s * END_X - sh[0];
  return { at: [s * END_X, sh[1] + Math.sqrt(d * d - dx * dx), sh[2]], pole: [s, 0, 0.2] }; };

const start = { ...base, reach: { l: startReach('l'), r: startReach('r') } };
const end = { ...base, reach: { l: endReach('l'), r: endReach('r') } };

/** Side-view check of the finish: angle of shoulder->elbow and elbow->grip from vertical (deg, + = forward). */
export const armCheck = () => { const e = landmarksOf(end, H), s0 = landmarksOf(start, H);
  const fromV = (a, b) => +(Math.atan2(b[2] - a[2], b[1] - a[1]) / R).toFixed(1);
  return { endUpperArm: fromV(e['shoulder.r'], e['elbow.r']), endForearm: fromV(e['elbow.r'], e['grip.r']), endGripDzCm: +((e['grip.r'][2] - e['shoulder.r'][2]) * 100).toFixed(1),
    startElbowForwardCm: +((s0['elbow.r'][2] - s0['shoulder.r'][2]) * 100).toFixed(1), startElbowBelowShoulderCm: +((s0['shoulder.r'][1] - s0['elbow.r'][1]) * 100).toFixed(1),
    startForearmFromVertical: fromV(s0['elbow.r'], s0['grip.r']) }; };

const ring = (c, r, n) => { const pts = []; for (let i = 0; i <= n; i++) { const a = 360 * i / n * R; pts.push([0, c[1] - r * Math.sin(a), c[2] + r * Math.cos(a)]); } return pts; };
const startDb = landmarksOf(start, H)['grip.r'];
const startDbPhantom = [{ type: 'line', pts: ring(startDb, 0.119 / 2, 6), cls: 'eq-line m-line', z: 'front' }];
// Engine workaround (machine_chest_press's, same code): the start near arm lies over the torso and the end torso fill
// hides the start layer, so the start near arm is redrawn as a dashed phantom outline (union boundary of the engine's
// own arm shapes, in metres) in the end layer.
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

// Mistake (card plate.mistake, c4): the low back arches away from the pad as the dumbbells go up. The pelvis tips
// forward MIS_TILT on the seat (seat landmark stays on the seat), the lumbar spine extends until the upper back is back
// on the pad (trunk solved), so the low back and the buttocks leave the pad. Arms keep the overhead grip.
const MIS_TILT = 10;                                  // pelvis tips forward (deg)
const bis = (f, lo, hi) => { for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (f(m) > 0) hi = m; else lo = m; } return (lo + hi) / 2; };
const tiltM = REC.pose.root.tilt + MIS_TILT, rootM = { at: rootOnSeat(REC.seatPt, tiltM, H), tilt: tiltM };
const padDist = p => (p[1] - F.back.point[1]) * F.back.normal[1] + (p[2] - F.back.point[2]) * F.back.normal[2];
const trunkM = bis(t => padDist(landmarksOf({ ...end, root: rootM, trunk: t }, H).backUpper), -40, 20);
const occM = n => fk(resolve(normPose({ ...end, root: rootM, trunk: trunkM, neck: n }, { height: H }), { height: H }).q, { height: H }).head([0, 0.955, -0.056]);
const neckM = bis(n => padDist(occM(n)), -40, 40);                                  // back of the skull stays on the pad
const mistakePose = { root: rootM, trunk: trunkM, neck: neckM };
const lmMis = landmarksOf({ ...end, ...mistakePose }, H);
const gapTo = lmMis.backMid, gapCm = padDist(gapTo), gapFrom = gapTo.map((v, i) => v - F.back.normal[i] * gapCm);
const PU = F.back.up, TICK = 2 / 146.29;
const tick = p => ({ kind: 'line', pts: [p.map((v, i) => v - PU[i] * TICK), p.map((v, i) => v + PU[i] * TICK)] });
export const mistakeInfo = () => ({ trunkDeg: +trunkM.toFixed(1), neckDeg: +neckM.toFixed(1), lowBackGapCm: +(gapCm * 100).toFixed(1), buttockGapCm: +(padDist(lmMis.buttock) * 100).toFixed(1) });

export default {
  id: 'dumbbell_shoulder_press', name: 'Seated Dumbbell Shoulder Press', view: 'side', facing: 'right',
  camera: { x0: 170, y0: 339 },
  poses: { start, end },
  equipment: [
    { type: 'floor', from: -0.75, to: 0.95 },
    ...inclineBench({ hinge: HINGE, back: BACK, seatTilt: SEAT_TILT, backLen: BACK_LEN, beamZ: BEAM_Z }),
    (lm, ctx) => (ctx.pose === 'end' ? [...startArmPhantom, ...startDbPhantom] : null),
    lm => [{ type: 'dumbbell', at: lm['grip.l'], axis: [1, 0, 0], z: 'back', part: 'db.l' },
      { type: 'dumbbell', at: lm['grip.r'], axis: [1, 0, 0], z: 'front', part: 'db' }],
  ],
  checks: [
    { landmark: 'seat', plane: { point: F.seat.point, normal: F.seat.normal }, pose: 'all', tol: 1 },       // pelvis ON the seat
    { landmark: 'backUpper', plane: { point: F.back.point, normal: F.back.normal }, pose: 'all', tol: 1 },  // upper back ON the pad (c1)
    { landmark: 'buttock', plane: { point: F.back.point, normal: F.back.normal }, pose: 'start', tol: 1 },  // buttocks ON the pad (c1)
    { landmark: 'buttock', plane: { point: F.back.point, normal: F.back.normal }, pose: 'end', tol: 1 },
    { landmark: 'backMid', above: { point: F.back.point, normal: F.back.normal }, pose: 'mistake' },       // gap shown in report
    { landmark: 'head', above: { point: F.back.point, normal: F.back.normal }, pose: 'all' },               // head never inside it
    { landmark: 'sole.r', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },          // feet ON the floor
    { landmark: 'sole.l', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
  ],
  startParts: ['arm.r', 'arm.l'],
  ghosts: { count: 3, parts: ['arm.r', 'db'] },
  trace: { point: 'grip.r', trim: [12, 12] },
  measure: { vertex: 'elbow.r', from: 'shoulder.r', to: 'wrist.r', radius: 18, title: 'Elbow', value: 'fully straight', expect: 180 },
  callouts: [
    { key: 'back', text: 'Back<br>on pad', anchor: 'backUpper', cue: 'Keep your head, shoulders and buttocks on the bench.' },
    { key: 'elbows', text: 'Elbows<br>forward', anchor: 'start:elbow.r', cue: 'Point your elbows in front of you, not straight out to the sides.' },
    { key: 'lockout', text: 'Full<br>lockout', anchor: 'wrist.r', cue: 'Press until your elbows are fully straight.' },
  ],
  tempo: [{ phase: 'Press', s: 1, move: true }, { phase: 'Lower', s: 2, move: true }],
  mistake: {
    pose: mistakePose,
    guides: [
      { kind: 'line', pts: [gapFrom, gapTo] }, tick(gapFrom), tick(gapTo),                 // pad-to-low-back gap
    ],
    tells: [
      { key: 'arch', text: 'Back<br>off pad', anchor: gapFrom, cue: 'Your low back arches away from the pad as you press.' },
      { key: 'hips', text: 'Hips tip<br>forward', anchor: { at: 'navel', pose: 'mistake' }, cue: 'Your hips tip forward and your belly pushes out.' },
    ],
  },
  pilot: { note: 'Bench angle 10° not in the verified card sources' },
  alt: 'Seated dumbbell shoulder press, side view. Sitting upright, head, back and hips on the pad, feet flat, the lifter presses the dumbbells from shoulder level, elbows slightly forward, to straight arms directly over the shoulders.',
};
