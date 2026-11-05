// LIB-SHIP W5: the How-to content of lib_barbell_curl (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs; the form of lib_dumbbell_biceps_curl.howto.mjs). Every
// shown string restates a claim of the verified card docs/research/howto/cards/barbell_curl.json; its claim ids are
// named on each field's claim.
// Hand zoom (D-SHIP-GRIP case (a)): the card zoom `bb-curl-wrist` is drawn by the approved `curl` pair key
// (tools/plates/library/hands/hand-curl.mjs IDS.barbell_curl: variant 'bar', orientation 'under', faults bent-back then
// curled). The pose, faults, contact and wrist range below are that key's recorded values, read from the key module so
// they cannot drift; the Right/Wrong notes are the pair panel's words (tools/plates/library/hands/words/curl-bar-under.json).
// The card leaves grip.handContact empty: the contact is the key's convention 'ga:curl-mid' (hands/pairs.mjs
// CONVENTIONS), cited as CONVENTION, data only: never printed in any string (D-SHIP-CONVCOPY).
// Family (card parent dumbbell_biceps_curl, inherit[] plate.view, grip.thumb, redFlags; D-SHIP-FAMILY, INHERIT_MAP
// lib_barbell_curl): handling.thumb.mode and handling.pose.thumb are 'wrapped' (=== the parent's, the key's right pose);
// riskFlags ['wrist'] === the parent's; plate.view is plate-only (Q-W5-3, side in both plates).
// No variant line (equipment 'Barbell').
import plateSpec from '../specs/barbell_curl.mjs';
import { IDS, VARIANTS, HANDLE } from '../hands/hand-curl.mjs';
import { RED_FLAG } from '../../layers/howto/shared.mjs';
export { RED_FLAG };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'sl-bbcurl': { cite: 'How to Do Barbell Curl: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/barbell-curl/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'ace-bbcurl': { cite: 'Bicep Curl (ACE Exercise Library; barbell)', url: 'https://www.acefitness.org/resources/everyone/exercise-library/70/bicep-curl/',
    kind: 'guideline', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'marcolin-2018': { cite: 'Differences in electromyographic activity of biceps brachii and brachioradialis while performing three variants of curl', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6047503/',
    kind: 'peer-reviewed', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'sl-dbcurl': { cite: 'How to Dumbbell Curl: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/dumbbell-curl/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'acsm-2009': { cite: 'American College of Sports Medicine position stand. Progression models in resistance training for healthy adults', url: 'https://pubmed.ncbi.nlm.nih.gov/19204579/',
    kind: 'guideline', access: 'abstract', checked: '2026-10-22', use: 'CONSENSUS' },
  // The curl key's own source for the hand contact (the card has no grip.handContact): a drawing convention.
  'hand-key-curl': { cite: 'LIB-7 hand pair key curl (bar), CONVENTIONS ga:curl-mid: across the middle of the palm', url: 'tools/plates/library/hands/pairs.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-05', use: 'CONVENTION' },
  // RED_FLAG's own source (layers/howto/shared.mjs), as golden B's machine_chest_press lists it: the card's redFlags 'wrist'.
  'nhs-wrist-pain': { cite: 'NHS, Wrist pain', url: 'https://www.nhs.uk/conditions/hand-pain/wrist-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When wrist pain needs a check.' },
};
// Not cited: c11 (bar vs dumbbells, a comparison), c13 (tempo, a plate drawing convention), c14 (load progression),
// c15 (EMG comparison).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const SL = 'sl-bbcurl', ACE = 'ace-bbcurl';
const CL = {
  c1: C(['CONSENSUS'], [SL, ACE], 'c1'),
  c2: C(['CONSENSUS'], [SL], 'c2'),
  c3: C(['CONSENSUS'], [ACE, SL], 'c3'),
  c4: C(['CONSENSUS'], [SL], 'c4'),
  c6: C(['CONSENSUS'], [SL], 'c6'),
  c7: C(['CONSENSUS'], [SL, 'marcolin-2018'], 'c7'),
  c8: C(['CONSENSUS'], [SL], 'c8'),
  c9: C(['CONSENSUS'], [ACE], 'c9'),
  c12: C(['CONSENSUS'], [SL], 'c12'),
  elbows: C(['CONSENSUS'], [SL], 'c5, c4'),
  sides: C(['CONSENSUS'], [SL, ACE], 'c4, c3'),
  still: C(['CONSENSUS'], [ACE, SL], 'c9, c3'),
  lower: C(['CONSENSUS'], [SL, ACE], 'c10, c9'),
  finish: C(['CONSENSUS'], [SL, ACE], 'c10, c9, c6'),
  wrist: C(['CONSENSUS', 'MECH'], [SL, 'nhs-wrist-pain'], 'c8, c16'),
  // card grip.thumb "Wrapped round the bar.", carried by inherit grip.thumb: the parent dumbbell_biceps_curl's c1
  // ("thumbs wrapped round the handles", sources ace-seated-curl, sl-dbcurl); sl-dbcurl is also this card's source.
  thumb: C(['CONSENSUS'], ['sl-dbcurl'], 'card grip.thumb and inherit grip.thumb: parent dumbbell_biceps_curl c1 (sources ace-seated-curl, sl-dbcurl).'),
};

/* ------------------------------------------------------------------------------------------------ hand ---------- */
// The key's record for this id and its variant (hand-curl.mjs, radial-rules.mjs curlVariant).
const KEYED = IDS.barbell_curl, V = VARIANTS[KEYED.variant];
const RIGHT_POSE = V.right;
// CONVENTION (D-SHIP-GRIP (a), source hand-key-curl): the key's contact 'mid' (ga:curl-mid) as HandContact. Data only.
const CONTACT = { mid: 'mid-palm' }[V.contact];
if (!CONTACT) throw new Error(`lib_barbell_curl: the curl key's contact ${V.contact} has no HandContact`);
const FAULTS = KEYED.faults.map(key => {
  const f = V.faults[key];
  // HandFault.pose.wrist needs dev: the key's fault sets ext only and the engine merges it over the right pose
  // (render/closeup/common.mjs mergePose), so dev is the right pose's own value (0), written out for the type.
  return { key, label: f.label, pose: { ...f.pose, wrist: { dev: RIGHT_POSE.wrist.dev, ...f.pose.wrist } }, markers: f.markers, alt: f.alt };
});

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses. 'elbows-back' is the spec's Mistake (the CURL template's `elbows` builder, dir 'back':
// card plate.mistake c5, c4 and card zoom curl-elbow Wrong "Elbows swung back behind the body to cheat."), merged over
// the end pose as the engine draws it. No new drawing value: the plate's own (approved) Mistake.
const MIS = plateSpec.mistake.pose;
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: plateSpec.poses.end },
  'elbows-back': { pose: { ...plateSpec.poses.end, ...MIS } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom, same kinds; the hand zoom's key is 'hand' (golden B's chip rule). The posture zoom is in the zoom
// shell's shape (callout with an anchor at the landmark it names, no guide mark; pilot-a.closeups.mjs).
const zooms = [
  {
    key: 'hand', chip: 'Wrist', heading: 'Wrist position', kind: 'hand',   // card zoom key: bb-curl-wrist
    hand: {
      right: RIGHT_POSE,
      wrong: FAULTS,                // handling.faults (golden B's shape: fault objects); the pair pages them in this order
      camera: 'side',               // the pair's camera (pairs.mjs pairSpec)
      panelHeight: V.panelHeight,
      // The pair key's own panel words (words/curl-bar-under.json, first page bent-back), drawn by the key.
      notes: { right: 'Middle of palm', wrong: 'Wrist bent back' },
    },
    caption: {
      right: 'Underhand full grip, hands in line with the forearms.',   // card zoom right (c1, c8)
      wrong: 'Wrists bent back or curled toward the forearms.',        // the key's two drawn faults; c8 (bent wrists)
    },
    // Right: the card's own words (c1, c8; thumb from card grip.thumb), no contact (D-SHIP-CONVCOPY); Wrong: the key's alt.
    alt: { right: 'Bar held underhand, thumb wrapped round it. Wrist straight, in line with the forearm.', wrong: FAULTS[0].alt },
    feelRow: 'wrist',
  },
  {
    key: 'curl-elbow', chip: 'Elbows', heading: 'Elbow path', kind: 'posture',
    // zoom shell (render/closeup/crop.mjs): crop centre on the right pose's elbow for both halves; the Wrong is the
    // spec's Mistake drawn alone (solid), as `stills['elbows-back']`.
    crop: { center: { at: 'elbow.r', pose: 'right', off: [0, -10] }, sizePx: 150 },
    right: 'end',
    wrong: { base: 'end', pose: MIS, solid: true },
    callout: {
      right: { text: 'Elbow at side', anchor: 'elbow.r' },
      wrong: { text: 'Elbow back', anchor: 'elbow.r' },
    },
    caption: {
      right: 'Upper arms by the sides at the top.',              // card zoom right (c4)
      wrong: 'Elbows swung back behind the body to cheat.',     // card zoom wrong (c5)
    },
    alt: {
      right: 'Side view, top of the curl. The upper arm hangs straight down by the side, the bar near the shoulder.',
      wrong: 'Side view, top of the curl. The elbow has swung back behind the body to cheat the bar up.',
    },
    feelRow: 'front-shoulder',
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const HANDS = ['hand-left', 'hand-right', 'hand-back-left', 'hand-back-right'];
const feel = {
  primary: [{ muscleId: 'biceps', plain: 'The biceps, at the front of the upper arm, do most of the work.' }],
  secondary: [{ muscleId: 'forearms', plain: 'The forearm flexors help as a secondary group.' }],
  watch: [],
  // The card's first row (front of the upper arm) has no fix, so it is left out: the feel line says it (D-SHIP-Q16).
  feelLine: 'You should feel this in the front of your upper arms.',
  rows: [
    { key: 'front-shoulder', where: 'Front of the shoulder', at: { muscles: ['front_delts'] },
      means: 'Your elbows move forward, which loads the front delts.',
      fix: 'Keep the upper arms at your sides.',
      zoom: 'curl-elbow', claim: CL.elbows },
    { key: 'wrist', where: 'Wrist discomfort or pain', at: { parts: HANDS },
      means: 'Your wrists are bent up or down under load.',
      fix: "Stop and don't train through the pain. Keep the wrist straight.",
      zoom: 'hand', redFlag: true, claim: CL.wrist },
  ],
  claim: CL.c12,
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'wrists', title: 'Wrists bending', zoom: 'hand', claim: CL.c8,
    fix: 'Keep the hands in line with the forearms.' },
  { key: 'elbows', title: 'Elbows travelling back or forward', zoom: 'curl-elbow', claim: CL.elbows,
    fix: 'Keep the upper arms at your sides.' },
  { key: 'swing', title: 'Swinging the body', claim: CL.c7,
    fix: 'Take weight off and lift with control.' },
];
const RISKS = [
  { key: 'wrist', text: 'Bent wrists put extra load on them and can lead to discomfort.', claim: CL.c8 },
];

export default {
  schema: 1,
  id: 'lib_barbell_curl',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: V.archetype,          // 'curl'
    orientation: 'supinated',        // c1: underhand, palms up; the key's orientation 'under'
    handle: V.handle?.profile ?? HANDLE.profile,   // the key's bar variant: 'bar-28'
    loadAxis: V.loadAxis,            // 'across'
    width: { text: 'In line with your elbows and shoulders.', claim: CL.c1 },   // the gripLine carries the width
    thumb: { mode: RIGHT_POSE.thumb, claim: CL.thumb },   // 'wrapped' (card grip.thumb; === the parent's, THUMB)
    contact: CONTACT,                // CONVENTION: 'mid-palm' from the key's ga:curl-mid (source hand-key-curl); never printed
    wrist: { ext: V.wristRange, limitText: 'Keep the hands in line with the forearms.',
      claim: C(['CONSENSUS', 'CONVENTION'], [SL, 'hand-key-curl'], 'c8. The ext range is the curl key\'s wristRange (ga:curl-mid), a convention, not a card number.') },
    pose: RIGHT_POSE,                // its thumb 'wrapped' === the parent's handling.pose.thumb (THUMB)
    faults: FAULTS,
    gripLine: 'Underhand grip, hands about shoulder-width, thumbs wrapped.',   // c1, grip.thumb; the wrist line is limitText (c8)
    cue: 'Wrists straight, thumbs wrapped.',   // c8, grip.thumb
  },
  contacts: ['standing-feet'],
  setup: [
    { kind: 'load', text: 'Pick a weight you can curl without swinging.', claim: CL.c7 },
    { kind: 'position', text: 'Stand with your feet hip-width, core braced.', claim: CL.c2 },
    { kind: 'grip', text: 'Grip the bar underhand, hands shoulder-width.', zoom: 'hand', claim: CL.c1 },
    { kind: 'brace', text: 'Keep your chest and body still. Only your arms move.', claim: CL.still },   // D-TEXT-GOLDEN: posture still (c9)
    { kind: 'finish', text: 'Lower the bar slowly, keeping tension at the bottom. No half reps.', claim: CL.finish },   // D-TEXT-GOLDEN: posture lower (c10, c9), range (c6)
  ],
  posture: [
    // K2 (W5 panel): the plate's Elbows cue under this key says "Never let them travel back" (c4), so c4 and c3.
    { key: 'elbows', label: 'Elbows at sides', detail: 'Elbows stay close to your body.',
      anchor: { landmark: 'elbow.r', pose: 'end' }, zoom: 'curl-elbow', claim: CL.sides },
    { key: 'upper-arm', label: 'Never back', detail: 'Upper arms never travel back.',
      anchor: { landmark: 'shoulder.r', pose: 'end' }, zoom: 'curl-elbow', claim: CL.c4 },
    { key: 'still', label: 'Still body', detail: 'Body and chest stay still.', anchor: { landmark: 'backUpper', pose: 'end' }, claim: CL.c9 },
    { key: 'wrists', label: 'Straight wrists', detail: 'Wrists stay straight.', anchor: { landmark: 'wrist.r', pose: 'end' }, zoom: 'hand', claim: CL.c8 },
    { key: 'lower', label: 'Slow lowering', detail: 'Lower the bar slowly, keeping tension at the bottom.',
      anchor: { landmark: 'grip.r', pose: 'start' }, claim: CL.lower },
    { key: 'range', label: 'Full range', detail: 'Use the full range, not half reps.', anchor: { landmark: 'grip.r', pose: 'start' }, claim: CL.c6 },
  ],
  feel,
  zooms,
  chips: ['hand', 'curl-elbow', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'Stand feet hip-width, core braced. Grip the bar underhand, hands shoulder-width, elbows close to your body.',
    mistakeLine: 'Never let your upper arms travel back. Take weight off instead of swinging.',
    cueLine: 'Elbows close to your body.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['wrist'],   // the card's redFlags (=== the parent's, inherit redFlags)
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/barbell_curl.json', rev: 1 },
};
