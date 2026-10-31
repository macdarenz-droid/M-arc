// Hip Abduction (seated machine, pads on the outer thighs), FRONT view. H (D-LIB16R2-MODES: the legs move and the rig
// is new; FSEAT is not built). Anchor of eq/hipAbdAddMachine.mjs (D-LIB16R2-COMPOSERS).
// View: FRONT (card plate.view = census view): the knees moving apart and back together is side-to-side motion that
// only the front view shows (c3, c4).
// Clone source (D-LIB9-CLONE): pec_fly (pilot A), copied, never imported: the seated base (`rootOnSeat`, the seat, the
// pelvis tilt, the back pad plane through the upper back and the buttock). New: the hips set by angle (flexion and the
// engine's `abd`, body.mjs:82, :112), the knees bent, the hands on the side handles.
// Sources: research card docs/research/howto/cards/hip_abduction.json (claude/libht-research @ a48b0594), claims c1
// (back on the pad, feet on the footrests, pads snug against the outer thighs, knees at the pivot), c2 (hold the
// handles), c3 (push the legs out against the pads), c4 (from knees together to a full, comfortable range), c5 (upper
// body still, back flat), c10 (tempo), c12 (the Mistake: an incomplete range).
// Geometry decisions:
//  - Seat and back (copied): seat top SEAT_TOP, pelvis tilt TILT, the back on the pad plane (checks 1 cm).
//  - Legs: hips HIP_FLEX flexed, knees KNEE bent, ankles neutral; start abduction START_ABD (the two legs' drawn
//    outlines meet: knees together, c4), end
//    END_ABD (c3, c4); `via` keys every 1/SEG of the arc, so the knees move on their circles.
//  - Pads (c1): each pad's face on the outer edge of the drawn thigh at the knee (read from the engine's front-view
//    outline of the thigh and kneecap in that pose); the leg arm down to a footrest under the sole.
//  - Mistake (c12): the legs open only to MIS_ABD and come back.
// Plate labels: callouts = plate.checkpoints c1 (Knees at pivot), c4 (Full range), c5 (Upper body still); Mistake =
//   plate.mistake c12 (key `short`, drawable false: the top fault, jerking the weight, shows only as speed; F7 named,
//   D-LIB16R2-F7); tempo = plate.tempo (up 2, down 2, pause 1): Push out 2, Hold 1, Return 2 (Motra's 1 s bottom
//   pause, c10, is named, not drawn).
// Unsourced numbers: SIZES below and the composer's HIP_ABD_ADD, each with its basis in lb6/sizes.json (r2).
import { landmarksOf, rootOnSeat, REF_CAMERA, fk, resolve, normPose, bodyShapes } from '../engine.mjs';
import { perItem } from '../eq/parts.mjs';
import { hipAbdAddMachine, HIP_ABD_ADD_ITEMS } from '../eq/hipAbdAddMachine.mjs';

export const SIZES = { SEAT_TOP: 0.45, TILT: -3, HIP_FLEX: 90, KNEE: 90, START_ABD: -4, END_ABD: 30, MIS_ABD: 10, HANDLE_X: 0.3, HANDLE_Y: 0.5, HANDLE_Z: 0.05 };
const H = 1.75, BODY = { height: H };
const { SEAT_TOP, TILT, HIP_FLEX, KNEE, START_ABD, END_ABD, MIS_ABD, HANDLE_X, HANDLE_Y, HANDLE_Z } = SIZES;
const SEG = 6;
const SEAT = [0, SEAT_TOP, 0];
const HANDLES = { l: [HANDLE_X, HANDLE_Y, HANDLE_Z], r: [-HANDLE_X, HANDLE_Y, HANDLE_Z] };
const legs = abd => ({ hip: { flex: HIP_FLEX, abd }, knee: KNEE, ankle: 0 });
const body = { root: { at: rootOnSeat(SEAT, TILT, H), tilt: TILT }, trunk: 0, neck: 0, scap: { elev: -0.5, pro: 0 },
  reach: { l: { at: HANDLES.l, pole: [1, 0, -0.3] }, r: { at: HANDLES.r, pole: [-1, 0, -0.3] } } };
const at = abd => ({ ...body, ...legs(abd) });
const KEYS = Array.from({ length: SEG + 1 }, (_, i) => at(START_ABD + (END_ABD - START_ABD) * i / SEG));
const [start, ...rest] = KEYS;
const end = rest.pop(), via = rest;
const mistakePose = { hip: { flex: HIP_FLEX, abd: MIS_ABD } };

// Back pad plane: through the upper back and the buttock (pec_fly's; the trunk does not move).
const lmS = landmarksOf(start, H);
const padU = [0, lmS.backUpper[1], lmS.backUpper[2]], padL = [0, lmS.buttock[1], lmS.buttock[2]];
const padN = (() => { const d = [0, padU[1] - padL[1], padU[2] - padL[2]], n = [0, -d[2], d[1]], k = Math.hypot(...n); return n.map(v => v / k); })();
const PAD = { len: 0.70, bottom: SEAT_TOP + 0.04 };

// Each pad's face: the outer edge of the drawn thigh and kneecap (front view) within the pad's height band at the knee.
const CAM = { view: 'front', near: null, pxm: 1, P: w => [w[0], -w[1]] };
export const padFace = (pose, s) => {
  const lm = landmarksOf(pose, H), k = lm[`knee.${s}`], sg = s === 'l' ? 1 : -1;
  const shapes = bodyShapes(fk(resolve(normPose(pose, BODY), BODY).q, BODY), CAM).filter(x => x.poly && (x.key === `thigh.${s}` || x.key === `kneecap.${s}`));
  const xs = shapes.flatMap(x => x.poly).filter(p => Math.abs(-p[1] - k[1]) <= 0.10).map(p => sg * p[0]);
  if (!xs.length) throw new Error('hip_abduction: no thigh outline at the knee');
  return { face: sg * Math.max(...xs), y: k[1], z: k[2] + 0.02, foot: lm[`sole.${s}`] };
};
const legsOf = pose => ({ l: padFace(pose, 'l'), r: padFace(pose, 'r') });
const POSES = { start, end, mistake: { ...end, ...mistakePose } };
const LEGS = Object.fromEntries(Object.entries(POSES).map(([k, p]) => [k, legsOf(p)]));
const rig = legs => hipAbdAddMachine({ side: 'outer', seat: [0, SEAT_TOP, 0.02], back: { at: [0, PAD.bottom + PAD.len / 2, padU[2] - 0.035], len: PAD.len },
  legs, handles: HANDLES, beam: [-0.4, 0.4], pxPerM: REF_CAMERA.pxPerM });
export const info = () => { const s = landmarksOf(start, H), e = landmarksOf(end, H), m = landmarksOf(POSES.mistake, H);
  return { kneeGapStart: +(s['knee.l'][0] - s['knee.r'][0]).toFixed(3), kneeXEnd: +e['knee.r'][0].toFixed(3), kneeXMis: +m['knee.r'][0].toFixed(3), faces: LEGS.start.r.face }; };

export default {
  id: 'hip_abduction', name: 'Hip Abduction', view: 'front',
  camera: { ...REF_CAMERA },
  poses: { start, end, via },
  equipment: [
    { type: 'floor', from: -0.62, to: 0.62 },
    ...perItem(lm => rig({ l: legsAtKnee(lm, 'l'), r: legsAtKnee(lm, 'r') }), HIP_ABD_ADD_ITEMS),
  ],
  checks: [
    { landmark: 'seat', plane: { point: SEAT, normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },          // c1 seated
    { landmark: 'backUpper', plane: { point: padU, normal: padN }, pose: 'all', tol: 1 },            // c1, c5 back on the pad
    { landmark: 'buttock', plane: { point: padL, normal: padN }, pose: 'all', tol: 1 },
    { landmark: 'wrist.r', at: lmS['wrist.r'], pose: 'start', tol: 0.5 },                           // c2 hands on the handles
    { landmark: 'wrist.l', at: lmS['wrist.l'], pose: 'start', tol: 0.5 },
    ...['start', 'end'].flatMap(pose => ['l', 'r'].flatMap(s => {                                   // c1, c3 the thigh against its pad, at both ends
      const lm = landmarksOf(POSES[pose], H), d = lm[`knee.${s}`].map((v, i) => v - lm[`hip.${s}`][i]), n = [d[2], 0, -d[0]], k = Math.hypot(...n);
      return [`hip.${s}`, `knee.${s}`].map(landmark => ({ landmark, plane: { point: lm[`knee.${s}`], normal: n.map(v => v / k) }, pose, tol: 0.5 }));
    })),
    ...['l', 'r'].map(s => ({ landmark: `sole.${s}`, at: lmS[`sole.${s}`], pose: 'start', tol: 0.5 })),   // c1 feet on the footrests
  ],
  ghosts: { count: 2, parts: ['leg.r', 'leg.l', 'leg'] },
  trace: { point: 'knee.r', trim: [3, 3] },
  callouts: [
    { key: 'pivot', text: 'Knees at<br>pivot', anchor: { at: 'knee.l', pose: 'start' }, box: { left: 262, top: 236 }, cue: 'Set the seat so your knees line up with the machine\'s pivot.' },
    { key: 'range', text: 'Full<br>range', anchor: { at: 'knee.r', pose: 'end' }, box: { left: 40, top: 236 }, cue: 'Move from knees together to comfortably wide.' },
    { key: 'still', text: 'Upper body<br>still', anchor: 'sternum', box: { left: 236, top: 150 }, cue: 'Keep your back flat on the pad, with no rocking.' },
  ],
  tempo: [{ phase: 'Push out', s: 2, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Return', s: 2, move: true }],
  mistake: {
    pose: mistakePose,
    guides: [
      { kind: 'arrow', from: { at: 'knee.r', pose: 'mistake', off: [0, 14] }, to: { at: 'knee.r', pose: 'end', off: [0, 14] } },   // the range left unused
      { kind: 'arrow', from: { at: 'knee.l', pose: 'mistake', off: [0, 14] }, to: { at: 'knee.l', pose: 'end', off: [0, 14] } },
    ],
    tells: [{ key: 'short', text: 'Short<br>range', anchor: { at: 'knee.r', pose: 'mistake' }, box: { left: 40, top: 236 }, cue: 'Your knees open only a little before the legs come back.' }],
  },
  alt: 'Hip abduction machine, front view. Seated with the back on the pad, hands on the side handles and the pads against the outer thighs, the lifter pushes the knees apart from together to comfortably wide, then brings them back slowly.',
};
// The pad geometry for a drawn pose (key, ghost or Mistake), found by its knee: the legs move only by `abd`, so the
// abduction that puts the knee at the drawn knee's x is solved (bisect; throws with no root) and its pad face read.
function legsAtKnee(lm, s) {
  const kx = lm[`knee.${s}`][0], sg = s === 'l' ? 1 : -1, f = a => sg * (landmarksOf(at(a), H)[`knee.${s}`][0] - kx);
  let lo = -10, hi = 60;
  if (!(f(lo) <= 0 && f(hi) >= 0)) throw new Error('hip_abduction: no abduction for the drawn knee');
  for (let i = 0; i < 50; i++) { const m = (lo + hi) / 2; if (f(m) > 0) hi = m; else lo = m; }
  return padFace(at((lo + hi) / 2), s);
}
