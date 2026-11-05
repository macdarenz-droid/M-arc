// LIB-SHIP W7: the How-to content of lib_lying_leg_curl (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/lying_leg_curl.json; its claim ids are named on each field's claim (card cN).
// Handling (D-SHIP-GRIP case (b)): the card's grip.thumb, grip.handContact and grip.wrist are all empty (hand archetype
// balance: the hands steady the body), so there is no hand claim to draw: NoHandling, and no hand zoom (the card has
// none). The card's grip.type and grip.width (c5, the handles on the machine) are setup step 4.
// Zooms (section 17): hips-pad DV (the end pose with the pelvis lifted off the pad). knee-axis T (D-SHIP-TEXTZOOM: its
// wrong is null, LR-25): posture checkpoint `axis`, setup step 1. roller T (D-SHIP-TEXTZOOM: its Wrong, the roller on the
// heel or Achilles, is an equipment placement the crop cannot draw): posture checkpoint `roller`, setup step 2,
// copy.mistakeLine.
// Red flags: the card's redFlags (knee, back): golden B's knee block and LIB-5's back box (shared/back-box.mjs).
// No variant line (equipment 'Machine').
//
// D-TEXT-GOLDEN (claim -> slot):
//   card posture 'Knees start nearly straight, not forced locked' (c6) -> setup 4 (D-TEXT-PRINTED), copy.setupLine
//   card posture 'Hips stay on the pad the whole set' (c5, c8)  -> zoom hips-pad Right, plate cue 'hips'
//   card posture 'Abs braced. Don't arch your lower back' (c9)  -> setup 3, feel row 'low-back' fix, plate cue 'back'
//   card posture 'Curl toward your glutes. Stop before your hips lift' (c7) -> setup 4, setup 5
//   card posture 'Breathe out as you curl, in as you lower' (c12) -> setup 3
//   card posture 'Lower under control. Don't let the stack touch' (c11) -> setup 5 (D-TEXT-PRINTED), copy.cueLine
//   T knee-axis Right 'Knee in line with the machine's axis' (c1) -> setup 1, plate cue 'axis', posture 'axis'
//   T roller Right 'Roller on the lower calf, just above the heel' (c3) -> setup 2, posture 'roller'
//   T roller Wrong 'Roller pressing into the heel or Achilles tendon' (c4) -> setup 2 (as a fault, D-TEXT-PRINTED), copy.mistakeLine (as a mistake), posture 'roller'
//   handlingMistake 'Knees off the machine's axis' (c2, c1)     -> setup 1, copy.mistakeLine, risk 'axis', posture 'axis'
//   handlingMistake 'Arching your lower back' (c9, c10)         -> feel row 'low-back', risk 'arch', posture 'arch'
//   handlingMistake 'Hips lifting off the pad' (c8)             -> zoom hips-pad Wrong, posture 'hips'
import plateSpec from '../specs/lying_leg_curl.mjs';
import { landmarksOf } from '../engine.mjs';
import { RED_FLAG, RED_FLAG_KNEE } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_KNEE };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'fv-llc': { cite: 'Lying Leg Curl: Muscles Worked, Form, and Variations (Fitness Volt)', url: 'https://fitnessvolt.com/24561/lying-leg-curl/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'mo-llc': { cite: 'Machine Leg / Hamstring Curl Prone (Motra)', url: 'https://www.motra.com/exercises/machineLegCurlLying',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'lifto-llc': { cite: 'Leverage Machine Lying Leg Curl - How To, Muscles Worked & Form Guide (Liftosaur)', url: 'https://www.liftosaur.com/exercises/leverage-machine-lying-leg-curl',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'ace-llc': { cite: 'Lying Hamstrings Curl (ACE Exercise Library)', url: 'https://www.acefitness.org/resources/everyone/exercise-library/153/lying-hamstrings-curl/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'nasm-llc': { cite: 'Lying Leg Curl (NASM exercise library)', url: 'https://www.nasm.org/resource-center/exercise-library/lying-leg-curl',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'sl-llc': { cite: 'How to Do Lying Leg Curl: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/lying-leg-curl/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'hl-hc': { cite: '5 Types of Hamstring Curls for Stronger Thighs (Healthline)', url: 'https://www.healthline.com/health/hamstring-curls',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'WEAK' },
  // RED_FLAG_KNEE's own source (layers/howto/shared.mjs), as golden B's leg_press lists it: the card's redFlags 'knee'.
  'nhs-knee-pain': { cite: 'NHS, Knee pain', url: 'https://www.nhs.uk/symptoms/knee-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When knee pain needs a check.' },
  // The back box's own source (shared/back-box.mjs boxClaim), as lib_plank lists it: the card's redFlags 'back'.
  'nhs-back': { cite: 'NHS, Back pain', url: 'https://www.nhs.uk/conditions/back-pain/',
    kind: 'guideline', access: 'full', checked: '2026-10-02', use: 'CONSENSUS', note: 'When back pain needs a check.' },
};
// Not cited: c13, c14 (load and momentum; no slot left), c18-c20 (tempo, plate only), c21 (sets and progression).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const FV = 'fv-llc', MO = 'mo-llc', LI = 'lifto-llc', ACE = 'ace-llc', NA = 'nasm-llc', SL = 'sl-llc';
const CL = {
  c1: C(['CONSENSUS'], [FV, ACE, SL], 'card c1'),
  c2: C(['CONSENSUS'], [MO, FV], 'card c2'),
  c6: C(['CONSENSUS'], [FV, MO], 'card c6'),
  c10: C(['CONSENSUS', 'WEAK'], ['hl-hc'], 'card c10'),
  c11: C(['CONSENSUS'], [FV, LI, MO], 'card c11'),
  c15: C(['CONSENSUS', 'WEAK'], ['hl-hc'], 'card c15'),
  c16: C(['CONSENSUS'], [FV], 'card c16'),
  hips: C(['CONSENSUS'], [FV, MO, NA, LI], 'card c5, c8'),
  lift: C(['CONSENSUS'], [FV, LI, MO], 'card c8'),
  arch: C(['CONSENSUS', 'WEAK'], [ACE, LI, MO, FV, 'hl-hc'], 'card c9, c10'),
  axis: C(['CONSENSUS'], [MO, FV, ACE, SL], 'card c2, c1'),
  roller: C(['CONSENSUS'], [FV, LI, MO, ACE], 'card c3, c4'),
  setupMis: C(['CONSENSUS'], [MO, FV], 'card c2, c4'),
  ham: C(['CONSENSUS'], [FV, NA], 'card c17, c16'),
  breath: C(['CONSENSUS'], [FV, MO, NA, LI], 'card c5, c12'),
  start: C(['CONSENSUS'], [FV, MO, LI, ACE], 'card c6, c7'),
  lower: C(['CONSENSUS'], [FV, LI, MO], 'card c7, c8, c11'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: start (knees nearly straight, c6) and end (knees past 90, hips on the pad, c7, c8).
//   lift (card zoom hips-pad Wrong, c8 "Hips lifting off the pad"): the end pose with the hips raised HIP_LIFT off the
//        pad: the knee stays at the machine's axis (the spec's own knee check, c1), the chest stays down on the pad
//        (its height held), and the hip joint rises HIP_LIFT; the root (height, fore-aft place, pelvis tilt) and the hip
//        flexion are solved (Newton, lib_plank's solver), the trunk, knee and hands as the end has them.
// DRAWING VALUES (D-SHIP-DRAWVAL): HIP_LIFT 0.10 m is a Wrong-pose size no card gives; no number from it appears in
// user copy.
const H = 1.75, HIP_LIFT = 0.10;
const END = plateSpec.poses.end, LE = landmarksOf(END, H);
function solve(p0, make, res, iters = 30) {   // Newton with finite differences (lib_plank's solver)
  const keys = Object.keys(p0); const p = { ...p0 };
  const f = q => res(landmarksOf(make(q), H));
  for (let it = 0; it < iters; it++) {
    const r = f(p); if (Math.hypot(...r) < 1e-7) break;
    const J = keys.map(k => { const d = 1e-5, q = { ...p, [k]: p[k] + d }; return f(q).map((v, i) => (v - r[i]) / d); });
    const n = keys.length, A = Array.from({ length: n }, (_, i) => [...keys.map((_, j) => J[j][i]), -r[i]]);
    for (let c = 0; c < n; c++) {
      let m = c; for (let i = c + 1; i < n; i++) if (Math.abs(A[i][c]) > Math.abs(A[m][c])) m = i;
      [A[c], A[m]] = [A[m], A[c]];
      for (let i = 0; i < n; i++) if (i !== c) { const k = A[i][c] / A[c][c]; for (let j = c; j <= n; j++) A[i][j] -= k * A[c][j]; }
    }
    keys.forEach((k, i) => { p[k] += A[i][n] / A[i][i]; });
  }
  const r = f(p); if (Math.hypot(...r) > 1e-5) throw new Error('lib_lying_leg_curl: the hips-lift pose did not converge');
  return p;
}
const liftPose = q => ({ root: { at: [0, q.y, q.z], tilt: q.tilt }, hip: q.hip });
const LQ = solve({ y: END.root.at[1], z: END.root.at[2], tilt: END.root.tilt, hip: END.hip }, q => ({ ...END, ...liftPose(q) }),
  lm => [lm['knee.r'][1] - LE['knee.r'][1], lm['knee.r'][2] - LE['knee.r'][2], lm.chest[1] - LE.chest[1], lm['hip.r'][1] - LE['hip.r'][1] - HIP_LIFT]);
const LIFT = liftPose(LQ);
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  lift: { pose: { ...END, ...LIFT } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// Zoom shell form (render/closeup/crop.mjs): callouts anchored at the landmark they name; the Wrong drawn alone (solid).
const zooms = [
  {
    key: 'hips-pad', chip: 'Hips', heading: 'Hips on pad', kind: 'posture',
    // claims: Right (callout, caption, alt) card c5; Wrong card c8
    crop: { center: { at: 'navel', pose: 'right', off: [0, -10] }, sizePx: 120 },
    right: 'end',
    wrong: { base: 'end', pose: LIFT, solid: true },
    callout: {
      right: { text: 'Hips on pad', anchor: 'navel' },
      wrong: { text: 'Hips lifting', anchor: 'navel' },
    },
    caption: {
      right: 'Front of the hips pressed into the pad.',
      wrong: 'Hips lifting off the pad.',
    },
    alt: {
      right: 'Side view, lying face down, legs curled. The front of the hips stays pressed on the pad.',
      wrong: 'Side view, lying face down, legs curled. The hips lift up off the pad.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'hamstrings', plain: 'The backs of your thighs do most of the work.' }],
  secondary: [{ muscleId: 'calves', plain: 'Your calves help bend the knee.' }],
  watch: [],
  // The card's first row (back of the thighs) has no fix, so it is left out: the feel line says it (D-SHIP-Q16).
  feelLine: 'You should feel this in the back of your thighs.',
  rows: [
    { key: 'low-back', where: 'Lower back', at: { muscles: ['lower_back'] },
      means: 'Arching the lower back can cause back pain and discomfort.',
      fix: 'Brace your abs. Use a lighter weight if your low back moves.',
      redFlag: 'back', claim: CL.arch },
    { key: 'knee', where: 'Behind the knee', at: { parts: ['knee-left', 'knee-right'] },
      means: 'Sharp pain here is a reason to stop.',
      fix: 'Stop the set. Try a lighter load or a different pad position.',
      redFlag: 'knee', claim: CL.c16 },
  ],
  claim: CL.ham,
};

/* ---------------------------------------------------------------- risks (card risks; handlingMistakes are posture, Q-W2-12) */
const RISKS = [
  { key: 'axis', text: "Line your knees up with the machine's axis to prevent joint stress.", claim: CL.c2 },
  { key: 'arch', text: 'Arching your lower back can cause back pain and discomfort.', claim: CL.c10 },
  { key: 'jerk', text: 'Sudden, jerking movements can lead to injury.', claim: CL.c15 },
];

export default {
  schema: 1,
  id: 'lib_lying_leg_curl',
  rev: 1,
  plate: plateSpec,
  handling: { archetype: 'none', why: 'D-SHIP-GRIP (b): the card gives no thumb, contact or wrist claim; its grip type and width (c5) are setup step 4.' },
  contacts: ['pivot-pad'],   // the card's archetype.contact
  setup: [
    { kind: 'get-in', text: 'Lie face down, knees near the bench edge, aligned with the axis.', claim: CL.c1 },
    { kind: 'adjust', text: 'Roller on your lower calf, not pressing your heel or Achilles.', claim: CL.roller },
    { kind: 'grip', text: 'Hold the handles, abs tight. Breathe out to curl, in to lower.', claim: CL.breath },
    { kind: 'position', text: 'Start knees nearly straight, not forced locked. Curl toward your glutes.', claim: CL.start },
    { kind: 'position', text: 'Stop before your hips lift. Lower with control, stack never touching.', claim: CL.lower },
  ],
  posture: [
    // D-SHIP-TEXTZOOM: the card zoom knee-axis as a text checkpoint (its wrong is null, LR-25); Q-W2-12: handlingMistake
    // 'Knees off the machine's axis' (c2, c1) merged here, its fix as the detail
    { key: 'axis', label: 'Knee at axis', detail: "Line your knees up with the machine's axis before you start.", anchor: { landmark: 'knee.r', pose: 'start' }, claim: CL.axis },
    // D-SHIP-TEXTZOOM: the card zoom roller as a text checkpoint (its Wrong is an equipment placement)
    { key: 'roller', label: 'Roller above heel', detail: 'Roller on the lower calf, just above the heel, never pressing into it.', anchor: { landmark: 'ankle.r', pose: 'start' }, claim: CL.roller },
    { key: 'start', label: 'Nearly straight', detail: 'Knees start nearly straight, not forced locked.', anchor: { landmark: 'knee.r', pose: 'start' }, claim: CL.c6 },
    // Q-W2-12: handlingMistakes 'Hips lifting off the pad' (c8) and 'Arching your lower back' (c9, c10) merged here
    { key: 'hips', label: 'Hips on pad', detail: 'Keep your hips down. Use less weight or stop earlier.', anchor: { landmark: 'navel', pose: 'end' }, zoom: 'hips-pad', claim: CL.lift },
    { key: 'arch', label: 'Low back still', detail: 'Brace your abs. Use a lighter weight if your low back moves.', anchor: { landmark: 'backMid', pose: 'end' }, claim: CL.arch },
    { key: 'lower', label: 'Controlled lowering', detail: "Lower under control. Don't let the stack touch.", anchor: { landmark: 'ankle.r', pose: 'end' }, claim: CL.c11 },
  ],
  feel,
  zooms,
  chips: ['hips-pad', 'feel'],   // the zoom shell's chip row: the zoom keys, then feel
  copy: {
    setupLine: 'Knees start nearly straight, not forced locked.',   // card c6
    mistakeLine: "Don't start with your knees off the axis or the roller on your heel.",   // card c2, c4 (CL.setupMis)
    cueLine: 'Lower slowly, stack never touches.',   // card c11
  },
  redFlag: RED_FLAG,
  mistakes: [],   // Q-W2-12 (#379 6628699724): NoHandling; the card's handlingMistakes are posture checkpoints
  risks: RISKS,
  riskFlags: ['knee', 'back'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/lying_leg_curl.json', rev: 1 },
};
