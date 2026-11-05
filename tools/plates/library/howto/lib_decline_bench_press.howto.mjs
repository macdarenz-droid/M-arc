// LIB-SHIP W4: the How-to content of lib_decline_bench_press (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/decline_bench_press.json; its claim ids are named on each field's claim.
// Family (card parent barbell_bench_press; D-SHIP-FAMILY, INHERIT_MAP lib_decline_bench_press, D-SHIP-W4-GAPZOOM): the
// card's inherit[] delegates grip.thumb, grip.handContact, grip.wrist and zooms.bar-low-palm. Those paths
// (handling.thumb.mode, handling.contact, handling.wrist, handling.faults[key=bent-back]) are written leaf-equal to
// lib_barbell_bench_press.howto.mjs (family.mjs familyRefusal, `===`); each claim cites this card's inherit[] entry.
// The setup steps are this card's own (its safety racks and spotter, c6, c7), not the parent's.
// No hand zoom (D-SHIP-HANDW4, gap-ruled on tools/plates/library/hands/no-zoom.json): bar-low-palm, inherited, is a push
// heel-of-palm pair golden B's engine cannot draw (D-LIB7-19). Its Right words are the gripLine, its Wrong the fault alt.
// Posture zoom `feet-hooked` (c1): T, a text checkpoint (no zoom). Its Right shows in copy.setupLine, its Wrong in
// copy.mistakeLine; the plate's callout "Feet hooked" marks it on the plate.
// Red flags: the card's redFlags (shoulder), golden B's shared shoulder box.
import plateSpec from '../specs/decline_bench_press.mjs';
import { RED_FLAG, RED_FLAG_SHOULDER } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_SHOULDER };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'workoutlabs-decline': { cite: 'Decline Barbell Bench Press exercise guide (WorkoutLabs)', url: 'https://workoutlabs.com/exercise-guide/decline-barbell-bench-press/',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'strengthlog-decline': { cite: 'How to Do Decline Bench Press: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/decline-bench-press/',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  lauver2016: { cite: 'Influence of bench angle on upper extremity muscular activation during bench press exercise', url: 'https://pubmed.ncbi.nlm.nih.gov/25799093/',
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
  // RED_FLAG_SHOULDER's own source (layers/howto/shared.mjs), as golden B lists it: the card's redFlags 'shoulder'.
  'nhs-shoulder-pain': { cite: 'NHS, Shoulder pain', url: 'https://www.nhs.uk/conditions/shoulder-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When shoulder pain needs a check.' },
};

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const WL = 'workoutlabs-decline', SLG = 'strengthlog-decline';
const CL = {
  c1: C(['CONSENSUS'], [WL], 'c1'),
  c3: C(['CONSENSUS'], [WL, SLG], 'c3'),
  c4: C(['CONSENSUS'], [SLG], 'c4'),
  c5: C(['CONSENSUS'], [SLG, WL], 'c5'),
  c6: C(['CONSENSUS'], [SLG, WL], 'c6'),
  c7: C(['CONSENSUS'], [WL], 'c7'),
  c11: C(['CONSENSUS'], ['acsm2009'], 'c11'),
  c13: C(['DATA'], ['kerr2010'], 'c13'),
  c14: C(['DATA'], ['kowalczuk2022'], 'c14'),
  c15: C(['DATA'], ['kolber2010'], 'c15'),
  // card inherit[]: the field is barbell_bench_press's, true here by the card's own inherit reason (MECH)
  thumb: C(['MECH'], [], 'card inherit grip.thumb (inherit:0): the bar still travels over the face, neck and chest; parent c4.'),
  hand: C(['MECH'], [], 'card inherit grip.handContact, grip.wrist, zooms.bar-low-palm (inherit:1, 2, 3): same bar and overhand grip (c3); parent c5.'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: the start (bar over the chest on locked arms, c7), the end (bar on the lower chest,
// feet hooked; c5, c1) and the spec's Mistake pose merged over the end, as the engine draws it (the bar lands high,
// toward the neck; card plate.mistake, c5). No zoom uses a drawing value.
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: plateSpec.poses.end },
  high: { pose: { ...plateSpec.poses.end, ...plateSpec.mistake.pose } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// None: the hand zoom `bar-low-palm` is gap-ruled (D-SHIP-HANDW4, above) and the posture zoom `feet-hooked` is a text
// checkpoint (T, above).
const zooms = [];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'chest', plain: 'The lower chest works as hard as on the flat bench.' }],
  secondary: [
    { muscleId: 'triceps', plain: 'The backs of the upper arms work as hard as on the flat bench.' },
    { muscleId: 'front_delts', plain: 'The front of the shoulders work less than in other presses.' },
  ],
  watch: [],
  feelLine: 'You should feel this in your lower chest and the backs of your arms.',
  rows: [
    // The card's first row (target muscles) has no fix, so it is left out: the feel line says it (D-SHIP-Q16).
    { key: 'lowering', where: 'Chest or shoulder pain while lowering', at: { muscles: ['chest', 'front_delts'] },
      means: '',   // D-FEEL-NOMEANS: c5 and c14 give no cause for the pain (SWEEP 1)
      fix: "Stop the set. Don't train through the pain.",
      redFlag: 'shoulder', claim: C(['CONSENSUS', 'DATA'], [SLG, WL, 'kowalczuk2022'], 'c5, c14') },
    { key: 'front-shoulder', where: 'Pain deep in the front shoulder', at: { muscles: ['front_delts'] },
      means: 'Poor technique can raise shoulder injury risk.',
      fix: "Stop the set. Don't train through the pain.",
      redFlag: 'shoulder', claim: CL.c15 },
  ],
  claim: C(['DATA'], ['lauver2016', 'coratella2020'], 'c9, c10'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'high', title: 'Bar landing high, toward neck', claim: C(['CONSENSUS', 'DATA', 'MECH'], [SLG, WL, 'jumbelic2007'], 'c5, c12'),
    fix: 'Lower it to the lower chest only.' },
  { key: 'safeties', title: 'Heavy without safeties or spotter', claim: CL.c6,
    fix: 'Set the safety racks. Use a spotter or go lighter.' },
  { key: 'bounce', title: 'Bar bouncing off the chest', claim: C(['CONSENSUS', 'WEAK'], [SLG, WL, 'acsm2009'], 'c5, c8'),
    fix: 'Lower with control, 2 seconds down.' },
];
const RISKS = [
  { key: 'face', text: 'Bar over face and neck: touch low. Wrap thumbs. Set the safety racks.',
    claim: C(['DATA', 'MECH', 'CONSENSUS'], ['jumbelic2007', WL, SLG], 'c12, c6, inherit:0') },
  { key: 'pec', text: 'Pec tendon rupture while lowering the bar.', claim: CL.c14 },
  { key: 'dropped', text: 'Weights dropping on the lifter is the most common weight-room injury mechanism.', claim: CL.c13 },
];

export default {
  schema: 1,
  id: 'lib_decline_bench_press',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'push',
    why: "D-SHIP-C3 no-zoom list, D-SHIP-HANDW4: bar-low-palm, inherited from barbell_bench_press: push heel-of-palm pair not drawable through golden B's engine (D-LIB7-19); no key draws it.",
    orientation: 'pronated',   // c3: overhand grip
    handle: 'bar-28',          // the spec's vendored 28 mm shaft (BAR_R 0.014)
    overBody: true,            // card inherit grip.thumb: the bar travels over the face, neck and chest
    width: { text: 'Hands slightly wider than shoulder-width.', claim: CL.c3 },
    thumb: { mode: 'wrapped', claim: CL.thumb },   // inherited (grip.thumb)
    contact: 'heel',                               // inherited (grip.handContact)
    // inherited (grip.wrist): the parent's ext range (pairs.mjs CONVENTIONS ga:push-heel, a convention) and words.
    wrist: { ext: [0, 15], limitText: 'Bar over the wrist, wrist not bent back.', claim: CL.hand },
    faults: [
      // inherited (zooms.bar-low-palm): the parent's bent-back fault, the card zoom's Wrong. Not drawn.
      { key: 'bent-back', label: 'Wrist bent back', pose: {}, markers: [], alt: 'Bar high toward the fingers, wrist bent back.' },
    ],
    // card zoom bar-low-palm Right (inherit:3), with the grip type (c3). Its "wrist straight" shows as the inherited
    // wrist.limitText's "wrist not bent back", the words parent c5 supports (SWEEP 2, 6).
    gripLine: "Overhand grip. Bar in the palm's base, not high toward the fingers, thumb wrapped.",
    cue: 'Palm base, wrist not bent back.',   // hint C
  },
  contacts: ['bench-lying'],
  setup: [
    { kind: 'safety', text: 'Set the bench in decline and the safety racks at both sides.',
      claim: C(['CONSENSUS', 'WEAK'], [SLG, 'lauver2016', 'coratella2020', WL], 'c2, c6') },
    { kind: 'adjust', text: 'Set the bar where you can reach it without straightening your arms.', claim: CL.c7 },
    { kind: 'position', text: 'Feet hooked, blades together and down, grip slightly wider than shoulders.',
      claim: C(['CONSENSUS'], [WL, SLG], 'c1, c4, c3') },
    { kind: 'get-in', text: 'New to it? Use a spotter. Lift out on locked arms.', claim: C(['CONSENSUS'], [SLG, WL], 'c6, c7') },
    { kind: 'load', text: 'Beat target by one or two reps? Add 2 to 10 percent.', claim: CL.c11 },
  ],
  posture: [
    // card zoom feet-hooked: T, a text checkpoint (Right in copy.setupLine, Wrong in copy.mistakeLine).
    { key: 'feet', label: 'Feet hooked', detail: 'Feet hooked under the pads.',
      anchor: { landmark: 'ankle.r', pose: 'end' }, claim: CL.c1 },
    { key: 'blades', label: 'Blades together', detail: 'Shoulder blades together and down.',
      anchor: { landmark: 'backUpper', pose: 'start' }, claim: CL.c4 },
    { key: 'touch', label: 'Lower-chest touch', detail: 'Bar to the lower chest only.',
      anchor: { landmark: 'grip.r', pose: 'end' }, claim: CL.c5 },
    // card posture point "Wrists straight, bar low in the palm." (inherit:1, 2; parent c5), in c5's words (SWEEP 2).
    { key: 'wrists', label: 'Low in palm', detail: 'Bar low in the palm, wrists not bent back.',
      anchor: { landmark: 'wrist.r', pose: 'start' }, claim: CL.hand },
  ],
  feel,
  zooms,
  chips: ['feel'],   // the zoom shell's chip row; no zoom on this sheet
  copy: {
    setupLine: 'Both feet locked under the pads. Blades together and down, chest up.',
    mistakeLine: 'Feet loose, not locked under the pads? Hook them before you lie back.',
    cueLine: 'Lower chest only.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['shoulder'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/decline_bench_press.json', rev: 1 },
};
