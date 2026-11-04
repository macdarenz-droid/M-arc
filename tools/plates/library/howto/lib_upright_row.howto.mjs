// LIB-SHIP W2: the How-to content of lib_upright_row (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/upright_row.json; its claim ids are named on each field's claim.
// No hand zoom (D-SHIP-HANDW2, no-zoom.json gap-ruled): no pair key variant draws this card's hand zoom `urow-grip`
// (c1, c7, c14, c5), and no per-id hand pose is drawn without every number (ruling 8). Its hand claims (overhand,
// about shoulder width or wider, thumbs wrapped, wrists straight) live in handling and setup step 2; its Wrong (hands
// too close together, c5) is handling mistake 2.
// Front-view plate: the posture crop is cut in the plate's own view (no `view` override).
// Red flags: the card's redFlags (shoulder): golden B's shared shoulder block, linked by the pain row.
// Variant line (D-LIB5-VARIANT): equipment 'Cable / Barbell'; the card's plate.variantLine says the barbell is drawn,
// every body and height claim (c2-c6, c12) holds for the cable version, and c9 says it may feel easier on the shoulders.
import plateSpec from '../specs/upright_row.mjs';
import { RED_FLAG, RED_FLAG_SHOULDER } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_SHOULDER };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'sl-upright-row': { cite: 'How to Do Barbell Upright Row: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/barbell-upright-row/',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'lesmills-upright-row': { cite: 'Upright rows (Bryce Hastings, Les Mills Fit Planet)', url: 'https://www.lesmills.com/fit-planet/fitness/upright-rows',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  mcallister2013: { cite: 'Effect of grip width on electromyographic activity during the upright row.', url: 'https://pubmed.ncbi.nlm.nih.gov/22362088/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  // cite as docs/research/howto/sources.json already holds it (same url, kind, access and checked as the card)
  kolber2010: { cite: 'Kolber MJ et al. (2010) Shoulder injuries attributed to resistance training: a brief review. J Strength Cond Res 24(6):1696-704', url: 'https://pubmed.ncbi.nlm.nih.gov/20508476/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'WEAK' },
  'baechle-grip': { cite: 'Grip selection and location. Excerpt from Baechle and Earle, Weight Training, 5th edition (Human Kinetics)', url: 'https://us.humankinetics.com/blogs/excerpt/grip-selection-and-location',
    kind: 'textbook', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  // RED_FLAG_SHOULDER's own source (layers/howto/shared.mjs), as golden B's lateral raise lists it: the card's redFlags 'shoulder'.
  'nhs-shoulder-pain': { cite: 'NHS, Shoulder pain', url: 'https://www.nhs.uk/conditions/shoulder-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When shoulder pain needs a check.' },
};
// Not cited: acsm2009 (c10 tempo, plate only; c11 load steps, no field restates it).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const SL = 'sl-upright-row', LM = 'lesmills-upright-row';
const CL = {
  c2: C(['CONSENSUS'], [SL], 'c2'),
  c3: C(['CONSENSUS'], [SL], 'c3'),
  c5: C(['MECH', 'CONSENSUS'], [LM], 'c5'),
  c6: C(['CONSENSUS'], [LM], 'c6'),
  c7: C(['DATA'], ['mcallister2013'], 'c7'),
  c12: C(['CONSENSUS'], [SL], 'c12'),
  c13: C(['DATA', 'WEAK'], ['kolber2010'], 'c13'),
  c14: C(['CONSENSUS'], ['baechle-grip'], 'c14'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: the end (elbows level with the shoulders, bar at the lower ribs, c6) and the chin
// still for the card zoom urow-top's Wrong (bar under the chin, elbows above the shoulders; card plate.mistake, c5).
// W2 panel fix (#6633524031, L1): the chin still is the plate's own Mistake (bar height and depth, elbow pole) with the
// hands drawn in under the chin (HAND_IN, m from the midline, a drawing value; c5: "pulling the bar up under the chin").
// At the plate's grip (0.25 m) the hand projects onto the shoulder in this front view, so the folded forearm and fist
// hide inside the upper arm and the bar floats (L1). With the hands in, the forearms run down and in from the raised
// elbows to the hands on the bar under the chin. The Wrong crop draws the still alone and solid (merged over the end
// pose), as lib_triceps_pushdown's ELBOWS_FORWARD. No number from it appears in user copy.
const MR = plateSpec.mistake.pose.reach, HAND_IN = 0.12;
const CHIN = { reach: {
  l: { ...MR.l, at: [HAND_IN, MR.l.at[1], MR.l.at[2]] },
  r: { ...MR.r, at: [-HAND_IN, MR.r.at[1], MR.r.at[2]] },
} };
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: plateSpec.poses.end },
  chin: { pose: { ...plateSpec.poses.end, ...CHIN } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom except the hand zoom `urow-grip` (D-SHIP-HANDW2, above). Zoom shell form (render/closeup/crop.mjs),
// in the plate's front view: the crop centre is on the right pose's chest for both halves, wide enough for both
// elbows; the Wrong is the chin still drawn alone (solid), whole arms to the hands on the bar.
const zooms = [
  {
    key: 'urow-top', chip: 'Top', heading: 'Top position', kind: 'posture',
    crop: { center: { at: 'chest', pose: 'right', off: [0, -10] }, sizePx: 190 },
    right: 'end',
    wrong: { base: 'end', pose: CHIN, solid: true },
    callout: {
      right: { text: 'Elbows level', anchor: 'elbow.l' },
      wrong: { text: 'Bar under chin', anchor: 'grip.l' },
    },
    caption: {
      right: 'Elbows level with shoulders, bar at the lower ribs.',
      wrong: 'Bar under the chin, elbows above the shoulders.',
    },
    alt: {
      right: 'Front view, top of the row. The elbows are out to the sides, level with the shoulders. The bar is at the lower ribs.',
      wrong: 'Front view. The bar is pulled up under the chin, and the elbows rise above the shoulders. The forearms run down and in to the hands.',
    },
    feelRow: 'shoulder',
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
// The card's first row (side of the shoulders, c8) has no fix, so it is left off the rows (D-SHIP-Q16); the feel line
// says it.
// W2 panel fix (#6633524031, content): c8 names the side delts the main movers and the trapezius secondary, so the
// upper traps are secondary here (the card's feel.primary lists them under c7, an EMG result on grip width, not a
// ranking of movers) and the feel line names only the sides of the shoulders (c8).
const feel = {
  primary: [
    { muscleId: 'side_delts', plain: 'The side delts are the main movers.' },
  ],
  secondary: [
    { muscleId: 'upper_traps', plain: 'The upper traps help, more with a wider grip.' },
    { muscleId: 'front_delts', plain: 'The front delts help.' },
    { muscleId: 'biceps', plain: 'The biceps help, more with a narrower grip.' },
  ],
  watch: [],
  feelLine: 'You should feel this in the sides of your shoulders.',
  rows: [
    { key: 'biceps', where: 'Mostly the biceps', at: { muscles: ['biceps'] },
      means: 'A narrower grip gives more biceps work and less shoulder work.',
      // W2 panel fix: the fix restates handling mistake 2's fix (c5: a too-narrow grip; card grip.width, c5 and c7)
      fix: 'Widen the grip to about shoulder width or more.',
      claim: C(['DATA', 'MECH', 'CONSENSUS'], ['mcallister2013', LM], 'c7, c5') },
    { key: 'shoulder', where: 'Shoulder discomfort or pain', at: { muscles: ['side_delts', 'front_delts'] },
      means: 'Elbows above the shoulders, or the bar under the chin.',
      fix: "Stop and don't train through the pain. Keep upper arms below shoulder height.",
      zoom: 'urow-top', redFlag: 'shoulder', claim: C(['CONSENSUS', 'MECH'], [SL, LM], 'c15, c5, c2') },
  ],
  libraryDiff: { add: ['front_delts'], why: 'The front delts are named as secondary movers (card c8).' },
  claim: C(['CONSENSUS', 'DATA'], [SL, 'mcallister2013'], 'c8, c7'),   // c8: movers and their ranks; c7: grip width
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'chin', title: 'Bar pulled under the chin', zoom: 'urow-top', claim: CL.c5,
    fix: 'Stop at the lower ribs, elbows level with the shoulders.' },
  { key: 'narrow', title: 'Hands too close together', claim: CL.c5,
    fix: 'Widen the grip to about shoulder width or more.' },
  { key: 'wrists', title: 'Lifting with wrists, elbows dropping', claim: CL.c3,
    fix: 'Lead with the elbows out to the sides.' },
];
const RISKS = [
  { key: 'pinch', text: 'Shoulder pinching at the top when the elbows rise above the shoulders.', claim: CL.c5 },
  { key: 'common', text: 'The shoulder is a common injury site in weight training.', claim: CL.c13 },
];

export default {
  schema: 1,
  id: 'lib_upright_row',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'pull',
    why: 'D-SHIP-HANDW2: no pair key variant draws this card\'s barbell grip (ruling 8); the grip copy carries c1, c7 and c14.',
    orientation: 'pronated',   // card grip.type: overhand (c1)
    handle: 'bar-28',          // the spec's engine barbell, 28 mm shaft
    width: { text: 'About shoulder width or wider. Never hands close together.',
      claim: C(['MECH', 'CONSENSUS', 'DATA'], [LM, 'mcallister2013'], 'c5, c7') },
    thumb: { mode: 'wrapped', claim: CL.c14 },
    contact: 'finger-base',    // card grip.handContact: across the base of the fingers (pull archetype)
    // card grip.wrist: "Straight; don't lift with the wrists" (c3). The range is the pull archetype's recorded
    // convention (tools/plates/library/hands/pairs.mjs CONVENTIONS 'ga:pull-base': extension 0 to 25), not a card number.
    wrist: { ext: [0, 25], limitText: 'Wrists straight. Lift with the shoulders, not the wrists.',
      claim: C(['CONSENSUS'], [SL], 'c3, card grip.wrist. The ext range is pairs.mjs CONVENTIONS ga:pull-base, a convention, not a card number.') },
    faults: [],   // the card zoom's Wrong (hands too close, c5) is a width fault, not a hand pose: handling mistake 2
    gripLine: 'Overhand, about shoulder width or wider, thumbs around the bar.',   // c1, c7, c14
    cue: 'Elbows lead, out to the sides.',   // c3
  },
  contacts: ['standing-feet'],
  setup: [
    { kind: 'position', text: 'Stand upright, feet about shoulder width, chest up.', claim: CL.c12 },
    { kind: 'grip', text: 'Overhand grip about shoulder width or wider, thumbs around the bar.',
      claim: C(['DATA', 'CONSENSUS'], ['mcallister2013', SL, 'baechle-grip'], 'c7, c1, c14') },
    { kind: 'brace', text: 'Draw the shoulder blades back before the first pull.', claim: CL.c6 },
    { kind: 'load', text: 'Start light, with few sets.', claim: CL.c2 },
  ],
  posture: [
    { key: 'elbows', label: 'Elbows lead', detail: 'Elbows out to the sides, leading the bar.',
      anchor: { landmark: 'elbow.l', pose: 'end' }, claim: CL.c3 },
    { key: 'height', label: 'Shoulder height', detail: 'Elbows no higher than the shoulders.',
      anchor: { landmark: 'elbow.r', pose: 'end' }, zoom: 'urow-top', claim: CL.c2 },
    { key: 'bar', label: 'Bar close', detail: 'Bar close to the body.',
      anchor: { landmark: 'grip.r', pose: 'end' }, claim: CL.c3 },
    { key: 'shoulders', label: 'Shoulders back', detail: 'Shoulders back, not rounded forward.',
      anchor: { landmark: 'shoulder.r', pose: 'end' }, claim: CL.c5 },
  ],
  feel,
  zooms,
  chips: ['urow-top', 'feel'],   // the zoom shell's chip row: the zoom keys, then feel
  copy: {
    setupLine: 'Stand tall, feet about shoulder width. Overhand grip about shoulder width or wider.',
    mistakeLine: 'Never pull the bar under your chin. Stop with the elbows level with the shoulders.',
    cueLine: 'Elbows to shoulder height.',
    // card plate.variantLine: the body and height claims (c2-c6, c12) hold for the cable version; c9 (CONSENSUS,
    // WEAK, sl-upright-row): a cable upright row may feel easier on the shoulders.
    variantLine: 'Cable version: same form. May feel easier on the shoulders.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['shoulder'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/upright_row.json', rev: 1 },
};
