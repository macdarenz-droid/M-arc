// LIB-SHIP W3: the How-to content of lib_chest_supported_row (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/chest_supported_row.json; its claim ids are named on each field's claim.
// No hand zoom (D-SHIP-C3, card-no-zoom): the card has no hand zoom, so the sheet has none; the id is on
// tools/plates/library/hands/no-zoom.json. Its hand claims (handles as the machine has them, elbows close; wrists in
// line with the forearms all set; c4, c3) live in handling, setup step 4 and posture `wrists`.
// GRIP (c) (Q-W3-4, #383 6630932862): the card's grip.thumb and grip.handContact are the GA pull archetype defaults with
// no exercise-specific source. Contact is DERIVED from the pull key's convention pairs.mjs CONVENTIONS['ga:pull-base']
// and the thumb from golden B's pull default (lat_pulldown and seated_cable_row handling: thumb wrapped), both cited
// CONVENTION (Q-W2-2 / cable_fly form), never shown as a claim of this card. The wrist is the card's own c3.
// Red flags: the card's redFlags (back): LIB-5's back box (tools/plates/library/shared/back-box.mjs), linked by the
// low-back row's redFlag: 'back'.
// No variant line (equipment 'Machine').
import plateSpec from '../specs/chest_supported_row.mjs';
import { RED_FLAG } from '../../layers/howto/shared.mjs';
export { RED_FLAG };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'ace-row-machine': { cite: 'Seated Row (ACE exercise library; row machine with chest pad)', url: 'https://www.acefitness.org/resources/everyone/exercise-library/168/seated-row/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  lehman2004: { cite: 'Variations in muscle activation levels during traditional latissimus dorsi weight training exercises: An experimental study', url: 'https://pubmed.ncbi.nlm.nih.gov/15228624/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  fischer2025: { cite: 'Impact of different ranges of motion in the prone barbell row on muscle excitation', url: 'https://pubmed.ncbi.nlm.nih.gov/40513198/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  fenwick2009: { cite: 'Comparison of different rowing exercises: trunk muscle activation and lumbar spine motion, load, and stiffness', url: 'https://pubmed.ncbi.nlm.nih.gov/19620925/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  saeterbakken2015: { cite: 'The Effect of Performing Bi- and Unilateral Row Exercises on Core Muscle Activation', url: 'https://pubmed.ncbi.nlm.nih.gov/26134664/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  acsm2009: { cite: 'American College of Sports Medicine position stand. Progression models in resistance training for healthy adults', url: 'https://pubmed.ncbi.nlm.nih.gov/19204579/',
    kind: 'guideline', access: 'abstract', checked: '2026-10-17', use: 'CONSENSUS' },
  // The pull key's own source for the hand contact (the card's grip.handContact is the archetype default): a convention.
  'ga-pull-base': { cite: 'LIB-7 pull hand convention, pairs.mjs CONVENTIONS ga:pull-base: base of the fingers and top edge of the palm', url: 'tools/plates/library/hands/pairs.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-04', use: 'CONVENTION' },
  // golden B's pull archetype default for the thumb the card leaves unsourced: a convention.
  'pull-default': { cite: 'Golden B pull archetype default (lat_pulldown and seated_cable_row handling: thumb wrapped)', url: 'tools/plates/layers/exercises/seated_cable_row.howto.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-04', use: 'CONVENTION' },
  // The back box's own source (shared/back-box.mjs boxClaim), as lib_barbell_row lists it: the card's redFlags 'back'.
  'nhs-back': { cite: 'NHS, Back pain', url: 'https://www.nhs.uk/conditions/back-pain/',
    kind: 'guideline', access: 'full', checked: '2026-10-02', use: 'CONSENSUS', note: 'When back pain needs a check.' },
};
// Not cited: ace-high-row (c8, the wide-elbow variant, not drawn); c12 (tempo, plate only).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const ACE = 'ace-row-machine';
const CL = {
  c1: C(['CONSENSUS'], [ACE], 'c1'),
  c2: C(['CONSENSUS'], [ACE], 'c2'),
  c3: C(['CONSENSUS'], [ACE], 'c3'),
  c4: C(['CONSENSUS'], [ACE], 'c4'),
  c5: C(['CONSENSUS'], [ACE], 'c5'),
  c6: C(['CONSENSUS'], [ACE], 'c6'),
  c7: C(['CONSENSUS'], [ACE], 'c7'),
  c11: C(['DATA', 'WEAK'], ['fenwick2009', 'saeterbakken2015'], 'c11'),
  c13: C(['CONSENSUS'], ['acsm2009'], 'c13'),
  lean: C(['CONSENSUS'], [ACE], 'c6, c4'),
};

/* ------------------------------------------------------------------------------------------------ hand ---------- */
// GRIP (c), Q-W3-4: the contact DERIVED at import from the pull key's convention text, so it cannot drift from it.
// pairs.mjs CONVENTIONS['ga:pull-base'] reads 'GA 3.1 pull: base of the fingers and top edge of the palm; extension 0 to
// 25'. HandContact names that zone 'finger-base' (src/howto/content-types.ts HandContact); a convention that names no
// mapped zone throws. pairs.mjs is not imported (its closure pulls howto-layers.mjs, which the MANIFEST closure cannot
// follow); the text is copied here and pinned against the live convention by a test (lib_triceps_pushdown's form).
const PULL_BASE = 'GA 3.1 pull: base of the fingers and top edge of the palm; extension 0 to 25';   // CONVENTIONS['ga:pull-base']
const CONTACT_OF_ZONE = { 'base of the fingers': 'finger-base' };   // convention zone words -> HandContact
const CONTACT = Object.entries(CONTACT_OF_ZONE).find(([zone]) => PULL_BASE.includes(zone))?.[1];
// The thumb DERIVED from golden B's pull rows (lat_pulldown.howto.mjs:174, seated_cable_row.howto.mjs:174: thumb.mode
// 'wrapped'), copied and pinned against the live files by a test; the two must agree, or this throws.
const PULL_THUMBS = { lat_pulldown: 'wrapped', seated_cable_row: 'wrapped' };
const THUMB = new Set(Object.values(PULL_THUMBS)).size === 1 ? Object.values(PULL_THUMBS)[0] : undefined;
if (!CONTACT || !THUMB) throw new Error(`lib_chest_supported_row: no mapped pull contact or one pull thumb default: ${PULL_BASE}`);
const CONV_CONTACT = C(['CONVENTION'], ['ga-pull-base'], 'pairs.mjs CONVENTIONS ga:pull-base (the card\'s grip.handContact is the archetype default)');
const CONV_THUMB = C(['CONVENTION'], ['pull-default'], 'card grip.thumb: the pull archetype default, no exercise-specific source; golden B\'s pull default, not a card claim, never shown');

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: the end (chest on the pad, elbows just behind the body; c4, c5) and the spec's
// Mistake pose merged over it, as the engine draws it (card plate.mistake c6: the trunk leans back off the pad and the
// low back arches). The card zoom `chest pad` Wrong is that drawn fault, so no new pose is made.
// 'short' (card zoom `elbow finish` Wrong, c5: "Elbows stopping in front of the body"): the spec's own middle via key
// (t = 1/2 of the pull, specs/chest_supported_row.mjs `via`), where the elbow is still in front of the body
// (landmarksOf: elbow.r z 0.127 m against shoulder.r z 0.039 m; the end pose has it at -0.165 m, behind).
// DRAWING VALUES (D-SHIP-DRAWVAL, #376 6614695581; precedent D-LIB7-2 and golden B's machine_chest_press seatDrop): the
// stop point is the plate's own half-way key; no card gives where the short pull stops, no number appears in user copy;
// the layers panel judges it.
const MIS = plateSpec.mistake.pose, SHORT = plateSpec.poses.via[1];
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: plateSpec.poses.end },
  lean: { pose: { ...plateSpec.poses.end, ...MIS } },
  short: { pose: SHORT },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom (the card has no hand zoom). Zoom shell form (render/closeup/crop.mjs): callouts anchored at the
// landmark they name, no guide mark; the Wrong is drawn alone (solid).
const zooms = [
  {
    key: 'chest-pad', chip: 'Chest pad', heading: 'Chest on pad', kind: 'posture',   // card zoom key: chest pad
    crop: { center: { at: 'chest', pose: 'right', off: [-10, 10] }, sizePx: 170 },
    right: 'end',
    wrong: { base: 'end', pose: MIS, solid: true },
    callout: {
      right: { text: 'Chest on pad', anchor: 'chest' },
      wrong: { text: 'Leaning back', anchor: 'chest' },
    },
    caption: {
      right: 'Chest lightly on the pad, trunk upright.',
      wrong: 'Chest off the pad, trunk leaning back, lower back arched.',
    },
    alt: {
      right: 'Side view, end of the pull. The chest rests on the upright pad. The trunk is vertical.',
      wrong: 'Side view. The trunk leans back and the chest leaves the pad. The lower back arches.',
    },
    feelRow: 'low-back',
  },
  {
    key: 'elbow-finish', chip: 'Elbows', heading: 'Elbow finish', kind: 'posture',   // card zoom key: elbow finish
    crop: { center: { at: 'elbow.r', pose: 'right', off: [10, 0] }, sizePx: 170 },
    right: 'end',
    wrong: { base: 'end', pose: SHORT, solid: true },
    callout: {
      right: { text: 'Just behind you', anchor: 'elbow.r' },
      wrong: { text: 'Stops in front', anchor: 'elbow.r' },
    },
    caption: {
      // D-TEXT-GOLDEN (#379 6637607604): posture 'finish' (c5: short pause) is shown in this caption.
      right: 'Elbows just behind the body, then a short pause.',
      wrong: 'Elbows stopping in front of the body.',
    },
    alt: {
      right: 'Side view, end of the pull. The elbow is close to the ribs, just behind the body.',
      wrong: 'Side view. The pull stops early. The elbow is still in front of the body.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'mid_back', plain: 'The middle of your back, between the shoulder blades, works most.' }],
  secondary: [
    { muscleId: 'lats', plain: 'The lats, at the sides of your back, help.' },
    { muscleId: 'rear_delts', plain: 'The backs of your shoulders help.' },
    { muscleId: 'biceps', plain: 'The biceps bend the elbows.' },
  ],
  watch: [{ muscleId: 'lower_back', plain: 'Your lower back should stay quiet.' }],
  feelLine: 'You should feel this in the middle of your back, between your shoulder blades.',
  rows: [
    { key: 'low-back', where: 'Lower back', at: { muscles: ['lower_back'] },
      means: 'Watch for leaning back off the pad and arching your lower back.',
      fix: 'Keep your chest on the pad. Do not lean back.',
      zoom: 'chest-pad', redFlag: 'back', claim: CL.lean },
    { key: 'front-shoulder', where: 'Front of the shoulders', at: { muscles: ['front_delts'] },
      means: 'Watch for your shoulder blades rounding forward on the return.',
      fix: 'Return slowly and keep your shoulders back.',
      claim: CL.c7 },
  ],
  claim: C(['DATA', 'MECH', 'CONSENSUS'], ['lehman2004', 'fischer2025', ACE], 'c9 (primary), c10 (secondary), c6 (watch)'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'lean', title: 'Leaning back off the pad', zoom: 'chest-pad', claim: CL.lean,
    fix: 'Keep your chest on the pad. Do not lean back.' },
  { key: 'round', title: 'Shoulders rounding forward', claim: CL.c7,
    fix: 'Return slowly. Stop when your arms are straight, shoulders still back.' },
];
const RISKS = [
  { key: 'lean', text: 'Leaning back and arching adds needless stress to your lower back.', claim: CL.c6 },
  { key: 'free', text: 'A free-weight row measured more lower-back muscle work than a machine row.', claim: CL.c11 },
];

export default {
  schema: 1,
  id: 'lib_chest_supported_row',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'pull',
    why: 'D-SHIP-C3: card-no-zoom, the card has no hand zoom; the grip copy carries c3 and c4.',
    orientation: 'neutral',    // the drawn version: the spec's neutral-grip handles (MACHINE.grip; card grip.type c4)
    handle: 'machine-grip',    // card grip.type: whatever handles the machine has
    width: { text: 'Set by the machine.', claim: CL.c1 },
    thumb: { mode: THUMB, claim: CONV_THUMB },   // CONVENTION (Q-W3-4): golden B's pull default, derived above
    contact: CONTACT,          // 'finger-base', DERIVED from pairs.mjs CONVENTIONS ga:pull-base (CONVENTION, above)
    // card grip.wrist (c3): neutral, in line with the forearm, held all set. No tolerance given: neutral itself.
    wrist: { ext: [0, 0], limitText: 'Keep your wrists in line with your forearms all set.', claim: CL.c3 },
    faults: [],                // the card names no hand fault
    gripLine: 'Take the handles with straight arms. Keep your wrists in line with your forearms.',
    cue: 'Chest on the pad.',   // c4
  },
  contacts: ['brace-pad'],   // the card's archetype.contact
  setup: [
    { kind: 'adjust', text: 'Set the seat so the handles sit about level with your shoulders.', claim: CL.c1 },
    { kind: 'position', text: 'Plant your feet on the floor or the foot pads.', claim: CL.c1 },
    { kind: 'adjust', text: 'Set the chest pad to touch your chest lightly, arms straight.', zoom: 'chest-pad', claim: CL.c2 },
    { kind: 'brace', text: 'Sit tall, shoulders back and down, wrists straight.', claim: CL.c3 },
    { kind: 'load', text: 'Beat target by one or two reps? Add 2 to 10 percent.', claim: CL.c13 },
  ],
  posture: [
    { key: 'upright', label: 'Trunk upright', detail: 'Trunk upright and still.', anchor: { at: 'backUpper', pose: 'end' }, claim: CL.c7 },
    { key: 'chest', label: 'Chest on pad', detail: 'Chest lightly on the pad the whole set.',
      anchor: { at: 'chest', pose: 'end' }, zoom: 'chest-pad', claim: CL.c4 },
    { key: 'elbows', label: 'Elbows close', detail: 'Elbows travel back close to your sides.', anchor: { at: 'elbow.r', pose: 'end' }, claim: CL.c4 },
    { key: 'finish', label: 'Elbows past sides', detail: 'Each rep ends with the elbows just past your sides. Pause briefly.',
      anchor: { at: 'elbow.r', pose: 'end' }, zoom: 'elbow-finish', claim: CL.c5 },
    { key: 'return', label: 'Slow return', detail: 'Return slowly until your arms are straight. Shoulder blades stay back.',
      anchor: { at: 'shoulderTop.r', pose: 'start' }, claim: CL.c7 },
    { key: 'wrists', label: 'Straight wrists', detail: 'Wrists in line with your forearms all set.', anchor: { at: 'grip.r', pose: 'end' }, claim: CL.c3 },
  ],
  feel,
  zooms,
  chips: ['chest-pad', 'elbow-finish', 'feel'],   // the zoom shell's chip row: the zoom keys, then feel
  copy: {
    setupLine: 'Set the seat so the handles sit about level with your shoulders. Chest lightly on the pad.',
    mistakeLine: 'Keep your chest on the pad. Never lean back to finish the pull.',
    cueLine: 'Chest on the pad, elbows back.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['back'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/chest_supported_row.json', rev: 1 },
};
