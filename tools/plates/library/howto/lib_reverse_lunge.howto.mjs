// LIB-SHIP W2: the How-to content of lib_reverse_lunge (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/reverse_lunge.json; its claim ids are named on each field's claim.
// Handling (D-SHIP-GRIP case (b)): the card's grip.thumb, grip.handContact and grip.wrist are all empty (grip note: no
// reverse-lunge source covers thumb or wrist), so there is no hand claim to draw or write: NoHandling, and no hand zoom
// (the card has none). The card's grip.type ("Dumbbells held at the sides", c11) is setup step 1.
// Variant line (D-LIB5-VARIANT): exercises.json lists 'Dumbbells / Barbell'; the card's plate.variantLine says the
// stance, step, shin, trunk and weight-sharing claims (c1-c5) hold for both, and c11 names both loads.
// Red flag: the card's redFlags (knee), golden B's shared knee block, linked by the knee row.
import plateSpec from '../specs/reverse_lunge.mjs';
import { RED_FLAG, RED_FLAG_KNEE } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_KNEE };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'cat-revlunge': { cite: 'Catalyst Athletics, Reverse Lunge (Exercise Library)', url: 'https://www.catalystathletics.com/exercise/735/Reverse-Lunge/',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'ace-revlunge': { cite: 'ACE Exercise Library, Reverse Lunge', url: 'https://www.acefitness.org/resources/everyone/exercise-library/319/reverse-lunge/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'bezerra-2021': { cite: 'Influence of Trunk Position during Three Lunge Exercises on Muscular Activation in Trained Women', url: 'https://pubmed.ncbi.nlm.nih.gov/34055138/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'WEAK' },
  'nhs-knee': { cite: 'NHS, Knee pain', url: 'https://www.nhs.uk/conditions/knee-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'pel-revlunge': { cite: 'Peloton (Rebecca Schumer, physical therapist), Reverse Lunge: How to Do It, Benefits, & Variations', url: 'https://www.onepeloton.com/blog/reverse-lunge',
    kind: 'coach', access: 'full', checked: '2026-10-03', use: 'CONSENSUS' },
  // RED_FLAG_KNEE's own source (layers/howto/shared.mjs), as golden B's leg_press lists it: the card's redFlags 'knee'.
  'nhs-knee-pain': { cite: 'NHS, Knee pain', url: 'https://www.nhs.uk/symptoms/knee-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When knee pain needs a check.' },
};
// Not cited: fw-revlunge (c15, tempo progression; no field here restates it).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const CAT = 'cat-revlunge', ACE = 'ace-revlunge', PEL = 'pel-revlunge';
const CL = {
  c2: C(['CONSENSUS'], [CAT], 'c2'),
  c3: C(['CONSENSUS'], [CAT], 'c3'),
  c4: C(['CONSENSUS'], [ACE], 'c4'),
  c5: C(['CONSENSUS'], [ACE], 'c5'),
  c6: C(['CONSENSUS'], [CAT], 'c6'),
  c7: C(['CONSENSUS'], [CAT], 'c7'),
  c9: C(['CONSENSUS'], [CAT], 'c9'),
  c12: C(['CONSENSUS'], [CAT], 'c12'),
  c13: C(['CONSENSUS'], ['nhs-knee'], 'c13'),
  c18: C(['CONSENSUS'], [PEL], 'c18'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own end pose (the bottom of the lunge). Neither card zoom Wrong is the plate's drawn fault (the
// flared ribcage, c18), so each is the end pose with one change:
//   'chest-forward' (card zoom trunk Wrong, c3: "Chest pitched forward over the front thigh"): the pelvis and trunk
//         pitch LEAN deg forward and the arms stay plumb (shoulder flexion = lean, as the spec's own arms()); feet held.
//   'shin-forward' (card zoom front-shin Wrong, c2: "Front shin tipped far forward, not vertical"; the card's
//         wrongNote: the inverse of c1/c2): the front foot planted SHORT m further back under the same hips, so the
//         front knee travels ahead of the ankle (shin about 27 deg forward against the spec's 6).
// DRAWING VALUES (D-SHIP-DRAWVAL, #376 6614695581; precedent D-LIB7-2 and lib_plank's SAG 20 deg): LEAN 30 deg and SHORT
// 0.15 m are Wrong-pose sizes no card gives; no number from them appears in user copy; the layers panel judges them.
const LEAN = 30, SHORT = 0.15;
const END = plateSpec.poses.end;
const CHEST_FORWARD = { root: { ...END.root, tilt: LEAN }, shoulder: { flex: LEAN } };
const SHIN_FORWARD = { plant: { ...END.plant, r: { ...END.plant.r, at: [END.plant.r.at[0], END.plant.r.at[1], END.plant.r.at[2] - SHORT] } } };
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  'chest-forward': { pose: { ...END, ...CHEST_FORWARD } },
  'shin-forward': { pose: { ...END, ...SHIN_FORWARD } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom, same keys and kinds. The zoom shell's shape (callout with an anchor at the landmark it names;
// pilot-a.closeups.mjs), as the curl's curl-elbow; each Wrong is drawn alone (solid).
const zooms = [
  {
    key: 'trunk', chip: 'Trunk', heading: 'Trunk angle', kind: 'posture',
    crop: { center: { at: 'sternum', pose: 'right', off: [0, 10] }, sizePx: 170 },
    right: 'end',
    wrong: { base: 'end', pose: CHEST_FORWARD, solid: true },
    callout: {
      right: { text: 'Trunk upright', anchor: 'sternum' },
      wrong: { text: 'Chest forward', anchor: 'sternum' },
    },
    caption: {
      right: 'Trunk upright over the hips at the bottom.',
      wrong: 'Chest pitched forward over the front thigh.',
    },
    alt: {
      right: 'Side view, bottom of the lunge. The trunk is upright over the hips, the dumbbells hang at the sides.',
      wrong: 'Side view, bottom of the lunge. The chest is pitched forward over the front thigh.',
    },
    feelRow: 'lower-back',
  },
  {
    key: 'front-shin', chip: 'Shin', heading: 'Front shin', kind: 'posture',
    crop: { center: { at: 'knee.r', pose: 'right', off: [0, 0] }, sizePx: 160 },
    right: 'end',
    wrong: { base: 'end', pose: SHIN_FORWARD, solid: true },
    callout: {
      right: { text: 'Shin vertical', anchor: 'knee.r' },
      wrong: { text: 'Shin tipped', anchor: 'knee.r' },
    },
    caption: {
      right: 'Front shin about vertical.',
      wrong: 'Front shin tipped far forward, not vertical.',
    },
    alt: {
      right: 'Side view, bottom of the lunge. The front knee is over the ankle, so the front shin is about vertical.',
      wrong: 'Side view, bottom of the lunge. The front knee is far ahead of the ankle, the shin tipped forward.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [
    { muscleId: 'quads', plain: 'The front of the thighs work to lower and stand.' },
    { muscleId: 'glutes', plain: 'The hips work too.' },
  ],
  secondary: [],
  watch: [{ muscleId: 'lower_back', plain: 'Leaning forward makes the lower back work harder.' }],
  // The card's first row (front of thighs and hips, c9) has no fix, so it is left off the rows (D-SHIP-Q16).
  feelLine: 'You should feel this in your legs and hips.',   // c9 (W2 fix round, #385 6648438434)
  rows: [
    { key: 'lower-back', where: 'Lower back', at: { muscles: ['lower_back'] },
      // W2 fix round (#385 6648438434, D-FEEL-MEANS-CAUSAL): the card row's own means, at c8's strength ("can").
      means: 'Leaning the chest forward can make the lower-back muscles work harder.',
      fix: "Stay upright. Go lighter if you can't.",
      zoom: 'trunk', claim: C(['DATA', 'WEAK', 'CONSENSUS'], ['bezerra-2021', CAT], 'c8, c6') },
    { key: 'knee', where: 'Very painful, locking or giving-way knee', at: { parts: ['knee-left', 'knee-right'] },
      // W2 fix round (#385 6648438434, D-FEEL-MEANS-CAUSAL): the card's "Not a training feeling." names no cause, so it
      // moves to the fix and no label prints. c13's urgent advice is the linked knee box's (C8: no red-flag wording in a
      // row's fix).
      means: '',
      fix: "Stop the set. It's not a training feeling.",
      redFlag: 'knee', claim: CL.c13 },
  ],
  claim: CL.c9,
};

/* ---------------------------------------------------------------- risks (card risks; handlingMistakes are posture, Q-W2-12) */
const RISKS = [
  { key: 'heavy', text: 'Too heavy a load costs the upright trunk, the controlled descent and balance.', claim: CL.c6 },
  { key: 'crash', text: 'Crashing into the bottom position instead of lowering under control.', claim: CL.c7 },
  // handlingMistake 'Flaring the ribcage' with its fix (c18): the W2 panel's dropped tuck fix, in the only visible slot
  // left (D-TEXT-GOLDEN; the plate's two Mistake tells show the flare).
  { key: 'flare', text: 'Flaring the ribcage. Tuck the pelvis under to protect the lower back.', claim: CL.c18 },
];

export default {
  schema: 1,
  id: 'lib_reverse_lunge',
  rev: 1,
  plate: plateSpec,
  handling: { archetype: 'none', why: 'D-SHIP-GRIP: the card gives no thumb, contact or wrist claim.' },
  contacts: ['standing-feet'],
  setup: [
    { kind: 'position', text: 'Dumbbells at your sides, feet about hip to shoulder width apart.',
      claim: C(['CONSENSUS'], [ACE, CAT], 'c1, c11 (card grip.type)') },
    { kind: 'position', text: 'Step one foot back, a full-length step.', claim: C(['CONSENSUS'], [ACE, CAT], 'c1, c7') },
    // D-TEXT-GOLDEN (#385 6637650243) and the W2 panel: the posture checkpoint 'Weight even' (c3) is said here too; the
    // plate's 'Weight even' cue now says "at the bottom" as well (W2 fix round, #385 6648438434).
    { kind: 'position', text: 'Lower the back knee slowly, chest up. Weight even at the bottom.', zoom: 'trunk',
      claim: C(['CONSENSUS'], [ACE, CAT], 'c4, c3') },
    { kind: 'position', text: 'Press the front foot down, swing the back leg forward to stand.', claim: CL.c5 },
    { kind: 'finish', text: 'Alternate legs, or finish all reps on one side before switching.', claim: CL.c12 },
  ],
  posture: [
    { key: 'shin', label: 'Front shin vertical', detail: 'Front shin roughly vertical at the bottom.',
      anchor: { landmark: 'knee.r', pose: 'end' }, zoom: 'front-shin', claim: CL.c2 },
    // Q-W2-12: handlingMistake 'Leaning the chest forward' (c6) merged here, its fix added
    { key: 'trunk', label: 'Trunk upright', detail: 'Trunk upright. Go lighter until you can stay upright and controlled.',
      anchor: { landmark: 'sternum', pose: 'end' }, zoom: 'trunk', claim: C(['CONSENSUS'], [CAT], 'c3, c6') },
    // Q-W2-12: handlingMistakes 'Flaring the ribcage' (c18) and 'Dropping fast into the bottom' (c7, c16)
    { key: 'ribcage', label: 'Flaring the ribcage', detail: 'Tuck the pelvis under as you step back.',
      anchor: { landmark: 'chest', pose: 'end' }, claim: CL.c18 },
    { key: 'drop', label: 'Dropping fast', detail: 'Lower slowly. Use a weight that lets you move smoothly.',
      anchor: { landmark: 'hip.r', pose: 'end' }, claim: C(['CONSENSUS'], [CAT, PEL], 'c7, c16') },
    { key: 'weight', label: 'Weight even', detail: 'At the bottom, share the weight about evenly between both feet.',
      anchor: { landmark: 'buttock', pose: 'end' }, claim: CL.c3 },
  ],
  feel,
  zooms,
  chips: ['trunk', 'front-shin', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'Dumbbells at your sides, feet about hip to shoulder width. Step one foot back, a full-length step.',
    mistakeLine: 'Never let the chest pitch forward. Go lighter until you stay upright and controlled.',
    cueLine: 'Chest up, front shin vertical.',
    // D-LIB5-VARIANT: c11 (dumbbells at the sides, or a barbell); the card's plate.variantLine: c1-c5 hold for both.
    variantLine: 'Same form with a barbell instead of dumbbells.',
  },
  redFlag: RED_FLAG,
  mistakes: [],   // Q-W2-12 (#379 6628699724): the card's handlingMistakes are posture checkpoints above
  risks: RISKS,
  riskFlags: ['knee'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/reverse_lunge.json', rev: 1 },
};
