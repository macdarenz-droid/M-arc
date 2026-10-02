// ENGINE SPIKE (do not merge): side plank, FRONT view, with E-R5 root.roll (+ trunk.lat for the sag Mistake).
// Right forearm on the floor, elbow straight under the shoulder (reach IK as plank.mjs), feet stacked (legs parallel in
// the frontal plane: the left leg lies on the right), body one straight line; top arm along the body.
import { landmarksOf } from '../../engine.mjs';
import { newton } from './solve.mjs';
const H = 1.75, ELBOW_Y = 0.04, GRIP_Y = 0.035, ANKLE_Y = 0.045, UA = 0.186 * H, FA = (0.146 + 0.108 * 0.46) * H;
const body = q => ({ root: { at: [q.x ?? 0, q.y, 0], tilt: 0, roll: q.roll }, trunk: { flex: 0, yaw: 0, lat: q.lat ?? 0 }, neck: 0,
  hip: { l: { abd: q.abd ?? 0 }, r: { abd: -(q.abd ?? 0) } }, knee: 0, ankle: 0, shoulder: { l: { abd: 8 }, r: { abd: 0 } } });
const SH_Y = ELBOW_Y + UA;
const HQ = newton({ y: 0.6, roll: 70 }, q => { const lm = landmarksOf(body(q), H); return [lm['shoulder.r'][1] - SH_Y, lm['ankle.r'][1] - ANKLE_Y]; });
const lm0 = landmarksOf(body(HQ), H);
const X = -(lm0['shoulder.r'][0] + lm0['ankle.r'][0]) / 2;
const hold = { ...HQ, x: X };
const lmH = landmarksOf(body(hold), H);
const arm = lm => ({ r: { at: [lm['shoulder.r'][0], GRIP_Y, lm['shoulder.r'][2] + FA], pole: [0, -1, 0] } });
const end = { ...body(hold), reach: arm(lmH) };
// start: lying on the side, hips on the floor (hip landmark at the floor + pelvis half width), forearm already placed
const SQ = newton({ y: HQ.y - 0.1, roll: HQ.roll + 8, lat: 0 }, q => { const lm = landmarksOf(body({ ...q, x: X }), H);
  return [lm['shoulder.r'][1] - SH_Y, lm['ankle.r'][1] - ANKLE_Y, lm['hip.r'][1] - 0.10]; });
const start = { ...body({ ...SQ, x: X }), reach: arm(landmarksOf(body({ ...SQ, x: X }), H)) };
// Mistake: hips sag 9 cm, shoulders and feet stay put (trunk side-bend + leg abduction)
const MQ = newton({ y: HQ.y - 0.05, x: X, roll: HQ.roll, lat: 0, abd: 0 }, q => { const lm = landmarksOf(body(q), H), hp = landmarks2(lm);
  return [lm['shoulder.r'][0] - lmH['shoulder.r'][0], lm['shoulder.r'][1] - lmH['shoulder.r'][1], lm['ankle.r'][0] - lmH['ankle.r'][0], lm['ankle.r'][1] - lmH['ankle.r'][1], hp - (landmarks2(lmH) - 0.09)]; });
function landmarks2(lm) { return lm['hip.r'][1]; }
const mistakePose = { ...body(MQ), reach: end.reach };
export const info = { hold, SQ, MQ };
export default {
  id: 'side_plank', name: 'Side Plank', view: 'front', camera: { fit: true },
  poses: { start, end },
  equipment: [{ type: 'floor', from: -1.0, to: 1.0 }],
  startParts: ['trunk', 'leg.l', 'leg.r', 'arm.l'],
  ghosts: { count: 1 },
  trace: { point: 'hip.r', trim: [8, 8] },
  callouts: [
    { key: 'line', text: 'Straight line', anchor: 'hip.l', cue: 'Head, hips and feet in one straight line.' },
    { key: 'elbow', text: 'Elbow under<br>shoulder', anchor: 'elbow.r', cue: 'Elbow straight under the shoulder.' },
  ],
  mistake: { pose: mistakePose, tells: [{ key: 'sag', text: 'Hips sag', anchor: { at: 'hip.r', pose: 'mistake' }, cue: 'The hips drop toward the floor.' }] },
  alt: 'Side plank, front view (engine spike).',
};
