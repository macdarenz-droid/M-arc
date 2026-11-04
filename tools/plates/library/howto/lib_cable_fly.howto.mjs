// LIB-SHIP W2: the How-to content of lib_cable_fly (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/cable_fly.json; its claim ids are named on each field's claim.
// No hand zoom (D-SHIP-C3, gap-key): the card's hand zoom `fly-handle` (c4) belongs to the `d-handle` key, which lists
// cable_fly in GAPS (tools/plates/library/hands/hand-d-handle.mjs:24: c4 names no bend direction and the radial view
// shows only flexion and extension); the id is on tools/plates/library/hands/no-zoom.json. Its hand claims (palms facing
// each other, the wrist held at one angle all rep; c8, c4) live in handling and the posture checkpoint `palms`.
// Card gap: grip.thumb and grip.handContact read "Not given by any cable fly source read (hold archetype default)". The
// thumb and contact below are golden B's `hold` archetype default (layers/exercises/dumbbell_lateral_raise.howto.mjs
// handling: thumb wrapped, contact mid-palm, loadAxis across), cited CONVENTION (source hold-default), never shown.
// The card's grip.wrist ("held at the same angle all rep", c4) gives no range, so the wrist is `exempt`.
// Front-view plate (card plate.view): the posture crop is cut in the plate's own view (no `view` override).
// No variant line (equipment 'Cable').
import plateSpec from '../specs/cable_fly.mjs';
import { RED_FLAG, RED_FLAG_SHOULDER } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_SHOULDER };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'ace-standing-fly': { cite: 'Standing Chest Fly (ACE Exercise Library)', url: 'https://www.acefitness.org/resources/everyone/exercise-library/160/standing-chest-fly/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'puregym-cable-fly': { cite: 'How To Do Cable Flyes (PureGym)', url: 'https://www.puregym.com/exercises/chest/chest-fly/cable-flyes/',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'sl-cable-fly': { cite: 'How to Do Standing Cable Chest Fly: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/standing-cable-chest-fly/',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  schutz2022: { cite: 'Chest Exercises: Movement and Loading of Shoulder, Elbow and Wrist Joints', url: 'https://pubmed.ncbi.nlm.nih.gov/35202059/',
    kind: 'peer-reviewed', access: 'full', checked: '2026-09-30', use: 'DATA' },
  acsm2009: { cite: 'American College of Sports Medicine position stand. Progression models in resistance training for healthy adults', url: 'https://pubmed.ncbi.nlm.nih.gov/19204579/',
    kind: 'guideline', access: 'abstract', checked: '2026-10-17', use: 'CONSENSUS' },
  kolber2010: { cite: 'Shoulder injuries attributed to resistance training: a brief review', url: 'https://pubmed.ncbi.nlm.nih.gov/20508476/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  // golden B's `hold` archetype default for the hand values the card leaves unsourced (thumb, contact): a convention.
  'hold-default': { cite: 'Golden B hold archetype default (dumbbell_lateral_raise handling: thumb wrapped, contact mid-palm)', url: 'tools/plates/layers/exercises/dumbbell_lateral_raise.howto.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-04', use: 'CONVENTION' },
};

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const ACE = 'ace-standing-fly', PG = 'puregym-cable-fly', SL = 'sl-cable-fly';
const CL = {
  c1: C(['CONSENSUS'], [ACE, PG], 'c1'),
  c2: C(['CONSENSUS'], [SL], 'c2'),
  c3: C(['CONSENSUS'], [SL, PG], 'c3'),
  c4: C(['CONSENSUS'], [SL], 'c4'),
  c7: C(['CONSENSUS'], [PG], 'c7'),
  c8: C(['CONSENSUS'], [PG], 'c8'),
  c9: C(['CONSENSUS'], [SL, PG], 'c9'),
  c11: C(['DATA'], ['schutz2022'], 'c11'),
  c13: C(['DATA'], ['kolber2010'], 'c13'),
  c14: C(['CONSENSUS'], ['acsm2009'], 'c14'),
  press: C(['CONSENSUS'], [SL], 'c6, c4'),
  swing: C(['CONSENSUS'], [SL, PG], 'c6, c7'),
  still: C(['CONSENSUS'], [SL, PG], 'c3, c6'),
  meet: C(['CONSENSUS'], [ACE, PG], 'c5, c7'),
  hold: C(['CONVENTION'], ['hold-default'], 'card grip.thumb and grip.handContact: no cable fly source gives them (hold archetype default); golden B\'s hold default, not a card claim, never shown'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: the end (hands together in front of the chest, the soft fixed elbow; c4, c5, c8) and
// the spec's Mistake pose merged over it, as the engine draws it (card plate.mistake c6: the elbows bend to MIS_ELBOW
// and the hands come in close to the chest, a press). The card zoom fly-elbows Wrong is the plate's drawn fault.
const MIS = plateSpec.mistake.pose;
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: plateSpec.poses.end },
  press: { pose: { ...plateSpec.poses.end, ...MIS } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom except the hand zoom `fly-handle` (D-SHIP-C3 gap-key, above). The posture zoom is in the zoom
// shell's shape (callout with an anchor at the landmark it names, no guide mark; pilot-a.closeups.mjs).
const zooms = [
  {
    key: 'fly-elbows', chip: 'Elbows', heading: 'Elbow bend', kind: 'posture',
    // zoom shell (render/closeup/crop.mjs): crop centre on the right pose's left elbow for both halves; the Wrong is the
    // spec's Mistake drawn alone (solid), as `stills.press`.
    crop: { center: { at: 'elbow.l', pose: 'right', off: [-10, 0] }, sizePx: 150 },
    right: 'end',
    wrong: { base: 'end', pose: MIS, solid: true },
    callout: {
      right: { text: 'Fixed bend', anchor: 'elbow.l' },
      wrong: { text: 'Bent deeply', anchor: 'elbow.l' },
    },
    caption: {
      right: 'Soft, fixed elbow bend, hands meeting in front.',
      wrong: 'Elbows bending deeply, pressing the handles.',
    },
    alt: {
      right: 'Front view, hands together in front of the chest. The elbows keep the same slight bend.',
      wrong: 'Front view. The elbows bend deeply and drop under the hands. The handles are pressed in.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'chest', plain: 'The chest is the main mover.' }],
  secondary: [{ muscleId: 'front_delts', plain: 'The front of the shoulders works second.' }],
  watch: [],
  feelLine: 'You should feel this in your chest and the front of your shoulders.',
  rows: [
    // The card's first row (chest and front shoulders) has no fix, so it is left out: the feel line says it (D-SHIP-Q16).
    { key: 'shoulder', where: 'Pain at the front shoulder', at: { muscles: ['front_delts'] },
      means: 'Opening the arms past the chest line strains the shoulder.',
      fix: "Stop the set. Don't train through the pain.",
      redFlag: 'shoulder', claim: CL.c7 },
  ],
  claim: C(['CONSENSUS'], [SL, PG], 'c9, c10'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'press', title: 'Bending elbows into a press', zoom: 'fly-elbows', claim: CL.press,
    fix: 'Keep the elbow bend fixed. Move at the shoulders.' },
  { key: 'swing', title: 'Swinging with too much weight', claim: CL.swing,
    fix: 'Use a weight you can move slowly with a soft elbow bend.' },
  { key: 'open', title: 'Arms opening too far back', claim: CL.c7,
    fix: 'Stop when the hands are in line with the chest.' },
];
const RISKS = [
  { key: 'load', text: 'Cable flyes load the shoulder more than bench pressing. Keep your joints stable.', claim: CL.c11 },
  { key: 'shoulder', text: 'The shoulder is a common injury site in lifting.', claim: CL.c13 },
];

export default {
  schema: 1,
  id: 'lib_cable_fly',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'hold',
    why: 'D-SHIP-C3: the d-handle key lists cable_fly in GAPS (c4 names no bend direction); the grip copy carries c4 and c8.',
    orientation: 'neutral',    // c8: palms face each other
    handle: 'd-handle',        // c1: single handles (the spec's D-handle)
    loadAxis: 'across',        // golden B's hold default (dumbbell_lateral_raise: no push lever check)
    overBody: false,
    width: { text: 'Open the arms only until your hands are in line with your chest.', claim: CL.c7 },
    thumb: { mode: 'wrapped', claim: CL.hold },   // CONVENTION: hold default; the card gives no thumb
    contact: 'mid-palm',       // CONVENTION: hold default (source hold-default); the card gives no contact
    // c4 holds the wrist at one angle and gives no range or bend direction (the d-handle key's GAPS reason)
    wrist: { exempt: 'c4: the wrist is held at the same angle all rep; no source gives a range or a bend direction.', claim: CL.c4 },
    faults: [
      // card zoom fly-handle wrong (c4). Not drawn (no hand zoom), so no pose or marker is set.
      { key: 'wrist-bending', label: 'Wrist bending', pose: {}, markers: [], alt: 'Wrist bending as the hands come together.' },
    ],
    gripLine: 'Single handles, palms facing each other as the hands meet. Hold the wrist at the same angle all rep.',
    cue: 'Same elbow bend all rep.',   // c4
  },
  contacts: ['standing-feet'],
  setup: [
    { kind: 'adjust', text: 'Set both pulleys at or slightly above shoulder height.', claim: CL.c1 },
    { kind: 'position', text: 'Stand centred between them, pulleys slightly behind you.', claim: CL.c2 },
    { kind: 'brace', text: 'Staggered or parallel stance. Brace your trunk, legs and glutes.', claim: CL.c3 },
    { kind: 'load', text: 'Choose a weight that lets you keep a soft elbow bend.', zoom: 'fly-elbows', claim: CL.c7 },
    { kind: 'load', text: 'Beat target by one or two reps? Add 2 to 10 percent.', claim: CL.c14 },
  ],
  posture: [
    { key: 'centred', label: 'Centred', detail: 'Centred between the pulleys.', anchor: { landmark: 'hips', pose: 'start' }, claim: CL.c2 },
    { key: 'still', label: 'Body still', detail: 'Trunk braced, body still, no swinging.', anchor: { landmark: 'chest', pose: 'start' }, claim: CL.still },
    { key: 'elbows', label: 'Soft elbows', detail: 'Elbows slightly bent, same angle all rep.',
      anchor: { landmark: 'elbow.l', pose: 'start' }, zoom: 'fly-elbows', claim: CL.c4 },
    { key: 'meet', label: 'Hands meet', detail: 'Hands meet in front, then open only to the chest line.', anchor: { landmark: 'grips', pose: 'end' }, claim: CL.meet },
    { key: 'palms', label: 'Palms facing', detail: 'Palms face each other when the handles meet.', anchor: { landmark: 'grip.r', pose: 'end' }, claim: CL.c8 },
  ],
  feel,
  zooms,
  chips: ['fly-elbows', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'Set both pulleys at or slightly above shoulder height. Stand centred, pulleys slightly behind you.',
    mistakeLine: 'Keep the elbow bend fixed, so the fly never turns into a press.',
    cueLine: 'Soft elbows, hands meet in front.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['shoulder'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/cable_fly.json', rev: 1 },
};
