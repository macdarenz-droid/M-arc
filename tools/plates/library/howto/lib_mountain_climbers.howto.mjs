// LIB-SHIP W2: the How-to content of lib_mountain_climbers (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/mountain_climbers.json (cited in its field's claim, cN = card claim id).
// Hand zoom (D-SHIP-GRIP case (a)): the card zoom `hand-under-shoulder` is drawn by the approved `palm-flat` key
// (tools/plates/library/hands/hand-palm-flat.mjs IDS.mountain_climbers: variant 'floor', orientation 'over'). The pose,
// fault, contact and thumb below are that key's recorded values, read from the key module so they cannot drift; the
// Right/Wrong notes are the pair panel's words (tools/plates/library/hands/words/palm-flat-floor-over.json). The card
// leaves grip.thumb and grip.handContact empty: both are the key's drawing, cited as CONVENTION (source
// hand-key-palm-flat), never DATA.
// Feel (W2 panel #6633524031, L4, as lib_plank): the card's only primary, `core` (c11), is drawn as Main on the abs and
// obliques, the belly the feel line names. C2 refuses `core` as a drawn muscle id (the map paints it on the serratus), so
// the two regions stand for it; abs leaves the secondary list for Main.
import plateSpec from '../specs/mountain_climbers.mjs';
import { RED_FLAG } from '../../layers/howto/shared.mjs';
export { RED_FLAG };

/* ---------------------------------------------------------------- sources (the card's sources) ------------------- */
export const SOURCES = {
  'hinge-mc': { cite: 'How to do mountain climbers: a Hinge Health guide', url: 'https://www.hingehealth.com/resources/articles/mountain-climbers/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'nance-2017': { cite: 'Dorsal Wrist Pain in the Extended Wrist-Loading Position: An MRI Study', url: 'https://pubmed.ncbi.nlm.nih.gov/29085728/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-22', use: 'DATA' },
  'lohre-mc': { cite: 'Mountain Climbers: Proper Form, Muscles Worked, and Reps (Julie Lohre, trainer)', url: 'https://julielohre.com/mountain-climbers/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'hl-mc': { cite: 'What Do Mountain Climbers Work? (Healthline; medically reviewed by a CPT)', url: 'https://www.healthline.com/health/fitness/what-do-mountain-climbers-work',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'nhs-wrist': { cite: 'NHS, Wrist pain', url: 'https://www.nhs.uk/symptoms/hand-pain/wrist-pain/',
    kind: 'guideline', access: 'full', checked: '2026-10-22', use: 'MECH' },
  // The palm-flat key's own source for the thumb and the hand contact (the card has neither): a drawing convention.
  'hand-key-palm-flat': { cite: 'LIB-12 hand pair key palm-flat (floor): whole hand down, thumb on the floor beside the index', url: 'tools/plates/library/hands/hand-palm-flat.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-04', use: 'CONVENTION' },
  // RED_FLAG's own source (layers/howto/shared.mjs), as golden B's machine_chest_press lists it: the card's redFlags 'wrist'.
  'nhs-wrist-pain': { cite: 'NHS, Wrist pain', url: 'https://www.nhs.uk/conditions/hand-pain/wrist-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When wrist pain needs a check.' },
};
// Not cited: c1 (definition), c8 (back rounding), c9 and c10 (easier and harder versions), c14 (strength and HIIT
// options), c17 (breathing), c20 (sagging hips); no field here restates them.

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const HG = 'hinge-mc', LO = 'lohre-mc', KEYSRC = 'hand-key-palm-flat';
const CL = {
  c2: C(['CONSENSUS'], [HG], 'card c2'),
  c3: C(['CONSENSUS'], [HG], 'card c3'),
  c4: C(['CONSENSUS'], [HG], 'card c4'),
  c5: C(['CONSENSUS'], [HG], 'card c5'),
  c6: C(['CONSENSUS'], [HG], 'card c6'),
  c7: C(['CONSENSUS'], [HG], 'card c7'),
  c11: C(['CONSENSUS'], [HG], 'card c11'),
  c12: C(['DATA', 'WEAK'], ['nance-2017'], 'card c12'),
  c13: C(['CONSENSUS'], [LO], 'card c13'),
  hike: C(['CONSENSUS'], ['hl-mc', LO], 'card c16, c18'),
  hipLine: C(['CONSENSUS'], [HG, 'hl-mc', LO], 'card c4, c3, c16'),
  ahead: C(['CONSENSUS'], [HG, LO], 'card c2, c6, c19'),
  wristRow: C(['DATA', 'WEAK', 'MECH', 'CONSENSUS'], ['nance-2017', 'nhs-wrist', LO, 'hl-mc'], 'card c12, c22, c21'),
  conv: C(['CONVENTION'], [KEYSRC], 'the palm-flat key\'s drawing (the card has no grip.thumb or grip.handContact)'),
};

/* ------------------------------------------------------------------------------------------------ hand ---------- */
// The key's record for this id and its variant (hand-palm-flat.mjs IDS.mountain_climbers, VARIANTS.floor). The palm-flat
// view draws its own pose ({ forearmTilt, cup }, view-palm-flat.mjs), not a radial HandPose; the key's render takes the
// Wrong as a whole pose, so each fault pose is the right pose with the fault's change merged over it.
// The key module is not imported: hand-palm-flat.mjs pulls view-common.mjs, which reads files outside the
// MANIFEST-locked trees (library-manifest closure). Its record is copied here and pinned against the live key by
// tests/howto/lib-ship.test.ts (D-SHIP-GRIP (a)).
const KEYED = { variant: 'floor', faults: ['cupped-palm', 'hand-ahead'] };   // IDS.mountain_climbers
const V = {                                                                 // VARIANTS.floor
  right: { forearmTilt: 0, cup: 0 }, contact: 'whole-hand', rightNote: 'Whole hand down', archetype: 'palm-flat', loadAxis: 'along-forearm',
  alt: 'Hand flat on the floor, palm and fingers down, forearm straight up over the wrist.',
  faults: { 'hand-ahead': { label: 'Hand ahead', pose: { forearmTilt: 25 }, markers: [], alt: 'Hand flat but ahead of the shoulder, forearm leaning back.' } },
};
const RIGHT_POSE = V.right;
// The key lists cupped-palm and hand-ahead for this id. Only hand-ahead is this card's zoom Wrong ("Hands ahead of the
// shoulders, weight shifted back", c6, c19); cupped-palm cites shared/palm-flat.json#c2, which this card has no claim
// for, so it is left out.
const CARD_FAULTS = ['hand-ahead'];
const FAULTS = KEYED.faults.filter(k => CARD_FAULTS.includes(k)).map(key => {
  const f = V.faults[key];
  return { key, label: f.label, pose: { ...RIGHT_POSE, ...f.pose }, markers: f.markers, alt: f.alt };
});
// CONVENTION (D-SHIP-GRIP (a)): the key's contact 'whole-hand' (VARIANTS.floor.contact) is the HandContact 'palm-flat'
// (src/howto/content-types.ts); the map turns the key's word into the enum, and an unmapped word throws.
const CONTACT_OF_KEY = { 'whole-hand': 'palm-flat' };
const CONTACT = CONTACT_OF_KEY[V.contact];
// CONVENTION (D-SHIP-GRIP (a)): the key's drawing lays the thumb on the floor beside the index, on the fingers' side
// (view-palm-flat.mjs:52); ThumbMode 'beside' is that thumb (layers/engine/hand.mjs:142: laid along the index).
const THUMB = 'beside';
if (!CONTACT || FAULTS.length !== CARD_FAULTS.length) throw new Error('lib_mountain_climbers: the palm-flat key no longer records this sheet\'s contact or fault');

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: the end (one knee driven toward the chest, c4) and the spec's Mistake pose (hips hike
// as the knee drives; card plate.mistake, c4). The card zoom hip-line Wrong ("Hips hiked up as the knee drives") is the
// plate's drawn fault, so no drawing value is added.
const MIS = plateSpec.mistake.pose;
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: plateSpec.poses.end },
  hike: { pose: { ...plateSpec.poses.end, ...MIS } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom, same kinds; the hand zoom's key is 'hand' (golden B's chip rule). The posture zoom is in the zoom
// shell's shape (callout with an anchor at the landmark it names, no guide mark; pilot-a.closeups.mjs).
const zooms = [
  {
    key: 'hand', chip: 'Hands', heading: 'Hand position', kind: 'hand',   // card zoom key: hand-under-shoulder
    hand: {
      right: RIGHT_POSE,
      wrong: FAULTS,                // handling.faults (golden B's shape: fault objects)
      camera: 'side',               // the key's render camera (hand-palm-flat.mjs render)
      panelHeight: 170,             // the key's render default (hand-palm-flat.mjs render: spec.panelHeight ?? 170)
      // W2 panel (#6633524031): only card claims print. Right: the card's grip.type and zoom right ("Palm flat", c2);
      // Wrong: the card's zoom wrong ("Hands ahead of the shoulders", c6, c19). The key's rightNote ('Whole hand down')
      // stays data (V.rightNote) and is not printed from here.
      notes: { right: 'Palm flat', wrong: 'Hands ahead' },
    },
    caption: {
      right: 'Palm flat, hand directly under the shoulder.',
      wrong: 'Hands ahead of the shoulders, weight shifted back.',
    },
    // W2 panel (#6633524031): the card's zoom words only (c2; c6, c19), not the key's alt (a convention).
    alt: { right: 'Palm flat on the floor, hand directly under the shoulder, arm straight.',
      wrong: 'Hand ahead of the shoulder, weight shifted back.' },
  },
  {
    key: 'hip-line', chip: 'Hip line', heading: 'Hip line', kind: 'posture',
    // zoom shell (render/closeup/crop.mjs): crop centre on the right pose's buttock for both halves; the Wrong is the
    // spec's Mistake dashed over the end pose, as `stills.hike`.
    crop: { center: { at: 'buttock', pose: 'right', off: [0, -10] }, sizePx: 170 },
    right: 'end',
    wrong: { base: 'end', pose: MIS },
    callout: {
      right: { text: 'Hips level', anchor: 'buttock' },
      wrong: { text: 'Hips hiked', anchor: { at: 'buttock', pose: 'mistake' } },
    },
    caption: {
      right: 'Hips level with the head-to-heel line.',
      wrong: 'Hips hiked up as the knee drives.',
    },
    alt: {
      right: 'Side view, high plank, one knee driven toward the chest. Hips stay on the line from head to heels.',
      wrong: 'Side view, one knee driven toward the chest. The hips hike up above the line from head to heels.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const HANDS = ['hand-left', 'hand-right', 'hand-back-left', 'hand-back-right'];
const feel = {
  primary: [   // the card's primary core (c11), drawn on the belly (header note)
    { muscleId: 'abs', plain: 'The front of the belly works.', claim: CL.c11 },
    { muscleId: 'obliques', plain: 'The sides of the belly work.', claim: CL.c11 },
  ],
  secondary: [
    { muscleId: 'hip_flexors', plain: 'The hip flexors lift the legs.', claim: CL.c11 },
  ],
  watch: [],
  feelLine: 'You should feel this in your belly, shoulders, arms and the front of your hips.',
  rows: [
    // The card's first two rows (belly, shoulders and arms; front of the hips) have no fix, so they are left out: the
    // feel line says them (D-SHIP-Q16).
    { key: 'wrist', where: 'Back-of-wrist pain', at: { parts: HANDS },
      means: 'Your weight loads the wrist bent back.',   // c12: planks and push-ups load the wrist bent back
      fix: 'Stop the exercise. Hands on a bench, or dumbbells to keep the wrists neutral.',
      redFlag: true, claim: CL.wristRow },
  ],
  claim: CL.c11,
};

/* ------------------------------------------------------------------------------------------------ mistakes, risks */
const MISTAKES = [
  { key: 'hike', title: 'Hips hike up', zoom: 'hip-line', claim: CL.hike,
    fix: 'Keep your hips level and slow down.' },
  { key: 'weight-back', title: 'Weight shifts back', zoom: 'hand', claim: CL.c6,
    fix: 'Shoulders over wrists, press slightly forward.' },
  { key: 'bounce', title: 'Bouncing on the toes', claim: CL.c7,
    fix: 'Glide the knees forward with smooth steps.' },
];
const RISKS = [
  { key: 'wrist', text: 'Pain on the back of the wrist in the loaded, bent-back position.', claim: CL.c12 },
  { key: 'bounce', text: 'Bouncing on your toes can add impact and make control harder.', claim: CL.c7 },
];

export default {
  schema: 1,
  id: 'lib_mountain_climbers',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: V.archetype,          // 'palm-flat'
    orientation: 'pronated',         // palms down on the floor; the key's orientation 'over'
    handle: 'floor',                 // the key has no HANDLE: the hand lies on the floor
    loadAxis: V.loadAxis,            // 'along-forearm'
    width: { text: 'Hands directly under the shoulders.', claim: CL.c2 },
    thumb: { mode: THUMB, claim: CL.conv },   // CONVENTION: the key's drawn thumb (above); the card gives none
    contact: CONTACT,                // 'palm-flat', CONVENTION: the key's contact 'whole-hand' (above); the card gives none
    // The key records no wrist range (VARIANTS.floor.wristRange null): the flat palm loads the wrist bent back (c12).
    wrist: { exempt: 'Palm flat on the floor: the wrist is bent back under body weight.', claim: CL.c12 },
    pose: RIGHT_POSE,
    faults: FAULTS,
    gripLine: 'Hands flat on the floor, directly under your shoulders. Arms straight.',
    cue: 'Shoulders over wrists.',
  },
  contacts: ['floor-body'],
  setup: [
    { kind: 'position', text: 'Start on hands and knees, arms straight, hands under your shoulders.', zoom: 'hand', claim: CL.c2 },
    { kind: 'position', text: 'Step your legs back onto your toes. Body in one straight line.', claim: CL.c3 },
    { kind: 'position', text: 'Bring one foot toward your chest, then switch legs quickly.', zoom: 'hip-line', claim: CL.c4 },
    { kind: 'position', text: 'Keep the plank position the whole time.', claim: CL.c5 },
    { kind: 'load', text: 'Start with 2 to 3 sets of 15 seconds on, 15 off.', claim: CL.c13 },
  ],
  posture: [
    { key: 'hands', label: 'Hands under shoulders', detail: 'Hands under shoulders, arms straight.',
      anchor: { landmark: 'wrist.r', pose: 'start' }, zoom: 'hand', claim: CL.c2 },
    { key: 'line', label: 'Straight line', detail: 'Straight line from head to heels.',
      anchor: { landmark: 'backMid', pose: 'start' }, claim: CL.c3 },
    { key: 'hips', label: 'Hips level', detail: "Hips don't hike up.",
      anchor: { landmark: 'buttock', pose: 'end' }, zoom: 'hip-line', claim: CL.hipLine },
    { key: 'stack', label: 'Shoulders over wrists', detail: 'Shoulders stay over the wrists.',
      anchor: { landmark: 'shoulder.r', pose: 'end' }, zoom: 'hand', claim: CL.ahead },
  ],
  feel,
  zooms,
  chips: ['hand', 'hip-line', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'Hands under your shoulders, arms straight. Body in one straight line from head to heels.',
    mistakeLine: 'Keep your hips level as the legs switch. Slow down if they hike.',
    cueLine: 'Hips level, shoulders over wrists.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['wrist'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/mountain_climbers.json', rev: 1 },
};
