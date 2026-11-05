// LIB-SHIP W4: the How-to content of lib_close_grip_bench_press (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/close_grip_bench_press.json; its claim ids are named on each field's claim.
// Family (card parent barbell_bench_press; D-SHIP-FAMILY, INHERIT_MAP lib_close_grip_bench_press, D-SHIP-W4-GAPZOOM):
// the card's inherit[] delegates grip.thumb, grip.handContact, grip.wrist, setup.safety-pins, setup.spotter and
// zooms.bar-low-palm. Those paths (handling.thumb.mode, handling.contact, handling.wrist, handling.faults[key=bent-back],
// setup[kind=safety], setup[kind=get-in]) are written leaf-equal to lib_barbell_bench_press.howto.mjs (family.mjs
// familyRefusal, `===`); each claim cites this card's inherit[] entry, not the parent.
// No hand zoom (D-SHIP-HANDW4, gap-ruled on tools/plates/library/hands/no-zoom.json): bar-low-palm, inherited, is a push
// heel-of-palm pair golden B's engine cannot draw (D-LIB7-19). Its Right words are the gripLine, its Wrong the fault alt.
// Posture zoom `elbows-to-ribs` (c2): M, the Wrong is the plate's own Mistake (elbows flare, bar lands high).
// Red flags: the card's redFlags (shoulder), golden B's shared shoulder box.
import plateSpec from '../specs/close_grip_bench_press.mjs';
import { RED_FLAG, RED_FLAG_SHOULDER } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_SHOULDER };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'ace-cgbp': { cite: 'Close-grip Bench Press, ACE Exercise Library', url: 'https://www.acefitness.org/resources/everyone/exercise-library/311/close-grip-bench-press/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'strengthlog-cgbp': { cite: 'How to Do Close-Grip Bench Press: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/close-grip-bench-press/',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'sbs-bench': { cite: 'How to Bench Press: The Definitive Guide (Stronger by Science)', url: 'https://www.strongerbyscience.com/how-to-bench/',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  saeterbakken2021: { cite: 'The Effect of Grip Width on Muscle Strength and Electromyographic Activity in Bench Press among Novice- and Resistance-Trained Men', url: 'https://pubmed.ncbi.nlm.nih.gov/34198674/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  lockie2017: { cite: 'An Investigation of the Mechanics and Sticking Region of a One-Repetition Maximum Close-Grip Bench Press versus the Traditional Bench Press', url: 'https://pubmed.ncbi.nlm.nih.gov/29910406/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'CONSENSUS' },
  jumbelic2007: { cite: 'Traumatic asphyxia in weightlifters', url: 'https://pubmed.ncbi.nlm.nih.gov/17456099/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  kerr2010: { cite: 'Epidemiology of weight training-related injuries presenting to United States emergency departments, 1990 to 2007', url: 'https://pubmed.ncbi.nlm.nih.gov/20139328/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  kolber2010: { cite: 'Shoulder injuries attributed to resistance training: a brief review', url: 'https://pubmed.ncbi.nlm.nih.gov/20508476/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  acsm2009: { cite: 'American College of Sports Medicine position stand. Progression models in resistance training for healthy adults', url: 'https://pubmed.ncbi.nlm.nih.gov/19204579/',
    kind: 'guideline', access: 'abstract', checked: '2026-10-17', use: 'CONSENSUS' },
  // RED_FLAG_SHOULDER's own source (layers/howto/shared.mjs), as golden B lists it: the card's redFlags 'shoulder'.
  'nhs-shoulder-pain': { cite: 'NHS, Shoulder pain', url: 'https://www.nhs.uk/conditions/shoulder-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When shoulder pain needs a check.' },
};
// Not cited: c9 (tempo, a plate drawing convention).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const ACE = 'ace-cgbp', SLG = 'strengthlog-cgbp';
const CL = {
  c1: C(['CONSENSUS'], [ACE, SLG, 'lockie2017'], 'c1'),
  c2: C(['CONSENSUS'], [ACE], 'c2'),
  c3: C(['CONSENSUS'], [ACE], 'c3'),
  c4: C(['CONSENSUS'], [SLG, 'sbs-bench'], 'c4'),
  c5: C(['CONSENSUS'], [SLG], 'c5'),
  c6: C(['CONSENSUS'], [SLG], 'c6'),
  c7: C(['DATA'], ['saeterbakken2021'], 'c7'),
  c8: C(['CONSENSUS'], ['acsm2009'], 'c8'),
  c11: C(['DATA'], ['kerr2010'], 'c11'),
  c12: C(['DATA'], ['kolber2010'], 'c12'),
  // card inherit[]: the field is barbell_bench_press's, true here by the card's own inherit reason (MECH)
  thumb: C(['MECH'], [], 'card inherit grip.thumb (inherit:0): the bar still travels over the face, neck and chest (barbell_bench_press thumb rule).'),
  hand: C(['MECH'], [], 'card inherit grip.handContact, grip.wrist, zooms.bar-low-palm (inherit:1, 2, 5): same straight bar from the base of the palm (barbell_bench_press wrist and contact rule).'),
  pins: C(['MECH'], [], 'card inherit setup.safety-pins (inherit:3): same flat bench in the same rack (barbell_bench_press pins step).'),
  spotter: C(['MECH'], [], 'card inherit setup.spotter (inherit:4): same J-hooks over the face (barbell_bench_press spotter step).'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: the end (bar on the low chest, elbows by the ribs; c4, c2) and the spec's Mistake
// pose merged over it, as the engine draws it (elbows drift from the ribs, the bar lands high; card plate.mistake, c2).
// The card zoom elbows-to-ribs Wrong is that drawn fault, so no drawing value is added. The zoom draws it solid, on its
// own (wrong.solid): dashed over the end pose the engine masked it inside the body and the Wrong read as the Right
// (W4 layers panel L1/L5, #391 6653540190).
const MIS = plateSpec.mistake.pose;
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: plateSpec.poses.end },
  flare: { pose: { ...plateSpec.poses.end, ...MIS } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom except the hand zoom `bar-low-palm` (D-SHIP-HANDW4, above). Zoom shell shape (callout with an anchor
// at the landmark it names, no guide mark): crop centre on the right pose's elbow for both halves; the Wrong is the
// spec's Mistake pose (`stills.flare`) drawn solid: the bar high on the chest, the upper arm out from the ribs.
const zooms = [
  {
    key: 'elbows-to-ribs', chip: 'Elbows', heading: 'Elbow path', kind: 'posture',
    crop: { center: { at: 'elbow.r', pose: 'right', off: [20, -10] }, sizePx: 180 },
    right: 'end',
    wrong: { base: 'end', pose: MIS, solid: true },
    callout: {
      right: { text: 'Elbows to ribs', anchor: 'elbow.r' },
      wrong: { text: 'Elbows flare', anchor: { at: 'elbow.r', pose: 'mistake' } },
    },
    caption: {
      right: 'Elbows close to the ribs, bar low on the chest.',
      wrong: 'Elbows flared, bar high toward the neck.',
    },
    alt: {
      right: 'Side view, bottom of the press. The elbows stay close to the ribs. The bar touches the low chest, where the ribs end.',
      wrong: 'Side view, bottom of the press. The elbows drift away from the ribs and the bar lands high on the chest.',
    },
    feelRow: 'front-shoulder',
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'triceps', plain: 'The backs of the upper arms do more of the work.' }],
  secondary: [
    { muscleId: 'chest', plain: 'The chest works less than on the regular bench.' },
    { muscleId: 'front_delts', plain: 'The front of the shoulders work less than with a medium grip.' },
  ],
  watch: [],
  feelLine: 'You should feel this in the backs of your upper arms, and some chest.',
  rows: [
    // The card's first row (target muscles) has no fix, so it is left out: the feel line says it (D-SHIP-Q16).
    { key: 'grip-width', where: 'Mostly the front of the shoulders', at: { muscles: ['front_delts'] },
      means: 'A wider grip can work the front shoulders more.',
      fix: 'Bring the hands in line with the shoulders.',
      claim: C(['DATA', 'CONSENSUS'], ['saeterbakken2021', ACE, SLG, 'lockie2017'], 'c7, c1') },
    { key: 'front-shoulder', where: 'Pain deep in the front shoulder', at: { muscles: ['front_delts'] },
      means: 'Poor technique can raise shoulder injury risk.',
      fix: "Stop and don't train through the pain. Keep elbows close to your ribs.",
      zoom: 'elbows-to-ribs', redFlag: 'shoulder', claim: C(['DATA', 'CONSENSUS'], ['kolber2010', ACE], 'c12, c2') },
  ],
  claim: C(['CONSENSUS', 'DATA'], [SLG, 'saeterbakken2021'], 'c6, c7'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'flare', title: 'Elbows flaring, bar landing high', zoom: 'elbows-to-ribs', claim: CL.c2,
    fix: 'Keep the elbows close to your ribs and touch low.' },
  { key: 'load', title: 'Loading it like regular bench', claim: CL.c6,
    fix: 'Use less weight than your regular bench.' },
  { key: 'hips', title: 'Hips lifting off the bench', claim: CL.c3,
    fix: 'Press your hips into the bench.' },
];
const RISKS = [
  { key: 'face', text: 'Bar over face and neck: touch low. Wrap thumbs. Use pins or a spotter.',
    claim: C(['DATA', 'MECH', 'CONSENSUS'], ['jumbelic2007', SLG, 'sbs-bench'], 'c10, c4, inherit:0, inherit:3, inherit:4') },
  { key: 'dropped', text: 'Weights dropping on the lifter are a leading cause of weight-training injuries.', claim: CL.c11 },
  { key: 'shoulder', text: 'Shoulder injuries are common in lifting and linked to poor technique.', claim: CL.c12 },
];

export default {
  schema: 1,
  id: 'lib_close_grip_bench_press',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'push',
    why: "D-SHIP-C3 no-zoom list, D-SHIP-HANDW4: bar-low-palm, inherited from barbell_bench_press: push heel-of-palm pair not drawable through golden B's engine (D-LIB7-19); no key draws it.",
    orientation: 'pronated',   // card grip.type: closed overhand grip
    handle: 'bar-28',          // the spec's vendored 28 mm shaft (BAR_R 0.014)
    overBody: true,            // card inherit grip.thumb: the bar travels over the face, neck and chest
    width: { text: 'Hands in line with your shoulders, about shoulder-width.', claim: CL.c1 },
    thumb: { mode: 'wrapped', claim: CL.thumb },   // inherited (grip.thumb)
    contact: 'heel',                               // inherited (grip.handContact)
    // inherited (grip.wrist): the parent's ext range (pairs.mjs CONVENTIONS ga:push-heel, a convention) and words.
    wrist: { ext: [0, 15], limitText: 'Bar over the wrist, wrist not bent back.', claim: CL.hand },
    faults: [
      // inherited (zooms.bar-low-palm): the parent's bent-back fault, the card zoom's Wrong. Not drawn.
      { key: 'bent-back', label: 'Wrist bent back', pose: {}, markers: [], alt: 'Bar high toward the fingers, wrist bent back.' },
    ],
    // card zoom bar-low-palm Right (inherit:5), with the grip type. Its "wrist straight" shows as the inherited
    // wrist.limitText's "wrist not bent back", the words the parent's wrist rule supports (inherit:2; SWEEP 2, 6).
    // Claims (no gripLine claim slot in HandlingSpec): inherit:0 (thumb), inherit:1 (palm base).
    gripLine: "Closed overhand grip. Bar in the palm's base, not high toward the fingers, thumb wrapped.",
    cue: 'Palm base, wrist not bent back.',   // hint C
  },
  contacts: ['bench-lying'],
  setup: [
    { kind: 'safety', text: 'Set the safety pins slightly below where the bar touches your chest.', claim: CL.pins },   // inherited
    { kind: 'position', text: 'Lie down, shoulder blades together and down, feet on the floor.', claim: CL.c5 },
    { kind: 'grip', text: 'Grip with your hands in line with your shoulders, thumbs wrapped.', claim: CL.c1 },
    { kind: 'get-in', text: 'With a spotter behind your head, unrack the bar to straight arms.', claim: CL.spotter },   // inherited
    { kind: 'load', text: 'Beat target by one or two reps? Add 2 to 10 percent.', claim: CL.c8 },
  ],
  posture: [
    { key: 'hands', label: 'Hands in line', detail: 'Hands in line with the shoulders.',
      anchor: { landmark: 'grip.r', pose: 'start' }, claim: CL.c1 },
    { key: 'elbows', label: 'Elbows to ribs', detail: 'Elbows close to the ribs.',
      anchor: { landmark: 'elbow.r', pose: 'end' }, zoom: 'elbows-to-ribs', claim: CL.c2 },
    { key: 'touch', label: 'Low-chest touch', detail: 'Bar to the low chest, never toward the neck.',
      anchor: { landmark: 'grip.r', pose: 'end' }, zoom: 'elbows-to-ribs', claim: CL.c4 },
    { key: 'hips', label: 'Hips pressed down', detail: 'Hips on the bench, feet pushing the floor.',
      anchor: { landmark: 'buttock', pose: 'end' }, claim: CL.c3 },
    { key: 'blades', label: 'Blades together', detail: 'Shoulder blades together and down.',
      anchor: { landmark: 'backUpper', pose: 'start' }, claim: CL.c5 },
  ],
  feel,
  zooms,
  chips: ['elbows-to-ribs', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'Hands in line with your shoulders. Blades together and down, feet on the floor.',
    mistakeLine: 'Keep your elbows close to your ribs and touch the bar low.',
    cueLine: 'Elbows to ribs.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['shoulder'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/close_grip_bench_press.json', rev: 1 },
};
