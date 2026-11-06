// LIB-SHIP W7: the How-to content of lib_hollow_body_hold, golden B's HowToContent shape (as lib_plank, a hold). Every
// shown string restates a claim of the research card docs/research/howto/cards/hollow_body_hold.json (cited in its
// field's claim, cN = card claim id).
// Handling: none, D-SHIP-GRIP (b2): the card archetype.hand is none; its handContact (c1: arms overhead, biceps by the
// ears) is on setup step 2.
// No variant line (equipment 'Bodyweight').
//
// D-TEXT-GOLDEN (claim -> visible slot; posture checkpoints are kept in Q-W2-12 form as well):
//   card posture 'Lower back and hips stay on the floor, crescent' (c3) -> copy.cueLine, plate cue 'lowback', setup 5 (W7 printed)
//   card posture 'Legs straight, off the floor, no higher than 30' (c4, c5, c6) -> zoom 'leg-height' Right, plate cue 'legs'
//   card posture 'Lower your chin and look toward your feet' (c9)  -> copy.setupLine, feel row 'neck' fix (W7: "don't tuck" added)
//   card posture 'Breathe shallowly' (c10)                         -> copy.setupLine, setup 5 (W7 printed)
//   card posture 'Easier: bend your knees' (c11)                   -> left off (D-TEXT-PROGRESSION)
//   handlingMistake 'Legs too low' (c5, c4)                        -> zoom 'leg-height' Wrong, copy.mistakeLine, feel row 'hips' fix
//   handlingMistake 'Lower back arching off the floor' (c7)        -> zoom 'low-back' Wrong, feel row 'low-back', risks 'arch'
//   handlingMistake 'Shoulder blades and head dropping' (c8)       -> risks 'drop' (W7: its fix added)
//   card zooms leg-height (M), low-back (DV)                       -> zooms
//   card zoom head (T: the arm by the ear hides the head)          -> Right: copy.setupLine, feel row 'neck' fix; Wrong: feel row 'neck' means, risks 'neck'
import plateSpec from '../specs/hollow_body_hold.mjs';
import { landmarksOf, fk, resolve, normPose, bodyShapes } from '../engine.mjs';
import { RED_FLAG } from '../../layers/howto/shared.mjs';
export { RED_FLAG };

/* ---------------------------------------------------------------- sources (the card's sources) ------------------- */
export const SOURCES = {
  'bb-hollow': { cite: 'How to Do the Hollow Hold Position for Six-Pack Abs and Stronger Lifts (BarBend)', url: 'https://barbend.com/hollow-hold/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'ggr-hollow': { cite: 'Hollow Hold Workout: Expert Tips (Garage Gym Reviews)', url: 'https://www.garagegymreviews.com/hollow-hold-workout',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'fv-hollow': { cite: 'Hollow Hold: Strengthen Your Core and Hip Flexors Efficiently (Fitness Volt)', url: 'https://fitnessvolt.com/hollow-hold/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  // The back box's own source (shared/back-box.mjs boxClaim), as lib_plank lists it: the card's redFlags 'back'.
  'nhs-back': { cite: 'NHS, Back pain', url: 'https://www.nhs.uk/conditions/back-pain/',
    kind: 'guideline', access: 'full', checked: '2026-10-02', use: 'CONSENSUS', note: 'When back pain needs a check.' },
};

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const BB = 'bb-hollow', GGR = 'ggr-hollow', FV = 'fv-hollow';
const CL = {
  c1: C(['CONSENSUS'], [BB, FV], 'card c1'),
  c2: C(['CONSENSUS'], [BB, GGR], 'card c2'),
  c3: C(['CONSENSUS'], [BB], 'card c3'),
  c7: C(['CONSENSUS'], [BB, GGR, FV], 'card c7'),
  c8: C(['CONSENSUS'], [GGR], 'card c8'),
  c9: C(['CONSENSUS'], [GGR, FV], 'card c9'),
  c10: C(['CONSENSUS'], [FV], 'card c10'),
  c13: C(['CONSENSUS'], [BB, FV], 'card c13'),
  legs: C(['CONSENSUS'], [BB, GGR], 'card c4, c5, c6'),
  back: C(['CONSENSUS'], [BB, GGR, FV], 'card c2, c7'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses (spec start = entry, end = the hold):
//   low   (card zoom leg-height Wrong, c5): the spec's Mistake pose (the legs too low), drawn as the plate's Mistake
//         view draws it (its guide: the arrow down at the shins).
//   arch  (card zoom low-back Wrong, c7 "lower back arched off the floor"): the hold with the pelvis tipped ARCH_TILT
//         forward and L3 taking it back (the thorax keeps its angle, so the lifted shoulders and arms are unchanged);
//         root y, root z and L3 solved (Newton) so the buttock stays on the floor and the near shoulder keeps its place;
//         both hips take the tip back so the legs keep their angle to the floor. The dead_bug spec's own Mistake solve
//         (specs/dead_bug.mjs archAt, ARCH), copied, on this hold.
//         The Wrong's guide is the dead_bug spec's gap mark (specs/dead_bug.mjs gapBot, gapTop, `underside`, copied) as a
//         dashed path (lib_crunch's form) from the floor up to the arched pose's drawn torso underside at its lumbar.
// Card zoom head (c9) is a text checkpoint (D-SHIP-TEXTZOOM; brief: a DV that does not read becomes T): a one-joint neck
//   extension was solved and drawn, but in this side view the near arm lies by the ear over the head (c1), so the
//   head's angle does not read in the crop. Its Right and Wrong are on posture 'head', feel row 'neck' and risks 'neck'.
// DRAWING VALUES (D-SHIP-DRAWVAL, #376 6614695581; precedent D-LIB7-2 and golden B's machine_chest_press seatDrop):
// ARCH_TILT 38 deg is a Wrong-pose size no card gives (the dead_bug spec's MIS_TILT 14 deg on the same floor class,
// raised so the gap reads at panel size; W7 fix round #394 L5: 20 -> 38 so the gap under the low back reads in the
// wider crop; 45 does not converge); no number from them appears in user copy; the layers panel judges them.
// The low-back crop window (centre offset, sizePx) is a drawing value: W7 fix round #394 L5 widened it to shoulders
// to thighs plus the floor.
const H = 1.75, END = plateSpec.poses.end, MIS = plateSpec.mistake.pose, ARCH_TILT = 38;
const SH_E = landmarksOf(END, H)['shoulder.r'], F = END.trunk.flex;
const archAt = ([y, z, l3]) => ({ ...END, hip: END.hip + ARCH_TILT,
  trunk: { flex: [F[0], l3, F[2] + F[1] - ARCH_TILT - l3, F[3]] }, root: { at: [0, y, z], tilt: END.root.tilt + ARCH_TILT } });
const ARCH_Q = (() => {
  const f = q => { const l = landmarksOf(archAt(q), H); return [l.buttock[1] - landmarksOf(END, H).buttock[1], l['shoulder.r'][1] - SH_E[1], l['shoulder.r'][2] - SH_E[2]]; };
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
  throw new Error('lib_hollow_body_hold: the arch still does not converge');
})();
const ARCH = archAt(ARCH_Q);
// the gap mark (dead_bug spec form): the drawn torso underside (world y) at the arched lumbar's floor position z
const SIDE = { view: 'side', near: 'r', pxm: 1, P: w => [w[2], -w[1]] }, BODY = { height: H };
const underside = (p, z) => { const pts = bodyShapes(fk(resolve(normPose(p, BODY), BODY).q, BODY), SIDE, { hand: 'flat' }).find(s => s.key === 'torso').poly; let lo = -Infinity;
  for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; if ((a[0] - z) * (b[0] - z) > 0 || a[0] === b[0]) continue; lo = Math.max(lo, a[1] + (b[1] - a[1]) * (z - a[0]) / (b[0] - a[0])); }
  return -lo; };
const LZ = landmarksOf(ARCH, H).lumbar[2], GAP = [{ kind: 'path', role: 'wrong', pts: [[0, 0, LZ], [0, underside(ARCH, LZ), LZ]] }];
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  low: { pose: MIS },
  arch: { pose: ARCH },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// Zoom shell (pilot-a.closeups.mjs form); `off` and `sizePx` are drawing values.
const zooms = [
  {
    key: 'leg-height', chip: 'Leg height', heading: 'Leg height', kind: 'posture',
    crop: { center: { at: 'knee.r', pose: 'right', off: [10, 0] }, sizePx: 160 },
    right: 'end',
    wrong: { base: 'end', pose: MIS },   // M: the plate's own Mistake, dashed red over the right pose
    guides: plateSpec.mistake.guides,
    callout: {
      right: { text: 'Legs lifted', anchor: 'ankle.r' },
      wrong: { text: 'Legs too low', anchor: { at: 'ankle.r', pose: 'mistake' } },
    },
    caption: {
      right: 'Legs straight, about 15 to 30 degrees off the floor.',
      wrong: 'Legs not lifted high enough.',
    },
    alt: {
      right: 'Side view, hollow hold. The straight legs are lifted clear of the floor at a low angle.',
      wrong: 'Side view, hollow hold. The legs sink lower, not lifted high enough off the floor.',
    },
    feelRow: 'hips',
  },
  {
    key: 'low-back', chip: 'Low back', heading: 'Low back', kind: 'posture',
    crop: { center: { at: 'lumbar', pose: 'right', off: [-6, -24] }, sizePx: 115 },
    right: 'end',
    wrong: { base: 'end', pose: ARCH, solid: true },   // DV: the arch still drawn alone
    guides: GAP,
    callout: {
      right: { text: 'Back down', anchor: 'lumbar' },
      wrong: { text: 'Back arches', anchor: { at: 'lumbar', pose: 'mistake' } },
    },
    caption: {
      right: 'Lower back flat on the floor, no space under it.',
      wrong: 'Lower back arched off the floor.',
    },
    alt: {
      right: 'Side view, hollow hold. The lower back is pressed flat to the floor with no space under it.',
      wrong: 'Side view, hollow hold. The lower back arches up, leaving a space under it.',
    },
    feelRow: 'low-back',
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'abs', plain: 'The abs at the front of the belly hold the trunk still.', claim: CL.c13 }],
  secondary: [{ muscleId: 'obliques', plain: 'The sides of the belly steady the hold.', claim: C(['CONSENSUS'], [FV, GGR], 'card c15') }],
  watch: [{ muscleId: 'hip_flexors', plain: 'The hip flexors at the front of the thigh also work.', claim: C(['CONSENSUS'], [BB, FV], 'card c14') }],
  feelLine: 'You should feel this in the front of your belly.',
  rows: [
    // The card's first row (front of the belly) has no fix, so it is left out: the feel line says it.
    { key: 'hips', where: 'Crease of the hips', at: { muscles: ['hip_flexors'] },
      means: 'Your hip flexors are working overtime.',
      fix: 'Lift your legs off the floor, but no higher than about 30 degrees.',
      zoom: 'leg-height', claim: C(['CONSENSUS'], [BB, FV, GGR], 'card c14, c5, c4') },
    { key: 'low-back', where: 'Low back', at: { muscles: ['lower_back'] },
      means: 'Your lower back is lifting off the floor.',
      fix: 'Stop the set, or use an easier version.',
      zoom: 'low-back', redFlag: 'back', claim: C(['CONSENSUS'], [BB, GGR, FV], 'card c7, c11') },
    { key: 'neck', where: 'Neck', at: { parts: ['neck-left', 'neck-right'] },
      means: 'Your neck is hyperextending.',
      fix: 'Lower your chin and look down at your feet, without tucking it.',   // W7: c9 "don't tuck it" printed
      claim: CL.c9 },
  ],
  libraryDiff: { add: ['obliques', 'hip_flexors'], why: 'Fitness Volt and Garage Gym Reviews name the obliques (card c15); BarBend and Fitness Volt the hip flexors (card c14).' },
  claim: CL.c13,
};

/* ------------------------------------------------------------------------------------------------ risks ---------- */
const RISKS = [
  { key: 'arch', text: 'An arched lower back could lead to injury.', claim: CL.c7 },
  // W7 D-TEXT-PRINTED: handlingMistake 'Shoulder blades and head dropping' fix (c8, lower the limbs and rest) added
  { key: 'drop', text: 'Dropping shoulder blades and head may cause low back pain. Lower your limbs, rest.', claim: CL.c8 },
  { key: 'neck', text: 'Hyperextending your neck could result in neck pain.', claim: CL.c9 },
];

export default {
  schema: 1,
  id: 'lib_hollow_body_hold',
  rev: 1,
  plate: plateSpec,
  handling: { archetype: 'none', why: 'D-SHIP-GRIP (b2): the card archetype.hand is none; its handContact (c1) is on setup step 2.' },
  contacts: ['floor-body'],
  setup: [
    { kind: 'position', text: 'Lie on your back, legs straight, feet together.', claim: CL.c1 },
    { kind: 'position', text: 'Reach your arms overhead, biceps by your ears.', claim: CL.c1 },
    // W7 D-TEXT-PRINTED: the card's steps 3 and 4 (c2) merged to make room for step 5 (copy lines are not printed)
    { kind: 'brace', text: 'Breathe out, pull your ribs down, press your lower back flat.', zoom: 'low-back', claim: CL.c2 },
    { kind: 'position', text: 'Lift your shoulders and legs off the floor and hold.', zoom: 'leg-height', claim: CL.c2 },
    // W7 D-TEXT-PRINTED: card posture 'Lower back and hips stay on the floor, crescent' (c3) and 'Breathe shallowly.
    // Don't hold your breath' (c10)
    { kind: 'brace', text: "Body in a crescent, hips down. Breathe shallowly, don't hold your breath.",
      claim: C(['CONSENSUS'], [BB, FV], 'card c3, c10') },
  ],
  posture: [
    { key: 'crescent', label: 'Crescent shape', detail: 'Lower back and hips stay on the floor, body like a crescent.',
      anchor: { landmark: 'buttock', pose: 'end' }, claim: CL.c3 },
    // Q-W2-12: handlingMistake 'Lower back arching off the floor' (c7) merged here, its fix added
    { key: 'low-back', label: 'Low back down', detail: 'No space under your lower back. Press it down. Stop the set if it lifts.',
      anchor: { landmark: 'lumbar', pose: 'end' }, zoom: 'low-back', claim: CL.back },
    // Q-W2-12: handlingMistake 'Legs too low' (c5, c4) merged here, its fix added
    { key: 'legs', label: 'Legs low', detail: 'Legs straight, off the floor, no higher than about 30 degrees. Not too low: about 15 to 30 degrees.',
      anchor: { landmark: 'knee.r', pose: 'end' }, zoom: 'leg-height', claim: CL.legs },
    // D-SHIP-TEXTZOOM: card zoom head (c9), Right and Wrong
    { key: 'head', label: 'Chin lowered', detail: "Lower your chin and look toward your feet. Don't tuck it. No hyperextended neck.",
      anchor: { landmark: 'chin', pose: 'end' }, claim: CL.c9 },
    // Q-W2-12: handlingMistake 'Shoulder blades and head dropping' (c8) merged here, its fix added
    { key: 'shoulders', label: 'Shoulders up', detail: 'Shoulder blades and head stay up. If they drop, lower your limbs, rest, then do another set.',
      anchor: { landmark: 'shoulder.r', pose: 'end' }, claim: CL.c8 },
    { key: 'breathe', label: 'Breathing', detail: "Breathe shallowly. Don't hold your breath.",
      anchor: { landmark: 'chest', pose: 'end' }, claim: CL.c10 },
  ],
  feel,
  zooms,
  chips: ['leg-height', 'low-back', 'feel'],
  copy: {
    setupLine: "Breathe shallowly and don't hold your breath. Lower your chin toward your feet, but don't tuck it.",   // card c10, c9
    mistakeLine: 'Keep your legs off the floor. Legs too low might stress the hip flexors over the abs.',   // card c5
    cueLine: 'Low back down, body a crescent.',
  },
  redFlag: RED_FLAG,
  mistakes: [],   // Q-W2-12 (#379 6628699724): the card's handlingMistakes are posture checkpoints above
  risks: RISKS,
  riskFlags: ['back'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/hollow_body_hold.json', rev: 1 },
};
