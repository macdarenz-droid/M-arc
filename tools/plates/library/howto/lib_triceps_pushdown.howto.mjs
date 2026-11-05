// LIB-SHIP W2: the How-to content of lib_triceps_pushdown (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/triceps_pushdown.json (cited in its field's claim, cN = card claim id).
// No hand zoom (D-SHIP-HANDW2, gap-ruled on tools/plates/library/hands/no-zoom.json): the card's hand zoom
// `pushdown-wrist` (c9) is a push heel-of-palm pair that golden B's engine cannot draw (D-LIB7-19). Its hand claims
// (overhand full grip, thumbs wrapped, wrists neutral; c2, c9) live in handling and setup step 2.
// GRIP (c) (D-SHIP-GRIP): the card leaves grip.handContact empty. The contact and the wrist range are read at import from
// the push key's convention, tools/plates/library/hands/pairs.mjs CONVENTIONS['ga:push-heel'], cited as CONVENTION
// (source ga-push-heel), never DATA.
// Red flags: the card's redFlags (elbow, back). The elbow box is golden B's shared block; the back box is LIB-5's
// (tools/plates/library/shared/back-box.mjs), linked by the lower-back row's redFlag: 'back'.
import plateSpec from '../specs/triceps_pushdown.mjs';
import { RED_FLAG, RED_FLAG_ELBOW } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_ELBOW };

/* ---------------------------------------------------------------- sources (the card's sources) ------------------- */
export const SOURCES = {
  'ace-pushdown': { cite: 'Triceps Pushdowns (ACE Exercise Library)', url: 'https://www.acefitness.org/resources/everyone/exercise-library/185/triceps-pushdowns/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'ace-pressdown': { cite: 'How To Do a Tricep Pressdown (ACE Exercise Library)', url: 'https://www.acefitness.org/resources/everyone/exercise-library/333/tricep-pressdown/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'sl-pushdown': { cite: 'How to Do Tricep Pushdown With Bar: Muscles Worked & Proper Form (StrengthLog, 2023)', url: 'https://www.strengthlog.com/tricep-pushdown/',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'hussain-2020': { cite: 'Muscle Fatigue in the Three Heads of Triceps Brachii During Intensity and Speed Variations of Triceps Push-Down Exercise', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7047337/',
    kind: 'peer-reviewed', access: 'full', checked: '2026-09-30', use: 'DATA' },
  'acsm-2009': { cite: 'American College of Sports Medicine position stand. Progression models in resistance training for healthy adults', url: 'https://pubmed.ncbi.nlm.nih.gov/19204579/',
    kind: 'guideline', access: 'abstract', checked: '2026-09-30', use: 'CONSENSUS' },
  // The push key's own source for the hand contact (the card has no grip.handContact): a drawing convention.
  'ga-push-heel': { cite: 'LIB-7 push hand convention, pairs.mjs CONVENTIONS ga:push-heel: heel of the palm, extension 0 to 15', url: 'tools/plates/library/hands/pairs.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-04', use: 'CONVENTION' },
  // RED_FLAG_ELBOW's own source (layers/howto/shared.mjs), as golden B's machine_chest_press lists it: the card's redFlags 'elbow'.
  'nhs-elbow-pain': { cite: 'NHS, Elbow and arm pain', url: 'https://www.nhs.uk/symptoms/elbow-and-arm-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When elbow pain needs a check.' },
  // The back box's own source (shared/back-box.mjs, docs/research/howto/shared/back-pain-box.json sources): the card's redFlags 'back'.
  'nhs-back': { cite: 'NHS, Back pain', url: 'https://www.nhs.uk/conditions/back-pain/',
    kind: 'guideline', access: 'full', checked: '2026-10-02', use: 'CONSENSUS', note: 'When back pain needs a check.' },
};
// Not cited: c12 (tempo, a plate drawing convention), c13 (breathing), c18 (load progression).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const ACE = 'ace-pushdown', SL = 'sl-pushdown';
const CL = {
  c1: C(['CONSENSUS'], [ACE, 'ace-pressdown'], 'card c1'),
  c3: C(['CONSENSUS'], [ACE], 'card c3'),
  c4: C(['CONSENSUS'], [ACE, 'hussain-2020', SL], 'card c4'),
  c5: C(['CONSENSUS'], [ACE, SL], 'card c5'),
  c7: C(['CONSENSUS'], [ACE, SL], 'card c7'),
  c8: C(['CONSENSUS'], [ACE, 'ace-pressdown'], 'card c8'),
  c9: C(['CONSENSUS'], [ACE], 'card c9'),
  c10: C(['CONSENSUS'], [ACE], 'card c10'),
  c11: C(['CONSENSUS'], [SL], 'card c11'),
  c15: C(['DATA'], ['hussain-2020'], 'card c15'),
  c16: C(['CONSENSUS'], [SL], 'card c16'),
  c17: C(['CONSENSUS'], [SL], 'card c17'),
  c6: C(['CONSENSUS'], [ACE], 'card c6'),
  lean: C(['CONSENSUS'], [SL, ACE, 'hussain-2020'], 'card c11, c4'),
  elbows: C(['CONSENSUS'], [ACE, SL], 'card c6, c7'),
  brace: C(['CONSENSUS'], [ACE, 'hussain-2020', SL], 'card c4, c10, c7'),
};

/* ------------------------------------------------------------------------------------------------ hand ---------- */
// GRIP (c): the contact and wrist range DERIVED at import from the push key's convention text, so they cannot drift from
// it. pairs.mjs CONVENTIONS['ga:push-heel'] reads 'GA 3.1 push: heel of the palm, low, over the forearm; extension 0 to
// 15'. HandContact names the palm zone 'heel of the palm' as 'heel' (src/howto/content-types.ts HandContact), so the map
// below turns the convention's zone words into the enum value; a convention that names no mapped zone throws.
// pairs.mjs is not imported (its closure pulls howto-layers.mjs, which the MANIFEST closure cannot follow); the text is
// copied here, and tests/howto/lib-ship.test.ts (Q-W2-2) turns red when the live convention no longer matches the sheet.
const PUSH_HEEL = 'GA 3.1 push: heel of the palm, low, over the forearm; extension 0 to 15';   // CONVENTIONS['ga:push-heel']
const CONTACT_OF_ZONE = { 'heel of the palm': 'heel' };   // convention zone words -> HandContact
const CONTACT = Object.entries(CONTACT_OF_ZONE).find(([zone]) => PUSH_HEEL.includes(zone))?.[1];
const EXT = PUSH_HEEL.match(/extension (\d+) to (\d+)/)?.slice(1).map(Number);
if (!CONTACT || !EXT) throw new Error(`lib_triceps_pushdown: pairs.mjs CONVENTIONS ga:push-heel has no mapped contact or range: ${PUSH_HEEL}`);
const CONV = C(['CONVENTION'], ['ga-push-heel'], 'pairs.mjs CONVENTIONS ga:push-heel (the card has no grip.handContact)');

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses. 'elbows-forward' (card zoom pushdown-elbow Wrong, c6: "Elbows drifted forward, upper
// arms swung up"): the start pose with the upper arm swung forward of the thorax and the elbow bent, the trunk left as
// at the start, so only the arms move.
// DRAWING VALUES (D-SHIP-DRAWVAL, #376 6614695581; precedent D-LIB7-2, golden B's machine_chest_press seatDrop and
// lib_rope_triceps_pushdown's elbows-forward): EF_FLEX 50 and EF_ELBOW 95 size the elbows-forward Wrong; no card gives
// them, no number appears in user copy; the layers panel judges them. LIB-PLATEFIX-1 (W2 panel L1, #379 6633524031:
// "the elbow Wrong barely drifts"): they replace the spec's Mistake arm (shoulder 25, elbow 75), which belongs to the
// leaning fault (c11) and left the elbow about 5 cm ahead of the right one; now it sits clearly ahead of the torso (c6).
const { start: START, end: END } = plateSpec.poses;
const EF_FLEX = 50, EF_ELBOW = 95;   // drawing values (above): upper arm forward of the thorax, elbow bend
const ELBOWS_FORWARD = { reach: null, shoulder: { flex: EF_FLEX }, elbow: EF_ELBOW, wrist: 0 };
export const stills = {
  start: { pose: START },
  end: { pose: END },
  'elbows-forward': { pose: { ...START, ...ELBOWS_FORWARD } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom except the hand zoom `pushdown-wrist` (D-SHIP-HANDW2, above). The posture zoom is in the zoom
// shell's shape (callout with an anchor at the landmark it names, no guide mark; pilot-a.closeups.mjs).
const zooms = [
  {
    key: 'pushdown-elbow', chip: 'Elbows', heading: 'Elbow position', kind: 'posture',
    // zoom shell (render/closeup/crop.mjs): the Wrong is the elbows-forward still dashed over the start pose, as
    // `stills['elbows-forward']`; crop centre on the right pose's elbow for both halves.
    crop: { center: { at: 'elbow.r', pose: 'right', off: [10, 0] }, sizePx: 140 },
    right: 'start',
    wrong: { base: 'start', pose: ELBOWS_FORWARD, solid: true },
    callout: {
      right: { text: 'Elbows at sides', anchor: 'elbow.r' },
      wrong: { text: 'Drifted forward', anchor: { at: 'elbow.r', pose: 'mistake' } },
    },
    caption: {
      right: 'Elbows against the sides at the top of the return.',
      wrong: 'Elbows drifted forward, upper arms swung up.',
    },
    alt: {
      right: 'Side view, top of the pushdown. Upper arms hang down against the sides, bar at upper-chest level.',
      wrong: 'Side view, top of the pushdown. The upper arms swing forward and up, so the elbows leave the sides.',
    },
    feelRow: 'lats',
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'triceps', plain: 'All three heads of the triceps work.' }],
  secondary: [],   // the card names none (its libraryDiff: the library's forearms are kept but unsourced, so not shown)
  watch: [],
  feelLine: 'You should feel this in the back of your upper arms.',
  rows: [
    // The card's first row (back of the upper arm) has no fix, so it is left out: the feel line says it (D-SHIP-Q16).
    { key: 'lats', where: 'Sides of the back', at: { muscles: ['lats'] },
      means: 'Your elbows drift forward, which brings in the lats.',
      fix: 'Pin the elbows to your sides.',
      zoom: 'pushdown-elbow', claim: CL.c6 },
    { key: 'lower-back', where: 'Lower back pain', at: { muscles: ['lower_back'] },
      means: 'You lean too far forward or arch your back.',
      fix: "Stop and don't train through the pain. Stand taller, tilt only from the hips.",
      redFlag: 'back', claim: CL.lean },
    { key: 'elbows', where: 'Elbow discomfort or pain', at: { parts: ['elbow-left', 'elbow-right'] },
      means: 'Heavy, low-rep sets feel uncomfortable in the elbows for many.',
      fix: "Stop and don't train through the pain. Use lighter weights for more reps.",
      redFlag: 'elbow', claim: CL.c17 },
  ],
  claim: CL.c15,
};

/* ------------------------------------------------------------------------------------------------ mistakes, risks */
const MISTAKES = [
  { key: 'lean', title: 'Leaning over or arching back', claim: CL.lean,
    fix: 'Stand taller. Tilt only from the hips.' },
  { key: 'elbows-forward', title: 'Elbows drifting forward', zoom: 'pushdown-elbow', claim: CL.elbows,
    fix: 'Keep the elbows at your sides. Stop the return at upper-chest level.' },
  { key: 'heavy', title: 'Too heavy, moved with momentum', claim: CL.c16,
    fix: 'Go lighter and move with control.' },
];
const RISKS = [
  { key: 'lean', text: 'Leaning too far forward or arching the back strains the lower back.', claim: CL.c11 },   // c11's words (W2 panel)
  { key: 'elbows', text: 'Heavy loads feel uncomfortable in the elbows for many people.', claim: CL.c17 },
  { key: 'weight', text: 'Too much weight moved with momentum can lead to injury.', claim: CL.c16 },
];

export default {
  schema: 1,
  id: 'lib_triceps_pushdown',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'push',
    why: 'D-SHIP-C3 no-zoom list, D-SHIP-HANDW2: the push heel-of-palm pair cannot be drawn by golden B\'s engine (D-LIB7-19); the grip copy carries c2 and c9.',
    orientation: 'pronated',   // c2: overhand, palms down
    handle: 'bar-28',          // the spec's straight bar, 28 mm
    overBody: false,
    width: { text: 'Hands about shoulder-width.', claim: C(['CONSENSUS'], [ACE, 'hussain-2020'], 'card c2') },
    thumb: { mode: 'wrapped', claim: C(['CONSENSUS'], [ACE, 'hussain-2020'], 'card c2') },
    contact: CONTACT,          // 'heel', DERIVED from pairs.mjs CONVENTIONS ga:push-heel (CONVENTION, above)
    // c9 gives no degrees ("neutral, in line with the forearm"). EXT is the push key's convention range, read above.
    wrist: { ext: EXT, limitText: 'Keep the wrists in line with the forearms.',
      claim: C(['CONSENSUS', 'CONVENTION'], [ACE, 'ga-push-heel'], 'card c9. The ext range is pairs.mjs CONVENTIONS ga:push-heel, a convention, not a card number.') },
    faults: [
      // card zoom wrong (c9). Not drawn (no hand zoom), so no pose or marker is set.
      { key: 'bent-back', label: 'Wrist bent back', pose: {}, markers: [], alt: 'Wrists bent back over the bar.' },
    ],
    // c2. The wrist (c9) is the limitText line under it, so the gripLine no longer repeats it (W2 panel, #379 6633524031).
    gripLine: 'Overhand full grip, hands about shoulder-width, thumbs wrapped.',
    cue: 'Wrist in line with the forearm.',   // the W2 hint text (c9)
  },
  contacts: ['standing-feet'],
  setup: [
    // The card's steps 1 and 2 share one step (c1, c2), so posture 'Straighten the arms fully at the bottom without a hard
    // lockout.' (c8) gets a visible slot (D-TEXT-GOLDEN, #385 6637650243). The convention contact (ga:push-heel) is data
    // only, not copy (D-SHIP-CONVCOPY, W2 panel, #379 6633524031), so 'bar on your palm heel' is gone.
    { kind: 'adjust', text: 'Top pulley, straight bar. Grip overhand, hands shoulder-width, thumbs wrapped.',
      claim: C(['CONSENSUS'], [ACE, 'ace-pressdown', 'hussain-2020'], 'card c1, c2') },
    { kind: 'position', text: 'Stand facing the machine, feet hip-width or staggered.', claim: CL.c3 },
    { kind: 'brace', text: 'Brace, shoulders down and back, elbows at sides, bar at upper chest.', zoom: 'pushdown-elbow', claim: CL.brace },
    { kind: 'position', text: 'Straighten the arms fully at the bottom without a hard lockout.', claim: CL.c8 },
    { kind: 'load', text: 'Pick a weight you can move with control.', claim: CL.c16 },
  ],
  posture: [
    { key: 'elbows', label: 'Elbows pinned', detail: 'Elbows stay right next to your sides.',
      anchor: { landmark: 'elbow.r', pose: 'start' }, zoom: 'pushdown-elbow', claim: CL.c5 },
    { key: 'torso', label: 'Tall torso', detail: 'Torso tall. Any lean comes from the hips, not an arched back.',
      anchor: { landmark: 'backUpper', pose: 'start' }, claim: CL.c4 },
    { key: 'wrists', label: 'Neutral wrists', detail: 'Wrists neutral throughout.',
      anchor: { landmark: 'wrist.r', pose: 'end' }, claim: CL.c9 },
    { key: 'shoulders', label: 'Shoulders down', detail: 'Shoulders down and back.',
      anchor: { landmark: 'shoulder.r', pose: 'start' }, claim: CL.c10 },
    { key: 'lockout', label: 'No hard lockout', detail: 'Straighten the arms fully at the bottom without a hard lockout.',
      anchor: { landmark: 'elbow.r', pose: 'end' }, claim: CL.c8 },
    { key: 'return', label: 'Return height', detail: 'Return only until the elbows start to move forward.',
      anchor: { landmark: 'grip.r', pose: 'start' }, zoom: 'pushdown-elbow', claim: CL.c7 },
  ],
  feel,
  zooms,
  chips: ['pushdown-elbow', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'Straight bar on the top pulley, overhand grip. Elbows at your sides, shoulders down and back.',
    mistakeLine: 'Keep your elbows at your sides. Lean only from the hips, never by arching your back.',
    cueLine: 'Elbows pinned to your sides.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['elbow', 'back'],   // the card's redFlags, in its order
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/triceps_pushdown.json', rev: 1 },
};
