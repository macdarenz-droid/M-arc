// LIB-SHIP W4: the How-to content of lib_one_arm_dumbbell_row (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/one_arm_dumbbell_row.json; its claim ids are named on each field's claim.
// No hand zoom (D-SHIP-C3, card-no-zoom): the card has no hand zoom, so the sheet has none; the id is on
// tools/plates/library/hands/no-zoom.json. Its hand claims (one dumbbell, thumb wrapped, a strap allowed; c1, c17, c16)
// live in handling and the grip feel row.
// No palm claim: the card's grip.type says no read source states the palm direction, so `orientation` is not set and no
// copy names one.
// GRIP: grip.handContact (base of the fingers) is the card's drawing convention (card notes), so `contact` is data only
// and never printed (D-SHIP-CONVCOPY). The wrist (c19) is the card's recorded convention (F-LB3-3); the ext range is the
// pull archetype's recorded convention (pairs.mjs CONVENTIONS ga:pull-base), as lib_barbell_row.
// Posture zooms: oadr-support is text (T): its Right is setup step 3 and its Wrong (hand far forward of the shoulder)
// the support checkpoint's detail. oadr-top is a drawing value (DV, below).
// Red flags: the card's redFlags (shoulder): the shared shoulder box, linked by the pain row's redFlag: 'shoulder'.
// No variant line (equipment 'Dumbbell').
import plateSpec from '../specs/one_arm_dumbbell_row.mjs';
import { landmarksOf } from '../engine.mjs';
import { RED_FLAG, RED_FLAG_SHOULDER } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_SHOULDER };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'ace-single-arm-row': { cite: 'ACE Exercise Library: Single Arm Row', url: 'https://www.acefitness.org/resources/everyone/exercise-library/126/single-arm-row/',
    kind: 'guideline', access: 'full', checked: '2026-10-19', use: 'CONSENSUS' },
  'sl-dumbbell-row': { cite: 'How to Do Dumbbell Row: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/dumbbell-row/',
    kind: 'coach', access: 'full', checked: '2026-10-19', use: 'CONSENSUS' },
  saeterbakken2015: { cite: 'The Effect of Performing Bi- and Unilateral Row Exercises on Core Muscle Activation.', url: 'https://pubmed.ncbi.nlm.nih.gov/26134664/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-19', use: 'DATA' },
  'baechle-grip': { cite: 'Grip selection and location. Excerpt from Baechle and Earle, Weight Training, 5th edition (Human Kinetics)', url: 'https://us.humankinetics.com/blogs/excerpt/grip-selection-and-location',
    kind: 'textbook', access: 'full', checked: '2026-10-19', use: 'CONSENSUS' },
  kolber2010: { cite: 'Shoulder injuries attributed to resistance training: a brief review.', url: 'https://pubmed.ncbi.nlm.nih.gov/20508476/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-19', use: 'WEAK' },
  odriscoll1992: { cite: 'The relationship between wrist position, grasp size, and grip strength.', url: 'https://pubmed.ncbi.nlm.nih.gov/1538102/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-19', use: 'MECH' },
  // The shoulder box's own source (shared.mjs RED_FLAG_SHOULDER claim): the card's redFlags 'shoulder' (c20).
  'nhs-shoulder-pain': { cite: 'NHS, Shoulder pain', url: 'https://www.nhs.uk/conditions/shoulder-pain/',
    kind: 'guideline', access: 'full', checked: '2026-10-19', use: 'CONSENSUS', note: 'When shoulder pain needs a check.' },
};
// Not cited: acsm2009 (c14 tempo, plate only; c15 load steps: setup holds the card's five steps); c12 (comparison with
// the barbell row, no slot).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const ACE = 'ace-single-arm-row', SL = 'sl-dumbbell-row';
const CL = {
  c1: C(['CONSENSUS'], [ACE, SL], 'c1'),
  c2: C(['CONSENSUS'], [ACE], 'c2'),
  c4: C(['CONSENSUS'], [SL], 'c4'),
  c5: C(['CONSENSUS'], [ACE], 'c5'),
  c6: C(['CONSENSUS'], [ACE], 'c6'),
  c7: C(['CONSENSUS'], [ACE], 'c7'),
  c9: C(['CONSENSUS'], [SL], 'c9'),
  c10: C(['CONSENSUS'], [SL], 'c10'),
  c11: C(['CONSENSUS'], [SL], 'c11'),
  c16: C(['CONSENSUS'], [SL], 'c16'),
  c17: C(['CONSENSUS'], ['baechle-grip'], 'c17'),
  c18: C(['DATA', 'WEAK'], ['kolber2010'], 'c18'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// 'twist' (card zoom oadr-top Wrong, c7: "Torso twisted open to lift higher"): no plate pose draws it (the plate's
// Mistake is the short range, c10). It is the spec's end with the thorax turned open about the spine's own axis
// (trunk.yaw -TWIST: the working-side shoulder rises; the sign checked with landmarksOf), the working hand moved with
// its shoulder (so the dumbbell rides higher), and the support hand's IK target moved (4 fixed-point steps, the spec's
// own method) so the support wrist stays on the bench where the end pose has it.
// DRAWING VALUE (D-SHIP-DRAWVAL, #376 6614695581; precedent D-LIB7-2 and golden B's machine_chest_press seatDrop): TWIST
// 30 deg is a Wrong-pose size no card gives; no number from it appears in user copy; the layers panel judges it.
const H = 1.75, TWIST = 30, END = plateSpec.poses.end, LE = landmarksOf(END, H);
const TWIST_POSE = (() => {
  const trunk = { flex: 0, yaw: -TWIST };
  const S = landmarksOf({ ...END, trunk, reach: { l: END.reach.l } }, H)['shoulder.r'];
  const r = { at: END.reach.r.at.map((v, i) => v + S[i] - LE['shoulder.r'][i]), pole: END.reach.r.pole };
  let at = END.reach.l.at;
  for (let k = 0; k < 4; k++) {
    const w = landmarksOf({ ...END, trunk, reach: { l: { ...END.reach.l, at }, r } }, H)['wrist.l'];
    at = at.map((v, i) => v + LE['wrist.l'][i] - w[i]);
  }
  return { trunk, reach: { l: { ...END.reach.l, at }, r } };
})();
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  twist: { pose: { ...END, ...TWIST_POSE } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// oadr-top only (oadr-support is text, header). Zoom shell form (render/closeup/crop.mjs): the crop centre on the right
// pose's working shoulder for both halves; the Wrong is drawn dashed over the Right (W4 panel L5).
const zooms = [
  {
    key: 'oadr-top', chip: 'Top', heading: 'Top position', kind: 'posture',
    crop: { center: { at: 'shoulder.r', pose: 'right', off: [0, 10] }, sizePx: 170 },
    // the end pose with its trunk 0 written as the object form (flex 0, yaw 0: the same drawing), so the dashed Wrong can
    // merge over it (D-LIB20-TRUNK)
    right: { base: 'end', pose: { trunk: { flex: 0, yaw: 0 } } },
    wrong: { base: 'end', pose: TWIST_POSE },   // W4 panel L5: dashed Wrong over the Right pose, so the turn reads against the square torso
    callout: {
      right: { text: 'Torso square', anchor: 'backUpper' },
      wrong: { text: 'Torso twists', anchor: { at: 'shoulder.r', pose: 'mistake' } },   // c7 (the dot on the turned shoulder)
    },
    caption: {
      right: 'Elbow driven back, dumbbell at the hip, torso square.',   // c6, c9, c7
      wrong: 'Torso twisted open to lift higher.',                       // c7
    },
    alt: {
      right: 'Side view, top of the row. The elbow is driven back, the dumbbell at the hip, the back level.',
      wrong: 'Side view, top of the row. The torso turns open and the working shoulder rises to lift higher.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
// The card's first row (side of the back, around the shoulder blade, c11) has no fix, so it is left off the rows
// (D-SHIP-Q16); the feel line says it.
const feel = {
  primary: [
    { muscleId: 'lats', plain: 'The lats are main movers.' },
    { muscleId: 'mid_back', plain: 'The traps do most of the work with them.' },
    { muscleId: 'rear_delts', plain: 'The rear delts are main movers too.' },
  ],
  secondary: [
    { muscleId: 'biceps', plain: 'The biceps help bend the elbow.' },
    { muscleId: 'forearms', plain: 'The forearm flexors hold the dumbbell.' },
  ],
  watch: [
    { muscleId: 'obliques', plain: 'The side of the trunk works to keep you square.' },   // c13 (inferred)
  ],
  feelLine: 'You should feel this at the side of your back, around your shoulder blade.',
  rows: [
    { key: 'biceps', where: 'Mostly the biceps', at: { muscles: ['biceps'] },
      means: 'Pulling toward the shoulder works the biceps more.',
      fix: 'Pull toward your hip instead.', claim: CL.c9 },
    { key: 'grip', where: 'Grip giving out before the back', at: { muscles: ['forearms'] },
      means: 'Your back is usually stronger than your grip.',
      fix: 'Use a lifting strap.', claim: CL.c16 },   // c16 (W4 content K2)
    { key: 'shoulder', where: 'Pain in your shoulder', at: { muscles: ['front_delts'] },
      means: '',   // D-FEEL-MEANS-CAUSAL: the card's row gives no cause at its strength; D-FEEL-NOMEANS prints no label
      fix: "Stop the set. Don't train through the pain.",
      redFlag: 'shoulder', claim: C(['CONSENSUS', 'MECH'], ['nhs-shoulder-pain'], 'c20') },
  ],
  libraryDiff: { add: ['rear_delts', 'forearms'], why: 'The rear delts are named a main mover and the forearm flexors a secondary one (card c11).' },
  claim: C(['CONSENSUS', 'DATA', 'MECH'], [SL, 'saeterbakken2015'], 'c11, c13'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'momentum', title: 'Jerking it up with momentum', claim: C(['CONSENSUS'], [SL, ACE], 'c10, c6, c8'),
    fix: 'Pull slowly and lower gently.' },
  { key: 'twist', title: 'Twisting to lift higher', zoom: 'oadr-top', claim: CL.c6,
    fix: 'Stop the pull where your torso would have to turn.' },
  { key: 'flare', title: 'Elbow flaring out', claim: CL.c10,
    fix: 'Keep the elbow close to the body and drive it back.' },
];
const RISKS = [
  { key: 'shoulder', text: 'The shoulder is a common injury site in weight training. Poor technique adds risk.', claim: CL.c18 },
];

export default {
  schema: 1,
  id: 'lib_one_arm_dumbbell_row',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'pull',
    why: 'D-SHIP-C3: card-no-zoom, the card has no hand zoom; the grip copy carries c1, c16 and c17.',
    handle: 'dumbbell',        // card grip.type: one dumbbell in the working hand (c1); no palm direction (header)
    width: { text: 'One hand.', claim: CL.c1 },
    thumb: { mode: 'wrapped', claim: CL.c17 },
    contact: 'finger-base',    // card grip.handContact: the pull archetype's drawing convention (card notes); data only, not printed
    // card grip.wrist: "not curled forward" (c19); the drawn wrist is the card's recorded convention (F-LB3-3). The range
    // is the pull archetype's recorded convention (pairs.mjs CONVENTIONS 'ga:pull-base': extension 0 to 25), not a card
    // number.
    wrist: { ext: [0, 25], limitText: 'Keep the wrist from curling forward.',
      claim: C(['DATA', 'MECH'], ['odriscoll1992'], 'c19, card grip.wrist. The ext range is pairs.mjs CONVENTIONS ga:pull-base, a convention, not a card number.') },
    faults: [],                // the card names no hand fault
    gripLine: 'One dumbbell in the working hand, thumb wrapped around the handle.',   // c1, c17 (W4 content K2)
    cue: 'Elbow back to your hip.',   // c6, c9
  },
  contacts: ['brace-pad'],   // the card's archetype.contact
  setup: [
    { kind: 'get-in', text: 'Dumbbell on the floor beside a flat bench.', claim: CL.c1 },
    { kind: 'position', text: 'One knee and the same-side hand on the bench.', claim: CL.c1 },
    // oadr-support (T): Right and Wrong (W4 D-TEXT-PRINTED: the Wrong moved here from posture).
    { kind: 'position', text: 'Hand under the shoulder, not far forward. Knee under the hip.', claim: CL.c2 },
    { kind: 'position', text: 'Back flat and level, eyes on the floor below you.', claim: CL.c4 },
    // W4 D-TEXT-PRINTED: posture c5 (shoulder doesn't drop at the bottom) moved into this step.
    { kind: 'brace', text: 'Brace, then let the arm hang straight, shoulder not dropping.', claim: C(['CONSENSUS'], [ACE], 'c3, c5') },
  ],
  posture: [
    // oadr-support (T): the card zoom's Wrong as text (c2).
    { key: 'support', label: 'Hand under shoulder', detail: 'Supporting hand under the shoulder, not far forward of it.',
      anchor: { landmark: 'wrist.l', pose: 'start' }, claim: CL.c2 },
    { key: 'back', label: 'Flat back', detail: 'Back flat and parallel to the floor.', anchor: { landmark: 'backUpper', pose: 'start' }, claim: CL.c4 },
    { key: 'head', label: 'Head in line', detail: 'Head in line with the spine, eyes down.', anchor: { landmark: 'neck', pose: 'start' }, claim: CL.c4 },
    { key: 'square', label: 'Torso square', detail: 'No twisting to lift higher.', anchor: { landmark: 'backUpper', pose: 'end' },
      zoom: 'oadr-top', claim: CL.c7 },
    { key: 'shoulder', label: 'Shoulder level', detail: "The shoulder doesn't drop toward the floor at the bottom.",
      anchor: { landmark: 'shoulder.r', pose: 'start' }, claim: CL.c5 },
    { key: 'elbow', label: 'Elbow close', detail: 'Elbow close to the body.', anchor: { landmark: 'elbow.r', pose: 'end' }, claim: CL.c6 },
  ],
  feel,
  zooms,
  chips: ['oadr-top', 'feel'],   // the zoom shell's chip row: the zoom keys, then feel
  copy: {
    setupLine: 'Knee and hand on the bench, back flat. Drive the elbow back toward your hip.',
    mistakeLine: "Don't jerk the dumbbell up. Pull slowly and lower gently.",
    cueLine: 'Elbow to hip, torso square.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['shoulder'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/one_arm_dumbbell_row.json', rev: 1 },
};
