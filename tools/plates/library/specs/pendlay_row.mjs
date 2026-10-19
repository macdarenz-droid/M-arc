// Pendlay row (barbell, from the floor each rep), side view, figure facing screen right. LIB-13 (LB3, mode H, ruling 4).
// View: side (card plate.view = census view). The level torso, the bar path from floor to chest, the rounded back at
// the start (the top fault) and the back angle are front-to-back (c2, c4, c6).
// Sources: research card docs/research/howto/cards/pendlay_row.json (research head 2dd60ae0): callouts =
//  plate.checkpoints (c2 Back parallel, c4 Torso still, c3 Floor each rep); Mistake = plate.mistake (c8, c23: the back
//  rounded at the start, reaching the bar); tempo = plate.tempo (c14: up 1, down 2, pause 0; the dead stop on the floor
//  gives no seconds, so no static phase: DESIGN.md section 8).
// Clone source: barbell_row (#109 @ 48d49bb) for the held hinge and the end bar on the torso front, and this branch's
//  conventional_deadlift for the floor plumb solve and the rounded-back Mistake; copied, never imported (D-LIB9-CLONE).
// Pose map (DESIGN.md section 9): spec start = the card's plate.end (bar at the chest), spec end = the card's
//  plate.start (bar on the floor), because the Mistake is drawn against the end pose (plate.mjs:78, :208).
// Geometry decisions (confirmed by the engine report `angles` and `checks`):
//  Feet: mid-soles 24 cm apart, as pilot A's barbell_row for the same "about shoulder width" (c10; the side view hides
//   the stance, and with this level trunk a 30 cm+ stance leaves the IK foot off the floor), toes out 5 deg; mid-foot z 0.
//  Grip: overhand, hands 52 cm apart (slightly wider than the shoulders, as barbell_row).
//  Trunk (c2): shoulders and hips level: the pelvis tilt is SOLVED (bracket 70-100 deg) so the drawn back line (sacrum
//   to upper back) is horizontal, lumbar 3 deg (back flat). Held the same in start and end (c4: only the bar and the
//   arms move).
//  End = the floor start (c1, c3, c10): the 45 cm plates resting on the floor line (bar centre 22.5 cm up, the vendor
//   barbell), the bar over mid-foot, the arms straight (elbows locked) and hanging to it; the knees KNEE 20 deg
//   ("slightly bent"); the root SOLVED for the knee angle and for the bar over mid-foot. With a level trunk the
//   shoulders sit ahead of the bar and the arms lean back from vertical, as on pilot A's approved barbell_row, whose
//   card also says "arms straight down".
//  Start = the top (c4, c5): the same root and trunk; the bar on the torso front between the navel and the chest (the
//   "base of the chest or abs", 2 cm out: the shaft and clothing), at the point straight above the floor bar if that
//   lies on the navel-to-chest line, else at the nearer end of it; elbows driven back, the elbow straight above the bar (barbell_row's
//   solved elbow pole); shoulder blades back 4 cm.
//  Mistake (c8, c23): the bar still on the floor, the hips where they were, the pelvis tucked M_TUCK and the lumbar
//   spine flexed (SOLVED) so the straight, vertical arms still reach the bar: the back rounded to reach it. A dashed
//   hump guide (romanian_deadlift's method).
// Unsourced numbers: TOE_OUT 5, KNEE 20 (barbell_row's "slightly bent"), GRIP_X 0.26, SPINE 3, CLEAR 2 cm, PRO_START -4 / PRO_END 2 cm, WRIST -35
//  (convention), M_TUCK 30, HUMP 9.4 cm, the 2.2 m bar (vendor default).
import { landmarksOf } from '../engine.mjs';

const H = 1.75, R = Math.PI / 180;
const FOOT_X = 0.12, TOE_OUT = 5, GRIP_X = 0.26, SPINE = 3, WRIST = -35;
// Shoulder to grip centre at full reach as the engine's IK measures it with the wrist bent back WRIST deg (body.mjs
// solveReach: upper arm + the forearm-and-hand chord), at 99.98%: the IK then turns the forearm only by the hand's
// bend (about 9 deg), so the arm reads straight.
const REACH = (() => { const g = 0.46 * 0.108 * H, w = WRIST * Math.PI / 180; return (0.186 * H + Math.hypot(0.146 * H + g * Math.cos(w), g * Math.sin(w))) * 0.9998; })();
export const PLATE_D = 0.45;
const PLATE_R = PLATE_D / 2, CLEAR = 0.02, PRO_START = -4, PRO_END = 2;
const toe = s => [s * Math.sin(TOE_OUT * R), 0, Math.cos(TOE_OUT * R)];
const feet = { l: { at: [FOOT_X, 0, 0], toe: toe(1) }, r: { at: [-FOOT_X, 0, 0], toe: toe(-1) } };
// Bracketed root finder (Illinois regula falsi): throws when f(a) and f(b) have the same sign (D-LIB9-CLONE b).
export const solve = (f, a, b) => {
  let fa = f(a), fb = f(b), side = 0;
  if (fa * fb > 0) throw new Error(`pendlay_row: no solution in [${a}, ${b}]`);
  for (let i = 0; i < 60 && Math.abs(b - a) > 1e-7; i++) {
    const c = (a * fb - b * fa) / (fb - fa), fc = f(c);
    if (fc * fb > 0) { b = c; fb = fc; if (side === -1) fa /= 2; side = -1; } else if (fa * fc > 0) { a = c; fa = fc; if (side === 1) fb /= 2; side = 1; } else return c;
  }
  return (a + b) / 2;
};
const body = (y, z, tilt, pro, trunk = SPINE) => ({ root: { at: [0, y, z], tilt }, trunk, neck: 0, scap: { pro }, wrist: WRIST, plant: feet });
const TILT = solve(t => { const l = landmarksOf(body(1, 0, t, PRO_END), H); return l.backUpper[1] - l.sacrum[1]; }, 70, 100);
const armDrop = S => { const dx = GRIP_X - Math.abs(S[0]); return Math.sqrt(REACH ** 2 - dx * dx); };
const hands = (bar, pole) => ({ l: { at: [GRIP_X, bar[1], bar[2]], pole: [-pole[0], pole[1], pole[2]] }, r: { at: [-GRIP_X, bar[1], bar[2]], pole } });

// The floor start (barbell_row's method): the knees at KNEE; for a root z the root height is SOLVED for the knee angle
// (bracket 0.5-0.935), and the straight arm hangs from the shoulder down to the bar's height; the root z is SOLVED
// (bracket -0.6..0) so that bar sits over mid-foot. The shoulders end up ahead of the bar, as on barbell_row.
const KNEE = 20;
const kneeOf = lm => {
  const a = [0, 1, 2].map(i => lm['hip.r'][i] - lm['knee.r'][i]), b = [0, 1, 2].map(i => lm['ankle.r'][i] - lm['knee.r'][i]);
  return 180 - Math.acos((a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) / Math.hypot(...a) / Math.hypot(...b)) / R;
};
const hipY = z => solve(y => kneeOf(landmarksOf(body(y, z, TILT, PRO_END), H)) - KNEE, 0.5, 0.935);
const barZOf = z => { const S = landmarksOf(body(hipY(z), z, TILT, PRO_END), H)['shoulder.r'], d = armDrop(S); return S[2] - Math.sqrt(d * d - (S[1] - PLATE_R) ** 2); };
const ROOT_Z = solve(barZOf, -0.6, 0);
const FLOOR_BAR = [0, PLATE_R, 0], ROOT = [0, hipY(ROOT_Z), ROOT_Z];
const end = { ...body(ROOT[1], ROOT[2], TILT, PRO_END), reach: hands(FLOOR_BAR, [-0.2, 0, -1]) };

// The top: the bar on the torso front (navel -> chest line, CLEAR out), straight above the floor bar when that point is
// on the line, else at the chest end of it.
const onFront = (lm, t) => {
  const d = [lm.chest[1] - lm.navel[1], lm.chest[2] - lm.navel[2]], L = Math.hypot(...d), u = d.map(v => v / L);
  let n = [-u[1], u[0]];
  if (n[0] * (lm.chest[1] - lm.backUpper[1]) + n[1] * (lm.chest[2] - lm.backUpper[2]) < 0) n = n.map(v => -v);
  return [0, lm.navel[1] + d[0] * t + n[0] * CLEAR, lm.navel[2] + d[1] * t + n[1] * CLEAR];
};
const top0 = body(ROOT[1], ROOT[2], TILT, PRO_START), LT0 = landmarksOf(top0, H);
const T_PLUMB = (() => { const a = onFront(LT0, 0), b = onFront(LT0, 1); return (FLOOR_BAR[2] - a[2]) / (b[2] - a[2]); })();
const BAR_T = Math.max(0, Math.min(1, T_PLUMB));
const TOP_BAR = onFront(LT0, BAR_T);
const dorsal = (() => { const d = [0, 1, 2].map(i => LT0.backUpper[i] - LT0.chest[i]), L = Math.hypot(...d); return d.map(v => v / L); })();
const topAt = out => ({ ...top0, reach: hands(TOP_BAR, [-out, dorsal[1], dorsal[2]]) });
// Elbow pole lateral share SOLVED (bracket 0.05-5) so the elbow sits straight above the bar (the bent-back wrist turns the forearm about 9 deg off it).
const ELBOW_OUT = solve(out => landmarksOf(topAt(out), H)['elbow.r'][2] - TOP_BAR[2], 0.05, 5);
const start = topAt(ELBOW_OUT);

// Mistake (c8, c23): the back rounded to reach the bar on the floor.
const M_TUCK = 30;
const mistOf = sp => ({ ...end, root: { at: end.root.at, tilt: TILT - M_TUCK }, trunk: sp });
const reachErr = sp => { const S = landmarksOf(mistOf(sp), H)['shoulder.r']; return Math.hypot(S[1] - FLOOR_BAR[1], S[2] - FLOOR_BAR[2]) - armDrop(S); };
const M_SPINE = solve(reachErr, SPINE, 80);
const mistakePose = { root: mistOf(M_SPINE).root, trunk: M_SPINE, reach: hands(FLOOR_BAR, [-0.2, 0, -1]) };

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

export const prInfo = { armDeg: +(() => { const l = landmarksOf(end, H); return Math.atan2(l['shoulder.r'][2] - l.grips[2], l['shoulder.r'][1] - l.grips[1]) / R; })().toFixed(1), tilt: +TILT.toFixed(2), root: ROOT.map(v => +v.toFixed(3)), knee: +kneeOf(LM_E).toFixed(1), tPlumb: +T_PLUMB.toFixed(2),
  topBar: TOP_BAR.map(v => +v.toFixed(3)), mSpine: +M_SPINE.toFixed(1) };

const barAt = lm => [0, lm.grips[1], lm.grips[2]];
const START_DOT = Array.from({ length: 17 }, (_, k) => [0, TOP_BAR[1] + 0.025 * Math.sin(k * Math.PI / 8), TOP_BAR[2] + 0.025 * Math.cos(k * Math.PI / 8)]);
const floor = { point: [0, 0, 0], normal: [0, 1, 0] };
export default {
  id: 'pendlay_row', name: 'Pendlay Row', view: 'side', facing: 'right',
  camera: { x0: 172, y0: 339 },
  poses: { start, end },
  equipment: [
    { type: 'floor', from: -0.75, to: 0.75 },
    lm => ({ type: 'barbell', at: barAt(lm), plates: [0.045], part: 'bar', z: 'front' }),
    // the 50 mm sleeve alone as its own part, so the ghosts show the bar path without more plate circles (barbell_row)
    lm => ({ type: 'pulley', at: barAt(lm), r: 0.025, part: 'bardot', z: 'front' }),
    // the start bar, dashed (the start layer never draws moving equipment)
    (lm, ctx) => (ctx.pose === 'end' ? { type: 'line', cls: 'eq-cable m-line', pts: START_DOT, z: 'front', part: 'startbar' } : null),
  ],
  checks: [
    { landmark: 'heel.r', plane: floor, pose: 'all', tol: 0.5 },
    { landmark: 'ball.r', plane: floor, pose: 'all', tol: 0.5 },
    { landmark: 'heel.l', plane: floor, pose: 'all', tol: 0.5 },
    { landmark: 'ball.l', plane: floor, pose: 'all', tol: 0.5 },
    { landmark: 'grips', at: FLOOR_BAR, pose: 'end', tol: 0.5 },      // c3: the bar on the floor (plates on the floor line)
    { landmark: 'grips', at: TOP_BAR, pose: 'start', tol: 0.5 },      // c4, c5: the bar on the torso
  ],
  startParts: ['arm.r'],
  ghosts: { count: 3, parts: ['arm.r', 'bardot'] },
  trace: { point: 'grip.r', trim: [10, 12] },
  datum: [{ y: 'backUpper', from: 60, to: 300 }],
  callouts: [
    { key: 'back', text: 'Back<br>parallel', anchor: 'backUpper', cue: 'Keep your torso level with the floor, shoulders and hips at one height.' },
    { key: 'still', text: 'Torso still', anchor: 'buttock', box: { left: 40, top: 150 }, cue: 'Move only the bar and your arms, never stand up to pull.' },
    { key: 'floor', text: 'Floor<br>each rep', anchor: 'grip.r', box: { left: 226, top: 300 }, cue: 'Set the bar down on the floor at a dead stop between reps.' },
  ],
  tempo: [{ phase: 'Lower', s: 2, move: true }, { phase: 'Pull', s: 1, move: true }],
  mistake: {
    pose: mistakePose,
    guides: [
      { kind: 'dashed', pts: HUMP_PTS.pts },
      { kind: 'arrow', from: HUMP_OUT(0.12), to: HUMP_OUT(0.015) },
    ],
    tells: [
      { key: 'round', text: 'Back<br>rounded', anchor: { at: 'lumbar', pose: 'mistake', off: ROUND_OFF }, box: { left: 150, top: 110 }, cue: 'The back is rounded to reach the bar on the floor.' },
      { key: 'tuck', text: 'Hips tuck<br>under', anchor: { at: 'sacrum', pose: 'mistake' }, box: { left: 30, top: 150 }, cue: 'The hips tuck under and the back curls down.' },
    ],
  },
  pilot: { note: 'F2 cover 0.163 (named flag): a held hinge, only the arms and the bar move' },
  alt: 'Pendlay row, side view. Hinged with the torso level with the floor and the knees slightly bent, the lifter pulls the bar from a dead stop on the floor up to the base of the chest, moving only the arms, and sets it back down each rep.',
};
