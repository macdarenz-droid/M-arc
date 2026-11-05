// LIB-SHIP W5: the How-to content of lib_preacher_curl (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs; the form of lib_dumbbell_biceps_curl.howto.mjs). Every
// shown string restates a claim of the verified card docs/research/howto/cards/preacher_curl.json; its claim ids are
// named on each field's claim.
// Hand zoom (D-SHIP-GRIP case (a)): the card zoom `curl-wrist` is drawn by the approved `ez` pair key
// (tools/plates/library/hands/hand-ez.mjs IDS.preacher_curl: variant 'curl', orientation 'under', faults bent-back then
// curled). The pose, faults, contact and wrist range below are that key's recorded values, read from the key module so
// they cannot drift; the Right/Wrong notes are the pair panel's words (tools/plates/library/hands/words/ez-curl-under.json).
// The card leaves grip.width, grip.thumb and grip.handContact empty: no width is written; the thumb is the key's
// right-pose thumb and the contact the key's convention 'ga:curl-mid' (hands/pairs.mjs CONVENTIONS), both cited as
// CONVENTION, data only: never printed in any string (D-SHIP-CONVCOPY).
// Red flags: the card's redFlags (shoulder, elbow, wrist), golden B's shared blocks, each linked by its feel row.
// Variant line (D-LIB5-VARIANT): exercises.json lists 'Machine / EZ Bar'; the card's plate.variantLine says every line is
// for the free-weight EZ bar only (c1, c11).
// No parent.
import plateSpec from '../specs/preacher_curl.mjs';
import { IDS, VARIANTS, HANDLE } from '../hands/hand-ez.mjs';
import { RED_FLAG, RED_FLAG_SHOULDER, RED_FLAG_ELBOW } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_SHOULDER, RED_FLAG_ELBOW };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'bb-preacher': { cite: 'Learn the Preacher Curl to Build Strong and Inspiring Biceps (BarBend)', url: 'https://barbend.com/preacher-curl/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'sl-preacher': { cite: 'How to Do Barbell Preacher Curl: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/barbell-preacher-curl/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'oliveira-2009': { cite: 'Effect of the shoulder position on the biceps brachii emg in different dumbbell curls', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3737788/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-22', use: 'DATA' },
  'nunes-2020': { cite: 'Placing Greater Torque at Shorter or Longer Muscle Lengths? Effects of Cable vs. Barbell Preacher Curl Training on Muscular Strength and Hypertrophy in Young Adults', url: 'https://pubmed.ncbi.nlm.nih.gov/32823490/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-22', use: 'DATA' },
  'kassiano-2025': { cite: 'Distinct muscle growth and strength adaptations after preacher and incline biceps curls', url: 'https://pubmed.ncbi.nlm.nih.gov/39809454/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-22', use: 'DATA' },
  'jukes-2022': { cite: 'Challenging the mechanism of distal biceps tendon rupture using a video analysis study', url: 'https://pubmed.ncbi.nlm.nih.gov/36243942/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-22', use: 'WEAK' },
  'acsm-2009': { cite: 'American College of Sports Medicine position stand. Progression models in resistance training for healthy adults', url: 'https://pubmed.ncbi.nlm.nih.gov/19204579/',
    kind: 'guideline', access: 'abstract', checked: '2026-10-22', use: 'CONSENSUS' },
  // The ez key's own source for the thumb and the hand contact (the card has neither): drawing conventions.
  'hand-key-ez': { cite: 'LIB-7 hand pair key ez (curl): right-pose thumb wrapped; CONVENTIONS ga:curl-mid, across the middle of the palm', url: 'tools/plates/library/hands/hand-ez.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-05', use: 'CONVENTION' },
  // The shared boxes' own sources (layers/howto/shared.mjs): the card's redFlags 'wrist', 'shoulder', 'elbow'.
  'nhs-wrist-pain': { cite: 'NHS, Wrist pain', url: 'https://www.nhs.uk/conditions/hand-pain/wrist-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When wrist pain needs a check.' },
  'nhs-shoulder-pain': { cite: 'NHS, Shoulder pain', url: 'https://www.nhs.uk/conditions/shoulder-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When shoulder pain needs a check.' },
  'nhs-elbow-pain': { cite: 'NHS, Elbow and arm pain', url: 'https://www.nhs.uk/symptoms/elbow-and-arm-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When elbow pain needs a check.' },
};
// Not cited: c12 (growth trial), c14 (tempo, a plate drawing convention), c15 (load progression).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const BB = 'bb-preacher', SL = 'sl-preacher';
const CL = {
  c1: C(['CONSENSUS'], [BB], 'c1'),
  c2: C(['CONSENSUS'], [SL, BB], 'c2'),
  c3: C(['CONSENSUS'], [BB], 'c3'),
  c4: C(['CONSENSUS'], [BB, SL], 'c4'),
  c5: C(['CONSENSUS'], [BB], 'c5'),
  c6: C(['CONSENSUS'], [BB], 'c6'),
  c7: C(['CONSENSUS'], [BB, SL], 'c7'),
  c8: C(['CONSENSUS'], [SL, BB], 'c8'),
  c10: C(['CONSENSUS'], [SL], 'c10'),
  c13: C(['WEAK'], ['jukes-2022'], 'c13'),
  pad: C(['CONSENSUS'], [BB, SL], 'c2, c3'),
  arms: C(['CONSENSUS'], [BB, SL], 'c5, c4'),
  seat: C(['CONSENSUS'], [BB, SL], 'c3, c2'),
  active: C(['CONSENSUS'], [BB, SL], 'c4, c9'),
  zoom: C(['CONSENSUS'], [BB, SL], 'c5, c2'),
  shoulder: C(['CONSENSUS'], [BB], 'c3, c5'),
  elbow: C(['CONSENSUS'], [BB, SL], 'c7, c6'),
  wrist: C(['CONSENSUS', 'MECH'], [SL, BB, 'nhs-wrist-pain'], 'c8, c16'),
  feel: C(['CONSENSUS', 'DATA'], [SL, 'oliveira-2009', 'nunes-2020'], 'c10, c11'),
  variant: C(['CONSENSUS'], [BB], 'card plate.variantLine: c1, c11 hold for the free-weight bar only'),
  // card grip.thumb is empty: the ez key's right-pose thumb (radial-rules.mjs curlVariant), data only, never printed.
  thumb: C(['CONVENTION'], ['hand-key-ez'], 'card grip.thumb is empty: the ez key\'s right-pose thumb, a convention, never shown.'),
};

/* ------------------------------------------------------------------------------------------------ hand ---------- */
// The key's record for this id and its variant (hand-ez.mjs, radial-rules.mjs curlVariant).
const KEYED = IDS.preacher_curl, V = VARIANTS[KEYED.variant];
const RIGHT_POSE = V.right;
// CONVENTION (D-SHIP-GRIP (a), source hand-key-ez): the key's contact 'mid' (ga:curl-mid) as HandContact. Data only.
const CONTACT = { mid: 'mid-palm' }[V.contact];
if (!CONTACT) throw new Error(`lib_preacher_curl: the ez key's contact ${V.contact} has no HandContact`);
const FAULTS = KEYED.faults.map(key => {
  const f = V.faults[key];
  // HandFault.pose.wrist needs dev: the key's fault sets ext only and the engine merges it over the right pose
  // (render/closeup/common.mjs mergePose), so dev is the right pose's own value (0), written out for the type.
  return { key, label: f.label, pose: { ...f.pose, wrist: { dev: RIGHT_POSE.wrist.dev, ...f.pose.wrist } }, markers: f.markers, alt: f.alt };
});

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses. 'arms-off-pad' is the spec's Mistake (card plate.mistake c5 and card zoom
// preacher-pad Wrong "Upper arms lifted off the pad, torso heaving back."), merged over the end pose as the engine draws
// it. No new drawing value: the plate's own Mistake.
const MIS = plateSpec.mistake.pose;
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: plateSpec.poses.end },
  'arms-off-pad': { pose: { ...plateSpec.poses.end, ...MIS } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom, same kinds; the hand zoom's key is 'hand' (golden B's chip rule) and leads, as the W1 curl. The
// posture zoom is in the zoom shell's shape (callout with an anchor at the landmark it names, no guide mark;
// pilot-a.closeups.mjs).
const zooms = [
  {
    key: 'hand', chip: 'Wrist', heading: 'Wrist position', kind: 'hand',   // card zoom key: curl-wrist
    hand: {
      right: RIGHT_POSE,
      wrong: FAULTS,                // handling.faults (golden B's shape: fault objects); the pair pages them in this order
      camera: 'side',               // the pair's camera (pairs.mjs pairSpec)
      panelHeight: V.panelHeight,
      // The pair key's own panel words (words/ez-curl-under.json, first page bent-back), drawn by the key.
      notes: { right: 'Middle of palm', wrong: 'Wrist bent back' },
    },
    caption: {
      right: 'Underhand grip, hand in line with the forearm.',     // card zoom right (c8)
      wrong: 'Wrist bent back or curled toward the forearm.',      // the key's two drawn faults; c8 (bent wrists)
    },
    // Right: the card's own words (c1, c8), no thumb or contact (D-SHIP-CONVCOPY); Wrong: the key's alt.
    alt: { right: 'Bar held underhand. Wrist straight, in line with the forearm.', wrong: FAULTS[0].alt },
    feelRow: 'wrist',
  },
  {
    key: 'preacher-pad', chip: 'Pad', heading: 'Arms on pad', kind: 'posture',
    // zoom shell (render/closeup/crop.mjs): crop centre between the right pose's shoulder and elbow (the upper arm on the
    // pad face: elbow.r moved up and back by half the upper arm), the same for both halves; the Wrong is the spec's
    // Mistake drawn alone (solid), as `stills['arms-off-pad']`.
    crop: { center: { at: 'elbow.r', pose: 'right', off: [-16, -17] }, sizePx: 170 },
    right: 'end',
    wrong: { base: 'end', pose: MIS, solid: true },
    callout: {
      right: { text: 'Arms on pad', anchor: 'elbow.r' },
      wrong: { text: 'Arms off pad', anchor: 'elbow.r' },
    },
    caption: {
      right: 'Pad under the armpits, upper arms flat on the pad.',   // card zoom right (c2)
      wrong: 'Upper arms lifted off the pad, torso heaving back.',    // card zoom wrong (c5)
    },
    alt: {
      right: 'Side view, top of the curl. Chest on the pad, its top under the armpit, the upper arm flat on it.',
      wrong: 'Side view. The torso heaves back. The upper arm lifts off the pad as the bar swings up.',
    },
    feelRow: 'front-shoulder',
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const HANDS = ['hand-left', 'hand-right', 'hand-back-left', 'hand-back-right'];
const feel = {
  primary: [{ muscleId: 'biceps', plain: 'The biceps, at the front of the upper arm, do most of the work.' }],
  secondary: [{ muscleId: 'forearms', plain: 'The forearm flexors help.' }],
  watch: [{ muscleId: 'front_delts', plain: 'The front delts are at risk when the arms leave the pad.' }],   // c5
  // The card's first row (front of the upper arm, c11, c10) has no fix, so it is left out: the feel line says it
  // (D-SHIP-Q16).
  feelLine: 'You should feel this in the front of your upper arms.',
  rows: [
    { key: 'front-shoulder', where: 'Front of the shoulder', at: { muscles: ['front_delts'] },
      means: 'Your seat height is off, or your arms leave the pad.',
      fix: 'Reset the seat. Go lighter.',
      zoom: 'preacher-pad', redFlag: 'shoulder', claim: CL.shoulder },
    { key: 'elbow', where: 'Elbow, at full straightening', at: { parts: ['elbow-left', 'elbow-right'] },
      means: 'Full straightening feels uncomfortable for you.',
      fix: 'Turn back a little earlier. Lower slowly.',
      redFlag: 'elbow', claim: CL.elbow },
    { key: 'wrist', where: 'Wrist discomfort or pain', at: { parts: HANDS },
      means: 'Your wrists are bent up or down under load.',
      fix: "Stop and don't train through the pain. Keep the wrist straight.",
      zoom: 'hand', redFlag: true, claim: CL.wrist },
  ],
  claim: CL.feel,
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'arms-off', title: 'Upper arms leaving the pad', zoom: 'preacher-pad', claim: CL.arms,
    fix: 'Go lighter. Keep the arms pressed into the pad.' },
  { key: 'seat', title: 'Seat too high or low', claim: CL.seat,
    fix: 'Reset it so the pad top sits under your armpits.' },
  { key: 'drop', title: 'Dropping fast into the bottom', claim: CL.c6,
    fix: "Lower slowly. Go lighter if you can't control it." },
];
const RISKS = [
  { key: 'heave', text: 'Heaving a heavy bar off the pad can put the front shoulder at risk.', claim: CL.c5 },
  { key: 'seat', text: 'A wrong seat height can shift stress onto the shoulder.', claim: CL.c3 },
  { key: 'tendon', text: 'Across many activities, most biceps tendon ruptures on video were palm-up, elbow nearly straight.', claim: CL.c13 },
];

export default {
  schema: 1,
  id: 'lib_preacher_curl',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: V.archetype,          // 'curl'
    orientation: 'supinated',        // c1: underhand; the key's orientation 'under'
    handle: V.handle?.profile ?? HANDLE.profile,   // the ez key's HANDLE: 'ez-bend' (c1: the curl bar)
    loadAxis: V.loadAxis,            // 'across'
    thumb: { mode: RIGHT_POSE.thumb, claim: CL.thumb },   // CONVENTION: the key's right-pose thumb ('wrapped'); never printed
    contact: CONTACT,                // CONVENTION: 'mid-palm' from the key's ga:curl-mid (source hand-key-ez); never printed
    wrist: { ext: V.wristRange, limitText: 'Keep the hands in line with the forearms.',
      claim: C(['CONSENSUS', 'CONVENTION'], [SL, BB, 'hand-key-ez'], 'c8. The ext range is the ez key\'s wristRange (ga:curl-mid), a convention, not a card number.') },
    pose: RIGHT_POSE,
    faults: FAULTS,
    gripLine: 'Underhand grip on the curl bar. Keep your wrists straight.',   // c1, c8
    cue: 'Wrist in line with the forearm.',   // c8
  },
  contacts: ['pivot-pad'],
  setup: [
    { kind: 'adjust', text: 'Set the seat so your chest and upper arms touch the pad.', claim: CL.c1 },
    { kind: 'adjust', text: 'Pad top under your armpits, arms straight. Not so high you hunch.', zoom: 'preacher-pad', claim: CL.pad },
    { kind: 'position', text: 'Feet flat on the floor.', claim: CL.c2 },
    { kind: 'grip', text: 'Take the bar with an underhand grip.', zoom: 'hand', claim: CL.c1 },
    { kind: 'load', text: 'Pick a weight you can lower under control.', claim: CL.c6 },
  ],
  posture: [
    { key: 'armpits', label: 'Armpits over pad', detail: 'Pad top under the armpits. Chest and upper arms on the pad.',
      anchor: { landmark: 'shoulder.r', pose: 'start' }, zoom: 'preacher-pad', claim: CL.c2 },
    { key: 'arms', label: 'Arms on pad', detail: 'Backs of the upper arms stay pressed into the pad.',
      anchor: { landmark: 'elbow.r', pose: 'end' }, zoom: 'preacher-pad', claim: CL.c4 },
    { key: 'active', label: 'Still, active body', detail: 'Body stays still, upper body active, not hanging on the pad.',
      anchor: { landmark: 'backUpper', pose: 'end' }, claim: CL.active },
    { key: 'wrists', label: 'Straight wrists', detail: 'Wrists stay straight.', anchor: { landmark: 'wrist.r', pose: 'end' }, zoom: 'hand', claim: CL.c8 },
    { key: 'range', label: 'Long range', detail: 'Lower well past 90 degrees. Stop short if full straightening feels uncomfortable.',
      anchor: { landmark: 'elbow.r', pose: 'start' }, claim: CL.c7 },
    { key: 'slow', label: 'Slow lowering', detail: 'Lower slowly.', anchor: { landmark: 'grip.r', pose: 'start' }, claim: CL.c6 },
  ],
  feel,
  zooms,
  chips: ['hand', 'preacher-pad', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    // D-TEXT-GOLDEN: posture active (c9) in the setup line; still (c4) and range (c7) in the mistake line.
    setupLine: 'Chest and upper arms on the pad, feet flat. Keep your upper body active, not hanging.',
    mistakeLine: 'Keep your upper arms on the pad, body still. Lower well past 90 degrees, under control.',
    cueLine: 'Arms pressed into the pad.',
    // D-LIB5-VARIANT: the card's plate.variantLine: every line is for the free-weight EZ bar only (c1, c11).
    variantLine: 'Each line is for the EZ bar, not the machine.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['shoulder', 'elbow', 'wrist'],   // the card's redFlags, in its order
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/preacher_curl.json', rev: 1 },
};
