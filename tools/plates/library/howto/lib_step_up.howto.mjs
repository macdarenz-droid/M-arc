// LIB-SHIP W5: the How-to content of lib_step_up (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/step_up.json; its claim ids are named on each field's claim.
// Handling (D-SHIP-GRIP case (b), as lib_reverse_lunge): the card's grip.thumb, grip.handContact and grip.wrist are all
// empty (grip note: thumb and wrist would come from the shared hold archetype; no card claim), so there is no hand claim
// to draw or write: NoHandling, and no hand zoom (the card has none). The card's grip.type ("Dumbbells at the sides,
// palms facing in", c5) is setup step 1 and the setup line.
// Variant line (D-LIB5-VARIANT): exercises.json lists 'Dumbbells / Bodyweight'; the card's plate.variantLine says the
// step, torso and lowering claims (c1, c2, c6, c7) do not depend on the load, so they hold for both.
// Zooms: one per card zoom. trunk's Wrong is the plate's drawn Mistake (the trunk thrown forward, c1), at the spec's end
// pose (the step position, D-LIB14-STEPUP-POSE); lead-foot's Wrong is the lead foot planted part off the box (still
// below; the card's wrongNote: the inverse of c6).
// Q-W2-12 (#379 6628699724), as lib_reverse_lunge (NoHandling takes no handling mistakes): the card's handlingMistakes
// are posture checkpoints (mapped below); D-TEXT-GOLDEN: every card posture point and handlingMistake claim is also in a
// shown slot (LIB-SHIP W5 notes, G1 table). The knee over the second toe (c9) needs a front view (card viewWhy): a text
// checkpoint, shown in setup step 2 and the risks.
// Red flag: the card's redFlags (knee), golden B's shared knee block, linked by the knee row.
import plateSpec from '../specs/step_up.mjs';
import { RED_FLAG, RED_FLAG_KNEE } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_KNEE };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'cat-stepup': { cite: 'Catalyst Athletics, Step-up (Exercise Library)', url: 'https://www.catalystathletics.com/exercise/560/Step-up/',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'ace-stepup': { cite: 'Step-Up (ACE Exercise Library)', url: 'https://www.acefitness.org/resources/everyone/exercise-library/28/step-up/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'simenz-2012': { cite: 'Electromyographical analysis of lower extremity muscle activation during variations of the loaded step-up exercise (2012)', url: 'https://pubmed.ncbi.nlm.nih.gov/22237139/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  'nhs-knee': { cite: 'NHS, Knee pain', url: 'https://www.nhs.uk/conditions/knee-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  // RED_FLAG_KNEE's own source (layers/howto/shared.mjs), as golden B's leg_press lists it: the card's redFlags 'knee'.
  'nhs-knee-pain': { cite: 'NHS, Knee pain', url: 'https://www.nhs.uk/symptoms/knee-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When knee pain needs a check.' },
};
// Not cited: hatfield-2017 (c13, hip demand vs other stepping tasks); c4 (starts with the lifting part) and c10 (ACE's
// beginner version) and c14 (reps, repeat or alternate legs: load progression), restated by no field here.

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const CAT = 'cat-stepup', ACE = 'ace-stepup';
const CL = {
  c1: C(['CONSENSUS'], [CAT], 'c1'),
  c2: C(['CONSENSUS'], [CAT], 'c2'),
  c3: C(['CONSENSUS'], [CAT], 'c3'),
  c5: C(['CONSENSUS'], [ACE], 'c5 (card grip.type)'),
  c6: C(['CONSENSUS'], [ACE], 'c6'),
  c9: C(['CONSENSUS'], [ACE], 'c9'),
  c16: C(['CONSENSUS'], ['nhs-knee'], 'c16'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses (D-LIB14-STEPUP-POSE: the spec `start` is standing tall on the box, the spec `end` is
// the step position where the rise begins) and its Mistake pose (card plate.mistake, c1: the trunk thrown forward, the
// trailing foot pushing off its toes), which is the card zoom trunk's Wrong. One new still:
//   'half-foot' (card zoom lead-foot Wrong, "Only the front of the foot on the box"; the card's wrongNote: the inverse
//         of c6): the step position with the lead foot planted OFF_BOX m further back (toward the trailing leg), so its
//         rear half hangs past the box's back edge (BOX_Z0 0.15 m behind the lead mid-foot, the spec's box); the body,
//         arms and trailing foot held (the spec's plant IK bends the lead knee to reach).
// DRAWING VALUE (D-SHIP-DRAWVAL, #376 6614695581; precedent D-LIB7-2 and lib_reverse_lunge's SHORT 0.15 m): OFF_BOX
// 0.2 m is a Wrong-pose size no card gives; no number from it appears in user copy; the layers panel judges it.
const OFF_BOX = 0.2;
const END = plateSpec.poses.end, MIS = plateSpec.mistake.pose, LEAD = END.plant.r;
const HALF_FOOT = { plant: { ...END.plant, r: { ...LEAD, at: [LEAD.at[0], LEAD.at[1], LEAD.at[2] - OFF_BOX] } } };
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  'trunk-forward': { pose: { ...END, ...MIS } },
  'half-foot': { pose: { ...END, ...HALF_FOOT } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// The zoom shell's shape (callout with an anchor at the landmark it names; pilot-a.closeups.mjs), as
// lib_reverse_lunge's; each Wrong is drawn alone (solid). Crop centres (`off`) and `sizePx` are drawing values the layers
// panel judges.
const zooms = [
  {
    key: 'trunk', chip: 'Trunk', heading: 'Trunk angle', kind: 'posture',
    crop: { center: { at: 'sternum', pose: 'right', off: [0, 20] }, sizePx: 190 },
    right: 'end',
    wrong: { base: 'end', pose: MIS, solid: true },
    callout: {
      right: { text: 'Torso upright', anchor: 'backUpper' },
      wrong: { text: 'Trunk forward', anchor: 'backUpper' },
    },
    caption: {
      right: 'Torso upright as the top leg drives.',
      wrong: 'Trunk thrown forward to get up.',
    },
    alt: {
      right: 'Side view, one foot on the box. The torso is upright over the hips, dumbbells hanging at the sides.',
      wrong: 'Side view, one foot on the box. The trunk is thrown forward over the front thigh, the back foot pushing.',
    },
    feelRow: 'bottom-leg',
  },
  {
    key: 'lead-foot', chip: 'Foot', heading: 'Lead foot', kind: 'posture',
    crop: { center: { at: 'ankle.r', pose: 'right', off: [0, -10] }, sizePx: 140 },
    right: 'end',
    wrong: { base: 'end', pose: HALF_FOOT, solid: true },
    callout: {
      right: { text: 'Whole foot down', anchor: 'heel.r' },
      wrong: { text: 'Front of foot', anchor: 'heel.r' },
    },
    caption: {
      right: 'Whole foot flat on the box.',
      wrong: 'Only the front of the foot on the box.',
    },
    alt: {
      right: 'Side view, lead foot on the box. The whole foot, heel to toes, rests flat on the box top.',
      wrong: 'Side view, lead foot on the box. Only the front of the foot is on the box, the heel hangs off.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  // c3 (foot position shifts the emphasis), the card posture point 'Foot closer ... farther ...' (D-TEXT-GOLDEN)
  primary: [
    { muscleId: 'quads', plain: 'The front thigh works, more with the foot closer.' },
    { muscleId: 'glutes', plain: 'The glutes work, more with the foot farther and the shin vertical.' },
  ],
  secondary: [
    { muscleId: 'hamstrings', plain: 'The hamstrings help, more with the foot farther forward.' },
    { muscleId: 'calves', plain: 'The calves extend the ankle.' },
  ],
  watch: [],
  // The card's first row (top leg's thigh and glute, c11) has no fix, so it is left off the rows (D-SHIP-Q16).
  feelLine: "You should feel this in the top leg's thigh and glute.",
  rows: [
    { key: 'bottom-leg', where: 'Mostly the bottom leg', at: { muscles: ['quads', 'calves'] },
      means: 'The bottom foot is pushing you up.',   // W5 K4 (c1)
      fix: 'Let the top leg do the work.',
      zoom: 'trunk', claim: CL.c1 },
    { key: 'knee', where: 'Very painful, locking or giving-way knee', at: { parts: ['knee-left', 'knee-right'] },
      means: 'Not a training feeling.',
      fix: 'Stop the set.',
      redFlag: 'knee', claim: CL.c16 },
  ],
  claim: C(['DATA', 'CONSENSUS', 'MECH'], ['simenz-2012', CAT], 'c11, c3, c12'),
};

/* ---------------------------------------------------------------- risks (card risks; handlingMistakes are posture, Q-W2-12) */
const RISKS = [
  { key: 'drop', text: 'Dropping off the box instead of lowering under control.', claim: CL.c2 },
  { key: 'knee-in', text: 'Knee or ankle collapsing inward.', claim: CL.c9 },
];

export default {
  schema: 1,
  id: 'lib_step_up',
  rev: 1,
  plate: plateSpec,
  handling: { archetype: 'none', why: 'D-SHIP-GRIP: the card gives no thumb, contact or wrist claim.' },
  contacts: ['standing-feet'],
  setup: [
    { kind: 'position', text: 'Dumbbells at the sides, palms facing in, feet hip width apart.', claim: CL.c5 },
    { kind: 'position', text: 'Whole foot firmly on the box, knee over the second toe.', zoom: 'lead-foot', claim: CL.c6 },
    // c3 (card posture point) moved here from the feel lines (not shown on the page, D-TEXT-GOLDEN)
    { kind: 'position', text: 'Foot closer for more quads, farther for glutes and hamstrings.', claim: CL.c3 },
    { kind: 'position', text: 'Stand up with the top leg, little help from the bottom foot.', zoom: 'trunk', claim: CL.c1 },
    { kind: 'finish', text: 'Step the trailing foot down first, controlling the way down.',
      claim: C(['CONSENSUS'], [ACE, CAT], 'c8, c2') },
  ],
  posture: [
    { key: 'foot', label: 'Whole foot down', detail: 'Whole lead foot on the box.',
      anchor: { landmark: 'heel.r', pose: 'end' }, zoom: 'lead-foot', claim: CL.c6 },
    // Q-W2-12: handlingMistake 'Lurching the trunk forward.' (c1) merged here, its fix added
    { key: 'torso', label: 'Torso upright', detail: 'Torso upright, only a slight forward lean. Stand up using the top leg, not a forward lean.',
      anchor: { landmark: 'backUpper', pose: 'end' }, zoom: 'trunk', claim: C(['CONSENSUS'], [ACE, CAT], 'c7, c1') },
    // front-view point (card viewWhy): a text checkpoint. Q-W2-12: handlingMistake 'Knee or ankle collapsing inward.' (c9)
    // merged here; its fix ("Keep the knee over the second toe.") is this detail's first half
    { key: 'knee', label: 'Knee over toe', detail: "Knee over the second toe. Foot and ankle don't roll in or out.",
      anchor: { landmark: 'knee.r', pose: 'end' }, claim: CL.c9 },
    { key: 'placement', label: 'Foot placement', detail: 'Foot closer for more quads, farther with a vertical shin for more glutes and hamstrings.',
      anchor: { landmark: 'ankle.r', pose: 'end' }, claim: CL.c3 },
    // Q-W2-12: handlingMistake 'Dropping down off the box.' (c2)
    { key: 'drop', label: 'Dropping down', detail: 'Lower yourself under control.',
      anchor: { landmark: 'heel.l', pose: 'end' }, claim: CL.c2 },
  ],
  feel,
  zooms,
  chips: ['trunk', 'lead-foot', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'Dumbbells at the sides, palms facing in. Whole foot on the box, knee over the second toe.',
    mistakeLine: 'Never lurch the trunk forward to get up. Keep the torso upright, only a slight lean.',
    cueLine: 'Top leg drives, torso upright.',
    // D-LIB5-VARIANT: the card's plate.variantLine: c1, c2, c6, c7 hold for both loads.
    variantLine: 'Same form with bodyweight only, no dumbbells.',
  },
  redFlag: RED_FLAG,
  mistakes: [],   // Q-W2-12 (#379 6628699724): the card's handlingMistakes are posture checkpoints above
  risks: RISKS,
  riskFlags: ['knee'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/step_up.json', rev: 1 },
};
