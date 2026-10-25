// Dumbbell Fly (flat bench, palms facing), FRONT view from the feet: the census and card view (no F6). SUPINE class
// child. makeFly('front') is the plate; makeFly('side') is the former side plate, kept as the alternate
// (dumbbell_fly__alt.mjs): it cannot show the arc width or the elbow bend (critic R1/R4-R7 = 3).
// Front-view construction (the engine limit and how it is met without touching the engine):
//  - The engine's front torso and head are frontal outlines (vendor/engine/body.mjs:36-44 HEAD_FRONT/torsoHalf, drawn
//    at z = 0 and skinned at :295-305), so with the pelvis tilted -90 they project to a zero-height band (SPEC 8). The
//    torso is supplied as one `poly` (TORSO): its outline is derived from the engine's own two torso outlines (front
//    width, side depth, per trunk level) skinned onto this lying skeleton, and the union of those sections is what the
//    camera at the feet sees: a dome on the pad 49 cm wide (the shoulders) and 68.5 cm high (the chest top, = the
//    `chest` landmark). Class 'eq-solid' is the body's fill and line colour; its 1 px stroke equals the body's visible
//    line (the body union strokes 2 px and paints its fill over the inner half; pixel-checked in both themes).
//    z 'center' puts it over the body group (the arms, whose roots are truly behind the chest) and under the legs
//    (truly in front of it).
//  - The head is truly hidden behind the chest from the feet (face top 0.64 m by the engine's side head outline, chest
//    0.685 m), and the thighs hide the lower dome: both are drawn as light x-ray outlines ('eq-line', XRAY) over the legs.
//  - Feet FOOT_X apart, toes slightly out (c1 sets no width): the knees then clear the pad, so the bench pad and post
//    show between the shins and the shoulders beside the knees. The camera has no pitch (orthographic, horizontal), so
//    the thighs hide the lower torso; a raised foot-end camera would show the chest and head (engine change, not made).
//    Critic 10-02 R1 ("shorten the shins, knee tops at y 890-895 of the 780 px shot") is not met, by that limit: the
//    rounded tops at y ~852 are the thigh roots (hip joints y 878, thigh hip-end radius 0.048 H = 24 px), not the
//    knees (knee joints y 899, already over the feet: 346/434 vs ankles 347/433). The hips rest on the 43 cm pad, so
//    no foot or knee placement lowers them (feet 18 cm further out drops the knees 16 px, tops unchanged); segment
//    lengths and the camera pitch live in the locked engine (vendor/engine/body.mjs WINTER/RADII, plate.mjs makeCamera).
// Sources: research card docs/research/howto/cards/dumbbell_fly.json (pilot-a/cards, verified), claims c1 (flat
// bench, feet flat), c2 (blades down and back, five-point contact), c3 (start: dumbbells pressed up to shoulder width,
// palms facing, slight elbow bend, neutral wrists), c4 (lower in a wide arc until the dumbbells are level with the
// shoulders or chest, dumbbells parallel), c5 (the same slight elbow bend down and up), c10 (tempo).
// Geometry decisions:
//  - Body, bench and blades: dumbbell_bench_press (the SUPINE anchor): `supine()` root/trunk/neck on a 43 cm flat bench,
//    feet flat FOOT_Z in front of the hip, scap back and down. Same checks (upper back and buttocks on the pad, soles on
//    the floor, head above the pad).
//  - Arc: each grip moves on a circle round its shoulder joint in the plane across the body at ARC_DZ toward the feet
//    from the shoulder joints (over the upper chest). The grip-to-shoulder distance is the one of an arm with the
//    elbow bent ELBOW deg, so the reach IK returns that elbow at every key pose (c5); 7 key poses (start, 5 via, end)
//    keep the interpolated chord within 0.6% of the arc. The measure arc draws the held bend (interior 160 deg, no
//    `expect`: the card gives no number; ELBOW is this plate's reading of "slight").
//  - Start (c3): arms up, grips SHOULDER_W apart centre to centre, leaning in only as the elbow bend needs.
//  - End (c4): lowered until the grip is level with the top of the chest (END_LEVEL, the chest surface at the nipple
//    line): the shallow end of "shoulders or chest", so the Mistake (deeper) reads. The datum is that stop line, grip
//    to grip across the chest top.
//  - Elbow pole: out and a little down, so the bend is in the arc plane with the elbows pointing out (c5).
//  - Dumbbells: `dumbbell` primitive, axis [0,0,1] (palms facing, handles along the body, c3/c4 "parallel"): end-on
//    hexes in front view. The start layer never draws equipment, so the start dumbbells are dashed phantom hexes.
// Plate labels (verified card): callouts = plate.checkpoints c5 (Soft elbows, on the end elbow), c4 (Stop at chest,
//   on the end dumbbell), c4 (Dumbbells parallel, on the start dumbbell); measure = the held elbow bend (c5);
//   Mistake = plate.mistake c4 (grips MIS_BELOW under the shoulder joint: dumbbells 5 cm under the pad top),
//   guides = the chest-level stop line and the drop arrow, tells on the faulty dumbbell and elbow; tempo = plate.tempo
//   c10 (2 s down, 2 s up, no pause). Trace = the grip: the arc (a press would trace a vertical line).
// CARD: ELBOW (slight bend), SHOULDER_W (start width), END_LEVEL (stop height), ARC_DZ (arc plane over the chest).
import { landmarksOf, fk, resolve, normPose, bodyShapes, WINTER, REF } from '../engine.mjs';
import { supine } from './dumbbell_bench_press.mjs';

const H = 1.75, BODY = { height: H };
const R = Math.PI / 180;
const BENCH_TOP = 0.43, BENCH_LEN = 1.2, BENCH_Z = -0.40;   // as dumbbell_bench_press
const FOOT_Z = 0.51;
const SCAP = { elev: -1, pro: -3 };
const ELBOW = 20;                                     // slight elbow bend, fixed through the arc (deg) (c3, c5)
const SHOULDER_W = 0.44;                              // start: grip centres apart (m): shoulder width (c3)
const ARC_DZ = 0.08;                                  // arc plane this far toward the feet of the shoulder joints (m): over the upper-mid chest
const END_LEVEL = 'chest';                            // end: grip level with the chest surface at the nipple line (c4)

const LYING = supine(BENCH_TOP, 0);
const FOOT_X = 0.16;                                  // feet flat, 32 cm apart (centres), toes slightly out, knees over the toes (c1)
const feet = { l: { at: [FOOT_X, 0, FOOT_Z], toe: [0.15, 0, 1] }, r: { at: [-FOOT_X, 0, FOOT_Z], toe: [-0.15, 0, 1] } };
const base = { ...LYING, scap: SCAP, plant: feet };
const lm0 = landmarksOf(base, H), sk0 = fk(resolve(normPose(base, BODY), BODY).q, BODY);
const S = { l: lm0['shoulder.l'], r: lm0['shoulder.r'] };
const L1 = WINTER.upperArm * H, L2 = WINTER.forearm * H + REF.gripOff * H;
const D = Math.sqrt(L1 * L1 + L2 * L2 + 2 * L1 * L2 * Math.cos(ELBOW * R));   // shoulder-to-grip with the bend
const Dh = Math.sqrt(D * D - ARC_DZ * ARC_DZ);                                  // radius in the arc plane
const CHEST = sk0.thorax([0, 0.72, 0.072]);                                     // chest surface, nipple line
const endY = END_LEVEL === 'chest' ? CHEST[1] : S.r[1];
// angle phi from straight up (0) toward the side, per side
const PHI0 = Math.asin((Math.abs(S.r[0]) - SHOULDER_W / 2) / Dh) / R * -1;       // start: grips inside the shoulders
const PHI1 = Math.acos((endY - S.r[1]) / Dh) / R;                               // end: grip at endY
const gripAt = (side, phi) => { const s = side === 'l' ? 1 : -1, sh = S[side];
  return { at: [sh[0] + s * Dh * Math.sin(phi * R), sh[1] + Dh * Math.cos(phi * R), sh[2] + ARC_DZ], pole: [s, -0.35, 0.15] }; };
const poseAtPhi = phi => ({ ...base, reach: { l: gripAt('l', phi), r: gripAt('r', phi) } });
const start = poseAtPhi(PHI0), end = poseAtPhi(PHI1);
const via = [1, 2, 3, 4, 5].map(k => k / 6).map(t => poseAtPhi(PHI0 + (PHI1 - PHI0) * t));
export const flyInfo = { phiStartDeg: +PHI0.toFixed(1), phiEndDeg: +PHI1.toFixed(1), endGripAboveShoulderCm: +((endY - S.r[1]) * 100).toFixed(1) };

// Mistake (card plate.mistake, c4): the dumbbells go below shoulder and chest level at the bottom of the arc. Same
// arc and elbow bend, lowered until the grip is MIS_BELOW under the shoulder joint (30 cm under the correct stop, 5 cm under the pad top).
const MIS_BELOW = 0.14;                               // faulty grip height under the shoulder joint (m)
const PHI_M = Math.acos(-MIS_BELOW / Dh) / R;
const mistakePose = { reach: { l: gripAt('l', PHI_M), r: gripAt('r', PHI_M) } };
const lmEnd = landmarksOf(end, H);
const chestLine = [[0, lmEnd['grip.r'][1], lmEnd['grip.r'][2] - 0.16], [0, lmEnd['grip.r'][1], lmEnd['grip.r'][2] + 0.16]];

// start dumbbell phantoms (dashed), in metres, per view
const DB = { head: 0.119, headLen: 0.07, handle: 0.13 };
const hexRing = (c, r) => { const pts = []; for (let i = 0; i <= 6; i++) { const a = 60 * i * R; pts.push([c[0] + r * Math.cos(a), c[1] - r * Math.sin(a), c[2]]); } return pts; };
const sideDb = c => {   // side view, axis z: handle bar and two heads as outlines (primitive sizes)
  const hh = DB.head * 0.866 / 2, rect = (z0, z1, h) => [[0, c[1] - h, c[2] + z0], [0, c[1] - h, c[2] + z1], [0, c[1] + h, c[2] + z1], [0, c[1] + h, c[2] + z0], [0, c[1] - h, c[2] + z0]];
  return [rect(-DB.handle / 2 - DB.headLen, -DB.handle / 2, hh), rect(DB.handle / 2, DB.handle / 2 + DB.headLen, hh), [[0, c[1], c[2] - DB.handle / 2], [0, c[1], c[2] + DB.handle / 2]]];
};
const lmStart = landmarksOf(start, H);


// ---- front view: the lying torso seen end-on from the feet (the engine's front torso is a frontal outline) ----
// Built from the engine's own two torso outlines (bodyShapes of the standing figure): at every level of the trunk the
// half-width comes from the front outline and the back/front depth from the side outline; each level is skinned onto
// the lying skeleton (sk0.skin), giving a section flat on its back and rounded (elliptic) across the front. What the
// camera at the feet sees is the union of those sections: a dome on the pad, as wide as the shoulders and as high as
// the chest. The head is truthfully hidden behind it (face top 0.64 m, chest top 0.685 m).
const skStand = fk(resolve(normPose({}, BODY), BODY).q, BODY);
const outline = view => bodyShapes(skStand, { view, P: w => [view === 'front' ? w[0] : w[2], w[1]], pxm: 1, near: 'r' }).find(s => s.key === 'torso').poly;
const TF = outline('front'), TS = outline('side');
const cross = (pts, y, pick) => { let best = null; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length];
  if ((a[1] - y) * (b[1] - y) > 0 || a[1] === b[1]) continue; const u = a[0] + (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]); best = best == null ? u : pick(best, u); } return best; };
const SECTIONS = [];
for (let Y = 0.86; Y <= 1.47; Y += 0.015) {
  const w = cross(TF, Y, Math.max), zb = cross(TS.filter(p => p[0] < 0.01), Y, Math.min), zf = cross(TS.filter(p => p[0] > -0.01), Y, Math.max);
  if (w == null || zb == null || zf == null) continue;
  const b = sk0.skin([0, Y / H, zb / H]), t = sk0.skin([0, Y / H, zf / H]);
  SECTIONS.push({ w, b: b[1], t: t[1], z: (b[2] + t[2]) / 2 });
}
const W = Math.max(...SECTIONS.map(s => s.w)), Y0 = Math.min(...SECTIONS.map(s => s.b));
const domeTop = x => Math.max(Y0, ...SECTIONS.filter(s => Math.abs(x) < s.w).map(s => s.b + (s.t - s.b) * Math.sqrt(1 - (x / s.w) ** 2)));
const DOME = [[-W, Y0]];
for (let k = 1; k < 48; k++) { const x = -W * Math.cos(Math.PI * k / 48); DOME.push([x, domeTop(x)]); }
DOME.push([W, Y0]);
export const torsoInfo = { widthCm: +(2 * W * 100).toFixed(1), topCm: +(Math.max(...DOME.map(p => p[1])) * 100).toFixed(1), bottomCm: +(Y0 * 100).toFixed(1) };
// 'eq-solid' = the body's own fill and line colour. Its 1 px stroke matches the body's visible line: the body union
// strokes 2 px and paints its fill over the inner half, so 1 px of line shows outside every body outline.
const TORSO = { type: 'poly', pts: DOME.map(([x, y]) => [x, y, -0.3]), cls: 'eq-solid', z: 'center', part: 'torso' };
// Hidden body, x-ray (as the barbell's near plate in side view): the full dome and the head, end-on, as light
// 'eq-line' outlines over the legs (z 'mid'), so the body reads behind the bent knees. The head is where it truly is:
// resting on the pad, face up, inside the dome outline (engine head: 16 cm wide, back of head on the pad, face top
// HEAD_TOP by the side head outline).
const skEnd = fk(resolve(normPose(end, BODY), BODY).q, BODY);
const headSide = bodyShapes(skEnd, { view: 'side', P: w => [w[2], w[1]], pxm: 1, near: 'r' }).find(s => s.key === 'head').poly;
const HEAD_TOP = Math.max(...headSide.map(p => p[1])), HEAD_BOT = Math.min(...headSide.map(p => p[1])), HEAD_HW = 0.046 * H;
const ring = (cx, cy, rx, ry) => Array.from({ length: 37 }, (_, k) => [cx + rx * Math.cos(k * 10 * R), cy + ry * Math.sin(k * 10 * R), -0.8]);
const XRAY = [
  { type: 'line', pts: [...DOME, DOME[0]].map(([x, y]) => [x, y, -0.3]), cls: 'eq-line', z: 'mid' },
  { type: 'line', pts: ring(0, (HEAD_TOP + HEAD_BOT) / 2, HEAD_HW, (HEAD_TOP - HEAD_BOT) / 2), cls: 'eq-line', z: 'mid' },
];

/** The fly plate in `view` ('front' = the card, 'side' = the former view, kept as the alternate); `id` for the file. */
export function makeFly(view, id) {
  return view === 'front' ? frontFly(id) : sideFly(id);
}

const ALT = 'Dumbbell fly, front view from the feet. Lying on a flat bench, feet flat, the lifter lowers the dumbbells out to the sides in a wide arc, elbows slightly bent and fixed, until level with the chest, then raises them back. Mistake: dumbbells sinking below the bench.';

function frontFly(id) {
  const phantom = ['l', 'r'].map(s => ({ type: 'line', pts: hexRing(lmStart[`grip.${s}`], DB.head / 2), cls: 'eq-line m-line', z: 'front' }));
  return {
    id, name: 'Dumbbell Fly', view: 'front',
    camera: { x0: 179, y0: 339 },
    poses: { start, end, via },
    equipment: [
      { type: 'floor', from: -1.05, to: 1.05 },
      { type: 'bench', at: [0, BENCH_TOP, BENCH_Z], len: BENCH_LEN },
      TORSO, ...XRAY,
      (lm, ctx) => (ctx.pose === 'end' ? phantom : null),
      lm => [{ type: 'dumbbell', at: lm['grip.l'], axis: [0, 0, 1], z: 'front', part: 'db.l' },
        { type: 'dumbbell', at: lm['grip.r'], axis: [0, 0, 1], z: 'front', part: 'db.r' }],
    ],
    checks: CHECKS,
    marks: ['elbow.l', 'elbow.r'],
    startParts: ['arm.l', 'arm.r'],
    ghosts: { count: 3, parts: ['arm.r', 'db.r'] },
    trace: { point: 'grip.l', trim: [12, 12] },
    measure: { vertex: 'elbow.r', from: 'shoulder.r', to: 'wrist.r', radius: 18, title: 'Elbow', value: 'slight bend, held' },
    datum: [{ y: 'grip.r', from: { at: 'grip.r', off: [-14, 0] }, to: { at: 'grip.l', off: [14, 0] }, mistake: false }],   // the stop line: dumbbells level with the chest top (c4)
    callouts: [
      { key: 'elbows', text: 'Soft<br>elbows', anchor: 'elbow.l', box: { left: 224, top: 268 }, cue: 'Keep a slight elbow bend that stays the same all the way.' },
      { key: 'stop', text: 'Stop at<br>chest', anchor: 'grip.l', box: { left: 290, top: 262 }, cue: 'Lower until the dumbbells are level with your chest, no deeper.' },
      { key: 'parallel', text: 'Dumbbells<br>parallel', anchor: 'start:grip.l', cue: 'Keep both dumbbells parallel, palms facing, through the whole arc.' },
    ],
    tempo: [{ phase: 'Lower', s: 2, move: true }, { phase: 'Raise', s: 2, move: true }],
    mistake: {
      pose: mistakePose,
      guides: [
        { kind: 'dashed', pts: [[-W - 0.08, lmEnd['grip.r'][1], 0], [W + 0.08, lmEnd['grip.r'][1], 0]] },   // where it should stop
        { kind: 'arrow', from: { at: 'grip.r', pose: 'end', off: [0, 12] }, to: { at: 'grip.r', pose: 'mistake', off: [0, -12] } },
      ],
      tells: [
        { key: 'deep', text: 'Below<br>the chest', anchor: { at: 'grip.r', pose: 'mistake' }, cue: 'Your dumbbells sink below chest and shoulder level at the bottom.' },
        { key: 'elbow', text: 'Elbows<br>too low', anchor: { at: 'elbow.l', pose: 'mistake' }, cue: 'Your elbows drop below the bench line and strain the shoulder front.' },
      ],
    },
    alt: ALT,
  };
}

const CHECKS = [
  { landmark: 'backUpper', plane: { point: [0, BENCH_TOP, 0], normal: [0, 1, 0] }, pose: 'all', tol: 1 },   // upper back ON the pad (c2)
  { landmark: 'buttock', plane: { point: [0, BENCH_TOP, 0], normal: [0, 1, 0] }, pose: 'all', tol: 1 },     // buttocks ON the pad
  { landmark: 'head', above: { point: [0, BENCH_TOP, 0], normal: [0, 1, 0] }, pose: 'all' },               // head never inside it
  { landmark: 'sole.r', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },            // feet ON the floor
  { landmark: 'sole.l', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
];

function sideFly(id) {
  return {
    id, name: 'Dumbbell Fly', view: 'side', facing: 'right',
    camera: { x0: 205, y0: 339 },
    poses: { start, end, via },
    equipment: [
      { type: 'floor', from: -1.12, to: 0.80 },
      { type: 'bench', at: [0, BENCH_TOP, BENCH_Z], len: BENCH_LEN },
      (lm, ctx) => (ctx.pose === 'end' ? sideDb(lmStart['grip.r']).map(pts => ({ type: 'line', pts, cls: 'eq-line m-line', z: 'front' })) : null),
      lm => [{ type: 'dumbbell', at: lm['grip.l'], axis: [0, 0, 1], z: 'back', part: 'db.far' },
        { type: 'dumbbell', at: lm['grip.r'], axis: [0, 0, 1], z: 'front', part: 'db.r' }],
    ],
    checks: CHECKS,
    startParts: ['arm.r', 'arm.l'],
    ghosts: { count: 3, parts: ['arm.r', 'db.r'] },
    trace: { point: 'grip.r', trim: [12, 12] },
    datum: [{ y: 'grip.r', from: { at: 'grip.r', off: [-34, 0] }, to: { at: 'grip.r', off: [34, 0] }, mistake: false }],   // the stop line: chest level (c4)
    callouts: [
      { key: 'elbows', text: 'Soft<br>elbows', anchor: 'elbow.r', cue: 'Keep a slight elbow bend that stays the same all the way.' },
      { key: 'stop', text: 'Stop at<br>chest', anchor: 'grip.r', cue: 'Lower until the dumbbells are level with your chest, no deeper.' },
      { key: 'parallel', text: 'Dumbbells<br>parallel', anchor: 'start:grip.r', cue: 'Keep both dumbbells parallel, palms facing, through the whole arc.' },
    ],
    tempo: [{ phase: 'Lower', s: 2, move: true }, { phase: 'Raise', s: 2, move: true }],
    mistake: {
      pose: mistakePose,
      guides: [
        { kind: 'dashed', pts: chestLine },                                                   // where it should stop
        { kind: 'arrow', from: { at: 'grip.r', pose: 'end', off: [22, 0] }, to: { at: 'grip.r', pose: 'mistake', off: [22, 0] } },
      ],
      tells: [
        { key: 'deep', text: 'Below<br>the chest', anchor: { at: 'grip.r', pose: 'mistake', off: [14, 0] }, cue: 'Your dumbbells sink below chest and shoulder level at the bottom.' },
        { key: 'elbow', text: 'Elbows<br>too low', anchor: { at: 'elbow.r', pose: 'mistake' }, cue: 'Your elbows drop below the bench line and strain the shoulder front.' },
      ],
    },
    pilot: { note: 'Alternate (side view): cannot show the arc width or the elbow bend; the front view is the plate.' },
    alt: 'Dumbbell fly, side view. Lying on a flat bench, head, shoulders and hips on the pad, feet flat, the lifter lowers the dumbbells in a wide arc, elbows slightly bent and fixed, until level with the chest, then raises them back.',
  };
}

export default makeFly('front', 'dumbbell_fly');
