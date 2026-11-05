// LIB-SHIP W7: the How-to content of lib_battle_ropes (alternating waves), golden B's HowToContent shape
// (layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the research card
// docs/research/howto/cards/battle_ropes.json (cited in its field's claim, cN = card claim id).
// Handling: D-SHIP-GRIP (b) (#376 6614415740): the card's grip.thumb, grip.handContact and grip.wrist are empty, so
// NoHandling; the grip type (c4, c14) is setup step 2. The card's width line ("about shoulder-width") is drawn from the
// feet and shoulders, no source gives it, so it is not printed. The card hand zoom rope-grip has no Wrong (LR-25): its
// Right is setup step 2, no hand zoom.
// Feel (D-SHIP-Q7): the card's secondary `core` is text only (feel.textOnly), as lib_plank.
// No box (card redFlags []). No variant line (equipment 'Battle Ropes').
//
// D-TEXT-GOLDEN claim -> slot:
//   posture c2, c13 feet planted, soft knees -> posture feet
//   posture c4 back straight, slight lean    -> posture lean, setup step 3
//   posture c6 shoulder blades down, back    -> posture blades (zoom shoulder-blades)
//   posture c5 arms in front                 -> posture arms
//   handlingMistake blades lift or hunch c6  -> posture blades, zoom caption.wrong, copy.mistakeLine, feel row neck, risks
//   handlingMistake holding breath c7        -> posture breathe
//   handlingMistake too much too soon c8     -> posture form-first
//   hand zoom rope-grip Right c4, c14        -> setup step 2
// Left off (D-TEXT-PROGRESSION): c8's rope size and anchor distance, c9's starting dose.
import plateSpec from '../specs/battle_ropes.mjs';
import { RED_FLAG } from '../../layers/howto/shared.mjs';
export { RED_FLAG };

/* ---------------------------------------------------------------- sources (the card's sources) ------------------- */
export const SOURCES = {
  'hl-br': { cite: 'How to Get Started with Battle Rope Exercises (Healthline; medically reviewed by a CSCS)', url: 'https://www.healthline.com/health/fitness/battle-rope-exercises',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'ace-br-emg': { cite: 'Muscle Activation During Battle Rope Exercises (ACE-sponsored research summary, Salzgeber, Porcari et al.)', url: 'https://acefitness.org/education-and-resources/professional/certified/research/7470/muscle-activation-during-battle-rope-exercises',
    kind: 'secondary', access: 'full', checked: '2026-10-22', use: 'DATA' },
  'calatayud-2015': { cite: 'Muscle Activity During Unilateral vs. Bilateral Battle Rope Exercises', url: 'https://pubmed.ncbi.nlm.nih.gov/25853917/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-22', use: 'DATA' },
  'ace-br-total': { cite: 'Total-Body Battle Ropes Workout (ACE expert article)', url: 'https://www.acefitness.org/resources/pros/expert-articles/5396/total-body-battle-ropes-workout/',
    kind: 'coach', access: 'summary', checked: '2026-10-22', use: 'CONSENSUS' },
};

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const CL = {
  c1: C(['CONSENSUS'], ['hl-br'], 'card c1'),
  c2: C(['CONSENSUS'], ['hl-br'], 'card c2'),
  c3: C(['CONSENSUS'], ['hl-br','ace-br-total'], 'card c3'),
  c4: C(['DATA'], ['ace-br-emg'], 'card c4'),
  c5: C(['DATA'], ['ace-br-emg'], 'card c5'),
  c6: C(['CONSENSUS'], ['hl-br'], 'card c6'),
  c7: C(['CONSENSUS'], ['hl-br'], 'card c7'),
  c8: C(['CONSENSUS'], ['hl-br'], 'card c8'),
  c9: C(['CONSENSUS'], ['hl-br'], 'card c9'),
  c10: C(['DATA'], ['calatayud-2015'], 'card c10'),
  c11: C(['DATA'], ['ace-br-emg'], 'card c11'),
  c12: C(['DATA'], ['ace-br-emg'], 'card c12'),
  c13: C(['CONSENSUS'], ['hl-br'], 'card c13'),
  c14: C(['CONSENSUS'], ['ace-br-total'], 'card c14'),
};
const J = (...ids) => C([...new Set(ids.flatMap(i => CL[i].tags))], [...new Set(ids.flatMap(i => CL[i].sources))], `card ${ids.join(', ')}`);

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: `hunch` (card zoom shoulder-blades Wrong, c6) is the spec's Mistake over the end
// (the shoulder blades lifted and hunched forward). No new geometry, so no drawing values.
const END = plateSpec.poses.end, MIS = plateSpec.mistake.pose;
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  hunch: { pose: { ...END, ...MIS } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// The card posture zoom in the zoom shell's shape (pilot-a.closeups.mjs), the Wrong drawn alone (solid). The card hand
// zoom rope-grip has no Wrong (LR-25) and is not drawn (header).
const zooms = [
  {
    key: 'shoulder-blades', chip: 'Shoulders', heading: 'Shoulder blades', kind: 'posture',
    crop: { center: { at: 'shoulder.r', pose: 'right', off: [-8, -12] }, sizePx: 110 },
    right: 'end',
    wrong: { base: 'end', pose: MIS, solid: true },
    callout: {
      right: { text: 'Down and back', anchor: 'shoulder.r' },
      wrong: { text: 'Lifted, hunched', anchor: { at: 'shoulder.r', pose: 'mistake' } },
    },
    caption: {
      right: 'Shoulder blades down and back.',
      wrong: 'Shoulder blades lifted or hunched forward.',
    },
    alt: {
      right: 'Side view, mid-wave. The shoulders sit down and back, arms straight in front.',
      wrong: 'Side view, mid-wave. The shoulders lift toward the ears and hunch forward.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'front_delts', plain: 'The front of the shoulders works in both wave types.', claim: CL.c10 }],
  secondary: [
    { muscleId: 'obliques', plain: 'The sides of the waist work, more in alternating waves.', claim: CL.c10 },
    { muscleId: 'lower_back', plain: 'The low back works too.', claim: CL.c10 },
    { muscleId: 'forearms', plain: 'Your grip works hard in every rope exercise tested.', claim: CL.c11 },
  ],
  textOnly: [   // named in the text, never painted (D-SHIP-Q7, as lib_plank)
    { muscleId: 'core', plain: 'The trunk works with the obliques and low back.', claim: CL.c10 },
  ],
  watch: [],
  feelLine: 'You should feel this in your front shoulders, sides of the waist and forearms.',
  rows: [
    // The card's first three rows (front shoulders, sides of the waist, forearms) have no fix, so they are left out:
    // the feel line and the muscle lines say them.
    { key: 'neck', where: 'Neck', at: { muscles: ['upper_traps'] },
      means: 'Shoulder blades lifting or hunching forward strains the neck.',
      fix: 'Slide your shoulder blades down and back.', claim: CL.c6 },
  ],
  claim: J('c10', 'c11'),
};

/* ---------------------------------------------------------------- risks (card risks; handlingMistakes are posture, Q-W2-12) */
const RISKS = [
  { key: 'neck', text: 'Lifted or hunched shoulder blades strain the neck.', claim: CL.c6 },
];

export default {
  schema: 1,
  id: 'lib_battle_ropes',
  rev: 1,
  plate: plateSpec,
  handling: { archetype: 'none', why: 'D-SHIP-GRIP (b): the card gives no thumb, contact or wrist; the grip type (c4, c14) is on a setup line.' },
  contacts: ['standing-feet'],
  setup: [
    { kind: 'position', text: 'Stand with feet hip-width apart, a little slack in the ropes.', claim: CL.c1 },
    { kind: 'grip', text: 'Handshake grip on each rope end.', claim: J('c1', 'c4', 'c14') },
    { kind: 'position', text: 'Bend your knees slightly and lean forward a little, back straight.', claim: J('c2', 'c4') },
    { kind: 'brace', text: 'Shoulders back, trunk braced.', claim: CL.c2 },
    { kind: 'position', text: 'Swing one rope up as the other comes down.', claim: CL.c3 },
  ],
  posture: [
    { key: 'feet', label: 'Feet planted', detail: 'Feet planted, knees slightly bent.', anchor: { landmark: 'heel.r', pose: 'start' }, claim: J('c2', 'c13') },
    { key: 'lean', label: 'Slight lean', detail: 'Back straight, slight forward lean.', anchor: { landmark: 'backMid', pose: 'start' }, claim: CL.c4 },
    // Q-W2-12: handlingMistake 'Shoulder blades lift or hunch forward' (c6) merged here, its fix the detail
    { key: 'blades', label: 'Shoulder blades', detail: "Shoulder blades down and back. Don't let them lift or hunch forward.",
      anchor: { landmark: 'shoulder.r', pose: 'end' }, zoom: 'shoulder-blades', claim: CL.c6 },
    { key: 'arms', label: 'Arms in front', detail: 'Arms in front, each hand moving from shoulder to waist height.',
      anchor: { landmark: 'grip.r', pose: 'start' }, claim: J('c5', 'c3') },
    // Q-W2-12: handlingMistake 'Holding your breath' (c7)
    { key: 'breathe', label: 'Breathing', detail: "Don't hold your breath. Breathe more as the intensity rises.",
      anchor: { landmark: 'chest', pose: 'start' }, claim: CL.c7 },
    // Q-W2-12: handlingMistake 'Adding speed or a heavier rope too soon' (c8)
    { key: 'form-first', label: 'Form first', detail: 'Adding speed or a heavier rope too soon? Get the form right first.',
      anchor: { landmark: 'grip.l', pose: 'start' }, claim: CL.c8 },
  ],
  feel,
  zooms,
  chips: ['shoulder-blades', 'feel'],
  copy: {
    setupLine: 'Feet hip-width, knees slightly bent, a slight forward lean. One rope end in each hand.',
    mistakeLine: "Don't let your shoulder blades lift or hunch forward. Slide them down and back.",
    cueLine: 'Shoulders down and back.',
  },
  redFlag: RED_FLAG,
  mistakes: [],   // Q-W2-12 (#379 6628699724): NoHandling; the card's handlingMistakes are posture checkpoints above
  risks: RISKS,
  riskFlags: [],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/battle_ropes.json', rev: 1 },
};
