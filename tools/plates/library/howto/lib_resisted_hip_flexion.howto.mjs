// LIB-SHIP W7: the How-to content of lib_resisted_hip_flexion (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/resisted_hip_flexion.json; its claim ids are named on each field's claim.
// Handling (D-SHIP-GRIP case (b)): the card's grip.thumb, grip.handContact and grip.wrist are all empty (hand archetype
// balance: one hand on the frame), so there is no hand claim to draw: NoHandling, no hand zoom (the card has none). The
// card's grip.type (c1, c2) is setup step 2.
// Variant line (D-LIB5-VARIANT): equipment 'Cable / Resistance Band'; the card's plate.variantLine: the plate draws the
// cable, the band version is sourced separately (c13), and each line cites the claims for the version it describes.
// Red flags: the card's redFlags (back): LIB-5's back box (shared/back-box.mjs), linked by the lower-back row.
//
// D-TEXT-GOLDEN (claim -> slot):
//   posture upright, core tight (c3, c6, c13, c14) -> posture 'upright', zoom torso-upright
//   posture hips level and square (c6)          -> setup step 3 (D-TEXT-PRINTED), posture 'hips'
//   posture standing leg steady (c12)           -> plate cue 'tall', posture 'stance'
//   posture knee travels straight (c6, c2)      -> setup step 4 (D-TEXT-PRINTED), posture 'knee'
//   zoom ankle-cuff (Wrong null, LR-25; an equipment placement) -> T: setup steps 1-2, posture 'cuff' (D-SHIP-TEXTZOOM)
//   handlingMistakes (Q-W2-12): leaning back (c7, c12, c5) -> zoom torso-upright Wrong, risk 'arch',
//   posture 'upright'; swinging (c7, c6, c3) -> setup step 4, posture 'swing'; stack slamming (c7, c4) -> setup step 5,
//   posture 'slam' (D-TEXT-PRINTED)
//   variant line: the band setup (c13), cited in the copy comment
import plateSpec from '../specs/resisted_hip_flexion.mjs';
import { RED_FLAG } from '../../layers/howto/shared.mjs';
export { RED_FLAG };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'motra-hf': { cite: 'Cable Standing Hip Flexor Raise: Exercise Guide (Motra)', url: 'https://www.motra.com/exercises/cableStandingHipFlexorRaise',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'WEAK' },
  'kovo-hf': { cite: 'Cable Standing Hip Flexion: How to Do It, Form & Muscles Worked (Kovo)', url: 'https://www.kovofitness.com/exercises/cable-standing-hip-flexion',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'WEAK' },
  'outside-hf': { cite: '9 Hip Flexor Exercises to Improve Your Athletic Performance (Outside, Amber Sayer, certified personal trainer)', url: 'https://www.outsideonline.com/health/training-performance/hip-flexor-exercises/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  // The back box's own source (shared/back-box.mjs boxClaim), as lib_rope_triceps_pushdown lists it: the card's redFlags 'back'.
  'nhs-back': { cite: 'NHS, Back pain', url: 'https://www.nhs.uk/conditions/back-pain/',
    kind: 'guideline', access: 'full', checked: '2026-10-02', use: 'CONSENSUS', note: 'When back pain needs a check.' },
};
// Not cited: c8 (tempo, plate only), c9 and c16 (sets and band progression, D-TEXT-PROGRESSION), c15 (the band's
// 2-3 s hold, plate tempo only), c17, c18 (the same muscles and mistakes as c10 and c7).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const MO = 'motra-hf', KO = 'kovo-hf', OU = 'outside-hf';
const W = ['CONSENSUS', 'WEAK'];
const CL = {
  c6: C(W, [MO], 'card c6'),
  c11: C(W, [MO], 'card c11'),
  c12: C(W, [KO], 'card c12'),
  cuff: C(W, [MO, KO], 'card c1, c2'),
  face: C(W, [MO, KO], 'card c1, c2'),
  tall: C(W, [MO, KO], 'card c3, c12, c6'),
  drive: C(W, [KO, MO], 'card c2, c5, c6, c7'),
  lower: C(W, [MO, KO], 'card c3, c4, c7'),
  knee: C(W, [MO, KO], 'card c6, c2'),
  uprightLean: C(['CONSENSUS', 'WEAK'], [MO, OU, KO], 'card c3, c6, c13, c14, c7, c12, c5'),
  swing: C(W, [KO, MO], 'card c7, c6, c3'),
  slam: C(W, [KO, MO], 'card c7, c4'),
  arch: C(W, [KO, MO], 'card c7, c5'),
  lowBack: C(W, [KO, MO], 'card c7, c6, c11'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: the end (thigh about level, torso upright; c2, c3, c5) and the spec's Mistake merged
// over it, as the engine draws it (leaning back, the lower back arched; card plate.mistake, c7). The card zoom
// torso-upright Wrong is that drawn fault, so no drawing value is added here.
const MIS = plateSpec.mistake.pose, END = plateSpec.poses.end;
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  lean: { pose: { ...END, ...MIS } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// torso-upright (M): the zoom shell (render/closeup/crop.mjs); the Wrong is the plate's own Mistake dashed red over the
// right pose, with the plate's Mistake guides. The crop window (centre offset, sizePx) is a drawing value.
const zooms = [
  {
    key: 'torso-upright', chip: 'Torso', heading: 'Upright torso', kind: 'posture',
    // claims: Right (callout, caption, alt) card c3, c2, c5; Wrong card c7
    crop: { center: { at: 'lumbar', pose: 'right', off: [0, -20] }, sizePx: 230 },
    right: 'end',
    wrong: { base: 'end', pose: MIS },
    guides: plateSpec.mistake.guides,
    callout: {
      right: { text: 'Stand tall', anchor: 'chest' },
      wrong: { text: 'Leans back', anchor: { at: 'head', pose: 'mistake' } },
    },
    caption: {
      right: 'Torso upright, thigh at hip height.',
      wrong: 'Torso leaning back, lower back arched.',
    },
    alt: {
      right: 'Side view, top of the lift. The torso stands upright and the strapped thigh is about level with the hip.',
      wrong: 'Side view. The torso leans back and the lower back arches to lift higher. Drawn dashed over the right position.',
    },
    feelRow: 'low-back',
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'hip_flexors', plain: 'The hip flexors lift the knee.' }],
  secondary: [
    { muscleId: 'quads', plain: 'The front of the thigh helps.' },
    { muscleId: 'abs', plain: 'The abs help pull the knee up.' },
  ],
  watch: [],
  feelLine: 'You should feel this in the front of your hip and your lower belly.',
  rows: [
    // The card's first two rows (front of the hip, lower belly) have no fix, so they are left out: the feel line says them.
    { key: 'low-back', where: 'Lower back', at: { muscles: ['lower_back'] },
      means: 'Leaning back or arching to lift higher.',
      fix: 'Stand tall, core tight.',
      zoom: 'torso-upright', redFlag: 'back', claim: CL.lowBack },
  ],
  claim: C(W, [KO, MO], 'card c10, c12'),
};

/* ---------------------------------------------------------------- risks (card risks; handlingMistakes are posture, Q-W2-12) */
const RISKS = [
  { key: 'arch', text: 'Arching the lower back to lift higher.', claim: CL.arch },
  { key: 'pain', text: 'Acute hip or lower-back pain? Skip this exercise.', claim: CL.c11 },
  { key: 'balance', text: 'Stop if balance causes strain.', claim: CL.c11 },
];

export default {
  schema: 1,
  id: 'lib_resisted_hip_flexion',
  rev: 1,
  plate: plateSpec,
  handling: { archetype: 'none', why: 'D-SHIP-GRIP (b): the card gives no thumb, contact or wrist claim; its grip type (c1, c2) is setup step 2.' },
  contacts: ['standing-feet'],   // the card's archetype.contact
  setup: [
    { kind: 'adjust', text: 'Strap the cuff to one ankle on a low cable.', claim: CL.cuff },
    { kind: 'grip', text: 'Face away from the machine, a little tension. Hold the frame.', claim: CL.face },
    { kind: 'brace', text: 'Brace your trunk, stand tall, hips level and square.', zoom: 'torso-upright', claim: CL.tall },
    { kind: 'position', text: "Drive the knee straight up and forward, thigh about level. Don't swing.", claim: CL.drive },
    { kind: 'finish', text: 'Pause briefly. Lower with control, never letting the stack slam. Switch legs.', claim: CL.lower },
  ],
  posture: [
    // Q-W2-12: handlingMistake 'Leaning back to lift higher' (c7, c12, c5) merged here, its fix added
    { key: 'upright', label: 'Upright torso', detail: "Upright, core tight. Don't lean back. Lift only as high as you can without arching.",
      anchor: { landmark: 'chest', pose: 'end' }, zoom: 'torso-upright', claim: CL.uprightLean },
    { key: 'hips', label: 'Hips square', detail: 'Hips level and square, no rotation.',
      anchor: { landmark: 'hip.r', pose: 'end' }, claim: CL.c6 },
    { key: 'stance', label: 'Standing leg steady', detail: 'Standing leg steady.',
      anchor: { landmark: 'knee.l', pose: 'end' }, claim: CL.c12 },
    { key: 'knee', label: 'Knee straight', detail: 'Knee travels straight forward.',
      anchor: { landmark: 'knee.r', pose: 'end' }, claim: CL.knee },
    // Q-W2-12: handlingMistakes 'Swinging the leg up' (c7, c6, c3) and 'Letting the stack slam down' (c7, c4)
    { key: 'swing', label: 'Swinging the leg', detail: 'Lift slowly from the hip.',
      anchor: { landmark: 'knee.r', pose: 'end' }, claim: CL.swing },
    { key: 'slam', label: 'Stack slamming down', detail: 'Lower with control.',
      anchor: { landmark: 'ankle.r', pose: 'start' }, claim: CL.slam },
    // D-SHIP-TEXTZOOM: the card zoom ankle-cuff as a text checkpoint (its Wrong is null, LR-25)
    { key: 'cuff', label: 'Cuff on ankle', detail: 'Cuff around the ankle, slight cable tension.',
      anchor: { landmark: 'ankle.r', pose: 'start' }, claim: CL.cuff },
  ],
  feel,
  zooms,
  chips: ['torso-upright', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'Cuff on one ankle, facing away from a low cable. Hold the frame.',   // card c1, c2
    mistakeLine: "Don't lean back to lift higher. Stand tall, core tight.",   // card c7, c6
    cueLine: 'Stand tall, knee up.',   // card c12, c3
    // D-LIB5-VARIANT: the card's plate.variantLine; the band setup is c13's.
    variantLine: 'Band version: band round a low anchor and your shoe.',
  },
  redFlag: RED_FLAG,
  mistakes: [],   // Q-W2-12 (#379 6628699724): the card's handlingMistakes are posture checkpoints above
  risks: RISKS,
  riskFlags: ['back'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/resisted_hip_flexion.json', rev: 1 },
};
