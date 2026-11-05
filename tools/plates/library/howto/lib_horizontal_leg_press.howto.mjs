// LIB-SHIP W3: the How-to content of lib_horizontal_leg_press (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/horizontal_leg_press.json; its claim ids are named on each field's claim. Strings the card
// inherits from its parent (card `parent` leg_press, `inherit[]`) are the parent's shipped words, compared leaf by leaf
// by the family check (tools/plates/library/lint/family.mjs INHERIT_MAP lib_horizontal_leg_press, D-LIB9a-MAP, amended
// by SHIP W3 PLAN RULED Q-W3-2, #383 6630932862); each cites this card's own claims (claim subtrees are not compared).
// - grip -> `handling`: leaf-equal to tools/plates/layers/exercises/leg_press.howto.mjs handling (inherit why: c2).
// - posture back, feet, hands: label, detail and anchor equal to the parent's; no zoom link (Q-W3-2: the parent's
//   back-on-pad, foot and hand zooms are drawn on the 45 degree sled and are not on this card).
// - posture soft: leaf-equal to the parent's (no zoom link in the parent).
// No hand zoom: the card has none, and the parent's hand zoom is not inherited.
//   Q-W3-10 (#383 6631278086): `grip` maps to every handling key except `why`; `why` names D-SHIP-C3 (card-no-zoom).
// Zooms: `knee at the top` is the plate's drawn fault (M: the knees lock). `seat set` is a text checkpoint
// (D-SHIP-TEXTZOOM): its Wrong (seat too close, thighs at the ribs, hips lifting) moves the sled and the hips together;
// the spec's sled placement (specs/horizontal_leg_press.mjs:48 feetAt) is module-private and no pose of the plate draws
// it, so it is not a one-joint drawing value; posture checkpoint `seat` and setup step 3 carry it.
// Red flags: the card's redFlags (knee, back): golden B's knee block, and LIB-5's back box
// (tools/plates/library/shared/back-box.mjs), linked by the low-back row's redFlag: 'back'.
// No variant line (equipment 'Machine').
import plateSpec from '../specs/horizontal_leg_press.mjs';
import { RED_FLAG, RED_FLAG_KNEE } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_KNEE };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'ace-seated-leg-press': { cite: 'Seated Leg Press (ACE exercise library)', url: 'https://www.acefitness.org/resources/everyone/exercise-library/154/seated-leg-press/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'webmd-seated-leg-press': { cite: 'How to Do Seated Leg Presses (WebMD, medically reviewed)', url: 'https://www.webmd.com/fitness-exercise/how-to-do-seated-leg-presses',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  barnds2019: { cite: 'Simultaneous Bilateral Knee Dislocation During Weight Training: A Case Report and Review of the Literature', url: 'https://pubmed.ncbi.nlm.nih.gov/30676343/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'WEAK' },
  tassi1998: { cite: 'Electromyographic evaluation of the rectus femoris muscle during exercises performed on the horizontal leg press', url: 'https://pubmed.ncbi.nlm.nih.gov/9651694/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  tassi1999: { cite: 'Electromyographic behaviour of the gastrocnemius muscle during knee extension and flexion on the horizontal leg press', url: 'https://pubmed.ncbi.nlm.nih.gov/10499208/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  escamilla2001: { cite: 'Effects of technique variations on knee biomechanics during the squat and leg press', url: 'https://pubmed.ncbi.nlm.nih.gov/11528346/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  macdougall1985: { cite: 'MacDougall JD et al. Arterial blood pressure response to heavy resistance exercise. J Appl Physiol 1985;58(3):785-90', url: 'https://pubmed.ncbi.nlm.nih.gov/3980383/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  // RED_FLAG_KNEE's own source (layers/howto/shared.mjs), as golden B's leg_press lists it: the card's redFlags 'knee'.
  'nhs-knee-pain': { cite: 'NHS, Knee pain', url: 'https://www.nhs.uk/symptoms/knee-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When knee pain needs a check.' },
  // The back box's own source (shared/back-box.mjs boxClaim), as lib_barbell_row lists it: the card's redFlags 'back'.
  'nhs-back': { cite: 'NHS, Back pain', url: 'https://www.nhs.uk/conditions/back-pain/',
    kind: 'guideline', access: 'full', checked: '2026-10-02', use: 'CONSENSUS', note: 'When back pain needs a check.' },
};
// Not cited: acsm2009 (c12 tempo, plate only; c14 load progression: the card's five setup steps fill the setup cap).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const ACE = 'ace-seated-leg-press', WM = 'webmd-seated-leg-press';
const CL = {
  c1: C(['CONSENSUS'], [ACE, WM], 'c1'),
  c2: C(['CONSENSUS'], [ACE], 'c2'),
  c4: C(['CONSENSUS'], [ACE, WM], 'c4'),
  c5: C(['CONSENSUS'], [ACE, WM], 'c5'),
  c6: C(['CONSENSUS'], [WM], 'c6'),
  c7: C(['CONSENSUS'], [ACE], 'c7'),
  c8: C(['DATA', 'WEAK'], ['barnds2019'], 'c8'),
  c11: C(['DATA', 'MECH'], ['macdougall1985'], 'c11'),
  breath: C(['CONSENSUS', 'DATA', 'MECH'], [ACE, 'macdougall1985'], 'c3, c11'),
  back: C(['CONSENSUS'], [ACE, WM], 'c1, c4 (inherit: posture Tailbone and lower back flat on the pad)'),
  feet: C(['CONSENSUS'], [ACE, WM], 'c1, c3 (inherit: posture Whole foot flat, mid-platform)'),
  soft: C(['CONSENSUS'], [ACE, WM], 'c3, c4 (inherit: posture Soft knees at the top)'),
  grip: C(['CONSENSUS'], [ACE], 'c2 (inherit: grip; posture Hands light on the side handles)'),
  lock: C(['CONSENSUS', 'DATA', 'WEAK'], [ACE, WM, 'barnds2019'], 'c7, c4, c8'),
  seat: C(['CONSENSUS'], [ACE, WM], 'c1, c5'),
  hips: C(['CONSENSUS'], [ACE, WM], 'c4, c2, c1'),
  knee: C(['CONSENSUS', 'DATA', 'MECH'], [ACE, WM, 'escamilla2001'], 'c4, c5, c10'),
  lowBack: C(['CONSENSUS'], [ACE, WM], 'c4, c5, c1, c2'),
};

/* ------------------------------------------------------------------------------------------------ hand ---------- */
// INHERITED (grip -> handling): the parent's handling, leaf for leaf (leg_press.howto.mjs RIGHT_POSE, PUSH_ON_KNEES,
// width, thumb, contact, wrist, gripLine, cue). The family check compares every leaf except `claim`; these claims cite
// this card's c2 (inherit why: the same light hold on any handles, no upper-body movement).
const RIGHT_POSE = {
  view: 'radial', forearm: 0, wrist: { ext: 8, dev: 0 }, contactAt: 0.9, fingers: { curl: 1 }, thumb: 'wrapped',
  squeeze: 'light', handle: { profile: 'pad-handle', axis: 'across', strut: [-0.35, 1] }, load: { kind: 'pull' },
};
const PUSH_ON_KNEES = {
  key: 'push-on-knees', label: 'Pushing on knee',
  pose: { forearm: 0, wrist: { ext: 80, dev: 0 }, contactAt: 0.45, fingers: { curl: 1 }, thumb: 'beside', squeeze: 'firm',
    handle: { profile: 'machine-grip', axis: 'across', diameterMm: 104 }, load: { kind: 'push' } },
  markers: ['lever-arc'],
  alt: 'Palm pressed on the front of the knee to push a hard rep up. The wrist folds back about 80 degrees. The push runs behind the wrist, bending it further.',
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: start = the bottom (knees about 90), end = the push finished with soft knees (c4),
// and the spec's Mistake pose merged over the end, as the engine draws it (the sled runs on and the knees lock; c7,
// c4, c8). The card zoom `knee at the top` Wrong is that drawn fault, so no new pose is made.
const MIS = plateSpec.mistake.pose;
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: plateSpec.poses.end },
  lock: { pose: { ...plateSpec.poses.end, ...MIS } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// Zoom shell form (render/closeup/crop.mjs): callouts anchored at the landmark they name, no guide mark; the Wrong is
// drawn alone (solid).
const zooms = [
  {
    key: 'knee-top', chip: 'Knees', heading: 'Knee lockout', kind: 'posture',   // card zoom key: knee at the top
    // W3 LAYERS FIX (#384 6648454032, L5): each crop draws its own leg line, hip to knee to ankle, with a thin straight
    // hip-to-ankle line under it (zoom `outlines`: accent in Right, red dashed in Wrong). The soft knee shows as a bend
    // off the straight line; the locked knee lies on it. c4 (soft knees), c7 (locking).
    outlines: lm => ({ lines: [{ pts: [lm['hip.r'], lm['knee.r'], lm['ankle.r']], kind: 'outline' },
      { pts: [lm['hip.r'], lm['ankle.r']], kind: 'ridge' }], points: {} }),
    crop: { center: { at: 'knee.r', pose: 'right', off: [0, 0] }, sizePx: 150 },
    right: 'end',
    wrong: { base: 'end', pose: MIS, solid: true },
    callout: {
      right: { text: 'Small bend', anchor: 'knee.r' },
      wrong: { text: 'Locked', anchor: 'knee.r' },
    },
    caption: {
      right: 'Legs nearly straight, a small bend, heels on the plate.',
      wrong: 'Knees snapped straight and locked.',
    },
    alt: {   // c7, c4, c8 (card zooms[key=knee at the top])
      right: 'Side view, end of the push. The legs are nearly straight with a small bend at the knee.',
      wrong: 'Side view. The sled runs further and the knees snap straight and lock.',
    },
    feelRow: 'knee',
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const KNEES = ['knee-left', 'knee-right'];
const feel = {
  primary: [
    { muscleId: 'quads', plain: 'The front of your thighs pushes the plate.' },
    { muscleId: 'glutes', plain: 'Your glutes push with them.' },
  ],
  secondary: [
    { muscleId: 'hamstrings', plain: 'The backs of your thighs help.' },
    { muscleId: 'calves', plain: 'Your calves work hard as the knees straighten.' },
  ],
  watch: [{ muscleId: 'lower_back', plain: 'Your lower back should stay still on the pad.' }],
  // D-TEXT-GOLDEN (#379 6637607604): posture 'return' (c5: controlled return) moved from the feel line to a setup step (W3 PANEL FIX 2, #384 6649416891: no movement cues under the feel heading).
  feelLine: 'You should feel this in the front of your thighs and your glutes.',
  rows: [
    { key: 'knee', where: 'Knee', at: { parts: KNEES },
      means: '',   // D-FEEL-MEANS-CAUSAL (#384 6649416891): the card names faults to watch, not a cause
      fix: "Keep a small bend at the top. Don't go below about 90 degrees.",
      zoom: 'knee-top', redFlag: 'knee', claim: CL.knee },
    { key: 'low-back', where: 'Lower back', at: { muscles: ['lower_back'] },
      means: '',   // D-FEEL-MEANS-CAUSAL
      fix: 'Keep your tailbone on the pad and your lower back still.',
      redFlag: 'back', claim: CL.lowBack },
    { key: 'knees-in', where: 'Knees drifting in', at: { parts: KNEES },
      means: '',   // D-FEEL-MEANS-CAUSAL
      fix: 'Keep your kneecaps in line with your feet.',
      redFlag: 'knee', claim: CL.c6 },
  ],
  libraryDiff: { add: ['calves'], why: 'card libraryDiff: on a horizontal leg press the calf fired strongly at the end of knee extension (c9).' },
  claim: C(['CONSENSUS', 'DATA'], [ACE, WM, 'tassi1998', 'tassi1999'], 'c3 (primary, hamstrings), c9 (calves), c4 (watch)'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'lock', title: 'Locking the knees', zoom: 'knee-top', claim: CL.c7,
    fix: 'Stop just short of straight. Keep a small bend.' },
  { key: 'hips', title: 'Hips lifting, lower back rounding', claim: CL.hips,
    fix: 'Set the seat so your knees start at about 90 degrees.' },
  { key: 'knees-in', title: 'Knees falling in', claim: CL.c6,
    fix: 'Keep your kneecaps in line with your feet.' },
];
const RISKS = [
  { key: 'lock', text: 'Locking the knees under load is very rarely linked to knee dislocation.', claim: CL.c8 },
  { key: 'breath', text: 'Heavy presses to failure sent blood pressure very high, partly from breath holding.', claim: CL.c11 },
  { key: 'back', text: 'Avoid rounding your lower back off the pad.', claim: C(['CONSENSUS'], [ACE, WM], 'c4, c2') },
];

export default {
  schema: 1,
  id: 'lib_horizontal_leg_press',
  rev: 1,
  plate: plateSpec,
  handling: {
    why: 'D-SHIP-C3: card-no-zoom; the card has no hand zoom, and its grip copy (inherited from leg_press, c2) carries the light hold.',
    archetype: 'balance',
    handle: 'pad-handle',
    loadAxis: 'across',
    width: { text: 'Set by the machine: one handle beside each hip. Arms relaxed with soft elbows, shoulders down and back on the pad.', claim: CL.grip },
    thumb: { mode: 'wrapped', claim: CL.grip },
    contact: 'finger-base',
    wrist: { ext: [0, 20], dev: [-10, 10], limitText: '', claim: CL.c2 },   // W3 PANEL FIX 2: no unsourced wrist line (c2 only)
    pose: RIGHT_POSE,
    faults: [PUSH_ON_KNEES],
    gripLine: 'Hold the handles lightly.',   // c2 (W3 PANEL FIX 2: the unsourced knee line is dropped)
    cue: 'Light hands, never on your knees.',
  },
  contacts: ['foot-platform', 'seat-back'],
  setup: [
    { kind: 'get-in', text: 'Sit back, back and tailbone flat against the pad.', claim: CL.c1 },
    { kind: 'position', text: 'Feet flat on the plate, toes forward.', claim: CL.c1 },
    { kind: 'adjust', text: 'Set the seat so your knees start at about 90 degrees.', claim: CL.c1 },
    { kind: 'grip', text: 'Hold the handles lightly and brace your stomach.', claim: CL.c2 },
    { kind: 'brace', text: 'Breathe out as you push. Control the plate on the way back.', claim: C(['CONSENSUS', 'DATA', 'MECH'], [ACE, WM, 'macdougall1985'], 'c3, c11, c5') },
  ],
  posture: [
    // inherited (Q-W3-2: label, detail, anchor equal to leg_press's; no zoom link)
    { key: 'back', label: 'Tailbone on pad', detail: 'Your lower back stays on the pad with no gap, even at the bottom. Hips sit in the corner of the seat.',
      anchor: { at: 'sacrum', pose: 'end' }, claim: CL.back },
    { key: 'feet', label: 'Whole foot flat', detail: 'Heels down, foot in the middle of the plate, toes straight or out a little. Push from heel through ball.',
      anchor: { at: 'heel.r', pose: 'end' }, claim: CL.feet },
    // Q-W3-11 (#383 6631278086): label and detail inherited; the anchor is this plate's top pose (`end`, knee bent
    // about 15 degrees; spec T_END), since `start` here is the bottom (knees about 90).
    { key: 'soft', label: 'Soft knees', detail: 'At the top your legs are almost straight, with a small bend at the knee.',
      anchor: { at: 'knee.r', pose: 'end' }, claim: CL.soft },
    { key: 'hands', label: 'Hands light', detail: 'Arms relaxed, shoulders and head on the pad, hands wrapped lightly round the side handles.',
      anchor: { at: 'grip.r', pose: 'end' }, claim: CL.grip },
    // this card's own
    { key: 'top', label: 'Heels pressed', detail: 'Heels pressed into the plate. Knees stop relaxed, never locked.',
      anchor: { at: 'knee.r', pose: 'end' }, zoom: 'knee-top', claim: CL.lock },
    { key: 'knees-line', label: 'Knees in line', detail: 'Kneecaps follow the line of your feet.', anchor: { at: 'knee.r', pose: 'end' }, claim: CL.c6 },
    // D-SHIP-TEXTZOOM: the card zoom `seat set` as a text checkpoint (above)
    { key: 'seat', label: 'Seat set', detail: 'Knees at about 90 degrees at the start. Thighs stay clear of your ribs.',
      anchor: { at: 'knee.r', pose: 'start' }, claim: CL.seat },
    { key: 'return', label: 'Controlled return', detail: 'Control the plate on the way back. Thighs never press into your ribs.',
      anchor: { at: 'hip.r', pose: 'start' }, claim: CL.c5 },
  ],
  feel,
  zooms,
  chips: ['knee-top', 'feel'],   // the zoom shell's chip row: the zoom keys, then feel
  copy: {
    // D-TEXT-GOLDEN (#379 6637607604): posture 'seat'/'return' (c5: thighs clear of the ribs) is shown here.
    setupLine: 'Sit back, tailbone flat on the pad. Feet flat, knees at about 90 degrees, thighs clear of your ribs.',
    mistakeLine: 'Keep a small bend at the top. Never lock your knees.',
    cueLine: 'Heels pressed, soft knees.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['knee', 'back'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/horizontal_leg_press.json', rev: 1 },
};
