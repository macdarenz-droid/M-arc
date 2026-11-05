// LIB-SHIP W7: the How-to content of lib_cable_crunch, golden B's HowToContent shape (as lib_crunch). Every shown string
// restates a claim of the research card docs/research/howto/cards/cable_crunch.json (cited in its field's claim, cN =
// card claim id).
// Handling: NoHandling, D-SHIP-GRIP (b3) (D-SHIP-W7-B3, #394 6647954465; tests/howto/checks/c3-library.ts B3_PINS): the card
// archetype.hand is on-body (the rope held by the head) and its sources give no thumb or wrist. The pinned handContact
// claim and the card's grip.claims (both c2) are on setup step 4. The card's hand zoom `rope` (c2, c9): its Right
// ("Rope ends held on either side of the head") is setup step 4; its Wrong ("Arms yanking the rope down") shows as a
// fault on copy.mistakeLine and posture 'arms' (Q-W2-12 form), never as an instruction. No hand zoom is drawn.
// Shared move steps (D-SHIP-W7-MOVES selector-pin): not added here, an open question to the supervisor.
// No variant line (equipment 'Cable').
//
// D-TEXT-GOLDEN (claim -> visible slot; posture checkpoints are kept in Q-W2-12 form as well):
//   card posture 'Brace, breathe out and curl your spine' (c4, c7)      -> copy.setupLine; plate cue 'curl'
//   card posture 'Elbows move toward your thighs' (c5)                  -> plate cue 'curl'
//   card posture 'Hips stay still and raised' (c3)                      -> zoom 'hips' Right, plate cue 'hips', copy.cueLine
//   card posture 'Chin stays tucked' (c12)                              -> feel row 'neck' fix
//   card posture 'Breathe in and straighten slowly ...' (c6, c7)        -> copy.setupLine
//   handlingMistake 'Moving your hips to pull' (c8, c3)                 -> zoom 'hips' Wrong, copy.mistakeLine, feel row 'hips'
//   handlingMistake 'Yanking with your arms' (c9, c11)                  -> copy.mistakeLine, plate cue 'rope', risks 'load'
//   handlingMistake 'Rounding your lower back' (c13, c5)                -> feel row 'low-back' (means and fix)
//   hand zoom rope Right (c2)                                           -> setup step 4
//   hand zoom rope Wrong (c2, c9)                                       -> copy.mistakeLine (a fault)
//   card zoom hips (M)                                                  -> zoom 'hips'
import plateSpec from '../specs/cable_crunch.mjs';
import { RED_FLAG } from '../../layers/howto/shared.mjs';
export { RED_FLAG };

/* ---------------------------------------------------------------- sources (the card's sources) ------------------- */
export const SOURCES = {
  'bb-cablecrunch': { cite: 'Learn the Cable Crunch to Build Yourself a Strong, Supportive Core (BarBend)', url: 'https://barbend.com/cable-crunch/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'motra-cablecrunch': { cite: 'Cable Crunch, Exercise Guide (Motra)', url: 'https://motra.com/exercises/cableCrunch',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'sl-cablecrunch': { cite: 'How to Do Cable Crunch: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/cable-crunch/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'fv-cablecrunch': { cite: 'The 10 Best Cable Crunch Alternatives for Stronger, More Defined Abs (Fitness Volt)', url: 'https://fitnessvolt.com/cable-crunch/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  // The back box's own source (shared/back-box.mjs boxClaim), as lib_plank lists it: the card's redFlags 'back'.
  'nhs-back': { cite: 'NHS, Back pain', url: 'https://www.nhs.uk/conditions/back-pain/',
    kind: 'guideline', access: 'full', checked: '2026-10-02', use: 'CONSENSUS', note: 'When back pain needs a check.' },
};

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const BB = 'bb-cablecrunch', MO = 'motra-cablecrunch', SL = 'sl-cablecrunch', FV = 'fv-cablecrunch';
const CL = {
  c1: C(['CONSENSUS'], [SL, MO, BB], 'card c1'),
  c2: C(['CONSENSUS'], [BB, SL, MO], 'card c2'),
  c3: C(['CONSENSUS'], [MO], 'card c3'),
  c11: C(['CONSENSUS'], [BB, MO], 'card c11'),
  c12: C(['CONSENSUS'], [MO], 'card c12'),
  c13: C(['CONSENSUS', 'WEAK'], [MO], 'card c13'),
  c14: C(['CONSENSUS'], [SL, BB], 'card c14'),
  curl: C(['CONSENSUS'], [BB, SL, MO], 'card c4, c7'),
  hips: C(['CONSENSUS'], [FV, MO], 'card c8, c3'),
  arms: C(['CONSENSUS'], [MO, BB], 'card c9, c11, c2'),
  round: C(['CONSENSUS', 'WEAK'], [MO], 'card c13, c5'),
  back: C(['CONSENSUS'], [BB, SL, MO], 'card c6, c7'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: hips (card zoom hips Wrong, c8) is the spec's Mistake pose (the hips move back to
// pull while the spine stays straight), drawn as the plate's Mistake view draws it (its guides: the hip arrow and the
// Mistake's cable). No new geometry, so no drawing values.
const END = plateSpec.poses.end, MIS = plateSpec.mistake.pose;
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  hips: { pose: MIS },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
const zooms = [
  {
    key: 'hips', chip: 'Hips', heading: 'Hips still', kind: 'posture',
    // zoom shell: the window centred off the right pose's hip so the trunk, the hips and the thighs fill the panel
    // (`off`, `sizePx` drawing values)
    crop: { center: { at: 'hip.r', pose: 'right', off: [10, -10] }, sizePx: 170 },
    right: 'end',
    wrong: { base: 'end', pose: MIS },   // M: the plate's own Mistake, dashed red over the right pose (lib_crunch form)
    guides: plateSpec.mistake.guides,
    callout: {
      right: { text: 'Hips still', anchor: 'buttock' },
      wrong: { text: 'Hips move', anchor: { at: 'buttock', pose: 'mistake' } },
    },
    caption: {
      right: 'Hips still and raised, the spine curling.',
      wrong: 'Hips moving to pull, not only the spine.',
    },
    alt: {
      right: 'Side view, kneeling cable crunch. The spine curls, elbows toward the thighs, the hips still and raised.',
      wrong: 'Side view, kneeling cable crunch. The hips move back to pull while the spine stays straight.',
    },
    feelRow: 'hips',
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'abs', plain: 'The abs at the front of the belly curl your spine.', claim: CL.c14 }],
  secondary: [{ muscleId: 'obliques', plain: 'The sides of the belly help.', claim: CL.c14 }],
  watch: [{ muscleId: 'hip_flexors', plain: 'Moving the hips puts the work on the hip flexors.', claim: C(['CONSENSUS'], [FV, MO], 'card c8') }],
  feelLine: 'You should feel this in the front of your belly.',
  rows: [
    // The card's first row (front of the belly) has no fix, so it is left out: the feel line says it.
    { key: 'hips', where: 'Front of the hips', at: { muscles: ['hip_flexors'] },
      means: 'Moving your hips puts tension on your hip flexors.',
      fix: 'Keep your hips still. Only your spine bends.',
      zoom: 'hips', claim: CL.hips },
    { key: 'neck', where: 'Neck', at: { parts: ['neck-left', 'neck-right'] },
      means: 'Reps not controlled, or chin not tucked.',
      fix: 'Keep the movement controlled and your chin tucked.',
      claim: CL.c12 },
    { key: 'low-back', where: 'Lower back', at: { muscles: ['lower_back'] },
      means: 'Rounding your lower back.',
      fix: 'Stop at elbows near thighs, without rounding your lower back excessively.',
      redFlag: 'back', claim: CL.round },
  ],
  libraryDiff: { add: ['obliques'], why: 'StrengthLog lists the obliques as the secondary muscle (card c14).' },
  claim: CL.c14,
};

/* ------------------------------------------------------------------------------------------------ risks ---------- */
const RISKS = [
  { key: 'neck', text: 'Keep the movement controlled to avoid neck strain.', claim: CL.c12 },
  { key: 'acute', text: 'Acute lower back pain? Avoid this exercise.', claim: CL.c13 },
  { key: 'load', text: 'Too much weight overloads your traps, arms and back instead of your abs.', claim: CL.c11 },
];

export default {
  schema: 1,
  id: 'lib_cable_crunch',
  rev: 1,
  plate: plateSpec,
  handling: { archetype: 'none', why: 'D-SHIP-GRIP (b3): the card archetype.hand is on-body with no thumb or wrist given; its handContact and grip claim (c2) are on setup step 4, its rope zoom Wrong (c2, c9) on the mistake line.' },
  contacts: ['floor-body'],
  setup: [
    { kind: 'load', text: 'Fix a rope to the high pulley. Choose a light-to-moderate weight.', claim: CL.c1 },
    { kind: 'position', text: 'Kneel a few feet away, facing the machine.', claim: CL.c1 },
    { kind: 'position', text: 'Set your stance about hip to shoulder-width apart.', claim: CL.c1 },
    // card hand zoom rope Right (c2); the pinned handContact and grip.claims c2
    { kind: 'grip', text: 'Hold the rope ends on either side of your head.', claim: CL.c2 },
    { kind: 'position', text: 'Hinge back slightly from your hips to raise them. Tuck your chin.', zoom: 'hips', claim: CL.c3 },
  ],
  posture: [
    { key: 'curl', label: 'Curl the spine', detail: 'Brace, breathe out and curl your spine.',
      anchor: { landmark: 'sacrum', pose: 'end' }, claim: CL.curl },
    { key: 'elbows', label: 'Elbows to thighs', detail: 'Elbows move toward your thighs.',
      anchor: { landmark: 'elbow.r', pose: 'end' }, claim: C(['CONSENSUS'], [MO], 'card c5') },
    // Q-W2-12: handlingMistake 'Moving your hips to pull' (c8, c3) merged here, its fix added
    { key: 'hips', label: 'Hips still', detail: "Hips stay still and raised. Don't move them to pull: only your spine bends.",
      anchor: { landmark: 'buttock', pose: 'end' }, zoom: 'hips', claim: CL.hips },
    { key: 'chin', label: 'Chin tucked', detail: 'Chin stays tucked.',
      anchor: { landmark: 'chin', pose: 'end' }, claim: CL.c12 },
    { key: 'return', label: 'Slow return', detail: 'Breathe in and straighten slowly. Keep tension on your abs.',
      anchor: { landmark: 'backMid', pose: 'start' }, claim: CL.back },
    // Q-W2-12: handlingMistake 'Yanking with your arms' (c9, c11) merged here, its fix added; the rope zoom's Wrong (c2, c9)
    { key: 'arms', label: 'Arms hold', detail: 'No yanking the rope down with your arms. Arms only hold the rope. Move with your abs.',
      anchor: { landmark: 'grip.r', pose: 'start' }, claim: CL.arms },
    // Q-W2-12: handlingMistake 'Rounding your lower back' (c13, c5) merged here, its fix added
    { key: 'round', label: 'Lower back', detail: 'Stop at elbows near thighs, without rounding your lower back excessively.',
      anchor: { landmark: 'lumbar', pose: 'end' }, claim: CL.round },
  ],
  feel,
  zooms,
  chips: ['hips', 'feel'],
  copy: {
    setupLine: 'Brace, breathe out and curl your spine. Breathe in and straighten slowly, keeping tension on your abs.',   // card c4, c7, c6
    mistakeLine: 'Hips moving to pull, or arms yanking the rope down? Keep your hips still and move with your abs.',   // card c8, c3, c9, c2
    cueLine: 'Only your spine bends.',   // card c3
  },
  redFlag: RED_FLAG,
  mistakes: [],   // Q-W2-12 (#379 6628699724): NoHandling, the card's handlingMistakes are posture checkpoints above
  risks: RISKS,
  riskFlags: ['back'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/cable_crunch.json', rev: 1 },
};
