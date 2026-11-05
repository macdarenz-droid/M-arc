// LIB-SHIP W5: the How-to content of lib_incline_dumbbell_curl (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs; the form of lib_dumbbell_biceps_curl, W1). Every shown
// string restates a claim of the verified card docs/research/howto/cards/incline_dumbbell_curl.json; its claim ids are
// named on each field's claim. No parent (the card names none).
// Hand zoom (D-SHIP-GRIP case (a)): the card zoom `curl-wrist` is drawn by the approved `curl` pair key
// (tools/plates/library/hands/hand-curl.mjs IDS.incline_dumbbell_curl: variant 'dumbbell', orientation 'under', faults
// curled and bent-back). The pose, faults and wrist range below are that key's recorded values, read from the key module
// so they cannot drift; the Right/Wrong notes are the pair panel's words (hands/words/curl-dumbbell-under.json). The card
// leaves grip.handContact empty: the contact is the key's convention 'ga:curl-mid' (hands/pairs.mjs CONVENTIONS), cited
// as CONVENTION, and is data only (D-SHIP-CONVCOPY: never printed).
// The card zoom's Wrong ("Wrist bent under the dumbbell", c11) is a bend the key draws as curled or bent back; the
// caption names the key's drawn faults, from the card's own wrist-straight claim (c11).
// Red flags: the card's redFlags (shoulder, wrist), golden B's shared blocks, linked by the shoulder and wrist rows.
// No variant line (equipment 'Dumbbells').
import plateSpec from '../specs/incline_dumbbell_curl.mjs';
import { IDS, VARIANTS } from '../hands/hand-curl.mjs';
import { RED_FLAG, RED_FLAG_SHOULDER } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_SHOULDER };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'bb-incline': { cite: 'Do the Incline Dumbbell Curl to Double Down on Your Arm Gains (BarBend)', url: 'https://barbend.com/incline-dumbbell-curl/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'sl-incline': { cite: 'How to Do Incline Dumbbell Curl: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/incline-dumbbell-curl/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'oliveira-2009': { cite: 'Effect of the shoulder position on the biceps brachii emg in different dumbbell curls', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3737788/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-22', use: 'DATA' },
  'ace-seated-curl': { cite: 'Seated Biceps Curl (ACE Exercise Library)', url: 'https://www.acefitness.org/resources/everyone/exercise-library/44/seated-biceps-curl/',
    kind: 'guideline', access: 'full', checked: '2026-10-22', use: 'MECH' },
  'sl-dbcurl': { cite: 'How to Dumbbell Curl: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/dumbbell-curl/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'MECH' },
  'kerr-2010': { cite: 'Epidemiology of weight training-related injuries presenting to United States emergency departments, 1990 to 2007', url: 'https://pubmed.ncbi.nlm.nih.gov/20139328/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-22', use: 'WEAK' },
  // The curl key's own source for the hand contact (the card has no grip.handContact): a drawing convention.
  'hand-key-curl': { cite: 'LIB-7 hand pair key curl (dumbbell), CONVENTIONS ga:curl-mid: across the middle of the palm', url: 'tools/plates/library/hands/pairs.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-05', use: 'CONVENTION' },
  // RED_FLAG's own source (layers/howto/shared.mjs), as golden B's machine_chest_press lists it: the card's redFlags
  // 'wrist'. The card's c15 cites the same NHS page (its url https://www.nhs.uk/symptoms/hand-pain/wrist-pain/, checked
  // 2026-10-22); one id, the shared block's url, as lib_barbell_curl.
  'nhs-wrist-pain': { cite: 'NHS, Wrist pain', url: 'https://www.nhs.uk/conditions/hand-pain/wrist-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When wrist pain needs a check.' },
  // RED_FLAG_SHOULDER's own source (layers/howto/shared.mjs), as golden B's lateral raise lists it: the card's redFlags 'shoulder'.
  'nhs-shoulder-pain': { cite: 'NHS, Shoulder pain', url: 'https://www.nhs.uk/conditions/shoulder-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When shoulder pain needs a check.' },
};
// Not cited: kassiano-2025 (c8), ace-bicepsstudy (c9), acsm-2009 (c12, c13: tempo and progression).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const BB = 'bb-incline', SL = 'sl-incline';
const CL = {
  c1: C(['CONSENSUS'], [BB, SL], 'c1'),
  c2: C(['CONSENSUS'], [BB, SL], 'c2'),
  c3: C(['CONSENSUS'], [BB], 'c3'),
  c4: C(['CONSENSUS'], [BB], 'c4'),
  c5: C(['CONSENSUS'], [BB], 'c5'),
  c11: C(['MECH'], ['ace-seated-curl', 'sl-dbcurl'], 'c11'),
  c14: C(['WEAK'], ['kerr-2010'], 'c14'),
};

/* ------------------------------------------------------------------------------------------------ hand ---------- */
// The key's record for this id and its variant (hand-curl.mjs, radial-rules.mjs curlVariant).
const KEYED = IDS.incline_dumbbell_curl, V = VARIANTS[KEYED.variant];
const RIGHT_POSE = V.right;
const FAULTS = KEYED.faults.map(key => {
  const f = V.faults[key];
  // HandFault.pose.wrist needs dev: the key's fault sets ext only and the engine merges it over the right pose
  // (render/closeup/common.mjs mergePose), so dev is the right pose's own value (0), written out for the type.
  return { key, label: f.label, pose: { ...f.pose, wrist: { dev: RIGHT_POSE.wrist.dev, ...f.pose.wrist } }, markers: f.markers, alt: f.alt };
});

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses. 'elbows-forward' (card zoom incline-elbow Wrong, c4: "Elbow drifted forward past the
// torso line") is the spec's own Mistake (elbows drifting forward, c4/c3), merged over the end pose. No drawing value of
// this sheet's own: the Mistake's sizes are the spec's.
const MIS = plateSpec.mistake.pose;
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: plateSpec.poses.end },
  'elbows-forward': { pose: { ...plateSpec.poses.end, ...MIS } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom, same kinds; the hand zoom's key is 'hand' and comes first (golden B's chip rule: a load through
// the hands puts Hand first). The posture
// zoom is in the zoom shell's shape (callout with an anchor at the landmark it names, no guide mark; pilot-a.closeups.mjs).
const zooms = [
  {
    key: 'hand', chip: 'Wrist', heading: 'Wrist position', kind: 'hand',   // card zoom key: curl-wrist
    hand: {
      right: RIGHT_POSE,
      wrong: FAULTS,                // handling.faults (golden B's shape: fault objects); the pair pages them in this order
      camera: 'side',               // the pair's camera (pairs.mjs ORIENTATIONS.under)
      panelHeight: V.panelHeight,
      // The pair panel's own words (D-SHIP-CONVCOPY allows the key's panel words): 'Middle of palm' is the curl key's
      // ga:curl-mid label, source hand-key-curl (words/curl-dumbbell-under.json, radial-rules.mjs:16).
      notes: { right: 'Middle of palm', wrong: 'Wrist curled' },   // words/curl-dumbbell-under.json, first page
    },
    caption: {
      right: 'Palms-forward grip, hand in line with the forearm.',   // card zoom right (c11)
      wrong: 'Wrist bent back or curled toward the forearm.',        // the key's drawn faults; the inverse of c11's straight wrist
    },
    // The key's alt without its contact words (D-SHIP-CONVCOPY): palms forward, thumb wrapped and wrist straight c11.
    alt: { right: 'Palm forward, thumb wrapped round the handle. Wrist straight, in line with the forearm.', wrong: V.faults[KEYED.faults[0]].alt },
    feelRow: 'wrist',
  },
  {
    key: 'incline-elbow', chip: 'Elbows', heading: 'Elbow path', kind: 'posture',
    // zoom shell (render/closeup/crop.mjs): crop centre on the right pose's elbow for both halves; the Wrong is the
    // spec's Mistake drawn alone (solid), as `stills['elbows-forward']`.
    crop: { center: { at: 'elbow.r', pose: 'right', off: [0, -10] }, sizePx: 160 },
    right: 'end',
    wrong: { base: 'end', pose: MIS, solid: true },
    callout: {
      right: { text: 'Elbows back', anchor: 'elbow.r' },
      wrong: { text: 'Elbows forward', anchor: 'elbow.r' },
    },
    caption: {
      // D-TEXT-GOLDEN (copy lines are not printed): posture height (c3) moved here from the mistake line
      right: 'Arm behind the torso, elbow back. Curl only that high.',   // card zoom right (c4) + c3
      wrong: 'Elbow drifted forward past the torso line.',      // card zoom wrong (c4)
    },
    alt: {
      right: 'Side view, top of the curl on an incline bench. The upper arm hangs behind the torso, elbow pinned back.',
      wrong: 'Side view. The elbow has drifted forward past the torso line as the dumbbell rises.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const HANDS = ['hand-left', 'hand-right', 'hand-back-left', 'hand-back-right'];
const feel = {
  primary: [{ muscleId: 'biceps', plain: 'The biceps, at the front of the upper arm, is the main muscle worked.' }],
  secondary: [{ muscleId: 'forearms', plain: 'The forearm flexors help.' }],
  watch: [],
  // The card's first row (front of the upper arm, c7, c6) has no fix, so it is left off the rows (D-SHIP-Q16); the feel
  // line says it.
  feelLine: 'You should feel this in the front of your upper arm, from a stretched start.',
  rows: [
    { key: 'shoulder', where: 'Front of the shoulder', at: { muscles: ['front_delts'] },
      means: 'The bench is set too low.',
      fix: 'Raise the bench a bit.',
      redFlag: 'shoulder', claim: CL.c5 },
    { key: 'wrist', where: 'Wrist discomfort or pain', at: { parts: HANDS },
      means: 'Your wrists are bent up or down under load.',
      fix: "Stop and don't train through the pain. Keep the wrist straight.",
      zoom: 'hand', redFlag: true, claim: C(['MECH', 'CONSENSUS'], ['ace-seated-curl', 'sl-dbcurl', 'nhs-wrist-pain'], 'c11, c15') },
  ],
  claim: C(['CONSENSUS', 'DATA'], [SL, BB, 'oliveira-2009'], 'c10, c6, c7'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'wrists', title: 'Wrists bending under the dumbbells', zoom: 'hand', claim: CL.c11,
    fix: 'Keep the hand in line with the forearm.' },
  { key: 'elbows', title: 'Elbows drifting forward', zoom: 'incline-elbow', claim: C(['CONSENSUS'], [BB], 'c4, c3'),
    fix: 'Keep the elbows back. Stop the curl a little lower.' },
  { key: 'bench', title: 'Bench set too low', claim: CL.c5,
    fix: 'Raise it toward 45-65 degrees.' },
];
const RISKS = [
  { key: 'bench', text: 'Bench too low: tension moves to the front shoulder, which can cause discomfort.', claim: CL.c5 },
  { key: 'dropped', text: 'Across weight training, dropped weights are the most common way people get badly hurt.', claim: CL.c14 },
];

export default {
  schema: 1,
  id: 'lib_incline_dumbbell_curl',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: V.archetype,          // 'curl'
    orientation: 'supinated',        // c11: palms forward; the key's orientation 'under'
    handle: 'dumbbell',              // the key's HANDLE profile
    loadAxis: V.loadAxis,            // 'across'
    width: { text: 'Arms hanging straight down at your sides.', claim: CL.c2 },   // card grip.width
    thumb: { mode: RIGHT_POSE.thumb, claim: CL.c11 },   // 'wrapped' (c11; the key's right pose)
    contact: 'mid-palm',             // CONVENTION, data only: the key's contact 'mid' (ga:curl-mid, source hand-key-curl); the card gives none
    wrist: { ext: V.wristRange, limitText: 'Keep the hand in line with the forearm.',
      claim: C(['MECH', 'CONVENTION'], ['ace-seated-curl', 'sl-dbcurl', 'hand-key-curl'], 'c11. The ext range is the curl key\'s wristRange (ga:curl-mid), a convention, not a card number.') },
    pose: RIGHT_POSE,
    faults: FAULTS,
    gripLine: 'Closed grip, palms forward, thumbs wrapped round the handles.',   // c11; the wrist line is wrist.limitText (c11)
    cue: 'Elbows back, wrists straight.',   // c4, c11
  },
  contacts: ['seat-back'],
  setup: [
    { kind: 'adjust', text: 'Set the bench to about 45-65 degrees.', claim: CL.c1 },
    { kind: 'position', text: 'Sit with a dumbbell in each hand.', claim: CL.c1 },
    { kind: 'grip', text: 'Palms forward, thumbs wrapped round the handles.', zoom: 'hand', claim: CL.c11 },
    // D-TEXT-GOLDEN (copy lines are not printed): posture pad (c2, c11) moved here from the setup line
    { kind: 'position', text: 'Head, shoulders and buttocks on the pad, arms hanging straight down.',
      claim: C(['CONSENSUS', 'MECH'], [BB, SL, 'ace-seated-curl'], 'c2, c11') },
    { kind: 'safety', text: 'If your shoulder feels it, raise the bench a bit.', claim: CL.c5 },
  ],
  posture: [
    { key: 'pad', label: 'Back on bench', detail: 'Head, shoulders and buttocks stay on the bench.',
      anchor: { landmark: 'backUpper', pose: 'end' }, claim: C(['CONSENSUS', 'MECH'], [BB, SL, 'ace-seated-curl'], 'c2, c11') },
    { key: 'behind', label: 'Arms behind torso', detail: 'Arms stay behind the torso.',
      anchor: { landmark: 'elbow.r', pose: 'start' }, zoom: 'incline-elbow', claim: CL.c3 },
    { key: 'elbows', label: 'Elbows back', detail: 'Elbows pinned back, no forward drift.',
      anchor: { landmark: 'elbow.r', pose: 'end' }, zoom: 'incline-elbow', claim: CL.c4 },
    { key: 'wrists', label: 'Straight wrists', detail: 'Wrists stay straight.', anchor: { landmark: 'wrist.r', pose: 'end' }, zoom: 'hand', claim: CL.c11 },
    { key: 'height', label: 'Curl height', detail: 'Curl only as high as the elbows allow without moving.',
      anchor: { landmark: 'grip.r', pose: 'end' }, claim: CL.c3 },
  ],
  feel,
  zooms,
  chips: ['hand', 'incline-elbow', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    // D-TEXT-GOLDEN: posture pad (c2, c11)
    setupLine: 'Bench at about 45-65 degrees. Head, shoulders and buttocks on the bench, arms hanging straight down.',   // c1, c2, c11
    // D-TEXT-GOLDEN: posture height (c3)
    mistakeLine: 'Never let the elbows drift forward. Curl only as high as they stay back.',   // c4, c3
    cueLine: 'Elbows pinned back.',   // c4
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['shoulder', 'wrist'],   // the card's redFlags, in order
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/incline_dumbbell_curl.json', rev: 1 },
};
