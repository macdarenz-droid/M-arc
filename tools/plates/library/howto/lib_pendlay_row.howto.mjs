// LIB-SHIP W4: the How-to content of lib_pendlay_row (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/pendlay_row.json; its claim ids are named on each field's claim.
// Inheriting child of lib_barbell_row (card parent barbell_row; W4 INHERIT_MAP lib_pendlay_row): handling.orientation,
// handling.handle, handling.thumb.mode, handling.contact and risks[key=breath].text are the parent's leaves, copied
// verbatim; riskFlags too. Their claims are this card's own (c1, c16, c17; the map excludes claim subtrees).
// No hand zoom (D-SHIP-C3, card-no-zoom): the card has no hand zoom, so the sheet has none; the id is on
// tools/plates/library/hands/no-zoom.json. Its hand claims (overhand, slightly wider than the shoulders, thumbs wrapped,
// straps; c1, c16, c20) live in handling and setup step 3.
// GRIP: grip.handContact (base of the fingers) and the drawn palm direction are the card's drawing conventions (card
// notes): `contact` is the parent's leaf, data only, never printed (D-SHIP-CONVCOPY). The wrist (c21) is the card's
// recorded convention (F-LB3-3); the ext range is the parent's pull convention (pairs.mjs CONVENTIONS ga:pull-base).
// Pose map: the spec's start is the top (bar at the chest) and its end the floor start (specs/pendlay_row.mjs header).
// Red flags: the card's redFlags (back): LIB-5's back box (tools/plates/library/shared/back-box.mjs), linked by the
// back-pain row's redFlag: 'back'. Tier-A way out: no read source says how to fail a stuck rep, so no way-out line.
// No variant line (equipment 'Barbell').
import plateSpec from '../specs/pendlay_row.mjs';
import { landmarksOf } from '../engine.mjs';
import { RED_FLAG } from '../../layers/howto/shared.mjs';
export { RED_FLAG };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'barbend-pendlay': { cite: 'How to Do the Pendlay Row for Back Size and Stronger Lifts (BarBend)', url: 'https://barbend.com/pendlay-row/',
    kind: 'coach', access: 'full', checked: '2026-10-19', use: 'CONSENSUS' },
  'ggr-pendlay': { cite: 'Pendlay Row: How To, Benefits, and Variations (Garage Gym Reviews)', url: 'https://www.garagegymreviews.com/pendlay-row',
    kind: 'coach', access: 'full', checked: '2026-10-19', use: 'CONSENSUS' },
  'sl-pendlay': { cite: 'How to Do Pendlay Row: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/pendlay-row/',
    kind: 'coach', access: 'full', checked: '2026-10-19', use: 'CONSENSUS' },
  acsm2009: { cite: 'American College of Sports Medicine position stand. Progression models in resistance training for healthy adults.', url: 'https://pubmed.ncbi.nlm.nih.gov/19204579/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-19', use: 'CONSENSUS' },
  'baechle-grip': { cite: 'Grip selection and location. Excerpt from Baechle and Earle, Weight Training, 5th edition (Human Kinetics)', url: 'https://us.humankinetics.com/blogs/excerpt/grip-selection-and-location',
    kind: 'textbook', access: 'full', checked: '2026-10-19', use: 'CONSENSUS' },
  // cite as docs/research/howto/sources.json already holds it (as lib_barbell_row)
  macdougall1985: { cite: 'MacDougall JD et al. Arterial blood pressure response to heavy resistance exercise. J Appl Physiol 1985;58(3):785-90', url: 'https://pubmed.ncbi.nlm.nih.gov/3980383/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-19', use: 'DATA' },
  fenwick2009: { cite: 'Comparison of different rowing exercises: trunk muscle activation and lumbar spine motion, load, and stiffness.', url: 'https://pubmed.ncbi.nlm.nih.gov/19620925/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-19', use: 'DATA' },
  odriscoll1992: { cite: 'The relationship between wrist position, grasp size, and grip strength.', url: 'https://pubmed.ncbi.nlm.nih.gov/1538102/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-19', use: 'MECH' },
  // The back box's own source (shared/back-box.mjs boxClaim), as lib_barbell_row lists it: the card's redFlags 'back'
  // (card source nhs-back-pain, c19, c22).
  'nhs-back': { cite: 'NHS, Back pain', url: 'https://www.nhs.uk/conditions/back-pain/',
    kind: 'guideline', access: 'full', checked: '2026-10-02', use: 'CONSENSUS', note: 'When back pain needs a check.' },
};
// Not cited: c12 (less static lower-back work, no slot), c14 (tempo, plate only).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const BB = 'barbend-pendlay', GGR = 'ggr-pendlay', SL = 'sl-pendlay';
const CL = {
  c1: C(['CONSENSUS'], [BB, GGR], 'c1'),
  c2: C(['CONSENSUS'], [GGR], 'c2'),
  c3: C(['CONSENSUS'], [GGR, SL], 'c3'),
  c4: C(['CONSENSUS'], [SL], 'c4'),
  c5: C(['CONSENSUS'], [BB], 'c5'),
  c6: C(['CONSENSUS'], [BB], 'c6'),
  c7: C(['CONSENSUS'], [BB, 'acsm2009'], 'c7'),
  c8: C(['CONSENSUS'], [GGR], 'c8'),
  c9: C(['CONSENSUS'], [BB], 'c9'),
  c10: C(['CONSENSUS'], [GGR], 'c10'),
  c11: C(['CONSENSUS'], [GGR, BB, SL], 'c11'),
  c13: C(['CONSENSUS'], [BB], 'c13'),
  c16: C(['CONSENSUS'], ['baechle-grip'], 'c16'),
  c17: C(['DATA'], ['macdougall1985'], 'c17'),
  c18: C(['DATA', 'MECH'], ['fenwick2009'], 'c18 (inferred: measured on the standing bent-over row)'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses. pendlay-start (M): the spec's end (the floor start, c1, c2, c3) and the spec's
// Mistake pose merged over it, as the engine draws it (the back rounded to reach the bar; card plate.mistake, c8, c23).
// pendlay-top (DV): the card zoom's Wrong (c6: standing partly up to yank the bar) is not a plate pose. 'rise' is the
// spec's top (start) with the pelvis tilted RISE deg less, so the back line rises from level; the hands stay on the
// torso front at the same spot (navel-to-chest frame) and the feet stay planted (the spec's plant).
// DRAWING VALUE (D-SHIP-DRAWVAL, #376 6614695581; precedent D-LIB7-2 and golden B's machine_chest_press seatDrop): RISE
// 30 deg (the back line 30 deg above level) is a Wrong-pose size no card gives; no number from it appears in user copy;
// the layers panel judges it.
const H = 1.75, RISE = 30, TOP = plateSpec.poses.start, ROUND = plateSpec.mistake.pose;
const frame = lm => { const N = lm.navel, d = [lm.chest[1] - N[1], lm.chest[2] - N[2]], L = Math.hypot(...d), u = [d[0] / L, d[1] / L]; return { N, u, n: [-u[1], u[0]] }; };
const toLocal = (p, F, o) => { const v = [p[1] - o[1], p[2] - o[2]]; return [v[0] * F.u[0] + v[1] * F.u[1], v[0] * F.n[0] + v[1] * F.n[1]]; };
const toWorld = (x, a, F, o) => [x, o[1] + a[0] * F.u[0] + a[1] * F.n[0], o[2] + a[0] * F.u[1] + a[1] * F.n[1]];
const RISE_POSE = (() => {
  const F0 = frame(landmarksOf(TOP, H)), root = { ...TOP.root, tilt: TOP.root.tilt - RISE }, F1 = frame(landmarksOf({ ...TOP, root }, H)), O = [0, 0, 0];
  const move = h => ({ at: toWorld(h.at[0], toLocal(h.at, F0, F0.N), F1, F1.N), pole: toWorld(h.pole[0], toLocal(h.pole, F0, O), F1, O) });
  return { root, reach: { l: move(TOP.reach.l), r: move(TOP.reach.r) } };
})();
export const stills = {
  start: { pose: TOP },
  end: { pose: plateSpec.poses.end },
  round: { pose: { ...plateSpec.poses.end, ...ROUND } },
  rise: { pose: { ...TOP, ...RISE_POSE } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom (the card has no hand zoom). Zoom shell form (render/closeup/crop.mjs): the crop centre on the
// right pose's mid-back for both halves; the Wrong is drawn alone (solid).
const zooms = [
  {
    key: 'pendlay-start', chip: 'Start', heading: 'Start position', kind: 'posture',
    crop: { center: { at: 'backMid', pose: 'right', off: [0, 0] }, sizePx: 170 },
    right: 'end',
    wrong: { base: 'end', pose: ROUND, solid: true },
    callout: {
      right: { text: 'Back flat', anchor: 'backMid' },
      wrong: { text: 'Back rounded', anchor: { at: 'lumbar', pose: 'mistake' } },   // c8 (the spec's tell)
    },
    caption: {
      right: 'Torso level, back flat, hips a little above deadlift height.',   // c2, c8, c1
      wrong: 'Back rounded to reach the bar.',                                 // c8
    },
    alt: {
      right: 'Side view, bar on the floor. Torso level, back flat, knees slightly bent, arms straight to the bar.',
      wrong: 'Side view, bar on the floor. The back rounds and the hips tuck under to reach the bar.',
    },
  },
  {
    key: 'pendlay-top', chip: 'Top', heading: 'Top position', kind: 'posture',
    crop: { center: { at: 'backMid', pose: 'right', off: [0, 0] }, sizePx: 170 },
    right: 'start',
    wrong: { base: 'start', pose: RISE_POSE, solid: true },
    callout: {
      right: { text: 'Torso level', anchor: 'backMid' },
      wrong: { text: 'Torso rises', anchor: 'backUpper' },   // c6
    },
    caption: {
      right: 'Bar at the base of the chest, torso still level.',   // c5, c2
      wrong: 'Torso risen up to yank the bar.',                      // c6
    },
    alt: {
      right: 'Side view, top of the row. The bar touches the base of the chest. The torso is still level.',
      wrong: 'Side view, top of the row. The torso has risen from level to yank the bar up.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
// The card's first two rows (upper back and sides, c11; hamstrings and lower back holding the position, c11) have no
// fix, so they are left off the rows (D-SHIP-Q16); the feel line says them.
const feel = {
  primary: [
    { muscleId: 'lats', plain: 'The lats are main movers.' },
    { muscleId: 'mid_back', plain: 'The traps do most of the work with them.' },
  ],
  secondary: [
    { muscleId: 'rear_delts', plain: 'The rear delts help pull.' },
    { muscleId: 'biceps', plain: 'The biceps help bend the elbows.' },
  ],
  watch: [
    { muscleId: 'lower_back', plain: 'The lower back holds the bent-over position.' },
    { muscleId: 'hamstrings', plain: 'The hamstrings hold the bent-over position.' },
  ],
  feelLine: 'You should feel this in your upper back and sides. Hamstrings and lower back hold the position.',
  rows: [
    { key: 'back-pain', where: 'Pain in your back while rowing', at: { muscles: ['lower_back'] },
      means: 'Is it getting worse?',
      fix: "Stop the set. Don't train through the pain.",
      redFlag: 'back', claim: C(['CONSENSUS', 'MECH'], ['nhs-back'], 'c22') },
  ],
  claim: CL.c11,
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'round', title: 'Starting with a rounded back', zoom: 'pendlay-start', claim: CL.c8,
    fix: 'Raise the bar on blocks or plates. Keep the back flat.' },
  { key: 'rise', title: 'Standing partly up to yank', zoom: 'pendlay-top', claim: CL.c6,
    fix: 'Use less weight and keep the torso level.' },
  { key: 'flare', title: 'Elbows flared wide', claim: CL.c9,
    fix: 'Lighten the load. Pull the bar toward the hips.' },
];
const RISKS = [
  { key: 'round', text: 'Starting a rep with a rounded back is dangerous.', claim: C(['CONSENSUS'], [GGR], 'c8, c23') },
  { key: 'spine', text: 'Of the rows tested, the bent-over row loaded the lower spine most.', claim: CL.c18 },
  { key: 'breath', text: 'Heavy reps with a held breath send blood pressure very high.', claim: CL.c17 },   // === parent
];

export default {
  schema: 1,
  id: 'lib_pendlay_row',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'pull',
    why: 'D-SHIP-C3: card-no-zoom, the card has no hand zoom; the grip copy carries c1, c16 and c20.',
    orientation: 'pronated',   // === parent; card grip.type: overhand, palms down (c1)
    handle: 'bar-28',          // === parent; the same straight barbell (card inherit grip.type)
    width: { text: 'Slightly wider than shoulder width.', claim: CL.c1 },
    thumb: { mode: 'wrapped', claim: CL.c16 },   // mode === parent; card grip.thumb (c16)
    contact: 'finger-base',    // === parent; card grip.handContact: the pull archetype's drawing convention (card notes); data only
    // card grip.wrist: "not curled forward" (c21); the drawn wrist is the card's recorded convention (F-LB3-3). The range
    // is the pull archetype's recorded convention (pairs.mjs CONVENTIONS 'ga:pull-base': extension 0 to 25), as the
    // parent, not a card number.
    wrist: { ext: [0, 25], limitText: 'Keep the wrists from curling forward.',
      claim: C(['DATA', 'MECH'], ['odriscoll1992'], 'c21, card grip.wrist. The ext range is pairs.mjs CONVENTIONS ga:pull-base, a convention, not a card number.') },
    faults: [],                // the card names no hand fault
    // c1 overhand, c16 thumbs, c20 straps.
    gripLine: 'Overhand, thumbs around the bar. Straps are fine if grip fails first.',
    cue: 'Overhand, thumbs wrapped.',   // c1, c16
  },
  contacts: ['standing-feet'],
  setup: [
    { kind: 'get-in', text: 'New to lifting? Start with seated or chest-supported rows first.', claim: CL.c13 },
    { kind: 'position', text: 'Bar on the floor. Stand over it, feet shoulder width.', claim: CL.c10 },
    { kind: 'grip', text: 'Hips a little above deadlift height. Overhand grip, slightly wider than shoulders.',
      claim: C(['CONSENSUS'], [BB, GGR, 'baechle-grip'], 'c1, c16') },
    { kind: 'position', text: 'Back rounds to reach it? Raise the bar on blocks or plates.', zoom: 'pendlay-start', claim: CL.c8 },
    { kind: 'load', text: 'Beat target by one or two reps? Add 2 to 10 percent.', claim: CL.c7 },
  ],
  posture: [
    { key: 'torso', label: 'Torso level', detail: 'Torso level, shoulders and hips at the same height.',
      anchor: { landmark: 'backMid', pose: 'end' }, zoom: 'pendlay-start', claim: CL.c2 },
    // D-TEXT-GOLDEN: posture 'Upper body still' (c4) is also the plate's Torso still cue; the zoom shows its Wrong (c6).
    { key: 'still', label: 'Torso still', detail: 'Upper body still. Only the bar and arms move.',
      anchor: { landmark: 'backUpper', pose: 'start' }, zoom: 'pendlay-top', claim: C(['CONSENSUS'], [SL, BB], 'c4, c6') },
    { key: 'brace', label: 'Brace first', detail: "Brace before each pull. Shoulders not shrugged, hips don't come forward.",
      anchor: { landmark: 'sacrum', pose: 'start' }, claim: CL.c5 },
    { key: 'feet', label: 'Feet flat', detail: 'Both feet flat the whole set.', anchor: { landmark: 'ankle.r', pose: 'end' }, claim: CL.c10 },
    // D-TEXT-GOLDEN: posture 'Set the bar down at a dead stop each rep' (c3) is the plate's Floor each rep cue.
  ],
  feel,
  zooms,
  chips: ['pendlay-start', 'pendlay-top', 'feel'],   // the zoom shell's chip row: the zoom keys, then feel
  copy: {
    setupLine: 'Hinge with the torso level. Pull the bar from the floor to the base of your chest.',
    mistakeLine: "Don't stand up to yank the bar. Use less weight and keep the torso level.",
    cueLine: 'Torso level, floor each rep.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['back'],   // === parent; the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/pendlay_row.json', rev: 1 },
};
