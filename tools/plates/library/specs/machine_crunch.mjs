// Machine crunch (selectorised seated ab-crunch machine, shin roller, handles by the shoulders), side view, figure
// facing screen right. LIB-16 (LB6, mode H; own parent; the `crunchMachine` composer's anchor, plan 2.1:141).
// View: side (card plate.view = census view). The spine curling the ribs toward the pelvis (c4), the hips staying back
// (c2) and the fault, the arms pulling the handles down while the trunk stays upright (c14), are sagittal.
// Sources: research card docs/research/howto/cards/machine_crunch.json (research head a8e66f32): callouts =
//  plate.checkpoints (c2 Hips back, c4 Curl the spine, c14 Core leads); Mistake = plate.mistake (c14, drawable);
//  tempo = plate.tempo (c15: up 2, down 2, pause 0).
// Clone source: hanging_leg_raise (the 8, main; census closest, closeness N) for the curl drawn at the lumbar pivot and
//  the Mistake's dashed-guide method; machine_chest_press (the 8, main; D-LIB16-CLONE) for the seat, the back pad laid
//  tangent to the back, the feet and the pivot-arm handle. Copied, never imported (D-LIB9-CLONE).
// Equipment: eq/crunchMachine.mjs (single use; this plate is its anchor).
// Pose map (DESIGN.md section 9): identity. Spec start = plate.start (upright, c2, c3), spec end = plate.end (curled,
//  c4, c2); the Mistake is drawn against the end pose.
// Geometry decisions (confirmed by the engine report `angles` and `checks`):
//  Seat top SEAT_TOP (the 8's chest press, machine_chest_press.mjs:30), pelvis upright (tilt 0), feet flat as the 8's
//   chest press (machine_chest_press.mjs:31). The back pad's face is laid tangent to the upper back and the buttock of
//   the start pose (the 8's method), so the hips press against the back of the seat (c2) in every pose.
//  Start (c2, c3): seated upright, the shins against the roller (its face on the front of the lower shins), the hands on
//   the handles by the shoulders (GRIP_UP above and GRIP_FWD in front of the shoulder joint,
//   GRIP_X out from the midline).
//  End (c4, c2): the spine curls CURL deg at the lumbar pivot with the pelvis held on the seat and against the pad
//   (c2 hips back), so the ribs come toward the pelvis. The movement arm pivots on the trunk's bend axis (c1 mo-crunch
//   "alignment with torso"), so the handles turn with the shoulders and the arms keep their bend.
//  Mistake (c14 "Pulling with arms", the card's reading in its notes: "the arms doing the pull while the trunk stays
//   upright"): the trunk as in the start (M_TRUNK, no curl), the movement arm at the end's angle (M_ARM = CURL: the
//   same stack travel), reached by the arms: the hands pulled forward and down on the handles.
// Unsourced numbers (SIZES below; lb6/sizes.json holds each with its basis): SEAT_TOP 0.46 m, SEAT_Z 0.10 m, the feet
//  FEET_X 0.10 / FEET_Z 0.47 m, the handles GRIP_X 0.22 m, GRIP_FWD 0.20 m, GRIP_UP 0.12 m, CURL 40 deg, ROLLER_T 0.62
//  (the roller's place on the shin), PAD_LEN 0.62 m, PAD_BELOW 0.08 m, FRAME_BACK 0.15 m, the floor beam's
//  overhang BEAM_OUT 0.10 m and the floor line's ends FLOOR_BACK 0.20 / FLOOR_FRONT 0.30 m, the Mistake's M_TRUNK 0 deg
//  and M_ARM 40 deg; the crunchMachine sizes (eq/crunchMachine.mjs header). The elbow's pole is an IK hint (the elbows
//  point out to the sides), not a size.
import { bodyShapes, fk, landmarksOf, normPose, RADII, resolve, rootOnSeat } from '../engine.mjs';
import { CRUNCH_MACHINE_ITEMS, crunchMachine } from '../eq/crunchMachine.mjs';
import { perItem } from '../eq/parts.mjs';

const H = 1.75, R = Math.PI / 180;
// Every number the card does not give, with its basis in lb6/sizes.json (D-LIB16-SIZE; A17 reads this table).
export const SIZES = Object.freeze({ SEAT_TOP: 0.46, SEAT_Z: 0.10, FEET_X: 0.10, FEET_Z: 0.47, GRIP_X: 0.22, GRIP_FWD: 0.20, GRIP_UP: 0.12, CURL: 40,
  ROLLER_T: 0.62, PAD_LEN: 0.62, PAD_BELOW: 0.08, FRAME_BACK: 0.15, BEAM_OUT: 0.10, FLOOR_BACK: 0.20, FLOOR_FRONT: 0.30, M_TRUNK: 0, M_ARM: 40 });
const { SEAT_TOP, SEAT_Z, FEET_X, FEET_Z, GRIP_X, GRIP_FWD, GRIP_UP, CURL, ROLLER_T, PAD_LEN, PAD_BELOW, FRAME_BACK, BEAM_OUT, FLOOR_BACK, FLOOR_FRONT, M_TRUNK, M_ARM } = SIZES;
const SEAT = [0, SEAT_TOP, 0];
const feet = { l: { at: [FEET_X, 0, FEET_Z] }, r: { at: [-FEET_X, 0, FEET_Z] } };
const body = trunk => ({ root: { at: rootOnSeat(SEAT, 0, H), tilt: 0 }, trunk, neck: 0, plant: feet });

// The pivot on the trunk's bend axis: the lumbar landmark of the upright pose (the thorax turns about it).
const LU = landmarksOf(body(0), H);
export const PIVOT = [0, LU.lumbar[1], LU.lumbar[2]];
const rot = (p, deg) => {   // turn a world point about the pivot by deg (positive: forward and down, the curl's sense)
  const a = deg * R, dz = p[2] - PIVOT[2], dy = p[1] - PIVOT[1];
  return [p[0], PIVOT[1] + dy * Math.cos(a) - dz * Math.sin(a), PIVOT[2] + dz * Math.cos(a) + dy * Math.sin(a)];
};
const SH = LU['shoulder.r'];
const HANDLE0 = [0, SH[1] + GRIP_UP, SH[2] + GRIP_FWD];
const handleAt = deg => rot(HANDLE0, deg);
const POLE = [-1, -0.5, 0.3];   // IK hint: the elbows point out to the sides and a little down, clear of the belly
const grips = deg => { const h = handleAt(deg); return { l: { at: [GRIP_X, h[1], h[2]], pole: [-POLE[0], POLE[1], POLE[2]] }, r: { at: [-GRIP_X, h[1], h[2]], pole: POLE } }; };
const start = { ...body(0), reach: grips(0) };
const end = { ...body(CURL), reach: grips(CURL) };
const via = [1 / 3, 2 / 3].map(t => ({ ...body(CURL * t), reach: grips(CURL * t) }));
const mistakePose = { trunk: M_TRUNK, reach: grips(M_ARM) };

// Back pad: tangent to the upper back and the buttock of the start pose (the 8's chest press method).
const padU = [0, LU.backUpper[1], LU.backUpper[2]], padL = [0, LU.buttock[1], LU.buttock[2]];
const padN = (() => { const d = [0, padU[1] - padL[1], padU[2] - padL[2]], n = [0, -d[2], d[1]], k = Math.hypot(...n); return n.map(v => v / k); })();
// Shin roller: on the front of the near shin, ROLLER_T of the way from the knee to the ankle (start pose).
const shankR = t => { const [rA, rM, rB, m] = RADII.shank; return t < m ? rA + (rM - rA) * Math.sin((t / m) * Math.PI / 2) : rM + (rB - rM) * (1 - Math.cos(((t - m) / (1 - m)) * Math.PI / 2)); };
const SHIN = (() => {
  const K = LU['knee.r'], A = LU['ankle.r'], d = [0, A[1] - K[1], A[2] - K[2]], L = Math.hypot(...d), u = d.map(v => v / L);
  let n = [0, -u[2], u[1]]; if (n[2] < 0) n = n.map(v => -v);                                 // the front of the shin
  const at = K.map((v, i) => v + d[i] * ROLLER_T + n[i] * shankR(ROLLER_T) * H);
  // H6 contact plane (D-LIB13-FACTS2): the shank axis, parallel to the shin, shankR behind the roller contact.
  return { at: [0, at[1], at[2]], n, plane: { point: [0, K[1], K[2]], normal: n } };
})();
const FRAME_Z = padL[2] - FRAME_BACK;
const machine = (lm, ctx) => crunchMachine({
  seat: { at: [0, SEAT_TOP, SEAT_Z] }, pad: { surface: [padU, padL], len: PAD_LEN, below: PAD_BELOW },
  roller: { at: SHIN.at, normal: SHIN.n }, pivot: PIVOT, handle: ctx.pose === 'start' ? handleAt(0) : [0, lm['grip.r'][1], lm['grip.r'][2]],
  frameZ: FRAME_Z, floorZ: [FRAME_Z - BEAM_OUT, SHIN.at[2] + BEAM_OUT],
});
const wristOn = lm => ({ r: lm['wrist.r'], l: lm['wrist.l'] });
const WS = wristOn(landmarksOf(start, H));
// The Mistake's near arm (shoulder cap, upper arm, elbow, forearm, fist) lies over the solid end trunk, where the
// engine's mask hides its outline, so it is redrawn as red dashed lines over the figure (13.4 must-fix 1): the outer
// boundary of the engine's own arm shapes for the Mistake pose, computed in metres (the 8's machine_chest_press
// startArmPhantom method, copied) and projected by the guide's world points.
const insidePoly = (p, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
  const [xi, yi] = poly[i], [xj, yj] = poly[j];
  if ((yi > p[1]) !== (yj > p[1]) && p[0] < (xj - xi) * (p[1] - yi) / (yj - yi) + xi) c = !c; } return c; };
export const MISTAKE_ARM = (() => {
  const b = { height: H }, sk = fk(resolve(normPose({ ...end, ...mistakePose }, b), b).q, b);
  const cam = { view: 'side', facing: 'right', near: 'r', pxm: 1, P: w => [w[2], -w[1]] };
  const keys = ['shcap.r', 'upper.r', 'elbowcap.r', 'fore.r', 'fist.r'];
  const polys = bodyShapes(sk, cam).filter(sh => keys.includes(sh.key)).map(sh => sh.poly), runs = [];
  polys.forEach((poly, k) => {
    let run = [];
    const flush = () => { if (run.length > 1) runs.push(run); run = []; };
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], q = poly[(i + 1) % poly.length], n = Math.max(1, Math.ceil(Math.hypot(q[0] - a[0], q[1] - a[1]) / 0.002));
      for (let j = 0; j < n; j++) {
        const pt = [a[0] + (q[0] - a[0]) * j / n, a[1] + (q[1] - a[1]) * j / n];
        if (polys.some((o, m) => m !== k && insidePoly(pt, o))) flush(); else run.push(pt);
      }
    }
    flush();
  });
  return runs.map(r => ({ kind: 'dashed', pts: r.map(p => [0, -p[1], p[0]]) }));
})();
// Hidden start parts (slice look #297 6346404542 item 2; DRAWING-GUIDE section 4): the start fist and its handle grip
// sit under the end head, so they are redrawn in the end pose as a dashed phantom outline (the 8's machine_chest_press
// startArmPhantom method, copied): the outer boundary of the engine's start fist and of the chestPress grip bar
// (14 cm, 1.6 cm half-thickness, equipment.mjs:248), in metres, projected by the `line` primitive.
export const START_PHANTOM = (() => {
  const b = { height: H }, sk = fk(resolve(normPose(start, b), b).q, b);
  const cam = { view: 'side', facing: 'right', near: 'r', pxm: 1, P: w => [w[2], -w[1]] };
  const fist = bodyShapes(sk, cam).find(sh => sh.key === 'fist.r').poly;
  const g = handleAt(0), hg = 0.07, r = 0.016;
  const grip = [[g[2] - r, -(g[1] + hg)], [g[2] + r, -(g[1] + hg)], [g[2] + r, -(g[1] - hg)], [g[2] - r, -(g[1] - hg)]];
  const polys = [fist, grip], runs = [];
  polys.forEach((poly, k) => {
    let run = [];
    const flush = () => { if (run.length > 1) runs.push(run); run = []; };
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], q = poly[(i + 1) % poly.length], n = Math.max(1, Math.ceil(Math.hypot(q[0] - a[0], q[1] - a[1]) / 0.002));
      for (let j = 0; j < n; j++) {
        const pt = [a[0] + (q[0] - a[0]) * j / n, a[1] + (q[1] - a[1]) * j / n];
        if (polys.some((o, m) => m !== k && insidePoly(pt, o))) flush(); else run.push(pt);
      }
    }
    flush();
  });
  return runs.map(rr => ({ type: 'line', pts: rr.map(p => [0, -p[1], p[0]]), cls: 'eq-line m-line', z: 'front' }));
})();
const FLOOR = { point: [0, 0, 0], normal: [0, 1, 0] }, PAD = { point: padU, normal: padN };

export const MC = { pivot: PIVOT, handleAt, pad: PAD, shin: SHIN, frameZ: FRAME_Z, curl: CURL };
export default {
  id: 'machine_crunch', name: 'Machine Crunch', view: 'side', facing: 'right',
  camera: { x0: 150, y0: 339 },
  poses: { start, via, end },
  equipment: [
    { type: 'floor', from: FRAME_Z - FLOOR_BACK, to: FEET_Z + FLOOR_FRONT },
    ...perItem(machine, CRUNCH_MACHINE_ITEMS),
    (lm, ctx) => (ctx.pose === 'end' ? START_PHANTOM : null),   // the hidden start fist and grip, dashed
  ],
  checks: [
    { landmark: 'seat', plane: { point: SEAT, normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },          // pelvis on the seat
    { landmark: 'buttock', plane: PAD, pose: 'all', tol: 0.5 },                                      // c2 hips back on the pad
    { landmark: 'backUpper', plane: PAD, pose: 'start', tol: 0.5 },
    { landmark: 'knee.r', plane: SHIN.plane, pose: 'start', tol: 0.5 },                              // c2 shins on the roller
    { landmark: 'ankle.r', plane: SHIN.plane, pose: 'start', tol: 0.5 },
    { landmark: 'knee.l', plane: SHIN.plane, pose: 'start', tol: 0.5 },
    { landmark: 'ankle.l', plane: SHIN.plane, pose: 'start', tol: 0.5 },
    { landmark: 'wrist.r', at: WS.r, pose: 'start', tol: 0.5 },                                      // c3 hands on the handles
    { landmark: 'wrist.l', at: WS.l, pose: 'start', tol: 0.5 },
    { landmark: 'heel.r', plane: FLOOR, pose: 'all', tol: 0.5 },
    { landmark: 'ball.r', plane: FLOOR, pose: 'all', tol: 0.5 },
  ],
  startParts: ['trunk', 'arm.r', 'arm'],
  ghosts: { count: 2, parts: ['trunk', 'arm.r', 'arm'] },
  trace: { point: 'grip.r', trim: [10, 12] },   // D-LIB16-CRUNCH-TRACE: the point of ACE's own motion cue (c3, "pull down on them")
  callouts: [
    { key: 'hips', text: 'Hips back', anchor: 'buttock', box: { left: 16, top: 252 }, cue: 'Keep your hips pressed against the back of the seat.' },
    { key: 'curl', text: 'Curl the<br>spine', anchor: 'backUpper', box: { left: 70, top: 128 }, cue: 'Curl your ribs down toward your pelvis.' },
    { key: 'core', text: 'Core leads', anchor: { at: 'navel', off: [8, 0] }, box: { left: 240, top: 226 }, cue: 'Start the crunch with your abs, not by pulling with your arms.' },
  ],
  tempo: [{ phase: 'Crunch', s: 2, move: true }, { phase: 'Return', s: 2, move: true }],
  mistake: {
    pose: mistakePose,
    guides: MISTAKE_ARM,
    tells: [
      // the faulty upper arm's front edge where it leaves the end figure (a point of MISTAKE_ARM), reached from open space
      { key: 'arms', text: 'Arms pull', anchor: [0, 0.9706, 0.1914], box: { left: 178, top: 114 }, cue: 'The arms drag the handles down.' },
      { key: 'upright', text: 'Trunk<br>upright', anchor: { at: 'backUpper', pose: 'mistake' }, box: { left: 26, top: 196 }, cue: 'The trunk stays upright and the spine does not curl.' },
    ],
  },
  alt: 'Machine crunch, side view. Seated with the hips back against the pad, shins against the roller and hands on the handles by the shoulders, the lifter curls the spine forward so the ribs come toward the pelvis.',
};
