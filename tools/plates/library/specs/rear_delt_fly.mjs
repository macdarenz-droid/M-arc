// Rear Delt Fly (pec deck set to reverse fly, seated facing the chest pad), FRONT view. H (D-LIB16R2-MODES: seated
// facing the pad and the reverse sweep; FSEAT is not built). Rig: eq/pecDeck.mjs unedited (D-LIB16R2-PECDECK).
// View: FRONT (card plate.view = census view): the arms opening out to the sides in line with the shoulders and the
// shrug read from the front (c4, c5, c17). Chest-off-the-pad needs a side view (card: posture zoom).
// Clone source (D-LIB9-CLONE): pec_fly (pilot A), copied, never imported: the seated base, the horizontal arm circle
// about each shoulder's vertical axis at a fixed 20 deg elbow, its elbow pole and `via` keys, the pecDeck call (direct
// levers, uprights) and the dashed start-lever phantom; the sweep runs reversed (start closed, end open) at shoulder
// height.
// Sources: research card docs/research/howto/cards/rear_delt_fly.json (claude/libht-research @ a48b0594), claims c1
// (seated facing the machine, chest on the pad), c2 (handles at shoulder height, arms forward), c3 (slight, fixed elbow
// bend), c4 (pull back in a wide arc), c5 (stop when the arms line up with the shoulders), c6 (chest on the pad), c7
// (sit upright), c14 and c18 (tempo), c17 (the Mistake: shrugging the shoulders).
// Geometry decisions:
//  - Seat (copied): seat top SEAT_TOP, trunk upright (TILT 0, c7); the chest pad is pecDeck's pad, placed at the
//    chest's depth (a world-coordinate contact, c1, c6); it draws at z 'back', so the front view shows no depth
//    (D-LIB16R2-PECDECK).
//  - Arms (c2-c5): grips at shoulder height on the circle about each shoulder's vertical axis, ELBOW fixed; start
//    closed (CLOSE_GAP apart in front), end END_ANGLE ahead of the side line, where the upper arm lies in the frontal
//    plane (pec_fly's OPEN_ANGLE rule): in line with the shoulders, not past them (c5). The elbow pole is level, so
//    the upper arms stay at shoulder height (elevation 90, c2, c5) and the soft bend lies in depth.
//  - Mistake (c17): the scapulae MIS_ELEV up; the hands stay on the handles. At plate scale the shrug moves the
//    shoulder 7.3 px, under deviationMin, so a Mistake zoom at k 1.5 shows it (PLAN RULED; D-LIBZOOM-EXTEND).
// Plate labels: callouts = plate.checkpoints c6 (Chest on pad), c3 (Soft elbows), c5 (Stop at shoulders); Mistake =
//   plate.mistake c17 (key `shrug`, drawable false: the top fault, rushing, shows only as speed; F7 named,
//   D-LIB16R2-F7); tempo = plate.tempo (up 1, down 3, pause 1): Pull 1, Hold 1, Return 3 (Motra's 1 s bottom pause,
//   c18, is named, not drawn).
// Unsourced numbers: SIZES below, each with its basis in lb6/sizes.json (r2).
import { landmarksOf, rootOnSeat, REF_CAMERA } from '../engine.mjs';
import { pecDeck } from '../eq/pecDeck.mjs';

export const SIZES = { SEAT_TOP: 0.45, TILT: 0, ELBOW: 20, CLOSE_GAP: 0.05, END_ANGLE: 10, TOP: 1.45, PAD_LEN: 0.7, MIS_ELEV: 5, ZOOM_K: 1.5 };
const H = 1.75;
const R = Math.PI / 180;
const { SEAT_TOP, TILT, ELBOW, CLOSE_GAP, END_ANGLE, TOP, PAD_LEN, MIS_ELEV, ZOOM_K } = SIZES;
const SEAT = [0, SEAT_TOP, 0];                         // buttock contact on the seat pad
const FEET = { l: { at: [0.19, 0, 0.50], toe: [0.17, 0, 1] }, r: { at: [-0.19, 0, 0.50], toe: [-0.17, 0, 1] } };   // pec_fly's
const SEG = 12;
const body = { root: { at: rootOnSeat(SEAT, TILT, H), tilt: TILT }, trunk: 0, neck: 0, scap: { elev: -0.5, pro: 0 }, plant: FEET };
const probe = landmarksOf({ ...body, shoulder: { abd: 80 }, elbow: 0 }, H);
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const L1 = dist(probe['shoulder.r'], probe['elbow.r']), L2 = dist(probe['elbow.r'], probe['grip.r']);
const S = probe['shoulder.r'];                         // right shoulder joint (x < 0; figure's right = viewer's left)
const HANDLE_Y = S[1];                                 // handles at shoulder height (c2)
const D = Math.sqrt(L1 * L1 + L2 * L2 + 2 * L1 * L2 * Math.cos(ELBOW * R));   // shoulder-to-grip distance at 20 deg
const DY = HANDLE_Y - S[1], RH = Math.sqrt(D * D - DY * DY);                  // horizontal radius about the pivot axis
const CLOSE_ANGLE = Math.acos((S[0] + CLOSE_GAP) / RH) / R;                   // closed: past straight-forward, hands at the midline

// right grip at horizontal angle th (0 = straight out to the side, 90 = straight forward); left mirrors x
const gripAt = th => [S[0] - RH * Math.cos(th * R), HANDLE_Y, S[2] + RH * Math.sin(th * R)];
const poleAt = th => {                                 // behind the direction of travel, and down
  const back = [-Math.sin(th * R), 0, -Math.cos(th * R)];  // right arm travels along +[sin, 0, cos]; back = the opposite
  const p = [back[0] * 0.25 - 0.55, 0, back[2] * 0.25], k = Math.hypot(...p);   // out (-x on the right), level: the upper arms stay at shoulder height (c2, c5)
  return p.map(v => v / k);
};
const armsAt = th => {
  const g = gripAt(th), pr = poleAt(th);
  return { r: { at: g, pole: pr }, l: { at: [-g[0], g[1], g[2]], pole: [-pr[0], pr[1], pr[2]] } };
};
const THS = Array.from({ length: SEG + 1 }, (_, i) => CLOSE_ANGLE + (END_ANGLE - CLOSE_ANGLE) * i / SEG);
const [start, ...rest] = THS.map(th => ({ ...body, reach: armsAt(th) }));
const end = rest.pop(), via = rest;

// The chest pad (c1, c6): pecDeck's pad at the chest's depth, in front of the chest (the trunk does not move).
const lmS = landmarksOf(start, H);
const PAD = { len: PAD_LEN, bottom: SEAT_TOP + 0.04, z: lmS.chest[2] + 0.035 };
const PIVOT = { r: [S[0], TOP, S[2]], l: [-S[0], TOP, S[2]] };
const TUBE = 0.05, GRIP = 0.14, LEVER_R = 0.025, HANDLE_R = 0.016;   // pecDeck / chestPress sizes
const UPRIGHT_X = 0.29;                                // frame legs under the housing ends, floor to top
const deckOf = lm => pecDeck({
  pivot: PIVOT, grips: { l: lm['grip.l'], r: lm['grip.r'] }, seat: [0, SEAT_TOP, 0.02],
  back: { at: [0, PAD.bottom + PAD.len / 2, PAD.z], len: PAD.len }, top: TOP, pxPerM: REF_CAMERA.pxPerM, grip: GRIP, tube: TUBE,
  direct: true, uprights: UPRIGHT_X,
});
const DECK_N = deckOf(landmarksOf(start, H)).length;
// closed outline round segment a-b in the front-view plane ([x, y] at depth z), radius r
const capsule = (a, b, r, z, n = 8) => {
  const au = Math.atan2(b[1] - a[1], b[0] - a[0]), pts = [];
  for (let i = 0; i <= n; i++) { const t = au + Math.PI / 2 - Math.PI * i / n; pts.push([b[0] + r * Math.cos(t), b[1] + r * Math.sin(t)]); }
  for (let i = 0; i <= n; i++) { const t = au - Math.PI / 2 - Math.PI * i / n; pts.push([a[0] + r * Math.cos(t), a[1] + r * Math.sin(t)]); }
  return [...pts, pts[0]].map(([x, y]) => [x, y, z]);
};
const START_PHANTOM = (() => {
  const lm = landmarksOf(start, H), out = [];
  for (const sd of ['l', 'r']) {
    const p = PIVOT[sd], g = lm[`grip.${sd}`], top = [g[0], g[1] + GRIP / 2];
    out.push(capsule([p[0], p[1]], top, LEVER_R, g[2]), capsule([g[0], g[1] - GRIP / 2], top, HANDLE_R, g[2]));
  }
  return out.map(pts => ({ type: 'line', pts, cls: 'eq-line m-line', z: 'mid' }));
})();

const mistakePose = { scap: { elev: MIS_ELEV, pro: 0 } };   // c17 the shrug; the hands stay on the handles
const LE = landmarksOf(end, H), LM = landmarksOf({ ...end, ...mistakePose }, H);
export const info = () => ({ shrugCm: +((LM['shoulderTop.r'][1] - LE['shoulderTop.r'][1]) * 100).toFixed(2), closeAngle: +CLOSE_ANGLE.toFixed(1),
  endElbowFwdCm: +((LE['elbow.r'][2] - LE['shoulder.r'][2]) * 100).toFixed(1), startGripGap: +(lmS['grip.l'][0] - lmS['grip.r'][0]).toFixed(3) });
export default {
  id: 'rear_delt_fly', name: 'Rear Delt Fly', view: 'front',
  camera: { ...REF_CAMERA },
  poses: { start, end, via },
  equipment: [
    { type: 'floor', from: -0.62, to: 0.62 },
    // one equipment entry per composer item (pec_fly's: the engine keys items by entry index + type + index)
    ...Array.from({ length: DECK_N }, (_, k) => lm => deckOf(lm)[k]),
    // the start levers (closed, in front) redrawn as dashed phantom outlines in the end layer (pec_fly's convention)
    (lm, ctx) => (ctx.pose === 'end' ? START_PHANTOM : null),
  ],
  checks: [
    { landmark: 'seat', plane: { point: SEAT, normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },          // c1 seated
    { landmark: 'chest', plane: { point: [0, 0, PAD.z - 0.035], normal: [0, 0, 1] }, pose: 'all', tol: 0.5 },   // c1, c6 chest on the pad (world)
    ...['sole.r', 'sole.l'].map(landmark => ({ landmark, plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 })),
    { landmark: 'wrist.r', at: lmS['wrist.r'], pose: 'start', tol: 0.5 },                           // c3 hands on the handles
    { landmark: 'wrist.l', at: lmS['wrist.l'], pose: 'start', tol: 0.5 },
  ],
  ghosts: { count: 3, parts: ['arm.r', 'arm.l'] },
  trace: { point: 'grip.r', trim: [12, 12] },
  callouts: [
    { key: 'chest', text: 'Chest<br>on pad', anchor: 'sternum', box: { left: 232, top: 266 }, cue: 'Keep your chest against the pad for every rep.' },
    { key: 'elbows', text: 'Soft<br>elbows', anchor: { at: 'elbow.l', pose: 'end' }, box: { left: 266, top: 210 }, cue: 'Keep a slight, fixed bend: not straight, not sharply bent.' },
    { key: 'line', text: 'Stop at<br>shoulders', anchor: { at: 'grip.r', pose: 'end' }, box: { left: 24, top: 216 }, cue: 'Open your arms until they line up with your shoulders, not past.' },
  ],
  tempo: [{ phase: 'Pull', s: 1, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Return', s: 3, move: true }],
  mistake: {
    pose: mistakePose,
    guides: [
      { kind: 'arrow', from: { at: 'shoulderTop.r', pose: 'end', off: [-6, 0] }, to: { at: 'shoulderTop.r', pose: 'mistake', off: [-6, 0] } },   // the shoulders rise
      { kind: 'arrow', from: { at: 'shoulderTop.l', pose: 'end', off: [6, 0] }, to: { at: 'shoulderTop.l', pose: 'mistake', off: [6, 0] } },
    ],
    tells: [{ key: 'shrug', text: 'Shoulders<br>shrug', anchor: { at: 'shoulderTop.r', pose: 'mistake' }, box: { left: 30, top: 222 }, cue: 'Your shoulders shrug up toward your ears as the arms open.' }],
  },
  zoom: { view: 'mistake', k: ZOOM_K },
  alt: 'Rear delt fly on a pec deck set to reverse fly, front view. Seated upright with the chest on the pad, the lifter pulls the handles from in front at shoulder height out to the sides in a wide arc until the arms line up with the shoulders, elbows slightly bent.',
};
