// Barbell overhead press (standing strict press), side view, figure facing screen right.
// View: SIDE (card: "bar path relative to the face, forearm angle and trunk lean are all sagittal", c5, c6, c8).
// Form: research card docs/research/howto/cards/barbell_overhead_press.json (branch claude/libht-research
//  e2a70bc, verified), plate section: start "standing inside the rack (c11), feet hip-width and flat (c10); bar on the
//  front of the shoulders, forearms vertical, elbows slightly forward under the bar (c2, c5)"; end "bar over the
//  shoulders and mid-foot, elbows locked, hips and knees straight (c7, c9)". Path: "lean slightly back from the hips
//  (not the low back) at the bottom so the bar clears the chin, then move the torso forward once the bar passes the
//  head" (c6, c8). Grip just outside the shoulders (c2), wrist almost straight (c4).
// New pose class: "standing overhead press" (closest approved: barbell_back_squat; same bar drawing and the same
//  vertical mid-foot plumb line).
// Geometry decisions (confirmed by the report `angles` and the scratch clearance probe):
//  Mid-foot (sole landmark) at world z = 0; feet hip width (mid-soles 20 cm apart, c10), toes forward, flat.
//  Bar: 28 mm shaft. Start: resting on the front of the shoulders at the clavicle, a thorax point .828 H up (1.45 m
//   standing) and 1.4 cm in front of the drawn upper-chest line. Every key pose solves the root so the bar sits
//   exactly over mid-foot, and the hands are IK-placed on the bar, so the bar path (traced grip) is vertical.
//  Start: hips forward (hip 10 deg extended), pelvis and thorax leaning back LEAN_START = 8 deg as one piece (trunk 0:
//   the low back stays neutral, c8), head tilted back NECK_START = 10 deg (the brief's "head back slightly"), knees
//   locked (KNEE_LOCK 2 deg, c9). Hands 50 cm apart (2.3 cm outside each shoulder joint, c2). Elbow IK pole down and
//   slightly back: elbow 159.8 deg, elbow 2.2 cm in front of the bar, forearm 4.3 deg off vertical (c5 "forearms
//   vertical, elbows slightly forward under the bar"). Probe numbers from the scratch script, report angles agree.
//  Via 1: bar at forehead height, body not moved yet. Via 2: bar 10 cm over the head, the torso coming forward (lean
//   3 deg, shoulders half way to under the bar, c6). End: trunk vertical, shoulder joints exactly under the bar over
//   mid-foot (c7), head 8 deg forward so the ear is 0.9 cm in front of the bar line ("through the window"), elbows
//   locked (2 deg: reach = full arm length less 0.1 mm), hips and knees straight (c9); bar 2.06 m up.
//  Chin/face clearance: the bar never passes through the head. A scratch probe sampled 400 poses along the drawn path
//   (the engine's poseAt), and measured the distance from the bar centre to the drawn head outline (the engine's
//   Catmull-Rom spline of the side head) less the 14 mm shaft radius: minimum 2.1 cm, at bar height 1.58 m (mouth /
//   chin level, t = 0.195). With the head neutral it was 0.5 cm, so NECK_START = -10 is what gives the clearance.
//   The `checks` prove the ends: chin 2.9 cm behind the bar surface at the start, head 31 cm under the bar at lockout.
//  Drawn: the 45 cm plate outline at lockout only (four plate circles over the head hid it), the 50 mm sleeve dot in
//   every pose (start dashed, 2 ghosts, end), trace of the grip (the vertical bar path), mid-foot plumb line (datum,
//   as the squat). The lockout arm and trunk cover the whole start arm, so it is redrawn over the end figure as a
//   dashed outline (START_ARM, critic 10-03 R1/R7) with the start bar dot (the squat's workaround); the leaning start
//   trunk and head show as the engine's own dashed start pose behind the figure.
//  Camera: reference floor line, scale set so the rack top (2.4 m, above the lockout plate) is 16 px under the plate
//   edge: 134.6 px/m (92% of the reference, inside the 8's 123.9-146.3; pull_up and lat_pulldown also scale down).
//  Labels: the rack leaves two label columns, left of the rear upright and right of the front one; "Forearms
//   vertical", "Head through" and the measure label are boxed there (3 boxes), leaders <= 77 px.
//  Rack (verified card plate.equipment/start, c1, c11: press INSIDE a power rack, safety arms set below the bar's
//   rack position so a normal rep never touches them): the `safetyArms` composer, z 'back'. Uprights at RACK_BACK /
//   RACK_FRONT (1.2 m apart, the composer's typical rack depth), so the lifter, the whole bar path, the 45 cm plate
//   and the Mistake bar (20 cm forward + plate radius, front edge at z 0.43) sit between them (front upright face 7 cm
//   clear of that plate). Upright height RACK_H 2.4 m (tall commercial racks are 2.3-2.4 m): at 2.3 m the top
//   cross-member would overlap the lockout plate in this projection and read as a collision (in 3D the plates sit
//   outside the rack's width). Safety arms top at ARM_Y, 8 cm under the front-rack bar centre (6.6 cm under the
//   shaft). J-hooks (verified card plate.equipment "power rack with hooks at about shoulder height", setup c11): one
//   empty hook on the front upright, pointing back toward the lifter (composer option `hookY`, the vendored
//   rackUpright hook's shape and size; rackUpright's own hook would point out of the rack), its bearing surface at
//   HOOK_Y = the front-rack bar's underside, so the bar was unracked at shoulder height (critic 10-02 tier A check).
// Phase 2 (card plate section): callouts = the 3 verified plate.checkpoints (c5 forearms vertical, c6 head back then through,
//  c7 over mid-foot); mistake = plate.mistake (c5: elbows back, forearms tilted, bar curves forward away from the face),
//  tells = its two visible signs; tempo = plate.tempo (c17: up 1 s, down 2 s, pause 0, so no hold phase is invented).
//  Measure: shoulder elevation at lockout (arm hanging to straight overhead, drawn 179 deg), value in words and no
//  `expect`, since the card gives no number (c7 "bar over the shoulders"). The arc sweeps in front of the chest, clear
//  of the start arm and head phantoms. "Head through" is boxed beside the face (auto placement gave a 75 px leader
//  across the arm). Card verified (claude/libht-research e2a70bc).
//  Coverage 0.183 with the rack (inside the 8's range).
// CARD: lean-back angle (LEAN_START, c6 "slightly"), head tilt at the start (NECK_START, not in the card; sets the
//  face clearance), grip width (GRIP_X, c2), bar rest height (BAR_T, c2 "front of the shoulders"), stance width
//  (FOOT_X, c10), head forward at lockout (NECK_END, c6), shrug at lockout (SCAP_TOP, not in the card: 0).
import { WINTER, REF, REF_CAMERA, landmarksOf, bodyShapes, fk, resolve, normPose } from '../engine.mjs';
import { safetyArms } from '../eq/safetyArms.mjs';

const H = 1.75, R = Math.PI / 180;
const FOOT_X = 0.10;                                   // mid-sole lateral offset: feet hip width (c10)
const GRIP_X = 0.25;                                   // hand centre lateral offset: just outside the shoulders (c2)
const BAR_T = [0, 0.828, 0.060];                       // bar centre in the standing thorax frame (H): front of the shoulders
const LEAN_START = 8;                                  // deg the whole upper body leans back from the hips at the bottom (c6)
const NECK_START = -10;                                // deg head flexion at the bottom (- = tilted back): bar clears the face
const LEAN_VIA2 = 3;                                   // torso moving forward under the bar once it passes the head (c6)
const KNEE_LOCK = 2;                                   // deg: knees locked (c9), 2 deg keeps the IK off full extension
const SCAP_TOP = 0;                                    // cm shrug at lockout: not in the card
const NECK_END = 8;                                    // deg: head forward under the bar at lockout ("through the window", c6)
const ARM = (WINTER.upperArm + WINTER.forearm + REF.gripOff) * H;   // shoulder to grip centre, wrist straight

const feet = { l: { at: [FOOT_X, 0, 0] }, r: { at: [-FOOT_X, 0, 0] } };
const LEG = (() => { const a = WINTER.thigh * H, b = WINTER.shank * H, k = KNEE_LOCK * R; return Math.sqrt(a * a + b * b + 2 * a * b * Math.cos(k)); })();
const ANKLE_Z = -REF.mid * H, ANKLE_Y = WINTER.ankleH * H, DX = FOOT_X - REF.hjcX * H;
// Root on the leg-length sphere over the ankle for a given root z (hips forward of the ankles when leaning back).
const rootY = z => ANKLE_Y + Math.sqrt(LEG * LEG - DX * DX - (z - ANKLE_Z) ** 2);

// Bar spot on the thorax (as barbell_back_squat): affine combination of three thorax landmarks.
const REFP = { neck: [0.855, -0.02], backUpper: [0.75, -0.072], sternum: [0.80, 0.07] };
const W = (() => {
  const [a, b, c] = [REFP.neck, REFP.backUpper, REFP.sternum];
  const M = [[a[0] - c[0], b[0] - c[0]], [a[1] - c[1], b[1] - c[1]]], v = [BAR_T[1] - c[0], BAR_T[2] - c[1]];
  const det = M[0][0] * M[1][1] - M[0][1] * M[1][0];
  const wa = (v[0] * M[1][1] - M[0][1] * v[1]) / det, wb = (M[0][0] * v[1] - v[0] * M[1][0]) / det;
  return { neck: wa, backUpper: wb, sternum: 1 - wa - wb };
})();
const rackOf = lm => [0, 1, 2].map(i => i === 0 ? 0 : W.neck * lm.neck[i] + W.backUpper * lm.backUpper[i] + W.sternum * lm.sternum[i]);

const POLE_RACK = [0, -1, -0.3];                       // elbow IK pole: elbows under the bar, slightly forward of it (c5)
const POLE_UP = [0, -0.2, 1];                          // pressing: elbows forward of the bar plane, then locked
const hands = (bar, pole) => ({
  l: { at: [GRIP_X, bar[1], bar[2]], pole: [0.35 + pole[0], pole[1], pole[2]] },
  r: { at: [-GRIP_X, bar[1], bar[2]], pole: [-0.35 - pole[0], pole[1], pole[2]] },
});
// Upper body leaning back `lean` deg (pelvis tilt, trunk 0), root placed so the point `anchor(lm)` is over mid-foot.
function body(lean, anchor, extra = {}) {
  const probe = { root: { at: [0, rootY(0), 0], tilt: -lean }, trunk: 0, neck: 0, plant: feet, ...extra };
  const z = -anchor(landmarksOf(probe, H))[2];
  return { ...probe, root: { at: [0, rootY(z), z], tilt: -lean } };
}
// Start: bar on the shoulders over mid-foot.
const startBody = body(LEAN_START, rackOf, { neck: NECK_START });
const BAR0 = rackOf(landmarksOf(startBody, H));
const start = { ...startBody, reach: hands(BAR0, POLE_RACK) };
// End: shoulder joints under the bar over mid-foot, arms locked overhead.
const endBody = body(0, lm => lm['shoulder.r'], { scap: { elev: SCAP_TOP }, neck: NECK_END });
const SH_END = landmarksOf(endBody, H)['shoulder.r'];
const BAR1 = [0, SH_END[1] + Math.sqrt(ARM * ARM - (GRIP_X - Math.abs(SH_END[0])) ** 2) - 0.0001, 0];
const end = { ...endBody, reach: hands(BAR1, POLE_UP) };
// Vias: (1) bar at forehead height, body not yet moved (the start lean and hips); (2) bar just over the head, the torso
// coming forward under it: lean LEAN_VIA2 and the shoulder joints VIA2_SH of the way from the start spot to under
// the bar.
const SH0 = landmarksOf(startBody, H)['shoulder.r'][2];
const HEAD_TOP0 = landmarksOf(startBody, H).head[1];
const VIA2_SH = 0.5;
const via = [
  { ...startBody, reach: hands([0, HEAD_TOP0 - 0.07, 0], [0, -1, 0.6]) },
  { ...body(LEAN_VIA2, lm => [0, 0, lm['shoulder.r'][2] - SH0 * (1 - VIA2_SH)]), reach: hands([0, HEAD_TOP0 + 0.10, 0], POLE_UP) },
];
const BAR_R = 0.014;
// Start arm: the lockout arm and trunk cover the whole front-rack arm, so the engine's dashed start layer is invisible
// there; the arm is redrawn over the end figure (START_ARM below).
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
// Arm outlines of a pose as world polylines (side view, x = 0): the engine's own body shapes (bodyShapes), sampled on
// the Catmull-Rom spline it draws, on a 1000 px/m probe camera, mapped back to world metres.
const ARM_KEYS = s => ['shcap', 'upper', 'elbowcap', 'fore', 'fist'].map(k => `${k}.${s}`);
function armShapes(pose, keys) {
  const bd = { height: H }, probe = { view: 'side', near: 'r', pxm: 1000, P: w => [w[2] * 1000, -w[1] * 1000] };
  return bodyShapes(fk(resolve(normPose(pose, bd), bd).q, bd), probe).filter(sh => keys.includes(sh.key))
    .map(sh => (sh.key.includes('cap') ? sh.poly : cr(sh.poly, sh.key.startsWith('fist') ? 4 : 8)).map(([x, y]) => [0, -y / 1000, x / 1000]));
}
// R1/R7 (critic 10-03): the start (front-rack) arm redrawn over the lockout figure as the dashed, unfilled start-pose
// outline (every other plate's start convention): upper arm to the elbow ahead of the chest, vertical forearm up to
// the racked bar. Unfilled, so the head and the solid lockout arm stay visible (a filled patch read as a third limb).
// The FOREARMS VERTICAL leader ends on this forearm.
const START_ARM = armShapes(start, ['upper.r', 'elbowcap.r', 'fore.r', 'fist.r']).map(pts => ({ type: 'line', pts: [...pts, pts[0]], cls: 'eq-line m-line', z: 'front', part: 'startarm' }));
const START_DOT = Array.from({ length: 17 }, (_, k) => [0, BAR0[1] + 0.025 * Math.sin(k * Math.PI / 8), BAR0[2] + 0.025 * Math.cos(k * Math.PI / 8)]);
// Mistake (card plate.mistake, c5): elbows back at the start, forearms tilted, so the bar curves forward away from
// the face. Drawn AT THE RACK POSITION (critic 10-02 R5: the fault at forehead height sat over the solid locked-out
// arm and did not read as elbows back; 10-03 R5: draw it clear of the torso, the elbow well back and lower): the
// start body, the bar eased off the shoulders, 3 cm forward and 15 cm down (MIS_DZ, MIS_DY), the elbow IK pole down
// and back square to the shoulder-bar line (MIS_POLE, no flare). The elbow then sits 27.7 cm behind and 20.1 cm below
// the bar, behind the back line, and the forearm (34.2 cm in side view) tilts 54 deg, against -4.3 at the correct
// start (misInfo). The engine's own faulty-arm outline lies inside the faulty (leaning) torso and is masked there, so
// the faulty arm is drawn as Mistake guides, which are not masked: the engine's faulty-arm outline as dashed red
// polylines (`parts` limits the masked engine outline to the arms, so the leaning trunk is not outlined in red). A
// short arrow runs from the correct start elbow (under the bar) to the faulty one. The drift is the light part: a thin
// dashed path from the faulty bar curving forward-up to a sleeve-size ring MIS_FWD in front of mid-foot at forehead
// height (MIS_Y) (the card gives no distance).
const MIS_POLE = [0.05, -0.77, -0.63];                // elbow IK pole: down and back, square to the shoulder-bar line (elbows back, c5)
const MIS_DZ = 0.03, MIS_DY = -0.15;                   // m: the faulty bar sits this far in front of and below its rack spot
                                                       //  (eased off the shoulders), so the elbow can drop behind it
const MIS_FWD = 0.20;                                  // m the bar drifts forward of mid-foot (card: "away from the face")
const MIS_Y = 1.70;                                    // m: forehead height, where the drifting bar is drawn
const mistakePose = { ...startBody, reach: {   // pole in the sagittal plane (no elbow flare), so the tilted forearm shows full length
  l: { at: [GRIP_X, BAR0[1] + MIS_DY, BAR0[2] + MIS_DZ], pole: [MIS_POLE[0], MIS_POLE[1], MIS_POLE[2]] },
  r: { at: [-GRIP_X, BAR0[1] + MIS_DY, BAR0[2] + MIS_DZ], pole: [-MIS_POLE[0], MIS_POLE[1], MIS_POLE[2]] } } };
const LM_MIS = landmarksOf(mistakePose, H), LM_S = landmarksOf(start, H);
const tiltOf = lm => +(Math.atan2(lm['grip.r'][2] - lm['elbow.r'][2], lm['grip.r'][1] - lm['elbow.r'][1]) / R).toFixed(1);
export const misInfo = {
  elbowBehindBarCm: +((LM_MIS['grip.r'][2] - LM_MIS['elbow.r'][2]) * 100).toFixed(1), elbowBelowBarCm: +((LM_MIS['grip.r'][1] - LM_MIS['elbow.r'][1]) * 100).toFixed(1),
  forearmTiltDeg: tiltOf(LM_MIS), startForearmTiltDeg: tiltOf(LM_S), sideForearmCm: +(Math.hypot(LM_MIS['grip.r'][1] - LM_MIS['elbow.r'][1], LM_MIS['grip.r'][2] - LM_MIS['elbow.r'][2]) * 100).toFixed(1),
};
const MB = [0, BAR0[1] + MIS_DY, BAR0[2] + MIS_DZ];   // the faulty bar
const DRIFT = Array.from({ length: 13 }, (_, k) => { const t = k / 12;   // quadratic curve from the faulty bar: up first, then forward
  return [0, (1 - t) ** 2 * MB[1] + 2 * t * (1 - t) * MIS_Y + t * t * MIS_Y, (1 - t) ** 2 * MB[2] + 2 * t * (1 - t) * MB[2] + t * t * MIS_FWD]; });
// R5 (critic 10-03): in the Mistake view the lockout arm is faded (its parts redrawn over it as 'eq' outlines, the
// ghost look, end layer, Mistake only); the start arm is not drawn there, and the faulty arm has no patch under it.
const FADE_ARM = [...armShapes(end, ARM_KEYS('l')), ...armShapes(end, ARM_KEYS('r'))].map(pts => ({ type: 'poly', pts, cls: 'eq', z: 'front', part: 'fadearm' }));
const MIS_ARM = armShapes({ ...end, ...mistakePose }, ['upper.r', 'elbowcap.r', 'fore.r', 'fist.r']);
const RING_R = 0.025;
const MB_RING = Array.from({ length: 17 }, (_, k) => [0, MB[1] + RING_R * Math.sin(k * Math.PI / 8), MB[2] + RING_R * Math.cos(k * Math.PI / 8)]);
const DRIFT_RING = Array.from({ length: 17 }, (_, k) => [0, MIS_Y + RING_R * Math.sin(k * Math.PI / 8), MIS_FWD + RING_R * Math.cos(k * Math.PI / 8)]);
// Camera: the reference floor line (plate y 339) and the largest scale that keeps the 45 cm plate at lockout 16 px
// under the plate top (the engine's `fit` measures every pose with the start context, so it cannot see an item drawn
// in the end pose only). 141 px/m, 96% of the reference.
const RACK_FRONT = 0.50, RACK_BACK = -0.50, RACK_H = 2.40;   // power rack uprights (world z) and height (m)
const ARM_Y = BAR0[1] - 0.08;                                 // safety arms: 8 cm under the front-rack bar (c11)
const HOOK_Y = BAR0[1] - BAR_R;                               // J-hook bearing surface: the front-rack bar's underside (c1, c11)
const PLATE_TOP = Math.max(BAR1[1] + 0.225, RACK_H), TOP_PX = 16;
const CAMERA = { pxPerM: Math.min(REF_CAMERA.pxPerM, (REF_CAMERA.y0 - TOP_PX) / PLATE_TOP), x0: 179, y0: REF_CAMERA.y0 };

export default {
  id: 'barbell_overhead_press', name: 'Barbell Overhead Press', view: 'side', facing: 'right',
  camera: CAMERA,
  poses: { start, via, end },
  equipment: [
    { type: 'floor', from: -0.75, to: 0.75 },
    ...safetyArms({ front: RACK_FRONT, back: RACK_BACK, armY: ARM_Y, h: RACK_H, hookY: HOOK_Y }),
    // the 45 cm plate outline at the lockout only (four overlapping plate circles hid the head); the 50 mm sleeve dot
    // in every pose, so the start, ghosts and end bar positions read along the vertical path
    (lm, ctx) => [
      ctx.pose === 'end' ? { type: 'barbell', at: [0, lm.grips[1], lm.grips[2]], plates: [0.045], part: 'plate', z: 'back' } : null,
      ...(ctx.pose === 'end' && ctx.mistake ? FADE_ARM : []),
      { type: 'pulley', at: [0, lm.grips[1], lm.grips[2]], r: 0.025, part: 'bar', z: 'front' },
      // start bar dot, dashed, in front: the lockout arm covers the start layer (barbell_back_squat's workaround)
      ...(ctx.pose === 'end' ? [...(ctx.mistake ? [] : START_ARM), { type: 'line', cls: 'eq-line m-line', pts: START_DOT, z: 'front', part: 'startbar' }] : []),
    ].filter(Boolean),
  ],
  checks: [
    { landmark: 'heel.r', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
    { landmark: 'ball.r', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
    { landmark: 'grips', plane: { point: [0, 0, 0], normal: [0, 0, 1] }, pose: 'start', tol: 0.5 },        // bar over mid-foot
    { landmark: 'grips', plane: { point: [0, 0, 0], normal: [0, 0, 1] }, pose: 'end', tol: 0.5 },
    { landmark: 'grips', plane: { point: [0, 0, BAR0[2] + MIS_DZ], normal: [0, 0, 1] }, pose: 'mistake', tol: 0.5 },   // fault: bar at the shoulders
    { landmark: 'chin', above: { point: [0, 0, -BAR_R], normal: [0, 0, -1] }, pose: 'start' },            // chin behind the bar
    { landmark: 'head', above: { point: [0, BAR1[1] - BAR_R, 0], normal: [0, -1, 0] }, pose: 'end' },      // bar over the head
  ],
  startParts: ['trunk', 'arm.r', 'bar'],
  ghosts: { count: 2, parts: ['arm.r', 'bar'] },
  trace: { point: 'grip.r', trim: [12, 12] },
  datum: [{ x: [0, 0, 0], from: 349, to: 20 }],
  measure: { vertex: 'shoulder.r', from: 'down', to: 'elbow.r', radius: 20, title: 'Shoulder', value: 'straight up', box: { left: 258, top: 172 } },
  callouts: [
    { key: 'forearms', text: 'Forearms<br>vertical', anchor: { along: [{ at: 'elbow.r', pose: 'start' }, { at: 'grip.r', pose: 'start' }], t: 0.45 }, box: { left: 22, top: 118 }, cue: 'Keep your elbows under the bar so your forearms point straight up.' },
    { key: 'head', text: 'Head<br>through', anchor: 'chin', cue: 'Lean back slightly from the hips, then move under the bar as it passes.',
      guide: [{ at: 'ear', pose: 'start' }, 'ear'], box: { left: 258, top: 96 } },
    { key: 'midfoot', text: 'Over<br>mid-foot', anchor: { at: 'grip.r', off: [6, -2] }, cue: 'Lock out with the bar over your shoulders and mid-foot.' },
  ],
  tempo: [{ phase: 'Press', s: 1, move: true }, { phase: 'Lower', s: 2, move: true }],
  mistake: {
    pose: mistakePose,
    parts: ['arm.r', 'arm.l'],
    guides: [
      { kind: 'arrow', from: { at: 'elbow.r', pose: 'start' }, to: { at: 'elbow.r', pose: 'mistake' } },   // elbow goes back
      ...MIS_ARM.map(pts => ({ kind: 'dashed', pts: [...pts, pts[0]] })),   // the faulty arm: elbow behind the bar, forearm tilted
      { kind: 'dashed', pts: MB_RING },                 // the faulty bar (sleeve), eased off the shoulders
      { kind: 'dashed', pts: DRIFT },                      // light: the bar's forward drift away from the face
      { kind: 'dashed', pts: DRIFT_RING },
    ],
    tells: [
      { key: 'elbows', text: 'Elbows back', anchor: { at: 'elbow.r', pose: 'mistake' }, cue: 'The elbows sit behind the bar, so your forearms tilt.' },
      { key: 'drift', text: 'Bar drifts<br>forward', anchor: [0, MIS_Y + RING_R, MIS_FWD], cue: 'The bar curves forward, away from your face and mid-foot.' },
    ],
  },
  alt: 'Barbell overhead press, side view. The bar starts on the front of the shoulders, forearms vertical, body leaning slightly back from the hips. It travels straight up over mid-foot to locked arms overhead, the head moving forward under the bar.',
};
