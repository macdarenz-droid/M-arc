// LIB-SHIP W3: the How-to content of lib_close_grip_pulldown (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/close_grip_pulldown.json; its claim ids are named on each field's claim.
// Hand zoom (D-SHIP-GRIP case (a)): the card zoom `hand` is drawn by the approved `v-handle` key
// (tools/plates/library/hands/hand-v-handle.mjs:15 IDS.close_grip_pulldown: variant 'pull', orientation
// 'neutral-overhead', faults ['curled']; the variant is radial-rules.mjs:45-56 pullVariant with the 30 mm v-handle).
// The key module is not imported (MANIFEST closure, W2 form): its record is copied below as literals. The card's
// grip.handContact is an LR-4 drawing convention, so the contact is the key's 'ga:pull-base' (hands/pairs.mjs
// CONVENTIONS), cited CONVENTION (source hand-key-v-handle), never DATA.
// Inherited (D-LIB9a-MAP, family.mjs INHERIT_MAP lib_close_grip_pulldown): zooms[key=pad] is lat_pulldown's pad zoom,
// leaf for leaf (tools/plates/layers/exercises/lat_pulldown.howto.mjs:273-293). Its world points (the Wrong root and
// the Wrong callout anchor) are lat_pulldown's numbers, copied as the family check requires; Q-W3-3 (#383 6630932862):
// the crop is cut from this row's own plate, and each anchor's px offset against this plate's joint is measured and
// listed at the layers page (re-anchored if over 2 px, by ruling).
// Red flags: the card's redFlags (shoulder): golden B's shared shoulder block, linked by the shoulder feel row.
// Variant line (D-LIB5-VARIANT): equipment 'Cable / Machine'; the card's plate.variantLine draws the V-handle only.
import plateSpec from '../specs/close_grip_pulldown.mjs';
import { RED_FLAG, RED_FLAG_SHOULDER } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_SHOULDER };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'ace-lat-pulldown': { cite: 'Seated Lat Pulldown (ACE Exercise Library)', url: 'https://www.acefitness.org/resources/everyone/exercise-library/158/seated-lat-pulldown/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'MECH' },
  'andersen-2014': { cite: 'Effects of grip width on muscle strength and activation in the lat pull-down (Andersen et al., J Strength Cond Res)', url: 'https://pubmed.ncbi.nlm.nih.gov/24662157/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'MECH' },
  'odriscoll-1992': { cite: 'The relationship between wrist position, grasp size, and grip strength (O\'Driscoll et al., J Hand Surg Am)', url: 'https://pubmed.ncbi.nlm.nih.gov/1538102/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'MECH' },
  'puregym-close-grip-lat-pulldown': { cite: 'Close Grip Lat Pulldown (PureGym exercise guide)', url: 'https://www.puregym.com/exercises/back/lat-exercises/close-grip-lat-pulldown/',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'signorile-2002': { cite: 'A comparative electromyographical investigation of muscle utilization patterns using various hand positions during the lat pull-down (Signorile, Zink, Szwed, J Strength Cond Res)', url: 'https://pubmed.ncbi.nlm.nih.gov/12423182/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'WEAK' },
  'strengthlog-neutral-close-grip-lat-pulldown': { cite: 'How to Do Neutral Close-Grip Lat Pulldown: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/neutral-close-grip-lat-pulldown/',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'hk-baechle-grip': { cite: 'Grip selection and location, excerpt from Weight Training: Steps to Success, 5th ed. (Baechle and Earle, Human Kinetics)', url: 'https://us.humankinetics.com/blogs/excerpt/grip-selection-and-location',
    kind: 'textbook', access: 'full', checked: '2026-10-18', use: 'MECH' },
  // The v-handle key's own source for the hand contact (the card's grip.handContact is a drawing convention).
  'hand-key-v-handle': { cite: 'LIB-7c hand pair key v-handle (pull), CONVENTIONS ga:pull-base: base of the fingers and top edge of the palm', url: 'tools/plates/library/hands/hand-v-handle.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-04', use: 'CONVENTION' },
  // RED_FLAG's own source (layers/howto/shared.mjs), as golden B's machine_chest_press lists it.
  'nhs-wrist-pain': { cite: 'NHS, Wrist pain', url: 'https://www.nhs.uk/conditions/hand-pain/wrist-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When wrist pain needs a check.' },
  // RED_FLAG_SHOULDER's own source (layers/howto/shared.mjs): the card's redFlags 'shoulder'.
  'nhs-shoulder-pain': { cite: 'NHS, Shoulder pain', url: 'https://www.nhs.uk/conditions/shoulder-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When shoulder pain needs a check.' },
};
// Not cited: c10 (tempo, plate only), c13 (no field restates it).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const PG = 'puregym-close-grip-lat-pulldown', ACE = 'ace-lat-pulldown', KEYSRC = 'hand-key-v-handle';
const CL = {
  c1: C(['CONSENSUS'], [PG, 'strengthlog-neutral-close-grip-lat-pulldown'], 'c1'),
  c2: C(['CONSENSUS'], [PG], 'c2'),
  c3: C(['MECH'], [ACE], 'c3'),
  c4: C(['MECH'], [ACE], 'c4'),
  c5: C(['CONSENSUS'], [PG], 'c5'),
  c6: C(['CONSENSUS'], [PG], 'c6'),
  c7: C(['MECH'], [ACE], 'c7'),
  c8: C(['CONSENSUS'], [PG], 'c8'),
  c9: C(['MECH'], [ACE], 'c9'),
  c15: C(['MECH'], ['odriscoll-1992'], 'c15'),
  c16: C(['CONSENSUS', 'MECH'], ['hk-baechle-grip'], 'c16'),
  low: C(['CONSENSUS', 'MECH'], [PG, ACE], 'c6, c7, c5'),
  conv: C(['CONVENTION'], [KEYSRC], 'card grip.handContact is an LR-4 drawing convention; the v-handle key\'s ga:pull-base, never shown as a claim'),
};

/* ------------------------------------------------------------------------------------------------ hand ---------- */
// The key's record for this id and its variant, copied as literals (hand-v-handle.mjs:15, radial-rules.mjs:45-56).
const KEYED = { variant: 'pull', orientation: 'neutral-overhead', faults: ['curled'] };   // IDS.close_grip_pulldown
const V = {                                                                                 // VARIANTS.pull
  contact: 'base', rightNote: 'Base of fingers', wristRange: [0, 25],
  right: { view: 'radial', forearm: 180, wrist: { ext: 5, dev: 0 }, contactAt: 1.0, fingers: { curl: 1 }, thumb: 'wrapped', squeeze: 'firm', load: { kind: 'pull' } },
  alt: 'Handle across the base of the fingers, thumb wrapped, back of the hand in line with the forearm.',
  faults: { curled: { label: 'Wrist curled', pose: { wrist: { ext: -30 } }, markers: ['lever-arc'], alt: 'Wrist curled forward toward the forearm.' } },
};
const RIGHT_POSE = V.right;
const FAULTS = KEYED.faults.map(key => {
  const f = V.faults[key];
  // HandFault.pose.wrist needs dev: the key's fault sets ext only and the engine merges it over the right pose
  // (render/closeup/common.mjs mergePose), so dev is the right pose's own value (0), written out for the type.
  return { key, label: f.label, pose: { ...f.pose, wrist: { dev: RIGHT_POSE.wrist.dev, ...f.pose.wrist } }, markers: f.markers, alt: f.alt };
});
// CONVENTION (D-SHIP-GRIP (a)): the key's contact 'base' (ga:pull-base) is the HandContact 'finger-base'.
const CONTACT = { base: 'finger-base' }[V.contact];

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: the end (handle just below the chin, upper arms tucked; c5) and the spec's Mistake
// pose merged over it, as the engine draws it (handle pulled past the chin, elbows behind; card plate.mistake, c6, c7).
// The card zoom `bottom position` Wrong is that drawn fault, so no drawing value is added.
const MIS = plateSpec.mistake.pose;
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: plateSpec.poses.end },
  low: { pose: { ...plateSpec.poses.end, ...MIS } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
const zooms = [
  {
    key: 'hand', chip: 'Hand', heading: 'Hand position', kind: 'hand',   // card zoom key: hand
    hand: {
      right: RIGHT_POSE,
      wrong: FAULTS,
      camera: 'side',               // the key's camera for 'neutral-overhead' (hand-v-handle.mjs ORIENTATIONS)
      // CONVENTION (D-SHIP-GRIP (a)): 'Base of fingers' is the key's rightNote (words/v-handle-pull-neutral-overhead.json)
      notes: { right: V.rightNote, wrong: FAULTS[0].label },
    },
    caption: {
      right: 'Neutral grip on the V-handle, wrists not curled.',
      wrong: 'Wrists curled forward.',
    },
    // the key's alt (radial-rules.mjs pullVariant), split in two sentences
    // CONVENTION (D-SHIP-GRIP (a)): the contact in this alt is the key's ga:pull-base, source hand-key-v-handle.
    alt: { right: 'Handle across the base of the fingers, thumb wrapped. Back of the hand in line with the forearm.', wrong: FAULTS[0].alt },
  },
  {
    key: 'bottom', chip: 'Bottom', heading: 'Bottom position', kind: 'posture',   // card zoom key: bottom position
    // zoom shell (render/closeup/crop.mjs): crop centre on the right pose's elbow for both halves; the Wrong is the
    // spec's Mistake dashed over the end pose, as `stills.low`.
    crop: { center: { at: 'elbow.r', pose: 'right', off: [0, -10] }, sizePx: 170 },
    right: 'end',
    wrong: { base: 'end', pose: MIS },
    callout: {
      right: { text: 'Elbows to hips', anchor: 'elbow.r' },
      wrong: { text: 'Elbows behind', anchor: { at: 'elbow.r', pose: 'mistake' } },
    },
    caption: {
      right: 'Handle just below the chin, upper arms tucked.',
      wrong: 'Handle past the chin, elbows moving back.',
    },
    alt: {
      right: 'Side view, seated. The V-handle is just below the chin. Upper arms tucked at the sides, elbows pointing down.',
      wrong: 'Side view. The handle is pulled past the chin and the elbows move back behind the body.',
    },
    feelRow: 'shoulder',
  },
  // D-LIB9a-MAP inherit: lat_pulldown's pad zoom, leaf for leaf (lat_pulldown.howto.mjs:273-293). The two world points
  // are lat_pulldown's own numbers (its HIPS_UP root and PAD_GAP), written out so the family check sees equal leaves.
  {
    key: 'pad', chip: 'Knee pad', heading: 'Knee pad: right and wrong', kind: 'posture',
    crop: { center: { at: 'thighTop.r', off: [-8, 12] }, sizePx: 140 },
    right: 'end',
    wrong: { base: 'end', pose: { root: { at: [0, 0.5772146132970393, 0.027283355026593428] } }, parts: ['trunk', 'leg.r', 'leg.l'], equipment: { kneePad: { dy: 0.06 } } },
    guides: [{ kind: 'drop', from: { at: 'seat', off: [14, 0] }, to: { at: 'seat', pose: 'mistake', off: [14, 0] } }],
    callout: {
      right: { text: 'Pad<br>on thighs', anchor: { at: 'thighTop.r', off: [0, -1] } },
      wrong: { text: 'Pad<br>too high', anchor: { at: [0, 0.5647817206547646, 0.38121249356203657], off: [0, 1] }, prefer: 'right' },
    },
    caption: { right: 'Pad firm on the thighs, hips down.',
      wrong: 'Pad too high, hips lifting.' },
    alt: {
      right: 'Side view of the thighs, knee pad and seat. The pad presses on the tops of the thighs, just above the knees. Feet flat, hips down on the seat.',
      wrong: 'The pad set too high, with a gap above the thighs. The hips lift off the seat as the handle comes down. Drawn dashed over the right position.',
    },
    // Q-W3-8 (#383 6631278086): feelRow and feelPrompt are not compared; this card dropped the low-back row, so no feel link.
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [
    { muscleId: 'lats', plain: 'The lats do most of the work.' },
  ],
  secondary: [
    { muscleId: 'biceps', plain: 'The biceps help bend the elbows.' },
    { muscleId: 'mid_back', plain: 'The middle-back muscles help pull.' },
    { muscleId: 'rear_delts', plain: 'The rear delts help a little.' },
  ],
  watch: [
    { muscleId: 'forearms', plain: 'The forearms take over if you pull too low.' },
  ],
  feelLine: 'You should feel this in your lats, along the sides of your back.',
  rows: [
    { key: 'shoulder', where: 'Shoulders', at: { muscles: ['front_delts'] },
      means: 'You are pulling too low.',
      fix: 'Stop just below the chin, when the elbows stop moving down.',
      zoom: 'bottom', redFlag: 'shoulder', claim: CL.low },
    { key: 'forearms', where: 'Forearms more than your back', at: { muscles: ['forearms'] },
      means: 'The handle is going too low.',
      fix: 'Stop just below the chin.',
      zoom: 'bottom', claim: C(['CONSENSUS'], [PG], 'c6, c5') },
  ],
  libraryDiff: { add: ['rear_delts'], why: 'Rear delt activity was only higher relative to other grips (card c11, WEAK).' },
  claim: C(['MECH', 'CONSENSUS', 'WEAK'], ['andersen-2014', PG, 'signorile-2002'], 'c12, c14, c11'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'low', title: 'Pulling too low', zoom: 'bottom', claim: CL.low,
    fix: 'Stop when the handle is just below your chin.' },
  { key: 'rock', title: 'Rocking the torso back', claim: C(['MECH', 'CONSENSUS'], [ACE, PG], 'c4, c8'),
    fix: 'Hold a slight lean and keep it still.' },
  { key: 'fast', title: 'Fast return', claim: CL.c8,
    fix: 'Control the handle all the way back up.' },
];
const RISKS = [
  { key: 'shoulder', text: 'Pulling past where the elbows stop moving down stresses the shoulder.', claim: CL.c7 },
];

export default {
  schema: 1,
  id: 'lib_close_grip_pulldown',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'pull',
    orientation: 'neutral',    // c1: palms facing each other
    handle: 'v-handle',        // c1; the key's 30 mm v-handle
    loadAxis: 'across',        // the key's pull variant
    width: { text: 'Close, set by the V-handle.', claim: CL.c1 },
    thumb: { mode: 'wrapped', claim: CL.c16 },
    contact: CONTACT,          // CONVENTION (D-SHIP-GRIP (a)): the key's ga:pull-base, source hand-key-v-handle
    // card grip.wrist "Not curled forward" (c15). The range is the key's pull-variant range (wristRange [0, 25],
    // ga:pull-base), a convention, not a card number.
    wrist: { ext: V.wristRange, limitText: 'Keep the wrists from curling forward.',
      claim: C(['MECH', 'CONVENTION'], ['odriscoll-1992', KEYSRC], 'c15; the ext range is the key\'s ga:pull-base convention, not a card number') },
    faults: FAULTS,
    gripLine: 'V-handle, palms facing each other, thumbs around the handle.',   // c1, c16
    cue: 'Palms in, thumbs wrapped.',   // c1, c16
  },
  contacts: ['seat-back', 'brace-pad'],
  setup: [
    { kind: 'adjust', text: 'Clip a V-handle to the cable.', claim: CL.c1 },
    { kind: 'adjust', text: 'Set the thigh pads tight on your thighs when you sit.', zoom: 'pad', claim: CL.c2 },
    { kind: 'grip', text: 'Palms facing each other, thumbs around the handle.', zoom: 'hand', claim: C(['CONSENSUS', 'MECH'], [PG, 'hk-baechle-grip'], 'c1, c16') },
    { kind: 'position', text: 'Lean back slightly, no more than about 30 degrees.', claim: CL.c4 },
    { kind: 'brace', text: 'Draw your shoulder blades down to start the pull.', claim: CL.c9 },
  ],
  posture: [
    { key: 'thighs', label: 'Thighs pinned', detail: 'Thighs pinned under the pad all set.',
      anchor: { landmark: 'thighTop.r', pose: 'end' }, zoom: 'pad', claim: CL.c3 },
    { key: 'lean', label: 'Fixed lean', detail: 'Slight lean back that does not change during the pull.',
      anchor: { landmark: 'backMid', pose: 'end' }, claim: CL.c4 },
    { key: 'elbows', label: 'Elbows to hips', detail: 'Elbows down toward the hips, upper arms tucked.',
      anchor: { landmark: 'elbow.r', pose: 'end' }, zoom: 'bottom', claim: CL.c5 },
    { key: 'stop', label: 'Handle below chin', detail: 'Handle stops just below the chin. Stop when the elbows start moving back.',
      anchor: { landmark: 'chin', pose: 'end' }, zoom: 'bottom', claim: C(['MECH', 'CONSENSUS'], [ACE, PG], 'c7, c5') },
    { key: 'return', label: 'Slow return', detail: 'Controlled on the way up, no momentum.',
      anchor: { landmark: 'grip.r', pose: 'start' }, claim: CL.c8 },
  ],
  feel,
  zooms,
  chips: ['hand', 'bottom', 'pad', 'feel'],
  copy: {
    setupLine: 'Pin your thighs under the pad. Lean back slightly and keep that lean.',
    mistakeLine: "Don't pull the handle past your chin. Stop when your elbows stop moving down.",
    cueLine: 'Elbows to hips, handle to chin.',
    // card plate.variantLine: the drawn V-handle is the only close-grip handle a source names (c1)
    variantLine: 'Drawn with a V-handle on a pulldown machine.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['shoulder'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/close_grip_pulldown.json', rev: 1 },
};
