// LIB-SHIP W5: the How-to content of lib_walking_lunge (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/walking_lunge.json; its claim ids are named on each field's claim.
// Parent reverse_lunge (card inherit: plate.view, redFlags.knee, grip; INHERIT_MAP lint/family.mjs). Handling is the
// parent's NoHandling, the whole object identical (grip -> ['handling']): the card's grip.thumb, grip.handContact and
// grip.wrist are all empty (D-SHIP-GRIP case (b)), so there is no hand claim to draw or write and no hand zoom (the card
// has none). The card's own grip.type ("Dumbbells held at the sides", c12) is setup step 1. redFlags.knee -> riskFlags
// ['knee']; plate.view -> [] (nothing written).
// Variant line (D-LIB5-VARIANT): exercises.json lists 'Dumbbells / Barbell'; the card's plate.variantLine: the step,
// shin and trunk claims (c1, c2, c7) come from a load-agnostic page, and c12 names dumbbells at the sides or a barbell.
// Red flag: the card's redFlags (knee), golden B's shared knee block, linked by the knee row.
import plateSpec from '../specs/walking_lunge.mjs';
import { RED_FLAG, RED_FLAG_KNEE } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_KNEE };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'cat-lunge': { cite: 'Catalyst Athletics, Lunge (Exercise Library)', url: 'https://www.catalystathletics.com/exercise/354/Lunge/',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'ace-walk-twist': { cite: 'Walking Lunges with Twists (ACE Exercise Library)', url: 'https://www.acefitness.org/resources/everyone/exercise-library/139/walking-lunges-with-twists/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'WEAK' },
  'bezerra-2021': { cite: 'Influence of Trunk Position during Three Lunge Exercises on Muscular Activation in Trained Women', url: 'https://pubmed.ncbi.nlm.nih.gov/34055138/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  'escamilla-2025': { cite: 'Effects of Step Length and Stride Variation During Forward Lunges on Lower-Extremity Muscle Activity', url: 'https://pubmed.ncbi.nlm.nih.gov/39982282/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'WEAK' },
  'nhs-knee': { cite: 'NHS, Knee pain', url: 'https://www.nhs.uk/conditions/knee-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  // RED_FLAG_KNEE's own source (layers/howto/shared.mjs), as golden B's leg_press lists it: the card's redFlags 'knee'.
  'nhs-knee-pain': { cite: 'NHS, Knee pain', url: 'https://www.nhs.uk/symptoms/knee-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When knee pain needs a check.' },
};
// Not cited: wijethunga-2026 (c11, a slow eccentric variant; no field here restates it); c13 (step-length emphasis) is
// not a posture point on this card.

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const CAT = 'cat-lunge', ACE = 'ace-walk-twist';
const CL = {
  c2: C(['CONSENSUS'], [CAT], 'c2'),
  c4: C(['MECH', 'WEAK'], [ACE], 'c4'),
  c5: C(['MECH', 'WEAK'], [ACE], 'c5'),
  c7: C(['CONSENSUS'], [CAT], 'c7'),
  c8: C(['CONSENSUS'], [CAT], 'c8'),
  c15: C(['CONSENSUS'], ['nhs-knee'], 'c15'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses. The card zoom trunk Wrong (c7: "Chest pitched forward over the front thigh") is the
// plate's drawn fault, the spec's Mistake pose (mistakeAt(M_LEAN): pelvis and trunk pitched until the near shoulder is
// over the middle of the front thigh, arms plumb, legs unmoved). The card zoom front-shin Wrong (c2, c3: "Hips driven
// forward, front shin tipped far forward") is the end pose with one change, the parent's shin-forward form: the front
// foot planted SHORT m further back under the same hips, so the hips and the front knee sit ahead of the front foot and
// the shin tips forward (the rear foot and knee held).
// DRAWING VALUES (D-SHIP-DRAWVAL, #376 6614695581; precedent lib_reverse_lunge's SHORT 0.15 m, D-LIB7-2): SHORT 0.15 m
// is a Wrong-pose size no card gives; no number from it appears in user copy; the layers panel judges it.
const SHORT = 0.15;
const END = plateSpec.poses.end, MIS = plateSpec.mistake.pose;
const SHIN_FORWARD = { plant: { ...END.plant, r: { ...END.plant.r, at: [END.plant.r.at[0], END.plant.r.at[1], END.plant.r.at[2] - SHORT] } } };
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  'chest-forward': { pose: { ...END, ...MIS } },
  'shin-forward': { pose: { ...END, ...SHIN_FORWARD } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom, same keys, order and kinds. The zoom shell's shape (callout with an anchor at the landmark it
// names; pilot-a.closeups.mjs), as the parent's; each Wrong is drawn alone (solid).
const zooms = [
  {
    key: 'trunk', chip: 'Trunk', heading: 'Trunk angle', kind: 'posture',
    crop: { center: { at: 'sternum', pose: 'right', off: [0, 10] }, sizePx: 170 },
    right: 'end',
    wrong: { base: 'end', pose: MIS, solid: true },
    callout: {
      right: { text: 'Trunk upright', anchor: 'sternum' },
      wrong: { text: 'Chest forward', anchor: { at: 'sternum', pose: 'mistake' } },
    },
    caption: {
      right: 'Trunk upright over the hips at the bottom.',
      wrong: 'Chest pitched forward over the front thigh.',
    },
    alt: {
      right: 'Side view, bottom of the step. The trunk is upright over the hips, the dumbbells hang at the sides.',
      wrong: 'Side view, bottom of the step. The chest is pitched forward over the front thigh.',
    },
    feelRow: 'lower-back',
  },
  {
    key: 'front-shin', chip: 'Shin', heading: 'Front shin', kind: 'posture',
    crop: { center: { at: 'knee.r', pose: 'right', off: [-20, 0] }, sizePx: 180 },
    right: 'end',
    wrong: { base: 'end', pose: SHIN_FORWARD, solid: true },
    callout: {
      right: { text: 'Shin vertical', anchor: 'knee.r' },
      wrong: { text: 'Shin tipped', anchor: 'knee.r' },
    },
    caption: {
      right: 'Hips dropped, front shin about vertical.',
      wrong: 'Hips driven forward, front shin tipped far forward.',
    },
    alt: {
      right: 'Side view, bottom of the step. The hips are dropped, the front knee over the ankle, the shin about vertical.',
      wrong: 'Side view, bottom of the step. The hips and front knee are ahead of the front foot, the shin tipped.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [
    { muscleId: 'quads', plain: 'The front of the thighs work hard.' },
    { muscleId: 'glutes', plain: 'The glutes work hard too.' },
  ],
  secondary: [
    { muscleId: 'hamstrings', plain: 'The back of the thighs help.' },
    { muscleId: 'calves', plain: 'The calves help.' },
  ],
  watch: [{ muscleId: 'lower_back', plain: 'Leaning the chest forward makes the lower back work harder.' }],
  // The card's first row (front thighs and glutes, c14) has no fix, so it is left off the rows (D-SHIP-Q16); the feel
  // line says it.
  feelLine: 'You should feel this in the front of your thighs and your glutes.',
  rows: [
    { key: 'lower-back', where: 'Lower back', at: { muscles: ['lower_back'] },
      means: 'The chest is leaning forward.',
      fix: "Stay upright. Go lighter if you can't.",
      zoom: 'trunk', claim: C(['DATA', 'CONSENSUS'], ['bezerra-2021', CAT], 'c9, c7') },
    { key: 'knee', where: 'Very painful, locking or giving-way knee', at: { parts: ['knee-left', 'knee-right'] },
      means: 'Not a training feeling.',
      fix: 'Stop the set.',
      redFlag: 'knee', claim: CL.c15 },
  ],
  claim: C(['DATA', 'WEAK'], ['escamilla-2025', 'bezerra-2021'], 'c14, c10'),
};

/* ---------------------------------------------------------------- risks (card risks; handlingMistakes are posture, Q-W2-12) */
const RISKS = [
  { key: 'heavy', text: 'Too heavy a load costs the upright trunk, the controlled descent and balance.', claim: CL.c7 },
  { key: 'crash', text: 'Crashing into the bottom position instead of lowering under control.', claim: CL.c8 },
];

export default {
  schema: 1,
  id: 'lib_walking_lunge',
  rev: 1,
  plate: plateSpec,
  // Inherited whole from lib_reverse_lunge (INHERIT_MAP grip -> ['handling']): the same archetype and why string.
  handling: { archetype: 'none', why: 'D-SHIP-GRIP: the card gives no thumb, contact or wrist claim.' },
  contacts: ['standing-feet'],
  setup: [
    { kind: 'position', text: 'Stand with feet about hip width apart, dumbbells at your sides.',
      claim: C(['CONSENSUS'], [ACE, CAT], 'c6, c12 (card grip.type)') },
    // D-TEXT-GOLDEN: posture point 'No sideways tilt of the upper body' (c5) placed here
    { kind: 'position', text: 'Step forward heel first, weight onto it slowly, no sideways tilt.', claim: CL.c5 },
    // D-TEXT-GOLDEN: handlingMistake fixes 'Aim the back knee at the front heel' (c3) and 'Lower slowly' (c8) placed here
    { kind: 'position', text: 'Lower slowly, back knee toward the front heel, until it lightly touches.', zoom: 'front-shin',
      claim: C(['CONSENSUS', 'MECH', 'WEAK'], [CAT, ACE], 'c2, c3, c8') },
    { kind: 'position', text: 'Push through the front foot to stand. Swing the back leg forward.', claim: CL.c4 },
    { kind: 'finish', text: 'Keep alternating legs as you move forward.', claim: C(['CONSENSUS', 'MECH', 'WEAK'], [CAT, ACE], 'c1, c4') },
  ],
  posture: [
    { key: 'shin', label: 'Front shin vertical', detail: 'Front shin about vertical at the bottom.',
      anchor: { landmark: 'knee.r', pose: 'end' }, zoom: 'front-shin', claim: CL.c2 },
    // Q-W2-12: handlingMistake 'Driving the hips forward' (c3) merged here, its fix added
    { key: 'hips', label: 'Hips drop down', detail: 'Hips lower down, not forward. Aim the back knee at the front heel.',
      anchor: { landmark: 'buttock', pose: 'end' }, zoom: 'front-shin', claim: C(['MECH', 'WEAK'], [ACE], 'c3') },
    // Q-W2-12: handlingMistake 'Chest pitching forward' (c7) merged here, its fix added
    { key: 'trunk', label: 'Trunk upright', detail: 'Trunk upright. Go lighter until you can stay upright and controlled.',
      anchor: { landmark: 'sternum', pose: 'end' }, zoom: 'trunk', claim: CL.c7 },
    { key: 'tilt', label: 'No sideways tilt', detail: 'No sideways tilt of the upper body.',
      anchor: { landmark: 'chest', pose: 'end' }, claim: CL.c5 },
    // Q-W2-12: handlingMistake 'Dropping fast into the bottom' (c8, c7)
    { key: 'drop', label: 'Dropping fast', detail: 'Lower slowly. Use a weight you can move smoothly.',
      anchor: { landmark: 'hip.r', pose: 'end' }, claim: C(['CONSENSUS'], [CAT], 'c8, c7') },
  ],
  feel,
  zooms,
  chips: ['trunk', 'front-shin', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'Feet about hip width, dumbbells at your sides. Step forward heel first.',
    mistakeLine: 'Never let the chest pitch forward. Go lighter until you stay upright and controlled.',
    cueLine: 'Chest up, front shin vertical.',
    // D-LIB5-VARIANT: c12 (dumbbells at the sides, or a barbell); the card's plate.variantLine: c1, c2, c7 hold for both.
    variantLine: 'Same form with a barbell instead of dumbbells.',
  },
  redFlag: RED_FLAG,
  mistakes: [],   // Q-W2-12 (#379 6628699724): the card's handlingMistakes are posture checkpoints above
  risks: RISKS,
  riskFlags: ['knee'],   // the card's redFlags (inherited: redFlags.knee -> ['riskFlags'])
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/walking_lunge.json', rev: 1 },
};
