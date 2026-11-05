// LIB-SHIP W4: the How-to content of lib_dumbbell_romanian_deadlift (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/dumbbell_romanian_deadlift.json; its claim ids are named on each field's claim.
// No hand zoom (D-SHIP-HANDW4, no-zoom.json gap-ruled): the card's hand zoom `dbrdl-grip` is a placement zoom
// (dumbbells on the thighs), not a hand pose. Its Right is handling.gripLine; its Wrong ('Dumbbells hanging away from
// the legs.') is in setup step 1 (c4, c1, c24).
// Family (card parent romanian_deadlift, inherit[] grip.wrist and the knees posture; D-SHIP-FAMILY, INHERIT_MAP
// lib_dumbbell_romanian_deadlift): handling.wrist and posture[key=knees] label, detail and anchor are the parent
// sheet's values leaf for leaf (lib_romanian_deadlift.howto.mjs), written out, never imported. The knees checkpoint
// links this sheet's own zoom (dbrdl-bottom).
// Red flags: the card's redFlags (back): LIB-5's back box, linked by the pain row's redFlag: 'back'. Tier-A way out:
// the card records none (LIB-WAYOUT gap), so no way-out line is written.
import plateSpec from '../specs/dumbbell_romanian_deadlift.mjs';
import { landmarksOf } from '../engine.mjs';
import { RED_FLAG } from '../../layers/howto/shared.mjs';
export { RED_FLAG };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'sweat-db-rdl': { cite: 'How To Master Dumbbell Romanian Deadlifts (Sweat)', url: 'https://sweat.com/blogs/fitness/how-to-dumbbell-romanian-deadlift',
    kind: 'coach', access: 'full', checked: '2026-10-19', use: 'CONSENSUS' },
  'fitbod-db-rdl': { cite: 'Dumbbell Romanian Deadlift: Form, Muscles Worked, Target Weight & Variations (Fitbod)', url: 'https://fitbod.me/exercises/dumbbell-romanian-deadlift',
    kind: 'coach', access: 'full', checked: '2026-10-19', use: 'CONSENSUS' },
  'sl-db-rdl': { cite: 'How to Do Dumbbell Romanian Deadlift: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/dumbbell-romanian-deadlift/',
    kind: 'coach', access: 'full', checked: '2026-10-19', use: 'CONSENSUS' },
  martinfuentes2020: { cite: 'Electromyographic activity in deadlift exercise and its variants. A systematic review.', url: 'https://pubmed.ncbi.nlm.nih.gov/32107499/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-19', use: 'DATA' },
  macdougall1985: { cite: 'MacDougall JD et al. Arterial blood pressure response to heavy resistance exercise. J Appl Physiol 1985;58(3):785-90', url: 'https://pubmed.ncbi.nlm.nih.gov/3980383/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-19', use: 'DATA' },
  acsm2009: { cite: 'American College of Sports Medicine position stand. Progression models in resistance training for healthy adults.', url: 'https://pubmed.ncbi.nlm.nih.gov/19204579/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-19', use: 'CONSENSUS' },
  'sl-deadlift': { cite: 'How to Deadlift: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/deadlift/',
    kind: 'coach', access: 'full', checked: '2026-10-19', use: 'MECH' },
  'baechle-grip': { cite: 'Grip selection and location. Excerpt from Baechle and Earle, Weight Training, 5th edition (Human Kinetics)', url: 'https://us.humankinetics.com/blogs/excerpt/grip-selection-and-location',
    kind: 'textbook', access: 'full', checked: '2026-10-19', use: 'CONSENSUS' },
  // The back box's own source (shared/back-box.mjs boxClaim), as lib_romanian_deadlift lists it: the card's redFlags
  // 'back'. The card's nhs-back-pain (same url) is cited under this id (c23), so no source name repeats the box name.
  'nhs-back': { cite: 'NHS, Back pain', url: 'https://www.nhs.uk/conditions/back-pain/',
    kind: 'guideline', access: 'full', checked: '2026-10-02', use: 'CONSENSUS', note: 'When back pain needs a check.' },
};
// Not cited: c16 (dumbbells as a first step to the barbell: no form checkpoint), c20 (tempo, plate only); c18 (the back
// box carries the 999 and GP lines).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const SW = 'sweat-db-rdl', FB = 'fitbod-db-rdl', SL = 'sl-db-rdl';
const CL = {
  c1: C(['CONSENSUS'], [SW, FB], 'c1'),
  c2: C(['CONSENSUS'], [SW], 'c2'),
  c4: C(['CONSENSUS'], [SW], 'c4'),
  c5: C(['CONSENSUS'], [SW], 'c5'),
  c6: C(['CONSENSUS'], [SW], 'c6'),
  c7: C(['CONSENSUS'], [SW], 'c7'),
  c8: C(['CONSENSUS'], [FB, SL], 'c8'),
  c9: C(['CONSENSUS'], [FB], 'c9'),
  c10: C(['CONSENSUS'], [SW], 'c10'),
  c11: C(['CONSENSUS'], [SL], 'c11'),
  c12: C(['CONSENSUS'], [SL], 'c12'),
  c19: C(['DATA', 'WEAK'], ['macdougall1985'], 'c19'),
  c21: C(['CONSENSUS'], ['acsm2009'], 'c21'),
  // card inherit[]: the field is romanian_deadlift's, true here by the card's own inherit reason
  inhWrist: C(['CONSENSUS'], [SW], 'c15; card inherit[0] grip.wrist (romanian_deadlift). The ext range is the hold archetype\'s (GA 3.1), a convention, not a card number.'),
  inhKnees: C(['CONSENSUS'], [SW], 'c3, c6; card inherit[1] knees posture (romanian_deadlift c4)'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses (start = standing tall, end = the bottom at mid-shin). 'round' (card zoom
// dbrdl-bottom Wrong, c8 "rounded back reaching the dumbbells to the floor"): the correct bottom with the lumbar spine
// flexed ROUND_FLEX further (one joint; the root is unchanged), the straight arms hanging plumb under the shoulders at
// their own length, so the dumbbells reach lower. The plate's own Mistake is the arch while standing up (c10), a
// different fault, so this Wrong is a drawing value, not the plate's still.
// DRAWING VALUES (D-SHIP-DRAWVAL, #376 6614695581; precedent D-LIB7-2 and golden B's machine_chest_press seatDrop): the
// rounded lumbar flexion (ROUND_FLEX 30 deg added to the bottom pose's lumbar, in the 'round' pose) is a Wrong-pose
// size no card gives; no number from it appears in user copy; the layers panel judges it.
const H = 1.75, END = plateSpec.poses.end, LE = landmarksOf(END, H), ROUND_FLEX = 30;
const ROUND_BODY = { ...END, trunk: END.trunk + ROUND_FLEX }, LR = landmarksOf(ROUND_BODY, H);
const plumb = s => {   // the hand target straight below the rounded shoulder at the drawn arm's own length
  const S0 = LE[`shoulder.${s}`], G = END.reach[s].at, L = Math.hypot(G[0] - S0[0], G[1] - S0[1], G[2] - S0[2]);
  const S = LR[`shoulder.${s}`], dx = G[0] - S[0];
  return { ...END.reach[s], at: [G[0], S[1] - Math.sqrt(L * L - dx * dx), S[2]] };
};
const ROUND = { trunk: ROUND_BODY.trunk, reach: { l: plumb('l'), r: plumb('r') } };
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  round: { pose: { ...END, ...ROUND } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card posture zoom; dbrdl-grip is text (above). Zoom shell form (render/closeup/crop.mjs): each crop centre
// is on the right pose for both halves; the Wrong is drawn alone (solid).
const zooms = [
  {
    key: 'dbrdl-bottom', chip: 'Bottom', heading: 'Bottom position', kind: 'posture',
    crop: { center: { at: 'backMid', pose: 'right', off: [0, 10] }, sizePx: 190 },
    right: 'end',
    wrong: { base: 'end', pose: ROUND, solid: true },
    callout: {
      right: { text: 'Flat back', anchor: 'backMid' },
      wrong: { text: 'Back rounds', anchor: 'lumbar' },
    },
    caption: {
      right: 'Hips back, flat back, soft knees, dumbbells at mid-shin.',
      wrong: 'Rounded back, reaching the dumbbells lower.',
    },
    alt: {
      right: 'Side view, bottom of the lift. Hips back, back flat, knees softly bent. The dumbbells are at mid-shin.',
      wrong: 'Side view. The back rounds as the dumbbells are reached lower.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
// The card's first row (backs of the thighs going down, c13) has no fix, so it is left off the rows (D-SHIP-Q16); the
// feel line says it.
const feel = {
  primary: [
    { muscleId: 'hamstrings', plain: 'The hamstrings work hard on the way down.' },
    { muscleId: 'glutes', plain: 'The glutes work hard on the way up.' },
  ],
  secondary: [
    { muscleId: 'lower_back', plain: 'The lower back works, less than the hamstrings.' },
    { muscleId: 'adductors', plain: 'The inner thighs help.' },
    { muscleId: 'upper_traps', plain: 'The traps help.' },
    { muscleId: 'forearms', plain: 'The forearms help.' },
  ],
  watch: [],   // card watch lower_back (c17) is also secondary; the secondary line carries c17
  feelLine: 'You should feel this in the backs of your thighs going down, glutes coming up.',
  rows: [
    { key: 'no-hams', where: 'No feeling in the hamstrings', at: { muscles: ['hamstrings'] },
      means: '',   // D-FEEL-MEANS-CAUSAL: the card's row gives no cause at its strength; D-FEEL-NOMEANS prints no label
      fix: 'Push the hips back and keep only a slight knee bend.',
      zoom: 'dbrdl-bottom', claim: C(['CONSENSUS'], [SW], 'c13') },
    { key: 'low-back-more', where: 'Lower back more than the hamstrings', at: { muscles: ['lower_back'] },
      means: '',   // D-FEEL-MEANS-CAUSAL: the card's row gives no cause at its strength; D-FEEL-NOMEANS prints no label
      fix: 'Use your glutes and hamstrings to stand up.',
      claim: C(['CONSENSUS'], [SW], 'c10, c5') },
    { key: 'low-back', where: 'Lower back pain while lifting', at: { muscles: ['lower_back'] },
      means: '',   // D-FEEL-MEANS-CAUSAL: the card's row gives no cause at its strength; D-FEEL-NOMEANS prints no label
      fix: "Stop the set. Don't train through the pain.",
      redFlag: 'back', claim: C(['CONSENSUS', 'MECH'], ['nhs-back'], 'c23 (card source nhs-back-pain, the same NHS page)') },
  ],
  libraryDiff: { add: ['adductors', 'upper_traps', 'forearms'], why: 'StrengthLog lists the adductors, trapezius and forearm flexors as secondary movers; glutes move to primary (card c14).' },
  claim: C(['CONSENSUS', 'DATA', 'MECH'], [SW, SL, FB, 'martinfuentes2020'], 'c13, c14, c17'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  // the plate's own Mistake (c10): the arch while standing up
  { key: 'arch', title: 'Arching to stand up', claim: C(['CONSENSUS'], [SW], 'c10, c5'),
    // W4 D-TEXT-PRINTED: posture c5 (push through the heels to stand) moved into this fix.
    fix: 'Push through the heels with glutes and hamstrings. Back neutral.' },
  { key: 'round', title: 'Rounding to reach lower', zoom: 'dbrdl-bottom', claim: C(['CONSENSUS', 'MECH'], [FB, SL, 'sl-deadlift'], 'c8, c22'),
    fix: 'Stop where the back stays flat. If it rounds, go lighter.' },
  { key: 'low', title: 'Going too low', claim: CL.c9,
    fix: 'Stop where the hamstrings stop the hinge.' },
];
const RISKS = [
  { key: 'round', text: 'Rounding the back to reach lower raises injury risk.', claim: CL.c8 },
  { key: 'breath', text: 'Heavy reps with a held breath send blood pressure very high.', claim: CL.c19 },
  { key: 'neck', text: 'Looking straight ahead at the bottom strains the neck.', claim: CL.c7 },
];

export default {
  schema: 1,
  id: 'lib_dumbbell_romanian_deadlift',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'hold',
    why: 'D-SHIP-C3 no-zoom list, D-SHIP-HANDW4: dbrdl-grip is a placement zoom (dumbbells on the thighs), not a hand pose; its Right and Wrong are text checkpoints.',
    // No orientation: the drawn palm direction (palms facing the body, c1) is a drawing convention (card notes).
    handle: 'dumbbell',
    width: { text: 'Hands in front of the thighs, dumbbells close to the legs.', claim: C(['CONSENSUS'], [SW], 'c1, c4') },
    thumb: { mode: 'wrapped', claim: C(['CONSENSUS', 'MECH'], ['baechle-grip'], 'c24') },
    contact: 'mid-palm',       // card grip.handContact (hold archetype): a drawing convention (card notes), not printed
    // === the parent's handling.wrist, leaf for leaf (D-LIB9a-MAP); the claim (left out of the compare) is this card's.
    wrist: { ext: [-10, 10], limitText: 'Keep the wrist neutral, in line with the forearm.', claim: CL.inhWrist },
    faults: [],                   // dbrdl-grip's Wrong is a placement fault, written in setup step 1
    gripLine: 'Dumbbells on the thighs, palms facing you, thumbs wrapped.',   // dbrdl-grip Right (c4, c1, c24)
    cue: 'Bells on legs, arms straight.',   // c4, c15
  },
  contacts: ['standing-feet'],
  setup: [
    { kind: 'position', text: 'Feet shoulder width. Dumbbells on thighs, not hanging away from the legs.',
      claim: C(['CONSENSUS'], [SW, FB], 'c1, c4') },
    { kind: 'brace', text: 'Shoulder blades down and back. Breathe in and brace before each rep.',
      claim: C(['CONSENSUS'], [SW, SL], 'c2, c11') },
    // W4 D-TEXT-PRINTED: posture c6 (knees behind the toes) and c7 (eyes to the floor) moved into this step.
    { kind: 'posture', text: 'Knees behind the toes. Eyes to the floor as you lower.', claim: C(['CONSENSUS'], [SW], 'c6, c7') },
    { kind: 'adjust', text: 'Want more range? Stand on a plate.', claim: CL.c12 },
    { kind: 'load', text: 'Add weight in small steps once you beat your target reps.', claim: CL.c21 },
  ],
  posture: [
    { key: 'hips', label: 'Hips back', detail: 'Push the hips back, not down. Knees stay behind the toes.',
      anchor: { landmark: 'buttock', pose: 'end' }, zoom: 'dbrdl-bottom', claim: CL.c6 },
    // === the parent's posture[key=knees] label, detail and anchor (INHERIT_MAP); zoom and claim are this sheet's.
    { key: 'knees', label: 'Knees fixed', detail: 'Knees fixed at a slight bend. The movement is at the hips.',
      anchor: { landmark: 'knee.r', pose: 'end' }, zoom: 'dbrdl-bottom', claim: CL.inhKnees },
    { key: 'bells', label: 'Bells on legs', detail: 'Dumbbells touch the legs all the way.',
      anchor: { landmark: 'grip.r', pose: 'end' }, claim: CL.c4 },
    { key: 'depth', label: 'Mid-shin depth', detail: 'Down to about mid-shin, only as low as your hinge allows.',
      anchor: { landmark: 'ankle.r', pose: 'end' }, claim: C(['CONSENSUS'], [FB, SW], 'c9, c3') },
    { key: 'back', label: 'Back neutral', detail: 'Back neutral going down and coming up.',
      anchor: { landmark: 'lumbar', pose: 'end' }, zoom: 'dbrdl-bottom', claim: CL.c10 },
    { key: 'eyes', label: 'Eyes down', detail: 'Eyes move to the floor as you lower.',
      anchor: { landmark: 'head', pose: 'end' }, claim: CL.c7 },
    { key: 'heels', label: 'Heels down', detail: 'Push through the heels to stand.',
      anchor: { landmark: 'heel.r', pose: 'start' }, claim: CL.c5 },
  ],
  feel,
  zooms,
  chips: ['dbrdl-bottom', 'feel'],   // the zoom shell's chip row: the zoom keys, then feel
  copy: {
    setupLine: 'Feet shoulder width, dumbbells on your thighs. Shoulder blades down and back.',
    mistakeLine: 'Never round your back to reach lower. Stop where it stays flat.',
    cueLine: 'Hips back, bells on legs.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['back'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/dumbbell_romanian_deadlift.json', rev: 1 },
};
