// LIB-SHIP W3: the How-to content of lib_straight_arm_pulldown (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/straight_arm_pulldown.json; its claim ids are named on each field's claim.
// No hand zoom (D-SHIP-C3, card-no-zoom): the card has no hand zoom (its zooms are elbow and trunk); the id is on
// tools/plates/library/hands/no-zoom.json. Its one hand claim (overhand straight bar, about shoulder width; c1) lives in
// handling and setup.
// GRIP (c) (SHIP W3 PLAN RULED, cable_fly precedent Q-W2-9): the card's grip.thumb, grip.handContact and grip.wrist read
// "Hold archetype default (GA 3.1) … No exercise-specific source". The thumb and contact below are golden B's `hold`
// archetype default (layers/exercises/dumbbell_lateral_raise.howto.mjs handling: thumb wrapped, contact mid-palm,
// loadAxis across), cited CONVENTION (source hold-default), never shown. No source gives a wrist range, so the wrist is
// `exempt`.
// Red flags: the card's redFlags (back): LIB-5's back box (tools/plates/library/shared/back-box.mjs), linked by the
// lower-back row's redFlag: 'back'.
// No variant line (equipment 'Cable').
import plateSpec from '../specs/straight_arm_pulldown.mjs';
import { RED_FLAG } from '../../layers/howto/shared.mjs';
export { RED_FLAG };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'athlean-sap': { cite: 'How To Do The Straight Arm Pulldown', url: 'https://learn.athleanx.com/articles/back-for-men/how-to-do-a-straight-arm-pulldown',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'catalyst-sap': { cite: 'Straight-Arm Pulldown (Catalyst Athletics exercise library)', url: 'https://www.catalystathletics.com/exercise/907/Straight-Arm-Pulldown/',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'ace-sap': { cite: 'Straight Arm Pressdown (ACE exercise library)', url: 'https://www.acefitness.org/resources/everyone/exercise-library/334/straight-arm-pressdown/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  difonza2026: { cite: 'Electromyographic Analysis of Latissimus Dorsi Activation During Common Resistance Training Exercises: A Narrative Review', url: 'https://pubmed.ncbi.nlm.nih.gov/42647355/',
    kind: 'peer-reviewed', access: 'full', checked: '2026-09-30', use: 'DATA' },
  // golden B's `hold` archetype default for the hand values the card leaves unsourced (thumb, contact): a convention.
  'hold-default': { cite: 'Golden B hold archetype default (dumbbell_lateral_raise handling: thumb wrapped, contact mid-palm)', url: 'tools/plates/layers/exercises/dumbbell_lateral_raise.howto.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-04', use: 'CONVENTION' },
  // The back box's own source (shared/back-box.mjs boxClaim), as lib_barbell_row lists it: the card's redFlags 'back'.
  'nhs-back': { cite: 'NHS, Back pain', url: 'https://www.nhs.uk/conditions/back-pain/',
    kind: 'guideline', access: 'full', checked: '2026-10-02', use: 'CONSENSUS', note: 'When back pain needs a check.' },
  // RED_FLAG's own source (layers/howto/shared.mjs), as golden B's machine_chest_press lists it.
  'nhs-wrist-pain': { cite: 'NHS, Wrist pain', url: 'https://www.nhs.uk/conditions/hand-pain/wrist-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When wrist pain needs a check.' },
};
// Not cited: c15 (tempo, plate only), c16 (load progression; the five setup steps are full), so acsm2009 is not listed.

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const ATH = 'athlean-sap', CAT = 'catalyst-sap', ACE = 'ace-sap';
const CL = {
  c1: C(['CONSENSUS'], [ATH, CAT], 'c1'),
  c2: C(['CONSENSUS'], [ATH, ACE], 'c2'),
  c3: C(['CONSENSUS', 'WEAK'], [ATH, ACE], 'c3'),
  c4: C(['CONSENSUS'], [ATH, CAT, ACE], 'c4'),
  c5: C(['CONSENSUS'], [ATH, CAT], 'c5'),
  c7: C(['CONSENSUS'], [ATH], 'c7'),
  c8: C(['CONSENSUS'], [ATH, ACE], 'c8'),
  c9: C(['CONSENSUS'], [ATH], 'c9'),
  bend: C(['CONSENSUS'], [ATH, CAT, ACE], 'c6, c4'),
  arch: C(['CONSENSUS', 'MECH'], [ATH], 'c9, c10'),
  trunk: C(['CONSENSUS'], [ATH, CAT], 'c9, c5'),
  hold: C(['CONVENTION'], ['hold-default'], 'card grip.thumb and grip.handContact: hold archetype default, no exercise-specific source; golden B\'s hold default, not a card claim, never shown'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: the end (bar at the front of the thighs, arms nearly straight; c4, c5) and the spec's
// Mistake pose merged over it, as the engine draws it (the elbows bend as the bar comes down; card plate.mistake, c6).
// The card zoom `elbow` Wrong is that drawn fault, so no drawing value is added there.
// The card zoom `trunk` Wrong ("lower back arched", c9) is not the plate's drawn fault, so its pose is a drawing value:
// DRAWING VALUES (D-SHIP-DRAWVAL, #376 6614695581; precedent D-LIB7-2 and golden B's machine_chest_press seatDrop): the
// end pose with the trunk bent back on the pelvis to -15 (lumbar extension; the plate's own end trunk is 0, spine
// neutral c9). The card gives no size, so no number appears in user copy; the layers panel judges it.
const MIS = plateSpec.mistake.pose, END = plateSpec.poses.end;
const ARCH = { trunk: -15 };
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  bend: { pose: { ...END, ...MIS } },
  arch: { pose: { ...END, ...ARCH } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom (elbow, trunk), zoom shell form (render/closeup/crop.mjs).
const zooms = [
  {
    key: 'elbow', chip: 'Elbows', heading: 'Elbow bend', kind: 'posture',   // card zoom key: elbow
    crop: { center: { at: 'elbow.r', pose: 'right', off: [0, 0] }, sizePx: 170 },
    right: 'end',
    wrong: { base: 'end', pose: MIS },
    callout: {
      right: { text: 'Slight bend', anchor: 'elbow.r' },
      wrong: { text: 'Elbows bend', anchor: { at: 'elbow.r', pose: 'mistake' } },
    },
    caption: {
      right: 'Arm almost straight, same slight bend all rep.',
      wrong: 'Elbow bent at the bottom, like a pushdown.',
    },
    alt: {
      right: 'Side view, standing at the cable. The bar is at the front of the thighs. The arms are almost straight.',
      wrong: 'Side view. The elbows bend as the bar comes down, like a triceps pushdown. Drawn dashed over the right position.',
    },
    feelRow: 'triceps',
  },
  {
    key: 'trunk', chip: 'Trunk', heading: 'Trunk position', kind: 'posture',   // card zoom key: trunk
    crop: { center: { at: 'lumbar', pose: 'right', off: [0, 0] }, sizePx: 190 },
    right: 'end',
    wrong: { base: 'end', pose: ARCH },
    callout: {
      right: { text: 'Chest tall', anchor: 'backMid' },
      wrong: { text: 'Back arched', anchor: { at: 'lumbar', pose: 'mistake' } },
    },
    caption: {
      right: 'Trunk braced and still, chest tall at the bottom.',
      wrong: 'Lower back arched.',
    },
    alt: {
      right: 'Side view, bar at the thighs. The trunk is braced and still, the chest tall, the spine neutral.',
      wrong: 'Side view. The lower back is arched as the bar comes down. Drawn dashed over the right position.',
    },
    feelRow: 'low-back',
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [
    { muscleId: 'lats', plain: 'The lats do most of the work.' },
  ],
  secondary: [
    { muscleId: 'triceps', plain: 'The back of the upper arm helps move the arm down.' },
    { muscleId: 'rear_delts', plain: 'The rear delts help only slightly.' },
  ],
  watch: [
    { muscleId: 'lower_back', plain: 'Feeling it in the lower back more than the lats means the setup is off.' },
  ],
  feelLine: 'You should feel this in your lats, with little biceps or upper-back work.',
  rows: [
    { key: 'low-back', where: 'Lower back', at: { muscles: ['lower_back'] },
      means: 'Watch for an arching lower back or a swinging torso.',
      fix: 'Brace and move only the arms.',
      zoom: 'trunk', redFlag: 'back', claim: C(['CONSENSUS', 'MECH'], [ATH], 'c9, c10, c7') },
    { key: 'triceps', where: 'Mostly the triceps', at: { muscles: ['triceps'] },
      means: 'Watch for bending elbows, which turns it into a pushdown.',
      fix: 'Keep the same slight elbow bend top to bottom.',
      zoom: 'elbow', claim: CL.bend },
    { key: 'arms', where: 'Arms, little back', at: { muscles: ['triceps'] },
      means: 'Going too heavy brings jerking, torso swing and momentum.',
      fix: 'Drop the weight until you can pause at the bottom.',
      claim: CL.c7 },
  ],
  libraryDiff: { add: [], why: 'Rear delts are a sheet secondary on coach-source mechanics only (card c12), too thin for the library entry.' },
  claim: C(['CONSENSUS', 'DATA', 'WEAK', 'MECH'], [CAT, ATH, 'difonza2026'], 'c11, c13, c12'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'bend', title: 'Bending the elbows', zoom: 'elbow', claim: CL.bend,
    fix: 'Keep the same slight elbow bend all set.' },
  { key: 'heavy', title: 'Too much weight', claim: CL.c7,
    fix: 'Lower the weight until you can pause at the bottom.' },
  { key: 'arch', title: 'Arching the lower back', zoom: 'trunk', claim: CL.arch,
    fix: 'Brace the stomach and move only the arms.' },
];
const RISKS = [
  { key: 'arch', text: 'Arching the lower back under the cable moves stress onto the lumbar spine.', claim: CL.c9 },
  { key: 'jerk', text: 'Jerking a load that is too heavy swings the torso.', claim: CL.c7 },
];

export default {
  schema: 1,
  id: 'lib_straight_arm_pulldown',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'hold',
    why: 'D-SHIP-C3: card-no-zoom, the card has no hand zoom; the grip copy carries c1.',
    orientation: 'pronated',   // c1: overhand
    handle: 'bar-28',          // the spec's latBar (golden B's 28 mm pulldown bar, engine/equipment.mjs)
    loadAxis: 'across',        // golden B's hold default (dumbbell_lateral_raise: no push lever check)
    width: { text: 'About shoulder width or a little wider.', claim: CL.c1 },
    thumb: { mode: 'wrapped', claim: CL.hold },   // CONVENTION: hold default; the card gives no exercise-specific thumb
    contact: 'mid-palm',       // CONVENTION: hold default (source hold-default); the card gives no exercise-specific contact
    // card grip.wrist: hold archetype default, no exercise-specific source; no range is sourced
    wrist: { exempt: 'Card grip.wrist: hold archetype default only; no source gives a wrist range for this exercise.', claim: CL.hold },
    faults: [],
    gripLine: 'Overhand on a straight bar, hands about shoulder width or a little wider.',   // c1
    cue: 'Overhand, arms nearly straight.',   // c1, c4
  },
  contacts: ['standing-feet'],
  setup: [
    { kind: 'adjust', text: 'Set the pulley at its highest point and attach a straight bar.', claim: CL.c1 },
    { kind: 'grip', text: 'Take the bar overhand, hands about shoulder width or wider.', claim: CL.c1 },
    { kind: 'position', text: 'Step back until the cable is taut. Feet hip width, knees soft.', claim: CL.c2 },
    { kind: 'brace', text: 'Chest up, trunk braced, at most a slight lean forward.', zoom: 'trunk', claim: CL.c3 },
    { kind: 'load', text: 'Pick a weight you can move smoothly, with a one-second squeeze.', claim: CL.c7 },
  ],
  posture: [
    { key: 'elbows', label: 'Fixed elbow bend', detail: 'Elbows keep a slight bend that does not change during the rep.',
      anchor: { landmark: 'elbow.r', pose: 'end' }, zoom: 'elbow', claim: CL.c4 },
    { key: 'arc', label: 'Bar to thighs', detail: 'The bar sweeps down in an arc to the front of the thighs.',
      anchor: { landmark: 'grip.r', pose: 'end' }, claim: CL.c5 },
    { key: 'trunk', label: 'Trunk still', detail: 'Trunk braced and still. No swing, no lower-back arch.',
      anchor: { landmark: 'lumbar', pose: 'end' }, zoom: 'trunk', claim: C(['CONSENSUS'], [ATH], 'c9, c7') },
    { key: 'chest', label: 'Chest tall', detail: 'Chest tall at the bottom.',
      anchor: { landmark: 'chest', pose: 'end' }, claim: CL.c5 },
    { key: 'return', label: 'Slow return', detail: 'Slow way back up, letting the arms rise under control.',
      anchor: { landmark: 'grip.r', pose: 'start' }, claim: CL.c8 },
  ],
  feel,
  zooms,
  chips: ['elbow', 'trunk', 'feel'],
  copy: {
    setupLine: 'Stand a step back from a high pulley, cable taut. Brace your trunk.',
    mistakeLine: "Don't bend your elbows to push the bar down. Keep the same slight bend.",
    cueLine: 'Arms long, bar to thighs.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['back'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/straight_arm_pulldown.json', rev: 1 },
};
