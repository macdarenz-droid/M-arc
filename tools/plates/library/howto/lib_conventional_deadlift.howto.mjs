// LIB-SHIP W4: the How-to content of lib_conventional_deadlift (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/conventional_deadlift.json; its claim ids are named on each field's claim.
// No hand zoom (D-SHIP-HANDW4, no-zoom.json gap-ruled): the card's hand zoom `dl-grip` is a placement zoom (grip width,
// hands outside the knees), not a hand pose. Its Right is text in handling.gripLine and setup step 3; its Wrong
// ('Hands too wide, arms bent.') is the third mistake's title (c3, c21, c4).
// Family (card parent romanian_deadlift, inherit[] grip.thumb, grip.handContact, grip.wrist, archetype.contact;
// D-SHIP-FAMILY, INHERIT_MAP lib_conventional_deadlift): handling.thumb.mode, handling.pose.thumb, handling.contact,
// handling.wrist and contacts are the parent sheet's values leaf for leaf (lib_romanian_deadlift.howto.mjs), written
// out, never imported. Parent of lib_sumo_deadlift: the same leaves are compared with that child.
// Red flags: the card's redFlags (back): LIB-5's back box, linked by the pain row's redFlag: 'back'. Tier-A way out:
// the card records none (LIB-WAYOUT gap), so no way-out line is written.
import plateSpec from '../specs/conventional_deadlift.mjs';
import { landmarksOf } from '../engine.mjs';
import { RED_FLAG } from '../../layers/howto/shared.mjs';
export { RED_FLAG };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'sl-deadlift': { cite: 'How to Deadlift: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/deadlift/',
    kind: 'coach', access: 'full', checked: '2026-10-19', use: 'CONSENSUS' },
  'ace-deadlift': { cite: 'Deadlift | Exercise Library | ACE', url: 'https://www.acefitness.org/resources/everyone/exercise-library/6/deadlift/',
    kind: 'guideline', access: 'full', checked: '2026-10-19', use: 'CONSENSUS' },
  acsm2009: { cite: 'American College of Sports Medicine position stand. Progression models in resistance training for healthy adults.', url: 'https://pubmed.ncbi.nlm.nih.gov/19204579/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-19', use: 'CONSENSUS' },
  martinfuentes2020: { cite: 'Electromyographic activity in deadlift exercise and its variants. A systematic review.', url: 'https://pubmed.ncbi.nlm.nih.gov/32107499/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-19', use: 'DATA' },
  lee2018: { cite: 'An electromyographic and kinetic comparison of conventional and Romanian deadlifts.', url: 'https://pubmed.ncbi.nlm.nih.gov/30662500/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-19', use: 'DATA' },
  cherni2026: { cite: 'Beyond the Neutral Spine: A Narrative Review and Modern Framework for Low Back Injury Prevention in Deadlifting.', url: 'https://pubmed.ncbi.nlm.nih.gov/42043083/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-19', use: 'WEAK' },
  macdougall1985: { cite: 'MacDougall JD et al. Arterial blood pressure response to heavy resistance exercise. J Appl Physiol 1985;58(3):785-90', url: 'https://pubmed.ncbi.nlm.nih.gov/3980383/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-19', use: 'DATA' },
  'baechle-grip': { cite: 'Grip selection and location. Excerpt from Baechle and Earle, Weight Training, 5th edition (Human Kinetics)', url: 'https://us.humankinetics.com/blogs/excerpt/grip-selection-and-location',
    kind: 'textbook', access: 'full', checked: '2026-10-19', use: 'CONSENSUS' },
  // The back box's own source (shared/back-box.mjs boxClaim), as lib_romanian_deadlift lists it: the card's redFlags
  // 'back'. The card's nhs-back-pain (same url) is cited under this id (c25), so no source name repeats the box name.
  'nhs-back': { cite: 'NHS, Back pain', url: 'https://www.nhs.uk/conditions/back-pain/',
    kind: 'guideline', access: 'full', checked: '2026-10-02', use: 'CONSENSUS', note: 'When back pain needs a check.' },
};
// Not cited: c12 (tempo, plate only); c24 (the back box carries the 999 and GP lines).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const SL = 'sl-deadlift', ACE = 'ace-deadlift';
const CL = {
  c1: C(['CONSENSUS'], [SL], 'c1'),
  c3: C(['CONSENSUS'], [SL], 'c3'),
  c4: C(['CONSENSUS'], [SL], 'c4'),
  c5: C(['CONSENSUS'], [SL], 'c5'),
  c6: C(['CONSENSUS'], [SL], 'c6'),
  c7: C(['CONSENSUS'], [ACE, SL], 'c7'),
  c8: C(['CONSENSUS'], [SL], 'c8'),
  c9: C(['CONSENSUS'], [SL], 'c9'),
  c10: C(['CONSENSUS'], [SL, ACE], 'c10'),
  c11: C(['CONSENSUS'], [SL], 'c11'),
  c19: C(['CONSENSUS', 'WEAK'], [SL, 'cherni2026'], 'c19'),
  c20: C(['DATA', 'WEAK'], ['macdougall1985'], 'c20'),
  c21: C(['CONSENSUS'], ['baechle-grip', SL], 'c21'),
  c22: C(['CONSENSUS'], [SL], 'c22'),
  c23: C(['CONSENSUS'], [SL], 'c23'),
  // card inherit[]: the field is romanian_deadlift's, true here by the card's own inherit reason
  inhWrist: C(['CONSENSUS'], [SL], 'c4; card inherit[2] grip.wrist (romanian_deadlift). The ext range is the hold archetype\'s (GA 3.1), a convention, not a card number.'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses (spec end = the floor start, spec start = standing tall). 'round' (card zoom dl-start
// Wrong, c8 "rounded lower back"): the spec's Mistake pose merged over the end pose, as the engine draws it (card
// plate.mistake). 'shoot' (card zoom dl-liftoff Wrong, c9 "hips shoot up before the bar moves"): the floor start with
// the bar left where it is, the root raised straight up until the near knee opens to SHOOT_KNEE, and the trunk tipped
// forward (root tilt SOLVED) until the straight arm reaches the bar again.
// DRAWING VALUES (D-SHIP-DRAWVAL, #376 6614695581; precedent D-LIB7-2 and golden B's machine_chest_press seatDrop): the
// shot-up knee angle (SHOOT_KNEE 30 deg of flexion, in the 'shoot' pose) is a Wrong-pose size no card gives; no number
// from it appears in user copy; the layers panel judges it.
const H = 1.75, R = Math.PI / 180, END = plateSpec.poses.end, LE = landmarksOf(END, H), SHOOT_KNEE = 30;
const kneeR = lm => {
  const a = [0, 1, 2].map(i => lm['hip.r'][i] - lm['knee.r'][i]), b = [0, 1, 2].map(i => lm['ankle.r'][i] - lm['knee.r'][i]);
  return 180 - Math.acos((a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) / Math.hypot(...a) / Math.hypot(...b)) / R;
};
const halve = (f, a, b) => { for (let i = 0; i < 60; i++) { const m = (a + b) / 2; if (f(a) * f(m) <= 0) b = m; else a = m; } return (a + b) / 2; };
const ARM = Math.hypot(...[0, 1, 2].map(i => LE['grip.r'][i] - LE['shoulder.r'][i]));
const at = (dy, tilt) => ({ ...END, root: { at: [END.root.at[0], END.root.at[1] + dy, END.root.at[2]], tilt } });
const SHOOT_DY = halve(dy => kneeR(landmarksOf(at(dy, END.root.tilt), H)) - SHOOT_KNEE, 0, 0.4);
const armGap = tilt => { const lm = landmarksOf(at(SHOOT_DY, tilt), H); return Math.hypot(...[0, 1, 2].map(i => LE['grip.r'][i] - lm['shoulder.r'][i])) - ARM; };
const SHOOT_TILT = halve(armGap, END.root.tilt, END.root.tilt + 40);
const ROUND = plateSpec.mistake.pose, SHOOT = { root: at(SHOOT_DY, SHOOT_TILT).root };
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  round: { pose: { ...END, ...ROUND } },
  shoot: { pose: { ...END, ...SHOOT } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card posture zoom; dl-grip is text (above). Zoom shell form (render/closeup/crop.mjs): each crop centre is
// on the right pose for both halves; the Wrong is drawn alone (solid).
const zooms = [
  {
    key: 'dl-start', chip: 'Start', heading: 'Start position', kind: 'posture',
    crop: { center: { at: 'backMid', pose: 'right', off: [0, 20] }, sizePx: 200 },
    right: 'end',
    wrong: { base: 'end', pose: ROUND, solid: true },
    callout: {
      right: { text: 'Flat back', anchor: 'backMid' },
      wrong: { text: 'Back rounds', anchor: 'lumbar' },
    },
    caption: {
      right: 'Bar over mid-foot, shins near it, arms straight, back flat.',
      wrong: 'Lower back rounds as the bar leaves the floor.',
    },
    alt: {
      right: 'Side view, bar on the floor. The bar is over mid-foot, shins close, arms straight and vertical, back flat.',
      wrong: 'Side view. The lower back rounds as the bar breaks from the floor.',
    },
    feelRow: 'low-back-over',
  },
  {
    key: 'dl-liftoff', chip: 'Liftoff', heading: 'Liftoff', kind: 'posture',
    crop: { center: { at: 'hip.r', pose: 'right', off: [0, 10] }, sizePx: 200 },
    right: 'end',
    wrong: { base: 'end', pose: SHOOT, solid: true },
    callout: {
      right: { text: 'Hips wait', anchor: 'hip.r' },
      wrong: { text: 'Hips shoot up', anchor: 'hip.r' },
    },
    caption: {
      right: 'Legs start the pull, hips wait for the bar.',
      wrong: 'Hips shoot up before the bar moves.',
    },
    alt: {
      right: 'Side view, bar on the floor. Knees bent, hips low enough for the legs to start the pull.',
      wrong: 'Side view. The bar is still on the floor. The hips have risen, the knees nearly straight.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
// The card's rows 1 (glutes and back of the thighs, c13) and 3 (front thighs off the floor, c9) have no fix, so they
// are left off the rows (D-SHIP-Q16); the feel line says them.
const feel = {
  primary: [
    { muscleId: 'glutes', plain: 'The glutes work hard, more than in the Romanian deadlift.' },
    { muscleId: 'hamstrings', plain: 'The back of the thighs should feel the work.' },
    { muscleId: 'lower_back', plain: 'The lower back works hard in this lift.' },
  ],
  secondary: [
    { muscleId: 'quads', plain: 'The front thighs work hard too.' },
    { muscleId: 'adductors', plain: 'The inner thighs help.' },
    { muscleId: 'upper_traps', plain: 'The traps help.' },
    { muscleId: 'forearms', plain: 'The forearms help.' },
  ],
  watch: [],   // card watch lower_back (c13) is also primary (C2): the feel line's "not your back" carries c13
  feelLine: 'You should feel this in your glutes and hamstrings, not your back. Front thighs help off the floor.',
  rows: [
    { key: 'low-back-over', where: 'Lower back taking over', at: { muscles: ['lower_back'] },
      means: '',   // D-FEEL-MEANS-CAUSAL: the card's row gives no cause at its strength; D-FEEL-NOMEANS prints no label
      fix: 'Lower the weight or do fewer reps.',
      zoom: 'dl-start', claim: CL.c8 },
    { key: 'low-back', where: 'Lower back pain while lifting', at: { muscles: ['lower_back'] },
      means: '',   // D-FEEL-MEANS-CAUSAL: the card's row gives no cause at its strength; D-FEEL-NOMEANS prints no label
      fix: "Stop the set. Don't train through the pain.",
      redFlag: 'back', claim: C(['CONSENSUS', 'MECH'], ['nhs-back'], 'c25 (card source nhs-back-pain, the same NHS page)') },
  ],
  libraryDiff: { add: ['adductors', 'forearms'], why: 'StrengthLog lists the adductors and forearm flexors as secondary movers (card c14).' },
  claim: C(['CONSENSUS', 'DATA'], [ACE, SL, 'martinfuentes2020', 'lee2018'], 'c13, c14, c15, c16, c9'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'round', title: 'Back rounding under heavier weight', zoom: 'dl-start', claim: CL.c8,
    fix: 'Lower the weight or do fewer reps per set.' },
  { key: 'hips', title: 'Hips shooting up first', zoom: 'dl-liftoff', claim: CL.c9,
    fix: 'Be patient off the floor so the legs start the pull.' },
  // card handlingMistakes[2] (bent arms at the start, c4) with the dl-grip Wrong (hands too wide, c3)
  { key: 'arms', title: 'Hands too wide, arms bent', claim: C(['CONSENSUS'], [SL], 'c3, c4'),
    fix: 'Grip about shoulder width. Straighten the arms before pulling.' },
];
const RISKS = [
  { key: 'round', text: "A rounded back loads the spine's discs and bones more.", claim: CL.c19 },
  { key: 'breath', text: 'Heavy reps with a held breath send blood pressure very high.', claim: CL.c20 },
  { key: 'jumps', text: 'Big load jumps appear linked with more injuries. Add weight in small steps.',
    claim: C(['WEAK', 'CONSENSUS'], ['cherni2026', SL, 'acsm2009'], 'c18, c17') },
];

export default {
  schema: 1,
  id: 'lib_conventional_deadlift',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'hold',
    why: 'D-SHIP-C3 no-zoom list, D-SHIP-HANDW4: dl-grip is a placement zoom (grip width, hands outside the knees), not a hand pose; its Right and Wrong are text checkpoints.',
    orientation: 'pronated',   // card grip.type: double overhand (c21); mixed grip or straps only when grip limits
    handle: 'bar-28',          // the spec's 28 mm shaft
    width: { text: 'About shoulder width, arms just outside the knees.', claim: CL.c3 },
    thumb: { mode: 'wrapped', claim: C(['CONSENSUS'], ['baechle-grip', SL], 'c21; card inherit[0] grip.thumb (romanian_deadlift)') },   // inherited
    contact: 'mid-palm',       // inherited (card inherit[1] grip.handContact): a drawing convention, not printed
    wrist: { ext: [-10, 10], limitText: 'Keep the wrist neutral, in line with the forearm.', claim: CL.inhWrist },   // inherited
    pose: { thumb: 'wrapped' },   // inherited (handling.pose.thumb); no hand pose is drawn (no hand zoom)
    faults: [],                   // dl-grip's Wrong is a placement fault, written as the third mistake
    gripLine: 'Overhand, thumbs wrapped, hands about shoulder width, outside the knees. Use mixed grip or straps only when grip limits heavy sets.',
    cue: 'Thumbs wrapped, arms straight.',   // c21, c4
  },
  contacts: ['standing-feet'],   // inherited (card inherit[3] archetype.contact)
  setup: [
    { kind: 'get-in', text: 'Load the bar on the floor with full-size plates.', claim: CL.c23 },
    { kind: 'position', text: 'Bar over mid-foot, feet hip to shoulder width, toes slightly out.',
      claim: C(['CONSENSUS'], [SL, ACE], 'c1, c2') },
    // W4 D-TEXT-PRINTED: the grip step's c3/c4 stay printed in the Grip line, the dl-start caption and the arms fix;
    // its slot carries posture c10 (tall finish) and c11 (lowering) instead, and the brace and tension steps merge.
    { kind: 'brace', text: 'Breathe in and brace. Build tension slowly before liftoff.', claim: C(['CONSENSUS'], [SL], 'c5, c22') },
    { kind: 'position', text: 'Finish tall: hips and knees locked, shoulders back.', claim: CL.c10 },
    { kind: 'position', text: 'To lower, push hips back first. Bend knees once the bar passes.', claim: CL.c11 },
  ],
  posture: [
    { key: 'shins', label: 'Shins close', detail: 'Shins close to or touching the bar at the start.',
      anchor: { landmark: 'knee.r', pose: 'end' }, zoom: 'dl-start', claim: CL.c1 },
    { key: 'arms', label: 'Arms straight', detail: 'Arms straight and vertical from the side.',
      anchor: { landmark: 'elbow.r', pose: 'end' }, zoom: 'dl-start', claim: CL.c4 },
    { key: 'back', label: 'Flat back', detail: 'Back flat from floor to lockout.',
      anchor: { landmark: 'lumbar', pose: 'end' }, zoom: 'dl-start', claim: CL.c7 },
    { key: 'bar', label: 'Bar close', detail: 'Bar travels close to the body.',
      anchor: { landmark: 'grip.r', pose: 'end' }, claim: CL.c6 },
    { key: 'lockout', label: 'Tall finish', detail: 'Finish tall: hips and knees locked, shoulders back.',
      anchor: { landmark: 'hip.r', pose: 'start' }, claim: CL.c10 },
    { key: 'lower', label: 'Hips first', detail: 'To lower, push the hips back first. Bend the knees once the bar passes them.',
      anchor: { landmark: 'buttock', pose: 'start' }, claim: CL.c11 },
  ],
  feel,
  zooms,
  chips: ['dl-start', 'dl-liftoff', 'feel'],   // the zoom shell's chip row: the zoom keys, then feel
  copy: {
    setupLine: 'Bar over mid-foot, shins close. Grip about shoulder width, arms straight outside the knees.',
    mistakeLine: 'Never let your back round as the weight goes up. Lower the weight instead.',
    cueLine: 'Bar close, back flat.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['back'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/conventional_deadlift.json', rev: 1 },
};
