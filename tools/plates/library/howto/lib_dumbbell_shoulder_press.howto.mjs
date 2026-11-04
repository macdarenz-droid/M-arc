// LIB-SHIP W2: the How-to content of lib_dumbbell_shoulder_press (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/dumbbell_shoulder_press.json; its claim ids are named on each field's claim.
// No hand zoom (D-SHIP-HANDW2, gap-ruled on tools/plates/library/hands/no-zoom.json): the card's hand zoom
// `wrist-neutral-press` (c2) is a push heel-of-palm pair that golden B's engine cannot draw (D-LIB7-19). Its hand claims
// (closed pronated grip, thumbs wrapped, handle firm in the palm, wrists neutral; c2) live in handling and setup step 2.
// Red flags: the card's redFlags (shoulder), golden B's shared shoulder box.
import plateSpec from '../specs/dumbbell_shoulder_press.mjs';
import { landmarksOf, rootOnSeat, fk, resolve, normPose } from '../engine.mjs';
import { RED_FLAG, RED_FLAG_SHOULDER } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_SHOULDER };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'ace-seated-ohp': { cite: 'Seated Overhead Press, ACE Exercise Library', url: 'https://www.acefitness.org/resources/everyone/exercise-library/45/seated-overhead-press/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  saeterbakken2013: { cite: 'Effects of body position and loading modality on muscle activity and strength in shoulder presses', url: 'https://pubmed.ncbi.nlm.nih.gov/23096062/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  kolber2013: { cite: 'Characteristics of anterior shoulder instability and hyperlaxity in the weight-training population', url: 'https://pubmed.ncbi.nlm.nih.gov/22836608/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'WEAK' },
  esenkaya2000: { cite: 'Bilateral anterior shoulder dislocation in a weight lifter', url: 'https://pubmed.ncbi.nlm.nih.gov/20086631/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'WEAK' },
  acsm2009: { cite: 'American College of Sports Medicine position stand. Progression models in resistance training for healthy adults', url: 'https://pubmed.ncbi.nlm.nih.gov/19204579/',
    kind: 'guideline', access: 'abstract', checked: '2026-10-17', use: 'CONSENSUS' },
  kolber2010: { cite: 'Shoulder injuries attributed to resistance training: a brief review', url: 'https://pubmed.ncbi.nlm.nih.gov/20508476/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  kerr2010: { cite: 'Epidemiology of weight training-related injuries presenting to United States emergency departments, 1990 to 2007', url: 'https://pubmed.ncbi.nlm.nih.gov/20139328/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  // RED_FLAG_SHOULDER's own source (layers/howto/shared.mjs), as golden B's lateral raise lists it: the card's redFlags 'shoulder'.
  'nhs-shoulder-pain': { cite: 'NHS, Shoulder pain', url: 'https://www.nhs.uk/conditions/shoulder-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When shoulder pain needs a check.' },
};
// Not cited: c12 (tempo, a plate drawing convention).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const ACE = 'ace-seated-ohp';
const CL = {
  c1: C(['CONSENSUS'], [ACE], 'c1'),
  c2: C(['CONSENSUS'], [ACE], 'c2'),
  c3: C(['CONSENSUS'], [ACE], 'c3'),
  c4: C(['CONSENSUS'], [ACE], 'c4'),
  c5: C(['CONSENSUS'], [ACE], 'c5'),
  c6: C(['CONSENSUS'], [ACE], 'c6'),
  c7: C(['CONSENSUS'], [ACE], 'c7'),
  c10: C(['DATA', 'WEAK'], ['kolber2013', 'esenkaya2000'], 'c10'),
  c11: C(['CONSENSUS'], ['acsm2009'], 'c11'),
  c13: C(['DATA'], ['kolber2010'], 'c13'),
  c14: C(['DATA'], ['kerr2010'], 'c14'),
  feel: C(['DATA'], ['saeterbakken2013'], 'c8, c9'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses. 'arch' (card zoom seat-back-contact Wrong, c4: "Low back arched off the pad"): the
// spec's Mistake draws the dumbbells behind the head (c10), not the arch, so the arch is built here by pilot A's arch
// method (as tools/plates/library/specs/incline_dumbbell_press.mjs draws its Mistake): from the end pose the pelvis tips
// forward MIS_TILT, the root slides along the seat face until the buttocks are back on the pad, the lumbar spine extends
// until the upper back is back on the pad (trunk solved), the neck puts the back of the skull on the pad, and the grips
// move with the shoulders. So only the low back leaves the pad. The pad and seat faces are the spec's own check planes.
// DRAWING VALUES (D-SHIP-DRAWVAL, #376 6614695581; precedent D-LIB7-2, golden B's machine_chest_press seatDrop and the
// incline_dumbbell_press spec's MIS_TILT 36): MIS_TILT 36 deg sizes the arch (the low back leaves the pad by 9 cm, as on
// the incline plate); no card gives it, no number from it appears in user copy; the layers panel judges it.
const H = 1.75, MIS_TILT = 36, OCCIPUT = [0, 0.955, -0.056];   // OCCIPUT: back of the skull (head frame, H), the spec's point
const END = plateSpec.poses.end;
const planeOf = lm => plateSpec.checks.find(c => c.landmark === lm && c.plane).plane;
const PAD = planeOf('backUpper'), SEAT = planeOf('seat');
const padDist = p => (p[1] - PAD.point[1]) * PAD.normal[1] + (p[2] - PAD.point[2]) * PAD.normal[2];
const zeroOf = (f, lo, hi) => { const s = f(lo) > 0 ? -1 : 1; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (s * f(m) > 0) hi = m; else lo = m; } return (lo + hi) / 2; };
const occiput = p => { const b = { height: H }; return fk(resolve(normPose(p, b), b).q, b).head(OCCIPUT); };
const ALONG = [0, -SEAT.normal[2], SEAT.normal[1]], SEAT0 = landmarksOf(END, H).seat, TILT = END.root.tilt + MIS_TILT;
const rootAt = sl => ({ at: rootOnSeat(SEAT0.map((v, i) => v + ALONG[i] * sl), TILT, H), tilt: TILT });
const ROOT = rootAt(zeroOf(sl => padDist(landmarksOf({ ...END, root: rootAt(sl) }, H).buttock), -0.2, 0.2));
const TRUNK = zeroOf(t => padDist(landmarksOf({ ...END, root: ROOT, trunk: t }, H).backUpper), -70, 20);
const NECK = zeroOf(n => padDist(occiput({ ...END, root: ROOT, trunk: TRUNK, neck: n })), -40, 60);
const ARCH = (() => {
  const E = landmarksOf(END, H), M = landmarksOf({ ...END, root: ROOT, trunk: TRUNK, neck: NECK }, H), reach = {};
  for (const sd of ['l', 'r']) { const d = [0, 1, 2].map(i => M[`shoulder.${sd}`][i] - E[`shoulder.${sd}`][i]);
    reach[sd] = { ...END.reach[sd], at: END.reach[sd].at.map((v, i) => v + d[i]) }; }
  return { root: ROOT, trunk: TRUNK, neck: NECK, reach };
})();
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  arch: { pose: { ...END, ...ARCH } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom except the hand zoom `wrist-neutral-press` (D-SHIP-HANDW2, above). The posture zoom is in the zoom
// shell's shape (callout with an anchor at the landmark it names, no guide mark; pilot-a.closeups.mjs).
const zooms = [
  {
    key: 'seat-back-contact', chip: 'Back', heading: 'Back contact', kind: 'posture',
    // zoom shell (render/closeup/crop.mjs): crop centre on the right pose's low back for both halves; the Wrong is the
    // arch still dashed over the end pose, as `stills.arch`.
    crop: { center: { at: 'lumbar', pose: 'right', off: [0, -10] }, sizePx: 170 },
    right: 'end',
    wrong: { base: 'end', pose: ARCH },
    callout: {
      right: { text: 'Back on pad', anchor: 'lumbar' },
      wrong: { text: 'Low back arched', anchor: { at: 'lumbar', pose: 'mistake' } },
    },
    caption: {
      right: 'Head, shoulders and buttocks on the pad.',   // c1
      wrong: 'Low back arched off the pad.',              // c4
    },
    alt: {
      right: 'Side view, top of the press. Head, shoulders and buttocks rest on the upright pad, arms straight overhead.',   // c1, c4
      wrong: 'Side view, top of the press. The low back arches away from the pad between the hips and the shoulders.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [
    { muscleId: 'front_delts', plain: 'The front of the shoulders work.' },
    { muscleId: 'side_delts', plain: 'The side of the shoulders work too.' },
  ],
  secondary: [
    { muscleId: 'triceps', plain: 'The back of the upper arm helps press.' },
  ],
  watch: [],
  feelLine: 'You should feel this in the tops and fronts of your shoulders.',
  rows: [
    // The card's first row (tops and fronts of the shoulders) has no fix, so it is left out: the feel line says it (D-SHIP-Q16).
    { key: 'front-shoulder', where: 'Pain deep in the front shoulder', at: { muscles: ['front_delts'] },
      means: 'You are lowering the dumbbells behind your head.',
      fix: "Stop the set. Don't train through the pain.",
      redFlag: 'shoulder', claim: CL.c10 },
  ],
  claim: CL.feel,
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'behind', title: 'Lowering behind the head', claim: CL.c10,
    fix: 'Keep the dumbbells in front of the head.' },
  { key: 'arch', title: 'Arching the back', zoom: 'seat-back-contact', claim: CL.c4,
    fix: 'Press without arching your low back.' },
  { key: 'drop', title: 'Dumbbells dropping fast going down', claim: CL.c6,
    fix: 'Lower slowly, pulling them down.' },
];
const RISKS = [
  { key: 'behind-neck', text: 'Pressing behind the neck is linked to shoulder instability.', claim: CL.c10 },
  { key: 'shoulder', text: 'Shoulder injuries are common in lifting and linked to poor technique.', claim: CL.c13 },
  { key: 'dropped', text: 'Weights dropping on the lifter is the most common weight-room injury mechanism.', claim: CL.c14 },
];

export default {
  schema: 1,
  id: 'lib_dumbbell_shoulder_press',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'push',
    why: 'D-SHIP-C3 no-zoom list, D-SHIP-HANDW2: the push heel-of-palm pair cannot be drawn by golden B\'s engine (D-LIB7-19); the grip copy carries c2.',
    orientation: 'pronated',   // c2: closed pronated grip
    handle: 'dumbbell',        // the spec's engine dumbbell primitive
    overBody: true,            // c4: the dumbbells are pressed overhead
    width: { text: 'Dumbbells shoulder-width or slightly wider at the start.', claim: CL.c2 },
    thumb: { mode: 'wrapped', claim: CL.c2 },
    // c2: "Handle held firmly in the palm". The card gives no palm zone; heel-of-palm is the push archetype default
    // (tools/plates/library/hands/pairs.mjs CONVENTIONS 'ga:push-heel'). Not shown.
    contact: 'heel',
    // c2 gives no degrees ("wrists neutral"). The range is the push hand key's recorded convention (pairs.mjs
    // CONVENTIONS 'ga:push-heel': extension 0 to 15), not a card number.
    wrist: { ext: [0, 15], limitText: 'Keep your wrists neutral throughout.',
      claim: C(['CONSENSUS'], [ACE], 'c2. The ext range is pairs.mjs CONVENTIONS ga:push-heel, a convention, not a card number.') },
    faults: [
      // card zoom wrong (c2). Not drawn (no hand zoom), so no pose or marker is set.
      { key: 'bent-back', label: 'Wrist bent back', pose: {}, markers: [], alt: 'Wrist bent back under the dumbbell.' },
    ],
    // c2. The wrists are the grey line under it (wrist.limitText), so the lead does not repeat them (W2 panel).
    gripLine: 'Closed grip, palms forward, thumbs wrapped. Handle firm in your palm.',
    cue: 'Handle firm in palm, wrist neutral.',   // the W2 hint text (c2)
  },
  contacts: ['seat-back'],
  setup: [
    { kind: 'position', text: 'Head, shoulders and buttocks on the backrest. Feet flat. Trunk braced.', zoom: 'seat-back-contact', claim: CL.c1 },
    { kind: 'grip', text: 'Bring the dumbbells to shoulder level, thumbs wrapped, wrists straight.', claim: CL.c2 },
    { kind: 'brace', text: 'Shoulder blades down and back.', claim: CL.c3 },
    { kind: 'safety', text: 'If using a spotter, they stand behind you, hands near your wrists.', claim: CL.c7 },
    { kind: 'load', text: 'Beat target by one or two reps? Add 2 to 10 percent.', claim: CL.c11 },
  ],
  posture: [
    // The seat-back-contact zoom it opens: Right "Head, shoulders and buttocks on the pad" is c1, Wrong (the arch) c4.
    { key: 'back', label: 'Back on pad', detail: 'Back on the pad, no low-back arch.',
      anchor: { landmark: 'lumbar', pose: 'end' }, zoom: 'seat-back-contact', claim: C(['CONSENSUS'], [ACE], 'c1, c4') },
    { key: 'elbows', label: 'Elbows forward', detail: 'Elbows pointed in front of you.',
      anchor: { landmark: 'elbow.r', pose: 'start' }, claim: CL.c5 },
    { key: 'front', label: 'Dumbbells in front', detail: 'Dumbbells in front of the head, never behind the neck.',
      anchor: { landmark: 'grip.r', pose: 'start' }, claim: CL.c10 },
    { key: 'wrists', label: 'Wrists neutral', detail: 'Wrists neutral.', anchor: { landmark: 'wrist.r', pose: 'start' }, claim: CL.c2 },
    { key: 'lockout', label: 'Full lockout', detail: 'Press until the elbows are fully straight.',
      anchor: { landmark: 'elbow.r', pose: 'end' }, claim: CL.c4 },
  ],
  feel,
  zooms,
  chips: ['seat-back-contact', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'Back on the pad, feet flat, trunk braced. Dumbbells at shoulder level, thumbs wrapped.',
    mistakeLine: 'Keep the dumbbells in front of your head. Never lower them behind the neck.',
    cueLine: 'Elbows pointed in front.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['shoulder'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/dumbbell_shoulder_press.json', rev: 1 },
};
