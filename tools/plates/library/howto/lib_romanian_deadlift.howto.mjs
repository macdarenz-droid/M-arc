// LIB-SHIP W2: the How-to content of lib_romanian_deadlift (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/romanian_deadlift.json; its claim ids are named on each field's claim.
// No hand zoom (D-SHIP-HANDW2, no-zoom.json gap-ruled): no pair key variant holds this card's hanging barbell for the
// card's hand zoom `rdl-grip` (c22, c9), and no per-id hand pose is drawn without every number (ruling 8). Its hand
// claims (thumbs wrapped, straps, width just outside the thighs) live in handling and setup step 1.
// Parent of lib_single_leg_romanian_deadlift (D-SHIP-FAMILY, D-LIB9a-MAP form): handling.thumb.mode, handling.pose.thumb
// and handling.wrist are compared leaf by leaf with the child, so the wrist limitText names no implement.
// Red flags: the card's redFlags (back): LIB-5's back box, linked by the pain row's redFlag: 'back'. Tier-A way out:
// the card records a gap (LIB-WAYOUT; the blocks in setup step 5 avoid reversing a heavy bar, they are not a way out).
import plateSpec from '../specs/romanian_deadlift.mjs';
import { landmarksOf } from '../engine.mjs';
import { RED_FLAG } from '../../layers/howto/shared.mjs';
export { RED_FLAG };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'ace-romanian-deadlift': { cite: 'ACE Exercise Library: Romanian Deadlift', url: 'https://www.acefitness.org/resources/everyone/exercise-library/317/romanian-deadlift/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'sl-romanian-deadlift': { cite: 'How to Do Romanian Deadlift: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/romanian-deadlift/',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'nasm-rdl': { cite: 'Romanian Deadlift Barbell (NASM)', url: 'https://blog.nasm.org/romanian-deadlift-basics',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  mcallister2014: { cite: 'Muscle activation during various hamstring exercises.', url: 'https://pubmed.ncbi.nlm.nih.gov/24149748/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  lee2018: { cite: 'An electromyographic and kinetic comparison of conventional and Romanian deadlifts.', url: 'https://pubmed.ncbi.nlm.nih.gov/30662500/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  acsm2009: { cite: 'American College of Sports Medicine position stand. Progression models in resistance training for healthy adults.', url: 'https://pubmed.ncbi.nlm.nih.gov/19204579/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-17', use: 'CONSENSUS' },
  // cite as docs/research/howto/sources.json already holds it (same url, kind, access and checked as the card)
  macdougall1985: { cite: 'MacDougall JD et al. Arterial blood pressure response to heavy resistance exercise. J Appl Physiol 1985;58(3):785-90', url: 'https://pubmed.ncbi.nlm.nih.gov/3980383/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'WEAK' },
  'baechle-grip': { cite: 'Grip selection and location. Excerpt from Baechle and Earle, Weight Training, 5th edition (Human Kinetics)', url: 'https://us.humankinetics.com/blogs/excerpt/grip-selection-and-location',
    kind: 'textbook', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  // The wrist line's hold-archetype default (card grip.wrist), as lib_cable_fly lists it (W2 fix round, #385 6648438434).
  'hold-default': { cite: 'Golden B hold archetype default (dumbbell_lateral_raise handling: thumb wrapped, contact mid-palm)', url: 'tools/plates/layers/exercises/dumbbell_lateral_raise.howto.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-04', use: 'CONVENTION' },
  // The back box's own source (shared/back-box.mjs boxClaim), as lib_rope_triceps_pushdown lists it: the card's redFlags 'back'.
  'nhs-back': { cite: 'NHS, Back pain', url: 'https://www.nhs.uk/conditions/back-pain/',
    kind: 'guideline', access: 'full', checked: '2026-10-02', use: 'CONSENSUS', note: 'When back pain needs a check.' },
};
// Not cited: martinfuentes2020 (c14, only in the card's libraryDiff reasoning); c20 (tempo, plate only).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const ACE = 'ace-romanian-deadlift', SL = 'sl-romanian-deadlift', NASM = 'nasm-rdl';
const CL = {
  c2: C(['CONSENSUS'], [ACE], 'c2'),
  c3: C(['CONSENSUS'], [ACE], 'c3'),
  c4: C(['CONSENSUS'], [SL], 'c4'),
  c5: C(['CONSENSUS'], [SL], 'c5'),
  c6: C(['CONSENSUS'], [NASM], 'c6'),
  c7: C(['CONSENSUS'], [NASM], 'c7'),
  c8: C(['CONSENSUS'], [NASM], 'c8'),
  c9: C(['CONSENSUS'], [NASM], 'c9'),
  c10: C(['CONSENSUS'], [NASM], 'c10'),
  c11: C(['CONSENSUS'], [SL], 'c11'),
  c12: C(['CONSENSUS'], [SL], 'c12'),
  c18: C(['CONSENSUS'], [SL], 'c18'),
  c21: C(['DATA', 'WEAK'], ['macdougall1985'], 'c21'),
  c22: C(['CONSENSUS'], ['baechle-grip', SL], 'c22'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses. 'round' (card zoom rdl-bottom Wrong, c7 "rounded lower back"): the spec's Mistake
// pose merged over the end pose, as the engine draws it (card plate.mistake). 'drift' (card zoom rdl-bar-path Wrong, c3
// "bar drifting forward away from the legs"): the correct bottom with the straight arms hanging plumb under the
// shoulders, as the spec's own Mistake hangs them (hangFrom), instead of ARM_BACK back, so the bar sits ahead of the
// shins. The card gives no distance.
// DRAWING VALUES (D-SHIP-DRAWVAL, #376 6614695581; precedent D-LIB7-2 and golden B's machine_chest_press seatDrop): the
// drift's plumb arm (0 deg from vertical, the spec's Mistake hang) is a Wrong-pose size no card gives; no number from it
// appears in user copy; the layers panel judges it.
const H = 1.75, END = plateSpec.poses.end, LE = landmarksOf(END, H);
const plumb = s => {   // the hand target straight below the shoulder at the drawn arm's own length
  const S = LE[`shoulder.${s}`], G = END.reach[s].at, L = Math.hypot(G[0] - S[0], G[1] - S[1], G[2] - S[2]), dx = G[0] - S[0];
  return { ...END.reach[s], at: [G[0], S[1] - Math.sqrt(L * L - dx * dx), S[2]] };
};
const ROUND = plateSpec.mistake.pose, DRIFT = { reach: { l: plumb('l'), r: plumb('r') } };
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  round: { pose: { ...END, ...ROUND } },
  drift: { pose: { ...END, ...DRIFT } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom except the hand zoom `rdl-grip` (D-SHIP-HANDW2, above). Zoom shell form (render/closeup/crop.mjs):
// each crop centre is on the right pose for both halves; the Wrong is drawn alone (solid).
const zooms = [
  {
    key: 'rdl-bottom', chip: 'Bottom', heading: 'Bottom position', kind: 'posture',
    crop: { center: { at: 'backMid', pose: 'right', off: [0, 0] }, sizePx: 170 },
    right: 'end',
    wrong: { base: 'end', pose: ROUND, solid: true },
    callout: {
      right: { text: 'Flat back', anchor: 'backMid' },
      wrong: { text: 'Back rounds', anchor: 'lumbar' },
    },
    // Right caption and alt (W2 fix round, #385 6648438434): hips back c2, flat back c5, knees slightly bent c4, bar at
    // mid-shin c6; the Wrong (rounded lower back) is c7.
    caption: {
      right: 'Hips back, flat back, knees slightly bent, bar at mid-shin.',
      wrong: 'Rounded lower back.',
    },
    alt: {
      right: 'Side view, bottom of the lift. Hips pushed back, back flat, knees slightly bent. The bar is at mid-shin.',
      wrong: 'Side view. The lower back rounds as the bar is reached down toward the floor.',
    },
    feelRow: 'low-back',
  },
  {
    key: 'rdl-bar-path', chip: 'Bar path', heading: 'Bar path', kind: 'posture',
    crop: { center: { at: 'knee.r', pose: 'right', off: [0, 10] }, sizePx: 150 },
    right: 'end',
    wrong: { base: 'end', pose: DRIFT, solid: true },
    callout: {
      right: { text: 'Bar close', anchor: 'grip.r' },
      wrong: { text: 'Bar drifts forward', anchor: 'grip.r' },
    },
    caption: {
      right: 'Bar slides down close to the thighs and shins.',
      wrong: 'Bar drifting forward, away from the legs.',
    },
    alt: {
      right: 'Side view, bottom of the lift. The bar sits against the shins, close to the legs.',
      wrong: 'Side view. The bar hangs forward of the shins, away from the legs.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
// The card's first row (back of the thighs, stretching going down; c2, c16) has no fix, so it is left off the rows
// (D-SHIP-Q16); the feel line says it.
const feel = {
  primary: [
    { muscleId: 'hamstrings', plain: 'The hamstrings work hardest in this lift.' },
    { muscleId: 'glutes', plain: 'The glutes work strongly too.' },
  ],
  secondary: [
    { muscleId: 'lower_back', plain: 'The lower back works, less than the hamstrings.' },
    { muscleId: 'adductors', plain: 'The inner thighs help.' },
  ],
  watch: [],
  // c2's depth cue (W2 panel restore, #379 6633524031): the posture 'depth' detail is zoom data the app never shows
  // (D-TEXT-GOLDEN), so it is the feel line's second sentence. The glutes stay on the map's Main (c15).
  feelLine: 'You should feel this in your hamstrings. Lower until you feel tension along the back of the legs.',
  rows: [
    { key: 'low-back-more', where: 'Lower back more than hamstrings', at: { muscles: ['lower_back'] },
      // D-FEEL-MEANS-CAUSAL (#385 6648438434): the card row's own cause (c7, c8), not said of the user.
      means: 'Rounding the lower back, or a weight that breaks your form.',
      fix: 'Stop higher, before the back rounds.',
      zoom: 'rdl-bottom', claim: C(['CONSENSUS'], [NASM, SL], 'c7, c8, c5') },
    { key: 'low-back', where: 'Lower-back pain during or after sessions', at: { muscles: ['lower_back'] },
      // W2 fix round L6 (#385 6648438434, D-FEEL-MEANS-CAUSAL): c17's own cause ("usually comes from doing too much too
      // soon or from technique"). Its check ("get checked if pain is severe or lasts") is the linked back box's: C8 and
      // copy-lint refuse check-up wording in a row's fix (red-flag wording lives in redFlag).
      means: 'Too much too soon, or your technique.',
      fix: "Stop. Don't train through the pain.",
      redFlag: 'back', claim: C(['CONSENSUS'], [SL], 'c17') },
  ],
  libraryDiff: { add: ['adductors'], why: 'The adductors are named as secondary movers; glutes move to primary (card c15, c16).' },
  claim: C(['DATA', 'CONSENSUS'], ['mcallister2014', 'lee2018', ACE], 'c13, c15, c2'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'round', title: 'Rounding the lower back', zoom: 'rdl-bottom', claim: C(['CONSENSUS'], [NASM], 'c7, c8'),
    fix: 'Stop where the back stays flat. If it rounds, lower the weight.' },
  // W2 fix round (#385 6648438434): no zoom link, as the Bottom close-up draws only the rounding; the row stays shown
  // (D-TEXT-GOLDEN). The fix: knees at a slight bend c4, hips back c2, the fault c7.
  { key: 'squat', title: 'Knees bending into a squat', claim: C(['CONSENSUS'], [NASM, SL, ACE], 'c7, c4, c2'),
    fix: 'Lock the knees at a slight bend and push the hips back.' },
  { key: 'heavy', title: 'Too heavy, form breaks', claim: CL.c8,
    fix: 'Go lighter and move smoothly.' },
];
const RISKS = [
  { key: 'round', text: 'A rounded lower back under load raises injury risk.', claim: CL.c7 },
  { key: 'breath', text: 'Heavy reps with a held breath send blood pressure very high.', claim: CL.c21 },
  { key: 'soon', text: 'Too much too soon can leave the back sore. Ease into heavy sets gradually.',
    claim: C(['CONSENSUS'], [SL, 'acsm2009'], 'c17, c19') },
];

export default {
  schema: 1,
  id: 'lib_romanian_deadlift',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'hold',
    why: 'D-SHIP-C3 no-zoom list, D-SHIP-HANDW2: no pair key variant holds this card\'s hanging barbell (ruling 8); the grip copy carries c9 and c22.',
    // No orientation: card grip.type leaves it to the hold archetype (no source read names overhand or mixed).
    handle: 'bar-28',          // the spec's 28 mm shaft
    width: { text: 'Slightly wider than shoulders, arms just outside the thighs.', claim: CL.c9 },
    thumb: { mode: 'wrapped', claim: CL.c22 },
    contact: 'mid-palm',       // card grip.handContact: across the middle of the palm, fingers wrapped (hold archetype)
    // card grip.wrist: "Neutral, in line with the forearm (hold archetype range)". The range is the hold archetype's
    // (GRIP-AND-FEEL 3.1 `hold`, as golden B's dumbbell_lateral_raise), not a card number. Shared leaf for leaf with
    // lib_single_leg_romanian_deadlift (D-LIB9a-MAP), so its limitText names no implement.
    wrist: { ext: [-10, 10], limitText: 'Keep the wrist neutral, in line with the forearm.',
      // W2 fix round (#385 6648438434): no card claim id; the line is card grip.wrist's hold-archetype default.
      claim: C(['CONVENTION'], ['hold-default'], 'card grip.wrist (hold archetype). The ext range is the hold archetype\'s (GA 3.1), a convention, not a card number.') },
    pose: { thumb: 'wrapped' },   // c22; no hand pose is drawn (no hand zoom)
    faults: [],                   // the card's hand zoom has no Wrong and no handling mistake is a hand fault
    gripLine: 'Hands just outside your thighs, thumbs wrapped round the bar. Straps are fine if grip limits the set.',   // c9, c22
    cue: 'Thumbs wrapped, wrists neutral.',   // c22, card grip.wrist
  },
  contacts: ['standing-feet'],
  setup: [
    // W2 fix round L2 (#385 6648438434): feet and grip are set before the bar moves (c10, c9, c22), then the bar is
    // unracked or lifted off the floor (c11), then it rests on the thighs with the shoulders set (c1, c9).
    { kind: 'grip', text: 'Feet hip width. Grip slightly wider than shoulders, thumbs wrapped.',
      claim: C(['CONSENSUS'], [NASM, 'baechle-grip', SL], 'c10, c9, c22') },
    { kind: 'get-in', text: 'Unrack the bar, or deadlift it off the floor.', claim: CL.c11 },
    { kind: 'position', text: 'Bar resting on the thighs. Shoulders back and down.', claim: C(['CONSENSUS'], [ACE, NASM], 'c1, c9') },
    // D-TEXT-GOLDEN (#385 6637650243): posture 'Push the heels into the floor to stand.' (c3) had no visible slot.
    { kind: 'brace', text: 'Breathe in, brace slightly. Push the heels into the floor to stand.', claim: C(['CONSENSUS'], [SL, ACE], 'c12, c3') },
    { kind: 'safety', text: 'Want to avoid turning heavy weight around in mid-air? Lower onto blocks.', claim: CL.c18 },
  ],
  posture: [
    { key: 'hips', label: 'Hips back', detail: 'Push the hips back to lower the bar.',
      anchor: { landmark: 'buttock', pose: 'end' }, claim: C(['CONSENSUS'], [ACE, SL], 'c2, c4') },
    { key: 'knees', label: 'Knees fixed', detail: 'Knees fixed at a slight bend. The movement is at the hips.',
      anchor: { landmark: 'knee.r', pose: 'end' }, zoom: 'rdl-bottom', claim: CL.c4 },
    { key: 'back', label: 'Spine neutral', detail: 'Spine neutral. Stop before it rounds.',
      anchor: { landmark: 'lumbar', pose: 'end' }, zoom: 'rdl-bottom', claim: CL.c5 },
    { key: 'bar', label: 'Bar close', detail: 'Bar very close to the body.',
      anchor: { landmark: 'grip.r', pose: 'end' }, zoom: 'rdl-bar-path', claim: CL.c3 },
    // Pre-panel restore (#379 6632122694): card c2's depth cue, cut from 'hips', carried here with its claim.
    { key: 'depth', label: 'About mid-shin', detail: 'Lower until you feel tension along the back of the legs. Spine position beats depth.',
      anchor: { landmark: 'ankle.r', pose: 'end' }, claim: { ...CL.c6, sources: [...new Set([...CL.c6.sources, ...CL.c2.sources])], note: 'c6, c2' } },
    { key: 'heels', label: 'Heels down', detail: 'Push the heels into the floor to stand.',
      anchor: { landmark: 'heel.r', pose: 'start' }, claim: CL.c3 },
  ],
  feel,
  zooms,
  chips: ['rdl-bottom', 'rdl-bar-path', 'feel'],   // the zoom shell's chip row: the zoom keys, then feel
  copy: {
    setupLine: 'Feet hip width, bar on your thighs. Grip slightly wider than shoulders, shoulders back and down.',
    mistakeLine: 'Never round your lower back to get the bar lower. Stop where it stays flat.',
    cueLine: 'Hips back, bar close.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['back'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/romanian_deadlift.json', rev: 1 },
};
