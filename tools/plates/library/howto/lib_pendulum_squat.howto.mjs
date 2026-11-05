// LIB-SHIP W7: the How-to content of lib_pendulum_squat (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/pendulum_squat.json; its claim ids are named on each field's claim (card cN).
// Handling (D-SHIP-GRIP case (b)): the card's grip.thumb, grip.handContact and grip.wrist are all empty (hand archetype
// balance), so there is no hand claim to draw: NoHandling, and no hand zoom (the card has none). The card's grip.type
// (c16, the handles gripped firmly) is setup step 3.
// Zooms (section 17): heels-flat M (the plate's own Mistake: the heels lift off the platform at the bottom, c9, c15).
// knee-track T (D-SHIP-TEXTZOOM: its Wrong, the knees caving inward, is a rotation unseen in the side view): posture
// checkpoint `knee-track`, feel row 'knee'.
// Red flags: the card's redFlags (knee): golden B's knee block.
// No variant line (equipment 'Machine').
//
// D-TEXT-GOLDEN (claim -> slot):
//   card posture 'Back against the pad' (c3)                    -> setup 2, plate cue 'back'
//   card posture 'Torso upright' (c5)                           -> setup 4
//   card posture 'Knees over the toes' (c6)                     -> feel row 'knee' fix, plate cue 'knees'
//   card posture 'Heels flat' (c9)                              -> zoom heels-flat Right
//   card posture 'Extend fully at the top, without locking out hard' (c21) -> copy.cueLine
//   T knee-track Right 'Knees in line with the toes' (c8)       -> feel row 'knee' fix, posture 'knee-track'
//   T knee-track Wrong 'Knees caving inward' (c8)               -> feel row 'knee' means (as a fault), risk 'cave'
//   handlingMistake 'Dropping into the bottom' (c10, c20)       -> copy.mistakeLine, posture 'drop'
//   handlingMistake 'Heels lifting off the platform' (c15)      -> zoom heels-flat Wrong, risk 'heels', posture 'heels'
//   handlingMistake 'Knees cave inward' (c8)                    -> feel row 'knee', risk 'cave', posture 'knee-track'
//   card setup 'If you fail a rep, the safety catch gives you an out' (c22, c17) -> copy.setupLine
import plateSpec from '../specs/pendulum_squat.mjs';
import { RED_FLAG, RED_FLAG_KNEE } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_KNEE };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'sl-pendulum': { cite: 'How to Do Pendulum Squat: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/pendulum-squat/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'wff-pend': { cite: 'Pendulum Squat: Muscles Worked and How to Use It (FORM gym trainers)', url: 'https://weareformfitness.com/training/equipment/specialist/pendulum-squat/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'xcel-pend': { cite: 'Pendulum Squats: Step-by-Step Form Guide (XcelerateGyms blog)', url: 'https://xcelerategyms.com/pendulum-squats/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'WEAK' },
  'boxlife-pend': { cite: 'The Pendulum Squat: Bridging the Gap Between Strength and Safety (BoxLife Magazine)', url: 'https://boxlifemagazine.com/pendulum-squat/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'yr-pend': { cite: 'How To Use A Pendulum Squat Machine (YR Fitness, machine maker\'s guide)', url: 'https://www.yanrefitness.com/how-to-use-a-pendulum-squat-machine/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  // RED_FLAG_KNEE's own source (layers/howto/shared.mjs), as golden B's leg_press lists it: the card's redFlags 'knee'.
  'nhs-knee-pain': { cite: 'NHS, Knee pain', url: 'https://www.nhs.uk/symptoms/knee-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When knee pain needs a check.' },
};
// Not cited: c13 (machine description), c14 (sets and progression), c18, c19 (tempo, plate only).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const SL = 'sl-pendulum', WFF = 'wff-pend', XC = 'xcel-pend', BOX = 'boxlife-pend', YR = 'yr-pend';
const CL = {
  c1: C(['CONSENSUS'], [SL], 'card c1'),
  c3: C(['CONSENSUS'], [SL, YR], 'card c3'),
  c5: C(['CONSENSUS'], [SL], 'card c5'),
  c6: C(['CONSENSUS'], [WFF], 'card c6'),
  c8: C(['CONSENSUS'], [WFF], 'card c8'),
  c9: C(['CONSENSUS'], [WFF], 'card c9'),
  c15: C(['CONSENSUS', 'WEAK'], [XC], 'card c15'),
  c21: C(['CONSENSUS', 'WEAK'], [YR, XC], 'card c21'),
  feet: C(['CONSENSUS'], [SL, WFF, YR], 'card c2, c3'),
  grip: C(['CONSENSUS', 'WEAK'], [XC, SL], 'card c16, c4'),
  lower: C(['CONSENSUS'], [WFF, SL], 'card c10, c5, c4, c6'),
  finish: C(['CONSENSUS'], [SL, WFF, BOX, YR], 'card c5, c7, c17'),
  drop: C(['CONSENSUS'], [WFF, YR], 'card c10, c20'),
  heels: C(['CONSENSUS', 'WEAK'], [WFF, XC], 'card c9, c15'),
  knee: C(['CONSENSUS', 'WEAK'], [XC, WFF], 'card c15, c8'),
  way: C(['CONSENSUS'], [BOX, YR], 'card c22, c17'),
  quads: C(['CONSENSUS'], [SL, WFF], 'card c12'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: start (the top), end (the bottom, heels flat, c9) and the spec's Mistake merged over
// the end (the heels lift about the balls, the torso stays on the pad; c9, c15). No new pose, so no drawing value.
const END = plateSpec.poses.end, MIS = plateSpec.mistake.pose;
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  heels: { pose: { ...END, ...MIS } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// Zoom shell form (render/closeup/crop.mjs): callouts anchored at the landmark they name; the Wrong drawn alone (solid).
const zooms = [
  {
    key: 'heels-flat', chip: 'Heels', heading: 'Heels flat', kind: 'posture',
    // claims: Right (callout, caption, alt) card c9, c7; Wrong card c9, c15
    crop: { center: { at: 'ankle.r', pose: 'right', off: [0, 0] }, sizePx: 110 },
    right: 'end',
    wrong: { base: 'end', pose: MIS, solid: true },
    callout: {
      right: { text: 'Heels flat', anchor: 'heel.r' },
      wrong: { text: 'Heels lifted', anchor: { at: 'heel.r', pose: 'mistake' } },
    },
    caption: {
      right: 'Heels flat at the bottom.',
      wrong: 'Heels lifted off the platform.',
    },
    alt: {
      right: 'Side view, bottom of the pendulum squat. The whole foot is flat on the platform.',
      wrong: 'Side view, bottom of the pendulum squat. The heels lift off the platform, shifting the weight forward.',
    },
    feelRow: 'knee',
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'quads', plain: 'The front of your thighs drives the movement.' }],
  secondary: [
    { muscleId: 'glutes', plain: 'Your glutes help.' },
    { muscleId: 'adductors', plain: 'Your inner thighs help.' },
    { muscleId: 'hamstrings', plain: 'The backs of your thighs help.' },
  ],
  watch: [],
  // The card's thigh and glute rows have no fix, so they are left out: the feel line says them (D-SHIP-Q16).
  feelLine: 'You should feel this mostly in the front of your thighs. Glutes and inner thighs help.',
  rows: [
    { key: 'knee', where: 'Knees', at: { parts: ['knee-left', 'knee-right'] },
      means: 'Knees caving in or heels lifting puts strain on the knees.',
      fix: 'Keep knees over toes, whole foot down. Reduce the load if it persists.',
      zoom: 'heels-flat', redFlag: 'knee', claim: CL.knee },
  ],
  libraryDiff: { add: ['adductors'], why: 'card libraryDiff: the quads are the primary driver; the glutes, adductors and hamstrings help (c12).' },
  claim: CL.quads,
};

/* ---------------------------------------------------------------- risks (card risks; handlingMistakes are posture, Q-W2-12) */
const RISKS = [
  { key: 'cave', text: 'Knees caving in on the way up stresses the knee joints.', claim: CL.c15 },
  { key: 'heels', text: 'Heels lifting shifts your weight forward and strains your knees.', claim: CL.c15 },
  { key: 'bounce', text: 'Bouncing out of the bottom can cause injury.', claim: CL.c15 },
];

export default {
  schema: 1,
  id: 'lib_pendulum_squat',
  rev: 1,
  plate: plateSpec,
  handling: { archetype: 'none', why: 'D-SHIP-GRIP (b): the card gives no thumb, contact or wrist claim; its grip type (c16) is setup step 3.' },
  contacts: ['foot-platform'],   // the card's archetype.contact
  setup: [
    { kind: 'adjust', text: 'Set the machine: shoulders under the pads, feet on the platform.', claim: CL.c1 },
    { kind: 'position', text: 'Feet hip- to shoulder-width. Brace and press your back into the pad.', claim: CL.feet },
    { kind: 'grip', text: 'Grip the handles firmly, then release the safety latch.', claim: CL.grip },
    { kind: 'position', text: 'Lower over two to three seconds, torso upright, thighs at least parallel.', claim: CL.lower },
    { kind: 'finish', text: 'Push up through your whole foot. Lock the safety, check it holds.', claim: CL.finish },
  ],
  posture: [
    { key: 'back', label: 'Back on pad', detail: 'Back pressed against the pad.', anchor: { landmark: 'sacrum', pose: 'end' }, claim: CL.c3 },
    { key: 'torso', label: 'Torso upright', detail: 'Torso upright.', anchor: { landmark: 'chest', pose: 'end' }, claim: CL.c5 },
    // D-SHIP-TEXTZOOM: the card zoom knee-track as a text checkpoint (header); Q-W2-12: handlingMistake 'Knees cave
    // inward' (c8) merged here, its fix as the detail
    { key: 'knee-track', label: 'Knees over toes', detail: 'Knees in line with the toes, never caving in. Go lighter if they do.',
      anchor: { landmark: 'knee.r', pose: 'end' }, claim: CL.c8 },
    { key: 'heels', label: 'Heels flat', detail: 'Keep your whole foot planted.', anchor: { landmark: 'heel.r', pose: 'end' }, zoom: 'heels-flat', claim: CL.heels },
    { key: 'top', label: 'Full extension', detail: 'Extend fully at the top, without locking out hard.', anchor: { landmark: 'knee.r', pose: 'start' }, claim: CL.c21 },
    // Q-W2-12: handlingMistake 'Dropping into the bottom' (c10, c20), its fix as the detail
    { key: 'drop', label: 'Dropping down', detail: 'Lower over two to three seconds.', anchor: { landmark: 'hip.r', pose: 'end' }, claim: CL.drop },
  ],
  feel,
  zooms,
  chips: ['heels-flat', 'feel'],   // the zoom shell's chip row: the zoom keys, then feel
  copy: {
    setupLine: "Learn the safety catch first. It's your way out if you fail a rep.",   // card c22, c17
    mistakeLine: "Don't drop into the bottom. Lower over two to three seconds.",   // card c10
    cueLine: "Extend fully, don't lock out hard.",   // card c21
  },
  redFlag: RED_FLAG,
  mistakes: [],   // Q-W2-12 (#379 6628699724): NoHandling; the card's handlingMistakes are posture checkpoints
  risks: RISKS,
  riskFlags: ['knee'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/pendulum_squat.json', rev: 1 },
};
