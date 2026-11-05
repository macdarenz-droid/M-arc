// LIB-SHIP W5: the How-to content of lib_ez_bar_curl (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs; the form of lib_dumbbell_biceps_curl.howto.mjs). Every
// shown string restates a claim of the verified card docs/research/howto/cards/ez_bar_curl.json; its claim ids are
// named on each field's claim.
// Hand zoom (D-SHIP-GRIP case (a)): the card zoom `ez-curl-hand` is drawn by the approved `ez` pair key
// (tools/plates/library/hands/hand-ez.mjs IDS.ez_bar_curl: variant 'curl', orientation 'angled', faults bent-back then
// curled). The pose, faults, contact and wrist range below are that key's recorded values, read from the key module so
// they cannot drift; the Right/Wrong notes are the pair panel's words (tools/plates/library/hands/words/ez-curl-angled.json).
// The card leaves grip.handContact empty: the contact is the key's convention 'ga:curl-mid' (hands/pairs.mjs
// CONVENTIONS), cited as CONVENTION, data only: never printed in any string (D-SHIP-CONVCOPY).
// Family (card parent dumbbell_biceps_curl, inherit[] plate.view, grip.thumb, redFlags; D-SHIP-FAMILY, INHERIT_MAP
// lib_ez_bar_curl): handling.thumb.mode and handling.pose.thumb are 'wrapped' (=== the parent's, the key's right pose);
// riskFlags ['wrist'] === the parent's; plate.view is plate-only (Q-W5-3, side in both plates).
// No variant line (equipment 'EZ Bar').
import plateSpec from '../specs/ez_bar_curl.mjs';
import { IDS, VARIANTS, HANDLE } from '../hands/hand-ez.mjs';
import { RED_FLAG } from '../../layers/howto/shared.mjs';
export { RED_FLAG };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'sl-ez': { cite: 'How to Do EZ Curls: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/ez-curl/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'coratella-2023': { cite: 'Biceps Brachii and Brachioradialis Excitation in Biceps Curl Exercise: Different Handgrips, Different Synergy', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10054060/',
    kind: 'peer-reviewed', access: 'full', checked: '2026-10-22', use: 'MECH' },
  'marcolin-2018': { cite: 'Differences in electromyographic activity of biceps brachii and brachioradialis while performing three variants of curl', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6047503/',
    kind: 'peer-reviewed', access: 'full', checked: '2026-10-22', use: 'DATA' },
  'acsm-2009': { cite: 'American College of Sports Medicine position stand. Progression models in resistance training for healthy adults', url: 'https://pubmed.ncbi.nlm.nih.gov/19204579/',
    kind: 'guideline', access: 'abstract', checked: '2026-10-22', use: 'CONSENSUS' },
  // The parent dumbbell_biceps_curl's c1 source, for this card's inherited grip.thumb ("thumbs wrapped round the handles").
  'sl-dbcurl': { cite: 'How to Dumbbell Curl: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/dumbbell-curl/',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  // The ez key's own source for the hand contact (the card has no grip.handContact): a drawing convention.
  'hand-key-ez': { cite: 'LIB-7 hand pair key ez (curl), CONVENTIONS ga:curl-mid: across the middle of the palm', url: 'tools/plates/library/hands/pairs.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-05', use: 'CONVENTION' },
  // RED_FLAG's own source (layers/howto/shared.mjs), as golden B's machine_chest_press lists it: the card's redFlags 'wrist'.
  'nhs-wrist-pain': { cite: 'NHS, Wrist pain', url: 'https://www.nhs.uk/conditions/hand-pain/wrist-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When wrist pain needs a check.' },
};
// Not cited: c9 (EZ vs straight bar comfort), c10 (EMG comparison), c13 (load progression), c14 (tempo, a plate
// drawing convention).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const SL = 'sl-ez';
const CL = {
  c1: C(['CONSENSUS'], [SL], 'c1'),
  c2: C(['MECH'], ['coratella-2023'], 'c2'),
  c3: C(['CONSENSUS'], [SL], 'c3'),
  c4: C(['CONSENSUS'], [SL], 'c4'),
  c6: C(['CONSENSUS'], [SL], 'c6'),
  c7: C(['CONSENSUS'], [SL], 'c7'),
  c8: C(['CONSENSUS'], [SL], 'c8'),
  c11: C(['CONSENSUS'], [SL], 'c11'),
  c12: C(['CONSENSUS'], [SL], 'c12'),
  elbows: C(['CONSENSUS'], [SL], 'c5, c4'),
  finish: C(['CONSENSUS'], [SL], 'c12, c6'),
  wrist: C(['CONSENSUS', 'MECH'], [SL, 'nhs-wrist-pain'], 'c8, c15'),
  // card grip.thumb "Wrapped round the bar.", carried by inherit grip.thumb: the parent dumbbell_biceps_curl's c1
  // ("thumbs wrapped round the handles", sources ace-seated-curl, sl-dbcurl).
  thumb: C(['CONSENSUS'], ['sl-dbcurl'], 'card grip.thumb and inherit grip.thumb: parent dumbbell_biceps_curl c1 (sources ace-seated-curl, sl-dbcurl).'),
};

/* ------------------------------------------------------------------------------------------------ hand ---------- */
// The key's record for this id and its variant (hand-ez.mjs, radial-rules.mjs curlVariant).
const KEYED = IDS.ez_bar_curl, V = VARIANTS[KEYED.variant];
const RIGHT_POSE = V.right;
// CONVENTION (D-SHIP-GRIP (a), source hand-key-ez): the key's contact 'mid' (ga:curl-mid) as HandContact. Data only.
const CONTACT = { mid: 'mid-palm' }[V.contact];
if (!CONTACT) throw new Error(`lib_ez_bar_curl: the ez key's contact ${V.contact} has no HandContact`);
const FAULTS = KEYED.faults.map(key => {
  const f = V.faults[key];
  // HandFault.pose.wrist needs dev: the key's fault sets ext only and the engine merges it over the right pose
  // (render/closeup/common.mjs mergePose), so dev is the right pose's own value (0), written out for the type.
  return { key, label: f.label, pose: { ...f.pose, wrist: { dev: RIGHT_POSE.wrist.dev, ...f.pose.wrist } }, markers: f.markers, alt: f.alt };
});

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses. 'elbows-forward' is the spec's Mistake (the CURL template's `elbows` builder, dir
// 'forward': card plate.mistake c4, c5 and card zoom ez-curl-elbow Wrong "Elbows drifted forward, bar lifted by the
// shoulders."), merged over the end pose as the engine draws it. No new drawing value: the plate's own Mistake.
const MIS = plateSpec.mistake.pose;
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: plateSpec.poses.end },
  'elbows-forward': { pose: { ...plateSpec.poses.end, ...MIS } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom, same kinds; the hand zoom's key is 'hand' (golden B's chip rule). The posture zoom is in the zoom
// shell's shape (callout with an anchor at the landmark it names, no guide mark; pilot-a.closeups.mjs).
const zooms = [
  {
    key: 'hand', chip: 'Wrist', heading: 'Wrist position', kind: 'hand',   // card zoom key: ez-curl-hand
    hand: {
      right: RIGHT_POSE,
      wrong: FAULTS,                // handling.faults (golden B's shape: fault objects); the pair pages them in this order
      camera: 'side',               // the pair's camera (pairs.mjs pairSpec)
      panelHeight: V.panelHeight,
      // The pair key's own panel words (words/ez-curl-angled.json, first page bent-back), drawn by the key.
      notes: { right: 'Middle of palm', wrong: 'Wrist bent back' },
    },
    caption: {
      right: 'Hands underhand on the angled sections, wrists straight.',   // card zoom right (c1, c8)
      wrong: 'Wrists bent back or curled toward the forearms.',           // the key's two drawn faults; c8 (bent wrists)
    },
    // Right: the card's own words (c1, c8; thumb from card grip.thumb), no contact (D-SHIP-CONVCOPY); Wrong: the key's alt.
    alt: { right: 'Hand underhand on the angled section, thumb wrapped round the bar. Wrist straight, in line with the forearm.', wrong: FAULTS[0].alt },
    feelRow: 'wrist',
  },
  {
    key: 'ez-curl-elbow', chip: 'Elbows', heading: 'Elbow path', kind: 'posture',   // the card zoom's own key (K2: its claim c5, with c4)
    // zoom shell (render/closeup/crop.mjs): crop centre on the right pose's elbow for both halves; the Wrong is the
    // spec's Mistake drawn alone (solid), as `stills['elbows-forward']`.
    crop: { center: { at: 'elbow.r', pose: 'right', off: [0, -10] }, sizePx: 150 },
    right: 'end',
    wrong: { base: 'end', pose: MIS, solid: true },
    callout: {
      right: { text: 'Elbow at side', anchor: 'elbow.r' },
      wrong: { text: 'Elbow forward', anchor: 'elbow.r' },
    },
    caption: {
      right: 'Elbows by the sides at the top of the curl.',          // card zoom right (c4)
      wrong: 'Elbows drifted forward, bar lifted by the shoulders.',   // card zoom wrong (c5)
    },
    alt: {
      right: 'Side view, top of the curl. The upper arm hangs straight down by the side, the bar near the chest.',
      wrong: 'Side view, top of the curl. The elbow has drifted forward off the side, so the shoulder lifts the bar.',
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
      fix: 'Keep the elbows close to your body.',
      zoom: 'ez-curl-elbow', claim: CL.elbows },
    { key: 'wrist', where: 'Wrist discomfort or pain', at: { parts: HANDS },
      means: 'Your wrists are bent up or down under load.',
      fix: "Stop and don't train through the pain. Keep the wrist straight.",
      zoom: 'hand', redFlag: true, claim: CL.wrist },
  ],
  claim: CL.c11,
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'wrists', title: 'Wrists bending', zoom: 'hand', claim: CL.c8,
    fix: 'Keep the hands in line with the forearms.' },
  { key: 'elbows', title: 'Elbows drifting forward or back', zoom: 'ez-curl-elbow', claim: CL.elbows,
    fix: 'Keep the elbows close to your body.' },
  { key: 'swing', title: 'Swinging the body', claim: CL.c7,
    fix: 'Take weight off and lift with control.' },
];
const RISKS = [
  { key: 'wrist', text: 'Bent wrists under load can cause wrist discomfort.', claim: CL.c8 },
];

export default {
  schema: 1,
  id: 'lib_ez_bar_curl',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: V.archetype,          // 'curl'
    orientation: 'supinated',        // c1: underhand on the angled sections (c2 semi-supinated); the key's orientation 'angled'
    handle: V.handle?.profile ?? HANDLE.profile,   // the ez key's HANDLE: 'ez-bend'
    loadAxis: V.loadAxis,            // 'across'
    width: { text: 'Hands closer together than on a straight bar, set by the angled sections.', claim: CL.c2 },
    thumb: { mode: RIGHT_POSE.thumb, claim: CL.thumb },   // 'wrapped' (card grip.thumb; === the parent's, THUMB)
    contact: CONTACT,                // CONVENTION: 'mid-palm' from the key's ga:curl-mid (source hand-key-ez); never printed
    wrist: { ext: V.wristRange, limitText: 'Keep the hands in line with the forearms.',
      claim: C(['CONSENSUS', 'CONVENTION'], [SL, 'hand-key-ez'], 'c8. The ext range is the ez key\'s wristRange (ga:curl-mid), a convention, not a card number.') },
    pose: RIGHT_POSE,                // its thumb 'wrapped' === the parent's handling.pose.thumb (THUMB)
    faults: FAULTS,
    gripLine: 'Underhand on the angled sections, thumbs wrapped.',   // c1, grip.thumb; the wrist line is limitText (c8)
    cue: 'Wrists straight, thumbs wrapped.',   // c8, grip.thumb
  },
  contacts: ['standing-feet'],
  setup: [
    { kind: 'load', text: 'Pick a weight you can curl without swinging.', claim: CL.c7 },
    { kind: 'position', text: 'Stand upright, feet hip- to shoulder-width, core braced.', claim: CL.c3 },
    { kind: 'grip', text: 'Grip the angled sections underhand.', zoom: 'hand', claim: CL.c1 },
    { kind: 'brace', text: 'Keep your body still. Only your arms move.', claim: CL.c4 },   // D-TEXT-GOLDEN: posture still (c4)
    { kind: 'finish', text: 'Pause briefly at the top, then lower slowly. No half reps.', claim: CL.finish },   // D-TEXT-GOLDEN: posture pause (c12), range (c6)
  ],
  posture: [
    { key: 'elbows', label: 'Elbows at sides', detail: 'Elbows stay close to your body.',
      anchor: { landmark: 'elbow.r', pose: 'end' }, zoom: 'ez-curl-elbow', claim: CL.c4 },
    { key: 'no-drift', label: 'No forward drift', detail: 'No elbow drift forward at the top.',
      anchor: { landmark: 'shoulder.r', pose: 'end' }, zoom: 'ez-curl-elbow', claim: CL.c4 },
    { key: 'still', label: 'Still body', detail: 'Body stays still. Only the arms move.', anchor: { landmark: 'backUpper', pose: 'end' }, claim: CL.c4 },
    { key: 'wrists', label: 'Straight wrists', detail: 'Wrists stay straight.', anchor: { landmark: 'wrist.r', pose: 'end' }, zoom: 'hand', claim: CL.c8 },
    { key: 'pause', label: 'Pause, lower slowly', detail: 'Pause at the top, then lower slowly.', anchor: { landmark: 'grip.r', pose: 'end' }, claim: CL.c12 },
    { key: 'range', label: 'Full range', detail: 'Full range, not half reps.', anchor: { landmark: 'grip.r', pose: 'start' }, claim: CL.c6 },
  ],
  feel,
  zooms,
  chips: ['hand', 'ez-curl-elbow', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'Stand upright, feet hip- to shoulder-width, core braced. Grip the angled sections underhand.',
    mistakeLine: 'Keep your elbows close to your body. Never let them drift forward at the top.',
    cueLine: 'Elbows close to your body.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['wrist'],   // the card's redFlags (=== the parent's, inherit redFlags)
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/ez_bar_curl.json', rev: 1 },
};
