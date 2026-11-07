// LIB-SHIP W5: the How-to content of lib_concentration_curl (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/concentration_curl.json (cN = card claim id). The thumb value (data, not shown) cites the
// shared curl card docs/research/howto/shared/curl.json (shared cN), whose appliesTo names concentration_curl.
// No hand zoom (D-SHIP-C3, card-no-zoom on tools/plates/library/hands/no-zoom.json): the card has no hand zoom, and the
// curl key lists the id as a GAP (hands/hand-curl.mjs GAPS: no claim names the grip orientation), so the sheet has no
// handling.pose and no orientation.
// GRIP (c) (D-SHIP-GRIP, Q-W5-7 / D-SHIP-W5-GRIPC): the card leaves grip.thumb and grip.handContact empty.
//   - contact: DERIVED at import from the curl convention, pairs.mjs CONVENTIONS['ga:curl-mid'], cited as CONVENTION;
//     data only (D-SHIP-CONVCOPY: never printed in any copy).
//   - thumb: shared/curl.json thumbRule "Closed grip, thumbs wrapped round the handle" (shared c1, c2), cited to that
//     claim; data only since fix round 1 (w5-content K1: the card's own claims name no thumb, so nothing prints it).
//   - wrist: the card's own grip.wrist "Neutral through the lift" (c11) is the printed line; it gives no degrees, so the
//     ext range is the same convention's (as lib_triceps_pushdown takes ga:push-heel's), data only.
// Red flags: the card has none (redFlags [], risks []), so riskFlags is empty.
// No variant line (equipment 'Dumbbell').
import plateSpec from '../specs/concentration_curl.mjs';
import { landmarksOf } from '../engine.mjs';
import { RED_FLAG } from '../../layers/howto/shared.mjs';
export { RED_FLAG };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'bb-concentration': { cite: 'How to Do the Concentration Curl for Bigger Biceps (BarBend)', url: 'https://barbend.com/concentration-curl/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'sl-concentration': { cite: 'How to Do Concentration Curl: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/concentration-curl/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'ace-bicepsstudy': { cite: 'ACE Research: Best Biceps Exercises for Strength (ACE ProSource)', url: 'https://www.acefitness.org/continuing-education/prosource/august-2014/4933/ace-study-reveals-best-biceps-exercises/',
    kind: 'secondary', access: 'full', checked: '2026-10-22', use: 'DATA' },
  // The shared curl card's sources for its thumbRule (shared/curl.json c1, c2), as that card has them.
  'ace-seatedcurl': { cite: 'Seated Biceps Curl (ACE Exercise Library)', url: 'https://www.acefitness.org/resources/everyone/exercise-library/44/seated-biceps-curl/',
    kind: 'coach', access: 'full', checked: '2026-10-02', use: 'CONSENSUS' },
  'ace-hammer': { cite: 'Hammer Curl (ACE Exercise Library)', url: 'https://www.acefitness.org/resources/everyone/exercise-library/10/hammer-curl/',
    kind: 'coach', access: 'full', checked: '2026-10-02', use: 'CONSENSUS' },
  // The curl convention's own source for the hand contact (the card has no grip.handContact): a drawing convention.
  'ga-curl-mid': { cite: 'LIB-7 curl hand convention, pairs.mjs CONVENTIONS ga:curl-mid: across the middle of the palm, extension -10 to +10', url: 'tools/plates/library/hands/pairs.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-05', use: 'CONVENTION' },
};
// Not cited: acsm-2009 (c12, c13: tempo and progression; no field here restates them).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const BB = 'bb-concentration', SL = 'sl-concentration';
const CL = {
  c1: C(['CONSENSUS'], [BB, SL], 'c1'),
  c2: C(['CONSENSUS'], [BB], 'c2'),
  c3: C(['CONSENSUS'], [BB], 'c3'),
  c5: C(['CONSENSUS'], [BB], 'c5'),
  c6: C(['CONSENSUS'], [BB, SL], 'c6'),
  c7: C(['CONSENSUS'], [BB], 'c7'),
  c8: C(['CONSENSUS'], [BB], 'c8'),
  c9: C(['CONSENSUS'], [BB], 'c9'),
  c11: C(['CONSENSUS'], [BB, SL], 'c11'),
  // shared/curl.json thumbRule (shared c1, c2; appliesTo names concentration_curl)
  thumb: C(['CONSENSUS'], ['ace-seatedcurl', 'ace-hammer'], 'shared/curl.json thumbRule, shared c1, c2'),
};

/* ------------------------------------------------------------------------------------------------ hand ---------- */
// GRIP (c): the contact and wrist range DERIVED at import from the curl convention text, so they cannot drift from it.
// pairs.mjs CONVENTIONS['ga:curl-mid'] reads 'GA 3.1 curl: across the middle of the palm; extension -10 to +10
// (shared/curl.json gap 1)'. HandContact names the zone 'middle of the palm' as 'mid-palm' (src/howto/content-types.ts),
// so the map below turns the convention's zone words into the enum value; a convention that names no mapped zone throws.
// pairs.mjs is not imported (its closure pulls howto-layers.mjs, which the MANIFEST closure cannot follow), as
// lib_triceps_pushdown; the text is copied here.
const CURL_MID = 'GA 3.1 curl: across the middle of the palm; extension -10 to +10 (shared/curl.json gap 1)';   // CONVENTIONS['ga:curl-mid']
const CONTACT_OF_ZONE = { 'middle of the palm': 'mid-palm' };   // convention zone words -> HandContact
const CONTACT = Object.entries(CONTACT_OF_ZONE).find(([zone]) => CURL_MID.includes(zone))?.[1];
const EXT = CURL_MID.match(/extension (-?\d+) to \+?(-?\d+)/)?.slice(1).map(Number);
if (!CONTACT || !EXT) throw new Error(`lib_concentration_curl: pairs.mjs CONVENTIONS ga:curl-mid has no mapped contact or range: ${CURL_MID}`);

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses (start, end) and Mistake:
//   'elbow-knee' (card zoom conc-brace Wrong, c3: "Elbow jammed into the knee crease"): the spec's own Mistake (the elbow
//         wedged into the knee crease, c4/c3), a whole pose.
//   'arm-lifted' (card zoom conc-top Wrong, c7: "Upper arm lifted off the thigh to reach the shoulder"): the end pose with
//         the working hand moved up and forward to shoulder height (LIFT_UP m above the shoulder joint, LIFT_FWD m in
//         front of it, at the end elbow's side offset, so it stays over the inner thigh in depth); the IK pole forward
//         and in, so the elbow rises off the thigh and the upper arm tips forward off vertical. Body and free hand
//         unchanged.
// DRAWING VALUES (D-SHIP-DRAWVAL, #376 6614695581; precedent D-LIB7-2 and lib_reverse_lunge's SHORT 0.15 m): LIFT_UP
// 0.06 m, LIFT_FWD 0.22 m and the IK pole [0.3, -0.3, 1] are Wrong-pose values no card gives (the elbow lifts about
// 4 cm and moves about 16 cm forward);
// no number from them appears in user copy; the layers panel judges them.
const LIFT_UP = 0.06, LIFT_FWD = 0.22;
const END = plateSpec.poses.end, LE = landmarksOf(END, 1.75), SH = LE['shoulder.r'];
const LIFT = { reach: { ...END.reach, r: { at: [LE['elbow.r'][0], SH[1] + LIFT_UP, SH[2] + LIFT_FWD], pole: [0.3, -0.3, 1] } } };
const MIS = plateSpec.mistake.pose;
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  'elbow-knee': { pose: MIS },
  'arm-lifted': { pose: { ...END, ...LIFT } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom, same keys and kinds (both posture; the card has no hand zoom). Zoom shell shape (callout with an
// anchor at the landmark it names, no guide mark; pilot-a.closeups.mjs); each Wrong is its still drawn alone (solid).
const zooms = [
  {
    key: 'conc-brace', chip: 'Arm brace', heading: 'Arm on thigh', kind: 'posture',
    crop: { center: { at: 'elbow.r', pose: 'right', off: [10, 0] }, sizePx: 170 },
    right: 'end',
    wrong: { base: 'end', pose: MIS, solid: true },
    callout: {
      right: { text: 'Arm on thigh', anchor: 'elbow.r' },
      wrong: { text: 'Elbow in knee', anchor: 'elbow.r' },
    },
    caption: {
      right: 'Upper arm flat on the inner thigh and vertical.',   // card zoom right (c3, c2)
      wrong: 'Elbow jammed into the knee crease.',               // card zoom wrong (c3)
    },
    alt: {
      right: 'Side view, seated and hinged forward. The back of the upper arm rests on the inner thigh, upper arm vertical.',
      wrong: 'Side view. The elbow is jammed into the knee crease. The leg can lever the weight up.',
    },
    feelRow: 'leg',
  },
  {
    key: 'conc-top', chip: 'Top', heading: 'Top position', kind: 'posture',
    crop: { center: { at: 'shoulder.r', pose: 'right', off: [10, 30] }, sizePx: 190 },
    right: 'end',
    wrong: { base: 'end', pose: LIFT, solid: true },
    callout: {
      right: { text: 'Triceps on thigh', anchor: 'elbow.r' },
      wrong: { text: 'Arm lifted', anchor: 'elbow.r' },
    },
    caption: {
      // D-TEXT-GOLDEN (copy lines are not printed): posture steady (c6) moved here from the cue line
      right: 'Upper arm steady. Stop while the triceps touches the thigh.',   // card zoom right reworded (c7) + c6
      wrong: 'Upper arm lifted off the thigh to reach the shoulder.',  // card zoom wrong (c7)
    },
    alt: {
      right: 'Side view, top of the curl. The elbow is bent and the upper arm still rests on the thigh.',
      wrong: 'Side view. The upper arm has lifted off the thigh and tipped forward. The dumbbell reaches the shoulder.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'biceps', plain: 'The biceps, both heads, is the target.' }],
  secondary: [{ muscleId: 'forearms', plain: 'The forearms help by holding the grip and a neutral wrist.' }],
  watch: [],
  // The card's first two rows (front of the upper arm, c10; forearm, c11) have no fix, so they are left off the rows
  // (D-SHIP-Q16); the feel line says them.
  feelLine: 'You should feel this in the front of your upper arm and your forearm.',
  rows: [
    { key: 'leg', where: 'Leg doing the lifting', at: {},   // c3 names the leg, not a map region
      means: 'The elbow is wedged into the knee.',
      fix: 'Move the upper arm onto the inner thigh.',
      zoom: 'conc-brace', claim: CL.c3 },
  ],
  claim: C(['CONSENSUS', 'DATA', 'WEAK'], [BB, SL, 'ace-bicepsstudy'], 'c11, c10'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'knee', title: 'Elbow wedged into the knee', zoom: 'conc-brace', claim: CL.c3,
    fix: 'Press the triceps into your inner thigh instead.' },
  { key: 'top', title: 'Curling up to the shoulder', zoom: 'conc-top', claim: C(['CONSENSUS'], [BB], 'c7, c2 (vertical)'),
    fix: 'Stop when the upper arm starts to leave vertical.' },
  { key: 'drop', title: 'Letting the weight drop', claim: CL.c8,
    fix: 'Lower slowly. Resist the weight.' },
];

export default {
  schema: 1,
  id: 'lib_concentration_curl',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'curl',
    why: 'D-SHIP-C3 no-zoom list, card-no-zoom: the card has no hand zoom; the grip copy carries c1 and c11.',
    handle: 'dumbbell',          // c1: one dumbbell in the working hand
    thumb: { mode: 'wrapped', claim: CL.thumb },   // shared/curl.json thumbRule (shared c1, c2)
    contact: CONTACT,            // 'mid-palm', DERIVED from pairs.mjs CONVENTIONS ga:curl-mid (CONVENTION, data only)
    // c11 gives no degrees ("a neutral wrist"; card grip.wrist "Neutral through the lift"). EXT is the curl convention's
    // range, read above; data only.
    wrist: { ext: EXT, limitText: 'Keep the wrist neutral through the lift.',
      claim: C(['CONSENSUS', 'CONVENTION'], [BB, SL, 'ga-curl-mid'], 'c11 (card grip.wrist). The ext range is pairs.mjs CONVENTIONS ga:curl-mid, a convention, not a card number.') },
    faults: [],                  // no hand zoom and no hand fault on the card
    // Fix round 1 (w5-content K1): the card itself has no thumb claim, so the grip line says only c1; the thumb stays
    // data (shared/curl.json thumbRule, cited on thumb.claim), never printed.
    gripLine: 'One dumbbell in the working hand.',   // c1 (card grip.type)
    cue: 'Triceps on thigh, wrist neutral.',   // c3, c11
  },
  contacts: ['brace-pad'],
  setup: [
    { kind: 'load', text: 'Pick a dumbbell several pounds lighter than for your usual curls.', claim: CL.c9 },
    { kind: 'position', text: 'Sit on the bench edge, knees wide.', claim: CL.c1 },
    { kind: 'position', text: 'Hinge forward with a neutral spine.', claim: CL.c1 },
    { kind: 'position', text: 'Rest the back of your upper arm on your inner thigh.', zoom: 'conc-brace', claim: CL.c3 },
    { kind: 'brace', text: 'Feet pressed down. Free hand on your other knee or the bench.', claim: CL.c5 },
  ],
  posture: [
    { key: 'vertical', label: 'Upper arm vertical', detail: 'Upper arm stays as vertical as possible.',
      anchor: { landmark: 'shoulder.r', pose: 'end' }, zoom: 'conc-brace', claim: CL.c2 },
    { key: 'thigh', label: 'Arm on thigh', detail: 'Triceps on the thigh, never the elbow in the knee.',
      anchor: { landmark: 'elbow.r', pose: 'start' }, zoom: 'conc-brace', claim: CL.c3 },
    { key: 'steady', label: 'Upper arm steady', detail: 'Upper arm stays steady. Only the elbow bends.', anchor: { landmark: 'elbow.r', pose: 'end' }, claim: CL.c6 },
    { key: 'stop', label: 'Stop point', detail: 'Stop the curl before the arm leaves the thigh.',
      anchor: { landmark: 'grip.r', pose: 'end' }, zoom: 'conc-top', claim: CL.c7 },
    { key: 'lower', label: 'Slow lowering', detail: 'Lower slowly to a straight arm.', anchor: { landmark: 'grip.r', pose: 'start' }, claim: CL.c8 },
  ],
  feel,
  zooms,
  chips: ['conc-brace', 'conc-top', 'feel'],   // the zoom shell's chip row: the zoom keys, then feel
  copy: {
    setupLine: 'Sit on the bench edge, knees wide, and hinge forward. Back of the upper arm on the inner thigh.',   // c1, c3
    mistakeLine: 'Never wedge your elbow into your knee. Press the triceps into your inner thigh.',   // c3
    // D-TEXT-GOLDEN: posture steady (c6)
    cueLine: 'Only the elbow bends.',   // c6
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: [],          // the card's risks (none)
  riskFlags: [],      // the card's redFlags (none)
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/concentration_curl.json', rev: 1 },
};
