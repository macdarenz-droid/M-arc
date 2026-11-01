// Smith machine shrug, side view, figure facing screen right. LIB-13s wave 2 (mode H, D-LIB13S-MODES: PARAMS has no
// Smith value; an LB6 id drawn with its parent, D-LIB13S-LANE).
// Clone sources (D-LIB9-CLONE, copied, never imported): barbell_shrug's bytes as approved in panel mx16 @ 01b66192 (the
//  standing body, the 5 cm shrug, the hidden start shoulders, the hand capsule, the zoom); smith_machine_bench_press
//  (pilot B) for the rig call (eq/smith.mjs, unedited: railZ, bar, stopY, stop, stopZ, base).
// Sources: research card docs/research/howto/cards/smith_machine_shrug.json (research a48b0594):
//  c1  the Smith bar at mid-thigh height; feet shoulder width; an overhand grip slightly wider than the shoulders; the
//      arms hang long with a slight elbow bend (start pose; the start hand contact, plateFacts wrist.r);
//  c2  the shoulders straight up toward the ears with the arms kept long, lowered slowly, no roll (end pose);
//  c3  named mistakes: leaning the head forward first (the Mistake), rocking, bending the elbows too much;
//  c4  safety pins set to stop the bar dropping (the stops under the bar);
//  c11 tempo 2-1-2: 2 s down, a 1 s pause at the bottom (named in tempo.json, not drawn), 2 s up.
// Geometry decisions: the parent's body and shrug (barbell_shrug.mjs header), then:
//  Rig: the rail at RAIL_Z, the bar's one vertical line (c8 of the anchor: a straight path), 13 cm in front of the hip
//   line, so the bar end (r 2.5 cm) clears the drawn thighs by 2 px or more (D-LIB13S-CLEAR); the bar rises 5 cm on
//   the rail with the shoulders. Stops (c4) STOP_BELOW under the start bar's underside, drawn in front as the anchor
//   draws them; the floor beam under the rails (the mx12 lesson). Rails, hooks, carriage, stops, frame and beam stand
//   beside the body in depth: listed, not tested (D-LIB13S-CLEAR).
//  Arms (c1): the elbows bent ELBOW_BEND, the grip solved at that reach on the rail line, so the bar sits between the
//   hip and knee heights at the start (mid-thigh, c1).
//  Mistake (c3): the head pushed forward as the shoulders rise. The engine's neck only flexes (body.mjs rotX(q.neck)),
//   so the forward head draws as a tipped head, M_NECK; the tell sits on the crown (`head`) and an arrow shows its move.
// Unsourced numbers: SHRUG, KNEE_SOFT, FOOT_X (the parent's), ELBOW_BEND (c1 "slight"), RAIL_Z, M_NECK, STOP_BELOW,
//  STOP_SIZE (the anchor's), PLATE_D, the rig's sizes (eq/smith.mjs header).
import { WINTER, REF, landmarksOf, bodyShapes, fk, resolve, normPose } from '../engine.mjs';
import { perItem } from '../eq/parts.mjs';
import { smith, SMITH_ITEMS } from '../eq/smith.mjs';

const H = 1.75, R = Math.PI / 180;
const FOOT_X = 0.10;                                   // mid-sole lateral offset: feet hip width
const KNEE_SOFT = 5;                                   // deg: knees slightly flexed
const GRIP_X = 0.25;                                   // hand centre lateral offset: slightly wider than shoulder width
const SHRUG = 5;                                       // cm shoulder-girdle elevation at the top (CARD)
const BAR_R = 0.025;                                   // the Smith bar end (smith_machine_bench_press's)
const RAIL_Z = 0.13, ELBOW_BEND = 12, M_NECK = 20, STOP_BELOW = 0.02, STOP_SIZE = { w: 0.25, h: 0.05 }, PLATE_D = 0.45;
const ARM = (() => { const a = WINTER.upperArm * H, b = (WINTER.forearm + REF.gripOff) * H; return Math.sqrt(a * a + b * b + 2 * a * b * Math.cos(ELBOW_BEND * Math.PI / 180)); })();   // elbows ELBOW_BEND

const FOOT_Z = REF.mid * H;
const LEG = (() => { const a = WINTER.thigh * H, b = WINTER.shank * H, k = KNEE_SOFT * R; return Math.sqrt(a * a + b * b + 2 * a * b * Math.cos(k)); })();
const ROOT_Y = Math.sqrt(LEG * LEG - (FOOT_X - REF.hjcX * H) ** 2) + WINTER.ankleH * H;
const feet = { l: { at: [FOOT_X, 0, FOOT_Z] }, r: { at: [-FOOT_X, 0, FOOT_Z] } };
const base = { root: { at: [0, ROOT_Y, 0], tilt: 0 }, trunk: 0, neck: 0, plant: feet };

// Drawn-shape helpers (engine body shapes on a 1000 px/m probe camera, the same Catmull-Rom spline it draws).
const bd = { height: H }, probe = { view: 'side', near: 'r', pxm: 1000, P: w => [w[2] * 1000, -w[1] * 1000] };
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
const shapesOf = pose => bodyShapes(fk(resolve(normPose(pose, bd), bd).q, bd), probe)
  .map(s => ({ key: s.key, pts: s.key.includes('cap') ? s.poly : cr(s.poly) }));
// Key pose for a shrug height: the bar on the rail line, the hands at the bent-elbow reach.
function key(elev) {
  const p = { ...base, scap: { elev, pro: 0 } }, S = landmarksOf(p, H)['shoulder.r'], dx = GRIP_X - Math.abs(S[0]);
  const y = S[1] - Math.sqrt(ARM * ARM - dx * dx - (RAIL_Z - S[2]) ** 2);
  const pole = s => [s * 0.3, 0, -1];
  return { ...p, reach: { l: { at: [GRIP_X, y, RAIL_Z], pole: pole(1) }, r: { at: [-GRIP_X, y, RAIL_Z], pole: pole(-1) } } };
}
const start = key(0);
const end = key(SHRUG);
// The drawn start wrists (engine IK), for the card's c1 hand contacts (LIB-13s CARD FIELDS FIX: the grip quote states the start).
const START_W = (() => { const bd = { height: H }, sk = fk(resolve(normPose(start, bd), bd).q, bd); return { 'wrist.r': sk.W.r, 'wrist.l': sk.W.l }; })();
const barOf = pose => [0, pose.reach.r.at[1], pose.reach.r.at[2]];
// Start bar dot, dashed (engine limit: the start layer never draws moving equipment; barbell_back_squat's workaround).
// The bar end-on is the 28 mm shaft inside the fist (as golden lat_pulldown), not the 50 mm sleeve: at this 1.7x zoom a
// sleeve ring filled the fist, so the fist read as the bar and the hand as stopping short of it (critic run 2, R3).
const B0 = barOf(start), START_DOT = Array.from({ length: 17 }, (_, k) => [0, B0[1] + BAR_R * Math.sin(k * Math.PI / 8), B0[2] + BAR_R * Math.cos(k * Math.PI / 8)]);

// Start neck / trapezius / shoulder contour as hidden lines: the start torso outline where it lies inside the end
// figure and more than 1.5 mm from the end torso outline (i.e. only where the two differ: the shoulders).
const inside = (p, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
  const [xi, yi] = poly[i], [xj, yj] = poly[j];
  if ((yi > p[1]) !== (yj > p[1]) && p[0] < (xj - xi) * (p[1] - yi) / (yj - yi) + xi) c = !c; } return c; };
const distTo = (p, poly) => Math.min(...poly.map(q => Math.hypot(p[0] - q[0], p[1] - q[1])));
function hiddenShoulders() {
  const S = shapesOf(start).find(s => s.key === 'torso').pts, E = shapesOf(end), Et = E.find(s => s.key === 'torso').pts;
  const cover = E.map(s => s.pts), items = [];
  const vis = S.map(p => cover.some(c => inside(p, c)) && distTo(p, Et) > 1.5);
  const n = S.length, i0 = vis.indexOf(false);
  let run = [];
  for (let k = 1; k <= n; k++) { const i = (i0 + k) % n;
    if (vis[i]) run.push(S[i]); else { if (run.length > 2) items.push(run); run = []; } }
  if (run.length > 2) items.push(run);
  return items.map(r => ({ type: 'line', pts: r.map(([x, y]) => [0, -y / 1000, x / 1000]), cls: 'eq-cable m-line', z: 'front', part: 'startshoulders' }));
}
const START_SHOULDERS = hiddenShoulders();

// Mistake (c3): the head pushed forward as the shoulders rise: the end pose with the neck flexed M_NECK.
const mistakePose = { neck: M_NECK };
// Panel mx19 R5 (D-LIB13S-SMITHZOOM): the faulty head as one complete dashed outline, the same size as the solid head (the
// engine's head shape in the Mistake pose, its own spline), so the forward head reads whole and not only where it leaves
// the solid head; the fault keeps its drawn size.
const M_HEAD = (() => { const pts = shapesOf({ ...end, ...mistakePose }).find(s => s.key === 'head').pts.map(([x, y]) => [0, -y / 1000, x / 1000]); return [...pts, pts[0]]; })();
const HAND_R = 0.035, WRIST_R = 0.018;                // hand capsule radii at the bar and at the wrist (m)
const CAMERA = { x0: 176, y0: 339 };                   // reference scale (146.29 px/m): whole figure, feet on the floor line
// Closed hand (R3): the engine draws the fist as a circle on the grip centre, 8.7 cm past the wrist, so a gap opens
// between the forearm tip and the fist. A filled capsule from the wrist to the grip (fist radius 3.5 cm at the bar,
// forearm tip 1.8 cm at the wrist) closes the hand around the 28 mm shaft; the shaft is drawn on top of it.
function handPoly(lm) {
  const W = lm['wrist.r'], G = lm['grip.r'], d = [G[1] - W[1], G[2] - W[2]], L = Math.hypot(...d), u = [d[0] / L, d[1] / L], n = [-u[1], u[0]], pts = [];
  for (let a = -90; a <= 90; a += 30) pts.push([G[0], G[1] + HAND_R * (Math.cos(a * R) * u[0] + Math.sin(a * R) * n[0]), G[2] + HAND_R * (Math.cos(a * R) * u[1] + Math.sin(a * R) * n[1])]);
  for (let a = 90; a <= 270; a += 45) pts.push([G[0], W[1] + WRIST_R * (Math.cos(a * R) * u[0] + Math.sin(a * R) * n[0]), W[2] + WRIST_R * (Math.cos(a * R) * u[1] + Math.sin(a * R) * n[1])]);
  return { type: 'poly', pts, curve: true, cls: 'eq-solid', z: 'front', part: 'hand' };
}
const floor = { point: [0, 0, 0], normal: [0, 1, 0] };
const barAt = lm => [0, lm.grips[1], RAIL_Z];
const STOP_Y = B0[1] - BAR_R - STOP_BELOW;            // c4: the stops under the start bar
const rigOf = lm => smith({ railZ: RAIL_Z, bar: barAt(lm), stopY: STOP_Y, stop: STOP_SIZE, stopZ: 'front', base: [RAIL_Z - 0.12, RAIL_Z + 0.45] });

export default {
  id: 'smith_machine_shrug', name: 'Smith Machine Shrug', view: 'side', facing: 'right',
  camera: CAMERA,
  poses: { start, end },
  equipment: [
    { type: 'floor', from: -0.45, to: RAIL_Z + 0.55 },
    ...perItem(lm => rigOf(lm), SMITH_ITEMS),
    (lm, ctx) => {
      const b = barAt(lm), moved = ctx.pose === 'end' || ctx.pose === 'mistake';
      return [
        ...(moved ? [{ type: 'barbell', at: b, plateD: PLATE_D, plates: [0.045], part: 'plate', z: 'back' }] : []),
        ...(ctx.pose === 'start' ? [] : [handPoly(lm)]),
        { type: 'pulley', at: b, r: BAR_R, part: 'bar', z: 'front' },
        ...(ctx.pose === 'end' && !ctx.mistake ? [...START_SHOULDERS, { type: 'line', cls: 'eq-cable m-line', pts: START_DOT, z: 'front', part: 'startbar' }] : []),
      ];
    },
  ],
  checks: [
    { landmark: 'heel.r', plane: floor, pose: 'all', tol: 0.5 },
    { landmark: 'ball.r', plane: floor, pose: 'all', tol: 0.5 },
    // shoulder rise: the end shoulder joint is SHRUG cm above the start one
    { landmark: 'shoulder.r', plane: { point: [0, landmarksOf(start, H)['shoulder.r'][1] + SHRUG / 100, 0], normal: [0, 1, 0] }, pose: 'end', tol: 0.2 },
    { landmark: 'wrist.r', at: START_W['wrist.r'], pose: 'start', tol: 0.5 },   // c1 fact: the near hand on the bar
  ],
  startParts: ['arm.r'],
  ghosts: { count: 0 },
  trace: { point: 'shoulderTop.r', trim: [0, 0] },
  // D-LIB13S-ZOOM: the 5 cm shrug (shoulderTop.r), the smallest ladder k over the Trace bar. No Mistake zoom (ruled,
  // #359 option 1): the crown's 13.0 px move meets the 11.39 px bar, so QA refuses one (H3.zoom:not-needed:mistake)
  zoom: { view: 'normal', k: 3.5 },
  // Two levels bracket the 5 cm rise: shoulder top at the start and at the top (R7: small at full-figure scale).
  datum: [{ y: 'start:shoulderTop.r', from: 130, to: 'start:shoulderTop.r' }, { y: 'shoulderTop.r', from: 130, to: 'shoulderTop.r', mistake: false }],   // from 130 (the parent's 60): the labels sit left
  measure: { vertex: 'elbow.r', from: 'shoulder.r', to: 'wrist.r', radius: 18, title: 'Elbow', value: 'slight bend' },
  // The two head-level labels boxed on the left, apart (the engine stacked them 22 px apart: H4.overlap).
  callouts: [
    // c1
    { key: 'arms', text: 'Arms long', anchor: { along: ['elbow.r', 'wrist.r'], t: 0.5, off: [8, 0] }, cue: 'Let your arms hang long with only a slight bend at the elbows.' },
    // c2
    { key: 'up', text: 'Straight up', anchor: 'shoulderTop.r', box: { left: 24, top: 92 }, cue: 'Lift your shoulders up toward your ears and lower them, with no rolling.' },
    // c3
    { key: 'head', text: 'Head still', anchor: 'head', box: { left: 50, top: 44 }, cue: 'Keep your head level, not pushed forward.' },
  ],
  tempo: [{ phase: 'Lift', s: 2, move: true }, { phase: 'Lower', s: 2, move: true }],   // c11
  mistake: {
    pose: mistakePose,
    guides: [
      { kind: 'dashed', pts: M_HEAD, smooth: true },
      { kind: 'arrow', from: { at: 'head', pose: 'end', off: [4, -4] }, to: { at: 'head', pose: 'mistake', off: [4, -4] } },
    ],
    tells: [
      // c3 (plate.mistake.what)
      { key: 'head', text: 'Head forward', anchor: { at: 'head', pose: 'mistake' }, cue: 'The head pushes forward as the shoulders rise.' },
      // c3
      { key: 'chin', text: 'Chin drops', anchor: { at: 'chin', pose: 'mistake', off: [6, -5] }, cue: 'The chin drops instead of the head staying level.' },
    ],
  },
  alt: 'Smith machine shrug, side view. Standing tall with soft knees, the Smith bar hangs at mid-thigh on long arms with a slight elbow bend. Only the shoulders lift straight up the rails toward the ears and lower again. The head stays level.',
};
