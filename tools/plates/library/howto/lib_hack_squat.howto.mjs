// LIB-SHIP W7: the How-to content of lib_hack_squat (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/hack_squat.json; its claim ids are named on each field's claim (card cN).
// Handling (D-SHIP-GRIP case (b)): the card's grip.thumb, grip.handContact and grip.wrist are all empty (hand archetype
// balance: the handles brace the upper body), so there is no hand claim to draw: NoHandling, and no hand zoom (the card
// has none). The card's grip.type (c18, neutral grip on the handles) is setup step 3.
// Zooms (section 17): back-pad M (the plate's own Mistake, the butt wink off the pad); knee-lock DV (the start pose's sled
// run on up the rail until the knee is straight); feet-plate T (D-SHIP-TEXTZOOM: its Wrong, the feet set high on the
// plate, is an equipment placement the crop cannot draw: posture checkpoint `feet`, setup step 2, feel row 'low-back').
// Red flags: the card's redFlags (back, knee): LIB-5's back box (shared/back-box.mjs) and golden B's knee block.
// No variant line (equipment 'Machine').
//
// D-TEXT-GOLDEN (claim -> slot):
//   card posture 'Back and hips on the pad' (c2)                -> setup 1, zoom back-pad Right, plate cue 'back'
//   card posture 'Knees in line with your toes' (c13)           -> setup 2
//   card posture 'Push through your whole foot' (c6)            -> setup 4
//   card posture 'Slight knee bend at the top' (c7)             -> zoom knee-lock Right, cueLine, plate cue 'soft'
//   card posture 'Hold the handles. Don't push with your arms' (c18) -> setup 3
//   T feet-plate Right 'Feet shoulder-width, middle of the plate' (c12) -> setup 2, posture 'feet'
//   T feet-plate Wrong 'Feet too high on the plate' (c9)        -> feel row 'low-back' means (as a fault), posture 'feet'
//   handlingMistake 'Lower back off the pad' (c8, c9, c2)       -> zoom back-pad Wrong, feel row 'low-back', risk 'back', posture 'lift'
//   handlingMistake 'Cutting the squat short' (c5)              -> copy.mistakeLine, posture 'short'
//   handlingMistake 'Feet too close together' (c12)             -> feel row 'knee' means, risk 'knees', posture 'narrow'
//   card setup 'Lock the safety lever ... Too heavy? ...' (c16) -> setup 5
import plateSpec, { HS } from '../specs/hack_squat.mjs';
import { landmarksOf } from '../engine.mjs';
import { RED_FLAG, RED_FLAG_KNEE } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_KNEE };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'fv-hack': { cite: 'Hack Squat: Target Muscles, Benefits, Exercise Instructions, And Variations (Fitness Volt)', url: 'https://fitnessvolt.com/hack-squat/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'bb-hackmachine': { cite: 'Crack the Code on New Leg Gains With the Hack Squat Machine (BarBend)', url: 'https://barbend.com/hack-squat-machine/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'sl-hack': { cite: 'How to Do Hack Squats: Muscles Worked & Benefits (StrengthLog)', url: 'https://www.strengthlog.com/hack-squat/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'hl-hack': { cite: 'How to Do a Hack Squat the Right Way (Healthline)', url: 'https://www.healthline.com/health/fitness-exercise/hack-squat',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'mh-hack': { cite: 'Want Monster Quads? Time to Learn the Hack Squat. (Men\'s Health)', url: 'https://www.menshealth.com/fitness/a39318435/hack-squat/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'motra-hs': { cite: 'Hack Squat (Facing Out) - Exercise Guide (Motra)', url: 'https://www.motra.com/exercises/machineHackSquat',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'WEAK' },
  // RED_FLAG_KNEE's own source (layers/howto/shared.mjs), as golden B's leg_press lists it: the card's redFlags 'knee'.
  'nhs-knee-pain': { cite: 'NHS, Knee pain', url: 'https://www.nhs.uk/symptoms/knee-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When knee pain needs a check.' },
  // The back box's own source (shared/back-box.mjs boxClaim), as lib_plank lists it: the card's redFlags 'back'.
  'nhs-back': { cite: 'NHS, Back pain', url: 'https://www.nhs.uk/conditions/back-pain/',
    kind: 'guideline', access: 'full', checked: '2026-10-02', use: 'CONSENSUS', note: 'When back pain needs a check.' },
};
// Not cited: c17 (load progression; the five setup steps are full), c20-c22 (tempo, plate only).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const FV = 'fv-hack', BB = 'bb-hackmachine', SL = 'sl-hack', HL = 'hl-hack';
const CL = {
  c2: C(['CONSENSUS'], [FV, BB], 'card c2'),
  c5: C(['CONSENSUS'], [FV], 'card c5'),
  c7: C(['CONSENSUS', 'WEAK'], ['motra-hs'], 'card c7'),
  c8: C(['CONSENSUS'], [FV], 'card c8'),
  c12: C(['CONSENSUS'], [FV], 'card c12'),
  c16: C(['CONSENSUS'], [SL, BB], 'card c16'),
  c18: C(['CONSENSUS'], [FV, BB], 'card c18'),
  c19: C(['CONSENSUS'], [HL], 'card c19'),
  setup1: C(['CONSENSUS'], [SL, HL, FV, BB], 'card c1, c2'),
  feet: C(['CONSENSUS'], [SL, HL, FV], 'card c1, c12, c13'),
  safety: C(['CONSENSUS'], [FV, BB, SL, HL], 'card c18, c3'),
  depth: C(['CONSENSUS'], [FV, HL, SL], 'card c4, c5, c6'),
  high: C(['CONSENSUS'], [FV, BB], 'card c12, c9'),
  back: C(['CONSENSUS'], [FV, BB, 'mh-hack'], 'card c8, c9, c2, c10'),
  quads: C(['CONSENSUS'], [BB, SL, FV], 'card c15'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: start (the top, knee KNEE_TOP short of straight, c7), end (the bottom, c4) and the
// spec's Mistake merged over the end (the butt wink: the lower back rounds and the hips lift off the pad; c8, c9, c10).
//   lock (card zoom knee-lock Wrong, c7 "knees locked at the top"): the start pose with the sled run on up the rail
//        (the body rides the sled, the feet stay flat on the fixed plate, the hands on the handles that ride with it)
//        until the knee bend is KNEE_LOCK; the travel is solved by bisection, as the spec solves TRAVEL.
// DRAWING VALUES (D-SHIP-DRAWVAL): KNEE_LOCK 1 deg (the engine's straight leg; at the feet still flat on the plate) is a
// Wrong-pose size no card gives; no number from it appears in user copy.
const H = 1.75, R = Math.PI / 180, KNEE_LOCK = 1;
const START = plateSpec.poses.start, END = plateSpec.poses.end, MIS = plateSpec.mistake.pose, U = HS.U;
const add = (a, b) => a.map((v, i) => v + b[i]), mul = (a, k) => a.map(v => v * k), sub = (a, b) => a.map((v, i) => v - b[i]);
const kneeBend = l => { const p = sub(l['hip.r'], l['knee.r']), q = sub(l['ankle.r'], l['knee.r']);
  return 180 - Math.acos(p.reduce((s, v, i) => s + v * q[i], 0) / Math.hypot(...p) / Math.hypot(...q)) / R; };
const runOn = d => ({ ...START, root: { at: add(START.root.at, mul(U, d)), tilt: START.root.tilt },
  reach: { l: { ...START.reach.l, at: add(START.reach.l.at, mul(U, d)) }, r: { ...START.reach.r, at: add(START.reach.r.at, mul(U, d)) } } });
const LOCK_D = (() => {
  let a = 0, b = 0.01;
  if (!(kneeBend(landmarksOf(runOn(a), H)) > KNEE_LOCK && kneeBend(landmarksOf(runOn(b), H)) < KNEE_LOCK)) throw new Error('lib_hack_squat: no bracket for the locked knee');
  for (let i = 0; i < 50; i++) { const m = (a + b) / 2; if (kneeBend(landmarksOf(runOn(m), H)) > KNEE_LOCK) a = m; else b = m; }
  return (a + b) / 2;
})();
const LOCK = runOn(LOCK_D);
export const stills = {
  start: { pose: START },
  end: { pose: END },
  lift: { pose: { ...END, ...MIS } },
  lock: { pose: LOCK },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// Zoom shell form (render/closeup/crop.mjs): callouts anchored at the landmark they name; each Wrong drawn alone (solid).
const zooms = [
  {
    key: 'back-pad', chip: 'Back', heading: 'Back on pad', kind: 'posture',
    crop: { center: { at: 'buttock', pose: 'right', off: [0, 0] }, sizePx: 110 },
    right: 'end',
    wrong: { base: 'end', pose: MIS, solid: true },
    callout: {
      right: { text: 'Hips on pad', anchor: 'buttock' },
      wrong: { text: 'Hips off pad', anchor: { at: 'buttock', pose: 'mistake' } },
    },
    caption: {
      right: 'Hips and lower back on the pad.',
      wrong: 'Lower back rounded off the pad at the bottom.',
    },
    alt: {
      right: 'Side view, bottom of the hack squat. The hips and lower back stay on the back pad.',
      wrong: 'Side view, bottom of the hack squat. The lower back rounds and the hips lift off the pad.',
    },
    feelRow: 'low-back',
  },
  {
    key: 'knee-lock', chip: 'Knees', heading: 'Knee lockout', kind: 'posture',
    crop: { center: { at: 'knee.r', pose: 'right', off: [0, 0] }, sizePx: 120 },
    right: 'start',
    wrong: { base: 'start', pose: LOCK, solid: true },
    callout: {
      right: { text: 'Slight bend', anchor: 'knee.r' },
      wrong: { text: 'Locked', anchor: 'knee.r' },
    },
    caption: {
      right: 'Slight knee bend at the top.',
      wrong: 'Knees locked at the top.',
    },
    alt: {
      right: 'Side view, top of the hack squat. The legs are extended with a slight bend at the knee.',
      wrong: 'Side view, top of the hack squat. The knees are snapped straight and locked.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const KNEES = ['knee-left', 'knee-right'];
const feel = {
  primary: [{ muscleId: 'quads', plain: 'The front of your thighs does most of the work.' }],
  secondary: [
    { muscleId: 'glutes', plain: 'Your glutes work too.' },
    { muscleId: 'adductors', plain: 'Your inner thighs work too.' },
    { muscleId: 'hamstrings', plain: 'The backs of your thighs help.' },
  ],
  watch: [],
  // The card's thigh and glute rows have no fix, so they are left out: the feel line says them (D-SHIP-Q16).
  feelLine: 'You should feel this mostly in the front of your thighs, and in your glutes.',
  rows: [
    { key: 'low-back', where: 'Lower back', at: { muscles: ['lower_back'] },
      means: 'Lower back lifting off the pad at the bottom.',   // card row (c8), its own strength (D-FEEL-MEANS-CAUSAL)
      fix: "Keep your hips and back on the pad. Don't set your feet too high.",
      zoom: 'back-pad', redFlag: 'back', claim: CL.back },
    { key: 'knee', where: 'Knees', at: { parts: KNEES },
      means: 'Your feet are too close together.',
      fix: 'Set your feet shoulder-width, toes slightly out.',
      redFlag: 'knee', claim: CL.c12 },
  ],
  libraryDiff: { add: ['adductors'], why: 'card libraryDiff: the quads do the vast majority of the work; the glutes and adductors also work (c15).' },
  claim: CL.quads,
};

/* ---------------------------------------------------------------- risks (card risks; handlingMistakes are posture, Q-W2-12) */
const RISKS = [
  { key: 'back', text: 'Lifting your lower back off the pad can strain it.', claim: CL.c8 },
  { key: 'knees', text: 'Feet too close together can stress the knees.', claim: CL.c12 },
  { key: 'pain', text: 'Lower back or knee pain? This is usually not a good choice.', claim: CL.c19 },
];

export default {
  schema: 1,
  id: 'lib_hack_squat',
  rev: 1,
  plate: plateSpec,
  handling: { archetype: 'none', why: 'D-SHIP-GRIP (b): the card gives no thumb, contact or wrist claim; its grip type (c18) is setup step 3.' },
  contacts: ['foot-platform'],   // the card's archetype.contact
  setup: [
    { kind: 'get-in', text: 'Shoulders under the pads, back and hips on the pad.', claim: CL.setup1 },
    { kind: 'position', text: 'Feet shoulder-width, mid-plate, toes slightly out, knees in line with them.', claim: CL.feet },
    { kind: 'safety', text: "Hold the handles, don't push. Straighten up, release the safety.", claim: CL.safety },
    { kind: 'position', text: 'Lower to at least parallel. Push up through your whole foot.', claim: CL.depth },
    { kind: 'finish', text: 'Re-lock the safety to finish. Too heavy? Use the safety locks.', claim: CL.c16 },
  ],
  posture: [
    { key: 'back', label: 'Back on pad', detail: 'Hips and lower back stay on the pad.', anchor: { landmark: 'sacrum', pose: 'end' }, zoom: 'back-pad', claim: CL.c2 },
    { key: 'knees-line', label: 'Knees over toes', detail: 'Knees in line with your toes.', anchor: { landmark: 'knee.r', pose: 'end' }, claim: CL.feet },
    { key: 'whole-foot', label: 'Whole foot', detail: 'Push through your whole foot.', anchor: { landmark: 'heel.r', pose: 'end' }, claim: CL.depth },
    { key: 'soft', label: 'Slight bend', detail: 'Slight knee bend at the top.', anchor: { landmark: 'knee.r', pose: 'start' }, zoom: 'knee-lock', claim: CL.c7 },
    { key: 'hands', label: 'Hands on handles', detail: "Hold the handles. Don't push with your arms.", anchor: { landmark: 'grip.r', pose: 'start' }, claim: CL.c18 },
    // Q-W2-12: handlingMistakes 'Lower back off the pad' (c8, c9, c2), 'Cutting the squat short' (c5), 'Feet too close
    // together' (c12) merged here, their fixes as the detail
    { key: 'lift', label: 'Back off pad', detail: 'Keep your hips and back on the pad.', anchor: { landmark: 'buttock', pose: 'end' }, zoom: 'back-pad', claim: CL.back },
    { key: 'short', label: 'Cutting it short', detail: 'Lower until your thighs are at least parallel.', anchor: { landmark: 'hip.r', pose: 'end' }, claim: CL.c5 },
    { key: 'narrow', label: 'Feet too close', detail: 'Set your feet shoulder-width, toes slightly out.', anchor: { landmark: 'ankle.r', pose: 'end' }, claim: CL.c12 },
    // D-SHIP-TEXTZOOM: the card zoom feet-plate as a text checkpoint (header)
    { key: 'feet', label: 'Feet mid-plate', detail: 'Feet shoulder-width, middle of the plate, never too high.', anchor: { landmark: 'heel.r', pose: 'start' }, claim: CL.high },
  ],
  feel,
  zooms,
  chips: ['back-pad', 'knee-lock', 'feel'],   // the zoom shell's chip row: the zoom keys, then feel
  copy: {
    setupLine: 'Shoulders under the pads, back and hips on the pad. Feet shoulder-width, mid-plate.',
    mistakeLine: "Don't cut the squat short. Lower until your thighs are at least parallel.",
    cueLine: 'Back on pad, slight knee bend.',
  },
  redFlag: RED_FLAG,
  mistakes: [],   // Q-W2-12 (#379 6628699724): NoHandling; the card's handlingMistakes are posture checkpoints
  risks: RISKS,
  riskFlags: ['back', 'knee'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/hack_squat.json', rev: 1 },
};
