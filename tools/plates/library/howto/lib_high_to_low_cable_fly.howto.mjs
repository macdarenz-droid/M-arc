// LIB-SHIP W6: the How-to content of lib_high_to_low_cable_fly (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs; lib_cable_fly.howto.mjs is the template). Every shown
// string restates a claim of the verified card docs/research/howto/cards/high_to_low_cable_fly.json; its claim ids are
// named on each field's claim.
// No hand zoom (D-SHIP-C3, card-no-zoom): the card has no hand zoom (its zooms are htl-trunk and htl-back-limit); the id
// is on tools/plates/library/hands/no-zoom.json. Its hand claims (one single cable handle in each hand, held firmly;
// wrists straight, in line with the forearms; c1, c3) live in handling (gripLine).
// GRIP (c) (D-SHIP-GRIP, cable_fly form): the card's grip.thumb and grip.handContact read "Not given by any source read
// (hold archetype default)". The thumb and contact are golden B's `hold` archetype default, DERIVED at import from the
// copied dumbbell_lateral_raise handling values (below), cited CONVENTION (source hold-default), never shown
// (D-SHIP-CONVCOPY). The card's grip.wrist ("Straight, in line with the forearm", c3) gives no range, so the wrist is
// `exempt`. No palm direction is claimed by the card, so `orientation` is left out.
// Card zoom `htl-back-limit` is a text checkpoint (D-SHIP-TEXTZOOM): its Wrong ("Arms drawn back behind the torso", c4)
// is a depth position that this front-view plate cannot show (arms 20 to 30 deg behind the side line move the grip only
// 3 to 8 px sideways at plate scale, measured with landmarksOf on the spec's start pose). Its claim is shown in the
// mistake `behind` (title and fix, c8, c4).
// Front-view plate (card plate.view): the posture crop is cut in the plate's own view (no `view` override).
// No variant line (equipment 'Cable').
import plateSpec from '../specs/high_to_low_cable_fly.mjs';
import { RED_FLAG, RED_FLAG_SHOULDER } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_SHOULDER };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'ace-decfly': { cite: 'Standing Decline Cable Flyes (ACE Exercise Library)', url: 'https://www.acefitness.org/resources/everyone/exercise-library/161/standing-decline-cable-flyes/',
    kind: 'guideline', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'ace-top3-chest': { cite: 'What are the Top 3 Most Effective Chest Exercises? (Schanke, Porcari et al., ACE Certified News)', url: 'https://www.acefitness.org/certifiednewsarticle/3003/what-are-the-top-3-most-effective-chest-exercises/',
    kind: 'guideline', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'rabello-2024': { cite: 'Activation of the three deltoid muscle portions during common strengthening exercises: A systematic review', url: 'https://pubmed.ncbi.nlm.nih.gov/39593452/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-22', use: 'MECH' },
  'coratella-2020-bench': { cite: "Specific prime movers' excitation during free-weight bench press variations and chest press machine in competitive bodybuilders", url: 'https://pubmed.ncbi.nlm.nih.gov/31397215/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-22', use: 'MECH' },
  'acsm-2009': { cite: 'American College of Sports Medicine position stand. Progression models in resistance training for healthy adults', url: 'https://pubmed.ncbi.nlm.nih.gov/19204579/',
    kind: 'guideline', access: 'abstract', checked: '2026-10-22', use: 'CONSENSUS' },
  // golden B's `hold` archetype default for the hand values the card leaves unsourced (thumb, contact): a convention.
  'hold-default': { cite: 'Golden B hold archetype default (dumbbell_lateral_raise handling: thumb wrapped, contact mid-palm)', url: 'tools/plates/layers/exercises/dumbbell_lateral_raise.howto.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-05', use: 'CONVENTION' },
  // RED_FLAG_SHOULDER's own source (layers/howto/shared.mjs): the card's redFlags 'shoulder'.
  'nhs-shoulder-pain': { cite: 'NHS, Shoulder pain', url: 'https://www.nhs.uk/conditions/shoulder-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When shoulder pain needs a check.' },
};
// Not cited: c12 (tempo, plate drawing data), c13 (load progression), c14 (breathing).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const ACE = 'ace-decfly', TOP3 = 'ace-top3-chest';
const CL = {
  c1: C(['CONSENSUS'], [ACE], 'c1'),
  c2: C(['CONSENSUS'], [ACE], 'c2'),
  c3: C(['CONSENSUS'], [ACE], 'c3'),
  c4: C(['CONSENSUS'], [ACE], 'c4'),
  c5: C(['CONSENSUS'], [ACE], 'c5'),
  c6: C(['CONSENSUS', 'WEAK'], [TOP3], 'c6'),
  c7: C(['CONSENSUS'], [ACE], 'c7'),
  c8: C(['CONSENSUS', 'WEAK'], [TOP3], 'c8'),
  c9: C(['CONSENSUS', 'WEAK'], [TOP3], 'c9'),
  behind: C(['CONSENSUS', 'WEAK'], [TOP3, ACE], 'c8, c4'),
  grip: C(['CONSENSUS'], [ACE], 'c1, c3'),
};

/* ------------------------------------------------------------------------------------------------ hand ---------- */
// GRIP (c): the thumb and contact DERIVED at import from golden B's hold default rows, copied here
// (tools/plates/layers/exercises/dumbbell_lateral_raise.howto.mjs:122 thumb.mode 'wrapped', :123 contact 'mid-palm'),
// pinned against the live file by the supervisor's test (Q-W2-2 form). A copied value that is not a known enum value
// throws, so a drift cannot ship silently.
const HOLD_DEFAULT = { thumb: 'wrapped', contact: 'mid-palm' };   // dumbbell_lateral_raise.howto.mjs:122-123
const THUMB = ['wrapped', 'thumbless', 'hook'].includes(HOLD_DEFAULT.thumb) ? HOLD_DEFAULT.thumb : undefined;
const CONTACT = ['heel', 'mid-palm', 'finger-base', 'palm-flat'].includes(HOLD_DEFAULT.contact) ? HOLD_DEFAULT.contact : undefined;
if (!THUMB || !CONTACT) throw new Error(`lib_high_to_low_cable_fly: hold default does not map: ${JSON.stringify(HOLD_DEFAULT)}`);
const CONV = C(['CONVENTION'], ['hold-default'], 'card grip.thumb and grip.handContact: "Not given by any source read (hold archetype default)"; golden B\'s hold default, not a card claim, never shown');

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: the start (arms up and out, hands no further back than the armpits; c4), the end
// (hands meet below chest level; c5, c3) and the spec's Mistake merged over the end, as the engine draws it (card
// plate.mistake c8: the hands cross).
// 'lean' (card zoom htl-trunk Wrong, c7: "Trunk tipped forward toward the hands"): the plan proposed M, but the plate's
// Mistake is the crossing hands (c8; the lean is the card's topFault, drawable false in this front view), so the lean is
// built here: the end pose with the pelvis pitched LEAN forward (root tilt). W6 panel L5 (#393): the hands are no longer
// held at the end grips (that bent the elbows, which c3's fixed soft bend forbids); each reach target and its pole turn
// with the trunk about the root (the engine's tilt pivot), so the arms keep the end pose's shape and the lean is the only
// change. A level line at the Right's shoulders runs through both halves, so the dropped head and shoulders of
// the lean read against it in this front view.
// DRAWING VALUES (D-SHIP-DRAWVAL, #376 6614695581; precedent lib_reverse_lunge's LEAN 30): LEAN 30 deg sizes the lean; no
// card gives it, no number appears in user copy; the layers panel judges it. Risk: in this front view the lean shows
// only as a lower head and shoulders (see the W6 report).
const LEAN = 30;
const END = plateSpec.poses.end, MIS = plateSpec.mistake.pose;
const ROT = (() => { const a = LEAN * Math.PI / 180, c = Math.cos(a), s = Math.sin(a), o = END.root.at;
  const turn = (v, p = [0, 0, 0]) => [v[0], p[1] + (v[1] - p[1]) * c - (v[2] - p[2]) * s, p[2] + (v[1] - p[1]) * s + (v[2] - p[2]) * c];
  return r => ({ ...r, at: turn(r.at, o), ...(r.pole ? { pole: turn(r.pole) } : {}) }); })();   // rotX(LEAN) about the root
const LEANED = { root: { ...END.root, tilt: LEAN }, reach: { l: ROT(END.reach.l), r: ROT(END.reach.r) } };
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  cross: { pose: { ...END, ...MIS } },
  lean: { pose: { ...END, ...LEANED } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One posture zoom: htl-trunk. htl-back-limit is a text checkpoint (D-SHIP-TEXTZOOM, above). The posture zoom is in the
// zoom shell's shape (callout with an anchor at the landmark it names, no guide mark; pilot-a.closeups.mjs).
const zooms = [
  {
    key: 'htl-trunk', chip: 'Trunk', heading: 'Trunk position', kind: 'posture',
    // zoom shell (render/closeup/crop.mjs): crop centre on the right pose's sternum for both halves; the Wrong is the
    // lean still drawn alone (solid), as `stills.lean`.
    crop: { center: { at: 'sternum', pose: 'right', off: [0, 10] }, sizePx: 200 },
    right: 'end',
    wrong: { base: 'end', pose: LEANED, solid: true },
    guides: [{ kind: 'level', at: { at: 'shoulders', pose: 'right' } }],   // the Right's shoulder line
    callout: {
      right: { text: 'Trunk upright', anchor: 'sternum' },
      wrong: { text: 'Tipped forward', anchor: { at: 'sternum', pose: 'mistake' } },
    },
    caption: {
      right: 'Trunk vertical as the hands meet below the chest.',   // c7, c5
      wrong: 'Trunk tipped forward toward the hands.',              // c7
    },
    alt: {
      right: 'Front view, hands met below chest level. The trunk stays upright over a staggered stance.',
      wrong: 'Front view. The trunk tips forward toward the hands, so the head and shoulders drop.',
    },
    feelRow: 'shoulder',
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'chest', plain: 'The chest does the work.' }],
  secondary: [{ muscleId: 'front_delts', plain: 'The front of the shoulders helps.' }],
  watch: [],
  feelLine: 'You should feel this in your chest.',
  rows: [
    // The card's first row (chest) has no fix, so it is left out: the feel line says it (D-SHIP-Q16).
    // W6 panel K1/K3 (#393): the card's row title 'Shoulder' (where you feel it), not 'Shoulder pain'; redFlag 'shoulder'
    // links the shoulder stop box.
    { key: 'shoulder', where: 'Shoulder', at: { muscles: ['front_delts'] },
      means: 'Leaning forward raises stress in the shoulder joint.',
      fix: 'Lower the weight and stand tall.',
      zoom: 'htl-trunk', redFlag: 'shoulder', claim: CL.c7 },
    { key: 'low-back', where: 'Low back', at: { muscles: ['lower_back'] },
      means: 'You are arching your low back.',
      fix: 'Brace your abs.',   // c2
      claim: CL.c2 },
  ],
  claim: C(['DATA', 'MECH', 'WEAK'], [TOP3, ACE, 'rabello-2024', 'coratella-2020-bench'], 'c10, c11'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'lean', title: 'Leaning forward', zoom: 'htl-trunk', claim: CL.c7,
    fix: 'Lower the weight and stand tall.' },
  { key: 'behind', title: 'Arms behind or handles crossing', claim: CL.behind,
    fix: 'Stop at the armpits going back. Let the hands just meet.' },
  { key: 'torso', title: 'Torso moving toward the hands', claim: CL.c9,
    fix: 'Keep the trunk still and let the arms move.' },
];
const RISKS = [
  { key: 'lean', text: 'Leaning forward raises the stress in the shoulder joint.', claim: CL.c7 },
  { key: 'behind', text: 'Arms behind the body or crossing handles risks the shoulder and the hands.', claim: CL.c8 },
];

export default {
  schema: 1,
  id: 'lib_high_to_low_cable_fly',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'hold',
    why: 'D-SHIP-C3: card-no-zoom, the card has no hand zoom; the grip copy carries c1 and c3.',
    handle: 'd-handle',        // c1: one single cable handle in each hand (the spec's D-handle)
    loadAxis: 'across',        // golden B's hold default (dumbbell_lateral_raise: no push lever check)
    overBody: false,
    width: { text: 'On the way back, hands stop level with the armpits.', claim: CL.c4 },
    thumb: { mode: THUMB, claim: CONV },   // CONVENTION: hold default, DERIVED above; the card gives no thumb
    contact: CONTACT,          // CONVENTION: hold default (source hold-default), DERIVED above; the card gives no contact
    // c3 keeps the wrists straight and gives no range
    wrist: { exempt: 'c3: the wrists stay straight, in line with the forearms; no source gives a range.', claim: CL.c3 },
    faults: [],
    gripLine: 'One single handle in each hand, held firmly. Keep your wrists straight, in line with your forearms.',   // c1, c3
    cue: 'Soft elbows, hands meet low.',   // c3, c5 (below chest level)
  },
  contacts: ['standing-feet'],
  setup: [
    { kind: 'adjust', text: 'Set both handles at about the top of your head.', claim: CL.c1 },
    { kind: 'position', text: 'A handle in each hand. Staggered stance, trunk upright.', zoom: 'htl-trunk', claim: CL.c1 },
    { kind: 'brace', text: 'Brace your abs and keep your low back from arching.', claim: CL.c2 },
    { kind: 'load', text: 'Pick a weight you can move without leaning forward.', zoom: 'htl-trunk', claim: CL.c7 },
    // D-TEXT-GOLDEN: card posture c6 has no other visible slot, so it is shown as the last step.
    { kind: 'position', text: 'Sweep the arms down first, then in, in a wide arc.', claim: CL.c6 },
  ],
  posture: [
    { key: 'trunk', label: 'Trunk vertical', detail: 'Trunk stays vertical, no leaning toward the hands.',
      anchor: { landmark: 'sternum', pose: 'end' }, zoom: 'htl-trunk', claim: CL.c7 },
    { key: 'low-back', label: 'Low back', detail: "Low back doesn't arch.", anchor: { landmark: 'chest', pose: 'start' }, claim: CL.c2 },
    { key: 'elbows', label: 'Soft elbows', detail: 'Elbows keep the same slight bend.', anchor: { landmark: 'elbow.l', pose: 'start' }, claim: CL.c3 },
    { key: 'wrists', label: 'Straight wrists', detail: 'Wrists straight, in line with the forearms.', anchor: { landmark: 'wrist.r', pose: 'end' }, claim: CL.c3 },
    // D-SHIP-TEXTZOOM: the card zoom htl-back-limit as a text checkpoint (Right, then Wrong in the detail).
    { key: 'back-limit', label: 'Armpit limit', detail: 'On the way back, hands stop level with the armpits. Never draw the arms behind the torso.',
      anchor: { landmark: 'grip.r', pose: 'start' }, claim: CL.c4 },
    { key: 'arc', label: 'Wide arc', detail: 'Sweep down first, then in, in a wide arc.', anchor: { landmark: 'grips', pose: 'end' }, claim: CL.c6 },
  ],
  feel,
  zooms,
  chips: ['htl-trunk', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'Set both handles at about the top of your head. Staggered stance, trunk upright.',
    mistakeLine: 'Keep your trunk upright. Stop at the armpits going back.',
    cueLine: 'Soft elbows, hands meet low.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['shoulder'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/high_to_low_cable_fly.json', rev: 1 },
};
