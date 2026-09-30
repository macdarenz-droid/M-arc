// Dumbbell Fly (flat bench, palms facing), SIDE view. SUPINE class child. VIEW-CONFLICT go/no-go (census + card:
// front). Both views are built from `makeFly` below: this file = side (recommended), dumbbell_fly__alt.mjs = front.
// Verdict (renders in the LIB-8 pilot report):
//  - FRONT (census/card view): NO-GO with the locked engine. The arc, the fixed elbow bend and the stop height all
//    read at true size, but the engine's front torso and head are frontal-plane outlines: with the pelvis tilted -90
//    they project to a zero-height line, so the plate shows arms growing out of two shins and no torso, head or bench
//    pad (the pad is behind the legs). SPEC 8 names this ("front view of a trunk flexed forward is a foreshortened
//    frontal outline"); for a lying body it collapses completely. Needs an engine end-on torso/head before it can ship.
//  - SIDE: GO with a caveat. Body, bench, five-point contact and the stop height against the chest line are drawn at
//    approved quality; the width of the arc and the elbow bend are frontal and foreshortened (the near arm points at
//    the viewer at the bottom), so those two checkpoints must be carried by the callouts, not the drawing.
// Sources: research card docs/research/howto/cards/dumbbell_fly.json (branch claude/libht-research-presses,
// source-checked, critic pending), claims c1 (flat bench, feet flat), c2 (blades down and back, five-point contact),
// c3 (start: dumbbells pressed up to shoulder width, palms facing, slight elbow bend, neutral wrists), c4 (lower in a
// wide arc until the dumbbells are level with the shoulders or chest, dumbbells parallel), c5 (the same slight elbow
// bend down and up).
// Geometry decisions:
//  - Body, bench, feet and blades: exactly dumbbell_bench_press (the SUPINE anchor): `supine()` root/trunk/neck on a
//    43 cm flat bench, feet flat FOOT_Z in front of the hip, scap back and down. Same checks.
//  - Arc: each grip moves on a circle round its shoulder joint in the plane across the body at ARC_DZ toward the feet
//    from the shoulder joints (over the upper chest). The grip-to-shoulder distance is the one of an arm with the
//    elbow bent ELBOW deg, so the reach IK returns that elbow at every key pose (c5); 7 key poses (start, 5 via, end)
//    keep the interpolated chord within 0.6% of the arc (the elbow moves under 2 deg between key poses).
//  - Start (c3): arms up, grips SHOULDER_W apart centre to centre (the shoulder joints are 45 cm apart), the arm leaning
//    in only as the elbow bend needs.
//  - End (c4): lowered until the grip is level with the top of the chest (END_LEVEL, the chest surface at the nipple
//    line): "level with the shoulders or chest", the shallow end of that range, so the mistake (deeper) reads.
//  - Elbow pole: out and a little down, so the bend is in the arc plane with the elbows pointing out (c5).
//  - Dumbbells: engine `dumbbell` primitive with axis [0,0,1] (palms facing, handles along the body, c3/c4 "parallel"):
//    end-on hex in the front view, side-on in the side view.
//  - Engine limit: the start layer never draws equipment, so the start dumbbells are dashed phantom outlines in the end
//    layer (hex in front view, bar + heads in side view), as dumbbell_bench_press.
// Plate labels (side view; provisional, card not yet critic-verified): callouts = plate.checkpoints c5 (Soft elbows),
//   c4 (Stop at chest level), c2 (Five points); Mistake = plate.mistake c4 (dumbbells below chest/shoulder level, grip
//   10 cm under the shoulder joint); tempo = plate.tempo c10 (2 s down, 2 s up). No measure arc: the only angle the
//   card names (the slight elbow bend) is foreshortened in side view, so an arc would draw a false number; the stop
//   line datum proves c4. The front alt keeps no labels (no-go evidence).
// CARD: ELBOW (slight bend), SHOULDER_W (start width), END_LEVEL (stop height), ARC_DZ (arc plane over the chest).
import { landmarksOf, fk, resolve, normPose, WINTER, REF } from '../engine.mjs';
import { supine } from './dumbbell_bench_press.mjs';

const H = 1.75, BODY = { height: H };
const R = Math.PI / 180;
const BENCH_TOP = 0.43, BENCH_LEN = 1.2, BENCH_Z = -0.40;   // as dumbbell_bench_press
const FOOT_Z = 0.51;
const SCAP = { elev: -1, pro: -3 };
const ELBOW = 20;                                     // slight elbow bend, fixed through the arc (deg) (c3, c5)
const SHOULDER_W = 0.44;                              // start: grip centres apart (m): shoulder width (c3)
const ARC_DZ = 0.08;                                  // arc plane this far toward the feet of the shoulder joints (m): over the upper-mid chest
const END_LEVEL = 'chest';                            // end: grip level with the chest surface at the nipple line (c4)

const LYING = supine(BENCH_TOP, 0);
const feet = { l: { at: [0.10, 0, FOOT_Z] }, r: { at: [-0.10, 0, FOOT_Z] } };
const base = { ...LYING, scap: SCAP, plant: feet };
const lm0 = landmarksOf(base, H), sk0 = fk(resolve(normPose(base, BODY), BODY).q, BODY);
const S = { l: lm0['shoulder.l'], r: lm0['shoulder.r'] };
const L1 = WINTER.upperArm * H, L2 = WINTER.forearm * H + REF.gripOff * H;
const D = Math.sqrt(L1 * L1 + L2 * L2 + 2 * L1 * L2 * Math.cos(ELBOW * R));   // shoulder-to-grip with the bend
const Dh = Math.sqrt(D * D - ARC_DZ * ARC_DZ);                                  // radius in the arc plane
const CHEST = sk0.thorax([0, 0.72, 0.072]);                                     // chest surface, nipple line
const endY = END_LEVEL === 'chest' ? CHEST[1] : S.r[1];
// angle phi from straight up (0) toward the side, per side
const PHI0 = Math.asin((Math.abs(S.r[0]) - SHOULDER_W / 2) / Dh) / R * -1;       // start: grips inside the shoulders
const PHI1 = Math.acos((endY - S.r[1]) / Dh) / R;                               // end: grip at endY
const gripAt = (side, phi) => { const s = side === 'l' ? 1 : -1, sh = S[side];
  return { at: [sh[0] + s * Dh * Math.sin(phi * R), sh[1] + Dh * Math.cos(phi * R), sh[2] + ARC_DZ], pole: [s, -0.35, 0.15] }; };
const poseAtPhi = phi => ({ ...base, reach: { l: gripAt('l', phi), r: gripAt('r', phi) } });
const start = poseAtPhi(PHI0), end = poseAtPhi(PHI1);
const via = [1, 2, 3, 4, 5].map(k => k / 6).map(t => poseAtPhi(PHI0 + (PHI1 - PHI0) * t));
export const flyInfo = { phiStartDeg: +PHI0.toFixed(1), phiEndDeg: +PHI1.toFixed(1), endGripAboveShoulderCm: +((endY - S.r[1]) * 100).toFixed(1) };

// Mistake (card plate.mistake, c4): the dumbbells go below shoulder and chest level at the bottom of the arc. Same
// arc and elbow bend, lowered until the grip is MIS_BELOW under the shoulder joint (27 cm under the correct stop).
const MIS_BELOW = 0.10;                               // faulty grip height under the shoulder joint (m)
const PHI_M = Math.acos(-MIS_BELOW / Dh) / R;
const mistakePose = { reach: { l: gripAt('l', PHI_M), r: gripAt('r', PHI_M) } };
const lmEnd = landmarksOf(end, H);
const chestLine = [[0, lmEnd['grip.r'][1], lmEnd['grip.r'][2] - 0.16], [0, lmEnd['grip.r'][1], lmEnd['grip.r'][2] + 0.16]];

// start dumbbell phantoms (dashed), in metres, per view
const DB = { head: 0.119, headLen: 0.07, handle: 0.13 };
const hexRing = (c, r) => { const pts = []; for (let i = 0; i <= 6; i++) { const a = 60 * i * R; pts.push([c[0] + r * Math.cos(a), c[1] - r * Math.sin(a), c[2]]); } return pts; };
const sideDb = c => {   // side view, axis z: handle bar and two heads as outlines (primitive sizes)
  const hh = DB.head * 0.866 / 2, rect = (z0, z1, h) => [[0, c[1] - h, c[2] + z0], [0, c[1] - h, c[2] + z1], [0, c[1] + h, c[2] + z1], [0, c[1] + h, c[2] + z0], [0, c[1] - h, c[2] + z0]];
  return [rect(-DB.handle / 2 - DB.headLen, -DB.handle / 2, hh), rect(DB.handle / 2, DB.handle / 2 + DB.headLen, hh), [[0, c[1], c[2] - DB.handle / 2], [0, c[1], c[2] + DB.handle / 2]]];
};
const lmStart = landmarksOf(start, H);

/** The fly plate in `view` ('front' | 'side'); `id` for the file. */
export function makeFly(view, id) {
  const front = view === 'front';
  const phantom = front
    ? ['l', 'r'].map(s => ({ type: 'line', pts: hexRing(lmStart[`grip.${s}`], DB.head / 2), cls: 'eq-line m-line', z: 'front' }))
    : sideDb(lmStart['grip.r']).map(pts => ({ type: 'line', pts, cls: 'eq-line m-line', z: 'front' }));
  return {
    id, name: 'Dumbbell Fly', view, facing: 'right',
    camera: front ? { x0: 179, y0: 339 } : { x0: 205, y0: 339 },
    poses: { start, end, via },
    equipment: [
      front ? { type: 'floor', from: -1.05, to: 1.05 } : { type: 'floor', from: -1.12, to: 0.80 },
      { type: 'bench', at: [0, BENCH_TOP, BENCH_Z], len: BENCH_LEN },
      (lm, ctx) => (ctx.pose === 'end' ? phantom : null),
      lm => [{ type: 'dumbbell', at: lm['grip.l'], axis: [0, 0, 1], z: front ? 'front' : 'back', part: front ? 'db.l' : 'db.far' },
        { type: 'dumbbell', at: lm['grip.r'], axis: [0, 0, 1], z: 'front', part: 'db.r' }],
    ],
    checks: [
      { landmark: 'backUpper', plane: { point: [0, BENCH_TOP, 0], normal: [0, 1, 0] }, pose: 'all', tol: 1 },   // upper back ON the pad (c2)
      { landmark: 'buttock', plane: { point: [0, BENCH_TOP, 0], normal: [0, 1, 0] }, pose: 'all', tol: 1 },     // buttocks ON the pad
      { landmark: 'head', above: { point: [0, BENCH_TOP, 0], normal: [0, 1, 0] }, pose: 'all' },               // head never inside it
      { landmark: 'sole.r', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },            // feet ON the floor
      { landmark: 'sole.l', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
    ],
    startParts: front ? ['arm.l', 'arm.r'] : ['arm.r', 'arm.l'],
    ghosts: { count: 3, parts: front ? ['arm.l', 'arm.r', 'db.l', 'db.r'] : ['arm.r', 'db.r'] },
    trace: { point: front ? 'grip.l' : 'grip.r', trim: [12, 12] },
    ...(front ? { callouts: [] } : {
      datum: [{ y: 'grip.r', from: { at: 'grip.r', off: [-34, 0] }, to: { at: 'grip.r', off: [34, 0] }, mistake: false }],   // the stop line: chest level (c4)
      callouts: [
        { key: 'elbows', text: 'Soft<br>elbows', anchor: 'start:elbow.r', cue: 'Keep a slight elbow bend that stays the same all the way.' },
        { key: 'stop', text: 'Stop at<br>chest', anchor: 'grip.r', cue: 'Lower until the dumbbells are level with your chest, no deeper.' },
        { key: 'five', text: 'Five<br>points', anchor: 'buttock', cue: 'Keep your head, shoulders, hips and feet in contact.' },
      ],
      tempo: [{ phase: 'Lower', s: 2, move: true }, { phase: 'Raise', s: 2, move: true }],
      mistake: {
        pose: mistakePose,
        guides: [
          { kind: 'dashed', pts: chestLine },                                                   // where it should stop
          { kind: 'arrow', from: { at: 'grip.r', pose: 'end', off: [22, 0] }, to: { at: 'grip.r', pose: 'mistake', off: [22, 0] } },
        ],
        tells: [
          { key: 'deep', text: 'Below<br>the chest', anchor: { at: 'grip.r', pose: 'mistake', off: [14, 0] }, cue: 'Your dumbbells sink below chest and shoulder level at the bottom.' },
          { key: 'elbow', text: 'Elbows<br>too low', anchor: { at: 'elbow.r', pose: 'mistake' }, cue: 'Your elbows drop below the bench line and strain the shoulder front.' },
        ],
      },
      pilot: { note: 'F6: side view, census/card say front. Front is no-go (lying torso and head vanish in the engine front view); side cannot show the arc width or elbow bend. Callouts and Mistake provisional: card not yet critic-verified' },
    }),
    alt: `Dumbbell fly, ${front ? 'front view from the foot end' : 'side view'}. Lying on a flat bench, head, shoulders and hips on the pad, feet flat, the lifter lowers the dumbbells in a wide arc, elbows slightly bent and fixed, until level with the chest, then raises them back.`,
  };
}

export default makeFly('side', 'dumbbell_fly');
