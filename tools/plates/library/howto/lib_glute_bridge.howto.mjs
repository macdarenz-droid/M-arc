// LIB-SHIP W7: the How-to content of lib_glute_bridge (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/glute_bridge.json; its claim ids are named on each field's claim.
// Handling (D-SHIP-GRIP (b2)): the card archetype.hand is none (arms straight by the sides, c1; the barbell version holds
// the bar overhand, c14). Grip claims: c1 on setup step 2, c14 on the posture line 'barbell' (D-PFC-ROUND1 L2). No hand zoom (the card has none).
// Variant line (D-LIB5-VARIANT): equipment 'Bodyweight / Barbell'; the card's plate.variantLine says c1, c2, posture,
// mistakes and feel hold for both, and the barbell adds the bar over the hips with the hands stopping it rolling (c14).
// Red flags: the card's redFlags (back): LIB-5's back box (shared/back-box.mjs), linked by the low-back row.
//
// D-TEXT-GOLDEN (claim -> slot):
//   posture c3 breathe out up, in down          -> setup step 4
//   posture c3/c11 press the heels               -> feel row 'quads' fix, posture 'heels' (the T checkpoint heels-down, below)
//   posture c9 drive with the hips               -> setup step 4 (D-TEXT-PRINTED), posture 'drive'
//   posture c4 straight line at the top          -> posture 'line', zoom spine-top Right
//   posture c5 squeeze, hold the top a second    -> setup step 5
//   posture c12 knees in line with the toes      -> setup step 1 (D-TEXT-PRINTED), posture 'knees' (with c1's toes facing away)
//   zoom heels-down (Wrong null, LR-25)          -> T: setup step 1 (feet flat), feel row 'quads' fix, posture 'heels' (D-SHIP-TEXTZOOM)
//   handlingMistake overarching (c7, c6, c2)     -> posture 'back' (Q-W2-12), its fix the detail; zoom spine-top Wrong
//   handlingMistake feet in the wrong place      -> risk 'feet' (c8, D-TEXT-PRINTED), plate label 'Knees at 90', posture 'feet' (Q-W2-12), its fix the detail
//   handlingMistake hips pushed too high         -> zoom spine-top Wrong, risk 'high', posture 'line' (Q-W2-12), its fix the detail
import plateSpec, { END_TILT, END_HIP } from '../specs/glute_bridge.mjs';
import { REF, RADII, WINTER, normPose, resolve, fk, landmarks } from '../engine.mjs';
import { RED_FLAG } from '../../layers/howto/shared.mjs';
export { RED_FLAG };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'pg-gb': { cite: 'Glute Bridges (PureGym exercise guide)', url: 'https://www.puregym.com/exercises/glutes/glute-bridge/glute-bridges/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'ace-gb': { cite: 'Glute Bridge (ACE Exercise Library)', url: 'https://www.acefitness.org/resources/everyone/exercise-library/49/glute-bridge/',
    kind: 'guideline', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'pg-gbhub': { cite: 'Glute Bridge Exercises (PureGym exercise guide)', url: 'https://www.puregym.com/exercises/glutes/glute-bridge/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'sl-gb': { cite: 'How to Do Glute Bridge: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/glute-bridge/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'hl-gb': { cite: 'How to Perform 5 Variations of the Glute Bridge Exercise (Healthline)', url: 'https://www.healthline.com/health/fitness-exercise/glute-bridge-variations',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'pg-bgb': { cite: 'Barbell Glute Bridges (PureGym exercise guide)', url: 'https://www.puregym.com/exercises/glutes/glute-bridge/barbell-glute-bridges/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  // The back box's own source (shared/back-box.mjs boxClaim), as lib_rope_triceps_pushdown lists it: the card's redFlags 'back'.
  'nhs-back': { cite: 'NHS, Back pain', url: 'https://www.nhs.uk/conditions/back-pain/',
    kind: 'guideline', access: 'full', checked: '2026-10-02', use: 'CONSENSUS', note: 'When back pain needs a check.' },
};
// Not cited: c13 (load and harder versions, D-TEXT-PROGRESSION), c15 (tempo, plate only).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const CL = {
  c2: C(['CONSENSUS'], ['pg-gb', 'ace-gb', 'sl-gb'], 'card c2'),
  c6: C(['CONSENSUS'], ['ace-gb', 'pg-gb'], 'card c6'),
  c7: C(['CONSENSUS'], ['pg-gbhub', 'pg-gb'], 'card c7'),
  c9: C(['CONSENSUS'], ['pg-gbhub'], 'card c9'),
  c10: C(['CONSENSUS'], ['pg-gb', 'sl-gb', 'pg-gbhub'], 'card c10'),
  c11: C(['CONSENSUS'], ['hl-gb'], 'card c11'),
  knees: C(['CONSENSUS'], ['hl-gb', 'ace-gb'], 'card c12, c1'),
  c1: C(['CONSENSUS'], ['pg-gb', 'ace-gb'], 'card c1'),
  c14: C(['CONSENSUS'], ['pg-bgb'], 'card c14'),
  hold: C(['CONSENSUS'], ['pg-gb', 'sl-gb'], 'card c5, c3'),
  heels: C(['CONSENSUS'], ['ace-gb', 'pg-gb', 'hl-gb'], 'card c1, c3, c11'),
  back: C(['CONSENSUS'], ['pg-gbhub', 'pg-gb', 'ace-gb', 'sl-gb'], 'card c7, c6, c2'),
  feet: C(['CONSENSUS'], ['pg-gbhub', 'pg-gb', 'hl-gb'], 'card c8, c4'),
  line: C(['CONSENSUS'], ['ace-gb', 'pg-gb', 'hl-gb'], 'card c4, c6'),
  zoom: C(['CONSENSUS'], ['pg-gb', 'ace-gb', 'sl-gb', 'hl-gb'], 'card c2, c4, c6, c12'),
  lie: C(['CONSENSUS'], ['pg-gb', 'ace-gb', 'hl-gb'], 'card c1, c12'),
  drive: C(['CONSENSUS'], ['ace-gb', 'pg-gbhub'], 'card c3, c9'),
  c8: C(['CONSENSUS'], ['pg-gbhub'], 'card c8'),
  lowBack: C(['CONSENSUS'], ['pg-gbhub', 'pg-gb', 'ace-gb', 'sl-gb'], 'card c7, c2'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: the top (end), and the arch (card zoom spine-top Wrong, c6 "hips pushed too high, low
// back arched"): the spec's own Mistake solve (specs/glute_bridge.mjs place, onFloor, withArms, M_TILT; copied, never
// imported, D-LIB9-CLONE) with the lumbar extended ARCH deg instead of the spec's M_ARCH 12 and the hip HIP_X further extended: the upper back and the head
// on the floor, the pelvis tilt solved so the feet stay planted (knee to ankle one shank), the arms by the sides. Drawn
// solid (PFC fix round, D-PFC-ROUND1 #394 6701001868 L5: the plate's Mistake overlay sat 10-15 px over the Right),
// so the hips rise clearly over the shoulder-knee line with a visible low-back bow.
// The zoom's guides: a dashed shoulder-to-knee line ('path' guides, lib_hollow_body_hold's kind; the 'spine' kind needs a
// close-up css option) on the pose each crop shows: in the Right the hip sits on it, in the Wrong the hips bow above it.
// DRAWING VALUES (D-SHIP-DRAWVAL, #376 6614695581; precedent D-LIB7-2 and golden B's machine_chest_press seatDrop):
// ARCH 32 deg (lumbar extension) and HIP_X -25 deg (the hip extended past the top's in the pelvis solve, so the hips
// rise about 18 cm over the shoulder-knee line, D-PFC-ROUND1 second pass) are Wrong-pose sizes no card gives; NECK_MAX
// 90 widens the copied neck bracket (60 has no root on this arch); the crop window (centre offset, sizePx) and LINE_EXT are
// drawing values; no number from them appears in user copy; the layers panel judges them.
const H = 1.75, body = { height: H }, END = plateSpec.poses.end, ARCH = 32, END_KNEE = 90, NECK_MAX = 90, HIP_X = -25;
const bisect = (f, a, b, what) => {
  let fa = f(a);
  if (fa * f(b) > 0) throw new Error(`lib_glute_bridge: no solution for ${what} in [${a}, ${b}]`);
  for (let i = 0; i < 50; i++) { const m = (a + b) / 2, fm = f(m); if (fa * fm <= 0) b = m; else { a = m; fa = fm; } }
  return (a + b) / 2;
};
const skOf = p => fk(resolve(normPose(p, body), body).q, body), L = p => landmarks(skOf(p));
const BACK_UP = [[-0.030, 0.905], [-0.036, 0.876], [-0.048, 0.851], [-0.062, 0.826], [-0.070, 0.790], [-0.072, 0.750], [-0.066, 0.700]];
const HEAD = [[0.0, 1.0], [0.032, 0.994], [0.052, 0.976], [0.060, 0.952], [0.061, 0.930], [0.060, 0.905], [0.056, 0.885], [0.047, 0.872],
  [0.027, 0.873], [0.010, 0.882], [-0.008, 0.897], [-0.038, 0.912], [-0.054, 0.934], [-0.056, 0.960], [-0.045, 0.984], [-0.022, 0.998]];
const minY = pts => Math.min(...pts.map(q => q[1]));
const outlineOf = p => { const sk = skOf(p); return { backUp: BACK_UP.map(([z, y]) => sk.skin([0, y, z])), head: HEAD.map(([z, y]) => sk.head([0, y, z])) }; };
const place = (t, k, extra = {}) => {
  const p0 = { root: { at: [0, 0, 0], tilt: t }, trunk: k, neck: 0, ...extra };
  const o = outlineOf(p0), b = L(p0).backUpper;
  return { ...p0, root: { at: [0, -minY(o.backUp.filter((_, i) => BACK_UP[i][1] <= 0.845)), -b[2]], tilt: t } };
};
const onFloor = (t, k, extra = {}) => {
  const p1 = place(t, k, extra);
  const neck = bisect(n => minY(outlineOf({ ...p1, neck: n }).head), -40, NECK_MAX, 'the neck (head on the floor)');
  return { ...p1, neck };
};
const withArms = p => {
  const wristY = RADII.fore[2] * H;
  const e = bisect(x => L({ ...p, shoulder: { ext: x }, elbow: 0 })['wrist.r'][1] - wristY, -30, 89, 'the shoulder (wrist on the floor)');
  const q = { ...p, shoulder: { ext: e }, elbow: 0 };
  const w = bisect(a => { const sk = skOf({ ...q, wrist: a }); return sk.G.r[1] - sk.W.r[1]; }, -60, 60, 'the wrist (hand flat)');
  return { ...q, wrist: w };
};
const SOLE_R = END.plant.r.at, ANKLE_R = [SOLE_R[0], WINTER.ankleH * H, SOLE_R[2] - REF.mid * H], SHANK = WINTER.shank * H;
const A_TILT = bisect(t => { const l = L(place(t, -ARCH, { hip: END_HIP + HIP_X, knee: END_KNEE })), k = l['knee.r']; return Math.hypot(k[1] - ANKLE_R[1], k[2] - ANKLE_R[2]) - SHANK; },
  END_TILT - 40, END_TILT + 15, 'the arch pelvis (feet planted)');
const ARCHED = withArms({ ...onFloor(A_TILT, -ARCH), plant: END.plant });
// the shoulder-knee line of a pose (world points, a 'path' guide: dashed, its head at the knee), LINE_EXT past each end
const LINE_EXT = 0.06, LINE = (role, p) => { const l = L(p), a = l['shoulder.r'], b = l['knee.r'], d = b.map((v, i) => v - a[i]);
  return { kind: 'path', role, pts: [a.map((v, i) => v - d[i] * LINE_EXT), b.map((v, i) => v + d[i] * LINE_EXT)] }; };
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  arch: { pose: ARCHED },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// spine-top (M, drawn as DV: D-PFC-ROUND1 L5): the zoom shell (render/closeup/crop.mjs); the Wrong is the arch still
// drawn alone (solid), with the shoulder-knee line on each crop. heels-down is a text checkpoint (its Wrong is null,
// LR-25; D-SHIP-TEXTZOOM): posture 'heels'.
const zooms = [
  {
    key: 'spine-top', chip: 'Low back', heading: 'Spine at top', kind: 'posture',
    // claims: Right (callout, caption, alt) card c2, c4, c6, c12; Wrong card c6
    crop: { center: { at: 'hip.r', pose: 'right', off: [-4, 6] }, sizePx: 150 },
    right: 'end',
    wrong: { base: 'end', pose: ARCHED, solid: true },
    guides: [LINE('right', END), LINE('wrong', ARCHED)],
    callout: {
      right: { text: 'Straight line', anchor: 'hip.r' },
      wrong: { text: 'Back arched', anchor: { at: 'hip.r', pose: 'mistake' } },   // D-PFC-ROUND1: the raised hip, above the line
    },
    caption: {
      right: 'Core tight, pelvis tucked, straight line at the top.',
      wrong: 'Hips pushed too high, low back arched.',
    },
    alt: {
      right: 'Side view, top of the bridge. Shoulders, hips and knees form a straight line, the low back not arched.',
      wrong: 'Side view, top of the bridge. The hips push too high above the shoulder-knee line and the low back arches.',
    },
    feelRow: 'low-back',
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'glutes', plain: 'The glutes do the main work.' }],
  secondary: [
    { muscleId: 'hamstrings', plain: 'The hamstrings also work.' },
    { muscleId: 'quads', plain: 'The quads help, more if you drive through your toes.' },
  ],
  watch: [{ muscleId: 'lower_back', plain: 'The lower back should not hurt.' }],
  feelLine: 'You should feel this in your glutes and hamstrings.',
  rows: [
    // The card's first row (glutes and hamstrings) has no fix, so it is left out: the feel line says it (D-SHIP-Q16).
    { key: 'quads', where: 'Quads', at: { muscles: ['quads'] },
      means: 'Driving through the toes makes the quads do more.',
      fix: 'Press through your heels.',
      claim: CL.c11 },
    { key: 'low-back', where: 'Lower back', at: { muscles: ['lower_back'] },
      means: 'Overextending your back can lead to pain here.',
      fix: 'Pull your belly button in and tuck your pelvis.',
      zoom: 'spine-top', redFlag: 'back', claim: CL.lowBack },
  ],
  libraryDiff: { add: ['quads'], why: 'StrengthLog lists the quads as secondary (card c10); driving through the toes works them more (c11).' },
  claim: C(['CONSENSUS'], ['pg-gb', 'sl-gb', 'pg-gbhub', 'hl-gb'], 'card c10, c9, c11'),
};

/* ---------------------------------------------------------------- risks (card risks; handlingMistakes are posture, Q-W2-12) */
const RISKS = [
  { key: 'overextend', text: 'Overextending your back can lead to lower back pain.', claim: CL.c7 },
  { key: 'high', text: 'Pushing the hips too high generally increases the arch in your low back.', claim: CL.c6 },
  { key: 'feet', text: 'Back tension may mean wrong foot position or an overarched back.', claim: CL.c8 },
];

export default {
  schema: 1,
  id: 'lib_glute_bridge',
  rev: 1,
  plate: plateSpec,
  handling: { archetype: 'none', why: 'D-SHIP-GRIP (b2): the card archetype.hand is none; its grip claims are on setup step 2 (c1) and the posture line barbell (c14).' },
  contacts: ['floor-body'],
  setup: [
    { kind: 'position', text: 'Lie on your back, feet flat, hip-width, knees in line with toes.', claim: CL.lie },
    // D-PFC-ROUND1 L2: the bodyweight arms only (c1); the barbell grip (c14) is the posture line 'barbell' and the variant line
    { kind: 'position', text: 'Arms straight by your sides.', claim: CL.c1 },
    { kind: 'brace', text: 'Pull your belly button in. Tuck your pelvis, low back flat.', claim: CL.c2 },
    { kind: 'position', text: 'Exhale and drive with your hips, not your feet. Inhale to lower.', zoom: 'spine-top', claim: CL.drive },
    { kind: 'finish', text: 'Squeeze your glutes, hold the top for a second, lower slowly.', claim: CL.hold },
  ],
  posture: [
    // D-SHIP-TEXTZOOM: the card zoom heels-down as a text checkpoint (its Wrong is null, LR-25)
    { key: 'heels', label: 'Heels down', detail: 'Feet flat, heels pressing into the floor.',
      anchor: { landmark: 'heel.r', pose: 'end' }, claim: CL.heels },
    { key: 'drive', label: 'Hip drive', detail: 'Drive with your hips, not your feet.',
      anchor: { landmark: 'hip.r', pose: 'end' }, claim: CL.c9 },
    // Q-W2-12: handlingMistake 'Pushing the hips too high' (c6, c4) merged here, its fix added
    { key: 'line', label: 'Straight line', detail: 'Stop when shoulders, hips and knees line up.',
      anchor: { landmark: 'knee.r', pose: 'end' }, zoom: 'spine-top', claim: CL.line },
    // Q-W2-12: handlingMistake 'Overarching the lower back' (c7, c6, c2) merged here, its fix added
    { key: 'back', label: 'Low back neutral', detail: "Don't overarch your low back. Pull your belly button in and tuck your pelvis.",
      anchor: { landmark: 'sacrum', pose: 'end' }, zoom: 'spine-top', claim: CL.back },
    // Q-W2-12: handlingMistake 'Feet in the wrong place' (c8, c4) merged here, its fix added
    { key: 'feet', label: 'Feet placed', detail: 'Set your feet so shin and thigh are roughly 90 degrees at the top.',
      anchor: { landmark: 'ankle.r', pose: 'end' }, claim: CL.feet },
    { key: 'knees', label: 'Knees over toes', detail: 'Toes facing away, knees in line with your toes.',
      anchor: { landmark: 'knee.r', pose: 'end' }, claim: CL.knees },
    // D-PFC-ROUND1 L2: the barbell version's grip (card grip.type, grip.width, c14), moved off setup step 2
    { key: 'barbell', label: 'Barbell grip', detail: 'Barbell: grip it overhand, just outside hip width, hands stopping it rolling.',
      anchor: { landmark: 'hip.r', pose: 'end' }, claim: CL.c14 },
  ],
  feel,
  zooms,
  chips: ['spine-top', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'Lie on your back, knees bent, feet flat. Tuck your pelvis, low back flat.',   // card c1, c2
    mistakeLine: "Don't push your hips too high. Stop when shoulders, hips and knees line up.",   // card c6, c4
    cueLine: 'Heels down, hips up.',   // card c3
    // D-LIB5-VARIANT: the card's plate.variantLine (c14): the barbell adds the bar over the hips.
    variantLine: 'Barbell: bar centred over your hips, hands stop it rolling.',
  },
  redFlag: RED_FLAG,
  mistakes: [],   // Q-W2-12 (#379 6628699724): the card's handlingMistakes are posture checkpoints above
  risks: RISKS,
  riskFlags: ['back'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/glute_bridge.json', rev: 1 },
};
