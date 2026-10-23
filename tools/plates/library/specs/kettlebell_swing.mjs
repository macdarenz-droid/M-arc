// Kettlebell swing (two-hand, Russian swing to chest height), side view, figure facing screen right. LIB-22 (LB10, H).
// View: side (card plate.view = census). The hinge, the flat back, the bell between the legs and at chest height, the
//  stacked top and the lean-back fault are all sagittal.
// Sources: research card docs/research/howto/cards/kettlebell_swing.json (research head 596dbe07): c1 stance; c2 both
//  hands on the handle, palms down; c5 the hike, high toward the groin, forearms by the thighs; c6 the hinge, knees only
//  slightly bent, MF "hinging your torso until it is parallel with the floor"; c7 hips drive, arms straight and loose;
//  c8 the stacked top; c9 chest height; c13 flat back; c14 leaning back (the Mistake); c17 feet planted, weight back
//  toward the heels; c25 the 16 kg study bell; c26 tempo 1-0-1.
// Clone (D-LIB22-CLONE): barbell_back_squat (the 8: the side-view stance), romanian_deadlift (#109 @ dcac4a38: KNEE 15
//  and the hinge solve), single_leg_romanian_deadlift (#109: the Winter centre of mass); copied, never imported.
// Geometry (confirmed by the report's contacts and checks, and by tests on the drawn items):
//  Start (the hike, c5, c6): trunk START_INCL 90 (parallel to the floor), spine neutral (trunk 0), knees KNEE 15; the
//   straight arms point at the near thigh's axis GRIP_T from the hip, so the forearms run along the thighs and the bell
//   hangs on behind, between the legs in depth (z `mid`); the root's z is solved so the body and the drawn bell balance
//   over the ankle (c17, the heel side of mid-foot).
//  Via (ghosts only, D-LIB22-CYCLE): the bell between the knees (VIA1, c5 HK) and in front at hip height (VIA2, c7),
//   each balanced the same way. Every key pose's arms are joint angles (the reach solved once), so the hands and bell
//   swing on arcs, never on straight chords through the legs.
//  End (c8, c9): stacked over the ankles, knees straight; the arms straight with the bell centre at the chest's height.
//  Mistake (c14): the pelvis tilts back M_TILT and the low back arches M_ARCH (hanging_leg_raise.mjs:69's approved
//   arch); the arms keep the top's angle in space. Tells: leaning back (c14 Nike), the low back arching (c14 BarBend
//   "hyperextending your low back", c15).
//  The bell (eq/kettlebell.mjs) hangs on along the arm line; its mass comes from its drawn size (bellMass, NOTE RULED 7).
//  The start bell is redrawn dashed (the start layer drops moving equipment, D-LIB22-DRAW).
// Unsourced numbers (SIZES; lb10/sizes.json holds each with its basis): FOOT_X, TOE_OUT, KNEE, START_INCL, GRIP_T,
//  GRIP_X, VIA1_*, VIA2_*, M_TILT, M_ARCH, BODY_KG, TOP_KNEE; solved: END_PHI, BELL_KG.
import { landmarksOf, WINTER, REF, normPose, resolve } from '../engine.mjs';
import { perItem } from '../eq/parts.mjs';
import { kettlebell, KETTLEBELL_ITEMS, bellCentre, bellMass } from '../eq/kettlebell.mjs';

const H = 1.75, R = Math.PI / 180;
export const SIZES = Object.freeze({ FOOT_X: 0.18, TOE_OUT: 17, KNEE: 15, START_INCL: 90, GRIP_T: 0.35, GRIP_X: 0.045,
  VIA1_INCL: 55, VIA1_KNEE: 12, VIA1_PHI: -5, VIA2_INCL: 22, VIA2_KNEE: 5, VIA2_PHI: 45, M_TILT: -14, M_ARCH: -12, BODY_KG: 75, TOP_KNEE: 1 });
const { FOOT_X, TOE_OUT, KNEE, START_INCL, GRIP_T, GRIP_X, VIA1_INCL, VIA1_KNEE, VIA1_PHI, VIA2_INCL, VIA2_KNEE, VIA2_PHI, M_TILT, M_ARCH, BODY_KG, TOP_KNEE } = SIZES;
// The drawn bell's mass (eq/kettlebell.mjs bellMass: its sizes in cast iron), for the balance (NOTE RULED 7).
export const BELL_KG = bellMass();
const ARM = (WINTER.upperArm + WINTER.forearm + REF.gripOff) * H - 0.0001;

export const bisect = (f, a, b, what) => {
  let fa = f(a), fb = f(b), side = 0;
  if (!(fa * fb <= 0)) throw new Error(`kettlebell_swing: no root for ${what} in [${a}, ${b}] (${fa}, ${fb})`);
  for (let i = 0; i < 80 && Math.abs(b - a) > 1e-8; i++) {
    const c = (a * fb - b * fa) / (fb - fa), fc = f(c);
    if (fc * fb > 0) { b = c; fb = fc; if (side === -1) fa /= 2; side = -1; } else if (fa * fc > 0) { a = c; fa = fc; if (side === 1) fb /= 2; side = 1; } else return c;
  }
  return (a + b) / 2;
};
const toe = s => [s * Math.sin(TOE_OUT * R), 0, Math.cos(TOE_OUT * R)];
const feet = { l: { at: [FOOT_X, 0, 0], toe: toe(1) }, r: { at: [-FOOT_X, 0, 0], toe: toe(-1) } };
const kneeOf = lm => {
  const a = [0, 1, 2].map(i => lm['hip.r'][i] - lm['knee.r'][i]), b = [0, 1, 2].map(i => lm['ankle.r'][i] - lm['knee.r'][i]);
  return 180 - Math.acos((a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) / Math.hypot(...a) / Math.hypot(...b)) / R;
};
const body = (y, z, incl) => ({ root: { at: [0, y, z], tilt: incl }, trunk: 0, neck: 0, plant: feet });
const LEG = (WINTER.thigh + WINTER.shank) * H, STAND_Z = -REF.mid * H * Math.cos(TOE_OUT * R);
const STAND_Y = Math.sqrt(LEG ** 2 - (FOOT_X * Math.cos(TOE_OUT * R) - REF.hjcX * H) ** 2) + WINTER.ankleH * H - 0.0005;
const hipY = (z, knee, incl) => bisect(y => kneeOf(landmarksOf(body(y, z, incl), H)) - knee, 0.6, STAND_Y + 0.02, 'hip height');
const mid = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
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
const bellDir = lm => { const g = lm.grips, S = lm.shoulders; return [0, g[1] - S[1], g[2] - S[2]]; };
export const bellOf = lm => bellCentre([0, lm.grips[1], lm.grips[2]], bellDir(lm));
export const comWith = lm => { const c = com(lm), b = bellOf(lm); return (c[2] * BODY_KG + b[2] * BELL_KG) / (BODY_KG + BELL_KG); };
// The grip pair with the straight arms at world angle phi from straight down (+ forward).
const gripsAt = (lm, phi) => { const S = lm['shoulder.l'], A = Math.sqrt(ARM ** 2 - (S[0] - GRIP_X) ** 2), y = S[1] - A * Math.cos(phi * R), z = S[2] + A * Math.sin(phi * R);
  return { l: { at: [GRIP_X, y, z], pole: [0.3, 0, -1] }, r: { at: [-GRIP_X, y, z], pole: [-0.3, 0, -1] } }; };
// c17: the weight back toward the heels: the body and bell balance over the ankle joint (the heel side of mid-foot).
const BAL_Z = -REF.mid * H;
// The arms of a key pose as joint angles (the reach solved once), so the engine blends them as angles and the hands
// and bell swing on arcs between the key poses instead of straight chords.
function armsAsAngles(p) {
  const q = resolve(normPose(p, { height: H }), { height: H }).q, { reach, ...rest } = p;
  return { ...rest, shoulder: { l: { ...q.sh.l }, r: { ...q.sh.r } }, elbow: { ...q.elbow } };
}
// A key pose: trunk inclination, knee bend and arm angle; the root's z is solved so the body and bell balance over mid-foot.
function keyAt(incl, knee, phiOf) {
  const at = z => { const y = knee < 0.5 ? STAND_Y : hipY(z, knee, incl), b = body(y, z, incl), lm = landmarksOf(b, H); return { ...b, reach: gripsAt(lm, phiOf(lm)) }; };
  return armsAsAngles(at(bisect(z => comWith(landmarksOf(at(z), H)) - BAL_Z, -0.6, 0.2, 'balance')));
}
// Start (the hike): the straight arms point at the near thigh's axis at GRIP_T from the hip (forearms along the thighs).
const thighPhi = lm => { const S = lm.shoulders, Q = mid(lm['hip.r'], lm['knee.r'], GRIP_T); return Math.atan2(Q[2] - S[2], S[1] - Q[1]) / R; };
const start = keyAt(START_INCL, KNEE, thighPhi);
const via = [keyAt(VIA1_INCL, VIA1_KNEE, () => VIA1_PHI), keyAt(VIA2_INCL, VIA2_KNEE, () => VIA2_PHI)];
// End: standing tall, stacked over the ankles (c8); the bell centre at the chest's height (c9).
// c8 HK "pulling your kneecaps up strongly": the knees straight (TOP_KNEE short of the IK's singular full extension).
const TOP_Y = bisect(y => kneeOf(landmarksOf(body(y, STAND_Z, 0), H)) - TOP_KNEE, 0.85, STAND_Y + 0.02, 'top height');
const stand = (incl = 0) => body(TOP_Y, STAND_Z, incl);
const E0 = landmarksOf(stand(), H);
const bellY = phi => { const g = gripsAt(E0, phi).r.at, S = E0.shoulders; return bellCentre([0, g[1], g[2]], [0, g[1] - S[1], g[2] - S[2]])[1] - E0.chest[1]; };
export const END_PHI = bisect(bellY, 40, 100, 'end arm angle');
const end = armsAsAngles({ ...stand(), reach: gripsAt(E0, END_PHI) });
const M0 = landmarksOf({ ...stand(), root: { at: end.root.at, tilt: M_TILT }, trunk: M_ARCH }, H);
const mistake = (() => { const { shoulder, elbow } = armsAsAngles({ ...stand(), root: { at: end.root.at, tilt: M_TILT }, trunk: M_ARCH, reach: gripsAt(M0, END_PHI) }); return { root: { at: end.root.at, tilt: M_TILT }, trunk: M_ARCH, shoulder, elbow }; })();

const bellItems = lm => kettlebell({ grip: [0, lm.grips[1], lm.grips[2]], dir: bellDir(lm), z: 'mid' });
const LS = landmarksOf(start, H);
const START_BELL = bellItems(LS).map(it => ({ type: 'line', cls: 'eq-line m-line', pts: [...it.pts, it.pts[0]], z: 'back', part: 'startbell' }));

const FLOOR = { point: [0, 0, 0], normal: [0, 1, 0] };
export default {
  id: 'kettlebell_swing', name: 'Kettlebell Swing', view: 'side', facing: 'right',
  camera: { x0: 150, y0: 339 },
  poses: { start, via, end },
  equipment: [
    { type: 'floor', from: -0.8, to: 1.0 },
    ...perItem(lm => bellItems(lm), KETTLEBELL_ITEMS),
    ...perItem((lm, ctx) => (ctx.pose === 'end' ? START_BELL : null), 2),
  ],
  // c17: the feet planted, heels and toes down, in every pose
  checks: [
    ...['heel.l', 'heel.r', 'ball.l', 'ball.r'].map(landmark => ({ landmark, plane: FLOOR, pose: 'all', tol: 0.5 })),
    ...['wrist.l', 'wrist.r'].map(landmark => ({ landmark, at: LS[landmark], pose: 'start', tol: 0.5 })),   // c2 fact: both hands on the handle
  ],
  ghosts: { count: 2, parts: ['arm.r', 'bell'] },
  trace: { point: 'grip.r', trim: [10, 12] },
  // c8: the stack line, plumb through the ankle up past the shoulder (ankles, knees, hips and shoulders in line)
  datum: [{ x: 'ankle.r', from: 'ankle.r', to: { at: 'head', off: [0, -6] } }],
  callouts: [
    { key: 'hinge', text: 'Hinge,<br>not squat', anchor: 'start:buttock', box: { left: 16, top: 150 }, cue: 'Hips back, knees only slightly bent.' },
    { key: 'flat', text: 'Flat back', anchor: 'backMid', box: { left: 16, top: 96 }, cue: 'Back flat and straight through the whole swing.' },
    { key: 'tall', text: 'Stand tall', anchor: 'head', box: { left: 148, top: 48 }, cue: 'At the top, ankles, knees, hips and shoulders in line.' },
  ],
  tempo: [{ phase: 'Drive', s: 1, move: true }, { phase: 'Swing down', s: 1, move: true }],
  mistake: {
    pose: mistake,
    guides: [{ kind: 'arrow', from: { at: 'backUpper', pose: 'end', off: [-9, 0] }, to: { at: 'backUpper', pose: 'mistake', off: [-3, 0] } }],
    tells: [
      { key: 'lean', text: 'Leaning back', anchor: { at: 'head', pose: 'mistake' }, box: { left: 16, top: 56 }, cue: 'Leaning back at the top of the swing.' },
      { key: 'arch', text: 'Low back<br>arches', anchor: { at: 'backMid', pose: 'mistake' }, box: { left: 16, top: 150 }, cue: 'The low back overextends instead of the glutes finishing.' },
    ],
  },
  alt: 'Kettlebell swing, side view. From the hinge with the bell hiked back between the legs, the hips drive forward and the straight arms swing the bell to chest height. At the top the body stands stacked over the ankles.',
};
export const info = { END_PHI, pose: Object.fromEntries([['start', start], ['via1', via[0]], ['via2', via[1]], ['end', end], ['mistake', { ...end, ...mistake }]].map(([k, p]) => { const lm = landmarksOf(p, H); return [k, { body: +com(lm)[2].toFixed(3), withBell: +comWith(lm).toFixed(3), heel: +lm['heel.r'][2].toFixed(3), toe: +lm['toe.r'][2].toFixed(3), bell: bellOf(lm).map(v => +v.toFixed(3)), hip: lm.hips.map(v => +v.toFixed(3)) }]; })) };
