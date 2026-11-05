// LIB-SHIP W4: the How-to content of lib_incline_barbell_bench_press (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/incline_barbell_bench_press.json; its claim ids are named on each field's claim.
// Family (card parent barbell_bench_press; D-SHIP-FAMILY, INHERIT_MAP lib_incline_barbell_bench_press): the card's
// inherit[] delegates grip.thumb, grip.handContact, zooms.bar-low-palm and setup.safety-pins. Those paths
// (handling.thumb.mode, handling.contact, handling.wrist.ext, handling.faults[key=bent-back], setup[kind=safety]) are
// written leaf-equal to lib_barbell_bench_press.howto.mjs (family.mjs familyRefusal, `===`); each claim cites this card's
// inherit[] entry. grip.wrist is this card's own (c4 "wrists straight"), so wrist.limitText is its own words; the ext
// range equals the parent's (bar-low-palm leaf), and neither sheet sets a deviation range.
// No hand zoom (D-SHIP-HANDW4, gap-ruled on tools/plates/library/hands/no-zoom.json): bar-low-palm, inherited, is a push
// heel-of-palm pair golden B's engine cannot draw (D-LIB7-19). Its Right words are the gripLine, its Wrong the fault alt.
// Posture zoom `back-on-incline-pad` (c9): DV, a one-joint drawing value (the lumbar extension, below); the plate's own
// Mistake is the elbow flare (c8), so it is not reused here.
// Red flags: the card's redFlags (shoulder), golden B's shared shoulder box.
import plateSpec, { reclined } from '../specs/incline_barbell_bench_press.mjs';
import { RED_FLAG, RED_FLAG_SHOULDER } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_SHOULDER };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'boostcamp-incline': { cite: 'Incline Bench Press Exercise Guide (Boostcamp)', url: 'https://www.boostcamp.app/blogs/incline-bench-press-exercise-guide',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'boostcamp-incline-ex': { cite: 'Incline Bench Press (Barbell) exercise page (Boostcamp)', url: 'https://www.boostcamp.app/exercises/incline-bench-press-barbell',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'strengthlog-incline': { cite: 'How to Do Incline Bench Press: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/incline-bench-press/',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  rodriguezridao2020: { cite: 'Effect of Five Bench Inclinations on the Electromyographic Activity of the Pectoralis Major, Anterior Deltoid, and Triceps Brachii during the Bench Press Exercise', url: 'https://pubmed.ncbi.nlm.nih.gov/33049982/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  coratella2020: { cite: "Specific prime movers' excitation during free-weight bench press variations and chest press machine in competitive bodybuilders", url: 'https://pubmed.ncbi.nlm.nih.gov/31397215/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  lauver2016: { cite: 'Influence of bench angle on upper extremity muscular activation during bench press exercise', url: 'https://pubmed.ncbi.nlm.nih.gov/25799093/',
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
// Not cited: c14 (tempo, a plate drawing convention).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const BC = 'boostcamp-incline', BCX = 'boostcamp-incline-ex';
const CL = {
  c1: C(['CONSENSUS', 'DATA'], [BC, 'rodriguezridao2020'], 'c1'),
  c2: C(['DATA'], ['coratella2020'], 'c2'),
  c3: C(['CONSENSUS'], [BC], 'c3'),
  c4: C(['CONSENSUS'], [BC], 'c4'),
  c7: C(['CONSENSUS'], [BC, BCX], 'c7'),
  c9: C(['CONSENSUS'], [BC, BCX], 'c9'),
  c10: C(['DATA'], ['rodriguezridao2020'], 'c10'),
  c11: C(['DATA'], ['lauver2016'], 'c11'),
  c13: C(['CONSENSUS'], ['acsm2009'], 'c13'),
  c16: C(['DATA'], ['kerr2010'], 'c16'),
  flare: C(['CONSENSUS'], [BC, BCX], 'c8, c7'),
  // card inherit[]: the field is barbell_bench_press's, true here by the card's own inherit reason (MECH)
  thumb: C(['MECH'], [], 'card inherit grip.thumb (inherit:0): the bar still travels over the face, neck and chest; parent c4.'),
  hand: C(['MECH'], [], 'card inherit grip.handContact, zooms.bar-low-palm (inherit:1, 2): the same straight bar from the base of the palm; parent c5, c4 here.'),
  pins: C(['MECH'], [], 'card inherit setup.safety-pins (inherit:3): the bar is still lowered from a rack over the face; parent c6 applied to the safety catches (c6).'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: the start (bar on straight arms above the shoulders, c5), the end (bar on the upper
// chest, back on the pad; c7, c3) and the spec's Mistake merged over the end, as the engine draws it (the elbows flare,
// c8). 'arch' is the card zoom back-on-incline-pad Wrong (c9: "Low back arched off the pad, hips pushing up"), which the
// plate does not draw:
// DRAWING VALUE (D-SHIP-DRAWVAL, #376 6614695581; precedent lib_straight_arm_pulldown ARCH): ARCH, the end pose's lumbar
// (trunk) extended 15 deg past the plate's neutral 0 (c3, c9), one joint. The spec's own `reclined()` places the body
// for that trunk on the same seat, pad angle and seat tilt (it solves the pelvis tilt and the neck), so the buttock and
// upper back ride about 1 cm off the drawn pad and the lumbar about 4 cm. The card gives no size, so no number from it
// appears in user copy; the layers panel judges it. BACK, SEAT_TILT and SEAT_TOP are the spec's own constants
// (specs/incline_barbell_bench_press.mjs: 60, 12, 0.45; not exported); the guard below throws if they stop
// reproducing the spec's end pose.
const END = plateSpec.poses.end;
const ARCH = 15;
const REC = { back: 60, seatTilt: 12, seatTop: 0.45 };
{ const p = reclined({ ...REC, trunk: END.trunk }).pose;
  if (Math.abs(p.root.tilt - END.root.tilt) > 1e-9 || p.root.at.some((v, i) => Math.abs(v - END.root.at[i]) > 1e-9))
    throw new Error('lib_incline_barbell_bench_press: REC no longer reproduces the spec end pose'); }
const ARCH_POSE = reclined({ ...REC, trunk: END.trunk - ARCH }).pose;   // { root, trunk, neck }
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  flare: { pose: { ...END, ...plateSpec.mistake.pose } },
  arch: { pose: { ...END, ...ARCH_POSE } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom except the hand zoom `bar-low-palm` (D-SHIP-HANDW4, above). Zoom shell shape (callout with an anchor
// at the landmark it names, no guide mark): crop centre on the right pose's lumbar for both halves; the Wrong is the
// `arch` still drawn alone (solid).
const zooms = [
  {
    key: 'back-on-incline-pad', chip: 'Back', heading: 'Back on pad', kind: 'posture',
    crop: { center: { at: 'lumbar', pose: 'right', off: [0, 0] }, sizePx: 200 },
    right: 'end',
    wrong: { base: 'end', pose: ARCH_POSE, solid: true },
    callout: {
      right: { text: 'Back on pad', anchor: 'lumbar' },
      wrong: { text: 'Back arched', anchor: { at: 'lumbar', pose: 'mistake' } },
    },
    caption: {
      right: 'Head, shoulders and hips on the pad.',
      wrong: 'Low back arched off the pad, hips pushing up.',
    },
    alt: {
      right: 'Side view, bottom of the press. Head, shoulders and hips lie on the incline pad, feet flat.',
      wrong: 'Side view, bottom of the press. The low back arches off the pad and the hips push up.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'upper_chest', plain: 'The upper chest works more than on the flat bench while pressing.' }],
  secondary: [
    { muscleId: 'front_delts', plain: 'The front of the shoulders take more work as the bench gets steeper.' },
    { muscleId: 'triceps', plain: 'The backs of the upper arms work the same at any bench angle.' },
    { muscleId: 'chest', plain: 'The lower chest still works at 30 degrees.' },
  ],
  watch: [],
  feelLine: 'You should feel this in your upper chest and the front of your shoulders.',
  rows: [
    // The card's first row (target muscles) has no fix, so it is left out: the feel line says it (D-SHIP-Q16).
    { key: 'steep', where: 'Mostly front shoulders, little chest', at: { muscles: ['front_delts'] },
      means: 'A bench steeper than 45 degrees shifts the work to the shoulders.',
      fix: 'Set the back pad between 30 and 45 degrees.',
      claim: CL.c1 },
    { key: 'shoulder', where: 'Shoulder or chest pain or discomfort', at: { muscles: ['front_delts', 'upper_chest'] },
      means: 'The elbows flare out too far, which strains the shoulder.',
      fix: "Stop the set. Don't train through the pain.",
      redFlag: 'shoulder', claim: C(['CONSENSUS'], [BC], 'c12, c8') },
  ],
  claim: C(['DATA'], ['coratella2020', 'rodriguezridao2020', 'lauver2016'], 'c2, c1, c10, c11'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'flare', title: 'Elbows flared straight out', claim: CL.flare,
    fix: 'Keep them about 45-75 degrees from your body.' },
  { key: 'arch', title: 'Low back arching off pad', zoom: 'back-on-incline-pad', claim: C(['CONSENSUS'], [BC, BCX, 'acsm2009'], 'c9, c12, c13'),
    fix: 'Keep your back on the pad. Build up to heavier weights gradually.' },
  { key: 'bounce', title: 'Bar bouncing off the chest', claim: CL.flare,
    fix: 'Lower slowly and with control.' },
];
const RISKS = [
  { key: 'face', text: 'Bar over face and neck: wrap thumbs. Use a spotter or safety pins.',
    claim: C(['DATA', 'MECH', 'CONSENSUS'], ['jumbelic2007', BCX, BC], 'c15, c6, inherit:0, inherit:3') },
  { key: 'dropped', text: 'Weights dropping on the lifter is the most common weight-room injury mechanism.', claim: CL.c16 },
  { key: 'shoulder', text: 'Shoulder injuries are linked to poor technique. Flared elbows strain the shoulder.',
    claim: C(['DATA', 'CONSENSUS'], ['kolber2010', BC], 'c17, c8') },
];

export default {
  schema: 1,
  id: 'lib_incline_barbell_bench_press',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'push',
    why: "D-SHIP-C3 no-zoom list, D-SHIP-HANDW4: bar-low-palm, inherited from barbell_bench_press: push heel-of-palm pair not drawable through golden B's engine (D-LIB7-19); no key draws it.",
    orientation: 'pronated',   // c4: palms forward
    handle: 'bar-28',          // the spec's vendored 28 mm shaft (BAR_R 0.014)
    overBody: true,            // card inherit grip.thumb: the bar travels over the face, neck and chest
    width: { text: 'Hands slightly wider than shoulder-width.', claim: CL.c4 },
    thumb: { mode: 'wrapped', claim: CL.thumb },   // inherited (grip.thumb)
    contact: 'heel',                               // inherited (grip.handContact)
    // c4 "wrists straight" gives no degrees. The ext range is the parent's (inherited through bar-low-palm), the push
    // hand key's recorded convention (pairs.mjs CONVENTIONS 'ga:push-heel': extension 0 to 15), not a card number.
    wrist: { ext: [0, 15], limitText: 'Keep your wrists straight.',
      claim: C(['CONSENSUS'], [BC], 'c4. The ext range is pairs.mjs CONVENTIONS ga:push-heel, a convention, not a card number.') },
    faults: [
      // inherited (zooms.bar-low-palm): the parent's bent-back fault, the card zoom's Wrong. Not drawn.
      { key: 'bent-back', label: 'Wrist bent back', pose: {}, markers: [], alt: 'Bar high toward the fingers, wrist bent back.' },
    ],
    // card zoom bar-low-palm Right (inherit:2), with the grip type (c4).
    gripLine: "Closed grip, palms forward. Bar in the palm's base, thumb wrapped, wrist straight.",
    cue: 'Palm base, wrist not bent back.',   // hint C
  },
  contacts: ['bench-lying'],
  setup: [
    { kind: 'adjust', text: 'Pad at about 30 degrees. Head, shoulders, hips on it, feet flat.', zoom: 'back-on-incline-pad',
      claim: C(['CONSENSUS', 'DATA'], [BC, 'rodriguezridao2020'], 'c1, c3') },
    { kind: 'safety', text: 'Set the safety pins slightly below where the bar touches your chest.', claim: CL.pins },   // inherited
    { kind: 'grip', text: 'Grip slightly wider than shoulders, wrists straight.', claim: CL.c4 },
    { kind: 'get-in', text: 'With a spotter, unrack to straight arms above your shoulders.',
      claim: C(['CONSENSUS'], [BC, BCX, 'strengthlog-incline'], 'c6, c5') },
    { kind: 'load', text: 'Beat target by one or two reps? Add 2 to 10 percent.', claim: CL.c13 },
  ],
  posture: [
    { key: 'pad', label: 'Back on pad', detail: 'Head, shoulders and hips on the pad.',
      anchor: { landmark: 'backUpper', pose: 'end' }, zoom: 'back-on-incline-pad', claim: CL.c3 },
    { key: 'arch', label: 'No big arch', detail: 'No big low-back arch.',
      anchor: { landmark: 'lumbar', pose: 'end' }, zoom: 'back-on-incline-pad', claim: CL.c9 },
    { key: 'elbows', label: 'Elbows 45-75', detail: 'Elbows about 45-75 degrees from the torso, not flared.',
      anchor: { landmark: 'elbow.r', pose: 'end' }, claim: CL.c7 },
    { key: 'wrists', label: 'Wrists straight', detail: 'Wrists straight.',
      anchor: { landmark: 'wrist.r', pose: 'start' }, claim: CL.c4 },
    { key: 'touch', label: 'To upper chest', detail: 'Bar to the upper chest, never the neck.',
      anchor: { landmark: 'grip.r', pose: 'end' }, claim: C(['DATA', 'MECH'], ['jumbelic2007', BCX], 'c15') },
  ],
  feel,
  zooms,
  chips: ['back-on-incline-pad', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'Pad at about 30 degrees. Head, shoulders and hips on the pad, feet flat.',
    mistakeLine: 'Keep your back on the pad, with no big low-back arch.',
    cueLine: 'To the upper chest.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['shoulder'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/incline_barbell_bench_press.json', rev: 1 },
};
