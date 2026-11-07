// LIB-SHIP W4: the How-to content of lib_barbell_shrug (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/barbell_shrug.json; its claim ids are named on each field's claim.
// No hand zoom (D-SHIP-HANDW4, no-zoom.json gap-ruled): the card's hand zoom `shrug-grip` (c10) has a thumb fault for its
// Wrong and no key draws one; there is no hold key and the card gives no bar diameter. Its Right lives in gripLine and
// setup step 1; its Wrong is handling.faults[thumbless].alt.
// Card gap: grip.handContact reads "(hold archetype)" and grip.wrist reads "Not given by any shrug source read (hold
// archetype default)". The contact below is golden B's `hold` archetype default (layers/exercises/dumbbell_lateral_raise
// .howto.mjs handling: contact mid-palm), cited CONVENTION (source hold-default), never shown; the wrist is `exempt`.
// Parent of lib_cable_shrug, lib_dumbbell_shrug and lib_smith_machine_shrug (D-SHIP-FAMILY, W4 INHERIT_MAP):
// handling.thumb.mode, handling.contact, handling.orientation, handling.faults[thumbless], risks[breath] and riskFlags
// are compared leaf by leaf with the children, so none of them names a barbell. No handling.pose (D-SHIP-W4-THUMB).
// Mistake: the card's top fault, rolling the shoulders (c3), cannot be drawn (card drawable: false); the plate draws the
// card's drawable fault, bent arms pulling (c4). Rolling stays as text (posture 'up', mistakes 'roll').
// Red flags: the card's redFlags (shoulder): the shared shoulder box, linked by the pain row's redFlag: 'shoulder'.
// No variant line (equipment 'Barbell'). Not cited: pizzari2014 (c6, a comparison of shrug styles, no form checkpoint).
import plateSpec from '../specs/barbell_shrug.mjs';
import { RED_FLAG, RED_FLAG_SHOULDER } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_SHOULDER };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'ace-shrug': { cite: 'ACE Exercise Library: Shrug', url: 'https://www.acefitness.org/resources/everyone/exercise-library/72/shrug/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'sl-barbell-shrug': { cite: 'How to Do Barbell Shrug: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/barbell-shrug/',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  acsm2009: { cite: 'American College of Sports Medicine position stand. Progression models in resistance training for healthy adults.', url: 'https://pubmed.ncbi.nlm.nih.gov/19204579/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-17', use: 'CONSENSUS' },
  macdougall1985: { cite: 'Arterial blood pressure response to heavy resistance exercise.', url: 'https://pubmed.ncbi.nlm.nih.gov/3980383/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'WEAK' },
  'baechle-grip': { cite: 'Grip selection and location. Excerpt from Baechle and Earle, Weight Training, 5th edition (Human Kinetics)', url: 'https://us.humankinetics.com/blogs/excerpt/grip-selection-and-location',
    kind: 'textbook', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  kolber2010: { cite: 'Shoulder injuries attributed to resistance training: a brief review.', url: 'https://pubmed.ncbi.nlm.nih.gov/20508476/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  // golden B's `hold` archetype default for the hand contact the card leaves to the archetype: a convention.
  'hold-default': { cite: 'Golden B hold archetype default (dumbbell_lateral_raise handling: thumb wrapped, contact mid-palm)', url: 'tools/plates/layers/exercises/dumbbell_lateral_raise.howto.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-04', use: 'CONVENTION' },
  'nhs-shoulder-pain': { cite: 'NHS, Shoulder pain', url: 'https://www.nhs.uk/conditions/shoulder-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When shoulder pain needs a check.' },
};

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const ACE = 'ace-shrug', SL = 'sl-barbell-shrug';
const CL = {
  c1: C(['CONSENSUS'], [ACE], 'c1'),
  c2: C(['CONSENSUS'], [ACE], 'c2'),
  c3: C(['CONSENSUS'], [ACE], 'c3'),
  c4: C(['CONSENSUS'], [SL], 'c4'),
  c5: C(['CONSENSUS'], [SL], 'c5'),
  c7: C(['CONSENSUS'], ['acsm2009', ACE], 'c7'),
  c8: C(['CONSENSUS'], ['acsm2009'], 'c8'),
  c9: C(['DATA', 'WEAK'], ['macdougall1985'], 'c9'),
  c10: C(['CONSENSUS'], ['baechle-grip'], 'c10'),
  c11: C(['DATA', 'WEAK'], ['kolber2010'], 'c11'),
  grip: C(['CONSENSUS'], [ACE, 'baechle-grip'], 'c1, c10'),
  up: C(['CONSENSUS'], [ACE, SL], 'c2, c3, c4'),
  // card grip.wrist: "Not given by any shrug source read (hold archetype default)"; the hold default is a convention
  wrist: C(['CONVENTION'], ['hold-default'], 'card grip.wrist: no shrug source read gives the wrist (hold archetype default); not a card claim, never shown'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: the end (shoulders up, arms straight; c2, c4) and the spec's Mistake pose merged over
// it, as the engine draws it (card plate.mistake c4: the elbows bend and the bar rides up the thighs). The card zoom
// shrug-top Wrong is the plate's drawn fault (posture zoom M).
const MIS = plateSpec.mistake.pose;
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: plateSpec.poses.end },
  pull: { pose: { ...plateSpec.poses.end, ...MIS } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom except the hand zoom `shrug-grip` (D-SHIP-HANDW4, above). Zoom shell form (render/closeup/crop.mjs):
// the crop centre is on the right pose for both halves; the Wrong is the spec's Mistake drawn alone (solid).
const zooms = [
  {
    key: 'shrug-top', chip: 'Top', heading: 'Top position', kind: 'posture',
    crop: { center: { at: 'elbow.r', pose: 'right', off: [0, -10] }, sizePx: 170 },
    right: 'end',
    wrong: { base: 'end', pose: MIS, solid: true },
    callout: {
      right: { text: 'Arms straight', anchor: 'elbow.r' },
      wrong: { text: 'Elbows bent', anchor: 'elbow.r' },
    },
    caption: {
      right: 'Shoulders up toward the ears, arms straight.',
      wrong: 'Elbows bent, pulling the bar up with the arms.',
    },
    alt: {
      right: 'Side view, top of the lift. The shoulders are raised toward the ears and the arms hang straight.',
      wrong: 'Side view. The elbows bend and the arms pull the bar up the thighs.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
// The card's first row (top of the shoulders, c5) has no fix, so it is left off the rows (D-SHIP-Q16); the feel line says it.
const feel = {
  primary: [{ muscleId: 'upper_traps', plain: 'The upper traps lift the shoulders.' }],
  secondary: [],
  watch: [],
  feelLine: 'You should feel this on top of your shoulders, between neck and shoulder.',
  rows: [
    { key: 'shoulder', where: 'Sharp pain in the shoulder joint', at: { muscles: ['front_delts'] },
      means: '',   // D-FEEL-MEANS-CAUSAL: the card's row gives no cause at its strength; D-FEEL-NOMEANS prints no label
      fix: 'Stop the set.',
      redFlag: 'shoulder', claim: CL.c11 },
  ],
  claim: CL.c5,
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'roll', title: 'Rolling the shoulders', claim: CL.c3,
    fix: 'Lift straight up, lower straight down.' },
  { key: 'arms', title: 'Bending the arms to pull', zoom: 'shrug-top', claim: CL.c4,
    fix: "Keep your elbows straight. If you can't, lower the weight." },
  { key: 'drop', title: 'Dropping the bar fast', claim: CL.c7,
    fix: 'Lower slowly to the start.' },
];
const RISKS = [
  { key: 'breath', text: 'Heavy reps with a held breath send blood pressure very high.', claim: CL.c9 },
  { key: 'shoulder', text: 'The shoulder is a common injury site in lifting. Poor technique adds risk.', claim: CL.c11 },
];

export default {
  schema: 1,
  id: 'lib_barbell_shrug',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'hold',
    why: 'D-SHIP-C3 no-zoom list, D-SHIP-HANDW4: shrug-grip: the Wrong is a thumb fault and no key draws one; no hold key; bar diameter not on the card.',
    orientation: 'pronated',   // card grip.type: overhand, palms down (c1)
    handle: 'bar-28',          // the spec's 28 mm shaft
    loadAxis: 'across',        // golden B's hold default (dumbbell_lateral_raise: no push lever check)
    overBody: false,
    width: { text: 'Hands about shoulder width.', claim: CL.c1 },
    thumb: { mode: 'wrapped', claim: CL.c10 },
    contact: 'mid-palm',       // CONVENTION: hold default (source hold-default); card grip.handContact names only the archetype
    wrist: { exempt: 'card grip.wrist: no shrug source read gives the wrist (hold archetype default).', claim: CL.wrist },
    faults: [
      // card zoom shrug-grip wrong (c10). Not drawn (no hand zoom), so no pose or marker is set.
      { key: 'thumbless', label: 'Thumb not wrapped', pose: {}, markers: [], alt: 'Thumb not wrapped around the bar.' },
    ],
    gripLine: 'Overhand, hands about shoulder width, thumbs wrapped around the bar.',   // cites c1 (overhand, hands about shoulder width) and c10 (thumbs wrapped); W4 content K2, K4, recheck 2
    cue: 'Arms straight, shoulders up.',   // c4, c2
  },
  contacts: ['standing-feet'],
  setup: [
    { kind: 'grip', text: 'Overhand grip, hands about shoulder width, thumbs around the bar.', claim: CL.grip },
    { kind: 'position', text: 'Stand tall with knees slightly bent and hips straight.', claim: CL.c2 },
    { kind: 'position', text: 'Let the bar hang in front of your thighs on straight arms.', claim: CL.c4 },
    // W4 panel L2 / content K1: the invented bar-spreading cue is gone; the card's lift line (c2, c3) takes the step.
    { kind: 'position', text: 'Lift your shoulders straight up toward your ears. No rolling.', claim: C(['CONSENSUS'], [ACE], 'c2, c3') },
    { kind: 'load', text: 'Beat target by one or two reps? Add 2 to 10 percent.', claim: CL.c8 },
  ],
  posture: [
    { key: 'back', label: 'Back tall', detail: 'Knees soft, hips straight, back tall the whole set.',
      anchor: { landmark: 'backUpper', pose: 'start' }, claim: CL.c2 },
    { key: 'arms', label: 'Straight arms', detail: 'Arms straight. The shoulders do the lifting.',
      anchor: { landmark: 'elbow.r', pose: 'end' }, zoom: 'shrug-top', claim: CL.c4 },
    { key: 'up', label: 'Straight up', detail: 'Shoulders up toward the ears, then down. No rolling.',
      anchor: { landmark: 'shoulderTop.r', pose: 'end' }, claim: CL.up },
    { key: 'lower', label: 'Slow lower', detail: 'Lower slowly to the start.',
      anchor: { landmark: 'grip.r', pose: 'start' }, claim: CL.c7 },
  ],
  feel,
  zooms,
  chips: ['shrug-top', 'feel'],   // the zoom shell's chip row: the zoom keys, then feel
  copy: {
    setupLine: 'Overhand grip, hands about shoulder width. Stand tall, knees slightly bent.',
    mistakeLine: 'Keep your arms straight, so the shoulders lift the bar, not the arms.',
    cueLine: 'Shoulders straight up, arms straight.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['shoulder'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/barbell_shrug.json', rev: 1 },
};
