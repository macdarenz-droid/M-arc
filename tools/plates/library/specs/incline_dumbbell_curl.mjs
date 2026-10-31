// Incline dumbbell curl (seated on an incline bench, back on the pad, arms hanging behind the torso, supinated grip), side
// view, figure faces screen right. H row (D-LIB15-INCLINE, D-LIB15R2-MODES; lb5/DESIGN.md 17.4, 17.6): no parent; the
// incline seat lies outside any template.
// Clone sources (D-LIB9-CLONE, copied never imported): incline_dumbbell_press (pilot A, pinned): the reclined() solver
// (seat, pad line, head on the pad); dumbbell_biceps_curl (pilot A, pinned): the curl about a fixed elbow, the end-on
// dumbbell, the dashed start hex and the faulty-arm guides (cr, misArm). The bench is the composer on main,
// ../eq/inclineBench.mjs (imported, never edited).
// Form: research card docs/research/howto/cards/incline_dumbbell_curl.json (research a48b0594), plate section: start
//  "Seated, back against the incline pad (c2); arms hanging straight down, square to the floor, behind the torso line
//  (c2, c3); palms forward, wrists straight (c11)"; end "Elbows bent, dumbbells raised as high as they go without the
//  elbows drifting forward (c3); upper arms still behind the torso, elbows back (c4); back still on the pad (c2, c11)".
// Geometry decisions:
//  - Bench: back pad BACK = 35 deg from vertical, i.e. 55 deg from the floor, the middle of c1's 45-65; seat flat.
//  - Arms (c2): the upper arm hangs straight down from the shoulder joint (square to the floor), so it lies behind the
//    reclined torso line; the elbow stays there (E) and the forearm sweeps about it from straight (0) to ELBOW_END.
//  - ELBOW_END 130: the curl stops before the forearm passes the upper arm's line forward (c3 "stops where the elbows
//    would start drifting forward").
//  - Mistake (c4, c3): the upper arm swings MIS_FLEX forward off the vertical, elbow MIS_ELBOW, near the top
//    (dumbbell_biceps_curl's 45 and 120), drawn as the dashed faulty arm; no arrow: from the end elbow it would cross
//    the solid end figure (the 6 px clearance rule).
// Unsourced numbers (13.3 must-fix 14): BACK within c1's range, SEAT_TOP, FOOT_Z, the bench sizes (the composer's),
//  ELBOW_END, the dumbbells (the vendor hex), MIS_FLEX and MIS_ELBOW (drawn).
// Callouts, Mistake, tempo: checkpoints c1/c5, c2, c4/c3 are the callouts; plate.mistake c4/c3, drawable false: the top
//  fault, the wrists bending (c11), cannot be seen side-on, so the plate draws the next fault (F7, D-LIB15-F7); tempo
//  up 1, down 2, pause 0 (c12): Curl 1, Lower 2.
import { landmarksOf, fk, resolve, normPose, rootOnSeat, bodyShapes, WINTER, REF } from '../engine.mjs';
import { inclineBench, inclineFaces } from '../eq/inclineBench.mjs';

const H = 1.75;
const R = Math.PI / 180;
const BACK = 35;                                      // back pad from vertical (deg): 55 from the floor (c1: 45-65)
const SEAT_TILT = 0;                                  // seat flat
const SEAT_TOP = 0.45;                                // seat face height (m)
const BACK_LEN = 0.84;                                // back pad length (m), as incline_dumbbell_press
const BEAM_Z = [-0.62, 0.36];                         // floor beam rear / front ends (m)
const TRUNK = 0;
const FOOT_Z = 0.50;                                  // mid-sole in front of the hip joint (m)
const OCCIPUT = [0, 0.955, -0.056];                   // back of the skull (head frame, H), incline_dumbbell_press's
const ELBOW_END = 130;                                // top of the curl, before the elbow would drift (c3)
const MIS_FLEX = 45, MIS_ELBOW = 120;                 // the faulty upper arm forward off the vertical; elbow near the top
const HEX_R = 0.119 / 2;

const bisect = (f, lo, hi) => { if (!(f(lo) <= 0 && f(hi) >= 0)) throw new Error(`incline_dumbbell_curl: no solution in [${lo}, ${hi}]`); for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (f(m) > 0) hi = m; else lo = m; } return (lo + hi) / 2; };
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
const base = { ...REC.pose, scap: { elev: -1, pro: -1 }, wrist: 0, plant: feet };
const lm0 = landmarksOf(base, H);
const L1 = WINTER.upperArm * H, L2 = WINTER.forearm * H + REF.gripOff * H;
// the elbow straight below each shoulder joint (upper arm square to the floor, c2); the grip on the circle about it
const E = { l: [lm0['shoulder.l'][0], lm0['shoulder.l'][1] - L1, lm0['shoulder.l'][2]], r: [lm0['shoulder.r'][0], lm0['shoulder.r'][1] - L1, lm0['shoulder.r'][2]] };
const gripAt = (side, flex) => [E[side][0], E[side][1] - L2 * Math.cos(flex * R), E[side][2] + L2 * Math.sin(flex * R)];
const reachAt = flex => ({ l: { at: gripAt('l', flex), pole: [0, 0, -1] }, r: { at: gripAt('r', flex), pole: [0, 0, -1] } });
const start = { ...base, reach: reachAt(0.5) };
const end = { ...base, reach: reachAt(ELBOW_END) };
// Mistake: the upper arm forward MIS_FLEX off the vertical, elbow MIS_ELBOW (forward-up arc)
const misGrip = side => { const s = lm0[`shoulder.${side}`], e = [s[0], s[1] - L1 * Math.cos(MIS_FLEX * R), s[2] + L1 * Math.sin(MIS_FLEX * R)], t = (MIS_FLEX + MIS_ELBOW) * R;
  return [e[0], e[1] - L2 * Math.cos(t), e[2] + L2 * Math.sin(t)]; };   // the forearm MIS_FLEX + MIS_ELBOW from straight down
const mistakePose = { reach: { l: { at: misGrip('l'), pole: [0, -1, -0.3] }, r: { at: misGrip('r'), pole: [0, -1, -0.3] } } };
const startHex = g => Array.from({ length: 7 }, (_, k) => [g[0], g[1] - HEX_R * Math.sin(k * Math.PI / 3), g[2] + HEX_R * Math.cos(k * Math.PI / 3)]);
const cr = (ps, k = 8) => {
  const n = ps.length, g = i => ps[(i + n) % n], out = [];
  for (let i = 0; i < n; i++) {
    const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2);
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    for (let j = 0; j < k; j++) { const t = j / k, u = 1 - t;
      out.push([0, 1].map(d => u * u * u * p1[d] + 3 * u * u * t * c1[d] + 3 * u * t * t * c2[d] + t * t * t * p2[d])); }
  }
  return out;
};
const inside = (p, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
  const [xi, yi] = poly[i], [xj, yj] = poly[j];
  if ((yi > p[1]) !== (yj > p[1]) && p[0] < (xj - xi) * (p[1] - yi) / (yj - yi) + xi) c = !c; } return c; };
// The faulty arm (Mistake only), dumbbell_biceps_curl's method: engine outlines of the faulty near arm as guides.
function misArm() {
  const bd = { height: H }, probe = { view: 'side', near: 'r', pxm: 1000, P: w => [w[2] * 1000, -w[1] * 1000] };
  const keys = ['upper.r', 'elbowcap.r', 'fore.r', 'fist.r'];
  return bodyShapes(fk(resolve(normPose({ ...end, ...mistakePose }, bd), bd).q, bd), probe).filter(sh => keys.includes(sh.key))
    .map(sh => (sh.key.includes('cap') ? sh.poly : cr(sh.poly, sh.key.startsWith('fist') ? 4 : 8)).map(([x, y]) => [0, -y / 1000, x / 1000]));
}
const MIS_ARM = misArm();
const UP = F.back.up, NB = F.back.normal, PAD = 0.07;
const onPadBack = u => [0, HINGE[1] + UP[1] * u - NB[1] * PAD, HINGE[2] + UP[2] * u - NB[2] * PAD];

export default {
  id: 'incline_dumbbell_curl', name: 'Incline Dumbbell Curl', view: 'side', facing: 'right',
  camera: { fit: true },
  poses: { start, end },
  equipment: [
    { type: 'floor', from: -1.0, to: 0.8 },
    ...inclineBench({ hinge: HINGE, back: BACK, seatTilt: SEAT_TILT, backLen: BACK_LEN, beamZ: BEAM_Z }),
    lm => ({ type: 'dumbbell', at: lm['grip.r'], part: 'arm.r' }),
    (lm, ctx) => (ctx.pose === 'end' ? { type: 'line', cls: 'eq-cable m-line', pts: startHex(ctx.start['grip.r']), z: 'front', part: 'startdb' } : null),
  ],
  checks: [
    ...['wrist.r', 'wrist.l'].map(landmark => ({ landmark, at: landmarksOf(start, H)[landmark], pose: 'start', tol: 0.5 })),   // a dumbbell in each hand (c1)
    { landmark: 'seat', plane: { point: F.seat.point, normal: F.seat.normal }, pose: 'all', tol: 1 },       // on the seat (c1)
    { landmark: 'backUpper', plane: { point: F.back.point, normal: F.back.normal }, pose: 'all', tol: 1 },  // back on the pad (c2)
    { landmark: 'buttock', plane: { point: F.back.point, normal: F.back.normal }, pose: 'all', tol: 1 },    // buttocks on the pad: the back's low end (c2; D-LIB11-SACRUM)
    { landmark: 'head', above: { point: F.back.point, normal: F.back.normal }, pose: 'all' },
    { landmark: 'sole.r', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
    ...['start', 'end'].map(pose => ({ landmark: 'elbow.r', at: E.r, pose, tol: 0.5 })),                    // upper arm square to the floor, elbow back (c2, c4)
    { landmark: 'elbow.r', above: { point: [0, 0, E.r[2] + 0.10], normal: [0, 0, 1] }, pose: 'mistake' },  // fault: the elbow 10 cm forward
  ],
  startParts: ['arm.r'],
  ghosts: { count: 3, parts: ['arm.r'] },
  trace: { point: 'grip.r', trim: [12, 14] },
  measure: { vertex: 'elbow.r', from: { at: 'grip.r', pose: 'start' }, to: 'grip.r', radius: 28, title: 'Elbow', value: 'full range' },   // radius 28 (incline_dumbbell_press's): its label leader clears the Trace by 6 px
  callouts: [
    { key: 'bench', text: 'Bench<br>45-65°', anchor: onPadBack(0.5), cue: 'Set the bench high but not upright, about 45 to 65 degrees.' },
    { key: 'arms', text: 'Arms<br>hang down', anchor: 'shoulder.r', cue: 'Start with the arms straight down, square to the floor.' },
    { key: 'elbows', text: 'Elbows<br>back', anchor: 'elbow.r', cue: 'Keep the elbows pinned back. Stop before they drift forward.' },
  ],
  tempo: [{ phase: 'Curl', s: 1, move: true }, { phase: 'Lower', s: 2, move: true }],
  mistake: {
    pose: mistakePose,
    parts: ['arm.r'],
    guides: [
      ...MIS_ARM.map(pts => ({ kind: 'dashed', pts: [...pts, pts[0]] })),   // the faulty arm, swung forward
    ],
    tells: [
      { key: 'elbows', text: 'Elbows<br>forward', anchor: { at: 'elbow.r', pose: 'mistake', off: [0, 7] }, cue: 'Your elbows drift forward as the dumbbells rise.' },
      { key: 'shoulder', text: 'Shoulder<br>takes over', anchor: { at: 'shoulder.r', pose: 'mistake', off: [8, -2] }, cue: 'The arm comes forward and the shoulder takes the stretch off the biceps.' },
    ],
  },
  pilot: { drawableFault: 'top fault: the wrists bending (c11) cannot be seen side-on; drawn: the next fault, the elbows drifting forward (c4, c3)' },
  alt: 'Incline dumbbell curl, side view. Seated on a high incline bench with the back on the pad, the arms hang straight down behind the torso. The elbows stay back while the forearms curl the dumbbells up.',
};
