// LIB-SHIP W6: the How-to content of lib_low_to_high_cable_fly (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs; lib_cable_fly.howto.mjs is the template). Every shown
// string restates a claim of the verified card docs/research/howto/cards/low_to_high_cable_fly.json; its claim ids are
// named on each field's claim.
// No hand zoom (D-SHIP-C3, gap-key): the card's hand zoom `fly-handle` (c4, c6) belongs to the `d-handle` key, which lists
// low_to_high_cable_fly in GAPS (tools/plates/library/hands/hand-d-handle.mjs:25: c4, c6 name no bend direction and the
// radial view shows only flexion and extension); the id is on tools/plates/library/hands/no-zoom.json. Its hand claims
// (single handles, palms facing each other at the front, neutral wrists all rep; c10, c4, c6) live in handling (gripLine)
// and the plate callout `elbows`.
// GRIP (c) (D-SHIP-GRIP, cable_fly form): the card's grip.thumb and grip.handContact read "Not given by any source read
// (hold archetype default)". The thumb and contact are golden B's `hold` archetype default, DERIVED at import from the
// copied dumbbell_lateral_raise handling values (below), cited CONVENTION (source hold-default), never shown
// (D-SHIP-CONVCOPY). The card's grip.wrist ("Neutral, in line with the forearm", c4, c6) gives no range, so the wrist
// is `exempt`.
// Front-view plate (card plate.view): the posture crop is cut in the plate's own view (no `view` override).
// No variant line (equipment 'Cable').
import plateSpec from '../specs/low_to_high_cable_fly.mjs';
import { RED_FLAG, RED_FLAG_SHOULDER } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_SHOULDER };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'ace-incline-cable-fly': { cite: 'Incline Cable Flyes (ACE Exercise Library)', url: 'https://www.acefitness.org/resources/everyone/exercise-library/163/standing-incline-cable-flyes/',
    kind: 'guideline', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'puregym-cable-fly': { cite: 'How To Do Cable Flyes (PureGym)', url: 'https://www.puregym.com/exercises/chest/chest-fly/cable-flyes/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'sl-cable-fly': { cite: 'How to Do Standing Cable Chest Fly: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/standing-cable-chest-fly/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  acsm2009: { cite: 'American College of Sports Medicine position stand. Progression models in resistance training for healthy adults', url: 'https://pubmed.ncbi.nlm.nih.gov/19204579/',
    kind: 'guideline', access: 'abstract', checked: '2026-10-22', use: 'CONSENSUS' },
  kolber2010: { cite: 'Shoulder injuries attributed to resistance training: a brief review', url: 'https://pubmed.ncbi.nlm.nih.gov/20508476/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-22', use: 'DATA' },
  schutz2022: { cite: 'Chest Exercises: Movement and Loading of Shoulder, Elbow and Wrist Joints', url: 'https://pubmed.ncbi.nlm.nih.gov/35202059/',
    kind: 'peer-reviewed', access: 'full', checked: '2026-10-22', use: 'DATA' },
  // golden B's `hold` archetype default for the hand values the card leaves unsourced (thumb, contact): a convention.
  'hold-default': { cite: 'Golden B hold archetype default (dumbbell_lateral_raise handling: thumb wrapped, contact mid-palm)', url: 'tools/plates/layers/exercises/dumbbell_lateral_raise.howto.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-05', use: 'CONVENTION' },
  // RED_FLAG_SHOULDER's own source (layers/howto/shared.mjs): the card's redFlags 'shoulder'.
  'nhs-shoulder-pain': { cite: 'NHS, Shoulder pain', url: 'https://www.nhs.uk/conditions/shoulder-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When shoulder pain needs a check.' },
};
// Not cited: c12 and c15 (tempo, plate drawing data), c13 (kolber2010; the risks use c7 and c14), c9 (the chest and
// front shoulder as secondary are named in feel.secondary, cited c9 there).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const ACE = 'ace-incline-cable-fly', PG = 'puregym-cable-fly', SL = 'sl-cable-fly';
const CL = {
  c1: C(['CONSENSUS'], [ACE, PG], 'c1'),
  c2: C(['CONSENSUS'], [ACE], 'c2'),
  c3: C(['CONSENSUS'], [ACE, PG], 'c3'),
  c4: C(['CONSENSUS'], [ACE], 'c4'),
  c5: C(['CONSENSUS'], [ACE, PG], 'c5'),
  c6: C(['CONSENSUS'], [ACE], 'c6'),
  c7: C(['CONSENSUS'], [ACE], 'c7'),
  c8: C(['CONSENSUS'], [PG, SL], 'c8'),
  c10: C(['CONSENSUS'], [PG], 'c10'),
  c14: C(['DATA', 'WEAK'], ['schutz2022'], 'c14'),
  c16: C(['CONSENSUS'], [PG], 'c16'),
  press: C(['CONSENSUS', 'WEAK'], [SL, ACE], 'c11, c6'),
  trunk: C(['CONSENSUS'], [ACE], 'c6, c7'),
  stance: C(['CONSENSUS'], [ACE, PG], 'c3, c7'),
  grip: C(['CONSENSUS'], [PG, ACE], 'c10, c4, c6'),
};

/* ------------------------------------------------------------------------------------------------ hand ---------- */
// GRIP (c): the thumb and contact DERIVED at import from golden B's hold default rows, copied here
// (tools/plates/layers/exercises/dumbbell_lateral_raise.howto.mjs:122 thumb.mode 'wrapped', :123 contact 'mid-palm'),
// pinned against the live file by the supervisor's test (Q-W2-2 form). A copied value that is not a known enum value
// throws, so a drift cannot ship silently.
const HOLD_DEFAULT = { thumb: 'wrapped', contact: 'mid-palm' };   // dumbbell_lateral_raise.howto.mjs:122-123
const THUMB = ['wrapped', 'thumbless', 'hook'].includes(HOLD_DEFAULT.thumb) ? HOLD_DEFAULT.thumb : undefined;
const CONTACT = ['heel', 'mid-palm', 'finger-base', 'palm-flat'].includes(HOLD_DEFAULT.contact) ? HOLD_DEFAULT.contact : undefined;
if (!THUMB || !CONTACT) throw new Error(`lib_low_to_high_cable_fly: hold default does not map: ${JSON.stringify(HOLD_DEFAULT)}`);
const CONV = C(['CONVENTION'], ['hold-default'], 'card grip.thumb and grip.handContact: "Not given by any source read (hold archetype default)"; golden B\'s hold default, not a card claim, never shown');

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: the start (arms open low and out, c4), the end (hands meet at about face level, c5,
// c6) and the spec's Mistake merged over the end, as the engine draws it (card plate.mistake c11: the press).
// 'lean' (card zoom low-high-trunk Wrong, c7: "Leaning forward over the front foot"): the plan proposed M, but the
// plate's Mistake is the press (c11; the lean is the card's topFault, drawable false in this front view), so the lean is
// built here: the end pose with the pelvis pitched LEAN forward (root tilt). W6 panel L5 (#393): the hands are no longer
// held at the end grips (that bent the elbows, which c3's fixed soft bend forbids); each reach target and its pole turn
// with the trunk about the root (the engine's tilt pivot), so the arms keep the end pose's shape and the lean is the only
// change. A level line at the Right's shoulders runs through both halves, so the dropped head and shoulders of
// the lean read against it in this front view.
// DRAWING VALUES (D-SHIP-DRAWVAL, #376 6614695581; precedent lib_reverse_lunge's LEAN 30): LEAN 30 deg sizes the lean; no
// card gives it, no number appears in user copy; the layers panel judges it. Risk: the card's viewWhy says the lean
// would need a side view, so in this front view it shows only as a lower head and shoulders (see the W6 report).
const LEAN = 30;
const END = plateSpec.poses.end, MIS = plateSpec.mistake.pose;
const ROT = (() => { const a = LEAN * Math.PI / 180, c = Math.cos(a), s = Math.sin(a), o = END.root.at;
  const turn = (v, p = [0, 0, 0]) => [v[0], p[1] + (v[1] - p[1]) * c - (v[2] - p[2]) * s, p[2] + (v[1] - p[1]) * s + (v[2] - p[2]) * c];
  return r => ({ ...r, at: turn(r.at, o), ...(r.pole ? { pole: turn(r.pole) } : {}) }); })();   // rotX(LEAN) about the root
const LEANED = { root: { ...END.root, tilt: LEAN }, reach: { l: ROT(END.reach.l), r: ROT(END.reach.r) } };
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  press: { pose: { ...END, ...MIS } },
  lean: { pose: { ...END, ...LEANED } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom except the hand zoom `fly-handle` (D-SHIP-C3 gap-key, above). The posture zoom is in the zoom
// shell's shape (callout with an anchor at the landmark it names, no guide mark; pilot-a.closeups.mjs).
const zooms = [
  {
    key: 'low-high-trunk', chip: 'Trunk', heading: 'Trunk position', kind: 'posture',
    // zoom shell (render/closeup/crop.mjs): crop centre on the right pose's sternum for both halves; the Wrong is the
    // lean still drawn alone (solid), as `stills.lean`.
    crop: { center: { at: 'sternum', pose: 'right', off: [0, 10] }, sizePx: 200 },
    right: 'end',
    wrong: { base: 'end', pose: LEANED, solid: true },
    guides: [{ kind: 'level', at: { at: 'shoulders', pose: 'right' } }],   // the Right's shoulder line
    callout: {
      right: { text: 'Trunk upright', anchor: 'sternum' },
      wrong: { text: 'Leaning forward', anchor: { at: 'sternum', pose: 'mistake' } },
    },
    caption: {
      right: 'Trunk upright, staggered stance, abs braced.',   // c3, c2
      wrong: 'Leaning forward over the front foot.',            // c7
    },
    alt: {
      right: 'Front view, hands met at face level. The trunk stays upright over a staggered stance.',
      wrong: 'Front view. The trunk leans forward toward the hands, so the head and shoulders drop.',
    },
    feelRow: 'lean',
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'upper_chest', plain: 'The upper chest, under the collarbones, is the main mover.' }],
  secondary: [
    { muscleId: 'chest', plain: 'The rest of the chest works second.' },
    { muscleId: 'front_delts', plain: 'The front of the shoulders works second.' },
  ],
  watch: [],
  feelLine: 'You should feel this in your upper chest, under the collarbones.',
  rows: [
    // The card's first row (upper chest) has no fix, so it is left out: the feel line says it (D-SHIP-Q16).
    { key: 'lean', where: 'Front shoulders, body leaning forward', at: { muscles: ['front_delts'] },
      means: 'You are leaning forward, often because the weight is too heavy.',
      fix: 'Lower the weight and keep your trunk vertical.',
      zoom: 'low-high-trunk', claim: CL.c7 },
    // W6 panel K1/K3 (#393): the card's row title 'Shoulder' (where you feel it), not 'Shoulder pain'; redFlag 'shoulder'
    // links the shoulder stop box.
    { key: 'shoulder', where: 'Shoulder', at: { muscles: ['front_delts'] },
      means: 'You are leaning forward.',
      fix: 'Lower the weight. Keep your trunk vertical.',
      redFlag: 'shoulder', claim: CL.c7 },
  ],
  claim: C(['CONSENSUS', 'MECH'], [PG, SL], 'c8, c9'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'lean', title: 'Leaning forward, often too heavy', zoom: 'low-high-trunk', claim: CL.c7,
    fix: 'Lower the weight and keep your trunk upright.' },
  { key: 'press', title: 'Bending elbows into a press', claim: CL.press,
    fix: 'Keep the slight elbow bend the whole rep.' },
  { key: 'open', title: 'Hands going past the armpits', claim: CL.c4,
    fix: 'Stop opening at armpit level.' },
];
const RISKS = [
  { key: 'lean', text: 'Leaning forward raises stress in the shoulder joint.', claim: CL.c7 },
  { key: 'load', text: 'Cable chest work loads the shoulder more than bench pressing. Keep joints stable.', claim: CL.c14 },
  { key: 'range', text: 'A soft elbow bend and a short range keep strain off the shoulder.', claim: CL.c16 },
];

export default {
  schema: 1,
  id: 'lib_low_to_high_cable_fly',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'hold',
    why: 'D-SHIP-C3: the d-handle key lists low_to_high_cable_fly in GAPS (c4, c6 name no bend direction); the grip copy carries c4, c6 and c10.',
    orientation: 'neutral',    // c10: palms face each other at the front
    handle: 'd-handle',        // c1: single handles (the spec's D-handle)
    loadAxis: 'across',        // golden B's hold default (dumbbell_lateral_raise: no push lever check)
    overBody: false,
    width: { text: 'Open the arms no further back than armpit level.', claim: CL.c4 },
    thumb: { mode: THUMB, claim: CONV },   // CONVENTION: hold default, DERIVED above; the card gives no thumb
    contact: CONTACT,          // CONVENTION: hold default (source hold-default), DERIVED above; the card gives no contact
    // c4, c6 keep the wrists neutral and give no range or bend direction (the d-handle key's GAPS reason)
    wrist: { exempt: 'c4, c6: the wrists stay neutral, in line with the forearms; no source gives a range or a bend direction.', claim: C(['CONSENSUS'], [ACE], 'c4, c6') },
    faults: [
      // card zoom fly-handle wrong (c4, c6). Not drawn (no hand zoom), so no pose or marker is set.
      { key: 'wrist-bending', label: 'Wrist bending', pose: {}, markers: [], alt: 'Wrist bent as the hands rise.' },
    ],
    gripLine: 'Single handles, palms facing each other at the front. Keep your wrists straight, in line with your forearms.',   // c10, c4, c6
    cue: 'Same elbow bend all rep.',   // c6
  },
  contacts: ['standing-feet'],
  setup: [
    { kind: 'adjust', text: 'Set both handles low, between knee and hip height.', claim: CL.c1 },
    { kind: 'position', text: 'Take a handle in each hand. Staggered stance, trunk upright.', zoom: 'low-high-trunk', claim: CL.c3 },
    { kind: 'brace', text: "Brace your abs. Don't arch your low back.", claim: CL.c2 },
    { kind: 'load', text: 'Choose a weight you can lift without leaning forward.', zoom: 'low-high-trunk', claim: CL.c7 },
    { kind: 'load', text: 'Choose a weight that lets you keep a soft elbow bend.', claim: CL.c16 },
  ],
  posture: [
    { key: 'trunk', label: 'Trunk vertical', detail: 'Trunk vertical, no forward lean.',
      anchor: { landmark: 'sternum', pose: 'end' }, zoom: 'low-high-trunk', claim: CL.trunk },
    { key: 'abs', label: 'Abs braced', detail: 'Abs braced, low back not arched.', anchor: { landmark: 'chest', pose: 'start' }, claim: CL.c2 },
    { key: 'elbows', label: 'Soft elbows', detail: 'Slight elbow bend, neutral wrists, all rep.', anchor: { landmark: 'elbow.l', pose: 'start' }, claim: CL.c6 },
    { key: 'armpits', label: 'Armpit limit', detail: 'Arms open no further back than armpit level.', anchor: { landmark: 'grip.r', pose: 'start' }, claim: CL.c4 },
  ],
  feel,
  zooms,
  chips: ['low-high-trunk', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'Set both handles low, between knee and hip height. Staggered stance, trunk upright.',
    mistakeLine: 'Keep your trunk upright. Keep the elbow bend fixed, so the fly never becomes a press.',
    cueLine: 'Soft elbows, hands meet high.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['shoulder'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/low_to_high_cable_fly.json', rev: 1 },
};
