// Concentration curl (seated on a bench edge, one dumbbell, upper arm braced on the inner thigh), side view, figure faces
// screen right.
// View: SIDE (card plate.view = census view). The forward hinge, the upper arm hanging vertical (c2), the elbow sweep and
// the fault, the elbow wedged into the knee instead of the upper arm on the inner thigh (c3, c4), are sagittal enough to
// read side-on; the arm sits inside the near thigh (the engine draws the near arm on top).
// Form: research card docs/research/howto/cards/concentration_curl.json (research head baf2ff09, F-LB5-2: c14, notes),
//  plate section: start "Seated on the bench edge, knees wide, hinged forward with a neutral spine (c1); back of the
//  working upper arm braced on the inner thigh, upper arm near vertical (c1, c2); arm straight, dumbbell low (c8); feet
//  pressed into the floor, free hand on the other knee (c5)"; end "Elbow bent, dumbbell raised until the upper arm would
//  start to leave vertical (c7); triceps still on the thigh (c7); upper arm and torso unchanged (c6)".
// Clone source (D-LIB15-CLONE, copied never imported): dumbbell_biceps_curl (pilot A #109 @ ff7c5c4f: the dumbbell end-on,
//  the curl arm, its drawn elbow angles); rope_triceps_pushdown (pilot A: the elbow fixed in the world, the grip on the
//  forearm sphere about it and the IK pole toward it); the seated figure on rootOnSeat (machine_chest_press, main).
// Geometry decisions:
//  - Seated on the bench edge (SEAT_TOP), knees wide (c1): the feet FOOT_X off the mid-plane, the thighs abducted by the
//    plant IK; the trunk hinged forward from the hips with a neutral spine (trunk 0, c1), its tilt solved so the
//    shoulder joint sits straight above the elbow (c2 "upper arm as perpendicular to the ground as possible").
//  - The elbow E: on the near thigh at ALONG of its length from the hip (the inner thigh, short of the knee crease, c3),
//    one upper-arm radius medial of the thigh's inner surface (the triceps on the inner thigh, c1, c7). The upper arm
//    never moves (c6); the grip sits on the forearm sphere about E, the IK pole toward E (rope_triceps_pushdown's method).
//  - Start: arm straight (c8 "lower slowly to a straight arm"), elbow ELBOW_START. End: ELBOW_END, dumbbell_biceps_curl's
//    "near the top of the curl" (pilot A :63, 120 deg; c7 stops short of the shoulder).
//  - Free hand on the far knee (c5), by IK. The working side is the mirror of c1's named left (D-LIB15-MIRROR: c14 trains
//    each side in turn, card notes): the right arm on the right inner thigh, the free hand on the left knee.
// Unsourced numbers (13.3 must-fix 14): SEAT_TOP (45 cm, a flat bench), FOOT_X, FOOT_Z, ALONG, the bench length and place,
//  the dumbbell (vendor default).
// Callouts, Mistake, tempo: the 3 checkpoints are the callouts (c3, c2, c8); the Mistake is the card's plate.mistake (c4,
//  c3, drawable true): the elbow wedged into the knee crease, i.e. the elbow moved to the near knee's inner side (a place
//  the card names, not a drawn size), the upper arm leaning forward to it, the body unchanged. Tempo: Curl 1 s, Hold 1 s
//  (c12's drawing convention, LR-33), Lower 2 s (lb5/tempo.json); no Rest.
import { WINTER, REF, RADII, landmarksOf, resolve, normPose, rootOnSeat, bodyShapes, fk } from '../engine.mjs';
import { add, mul, norm, sub } from '../eq/parts.mjs';

const H = 1.75;
const SEAT_TOP = 0.45;
const SEAT = [0, SEAT_TOP, -0.02];
const FOOT_X = 0.30, FOOT_Z = 0.40;                    // knees far apart (c1), feet flat (c5)
const ALONG = 0.62;                                    // the elbow's place along the thigh, hip -> knee (inner thigh, c1, c3)
const ELBOW_START = 0, ELBOW_END = 120;                // straight (c8); near the top (dumbbell_biceps_curl :63)
const L1 = WINTER.upperArm * H, L2 = (WINTER.forearm + REF.gripOff) * H;
const ARM_R = RADII.upper[2] * H;                      // the upper arm's distal radius (the triceps side)
// the engine's limb radius profile (geom.mjs limbR), for the thigh's surface
const limbR = (rA, rM, rB, m) => t => (t < m ? rA + (rM - rA) * Math.sin((t / m) * Math.PI / 2) : rM + (rB - rM) * (1 - Math.cos(((t - m) / (1 - m)) * Math.PI / 2)));
const THIGH_R = limbR(...RADII.thigh);

const feet = { l: { at: [FOOT_X, 0, FOOT_Z], toe: [0.7, 0, 1], pole: [0.7 * 1.5, 0, 1] }, r: { at: [-FOOT_X, 0, FOOT_Z], toe: [-0.7, 0, 1], pole: [-0.7 * 1.5, 0, 1] } };   // toes and knees out with the wide knees (c1)
const bodyAt = tilt => ({ root: { at: rootOnSeat(SEAT, tilt, H), tilt }, trunk: 0, neck: -tilt * 0.6, scap: { elev: 0, pro: 2 }, plant: feet });
/** The elbow point for a body: on the near thigh at ALONG, ARM_R medial of its inner surface. */
const elbowFor = lm => {
  const hip = lm['hip.r'], knee = lm['knee.r'], at = add(hip, mul(sub(knee, hip), ALONG));
  return [at[0] + THIGH_R(ALONG) * H + ARM_R, at[1], at[2]];   // the right thigh's medial side is +x
};
// Solve the hinge: the shoulder joint straight above the elbow in the side view (bisection; throws with no root).
const gap = tilt => { const lm = landmarksOf({ ...bodyAt(tilt), shoulder: { flex: 0 } }, H); return lm['shoulder.r'][2] - elbowFor(lm)[2]; };
export const bisect = (f, lo, hi) => {
  if (!(f(lo) * f(hi) < 0)) throw new Error('concentration_curl: no solution in the bracket');
  for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if ((f(m) < 0) === (f(lo) < 0)) lo = m; else hi = m; }
  return (lo + hi) / 2;
};
export const TILT = bisect(gap, 0, 80);
const body = bodyAt(TILT);
const lmB = landmarksOf({ ...body, shoulder: { flex: 0 } }, H);
const S = lmB['shoulder.r'], E = elbowFor(lmB);
// the shoulder-to-elbow distance must be the upper arm: the elbow's height follows from it (it hangs straight down)
const E_AT = [E[0], S[1] - Math.sqrt(Math.max(0, L1 * L1 - (E[0] - S[0]) ** 2 - (E[2] - S[2]) ** 2)), E[2]];
// grip on the forearm sphere about E_AT at elbow flexion phi, swinging in the sagittal plane through E_AT
const U = norm(sub(E_AT, S));
const gripAt = phi => { const r = phi * Math.PI / 180, fwd = [0, 0, 1]; const d = add(mul(U, Math.cos(r)), mul(norm(sub(fwd, mul(U, U[2]))), Math.sin(r))); return add(E_AT, mul(d, L2)); };
const poleTo = g => { const u = norm(sub(g, S)), e = sub(E_AT, S), k = e[0] * u[0] + e[1] * u[1] + e[2] * u[2]; return norm(sub(e, mul(u, k))); };
const KNEE_L = lmB['knee.l'];
const freeHand = { at: [KNEE_L[0] - 0.02, KNEE_L[1] + 0.07, KNEE_L[2] - 0.02], pole: [1, 0.2, -0.4] };   // on the far knee (c5)
const armAt = phi => ({ reach: { r: { at: gripAt(phi), pole: poleTo(gripAt(phi)) }, l: freeHand }, wrist: 0 });
const SEG = 48;                                        // one key per Trace sample (the engine draws 48), so the grip path is the arc itself
const keys = Array.from({ length: SEG + 1 }, (_, i) => ELBOW_START + (ELBOW_END - ELBOW_START) * i / SEG).map(phi => ({ ...body, ...armAt(phi) }));
const start = keys[0], end = keys[SEG], via = keys.slice(1, SEG);
// Mistake (c4, c3): the elbow wedged into the knee crease: the elbow at the near knee, medial of it (a place the card
// names, not a drawn size). To reach it with the upper arm, the trunk hinges further: its tilt is solved so the shoulder
// joint is one upper arm from that point (bisection; throws with no root); the forearm keeps the end pose's elbow angle.
const KNEE_R = lmB['knee.r'];
const E_MIS = [KNEE_R[0] + RADII.kneeCap * H + ARM_R, KNEE_R[1], KNEE_R[2]];
const reachGap = tilt => Math.hypot(...sub(landmarksOf({ ...bodyAt(tilt), shoulder: { flex: 0 } }, H)['shoulder.r'], E_MIS)) - L1;
export const TILT_MIS = bisect(reachGap, TILT, 89);
const S_M = landmarksOf({ ...bodyAt(TILT_MIS), shoulder: { flex: 0 } }, H)['shoulder.r'];
const U_M = norm(sub(E_MIS, S_M));
const gripMis = (() => { const r = ELBOW_END * Math.PI / 180; const d = add(mul(U_M, Math.cos(r)), mul(norm(sub([0, 0, 1], mul(U_M, U_M[2]))), Math.sin(r))); return add(E_MIS, mul(d, L2)); })();
const misPole = (() => { const u = norm(sub(gripMis, S_M)), e = sub(E_MIS, S_M), k = e[0] * u[0] + e[1] * u[1] + e[2] * u[2]; return norm(sub(e, mul(u, k))); })();
const mistakePose = { ...bodyAt(TILT_MIS), reach: { r: { at: gripMis, pole: misPole }, l: freeHand } };
// The faulty arm on top (#290 6349640307 R5): closed dashed outlines of the faulty upper arm, elbow, forearm and fist, at
// the body's own lengths (bayesian_cable_curl's MIS_ARM, from dumbbell_biceps_curl's misArm), so the upper arm reads as
// one capsule from the faulty shoulder to the elbow at the knee.
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
const MIS_ARM = (() => {
  const bd = { height: H }, probe = { view: 'side', near: 'r', pxm: 1000, P: w => [w[2] * 1000, -w[1] * 1000] };
  const keys = ['upper.r', 'elbowcap.r', 'fore.r', 'fist.r'];
  return bodyShapes(fk(resolve(normPose(mistakePose, bd), bd).q, bd), probe).filter(sh => keys.includes(sh.key))
    .map(sh => (sh.key.includes('cap') ? sh.poly : cr(sh.poly, sh.key.startsWith('fist') ? 4 : 8)).map(([x, y]) => [0, -y / 1000, x / 1000]));
})();

// the inner-thigh contact plane (c1, c7): through E_AT, normal along the medial direction
const THIGH_N = [1, 0, 0];

export default {
  id: 'concentration_curl', name: 'Concentration Curl', view: 'side', facing: 'right',
  camera: { fit: true },
  poses: { start, end, via },
  equipment: [
    { type: 'floor', from: -0.75, to: 0.7 },
    { type: 'bench', at: [0, SEAT_TOP, -0.42], len: 1.0 },
    lm => ({ type: 'dumbbell', at: lm['grip.r'], part: 'db' }),
  ],
  checks: [
    { landmark: 'wrist.r', at: landmarksOf(start, H)['wrist.r'], pose: 'start', tol: 0.5 },   // the dumbbell in the working hand (c1)
    { landmark: 'heel.l', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
    { landmark: 'ball.l', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },   // feet pressed down throughout (c5)
    { landmark: 'seat', plane: { point: SEAT, normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
    { landmark: 'heel.r', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
    { landmark: 'ball.r', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
    // the triceps on the inner thigh (c1, c7): the elbow joint one arm radius medial of the thigh's inner surface
    ...['start', 'end'].map(pose => ({ landmark: 'elbow.r', plane: { point: E_AT, normal: THIGH_N }, pose, tol: 0.5 })),
    ...['start', 'end'].map(pose => ({ landmark: 'elbow.r', at: E_AT, pose, tol: 0.5 })),
  ],
  ghosts: { count: 3, parts: ['arm.r', 'db'] },
  trace: { point: 'grip.r', trim: [10, 12] },
  measure: { vertex: 'elbow.r', from: 'shoulder.r', to: 'wrist.r', radius: 20, title: 'Elbow', value: 'stop early', box: { left: 262, top: 172 } },
  callouts: [
    { key: 'thigh', text: 'Arm on<br>thigh', anchor: { at: 'elbow.r', off: [-4, 0] }, box: { left: 122, top: 206 }, cue: 'Brace the back of your upper arm on the inner thigh, not the knee.' },
    { key: 'vertical', text: 'Upper arm<br>vertical', anchor: { at: 'shoulderTop.r', off: [-4, 0] }, box: { left: 122, top: 154 }, prefer: 'left', cue: 'Keep the upper arm as close to vertical as you can.' },
    { key: 'slow', text: 'Slow<br>lowering', anchor: { at: 'grip.r', off: [0, -4] }, box: { left: 196, top: 100 }, prefer: 'left', cue: 'Resist the weight down to a straight arm.' },
  ],
  tempo: [{ phase: 'Curl', s: 1, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Lower', s: 2, move: true }],
  mistake: {
    pose: mistakePose,
    parts: ['torso', 'head', 'db'],
    guides: MIS_ARM.map(pts => ({ kind: 'dashed', pts: [...pts, pts[0]] })),
    tells: [
      { key: 'knee', text: 'Elbow in<br>knee', anchor: { at: 'elbow.r', pose: 'mistake' }, box: { left: 284, top: 268 }, cue: 'Your elbow is wedged into the knee instead of the arm on the thigh.' },
    ],
  },
  alt: 'Concentration curl, side view. Seated on the edge of a bench with the knees wide, hinged forward, the back of the working upper arm braced on the inner thigh. The upper arm hangs vertical while the elbow bends to raise the dumbbell, stopping short of the shoulder.',
};
