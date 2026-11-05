// LIB-SHIP W5: the How-to content of lib_pistol_squat (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/pistol_squat.json; its claim ids are named on each field's claim.
// Handling: none (card archetype.hand 'none', grip note: arms reach forward for balance, p1; every grip field empty, so
// no hand claim and no hand zoom).
// Tier A way out (SHIP W5 PLAN RULED Q-W5-4): the card's tierA.wayOut ("A box behind you to sit onto, or a support to
// hold, while learning.", p7) is the setup line, word for word; the safety checker reads it there.
// Zooms: the card's standing-foot zoom is drawn from the plate's own poses (its Wrong is the plate's drawn Mistake, the
// standing heel lifting, p8). The card's box-pistol zoom (p7) has no Wrong (card wrong null) and needs a box the plate
// does not draw; it is the way out above (a regression, D-TEXT-PROGRESSION: no posture checkpoint).
// Q-W2-12 (#379 6628699724): the card's handlingMistakes are posture checkpoints (mapped below); D-TEXT-GOLDEN: every
// card posture point and handlingMistake claim is also in a shown slot (LIB-SHIP W5 notes, G1 table). The knee cave
// (p8) needs a front view (the spec's pilot note), so it is a text checkpoint shown in the mistake line.
// Red flag: the card's redFlags (knee), golden B's shared knee block, linked by the knee row.
import plateSpec from '../specs/pistol_squat.mjs';
import { RED_FLAG, RED_FLAG_KNEE } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_KNEE };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'rep-pistol': { cite: 'The Ultimate Guide for Nailing The Pistol Squat (REP Fitness)', url: 'https://repfitness.com/blogs/training/how-to-do-pistol-squats',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'physitrack-pistol': { cite: 'Step-by-step guide to the pistol squat exercise (Physitrack)', url: 'https://www.physitrack.com/exercise-library/how-to-perform-the-pistol-squat-exercise',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'nhs-knee': { cite: 'NHS, Knee pain', url: 'https://www.nhs.uk/conditions/knee-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  // RED_FLAG_KNEE's own source (layers/howto/shared.mjs), as golden B's leg_press lists it: the card's redFlags 'knee'.
  'nhs-knee-pain': { cite: 'NHS, Knee pain', url: 'https://www.nhs.uk/symptoms/knee-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When knee pain needs a check.' },
};
// Not cited: p11 (adding weight as a counterbalance; a progression, no field here restates it).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const REP = 'rep-pistol', PT = 'physitrack-pistol';
const CL = {
  p1: C(['CONSENSUS'], [REP], 'p1'),
  p2: C(['CONSENSUS'], [REP], 'p2'),
  p3: C(['CONSENSUS'], [REP], 'p3'),
  p5: C(['CONSENSUS'], [PT], 'p5'),
  p6: C(['CONSENSUS'], [PT], 'p6'),
  p7: C(['CONSENSUS'], [REP], 'p7'),
  p8: C(['CONSENSUS'], [REP], 'p8'),
  p9: C(['CONSENSUS'], [REP], 'p9'),
  p10: C(['CONSENSUS'], [REP], 'p10'),
  p12: C(['CONSENSUS'], ['nhs-knee'], 'p12'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: the start (p1), the bottom (p2, p3, p5) and the spec's Mistake pose (card
// plate.mistake, p8: the standing heel lifted at the bottom), which is the card zoom standing-foot's Wrong. No new
// geometry, so no drawing value (D-SHIP-DRAWVAL) is added here.
const END = plateSpec.poses.end, MIS = plateSpec.mistake.pose;
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  'heel-up': { pose: { ...END, ...MIS } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// The zoom shell's shape (callout with an anchor at the landmark it names; pilot-a.closeups.mjs), as box_jump's
// landing-knees. The crop is centred above the standing foot of the bottom pose (centre `off` and `sizePx` are drawing
// values the layers panel judges); the Wrong is the plate's Mistake drawn alone (solid).
const zooms = [
  {
    key: 'standing-foot', chip: 'Foot', heading: 'Standing foot', kind: 'posture',
    crop: { center: { at: 'ankle.r', pose: 'right', off: [6, -20] }, sizePx: 130 },
    right: 'end',
    wrong: { base: 'end', pose: MIS, solid: true },
    callout: {
      right: { text: 'Heel down', anchor: 'heel.r' },
      wrong: { text: 'Heel lifts', anchor: 'heel.r' },
    },
    caption: {
      right: 'Standing foot flat at the bottom.',
      wrong: 'Heel lifted.',
    },
    alt: {
      right: 'Side view, bottom of the pistol squat. The standing foot is flat, heel down, the knee fully bent.',
      wrong: 'Side view, bottom of the pistol squat. The standing heel has lifted off the floor, the knee forward.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'quads', plain: 'The front of the standing thigh does the main work.' }],
  secondary: [
    { muscleId: 'glutes', plain: 'The glutes steady the hips and help you stand.' },
    { muscleId: 'adductors', plain: 'The inner thigh of the working leg steadies the knee.' },
  ],
  watch: [],
  // The card's first row (front of the standing thigh, p10) has no fix, so it is left off the rows (D-SHIP-Q16).
  feelLine: 'You should feel this in the front of your standing thigh.',
  rows: [
    // the card row's fix (p9, p7) with handlingMistake 'Pushing through knee pain.' fix (p9) folded in (D-TEXT-GOLDEN)
    { key: 'knee-discomfort', where: 'Knee discomfort', at: { parts: ['knee-left', 'knee-right'] },
      means: 'The deep single-leg bend is too much for now.',
      fix: 'Back off and check your form. Use a box, support or easier version.',
      claim: C(['CONSENSUS'], [REP], 'p9, p7') },
    { key: 'knee', where: 'Very painful, locking or giving-way knee', at: { parts: ['knee-left', 'knee-right'] },
      means: 'Not a training feeling.',
      fix: 'Stop the set.',
      redFlag: 'knee', claim: CL.p12 },
  ],
  libraryDiff: { add: ['adductors'], drop: ['abductors'], why: 'The card names the working leg\'s adductors as helpers (p10); no source read names the abductors (card libraryDiff, for the supervisor).' },
  claim: CL.p10,
};

/* ---------------------------------------------------------------- risks (card risks; handlingMistakes are posture, Q-W2-12) */
const RISKS = [
  { key: 'knee-demand', text: 'High knee demand in the deep single-leg bend.', claim: CL.p9 },
  { key: 'basics', text: 'Advanced skill: attempting it before the basics.', claim: CL.p6 },
];

export default {
  schema: 1,
  id: 'lib_pistol_squat',
  rev: 1,
  plate: plateSpec,
  handling: { archetype: 'none' },
  contacts: ['standing-feet'],
  setup: [
    { kind: 'safety', text: 'Master air squats and single-leg balance first.', claim: C(['CONSENSUS'], [PT, REP], 'p6, p7') },
    { kind: 'position', text: 'Stand tall, arms forward, and shift onto one leg.', claim: CL.p1 },
    { kind: 'position', text: 'Lift the other leg forward, knee straight.', claim: C(['CONSENSUS'], [REP, PT], 'p1, p5') },
    { kind: 'brace', text: 'Brace, then send the hips back and bend the knee.', claim: CL.p2 },
    { kind: 'position', text: 'Go as low as mobility allows, foot flat. Press up, no bounce.', zoom: 'standing-foot',
      claim: C(['CONSENSUS'], [REP], 'p3, p4, p8') },
  ],
  posture: [
    { key: 'arms', label: 'Arms forward', detail: 'Arms forward for balance.',
      anchor: { landmark: 'grip.r', pose: 'end' }, claim: CL.p1 },
    { key: 'free-leg', label: 'Free leg straight', detail: 'Free leg straight, off the floor.',
      anchor: { landmark: 'knee.l', pose: 'end' }, claim: CL.p5 },
    { key: 'hips', label: 'Hips back', detail: 'Hips go back as the knee bends.',
      anchor: { landmark: 'buttock', pose: 'end' }, claim: CL.p2 },
    { key: 'heel', label: 'Heel down', detail: 'Standing foot flat, heel down.',
      anchor: { landmark: 'heel.r', pose: 'end' }, zoom: 'standing-foot', claim: CL.p3 },
    { key: 'depth', label: 'Depth', detail: 'As deep as mobility allows.',
      anchor: { landmark: 'hip.r', pose: 'end' }, claim: CL.p3 },
    // front-view fault (the spec's pilot note): a text checkpoint
    { key: 'knee', label: 'Knee in line', detail: 'Knee does not cave inward.',
      anchor: { landmark: 'knee.r', pose: 'end' }, claim: CL.p8 },
    // Q-W2-12: handlingMistakes 'Bouncing out of the bottom.' (p8), 'Attempting it before the basics.' (p6, p7) and
    // 'Pushing through knee pain.' (p9)
    { key: 'bounce', label: 'Bouncing at bottom', detail: 'Lower slowly and stand without a bounce.',
      anchor: { landmark: 'hip.r', pose: 'end' }, claim: CL.p8 },
    { key: 'basics', label: 'Skipping the basics', detail: 'Master air squats and single-leg balance, then use a box.',
      anchor: { landmark: 'hip.r', pose: 'start' }, claim: C(['CONSENSUS'], [PT, REP], 'p6, p7') },
    { key: 'knee-pain', label: 'Pushing through pain', detail: 'Back off, check your form, or use an easier version.',
      anchor: { landmark: 'knee.r', pose: 'end' }, claim: CL.p9 },
  ],
  feel,
  zooms,
  chips: ['standing-foot', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'A box behind you to sit onto, or a support to hold, while learning.',   // card tierA.wayOut (p7), verbatim
    mistakeLine: 'Never bounce out of the bottom. Keep the knee from caving inward.',
    cueLine: 'Arms forward, heel down.',
  },
  redFlag: RED_FLAG,
  mistakes: [],   // Q-W2-12 (#379 6628699724): the card's handlingMistakes are posture checkpoints above
  risks: RISKS,
  riskFlags: ['knee'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/pistol_squat.json', rev: 1 },
};
