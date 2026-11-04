// LIB-SHIP W2: the How-to content of lib_dumbbell_bench_press (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/dumbbell_bench_press.json; its claim ids are named on each field's claim.
// No hand zoom (D-SHIP-HANDW2, gap-ruled on tools/plates/library/hands/no-zoom.json): the card's hand zoom
// `wrist-neutral-press` (c3) is a push heel-of-palm pair that golden B's engine cannot draw (D-LIB7-19). Its hand claims
// (closed grip, palms forward, thumbs wrapped, handle firm in the palm, wrist neutral; c3, c7) live in handling.
// Red flags: the card's redFlags (shoulder), golden B's shared shoulder box.
import plateSpec from '../specs/dumbbell_bench_press.mjs';
import { RED_FLAG, RED_FLAG_SHOULDER } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_SHOULDER };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'ace-db-chest-press': { cite: 'Chest Press (dumbbell), ACE Exercise Library', url: 'https://www.acefitness.org/resources/everyone/exercise-library/19/chest-press/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'nsca-ch15-summary': { cite: 'NSCA CSCS Chapter 15 (Exercise Technique) study summary, PTPioneer', url: 'https://www.ptpioneer.com/personal-training/certifications/nsca-cscs/cscs-chapter-15/',
    kind: 'secondary', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'sbs-bench': { cite: 'How to Bench Press: The Definitive Guide (Stronger by Science)', url: 'https://www.strongerbyscience.com/how-to-bench/',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'MECH' },
  'hk-db-bench': { cite: 'How to perform a dumbbell bench press (Human Kinetics excerpt)', url: 'https://us.humankinetics.com/blogs/excerpt/how-to-perform-a-dumbbell-bench-press',
    kind: 'textbook', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  saeterbakken2011: { cite: 'A comparison of muscle activity and 1-RM strength of three chest-press exercises with different stability requirements', url: 'https://pubmed.ncbi.nlm.nih.gov/21225489/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  acsm2009: { cite: 'American College of Sports Medicine position stand. Progression models in resistance training for healthy adults', url: 'https://pubmed.ncbi.nlm.nih.gov/19204579/',
    kind: 'guideline', access: 'abstract', checked: '2026-10-17', use: 'CONSENSUS' },
  kerr2010: { cite: 'Epidemiology of weight training-related injuries presenting to United States emergency departments, 1990 to 2007', url: 'https://pubmed.ncbi.nlm.nih.gov/20139328/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  kowalczuk2022: { cite: 'Pectoralis Major Rupture: Evaluation and Management', url: 'https://pubmed.ncbi.nlm.nih.gov/35025841/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'CONSENSUS' },
  kolber2010: { cite: 'Shoulder injuries attributed to resistance training: a brief review', url: 'https://pubmed.ncbi.nlm.nih.gov/20508476/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  // RED_FLAG_SHOULDER's own source (layers/howto/shared.mjs), as golden B's lateral raise lists it: the card's redFlags 'shoulder'.
  'nhs-shoulder-pain': { cite: 'NHS, Shoulder pain', url: 'https://www.nhs.uk/conditions/shoulder-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When shoulder pain needs a check.' },
};
// Not cited: welsch2005 (c13, a barbell/dumbbell/fly comparison; no field here restates it), c8 (breathing), c9 (elbow
// position and muscle shift, WEAK), c15 (tempo, a plate drawing convention).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const ACE = 'ace-db-chest-press', HK = 'hk-db-bench';
const CL = {
  c2: C(['CONSENSUS'], [ACE, 'nsca-ch15-summary'], 'c2'),
  c3: C(['CONSENSUS'], [ACE], 'c3'),
  c5: C(['CONSENSUS'], [ACE], 'c5'),
  c6: C(['CONSENSUS'], [ACE], 'c6'),
  c7: C(['MECH'], ['sbs-bench'], 'c7'),
  c10: C(['CONSENSUS'], [HK], 'c10'),
  c12: C(['DATA'], ['saeterbakken2011'], 'c12'),
  c14: C(['CONSENSUS'], ['acsm2009'], 'c14'),
  c17: C(['CONSENSUS'], ['kowalczuk2022'], 'c17'),
  c18: C(['DATA'], ['kolber2010'], 'c18'),
  arch: C(['CONSENSUS'], [ACE, 'nsca-ch15-summary'], 'c6, c2'),
  setupBack: C(['CONSENSUS'], [ACE, 'nsca-ch15-summary'], 'c1, c2'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: the end (dumbbells at mid-chest, c5) and the spec's Mistake pose merged over it, as the
// engine draws it (the hips lift off the pad, the low back arches; card plate.mistake, c6). The card zoom
// five-point-bench Wrong ("Hips lifted, low back arched") is the plate's drawn fault, so no drawing value is added.
const MIS = plateSpec.mistake.pose;
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: plateSpec.poses.end },
  'hips-up': { pose: { ...plateSpec.poses.end, ...MIS } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom except the hand zoom `wrist-neutral-press` (D-SHIP-HANDW2, above). The posture zoom is in the zoom
// shell's shape (callout with an anchor at the landmark it names, no guide mark; pilot-a.closeups.mjs).
const zooms = [
  {
    key: 'five-point-bench', chip: 'Five points', heading: 'Bench contact', kind: 'posture',
    // zoom shell (render/closeup/crop.mjs): crop centre on the right pose's buttock for both halves; the Wrong is the
    // spec's Mistake dashed over the end pose, as `stills['hips-up']`.
    crop: { center: { at: 'buttock', pose: 'right', off: [0, -10] }, sizePx: 160 },
    right: 'end',
    wrong: { base: 'end', pose: MIS },
    callout: {
      right: { text: 'Hips on bench', anchor: 'buttock' },
      wrong: { text: 'Hips lifted', anchor: { at: 'buttock', pose: 'mistake' } },
    },
    caption: {
      right: 'Head, shoulders, buttocks on the bench, feet flat.',
      wrong: 'Hips lifted, low back arched.',
    },
    alt: {
      right: 'Side view, bottom of the press. Head, shoulders and buttocks lie on the bench, both feet flat on the floor.',
      wrong: 'Side view, bottom of the press. The hips lift off the bench and the low back arches.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'chest', plain: 'The chest does the main work.' }],
  secondary: [
    { muscleId: 'front_delts', plain: 'The front of the shoulders work as hard as with a barbell.' },
    { muscleId: 'triceps', plain: 'The back of the upper arm works less than with a barbell.' },
  ],
  watch: [],
  feelLine: 'You should feel this in your chest and the front of your shoulders.',
  rows: [
    // The card's first row (chest and front of shoulders) has no fix, so it is left out: the feel line says it (D-SHIP-Q16).
    { key: 'front-shoulder', where: 'Chest or front-shoulder pain', at: { muscles: ['chest', 'front_delts'] },
      means: 'You are lowering the dumbbells too fast.',
      fix: "Stop the set. Don't train through the pain.",
      redFlag: 'shoulder', claim: C(['CONSENSUS'], [ACE, 'kowalczuk2022'], 'c5, c17') },
  ],
  claim: CL.c12,
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'arch', title: 'Arching the low back', zoom: 'five-point-bench', claim: CL.arch,
    fix: 'Keep your hips and back on the bench.' },
  { key: 'bounce', title: 'Dumbbells bouncing off the chest', claim: CL.c5,
    fix: 'Lower slowly and touch gently.' },
];
const RISKS = [
  { key: 'dropped', text: 'Dropped weights cause most bad lifting injuries. Have a spotter hold your wrists.',
    claim: C(['DATA', 'CONSENSUS'], ['kerr2010', HK], 'c16, c11') },
  { key: 'pec', text: 'Pec tendon rupture while lowering the weight.', claim: CL.c17 },
  { key: 'shoulder', text: 'Shoulder injuries are common in lifting and linked to poor technique.', claim: CL.c18 },
];

export default {
  schema: 1,
  id: 'lib_dumbbell_bench_press',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'push',
    why: 'D-SHIP-HANDW2: the push heel-of-palm pair cannot be drawn by golden B\'s engine (D-LIB7-19); the grip copy carries c3 and c7.',
    orientation: 'pronated',   // c3: closed grip, palms facing forward
    handle: 'dumbbell',        // the spec's engine dumbbell primitive
    overBody: true,            // c10: lying, the dumbbells are held over the shoulders and face
    width: { text: 'Keep each dumbbell over its elbow. They drift apart slightly going down.', claim: CL.c7 },
    thumb: { mode: 'wrapped', claim: CL.c3 },
    // c3: "Handle held firmly in the palm". The card gives no palm zone; heel-of-palm is the push archetype default
    // (tools/plates/library/hands/pairs.mjs CONVENTIONS 'ga:push-heel'), as the card's grip.handContact says. Not shown.
    contact: 'heel',
    // c3 gives no degrees ("neutral: no bending forward or back"). The range is the push hand key's recorded convention
    // (pairs.mjs CONVENTIONS 'ga:push-heel': extension 0 to 15), not a card number.
    wrist: { ext: [0, 15], limitText: 'Keep the wrist neutral, not bent forward or back.',
      claim: C(['CONSENSUS'], [ACE], 'c3. The ext range is pairs.mjs CONVENTIONS ga:push-heel, a convention, not a card number.') },
    faults: [
      // card zoom wrong (c3). Not drawn (no hand zoom), so no pose or marker is set.
      { key: 'bent-back', label: 'Wrist bent back', pose: {}, markers: [], alt: 'Wrist bent back under the dumbbell.' },
    ],
    gripLine: 'Closed grip, palms facing forward, thumbs wrapped. Handle firm in your palm, wrist neutral.',
    cue: 'Handle firm in palm, wrist neutral.',   // the W2 hint text (c3)
  },
  contacts: ['bench-lying'],
  setup: [
    { kind: 'get-in', text: 'Sit on the bench end, feet on the floor, dumbbells in hand.', claim: CL.c10 },
    { kind: 'get-in', text: 'Lean back into position with the dumbbells over your shoulders.', claim: CL.c10 },
    { kind: 'brace', text: 'Feet flat, spine neutral, shoulder blades down and back.', zoom: 'five-point-bench', claim: CL.setupBack },
    { kind: 'position', text: 'Press to straight arms, dumbbells over your shoulders.', claim: CL.c10 },
    { kind: 'load', text: 'Beat target by one or two reps? Add 2 to 10 percent.', claim: CL.c14 },
  ],
  posture: [
    { key: 'contact', label: 'Five points', detail: 'Head, shoulders, buttocks and feet stay in contact.',
      anchor: { landmark: 'buttock', pose: 'end' }, zoom: 'five-point-bench', claim: CL.c2 },
    { key: 'arch', label: 'No arch', detail: 'No low-back arch, lowering or pressing.',
      anchor: { landmark: 'lumbar', pose: 'end' }, zoom: 'five-point-bench', claim: CL.c6 },
    { key: 'depth', label: 'Down to mid-chest', detail: 'Lower to mid-chest, a little wide, and touch gently.',
      anchor: { landmark: 'grip.r', pose: 'end' }, claim: CL.c5 },
    { key: 'elbow', label: 'Weight over elbow', detail: 'Each dumbbell stays roughly over its elbow.',
      anchor: { landmark: 'elbow.r', pose: 'end' }, claim: CL.c7 },
    { key: 'wrists', label: 'Wrists neutral', detail: 'Wrists neutral, not bent forward or back.',
      anchor: { landmark: 'wrist.r', pose: 'start' }, claim: CL.c3 },
  ],
  feel,
  zooms,
  chips: ['five-point-bench', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'Lie back with the dumbbells over your shoulders. Feet flat, shoulder blades down and back.',
    mistakeLine: 'Keep your hips and low back on the bench, lowering and pressing.',
    cueLine: 'Weight over elbow.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['shoulder'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/dumbbell_bench_press.json', rev: 1 },
};
