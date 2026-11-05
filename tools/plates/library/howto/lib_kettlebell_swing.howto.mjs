// LIB-SHIP W7: the How-to content of lib_kettlebell_swing (two-hand Russian swing), golden B's HowToContent shape
// (layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the research card
// docs/research/howto/cards/kettlebell_swing.json (cited in its field's claim, cN = card claim id).
// Handling: D-SHIP-GRIP (b3) (D-SHIP-W7-B3; tests/howto/checks/c3-library.ts B3_PINS): NoHandling. The card's grip.thumb
// and grip.wrist are "not given" statements (never printed); grip.handContact c3 (bell tilted toward you) and the
// grip.claims c2, c3, c4, c24 are cited on setup lines. The card hand zoom kb-grip is not drawn: its Right (c2, c3) is
// setup step 2 and 3, its Wrong "Crush grip on the handle." is posture checkpoint crush with c4's fix.
// Feel: glutes primary, hamstrings and lower_back secondary (card feel). Back box: card redFlags ['back'].
// Tier A way out (card tierA.wayOut c20, c21): feel row low-back (stop or reset) and setup step 5 (bell on the ground).
//
// D-TEXT-GOLDEN claim -> slot:
//   posture c6 hinge                 -> posture hinge, plate callout 'hinge'
//   posture c13 back flat            -> posture back, zoom kb-back caption.right
//   posture c7 hips drive, arms loose-> posture drive
//   posture c9 chest height          -> posture height
//   posture c17 feet planted         -> posture feet
//   posture c19 breathe              -> posture breathe
//   c8 stand tall (zoom kb-top Right)-> posture tall, zoom kb-top caption.right
//   handlingMistake lean back c14    -> copy.mistakeLine, zoom kb-top caption.wrong (plate Mistake)
//   handlingMistake lean back c14    -> also posture tall detail
//   handlingMistake back rounds c12, c13, c20 -> posture back (zoom kb-back caption.wrong)
//   handlingMistake arms c16, c7     -> posture drive, feel row arms
//   hand zoom kb-grip Right c2, c3   -> setup steps 2, 3
//   hand zoom kb-grip Wrong c4       -> posture crush (label 'Crush grip'), detail "an easy hook grip, not a crush grip"
//   c24 full grip                    -> setup step 5, risks[grip]
// No variant line (equipment 'Kettlebell').
import plateSpec from '../specs/kettlebell_swing.mjs';
import { RED_FLAG } from '../../layers/howto/shared.mjs';
export { RED_FLAG };

/* ---------------------------------------------------------------- sources (the card's sources) ------------------- */
export const SOURCES = {
  'mo-kb-swing': { cite: 'Kettlebell Swing - Exercise Guide (Motra, formerly Train Fitness)', url: 'https://motra.com/exercises/kettlebellSwing',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'hk-kb-swing': { cite: 'Here’s How to Do a Kettlebell Swing (excerpt from Kettlebell Strength Training Anatomy, Michael Hartle; Human Kinetics)', url: 'https://us.humankinetics.com/blogs/excerpt/here-s-how-to-do-a-kettlebell-swing',
    kind: 'textbook', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'nike-kb-swing': { cite: 'Kettlebell Swings: How To Do Them, Muscles Worked, and Common Mistakes (Nike)', url: 'https://www.nike.com/a/kettlebell-swings',
    kind: 'secondary', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'bb-kb-swing': { cite: 'Learn How to Do Picture Perfect Kettlebell Swings (BarBend)', url: 'https://barbend.com/kettlebell-swings/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'ggr-kb-swing': { cite: 'Kettlebell Swings: How To, Benefits, and Who Should Do Them (Garage Gym Reviews)', url: 'https://www.garagegymreviews.com/kettlebell-swings',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'sl-kb-swing': { cite: 'How to Do Kettlebell Swing: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/kettlebell-swing/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'mf-kb-swing': { cite: 'Kettlebell Swing (Muscle & Fitness exercise library)', url: 'https://www.muscleandfitness.com/exercise/kettlebell-swing/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'pg-kb-swing': { cite: 'Kettlebell Swings (PureGym exercise guide)', url: 'https://www.puregym.com/exercises/plyometrics/kettlebells/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'mcgill-2012': { cite: 'Kettlebell swing, snatch, and bottoms-up carry: back and hip muscle activation, motion, and low back loads.', url: 'https://pubmed.ncbi.nlm.nih.gov/21997449/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-22', use: 'CONSENSUS' },
  // The back box's own source (shared/back-box.mjs boxClaim), as lib_plank lists it: the card's redFlags 'back'.
  'nhs-back': { cite: 'NHS, Back pain', url: 'https://www.nhs.uk/conditions/back-pain/',
    kind: 'guideline', access: 'full', checked: '2026-10-02', use: 'CONSENSUS', note: 'When back pain needs a check.' },
};

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const CL = {
  c1: C(['CONSENSUS'], ['mo-kb-swing','hk-kb-swing','bb-kb-swing'], 'card c1'),
  c2: C(['CONSENSUS'], ['hk-kb-swing','nike-kb-swing'], 'card c2'),
  c3: C(['CONSENSUS'], ['mo-kb-swing','hk-kb-swing'], 'card c3'),
  c4: C(['CONSENSUS'], ['nike-kb-swing','pg-kb-swing'], 'card c4'),
  c5: C(['CONSENSUS'], ['mo-kb-swing','hk-kb-swing','bb-kb-swing'], 'card c5'),
  c6: C(['CONSENSUS'], ['sl-kb-swing','nike-kb-swing','mf-kb-swing','mo-kb-swing'], 'card c6'),
  c7: C(['CONSENSUS'], ['mo-kb-swing','sl-kb-swing'], 'card c7'),
  c8: C(['CONSENSUS'], ['bb-kb-swing','mo-kb-swing','hk-kb-swing'], 'card c8'),
  c9: C(['CONSENSUS'], ['sl-kb-swing','hk-kb-swing','nike-kb-swing'], 'card c9'),
  c10: C(['CONSENSUS'], ['mo-kb-swing','hk-kb-swing','bb-kb-swing'], 'card c10'),
  c11: C(['CONSENSUS'], ['nike-kb-swing','bb-kb-swing'], 'card c11'),
  c12: C(['CONSENSUS'], ['nike-kb-swing','mo-kb-swing','ggr-kb-swing'], 'card c12'),
  c13: C(['CONSENSUS'], ['mf-kb-swing','ggr-kb-swing','mo-kb-swing','bb-kb-swing'], 'card c13'),
  c14: C(['CONSENSUS'], ['bb-kb-swing','nike-kb-swing','hk-kb-swing','mo-kb-swing','mf-kb-swing'], 'card c14'),
  c15: C(['CONSENSUS','WEAK'], ['ggr-kb-swing'], 'card c15'),
  c16: C(['CONSENSUS'], ['nike-kb-swing','bb-kb-swing','mo-kb-swing'], 'card c16'),
  c17: C(['CONSENSUS'], ['nike-kb-swing','ggr-kb-swing'], 'card c17'),
  c18: C(['CONSENSUS'], ['nike-kb-swing','bb-kb-swing'], 'card c18'),
  c19: C(['CONSENSUS'], ['nike-kb-swing','mo-kb-swing','sl-kb-swing'], 'card c19'),
  c20: C(['CONSENSUS'], ['nike-kb-swing','mo-kb-swing'], 'card c20'),
  c21: C(['CONSENSUS'], ['sl-kb-swing'], 'card c21'),
  c22: C(['CONSENSUS'], ['nike-kb-swing','bb-kb-swing'], 'card c22'),
  c23: C(['CONSENSUS'], ['nike-kb-swing','pg-kb-swing'], 'card c23'),
  c24: C(['CONSENSUS'], ['ggr-kb-swing'], 'card c24'),
  c25: C(['CONSENSUS'], ['mo-kb-swing','sl-kb-swing','mcgill-2012'], 'card c25'),
  c26: C(['CONSENSUS','WEAK'], ['mo-kb-swing','hk-kb-swing'], 'card c26'),
  c27: C(['CONSENSUS'], ['ggr-kb-swing'], 'card c27'),
};
const J = (...ids) => C([...new Set(ids.flatMap(i => CL[i].tags))], [...new Set(ids.flatMap(i => CL[i].sources))], `card ${ids.join(', ')}`);

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses:
//   lean    (card zoom kb-top Wrong, c14): the spec's Mistake pose over the end (pelvis tilted back, low back arched).
//   rounded (card zoom kb-back Wrong, c12 "lower back rounded"): the spec's start (the hike) with the lumbar spine flexed
//           ROUND deg more and the pelvis tilted ROUND deg less, so the thorax keeps the start's inclination and only
//           the back shape changes; the feet stay planted and the arms (joint angles in the spec) and bell follow the
//           shoulders. As lib_bent_over_dumbbell_rear_delt_fly's `rounded`.
// DRAWING VALUES (D-SHIP-DRAWVAL, #376 6614695581; precedent D-LIB7-2): ROUND 35 deg is a Wrong-pose size no card gives
// (sized so the round reads at panel size; lib_bent_over_dumbbell_rear_delt_fly uses 20); no number from it appears in user copy; the layers panel judges it.
const ROUND = 35;
const START = plateSpec.poses.start, END = plateSpec.poses.end, MIS = plateSpec.mistake.pose;
const ROUNDED = { root: { ...START.root, tilt: START.root.tilt - ROUND }, trunk: START.trunk + ROUND };
export const stills = {
  start: { pose: START },
  end: { pose: END },
  lean: { pose: { ...END, ...MIS } },
  rounded: { pose: { ...START, ...ROUNDED } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// The two card posture zooms in the zoom shell's shape (pilot-a.closeups.mjs); each Wrong drawn alone (solid). The
// card hand zoom kb-grip is not drawn (D-SHIP-GRIP (b3), header).
const zooms = [
  {
    key: 'kb-top', chip: 'Top', heading: 'Top position', kind: 'posture',
    crop: { center: { at: 'hip.r', pose: 'right', off: [0, -10] }, sizePx: 300 },
    right: 'end',
    wrong: { base: 'end', pose: MIS, solid: true },
    callout: {
      right: { text: 'Standing tall', anchor: 'hip.r' },
      wrong: { text: 'Leaning back', anchor: { at: 'backMid', pose: 'mistake' } },
    },
    caption: {
      right: 'Standing tall, ankles, knees, hips and shoulders in line.',
      wrong: 'Leaning back at the top.',
    },
    alt: {
      right: 'Side view, top of the swing. Ankles, knees, hips and shoulders stack in one line, bell at chest height.',
      wrong: 'Side view, top of the swing. The body leans back and the low back arches.',
    },
  },
  {
    key: 'kb-back', chip: 'Back', heading: 'Back shape', kind: 'posture',
    crop: { center: { at: 'backMid', pose: 'right', off: [0, 10] }, sizePx: 200 },
    right: 'start',
    wrong: { base: 'start', pose: ROUNDED, solid: true },
    callout: {
      right: { text: 'Back flat', anchor: 'backMid' },
      wrong: { text: 'Back rounded', anchor: { at: 'lumbar', pose: 'mistake' } },
    },
    caption: {
      right: 'Back flat, hips pushed back.',
      wrong: 'Lower back rounded.',
    },
    alt: {
      right: 'Side view, the hike. Hips pushed back, back flat, bell between the legs.',
      wrong: 'Side view, the hike. The lower back rounds instead of staying flat.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'glutes', plain: 'The glutes drive the bell.', claim: CL.c25 }],
  secondary: [
    { muscleId: 'hamstrings', plain: 'The backs of the thighs help the hips drive.', claim: CL.c25 },
    { muscleId: 'lower_back', plain: 'The low back steadies you. It should not do the lifting.', claim: J('c25', 'c27') },
  ],
  watch: [],
  feelLine: 'You should feel this in your glutes and the backs of your thighs.',
  rows: [
    // The card's first two rows (glutes and backs of the thighs; the low back a little) have no fix, so they are left
    // out: the feel line and feel.secondary say them (D-FEEL-NOMEANS).
    { key: 'arms', where: 'Arms and shoulders', at: { muscles: ['front_delts'] },
      means: 'You are lifting with the arms instead of the hips.',
      fix: 'Drive with your hips and keep your arms loose.', claim: J('c16', 'c7', 'c20') },
    { key: 'low-back', where: 'Lower back discomfort', at: { muscles: ['lower_back'] },
      means: 'Your form may be breaking down.',
      fix: 'Stop or reset your form.',
      redFlag: 'back', claim: CL.c20 },
  ],
  claim: J('c25', 'c27'),
};

/* ---------------------------------------------------------------- risks (card risks; handlingMistakes are posture, Q-W2-12) */
const RISKS = [
  { key: 'round', text: 'Rounding the lower back strains it.', claim: CL.c12 },
  { key: 'lean', text: 'Leaning back at the top puts more pressure on the lower back.', claim: CL.c14 },
  { key: 'grip', text: 'A loose grip could let the bell slip or be dropped.', claim: CL.c24 },
];

export default {
  schema: 1,
  id: 'lib_kettlebell_swing',
  rev: 1,
  plate: plateSpec,
  handling: { archetype: 'none', why: 'D-SHIP-GRIP (b3): the card gives no thumb or wrist; c2, c3, c4 and c24 are on the setup lines.' },
  contacts: ['standing-feet'],
  setup: [
    { kind: 'position', text: 'Stand with feet about shoulder-width, the bell a foot in front.', claim: CL.c1 },
    { kind: 'grip', text: 'Hinge and grip the handle, hands side by side, palms down.', claim: J('c1', 'c2') },
    { kind: 'grip', text: 'Grip firmly, not too tightly. Tilt the bell toward you.', claim: J('c4', 'c3') },
    { kind: 'position', text: 'Hike the bell back between your legs, high toward the groin.', zoom: 'kb-back', claim: CL.c5 },
    { kind: 'finish', text: 'Keep a full grip. Set the bell on the ground when done.', claim: J('c24', 'c21') },
  ],
  posture: [
    { key: 'hinge', label: 'Hip hinge', detail: 'Hinge at the hips, knees only slightly bent.',
      anchor: { landmark: 'buttock', pose: 'start' }, claim: CL.c6 },
    // Q-W2-12: handlingMistake 'Lower back rounds' (c12, c13, c20) merged here, its fix added
    { key: 'back', label: 'Flat back', detail: 'Keep your back flat through the whole swing. Bell too heavy? Stop or reset.',
      anchor: { landmark: 'backMid', pose: 'start' }, zoom: 'kb-back', claim: J('c13', 'c12', 'c20') },
    // Q-W2-12: handlingMistake 'Lifting with the arms' (c16, c7) merged here, its fix added
    { key: 'drive', label: 'Hip drive', detail: "Drive with your hips. Arms stay straight and loose, they don't lift.",
      anchor: { landmark: 'hip.r', pose: 'end' }, claim: J('c7', 'c16') },
    // Q-W2-12: handlingMistake 'Leaning back at the top' (c14) merged here, its fix added (also copy.mistakeLine)
    { key: 'tall', label: 'Stand tall', detail: "At the top, ankles, knees, hips and shoulders in line. Squeeze your glutes, don't lean back.",
      anchor: { landmark: 'head', pose: 'end' }, zoom: 'kb-top', claim: J('c8', 'c14') },
    // card hand zoom kb-grip Wrong (c4) as a mistake checkpoint (D-SHIP-W7-B3), its fix the detail
    { key: 'crush', label: 'Crush grip', detail: 'Use an easy hook grip, not a crush grip.',
      anchor: { landmark: 'grip.r', pose: 'start' }, claim: CL.c4 },
    { key: 'height', label: 'Chest height', detail: 'Swing to about chest height.',
      anchor: { landmark: 'grip.r', pose: 'end' }, claim: CL.c9 },
    { key: 'feet', label: 'Feet planted', detail: 'Feet planted, heels and toes down.',
      anchor: { landmark: 'heel.r', pose: 'end' }, claim: CL.c17 },
    { key: 'breathe', label: 'Breathing', detail: "Don't hold your breath. Breathe out as you swing up, in as it comes down.",
      anchor: { landmark: 'chest', pose: 'end' }, claim: CL.c19 },
  ],
  feel,
  zooms,
  chips: ['kb-top', 'kb-back', 'feel'],
  copy: {
    setupLine: 'Feet about shoulder-width, bell a foot in front. Both hands on the handle, palms down.',
    mistakeLine: "Don't lean back at the top. Squeeze your glutes and don't overextend.",
    cueLine: 'Hinge, then drive the hips.',
  },
  redFlag: RED_FLAG,
  mistakes: [],   // Q-W2-12 (#379 6628699724): NoHandling; the card's handlingMistakes are posture checkpoints above
  risks: RISKS,
  riskFlags: ['back'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/kettlebell_swing.json', rev: 1 },
};
