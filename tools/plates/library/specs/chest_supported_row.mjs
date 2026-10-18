// Chest-supported row (selectorised or plate-loaded lever machine, neutral handles), side view, figure faces the chest
// pad (screen right). LB1, mode H, own parent; first user of the `chestRowMachine` composer.
// View: side (card plate.view, census view): the chest-to-pad contact, the elbows travelling back past the sides and the
// fault (leaning back off the pad with an arched low back) are all sagittal.
// Source: docs/research/howto/cards/chest_supported_row.json (claude/libht-research). Claims used: c1 (handles about
// level with the shoulders, feet planted), c2 (upright, arms straight to the handles, chest lightly on the pad), c3
// (shoulders back and down, wrists straight), c4 (elbows back close to the sides, chest stays on the pad), c5 (the pull
// ends as the elbows pass the sides, short pause), c6 (the fault: leaning back and arching the low back), c12 (tempo).
// Clone source: seated_cable_row (golden A, bc0f378): the seated row pose (upright trunk, neutral grip, elbows back
// close to the sides, handle path in front of the trunk); the machine is chestRowMachine (lb1/DESIGN.md 5).
// Geometry decisions:
//  - Seat top 47 cm, trunk vertical (tilt 0, trunk 0), feet flat on the floor 46 cm in front of the hip, knees ~90 deg.
//  - Chest pad upright (angle 0), its face on the chest landmark of the correct pose (c2, c4): 45 cm tall, 12 cm thick,
//    mounted on an arm to the front column. The pad does not move.
//  - Lever: a top pivot 1.85 m up and 55 cm in front of the hip line, carried on a short top beam from the front
//    column (80 cm, clear of the toes), so the lever stays clear of the face. End handle 98 cm, 3 cm in front of the
//    pad face, the elbows just behind the trunk (c4, c5); start handle on the same circle 72 cm forward (93 cm, 11 cm
//    below the shoulder joint): arms straight forward (elbow 11 deg) at about shoulder level (c1, c2). Two in-between
//    keys keep the hands on the lever circle, so the ghosts hold the handle (tested).
//  - Pad centred 8 cm below the chest landmark (its face plane passes through it), so its arm to the column runs under
//    the straight start arm, not along it. The 'chest' label points to the pad top just in front of the chest: the
//    hands cover the contact below, and the only open approach is from above, between the face and the lever.
//  - Mistake (card plate.mistake, c6): the pelvis rolls back 8 deg and the low back arches 8 deg, so the chest leaves
//    the pad (checked: the chest is behind the pad face; a gap dimension shows it) and the trunk leans 16 deg back; the
//    hands follow the lever 12 cm further round its arc. Legs and feet unchanged.
import { rootOnSeat, landmarksOf } from '../engine.mjs';
import { chestRowMachine, CHEST_ROW_ITEMS } from '../eq/chestRowMachine.mjs';
import { perItem } from '../eq/parts.mjs';

const H = 1.75;
const SEAT_TOP = 0.47;
const SEAT = [0, SEAT_TOP, 0];
const feet = { l: { at: [0.10, 0, 0.46] }, r: { at: [-0.10, 0, 0.46] } };
const GX = 0.22;                                        // handles 44 cm apart, either side of the pad (neutral grip)

const body = { root: { at: rootOnSeat(SEAT, 0), tilt: 0 }, trunk: 0, neck: 0, plant: feet };
const lm0 = landmarksOf({ ...body, shoulder: { flex: 0 } }, H);
// Pad face on the chest (c2, c4): the face plane passes through the chest landmark; the pad is centred 8 cm lower, so
// its arm to the column runs under the straight start arm, not along it.
const PAD_FACE = [0, lm0.chest[1] - 0.08, lm0.chest[2]];

const PIVOT = [0, 1.85, 0.55];
const END_Y = 0.98;                                     // end handle height

const COLUMN = 0.80;
const END_G = [0, END_Y, PAD_FACE[2] + 0.03];           // end handle just in front of the pad face: elbows just behind the trunk (c4, c5)
const LEVER = Math.hypot(END_G[1] - PIVOT[1], END_G[2] - PIVOT[2]);
const onLever = z => { const dz = PIVOT[2] - z; return [0, PIVOT[1] - Math.sqrt(LEVER * LEVER - dz * dz), z]; };
const START_G = onLever(0.72);                          // arms straight forward, a little below shoulder level (c1, c2)
const MIS_G = onLever(END_G[2] - 0.12);                 // the lean lets the hands travel 12 cm further back
export const MACHINE = { seat: [0, SEAT_TOP, -0.02], pad: { face: PAD_FACE, angle: 0, t: 0.12 }, pivot: PIVOT, lever: LEVER, column: COLUMN,
  footBar: null, floor: [-0.5, COLUMN + 0.3], grip: 'neutral' };

const grips = (g, pole) => ({ l: { at: [GX, g[1], g[2]], pole: [pole[0], pole[1], pole[2]] }, r: { at: [-GX, g[1], g[2]], pole: [-pole[0], pole[1], pole[2]] } });
const start = { ...body, scap: { elev: 0, pro: 2 }, reach: grips(START_G, [0.3, -1, 0]) };
const end = { ...body, scap: { elev: -1, pro: -3 }, reach: grips(END_G, [0.2, -0.6, -1]) };
// In-between keys with the hands on the lever circle, so the ghosts hold the handle (as machine_chest_press's via).
const via = [1 / 3, 2 / 3].map(t => ({ ...body, scap: { elev: -t, pro: 2 - 5 * t },
  reach: grips(onLever(START_G[2] + (END_G[2] - START_G[2]) * t), [0.3 - 0.1 * t, -1 + 0.4 * t, -t]) }));
const M_TILT = -8, M_TRUNK = -8;
const misBody = { root: { at: rootOnSeat(SEAT, M_TILT), tilt: M_TILT }, trunk: M_TRUNK, scap: { elev: 0, pro: -3 }, reach: grips(MIS_G, [0.2, -0.6, -1]) };
// Gap dimension for the Mistake (as machine_chest_press): from the faulty chest forward to the pad face, with 2 px ticks.
const lmM = landmarksOf({ ...end, ...misBody }, H);
const GAP_Y = lmM.chest[1], GAP = [[0, GAP_Y, lmM.chest[2]], [0, GAP_Y, PAD_FACE[2]]], TICK = 2 / 146.29;
const tick = p => ({ kind: 'line', pts: [[0, p[1] - TICK, p[2]], [0, p[1] + TICK, p[2]]] });

export default {
  id: 'chest_supported_row', name: 'Chest-Supported Row', view: 'side', facing: 'right',
  camera: { fit: true },
  poses: { start, end, via },
  equipment: [
    ...perItem(chestRowMachine(MACHINE), CHEST_ROW_ITEMS),
    { type: 'box', at: [0, PIVOT[1] + 0.02, (PIVOT[2] - 0.04 + COLUMN + 0.03) / 2], w: COLUMN + 0.03 - PIVOT[2] + 0.04, h: 0.06, rc: 1.5 },   // top beam to the pivot
    { type: 'pulley', at: PIVOT, r: 0.03 },                                                                                            // lever pivot
  ],
  checks: [
    { landmark: 'seat', plane: { point: SEAT, normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
    { landmark: 'chest', plane: { point: PAD_FACE, normal: [0, 0, 1] }, pose: 'start', tol: 1 },   // chest on the pad (c2)
    { landmark: 'chest', plane: { point: PAD_FACE, normal: [0, 0, 1] }, pose: 'end', tol: 1 },     // still on it (c4)
    { landmark: 'chest', above: { point: [0, PAD_FACE[1], PAD_FACE[2] - 0.03], normal: [0, 0, -1] }, pose: 'mistake' },   // off the pad
    { landmark: 'sole.r', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
  ],
  ghosts: { count: 3, parts: ['arm.r', 'lever'] },
  trace: { point: 'grip.r', trim: [10, 12] },
  callouts: [
    { key: 'chest', text: 'Chest<br>on pad', anchor: { at: 'chest', off: [4, -20] }, box: { left: 118, top: 86 }, cue: 'Keep the chest lightly on the pad from the first rep to the last.' },
    { key: 'elbows', text: 'Elbows<br>past sides', anchor: 'elbow.r', box: { left: 34, top: 214 }, cue: 'Each rep ends with the elbows close to the ribs and just behind the body.' },
    { key: 'shoulders', text: 'Shoulders<br>down', anchor: 'shoulderTop.r', box: { left: 34, top: 158 }, cue: 'Shoulders drawn back and down before the pull and kept there.' },
  ],
  tempo: [{ phase: 'Pull', s: 2, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Return', s: 2, move: true }],
  mistake: {
    pose: misBody,
    parts: ['torso', 'head', 'arm.r', 'lever'],
    guides: [
      { kind: 'arrow', from: { at: 'head', pose: 'end', off: [-16, 16] }, to: { at: 'head', off: [-8, 16] } },   // the trunk swings back
      { kind: 'line', pts: GAP }, tick(GAP[0]), tick(GAP[1]),   // chest-to-pad gap
    ],
    tells: [
      { key: 'lean', text: 'Leaning<br>back', anchor: 'head', box: { left: 10, top: 118 }, cue: 'The trunk leans back and the chest leaves the pad to finish the pull.' },
      { key: 'arch', text: 'Low back<br>arched', anchor: 'backMid', box: { left: 10, top: 216 }, cue: 'The low back arches to heave the handles in.' },
    ],
  },
  alt: 'Chest-supported row, side view. Seated upright with the chest on an upright pad and the feet flat, the lifter pulls lever handles from straight arms at about shoulder height back until the elbows pass the sides, chest kept on the pad.',
};
