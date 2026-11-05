// LIB-SHIP W6: the How-to content of lib_hip_adduction (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/hip_adduction.json; its claim ids are named on each field's claim.
// No hand zoom (D-SHIP-C3, card-no-zoom): the card has no hand zoom, so the sheet has none; the id is on
// tools/plates/library/hands/no-zoom.json. Its hand claim (hold the side handles; c1) lives in handling and setup step 1.
// GRIP (Q-W6-3, D-SHIP-W6-CONV, #393 6647923934): the card's grip.thumb, grip.handContact and grip.wrist each read "Not
// given by any source read (balance archetype default)". All three take golden B's balance default as data, DERIVED at
// import from leg_press's handling (below), cited CONVENTION (source balance-default), never printed (D-SHIP-CONVCOPY).
// The wrist's limitText is the card's own c1, not leg_press's wrist line.
// Zooms: add-start only. add-back (c4, "Back peeled off the pad to swing the legs together") is a text checkpoint
// (D-SHIP-TEXTZOOM, the machine_chest_press 'Start depth' precedent): the trunk leaving the pad moves front to back,
// which the front-view plate (card plate.view) does not show; posture checkpoint `back`, the plate's 'Back on pad' label
// and the first mistake's fix.
// Front-view plate (card plate.view): the posture crop is cut in the plate's own view (no `view` override).
// Red flags: none (the card's redFlags is empty). No variant line (equipment 'Machine').
import plateSpec from '../specs/hip_adduction.mjs';
import { RED_FLAG } from '../../layers/howto/shared.mjs';
export { RED_FLAG };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'mo-hip-add': { cite: 'Machine Hip Adduction: Exercise Guide (Motra, formerly Train Fitness)', url: 'https://motra.com/exercises/machineHipAdduction',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'sl-hip-add': { cite: 'How to Do Hip Adduction Machine: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/hip-adduction-machine/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'brandt-2013': { cite: 'Perceived loading and muscle activity during hip strengthening exercises: comparison of elastic resistance and machine exercises', url: 'https://pubmed.ncbi.nlm.nih.gov/24377067/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-22', use: 'DATA' },
  // golden B's `balance` archetype default for the three hand values the card delegates: a convention.
  'balance-default': { cite: 'Golden B balance archetype default (leg_press handling: thumb wrapped, contact finger-base, wrist range)', url: 'tools/plates/layers/exercises/leg_press.howto.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-05', use: 'CONVENTION' },
};
// Not cited: acsm-2009 (c10, load progression; the five setup steps carry the card's own steps and its return line).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const MO = 'mo-hip-add', SL = 'sl-hip-add';
const CL = {
  c1: C(['CONSENSUS'], [MO, SL], 'c1'),
  c2: C(['CONSENSUS'], [MO], 'c2'),
  c3: C(['CONSENSUS'], [MO], 'c3'),
  c4: C(['CONSENSUS'], [MO], 'c4'),
  c5: C(['CONSENSUS'], [MO], 'c5'),
};

/* ------------------------------------------------------------------------------------------------ hand ---------- */
// GRIP (Q-W6-3): the three hand values DERIVED at import from golden B's balance default, so they cannot drift from it.
// The source lines are copied here (leg_press.howto.mjs:329, :330, :331; the wrist line up to its range only, its
// limitText is not copied) and pinned against the live file by a test; a line that no longer parses throws.
const LP_THUMB = "thumb: { mode: 'wrapped', claim: CL.thumb },";        // leg_press.howto.mjs:329
const LP_CONTACT = "contact: 'finger-base',";                           // leg_press.howto.mjs:330
const LP_WRIST = 'wrist: { ext: [0, 20], dev: [-10, 10],';              // leg_press.howto.mjs:331 (range only)
const THUMB = LP_THUMB.match(/mode: '([a-z-]+)'/)?.[1];
const CONTACT = LP_CONTACT.match(/contact: '([a-z-]+)'/)?.[1];
const RANGE = LP_WRIST.match(/ext: \[(-?\d+), (-?\d+)\], dev: \[(-?\d+), (-?\d+)\]/)?.slice(1).map(Number);
if (!THUMB || !CONTACT || !RANGE) throw new Error('lib_hip_adduction: golden B leg_press balance default does not parse');
const CONV = C(['CONVENTION'], ['balance-default'], 'card grip.thumb, grip.handContact and grip.wrist: no source gives them (balance archetype default); golden B\'s balance default, not a card claim, never shown');

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: the start (legs apart to a light inner-thigh stretch; c2) and the spec's Mistake
// pose merged over it (card plate.mistake c2: the legs spread to MIS_ABD, a deep, forced stretch). The card zoom
// add-start Wrong ("Legs forced wide into a deep stretch") is that pose, so no new pose or drawing value is made.
const MIS = plateSpec.mistake.pose;
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: plateSpec.poses.end },
  wide: { pose: { ...plateSpec.poses.start, ...MIS } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom except add-back (a text checkpoint, above); the card has no hand zoom. Zoom shell form
// (render/closeup/crop.mjs): callouts anchored at the landmark they name, no guide mark; the Wrong is drawn alone
// (solid), as `stills.wide`.
const zooms = [
  {
    key: 'add-start', chip: 'Start width', heading: 'Start width', kind: 'posture',
    crop: { center: { at: 'hips', pose: 'right', off: [0, 10] }, sizePx: 260 },
    right: 'start',
    wrong: { base: 'start', pose: MIS, solid: true },
    callout: {
      right: { text: 'Light stretch', anchor: 'knee.r' },
      wrong: { text: 'Too wide', anchor: 'knee.r' },
    },
    caption: {
      right: 'Legs open to a light inner-thigh stretch.',
      wrong: 'Legs forced wide into a deep stretch.',
    },
    alt: {
      right: 'Front view, start of the rep. The legs are open only to a light stretch in the inner thighs.',
      wrong: 'Front view. The legs are spread wide into a deep, forced stretch.',
    },
    feelRow: 'groin',
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'adductors', plain: 'The inner-thigh muscles squeeze the legs together.' }],
  secondary: [],
  watch: [],
  feelLine: 'You should feel this in your inner thighs.',
  rows: [
    // The card's first row (inner thighs) has no fix, so it is left out: the feel line says it (D-SHIP-Q16).
    { key: 'groin', where: 'Sharp groin stretch at the start', at: { muscles: ['adductors'] },
      means: 'The start stretch is too deep.',
      fix: 'Set a narrower start.',
      zoom: 'add-start', claim: CL.c2 },
  ],
  claim: C(['DATA', 'CONSENSUS'], ['brandt-2013', MO], 'c8 (primary), c7'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  // D-TEXT-GOLDEN: add-back (c4) is a text checkpoint; this fix and the plate's 'Back on pad' label carry it
  { key: 'swing', title: 'Swinging the legs together', claim: CL.c4,
    fix: 'Squeeze and return slowly.' },
  { key: 'deep', title: 'Starting in a deep stretch', zoom: 'add-start', claim: CL.c2,
    fix: 'Set a narrower start: a light stretch only.' },
  { key: 'heavy', title: 'Weight too heavy for form', claim: CL.c5,
    fix: 'Choose a moderate weight.' },
];
const RISKS = [
  { key: 'stretch', text: 'Avoid an excessive stretch at the start.', claim: CL.c2 },
  { key: 'injury', text: "Acute hip or groin injury? Don't use this machine.", claim: CL.c5 },
];

export default {
  schema: 1,
  id: 'lib_hip_adduction',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'balance',
    why: 'D-SHIP-C3: card-no-zoom, the card has no hand zoom; the grip copy carries c1.',
    handle: 'machine-grip',    // card grip.type: the machine's side handles (c1); no shape given
    loadAxis: 'across',        // golden B's balance default (leg_press.howto.mjs:327)
    width: { text: 'Set by the machine.', claim: CL.c1 },
    thumb: { mode: THUMB, claim: CONV },   // CONVENTION (Q-W6-3): 'wrapped', derived above
    contact: CONTACT,          // CONVENTION (Q-W6-3): 'finger-base', derived above
    // CONVENTION (Q-W6-3): ext [0, 20], dev [-10, 10], derived above; the limitText is the card's own c1
    wrist: { ext: [RANGE[0], RANGE[1]], dev: [RANGE[2], RANGE[3]], limitText: 'Hold the side handles.', claim: CL.c1 },
    faults: [],                // the card names no hand fault
    gripLine: 'Hold the side handles. Keep your back flat against the pad.',
    cue: 'Light stretch, then squeeze.',   // c2, c3
  },
  contacts: ['seat-back', 'pivot-pad'],   // the card's archetype.contact
  setup: [
    // card setup steps 1 and 5 in one (both c1), so card posture 'Return slowly, keeping tension' (c3) fits the cap
    { kind: 'position', text: 'Back against the pad, feet on the footrests, hold the side handles.', claim: CL.c1 },
    { kind: 'adjust', text: 'Set the thigh pads on your inner thighs, just above the knees.', claim: CL.c1 },
    { kind: 'adjust', text: 'Set the start width to a light stretch, not a deep one.', zoom: 'add-start', claim: CL.c2 },
    { kind: 'load', text: 'Pick a moderate weight and check the selector pin is secure.', claim: CL.c5 },
    // D-TEXT-GOLDEN: card posture 'Return slowly, keeping tension' (c3)
    { kind: 'position', text: 'Squeeze, pause briefly, then return slowly, keeping tension.', claim: CL.c3 },
  ],
  posture: [
    // D-SHIP-TEXTZOOM: the card zoom add-back as a text checkpoint (a front-to-back move the front view cannot show)
    { key: 'back', label: 'Back on pad', detail: 'Back flat against the pad, spine neutral.', anchor: { landmark: 'sternum', pose: 'end' }, claim: CL.c4 },
    { key: 'stretch', label: 'Light stretch', detail: 'Start with only a light stretch.',
      anchor: { landmark: 'knee.r', pose: 'start' }, zoom: 'add-start', claim: CL.c2 },
    { key: 'meet', label: 'Pads meet', detail: 'Squeeze until the pads nearly touch.', anchor: { landmark: 'knee.r', pose: 'end' }, claim: CL.c3 },
    { key: 'return', label: 'Slow return', detail: 'Return slowly, keeping tension.', anchor: { landmark: 'knee.r', pose: 'start' }, claim: CL.c3 },
  ],
  feel,
  zooms,
  chips: ['add-start', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'Thigh pads on your inner thighs, just above the knees. Start with only a light stretch.',
    mistakeLine: 'Squeeze and return slowly. Never swing the legs together.',
    cueLine: 'Light stretch, then squeeze.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: [],   // the card's redFlags (none)
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/hip_adduction.json', rev: 1 },
};
