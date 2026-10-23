// Cable kickback (ankle cuff, low pulley), side view, figure facing the column (screen right). LIB-18 (LB8, mode H;
// census closest lat_pulldown, closeness N: D-LIB18-CLONE; poses hinge and single: pilot A's romanian_deadlift,
// barbell_row and single_leg_romanian_deadlift methods; the slice's `ankleCuff` plate, D-LIB18-SLICE).
// View: side (card plate.view = census view). The hinge (c2), the long working leg (c5), how far it travels back
//  (c6) and the drawn fault, the lower back arching as the leg kicks back (c7, c8), are all front-to-back.
// Sources: research card docs/research/howto/cards/cable_kickback.json (research head 596dbe07): callouts =
//  plate.checkpoints (c7/c8 Back flat, c10/c6 Hips square, c5 Leg long); Mistake = plate.mistake (c7, c8, drawable
//  true); tempo = plate.tempo (c14: up 1, pause 1, down 2; lb8/tempo.json: Kick back, Hold, Return).
// Clone sources (copied, never imported; D-LIB9-CLONE): lat_pulldown.mjs (main, the 8) for the cable plate's frame
//  and stack handling; single_leg_romanian_deadlift.mjs (pilot A @ dcac4a38):19-36 for the single-leg stance and its
//  Winter centre of mass, and its bracketed root finder (here it throws on a bracket with no root); romanian_deadlift
//  and barbell_row (pilot A) for the hinge read as thorax inclination = pelvis tilt + lumbar flexion, the back flat.
// Equipment: the vendor cableColumn (frame, low pulley, cable, stack) in front of the lifter, the pulley at its lowest
//  setting (c1); the `ankleCuff` composer on the working ankle (c1), its D-ring on the pulley side; floor.
// Sides (D-LIB18-SIDES): c5 names the right leg, so the right leg (the near side in the engine's side view) works and
//  the left (far) leg stands. No mirror.
// Pose map (identity): start = plate.start, end = plate.end, Mistake against the end pose (c7, c8).
// Geometry decisions (confirmed by the engine report `angles` and `checks`, and by the drawn-item tests):
//  Hinge (c2, a choice): PureGym's "about 45 degrees" is drawn, the one number a source gives; BarBend's "lightly"
//   gives none (not facts). The back is flat (trunk 0, c8 "flatten your back"), so the pelvis tilts HINGE and the
//   thorax is HINGE from vertical. Torso unchanged between start and end (c7, c8, c10): the root, tilt, trunk and the
//   hands are the same in both poses; only the working leg moves (c7 "only contract your glutes").
//  Stance (c2 "Place most of your weight on the non-working leg"): the left foot flat at mid-sole z = 0, STANCE_X out
//   (under the left hip), knee STANCE_KNEE. The root height is SOLVED for that knee; the root's forward place is SOLVED
//   so the mean of the start and the end centre of mass (Winter 2009 Table 4.1, as single_leg_romanian_deadlift.mjs
//   :19-36) sits over the stance mid-sole; each pose's centre of mass then lies inside the foot, heel to toe.
//  Hands (c4 "secure your grip on the cable machine"; c2's "if needed" hold is a choice, not facts): both grips on the
//   column's near upright. The reach is square to the hinged trunk with the elbows ELBOW_SOFT short of straight; the
//   column stands where that reach meets its near upright (COLUMN_Z solved).
//  Working leg (c5 "long, with only a subtle bend at the knee"): knee KNEE_SOFT in every pose, in the sagittal plane.
//   Start: the leg just behind the hip's plumb line, the toe START_TOE_CLEAR above the floor (hip flexion SOLVED),
//   so the leg never swings through the vertical, where the pointed toe would pass under the floor.
//   End (c6 "as far as possible", "without rotating in the hips"): hip extension END_HIP_EXT past neutral with the
//   pelvis held. At the end the ankle is at the plantar flexion that points the toe straight down (c10 "pointing
//   your toe straight down towards the ground"; SOLVED); at the start the foot is at START_ANKLE (no claim gives it).
//  Cable (D-LIB18-CABLE): from the low pulley to the cuff's D-ring in every pose, in the plane of the working leg, so
//   it is drawn in front of the far (standing) leg and behind the near leg (the primitive's 'center' level).
//  Mistake (c7 "Do not allow your lower back to arch", c8): the pelvis tips forward M_ARCH and the lumbar spine extends
//   M_ARCH (hanging_leg_raise.mjs:69, trunk -12, "pelvis tipped forward so the lower back arches"); the hands keep the
//   thorax where it was (c4, c7 "using your arms to lock yourself"), so the root moves to hold the lumbar pivot still;
//   the working hip keeps its end angle, so the leg rises with the pelvis. The engine masks the faulty back inside the
//   solid trunk, so the arched lower back is drawn as a dashed Mistake guide on top. The Mistake cable is a dashed
//   guide from the pulley to the Mistake D-ring; the stack stays at the end lift (D-LIB17-B4).
//  Hidden start parts: the start working thigh lies under the end thigh and buttock, and the start shank, foot and cuff
//   under the ghosts, so they are redrawn as dashed phantoms in the end layer (DRAWING-GUIDE.md 4; cable_external_rotation.mjs's START_ARM method).
// Unsourced numbers (SIZES below; lb8/sizes.json holds each with its basis). HINGE 45 is c2's.
import { WINTER, REF, RADII, landmarksOf, normPose, resolve, fk, bodyShapes } from '../engine.mjs';
import { ankleCuff, cuffGeometry, CUFF_ITEMS } from '../eq/ankleCuff.mjs';
import { perItem } from '../eq/parts.mjs';

const H = 1.75, R = Math.PI / 180;
export const SIZES = Object.freeze({ STANCE_X: 0.09, STANCE_KNEE: 15, KNEE_SOFT: 15, END_HIP_EXT: 15, START_TOE_CLEAR: 0.02, ELBOW_SOFT: 18,
  START_ANKLE: 0, M_ARCH: 12, PULLEY_Y: 0.10, FLOOR_BACK: 1.05, FLOOR_FRONT: 1.25 });
const { STANCE_X, STANCE_KNEE, KNEE_SOFT, END_HIP_EXT, START_TOE_CLEAR, ELBOW_SOFT, START_ANKLE, M_ARCH, PULLEY_Y, FLOOR_BACK, FLOOR_FRONT } = SIZES;
const HINGE = 45;                                       // c2 (PureGym) "hinge forward by about 45 degrees at the hips"
const COL_W = 0.34, COL_POST = 0.05;                    // the vendor cableColumn's defaults (equipment.mjs:85-88)

const L3 = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
const sub = (a, b) => a.map((v, i) => v - b[i]), add = (a, b) => a.map((v, i) => v + b[i]), mul = (a, k) => a.map(v => v * k);
const unit = v => { const k = Math.hypot(...v); return v.map(x => x / k); };
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
  if (fa * fb > 0) throw new Error(`cable_kickback: no root for ${what} in [${a}, ${b}]`);
  for (let i = 0; i < 80 && Math.abs(b - a) > 1e-8; i++) {
    const c = (a * fb - b * fa) / (fb - fa), fc = f(c);
    if (fc * fb > 0) { b = c; fb = fc; if (side === -1) fa /= 2; side = -1; } else if (fa * fc > 0) { a = c; fa = fc; if (side === 1) fb /= 2; side = 1; } else return c;
  }
  return (a + b) / 2;
};

const stance = { l: { at: [STANCE_X, 0, 0], toe: [0, 0, 1] } };
const legs = (hipR, ankle) => ({ hip: { r: hipR }, knee: { r: KNEE_SOFT }, ankle: { r: ankle } });
const bodyAt = (y, z, hipR, ankle) => ({ root: { at: [0, y, z], tilt: HINGE }, trunk: 0, neck: 0, ...legs(hipR, ankle), plant: stance });
const LM = p => landmarksOf(p, H);
const kneeL = lm => 180 - angleAt(lm['hip.l'], lm['knee.l'], lm['ankle.l']);
// root height for the stance knee, at a forward place z (solved: SOLVED_ROOT_Y)
const rootY = z => solve(y => kneeL(LM(bodyAt(y, z, 0, 0))) - STANCE_KNEE, 0.70, 0.94, 'root height');
// end hip: END_HIP_EXT of extension past neutral (hip flexion -END_HIP_EXT)
const END_HIP = -END_HIP_EXT;
// ankle (SOLVED): plantar flexion that points the toe straight down at the end (heel -> toe vertical)
const toeDownAt = (y, z) => solve(a => { const lm = LM(bodyAt(y, z, END_HIP, a)); return lm['toe.r'][2] - lm['heel.r'][2]; }, -80, 40, 'toe-down ankle');
// start hip (SOLVED): the leg just behind the hip's plumb line, the foot at START_ANKLE, the toe START_TOE_CLEAR above
// the floor. (Forward of the plumb line the leg would swing through the vertical on its way back, where a working leg
// as long as the standing leg puts the sole on the floor line, and the pointed toe 2 cm under it: measured on the first
// draft's ghost.)
const startHipAt = (y, z) => solve(h => LM(bodyAt(y, z, h, START_ANKLE))['toe.r'][1] - START_TOE_CLEAR, HINGE - 40, HINGE, 'start hip');
// root forward place (SOLVED): the mean of the start and end centre of mass over the stance mid-sole (z = 0)
const keyAt = z => { const y = rootY(z), ank = toeDownAt(y, z), sh = startHipAt(y, z); return { y, z, ank, sh }; };
// Hands: square to the trunk, forward and down, elbows ELBOW_SOFT short of straight; the column's near upright there.
// (The shoulder landmarks do not depend on the arm angles, so the grips are found from the armless pose first.)
const ARM = (() => { const a = WINTER.upperArm * H, b = (WINTER.forearm + REF.gripOff) * H, e = ELBOW_SOFT * R; return Math.sqrt(a * a + b * b + 2 * a * b * Math.cos(e)); })();
const DOWN_FWD = [0, -Math.sin(HINGE * R), Math.cos(HINGE * R)];   // square to a trunk HINGE from vertical
const gripsOf = lm => ({ l: add(lm['shoulder.l'], mul(DOWN_FWD, ARM)), r: add(lm['shoulder.r'], mul(DOWN_FWD, ARM)) });
const handsAt = g => ({ l: { at: g.l, pole: [0.3, -0.2, -1] }, r: { at: g.r, pole: [-0.3, -0.2, -1] } });
const withHands = b => ({ ...b, reach: handsAt(gripsOf(LM(b))) });
const ROOT = (() => { const z = solve(zz => { const k = keyAt(zz); return (com(LM(withHands(bodyAt(k.y, zz, k.sh, START_ANKLE))))[2] + com(LM(withHands(bodyAt(k.y, zz, END_HIP, k.ank))))[2]) / 2; }, -0.4, 0.3, 'root place'); return keyAt(z); })();
export const SOLVED = { rootY: ROOT.y, rootZ: ROOT.z, ankle: ROOT.ank, startHip: ROOT.sh };
const GRIP = gripsOf(LM(bodyAt(ROOT.y, ROOT.z, END_HIP, ROOT.ank)));
const POST_Z = GRIP.r[2];                                // the near upright's centre line, under the fists
export const COLUMN_Z = POST_Z + COL_W / 2 - COL_POST / 2; // column centre
export const PULLEY = [-0.09, PULLEY_Y, COLUMN_Z - COL_W / 2];   // on the near face, in the working leg's plane (x)
const PULLEY_R = 0.045;
const hands = handsAt(GRIP);

const pose = (hipR, ank) => ({ ...bodyAt(ROOT.y, ROOT.z, hipR, ank), reach: hands });
const start = pose(ROOT.sh, START_ANKLE), end = pose(END_HIP, ROOT.ank);
const via = [1 / 3, 2 / 3].map(t => pose(ROOT.sh + (END_HIP - ROOT.sh) * t, START_ANKLE + (ROOT.ank - START_ANKLE) * t));

// Mistake: the pelvis tips forward M_ARCH about the hip joints (the standing leg stays planted as it was) and the
// lumbar spine extends M_ARCH, so the thorax keeps its angle; the hands stay on the column (IK).
const LS = LM(start), LE = LM(end);
const M_TILT = HINGE + M_ARCH;
const mistakePose = { root: { at: [0, ROOT.y, ROOT.z], tilt: M_TILT }, trunk: -M_ARCH };
const LM_M = LM({ ...end, ...mistakePose });

// cuff + cable
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
// the pulley rim point where a cable to p leaves it (tangent, side-view plane)
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
    let run = [];
    const flush = () => { if (run.length > 1) runs.push(run); run = []; };
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], q = poly[(i + 1) % poly.length], n = Math.max(1, Math.ceil(Math.hypot(q[0] - a[0], q[1] - a[1]) / 0.002));
      for (let j = 0; j < n; j++) {
        const p = [a[0] + (q[0] - a[0]) * j / n, a[1] + (q[1] - a[1]) * j / n];
        if (polys.some((o, m) => m !== k && insidePoly(p, o))) flush(); else run.push(p);
      }
    }
    flush();
  });
  return runs.map(r => ({ type: 'line', pts: r.map(p => [LS['ankle.r'][0], -p[1], p[0]]), cls: 'eq-line m-line', z: 'front', part: 'startLeg' }));
})();
const START_CUFF = ankleCuff(cuffAt(LS)).map(it => ({ type: 'line', pts: [...it.pts, it.pts[0]], cls: 'eq-line m-line', z: 'front', part: 'startCuff' }));

// The arched lower back (Mistake guide): the engine masks the faulty back inside the solid trunk, so the faulty pose's
// own back contour (the side torso outline from the lower ribs, torsoSide :47 point 5, down to the buttock, point 12;
// body.mjs:43-50), as the engine draws it on a 1000 px/m probe camera, is drawn as a dashed Mistake guide on top.
const BACK_FROM = 5, BACK_TO = 12;
export const ARCH_PTS = (() => {
  const b = { height: H }, sk = fk(resolve(normPose({ ...end, ...mistakePose }, b), b).q, b);
  const cam = { view: 'side', near: 'r', facing: 'right', pxm: 1000, P: w => [w[2] * 1000, -w[1] * 1000] };
  const torso = bodyShapes(sk, cam).find(sh => sh.key === 'torso').poly;
  return torso.slice(BACK_FROM, BACK_TO + 1).map(p => [0, -p[1] / 1000, p[0] / 1000]);
})();
const FLOOR = { point: [0, 0, 0], normal: [0, 1, 0] };
export const CK = { LS, LE, LM_M, GRIP, PULLEY, START_RING, M_RING, ARCH_PTS, shankR, M_TILT };
// The card's contact facts (lb8 DESIGN.md; D-LIB18-FACTS): each bound by a check on its landmark in its pose, at the
// drawn point (H6 reads the report's checks); the drawn-item tests prove the contact itself.
const factChecks = (pose, p, names) => names.map(landmark => ({ landmark, at: LM(p)[landmark], pose, tol: 0.5 }));
export default {
  id: 'cable_kickback', name: 'Cable Kickback', view: 'side', facing: 'right',
  camera: { x0: 190, y0: 339 },
  poses: { start, via, end },
  equipment: [
    { type: 'floor', from: -FLOOR_BACK, to: FLOOR_FRONT },
    (lm, ctx) => { const ring = ringOf(lm); return { type: 'cableColumn', base: [0, 0, COLUMN_Z], pulley: { at: PULLEY, r: PULLEY_R }, to: ring, rest: restFor(ring, ctx), part: 'cable' }; },
    ...perItem(lm => ankleCuff(cuffAt(lm)), CUFF_ITEMS),
    (lm, ctx) => (ctx.pose === 'end' ? [...START_LEG, ...START_CUFF] : null),
  ],
  checks: [
    ...factChecks('start', start, ['ankle.r', 'wrist.l', 'wrist.r']),
    { landmark: 'heel.l', plane: FLOOR, pose: 'all', tol: 0.5 },                 // standing foot flat (c2)
    { landmark: 'ball.l', plane: FLOOR, pose: 'all', tol: 0.5 },
    { landmark: 'toe.r', above: FLOOR, pose: 'all' },                            // working foot off the floor
    { landmark: 'grip.l', at: GRIP.l, pose: 'all', tol: 0.5 },                   // c4: hands on the column
    { landmark: 'grip.r', at: GRIP.r, pose: 'all', tol: 0.5 },
  ],
  ghosts: { count: 2, parts: ['leg.r', 'cuff'] },
  trace: { point: 'ankle.r', trim: [10, 12] },
  marks: ['shoulder.r', 'elbow.r', 'hip.r', 'knee.r'],
  callouts: [
    { key: 'back', text: 'Back<br>flat', anchor: 'backMid', box: { left: 150, top: 100 }, cue: 'Brace so your lower back does not arch as the leg goes back.' },
    { key: 'hips', text: 'Hips<br>square', anchor: 'buttock', box: { left: 86, top: 142 }, cue: 'Keep your hips level and do not twist to lift the leg higher.' },
    { key: 'leg', text: 'Leg<br>long', anchor: { along: ['knee.r', 'ankle.r'], t: 0.5 }, box: { left: 24, top: 200 }, cue: 'Keep the working leg long, with only a slight bend at the knee.' },
  ],
  tempo: [{ phase: 'Kick back', s: 1, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Return', s: 2, move: true }],
  mistake: {
    pose: mistakePose,
    parts: ['leg.r', 'cuff'],
    guides: [
      { kind: 'dashed', pts: M_CABLE },
      { kind: 'dashed', pts: ARCH_PTS, smooth: true },
    ],
    tells: [
      { key: 'arch', text: 'Lower back<br>arches', anchor: 'sacrum', cue: 'Your lower back arches as the leg kicks back.' },
    ],
  },
  alt: 'Cable kickback, side view. Hinged forward about 45 degrees and holding the cable column, with the ankle cuff on the right ankle, the lifter drives the long right leg back and up from just behind the standing leg, back flat and hips level.',
};
