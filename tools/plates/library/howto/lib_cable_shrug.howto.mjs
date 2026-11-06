// LIB-SHIP W4: the How-to content of lib_cable_shrug (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/cable_shrug.json; its claim ids are named on each field's claim.
// No hand zoom (D-SHIP-HANDW4, no-zoom.json gap-ruled): the card's hand zoom `cshrug-grip` (c11) has no hold key, and the
// card gives neither the cable bar diameter nor the contact point. Its Right lives in gripLine; its Wrong is
// handling.faults[curled].alt.
// Family (card parent barbell_shrug; D-SHIP-FAMILY, W4 INHERIT_MAP): handling.thumb.mode, handling.orientation,
// risks[breath] and riskFlags are the parent sheet's values leaf for leaf (lib_barbell_shrug.howto.mjs); each claim
// cites this card's own claim. No `handling.handle` (Q-W4-6): no card gives the cable bar. grip.wrist and grip.width are
// this card's own claims (Q-W4-5): the family check refuses them until the research route drops them from inherit[]
// (D-SHIP-W4-ROUTE, expected).
// Card notes (drawing conventions): grip.handContact is the hold archetype default (golden B's mid-palm, a CONVENTION
// the card's notes name, data only, never shown); the wrist range is this card's convention (c11) until the hand lane rules (F-LB3-3).
// Red flags: the card's redFlags (shoulder): the shared shoulder box, linked by the pain row's redFlag: 'shoulder'.
// No variant line (equipment 'Cable'). Plate moves: the selector-pin shared card covers loading the stack.
import plateSpec from '../specs/cable_shrug.mjs';
import { RED_FLAG, RED_FLAG_SHOULDER } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_SHOULDER };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'exercise-com-cable-shrug': { cite: 'Cable Shrug (Exercise.com exercise library)', url: 'https://www.exercise.com/exercises/cable-shrug',
    kind: 'coach', access: 'full', checked: '2026-10-19', use: 'CONSENSUS' },
  acsm2009: { cite: 'American College of Sports Medicine position stand. Progression models in resistance training for healthy adults.', url: 'https://pubmed.ncbi.nlm.nih.gov/19204579/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-17', use: 'CONSENSUS' },
  'ace-shrug': { cite: 'ACE Exercise Library: Shrug', url: 'https://www.acefitness.org/resources/everyone/exercise-library/72/shrug/',
    kind: 'guideline', access: 'full', checked: '2026-10-19', use: 'MECH' },
  'sl-barbell-shrug': { cite: 'How to Do Barbell Shrug: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/barbell-shrug/',
    kind: 'coach', access: 'full', checked: '2026-10-19', use: 'MECH' },
  'baechle-grip': { cite: 'Grip selection and location. Excerpt from Baechle and Earle, Weight Training, 5th edition (Human Kinetics)', url: 'https://us.humankinetics.com/blogs/excerpt/grip-selection-and-location',
    kind: 'textbook', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
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
const EX = 'exercise-com-cable-shrug', ACE = 'ace-shrug';
const CL = {
  c1: C(['CONSENSUS'], [EX], 'c1'),
  c2: C(['CONSENSUS'], [EX], 'c2'),
  c4: C(['CONSENSUS'], [EX], 'c4'),
  c5: C(['CONSENSUS'], [EX], 'c5'),
  c9: C(['CONSENSUS', 'MECH'], [ACE], 'c9'),
  c10: C(['CONSENSUS'], ['baechle-grip'], 'c10; card inherit grip.thumb: the rule covers all grips'),
  c12: C(['CONSENSUS'], ['acsm2009'], 'c12'),
  c13: C(['DATA'], ['macdougall1985'], 'c13; card inherit risks[breath]: heavy shrugs are heavy lifts'),
  c14: C(['DATA', 'WEAK'], ['kolber2010'], 'c14; card inherit redFlags: the shoulder is loaded the same way'),
  c17: C(['CONSENSUS', 'MECH'], ['nhs-shoulder-pain'], 'c17'),
  top: C(['CONSENSUS', 'WEAK', 'MECH'], [EX, 'acsm2009', ACE], 'c3, c7, c16'),
  type: C(['CONSENSUS'], [EX], 'c1; card inherit grip.type: the cable bar is also held palms down'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: the end (shoulders up, arms straight; c3, c5) and the spec's Mistake pose merged over
// it, as the engine draws it (card plate.mistake c5: the elbows bend to curl the bar up). The card zoom cshrug-top Wrong
// is the plate's drawn fault (posture zoom M).
const MIS = plateSpec.mistake.pose;
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: plateSpec.poses.end },
  curl: { pose: { ...plateSpec.poses.end, ...MIS } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom except the hand zoom `cshrug-grip` (D-SHIP-HANDW4, above). Zoom shell form (render/closeup/crop.mjs):
// the crop centre is on the right pose for both halves; the Wrong is the spec's Mistake drawn alone (solid).
const zooms = [
  {
    key: 'cshrug-top', chip: 'Top', heading: 'Top position', kind: 'posture',
    crop: { center: { at: 'elbow.r', pose: 'right', off: [0, -10] }, sizePx: 170 },
    right: 'end',
    wrong: { base: 'end', pose: MIS, solid: true },
    callout: {
      right: { text: 'Arms straight', anchor: 'elbow.r' },
      wrong: { text: 'Elbows bent', anchor: 'elbow.r' },
    },
    caption: {
      right: 'Shoulders up, arms straight, standing straight.',
      wrong: 'Elbows bent, curling the bar up.',
    },
    alt: {
      right: 'Side view, top of the lift. Standing straight, the shoulders are raised and the arms hang straight.',
      wrong: 'Side view. The elbows bend and the arms curl the bar up the thighs.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
// The card's first row (top of the shoulders, c8) has no fix, so it is left off the rows (D-SHIP-Q16); the feel line says it.
const feel = {
  primary: [{ muscleId: 'upper_traps', plain: 'The upper traps do the lifting.' }],
  secondary: [],
  watch: [],
  feelLine: 'You should feel this on top of your shoulders, beside the neck.',
  rows: [
    { key: 'biceps', where: 'Biceps working', at: { muscles: ['biceps'] },
      means: '',   // D-FEEL-MEANS-CAUSAL: the card's row gives no cause at its strength; D-FEEL-NOMEANS prints no label
      fix: 'Keep the arms straight.',
      zoom: 'cshrug-top', claim: CL.c5 },
    { key: 'shoulder', where: 'Pain in your shoulder', at: { muscles: ['front_delts'] },
      means: '',   // D-FEEL-MEANS-CAUSAL: the card's row gives no cause at its strength; D-FEEL-NOMEANS prints no label
      fix: "Stop the set. Don't train through the pain.",
      redFlag: 'shoulder', claim: CL.c17 },
  ],
  claim: C(['CONSENSUS', 'MECH', 'DATA', 'WEAK'], ['sl-barbell-shrug', 'ekstrom2003', 'andersen2008'], 'c8, c15'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'curl', title: 'Curling the bar up', zoom: 'cshrug-top', claim: CL.c5,
    fix: 'Keep the arms straight. Only the shoulders move.' },
  { key: 'roll', title: 'Rolling the shoulders', claim: CL.c9,
    fix: 'Lift straight up, lower straight down.' },
  { key: 'slouch', title: 'Not standing up straight', claim: CL.c4,
    fix: 'Stand up straight, head up, eyes forward.' },
];
const RISKS = [
  // === the parent's risks[key=breath] (W4 INHERIT_MAP); the claim is this card's c13
  { key: 'breath', text: 'Heavy reps with a held breath send blood pressure very high.', claim: CL.c13 },
  { key: 'shoulder', text: 'The shoulder is a common injury site in weight training. Poor technique adds risk.', claim: CL.c14 },
];

export default {
  schema: 1,
  id: 'lib_cable_shrug',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'hold',
    why: 'D-SHIP-C3 no-zoom list, D-SHIP-HANDW4: cshrug-grip: no hold key; the cable bar diameter and the contact point are not on the card.',
    orientation: 'pronated',   // === the parent's; card grip.type: overhand, palms down (c1)
    // No handle (Q-W4-6): c1's quote says only "cable bar attachment"; no card gives the bar.
    loadAxis: 'across',        // golden B's hold default (dumbbell_lateral_raise: no push lever check)
    overBody: false,
    width: { text: 'Shoulder width or slightly wider.', claim: CL.c1 },   // own claim (Q-W4-5; refused until the route lands)
    thumb: { mode: 'wrapped', claim: CL.c10 },   // === the parent's handling.thumb.mode
    contact: 'mid-palm',       // CONVENTION: hold default (card notes: grip.handContact is a drawing convention); never shown
    // Own claim (Q-W4-5; refused until the route lands). card grip.wrist: bent back into its natural grip position, about
    // 35 degrees, not curled forward; grip weakens moving away from it, even to 15 degrees (c11). The range runs between
    // the card's two measured positions (15 and 35 degrees of extension); no number from it appears in copy.
    wrist: { ext: [15, 35], limitText: '',   // dropped: it repeated the gripLine's wrist words (sweep point 6)
      claim: C(['DATA', 'MECH'], ['odriscoll1992'], 'c11, card grip.wrist (a card drawing convention until F-LB3-3)') },
    faults: [
      // card zoom cshrug-grip wrong (c11). Not drawn (no hand zoom), so no pose or marker is set.
      { key: 'curled', label: 'Wrist curled', pose: {}, markers: [], alt: 'Wrist curled forward.' },
    ],
    gripLine: 'Overhand, thumbs wrapped around the bar. Wrist bent back in its natural grip position, not curled forward.',
    cue: 'Arms straight, hold the top.',   // c5, c3
  },
  contacts: ['standing-feet'],
  setup: [
    { kind: 'adjust', text: 'Bar attachment on the low pulley.', claim: CL.c1 },
    { kind: 'grip', text: 'Overhand grip, hands shoulder width or a little wider.', claim: CL.c1 },
    { kind: 'position', text: 'Stand close to the pulley, arms straight, bar in front of you.', claim: CL.c2 },
    { kind: 'position', text: 'Stand up straight, head up, eyes forward.', claim: CL.c4 },
    { kind: 'load', text: 'Beat target by one or two reps? Add 2 to 10 percent.', claim: CL.c12 },
  ],
  posture: [
    { key: 'stand', label: 'Stand straight', detail: 'Stand up straight the whole set, head up.',
      anchor: { landmark: 'backUpper', pose: 'start' }, claim: CL.c4 },
    { key: 'arms', label: 'Straight arms', detail: 'Arms straight. Only the shoulders move.',
      anchor: { landmark: 'elbow.r', pose: 'end' }, zoom: 'cshrug-top', claim: CL.c5 },
    { key: 'up', label: 'Straight up', detail: 'Shoulders straight up toward the ears, then down. No rolling.',
      anchor: { landmark: 'shoulderTop.r', pose: 'end' }, claim: CL.c9 },
    { key: 'top', label: 'Hold the top', detail: 'Breathe out as you lift. Hold the top for a second, then lower slowly.',
      anchor: { landmark: 'grip.r', pose: 'end' }, claim: CL.top },
  ],
  feel,
  zooms,
  chips: ['cshrug-top', 'feel'],   // the zoom shell's chip row: the zoom keys, then feel
  copy: {
    setupLine: 'Bar on the low pulley. Stand close, arms straight, bar in front of you.',
    mistakeLine: 'Never curl the bar up with your arms. Only the shoulders lift it.',
    cueLine: 'Shoulders up, hold, lower slowly.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['shoulder'],   // === the parent's; the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/cable_shrug.json', rev: 1 },
};
