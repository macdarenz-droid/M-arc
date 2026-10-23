// Hack squat (machine), side view, figure facing screen right. LIB-18 (LB8, mode H; tier B; census closest leg_press,
// closeness E; the recline pose class, proven on leg_press: D-LIB18-CLASSES; composer `hackSled`, single use, its own
// anchor: plan 2.1:141, D-LIB18-COMPOSERS).
// View: side (card plate.view = census view). The depth (c4, c5), the back and hips on the pad (c2), the whole foot on
//  the plate (c6, c14), the slight knee bend at the top (c7) and the fault, the lower back rounding off the pad at the
//  bottom (c8, c9, c10), all read side-on.
// Sources: research card docs/research/howto/cards/hack_squat.json (research head 596dbe07): callouts =
//  plate.checkpoints (c2 Back on pad; c4, c5 Thighs to parallel; c7 Slight knee bend); Mistake = plate.mistake (c8, c9,
//  c10: at the bottom the lower back rounds and lifts off the back pad; drawable true); tempo = the card's tempo with
//  lb8/tempo.json's row (c20 down 3, up 1; c21 pause 1, a drawing convention); Trace = plate.frames "Trace follows the
//  knee" (D-LIB18-TRACE).
// Clone source: leg_press (the 8, main tools/plates/vendor/exercises/leg_press.mjs), copied, never imported
//  (D-LIB9-CLONE): the sled travel read back from the body (leg_press.mjs:56 `travelOf`, here from the upper back on the
//  pad instead of the feet, since on a hack squat the foot plate is fixed and the sled moves with the lifter), the back
//  pad tangent to the upper back and the buttock (:75-77), the butt-wink Mistake (:85-93, M_ROLL about the lumbar pivot)
//  and the shoulder-width, toes-out plant (:30-34).
// Equipment: eq/hackSled.mjs (rail, fixed foot plate, fail-safe stop, frame; the moving sled with the back pad, the
//  shoulder pad and the handle); floor.
// Pose map (DESIGN.md section 9): identity. Start = plate.start (standing in the sled: shoulders under the shoulder pad,
//  back and hips on the back pad, c1, c2; feet shoulder-width mid-plate, toes slightly out, c1, c12, c13; hands on the
//  handles, c18; legs extended with a slight knee bend, c3, c7). End = plate.end (the bottom: knee about 90 with the
//  thighs about parallel to the plate, c4, c5; hips and lower back on the pad, c2; knees in line with the toes, c13;
//  whole foot on the plate, c6, c14).
// Geometry decisions (confirmed by the engine report `angles`, `checks` and `measure`, and the drawn-item tests):
//  The rail and the back pad on its sled rise RAIL from level toward the back; the pelvis tilt is SOLVED (bisection) so
//   the line through the upper back and the buttock (the pad face, tangent to both) runs at RAIL with a neutral spine.
//  The foot plate is level (PLATE_TILT 0): c5 asks for the thighs "at least parallel to the floor" and c7 for "parallel
//   to the footplate"; on a level plate both are one line, and with the knee at 90 (c4) the shin then stands square to
//   the plate and the foot lies flat on it with the ankle neutral (c6, c14).
//  Bottom: the hip on the pad, the thigh level, the knee 90 (c4): the sole's place on the plate is SOLVED (bisection) so
//   the drawn knee bends exactly 90 with the feet at FOOT_X; the foot plate's centre is the sole's (mid-plate, c12).
//  Top: the sled travels up the rail (the body moves with it, the feet stay on the fixed plate) until the knee is
//   KNEE_TOP short of straight (c7), the travel SOLVED (bisection); the hands stay on the handles, which ride on the sled.
//  Toes out TOE_OUT (c12 "toes slightly pointed out", c13 "knees align with your toes"): at the shoulder-width stance the
//   toe line that lies in the leg's own bend plane with the sole flat on the plate, so the knee tracks the toes and every
//   foot contact holds within 0.5 cm.
//  The Mistake (c8, c9, c10; leg_press.mjs:85-93): at the same sled place the pelvis rolls back M_ROLL about the lumbar
//   pivot (lumbar flexion), the thorax stays on the pad, so the sacrum and buttock peel off it (6.4 and 7.9 cm; drawn as a
//   dashed red contour over the end figure) and the hips rise (c9) with the feet still flat on the plate.
//  Every bisection throws on a bracket with no sign change (D-LIB9-CLONE b). They solve to: TILT (the pad line at RAIL),
//   SOLE_Z (knee 90 at the bottom), TRAVEL (knee KNEE_TOP at the top) and RAIL_LO (the rail's foot at the plate bracket).
// Labels: the back side of the body lies on the pad, so no leader reaches the back from the open side; "Back on pad" and
//  both tells meet the front of the hips and trunk (DESIGN.md: hack_squat label scan). "Slight knee bend" meets the start
//  knee, which sits in a pocket closed by the end thigh, the rail, the foot plate and the start shin with its ghosts: its
//  leader crosses the rail (named-nit candidate, D-LIB15-NIT1; the scan is in the LB8 note).
// Camera: fit (capped at the reference scale).
// Unsourced numbers (SIZES below; lb8/sizes.json holds each with its basis): RAIL, PLATE_TILT, PLATE_Y, KNEE_TOP, FOOT_X,
//  TOE_OUT, NECK, M_ROLL, HANDLE_X, HANDLE_N, HANDLE_DOWN, POLE_OUT, PAD_BELOW, RAIL_ABOVE, STOP_GAP, FLOOR_BACK,
//  FLOOR_FRONT, FLOOR_LINE, TRACE_TRIM; the composer's HACK_SLED constants; TILT, SOLE_Z, TRAVEL and RAIL_LO solved. The
//  knee 90 is c4's.
import { WINTER, REF, landmarksOf } from '../engine.mjs';
import { add, mul, sub, perItem } from '../eq/parts.mjs';
import { hackSled, HACK_SLED, HACK_SLED_ITEMS } from '../eq/hackSled.mjs';

const H = 1.75, R = Math.PI / 180;
export const SIZES = Object.freeze({ RAIL: 45, PLATE_TILT: 0, PLATE_Y: 0.20, KNEE_TOP: 15, FOOT_X: 0.17, TOE_OUT: 8, NECK: 5, M_ROLL: 25,
  HANDLE_X: 0.25, HANDLE_N: 0.24, HANDLE_DOWN: 0.06, POLE_OUT: 0.6, PAD_BELOW: 0.10, RAIL_ABOVE: 0.10, STOP_GAP: 0.02, FLOOR_BACK: 0.15,
  FLOOR_FRONT: 0.10, FLOOR_LINE: 0.05, TRACE_TRIM: [6, 8] });
const { RAIL, PLATE_TILT, PLATE_Y, KNEE_TOP, FOOT_X, TOE_OUT, NECK, M_ROLL, HANDLE_X, HANDLE_N, HANDLE_DOWN, POLE_OUT, PAD_BELOW, RAIL_ABOVE,
  STOP_GAP, FLOOR_BACK, FLOOR_FRONT, FLOOR_LINE, TRACE_TRIM } = SIZES;

const dot = (a, b) => a.reduce((s, v, i) => s + v * b[i], 0);
// Bisection on a bracket (throws when the bracket holds no sign change; D-LIB9-CLONE b).
const bisect = (f, a, b, what) => {
  let fa = f(a);
  if (fa * f(b) > 0) throw new Error(`hack_squat: no solution for ${what} in [${a}, ${b}]`);
  for (let i = 0; i < 50; i++) { const m = (a + b) / 2, fm = f(m); if (fa * fm <= 0) b = m; else { a = m; fa = fm; } }
  return (a + b) / 2;
};
const ang3 = (a, v, b) => { const p = sub(a, v), q = sub(b, v); return Math.acos(dot(p, q) / Math.hypot(...p) / Math.hypot(...q)) / R; };
const L = p => landmarksOf(p, H);

// The rail (and the back pad on its sled) rises RAIL deg from level toward the back: U up the rail, N the pad's face
// normal toward the lifter.
const U = [0, Math.sin(RAIL * R), -Math.cos(RAIL * R)], N = [0, Math.cos(RAIL * R), Math.sin(RAIL * R)];
const padAngle = tilt => { const l = L({ root: { at: [0, 1, 0], tilt } }), d = sub(l.backUpper, l.buttock); return Math.atan2(d[1], -d[2]) / R; };
export const TILT = bisect(t => padAngle(t) - RAIL, -80, -10, 'the pelvis tilt that lays the back pad line at RAIL');

// Foot plate: top face at PLATE_Y, tilted PLATE_TILT toes up (level); the toes turned out TOE_OUT about its normal.
const PA = PLATE_TILT * R, PD = [0, Math.sin(PA), Math.cos(PA)], PN = [0, Math.cos(PA), -Math.sin(PA)];
const toeOf = sx => { const o = TOE_OUT * R; return [sx * Math.sin(o), PD[1] * Math.cos(o), PD[2] * Math.cos(o)]; };
const LT = WINTER.thigh * H, LSH = WINTER.shank * H;
const HIP = [0, PLATE_Y + WINTER.ankleH * H + LSH, 0];               // thigh level, shin square to the level plate (sagittal build)
const SOLE0 = HIP[2] + LT + REF.mid * H;
const feetAt = z => ({ l: { at: [FOOT_X, PLATE_Y, z], normal: PN, toe: toeOf(1) }, r: { at: [-FOOT_X, PLATE_Y, z], normal: PN, toe: toeOf(-1) } });
const kneeOf = l => 180 - ang3(l['hip.r'], l['knee.r'], l['ankle.r']);   // knee bend from straight (deg)
const base = { root: { at: HIP, tilt: TILT }, trunk: 0, neck: NECK };
export const SOLE_Z = bisect(z => kneeOf(L({ ...base, plant: feetAt(z) })) - 90, SOLE0 - 0.15, SOLE0 + 0.05, 'the sole place that bends the knee 90');
const PLANT = feetAt(SOLE_Z);
const LB = L({ ...base, plant: PLANT });
export const TRAVEL = bisect(d => kneeOf(L({ ...base, root: { at: add(HIP, mul(U, d)), tilt: TILT }, plant: PLANT })) - KNEE_TOP, 0.05, 0.6, 'the sled travel to the top knee');
const PAD_AT = LB.buttock;                                           // the pad face line: through the end buttock, along U
const SP = dot(sub(LB['trap.r'], PAD_AT), U);                        // the shoulder pad's lower face rests on the shoulders
const gripAt = sx => { const g = add(add(PAD_AT, mul(U, SP - HANDLE_DOWN)), mul(N, HANDLE_N)); return [sx * HANDLE_X, g[1], g[2]]; };
// hands on the handles, elbows hanging down along the trunk and out to the sides
const handsAt = d => ({ l: { at: add(gripAt(1), mul(U, d)), pole: [POLE_OUT - U[0], -U[1], -U[2]] }, r: { at: add(gripAt(-1), mul(U, d)), pole: [-POLE_OUT - U[0], -U[1], -U[2]] } });
const end = { ...base, plant: PLANT, reach: handsAt(0) };
const start = { ...base, root: { at: add(HIP, mul(U, TRAVEL)), tilt: TILT }, plant: PLANT, reach: handsAt(TRAVEL) };
const LE = L(end), LS = L(start);
// sled travel of any pose, read back from the upper back on the pad (so ghosts move the sled with the body; in the
// Mistake the thorax stays on the pad, so the sled stays where the end pose has it)
const travelOf = lm => dot(sub(lm.backUpper, LE.backUpper), U);
// Mistake: butt wink (leg_press.mjs:85-93): the pelvis rolls back M_ROLL about the lumbar pivot, the thorax stays put
const lumbarRot = (() => {
  const Lp = LE.lumbar, t = -M_ROLL * R, v = [0, HIP[1] - Lp[1], HIP[2] - Lp[2]], c = Math.cos(t), s = Math.sin(t);
  return [0, Lp[1] + v[1] * c - v[2] * s, Lp[2] + v[1] * s + v[2] * c];
})();
const mistakePose = { root: { at: lumbarRot, tilt: TILT - M_ROLL }, trunk: M_ROLL };

const C = HACK_SLED, PAD_HI = SP + C.shoulderT, railOff = -(C.padT + C.carriageT + C.railT / 2);
// the rail comes down to the foot plate's bracket level, under the plate's rear half
export const RAIL_LO = bisect(s => add(add(PAD_AT, mul(U, s)), mul(N, railOff))[1] - (PLATE_Y - C.plateT - C.bracketT), -2, 0, 'the rail bottom');
const RAIL_HI = PAD_HI + TRAVEL + RAIL_ABOVE;
const railHiZ = add(add(PAD_AT, mul(U, RAIL_HI)), mul(N, railOff))[2];
const sledP = { u: U, n: N, pad: { at: PAD_AT, lo: -PAD_BELOW, hi: PAD_HI }, shoulder: SP, grip: gripAt(-1), rail: { lo: RAIL_LO, hi: RAIL_HI },
  stop: -PAD_BELOW - STOP_GAP, plate: { at: [0, PLATE_Y, SOLE_Z], tilt: PLATE_TILT }, floorZ: [railHiZ - FLOOR_BACK, SOLE_Z + C.plateLen / 2 + FLOOR_FRONT] };
// Start phantom (DRAWING-GUIDE.md 4; D-LIB18-DRAW): the start layer never draws moving equipment, so the start sled's
// back pad and shoulder pad are redrawn as dashed outlines in the end layer.
const outline = (a, b, n, t) => [a, b, add(b, mul(n, t)), add(a, mul(n, t)), a];
const face = (s, off = 0) => add(add(add(PAD_AT, mul(U, s)), mul(N, off)), mul(U, TRAVEL));
const startPhantom = [
  { type: 'line', pts: outline(face(-PAD_BELOW), face(PAD_HI), N, -C.padT), cls: 'eq-line m-line', z: 'back', part: 'startSled' },
  { type: 'line', pts: outline(face(SP), face(SP, C.shoulderLen), U, C.shoulderT), cls: 'eq-line m-line', z: 'back', part: 'startSled' },
];
// The knee bend arc (pull_up's and bench_dip's convention: bend from straight): from the end thigh extended past the
// knee to the ankle, in front of the shin, so its leader starts in open space.
const THIGH_DIR = [LE['knee.r'][2] - LE['hip.r'][2], LE['knee.r'][1] - LE['hip.r'][1]];
const PAD_PLANE = { point: PAD_AT, normal: N }, PLATE_PLANE = { point: [0, PLATE_Y, 0], normal: PN };
const shoulderFace = d => ({ point: add(add(PAD_AT, mul(U, SP)), mul(U, d)), normal: U });

export const HS = { U, N, LE, LS, TILT, SOLE_Z, TRAVEL, RAIL_LO, RAIL_HI, SP, PAD_PLANE, PLATE_PLANE, sledP, mistakePose, travelOf, startPhantom };
// The card's contact facts (lb8 DESIGN.md; D-LIB18-FACTS): each bound by a check on its landmark in its pose, at the
// drawn point (H6 reads the report's checks); the drawn-item tests prove the contact itself.
const factChecks = (pose, p, names) => names.map(landmark => ({ landmark, at: L(p)[landmark], pose, tol: 0.5 }));
export default {
  id: 'hack_squat', name: 'Hack Squat', view: 'side', facing: 'right',
  camera: { fit: true },
  poses: { start, end },
  equipment: [
    { type: 'floor', from: sledP.floorZ[0] - FLOOR_LINE, to: sledP.floorZ[1] + FLOOR_LINE },
    ...perItem(lm => hackSled({ ...sledP, travel: travelOf(lm) }), HACK_SLED_ITEMS),
    ...perItem((lm, ctx) => (ctx.pose === 'end' ? startPhantom : []), startPhantom.length),
  ],
  checks: [
    ...factChecks('start', start, ['wrist.l', 'wrist.r']),
    // c2 "throughout": the upper back on the pad in every pose (the thorax stays on it in the Mistake too), the hips
    // (buttock) on it at the start and the end; neither ever inside the pad
    { landmark: 'backUpper', plane: PAD_PLANE, pose: 'all', tol: 0.5 },
    ...['start', 'end'].map(pose => ({ landmark: 'buttock', plane: PAD_PLANE, pose, tol: 0.5 })),
    ...['backUpper', 'backMid', 'sacrum', 'buttock'].map(landmark => ({ landmark, above: PAD_PLANE, pose: 'all', tol: 0.5 })),
    // c1: the shoulders under the shoulder pad (its lower face rides with the sled)
    ...['trap.l', 'trap.r'].flatMap(landmark => [{ landmark, plane: shoulderFace(TRAVEL), pose: 'start', tol: 0.5 }, { landmark, plane: shoulderFace(0), pose: 'end', tol: 0.5 }]),
    // c6, c14: the whole foot (heel and ball) on the plate in every pose, the toes not through it
    ...['heel.l', 'heel.r', 'ball.l', 'ball.r'].map(landmark => ({ landmark, plane: PLATE_PLANE, pose: 'all', tol: 0.5 })),
    ...['toe.l', 'toe.r'].map(landmark => ({ landmark, above: PLATE_PLANE, pose: 'all', tol: 0 })),
  ],
  ghosts: { count: 3, parts: ['leg.r'] },
  trace: { point: 'knee.r', trim: TRACE_TRIM },
  measure: { vertex: 'knee.r', from: { dir: THIGH_DIR }, to: 'ankle.r', radius: 22, title: 'Knee', value: 'about 90°', expect: 90, box: { left: 270, top: 264 } },
  callouts: [
    // c2: on the front of the trunk at the lumbar level, from the open space above (the back itself lies on the pad)
    { key: 'back', text: 'Back on<br>pad', anchor: 'navel', box: { left: 160, top: 124 }, cue: 'Upper and lower back and hips stay on the back pad.' },
    // c4, c5: on the thigh's top edge, from the open space above the legs
    { key: 'parallel', text: 'Thighs to<br>parallel', anchor: { along: ['hip.r', 'knee.r'], t: 0.55, off: [0, -11] }, box: { left: 250, top: 164 }, cue: 'Lower until your thighs are at least parallel, as far as your mobility allows.' },
    // c7: on the start knee (named-nit candidate: the leader crosses the rail, see the header)
    { key: 'soft', text: 'Slight<br>knee bend', anchor: { at: 'knee.r', pose: 'start' }, box: { left: 80, top: 280 }, cue: 'Extend fully but keep a slight bend, without locking the knees.' },
  ],
  tempo: [{ phase: 'Lower', s: 3, move: true }, { phase: 'Push', s: 1, move: true }, { phase: 'Hold', s: 1 }],
  mistake: {
    pose: mistakePose,
    parts: ['torso', 'leg.r', 'leg.l'],
    guides: [
      // the faulty back contour: backMid stays near the pad, the sacrum and buttock peel off it (6.4 and 7.9 cm)
      { kind: 'dashed', smooth: true, pts: [{ at: 'backMid', pose: 'mistake' }, { at: 'sacrum', pose: 'mistake' }, { at: 'buttock', pose: 'mistake' }, { at: 'seat', pose: 'mistake' }] },
    ],
    tells: [
      // c8 "lift their lower back off the back pad", c9 "having your hips leave the backrest": on the red thigh root's top
      // edge, raised above the end thigh as the hips leave the pad
      { key: 'lift', text: 'Hips off<br>pad', anchor: { at: 'buttock', pose: 'mistake' }, box: { left: 250, top: 164 }, cue: 'At the bottom the hips and lower back lift off the back pad.' },
      // c10 "your lower back rounds": the pelvis rolls back, so the front of the red pelvis (the groin, a rigid pelvis
      // point, given from the pelvis's seat landmark) swings up off the end outline
      { key: 'round', text: 'Lower back<br>rounds', anchor: { at: 'sacrum', pose: 'mistake' }, box: { left: 64, top: 260 }, cue: 'The lower back rounds at the bottom of the squat.' },
    ],
  },
  alt: 'Hack squat, side view. Shoulders under the pads, back on the tall pad of a sled on angled rails, feet flat on a fixed plate, the lifter lowers until the knees bend about 90 degrees with the thighs level, hips on the pad, then pushes back to almost straight legs.',
};
