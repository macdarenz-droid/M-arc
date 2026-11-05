// LIB-SHIP W5: the How-to content of lib_reverse_curl (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs; the form of lib_dumbbell_biceps_curl.howto.mjs). Every
// shown string restates a claim of the verified card docs/research/howto/cards/reverse_curl.json; its claim ids are
// named on each field's claim.
// Hand zoom (D-SHIP-GRIP case (a)): the card zoom `reverse-wrist` is drawn by the approved `ez` pair key
// (tools/plates/library/hands/hand-ez.mjs IDS.reverse_curl: variant 'curl', orientation 'over', faults bent-back then
// curled). The pose, faults, contact and wrist range below are that key's recorded values, read from the key module so
// they cannot drift; the Right/Wrong notes are the pair panel's words (tools/plates/library/hands/words/ez-curl-over.json).
// The card leaves grip.thumb and grip.handContact empty: the thumb is the key's right-pose thumb and the contact the key's
// convention 'ga:curl-mid' (hands/pairs.mjs CONVENTIONS), both cited as CONVENTION, data only: never printed in any
// string (D-SHIP-CONVCOPY).
// Red flags: the card's redFlags (wrist, elbow), golden B's shared blocks, each linked by its feel row.
// Variant line (D-LIB5-VARIANT): exercises.json lists 'EZ Bar / Barbell'; the card's plate.variantLine: the plate draws
// the EZ bar and the straight-bar guidance (c1, c3, c4) applies to both.
// Library diff (card libraryDiff): the biceps move from secondary to primary (c10, c12); the brachialis is text-only.
// No parent.
import plateSpec from '../specs/reverse_curl.mjs';
import { IDS, VARIANTS, HANDLE } from '../hands/hand-ez.mjs';
import { RED_FLAG, RED_FLAG_ELBOW } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_ELBOW };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'sl-revcurl': { cite: 'How to Do Reverse Barbell Curl: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/reverse-barbell-curl/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'ace-revcurl': { cite: 'Reverse Bicep Curl (ACE Exercise Library)', url: 'https://www.acefitness.org/resources/everyone/exercise-library/310/reverse-bicep-curl/',
    kind: 'guideline', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'tg-revcurl': { cite: 'Reverse curls: how to do them, and the benefits for bulking your biceps (Tom\'s Guide)', url: 'https://www.tomsguide.com/wellness/fitness/reverse-curls-how-to-do-them-and-the-benefits-for-bulking-your-biceps',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'caufriez-2018': { cite: 'The Role of the Muscle Brachioradialis in Elbow Flexion: An Electromyographic Study', url: 'https://pubmed.ncbi.nlm.nih.gov/29409427/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-22', use: 'DATA' },
  'coratella-2023': { cite: 'Biceps Brachii and Brachioradialis Excitation in Biceps Curl Exercise: Different Handgrips, Different Synergy', url: 'https://pubmed.ncbi.nlm.nih.gov/36976950/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-22', use: 'DATA' },
  'acsm-2009': { cite: 'American College of Sports Medicine position stand. Progression models in resistance training for healthy adults', url: 'https://pubmed.ncbi.nlm.nih.gov/19204579/',
    kind: 'guideline', access: 'abstract', checked: '2026-10-22', use: 'CONSENSUS' },
  // The ez key's own source for the thumb and the hand contact (the card has neither): drawing conventions.
  'hand-key-ez': { cite: 'LIB-7 hand pair key ez (curl): right-pose thumb wrapped; CONVENTIONS ga:curl-mid, across the middle of the palm', url: 'tools/plates/library/hands/hand-ez.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-05', use: 'CONVENTION' },
  // The shared boxes' own sources (layers/howto/shared.mjs): the card's redFlags 'wrist', 'elbow'.
  'nhs-wrist-pain': { cite: 'NHS, Wrist pain', url: 'https://www.nhs.uk/conditions/hand-pain/wrist-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When wrist pain needs a check.' },
  'nhs-elbow-pain': { cite: 'NHS, Elbow and arm pain', url: 'https://www.nhs.uk/symptoms/elbow-and-arm-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When elbow pain needs a check.' },
};
// Not cited: c9 (EZ bar joint comfort, WEAK), c14 (load progression), c15 (tempo, a plate drawing convention).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const SL = 'sl-revcurl', ACE = 'ace-revcurl', TG = 'tg-revcurl';
const CL = {
  c1: C(['CONSENSUS'], [SL, ACE], 'c1'),
  c2: C(['CONSENSUS'], [TG], 'c2'),
  c3: C(['CONSENSUS'], [ACE, SL], 'c3'),
  c4: C(['CONSENSUS'], [SL], 'c4'),
  c5: C(['CONSENSUS'], [TG], 'c5'),
  c6: C(['CONSENSUS'], [TG], 'c6'),
  c7: C(['CONSENSUS'], [TG], 'c7'),
  c8: C(['CONSENSUS'], [TG], 'c8'),
  c13: C(['CONSENSUS'], [SL, TG], 'c13'),
  palms: C(['CONSENSUS'], [SL, ACE], 'c1, c3'),
  tall: C(['CONSENSUS'], [TG], 'c8, c2'),
  zoom: C(['CONSENSUS'], [TG, SL], 'c5, c4'),
  joints: C(['CONSENSUS'], [TG, SL], 'c5, c13'),
  variant: C(['CONSENSUS'], [SL, ACE], 'card plate.variantLine: c1, c3, c4 hold for both bars'),
  feel: C(['CONSENSUS', 'DATA'], [SL, TG, 'caufriez-2018'], 'c12, c10'),
  // card grip.thumb is empty: the ez key's right-pose thumb (radial-rules.mjs curlVariant), data only, never printed.
  thumb: C(['CONVENTION'], ['hand-key-ez'], 'card grip.thumb is empty: the ez key\'s right-pose thumb, a convention, never shown.'),
};

/* ------------------------------------------------------------------------------------------------ hand ---------- */
// The key's record for this id and its variant (hand-ez.mjs, radial-rules.mjs curlVariant).
const KEYED = IDS.reverse_curl, V = VARIANTS[KEYED.variant];
const RIGHT_POSE = V.right;
// CONVENTION (D-SHIP-GRIP (a), source hand-key-ez): the key's contact 'mid' (ga:curl-mid) as HandContact. Data only.
const CONTACT = { mid: 'mid-palm' }[V.contact];
if (!CONTACT) throw new Error(`lib_reverse_curl: the ez key's contact ${V.contact} has no HandContact`);
const FAULTS = KEYED.faults.map(key => {
  const f = V.faults[key];
  // HandFault.pose.wrist needs dev: the key's fault sets ext only and the engine merges it over the right pose
  // (render/closeup/common.mjs mergePose), so dev is the right pose's own value (0), written out for the type.
  return { key, label: f.label, pose: { ...f.pose, wrist: { dev: RIGHT_POSE.wrist.dev, ...f.pose.wrist } }, markers: f.markers, alt: f.alt };
});

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses. 'swing' is the spec's Mistake (the CURL template's `swing` builder: card
// plate.mistake c5 and card zoom curl-elbow Wrong "Arms swinging, using momentum to get the bar up."), merged over the
// end pose as the engine draws it. No new drawing value: the plate's own Mistake.
const MIS = plateSpec.mistake.pose;
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: plateSpec.poses.end },
  swing: { pose: { ...plateSpec.poses.end, ...MIS } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom, same kinds; the hand zoom's key is 'hand' (golden B's chip rule). The posture zoom is in the zoom
// shell's shape (callout with an anchor at the landmark it names, no guide mark; pilot-a.closeups.mjs).
const zooms = [
  {
    key: 'hand', chip: 'Wrist', heading: 'Wrist position', kind: 'hand',   // card zoom key: reverse-wrist
    hand: {
      right: RIGHT_POSE,
      wrong: FAULTS,                // handling.faults (golden B's shape: fault objects); the pair pages them in this order
      camera: 'side',               // the pair's camera (pairs.mjs pairSpec)
      panelHeight: V.panelHeight,
      // The pair key's own panel words (words/ez-curl-over.json, first page bent-back), drawn by the key.
      notes: { right: 'Middle of palm', wrong: 'Wrist bent back' },
    },
    caption: {
      right: 'Overhand grip, hand in line with the forearm.',      // card zoom right (c6)
      wrong: 'Wrist bent back or curled toward the forearm.',      // the key's two drawn faults; c6 (hand out of line)
    },
    // Right: the card's own words (c1, c6), no thumb or contact (D-SHIP-CONVCOPY); Wrong: the key's alt.
    alt: { right: 'Bar held overhand, palm down. A straight line from the hand to the elbow.', wrong: FAULTS[0].alt },
    feelRow: 'wrist',
  },
  {
    key: 'curl-elbow', chip: 'Arms', heading: 'Upper arms', kind: 'posture',
    // zoom shell (render/closeup/crop.mjs): crop centre on the right pose's elbow for both halves; the Wrong is the
    // spec's Mistake (the body swing) drawn alone (solid), as `stills.swing`.
    crop: { center: { at: 'elbow.r', pose: 'right', off: [0, -10] }, sizePx: 170 },
    right: 'end',
    wrong: { base: 'end', pose: MIS, solid: true },
    callout: {
      right: { text: 'Arm at side', anchor: 'elbow.r' },
      wrong: { text: 'Arms swinging', anchor: 'elbow.r' },
    },
    caption: {
      right: 'Upper arm by the side at the top.',                    // card zoom right (c4)
      wrong: 'Arms swinging, using momentum to get the bar up.',     // card zoom wrong (c5)
    },
    alt: {
      right: 'Side view, top of the curl. The upper arm hangs straight down by the side, the bar near the shoulder.',
      wrong: 'Side view. The body rocks back and the upper arms swing forward to heave the bar up.',
    },
    feelRow: 'joints',
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [
    { muscleId: 'forearms', plain: 'The forearm muscles work hard with the overhand grip.' },
    { muscleId: 'biceps', plain: 'The biceps and brachialis also stay very active palms down.' },
  ],
  secondary: [],   // the card names none (its libraryDiff: biceps move to primary, brachialis text-only)
  watch: [{ muscleId: 'front_delts', plain: 'The front shoulder works more palms down than palms up.' }],   // c11
  // The card's first two rows (top of the forearm, front of the upper arm) have no fix, so they are left out: the feel
  // line says them (D-SHIP-Q16).
  feelLine: 'You should feel this in your forearms and the front of your upper arms.',
  rows: [
    { key: 'wrist', where: 'Wrist', at: { parts: ['hand-left', 'hand-right', 'hand-back-left', 'hand-back-right'] },
      means: 'Your wrist is bending.',
      fix: 'Keep a straight line from hands to elbows.',
      zoom: 'hand', redFlag: true, claim: CL.c6 },
    { key: 'joints', where: 'Joints', at: { parts: ['elbow-left', 'elbow-right'] },
      means: 'You swing the bar up with momentum.',
      fix: 'Go lighter and slow down.',
      zoom: 'curl-elbow', redFlag: 'elbow', claim: CL.joints },
  ],
  libraryDiff: { add: ['biceps'], why: 'The biceps stay very active palms down and are listed as primary (card c10, c12).' },
  claim: CL.feel,
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'swing', title: 'Swinging to move the bar', zoom: 'curl-elbow', claim: CL.c5,
    fix: 'Go lighter and control both the lift and the lowering.' },
  { key: 'wrists', title: 'Wrists bending under the bar', zoom: 'hand', claim: CL.c6,
    fix: 'Keep a straight line from hands to elbows.' },
  { key: 'flare', title: 'Elbows flaring outward', claim: CL.c7,
    fix: 'Reduce the weight. Keep the elbows close to your ribs.' },
];
const RISKS = [
  { key: 'swing', text: 'Swinging a weight above your ability could hurt your joints.', claim: CL.c5 },
  { key: 'wrist', text: 'Bent wrists add strain to the wrists.', claim: CL.c6 },
];

export default {
  schema: 1,
  id: 'lib_reverse_curl',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: V.archetype,          // 'curl'
    orientation: 'pronated',         // c1: overhand, palms down; the key's orientation 'over'
    handle: V.handle?.profile ?? HANDLE.profile,   // the ez key's HANDLE: 'ez-bend' (the plate's EZ bar)
    loadAxis: V.loadAxis,            // 'across'
    width: { text: 'Hands about shoulder-width, in line with your shoulders and elbows.', claim: CL.c1 },
    thumb: { mode: RIGHT_POSE.thumb, claim: CL.thumb },   // CONVENTION: the key's right-pose thumb ('wrapped'); never printed
    contact: CONTACT,                // CONVENTION: 'mid-palm' from the key's ga:curl-mid (source hand-key-ez); never printed
    wrist: { ext: V.wristRange, limitText: 'Keep a straight line from your hands to your elbows.',
      claim: C(['CONSENSUS', 'CONVENTION'], [TG, 'hand-key-ez'], 'c6. The ext range is the ez key\'s wristRange (ga:curl-mid), a convention, not a card number.') },
    pose: RIGHT_POSE,
    faults: FAULTS,
    gripLine: 'Overhand grip, palms down, hands about shoulder-width. Keep a straight line from hands to elbows.',   // c1, c6
    cue: 'Straight line, hands to elbows.',   // c6
  },
  contacts: ['standing-feet'],
  setup: [
    { kind: 'load', text: 'Start light. Add weight as you get stronger.', claim: CL.c5 },
    { kind: 'position', text: 'Stand with feet hip- to shoulder-width, knees soft.', claim: CL.c2 },
    { kind: 'grip', text: 'Grip the bar overhand, hands about shoulder-width.', zoom: 'hand', claim: CL.c1 },
    { kind: 'brace', text: 'Stand tall, no arching. Shoulders back and down, chin slightly tucked.', claim: CL.tall },   // D-TEXT-GOLDEN: posture tall (c8)
    { kind: 'finish', text: 'Lower the bar slowly, keeping tension at the bottom.', claim: CL.c13 },   // D-TEXT-GOLDEN: posture tension (c13)
  ],
  posture: [
    { key: 'palms', label: 'Palms down', detail: 'Overhand grip about shoulder-width, kept all the way up.',
      anchor: { landmark: 'grip.r', pose: 'end' }, zoom: 'hand', claim: CL.palms },
    { key: 'elbows', label: 'Elbows at sides', detail: 'Elbows stay close to the sides.',
      anchor: { landmark: 'elbow.r', pose: 'end' }, claim: CL.c3 },
    { key: 'upper-arm', label: 'Never back', detail: 'Upper arms never travel back.',
      anchor: { landmark: 'shoulder.r', pose: 'end' }, zoom: 'curl-elbow', claim: CL.c4 },
    { key: 'wrists', label: 'Straight wrists', detail: 'A straight line from hands to elbows.',
      anchor: { landmark: 'wrist.r', pose: 'end' }, zoom: 'hand', claim: CL.c6 },
    { key: 'tall', label: 'Stand tall', detail: 'Stand tall. No arching the back.', anchor: { landmark: 'backUpper', pose: 'end' }, claim: CL.c8 },
    { key: 'tension', label: 'Tension at bottom', detail: 'Keep tension at the bottom.', anchor: { landmark: 'grip.r', pose: 'start' }, claim: CL.c13 },
  ],
  feel,
  zooms,
  chips: ['hand', 'curl-elbow', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'Stand tall, knees soft, shoulders back and down. Grip the bar overhand, elbows close to your sides.',
    // D-TEXT-GOLDEN: posture upper-arm (c4) in the mistake line.
    mistakeLine: 'Never let your upper arms travel back. Go lighter instead of swinging.',
    cueLine: 'Elbows close to your ribs.',
    // D-LIB5-VARIANT: the card's plate.variantLine: c1, c3, c4 hold for the straight bar too.
    variantLine: 'The same form works with a straight bar.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['wrist', 'elbow'],   // the card's redFlags, in its order
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/reverse_curl.json', rev: 1 },
};
