// Dumbbell shrug, FRONT view (card plate.view; a child never changes the view, derive.mjs:19). LIB-13s wave 2 (mode H,
// D-LIB13S-MODES: the dumbbells hang at the sides, a hand place, which is a pose).
// Clone sources (D-LIB9-CLONE, copied, never imported): upright_row (pilot A, front view, standing: the stance, the
//  straight-arm reach and the front-view checks) and barbell_shrug's bytes as approved in panel mx16 @ 01b66192 (the
//  5 cm shrug, its Trace and datum, the Mistake form: bent arms pulling the load up, and the zoom).
// Sources: research card docs/research/howto/cards/dumbbell_shrug.json (research a48b0594):
//  c1  a dumbbell in each hand at the sides (start pose);
//  c2  lift the shoulders straight up as high as possible, then lower them (end pose);
//  c3  the shoulders do the lifting; the arms stay straight while the shoulders rise toward the ears (checkpoint
//      "Straight arms");
//  c4  stand with good posture and a braced trunk; "Stand with the dumbbells in your hands" (checkpoint "Stand tall";
//      the start hand contacts, plateFacts wrist.l and wrist.r);
//  c6  common mistake: the arms not straight and passive (the Mistake: elbows bend to pull the dumbbells up), or the
//      shoulders moving forward or back instead of straight up (checkpoint "Straight up");
//  c11 tempo: about 1 s up, a short pause at the top (1 s, a drawing convention), 2 s down.
// Geometry decisions:
//  Standing (c4): upright_row's stance, mid-soles 36 cm apart (FOOT_X), toes out 17 deg, knees KNEE_SOFT 5 deg soft,
//   pelvis, trunk and neck 0.
//  Shrug: scap.elev SHRUG = 5 cm, the parent's (c10's "slightly longer range" gives no number, so it is not enlarged).
//  Arms (c1, c3): straight (full reach less 0.1 mm), hanging at the sides: the grips GRIP_X 0.26 m out from the midline,
//   at the shoulder's depth, so each dumbbell hangs beside its thigh. 0.26 m is the narrowest grip at which the end-on
//   hex (11.9 cm across) clears the drawn thigh by 2 px in every pose (D-LIB13S-CLEAR; 0.25 m gives 1.10 px).
//  Dumbbells: the vendor dumbbell end-on (neutral grip, the handle pointing at the viewer), drawn on the grip.
//  Mistake (c6): the elbows bend out to the sides and pull the dumbbells M_PULL 15 cm up (the parent's size;
//   illustrative). The tell sits on the dumbbell (grip), the part that moves most in this view.
// Unsourced numbers: SHRUG, KNEE_SOFT, FOOT_X and the toe-out (upright_row's), GRIP_X (the clearance rule), M_PULL.
import { WINTER, REF, landmarksOf } from '../engine.mjs';

const H = 1.75, R = Math.PI / 180;
const FOOT_X = 0.18;                                   // mid-sole lateral offset (upright_row's: the widest the rigid foot allows)
const KNEE_SOFT = 5;                                   // deg: knees soft
const GRIP_X = 0.26;                                   // grip centre lateral offset: the dumbbells beside the thighs (2 px)
const SHRUG = 5;                                       // cm shoulder-girdle elevation at the top (the parent's)
const M_PULL = 0.15;                                   // m, illustrative: the card gives no number
const ARM = (WINTER.upperArm + WINTER.forearm + REF.gripOff) * H - 0.0001;   // straight arm, shoulder to grip centre

const FOOT_Z = REF.mid * H;
const LEG = (() => { const a = WINTER.thigh * H, b = WINTER.shank * H, k = KNEE_SOFT * R; return Math.sqrt(a * a + b * b + 2 * a * b * Math.cos(k)); })();
const ROOT_Y = Math.sqrt(LEG * LEG - (FOOT_X - REF.hjcX * H) ** 2) + WINTER.ankleH * H;
const feet = { l: { at: [FOOT_X, 0, FOOT_Z], toe: [0.3, 0, 1] }, r: { at: [-FOOT_X, 0, FOOT_Z], toe: [-0.3, 0, 1] } };
const base = { root: { at: [0, ROOT_Y, 0], tilt: 0 }, trunk: 0, neck: 0, plant: feet };
const pole = s => [s * 0.3, 0, -1];
function key(elev) {
  const p = { ...base, scap: { elev, pro: 0 } }, S = landmarksOf(p, H)['shoulder.l'], z = S[2];
  const y = S[1] - Math.sqrt(ARM * ARM - (GRIP_X - S[0]) ** 2);
  return { ...p, reach: { l: { at: [GRIP_X, y, z], pole: pole(1) }, r: { at: [-GRIP_X, y, z], pole: pole(-1) } } };
}
const start = key(0);
const end = key(SHRUG);
const START_W = landmarksOf(start, H);
// Mistake (c6): the elbows bend out to the sides, the dumbbells pulled M_PULL higher at the same width.
const mistakePose = (() => { const g = end.reach.l.at, out = s => [s, 0.2, 0];
  return { reach: { l: { at: [GRIP_X, g[1] + M_PULL, g[2]], pole: out(1) }, r: { at: [-GRIP_X, g[1] + M_PULL, g[2]], pole: out(-1) } } }; })();
const level = y => ({ point: [0, y, 0], normal: [0, 1, 0] });
// The faulty dumbbells as dashed hexes (guides: the engine draws moving non-poly equipment only in the end pose), the
// vendor dumbbell's end-on face (11.9 cm across the corners) on each Mistake grip.
const M_HEX = sd => { const g = mistakePose.reach[sd].at; return Array.from({ length: 7 }, (_, k) => [g[0] + 0.0595 * Math.cos(k * Math.PI / 3), g[1] + 0.0595 * Math.sin(k * Math.PI / 3), g[2]]); };
const db = (lm, sd) => ({ type: 'dumbbell', at: lm[`grip.${sd}`], axis: [0, 0, 1], z: 'front', part: `db.${sd}` });

export default {
  id: 'dumbbell_shrug', name: 'Dumbbell Shrug', view: 'front',
  poses: { start, end },
  armsFront: true,
  equipment: [
    { type: 'floor', from: -0.51, to: 0.51 },
    lm => [db(lm, 'l'), db(lm, 'r')],
  ],
  checks: [
    { landmark: 'heel.r', plane: level(0), pose: 'all', tol: 0.5 },
    { landmark: 'ball.r', plane: level(0), pose: 'all', tol: 0.5 },
    // shoulder rise: the end shoulder joint is SHRUG cm above the start one
    { landmark: 'shoulder.r', plane: level(START_W['shoulder.r'][1] + SHRUG / 100), pose: 'end', tol: 0.2 },
    ...['wrist.l', 'wrist.r'].map(landmark => ({ landmark, at: START_W[landmark], pose: 'start', tol: 0.5 })),   // c4 facts: the hands on the dumbbells
  ],
  startParts: ['arm.r'],
  ghosts: { count: 0 },
  trace: { point: 'shoulderTop.r', trim: [0, 0] },
  zoom: { view: 'normal', k: 3.5 },   // D-LIB13S-ZOOM: the 5 cm shrug (shoulderTop.r), the parent's ladder k
  datum: [{ y: 'start:shoulderTop.r', from: 12, to: 'start:shoulderTop.r' }, { y: 'shoulderTop.r', from: 12, to: 'shoulderTop.r', mistake: false }],
  measure: { vertex: 'elbow.l', from: 'shoulder.l', to: 'wrist.l', radius: 18, title: 'Elbow', value: 'straight' },
  callouts: [
    // c3, c6
    { key: 'arms', text: 'Straight arms', anchor: { along: ['elbow.r', 'wrist.r'], t: 0.5, off: [-8, 0] }, cue: 'Let your arms hang straight. Only the shoulders lift.' },
    // c6
    { key: 'up', text: 'Straight up', anchor: 'shoulderTop.l', cue: 'Lift your shoulders straight up and down, not forward or back.' },
    // c4
    { key: 'tall', text: 'Stand tall', anchor: 'chest', cue: 'Stand tall and keep your trunk braced the whole set.' },
  ],
  tempo: [{ phase: 'Lift', s: 1, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Lower', s: 2, move: true }],   // c11
  mistake: {
    pose: mistakePose,
    guides: [
      { kind: 'dashed', pts: M_HEX('l') },
      { kind: 'dashed', pts: M_HEX('r') },
      // one arrow per hand, beside each dumbbell, from its end height up to its faulty height
      { kind: 'arrow', from: { at: 'grip.l', pose: 'end', off: [16, 0] }, to: { at: 'grip.l', pose: 'mistake', off: [16, 0] } },
      { kind: 'arrow', from: { at: 'grip.r', pose: 'end', off: [-16, 0] }, to: { at: 'grip.r', pose: 'mistake', off: [-16, 0] } },
    ],
    tells: [
      // c6 (plate.mistake.what)
      { key: 'elbows', text: 'Elbows bend', anchor: { at: 'elbow.l', pose: 'mistake' }, cue: 'The elbows bend to pull the dumbbells up.' },
      // c6
      { key: 'pull', text: 'Arms pull', anchor: { at: 'grip.r', pose: 'mistake' }, cue: 'The arms lift the weights instead of the shoulders.' },
    ],
  },
  alt: 'Dumbbell shrug, front view. Standing tall with a dumbbell hanging in each hand at the sides on straight arms. Only the shoulders lift straight up toward the ears, pause and lower again. The arms stay straight.',
};
