// Incline Dumbbell Press (adjustable bench at 45 deg, pronated grip), side view, facing right. BENCH child (incline).
// View: SIDE (card): the bench angle, the elbow under the wrist and the back staying on the pad all read in the
// sagittal plane.
// Sources: research card docs/research/howto/cards/incline_dumbbell_press.json (branch claude/libht-research e2a70bc,
// verified), claims c1/c2 (bench about 45 deg, not steeper), c4 (blades down and back; head, shoulders,
// buttocks and feet in contact), c17 + c7 + c5 (start: arms straight and vertical, dumbbells directly above the shoulder
// joints, above eye height, in front of the face, never over it), c6 (lower to the upper chest, slightly wide toward the armpits, touch gently), c7 (elbows under
// the wrists), c8 (hips stay on the seat, no low-back arch).
// Geometry decisions:
//  - Bench: library composer `inclineBench` (typical commercial adjustable bench): back pad BACK = 45 deg from
//    vertical (c1), seat raised SEAT_TILT = 12 deg at the front (the first notch on most adjustable benches, so the
//    lifter does not slide down), seat top 45 cm at the lifter's seat contact, back pad 84 cm so it carries the head
//    (c4), pads 7 cm, both 29 cm wide; floor beam 1.08 m (BEAM_Z) so its front foot stays behind the lifter's feet.
//  - Reclined class: `reclined()` solves the pelvis tilt that lays the buttock-to-upper-back line at the pad angle
//    (trunk = TRUNK, neutral), puts the `seat` landmark on the seat (rootOnSeat), takes the pad face as the line
//    through buttock and backUpper and the hinge as where it meets the seat face, then solves the neck so the back
//    of the skull (OCCIPUT) is on the pad. Checks prove: seat on the seat face, backUpper and buttock on the back
//    face (tol 1 cm), head clearance, soles on the floor.
//  - Feet flat, mid-sole FOOT_Z in front of the hip joint: shins about vertical (c4).
//  - Blades down and back (SCAP) (c4).
//  - Start (top, c17, c7, c5): arms straight (TOP_ELBOW 4 deg) and vertical, grips directly above the shoulder joints
//    (22.7 cm off the midline): above eye height and in front of the face (see topInfo).
//  - End (bottom, c6, c7): elbow placed in the torso's frame, BOTTOM_ABD = 45 deg out from the torso seen square to
//    the pad and BOTTOM_DIP = 20 deg behind the chest plane (elbows just below the pad line); grip straight above the
//    elbow in the side view (forearm vertical, c7), 42 cm off the midline (forearm leans in 3.8 deg in the front plane).
//    Result: the hex sits over the upper chest / collarbone in side view (grip 6 cm behind and 2.5 cm above the
//    upper-chest surface point at thorax height .77 H, i.e. beside it). Tried and rejected: 55 deg / 25 deg (the
//    grip lands at the chin, the forearm folds to 40 deg) and a grip placed on the chest surface (forces a 30 deg
//    tucked elbow). With a vertical forearm on a 45 deg incline the grip can never sit lower than the shoulder
//    joint, so "upper chest" is met in side view, not by touching the chest's front.
//  - Engine limit: the start layer never draws equipment, so the start dumbbell is a dashed phantom hex in the end
//    layer (as dumbbell_bench_press / machine_chest_press).
//  - Scale: reference 146.29 px/m.
// Plate labels (verified card): callouts = plate.checkpoints c2 (Bench at 45°), c7 (Elbows
//   under wrists), c6 (To upper chest); measure = back-pad angle from vertical, expect 45 (c1); Mistake = plate.mistake
//   c8 (low back arches off the pad: pelvis tips forward 16 deg, buttocks and upper back stay on the pads, dashed
//   lumbar bow and gap marker); tempo = plate.tempo c14 (up 1, down 2, no pause: Lower then Press).
// CARD: bench angle (BACK), seat tilt (SEAT_TILT), seat height (SEAT_TOP), top grip over the shoulder joint (TOP_X, TOP_ELBOW),
//   bottom flare/depth/width (BOTTOM_ABD, BOTTOM_DIP, BOTTOM_X), feet (FOOT_Z), scapular set (SCAP).
import { landmarksOf, fk, resolve, normPose, rootOnSeat, WINTER, REF } from '../engine.mjs';
import { inclineBench, inclineFaces } from '../eq/inclineBench.mjs';

const H = 1.75, BODY = { height: H };
const R = Math.PI / 180;
const BACK = 45;                                      // back pad from vertical (deg) (c1)
const SEAT_TILT = 12;                                 // seat front edge up (deg)
const SEAT_TOP = 0.45;                                // seat face height at the lifter's seat contact (m)
const BACK_LEN = 0.84;                                // back pad length (m): reaches past the back of the head
const BEAM_Z = [-0.72, 0.36];                        // floor beam rear / front ends (m): front foot clear of the lifter's feet
const TRUNK = 0;                                      // spine neutral against the pad (no arch, c8)
const FOOT_Z = 0.50;                                  // mid-sole in front of the hip joint (m)
const SCAP = { elev: -1, pro: -3 };                   // blades back and down (cm) (c4)
const TOP_ELBOW = 4;                                  // top: elbow flexion (deg), arms straight (c5)
const TOP_X = 0.227;                                  // top: grip centre off the midline (m): over the shoulder joints (c17)
const BOTTOM_ABD = 45;                                // bottom: upper arm out from the torso, seen square to the pad (deg)
const BOTTOM_DIP = 20;                                // bottom: upper arm behind the chest plane (deg): elbows below the pad line
const UPPER_CHEST = 0.77;                             // upper-chest level (thorax height, H), for the report (c6)
const BOTTOM_X = 0.42;                                // bottom: grip centre off the midline (m), slightly wide (c6)
const OCCIPUT = [0, 0.955, -0.056];                   // back of the skull, side head outline (head frame, H)
const EYE = [0, 0.935, 0.045];                        // eye, side head outline (head frame, H)

const bisect = (f, lo, hi) => { if (!(f(lo) <= 0 && f(hi) >= 0)) throw new Error(`incline_dumbbell_press: no solution in [${lo}, ${hi}]`); for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (f(m) > 0) hi = m; else lo = m; } return (lo + hi) / 2; };
const skOf = (p, height = H) => { const b = { height }; return fk(resolve(normPose(p, b), b).q, b); };

/** Reclined on a seat + back pad: returns { pose: { root, trunk, neck }, hinge, faces, padU, padL }. */
export function reclined({ back, seatTilt = 0, seatTop, trunk = 0, height = H }) {
  const seatPt = [0, seatTop, 0];
  const at = tilt => ({ root: { at: rootOnSeat(seatPt, tilt, height), tilt }, trunk });
  const ang = tilt => { const lm = landmarksOf(at(tilt), height), d = [lm.backUpper[1] - lm.buttock[1], lm.backUpper[2] - lm.buttock[2]];
    return Math.atan2(-d[1], d[0]) / R; };   // recline of the buttock->backUpper line from vertical
  const tilt = bisect(t => back - ang(t), -100, 20);   // the recline falls as the pelvis tilts forward
  const p0 = at(tilt), lm = landmarksOf(p0, height);
  const u = [0, lm.backUpper[1] - lm.buttock[1], lm.backUpper[2] - lm.buttock[2]];
  // hinge: the pad line meets the seat plane (through seatPt, normal from seatTilt)
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
const lm0 = landmarksOf(base, H), sk0 = skOf(base);
const S = { l: lm0['shoulder.l'], r: lm0['shoulder.r'] };
const L1 = WINTER.upperArm * H, L2 = WINTER.forearm * H + REF.gripOff * H;

// Top (c17, c7, c5): arms straight and vertical, grips directly above the shoulder joints.
const EYE_W = sk0.head(EYE);
const topReach = side => { const s = side === 'l' ? 1 : -1, sh = S[side];
  const d = Math.sqrt(L1 * L1 + L2 * L2 + 2 * L1 * L2 * Math.cos(TOP_ELBOW * R));
  const dx = s * TOP_X - sh[0], dz = 0, dy = Math.sqrt(d * d - dx * dx - dz * dz);
  return { at: [sh[0] + dx, sh[1] + dy, sh[2] + dz], pole: [s, -0.3, 0.2] }; };
// Bottom (c6, c7): the elbow is placed in the torso's frame, BOTTOM_ABD out from the torso seen square to the pad
// ("slightly wide toward the armpits") and BOTTOM_DIP behind the chest plane (elbows below the pad line); the grip is
// straight above the elbow in the side view (forearm vertical, elbow under the wrist) and BOTTOM_X off the midline.
const UP = F.back.up, NB = F.back.normal;                                 // torso axis (toward the head), chest normal
const botReach = side => { const s = side === 'l' ? 1 : -1, sh = S[side];
  const a = BOTTOM_ABD * R, dp = BOTTOM_DIP * R, feetward = L1 * Math.cos(dp) * Math.cos(a), back = L1 * Math.sin(dp);
  const E = [sh[0] + s * L1 * Math.cos(dp) * Math.sin(a), sh[1] - UP[1] * feetward - NB[1] * back, sh[2] - UP[2] * feetward - NB[2] * back];
  const off = Math.abs(E[0]) - BOTTOM_X;
  return { at: [s * BOTTOM_X, E[1] + Math.sqrt(L2 * L2 - off * off), E[2]], pole: E.map((v, i) => v - sh[i]), E }; };
const CH = sk0.thorax([0, UPPER_CHEST, 0.072]);                            // upper-chest surface point, for the report
export const bottomInfo = () => { const b = botReach('r'), d = b.E.map((v, i) => v - S.r[i]);
  // flare: upper arm from the torso axis in the torso's frontal plane; depth: below the chest (pad) plane
  const up = F.back.up, nn = F.back.normal, along = d[1] * up[1] + d[2] * up[2], out = Math.abs(d[0]), perp = d[1] * nn[1] + d[2] * nn[2];
  return { flareDeg: +(Math.atan2(out, -along) / R).toFixed(1), elbowBelowShoulderPlaneDeg: +(Math.asin(-perp / L1) / R).toFixed(1),
    forearmLeanFrontDeg: +(Math.asin((Math.abs(b.E[0]) - BOTTOM_X) / L2) / R).toFixed(1), hinge: HINGE.map(v => +v.toFixed(3)),
    gripVsUpperChestCm: { forward: +((b.at[2] - CH[2]) * 100).toFixed(1), up: +((b.at[1] - CH[1]) * 100).toFixed(1) } }; };

const start = { ...base, reach: { l: topReach('l'), r: topReach('r') } };
/** Top grip against the face: + = in front of (toward the feet of) the eye / chin, cm; height above the eye, cm. */
export const topInfo = () => { const g = topReach('r').at, chin = lm0.chin;
  return { gripForwardOfEyeCm: +((g[2] - EYE_W[2]) * 100).toFixed(1), gripForwardOfChinCm: +((g[2] - chin[2]) * 100).toFixed(1), gripAboveEyeCm: +((g[1] - EYE_W[1]) * 100).toFixed(1) }; };
const end = { ...base, reach: { l: (({ E, ...r }) => r)(botReach('l')), r: (({ E, ...r }) => r)(botReach('r')) } };

const ring = (c, r, n) => { const pts = []; for (let i = 0; i <= n; i++) { const a = 360 * i / n * R; pts.push([0, c[1] - r * Math.sin(a), c[2] + r * Math.cos(a)]); } return pts; };
const startDb = landmarksOf(start, H)['grip.r'];
const startDbPhantom = [{ type: 'line', pts: ring(startDb, 0.119 / 2, 6), cls: 'eq-line m-line', z: 'front' }];

// Mistake (card plate.mistake, c8): the low back arches off the bench as the dumbbells go up (pilot A's arch method,
// as dumbbell_shoulder_press). The pelvis tips forward MIS_TILT; the root slides along the seat face until the
// buttocks are back on the pad (seat landmark on the seat, buttock on the pad: the hips stay on the bench, as the
// existing all-pose checks require); the lumbar spine extends until the upper back is back on the pad (trunk solved)
// and the neck puts the back of the skull on the pad, so only the low back leaves the pad. The grips move with the
// shoulders, so the arms keep the bottom shape.
const MIS_TILT = 16;                                  // pelvis tips forward (deg), an exaggerated arch so it reads
const padDist = p => (p[1] - F.back.point[1]) * F.back.normal[1] + (p[2] - F.back.point[2]) * F.back.normal[2];
const SEAT_T = [0, Math.sin(SEAT_TILT * R), Math.cos(SEAT_TILT * R)];          // along the seat face, toward the front
const tiltM = REC.pose.root.tilt + MIS_TILT;
const rootAt = sl => ({ at: rootOnSeat(REC.seatPt.map((v, i) => v + SEAT_T[i] * sl), tiltM, H), tilt: tiltM });
const slideM = (() => { const f = sl => padDist(landmarksOf({ ...end, root: rootAt(sl) }, H).buttock);
  return f(-0.2) > f(0.2) ? bisect(sl => -f(sl), -0.2, 0.2) : bisect(f, -0.2, 0.2); })();
const rootM = rootAt(slideM);
const trunkM = bisect(t => padDist(landmarksOf({ ...end, root: rootM, trunk: t }, H).backUpper), -40, 20);
const neckM = bisect(n => padDist(skOf({ ...end, root: rootM, trunk: trunkM, neck: n }).head(OCCIPUT)), -40, 40);
const misReach = (() => { const E = landmarksOf(end, H), M = landmarksOf({ ...end, root: rootM, trunk: trunkM, neck: neckM }, H), out = {};
  for (const sd of ['l', 'r']) { const d = [0, 1, 2].map(i => M[`shoulder.${sd}`][i] - E[`shoulder.${sd}`][i]);
    out[sd] = { ...end.reach[sd], at: end.reach[sd].at.map((v, i) => v + d[i]) }; }
  return out; })();
const mistakePose = { root: rootM, trunk: trunkM, neck: neckM, reach: misReach };
const lmMis = landmarksOf({ ...end, ...mistakePose }, H);
// The engine blends the outline over the lumbar bend, so the drawn arch alone is small. A dashed red lumbar line (a
// Mistake guide, not masked) bows from the buttocks on the pad to the upper back on the pad, its middle ARCH off the
// pad, and the gap between the pad and the top of the bow is marked with the house gap marker (line with end ticks).
const ARCH = 0.127;
const ARCH_MIN = 0.035;                               // the Mistake's backMid clears the pad by at least this (2.2 cm in the correct pose)
const onPad = p => p.map((v, i) => v - F.back.normal[i] * padDist(p));
const ARCH_PTS = (() => {
  const A = onPad(lmMis.buttock), B = onPad(lmMis.backUpper), P = A.map((v, i) => (v + B[i]) / 2 + F.back.normal[i] * ARCH);
  const C = P.map((v, i) => 2 * v - (A[i] + B[i]) / 2);                                   // the bow passes P at t = 0.5
  return Array.from({ length: 17 }, (_, k) => { const t = k / 16; return A.map((v, i) => (1 - t) ** 2 * v + 2 * t * (1 - t) * C[i] + t * t * B[i]); });
})();
const gapTo = ARCH_PTS[8], gapFrom = onPad(gapTo);
// The gap itself: the region between the pad and the bow is cleared to the card colour ('eq', end layer, Mistake only),
// so the solid (correct) figure does not hide it.
const GAP_FILL = { type: 'poly', pts: [...ARCH_PTS, onPad(lmMis.backUpper)], cls: 'eq', z: 'front', part: 'archgap' };
const TICK = 2 / 146.29;
const tick = p => ({ kind: 'line', pts: [p.map((v, i) => v - F.back.up[i] * TICK), p.map((v, i) => v + F.back.up[i] * TICK)] });
export const mistakeInfo = () => ({ pelvisTiltDeg: MIS_TILT, slideCm: +(slideM * 100).toFixed(1), trunkDeg: +trunkM.toFixed(1), neckDeg: +neckM.toFixed(1),
  lowBackGapCm: +(padDist(gapTo) * 100).toFixed(1), backMidGapCm: +(padDist(lmMis.backMid) * 100).toFixed(1), buttockGapCm: +(padDist(lmMis.buttock) * 100).toFixed(1) });
// label and measure points on the back face of the back pad (PAD = 7 cm, the composer default)
const PAD = 0.07, onPadBack = u => [0, HINGE[1] + UP[1] * u - NB[1] * PAD, HINGE[2] + UP[2] * u - NB[2] * PAD];

export default {
  id: 'incline_dumbbell_press', name: 'Incline Dumbbell Press', view: 'side', facing: 'right',
  camera: { x0: 200, y0: 339 },
  poses: { start, end },
  equipment: [
    { type: 'floor', from: -1.05, to: 0.85 },
    ...inclineBench({ hinge: HINGE, back: BACK, seatTilt: SEAT_TILT, backLen: BACK_LEN, beamZ: BEAM_Z }),
    (lm, ctx) => (ctx.pose === 'end' ? (ctx.mistake ? [...startDbPhantom, GAP_FILL] : startDbPhantom) : null),
    lm => [{ type: 'dumbbell', at: lm['grip.l'], axis: [1, 0, 0], z: 'back', part: 'db.l' },
      { type: 'dumbbell', at: lm['grip.r'], axis: [1, 0, 0], z: 'front', part: 'db' }],
  ],
  checks: [
    { landmark: 'seat', plane: { point: F.seat.point, normal: F.seat.normal }, pose: 'all', tol: 1 },       // pelvis ON the seat (c8)
    { landmark: 'backUpper', plane: { point: F.back.point, normal: F.back.normal }, pose: 'all', tol: 1 },  // upper back ON the pad (c4)
    { landmark: 'buttock', plane: { point: F.back.point, normal: F.back.normal }, pose: 'all', tol: 1 },    // buttocks ON the pad
    { landmark: 'backMid', above: { point: F.back.point.map((v, i) => v + F.back.normal[i] * ARCH_MIN), normal: F.back.normal }, pose: 'mistake' },   // fault: low back off the pad (c8)
    { landmark: 'head', above: { point: F.back.point, normal: F.back.normal }, pose: 'all' },               // head never inside it
    { landmark: 'sole.r', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },          // feet ON the floor
    { landmark: 'sole.l', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
  ],
  startParts: ['arm.r', 'arm.l'],
  ghosts: { count: 3, parts: ['arm.r', 'db'] },
  trace: { point: 'grip.r', trim: [12, 12] },
  measure: { vertex: onPadBack(0.74), from: 'up', to: { dir: [UP[2], UP[1]] }, radius: 28, title: 'Bench', value: '45°, not steeper', expect: BACK },
  callouts: [
    { key: 'bench', text: 'Bench<br>at 45°', anchor: onPadBack(0.14), cue: 'Set the back pad to about 45 degrees, not steeper.' },
    { key: 'elbows', text: 'Elbows<br>under wrists', anchor: 'elbow.r', cue: 'Keep your forearms vertical under the dumbbells.' },
    { key: 'chest', text: 'To upper<br>chest', anchor: 'grip.r', cue: 'Lower the dumbbells to the top of your chest, slightly wide.' },
  ],
  tempo: [{ phase: 'Lower', s: 2, move: true }, { phase: 'Press', s: 1, move: true }],
  mistake: {
    pose: mistakePose,
    guides: [
      { kind: 'dashed', pts: ARCH_PTS },                                                   // the arched low back
      { kind: 'line', pts: [gapFrom, gapTo] }, tick(gapFrom), tick(gapTo),                 // pad-to-low-back gap
      { kind: 'arrow', from: { at: 'navel', pose: 'mistake', off: [2, -2] }, to: { at: 'navel', pose: 'mistake', off: [14, -14] } },   // belly pushes up
    ],
    tells: [
      { key: 'arch', text: 'Low back<br>arches', anchor: gapFrom, cue: 'Your low back arches off the bench as you press.' },
      { key: 'hips', text: 'Hips<br>tip', anchor: { at: 'navel', pose: 'mistake' }, cue: 'Your hips tip and your belly pushes up.' },
    ],
  },
  alt: 'Incline dumbbell press, side view. On a bench set to 45 degrees, head, back and hips on the pads, feet flat, the lifter lowers the dumbbells from straight arms above the shoulders to the upper chest, forearms vertical, then presses back up.',
};
