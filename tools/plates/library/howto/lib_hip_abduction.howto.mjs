// LIB-SHIP W6: the How-to content of lib_hip_abduction (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/hip_abduction.json; its claim ids are named on each field's claim.
// No hand zoom (D-SHIP-C3, card-no-zoom): the card has no hand zoom, so the sheet has none; the id is on
// tools/plates/library/hands/no-zoom.json. Its hand claim (hold the side handles for stability, brace the core; c2)
// lives in handling and setup step 4.
// GRIP (Q-W6-3, D-SHIP-W6-CONV, #393 6647923934): the card's grip.thumb, grip.handContact and grip.wrist each read "Not
// given by any source read (balance archetype default)". The thumb and contact take golden B's balance default as data,
// DERIVED at import from leg_press's handling (below), cited CONVENTION (source balance-default), never printed
// (D-SHIP-CONVCOPY). The wrist is exempt (D-SHIP-W6-WRISTEXEMPT, #393 6648157060): no range, nothing printed.
// Zooms: abd-range only. abd-pivot (c1) is a text checkpoint (D-SHIP-TEXTZOOM, the machine_chest_press 'Start depth'
// precedent): its Wrong is a seat setting, and the front-view plate (card plate.view) shows the knees side to side,
// not where they sit against the pivot; posture checkpoint `pivot`, setup step 1 and the plate's 'Knees at pivot' label.
// Front-view plate (card plate.view): the posture crop is cut in the plate's own view (no `view` override).
// Red flags: none (the card's redFlags is empty). No variant line (equipment 'Machine').
import plateSpec from '../specs/hip_abduction.mjs';
import { RED_FLAG } from '../../layers/howto/shared.mjs';
export { RED_FLAG };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'mo-hip-abd': { cite: 'Machine Hip Abduction: Exercise Guide (Motra, formerly Train Fitness)', url: 'https://motra.com/exercises/machineHipAbduction',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'sl-hip-abd': { cite: 'How to Do Hip Abduction Machine: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/hip-abduction-machine/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'paz-2022': { cite: 'Hip abduction machine is better than free weights to target the gluteus medius while minimizing tensor fascia latae activation', url: 'https://pubmed.ncbi.nlm.nih.gov/35500965/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-22', use: 'DATA' },
  // golden B's `balance` archetype default for the three hand values the card delegates: a convention.
  'balance-default': { cite: 'Golden B balance archetype default (leg_press handling: thumb wrapped, contact finger-base)', url: 'tools/plates/layers/exercises/leg_press.howto.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-05', use: 'CONVENTION' },
};
// Not cited: acsm-2009 (c11, load progression; the five setup steps carry the card's own steps and its return line).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const MO = 'mo-hip-abd', SL = 'sl-hip-abd';
const CL = {
  c1: C(['CONSENSUS'], [MO], 'c1'),
  c2: C(['CONSENSUS'], [MO, SL], 'c2'),
  c3: C(['CONSENSUS'], [MO, SL], 'c3'),
  c4: C(['CONSENSUS'], [MO], 'c4'),
  c5: C(['CONSENSUS'], [MO], 'c5'),
  c6: C(['CONSENSUS'], [MO], 'c6'),
  jerk: C(['CONSENSUS'], [MO], 'c12, c5, c6'),
  range: C(['CONSENSUS'], [MO], 'c12, c4'),
  fit: C(['CONSENSUS'], [MO], 'c6, c1'),
};

/* ------------------------------------------------------------------------------------------------ hand ---------- */
// GRIP (Q-W6-3): the two hand values DERIVED at import from golden B's balance default, so they cannot drift from it.
// The source lines are copied here (leg_press.howto.mjs:329, :330) and pinned against the live file by a test; a line
// that no longer parses throws.
const LP_THUMB = "thumb: { mode: 'wrapped', claim: CL.thumb },";        // leg_press.howto.mjs:329
const LP_CONTACT = "contact: 'finger-base',";                           // leg_press.howto.mjs:330
const THUMB = LP_THUMB.match(/mode: '([a-z-]+)'/)?.[1];
const CONTACT = LP_CONTACT.match(/contact: '([a-z-]+)'/)?.[1];
if (!THUMB || !CONTACT) throw new Error('lib_hip_abduction: golden B leg_press balance default does not parse');
const CONV = C(['CONVENTION'], ['balance-default'], 'card grip.thumb and grip.handContact: no source gives them (balance archetype default); golden B\'s balance default, not a card claim, never shown');
const CONV_WRIST = C(['CONVENTION'], ['balance-default'], 'card grip.wrist: balance archetype default only; no source gives a wrist range, so none is taken and nothing is shown (D-SHIP-W6-WRISTEXEMPT)');

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: the end (legs pushed apart to a full, comfortable range; c3, c4) and the spec's
// Mistake pose merged over it, as the engine draws it (card plate.mistake c12: the knees open only to MIS_ABD). The card
// zoom abd-range Wrong ("Knees opened only a little") is that pose, so no new pose or drawing value is made.
const MIS = plateSpec.mistake.pose;
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: plateSpec.poses.end },
  short: { pose: { ...plateSpec.poses.end, ...MIS } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom except abd-pivot (a text checkpoint, above); the card has no hand zoom. Zoom shell form
// (render/closeup/crop.mjs): callouts anchored at the landmark they name, no guide mark; the Wrong (`stills.short`)
// is dashed over the solid Right.
const zooms = [
  {
    key: 'abd-range', chip: 'Range', heading: 'Full range', kind: 'posture',
    crop: { center: { at: 'hips', pose: 'right', off: [0, 10] }, sizePx: 260 },
    right: 'end',
    // W6 panel L5 (#393): the Wrong is drawn as the dashed mistake over the solid Right (not alone), so the fault reads
    // against the correct pose in one panel.
    wrong: { base: 'end', pose: MIS },
    callout: {
      right: { text: 'Comfortably wide', anchor: 'knee.r' },
      wrong: { text: 'Short range', anchor: 'knee.r' },
    },
    caption: {
      right: 'Legs opened comfortably wide.',
      wrong: 'Knees opened only a little.',
    },
    alt: {
      right: 'Front view, end of the push. The knees are pushed apart to a full, comfortable range.',
      wrong: 'Front view. The knees open only a little before the legs come back.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [
    { muscleId: 'abductors', plain: 'The muscles on the outer hips move the thighs apart.' },
    { muscleId: 'glutes', plain: 'Parts of the glutes help push the legs out.' },
  ],
  secondary: [],
  watch: [],
  feelLine: 'You should feel this in your outer hips and the sides of your glutes.',
  rows: [
    // The card's first row (outer hips and side of glutes) has no fix, so it is left out: the feel line says it (D-SHIP-Q16).
    { key: 'hip', where: 'Hip', at: { muscles: ['abductors'] },
      means: 'The machine may not be set to fit you.',
      fix: 'Line your knees up with the pivot.',
      claim: CL.fit },
  ],
  claim: C(['DATA', 'CONSENSUS'], ['paz-2022', SL, MO], 'c9 (abductors), c8 (glutes)'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'jerk', title: 'Jerking the weight', claim: CL.jerk,
    fix: 'Keep your upper body still. Lower the weight.' },
  { key: 'heavy', title: 'Weight too heavy for form', claim: CL.c6,
    fix: 'Lower the weight.' },   // c6
  { key: 'range', title: 'Incomplete range', zoom: 'abd-range', claim: CL.range,
    fix: 'Open the legs to a full, comfortable range.' },
];
const RISKS = [
  { key: 'fit', text: "A machine that doesn't fit you can strain the hip.", claim: CL.c6 },
  { key: 'heavy', text: 'Too much weight spoils form.', claim: CL.c6 },
];

export default {
  schema: 1,
  id: 'lib_hip_abduction',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'balance',
    why: 'D-SHIP-C3: card-no-zoom, the card has no hand zoom; the grip copy carries c2.',
    handle: 'machine-grip',    // card grip.type: the machine's side handles (c2); no shape given
    loadAxis: 'across',        // golden B's balance default (leg_press.howto.mjs:327)
    width: { text: 'Set by the machine.', claim: CL.c2 },
    thumb: { mode: THUMB, claim: CONV },   // CONVENTION (Q-W6-3): 'wrapped', derived above
    contact: CONTACT,          // CONVENTION (Q-W6-3): 'finger-base', derived above
    // D-SHIP-W6-WRISTEXEMPT: the card delegates grip.wrist; no range, nothing printed. c2 stays in gripLine and the grip step.
    wrist: { exempt: 'Card grip.wrist: balance archetype default only; no source gives a wrist range for this exercise.', claim: CONV_WRIST },
    faults: [],                // the card names no hand fault
    gripLine: 'Hold the side handles for stability and brace your trunk.',   // c2
    cue: 'Knees in line with the pivot.',   // c1
  },
  contacts: ['seat-back', 'pivot-pad'],   // the card's archetype.contact
  setup: [
    { kind: 'adjust', text: "Set the seat so your knees line up with the machine's pivot.", claim: CL.c1 },
    // card setup steps 2 and 3 in one (both c1), so card posture 'Return slowly' (c3) fits the five-step cap
    { kind: 'position', text: 'Back on the pad, feet on footrests, pads snug on outer thighs.', claim: CL.c1 },
    { kind: 'load', text: 'Pick a weight you can move without losing form.', claim: CL.c6 },
    { kind: 'grip', text: 'Hold the handles and brace your trunk.', claim: CL.c2 },
    // D-TEXT-GOLDEN: card posture 'Return slowly, resisting the weight' (c3)
    { kind: 'position', text: 'Push your legs out, hold briefly, then return slowly.', claim: CL.c3 },
  ],
  posture: [
    // D-SHIP-TEXTZOOM: the card zoom abd-pivot as a text checkpoint (a seat setting the front view cannot show)
    { key: 'pivot', label: 'Knees at pivot', detail: "Seat set so the knees line up with the machine's pivot.",
      anchor: { landmark: 'knee.l', pose: 'end' }, claim: CL.c1 },
    { key: 'back', label: 'Back on pad', detail: 'Back flat against the pad.', anchor: { landmark: 'sternum', pose: 'end' }, claim: CL.c5 },
    { key: 'still', label: 'Upper body still', detail: 'Upper body still, no momentum.', anchor: { landmark: 'sternum', pose: 'start' }, claim: CL.c5 },
    { key: 'range', label: 'Full range', detail: 'Open from knees together to comfortably wide.',
      anchor: { landmark: 'knee.r', pose: 'end' }, zoom: 'abd-range', claim: CL.c4 },
    { key: 'return', label: 'Slow return', detail: 'Return slowly, resisting the weight.', anchor: { landmark: 'knee.r', pose: 'start' }, claim: CL.c3 },
  ],
  feel,
  zooms,
  chips: ['abd-range', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: "Set the seat so your knees line up with the machine's pivot. Pads snug on your outer thighs.",
    mistakeLine: 'Open the legs to a full, comfortable range. Keep your upper body still.',
    cueLine: 'Knees together to comfortably wide.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: [],   // the card's redFlags (none)
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/hip_abduction.json', rev: 1 },
};
