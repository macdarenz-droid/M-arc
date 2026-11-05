// LIB-SHIP W6: the How-to content of lib_pike_push_up (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/pike_push_up.json; its claim ids are named on each field's claim.
// No hand zoom (D-SHIP-C3, card-no-zoom; D-SHIP-PAIR-NOZOOM: no pair): the card has no hand zoom, so the sheet has
// none; the id is on tools/plates/library/hands/no-zoom.json. The card's hand claims (hands about shoulder-width,
// fingers spread for a stable base; c1, c10) live in handling (gripLine) and setup steps 1 and 5; its sore-wrist line
// (c12) is the wrist feel row.
// Hand values (D-SHIP-GRIP case (a), lib_push_up form): the card gives no thumb line ("no bar or handle") and its wrist
// line is a handle tip, not a range. The values come from the approved `palm-flat` pair key
// (tools/plates/library/hands/hand-palm-flat.mjs:27-28 IDS.pike_push_up: variant 'floor', orientation 'over'), copied
// with each value's key line (the key module is not importable: its view code reads files at run time, C0). The key
// records no ThumbMode: its drawing lays the thumb on the floor beside the index (hands/view-palm-flat.mjs:52), golden
// B's 'beside', cited CONVENTION (source hand-key-palm-flat), never DATA. The key's wrist range is null
// (hand-palm-flat.mjs:14), so the wrist is `exempt`, as lib_push_up. The key's two faults (cupped-palm, hand-ahead)
// claim no line of this card, so handling.faults is empty.
// Zooms: head-path (the plate's own drawn Mistake pose: only the head goes down, c6; the card's topFault, the flared
// elbows c7, cannot be seen from the side, F7) and pike (DV, the hips sagging at the top; c9).
// Way out (tier A): the card's gap (how to end a failed rep) stays a gap; no way-out line is shown (ruling extra 3: the
// safety checker adds its item later).
// Red flags: the card's redFlags (shoulder, wrist), each linked by its feel row.
// Not cited: c13 (progression, D-TEXT-PROGRESSION), c14 (tempo), c15.
// No variant line (equipment 'Bodyweight').
import plateSpec from '../specs/pike_push_up.mjs';
import { landmarksOf } from '../engine.mjs';
import { RED_FLAG, RED_FLAG_SHOULDER } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_SHOULDER };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'fv-pike': { cite: 'Pike Push-Ups: Target Your Deltoids and Build Upper Body Strength (Fitness Volt)', url: 'https://fitnessvolt.com/pike-push-up/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'ggr-pike': { cite: 'How To Do Pike Push-Ups: Tips From An Expert (Garage Gym Reviews)', url: 'https://www.garagegymreviews.com/how-to-do-pike-push-ups',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'nasm-pike': { cite: 'Pike Push-Up (NASM exercise library)', url: 'https://www.nasm.org/resource-center/exercise-library/pike-push-up',
    kind: 'guideline', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  // The palm-flat key's own source for the thumb and the wrist (the card has no thumb line and no wrist range): a drawing convention.
  'hand-key-palm-flat': { cite: 'LIB-12 hand pair key palm-flat (floor): the thumb lies on the floor beside the index; no wrist range', url: 'tools/plates/library/hands/hand-palm-flat.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-05', use: 'CONVENTION' },
  // The joint blocks' own sources (layers/howto/shared.mjs): the card's redFlags 'shoulder', 'wrist'.
  'nhs-shoulder-pain': { cite: 'NHS, Shoulder pain', url: 'https://www.nhs.uk/conditions/shoulder-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When shoulder pain needs a check.' },
  'nhs-wrist-pain': { cite: 'NHS, Wrist pain', url: 'https://www.nhs.uk/conditions/hand-pain/wrist-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When wrist pain needs a check.' },
};

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const FV = 'fv-pike', GG = 'ggr-pike', NA = 'nasm-pike';
const CL = {
  c1: C(['CONSENSUS'], [FV, GG, NA], 'c1'),
  c2: C(['CONSENSUS'], [FV, GG], 'c2'),
  c3: C(['CONSENSUS'], [FV, NA], 'c3'),
  c5: C(['CONSENSUS'], [FV, GG, NA], 'c5'),
  c6: C(['CONSENSUS'], [GG], 'c6'),
  c7: C(['CONSENSUS'], [GG, NA], 'c7'),
  c8: C(['CONSENSUS'], [GG], 'c8'),
  c10: C(['CONSENSUS'], [FV], 'c10'),
  hips: C(['CONSENSUS'], [FV, GG, NA], 'c2, c3'),
  elbows: C(['CONSENSUS'], [FV, NA, GG], 'c3, c7'),
  flare: C(['CONSENSUS'], [GG, NA, FV], 'c7, c3'),
  head: C(['CONSENSUS'], [GG, FV, NA], 'c6, c5'),
  pikeZoom: C(['CONSENSUS'], [FV, GG, NA], 'c2, c9'),
  base: C(['CONSENSUS'], [FV], 'c10'),
  grip: C(['CONSENSUS'], [FV, GG, NA], 'c1, c10'),
  wristRow: C(['CONSENSUS', 'WEAK'], [FV, GG], 'c2, c12'),
};

/* ------------------------------------------------------------------------------------------------ hand ---------- */
// The key's record for this id and its variant, copied (hand-palm-flat.mjs:27-28 IDS.pike_push_up, :13-14
// VARIANTS.floor; not importable, see the header).
const V = { archetype: 'palm-flat', loadAxis: 'along-forearm' };   // VARIANTS.floor.archetype, .loadAxis (hand-palm-flat.mjs:14)
const THUMB = 'beside';   // CONVENTION (D-SHIP-GRIP (a)): the key's drawn thumb (view-palm-flat.mjs:52), source hand-key-palm-flat
const KEY_WRIST_RANGE = null;   // VARIANTS.floor.wristRange (hand-palm-flat.mjs:14): no range, so the wrist is exempt

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses (spec start = card plate.start, the top; spec end = card plate.end, the bottom):
//   head (card zoom head-path Wrong, c6 "only the head moves toward the floor"): the spec's Mistake pose, the plate's
//        drawn fault (the head straight down under the hands' line). No new drawing value.
//   sag  (card zoom pike Wrong, c9 "hips sagging"): the top with SAG deg less hip flexion; the legs straight, the toe
//        tip and the hands kept on their floor spots, the arms straight (root, pelvis tilt, shoulder flexion and the
//        wrist solved, the palm level).
// DRAWING VALUES (D-SHIP-DRAWVAL, #376 6614695581; precedent D-LIB7-2 and golden B's machine_chest_press seatDrop): SAG 40 deg
// has no source value. With the hands and toes held and the arms straight, push_up's 20 deg sag (specs/push_up.mjs:49)
// drops the hips only about 3 cm here, so SAG is sized for the sag to read at panel size (lib_plank's SAG precedent): at
// 40 deg the hip joint drops about 9 cm. No card gives it, no number from it appears in user copy; the layers panel
// judges it.
const H = 1.75, SAG = 40;
const TOP = plateSpec.poses.start, LT = landmarksOf(TOP, H), WT = LT['wrist.r'], GT = LT['grip.r'], TOE = LT['toe.r'];
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
  if (Math.hypot(...f(p)) >= 1e-6) throw new Error('lib_pike_push_up: the sag still did not converge');
  return p;
}
const sagPose = q => ({ ...TOP, root: { at: [0, q.y, q.z], tilt: q.tilt }, hip: TOP.hip - SAG, shoulder: { flex: q.f }, wrist: q.w });
const SQ = solve({ y: TOP.root.at[1] - 0.1, z: TOP.root.at[2], tilt: TOP.root.tilt - 10, f: TOP.shoulder.flex, w: TOP.wrist }, sagPose,
  lm => [lm['wrist.r'][1] - WT[1], lm['grip.r'][1] - GT[1], lm['grip.r'][2] - GT[2], lm['toe.r'][1] - TOE[1], lm['toe.r'][2] - TOE[2]]);
const SAG_POSE = sagPose(SQ);
export const stills = {
  start: { pose: TOP },
  end: { pose: plateSpec.poses.end },
  head: { pose: plateSpec.mistake.pose },
  sag: { pose: SAG_POSE },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom, same keys and kinds. Zoom shell shape (callout with an anchor at the landmark it names, no guide
// mark; pilot-a.closeups.mjs); each Wrong is its still drawn alone (solid).
const zooms = [
  {
    key: 'head-path', chip: 'Head path', heading: 'Head path', kind: 'posture',
    crop: { center: { at: 'head', pose: 'right', off: [0, 0] }, sizePx: 160 },
    right: 'end',
    wrong: { base: 'end', pose: plateSpec.mistake.pose, solid: true },
    callout: {
      right: { text: 'Forward and down', anchor: 'head' },
      wrong: { text: 'Head straight down', anchor: 'head' },   // c6
    },
    caption: {
      right: 'Head moves forward and down, neck neutral.',
      wrong: 'Only the head moves toward the floor.',
    },
    alt: {
      right: 'Side view, bottom of the pike push-up. The head is forward of the hands and just over the floor, neck neutral.',
      wrong: 'Side view, bottom of the pike push-up. Only the head drops toward the floor, straight down under the hands.',
    },
  },
  {
    key: 'pike', chip: 'Hips', heading: 'Hips high', kind: 'posture',
    crop: { center: { at: 'hip.r', pose: 'right', off: [0, 0] }, sizePx: 180 },
    right: 'start',
    wrong: { base: 'start', pose: SAG_POSE, solid: true },
    callout: {
      right: { text: 'Hips high', anchor: 'hip.r' },
      wrong: { text: 'Hips sag', anchor: 'hip.r' },   // c9
    },
    caption: {
      right: 'Legs straight, hips high in an upside-down V.',
      wrong: 'Hips sagging toward the floor.',
    },
    alt: {
      right: 'Side view, top of the pike push-up. Arms and legs straight, hips high in an upside-down V.',
      wrong: 'Side view, top of the pike push-up. The hips sag toward the floor, so the V flattens.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const HANDS = ['hand-left', 'hand-right'];
const feel = {
  primary: [{ muscleId: 'front_delts', plain: 'The front of the shoulders does the pressing.' }],
  secondary: [
    { muscleId: 'triceps', plain: 'The back of the upper arm works hard too.' },
    { muscleId: 'upper_traps', plain: 'The tops of the shoulders help.' },
  ],
  watch: [],
  feelLine: 'You should feel this in your shoulders and the back of your arms.',
  rows: [
    // The card's first row (shoulders and back of the arms: the pressing muscles) has no fix, so it is left out: the
    // feel line says it (D-SHIP-Q16).
    { key: 'shoulder', where: 'Shoulder', at: { muscles: ['front_delts'] },
      means: 'Flared elbows can hurt the shoulder over time.',
      fix: 'Tuck your elbows in, or go back to standard push-ups.',
      redFlag: 'shoulder', claim: CL.c7 },
    { key: 'head', where: 'Head', at: { parts: ['head'] },
      means: 'Upside down, holding your breath can make you dizzy.',
      fix: 'Breathe in going down, out going up.', claim: CL.c8 },
    { key: 'wrist', where: 'Wrists', at: { parts: HANDS },
      means: 'Your hands carry more of your weight here.',
      fix: 'Use push-up handles or a soft mat.',
      redFlag: true, claim: CL.wristRow },
  ],
  claim: C(['CONSENSUS'], [NA, FV], 'c11'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  // D-TEXT-GOLDEN: posture 'elbows' (c3: about 45 degrees from the body) is shown in this fix; c7's scale-back is in
  // the shoulder feel row.
  { key: 'flare', title: 'Elbows flaring out', claim: CL.flare,
    fix: 'Tuck your elbows in, about 45 degrees from your body.' },
  // D-TEXT-GOLDEN: posture 'neck' (c5: neck neutral, chin slightly tucked) is shown in this fix.
  { key: 'head', title: 'Moving only your head down', zoom: 'head-path', claim: CL.head,
    fix: 'Chin slightly tucked. Move your head forward and down.' },
  { key: 'breath', title: 'Holding your breath', claim: CL.c8,
    fix: 'Breathe in going down, out going up.' },
];
const RISKS = [
  { key: 'flare', text: 'Elbows flaring out can lead to shoulder injury over time.', claim: CL.c7 },
  { key: 'breath', text: 'Upside down, holding your breath can make you dizzy or light-headed.', claim: CL.c8 },
  { key: 'head', text: 'Moving only your head toward the floor raises injury risk.', claim: CL.c6 },
];

export default {
  schema: 1,
  id: 'lib_pike_push_up',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: V.archetype,          // 'palm-flat'
    why: 'D-SHIP-C3: card-no-zoom, the card has no hand zoom; the grip copy carries c1 and c10.',
    orientation: 'pronated',         // the key's orientation 'over' (hand-palm-flat.mjs:28): palms down on the floor (c1)
    handle: 'floor',                 // the key's variant 'floor' (hand-palm-flat.mjs:28)
    loadAxis: V.loadAxis,            // 'along-forearm'
    overBody: false,
    width: { text: 'Hands about shoulder-width apart, or slightly wider.', claim: CL.c1 },
    thumb: { mode: THUMB, claim: C(['CONVENTION'], ['hand-key-palm-flat'], 'The card has no thumb line (no bar or handle): the palm-flat key\'s drawn thumb, beside the index on the floor (view-palm-flat.mjs:52).') },
    contact: 'palm-flat',            // the key's contact 'whole-hand' (hand-palm-flat.mjs:14); card c10: fingers spread, palm on the floor
    // KEY_WRIST_RANGE is null: no range given, so the wrist is exempt (lib_push_up form). Never shown.
    wrist: { exempt: `Palm flat on the floor: the palm-flat key records no wrist range (${KEY_WRIST_RANGE}).`, claim: C(['CONVENTION'], ['hand-key-palm-flat'], 'hand-palm-flat.mjs:14 VARIANTS.floor.wristRange null; the card\'s wrist line (c12) is a handle tip, shown in the wrist feel row') },
    faults: [],                      // the key's faults claim no line of this card (see the header)
    gripLine: 'Hands about shoulder-width. Spread your fingers for a stable base.',
    cue: 'Hips high, head forward and down.',   // c3, c5
  },
  contacts: ['floor-body'],   // the card's archetype.contact
  setup: [
    { kind: 'position', text: 'Start in a push-up position, hands about shoulder-width.', claim: CL.c1 },
    { kind: 'brace', text: 'Brace and pull your shoulders down and back.', claim: CL.c1 },
    { kind: 'position', text: 'Keep your legs straight and lift your hips into a V.', zoom: 'pike', claim: CL.c2 },
    { kind: 'position', text: 'Walk your hands toward your feet to get more upside down.', claim: CL.c2 },
    // D-TEXT-GOLDEN: posture 'abs' (c10) is shown in this step.
    { kind: 'grip', text: 'Spread your fingers for a stable base. Squeeze your abs.', claim: CL.base },
  ],
  posture: [
    { key: 'hips', label: 'Hips high', detail: 'Keep your hips up the whole time.', anchor: { landmark: 'hip.r', pose: 'start' }, zoom: 'pike', claim: CL.hips },
    { key: 'elbows', label: 'Elbows tucked', detail: 'Elbows tucked in, about 45 degrees from your body.', anchor: { landmark: 'elbow.r', pose: 'end' }, claim: CL.elbows },
    { key: 'neck', label: 'Neck neutral', detail: 'Neck neutral, chin slightly tucked.', anchor: { landmark: 'head', pose: 'start' }, claim: CL.c5 },
    { key: 'head', label: 'Head forward', detail: 'Move your head forward and down as you bend.',
      anchor: { landmark: 'head', pose: 'end' }, zoom: 'head-path', claim: CL.head },
    { key: 'floor', label: 'Head near floor', detail: 'Lower until the head is about an inch from the floor.', anchor: { landmark: 'head', pose: 'end' }, claim: CL.c3 },
    { key: 'breathe', label: 'Breathe', detail: 'Breathe in going down, out going up.', anchor: { landmark: 'chest', pose: 'end' }, claim: CL.c8 },
    { key: 'abs', label: 'Abs tight', detail: 'Squeeze your abs to hold the pike.', anchor: { landmark: 'navel', pose: 'start' }, claim: CL.c10 },
  ],
  feel,
  zooms,
  chips: ['head-path', 'pike', 'feel'],   // the zoom shell's chip row: the zoom keys, then feel
  copy: {
    setupLine: 'Hands about shoulder-width, legs straight, hips lifted into an upside-down V.',
    mistakeLine: 'Never let your elbows flare out. Tuck them in, about 45 degrees from your body.',
    cueLine: 'Hips high, head forward and down.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['shoulder', 'wrist'],   // the card's redFlags, in card order
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/pike_push_up.json', rev: 1 },
};
