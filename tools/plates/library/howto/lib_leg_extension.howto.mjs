// LIB-SHIP W7: the How-to content of lib_leg_extension (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/leg_extension.json; its claim ids are named on each field's claim (card cN).
// Handling (D-SHIP-GRIP case (b)): the card's grip.thumb, grip.handContact and grip.wrist are all empty (hand archetype
// balance: the hands steady the body), so there is no hand claim to draw: NoHandling, and no hand zoom (the card has
// none). The card's grip.type and grip.width (c3, the handles at the sides of the seat) are setup step 4.
// Zooms (section 17): top DV (the end pose with the knee past straight). knee-pivot T and shin-pad T (D-SHIP-TEXTZOOM:
// both card zooms have a null Wrong, LR-25): posture checkpoints `pivot` and `shin-pad`, setup steps 1 and 2.
// Red flags: the card's redFlags (knee, back): golden B's knee block and LIB-5's back box (shared/back-box.mjs).
// No variant line (equipment 'Machine').
//
// D-TEXT-GOLDEN (claim -> slot):
//   card posture 'Brace your abs. Keep your back on the pad' (c4) -> setup 3, feel row 'low-back' fix, plate cue 'back'
//   card posture 'Lift with your quads. Don't kick' (c9)        -> setup 4, copy.mistakeLine
//   card posture 'Straighten your legs without locking your knees' (c7, c8) -> zoom top Right, plate cue 'soft'
//   card posture 'Pause briefly at the top' (c18)               -> setup 4 (D-TEXT-PRINTED), copy.cueLine
//   card posture 'Lower slowly with control' (c11)              -> setup 5 (D-TEXT-PRINTED), copy.cueLine
//   card posture 'Breathe out as you lift, in as you lower' (c12) -> setup 4, setup 5
//   T knee-pivot Right 'Knee level with the machine's pivot' (c1) -> setup 1, plate cue 'pivot', posture 'pivot'
//   T shin-pad Right 'Pad on the lower shins, just above the ankles' (c2) -> setup 1, posture 'shin-pad'
//   handlingMistake 'Arching your back' (c5, c6, c4)            -> feel row 'low-back' means, risk 'arch', posture 'arch'
//   handlingMistake 'Locking knees at the top' (c8, c7)         -> zoom top Wrong, risk 'lock', posture 'top'
//   handlingMistake 'Kicking up with momentum' (c9, c10)        -> setup 4 + risk 'load' (D-TEXT-PRINTED), copy.mistakeLine, posture 'kick'
//   card setup 'Start with a lower weight' (c17)                -> copy.setupLine
import plateSpec from '../specs/leg_extension.mjs';
import { RED_FLAG, RED_FLAG_KNEE } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_KNEE };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'bb-le': { cite: 'How to Use the Leg Extension Machine for Quad Growth & Strength (BarBend)', url: 'https://barbend.com/leg-extension/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'sl-le': { cite: 'How to Do Leg Extension: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/leg-extension/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'mo-le': { cite: 'Machine Leg Extension - Exercise Guide (Motra)', url: 'https://www.motra.com/exercises/legExtension',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'lifto-le': { cite: 'Leverage Machine Leg Extension - How To, Muscles Worked & Form Guide (Liftosaur)', url: 'https://www.liftosaur.com/exercises/leverage-machine-leg-extension',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'fv-le': { cite: 'Leg Extension: Mastering Quadriceps for Stronger Legs (Fitness Volt)', url: 'https://fitnessvolt.com/leg-extension/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  // RED_FLAG_KNEE's own source (layers/howto/shared.mjs), as golden B's leg_press lists it: the card's redFlags 'knee'.
  'nhs-knee-pain': { cite: 'NHS, Knee pain', url: 'https://www.nhs.uk/symptoms/knee-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When knee pain needs a check.' },
  // The back box's own source (shared/back-box.mjs boxClaim), as lib_plank lists it: the card's redFlags 'back'.
  'nhs-back': { cite: 'NHS, Back pain', url: 'https://www.nhs.uk/conditions/back-pain/',
    kind: 'guideline', access: 'full', checked: '2026-10-02', use: 'CONSENSUS', note: 'When back pain needs a check.' },
};
// Not cited: c15, c16 (tempo, plate only).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const BB = 'bb-le', SL = 'sl-le', MO = 'mo-le', LI = 'lifto-le', FV = 'fv-le';
const CL = {
  c1: C(['CONSENSUS'], [SL, MO, LI], 'card c1'),
  c2: C(['CONSENSUS'], [LI, FV], 'card c2'),
  c6: C(['CONSENSUS'], [SL, MO, LI], 'card c6'),
  c8: C(['CONSENSUS'], [BB, MO, LI, SL], 'card c8'),
  c10: C(['CONSENSUS'], [SL, MO, LI], 'card c10'),
  c13: C(['CONSENSUS'], [BB, SL, FV], 'card c13'),
  c14: C(['CONSENSUS'], [LI, FV], 'card c14'),
  c17: C(['CONSENSUS'], [FV], 'card c17'),
  seat: C(['CONSENSUS'], [BB, LI, MO], 'card c3, c4'),
  grip: C(['CONSENSUS'], [BB, LI, MO], 'card c3, c4'),
  top: C(['CONSENSUS'], [BB, MO, FV, LI, SL], 'card c7, c8'),
  arch: C(['CONSENSUS'], [BB, SL, MO, LI], 'card c5, c6, c4'),
  kick: C(['CONSENSUS'], [BB, FV, SL, MO, LI], 'card c9, c10'),
  cue: C(['CONSENSUS'], [MO, LI, FV, BB], 'card c18, c11'),
  pads: C(['CONSENSUS'], [SL, MO, LI, FV], 'card c1, c2'),
  up: C(['CONSENSUS'], [MO, LI, BB, FV], 'card c12, c9, c18'),
  down: C(['CONSENSUS'], [MO, LI, FV, BB], 'card c12, c11'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: start (knees about 90, c3), end (legs nearly straight, knees not locked, c7, c8).
//   lock (card zoom top Wrong, c7, c8 "Knees locked or hyperextended at the top"): the end pose with the knee bent
//        KNEE_HYPER, past straight (one joint; the hips, the trunk and the hands as the end has them; the lever and its
//        roller follow the shin, as the spec draws them from the pose's landmarks).
// DRAWING VALUES (D-SHIP-DRAWVAL): KNEE_HYPER -10 deg (10 deg past straight, so the Wrong reads against the end's 5 deg short of it at panel size) is a
// Wrong-pose size no card gives; no number from it appears in user copy.
const KNEE_HYPER = -10;
const END = plateSpec.poses.end;
const LOCK = { knee: KNEE_HYPER };
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  lock: { pose: { ...END, ...LOCK } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// Zoom shell form (render/closeup/crop.mjs): callouts anchored at the landmark they name; the Wrong drawn alone (solid).
const zooms = [
  {
    key: 'top', chip: 'Knees', heading: 'Knee lockout', kind: 'posture',
    // claims: Right and Wrong (callout, caption, alt) card c7, c8
    crop: { center: { at: 'knee.r', pose: 'right', off: [0, 0] }, sizePx: 170 },
    right: 'end',
    wrong: { base: 'end', pose: LOCK, solid: true },
    callout: {
      right: { text: 'Not locked', anchor: 'knee.r' },
      wrong: { text: 'Locked', anchor: 'knee.r' },
    },
    caption: {
      right: 'Legs straight, knees not locked.',
      wrong: 'Knees locked or hyperextended at the top.',
    },
    alt: {
      right: 'Side view, top of the leg extension. The legs are nearly straight, the knees not locked.',
      wrong: 'Side view, top of the leg extension. The knees are pushed past straight and locked.',
    },
    feelRow: 'knee',
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'quads', plain: 'The front of your thighs does all the work.' }],
  secondary: [],
  watch: [{ muscleId: 'lower_back', plain: 'Your lower back should stay on the pad.' }],
  // The card's first row (front of the thighs) has no fix, so it is left out: the feel line says it (D-SHIP-Q16).
  feelLine: 'You should feel this in the front of your thighs.',
  rows: [
    { key: 'low-back', where: 'Lower back', at: { muscles: ['lower_back'] },
      means: 'Arching your lower back can lead to discomfort.',
      fix: 'Brace your abs. Keep your back pressed into the pad.',
      redFlag: 'back', claim: CL.arch },
    { key: 'knee', where: 'Knee', at: { parts: ['knee-left', 'knee-right'] },
      means: 'Feeling it here, not in the quads, can mean a form error.',
      fix: 'Stop if the pain is sharp. Reassess your form.',
      zoom: 'top', redFlag: 'knee', claim: CL.c14 },
  ],
  claim: CL.c13,
};

/* ---------------------------------------------------------------- risks (card risks; handlingMistakes are posture, Q-W2-12) */
const RISKS = [
  { key: 'lock', text: 'Locking your knees at the top can add stress to the knee.', claim: CL.c8 },
  { key: 'arch', text: 'Arching your lower back can lead to discomfort.', claim: CL.c6 },
  { key: 'load', text: 'Too much weight adds momentum and can increase the risk of injury.', claim: CL.c10 },
];

export default {
  schema: 1,
  id: 'lib_leg_extension',
  rev: 1,
  plate: plateSpec,
  handling: { archetype: 'none', why: 'D-SHIP-GRIP (b): the card gives no thumb, contact or wrist claim; its grip type and width (c3) are setup step 4.' },
  contacts: ['seat-back', 'pivot-pad'],   // the card's archetype.contact
  setup: [
    { kind: 'adjust', text: 'Knees at the pivot. Pad on your lower shins, just above ankles.', claim: CL.pads },
    { kind: 'position', text: 'Sit back against the pad, knees bent about 90 degrees.', claim: CL.seat },
    { kind: 'grip', text: 'Hold the handles at your sides. Brace your abs.', claim: CL.grip },
    { kind: 'position', text: "Breathe out and lift with your quads, don't kick. Pause briefly.", claim: CL.up },
    { kind: 'position', text: 'Breathe in and lower slowly with control.', claim: CL.down },
  ],
  posture: [
    // D-SHIP-TEXTZOOM: the card zooms knee-pivot and shin-pad as text checkpoints (their wrong is null, LR-25)
    { key: 'pivot', label: 'Knee at pivot', detail: "Knee level with the machine's pivot.", anchor: { landmark: 'knee.r', pose: 'start' }, claim: CL.c1 },
    { key: 'shin-pad', label: 'Pad above ankles', detail: 'Pad on the lower shins, just above the ankles.', anchor: { landmark: 'ankle.r', pose: 'start' }, claim: CL.c2 },
    // Q-W2-12: handlingMistakes 'Arching your back' (c5, c6, c4), 'Locking knees at the top' (c8, c7) and 'Kicking up
    // with momentum' (c9, c10) merged here, their fixes as the detail
    { key: 'arch', label: 'Back on pad', detail: 'Brace your abs. Go lighter until you can lift without arching.', anchor: { landmark: 'backUpper', pose: 'end' }, claim: CL.arch },
    { key: 'top', label: 'Knees unlocked', detail: 'Straighten your legs without locking your knees.', anchor: { landmark: 'knee.r', pose: 'end' }, zoom: 'top', claim: CL.top },
    { key: 'kick', label: 'No kicking', detail: "Lift with your quads, slow and controlled. Don't kick.", anchor: { landmark: 'ankle.r', pose: 'end' }, claim: CL.kick },
    { key: 'pause', label: 'Pause, then lower', detail: 'Pause briefly at the top. Lower slowly with control.', anchor: { landmark: 'ankle.r', pose: 'end' }, claim: CL.cue },
  ],
  feel,
  zooms,
  chips: ['top', 'feel'],   // the zoom shell's chip row: the zoom keys, then feel
  copy: {
    setupLine: 'Start with a lower weight. Knees line up with the pivot.',   // card c17, c1
    mistakeLine: "Don't kick up with momentum. Lift with your quads, slow and controlled.",   // card c9, c10
    cueLine: 'Pause at the top, lower slowly.',   // card c18, c11
  },
  redFlag: RED_FLAG,
  mistakes: [],   // Q-W2-12 (#379 6628699724): NoHandling; the card's handlingMistakes are posture checkpoints
  risks: RISKS,
  riskFlags: ['knee', 'back'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/leg_extension.json', rev: 1 },
};
