// LIB-SHIP W6: the How-to content of lib_incline_push_up (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/incline_push_up.json; its claim ids are named on each field's claim.
// Family: a child of push_up with inherit [] (the card's own lines throughout), so no family map.
// No hand zoom (D-SHIP-C3, card-no-zoom; D-SHIP-PAIR-NOZOOM: no pair): the card has no hand zoom, so the sheet has
// none; the id is on tools/plates/library/hands/no-zoom.json. The card's hand claim (both hands on top of the bench,
// shoulder-width or slightly wider; c1) lives in handling (gripLine) and setup step 2.
// Hand values (D-SHIP-GRIP case (a), lib_push_up form): the card leaves grip.thumb and grip.wrist empty. The values come
// from the approved `palm-flat` pair key (tools/plates/library/hands/hand-palm-flat.mjs:27-28 IDS.incline_push_up:
// variant 'floor', orientation 'over'), copied with each value's key line: the key module cannot be imported here (its
// view code reads files at run time; the library closure, C0, refuses it). The key records no ThumbMode: its drawing
// lays the thumb on the floor beside the index (hands/view-palm-flat.mjs:52), golden B's 'beside', cited CONVENTION
// (source hand-key-palm-flat), never DATA. The key's wrist range is null (hand-palm-flat.mjs:14 VARIANTS.floor
// .wristRange), so the wrist is `exempt`, as lib_push_up. The key's two faults (cupped-palm, hand-ahead) claim no line
// of this card, so handling.faults is empty (no fault text from another card is shown).
// Zooms: shoulders (M, the plate's own Mistake: feet too close, shoulders shrugged; c10) and hip-line (DV, the low back
// dropped; c12).
// No variant line (equipment 'Bodyweight').
import plateSpec from '../specs/incline_push_up.mjs';
import { landmarksOf } from '../engine.mjs';
import { RED_FLAG, RED_FLAG_SHOULDER } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_SHOULDER };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'bb-incline': { cite: 'How To Do the Incline Push-Up for No-Equipment Chest Building (BarBend)', url: 'https://barbend.com/incline-push-up/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'nasm-incline': { cite: 'Incline Push-Up (NASM exercise library)', url: 'https://www.nasm.org/resource-center/exercise-library/incline-push-up',
    kind: 'guideline', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'sl-incline': { cite: 'How to Do Incline Push-Up: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/incline-push-up/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  // The palm-flat key's own source for the thumb and the wrist (the card has no grip.thumb or grip.wrist): a drawing convention.
  'hand-key-palm-flat': { cite: 'LIB-12 hand pair key palm-flat (floor): the thumb lies on the floor beside the index; no wrist range', url: 'tools/plates/library/hands/hand-palm-flat.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-05', use: 'CONVENTION' },
  // RED_FLAG_SHOULDER's own source (layers/howto/shared.mjs), as golden B's lateral raise lists it: the card's redFlags 'shoulder'.
  'nhs-shoulder-pain': { cite: 'NHS, Shoulder pain', url: 'https://www.nhs.uk/conditions/shoulder-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When shoulder pain needs a check.' },
};

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const BB = 'bb-incline', NA = 'nasm-incline', SL = 'sl-incline';
const CL = {
  c1: C(['CONSENSUS'], [BB, NA, SL], 'c1'),
  c2: C(['CONSENSUS'], [NA, SL], 'c2'),
  c3: C(['CONSENSUS'], [BB, NA, SL], 'c3'),
  c4: C(['CONSENSUS'], [NA, BB], 'c4'),
  c5: C(['CONSENSUS'], [BB], 'c5'),
  c6: C(['CONSENSUS'], [BB], 'c6'),
  c8: C(['CONSENSUS'], [SL, BB], 'c8'),
  c10: C(['CONSENSUS'], [BB], 'c10'),
  c11: C(['CONSENSUS'], [NA], 'c11'),
  c12: C(['CONSENSUS'], [BB, NA], 'c12'),
  bench: C(['CONSENSUS'], [BB, NA, SL], 'c1, c14'),
  line: C(['CONSENSUS'], [NA, SL, BB], 'c2, c6'),
  lineHips: C(['CONSENSUS'], [BB, NA, SL], 'c2, c3'),
  blades: C(['CONSENSUS'], [NA, SL, BB], 'c2, c10'),
  hips: C(['CONSENSUS'], [BB, NA, SL], 'c3, c6'),
  elbows: C(['CONSENSUS'], [NA, BB], 'c11, c4'),
  shoulderRow: C(['CONSENSUS'], [BB, NA], 'c10, c11, c4'),
  hipZoom: C(['CONSENSUS'], [NA, SL, BB], 'c2, c12'),
};

/* ------------------------------------------------------------------------------------------------ hand ---------- */
// The key's record for this id and its variant, copied (hand-palm-flat.mjs:27-28 IDS.incline_push_up, :13-14
// VARIANTS.floor; not importable, see the header).
const V = { archetype: 'palm-flat', loadAxis: 'along-forearm' };   // VARIANTS.floor.archetype, .loadAxis (hand-palm-flat.mjs:14)
const THUMB = 'beside';   // CONVENTION (D-SHIP-GRIP (a)): the key's drawn thumb (view-palm-flat.mjs:52), source hand-key-palm-flat
const KEY_WRIST_RANGE = null;   // VARIANTS.floor.wristRange (hand-palm-flat.mjs:14): no range, so the wrist is exempt

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses (spec end = card plate.start, the top; the pose map is the spec's):
//   shrug (card zoom shoulders Wrong, c10): the spec's Mistake pose, the plate's drawn fault (feet walked in, the
//         shoulder blades raised), with a larger shrug (SHRUG, below).
//   drop  (card zoom hip-line Wrong, c12 "low back dropped, chest still up"): the top with push_up's sag (push_up.mjs:49
//         SAG_HIP, copied by diamond_push_up's spec): the hip extends SAG_HIP and the low back extends with it, root,
//         pelvis tilt and lumbar angle solved so the shoulder and the toe tip stay on their spots; the straight arm's
//         shoulder flexion and the wrist re-solved so the wrist stays on its bench spot and the palm lies level.
// DRAWING VALUES (D-SHIP-DRAWVAL, #376 6614695581; precedent D-LIB7-2 and golden B's machine_chest_press seatDrop):
// SAG_HIP -20 deg is push_up's own sag size (specs/push_up.mjs:49); no card gives it, no number from it appears in user
// copy; the layers panel judges it.
const H = 1.75, SAG_HIP = -20;
const END = plateSpec.poses.end, LT = landmarksOf(END, H), SH = LT['shoulder.r'], TOE = LT['toe.r'], WT = LT['wrist.r'];
function solve(p0, make, res, iters = 40) {   // Newton with finite differences (the spec's own solver, copied); throws
  const keys = Object.keys(p0); const p = { ...p0 };
  const f = q => res(landmarksOf(make(q), H));
  for (let it = 0; it < iters; it++) {
    const r = f(p); if (Math.hypot(...r) < 1e-6) return p;
    const J = keys.map(k => { const d = 1e-5, q = { ...p, [k]: p[k] + d }; return f(q).map((v, i) => (v - r[i]) / d); });
    const n = keys.length, A = Array.from({ length: n }, (_, i) => [...keys.map((_, j) => J[j][i]), -r[i]]);
    for (let c = 0; c < n; c++) {
      let m = c; for (let i = c + 1; i < n; i++) if (Math.abs(A[i][c]) > Math.abs(A[m][c])) m = i;
      [A[c], A[m]] = [A[m], A[c]];
      for (let i = 0; i < n; i++) if (i !== c) { const k = A[i][c] / A[c][c]; for (let j = c; j <= n; j++) A[i][j] -= k * A[c][j]; }
    }
    keys.forEach((k, i) => { p[k] += A[i][n] / A[i][i]; });
  }
  if (Math.hypot(...f(p)) >= 1e-6) throw new Error('lib_incline_push_up: the drop still did not converge');
  return p;
}
const dropPose = q => ({ ...END, root: { at: [0, q.y, q.z], tilt: q.tilt }, trunk: q.trunk, hip: SAG_HIP,
  shoulder: { flex: q.f ?? END.shoulder.flex }, wrist: q.w ?? END.wrist });
const DQ = solve({ y: END.root.at[1] - 0.05, z: END.root.at[2], tilt: END.root.tilt, trunk: -20 }, dropPose,
  lm => [lm['shoulder.r'][1] - SH[1], lm['shoulder.r'][2] - SH[2], lm['toe.r'][1] - TOE[1], lm['toe.r'][2] - TOE[2]]);
const DA = solve({ f: END.shoulder.flex, w: END.wrist }, a => dropPose({ ...DQ, ...a }),
  lm => [lm['wrist.r'][2] - WT[2], lm['grip.r'][1] - lm['wrist.r'][1]]);
const DROP_POSE = dropPose({ ...DQ, ...DA });
// shrug (W6 panel L5): the spec's Mistake (feet walked in, c10) with the shoulder blades raised SHRUG cm instead of the
// spec's M_SHRUG 4, root, pelvis tilt and shoulder flexion re-solved so the wrist and the toe tip stay on the Mistake's
// spots, then the wrist so the palm lies level (the drop's method above).
// DRAWING VALUE (D-SHIP-DRAWVAL): SHRUG 8 cm is a Wrong-pose size no card gives (c10 names the shrug, no size); the W6
// panel found the spec's 4 cm did not read in the close-up. No number from it appears in user copy.
const SHRUG = 8, MIS = plateSpec.mistake.pose, LM = landmarksOf(MIS, H), WM = LM['wrist.r'], TM = LM['toe.r'];
const shrugPose = q => ({ ...MIS, root: { at: [0, q.y, q.z], tilt: q.tilt }, scap: { ...MIS.scap, elev: SHRUG },
  shoulder: { flex: q.f ?? MIS.shoulder.flex }, wrist: q.w ?? MIS.wrist });
const SQ = solve({ y: MIS.root.at[1], z: MIS.root.at[2], tilt: MIS.root.tilt, f: MIS.shoulder.flex }, shrugPose,
  lm => [lm['wrist.r'][1] - WM[1], lm['wrist.r'][2] - WM[2], lm['toe.r'][1] - TM[1], lm['toe.r'][2] - TM[2]]);
const SW = solve({ w: MIS.wrist }, a => shrugPose({ ...SQ, ...a }), lm => [lm['grip.r'][1] - lm['wrist.r'][1]]);
const SHRUG_POSE = shrugPose({ ...SQ, ...SW });
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  shrug: { pose: SHRUG_POSE },
  drop: { pose: DROP_POSE },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom, same keys and kinds. Zoom shell shape (callout with an anchor at the landmark it names, no guide
// mark; pilot-a.closeups.mjs); each Wrong is its still drawn alone (solid).
const zooms = [
  {
    key: 'shoulders', chip: 'Shoulders', heading: 'Shoulders down', kind: 'posture',
    // W6 panel L5: both windows sit at the same place by the ear (the right pose's in Right, the shrug's in Wrong), so
    // the head stays put and the Wrong shoulder is seen hiked toward the ear, with a red up arrow on the shoulder
    // (`off`, plate px: drawing values that place the window and the arrow).
    crop: { center: { at: 'ear', pose: 'right', off: [-6, 26] }, centerWrong: { at: 'ear', pose: 'mistake', off: [-6, 26] }, sizePx: 150 },
    right: 'end',
    wrong: { base: 'end', pose: SHRUG_POSE, solid: true },
    guides: [{ kind: 'drop', from: { at: 'shoulderTop.r', pose: 'mistake', off: [-20, 12] }, to: { at: 'shoulderTop.r', pose: 'mistake', off: [-20, -6] } }],
    callout: {
      right: { text: 'Shoulders down', anchor: 'shoulder.r' },
      wrong: { text: 'Shoulders shrug', anchor: 'shoulder.r' },   // c10
    },
    caption: {
      right: 'Feet back, shoulders down away from the ears.',
      wrong: 'Feet close to the bench, shoulders shrugged.',
    },
    alt: {
      right: 'Side view, top of the incline push-up. Feet walked back, shoulders down away from the ears, arms straight.',
      wrong: 'Side view, top of the incline push-up. The feet are close to the bench and the shoulders shrug up.',
    },
  },
  {
    key: 'hip-line', chip: 'Hip line', heading: 'Hip line', kind: 'posture',
    crop: { center: { at: 'hip.r', pose: 'right', off: [0, 0] }, sizePx: 170 },
    right: 'end',
    wrong: { base: 'end', pose: DROP_POSE, solid: true },
    callout: {
      right: { text: 'Straight line', anchor: 'hip.r' },
      wrong: { text: 'Low back drops', anchor: 'hip.r' },   // c12
    },
    caption: {
      right: 'Head, hips and heels in one line.',
      wrong: 'Low back dropped, chest still up.',
    },
    alt: {
      right: 'Side view, top of the incline push-up. Head, hips and heels on one straight line, hands on the bench.',
      wrong: 'Side view, top of the incline push-up. The low back drops toward the floor while the chest stays up.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'chest', plain: 'The chest does the pressing.' }],
  secondary: [
    { muscleId: 'triceps', plain: 'The back of the upper arm helps press.' },
    { muscleId: 'front_delts', plain: 'The front of the shoulders helps press.' },
  ],
  watch: [],
  // D-TEXT-GOLDEN (#379 6637607604): posture 'breathe' (c8) is shown in the feel line.
  feelLine: 'You should feel this in your chest, front shoulders and triceps. Breathe in going down, out going up.',
  rows: [
    // The card's first row (the pressing muscles) has no fix, so it is left out: the feel line says it (D-SHIP-Q16).
    { key: 'shoulder', where: 'Shoulder', at: { muscles: ['front_delts'] },
      means: 'Shrugged shoulders or wide elbows load the shoulder more.',
      fix: 'Walk your feet back and keep your elbows at 45 degrees.',
      redFlag: 'shoulder', claim: CL.shoulderRow },
    { key: 'low-back', where: 'Lower back', at: { muscles: ['lower_back'] },
      // D-FEEL-MEANS-CAUSAL: the card's means ties the stop to the back dropping, not to a feeling there, so no
      // means is shown (D-FEEL-NOMEANS); the fix carries c12.
      means: '',
      fix: 'End the set when your low back starts to drop.', claim: CL.c12 },
    // D-TEXT-GOLDEN: posture 'gaze' (c5) is shown in this fix.
    { key: 'neck', where: 'Neck', at: { parts: ['neck-left', 'neck-right'] },
      means: 'Looking up can strain your neck.',
      fix: 'Keep your gaze straight ahead.', claim: CL.c5 },
  ],
  claim: C(['CONSENSUS'], [NA, BB, SL], 'c17, c8'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'feet', title: 'Feet too close, shoulders shrugged', zoom: 'shoulders', claim: CL.c10,
    fix: 'Walk your feet back so your shoulders sit down.' },
  // D-TEXT-GOLDEN: posture 'elbows' (c4) is shown in this fix.
  { key: 'elbows', title: 'Elbows flaring too wide', claim: CL.elbows,
    fix: 'Keep your elbows about 45 degrees from your body.' },
  // D-TEXT-GOLDEN: posture 'hips' (c3, c6: shoulders in line with the hips) is shown in this fix.
  { key: 'low-back', title: 'Low back dropping', zoom: 'hip-line', claim: CL.c12,
    fix: 'Keep your hips in line with your shoulders.' },
];
const RISKS = [
  { key: 'feet', text: 'Feet too close shrugs the shoulders and may raise shoulder injury risk.', claim: CL.c10 },
  { key: 'elbows', text: 'Elbows flared wide add stress to the shoulder.', claim: CL.c11 },
];

export default {
  schema: 1,
  id: 'lib_incline_push_up',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: V.archetype,          // 'palm-flat'
    why: 'D-SHIP-C3: card-no-zoom, the card has no hand zoom; the grip copy carries c1.',
    orientation: 'pronated',         // the key's orientation 'over' (hand-palm-flat.mjs:28): palms down on the bench top (c1)
    handle: 'floor',                 // the key's variant 'floor' (hand-palm-flat.mjs:28): a flat surface under the palm
    loadAxis: V.loadAxis,            // 'along-forearm'
    overBody: false,
    width: { text: 'Hands on top, shoulder-width or a little wider.', claim: CL.c1 },
    thumb: { mode: THUMB, claim: C(['CONVENTION'], ['hand-key-palm-flat'], 'The card has no grip.thumb: the palm-flat key\'s drawn thumb, beside the index on the surface (view-palm-flat.mjs:52).') },
    contact: 'palm-flat',            // the key's contact 'whole-hand' (hand-palm-flat.mjs:14); card c1: both hands on top of the bench
    // KEY_WRIST_RANGE is null: no range given, so the wrist is exempt (lib_push_up form). Never shown.
    wrist: { exempt: `Palm flat on the bench: the palm-flat key records no wrist range (${KEY_WRIST_RANGE}).`, claim: C(['CONVENTION'], ['hand-key-palm-flat'], 'hand-palm-flat.mjs:14 VARIANTS.floor.wristRange null; the card has no grip.wrist') },
    faults: [],                      // the key's faults claim no line of this card (see the header)
    gripLine: 'Both hands on top of the bench, shoulder-width or a little wider.',   // c1
    cue: 'Shoulders down, away from your ears.',   // c10
  },
  contacts: ['floor-body'],   // the card's archetype.contact
  setup: [
    { kind: 'adjust', text: 'Use a sturdy bench or box that holds your weight.', claim: CL.bench },
    { kind: 'grip', text: 'Hands on top, shoulder-width or a little wider.', claim: CL.c1 },
    { kind: 'position', text: 'Walk your feet back until your body slopes at 45 degrees.', zoom: 'shoulders', claim: CL.c1 },
    // D-TEXT-GOLDEN: posture 'squeeze' (c6) is shown in this step.
    { kind: 'brace', text: 'Brace, squeeze glutes and thighs. Body in one line, head to heels.', zoom: 'hip-line', claim: CL.line },
    { kind: 'position', text: 'Shoulders back and down, away from your ears.', zoom: 'shoulders', claim: CL.blades },
  ],
  posture: [
    { key: 'line', label: 'Straight line', detail: 'Head, hips and heels stay in one line.',
      anchor: { landmark: 'hip.r', pose: 'end' }, zoom: 'hip-line', claim: CL.lineHips },
    { key: 'shoulders', label: 'Shoulders down', detail: 'Feet far enough back that the shoulders stay away from the ears.',
      anchor: { landmark: 'shoulder.r', pose: 'end' }, zoom: 'shoulders', claim: CL.c10 },
    { key: 'chest', label: 'Chest to bench', detail: 'Lower until the chest is just short of the bench.', anchor: { landmark: 'sternum', pose: 'start' }, claim: CL.c3 },
    { key: 'hips', label: 'Hips in line', detail: 'Shoulders stay in line with your hips.', anchor: { landmark: 'hip.r', pose: 'start' }, claim: CL.hips },
    { key: 'elbows', label: 'Elbows at 45', detail: 'Elbows about 45 degrees from your body.', anchor: { landmark: 'elbow.r', pose: 'start' }, claim: CL.c4 },
    { key: 'gaze', label: 'Look ahead', detail: 'Look straight ahead, not up.', anchor: { landmark: 'head', pose: 'end' }, claim: CL.c5 },
    { key: 'squeeze', label: 'Glutes tight', detail: 'Squeeze your glutes and thighs.', anchor: { landmark: 'buttock', pose: 'end' }, claim: CL.c6 },
    { key: 'breathe', label: 'Breathe', detail: 'Breathe in going down, out going up.', anchor: { landmark: 'chest', pose: 'start' }, claim: CL.c8 },
  ],
  feel,
  zooms,
  chips: ['shoulders', 'hip-line', 'feel'],   // the zoom shell's chip row: the zoom keys, then feel
  copy: {
    setupLine: 'Hands on a sturdy bench, feet walked back. Body in one line, shoulders down.',
    mistakeLine: 'Never keep your feet too close to the bench. Walk them back so your shoulders sit down.',
    cueLine: 'Shoulders down, body in one line.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['shoulder'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/incline_push_up.json', rev: 1 },
};
