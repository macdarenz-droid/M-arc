// Resisted hip flexion (cable, ankle cuff, low pulley behind), side view, figure facing away from the column (screen
// right). LIB-18 (LB8 bulk, mode H; clone hanging_leg_raise (main, the 8: its Trace trim :124 and its arch :67-69);
// pose class stand, single leg: pilot A's single_leg_romanian_deadlift method; the slice's `ankleCuff` and its anchor
// cable_kickback for the cuff, cable and column handling, D-LIB18-CLONE).
// View: side (card plate.view = census view). The knee driving up and forward (c2), the thigh's level (c5) and the
//  drawn fault, the trunk leaning back with the lower back arched (c7, c18), are all front-to-back.
// Sources: research card docs/research/howto/cards/resisted_hip_flexion.json (research head 596dbe07): callouts =
//  plate.checkpoints (c3/c12 Stand tall, c2/c5 Thigh to hip, c6/c7 No back arch); Mistake = plate.mistake (c7, c18, c5,
//  c11, drawable true; topFault `lean`); tempo = the card's tempo (c8, c15: up 2, pause 2, down 2; lb8/tempo.json:
//  Lift, Hold, Lower).
// Clone sources (copied, never imported; D-LIB9-CLONE): hanging_leg_raise.mjs (main) for the lumbar arch size and the
//  Trace trim; single_leg_romanian_deadlift.mjs (pilot A @ dcac4a38):19-36 for the single-leg stance, its Winter centre
//  of mass and its bracketed root finder (here it throws on a bracket with no root); cable_kickback.mjs (this branch)
//  for the column, the cuff ring, the stack rest, the tangent of the Mistake cable and the start-phantom outline.
// Equipment: the vendor cableColumn (frame, low pulley, cable, stack) behind the lifter (c1, c2 "Face away from the
//  machine"), the pulley at its lowest setting (c1, c2 "a low cable"); the `ankleCuff` composer on the working ankle
//  (c2), its D-ring on the pulley side (behind the ankle); floor.
// Sides (D-LIB18-SIDES): no side is named, so the right leg (the near side in the engine's side view) works and the
//  left (far) leg stands; the frame hand is the right hand (card plateFacts wrist.r: the hand nearer the frame in the
//  drawn view, the column in the working leg's plane; LB8 NOTE RULED Q10.9). No mirror.
// Pose map (identity): start = plate.start, end = plate.end, Mistake against the end pose (c7, c18).
// Geometry decisions (confirmed by the engine report `angles` and `checks`, and by the drawn-item tests):
//  Stance (c12 "Stand tall and keep your standing leg steady"): the left foot flat at mid-sole z = 0, STANCE_X out
//   (under the left hip), knee STANCE_KNEE (c12 "Stand tall" read as straight, barbell_back_squat.mjs:30). Torso
//   upright (c3 "maintain upright posture"): pelvis tilt 0, lumbar 0, neck 0 in start, vias and end. Each pose's root
//   height is SOLVED for the stance knee and its forward place SOLVED so the whole-body centre of mass (Winter 2009
//   Table 4.1, as single_leg_romanian_deadlift.mjs:19-36) sits over the stance mid-sole (D-LIB18-BALANCE: the
//   standing foot carries the body; the hand on the frame steadies only, c2).
//  Frame hand (c2 "hold the frame for balance"): the right arm reaches back and down ARM_BACK behind the vertical with
//   the elbow ELBOW_SOFT short of straight; the column's near upright stands where that reach lands in the start pose
//   (COLUMN_Z solved), and the fist stays on it in every pose (IK). The left arm hangs at the side, elbow ELBOW_SOFT.
//  Working leg: start (c5 "full hip extension behind body"; plate.frames "slightly behind the body"): hip START_HIP_EXT
//   of extension, knee START_KNEE (standing tall, as the stance knee), the ankle SOLVED so the toe is START_TOE_CLEAR
//   above the floor (the foot just off the floor, the weight on the standing leg). End (c5 "thigh parallel to floor",
//   the drawn option of its "or"; c3 "bending knee toward chest"; c2 "Drive your knee up and forward"): hip END_HIP
//   (thigh level with the pelvis level, c6 "Hips level"), knee END_KNEE (shank plumb), foot neutral (END_ANKLE).
//   Every bend lies in the sagittal plane. Two vias at 1/3 and 2/3 of the joint path, each balanced, are the ghosts.
//  Cable (D-LIB18-CABLE): from the low pulley behind to the cuff's D-ring on the back of the ankle in every pose, in
//   the plane of the working leg (the primitive's 'center' level). The stack rises by the cable's extension.
//  Mistake (c7 "Don't lean back or arch your lower back to lift higher", c18 "Excessive lower back arch."): the lumbar
//   spine extends M_LEAN with the pelvis level, so the thorax leans M_LEAN back (hanging_leg_raise.mjs:69, trunk -12,
//   "pelvis tipped forward so the lower back arches (lumbar extension 12 deg)": here the pelvis is held level, so the
//   same 12 deg extension leans the trunk back); the working hip and knee keep their end angles; the root is SOLVED
//   again so the centre of mass stays over the standing foot (an unlabelled counter-move for balance, the hips forward);
//   the fist stays on the upright. The engine masks the faulty back inside the solid trunk, so the faulty back contour
//   (upper back to buttock) is drawn as a dashed Mistake guide on top, and both tells sit on it. The Mistake cable is a
//   dashed guide from the pulley rim to the Mistake D-ring; the stack stays at the end lift (D-LIB17-B4).
//  Hidden start parts: the start working leg and cuff lie under the end figure's standing leg and the ghosts, so they
//   are redrawn as dashed phantoms in the end layer (DRAWING-GUIDE.md 4; cable_kickback.mjs's START phantom method).
// Unsourced numbers (SIZES below; lb8/sizes.json holds each with its basis).
import { WINTER, REF, RADII, landmarksOf, normPose, resolve, fk, bodyShapes } from '../engine.mjs';
import { ankleCuff, cuffGeometry, CUFF_ITEMS } from '../eq/ankleCuff.mjs';
import { perItem } from '../eq/parts.mjs';

const H = 1.75, R = Math.PI / 180;
export const SIZES = Object.freeze({ STANCE_X: 0.09, STANCE_KNEE: 5, START_HIP_EXT: 15, START_KNEE: 5, START_TOE_CLEAR: 0.02,
  END_HIP: 90, END_KNEE: 90, END_ANKLE: 0, ARM_BACK: 45, ELBOW_SOFT: 18, M_LEAN: 12, PULLEY_Y: 0.10, FLOOR_BACK: 1.05, FLOOR_FRONT: 0.85 });
const { STANCE_X, STANCE_KNEE, START_HIP_EXT, START_KNEE, START_TOE_CLEAR, END_HIP, END_KNEE, END_ANKLE, ARM_BACK, ELBOW_SOFT, M_LEAN, PULLEY_Y,
  FLOOR_BACK, FLOOR_FRONT } = SIZES;
const COL_W = 0.34, COL_POST = 0.05;                    // the vendor cableColumn's defaults (equipment.mjs:85-88)

const L3 = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
const sub = (a, b) => a.map((v, i) => v - b[i]), add = (a, b) => a.map((v, i) => v + b[i]), mul = (a, k) => a.map(v => v * k);
// Whole-body centre of mass (Winter 2009 Table 4.1; copied from single_leg_romanian_deadlift.mjs:58-66).
export function com(lm) {
  const parts = [[0.081, lm.ear], [0.497, L3(lm.shoulders, lm.hips, 0.5)]];
  for (const s of ['l', 'r']) parts.push(
    [0.028, L3(lm[`shoulder.${s}`], lm[`elbow.${s}`], 0.436)], [0.016, L3(lm[`elbow.${s}`], lm[`wrist.${s}`], 0.430)], [0.006, lm[`grip.${s}`]],
    [0.100, L3(lm[`hip.${s}`], lm[`knee.${s}`], 0.433)], [0.0465, L3(lm[`knee.${s}`], lm[`ankle.${s}`], 0.433)], [0.0145, L3(lm[`heel.${s}`], lm[`toe.${s}`], 0.5)]);
  const M = parts.reduce((a, p) => a + p[0], 0);
  return [0, 1, 2].map(i => parts.reduce((a, p) => a + p[0] * p[1][i], 0) / M);
}
const angleAt = (a, v, b) => { const u = sub(a, v), w = sub(b, v); return Math.acos((u[0] * w[0] + u[1] * w[1] + u[2] * w[2]) / Math.hypot(...u) / Math.hypot(...w)) / R; };
// Bracketed root finder (Illinois regula falsi, single_leg_romanian_deadlift.mjs:71-79): throws when f(a), f(b) share a sign.
const solve = (f, a, b, what) => {
  let fa = f(a), fb = f(b), side = 0;
  if (fa * fb > 0) throw new Error(`resisted_hip_flexion: no root for ${what} in [${a}, ${b}]`);
  for (let i = 0; i < 80 && Math.abs(b - a) > 1e-8; i++) {
    const c = (a * fb - b * fa) / (fb - fa), fc = f(c);
    if (fc * fb > 0) { b = c; fb = fc; if (side === -1) fa /= 2; side = -1; } else if (fa * fc > 0) { a = c; fa = fc; if (side === 1) fb /= 2; side = 1; } else return c;
  }
  return (a + b) / 2;
};

const stance = { l: { at: [STANCE_X, 0, 0], toe: [0, 0, 1] } };
const LM = p => landmarksOf(p, H);
const kneeL = lm => 180 - angleAt(lm['hip.l'], lm['knee.l'], lm['ankle.l']);
// Arms: the frame arm's chord (shoulder to grip centre) with the elbow ELBOW_SOFT short of straight.
const ARM = (() => { const a = WINTER.upperArm * H, b = (WINTER.forearm + REF.gripOff) * H, e = ELBOW_SOFT * R; return Math.sqrt(a * a + b * b + 2 * a * b * Math.cos(e)); })();
const BACK_DOWN = [0, -Math.cos(ARM_BACK * R), -Math.sin(ARM_BACK * R)];
// (The shoulder landmarks do not depend on the arm angles, so each hand target is found from the armless pose first.)
const hangL = lm => ({ at: add(lm['shoulder.l'], [0, -ARM, 0]), pole: [0.3, 0, -1] });
const POLE_R = [-0.3, 0.4, -1];
// a body at root (y, z) with working-leg angles j and lumbar `trunk`; the right hand at `grip` (or reaching ARM_BACK back)
const bodyAt = (y, z, j, trunk, grip) => {
  const b = { root: { at: [0, y, z], tilt: 0 }, trunk, neck: 0, hip: { r: j.hip }, knee: { r: j.knee }, ankle: { r: j.ank }, plant: stance };
  const lm = LM(b);
  return { ...b, reach: { l: hangL(lm), r: { at: grip ?? add(lm['shoulder.r'], mul(BACK_DOWN, ARM)), pole: POLE_R } } };
};
// root height for the stance knee at a forward place z (SOLVED)
const rootY = (z, j, trunk, grip) => solve(y => kneeL(LM(bodyAt(y, z, j, trunk, grip))) - STANCE_KNEE, 0.80, 0.99, 'root height');
// root forward place (SOLVED): the centre of mass over the stance mid-sole
const balanced = (j, trunk, grip) => {
  const at = z => { const y = rootY(z, j, trunk, grip); return bodyAt(y, z, j, trunk, grip); };
  const z = solve(zz => { const lm = LM(at(zz)); return com(lm)[2] - lm['sole.l'][2]; }, -0.3, 0.3, 'root place');
  return at(z);
};
// start ankle (SOLVED): the toe START_TOE_CLEAR above the floor with the hip START_HIP_EXT extended, knee START_KNEE
const startJ = (() => {
  const j = a => ({ hip: -START_HIP_EXT, knee: START_KNEE, ank: a });
  const ank = solve(a => LM(balanced(j(a), 0))['toe.r'][1] - START_TOE_CLEAR, -20, 40, 'start ankle');
  return j(ank);
})();
const endJ = { hip: END_HIP, knee: END_KNEE, ank: END_ANKLE };
// The frame: the near upright under the fist of the start reach.
const GRIP = LM(balanced(startJ, 0))['grip.r'];
const POST_Z = GRIP[2];                                    // the near upright's centre line, under the fist
export const COLUMN_Z = POST_Z - COL_W / 2 + COL_POST / 2; // column centre (behind the lifter)
export const PULLEY = [-0.09, PULLEY_Y, COLUMN_Z + COL_W / 2];   // on the near face, in the working leg's plane (x)
const PULLEY_R = 0.045;

const lerpJ = t => ({ hip: startJ.hip + (endJ.hip - startJ.hip) * t, knee: startJ.knee + (endJ.knee - startJ.knee) * t, ank: startJ.ank + (endJ.ank - startJ.ank) * t });
const start = balanced(startJ, 0, GRIP), end = balanced(endJ, 0, GRIP);
const via = [1 / 3, 2 / 3].map(t => balanced(lerpJ(t), 0, GRIP));
export const SOLVED = { startAnkle: startJ.ank, startRoot: start.root.at, endRoot: end.root.at, grip: GRIP };

// Mistake: the lumbar spine extends M_LEAN (the thorax leans back), pelvis level, working leg at its end angles, root
// re-solved for balance; the fist on the upright, the far arm hanging.
const M_FULL = balanced(endJ, -M_LEAN, GRIP);
const mistakePose = { root: M_FULL.root, trunk: -M_LEAN, reach: M_FULL.reach };
const LS = LM(start), LE = LM(end), LM_M = LM({ ...end, ...mistakePose });

// cuff + cable (cable_kickback.mjs's cuff and ring handling, the pulley behind)
const shankR = (() => { const [a, m, b, mm] = RADII.shank, t = 1 - 0.055 / (WINTER.shank * H); // limbR (geom.mjs:69) at the cuff centre
  const r = t < mm ? a + (m - a) * Math.sin((t / mm) * Math.PI / 2) : m + (b - m) * (1 - Math.cos(((t - mm) / (1 - mm)) * Math.PI / 2)); return r * H; })();
const cuffAt = lm => ({ knee: lm['knee.r'], ankle: lm['ankle.r'], toward: PULLEY, r: shankR });
export const ringOf = lm => cuffGeometry(cuffAt(lm)).ringPt;
const START_RING = ringOf(LS);
const dist = a => Math.hypot(...sub(a, PULLEY));
const END_LIFT = dist(ringOf(LE)) - dist(START_RING);
const restFor = (ring, ctx) => {
  if (ctx.pose !== 'mistake') return START_RING;
  const k = (dist(ring) - END_LIFT) / dist(START_RING);
  return add(PULLEY, mul(sub(START_RING, PULLEY), k));
};
// the pulley rim point where a cable to p leaves it (tangent, side-view plane; the upper one)
const tangentFrom = p => {
  const dz = p[2] - PULLEY[2], dy = p[1] - PULLEY[1], D = Math.hypot(dz, dy), a0 = Math.atan2(dy, dz), al = Math.acos(PULLEY_R / D);
  const c = [a0 + al, a0 - al].map(a => [PULLEY[0], PULLEY[1] + PULLEY_R * Math.sin(a), PULLEY[2] + PULLEY_R * Math.cos(a)]);
  return c[0][1] > c[1][1] ? c[0] : c[1];
};
const M_RING = ringOf(LM_M);
export const M_CABLE = [tangentFrom(M_RING), M_RING];

// Start phantoms: the outline of the start working leg's union (thigh, knee cap, shank, foot) and the start cuff.
const insidePoly = (p, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
  const [xi, yi] = poly[i], [xj, yj] = poly[j];
  if ((yi > p[1]) !== (yj > p[1]) && p[0] < (xj - xi) * (p[1] - yi) / (yj - yi) + xi) c = !c; } return c; };
const LEG_KEYS = ['thigh.r', 'kneecap.r', 'shank.r', 'foot.r'];
export const START_LEG = (() => {
  const b = { height: H }, sk = fk(resolve(normPose(start, b), b).q, b);
  const cam = { view: 'side', near: 'r', facing: 'right', pxm: 1, P: w => [w[2], -w[1]] };
  const polys = bodyShapes(sk, cam).filter(sh => LEG_KEYS.includes(sh.key)).map(sh => sh.poly);
  const runs = [];
  polys.forEach((poly, k) => {
    // visibility sampled every 2 mm; a run keeps the outline's own vertices and its two ends (the points between are
    // on the straight edges, so the drawn line is the same with fewer points)
    let run = [], last = null;
    const flush = () => { if (last && run[run.length - 1] !== last) run.push(last); if (run.length > 1) runs.push(run); run = []; last = null; };
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], q = poly[(i + 1) % poly.length], n = Math.max(1, Math.ceil(Math.hypot(q[0] - a[0], q[1] - a[1]) / 0.002));
      for (let j = 0; j < n; j++) {
        const p = [a[0] + (q[0] - a[0]) * j / n, a[1] + (q[1] - a[1]) * j / n];
        if (polys.some((o, m) => m !== k && insidePoly(p, o))) flush(); else { if (!run.length || j === 0) run.push(p); last = p; }
      }
    }
    flush();
  });
  return runs.map(r => ({ type: 'line', pts: r.map(p => [LS['ankle.r'][0], -p[1], p[0]]), cls: 'eq-line m-line', z: 'front', part: 'startLeg' }));
})();
const START_CUFF = ankleCuff(cuffAt(LS)).map(it => ({ type: 'line', pts: [...it.pts, it.pts[0]], cls: 'eq-line m-line', z: 'front', part: 'startCuff' }));

// The leaning, arched back (Mistake guide): the engine masks the faulty back inside the solid trunk, so the faulty
// pose's own back contour (the side torso outline from the upper back, torsoSide point 3, down to the buttock, point
// 12; body.mjs:43-50), as the engine draws it on a 1000 px/m probe camera, is drawn as a dashed Mistake guide on top.
const BACK_FROM = 3, BACK_TO = 12;
export const BACK_PTS = (() => {
  const b = { height: H }, sk = fk(resolve(normPose({ ...end, ...mistakePose }, b), b).q, b);
  const cam = { view: 'side', near: 'r', facing: 'right', pxm: 1000, P: w => [w[2] * 1000, -w[1] * 1000] };
  const torso = bodyShapes(sk, cam).find(sh => sh.key === 'torso').poly;
  return torso.slice(BACK_FROM, BACK_TO + 1).map(p => [0, -p[1] / 1000, p[0] / 1000]);
})();
const FLOOR = { point: [0, 0, 0], normal: [0, 1, 0] };
export const RHF = { LS, LE, LM_M, GRIP, PULLEY, POST_Z, START_RING, M_RING, BACK_PTS, shankR, startJ, endJ };
// The card's contact facts (card plateFacts; D-LIB18-FACTS): each bound by a check on its landmark in its pose, at the
// drawn point (H6 reads the report's checks); the drawn-item tests prove the contact itself (cuff on the ankle, fist
// on the upright).
const factChecks = (pose, p, names) => names.map(landmark => ({ landmark, at: LM(p)[landmark], pose, tol: 0.5 }));
export default {
  id: 'resisted_hip_flexion', name: 'Resisted Hip Flexion', view: 'side', facing: 'right',
  camera: { x0: 205, y0: 339 },
  poses: { start, via, end },
  equipment: [
    { type: 'floor', from: -FLOOR_BACK, to: FLOOR_FRONT },
    (lm, ctx) => { const ring = ringOf(lm); return { type: 'cableColumn', base: [0, 0, COLUMN_Z], pulley: { at: PULLEY, r: PULLEY_R }, to: ring, rest: restFor(ring, ctx), wrap: -1, part: 'cable' }; },
    ...perItem(lm => ankleCuff(cuffAt(lm)), CUFF_ITEMS),
    (lm, ctx) => (ctx.pose === 'end' ? [...START_LEG, ...START_CUFF] : null),
  ],
  checks: [
    ...factChecks('start', start, ['ankle.r', 'wrist.r']),
    { landmark: 'heel.l', plane: FLOOR, pose: 'all', tol: 0.5 },                 // standing foot flat (c12)
    { landmark: 'ball.l', plane: FLOOR, pose: 'all', tol: 0.5 },
    { landmark: 'toe.r', above: FLOOR, pose: 'all' },                            // working foot off the floor
    { landmark: 'heel.r', above: FLOOR, pose: 'all' },
    { landmark: 'grip.r', at: GRIP, pose: 'all', tol: 0.5 },                     // c2: the fist on the frame
  ],
  startParts: ['leg.r', 'cuff'],
  ghosts: { count: 2, parts: ['leg.r', 'cuff'] },
  trace: { point: 'knee.r', trim: [10, 12] },
  marks: ['shoulder.r', 'elbow.r', 'hip.r', 'knee.r'],
  callouts: [
    { key: 'tall', text: 'Stand<br>tall', anchor: 'head', box: { left: 172, top: 24 }, cue: 'Stand tall with the core braced and the standing leg steady.' },
    { key: 'thigh', text: 'Thigh<br>to hip', anchor: 'thighTop.r', box: { left: 296, top: 160 }, cue: 'Drive the knee up and forward until the thigh is about parallel.' },
    { key: 'back', text: 'No back<br>arch', anchor: 'sacrum', box: { left: 226, top: 128 }, cue: 'Keep the core tight and do not lean back to lift higher.' },
  ],
  tempo: [{ phase: 'Lift', s: 2, move: true }, { phase: 'Hold', s: 2 }, { phase: 'Lower', s: 2, move: true }],
  mistake: {
    pose: mistakePose,
    parts: ['trunk', 'arm.r', 'arm.l'],
    guides: [
      { kind: 'dashed', pts: M_CABLE },
      { kind: 'dashed', pts: BACK_PTS, smooth: true },
    ],
    tells: [
      { key: 'lean', text: 'Leans<br>back', anchor: 'backMid', box: { left: 232, top: 92 }, cue: 'You lean back to lift the leg higher.' },
      { key: 'arch', text: 'Lower back<br>arches', anchor: 'sacrum', box: { left: 232, top: 150 }, cue: 'Your lower back arches as the knee comes up.' },
    ],
  },
  alt: 'Resisted hip flexion, side view. Standing tall on the left leg, facing away from a low cable pulley, right hand on the frame and a cuff on the right ankle, the lifter drives the right knee up and forward from behind the body until the thigh is about level.',
};
