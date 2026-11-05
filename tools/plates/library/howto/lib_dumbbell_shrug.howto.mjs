// LIB-SHIP W4: the How-to content of lib_dumbbell_shrug (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/dumbbell_shrug.json; its claim ids are named on each field's claim.
// No hand zoom (D-SHIP-HANDW4, no-zoom.json gap-ruled): the card's hand zoom `dshrug-grip` (c14) has no hold key, and the
// card gives neither the handle diameter nor the contact point. Its Right lives in gripLine; its Wrong is
// handling.faults[curled].alt.
// Family (card parent barbell_shrug; D-SHIP-FAMILY, W4 INHERIT_MAP): handling.thumb.mode, risks[breath] and riskFlags
// are the parent sheet's values leaf for leaf (lib_barbell_shrug.howto.mjs); each claim cites this card's own claim.
// grip.wrist is this card's own claim (Q-W4-5): the family check refuses it until the research route drops it from
// inherit[] (D-SHIP-W4-ROUTE, expected).
// Card grip.type: no source read states the palm direction, so the sheet makes no palm claim (no orientation).
// Card notes (drawing conventions): grip.handContact is the hold archetype default (golden B's mid-palm, a CONVENTION
// the card's notes name, data only, never shown); the wrist range is this card's convention (c14) until the hand lane
// rules (F-LB3-3).
// Front-view plate (card plate.view): the posture crop is cut in the plate's own view (no `view` override).
// Red flags: the card's redFlags (shoulder): the shared shoulder box, linked by the pain row's redFlag: 'shoulder'.
// No variant line (equipment 'Dumbbells'). Not cited: c10 (a range comparison with the barbell shrug, no checkpoint).
import plateSpec from '../specs/dumbbell_shrug.mjs';
import { RED_FLAG, RED_FLAG_SHOULDER } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_SHOULDER };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'sl-dumbbell-shrug': { cite: 'How to Do Dumbbell Shrugs: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/dumbbell-shrug/',
    kind: 'coach', access: 'full', checked: '2026-10-19', use: 'CONSENSUS' },
  acsm2009: { cite: 'American College of Sports Medicine position stand. Progression models in resistance training for healthy adults.', url: 'https://pubmed.ncbi.nlm.nih.gov/19204579/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-19', use: 'CONSENSUS' },
  'ace-shrug': { cite: 'ACE Exercise Library: Shrug', url: 'https://www.acefitness.org/resources/everyone/exercise-library/72/shrug/',
    kind: 'guideline', access: 'full', checked: '2026-10-19', use: 'MECH' },
  'baechle-grip': { cite: 'Grip selection and location. Excerpt from Baechle and Earle, Weight Training, 5th edition (Human Kinetics)', url: 'https://us.humankinetics.com/blogs/excerpt/grip-selection-and-location',
    kind: 'textbook', access: 'full', checked: '2026-10-19', use: 'MECH' },
  odriscoll1992: { cite: 'The relationship between wrist position, grasp size, and grip strength.', url: 'https://pubmed.ncbi.nlm.nih.gov/1538102/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-19', use: 'MECH' },
  macdougall1985: { cite: 'Arterial blood pressure response to heavy resistance exercise.', url: 'https://pubmed.ncbi.nlm.nih.gov/3980383/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-19', use: 'DATA' },
  kolber2010: { cite: 'Shoulder injuries attributed to resistance training: a brief review.', url: 'https://pubmed.ncbi.nlm.nih.gov/20508476/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-19', use: 'DATA' },
  ekstrom2003: { cite: 'Surface electromyographic analysis of exercises for the trapezius and serratus anterior muscles.', url: 'https://pubmed.ncbi.nlm.nih.gov/12774999/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-19', use: 'DATA' },
  andersen2008: { cite: 'Muscle activation during selected strength exercises in women with chronic neck muscle pain.', url: 'https://pubmed.ncbi.nlm.nih.gov/18339796/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-19', use: 'DATA' },
  'nhs-shoulder-pain': { cite: 'NHS, Shoulder pain', url: 'https://www.nhs.uk/conditions/shoulder-pain/',
    kind: 'guideline', access: 'full', checked: '2026-10-19', use: 'CONSENSUS', note: 'When shoulder pain needs a check.' },
};

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const SL = 'sl-dumbbell-shrug';
const CL = {
  c1: C(['CONSENSUS'], [SL], 'c1'),
  c3: C(['CONSENSUS'], [SL], 'c3'),
  c4: C(['CONSENSUS'], [SL], 'c4'),
  c5: C(['CONSENSUS'], [SL], 'c5'),
  c6: C(['CONSENSUS'], [SL], 'c6'),
  c8: C(['CONSENSUS'], [SL], 'c8'),
  c13: C(['CONSENSUS', 'MECH'], ['baechle-grip'], 'c13; card inherit grip.thumb: the rule covers all grips'),
  c15: C(['CONSENSUS'], ['acsm2009'], 'c15'),
  c16: C(['DATA'], ['macdougall1985'], 'c16; card inherit risks[breath]: heavy shrugs are heavy lifts'),
  c17: C(['DATA', 'WEAK'], ['kolber2010'], 'c17; card inherit redFlags: the shoulder is loaded the same way'),
  c19: C(['CONSENSUS', 'MECH'], ['nhs-shoulder-pain'], 'c19'),
  pick: C(['CONSENSUS', 'MECH'], [SL, 'baechle-grip'], 'c1, c13'),
  brace: C(['CONSENSUS'], [SL], 'c4, c6'),
  roll: C(['CONSENSUS', 'MECH'], ['ace-shrug', SL], 'c12, c6'),
  heavy: C(['CONSENSUS'], [SL], 'c7, c8'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: the end (both shoulders up, arms straight; c2, c3) and the spec's Mistake pose merged
// over it, as the engine draws it (card plate.mistake c6: the elbows bend to pull the dumbbells up). The card zoom
// dshrug-top Wrong is the plate's drawn fault (posture zoom M).
const MIS = plateSpec.mistake.pose;
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: plateSpec.poses.end },
  pull: { pose: { ...plateSpec.poses.end, ...MIS } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom except the hand zoom `dshrug-grip` (D-SHIP-HANDW4, above). Zoom shell form (render/closeup/crop.mjs):
// the crop centre is on the right pose for both halves (the elbow the plate's Mistake tell names); the Wrong is the
// spec's Mistake drawn alone (solid).
const zooms = [
  {
    key: 'dshrug-top', chip: 'Top', heading: 'Top position', kind: 'posture',
    crop: { center: { at: 'elbow.l', pose: 'right', off: [0, -10] }, sizePx: 170 },
    right: 'end',
    wrong: { base: 'end', pose: MIS, solid: true },
    callout: {
      right: { text: 'Arms straight', anchor: 'elbow.l' },
      wrong: { text: 'Elbows bent', anchor: 'elbow.l' },
    },
    caption: {
      right: 'Both shoulders up toward the ears, arms straight.',
      wrong: 'Elbows bent, pulling the dumbbells up with the arms.',
    },
    alt: {
      right: 'Front view, top of the lift. Both shoulders are raised toward the ears and the arms hang straight.',
      wrong: 'Front view. The elbows bend and the arms pull the dumbbells up.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
// The card's first row (top of the shoulders, c9) has no fix, so it is left off the rows (D-SHIP-Q16); the feel line says it.
const feel = {
  primary: [{ muscleId: 'upper_traps', plain: 'The upper traps do the lifting.' }],
  secondary: [{ muscleId: 'forearms', plain: 'The grip muscles work too when no straps are used.' }],
  watch: [],
  feelLine: 'You should feel this on top of your shoulders, beside the neck.',
  rows: [
    { key: 'grip', where: 'Forearms and grip tiring first', at: { muscles: ['forearms'] },
      means: 'Your grip is holding back the load.',
      fix: 'Use lifting straps.',
      claim: CL.c8 },
    { key: 'shoulder', where: 'Pain in your shoulder', at: { muscles: ['front_delts'] },
      means: 'Is it getting worse?',
      fix: "Stop the set. Don't train through the pain.",
      redFlag: 'shoulder', claim: CL.c19 },
  ],
  claim: C(['CONSENSUS', 'DATA', 'WEAK'], [SL, 'ekstrom2003', 'andersen2008'], 'c9, c18'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'arms', title: 'Bending the arms to pull', zoom: 'dshrug-top', claim: CL.c6,
    fix: 'Keep the arms straight and passive.' },
  { key: 'roll', title: 'Rolling or shifting the shoulders', claim: CL.roll,
    fix: 'Lift straight up, lower straight down.' },
  { key: 'heavy', title: 'Going too heavy', claim: CL.heavy,
    fix: 'Use lighter dumbbells, or straps if the grip is the limit.' },
];
const RISKS = [
  // === the parent's risks[key=breath] (W4 INHERIT_MAP); the claim is this card's c16
  { key: 'breath', text: 'Heavy reps with a held breath send blood pressure very high.', claim: CL.c16 },
  { key: 'shoulder', text: 'The shoulder is a common injury site in weight training. Poor technique adds risk.', claim: CL.c17 },
];

export default {
  schema: 1,
  id: 'lib_dumbbell_shrug',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'hold',
    why: 'D-SHIP-C3 no-zoom list, D-SHIP-HANDW4: dshrug-grip: no hold key; the handle diameter and the contact point are not on the card.',
    // No orientation: card grip.type: no source read states the palm direction, so the sheet makes no palm claim.
    handle: 'dumbbell',
    loadAxis: 'across',        // golden B's hold default (dumbbell_lateral_raise: no push lever check)
    overBody: false,
    width: { text: 'Hands at your sides.', claim: CL.c1 },
    thumb: { mode: 'wrapped', claim: CL.c13 },   // === the parent's handling.thumb.mode
    contact: 'mid-palm',       // CONVENTION: hold default (card notes: grip.handContact is a drawing convention); never shown
    // Own claim (Q-W4-5; refused until the route lands). card grip.wrist: bent back into its natural grip position, about
    // 35 degrees, not curled forward; grip weakens moving away from it, even to 15 degrees (c14). The range runs between
    // the card's two measured positions (15 and 35 degrees of extension); no number from it appears in copy.
    wrist: { ext: [15, 35], limitText: 'Wrist bent back in its natural grip position, not curled forward.',
      claim: C(['DATA', 'MECH'], ['odriscoll1992'], 'c14, card grip.wrist (a card drawing convention until F-LB3-3)') },
    faults: [
      // card zoom dshrug-grip wrong (c14). Not drawn (no hand zoom), so no pose or marker is set.
      { key: 'curled', label: 'Wrist curled', pose: {}, markers: [], alt: 'Wrist curled forward.' },
    ],
    gripLine: 'A dumbbell in each hand, thumbs wrapped. Wrist bent back, in its natural grip position.',
    cue: 'Arms straight, pause at the top.',   // c3, c5
  },
  contacts: ['standing-feet'],
  setup: [
    { kind: 'grip', text: 'Pick up a dumbbell in each hand, thumbs around the handles.', claim: CL.pick },
    { kind: 'position', text: 'Stand tall with the dumbbells at your sides.', claim: CL.c1 },
    { kind: 'brace', text: 'Brace your trunk. Arms straight and passive.', claim: CL.brace },
    { kind: 'grip', text: 'Grip limiting the load? Lifting straps are fine.', claim: CL.c8 },
    { kind: 'load', text: 'Beat target by one or two reps? Add 2 to 10 percent.', claim: CL.c15 },
  ],
  posture: [
    { key: 'tall', label: 'Stand tall', detail: 'Good posture, trunk braced the whole set.',
      anchor: { landmark: 'chest', pose: 'start' }, claim: CL.c4 },
    { key: 'arms', label: 'Straight arms', detail: 'Arms straight. The shoulders do the lifting.',
      anchor: { landmark: 'elbow.r', pose: 'end' }, zoom: 'dshrug-top', claim: CL.c3 },
    { key: 'up', label: 'Straight up', detail: 'Straight up and down, not forward or back. No rolling.',
      anchor: { landmark: 'shoulderTop.l', pose: 'end' }, claim: CL.roll },
    { key: 'top', label: 'Pause on top', detail: 'Short pause at the top, then lower slowly.',
      anchor: { landmark: 'grip.r', pose: 'end' }, claim: CL.c5 },
  ],
  feel,
  zooms,
  chips: ['dshrug-top', 'feel'],   // the zoom shell's chip row: the zoom keys, then feel
  copy: {
    setupLine: 'A dumbbell in each hand at your sides. Stand tall, trunk braced.',
    mistakeLine: 'Keep your arms straight and passive. Only the shoulders lift.',
    cueLine: 'Shoulders up, pause, lower slowly.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['shoulder'],   // === the parent's; the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/dumbbell_shrug.json', rev: 1 },
};
