// LIB-SHIP W5: the How-to content of lib_bulgarian_split_squat (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/bulgarian_split_squat.json; its claim ids are named on each field's claim.
// Parent reverse_lunge (card inherit: plate.view, redFlags.knee, grip; INHERIT_MAP lint/family.mjs). Handling is the
// parent's NoHandling, the whole object identical (grip -> ['handling']): the card's grip.thumb, grip.handContact and
// grip.wrist are all empty (D-SHIP-GRIP case (b)), so there is no hand claim to draw or write and no hand zoom (the card
// has none). The card's own grip.type ("Dumbbells held at the sides", c9) is setup step 3. redFlags.knee -> riskFlags
// ['knee']; plate.view -> [] (nothing written).
// Zooms: the card zoom rear-knee is a posture crop; the card zoom stance-length is a text checkpoint (D-SHIP-TEXTZOOM,
// D-SHIP-Q14 precedent lib_seated_leg_curl knee-pivot): its wrong is null, so there is no Wrong to draw; posture
// checkpoint `stance`, setup step 2.
// Variant line (D-LIB5-VARIANT): exercises.json lists 'Dumbbells / Barbell'; c9 names dumbbells at the sides or a
// barbell, and the card's plate.variantLine: the stance, depth and back claims (c2, c3, c5) hold for both.
// Red flag: the card's redFlags (knee), golden B's shared knee block, linked by the knee row.
import plateSpec from '../specs/bulgarian_split_squat.mjs';
import { RED_FLAG, RED_FLAG_KNEE } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_KNEE };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'cat-bss': { cite: 'Catalyst Athletics, Bulgarian Split Squat (Exercise Library)', url: 'https://www.catalystathletics.com/exercise/173/Bulgarian-Split-Squat/',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'ace-bss': { cite: 'Bulgarian Split Squat (ACE Exercise Library)', url: 'https://www.acefitness.org/resources/everyone/exercise-library/366/bulgarian-split-squat/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'mccurdy-2021': { cite: 'Hip and Knee Extensor Activation During the Hip Thrust and Rear-Foot-Elevated Split Squat in Trained Females', url: 'https://pubmed.ncbi.nlm.nih.gov/33900255/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  'arakawa-2023': { cite: 'Greater Hip Moments in Rear-Foot-Elevated Split Squats Than in Conventional Back Squats With the Same Relative Intensity of Loads', url: 'https://pubmed.ncbi.nlm.nih.gov/36542838/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  'aygun-2025': { cite: 'Targeted muscle activation in Bulgarian split squat variations: effects of trunk position and suspension-based execution', url: 'https://pubmed.ncbi.nlm.nih.gov/40867012/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  'nhs-knee': { cite: 'NHS, Knee pain', url: 'https://www.nhs.uk/conditions/knee-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  // RED_FLAG_KNEE's own source (layers/howto/shared.mjs), as golden B's leg_press lists it: the card's redFlags 'knee'.
  'nhs-knee-pain': { cite: 'NHS, Knee pain', url: 'https://www.nhs.uk/symptoms/knee-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When knee pain needs a check.' },
};
// Not cited: c1 (definition), c8's 3-6 rep strength sets (load progression).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const CAT = 'cat-bss', ACE = 'ace-bss';
const CL = {
  c2: C(['CONSENSUS'], [CAT, ACE], 'c2'),
  c3: C(['CONSENSUS'], [CAT, ACE], 'c3'),
  c4: C(['CONSENSUS'], [CAT], 'c4'),
  c5: C(['CONSENSUS'], [ACE], 'c5'),
  c6: C(['CONSENSUS'], [CAT], 'c6'),
  c7: C(['CONSENSUS'], [CAT], 'c7'),
  c8: C(['CONSENSUS'], [CAT], 'c8'),
  c14: C(['CONSENSUS'], ['nhs-knee'], 'c14'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// The card zoom rear-knee Wrong (c3: "Rear knee resting on the floor") is the plate's drawn fault, the spec's Mistake
// pose (D-SPLIT-BSSHOVER: the hips sink until the rear kneecap rests on the floor, hips 3 cm lower than the end). Its
// Right is the end pose with one change (fix round 1, panel L5: the Right and Wrong knees differed by about 10 px): the
// hips raised LIFT m, both feet held, so the rear kneecap sits clearly above the floor (measured: 6.9 cm gap against
// the end pose's 3.0 cm; the Wrong's kneecap is on the floor), "just above" the floor (c3, card plate.end).
// DRAWING VALUES (D-SHIP-DRAWVAL, #376 6614695581; precedent lib_reverse_lunge's SHORT, D-LIB7-2): LIFT 0.03 m is a
// Right-pose size no card gives; no number from it appears in user copy; the layers panel judges it.
const LIFT = 0.03;
const END = plateSpec.poses.end, MIS = plateSpec.mistake.pose;
const KNEE_GAP = { root: { ...END.root, at: [END.root.at[0], END.root.at[1] + LIFT, END.root.at[2]] } };
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  'knee-gap': { pose: { ...END, ...KNEE_GAP } },
  'knee-rests': { pose: { ...END, ...MIS } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// The card zoom rear-knee in the zoom shell's shape (callout with an anchor at the landmark it names;
// pilot-a.closeups.mjs), as the parent's; the Wrong is drawn alone (solid). stance-length is text (header).
const zooms = [
  {
    key: 'rear-knee', chip: 'Rear knee', heading: 'Rear knee', kind: 'posture',
    // crop (fix round 2, recheck L7): the floor near the bottom edge, the rear knee, shin and bench filling the frame
    crop: { center: { at: 'knee.l', pose: 'right', off: [-40, -24] }, sizePx: 100 },
    right: { base: 'end', pose: KNEE_GAP },
    wrong: { base: 'end', pose: MIS, solid: true },
    callout: {
      right: { text: 'Just above floor', anchor: 'knee.l' },
      wrong: { text: 'Knee rests', anchor: { at: 'knee.l', pose: 'mistake' } },
    },
    caption: {
      right: 'Rear knee just above or lightly touching the floor.',
      wrong: 'Rear knee resting on the floor.',
    },
    alt: {
      right: 'Side view, bottom of the split squat. The rear knee is just above the floor, the rear foot on the bench.',
      wrong: 'Side view, bottom of the split squat. The hips have sunk and the rear knee rests on the floor.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [
    { muscleId: 'quads', plain: 'The front thigh works hard.' },
    { muscleId: 'glutes', plain: 'The glute works hard too, most at the bottom.' },
  ],
  secondary: [
    { muscleId: 'hamstrings', plain: 'The back of the thigh helps at the bottom.' },
  ],
  watch: [{ muscleId: 'hip_flexors', plain: 'The rear leg\'s hip flexors stretch.' }],
  // The card's rows 'Front leg's thigh and glute' (c11) and 'Front of the rear hip' (c10) have no fix, so they are left
  // off the rows (D-SHIP-Q16); the feel line says both.
  feelLine: 'You should feel this in the front thigh and glute, most at the bottom. The rear hip stretches.',
  rows: [
    { key: 'knee', where: 'Very painful, locking or giving-way knee', at: { parts: ['knee-left', 'knee-right'] },
      means: 'Not a training feeling.',
      fix: 'Stop the set.',
      redFlag: 'knee', claim: CL.c14 },
  ],
  claim: C(['DATA', 'CONSENSUS'], ['mccurdy-2021', 'arakawa-2023', 'aygun-2025', CAT], 'c11, c12, c13, c10'),
};

/* ---------------------------------------------------------------- risks (card risks; handlingMistakes are posture, Q-W2-12) */
const RISKS = [
  { key: 'crash', text: 'Too heavy a load ends in a crash into the bottom.', claim: CL.c8 },
  { key: 'knee-drift', text: 'Front knee drifting inward or outward.', claim: CL.c4 },
];

export default {
  schema: 1,
  id: 'lib_bulgarian_split_squat',
  rev: 1,
  plate: plateSpec,
  // Inherited whole from lib_reverse_lunge (INHERIT_MAP grip -> ['handling']): the same archetype and why string.
  handling: { archetype: 'none', why: 'D-SHIP-GRIP: the card gives no thumb, contact or wrist claim.' },
  contacts: ['standing-feet'],
  setup: [
    // D-TEXT-GOLDEN: posture point 'Top of the rear foot on the bench' (c2)
    { kind: 'adjust', text: 'Rest the top of your rear foot on a knee-high bench.', claim: CL.c2 },
    // D-TEXT-GOLDEN: the stance-length text checkpoint (c2) and posture point c6 (front-foot distance)
    { kind: 'position', text: 'Front foot about three foot-lengths ahead. Farther: more hips. Closer: more quads.',
      claim: C(['CONSENSUS'], [CAT, ACE], 'c2, c6') },
    // D-TEXT-GOLDEN: posture point c4 and handlingMistake 'Knee moving in or out' fix (c4)
    { kind: 'position', text: 'Dumbbells at your sides, front knee over the front foot.', claim: C(['CONSENSUS'], [CAT], 'c9 (card grip.type), c4') },
    // D-TEXT-GOLDEN: handlingMistake 'Rear knee resting on floor' (c3, c8) fix placed here
    { kind: 'position', text: 'Lower under control until the rear knee lightly touches the floor.',
      zoom: 'rear-knee', claim: CL.c3 },
    { kind: 'finish', text: 'Do all reps on one leg, then switch.', claim: CL.c7 },
  ],
  posture: [
    { key: 'foot', label: 'Foot on bench', detail: 'Top of the rear foot on the bench.',
      anchor: { landmark: 'ankle.l', pose: 'start' }, claim: CL.c2 },
    // D-SHIP-TEXTZOOM: the card zoom stance-length as a text checkpoint (its wrong is null)
    { key: 'stance', label: 'Long stance', detail: 'Front foot about three foot-lengths ahead of the bench.',
      anchor: { landmark: 'toe.r', pose: 'start' }, claim: CL.c2 },
    // Q-W2-12: handlingMistake 'Knee moving in or out' (c4) merged here, its fix added
    { key: 'knee', label: 'Knee over foot', detail: 'Front knee stays over the front foot, not in or out.',
      anchor: { landmark: 'knee.r', pose: 'end' }, claim: CL.c4 },
    { key: 'back', label: 'Back straight', detail: 'Back straight as the rear knee lowers.',
      anchor: { landmark: 'backUpper', pose: 'end' }, claim: CL.c5 },
    { key: 'foot-distance', label: 'Foot distance', detail: 'Front foot farther forward for more hip work, closer for more quads.',
      anchor: { landmark: 'toe.r', pose: 'end' }, claim: CL.c6 },
    // Q-W2-12: handlingMistake 'Rear knee resting on floor' (c3, c8)
    { key: 'rest', label: 'Rear knee resting', detail: 'Lower under control. Stop as the knee lightly touches.',
      anchor: { landmark: 'knee.l', pose: 'end' }, zoom: 'rear-knee', claim: C(['CONSENSUS'], [CAT, ACE], 'c3, c8') },
    // Q-W2-12: handlingMistake 'Crashing into the bottom' (c8)
    { key: 'crash', label: 'Crashing down', detail: 'Use a weight you can move smoothly.',
      anchor: { landmark: 'hip.r', pose: 'end' }, claim: CL.c8 },
  ],
  feel,
  zooms,
  chips: ['rear-knee', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'Rear foot on a knee-high bench. Front foot farther forward works the hips more, closer the quads.',
    mistakeLine: 'Never drop onto the rear knee. Use a weight you can lower smoothly.',
    cueLine: 'Front knee over the front foot.',
    // D-LIB5-VARIANT: c9 (dumbbells at the sides, or a barbell); the card's plate.variantLine: c2, c3, c5 hold for both.
    variantLine: 'Same stance and depth with a barbell instead of dumbbells.',
  },
  redFlag: RED_FLAG,
  mistakes: [],   // Q-W2-12 (#379 6628699724): the card's handlingMistakes are posture checkpoints above
  risks: RISKS,
  riskFlags: ['knee'],   // the card's redFlags (inherited: redFlags.knee -> ['riskFlags'])
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/bulgarian_split_squat.json', rev: 1 },
};
