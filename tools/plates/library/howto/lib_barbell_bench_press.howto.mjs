// LIB-SHIP W4: the How-to content of lib_barbell_bench_press (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/barbell_bench_press.json; its claim ids are named on each field's claim.
// Family parent (BENCH-BB): close_grip, decline, incline_barbell and smith_machine bench presses inherit leaves of this
// sheet (INHERIT_MAP, D-SHIP-W4-GAPZOOM): handling.thumb.mode, handling.contact, handling.wrist, handling.faults
// [key=bent-back], setup[kind=safety] and setup[kind=get-in]. So the sheet has exactly one setup step of each of those
// two kinds, and those strings are the card's own setup steps (the children's cards repeat them word for word).
// No hand zoom (D-SHIP-HANDW4, gap-ruled on tools/plates/library/hands/no-zoom.json): the card's hand zoom
// `bar-low-palm` (c5) is a push heel-of-palm pair that golden B's engine cannot draw (D-LIB7-19). Its Right words are
// the gripLine, its Wrong words the bent-back fault's alt.
// Posture zoom `hips-on-bench` (c10): T, a text checkpoint (no zoom; the plate's Mistake is the bar path, c25). Its
// Right and Wrong show in the hips mistake (fix and title; D-TEXT-PRINTED), and in copy.setupLine / copy.mistakeLine.
// Way out (c6, c7): the shared equipment-move card docs/research/howto/shared/unrack-rerack.json (press-rack) covers this
// id; no W2/W3 sheet imports a shared equipment-move card (lib_barbell_overhead_press writes its own rack steps), so the
// pins and spotter steps are this card's own (c6, c7, c27).
// Red flags: the card's redFlags (shoulder, wrist), golden B's shared boxes.
import plateSpec from '../specs/barbell_bench_press.mjs';
import { RED_FLAG, RED_FLAG_SHOULDER } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_SHOULDER };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'stronglifts-bench': { cite: 'How to Bench Press with Proper Form: The Definitive Guide (StrongLifts)', url: 'https://stronglifts.com/bench-press/',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'hk-bench-youth': { cite: 'A step by step guide for a proper bench press (Human Kinetics excerpt from Youth Strength Training, Faigenbaum and Westcott)', url: 'https://us.humankinetics.com/blogs/excerpt/a-step-by-step-guide-for-a-proper-bench-press',
    kind: 'textbook', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'ace-bb-chest-press': { cite: 'Chest Press (barbell), ACE Exercise Library', url: 'https://www.acefitness.org/resources/everyone/exercise-library/5/chest-press/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'sbs-bench': { cite: 'How to Bench Press: The Definitive Guide (Stronger by Science)', url: 'https://www.strongerbyscience.com/how-to-bench/',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  saeterbakken2021: { cite: 'The Effect of Grip Width on Muscle Strength and Electromyographic Activity in Bench Press among Novice- and Resistance-Trained Men', url: 'https://pubmed.ncbi.nlm.nih.gov/34198674/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  rodriguezridao2020: { cite: 'Effect of Five Bench Inclinations on the Electromyographic Activity of the Pectoralis Major, Anterior Deltoid, and Triceps Brachii during the Bench Press Exercise', url: 'https://pubmed.ncbi.nlm.nih.gov/33049982/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  coratella2020: { cite: "Specific prime movers' excitation during free-weight bench press variations and chest press machine in competitive bodybuilders", url: 'https://pubmed.ncbi.nlm.nih.gov/31397215/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  kowalczuk2022: { cite: 'Pectoralis Major Rupture: Evaluation and Management', url: 'https://pubmed.ncbi.nlm.nih.gov/35025841/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  jumbelic2007: { cite: 'Traumatic asphyxia in weightlifters', url: 'https://pubmed.ncbi.nlm.nih.gov/17456099/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  kerr2010: { cite: 'Epidemiology of weight training-related injuries presenting to United States emergency departments, 1990 to 2007', url: 'https://pubmed.ncbi.nlm.nih.gov/20139328/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  kolber2010: { cite: 'Shoulder injuries attributed to resistance training: a brief review', url: 'https://pubmed.ncbi.nlm.nih.gov/20508476/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  acsm2009: { cite: 'American College of Sports Medicine position stand. Progression models in resistance training for healthy adults', url: 'https://pubmed.ncbi.nlm.nih.gov/19204579/',
    kind: 'guideline', access: 'abstract', checked: '2026-10-17', use: 'CONSENSUS' },
  // The shared boxes' own sources (layers/howto/shared.mjs), as golden B lists them: the card's redFlags.
  'nhs-shoulder-pain': { cite: 'NHS, Shoulder pain', url: 'https://www.nhs.uk/conditions/shoulder-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When shoulder pain needs a check.' },
  'nhs-wrist-pain': { cite: 'NHS, Wrist pain', url: 'https://www.nhs.uk/conditions/hand-pain/wrist-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When wrist pain needs a check.' },
};
// Not cited: c3 (the 45-60 range no shown line uses; hips on the bench is c10), c11 (bounce, dropped from
// handlingMistakes by ruling R-LB2-2), c13's 2-5 cm hook clearance (no card setup step gives it), c15 (learn with a light
// bar; no card slot gives it), c17, c26 (tempo, a plate drawing convention).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const SL = 'stronglifts-bench', HK = 'hk-bench-youth', SBS = 'sbs-bench';
const CL = {
  c1: C(['CONSENSUS'], ['ace-bb-chest-press'], 'c1'),
  c2: C(['CONSENSUS'], [HK, SL], 'c2'),
  c4: C(['CONSENSUS'], [HK, SL], 'c4'),
  c5: C(['CONSENSUS'], [SL, SBS], 'c5'),
  c6: C(['CONSENSUS'], [SL], 'c6'),
  c8: C(['CONSENSUS'], [SL], 'c8'),
  c10: C(['CONSENSUS'], [SL, HK], 'c10'),
  c12: C(['CONSENSUS'], [SBS], 'c12'),
  c16: C(['CONSENSUS'], ['acsm2009'], 'c16'),
  c22: C(['DATA'], ['kowalczuk2022'], 'c22'),
  c23: C(['DATA'], ['kerr2010'], 'c23'),
  hips: C(['CONSENSUS'], ['ace-bb-chest-press', SL, HK], 'c1, c10'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: the start (bar over the shoulders on straight arms, c8), the end (bar on the
// mid-chest, forearms vertical, c2) and the spec's Mistake pose merged over the end, as the engine draws it (the bar
// driven straight up off the chest; card plate.mistake, c25). No zoom uses a drawing value.
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: plateSpec.poses.end },
  'straight-up': { pose: { ...plateSpec.poses.end, ...plateSpec.mistake.pose } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// None: the hand zoom `bar-low-palm` is gap-ruled (D-SHIP-HANDW4, above) and the posture zoom `hips-on-bench` is a
// text checkpoint (T, above).
const zooms = [];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const HANDS = ['hand-left', 'hand-right', 'hand-back-left', 'hand-back-right'];
const feel = {
  primary: [{ muscleId: 'chest', plain: 'The flat bench works the middle and lower chest most.' }],
  secondary: [
    { muscleId: 'front_delts', plain: 'The front of the shoulders help. Grip width shifts how much.' },
    { muscleId: 'triceps', plain: 'The back of the upper arm works more than on an incline bench.' },
  ],
  watch: [],
  feelLine: 'You should feel this in your mid-chest, front shoulders and the backs of your arms.',
  rows: [
    // The card's first row (target muscles) has no fix, so it is left out: the feel line says it (D-SHIP-Q16).
    { key: 'lowering', where: 'Chest or shoulder pain while lowering', at: { muscles: ['chest', 'front_delts'] },
      means: 'Lowering fast can add stress to the shoulders and pec tendons.',
      fix: "Stop the set. Don't train through the pain.",
      redFlag: 'shoulder', claim: C(['CONSENSUS'], [SBS], 'c18') },
    { key: 'front-shoulder', where: 'Pain deep in the front shoulder', at: { muscles: ['front_delts'] },
      means: 'Poor technique can raise shoulder injury risk.',
      fix: "Stop and don't train through the pain. Tuck elbows in about 75 degrees.",
      redFlag: 'shoulder', claim: C(['DATA', 'CONSENSUS'], ['kolber2010', HK, SL], 'c24, c2') },
    { key: 'wrist', where: 'Wrist pain or strain', at: { parts: HANDS },
      means: 'A bar high toward the fingers can bend the wrist back.',
      fix: "Grip the bar lower in the palm. Don't train through the pain.",
      redFlag: true, claim: CL.c5 },
  ],
  claim: C(['DATA'], ['rodriguezridao2020', 'saeterbakken2021', 'coratella2020'], 'c19, c20, c21'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'path', title: 'Pressing straight up off chest', claim: C(['CONSENSUS'], [SBS, SL], 'c25, c8'),
    fix: 'Drive it up and slightly back toward your shoulders.' },
  { key: 'thumbless', title: 'Thumbless grip', claim: CL.c4,
    fix: 'Wrap your thumbs round the bar.' },
  // card handlingMistake c10 with the card zoom hips-on-bench (T) Wrong in the title and Right in the fix, and posture
  // point c1 (D-TEXT-PRINTED: copy.setupLine and copy.mistakeLine are not printed)
  { key: 'hips', title: 'Hips lifting, low back over-arched', claim: CL.hips,
    fix: 'Buttocks down, feet pressing the floor. Lifted hips fail the rep.' },
];
const RISKS = [
  { key: 'face', text: 'Bar over face and neck: wrap the thumbs. Use safety pins or a spotter.',
    claim: C(['DATA', 'CONSENSUS'], ['jumbelic2007', HK, SL], 'c9, c4, c6, c7') },
  { key: 'pec', text: 'Pec tendon rupture while lowering the bar.', claim: CL.c22 },
  { key: 'dropped', text: 'Weights dropping on the lifter are a leading cause of weight-training injuries.', claim: CL.c23 },
];

export default {
  schema: 1,
  id: 'lib_barbell_bench_press',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'push',
    why: "D-SHIP-C3 no-zoom list, D-SHIP-HANDW4: bar-low-palm: push heel-of-palm pair not drawable through golden B's engine (D-LIB7-19); no key draws it; the grip copy carries c4 and c5.",
    orientation: 'pronated',   // c4 (card grip.type): closed grip, palms facing the feet
    handle: 'bar-28',          // the spec's vendored 28 mm shaft (BAR_R 0.014)
    overBody: true,            // c7: the bar travels over the face, neck and chest
    width: { text: 'Hands slightly wider than shoulder-width.', claim: CL.c1 },
    thumb: { mode: 'wrapped', claim: CL.c4 },
    contact: 'heel',           // c5 (card grip.handContact): the bar in the base of the palm, close to the wrist
    // c5 gives no degrees ("so the wrists do not bend back"). The range is the push hand key's recorded convention
    // (tools/plates/library/hands/pairs.mjs CONVENTIONS 'ga:push-heel': extension 0 to 15), not a card number.
    wrist: { ext: [0, 15], limitText: 'Bar over the wrist, wrist not bent back.',
      claim: C(['CONSENSUS'], [SL, SBS], 'c5. The ext range is pairs.mjs CONVENTIONS ga:push-heel, a convention, not a card number.') },
    faults: [
      // card zoom bar-low-palm Wrong (c5). Not drawn (no hand zoom), so no pose or marker is set.
      { key: 'bent-back', label: 'Wrist bent back', pose: {}, markers: [], alt: 'Bar high toward the fingers, wrist bent back.' },
    ],
    // card zoom bar-low-palm Right (c5), with the grip type (c4). Its "wrist straight" shows as wrist.limitText's
    // "wrist not bent back", the words c5 supports (SWEEP 2, 6: the grey line carries it, not a repeat).
    gripLine: "Closed grip, palms toward your feet. Bar in the palm's base, thumb wrapped.",
    cue: 'Palm base, wrist not bent back.',   // hint C (c5)
  },
  contacts: ['bench-lying'],
  setup: [
    { kind: 'safety', text: 'Set the safety pins slightly below where the bar touches your chest.', claim: CL.c6 },
    { kind: 'position', text: 'Shoulders at least 8 cm from uprights. Feet flat. Blades together.',
      claim: C(['CONSENSUS'], [HK, SBS], 'c13, c14, c12') },
    { kind: 'grip', text: 'Grip slightly wider than shoulders, thumbs wrapped, bar low in the palm.',
      claim: C(['CONSENSUS'], [HK, SL, 'ace-bb-chest-press', SBS], 'c4, c1, c5') },
    { kind: 'get-in', text: 'With a spotter behind your head, unrack the bar to straight arms.',
      claim: C(['CONSENSUS'], [HK, SL], 'c7, c27') },
    { kind: 'load', text: 'Beat target by one or two reps? Add 2 to 10 percent.', claim: CL.c16 },
  ],
  posture: [
    // card zoom hips-on-bench: T, a text checkpoint (Right and Wrong in mistakes[key=hips], D-TEXT-PRINTED).
    { key: 'hips', label: 'Hips down', detail: 'Buttocks on the bench, feet pressing the floor.',
      anchor: { landmark: 'buttock', pose: 'end' }, claim: CL.hips },
    { key: 'blades', label: 'Blades together', detail: 'Shoulder blades together before you unrack.',
      anchor: { landmark: 'backUpper', pose: 'start' }, claim: CL.c12 },
    { key: 'elbows', label: 'Elbows tucked', detail: 'Elbows tucked in about 75 degrees as you lower.',
      anchor: { landmark: 'elbow.r', pose: 'end' }, claim: CL.c2 },
    { key: 'forearms', label: 'Forearms vertical', detail: 'Forearms vertical at the bottom.',
      anchor: { landmark: 'grip.r', pose: 'end' }, claim: CL.c2 },
    // card posture point "Wrists straight, bar low in the palm." (c5), in c5's own words (SWEEP 2).
    { key: 'wrists', label: 'Low in palm', detail: 'Bar low in the palm, wrists not bent back.',
      anchor: { landmark: 'wrist.r', pose: 'start' }, claim: CL.c5 },
    { key: 'path', label: 'Bar path', detail: 'Bar travels between mid-chest and over the shoulders, never to the neck.',
      anchor: { landmark: 'grip.r', pose: 'start' }, claim: CL.c8 },
  ],
  feel,
  zooms,
  chips: ['feel'],   // the zoom shell's chip row; no zoom on this sheet
  copy: {
    setupLine: 'Pins set. Buttocks on the bench, feet pressing the floor, blades together.',
    mistakeLine: "Hips lifted off the bench, low back over-arched? That rep counts as failed.",
    cueLine: 'Up and back over the shoulders.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['shoulder', 'wrist'],   // the card's redFlags, in its order
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/barbell_bench_press.json', rev: 1 },
};
