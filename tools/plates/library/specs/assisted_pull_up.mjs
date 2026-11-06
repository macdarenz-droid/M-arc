// Assisted pull-up (machine, kneeling, overhand), side view, figure faces the machine (screen right). LB1, mode H,
// tier A, kneel pose-class anchor (library plan 2.2), first user of the `assistMachine` composer.
// View: side (card plate.view, census view). The checkpoints (knees on the pad, shoulders set, chin over the bar) and
// the fault (a half rep: the arms never straighten at the bottom) are all sagittal.
// Source: docs/research/howto/cards/assisted_pull_up.json (claude/libht-research). Claims used: c1 (overhand, about
// shoulder width or a little wider; knees on the pad, the pad sinks until the arms are straight), c2 (chest up at the
// top), c3 (chin over the bar, then lower to fully straight arms), c7 (shoulder blades down and back, elbows down
// toward the ribs), c8 (the named faults: the partial rep first), c9 (tempo: brief pause at the top, 3-4 s down).
// Drawn order (ruling D-LIB9a-NOTE Q2): the spec's start is the card's end (chin over the bar) and the spec's end is the
// card's start (the straight-arm hang). The engine builds the Mistake as the end pose plus an override and outlines what
// differs from the end pose, drawn over the end figure, so a bottom-of-rep fault reads only against a hang end, as on
// leg_press. This differs on purpose from pull_up, which draws the top solid: this card's fault is at the bottom.
// Pose map for the card's facts: card plate.end = spec 'start', card plate.start = spec 'end', Mistake = 'mistake'.
// Clone source: pull_up (golden A, bc0f378): bar end-on, grip IK.
// Kneel class (plan 2.2, probe C): no contact IK for the knees. The machine is driven by named pad states (PAD_TOP, one
// per pose); the roots below were solved once so each knee sits one kneecap radius over its pad and 6 cm behind the
// pad's front edge, and are written as constants, so a pose change that lifts a knee off its pad turns the `checks`
// planes red.
// Geometry decisions:
//  - Bar 2.07 m (32 mm, end-on), grips +-27 cm: 54 cm apart, a little wider than the 45 cm shoulder-joint width (c1).
//  - Start (the top): chin 5 cm over the bar top (c3), chest up with a small lean back (tilt -4, trunk -6, c2), elbows
//    driven down to the ribs (c7), shoulder blades down and back (scap elev -3, pro -3), root 1.50 m.
//  - End (the hang): elbows 8.5 deg (straight, as pull_up's hang), root 0.947 m. Thighs near vertical (hip 4), knees
//    92 deg, the shins lie back along the pad, the feet hang off its rear edge.
//  - The pad rises with the lifter on its lever; the pivot sits half-way between the top and hang lever heights, so the
//    knees keep the same distance from the tower at the bottom and at the top.
//  - Mistake (card plate.mistake, c8): the half hang. The lowering stops with the elbows about 90 deg bent, the pad
//    part-way up. The trunk is the hang's (tilt 0, trunk 0), so it cannot read as a swing (c8); the knees sit further
//    from the tower only because the pad, mid-way on its lever arc, is further from the pivot line.
//    LIB-PLATEFIX-3 item 2 (#384 6653062201 R5 [3,4,3]; ruled #405 6682844211): the elbow is 90 deg (was 106), the root
//    and pad re-solved for it as above (root 1.1441 / -0.1155, pad top 0.6674), the IK pole [0.2, -1, 0.5] puts the
//    fault elbow 21.3 px in front of the solid arm (was 14.9), and the whole bent arm (upper arm, elbow cap, forearm,
//    fist) is drawn as its own red dashed outlines over the solid figure (bayesian_cable_curl's misArm form), so it no
//    longer merges into the changed-parts outline. The fault wrist stays on the solid wrist: both hands hold the bar.
import { assistMachine, KNEE_R, ASSIST_ITEMS } from '../eq/assistMachine.mjs';
import { perItem } from '../eq/parts.mjs';
import { bodyShapes, fk, normPose, resolve } from '../engine.mjs';

const H = 1.75;
const BAR = [0, 2.07, 0];
const BAR_R = 0.016, BAR_TOP = BAR[1] + BAR_R;
const GX = 0.27;
const LEGS = { hip: 4, knee: 92, ankle: -35 };
const grip = pole => ({ l: { at: [GX, BAR[1], BAR[2]], pole: [pole[0], pole[1], pole[2]] },
  r: { at: [-GX, BAR[1], BAR[2]], pole: [-pole[0], pole[1], pole[2]] } });

// Pad-top heights per pose (m) and the roots solved onto them (knee joint KNEE_R * H over the pad top, 6 cm behind
// the pad's front edge).
export const PAD_TOP = { start: 1.0264, end: 0.4703, mistake: 0.6674 };
const ROOT = { start: [0, 1.50, -0.0847], end: [0, 0.947, -0.0549], mistake: [0, 1.1441, -0.1155] };
const start = { root: { at: ROOT.start, tilt: -4 }, trunk: -6, neck: -14, scap: { elev: -3, pro: -3 }, ...LEGS, reach: grip([0.3, -1, 0]) };
const end = { root: { at: ROOT.end, tilt: 0 }, trunk: 0, scap: { elev: -1, pro: -2 }, ...LEGS, reach: grip([0.5, 0, 0.3]) };
const misBody = { root: { at: ROOT.mistake, tilt: 0 }, trunk: 0, scap: { elev: 0, pro: -1 }, reach: grip([0.2, -1, 0.5]) };
export const MIS_ELBOW = 90;   // deg, the half hang's elbow (R5 fix "elbow about 90°"; c8 gives no number: unsourced)

// The faulty arm on top (bayesian_cable_curl's misArm, copied: D-LIB15-CLONE): dashed outlines of the bent upper arm,
// elbow cap, forearm and fist, from the engine's own side-view shapes of the Mistake pose.
const cr = (ps, k = 8) => {
  const n = ps.length, g = i => ps[(i + n) % n], out = [];
  for (let i = 0; i < n; i++) {
    const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2);
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    for (let j = 0; j < k; j++) { const t = j / k, u = 1 - t;
      out.push([0, 1].map(d => u * u * u * p1[d] + 3 * u * u * t * c1[d] + 3 * u * t * t * c2[d] + t * t * t * p2[d])); }
  }
  return out;
};
const MIS_ARM = (() => {
  const bd = { height: H }, probe = { view: 'side', near: 'r', pxm: 1000, P: w => [w[2] * 1000, -w[1] * 1000] };
  const keys = ['upper.r', 'elbowcap.r', 'fore.r', 'fist.r'];
  return bodyShapes(fk(resolve(normPose({ ...end, ...misBody }, bd), bd).q, bd), probe).filter(sh => keys.includes(sh.key))
    .map(sh => (sh.key.includes('cap') ? sh.poly : cr(sh.poly, sh.key.startsWith('fist') ? 4 : 8)).map(([x, y]) => [0, -y / 1000, x / 1000]));
})();

// Machine: pad 32 cm long, 8 cm thick, on a 6 cm bracket; lever 62 cm, pivot half-way between the top and hang lever
// heights; the cable leaves the lever 5 cm from the pivot.
const PIVOT = [0, 0.6084, 0.4291];
const GHOSTS = 2;
export const MACHINE = { pivot: PIVOT, lever: 0.62, bracket: 0.06, pad: [0.32, 0.08], padBack: 0.16, attach: 0.05, padTop: PAD_TOP,
  ghosts: GHOSTS, tower: [PIVOT[2] + 0.03, PIVOT[2] + 0.43], h: 2.28, bar: BAR, step: 0.42,
  stack: { plates: 14, load: 6, lift0: 0.03 }, floor: [-0.62, PIVOT[2] + 0.55], attachZ: PIVOT[2] - 0.05 };
const kneePlane = pose => ({ landmark: 'knee.r', plane: { point: [0, PAD_TOP[pose] + KNEE_R * H, 0], normal: [0, 1, 0] }, pose, tol: 1 });

export default {
  id: 'assisted_pull_up', name: 'Assisted Pull-up', view: 'side', facing: 'right',
  camera: { fit: true },
  poses: { start, end },
  equipment: [
    ...perItem(assistMachine(MACHINE), ASSIST_ITEMS),
  ],
  checks: [
    kneePlane('start'), kneePlane('end'), kneePlane('mistake'),   // knees on the pad, in every drawn pose
    { landmark: 'chin', above: { point: [0, BAR_TOP + 0.045, 0], normal: [0, 1, 0] }, pose: 'start' },                  // chin clearly over
  ],
  ghosts: { count: GHOSTS, parts: ['trunk', 'leg.r', 'pad'] },
  trace: { point: 'chin', trim: [18, 8] },
  datum: [{ y: BAR_TOP, from: 20, to: 'start:chin' }],
  callouts: [
    { key: 'pad', text: 'Knees<br>on pad', anchor: { at: 'knee.r', off: [-6, 10] }, box: { left: 40, top: 294 }, cue: 'Kneel on the pad and let it sink until the arms are straight.' },
    { key: 'set', text: 'Shoulders<br>set', anchor: 'shoulderTop.r', cue: 'Draw the shoulder blades down and back before the elbows bend.' },
    { key: 'chin', text: 'Chin over<br>bar', anchor: { at: 'chin', pose: 'start' }, cue: 'Pull until the chin clears the bar, then lower to straight arms.' },
  ],
  tempo: [{ phase: 'Lower', s: 3, move: true }, { phase: 'Pull', s: 2, move: true }, { phase: 'Hold', s: 1 }],
  mistake: {
    pose: misBody,
    parts: ['torso', 'head', 'leg.r', 'pad'],   // the arm is drawn whole by MIS_ARM below (item 2)
    guides: [
      ...MIS_ARM.map(pts => ({ kind: 'dashed', pts: [...pts, pts[0]] })),
      // the missing range: from the half hang down to the straight-arm hang, behind the back
      { kind: 'arrow', from: { at: 'sacrum', pose: 'mistake', off: [-18, 0] }, to: { at: 'sacrum', pose: 'end', off: [-18, 0] } },
    ],
    tells: [
      { key: 'partial', text: 'Arms<br>bent', anchor: { at: 'elbow.r', pose: 'mistake' }, box: { left: 58, top: 120 }, cue: 'The arms never straighten at the bottom: a half rep.' },
      { key: 'high', text: 'Pad<br>stays up', anchor: { at: 'knee.r', pose: 'mistake', off: [-30, 14] }, box: { left: 26, top: 294 }, cue: 'The pad never sinks to the dead hang.' },
    ],
  },
  alt: 'Assisted pull-up, side view. Kneeling on the machine pad, overhand grip a little wider than the shoulders. From the chin over the bar, the body lowers slowly to a straight-arm hang with the knees on the pad.',
};
