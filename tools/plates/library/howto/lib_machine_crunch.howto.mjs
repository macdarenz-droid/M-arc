// LIB-SHIP W6: the How-to content of lib_machine_crunch (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/machine_crunch.json; its claim ids are named on each field's claim.
// No hand zoom (D-SHIP-C3, card-no-zoom): the card has no hand zoom, so the sheet has none; the id is on
// tools/plates/library/hands/no-zoom.json. Its hand claims (both hands on the handles, the abs and not the arms doing
// the work; c3, c14) live in handling and setup step 4.
// GRIP (Q-W6-3, D-SHIP-W6-CONV, #393 6647923934): the card's grip.thumb, grip.handContact and grip.wrist each read "Not
// given by any source read (balance archetype default)". The thumb and contact take golden B's balance default as data,
// DERIVED at import from leg_press's handling (below), cited CONVENTION (source balance-default), never printed
// (D-SHIP-CONVCOPY). The wrist is exempt (D-SHIP-W6-WRISTEXEMPT, #393 6648157060): no range, nothing printed.
// Red flags: the card's redFlags (back): LIB-5's back box (tools/plates/library/shared/back-box.mjs), linked by the
// lower-back row's redFlag: 'back'.
// No variant line (equipment 'Machine').
import plateSpec, { SIZES } from '../specs/machine_crunch.mjs';
import { rootOnSeat } from '../engine.mjs';
import { RED_FLAG } from '../../layers/howto/shared.mjs';
export { RED_FLAG };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'ace-seated-crunch': { cite: 'Seated Crunch (ACE Exercise Library)', url: 'https://www.acefitness.org/resources/everyone/exercise-library/291/seated-crunch/',
    kind: 'guideline', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'mo-crunch': { cite: 'Machine Ab Crunch: Exercise Guide (Motra, formerly Train Fitness)', url: 'https://motra.com/exercises/abCrunchMachine',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'fb-crunch': { cite: 'Ab Crunch Machine: Form, Muscles Worked, Target Weight & Variations (Fitbod)', url: 'https://fitbod.me/exercises/ab-crunch-machine',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'sl-crunch': { cite: 'How to Do Machine Crunch: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/machine-crunch/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'sundstrup-2012': { cite: 'Swiss ball abdominal crunch with added elastic resistance is an effective alternative to training machines', url: 'https://pubmed.ncbi.nlm.nih.gov/22893857/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-22', use: 'DATA' },
  // golden B's `balance` archetype default for the three hand values the card delegates: a convention.
  'balance-default': { cite: 'Golden B balance archetype default (leg_press handling: thumb wrapped, contact finger-base)', url: 'tools/plates/layers/exercises/leg_press.howto.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-05', use: 'CONVENTION' },
  // The back box's own source (shared/back-box.mjs boxClaim), as lib_crunch lists it: the card's redFlags 'back'.
  'nhs-back': { cite: 'NHS, Back pain', url: 'https://www.nhs.uk/conditions/back-pain/',
    kind: 'guideline', access: 'full', checked: '2026-10-02', use: 'CONSENSUS', note: 'When back pain needs a check.' },
};
// Not cited: acsm-2009 (c12 tempo, c13 load progression; the plate carries the tempo, and the five setup steps carry
// the card's own steps and its breathing and neck lines).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const ACE = 'ace-seated-crunch', MO = 'mo-crunch', FB = 'fb-crunch';
const CL = {
  c1: C(['CONSENSUS'], [ACE, MO], 'c1'),
  c2: C(['CONSENSUS'], [ACE], 'c2'),
  c3: C(['CONSENSUS'], [ACE, MO, FB], 'c3'),
  c4: C(['CONSENSUS'], [MO, FB], 'c4'),
  c6: C(['CONSENSUS'], [MO], 'c6'),
  c11: C(['MECH', 'WEAK'], [MO, 'sundstrup-2012'], 'c11'),
  c14: C(['CONSENSUS'], [MO], 'c14'),
  rest: C(['CONSENSUS'], [ACE, MO], 'c5, c14'),
  breathe: C(['CONSENSUS'], [MO], 'c7, c14'),
  hipPain: C(['DATA', 'WEAK'], ['sundstrup-2012'], 'c10, c9'),
};

/* ------------------------------------------------------------------------------------------------ hand ---------- */
// GRIP (Q-W6-3): the two hand values DERIVED at import from golden B's balance default, so they cannot drift from it.
// The source lines are copied here (leg_press.howto.mjs:329, :330) and pinned against the live file by a test; a line
// that no longer parses throws.
const LP_THUMB = "thumb: { mode: 'wrapped', claim: CL.thumb },";        // leg_press.howto.mjs:329
const LP_CONTACT = "contact: 'finger-base',";                           // leg_press.howto.mjs:330
const THUMB = LP_THUMB.match(/mode: '([a-z-]+)'/)?.[1];
const CONTACT = LP_CONTACT.match(/contact: '([a-z-]+)'/)?.[1];
if (!THUMB || !CONTACT) throw new Error('lib_machine_crunch: golden B leg_press balance default does not parse');
const CONV = C(['CONVENTION'], ['balance-default'], 'card grip.thumb and grip.handContact: no source gives them (balance archetype default); golden B\'s balance default, not a card claim, never shown');
const CONV_WRIST = C(['CONVENTION'], ['balance-default'], 'card grip.wrist: balance archetype default only; no source gives a wrist range, so none is taken and nothing is shown (D-SHIP-W6-WRISTEXEMPT)');

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses:
//   pull  (card zoom crunch-arms Wrong, c3, c14): the spec's Mistake pose merged over the end, as the engine draws it
//         (the trunk upright, the arms dragging the handles down to the end's arm angle). It is the plate's drawn fault.
//   hinge (card zoom crunch-curl Wrong, c11 "Torso hinging at the hips without curling the spine"): the end pose with the
//         spine straight (trunk 0) and the pelvis tipped forward by the plate's own CURL angle on the seat instead
//         (rootOnSeat with tilt CURL), the hands still on the end's handles.
//   slide (card zoom crunch-hips Wrong, c2 "Hips sliding forward off the seat back"): the end pose with the pelvis moved
//         forward along the seat by SLIDE.
// DRAWING VALUES (D-SHIP-DRAWVAL, #376 6614695581; precedent D-LIB7-2 and golden B's machine_chest_press seatDrop): the
// hinge reuses the spec's CURL (no new number); SLIDE 0.10 m sizes the slide (golden B's machine_chest_press seatDrop
// 0.12 m scale). No card gives them, no number from them appears in user copy; the layers panel judges them.
const H = 1.75, END = plateSpec.poses.end, MIS = plateSpec.mistake.pose, SEAT = [0, SIZES.SEAT_TOP, 0];
const SLIDE = 0.10;
const HINGE = { root: { at: rootOnSeat(SEAT, SIZES.CURL, H), tilt: SIZES.CURL }, trunk: 0 };
const SLID = (() => { const at = END.root.at; return { root: { at: [at[0], at[1], at[2] + SLIDE], tilt: END.root.tilt } }; })();
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  pull: { pose: { ...END, ...MIS } },
  hinge: { pose: { ...END, ...HINGE } },
  slide: { pose: { ...END, ...SLID } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom, same keys and kinds (the card has no hand zoom). Zoom shell form (render/closeup/crop.mjs):
// callouts anchored at the landmark they name. The arms Wrong is the plate's own Mistake (pose and its dashed arm
// guides) over the right pose, as the plate's Mistake view draws it; the other two Wrongs are drawn alone (solid).
const WIDE = { center: { at: 'navel', pose: 'right', off: [0, -20] }, sizePx: 240 };
const zooms = [
  {
    key: 'crunch-arms', chip: 'Arms', heading: 'Arm pull', kind: 'posture',
    crop: WIDE,
    right: 'end',
    wrong: { base: 'end', pose: MIS },
    guides: plateSpec.mistake.guides,
    callout: {
      right: { text: 'Abs curl', anchor: 'navel' },
      wrong: { text: 'Arms pull', anchor: { at: 'elbow.r', pose: 'mistake' } },
    },
    caption: {
      right: 'Elbows held bent, the abs curl the trunk.',
      wrong: 'Arms doing the pull while the trunk stays upright.',
    },
    alt: {
      right: 'Side view, end of the crunch. The elbows keep their bend and the spine curls forward.',
      wrong: 'Side view. The trunk stays upright and the arms drag the handles down.',
    },
  },
  {
    key: 'crunch-curl', chip: 'Spine', heading: 'Spine curl', kind: 'posture',
    crop: WIDE,
    right: 'end',
    wrong: { base: 'end', pose: HINGE, solid: true },
    callout: {
      right: { text: 'Spine curled', anchor: 'backUpper' },
      wrong: { text: 'Hip hinge', anchor: 'backUpper' },
    },
    caption: {
      right: 'Spine curled, ribs coming toward the pelvis.',
      wrong: 'Torso hinging at the hips without curling the spine.',
    },
    alt: {
      right: 'Side view, end of the crunch. The spine curls and the ribs come toward the pelvis.',
      wrong: 'Side view. The back stays straight and the whole torso tips forward at the hips.',
    },
    feelRow: 'hips',
  },
  {
    key: 'crunch-hips', chip: 'Hips', heading: 'Hips back', kind: 'posture',
    crop: WIDE,
    right: 'end',
    wrong: { base: 'end', pose: SLID, solid: true },
    callout: {
      right: { text: 'Hips back', anchor: 'buttock' },
      wrong: { text: 'Hips slide', anchor: 'buttock' },
    },
    caption: {
      right: 'Hips against the seat back, shins on the roller.',
      wrong: 'Hips sliding forward off the seat back.',
    },
    alt: {
      right: 'Side view, end of the crunch. The hips stay pressed against the seat back.',
      wrong: 'Side view. The hips slide forward, away from the seat back.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'abs', plain: 'The abs at the front of the belly do the bending.' }],
  secondary: [
    { muscleId: 'obliques', plain: 'The sides of the belly work hard too.' },
    { muscleId: 'hip_flexors', plain: 'The hip flexors also work hard on this machine.' },
  ],
  watch: [{ muscleId: 'lower_back', plain: 'Too much weight can strain the lower back.' }],
  feelLine: 'You should feel this in the front of your stomach.',
  rows: [
    // The card's first row (front of the stomach) has no fix, so it is left out: the feel line says it (D-SHIP-Q16).
    { key: 'hips', where: 'Front of the hips', at: { muscles: ['hip_flexors'] },
      means: 'Hinging at the hips shifts work to the hip flexors.',
      fix: 'Curl your ribs toward your pelvis.',
      zoom: 'crunch-curl', claim: CL.c11 },
    { key: 'low-back', where: 'Lower back', at: { muscles: ['lower_back'] },
      means: 'Too much weight can strain the back.',
      fix: 'Avoid excessive weight.',
      redFlag: 'back', claim: CL.c6 },
    // The card's Neck row has no fix (D-SHIP-Q16), so it is left out: setup step 5 carries c14's neck line.
  ],
  libraryDiff: { add: ['obliques', 'hip_flexors'], why: 'The external obliques and the rectus femoris were highly active on the machine (card c9).' },
  claim: C(['CONSENSUS', 'DATA'], ['sl-crunch', MO, 'sundstrup-2012'], 'c8, c9 (primary, secondary), c6 (watch)'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'arms', title: 'Pulling with the arms', zoom: 'crunch-arms', claim: CL.c14,
    fix: 'Start the crunch with your abs.' },
  { key: 'heavy', title: 'Using too much weight', claim: CL.c6,
    fix: 'Lower the weight to protect your back.' },
  { key: 'rest', title: 'Letting the stack rest', claim: CL.rest,
    fix: 'Keep tension. Return without letting the stack rest.' },
];
const RISKS = [
  { key: 'back', text: 'Too much weight can strain the back.', claim: CL.c6 },
  { key: 'hip-flexors', text: 'Lower back pain? This machine works the hip flexors hard, so take care.', claim: CL.hipPain },
];

export default {
  schema: 1,
  id: 'lib_machine_crunch',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'balance',
    why: 'D-SHIP-C3: card-no-zoom, the card has no hand zoom; the grip copy carries c3 and c14.',
    handle: 'machine-grip',    // card grip.type: the machine's handles (c3); no shape given
    loadAxis: 'across',        // golden B's balance default (leg_press.howto.mjs:327)
    width: { text: 'Set by the machine.', claim: CL.c3 },
    thumb: { mode: THUMB, claim: CONV },   // CONVENTION (Q-W6-3): 'wrapped', derived above
    contact: CONTACT,          // CONVENTION (Q-W6-3): 'finger-base', derived above
    // D-SHIP-W6-WRISTEXEMPT: the card delegates grip.wrist; no range, nothing printed. c3/c14 stay in gripLine and setup 4.
    wrist: { exempt: 'Card grip.wrist: balance archetype default only; no source gives a wrist range for this exercise.', claim: CONV_WRIST },
    faults: [],                // the card names no hand fault
    gripLine: 'Hold the handles in both hands. Start the crunch with your abs, not your arms.',
    cue: 'Start the crunch with your abs.',   // c14
  },
  contacts: ['seat-back'],   // the card's archetype.contact
  setup: [
    { kind: 'adjust', text: 'Set the seat to a comfortable height and choose the weight.', claim: CL.c1 },
    { kind: 'position', text: 'Sit with your hips pressed against the back of the seat.', zoom: 'crunch-hips', claim: CL.c2 },
    { kind: 'brace', text: 'Push your shins against the padded roller and tighten your abs.', claim: CL.c2 },
    { kind: 'grip', text: 'Hold the handles in both hands.', claim: CL.c3 },
    // D-TEXT-GOLDEN: card posture 'Breathe out on the crunch' (c7) and 'Don't strain your neck' (c14)
    { kind: 'position', text: "Breathe out as you crunch. Don't strain your neck.", claim: CL.breathe },
  ],
  posture: [
    { key: 'hips', label: 'Hips back', detail: 'Hips stay back in the seat.', anchor: { landmark: 'buttock', pose: 'end' }, zoom: 'crunch-hips', claim: CL.c2 },
    { key: 'curl', label: 'Curl the spine', detail: 'Curl the ribs toward the pelvis.', anchor: { landmark: 'backUpper', pose: 'end' }, zoom: 'crunch-curl', claim: CL.c4 },
    { key: 'core', label: 'Core leads', detail: 'Start the crunch with the abs, not by pulling with the arms.',
      anchor: { landmark: 'navel', pose: 'end' }, zoom: 'crunch-arms', claim: CL.c14 },
    { key: 'return', label: 'Slow return', detail: 'Return slowly, without letting the stack rest.', anchor: { landmark: 'backUpper', pose: 'start' }, claim: CL.rest },
    { key: 'breathe', label: 'Breathe out', detail: 'Breathe out on the crunch.', anchor: { landmark: 'chest', pose: 'end' }, claim: CL.breathe },
    { key: 'neck', label: 'Neck relaxed', detail: "Don't strain your neck.", anchor: { landmark: 'chin', pose: 'end' }, claim: CL.c14 },
  ],
  feel,
  zooms,
  chips: ['crunch-arms', 'crunch-curl', 'crunch-hips', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'Set the seat to a comfortable height. Sit with your hips pressed against the back of the seat.',
    mistakeLine: 'Start the crunch with your abs, not by pulling with your arms.',
    cueLine: 'Ribs toward your pelvis.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['back'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/machine_crunch.json', rev: 1 },
};
