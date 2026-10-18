// Resistance band row (seated on the floor, band round the soles), side view, figure faces its feet (screen right).
// LB1, mode H, own parent; floor-sit pose class (plan 2.2, first user); first user of the `band` composer.
// View: side (card plate.view, census view): the elbows driven back to the sides, the tall back that carries the fault
// and the slump itself are all sagittal.
// Source: docs/research/howto/cards/resistance_band_row.json (claude/libht-research). Claims used: c1 (on a mat, legs
// out in front, feet flexed, band round the soles, one end in each hand), c2 (band secure round the soles), c3 (sit
// tall, back straight and neutral, blades down and back, arms straight in front, palms in; the fault: slumping), c4
// (elbows straight back, close to the sides, a small squeeze between the blades), c10 (tempo 2 s / 2 s, no pause).
// Clone source: seated_cable_row (golden A, bc0f378): the row arm (neutral grip, elbows back past the ribs, blades
// squeezed back), the vertical datum through the hip for the upright trunk.
// Floor-sit class: no contact IK for the legs. The legs are set by angles (hip, knee, ankle) and proven on the mat by
// `checks` planes (seat and heel), so a pose change that lifts them off the mat turns the checks red.
// Geometry decisions:
//  - Mat 1 cm thick (card c1: on a mat); the pelvis sits on it (seat landmark, card fact c1) in every pose.
//  - Legs straight out (hip 88, knee 4: soft, not locked), feet flexed (ankle +8: toes up, soles near vertical), the
//    heels on the mat; the band loops round the balls of the feet (band composer).
//  - Start: trunk tall and upright (tilt 0, trunk 0), blades down (elev -1), arms straight in front, palms in, hands
//    a little below shoulder height on the line of the band.
//  - End: trunk unchanged (c3); the elbows drawn straight back past the ribs, close to the sides; hands at the lower
//    ribs; blades squeezed back (pro -4) and down (c4).
//  - Mistake (card plate.mistake, c3): the slump. The pelvis rolls back 14 deg and the spine rounds 34 deg, so the
//    trunk tips forward and the low back rounds while the hands still hold the band at the end of the pull. The hips
//    flex 14 deg less at the joint (the pelvis rolled back), so the legs stay flat on the mat.
//  - Labels: 'band' right of the foot at ball height (a box above leaves a leader along the upright toes); the
//    'elbows' and 'slump' leaders cross the near arm because the elbow and low back sit behind it in this view.
//  - Scale: `fit` lands on the reference 146.29 px/m (F1's top); the floor sit is only 0.92 m tall, so the figure
//    covers less of the plate than the 8 do (F2 raised, see lb1/DESIGN.md).
import { rootOnSeat, landmarksOf } from '../engine.mjs';
import { band, bandAnchor, BAND_ITEMS } from '../eq/band.mjs';
import { perItem } from '../eq/parts.mjs';

const H = 1.75;
const MAT = 0.01;                                        // mat top (m)
const SEAT = [0, MAT, 0];
const LEGS = { hip: 88, knee: 4, ankle: 8 };
const GX = 0.15;                                         // hands 30 cm apart, palms in
const grips = (c, pole) => ({
  l: { at: [GX, c[1], c[2]], pole: [pole[0], pole[1], pole[2]] },
  r: { at: [-GX, c[1], c[2]], pole: [-pole[0], pole[1], pole[2]] },
});

const body = { root: { at: rootOnSeat(SEAT, 0, H), tilt: 0 }, trunk: 0, neck: 0, ...LEGS };
const lm0 = landmarksOf(body, H);
const START_G = [0, lm0['shoulder.r'][1] - 0.17, lm0['shoulder.r'][2] + 0.662];   // arms straight (elbow 8.6 deg, as pull_up's hang)
const END_G = [0, lm0['shoulder.r'][1] - 0.30, lm0['shoulder.r'][2] + 0.17];
const start = { ...body, scap: { elev: -1, pro: 2 }, reach: grips(START_G, [0.2, -1, 0]) };
const end = { ...body, scap: { elev: -1, pro: -4 }, reach: grips(END_G, [0.1, -0.4, -1]) };

// Mistake: the slump (pelvis rolls back, spine rounds, trunk tips forward), hands still at the end of the pull.
const M_TILT = -14, M_TRUNK = 34;
const misBody = { root: { at: rootOnSeat(SEAT, M_TILT, H), tilt: M_TILT }, trunk: M_TRUNK, neck: 8, hip: LEGS.hip + M_TILT, scap: { elev: 0, pro: 2 },
  reach: grips([0, END_G[1] - 0.04, END_G[2] + 0.14], [0.1, -0.4, -1]) };

export default {
  id: 'resistance_band_row', name: 'Resistance Band Row', view: 'side', facing: 'right',
  camera: { fit: true },
  poses: { start, end },
  equipment: [
    { type: 'floor', from: -0.45, to: 1.30 },
    { type: 'box', at: [0, MAT / 2, 0.38], w: 1.40, h: MAT, rc: 0.5, z: 'back' },                              // mat
    ...perItem(band(), BAND_ITEMS),
    // the start strand as a dashed outline (both strands project onto one line in this view) in the end pose (the start layer never draws moving equipment)
    (lm, ctx) => (ctx.pose === 'end' ? ['grip.r'].map(g => ({ type: 'line', cls: 'eq-line m-line', z: 'back', part: 'phantom',
      pts: [bandAnchor(ctx.start).leave, [0, ctx.start[g][1], ctx.start[g][2]]] })) : null),
  ],
  checks: [
    { landmark: 'seat', plane: { point: SEAT, normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },     // pelvis on the mat (c1)
    { landmark: 'heel.r', plane: { point: SEAT, normal: [0, 1, 0] }, pose: 'all', tol: 1 },     // heels on the mat
  ],
  ghosts: { count: 3, parts: ['arm.r', 'band'] },
  trace: { point: 'grip.r', trim: [10, 12] },
  datum: [{ x: 'hip.r', from: 'hip.r', to: 190 }],        // vertical through the hip: the trunk stays tall
  callouts: [
    { key: 'tall', text: 'Sit tall', anchor: 'sternum', box: { left: 166, top: 196 }, cue: 'Back straight and neutral, chest up, the same from start to finish.' },
    { key: 'elbows', text: 'Elbows<br>to sides', anchor: 'elbow.r', box: { left: 10, top: 216 }, cue: 'Elbows travel back close to the body.' },
    { key: 'band', text: 'Band round<br>soles', anchor: 'ball.r', box: { left: 262, top: 284 }, cue: 'The band sits securely around the soles of the feet, feet flexed.' },
  ],
  tempo: [{ phase: 'Pull', s: 2, move: true }, { phase: 'Return', s: 2, move: true }],
  mistake: {
    pose: misBody,
    parts: ['torso', 'head', 'arm.r'],
    guides: [
      { kind: 'arc-arrow', center: 'hip.r', r: 62, a0: -96, a1: -70 },
    ],
    tells: [
      { key: 'slump', text: 'Low back<br>rounds', anchor: { at: 'sacrum', pose: 'mistake', off: [-2, 0] }, box: { left: 10, top: 288 }, cue: 'The lower back rounds and the trunk tips forward.' },
      { key: 'tip', text: 'Trunk tips<br>forward', anchor: { at: 'shoulderTop.r', pose: 'mistake' }, box: { left: 160, top: 196 }, cue: 'The trunk tips forward over the legs instead of staying tall.' },
    ],
  },
  alt: 'Resistance band row, side view. Sitting tall on a mat, legs straight out and feet flexed with a band round the soles, the lifter pulls the band ends from straight arms back to the lower ribs, elbows close to the sides.',
};
