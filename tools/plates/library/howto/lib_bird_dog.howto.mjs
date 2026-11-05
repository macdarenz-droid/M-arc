// LIB-SHIP W7: the How-to content of lib_bird_dog (golden B's HowToContent shape, as lib_push_up). Every shown string
// restates a claim of the verified card docs/research/howto/cards/bird_dog.json (cited in its field's claim, cN = card
// claim id).
// Hand (D-SHIP-GRIP case (a), push_up's form): archetype 'palm-flat', the values copied from the approved palm-flat key
// (tools/plates/library/hands/hand-palm-flat.mjs IDS.bird_dog: variant 'floor', orientation 'over') with each value's
// key line, cited CONVENTION (source hand-key-palm-flat), never printed. The card's own claims are the cited fields:
// width and contact c2 (hands flat on the mat under the shoulders, shoulder-width, fingers forward).
// No hand zoom (D-SHIP-C3 no-zoom list, D-SHIP-HANDW7, gap-ruled; tools/plates/library/hands/no-zoom.json): the key's
// faults (cupped-palm, hand-ahead) cite no claim of this card and the card's hand zoom `hands` has no Wrong (LR-25), so
// handling.faults is empty (as lib_bear_crawl) and the zoom's Right is in gripLine.
// Feel: the card's primaries lower_back, glutes and abs (c15-c17) are drawn; the card names no `core` role.
// No variant line (equipment 'Bodyweight').
//
// D-TEXT-GOLDEN (claim -> visible slot; posture checkpoints kept as well):
//   posture 'Back flat: no sagging or arching' (c3)           -> zoom 'back-line' Right, setup 5, plate cue 'flat'
//   posture 'Raise the limbs only as high as ...' (c7)        -> mistakes[0] fix
//   posture 'Keep your hips and shoulders level' (c4, c5, c12) -> plate cue 'level', mistakes[2] fix, setup 4 (W7 printed)
//   posture 'Move slowly and keep breathing' (c10, c13)       -> setup 5 (W7 D-TEXT-PRINTED; copy.setupLine kept)
//   posture 'Head in line, eyes on the floor' (c6)            -> zoom 'head' Right, mistakes[1] fix
//   posture 'Press the floor with your unmoving hand ...' (c11, c12) -> mistakes[2] fix
//   handlingMistake arching the lower back (c8, c7)           -> mistakes[0] (zoom back-line, the plate's Mistake), mistakeLine
//   handlingMistake lifting your head (c9, c6)                -> mistakes[1] (zoom head)
//   handlingMistake hips tilting or rotating (c12, c11)       -> mistakes[2]
//   hand zoom hands Right (c2) (T, D-SHIP-TEXTZOOM: Wrong null) -> handling.gripLine, setup 3, plate cue 'under'; Wrong null (LR-25), nothing to show
import plateSpec from '../specs/bird_dog.mjs';
import { RED_FLAG } from '../../layers/howto/shared.mjs';
export { RED_FLAG };

/* ---------------------------------------------------------------- sources (the card's sources) ------------------- */
export const SOURCES = {
  'ace-birddog': { cite: 'Bird Dog, Exercise Library (ACE)', url: 'https://www.acefitness.org/resources/everyone/exercise-library/14/bird-dog/',
    kind: 'guideline', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'bb-birddog': { cite: 'Master the Bird Dog to Give Your Core Routine Wings (BarBend)', url: 'https://barbend.com/bird-dog-exercise/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'ggr-birddog': { cite: 'The Bird Dog Exercise: Your Ticket to a Strong Core (Garage Gym Reviews)', url: 'https://www.garagegymreviews.com/bird-dog-exercise',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'hl-birddog': { cite: 'Bird Dog Exercise: How to Do, Variations, and Muscles Targeted (Healthline)', url: 'https://www.healthline.com/health/bird-dog-exercise',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'mo-birddog': { cite: 'Bird Dog, Exercise Guide (Motra)', url: 'https://www.motra.com/exercises/birdDog',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'calatayud-2019': { cite: 'Tolerability and Muscle Activity of Core Muscle Exercises in Chronic Low-back Pain (2019)', url: 'https://pubmed.ncbi.nlm.nih.gov/31547140/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-22', use: 'DATA' },
  // The palm-flat key's own source for the thumb (the card has no grip.thumb): a drawing convention.
  'hand-key-palm-flat': { cite: 'LIB-12 hand pair key palm-flat (floor): the thumb lies on the floor beside the index', url: 'tools/plates/library/hands/hand-palm-flat.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-05', use: 'CONVENTION' },
  // The back box's own source (shared/back-box.mjs boxClaim), as lib_plank lists it: the card's redFlags 'back'.
  'nhs-back': { cite: 'NHS, Back pain', url: 'https://www.nhs.uk/conditions/back-pain/',
    kind: 'guideline', access: 'full', checked: '2026-10-02', use: 'CONSENSUS', note: 'When back pain needs a check.' },
};

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const ACE = 'ace-birddog', BB = 'bb-birddog', GGR = 'ggr-birddog', HL = 'hl-birddog', MO = 'mo-birddog';
const CL = {
  c1: C(['CONSENSUS'], [ACE], 'card c1'),
  c2: C(['CONSENSUS'], [ACE, BB], 'card c2'),
  c3: C(['CONSENSUS'], [ACE, GGR], 'card c3'),
  c6: C(['CONSENSUS'], [ACE, GGR], 'card c6'),
  c7: C(['CONSENSUS'], [ACE, HL, MO], 'card c7'),
  c8: C(['CONSENSUS'], [GGR, MO], 'card c8'),
  c9: C(['CONSENSUS'], [GGR], 'card c9'),
  c22: C(['CONSENSUS'], [MO, HL], 'card c22'),
  level: C(['CONSENSUS'], [ACE, HL, BB, MO], 'card c4, c5, c12'),
  slow: C(['CONSENSUS'], [BB, MO, HL, GGR], 'card c10, c13'),
  press: C(['CONSENSUS'], [BB, HL, MO], 'card c11, c12'),
  conv: C(['CONVENTION'], ['hand-key-palm-flat'], 'the palm-flat key\'s drawn thumb (the card has no grip.thumb)'),
};

/* ------------------------------------------------------------------------------------------------ hand ---------- */
// The key's record for this id and its variant, copied (hand-palm-flat.mjs IDS.bird_dog, VARIANTS.floor; not importable,
// lib_push_up's header says why).
const V = { archetype: 'palm-flat', loadAxis: 'along-forearm' };   // VARIANTS.floor.archetype, .loadAxis
const THUMB = 'beside';   // CONVENTION: the key's drawn thumb on the floor beside the index (view-palm-flat.mjs:52), source hand-key-palm-flat

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses (start = all fours, end = arm and leg reached):
//   arch (card zoom back-line Wrong, c7, c8): the spec's Mistake pose (the low back sags into an arch as the leg rises),
//        drawn as the plate's Mistake view draws it (its guides: the arrows at the low back and the leg).
//   look (card zoom head Wrong, c9 "head lifted to look forward"): the start (all fours, no raised arm by the head) with
//        the neck extended HEAD_UP deg, so the head lifts and the eyes look forward; nothing else moves (one joint).
// DRAWING VALUES (D-SHIP-DRAWVAL, #376 6614695581; precedent D-LIB7-2 and golden B's machine_chest_press seatDrop): HEAD_UP
// 40 deg is a Wrong-pose size no card gives; no number from it appears in user copy; the layers panel judges it.
const START = plateSpec.poses.start, END = plateSpec.poses.end, MIS = plateSpec.mistake.pose, HEAD_UP = 40;
const LOOK = { neck: (START.neck ?? 0) - HEAD_UP };
export const stills = {
  start: { pose: START },
  end: { pose: END },
  arch: { pose: MIS },
  look: { pose: { ...START, ...LOOK } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// Zoom shell (pilot-a.closeups.mjs form); `off` and `sizePx` are drawing values.
const zooms = [
  {
    key: 'back-line', chip: 'Back line', heading: 'Back line', kind: 'posture',
    crop: { center: { at: 'lumbar', pose: 'right', off: [-10, 0] }, sizePx: 160 },
    right: 'end',
    wrong: { base: 'end', pose: MIS },   // M: the plate's own Mistake, dashed red over the right pose (lib_crunch form)
    guides: plateSpec.mistake.guides,
    callout: {
      right: { text: 'Back flat', anchor: 'backMid' },
      wrong: { text: 'Low back arches', anchor: { at: 'lumbar', pose: 'mistake' } },
    },
    caption: {
      right: 'Back flat as the leg rises.',
      wrong: 'Low back sagging into an arch.',
    },
    alt: {
      right: 'Side view, bird dog. One arm and the opposite leg reach out level, the back flat.',
      wrong: 'Side view, bird dog. As the leg rises too high, the low back sags into an arch.',
    },
    feelRow: 'low-back',
  },
  {
    key: 'head', chip: 'Head', heading: 'Head', kind: 'posture',
    crop: { center: { at: 'ear', pose: 'right', off: [-10, 6] }, sizePx: 110 },
    right: 'start',
    wrong: { base: 'start', pose: LOOK, solid: true },   // DV: the look still drawn alone
    callout: {
      right: { text: 'Eyes down', anchor: 'head' },
      wrong: { text: 'Head lifted', anchor: { at: 'head', pose: 'mistake' } },
    },
    caption: {
      right: 'Head in line, eyes on the floor.',
      wrong: 'Head lifted to look forward.',
    },
    alt: {
      right: 'Side view, bird dog on all fours. The head is in line with the spine, eyes on the floor.',
      wrong: 'Side view, bird dog on all fours. The head lifts to look forward, out of line with the spine.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [
    { muscleId: 'lower_back', plain: 'The low back works to keep you stable.', claim: C(['CONSENSUS', 'DATA'], [BB, MO, 'calatayud-2019'], 'card c15, c18') },
    { muscleId: 'glutes', plain: 'The glutes kick in as the leg kicks back.', claim: C(['CONSENSUS'], [BB, MO], 'card c16') },
    { muscleId: 'abs', plain: 'The front of the belly works to keep you stable.', claim: C(['CONSENSUS'], [BB, MO], 'card c17, c16') },
  ],
  secondary: [{ muscleId: 'hamstrings', plain: 'The back of the thigh helps.', claim: C(['CONSENSUS'], [MO], 'card c16') }],
  watch: [],
  feelLine: 'You should feel this in your low back, glutes and belly.',
  rows: [
    // The card's first two rows (low back working, glutes of the raised leg) have no fix, so they are left out: the feel
    // line says them.
    { key: 'low-back', where: 'Low back pain', at: { muscles: ['lower_back'] },
      means: 'Arching the back can lead to lower back pain.',
      fix: 'Stop if any pain occurs. Keep your back flat.',
      zoom: 'back-line', redFlag: 'back', claim: C(['CONSENSUS'], [GGR, MO, HL, ACE], 'card c8, c19, c3') },
  ],
  libraryDiff: { add: ['lower_back', 'glutes', 'abs', 'hamstrings'], why: 'BarBend and Motra name the erector spinae, glutes and abs as targets, Motra the hamstrings as secondary (card c15-c18).' },
  claim: C(['CONSENSUS', 'DATA'], [BB, MO, 'calatayud-2019'], 'card c15, c16, c17, c18'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'arch', title: 'Lower back arching', zoom: 'back-line', claim: C(['CONSENSUS'], [GGR, MO, ACE, HL], 'card c8, c7'),
    fix: 'Raise the limbs only as high as your low back holds.' },
  { key: 'head', title: 'Head lifted to look', zoom: 'head', claim: C(['CONSENSUS'], [GGR, ACE], 'card c9, c6'),
    fix: 'Keep your eyes on the floor, head in line with your spine.' },
  { key: 'hips', title: 'Hips tilting or rotating', claim: CL.press,
    fix: 'Press down with your unmoving hand, knee and toes. Hips level.' },
];
const RISKS = [
  { key: 'arch', text: 'Arching or rounding the back puts increased stress on the lumbar spine.', claim: CL.c8 },
  { key: 'head', text: 'Lifting your head to look forward takes your neck out of alignment.', claim: CL.c9 },
];

export default {
  schema: 1,
  id: 'lib_bird_dog',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: V.archetype,          // 'palm-flat'
    why: 'D-SHIP-C3 no-zoom list, D-SHIP-HANDW7: gap-ruled, the palm-flat key\'s faults cite no claim of this card and its hand zoom has no Wrong; the grip copy carries c2.',
    orientation: 'pronated',         // the key's orientation 'over': palms down on the mat (c2)
    handle: 'floor',                 // the key has no HANDLE: the hand lies on the floor
    loadAxis: V.loadAxis,            // 'along-forearm'
    overBody: false,
    width: { text: 'Hands shoulder-width apart, under the shoulders.', claim: CL.c2 },   // card grip.width (c2)
    thumb: { mode: THUMB, claim: CL.conv },   // CONVENTION: the key's drawn thumb; the card gives none
    contact: 'palm-flat',            // card grip.handContact (c2): hands flat on the mat (the key's contact 'whole-hand')
    // The key records no wrist range (VARIANTS.floor.wristRange null) and the card gives none: the hand sits under the shoulder (c2).
    wrist: { exempt: 'Palm flat on the mat: the wrist sits under the shoulder, no range given.', claim: CL.c2 },
    faults: [],                      // gap-ruled (header): the key's faults cite no claim of this card
    gripLine: 'Hands under the shoulders, fingers facing forward.',   // card zoom hands right (c2)
    cue: 'Hands under shoulders, knees under hips.',   // c2, the plate's callout cue
  },
  contacts: ['floor-body'],
  setup: [
    { kind: 'position', text: 'Kneel on a mat, knees and feet hip-width apart.', claim: CL.c1 },
    { kind: 'position', text: 'Put a cushion or folded towel under your knees.', claim: CL.c22 },
    { kind: 'grip', text: 'Hands on the mat under your shoulders, fingers forward.', claim: CL.c2 },
    // W7 D-TEXT-PRINTED: posture 'Keep your hips and shoulders level' (c4, c5, c12) printed here
    { kind: 'position', text: 'Knees under your hips. Keep hips and shoulders level.',
      claim: C(['CONSENSUS'], [ACE, BB, HL, MO], 'card c2, c4, c5, c12') },
    // W7 D-TEXT-PRINTED: posture 'Move slowly and keep breathing' (c10, c13) printed here (copy.setupLine is not printed)
    { kind: 'brace', text: 'Hold your spine neutral, back flat. Move slowly and keep breathing.', zoom: 'back-line',
      claim: C(['CONSENSUS'], [ACE, GGR, BB, MO, HL], 'card c3, c10, c13') },
  ],
  posture: [
    // D-SHIP-TEXTZOOM: card hand zoom 'hands' (Wrong null) as a text checkpoint
    { key: 'hands', label: 'Hands under', detail: 'Hands flat under your shoulders, fingers facing forward.',
      anchor: { landmark: 'wrist.l', pose: 'start' }, claim: CL.c2 },
    { key: 'back', label: 'Back flat', detail: 'Back flat: no sagging or arching.',
      anchor: { landmark: 'backMid', pose: 'end' }, zoom: 'back-line', claim: CL.c3 },
    { key: 'height', label: 'Limb height', detail: 'Raise the limbs only as high as you can hold your low back.',
      anchor: { landmark: 'ankle.l', pose: 'end' }, zoom: 'back-line', claim: CL.c7 },
    { key: 'level', label: 'Hips level', detail: 'Keep your hips and shoulders level.',
      anchor: { landmark: 'hip.r', pose: 'end' }, claim: CL.level },
    { key: 'slow', label: 'Slow reps', detail: 'Move slowly and keep breathing.',
      anchor: { landmark: 'chest', pose: 'end' }, claim: CL.slow },
    { key: 'head', label: 'Head in line', detail: 'Head in line with your spine, eyes on the floor.',
      anchor: { landmark: 'head', pose: 'start' }, zoom: 'head', claim: CL.c6 },
    { key: 'press', label: 'Press the floor', detail: 'Press the floor with your unmoving hand, knee and toes.',
      anchor: { landmark: 'knee.r', pose: 'end' }, claim: CL.press },
  ],
  feel,
  zooms,
  chips: ['back-line', 'head', 'feel'],
  copy: {
    setupLine: 'Hands under your shoulders, knees under your hips, back flat. Move slowly and keep breathing.',   // card c2, c3, c10, c13
    mistakeLine: 'Never let your low back arch as the leg rises. Raise the limbs only that high.',
    cueLine: 'Back flat, eyes on the floor.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['back'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/bird_dog.json', rev: 1 },
};
