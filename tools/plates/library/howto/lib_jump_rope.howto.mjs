// LIB-SHIP W7: the How-to content of lib_jump_rope (basic bounce, front view), golden B's HowToContent shape
// (layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the research card
// docs/research/howto/cards/jump_rope.json (cited in its field's claim, cN = card claim id).
// Handling: D-SHIP-GRIP (b3) (D-SHIP-W7-B3; tests/howto/checks/c3-library.ts B3_PINS): NoHandling. The card's
// grip.handContact (c2) and grip.wrist (c5) and the grip.claims c2, c5, c8 are cited on setup and posture lines; the card
// has no thumb. The card hand zoom `grip` is not drawn: its Right (c2) is setup step 2; its Wrong (c2, c3) is the
// mistake checkpoint posture[tight] (the NoHandling renderer takes no handling mistakes, Q-W2-12).
// Front-view plate (card plate.view): the crops are cut in the plate's own view (F-CROP-FRONT).
// Feel: calves primary, quads secondary (card feel); the wrist row links the shared wrist box (card redFlags ['wrist']).
// No variant line (equipment 'Jump Rope').
//
// D-TEXT-GOLDEN claim -> slot:
//   posture c5 elbows in               -> posture elbows (zoom elbows)
//   posture c5 wrists turn the rope    -> posture wrists
//   posture c8 hands at hip height     -> posture hands
//   posture c9 jump 1 to 2 inches      -> posture hop (zoom hop)
//   posture c10 knees bent, land soft  -> posture knees
//   posture c12 one jump per turn      -> posture one-jump
//   handlingMistake jumping too high c9   -> posture hop (fix), zoom hop caption.wrong, copy.mistakeLine
//   handlingMistake arms turn rope c6, c5 -> posture wrists (fix), zoom elbows caption.wrong, risks[arms]
//   handlingMistake grip too tight c3, c2 -> posture tight
//   hand zoom grip Right c2            -> setup step 2
//   hand zoom grip Wrong c2, c3        -> posture tight (label 'Tight grip', "Knuckles white?")
// Left off (D-TEXT-PROGRESSION): c16 (stepping over first, work and rest build-up); c17 cadence (not a form point).
import plateSpec from '../specs/jump_rope.mjs';
import { RED_FLAG } from '../../layers/howto/shared.mjs';
export { RED_FLAG };

/* ---------------------------------------------------------------- sources (the card's sources) ------------------- */
export const SOURCES = {
  'ggr-jumprope': { cite: 'How to Jump Rope: 5 Easy Steps From an Expert (Garage Gym Reviews)', url: 'https://www.garagegymreviews.com/how-to-jump-rope',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'fv-jumprope': { cite: 'Jump Rope: The Ultimate Guide – Fitness Volt', url: 'https://fitnessvolt.com/jump-rope/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'elevate-wrist': { cite: 'Why Does Jumping Rope Hurt My Wrists? | Elevate Rope', url: 'https://www.elevaterope.com/blogs/articles/jump-rope-wrist-pain',
    kind: 'manufacturer', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'crossrope-howto': { cite: 'How to Jump Rope: The Complete Beginner’s Guide | Crossrope', url: 'https://www.crossrope.com/blogs/blog/how-to-jump-rope',
    kind: 'manufacturer', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  // RED_FLAG's own source (layers/howto/shared.mjs), as lib_mountain_climbers lists it: the card's redFlags 'wrist'.
  'nhs-wrist-pain': { cite: 'NHS, Wrist pain', url: 'https://www.nhs.uk/conditions/hand-pain/wrist-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When wrist pain needs a check.' },
};

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const CL = {
  c1: C(['CONSENSUS'], ['fv-jumprope','ggr-jumprope'], 'card c1'),
  c2: C(['CONSENSUS'], ['ggr-jumprope','elevate-wrist'], 'card c2'),
  c3: C(['WEAK'], ['elevate-wrist'], 'card c3'),
  c4: C(['CONSENSUS'], ['ggr-jumprope','fv-jumprope'], 'card c4'),
  c5: C(['CONSENSUS'], ['ggr-jumprope','crossrope-howto','elevate-wrist'], 'card c5'),
  c6: C(['WEAK'], ['elevate-wrist'], 'card c6'),
  c7: C(['WEAK'], ['elevate-wrist'], 'card c7'),
  c8: C(['CONSENSUS'], ['fv-jumprope','ggr-jumprope'], 'card c8'),
  c9: C(['CONSENSUS'], ['ggr-jumprope','crossrope-howto','fv-jumprope'], 'card c9'),
  c10: C(['CONSENSUS'], ['ggr-jumprope','crossrope-howto'], 'card c10'),
  c11: C(['CONSENSUS'], ['ggr-jumprope'], 'card c11'),
  c12: C(['CONSENSUS'], ['fv-jumprope'], 'card c12'),
  c13: C(['CONSENSUS'], ['fv-jumprope'], 'card c13'),
  c14: C(['CONSENSUS'], ['fv-jumprope'], 'card c14'),
  c15: C(['CONSENSUS'], ['fv-jumprope'], 'card c15'),
  c16: C(['CONSENSUS'], ['ggr-jumprope'], 'card c16'),
  c17: C(['CONSENSUS'], ['ggr-jumprope','fv-jumprope'], 'card c17'),
};
const J = (...ids) => C([...new Set(ids.flatMap(i => CL[i].tags))], [...new Set(ids.flatMap(i => CL[i].sources))], `card ${ids.join(', ')}`);

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses (the spec's arms are joint angles, so the rope follows the grips):
//   high (card zoom hop Wrong, c9): the spec's Mistake over the end (the same body lifted much higher off the floor).
//         The knee tuck of the card's Wrong does not show in the front view, so it stays text (posture knees, c10).
//   wide (card zoom elbows Wrong, c5, c6 "elbows out wide"): the start with each shoulder's plane of elevation turned
//         WIDE deg toward the frontal plane (abduction), elevation, rotation and elbow bend kept: the elbows swing out
//         from the ribs and the hands stay near hip height.
// DRAWING VALUES (D-SHIP-DRAWVAL, #376 6614695581; precedent D-LIB7-2): WIDE 50 deg is a Wrong-pose size no card gives;
// no number from it appears in user copy; the layers panel judges it.
const WIDE = 50;
const START = plateSpec.poses.start, END = plateSpec.poses.end, MIS = plateSpec.mistake.pose;
const WIDE_ARMS = { shoulder: Object.fromEntries(['l', 'r'].map(s => [s, { ...START.shoulder[s], plane: START.shoulder[s].plane + WIDE }])) };
export const stills = {
  start: { pose: START },
  end: { pose: END },
  high: { pose: { ...END, ...MIS } },
  wide: { pose: { ...START, ...WIDE_ARMS } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// The two card posture zooms in the zoom shell's shape (pilot-a.closeups.mjs), each Wrong drawn alone (solid). The card
// hand zoom `grip` is not drawn (D-SHIP-GRIP (b3), header).
const zooms = [
  {
    key: 'hop', chip: 'Hop', heading: 'Hop height', kind: 'posture',
    crop: { center: { at: 'knee.r', pose: 'right', off: [0, 20] }, sizePx: 200 },
    right: 'end',
    wrong: { base: 'end', pose: MIS, solid: true },
    callout: {
      right: { text: 'Low hop', anchor: 'ankle.r' },
      wrong: { text: 'Too high', anchor: { at: 'ankle.r', pose: 'mistake' } },
    },
    caption: {
      right: 'Low hop, knees slightly bent.',
      wrong: 'Jumping too high over the rope.',
    },
    alt: {
      right: 'Front view, mid-hop. The feet just clear the rope, a small gap under the soles.',
      wrong: 'Front view, mid-hop. The body jumps far higher than the rope needs.',
    },
  },
  {
    key: 'elbows', chip: 'Elbows', heading: 'Elbow position', kind: 'posture',
    crop: { center: { at: 'chest', pose: 'right', off: [0, 40] }, sizePx: 250 },
    right: 'start',
    wrong: { base: 'start', pose: WIDE_ARMS, solid: true },
    callout: {
      right: { text: 'Elbows in', anchor: 'elbow.r' },
      wrong: { text: 'Elbows wide', anchor: { at: 'elbow.r', pose: 'mistake' } },
    },
    caption: {
      right: 'Elbows close to the ribs, hands by the hips.',
      wrong: 'Shoulders swinging, elbows out wide.',
    },
    alt: {
      right: 'Front view. The elbows stay close to the ribs and the hands sit by the hips.',
      wrong: 'Front view. The elbows swing out wide from the ribs, so the arms turn the rope.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'calves', plain: 'The jump comes from your ankles and calves.', claim: CL.c11 }],
  secondary: [{ muscleId: 'quads', plain: 'The front of the thighs cushions each landing.', claim: J('c11', 'c10') }],
  watch: [],
  feelLine: 'You should feel this in your calves and the front of your thighs.',
  rows: [
    // The card's first two rows (calves; front of the thighs) have no fix, so they are left out: the feel line says them.
    { key: 'shoulders', where: 'Shoulders', at: { muscles: ['front_delts'] },
      means: 'Feeling the turn here means it starts in the wrong place.',
      fix: 'Turn the rope with your wrists, elbows in.', claim: J('c7', 'c5') },
    { key: 'wrists', where: 'Wrists', at: { muscles: ['forearms'] },
      means: 'An ache here usually comes from the arms turning the rope.',
      fix: 'Keep your elbows close to your ribs. Turn the rope with your wrists.',
      redFlag: true, claim: J('c6', 'c5') },   // true = the shared wrist RED_FLAG (content-types FeelRow)
  ],
  claim: J('c11', 'c10'),
};

/* ---------------------------------------------------------------- risks (card risks; handlingMistakes are posture, Q-W2-12) */
const RISKS = [
  { key: 'arms', text: 'Turning the rope with your arms, not your wrists, can make your wrists hurt.', claim: CL.c6 },
  { key: 'build', text: 'Too much too soon can leave your feet and shins sore.', claim: CL.c13 },
  { key: 'overhead', text: 'Check overhead: hitting a light or ceiling fan could cause serious injury.', claim: CL.c14 },
];

export default {
  schema: 1,
  id: 'lib_jump_rope',
  rev: 1,
  plate: plateSpec,
  handling: { archetype: 'none', why: 'D-SHIP-GRIP (b3): the card gives no thumb; c2, c5 and c8 are on the setup and posture lines.' },
  contacts: ['standing-feet'],
  setup: [
    { kind: 'adjust', text: "Stand on the rope's middle. The handles should reach your armpits.", claim: CL.c1 },
    { kind: 'grip', text: 'Hold the handles loosely, toward their ends.', claim: CL.c2 },
    { kind: 'position', text: 'Feet together, rope behind your feet, hands by your sides.', claim: CL.c4 },
    { kind: 'position', text: 'Swing the rope overhead and jump as it reaches your feet.', zoom: 'hop', claim: CL.c4 },
    { kind: 'safety', text: 'Where possible, avoid concrete. A sprung wooden or matted floor is better.', claim: CL.c15 },
  ],
  posture: [
    { key: 'elbows', label: 'Elbows in', detail: 'Elbows in, close to your ribs.',
      anchor: { landmark: 'elbow.r', pose: 'start' }, zoom: 'elbows', claim: CL.c5 },
    // Q-W2-12: handlingMistake 'Turning the rope with your arms' (c6, c5) merged here
    { key: 'wrists', label: 'Wrist turn', detail: 'Turn the rope with your wrists, not your elbows or shoulders.',
      anchor: { landmark: 'wrist.r', pose: 'start' }, claim: J('c5', 'c6') },
    { key: 'hands', label: 'Hands by hips', detail: 'Hands at about hip height, slightly away from your body.',
      anchor: { landmark: 'grip.l', pose: 'start' }, claim: CL.c8 },
    // Q-W2-12: handlingMistake 'Jumping too high' (c9) merged here, its fix the detail
    { key: 'hop', label: 'Low hop', detail: 'Jump only high enough to clear the rope, about 1 to 2 inches.',
      anchor: { landmark: 'ankle.r', pose: 'end' }, zoom: 'hop', claim: CL.c9 },
    { key: 'knees', label: 'Soft knees', detail: "Knees slightly bent, not tucked up. Land softly on the balls of your feet.",
      anchor: { landmark: 'knee.r', pose: 'end' }, claim: CL.c10 },
    { key: 'one-jump', label: 'One jump', detail: 'One jump per turn of the rope.', anchor: { landmark: 'sole.r', pose: 'end' }, claim: CL.c12 },
    // Q-W2-12: handlingMistake 'Gripping the handles too tight' (c3, c2) and the card hand zoom grip's Wrong
    { key: 'tight', label: 'Tight grip', detail: "Knuckles white? Hold just firm enough that the handles won't fly out.",
      anchor: { landmark: 'grip.r', pose: 'start' }, claim: J('c3', 'c2') },
  ],
  feel,
  zooms,
  chips: ['hop', 'elbows', 'feel'],
  copy: {
    setupLine: 'Handles reach your armpits. Hold them loosely toward their ends, hands by your sides.',
    mistakeLine: "Don't jump too high. Just clear the rope.",
    cueLine: 'Elbows in, turn with the wrists.',
  },
  redFlag: RED_FLAG,
  mistakes: [],   // Q-W2-12 (#379 6628699724): NoHandling; the card's handlingMistakes are posture checkpoints above
  risks: RISKS,
  riskFlags: ['wrist'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/jump_rope.json', rev: 1 },
};
