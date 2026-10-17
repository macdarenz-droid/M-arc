// ENGINE SPIKE (do not merge): Russian twist, FRONT view, with E-R5 trunk.yaw. Seated on the floor, leaning back 40 deg,
// knees bent, heels down; the chest turns side to side (thorax yaw +-35) with the hands together holding a ball in
// front of the chest, so the hands travel with the chest. Mistake (the plan's rejected arms-only twist): chest square,
// arms swing the ball to the side.
import { landmarksOf, rootOnSeat } from '../../engine.mjs';
import { add, sub, mul, mid, axes } from './util.mjs';
const H = 1.75, TILT = -40, YAW = 35;
const feet = { l: { at: [0.12, 0, 0.52], toe: [0.1, 0, 1] }, r: { at: [-0.12, 0, 0.52], toe: [-0.1, 0, 1] } };
const base = yaw => ({ root: { at: rootOnSeat([0, 0, 0], TILT, H), tilt: TILT }, trunk: { flex: 0, yaw }, neck: 10, plant: feet, scap: { pro: 2 } });
const ballAt = (lm, chestYaw = null) => { const a = axes(lm); return add(add(mid(lm['shoulder.l'], lm['shoulder.r']), mul(a.up, -0.26)), mul(a.fwd, 0.30)); };
const hands = (lm, c) => { const a = axes(lm); return { l: { at: add(c, mul(a.lat, 0.07)), pole: add(mul(a.lat, 1), [0, -0.6, 0]) }, r: { at: add(c, mul(a.lat, -0.07)), pole: add(mul(a.lat, -1), [0, -0.6, 0]) } }; };
const pose = yaw => { const b = base(yaw), lm = landmarksOf(b, H); return { ...b, reach: hands(lm, ballAt(lm)) }; };
const start = pose(YAW), end = pose(-YAW), via = [pose(0)];
// Mistake: chest square (yaw 0), the hands carried to where the correct end pose has them
const lmE = landmarksOf(end, H), b0 = base(0), lm0 = landmarksOf(b0, H);
const mistakePose = { trunk: { flex: 0, yaw: 0 }, reach: hands(lm0, ballAt(lmE)) };
export default {
  id: 'russian_twist', name: 'Russian Twist', view: 'front', camera: { fit: true, maxScale: 1.4, pitch: Number(process.env.SPIKE_TWIST_PITCH ?? 20) }, torso: 'volume',
  poses: { start, via, end },
  equipment: [{ type: 'floor', from: [-0.8, 0, 0.3], to: [0.8, 0, 0.3] },
    lm => ({ type: 'box', from: sub(mid(lm['grip.l'], lm['grip.r']), [0.1, 0.1, 0.1]), to: add(mid(lm['grip.l'], lm['grip.r']), [0.1, 0.1, 0.1]), part: 'ball', z: 'front' })].slice(0, 1),
  startParts: ['arm.l', 'arm.r', 'trunk'],
  ghosts: { count: 2, parts: ['arm.l', 'arm.r', 'trunk'] },
  trace: { point: 'grip.l', trim: [10, 10] },
  callouts: [
    { key: 'chest', text: 'Turn the chest', anchor: 'shoulder.r', cue: 'The chest turns with the hands.' },
    { key: 'lean', text: 'Lean back', anchor: 'neck', cue: 'Lean back with a long spine.' },
  ],
  mistake: { pose: mistakePose, tells: [{ key: 'arms', text: 'Arms only', anchor: { at: 'grip.r', pose: 'mistake' }, cue: 'The arms swing while the chest stays square.' }] },
  alt: 'Russian twist, front view (engine spike).',
};
