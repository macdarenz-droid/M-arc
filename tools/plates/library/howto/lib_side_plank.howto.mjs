// LIB-SHIP W7: the How-to content of lib_side_plank (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/side_plank.json; its claim ids are named on each field's claim.
// Handling (D-SHIP-GRIP (b2)): the card archetype.hand is none; its grip.handContact (bottom forearm on the floor, elbow
// under the shoulder, c1; top hand on the hip, c3) is on setup steps 1 and 4. No hand zoom (the card has none).
// Feel (D-SHIP-Q7): the card's secondary `core` is text only (feel.textOnly), as lib_plank.
// Front view (card plate.view): the crops cut the front-view plate (F-CROP-FRONT).
// No variant line (equipment 'Bodyweight'). D-TEXT-PROGRESSION: the card's easier versions (c4, c8) are left off.
// Red flags: the card's redFlags (knee): the shared knee block (layers/howto/shared.mjs RED_FLAG_KNEE), linked by the
// top-knee row.
//
// D-TEXT-GOLDEN (claim -> slot):
//   posture c2 head to feet in one line          -> posture 'line', zoom hip-line Right
//   posture c5 hips up, not sinking              -> posture 'hips', zoom hip-line Wrong
//   posture c7 bottom shoulder down              -> posture 'shoulder', zoom shoulder
//   posture c6 keep breathing                    -> posture 'breathe', setup step 5
//   handlingMistakes (Q-W2-12): holding the breath (c6) -> posture 'breathe'; hips sinking (c5, c9, c2) -> posture
//   'hips'; shrugging the bottom shoulder (c7) -> posture 'shoulder' (zoom shoulder Wrong)
import plateSpec from '../specs/side_plank.mjs';
import { RED_FLAG, RED_FLAG_KNEE } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_KNEE };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'bb-sideplank': { cite: 'Learn How to Do a Side Plank with Proper Form, Variations, and Benefits (BarBend)', url: 'https://barbend.com/side-plank/',
    kind: 'coach', access: 'full', checked: '2026-10-02', use: 'CONSENSUS' },
  'sl-sideplank': { cite: 'How to Do Side Plank: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/side-plank/',
    kind: 'coach', access: 'full', checked: '2026-10-02', use: 'CONSENSUS' },
  'ace-sideplank-mod': { cite: 'Ab Exercises, Side Plank (Modified) (ACE Exercise Library)', url: 'https://www.acefitness.org/resources/everyone/exercise-library/99/side-plank-modified/',
    kind: 'guideline', access: 'full', checked: '2026-10-02', use: 'CONSENSUS' },
  'juker-1998': { cite: 'Quantitative intramuscular myoelectric activity of lumbar portions of psoas and the abdominal wall during a wide variety of tasks.', url: 'https://pubmed.ncbi.nlm.nih.gov/9502361/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-02', use: 'DATA' },
  // RED_FLAG_KNEE's own source (layers/howto/shared.mjs), as golden B's leg_press lists it: the card's redFlags 'knee'.
  'nhs-knee-pain': { cite: 'NHS, Knee pain', url: 'https://www.nhs.uk/symptoms/knee-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When knee pain needs a check.' },
};
// Not cited: c4 and c8's easier versions (D-TEXT-PROGRESSION), c12 (mcgill-2009, bracing in general).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const BB = 'bb-sideplank', SL = 'sl-sideplank';
const CL = {
  c1: C(['CONSENSUS'], [BB], 'card c1'),
  c2: C(['CONSENSUS'], [BB, SL], 'card c2'),
  c3: C(['CONSENSUS'], [BB], 'card c3'),
  c7: C(['CONSENSUS'], [BB], 'card c7'),
  c8: C(['CONSENSUS'], ['ace-sideplank-mod'], 'card c8'),
  c10: C(['CONSENSUS'], [SL, BB], 'card c10'),
  elbow: C(['CONSENSUS'], [BB], 'card c1, c7'),
  breathe: C(['CONSENSUS'], [BB, SL], 'card c6, c2'),
  hips: C(['CONSENSUS'], [BB, SL], 'card c5, c9, c2'),
  breath: C(['CONSENSUS'], [BB], 'card c6'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses (front view):
//   sink  (card zoom hip-line Wrong, c5): the spec's Mistake merged over the end, as the engine draws it (the hips sink
//         toward the floor).
//   shrug (card zoom shoulder Wrong, c7 "shoulder shrugged up toward the ear"): the end pose with the shoulder girdle
//         elevated by SHRUG 6 cm (scap elev, one joint, farmer_s_carry's SHRUG; the spec's end is the resting girdle, scap 0, c7). The bottom hand
//         stays on its floor spot (the spec's reach IK).
// DRAWING VALUES (D-SHIP-DRAWVAL, #376 6614695581; precedent D-LIB7-2 and golden B's machine_chest_press seatDrop):
// SHRUG (scap elevation) sizes the shoulder Wrong; no card gives it, no number from it appears in user copy; the layers
// panel judges it.
const MIS = plateSpec.mistake.pose, END = plateSpec.poses.end;
const SHRUG = { scap: { elev: 6 } };
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  sink: { pose: { ...END, ...MIS } },
  shrug: { pose: { ...END, ...SHRUG } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// Zoom shell form (render/closeup/crop.mjs). hip-line (M): the plate's own Mistake dashed red over the right pose, with
// the plate's Mistake guide (the arrow at the sinking hip). shoulder (DV): the `shrug` still dashed red over the right
// pose. The crop windows (centre offset, sizePx) are drawing values.
const zooms = [
  {
    key: 'hip-line', chip: 'Hips', heading: 'Hip line', kind: 'posture',
    crop: { center: { at: 'hip.r', pose: 'right', off: [0, 0] }, sizePx: 220 },
    right: 'end',
    wrong: { base: 'end', pose: MIS },
    guides: plateSpec.mistake.guides,
    callout: {
      right: { text: 'Hips up', anchor: 'hip.l' },
      wrong: { text: 'Hips sink', anchor: { at: 'hip.r', pose: 'mistake' } },
    },
    caption: {
      right: 'Hips lifted in line with ribs and legs.',
      wrong: 'Hips sinking toward the floor.',
    },
    alt: {
      right: 'Front view, side plank on the forearm. The hips are lifted so the ribs, hips and legs form one straight line.',
      wrong: 'Front view. The hips sink toward the floor, out of line. Drawn dashed over the right position.',
    },
  },
  {
    key: 'shoulder', chip: 'Shoulder', heading: 'Bottom shoulder', kind: 'posture',
    crop: { center: { at: 'shoulder.r', pose: 'right', off: [-30, -10] }, sizePx: 180 },
    right: 'end',
    wrong: { base: 'end', pose: SHRUG },
    callout: {
      right: { text: 'Shoulder down', anchor: 'shoulder.r' },
      wrong: { text: 'Shrugged', anchor: { at: 'shoulder.r', pose: 'mistake' } },
    },
    caption: {
      right: 'Elbow under the shoulder, shoulder down.',
      wrong: 'Shoulder shrugged up toward the ear.',
    },
    alt: {
      right: 'Front view, side plank. The bottom elbow sits under the shoulder, the shoulder down, away from the ear.',
      wrong: 'Front view. The bottom shoulder shrugs up toward the ear. Drawn dashed over the right position.',
    },
    feelRow: 'shoulder',
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'obliques', plain: 'The obliques, at the sides of the waist, hold you up.', claim: CL.c10 }],
  secondary: [],
  textOnly: [   // named in the text, never painted (D-SHIP-Q7, as lib_plank)
    { muscleId: 'core', plain: 'The abs help as a secondary muscle.', claim: CL.c10 },
  ],
  watch: [],
  feelLine: 'You should feel this in the side of your waist, on the lower side.',
  rows: [
    // The card's first row (side of the waist) has no fix, so it is left out: the feel line says it (D-SHIP-Q16).
    { key: 'shoulder', where: 'Bottom shoulder', at: { muscles: ['upper_traps'] },
      means: 'The shoulder is shrugging up.',
      fix: 'Pull your shoulder down and pad the elbow.',
      zoom: 'shoulder', claim: CL.c7 },
    { key: 'knee', where: 'Top knee or foot', at: { parts: ['knee-left', 'knee-right'] },
      means: 'Too much pressure on the inside of that joint.',
      fix: 'Stop the exercise.',
      redFlag: 'knee', claim: CL.c8 },
  ],
  claim: C(['CONSENSUS', 'DATA'], [SL, BB, 'juker-1998'], 'card c10, c11'),
};

/* ---------------------------------------------------------------- risks (card risks; handlingMistakes are posture, Q-W2-12) */
const RISKS = [
  { key: 'knee', text: 'Too much pressure inside the top knee or foot may stress those joints.', claim: CL.c8 },
];

export default {
  schema: 1,
  id: 'lib_side_plank',
  rev: 1,
  plate: plateSpec,
  handling: { archetype: 'none', why: 'D-SHIP-GRIP (b2): the card archetype.hand is none; its handContact (c1, c3) is on setup steps 1 and 4.' },
  contacts: ['floor-body'],
  setup: [
    { kind: 'position', text: 'Lie on your side, elbow under your shoulder, forearm on a mat.', claim: CL.elbow },
    { kind: 'position', text: 'Stack your top leg on your bottom leg.', claim: CL.c1 },
    { kind: 'position', text: 'Press elbow and bottom foot down and lift your hips.', zoom: 'hip-line', claim: CL.c2 },
    { kind: 'position', text: 'Top hand on your hip. Hold as steadily as you can.', claim: CL.c3 },
    { kind: 'brace', text: 'Brace and keep breathing, slow and deep.', claim: CL.breathe },
  ],
  posture: [
    { key: 'line', label: 'Straight line', detail: 'Head to feet in one straight line.',
      anchor: { landmark: 'hip.l', pose: 'end' }, zoom: 'hip-line', claim: CL.c2 },
    // Q-W2-12: handlingMistake 'Hips sinking' (c5, c9, c2) merged here, its fix added
    { key: 'hips', label: 'Hips up', detail: "Hips up, don't let them sink. Lift them back in line, or end the hold.",
      anchor: { landmark: 'hip.r', pose: 'end' }, zoom: 'hip-line', claim: CL.hips },
    // Q-W2-12: handlingMistake 'Shrugging the bottom shoulder' (c7) merged here, its fix added
    { key: 'shoulder', label: 'Shoulder down', detail: "Bottom shoulder down, away from your ear. Don't shrug. Pad the elbow.",
      anchor: { landmark: 'shoulder.r', pose: 'end' }, zoom: 'shoulder', claim: CL.c7 },
    // Q-W2-12: handlingMistake 'Holding your breath' (c6) merged here, its fix added
    { key: 'breathe', label: 'Keep breathing', detail: "Don't hold your breath. Keep the brace and take slow belly breaths.",
      anchor: { landmark: 'chest', pose: 'end' }, claim: CL.breath },
  ],
  feel,
  zooms,
  chips: ['hip-line', 'shoulder', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'Lie on your side, elbow under your shoulder. Lift your hips.',
    mistakeLine: "Don't let your hips sink. Keep them in line.",
    cueLine: 'Hips up, keep breathing.',
  },
  redFlag: RED_FLAG,
  mistakes: [],   // Q-W2-12 (#379 6628699724): the card's handlingMistakes are posture checkpoints above
  risks: RISKS,
  riskFlags: ['knee'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/side_plank.json', rev: 1 },
};
