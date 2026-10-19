// Sumo deadlift (barbell), side view, figure facing screen right. LIB-13 (LB3, mode H, ruling 4).
// View: side (card plate.view = census view). The hips rising first (the top fault, c12), the bar against the shins
// (c13) and the more upright trunk (c4) are front-to-back; the wide stance shows only from the front, so it is in the
// text (card viewWhy, variantLine).
// Sources: research card docs/research/howto/cards/sumo_deadlift.json (research head 2dd60ae0): callouts =
//  plate.checkpoints (c13 Bar on shins, c13/c15/c4 Chest up, c11 Legs drive first); Mistake = plate.mistake (c12: the
//  hips shoot up before the bar leaves the floor); tempo = plate.tempo (c21: up 1, down 2, pause 0).
// Clone source: conventional_deadlift (this branch, its card parent) and romanian_deadlift (#109 @ 48d49bb), copied,
//  never imported (D-LIB9-CLONE).
// Pose map (DESIGN.md section 9): spec start = the card's plate.end (standing, knees and hips locked), spec end = the
//  card's plate.start (bar on the floor), because the Mistake is drawn against the end pose.
// Geometry decisions (confirmed by the engine report `angles` and `checks`):
//  Feet (c1, c2; no plate fact, LB3 NOTE RULED Q2: stance and toe-out do not show side-on): mid-soles 30 cm apart, toes
//   out 10 deg. Escamilla's means (70 cm, 42 deg; c2) cannot be drawn: the engine foot has no roll, so a leg angled out
//   that far cannot keep heel and ball on the floor (measured: 0.6-2.1 cm contact error for 36-70 cm stances at 20-42
//   deg toe-out; the limit is 0.5 cm). The card's text and setup carry the stance (card variantLine).
//  Grip (c3): hands inside the knees, closer than conventional: 36 cm apart (unsourced; the card gives no width).
//  Bar (inherited plate.equipment, parent c23): 45 cm plates on the floor line, bar centre 22.5 cm up.
//  End = the floor start (c1, c3, c4, c13, c15): the trunk 60.1 deg from vertical, 7.5 deg more upright than
//   conventional_deadlift's drawn 67.6 (c4: 5-10 deg, its midpoint; a drawn-item test compares the two); the back flat
//   (lumbar 3 deg); the bar over mid-foot, the straight arms reaching it (sumo's card asks for straight arms, not plumb
//   ones); the root SOLVED so the bar is 5 mm in front of the near shin (c13).
//  Start = standing tall with knees and hips locked together (c14, c15): as conventional_deadlift's top.
//  Via poses as conventional_deadlift's (plumb arms, the bar on the mid-foot plumb line, out of the legs).
//  Mistake (c12): the bar still on the floor, the hips raised M_RISE straight up: the trunk angle is SOLVED so the
//   straight arms still reach the bar, so the hips shoot up while the chest drops toward the bar.
// Unsourced numbers: GRIP_X 0.18, BAR_GAP 5 mm, FLOOR_SPINE 3, TOP_INCL 0, KNEE_TOP 2, PRO_TOP -2 cm, VIA_F heights,
//  M_RISE 10 cm (illustrative), the 2.2 m bar (vendor default).
import { landmarksOf, RADII } from '../engine.mjs';

const H = 1.75, R = Math.PI / 180;
const FOOT_X = 0.15, TOE_OUT = 10;                       // see the header: the engine's flat-foot limit
const GRIP_X = 0.18;
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
  if (fa * fb > 0) throw new Error(`sumo_deadlift: no solution in [${a}, ${b}]`);
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
// The floor start (c4): the trunk FLOOR_INCL from vertical, 7.5 deg more upright than conventional_deadlift's drawn
// floor trunk (67.6 deg there; c4 "5-10 degrees greater vertical trunk", its midpoint). The bar sits over mid-foot at
// the plates' height; for a root z the root height is SOLVED (bracket 0.3-0.9) so the straight arm reaches the bar,
// and the root z is SOLVED (bracket -0.55..-0.40: the hips-back root, the bar in front of the shins) so the bar is 5 mm
// in front of the near shin (against the shins, c13).
const FLOOR_INCL = 60.1;
const FLOOR_BAR = [0, PLATE_R, 0];
const reachY = z => bisect(y => { const S = landmarksOf(body(y, z, FLOOR_INCL, FLOOR_SPINE), H)['shoulder.r']; return Math.hypot(S[1] - FLOOR_BAR[1], S[2] - FLOOR_BAR[2]) - armDrop(S); }, 0.3, 0.9);
const FLOOR_Z = bisect(z => legGap(landmarksOf(body(reachY(z), z, FLOOR_INCL, FLOOR_SPINE), H), FLOOR_BAR) - BAR_GAP, -0.55, -0.4);
const end = { ...body(reachY(FLOOR_Z), FLOOR_Z, FLOOR_INCL, FLOOR_SPINE), reach: hands(FLOOR_BAR) };

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
  throw new Error(`sumo_deadlift: no via bracket at bar height ${barY}`);
};
const via = VIA_F.map(f => { const y = PLATE_R + f * (START_BAR[1] - PLATE_R), sp = FLOOR_SPINE * (1 - f); const p = plumb(y, sp, bracketOf(y, sp)); delete p.incl; return p; });
// Mistake (c12): the hips raised M_RISE straight up with the bar still on the floor: the trunk angle that lets the straight
// arms still reach the bar is SOLVED (bracket: the floor angle to 100 deg), so the chest drops toward the bar.
const M_RISE = 0.10, M_ROOT = [0, end.root.at[1] + M_RISE, end.root.at[2]];
const M_INCL = bisect(i => { const S = landmarksOf(body(M_ROOT[1], M_ROOT[2], i, FLOOR_SPINE), H)['shoulder.r']; return Math.hypot(S[1] - FLOOR_BAR[1], S[2] - FLOOR_BAR[2]) - armDrop(S); }, FLOOR_INCL, 100);
const mistakePose = { root: body(M_ROOT[1], M_ROOT[2], M_INCL, FLOOR_SPINE).root, trunk: FLOOR_SPINE, reach: hands(FLOOR_BAR) };

export const sumoInfo = { floorIncl: +FLOOR_INCL.toFixed(1), mIncl: +M_INCL.toFixed(1), topIncl: +TOP_INCL.toFixed(1), topArm: +TOP_ARM.toFixed(1), floorKnee: +kneeOf(landmarksOf(end, H)).toFixed(1), hipY: +landmarksOf(end, H)['hip.r'][1].toFixed(3) };

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
export default {
  id: 'sumo_deadlift', name: 'Sumo Deadlift', view: 'side', facing: 'right',
  camera: { x0: 172, y0: 339 },
  poses: { start, via, end },
  equipment: [
    { type: 'floor', from: -0.75, to: 0.75 },
    (lm, ctx) => (ctx.pose === 'start' ? null : handPoly(lm)),
    lm => ({ type: 'barbell', at: barAt(lm), plates: [0.045], part: 'bar', z: 'front' }),
    (lm, ctx) => (ctx.pose === 'end' ? { type: 'line', cls: 'eq-cable m-line', pts: START_DOT, z: 'front', part: 'startbar' } : null),
  ],
  checks: [
    { landmark: 'heel.r', plane: floor, pose: 'all', tol: 0.5 },
    { landmark: 'ball.r', plane: floor, pose: 'all', tol: 0.5 },
    { landmark: 'heel.l', plane: floor, pose: 'all', tol: 0.5 },
    { landmark: 'ball.l', plane: floor, pose: 'all', tol: 0.5 },
    { landmark: 'grips', plane: { point: [0, 0, 0], normal: [0, 0, 1] }, pose: 'end', tol: 0.5 },          // c1 bar over mid-foot
    { landmark: 'grips', plane: { point: [0, PLATE_R, 0], normal: [0, 1, 0] }, pose: 'end', tol: 0.5 },    // c23 plates on the floor
    { landmark: 'grips', plane: { point: [0, 0, 0], normal: [0, 0, 1] }, pose: 'start', tol: 0.5 },        // lockout over mid-foot
  ],
  startParts: ['trunk', 'leg.r', 'arm.r'],
  ghosts: { count: 2, parts: ['trunk', 'leg.r', 'arm.r'] },
  trace: { point: 'grip.r', trim: [10, 12] },
  datum: [{ x: [0, 0, 0], from: 349, to: 150 }],
  callouts: [
    { key: 'shins', text: 'Bar on<br>shins', anchor: 'grip.r', box: { left: 214, top: 252 }, cue: 'Keep the bar against your shins so it does not drift forward.' },
    { key: 'chest', text: 'Chest up', anchor: 'sternum', box: { left: 222, top: 172 }, cue: 'Keep your chest up and your back straight, trunk more upright.' },
    { key: 'legs', text: 'Legs drive<br>first', anchor: 'knee.r', box: { left: 40, top: 282 }, cue: 'Push with your legs to break the bar from the floor.' },
  ],
  tempo: [{ phase: 'Lower', s: 2, move: true }, { phase: 'Lift', s: 1, move: true }],
  mistake: {
    pose: mistakePose,
    guides: [
      { kind: 'arrow', from: { at: 'hip.r', pose: 'end', off: [-26, 0] }, to: { at: 'hip.r', pose: 'mistake', off: [-26, 0] } },
    ],
    tells: [
      { key: 'hips', text: 'Hips shoot<br>up', anchor: { at: 'buttock', pose: 'mistake' }, box: { left: 8, top: 176 }, cue: 'The hips rise first while the bar stays on the floor.' },
      { key: 'chest', text: 'Chest<br>drops', anchor: { at: 'sternum', pose: 'mistake' }, box: { left: 232, top: 178 }, cue: 'The chest drops toward the bar and the back takes the lift.' },
    ],
  },
  alt: 'Sumo deadlift, side view. From standing tall, the lifter lowers the bar to the floor with hands inside the knees, the bar against the shins and the chest up, the trunk more upright than a conventional pull, and lifts it by driving with the legs.',
};
