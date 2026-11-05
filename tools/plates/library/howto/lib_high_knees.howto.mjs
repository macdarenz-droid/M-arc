// LIB-SHIP W7: the How-to content of lib_high_knees, golden B's HowToContent shape
// (layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the research card
// docs/research/howto/cards/high_knees.json (cited in its field's claim, cN = card claim id).
// Handling: none (card grip note: hand archetype none, the arms pump freely, c2; no hand zoom).
// Feel (D-SHIP-Q7): the card's secondary `core` is text only (feel.textOnly), as lib_plank. Every card feel row has an
// empty fix, so no row is shown (D-FEEL-NOMEANS); the feel line and textOnly carry c11 and c12.
// No back box (card redFlags []). No variant line (equipment 'Bodyweight').
//
// D-TEXT-GOLDEN claim -> slot:
//   posture c1 chest tall, eyes ahead  -> posture chest, setup step 1
//   posture c3 thigh to hip height     -> posture thigh (zoom knee-height), setup step 3
//   posture c5 back doesn't arch       -> posture back, zoom knee-height caption.wrong, risks[arch]
//   posture c4 balls of feet (T)       -> posture balls (card zoom ball-of-foot: Wrong null, LR-25, D-SHIP-TEXTZOOM), setup step 2
//   handlingMistake knees too high c5, c3 -> posture back (fix added), copy.mistakeLine
//   handlingMistake knee drops c6      -> posture drops
//   handlingMistake legs turn out c7   -> posture turn-out
// D-TEXT-PRINTED (W7, #394): T ball-of-foot 'knee soft' (c4) -> setup step 2; c6 and c7 stop lines -> risks[tire].
// Left off (D-TEXT-PROGRESSION): c9 (easier march, harder versions).
import plateSpec from '../specs/high_knees.mjs';
import { RED_FLAG } from '../../layers/howto/shared.mjs';
export { RED_FLAG };

/* ---------------------------------------------------------------- sources (the card's sources) ------------------- */
export const SOURCES = {
  'hl-hk': { cite: 'It\'s Time to Revisit the High Knees Exercise You Learned in PE (Healthline; medically reviewed by a NASM-CPT)', url: 'https://www.healthline.com/health/fitness/high-knees-benefits',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'bb-hk': { cite: 'Learn How to Do High Knees to Step Up Your Leg & Core Game (BarBend)', url: 'https://barbend.com/high-knees/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'ace-cardio15': { cite: 'Rev up Your Cardio With This 15-Minute Drill (ACE blog)', url: 'https://www.acefitness.org/resources/everyone/blog/5430/rev-up-your-cardio-with-this-15-minute-drill/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
};

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const CL = {
  c1: C(['CONSENSUS'], ['hl-hk'], 'card c1'),
  c2: C(['CONSENSUS'], ['hl-hk','ace-cardio15'], 'card c2'),
  c3: C(['CONSENSUS'], ['bb-hk'], 'card c3'),
  c4: C(['CONSENSUS'], ['bb-hk'], 'card c4'),
  c5: C(['CONSENSUS'], ['bb-hk'], 'card c5'),
  c6: C(['CONSENSUS'], ['bb-hk'], 'card c6'),
  c7: C(['CONSENSUS'], ['bb-hk'], 'card c7'),
  c8: C(['CONSENSUS'], ['hl-hk'], 'card c8'),
  c9: C(['CONSENSUS'], ['hl-hk'], 'card c9'),
  c10: C(['CONSENSUS'], ['hl-hk'], 'card c10'),
  c11: C(['CONSENSUS'], ['bb-hk','hl-hk'], 'card c11'),
  c12: C(['CONSENSUS'], ['bb-hk'], 'card c12'),
};
const J = (...ids) => C([...new Set(ids.flatMap(i => CL[i].tags))], [...new Set(ids.flatMap(i => CL[i].sources))], `card ${ids.join(', ')}`);

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: `arch` (card zoom knee-height Wrong, c5) is the spec's Mistake over the end (the
// knee driven higher, pelvis tilted back, low back arched). No new geometry, so no drawing values.
const END = plateSpec.poses.end, MIS = plateSpec.mistake.pose;
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  arch: { pose: { ...END, ...MIS } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// The card zoom knee-height in the zoom shell's shape (pilot-a.closeups.mjs), the Wrong drawn alone (solid). The card
// zoom ball-of-foot has no Wrong (LR-25), so it is the text checkpoint posture[balls] (D-SHIP-TEXTZOOM).
const zooms = [
  {
    key: 'knee-height', chip: 'Knee height', heading: 'Knee height', kind: 'posture',
    crop: { center: { at: 'hip.r', pose: 'right', off: [0, -30] }, sizePx: 250 },
    right: 'end',
    wrong: { base: 'end', pose: MIS, solid: true },
    callout: {
      right: { text: 'Thigh to hip', anchor: 'knee.r' },
      wrong: { text: 'Back arched', anchor: { at: 'lumbar', pose: 'mistake' } },
    },
    caption: {
      right: 'Thigh at about hip height, chest tall.',
      wrong: 'Knee driven higher, lower back arched.',
    },
    alt: {
      right: 'Side view. One thigh is raised to about hip height, the chest tall and upright.',
      wrong: 'Side view. The knee is driven higher, so the lower back arches and the trunk tips back.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'hip_flexors', plain: 'The front of the hips pulls each thigh up.', claim: CL.c11 }],
  secondary: [{ muscleId: 'quads', plain: 'The front of the thighs steadies the standing leg.', claim: CL.c11 }],
  textOnly: [   // named in the text, never painted (D-SHIP-Q7, as lib_plank)
    { muscleId: 'core', plain: 'The trunk braces to keep you balanced as the legs switch.', claim: CL.c12 },
  ],
  watch: [],
  feelLine: 'You should feel this in the front of your hips and thighs.',
  rows: [],   // every card row has an empty fix (D-FEEL-NOMEANS); the feel line and textOnly say them
  claim: J('c11', 'c12'),
};

/* ---------------------------------------------------------------- risks (card risks; handlingMistakes are posture, Q-W2-12) */
const RISKS = [
  { key: 'arch', text: 'Driving the knees too high arches the lower back.', claim: CL.c5 },
  { key: 'shoes', text: 'Wear supportive shoes. Knee or ankle issues? Use a gym floor or grass.', claim: CL.c10 },
  // D-TEXT-PRINTED (W7, #394): the stop lines of handlingMistakes c6 and c7 (posture drops, turn-out are not printed)
  { key: 'tire', text: 'Knee height dropping, or legs turning out more as you tire? Take a rest.', claim: J('c6', 'c7') },
];

export default {
  schema: 1,
  id: 'lib_high_knees',
  rev: 1,
  plate: plateSpec,
  handling: { archetype: 'none', why: 'The card hand archetype is none: the arms pump freely (c2).' },
  contacts: ['standing-feet'],
  setup: [
    { kind: 'position', text: 'Stand tall, feet about hip-width apart, arms at your sides.', claim: J('c1', 'c4') },
    { kind: 'brace', text: 'Brace your trunk, shift onto the balls of your feet, knees soft.', claim: J('c1', 'c4') },
    { kind: 'position', text: 'Drive one knee to hip height as the opposite arm pumps up.', zoom: 'knee-height', claim: J('c2', 'c3') },
    { kind: 'position', text: 'Lower it quickly and switch legs.', claim: CL.c2 },
    { kind: 'finish', text: 'To start, work 30 seconds, then rest 30 seconds.', claim: CL.c8 },
  ],
  posture: [
    { key: 'chest', label: 'Chest tall', detail: 'Chest tall, eyes ahead.', anchor: { landmark: 'sternum', pose: 'start' }, claim: CL.c1 },
    { key: 'thigh', label: 'Thigh to hip', detail: 'Thigh up to about hip height.',
      anchor: { landmark: 'knee.r', pose: 'end' }, zoom: 'knee-height', claim: CL.c3 },
    // Q-W2-12: handlingMistake 'Knees so high your back arches' (c5, c3) merged here, its fix added
    { key: 'back', label: 'Braced trunk', detail: "Lower back doesn't arch. Brace your trunk, knee at hip height.",
      anchor: { landmark: 'lumbar', pose: 'end' }, claim: J('c5', 'c3') },
    // D-SHIP-TEXTZOOM: the card zoom ball-of-foot (Wrong null, LR-25) as a text checkpoint
    { key: 'balls', label: 'Balls of feet', detail: 'On the balls of your feet, knees soft.', anchor: { landmark: 'ball.l', pose: 'end' }, claim: CL.c4 },
    // Q-W2-12: handlingMistake 'Knee height slowly drops' (c6)
    { key: 'drops', label: 'Dropping knees', detail: 'Knee height slowly drops? Take a short rest.', anchor: { landmark: 'knee.r', pose: 'end' }, claim: CL.c6 },
    // Q-W2-12: handlingMistake 'Legs turn out more and more as you tire' (c7)
    { key: 'turn-out', label: 'Legs turning out', detail: 'Legs turn out more and more as you tire? Take a break.',
      anchor: { landmark: 'hip.r', pose: 'end' }, claim: CL.c7 },
  ],
  feel,
  zooms,
  chips: ['knee-height', 'feel'],
  copy: {
    setupLine: 'Stand tall, feet about hip-width, on the balls of your feet. Brace your trunk.',
    mistakeLine: "Don't drive the knees so high your back arches. Keep the knee at hip height.",
    cueLine: 'Thigh to hip, chest tall.',
  },
  redFlag: RED_FLAG,
  mistakes: [],   // Q-W2-12 (#379 6628699724): the card's handlingMistakes are posture checkpoints above
  risks: RISKS,
  riskFlags: [],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/high_knees.json', rev: 1 },
};
