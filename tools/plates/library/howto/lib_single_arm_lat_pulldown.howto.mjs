// LIB-SHIP W3: the How-to content of lib_single_arm_lat_pulldown (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/single_arm_lat_pulldown.json; its claim ids are named on each field's claim.
// Hand zoom (D-SHIP-GRIP case (a)): the card zoom `hand` is drawn by the approved `d-handle` key
// (tools/plates/library/hands/hand-d-handle.mjs:17 IDS.single_arm_lat_pulldown: variant 'pull', orientation 'unstated',
// faults ['curled']; the variant is radial-rules.mjs:45-56 pullVariant; the handle is the key's HANDLE, hand-d-handle.mjs:6,
// 30 mm). The key module is not imported (MANIFEST closure, W2 form): its record is copied below as literals. The card's
// grip.handContact is an LR-4 drawing convention, so the contact is the key's 'ga:pull-base' (hands/pairs.mjs
// CONVENTIONS), cited CONVENTION (source hand-key-d-handle), never DATA. No palm direction is sourced (card grip.type),
// so handling.orientation is left out.
// Inherited (D-LIB9a-MAP as amended by Q-W3-2, #383 6630932862): setup[kind=position].text equals lat_pulldown's
// (lat_pulldown.howto.mjs:192), with no zoom link (this card has no path zoom).
// Card zoom `top position` is a text checkpoint (D-SHIP-TEXTZOOM; section 11): its Wrong ("handle let fly up with no
// tension") is a cable state, not a body pose; golden B's machine_chest_press keeps "Start depth" as text (:165, :285).
// Red flags: the card's redFlags (shoulder): golden B's shared shoulder block, linked by the shoulder feel row.
// No variant line (equipment 'Cable'); the card's plate.variantLine notes the kneeling setup shares the claims.
import plateSpec from '../specs/single_arm_lat_pulldown.mjs';
import { RED_FLAG, RED_FLAG_SHOULDER } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_SHOULDER };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'ace-lat-pulldown': { cite: 'Seated Lat Pulldown (ACE Exercise Library)', url: 'https://www.acefitness.org/resources/everyone/exercise-library/158/seated-lat-pulldown/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'MECH' },
  'barbend-single-arm-lat-pulldown': { cite: 'How to Do the Single-Arm Lat Pulldown for Spectacular Back Development (BarBend)', url: 'https://barbend.com/single-arm-lat-pulldown/',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'odriscoll-1992': { cite: 'The relationship between wrist position, grasp size, and grip strength (O\'Driscoll et al., J Hand Surg Am)', url: 'https://pubmed.ncbi.nlm.nih.gov/1538102/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'MECH' },
  'puregym-single-arm-lat-pulldown': { cite: 'Single Arm Lat Pulldown (PureGym exercise guide)', url: 'https://www.puregym.com/exercises/back/lat-exercises/single-arm-lat-pulldown/',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'hk-baechle-grip': { cite: 'Grip selection and location, excerpt from Weight Training: Steps to Success, 5th ed. (Baechle and Earle, Human Kinetics)', url: 'https://us.humankinetics.com/blogs/excerpt/grip-selection-and-location',
    kind: 'textbook', access: 'full', checked: '2026-10-18', use: 'MECH' },
  // The d-handle key's own source for the hand contact (the card's grip.handContact is a drawing convention).
  'hand-key-d-handle': { cite: 'LIB-7 hand pair key d-handle (pull), CONVENTIONS ga:pull-base: base of the fingers and top edge of the palm', url: 'tools/plates/library/hands/hand-d-handle.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-04', use: 'CONVENTION' },
  // RED_FLAG's own source (layers/howto/shared.mjs), as golden B's machine_chest_press lists it.
  'nhs-wrist-pain': { cite: 'NHS, Wrist pain', url: 'https://www.nhs.uk/conditions/hand-pain/wrist-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When wrist pain needs a check.' },
  // RED_FLAG_SHOULDER's own source (layers/howto/shared.mjs): the card's redFlags 'shoulder'.
  'nhs-shoulder-pain': { cite: 'NHS, Shoulder pain', url: 'https://www.nhs.uk/conditions/shoulder-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When shoulder pain needs a check.' },
};
// Not cited: c12 (setups vary; the kneeling setup step did not fit the five steps), c14 (tempo, plate only); lusk-2010
// is c14's only source, so it is not listed.

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const PG = 'puregym-single-arm-lat-pulldown', BB = 'barbend-single-arm-lat-pulldown', ACE = 'ace-lat-pulldown', KEYSRC = 'hand-key-d-handle';
const CL = {
  c1: C(['CONSENSUS'], [PG], 'c1'),
  c2: C(['CONSENSUS'], [PG], 'c2'),
  c3: C(['CONSENSUS'], [BB], 'c3'),
  c4: C(['CONSENSUS'], [BB], 'c4'),
  c5: C(['CONSENSUS'], [PG], 'c5'),
  c6: C(['CONSENSUS'], [PG], 'c6'),
  c9: C(['CONSENSUS'], [PG], 'c9'),
  c10: C(['CONSENSUS'], [BB], 'c10'),
  c11: C(['CONSENSUS'], [BB], 'c11'),
  c12: C(['CONSENSUS'], [BB, PG], 'c12'),
  c15: C(['MECH'], ['odriscoll-1992'], 'c15'),
  c16: C(['CONSENSUS', 'MECH'], ['hk-baechle-grip'], 'c16'),
  past: C(['CONSENSUS'], [BB, PG], 'c10, c2'),
  stop: C(['MECH', 'CONSENSUS'], [ACE, PG], 'c13, c2'),
};

/* ------------------------------------------------------------------------------------------------ hand ---------- */
// The key's record for this id and its variant, copied as literals (hand-d-handle.mjs:6, :17; radial-rules.mjs:45-56).
const KEYED = { variant: 'pull', orientation: 'unstated', faults: ['curled'] };   // IDS.single_arm_lat_pulldown
const V = {                                                                         // VARIANTS.pull
  contact: 'base', rightNote: 'Base of fingers', wristRange: [0, 25],
  right: { view: 'radial', forearm: 180, wrist: { ext: 5, dev: 0 }, contactAt: 1.0, fingers: { curl: 1 }, thumb: 'wrapped', squeeze: 'firm', load: { kind: 'pull' } },
  alt: 'Handle across the base of the fingers, thumb wrapped, back of the hand in line with the forearm.',
  faults: { curled: { label: 'Wrist curled', pose: { wrist: { ext: -30 } }, markers: ['lever-arc'], alt: 'Wrist curled forward toward the forearm.' } },
};
const RIGHT_POSE = V.right;
const FAULTS = KEYED.faults.map(key => {
  const f = V.faults[key];
  // HandFault.pose.wrist needs dev: the key's fault sets ext only; dev is the right pose's own value (0), for the type.
  return { key, label: f.label, pose: { ...f.pose, wrist: { dev: RIGHT_POSE.wrist.dev, ...f.pose.wrist } }, markers: f.markers, alt: f.alt };
});
// CONVENTION (D-SHIP-GRIP (a)): the key's contact 'base' (ga:pull-base) is the HandContact 'finger-base'.
const CONTACT = { base: 'finger-base' }[V.contact];

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: the end (upper arm flush with the side, shoulder down; c2, c3) and the spec's
// Mistake pose merged over it, as the engine draws it (elbow behind the body, shoulder rolled forward; card
// plate.mistake, c10). The card zoom `bottom position` Wrong is that drawn fault, so no drawing value is added.
const MIS = plateSpec.mistake.pose;
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: plateSpec.poses.end },
  past: { pose: { ...plateSpec.poses.end, ...MIS } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
const zooms = [
  {
    key: 'hand', chip: 'Hand', heading: 'Hand position', kind: 'hand',   // card zoom key: hand
    hand: {
      right: RIGHT_POSE,
      wrong: FAULTS,
      camera: 'side',               // the key's camera for 'unstated' (hands/pairs.mjs ORIENTATIONS)
      // CONVENTION (D-SHIP-GRIP (a)): 'Base of fingers' is the key's rightNote (words/d-handle-pull-unstated.json)
      notes: { right: V.rightNote, wrong: FAULTS[0].label },
    },
    caption: {
      right: 'Single handle, wrist not curled.',
      wrong: 'Wrist curled forward.',
    },
    // CONVENTION (D-SHIP-GRIP (a)): the contact in this alt is the key's ga:pull-base, source hand-key-d-handle.
    alt: { right: 'Handle across the base of the fingers, thumb wrapped. Back of the hand in line with the forearm.', wrong: FAULTS[0].alt },
  },
  {
    key: 'bottom', chip: 'Bottom', heading: 'Bottom position', kind: 'posture',   // card zoom key: bottom position
    // zoom shell (render/closeup/crop.mjs): crop centre on the right pose's elbow for both halves; the Wrong is the
    // spec's Mistake dashed over the end pose, as `stills.past`.
    crop: { center: { at: 'elbow.r', pose: 'right', off: [0, -10] }, sizePx: 170 },
    right: 'end',
    // W3 PANEL FIX 2 (#384 6649416891, L5; c10, c13): the correct arm faded, the whole wrong arm dashed (the plate's
    // Mistake parts), and the plate's own Mistake guides: the dashed forearm the mask hides over the trunk, the dashed
    // forward shoulder cap and its arrow (the cable and 'low' arrow guides stay on the plate only).
    wrong: { base: 'end', pose: MIS, parts: plateSpec.mistake.parts, fade: ['shcap.r', 'upper.r', 'elbowcap.r', 'fore.r', 'fist.r'] },
    guides: plateSpec.mistake.guides.filter(g => g.kind === 'dashed' ? Array.isArray(g.pts[0]) === false : g.from?.at === 'shoulder.r'),
    callout: {
      right: { text: 'Arm at side', anchor: 'elbow.r' },
      wrong: { text: 'Elbow behind', anchor: { at: 'elbow.r', pose: 'mistake' } },
    },
    caption: {
      right: 'Upper arm flush with the side, shoulder down.',
      wrong: 'Elbow behind the body, shoulder rolled forward.',
    },
    alt: {   // c10 (card zooms[key=bottom position])
      right: 'Side view, seated, one arm pulling. The upper arm is flush with the side and the shoulder is down.',
      wrong: 'Side view. The elbow has gone back behind the body and the shoulder rolls forward.',
    },
    feelRow: 'shoulder',
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
// The card's 'The side of your waist' row has fix "Nothing to fix. …" (no fix verb): left off the rows (D-SHIP-Q16);
// its claim (c7) is kept in the feel line.
const feel = {
  primary: [
    { muscleId: 'lats', plain: 'The lats do most of the work.' },
  ],
  secondary: [
    { muscleId: 'biceps', plain: 'The biceps help bend the elbow.' },
    { muscleId: 'mid_back', plain: 'The middle-back muscles help pull.' },
    { muscleId: 'obliques', plain: 'The obliques keep your torso from twisting.' },
  ],
  watch: [],
  feelLine: 'You should feel this in your lat. The side of your waist works to stop you twisting.',
  rows: [
    { key: 'shoulder', where: 'Shoulder', at: { muscles: ['front_delts'] },
      means: 'You pull past the end and the shoulder rolls forward.',
      fix: 'Stop when the handle passes your chin.',
      zoom: 'bottom', redFlag: 'shoulder', claim: CL.past },
  ],
  libraryDiff: { add: ['mid_back', 'obliques'], why: 'Coach source lists the rhomboids and traps (card c8) and the obliques (c7).' },
  claim: C(['CONSENSUS', 'WEAK'], [PG], 'c8, c7'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'past', title: 'Pulling past the end', zoom: 'bottom', claim: CL.past,
    fix: 'Stop when the handle just passes your chin.' },
  { key: 'twist', title: 'Twisting the torso', claim: CL.c6,
    fix: 'Brace the trunk. Still twisting? Lower the load.' },
  { key: 'lean', title: 'Leaning into each rep', claim: C(['CONSENSUS'], [BB, PG], 'c11, c6'),
    fix: 'Tighten your abs to hold the spine still.' },
];
const RISKS = [
  { key: 'shoulder', text: 'Rolling the shoulder forward at the end of the pull may stress it.', claim: CL.c10 },
];

export default {
  schema: 1,
  id: 'lib_single_arm_lat_pulldown',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'pull',
    handle: 'd-handle',        // c1: single handle; the key's 30 mm d-handle
    loadAxis: 'across',        // the key's pull variant
    width: { text: 'One hand, set by the handle.', claim: CL.c1 },
    thumb: { mode: 'wrapped', claim: CL.c16 },
    contact: CONTACT,          // CONVENTION (D-SHIP-GRIP (a)): the key's ga:pull-base, source hand-key-d-handle
    // card grip.wrist "Not curled forward" (c15). The range is the key's pull-variant range (wristRange [0, 25],
    // ga:pull-base), a convention, not a card number.
    wrist: { ext: V.wristRange, limitText: 'Keep the wrist from curling forward.',
      claim: C(['MECH', 'CONVENTION'], ['odriscoll-1992', KEYSRC], 'c15; the ext range is the key\'s ga:pull-base convention, not a card number') },
    faults: FAULTS,
    gripLine: 'Single handle, thumb around it.',   // c1, c16 (the wrist line is limitText, c15)
    cue: 'Thumb wrapped, wrist straight.',   // c16, c15
  },
  contacts: ['seat-back', 'brace-pad'],
  setup: [
    { kind: 'adjust', text: 'Clip a single handle to the cable.', claim: CL.c1 },
    { kind: 'get-in', text: 'Stand to take the handle, then sit, thighs tight under the pads.', claim: CL.c1 },
    { kind: 'load', text: 'Use less than half your two-arm pulldown weight to start.', claim: CL.c9 },
    { kind: 'brace', text: "Brace your trunk so it won't twist.", claim: CL.c6 },
    // W3 layers fix (#384 6648454032, L2): the card's own setup steps; its upright torso (c7, c11) replaces the inherited lean.
    { kind: 'position', text: 'No pulldown machine? Kneel at a cable machine.', claim: CL.c12 },
  ],
  posture: [
    { key: 'square', label: 'Torso square', detail: 'Thighs pinned. Torso upright and square, no twisting.',
      anchor: { landmark: 'chest', pose: 'end' }, claim: C(['CONSENSUS', 'WEAK'], [PG], 'c1, c7') },
    { key: 'shoulder', label: 'Shoulder down first', detail: 'Drop the shoulder away from the ear before the elbow bends.',
      anchor: { landmark: 'shoulder.r', pose: 'start' }, claim: CL.c3 },
    { key: 'pocket', label: 'Elbow to pocket', detail: 'Elbow back and down toward the back pocket, upper arm flush with the side.',
      anchor: { landmark: 'elbow.r', pose: 'end' }, zoom: 'bottom', claim: CL.c2 },
    { key: 'stop', label: 'Stop point', detail: 'Stop when the handle passes the chin and the elbow stops moving down.',
      anchor: { landmark: 'chin', pose: 'end' }, zoom: 'bottom', claim: CL.stop },
    // D-SHIP-TEXTZOOM: the card zoom `top position` as a text checkpoint (Right, then Wrong in the detail).
    { key: 'top', label: 'Tension at top', detail: 'Top: arm long, the cable lifts the shoulder, tension kept. Never let the handle fly up.',
      anchor: { landmark: 'grip.r', pose: 'start' }, claim: CL.c4 },
  ],
  feel,
  zooms,
  chips: ['hand', 'bottom', 'feel'],
  copy: {
    setupLine: 'Sit with your thighs pinned and lean back slightly. Brace so your torso stays square.',
    // D-TEXT-GOLDEN (#379 6637607604): posture 'top' (c4, c5: tension kept, slow return) is shown here; the stop point (c10, c2) stays.
    mistakeLine: 'Stop when the handle passes your chin. Return slowly, never let it fly up.',
    cueLine: 'Shoulder down, elbow to pocket.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['shoulder'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/single_arm_lat_pulldown.json', rev: 1 },
};
