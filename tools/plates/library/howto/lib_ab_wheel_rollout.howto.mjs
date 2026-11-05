// LIB-SHIP W7: the How-to content of lib_ab_wheel_rollout (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/ab_wheel_rollout.json; its claim ids are named on each field's claim.
// Handling (D-SHIP-GRIP case (b)): the card's grip.thumb, grip.handContact and grip.wrist are all empty (no rollout source
// gives them), so there is no hand claim to draw: NoHandling, no hand zoom (the card has none). The card's grip.type and
// grip.width (c1) are setup step 1.
// Feel (D-SHIP-Q7): the card's primary `core` is text only (feel.textOnly), as lib_plank; `abs` is drawn.
// Tier A: the card's tierA.wayOut is null (a kneeling rollout has no stuck point to escape); its range limiter (the wall,
// c7) is setup step 4.
// No variant line (equipment 'Ab Wheel').
// Red flags: the card's redFlags (back): LIB-5's back box (shared/back-box.mjs), linked by the low-back row.
//
// D-TEXT-GOLDEN (claim -> slot):
//   posture c2, c5 roll out slowly               -> posture 'slow'
//   posture c2 knees to head in one line         -> posture 'line', zoom back-line Right
//   posture c3 low back doesn't arch             -> posture 'back', zoom back-line Wrong
//   posture c5 start with the core (trunk), not the arms -> posture 'core', setup 3 (W7 printed)
//   posture c4 pull back with the lats           -> posture 'return', setup 5 (W7 printed)
//   zoom range (Wrong null, LR-25)               -> T: posture 'range' (D-SHIP-TEXTZOOM), setup 5 (W7 printed)
//   handlingMistakes (Q-W2-12): low back arching (c3, c7) -> posture 'back', zoom back-line Wrong, feel row low-back;
//   rolling too fast (c5, c2) -> posture 'slow', risks[fast], plate label 'slow'; starting with the standing version
//   (c6, c7) -> posture 'standing', setup 4 (W7 printed)
import plateSpec from '../specs/ab_wheel_rollout.mjs';
import { RED_FLAG } from '../../layers/howto/shared.mjs';
export { RED_FLAG };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'sl-abwheel': { cite: 'How to Do Kneeling Ab Wheel Roll-Out: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/kneeling-ab-wheel-roll-out/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'sl-abex': { cite: 'The 10 Best Ab Exercises for Muscle and Strength (StrengthLog)', url: 'https://www.strengthlog.com/ab-exercises/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'sl-coreex': { cite: 'The 10 Best Core Exercises for Muscle & Strength (StrengthLog)', url: 'https://www.strengthlog.com/core-exercises/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'bb-bestab': { cite: '12 Best Ab Exercises and Workouts for Strength (BarBend)', url: 'https://barbend.com/best-ab-exercises/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'bb-abrollouts': { cite: 'The Benefits of Ab Rollouts and Progressions to Perform Them (BarBend)', url: 'https://barbend.com/ab-rollouts/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'escamilla-2006': { cite: 'Electromyographic analysis of traditional and nontraditional abdominal exercises: implications for rehabilitation and training.', url: 'https://pubmed.ncbi.nlm.nih.gov/16649890/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-22', use: 'MECH' },
  'yamane-2023': { cite: 'Spinal cord injury without radiological abnormality due to a fall while using an abdominal roller: A report of two cases.', url: 'https://pubmed.ncbi.nlm.nih.gov/37780607/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-22', use: 'DATA' },
  // The back box's own source (shared/back-box.mjs boxClaim), as lib_rope_triceps_pushdown lists it: the card's redFlags 'back'.
  'nhs-back': { cite: 'NHS, Back pain', url: 'https://www.nhs.uk/conditions/back-pain/',
    kind: 'guideline', access: 'full', checked: '2026-10-02', use: 'CONSENSUS', note: 'When back pain needs a check.' },
};
// Not cited: c11 (sets and reps), c14 (tempo, plate only).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const SLW = 'sl-abwheel', SLX = 'sl-abex', BBA = 'bb-bestab', BBR = 'bb-abrollouts';
const CL = {
  c1: C(['CONSENSUS'], [SLW, SLX, BBA], 'card c1'),
  c2: C(['CONSENSUS'], [SLX, SLW], 'card c2'),
  c4: C(['CONSENSUS'], [SLW, BBA], 'card c4'),
  c5: C(['CONSENSUS'], [BBR], 'card c5'),
  c7: C(['CONSENSUS'], [BBR, BBA, 'sl-coreex', SLW, SLX], 'card c7'),
  c8: C(['DATA'], ['yamane-2023'], 'card c8'),
  c9: C(['CONSENSUS'], [SLW, SLX, BBA], 'card c9'),
  c13: C(['CONSENSUS'], [BBR], 'card c13'),
  brace: C(['CONSENSUS'], [SLX, SLW, BBR], 'card c2, c5'),
  slow: C(['CONSENSUS'], [BBR, SLX, SLW], 'card c2, c5'),
  back: C(['CONSENSUS'], [BBA, BBR, SLW], 'card c3, c7'),
  standing: C(['CONSENSUS'], [BBR, BBA, SLW], 'card c6, c7'),
  lowBack: C(['CONSENSUS'], [BBA, BBR], 'card c3, c13, c5, c7'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: the end (rolled out, knees to head in one line; c2, c3) and the spec's Mistake (the
// low back arching as the arms reach overhead; card plate.mistake, c3, c13). The card zoom back-line Wrong is that
// drawn fault, so no drawing value is added here.
const MIS = plateSpec.mistake.pose, END = plateSpec.poses.end;
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  arch: { pose: MIS },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// back-line (M): the zoom shell (render/closeup/crop.mjs); the Wrong is the plate's own Mistake dashed red over the right
// pose, with the plate's Mistake guide (the arrow at the arched low back). The crop window (centre offset, sizePx) is a
// drawing value. range is a text checkpoint (its Wrong is null, LR-25; D-SHIP-TEXTZOOM): posture 'range'.
const zooms = [
  {
    key: 'back-line', chip: 'Back line', heading: 'Back line', kind: 'posture',
    crop: { center: { at: 'sacrum', pose: 'right', off: [0, 0] }, sizePx: 220 },
    right: 'end',
    wrong: { base: 'end', pose: MIS },
    guides: plateSpec.mistake.guides,
    callout: {
      right: { text: 'Straight line', anchor: 'backMid' },
      wrong: { text: 'Back arched', anchor: { at: 'sacrum', pose: 'mistake' } },
    },
    caption: {
      right: 'Straight line from knees to head.',
      wrong: 'Low back arched.',
    },
    alt: {
      right: 'Side view, rolled out on the knees. Knees, hips and head in one straight line, the back straight.',
      wrong: 'Side view, rolled out. The low back arches as the arms reach overhead. Drawn dashed over the right position.',
    },
    feelRow: 'low-back',
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'abs', plain: 'The abs hold your body straight.', claim: CL.c9 }],
  secondary: [{ muscleId: 'lats', plain: 'The lats pull you back in.', claim: C(['CONSENSUS', 'MECH'], [SLW, 'escamilla-2006'], 'card c9, c10, c4') }],
  textOnly: [   // named in the text, never painted (D-SHIP-Q7, as lib_plank)
    { muscleId: 'core', plain: 'The whole trunk braces to keep the body straight.', claim: C(['CONSENSUS'], [SLW, SLX, BBA], 'card c9, c2') },
  ],
  watch: [{ muscleId: 'lower_back', plain: 'The low back is the part at risk.' }],
  feelLine: 'You should feel this in the front of your belly and under your arms.',
  rows: [
    // The card's first two rows (front of the belly, under the arms) have no fix, so they are left out: the feel line says them.
    { key: 'low-back', where: 'Low back', at: { muscles: ['lower_back'] },
      means: 'An arching low back can result in injury.',
      fix: 'Roll out less far and slower.',
      zoom: 'back-line', redFlag: 'back', claim: CL.lowBack },
  ],
  claim: C(['CONSENSUS', 'MECH'], [SLW, SLX, BBA, 'escamilla-2006'], 'card c9, c10'),
};

/* ---------------------------------------------------------------- risks (card risks; handlingMistakes are posture, Q-W2-12) */
const RISKS = [
  { key: 'arch', text: 'An arching or rotating torso can result in injury.', claim: CL.c13 },
  { key: 'fast', text: 'Rolling out too fast can increase the risk of arching or rotating.', claim: CL.c5 },
  { key: 'fall', text: 'A fall in a standing rollout has caused serious spine injury.', claim: CL.c8 },
];

export default {
  schema: 1,
  id: 'lib_ab_wheel_rollout',
  rev: 1,
  plate: plateSpec,
  handling: { archetype: 'none', why: 'D-SHIP-GRIP (b): the card gives no thumb, contact or wrist claim; its grip type and width (c1) are setup step 1.' },
  contacts: ['floor-body'],   // the card's archetype.contact
  setup: [
    // W7 D-TEXT-PRINTED (posture checkpoints are not printed): steps 1-2 merged to make room; posture 'core' (c5) ->
    // step 3; handlingMistake 'Starting with the standing version' (c6, c7) -> step 4; T range Right (c7) and posture
    // 'return' (c4) -> step 5.
    { kind: 'grip', text: 'Kneel on a soft pad, hands on the wheel, shoulder-width apart.', claim: CL.c1 },
    { kind: 'position', text: 'Set the wheel on the floor just in front of your knees.', claim: CL.c1 },
    { kind: 'brace', text: 'Brace and squeeze your glutes. Start with your trunk, not your arms.', zoom: 'back-line', claim: CL.brace },
    { kind: 'safety', text: 'New? Kneel, not standing, and roll toward a wall that stops you.', claim: CL.standing },
    { kind: 'position', text: 'Keep roll-outs short and fully controlled. Pull back with your lats.',
      claim: C(['CONSENSUS'], [BBR, BBA, SLW], 'card c7, c4') },
  ],
  posture: [
    // Q-W2-12: handlingMistake 'Rolling out too fast' (c5, c2) merged here, its fix added
    { key: 'slow', label: 'Roll slowly', detail: 'Roll out slowly, never fast.',
      anchor: { landmark: 'grip.r', pose: 'end' }, claim: CL.slow },
    { key: 'line', label: 'Straight line', detail: 'Knees to head in one straight line.',
      anchor: { landmark: 'backMid', pose: 'end' }, zoom: 'back-line', claim: CL.c2 },
    // Q-W2-12: handlingMistake 'Low back arching at the far end' (c3, c7) merged here, its fix added
    { key: 'back', label: 'No back arch', detail: "Your low back doesn't arch as you reach. If it does, roll out less far.",
      anchor: { landmark: 'sacrum', pose: 'end' }, zoom: 'back-line', claim: CL.back },
    { key: 'core', label: 'Trunk first', detail: 'Start the roll from your trunk, not your arms.',
      anchor: { landmark: 'chest', pose: 'start' }, claim: CL.c5 },
    { key: 'return', label: 'Pull back', detail: 'Pull back with your lats, under control.',
      anchor: { landmark: 'shoulder.r', pose: 'end' }, claim: CL.c4 },
    // D-SHIP-TEXTZOOM: the card zoom range as a text checkpoint (its Wrong is null, LR-25)
    { key: 'range', label: 'Short range', detail: 'A short roll-out you fully control.',
      anchor: { landmark: 'grip.r', pose: 'end' }, claim: CL.c7 },
    // Q-W2-12: handlingMistake 'Starting with the standing version' (c6, c7), its fix
    { key: 'standing', label: 'Standing too soon', detail: 'Build up on your knees with a short roll-out.',
      anchor: { landmark: 'knee.r', pose: 'start' }, claim: CL.standing },
  ],
  feel,
  zooms,
  chips: ['back-line', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'Kneel on a soft pad, hands on the wheel. Brace and roll out slowly.',
    mistakeLine: "Don't let your low back arch. Roll out less far.",
    cueLine: 'Knees to head in one line.',
  },
  redFlag: RED_FLAG,
  mistakes: [],   // Q-W2-12 (#379 6628699724): the card's handlingMistakes are posture checkpoints above
  risks: RISKS,
  riskFlags: ['back'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/ab_wheel_rollout.json', rev: 1 },
};
