// Cross-body hammer curl (standing, one dumbbell per hand, neutral grip, one arm at a time), front view.
// View: FRONT (card plate.view = census view "Front view: the curl crosses the body"). The dumbbell's arc across the
// body toward the opposite shoulder (c2, c3) and the shoulders staying level (c5) show only from the front. The figure's
// right arm works (the viewer's left); the left arm hangs with its dumbbell, as at the start.
// Form: research card docs/research/howto/cards/cross_body_hammer_curl.json (research head a8e66f32, F-LB5-1), plate
//  section: start "Standing, feet about shoulder-width (c1); dumbbells in front of you, palms facing the body (c1), elbows
//  slightly bent, about shoulder-width apart (c14); shoulders down and back (c6)"; end "Working elbow bent, dumbbell
//  raised in an arc to near the opposite shoulder (c2); elbow in the same place (c2); wrist straight, palm still facing
//  the body (c5, c7); shoulders level, not shrugged (c5)".
// Clone sources (D-LIB15-CLONE, copied never imported): dumbbell_biceps_curl (pilot A #109 @ ff7c5c4f: the dumbbell use,
//  soft-knee stance solve) and upright_row (pilot A: the front view, the standing base, reach IK with poles).
// Geometry decisions:
//  - Stance: feet FOOT_X off the mid-plane (shoulder width, c1), knees soft (KNEE_SOFT); trunk, pelvis, neck 0; the
//    scapulae set down and back (c6).
//  - Start: both hands in front of the thighs, GRIP0, elbows slightly bent and about shoulder-width apart (c14), palms
//    facing the body (c1): the handle runs across the body (x), so the dumbbell shows side-on from the front.
//  - Elbow in place (c2): the working elbow E is the start elbow; every key pose puts the grip on the forearm sphere about
//    E and the IK pole points at E, so the solved elbow sits on E. The grip travels on that sphere in the plane through E
//    and the start and end grips; `via` keys every 1/SEG of the arc put the ghosts and the Trace on it.
//  - End: the grip on the sphere toward the front of the opposite shoulder (c2 "toward your opposite shoulder").
//  - Neutral grip (c5, c7): the handle stays perpendicular to the forearm in the arc's plane (the thumb leads), so it
//    turns with the forearm and stays side-on (`dumbbell` `axis`).
// Mistake history (D-LIB15-TWIST, F-LB5-1): the earlier pick, the wrist twist, is a forearm rotation the vendor body
//  cannot draw (body.mjs:132); research a8e66f32 moved plate.mistake to the shrug.
// Unsourced numbers (13.3 must-fix 14): FOOT_X, KNEE_SOFT, GRIP0 (start hands), the end point's distance in front of the
//  opposite shoulder, the dumbbells (vendor default), the Mistake's shrug (MIS_SHRUG; c5, c6 give none).
// Callouts, Mistake, tempo: the 3 checkpoints are the callouts (c7, c2, c5); the Mistake is the card's plate.mistake
//  (research a8e66f32: c5, c6, drawable false), drawn against the end pose: the top fault, the arm fully straight at the
//  bottom (c15), is a small elbow bend toward the camera the front view cannot show, so the plate draws the next fault
//  and carries pilot.drawableFault (F7, D-LIB15-F7).
//  Tempo: Curl 1 s, Hold 1 s (c11's drawing convention, LR-33), Lower 2 s (lb5/tempo.json); no Rest.
import { WINTER, REF, landmarksOf, normPose, resolve } from '../engine.mjs';
import { add, mul, norm, sub } from '../eq/parts.mjs';

const H = 1.75, R = Math.PI / 180;
const FOOT_X = 0.14;                                   // mid-sole lateral offset: feet about shoulder width (c1)
const KNEE_SOFT = 5;
const GRIP0 = { x: 0.13, y: 0.80, z: 0.13 };          // start grips: in front of the thighs, elbows soft (c1, c14)
const END_FWD = 0.10;                                  // end target: this far in front of the opposite shoulder joint
const SEG = 8;

const FOOT_Z = REF.mid * H;
const LEG = (() => { const a = WINTER.thigh * H, b = WINTER.shank * H, k = KNEE_SOFT * R; return Math.sqrt(a * a + b * b + 2 * a * b * Math.cos(k)); })();
const ROOT_Y = Math.sqrt(LEG * LEG - (FOOT_X - REF.hjcX * H) ** 2) + WINTER.ankleH * H;
const feet = { l: { at: [FOOT_X, 0, FOOT_Z] }, r: { at: [-FOOT_X, 0, FOOT_Z] } };
const base = { root: { at: [0, ROOT_Y, 0], tilt: 0 }, trunk: 0, neck: 0, scap: { elev: -1, pro: -1 }, wrist: 0, plant: feet };
const hang = s => ({ at: [s * GRIP0.x, GRIP0.y, GRIP0.z], pole: [s * 0.4, -0.2, -1] });
const start = { ...base, reach: { l: hang(1), r: hang(-1) } };
const lm0 = landmarksOf(start, H);
const S = lm0['shoulder.r'], E = lm0['elbow.r'], G0 = lm0['grip.r'];
const L2 = Math.hypot(...sub(G0, E));
const TARGET = add(lm0['shoulder.l'], [0, 0, END_FWD]);
const G1 = add(E, mul(norm(sub(TARGET, E)), L2));
// the arc: G0 -> G1 on the sphere about E, in the plane through E, G0 and G1
const PN = norm([(G0[1] - E[1]) * (G1[2] - E[2]) - (G0[2] - E[2]) * (G1[1] - E[1]), (G0[2] - E[2]) * (G1[0] - E[0]) - (G0[0] - E[0]) * (G1[2] - E[2]), (G0[0] - E[0]) * (G1[1] - E[1]) - (G0[1] - E[1]) * (G1[0] - E[0])]);
const u0 = norm(sub(G0, E)), u1 = norm(sub(G1, E)), ARC = Math.acos(Math.max(-1, Math.min(1, u0[0] * u1[0] + u0[1] * u1[1] + u0[2] * u1[2])));
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const w0 = cross(PN, u0);                              // in-plane, perpendicular to u0, toward u1
const gripAt = t => add(E, mul(add(mul(u0, Math.cos(ARC * t)), mul(w0, Math.sin(ARC * t))), L2));
// IK pole: from the shoulder-grip line toward E (the elbow lands on E)
const poleTo = g => {
  const u = norm(sub(g, S)), e = sub(E, S), k = e[0] * u[0] + e[1] * u[1] + e[2] * u[2];
  return norm(sub(e, mul(u, k)));
};
const keys = Array.from({ length: SEG + 1 }, (_, i) => i / SEG).map(t => ({ ...base, reach: { l: hang(1), r: { at: gripAt(t), pole: poleTo(gripAt(t)) } } }));
const [, ...rest] = keys;
const end = rest.pop(), via = rest;

// The handle: perpendicular to the forearm in the arc's plane (neutral grip, the thumb leading, c5, c7).
const handle = lm => norm(cross(PN, norm(sub(lm['grip.r'], lm['elbow.r']))));
// Mistake (card plate.mistake after F-LB5-1, research a8e66f32, c5, c6): "Working shoulder shrugging as the dumbbell
// rises." Drawn against the end pose: the working (right) shoulder girdle elevates MIS_SHRUG cm (scapula elevation),
// and the arm, held at the end pose's joint angles, rises with it (the dumbbell lifts with the shrug). The left shoulder
// stays set down and back. c5/c6 give no size: MIS_SHRUG is drawn, not sourced (Q-D5-3: never enlarged to pass a check).
const MIS_SHRUG = 5;
const LEVEL_Y = landmarksOf(end, H)['shoulderTop.l'][1];
const endQ = resolve(normPose(end, { height: H }), { height: H }).q;
const mistakePose = { reach: null, shoulder: { l: endQ.sh.l, r: endQ.sh.r }, elbow: { l: endQ.elbow.l, r: endQ.elbow.r },
  scap: { l: { elev: -1, pro: -1 }, r: { elev: -1 + MIS_SHRUG, pro: -1 } } };

// The start dumbbell is dropped from the start layer (it moves), so it is redrawn as a dashed phantom in the end pose
// (pilot A's start-bar method): the side-on outline, heads 7 cm long and 10.3 cm across the flats, handle 13 cm.
const rect = (x0, x1, y, h, z) => [[x0, y - h / 2, z], [x1, y - h / 2, z], [x1, y + h / 2, z], [x0, y + h / 2, z], [x0, y - h / 2, z]];
function startDumbbell(g) {
  const L = pts => ({ type: 'line', cls: 'eq-thin m-line', pts, z: 'front', part: 'startdb' }), hh = 0.119 * 0.866;
  return [L(rect(g[0] - 0.065, g[0] + 0.065, g[1], 0.016, g[2])), L(rect(g[0] - 0.135, g[0] - 0.065, g[1], hh, g[2])), L(rect(g[0] + 0.065, g[0] + 0.135, g[1], hh, g[2]))];
}

export default {
  id: 'cross_body_hammer_curl', name: 'Cross-Body Hammer Curl', view: 'front',
  poses: { start, end, via },
  armsFront: true,
  equipment: [
    { type: 'floor', from: -0.5, to: 0.5 },
    lm => ({ type: 'dumbbell', at: lm['grip.l'], axis: [1, 0, 0], z: 'mid' }),
    lm => ({ type: 'dumbbell', at: lm['grip.r'], axis: handle(lm), part: 'db', z: 'front' }),
    (lm, ctx) => (ctx.pose === 'end' && !ctx.mistake ? startDumbbell(ctx.start['grip.r']) : null),
  ],
  checks: [
    ...['wrist.r', 'wrist.l'].map(landmark => ({ landmark, at: landmarksOf(start, H)[landmark], pose: 'start', tol: 0.5 })),   // a dumbbell in each hand (c1)
    { landmark: 'heel.r', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
    { landmark: 'ball.r', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
    ...['start', 'end'].map(pose => ({ landmark: 'elbow.r', at: E, pose, tol: 0.5 })),          // elbow in place (c2)
    // shoulders level (c5): both shoulder joints at the start height
    ...['end'].flatMap(pose => ['shoulder.l', 'shoulder.r'].map(landmark => ({ landmark, plane: { point: S, normal: [0, 1, 0] }, pose, tol: 0.5 }))),
  ],
  ghosts: { count: 3, parts: ['arm.r', 'db'] },
  trace: { point: 'grip.r', trim: [10, 12] },
  callouts: [
    { key: 'palms', text: 'Palms face<br>body', anchor: 'wrist.r', cue: 'Keep a neutral grip, palms toward you, with no wrist twist.' },
    { key: 'arc', text: 'Arc across', anchor: 'grip.r', cue: 'Bring the dumbbell across toward the opposite shoulder, not straight up.' },
    { key: 'shoulders', text: 'Shoulders<br>down', anchor: 'shoulderTop.l', cue: 'Keep the shoulders down. Do not shrug as the dumbbell rises.' },
  ],
  tempo: [{ phase: 'Curl', s: 1, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Lower', s: 2, move: true }],
  mistake: {
    pose: mistakePose,
    parts: ['arm.r', 'db'],
    guides: [
      { kind: 'arrow', from: { at: 'shoulderTop.r', pose: 'end', off: [-10, -4] }, to: { at: 'shoulderTop.r', pose: 'mistake', off: [-10, -4] } },   // the shoulder rises
      { kind: 'dashed', pts: [[-0.30, LEVEL_Y, 0.2], [0.30, LEVEL_Y, 0.2]] },   // the level line of the set shoulders (c5, c6)
    ],
    tells: [
      { key: 'shrug', text: 'Shoulder<br>shrugs', anchor: { at: 'shoulderTop.r', pose: 'mistake' }, cue: 'Your working shoulder hikes up toward your ear as the dumbbell rises.' },
      { key: 'ear', text: 'Shoulder<br>near ear', anchor: { at: 'trap.r', pose: 'mistake' }, cue: 'The gap between your shoulder and ear closes.' },
    ],
  },
  pilot: { drawableFault: 'top fault: the arm fully straight at the bottom (c15), a small elbow bend toward the camera the front view cannot show; drawn: the next fault, the working shoulder shrugging (c5, c6)' },
  alt: 'Cross-body hammer curl, front view. Standing with a dumbbell in each hand, palms facing the body, the lifter curls the right dumbbell in an arc across the body toward the left shoulder, the elbow staying in place and the grip neutral.',
};
