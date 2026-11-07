// Sled pull (backward drag with a rope), side view, figure facing screen right, the sled in front. LIB-22 (LB10, H;
// NOSECS lifted at 'LIB-22 resume': the strip word tempo).
// View: side (card plate.view = census): the quarter squat, the shoulders over the hips, the step back and the torso
//  pitching back are sagittal (plate.viewWhy).
// Sources: research card docs/research/howto/cards/sled_pull.json (research head 596dbe07): c1 facing the sled, the rope
//  gripped firmly in both hands, one stacked over the other, arms slightly bent, light tension; c2 feet shoulder-width,
//  quarter squat, knees soft, chest up, shoulders over the hips; c3 step back one foot at a time, short, quick,
//  controlled steps, driving through the midfoot, the rope close to the body; c4 feed the rope through the hands,
//  elbows tucked; c5 the rope piles up near the feet; c8 the torso pitched back, the lower back taking the load (the
//  Mistake). plate.frames: one step, "the rear foot stepped back with the sled a little closer; Trace follows the
//  stepping foot". Tempo: Walk "Quick" (D-STRIP-B; strip/rows.json, c3).
// Clone (D-LIB22-CLONE): seated_cable_row (the 8: the rope line to the hands; the rock-back Mistake), romanian_deadlift
//  and barbell_row (#109: the hinge, KNEE 15), mountain_climbers (#109: one step of the cycle, the via ghost,
//  FOOT_CLEAR), single_leg_romanian_deadlift (#109: the Winter centre of mass); copied, never imported.
// Geometry (confirmed by the report's contacts and checks, and by tests on the drawn items):
//  Feet: flat (ref 'mid'), FOOT_X out each side, toes forward: the widest stance whose rigid-foot plant keeps every
//   report contact within 0.5 cm (c2 "shoulder-width"; D-LIB22-STANCE as corrected). The hips keep one height HIP_Y in
//   start, via and end (solved: the start knees Q_KNEE 42 deg, c2 "quarter-squat", LIB-PLATEFIX-3; was the stepped-back
//   knee KNEE_SOFT in the end, which left the start at 29 deg), so the hands and the rope keep theirs; the end's
//   stepped-back knee then bends 33.7 deg (c2 "keeping your knees soft"). Trunk upright (tilt 0, spine and neck neutral: c2 "chest up", "shoulders over hips").
//   LIB-PLATEFIX-3b (pfc-findings b5065795 set b T02 L1, critics c1-c3; ruled D-PF3B-SLEDSQUAT, #408): the "Quarter
//   squat" checkpoint did not read (it anchored on the end's stepped-back knee, its thigh 3.5 deg from vertical; the
//   start thigh was 16.6 deg, the bend coming from the shin). The quarter squat is now set on the START pose (the
//   callout stays on the end's stepped-back knee, D-PF3B-SLEDLEADER ruling (b), whose thigh then leans 23.9 deg
//   forward, since a leader to the start knee crosses the solid end figure or the end rope tail): the start hips sit back and down until the knees bend Q_KNEE and the thighs
//   lean Q_THIGH forward of vertical (c2 "quarter squat, knees soft, chest up", the bend from the hips), trunk upright.
//   That puts the start centre of mass behind the heels, held by the taut rope: the named balance exception
//   (sled_pull, start) of balanceProblems below, only with the start rope taut (sag <= TAUT_SAG), the trunk within
//   LEAN_TRUNK of vertical and the centre of mass at most LEAN_BACK behind the heels. The end keeps its step-back and
//   drag: its hips sit DRAG (the value the balanced construction gave before, kept) behind the start's, and its centre
//   of mass stays inside the heel-toe base. (Before: each pose's root z put the Winter centre of mass over the soles'
//   midpoint, the rope's light tension, c1, not counted.) The "Shoulders behind hips" tell anchors on the neck
//   (D-PF3B-SLEDTELL), so the Mistake still moves its tell anchor past PQ-H3's smallest approved deviation.
//  Hands (c1): both fists on the one rope at the midline (x 0), each arm ELBOW_BEND short of straight (c1 "arms
//   slightly bent"), so each fist lies on its shoulder's circle in the side plane: the near fist at the hips' height
//   (c3 "the rope close to your body"), the far fist GRIP_GAP (fists touching) below and behind it on the same circle
//   (c1 "one stacked over the other"). The rope (drawn here, D-PF3B-ROPE; was main's eq/rope.mjs strandOutline) runs from the sled's hitch ring into
//   the upper fist, down to the lower fist, and on to a short coil on the floor (plate.equipment, c5) centred under the
//   start's lower fist, so the start tail hangs plumb onto it.
//  End (plate.frames, c3): the near foot stepped STEP straight back (its toe at the far heel: the shortest step that
//   sets it wholly behind) and planted flat (c3 "driving through your midfoot"); arms and trunk unchanged (c2).
//  The drag (#305 6355155831 Q9): the sled's rear edge sits at SLED_Z plus the hips' z change on the drawn landmarks,
//   so the sled moves by the hips' displacement (DRAG) and the rope's run keeps its length (ROPE_RUN) and light
//   tension; the start sled and rope are redrawn dashed in the end pose (not in the Mistake view). A via ghost carries
//   the stepping foot flat, FOOT_CLEAR off the floor (mountain_climbers.mjs:49).
//  Mistake (c8): the pelvis tilts back M_TILT and the low back arches M_ARCH (hanging_leg_raise.mjs:69's approved lean
//   and arch). The sled stays where the end left it (c8 "When the pull becomes too heavy"), the taut rope keeps its run
//   and both arms keep their end direction in space, so the hips sag forward and down (c8 "don't let your hips sag":
//   M_Z, M_Y solved) until the upper fist is back on the rope's run, the stepped-back knee kept at the end's.
// Unsourced numbers (SIZES; lb10/sizes.json holds each with its basis): PX_PER_M, FOOT_X, KNEE_SOFT, ELBOW_BEND,
//  GRIP_GAP, SLED_Z, FOOT_CLEAR, COIL_D, COIL_TURNS, ROPE_T, ROPE_SAG (unused since D-PF3B-ROPE), TAIL_SAG, LAY, M_TILT, M_ARCH, Q_THIGH, TAUT_SAG (LEAN_TRUNK and
//  LEAN_BACK are ruled, D-PF3B-SLEDSQUAT); solved: STEP, HIP_Y, DRAG,
//  ROPE_RUN, M_Z, M_Y.
import { landmarksOf, WINTER, REF } from '../engine.mjs';
import { perItem } from '../eq/parts.mjs';
import { sled, SLED, SLED_ITEMS } from '../eq/sled.mjs';

const H = 1.75, R = Math.PI / 180;
// LIB-PLATEFIX-3 round 2 (#405 6685743439 sled_pull R7 [3,3,3]): SLED_Z 0.9 -> 0.78, the sled group 15 px left, so the
// dashed start sled ends 13.9 px inside the frame (it was clipped at 358); no body change.
export const SIZES = Object.freeze({ PX_PER_M: 126, FOOT_X: 0.145, KNEE_SOFT: 15, ELBOW_BEND: 18, GRIP_GAP: 0.07, SLED_Z: 0.58, FOOT_CLEAR: 0.025,
  COIL_D: 0.266, COIL_TURNS: 3, ROPE_T: 0.028, ROPE_SAG: 0.006, M_TILT: -14, M_ARCH: -12, Q_KNEE: 42, Q_THIGH: 31, LEAN_TRUNK: 10, LEAN_BACK: 0.1, TAUT_SAG: 0.01, LOOP_H: 0.044, LOOP_DZ: 0.05, TAIL_SAG: 0.07, LAY: 0.035 });
const { FOOT_X, KNEE_SOFT, ELBOW_BEND, GRIP_GAP, SLED_Z, FOOT_CLEAR, COIL_D, COIL_TURNS, ROPE_T, M_TILT, M_ARCH, Q_KNEE, Q_THIGH, LEAN_TRUNK, LEAN_BACK, TAUT_SAG, LOOP_H, LOOP_DZ, TAIL_SAG, LAY } = SIZES;

export const bisect = (f, a, b, what) => {
  let fa = f(a), fb = f(b), side = 0;
  if (!(fa * fb <= 0)) throw new Error(`sled_pull: no root for ${what} in [${a}, ${b}] (${fa}, ${fb})`);
  for (let i = 0; i < 80 && Math.abs(b - a) > 1e-8; i++) {
    const c = (a * fb - b * fa) / (fb - fa), fc = f(c);
    if (fc * fb > 0) { b = c; fb = fc; if (side === -1) fa /= 2; side = -1; } else if (fa * fc > 0) { a = c; fa = fc; if (side === 1) fb /= 2; side = 1; } else return c;
  }
  return (a + b) / 2;
};
const v3 = { sub: (a, b) => a.map((x, i) => x - b[i]), add: (a, b) => a.map((x, i) => x + b[i]), mul: (a, k) => a.map(x => x * k) };
const unit = a => { const L = Math.hypot(...a); return a.map(x => x / L); };
const mid = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
const kneeOf = (lm, s) => {
  const a = [0, 1, 2].map(i => lm[`hip.${s}`][i] - lm[`knee.${s}`][i]), b = [0, 1, 2].map(i => lm[`ankle.${s}`][i] - lm[`knee.${s}`][i]);
  return 180 - Math.acos((a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) / Math.hypot(...a) / Math.hypot(...b)) / R;
};
/** Winter (2009) whole-body centre of mass on the drawn landmarks (single_leg_romanian_deadlift.mjs:19-36 @ dcac4a38). */
export function com(lm) {
  let m = 0; const c = [0, 0, 0];
  const seg = (w, p) => { m += w; for (let i = 0; i < 3; i++) c[i] += w * p[i]; };
  seg(0.081, lm.ear); seg(0.497, mid(lm.shoulders, lm.hips, 0.5));
  for (const s of ['l', 'r']) {
    seg(0.028, mid(lm[`shoulder.${s}`], lm[`elbow.${s}`], 0.436)); seg(0.016, mid(lm[`elbow.${s}`], lm[`wrist.${s}`], 0.430)); seg(0.006, lm[`grip.${s}`]);
    seg(0.100, mid(lm[`hip.${s}`], lm[`knee.${s}`], 0.433)); seg(0.0465, mid(lm[`knee.${s}`], lm[`ankle.${s}`], 0.433)); seg(0.0145, mid(lm[`heel.${s}`], lm[`toe.${s}`], 0.5));
  }
  return c.map(v => v / m);
}

// c3 "short" step: the stepping foot's toe set at the stance heel, the shortest step that puts it wholly behind
// (heel landmark to toe landmark, body.mjs:25, :155-156).
export const STEP = (REF.toe - (REF.heel + 0.008)) * H;
const flat = (x, z, y = 0) => ({ at: [x, y, z], ref: 'mid' });
const FEET = { start: { l: flat(FOOT_X, 0), r: flat(-FOOT_X, 0) }, end: { l: flat(FOOT_X, 0), r: flat(-FOOT_X, -STEP) } };
// The near arm's shoulder-to-grip reach at ELBOW_BEND (wrist straight; the engine's two-bone lengths, body.mjs:206-209).
const L1 = WINTER.upperArm * H, L2 = (WINTER.forearm + REF.gripOff) * H;
const REACH = Math.sqrt(L1 * L1 + L2 * L2 + 2 * L1 * L2 * Math.cos(ELBOW_BEND * R));
// The sled's hitch ring (eq/sled.mjs pull form): centre on the rear edge, above the hitch bracket. The rope leaves the
// ring toward the upper fist.
const RING_Y = SLED.bodyY + SLED.bodyT / 2 + SLED.hitchH + SLED.ringR;
const ringAt = rearZ => [0, RING_Y, rearZ];
const hitchOf = (front, rearZ) => { const c = ringAt(rearZ); return v3.add(c, v3.mul(unit(v3.sub(front, c)), SLED.ringR)); };
const POLE = { l: [0, -1, -0.4], r: [0, -1, -0.4] };   // c4 "elbows tucked": the elbows down and back, the bend in the side plane
// The hands (c1): both fists on the one rope at the body's midline (x 0), each arm ELBOW_BEND short of straight, so
// each fist lies on its shoulder's circle of REACH in the side plane. The near fist at the hips' height (c3 "the rope
// close to your body"); the far fist GRIP_GAP below and behind it on the same circle ("one stacked over the other"):
// the rope runs from the hitch into the upper fist, down through the lower one, and on to the coil.
const gripsAt = lm => {
  const S = lm['shoulder.r'], r = Math.sqrt(REACH ** 2 - S[0] ** 2), phi = Math.acos((S[1] - lm.hips[1]) / r), dphi = 2 * Math.asin(GRIP_GAP / 2 / r);
  const at = a => [0, S[1] - r * Math.cos(a), S[2] + r * Math.sin(a)];
  return { r: { at: at(phi), pole: POLE.r }, l: { at: at(phi - dphi), pole: POLE.l } };
};

const bodyAt = (y, z, feet) => ({ root: { at: [0, y, z], tilt: 0 }, trunk: 0, neck: 0, plant: feet });
// The root's z in a pose: the centre of mass over the soles' midpoint (the feet are the base, c2; the rope's light
// tension, c1, is not counted).
const balanced = (y, feet, zc) => bisect(z => com(landmarksOf(bodyAt(y, z, feet), H))[2] - zc, -0.6, 0.4, 'balance');
// The hips keep one height through the step, so the hands and the rope keep theirs (Q9). KNEE_SOFT no longer drives
// the solve (it stays in SIZES and lb10/sizes.json with its record, unused).
// LIB-PLATEFIX-3 (W7 #394 6682923012 L1 [4,3,3], ruled #405 6683319630; c2 "quarter-squat"): the height at which the
// start knees bend Q_KNEE (was: the stepped-back knee KNEE_SOFT in the end, which left the start knees at 29.4 deg and
// read as standing). The end's stepped-back knee then follows from that height (still soft, c2).
// LIB-PLATEFIX-3b (D-PF3B-SLEDSQUAT): that balanced construction now only gives the drag (the hips' shift through the
// step, kept as it was); the start hips are set by the squat itself.
const BAL_Y = bisect(y => kneeOf(landmarksOf(bodyAt(y, balanced(y, FEET.start, 0), FEET.start), H), 'l') - Q_KNEE, 0.6, 0.93, 'hip height');
export const DRAG = balanced(BAL_Y, FEET.end, -STEP / 2) - balanced(BAL_Y, FEET.start, 0);
// The thigh's lean from vertical in the side plane, + = the knee toward the sled.
const thighOf = (lm, s) => Math.atan2(lm[`knee.${s}`][2] - lm[`hip.${s}`][2], lm[`hip.${s}`][1] - lm[`knee.${s}`][1]) / R;
// LIB-PLATEFIX-3b (D-PF3B-SLEDSQUAT): the start hips at the height and depth where the knees bend Q_KNEE and the thighs
// lean Q_THIGH forward (both legs alike: the feet side by side); the end's hips DRAG behind them at the same height.
// (The knee falls steadily as the hips go back at these heights, the thigh's lean does not: the depth is solved on the
// knee, the height on the thigh.)
const startZ = y => bisect(z => kneeOf(landmarksOf(bodyAt(y, z, FEET.start), H), 'l') - Q_KNEE, -0.3, -0.05, 'the start depth');
export const HIP_Y = bisect(y => thighOf(landmarksOf(bodyAt(y, startZ(y), FEET.start), H), 'l') - Q_THIGH, 0.845, 0.865, 'hip height');
const START_Z = startZ(HIP_Y), END_Z = START_Z + DRAG;
const withHands = p => ({ ...p, reach: gripsAt(landmarksOf(p, H)) });
const start = withHands(bodyAt(HIP_Y, START_Z, FEET.start));
const end = withHands(bodyAt(HIP_Y, END_Z, FEET.end));
// The Mistake is drawn against the end, with the sled where the end left it (static from the end on).
const sledZ = (lm, ctx) => SLED_Z + ((ctx.pose === 'mistake' ? END_Z : lm.hips[2]) - ctx.start.hips[2]);
// The rope's landmarks: the Mistake keeps the end's (its fists hold the end's grips; the rope does not move).
const ropeLm = (lm, ctx) => (ctx.pose === 'mistake' ? landmarksOf(end, H) : lm);
// Via (a ghost): halfway, the stepping foot flat and FOOT_CLEAR off the floor (mountain_climbers.mjs:49).
const via = [withHands(bodyAt(HIP_Y, (START_Z + END_Z) / 2, { l: FEET.start.l, r: flat(-FOOT_X, -STEP / 2, FOOT_CLEAR) }))];
// The rope's run, hitch to the upper fist (constant by the drag).
export const runOf = (lm, rearZ) => Math.hypot(...v3.sub(lm['grip.r'], hitchOf(lm['grip.r'], rearZ)));
export const ROPE_RUN = runOf(landmarksOf(start, H), SLED_Z);
// Mistake (c8; #331 panel mx2 item 1): only the body pitches back, pelvis M_TILT and lumbar M_ARCH. The sled, the rope,
// the coil and both fists stay exactly where the end has them (the heavy sled holds; c8 "When the pull becomes too
// heavy"), so the fists keep the end's grips by reach, each arm ELBOW_BEND short of straight as in the end (the near
// shoulder REACH from its fist). The hips go forward and down (c8 "don't let your hips sag": M_Z and M_Y, solved) and
// the shoulders back, the stepped-back knee kept at the end's (END_KNEE_R).
const EZ = SLED_Z + DRAG;
const mBody = (y, z) => ({ root: { at: [0, y, z], tilt: M_TILT }, trunk: M_ARCH, neck: 0 });
const mLm = (y, z) => landmarksOf({ ...end, ...mBody(y, z) }, H);
const LE0 = landmarksOf(end, H), END_KNEE_R = kneeOf(LE0, 'r');   // the Mistake keeps the end's stepped-back knee (LIB-PLATEFIX-3)
const mY = z => bisect(y => kneeOf(mLm(y, z), 'r') - END_KNEE_R, 0.4, HIP_Y + 0.05, 'the Mistake height');
export const M_Z = bisect(z => Math.hypot(...v3.sub(mLm(mY(z), z)['shoulder.r'], LE0['grip.r'])) - REACH, END_Z - 0.1, END_Z + 0.3, 'the Mistake root');
export const M_Y = mY(M_Z);
const mistake = { ...mBody(M_Y, M_Z), reach: end.reach };

// Rope items (drawn below, D-PF3B-ROPE): the run from the hitch into the upper fist, the short link down to the lower
// fist, and the slack tail from it, dropping and sagging (TAIL_SAG) onto the coil; the coil is
// COIL_TURNS flattened rope loops lying on the floor, overlapping (plate.equipment "a short coil of rope at the feet", c5
// "the rope piles up near your feet"; #331 panel mx2 item 3), centred under the start's lower fist, so the start tail
// hangs onto it; the pile lies still while the lifter steps back.
// LIB-PLATEFIX-3b (D-PF3B-SLEDSQUAT): with the start hips back the start's lower fist is over the toes, so the coil is
// set just in front of the start toes instead (its nearest loop ROPE_T / 2 clear of them, the gap the coil had before,
// 1.4 cm); the start tail then falls forward onto it in its soft curve.
const COIL_Z = landmarksOf(start, H)['toe.l'][2] + (COIL_TURNS - 1) / 2 * LOOP_DZ + COIL_D / 2 + ROPE_T / 2, COIL_TOP = [0, LOOP_H, COIL_Z];
// LIB-PLATEFIX-3b (D-PF3B-ROPE): the rope reads as rope, not a tube with rounded ends (was: three eq/rope.mjs
// strandOutline tubes, each a smoothed closed outline whose ends drew round, the tail a near-straight 4 cm bow).
//  The taut run (hitch to the upper fist) and the link between the fists: straight bands ROPE_T wide with square-cut
//  ends (plain polygons, no curve, no sag: the run is taut), the run crossed by lay marks: one thin diagonal across the
//  band every LAY along it, each spanning ROPE_T along the rope (a laid rope's strands seen from the side; eq-thin, no
//  round caps). The slack tail drops from the lower fist and sags into the coil: one cubic Bezier centre line that
//  leaves the fist plumb and meets the coil's top level, its handles one fraction of the drop and of the run, solved
//  so the line's greatest distance below the fist-to-coil chord is TAIL_SAG (a slack rope, not a bow).
const nrm = u => [0, -u[2], u[1]];   // in the side plane, square to u
const band = (a, b) => { const o = v3.mul(nrm(unit(v3.sub(b, a))), ROPE_T / 2); return [v3.add(a, o), v3.add(b, o), v3.sub(b, o), v3.sub(a, o)]; };
const N_LAY = Math.floor((ROPE_RUN - ROPE_T) / LAY);
const layMarks = (a, b) => { const u = unit(v3.sub(b, a)), o = v3.mul(nrm(u), ROPE_T / 2);
  return Array.from({ length: N_LAY }, (_, k) => { const s = v3.add(a, v3.mul(u, (k + 0.5) * LAY)); return [v3.add(s, o), v3.sub(v3.add(s, v3.mul(u, ROPE_T)), o)]; }); };
const bez = (P, t) => [0, 1, 2].map(i => (1 - t) ** 3 * P[0][i] + 3 * (1 - t) ** 2 * t * P[1][i] + 3 * (1 - t) * t * t * P[2][i] + t ** 3 * P[3][i]);
const tailHandles = (a, b, k) => [a, [0, a[1] - k * (a[1] - b[1]), a[2]], [0, b[1], b[2] - k * (b[2] - a[2])], b];
const TAIL_N = 16;
/** The tail's greatest distance below the straight line from a (the fist) to b (the coil), handle fraction k. */
const tailSag = (a, b, k) => { const P = tailHandles(a, b, k), n0 = nrm(unit(v3.sub(b, a))), n = n0[1] > 0 ? v3.mul(n0, -1) : n0;   // n: the chord's downward side
  return Math.max(...Array.from({ length: 99 }, (_, i) => v3.sub(bez(P, (i + 1) / 100), a).reduce((s, v, j) => s + v * n[j], 0))); };
const tailLine = (a, b, n) => { const P = tailHandles(a, b, bisect(x => tailSag(a, b, x) - TAIL_SAG, 0.01, 1, 'the tail handles'));
  return Array.from({ length: n + 1 }, (_, i) => bez(P, i / n)); };
const tail = (a, b) => {
  const c = tailLine(a, b, TAIL_N);
  const off = c.map((p, i) => v3.mul(nrm(unit(v3.sub(c[Math.min(i + 1, TAIL_N)], c[Math.max(i - 1, 0)]))), ROPE_T / 2));
  const left = c.map((p, i) => v3.add(p, off[i])), right = c.map((p, i) => v3.sub(p, off[i])).reverse();
  return [...left, c[TAIL_N], ...right, c[0]];   // the end midpoints keep each end square across the spline
};
// The tail's lay marks: the run's marks laid along the curve, one every LAY of its length from the fist.
const tailMarks = (a, b) => {
  const c = tailLine(a, b, 400), s = [0];
  for (let i = 1; i < c.length; i++) s.push(s[i - 1] + Math.hypot(...v3.sub(c[i], c[i - 1])));
  const at = d => { const i = Math.min(c.length - 2, s.findIndex(v => v >= d) - 1), t = (d - s[i]) / (s[i + 1] - s[i]); return [mid(c[i], c[i + 1], t), unit(v3.sub(c[i + 1], c[i]))]; };
  return Array.from({ length: Math.floor((s[s.length - 1] - ROPE_T) / LAY) }, (_, k) => {
    const [p, u] = at((k + 0.5) * LAY), [q, w] = at((k + 0.5) * LAY + ROPE_T);
    return [v3.add(p, v3.mul(nrm(u), ROPE_T / 2)), v3.sub(q, v3.mul(nrm(w), ROPE_T / 2))];
  });
};
const ropeItems = (lm, rearZ) => { const h = hitchOf(lm['grip.r'], rearZ);
  return [{ type: 'poly', cls: 'eq-solid', z: 'mid', part: 'rope', pts: band(h, lm['grip.r']) },   // the three pieces first, as before
    { type: 'poly', cls: 'eq-solid', z: 'mid', part: 'rope', pts: band(lm['grip.r'], lm['grip.l']) },
    { type: 'poly', curve: true, cls: 'eq-solid', z: 'mid', part: 'rope', pts: tail(lm['grip.l'], COIL_TOP) },
    ...layMarks(h, lm['grip.r']).map(pts => ({ type: 'line', cls: 'eq-thin', z: 'mid', part: 'rope', pts })),
    ...tailMarks(lm['grip.l'], COIL_TOP).map(pts => ({ type: 'line', cls: 'eq-thin', z: 'mid', part: 'rope', pts }))]; };
const N_ROPE = Math.max(...[start, ...via, end].map(p => ropeItems(landmarksOf(p, H), SLED_Z).length));   // the most rope items a pose draws
// One loop: a flattened ring of rope (outer ellipse COIL_D by LOOP_H, the band ROPE_T wide at its ends and half that at
// its top and bottom, as a loop lying on the floor reads from a low side view), one closed outline: the outer ellipse,
// then the inner one back the other way, joined at the loop's far end.
const coil = () => Array.from({ length: COIL_TURNS }, (_, k) => {
  const zc = COIL_Z + (k - (COIL_TURNS - 1) / 2) * LOOP_DZ, a = COIL_D / 2, b = LOOP_H / 2, n = 32;
  const ell = (ea, eb, rev) => Array.from({ length: n + 1 }, (_, i) => { const t = (rev ? n - i : i) / n * 2 * Math.PI; return [0, b + eb * Math.sin(t), zc + ea * Math.cos(t)]; });
  return { type: 'poly', cls: 'eq-solid', z: 'mid', part: 'coil', pts: [...ell(a, b, false), ...ell(a - ROPE_T, b - ROPE_T / 2, true)] };
});
// The start sled and rope, redrawn dashed in the end pose (D-LIB22-DRAW): each part's closed outline. Not in the
// Mistake view, where a dashed red outline marks the fault.
const outline = it => (it.pts ? [...it.pts, it.pts[0]] : (() => {   // a sideBar (backPad surface [hi, lo], t): its rectangle
  const [hi, lo] = it.surface, u = unit(v3.sub(hi, lo)), n = unit([0, -u[2], u[1]]), o = v3.mul(n, it.t);
  return [lo, hi, v3.sub(hi, o), v3.sub(lo, o), lo];
})());
const LS = landmarksOf(start, H), LE = landmarksOf(end, H);
const START_SLED = sled({ rearZ: SLED_Z, form: 'pull' }).map(it => ({ type: 'line', cls: 'eq-line m-line', pts: outline(it), z: 'back', part: 'startsled' }));
const START_ROPE = ropeItems(LS, SLED_Z).map(it => ({ type: 'line', cls: 'eq-line m-line', pts: [...it.pts, it.pts[0]], z: 'back', part: 'startrope' }));

const FLOOR = { point: [0, 0, 0], normal: [0, 1, 0] };
export default {
  id: 'sled_pull', name: 'Sled Pull', view: 'side', facing: 'right',
  // LIB-PLATEFIX-3b (D-PF3B-SLEDSQUAT): x0 145 -> 170 (25 px, the start hips' 0.2 m move back at PX_PER_M) and SLED_Z
  // 0.78 -> 0.58, so the figure, the hands, the rope and the sled stay where they were drawn and the labels keep their
  // room; the feet and the coil are drawn 25 px further right.
  camera: { pxPerM: SIZES.PX_PER_M, x0: 170, y0: 339 },
  poses: { start, via, end },
  equipment: [{ type: 'floor', from: -1.0, to: SLED_Z + SLED.len + 0.1 },   // the floor runs on under the whole start sled
    ...perItem((lm, ctx) => sled({ rearZ: sledZ(lm, ctx), form: 'pull' }), SLED_ITEMS),
    ...perItem((lm, ctx) => ropeItems(ropeLm(lm, ctx), sledZ(lm, ctx)), N_ROPE),
    ...perItem(() => coil(), COIL_TURNS),
    ...perItem((lm, ctx) => (ctx.pose === 'end' && !ctx.mistake ? [...START_SLED, ...START_ROPE] : null), START_SLED.length + START_ROPE.length)],
  checks: [
    ...['wrist.l', 'wrist.r'].map(landmark => ({ landmark, at: LS[landmark], pose: 'start', tol: 0.5 })),   // c1 fact: both hands on the rope
    ...['wrist.l', 'wrist.r'].map(landmark => ({ landmark, at: LE[landmark], pose: 'end', tol: 0.5 })),     // c4 fact: the rope through both hands
    ...['sole.l', 'sole.r'].map(landmark => ({ landmark, plane: FLOOR, pose: 'start', tol: 1 })),         // c2 facts: feet planted shoulder-width
    { landmark: 'sole.r', plane: FLOOR, pose: 'end', tol: 1 },                                              // c3 fact: driving through the midfoot
    ...['heel.l', 'heel.r', 'ball.l', 'ball.r'].map(landmark => ({ landmark, plane: FLOOR, pose: 'all', tol: 0.5 })),   // flat feet
    ...[['start', LS], ['end', LE]].map(([pose, L]) => ({ landmark: 'shoulder.r', plane: { point: L.hips, normal: [0, 0, 1] }, pose, tol: 1 })),   // c2: shoulders over the hips
  ],
  ghosts: { count: 1, parts: ['leg.r'] },
  trace: { point: 'ball.r', trim: [10, 12] },
  callouts: [
    // LIB-PLATEFIX-3b (D-PF3B-SLEDLEADER, ruling (b)): on the end's stepped-back knee, as before (a leader to the start
    // knee crosses the solid end figure or the end rope tail); that thigh now leans 23.9 deg forward (was 3.5)
    { key: 'squat', text: 'Quarter<br>squat', anchor: 'knee.r', box: { left: 16, top: 240 },   // LIB-PLATEFIX-3b (D-PF3B-SLEDLEADER): was left 24; the end knee now sits forward and that leader clipped the rear thigh
      cue: 'Knees soft in a quarter squat, chest up, core braced.' },
    { key: 'stack', text: 'Shoulders<br>over hips', anchor: 'backUpper', box: { left: 20, top: 124 },   // LIB-PLATEFIX-3: 20 px higher with the quarter squat (was top 144); LIB-PLATEFIX-3b (D-PF3B-SLEDLEADER): left 24 -> 20, that leader clipped the back
      cue: 'Keep your shoulders over your hips, not leaning far back.' },
    { key: 'steps', text: 'Short<br>steps<br>back', anchor: 'heel.r', box: { left: 50, top: 288 },   // LIB-PLATEFIX-3b (D-PF3B-SLEDLEADER): was { left: 8, top: 288 }; the end's rear heel now draws 25 px further right, so a steeper leader keeps 6 px off the floor
      cue: 'Short, quick steps back, driving through the midfoot.' },
  ],
  mistake: {
    pose: mistake,
    // no guide: a plumb line from the faulty hips lies inside the solid figure (hidden, #305 6356763967 item 8), and an
    // arrow between the two heads cannot clear the solid head by 6 px; the red outline carries the lean
    guides: [],
    tells: [
      { key: 'lean', text: 'Torso<br>pitched<br>back', anchor: { at: 'backUpper', pose: 'mistake', off: [-5, -12] }, box: { left: 8, top: 208 },   // LIB-PLATEFIX-3b (D-PF3B-SLEDTELL): was top 136, the boxes of the two tells swapped (see below)
        cue: 'The torso pitches back and the lower back takes the load.' },
      // LIB-PLATEFIX-3b (D-PF3B-SLEDTELL, #408, ruling (a)): anchored on the neck (was backUpper): with the squat start the
      // Mistake's backUpper moves 10.3 px from the end's, under PQ-H3's 11.39 px; the neck, at the shoulders, moves 12.2 px.
      // off [-6, 0] (the back of the neck): the neck's centre lies inside the solid end trunk, so a leader to it crosses the
      // end figure from every box; the offset is applied in both poses and leaves the deviation at 12.2 px; its box { left: 8, top: 208 } -> { left: 8, top: 136 } (the two tells swap boxes): the neck
      // is above the lean anchor, so its leader comes from above and the lean's from below; no leader enters a figure, crosses the
      // other or puts the two boxes' hit areas together
      { key: 'stack', text: 'Shoulders<br>behind<br>hips', anchor: { at: 'neck', pose: 'mistake', off: [-6, 0] }, box: { left: 8, top: 136 }, cue: 'The shoulders are no longer over the hips, leaning too far back.' },
    ],
  },
  tempo: [{ phase: 'Walk', move: true, word: 'Quick' }],   // D-STRIP-B untimed (lb10/tempo.json = strip/rows.json's row; tempoOf)
  zoom: { view: 'normal', k: 3 },   // D-LIBZOOM-EXTEND (lib4-cards §41; DESIGN.md §21): the stepping foot's path (ball.r), 74.9 px at k 3, the smallest k whose source ring fits the plate (D-LIB22-RINGFIT)
  alt: 'Sled pull, side view. Facing the sled in a quarter squat, shoulders over the hips, both hands one behind the other on the rope from the sled. One foot steps straight back and the sled follows by the same distance. A short coil of rope lies at the feet.',
};
export const info = { START_Z, END_Z, HIP_Y, DRAG, ROPE_RUN, STEP, M_Z, M_Y, REACH,
  pose: Object.fromEntries([['start', start], ['via', via[0]], ['end', end], ['mistake', { ...end, ...mistake }]].map(([k, p]) => { const l = landmarksOf(p, H);
    return [k, { com: +com(l)[2].toFixed(3), heelR: +l['heel.r'][2].toFixed(3), heelL: +l['heel.l'][2].toFixed(3), toeR: +l['toe.r'][2].toFixed(3), toeL: +l['toe.l'][2].toFixed(3),
      kneeL: +kneeOf(l, 'l').toFixed(1), kneeR: +kneeOf(l, 'r').toFixed(1), hips: l.hips.map(v => +v.toFixed(3)), gripR: l['grip.r'].map(v => +v.toFixed(3)), gripL: l['grip.l'].map(v => +v.toFixed(3)) }]; })) };

// LIB-PLATEFIX-3b (D-PF3B-SLEDSQUAT, #408): the balance rule. A standing pose's Winter centre of mass lies inside the
// planted heel-toe base (the rearmost heel to the foremost toe). One named exception, (sled_pull, start): the taut rope
// may hold the lean back, only with all three of the rope taut (the drawn run's sag <= TAUT_SAG), the trunk within
// LEAN_TRUNK of vertical and the centre of mass at most LEAN_BACK behind the heels. Inputs are measured on the drawn
// figure: lm the pose's engine landmarks, trunkDeg the shoulder-hip line's angle from vertical, ropeSag the drawn run's
// greatest distance from its chord (m).
export const LEAN_EXCEPTION = Object.freeze({ id: 'sled_pull', pose: 'start' });
export function balanceProblems({ id, pose, lm, trunkDeg, ropeSag }) {
  const c = com(lm)[2], heel = Math.min(lm['heel.l'][2], lm['heel.r'][2]), toe = Math.max(lm['toe.l'][2], lm['toe.r'][2]);
  if (c >= heel && c <= toe) return [];
  const where = `${id} ${pose}: centre of mass ${c.toFixed(3)} m outside the heel-toe base [${heel.toFixed(3)}, ${toe.toFixed(3)}]`;
  if (!(id === LEAN_EXCEPTION.id && pose === LEAN_EXCEPTION.pose) || c > toe) return [where];
  const out = [];
  if (!(ropeSag <= TAUT_SAG)) out.push(`${id} ${pose}: rope not taut (sag ${(ropeSag * 100).toFixed(1)} cm > ${TAUT_SAG * 100} cm)`);
  if (!(trunkDeg <= LEAN_TRUNK)) out.push(`${id} ${pose}: trunk ${trunkDeg.toFixed(1)} deg from vertical > ${LEAN_TRUNK} deg`);
  if (!(heel - c <= LEAN_BACK)) out.push(`${id} ${pose}: centre of mass ${((heel - c) * 100).toFixed(1)} cm behind the heels > ${LEAN_BACK * 100} cm`);
  return out;
}
