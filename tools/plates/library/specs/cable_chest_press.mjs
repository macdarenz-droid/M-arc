// Cable chest press (standing, staggered stance, one cable column behind, single handles), side view, figure facing
// screen right. LIB-16 (LB6, mode H; census closest machine_chest_press; the split pose class, anchor reverse_lunge
// held: D-LIB16-SPLIT, no sheet until it is pinned).
// View: side (card plate.view = census view). The staggered stance, the handles at the nipple line, the back and the
// elbows locked at the front (c2, c4, c6, c17) read in the sagittal plane. One column shows in side view.
// Sources: research card docs/research/howto/cards/cable_chest_press.json (research head a8e66f32): callouts =
//  plate.checkpoints (c2 Staggered stance, c4 Handles at nipples, c6 Spine neutral); Mistake = plate.mistake (c17, c5:
//  the elbows locked straight at the front, drawable); tempo = plate.tempo (c15, c16: up 2, down 2, pause 0).
// Clone source: machine_chest_press (the 8, main; D-LIB16-CLONE) for the arms on the press line, the end bend
//  (machine_chest_press.mjs:45) and the handle height (:41), copied, never imported (D-LIB9-CLONE).
// Equipment: the vendor cableColumn (column, pulley, cable, stack) and floor; the single handle drawn here from `poly`
//  (D-LIB16-HANDLE; the vendor vHandle is a two-grip handle).
// Pose map (DESIGN.md section 9): identity. Start = plate.start as written (D-LIB16-CCP-START, #297 6343632260):
//  elbows just below 90 deg (c3), the handles at the nipple line (c4), so the handles stop about 32 cm in front of the
//  chest; c5's "about one inch" is not drawn (DESIGN.md sections 10 and 13). End = plate.end: arms pressed straight
//  ahead to almost-straight elbows (c3, c5), the body still (c7).
// Geometry decisions (confirmed by the engine report `angles` and `checks`):
//  Stance (c2): one foot in front of the other, mid-soles STAGGER apart, the near (right) foot forward, both feet flat
//   and planted in every pose; the hips over the middle of the two ankles, ROOT_DROP below standing hip height so both
//   legs reach the floor with soft knees. Pelvis and trunk upright, neutral (c6).
//  Handles (c3, c4): GRIP_DY below the shoulder joint (the nipple line), GRIP_DX outside the shoulder joints (just
//   outside shoulder width), on one level line (press straight ahead). The handle's depth is SOLVED in each pose for
//   the elbow flexion: START_FLEX (c3, just below 90 inside), END_FLEX (c5 almost locked), M_FLEX (c17 locked).
//  Column (c1): the pulley at the start handle's height (chest height), COLUMN_BACK behind the rear heel ("a foot or
//   two": the midpoint). The cable runs from the pulley to the handle behind the trunk (z center), never over it.
//  Mistake (c17, c5): only the elbows change, to straight; the handle travels with them (the stack rises).
// Unsourced numbers (SIZES below; lb6/sizes.json holds each with its basis): FEET_X, STAGGER, ROOT_DROP, GRIP_DY, GRIP_DX,
//  START_FLEX, END_FLEX, M_FLEX, COLUMN_BACK, HANDLE_GRIP, HANDLE_R, HANDLE_STRAP, FLOOR_BACK, FLOOR_FRONT. The elbow pole is an IK
//  hint, not a size.
import { landmarksOf, normPose, REF, resolve } from '../engine.mjs';

const H = 1.75, B = { height: H };
export const SIZES = Object.freeze({ FEET_X: 0.10, STAGGER: 0.53, ROOT_DROP: 0.06, GRIP_DY: 0.128, GRIP_DX: 0.03, START_FLEX: 91, END_FLEX: 18,
  M_FLEX: 0, COLUMN_BACK: 0.46, HANDLE_GRIP: 0.13, HANDLE_R: 0.008, HANDLE_STRAP: 0.10, FLOOR_BACK: 0.25, FLOOR_FRONT: 0.25 });
const { FEET_X, STAGGER, ROOT_DROP, GRIP_DY, GRIP_DX, START_FLEX, END_FLEX, M_FLEX, COLUMN_BACK, HANDLE_GRIP, HANDLE_R, HANDLE_STRAP, FLOOR_BACK, FLOOR_FRONT } = SIZES;

// Bracketed root finder (Illinois regula falsi, copied from back_extension, #274): throws when f(a) and f(b) have the
// same sign (D-LIB9-CLONE b).
export const bisect = (f, a, b) => {
  let fa = f(a), fb = f(b), side = 0;
  if (fa * fb > 0) throw new Error(`cable_chest_press: no solution in [${a}, ${b}]`);
  for (let i = 0; i < 80 && Math.abs(b - a) > 1e-8; i++) {
    const c = (a * fb - b * fa) / (fb - fa), fc = f(c);
    if (fc * fb > 0) { b = c; fb = fc; if (side === -1) fa /= 2; side = -1; } else if (fa * fc > 0) { a = c; fa = fc; if (side === 1) fb /= 2; side = 1; } else return c;
  }
  return (a + b) / 2;
};

const FRONT_Z = STAGGER / 2, REAR_Z = -STAGGER / 2;
const feet = { r: { at: [-FEET_X, 0, FRONT_Z], pole: [0, 0, 1] }, l: { at: [FEET_X, 0, REAR_Z], pole: [0, 0, 1] } };
// The hips over the middle of the two ankles (each ankle REF.mid H behind its mid-sole), so both legs reach alike.
const ROOT_Z = (FRONT_Z + REAR_Z) / 2 - REF.mid * H;
const body = { root: { at: [0, 0.53 * H - ROOT_DROP, ROOT_Z], tilt: 0 }, trunk: 0, neck: 0, plant: feet };
const L0 = landmarksOf(body, H), SH = L0['shoulder.r'];
const GRIP_Y = SH[1] - GRIP_DY, GX = Math.abs(SH[0]) + GRIP_DX;
const POLE = [-1, -0.3, -0.5];   // IK hint: the elbows out and a little down and back (c3 hammer grip)
const reachAt = z => ({ l: { at: [GX, GRIP_Y, z], pole: [-POLE[0], POLE[1], POLE[2]] }, r: { at: [-GX, GRIP_Y, z], pole: POLE } });
const flexAt = z => resolve(normPose({ ...body, reach: reachAt(z) }, B), B).q.elbow.r;
// Each handle depth solved for its elbow flexion (bracket: from 5 cm in front of the shoulder to full reach).
const REACH = (0.186 + 0.146 + 0.46 * 0.108) * H;
const zFor = flex => bisect(z => flexAt(z) - flex, SH[2] + 0.05, SH[2] + Math.sqrt(REACH ** 2 - GRIP_DY ** 2 - GRIP_DX ** 2) - 1e-4);
export const Z = { start: zFor(START_FLEX), end: zFor(END_FLEX) };
// Locked: the handle at full reach (elbow 0), along the same line.
Z.mistake = SH[2] + Math.sqrt(REACH ** 2 - GRIP_DY ** 2 - GRIP_DX ** 2);
void M_FLEX;
const start = { ...body, reach: reachAt(Z.start) };
const end = { ...body, reach: reachAt(Z.end) };
const via = [1 / 3, 2 / 3].map(t => ({ ...body, reach: reachAt(Z.start + (Z.end - Z.start) * t) }));
const mistakePose = { reach: reachAt(Z.mistake) };

// Column and pulley (c1): the pulley at the start handle's height, COLUMN_BACK behind the rear heel.
const LS = landmarksOf(start, H);
const COL_Z = LS['heel.l'][2] - COLUMN_BACK;
const PULLEY = [0, GRIP_Y, COL_Z];   // on the column's front face (the vendor column is 34 cm deep)
// The single handle (D-LIB16-HANDLE): a vertical neutral grip (c3) HANDLE_GRIP long through the grip centre, and a
// strap from both grip ends to the cable ring HANDLE_STRAP behind the grip, toward the pulley. Both are `poly`, so the
// handle is drawn in the Mistake view when it moves (PQ-H9).
const unit = v => { const k = Math.hypot(...v); return v.map(x => x / k); };
const handleOf = g => {
  const toward = unit([0, PULLEY[1] - g[1], PULLEY[2] - g[2]]), ring = g.map((v, i) => v + toward[i] * HANDLE_STRAP);
  const top = [0, g[1] + HANDLE_GRIP / 2, g[2]], bot = [0, g[1] - HANDLE_GRIP / 2, g[2]], w = HANDLE_R;
  return { ring, items: [
    { type: 'poly', pts: [[0, top[1], top[2] - w], [0, top[1], top[2] + w], [0, bot[1], bot[2] + w], [0, bot[1], bot[2] - w]], cls: 'eq-solid', z: 'mid', part: 'handle' },
    { type: 'poly', pts: [top, ring, bot], cls: 'eq', z: 'center', part: 'handle' },
  ] };
};
const gripOf = lm => [0, lm['grip.r'][1], lm['grip.r'][2]];
const START_RING = handleOf(gripOf(LS)).ring;
const FLOOR = { point: [0, 0, 0], normal: [0, 1, 0] };
const WS = { r: LS['wrist.r'], l: LS['wrist.l'] };

export const CCP = { pulley: PULLEY, colZ: COL_Z, z: Z, gripY: GRIP_Y, handleOf };
export default {
  id: 'cable_chest_press', name: 'Cable Chest Press', view: 'side', facing: 'right',
  camera: { x0: 190, y0: 339 },
  poses: { start, via, end },
  equipment: [
    { type: 'floor', from: COL_Z - FLOOR_BACK, to: Z.mistake + FLOOR_FRONT },
    lm => ({ type: 'cableColumn', base: [0, 0, COL_Z - 0.17], pulley: { at: PULLEY }, to: handleOf(gripOf(lm)).ring, rest: START_RING }),
    lm => handleOf(gripOf(lm)).items[0],
    lm => handleOf(gripOf(lm)).items[1],
  ],
  checks: [
    ...['heel.r', 'ball.r', 'heel.l', 'ball.l'].map(landmark => ({ landmark, plane: FLOOR, pose: 'all', tol: 0.5 })),   // c2 feet planted
    { landmark: 'wrist.r', at: WS.r, pose: 'start', tol: 0.5 },                                      // c1 a handle in each hand
    { landmark: 'wrist.l', at: WS.l, pose: 'start', tol: 0.5 },
  ],
  startParts: ['arm.r', 'handle'],
  ghosts: { count: 2, parts: ['arm.r', 'handle'] },
  trace: { point: 'grip.r', trim: [10, 12] },
  callouts: [
    { key: 'stance', text: 'Staggered<br>stance', anchor: 'toe.r', box: { left: 266, top: 262 }, cue: 'Stand with one foot in front of the other, feet planted.' },
    { key: 'height', text: 'Handles at<br>nipples', anchor: { at: 'grip.r', off: [0, 9] }, box: { left: 262, top: 188 }, cue: 'Bring the handles back to about nipple height, not the collarbone.' },
    { key: 'spine', text: 'Spine<br>neutral', anchor: 'backMid', box: { left: 74, top: 174 }, cue: 'Brace your abs and glutes and keep your back from arching.' },
  ],
  tempo: [{ phase: 'Press', s: 2, move: true }, { phase: 'Return', s: 2, move: true }],
  mistake: {
    pose: mistakePose,
    guides: [],
    tells: [
      { key: 'lock', text: 'Locked<br>elbows', anchor: { at: 'elbow.r', pose: 'mistake' }, box: { left: 166, top: 40 }, cue: 'The elbows lock straight at the front of the press.' },
    ],
  },
  alt: 'Cable chest press, side view. Standing in a staggered stance in front of a cable column, the lifter presses single handles from the nipple line straight ahead until the elbows are almost straight, body still.',
};
