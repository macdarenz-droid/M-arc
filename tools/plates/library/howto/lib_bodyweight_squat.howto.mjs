// LIB-SHIP W5: the How-to content of lib_bodyweight_squat (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/bodyweight_squat.json; its claim ids are named on each field's claim.
// Handling: none (card archetype.hand 'none', grip note: hands by the sides at the start, b1; every grip field empty, so
// no hand claim and no hand zoom).
// Family: the parent of wall_sit (card parentNote; SHIP W5 PLAN RULED Q-W5-6, D-SHIP-W5-WALLSIT). wall_sit's inherit[]
// posture[1] maps to this sheet's posture[key=knees] label and detail (family.mjs INHERIT_MAP): label "Knees follow toes"
// (b5's side-to-side line, never "Knees over toes"), detail b5's card posture point. Change both sheets together.
// Zooms: the card's bottom zoom is drawn from the plate's own poses (its Wrong is the plate's drawn Mistake, the heel
// lift, b4). The card's feet-and-knees zoom (b5: knees collapsing inward, ankles rolling) is a front view the side plate
// cannot crop, so it is the text checkpoint `knees` (D-SHIP-TEXTZOOM), shown in the mistake line.
// Q-W2-12 (#379 6628699724): the card's handlingMistakes are posture checkpoints (mapped below); D-TEXT-GOLDEN: every
// card posture point and handlingMistake claim is also in a shown slot (LIB-SHIP W5 notes, G1 table).
// Red flag: the card's redFlags (knee), golden B's shared knee block, linked by the knee row.
import plateSpec from '../specs/bodyweight_squat.mjs';
import { RED_FLAG, RED_FLAG_KNEE } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_KNEE };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'ace-bwsquat': { cite: 'Bodyweight Squat (ACE Exercise Library)', url: 'https://www.acefitness.org/resources/everyone/exercise-library/135/bodyweight-squat/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'fry-2003': { cite: 'Effect of knee position on hip and knee torques during the barbell squat (2003)', url: 'https://pubmed.ncbi.nlm.nih.gov/14636100/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'MECH' },
  'nhs-knee': { cite: 'NHS, Knee pain', url: 'https://www.nhs.uk/conditions/knee-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  // RED_FLAG_KNEE's own source (layers/howto/shared.mjs), as golden B's leg_press lists it: the card's redFlags 'knee'.
  'nhs-knee-pain': { cite: 'NHS, Knee pain', url: 'https://www.nhs.uk/symptoms/knee-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When knee pain needs a check.' },
};

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const ACE = 'ace-bwsquat';
const CL = {
  b1: C(['CONSENSUS'], [ACE], 'b1'),
  b3: C(['CONSENSUS'], [ACE], 'b3'),
  b5: C(['CONSENSUS'], [ACE], 'b5'),
  b6: C(['CONSENSUS'], [ACE], 'b6'),
  b7: C(['CONSENSUS'], [ACE], 'b7'),
  b8: C(['MECH'], [ACE, 'fry-2003'], 'b8'),
  b9: C(['CONSENSUS', 'WEAK'], [ACE], 'b9'),
  b10: C(['CONSENSUS'], ['nhs-knee'], 'b10'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: the start (b1), the bottom (b4, b6) and the spec's Mistake pose (card plate.mistake,
// b4: both heels lifted at the bottom, the weight rolled onto the toes), which is the card zoom bottom's drawn Wrong.
// No new geometry, so no drawing value (D-SHIP-DRAWVAL) is added here.
const END = plateSpec.poses.end, MIS = plateSpec.mistake.pose;
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  'heels-up': { pose: { ...END, ...MIS } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// The zoom shell's shape (callout with an anchor at the landmark it names; pilot-a.closeups.mjs), as box_jump's
// landing-knees. The crop runs from the hips to the feet of the bottom pose, so the shin, the lower torso and the heels
// are in both halves (centre `off` and `sizePx` are drawing values the layers panel judges). The Wrong is the plate's
// Mistake drawn alone (solid). The card's second Wrong sign, the back rounding (b4), is not drawn (the plate keeps the
// back flat in its Mistake), so the Wrong caption names the heel lift only; the rounding is in the setup line.
const zooms = [
  {
    key: 'bottom', chip: 'Bottom', heading: 'Bottom position', kind: 'posture',
    crop: { center: { at: 'knee.r', pose: 'right', off: [-12, 22] }, sizePx: 170 },
    right: 'end',
    wrong: { base: 'end', pose: MIS, solid: true },
    callout: {
      right: { text: 'Heels down', anchor: 'heel.r' },
      wrong: { text: 'Heels lift', anchor: 'heel.r' },
    },
    caption: {
      right: 'Shin and torso parallel, back flat, heels down.',
      wrong: 'Heels lifted at the bottom.',
    },
    alt: {
      right: 'Side view, bottom of the squat. Thighs about parallel, shins and torso parallel, back flat, both heels flat.',
      wrong: 'Side view, bottom of the squat. Both heels have lifted off the floor and the weight is on the toes.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'quads', plain: 'The thighs work.' }],
  secondary: [{ muscleId: 'glutes', plain: 'The buttocks and hips work.' }],
  watch: [],
  // The card's first row (thighs and buttocks, b9) has no fix, so it is left off the rows (D-SHIP-Q16).
  feelLine: 'You should feel this in your thighs and buttocks.',
  rows: [
    // no zoom link: the bottom zoom's Wrong draws the heel lift, not the rounding this row names
    { key: 'lower-back', where: 'Lower back', at: { muscles: ['lower_back'] },
      means: 'The torso is rounding at the bottom.',
      fix: 'Stop higher, where the back is still flat.',
      claim: C(['CONSENSUS'], [ACE], 'b4') },
    { key: 'knee', where: 'Very painful, locking or giving-way knee', at: { parts: ['knee-left', 'knee-right'] },
      means: 'Not a training feeling.',
      fix: 'Stop the set.',
      redFlag: 'knee', claim: CL.b10 },
  ],
  claim: CL.b9,
};

/* ---------------------------------------------------------------- risks (card risks; handlingMistakes are posture, Q-W2-12) */
const RISKS = [
  { key: 'knees-back', text: 'Knees held behind the toes likely load the hips and lower back.', claim: CL.b8 },
];

export default {
  schema: 1,
  id: 'lib_bodyweight_squat',
  rev: 1,
  plate: plateSpec,
  handling: { archetype: 'none' },
  contacts: ['standing-feet'],
  setup: [
    { kind: 'position', text: 'Feet slightly wider than hip width, toes slightly out.', claim: CL.b1 },
    { kind: 'brace', text: 'Shoulders down and back, brace, chest up.', claim: C(['CONSENSUS'], [ACE], 'b1, b2') },
    // W5 fix 1: b5 moved here from copy.mistakeLine (copy.* lines are not shown on the page, D-TEXT-GOLDEN); b8 stays
    // in step 4 and the risk; back flat (b3) is in the bottom zoom's Right caption
    { kind: 'position', text: 'Hips back then down. Knees over the second toe, ankles steady.',
      claim: C(['CONSENSUS'], [ACE], 'b3, b5') },
    { kind: 'position', text: 'Lower to thighs about parallel. Knees may pass the toes slightly.',
      zoom: 'bottom', claim: C(['CONSENSUS', 'MECH'], [ACE, 'fry-2003'], 'b4, b8') },
    { kind: 'finish', text: 'Breathe out, push the feet down, hips and chest rise together.', claim: CL.b7 },
  ],
  posture: [
    { key: 'hips', label: 'Hips back', detail: 'Hips back then down.',
      anchor: { landmark: 'buttock', pose: 'end' }, claim: CL.b3 },
    // D-SHIP-W5-WALLSIT: wall_sit carries this label and detail exactly (its inherit[] posture[1]). Card zoom
    // feet-and-knees (front view) as this text checkpoint (D-SHIP-TEXTZOOM). Q-W2-12: handlingMistake 'Knees drifting in
    // or out.' (b5) merged here; its fix ("Keep the knees over the second toe.") is this detail's first half.
    { key: 'knees', label: 'Knees follow toes', detail: 'Knees over the second toe, ankles not rolling.',
      anchor: { landmark: 'knee.r', pose: 'end' }, claim: CL.b5 },
    { key: 'shins', label: 'Shins controlled', detail: 'Shins travel forward under control. Slightly past the toes is fine.',
      anchor: { landmark: 'knee.r', pose: 'end' }, claim: CL.b8 },
    // Q-W2-12: handlingMistakes 'Heels lifting at the bottom.' and 'Back rounding at the bottom.' (both b4) merged here,
    // their fixes added
    { key: 'depth', label: 'Thighs parallel', detail: 'Thighs about parallel at the bottom, back flat. Stop the descent where the heels start to lift or the torso starts to round.',
      anchor: { landmark: 'hip.r', pose: 'end' }, zoom: 'bottom', claim: C(['CONSENSUS'], [ACE], 'b4') },
    { key: 'shin-torso', label: 'Shin and torso', detail: 'Shin and torso parallel at the bottom.',
      anchor: { landmark: 'knee.r', pose: 'end' }, zoom: 'bottom', claim: CL.b6 },
    { key: 'rise', label: 'Rise together', detail: 'Hips and torso rise together, heels flat.',
      anchor: { landmark: 'heel.r', pose: 'end' }, claim: CL.b7 },
  ],
  feel,
  zooms,
  chips: ['bottom', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'Lower until the thighs are about parallel. Stop where the heels lift or the back rounds.',   // b4 (both handlingMistakes' fixes)
    mistakeLine: 'Never let the knees drift in or out. Keep them over the second toe, ankles not rolling.',
    cueLine: 'Hips back, heels down.',
  },
  redFlag: RED_FLAG,
  mistakes: [],   // Q-W2-12 (#379 6628699724): the card's handlingMistakes are posture checkpoints above
  risks: RISKS,
  riskFlags: ['knee'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/bodyweight_squat.json', rev: 1 },
};
