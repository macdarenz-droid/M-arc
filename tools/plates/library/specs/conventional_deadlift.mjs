// Conventional deadlift (barbell), side view, figure facing screen right. LIB-13 (LB3, mode H, ruling 4).
// View: side (card plate.view = census view). Bar over mid-foot, shins to the bar, hip height, a flat back and a
// vertical bar path close to the legs are front-to-back positions (c1, c6, c7).
// Sources: research card docs/research/howto/cards/conventional_deadlift.json (research head 2dd60ae0): callouts =
//  plate.checkpoints (c1 Bar over midfoot, c7 Flat back, c6 Bar close); Mistake = plate.mistake (c8: the lower back
//  rounds as the bar leaves the floor); tempo = plate.tempo (c12: up 1, down 2, pause 0; the dead start has no
//  seconds, so no static phase: DESIGN.md section 8).
// Clone source: romanian_deadlift (#109 @ 48d49bb), its hinge solve and helpers copied (D-LIB9-CLONE), never imported.
// Pose map (DESIGN.md section 9): spec start = the card's plate.end (standing tall), spec end = the card's plate.start
//  (bar on the floor), because the Mistake is drawn against the end pose (plate.mjs:78, :208).
// Geometry decisions (confirmed by the engine report `angles` and `checks`):
//  Feet: mid-soles 22 cm apart (hip width, c2), toes out 5 deg (unsourced), mid-foot at world z = 0.
//  Grip: hands 48 cm apart, just outside the knees (c3); straight arms (99.8% reach) (c4).
//  Bar on the floor (c23): full-size 45 cm plates resting on the floor line, so the bar centre is 22.5 cm up. The
//   plate rim touches the floor in the end pose (a `checks` plane proves it).
//  End = the floor start (c1, c3, c4, c7): the bar centre over mid-foot (z = 0); the arms vertical in the side view
//   (shoulder joint straight above the grip); the back flat (lumbar 3 deg, unsourced "near neutral"); the trunk angle
//   is SOLVED so the bar is 5 mm in front of the near shin (shins "touching or nearly touching", c1). Bracket 55-80
//   deg; solves to FLOOR_INCL (about 67 deg from vertical); the knee follows (about 65 deg).
//  Start = standing tall (c6, c10): trunk upright (TOP_INCL 0), knees KNEE_TOP 2 deg (locked; 2, not 0, so the knee
//   solve has a root), shoulder blades 2 cm back ("shoulders back"); the straight arm hangs forward at the SOLVED angle
//   (bracket 0-25 deg) that rests the bar 5 mm off the drawn thigh, and the root z is SOLVED (bracket -0.2..0.1 m) so
//   that bar sits over mid-foot.
//  Via poses (VIA_F, five bar heights): solved like the end, the bar on the mid-foot plumb line at a set height, 5 mm
//   off the near leg, so the bar path is one vertical line close to the legs (c6) and never passes through the knees.
//  Mistake (c8): the bar just off the floor (M_LIFT 2 cm), the hips where they were, the pelvis tucked M_TUCK and the
//   lumbar spine flexed so the straight, vertical arms still reach the bar; a dashed hump guide shows the round
//   (as romanian_deadlift's R5 fix: the engine bends the spine at one point, so the pose alone draws a small hump).
// Unsourced numbers: TOE_OUT 5, BAR_GAP 5 mm, FLOOR_SPINE 3, TOP_INCL 0, KNEE_TOP 2, PRO_TOP -2 cm, VIA_F heights, M_LIFT 2 cm,
//  M_TUCK 30 (illustrative, as romanian_deadlift), HUMP 9.4 cm (as romanian_deadlift), the 2.2 m bar (vendor default).
import { landmarksOf, RADII } from '../engine.mjs';

const H = 1.75, R = Math.PI / 180;
const FOOT_X = 0.11, TOE_OUT = 5;
const GRIP_X = 0.24;
const REACH = (0.186 + 0.146 + 0.46 * 0.108) * H * 0.998;
const BAR_GAP = 0.005, SHAFT_R = 0.014, PLATE_R = 0.225;   // CARD c23: 45 cm plates, bar centre 22.5 cm up
const FLOOR_SPINE = 3, KNEE_TOP = 2, PRO_TOP = -2;
const toe = s => [s * Math.sin(TOE_OUT * R), 0, Math.cos(TOE_OUT * R)];
const feet = { l: { at: [FOOT_X, 0, 0], toe: toe(1) }, r: { at: [-FOOT_X, 0, 0], toe: toe(-1) } };

const limbR = (rA, rM, rB, m) => t => t < m ? rA + (rM - rA) * Math.sin((t / m) * Math.PI / 2) : rM + (rB - rM) * (1 - Math.cos(((t - m) / (1 - m)) * Math.PI / 2));
const thR = limbR(...RADII.thigh), shR = limbR(...RADII.shank);
const segGap = (p, a, b, rf) => {
  const d = [b[1] - a[1], b[2] - a[2]], L2 = d[0] ** 2 + d[1] ** 2;
  const t = Math.max(0, Math.min(1, ((p[1] - a[1]) * d[0] + (p[2] - a[2]) * d[1]) / L2));
  return Math.hypot(p[1] - a[1] - d[0] * t, p[2] - a[2] - d[1] * t) - rf(t) * H;
};
const legGap = (lm, bar) => Math.min(segGap(bar, lm['hip.r'], lm['knee.r'], thR), segGap(bar, lm['knee.r'], lm['ankle.r'], shR),
  Math.hypot(bar[1] - lm['knee.r'][1], bar[2] - lm['knee.r'][2]) - RADII.kneeCap * H) - SHAFT_R;
const kneeOf = lm => {
  const a = [0, 1, 2].map(i => lm['hip.r'][i] - lm['knee.r'][i]), b = [0, 1, 2].map(i => lm['ankle.r'][i] - lm['knee.r'][i]);
  return 180 - Math.acos((a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) / Math.hypot(...a) / Math.hypot(...b)) / R;
};
const body = (y, z, incl, spine, pro = 0) => ({ root: { at: [0, y, z], tilt: incl - spine }, trunk: spine, neck: 0, scap: { pro }, plant: feet });
// Bracketed root finder (Illinois regula falsi): throws when f(a) and f(b) have the same sign (D-LIB9-CLONE b).
export const bisect = (f, a, b) => {
  let fa = f(a), fb = f(b), side = 0;
  if (fa * fb > 0) throw new Error(`conventional_deadlift: no solution in [${a}, ${b}]`);
  for (let i = 0; i < 60 && Math.abs(b - a) > 1e-7; i++) {
    const c = (a * fb - b * fa) / (fb - fa), fc = f(c);
    if (fc * fb > 0) { b = c; fb = fc; if (side === -1) fa /= 2; side = -1; } else if (fa * fc > 0) { a = c; fa = fc; if (side === 1) fb /= 2; side = 1; } else return c;
  }
  return (a + b) / 2;
};
const hands = bar => ({ l: { at: [GRIP_X, bar[1], bar[2]], pole: [0.2, 0, -1] }, r: { at: [-GRIP_X, bar[1], bar[2]], pole: [-0.2, 0, -1] } });
const armDrop = S => { const dx = GRIP_X - Math.abs(S[0]); return Math.sqrt(REACH ** 2 - dx * dx); };

// The bar at height barY over mid-foot (z = 0) with the arms vertical: the root follows from the trunk angle (the
// shoulder joint is placed straight above the bar), and the trunk angle is solved for the 5 mm leg gap.
function plumb(barY, spine, zr) {
  const at = incl => {
    const S = landmarksOf(body(0.6, 0, incl, spine), H)['shoulder.r'];
    return body(0.6 + barY + armDrop(S) - S[1], -S[2], incl, spine);
  };
  const incl = bisect(i => legGap(landmarksOf(at(i), H), [0, barY, 0]) - BAR_GAP, ...zr);
  return { ...at(incl), reach: hands([0, barY, 0]), incl };
}
const end = plumb(PLATE_R, FLOOR_SPINE, [55, 80]);
const FLOOR_INCL = end.incl;
delete end.incl;

// Standing tall (c6, c10): trunk TOP_INCL 0 (upright), knees locked. For a root z the straight arm hangs forward at the
// angle that rests the bar 5 mm off the drawn thigh; the root z is SOLVED so that bar sits over mid-foot.
const TOP_INCL = 0;
const hipY = z => bisect(y => kneeOf(landmarksOf(body(y, z, TOP_INCL, 0, PRO_TOP), H)) - KNEE_TOP, 0.5, 0.935);
const hangAt = (S, a) => { const L = armDrop(S); return [0, S[1] - L * Math.cos(a * R), S[2] + L * Math.sin(a * R)]; };
function stand(z) {
  const pose = body(hipY(z), z, TOP_INCL, 0, PRO_TOP), lm = landmarksOf(pose, H), S = lm['shoulder.r'];
  const a = bisect(x => legGap(lm, hangAt(S, x)) - BAR_GAP, 0, 25);
  return { ...pose, reach: hands(hangAt(S, a)), armDeg: a };
}
const TOP_Z = bisect(z => landmarksOf(stand(z), H).grips[2], -0.2, 0.1);
const start = stand(TOP_Z), TOP_ARM = start.armDeg;
delete start.armDeg;
const START_BAR = landmarksOf(start, H).grips;

// Via poses at these fractions of the way from the floor bar to the standing bar. Each trunk bracket is found by a scan
// from 85 deg down in 1 deg steps: the first step where the bar's leg gap turns from positive to negative with the
// knees still bent (a lower root has the bar inside the thigh; above it the knees lock).
const VIA_F = [0.8, 0.6, 0.45, 0.3, 0.15];
const bracketOf = (barY, spine) => {
  const at = incl => { const S = landmarksOf(body(0.6, 0, incl, spine), H)['shoulder.r']; return landmarksOf(body(0.6 + barY + armDrop(S) - S[1], -S[2], incl, spine), H); };
  for (let i = 85; i > -10; i--) {
    const hi = at(i), lo = at(i - 1);
    if (kneeOf(hi) > 2 && legGap(hi, [0, barY, 0]) - BAR_GAP >= 0 && legGap(lo, [0, barY, 0]) - BAR_GAP < 0) return [i - 1, i];
  }
  throw new Error(`conventional_deadlift: no via bracket at bar height ${barY}`);
};
const via = VIA_F.map(f => { const y = PLATE_R + f * (START_BAR[1] - PLATE_R), sp = FLOOR_SPINE * (1 - f); const p = plumb(y, sp, bracketOf(y, sp)); delete p.incl; return p; });
// Mistake (c8): the bar 2 cm off the floor, the hips where they were, the pelvis tucked M_TUCK; the lumbar flexion is
// SOLVED so the shoulder joint sits straight above the bar at arm's length (the vertical arms of c4 kept).
const M_LIFT = 0.02, M_TUCK = 30;
const MIST_BAR = [0, PLATE_R + M_LIFT, 0];
const mistOf = sp => ({ ...end, root: { at: end.root.at, tilt: FLOOR_INCL - FLOOR_SPINE - M_TUCK }, trunk: sp });
const reachErr = sp => { const S = landmarksOf(mistOf(sp), H)['shoulder.r']; return Math.hypot(S[1] - MIST_BAR[1], S[2]) - armDrop(S); };
const M_SPINE = bisect(reachErr, FLOOR_SPINE, 70);
const mistakePose = { root: mistOf(M_SPINE).root, trunk: M_SPINE, reach: hands(MIST_BAR) };

// The rounded back as one dashed arc (romanian_deadlift's HUMP method): from the faulty sacrum to the faulty neck, its
// middle HUMP above the middle of the correct flat back.
const HUMP = 0.094;
const LM_M = landmarksOf({ ...end, ...mistakePose }, H), LM_E = landmarksOf(end, H);
const HUMP_PTS = (() => {
  const A = LM_M.sacrum, B = LM_M.neck, flat = LM_E.sacrum.map((v, i) => (v + LM_E.backUpper[i]) / 2);
  const d = [0, LM_E.backUpper[1] - LM_E.sacrum[1], LM_E.backUpper[2] - LM_E.sacrum[2]], L = Math.hypot(...d);
  let n = [0, -d[2] / L, d[1] / L];
  if (n[1] < 0) n = n.map(v => -v);
  const P = flat.map((v, i) => v + n[i] * HUMP), C = P.map((v, i) => 2 * v - (A[i] + B[i]) / 2);
  const pts = Array.from({ length: 17 }, (_, k) => { const t = k / 16; return A.map((v, i) => (1 - t) ** 2 * v + 2 * t * (1 - t) * C[i] + t * t * B[i]); });
  return { pts, apex: pts[8], n };
})();
const HUMP_OUT = k => HUMP_PTS.apex.map((v, i) => v + HUMP_PTS.n[i] * k);
const ROUND_OFF = (() => { const a = HUMP_PTS.pts[7], b = LM_M.lumbar; return [+((a[2] - b[2]) * 146.29).toFixed(2), +(-(a[1] - b[1]) * 146.29).toFixed(2)]; })();

export const dlInfo = { floorIncl: +FLOOR_INCL.toFixed(1), topIncl: +TOP_INCL.toFixed(1), mSpine: +M_SPINE.toFixed(1),
  topArm: +TOP_ARM.toFixed(1), floorKnee: +kneeOf(LM_E).toFixed(1), hipY: +LM_E['hip.r'][1].toFixed(3) };

const barAt = lm => [0, lm.grips[1], lm.grips[2]];
const START_DOT = Array.from({ length: 17 }, (_, k) => [0, START_BAR[1] + 0.025 * Math.sin(k * Math.PI / 8), START_BAR[2] + 0.025 * Math.cos(k * Math.PI / 8)]);
const HAND_R = 0.035, WRIST_R = 0.018;
function handPoly(lm) {
  const W = lm['wrist.r'], G = lm['grip.r'], d = [G[1] - W[1], G[2] - W[2]], L = Math.hypot(...d), u = [d[0] / L, d[1] / L], n = [-u[1], u[0]], pts = [];
  for (let a = -90; a <= 90; a += 30) pts.push([G[0], G[1] + HAND_R * (Math.cos(a * R) * u[0] + Math.sin(a * R) * n[0]), G[2] + HAND_R * (Math.cos(a * R) * u[1] + Math.sin(a * R) * n[1])]);
  for (let a = 90; a <= 270; a += 45) pts.push([G[0], W[1] + WRIST_R * (Math.cos(a * R) * u[0] + Math.sin(a * R) * n[0]), W[2] + WRIST_R * (Math.cos(a * R) * u[1] + Math.sin(a * R) * n[1])]);
  return { type: 'poly', pts, curve: true, cls: 'eq-solid', z: 'front', part: 'hand' };
}
const floor = { point: [0, 0, 0], normal: [0, 1, 0] };
// H6 contact plane (D-LIB13-FACTS2): parallel to the drawn leg segment a -> b, the segment's radius at the point nearest
// the bar plus SHAFT_R behind the bar centre. The segment's two joints lie on it when the bar's surface touches the
// leg, so their distance to it is the bar's gap to the leg (BAR_GAP); a leg moved off the bar opens it.
const legPlane = (pose, a, b, rf) => {
  const lm = landmarksOf(pose, H), bar = lm.grips, A = lm[a], B = lm[b], d = [B[1] - A[1], B[2] - A[2]], L = Math.hypot(...d), u = d.map(v => v / L);
  const t = ((bar[1] - A[1]) * u[0] + (bar[2] - A[2]) * u[1]) / L, off = rf(t) * H + SHAFT_R;
  let n = [-u[1], u[0]];
  if (n[0] * (bar[1] - A[1]) + n[1] * (bar[2] - A[2]) < 0) n = n.map(v => -v);
  return { point: [0, bar[1] - n[0] * off, bar[2] - n[1] * off], normal: [0, n[0], n[1]] };
};
const SHIN_END = legPlane(end, 'knee.r', 'ankle.r', shR);
export default {
  id: 'conventional_deadlift', name: 'Conventional Deadlift', view: 'side', facing: 'right',
  camera: { x0: 172, y0: 339 },
  poses: { start, via, end },
  equipment: [
    { type: 'floor', from: -0.75, to: 0.75 },
    (lm, ctx) => (ctx.pose === 'start' ? null : handPoly(lm)),
    lm => ({ type: 'barbell', at: barAt(lm), plates: [0.045], part: 'bar', z: 'front' }),
    (lm, ctx) => (ctx.pose === 'end' ? { type: 'line', cls: 'eq-cable m-line', pts: START_DOT, z: 'front', part: 'startbar' } : null),
    (lm, ctx) => (ctx.pose === 'mistake' ? { type: 'pulley', at: barAt(lm), r: PLATE_R, part: 'mplate', z: 'front' } : null),
  ],
  checks: [
    { landmark: 'heel.r', plane: floor, pose: 'all', tol: 0.5 },
    { landmark: 'ball.r', plane: floor, pose: 'all', tol: 0.5 },
    { landmark: 'heel.l', plane: floor, pose: 'all', tol: 0.5 },
    { landmark: 'ball.l', plane: floor, pose: 'all', tol: 0.5 },
    { landmark: 'grips', plane: { point: [0, 0, 0], normal: [0, 0, 1] }, pose: 'end', tol: 0.5 },          // c1 bar over mid-foot
    { landmark: 'grips', plane: { point: [0, PLATE_R, 0], normal: [0, 1, 0] }, pose: 'end', tol: 0.5 },    // c23 plates on the floor
    { landmark: 'grips', plane: { point: [0, 0, 0], normal: [0, 0, 1] }, pose: 'start', tol: 0.5 },        // lockout over mid-foot
    { landmark: 'knee.r', plane: SHIN_END, pose: 'end' },                                                // c1 shins to the bar (H6 contact fact)
    { landmark: 'ankle.r', plane: SHIN_END, pose: 'end' },
  ],
  startParts: ['trunk', 'leg.r', 'arm.r'],
  ghosts: { count: 2, parts: ['trunk', 'leg.r', 'arm.r'] },
  trace: { point: 'grip.r', trim: [10, 12] },
  datum: [{ x: [0, 0, 0], from: 349, to: 150 }],
  // 'Bar over midfoot' ends on the mid-foot plumb line under the bar (inside the plate ring); 'Bar close' on the bar at
  // the shin, where it is closest to the legs.
  callouts: [
    { key: 'midfoot', text: 'Bar over<br>midfoot', anchor: [0, 0.11, 0], box: { left: 226, top: 300 }, cue: 'Start with the bar over the middle of your foot, shins close.' },
    { key: 'back', text: 'Flat back', anchor: 'backUpper', box: { left: 30, top: 146 }, cue: 'Keep your back neutral from the floor to lockout.' },
    { key: 'close', text: 'Bar close', anchor: 'grip.r', box: { left: 214, top: 252 }, cue: 'Keep the bar close to your legs all the way up.' },
  ],
  tempo: [{ phase: 'Lower', s: 2, move: true }, { phase: 'Lift', s: 1, move: true }],
  mistake: {
    pose: mistakePose,
    guides: [
      { kind: 'dashed', pts: HUMP_PTS.pts },
      { kind: 'arrow', from: HUMP_OUT(0.12), to: HUMP_OUT(0.015) },
    ],
    tells: [
      { key: 'round', text: 'Lower back<br>rounds', anchor: { at: 'lumbar', pose: 'mistake', off: ROUND_OFF }, box: { left: 8, top: 152 }, cue: 'The lower back rounds as the bar leaves the floor.' },
      { key: 'tuck', text: 'Hips tuck<br>under', anchor: { at: 'sacrum', pose: 'mistake' }, box: { left: 12, top: 226 }, cue: 'The hips tuck under and the back curls over the bar.' },
    ],
  },
  alt: 'Conventional deadlift, side view. From standing tall with the bar against the thighs, the lifter lowers the bar to the floor over the middle of the foot, shins close to the bar, arms straight and vertical, back flat, and lifts it back up close to the legs.',
};
