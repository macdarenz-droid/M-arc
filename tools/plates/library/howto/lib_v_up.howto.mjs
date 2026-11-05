// LIB-SHIP W7: the How-to content of lib_v_up, golden B's HowToContent shape (as lib_crunch). Every shown string
// restates a claim of the research card docs/research/howto/cards/v_up.json (cited in its field's claim, cN = card claim id).
// Handling: none, D-SHIP-GRIP (b2): the card archetype.hand is none; its handContact (c1, c3: arms above the head, then
// reaching toward the toes) is on setup step 3 and the posture line 'reach'.
// Spec pose names: the spec's `start` is the V (the card's plate.end) and its `end` the lying pose (the card's
// plate.start; the spec checks the low back on the floor at 'end').
// No variant line (equipment 'Bodyweight').
//
// D-TEXT-GOLDEN (claim -> visible slot; posture checkpoints are kept in Q-W2-12 form as well):
//   card posture 'Lift legs and torso together' (c3)            -> plate cue 'reach'
//   card posture 'Lead with your upper body' (c7)               -> copy.mistakeLine (its fix)
//   card posture 'Keep your legs as straight as you can' (c8)   -> plate cue 'legs'
//   card posture 'Lower back flat on the floor' (c5, c4)        -> zoom 'low-back' Right, plate cue 'lowback', copy.setupLine
//   card posture 'Return with your heels a few inches off' (c4) -> copy.setupLine
//   card posture 'Easier: ...' (c10)                            -> left off (D-TEXT-PROGRESSION)
//   handlingMistake 'Lower back arching' (c6, c5, c2)           -> zoom 'low-back' Wrong, feel rows 'hips' and 'low-back', risks 'arch'
//   handlingMistake 'Legs flopping around' (c9)                 -> copy.mistakeLine (a fault, with its fix), setup step 2
//   handlingMistake 'Legs starting the lift' (c7)               -> copy.mistakeLine (a fault, with its fix)
//   card zoom low-back (M)                                      -> zoom 'low-back'
//   card zoom top-reach (T, D-SHIP-TEXTZOOM: its Wrong "legs flopping around" is a motion fault no still shows)
//                                                               -> Right: plate cues 'reach' and 'legs'; Wrong: copy.mistakeLine
import plateSpec from '../specs/v_up.mjs';
import { RED_FLAG } from '../../layers/howto/shared.mjs';
export { RED_FLAG };

/* ---------------------------------------------------------------- sources (the card's sources) ------------------- */
export const SOURCES = {
  'fv-vup': { cite: 'Ultimate V-Ups: Strengthen Your Core and Sculpt Your Abs (Fitness Volt)', url: 'https://fitnessvolt.com/24111/v-up/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'wh-vup': { cite: "How To Do V-Ups With Proper Form, According To A Certified Trainer (Women's Health)", url: 'https://www.womenshealthmag.com/fitness/a26977658/v-ups/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'ace-vup': { cite: 'How To Do V-Ups, Exercise Library (ACE)', url: 'https://www.acefitness.org/resources/everyone/exercise-library/242/v-ups/',
    kind: 'guideline', access: 'full', checked: '2026-10-22', use: 'WEAK' },
  'schoffstall-2010': { cite: 'Electromyographic response of the abdominal musculature to varying abdominal exercises (2010)', url: 'https://pubmed.ncbi.nlm.nih.gov/21088553/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-22', use: 'DATA' },
  // The back box's own source (shared/back-box.mjs boxClaim), as lib_plank lists it: the card's redFlags 'back'.
  'nhs-back': { cite: 'NHS, Back pain', url: 'https://www.nhs.uk/conditions/back-pain/',
    kind: 'guideline', access: 'full', checked: '2026-10-02', use: 'CONSENSUS', note: 'When back pain needs a check.' },
};

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const FV = 'fv-vup', WH = 'wh-vup';
const CL = {
  c1: C(['CONSENSUS'], [FV, WH], 'card c1'),
  c2: C(['CONSENSUS'], [FV], 'card c2'),
  c3: C(['CONSENSUS'], [FV, WH], 'card c3'),
  c4: C(['CONSENSUS'], [FV, WH], 'card c4'),
  c5: C(['CONSENSUS'], [FV], 'card c5'),
  c6: C(['CONSENSUS'], [WH], 'card c6'),
  c7: C(['CONSENSUS'], [WH], 'card c7'),
  c9: C(['CONSENSUS'], [FV], 'card c9'),
  c11: C(['CONSENSUS'], [FV], 'card c11'),
  c13: C(['WEAK'], ['ace-vup'], 'card c13'),
  back: C(['CONSENSUS'], [FV, WH], 'card c5, c4, c6, c2'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: arch (card zoom low-back Wrong, c6, c5) is the spec's Mistake pose (the lower back
// arches off the floor at the start of the rep), drawn as the plate's Mistake view draws it (its guides: the gap under
// the low back). No new geometry, so no drawing values.
const LYING = plateSpec.poses.end, MIS = plateSpec.mistake.pose;
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: LYING },
  arch: { pose: MIS },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
const zooms = [
  {
    key: 'low-back', chip: 'Low back', heading: 'Low back', kind: 'posture',
    // zoom shell: the window centred off the lying pose's lumbar (`off`, `sizePx` drawing values)
    crop: { center: { at: 'lumbar', pose: 'right', off: [0, -8] }, sizePx: 120 },
    right: 'end',
    wrong: { base: 'end', pose: MIS },   // M: the plate's own Mistake, dashed red over the right pose (lib_crunch form)
    guides: plateSpec.mistake.guides,
    callout: {
      right: { text: 'Back down', anchor: 'lumbar' },
      wrong: { text: 'Back arches', anchor: { at: 'lumbar', pose: 'mistake' } },
    },
    caption: {
      right: 'Lower back flat on the floor, braced.',
      wrong: 'Lower back arched off the floor.',
    },
    alt: {
      right: 'Side view, V-up, lying face up before the lift. The lower back lies flat on the floor.',
      wrong: 'Side view, V-up, lying face up before the lift. The lower back arches up off the floor.',
    },
    feelRow: 'hips',
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'abs', plain: 'The abs at the front of the belly are the target.', claim: CL.c11 }],
  secondary: [{ muscleId: 'obliques', plain: 'The sides of the belly help.', claim: C(['CONSENSUS', 'DATA'], [FV, 'schoffstall-2010'], 'card c11, c12') }],
  watch: [{ muscleId: 'hip_flexors', plain: 'The hip flexors take over when the lower back arches.', claim: CL.c5 }],
  feelLine: 'You should feel this in the front of your belly.',
  rows: [
    // The card's first row (front of the belly) has no fix, so it is left out: the feel line says it.
    { key: 'hips', where: 'Front of the hips', at: { muscles: ['hip_flexors'] },
      means: 'An arched lower back lets your hip flexors take over.',
      fix: 'Keep your lower back flat on the floor.',
      zoom: 'low-back', claim: CL.c5 },
    { key: 'low-back', where: 'Low back', at: { muscles: ['lower_back'] },
      means: 'Arching your back could bring discomfort or pain here.',
      fix: 'Brace, and keep your lower back touching the floor.',
      redFlag: 'back', claim: C(['CONSENSUS'], [WH, FV], 'card c6, c2') },
  ],
  libraryDiff: { add: ['obliques', 'hip_flexors'], why: 'Fitness Volt lists both as secondary; Schoffstall measured more rectus femoris activity than in the crunch (card c11, c12).' },
  claim: CL.c11,
};

/* ------------------------------------------------------------------------------------------------ risks ---------- */
const RISKS = [
  { key: 'arch', text: 'Arching your back could bring serious discomfort or pain in your lower back.', claim: CL.c6 },
  { key: 'speed', text: 'Control your speed and watch your low back to reduce the chance of injury.', claim: CL.c13 },
];

export default {
  schema: 1,
  id: 'lib_v_up',
  rev: 1,
  plate: plateSpec,
  handling: { archetype: 'none', why: 'D-SHIP-GRIP (b2): the card archetype.hand is none; its handContact (c1, c3) is on setup step 3 and the posture line reach.' },
  contacts: ['floor-body'],
  setup: [
    { kind: 'position', text: 'Lie on your back, legs straight, feet pressed together.', claim: CL.c1 },
    { kind: 'position', text: 'Gently press your toes together.', claim: CL.c9 },
    { kind: 'position', text: 'Extend your arms above your head.', claim: CL.c1 },
    { kind: 'brace', text: 'Push your pelvis down, breathe in and tense your middle.', claim: CL.c2 },
    { kind: 'position', text: 'Start with your lower back touching the floor.', zoom: 'low-back', claim: CL.c6 },
  ],
  posture: [
    { key: 'reach', label: 'Reach to toes', detail: 'Lift legs and torso together, hands reaching toward your toes.',
      anchor: { landmark: 'grip.r', pose: 'start' }, claim: CL.c3 },
    // Q-W2-12: handlingMistake 'Legs starting the lift' (c7) merged here, its fix added
    { key: 'lead', label: 'Upper body first', detail: 'Start the lift with your upper body, not your legs.',
      anchor: { landmark: 'shoulder.r', pose: 'start' }, claim: CL.c7 },
    // Q-W2-12: handlingMistake 'Legs flopping around' (c9) merged here; D-SHIP-TEXTZOOM: card zoom top-reach (c3, c8, c9)
    { key: 'legs', label: 'Legs together', detail: "Keep your legs as straight as you can, toes pressed together. Don't let them flop around.",
      anchor: { landmark: 'knee.r', pose: 'start' }, claim: C(['CONSENSUS'], [FV, WH], 'card c8, c9, c3') },
    // Q-W2-12: handlingMistake 'Lower back arching off the floor' (c6, c5, c2) merged here, its fix added
    { key: 'low-back', label: 'Low back down', detail: 'Lower back flat on the floor as you come down. Brace first, and start with it touching the floor.',
      anchor: { landmark: 'lumbar', pose: 'end' }, zoom: 'low-back', claim: CL.back },
    { key: 'heels', label: 'Heels up', detail: 'Return with your heels a few inches off the floor.',
      anchor: { landmark: 'heel.r', pose: 'end' }, claim: CL.c4 },
  ],
  feel,
  zooms,
  chips: ['low-back', 'feel'],
  copy: {
    setupLine: 'Brace and keep your lower back down. Return with your heels a few inches off the floor.',   // card c2, c4
    mistakeLine: 'Legs flopping around or starting the lift? Press your toes together and lead with your upper body.',   // card c9, c7
    cueLine: 'Reach toward your toes.',
  },
  redFlag: RED_FLAG,
  mistakes: [],   // Q-W2-12 (#379 6628699724): the card's handlingMistakes are posture checkpoints above
  risks: RISKS,
  riskFlags: ['back'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/v_up.json', rev: 1 },
};
