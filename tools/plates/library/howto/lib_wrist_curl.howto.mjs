// LIB-SHIP W5: the How-to content of lib_wrist_curl (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/wrist_curl.json; its claim ids are named on each field's claim.
// No hand zoom (D-SHIP-C3, gap-key): the card's hand zoom `wrist-curl-grip` (c5) belongs to the `curl` key, which lists
// wrist_curl in GAPS (tools/plates/library/hands/hand-curl.mjs:27: exempt, the wrist is the moving joint,
// docs/research/howto/shared/wrist-curl-exemption.json); the id is on tools/plates/library/hands/no-zoom.json. Its hand
// claim (a closed fist round the handle, the weight never rolling to the fingertips; c5) lives in the Grip line, the
// first mistake and the first risk. No handling.pose (no hand zoom draws one).
// GRIP (c) (D-SHIP-GRIP, SHIP W5 PLAN RULED Q-W5-7): the card leaves grip.thumb and grip.handContact empty.
//  - Contact: read at import from the curl convention, tools/plates/library/hands/pairs.mjs CONVENTIONS['ga:curl-mid'],
//    cited as CONVENTION (source hand-key-curl); data only, never printed (D-SHIP-CONVCOPY). Only the contact: the
//    convention's -10..+10 wrist range is NOT taken (Q-W5-7); the wrist is exempt (card grip.wrist, c2-c4; the shared
//    exemption).
//  - Thumb: 'wrapped', data only, CONVENTION (the closed grip, grip.type c1, c5, as the curl key draws it); no printed
//    string states a thumb position. The printed grip copy uses only c5's words (closed grip, squeeze, never rolling).
// Variant line (D-LIB5-VARIANT): exercises.json lists 'Dumbbell / Barbell'; the card's plate.variantLine: the barbell
// version shares the grip, lowering and grip-closed lines (c1, c3, c4, c5).
// No parent.
import plateSpec from '../specs/wrist_curl.mjs';
import { RED_FLAG } from '../../layers/howto/shared.mjs';
export { RED_FLAG };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'ace-wristcurl': { cite: 'Wrist Curl - Flexion (ACE Exercise Library)', url: 'https://www.acefitness.org/resources/everyone/exercise-library/30/wrist-curl-flexion/',
    kind: 'guideline', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'sl-dbwristcurl': { cite: 'How to Do Dumbbell Wrist Curl: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/dumbbell-wrist-curl/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'sl-bbwristcurl': { cite: 'How to Do Barbell Wrist Curl: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/barbell-wrist-curl/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'bb-wristcurl': { cite: 'The Nine Best Wrist Curl Variations to Supercharge Your Grip (BarBend)', url: 'https://barbend.com/barbell-wrist-curl/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'acsm-2009': { cite: 'American College of Sports Medicine position stand. Progression models in resistance training for healthy adults', url: 'https://pubmed.ncbi.nlm.nih.gov/19204579/',
    kind: 'guideline', access: 'abstract', checked: '2026-10-22', use: 'CONSENSUS' },
  // The curl convention's own source for the hand contact and the closed-grip thumb (the card has neither): conventions.
  'hand-key-curl': { cite: 'LIB-7 curl hand convention, pairs.mjs CONVENTIONS ga:curl-mid (across the middle of the palm); curl key right-pose thumb wrapped', url: 'tools/plates/library/hands/pairs.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-05', use: 'CONVENTION' },
  // RED_FLAG's own source (layers/howto/shared.mjs), as golden B's machine_chest_press lists it: the card's redFlags 'wrist'.
  'nhs-wrist-pain': { cite: 'NHS, Wrist pain', url: 'https://www.nhs.uk/conditions/hand-pain/wrist-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When wrist pain needs a check.' },
};
// Not cited: c9 (why the forearm is supported), c10 (tempo, a plate drawing convention).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const ACE = 'ace-wristcurl', BB = 'bb-wristcurl', SLD = 'sl-dbwristcurl';
const CL = {
  c3: C(['CONSENSUS'], [ACE], 'c3'),
  c5: C(['CONSENSUS'], [ACE], 'c5 (ACE\'s closed grip, LR-18, R-LB5-3)'),
  c6: C(['CONSENSUS'], [BB], 'c6'),
  c8: C(['CONSENSUS'], [SLD], 'c8'),
  forearm: C(['CONSENSUS'], [SLD, 'sl-bbwristcurl', BB], 'c1'),
  sit: C(['CONSENSUS'], [SLD, BB, ACE], 'c1, c2'),
  hold: C(['CONSENSUS'], [SLD, ACE], 'c1, c5'),
  lean: C(['CONSENSUS'], [ACE, SLD], 'c3, c1'),
  heavy: C(['CONSENSUS'], [BB], 'c6, c7'),
  move: C(['CONSENSUS'], [ACE], 'c3, c4'),
  wrist: C(['CONSENSUS'], [ACE, BB], 'c5, c6'),
  feel: C(['CONSENSUS'], [SLD, ACE], 'c8, c4, c1'),
  variant: C(['CONSENSUS'], [SLD, 'sl-bbwristcurl', ACE], 'card plate.variantLine: c1, c3, c4, c5 hold for the barbell'),
  // card grip.thumb is empty: the closed grip (grip.type, c1, c5) as the curl convention draws it. Data only, never shown.
  thumb: C(['CONVENTION'], ['hand-key-curl'], 'card grip.thumb is empty: the closed grip (grip.type, c1, c5) as the curl key\'s wrapped thumb, a convention, never shown.'),
};

/* ------------------------------------------------------------------------------------------------ hand ---------- */
// GRIP (c): the contact DERIVED at import from the curl convention text, so it cannot drift from it. pairs.mjs
// CONVENTIONS['ga:curl-mid'] reads 'GA 3.1 curl: across the middle of the palm; extension -10 to +10 (shared/curl.json
// gap 1)'. HandContact names the palm zone 'middle of the palm' as 'mid-palm' (src/howto/content-types.ts HandContact);
// a convention that names no mapped zone throws. pairs.mjs is not imported (its closure pulls howto-layers.mjs, which the
// MANIFEST closure cannot follow; lib_triceps_pushdown's form); the text is copied here. The convention's extension range
// is deliberately not read (Q-W5-7: the wrist is exempt).
const CURL_MID = 'GA 3.1 curl: across the middle of the palm; extension -10 to +10 (shared/curl.json gap 1)';   // CONVENTIONS['ga:curl-mid']
const CONTACT_OF_ZONE = { 'middle of the palm': 'mid-palm' };   // convention zone words -> HandContact
const CONTACT = Object.entries(CONTACT_OF_ZONE).find(([zone]) => CURL_MID.includes(zone))?.[1];
if (!CONTACT) throw new Error(`lib_wrist_curl: pairs.mjs CONVENTIONS ga:curl-mid has no mapped contact: ${CURL_MID}`);

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses. 'lean' is the spec's Mistake (card plate.mistake c3 and card zoom wrist-curl-support
// Wrong "Arms extending or body leaning forward to move the weight."), merged over the end pose as the engine draws it.
// No new drawing value: the plate's own Mistake.
const MIS = plateSpec.mistake.pose;
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: plateSpec.poses.end },
  lean: { pose: { ...plateSpec.poses.end, ...MIS } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom except the hand zoom `wrist-curl-grip` (D-SHIP-C3 gap-key, above). The posture zoom is in the zoom
// shell's shape (callout with an anchor at the landmark it names, no guide mark; pilot-a.closeups.mjs).
const zooms = [
  {
    key: 'wrist-curl-support', chip: 'Forearm', heading: 'Forearm support', kind: 'posture',
    // zoom shell (render/closeup/crop.mjs): crop centre on the forearm of the right pose (elbow.r moved along the forearm
    // toward the hand), the same for both halves so the Wrong's lifted arm stays in frame; the Wrong is the spec's
    // Mistake drawn alone (solid), as `stills.lean`.
    crop: { center: { at: 'elbow.r', pose: 'right', off: [34, -4] }, sizePx: 160 },
    right: 'end',
    wrong: { base: 'end', pose: MIS, solid: true },
    callout: {
      right: { text: 'Forearm on thigh', anchor: 'elbow.r' },
      wrong: { text: 'Arm straightens', anchor: 'elbow.r' },
    },
    caption: {
      right: 'Forearm flat on the thigh, only the hand moving.',             // card zoom right (c1, c3)
      wrong: 'Arms extending or body leaning forward to move the weight.',   // card zoom wrong (c3)
    },
    alt: {
      right: 'Side view, seated. The forearm rests on the thigh, the hand past the knee, the wrist curled up.',
      wrong: 'Side view. The body leans forward and the arm straightens, so the forearm lifts off the thigh.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'forearms', plain: 'The forearm flexors, which bend the wrist and close the hand, do the work.' }],
  secondary: [],   // the card names none
  watch: [],
  // The card's first row (top of the forearm, palm-up side) has no fix, so it is left out: the feel line says it
  // (D-SHIP-Q16).
  feelLine: 'You should feel this along the palm-up side of your forearms.',
  rows: [
    { key: 'wrist', where: 'Wrist joint', at: { parts: ['hand-left', 'hand-right', 'hand-back-left', 'hand-back-right'] },
      means: 'The weight is too heavy, or your grip is opening.',
      fix: 'Go lighter and keep the fist closed.',
      redFlag: true, claim: CL.wrist },
  ],
  claim: CL.feel,
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'roll', title: 'Weight rolling to the fingertips', claim: CL.c5,
    fix: 'Squeeze the weight hard both ways.' },
  { key: 'lean', title: 'Leaning or straightening the arms', zoom: 'wrist-curl-support', claim: CL.lean,
    fix: 'Keep the forearm down.' },
  { key: 'heavy', title: 'Going heavy over the edge', claim: CL.heavy,
    fix: 'Stay light. Add reps before weight.' },
];
const RISKS = [
  { key: 'grip', text: 'Loosening the grip raises the risk of wrist injury and a dropped weight.', claim: CL.c5 },
  { key: 'edge', text: 'Hands over an edge leave the wrists vulnerable to heavy weight.', claim: CL.c6 },
];

export default {
  schema: 1,
  id: 'lib_wrist_curl',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'curl',
    why: 'D-SHIP-C3 no-zoom list, gap-key: the curl key lists wrist_curl in GAPS (hand-curl.mjs:27, the wrist is the moving joint); the grip copy carries c5.',
    orientation: 'supinated',  // c1: underhand, palm up
    handle: 'dumbbell',        // c1: one dumbbell (the spec's)
    thumb: { mode: 'wrapped', claim: CL.thumb },   // CONVENTION: the closed grip as the curl key draws it; never printed
    contact: CONTACT,          // 'mid-palm', DERIVED from pairs.mjs CONVENTIONS ga:curl-mid (CONVENTION, above); never printed
    // card grip.wrist: exempt, the wrist is the moving joint (c2-c4; docs/research/howto/shared/wrist-curl-exemption.json)
    wrist: { exempt: 'The wrist is the moving joint: it starts straight, bends back toward the floor, then curls back up (shared/wrist-curl-exemption.json).',
      claim: C(['CONSENSUS'], [ACE], 'card grip.wrist, c2, c3, c4; shared/wrist-curl-exemption.json c1, c2') },
    faults: [
      // card zoom wrist-curl-grip wrong (c5). Not drawn (no hand zoom), so no pose or marker is set.
      { key: 'grip-opening', label: 'Grip opening', pose: {}, markers: [], alt: 'Fingers open, the dumbbell rolled to the fingertips.' },
    ],
    // D-SHIP-W5 (Q-W5-7): c5's words only; no thumb position, no contact.
    gripLine: 'Palm up, closed fist around the handle. Never let it roll to the fingertips.',   // c1, c5
    cue: 'Fist closed, squeeze both ways.',   // c5
  },
  contacts: ['brace-pad'],
  setup: [
    { kind: 'load', text: 'Pick a light weight you can move for 15-20 reps.', claim: CL.c6 },
    { kind: 'position', text: 'Sit, forearm on your thigh or a bench, hand past the edge.', zoom: 'wrist-curl-support', claim: CL.sit },
    { kind: 'grip', text: 'Hold the dumbbell palm up in a closed grip.', claim: CL.hold },
    { kind: 'finish', text: 'Lower slowly and hold briefly. Curl the wrist back up slowly.', claim: CL.move },   // D-TEXT-GOLDEN: posture lower (c3)
  ],
  posture: [
    { key: 'forearm', label: 'Forearm supported', detail: 'Forearm stays on its support.',
      anchor: { landmark: 'elbow.r', pose: 'end' }, zoom: 'wrist-curl-support', claim: CL.forearm },
    { key: 'still', label: 'Body still', detail: 'Arms and body stay still. No leaning.',
      anchor: { landmark: 'backUpper', pose: 'end' }, zoom: 'wrist-curl-support', claim: CL.c3 },
    { key: 'grip', label: 'Grip stays closed', detail: 'Grip stays closed both ways.', anchor: { landmark: 'grip.r', pose: 'end' }, claim: CL.c5 },
    { key: 'lower', label: 'Slow lowering', detail: 'Lower slowly. Hold the bottom briefly.', anchor: { landmark: 'wrist.r', pose: 'start' }, claim: CL.c3 },
  ],
  feel,
  zooms,
  chips: ['wrist-curl-support', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'Sit with your forearm on your thigh, hand past the knee. Hold the dumbbell palm up.',
    // Not printed on the layers page; posture still (c3) is mistakes[1] and the zoom captions, grip (c5) the Grip line.
    mistakeLine: 'Keep the forearm down and the body still. Never let the weight roll to the fingertips.',
    cueLine: 'Only your hand moves.',
    // D-LIB5-VARIANT: the card's plate.variantLine: the barbell version shares the grip and lowering lines (c1, c3, c5).
    variantLine: 'Same grip and lowering with a barbell.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['wrist'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/wrist_curl.json', rev: 1 },
};
