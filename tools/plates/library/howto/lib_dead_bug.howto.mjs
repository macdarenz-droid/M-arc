// LIB-SHIP W7: the How-to content of lib_dead_bug, golden B's HowToContent shape (as lib_crunch). Every shown string
// restates a claim of the research card docs/research/howto/cards/dead_bug.json (cited in its field's claim, cN = card claim id).
// Handling: none, D-SHIP-GRIP (b2): the card archetype.hand is none; its handContact (c3, c4: arms straight up above the
// chest, one lowering overhead) is on setup step 3 and the posture line 'lower'.
// No variant line (equipment 'Bodyweight').
//
// D-TEXT-GOLDEN (claim -> visible slot; posture checkpoints are kept in Q-W2-12 form as well):
//   card posture 'Slowly lower one arm and the opposite leg' (c4) -> plate label/cue 'opposite'
//   card posture 'Hand and heel lightly touch' (c4)                -> copy.setupLine
//   card posture 'Bring them back slowly, then switch' (c4)        -> copy.setupLine (plate tempo Lower/Return Slow)
//   card posture 'Breathe in as you reach out' (c9, c4)            -> copy.mistakeLine
//   card posture 'Stare straight up at the ceiling' (c8)           -> zoom 'neck' Right caption, feel row 'neck' fix
//   card posture 'Easier: ...' (c10)                               -> left off (D-TEXT-PROGRESSION)
//   handlingMistake 'Back arching off the mat' (c6, c3, c7)        -> zoom 'low-back' Wrong, setup step 4, feel row 'low-back', risks 'arch'
//   handlingMistake 'Craning your neck' (c8)                       -> zoom 'neck' Wrong, feel row 'neck', risks 'neck'
//   handlingMistake 'Holding your breath' (c9)                     -> copy.mistakeLine
//   card zooms low-back (M), neck (DV)                             -> zooms
import plateSpec from '../specs/dead_bug.mjs';
import { RED_FLAG } from '../../layers/howto/shared.mjs';
export { RED_FLAG };

/* ---------------------------------------------------------------- sources (the card's sources) ------------------- */
export const SOURCES = {
  'ace-deadbug': { cite: 'Ab Exercises | Supine Dead Bug (ACE)', url: 'https://www.acefitness.org/resources/everyone/exercise-library/147/supine-dead-bug/',
    kind: 'guideline', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'ggr-deadbug': { cite: 'Try the Dead Bug Exercise for a Strong Core (Garage Gym Reviews)', url: 'https://www.garagegymreviews.com/dead-bug-exercise',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'pereira-2017': { cite: 'Trunk Muscle EMG During Intermediate Pilates Mat Exercises in Beginner Healthy and Chronic Low Back Pain Individuals (2017)', url: 'https://pubmed.ncbi.nlm.nih.gov/28413116/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-22', use: 'DATA' },
  // The back box's own source (shared/back-box.mjs boxClaim), as lib_plank lists it: the card's redFlags 'back'.
  'nhs-back': { cite: 'NHS, Back pain', url: 'https://www.nhs.uk/conditions/back-pain/',
    kind: 'guideline', access: 'full', checked: '2026-10-02', use: 'CONSENSUS', note: 'When back pain needs a check.' },
};

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const ACE = 'ace-deadbug', GGR = 'ggr-deadbug';
const CL = {
  c1: C(['CONSENSUS'], [ACE], 'card c1'),
  c2: C(['CONSENSUS'], [ACE], 'card c2'),
  c3: C(['CONSENSUS'], [ACE, GGR], 'card c3'),
  c4: C(['CONSENSUS'], [ACE, GGR], 'card c4'),
  c5: C(['CONSENSUS'], [GGR], 'card c5'),
  c6: C(['CONSENSUS'], [GGR], 'card c6'),
  c8: C(['CONSENSUS'], [GGR], 'card c8'),
  c9: C(['CONSENSUS'], [GGR, ACE], 'card c9'),
  c11: C(['CONSENSUS'], [ACE, GGR], 'card c11'),
  back: C(['CONSENSUS'], [GGR, ACE], 'card c5, c6, c3, c7'),
  rest: C(['CONSENSUS'], [GGR], 'card c6, c7'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses:
//   arch  (card zoom low-back Wrong, c6): the spec's Mistake pose (the pelvis tips forward and the low back arches off
//         the mat as the arm and leg lower), drawn as the plate's Mistake view draws it (its guides: the gap under the low back).
//   crane (card zoom neck Wrong, c8 "neck craned to look at the legs"): the end pose with the neck flexed NECK_CRANE deg
//         further, so the head lifts off the mat and turns toward the legs; nothing else moves (one joint).
// DRAWING VALUES (D-SHIP-DRAWVAL, #376 6614695581; precedent D-LIB7-2 and golden B's machine_chest_press seatDrop): NECK_CRANE
// 35 deg is a Wrong-pose size no card gives; no number from it appears in user copy; the layers panel judges it.
const END = plateSpec.poses.end, MIS = plateSpec.mistake.pose, NECK_CRANE = 35;
const CRANE = { neck: END.neck + NECK_CRANE };
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  arch: { pose: MIS },
  crane: { pose: { ...END, ...CRANE } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// Zoom shell (pilot-a.closeups.mjs form). Both crops are centred off the right pose's hip so the trunk, the head and the
// mat line fill the panel (`off` and `sizePx` are drawing values).
const zooms = [
  {
    key: 'low-back', chip: 'Low back', heading: 'Low back', kind: 'posture',
    crop: { center: { at: 'lumbar', pose: 'right', off: [-18, -8] }, sizePx: 120 },
    right: 'end',
    wrong: { base: 'end', pose: MIS },   // M: the plate's own Mistake, dashed red over the right pose (lib_crunch form)
    guides: plateSpec.mistake.guides,
    callout: {
      right: { text: 'Back down', anchor: 'lumbar' },
      wrong: { text: 'Back arches', anchor: { at: 'lumbar', pose: 'mistake' } },
    },
    caption: {
      right: 'Lower back flat on the mat.',
      wrong: 'Back arching off the mat.',
    },
    alt: {
      right: 'Side view, dead bug. One arm and the opposite leg lowered, the lower back flat on the mat.',
      wrong: 'Side view, dead bug. As the arm and leg lower, the back arches off the mat.',
    },
    feelRow: 'low-back',
  },
  {
    key: 'neck', chip: 'Neck', heading: 'Neck', kind: 'posture',
    crop: { center: { at: 'ear', pose: 'right', off: [8, -12] }, sizePx: 100 },
    right: 'end',
    wrong: { base: 'end', pose: CRANE, solid: true },   // DV: the crane still drawn alone
    callout: {
      right: { text: 'Eyes up', anchor: 'head' },
      wrong: { text: 'Neck craned', anchor: { at: 'head', pose: 'mistake' } },
    },
    caption: {
      right: 'Eyes straight up at the ceiling.',
      wrong: 'Neck craned to look at the legs.',
    },
    alt: {
      right: 'Side view, dead bug. The head rests on the mat, eyes straight up at the ceiling.',
      wrong: 'Side view, dead bug. The head lifts off the mat, neck craned to look at the legs.',
    },
    feelRow: 'neck',
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'abs', plain: 'The abs at the front of the belly work.', claim: CL.c11 }],
  secondary: [
    { muscleId: 'obliques', plain: 'The sides of the waist work too.', claim: C(['CONSENSUS', 'DATA'], [GGR, 'pereira-2017'], 'card c11, c12') },
    { muscleId: 'hip_flexors', plain: 'The hip flexors also work.', claim: CL.c11 },
  ],
  watch: [],
  feelLine: 'You should feel this in the front of your belly and sides of your waist.',
  rows: [
    // The card's first two rows (front of the belly, sides of the waist) have no fix, so they are left out: the feel line says them.
    { key: 'low-back', where: 'Low back', at: { muscles: ['lower_back'] },
      means: 'Your back is arching off the mat.',
      fix: "Finish the rep you're on and rest.",
      zoom: 'low-back', redFlag: 'back', claim: CL.rest },
    { key: 'neck', where: 'Neck', at: { parts: ['neck-left', 'neck-right'] },
      means: 'Looking down at your legs strains your neck.',
      fix: 'Look straight up at the ceiling.',   // card "Stare straight up at the ceiling" (c8)
      zoom: 'neck', claim: CL.c8 },
  ],
  libraryDiff: { add: ['obliques', 'hip_flexors'], why: 'Garage Gym Reviews names both; Pereira measured more oblique than rectus activity (card c11, c12).' },
  claim: CL.c11,
};

/* ------------------------------------------------------------------------------------------------ risks ---------- */
const RISKS = [
  { key: 'arch', text: 'Arching your back could contribute to a back injury.', claim: CL.c6 },
  { key: 'neck', text: 'Looking down at your legs strains your neck.', claim: CL.c8 },
];

export default {
  schema: 1,
  id: 'lib_dead_bug',
  rev: 1,
  plate: plateSpec,
  handling: { archetype: 'none', why: 'D-SHIP-GRIP (b2): the card archetype.hand is none; its handContact (c3, c4) is on setup step 3 and the posture line lower.' },
  contacts: ['floor-body'],
  setup: [
    { kind: 'position', text: 'Lie on your back on a mat.', claim: CL.c1 },
    { kind: 'position', text: 'Lift your legs: knees bent 90 degrees, over your hips.', claim: CL.c3 },
    { kind: 'position', text: 'Reach your arms straight up above your chest.', claim: CL.c3 },
    { kind: 'brace', text: 'Brace and press your lower back into the mat.', zoom: 'low-back', claim: CL.c3 },
    { kind: 'position', text: 'Pull your shoulders down and back.', claim: CL.c2 },
  ],
  posture: [
    { key: 'lower', label: 'Opposite limbs', detail: 'Slowly lower one arm and the opposite leg toward the floor.',
      anchor: { landmark: 'wrist.r', pose: 'end' }, claim: CL.c4 },
    { key: 'touch', label: 'Light touch', detail: 'Hand and heel lightly touch the floor without resting.',
      anchor: { landmark: 'heel.l', pose: 'end' }, claim: CL.c4 },
    { key: 'return', label: 'Slow return', detail: 'Bring them back slowly, then switch sides.',
      anchor: { landmark: 'knee.r', pose: 'start' }, claim: CL.c4 },
    // Q-W2-12: handlingMistake 'Holding your breath' (c9) merged here, its fix added
    { key: 'breathe', label: 'Breathing', detail: 'Breathe in as you reach out, out as you return. Never hold your breath.',
      anchor: { landmark: 'chest', pose: 'end' }, claim: C(['CONSENSUS'], [GGR, ACE], 'card c9, c4') },
    // Q-W2-12: handlingMistake 'Back arching off the mat' (c6, c3, c7) merged here, its fix added
    { key: 'low-back', label: 'Low back down', detail: 'The back stays flat on the mat. Press your lower back into it. If it lifts, finish the rep and rest.',
      anchor: { landmark: 'lumbar', pose: 'end' }, zoom: 'low-back', claim: CL.back },
    // Q-W2-12: handlingMistake 'Craning your neck to look at your legs' (c8) merged here, its fix added
    { key: 'neck', label: 'Eyes up', detail: "Stare straight up at the ceiling. Don't crane your neck to look at your legs.",
      anchor: { landmark: 'head', pose: 'end' }, zoom: 'neck', claim: CL.c8 },
  ],
  feel,
  zooms,
  chips: ['low-back', 'neck', 'feel'],
  copy: {
    setupLine: 'Hand and heel lightly touch the floor without resting. Bring them back slowly, then switch sides.',   // card c4
    mistakeLine: "Don't hold your breath. Breathe in as you reach out, out as you return.",   // card c9
    cueLine: 'Low back on the mat.',
  },
  redFlag: RED_FLAG,
  mistakes: [],   // Q-W2-12 (#379 6628699724): the card's handlingMistakes are posture checkpoints above
  risks: RISKS,
  riskFlags: ['back'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/dead_bug.json', rev: 1 },
};
