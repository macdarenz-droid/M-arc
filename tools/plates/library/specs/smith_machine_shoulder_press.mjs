// Smith Machine Shoulder Press (seated on a high-incline bench under the Smith bar), side view, facing right. H
// (D-LIB16R2-MODES: PARAMS has no Smith value; SEATPRESS is not built, D-LIB10-TEMPLATES).
// View: SIDE (card plate.view = census view): the bar just missing the nose, the back on the pad, the elbows in front
// of the shoulders and the straight bar path read in the sagittal plane (c3, c4, c5, c6).
// Clone sources (D-LIB9-CLONE), copied, never imported: dumbbell_shoulder_press (pilot A): the seated reclined base,
// `reclined()` (from incline_dumbbell_press; its bisect throws on a bracket with no root), the feet, the scapular set,
// the bench call; smith_machine_bench_press (pilot B): the rig call, the bar and its end dot, the stop, the flare
// Mistake's elbow circle (`elbowOn`, `flaredElbow`; each scan throws if it finds no point) and its ghost-arm capsule.
// Sources: research card docs/research/howto/cards/smith_machine_shoulder_press.json (claude/libht-research @
// a48b0594), claims c1 (bench at a high incline, about 70 degrees), c3 (the bar just misses the nose), c4 (back and
// upper back on the pad, feet flat), c5 (grip wider than the shoulders; elbows in front of the shoulders), c6 (press
// to just short of lockout; lower until the upper arms are about parallel or slightly below), c7 (stops just below
// the lowest bar position), c8 (rotate the bar off the hooks), c10 (the Mistake: flaring the elbows), c19 (tempo).
// Geometry decisions:
//  - Bench: back pad BACK from vertical (c1 "roughly 70 degrees" from the floor), the lifter reclined on it (copied).
//  - Rail (c3): the bar's one vertical line, NOSE_GAP plus the bar's radius in front of the frontmost point of the
//    head outline; the bar centre is on it in every pose.
//  - Start (c6): elbows TOP_ELBOW short of straight, grips GRIP_X off the midline on the rail line.
//  - End (c5, c6): each upper arm END_DIP below level, the elbow END_FWD of the way forward (in front of the shoulder,
//    not straight ahead); the grip is solved on the rail line above it (throws if none).
//  - Mistake (c10, c5): the bar where it is at the end; each elbow on its arm circle at the shoulder's depth
//    (flared out level with the shoulder, the lateral point; the bench press anchor's builder).
//  - Stop (c7): its top STOP_BELOW under the bar shaft's lowest drawn point, drawn in front as the anchor's (PLAN RULED).
// Plate labels: callouts = plate.checkpoints c3 (Bar misses nose), c4 (Back on pad), c7 (Stops set); Mistake =
//   plate.mistake c10, c5 (key `flare`); tempo = plate.tempo (up 2, down 2, pause 0): Lower 2, Press 2 (Motra's 1 s
//   bottom pause, c19, is named, not drawn).
// Unsourced numbers: SIZES below, each with its basis in lb6/sizes.json (r2).
import { landmarksOf, WINTER, REF, fk, resolve, normPose, rootOnSeat, bodyShapes } from '../engine.mjs';
import { perItem } from '../eq/parts.mjs';
import { smith, SMITH_ITEMS } from '../eq/smith.mjs';
import { inclineBench, inclineFaces } from '../eq/inclineBench.mjs';

export const SIZES = { BACK: 20, SEAT_TILT: 10, SEAT_TOP: 0.45, BACK_LEN: 0.86, FOOT_Z: 0.5, GRIP_X: 0.3, TOP_ELBOW: 10, END_DIP: 10, END_FWD: 0.3,
  NOSE_GAP: 0.015, BAR_R: 0.025, PLATE_D: 0.45, STOP_BELOW: 0.02, STOP_W: 0.06, STOP_H: 0.04 };
const H = 1.75, R = Math.PI / 180, BODY = { height: H };
const { BACK, SEAT_TILT, SEAT_TOP, BACK_LEN, FOOT_Z, GRIP_X, TOP_ELBOW, END_DIP, END_FWD, NOSE_GAP, BAR_R, PLATE_D, STOP_BELOW, STOP_W, STOP_H } = SIZES;
const BEAM_Z = [-0.50, 0.40];                         // dumbbell_shoulder_press's bench beam
const SCAP = { elev: -1, pro: -2 };                   // dumbbell_shoulder_press's blades down and back (c4)
const OCCIPUT = [0, 0.955, -0.056];                   // back of the skull, side head outline (head frame, H)

// ---- reclined class (copied from incline_dumbbell_press via dumbbell_shoulder_press; the bisect throws) ----
const bisect = (f, lo, hi) => { if (!(f(lo) <= 0 && f(hi) >= 0)) throw new Error(`smith_machine_shoulder_press: no solution in [${lo}, ${hi}]`); for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (f(m) > 0) hi = m; else lo = m; } return (lo + hi) / 2; };
const skOf = p => fk(resolve(normPose(p, BODY), BODY).q, BODY);
function reclined({ back, seatTilt = 0, seatTop, trunk = 0 }) {
  const seatPt = [0, seatTop, 0];
  const at = tilt => ({ root: { at: rootOnSeat(seatPt, tilt, H), tilt }, trunk });
  const ang = tilt => { const lm = landmarksOf(at(tilt), H), d = [lm.backUpper[1] - lm.buttock[1], lm.backUpper[2] - lm.buttock[2]];
    return Math.atan2(-d[1], d[0]) / R; };
  const tilt = bisect(t => back - ang(t), -100, 20);
  const p0 = at(tilt), lm = landmarksOf(p0, H);
  const u = [0, lm.backUpper[1] - lm.buttock[1], lm.backUpper[2] - lm.buttock[2]];
  const sn = [0, Math.cos(seatTilt * R), -Math.sin(seatTilt * R)];
  const k = ((seatPt[1] - lm.buttock[1]) * sn[1] + (seatPt[2] - lm.buttock[2]) * sn[2]) / (u[1] * sn[1] + u[2] * sn[2]);
  const hinge = [0, lm.buttock[1] + u[1] * k, lm.buttock[2] + u[2] * k];
  const faces = inclineFaces({ hinge, back, seatTilt });
  const n = faces.back.normal;
  const neck = bisect(nk => { const o = skOf({ ...p0, neck: nk }).head(OCCIPUT);
    return (o[1] - hinge[1]) * n[1] + (o[2] - hinge[2]) * n[2]; }, -40, 40);
  return { pose: { ...p0, neck }, hinge, faces };
}

const REC = reclined({ back: BACK, seatTilt: SEAT_TILT, seatTop: SEAT_TOP, trunk: 0 });
const { hinge: HINGE, faces: F } = REC;
const feet = { l: { at: [0.10, 0, FOOT_Z] }, r: { at: [-0.10, 0, FOOT_Z] } };
const base = { ...REC.pose, scap: SCAP, plant: feet };
const lm0 = landmarksOf(base, H);
const S = { l: lm0['shoulder.l'], r: lm0['shoulder.r'] };
const L1 = WINTER.upperArm * H, L2 = WINTER.forearm * H + REF.gripOff * H;
const sub = (a, b) => a.map((v, i) => v - b[i]), dot = (a, b) => a.reduce((s, v, i) => s + v * b[i], 0), unit = a => { const k = Math.hypot(...a); return a.map(v => v / k); };

// The rail (c3): NOSE_GAP + BAR_R in front of the frontmost point of the side head outline (the head does not move).
const HEAD = bodyShapes(skOf(base), { view: 'side', near: 'r', pxm: 1, P: w => [w[2], -w[1]] }).find(s => s.key === 'head').poly;
export const HEAD_FRONT = HEAD.reduce((a, p) => (p[0] > a[0] ? p : a));   // [z, -y]
export const RAIL_Z = HEAD_FRONT[0] + BAR_R + NOSE_GAP;

const topReach = side => { const s = side === 'l' ? 1 : -1, sh = S[side];
  const d = Math.sqrt(L1 * L1 + L2 * L2 + 2 * L1 * L2 * Math.cos(TOP_ELBOW * R)), h2 = d * d - (GRIP_X - Math.abs(sh[0])) ** 2 - (RAIL_Z - sh[2]) ** 2;
  if (!(h2 > 0)) throw new Error('smith_machine_shoulder_press: no top grip');
  return { at: [s * GRIP_X, sh[1] + Math.sqrt(h2), RAIL_Z], pole: [s * 1, -0.2, 0.3] }; };
// End (c5, c6): the upper arm END_DIP below level, its horizontal part END_FWD forward; the grip on the rail above.
const endElbow = side => { const s = side === 'l' ? 1 : -1, sh = S[side], c = Math.cos(END_DIP * R);
  return [sh[0] + s * L1 * c * Math.sqrt(1 - END_FWD * END_FWD), sh[1] - L1 * Math.sin(END_DIP * R), sh[2] + L1 * c * END_FWD]; };
const endReach = side => { const s = side === 'l' ? 1 : -1, E = endElbow(side), dx = s * GRIP_X - E[0], dz = RAIL_Z - E[2], h2 = L2 * L2 - dx * dx - dz * dz;
  if (!(h2 > 0)) throw new Error('smith_machine_shoulder_press: no end grip');
  return { at: [s * GRIP_X, E[1] + Math.sqrt(h2), RAIL_Z], pole: sub(E, S[side]) }; };
const BAR0 = [0, topReach('r').at[1], RAIL_Z], BAR1 = [0, endReach('r').at[1], RAIL_Z];
const start = { ...base, reach: { l: topReach('l'), r: topReach('r') } };
const end = { ...base, reach: { l: endReach('l'), r: endReach('r') } };

// ---- the flare Mistake (copied from smith_machine_bench_press: the elbow circle and its lateral point) ----
function elbowOn(sh, G, phi) {
  const d = sub(G, sh), L = Math.hypot(...d), u = d.map(v => v / L), a = (L1 * L1 - L2 * L2 + L * L) / (2 * L), r = Math.sqrt(L1 * L1 - a * a);
  const ref = Math.abs(u[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0], t = unit(ref.map((v, i) => v - u[i] * dot(ref, u)));
  const w = [u[1] * t[2] - u[2] * t[1], u[2] * t[0] - u[0] * t[2], u[0] * t[1] - u[1] * t[0]];
  return [0, 1, 2].map(i => sh[i] + u[i] * a + r * (Math.cos(phi) * t[i] + Math.sin(phi) * w[i]));
}
export function flaredElbow(side) {
  const s = side === 'l' ? 1 : -1, sh = S[side], G = [s * GRIP_X, BAR1[1], RAIL_Z];
  const f = phi => elbowOn(sh, G, phi)[2] - sh[2];
  let best = null;
  for (let k = 0; k < 360; k++) { const a = k * R, b = (k + 1) * R; if (f(a) * f(b) <= 0) { let lo = a, hi = b; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (f(lo) * f(m) <= 0) hi = m; else lo = m; }
    const e = elbowOn(sh, G, (lo + hi) / 2); if (!best || s * e[0] > s * best[0]) best = e; } }
  if (!best) throw new Error('smith_machine_shoulder_press: no flared elbow level with the shoulder');
  return best;
}
const misReach = side => { const s = side === 'l' ? 1 : -1; return { at: [s * GRIP_X, BAR1[1], RAIL_Z], pole: sub(flaredElbow(side), S[side]) }; };
const mistakePose = { reach: { l: misReach('l'), r: misReach('r') } };
const LS = landmarksOf(start, H), LE = landmarksOf(end, H), LM = landmarksOf({ ...end, ...mistakePose }, H);
const capsule = (a, b, ra, rb, n = 8) => { const u = [b[1] - a[1], b[2] - a[2]], k = Math.hypot(...u), t = [u[0] / k, u[1] / k], nn = [-t[1], t[0]], pts = [];
  const ang0 = Math.atan2(nn[0], nn[1]);
  for (let i = 0; i <= n; i++) { const q = ang0 - Math.PI * i / n; pts.push([0, b[1] + rb * Math.cos(q), b[2] + rb * Math.sin(q)]); }
  for (let i = 0; i <= n; i++) { const q = ang0 + Math.PI - Math.PI * i / n; pts.push([0, a[1] + ra * Math.cos(q), a[2] + ra * Math.sin(q)]); }
  return [...pts, pts[0]]; };
const GHOST_UPPER = capsule(LM['shoulder.r'], LM['elbow.r'], 0.052, 0.040), GHOST_FORE = capsule(LM['elbow.r'], LM['grip.r'], 0.040, 0.026);
const SHOULDER_LINE = [[0, S.r[1] + 0.20, S.r[2]], [0, S.r[1] - 0.16, S.r[2]]];   // the shoulders' depth: where the flared elbow sits

export const STOP_Y = BAR1[1] - BAR_R - STOP_BELOW;   // the stop's top (c7)
const barAt = lm => [0, lm.grips[1], RAIL_Z];
const rigOf = lm => smith({ railZ: RAIL_Z, bar: barAt(lm), stopY: STOP_Y, stop: { w: STOP_W, h: STOP_H }, stopZ: 'front' });
const START_DOT = Array.from({ length: 17 }, (_, k) => [0, BAR0[1] + BAR_R * Math.sin(k * Math.PI / 8), BAR0[2] + BAR_R * Math.cos(k * Math.PI / 8)]);
const fromLevel = (lm, sd) => +(Math.atan2(lm[`elbow.${sd}`][1] - lm[`shoulder.${sd}`][1], Math.hypot(lm[`elbow.${sd}`][0] - lm[`shoulder.${sd}`][0], lm[`elbow.${sd}`][2] - lm[`shoulder.${sd}`][2])) / R).toFixed(1);
export const info = () => ({ railZ: +RAIL_Z.toFixed(3), headFront: [+HEAD_FRONT[0].toFixed(3), +(-HEAD_FRONT[1]).toFixed(3)], barTop: +BAR0[1].toFixed(3), barEnd: +BAR1[1].toFixed(3),
  endUpperArmFromLevel: fromLevel(LE, 'r'), endElbowFwdCm: +((LE['elbow.r'][2] - S.r[2]) * 100).toFixed(1), misElbowFwdCm: +((LM['elbow.r'][2] - S.r[2]) * 100).toFixed(1) });

export default {
  id: 'smith_machine_shoulder_press', name: 'Smith Machine Shoulder Press', view: 'side', facing: 'right',
  camera: { x0: 190, y0: 339 },
  poses: { start, end },
  equipment: [
    { type: 'floor', from: -0.75, to: 0.95 },
    ...inclineBench({ hinge: HINGE, back: BACK, seatTilt: SEAT_TILT, backLen: BACK_LEN, beamZ: BEAM_Z }),
    ...perItem(lm => rigOf(lm), SMITH_ITEMS),
    lm => [{ type: 'barbell', at: barAt(lm), plateD: PLATE_D, plates: [0.045], part: 'plate', z: 'back' }, { type: 'pulley', at: barAt(lm), r: BAR_R, part: 'bar', z: 'front' }],
    (lm, ctx) => (ctx.pose === 'end' ? { type: 'line', cls: 'eq-cable m-line', pts: START_DOT, z: 'front', part: 'startbar' } : null),
  ],
  checks: [
    { landmark: 'seat', plane: { point: F.seat.point, normal: F.seat.normal }, pose: 'all', tol: 1 },       // c4 seated
    { landmark: 'backUpper', plane: { point: F.back.point, normal: F.back.normal }, pose: 'all', tol: 1 },  // c4 back on the pad
    { landmark: 'buttock', plane: { point: F.back.point, normal: F.back.normal }, pose: 'all', tol: 1 },
    { landmark: 'head', above: { point: F.back.point, normal: F.back.normal }, pose: 'all' },
    ...['heel.r', 'ball.r', 'heel.l', 'ball.l'].map(landmark => ({ landmark, plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 })),   // c4 feet flat
    { landmark: 'wrist.r', at: LS['wrist.r'], pose: 'start', tol: 0.5 },        // c5 hands on the bar
    { landmark: 'wrist.l', at: LS['wrist.l'], pose: 'start', tol: 0.5 },
    { landmark: 'grips', at: BAR0, pose: 'start', tol: 0.5 },                   // the bar on its line
    { landmark: 'grips', at: BAR1, pose: 'end', tol: 0.5 },
  ],
  startParts: ['arm.r', 'arm.l', 'bar', 'carriage', 'hook'],
  ghosts: { count: 2, parts: ['arm.r', 'bar'] },
  trace: { point: 'grip.r', trim: [12, 12] },
  tempo: [{ phase: 'Lower', s: 2, move: true }, { phase: 'Press', s: 2, move: true }],
  callouts: [
    { key: 'nose', text: 'Bar misses<br>nose', anchor: [0, -HEAD_FRONT[1], HEAD_FRONT[0]], box: { left: 226, top: 118 }, cue: 'Place the bench so the bar just clears your nose.' },
    { key: 'back', text: 'Back<br>on pad', anchor: 'backUpper', cue: 'Press your upper back into the pad, feet flat, core braced.' },
    { key: 'stops', text: 'Stops<br>set', anchor: [0, STOP_Y - STOP_H / 2, RAIL_Z + STOP_W / 2], box: { left: 236, top: 196 }, cue: 'Set the safety stops just below the lowest bar position.' },
  ],
  mistake: {
    pose: mistakePose,
    guides: [
      { kind: 'dashed', pts: GHOST_UPPER },                                                          // the flared upper arm (ghost)
      { kind: 'dashed', pts: GHOST_FORE },
      { kind: 'arrow', from: { at: 'elbow.r', pose: 'end', off: [0, 6] }, to: { at: 'elbow.r', pose: 'mistake', off: [0, 6] } },   // the elbow swings out to the shoulders' line
      { kind: 'dashed', pts: SHOULDER_LINE },                                                        // the shoulders' depth
    ],
    tells: [
      { key: 'flare', text: 'Elbows<br>flare wide', anchor: { at: 'elbow.r', pose: 'mistake' }, cue: 'Your elbows flare out wide, level with your shoulders.' },
      { key: 'level', text: 'Level with<br>shoulders', anchor: SHOULDER_LINE[0], cue: 'Your elbows sit out in line with your shoulders, not in front of them.' },
    ],
  },
  alt: 'Smith machine shoulder press, side view. Seated on a high-incline bench under the Smith bar, back on the pad and feet flat, the lifter lowers the bar straight down in front of the face, just missing the nose, until the upper arms are about level, elbows in front of the shoulders.',
};
