// Single-arm lat pulldown (one D-handle, near arm), side view, figure faces the machine (screen right). LB1, mode H.
// Clone source: close_grip_pulldown at f94905c (the fixed LB1 pulldown: lat_pulldown's station with the column 18 cm
// further back, stack rods, stack lift from the cable length, label rules), itself cloned from lat_pulldown (golden A).
// View: side (card plate.view, census view): the elbow path down to the side and the shoulder rolling forward are
// sagittal. The torso twist (c6) is a rotation the side view cannot show, so it is not drawn.
// Source: docs/research/howto/cards/single_arm_lat_pulldown.json (claude/libht-research). Claims used: c1 (single handle
// on the pulldown machine, thighs tight under the pads), c2 (elbow back and down toward the back pocket until the handle
// just passes chin height), c3 (shoulder down away from the ear first, upper arm flush with the side), c4 (the cable
// lifts the shoulder toward the ear at the top; brief pause at the bottom), c7/c11 (torso upright, no lean), c10/c13
// (the fault: pulling past the end, the elbow driving back behind the body and the shoulder rolling forward), c14
// (tempo 2 s pull, 1 s pause, 2 s return).
// Geometry decisions:
//  - Station, seat, knee roller, pulleys, 16 x 5 kg stack and guide rods exactly as close_grip_pulldown (R7 within LB1).
//  - D-handle (dHandle composer: grip 12 cm, ring 13 cm toward the cable) in the near (right) hand, on the cable from
//    the head pulley; the cable line runs from the ring to the pulley's front tangent, as close_grip draws it.
//  - Torso upright (c7, c11): pelvis tilt -3, trunk -2, about 5 deg back at the hip, the same in every pose.
//  - Start (c4): near arm long overhead on the cable line, the near shoulder shrugged 3 cm toward the ear.
//  - End (c2, c3): grip centre 12 cm under the chin and 5 cm in front of it, the shoulder drawn down 2 cm and back 1 cm,
//    the elbow pole down, back and out, so the upper arm finishes near the side (about 19 deg forward).
//  - Free (far) hand rests on the far thigh behind the pad in every pose (not given by the card; hidden by the trunk
//    in this view).
//  - Mistake (card plate.mistake, c10, c13; lib4-cards 13.4 must-fix 1, Q-R2-1): the handle pulled on well past the
//    end (grip 10 cm under and 4 cm behind the chest mark), the elbow driven back 13.8 cm behind the end backMid with its
//    red cap 11.1 px clear of the solid end figure (targets: 10 cm, 6 px), and the near shoulder protracted 4 cm (rolled
//    forward). The torso keeps the upright posture. The handle sits where the arm puts it, behind the solid torso, so
//    the moving cable is drawn dashed from the Mistake ring to the head pulley, as close_grip draws it.
//  - End handle height: the grip centre is 12 cm under the chin (the fist top at about mouth level), not at the chin
//    itself; with the grip at the chin the elbow finishes 15 cm in front of the shoulder, not near the side (c3).
//  - In-between keys (lib4-cards 13.3 must-fix 3): grip in even steps down the cable line at t = 1/4, 1/2, 3/4, the
//    shoulder drawn down as it goes, elbow poles turned from out to down; the elbow falls at every step (1.335, 1.250,
//    1.111, 0.880, 0.667 m) and stays in front of the shoulder.
//  - Mistake tells: 'past' (the elbow behind the body) and 'low' (the handle pulled past the end), the card's two
//    visible signs that the side view shows; the shoulder roll stays inside the trunk and stays unlabelled (Q-D5-5).
//  - Labels: 'shoulder' and the Mistake tell sit left of the back with level leaders; 'pocket' below them; 'thighs' right
//    of the knee as on close_grip. The 'shoulder' and 'pocket' leaders cross the back to anchors inside the outline.
//    The 'low' tell points at the red arrow's tip, right of the chest on the open side.
// CARD: thighs under the pads (c1), handle just past chin height (c2), upper arm at the side (c3), shoulder up at the
//  top (c4), torso upright (c7, c11), tempo (c14). Unsourced numbers: GX 0.18 (handle under the near shoulder), REACH
//  0.13 m (D-handle), TILT -3 / TRUNK -2 (card: "upright", no angle), START_Y 1.668 and the 3 cm start shrug (card: "the
//  cable lifts the shoulder", no size), END_G 12 cm under and 5 cm in front of the chin, end scap -2/-1, MIS_G 10 cm
//  under and 4 cm behind the chest mark, the Mistake elbow pole [-0.4, 0.3, -1], Mistake protraction 4 cm, the 'past' box
//  top 236 px, the in-between poles (VIA_POLES), the free hand on the far thigh; the station sizes as
//  close_grip_pulldown.
import { rootOnSeat, landmarksOf } from '../engine.mjs';
import { perItem } from '../eq/parts.mjs';
import { dHandle, dHandleRing, D_HANDLE_ITEMS } from '../eq/dHandle.mjs';

const H = 1.75;
const SEAT_TOP = 0.42;
const SEAT = [0, SEAT_TOP, 0];
const feet = { l: { at: [0.10, 0, 0.50] }, r: { at: [-0.10, 0, 0.50] } };
const GX = 0.18;                                        // the handle under the near shoulder
const REACH = 0.13;                                     // grip to the cable ring (dHandle reach)
const HEAD = { z: 0.17, y: 2.08, r: 0.045 };
const COL = { z0: 1.04, z1: 1.30, h: 2.16 };
const COLP = { r: 0.035 };
const STACK_Z = (COL.z0 + COL.z1) / 2;
COLP.z = STACK_Z - COLP.r; COLP.y = HEAD.y + HEAD.r - COLP.r;

const TILT = -3, TRUNK = -2;
const body = { root: { at: rootOnSeat(SEAT, TILT), tilt: TILT }, trunk: TRUNK, neck: -4, plant: feet };
const lm0 = landmarksOf({ ...body, shoulder: { flex: 0 } }, H);
// far hand on the far thigh, behind the knee pad
const FREE = { at: [0.12, lm0['thighTop.l'][1] + 0.025, lm0['thighTop.l'][2] - 0.12], pole: [1, -0.2, -0.6] };
const reach = (c, pole) => ({ l: FREE, r: { at: [-GX, c[1], c[2]], pole } });
// The handle hangs on the cable from the head pulley: its ring sits REACH along the cable line above the grip.
const toward = g => { const d = [0, HEAD.y - g[1], HEAD.z - g[2]], L = Math.hypot(...d); return d.map(v => v / L); };
const ringOf = g => dHandleRing(g, toward(g), REACH);
// End: grip centre just past chin height (c2).
const END_G = [0, lm0.chin[1] - 0.12, lm0.chin[2] + 0.05];
// Start: arm long overhead on the same cable line.
const cd = toward(END_G);
const START_Y = 1.668;
const START_G = [0, START_Y, END_G[2] + cd[2] / cd[1] * (START_Y - END_G[1])];

const start = { ...body, scap: { l: { elev: 0, pro: 0 }, r: { elev: 3, pro: 1 } }, reach: reach(START_G, [-1, 0.1, 0.2]) };
const end = { ...body, scap: { l: { elev: 0, pro: 0 }, r: { elev: -2, pro: -1 } }, reach: reach(END_G, [-0.5, -1, -1.5]) };
// In-between keys at t = 1/4, 1/2, 3/4 (the ghosts): the grip in even steps down the cable line, the shoulder drawn down
// as it goes, and the elbow pole turned from out-and-forward to down, so the elbow falls at every step and stays in
// front of the shoulder (lib4-cards 13.3 must-fix 3).
const VIA_POLES = [[-1, -0.4, 0.1], [-0.6, -0.9, 0.1], [-0.2, -1, -0.6]];
const via = VIA_POLES.map((pole, i) => {
  const f = (i + 1) / 4, g = START_G.map((v, k) => v + (END_G[k] - v) * f);
  return { ...body, scap: { l: { elev: 0, pro: 0 }, r: { elev: 3 - 5 * f, pro: 1 - 2 * f } }, reach: reach(g, pole) };
});
// Mistake: pulled past the end, the elbow back behind the trunk, the shoulder rolled forward.
const MIS_G = [0, lm0.chest[1] - 0.10, lm0.chest[2] - 0.04];
const misBody = { scap: { l: { elev: 0, pro: 0 }, r: { elev: 0, pro: 4 } }, reach: reach(MIS_G, [-0.4, 0.3, -1]) };

const PAD_AT = lm0['thighTop.r'];
const PAD = { at: [0, PAD_AT[1], PAD_AT[2]], r: 0.055 };

function headTangent(b) {
  const dz = b[2] - HEAD.z, dy = b[1] - HEAD.y, D = Math.hypot(dz, dy), a0 = Math.atan2(dy, dz), al = Math.acos(HEAD.r / D);
  const c = [a0 + al, a0 - al].map(a => [0, HEAD.y + HEAD.r * Math.sin(a), HEAD.z + HEAD.r * Math.cos(a)]);
  return c[0][2] < c[1][2] ? c[0] : c[1];
}
export const gripOf = lm => [0, lm['grip.r'][1], lm['grip.r'][2]];
const cableLen = g => Math.hypot(ringOf(g)[1] - HEAD.y, ringOf(g)[2] - HEAD.z);
export const LIFT0 = 0.03;
export const HANDLE = { grip: gripOf, toward, reach: REACH, ringOf, headTangent };

export default {
  id: 'single_arm_lat_pulldown', name: 'Single-Arm Lat Pulldown', view: 'side', facing: 'right',
  camera: { fit: true },
  poses: { start, via, end },
  equipment: [
    { type: 'floor', from: -0.5, to: 1.48 },
    ...[[-0.22, 0.30], [0.84, COL.z1]].map(([a, b]) => ({ type: 'box', at: [0, 0.022, (a + b) / 2], w: b - a, h: 0.044, rc: 1, z: 'center' })),
    { type: 'box', at: [0, COL.h + 0.03, (HEAD.z - 0.08 + COL.z1 + 0.03) / 2], w: COL.z1 + 0.03 - HEAD.z + 0.08, h: 0.06, rc: 1.5 },
    { type: 'line', cls: 'eq', pts: [[0, COL.h, HEAD.z], [0, HEAD.y, HEAD.z]] },
    { type: 'line', cls: 'eq', pts: [[0, COL.h, COLP.z], [0, COLP.y, COLP.z]] },
    ...[COL.z0, COL.z1].map(z => ({ type: 'box', at: [0, COL.h / 2, z], w: 0.05, h: COL.h, rc: 1 })),
    { type: 'seat', at: [0, SEAT_TOP, 0.02], len: 0.42 },
    { type: 'kneePad', at: PAD.at, r: PAD.r, normal: [0, 1, 0], postTo: [0, 0.26, 0.03], z: 'center' },
    { type: 'kneePad', at: PAD.at, r: PAD.r, normal: [0, 1, 0], z: 'front' },
    { type: 'pulley', at: [0, HEAD.y, HEAD.z], r: HEAD.r },
    { type: 'pulley', at: [0, COLP.y, COLP.z], r: COLP.r },
    { type: 'cable', from: [0, HEAD.y + HEAD.r, HEAD.z], to: [0, COLP.y + COLP.r, COLP.z], z: 'back' },
    (lm, ctx) => {
      const lift = LIFT0 + cableLen(gripOf(lm)) - cableLen(gripOf(ctx.start));   // the cable pays out as the handle comes down: the stack rises
      return [
        { type: 'stack', base: [0, 0, STACK_Z], plates: 16, load: 8, w: 0.16, lift, rods: false, part: 'stack' },
        { type: 'cable', from: [0, COLP.y, STACK_Z], to: [0, 0.06 + 16 * 0.025 + lift, STACK_Z], z: 'back', part: 'stack' },
      ];
    },
    // D-handle in the near hand and its cable to the head pulley
    ...perItem(dHandle({ grip: gripOf, toward, reach: REACH }), D_HANDLE_ITEMS),
    lm => ({ type: 'cable', from: ringOf(gripOf(lm)), to: headTangent(ringOf(gripOf(lm))), z: 'mid', part: 'handle' }),
    ...[-0.05, 0.05].map(o => ({ type: 'line', cls: 'eq-thin', pts: [[0, 0.06, STACK_Z + o], [0, 1.95, STACK_Z + o]] })),
  ],
  checks: [
    { landmark: 'seat', plane: { point: SEAT, normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
    { landmark: 'thighTop.r', plane: { point: PAD.at, normal: [0, 1, 0] }, pose: 'all', tol: 1 },
    { landmark: 'thighUnder.r', above: { point: SEAT, normal: [0, 1, 0] }, pose: 'all' },
  ],
  ghosts: { count: 3, parts: ['arm.r', 'handle'] },
  trace: { point: 'grip.r', trim: [10, 12] },
  callouts: [
    { key: 'thighs', text: 'Thighs<br>pinned', anchor: { at: 'thighTop.r', off: [14, 0] }, box: { left: 188, top: 236 }, cue: 'Set the thighs tight under the pads.' },
    { key: 'shoulder', text: 'Shoulder<br>down first', anchor: 'shoulderTop.r', box: { left: 4, top: 181 }, cue: 'Drop the shoulder away from the ear before the elbow bends.' },
    { key: 'pocket', text: 'Elbow<br>to pocket', anchor: 'elbow.r', box: { left: 4, top: 262 }, cue: 'Pull the elbow back and down toward the back pocket.' },
  ],
  tempo: [{ phase: 'Pull', s: 2, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Return', s: 2, move: true }],
  mistake: {
    pose: misBody,
    parts: ['arm.r', 'handle'],
    guides: [
      { kind: 'dashed', pts: [ringOf(MIS_G), headTangent(ringOf(MIS_G))] },
      { kind: 'arrow', from: { at: 'grip.r', pose: 'end', off: [14, 0] }, to: { at: 'grip.r', off: [14, 0] } },
    ],
    tells: [
      { key: 'past', text: 'Elbow<br>goes back', anchor: 'elbow.r', box: { left: 4, top: 236 }, cue: 'The elbow drives back behind the body past the end.' },
      { key: 'low', text: 'Pulled<br>too low', anchor: { at: 'grip.r', off: [14, 0] }, box: { left: 176, top: 222 }, cue: 'The handle keeps going down well past the chin.' },
    ],
  },
  alt: 'Single-arm lat pulldown, side view. Seated with the thighs under the knee pad, one hand pulls a single handle from a long arm overhead down until it just passes the chin, the elbow driving down toward the back pocket.',
};
