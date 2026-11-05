// LIB-SHIP W5: the How-to content of lib_wall_sit (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/wall_sit.json; its claim ids are named on each field's claim.
// Handling: none (card archetype.hand 'none', grip note: no source gives a hand position; every grip field empty, so no
// hand claim and no hand zoom).
// Family (card parent bodyweight_squat, inherit[] posture[1] and b10 / redFlags knee; D-SHIP-FAMILY, D-LIB9a-MAP form;
// SHIP W5 PLAN RULED Q-W5-6, D-SHIP-W5-WALLSIT): posture[key=knees] label and detail are the parent sheet's strings
// exactly (lib_bodyweight_squat.howto.mjs), and riskFlags is the parent's ['knee']. Each claim cites this card's own
// inherit reason. The card's own w4 point (knees directly above the ankles) is its own checkpoint `ankles`: the two
// rules both hold in a wall sit (side-to-side over the second toe, fore-aft over the ankle). No `extends` (D-LIB5-FAMILY).
// Zooms: one per card zoom. knee-over-ankle's Wrong is the plate's drawn Mistake (feet too close, w8); back-on-wall's
// Wrong is the held pose moved off the wall (still below).
// Q-W2-12 (#379 6628699724): the card's handlingMistakes are posture checkpoints (mapped below); D-TEXT-GOLDEN: every
// card posture point and handlingMistake claim is also in a shown slot (LIB-SHIP W5 notes, G1 table).
// D-TEXT-PROGRESSION: the card's harder versions (w6: one foot lifted, single leg, weight on the thighs) are not on the sheet.
// Red flag: the card's redFlags (knee), golden B's shared knee block, linked by the knee row.
import plateSpec from '../specs/wall_sit.mjs';
import { RED_FLAG, RED_FLAG_KNEE } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_KNEE };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'cat-wallsit': { cite: 'Catalyst Athletics, Wall Sit (Exercise Library)', url: 'https://www.catalystathletics.com/exercise/749/Wall-Sit/',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'physitrack-wallsit': { cite: 'Step-by-step guide to the wall sit exercise (Physitrack)', url: 'https://www.physitrack.com/exercise-library/how-to-perform-the-wall-sit-exercise',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'goldring-2014': { cite: 'The effects of isometric wall squat exercise on heart rate and blood pressure in a normotensive population (2014)', url: 'https://pubmed.ncbi.nlm.nih.gov/23879248/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  'escamilla-2023': { cite: 'Patellofemoral Joint Loading during the Performance of the Wall Squat and Ball Squat with Heel-to-Wall-Distance Variations (2023)', url: 'https://pubmed.ncbi.nlm.nih.gov/37057713/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'MECH' },
  'escamilla-2009': { cite: 'Patellofemoral joint force and stress during the wall squat and one-leg squat (2009)', url: 'https://pubmed.ncbi.nlm.nih.gov/19276845/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'MECH' },
  'watanabe-2022': { cite: 'Effect of breath-hold on the responses of arterial blood pressure and cerebral blood velocity to isometric exercise (2022)', url: 'https://pubmed.ncbi.nlm.nih.gov/34618221/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'MECH' },
  'nhs-knee': { cite: 'NHS, Knee pain', url: 'https://www.nhs.uk/conditions/knee-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  // RED_FLAG_KNEE's own source (layers/howto/shared.mjs), as golden B's leg_press lists it: the card's redFlags 'knee'.
  'nhs-knee-pain': { cite: 'NHS, Knee pain', url: 'https://www.nhs.uk/symptoms/knee-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When knee pain needs a check.' },
};

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const CAT = 'cat-wallsit', PT = 'physitrack-wallsit';
const CL = {
  w2: C(['CONSENSUS'], [CAT], 'w2'),
  w4: C(['CONSENSUS'], [PT], 'w4'),
  w5: C(['CONSENSUS'], [PT], 'w5'),
  w7: C(['DATA'], ['goldring-2014'], 'w7'),
  w8: C(['MECH'], ['escamilla-2023', 'escamilla-2009'], 'w8'),
  w10: C(['MECH'], ['watanabe-2022'], 'w10'),
  w11: C(['CONSENSUS', 'WEAK'], [PT], 'w11'),
  w12: C(['CONSENSUS'], ['nhs-knee'], 'w12'),
};
// The parent's knees checkpoint (lib_bodyweight_squat.howto.mjs, its card b5), by this card's inherit[] reason.
const INHERIT_KNEES = C(['MECH'], [], 'card inherit posture[1]: the wall sit holds a squat position on the same feet, so the parent\'s knee-over-foot rule (bodyweight_squat b5) holds; w4 adds toes slightly out.');

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own held pose (the end, w2, w4, w5) and its Mistake pose (card plate.mistake, w8: both feet
// FEET_IN nearer the wall, the knees past the toes), which is the card zoom knee-over-ankle's Wrong. One new still:
//   'off-wall' (card zoom back-on-wall Wrong, w5: "Buttocks away from the wall"; the inverse of w5): the held body,
//         pelvis and trunk unchanged, moved AWAY m forward off the wall face; the feet stay on their floor spots (the
//         spec's plant IK) and the hands stay on the thighs (the spec's reach targets moved with the body).
// DRAWING VALUE (D-SHIP-DRAWVAL, #376 6614695581; precedent D-LIB7-2 and lib_reverse_lunge's SHORT 0.15 m): AWAY 0.12 m
// is a Wrong-pose size no card gives; no number from it appears in user copy; the layers panel judges it.
const AWAY = 0.12;
const END = plateSpec.poses.end, MIS = plateSpec.mistake.pose;
const fwd = a => [a[0], a[1], a[2] + AWAY];
const OFF_WALL = {
  root: { ...END.root, at: fwd(END.root.at) },
  reach: { l: { ...END.reach.l, at: fwd(END.reach.l.at) }, r: { ...END.reach.r, at: fwd(END.reach.r.at) } },
};
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  'feet-close': { pose: { ...END, ...MIS } },
  'off-wall': { pose: { ...END, ...OFF_WALL } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// The zoom shell's shape (callout with an anchor at the landmark it names; pilot-a.closeups.mjs), as box_jump's
// landing-knees; each Wrong is drawn alone (solid). Crop centres (`off`) and `sizePx` are drawing values the layers
// panel judges.
const zooms = [
  {
    key: 'knee-over-ankle', chip: 'Knees', heading: 'Knee over ankle', kind: 'posture',
    crop: { center: { at: 'knee.r', pose: 'right', off: [8, 32] }, sizePx: 150 },
    right: 'end',
    wrong: { base: 'end', pose: MIS, solid: true },
    callout: {
      right: { text: 'Shin vertical', anchor: 'knee.r' },
      wrong: { text: 'Knee past toes', anchor: 'knee.r' },
    },
    caption: {
      right: 'Shin vertical, knee directly above the ankle.',
      wrong: 'Feet close to the wall, knee past the toes.',
    },
    alt: {
      right: 'Side view, wall sit. The shin is vertical, the knee straight above the ankle, the foot out in front.',
      wrong: 'Side view, wall sit. The feet sit close to the wall and the knee passes the toes.',
    },
    feelRow: 'kneecap',
  },
  {
    key: 'back-on-wall', chip: 'Back', heading: 'Back on wall', kind: 'posture',
    crop: { center: { at: 'buttock', pose: 'right', off: [10, -30] }, sizePx: 160 },
    right: 'end',
    wrong: { base: 'end', pose: OFF_WALL, solid: true },
    callout: {
      right: { text: 'On the wall', anchor: 'buttock' },
      wrong: { text: 'Off the wall', anchor: 'buttock' },
    },
    caption: {
      right: 'Back and buttocks flat on the wall.',
      wrong: 'Buttocks away from the wall.',
    },
    alt: {
      right: 'Side view, wall sit. The back and buttocks rest flat against the wall, hips and knees about 90 degrees.',
      wrong: 'Side view, wall sit. The buttocks and back have come away from the wall, a gap behind them.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'quads', plain: 'The front of the thighs does the hold.' }],
  secondary: [],
  watch: [],
  // The card's first row (front of the thighs, w11) has no fix, so it is left off the rows (D-SHIP-Q16).
  feelLine: 'You should feel this in the front of your thighs.',
  rows: [
    { key: 'kneecap', where: 'Around the kneecap', at: { parts: ['knee-left', 'knee-right'] },
      means: 'Feet too close to the wall, or the hold is too deep.',
      fix: 'Walk your feet further out. Hold higher on the wall.',
      zoom: 'knee-over-ankle', claim: C(['MECH'], ['escamilla-2023', 'escamilla-2009'], 'w8, w9') },
    { key: 'knee', where: 'Very painful, locking or giving-way knee', at: { parts: ['knee-left', 'knee-right'] },
      means: 'Not a training feeling.',
      fix: 'Stop the hold.',
      redFlag: 'knee', claim: CL.w12 },
  ],
  claim: CL.w11,
};

/* ---------------------------------------------------------------- risks (card risks; handlingMistakes are posture, Q-W2-12) */
const RISKS = [
  { key: 'pressure', text: 'Blood pressure rises during the hold, more the deeper you go.', claim: CL.w7 },
  { key: 'breath', text: 'Holding the breath raises blood pressure further during the hold.', claim: CL.w10 },
  { key: 'feet-close', text: 'Feet too close to the wall load the kneecap more.', claim: CL.w8 },
];

export default {
  schema: 1,
  id: 'lib_wall_sit',
  rev: 1,
  plate: plateSpec,
  handling: { archetype: 'none' },
  contacts: ['standing-feet'],
  setup: [
    { kind: 'position', text: 'Back on the wall, feet out front, shoulder width, toes slightly out.',
      claim: C(['CONSENSUS'], [PT, CAT], 'w4, w2') },
    { kind: 'position', text: 'Slide down until hips and knees are about 90 degrees.', claim: C(['CONSENSUS'], [CAT], 'w2, w3') },
    { kind: 'position', text: 'Knees right above the ankles. Move the feet if not.', zoom: 'knee-over-ankle',
      claim: C(['MECH', 'CONSENSUS'], ['escamilla-2023', 'escamilla-2009', PT], 'w8, w4') },
    { kind: 'position', text: 'Knees over the second toe, ankles not rolling.', claim: INHERIT_KNEES },   // === the parent's knees detail
    { kind: 'position', text: 'Hold 30-60 seconds and keep breathing steadily.', claim: C(['CONSENSUS', 'MECH'], [CAT, 'watanabe-2022'], 'w3, w10') },
  ],
  posture: [
    // Q-W2-12: handlingMistake 'Back leaving the wall.' (w5) merged here; its fix is this detail
    { key: 'back', label: 'Back on wall', detail: 'Back and buttocks on the wall.',
      anchor: { landmark: 'backUpper', pose: 'end' }, zoom: 'back-on-wall', claim: CL.w5 },
    // === the parent's posture[key=knees] label and detail (D-SHIP-W5-WALLSIT); the claim is this card's inherit reason
    { key: 'knees', label: 'Knees follow toes', detail: 'Knees over the second toe, ankles not rolling.',
      anchor: { landmark: 'knee.r', pose: 'end' }, claim: INHERIT_KNEES },
    // the card's own w4; Q-W2-12: handlingMistake 'Feet too close to wall.' (w8) merged here, its fix added
    { key: 'ankles', label: 'Knees over ankles', detail: 'Knees directly above the ankles. Feet too close to the wall? Walk them out until the knees are over the ankles.',
      anchor: { landmark: 'knee.r', pose: 'end' }, zoom: 'knee-over-ankle', claim: C(['CONSENSUS', 'MECH'], [PT, 'escamilla-2023', 'escamilla-2009'], 'w4, w8') },
    { key: 'depth', label: 'About 90 degrees', detail: 'Hips and knees about 90 degrees.',
      anchor: { landmark: 'hip.r', pose: 'end' }, claim: CL.w2 },
    // Q-W2-12: handlingMistake 'Holding your breath.' (w10)
    { key: 'breath', label: 'Holding your breath', detail: 'Keep breathing steadily.',
      anchor: { landmark: 'chest', pose: 'end' }, claim: CL.w10 },
  ],
  feel,
  zooms,
  chips: ['knee-over-ankle', 'back-on-wall', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'Back on the wall, feet out front. Slide down until hips and knees are about 90 degrees.',
    mistakeLine: 'Feet too close to the wall? Walk them out until the knees are over the ankles.',
    cueLine: 'Back on wall, knees over ankles.',
  },
  redFlag: RED_FLAG,
  mistakes: [],   // Q-W2-12 (#379 6628699724): the card's handlingMistakes are posture checkpoints above
  risks: RISKS,
  riskFlags: ['knee'],   // the card's redFlags; === the parent's riskFlags (inherit[] b10 / redFlags knee)
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/wall_sit.json', rev: 1 },
};
