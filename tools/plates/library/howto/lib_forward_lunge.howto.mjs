// LIB-SHIP W5: the How-to content of lib_forward_lunge (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/forward_lunge.json; its claim ids are named on each field's claim.
// Parent reverse_lunge (card inherit: plate.view, redFlags.knee, grip; INHERIT_MAP lint/family.mjs). Handling is the
// parent's NoHandling, the whole object identical (grip -> ['handling']): the card's grip.thumb, grip.handContact and
// grip.wrist are all empty (D-SHIP-GRIP case (b)), so there is no hand claim to draw or write and no hand zoom (the card
// has none). The card's own grip.type ("One dumbbell in each hand, palms facing in, arms straight at the sides", c5) is
// setup step 1. redFlags.knee -> riskFlags ['knee']; plate.view -> [] (nothing written).
// Variant line (D-LIB5-VARIANT): exercises.json lists 'Dumbbells / Barbell'; the card's plate.variantLine: ACE gives a
// barbell (c1) and a dumbbell (c5) version with the same step.
// Red flag: the card's redFlags (knee), golden B's shared knee block, linked by the knee row.
import plateSpec from '../specs/forward_lunge.mjs';
import { RED_FLAG, RED_FLAG_KNEE } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_KNEE };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'ace-fwdlunge-bb': { cite: 'Forward Lunge (ACE Exercise Library, barbell)', url: 'https://www.acefitness.org/resources/everyone/exercise-library/8/forward-lunge/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'cat-lunge': { cite: 'Catalyst Athletics, Lunge (Exercise Library)', url: 'https://www.catalystathletics.com/exercise/354/Lunge/',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'ace-fwdlunge-bw': { cite: 'Forward Lunge (ACE Exercise Library, no equipment)', url: 'https://www.acefitness.org/resources/everyone/exercise-library/94/forward-lunge/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'ace-lunge-db': { cite: 'Lunge (ACE Exercise Library, dumbbells)', url: 'https://www.acefitness.org/resources/everyone/exercise-library/363/lunge/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'goulette-2021': { cite: 'Patellofemoral joint loading during the forward and backward lunge', url: 'https://pubmed.ncbi.nlm.nih.gov/33310585/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  'escamilla-2025': { cite: 'Effects of Step Length and Stride Variation During Forward Lunges on Lower-Extremity Muscle Activity', url: 'https://pubmed.ncbi.nlm.nih.gov/39982282/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  'bezerra-2021': { cite: 'Influence of Trunk Position during Three Lunge Exercises on Muscular Activation in Trained Women', url: 'https://pubmed.ncbi.nlm.nih.gov/34055138/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  'nhs-knee': { cite: 'NHS, Knee pain', url: 'https://www.nhs.uk/conditions/knee-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  // RED_FLAG_KNEE's own source (layers/howto/shared.mjs), as golden B's leg_press lists it: the card's redFlags 'knee'.
  'nhs-knee-pain': { cite: 'NHS, Knee pain', url: 'https://www.nhs.uk/symptoms/knee-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When knee pain needs a check.' },
};
// Not cited: farrokhi-2008 (c10, c11: step and trunk EMG; no field here restates them).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const BB = 'ace-fwdlunge-bb', CAT = 'cat-lunge', BW = 'ace-fwdlunge-bw', DB = 'ace-lunge-db';
const CL = {
  c2: C(['CONSENSUS'], [CAT], 'c2'),
  c5: C(['CONSENSUS'], [DB], 'c5'),
  c6: C(['CONSENSUS'], [CAT], 'c6'),
  c7: C(['CONSENSUS'], [CAT], 'c7'),
  c8: C(['DATA'], ['goulette-2021'], 'c8'),
  c14: C(['CONSENSUS'], ['nhs-knee'], 'c14'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses. The card zoom front-shin Wrong (c3: "Hips driven forward, front shin tipped far
// forward") is the plate's drawn fault, the spec's Mistake pose (mistakeAt(M_SHIN): hips and front knee driven forward,
// shin tipped, hips at the end height). The card zoom back Wrong (c6: "Chest pitched forward over the front thigh") is
// the end pose with one change, the parent's chest-forward form: the pelvis and trunk pitch LEAN deg forward and the
// arms stay plumb (shoulder flexion = lean, as the spec's own arms()); feet held.
// DRAWING VALUES (D-SHIP-DRAWVAL, #376 6614695581; precedent lib_reverse_lunge's LEAN 30, D-LIB7-2): LEAN 30 deg is a
// Wrong-pose size no card gives; no number from it appears in user copy; the layers panel judges it.
const LEAN = 30;
const END = plateSpec.poses.end, MIS = plateSpec.mistake.pose;
const CHEST_FORWARD = { root: { ...END.root, tilt: LEAN }, shoulder: { flex: LEAN } };
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  'hips-forward': { pose: { ...END, ...MIS } },
  'chest-forward': { pose: { ...END, ...CHEST_FORWARD } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom, same keys, order and kinds. The zoom shell's shape (callout with an anchor at the landmark it
// names; pilot-a.closeups.mjs), as the parent's; each Wrong is drawn alone (solid).
const zooms = [
  {
    key: 'front-shin', chip: 'Shin', heading: 'Front shin', kind: 'posture',
    // centre between the front knee and the hips, so the hip drop and the shin both sit in the crop
    crop: { center: { at: 'knee.r', pose: 'right', off: [-20, 0] }, sizePx: 180 },
    right: 'end',
    wrong: { base: 'end', pose: MIS, solid: true },
    callout: {
      right: { text: 'Shin vertical', anchor: 'knee.r' },
      wrong: { text: 'Knee forward', anchor: { at: 'knee.r', pose: 'mistake' } },
    },
    caption: {
      right: 'Hips dropped, front shin about vertical.',
      wrong: 'Hips driven forward, front shin tipped far forward.',
    },
    alt: {
      right: 'Side view, bottom of the lunge. The hips are dropped, the front knee over the ankle, the shin about vertical.',
      wrong: 'Side view, bottom of the lunge. The hips and front knee are driven forward, the shin tipped far over the foot.',
    },
  },
  {
    key: 'back', chip: 'Back', heading: 'Back position', kind: 'posture',
    crop: { center: { at: 'sternum', pose: 'right', off: [0, 10] }, sizePx: 170 },
    right: 'end',
    wrong: { base: 'end', pose: CHEST_FORWARD, solid: true },
    callout: {
      right: { text: 'Back straight', anchor: 'sternum' },
      wrong: { text: 'Chest forward', anchor: 'sternum' },
    },
    caption: {
      right: 'Back straight over the hips.',
      wrong: 'Chest pitched forward over the front thigh.',
    },
    alt: {
      right: 'Side view, bottom of the lunge. The back is straight over the hips, the dumbbells hang at the sides.',
      wrong: 'Side view, bottom of the lunge. The chest is pitched forward over the front thigh.',
    },
    feelRow: 'lower-back',
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
    { muscleId: 'adductors', plain: 'The inner thighs help.' },
  ],
  watch: [{ muscleId: 'lower_back', plain: 'Leaning the chest forward makes the lower back work harder.' }],
  // The card's rows 'Front thighs and glutes' (c9) and 'Front of the knee' (c8) have no fix, so they are left off the
  // rows (D-SHIP-Q16): c9 is in the feel line, c8 in the risks. The feel line also carries posture point c13
  // (D-TEXT-GOLDEN).
  feelLine: 'You should feel this in your thighs and glutes. Longer steps work glutes and hamstrings more, shorter the quads.',
  rows: [
    { key: 'lower-back', where: 'Lower back', at: { muscles: ['lower_back'] },
      means: 'The chest is leaning forward.',
      fix: "Stay upright. Go lighter if you can't.",
      zoom: 'back', claim: C(['DATA', 'CONSENSUS'], ['bezerra-2021', CAT], 'c12, c6') },
    { key: 'knee', where: 'Very painful, locking or giving-way knee', at: { parts: ['knee-left', 'knee-right'] },
      means: 'Not a training feeling.',
      fix: 'Stop the set.',
      redFlag: 'knee', claim: CL.c14 },
  ],
  claim: C(['DATA', 'CONSENSUS'], ['escamilla-2025', CAT], 'c9, c13'),
};

/* ---------------------------------------------------------------- risks (card risks; handlingMistakes are posture, Q-W2-12) */
const RISKS = [
  { key: 'kneecap', text: 'More kneecap-joint load than the reverse lunge.', claim: CL.c8 },
  { key: 'heavy', text: 'Too heavy a load costs the upright trunk, the controlled descent and balance.', claim: CL.c6 },
  { key: 'crash', text: 'Crashing into the bottom position instead of lowering under control.', claim: CL.c7 },
];

export default {
  schema: 1,
  id: 'lib_forward_lunge',
  rev: 1,
  plate: plateSpec,
  // Inherited whole from lib_reverse_lunge (INHERIT_MAP grip -> ['handling']): the same archetype and why string.
  handling: { archetype: 'none', why: 'D-SHIP-GRIP: the card gives no thumb, contact or wrist claim.' },
  contacts: ['standing-feet'],
  setup: [
    { kind: 'position', text: 'Feet hip width, dumbbells at your sides, palms facing in.',
      claim: C(['CONSENSUS'], [DB, BB], 'c5 (card grip.type), c1') },
    { kind: 'position', text: 'Step forward heel first, moving the weight onto it slowly.', claim: C(['CONSENSUS'], [BW], 'c4') },
    // D-TEXT-GOLDEN: handlingMistake 'Dropping fast into the bottom' (c7, c6) fix "Lower slowly" placed here
    { kind: 'position', text: 'Lower slowly, hips straight down, back knee almost to the floor.', zoom: 'front-shin',
      claim: C(['CONSENSUS'], [BB, BW, CAT], 'c1, c3, c7') },
    { kind: 'position', text: 'Push through the front foot and step back to the start.', claim: C(['CONSENSUS'], [BB, CAT], 'c1, c2') },
    { kind: 'finish', text: 'Alternate legs. Keep the back straight throughout.', zoom: 'back', claim: C(['CONSENSUS'], [BB, DB], 'c1, c5') },
  ],
  posture: [
    { key: 'shin', label: 'Front shin vertical', detail: 'Step long enough that the front shin is about vertical at the bottom.',
      anchor: { landmark: 'knee.r', pose: 'end' }, zoom: 'front-shin', claim: CL.c2 },
    // Q-W2-12: handlingMistake 'Driving the hips forward' (c3, c4) merged here, its fix added
    { key: 'hips', label: 'Hips drop down', detail: 'Hips lower down, not forward. Land heel first and drop the hips straight down.',
      anchor: { landmark: 'buttock', pose: 'end' }, zoom: 'front-shin', claim: C(['CONSENSUS'], [BW], 'c3, c4') },
    // Q-W2-12: handlingMistake 'Chest pitching forward' (c6) merged here, its fix added
    { key: 'back', label: 'Back straight', detail: 'Back straight. Go lighter until you can stay upright and controlled.',
      anchor: { landmark: 'backUpper', pose: 'end' }, zoom: 'back', claim: C(['CONSENSUS'], [DB, CAT], 'c5, c6') },
    // Q-W2-12: handlingMistake 'Dropping fast into the bottom' (c7, c6)
    { key: 'drop', label: 'Dropping fast', detail: 'Lower slowly. Use a weight you can move smoothly.',
      anchor: { landmark: 'hip.r', pose: 'end' }, claim: C(['CONSENSUS'], [CAT], 'c7, c6') },
    { key: 'step', label: 'Step length', detail: 'A longer step works the glutes and hamstrings more. A shorter one, the quads.',
      anchor: { landmark: 'ankle.r', pose: 'end' }, claim: C(['CONSENSUS'], [CAT], 'c13') },
  ],
  feel,
  zooms,
  chips: ['front-shin', 'back', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'Feet hip width, a dumbbell in each hand, palms in. Step forward, heel first.',
    mistakeLine: 'Never drive the hips forward. Land heel first and drop the hips straight down.',
    cueLine: 'Hips down, front shin vertical.',
    // D-LIB5-VARIANT: the card's plate.variantLine: ACE's barbell (c1) and dumbbell (c5) versions use the same step.
    variantLine: 'Same step with a barbell instead of dumbbells.',
  },
  redFlag: RED_FLAG,
  mistakes: [],   // Q-W2-12 (#379 6628699724): the card's handlingMistakes are posture checkpoints above
  risks: RISKS,
  riskFlags: ['knee'],   // the card's redFlags (inherited: redFlags.knee -> ['riskFlags'])
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/forward_lunge.json', rev: 1 },
};
