// Machine Lateral Raise (seated, arm pads on levers pivoting at the shoulders), FRONT view. H (D-LIB16R2-MODES: a new rig
// and shoulder abduction from the sides; FSEAT is not built). Anchor of eq/latRaiseMachine.mjs (D-LIB16R2-COMPOSERS).
// View: FRONT (card plate.view = census view): the arms rising out to the sides until level with the shoulders is
// frontal-plane motion that only the front view shows (c4, c5).
// Clone sources (D-LIB9-CLONE), copied, never imported: pec_fly (pilot A): the seated base (`rootOnSeat`, seat, pelvis
// tilt, the back pad plane through the upper back and the buttock, the feet flat); cable_lateral_raise (LB7 on main):
// the front-view abduction by angle (shoulder elevation in plane 0) and its 20° over-raise Mistake convention.
// Sources: research card docs/research/howto/cards/machine_lateral_raise.json (claude/libht-research @ a48b0594),
// claims c1 (shoulders lined up with the pivots), c2 (back against the pad, feet flat), c3 (pads just above the elbows,
// hands on the handles), c4 (raise the arms out leading with the elbows), c5 (until the upper arms are horizontal,
// not above shoulder level), c6 (shoulders down), c13 (tempo), c16 (Motra's tempo).
// Geometry decisions:
//  - Seat, back and feet (copied from pec_fly): seat top SEAT_TOP, tilt TILT, feet flat 38 cm apart.
//  - Arms: shoulder elevation START_ELEV (at the sides) → 90 (upper arms horizontal, c5) in the frontal plane, elbows
//    ELBOW bent (c2 "elbows slightly bent"); `via` keys every 1/SEG.
//  - Rig (c1, c3): each pivot at its shoulder joint; each pad on the outer side of the upper arm (its face on the drawn
//    arm outline, read from the engine's front-view shapes in that pose) just above the elbow; the handle at the hand.
//  - Mistake (c5): the arms raised MIS_OVER past level (cable_lateral_raise's M_OVER).
// Plate labels: callouts = plate.checkpoints c1 (Shoulders at pivot), c4 (Lead with elbows), c5 (Elbows shoulder-high);
//   Mistake = plate.mistake c5 (key `high`, drawable false: the top fault, swinging the body, shows only as motion; F7
//   named, D-LIB16R2-F7); tempo = plate.tempo (up 2, down 3, pause 1): Raise 2, Hold 1, Lower 3 (Motra's 1 s bottom
//   pause, c16, is named, not drawn).
// Unsourced numbers: SIZES below and the composer's LAT_RAISE, each with its basis in lb6/sizes.json (r2).
import { landmarksOf, rootOnSeat, REF_CAMERA, fk, resolve, normPose, bodyShapes } from '../engine.mjs';
import { perItem } from '../eq/parts.mjs';
import { latRaiseMachine, LAT_RAISE_ITEMS, LAT_RAISE } from '../eq/latRaiseMachine.mjs';

export const SIZES = { SEAT_TOP: 0.45, TILT: -3, START_ELEV: 12, END_ELEV: 90, MIS_OVER: 20, ELBOW: 20, TOP: 1.45 };
const H = 1.75, BODY = { height: H };
const { SEAT_TOP, TILT, START_ELEV, END_ELEV, MIS_OVER, ELBOW, TOP } = SIZES;
const SEG = 6;
const SEAT = [0, SEAT_TOP, 0];
const FEET = { l: { at: [0.19, 0, 0.50], toe: [0.17, 0, 1] }, r: { at: [-0.19, 0, 0.50], toe: [-0.17, 0, 1] } };   // pec_fly's
const body = { root: { at: rootOnSeat(SEAT, TILT, H), tilt: TILT }, trunk: 0, neck: 0, scap: { elev: -0.5, pro: 0 }, plant: FEET };
const arm = elev => ({ shoulder: { elev, plane: 0, rot: 0 }, elbow: ELBOW });
const at = elev => ({ ...body, ...arm(elev) });
const KEYS = Array.from({ length: SEG + 1 }, (_, i) => at(START_ELEV + (END_ELEV - START_ELEV) * i / SEG));
const [start, ...rest] = KEYS;
const end = rest.pop(), via = rest;
const mistakePose = arm(END_ELEV + MIS_OVER);

// Back pad plane: through the upper back and the buttock (pec_fly's).
const lmS = landmarksOf(start, H);
const padU = [0, lmS.backUpper[1], lmS.backUpper[2]], padL = [0, lmS.buttock[1], lmS.buttock[2]];
const padN = (() => { const d = [0, padU[1] - padL[1], padU[2] - padL[2]], n = [0, -d[2], d[1]], k = Math.hypot(...n); return n.map(v => v / k); })();
const PAD = { len: 0.70, bottom: SEAT_TOP + 0.04 };
const CAM = { view: 'front', near: null, pxm: 1, P: w => [w[0], -w[1]] };   // world metres, y up as -y

/** One arm's rig geometry in a drawn pose: pivot, the upper arm's front-view axis and outward normal, the pad face. */
export function armOf(pose, s) {
  const lm = landmarksOf(pose, H), S = lm[`shoulder.${s}`], E = lm[`elbow.${s}`], sg = s === 'l' ? 1 : -1;
  const d = [E[0] - S[0], E[1] - S[1]], len = Math.hypot(...d), u = [d[0] / len, d[1] / len];
  const N = [-sg * u[1], sg * u[0]];   // away from the body: the arm's lateral side (out when hanging, up when level)
  const upper = bodyShapes(fk(resolve(normPose(pose, BODY), BODY).q, BODY), CAM).find(x => x.key === `upper.${s}`);
  if (!upper) throw new Error('machine_lateral_raise: no drawn upper arm');
  const along = p => (p[0] - S[0]) * u[0] + (-p[1] - S[1]) * u[1], off = p => (p[0] - S[0]) * N[0] + (-p[1] - S[1]) * N[1];
  const band = upper.poly.filter(p => along(p) >= LAT_RAISE.PAD_FROM * len && along(p) <= LAT_RAISE.PAD_TO * len);
  if (!band.length) throw new Error('machine_lateral_raise: no upper arm outline at the pad');
  return { pivot: S, u, n: N, len, face: Math.max(...band.map(off)), grip: lm[`grip.${s}`], z: S[2] + 0.06 };
}
// The arm moves only by elevation, so a drawn pose (key, ghost or Mistake) is rebuilt from its elbow's elevation.
const elevOf = (lm, s) => { const S = lm[`shoulder.${s}`], E = lm[`elbow.${s}`]; return Math.atan2(Math.abs(E[0] - S[0]), S[1] - E[1]) * 180 / Math.PI; };
const rig = lm => latRaiseMachine({ seat: [0, SEAT_TOP, 0.02], back: { at: [0, PAD.bottom + PAD.len / 2, padU[2] - 0.035], len: PAD.len }, top: TOP,
  arms: { l: armOf(at(elevOf(lm, 'l')), 'l'), r: armOf(at(elevOf(lm, 'r')), 'r') }, pxPerM: REF_CAMERA.pxPerM });
export const info = () => { const e = landmarksOf(end, H), m = landmarksOf({ ...end, ...mistakePose }, H);
  return { endElbowAboveShoulderCm: +((e['elbow.r'][1] - e['shoulder.r'][1]) * 100).toFixed(2), misElbowAboveShoulderCm: +((m['elbow.r'][1] - m['shoulder.r'][1]) * 100).toFixed(2),
    elevEnd: +elevOf(e, 'r').toFixed(1), elevMis: +elevOf(m, 'r').toFixed(1) }; };
const LE = landmarksOf(end, H);

export default {
  id: 'machine_lateral_raise', name: 'Machine Lateral Raise', view: 'front',
  camera: { ...REF_CAMERA },
  poses: { start, end, via },
  equipment: [
    { type: 'floor', from: -0.62, to: 0.62 },
    ...perItem(lm => rig(lm), LAT_RAISE_ITEMS),
  ],
  checks: [
    { landmark: 'seat', plane: { point: SEAT, normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },          // c2 seated
    { landmark: 'backUpper', plane: { point: padU, normal: padN }, pose: 'all', tol: 1 },            // c2 back on the pad
    { landmark: 'buttock', plane: { point: padL, normal: padN }, pose: 'all', tol: 1 },
    ...['heel.r', 'ball.r', 'heel.l', 'ball.l'].map(landmark => ({ landmark, plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 })),   // c2 feet flat
    ...['l', 'r'].flatMap(s => [{ landmark: `elbow.${s}`, at: lmS[`elbow.${s}`], pose: 'start', tol: 0.5 },   // c3 the pads just above the elbows
      { landmark: `wrist.${s}`, at: lmS[`wrist.${s}`], pose: 'start', tol: 0.5 }]),                          // c3 hands on the handles
  ],
  ghosts: { count: 2, parts: ['arm.r', 'arm.l', 'arm'] },
  trace: { point: 'elbow.r', trim: [6, 6] },
  callouts: [
    { key: 'pivot', text: 'Shoulders<br>at pivot', anchor: { at: 'shoulder.l', pose: 'start' }, box: { left: 262, top: 140 }, cue: 'Set the seat so your shoulders line up with the pivots.' },
    { key: 'lead', text: 'Lead with<br>elbows', anchor: { at: 'elbow.r', pose: 'end' }, box: { left: 24, top: 120 }, cue: 'Press out through the elbows into the pads.' },
    { key: 'level', text: 'Elbows<br>shoulder-high', anchor: { at: 'elbow.l', pose: 'end' }, box: { left: 232, top: 90 }, cue: 'Stop when your upper arms are horizontal.' },
  ],
  tempo: [{ phase: 'Raise', s: 2, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Lower', s: 3, move: true }],
  mistake: {
    pose: mistakePose,
    guides: [
      { kind: 'dashed', pts: [[LE['shoulder.r'][0] - 0.45, LE['shoulder.r'][1], 0], [LE['shoulder.l'][0] + 0.45, LE['shoulder.l'][1], 0]] },   // the shoulder line
      { kind: 'arrow', from: { at: 'elbow.r', pose: 'end' }, to: { at: 'elbow.r', pose: 'mistake' } },
      { kind: 'arrow', from: { at: 'elbow.l', pose: 'end' }, to: { at: 'elbow.l', pose: 'mistake' } },
    ],
    tells: [{ key: 'high', text: 'Above<br>shoulders', anchor: { at: 'elbow.r', pose: 'mistake' }, cue: 'Your arms rise above shoulder level, elbows higher than your shoulders.' }],
  },
  alt: 'Machine lateral raise, front view. Seated with the back on the pad and the arm pads just above the elbows, the lifter raises the arms out to the sides, leading with the elbows, until the upper arms are horizontal, level with the shoulders.',
};
