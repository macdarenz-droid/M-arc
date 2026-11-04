// LIB-SHIP W2: the How-to content of lib_barbell_row (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/barbell_row.json; its claim ids are named on each field's claim.
// No hand zoom (D-SHIP-HANDW2, no-zoom.json gap-ruled): the card's hand zoom `row-grip` (c1) has no pair key variant
// that draws it (hand-bar.mjs's row variant is the 32 mm pull-up bar; no sourced barbell diameter, Q-W2-1), and no
// per-id hand pose is drawn without every number (ruling 8). Its hand claims (overhand, thumbs wrapped, wrists
// straight, width; c1, c2, c16) live in handling and setup step 2.
// Red flags: the card's redFlags (back): LIB-5's back box (tools/plates/library/shared/back-box.mjs), linked by the
// low-back row's redFlag: 'back'. Tier-A way out: the card records a gap (no source read says how to fail a stuck
// rep, LIB-WAYOUT), so no way-out line is written (Q-W2-3).
import plateSpec from '../specs/barbell_row.mjs';
import { RED_FLAG } from '../../layers/howto/shared.mjs';
export { RED_FLAG };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'ace-bent-over-row': { cite: 'ACE Exercise Library: Bent-over Row', url: 'https://www.acefitness.org/resources/everyone/exercise-library/12/bent-over-row/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'sl-barbell-row': { cite: 'How to Do Barbell Rows: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/barbell-row/',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  fenwick2009: { cite: 'Comparison of different rowing exercises: trunk muscle activation and lumbar spine motion, load, and stiffness.', url: 'https://pubmed.ncbi.nlm.nih.gov/19620925/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  saeterbakken2015: { cite: 'The Effect of Performing Bi- and Unilateral Row Exercises on Core Muscle Activation.', url: 'https://pubmed.ncbi.nlm.nih.gov/26134664/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  acsm2009: { cite: 'American College of Sports Medicine position stand. Progression models in resistance training for healthy adults.', url: 'https://pubmed.ncbi.nlm.nih.gov/19204579/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-17', use: 'CONSENSUS' },
  // cite as docs/research/howto/sources.json already holds it (same url, kind, access and checked as the card)
  macdougall1985: { cite: 'MacDougall JD et al. Arterial blood pressure response to heavy resistance exercise. J Appl Physiol 1985;58(3):785-90', url: 'https://pubmed.ncbi.nlm.nih.gov/3980383/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'WEAK' },
  'baechle-grip': { cite: 'Grip selection and location. Excerpt from Baechle and Earle, Weight Training, 5th edition (Human Kinetics)', url: 'https://us.humankinetics.com/blogs/excerpt/grip-selection-and-location',
    kind: 'textbook', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  // The back box's own source (shared/back-box.mjs boxClaim), as lib_rope_triceps_pushdown lists it: the card's redFlags 'back'.
  'nhs-back': { cite: 'NHS, Back pain', url: 'https://www.nhs.uk/conditions/back-pain/',
    kind: 'guideline', access: 'full', checked: '2026-10-02', use: 'CONSENSUS', note: 'When back pain needs a check.' },
};
// Not cited: c13 (tempo, plate only).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const ACE = 'ace-bent-over-row', SL = 'sl-barbell-row';
const CL = {
  c3: C(['CONSENSUS'], [ACE], 'c3'),
  c4: C(['CONSENSUS'], [SL], 'c4'),
  c5: C(['CONSENSUS'], [ACE], 'c5'),
  c7: C(['CONSENSUS'], [SL], 'c7'),
  c8: C(['CONSENSUS'], [SL], 'c8'),
  c9: C(['CONSENSUS'], [SL], 'c9'),
  c10: C(['DATA'], ['fenwick2009'], 'c10'),
  c14: C(['CONSENSUS'], ['acsm2009'], 'c14'),
  c15: C(['DATA', 'WEAK'], ['macdougall1985'], 'c15'),
  c16: C(['CONSENSUS'], ['baechle-grip'], 'c16'),
  c19: C(['CONSENSUS'], [SL], 'c19'),
  c20: C(['CONSENSUS', 'WEAK'], [SL], 'c20'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: the end (bar at the belly, flat back, c5, c6) and the spec's Mistake pose merged
// over the end pose, as the engine draws it (torso swings up to heave the bar; card plate.mistake, c7). The card zoom
// row-back's Wrong ("torso rising as the bar is heaved") is that drawn fault, so no new pose is made.
const SWING = plateSpec.mistake.pose;
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: plateSpec.poses.end },
  swing: { pose: { ...plateSpec.poses.end, ...SWING } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom except the hand zoom `row-grip` (D-SHIP-HANDW2, above). Zoom shell form (render/closeup/crop.mjs):
// the crop centre is on the right pose's mid-back for both halves; the Wrong is the Mistake pose drawn alone (solid).
const zooms = [
  {
    key: 'row-back', chip: 'Back', heading: 'Back angle', kind: 'posture',
    crop: { center: { at: 'backMid', pose: 'right', off: [0, 0] }, sizePx: 170 },
    right: 'end',
    wrong: { base: 'end', pose: SWING, solid: true },
    callout: {
      right: { text: 'Flat back', anchor: 'backMid' },
      wrong: { text: 'Torso swings up', anchor: 'backUpper' },   // c7 (card plate.mistake)
    },
    caption: {
      right: 'Flat back, hips hinged, soft knees.',
      wrong: 'Torso rising as the bar is heaved.',   // c7
    },
    alt: {
      right: 'Side view, top of the row. Hips hinged, back flat, knees slightly bent. The bar touches the belly.',
      wrong: 'Side view. The torso has swung up from the hips to heave the bar to the belly.',   // c7
    },
    feelRow: 'low-back',
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
// The card's first two rows (between the shoulder blades, c12; lower back working hard, c11) have no fix, so they are
// left off the rows (D-SHIP-Q16); the feel line says them.
const feel = {
  primary: [
    { muscleId: 'mid_back', plain: 'The traps and the muscles around the shoulder blades do most of the work.' },   // c12 names the trapezius (pre-panel restore, #379 6632122694)
    { muscleId: 'lats', plain: 'The lats are main movers too.' },
  ],
  secondary: [
    { muscleId: 'rear_delts', plain: 'The rear delts help pull.' },
    { muscleId: 'biceps', plain: 'The biceps help bend the elbows.' },
    { muscleId: 'forearms', plain: 'The forearm flexors hold the bar.' },
  ],
  watch: [
    { muscleId: 'lower_back', plain: 'The lower back works harder than in a machine row.' },
  ],
  feelLine: 'You should feel this between and around your shoulder blades. Your lower back works hard too.',
  rows: [
    { key: 'low-back', where: 'Lower back pain while rowing', at: { muscles: ['lower_back'] },
      means: 'You are rounding your back, or swinging the bar up.',
      fix: "Stop the set. Don't train through the pain.",
      zoom: 'row-back', redFlag: 'back', claim: C(['CONSENSUS'], [SL], 'c4, c7') },
  ],
  libraryDiff: { add: ['forearms'], why: 'The forearm flexors are named as secondary movers (card c12).' },
  claim: C(['CONSENSUS', 'DATA'], [SL, 'saeterbakken2015'], 'c12, c11'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'swing', title: 'Swinging the bar up', zoom: 'row-back', claim: CL.c7,
    fix: 'Go lighter and row strictly.' },
  { key: 'round', title: 'Rounding the back', claim: C(['CONSENSUS'], [SL], 'c4, c7'),
    fix: 'Keep the back flat. If it rounds, lower the weight.' },
  { key: 'underhand', title: 'Underhand grip for heavy sets', claim: CL.c20,
    fix: 'Keep the overhand grip for this row.' },
];
const RISKS = [
  { key: 'spine', text: 'This row puts the largest load on the lower spine of the rows tested.', claim: CL.c10 },
  { key: 'breath', text: 'Heavy reps with a held breath send blood pressure very high.', claim: CL.c15 },
  { key: 'swing', text: 'Swinging the bar up with your hips shifts work to the lower back.', claim: CL.c7 },
];

export default {
  schema: 1,
  id: 'lib_barbell_row',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'pull',
    why: 'D-SHIP-C3 no-zoom list, D-SHIP-HANDW2: no pair key variant draws this card\'s barbell grip (Q-W2-1, ruling 8); the grip copy carries c1, c2 and c16.',
    orientation: 'pronated',   // card grip.type: overhand, double overhand (c1, c2)
    handle: 'bar-28',          // the spec's 28 mm shaft
    width: { text: 'Slightly wider than shoulder width, so wrists, elbows and shoulders line up.',
      claim: C(['CONSENSUS'], [ACE, SL], 'c1, c2') },
    thumb: { mode: 'wrapped', claim: CL.c16 },
    contact: 'finger-base',    // card grip.handContact: base of the fingers and top of the palm (pull archetype)
    // card grip.wrist: "Straight in line with the forearm (pull archetype range); not curled" (c1). The range is the
    // pull archetype's recorded convention (tools/plates/library/hands/pairs.mjs CONVENTIONS 'ga:pull-base': extension
    // 0 to 25), not a card number.
    wrist: { ext: [0, 25], limitText: 'Keep the wrists straight, in line with the forearms.',
      claim: C(['CONSENSUS'], [ACE], 'c1, card grip.wrist. The ext range is pairs.mjs CONVENTIONS ga:pull-base, a convention, not a card number.') },
    faults: [
      // card grip.wrist "not curled". Not drawn (no hand zoom), so no pose or marker is set; the label is the hand
      // modules' label for this fault key (family consistency).
      { key: 'curled', label: 'Wrist curled', pose: {}, markers: [], alt: 'Wrist curled under the bar, out of line with the forearm.' },
    ],
    // c1 overhand, c16 thumbs, c17 straps. The card's grip.handContact (base of the fingers) is the pull archetype's
    // convention, so it fills `contact` only and is not printed (W2 panel, #379 6633524031: convention values are data).
    gripLine: 'Overhand, thumbs around the bar. Straps are fine if grip fails first.',
    cue: 'Overhand, thumbs wrapped, wrists straight.',   // c1, c16
  },
  contacts: ['standing-feet'],
  setup: [
    { kind: 'get-in', text: 'Lift the bar from the rack.', claim: CL.c3 },
    { kind: 'grip', text: 'Feet shoulder width. Overhand grip slightly wider, thumbs around the bar.',
      claim: C(['CONSENSUS'], [SL, 'baechle-grip'], 'c8, c2, c16') },
    { kind: 'position', text: 'Bend at the hips, back straight, knees slightly bent. Arms straight.', zoom: 'row-back',
      claim: C(['CONSENSUS'], [ACE], 'c3, c5') },
    { kind: 'brace', text: 'Breathe in, then pull.', claim: CL.c19 },
    { kind: 'load', text: 'Beat target by one or two reps? Add 2 to 10 percent.', claim: CL.c14 },
  ],
  posture: [
    { key: 'back', label: 'Flat back', detail: 'Back neutral the whole set, not rounded or arched.',
      anchor: { landmark: 'backMid', pose: 'end' }, claim: CL.c4 },
    // The row-back zoom's Wrong (torso swings up) is c7's fault, so the zoom hangs on this c5/c7 checkpoint, not on
    // the c4 flat-back one (W2 panel, #379 6633524031).
    { key: 'trunk', label: 'Trunk still', detail: 'Trunk angle stays the same while the bar moves.',
      anchor: { landmark: 'lumbar', pose: 'end' }, zoom: 'row-back', claim: C(['CONSENSUS'], [ACE, SL], 'c5, c7') },
    { key: 'bar', label: 'Bar to belly', detail: 'Bar pulled to the belly button or low chest.',
      anchor: { landmark: 'grip.r', pose: 'end' }, claim: C(['CONSENSUS'], [ACE, SL], 'c5, c6') },
    { key: 'blades', label: 'Shoulder blades', detail: 'Shoulder blades forward at the bottom, together at the top.',
      anchor: { landmark: 'backUpper', pose: 'end' }, claim: CL.c9 },
    { key: 'feet', label: 'Even feet', detail: 'Weight even under the feet.', anchor: { landmark: 'ankle.r', pose: 'start' }, claim: CL.c8 },
  ],
  feel,
  zooms,
  chips: ['row-back', 'feel'],   // the zoom shell's chip row: the zoom keys, then feel
  copy: {
    setupLine: 'Hinge at the hips, back flat, knees slightly bent. Pull the bar to your belly.',
    mistakeLine: "Don't swing the bar up with your hips. Go lighter and row strictly.",
    cueLine: 'Bar to belly, back flat.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['back'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/barbell_row.json', rev: 1 },
};
