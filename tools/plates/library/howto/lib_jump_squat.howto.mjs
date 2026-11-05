// LIB-SHIP W5: the How-to content of lib_jump_squat (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/jump_squat.json; its claim ids are named on each field's claim.
// Handling: none (card archetype.hand 'none', grip note: arms by the sides, j1, or hands loosely at the chest, j10; the
// plate draws the hands at the chest; every grip field empty, so no hand claim and no hand zoom).
// Family (card parent box_jump, inherit[] plate.frames only; SHIP W5 PLAN RULED Q-W5-2): box_jump is held (Q-W2-6, S3),
// so this sheet is written and staged and ships with box_jump. plate.frames is plate-only (no sheet path, Q-W5-3).
// Tier A way out (Q-W5-4): the card's tierA.wayOut (j15, j7) is the setup line, word for word; the safety checker reads
// it there.
// Zooms: one per card zoom. landing's Wrong is the plate's drawn Mistake (straight, locked knees, j5). take-off's Right
// is the plate's own full-extension pose (the spec's ghost, POSES.ext, j3) and its Wrong is that pose with the hips
// still bent (still below).
// Q-W2-12 (#379 6628699724): the card's handlingMistakes are posture checkpoints (mapped below); D-TEXT-GOLDEN: every
// card posture point and handlingMistake claim is also in a shown slot (LIB-SHIP W5 notes, G1 table). The knee cave on
// landing (j16) needs a front view: a text checkpoint, shown in the risks.
// Red flag: the card's redFlags (knee), golden B's shared knee block, linked by the knee row.
import plateSpec, { POSES, SIZES } from '../specs/jump_squat.mjs';
import { landmarksOf } from '../engine.mjs';
import { RED_FLAG, RED_FLAG_KNEE } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_KNEE };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'ace-squatjumps': { cite: 'Squat Jumps (ACE Exercise Library)', url: 'https://www.acefitness.org/resources/everyone/exercise-library/116/squat-jumps/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'cat-squatjump': { cite: 'Catalyst Athletics, Squat Vertical Jump (Exercise Library)', url: 'https://www.catalystathletics.com/exercise/555/Squat-Vertical-Jump/',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'nasm-boxjump': { cite: 'NASM Exercise Library, Box Jumps', url: 'https://www.nasm.org/resource-center/exercise-library/box-jumps',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'hewett-2005': { cite: 'Biomechanical measures of neuromuscular control and valgus loading of the knee predict anterior cruciate ligament injury risk in female athletes: a prospective study (2005)', url: 'https://pubmed.ncbi.nlm.nih.gov/15722287/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'MECH' },
  'nhs-knee': { cite: 'NHS, Knee pain', url: 'https://www.nhs.uk/conditions/knee-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  // RED_FLAG_KNEE's own source (layers/howto/shared.mjs), as golden B's leg_press lists it: the card's redFlags 'knee'.
  'nhs-knee-pain': { cite: 'NHS, Knee pain', url: 'https://www.nhs.uk/symptoms/knee-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When knee pain needs a check.' },
};
// Not cited: devita-1992 (j11) and wernli-2016 (j12), landing-force studies; the plate's tells carry them, no field here
// restates them. j9 (rebound, 3-5 reps) and j18 (box-jump straight knees) are restated by no field either.

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const ACE = 'ace-squatjumps';
const CL = {
  j2: C(['CONSENSUS'], [ACE], 'j2'),
  j3: C(['CONSENSUS'], [ACE], 'j3'),
  j4: C(['CONSENSUS'], [ACE], 'j4'),
  j5: C(['CONSENSUS'], [ACE], 'j5'),
  j6: C(['CONSENSUS'], [ACE], 'j6'),
  j7: C(['CONSENSUS'], [ACE], 'j7'),
  j8: C(['CONSENSUS'], [ACE], 'j8'),
  j13: C(['CONSENSUS', 'WEAK'], [ACE], 'j13'),
  j14: C(['CONSENSUS'], ['nhs-knee'], 'j14'),
  j16: C(['MECH', 'WEAK'], ['hewett-2005'], 'j16'),
  j17: C(['MECH'], [ACE], 'j17'),
  wayOut: C(['CONSENSUS', 'MECH'], ['nasm-boxjump', ACE], 'card tierA.wayOut: j15, j7 (copy.setupLine)'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: the take-off crouch (start, j2), the full extension (the ghost, POSES.ext, j3), the
// landing (end, j4, j8) and the spec's Mistake pose (card plate.mistake, j5: landing on straight, locked knees), which is
// the card zoom landing's Wrong. One new still:
//   'hips-bent' (card zoom take-off Wrong, j3: "Jumping with the hips still bent"): the full-extension pose with the
//         pelvis and trunk pitched BEND deg forward (hip flexion), the feet on the same balls (the spec's plant IK),
//         the hands moved with the chest by the spec's own rule (j10: HAND_FWD in front of the sternum, HAND_X of the
//         shoulder width; copied from jump_squat.mjs chestHands, never imported).
// DRAWING VALUE (D-SHIP-DRAWVAL, #376 6614695581; precedent D-LIB7-2 and lib_reverse_lunge's LEAN 30 deg): BEND 30 deg is
// a Wrong-pose size no card gives; no number from it appears in user copy; the layers panel judges it.
const H = 1.75, BEND = 30;
const sub3 = (a, b) => a.map((v, i) => v - b[i]), unit3 = a => { const n = Math.hypot(...a); return a.map(v => v / n); };
const chestHands = p => {
  const { reach, ...q } = p, l = landmarksOf(q, H), n = unit3(sub3(l.sternum, l.backUpper));
  const at = sd => [l[`shoulder.${sd}`][0] * SIZES.HAND_X, l.sternum[1] + n[1] * SIZES.HAND_FWD, l.sternum[2] + n[2] * SIZES.HAND_FWD];
  return { ...q, reach: { l: { at: at('l'), pole: [0.2, -1, 0] }, r: { at: at('r'), pole: [-0.2, -1, 0] } } };
};
const EXT = POSES.ext, MIS = plateSpec.mistake.pose;
const HIPS_BENT = chestHands({ ...EXT, root: { ...EXT.root, tilt: EXT.root.tilt + BEND } });
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: plateSpec.poses.end },
  ext: { pose: EXT },
  'hips-bent': { pose: HIPS_BENT },
  'straight-knees': { pose: { ...plateSpec.poses.end, ...MIS } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// The zoom shell's shape (callout with an anchor at the landmark it names; pilot-a.closeups.mjs), as box_jump's
// landing-knees; each Wrong is drawn alone (solid). Crop centres (`off`) and `sizePx` are drawing values the layers
// panel judges.
const zooms = [
  {
    key: 'landing', chip: 'Landing', heading: 'Landing', kind: 'posture',
    crop: { center: { at: 'knee.r', pose: 'right', off: [-6, 0] }, sizePx: 180 },
    right: 'end',
    wrong: { base: 'end', pose: MIS, solid: true },
    callout: {
      right: { text: 'Knees bent', anchor: 'knee.r' },
      wrong: { text: 'Locked knees', anchor: 'knee.r' },
    },
    caption: {
      right: 'Mid-foot landing, hips back and down, knees bent.',
      wrong: 'Straight, locked knees on landing.',
    },
    alt: {
      right: 'Side view, landing. Both feet flat, the hips pushed back and down, knees bent, trunk slightly forward.',
      wrong: 'Side view, landing. Both feet flat, the knees straight and locked, the hips high.',
    },
    feelRow: 'knees',
  },
  {
    key: 'take-off', chip: 'Take-off', heading: 'Take-off', kind: 'posture',
    crop: { center: { at: 'hip.r', pose: 'right', off: [0, 10] }, sizePx: 230 },
    right: { base: 'start', pose: EXT },
    wrong: { base: 'start', pose: HIPS_BENT, solid: true },
    callout: {
      right: { text: 'Hips straight', anchor: 'hip.r' },
      wrong: { text: 'Hips bent', anchor: 'hip.r' },
    },
    caption: {
      right: 'Ankles, knees and hips fully extended together.',
      wrong: 'Jumping with the hips still bent.',
    },
    alt: {
      right: 'Side view, take-off. On the balls of the feet, ankles, knees and hips straight, the body tall.',
      wrong: 'Side view, take-off. On the balls of the feet, knees straight but the hips still bent, chest forward.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'quads', plain: 'The thighs drive the jump.' }],
  secondary: [
    { muscleId: 'glutes', plain: 'The buttocks and hips work too.' },
    { muscleId: 'calves', plain: 'The calves extend the ankles at take-off.' },
  ],
  watch: [],
  // The card's first row (thighs and buttocks, j13) has no fix, so it is left off the rows (D-SHIP-Q16).
  feelLine: 'You should feel this in your thighs and buttocks.',
  rows: [
    { key: 'knees', where: 'Knees', at: { parts: ['knee-left', 'knee-right'] },
      means: 'Fault: locked knees or knees shooting far forward on landing.',
      fix: 'Land softly, hips back. Make the jumps smaller.',
      zoom: 'landing', claim: C(['CONSENSUS'], [ACE], 'j5, j6, j4, j7') },
    { key: 'knee', where: 'Very painful, locking or giving-way knee', at: { parts: ['knee-left', 'knee-right'] },
      means: 'Not a training feeling.',
      fix: 'Stop jumping.',
      redFlag: 'knee', claim: CL.j14 },
  ],
  claim: C(['CONSENSUS', 'WEAK', 'MECH'], [ACE], 'j13, j17'),
};

/* ---------------------------------------------------------------- risks (card risks; handlingMistakes are posture, Q-W2-12) */
const RISKS = [
  { key: 'locked', text: 'Locked-knee landings may lead to knee injuries.', claim: CL.j5 },
  { key: 'forward', text: 'Knees travelling far forward on landing add knee stress.', claim: CL.j6 },
  { key: 'cave', text: 'Knees caving inward on landing.', claim: CL.j16 },
];

export default {
  schema: 1,
  id: 'lib_jump_squat',
  rev: 1,
  plate: plateSpec,
  handling: { archetype: 'none' },
  contacts: ['standing-feet'],
  setup: [
    { kind: 'safety', text: 'Learn to squat and land first. Start with small jumps.', claim: CL.j7 },
    { kind: 'brace', text: 'Feet hip width, hands loosely at the chest, brace.',
      claim: C(['CONSENSUS'], [ACE, 'cat-squatjump'], 'j1, j10') },
    { kind: 'position', text: 'Hips back, then down, until the heels are about to lift.', claim: CL.j2 },
    { kind: 'position', text: 'Brief pause, then jump: ankles, knees and hips extend together.', zoom: 'take-off', claim: CL.j3 },
    { kind: 'finish', text: 'Land quietly on the mid-foot, rolling to the heels, hips back.', zoom: 'landing', claim: CL.j4 },
  ],
  posture: [
    { key: 'back', label: 'Back flat', detail: 'Back flat on the way down.',
      anchor: { landmark: 'backUpper', pose: 'start' }, claim: CL.j2 },
    { key: 'extend', label: 'Full extension', detail: 'Ankles, knees and hips extend together.',
      anchor: { landmark: 'hip.r', pose: 'start' }, zoom: 'take-off', claim: CL.j3 },
    { key: 'mid-foot', label: 'Mid-foot landing', detail: 'Land on the mid-foot, rolling to the heels.',
      anchor: { landmark: 'sole.r', pose: 'end' }, zoom: 'landing', claim: CL.j4 },
    // Q-W2-12: handlingMistake 'Landing with locked knees.' (j5, j4) merged here, its fix added
    { key: 'knees-bent', label: 'Knees bent', detail: 'Knees bent on landing, never locked. Land quietly, hips back, knees bending.',
      anchor: { landmark: 'knee.r', pose: 'end' }, zoom: 'landing', claim: C(['CONSENSUS'], [ACE], 'j5, j4') },
    { key: 'trunk', label: 'Trunk slightly forward', detail: 'Trunk slightly forward, head in line on landing.',
      anchor: { landmark: 'sternum', pose: 'end' }, claim: CL.j8 },
    // front-view fault: a text checkpoint
    { key: 'knee-line', label: 'Knees in line', detail: 'Knees do not cave inward on landing.',
      anchor: { landmark: 'knee.r', pose: 'end' }, claim: CL.j16 },
    // Q-W2-12: handlingMistakes 'Knees shooting far forward.' (j6, j4) and 'Big jumps before solid landings.' (j7)
    { key: 'knees-forward', label: 'Knees shooting forward', detail: 'Push the hips back as you land.',
      anchor: { landmark: 'knee.r', pose: 'end' }, claim: C(['CONSENSUS'], [ACE], 'j6, j4') },
    { key: 'small-jumps', label: 'Jumps too big', detail: 'Go back to small jumps until the landing is quiet and controlled.',
      anchor: { landmark: 'hip.r', pose: 'end' }, claim: CL.j7 },
  ],
  feel,
  zooms,
  chips: ['landing', 'take-off', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    // card tierA.wayOut (j15, j7), verbatim
    setupLine: 'Never jump to failure: end the set before fatigue spoils your landings. Only jump more explosively once your landings are mastered.',
    mistakeLine: 'Never land with locked knees. Keep the trunk slightly forward, head in line.',
    cueLine: 'Land soft, hips back.',
  },
  redFlag: RED_FLAG,
  mistakes: [],   // Q-W2-12 (#379 6628699724): the card's handlingMistakes are posture checkpoints above
  risks: RISKS,
  riskFlags: ['knee'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/jump_squat.json', rev: 1 },
};
