// Seated Leg Curl (seated leg curl machine), side view, facing right. H (D-LIB10-PA's mode rule: its own parent; no
// template, D-LIB11-TEMPLATES; no PARAMS key names the machine, derive.mjs:4-12).
// View: SIDE (card plate.view = census view): the knee at the pivot, the pads on the thigh and the lower leg, the curl
// of the knee and the foot position read in the sagittal plane (c1, c2, c3, c5, c10).
// Clone source: none (no pilot A or LB2 plate has this pose class); census closest: golden leg_press (seated machine).
// New: the legCurlMachine composer (eq/legCurlMachine.mjs), its anchor.
// Sources: research card docs/research/howto/cards/seated_leg_curl.json (claude/libht-research @ 38d5f9c6), claims c1
// (knees in line with the machine's pivot), c2 (thigh pad snug just above the knees), c3 (ankle pad under the lower legs
// just above the shoes, well below the calves), c4 (back flat on the back pad), c5 (hands on the side handles, hips
// pressed into the seat; curl the feet under you), c6 (bend the knees as far as you can), c10 (the Mistake: feet flexed
// as when standing instead of toes pointed), c7 and c13 (tempo).
// Geometry decisions:
//  - Seat (c5): the seat landmark on the seat pad (plane check, 0.5 cm); pelvis tilt TILT and hip flexion HIP_FLEX put
//    the thighs level on the seat and the back on the reclined back pad, which is drawn tangent to backUpper and
//    buttock (c4; checks prove both within 1 cm).
//  - Pivot (c1): the lever's pivot is the knee joint centre in the side view (the composer draws the boss there).
//  - Thigh pad (c2): a roller on thighTop (the thigh's top surface at 0.82 of its length: just above the knee).
//  - Ankle pad (c3): a roller on the back of the lower leg at ANKLE_T of the shank from the knee (6.5 cm above the
//    ankle joint: just above the shoe), the contact on the shank's drawn surface (the engine's shank radius there).
//  - Start (c1, c3, c5): legs out in front, KNEE_START short of straight. End (c5, c6): knees bent KNEE_END, the feet
//    curled under the seat (the ankle behind the seat's front edge).
//  - Feet: toes pointed (ANKLE_RIGHT, plantarflexion) in both right poses. The card's end gives no ankle, but its Mistake
//    (c10) is the feet flexed as when standing "instead of toes pointed", so the right plate draws the toes pointed.
//  - Mistake (c10): only the ankles change, to MIS_ANKLE (0: the foot square to the shin, as when standing); the knee
//    angle, thighs, pads and lever stay as in the end pose.
//  - Scale: fit to the plate, never over the reference 146.29 px/m.
// Plate labels (card @ 38d5f9c6): callouts = plate.checkpoints c1 (Knee at pivot), c2 (Pad above knees), c3 (Pad above
//   shoes); Mistake = plate.mistake c10 (key `flexed`): the feet flexed up as when standing, pushing with the calves;
//   tempo = plate.tempo c7, c13 (up 1, down 2, pause 0): Curl 1, Return 2.
// Unsourced numbers (no card claim gives them; 13.3 must-fix 14): SEAT_Y (seat height), SEAT_Z, TILT and HIP_FLEX (the
//   seated posture), KNEE_START, KNEE_END ("as far as you can", c6, gives no degrees), ANKLE_RIGHT (how far the toes
//   point), MIS_ANKLE (0, the card's "as when standing"), ANKLE_T, HANDLE, the rig's sizes
//   (eq/legCurlMachine.mjs).
import { landmarksOf, rootOnSeat, RADII } from '../engine.mjs';
import { perItem } from '../eq/parts.mjs';
import { legCurlMachine, LEG_CURL_ITEMS } from '../eq/legCurlMachine.mjs';

const H = 1.75;
const SEAT_Y = 0.56, SEAT_Z = 0.06;                   // seat pad top (m) and its centre (world z)
const SEAT = [0, SEAT_Y, 0];                          // the seat landmark's contact point
const TILT = -10, HIP_FLEX = 74;                      // pelvis reclined 10 deg; thigh undersides on the seat (c2: sandwiched) (deg)
const KNEE_START = 10, KNEE_END = 120;                // knee flexion (deg): legs out in front / curled under the seat
export const ANKLE_RIGHT = -30, MIS_ANKLE = 0;        // ankle (deg, + dorsiflexion): toes pointed / flexed as when standing (c10)
const ANKLE_T = 0.85;                                 // ankle pad contact: fraction of the shank from the knee (c3)
const HANDLE = [0.24, SEAT_Y + 0.06, 0.10];           // side handle grip centre (c5)

const root = { at: rootOnSeat(SEAT, TILT, H), tilt: TILT };
const hands = { l: { at: HANDLE, pole: [1, 0.2, -0.3] }, r: { at: [-HANDLE[0], HANDLE[1], HANDLE[2]], pole: [-1, 0.2, -0.3] } };
const base = { root, trunk: 0, neck: 2, hip: HIP_FLEX, reach: hands };
const start = { ...base, knee: KNEE_START, ankle: ANKLE_RIGHT };
const end = { ...base, knee: KNEE_END, ankle: ANKLE_RIGHT };
const mistakePose = { ankle: MIS_ANKLE };

// shank radius (m) at fraction t from the knee: the engine's own limb taper (geom.mjs limbR, body.mjs RADII.shank)
const shankR = t => { const [rA, rM, rB, m] = RADII.shank, r = t < m ? rA + (rM - rA) * Math.sin((t / m) * Math.PI / 2) : rM + (rB - rM) * (1 - Math.cos(((t - m) / (1 - m)) * Math.PI / 2)); return r * H; };
/** The ankle pad's contact on the back of the near shank in a pose, and its outward normal (side view). */
export function anklePadOf(lm) {
  const k = lm['knee.r'], a = lm['ankle.r'], u = [0, a[1] - k[1], a[2] - k[2]], L = Math.hypot(u[1], u[2]);
  const d = [0, u[1] / L, u[2] / L], n = [0, -d[2], d[1]];                // n: the back of the leg (calf side)
  const r = shankR(ANKLE_T);
  return { at: [0, k[1] + u[1] * ANKLE_T + n[1] * r, k[2] + u[2] * ANKLE_T + n[2] * r], normal: n };
}
const lmE = landmarksOf(end, H), lmS = landmarksOf(start, H);
export const PIVOT = [0, lmE['knee.r'][1], lmE['knee.r'][2]];
const thighN = (() => { const h = lmE['hip.r'], k = lmE['knee.r'], u = [k[1] - h[1], k[2] - h[2]], L = Math.hypot(...u); return [0, u[1] / L, -u[0] / L]; })();
export const rigOf = lm => { const ap = anklePadOf(lm);
  return legCurlMachine({ pivot: PIVOT, ankle: ap.at, ankleN: ap.normal, thigh: [0, lmE['thighTop.r'][1], lmE['thighTop.r'][2]], thighN,
    seat: [0, SEAT_Y, SEAT_Z], back: [lmE.backUpper, lmE.buttock], handle: [0, HANDLE[1], HANDLE[2]], base: [-0.30, PIVOT[2] + 0.16] }); };
// The start layer drops moving equipment (engine limit, as barbell_bench_press's start bar): the start ankle pad is
// redrawn as a dashed phantom in the end layer (hidden-part rule, 13 Q2 (c)).
const START_PAD = (() => { const ap = anklePadOf(lmS), r = 0.055, c = [0, ap.at[1] + ap.normal[1] * r, ap.at[2] + ap.normal[2] * r];
  return Array.from({ length: 17 }, (_, k) => [0, c[1] + r * Math.sin(k * Math.PI / 8), c[2] + r * Math.cos(k * Math.PI / 8)]); })();
export const info = () => ({ pivotToKneeCm: [lmS, lmE].map(l => +(Math.hypot(l['knee.r'][1] - PIVOT[1], l['knee.r'][2] - PIVOT[2]) * 100).toFixed(2)),
  ankleAboveAnkleJointCm: +((1 - ANKLE_T) * Math.hypot(lmE['ankle.r'][1] - lmE['knee.r'][1], lmE['ankle.r'][2] - lmE['knee.r'][2]) * 100).toFixed(1),
  endAnkleZ: +lmE['ankle.r'][2].toFixed(3), seatFrontZ: SEAT_Z + 0.2, endToeY: +lmE['toe.r'][1].toFixed(3), startToe: lmS['toe.r'].map(v => +v.toFixed(3)) });

export default {
  id: 'seated_leg_curl', name: 'Seated Leg Curl', view: 'side', facing: 'right',
  camera: { fit: { left: 12, right: 12, top: 40, bottom: 18 }, maxScale: 1 },
  poses: { start, end },
  equipment: [
    { type: 'floor', from: -0.45, to: 1.20 },
    ...perItem(lm => rigOf(lm), LEG_CURL_ITEMS),
    (lm, ctx) => (ctx.pose === 'end' ? { type: 'line', cls: 'eq-line m-line', pts: START_PAD, z: 'front', part: 'startpad' } : null),
  ],
  checks: [
    { landmark: 'seat', plane: { point: SEAT, normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },          // hips on the seat (c5)
    { landmark: 'thighUnder.r', above: { point: SEAT, normal: [0, 1, 0] }, pose: 'all' },
    { landmark: 'backUpper', plane: { point: lmE.buttock, normal: [0, -(lmE.backUpper[2] - lmE.buttock[2]), lmE.backUpper[1] - lmE.buttock[1]].map((v, i, a) => v / Math.hypot(...a)) }, pose: 'all', tol: 1 },   // back flat on the pad (c4)
    { landmark: 'buttock', plane: { point: lmE.backUpper, normal: [0, -(lmE.backUpper[2] - lmE.buttock[2]), lmE.backUpper[1] - lmE.buttock[1]].map((v, i, a) => v / Math.hypot(...a)) }, pose: 'all', tol: 1 },
    { landmark: 'knee.r', at: lmE['knee.r'], pose: 'all', tol: 1 },                                              // knee at the pivot (c1)
    { landmark: 'thighTop.r', at: lmE['thighTop.r'], pose: 'all', tol: 1 },
    { landmark: 'grip.r', at: [-HANDLE[0], HANDLE[1], HANDLE[2]], pose: 'all', tol: 0.5 },   // hands on the side handles (c5)
    { landmark: 'grip.l', at: HANDLE, pose: 'all', tol: 0.5 },
    { landmark: 'thighTop.l', at: lmE['thighTop.l'], pose: 'all', tol: 1 },                  // the pad on both thighs (c2)
    { landmark: 'thighUnder.r', plane: { point: SEAT, normal: [0, 1, 0] }, pose: 'all', tol: 1 },   // legs sandwiched on the seat (c2)
    { landmark: 'thighUnder.l', plane: { point: SEAT, normal: [0, 1, 0] }, pose: 'all', tol: 1 },   // thigh pad on the thigh (c2)
  ],
  startParts: ['leg.r', 'leg.l', 'lever'],
  ghosts: { count: 2, parts: ['leg.r', 'lever'] },
  trace: { point: 'ankle.r', trim: [10, 12] },
  tempo: [{ phase: 'Curl', s: 1, move: true }, { phase: 'Return', s: 2, move: true }],
  callouts: [
    { key: 'pivot', text: 'Knee at<br>pivot', anchor: 'knee.r', box: { left: 214, top: 194 }, cue: 'Line your knees up with the machine’s pivot.' },
    { key: 'thigh', text: 'Pad above<br>knees', anchor: [0, lmE['thighTop.r'][1] + 0.11, lmE['thighTop.r'][2]], box: { left: 150, top: 148 }, cue: 'Set the thigh pad snug just above your knees.' },
    { key: 'ankle', text: 'Pad above<br>shoes', anchor: { at: 'ankle.r', off: [-8, 4] }, box: { left: 40, top: 286 }, cue: 'Set the ankle pad just above your shoes, below your calves.' },
  ],
  mistake: {
    pose: mistakePose,
    guides: [
      { kind: 'arc-arrow', center: { at: 'ankle.r', pose: 'mistake' }, r: 36, a0: 72, a1: 28 },   // the foot turns up about the ankle
    ],
    tells: [
      { key: 'flexed', text: 'Feet<br>flexed up', anchor: { at: 'toe.r', pose: 'mistake' }, box: { left: 250, top: 300 }, cue: 'Your feet flex up as if you were standing.' },
      { key: 'calves', text: 'Calves<br>push', anchor: { at: 'heel.r', pose: 'mistake' }, box: { left: 48, top: 284 }, cue: 'You push the pad with your calves instead of pointing your toes.' },
    ],
  },
  alt: 'Seated leg curl, side view. Seated with the back on the pad, knees in line with the machine pivot, the thigh pad just above the knees and the ankle pad just above the shoes, the lifter curls the feet under the seat with the toes pointed.',
};
