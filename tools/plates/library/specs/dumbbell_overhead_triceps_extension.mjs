// Dumbbell overhead triceps extension (one dumbbell in both hands, standing split stance), side view, figure faces
// screen right.
// View: SIDE (card plate.view = census view). The elbow bend behind the head with the upper arms vertical (c6), the 90
// degree stop (c5), the dumbbell clearing the head (c5) and the fault, the back arching as the dumbbell is pressed up
// (c9), are sagittal. Elbow flare (c12) is sideways and not drawn (card viewWhy).
// Form: research card docs/research/howto/cards/dumbbell_overhead_triceps_extension.json (research head a8e66f32),
//  plate section: start "Top position: split stance (c1), torso braced, shoulders down and back, head in line with the
//  spine (c3); arms vertical, elbows pointing forward and not locked, dumbbell hanging vertically over the head (c4)";
//  end "Bottom position: elbows bent to about 90 degrees with the dumbbell behind, not touching, the head (c5); upper arms
//  still vertical, elbows shoulder-width (c6); torso unchanged (c7)".
// Pose map (D-LIB15-POSE, #290 6340022161; DESIGN.md section 9): spec start = card end (the bottom, c5), spec end = card
//  start (the top, c4), so the drawn rep is the press and the Mistake (the arch as the dumbbell is pressed up, c9) sits
//  against the top.
// Clone sources (D-LIB15-CLONE, copied never imported): overhead_cable_triceps_extension (this batch: arms overhead, the
//  arch Mistake), bayesian_cable_curl (this batch: the split stance), dumbbell_biceps_curl (pilot A: the dumbbell use).
// Geometry decisions:
//  - Split stance (c1; D-LIB15-SPLIT): the far (left) foot STEP ahead of the near (right) foot, both flat; bayesian_cable_
//    curl's drawn stance. Torso upright and braced, head in line (c3): tilt 0, trunk 0, neck 0.
//  - Upper arms vertical (c6) in both poses: shoulder flexion SH_FLEX, overhead_cable_triceps_extension's arms-by-the-ears
//    value, so only the elbows move (c7). Bottom: elbows at 90 (c5, the plate fact). Top: ELBOW_TOP, not locked (c4),
//    overhead_cable_triceps_extension's soft lockout (#290 6343211054 item 7).
//  - The dumbbell: the vendor dumbbell with its axis vertical (c1, c4), the hands cupped under the top head, so its centre
//    sits half a handle below the grips; it hangs behind the head at the bottom and clears it (c5; a check and A15).
// Unsourced numbers (13.3 must-fix 14): STEP and the stance (bayesian_cable_curl's), ROOT, SH_FLEX, ELBOW_TOP, the
//  dumbbell's sizes (vendor default) and the Mistake's magnitude (M_ARCH; c9 gives none).
// Callouts, Mistake, tempo: the 3 checkpoints are the callouts (c6/c7, c3, c5); the Mistake is the card's plate.mistake
//  (c9, c12, drawable true), drawn against the end pose at LB3 dumbbell_romanian_deadlift's arch (M_ARCH 25,
//  #290 6343237796), with one tell (item 2) and DRDL's dashed arch and arrow. Tempo: Press 1 s, Hold 1 s, Lower 2 s
//  (lb5/tempo.json, D-LIB15-TEMPO); no Rest.
import { landmarksOf } from '../engine.mjs';

const H = 1.75;
const STEP = 0.45;                                     // far foot ahead of the near foot (c1; bayesian_cable_curl's)
const ROOT = [0, 0.87, 0.0];
const SH_FLEX = 178;                                   // upper arms vertical (c6; overhead_cable_triceps_extension's)
const ELBOW_BOTTOM = 90, ELBOW_TOP = 8;                // about 90 degrees (c5); straight, not locked (c4)
const DB = { handle: 0.13, headLen: 0.07 };            // vendor dumbbell defaults

const feet = { l: { at: [0.10, 0, STEP / 2 + 0.03] }, r: { at: [-0.10, 0, -STEP / 2 + 0.03] } };
const base = { root: { at: ROOT, tilt: 0 }, trunk: 0, neck: 0, scap: { elev: 0, pro: -1 }, plant: feet, wrist: 0, shoulder: { flex: SH_FLEX, rot: 0 } };
const start = { ...base, elbow: ELBOW_BOTTOM };
const end = { ...base, elbow: ELBOW_TOP };

// Mistake (card plate.mistake, c9): "Back arching as the dumbbell is pressed up." c9 gives no size: LB3
// dumbbell_romanian_deadlift's arch (#274 a6f4bd07, specs/dumbbell_romanian_deadlift.mjs:109, M_ARCH 25), as ruled for
// this card (#290 6343237796): the pelvis tips M_ARCH forward and the lumbar spine extends M_ARCH. Never sized to pass H3.
const M_ARCH = 25;
const mistakePose = { root: { at: ROOT, tilt: M_ARCH }, trunk: -M_ARCH };
const LM_M = landmarksOf({ ...end, ...mistakePose }, H);
// The arch as a dashed curve (sacrum -> lumbar -> backMid -> backUpper of the faulty pose, 2 cm up), and an arrow
// pointing forward into the lumbar from behind, its tip 15 cm behind the faulty lumbar point (13.1's 6 px clearance;
// overhead_cable_triceps_extension's).
const ARCH_PTS = ['sacrum', 'lumbar', 'backMid', 'backUpper'].map(k => LM_M[k].map((v, i) => v + (i === 1 ? 0.02 : 0)));
const ARCH_TIP = LM_M.lumbar.map((v, i) => v + (i === 2 ? -0.15 : 0)), ARCH_TAIL = LM_M.lumbar.map((v, i) => v + (i === 2 ? -0.25 : 0));

// The dumbbell's centre: half a handle below the grips' midpoint, axis vertical.
const dbAt = lm => [0, lm.grips[1] - DB.handle / 2, lm.grips[2]];
const lmEnd = landmarksOf(end, H);

export default {
  id: 'dumbbell_overhead_triceps_extension', name: 'Dumbbell Overhead Triceps Extension', view: 'side', facing: 'right',
  camera: { fit: true },
  poses: { start, end },
  equipment: [
    { type: 'floor', from: -0.45, to: 0.55 },
    lm => ({ type: 'dumbbell', at: dbAt(lm), axis: [0, 1, 0], part: 'db', z: 'mid' }),
  ],
  checks: [
    ...['wrist.r', 'wrist.l'].map(landmark => ({ landmark, at: lmEnd[landmark], pose: 'end', tol: 0.5 })),   // both hands around the handle (c1; card start = spec end)
    { landmark: 'sole.r', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
    { landmark: 'sole.l', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
    // the upper arms never move (c6, c7): the elbow at one point in start and end
    ...['start', 'end'].map(pose => ({ landmark: 'elbow.r', at: lmEnd['elbow.r'], pose, tol: 0.5 })),
  ],
  ghosts: { count: 3, parts: ['arm.r', 'db'] },
  trace: { point: 'grip.r', trim: [10, 12] },
  measure: { vertex: 'elbow.r', from: 'shoulder.r', to: { at: 'wrist.r', pose: 'start' }, radius: 24, title: 'Elbow', value: 'about 90°', expect: 90 },
  callouts: [
    { key: 'vertical', text: 'Arms<br>vertical', anchor: 'elbow.r', cue: 'Keep the upper arms vertical and still. Only the elbows bend.' },
    { key: 'braced', text: 'Braced<br>torso', anchor: { at: 'navel', off: [4, 0] }, cue: 'Brace the trunk, shoulders down and back, head in line with your spine.' },
    { key: 'stop', text: 'Stop at 90°', anchor: { at: 'grip.r', pose: 'start' }, cue: 'Lower to about a right angle, clear of the back of your head.' },
  ],
  tempo: [{ phase: 'Press', s: 1, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Lower', s: 2, move: true }],
  mistake: {
    pose: mistakePose,
    parts: ['torso', 'head', 'arm.r', 'db'],
    guides: [
      { kind: 'dashed', pts: ARCH_PTS, smooth: true },
      { kind: 'arrow', from: ARCH_TAIL, to: ARCH_TIP },
    ],
    tells: [
      { key: 'arch', text: 'Back<br>arches', anchor: { at: 'lumbar', pose: 'mistake' }, cue: 'Your lower back arches as you press the dumbbell up.' },
    ],
  },
  alt: 'Dumbbell overhead triceps extension, side view. Standing in a split stance, torso upright, one dumbbell held vertically in both hands behind the head with the elbows bent to about 90 degrees. The upper arms stay vertical while the elbows straighten to press the dumbbell overhead.',
};
