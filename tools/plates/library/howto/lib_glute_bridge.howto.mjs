// LIB-SHIP W7: the How-to content of lib_glute_bridge (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/glute_bridge.json; its claim ids are named on each field's claim.
// Handling (D-SHIP-GRIP (b2)): the card archetype.hand is none (arms straight by the sides, c1; the barbell version holds
// the bar overhand, c14). Both grip claims (c1, c14) are cited on setup step 2. No hand zoom (the card has none).
// Variant line (D-LIB5-VARIANT): equipment 'Bodyweight / Barbell'; the card's plate.variantLine says c1, c2, posture,
// mistakes and feel hold for both, and the barbell adds the bar over the hips with the hands stopping it rolling (c14).
// Red flags: the card's redFlags (back): LIB-5's back box (shared/back-box.mjs), linked by the low-back row.
//
// D-TEXT-GOLDEN (claim -> slot):
//   posture c3 breathe out up, in down          -> setup step 4
//   posture c3/c11 press the heels               -> posture 'heels' (the T checkpoint heels-down, below)
//   posture c9 drive with the hips               -> posture 'drive'
//   posture c4 straight line at the top          -> posture 'line', zoom spine-top Right
//   posture c5 squeeze, hold the top a second    -> setup step 5
//   posture c12 knees in line with the toes      -> posture 'knees' (with c1's toes facing away)
//   zoom heels-down (Wrong null, LR-25)          -> T: posture 'heels' (D-SHIP-TEXTZOOM)
//   handlingMistake overarching (c7, c6, c2)     -> posture 'back' (Q-W2-12), its fix the detail; zoom spine-top Wrong
//   handlingMistake feet in the wrong place      -> posture 'feet' (Q-W2-12), its fix the detail
//   handlingMistake hips pushed too high         -> posture 'line' (Q-W2-12), its fix the detail
import plateSpec from '../specs/glute_bridge.mjs';
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
  c1: C(['CONSENSUS'], ['pg-gb', 'ace-gb'], 'card c1'),
  c2: C(['CONSENSUS'], ['pg-gb', 'ace-gb', 'sl-gb'], 'card c2'),
  c3: C(['CONSENSUS'], ['ace-gb'], 'card c3'),
  c6: C(['CONSENSUS'], ['ace-gb', 'pg-gb'], 'card c6'),
  c7: C(['CONSENSUS'], ['pg-gbhub', 'pg-gb'], 'card c7'),
  c9: C(['CONSENSUS'], ['pg-gbhub'], 'card c9'),
  c10: C(['CONSENSUS'], ['pg-gb', 'sl-gb', 'pg-gbhub'], 'card c10'),
  c11: C(['CONSENSUS'], ['hl-gb'], 'card c11'),
  knees: C(['CONSENSUS'], ['hl-gb', 'ace-gb'], 'card c12, c1'),
  arms: C(['CONSENSUS'], ['pg-gb', 'ace-gb', 'pg-bgb'], 'card c1, c14'),
  hold: C(['CONSENSUS'], ['pg-gb', 'sl-gb'], 'card c5, c3'),
  heels: C(['CONSENSUS'], ['ace-gb', 'pg-gb', 'hl-gb'], 'card c1, c3, c11'),
  back: C(['CONSENSUS'], ['pg-gbhub', 'pg-gb', 'ace-gb', 'sl-gb'], 'card c7, c6, c2'),
  feet: C(['CONSENSUS'], ['pg-gbhub', 'pg-gb', 'hl-gb'], 'card c8, c4'),
  line: C(['CONSENSUS'], ['ace-gb', 'pg-gb', 'hl-gb'], 'card c4, c6'),
  zoom: C(['CONSENSUS'], ['pg-gb', 'ace-gb', 'sl-gb', 'hl-gb'], 'card c2, c4, c6, c12'),
  lowBack: C(['CONSENSUS'], ['pg-gbhub', 'pg-gb', 'ace-gb', 'sl-gb'], 'card c7, c2'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: the top (end) and the spec's Mistake (the top with the low back arched, the hips
// pushed higher; card plate.mistake, c6, c7). The card zoom spine-top Wrong is that drawn fault, so no drawing value is
// added here.
const MIS = plateSpec.mistake.pose, END = plateSpec.poses.end;
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  arch: { pose: MIS },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// spine-top (M): the zoom shell (render/closeup/crop.mjs); the Wrong is the plate's own Mistake dashed red over the
// right pose, with the plate's Mistake guide (the dashed arched low back). The crop window (centre offset, sizePx) is a
// drawing value. heels-down is a text checkpoint (its Wrong is null, LR-25; D-SHIP-TEXTZOOM): posture 'heels'.
const zooms = [
  {
    key: 'spine-top', chip: 'Low back', heading: 'Spine at top', kind: 'posture',
    crop: { center: { at: 'hip.r', pose: 'right', off: [0, 12] }, sizePx: 220 },
    right: 'end',
    wrong: { base: 'end', pose: MIS },
    guides: plateSpec.mistake.guides,
    callout: {
      right: { text: 'Straight line', anchor: 'hip.r' },
      wrong: { text: 'Back arched', anchor: { at: 'sacrum', pose: 'mistake' } },
    },
    caption: {
      right: 'Core tight, pelvis tucked, straight line at the top.',
      wrong: 'Hips pushed too high, low back arched.',
    },
    alt: {
      right: 'Side view, top of the bridge. Shoulders, hips and knees form a straight line, the low back not arched.',
      wrong: 'Side view, top of the bridge. The hips push too high and the low back arches. Drawn dashed over the right position.',
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
  { key: 'high', text: 'Pushing the hips too high increases the arch in your low back.', claim: CL.c6 },
];

export default {
  schema: 1,
  id: 'lib_glute_bridge',
  rev: 1,
  plate: plateSpec,
  handling: { archetype: 'none', why: 'D-SHIP-GRIP (b2): the card archetype.hand is none; its grip claims (c1, c14) are on setup step 2.' },
  contacts: ['floor-body'],
  setup: [
    { kind: 'position', text: 'Lie on your back, knees bent, feet flat and hip-width apart.', claim: CL.c1 },
    { kind: 'position', text: 'Arms straight by your sides, or grip a barbell overhand.', claim: CL.arms },
    { kind: 'brace', text: 'Pull your belly button in. Tuck your pelvis, low back flat.', claim: CL.c2 },
    { kind: 'position', text: 'Breathe out and press your hips up. Breathe in as you lower.', zoom: 'spine-top', claim: CL.c3 },
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
  ],
  feel,
  zooms,
  chips: ['spine-top', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'Lie on your back, knees bent, feet flat. Tuck your pelvis, low back flat.',
    mistakeLine: "Don't push your hips too high. Stop when shoulders, hips and knees line up.",
    cueLine: 'Heels down, hips up.',
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
