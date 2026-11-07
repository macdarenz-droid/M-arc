// LIB-SHIP W7: the How-to content of lib_v_up, golden B's HowToContent shape (as lib_crunch). Every shown string
// restates a claim of the research card docs/research/howto/cards/v_up.json (cited in its field's claim, cN = card claim id).
// Handling: none, D-SHIP-GRIP (b2): the card archetype.hand is none; its handContact (c1, c3: arms above the head, then
// reaching toward the toes) is on setup steps 2 and 4 and the posture line 'reach'.
// Spec pose names: the spec's `start` is the V (the card's plate.end) and its `end` the lying pose (the card's
// plate.start; the spec checks the low back on the floor at 'end').
// No variant line (equipment 'Bodyweight').
//
// D-TEXT-GOLDEN (claim -> visible slot; posture checkpoints are kept in Q-W2-12 form as well):
//   card posture 'Lift legs and torso together' (c3)            -> plate cue 'reach', setup 4 (W7 printed)
//   card posture 'Lead with your upper body' (c7)               -> copy.mistakeLine (its fix), setup 4 (W7 printed)
//   card posture 'Keep your legs as straight as you can' (c8)   -> plate cue 'legs', setup 5 (W7 printed)
//   card posture 'Lower back flat on the floor' (c5, c4)        -> zoom 'low-back' Right, plate cue 'lowback', copy.setupLine
//   card posture 'Return with your heels a few inches off' (c4) -> copy.setupLine, setup 5 (W7 printed)
//   card posture 'Easier: ...' (c10)                            -> left off (D-TEXT-PROGRESSION)
//   handlingMistake 'Lower back arching' (c6, c5, c2)           -> zoom 'low-back' Wrong, feel rows 'hips' and 'low-back', risks 'arch'
//   handlingMistake 'Legs flopping around' (c9)                 -> copy.mistakeLine (a fault, with its fix), setup step 1 (its fix), risks 'legs' (W7 printed)
//   handlingMistake 'Legs starting the lift' (c7)               -> copy.mistakeLine (a fault, with its fix), risks 'legs' (W7 printed)
//   card zoom low-back (M, drawn as DV: D-PFC-ROUND1 L5)         -> zoom 'low-back'
//   card zoom top-reach (T, D-SHIP-TEXTZOOM: its Wrong "legs flopping around" is a motion fault no still shows)
//                                                               -> Right: plate cues 'reach' and 'legs', setup 4; Wrong: copy.mistakeLine, risks 'legs' (W7 printed)
import plateSpec from '../specs/v_up.mjs';
import { landmarksOf, fk, resolve, normPose, bodyShapes } from '../engine.mjs';
import { RED_FLAG } from '../../layers/howto/shared.mjs';
export { RED_FLAG };

/* ---------------------------------------------------------------- sources (the card's sources) ------------------- */
export const SOURCES = {
  'fv-vup': { cite: 'Ultimate V-Ups: Strengthen Your Core and Sculpt Your Abs (Fitness Volt)', url: 'https://fitnessvolt.com/24111/v-up/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'wh-vup': { cite: "How To Do V-Ups With Proper Form, According To A Certified Trainer (Women's Health)", url: 'https://www.womenshealthmag.com/fitness/a26977658/v-ups/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'ace-vup': { cite: 'How To Do V-Ups, Exercise Library (ACE)', url: 'https://www.acefitness.org/resources/everyone/exercise-library/242/v-ups/',
    kind: 'guideline', access: 'full', checked: '2026-10-22', use: 'WEAK' },
  'schoffstall-2010': { cite: 'Electromyographic response of the abdominal musculature to varying abdominal exercises (2010)', url: 'https://pubmed.ncbi.nlm.nih.gov/21088553/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-22', use: 'DATA' },
  // The back box's own source (shared/back-box.mjs boxClaim), as lib_plank lists it: the card's redFlags 'back'.
  'nhs-back': { cite: 'NHS, Back pain', url: 'https://www.nhs.uk/conditions/back-pain/',
    kind: 'guideline', access: 'full', checked: '2026-10-02', use: 'CONSENSUS', note: 'When back pain needs a check.' },
};

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const FV = 'fv-vup', WH = 'wh-vup';
const CL = {
  c1: C(['CONSENSUS'], [FV, WH], 'card c1'),
  c2: C(['CONSENSUS'], [FV], 'card c2'),
  c3: C(['CONSENSUS'], [FV, WH], 'card c3'),
  c4: C(['CONSENSUS'], [FV, WH], 'card c4'),
  c5: C(['CONSENSUS'], [FV], 'card c5'),
  c6: C(['CONSENSUS'], [WH], 'card c6'),
  c7: C(['CONSENSUS'], [WH], 'card c7'),
  c9: C(['CONSENSUS'], [FV], 'card c9'),
  c11: C(['CONSENSUS'], [FV], 'card c11'),
  c13: C(['WEAK'], ['ace-vup'], 'card c13'),
  back: C(['CONSENSUS'], [FV, WH], 'card c5, c4, c6, c2'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: arch (card zoom low-back Wrong, c6 "lower back arched off the floor"): the lying pose
// with the pelvis tipped ARCH_TILT forward and L3 taking it back (the thorax keeps its angle, so the arms, the head and
// the shoulders are unchanged); root y, root z and L3 solved (Newton) so the buttock stays on the floor and the near
// shoulder keeps its place; the hip takes the tip back so the legs keep their angle to the floor. The spec's own Mistake
// solve (specs/v_up.mjs archAt, ARCH), copied, with a larger tilt, drawn solid so the body itself lifts off the floor
// (PFC fix round, D-PFC-ROUND1 #394 6701001868 L5; hollow_body_hold's low-back form). Its guide is the spec's gap mark
// (specs/v_up.mjs gapBot, gapTop, `underside`, copied): a dashed path (lib_crunch's form) from the floor up to the arched
// pose's drawn torso underside at its lumbar.
// DRAWING VALUES (D-SHIP-DRAWVAL, #376 6614695581; precedent D-LIB7-2 and golden B's machine_chest_press seatDrop):
// ARCH_TILT 38 deg (the spec's MIS_TILT 14 deg raised so the gap under the low back reads at panel size, as
// hollow_body_hold's) is a Wrong-pose size no card gives; the low-back crop window (centre offset, sizePx) is a drawing
// value; no number from them appears in user copy; the layers panel judges them.
const H = 1.75, LYING = plateSpec.poses.end, ARCH_TILT = 38;
const F = LYING.trunk.flex, LM_E = landmarksOf(LYING, H), SH_E = LM_E['shoulder.r'];
const archAt = ([y, z, l3]) => ({ ...LYING, hip: LYING.hip + ARCH_TILT,
  trunk: { flex: [F[0], l3, F[2] + F[1] - ARCH_TILT - l3, F[3]] }, root: { at: [0, y, z], tilt: LYING.root.tilt + ARCH_TILT } });
const ARCH_Q = (() => {
  const f = q => { const l = landmarksOf(archAt(q), H); return [l.buttock[1] - LM_E.buttock[1], l['shoulder.r'][1] - SH_E[1], l['shoulder.r'][2] - SH_E[2]]; };
  let q = [LYING.root.at[1], LYING.root.at[2], F[1] - ARCH_TILT];
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
  throw new Error('lib_v_up: the arch does not converge');
})();
const ARCH = archAt(ARCH_Q);
// the gap mark (v_up spec form): the drawn torso underside (world y) at the arched lumbar's floor position z
const SIDE = { view: 'side', near: 'r', pxm: 1, P: w => [w[2], -w[1]] }, BODY = { height: H };
const underside = (p, z) => { const pts = bodyShapes(fk(resolve(normPose(p, BODY), BODY).q, BODY), SIDE, { hand: 'flat' }).find(s => s.key === 'torso').poly; let lo = -Infinity;
  for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; if ((a[0] - z) * (b[0] - z) > 0 || a[0] === b[0]) continue; lo = Math.max(lo, a[1] + (b[1] - a[1]) * (z - a[0]) / (b[0] - a[0])); }
  return -lo; };
const LZ = landmarksOf(ARCH, H).lumbar[2], GAP = [{ kind: 'path', role: 'wrong', pts: [[0, 0, LZ], [0, underside(ARCH, LZ), LZ]] }];
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: LYING },
  arch: { pose: ARCH },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
const zooms = [
  {
    key: 'low-back', chip: 'Low back', heading: 'Low back', kind: 'posture',
    // zoom shell: the window centred off the lying pose's lumbar, framed head to thighs plus the floor (W7 fix round #394
    // L5/L7: widened; `off`, `sizePx` drawing values)
    crop: { center: { at: 'lumbar', pose: 'right', off: [-10, -16] }, sizePx: 120 },
    right: 'end',
    wrong: { base: 'end', pose: ARCH, solid: true },   // DV: the arch still drawn alone (D-PFC-ROUND1 L5; was the plate's Mistake)
    guides: GAP,
    callout: {
      right: { text: 'Back down', anchor: 'lumbar' },
      wrong: { text: 'Back arches', anchor: { at: 'lumbar', pose: 'mistake' } },
    },
    caption: {
      right: 'Lower back flat on the floor, braced.',
      wrong: 'Lower back arched off the floor.',
    },
    alt: {
      right: 'Side view, V-up, lying face up before the lift. The lower back lies flat on the floor.',
      wrong: 'Side view, V-up, lying face up before the lift. The lower back arches up off the floor.',
    },
    feelRow: 'hips',
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'abs', plain: 'The abs at the front of the belly are the target.', claim: CL.c11 }],
  secondary: [{ muscleId: 'obliques', plain: 'The sides of the belly help.', claim: C(['CONSENSUS', 'DATA'], [FV, 'schoffstall-2010'], 'card c11, c12') }],
  watch: [{ muscleId: 'hip_flexors', plain: 'The hip flexors take over when the lower back arches.', claim: CL.c5 }],
  feelLine: 'You should feel this in the front of your belly.',
  rows: [
    // The card's first row (front of the belly) has no fix, so it is left out: the feel line says it.
    { key: 'hips', where: 'Front of the hips', at: { muscles: ['hip_flexors'] },
      means: 'An arched lower back lets your hip flexors take over.',
      fix: 'Keep your lower back flat on the floor.',
      zoom: 'low-back', claim: CL.c5 },
    { key: 'low-back', where: 'Low back', at: { muscles: ['lower_back'] },
      means: 'Arching your back could bring discomfort or pain here.',
      fix: 'Brace, and keep your lower back touching the floor.',
      redFlag: 'back', claim: C(['CONSENSUS'], [WH, FV], 'card c6, c2') },
  ],
  libraryDiff: { add: ['obliques', 'hip_flexors'], why: 'Fitness Volt lists both as secondary; Schoffstall measured more rectus femoris activity than in the crunch (card c11, c12).' },
  claim: CL.c11,
};

/* ------------------------------------------------------------------------------------------------ risks ---------- */
const RISKS = [
  { key: 'arch', text: 'Arching your back could bring serious discomfort or pain in your lower back.', claim: CL.c6 },
  { key: 'speed', text: 'Control your speed and watch your low back to reduce the chance of injury.', claim: CL.c13 },
  // W7 D-TEXT-PRINTED: handlingMistakes 'Legs flopping around' (c9; T top-reach Wrong) and 'Legs starting the lift'
  // (c7) as faults (copy.mistakeLine is not printed); D-PFC-ROUND1 L6: each worded as the handling mistake with the
  // card's fix (was a bare 'is a mistake' with no fix)
  { key: 'legs', text: 'Legs flopping? Press toes together. Legs starting the lift? Lead with your upper body.',
    claim: C(['CONSENSUS'], [FV, WH], 'card c9, c7') },
];

export default {
  schema: 1,
  id: 'lib_v_up',
  rev: 1,
  plate: plateSpec,
  handling: { archetype: 'none', why: 'D-SHIP-GRIP (b2): the card archetype.hand is none; its handContact (c1, c3) is on setup steps 2 and 4 and the posture line reach.' },
  contacts: ['floor-body'],
  setup: [
    // W7 D-TEXT-PRINTED (copy lines and plate cues off the default selection are not printed): the card's steps 1-2 (c1,
    // c9) and 4-5 (c2, c6) merged; card posture 'Lift legs and torso together' (c3), 'Lead with your upper body' (c7)
    // and T top-reach Right (c3) -> step 4; 'Keep your legs as straight as you can' (c8) and 'Return with your heels a
    // few inches off' (c4) -> step 5.
    { kind: 'position', text: 'Lie on your back, legs straight, toes gently pressed together.', claim: C(['CONSENSUS'], [FV, WH], 'card c1, c9') },
    { kind: 'position', text: 'Extend your arms above your head.', claim: CL.c1 },
    { kind: 'brace', text: 'Breathe in, tense your middle, push your pelvis and lower back down.', zoom: 'low-back',
      claim: C(['CONSENSUS'], [FV, WH], 'card c2, c6') },
    { kind: 'position', text: 'Lift legs and torso together, upper body leading, reaching toward your toes.',
      claim: C(['CONSENSUS'], [FV, WH], 'card c3, c7') },
    { kind: 'position', text: 'Legs straight as you can. Return with heels just off the floor.',
      claim: C(['CONSENSUS'], [FV, WH], 'card c8, c4') },
  ],
  posture: [
    { key: 'reach', label: 'Reach to toes', detail: 'Lift legs and torso together, hands reaching toward your toes.',
      anchor: { landmark: 'grip.r', pose: 'start' }, claim: CL.c3 },
    // Q-W2-12: handlingMistake 'Legs starting the lift' (c7) merged here, its fix added
    { key: 'lead', label: 'Upper body first', detail: 'Start the lift with your upper body, not your legs.',
      anchor: { landmark: 'shoulder.r', pose: 'start' }, claim: CL.c7 },
    // Q-W2-12: handlingMistake 'Legs flopping around' (c9) merged here; D-SHIP-TEXTZOOM: card zoom top-reach (c3, c8, c9)
    { key: 'legs', label: 'Legs together', detail: "Keep your legs as straight as you can, toes pressed together. Don't let them flop around.",
      anchor: { landmark: 'knee.r', pose: 'start' }, claim: C(['CONSENSUS'], [FV, WH], 'card c8, c9, c3') },
    // Q-W2-12: handlingMistake 'Lower back arching off the floor' (c6, c5, c2) merged here, its fix added
    { key: 'low-back', label: 'Low back down', detail: 'Lower back flat on the floor as you come down. Brace first, and start with it touching the floor.',
      anchor: { landmark: 'lumbar', pose: 'end' }, zoom: 'low-back', claim: CL.back },
    { key: 'heels', label: 'Heels up', detail: 'Return with your heels a few inches off the floor.',
      anchor: { landmark: 'heel.r', pose: 'end' }, claim: CL.c4 },
  ],
  feel,
  zooms,
  chips: ['low-back', 'feel'],
  copy: {
    setupLine: 'Brace and keep your lower back down. Return with your heels a few inches off the floor.',   // card c2, c4
    mistakeLine: 'Legs flopping around or starting the lift? Press your toes together and lead with your upper body.',   // card c9, c7
    cueLine: 'Reach toward your toes.',
  },
  redFlag: RED_FLAG,
  mistakes: [],   // Q-W2-12 (#379 6628699724): the card's handlingMistakes are posture checkpoints above
  risks: RISKS,
  riskFlags: ['back'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/v_up.json', rev: 1 },
};
