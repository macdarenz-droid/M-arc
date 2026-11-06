// LIB-SHIP W6: the How-to content of lib_face_pull (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/face_pull.json; its claim ids are named on each field's claim.
// No hand zoom (D-SHIP-HANDW6, Q-W6-11, #393 6647923934): the card's hand zoom `fp-grip` (c2; Wrong null) is not drawn:
// the rope key's GAPS reason (hands/hand-rope.mjs:33, "no research card") is stale, and the card refuses rope-rule c1,
// so no sourced contact exists for a pose; the id is on tools/plates/library/hands/no-zoom.json. Its claim (hands on the
// rope ends, palms facing each other; c2) lives in setup step 2 (D-TEXT-GOLDEN, Q-W6-11) and handling.gripLine.
// GRIP (Q-W6-11): the card's grip.thumb and grip.wrist read "(pull archetype default)". The thumb is DERIVED from golden
// B's pull default (lat_pulldown and seated_cable_row handling: thumb wrapped), and the contact from the pull key's
// convention pairs.mjs CONVENTIONS['ga:pull-base'], both cited CONVENTION, data only, never printed
// (D-SHIP-CONVCOPY). The card's grip.handContact ("hands on the ends of the rope", c2) names no zone on the hand; c2's
// words stay in copy and the zone is the convention's.
// The wrist is exempt (D-SHIP-W6-WRISTEXEMPT, #393 6648157060): no range, nothing printed.
// Zooms: `fp-elbows` is the plate's own Mistake (M); `fp-height` is a drawing value (DV, below).
// Red flag: the card's redFlags (shoulder): the shared shoulder box, linked by the pinch and pain rows.
// No variant line (equipment 'Cable').
import plateSpec from '../specs/face_pull.mjs';
import { RED_FLAG, RED_FLAG_SHOULDER } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_SHOULDER };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'mo-face-pull': { cite: 'Cable Face Pull - Exercise Guide (Motra, formerly Train Fitness)', url: 'https://motra.com/exercises/cableFacePull',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'bb-face-pull': { cite: 'How to Do Face Pulls: Benefits & Variations (BarBend)', url: 'https://barbend.com/face-pulls/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'sl-face-pull': { cite: 'How to Do Face Pull: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/face-pull/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'zhu-2025': { cite: 'Biomechanical evaluation of posterior deltoid exercises and kinematic trajectory modeling', url: 'https://pubmed.ncbi.nlm.nih.gov/41964926/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-22', use: 'DATA' },
  // The pull key's own source for the hand contact: a convention.
  'ga-pull-base': { cite: 'LIB-7 pull hand convention, pairs.mjs CONVENTIONS ga:pull-base: base of the fingers and top edge of the palm', url: 'tools/plates/library/hands/pairs.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-05', use: 'CONVENTION' },
  // golden B's pull archetype default for the thumb the card delegates: a convention.
  'pull-default': { cite: 'Golden B pull archetype default (lat_pulldown and seated_cable_row handling: thumb wrapped)', url: 'tools/plates/layers/exercises/lat_pulldown.howto.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-05', use: 'CONVENTION' },
  'nhs-shoulder-pain': { cite: 'NHS, Shoulder pain', url: 'https://www.nhs.uk/conditions/shoulder-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When shoulder pain needs a check.' },
};
// Not cited: c7, c8, c16, c17 (plate only: end pose, return, tempo).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const MO = 'mo-face-pull', BB = 'bb-face-pull', SL = 'sl-face-pull';
const CL = {
  c1: C(['CONSENSUS'], [MO, BB, SL], 'c1'),
  c2: C(['CONSENSUS'], [MO, BB, SL], 'c2'),
  c3: C(['CONSENSUS'], [SL, MO], 'c3'),
  c9: C(['CONSENSUS'], [MO, BB], 'c9'),
  c10: C(['CONSENSUS'], [SL, MO], 'c10'),
  c13: C(['CONSENSUS'], [MO, BB], 'c13'),
  step: C(['CONSENSUS'], [MO, SL], 'c2, c3'),
  chest: C(['CONSENSUS'], [MO, SL], 'c4, c12'),
  zoom: C(['CONSENSUS'], [MO, SL], 'c5, c10'),
  momentum: C(['CONSENSUS'], [MO, SL, BB], 'c11, c4'),
};

/* ------------------------------------------------------------------------------------------------ hand ---------- */
// GRIP (Q-W6-11): the contact DERIVED at import from the pull key's convention text, so it cannot
// drift from it. pairs.mjs:25 CONVENTIONS['ga:pull-base'] reads 'GA 3.1 pull: base of the fingers and top edge of the
// palm; extension 0 to 25'. HandContact names that zone 'finger-base' (src/howto/content-types.ts HandContact); a
// convention that names no mapped zone throws. pairs.mjs is not imported (its closure pulls howto-layers.mjs,
// which the MANIFEST closure cannot follow); the text is copied here and pinned against the live convention by a test.
const PULL_BASE = 'GA 3.1 pull: base of the fingers and top edge of the palm; extension 0 to 25';   // CONVENTIONS['ga:pull-base']
const CONTACT_OF_ZONE = { 'base of the fingers': 'finger-base' };   // convention zone words -> HandContact
const CONTACT = Object.entries(CONTACT_OF_ZONE).find(([zone]) => PULL_BASE.includes(zone))?.[1];
// The thumb DERIVED from golden B's pull rows (lat_pulldown.howto.mjs:174, seated_cable_row.howto.mjs:174: thumb.mode
// 'wrapped'), copied and pinned against the live files by a test; the two must agree, or this throws.
const PULL_THUMBS = { lat_pulldown: 'wrapped', seated_cable_row: 'wrapped' };
const THUMB = new Set(Object.values(PULL_THUMBS)).size === 1 ? Object.values(PULL_THUMBS)[0] : undefined;
if (!CONTACT || !THUMB) throw new Error(`lib_face_pull: no mapped pull contact or one pull thumb default: ${PULL_BASE}`);
const CONV_THUMB = C(['CONVENTION'], ['pull-default'], 'card grip.thumb: the pull archetype default, no face-pull source; golden B\'s pull default, not a card claim, never shown');
// D-SHIP-W6-WRISTEXEMPT (#393 6648157060): the card delegates grip.wrist; no range is taken and nothing is printed.
const CONV_WRIST = C(['CONVENTION'], ['pull-default'], 'card grip.wrist: pull archetype default only; no source gives a wrist range, so none is taken and nothing is shown (D-SHIP-W6-WRISTEXEMPT)');

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: the end (rope at the face, hands by the ears, elbows high and out; c5, c7, c9) and
// the spec's Mistake pose merged over it, as the engine draws it (card plate.mistake c9, c10: the elbows drop below
// shoulder height and the hands come down toward the chin). The card zoom `fp-elbows` Wrong is that drawn fault.
// 'low' (card zoom `fp-height` Wrong, c10: "Rope pulled low, to the chin"): the Mistake's own hand targets (by the
// chin) with the end pose's own elbow poles (straight out to the side), so the rope comes low while the elbows stay
// up (landmarksOf: elbow.r 12.4 cm above shoulder.r against the end's 18.8 cm and the Mistake's -15.0 cm; the grip
// 14.8 px lower than the end on the plate).
// DRAWING VALUES (D-SHIP-DRAWVAL, #376 6614695581; precedent D-LIB7-2): 'low' takes no new number, only the plate's
// own Mistake hand targets and end poles; no number appears in user copy; the layers panel judges it.
const END = plateSpec.poses.end, MIS = plateSpec.mistake.pose;
const LOW = { reach: { r: { at: MIS.reach.r.at, pole: END.reach.r.pole }, l: { at: MIS.reach.l.at, pole: END.reach.l.pole } } };
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  drop: { pose: { ...END, ...MIS } },
  low: { pose: { ...END, ...LOW } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom except the hand zoom `fp-grip` (D-SHIP-HANDW6, header). Zoom shell form (render/closeup/crop.mjs):
// callouts anchored at the landmark they name, no guide mark; the Wrong is drawn alone (solid).
const zooms = [
  {
    key: 'fp-elbows', chip: 'Elbows', heading: 'Elbow height', kind: 'posture',   // card zoom key: fp-elbows
    crop: { center: { at: 'elbow.r', pose: 'right', off: [0, 10] }, sizePx: 170 },
    right: 'end',
    wrong: { base: 'end', pose: MIS, solid: true },
    callout: {
      right: { text: 'Elbows high', anchor: 'elbow.r' },
      wrong: { text: 'Elbows drop', anchor: 'elbow.r' },
    },
    caption: {
      right: 'Elbows high and wide, rope to the face.',
      wrong: 'Elbows below shoulder height.',
    },
    alt: {
      right: 'Side view, end of the pull. Hands by the ears, elbows high, at least level with the shoulders.',   // c5, c7, c9
      wrong: 'Side view. The elbows have dropped below the shoulders and the hands are down at the chin.',
    },
    feelRow: 'pinch',
  },
  {
    key: 'fp-height', chip: 'Rope height', heading: 'Rope height', kind: 'posture',   // card zoom key: fp-height
    crop: { center: { at: 'grip.r', pose: 'right', off: [0, 10] }, sizePx: 150 },
    right: 'end',
    wrong: { base: 'end', pose: LOW, solid: true },
    callout: {
      right: { text: 'Eye level', anchor: 'grip.r' },
      wrong: { text: 'To the chin', anchor: 'grip.r' },
    },
    caption: {
      right: 'Rope pulled toward the face at eye level.',
      wrong: 'Rope pulled low, to the chin.',
    },
    alt: {
      right: 'Side view, end of the pull. The rope reaches the face with the hands at eye level.',
      wrong: 'Side view. The rope comes down to the chin, the hands below eye level.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'rear_delts', plain: 'The rear delts, at the backs of the shoulders, do the work.' }],
  secondary: [
    { muscleId: 'mid_back', plain: 'The muscles between the shoulder blades help.' },
    { muscleId: 'rotator_cuff', plain: 'The rotator cuff also works.' },   // text only (C2 NO_REGION)
  ],
  watch: [],
  // The card's first two rows (backs of the shoulders, c14; between the shoulder blades, c14, c6) have no fix, so they
  // are left off the rows (D-SHIP-Q16); the feel line says them.
  feelLine: 'You should feel this in the backs of your shoulders and between your shoulder blades.',
  rows: [
    { key: 'pinch', where: 'Pinching in the shoulder', at: {},   // pain, not a muscle taking over: no map mark (golden B)
      means: 'The elbows are dropping.',
      fix: 'Keep your elbows high.',
      zoom: 'fp-elbows', redFlag: 'shoulder', claim: CL.c9 },
    { key: 'pain', where: 'Shoulder pain', at: {},
      means: '',   // the card's row has no means; D-FEEL-NOMEANS prints no label
      fix: 'Stop the set.',   // c13 (the row's claim)
      redFlag: 'shoulder', claim: CL.c13 },
  ],
  claim: C(['CONSENSUS', 'DATA', 'WEAK'], [MO, SL, BB, 'zhu-2025'], 'c14, c15 (primary), c14 (secondary), c6 (feel line)'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'drop', title: 'Dropping the elbows', zoom: 'fp-elbows', claim: CL.c9,
    fix: 'Keep your elbows high.' },
  { key: 'low', title: 'Pulling too low', zoom: 'fp-height', claim: CL.c10,
    fix: 'Pull toward your face, not your chest or chin.' },
  { key: 'momentum', title: 'Momentum from the torso', claim: CL.momentum,
    fix: 'Start light and keep your whole body still.' },   // c11, c4 (CL.momentum)
];
const RISKS = [
  { key: 'pinch', text: 'Dropped elbows can pinch the shoulder.', claim: CL.c9 },
  { key: 'pain', text: 'Shoulder pain means stop.', claim: CL.c13 },
];

export default {
  schema: 1,
  id: 'lib_face_pull',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'pull',
    why: 'D-SHIP-C3 no-zoom list, D-SHIP-HANDW6: the rope key\'s GAPS reason is stale and the card refuses rope-rule c1 (no sourced contact); the grip copy carries c2.',
    orientation: 'neutral',    // card grip.type: palms facing each other (Motra, c2)
    handle: 'rope',            // card grip.type: a rope, one hand on each end (c2)
    width: { text: 'Set by the rope. The ends separate as you pull.', claim: C(['CONSENSUS'], [MO, BB, SL], 'c6, c7') },
    thumb: { mode: THUMB, claim: CONV_THUMB },   // CONVENTION: golden B's pull default, derived above
    contact: CONTACT,          // 'finger-base', DERIVED from pairs.mjs CONVENTIONS ga:pull-base (CONVENTION, above)
    wrist: { exempt: 'Card grip.wrist: pull archetype default only; no source gives a wrist range for this exercise.', claim: CONV_WRIST },   // D-SHIP-W6-WRISTEXEMPT
    faults: [],                // the card's hand zoom has no Wrong
    // D-TEXT-GOLDEN: posture apart and squeeze (c6), moved here from the wrist limitText (D-SHIP-W6-WRISTEXEMPT)
    gripLine: 'Hands on the ends of the rope, palms facing each other. Pull the ends apart and squeeze your shoulder blades.',   // c2, c6
    cue: 'Elbows high, rope to your face.',   // c5, c9
  },
  contacts: ['standing-feet'],   // the card's archetype.contact
  setup: [
    { kind: 'adjust', text: 'Attach a rope to the cable at about head height.', claim: CL.c1 },
    // Q-W6-11, D-TEXT-GOLDEN: c2's words (hands on the rope ends) in setup copy
    { kind: 'grip', text: 'Hands on the ends of the rope, palms facing each other.', claim: CL.c2 },
    { kind: 'position', text: 'Step back until your arms are straight, with tension.', claim: CL.step },
    { kind: 'position', text: 'Stand up straight, feet hip-width apart.', claim: CL.c3 },
    // D-TEXT-GOLDEN: posture spine (c12)
    { kind: 'brace', text: 'Lift your chest, shoulders back. Neutral spine, no arching.', claim: CL.chest },
  ],
  posture: [
    { key: 'elbows', label: 'Elbows high', detail: 'Keep your elbows high and wide.',
      anchor: { at: 'elbow.r', pose: 'end' }, zoom: 'fp-elbows', claim: C(['CONSENSUS'], [MO, SL, BB], 'c5, c9') },
    // W6 K2: the plate callout `face` cue adds 'not the chin' (c10), so this key cites c5 and c10, as the card's plate
    // checkpoint 'Rope to face' does.
    { key: 'face', label: 'Rope to face', detail: 'Pull toward your face at eye level.',
      anchor: { at: 'grip.r', pose: 'end' }, zoom: 'fp-height', claim: CL.zoom },
    { key: 'apart', label: 'Ends apart', detail: 'Pull the rope ends apart as you pull.', anchor: { at: 'grip.r', pose: 'end' }, claim: C(['CONSENSUS'], [MO, BB, SL], 'c6') },
    { key: 'squeeze', label: 'Blades together', detail: 'Squeeze the shoulder blades together.', anchor: { at: 'backUpper', pose: 'end' }, claim: C(['CONSENSUS'], [MO, BB, SL], 'c6') },
    { key: 'still', label: 'Body still', detail: 'Keep your whole body still.', anchor: { at: 'chest', pose: 'end' }, claim: C(['CONSENSUS'], [MO, SL], 'c4') },
    { key: 'spine', label: 'Neutral spine', detail: 'Neutral spine, no arching.', anchor: { at: 'backMid', pose: 'end' }, claim: C(['CONSENSUS'], [MO], 'c12') },
  ],
  feel,
  zooms,
  chips: ['fp-elbows', 'fp-height', 'feel'],   // the zoom shell's chip row: the zoom keys, then feel
  copy: {
    setupLine: 'Attach a rope at about head height. Hold the ends, palms facing each other.',
    mistakeLine: 'Keep your elbows high. Never let them drop below your shoulders.',
    cueLine: 'Elbows high, rope to your face.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['shoulder'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/face_pull.json', rev: 1 },
};
