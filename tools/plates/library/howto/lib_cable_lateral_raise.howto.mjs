// LIB-SHIP W6: the How-to content of lib_cable_lateral_raise (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/cable_lateral_raise.json; its claim ids are named on each field's claim.
// Child of dumbbell_lateral_raise (card parent) with inherit [] (the card's notes: every shown line uses this card's own
// claims), so there is no family map and no `extends`.
// No hand zoom (D-SHIP-C3, card-no-zoom): the card has no hand zoom; the id is on
// tools/plates/library/hands/no-zoom.json. Its hand claims (one single handle in the outside hand, the arm hanging with a
// slight elbow bend; c2, c4) live in handling (gripLine) and setup steps 2 and 4.
// GRIP (Q-W6-3, D-SHIP-W6-CONV): the card's grip.thumb, grip.handContact and grip.wrist read "Not given by any source
// read". The thumb and contact are the `hold` archetype's golden-B default from this card's own parent
// (dumbbell_lateral_raise), DERIVED at import from the copied handling values (below), cited CONVENTION (source
// hold-default), never shown (D-SHIP-CONVCOPY). No source gives a wrist position or range, and no printed text may come
// from the default (no limitText), so the wrist is `exempt`. No palm direction is claimed (the card's notes: the plate's
// neutral D-handle grip is a drawing convention), so `orientation` is left out.
// Card zoom `clr-cable-tight` is a text checkpoint (D-SHIP-TEXTZOOM; single_arm_lat_pulldown precedent): its Right ("A
// step away, cable tight at the start", c3) is a cable state and its Wrong is null. Its claim is shown in setup step 3
// and the plate callout `tight`.
// Front-view plate (card plate.view): the posture crops are cut in the plate's own view (no `view` override).
// No variant line (equipment 'Cable').
import plateSpec from '../specs/cable_lateral_raise.mjs';
import { RED_FLAG, RED_FLAG_SHOULDER } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_SHOULDER };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'mo-cable-lat-raise': { cite: 'Cable Single-Arm Lateral Raise: Exercise Guide (Motra, formerly Train Fitness)', url: 'https://motra.com/exercises/cableSingleArmLateralRaise',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'sl-cable-lat-raise': { cite: 'How to Do Cable Lateral Raise: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/cable-lateral-raise/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'fv-cable-lat-raise': { cite: 'Cable Lateral Raise (Fitness Volt, Matthew Magnante)', url: 'https://fitnessvolt.com/cable-lateral-raise/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  larsen2025: { cite: 'Dumbbell versus cable lateral raises for lateral deltoid hypertrophy: an experimental study (Larsen et al., Front Physiol 16:1611468)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12277279/',
    kind: 'peer-reviewed', access: 'full', checked: '2026-10-22', use: 'DATA' },
  kolber2014: { cite: 'Characteristics of shoulder impingement in the recreational weight-training population (Kolber et al., J Strength Cond Res 28(4):1081-9)', url: 'https://pubmed.ncbi.nlm.nih.gov/24077379/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-22', use: 'DATA' },
  // golden B's `hold` archetype default (this card's parent) for the hand values the card leaves unsourced: a convention.
  'hold-default': { cite: 'Golden B hold archetype default (dumbbell_lateral_raise handling: thumb wrapped, contact mid-palm)', url: 'tools/plates/layers/exercises/dumbbell_lateral_raise.howto.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-05', use: 'CONVENTION' },
  // RED_FLAG_SHOULDER's own source (layers/howto/shared.mjs): the card's redFlags 'shoulder'.
  'nhs-shoulder-pain': { cite: 'NHS, Shoulder pain', url: 'https://www.nhs.uk/conditions/shoulder-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When shoulder pain needs a check.' },
};
// Not cited: c5 (handle in front or behind; the plate draws it in front), c22, c23, c24 (tempo, plate drawing data).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const MO = 'mo-cable-lat-raise', SL = 'sl-cable-lat-raise', FV = 'fv-cable-lat-raise';
const CL = {
  c1: C(['CONSENSUS'], [MO, SL, FV], 'c1'),
  c3: C(['CONSENSUS'], [MO, FV], 'c3'),
  c4: C(['CONSENSUS'], [MO], 'c4'),
  c7: C(['CONSENSUS'], [MO, SL], 'c7'),
  c9: C(['CONSENSUS'], [MO], 'c9'),
  c10: C(['CONSENSUS'], [MO], 'c10'),
  c12: C(['CONSENSUS'], [MO, FV], 'c12'),
  c14: C(['CONSENSUS'], [SL, MO], 'c14'),
  c19: C(['DATA'], ['kolber2014'], 'c19'),
  c20: C(['DATA', 'WEAK'], ['larsen2025'], 'c20'),
  c21: C(['CONSENSUS'], [MO], 'c21'),
  stand: C(['CONSENSUS'], [FV, SL, MO], 'c2, c12'),
  lead: C(['CONSENSUS'], [MO, FV], 'c6, c13'),
  above: C(['CONSENSUS', 'DATA'], ['kolber2014', MO, SL], 'c19, c7'),
  swing: C(['CONSENSUS'], [MO, FV, SL], 'c11, c14, c8'),
  top: C(['CONSENSUS', 'DATA'], [MO, SL, 'kolber2014'], 'c7, c9, c19'),
  grip: C(['CONSENSUS'], [FV, SL, MO], 'c2, c4'),
};

/* ------------------------------------------------------------------------------------------------ hand ---------- */
// GRIP: the thumb and contact DERIVED at import from golden B's hold default rows (this card's parent), copied here
// (tools/plates/layers/exercises/dumbbell_lateral_raise.howto.mjs:122 thumb.mode 'wrapped', :123 contact 'mid-palm'),
// pinned against the live file by the supervisor's test (Q-W2-2 form). A copied value that is not a known enum value
// throws, so a drift cannot ship silently.
const HOLD_DEFAULT = { thumb: 'wrapped', contact: 'mid-palm' };   // dumbbell_lateral_raise.howto.mjs:122-123
const THUMB = ['wrapped', 'thumbless', 'hook'].includes(HOLD_DEFAULT.thumb) ? HOLD_DEFAULT.thumb : undefined;
const CONTACT = ['heel', 'mid-palm', 'finger-base', 'palm-flat'].includes(HOLD_DEFAULT.contact) ? HOLD_DEFAULT.contact : undefined;
if (!THUMB || !CONTACT) throw new Error(`lib_cable_lateral_raise: hold default does not map: ${JSON.stringify(HOLD_DEFAULT)}`);
const CONV = C(['CONVENTION'], ['hold-default'], 'card grip.thumb, grip.handContact, grip.wrist: "Not given by any source read"; golden B\'s hold default from the card parent dumbbell_lateral_raise (Q-W6-3), not a card claim, never shown');

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: the start (arm hanging, cable tight; c3, c4), the end (upper arm level, elbow slightly
// bent and leading; c7, c9, c6, c13) and the spec's Mistake merged over the end, as the engine draws it (card
// plate.mistake c19, c7: the arm above shoulder height). The card zoom clr-top-height Wrong is that drawn fault (M).
// 'pulled' (card zoom clr-elbow-lead Wrong, c13: "Don't pull the handle up"): the end pose with the hand driving the
// handle up past the elbow: the working shoulder turned so the elbow's bend points the forearm straight up (PULL_ROT) and
// the elbow bending to pull (PULL_BEND), so the hand sits well above the elbow instead of trailing it (c6, c13).
// DRAWING VALUES (D-SHIP-DRAWVAL, #376 6614695581; precedent D-LIB7-2): PULL_ROT 90 deg turns the bend plane vertical;
// PULL_BEND 35 deg is the elbow bend of the pull (the forearm about 35 deg above level). No card gives either; c9's
// slight bend is the Right's cue and the card names no Wrong bend, so neither contradicts it. No number appears in user
// copy; the layers panel judges them (W6 panel L5: the lead read 8 deg, too small to see).
const END = plateSpec.poses.end, MIS = plateSpec.mistake.pose;
const PULL_ROT = 90, PULL_BEND = 35;
const PULLED = { shoulder: { ...END.shoulder, l: { ...END.shoulder.l, rot: PULL_ROT } }, elbow: { ...END.elbow, l: PULL_BEND } };
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  above: { pose: { ...END, ...MIS } },
  pulled: { pose: { ...END, ...PULLED } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card posture zoom except clr-cable-tight (D-SHIP-TEXTZOOM, above). Each is in the zoom shell's shape (callout
// with an anchor at the landmark it names, no guide mark; pilot-a.closeups.mjs).
const zooms = [
  {
    key: 'clr-top-height', chip: 'Top', heading: 'Top height', kind: 'posture',
    // zoom shell (render/closeup/crop.mjs): crop centre on the right pose's working elbow for both halves; the Wrong is
    // the spec's Mistake drawn alone (solid), as `stills.above`.
    crop: { center: { at: 'elbow.l', pose: 'right', off: [0, 0] }, sizePx: 170 },
    right: 'end',
    wrong: { base: 'end', pose: MIS, solid: true },
    callout: {
      right: { text: 'Shoulder height', anchor: 'elbow.l' },
      wrong: { text: 'Above shoulder', anchor: { at: 'elbow.l', pose: 'mistake' } },
    },
    caption: {
      right: 'Arm parallel with the floor, elbow slightly bent.',   // c7, c9
      wrong: 'Arm raised above shoulder height.',                    // c19
    },
    alt: {
      right: 'Front view, top of the raise. The upper arm is level with the shoulder, elbow slightly bent.',
      wrong: 'Front view. The arm rises past level, above shoulder height.',
    },
    feelRow: 'above',
  },
  {
    key: 'clr-elbow-lead', chip: 'Elbow', heading: 'Elbow lead', kind: 'posture',
    // zoom shell: crop centre on the right pose's working elbow. W6 panel L5: the Wrong is not solid: the Right arm is
    // drawn, the pulled arm dashed red over it, and a red drop arrow runs from the Right hand up to the pulled hand
    // (c13, the handle pulled up). The arrow offsets (plate px) are drawing values that keep it off the hand's outline.
    crop: { center: { at: 'elbow.l', pose: 'right', off: [10, -8] }, sizePx: 150 },
    right: 'end',
    wrong: { base: 'end', pose: PULLED },
    guides: [{ kind: 'drop', from: { at: 'grip.l', pose: 'right', off: [0, -6] }, to: { at: 'grip.l', pose: 'mistake', off: [0, 8] } }],
    callout: {
      right: { text: 'Elbow leads', anchor: 'elbow.l' },
      wrong: { text: 'Handle pulled up', anchor: { at: 'grip.l', pose: 'mistake' } },
    },
    caption: {
      right: 'Breathe out. Elbow leads, hand follows, out to the side.',   // c6, c13
      wrong: 'Handle pulled straight up.',                                 // c13
    },
    alt: {
      right: 'Front view, top of the raise. The elbow is higher than the hand, leading it out to the side.',
      wrong: 'Front view, top of the raise. The hand rises above the elbow, pulling the handle up.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'side_delts', plain: 'The side of the shoulder does the work.' }],
  secondary: [
    { muscleId: 'upper_traps', plain: 'The upper traps work second.' },
    { muscleId: 'front_delts', plain: 'The front of the shoulder helps steady the arm.' },
  ],
  watch: [{ muscleId: 'upper_traps', plain: 'Shrugging the shoulder makes the upper traps take over.' }],
  feelLine: 'You should feel this in the side of your shoulder.',
  rows: [
    // The card's first row (side of the shoulder) has no fix, so it is left out: the feel line says it (D-SHIP-Q16).
    { key: 'shrug', where: 'Top of the shoulder and neck', at: { muscles: ['upper_traps'] },
      means: 'You are shrugging the shoulder as the arm rises.',
      fix: 'Keep your shoulder down as the arm rises.',
      claim: CL.c10 },
    { key: 'above', where: 'Shoulder, arm above level', at: { muscles: ['side_delts'] },
      means: 'You are raising the arm above shoulder height.',
      fix: 'Stop when your arm is parallel with the floor.',
      zoom: 'clr-top-height', redFlag: 'shoulder', claim: CL.above },
    // The card row's means is empty, so the row has none (D-FEEL-NOMEANS).
    { key: 'sharp', where: 'Sharp pain in the shoulder', at: { muscles: ['side_delts'] },
      means: '',
      fix: 'Stop the set.',   // c21 (the row's claim)
      redFlag: 'shoulder', claim: CL.c21 },
  ],
  claim: C(['CONSENSUS', 'DATA'], [MO, SL, 'larsen2025'], 'c15, c16'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'above', title: 'Raising above shoulder height', zoom: 'clr-top-height', claim: CL.above,
    fix: 'Stop when your arm is parallel with the floor.' },
  // D-TEXT-GOLDEN: card posture c8 (breathe in, lower slowly) has no other visible slot, so it joins this fix.
  { key: 'swing', title: 'Swinging with momentum', claim: CL.swing,
    fix: 'Go lighter and lift without swinging. Breathe in, lower with control.' },
  { key: 'shrug', title: 'Shrugging the shoulder', claim: CL.c10,
    fix: 'Keep your shoulder down as the arm rises.' },
];
const RISKS = [
  { key: 'above', text: 'Raises above shoulder height are linked with signs of shoulder pinching.', claim: CL.c19 },
  { key: 'forward', text: 'Raising straight out to the side hurts? Raise a little forward.', claim: CL.c20 },
];

export default {
  schema: 1,
  id: 'lib_cable_lateral_raise',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'hold',
    why: 'D-SHIP-C3: card-no-zoom, the card has no hand zoom; the grip copy carries c2 and c4.',
    handle: 'd-handle',        // c1: a single handle (the spec's single handle)
    loadAxis: 'across',        // golden B's hold default (dumbbell_lateral_raise: no push lever check)
    overBody: false,
    width: { text: 'One arm, the outside hand, the one farther from the machine.', claim: CL.grip },
    thumb: { mode: THUMB, claim: CONV },   // CONVENTION: hold default, DERIVED above; the card gives no thumb
    contact: CONTACT,          // CONVENTION: hold default (source hold-default), DERIVED above; the card gives no contact
    // card grip.wrist: "Not given by any source read"; no printed text comes from the default (D-SHIP-CONVCOPY)
    wrist: { exempt: 'Card grip.wrist: not given by any source read; no wrist position or range is sourced.', claim: CONV },
    faults: [],
    gripLine: 'One single handle in your outside hand, the one farther from the machine.',   // c2
    cue: 'Elbow leads, stop at shoulder height.',   // c6, c13, c7
  },
  contacts: ['standing-feet'],
  setup: [
    { kind: 'adjust', text: 'Set the pulley at its lowest point with a single handle.', claim: CL.c1 },
    // D-TEXT-GOLDEN: card posture c12 (stay upright) is shown here with c2's step.
    { kind: 'position', text: 'Stand upright, side-on to the machine. Handle in your outside hand.', claim: CL.stand },
    { kind: 'position', text: 'Step away until the cable is tight.', claim: CL.c3 },
    { kind: 'brace', text: 'Let the arm hang down, elbow slightly bent. Brace your torso.', claim: CL.c4 },
    { kind: 'load', text: 'Pick a lighter weight than you think.', claim: CL.c14 },
  ],
  posture: [
    // D-SHIP-TEXTZOOM: the card zoom clr-cable-tight as a text checkpoint (its Wrong is null).
    { key: 'tight', label: 'Cable tight', detail: 'A step away, cable tight at the start.', anchor: { landmark: 'grip.l', pose: 'start' }, claim: CL.c3 },
    { key: 'lead', label: 'Elbow leads', detail: "Lead with the elbow. Don't pull the handle up.",
      anchor: { landmark: 'elbow.l', pose: 'end' }, zoom: 'clr-elbow-lead', claim: CL.lead },
    { key: 'height', label: 'Shoulder height', detail: 'Stop when your arm is parallel with the floor.',
      anchor: { landmark: 'elbow.l', pose: 'end' }, zoom: 'clr-top-height', claim: CL.c7 },
    { key: 'bend', label: 'Soft elbow', detail: "Keep the elbow slightly bent. Don't lock it.", anchor: { landmark: 'elbow.l', pose: 'start' }, claim: CL.c9 },
    { key: 'upright', label: 'Stay upright', detail: "Stay upright. Brace so you don't lean.", anchor: { landmark: 'sternum', pose: 'end' }, claim: CL.c12 },
  ],
  feel,
  zooms,
  chips: ['clr-top-height', 'clr-elbow-lead', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'Pulley at its lowest point, single handle. Stand side-on, a step away, cable tight.',
    mistakeLine: 'Stop when your arm is parallel with the floor. Keep the shoulder down.',
    cueLine: 'Elbow leads, stop at shoulder height.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['shoulder'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/cable_lateral_raise.json', rev: 1 },
};
