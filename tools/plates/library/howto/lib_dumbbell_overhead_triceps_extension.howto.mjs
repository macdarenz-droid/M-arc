// LIB-SHIP W5: the How-to content of lib_dumbbell_overhead_triceps_extension (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/dumbbell_overhead_triceps_extension.json (cited in its field's claim, cN = card claim id).
// GRIP: full from the card (grip.type, width, thumb, handContact, wrist; c1, c4, c7). The shared cupped-thumb card's
// cupped grip line (docs/research/howto/shared/cupped-thumb.json gripLine) is not printed (Extra 8): this card's own
// grip is both hands wrapped round the handle (c1), palms up, the dumbbell hanging vertically (c4). Healthline's hold on
// the inside of the plate (c2) is not offered (card gripNote: thumbless over the body).
// No hand zoom (D-SHIP-C3 no-zoom list, gap-key on tools/plates/library/hands/no-zoom.json): the cupped key lists this id
// in GAPS (tools/plates/library/hands/hand-cupped.mjs:30, no hand fault sourced for the cupped grip). The card's hand
// zoom `db-oh-hands` right line ("Both hands wrapped round the handle, dumbbell hanging vertically", c1, c4) lives in
// handling.gripLine and setup step 3.
// Zooms: the card's posture zoom `db-oh-elbows` (c5, c6), panel item L7. Its Right is drawn as the card says (spec
// start: upper arms vertical, 90 degree bend, dumbbell clear of the head). Its Wrong is drawn for the first half only,
// "Upper arms dropped back": the second half ("dumbbell touching the head") cannot be drawn on this plate. In the side
// view the forearm at the 90 degree bottom sits about 24 cm behind the back of the skull, and swinging the upper arms
// back moves the dumbbell further from the head; no pose of this rig puts the dumbbell against the head. That half
// stays in text (posture `depth`, the plate's 'Stop at 90°' cue "clear of the back of your head"). QUESTION 2 (notes).
// Way out: a tier-A way-out GAP (card gaps[0]: no read source describes getting the dumbbell overhead and back down;
// Q-W5-4). No way-out line is written; the safety checker rules it. The spotter line (setup 5) is the card's posture
// point c13, not a way out of the gap.
// Pose map: spec start = the bottom (card end, c5), spec end = the top (card start, c4) (D-LIB15-POSE, the spec's header).
// Red flags: the card's redFlags (elbow, back, shoulder). The elbow and shoulder boxes are golden B's shared blocks; the
// back box is LIB-5's (tools/plates/library/shared/back-box.mjs), linked by the lower-back row's redFlag: 'back'.
// No variant line (exercises.json equipment 'Dumbbell', no '/'); the seated version (c11) is in setup step 2.
import plateSpec from '../specs/dumbbell_overhead_triceps_extension.mjs';
import { RED_FLAG, RED_FLAG_ELBOW, RED_FLAG_SHOULDER } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_ELBOW, RED_FLAG_SHOULDER };

/* ---------------------------------------------------------------- sources (the card's sources) ------------------- */
export const SOURCES = {
  'ace-oh-ext': { cite: 'Triceps Extension (ACE Exercise Library)', url: 'https://www.acefitness.org/resources/everyone/exercise-library/74/triceps-extension/',
    kind: 'guideline', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'healthline-ote': { cite: 'How to Do Proper Overhead Tricep Extensions (Healthline; written by Travis Edwards, PT, medically reviewed by Jake Tipane, CPT)', url: 'https://www.healthline.com/health/fitness/overhead-triceps-extension',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'motra-db-oh': { cite: 'Dumbbell Overhead Triceps Extension, Exercise Guide (Motra)', url: 'https://motra.com/exercises/dumbbellOverheadTricepsExtension',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'alves-2018': { cite: 'Effect of shoulder position on triceps brachii heads activity in dumbbell elbow extension exercises', url: 'https://pubmed.ncbi.nlm.nih.gov/28677940/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-22', use: 'DATA' },
  'kerr-2010': { cite: 'Epidemiology of weight training-related injuries presenting to United States emergency departments, 1990 to 2007', url: 'https://pubmed.ncbi.nlm.nih.gov/20139328/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-22', use: 'WEAK' },
  'gaviria-2020': { cite: 'Triceps Tendon Ruptures: Risk Factors, Treatment, and Rehabilitation', url: 'https://pubmed.ncbi.nlm.nih.gov/32539261/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-22', use: 'CONSENSUS' },
  'acsm-2009': { cite: 'American College of Sports Medicine position stand. Progression models in resistance training for healthy adults', url: 'https://pubmed.ncbi.nlm.nih.gov/19204579/',
    kind: 'guideline', access: 'abstract', checked: '2026-10-22', use: 'CONSENSUS' },
  // The push key's own source for the wrist range (c7 gives no degrees): a drawing convention, data only.
  'ga-push-heel': { cite: 'LIB-7 push hand convention, pairs.mjs CONVENTIONS ga:push-heel: heel of the palm, extension 0 to 15', url: 'tools/plates/library/hands/pairs.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-05', use: 'CONVENTION' },
  // RED_FLAG_ELBOW's and RED_FLAG_SHOULDER's own sources (layers/howto/shared.mjs), as golden B lists them.
  'nhs-elbow-pain': { cite: 'NHS, Elbow and arm pain', url: 'https://www.nhs.uk/symptoms/elbow-and-arm-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When elbow pain needs a check.' },
  'nhs-shoulder-pain': { cite: 'NHS, Shoulder pain', url: 'https://www.nhs.uk/conditions/shoulder-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When shoulder pain needs a check.' },
  // The back box's own source (shared/back-box.mjs, docs/research/howto/shared/back-pain-box.json sources): the card's redFlags 'back'.
  'nhs-back': { cite: 'NHS, Back pain', url: 'https://www.nhs.uk/conditions/back-pain/',
    kind: 'guideline', access: 'full', checked: '2026-10-02', use: 'CONSENSUS', note: 'When back pain needs a check.' },
};
// Not cited: c2 (the plate hold, not offered: card gripNote), c18 (tempo and breathing, a plate drawing convention).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const ACE = 'ace-oh-ext', HL = 'healthline-ote', MO = 'motra-db-oh';
const CL = {
  c1: C(['CONSENSUS'], [ACE], 'card c1'),
  c3: C(['CONSENSUS'], [ACE], 'card c3'),
  c4: C(['CONSENSUS'], [ACE], 'card c4'),
  c7: C(['CONSENSUS'], [ACE], 'card c7'),
  c8: C(['CONSENSUS'], [HL], 'card c8'),
  c13: C(['CONSENSUS', 'WEAK'], [MO], 'card c13'),
  c14: C(['DATA'], ['alves-2018'], 'card c14'),
  c15: C(['WEAK'], ['kerr-2010'], 'card c15'),
  c16: C(['CONSENSUS', 'WEAK'], ['gaviria-2020'], 'card c16'),
  c17: C(['CONSENSUS'], ['acsm-2009'], 'card c17'),
  hands: C(['CONSENSUS'], [ACE], 'card c1, c4 (grip.handContact; card zoom db-oh-hands right)'),
  stance: C(['CONSENSUS'], [MO, ACE], 'card c11, c1'),
  start: C(['CONSENSUS'], [ACE], 'card c3, c4'),
  // K2 (w5-content): 'still' and 'only the elbows bend' are c7; c12 stays for 'no flaring' in the detail.
  vertical: C(['CONSENSUS', 'WEAK'], [ACE, MO], 'card c6, c7, c12'),
  depth: C(['CONSENSUS'], [ACE], 'card c5, c6 (posture c5; the undrawn half of card zoom db-oh-elbows)'),
  brace: C(['CONSENSUS'], [HL, ACE], 'card c9, c3'),
  arch: C(['CONSENSUS'], [HL, ACE], 'card c9, c3'),
  flare: C(['CONSENSUS', 'WEAK'], [ACE, MO], 'card c6, c5, c12'),
  swing: C(['CONSENSUS', 'WEAK'], [HL, MO, ACE], 'card c10, c12, c7'),
  shoulderRow: C(['CONSENSUS'], [HL], 'card c9'),
  elbowRow: C(['CONSENSUS', 'WEAK'], ['gaviria-2020', MO], 'card c16, c19'),
};

/* ------------------------------------------------------------------------------------------------ hand ---------- */
// c7 ("avoid changing the position of your ... wrists") gives no degrees. The wrist range is the push key's convention
// (the card's hand archetype is push), DERIVED at import from the convention text, as lib_triceps_pushdown does, so it
// cannot drift; data only, never printed (D-SHIP-CONVCOPY). pairs.mjs is not imported (its closure pulls
// howto-layers.mjs, which the MANIFEST closure cannot follow); the text is copied here.
const PUSH_HEEL = 'GA 3.1 push: heel of the palm, low, over the forearm; extension 0 to 15';   // CONVENTIONS['ga:push-heel']
// The card's grip.handContact names no palm zone, so the contact is the same convention's zone, DERIVED the same way
// (lib_triceps_pushdown's CONTACT_OF_ZONE form), never a judgement of where the handle sits.
const CONTACT_OF_ZONE = { 'heel of the palm': 'heel' };   // convention zone words -> HandContact
const CONTACT = Object.entries(CONTACT_OF_ZONE).find(([zone]) => PUSH_HEEL.includes(zone))?.[1];
const EXT = PUSH_HEEL.match(/extension (\d+) to (\d+)/)?.slice(1).map(Number);
if (!CONTACT || !EXT) throw new Error(`lib_dumbbell_overhead_triceps_extension: pairs.mjs CONVENTIONS ga:push-heel has no mapped contact or range: ${PUSH_HEEL}`);

/* --------------------------------------------------------------------------------------- posture stills --------- */
// 'arms-back' (card zoom db-oh-elbows Wrong, first half: "Upper arms dropped back"; c5: stop "when the upper arms
// start to move back", c6): the 90 degree bottom (spec start) with the upper arms swung back DROP past the spec's
// vertical SH_FLEX, the elbow bend kept, so only the upper arms move. The second half ("dumbbell touching the head") is
// not drawn: no pose of this rig puts the dumbbell on the head (header); it stays in text (posture `depth`, the plate's
// 'Stop at 90°' cue). Panel item L7, QUESTION 2 in the notes.
// DRAWING VALUES (D-SHIP-DRAWVAL, #376 6614695581; precedent D-LIB7-2 and lib_plank's OFF_ELBOW 25 deg, which is
// rope_triceps_pushdown's spec MIS_SHOULDER, an upper arm swung off its line): DROP 25 deg is a Wrong-pose size no card
// gives; no number from it appears in user copy; the layers panel judges it.
const START = plateSpec.poses.start, DROP = 25;
const ARMS_BACK = { shoulder: { ...START.shoulder, flex: START.shoulder.flex + DROP } };
export const stills = {
  start: { pose: START },
  end: { pose: plateSpec.poses.end },
  'arms-back': { pose: { ...START, ...ARMS_BACK } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// The card's posture zoom db-oh-elbows (c5, c6), on this row's own plate (spec start = the 90 degree bottom). Its hand
// zoom db-oh-hands is not built (gap-key, D-SHIP-C3; QUESTION 1 in the notes).
const zooms = [
  {
    key: 'db-oh-elbows', chip: 'Upper arms', heading: 'Upper arm position', kind: 'posture',
    // zoom shell (render/closeup/crop.mjs): the Wrong is the arms-back still drawn alone (solid), as
    // `stills['arms-back']`; crop centre between the right pose's elbow and the dumbbell behind the head.
    crop: { center: { at: 'elbow.r', pose: 'right', off: [-30, 15] }, sizePx: 170 },
    right: 'start',
    wrong: { base: 'start', pose: ARMS_BACK, solid: true },
    callout: {
      right: { text: 'Arms vertical', anchor: 'elbow.r' },
      wrong: { text: 'Arms dropped back', anchor: { at: 'elbow.r', pose: 'mistake' } },
    },
    caption: {
      right: 'Upper arms vertical, dumbbell clear of the head at 90°.',   // card zooms[1] right (c5, c6)
      wrong: 'Upper arms dropped back.',                                  // card zooms[1] wrong, first half (c5, c6)
    },
    alt: {
      right: 'Side view, bottom of the lowering. Upper arms vertical, elbows bent to about 90 degrees, dumbbell clear of the head.',   // c5, c6
      wrong: 'Side view, bottom of the lowering. The upper arms have swung back behind the head instead of staying vertical.',                // c5, c6
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'triceps', plain: 'The long and lateral heads of the triceps work.' }],
  secondary: [],   // the card names none (its libraryDiff)
  watch: [],
  feelLine: 'You should feel this in the back of your upper arms.',
  rows: [
    // The card's first row (back of the upper arm) has no fix, so it is left out: the feel line says it (D-SHIP-Q16).
    { key: 'lower-back', where: 'Lower back', at: { muscles: ['lower_back'] },
      means: 'You are arching your back.',
      fix: 'Brace and use a lighter dumbbell.',
      redFlag: 'back', claim: CL.arch },
    { key: 'shoulders', where: 'Shoulders', at: { muscles: ['front_delts', 'side_delts'] },
      means: 'You arch your back under a heavy weight.',
      fix: 'Use a lighter dumbbell.',
      redFlag: 'shoulder', claim: CL.shoulderRow },
    { key: 'elbow', where: 'Back-of-elbow pain', at: { parts: ['elbow-left', 'elbow-right'] },
      means: '',   // D-FEEL-NOMEANS (audit6 issue 1): c16 is about ruptures in general and c19 lists elbow pain only; no claim ties this pain to a cause
      fix: "Stop the set. Don't train through the pain.",   // c19 (card fixNote)
      redFlag: 'elbow', claim: CL.elbowRow },
  ],
  claim: CL.c14,
};

/* ------------------------------------------------------------------------------------------------ mistakes, risks */
const MISTAKES = [
  { key: 'arch', title: 'Arching the back', claim: CL.arch,
    fix: 'Brace. If the back still arches, use a lighter dumbbell.' },
  { key: 'flare', title: 'Elbows flare, upper arms move', zoom: 'db-oh-elbows', claim: CL.flare,
    fix: 'Keep upper arms vertical, elbows shoulder-width. Stop lowering if they move.' },
  // D-TEXT-GOLDEN: posture still (c7: head, torso, wrists and feet still) placed here with the card fix (c10)
  { key: 'swing', title: 'Swinging the weight with momentum', claim: CL.swing,
    fix: 'Slow down, no momentum. Keep head, torso, wrists and feet still.' },
];
const RISKS = [
  { key: 'dropped', text: 'Across weight training, dropped weights are the most common way people get badly hurt.', claim: CL.c15 },
  { key: 'tendon', text: 'Triceps tendon rupture (rare), often from forceful lowering or lifting against resistance.', claim: CL.c16 },
  { key: 'progress', text: 'Beat target by one or two reps? Add 2 to 10 percent.', claim: CL.c17 },
];

export default {
  schema: 1,
  id: 'lib_dumbbell_overhead_triceps_extension',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'push',
    why: 'D-SHIP-C3 no-zoom list: the cupped key lists dumbbell_overhead_triceps_extension in GAPS (hand-cupped.mjs:30; no hand fault sourced for the cupped grip); the grip copy carries c1 and c4.',
    // orientation left out: c4 says palms face up overhead, which names no forearm rotation of the enum.
    handle: 'dumbbell',        // c1: one dumbbell (the spec's vendor dumbbell, axis vertical)
    loadAxis: 'along-forearm', // card archetype.loadAxis
    overBody: true,            // card archetype.overBody: the dumbbell is held over the head (c4)
    // No width text: card grip.width (both hands together on the handle) is the Grip line's 'both hands wrapped round
    // the handle' (audit6 issue 6).
    thumb: { mode: 'wrapped', claim: CL.c1 },   // card grip.thumb: wrapped around the handle (c1)
    // card grip.handContact: "Both hands around the handle, palms facing up" (c1, c4) names no palm zone. CONTACT is
    // 'heel', DERIVED from pairs.mjs CONVENTIONS ga:push-heel (CONVENTION, the card's push archetype; Q-W2-2 form). Data
    // only: not drawn (no hand zoom), never printed (D-SHIP-CONVCOPY).
    contact: CONTACT,
    // card grip.wrist: held still throughout (c7). EXT is the push key's convention range, read above, data only.
    wrist: { ext: EXT, limitText: 'Keep your wrists still throughout.',
      claim: C(['CONSENSUS', 'CONVENTION'], [ACE, 'ga-push-heel'], 'card c7. The ext range is pairs.mjs CONVENTIONS ga:push-heel, a convention, not a card number.') },
    faults: [
      // card zoom db-oh-hands wrong (c1, c4; the card's wrongNote: the inverse of c1). Not drawn (no hand zoom).
      { key: 'not-wrapped', label: 'Hands not wrapped', pose: {}, markers: [], alt: 'Hands not wrapped round the handle.' },
    ],
    // card zoom db-oh-hands right (c1, c4); c4: palms facing up at the top.
    gripLine: 'One dumbbell, both hands wrapped round the handle. Palms up, dumbbell hanging vertically.',
    cue: 'Both hands round handle, palms up.',   // hint I (c1, c4)
  },
  contacts: ['standing-feet'],
  setup: [
    { kind: 'load', text: 'Pick a dumbbell you can get overhead safely.', claim: CL.c8 },
    { kind: 'position', text: 'Stand in a split stance, or sit on a back-supported bench.', claim: CL.stance },
    { kind: 'grip', text: 'Wrap both hands round the handle, dumbbell hanging vertically.', claim: CL.hands },
    // The card's setup steps 4 and 5 (c3, c4) in one; the rest of c3 (shoulders down and back, head in line) is the
    // plate's own 'Braced torso' callout.
    { kind: 'brace', text: 'Brace. Arms vertical, dumbbell over your head, elbows forward, not locked.', claim: CL.start },
    // D-TEXT-GOLDEN: posture spotter (c13) placed here
    { kind: 'safety', text: 'For heavy sets, a spotter can help by supporting your elbows.', claim: CL.c13 },
  ],
  posture: [
    { key: 'vertical', label: 'Arms vertical', detail: 'Upper arms vertical and still, elbows shoulder-width apart, no flaring.',
      anchor: { landmark: 'elbow.r', pose: 'start' }, zoom: 'db-oh-elbows', claim: CL.vertical },
    // The card's spotter point (c13) is setup step 5, word for word, so it is not repeated here (audit6 'other').
    // The card zoom db-oh-elbows' undrawn half (dumbbell touching the head) is text here, with the card's c5 point.
    { key: 'depth', label: 'Stop at 90°', detail: 'Lower slowly behind your head to about 90°, without touching it.',
      anchor: { landmark: 'grip.r', pose: 'start' }, zoom: 'db-oh-elbows', claim: CL.depth },
    { key: 'brace', label: 'Braced torso', detail: "Torso braced. Don't arch your back.",
      anchor: { landmark: 'lumbar', pose: 'end' }, claim: CL.brace },
    { key: 'still', label: 'Body still', detail: 'Head, torso, wrists and feet stay still.',
      anchor: { landmark: 'head', pose: 'end' }, claim: CL.c7 },
    { key: 'lockout', label: 'Soft lockout', detail: 'Straighten without locking the elbows.',
      anchor: { landmark: 'elbow.r', pose: 'end' }, claim: CL.c4 },
  ],
  feel,
  zooms,
  chips: ['db-oh-elbows', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'One dumbbell in both hands, in a split stance or on a back-supported bench.',
    mistakeLine: 'Keep your upper arms vertical. Brace, and go lighter if your back arches.',
    cueLine: 'Upper arms still, only elbows bend.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['elbow', 'back', 'shoulder'],   // the card's redFlags, in its order
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/dumbbell_overhead_triceps_extension.json', rev: 1 },
};
