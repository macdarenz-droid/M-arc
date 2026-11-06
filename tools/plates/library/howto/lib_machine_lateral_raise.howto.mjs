// LIB-SHIP W6: the How-to content of lib_machine_lateral_raise (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/machine_lateral_raise.json; its claim ids are named on each field's claim.
// No hand zoom (D-SHIP-C3, card-no-zoom): the card has no hand zoom, so the sheet has none; the id is on
// tools/plates/library/hands/no-zoom.json. Its hand claims (hold the handles, pads just above the elbows, wrists neutral,
// lead with the elbows; c3, c4) live in handling and setup step 3.
// GRIP (D-SHIP-W6-CONV, #393 6647923934; section 14 row): the card's grip.thumb and grip.handContact read "Not given by
// any source read (balance archetype default)". Both take golden B's balance default as data, DERIVED at import from
// leg_press's handling (below), cited CONVENTION (source balance-default), never printed (D-SHIP-CONVCOPY). The wrist is
// the card's own c3 ("Neutral").
// Zooms: latm-shrug only. latm-pivot (c1) is a text checkpoint (D-SHIP-TEXTZOOM, the machine_chest_press 'Start depth'
// precedent): its Wrong is a seat setting; posture checkpoint `pivot`, setup step 1 and the plate's 'Shoulders at pivot'
// label.
// Front-view plate (card plate.view): the posture crop is cut in the plate's own view (no `view` override).
// Red flags: none (the card's redFlags is empty).
// Variant line: none on the sheet (equipment 'Machine', one kind); the card's variantLine (ACE's facing version, c15)
// stays on the plate.
import plateSpec from '../specs/machine_lateral_raise.mjs';
import { RED_FLAG } from '../../layers/howto/shared.mjs';
export { RED_FLAG };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'mo-lat-raise': { cite: 'Machine Lateral Raise: Exercise Guide (Motra, formerly Train Fitness)', url: 'https://motra.com/exercises/machineLateralRaise',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'vg-lat-raise': { cite: 'Lateral Raise Machine Video Exercise Guide (Virtuagym)', url: 'https://exercises.virtuagym.com/exercise/lateral-raise-machine/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'ace-lat-raise': { cite: 'Lateral Shoulder Raise (ACE Exercise Library)', url: 'https://www.acefitness.org/resources/everyone/exercise-library/295/lateral-shoulder-raise/',
    kind: 'guideline', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'laf-lat-raise': { cite: 'How to use The Lateral Raise Machine (LA Fitness, Living Healthy blog)', url: 'https://blog.lafitness.com/2016/03/31/how-to-use-a-lateral-raise-machine/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'sl-lat-raise': { cite: 'How to Do Machine Lateral Raise: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/machine-lateral-raise/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'rabello-2024': { cite: 'Activation of the three deltoid muscle portions during common strengthening exercises: A systematic review', url: 'https://pubmed.ncbi.nlm.nih.gov/39593452/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-22', use: 'DATA' },
  // golden B's `balance` archetype default for the two hand values the card delegates: a convention.
  'balance-default': { cite: 'Golden B balance archetype default (leg_press handling: thumb wrapped, contact finger-base)', url: 'tools/plates/layers/exercises/leg_press.howto.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-05', use: 'CONVENTION' },
};
// Not cited: acsm-2009 (c14, load progression; the five setup steps carry the card's own steps and its lowering line).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const MO = 'mo-lat-raise', VG = 'vg-lat-raise', ACE = 'ace-lat-raise', LAF = 'laf-lat-raise', SL = 'sl-lat-raise';
const CL = {
  c1: C(['CONSENSUS'], [MO, VG], 'c1'),
  c2: C(['CONSENSUS'], [MO, VG], 'c2'),
  c3: C(['CONSENSUS'], [ACE, SL, MO], 'c3'),
  c4: C(['CONSENSUS'], [ACE, MO], 'c4'),
  c5: C(['CONSENSUS'], [SL, LAF, MO, VG], 'c5'),
  c6: C(['CONSENSUS'], [MO], 'c6'),
  c7: C(['CONSENSUS'], [SL, LAF], 'c7'),
  c8: C(['CONSENSUS'], [VG, MO], 'c8'),
  c9: C(['CONSENSUS'], [LAF, MO], 'c9'),
  shrug: C(['CONSENSUS'], [MO], 'c6, c5'),
  swing: C(['CONSENSUS'], [VG, MO, SL, LAF], 'c8, c7'),
  lighter: C(['CONSENSUS'], [MO, SL, LAF], 'c6, c7'),
};

/* ------------------------------------------------------------------------------------------------ hand ---------- */
// The thumb and contact DERIVED at import from golden B's balance default, so they cannot drift from it. The source
// lines are copied here (leg_press.howto.mjs:329, :330) and pinned against the live file by a test; a line that no
// longer parses throws.
const LP_THUMB = "thumb: { mode: 'wrapped', claim: CL.thumb },";        // leg_press.howto.mjs:329
const LP_CONTACT = "contact: 'finger-base',";                           // leg_press.howto.mjs:330
const THUMB = LP_THUMB.match(/mode: '([a-z-]+)'/)?.[1];
const CONTACT = LP_CONTACT.match(/contact: '([a-z-]+)'/)?.[1];
if (!THUMB || !CONTACT) throw new Error('lib_machine_lateral_raise: golden B leg_press balance default does not parse');
const CONV = C(['CONVENTION'], ['balance-default'], 'card grip.thumb and grip.handContact: no source gives them (balance archetype default); golden B\'s balance default, not a card claim, never shown');

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses:
//   shrug (card zoom latm-shrug Wrong, c6 "Shoulders hiked up toward the ears"): the end pose (upper arms horizontal,
//         c5) with the shoulder blades raised by SHRUG.
// DRAWING VALUE (D-SHIP-DRAWVAL, #376 6614695581; precedent D-LIB7-2 and golden B's pull_up SHRUG_HANG, scap elev 8 cm,
// pull_up.howto.mjs:162): SHRUG 8 cm. No card gives it, no number from it appears in user copy; the layers panel judges it.
const END = plateSpec.poses.end, SHRUG = 8;
const SHRUGGED = { scap: { elev: SHRUG, pro: END.scap.pro } };
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  shrug: { pose: { ...END, ...SHRUGGED } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom except latm-pivot (a text checkpoint, above); the card has no hand zoom. Zoom shell form
// (render/closeup/crop.mjs): callouts anchored at the landmark they name, no guide mark; the Wrong is drawn alone
// (solid), as `stills.shrug`.
const zooms = [
  {
    key: 'latm-shrug', chip: 'Shoulders', heading: 'Shoulders down', kind: 'posture',
    crop: { center: { at: 'neck', pose: 'right', off: [0, 10] }, sizePx: 220 },
    right: 'end',
    wrong: { base: 'end', pose: SHRUGGED, solid: true },
    callout: {
      right: { text: 'Shoulders down', anchor: 'shoulderTop.r' },
      wrong: { text: 'Shrugged', anchor: 'shoulderTop.r' },
    },
    caption: {
      right: 'Shoulders down, elbows at shoulder height.',
      wrong: 'Shoulders hiked up toward the ears.',
    },
    alt: {
      right: 'Front view, top of the raise. The upper arms are level and the shoulders stay down.',
      wrong: 'Front view. The shoulders hike up toward the ears.',
    },
    feelRow: 'traps',
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'side_delts', plain: 'The sides of the shoulders do the lifting.' }],
  secondary: [{ muscleId: 'upper_traps', plain: 'The upper traps may also work.' }],
  watch: [{ muscleId: 'upper_traps', plain: 'Shrugging lets the traps take over.' }],
  feelLine: 'You should feel this in the sides of your shoulders.',
  rows: [
    // The card's first row (sides of the shoulders) has no fix, so it is left out: the feel line says it (D-SHIP-Q16).
    { key: 'traps', where: 'Tops of the shoulders and neck', at: { muscles: ['upper_traps'] },
      means: 'Shrugging lets the traps dominate.',
      fix: 'Keep your shoulders down. Go lighter.',
      zoom: 'latm-shrug', claim: CL.lighter },
  ],
  claim: C(['DATA', 'WEAK', 'CONSENSUS'], [MO, 'rabello-2024', VG], 'c11 (primary), c12 (secondary), c6 (watch)'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'swing', title: 'Swinging the body up', claim: CL.swing,
    fix: 'Lower the weight and lift without momentum.' },
  { key: 'shrug', title: 'Shrugging the shoulders', zoom: 'latm-shrug', claim: CL.lighter,
    fix: 'Keep your shoulders down. Go lighter if needed.' },
  { key: 'heavy', title: 'Too heavy for shoulder height', claim: CL.c7,
    fix: 'Lower the weight.' },   // c7
];
const RISKS = [
  { key: 'swing', text: 'Swinging the body to finish a rep can lead to injury.', claim: CL.c8 },
  { key: 'heavy', text: 'It is easy to choose a weight that is too heavy.', claim: CL.c7 },
];

export default {
  schema: 1,
  id: 'lib_machine_lateral_raise',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'balance',
    why: 'D-SHIP-C3: card-no-zoom, the card has no hand zoom; the grip copy carries c3 and c4.',
    handle: 'machine-grip',    // card grip.type: the machine's handles (c3); no shape given
    loadAxis: 'across',        // golden B's balance default (leg_press.howto.mjs:327)
    width: { text: 'Set by the machine arms.', claim: CL.c3 },
    thumb: { mode: THUMB, claim: CONV },   // CONVENTION: 'wrapped', derived above
    contact: CONTACT,          // CONVENTION: 'finger-base', derived above
    // card grip.wrist: "Neutral (c3)". No tolerance given: neutral itself.
    wrist: { ext: [0, 0], limitText: 'Keep your wrists neutral.', claim: CL.c3 },
    faults: [],                // the card names no hand fault
    gripLine: 'Hold the handles, pads just above the elbows. Lead with the elbows.',   // c3, c4
    cue: 'Lead with the elbows.',   // c4
  },
  contacts: ['seat-back'],   // the card's archetype.contact
  setup: [
    { kind: 'adjust', text: "Set the seat so your shoulders line up with the machine's pivots.", claim: CL.c1 },
    { kind: 'position', text: 'Sit with your back on the pad, feet flat on the floor.', claim: CL.c2 },
    { kind: 'grip', text: 'Arms on the pads, just above the elbows. Hold the handles.', claim: CL.c3 },
    { kind: 'load', text: 'Pick a lighter weight than you think.', claim: CL.c7 },
    // D-TEXT-GOLDEN: card posture 'Lower slowly, stopping before the stack rests' (c9)
    { kind: 'position', text: 'Lower slowly, stopping before the stack rests.', claim: CL.c9 },
  ],
  posture: [
    // D-SHIP-TEXTZOOM: the card zoom latm-pivot as a text checkpoint (its Wrong is a seat setting)
    { key: 'pivot', label: 'Shoulders at pivot', detail: "Seat set so the shoulders line up with the machine's pivots.",
      anchor: { landmark: 'shoulder.l', pose: 'start' }, claim: CL.c1 },
    { key: 'back', label: 'Back on pad', detail: 'Back stays on the pad, feet flat.', anchor: { landmark: 'sternum', pose: 'end' }, claim: CL.c2 },
    { key: 'lead', label: 'Lead with elbows', detail: 'Lead with the elbows.', anchor: { landmark: 'elbow.r', pose: 'end' }, claim: CL.c4 },
    { key: 'level', label: 'Elbows shoulder-high', detail: 'Stop when the upper arms are horizontal.', anchor: { landmark: 'elbow.l', pose: 'end' }, claim: CL.c5 },
    { key: 'shrug', label: 'Shoulders down', detail: 'Shoulders stay down, no shrugging.',
      anchor: { landmark: 'shoulderTop.r', pose: 'end' }, zoom: 'latm-shrug', claim: CL.c6 },
    { key: 'lower', label: 'Slow lowering', detail: 'Lower slowly, stopping before the stack rests.', anchor: { landmark: 'elbow.r', pose: 'start' }, claim: CL.c9 },
  ],
  feel,
  zooms,
  chips: ['latm-shrug', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: "Set the seat so your shoulders line up with the machine's pivots. Arms on the pads.",
    mistakeLine: 'Keep your shoulders down. Stop when your upper arms are horizontal.',
    cueLine: 'Lead with the elbows.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: [],   // the card's redFlags (none)
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/machine_lateral_raise.json', rev: 1 },
};
