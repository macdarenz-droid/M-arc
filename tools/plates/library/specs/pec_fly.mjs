// Pec deck fly (handle version: seated fly machine, vertical handles, slightly bent elbows), FRONT view.
// View: FRONT (card plate.view, census view). The arms sweep in a horizontal arc about the shoulders, so the thing a
// coach checks (open to the sides in line with the chest, closed with the handles meeting in front of the chest, arms
// at chest-to-shoulder height, a fixed slight elbow bend) reads only from the front. The upper-back-off-the-pad fault
// needs a side view (card: posture zoom).
// Form sources: research card pec_fly (claims c1-c5, c9: ACE pec deck / chest fly; card variantLine: the handle
//  machine is drawn, the elbow-pad pec deck (c4) is the other version). Every number is a named constant.
// Geometry decisions:
//  - Seat pad top 45 cm; pelvis tilt -3 (pad reclined ~3 deg), back pressed on the pad (c1): the pad plane runs through
//    the upper back and the buttock (checks 0 cm). Feet flat, 40 cm apart (shoulder width or wider, c1), knees ~90.
//  - Handles at chest level (c2): grip centres at the chest landmark height (nipple line), 9.7 cm under the shoulder
//    joint, so the arms work between chest and shoulder height.
//  - Elbow bend fixed at 20 deg flexion (c3: "slightly bent", much straighter than the pad version's 75-90). The grip
//    stays at one distance from the shoulder joint, so the IK keeps the same 20 deg in every key pose.
//  - Arm path: each hand travels on a horizontal circle about the vertical axis through its shoulder joint, which is
//    the machine's pivot axis (pivot boss straight above the shoulder), radius 65 cm. Open: hands 10 deg ahead of the
//    side line, so the upper arm lies in the frontal plane (c9: not behind the torso line; solved shoulder plane -0.2).
//    Closed: grip centres 10 cm apart, handles "just about to meet" 50 cm in front of the chest (c5): 106 deg from the
//    side line (each arm 16 deg past straight ahead), a 96 deg sweep.
//  - Elbow pole: behind the hand's direction of travel and 35% down, so the elbows stay soft and point back/out.
//  - `via` keys every 1/12 of the sweep keep the hands (and the ghosts at t = .25/.5/.75) on the circle.
//  - Machine: library `pecDeck` composer (front view): centre column, top housing 1.45 m, level arms from the pivots,
//    drop levers to 14 cm vertical handles, seat and 30 x 70 cm back pad. Items split one per equipment entry (see
//    there); the open levers redrawn as a dashed phantom. Ghosts: the arms only.
// Go/no-go (front-view pivot arms), decided by the arms-machines builder: NO-GO at approved quality. The closed (solid)
//  pose points the arms at the camera; the engine draws them as flat foreshortened stubs over the torso (body.mjs
//  'ahead' rule, no depth cue), and the top-hung drop levers cover the whole head at the closed position (true to the
//  machine, whose pivots sit above the shoulders). The side view cannot show the checkpoints either (the elbow bend and
//  the hands meeting are in the horizontal plane). The Mistake (hands stopped at the shoulders, gap line) reads well.
//  Angles and contacts are true; the report is clean.
// Callouts, Mistake, tempo: card plate.checkpoints (c3, c2, c5), plate.mistake (c6), plate.tempo (c12: close 2 s,
//  brief hold 1 s, open 2 s; no Rest phase, the card gives none). No measure: the card gives no angle, and in this view
//  the soft elbow of the closed arm is foreshortened, so an arc would draw a false number.
// CARD: SEAT_TOP / HANDLE_Y (c2), ELBOW (c3), CLOSE_GAP (c5), OPEN_ANGLE (c9), TILT (c1), FEET (c1), pivot height,
//  Mistake stop angle (MIS_ANGLE, c6 gives none).
import { landmarksOf, rootOnSeat, REF_CAMERA } from '../engine.mjs';
import { pecDeck } from '../eq/pecDeck.mjs';

const H = 1.75;
const R = Math.PI / 180;
const SEAT_TOP = 0.45;
const SEAT = [0, SEAT_TOP, 0];                         // buttock contact on the seat pad
const TILT = -3;                                       // pad reclined ~3 deg; pelvis and thorax lie on it
const FEET = { l: { at: [0.19, 0, 0.50], toe: [0.17, 0, 1] }, r: { at: [-0.19, 0, 0.50], toe: [-0.17, 0, 1] } };   // feet flat, 38 cm apart, toes out ~10 deg
const ELBOW = 20;                                      // fixed soft elbow (c3)
const OPEN_ANGLE = 10;                                 // open: hands 10 deg ahead of the side line so the upper arm sits in the
                                                       //  frontal plane (shoulder plane ~0), not behind the torso (c9)
const CLOSE_GAP = 0.05;                                // closed: grip centres +-5 cm (handles about to meet, c5)
const TOP = 1.45;                                      // pivot / housing height
const SEG = 12;

const body = { root: { at: rootOnSeat(SEAT, TILT, H), tilt: TILT }, trunk: 0, neck: 0, scap: { elev: -0.5, pro: 0 }, plant: FEET };
const probe = landmarksOf({ ...body, shoulder: { abd: 80 }, elbow: 0 }, H);
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const L1 = dist(probe['shoulder.r'], probe['elbow.r']), L2 = dist(probe['elbow.r'], probe['grip.r']);
const S = probe['shoulder.r'];                         // right shoulder joint (x < 0; figure's right = viewer's left)
const HANDLE_Y = probe.chest[1];                       // handles at chest level (c2)
const D = Math.sqrt(L1 * L1 + L2 * L2 + 2 * L1 * L2 * Math.cos(ELBOW * R));   // shoulder-to-grip distance at 20 deg
const DY = HANDLE_Y - S[1], RH = Math.sqrt(D * D - DY * DY);                  // horizontal radius about the pivot axis
const CLOSE_ANGLE = Math.acos((S[0] + CLOSE_GAP) / RH) / R;                   // closed: past straight-forward, hands at the midline

// right grip at horizontal angle th (0 = straight out to the side, 90 = straight forward); left mirrors x
const gripAt = th => [S[0] - RH * Math.cos(th * R), HANDLE_Y, S[2] + RH * Math.sin(th * R)];
const poleAt = th => {                                 // behind the direction of travel, and down
  const back = [-Math.sin(th * R), 0, -Math.cos(th * R)];  // right arm travels along +[sin, 0, cos]; back = the opposite
  const p = [back[0] * 0.8, -0.35, back[2] * 0.8], k = Math.hypot(...p);
  return p.map(v => v / k);
};
const armsAt = th => {
  const g = gripAt(th), pr = poleAt(th);
  return { r: { at: g, pole: pr }, l: { at: [-g[0], g[1], g[2]], pole: [-pr[0], pr[1], pr[2]] } };
};
const THS = Array.from({ length: SEG + 1 }, (_, i) => OPEN_ANGLE + (CLOSE_ANGLE - OPEN_ANGLE) * i / SEG);
const [start, ...rest] = THS.map(th => ({ ...body, reach: armsAt(th) }));
const end = rest.pop(), via = rest;

// Back pad plane: through the upper back and the buttock (pose-independent: the trunk does not move).
const lmS = landmarksOf(start, H);
const padU = [0, lmS.backUpper[1], lmS.backUpper[2]], padL = [0, lmS.buttock[1], lmS.buttock[2]];
const padN = (() => { const d = [0, padU[1] - padL[1], padU[2] - padL[2]], n = [0, -d[2], d[1]], k = Math.hypot(...n); return n.map(v => v / k); })();
const PAD = { len: 0.70, bottom: SEAT_TOP + 0.04 };
const PIVOT = { r: [S[0], TOP, S[2]], l: [-S[0], TOP, S[2]] };
const TUBE = 0.05, GRIP = 0.14, LEVER_R = 0.025, HANDLE_R = 0.016;   // pecDeck / chestPress sizes
const deckOf = lm => pecDeck({
  pivot: PIVOT, grips: { l: lm['grip.l'], r: lm['grip.r'] }, seat: [0, SEAT_TOP, 0.02],
  back: { at: [0, PAD.bottom + PAD.len / 2, padU[2] - 0.035], len: PAD.len }, top: TOP, pxPerM: REF_CAMERA.pxPerM, grip: GRIP, tube: TUBE,
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
    out.push(capsule([p[0], p[1]], [g[0], p[1]], TUBE / 2, g[2]), capsule([g[0], p[1]], top, LEVER_R, g[2]), capsule([g[0], g[1] - GRIP / 2], top, HANDLE_R, g[2]));
  }
  return out.map(pts => ({ type: 'line', pts, cls: 'eq-line m-line', z: 'mid' }));
})();

// Mistake (card plate.mistake, c6): "stopping short: the handles finish well apart in front of the chest (partial
// range)". The card gives no gap, so MIS_ANGLE stops the sweep with the hands about in front of the shoulders
// (grip centres ~50 cm apart), a gap that reads at 390 px. Guide: a dimension line under the faulty hands.
const MIS_ANGLE = 85;
const mistakePose = { reach: armsAt(MIS_ANGLE) };
const GAP_Y = HANDLE_Y - GRIP / 2 - 0.05, gM = gripAt(MIS_ANGLE);
const GAP = [[gM[0], GAP_Y, gM[2]], [-gM[0], GAP_Y, gM[2]]];
const tick = p => ({ kind: 'line', pts: [[p[0], p[1] + 0.025, p[2]], [p[0], p[1] - 0.025, p[2]]] });

export default {
  id: 'pec_fly', name: 'Pec Deck Fly', view: 'front',
  camera: { ...REF_CAMERA },
  poses: { start, end, via },
  equipment: [
    { type: 'floor', from: -0.62, to: 0.62 },
    // One equipment entry per composer item: the engine keys items by entry index + type + index within the primitive,
    // so the composer's five backPad bars and two chestPress levers in ONE entry share keys and the start layer picks
    // an arbitrary one of them (one side's start lever drawn, the other not). Split, every key is unique.
    ...Array.from({ length: DECK_N }, (_, k) => lm => deckOf(lm)[k]),
    // Start machine arms: the start layer drops moving equipment, so the open levers are redrawn as dashed phantom
    // outlines (the chest press's convention) in the end layer, behind the arms.
    (lm, ctx) => (ctx.pose === 'end' ? START_PHANTOM : null),
  ],
  checks: [
    { landmark: 'seat', plane: { point: SEAT, normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },          // pelvis ON the seat
    { landmark: 'backUpper', plane: { point: padU, normal: padN }, pose: 'all', tol: 1 },            // back ON the pad (c1)
    { landmark: 'buttock', plane: { point: padL, normal: padN }, pose: 'all', tol: 1 },
    { landmark: 'sole.r', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },  // feet flat ON the floor
    { landmark: 'sole.l', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
  ],
  ghosts: { count: 3, parts: ['arm.r', 'arm.l'] },       // limbs only: machine-arm ghosts stacked 6 extra levers over the plate
  trace: { point: 'grip.r', trim: [12, 12] },
  callouts: [
    { key: 'elbows', text: 'Soft<br>elbows', anchor: { at: 'elbow.r', pose: 'start' }, cue: 'Keep a slight, fixed bend in the elbows.' },
    { key: 'height', text: 'Chest<br>height', anchor: { at: 'grip.l', pose: 'start' }, box: { left: 256, top: 216 }, cue: 'Set the seat so the arms move at chest-to-shoulder height.' },
    { key: 'meet', text: 'Hands<br>meet', anchor: 'grips', box: { left: 92, top: 238 }, cue: 'Bring the handles together in front of the chest each rep.' },
  ],
  tempo: [{ phase: 'Close', s: 2, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Open', s: 2, move: true }],
  mistake: {
    pose: mistakePose,
    guides: [{ kind: 'line', pts: GAP }, tick(GAP[0]), tick(GAP[1])],
    tells: [
      { key: 'short', text: 'Stops<br>short', anchor: { at: 'grip.r', pose: 'mistake' }, cue: 'The arms stop partway instead of closing the full range.' },
      { key: 'apart', text: 'Handles<br>apart', anchor: { along: GAP, t: 0.5 }, cue: 'The handles finish well apart in front of the chest.' },
    ],
  },
  pilot: { note: 'pec_fly front view: NO-GO at approved quality (closed levers hide the head, closed arms read as stubs); the Mistake reads' },
  alt: 'Pec deck fly, front view. Seated with the back on the pad and feet flat, the lifter holds vertical handles with slightly bent elbows at chest height and sweeps the arms from out to the sides until the handles nearly meet in front of the chest.',
};
