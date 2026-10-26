// Superman, side view, figure facing screen right (head right, feet left), lying face down on a mat. LIB-21 (LB9, H).
// View: side (card plate.view = census): the head and neck line (c5, c6), the height of the arms and legs off the floor
//  (c2, c3) and the back's arch (c3, c7) are sagittal.
// Sources: research card docs/research/howto/cards/superman.json: c1 lie prone on a mat, legs extended, ankles slightly
//  plantarflexed (toes pointing away from the shins), arms extended overhead, palms facing each other, head relaxed in
//  line with the spine; c2 raise both legs and both arms a few inches off the floor at the same time, keeping the core
//  on the ground; c3 lift 3-6 inches with a slight arch, without hyperextending the back; c4 arms and legs straight, no
//  rotation, without locking the joints; c5 head and neck neutral, eyes down; c6 lifting the head too high, looking up,
//  the head and neck out of neutral line (the Mistake); c9 shoulders down and back; c11 hold about 3 s; c19 the tempo
//  (card tempo: Lift 1, Hold 3, Lower 2). plateFacts: the navel on the mat at the start (c1) and at the end (c2).
// Clone (D-LIB21-CLONE): hanging_leg_raise (census closest; its 12 deg lumbar arch and its trace trim); bird_dog (this
//  branch: the mat, the floor camera, the Winter com, the flat palms, the boxed labels) and plank (#109 @ dcac4a38: the
//  prone body, the floor camera); copied, never imported.
// Geometry (confirmed by the report's checks and by measuring the drawn outlines against the mat and the floor; `info`):
//  Contacts are solved on the drawn outlines (engine bodyShapes in world metres), not on landmarks, so the drawn body
//  rests on the mat with no bearing (0.00 cm into it in every pose) and nothing below the mat top or the floor.
//  Mat (c1): one exercise mat MAT_T thick and MAT_LEN long (bird_dog's mat), centred on the start's navel; static. A
//   prone body with the arms overhead spans 2.30 m, longer than the mat: the trunk, thighs and shins lie on it, the
//   forearms rest on its head-end edge and the hands and feet rest on the floor beyond its ends (MAT_T, 1.4 px, lower).
//  Start (c1): trunk 0 and neck 0 (head in line, eyes to the floor; the face clears the mat by 3.4 cm). The pelvis tilt
//   is solved so the drawn chest and pelvis (the torso's lowest points head-side and foot-side of the navel) touch the
//   mat top together; the navel then sits 0.05 cm above it (check, c1). Legs straight (knee 0), the hip angle solved so
//   the legs rest on the mat (+2.2 deg); ankles plantarflexed until the toes rest on the floor (solved, -71.3 deg: c1
//   "toes pointing away from your shins"; prone, the toes reach the floor only that far down). Arms straight overhead
//   (elbow 0, shoulder flexion solved 168.0 deg so the forearm rests on the mat edge), wrists straight (0), the flat
//   hands' fingertips on the floor. Palms facing each other (c1) is the engine's unrotated arm (rot 0, palms medial);
//   the side view draws the open hand ('flat') in profile.
//  End (c2, c3, c4, c5, c9): the slight arch END_ARCH (lumbar extension, c3), the pelvis re-solved on the mat as at the
//   start, so the navel stays on it (-0.16 cm, check, c2 "keeping your core on the ground"). Legs (hip extension,
//   solved -0.9 deg) and arms (shoulder flexion, solved 158.9 deg) straight and lifted until the lowest drawn point of
//   the feet and of the hands is LIFT above the floor under it (c3 "3-6 inches": 3 in, the lowest the range allows;
//   c2 "a few inches"). c4 "straight without locking the joints": elbow and knee 0, the engine's straight limb; no quote
//   gives a bend, so none is drawn. Ankles and wrists as at the start; head and neck neutral (neck 0, c5); shoulder
//   girdle neutral, no shrug (scap 0, c9 "shoulders down": the engine's resting girdle; no depression size is stated).
//  Mistake (c6): the head lifted to look up, the neck out of line: neck extension M_NECK at the engine's one neck pivot
//   (C7); nothing else moves. The head swings out of the solid figure (crown 27.6 px), drawn dashed red, with one red
//   arrow beside the crown's path that clears the end figure by 7.1 px.
//  Balance (D-LIB21-BALANCE, c1, c2): the base is the trunk's (and at the start the thighs' and shins') floor contact,
//   the z span of the drawn torso and leg points within 0.5 cm of the mat top. Centre of mass (Winter on the drawn
//   landmarks) inside it: start 25.3 cm, end 4.2 cm, Mistake 4.5 cm from its nearer end (baseOf).
//  Ghosts: none (count 0): the lift is 3 in, so in-between poses would lie on the solid figure and the start phantom.
//  Trace (D-LIB21-TRACE, DESIGN.md section 12): the near foot lifting, ankle.r (c2 "raise both legs ... a few inches
//   off the floor", the checkpoint 'Arms, legs up'), trim [10, 12] (hanging_leg_raise.mjs:124). The ankle moves 6.95 cm
//   (9.8 px at 140.91 px/m), less than the trim, so no Trace is drawn: below traceLenMin at its ruled size, held under
//   D-LIB21-SIZE (S2); never enlarged.
// Camera: D-LIB21-FLOOR / D-LIB8-floor: floor at y 339, the width-filling scale capped at x1.35 (140.91 px/m; inside
//  the 8's 123.9-146.3 px/m, so no F1 is raised).
// Unsourced numbers (SIZES; lb9/sizes.json holds each with its basis): MAT_T, MAT_LEN, LIFT, END_ARCH, M_NECK.
import { landmarksOf, bodyShapes, normPose, resolve, fk } from '../engine.mjs';

const H = 1.75;
export const SIZES = Object.freeze({ MAT_T: 0.01, MAT_LEN: 1.73, LIFT: 0.0762, END_ARCH: -12, M_NECK: -45 });
const { MAT_T, MAT_LEN, LIFT, END_ARCH, M_NECK } = SIZES;

// The drawn outlines in world metres: a side camera at 1 px/m, screen y down (as on the plate, so the flat palm's palm
// side is its lower side).
const CAM = { view: 'side', near: 'r', pxm: 1, P: w => [w[2], -w[1]] };
const shapesOf = pose => { const b = { height: H }, r = resolve(normPose(pose, b), b); return bodyShapes(fk(r.q, b), CAM, { hand: 'flat' }).filter(s => s.poly); };
const TORSO = /^torso$/, LEGS = /^(thigh|kneecap|shank)\./, FEET = /^foot\./, HANDS = /^palm\./, ARMS = /^(shcap|upper|elbowcap|fore|palm)\./, BODY = /./;

// Bisection on one angle for a drawn-outline residual g (monotone over [a, b]); throws without a sign change or
// without converging to 1e-7 m.
function root1(g, a, b, what) {
  let ga = g(a), gb = g(b);
  if (!(ga * gb <= 0)) throw new Error(`superman: no bracket for ${what} (${ga}, ${gb})`);
  for (let i = 0; i < 80; i++) {
    const m = (a + b) / 2, gm = g(m);
    if (Math.abs(gm) < 1e-7) return m;
    if (ga * gm <= 0) { b = m; gb = gm; } else { a = m; ga = gm; }
  }
  throw new Error(`superman: ${what} did not converge`);
}

// ---- the trunk on the mat: chest and pelvis (the drawn torso's lowest points head-side and foot-side of the navel)
// at one height, that height the mat top. Returns the root and tilt for a lumbar angle `trunk`.
const torsoLows = pose => {
  const lm = landmarksOf(pose, H), nz = lm.navel[2], t = shapesOf(pose).find(s => s.key === 'torso').poly;
  let hd = Infinity, tl = Infinity; for (const v of t) { if (v[0] > nz) hd = Math.min(hd, -v[1]); else tl = Math.min(tl, -v[1]); }
  return [hd, tl];
};
const onMat = trunk => {
  const at = tilt => ({ root: { at: [0, 0.15, 0], tilt }, trunk, neck: 0 });   // root y 0.15: a working height, re-set below
  const tilt = root1(t => { const [hd, tl] = torsoLows(at(t)); return hd - tl; }, 80, 96, `the trunk on the mat (trunk ${trunk})`);
  const [hd] = torsoLows(at(tilt));
  return { at: [0, 0.15 - hd + MAT_T, 0], tilt };
};
const R0 = onMat(0);
// The mat (c1): centred on the start's navel (c1, c2: the core on it), its top at MAT_T; the floor beyond it.
const NAVEL0 = landmarksOf({ root: R0, trunk: 0, neck: 0 }, H).navel;
export const MAT = { z0: NAVEL0[2] - MAT_LEN / 2, z1: NAVEL0[2] + MAT_LEN / 2 };
const surf = z => (z >= MAT.z0 && z <= MAT.z1 ? MAT_T : 0);
/** The least gap (m) between the drawn shapes matching re and the surface under them (mat top or floor); negative =
 *  into it. */
export function gap(pose, re) {
  let m = Infinity; for (const s of shapesOf(pose)) if (re.test(s.key)) for (const v of s.poly) m = Math.min(m, -v[1] - surf(v[0]));
  return m;
}

// Start (c1): face down, trunk and neck neutral (head in line), legs straight (knee 0) resting on the mat (hip angle
// solved), ankles plantarflexed until the toes rest on the floor (ankle solved, c1 "toes pointing away from your
// shins"); arms straight overhead (elbow 0), resting on the mat's head end with the hands on the floor beyond it
// (shoulder flexion solved: the arm's lowest drawn point on the mat edge), each flat palm touching the floor (wrist
// angle solved).
const trunkPose = (R, trunk) => ({ root: R, trunk, neck: 0, elbow: 0, knee: 0 });
const HIP0 = root1(h => gap({ ...trunkPose(R0, 0), hip: h }, LEGS), -20, 30, 'the start legs');
const ANK0 = root1(a => gap({ ...trunkPose(R0, 0), hip: HIP0, ankle: a }, FEET), -90, 0, 'the start feet');
const legs0 = { hip: HIP0, ankle: ANK0 };
const armAt = (R, trunk, sh, w) => ({ ...trunkPose(R, trunk), ...legs0, shoulder: { flex: sh }, wrist: w });
const SH0 = root1(sh => gap(armAt(R0, 0, sh, 0), ARMS), 150, 180, 'the start arms');
const W0 = 0;
export const start = armAt(R0, 0, SH0, W0);
export const LS = landmarksOf(start, H);

// End (c2, c3, c4, c5, c9): the slight arch (lumbar extension END_ARCH, c3), the trunk re-seated on the mat with the
// navel on it (c2 "keeping your core on the ground"); both legs (hip extension solved) and both arms (shoulder flexion
// solved) straight and lifted until the lowest drawn point of the feet and of the hands is LIFT above the surface
// under it (c3 "3-6 inches": 3 in); ankles, wrists and knees as at the start; head and neck neutral (neck 0, c5);
// shoulder girdle neutral, no shrug (scap 0, c9).
const R1 = onMat(END_ARCH);
const endAt = (hip, sh) => ({ ...trunkPose(R1, END_ARCH), hip, ankle: ANK0, shoulder: { flex: sh }, wrist: W0 });
const HIP1 = root1(h => gap(endAt(h, SH0), FEET) - LIFT, -40, HIP0, 'the end legs');
const SH1 = root1(sh => gap(endAt(HIP1, sh), HANDS) - LIFT, 120, 200, 'the end arms');
export const end = endAt(HIP1, SH1);
export const LE = landmarksOf(end, H);
// Mistake (c6): the head lifted to look up, the neck out of line: neck extension M_NECK; nothing else moves.
export const mistake = { ...end, neck: M_NECK };

const mid = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
/** Winter (2009) whole-body centre of mass on the drawn landmarks (bird_dog.mjs, bear_crawl.mjs @ a9c64e11). */
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
/** Balance (D-LIB21-BALANCE, c1, c2): the floor contact of the trunk and thighs, as the z span of the drawn torso and
 *  leg points within 0.5 cm of the mat top; the centre of mass's z and its margin (cm, + inside) in that span. */
export function baseOf(pose) {
  const zs = []; for (const s of shapesOf(pose)) if (/^(torso|thigh\.|kneecap\.|shank\.)/.test(s.key)) for (const v of s.poly) if (-v[1] - surf(v[0]) < 0.005) zs.push(v[0]);
  const z0 = Math.min(...zs), z1 = Math.max(...zs), c = com(landmarksOf(pose, H))[2];
  return { from: +z0.toFixed(3), to: +z1.toFixed(3), com: +c.toFixed(3), margin: +(Math.min(c - z0, z1 - c) * 100).toFixed(2) };
}
// The floor line under the whole start figure (its drawn extent).
const SPAN = (() => { let a = Infinity, b = -Infinity; for (const s of shapesOf(start)) for (const v of s.poly) { a = Math.min(a, v[0]); b = Math.max(b, v[0]); } return [a, b]; })();
const TOP = { point: [0, MAT_T, 0], normal: [0, 1, 0] };
export default {
  hand: 'flat',
  id: 'superman', name: 'Superman', view: 'side', facing: 'right',
  camera: { fit: true, maxScale: 1.35, y0: 339 },
  poses: { start, end },
  equipment: [
    { type: 'floor', from: Math.min(SPAN[0], MAT.z0), to: Math.max(SPAN[1], MAT.z1) },
    { type: 'box', at: [0, MAT_T / 2, (MAT.z0 + MAT.z1) / 2], w: MAT_LEN, h: MAT_T, rc: 0.5, part: 'mat' },
  ],
  checks: [
    { landmark: 'navel', plane: TOP, pose: 'start', tol: 0.5 },   // c1: lying face down on the mat
    { landmark: 'navel', plane: TOP, pose: 'end', tol: 0.5 },     // c2: the core stays on the ground
  ],
  ghosts: { count: 0 },
  trace: { point: 'ankle.r', trim: [10, 12] },
  callouts: [
    { key: 'neck', text: 'Neck in line', anchor: { at: 'neck', off: [3, -6] }, box: { left: 180, top: 240 }, cue: 'Head and neck neutral, eyes down.' },
    { key: 'up', text: 'Arms,<br>legs up', anchor: { at: 'wrist.r', off: [0, -5] }, box: { left: 282, top: 254 }, cue: 'Arms and legs straight, a few inches off the floor.' },
    { key: 'low', text: 'Low lift', anchor: { at: 'ankle.r', off: [0, -8] }, box: { left: 22, top: 266 }, cue: 'Lift 3-6 inches, without hyperextending the back.' },
  ],
  mistake: {
    pose: mistake,
    guides: [
      { kind: 'arrow', from: { at: 'head', pose: 'end', off: [5.2, -7.3] }, to: { at: 'head', pose: 'mistake', off: [8.4, -1.1] } },
    ],
    tells: [
      { key: 'head', text: 'Head lifted', anchor: { at: 'head', pose: 'mistake' }, box: { left: 262, top: 226 }, cue: 'The head lifts to look up.' },
      { key: 'neck', text: 'Neck not<br>neutral', anchor: { at: 'neck', pose: 'mistake', off: [0, -7] }, box: { left: 150, top: 244 }, cue: 'The head and neck move out of their neutral line.' },
    ],
  },
  tempo: [{ phase: 'Lift', s: 1, move: true }, { phase: 'Hold', s: 3 }, { phase: 'Lower', s: 2, move: true }],
  alt: 'Superman, side view. Lying face down on a mat, the straight arms and legs lift a few inches off the floor while the belly stays down and the head stays in line.',
};
export const info = { SH0, W0, HIP0, ANK0, HIP1, SH1, R0, R1, MAT, pose: Object.fromEntries([['start', start], ['end', end], ['mistake', mistake]].map(([k, p]) => {
  const lm = landmarksOf(p, H);
  return [k, { base: baseOf(p), navel: +((lm.navel[1] - MAT_T) * 100).toFixed(2), torso: +(gap(p, TORSO) * 100).toFixed(2), legs: +(gap(p, LEGS) * 100).toFixed(2),
    feet: +(gap(p, FEET) * 100).toFixed(2), hands: +(gap(p, HANDS) * 100).toFixed(2), body: +(gap(p, BODY) * 100).toFixed(2) }];
})) };
