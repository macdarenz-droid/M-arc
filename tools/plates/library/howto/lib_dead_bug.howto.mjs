// LIB-SHIP W7: the How-to content of lib_dead_bug, golden B's HowToContent shape (as lib_crunch). Every shown string
// restates a claim of the research card docs/research/howto/cards/dead_bug.json (cited in its field's claim, cN = card claim id).
// Handling: none, D-SHIP-GRIP (b2): the card archetype.hand is none; its handContact (c3, c4: arms straight up above the
// chest, one lowering overhead) is on setup steps 2 and 4 and the posture line 'lower'.
// No variant line (equipment 'Bodyweight').
//
// D-TEXT-GOLDEN (claim -> visible slot; posture checkpoints are kept in Q-W2-12 form as well):
//   card posture 'Slowly lower one arm and the opposite leg' (c4) -> plate label/cue 'opposite', setup 4 (W7 printed)
//   card posture 'Hand and heel lightly touch' (c4)                -> copy.setupLine, setup 5 (W7 printed)
//   card posture 'Bring them back slowly, then switch' (c4)        -> copy.setupLine (plate tempo Lower/Return Slow), setup 5 (W7 printed)
//   card posture 'Breathe in as you reach out' (c9, c4)            -> copy.mistakeLine, setup 4-5 (W7 printed)
//   card posture 'Stare straight up at the ceiling' (c8)           -> zoom 'neck' Right caption, feel row 'neck' fix
//   card posture 'Easier: ...' (c10)                               -> left off (D-TEXT-PROGRESSION)
//   handlingMistake 'Back arching off the mat' (c6, c3, c7)        -> zoom 'low-back' Wrong, setup step 3, feel row 'low-back', risks 'arch'
//   handlingMistake 'Craning your neck' (c8)                       -> zoom 'neck' Wrong, feel row 'neck', risks 'neck'
//   handlingMistake 'Holding your breath' (c9)                     -> copy.mistakeLine, risks 'breath' (W7 printed)
//   card zooms low-back (M, drawn as DV: D-PFC-ROUND1 L5), neck (DV) -> zooms
import plateSpec from '../specs/dead_bug.mjs';
import { landmarksOf, fk, resolve, normPose, bodyShapes } from '../engine.mjs';
import { RED_FLAG } from '../../layers/howto/shared.mjs';
export { RED_FLAG };

/* ---------------------------------------------------------------- sources (the card's sources) ------------------- */
export const SOURCES = {
  'ace-deadbug': { cite: 'Ab Exercises | Supine Dead Bug (ACE)', url: 'https://www.acefitness.org/resources/everyone/exercise-library/147/supine-dead-bug/',
    kind: 'guideline', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'ggr-deadbug': { cite: 'Try the Dead Bug Exercise for a Strong Core (Garage Gym Reviews)', url: 'https://www.garagegymreviews.com/dead-bug-exercise',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'pereira-2017': { cite: 'Trunk Muscle EMG During Intermediate Pilates Mat Exercises in Beginner Healthy and Chronic Low Back Pain Individuals (2017)', url: 'https://pubmed.ncbi.nlm.nih.gov/28413116/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-22', use: 'DATA' },
  // The back box's own source (shared/back-box.mjs boxClaim), as lib_plank lists it: the card's redFlags 'back'.
  'nhs-back': { cite: 'NHS, Back pain', url: 'https://www.nhs.uk/conditions/back-pain/',
    kind: 'guideline', access: 'full', checked: '2026-10-02', use: 'CONSENSUS', note: 'When back pain needs a check.' },
};

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const ACE = 'ace-deadbug', GGR = 'ggr-deadbug';
const CL = {
  c1: C(['CONSENSUS'], [ACE], 'card c1'),
  c2: C(['CONSENSUS'], [ACE], 'card c2'),
  c3: C(['CONSENSUS'], [ACE, GGR], 'card c3'),
  c4: C(['CONSENSUS'], [ACE, GGR], 'card c4'),
  c5: C(['CONSENSUS'], [GGR], 'card c5'),
  c6: C(['CONSENSUS'], [GGR], 'card c6'),
  c8: C(['CONSENSUS'], [GGR], 'card c8'),
  c9: C(['CONSENSUS'], [GGR, ACE], 'card c9'),
  c11: C(['CONSENSUS'], [ACE, GGR], 'card c11'),
  back: C(['CONSENSUS'], [GGR, ACE], 'card c5, c6, c3, c7'),
  rest: C(['CONSENSUS'], [GGR], 'card c6, c7'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses:
//   arch  (card zoom low-back Wrong, c6 "back arching off the mat"): the end with the pelvis tipped ARCH_TILT forward and
//         L3 taking it back (the thorax keeps its angle, so the arms, the head and the shoulders are unchanged); root y,
//         root z and L3 solved (Newton) so the buttock stays on the mat and the near shoulder keeps its place; both hips
//         take the tip back so the legs keep their angle to the floor. The spec's own Mistake solve (specs/dead_bug.mjs
//         archAt, ARCH), copied, with a larger tilt, drawn solid so the body itself lifts off the mat (PFC fix round,
//         D-PFC-ROUND1 #394 6701001868 L5; hollow_body_hold's low-back form). Its guide is the spec's gap mark
//         (specs/dead_bug.mjs gapBot, gapTop, `underside`, copied): from the mat up to the arched pose's drawn
//         torso underside at its lumbar (a dashed path, lib_crunch's form).
//   crane (card zoom neck Wrong, c8 "neck craned to look at the legs"): the start pose (both arms straight up) with the
//         neck flexed NECK_CRANE deg further, so the head lifts off the mat and turns toward the legs; nothing else moves
//         (one joint). W7 fix round (#394 L5): the neck zoom is drawn on the start, not the end, so the lowered arm no
//         longer lies over the head (the spec's own pose; no drawing value changed).
// DRAWING VALUES (D-SHIP-DRAWVAL, #376 6614695581; precedent D-LIB7-2 and golden B's machine_chest_press seatDrop): NECK_CRANE
// 35 deg and ARCH_TILT 38 deg (the spec's MIS_TILT 14 deg raised so the gap under the low back reads at panel size, as
// hollow_body_hold's) are Wrong-pose sizes no card gives; the low-back crop window (centre offset, sizePx) is a drawing
// value; no number from them appears in user copy; the layers panel judges them.
const H = 1.75, START = plateSpec.poses.start, END = plateSpec.poses.end, NECK_CRANE = 35, ARCH_TILT = 38;
const CRANE = { neck: START.neck + NECK_CRANE };
const F = END.trunk.flex, LM_E = landmarksOf(END, H), SH_E = LM_E['shoulder.r'];
const archAt = ([y, z, l3]) => ({ ...END, hip: { l: END.hip.l + ARCH_TILT, r: END.hip.r + ARCH_TILT },
  trunk: { flex: [F[0], l3, F[2] + F[1] - ARCH_TILT - l3, F[3]] }, root: { at: [0, y, z], tilt: END.root.tilt + ARCH_TILT } });
const ARCH_Q = (() => {
  const f = q => { const l = landmarksOf(archAt(q), H); return [l.buttock[1] - LM_E.buttock[1], l['shoulder.r'][1] - SH_E[1], l['shoulder.r'][2] - SH_E[2]]; };
  let q = [END.root.at[1], END.root.at[2], F[1] - ARCH_TILT];
  for (let it = 0; it < 60; it++) {
    const r = f(q); if (Math.hypot(...r) < 1e-8) return q;
    const J = [0, 1, 2].map(k => { const d = 1e-6, qq = [...q]; qq[k] += d; return f(qq).map((v, i) => (v - r[i]) / d); });
    const M = [0, 1, 2].map(i => [...[0, 1, 2].map(k => J[k][i]), -r[i]]);
    for (let c = 0; c < 3; c++) {
      let m = c; for (let i = c + 1; i < 3; i++) if (Math.abs(M[i][c]) > Math.abs(M[m][c])) m = i;
      [M[c], M[m]] = [M[m], M[c]];
      for (let i = 0; i < 3; i++) if (i !== c) { const k = M[i][c] / M[c][c]; for (let j = c; j < 4; j++) M[i][j] -= k * M[c][j]; }
    }
    q = q.map((v, i) => v + M[i][3] / M[i][i]);
  }
  throw new Error('lib_dead_bug: the arch does not converge');
})();
const ARCH = archAt(ARCH_Q);
// the gap mark (dead_bug spec form): the drawn torso underside (world y) at the arched lumbar's floor position z
const SIDE = { view: 'side', near: 'r', pxm: 1, P: w => [w[2], -w[1]] }, BODY = { height: H };
const underside = (p, z) => { const pts = bodyShapes(fk(resolve(normPose(p, BODY), BODY).q, BODY), SIDE, { hand: 'flat' }).find(s => s.key === 'torso').poly; let lo = -Infinity;
  for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; if ((a[0] - z) * (b[0] - z) > 0 || a[0] === b[0]) continue; lo = Math.max(lo, a[1] + (b[1] - a[1]) * (z - a[0]) / (b[0] - a[0])); }
  return -lo; };
const LZ = landmarksOf(ARCH, H).lumbar[2], GAP = [{ kind: 'path', role: 'wrong', pts: [[0, 0, LZ], [0, underside(ARCH, LZ), LZ]] }];
export const stills = {
  start: { pose: START },
  end: { pose: END },
  arch: { pose: ARCH },
  crane: { pose: { ...START, ...CRANE } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// Zoom shell (pilot-a.closeups.mjs form). Both crops are framed so the head, the trunk and the mat line read (W7 fix
// round #394 L5/L7: widened; `off` and `sizePx` are drawing values).
const zooms = [
  {
    key: 'low-back', chip: 'Low back', heading: 'Low back', kind: 'posture',
    crop: { center: { at: 'lumbar', pose: 'right', off: [-12, -18] }, sizePx: 120 },
    right: 'end',
    wrong: { base: 'end', pose: ARCH, solid: true },   // DV: the arch still drawn alone (D-PFC-ROUND1 L5; was the plate's Mistake)
    guides: GAP,
    callout: {
      right: { text: 'Back down', anchor: 'lumbar' },
      wrong: { text: 'Back arches', anchor: { at: 'lumbar', pose: 'mistake' } },
    },
    caption: {
      right: 'Lower back flat on the mat.',
      wrong: 'Back arching off the mat.',
    },
    alt: {
      right: 'Side view, dead bug. One arm and the opposite leg lowered, the lower back flat on the mat.',
      wrong: 'Side view, dead bug. As the arm and leg lower, the back arches off the mat.',
    },
    feelRow: 'low-back',
  },
  {
    key: 'neck', chip: 'Neck', heading: 'Neck', kind: 'posture',
    crop: { center: { at: 'ear', pose: 'right', off: [22, -28] }, sizePx: 150 },
    right: 'start',
    wrong: { base: 'start', pose: CRANE, solid: true },   // DV: the crane still drawn alone
    callout: {
      right: { text: 'Eyes up', anchor: 'head' },
      wrong: { text: 'Neck craned', anchor: { at: 'head', pose: 'mistake' } },
    },
    caption: {
      right: 'Eyes straight up at the ceiling.',
      wrong: 'Neck craned to look at the legs.',
    },
    alt: {
      right: 'Side view, dead bug. The head rests on the mat, eyes straight up at the ceiling.',
      wrong: 'Side view, dead bug. The head lifts off the mat, neck craned to look at the legs.',
    },
    feelRow: 'neck',
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'abs', plain: 'The abs at the front of the belly work.', claim: CL.c11 }],
  secondary: [
    { muscleId: 'obliques', plain: 'The sides of the waist work too.', claim: C(['CONSENSUS', 'DATA'], [GGR, 'pereira-2017'], 'card c11, c12') },
    { muscleId: 'hip_flexors', plain: 'The hip flexors also work.', claim: CL.c11 },
  ],
  watch: [],
  feelLine: 'You should feel this in the front of your belly and sides of your waist.',
  rows: [
    // The card's first two rows (front of the belly, sides of the waist) have no fix, so they are left out: the feel line says them.
    { key: 'low-back', where: 'Low back', at: { muscles: ['lower_back'], parts: ['lower-back-erectors-left', 'lower-back-ql-left', 'lower-back-erectors-right', 'lower-back-ql-right'] },   // D-PFR-L4: the red flag's pain region
      means: 'Your back is arching off the mat.',
      fix: "Finish the rep you're on and rest.",
      zoom: 'low-back', redFlag: 'back', claim: CL.rest },
    { key: 'neck', where: 'Neck', at: { parts: ['neck-left', 'neck-right'] },
      means: 'Looking down at your legs strains your neck.',
      fix: 'Look straight up at the ceiling.',   // card "Stare straight up at the ceiling" (c8)
      zoom: 'neck', claim: CL.c8 },
  ],
  libraryDiff: { add: ['obliques', 'hip_flexors'], why: 'Garage Gym Reviews names both; Pereira measured more oblique than rectus activity (card c11, c12).' },
  claim: CL.c11,
};

/* ------------------------------------------------------------------------------------------------ risks ---------- */
const RISKS = [
  { key: 'arch', text: 'Arching your back could contribute to a back injury.', claim: CL.c6 },
  { key: 'neck', text: 'Looking down at your legs strains your neck.', claim: CL.c8 },
  // W7 D-TEXT-PRINTED: handlingMistake 'Holding your breath' (c9) as a fault (copy.mistakeLine is not printed);
  // D-PFC-ROUND1 L6: worded as the handling mistake with the card's fix (was a bare 'is a mistake' with no fix)
  { key: 'breath', text: 'Holding your breath? Breathe in as you reach out, out as you return.', claim: CL.c9 },
];

export default {
  schema: 1,
  id: 'lib_dead_bug',
  rev: 1,
  plate: plateSpec,
  handling: { archetype: 'none', why: 'D-SHIP-GRIP (b2): the card archetype.hand is none; its handContact (c3, c4) is on setup steps 2 and 4 and the posture line lower.' },
  contacts: ['floor-body'],
  setup: [
    { kind: 'position', text: 'Lie on your back on a mat.', claim: CL.c1 },
    // W7 D-TEXT-PRINTED (copy lines and posture checkpoints are not printed): the card's steps 2-3 (c3) and 4-5 (c3,
    // c2) merged; card posture 'Slowly lower one arm and the opposite leg' (c4) and 'Breathe in as you reach out'
    // (c9, c4) -> step 4; 'Hand and heel lightly touch' and 'Bring them back slowly, then switch' (c4, c9) -> step 5.
    { kind: 'position', text: 'Knees at 90 degrees over your hips, arms straight above your chest.', claim: CL.c3 },
    { kind: 'brace', text: 'Brace, press your lower back into the mat, shoulders down and back.', zoom: 'low-back',
      claim: C(['CONSENSUS'], [ACE, GGR], 'card c3, c2') },
    { kind: 'position', text: 'Breathe in and slowly lower one arm and the opposite leg.', claim: CL.c4 },
    { kind: 'position', text: 'Touch hand and heel lightly, without resting. Breathe out, return, switch sides.',
      claim: C(['CONSENSUS'], [ACE, GGR], 'card c4, c9') },
  ],
  posture: [
    { key: 'lower', label: 'Opposite limbs', detail: 'Slowly lower one arm and the opposite leg toward the floor.',
      anchor: { landmark: 'wrist.r', pose: 'end' }, claim: CL.c4 },
    { key: 'touch', label: 'Light touch', detail: 'Hand and heel lightly touch the floor without resting.',
      anchor: { landmark: 'heel.l', pose: 'end' }, claim: CL.c4 },
    { key: 'return', label: 'Slow return', detail: 'Bring them back slowly, then switch sides.',
      anchor: { landmark: 'knee.r', pose: 'start' }, claim: CL.c4 },
    // Q-W2-12: handlingMistake 'Holding your breath' (c9) merged here, its fix added
    { key: 'breathe', label: 'Breathing', detail: 'Breathe in as you reach out, out as you return. Never hold your breath.',
      anchor: { landmark: 'chest', pose: 'end' }, claim: C(['CONSENSUS'], [GGR, ACE], 'card c9, c4') },
    // Q-W2-12: handlingMistake 'Back arching off the mat' (c6, c3, c7) merged here, its fix added
    { key: 'low-back', label: 'Low back down', detail: 'The back stays flat on the mat. Press your lower back into it. If it lifts, finish the rep and rest.',
      anchor: { landmark: 'lumbar', pose: 'end' }, zoom: 'low-back', claim: CL.back },
    // Q-W2-12: handlingMistake 'Craning your neck to look at your legs' (c8) merged here, its fix added
    { key: 'neck', label: 'Eyes up', detail: "Stare straight up at the ceiling. Don't crane your neck to look at your legs.",
      anchor: { landmark: 'head', pose: 'end' }, zoom: 'neck', claim: CL.c8 },
  ],
  feel,
  zooms,
  chips: ['low-back', 'neck', 'feel'],
  copy: {
    setupLine: 'Hand and heel lightly touch the floor without resting. Bring them back slowly, then switch sides.',   // card c4
    mistakeLine: "Don't hold your breath. Breathe in as you reach out, out as you return.",   // card c9
    cueLine: 'Low back on the mat.',
  },
  redFlag: RED_FLAG,
  mistakes: [],   // Q-W2-12 (#379 6628699724): the card's handlingMistakes are posture checkpoints above
  risks: RISKS,
  riskFlags: ['back'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/dead_bug.json', rev: 1 },
};
