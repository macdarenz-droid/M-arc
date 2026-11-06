// LIB-SHIP W6: the How-to content of lib_resistance_band_pull_apart (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/resistance_band_pull_apart.json; its claim ids are named on each field's claim.
// No hand zoom (D-SHIP-HANDW6, #393 6647923934): the card's hand zoom `bpa-grip` (c1; Wrong null) is not drawn: the band
// key's GAPS reason (hands/hand-band.mjs:6, "no research card") is stale and no band contact exists (Q-W3-5); the id is
// on tools/plates/library/hands/no-zoom.json. Its claim (overhand grip, hands wider than the shoulders; c1) lives in
// handling.gripLine.
// GRIP (Q-W6-3, D-SHIP-W6-CONV): the card's grip.thumb, grip.handContact and grip.wrist read "Not given by any source
// read (pull archetype default)". The thumb is DERIVED from golden B's pull default (lat_pulldown and seated_cable_row
// handling: thumb wrapped) and the contact from the pull key's convention pairs.mjs
// CONVENTIONS['ga:pull-base'], both cited CONVENTION, data only, never printed (D-SHIP-CONVCOPY). The wrist is exempt
// (D-SHIP-W6-WRISTEXEMPT, #393 6648157060): no range, nothing printed. `handle` is left out
// (Q-W3-5, resistance_band_row's form): no HandleProfile names a band; the field is optional.
// Zooms: `bpa-shoulders` is the plate's own Mistake (M); `bpa-elbows` is a drawing value (DV, below).
// Red flags (Q-W6-1, D-SHIP-W6-BACKREACH): the card's redFlags in card order (shoulder, back): the shared shoulder box,
// linked by the pain row, and LIB-5's back box (tools/plates/library/shared/back-box.mjs), linked by the low-back row.
// No variant line (equipment 'Resistance Band').
import plateSpec from '../specs/resistance_band_pull_apart.mjs';
import { RED_FLAG, RED_FLAG_SHOULDER } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_SHOULDER };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'mo-band-pull-apart': { cite: 'Resistance Band Pull Apart - Exercise Guide (Motra, formerly Train Fitness)', url: 'https://motra.com/exercises/resistanceBandPullApart',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'sl-band-pull-apart': { cite: 'How to Do Band Pull-Apart: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/band-pull-apart/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'fukunaga-2022': { cite: 'Band Pull-Apart Exercise: Effects of Movement Direction and Hand Position on Shoulder Muscle Activity', url: 'https://pubmed.ncbi.nlm.nih.gov/35391860/',
    kind: 'peer-reviewed', access: 'full', checked: '2026-10-22', use: 'DATA' },
  // The pull key's own source for the hand contact (the card delegates it to the archetype): a convention.
  'ga-pull-base': { cite: 'LIB-7 pull hand convention, pairs.mjs CONVENTIONS ga:pull-base: base of the fingers and top edge of the palm', url: 'tools/plates/library/hands/pairs.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-05', use: 'CONVENTION' },
  // golden B's pull archetype default for the thumb the card delegates: a convention.
  'pull-default': { cite: 'Golden B pull archetype default (lat_pulldown and seated_cable_row handling: thumb wrapped)', url: 'tools/plates/layers/exercises/lat_pulldown.howto.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-05', use: 'CONVENTION' },
  'nhs-shoulder-pain': { cite: 'NHS, Shoulder pain', url: 'https://www.nhs.uk/conditions/shoulder-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When shoulder pain needs a check.' },
  // The back box's own source (shared/back-box.mjs boxClaim), as lib_barbell_row lists it: the card's redFlags 'back'.
  'nhs-back': { cite: 'NHS, Back pain', url: 'https://www.nhs.uk/conditions/back-pain/',
    kind: 'guideline', access: 'full', checked: '2026-10-02', use: 'CONSENSUS', note: 'When back pain needs a check.' },
};
// Not cited: c11 (snap-back and head items, not on the card's rows), c15, c16, c17 (tempo and lab protocol, plate only).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const MO = 'mo-band-pull-apart', SL = 'sl-band-pull-apart';
const CL = {
  c1: C(['CONSENSUS'], [MO, SL], 'c1'),
  c2: C(['CONSENSUS'], [MO], 'c2'),
  c3: C(['CONSENSUS'], [MO], 'c3'),
  c4: C(['CONSENSUS'], [MO, SL], 'c4'),
  c7: C(['CONSENSUS'], [MO], 'c7'),
  c10: C(['CONSENSUS'], [MO], 'c10'),
  c12: C(['CONSENSUS'], [MO], 'c12'),
  shrug: C(['CONSENSUS'], [MO], 'c8, c3'),
  bend: C(['CONSENSUS'], [MO], 'c9, c5'),
  soft: C(['CONSENSUS'], [MO], 'c5, c9'),
  tall: C(['CONSENSUS'], [MO, SL], 'c1, c10'),
};

/* ------------------------------------------------------------------------------------------------ hand ---------- */
// GRIP (Q-W6-3): the contact DERIVED at import from the pull key's convention text, so it cannot
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
if (!CONTACT || !THUMB) throw new Error(`lib_resistance_band_pull_apart: no mapped pull contact or one pull thumb default: ${PULL_BASE}`);
const CONV_THUMB = C(['CONVENTION'], ['pull-default'], 'card grip.thumb: the pull archetype default, no exercise-specific source; golden B\'s pull default, not a card claim, never shown');
// D-SHIP-W6-WRISTEXEMPT (#393 6648157060): the card delegates grip.wrist; no range is taken and nothing is printed.
const CONV_WRIST = C(['CONVENTION'], ['pull-default'], 'card grip.wrist: pull archetype default only; no source gives a wrist range, so none is taken and nothing is shown (D-SHIP-W6-WRISTEXEMPT)');

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: the end (arms out to the sides at shoulder height, elbows slightly bent, shoulders
// down; c3, c4, c5) and the spec's Mistake pose merged over it, as the engine draws it (card plate.mistake c8: the
// shoulders shrug upward). The card zoom `bpa-shoulders` Wrong is that drawn fault, so no new pose is made.
// 'bent' (card zoom `bpa-elbows` Wrong, c9: "Elbows bent too much"): the end pose with both elbows bent BENT deg
// instead of the spec's ELBOW_BEND 18; the spec's END_ROT keeps the bend in the horizontal plane, so the fists stay at
// shoulder height and come in (landmarksOf: grip.l 27.1 px nearer the midline, the same height, 16.1 cm forward).
// DRAWING VALUES (D-SHIP-DRAWVAL, #376 6614695581; precedent D-LIB7-2 and lib_plank's SAG 20 deg): BENT 60 deg is a
// Wrong-pose size no card gives; no number from it appears in user copy; the layers panel judges it.
const BENT = 60, END = plateSpec.poses.end, MIS = plateSpec.mistake.pose;
const BENT_POSE = { elbow: { l: BENT, r: BENT } };
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  shrug: { pose: { ...END, ...MIS } },
  bent: { pose: { ...END, ...BENT_POSE } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom except the hand zoom `bpa-grip` (D-SHIP-HANDW6, header). Zoom shell form (render/closeup/crop.mjs):
// callouts anchored at the landmark they name, no guide mark; the Wrong is drawn alone (solid).
const zooms = [
  {
    key: 'bpa-shoulders', chip: 'Shoulders', heading: 'Shoulders down', kind: 'posture',   // card zoom key: bpa-shoulders
    crop: { center: { at: 'shoulder.r', pose: 'right', off: [0, -10] }, sizePx: 150 },
    right: 'end',
    wrong: { base: 'end', pose: MIS, solid: true },
    callout: {
      right: { text: 'Shoulders down', anchor: 'shoulderTop.r' },
      wrong: { text: 'Shrugged up', anchor: 'shoulderTop.r' },
    },
    caption: {
      right: 'Shoulders down as the band pulls apart.',
      wrong: 'Shoulders shrugged upward.',
    },
    alt: {
      right: 'Front view, end of the pull. The arms are out to the sides and the shoulders sit low.',
      wrong: 'Front view. The shoulders are hunched up toward the ears.',
    },
  },
  {
    key: 'bpa-elbows', chip: 'Elbows', heading: 'Elbow bend', kind: 'posture',   // card zoom key: bpa-elbows
    crop: { center: { at: 'elbow.l', pose: 'right', off: [0, 0] }, sizePx: 170 },
    right: 'end',
    wrong: { base: 'end', pose: BENT_POSE, solid: true },
    callout: {
      right: { text: 'Slight bend', anchor: 'elbow.l' },
      wrong: { text: 'Bent too much', anchor: 'elbow.l' },
    },
    caption: {
      right: 'Elbows slightly bent.',
      wrong: 'Elbows bent too much.',
    },
    alt: {
      right: 'Front view, end of the pull. The arms reach out to the sides, elbows only slightly bent.',
      wrong: 'Front view. The elbows bend a lot and the fists come in toward the body.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'rear_delts', plain: 'The rear delts, at the backs of the shoulders, do the work.' }],
  secondary: [
    { muscleId: 'mid_back', plain: 'The muscles between the shoulder blades help.' },
    { muscleId: 'upper_traps', plain: 'The upper traps work too.' },
    { muscleId: 'rotator_cuff', plain: 'The rotator cuff also works.' },   // text only (C2 NO_REGION, card libraryDiff)
  ],
  watch: [],
  // The card's first two rows (backs of the shoulders, c13; between the shoulder blades, c13, c4) have no fix, so they
  // are left off the rows (D-SHIP-Q16); the feel line says them.
  feelLine: 'You should feel this in the backs of your shoulders and between your shoulder blades.',
  rows: [
    { key: 'low-back', where: 'Lower back', at: { muscles: ['lower_back'] },
      means: 'Arching the lower back.',
      fix: 'Keep a straight posture.',
      redFlag: 'back', claim: CL.c10 },
    { key: 'pain', where: 'Shoulder pain', at: {},   // pain, not a muscle taking over: no map mark (golden B)
      means: '',   // the card's row has no means; D-FEEL-NOMEANS prints no label
      fix: 'Stop the set.',   // c12 (the row's claim)
      redFlag: 'shoulder', claim: CL.c12 },
  ],
  libraryDiff: { add: ['mid_back', 'rotator_cuff'], why: 'card libraryDiff: Motra names the rhomboids and mid traps (c13); the study measured the infraspinatus (c14; text-only).' },
  claim: C(['CONSENSUS', 'DATA'], [MO, 'fukunaga-2022'], 'c13 (primary, feel line), c13, c14 (secondary), c4 (feel line)'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'shrug', title: 'Shrugging shoulders upward', zoom: 'bpa-shoulders', claim: CL.shrug,
    fix: 'Keep your shoulders down.' },
  { key: 'bend', title: 'Bending elbows too much', zoom: 'bpa-elbows', claim: CL.bend,
    fix: 'Keep your elbows only slightly bent.' },
  { key: 'arch', title: 'Arching lower back', claim: CL.c10,
    fix: 'Keep a straight posture.' },
];
const RISKS = [
  { key: 'pain', text: 'Shoulder pain means stop.', claim: CL.c12 },
  { key: 'band', text: "Don't stretch the band beyond twice its length.", claim: CL.c2 },
];

export default {
  schema: 1,
  id: 'lib_resistance_band_pull_apart',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'pull',
    why: 'D-SHIP-C3 no-zoom list, D-SHIP-HANDW6: the band key\'s GAPS reason is stale and no band contact exists (Q-W3-5); the grip copy carries c1.',
    orientation: 'pronated',   // c1: overhand, palms down
    // no `handle` (Q-W3-5): no HandleProfile names a band; the field is optional
    width: { text: 'Hands wider than your shoulders.', claim: CL.c1 },
    thumb: { mode: THUMB, claim: CONV_THUMB },   // CONVENTION: golden B's pull default, derived above
    contact: CONTACT,          // 'finger-base', DERIVED from pairs.mjs CONVENTIONS ga:pull-base (CONVENTION, above)
    wrist: { exempt: 'Card grip.wrist: pull archetype default only; no source gives a wrist range for this exercise.', claim: CONV_WRIST },   // D-SHIP-W6-WRISTEXEMPT
    faults: [],                // the card's hand zoom has no Wrong
    // D-TEXT-GOLDEN: posture return (c6), moved here from the wrist limitText (D-SHIP-W6-WRISTEXEMPT)
    gripLine: 'Overhand grip, hands wider than your shoulders. Return slowly, keeping tension in the band.',   // c1, c6
    cue: 'Shoulders down, arms level.',   // c3, c7
  },
  contacts: ['standing-feet'],   // the card's archetype.contact
  setup: [
    { kind: 'safety', text: 'Check the band for damage before use.', claim: CL.c2 },
    { kind: 'position', text: 'Stand tall, feet hip-width apart, knees slightly bent.', claim: CL.c1 },
    { kind: 'grip', text: 'Arms straight out at shoulder height, band slightly tense.', claim: CL.c1 },
    { kind: 'brace', text: 'Keep your shoulders down.', zoom: 'bpa-shoulders', claim: CL.c3 },
    // D-TEXT-GOLDEN: posture squeeze and line (c4)
    { kind: 'finish', text: 'Squeeze your shoulder blades until your arms line up with your shoulders.', claim: CL.c4 },
  ],
  posture: [
    { key: 'level', label: 'Arms level', detail: 'Arms stay at shoulder height.', anchor: { at: 'elbow.l', pose: 'end' }, claim: CL.c7 },
    { key: 'elbows', label: 'Soft elbows', detail: 'Elbows slightly bent, not bent a lot.',
      anchor: { at: 'elbow.r', pose: 'end' }, zoom: 'bpa-elbows', claim: CL.soft },
    { key: 'squeeze', label: 'Blades together', detail: 'Squeeze the shoulder blades together.', anchor: { at: 'backUpper', pose: 'end' }, claim: CL.c4 },
    { key: 'line', label: 'Arms in line', detail: 'Pull until your arms line up with your shoulders.', anchor: { at: 'grip.l', pose: 'end' }, claim: CL.c4 },
    { key: 'return', label: 'Slow return', detail: 'Return slowly. Keep tension in the band.', anchor: { at: 'grip.l', pose: 'start' }, claim: C(['CONSENSUS'], [MO, SL], 'c6') },
    { key: 'tall', label: 'Stand tall', detail: 'Stand tall, no lower-back arch.', anchor: { at: 'backMid', pose: 'end' }, claim: CL.tall },
  ],
  feel,
  zooms,
  chips: ['bpa-shoulders', 'bpa-elbows', 'feel'],   // the zoom shell's chip row: the zoom keys, then feel
  copy: {
    setupLine: 'Stand tall, knees slightly bent. Hold the band overhand at shoulder height.',
    mistakeLine: 'Keep your shoulders down. Never shrug as the band pulls apart.',
    cueLine: 'Shoulders down, arms level.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['shoulder', 'back'],   // the card's redFlags, in card order (Q-W6-1)
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/resistance_band_pull_apart.json', rev: 1 },
};
