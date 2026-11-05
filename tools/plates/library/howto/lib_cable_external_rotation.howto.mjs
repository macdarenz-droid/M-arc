// LIB-SHIP W6: the How-to content of lib_cable_external_rotation (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/cable_external_rotation.json; its claim ids are named on each field's claim.
// No hand zoom (D-SHIP-C3, card-no-zoom): the card has no hand zoom, so the sheet has none; the id is on
// tools/plates/library/hands/no-zoom.json. Its hand claims (one single handle in the far hand, upper arm against the
// side, elbow at 90 degrees; c2, c3) live in handling and setup steps 2 and 3.
// GRIP (Q-W6-3, D-SHIP-W6-CONV): the card's grip.thumb, grip.handContact and grip.wrist read "Not given by any source
// read" (Q-W2-2 / Q-W6-7 form). The thumb is DERIVED from golden B's pull default (lat_pulldown and seated_cable_row
// handling: thumb wrapped) and the contact and wrist range from the pull key's convention pairs.mjs
// CONVENTIONS['ga:pull-base'], all cited CONVENTION, data only, never printed (D-SHIP-CONVCOPY). No orientation: the
// card names no palm direction (its notes: the plate's neutral D-handle grip is a drawing convention, LR-4).
// Feel (Q-W6-2, D-SHIP-W6-NOPRIMARY): feel.primary is [] exactly as the card has it; rotator_cuff is text-only in
// secondary (C2 NO_REGION, golden B's brachialis form on lat_pulldown) and rear_delts is drawn in secondary. No feel row
// names rotator_cuff in at.muscles (c2.ts:38); the card's rotator-cuff row has no fix, so it is left off the rows
// (D-SHIP-Q16) and the feel line says it.
// Zooms: `cer-elbow` is the plate's own Mistake (M; the plate draws the elbow flaring, c9); `cer-turn` is a drawing
// value (DV, below).
// Red flag: the card's redFlags (shoulder): the shared shoulder box, linked by the pain row.
// No variant line (equipment 'Cable').
import plateSpec from '../specs/cable_external_rotation.mjs';
import { RED_FLAG, RED_FLAG_SHOULDER } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_SHOULDER };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'mo-cable-er': { cite: 'Cable External Shoulder Rotation: Exercise Guide (Motra, formerly Train Fitness)', url: 'https://motra.com/exercises/cableExternalShoulderRotation',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'sl-cable-er': { cite: 'How to Do Cable External Shoulder Rotation: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/cable-external-shoulder-rotation/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'ace-cuff-er': { cite: 'Rotator Cuff External Rotation (ACE exercise library)', url: 'https://www.acefitness.org/resources/everyone/exercise-library/352/rotator-cuff-external-rotation/',
    kind: 'guideline', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'sl-cuff-article': { cite: 'Rotator Cuff Exercises and Workout (StrengthLog, Daniel Richter)', url: 'https://www.strengthlog.com/rotator-cuff-exercises-workout/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  // The pull key's own source for the hand contact and wrist range: a convention.
  'ga-pull-base': { cite: 'LIB-7 pull hand convention, pairs.mjs CONVENTIONS ga:pull-base: base of the fingers and top edge of the palm', url: 'tools/plates/library/hands/pairs.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-05', use: 'CONVENTION' },
  // golden B's pull archetype default for the thumb the card leaves unsourced: a convention.
  'pull-default': { cite: 'Golden B pull archetype default (lat_pulldown and seated_cable_row handling: thumb wrapped)', url: 'tools/plates/layers/exercises/lat_pulldown.howto.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-05', use: 'CONVENTION' },
  'nhs-shoulder-pain': { cite: 'NHS, Shoulder pain', url: 'https://www.nhs.uk/conditions/shoulder-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When shoulder pain needs a check.' },
};
// Not cited: c19 (tempo, plate only).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const MO = 'mo-cable-er', SL = 'sl-cable-er', ACE = 'ace-cuff-er';
const CL = {
  c1: C(['CONSENSUS'], [MO, SL, ACE], 'c1'),
  c2: C(['CONSENSUS'], [MO, SL, ACE], 'c2'),
  c3: C(['CONSENSUS'], [SL, MO, ACE], 'c3'),
  c8: C(['CONSENSUS'], [MO], 'c8'),
  c9: C(['CONSENSUS'], [MO, 'sl-cuff-article'], 'c9'),
  c10: C(['CONSENSUS'], [MO], 'c10'),
  c11: C(['CONSENSUS'], [MO], 'c11'),
  c13: C(['CONSENSUS'], [SL, MO], 'c13'),
  c17: C(['CONSENSUS'], [MO], 'c17'),
  arm: C(['CONSENSUS'], [SL, MO, ACE], 'c3, c4'),
  turn: C(['CONSENSUS'], [MO, SL, ACE], 'c5, c18, c7'),
  swing: C(['CONSENSUS'], [MO, SL], 'c12, c13'),
  zoomElbow: C(['CONSENSUS'], [SL, MO, 'sl-cuff-article'], 'c3, c9'),
  zoomTurn: C(['CONSENSUS'], [ACE, MO], 'c6, c8'),
};

/* ------------------------------------------------------------------------------------------------ hand ---------- */
// GRIP (Q-W6-3): the contact and wrist range DERIVED at import from the pull key's convention text, so they cannot
// drift from it. pairs.mjs:25 CONVENTIONS['ga:pull-base'] reads 'GA 3.1 pull: base of the fingers and top edge of the
// palm; extension 0 to 25'. HandContact names that zone 'finger-base' (src/howto/content-types.ts HandContact); a
// convention that names no mapped zone or range throws. pairs.mjs is not imported (its closure pulls howto-layers.mjs,
// which the MANIFEST closure cannot follow); the text is copied here and pinned against the live convention by a test.
const PULL_BASE = 'GA 3.1 pull: base of the fingers and top edge of the palm; extension 0 to 25';   // CONVENTIONS['ga:pull-base']
const CONTACT_OF_ZONE = { 'base of the fingers': 'finger-base' };   // convention zone words -> HandContact
const CONTACT = Object.entries(CONTACT_OF_ZONE).find(([zone]) => PULL_BASE.includes(zone))?.[1];
const EXT = PULL_BASE.match(/extension (\d+) to (\d+)/)?.slice(1).map(Number);
// The thumb DERIVED from golden B's pull rows (lat_pulldown.howto.mjs:174, seated_cable_row.howto.mjs:174: thumb.mode
// 'wrapped'), copied and pinned against the live files by a test; the two must agree, or this throws.
const PULL_THUMBS = { lat_pulldown: 'wrapped', seated_cable_row: 'wrapped' };
const THUMB = new Set(Object.values(PULL_THUMBS)).size === 1 ? Object.values(PULL_THUMBS)[0] : undefined;
if (!CONTACT || !EXT || !THUMB) throw new Error(`lib_cable_external_rotation: no mapped pull contact, range or one pull thumb default: ${PULL_BASE}`);
const CONV_THUMB = C(['CONVENTION'], ['pull-default'], 'card grip.thumb: not given by any source read; golden B\'s pull default, not a card claim, never shown');
// limitText is the card's own words (c3, c10); the ext range is the convention, never shown.
const WRIST = C(['CONSENSUS', 'CONVENTION'], [SL, MO, ACE, 'ga-pull-base'], 'c3, c10; card grip.wrist is not given: the ext range is pairs.mjs CONVENTIONS ga:pull-base, not a card number');

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: the end (forearm turned out, the hand just outside the body line, elbow at the side;
// c3, c6) and the spec's Mistake pose merged over it, as the engine draws it (card plate.mistake c9: the working
// shoulder abducts and the elbow leaves the side). The card zoom `cer-elbow` Wrong is that drawn fault, so no new pose.
// 'twist' (card zoom `cer-turn` Wrong, c8: "Torso twisting to move the handle"): the end pose with the trunk turned
// TWIST deg (trunk.yaw, the engine's trunk rotation; russian_twist.mjs's form), the working shoulder going back, so the
// torso carries the handle out (landmarksOf: grip.l 16.6 px further out, sternum 9.6 px across, shoulder.l 8.2 cm back).
// DRAWING VALUES (D-SHIP-DRAWVAL, #376 6614695581; precedent D-LIB7-2 and lib_plank's SAG 20 deg): TWIST 20 deg is a
// Wrong-pose size no card gives; no number from it appears in user copy; the layers panel judges it.
const TWIST = 20, END = plateSpec.poses.end, MIS = plateSpec.mistake.pose;
const TWISTED = { trunk: { flex: 0, yaw: TWIST } };
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  flare: { pose: { ...END, ...MIS } },
  twist: { pose: { ...END, ...TWISTED } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom (the card has no hand zoom). Zoom shell form (render/closeup/crop.mjs): callouts anchored at the
// landmark they name, no guide mark; the Wrong is drawn alone (solid).
const zooms = [
  {
    key: 'cer-elbow', chip: 'Elbow', heading: 'Elbow at side', kind: 'posture',   // card zoom key: cer-elbow
    crop: { center: { at: 'elbow.l', pose: 'right', off: [0, 0] }, sizePx: 170 },
    right: 'end',
    wrong: { base: 'end', pose: MIS, solid: true },
    callout: {
      right: { text: 'At your side', anchor: 'elbow.l' },
      wrong: { text: 'Drifts out', anchor: 'elbow.l' },
    },
    caption: {
      right: 'Upper arm against your side, elbow bent 90 degrees.',
      wrong: 'Elbow drifting out, away from the side.',
    },
    alt: {
      right: 'Front view, end of the turn. The upper arm hangs against the side and the forearm points out, level.',
      wrong: 'Front view. The upper arm has lifted away from the side, the elbow out from the body.',
    },
  },
  {
    key: 'cer-turn', chip: 'Torso', heading: 'Torso still', kind: 'posture',   // card zoom key: cer-turn
    crop: { center: { at: 'chest', pose: 'right', off: [20, 0] }, sizePx: 200 },
    right: 'end',
    wrong: { base: 'end', pose: TWISTED, solid: true },
    callout: {
      right: { text: 'Torso still', anchor: 'chest' },
      wrong: { text: 'Torso twists', anchor: 'chest' },
    },
    caption: {
      right: 'Hand turned out past the body, torso still.',
      wrong: 'Torso twisting to move the handle.',
    },
    alt: {
      right: 'Front view, end of the turn. The hand is just outside the body line. The chest faces forward.',
      wrong: 'Front view. The torso has turned, carrying the handle out with it.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [],   // the card's feel.primary is empty (Q-W6-2): no drawable muscle is sourced as the main mover
  secondary: [
    { muscleId: 'rotator_cuff', plain: 'The rotator cuff turns the arm out.' },   // text only (C2 NO_REGION)
    { muscleId: 'rear_delts', plain: 'The rear delts help.' },
  ],
  watch: [],
  // The card's first row (back of the shoulder, c14, c15) has no fix, so it is left off the rows (D-SHIP-Q16).
  feelLine: 'You should feel this at the back of your shoulder.',
  rows: [
    { key: 'shrug', where: 'Top of the shoulder and neck', at: { muscles: ['upper_traps'] },
      means: 'Fault: shrugging the shoulder.',
      fix: "Keep your shoulder down. Don't shrug.",
      claim: CL.c11 },
    { key: 'pain', where: 'Shoulder pain', at: {},   // pain, not a muscle taking over: no map mark (golden B)
      means: '',   // the card's row has no means; D-FEEL-NOMEANS prints no label
      fix: 'Stop the set.',
      redFlag: 'shoulder', claim: CL.c17 },
  ],
  claim: C(['CONSENSUS', 'WEAK'], [SL, MO, 'sl-cuff-article'], 'c14, c15 (rotator cuff, feel line), c16 (rear delts, WEAK)'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'swing', title: 'Swinging with momentum', claim: CL.swing,
    fix: 'Go very light and turn with full control.' },
  { key: 'flare', title: 'Elbow flaring out', zoom: 'cer-elbow', claim: CL.c9,
    fix: 'Keep your elbow against your side.' },
  { key: 'twist', title: 'Twisting the torso', zoom: 'cer-turn', claim: CL.c8,
    fix: 'Keep your torso still. Turn from the shoulder only.' },
];
const RISKS = [
  { key: 'light', text: 'Use only a very light weight. Keep strict form to avoid strain.', claim: CL.c13 },
];

export default {
  schema: 1,
  id: 'lib_cable_external_rotation',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'pull',
    why: 'D-SHIP-C3: card-no-zoom, the card has no hand zoom; the grip copy carries c2 and c3.',
    handle: 'd-handle',        // card grip.type: one single handle (c1, c2)
    width: { text: 'One arm. Upper arm against your side.', claim: CL.c3 },
    thumb: { mode: THUMB, claim: CONV_THUMB },   // CONVENTION: golden B's pull default, derived above
    contact: CONTACT,          // 'finger-base', DERIVED from pairs.mjs CONVENTIONS ga:pull-base (CONVENTION, above)
    wrist: { ext: EXT, limitText: 'Elbow bent 90 degrees, forearm parallel to the floor.', claim: WRIST },   // ext DERIVED, data only
    faults: [],                // the card names no hand fault
    gripLine: 'Hold one single handle in your far hand.',   // c2
    cue: 'Elbow at your side. Turn only.',   // c3, c8
  },
  contacts: ['standing-feet'],   // the card's archetype.contact
  setup: [
    { kind: 'adjust', text: 'Set the pulley at elbow height with a single handle.', claim: CL.c1 },
    { kind: 'position', text: 'Stand side-on to the machine. Hold the handle in your far hand.', claim: CL.c2 },
    // D-TEXT-GOLDEN: card setup step 4 (c4) joined to step 3
    { kind: 'grip', text: 'Upper arm at your side, elbow 90 degrees, forearm across your body.', claim: CL.arm },
    { kind: 'load', text: 'Pick a very light weight.', claim: CL.c13 },
    // D-TEXT-GOLDEN: posture out, pause and return (c5, c18, c7)
    { kind: 'brace', text: 'Breathe out, turn out, pause one second. Breathe in, return slowly.', claim: CL.turn },
  ],
  posture: [
    { key: 'still', label: 'Torso still', detail: 'Brace and keep your torso still. Turn from the shoulder only.',
      anchor: { at: 'chest', pose: 'end' }, zoom: 'cer-turn', claim: CL.c8 },
    { key: 'out', label: 'Turn out', detail: 'Breathe out and turn the handle out, away from your body.',
      anchor: { at: 'grip.l', pose: 'end' }, claim: C(['CONSENSUS'], [MO, SL], 'c5') },
    { key: 'elbow', label: 'Elbow at side', detail: 'Keep your elbow against your side the whole rep.',
      anchor: { at: 'elbow.l', pose: 'end' }, zoom: 'cer-elbow', claim: C(['CONSENSUS'], [MO, SL, 'sl-cuff-article'], 'c9, c5') },
    { key: 'level', label: 'Forearm level', detail: 'Keep your forearm parallel to the floor.', anchor: { at: 'wrist.l', pose: 'end' }, claim: CL.c10 },
    { key: 'pause', label: 'Pause', detail: 'Pause for one second at the end of the turn.', anchor: { at: 'grip.l', pose: 'end' }, claim: C(['CONSENSUS'], [ACE, MO], 'c18') },
    { key: 'return', label: 'Slow return', detail: 'Breathe in and slowly return the handle across your body.',
      anchor: { at: 'grip.l', pose: 'start' }, claim: C(['CONSENSUS'], [MO, SL], 'c7') },
  ],
  feel,
  zooms,
  chips: ['cer-elbow', 'cer-turn', 'feel'],   // the zoom shell's chip row: the zoom keys, then feel
  copy: {
    setupLine: 'Stand side-on to the pulley. Upper arm against your side, elbow at 90 degrees.',
    mistakeLine: 'Keep your elbow against your side. Turn from the shoulder only.',
    cueLine: 'Elbow at your side. Turn only.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['shoulder'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/cable_external_rotation.json', rev: 1 },
};
