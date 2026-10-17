// Assisted pull-up (machine, kneeling, overhand), side view, figure faces the machine (screen right). LB1, mode H,
// tier A, kneel pose-class anchor (library plan 2.2), first user of the `assistMachine` composer.
// View: side (card plate.view, census view). The checkpoints (knees on the pad, shoulders set, chin over the bar) and
// the fault (a half rep: the arms never straighten at the bottom) are all sagittal.
// Source: docs/research/howto/cards/assisted_pull_up.json (claude/libht-research). Claims used: c1 (overhand, about
// shoulder width or a little wider; knees on the pad, the pad sinks until the arms are straight), c2 (chest up at the
// top), c3 (chin over the bar, then lower to fully straight arms), c7 (shoulder blades down and back, elbows down
// toward the ribs), c8 (the named faults: the partial rep first), c9 (tempo: brief pause at the top, 3-4 s down).
// Clone source: pull_up (golden A): bar end-on, grip IK, the hang drawn as hidden lines under the end figure.
// Kneel class (plan 2.2, probe C): no contact IK for the knees; the pose is set by angles, the root is placed so the
// knee sits on the pad, and a `checks` plane proves the contact (knee joint one kneecap radius over the pad top).
// Geometry decisions:
//  - Bar 2.07 m (32 mm, end-on), grips +-27 cm: 54 cm apart, a little wider than the 45 cm shoulder-joint width (c1).
//  - Start: dead hang, elbows 8.5 deg (straight, as pull_up's start), root 0.944 m. Thighs near vertical (hip 4),
//    knees 92 deg, the shins lie back along the pad, the feet hang off its rear edge.
//  - End: chin 5 cm over the bar top (c3), chest up with a small lean back (tilt -4, trunk -6, c2), elbows driven down
//    to the ribs (c7), shoulder blades down and back (scap elev -3, pro -3), root 1.50 m.
//  - The pad rises with the lifter on its lever; the pivot sits half-way between the start and end lever heights, so
//    the knees keep the same distance from the tower at the bottom and at the top.
//  - Mistake (card plate.mistake, c8): the half hang. The lifter stops the lowering with the elbows about 75 deg bent,
//    the pad still part-way up: the arms never straighten.
import { landmarksOf } from '../engine.mjs';
import { assistMachine, assistGeometry, KNEE_R, ASSIST_ITEMS } from '../eq/assistMachine.mjs';
import { perItem } from '../eq/parts.mjs';

const H = 1.75;
const BAR = [0, 2.07, 0];
const BAR_R = 0.016, BAR_TOP = BAR[1] + BAR_R;
const GX = 0.27;
const LEGS = { hip: 4, knee: 92, ankle: -35 };
const grip = pole => ({ l: { at: [GX, BAR[1], BAR[2]], pole: [pole[0], pole[1], pole[2]] },
  r: { at: [-GX, BAR[1], BAR[2]], pole: [-pole[0], pole[1], pole[2]] } });

const HANG_Y = 0.944, TOP_Y = 1.50, MIS_Y = 1.22;
const hangP = { root: { tilt: 0 }, trunk: 0, scap: { elev: -1, pro: -2 }, ...LEGS, reach: grip([0.5, 0, 0.3]) };
const topP = { root: { tilt: -4 }, trunk: -6, neck: -14, scap: { elev: -3, pro: -3 }, ...LEGS, reach: grip([0.3, -1, 0]) };
const misP = { root: { tilt: -2 }, trunk: -2, neck: -6, scap: { elev: 0, pro: -1 }, reach: grip([0.4, -1, 0.15]) };

// Machine: pad 32 cm long, 8 cm thick, on a 6 cm bracket; lever 62 cm; the cable leaves the lever 5 cm from the pivot.
const PAD = [0.32, 0.08], BRACKET = 0.06, LEVER = 0.62, KNEE_FROM_FRONT = 0.025;
const kneeAt = (p, y) => landmarksOf({ ...p, root: { ...p.root, at: [0, y, 0] } }, H)['knee.r'];
const footY = y => kneeAt(hangP, y)[1] - KNEE_R * H - PAD[1] - BRACKET;
const PIVOT_Y = (footY(HANG_Y) + footY(TOP_Y)) / 2;
const PAD_Z = -0.125;                                  // lever end (bracket) at the bottom and the top of the rep
const PIVOT = [0, PIVOT_Y, PAD_Z + Math.sqrt(LEVER ** 2 - (footY(HANG_Y) - PIVOT_Y) ** 2)];
const M = { pivot: PIVOT, lever: LEVER, bracket: BRACKET, pad: PAD, padBack: PAD[0] / 2, attach: 0.05,
  tower: [PIVOT[2] + 0.03, PIVOT[2] + 0.43], h: 2.28, bar: BAR, step: 0.42, H,
  stack: { plates: 14, load: 6, lift0: 0.03 }, floor: [-0.62, PIVOT[2] + 0.55] };
M.attachZ = PIVOT[2] - 0.05;
// Root that puts the knee one pad-front offset behind the pad's front edge, for a body height y.
function kneelRoot(p, y) {
  const k = kneeAt(p, y), g = assistGeometry(M, k, H);
  return [0, y, g.padTop[1][2] - KNEE_FROM_FRONT - k[2]];
}
const start = { ...topP, root: { ...topP.root, at: kneelRoot(topP, TOP_Y) } };
const end = { ...hangP, root: { ...hangP.root, at: kneelRoot(hangP, HANG_Y) } };
const misBody = { ...hangP, ...misP, root: { ...misP.root, at: kneelRoot({ ...hangP, ...misP }, MIS_Y) } };
const padTopOf = p => assistGeometry(M, landmarksOf(p, H)['knee.r'], H).padTop[0][1];
const PAD_START = padTopOf(start), PAD_END = padTopOf(end), PAD_MIS = padTopOf({ ...end, ...misBody });


export default {
  id: 'assisted_pull_up', name: 'Assisted Pull-up', view: 'side', facing: 'right',
  camera: { fit: true },
  poses: { start, end },
  equipment: [
    ...perItem(assistMachine(M), ASSIST_ITEMS),
  ],
  checks: [
    { landmark: 'knee.r', plane: { point: [0, PAD_START + KNEE_R * H, 0], normal: [0, 1, 0] }, pose: 'start', tol: 1 },   // knees on the pad
    { landmark: 'knee.r', plane: { point: [0, PAD_END + KNEE_R * H, 0], normal: [0, 1, 0] }, pose: 'end', tol: 1 },
    { landmark: 'knee.r', plane: { point: [0, PAD_MIS + KNEE_R * H, 0], normal: [0, 1, 0] }, pose: 'mistake', tol: 1 },
    { landmark: 'chin', above: { point: [0, BAR_TOP + 0.045, 0], normal: [0, 1, 0] }, pose: 'start' },                  // chin clearly over
  ],
  ghosts: { count: 2, parts: ['trunk', 'leg.r', 'pad'] },
  trace: { point: 'chin', trim: [18, 8] },
  datum: [{ y: BAR_TOP, from: 20, to: 'start:chin' }],
  callouts: [
    { key: 'pad', text: 'Knees<br>on pad', anchor: { at: 'knee.r', off: [-6, 10] }, box: { left: 24, top: 296 }, cue: 'Kneel on the pad and let it sink until the arms are straight.' },
    { key: 'set', text: 'Shoulders<br>set', anchor: 'shoulderTop.r', cue: 'Draw the shoulder blades down and back before the elbows bend.' },
    { key: 'chin', text: 'Chin over<br>bar', anchor: { at: 'chin', pose: 'start' }, cue: 'Pull until the chin clears the bar, then lower to straight arms.' },
  ],
  tempo: [{ phase: 'Lower', s: 3, move: true }, { phase: 'Pull', s: 2, move: true }, { phase: 'Hold', s: 1 }],
  mistake: {
    pose: misBody,
    parts: ['torso', 'head', 'arm.r', 'leg.r', 'pad'],
    guides: [
      // the missing range: from the half hang down to the straight-arm hang, behind the back
      { kind: 'arrow', from: { at: 'backMid', pose: 'mistake', off: [-20, 0] }, to: { at: 'backMid', pose: 'end', off: [-20, 0] } },
    ],
    tells: [
      { key: 'partial', text: 'Arms<br>bent', anchor: { at: 'elbow.r', pose: 'mistake' }, box: { left: 40, top: 118 }, cue: 'The arms never straighten at the bottom: a half rep.' },
      { key: 'high', text: 'Pad<br>stays up', anchor: { at: 'knee.r', pose: 'mistake', off: [-4, 12] }, box: { left: 8, top: 300 }, cue: 'The pad never sinks to the dead hang.' },
    ],
  },
  alt: 'Assisted pull-up, side view. Kneeling on the machine pad, overhand grip a little wider than the shoulders. From a straight-arm hang the body rises until the chin clears the bar.',
};
