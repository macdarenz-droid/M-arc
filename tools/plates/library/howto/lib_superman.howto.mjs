// LIB-SHIP W7: the How-to content of lib_superman (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/superman.json; its claim ids are named on each field's claim.
// Handling: none (card grip: every field empty, no grip claims; hand archetype none, arms overhead, palms facing, c1;
// no hand zoom). The arms (c1) are setup step 2.
// No variant line (equipment 'Bodyweight').
// Red flags: the card's redFlags (back): LIB-5's back box (shared/back-box.mjs), linked by the sharp-pain row.
//
// D-TEXT-GOLDEN (claim -> slot):
//   posture c5 head and neck neutral, eyes down  -> posture 'neck', zoom neck Right
//   posture c4 arms and legs straight            -> posture 'limbs'
//   posture c9 shoulders down and back           -> posture 'shoulders'
//   posture c10 squeeze the glutes               -> posture 'glutes'
//   posture c3, c7 lift 3-6 inches               -> posture 'height', zoom lift-height Right
//   posture c13 breathe steadily                 -> posture 'breathe'
//   handlingMistakes (Q-W2-12): head too high (c6, c5) -> posture 'neck' (zoom neck Wrong); jerky movements (c18) ->
//   posture 'control'; lifting too high (c8, c3, c7) -> posture 'height' (zoom lift-height Wrong)
import plateSpec from '../specs/superman.mjs';
import { RED_FLAG } from '../../layers/howto/shared.mjs';
export { RED_FLAG };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'ace-superman': { cite: 'Superman Exercise (ACE Exercise Library)', url: 'https://www.acefitness.org/resources/everyone/exercise-library/9/supermans/',
    kind: 'guideline', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'ucal-superman': { cite: 'Superman holds (SHRED injuries, University of Calgary)', url: 'https://ucalgary.ca/shred-injuries/all-sports/field-hockey/superman-holds',
    kind: 'guideline', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'lifto-superman': { cite: 'Bodyweight Superman - How To, Muscles Worked & Form Guide (Liftosaur)', url: 'https://liftosaur.com/exercises/bodyweight-superman',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'mo-superman': { cite: 'Superman Hold - Exercise Guide (Motra)', url: 'https://www.motra.com/exercises/supermanHold',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'bb-superman': { cite: 'Six Superb Benefits of the Superman (BarBend)', url: 'https://barbend.com/benefits-of-superman/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'ekstrom-2008': { cite: 'Surface electromyographic analysis of the low back muscles during rehabilitation exercises.', url: 'https://pubmed.ncbi.nlm.nih.gov/19195137/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-22', use: 'DATA' },
  // The back box's own source (shared/back-box.mjs boxClaim), as lib_rope_triceps_pushdown lists it: the card's redFlags 'back'.
  'nhs-back': { cite: 'NHS, Back pain', url: 'https://www.nhs.uk/conditions/back-pain/',
    kind: 'guideline', access: 'full', checked: '2026-10-02', use: 'CONSENSUS', note: 'When back pain needs a check.' },
};
// Not cited: c12 (the gentle lowering; c11 carries it), c19 (tempo, plate only).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const ACE = 'ace-superman', UC = 'ucal-superman', LI = 'lifto-superman', MO = 'mo-superman', BB = 'bb-superman';
const CL = {
  c1: C(['CONSENSUS'], [ACE, LI], 'card c1'),
  c2: C(['CONSENSUS'], [ACE, BB], 'card c2'),
  c4: C(['CONSENSUS'], [ACE, MO], 'card c4'),
  c6: C(['CONSENSUS'], [LI, MO, UC], 'card c6'),
  c8: C(['CONSENSUS'], [MO], 'card c8'),
  c9: C(['CONSENSUS'], [UC], 'card c9'),
  c10: C(['CONSENSUS'], [UC], 'card c10'),
  c11: C(['CONSENSUS'], [BB, UC, ACE], 'card c11'),
  c13: C(['CONSENSUS'], [MO], 'card c13'),
  c17: C(['CONSENSUS'], [MO], 'card c17'),
  c18: C(['CONSENSUS'], [LI, MO], 'card c18'),
  neck: C(['CONSENSUS'], [UC, ACE, MO, LI], 'card c5, c6'),
  height: C(['CONSENSUS'], [MO, LI], 'card c3, c7, c8'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses:
//   lookup (card zoom neck Wrong, c6): the spec's Mistake (the head lifted to look up, neck extension M_NECK; nothing
//          else moves).
//   high   (card zoom lift-height Wrong, c7, c8 "lifted too high, back hyperextended"): the end pose with the lumbar
//          extended to HIGH_TRUNK (one joint; the spec's end is END_ARCH -12, the slight arch of c3); the pelvis stays on
//          the mat, so the chest, arms and head rise higher with the arch.
// DRAWING VALUES (D-SHIP-DRAWVAL, #376 6614695581; precedent D-LIB7-2 and golden B's machine_chest_press seatDrop):
// HIGH_TRUNK -30 deg (lumbar extension) sizes the lift-height Wrong; no card gives it, no number from it appears in user
// copy; the layers panel judges it.
const MIS = plateSpec.mistake.pose, END = plateSpec.poses.end;
const HIGH = { trunk: -30 };
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  lookup: { pose: MIS },
  high: { pose: { ...END, ...HIGH } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// Zoom shell form (render/closeup/crop.mjs). neck (M): the plate's own Mistake dashed red over the right pose, with the
// plate's Mistake guide (the arrow from the right head to the lifted one). lift-height (DV): the `high` still dashed
// red over the right pose. The crop windows (centre offset, sizePx) are drawing values.
const zooms = [
  {
    key: 'neck', chip: 'Neck', heading: 'Neck line', kind: 'posture',
    crop: { center: { at: 'neck', pose: 'right', off: [0, 0] }, sizePx: 150 },
    right: 'end',
    wrong: { base: 'end', pose: MIS },
    guides: plateSpec.mistake.guides,
    callout: {
      right: { text: 'Eyes down', anchor: 'head' },
      wrong: { text: 'Head lifted', anchor: { at: 'head', pose: 'mistake' } },
    },
    caption: {
      right: 'Neck in line, eyes on the floor.',
      wrong: 'Head lifted to look up.',
    },
    alt: {
      right: 'Side view, lying face down with arms and legs raised. The head and neck stay in line, eyes on the floor.',
      wrong: 'Side view. The head lifts to look up, the neck out of line. Drawn dashed over the right position.',
    },
    feelRow: 'neck',
  },
  {
    key: 'lift-height', chip: 'Lift height', heading: 'Lift height', kind: 'posture',
    crop: { center: { at: 'lumbar', pose: 'right', off: [0, -10] }, sizePx: 260 },
    right: 'end',
    wrong: { base: 'end', pose: HIGH },
    callout: {
      right: { text: 'Low lift', anchor: 'backMid' },
      wrong: { text: 'Too high', anchor: { at: 'chest', pose: 'mistake' } },
    },
    caption: {
      right: 'Arms and legs a few inches up, slight arch.',
      wrong: 'Lifted too high, back hyperextended.',
    },
    alt: {
      right: 'Side view, lying face down. Arms and legs are a few inches off the floor, the back slightly arched.',
      wrong: 'Side view. The chest and arms lift too high and the back hyperextends. Drawn dashed over the right position.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [
    { muscleId: 'lower_back', plain: 'The muscles along your spine do the work.' },
    { muscleId: 'glutes', plain: 'The glutes lift your legs.' },
  ],
  secondary: [{ muscleId: 'mid_back', plain: 'The mid back helps.' }],
  watch: [],
  feelLine: 'You should feel this in your low back and glutes.',
  rows: [
    // The card's first two rows (low back, glutes) have no fix, so they are left out: the feel line says them.
    { key: 'neck', where: 'Neck', at: { parts: ['neck-left', 'neck-right'] },
      means: 'Lifting your head too high strains your neck.',
      fix: 'Keep your eyes down and your neck neutral.',
      zoom: 'neck', claim: CL.neck },
    { key: 'pain', where: 'Sharp pain', at: { muscles: ['lower_back'] },
      means: '',                            // the card's row has no means; D-FEEL-NOMEANS prints no label
      fix: 'Stop the set.',
      redFlag: 'back', claim: CL.c17 },
  ],
  libraryDiff: { add: ['mid_back'], why: 'BarBend says the superman also focuses on the mid back (card c15); the glutes move up to primary (c15, c14).' },
  claim: C(['CONSENSUS', 'DATA'], [BB, MO, 'ekstrom-2008'], 'card c14, c15, c16'),
};

/* ---------------------------------------------------------------- risks (card risks; handlingMistakes are posture, Q-W2-12) */
const RISKS = [
  { key: 'neck', text: 'Lifting your head too high can strain your neck.', claim: CL.c6 },
  { key: 'high', text: 'Lifting too high can cause strain.', claim: CL.c8 },
];

export default {
  schema: 1,
  id: 'lib_superman',
  rev: 1,
  plate: plateSpec,
  handling: { archetype: 'none' },
  contacts: ['floor-body'],
  setup: [
    { kind: 'position', text: 'Lie face down on a mat, legs straight, toes pointing away.', claim: CL.c1 },
    { kind: 'position', text: 'Arms straight overhead, palms facing each other.', claim: CL.c1 },
    { kind: 'position', text: 'Relax your head in line with your spine.', zoom: 'neck', claim: CL.c1 },
    { kind: 'brace', text: 'Tighten your abs to steady your spine.', claim: CL.c2 },
    { kind: 'position', text: 'Slowly raise both arms and both legs a few inches together.', zoom: 'lift-height', claim: CL.c2 },
  ],
  posture: [
    // Q-W2-12: handlingMistake 'Lifting your head too high to look up' (c6, c5) merged here, its fix added
    { key: 'neck', label: 'Neck in line', detail: "Head and neck neutral, eyes down. Don't lift your head to look up.",
      anchor: { landmark: 'neck', pose: 'end' }, zoom: 'neck', claim: CL.neck },
    { key: 'limbs', label: 'Limbs straight', detail: 'Arms and legs straight, no rotation.',
      anchor: { landmark: 'elbow.r', pose: 'end' }, claim: CL.c4 },
    { key: 'shoulders', label: 'Shoulders down', detail: 'Shoulders down and back, away from your ears.',
      anchor: { landmark: 'shoulder.r', pose: 'end' }, claim: CL.c9 },
    { key: 'glutes', label: 'Glute squeeze', detail: 'Squeeze your glutes to lift your legs.',
      anchor: { landmark: 'buttock', pose: 'end' }, claim: CL.c10 },
    // Q-W2-12: handlingMistake 'Lifting too high' (c8, c3, c7) merged here, its fix added
    { key: 'height', label: 'Low lift', detail: "Lift 3-6 inches, no higher. Don't hyperextend your back.",
      anchor: { landmark: 'lumbar', pose: 'end' }, zoom: 'lift-height', claim: CL.height },
    { key: 'breathe', label: 'Steady breath', detail: 'Breathe steadily through the hold.',
      anchor: { landmark: 'chest', pose: 'end' }, claim: CL.c13 },
    // Q-W2-12: handlingMistake 'Jerky, uncontrolled movements' (c18), its fix
    { key: 'control', label: 'Jerky moves', detail: 'Keep your movements controlled.',
      anchor: { landmark: 'wrist.r', pose: 'end' }, claim: CL.c18 },
    { key: 'lower', label: 'Slow lower', detail: 'Hold about three seconds, then lower slowly.',
      anchor: { landmark: 'ankle.r', pose: 'end' }, claim: CL.c11 },
  ],
  feel,
  zooms,
  chips: ['neck', 'lift-height', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'Lie face down, arms overhead. Raise arms and legs a few inches.',
    mistakeLine: "Don't lift your head to look up. Eyes down, neck neutral.",
    cueLine: 'Eyes down, low lift.',
  },
  redFlag: RED_FLAG,
  mistakes: [],   // Q-W2-12 (#379 6628699724): the card's handlingMistakes are posture checkpoints above
  risks: RISKS,
  riskFlags: ['back'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/superman.json', rev: 1 },
};
