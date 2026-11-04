// LIB-SHIP W1: the How-to content of lib_plank (forearm plank), golden B's HowToContent shape
// (layers/exercises/machine_chest_press.howto.mjs, barbell_back_squat.howto.mjs). Every shown string restates a claim of
// the research card docs/research/howto/cards/plank.json (cited in its field's claim, cN = card claim id).
// Handling: none (card grip note: hand archetype none, forearm plank, no hand zoom).
// Feel (W2 panel #6633524031, L4): the card's only primary, `core`, is drawn as Main on the abs and obliques, the two
// regions c10 names as working muscles (rectus abdominis, obliques) and the intro line's "front and sides of the belly".
// C2 refuses `core` as a drawn muscle id (the map paints it on the serratus), so the two regions stand for it. The card's
// secondary lists the same two, so feel.secondary is empty.
//
// Additions to the architecture's types, used as golden B uses them:
//   FeelSpec.textOnly   muscles named in the text, never painted (barbell_back_squat)
//   ZoomSpec.callout    one label per crop ({ text, anchor }), the zoom shell's shape (lib_dumbbell_biceps_curl)
//   stills              still poses for the posture crops, built from the plate spec's own poses
import plateSpec from '../specs/plank.mjs';
import { landmarksOf } from '../engine.mjs';
import { RED_FLAG } from '../../layers/howto/shared.mjs';
export { RED_FLAG };

/* ---------------------------------------------------------------- sources (the card's sources) ------------------- */
export const SOURCES = {
  'ace-plank': { cite: 'Front Plank (ACE Exercise Library)', url: 'https://www.acefitness.org/resources/everyone/exercise-library/32/front-plank/',
    kind: 'guideline', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'schoenfeld-2014': { cite: 'An electromyographic comparison of a modified version of the plank with a long lever and posterior tilt versus the traditional plank exercise (2014)', url: 'https://pubmed.ncbi.nlm.nih.gov/25325773/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-22', use: 'DATA' },
  'cortell-2017': { cite: 'Influence of Scapular Position on the Core Musculature Activation in the Prone Plank Exercise (2017)', url: 'https://pubmed.ncbi.nlm.nih.gov/27787465/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-22', use: 'DATA' },
  'harvard-plank': { cite: 'Try this move for better core strength (Harvard Health Publishing, 2021)', url: 'https://www.health.harvard.edu/healthy-aging-and-longevity/try-this-move-for-better-core-strength',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  // The back box's own source (shared/back-box.mjs boxClaim), as lib_rope_triceps_pushdown lists it: the card's redFlags 'back'.
  'nhs-back': { cite: 'NHS, Back pain', url: 'https://www.nhs.uk/conditions/back-pain/',
    kind: 'guideline', access: 'full', checked: '2026-10-02', use: 'CONSENSUS', note: 'When back pain needs a check.' },
};

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const CL = {
  c1: C(['CONSENSUS'], ['ace-plank'], 'card c1'),
  c2: C(['CONSENSUS'], ['ace-plank'], 'card c2'),
  c3: C(['CONSENSUS'], ['ace-plank'], 'card c3'),
  c4: C(['CONSENSUS'], ['ace-plank'], 'card c4'),
  c5: C(['CONSENSUS'], ['ace-plank'], 'card c5'),
  c6: C(['CONSENSUS'], ['ace-plank'], 'card c6'),
  c7: C(['CONSENSUS'], ['ace-plank'], 'card c7'),
  c8: C(['CONSENSUS'], ['ace-plank'], 'card c8'),
  c10: C(['DATA'], ['cortell-2017', 'schoenfeld-2014'], 'card c10'),
  c11: C(['DATA'], ['cortell-2017'], 'card c11'),
  setupLine: C(['CONSENSUS'], ['ace-plank'], 'card c1, c3'),
  cueLine: C(['CONSENSUS'], ['ace-plank'], 'card c5, c4'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// Built from the plate spec's own held pose (no new geometry beyond what the card names):
//   sag   (card zoom hip-line Wrong, c4 "sagging low back"): the low back arches (lumbar extension SAG); the forearms and
//         toes stay on their floor spots, so root, pelvis tilt and ankle are solved as the spec solves its Mistake.
//         How far it sags is a drawing choice (the card gives no number), as the spec's HIKE_HIP is.
//   off   (card zoom shoulder-stack Wrong, c5 "not over the elbows"; handlingMistakes[2] "shoulders drifting away from
//         the elbows"): the body slides forward over the fixed forearms until each upper arm leans OFF_ELBOW deg forward
//         of the plumb line (the shoulder away from its elbow, the body kept straight, the toe tips on the floor, solved
//         as the sag). The elbow and the forearm stay on their floor spots (reach IK, the spec's own targets). W2 panel
//         (#6633524031): the shrug is not drawn (it reads only as this drift), so the Wrong label names the drift and
//         the shrug stays a text checkpoint (posture 'shoulders', c5).
// DRAWING VALUES (D-SHIP-DRAWVAL, #376 6614695581; precedent D-LIB7-2 and golden B's machine_chest_press seatDrop): SAG 20 deg
// and OFF_ELBOW 25 deg are Wrong-pose sizes no card gives; no number from them appears in user copy; the layers panel
// judges them. OFF_ELBOW 25 deg is rope_triceps_pushdown's spec MIS_SHOULDER (its upper arm swung off the plumb line).
const H = 1.75, SAG = 20, OFF_ELBOW = 25;
const END = plateSpec.poses.end, LE = landmarksOf(END, H), SH = LE['shoulder.r'], TOE = LE['toe.r'];
function solve(p0, make, res, iters = 30) {   // Newton with finite differences (the spec's own solver)
  const keys = Object.keys(p0); const p = { ...p0 };
  const f = q => res(landmarksOf(make(q), H));
  for (let it = 0; it < iters; it++) {
    const r = f(p); if (Math.hypot(...r) < 1e-6) break;
    const J = keys.map(k => { const d = 1e-5, q = { ...p, [k]: p[k] + d }; return f(q).map((v, i) => (v - r[i]) / d); });
    const n = keys.length, A = Array.from({ length: n }, (_, i) => [...keys.map((_, j) => J[j][i]), -r[i]]);
    for (let c = 0; c < n; c++) {
      let m = c; for (let i = c + 1; i < n; i++) if (Math.abs(A[i][c]) > Math.abs(A[m][c])) m = i;
      [A[c], A[m]] = [A[m], A[c]];
      for (let i = 0; i < n; i++) if (i !== c) { const k = A[i][c] / A[c][c]; for (let j = c; j <= n; j++) A[i][j] -= k * A[c][j]; }
    }
    keys.forEach((k, i) => { p[k] += A[i][n] / A[i][i]; });
  }
  return p;
}
const sagPose = q => ({ ...END, root: { at: [0, q.y, q.z], tilt: q.tilt }, trunk: -SAG, ankle: q.ankle });
const SQ = solve({ y: END.root.at[1] - 0.05, z: END.root.at[2], tilt: END.root.tilt - 10, ankle: 10 }, sagPose,
  lm => [lm['shoulder.r'][1] - SH[1], lm['shoulder.r'][2] - SH[2], lm['toe.r'][1], lm['toe.r'][2] - TOE[2]]);
// off: the shoulder target OFF_ELBOW deg forward of the plumb over the held elbow (+z is toward the head), the body
// straight (END's trunk, hip, knee), the toe tips on the floor; root y, z and pelvis tilt solved
const EL = LE['elbow.r'], L_UA = Math.hypot(SH[1] - EL[1], SH[2] - EL[2]), R = Math.PI / 180;
const SH_OFF = [EL[1] + L_UA * Math.cos(OFF_ELBOW * R), EL[2] + L_UA * Math.sin(OFF_ELBOW * R)];
const offPose = q => ({ ...END, root: { at: [0, q.y, q.z], tilt: q.tilt } });
const OQ = solve({ y: END.root.at[1], z: END.root.at[2] + 0.1, tilt: END.root.tilt }, offPose,
  lm => [lm['shoulder.r'][1] - SH_OFF[0], lm['shoulder.r'][2] - SH_OFF[1], lm['toe.r'][1]]);
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  sag: { pose: sagPose(SQ) },
  off: { pose: offPose(OQ) },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
const zooms = [
  {
    key: 'hip-line', chip: 'Hip line', heading: 'Hip line', kind: 'posture',
    // zoom shell (render/closeup/crop.mjs): the Wrong is the sag still drawn over the right pose (not solid), so its
    // anchor reads the sagged pose ('mistake'). W2 panel (#6633524031, L5): the crop runs from the shoulders to the heels
    // with the floor line, centred left of the right hip (plate px: heel x 22, shoulder x 274, elbow x 274, floor
    // y 339); 300 px shows the heels, the shoulders over the forearms, and the floor.
    // The straight shoulder-to-heel reference (c4, the plate's plank line, plank.mjs datum[0]) is a 'spine' guide on the
    // right pose's joints, drawn over the figure in both halves: in the Wrong the sagging hips fall below it. (The plate's
    // datum, kept by the option datumZooms, is drawn under the figure and hidden by it at this size.) The guide's stroke
    // needs the closeup css option `spine` on plank's record (pilot-a.closeups.mjs); without it the path is not seen.
    crop: { center: { at: 'hip.r', pose: 'right', off: [-24, 17] }, sizePx: 300 },
    guides: [{ kind: 'spine', from: { at: 'heel.r', pose: 'end' }, to: { at: 'shoulder.r', pose: 'end' }, extend: [0.06, 0.06] }],
    right: 'end',
    wrong: { base: 'end', pose: stills.sag.pose, solid: false },
    callout: {
      right: { text: 'Hips level', anchor: 'hip.r' },
      wrong: { text: 'Low back sags', anchor: { at: 'lumbar', pose: 'mistake' } },
    },
    caption: {
      right: 'No sagging low back, no hiked hips.',
      wrong: 'Low back sagging.',
    },
    alt: {
      right: 'Side view, forearm plank. Shoulders, hips and heels on one straight line, knees straight.',
      wrong: 'Side view, forearm plank. The low back sags, so the hips drop below the shoulder-to-heel line.',
    },
  },
  {
    key: 'shoulder-stack', chip: 'Shoulders', heading: 'Shoulder stack', kind: 'posture',
    // zoom shell: crop centre on the right pose's shoulder for both halves; the Wrong is the off still drawn alone (solid).
    crop: { center: { at: 'shoulder.r', pose: 'right', off: [0, 10] }, sizePx: 110 },
    right: 'end',
    wrong: { base: 'end', pose: stills.off.pose, solid: true },
    callout: {
      right: { text: 'Over elbows', anchor: 'elbow.r' },
      wrong: { text: 'Not over elbows', anchor: 'shoulder.r' },   // card zoom wrong (c5), the drawn drift
    },
    caption: {
      right: 'Shoulders straight over the elbows.',
      wrong: 'Shoulders not over the elbows.',   // card zoom wrong (c5) without the undrawn shrug
    },
    alt: {
      right: 'Side view, forearm plank. Each shoulder sits straight above its elbow, forearm flat on the floor.',
      wrong: 'Side view, forearm plank. The shoulders drift away from the elbows, no longer over them.',   // card c5, handlingMistakes[2]
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [   // the card's primary core, drawn on the two regions c10 names (header note)
    { muscleId: 'abs', plain: 'The front of the belly works.', claim: CL.c10 },
    { muscleId: 'obliques', plain: 'The sides of the belly work.', claim: CL.c10 },
  ],
  secondary: [],
  watch: [
    { muscleId: 'lower_back', plain: 'Pain in the low back means stop.' },
  ],
  feelLine: 'You should feel this in the front and sides of your belly.',
  rows: [
    // The card's first row (front and sides of the belly) has no fix, so it is left out: the feel line says it.
    { key: 'low-back', where: 'Pain in the low back', at: { muscles: ['lower_back'] },
      means: 'A sign to stop.',   // c8: low-back pain during the plank means stop
      fix: 'Stop the exercise.',
      redFlag: 'back', claim: CL.c8 },
  ],
  libraryDiff: { add: ['obliques'], why: 'Both EMG studies measure oblique activity during the prone plank (card c10).' },
  claim: CL.c10,
};

/* ------------------------------------------------------------------------------------------------ risks ---------- */
const RISKS = [
  { key: 'sag', text: 'Low back sagging (arching) during the hold.', claim: CL.c4 },
  { key: 'back-pain', text: 'Low-back pain during the hold: stop.', claim: CL.c8 },
];

export default {
  schema: 1,
  id: 'lib_plank',
  rev: 1,
  plate: plateSpec,
  handling: { archetype: 'none', why: 'D-SHIP-GRIP (b2): the card archetype.hand is none (forearm plank); its handContact (c1) is on the setup line.' },
  contacts: ['floor-body'],
  setup: [
    { kind: 'position', text: 'Lie face down, elbows under your shoulders, palms down.', claim: CL.c1 },
    { kind: 'brace', text: 'Straighten your legs, pull your toes up, brace your trunk.', claim: CL.c2 },
    { kind: 'position', text: 'Lift slowly, trunk and legs stiff.', zoom: 'hip-line', claim: CL.c3 },
    { kind: 'position', text: 'Hold for the set time and keep breathing.', claim: CL.c6 },
    { kind: 'finish', text: 'Lower yourself down with the body still stiff.', claim: CL.c7 },
  ],
  posture: [
    // Q-W2-12: handlingMistake 'Shrugging' (c5) merged here; its fix is this detail and its claim is this claim
    { key: 'shoulders', label: 'Shoulders over elbows', detail: 'Shoulders over the elbows, no shrug.',
      anchor: { landmark: 'shoulder.r', pose: 'end' }, zoom: 'shoulder-stack', claim: CL.c5 },
    // Q-W2-12: handlingMistakes 'Hips hiked up' (c4, c13) and 'Low back sags' (c4, c2, c14) merged here, their fixes added
    { key: 'hips', label: 'Hips level', detail: "The low back does not sag, and the hips are not hiked. Don't bend at your hips. Brace your trunk. Can't hold it? Rest on your knees.",
      anchor: { landmark: 'buttock', pose: 'end' }, zoom: 'hip-line', claim: C(['CONSENSUS'], ['ace-plank', 'harvard-plank'], 'card c4, c13, c2, c14') },
    { key: 'knees', label: 'Knees straight', detail: 'Knees straight.',
      anchor: { landmark: 'knee.r', pose: 'end' }, claim: CL.c4 },
    { key: 'harder', label: 'Harder version', detail: 'Tilt the pelvis backward and draw the shoulder blades together.',
      anchor: { landmark: 'hip.r', pose: 'end' }, claim: CL.c11 },
  ],
  feel,
  zooms,
  chips: ['hip-line', 'shoulder-stack', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'Elbows under your shoulders, palms down. Lift slowly and keep trunk and legs stiff.',
    mistakeLine: 'Keep the hips level: no sagging low back, no hiked hips.',
    cueLine: 'Shoulders over elbows, hips level.',
  },
  redFlag: RED_FLAG,
  mistakes: [],   // Q-W2-12 (#379 6628699724): the card's handlingMistakes are posture checkpoints above
  risks: RISKS,
  riskFlags: ['back'],
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/plank.json', rev: 1 },
};
